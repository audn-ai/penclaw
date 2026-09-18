import { s as SessionEntry } from "./types-Dk-ocvLl.js";
import {
  Ut as AgentConfig,
  cn as AgentContextLimitsConfig,
  i as OpenClawConfig,
  un as AgentDefaultsConfig,
} from "./types.openclaw-DDo8sH3F.js";
import { o as AgentModelConfig } from "./types.provider-request-CVFNhEKy.js";

//#region src/config/sessions/model-override-provenance.d.ts
/** Detects model overrides created by automatic fallback provenance. */
declare function hasSessionAutoModelFallbackProvenance(
  entry:
    | Pick<
        SessionEntry,
        | "providerOverride"
        | "modelOverride"
        | "modelOverrideFallbackOriginProvider"
        | "modelOverrideFallbackOriginModel"
      >
    | undefined,
): boolean;
//#endregion
//#region src/agents/agent-scope-config.d.ts
type AgentEntry = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number];
/** Per-agent config after applying agent defaults and normalizing scalar fields. */
type ResolvedAgentConfig = {
  name?: string;
  workspace?: string;
  agentDir?: string;
  model?: AgentEntry["model"];
  models?: AgentEntry["models"];
  utilityModel?: AgentEntry["utilityModel"];
  thinkingDefault?: AgentEntry["thinkingDefault"];
  verboseDefault?: AgentDefaultsConfig["verboseDefault"];
  reasoningDefault?: AgentEntry["reasoningDefault"];
  fastModeDefault?: AgentEntry["fastModeDefault"];
  contextTokens?: AgentEntry["contextTokens"];
  contextInjection?: AgentEntry["contextInjection"];
  bootstrapMaxChars?: AgentEntry["bootstrapMaxChars"];
  bootstrapTotalMaxChars?: AgentEntry["bootstrapTotalMaxChars"];
  experimental?: AgentDefaultsConfig["experimental"];
  skills?: AgentEntry["skills"];
  memorySearch?: AgentEntry["memorySearch"];
  humanDelay?: AgentEntry["humanDelay"];
  tts?: AgentEntry["tts"];
  contextLimits?: AgentContextLimitsConfig;
  heartbeat?: AgentEntry["heartbeat"];
  identity?: AgentEntry["identity"];
  groupChat?: AgentEntry["groupChat"];
  subagents?: AgentEntry["subagents"];
  runRetries?: AgentEntry["runRetries"];
  embeddedAgent?: AgentEntry["embeddedAgent"];
  sandbox?: AgentEntry["sandbox"];
  tools?: AgentEntry["tools"];
};
/** Lists valid configured agent entries from config. */
declare function listAgentEntries(cfg: OpenClawConfig): AgentEntry[];
/** Lists unique configured agent ids, falling back to the default agent id. */
declare function listAgentIds(cfg: OpenClawConfig): string[];
/** Resolves the default agent id, warning once when multiple defaults exist. */
declare function resolveDefaultAgentId(cfg: OpenClawConfig): string;
/** Resolves merged config for one agent id. */
declare function resolveAgentConfig(
  cfg: OpenClawConfig,
  agentId: string,
): ResolvedAgentConfig | undefined;
declare function resolveAgentContextLimits(
  cfg: OpenClawConfig | undefined,
  agentId?: string | null,
): AgentContextLimitsConfig | undefined;
declare function resolveAgentWorkspaceDir(
  cfg: OpenClawConfig,
  agentId: string,
  env?: NodeJS.ProcessEnv,
): string;
declare function resolveAgentDir(
  cfg: OpenClawConfig,
  agentId: string,
  env?: NodeJS.ProcessEnv,
): string;
declare function resolveDefaultAgentDir(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): string;
//#endregion
//#region src/agents/agent-scope.d.ts
/** Primary model probe metadata used to validate auto-fallback recovery. */
type AutoFallbackPrimaryProbe = {
  provider: string;
  model: string;
  fallbackProvider: string;
  fallbackModel: string;
  fallbackAuthProfileId?: string;
  fallbackAuthProfileIdSource?: "auto" | "user";
};
/** Detects old auto-fallback session entries that lack primary-origin metadata. */
declare function hasLegacyAutoFallbackWithoutOrigin(
  entry:
    | Pick<
        SessionEntry,
        | "modelOverrideSource"
        | "modelOverrideFallbackOriginProvider"
        | "modelOverrideFallbackOriginModel"
      >
    | null
    | undefined,
): boolean;
declare function resolveAutoFallbackPrimaryProbe(params: {
  entry:
    | Pick<
        SessionEntry,
        | "providerOverride"
        | "modelOverride"
        | "modelOverrideSource"
        | "modelOverrideFallbackOriginProvider"
        | "modelOverrideFallbackOriginModel"
        | "authProfileOverride"
        | "authProfileOverrideSource"
        | "authProfileOverrideCompactionCount"
      >
    | null
    | undefined;
  sessionKey?: string | null;
  primaryProvider: string;
  primaryModel: string;
  now?: number;
  minIntervalMs?: number;
  maxTrackedProbeKeys?: number;
  probeState?: Map<string, number>;
}): AutoFallbackPrimaryProbe | undefined;
declare function markAutoFallbackPrimaryProbe(params: {
  probe: AutoFallbackPrimaryProbe;
  sessionKey?: string | null;
  now?: number;
  minIntervalMs?: number;
  maxTrackedProbeKeys?: number;
  probeState?: Map<string, number>;
}): void;
declare function entryMatchesAutoFallbackPrimaryProbe(
  entry:
    | Pick<
        SessionEntry,
        | "providerOverride"
        | "modelOverride"
        | "modelOverrideSource"
        | "modelOverrideFallbackOriginProvider"
        | "modelOverrideFallbackOriginModel"
      >
    | null
    | undefined,
  probe: AutoFallbackPrimaryProbe,
): boolean;
declare function clearAutoFallbackPrimaryProbeSelection(entry: SessionEntry, now?: number): void;
declare function resolveSessionAgentIds(params: {
  sessionKey?: string;
  config?: OpenClawConfig;
  agentId?: string;
  fallbackAgentId?: string;
}): {
  defaultAgentId: string;
  sessionAgentId: string;
};
declare function resolveSessionAgentId(params: {
  sessionKey?: string;
  config?: OpenClawConfig;
  agentId?: string;
  fallbackAgentId?: string;
}): string;
declare function resolveAgentExecutionContract(
  cfg: OpenClawConfig | undefined,
  agentId?: string | null,
): NonNullable<NonNullable<AgentDefaultsConfig["embeddedAgent"]>["executionContract"]> | undefined;
declare function resolveAgentSkillsFilter(
  cfg: OpenClawConfig,
  agentId: string,
): string[] | undefined;
declare function resolveAgentExplicitModelPrimary(
  cfg: OpenClawConfig,
  agentId: string,
): string | undefined;
declare function resolveAgentEffectiveModelPrimary(
  cfg: OpenClawConfig,
  agentId: string,
): string | undefined;
type AgentModelPrimaryWriteTarget = "agent" | "defaults";
declare function setAgentEffectiveModelPrimary(
  cfg: OpenClawConfig,
  agentId: string,
  primary: string,
): AgentModelPrimaryWriteTarget;
/** @deprecated Prefer explicit/effective helpers at new call sites. */
declare function resolveAgentModelPrimary(cfg: OpenClawConfig, agentId: string): string | undefined;
declare function resolveAgentModelFallbacksOverride(
  cfg: OpenClawConfig,
  agentId: string,
): string[] | undefined;
type SubagentModelConfigSelectionSource = "subagent" | "agent" | "default-subagent";
type SubagentModelConfigSelectionResult = {
  raw: AgentModelConfig;
  source: SubagentModelConfigSelectionSource;
};
declare function resolveSubagentModelConfigSelectionResult(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  agentConfigOverride?: Pick<AgentConfig, "model" | "subagents">;
}): SubagentModelConfigSelectionResult | undefined;
declare function resolveSubagentModelConfigSelection(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  agentConfigOverride?: Pick<AgentConfig, "model" | "subagents">;
}): AgentModelConfig | undefined;
declare function resolveSubagentModelFallbacksOverride(
  cfg: OpenClawConfig,
  agentId: string,
): string[] | undefined;
declare function resolveFallbackAgentId(params: {
  agentId?: string | null;
  sessionKey?: string | null;
}): string;
declare function resolveRunModelFallbacksOverride(params: {
  cfg: OpenClawConfig | undefined;
  agentId?: string | null;
  sessionKey?: string | null;
}): string[] | undefined;
declare function hasConfiguredModelFallbacks(params: {
  cfg: OpenClawConfig | undefined;
  agentId?: string | null;
  sessionKey?: string | null;
}): boolean;
declare function resolveEffectiveModelFallbacks(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey?: string | null;
  hasSessionModelOverride: boolean;
  modelOverrideSource?: "auto" | "user";
  hasAutoFallbackProvenance?: boolean;
}): string[] | undefined;
declare function resolveAgentIdsByWorkspacePath(
  cfg: OpenClawConfig,
  workspacePath: string,
): string[];
declare function resolveAgentIdByWorkspacePath(
  cfg: OpenClawConfig,
  workspacePath: string,
): string | undefined;
//#endregion
export {
  listAgentIds as A,
  resolveSessionAgentIds as C,
  setAgentEffectiveModelPrimary as D,
  resolveSubagentModelFallbacksOverride as E,
  resolveDefaultAgentDir as F,
  resolveDefaultAgentId as I,
  hasSessionAutoModelFallbackProvenance as L,
  resolveAgentContextLimits as M,
  resolveAgentDir as N,
  ResolvedAgentConfig as O,
  resolveAgentWorkspaceDir as P,
  resolveSessionAgentId as S,
  resolveSubagentModelConfigSelectionResult as T,
  resolveAgentSkillsFilter as _,
  clearAutoFallbackPrimaryProbeSelection as a,
  resolveFallbackAgentId as b,
  hasLegacyAutoFallbackWithoutOrigin as c,
  resolveAgentExecutionContract as d,
  resolveAgentExplicitModelPrimary as f,
  resolveAgentModelPrimary as g,
  resolveAgentModelFallbacksOverride as h,
  SubagentModelConfigSelectionSource as i,
  resolveAgentConfig as j,
  listAgentEntries as k,
  markAutoFallbackPrimaryProbe as l,
  resolveAgentIdsByWorkspacePath as m,
  AutoFallbackPrimaryProbe as n,
  entryMatchesAutoFallbackPrimaryProbe as o,
  resolveAgentIdByWorkspacePath as p,
  SubagentModelConfigSelectionResult as r,
  hasConfiguredModelFallbacks as s,
  AgentModelPrimaryWriteTarget as t,
  resolveAgentEffectiveModelPrimary as u,
  resolveAutoFallbackPrimaryProbe as v,
  resolveSubagentModelConfigSelection as w,
  resolveRunModelFallbacksOverride as x,
  resolveEffectiveModelFallbacks as y,
};
