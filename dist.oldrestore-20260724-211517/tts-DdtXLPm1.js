import { statSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import path from "node:path";
import { r as writeExternalFileWithinRoot } from "./fs-safe-RNq3oO57.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region extensions/microsoft/tts.ts
function inferEdgeExtension(outputFormat) {
  const normalized = normalizeLowercaseStringOrEmpty(outputFormat);
  if (normalized.includes("webm")) return ".webm";
  if (normalized.includes("ogg")) return ".ogg";
  if (normalized.includes("opus")) return ".opus";
  if (normalized.includes("wav") || normalized.includes("riff") || normalized.includes("pcm"))
    return ".wav";
  return ".mp3";
}
async function edgeTTS(params, ttsOverride) {
  const { text, outputPath, config, timeoutMs } = params;
  if (text.trim().length === 0) throw new Error("Microsoft TTS text cannot be empty");
  const tts =
    ttsOverride ??
    new (await import("node-edge-tts")).EdgeTTS({
      voice: config.voice,
      lang: config.lang,
      outputFormat: config.outputFormat,
      saveSubtitles: config.saveSubtitles,
      proxy: config.proxy,
      rate: config.rate,
      pitch: config.pitch,
      volume: config.volume,
      timeout: config.timeoutMs ?? timeoutMs,
    });
  await mkdir(path.dirname(outputPath), { recursive: true });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let outputSize = 0;
    await writeExternalFileWithinRoot({
      rootDir: path.dirname(outputPath),
      path: path.basename(outputPath),
      write: async (tempPath) => {
        writeFileSync(tempPath, "");
        await tts.ttsPromise(text, tempPath);
        outputSize = statSync(tempPath).size;
      },
    });
    if (outputSize > 0) return;
  }
  throw new Error("Edge TTS produced empty audio file after retry");
}
//#endregion
export { inferEdgeExtension as n, edgeTTS as t };
