import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import {
  F as MentionPatternsMode,
  I as MentionPatternsPolicyConfig,
} from "./types.slack-DOPma3IJ.js";

//#region src/channels/mention-pattern-policy.d.ts
/**
 * Inputs for resolving whether mention-pattern matching is enabled in a conversation.
 */
type ResolveMentionPatternPolicyParams = {
  cfg?: OpenClawConfig;
  provider?: string;
  conversationId?: string | null;
  providerPolicy?: MentionPatternsPolicyConfig;
  agentId?: string;
};
/**
 * Effective mention-pattern policy after provider and conversation allow/deny rules.
 */
type ResolvedMentionPatternPolicy = {
  effectiveMode: MentionPatternsMode;
  allowMatched: boolean;
  denyMatched: boolean;
  enabled: boolean;
};
/**
 * Resolves provider-scoped mention-pattern policy for a single conversation.
 */
declare function resolveMentionPatternPolicy(
  params: ResolveMentionPatternPolicyParams,
): ResolvedMentionPatternPolicy;
//#endregion
//#region src/auto-reply/reply/mentions.types.d.ts
/** Options for building mention regexes without binding config/agent id. */
type BuildMentionRegexesOptions = Omit<ResolveMentionPatternPolicyParams, "cfg" | "agentId">;
/** Builds mention regexes for the current config and agent. */
type BuildMentionRegexes = (
  cfg: OpenClawConfig | undefined,
  agentId?: string,
  options?: BuildMentionRegexesOptions,
) => RegExp[];
/** Tests plain text against mention regexes. */
type MatchesMentionPatterns = (text: string, mentionRegexes: RegExp[]) => boolean;
/** Explicit mention metadata supplied by channel adapters. */
type ExplicitMentionSignal = {
  hasAnyMention: boolean;
  isExplicitlyMentioned: boolean;
  canResolveExplicit: boolean;
};
/** Tests mention state using regexes plus explicit channel mention metadata. */
type MatchesMentionWithExplicit = (params: {
  text: string;
  mentionRegexes: RegExp[];
  explicit?: ExplicitMentionSignal;
  transcript?: string;
}) => boolean;
//#endregion
export {
  MatchesMentionWithExplicit as a,
  resolveMentionPatternPolicy as c,
  MatchesMentionPatterns as i,
  BuildMentionRegexesOptions as n,
  ResolveMentionPatternPolicyParams as o,
  ExplicitMentionSignal as r,
  ResolvedMentionPatternPolicy as s,
  BuildMentionRegexes as t,
};
