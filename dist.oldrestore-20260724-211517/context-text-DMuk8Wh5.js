import { n as readStringAlias } from "./string-readers-A0wspDGq.js";
//#region src/auto-reply/reply/context-text.ts
/** Returns the first string field from a finalized message context. */
function resolveFirstContextText(ctx, keys) {
  return readStringAlias(ctx, keys) ?? "";
}
/** Resolves normalized text for slash/bang command parsing. */
function resolveCommandContextText(ctx) {
  return resolveFirstContextText(ctx, ["BodyForCommands", "CommandBody", "RawBody", "Body"]).trim();
}
/** Checks whether the inbound context carries an explicit command prefix. */
function hasExplicitCommandContextText(ctx) {
  const text = resolveCommandContextText(ctx);
  return text.startsWith("/") || text.startsWith("!");
}
//#endregion
export {
  resolveCommandContextText as n,
  resolveFirstContextText as r,
  hasExplicitCommandContextText as t,
};
