import { Type } from "typebox";
import { v as ChannelMessageActionAdapter } from "../../types.core-CcwzPNhX.js";

//#region extensions/imessage/src/message-tool-api.d.ts
declare function describeIMessageMessageTool({
  cfg,
  accountId,
  currentChannelId,
}: Parameters<NonNullable<ChannelMessageActionAdapter["describeMessageTool"]>>[0]): {
  schema?:
    | {
        properties: {
          pollOptionText: Type.TOptional<Type.TString>;
        };
        actions: "poll-vote"[];
        visibility: "all-configured";
      }
    | undefined;
  actions: (
    | "permissions"
    | "timeout"
    | "reply"
    | "search"
    | "edit"
    | "read"
    | "reactions"
    | "poll"
    | "sticker"
    | "unsend"
    | "sendWithEffect"
    | "renameGroup"
    | "setGroupIcon"
    | "addParticipant"
    | "removeParticipant"
    | "leaveGroup"
    | "sendAttachment"
    | "pin"
    | "broadcast"
    | "send"
    | "poll-vote"
    | "react"
    | "delete"
    | "unpin"
    | "list-pins"
    | "thread-create"
    | "thread-list"
    | "thread-reply"
    | "sticker-search"
    | "member-info"
    | "role-info"
    | "emoji-list"
    | "emoji-upload"
    | "sticker-upload"
    | "role-add"
    | "role-remove"
    | "channel-info"
    | "channel-list"
    | "channel-create"
    | "channel-edit"
    | "channel-delete"
    | "channel-move"
    | "category-create"
    | "category-edit"
    | "category-delete"
    | "topic-create"
    | "topic-edit"
    | "voice-status"
    | "event-list"
    | "event-create"
    | "kick"
    | "ban"
    | "set-profile"
    | "set-presence"
    | "download-file"
    | "upload-file"
  )[];
} | null;
//#endregion
export { describeIMessageMessageTool as describeMessageTool };
