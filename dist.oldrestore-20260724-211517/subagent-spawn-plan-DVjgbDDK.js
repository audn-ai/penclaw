import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-D0s7qvvw.js";
import {
  i as resolveSubagentConfiguredModelSelection,
  r as resolveDefaultModelForAgent,
} from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-WPZGmi9R.js";
import { f as resolveSubagentSpawnModelSelection } from "./model-selection-DOlkTrQa.js";
import { r as asOptionalObjectRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  g as sortUniqueStrings,
  p as normalizeUniqueStringEntries,
} from "./string-normalization-CRyoFBPt.js";
import { t as formatThinkingLevels } from "./thinking-CVcRbjTC.js";
import { s as normalizeThinkLevel } from "./thinking.shared-BWnbgBUO.js";
//#region src/agents/subagent-target-policy.ts
/**
 * Subagent spawn target policy. Requesters can self-spawn by default, or opt
 * into a configured allowlist that is still intersected with known agents.
 */
function normalizeAllowAgents(allowAgents) {
  if (!Array.isArray(allowAgents))
    return {
      configured: false,
      allowAny: false,
      allowedIds: [],
    };
  const allowedIds = allowAgents
    .map((value) => value.trim())
    .filter((value) => value && value !== "*")
    .map((value) => normalizeAgentId(value))
    .filter(Boolean);
  return {
    configured: true,
    allowAny: allowAgents.some((value) => value.trim() === "*"),
    allowedIds: sortUniqueStrings(allowedIds),
  };
}
function normalizeConfiguredAgentIds(configuredAgentIds) {
  return new Set(normalizeUniqueStringEntries((configuredAgentIds ?? []).map(normalizeAgentId)));
}
function filterConfiguredAllowedIds(params) {
  const configuredIds = normalizeConfiguredAgentIds(params.configuredAgentIds);
  return params.allowedIds.filter((id) => configuredIds.has(id));
}
/** Resolve the normalized agent IDs a requester may target with sessions_spawn. */
function resolveSubagentAllowedTargetIds(params) {
  const requesterAgentId = normalizeAgentId(params.requesterAgentId);
  const policy = normalizeAllowAgents(params.allowAgents);
  if (!policy.configured)
    return {
      allowAny: false,
      allowedIds: requesterAgentId ? [requesterAgentId] : [],
    };
  if (policy.allowAny) {
    const configuredIds = Array.from(normalizeConfiguredAgentIds(params.configuredAgentIds));
    if (requesterAgentId) configuredIds.push(requesterAgentId);
    return {
      allowAny: true,
      allowedIds: sortUniqueStrings(configuredIds),
    };
  }
  return {
    allowAny: false,
    allowedIds: filterConfiguredAllowedIds({
      allowedIds: policy.allowedIds,
      configuredAgentIds: params.configuredAgentIds,
    }).toSorted((a, b) => a.localeCompare(b)),
  };
}
/** Validate one requested target against subagent spawn policy. */
function resolveSubagentTargetPolicy(params) {
  const requesterAgentId = normalizeAgentId(params.requesterAgentId);
  const targetAgentId = normalizeAgentId(params.targetAgentId);
  if (!params.requestedAgentId?.trim() && targetAgentId === requesterAgentId) return { ok: true };
  const allowed = resolveSubagentAllowedTargetIds({
    requesterAgentId,
    allowAgents: params.allowAgents,
    configuredAgentIds: params.configuredAgentIds,
  });
  if (allowed.allowedIds.includes(targetAgentId)) return { ok: true };
  const allowedText = allowed.allowedIds.length > 0 ? allowed.allowedIds.join(", ") : "none";
  const policy = normalizeAllowAgents(params.allowAgents);
  if (allowed.allowAny || policy.allowedIds.includes(targetAgentId))
    return {
      ok: false,
      allowedText,
      error: `agentId "${targetAgentId}" is not in the configured agent registry (allowed: ${allowedText})`,
    };
  return {
    ok: false,
    allowedText,
    error: `agentId is not allowed for sessions_spawn (allowed: ${allowedText})`,
  };
}
//#endregion
//#region src/agents/spawn-requester-origin.ts
const KIND_PREFIX_TO_CHAT_TYPE = {
  "room:": "channel",
  "channel:": "channel",
  "conversation:": "channel",
  "chat:": "channel",
  "thread:": "channel",
  "topic:": "channel",
  "group:": "group",
  "team:": "group",
  "user:": "direct",
  "dm:": "direct",
  "pm:": "direct",
};
const GENERIC_PREFIX_PATTERN = /^[a-z][a-z0-9_-]*:/i;
function getKindForRequesterPrefix(prefix) {
  return Object.hasOwn(KIND_PREFIX_TO_CHAT_TYPE, prefix)
    ? KIND_PREFIX_TO_CHAT_TYPE[prefix]
    : void 0;
}
function normalizeChannelPrefix(channelId) {
  const normalized = channelId?.trim().toLowerCase();
  return normalized ? `${normalized}:` : void 0;
}
function shouldPeelRequesterPrefix(prefix, channelPrefix) {
  return Boolean(getKindForRequesterPrefix(prefix) || prefix === channelPrefix);
}
function inferPeerKindFromBareId(value) {
  if (value.startsWith("@")) return "direct";
  if (value.startsWith("!") || value.startsWith("#")) return "channel";
}
function extractRequesterPeer(channelId, requesterTo) {
  if (!requesterTo) return {};
  const raw = requesterTo.trim();
  if (!raw) return {};
  const channelPrefix = normalizeChannelPrefix(channelId);
  let inferredKind;
  let allowBareIdKindOverride = false;
  let value = raw;
  while (true) {
    const match = GENERIC_PREFIX_PATTERN.exec(value);
    if (!match) break;
    const prefix = match[0].toLowerCase();
    if (!shouldPeelRequesterPrefix(prefix, channelPrefix)) break;
    const kindFromPrefix = getKindForRequesterPrefix(prefix);
    if (kindFromPrefix) inferredKind ??= kindFromPrefix;
    allowBareIdKindOverride ||= prefix === channelPrefix || prefix === "room:";
    value = value.slice(prefix.length).trim();
  }
  const bareIdKind = value ? inferPeerKindFromBareId(value) : void 0;
  if (bareIdKind && (!inferredKind || allowBareIdKindOverride)) inferredKind = bareIdKind;
  return {
    peerId: value || void 0,
    peerKind: inferredKind,
  };
}
function resolveRequesterOriginForChild(params) {
  const { peerId: normalizedPeerId, peerKind: inferredPeerKind } = extractRequesterPeer(
    params.requesterChannel,
    params.requesterTo,
  );
  const rawPeerIdAlias = params.requesterTo?.trim();
  const boundAccountId =
    params.requesterChannel && params.targetAgentId !== params.requesterAgentId
      ? resolveFirstBoundAccountId({
          cfg: params.cfg,
          channelId: params.requesterChannel,
          agentId: params.targetAgentId,
          peerId: normalizedPeerId,
          exactPeerIdAliases:
            rawPeerIdAlias && rawPeerIdAlias !== normalizedPeerId ? [rawPeerIdAlias] : void 0,
          peerKind: inferredPeerKind,
          groupSpace: params.requesterGroupSpace,
          memberRoleIds: params.requesterMemberRoleIds,
        })
      : void 0;
  return normalizeDeliveryContext({
    channel: params.requesterChannel,
    accountId: boundAccountId ?? params.requesterAccountId,
    to: params.requesterTo,
    threadId: params.requesterThreadId,
  });
}
//#endregion
//#region src/agents/subagent-spawn-thinking.ts
/**
 * Resolves subagent thinking-level inheritance and overrides. Spawning uses
 * this helper to patch the child session without leaking invalid caller input.
 */
