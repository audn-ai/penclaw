import { n as createLazyPromise } from "./lazy-promise-EhsWch5m.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/infra/env.ts
let log = null;
const loadLog = createLazyPromise(
  () =>
    import("./subsystem-N_s3knpB.js").then(({ createSubsystemLogger }) =>
      createSubsystemLogger("env"),
    ),
  { cacheRejections: true },
);
const loggedEnv = /* @__PURE__ */ new Set();
const ENV_NORMALIZATION_KEY_GROUPS = [["ZAI_API_KEY", "Z_AI_API_KEY"]];
async function getLog() {
  if (!log) log = await loadLog();
  return log;
}
function formatEnvValue(value, redact) {
  if (redact) return "<redacted>";
  const singleLine = value.replace(/\s+/g, " ").trim();
  if (singleLine.length <= 160) return singleLine;
  return `${truncateUtf16Safe(singleLine, 160)}…`;
}
/** Logs an accepted env option once, with optional redaction for sensitive values. */
function logAcceptedEnvOption(option) {
  if (process.env.VITEST || false) return;
  if (loggedEnv.has(option.key)) return;
  const rawValue = option.value ?? process.env[option.key];
  if (!rawValue || !rawValue.trim()) return;
  loggedEnv.add(option.key);
  getLog()
    .then((logger) => {
      logger.info(
        `env: ${option.key}=${formatEnvValue(rawValue, option.redact)} (${option.description})`,
      );
    })
    .catch(() => {});
}
/** Normalizes the legacy Z_AI_API_KEY spelling into the canonical ZAI_API_KEY env var. */
function normalizeZaiEnv(env = process.env) {
  if (!env.ZAI_API_KEY?.trim() && env.Z_AI_API_KEY?.trim()) env.ZAI_API_KEY = env.Z_AI_API_KEY;
}
/** Expands env keys to include aliases that process-wide normalization treats as equivalent. */
function expandEnvNormalizationKeys(keys) {
  const expanded = /* @__PURE__ */ new Set();
  for (const key of keys)
    for (const normalizedKey of resolveEnvNormalizationKeys(key)) expanded.add(normalizedKey);
  return expanded;
}
/** Resolves one env key to its canonical-first runtime normalization group. */
function resolveEnvNormalizationKeys(key) {
  const normalizedKey = process.platform === "win32" ? key.toUpperCase() : key;
  return (
    ENV_NORMALIZATION_KEY_GROUPS.find((group) =>
      group.some((candidate) => candidate === normalizedKey),
    ) ?? [normalizedKey]
  );
}
/** Interprets common human/operator truthy env strings. */
function isTruthyEnvValue(value) {
  if (typeof value !== "string") return false;
  switch (normalizeLowercaseStringOrEmpty(value)) {
    case "1":
    case "on":
    case "true":
    case "yes":
      return true;
    default:
      return false;
  }
}
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
function isVitestRuntimeEnv(env = process.env) {
  return (
    env.VITEST === "true" ||
    env.VITEST === "1" ||
    env.VITEST_POOL_ID !== void 0 ||
    env.VITEST_WORKER_ID !== void 0 ||
    env.NODE_ENV === "test"
  );
}
/** Applies process-wide env normalization before runtime configuration is read. */
function normalizeEnv() {
  normalizeZaiEnv(process.env);
}
//#endregion
export {
  normalizeEnv as a,
  logAcceptedEnvOption as i,
  isTruthyEnvValue as n,
  normalizeZaiEnv as o,
  isVitestRuntimeEnv as r,
  resolveEnvNormalizationKeys as s,
  expandEnvNormalizationKeys as t,
};
