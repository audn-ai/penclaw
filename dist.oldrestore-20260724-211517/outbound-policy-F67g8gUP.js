import { t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import "./plugins-BKdf-5tW.js";
import { a as normalizeTargetForProvider } from "./target-normalization-CUTI5XyM.js";
import {
  n as lookupDirectoryDisplay,
  t as formatTargetDisplay,
} from "./target-resolver-BQojPYwH.js";
//#region src/infra/outbound/outbound-policy.ts
const CONTEXT_GUARDED_ACTIONS = /* @__PURE__ */ new Set([
  "send",
  "poll",
  "poll-vote",
  "reply",
  "sendWithEffect",
  "sendAttachment",
  "upload-file",
  "edit",
  "delete",
  "pin",
  "unpin",
  "thread-create",
  "thread-reply",
  "sticker",
]);
const CONTEXT_MARKER_ACTIONS = /* @__PURE__ */ new Set([
  "send",
  "poll",
  "reply",
  "sendWithEffect",
  "sendAttachment",
  "upload-file",
  "thread-reply",
  "sticker",
]);
function resolveContextGuardTarget(action, params) {
  if (!CONTEXT_GUARDED_ACTIONS.has(action)) return;
  if (action === "thread-reply" || action === "thread-create") {
    if (typeof params.channelId === "string") return params.channelId;
    if (typeof params.to === "string") return params.to;
    return;
  }
  if (typeof params.to === "string") return params.to;
  if (typeof params.channelId === "string") return params.channelId;
}
function normalizeTarget(channel, raw) {
  return normalizeTargetForProvider(channel, raw) ?? raw.trim();
}
function isCrossContextTarget(params) {
  if (
    params.toolContext &&
    getChannelPlugin(params.channel)?.threading?.matchesToolContextTarget?.({
      target: params.target,
      toolContext: params.toolContext,
    })
  )
    return false;
  const currentTargets = [
    params.toolContext?.currentMessagingTarget?.trim(),
    params.toolContext?.currentChannelId?.trim(),
  ].filter((target) => Boolean(target));
  if (currentTargets.length === 0) return false;
  const normalizedTarget = normalizeTarget(params.channel, params.target);
  if (!normalizedTarget) return false;
  return !currentTargets.some(
    (currentTarget) => normalizeTarget(params.channel, currentTarget) === normalizedTarget,
  );
}
function resolveAgentMessageToolsConfig(cfg, agentId) {
  const trimmedAgentId = agentId?.trim();
  const globalConfig = cfg.tools?.message;
  if (!trimmedAgentId) return globalConfig;
  const agentConfig = cfg.agents?.list?.find((entry) => entry.id === trimmedAgentId)?.tools
    ?.message;
  if (!agentConfig) return globalConfig;
  return {
    ...globalConfig,
    ...agentConfig,
    crossContext:
      globalConfig?.crossContext || agentConfig.crossContext
        ? {
            ...globalConfig?.crossContext,
            ...agentConfig.crossContext,
            marker:
              globalConfig?.crossContext?.marker || agentConfig.crossContext?.marker
                ? {
                    ...globalConfig?.crossContext?.marker,
                    ...agentConfig.crossContext?.marker,
                  }
                : void 0,
          }
        : void 0,
    broadcast:
      globalConfig?.broadcast || agentConfig.broadcast
        ? {
            ...globalConfig?.broadcast,
            ...agentConfig.broadcast,
          }
        : void 0,
    actions:
      globalConfig?.actions || agentConfig.actions
        ? {
            ...globalConfig?.actions,
            ...agentConfig.actions,
          }
        : void 0,
  };
}
/**
 * Resolves the message-tool policy after applying any agent-specific overrides.
 */
function resolveEffectiveMessageToolsConfig(params) {
  return resolveAgentMessageToolsConfig(params.cfg, params.agentId);
}
/**
 * Returns the normalized allowed message actions for an agent or the global policy.
 */
function resolveAllowedMessageActions(params) {
  const allow = resolveEffectiveMessageToolsConfig(params)?.actions?.allow;
  if (!allow) return;
  const normalized = normalizeUniqueStringEntries(allow);
  return normalized.length > 0 ? normalized : void 0;
}
/**
 * Rejects disabled message actions before channel-specific send handling runs.
 */
function enforceMessageActionAllowlist(params) {
  const allowed = resolveAllowedMessageActions(params);
  if (!allowed || allowed.includes(params.action)) return;
  throw new Error(`Message action "${params.action}" is disabled for this agent.`);
}
/**
 * Enforces cross-context message-send policy for a bound channel/thread context.
 */
function enforceCrossContextPolicy(params) {
  const currentTarget =
    params.toolContext?.currentChannelId?.trim() ??
    params.toolContext?.currentMessagingTarget?.trim();
  if (!currentTarget) return;
  if (!CONTEXT_GUARDED_ACTIONS.has(params.action)) return;
  const messageConfig = resolveEffectiveMessageToolsConfig({
    cfg: params.cfg,
    agentId: params.agentId,
  });
  if (messageConfig?.allowCrossContextSend) return;
  const currentProvider = params.toolContext?.currentChannelProvider;
  const allowWithinProvider = messageConfig?.crossContext?.allowWithinProvider !== false;
  const allowAcrossProviders = messageConfig?.crossContext?.allowAcrossProviders === true;
  if (currentProvider && currentProvider !== params.channel) {
    if (!allowAcrossProviders)
      throw new Error(
        `Cross-context messaging denied: action=${params.action} target provider "${params.channel}" while bound to "${currentProvider}".`,
      );
    return;
  }
  if (allowWithinProvider) return;
  const target = resolveContextGuardTarget(params.action, params.args);
  if (!target) return;
  if (
    !isCrossContextTarget({
      channel: params.channel,
      target,
      toolContext: params.toolContext,
    })
  )
    return;
  throw new Error(
    `Cross-context messaging denied: action=${params.action} target="${target}" while bound to "${currentTarget}" (channel=${params.channel}).`,
  );
}
/**
 * Builds cross-context marker text or a channel-native presentation for forwarded sends.
 */
async function buildCrossContextDecoration(params) {
  const currentTarget =
    params.toolContext?.currentChannelId ?? params.toolContext?.currentMessagingTarget;
  if (!currentTarget) return null;
  if (params.toolContext?.skipCrossContextDecoration) return null;
  if (!isCrossContextTarget(params)) return null;
  const markerConfig = resolveEffectiveMessageToolsConfig({
    cfg: params.cfg,
    agentId: params.agentId,
  })?.crossContext?.marker;
  if (markerConfig?.enabled === false) return null;
  const currentName =
    (await lookupDirectoryDisplay({
      cfg: params.cfg,
      channel: params.channel,
      targetId: currentTarget,
      accountId: params.accountId ?? void 0,
    })) ?? currentTarget;
  const originLabel = formatTargetDisplay({
    channel: params.channel,
    target: currentTarget,
    display: currentName,
  });
  const prefixTemplate = markerConfig?.prefix ?? "[from {channel}] ";
  const suffixTemplate = markerConfig?.suffix ?? "";
  const prefix = prefixTemplate.replaceAll("{channel}", originLabel);
  const suffix = suffixTemplate.replaceAll("{channel}", originLabel);
  const buildPresentation = getChannelPlugin(params.channel)?.messaging
    ?.buildCrossContextPresentation;
  return {
    prefix,
    suffix,
    presentationBuilder: buildPresentation
      ? (message) =>
          buildPresentation({
            originLabel,
            message,
            cfg: params.cfg,
            accountId: params.accountId ?? void 0,
          })
      : void 0,
  };
}
/**
 * Reports whether an action can carry a cross-context marker in outbound payloads.
 */
function shouldApplyCrossContextMarker(action) {
  return CONTEXT_MARKER_ACTIONS.has(action);
}
/**
 * Applies text markers or a preferred rich presentation to a cross-context message.
 */
function applyCrossContextDecoration(params) {
  if (params.preferPresentation && params.decoration.presentationBuilder)
    return {
      message: params.message,
      presentation: params.decoration.presentationBuilder?.(params.message),
      usedPresentation: true,
    };
  return {
    message: `${params.decoration.prefix}${params.message}${params.decoration.suffix}`,
    usedPresentation: false,
  };
}
//#endregion
export {
  resolveAllowedMessageActions as a,
  enforceMessageActionAllowlist as i,
  buildCrossContextDecoration as n,
  resolveEffectiveMessageToolsConfig as o,
  enforceCrossContextPolicy as r,
  shouldApplyCrossContextMarker as s,
  applyCrossContextDecoration as t,
};
