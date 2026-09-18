import {
  D as SessionsCatalogReadResult,
  T as SessionsCatalogReadParams,
  _ as SessionsCatalogContinueParams,
  o as SessionCatalogHost,
  p as SessionsCatalogArchiveParams,
} from "./sessions-catalog-DPwzj-x7.js";

//#region src/plugins/session-catalog.d.ts
type SessionCatalogListProviderParams = {
  search?: string;
  limitPerHost?: number;
  hostIds?: string[];
  cursors?: Record<string, string>;
};
type SessionCatalogReadProviderParams = Omit<SessionsCatalogReadParams, "catalogId">;
type SessionCatalogContinueProviderParams = Omit<SessionsCatalogContinueParams, "catalogId"> & {
  /** Caller's gateway scopes so providers can gate high-authority continues up front. */ clientScopes?: readonly string[];
};
type SessionCatalogArchiveProviderParams = Omit<SessionsCatalogArchiveParams, "catalogId">;
type SessionCatalogTerminalPlan =
  | {
      kind: "local";
      argv: string[];
      cwd?: string;
      title?: string;
    }
  | {
      kind: "node";
      nodeId: string;
      command: string;
      paramsJSON: string;
      cwd?: string;
      title?: string;
    };
type SessionCatalogCreateTarget = {
  model: string /** Concrete runtime pinned onto the created session so config reloads cannot retarget it. */;
  agentRuntime: string;
};
type SessionUpstreamJsonValue =
  | null
  | boolean
  | number
  | string
  | SessionUpstreamJsonValue[]
  | {
      [key: string]: SessionUpstreamJsonValue;
    };
type SessionUpstreamKind = "claude-cli" | "codex-app-server";
type SessionUpstreamProbe = {
  sessionKey: string;
  agentId: string;
  threadId: string;
  hostId: string;
  upstreamKind: SessionUpstreamKind;
  upstreamRef: SessionUpstreamJsonValue;
  marker: SessionUpstreamJsonValue | null;
  ownRecentUserTexts: string[];
};
type SessionUpstreamActivity = {
  sessionKey: string;
  humanTurns: number;
  nextMarker: SessionUpstreamJsonValue;
  occurredAt?: number;
  dedupeId?: string;
};
type SessionCatalogContinueProviderResult = {
  sessionKey: string /** Plugin binding installed for this authenticated Control UI session. */;
  conversationBinding?: {
    summary?: string;
    detachHint?: string;
    data?: Record<string, unknown>;
  } /** Publishes provider state only after the requested binding is durable. */;
  afterConversationBound?: () => Promise<void> /** Upstream link seed so the monitor can detect direct external activity. */;
  upstream?: {
    kind: SessionUpstreamKind;
    ref: SessionUpstreamJsonValue;
    marker: SessionUpstreamJsonValue;
  };
};
type SessionCatalogCreateParams = {
  /** Agent whose model/runtime policy must authorize the catalog target. */ agentId?: string;
};
type SessionCatalogProvider = {
  id: string;
  label: string /** Resolves the current core new-session target for the requested agent. */;
  resolveCreateSession?: (
    params: SessionCatalogCreateParams,
  ) => SessionCatalogCreateTarget | undefined;
  list: (params: SessionCatalogListProviderParams) => Promise<SessionCatalogHost[]>;
  read: (params: SessionCatalogReadProviderParams) => Promise<SessionsCatalogReadResult>;
  continueSession?: (
    params: SessionCatalogContinueProviderParams,
  ) => Promise<SessionCatalogContinueProviderResult>;
  checkUpstreamActivity?: (probes: SessionUpstreamProbe[]) => Promise<SessionUpstreamActivity[]>;
  archive?: (params: SessionCatalogArchiveProviderParams) => Promise<{
    ok: true;
  }>;
  openTerminal?: (request: {
    hostId: string;
    threadId: string;
  }) => Promise<SessionCatalogTerminalPlan>;
};
//#endregion
export {
  SessionCatalogProvider as a,
  SessionUpstreamActivity as c,
  SessionUpstreamProbe as d,
  SessionCatalogListProviderParams as i,
  SessionUpstreamJsonValue as l,
  SessionCatalogContinueProviderParams as n,
  SessionCatalogReadProviderParams as o,
  SessionCatalogContinueProviderResult as r,
  SessionCatalogTerminalPlan as s,
  SessionCatalogArchiveProviderParams as t,
  SessionUpstreamKind as u,
};