function readString(value, key) {
  const raw = value[key];
  return typeof raw === "string" && raw.trim() ? raw.trim() : void 0;
}
/** Resolves subagent thinking override and initial session patch from caller/agent config. */
function resolveSubagentThinkingOverride(params) {
  const requesterSubagents = asOptionalObjectRecord(
    asOptionalObjectRecord(params.requesterAgentConfig)?.subagents,
  );
  const targetSubagents = asOptionalObjectRecord(
    asOptionalObjectRecord(params.targetAgentConfig)?.subagents,
  );
  const defaultSubagents = asOptionalObjectRecord(params.cfg.agents?.defaults?.subagents);
  const resolvedThinkingDefaultRaw =
    readString(requesterSubagents ?? {}, "thinking") ??
    readString(targetSubagents ?? {}, "thinking") ??
    readString(defaultSubagents ?? {}, "thinking");
  const overrideCandidateRaw = params.thinkingOverrideRaw || resolvedThinkingDefaultRaw;
  if (overrideCandidateRaw) {
    const normalizedThinking = normalizeThinkLevel(overrideCandidateRaw);
    if (!normalizedThinking)
      return {
        status: "error",
        thinkingCandidateRaw: overrideCandidateRaw,
      };
    return {
      status: "ok",
      thinkingOverride: normalizedThinking,
      initialSessionPatch: { thinkingLevel: normalizedThinking },
    };
  }
  if (!params.callerThinkingRaw)
    return {
      status: "ok",
      thinkingOverride: void 0,
      initialSessionPatch: {},
    };
  const normalizedThinking = normalizeThinkLevel(params.callerThinkingRaw);
  if (!normalizedThinking)
    return {
      status: "ok",
      thinkingOverride: void 0,
      initialSessionPatch: {},
    };
  return {
    status: "ok",
    thinkingOverride: void 0,
    initialSessionPatch: { thinkingLevel: normalizedThinking },
  };
}
//#endregion
//#region src/agents/subagent-spawn-plan.ts
/**
 * Subagent spawn planning helpers.
 *
 * Resolves model, thinking, and timeout choices before the sessions_spawn executor launches work.
 */
