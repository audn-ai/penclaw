import { t as createPluginRuntimeStore } from "./runtime-store-uAKGMqTs.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/zalouser/src/group-policy.ts
const toGroupCandidate = (value) => value?.trim() ?? "";
function normalizeZalouserGroupSlug(raw) {
  return (normalizeOptionalLowercaseString(raw) ?? "")
    .replace(/^#/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function buildZalouserGroupCandidates(params) {
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  const push = (value) => {
    const normalized = toGroupCandidate(value);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    out.push(normalized);
  };
  const groupId = toGroupCandidate(params.groupId);
  const groupChannel = toGroupCandidate(params.groupChannel);
  const groupName = toGroupCandidate(params.groupName);
  push(groupId);
  if (params.includeGroupIdAlias === true && groupId) push(`group:${groupId}`);
  if (params.allowNameMatching !== false)
    [groupChannel, groupName, normalizeZalouserGroupSlug(groupName)].forEach(push);
  if (params.includeWildcard !== false) push("*");
  return out;
}
function findZalouserGroupEntry(groups, candidates) {
  const { tree, path } = resolveZalouserGroupScope(groups, candidates);
  const key = path[0];
  return key ? tree.scopes[key] : void 0;
}
function resolveZalouserGroupScope(groups, candidates) {
  const tree = { scopes: groups ?? {} };
  const key =
    candidates.find((candidate) => candidate !== "*" && Object.hasOwn(tree.scopes, candidate)) ??
    (candidates.includes("*") && Object.hasOwn(tree.scopes, "*") ? "*" : void 0);
  return {
    tree,
    path: key ? [key] : [],
  };
}
function isZalouserGroupEntryAllowed(entry) {
  if (!entry) return false;
  return entry.allow !== false && entry.enabled !== false;
}
//#endregion
//#region extensions/zalouser/src/message-sid.ts
function toMessageSidPart(value) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(Math.trunc(value));
  return "";
}
function parseZalouserMessageSidFull(value) {
  const raw = toMessageSidPart(value);
  if (!raw) return null;
  const [msgIdPart, cliMsgIdPart] = raw.split(":").map((entry) => entry.trim());
  if (!msgIdPart || !cliMsgIdPart) return null;
  return {
    msgId: msgIdPart,
    cliMsgId: cliMsgIdPart,
  };
}
function resolveZalouserReactionMessageIds(params) {
  const explicitMessageId = toMessageSidPart(params.messageId);
  const explicitCliMsgId = toMessageSidPart(params.cliMsgId);
  if (explicitMessageId && explicitCliMsgId)
    return {
      msgId: explicitMessageId,
      cliMsgId: explicitCliMsgId,
    };
  const parsedFromCurrent = parseZalouserMessageSidFull(params.currentMessageId);
  if (parsedFromCurrent) return parsedFromCurrent;
  const currentRaw = toMessageSidPart(params.currentMessageId);
  if (!currentRaw) return null;
  if (explicitMessageId && !explicitCliMsgId)
    return {
      msgId: explicitMessageId,
      cliMsgId: currentRaw,
    };
  if (!explicitMessageId && explicitCliMsgId)
    return {
      msgId: currentRaw,
      cliMsgId: explicitCliMsgId,
    };
  return {
    msgId: currentRaw,
    cliMsgId: currentRaw,
  };
}
function formatZalouserMessageSidFull(params) {
  const msgId = toMessageSidPart(params.msgId);
  const cliMsgId = toMessageSidPart(params.cliMsgId);
  if (!msgId && !cliMsgId) return;
  if (msgId && cliMsgId) return `${msgId}:${cliMsgId}`;
  return msgId || cliMsgId || void 0;
}
function resolveZalouserMessageSid(params) {
  const msgId = toMessageSidPart(params.msgId);
  const cliMsgId = toMessageSidPart(params.cliMsgId);
  if (msgId || cliMsgId) return msgId || cliMsgId;
  return toMessageSidPart(params.fallback) || void 0;
}
//#endregion
//#region extensions/zalouser/src/runtime.ts
const { setRuntime: setZalouserRuntime, getRuntime: getZalouserRuntime } = createPluginRuntimeStore(
  {
    pluginId: "zalouser",
    errorMessage: "Zalouser runtime not initialized",
  },
);
//#endregion
export {
  resolveZalouserReactionMessageIds as a,
  isZalouserGroupEntryAllowed as c,
  resolveZalouserMessageSid as i,
  resolveZalouserGroupScope as l,
  setZalouserRuntime as n,
  buildZalouserGroupCandidates as o,
  formatZalouserMessageSidFull as r,
  findZalouserGroupEntry as s,
  getZalouserRuntime as t,
};
