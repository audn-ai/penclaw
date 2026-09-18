import {
  n as BuildMentionRegexesOptions,
  r as ExplicitMentionSignal,
} from "./mentions.types-CoRK8mYD.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/auto-reply/reply/mentions.d.ts
declare const CURRENT_MESSAGE_MARKER = "[Current message - respond to this]";
/** Builds mention regexes from config, agent identity, and channel policy. */
declare function buildMentionRegexes(
  cfg: OpenClawConfig | undefined,
  agentId?: string,
  options?: BuildMentionRegexesOptions,
): RegExp[];
/** Normalizes text before mention matching. */
declare function normalizeMentionText(text: string): string;
/** Returns true when text matches one of the configured mention patterns. */
declare function matchesMentionPatterns(text: string, mentionRegexes: RegExp[]): boolean;
/** Combines regex mention matching with provider-native explicit mention metadata. */
declare function matchesMentionWithExplicit(params: {
  text: string;
  mentionRegexes: RegExp[];
  explicit?: ExplicitMentionSignal;
  transcript?: string;
}): boolean;
//#endregion
export {
  normalizeMentionText as a,
  matchesMentionWithExplicit as i,
  buildMentionRegexes as n,
  matchesMentionPatterns as r,
  CURRENT_MESSAGE_MARKER as t,
};
