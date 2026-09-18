//#region src/plugin-sdk/tool-send.d.ts
/** Extract the canonical send target fields from tool arguments when the action matches. */
declare function extractToolSend(
  /** Raw model tool arguments supplied to a channel action. */

  args: Record<string, unknown> /** Action name that should be treated as a send action. */,

  expectedAction?: string,
): {
  /** Canonical destination id used by core send routing. */ to: string /** Optional channel account/profile id when the action includes one. */;
  accountId?: string /** Optional thread/topic id, normalized to string for channel send adapters. */;
  threadId?: string /** True when the send explicitly opts out of ambient thread inheritance. */;
  threadSuppressed?: boolean;
} | null;
//#endregion
export { extractToolSend as t };
