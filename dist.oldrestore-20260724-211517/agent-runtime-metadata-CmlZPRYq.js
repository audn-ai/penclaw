import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { L as isDefaultAgentRuntimeId } from "./openai-routing-Cu28Ynzk.js";
import { t as resolveAgentHarnessPolicy } from "./policy-C704eijA.js";
import { n as isAcpSessionKey } from "./session-key-utils-B8sNp9l4.js";
import "./model-selection-DOlkTrQa.js";
import { n as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-DgCFENjt.js";
//#region src/agents/acp-runtime-overlay.ts
/** Applies ACP session-key metadata overrides to agent runtime classification. */
/**
 * When a session key and persisted session metadata identify an ACP
 * control-plane session, override the resolved runtime metadata to report the
 * ACP runtime id with a "session-key" source — regardless of what the
 * agent-config policy resolved to.
 *
 * Callers that already have model/provider context (resolveModelAgentRuntimeMetadata)
 * still benefit here because the model-runtime policy chain does not inspect session
 * keys for the ACP indicator.
 *
 * Key shape alone is not sufficient: ACP bridge sessions may use ACP-shaped
 * keys without persisted SessionAcpMeta and still run the configured model.
 *
 * When `acpBackend` is provided and non-empty, it is used as the runtime id so that
 * sessions backed by a configured non-default ACP backend (e.g. a custom registered
 * backend) are reported faithfully instead of always being labelled "acpx".
 * Falls back to "acpx" when no backend is known.
 */
function applyAcpRuntimeOverlay(meta, sessionKey, acpRuntime, acpBackend) {
  if (acpRuntime === true && isAcpSessionKey(sessionKey))
    return {
      id: acpBackend && acpBackend.length > 0 ? acpBackend : "acpx",
      source: "session-key",
    };
  return meta;
}
//#endregion
//#region src/agents/agent-runtime-metadata.ts
/** Resolves the runtime id/source that should be reported for a model-backed agent session. */
function resolveModelAgentRuntimeMetadata(params) {
  const persistedRuntimeId = resolvePersistedSessionRuntimeId(params.sessionEntry);
  if (persistedRuntimeId && !isDefaultAgentRuntimeId(persistedRuntimeId))
    return applyAcpRuntimeOverlay(
      {
        id: persistedRuntimeId,
        source: "session",
      },
      params.sessionKey,
      params.acpRuntime,
      params.acpBackend,
    );
  const resolved =
    params.provider && params.model
      ? {
          provider: params.provider,
          model: params.model,
        }
      : resolveDefaultModelForAgent({
          cfg: params.cfg,
          agentId: params.agentId,
        });
  const policy = resolveAgentHarnessPolicy({
    provider: resolved.provider,
    modelId: resolved.model,
    config: params.cfg,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
  return applyAcpRuntimeOverlay(
    {
      id: policy.runtime,
      source: policy.runtimeSource ?? "implicit",
    },
    params.sessionKey,
    params.acpRuntime,
    params.acpBackend,
  );
}
//#endregion
export { resolveModelAgentRuntimeMetadata as t };
