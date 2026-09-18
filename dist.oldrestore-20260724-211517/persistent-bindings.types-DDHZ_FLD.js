import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { o as sha256HexPrefix } from "./crypto-digest-CNeb2i19.js";
import { d as resolveAgentIdFromSessionKey, m as sanitizeAgentId } from "./session-key-druuY-GG.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/acp/persistent-bindings.types.ts
/** Types and normalization helpers for configured channel-to-ACP persistent bindings. */
/** Normalizes binding mode, defaulting to persistent sessions. */
function normalizeMode(value) {
  return normalizeOptionalLowercaseString(value) === "oneshot" ? "oneshot" : "persistent";
}
/** Extracts supported ACP binding config keys from unknown plugin config. */
function normalizeBindingConfig(raw) {
  if (!raw || typeof raw !== "object") return {};
  const shape = raw;
  const mode = normalizeOptionalString(shape.mode);
  return {
    mode: mode ? normalizeMode(mode) : void 0,
    cwd: normalizeOptionalString(shape.cwd),
    backend: normalizeOptionalString(shape.backend),
    label: normalizeOptionalString(shape.label),
  };
}
function buildBindingHash(params) {
  return sha256HexPrefix(`${params.channel}:${params.accountId}:${params.conversationId}`, 16);
}
/** Builds the stable generated ACP session key for a configured binding. */
function buildConfiguredAcpSessionKey(spec) {
  const hash = buildBindingHash({
    channel: spec.channel,
    accountId: spec.accountId,
    conversationId: spec.conversationId,
  });
  return `agent:${sanitizeAgentId(spec.agentId)}:acp:binding:${spec.channel}:${spec.accountId}:${hash}`;
}
/** Converts a configured ACP binding spec into an outbound session binding record. */
function toConfiguredAcpBindingRecord(spec) {
  return {
    bindingId: `config:acp:${spec.channel}:${spec.accountId}:${spec.conversationId}`,
    targetSessionKey: buildConfiguredAcpSessionKey(spec),
    targetKind: "session",
    conversation: {
      channel: spec.channel,
      accountId: spec.accountId,
      conversationId: spec.conversationId,
      parentConversationId: spec.parentConversationId,
    },
    status: "active",
    boundAt: 0,
    metadata: {
      source: "config",
      mode: spec.mode,
      agentId: spec.agentId,
      ...(spec.acpAgentId ? { acpAgentId: spec.acpAgentId } : {}),
      label: spec.label,
      ...(spec.backend ? { backend: spec.backend } : {}),
      ...(spec.cwd ? { cwd: spec.cwd } : {}),
    },
  };
}
/** Parses generated configured-binding session keys back to channel/account identity. */
function parseConfiguredAcpSessionKey(sessionKey) {
  const trimmed = sessionKey.trim();
  if (!trimmed.startsWith("agent:")) return null;
  const rest = trimmed.slice(trimmed.indexOf(":") + 1);
  const nextSeparator = rest.indexOf(":");
  if (nextSeparator === -1) return null;
  const tokens = rest.slice(nextSeparator + 1).split(":");
  if (tokens.length !== 5 || tokens[0] !== "acp" || tokens[1] !== "binding") return null;
  const channel = normalizeOptionalLowercaseString(tokens[2]);
  if (!channel) return null;
  return {
    channel,
    accountId: normalizeAccountId(tokens[3] ?? "default"),
  };
}
function resolveConfiguredAcpBindingSpecFromRecord(record) {
  if (record.targetKind !== "session") return null;
  const conversationId = record.conversation.conversationId.trim();
  if (!conversationId) return null;
  const agentId =
    normalizeOptionalString(record.metadata?.agentId) ??
    resolveAgentIdFromSessionKey(record.targetSessionKey);
  if (!agentId) return null;
  return {
    channel: record.conversation.channel,
    accountId: normalizeAccountId(record.conversation.accountId),
    conversationId,
    parentConversationId: normalizeOptionalString(record.conversation.parentConversationId),
    agentId,
    acpAgentId: normalizeOptionalString(record.metadata?.acpAgentId),
    mode: normalizeMode(record.metadata?.mode),
    cwd: normalizeOptionalString(record.metadata?.cwd),
    backend: normalizeOptionalString(record.metadata?.backend),
    label: normalizeOptionalString(record.metadata?.label),
  };
}
function toResolvedConfiguredAcpBinding(record) {
  const spec = resolveConfiguredAcpBindingSpecFromRecord(record);
  if (!spec) return null;
  return {
    spec,
    record,
  };
}
//#endregion
export {
  resolveConfiguredAcpBindingSpecFromRecord as a,
  parseConfiguredAcpSessionKey as i,
  normalizeBindingConfig as n,
  toConfiguredAcpBindingRecord as o,
  normalizeMode as r,
  toResolvedConfiguredAcpBinding as s,
  buildConfiguredAcpSessionKey as t,
};
