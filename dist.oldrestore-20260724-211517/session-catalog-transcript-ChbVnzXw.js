import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
//#region extensions/anthropic/session-catalog-transcript.ts
const MAX_TRANSCRIPT_ITEM_BYTES = 4 * 1024 * 1024;
const MAX_TRANSCRIPT_TEXT_LENGTH = 1e6;
function transcriptItemType(role, content) {
  if (!Array.isArray(content)) return role === "user" ? "userMessage" : "agentMessage";
  const types = content.flatMap((block) =>
    isRecord(block) && typeof block.type === "string" ? [block.type] : [],
  );
  if (types.length > 0 && types.every((type) => type === "tool_result")) return "toolResult";
  if (types.length > 0 && types.every((type) => type === "tool_use")) return "toolCall";
  if (types.length > 0 && types.every((type) => type === "thinking")) return "reasoning";
  return role === "user" ? "userMessage" : "agentMessage";
}
function collectTranscriptText(value, fragments) {
  if (typeof value === "string") {
    if (value.trim()) fragments.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectTranscriptText(item, fragments);
    return;
  }
  if (!isRecord(value)) return;
  for (const key of ["text", "thinking", "content", "input"])
    if (key in value) collectTranscriptText(value[key], fragments);
}
function parseTranscriptLine(line, optionalString) {
  let raw;
  try {
    raw = JSON.parse(line.toString("utf8"));
  } catch {
    return;
  }
  if (!isRecord(raw) || raw.isSidechain === true || !isRecord(raw.message)) return;
  const role = raw.message.role;
  if ((role !== "user" && role !== "assistant") || raw.type !== role) return;
  const content = raw.message.content;
  if (typeof content !== "string" && !Array.isArray(content)) return;
  const fragments = [];
  collectTranscriptText(content, fragments);
  const text = [...new Set(fragments)].join("\n\n");
  const item = {
    type: transcriptItemType(role, content),
    ...(text ? { text } : {}),
    content,
    ...(optionalString(raw.timestamp, 128)
      ? { timestamp: optionalString(raw.timestamp, 128) }
      : {}),
    ...(optionalString(raw.message.model, 256)
      ? { model: optionalString(raw.message.model, 256) }
      : {}),
    ...(optionalString(raw.uuid, 256) ? { uuid: optionalString(raw.uuid, 256) } : {}),
  };
  if (Buffer.byteLength(JSON.stringify(item), "utf8") <= MAX_TRANSCRIPT_ITEM_BYTES) return item;
  return {
    type: item.type,
    text: `${truncateUtf16Safe(text, MAX_TRANSCRIPT_TEXT_LENGTH)}\n\n[oversized Claude item truncated]`,
    ...(item.timestamp ? { timestamp: item.timestamp } : {}),
    ...(item.model ? { model: item.model } : {}),
    ...(item.uuid ? { uuid: item.uuid } : {}),
    truncated: true,
  };
}
//#endregion
export { parseTranscriptLine as n, collectTranscriptText as t };
