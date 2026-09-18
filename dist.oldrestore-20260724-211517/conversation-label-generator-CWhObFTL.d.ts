import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/auto-reply/reply/conversation-label-generator.d.ts
/** Inputs for generating a short conversation label from the configured utility model. */
type ConversationLabelParams = {
  userMessage: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  maxLength?: number;
};
/** Generates a bounded human-readable label for a session, or null on failure. */
declare function generateConversationLabel(params: ConversationLabelParams): Promise<string | null>;
//#endregion
export { generateConversationLabel as n, ConversationLabelParams as t };
