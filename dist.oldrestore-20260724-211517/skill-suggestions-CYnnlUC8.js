import { D as patchSessionEntry, S as loadSessionEntry } from "./session-accessor-PZVNxFCV.js";
//#region src/config/sessions/skill-suggestions.ts
function normalizeSignalHashes(signalHashes) {
  const normalized = [];
  for (const value of signalHashes) {
    const hash = value.trim();
    if (hash && !normalized.includes(hash)) normalized.push(hash);
  }
  return normalized;
}
function appendSignalHashes(entry, signalHashes) {
  const hashes = [...(entry.skillCaptureSignalHashes ?? [])];
  for (const hash of signalHashes) {
    const previousIndex = hashes.indexOf(hash);
    if (previousIndex >= 0) hashes.splice(previousIndex, 1);
    hashes.push(hash);
  }
  return hashes.slice(-32);
}
/** Reads recent durable-instruction fingerprints, oldest first. */
function readSessionSkillCaptureSignalHashes(options) {
  const entry = loadSessionEntry({
    ...options,
    readConsistency: "latest",
  });
  return entry ? [...(entry.skillCaptureSignalHashes ?? [])] : void 0;
}
/** Records processed durable-instruction fingerprints in a bounded newest-last ring. */
async function recordSessionSkillCaptureSignals(options) {
  const signalHashes = normalizeSignalHashes(options.signalHashes);
  if (signalHashes.length === 0) return false;
  const result = await patchSessionEntry(
    options,
    (entry) => ({ skillCaptureSignalHashes: appendSignalHashes(entry, signalHashes) }),
    { preserveActivity: true },
  );
  return Boolean(result);
}
/** Atomically claims one instruction group and returns only the hashes added by this claim. */
async function claimSessionSkillCaptureSignals(options) {
  const signalHash = options.signalHash.trim();
  const signalHashes = normalizeSignalHashes(options.signalHashes);
  if (!signalHash || signalHashes.length === 0) return;
  let claimedSignalHashes;
  return (await patchSessionEntry(
    options,
    (entry) => {
      if (entry.skillCaptureSignalHashes?.includes(signalHash)) return null;
      claimedSignalHashes = signalHashes.filter(
        (hash) => !entry.skillCaptureSignalHashes?.includes(hash),
      );
      return { skillCaptureSignalHashes: appendSignalHashes(entry, signalHashes) };
    },
    { preserveActivity: true },
  ))
    ? claimedSignalHashes
    : void 0;
}
/** Releases a failed claim so a later agent-end replay can retry the group. */
async function releaseSessionSkillCaptureSignals(options) {
  const released = new Set(normalizeSignalHashes(options.signalHashes));
  if (released.size === 0) return;
  await patchSessionEntry(
    options,
    (entry) => ({
      skillCaptureSignalHashes: entry.skillCaptureSignalHashes?.filter(
        (hash) => !released.has(hash),
      ),
    }),
    { preserveActivity: true },
  );
}
/** Records one suggestion without replacing an earlier unconsumed suggestion. */
async function recordSessionSkillSuggestion(options) {
  const skillName = options.skillName.trim();
  const signalHash = options.signalHash.trim();
  if (!skillName || !signalHash) return false;
  let recorded = false;
  const result = await patchSessionEntry(
    {
      agentId: options.agentId,
      env: options.env,
      sessionKey: options.sessionKey,
      storePath: options.storePath,
    },
    (entry) => {
      if (entry.pendingSkillSuggestion || entry.skillCaptureSignalHashes?.includes(signalHash))
        return null;
      const signalHashes = normalizeSignalHashes([
        ...(options.relatedSignalHashes ?? []),
        signalHash,
      ]);
      recorded = true;
      return {
        pendingSkillSuggestion: {
          skillName,
          detectedAt: options.detectedAt ?? Date.now(),
        },
        skillCaptureSignalHashes: appendSignalHashes(entry, signalHashes),
      };
    },
    { preserveActivity: true },
  );
  return Boolean(result && recorded);
}
/** Atomically clears and returns the suggestion owned by this interactive turn. */
async function consumeSessionSkillSuggestion(options) {
  let currentEntry;
  let suggestion;
  const entry =
    (await patchSessionEntry(
      options,
      (entry) => {
        currentEntry = entry;
        if (!entry.pendingSkillSuggestion) return null;
        suggestion = { ...entry.pendingSkillSuggestion };
        return { pendingSkillSuggestion: void 0 };
      },
      { preserveActivity: true },
    )) ?? currentEntry;
  return entry
    ? {
        entry,
        suggestion,
      }
    : void 0;
}
//#endregion
export {
  recordSessionSkillSuggestion as a,
  recordSessionSkillCaptureSignals as i,
  consumeSessionSkillSuggestion as n,
  releaseSessionSkillCaptureSignals as o,
  readSessionSkillCaptureSignalHashes as r,
  claimSessionSkillCaptureSignals as t,
};
