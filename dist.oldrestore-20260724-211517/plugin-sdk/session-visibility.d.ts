import { t as callGateway } from "../call-D_CVrb6W.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/session-visibility.d.ts
type GatewayCaller = typeof callGateway;
/** Test hook: must stay aligned with `sessions-resolution` `testing.setDepsForTest`. */
declare const sessionVisibilityGatewayTesting: {
  setCallGatewayForListSpawned(overrides?: GatewayCaller): void;
};
/** Configured visibility mode for session tools and session-related commands. */
type SessionToolsVisibility = "self" | "tree" | "agent" | "all";
/** Agent-to-agent access policy compiled from `tools.agentToAgent` config. */
type AgentToAgentPolicy = {
  enabled: boolean;
  matchesAllow: (agentId: string) => boolean;
  isAllowed: (requesterAgentId: string, targetAgentId: string) => boolean;
};
/** Session operation whose visibility error copy should be rendered. */
type SessionAccessAction = "history" | "send" | "list" | "status";
/** Result of checking whether one session operation may target a session. */
type SessionAccessResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      error: string;
      status: "forbidden";
    };
/** Minimal session row metadata needed to evaluate ownership and cross-agent access. */
type SessionVisibilityRow = {
  key: string;
  agentId?: string;
  ownerSessionKey?: string;
  spawnedBy?: string;
  parentSessionKey?: string;
};
/** List sessions spawned by the requester through the gateway session list method. */
declare function listSpawnedSessionKeys(params: {
  requesterSessionKey: string;
  limit?: number;
}): Promise<Set<string>>;
/** Resolve configured session-tool visibility, defaulting invalid or missing values to tree. */
declare function resolveSessionToolsVisibility(cfg: OpenClawConfig): SessionToolsVisibility;
/** Resolve visibility after applying sandbox clamps for spawned-session-only agents. */
declare function resolveEffectiveSessionToolsVisibility(params: {
  cfg: OpenClawConfig;
  sandboxed: boolean;
}): SessionToolsVisibility;
/** Resolve sandbox-specific session visibility clamp for agent defaults. */
declare function resolveSandboxSessionToolsVisibility(cfg: OpenClawConfig): "spawned" | "all";
/** Compile agent-to-agent allow rules into reusable matching predicates. */
declare function createAgentToAgentPolicy(cfg: OpenClawConfig): AgentToAgentPolicy;
/** Create a direct session-key visibility checker for one requester/action pair. */
declare function createSessionVisibilityChecker(params: {
  action: SessionAccessAction;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
  spawnedKeys: Set<string> | null;
}): {
  check: (targetSessionKey: string) => SessionAccessResult;
};
/** Create a row-aware visibility checker that can use owner/spawn metadata. */
declare function createSessionVisibilityRowChecker(params: {
  action: SessionAccessAction;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
}): {
  check: (row: SessionVisibilityRow) => SessionAccessResult;
};
/** Create a visibility guard, loading spawned-session ownership when direct keys need it. */
declare function createSessionVisibilityGuard(params: {
  action: SessionAccessAction;
  requesterAgentId?: string;
  requesterSessionKey: string;
  visibility: SessionToolsVisibility;
  a2aPolicy: AgentToAgentPolicy;
}): Promise<{
  check: (targetSessionKey: string) => SessionAccessResult;
}>;
//#endregion
export {
  AgentToAgentPolicy,
  SessionAccessAction,
  SessionAccessResult,
  SessionToolsVisibility,
  SessionVisibilityRow,
  createAgentToAgentPolicy,
  createSessionVisibilityChecker,
  createSessionVisibilityGuard,
  createSessionVisibilityRowChecker,
  listSpawnedSessionKeys,
  resolveEffectiveSessionToolsVisibility,
  resolveSandboxSessionToolsVisibility,
  resolveSessionToolsVisibility,
  sessionVisibilityGatewayTesting,
};
