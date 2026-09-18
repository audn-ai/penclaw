import { createHmac } from "node:crypto";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as normalizeChatType } from "./chat-type-BARlA53h.js";
import {
  f as ensureExecApprovalsSnapshot,
  y as loadExecApprovalsAsync,
} from "./exec-approvals-Bz218bS2.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/agent-runtime-identity-token.ts
const AGENT_RUNTIME_IDENTITY_TOKEN_CONTEXT = "openclaw:gateway-agent-runtime-identity-token:v1";
const AGENT_RUNTIME_IDENTITY_TOKEN_KIND = "agent-runtime";
async function readSharedAgentRuntimeIdentitySecret() {
  return (await loadExecApprovalsAsync()).socket?.token?.trim() || null;
}
async function requireSharedAgentRuntimeIdentitySecret() {
  const token = (await ensureExecApprovalsSnapshot()).file.socket?.token?.trim();
  if (!token)
    throw new Error(
      "Unable to mint agent runtime identity token without local socket credentials.",
    );
  return token;
}
function signPayload(secret, payload) {
  return createHmac("sha256", secret)
    .update(AGENT_RUNTIME_IDENTITY_TOKEN_CONTEXT)
    .update("\0")
    .update(payload)
    .digest("base64url");
}
function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}
function decodeMessageActionContext(value, nowMs) {
  if (
    !isRecord(value) ||
    typeof value.expiresAtMs !== "number" ||
    !Number.isFinite(value.expiresAtMs) ||
    nowMs >= value.expiresAtMs
  )
    return;
  const rawToolContext = value.toolContext;
  if (rawToolContext !== void 0 && !isRecord(rawToolContext)) return;
  const rawCurrentChatType = rawToolContext?.currentChatType;
  const currentChatType = normalizeChatType(
    typeof rawCurrentChatType === "string" ? rawCurrentChatType : void 0,
  );
  const currentMessageId = rawToolContext?.currentMessageId;
  const replyToMode = rawToolContext?.replyToMode;
  const hasRepliedRef = rawToolContext?.hasRepliedRef;
  if (
    (currentMessageId !== void 0 &&
      typeof currentMessageId !== "string" &&
      typeof currentMessageId !== "number") ||
    (replyToMode !== void 0 &&
      replyToMode !== "off" &&
      replyToMode !== "first" &&
      replyToMode !== "all" &&
      replyToMode !== "batched") ||
    (hasRepliedRef !== void 0 &&
      (!isRecord(hasRepliedRef) || typeof hasRepliedRef.value !== "boolean"))
  )
    return;
  const readOptionalBoolean = (key) => {
    const candidate = rawToolContext?.[key];
    return typeof candidate === "boolean" ? candidate : void 0;
  };
  const toolContext = rawToolContext
    ? {
        currentChannelId: normalizeOptionalString(rawToolContext.currentChannelId),
        currentChatType,
        currentMessagingTarget: normalizeOptionalString(rawToolContext.currentMessagingTarget),
        currentGraphChannelId: normalizeOptionalString(rawToolContext.currentGraphChannelId),
        currentChannelProvider: normalizeOptionalString(rawToolContext.currentChannelProvider),
        currentThreadTs: normalizeOptionalString(rawToolContext.currentThreadTs),
        currentMessageId,
        replyToMode:
          replyToMode === "off" ||
          replyToMode === "first" ||
          replyToMode === "all" ||
          replyToMode === "batched"
            ? replyToMode
            : void 0,
        hasRepliedRef:
          isRecord(hasRepliedRef) && typeof hasRepliedRef.value === "boolean"
            ? { value: hasRepliedRef.value }
            : void 0,
        sameChannelThreadRequired: readOptionalBoolean("sameChannelThreadRequired"),
        skipCrossContextDecoration: readOptionalBoolean("skipCrossContextDecoration"),
      }
    : void 0;
  return {
    expiresAtMs: value.expiresAtMs,
    sessionId: normalizeOptionalString(value.sessionId),
    requesterAccountId: normalizeOptionalString(value.requesterAccountId),
    requesterSenderId: normalizeOptionalString(value.requesterSenderId),
    toolContext,
  };
}
function decodePayload(value, nowMs) {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object") return;
    const raw = parsed;
    if (
      raw.kind !== AGENT_RUNTIME_IDENTITY_TOKEN_KIND ||
      typeof raw.agentId !== "string" ||
      typeof raw.sessionKey !== "string"
    )
      return;
    const agentId = normalizeAgentId(raw.agentId);
    const sessionKey = raw.sessionKey.trim();
    if (!agentId || !sessionKey) return;
    const messageActionContext =
      raw.messageActionContext === void 0
        ? void 0
        : decodeMessageActionContext(raw.messageActionContext, nowMs);
    if (raw.messageActionContext !== void 0 && !messageActionContext) return;
    return {
      kind: AGENT_RUNTIME_IDENTITY_TOKEN_KIND,
      agentId,
      sessionKey,
      ...(messageActionContext ? { messageActionContext } : {}),
    };
  } catch {
    return;
  }
}
/** Mint an opaque token that lets trusted local agent-tool clients identify their agent. */
async function mintAgentRuntimeIdentityToken(params) {
  const payload = encodePayload({
    kind: AGENT_RUNTIME_IDENTITY_TOKEN_KIND,
    agentId: normalizeAgentId(params.agentId),
    sessionKey: params.sessionKey.trim(),
    ...(params.messageActionContext ? { messageActionContext: params.messageActionContext } : {}),
  });
  return `${payload}.${signPayload(await requireSharedAgentRuntimeIdentitySecret(), payload)}`;
}
/** Validate a presented agent runtime token and return the internal caller identity. */
async function verifyAgentRuntimeIdentityToken(value, nowMs) {
  const token = value?.trim();
  if (!token) return;
  const [payloadPart, signature, ...extra] = token.split(".");
  if (!payloadPart || !signature || extra.length > 0) return;
  const sharedSecret = await readSharedAgentRuntimeIdentitySecret();
  if (!sharedSecret || !safeEqualSecret(signature, signPayload(sharedSecret, payloadPart))) return;
  const payload = decodePayload(payloadPart, nowMs ?? Date.now());
  if (!payload) return;
  return {
    kind: "agentRuntime",
    agentId: payload.agentId,
    sessionKey: payload.sessionKey,
    ...(payload.messageActionContext ? { messageActionContext: payload.messageActionContext } : {}),
  };
}
//#endregion
export { verifyAgentRuntimeIdentityToken as n, mintAgentRuntimeIdentityToken as t };
