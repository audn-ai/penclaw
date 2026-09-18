import {
  o as parseStandalonePlainTextToolCallBlocks$1,
  s as stripPlainTextToolCallBlocks$1,
} from "./src-CeNsIwRl.js";
//#region src/plugin-sdk/tool-payload.ts
/** Parses a message made only of standalone plain-text tool call blocks. */
function parseStandalonePlainTextToolCallBlocks(text, options) {
  return parseStandalonePlainTextToolCallBlocks$1(text, options);
}
/** Removes full-line standalone plain-text tool call blocks from visible text. */
function stripPlainTextToolCallBlocks(text) {
  return stripPlainTextToolCallBlocks$1(text);
}
function isToolPayloadTextBlock(block) {
  return (
    Boolean(block) &&
    typeof block === "object" &&
    block.type === "text" &&
    typeof block.text === "string"
  );
}
/**
 * Extract the most useful payload from tool result-like objects shared across
 * outbound core flows and bundled plugin helpers.
 */
function extractToolPayload(result) {
  if (!result) return;
  if (result.details !== void 0) return result.details;
  const text = (
    Array.isArray(result.content) ? result.content.find(isToolPayloadTextBlock) : void 0
  )?.text;
  if (!text) return result.content ?? result;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
//#endregion
export {
  parseStandalonePlainTextToolCallBlocks as n,
  stripPlainTextToolCallBlocks as r,
  extractToolPayload as t,
};
