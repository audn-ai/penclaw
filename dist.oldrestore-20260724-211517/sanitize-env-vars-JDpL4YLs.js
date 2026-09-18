import { r as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DGhQ40qh.js";
import { n as isInstalledPluginEnabled } from "./installed-plugin-index-lBfkb-7L.js";
import { r as listKnownSecretEnvVarNames } from "./provider-env-vars-BZiQzob_.js";
//#region src/agents/sandbox/sanitize-env-vars.ts
/**
 * Filters environment variables before they cross into sandbox runtimes.
 *
 * The default path blocks common credential names and suspicious value shapes while allowing
 * ordinary process environment needed for shells and Node-based tools.
 */
const BLOCKED_ENV_VAR_PATTERNS = [
  /^ANTHROPIC_API_KEY$/i,
  /^OPENAI_API_KEY$/i,
  /^GEMINI_API_KEY$/i,
  /^OPENROUTER_API_KEY$/i,
  /^MINIMAX_API_KEY$/i,
  /^ELEVENLABS_API_KEY$/i,
  /^SYNTHETIC_API_KEY$/i,
  /^TELEGRAM_BOT_TOKEN$/i,
  /^DISCORD_BOT_TOKEN$/i,
  /^SLACK_(BOT|APP)_TOKEN$/i,
  /^LINE_CHANNEL_SECRET$/i,
  /^LINE_CHANNEL_ACCESS_TOKEN$/i,
  /^OPENCLAW_GATEWAY_(TOKEN|PASSWORD)$/i,
  /^AWS_(SECRET_ACCESS_KEY|SECRET_KEY|SESSION_TOKEN)$/i,
  /^(GH|GITHUB)_TOKEN$/i,
  /^(AZURE|AZURE_OPENAI|COHERE|AI_GATEWAY|OPENROUTER)_API_KEY$/i,
  /_ADMIN_KEY$/i,
  /_?(API_KEY|TOKEN|PASSWORD|PRIVATE_KEY|SECRET)$/i,
];
const ALLOWED_ENV_VAR_PATTERNS = [
  /^LANG$/,
  /^LC_.*$/i,
  /^PATH$/i,
  /^HOME$/i,
  /^USER$/i,
  /^SHELL$/i,
  /^TERM$/i,
  /^TZ$/i,
  /^NODE_ENV$/i,
];
/** Returns a warning or block reason for environment values that look unsafe to forward. */
function validateEnvVarValue(value) {
  if (value.includes("\0")) return "Contains null bytes";
  if (value.length > 32768) return "Value exceeds maximum length";
  if (/^[A-Za-z0-9+/=]{80,}$/.test(value)) return "Value looks like base64-encoded credential data";
}
function matchesAnyPattern(value, patterns) {
  return patterns.some((pattern) => pattern.test(value));
}
/** Sanitizes inherited environment variables for automatic sandbox propagation. */
function sanitizeEnvVars(envVars, options = {}) {
  const allowed = {};
  const blocked = [];
  const warnings = [];
  const blockedPatterns = [...BLOCKED_ENV_VAR_PATTERNS, ...(options.customBlockedPatterns ?? [])];
  const allowedPatterns = [...ALLOWED_ENV_VAR_PATTERNS, ...(options.customAllowedPatterns ?? [])];
  const metadataSnapshot = getCurrentPluginMetadataSnapshot({
    env: envVars,
    allowScopedSnapshot: true,
    allowWorkspaceScopedSnapshot: true,
  });
  const activeMetadataSnapshot = metadataSnapshot
    ? {
        ...metadataSnapshot,
        plugins: metadataSnapshot.plugins.filter((plugin) =>
          isInstalledPluginEnabled(metadataSnapshot.index, plugin.id),
        ),
      }
    : void 0;
  const knownSecretNames = new Set(
    listKnownSecretEnvVarNames({
      env: envVars,
      metadataSnapshot: activeMetadataSnapshot,
    }).map((name) => name.trim().toUpperCase()),
  );
  for (const [rawKey, value] of Object.entries(envVars)) {
    const key = rawKey.trim();
    if (!key || value === void 0) continue;
    if (knownSecretNames.has(key.toUpperCase()) || matchesAnyPattern(key, blockedPatterns)) {
      blocked.push(key);
      continue;
    }
    if (options.strictMode && !matchesAnyPattern(key, allowedPatterns)) {
      blocked.push(key);
      continue;
    }
    const warning = validateEnvVarValue(value);
    if (warning) {
      if (warning === "Contains null bytes") {
        blocked.push(key);
        continue;
      }
      warnings.push(`${key}: ${warning}`);
    }
    allowed[key] = value;
  }
  return {
    allowed,
    blocked,
    warnings,
  };
}
/** Sanitizes env vars explicitly requested by config, preserving names but still validating values. */
function sanitizeExplicitSandboxEnvVars(envVars) {
  const allowed = {};
  const blocked = [];
  const warnings = [];
  for (const [rawKey, value] of Object.entries(envVars)) {
    const key = rawKey.trim();
    if (!key || value === void 0) continue;
    const warning = validateEnvVarValue(value);
    if (warning) {
      if (warning === "Contains null bytes") {
        blocked.push(key);
        continue;
      }
      warnings.push(`${key}: ${warning}`);
    }
    allowed[key] = value;
  }
  return {
    allowed,
    blocked,
    warnings,
  };
}
//#endregion
export { sanitizeExplicitSandboxEnvVars as n, validateEnvVarValue as r, sanitizeEnvVars as t };
