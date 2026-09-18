import { r as normalizeOptionalAccountId } from "./account-id-C7N4Rwku.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/routing/account-lookup.ts
function resolveAccountEntry(accounts, accountId) {
  if (!accounts || typeof accounts !== "object") return;
  if (Object.hasOwn(accounts, accountId)) return accounts[accountId];
  const normalized = normalizeLowercaseStringOrEmpty(accountId);
  const matchKey = Object.keys(accounts).find(
    (key) => normalizeLowercaseStringOrEmpty(key) === normalized,
  );
  return matchKey ? accounts[matchKey] : void 0;
}
function resolveNormalizedAccountEntry(accounts, accountId, normalizeAccountId) {
  if (!accounts || typeof accounts !== "object") return;
  if (Object.hasOwn(accounts, accountId) && !isBlockedObjectKey(accountId))
    return accounts[accountId];
  const normalized = normalizeAccountId(accountId);
  const matchKey = Object.keys(accounts).find((key) => {
    if (isBlockedObjectKey(key)) return false;
    const candidate = normalizeAccountId(key);
    return (
      Boolean(normalizeOptionalAccountId(key)) &&
      !isBlockedObjectKey(candidate) &&
      candidate === normalized
    );
  });
  return matchKey ? accounts[matchKey] : void 0;
}
//#endregion
export { resolveNormalizedAccountEntry as n, resolveAccountEntry as t };
