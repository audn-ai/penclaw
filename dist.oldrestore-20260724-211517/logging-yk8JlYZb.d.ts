//#region src/channels/logging.d.ts
/**
 * Shared channel diagnostic formatters exposed through the plugin SDK.
 * Keep messages compact and stable enough for plugin logs without making them machine contracts.
 */
/** Minimal logger callback shape exposed through channel SDK helpers. */
type LogFn = (message: string) => void;
/** Emits a normalized inbound-drop diagnostic for channel plugins. */
declare function logInboundDrop(params: {
  log: LogFn;
  channel: string;
  reason: string;
  target?: string;
}): void;
/** Emits a normalized typing-indicator failure diagnostic for channel plugins. */
declare function logTypingFailure(params: {
  log: LogFn;
  channel: string;
  target?: string;
  action?: "start" | "stop";
  error: unknown;
}): void;
/** Emits a normalized acknowledgement-cleanup failure diagnostic for channel plugins. */
declare function logAckFailure(params: {
  log: LogFn;
  channel: string;
  target?: string;
  error: unknown;
}): void;
//#endregion
export { logTypingFailure as i, logAckFailure as n, logInboundDrop as r, LogFn as t };
