//#region packages/gateway-client/src/timeouts.ts
function parseStrictPositiveInteger(value) {
  const trimmed = value.trim();
  if (!/^\+?\d+$/u.test(trimmed)) return;
  const parsed = Number(trimmed);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : void 0;
}
/** Maximum delay Node timers can represent without overflow warnings. */
const MAX_SAFE_TIMEOUT_DELAY_MS = 2147483647;
/** Default server-side window for gateway preauth handshakes. */
const DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS = 15e3;
/** Default maximum client watchdog delay, aligned with the preauth server timeout. */
const MAX_CONNECT_CHALLENGE_TIMEOUT_MS = DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
/** Clamps arbitrary timer delays to Node's safe range and an optional floor. */
function resolveSafeTimeoutDelayMs(delayMs, opts) {
  const rawMinMs = opts?.minMs ?? 1;
  const minMs = Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(0, Number.isFinite(rawMinMs) ? Math.floor(rawMinMs) : 1),
  );
  return Math.min(
    MAX_SAFE_TIMEOUT_DELAY_MS,
    Math.max(minMs, Number.isFinite(delayMs) ? Math.floor(delayMs) : minMs),
  );
}
/** Adds grace time while preserving safe timer bounds if inputs overflow or are invalid. */
function addSafeTimeoutDelayGraceMs(delayMs, graceMs, opts) {
  if (!Number.isFinite(delayMs) || !Number.isFinite(graceMs))
    return resolveSafeTimeoutDelayMs(MAX_SAFE_TIMEOUT_DELAY_MS, opts);
  const withGrace = delayMs + graceMs;
  return resolveSafeTimeoutDelayMs(
    Number.isFinite(withGrace) ? withGrace : MAX_SAFE_TIMEOUT_DELAY_MS,
    opts,
  );
}
/** Resolves optional timeout values through a fallback and safe timer clamp. */
function resolveFiniteTimeoutDelayMs(delayMs, fallbackMs, opts) {
  return resolveSafeTimeoutDelayMs(
    typeof delayMs === "number" && Number.isFinite(delayMs) ? delayMs : fallbackMs,
    opts,
  );
}
/** Clamps connect challenge watchdog timeouts to the gateway-supported range. */
function clampConnectChallengeTimeoutMs(
  timeoutMs,
  maxTimeoutMs = MAX_CONNECT_CHALLENGE_TIMEOUT_MS,
) {
  return Math.max(250, Math.min(Math.max(250, maxTimeoutMs), timeoutMs));
}
/** Reads the connect challenge watchdog override from the process environment. */
function getConnectChallengeTimeoutMsFromEnv(env = process.env) {
  const raw = env.OPENCLAW_CONNECT_CHALLENGE_TIMEOUT_MS;
  if (raw) {
    const parsed = parseStrictPositiveInteger(raw);
    if (parsed !== void 0) return resolveSafeTimeoutDelayMs(parsed);
  }
}
function normalizePositiveTimeoutMs(timeoutMs) {
  return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0
    ? resolveSafeTimeoutDelayMs(timeoutMs)
    : void 0;
}
/** Resolves the client watchdog timeout using explicit, env, then preauth defaults. */
function resolveConnectChallengeTimeoutMs(timeoutMs, params) {
  const configuredPreauthTimeoutMs = resolvePreauthHandshakeTimeoutMs({
    env: params?.env,
    configuredTimeoutMs: params?.configuredTimeoutMs,
  });
  const maxTimeoutMs = Math.max(DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS, configuredPreauthTimeoutMs);
  if (typeof timeoutMs === "number" && Number.isFinite(timeoutMs))
    return clampConnectChallengeTimeoutMs(timeoutMs, maxTimeoutMs);
  const envOverride = getConnectChallengeTimeoutMsFromEnv(params?.env);
  if (envOverride !== void 0)
    return clampConnectChallengeTimeoutMs(envOverride, Math.max(maxTimeoutMs, envOverride));
  return clampConnectChallengeTimeoutMs(configuredPreauthTimeoutMs, maxTimeoutMs);
}
/** Resolves the server preauth timeout from env, explicit config, or default. */
function resolvePreauthHandshakeTimeoutMs(params) {
  const env = params?.env ?? process.env;
  const configuredTimeout =
    env.OPENCLAW_HANDSHAKE_TIMEOUT_MS || (env.VITEST && env.OPENCLAW_TEST_HANDSHAKE_TIMEOUT_MS);
  if (configuredTimeout) {
    const parsed = parseStrictPositiveInteger(configuredTimeout);
    if (parsed !== void 0) return resolveSafeTimeoutDelayMs(parsed);
  }
  const configured = normalizePositiveTimeoutMs(params?.configuredTimeoutMs);
  if (configured !== void 0) return configured;
  return DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
}
//#endregion
export {
  resolveFiniteTimeoutDelayMs as a,
  resolveConnectChallengeTimeoutMs as i,
  MAX_SAFE_TIMEOUT_DELAY_MS as n,
  resolvePreauthHandshakeTimeoutMs as o,
  addSafeTimeoutDelayGraceMs as r,
  resolveSafeTimeoutDelayMs as s,
  DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS as t,
};
