import { readdirSync } from "node:fs";
import path from "node:path";
import { t as runCommandBuffered } from "./exec-CXKmx4dL.js";
import { r as writeExternalFileWithinRoot } from "./fs-safe-RNq3oO57.js";
import { w as runFfmpeg } from "./media-services-Czws84B5.js";
import { t as tempWorkspace } from "./private-temp-workspace-BrSGWjaU.js";
import { i as readRegularFileSync } from "./regular-file-CuvhUtZS.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import "./media-runtime-BhmZORKM.js";
import "./temp-path-DYqJUh96.js";
import "./runtime-env-D0V-7Gqz.js";
import "./security-runtime-CraX8Pqe.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./process-runtime-BKNTr1ic.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/tts-local-cli/speech-provider.ts
const log = createSubsystemLogger("tts-local-cli");
const VALID_OUTPUT_FORMATS = ["mp3", "opus", "wav"];
const AUDIO_EXTENSIONS = /* @__PURE__ */ new Set([".wav", ".mp3", ".opus", ".ogg", ".m4a"]);
const DEFAULT_TIMEOUT_MS = 12e4;
const MAX_AUDIO_OUTPUT_BYTES = 50 * 1024 * 1024;
const MAX_CLI_STDERR_BYTES = 1024 * 1024;
function asObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
}
function asStringArray(value) {
  return Array.isArray(value) && value.every((v) => typeof v === "string") ? value : void 0;
}
function asRecord(value) {
  const obj = asObject(value);
  if (!obj) return;
  const result = {};
  for (const [k, v] of Object.entries(obj)) if (typeof v === "string") result[k] = v;
  return Object.keys(result).length > 0 ? result : void 0;
}
function normalizeOutputFormat(value) {
  if (typeof value !== "string") return "mp3";
  const lower = value.toLowerCase().trim();
  if (VALID_OUTPUT_FORMATS.includes(lower)) return lower;
  return "mp3";
}
function resolveCliProviderConfig(rawConfig) {
  const providers = asObject(rawConfig.providers);
  return asObject(providers?.["tts-local-cli"]) ?? asObject(providers?.cli) ?? {};
}
function getConfig(cfg) {
  const command = typeof cfg.command === "string" ? cfg.command.trim() : "";
  if (!command) return null;
  return {
    command,
    args: asStringArray(cfg.args),
    outputFormat: normalizeOutputFormat(cfg.outputFormat),
    timeoutMs: typeof cfg.timeoutMs === "number" ? cfg.timeoutMs : DEFAULT_TIMEOUT_MS,
    cwd: typeof cfg.cwd === "string" ? cfg.cwd : void 0,
    env: asRecord(cfg.env),
  };
}
function stripEmojis(text) {
  return text
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function applyTemplate(str, ctx) {
  return str.replace(/{{\s*(\w+)\s*}}/gi, (_, key) => {
    return ctx[key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()] ?? ctx[key] ?? "";
  });
}
function parseCommand(cmdStr) {
  const parts = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";
  for (const char of cmdStr.trim())
    if (inQuote)
      if (char === quoteChar) inQuote = false;
      else current += char;
    else if (char === '"' || char === "'") {
      inQuote = true;
      quoteChar = char;
    } else if (char === " " || char === "	") {
      if (current) {
        parts.push(current);
        current = "";
      }
    } else current += char;
  if (current) parts.push(current);
  return {
    cmd: parts[0] || "",
    initialArgs: parts.slice(1),
  };
}
function findAudioFile(dir, baseName) {
  const files = readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (AUDIO_EXTENSIONS.has(ext) && (file.startsWith(baseName) || file.includes(baseName)))
      return path.join(dir, file);
  }
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (AUDIO_EXTENSIONS.has(ext)) return path.join(dir, file);
  }
  return null;
}
function detectFormat(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".opus" || ext === ".ogg") return "opus";
  if (ext === ".wav") return "wav";
  if (ext === ".mp3" || ext === ".m4a") return "mp3";
  return null;
}
function getFileExt(format) {
  if (format === "opus") return ".opus";
  if (format === "wav") return ".wav";
  return ".mp3";
}
function readAudioFile(filePath) {
  return readRegularFileSync({
    filePath,
    maxBytes: MAX_AUDIO_OUTPUT_BYTES,
  }).buffer;
}
async function runCli(params) {
  const cleanText = stripEmojis(params.text);
  if (!cleanText) throw new Error("CLI TTS: text is empty after removing emojis");
  const outputExt = getFileExt(params.outputFormat ?? "wav");
  const ctx = {
    Text: cleanText,
    OutputPath: path.join(params.outputDir, `${params.filePrefix}${outputExt}`),
    OutputDir: params.outputDir,
    OutputBase: params.filePrefix,
  };
  const { cmd, initialArgs } = parseCommand(params.command);
  if (!cmd) throw new Error("CLI TTS: invalid command");
  const baseArgs = [...initialArgs, ...params.args];
  const args = baseArgs.map((a) => applyTemplate(a, ctx));
  const input = baseArgs.some((a) => /{{\s*text\s*}}/i.test(a)) ? "" : cleanText;
  const result = await runCommandBuffered([cmd, ...args], {
    cwd: params.cwd,
    env: params.env,
    input,
    maxOutputBytes: {
      stdout: MAX_AUDIO_OUTPUT_BYTES,
      stderr: MAX_CLI_STDERR_BYTES,
    },
    timeoutMs: params.timeoutMs,
  });
  if (result.termination === "timeout")
    throw new Error(`CLI TTS timed out after ${params.timeoutMs}ms`);
  if (result.termination === "output-limit") {
    const stream = result.outputLimitStream ?? "stdout";
    throw new Error(
      `CLI TTS ${stream} exceeded ${stream === "stderr" ? MAX_CLI_STDERR_BYTES : MAX_AUDIO_OUTPUT_BYTES} bytes`,
    );
  }
  if (result.code !== null && result.code !== 0)
    throw new Error(`CLI TTS exit ${result.code}: ${result.stderr.toString("utf8")}`);
  if (result.termination !== "exit" && result.termination !== "error")
    throw new Error(`CLI TTS failed: ${result.error?.message ?? result.termination}`);
  if (result.termination === "error" && result.code !== 0)
    throw new Error(`CLI TTS failed: ${result.error?.message ?? result.termination}`);
  const audioFile = findAudioFile(params.outputDir, params.filePrefix);
  if (audioFile) {
    const format = detectFormat(audioFile);
    if (!format) throw new Error(`CLI TTS: unknown format for ${audioFile}`);
    return {
      buffer: readAudioFile(audioFile),
      actualFormat: format,
      audioPath: audioFile,
    };
  }
  if (result.termination === "error" && result.errorStream !== "stderr")
    throw new Error(`CLI TTS failed: ${result.error?.message ?? result.termination}`);
  const stdout = result.stdout;
  if (stdout.length > 0)
    return {
      buffer: stdout,
      actualFormat: "wav",
    };
  if (result.termination === "error")
    throw new Error(`CLI TTS failed: ${result.error?.message ?? result.termination}`);
  throw new Error("CLI TTS produced no output");
}
async function runFfmpegToBuffer(params) {
  const outputPath = path.join(params.outputDir, params.outputFileName);
  await writeExternalFileWithinRoot({
    rootDir: params.outputDir,
    path: params.outputFileName,
    write: async (tempPath) => {
      await runFfmpeg([...params.args, tempPath]);
    },
  });
  return readAudioFile(outputPath);
}
async function convertAudio(inputPath, outputDir, target) {
  const outputFileName = `converted${getFileExt(target)}`;
  const args = ["-y", "-i", inputPath];
  if (target === "opus") args.push("-c:a", "libopus", "-b:a", "64k", "-f", "opus");
  else if (target === "wav") args.push("-c:a", "pcm_s16le", "-f", "wav");
  else args.push("-c:a", "libmp3lame", "-b:a", "128k", "-f", "mp3");
  return await runFfmpegToBuffer({
    args,
    outputDir,
    outputFileName,
  });
}
async function convertToRawPcm(inputPath, outputDir) {
  return await runFfmpegToBuffer({
    args: ["-y", "-i", inputPath, "-c:a", "pcm_s16le", "-ar", "16000", "-ac", "1", "-f", "s16le"],
    outputDir,
    outputFileName: "telephony.pcm",
  });
}
function buildCliSpeechProvider() {
  return {
    id: "tts-local-cli",
    aliases: ["cli"],
    label: "Local CLI",
    autoSelectOrder: 1e3,
    resolveConfig(ctx) {
      return resolveCliProviderConfig(ctx.rawConfig);
    },
    isConfigured(ctx) {
      return getConfig(ctx.providerConfig) !== null;
    },
    async synthesize(req) {
      const config = getConfig(req.providerConfig);
      if (!config) throw new Error("CLI TTS not configured");
      log.debug(`synthesize: text=${truncateUtf16Safe(req.text, 50)}...`);
      const temp = await tempWorkspace({
        rootDir: resolvePreferredOpenClawTmpDir(),
        prefix: "openclaw-cli-tts-",
      });
      const tempDir = temp.dir;
      try {
        const result = await runCli({
          command: config.command,
          args: config.args ?? [],
          cwd: config.cwd,
          env: config.env,
          timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
          text: req.text,
          outputDir: tempDir,
          filePrefix: "speech",
          outputFormat: config.outputFormat,
        });
        log.debug(`synthesize: format=${result.actualFormat}, size=${result.buffer.length}`);
        let buffer;
        let format;
        if (req.target === "voice-note")
          if (result.actualFormat !== "opus") {
            const inputFile =
              result.audioPath ?? path.join(tempDir, `input${getFileExt(result.actualFormat)}`);
            if (!result.audioPath)
              await temp.write(`input${getFileExt(result.actualFormat)}`, result.buffer);
            buffer = await convertAudio(inputFile, tempDir, "opus");
            format = "opus";
          } else {
            buffer = result.buffer;
            format = "opus";
          }
        else {
          const desired = config.outputFormat ?? "mp3";
          if (result.actualFormat !== desired) {
            const inputFile =
              result.audioPath ?? path.join(tempDir, `input${getFileExt(result.actualFormat)}`);
            if (!result.audioPath)
              await temp.write(`input${getFileExt(result.actualFormat)}`, result.buffer);
            buffer = await convertAudio(inputFile, tempDir, desired);
            format = desired;
          } else {
            buffer = result.buffer;
            format = result.actualFormat;
          }
        }
        const fileExtension = format === "opus" ? ".ogg" : `.${format}`;
        return {
          audioBuffer: buffer,
          outputFormat: format,
          fileExtension,
          voiceCompatible: req.target === "voice-note" && format === "opus",
        };
      } finally {
        await temp.cleanup();
      }
    },
    async synthesizeTelephony(req) {
      const config = getConfig(req.providerConfig);
      if (!config) throw new Error("CLI TTS not configured");
      log.debug(`synthesizeTelephony: text=${truncateUtf16Safe(req.text, 50)}...`);
      const temp = await tempWorkspace({
        rootDir: resolvePreferredOpenClawTmpDir(),
        prefix: "openclaw-cli-tts-",
      });
      const tempDir = temp.dir;
      try {
        const result = await runCli({
          command: config.command,
          args: config.args ?? [],
          cwd: config.cwd,
          env: config.env,
          timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
          text: req.text,
          outputDir: tempDir,
          filePrefix: "telephony",
          outputFormat: config.outputFormat,
        });
        const inputFile =
          result.audioPath ?? path.join(tempDir, `input${getFileExt(result.actualFormat)}`);
        if (!result.audioPath)
          await temp.write(`input${getFileExt(result.actualFormat)}`, result.buffer);
        return {
          audioBuffer: await convertToRawPcm(inputFile, tempDir),
          outputFormat: "pcm",
          sampleRate: 16e3,
        };
      } finally {
        await temp.cleanup();
      }
    },
  };
}
//#endregion
export { buildCliSpeechProvider as t };
