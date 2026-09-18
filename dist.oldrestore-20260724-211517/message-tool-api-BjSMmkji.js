import { Type } from "typebox";
import "./channel-actions-C9vNf9jw.js";
import { a as resolveIMessageAccount } from "./accounts--1GXl2sX.js";
import { i as createActionGate } from "./common-DyDSUect.js";
import {
  n as imessageRpcSupportsMethod,
  t as getCachedIMessagePrivateApiStatus,
} from "./private-api-status-lj9GJ_TF.js";
import { n as inferIMessageTargetChatType } from "./targets-BO9NhvfG.js";
//#region extensions/imessage/src/actions-contract.ts
const IMESSAGE_ACTIONS = {
  react: { gate: "reactions" },
  edit: { gate: "edit" },
  unsend: { gate: "unsend" },
  reply: { gate: "reply" },
  sendWithEffect: { gate: "sendWithEffect" },
  renameGroup: {
    gate: "renameGroup",
    groupOnly: true,
  },
  setGroupIcon: {
    gate: "setGroupIcon",
    groupOnly: true,
  },
  addParticipant: {
    gate: "addParticipant",
    groupOnly: true,
  },
  removeParticipant: {
    gate: "removeParticipant",
    groupOnly: true,
  },
  leaveGroup: {
    gate: "leaveGroup",
    groupOnly: true,
  },
  sendAttachment: { gate: "sendAttachment" },
  poll: { gate: "polls" },
  "poll-vote": { gate: "polls" },
};
const IMESSAGE_ACTION_NAMES = Object.keys(IMESSAGE_ACTIONS);
//#endregion
//#region extensions/imessage/src/message-tool-api.ts
const PRIVATE_API_ACTIONS = /* @__PURE__ */ new Set([
  "react",
  "edit",
  "unsend",
  "reply",
  "sendWithEffect",
  "renameGroup",
  "setGroupIcon",
  "addParticipant",
  "removeParticipant",
  "leaveGroup",
  "sendAttachment",
  "poll",
  "poll-vote",
]);
function isGroupTarget(raw) {
  if (!raw) return false;
  return inferIMessageTargetChatType(raw) === "group";
}
function describeIMessageMessageTool({ cfg, accountId, currentChannelId }) {
  const account = resolveIMessageAccount({
    cfg,
    accountId,
  });
  if (!account.enabled || !account.configured) return null;
  const privateApiStatus = getCachedIMessagePrivateApiStatus(
    account.config.cliPath?.trim() || "imsg",
  );
  const gate = createActionGate(account.config.actions);
  const actions = /* @__PURE__ */ new Set();
  for (const action of IMESSAGE_ACTION_NAMES) {
    const spec = IMESSAGE_ACTIONS[action];
    if (!spec?.gate || !gate(spec.gate)) continue;
    if (privateApiStatus?.available === false && PRIVATE_API_ACTIONS.has(action)) continue;
    if (
      action === "edit" &&
      privateApiStatus?.selectors &&
      !privateApiStatus.selectors.editMessage &&
      !privateApiStatus.selectors.editMessageItem
    )
      continue;
    if (action === "unsend" && privateApiStatus?.selectors?.retractMessagePart !== true) continue;
    if (
      action === "poll" &&
      privateApiStatus?.selectors &&
      !privateApiStatus.selectors.pollPayloadMessage
    )
      continue;
    if (
      action === "poll-vote" &&
      privateApiStatus?.selectors &&
      !privateApiStatus.selectors.pollVoteMessage
    )
      continue;
    if (
      action === "poll-vote" &&
      privateApiStatus &&
      !imessageRpcSupportsMethod(privateApiStatus, "poll.vote")
    )
      continue;
    actions.add(action);
  }
  if (!isGroupTarget(currentChannelId)) {
    for (const action of IMESSAGE_ACTION_NAMES)
      if ("groupOnly" in IMESSAGE_ACTIONS[action] && IMESSAGE_ACTIONS[action].groupOnly)
        actions.delete(action);
  }
  if (actions.delete("sendAttachment")) actions.add("upload-file");
  return {
    actions: Array.from(actions),
    ...(actions.has("poll-vote")
      ? {
          schema: {
            properties: {
              pollOptionText: Type.Optional(
                Type.String({ description: "Exact iMessage poll option text." }),
              ),
            },
            actions: ["poll-vote"],
            visibility: "all-configured",
          },
        }
      : {}),
  };
}
//#endregion
export { IMESSAGE_ACTIONS as n, IMESSAGE_ACTION_NAMES as r, describeIMessageMessageTool as t };
