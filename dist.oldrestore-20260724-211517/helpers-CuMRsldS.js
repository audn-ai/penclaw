import crypto from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-Bdqodowg.js";
import {
  n as CLI_RESUME_WATCHDOG_DEFAULTS,
  r as CLI_WATCHDOG_MIN_TIMEOUT_MS,
  t as CLI_FRESH_WATCHDOG_DEFAULTS,
} from "./cli-watchdog-defaults-CzmnkdzO.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { d as listRegisteredPluginAgentPromptGuidance } from "./command-registration-CTCK5hi-.js";
import { r as MAX_IMAGE_BYTES } from "./constants-Mf57IYS0.js";
import "./model-selection-DOlkTrQa.js";
import {
  n as detectImageReferences,
  r as loadImageFromRef,
  t as detectAndLoadPromptImages,
} from "./images-Cw4x6OCc.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.js";
import { r as extensionForMime } from "./mime-BSEMEb3s.js";
import { n as resolveRuntimeOsLabel } from "./os-summary-CVk_nSu8.js";
import { t as privateFileStore } from "./private-file-store-BSksaLX_.js";
import { t as tempWorkspace } from "./private-temp-workspace-BrSGWjaU.js";
import { t as detectRuntimeShell } from "./shell-utils-MIUiOyvx.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  n as buildConfiguredAgentSystemPrompt,
  t as buildSystemPromptParams,
} from "./system-prompt-params-D6TwvfQB.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { t as formatTomlConfigOverride } from "./toml-inline-SRiIGG7O.js";
import { n as sanitizeImageBlocks } from "./tool-images-Czo0NZbj.js";
//#region src/agents/cli-runner/log.ts
/**
 * Shared logging helpers for CLI backend diagnostics.
 */
/** Subsystem logger for CLI backend execution diagnostics. */
const cliBackendLog = createSubsystemLogger("agent/cli-backend");
/** Env var that enables CLI backend output logging. */
const CLI_BACKEND_LOG_OUTPUT_ENV = "OPENCLAW_CLI_BACKEND_LOG_OUTPUT";
/** Legacy env var accepted for Claude CLI output logging. */
const LEGACY_CLAUDE_CLI_LOG_OUTPUT_ENV = "OPENCLAW_CLAUDE_CLI_LOG_OUTPUT";
/** Return a compact byte/hash summary for CLI backend output. */
function formatCliBackendOutputDigest(text) {
  return `outBytes=${Buffer.byteLength(text, "utf8")} outHash=${crypto.createHash("sha256").update(text).digest("hex").slice(0, 12)}`;
}
//#endregion
//#region src/agents/cli-runner/reliability.ts
/**
 * Watchdog and supervisor key helpers for CLI runner reliability.
 */
