import { a as createLazyRuntimeSurface } from "./lazy-runtime-B-Fc-m0I.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { c as upsertAuthProfileWithLock } from "./profiles-DxTOoenK.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/plugins/provider-api-key-auth.ts
/** Builds API-key provider auth methods that write profiles and config updates. */
const loadProviderApiKeyAuthRuntime = createLazyRuntimeSurface(
  () => import("./provider-api-key-auth.runtime.js"),
  ({ providerApiKeyAuthRuntime }) => providerApiKeyAuthRuntime,
);
function resolveStringOption(opts, optionKey) {
  return normalizeOptionalSecretInput(opts?.[optionKey]);
}
function resolveProfileId(params) {
  return normalizeOptionalString(params.profileId) || `${params.providerId}:default`;
}
function resolveProfileIds(params) {
  const explicit = normalizeUniqueStringEntries(params.profileIds ?? []);
  if (explicit.length > 0) return explicit;
  return [resolveProfileId(params)];
}
async function upsertAuthProfileWithLockOrThrow(params) {
  if (!(await upsertAuthProfileWithLock(params)))
    throw new Error(
      "Failed to update auth profile store; the auth store lock may be busy. Wait a moment and retry.",
    );
}
async function applyApiKeyConfig(params) {
  const { applyAuthProfileConfig, applyPrimaryModel } = await loadProviderApiKeyAuthRuntime();
  let next = params.ctx.config;
  for (const profileId of params.profileIds)
    next = applyAuthProfileConfig(next, {
      profileId,
      provider: normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId,
      mode: "api_key",
    });
  if (params.applyConfig) next = params.applyConfig(next);
  if (!params.defaultModel) return next;
  if (
    params.preserveExistingPrimary === true &&
    resolveAgentModelPrimaryValue(next.agents?.defaults?.model) !== void 0
  )
    return next;
  return applyPrimaryModel(next, params.defaultModel);
}
/** Creates a provider auth method that captures, stores, and configures API-key credentials. */
function createProviderApiKeyAuthMethod(params) {
  return {
    id: params.methodId,
    label: params.label,
    hint: params.hint,
    kind: "api_key",
    starterModel: params.defaultModel,
    wizard: params.wizard,
    run: async (ctx) => {
      const opts = ctx.opts;
      const flagValue = resolveStringOption(opts, params.optionKey);
      let capturedSecretInput;
      let capturedCredential = false;
      let capturedMode;
      const {
        buildApiKeyCredential,
        ensureApiKeyFromOptionEnvOrPrompt,
        normalizeApiKeyInput,
        validateApiKeyInput,
      } = await loadProviderApiKeyAuthRuntime();
      await ensureApiKeyFromOptionEnvOrPrompt({
        token: flagValue ?? normalizeOptionalSecretInput(ctx.opts?.token),
        tokenProvider: flagValue
          ? params.providerId
          : normalizeOptionalSecretInput(ctx.opts?.tokenProvider),
        secretInputMode:
          ctx.allowSecretRefPrompt === false
            ? (ctx.secretInputMode ?? "plaintext")
            : ctx.secretInputMode,
        config: ctx.config,
        env: ctx.env,
        expectedProviders: params.expectedProviders ?? [params.providerId],
        provider: params.providerId,
        envLabel: params.envVar,
        promptMessage: params.promptMessage,
        normalize: normalizeApiKeyInput,
        validate: validateApiKeyInput,
        prompter: ctx.prompter,
        noteMessage: params.noteMessage,
        noteTitle: params.noteTitle,
        setCredential: async (apiKey, mode) => {
          capturedSecretInput = apiKey;
          capturedCredential = true;
          capturedMode = mode;
        },
      });
      if (!capturedCredential)
        throw new Error(`Missing API key input for provider "${params.providerId}".`);
      const credentialInput = capturedSecretInput ?? "";
      return {
        profiles: resolveProfileIds(params).map((profileId) => ({
          profileId,
          credential: buildApiKeyCredential(
            normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId,
            credentialInput,
            params.metadata,
            capturedMode
              ? {
                  secretInputMode: capturedMode,
                  config: ctx.config,
                }
              : void 0,
          ),
        })),
        ...(params.applyConfig ? { configPatch: params.applyConfig(ctx.config) } : {}),
        ...(params.defaultModel ? { defaultModel: params.defaultModel } : {}),
      };
    },
    runNonInteractive: async (ctx) => {
      const opts = ctx.opts;
      const resolved = await ctx.resolveApiKey({
        provider: params.providerId,
        flagValue: resolveStringOption(opts, params.optionKey),
        flagName: params.flagName,
        envVar: params.envVar,
        ...(params.allowProfile === false ? { allowProfile: false } : {}),
      });
      if (!resolved) return null;
      const profileIds = resolveProfileIds(params);
      if (resolved.source !== "profile")
        for (const profileId of profileIds) {
          const credential = ctx.toApiKeyCredential({
            provider: normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId,
            resolved,
            ...(params.metadata ? { metadata: params.metadata } : {}),
          });
          if (!credential) return null;
          await upsertAuthProfileWithLockOrThrow({
            profileId,
            credential,
            agentDir: ctx.agentDir,
          });
        }
      return await applyApiKeyConfig({
        ctx,
        providerId: params.providerId,
        profileIds,
        defaultModel: params.defaultModel,
        preserveExistingPrimary: params.preserveExistingPrimary,
        applyConfig: params.applyConfig,
      });
    },
  };
}
//#endregion
export { createProviderApiKeyAuthMethod as t };
