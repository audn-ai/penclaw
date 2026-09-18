import {
  c as detachPluginConversationBinding,
  h as requestPluginConversationBinding,
  l as getCurrentPluginConversationBinding,
} from "./conversation-binding-B-BUd2yg.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import {
  d as releasePluginInteractiveCallbackDedupe,
  l as claimPluginInteractiveCallbackDedupe,
  o as resolvePluginInteractiveNamespaceMatch,
  s as resolvePluginInteractiveRegistrationsMatch,
  u as commitPluginInteractiveCallbackDedupe,
} from "./interactive-registry-BnOxEacm.js";
import "./hook-runner-global-CPEPIvCK.js";
import { u as toSafeImportPath } from "./plugin-module-loader-cache-CDpLvLFE.js";
import "./types-DN4huvwe.js";
import "./gateway-request-scope-CiIBNuZX.js";
import "./commands-E5FKOfF0.js";
import { t as collectLivePluginRegistries } from "./runtime-CcYnX0B4.js";
import "./http-registry-BeVjji7b.js";
//#region src/plugins/interactive-binding-helpers.ts
/** Helpers for binding interactive plugin handlers to conversations and sessions. */
function createInteractiveConversationBindingHelpers(params) {
  const { registration, senderId, conversation } = params;
  const pluginRoot = registration.pluginRoot;
  return {
    requestConversationBinding: async (binding = {}) => {
      if (!pluginRoot)
        return {
          status: "error",
          message: "This interaction cannot bind the current conversation.",
        };
      return requestPluginConversationBinding({
        pluginId: registration.pluginId,
        pluginName: registration.pluginName,
        pluginRoot,
        requestedBySenderId: senderId,
        conversation,
        binding,
      });
    },
    detachConversationBinding: async () => {
      if (!pluginRoot) return { removed: false };
      return detachPluginConversationBinding({
        pluginRoot,
        conversation,
      });
    },
    getCurrentConversationBinding: async () => {
      if (!pluginRoot) return null;
      return getCurrentPluginConversationBinding({
        pluginRoot,
        conversation,
      });
    },
  };
}
//#endregion
//#region src/plugins/interactive.ts
function resolveLivePluginInteractiveNamespaceMatch(channel, data) {
  const existing = resolvePluginInteractiveNamespaceMatch(channel, data);
  if (existing && existing.registration.registryOwned !== true) return existing;
  for (const registry of collectLivePluginRegistries()) {
    const match = resolvePluginInteractiveRegistrationsMatch(
      registry.interactiveHandlers,
      channel,
      data,
    );
    if (match) return match;
  }
  return null;
}
/** Dispatches one interactive callback payload to a matching plugin handler. */
async function dispatchPluginInteractiveHandler(params) {
  const match = resolveLivePluginInteractiveNamespaceMatch(params.channel, params.data);
  if (!match)
    return {
      matched: false,
      handled: false,
      duplicate: false,
    };
  const dedupeKey = params.dedupeId?.trim();
  if (dedupeKey && !claimPluginInteractiveCallbackDedupe(dedupeKey))
    return {
      matched: true,
      handled: true,
      duplicate: true,
    };
  try {
    await params.onMatched?.();
    const resolved = await params.invoke(match);
    await params.afterInvoke?.(resolved);
    if (dedupeKey) commitPluginInteractiveCallbackDedupe(dedupeKey);
    const shouldExposeResult =
      Boolean(resolved) &&
      typeof resolved === "object" &&
      Object.keys(resolved).some((key) => key !== "handled");
    return {
      matched: true,
      handled: resolved?.handled ?? true,
      duplicate: false,
      ...(shouldExposeResult ? { result: resolved } : {}),
    };
  } catch (error) {
    if (dedupeKey) releasePluginInteractiveCallbackDedupe(dedupeKey);
    throw error;
  }
}
//#endregion
//#region src/plugins/lazy-service-module.ts
function resolveExport(mod, names) {
  for (const name of names) {
    const value = mod[name];
    if (typeof value === "function") return value;
  }
  return null;
}
async function defaultLoadOverrideModule(
  specifier,
  importModule = async (source) => await import(source),
) {
  return importModule(toSafeImportPath(specifier));
}
async function startLazyPluginServiceModule(params) {
  const skipEnvVar = params.skipEnvVar?.trim();
  if (skipEnvVar && isTruthyEnvValue(process.env[skipEnvVar])) return null;
  const overrideEnvVar = params.overrideEnvVar?.trim();
  const override = overrideEnvVar ? process.env[overrideEnvVar]?.trim() : void 0;
  const loadOverrideModule = params.loadOverrideModule ?? defaultLoadOverrideModule;
  const validatedOverride =
    override && params.validateOverrideSpecifier
      ? params.validateOverrideSpecifier(override)
      : override;
  const mod = validatedOverride
    ? await loadOverrideModule(validatedOverride)
    : await params.loadDefaultModule();
  const start = resolveExport(mod, params.startExportNames);
  if (!start) return null;
  const stop =
    params.stopExportNames && params.stopExportNames.length > 0
      ? resolveExport(mod, params.stopExportNames)
      : null;
  await start();
  return { stop: stop ?? (async () => {}) };
}
//#endregion
export {
  createInteractiveConversationBindingHelpers as i,
  startLazyPluginServiceModule as n,
  dispatchPluginInteractiveHandler as r,
  defaultLoadOverrideModule as t,
};
