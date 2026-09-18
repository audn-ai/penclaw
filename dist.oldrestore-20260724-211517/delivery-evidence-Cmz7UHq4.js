//#region src/agents/cli-runner/delivery-evidence.ts
const CLI_MESSAGING_DELIVERY_EVIDENCE_KEY = "cliMessagingDeliveryEvidence";
function snapshotCliMessagingDeliveryEvidence(output) {
  if (output.didSendViaMessagingTool !== true) return;
  return {
    didSendViaMessagingTool: true,
    ...(output.didDeliverSourceReplyViaMessageTool
      ? { didDeliverSourceReplyViaMessageTool: true }
      : {}),
    ...(output.messagingToolSentTexts?.length
      ? { messagingToolSentTexts: output.messagingToolSentTexts.slice() }
      : {}),
    ...(output.messagingToolSentMediaUrls?.length
      ? { messagingToolSentMediaUrls: output.messagingToolSentMediaUrls.slice() }
      : {}),
    ...(output.messagingToolSentTargets?.length
      ? { messagingToolSentTargets: output.messagingToolSentTargets.slice() }
      : {}),
    ...(output.messagingToolSourceReplyPayloads?.length
      ? { messagingToolSourceReplyPayloads: output.messagingToolSourceReplyPayloads.slice() }
      : {}),
  };
}
/** Attaches confirmed delivery evidence so caller retries cannot duplicate a visible send. */
function attachCliMessagingDeliveryEvidence(error, output) {
  const evidence = snapshotCliMessagingDeliveryEvidence(output);
  if (!evidence) return error;
  if (error && typeof error === "object")
    try {
      Object.assign(error, { [CLI_MESSAGING_DELIVERY_EVIDENCE_KEY]: evidence });
      return error;
    } catch {}
  const wrapped = new Error(error instanceof Error ? error.message : String(error), {
    cause: error,
  });
  Object.assign(wrapped, { [CLI_MESSAGING_DELIVERY_EVIDENCE_KEY]: evidence });
  return wrapped;
}
/** Reads confirmed delivery evidence from a failed CLI attempt. */
function getCliMessagingDeliveryEvidence(error) {
  if (!error || typeof error !== "object") return;
  const evidence = error[CLI_MESSAGING_DELIVERY_EVIDENCE_KEY];
  return evidence && typeof evidence === "object"
    ? snapshotCliMessagingDeliveryEvidence(evidence)
    : void 0;
}
//#endregion
export { getCliMessagingDeliveryEvidence as n, attachCliMessagingDeliveryEvidence as t };
