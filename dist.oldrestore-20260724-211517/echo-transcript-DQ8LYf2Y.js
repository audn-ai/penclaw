import { a as shouldLogVerbose, r as logVerbose } from "./globals-CNUzHTcU.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./message-channel-NQc9DJ6B.js";
//#region src/media-understanding/echo-transcript.ts
const loadMessageRuntime = createLazyRuntimeModule(() => import("./runtime-C_ecTY_D.js"));
/** Default operator-visible transcript echo format for preflight audio transcription. */
const DEFAULT_ECHO_TRANSCRIPT_FORMAT = '📝 "{transcript}"';
function formatEchoTranscript(transcript, format) {
  return format.replace("{transcript}", () => transcript);
}
/** Sends a best-effort transcript echo back to the originating deliverable chat. */
async function sendTranscriptEcho(params) {
  const { ctx, cfg, transcript } = params;
  const channel = ctx.Provider ?? ctx.Surface ?? "";
  const to = ctx.OriginatingTo ?? ctx.From ?? "";
  if (!channel || !to) {
    if (shouldLogVerbose())
      logVerbose("media: echo-transcript skipped (no channel/to resolved from ctx)");
    return;
  }
  const normalizedChannel = normalizeLowercaseStringOrEmpty(channel);
  if (!isDeliverableMessageChannel(normalizedChannel)) {
    if (shouldLogVerbose())
      logVerbose(
        `media: echo-transcript skipped (channel "${normalizedChannel}" is not deliverable)`,
      );
    return;
  }
  const text = formatEchoTranscript(transcript, params.format ?? '📝 "{transcript}"');
  try {
    const { sendDurableMessageBatch } = await loadMessageRuntime();
    const send = await sendDurableMessageBatch({
      cfg,
      channel: normalizedChannel,
      to,
      accountId: ctx.AccountId ?? void 0,
      threadId: ctx.MessageThreadId ?? void 0,
      payloads: [{ text }],
      bestEffort: true,
      durability: "best_effort",
    });
    if (send.status === "failed") throw send.error;
    if (shouldLogVerbose()) logVerbose(`media: echo-transcript sent to ${normalizedChannel}/${to}`);
  } catch (err) {
    logVerbose(`media: echo-transcript delivery failed: ${String(err)}`);
  }
}
//#endregion
export { sendTranscriptEcho as n, DEFAULT_ECHO_TRANSCRIPT_FORMAT as t };
