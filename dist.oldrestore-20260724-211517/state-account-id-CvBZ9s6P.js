//#region extensions/nostr/src/state-account-id.ts
function normalizeNostrStateAccountId(accountId) {
  const trimmed = accountId?.trim();
  if (!trimmed) return "default";
  return trimmed.replace(/[^a-z0-9._-]+/gi, "_");
}
//#endregion
export { normalizeNostrStateAccountId as t };
