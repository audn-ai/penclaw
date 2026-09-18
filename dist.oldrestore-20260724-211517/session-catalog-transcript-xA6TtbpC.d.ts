//#region extensions/anthropic/session-catalog-transcript.d.ts
type ClaudeTranscriptItem = {
  type: string;
  text?: string;
  content?: unknown;
  timestamp?: string;
  model?: string;
  uuid?: string;
  truncated?: true;
};
declare function collectTranscriptText(value: unknown, fragments: string[]): void;
declare function parseTranscriptLine(
  line: Buffer,
  optionalString: (value: unknown, maxLength?: number) => string | undefined,
): ClaudeTranscriptItem | undefined;
//#endregion
export { collectTranscriptText as n, parseTranscriptLine as r, ClaudeTranscriptItem as t };
