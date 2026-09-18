import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
//#region src/agents/auth-profiles/oauth-refresh-failure.ts
/**
 * OAuth refresh failure classification and operator hints.
 * Parses provider/reason codes from refresh failures and formats safe login
 * commands without trusting raw provider text.
 */
/** Error type that carries provider and classified OAuth refresh failure reason. */
var OAuthRefreshFailureError = class extends Error {
  constructor(params) {
    super(params.message, { cause: params.cause });
    this.name = "OAuthRefreshFailureError";
    this.provider = params.provider;
    this.profileId = params.profileId;
    this.reason = classifyOAuthRefreshFailureReason(params.message);
  }
};
const OAUTH_REFRESH_FAILURE_PROVIDER_RE = /OAuth token refresh failed for ([^:]+):/i;
const SAFE_PROVIDER_ID_RE = /^[a-z0-9][a-z0-9._-]*$/;
const CLAUDE_CLI_AUTH_FAILURE_RE =
  /\bclaude-cli\b.+?\b(failed to authenticate|401\s+invalid authentication credentials)\b/is;
function isClaudeCliExpiredOAuthMessage(message) {
  return CLAUDE_CLI_AUTH_FAILURE_RE.test(message);
}
function readStructuredClaudeCliAuthFailure(err) {
  if (!err || typeof err !== "object") return null;
  const candidate = err;
  if (
    candidate.name !== "FailoverError" ||
    candidate.provider !== "claude-cli" ||
    candidate.reason !== "auth" ||
    candidate.status !== 401
  )
    return null;
  return candidate;
}
function isStructuredClaudeCliExpiredOAuthFailure(err) {
  const failure = readStructuredClaudeCliAuthFailure(err);
  if (!failure) return false;
  const rawError = typeof failure.rawError === "string" ? failure.rawError : "";
  const lower = `${err instanceof Error ? err.message : ""}\n${rawError}`.toLowerCase();
  return (
    lower.includes("failed to authenticate") || lower.includes("invalid authentication credentials")
  );
}
function isOAuthRefreshFailureMessage(message) {
  const lower = message.toLowerCase();
  return (
    lower.includes("oauth token refresh failed") ||
    lower.includes("access token could not be refreshed") ||
    lower.includes("authentication session could not be refreshed automatically") ||
    isClaudeCliExpiredOAuthMessage(message)
  );
}
function extractOAuthRefreshFailureProvider(message) {
  if (isClaudeCliExpiredOAuthMessage(message)) return "claude-cli";
  const provider = message.match(OAUTH_REFRESH_FAILURE_PROVIDER_RE)?.[1]?.trim();
  return provider && provider.length > 0 ? provider : null;
}
function sanitizeOAuthRefreshFailureProvider(provider) {
  const normalized = normalizeProviderId(
    provider ? sanitizeForLog(provider).replaceAll("`", "").trim() : "",
  );
  return normalized && SAFE_PROVIDER_ID_RE.test(normalized) ? normalized : null;
}
function sanitizeOAuthRefreshFailureProfileId(profileId) {
  return (profileId ? sanitizeForLog(profileId).trim() : "") || null;
}
function quoteShellArg(value) {
  return `'${process.platform === "win32" ? value.replaceAll("'", "''") : value.replaceAll("'", "'\\''")}'`;
}
/** Wrap a rendered login command in a Markdown code span that survives embedded backticks. */
function formatOAuthRefreshFailureLoginCommandMarkdown(command) {
  return formatInlineCodeSpan(command);
}
/** Classify a raw OAuth refresh failure message into a stable reason code. */
function classifyOAuthRefreshFailureReason(message) {
  const lower = message.toLowerCase();
  if (lower.includes("refresh_token_reused")) return "refresh_token_reused";
  if (lower.includes("invalid_grant")) return "invalid_grant";
  if (lower.includes("token_invalidated")) return "token_invalidated";
  if (lower.includes("signing in again") || lower.includes("sign in again")) return "sign_in_again";
  if (lower.includes("invalid refresh token")) return "invalid_refresh_token";
  if (lower.includes("expired or revoked") || lower.includes("revoked")) return "revoked";
  if (isClaudeCliExpiredOAuthMessage(message)) return "revoked";
  return null;
}
/** Classify provider/reason from a user-facing OAuth refresh failure message. */
function classifyOAuthRefreshFailure(message) {
  if (!isOAuthRefreshFailureMessage(message)) return null;
  return {
    provider: sanitizeOAuthRefreshFailureProvider(extractOAuthRefreshFailureProvider(message)),
    reason: classifyOAuthRefreshFailureReason(message),
  };
}
/** Classify provider/reason from the structured OAuth refresh failure error. */
function classifyOAuthRefreshFailureError(err) {
  const seen = /* @__PURE__ */ new Set();
  let candidate = err;
  while (candidate && typeof candidate === "object") {
    if (isStructuredClaudeCliExpiredOAuthFailure(candidate))
      return {
        provider: "claude-cli",
        reason: "revoked",
      };
    if (candidate instanceof OAuthRefreshFailureError) {
      const profileId = sanitizeOAuthRefreshFailureProfileId(candidate.profileId);
      return {
        provider: sanitizeOAuthRefreshFailureProvider(candidate.provider),
        ...(profileId ? { profileId } : {}),
        reason: candidate.reason,
      };
    }
    if (seen.has(candidate)) return null;
    seen.add(candidate);
    candidate = candidate.cause;
  }
  return null;
}
/** Build the login command operators should run after OAuth refresh failure. */
function buildOAuthRefreshFailureLoginCommand(provider, options) {
  const sanitizedProvider = sanitizeOAuthRefreshFailureProvider(provider);
  const sanitizedProfileId = sanitizeOAuthRefreshFailureProfileId(options?.profileId);
  if (sanitizedProvider === "claude-cli")
    return `${formatCliCommand("claude auth login")} && ${formatCliCommand(sanitizedProfileId ? `openclaw models auth login --provider anthropic --method cli --profile-id ${quoteShellArg(sanitizedProfileId)}` : "openclaw models auth login --provider anthropic --method cli")}`;
  return sanitizedProvider
    ? formatCliCommand(
        sanitizedProfileId
          ? `openclaw models auth login --provider ${sanitizedProvider} --profile-id ${quoteShellArg(sanitizedProfileId)}`
          : `openclaw models auth login --provider ${sanitizedProvider}`,
      )
    : formatCliCommand("openclaw models auth login");
}
//#endregion
export {
  classifyOAuthRefreshFailureReason as a,
  classifyOAuthRefreshFailureError as i,
  buildOAuthRefreshFailureLoginCommand as n,
  formatOAuthRefreshFailureLoginCommandMarkdown as o,
  classifyOAuthRefreshFailure as r,
  OAuthRefreshFailureError as t,
};