function pickWatchdogProfile(backend, useResume, trigger, hasExplicitRunTimeout) {
  const configured = useResume
    ? backend.reliability?.watchdog?.resume
    : backend.reliability?.watchdog?.fresh;
  const defaults =
    useResume && !configured && (trigger === "cron" || hasExplicitRunTimeout === true)
      ? CLI_FRESH_WATCHDOG_DEFAULTS
      : useResume
        ? CLI_RESUME_WATCHDOG_DEFAULTS
        : CLI_FRESH_WATCHDOG_DEFAULTS;
  const ratio = (() => {
    const value = configured?.noOutputTimeoutRatio;
    if (typeof value !== "number" || !Number.isFinite(value)) return defaults.noOutputTimeoutRatio;
    return Math.max(0.05, Math.min(0.95, value));
  })();
  const minMs = (() => {
    const value = configured?.minMs;
    if (typeof value !== "number" || !Number.isFinite(value)) return defaults.minMs;
    return Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, Math.floor(value));
  })();
  const maxMs = (() => {
    const value = configured?.maxMs;
    if (typeof value !== "number" || !Number.isFinite(value)) return defaults.maxMs;
    return Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, Math.floor(value));
  })();
  return {
    noOutputTimeoutMs:
      typeof configured?.noOutputTimeoutMs === "number" &&
      Number.isFinite(configured.noOutputTimeoutMs)
        ? Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, Math.floor(configured.noOutputTimeoutMs))
        : void 0,
    noOutputTimeoutRatio: ratio,
    minMs: Math.min(minMs, maxMs),
    maxMs: Math.max(minMs, maxMs),
  };
}
/** Resolves the no-output watchdog timeout for a fresh or resumed CLI run. */
function resolveCliNoOutputTimeoutMs(params) {
  const hasExplicitRunTimeout =
    typeof params.runTimeoutOverrideMs === "number" &&
    Number.isFinite(params.runTimeoutOverrideMs) &&
    params.runTimeoutOverrideMs > 0;
  const profile = pickWatchdogProfile(
    params.backend,
    params.useResume,
    params.trigger,
    hasExplicitRunTimeout,
  );
  const cap = Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, params.timeoutMs - 1e3);
  if (profile.noOutputTimeoutMs !== void 0) return Math.min(profile.noOutputTimeoutMs, cap);
  const computed = Math.floor(params.timeoutMs * profile.noOutputTimeoutRatio);
  const bounded = Math.min(profile.maxMs, Math.max(profile.minMs, computed));
  return Math.min(bounded, cap);
}
function resolveCliRunTimeoutOverrideMs(params) {
  if (params.runTimeoutOverrideMs !== void 0) return params.runTimeoutOverrideMs;
  const configuredTimeoutSeconds = params.config?.agents?.defaults?.timeoutSeconds;
  return params.lane !== AGENT_LANE_SUBAGENT &&
    typeof configuredTimeoutSeconds === "number" &&
    Number.isFinite(configuredTimeoutSeconds) &&
    configuredTimeoutSeconds > 0
    ? params.timeoutMs
    : void 0;
}
/** Builds a supervisor scope key for session-owned CLI processes. */
function buildCliSupervisorScopeKey(params) {
  const commandToken = normalizeLowercaseStringOrEmpty(path.basename(params.backend.command ?? ""));
  const backendToken = normalizeLowercaseStringOrEmpty(params.backendId);
  const sessionToken = params.cliSessionId?.trim();
  if (!sessionToken) return;
  return `cli:${backendToken}:${commandToken}:${sessionToken}`;
}
//#endregion
//#region src/agents/cli-runner/helpers.ts
/**
 * Shared helpers for CLI runner prompts, args, queueing, sessions, and image
 * payload preparation.
 */
const CLI_RUN_QUEUE = new KeyedAsyncQueue();
const CLI_IMAGE_SWEEP_TTL_MS = 10080 * 60 * 1e3;
const sweptCliImageRoots = /* @__PURE__ */ new Set();
function isClaudeCliProvider(providerId) {
  return normalizeOptionalLowercaseString(providerId) === "claude-cli";
}
/** Enqueues a CLI run under a backend/session key to prevent unsafe overlap. */
function enqueueCliRun(key, task) {
  return CLI_RUN_QUEUE.enqueue(key, task);
}
/**
 * Hashes the (account, agent, auth-profile, session) tuple to a stable owner key
 * shared between the CLI run queue (`resolveCliRunQueueKey`) and the Claude live
 * session map (`buildClaudeLiveKey`). The two paths must agree byte-for-byte
 * within a single process so a fresh queued turn picks up the same live session
 * the registry already holds; the golden-hash test below pins the encoding.
 */
