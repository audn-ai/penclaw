import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { i as resolveMatrixAccount } from "./accounts-qvek289C.js";
import { r as createChannelApprovalNativeRuntimeAdapter } from "./approval-handler-runtime-DQaz0bRA.js";
import { t as buildChannelApprovalNativeTargetKey } from "./approval-native-target-key-QkHNZRcL.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import {
  a as unregisterMatrixApprovalReactionTarget,
  n as listMatrixApprovalReactionBindings,
  r as registerMatrixApprovalReactionTarget,
  t as buildMatrixApprovalReactionHint,
} from "./approval-reactions-B5cjAGK0.js";
import "./routing-CwvmVRHd.js";
import {
  i as buildPluginApprovalResolvedReplyPayload,
  r as buildPluginApprovalPendingReplyPayload,
} from "./approval-renderers-DA2dW1_1.js";
import { i as repairMatrixDirectRooms } from "./direct-management-C8DSVoOg.js";
import { o as buildExecApprovalPendingReplyPayload } from "./exec-approval-reply-Djiq6tOJ.js";
import "./approval-handler-runtime-Ik2UNXyz.js";
import "./approval-native-runtime-BCKDIyz_.js";
import "./approval-reply-runtime-BpszN-io.js";
import "./approval-runtime-LmbhNzmC.js";
import "./channel-outbound-DlkFd7rO.js";
import "./retry-runtime-DCStwGTN.js";
import {
  c as shouldHandleMatrixApprovalRequest,
  r as isMatrixAnyApprovalClientEnabled,
} from "./exec-approvals-BQVf9_eL.js";
import { n as editMatrixMessage, t as deleteMatrixMessage } from "./messages-D0Vaif56.js";
import {
  n as listMessageReceiptPlatformIds,
  r as resolveMessageReceiptPrimaryId,
} from "./receipt-C0uxiauk.js";
import { t as retryAsync } from "./retry-CcVvEFm0.js";
import {
  a as sendMessageMatrix,
  c as sendSingleTextMessageMatrix,
  i as reactMatrixMessage,
} from "./send-DDFybVmB.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
import { a as resolveMatrixTargetIdentity } from "./target-ids-CmrXcyY1.js";
//#region extensions/matrix/src/approval-handler.runtime.ts
const MATRIX_APPROVAL_METADATA_KEY = "com.openclaw.approval";
const MATRIX_APPROVAL_DELIVERY_ATTEMPTS = 3;
const MATRIX_APPROVAL_DELIVERY_RETRY_DELAY_MS = 250;
function resolveHandlerContext(params) {
  const context = params.context;
  const accountId = params.accountId?.trim() || "";
  if (!context?.client || !accountId) return null;
  return {
    accountId,
    context,
  };
}
function normalizePendingMessageIds(entry) {
  return normalizeUniqueStringEntries(entry.platformMessageIds);
}
function normalizeReactionTargetRef(params) {
  const accountId = normalizeAccountId(params.accountId);
  const roomId = params.roomId.trim();
  const eventId = params.eventId.trim();
  if (!accountId || !roomId || !eventId) return null;
  return {
    accountId,
    roomId,
    eventId,
  };
}
function normalizeThreadId(value) {
  return (value == null ? "" : String(value).trim()) || void 0;
}
function isSingleMatrixMessageLimitError(error) {
  return (
    error instanceof Error && error.message.includes("Matrix single-message text exceeds limit")
  );
}
async function retryMatrixApprovalDelivery(operation, params = {}) {
  return await retryAsync(operation, {
    attempts: MATRIX_APPROVAL_DELIVERY_ATTEMPTS,
    minDelayMs: MATRIX_APPROVAL_DELIVERY_RETRY_DELAY_MS,
    shouldRetry: (error) => params.shouldRetry?.(error) !== false,
  });
}
async function prepareTarget(params) {
  const resolved = resolveHandlerContext(params);
  if (!resolved) return null;
  const target = resolveMatrixTargetIdentity(params.rawTarget.to);
  if (!target) return null;
  const threadId = normalizeThreadId(params.rawTarget.threadId);
  if (target.kind === "user") {
    const account = resolveMatrixAccount({
      cfg: params.cfg,
      accountId: resolved.accountId,
    });
    const repairDirectRooms = resolved.context.deps?.repairDirectRooms ?? repairMatrixDirectRooms;
    const repaired = await retryMatrixApprovalDelivery(
      async () =>
        await repairDirectRooms({
          client: resolved.context.client,
          remoteUserId: target.id,
          encrypted: account.config.encryption === true,
        }),
    );
    if (!repaired.activeRoomId) return null;
    return {
      to: `room:${repaired.activeRoomId}`,
      roomId: repaired.activeRoomId,
      threadId,
    };
  }
  return {
    to: `room:${target.id}`,
    roomId: target.id,
    threadId,
  };
}
function buildMatrixApprovalMetadata(params) {
  const base = {
    version: 1,
    type: "approval.request",
    id: params.view.approvalId,
    state: "pending",
    kind: params.view.approvalKind,
    phase: params.view.phase,
    title: params.view.title,
    expiresAtMs: params.view.expiresAtMs,
    metadata: params.view.metadata,
    allowedDecisions: Array.from(params.allowedDecisions),
    actions: params.view.actions.map((action) => ({
      decision: action.decision,
      label: action.label,
      style: action.style,
      command: action.command,
    })),
    ...(params.view.description != null ? { description: params.view.description } : {}),
  };
  if (params.view.approvalKind === "plugin")
    return {
      ...base,
      kind: "plugin",
      severity: params.view.severity,
      ...(params.view.agentId != null ? { agentId: params.view.agentId } : {}),
      ...(params.view.pluginId != null ? { pluginId: params.view.pluginId } : {}),
      ...(params.view.toolName != null ? { toolName: params.view.toolName } : {}),
    };
  return {
    ...base,
    kind: "exec",
    commandText: params.view.commandText,
    ...(params.view.ask != null ? { ask: params.view.ask } : {}),
    ...(params.view.agentId != null ? { agentId: params.view.agentId } : {}),
    ...(params.view.commandPreview != null ? { commandPreview: params.view.commandPreview } : {}),
    ...(params.view.cwd != null ? { cwd: params.view.cwd } : {}),
    ...(params.view.envKeys != null ? { envKeys: params.view.envKeys } : {}),
    ...(params.view.host != null ? { host: params.view.host } : {}),
    ...(params.view.nodeId != null ? { nodeId: params.view.nodeId } : {}),
    ...(params.view.sessionKey != null ? { sessionKey: params.view.sessionKey } : {}),
  };
}
function buildPendingApprovalContent(params) {
  const allowedDecisions = params.view.actions.map((action) => action.decision);
  const payload =
    params.view.approvalKind === "plugin"
      ? buildPluginApprovalPendingReplyPayload({
          request: {
            id: params.view.approvalId,
            request: {
              title: params.view.title,
              description: params.view.description ?? "",
              severity: params.view.severity,
              toolName: params.view.toolName ?? void 0,
              pluginId: params.view.pluginId ?? void 0,
              agentId: params.view.agentId ?? void 0,
            },
            createdAtMs: 0,
            expiresAtMs: params.view.expiresAtMs,
          },
          nowMs: params.nowMs,
          allowedDecisions,
        })
      : buildExecApprovalPendingReplyPayload({
          approvalId: params.view.approvalId,
          approvalSlug: params.view.approvalId.slice(0, 8),
          approvalCommandId: params.view.approvalId,
          ask: params.view.ask ?? void 0,
          agentId: params.view.agentId ?? void 0,
          allowedDecisions,
          command: params.view.commandText,
          cwd: params.view.cwd ?? void 0,
          host: params.view.host === "node" ? "node" : "gateway",
          nodeId: params.view.nodeId ?? void 0,
          sessionKey: params.view.sessionKey ?? void 0,
          expiresAtMs: params.view.expiresAtMs,
          nowMs: params.nowMs,
        });
  const hint = buildMatrixApprovalReactionHint(allowedDecisions);
  const text = payload.text ?? "";
  return {
    approvalId: params.view.approvalId,
    text: hint ? (text ? `${hint}\n\n${text}` : hint) : text,
    allowedDecisions,
    extraContent: {
      [MATRIX_APPROVAL_METADATA_KEY]: buildMatrixApprovalMetadata({
        view: params.view,
        allowedDecisions,
      }),
    },
  };
}
function buildResolvedApprovalText(view) {
  if (view.approvalKind === "plugin")
    return (
      buildPluginApprovalResolvedReplyPayload({
        resolved: {
          id: view.approvalId,
          decision: view.decision,
          resolvedBy: view.resolvedBy ?? void 0,
          ts: 0,
        },
      }).text ?? ""
    );
  return [
    `Exec approval: ${view.decision === "allow-once" ? "Allowed once" : view.decision === "allow-always" ? "Allowed always" : "Denied"}`,
    "",
    "Command",
    buildMarkdownCodeBlock(view.commandText),
  ].join("\n");
}
function buildMarkdownCodeBlock(text) {
  const longestFence = Math.max(...Array.from(text.matchAll(/`+/g), (match) => match[0].length), 0);
  const fence = "`".repeat(Math.max(3, longestFence + 1));
  return [fence, text, fence].join("\n");
}
const matrixApprovalNativeRuntime = createChannelApprovalNativeRuntimeAdapter({
  eventKinds: ["exec", "plugin"],
  availability: {
    isConfigured: ({ cfg, accountId, context }) => {
      const resolved = resolveHandlerContext({
        cfg,
        accountId,
        context,
      });
      if (!resolved) return false;
      return isMatrixAnyApprovalClientEnabled({
        cfg,
        accountId: resolved.accountId,
      });
    },
    shouldHandle: ({ cfg, accountId, approvalKind, request, context }) => {
      const resolved = resolveHandlerContext({
        cfg,
        accountId,
        context,
      });
      if (!resolved) return false;
      return shouldHandleMatrixApprovalRequest({
        cfg,
        accountId: resolved.accountId,
        approvalKind,
        request,
      });
    },
  },
  presentation: {
    buildPendingPayload: ({ view, nowMs }) =>
      buildPendingApprovalContent({
        view,
        nowMs,
      }),
    buildResolvedResult: ({ view }) => ({
      kind: "update",
      payload: buildResolvedApprovalText(view),
    }),
    buildExpiredResult: () => ({ kind: "delete" }),
  },
  transport: {
    prepareTarget: ({ cfg, accountId, context, plannedTarget }) => {
      return prepareTarget({
        cfg,
        accountId,
        context,
        rawTarget: plannedTarget.target,
      }).then((preparedTarget) =>
        preparedTarget
          ? {
              dedupeKey: buildChannelApprovalNativeTargetKey({
                to: preparedTarget.roomId,
                threadId: preparedTarget.threadId,
              }),
              target: preparedTarget,
            }
          : null,
      );
    },
    deliverPending: async ({ cfg, accountId, context, preparedTarget, pendingPayload, view }) => {
      const resolved = resolveHandlerContext({
        cfg,
        accountId,
        context,
      });
      if (!resolved) return null;
      const sendSingleTextMessage =
        resolved.context.deps?.sendSingleTextMessage ?? sendSingleTextMessageMatrix;
      const reactMessage = resolved.context.deps?.reactMessage ?? reactMatrixMessage;
      let result;
      try {
        result = await retryMatrixApprovalDelivery(
          async () =>
            await sendSingleTextMessage(preparedTarget.to, pendingPayload.text, {
              cfg,
              accountId: resolved.accountId,
              client: resolved.context.client,
              threadId: preparedTarget.threadId,
              extraContent: pendingPayload.extraContent,
            }),
          { shouldRetry: (error) => !isSingleMatrixMessageLimitError(error) },
        );
      } catch (error) {
        if (!isSingleMatrixMessageLimitError(error)) throw error;
        const sendMessage = resolved.context.deps?.sendMessage ?? sendMessageMatrix;
        result = await retryMatrixApprovalDelivery(
          async () =>
            await sendMessage(preparedTarget.to, pendingPayload.text, {
              cfg,
              accountId: resolved.accountId,
              client: resolved.context.client,
              threadId: preparedTarget.threadId,
              extraContent: pendingPayload.extraContent,
            }),
        );
      }
      const receiptMessageIds = listMessageReceiptPlatformIds(result.receipt);
      const platformMessageIds = receiptMessageIds.length
        ? receiptMessageIds
        : [result.messageId.trim()].filter(Boolean);
      const reactionEventId =
        resolveMessageReceiptPrimaryId(result.receipt) ||
        result.primaryMessageId?.trim() ||
        platformMessageIds[0] ||
        result.messageId.trim();
      registerMatrixApprovalReactionTarget({
        accountId: resolved.accountId,
        roomId: result.roomId,
        eventId: reactionEventId,
        approvalId: pendingPayload.approvalId,
        approvalKind: view.approvalKind,
        allowedDecisions: pendingPayload.allowedDecisions,
        ttlMs: view.expiresAtMs - Date.now(),
      });
      await Promise.allSettled(
        listMatrixApprovalReactionBindings(pendingPayload.allowedDecisions).map(
          async ({ emoji }) => {
            await reactMessage(result.roomId, reactionEventId, emoji, {
              cfg,
              accountId: resolved.accountId,
              client: resolved.context.client,
            });
          },
        ),
      );
      return {
        roomId: result.roomId,
        platformMessageIds,
        reactionEventId,
      };
    },
    updateEntry: async ({ cfg, accountId, context, entry, payload }) => {
      const resolved = resolveHandlerContext({
        cfg,
        accountId,
        context,
      });
      if (!resolved) return;
      const editMessage = resolved.context.deps?.editMessage ?? editMatrixMessage;
      const deleteMessage = resolved.context.deps?.deleteMessage ?? deleteMatrixMessage;
      const [primaryMessageId, ...staleMessageIds] = normalizePendingMessageIds(entry);
      if (!primaryMessageId) return;
      const text = payload;
      await Promise.allSettled([
        editMessage(entry.roomId, primaryMessageId, text, {
          cfg,
          accountId: resolved.accountId,
          client: resolved.context.client,
        }),
        ...staleMessageIds.map(async (messageId) => {
          await deleteMessage(entry.roomId, messageId, {
            cfg,
            accountId: resolved.accountId,
            client: resolved.context.client,
            reason: "approval resolved",
          });
        }),
      ]);
    },
    deleteEntry: async ({ cfg, accountId, context, entry, phase }) => {
      const resolved = resolveHandlerContext({
        cfg,
        accountId,
        context,
      });
      if (!resolved) return;
      const deleteMessage = resolved.context.deps?.deleteMessage ?? deleteMatrixMessage;
      await Promise.allSettled(
        normalizePendingMessageIds(entry).map(async (messageId) => {
          await deleteMessage(entry.roomId, messageId, {
            cfg,
            accountId: resolved.accountId,
            client: resolved.context.client,
            reason: phase === "expired" ? "approval expired" : "approval resolved",
          });
        }),
      );
    },
  },
  interactions: {
    bindPending: (params) => {
      const accountId = params.accountId?.trim();
      if (!accountId) return null;
      const target = normalizeReactionTargetRef({
        accountId,
        roomId: params.entry.roomId,
        eventId: params.entry.reactionEventId,
      });
      if (!target) return null;
      registerMatrixApprovalReactionTarget({
        accountId: target.accountId,
        roomId: target.roomId,
        eventId: target.eventId,
        approvalId: params.pendingPayload.approvalId,
        approvalKind: params.view.approvalKind,
        allowedDecisions: params.pendingPayload.allowedDecisions,
        ttlMs: params.view.expiresAtMs - Date.now(),
      });
      return target;
    },
    unbindPending: (params) => {
      const target = normalizeReactionTargetRef(params.binding);
      if (!target) return;
      unregisterMatrixApprovalReactionTarget(target);
    },
    cancelDelivered: (params) => {
      const accountId = params.accountId?.trim();
      if (!accountId) return;
      const target = normalizeReactionTargetRef({
        accountId,
        roomId: params.entry.roomId,
        eventId: params.entry.reactionEventId,
      });
      if (!target) return;
      unregisterMatrixApprovalReactionTarget(target);
    },
  },
});
//#endregion
export { matrixApprovalNativeRuntime };
