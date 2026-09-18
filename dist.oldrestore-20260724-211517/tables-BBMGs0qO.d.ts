//#region packages/markdown-core/src/types.d.ts
/** Table rendering modes used when markdown tables need plaintext-safe output. */
type MarkdownTableMode = "off" | "bullets" | "code" | "block";
//#endregion
//#region packages/markdown-core/src/tables.d.ts
/** Converts markdown tables into the configured plaintext/code rendering mode. */
declare function convertMarkdownTables(markdown: string, mode: MarkdownTableMode): string;
//#endregion
export { MarkdownTableMode as n, convertMarkdownTables as t };
