import {
  i as resolveGoogleChatAccount,
  t as listEnabledGoogleChatAccounts,
} from "./accounts-MI4x6Lvk.js";
import { _ as readStringArrayParam, y as readStringParam } from "./common-DyDSUect.js";
import "./channel-actions-C9vNf9jw.js";
import {
  o as resolveGoogleChatOutboundSpace,
  u as sendGoogleChatMessage,
} from "./targets-CXCvMn2h.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as extractToolSend } from "./tool-send-DlIp2cBO.js";
//#region extensions/googlechat/src/actions.ts
const providerId = "googlechat";
function listEnabledAccounts(cfg) {
  return listEnabledGoogleChatAccounts(cfg).filter(
    (account) => account.enabled && account.credentialSource !== "none",
  );
}
const OUTBOUND_MEDIA_KEYS = ["media", "mediaUrl", "path", "filePath", "fileUrl"];
const STRUCTURED_ATTACHMENT_MEDIA_KEYS = [...OUTBOUND_MEDIA_KEYS, "url"];
function hasGoogleChatOutboundAttachment(params) {
  if (OUTBOUND_MEDIA_KEYS.some((key) => readStringParam(params, key) !== void 0)) return true;
  if (readStringArrayParam(params, "mediaUrls") !== void 0) return true;
  if (!Array.isArray(params.attachments)) return false;
  return params.attachments.some((attachment) => {
    if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) return false;
    const record = attachment;
    return STRUCTURED_ATTACHMENT_MEDIA_KEYS.some((key) => readStringParam(record, key) !== void 0);
  });
}
const googlechatMessageActions = {
  describeMessageTool: ({ cfg, accountId }) => {
    if (
      (accountId
        ? [
            resolveGoogleChatAccount({
              cfg,
              accountId,
            }),
          ].filter((account) => account.enabled && account.credentialSource !== "none")
        : listEnabledAccounts(cfg)
      ).length === 0
    )
      return null;
    return { actions: ["send"] };
  },
  supportsAction: ({ action }) => action === "send",
  extractToolSend: ({ args }) => {
    return extractToolSend(args, "sendMessage");
  },
  handleAction: async ({ action, params, cfg, accountId }) => {
    if (action === "upload-file")
      throw new Error(
        "Google Chat outbound attachments require user OAuth and are not supported by this service-account channel.",
      );
    if (action === "send") {
      if (hasGoogleChatOutboundAttachment(params))
        throw new Error(
          "Google Chat outbound attachments require user OAuth and are not supported by this service-account channel.",
        );
    }
    const account = resolveGoogleChatAccount({
      cfg,
      accountId,
    });
    if (account.credentialSource === "none")
      throw new Error("Google Chat credentials are missing.");
    if (action === "send") {
      const to = readStringParam(params, "to", { required: true });
      const content = readStringParam(params, "message", {
        required: true,
        allowEmpty: true,
      });
      const threadId = readStringParam(params, "threadId") ?? readStringParam(params, "replyTo");
      const space = await resolveGoogleChatOutboundSpace({
        account,
        target: to,
      });
      return jsonResult({
        ok: true,
        to: space,
        ...(await sendGoogleChatMessage({
          account,
          space,
          text: content,
          thread: threadId ?? void 0,
        })),
      });
    }
    throw new Error(`Action ${action} is not supported for provider ${providerId}.`);
  },
};
//#endregion
export { googlechatMessageActions };
