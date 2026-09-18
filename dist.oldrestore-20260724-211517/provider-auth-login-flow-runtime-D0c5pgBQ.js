import {
  n as createLazyRuntimeMethodBinder,
  r as createLazyRuntimeModule,
} from "./lazy-runtime-B-Fc-m0I.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/plugin-sdk/provider-auth-login-flow-runtime.ts
const CODEX_LOGIN_PROVIDER = "openai";
const CODEX_LOGIN_METHOD = "device-code";
const CODEX_LOGIN_FLOW_TTL_MS = 15 * 6e4;
const CODEX_LOGIN_PROVIDER_ALIASES = /* @__PURE__ */ new Set(["codex", "openai", "openai-codex"]);
const runModelsAuthLoginFlow = createLazyRuntimeMethodBinder(
  createLazyRuntimeModule(() => import("./auth-D52tXFem.js")),
)((runtime) => runtime.runModelsAuthLoginFlow);
function resolveCodexLoginProvider(rawProvider) {
  const normalized = normalizeLowercaseStringOrEmpty(rawProvider ?? "codex").replace(/_/gu, "-");
  if (!normalized) return CODEX_LOGIN_PROVIDER;
  return CODEX_LOGIN_PROVIDER_ALIASES.has(normalized) ? CODEX_LOGIN_PROVIDER : null;
}
function hasConfiguredCommandOwnerAllowlist(cfg) {
  const owners = cfg.commands?.ownerAllowFrom;
  return Array.isArray(owners) && owners.some((owner) => normalizeOptionalString(String(owner)));
}
function resolveProviderScopedProfileId(authProfileOverride, provider) {
  const profileId = normalizeOptionalString(authProfileOverride);
  if (!profileId) return;
  const providerPrefix = `${normalizeLowercaseStringOrEmpty(provider)}:`;
  return normalizeLowercaseStringOrEmpty(profileId).startsWith(providerPrefix) ? profileId : void 0;
}
function reserveCodexLoginFlow(params) {
  const now = params.now ?? Date.now();
  const activeFlow = params.flows.get(params.flowKey);
  if (activeFlow && activeFlow.expiresAt > now) return { status: "active" };
  if (activeFlow) params.flows.delete(params.flowKey);
  const record = { expiresAt: now + CODEX_LOGIN_FLOW_TTL_MS };
  params.flows.set(params.flowKey, record);
  return {
    status: "reserved",
    record,
  };
}
function releaseCodexLoginFlow(params) {
  if (params.flows.get(params.flowKey) === params.record) params.flows.delete(params.flowKey);
}
function buildCodexDeviceLoginPrompter(params) {
  const sendCleanMessage = async (message) => {
    const text = message.trim();
    if (text) await params.sendMessage(text);
  };
  const unsupportedPrompt = async () => {
    throw new Error(params.unsupportedPromptMessage);
  };
  return {
    intro: async () => {},
    outro: async () => {},
    note: async (message, title) => {
      await sendCleanMessage([title?.trim(), message.trim()].filter(Boolean).join("\n\n"));
    },
    plain: sendCleanMessage,
    select: unsupportedPrompt,
    multiselect: unsupportedPrompt,
    text: unsupportedPrompt,
    confirm: unsupportedPrompt,
    progress: () => ({
      update: () => {},
      stop: () => {},
    }),
  };
}
function parseModelsAuthLoginFlowResult(value) {
  if (!value || typeof value !== "object")
    throw new Error("Provider login returned an invalid result.");
  const result = value;
  if (!Array.isArray(result.profiles))
    throw new Error("Provider login returned an invalid result.");
  const parseRequiredString = (input, label) => {
    if (typeof input !== "string" || !input.trim())
      throw new Error(`Provider login returned an invalid ${label}.`);
    return input.trim();
  };
  const providerId = parseRequiredString(result.providerId, "provider id");
  const methodId = parseRequiredString(result.methodId, "method id");
  const profiles = result.profiles.map((profile) => {
    if (!profile || typeof profile !== "object")
      throw new Error("Provider login returned an invalid profile.");
    const record = profile;
    const profileId = parseRequiredString(record.profileId, "profile id");
    const provider = parseRequiredString(record.provider, "profile provider");
    const mode = parseRequiredString(record.mode, "profile mode");
    if (mode !== "api_key" && mode !== "oauth" && mode !== "token")
      throw new Error("Provider login returned an invalid profile.");
    return {
      profileId,
      provider,
      mode,
    };
  });
  const defaultModel =
    result.defaultModel === void 0
      ? void 0
      : parseRequiredString(result.defaultModel, "default model");
  return {
    providerId,
    methodId,
    ...(defaultModel ? { defaultModel } : {}),
    profiles,
  };
}
async function runCodexDeviceLoginFlow(params) {
  return parseModelsAuthLoginFlowResult(
    await (params.runLoginFlow ?? runModelsAuthLoginFlow)({
      provider: params.provider,
      method: CODEX_LOGIN_METHOD,
      agent: params.agentId,
      ...(params.profileId ? { profileId: params.profileId } : {}),
      config: params.config,
      runtime: params.runtime,
      prompter: buildCodexDeviceLoginPrompter({
        sendMessage: params.sendMessage,
        unsupportedPromptMessage: params.unsupportedPromptMessage,
      }),
      isRemote: true,
      openUrl: async () => {},
    }),
  );
}
const codexChannelLoginRuntime = {
  resolveProvider: resolveCodexLoginProvider,
  hasConfiguredCommandOwnerAllowlist,
  resolveProviderScopedProfileId,
  reserveFlow: reserveCodexLoginFlow,
  releaseFlow: releaseCodexLoginFlow,
  runDeviceLoginFlow: runCodexDeviceLoginFlow,
};
//#endregion
export { runModelsAuthLoginFlow as n, codexChannelLoginRuntime as t };
