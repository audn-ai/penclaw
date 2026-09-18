import { r as AssistantMessage } from "./types-CqrbBnUB.js";
import { s as AgentMessage } from "./types-JQFrjdua.js";
//#region src/shared/text/model-special-tokens.d.ts
/**
 * Strips leaked model control tokens like `<|assistant|>` or full-width pipe variants.
 * Code examples are preserved; remove this when providers stop emitting these tokens.
 *
 * @see https://github.com/openclaw/openclaw/issues/40020
 */
declare function stripModelSpecialTokens(text: string): string;
//#endregion
//#region src/agents/embedded-agent-utils.d.ts
/** Narrow an agent message to an assistant message. */
declare function isAssistantMessage(msg: AgentMessage | undefined): msg is AssistantMessage;
/**
 * Strip thinking tags and their content from text.
 * This is a safety net for cases where the model outputs <think> tags
 * that slip through other filtering mechanisms.
 */
declare function stripThinkingTagsFromText(text: string): string;
declare function sanitizeAssistantVisibleStreamText(text: string): string;
/** Extract text intended for users, preferring explicit final-answer phase blocks. */
declare function extractAssistantVisibleText(msg: AssistantMessage): string;
/** Extract the commentary/narration text of a commentary-phase assistant message. */
declare function extractAssistantCommentaryText(msg: AssistantMessage): string;
/** Extract sanitized assistant text across all text content blocks. */
declare function extractAssistantText(msg: AssistantMessage): string;
/** Extract native thinking block text; signature-only blocks (no summary) surface nothing. */
declare function extractAssistantThinking(msg: AssistantMessage): string;
/** Format reasoning text for markdown-friendly channel surfaces. */
declare function formatReasoningMessage(text: string): string;
type ThinkTaggedSplitBlock =
  | {
      type: "thinking";
      thinking: string;
    }
  | {
      type: "text";
      text: string;
    };
/** Global regex used to scan provider-emitted thinking tags. */
declare const THINKING_TAG_SCAN_RE: RegExp;
/** Split text that starts with thinking tags into structured thinking/text blocks. */
declare function splitThinkingTaggedText(text: string): ThinkTaggedSplitBlock[] | null;
/** Promote inline thinking-tag text blocks into native thinking blocks in place. */
declare function promoteThinkingTagsToBlocks(message: AssistantMessage): void;
/** Extract closed thinking-tag content from a complete text payload. */
declare function extractThinkingFromTaggedText(text: string): string;
/** Extract thinking-tag content from a possibly incomplete streaming payload. */
declare function extractThinkingFromTaggedStream(text: string): string;
/** Infer compact display metadata for a tool call from its args. */
declare function inferToolMetaFromArgs(
  toolName: string,
  args: unknown,
  options?: {
    detailMode?: "explain" | "raw";
  },
): string | undefined;
//#endregion
export {
  extractAssistantVisibleText as a,
  formatReasoningMessage as c,
  promoteThinkingTagsToBlocks as d,
  sanitizeAssistantVisibleStreamText as f,
  stripModelSpecialTokens as h,
  extractAssistantThinking as i,
  inferToolMetaFromArgs as l,
  stripThinkingTagsFromText as m,
  extractAssistantCommentaryText as n,
  extractThinkingFromTaggedStream as o,
  splitThinkingTaggedText as p,
  extractAssistantText as r,
  extractThinkingFromTaggedText as s,
  THINKING_TAG_SCAN_RE as t,
  isAssistantMessage as u,
};
