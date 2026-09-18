//#region packages/markdown-core/src/chunk-text.d.ts
type TextChunkRange = {
  start: number;
  end: number;
};
type ChunkTextRangesOptions = {
  limit: number;
  mode?: "hard" | "preferred";
};
/**
 * Splits text into contiguous UTF-16 ranges without dropping separator whitespace.
 * Preferred mode selects paragraph, newline, then whitespace boundaries.
 */
declare function chunkTextRanges(text: string, options: ChunkTextRangesOptions): TextChunkRange[];
//#endregion
//#region packages/markdown-core/src/html-tags.d.ts
type HtmlTagToken = {
  raw: string;
  start: number;
  end: number;
  name: string;
  closing: boolean;
  selfClosing: boolean;
};
/** Tokenizes valid open/close HTML tags with Markdown-It's quote-aware grammar. */
declare function tokenizeHtmlTags(html: string): Generator<HtmlTagToken>;
//#endregion
//#region src/plugin-sdk/text-chunking.d.ts
/**
 * Splits outbound channel text into chunks no longer than the requested limit.
 * Newline boundaries win over spaces; text without usable separators falls back
 * to a hard character split so channel senders always receive bounded strings.
 */
declare function chunkTextForOutbound(text: string, limit: number): string[];
//#endregion
export {
  chunkTextRanges as a,
  TextChunkRange as i,
  tokenizeHtmlTags as n,
  ChunkTextRangesOptions as r,
  chunkTextForOutbound as t,
};
