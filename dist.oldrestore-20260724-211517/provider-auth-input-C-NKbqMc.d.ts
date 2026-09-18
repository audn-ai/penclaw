import { i as WizardPrompter } from "./prompts-CWXx5gsI.js";
import { j as SecretInputMode } from "./types-Dz3ohwUV.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { d as SecretInput, h as SecretRef } from "./types.secrets-C15Z_eLX.js";

//#region src/plugins/provider-auth-ref.d.ts
/** Copy overrides used while prompting for provider secret-ref setup. */
type SecretRefSetupPromptCopy = {
  sourceMessage?: string;
  envVarMessage?: string;
  envVarPlaceholder?: string;
  envVarFormatError?: string;
  envVarMissingError?: (envVar: string) => string;
  noProvidersMessage?: string;
  envValidatedMessage?: (envVar: string) => string;
  providerValidatedMessage?: (provider: string, id: string, source: "file" | "exec") => string;
};
declare function promptSecretRefForSetup(params: {
  provider: string;
  config: OpenClawConfig;
  prompter: WizardPrompter;
  preferredEnvVar?: string;
  copy?: SecretRefSetupPromptCopy;
  env?: NodeJS.ProcessEnv;
}): Promise<{
  ref: SecretRef;
  resolvedValue: string;
}>;
//#endregion
//#region src/plugins/provider-auth-mode.d.ts
/** Prompt copy overrides for provider secret input mode selection. */
type SecretInputModePromptCopy = {
  modeMessage?: string;
  plaintextLabel?: string;
  plaintextHint?: string;
  refLabel?: string;
  refHint?: string;
};
/** Resolves provider secret input mode from explicit option or wizard selection. */
declare function resolveSecretInputModeForEnvSelection(params: {
  prompter: Pick<WizardPrompter, "select">;
  explicitMode?: SecretInputMode;
  copy?: SecretInputModePromptCopy;
}): Promise<SecretInputMode>;
//#endregion
//#region src/plugins/provider-auth-input.d.ts
/** Normalizes pasted API-key input, including shell assignment forms. */
declare function normalizeApiKeyInput(raw: string): string;
/** Validates required API-key input for setup prompts. */
declare const validateApiKeyInput: (
  value: string,
) => "Required" | "Paste the API key value, not an OpenClaw onboarding command." | undefined;
/** Formats a redacted API-key preview for setup confirmation prompts. */
declare function formatApiKeyPreview(
  raw: string,
  opts?: {
    head?: number;
    tail?: number;
  },
): string;
/** Normalizes secret input mode values accepted by provider setup. */
declare function normalizeSecretInputModeInput(
  secretInputMode: string | null | undefined,
): SecretInputMode | undefined;
/** Resolves an API key from CLI options first, then environment or prompt fallback. */
declare function ensureApiKeyFromOptionEnvOrPrompt(params: {
  token: string | undefined;
  tokenProvider: string | undefined;
  secretInputMode?: SecretInputMode;
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  expectedProviders: string[];
  provider: string;
  envLabel: string;
  promptMessage: string;
  normalize: (value: string) => string;
  validate: (value: string) => string | undefined;
  prompter: WizardPrompter;
  setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
  noteMessage?: string;
  noteTitle?: string;
}): Promise<string>;
/** Resolves an API key from environment or interactive prompt and records the chosen secret mode. */
declare function ensureApiKeyFromEnvOrPrompt(params: {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  provider: string;
  envLabel: string;
  promptMessage: string;
  normalize: (value: string) => string;
  validate: (value: string) => string | undefined;
  prompter: WizardPrompter;
  secretInputMode?: SecretInputMode;
  setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
}): Promise<string>;
//#endregion
export {
  normalizeSecretInputModeInput as a,
  promptSecretRefForSetup as c,
  normalizeApiKeyInput as i,
  ensureApiKeyFromOptionEnvOrPrompt as n,
  validateApiKeyInput as o,
  formatApiKeyPreview as r,
  resolveSecretInputModeForEnvSelection as s,
  ensureApiKeyFromEnvOrPrompt as t,
};
