//#region src/shared/account-enabled.ts
function isAccountEnabled(account) {
  if (!account || typeof account !== "object") return true;
  return account.enabled !== false;
}
//#endregion
export { isAccountEnabled as t };
