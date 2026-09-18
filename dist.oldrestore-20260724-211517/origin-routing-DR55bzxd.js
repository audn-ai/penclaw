import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/auto-reply/reply/origin-routing.ts
/** Resolves the original message provider before reply redirection. */
function resolveOriginMessageProvider(params) {
  return (
    normalizeOptionalLowercaseString(params.originatingChannel) ??
    normalizeOptionalLowercaseString(params.provider)
  );
}
/** Resolves the original message target before reply redirection. */
function resolveOriginMessageTo(params) {
  return params.originatingTo ?? params.to;
}
/** Resolves the original account id before reply redirection. */
function resolveOriginAccountId(params) {
  return params.originatingAccountId ?? params.accountId;
}
//#endregion
export {
  resolveOriginMessageProvider as n,
  resolveOriginMessageTo as r,
  resolveOriginAccountId as t,
};
