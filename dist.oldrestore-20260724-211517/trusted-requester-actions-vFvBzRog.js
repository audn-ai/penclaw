//#region extensions/discord/src/trusted-requester-actions.ts
const trustedRequesterGuildAdminActions = /* @__PURE__ */ new Set([
  "emoji-upload",
  "sticker-upload",
  "role-add",
  "role-remove",
  "channel-create",
  "channel-edit",
  "channel-delete",
  "channel-move",
  "category-create",
  "category-edit",
  "category-delete",
  "event-create",
  "timeout",
  "kick",
  "ban",
]);
function isTrustedRequesterGuildAdminAction(action) {
  return trustedRequesterGuildAdminActions.has(action);
}
//#endregion
export { isTrustedRequesterGuildAdminAction as t };
