//#region extensions/telegram/src/state-account-id.ts
function normalizeTelegramStateAccountId(accountId) {
  const trimmed = accountId?.trim();
  if (!trimmed) return "default";
  return trimmed.replace(/[^a-z0-9._-]+/gi, "_");
}
//#endregion
export { normalizeTelegramStateAccountId as t };
