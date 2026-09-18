//#region src/plugin-sdk/tool-payload.d.ts
/** Plugin-facing plain-text tool call block with source offsets for repair. */
type PlainTextToolCallBlock = {
  /** Parsed JSON arguments object. */ arguments: Record<
    string,
    unknown
  > /** Exclusive end offset of the parsed block. */;
  end: number /** Tool name parsed from the standalone block. */;
  name: string /** Original text slice that produced this block. */;
  raw: string /** Inclusive start offset of the parsed block. */;
  start: number;
};
/** Plugin-facing parser options for standalone plain-text tool calls. */
type PlainTextToolCallParseOptions = {
  /** Optional allowlist of tool names that may be accepted. */ allowedToolNames?: Iterable<string> /** Maximum serialized payload size accepted for one parsed call. */;
  maxPayloadBytes?: number;
};
/** Parses a message made only of standalone plain-text tool call blocks. */
declare function parseStandalonePlainTextToolCallBlocks(
  text: string,
  options?: PlainTextToolCallParseOptions,
): PlainTextToolCallBlock[] | null;
/** Removes full-line standalone plain-text tool call blocks from visible text. */
declare function stripPlainTextToolCallBlocks(text: string): string;
/** Minimal tool-result-like object shape accepted by payload extraction helpers. */
type ToolPayloadCarrier = {
  /** Structured payload preferred over content text when present. */ details?: unknown /** Provider/tool content blocks or fallback payload. */;
  content?: unknown;
};
/**
 * Extract the most useful payload from tool result-like objects shared across
 * outbound core flows and bundled plugin helpers.
 */
declare function extractToolPayload(result: ToolPayloadCarrier | null | undefined): unknown;
//#endregion
export {
  PlainTextToolCallBlock,
  PlainTextToolCallParseOptions,
  ToolPayloadCarrier,
  extractToolPayload,
  parseStandalonePlainTextToolCallBlocks,
  stripPlainTextToolCallBlocks,
};
