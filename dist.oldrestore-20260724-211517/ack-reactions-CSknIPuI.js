import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import "./errors-BoHeli7m.js";
//#region src/channels/ack-reactions.ts
/** Channel-level policy for which inbound messages should receive an ack reaction. */
/** Resolves the generic ack reaction gate without sending or removing reactions. */
function shouldAckReaction(params) {
  const scope = params.scope ?? "group-mentions";
  if (scope === "off" || scope === "none") return false;
  if (params.inboundEventKind === "room_event" && scope !== "all") return false;
  if (scope === "all") return true;
  if (scope === "direct") return params.isDirect;
  if (scope === "group-all") return params.isGroup;
  if (scope === "group-mentions") {
    if (!params.isMentionableGroup) return false;
    if (!params.requireMention) return false;
    if (!params.canDetectMention) return false;
    return params.effectiveWasMentioned || params.shouldBypassMention === true;
  }
  return false;
}
/** Resolves WhatsApp ack policy while preserving the shared mention-only group gate. */
function shouldAckReactionForWhatsApp(params) {
  if (!params.emoji) return false;
  if (params.isDirect) return params.directEnabled;
  if (!params.isGroup) return false;
  if (params.groupMode === "never") return false;
  if (params.groupMode === "always") return true;
  return shouldAckReaction({
    scope: "group-mentions",
    isDirect: false,
    isGroup: true,
    isMentionableGroup: true,
    requireMention: true,
    canDetectMention: true,
    effectiveWasMentioned: params.wasMentioned,
    shouldBypassMention: params.groupActivated,
  });
}
/** Starts sending an ack reaction and returns the success-tracking cleanup handle. */
function createAckReactionHandle(params) {
  const ackReactionValue = params.ackReactionValue.trim();
  if (!ackReactionValue) return null;
  let sendPromise;
  try {
    sendPromise = params.send();
  } catch (err) {
    sendPromise = Promise.reject(toErrorObject(err, "Non-Error rejection"));
  }
  return {
    ackReactionPromise: sendPromise.then(
      () => true,
      (err) => {
        params.onSendError?.(err);
        return false;
      },
    ),
    ackReactionValue,
    remove: params.remove,
  };
}
/** Schedules removal of a previously sent ack reaction after reply delivery. */
function removeAckReactionAfterReply(params) {
  if (!params.removeAfterReply) return;
  if (!params.ackReactionPromise) return;
  if (!params.ackReactionValue) return;
  params.ackReactionPromise.then((didAck) => {
    if (!didAck) return;
    params.remove().catch((err) => params.onError?.(err));
  });
}
/** Convenience wrapper that removes an ack reaction handle after reply delivery. */
function removeAckReactionHandleAfterReply(params) {
  removeAckReactionAfterReply({
    removeAfterReply: params.removeAfterReply,
    ackReactionPromise: params.ackReaction?.ackReactionPromise ?? null,
    ackReactionValue: params.ackReaction?.ackReactionValue ?? null,
    remove: params.ackReaction?.remove ?? (async () => {}),
    onError: params.onError,
  });
}
//#endregion
export {
  shouldAckReactionForWhatsApp as a,
  shouldAckReaction as i,
  removeAckReactionAfterReply as n,
  removeAckReactionHandleAfterReply as r,
  createAckReactionHandle as t,
};
