//#region src/shared/text/assistant-visible-text.d.ts
declare function stripToolCallXmlTags(
  input: string,
  options?: {
    stripFunctionCallsXmlPayloads?: boolean;
    stripFunctionResponseAfterPluralToolCalls?: boolean;
  },
): string;
/**
 * Strip malformed Minimax tool invocations that leak into text content.
 * Minimax sometimes embeds tool calls as XML in text blocks instead of
 * proper structured tool calls.
 */
declare function stripMinimaxToolCallXml(text: string): string;
declare function stripLegacyBracketToolCallBlocks(text: string): string;
/**
 * Strip downgraded tool call text representations that leak into user-visible
 * text content when replaying history across providers.
 */
declare function stripDowngradedToolCallText(text: string): string;
declare function stripAssistantInternalTraceLines(text: string): string;
type AssistantVisibleTextSanitizerProfile =
  | "delivery"
  | "final-answer-delivery"
  | "history"
  | "internal-scaffolding"
  | "tool-progress";
declare function sanitizeAssistantVisibleTextWithProfile(
  text: string,
  profile?: AssistantVisibleTextSanitizerProfile,
): string;
declare function stripAssistantInternalScaffolding(text: string): string;
/**
 * Canonical user-visible assistant text sanitizer for delivery and history
 * extraction paths. Keeps prose, removes internal scaffolding.
 */
declare function sanitizeAssistantVisibleText(text: string): string;
/** Sanitizes text already marked as final-answer prose by the agent runtime. */
declare function sanitizeAssistantFinalAnswerText(text: string): string;
/**
 * Backwards-compatible trim wrapper.
 * Prefer sanitizeAssistantVisibleTextWithProfile for new call sites.
 */
declare function sanitizeAssistantVisibleTextWithOptions(
  text: string,
  options?: {
    trim?: "none" | "both";
  },
): string;
//#endregion
export {
  sanitizeAssistantVisibleTextWithProfile as a,
  stripDowngradedToolCallText as c,
  stripToolCallXmlTags as d,
  sanitizeAssistantVisibleTextWithOptions as i,
  stripLegacyBracketToolCallBlocks as l,
  sanitizeAssistantFinalAnswerText as n,
  stripAssistantInternalScaffolding as o,
  sanitizeAssistantVisibleText as r,
  stripAssistantInternalTraceLines as s,
  AssistantVisibleTextSanitizerProfile as t,
  stripMinimaxToolCallXml as u,
};
