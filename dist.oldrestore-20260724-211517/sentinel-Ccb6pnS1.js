import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "node:crypto";
import { g as registerSecretValueForRedaction } from "./redact-CUe6Oey5.js";
//#region src/secrets/sentinel.ts
const SECRET_SENTINEL_PREFIX = "oc-sent-v2.";
const SECRET_SENTINEL_SUFFIX = ".end";
const SECRET_SENTINEL_SOURCE = "oc-sent-v2\\.[A-Za-z0-9_-]+\\.end";
const SECRET_SENTINEL_CIPHER = "aes-256-gcm";
const SECRET_SENTINEL_NONCE_BYTES = 12;
const SECRET_SENTINEL_SCOPE_BYTES = 8;
const SECRET_SENTINEL_HEADER_BYTES = 36;
const SECRET_SENTINEL_PATTERN = new RegExp(SECRET_SENTINEL_SOURCE, "g");
const secretSentinelKeys = randomBytes(64);
const secretSentinelCipherKey = secretSentinelKeys.subarray(0, 32);
const secretSentinelNonceKey = secretSentinelKeys.subarray(32);
function secretSentinelsEnabled(env = process.env) {
  const configured = env.OPENCLAW_SECRET_SENTINELS?.trim().toLowerCase();
  return configured !== "off" && configured !== "0" && configured !== "false";
}
function looksLikeSecretSentinel(value) {
  return new RegExp(`^${SECRET_SENTINEL_SOURCE}$`).test(value);
}
function containsSecretSentinel(value) {
  return value.includes(SECRET_SENTINEL_PREFIX);
}
function secretSentinelScope(label) {
  return createHash("sha256").update(label).digest().subarray(0, SECRET_SENTINEL_SCOPE_BYTES);
}
/** Seals a secret into authenticated ciphertext that only this process can resolve. */
function mintSecretSentinel(value, meta) {
  registerSecretValueForRedaction(value);
  if (!secretSentinelsEnabled()) return value;
  const scope = secretSentinelScope(meta.label);
  const nonce = createHmac("sha256", secretSentinelNonceKey)
    .update(scope)
    .update(value)
    .digest()
    .subarray(0, SECRET_SENTINEL_NONCE_BYTES);
  const cipher = createCipheriv(SECRET_SENTINEL_CIPHER, secretSentinelCipherKey, nonce);
  cipher.setAAD(scope);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const sealed = Buffer.concat([scope, nonce, cipher.getAuthTag(), ciphertext]);
  return `${SECRET_SENTINEL_PREFIX}${sealed.toString("base64url")}${SECRET_SENTINEL_SUFFIX}`;
}
/** Opens a process-local sentinel and rejects malformed or tampered values. */
function resolveSecretSentinel(sentinel) {
  if (!looksLikeSecretSentinel(sentinel)) return;
  try {
    const encoded = sentinel.slice(11, -4);
    const sealed = Buffer.from(encoded, "base64url");
    if (sealed.length < SECRET_SENTINEL_HEADER_BYTES) return;
    const scope = sealed.subarray(0, SECRET_SENTINEL_SCOPE_BYTES);
    const nonce = sealed.subarray(SECRET_SENTINEL_SCOPE_BYTES, 20);
    const tag = sealed.subarray(20, 36);
    const ciphertext = sealed.subarray(SECRET_SENTINEL_HEADER_BYTES);
    const decipher = createDecipheriv(SECRET_SENTINEL_CIPHER, secretSentinelCipherKey, nonce);
    decipher.setAAD(scope);
    decipher.setAuthTag(tag);
    const value = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
    registerSecretValueForRedaction(value);
    return value;
  } catch {
    return;
  }
}
/** Swaps every known sentinel substring and reports unknown sentinel-shaped values. */
function swapSecretSentinelsInText(text) {
  if (!containsSecretSentinel(text))
    return {
      text,
      unknown: [],
    };
  const unknown = /* @__PURE__ */ new Set();
  return {
    text: text.replace(new RegExp(SECRET_SENTINEL_SOURCE, "g"), (sentinel) => {
      const value = resolveSecretSentinel(sentinel);
      if (value === void 0) {
        unknown.add(sentinel);
        return sentinel;
      }
      return value;
    }),
    unknown: [...unknown],
  };
}
//#endregion
export {
  resolveSecretSentinel as a,
  mintSecretSentinel as i,
  containsSecretSentinel as n,
  swapSecretSentinelsInText as o,
  looksLikeSecretSentinel as r,
  SECRET_SENTINEL_PATTERN as t,
};
