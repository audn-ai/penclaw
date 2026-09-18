import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-DVIR1nBa.js";
import {
  n as CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_ID,
  r as CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF,
  t as CLAUDE_CLI_BACKEND_ID,
} from "./cli-constants-CpgfT8aN.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { a as resolveAllowedModelRef } from "./model-selection-DOlkTrQa.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./agent-runtime-BiQiwmwD.js";
import "./command-auth-native-D63iLZoQ.js";
import {
  r as adoptedSourceKey,
  t as CLAUDE_LOCAL_SESSION_HOST_ID,
} from "./session-catalog-adoption-C3d_naEs.js";
import { r as resolveEffectiveAgentRuntime } from "./thinking-runtime-D675lyzz.js";
//#region extensions/anthropic/session-catalog-runtime.ts
function currentClaudeSessionCatalogConfig(api) {
  return api.runtime.config?.current?.() ?? api.config ?? {};
}
function boundClaudeSource(pluginId, entry) {
  const anthropic = isRecord(entry.pluginExtensions) ? entry.pluginExtensions.anthropic : void 0;
  const marker = isRecord(anthropic) ? anthropic.sessionCatalog : void 0;
  const hostId =
    isRecord(marker) && typeof marker.sourceHostId === "string"
      ? marker.sourceHostId
      : entry.execHost === "node" && typeof entry.execNode === "string" && entry.execNode.trim()
        ? `node:${entry.execNode.trim()}`
        : CLAUDE_LOCAL_SESSION_HOST_ID;
  const binding = (isRecord(entry.cliSessionBindings) ? entry.cliSessionBindings : void 0)?.[
    CLAUDE_CLI_BACKEND_ID
  ];
  if (isRecord(binding) && typeof binding.sessionId === "string" && binding.sessionId)
    return {
      hostId,
      threadId: binding.sessionId,
    };
  if (entry.pluginOwnerId !== pluginId || entry.modelSelectionLocked !== true) return;
  return isRecord(marker) && typeof marker.sourceThreadId === "string"
    ? {
        hostId,
        threadId: marker.sourceThreadId,
      }
    : void 0;
}
function listBoundClaudeSessions(api) {
  const config = currentClaudeSessionCatalogConfig(api);
  const defaultAgentId = resolveDefaultAgentId(config);
  const agentIds = [
    defaultAgentId,
    ...listAgentIds(config).filter((agentId) => agentId !== defaultAgentId),
  ];
  const bound = /* @__PURE__ */ new Map();
  for (const { sessionKey, entry } of agentIds.flatMap((agentId) =>
    api.runtime.agent.session.listSessionEntries({ agentId }),
  )) {
    const source = boundClaudeSource(api.id, entry);
    if (source) bound.set(adoptedSourceKey(source.hostId, source.threadId), sessionKey);
  }
  return bound;
}
function resolveClaudeCatalogCreateSession(api, requestedAgentId) {
  const config = currentClaudeSessionCatalogConfig(api);
  const agentId = requestedAgentId ?? resolveDefaultAgentId(config);
  if (
    resolveEffectiveAgentRuntime({
      cfg: config,
      provider: "anthropic",
      modelId: CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_ID,
      agentId,
    }) !== "claude-cli"
  )
    return;
  const defaultModel = resolveDefaultModelForAgent({
    cfg: config,
    agentId,
  });
  return "error" in
    resolveAllowedModelRef({
      cfg: config,
      catalog: [],
      raw: CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF,
      defaultProvider: defaultModel.provider,
      defaultModel: defaultModel.model,
    })
    ? void 0
    : {
        model: CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF,
        agentRuntime: CLAUDE_CLI_BACKEND_ID,
      };
}
//#endregion
export {
  listBoundClaudeSessions as n,
  resolveClaudeCatalogCreateSession as r,
  currentClaudeSessionCatalogConfig as t,
};
