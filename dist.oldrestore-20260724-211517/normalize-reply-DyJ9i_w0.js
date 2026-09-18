import { d as stripHeartbeatToken } from "./heartbeat-Bkwxbekw.js";
import { a as hasReplyPayloadContent } from "./payload-BFbDi85B.js";
import { i as copyReplyPayloadMetadata } from "./reply-payload-BK_jICQ3.js";
import { n as resolveResponsePrefixTemplate } from "./response-prefix-template-DdRpfl7D.js";
import { d as sanitizeUserFacingText } from "./sanitize-user-facing-text-B_JqK9fo.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  c as stripLeadingSilentToken,
  i as isSilentReplyPayloadText,
  l as stripSilentToken,
  o as isSilentReplyText,
  r as isInternalFormattingArtifact,
  s as startsWithSilentToken,
} from "./tokens-DKI4eGAu.js";
//#region src/auto-reply/reply/normalize-reply.ts
function normalizeReplyPayload(payload, opts = {}) {
  const applyChannelTransforms = opts.applyChannelTransforms ?? true;
  const hasContent = (text) =>
    hasReplyPayloadContent(
      {
        ...payload,
        text,
      },
      { trimText: true },
    );
  const trimmed = normalizeOptionalString(payload.text) ?? "";
  if (!hasContent(trimmed)) {
    opts.onSkip?.("empty");
    return null;
  }
  const silentToken = opts.silentToken ?? "NO_REPLY";
  let text = payload.text ?? void 0;
  if (text && isSilentReplyPayloadText(text, silentToken)) {
    if (!hasContent("")) {
      opts.onSkip?.("silent");
      return null;
    }
    text = "";
  }
  if (text && !isSilentReplyText(text, silentToken)) {
    const hasLeadingSilentToken = startsWithSilentToken(text, silentToken);
    if (hasLeadingSilentToken) text = stripLeadingSilentToken(text, silentToken);
    if (hasLeadingSilentToken || text.toLowerCase().includes(silentToken.toLowerCase())) {
      text = stripSilentToken(text, silentToken);
      if (!hasContent(text)) {
        opts.onSkip?.("silent");
        return null;
      }
    }
  }
  if (text && !trimmed) text = "";
  if ((opts.stripHeartbeat ?? true) && text?.includes("HEARTBEAT_OK")) {
    const stripped = stripHeartbeatToken(text, { mode: "message" });
    if (stripped.didStrip) opts.onHeartbeatStrip?.();
    if (stripped.shouldSkip && !hasContent(stripped.text)) {
      opts.onSkip?.("heartbeat");
      return null;
    }
    text = stripped.text;
  }
  if (text && isInternalFormattingArtifact(text) && !hasContent("")) {
    opts.onSkip?.("silent");
    return null;
  }
  if (text) text = sanitizeUserFacingText(text, { errorContext: Boolean(payload.isError) });
  if (!hasContent(text)) {
    opts.onSkip?.("empty");
    return null;
  }
  let enrichedPayload = copyReplyPayloadMetadata(payload, {
    ...payload,
    text,
  });
  if (applyChannelTransforms && opts.transformReplyPayload) {
    const transformedPayload = opts.transformReplyPayload(enrichedPayload);
    if (transformedPayload === null) return null;
    enrichedPayload = transformedPayload
      ? copyReplyPayloadMetadata(enrichedPayload, transformedPayload)
      : enrichedPayload;
    text = enrichedPayload.text;
  }
  const effectivePrefix = opts.responsePrefixContext
    ? resolveResponsePrefixTemplate(opts.responsePrefix, opts.responsePrefixContext)
    : opts.responsePrefix;
  if (
    effectivePrefix &&
    text &&
    text.trim() !== "HEARTBEAT_OK" &&
    !text.startsWith(effectivePrefix)
  )
    text = `${effectivePrefix} ${text}`;
  enrichedPayload = copyReplyPayloadMetadata(enrichedPayload, {
    ...enrichedPayload,
    text,
  });
  return enrichedPayload;
}
//#endregion
export { normalizeReplyPayload as t };
