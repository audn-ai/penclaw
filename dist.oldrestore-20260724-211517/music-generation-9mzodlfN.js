import { a as maxBytesForKind } from "./constants-Mf57IYS0.js";
import { d as readResponseWithLimit } from "./http-body-aoMvQQlg.js";
import { r as extensionForMime } from "./mime-BSEMEb3s.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { i as fetchProviderDownloadResponse } from "./shared-CfGzzOqJ.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/music-generation/provider-assets.ts
function normalizeSpecificAudioMimeType(value) {
  const mimeType = normalizeOptionalString(value)?.split(";")[0]?.trim().toLowerCase();
  if (!mimeType || mimeType === "application/octet-stream" || mimeType === "binary/octet-stream")
    return;
  return mimeType;
}
function pushGeneratedMusicFileCandidate(candidates, value) {
  if (typeof value === "string") {
    const url = normalizeOptionalString(value);
    if (url) candidates.push({ url });
    return;
  }
  if (!isRecord(value)) return;
  const url = normalizeOptionalString(value.url);
  if (!url) return;
  candidates.push({
    url,
    ...(normalizeOptionalString(value.content_type)
      ? { mimeType: normalizeOptionalString(value.content_type) }
      : {}),
    ...(normalizeOptionalString(value.file_name)
      ? { fileName: normalizeOptionalString(value.file_name) }
      : {}),
  });
}
/** Extract URL/file candidates from common provider response keys. */
function extractGeneratedMusicFileCandidates(payload, keys = ["audio", "audio_file"]) {
  if (!isRecord(payload)) return [];
  const candidates = [];
  for (const key of keys) pushGeneratedMusicFileCandidate(candidates, payload[key]);
  return candidates;
}
/** Convert a base64 provider payload into a generated music asset. */
function generatedMusicAssetFromBase64(params) {
  const ext = extensionForMime(params.mimeType)?.replace(/^\./u, "") || "mp3";
  return {
    buffer: Buffer.from(params.base64, "base64"),
    mimeType: params.mimeType,
    fileName: params.fileName ?? `track-${(params.index ?? 0) + 1}.${ext}`,
  };
}
/** Download a generated music URL with size limits and inferred audio metadata. */
async function downloadGeneratedMusicAsset(params) {
  const response = await fetchProviderDownloadResponse({
    url: params.candidate.url,
    init: { method: "GET" },
    timeoutMs: params.timeoutMs,
    fetchFn: params.fetchFn,
    provider: params.provider,
    requestFailedMessage: params.requestFailedMessage,
  });
  const mimeType =
    normalizeSpecificAudioMimeType(response.headers.get("content-type")) ??
    normalizeSpecificAudioMimeType(params.candidate.mimeType) ??
    "audio/mpeg";
  const ext = extensionForMime(mimeType)?.replace(/^\./u, "") || "mp3";
  return {
    buffer: await readResponseWithLimit(response, params.maxBytes ?? maxBytesForKind("audio"), {
      onOverflow: ({ maxBytes: maxBytesLocal }) =>
        /* @__PURE__ */ new Error(
          `${params.provider} generated music download exceeds ${maxBytesLocal} bytes`,
        ),
    }),
    mimeType,
    fileName: params.candidate.fileName ?? `track-${(params.index ?? 0) + 1}.${ext}`,
    metadata: { url: params.candidate.url },
  };
}
//#endregion
export {
  extractGeneratedMusicFileCandidates as n,
  generatedMusicAssetFromBase64 as r,
  downloadGeneratedMusicAsset as t,
};