/** Splits a provider/model ref while preserving model-only refs. */
function splitModelRef(ref) {
  if (!ref)
    return {
      provider: void 0,
      model: void 0,
    };
  const trimmed = ref.trim();
  if (!trimmed)
    return {
      provider: void 0,
      model: void 0,
    };
  const slash = trimmed.indexOf("/");
  if (slash > 0 && slash < trimmed.length - 1)
    return {
      provider: trimmed.slice(0, slash),
      model: trimmed.slice(slash + 1),
    };
  const provider = void 0;
  const model = trimmed;
  if (model)
    return {
      provider,
      model,
    };
  return {
    provider: void 0,
    model: trimmed,
  };
}
/** Resolves the effective subagent run timeout from per-call override or config default. */
function resolveConfiguredSubagentRunTimeoutSeconds(params) {
  const cfgSubagentTimeout =
    typeof params.cfg?.agents?.defaults?.subagents?.runTimeoutSeconds === "number" &&
    Number.isFinite(params.cfg.agents.defaults.subagents.runTimeoutSeconds)
      ? Math.max(0, Math.floor(params.cfg.agents.defaults.subagents.runTimeoutSeconds))
      : 0;
  return typeof params.runTimeoutSeconds === "number" && Number.isFinite(params.runTimeoutSeconds)
    ? Math.max(0, Math.floor(params.runTimeoutSeconds))
    : cfgSubagentTimeout;
}
/** Resolves the subagent model plus thinking patch to apply to the spawned session. */
function resolveSubagentModelAndThinkingPlan(params) {
  const resolvedModel = resolveSubagentSpawnModelSelection({
    cfg: params.cfg,
    agentId: params.targetAgentId,
    modelOverride: params.modelOverride,
  });
  const thinkingPlan = resolveSubagentThinkingOverride({
    cfg: params.cfg,
    requesterAgentConfig: params.requesterAgentConfig,
    targetAgentConfig: params.targetAgentConfig,
    thinkingOverrideRaw: params.thinkingOverrideRaw,
    callerThinkingRaw: params.callerThinkingRaw,
  });
  if (thinkingPlan.status === "error") {
    const { provider, model } = splitModelRef(resolvedModel);
    const hint = formatThinkingLevels(provider, model);
    return {
      status: "error",
      resolvedModel,
      error: `Invalid thinking level "${thinkingPlan.thinkingCandidateRaw}". Use one of: ${hint}.`,
    };
  }
  const modelOverrideSource = params.modelOverride?.trim() ? "user" : "auto";
  const configuredModelRef =
    modelOverrideSource === "auto" &&
    Boolean(
      resolveSubagentConfiguredModelSelection({
        cfg: params.cfg,
        agentId: params.targetAgentId,
      }),
    )
      ? splitModelRef(resolvedModel)
      : void 0;
  const modelOrigin = configuredModelRef?.model
    ? {
        provider:
          configuredModelRef.provider ??
          resolveDefaultModelForAgent({
            cfg: params.cfg,
            agentId: params.targetAgentId,
          }).provider,
        model: configuredModelRef.model,
      }
    : void 0;
  return {
    status: "ok",
    resolvedModel,
    modelApplied: Boolean(resolvedModel),
    thinkingOverride: thinkingPlan.thinkingOverride,
    initialSessionPatch: {
      ...(resolvedModel
        ? {
            model: resolvedModel,
            modelOverrideSource,
            ...(modelOrigin
              ? {
                  modelOverrideFallbackOriginProvider: modelOrigin.provider,
                  modelOverrideFallbackOriginModel: modelOrigin.model,
                }
              : {}),
          }
        : {}),
      ...thinkingPlan.initialSessionPatch,
    },
  };
}
//#endregion
export {
  resolveRequesterOriginForChild as a,
  resolveSubagentThinkingOverride as i,
  resolveSubagentModelAndThinkingPlan as n,
  resolveSubagentAllowedTargetIds as o,
  splitModelRef as r,
  resolveSubagentTargetPolicy as s,
  resolveConfiguredSubagentRunTimeoutSeconds as t,
};
