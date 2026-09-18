import { a as resolveMatrixAccountConfig } from "./account-config-Cth1-JFA.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import {
  i as resolveMatrixApprovalReactionTargetWithPersistence,
  o as unregisterMatrixApprovalReactionTargetsForApproval,
} from "./approval-reactions-B5cjAGK0.js";
import "./routing-CwvmVRHd.js";
import "./session-binding-runtime-BT6E-T95.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { a as extractMatrixReactionAnnotation } from "./reaction-common-DQN9ie7R.js";
import {
  i as resolveMatrixThreadRouting,
  r as resolveMatrixThreadRootId,
  t as resolveMatrixInboundRoute,
} from "./route-BVsVTBX9.js";
import { n as getSessionBindingService } from "./session-binding-service-DPVMwWUH.js";
//#region extensions/matrix/src/matrix/monitor/reaction-events.ts
const loadApprovalReactionAuth = createLazyRuntimeModule(
  () => import("./approval-reaction-auth-BL4ylrZ_.js"),
);
const loadExecApprovalResolver = createLazyRuntimeModule(
  () => import("./exec-approval-resolver-BqkLSUzN.js"),
);
const loadMatrixSend = createLazyRuntimeModule(() => import("./send-9ZbyuTAU.js"));
function buildMatrixApprovalTerminalText(result) {
  const approval = result.approval;
  const terminalLabel =
    approval.status === "allowed"
      ? approval.decision === "allow-always"
        ? "Allowed always"
        : "Allowed once"
      : approval.status === "denied"
        ? "Denied"
        : approval.status === "expired"
          ? "Expired"
          : "Cancelled";
  return `${result.applied ? "Resolved" : "Already resolved"}: ${terminalLabel}\n\nID: ${approval.id}`;
}
async function retireMatrixApprovalReactionTargets(params) {
  const accountId = normalizeAccountId(params.accountId);
  const registeredTargets = await unregisterMatrixApprovalReactionTargetsForApproval({
    accountId,
    approvalId: params.approvalId,
    approvalKind: params.approvalKind,
  });
  const targets = /* @__PURE__ */ new Map();
  for (const target of [
    ...registeredTargets,
    {
      accountId,
      roomId: params.roomId,
      eventId: params.targetEventId,
    },
  ])
    targets.set(JSON.stringify([target.accountId, target.roomId, target.eventId]), target);
  const { editMessageMatrix } = await loadMatrixSend();
  const terminalText = buildMatrixApprovalTerminalText(params.result);
  const failedUpdates = (
    await Promise.allSettled(
      Array.from(targets.values(), async (target) => {
        await editMessageMatrix(target.roomId, target.eventId, terminalText, {
          cfg: params.cfg,
          accountId: target.accountId,
          client: params.client,
        });
      }),
    )
  ).filter((update) => update.status === "rejected").length;
  if (failedUpdates > 0)
    params.logVerboseMessage(
      `matrix: failed to terminalize ${failedUpdates} approval prompt(s) id=${params.approvalId}`,
    );
}
function resolveMatrixReactionNotificationMode(params) {
  const matrixConfig = params.cfg.channels?.matrix;
  return (
    resolveMatrixAccountConfig({
      cfg: params.cfg,
      accountId: params.accountId,
    }).reactionNotifications ??
    matrixConfig?.reactionNotifications ??
    "own"
  );
}
async function maybeResolveMatrixApprovalReaction(params) {
  if (!params.target) return false;
  const { isMatrixApprovalReactionAuthorizedSender } = await loadApprovalReactionAuth();
  if (
    !isMatrixApprovalReactionAuthorizedSender({
      ...params,
      approvalKind: params.target.approvalKind,
    })
  )
    return false;
  const { isApprovalNotFoundError, resolveMatrixApproval } = await loadExecApprovalResolver();
  try {
    const result = await resolveMatrixApproval({
      cfg: params.cfg,
      approvalId: params.target.approvalId,
      approvalKind: params.target.approvalKind,
      decision: params.target.decision,
      senderId: params.senderId,
    });
    await retireMatrixApprovalReactionTargets({
      cfg: params.cfg,
      accountId: params.accountId,
      client: params.client,
      roomId: params.roomId,
      targetEventId: params.targetEventId,
      approvalId: params.target.approvalId,
      approvalKind: params.target.approvalKind,
      result,
      logVerboseMessage: params.logVerboseMessage,
    });
    const canonicalDecision = "decision" in result.approval ? result.approval.decision : "none";
    params.logVerboseMessage(
      `matrix: approval reaction resolved id=${params.target.approvalId} sender=${params.senderId} applied=${result.applied} status=${result.approval.status} decision=${canonicalDecision}`,
    );
    return true;
  } catch (err) {
    if (isApprovalNotFoundError(err)) {
      await unregisterMatrixApprovalReactionTargetsForApproval({
        accountId: params.accountId,
        approvalId: params.target.approvalId,
        approvalKind: params.target.approvalKind,
      });
      params.logVerboseMessage(
        `matrix: approval reaction ignored for expired approval id=${params.target.approvalId} sender=${params.senderId}`,
      );
      return true;
    }
    params.logVerboseMessage(
      `matrix: approval reaction failed id=${params.target.approvalId} sender=${params.senderId}: ${String(err)}`,
    );
    return true;
  }
}
async function handleInboundMatrixReaction(params) {
  const reaction = extractMatrixReactionAnnotation(params.event.content);
  if (!reaction?.eventId) return;
  if (params.senderId === params.selfUserId) return;
  const approvalTarget = await resolveMatrixApprovalReactionTargetWithPersistence({
    accountId: params.accountId,
    roomId: params.roomId,
    eventId: reaction.eventId,
    reactionKey: reaction.key,
  });
  if (
    await maybeResolveMatrixApprovalReaction({
      cfg: params.cfg,
      accountId: params.accountId,
      senderId: params.senderId,
      target: approvalTarget,
      targetEventId: reaction.eventId,
      roomId: params.roomId,
      client: params.client,
      logVerboseMessage: params.logVerboseMessage,
    })
  )
    return;
  const notificationMode = resolveMatrixReactionNotificationMode({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (notificationMode === "off") return;
  const targetEvent = await params.client.getEvent(params.roomId, reaction.eventId).catch((err) => {
    params.logVerboseMessage(
      `matrix: failed resolving reaction target room=${params.roomId} id=${reaction.eventId}: ${String(err)}`,
    );
    return null;
  });
  const targetSender =
    targetEvent && typeof targetEvent.sender === "string" ? targetEvent.sender.trim() : "";
  if (!targetSender) return;
  if (notificationMode === "own" && targetSender !== params.selfUserId) return;
  const targetContent =
    targetEvent && targetEvent.content && typeof targetEvent.content === "object"
      ? targetEvent.content
      : void 0;
  const threadRootId = targetContent
    ? resolveMatrixThreadRootId({
        event: targetEvent,
        content: targetContent,
      })
    : void 0;
  const accountConfig = resolveMatrixAccountConfig({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  const thread = resolveMatrixThreadRouting({
    isDirectMessage: params.isDirectMessage,
    threadReplies: accountConfig.threadReplies ?? "inbound",
    dmThreadReplies: accountConfig.dm?.threadReplies,
    messageId: reaction.eventId,
    threadRootId,
  });
  const { route, runtimeBindingId } = resolveMatrixInboundRoute({
    cfg: params.cfg,
    accountId: params.accountId,
    roomId: params.roomId,
    senderId: params.senderId,
    isDirectMessage: params.isDirectMessage,
    dmSessionScope: accountConfig.dm?.sessionScope ?? "per-user",
    threadId: thread.threadId,
    eventTs: params.event.origin_server_ts,
    resolveAgentRoute: params.core.channel.routing.resolveAgentRoute,
  });
  if (runtimeBindingId)
    getSessionBindingService().touch(runtimeBindingId, params.event.origin_server_ts);
  const text = `Matrix reaction added: ${reaction.key} by ${params.senderLabel} on msg ${reaction.eventId}`;
  params.core.system.enqueueSystemEvent(text, {
    sessionKey: route.sessionKey,
    contextKey: `matrix:reaction:add:${params.roomId}:${reaction.eventId}:${params.senderId}:${reaction.key}`,
  });
  params.logVerboseMessage(
    `matrix: reaction event enqueued room=${params.roomId} target=${reaction.eventId} sender=${params.senderId} emoji=${reaction.key}`,
  );
}
//#endregion
export { handleInboundMatrixReaction };
