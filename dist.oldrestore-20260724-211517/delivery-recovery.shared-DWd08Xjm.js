import { a as isPlatformMessageNotDispatchedError } from "./deliver-types-eQDro8Up.js";
import { n as extractErrorCode, t as collectErrorGraphCandidates } from "./errors-BoHeli7m.js";
import { n as getRetryAttemptErrors } from "./retry-CcVvEFm0.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { r as computeBackoffSchedule } from "./src-Dqmh2693.js";
//#region src/infra/delivery-recovery.shared.ts
const RECOVERY_BACKOFF_MS = [5e3, 25e3, 12e4, 6e5];
const RECOVERY_REPLAY_SPACING_MS = 250;
const PRE_CONNECT_ERROR_CODES = /* @__PURE__ */ new Set([
  "ECONNREFUSED",
  "ENOTFOUND",
  "EAI_AGAIN",
  "ENETDOWN",
  "ENETUNREACH",
  "EHOSTUNREACH",
]);
const TRANSPORT_ERROR_CODE_RE =
  /^(?:E(?:AI_|CONN|NET|HOST|ADDR|PIPE|TIMEDOUT|SOCKET)|UND_ERR_|ERR_(?:NETWORK|HTTP2|QUIC|TLS|SSL))/;
const UNPROVEN_ERROR_BRANCH = "unproven delivery error branch";
function preserveProofBranches(branches) {
  return branches?.map((branch) => branch ?? UNPROVEN_ERROR_BRANCH) ?? [];
}
function isProvenPreConnectCandidate(candidate) {
  const code = extractErrorCode(candidate)?.trim().toUpperCase();
  if (code === "UND_ERR_CONNECT_TIMEOUT" || code === "UND_ERR_DNS_RESOLVE_FAILED") return true;
  if (!code || !PRE_CONNECT_ERROR_CODES.has(code) || !candidate || typeof candidate !== "object")
    return false;
  const syscall = candidate.syscall;
  return syscall === "connect" || syscall === "getaddrinfo";
}
function nestedErrorCandidates(current) {
  const retryBranches = preserveProofBranches(getRetryAttemptErrors(current));
  if (isPlatformMessageNotDispatchedError(current) || isProvenPreConnectCandidate(current))
    return retryBranches;
  const nestedObjects = [current.cause, current.original, current.error, current.reason].filter(
    (candidate) => candidate !== null && typeof candidate === "object",
  );
  const aggregateBranches = Array.isArray(current.errors)
    ? preserveProofBranches(current.errors)
    : [];
  return [...retryBranches, ...aggregateBranches, ...nestedObjects];
}
function isProvenDeliveryNotSentError(err) {
  let foundNotSentProof = false;
  for (const candidate of collectErrorGraphCandidates(err, nestedErrorCandidates)) {
    const code = extractErrorCode(candidate)?.trim().toUpperCase();
    if (isPlatformMessageNotDispatchedError(candidate) || isProvenPreConnectCandidate(candidate)) {
      foundNotSentProof = true;
      continue;
    }
    const nested =
      candidate && typeof candidate === "object" ? nestedErrorCandidates(candidate) : [];
    const isPreConnectAggregateSummary =
      candidate !== null &&
      typeof candidate === "object" &&
      Array.isArray(candidate.errors) &&
      code !== void 0 &&
      PRE_CONNECT_ERROR_CODES.has(code);
    if (
      nested.length === 0 ||
      (code &&
        !isPreConnectAggregateSummary &&
        (PRE_CONNECT_ERROR_CODES.has(code) || TRANSPORT_ERROR_CODE_RE.test(code)))
    )
      return false;
  }
  return foundNotSentProof;
}
function computeBackoffMs(retryCount) {
  return computeBackoffSchedule(RECOVERY_BACKOFF_MS, retryCount);
}
function getErrnoCode(err) {
  return err && typeof err === "object" && "code" in err ? String(err.code) : null;
}
function claimRecoveryEntry(entriesInProgress, entryId) {
  if (entriesInProgress.has(entryId)) return false;
  entriesInProgress.add(entryId);
  return true;
}
function releaseRecoveryEntry(entriesInProgress, entryId) {
  entriesInProgress.delete(entryId);
}
function createRecoveryReplayPacer() {
  let lastReplayStartedAt = 0;
  let waitQueue = Promise.resolve();
  return {
    async wait(deadlineMs) {
      let releaseWaiter = () => {};
      const previousWaiter = waitQueue;
      waitQueue = new Promise((resolve) => {
        releaseWaiter = resolve;
      });
      await previousWaiter;
      try {
        const now = Date.now();
        if (deadlineMs !== void 0 && now >= deadlineMs) return "deadline-exceeded";
        const elapsedMs = now - lastReplayStartedAt;
        const waitMs = elapsedMs < 0 ? 0 : Math.max(0, RECOVERY_REPLAY_SPACING_MS - elapsedMs);
        if (waitMs > 0) {
          const remainingBudgetMs = deadlineMs === void 0 ? waitMs : Math.max(0, deadlineMs - now);
          await sleep(Math.min(waitMs, remainingBudgetMs));
        }
        if (deadlineMs !== void 0 && Date.now() >= deadlineMs) return "deadline-exceeded";
        lastReplayStartedAt = Date.now();
        return "ready";
      } finally {
        releaseWaiter();
      }
    },
  };
}
//#endregion
export {
  isProvenDeliveryNotSentError as a,
  getErrnoCode as i,
  computeBackoffMs as n,
  releaseRecoveryEntry as o,
  createRecoveryReplayPacer as r,
  claimRecoveryEntry as t,
};
