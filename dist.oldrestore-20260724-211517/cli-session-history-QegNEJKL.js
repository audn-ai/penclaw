import { t as getCliSessionBinding } from "./cli-session-binding-CfY4fqsE.js";
import {
  i as readClaudeCliSessionMessages,
  t as CLAUDE_CLI_PROVIDER,
} from "./cli-session-history.claude-DNOnkIfT.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import "./model-selection-DOlkTrQa.js";
import { s as asFiniteNumber } from "./number-coercion-CJQ8TR--.js";
import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { r as stripInboundMetadata } from "./strip-inbound-meta-CbJ4Y6Dq.js";
//#region src/gateway/cli-session-history.merge.ts
const DEDUPE_TIMESTAMP_WINDOW_MS = 300 * 1e3;
function extractComparableText(message) {
  if (!message || typeof message !== "object") return;
  const record = message;
  const role = readStringValue(record.role);
  const parts = [];
  const text = readStringValue(record.text);
  if (text !== void 0) parts.push(text);
  const content = readStringValue(record.content);
  if (content !== void 0) parts.push(content);
  else if (Array.isArray(record.content)) {
    for (const block of record.content)
      if (block && typeof block === "object" && "text" in block) {
        const blockText = readStringValue(block.text);
        if (blockText !== void 0) parts.push(blockText);
      }
  }
  if (parts.length === 0) return;
  const joined = parts.join("\n").trim();
  if (!joined) return;
  return (
    (role === "user" ? stripInboundMetadata(joined) : joined).replace(/\s+/g, " ").trim() || void 0
  );
}
function resolveComparableTimestamp(message) {
  if (!message || typeof message !== "object") return;
  return asFiniteNumber(message.timestamp);
}
function resolveComparableRole(message) {
  if (!message || typeof message !== "object") return;
  return readStringValue(message.role);
}
function resolveImportedExternalIdentity(message) {
  if (!message || typeof message !== "object") return;
  const meta =
    "__openclaw" in message && message["__openclaw"] && typeof message["__openclaw"] === "object"
      ? (message["__openclaw"] ?? {})
      : void 0;
  const externalId = normalizeOptionalString(meta?.externalId);
  return externalId
    ? {
        externalId,
        importedFrom: normalizeOptionalString(meta?.importedFrom),
        cliSessionId: normalizeOptionalString(meta?.cliSessionId),
      }
    : void 0;
}
function hasSameExternalIdentity(existing, imported) {
  const importedIdentity = resolveImportedExternalIdentity(imported);
  const existingIdentity = resolveImportedExternalIdentity(existing);
  if (!importedIdentity || !existingIdentity) return false;
  return (
    importedIdentity.externalId === existingIdentity.externalId &&
    importedIdentity.importedFrom === existingIdentity.importedFrom &&
    importedIdentity.cliSessionId === existingIdentity.cliSessionId
  );
}
function isEquivalentImportedMessage(existing, imported) {
  if (hasSameExternalIdentity(existing, imported)) return true;
  const existingRole = resolveComparableRole(existing);
  const importedRole = resolveComparableRole(imported);
  if (!existingRole || existingRole !== importedRole) return false;
  const existingText = extractComparableText(existing);
  const importedText = extractComparableText(imported);
  if (!existingText || !importedText || existingText !== importedText) return false;
  const existingTimestamp = resolveComparableTimestamp(existing);
  const importedTimestamp = resolveComparableTimestamp(imported);
  if (existingTimestamp === void 0 || importedTimestamp === void 0) return true;
  return Math.abs(existingTimestamp - importedTimestamp) <= DEDUPE_TIMESTAMP_WINDOW_MS;
}
function compareHistoryMessages(a, b) {
  const aTimestamp = resolveComparableTimestamp(a.message);
  const bTimestamp = resolveComparableTimestamp(b.message);
  if (aTimestamp !== void 0 && bTimestamp !== void 0 && aTimestamp !== bTimestamp)
    return aTimestamp - bTimestamp;
  return a.order - b.order;
}
/** Merges imported CLI transcript messages into local history without duplicating overlaps. */
function mergeImportedChatHistoryMessages(params) {
  if (params.importedMessages.length === 0) return params.localMessages;
  const merged = params.localMessages.map((message, index) => ({
    message,
    order: index,
  }));
  let nextOrder = merged.length;
  for (const imported of params.importedMessages) {
    if (merged.some((existing) => isEquivalentImportedMessage(existing.message, imported)))
      continue;
    merged.push({
      message: imported,
      order: nextOrder,
    });
    nextOrder += 1;
  }
  merged.sort(compareHistoryMessages);
  return merged.map((entry) => entry.message);
}
//#endregion
//#region src/gateway/cli-session-history.ts
const ANTHROPIC_PROVIDER = "anthropic";
/** Resolves chat history plus whether a bound external transcript was actually incorporated. */
function resolveChatHistoryWithCliSessionImports(params) {
  const cliSessionBinding = getCliSessionBinding(params.entry, CLAUDE_CLI_PROVIDER);
  const cliSessionId = cliSessionBinding?.sessionId;
  if (!cliSessionId)
    return {
      messages: params.localMessages,
      imported: false,
    };
  const normalizedProvider = normalizeProviderId(params.provider ?? "");
  if (
    normalizedProvider &&
    normalizedProvider !== "claude-cli" &&
    normalizedProvider !== ANTHROPIC_PROVIDER &&
    params.localMessages.length > 0
  )
    return {
      messages: params.localMessages,
      imported: false,
    };
  const importedMessages = readClaudeCliSessionMessages({
    cliSessionId,
    homeDir: params.homeDir,
    localSessionId: params.entry?.sessionId,
    reseedReceipt: cliSessionBinding.reseedReceipt,
  });
  if (importedMessages.length === 0)
    return {
      messages: params.localMessages,
      imported: false,
    };
  const messages = mergeImportedChatHistoryMessages({
    localMessages: params.localMessages,
    importedMessages,
  });
  return messages.length > params.localMessages.length
    ? {
        messages,
        imported: true,
      }
    : {
        messages: params.localMessages,
        imported: false,
      };
}
/** Augments local chat history with bound Claude CLI session messages when applicable. */
function augmentChatHistoryWithCliSessionImports(params) {
  return resolveChatHistoryWithCliSessionImports(params).messages;
}
//#endregion
export {
  resolveChatHistoryWithCliSessionImports as n,
  augmentChatHistoryWithCliSessionImports as t,
};
