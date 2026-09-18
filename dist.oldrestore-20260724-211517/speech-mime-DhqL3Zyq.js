import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/server-methods/speech-mime.ts
function inferSpeechMimeType(outputFormat, fileExtension) {
  const normalizedOutput = normalizeOptionalLowercaseString(outputFormat);
  const normalizedExtension = normalizeOptionalLowercaseString(fileExtension);
  if (
    normalizedOutput === "mp3" ||
    normalizedOutput?.startsWith("mp3_") ||
    normalizedOutput?.endsWith("-mp3") ||
    normalizedExtension === ".mp3"
  )
    return "audio/mpeg";
  if (
    normalizedOutput === "opus" ||
    normalizedOutput?.startsWith("opus_") ||
    normalizedExtension === ".opus" ||
    normalizedExtension === ".ogg"
  )
    return "audio/ogg";
  if (normalizedOutput?.endsWith("-wav") || normalizedExtension === ".wav") return "audio/wav";
  if (normalizedOutput?.endsWith("-webm") || normalizedExtension === ".webm") return "audio/webm";
}
//#endregion
export { inferSpeechMimeType as t };