function buildClaudeOwnerKey(input) {
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        agentAccountId: input.agentAccountId,
        agentId: input.agentId,
        authProfileId: input.authProfileId,
        sessionId: input.sessionId,
        sessionKey: input.sessionKey,
      }),
    )
    .digest("hex");
}
/** Resolves the serialization key for a CLI backend run. */
function resolveCliRunQueueKey(params) {
  const requiresLiveSessionSerialization =
    isClaudeCliProvider(params.backendId) && params.liveSession === "claude-stdio";
  if (params.serialize === false && !requiresLiveSessionSerialization)
    return `${params.backendId}:${params.runId}`;
  if (isClaudeCliProvider(params.backendId)) {
    const ownerKey = params.ownerKey?.trim();
    if (requiresLiveSessionSerialization && ownerKey)
      return `${params.backendId}:owner:${ownerKey}`;
    const sessionId = params.cliSessionId?.trim();
    if (sessionId) return `${params.backendId}:session:${sessionId}`;
    if (ownerKey) return `${params.backendId}:owner:${ownerKey}`;
    const workspaceDir = params.workspaceDir.trim();
    if (workspaceDir) return `${params.backendId}:workspace:${workspaceDir}`;
  }
  return params.backendId;
}
/** Builds the system prompt sent to a CLI-backed agent runtime. */
function buildCliAgentSystemPrompt(params) {
  const runtimeWorkspaceDir = params.cwd?.trim() || params.workspaceDir;
  const defaultModelRef = resolveDefaultModelForAgent({
    cfg: params.config ?? {},
    agentId: params.agentId,
  });
  const defaultModelLabel = `${defaultModelRef.provider}/${defaultModelRef.model}`;
  const { runtimeInfo, userTimezone, userTime, userTimeFormat } = buildSystemPromptParams({
    config: params.config,
    agentId: params.agentId,
    workspaceDir: runtimeWorkspaceDir,
    cwd: runtimeWorkspaceDir,
    runtime: {
      sessionKey: params.sessionKey,
      sessionId: params.sessionId,
      host: "openclaw",
      os: resolveRuntimeOsLabel(),
      arch: os.arch(),
      node: process.version,
      model: params.modelDisplay,
      defaultModel: defaultModelLabel,
      shell: detectRuntimeShell(),
      channel: params.runtimeChannel,
      chatType: params.runtimeChatType,
      capabilities: params.runtimeCapabilities,
    },
  });
  return buildConfiguredAgentSystemPrompt({
    config: params.config,
    agentId: params.agentId,
    workspaceDir: runtimeWorkspaceDir,
    defaultThinkLevel: params.defaultThinkLevel,
    extraSystemPrompt: params.extraSystemPrompt,
    sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
    requireExplicitMessageTarget: params.requireExplicitMessageTarget,
    silentReplyPromptMode: params.silentReplyPromptMode,
    ownerNumbers: params.ownerNumbers,
    reasoningTagHint: false,
    heartbeatPrompt: params.heartbeatPrompt,
    docsPath: params.docsPath,
    sourcePath: params.sourcePath,
    acpEnabled: isAcpRuntimeSpawnAvailable({ config: params.config }),
    promptSurface: "cli_backend",
    nativeCommandGuidanceLines: listRegisteredPluginAgentPromptGuidance({ surface: "cli_backend" }),
    runtimeInfo,
    toolNames: params.tools.map((tool) => tool.name),
    skillsPrompt: params.skillsPrompt,
    userTimezone,
    userTime,
    userTimeFormat,
    contextFiles: params.contextFiles,
    bootstrapMode: params.bootstrapMode,
  });
}
/** Applies backend model aliases to a requested CLI model id. */
function normalizeCliModel(modelId, backend) {
  const trimmed = modelId.trim();
  if (!trimmed) return trimmed;
  const direct = backend.modelAliases?.[trimmed];
  if (direct) return direct;
  const lower = normalizeLowercaseStringOrEmpty(trimmed);
  const mapped = backend.modelAliases?.[lower];
  if (mapped) return mapped;
  return trimmed;
}
/** Decides whether a system prompt should be sent for this CLI turn. */
function resolveSystemPromptUsage(params) {
  const systemPrompt = params.systemPrompt?.trim();
  if (!systemPrompt) return null;
  const when = params.backend.systemPromptWhen ?? "first";
  if (when === "never") return null;
  if (when === "first" && !params.isNewSession) return null;
  if (
    !params.backend.systemPromptArg?.trim() &&
    !params.backend.systemPromptFileArg?.trim() &&
    !params.backend.systemPromptFileConfigKey?.trim()
  )
    return null;
  return systemPrompt;
}
/** Resolves the CLI session id to send and whether the turn starts a new session. */
function resolveSessionIdToSend(params) {
  const mode = params.backend.sessionMode ?? "always";
  const existing = params.cliSessionId?.trim();
  if (mode === "none")
    return {
      sessionId: void 0,
      isNew: !existing,
    };
  if (mode === "existing")
    return {
      sessionId: existing,
      isNew: !existing,
    };
  if (existing)
    return {
      sessionId: existing,
      isNew: false,
    };
  return {
    sessionId: crypto.randomUUID(),
    isNew: true,
  };
}
/** Routes prompt text to argv or stdin based on backend input policy. */
function resolvePromptInput(params) {
  if ((params.backend.input ?? "arg") === "stdin") return { stdin: params.prompt };
  if (params.backend.maxPromptArgChars && params.prompt.length > params.backend.maxPromptArgChars)
    return { stdin: params.prompt };
  return { argsPrompt: params.prompt };
}
function resolveCliImagePath(image) {
  const ext = extensionForMime(image.mimeType) ?? ".bin";
  const digest = crypto
    .createHash("sha256")
    .update(image.mimeType)
    .update("\0")
    .update(image.data)
    .digest("hex");
  return path.join(resolvePreferredOpenClawTmpDir(), "openclaw-cli-images", `${digest}${ext}`);
}
function resolveCliImageRoot(params) {
  if (params.backend.imagePathScope === "workspace")
    return path.join(params.workspaceDir, ".openclaw-cli-images");
  return path.join(resolvePreferredOpenClawTmpDir(), "openclaw-cli-images");
}
function isFileNotFoundError(error) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}
async function sweepCliImageRoot(imageRoot) {
  if (sweptCliImageRoots.has(imageRoot)) return;
  sweptCliImageRoots.add(imageRoot);
  try {
    const cutoffMs = Date.now() - CLI_IMAGE_SWEEP_TTL_MS;
    const entries = await fs.readdir(imageRoot, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const entryPath = path.join(imageRoot, entry.name);
      const stat = await fs.stat(entryPath).catch((error) => {
        if (isFileNotFoundError(error)) return;
        throw error;
      });
      if (!stat) continue;
      if (stat.mtimeMs >= cutoffMs) continue;
      try {
        await fs.rm(entryPath, { force: true });
      } catch (error) {
        if (!isFileNotFoundError(error)) throw error;
      }
    }
  } catch (error) {
    cliBackendLog.debug(`cli image cache sweep failed: ${String(error)}`);
  }
}
function appendImagePathsToPrompt(prompt, paths, prefix = "") {
  if (!paths.length) return prompt;
  const trimmed = prompt.trimEnd();
  return `${trimmed}${trimmed ? "\n\n" : ""}${paths.map((entry) => `${prefix}${entry}`).join("\n")}`;
}
/** Loads and sanitizes image references found in prompt text. */
async function loadPromptRefImages(params) {
  const refs = detectImageReferences(params.prompt);
  if (refs.length === 0) return [];
  const maxBytes = params.maxBytes ?? 6291456;
  const seen = /* @__PURE__ */ new Set();
  const images = [];
  for (const ref of refs) {
    const key = `${ref.type}:${ref.resolved}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const image = await loadImageFromRef(ref, params.workspaceDir, {
      maxBytes,
      workspaceOnly: params.workspaceOnly,
      sandbox: params.sandbox,
    });
    if (image) images.push(image);
  }
  const { images: sanitizedImages } = await sanitizeImageBlocks(images, "prompt:images", {
    maxBytes,
  });
  return sanitizedImages;
}
/** Writes CLI image payloads to private paths and returns their file paths. */
async function writeCliImages(params) {
  const imageRoot = resolveCliImageRoot({
    backend: params.backend,
    workspaceDir: params.workspaceDir,
  });
  await fs.mkdir(imageRoot, {
    recursive: true,
    mode: 448,
  });
  await sweepCliImageRoot(imageRoot);
  const store = privateFileStore(imageRoot);
  const paths = [];
  for (const image of params.images) {
    const fileName = path.basename(resolveCliImagePath(image));
    const buffer = Buffer.from(image.data, "base64");
    await store.writeText(fileName, buffer);
    paths.push(store.path(fileName));
  }
  const cleanup = async () => {};
  return {
    paths,
    cleanup,
  };
}
/** Writes a temporary system prompt file when the backend needs file-based prompts. */
async function writeCliSystemPromptFile(params) {
  if (
    !params.backend.systemPromptFileArg?.trim() &&
    !params.backend.systemPromptFileConfigKey?.trim()
  )
    return { cleanup: async () => {} };
  const workspace = await tempWorkspace({
    rootDir: resolvePreferredOpenClawTmpDir(),
    prefix: "openclaw-cli-system-prompt-",
  });
  return {
    filePath: await workspace.write(
      "system-prompt.md",
      stripSystemPromptCacheBoundary(params.systemPrompt),
    ),
    cleanup: async () => await workspace.cleanup(),
  };
}
/** Prepares prompt text and image paths for a CLI backend run. */
async function prepareCliPromptImagePayload(params) {
  let prompt = params.prompt;
  const resolvedImages =
    params.imagePrompt !== void 0
      ? (
          await detectAndLoadPromptImages({
            prompt: params.imagePrompt,
            workspaceDir: params.workspaceDir,
            model: { input: ["text", "image"] },
            existingImages: params.images,
            imageOrder: params.imageOrder,
            maxBytes: MAX_IMAGE_BYTES,
          })
        ).images
      : params.images && params.images.length > 0
        ? params.images
        : await loadPromptRefImages({
            prompt,
            workspaceDir: params.workspaceDir,
          });
  if (resolvedImages.length === 0) return { prompt };
  const imagePayload = await writeCliImages({
    backend: params.backend,
    workspaceDir: params.workspaceDir,
    images: resolvedImages,
  });
  const imagePaths = imagePayload.paths;
  if (
    !params.backend.imageArg ||
    params.backend.input === "stdin" ||
    params.backend.imageArg === "@"
  )
    prompt = appendImagePathsToPrompt(
      prompt,
      imagePaths,
      params.backend.imageArg === "@" ? "@" : "",
    );
  return {
    prompt,
    imagePaths,
    cleanupImages: imagePayload.cleanup,
  };
}
/** Builds final CLI argv from backend config and prepared prompt/session inputs. */
function buildCliArgs(params) {
  const args = [...params.baseArgs];
  const shouldSendSystemPrompt =
    !params.useResume ||
    params.backend.systemPromptWhen === "always" ||
    params.sendSystemPromptOnResume;
  if (params.backend.modelArg && params.modelId) args.push(params.backend.modelArg, params.modelId);
  if (
    shouldSendSystemPrompt &&
    params.systemPrompt &&
    params.systemPromptFilePath &&
    params.backend.systemPromptFileArg
  )
    args.push(params.backend.systemPromptFileArg, params.systemPromptFilePath);
  else if (
    shouldSendSystemPrompt &&
    params.systemPrompt &&
    params.systemPromptFilePath &&
    params.backend.systemPromptFileConfigKey
  )
    args.push(
      params.backend.systemPromptFileConfigArg ?? "-c",
      formatTomlConfigOverride(
        params.backend.systemPromptFileConfigKey,
        params.systemPromptFilePath,
      ),
    );
  else if (shouldSendSystemPrompt && params.systemPrompt && params.backend.systemPromptArg)
    args.push(params.backend.systemPromptArg, stripSystemPromptCacheBoundary(params.systemPrompt));
  if (!params.useResume && params.sessionId) {
    if (params.backend.sessionArgs && params.backend.sessionArgs.length > 0)
      for (const entry of params.backend.sessionArgs)
        args.push(entry.replaceAll("{sessionId}", params.sessionId));
    else if (params.backend.sessionArg) args.push(params.backend.sessionArg, params.sessionId);
  }
  if (params.useResume && params.forkResume) {
    if (!params.backend.forkArg)
      throw new Error("CLI backend does not support forked session resume");
    args.push(params.backend.forkArg);
  }
  if (params.promptArg !== void 0) {
    let replacedPromptPlaceholder = false;
    for (let i = 0; i < args.length; i += 1)
      if (args[i] === "{prompt}") {
        args[i] = params.promptArg;
        replacedPromptPlaceholder = true;
      }
    if (!replacedPromptPlaceholder) args.push(params.promptArg);
  }
  if (params.imagePaths && params.imagePaths.length > 0) {
    const mode = params.backend.imageMode ?? "repeat";
    const imageArg = params.backend.imageArg;
    if (imageArg && imageArg !== "@")
      if (mode === "list") args.push(imageArg, params.imagePaths.join(","));
      else for (const imagePath of params.imagePaths) args.push(imageArg, imagePath);
  }
  return args;
}
//#endregion
export {
  cliBackendLog as _,
  normalizeCliModel as a,
  resolvePromptInput as c,
  writeCliSystemPromptFile as d,
  buildCliSupervisorScopeKey as f,
  LEGACY_CLAUDE_CLI_LOG_OUTPUT_ENV as g,
  CLI_BACKEND_LOG_OUTPUT_ENV as h,
  enqueueCliRun as i,
  resolveSessionIdToSend as l,
  resolveCliRunTimeoutOverrideMs as m,
  buildCliAgentSystemPrompt as n,
  prepareCliPromptImagePayload as o,
  resolveCliNoOutputTimeoutMs as p,
  buildCliArgs as r,
  resolveCliRunQueueKey as s,
  buildClaudeOwnerKey as t,
  resolveSystemPromptUsage as u,
  formatCliBackendOutputDigest as v,
};
