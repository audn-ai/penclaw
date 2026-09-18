//#region src/plugin-sdk/memory-host-markdown.d.ts
/**
 * Public SDK helpers for maintaining generated blocks inside Markdown files.
 */
type ManagedMarkdownBlockParams = {
  original: string;
  body: string;
  startMarker: string;
  endMarker: string;
  heading?: string;
};
/** Ensures generated Markdown content ends with exactly the caller-provided body plus newline. */
declare function withTrailingNewline(content: string): string;
/** Replaces all existing managed blocks with one current block, or appends it if missing. */
declare function replaceManagedMarkdownBlock(params: ManagedMarkdownBlockParams): string;
//#endregion
export { ManagedMarkdownBlockParams, replaceManagedMarkdownBlock, withTrailingNewline };
