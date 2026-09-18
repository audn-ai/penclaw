import { i as isMalformedApiKeyInput } from "./credential-state-DvOWxJSx.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { t as resolveEnvApiKey } from "./model-auth-env-DLe5znyS.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { t as resolveSecretInputModeForEnvSelection } from "./provider-auth-mode-7FOSjRoY.js";
import {
  n as promptSecretRefForSetup,
  r as resolveRefFallbackInput,
  t as extractEnvVarFromSourceLabel,
} from "./provider-auth-ref-BCUXVZz5.js";
import {
  f as normalizeStringifiedOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/provider-auth-input.ts
/** Normalizes provider auth input metadata collected from plugin setup flows. */
const DEFAULT_KEY_PREVIEW = {
  head: 4,
  tail: 4,
};
/** Normalizes pasted API-key input, including shell assignment forms. */
function normalizeApiKeyInput(raw) {
  const trimmed = normalizeStringifiedOptionalString(raw) ?? "";
  if (!trimmed) return "";
  const normalizedPaste = normalizeSecretInput(trimmed);
  const assignmentMatch = normalizedPaste.match(
    /^(?:export\s+)?[A-Za-z_][A-Za-z0-9_]*\s*=\s*(.+)$/,
  );
  const valuePart = assignmentMatch
    ? expectDefined(assignmentMatch[1], "assignment match capture group 1").trim()
    : normalizedPaste;
  const withoutSemicolon = valuePart.endsWith(";") ? valuePart.slice(0, -1).trim() : valuePart;
  return normalizeSecretInput(
    withoutSemicolon.length >= 2 &&
      ((withoutSemicolon.startsWith('"') && withoutSemicolon.endsWith('"')) ||
        (withoutSemicolon.startsWith("'") && withoutSemicolon.endsWith("'")) ||
        (withoutSemicolon.startsWith("`") && withoutSemicolon.endsWith("`")))
      ? withoutSemicolon.slice(1, -1)
      : withoutSemicolon,
  );
}
/** Validates required API-key input for setup prompts. */
const validateApiKeyInput = (value) => {
  const normalized = normalizeApiKeyInput(value);
  if (!normalized) return "Required";
  if (isMalformedApiKeyInput(normalized))
    return "Paste the API key value, not an OpenClaw onboarding command.";
};
/** Formats a redacted API-key preview for setup confirmation prompts. */
function formatApiKeyPreview(raw, opts = {}) {
  const trimmed = raw.trim();
  if (!trimmed) return "…";
  const head = opts.head ?? DEFAULT_KEY_PREVIEW.head;
  const tail = opts.tail ?? DEFAULT_KEY_PREVIEW.tail;
  if (trimmed.length <= head + tail) {
    const shortHead = Math.min(2, trimmed.length);
    const shortTail = Math.min(2, trimmed.length - shortHead);
    if (shortTail <= 0) return `${trimmed.slice(0, shortHead)}…`;
    return `${trimmed.slice(0, shortHead)}…${trimmed.slice(-shortTail)}`;
  }
  return `${trimmed.slice(0, head)}…${trimmed.slice(-tail)}`;
}
/** Normalizes a token-provider selector from CLI/options input. */
function normalizeTokenProviderInput(tokenProvider) {
  return normalizeOptionalLowercaseString(tokenProvider);
}
/** Normalizes secret input mode values accepted by provider setup. */
function normalizeSecretInputModeInput(secretInputMode) {
  const normalized = normalizeOptionalLowercaseString(secretInputMode);
  if (normalized === "plaintext" || normalized === "ref") return normalized;
}
/** Applies a CLI-provided API key when its provider selector matches this auth method. */
async function maybeApplyApiKeyFromOption(params) {
  const tokenProvider = normalizeTokenProviderInput(params.tokenProvider);
  const expectedProviders = params.expectedProviders
    .map((provider) => normalizeTokenProviderInput(provider))
    .filter((provider) => Boolean(provider));
  if (!params.token || !tokenProvider || !expectedProviders.includes(tokenProvider)) return;
  const apiKey = params.normalize(params.token);
  const validationError = params.validate?.(apiKey);
  if (validationError) throw new Error(validationError);
  await params.setCredential(apiKey, params.secretInputMode);
  return apiKey;
}
/** Resolves an API key from CLI options first, then environment or prompt fallback. */
async function ensureApiKeyFromOptionEnvOrPrompt(params) {
  const optionApiKey = await maybeApplyApiKeyFromOption({
    token: params.token,
    tokenProvider: params.tokenProvider,
    secretInputMode: params.secretInputMode,
    expectedProviders: params.expectedProviders,
    normalize: params.normalize,
    validate: params.validate,
    setCredential: params.setCredential,
  });
  if (optionApiKey) return optionApiKey;
  if (params.noteMessage) await params.prompter.note(params.noteMessage, params.noteTitle);
  return await ensureApiKeyFromEnvOrPrompt({
    config: params.config,
    env: params.env,
    provider: params.provider,
    envLabel: params.envLabel,
    promptMessage: params.promptMessage,
    normalize: params.normalize,
    validate: params.validate,
    prompter: params.prompter,
    secretInputMode: params.secretInputMode,
    setCredential: params.setCredential,
  });
}
/** Resolves an API key from environment or interactive prompt and records the chosen secret mode. */
async function ensureApiKeyFromEnvOrPrompt(params) {
  const selectedMode = await resolveSecretInputModeForEnvSelection({
    prompter: params.prompter,
    explicitMode: params.secretInputMode,
  });
  const env = params.env ?? process.env;
  const envKey = resolveEnvApiKey(params.provider, env);
  if (selectedMode === "ref") {
    if (typeof params.prompter.select !== "function") {
      const fallback = resolveRefFallbackInput({
        config: params.config,
        provider: params.provider,
        preferredEnvVar: envKey?.source ? extractEnvVarFromSourceLabel(envKey.source) : void 0,
        env,
      });
      await params.setCredential(fallback.ref, selectedMode);
      return fallback.resolvedValue;
    }
    const resolved = await promptSecretRefForSetup({
      provider: params.provider,
      config: params.config,
      prompter: params.prompter,
      preferredEnvVar: envKey?.source ? extractEnvVarFromSourceLabel(envKey.source) : void 0,
      env,
    });
    await params.setCredential(resolved.ref, selectedMode);
    return resolved.resolvedValue;
  }
  if (envKey && selectedMode === "plaintext") {
    if (
      await params.prompter.confirm({
        message: `Use existing ${params.envLabel} (${envKey.source}, ${formatApiKeyPreview(envKey.apiKey)})?`,
        initialValue: true,
      })
    ) {
      await params.setCredential(envKey.apiKey, selectedMode);
      return envKey.apiKey;
    }
  }
  const key = await params.prompter.text({
    message: params.promptMessage,
    placeholder: "API key",
    validate: params.validate,
    sensitive: true,
  });
  const apiKey = params.normalize(key ?? "");
  await params.setCredential(apiKey, selectedMode);
  return apiKey;
}
//#endregion
export {
  normalizeSecretInputModeInput as a,
  normalizeApiKeyInput as i,
  ensureApiKeyFromOptionEnvOrPrompt as n,
  normalizeTokenProviderInput as o,
  formatApiKeyPreview as r,
  validateApiKeyInput as s,
  ensureApiKeyFromEnvOrPrompt as t,
};
