import { t as asBoolean } from "./boolean-CrriykWV.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { r as resolveToolDisplay, t as formatToolDetail } from "./tool-display-D6v1e5bQ.js";
import { m as shortenHomeInString } from "./utils-DtcDeqWS.js";
//#region src/auto-reply/tool-meta.ts
/** Formats compact tool metadata labels for auto-reply progress/status messages. */
/** Formats one grouped tool-progress label from a tool name and metadata entries. */
function formatToolAggregate(toolName, metas, options) {
  const filtered = (metas ?? []).filter(Boolean).map(shortenHomeInString);
  const display = resolveToolDisplay({ name: toolName });
  const normalizedToolName = normalizeLowercaseStringOrEmpty(toolName);
  const compactCommandSummary =
    filtered.length > 0 && (normalizedToolName === "exec" || normalizedToolName === "bash");
  const prefix = compactCommandSummary ? display.emoji : `${display.emoji} ${display.label}`;
  if (!filtered.length) return `${display.emoji} ${display.label}`;
  const rawSegments = [];
  const grouped = {};
  for (const m of filtered) {
    if (!isPathLike(m)) {
      rawSegments.push(m);
      continue;
    }
    if (m.includes("→")) {
      rawSegments.push(m);
      continue;
    }
    const parts = m.split("/");
    if (parts.length > 1) {
      const dir = parts.slice(0, -1).join("/");
      const base = parts.at(-1) ?? m;
      if (!grouped[dir]) grouped[dir] = [];
      grouped[dir].push(base);
    } else {
      if (!grouped["."]) grouped["."] = [];
      grouped["."].push(m);
    }
  }
  const segments = Object.entries(grouped).map(([dir, files]) => {
    const brace = files.length > 1 ? `{${files.join(", ")}}` : files[0];
    if (dir === ".") return brace;
    return `${dir}/${brace}`;
  });
  const formattedMeta = formatMetaForDisplay(
    toolName,
    [...rawSegments, ...segments].join("; "),
    options?.markdown,
  );
  return compactCommandSummary ? `${prefix} ${formattedMeta}` : `${prefix}: ${formattedMeta}`;
}
function formatMetaForDisplay(toolName, meta, markdown) {
  const normalized = normalizeLowercaseStringOrEmpty(toolName);
  if (normalized === "exec" || normalized === "bash") {
    const { flags, body } = splitExecFlags(meta);
    if (flags.length > 0) {
      if (!body) return flags.join(" · ");
      return `${flags.join(" · ")} · ${maybeWrapMarkdown(body, markdown)}`;
    }
  }
  return maybeWrapMarkdown(meta, markdown);
}
function splitExecFlags(meta) {
  const parts = meta
    .split(" · ")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0)
    return {
      flags: [],
      body: "",
    };
  const flags = [];
  const bodyParts = [];
  for (const part of parts) {
    if (part === "elevated" || part === "pty") {
      flags.push(part);
      continue;
    }
    bodyParts.push(part);
  }
  return {
    flags,
    body: bodyParts.join(" · "),
  };
}
function isPathLike(value) {
  if (!value) return false;
  if (value.includes(" ")) return false;
  if (value.includes("://")) return false;
  if (value.includes("·")) return false;
  if (value.includes("&&") || value.includes("||")) return false;
  return /^~?(\/[^\s]+)+$/.test(value);
}
function maybeWrapMarkdown(value, markdown) {
  return markdown ? formatInlineCodeSpan(value) : value;
}
//#endregion
//#region src/shared/progress-labels.ts
const DEFAULT_PROGRESS_DRAFT_LABELS$1 = ["Working"];
function hashProgressSeed(seed) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function selectProgressLabel(params) {
  const labels = params.labels ?? DEFAULT_PROGRESS_DRAFT_LABELS$1;
  if (labels.length === 0) return;
  return (
    labels[
      typeof params.seed === "string" && params.seed.length > 0
        ? hashProgressSeed(params.seed) % labels.length
        : Math.floor(Math.max(0, Math.min(0.999999, params.random?.() ?? 0)) * labels.length)
    ] ?? labels[0]
  );
}
//#endregion
//#region src/channels/streaming-flat-key-deprecation.ts
const log = createSubsystemLogger("channels/streaming");
const warnedFlatStreamingKeys = /* @__PURE__ */ new Set();
/** Warns once per process per flat key when a resolver used the flat fallback. */
function warnFlatStreamingKeyFallback(flatKey, nestedPath) {
  if (warnedFlatStreamingKeys.has(flatKey)) return;
  warnedFlatStreamingKeys.add(flatKey);
  log.warn(
    `Flat channel streaming key "${flatKey}" is deprecated; move it to streaming.${nestedPath}. The flat fallback is removed after the next release train.`,
  );
}
function asObjectRecord$1(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function asTextChunkMode(value) {
  return value === "length" || value === "newline" ? value : void 0;
}
function asBlockStreamingCoalesceConfig(value) {
  return asObjectRecord$1(value) ?? void 0;
}
function asBlockStreamingChunkConfig(value) {
  return asObjectRecord$1(value) ?? void 0;
}
function getNestedStreamingConfig(entry) {
  const streaming = asObjectRecord$1(entry?.streaming);
  return streaming ? streaming : void 0;
}
function resolveWithFlatFallback(params) {
  if (params.nested !== void 0) return params.nested;
  if (params.flat !== void 0) warnFlatStreamingKeyFallback(params.flatKey, params.nestedPath);
  return params.flat;
}
function resolveChannelStreamingChunkMode(entry) {
  return resolveWithFlatFallback({
    nested: asTextChunkMode(getNestedStreamingConfig(entry)?.chunkMode),
    flat: asTextChunkMode(entry?.chunkMode),
    flatKey: "chunkMode",
    nestedPath: "chunkMode",
  });
}
function resolveChannelStreamingBlockEnabled(entry) {
  return resolveWithFlatFallback({
    nested: asBoolean(getNestedStreamingConfig(entry)?.block?.enabled),
    flat: asBoolean(entry?.blockStreaming),
    flatKey: "blockStreaming",
    nestedPath: "block.enabled",
  });
}
function resolveChannelStreamingBlockCoalesce(entry) {
  return resolveWithFlatFallback({
    nested: asBlockStreamingCoalesceConfig(getNestedStreamingConfig(entry)?.block?.coalesce),
    flat: asBlockStreamingCoalesceConfig(entry?.blockStreamingCoalesce),
    flatKey: "blockStreamingCoalesce",
    nestedPath: "block.coalesce",
  });
}
function resolveChannelStreamingPreviewChunk(entry) {
  return resolveWithFlatFallback({
    nested: asBlockStreamingChunkConfig(getNestedStreamingConfig(entry)?.preview?.chunk),
    flat: asBlockStreamingChunkConfig(entry?.draftChunk),
    flatKey: "draftChunk",
    nestedPath: "preview.chunk",
  });
}
//#endregion
//#region src/channels/streaming.ts
function asObjectRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function asInteger(value) {
  return typeof value === "number" && Number.isInteger(value) ? value : void 0;
}
function normalizeStreamingMode(value) {
  if (typeof value !== "string") return null;
  return normalizeOptionalLowercaseString(value) || null;
}
function parsePreviewStreamingMode(value) {
  const normalized = normalizeStreamingMode(value);
  if (
    normalized === "off" ||
    normalized === "partial" ||
    normalized === "block" ||
    normalized === "progress"
  )
    return normalized;
  return null;
}
function asProgressConfig(value) {
  return asObjectRecord(value) ?? void 0;
}
function asCommandTextMode(value) {
  return value === "raw" || value === "status" ? value : void 0;
}
const DEFAULT_PROGRESS_DRAFT_LABELS = DEFAULT_PROGRESS_DRAFT_LABELS$1;
const DEFAULT_PROGRESS_DRAFT_INITIAL_DELAY_MS = 5e3;
const DEFAULT_PROGRESS_DRAFT_MAX_LINE_CHARS = 120;
const PROGRESS_DRAFT_NARRATION_MAX_CHARS = 280;
const MIN_TRUNCATED_FINAL_PREFIX_CHARS = 48;
const MIN_TRUNCATED_FINAL_CONTINUATION_CHARS = 24;
const NON_WORK_PROGRESS_TOOL_NAMES = /* @__PURE__ */ new Set([
  "message",
  "messages",
  "reply",
  "send",
  "reaction",
  "react",
  "typing",
]);
function isChannelProgressDraftWorkToolName(name) {
  const normalized = normalizeOptionalLowercaseString(name);
  return Boolean(normalized && !NON_WORK_PROGRESS_TOOL_NAMES.has(normalized));
}
function stripTrailingEllipsis(text) {
  return text.replace(/(?:\s*(?:\.{3}|\u2026))+$/u, "").trimEnd();
}
function isPotentialTruncatedFinal(finalText) {
  const trimmedFinal = finalText.trimEnd();
  const untruncatedFinal = stripTrailingEllipsis(trimmedFinal);
  return (
    untruncatedFinal.length >= MIN_TRUNCATED_FINAL_PREFIX_CHARS && untruncatedFinal !== trimmedFinal
  );
}
function selectLongerFinalText(params) {
  const finalText = params.finalText.trimEnd();
  if (!isPotentialTruncatedFinal(finalText)) return;
  const untruncatedFinal = stripTrailingEllipsis(finalText);
  for (const candidate of params.candidateTexts) {
    const candidateText = candidate?.trimEnd();
    if (
      !candidateText ||
      candidateText.length <= finalText.length ||
      !candidateText.startsWith(untruncatedFinal)
    )
      continue;
    const continuation = candidateText.slice(untruncatedFinal.length).trimStart();
    if (
      continuation.length >= MIN_TRUNCATED_FINAL_CONTINUATION_CHARS &&
      /^[\p{L}\p{N}]/u.test(continuation)
    )
      return candidateText;
  }
}
async function resolveTranscriptBackedChannelFinalText(params) {
  if (!isPotentialTruncatedFinal(params.finalText)) return params.finalText;
  const candidateText = await params.resolveCandidateText();
  return (
    selectLongerFinalText({
      finalText: params.finalText,
      candidateTexts: [candidateText],
    }) ?? params.finalText
  );
}
const EMOJI_PREFIX_RE = /^\p{Extended_Pictographic}/u;
const progressDraftLineCorrelationKeys = /* @__PURE__ */ new WeakMap();
function compactStrings(values) {
  return values.map((value) => value?.replace(/\s+/g, " ").trim()).filter(Boolean);
}
function inferToolMeta(name, args, detailMode = "explain") {
  if (!name || !args) return;
  return formatToolDetail(
    resolveToolDisplay({
      name,
      args,
      detailMode,
    }),
  );
}
function buildNamedProgressLine(kind, name, metas, options, fields) {
  const normalizedName = name?.trim() || "tool_call";
  const compactMetas = compactStrings(metas ?? []);
  const text = formatToolAggregate(normalizedName, compactMetas.length ? compactMetas : void 0, {
    markdown: options?.markdown,
  });
  const display = resolveToolDisplay({ name: normalizedName });
  const prefix = `${display.emoji} ${display.label}`;
  const compactCommandDetail =
    (display.name === "exec" || display.name === "bash") && text.startsWith(`${display.emoji} `)
      ? text.slice(display.emoji.length + 1).trim()
      : void 0;
  const compactCommandPrefix =
    compactCommandDetail && compactCommandDetail !== display.label ? compactCommandDetail : void 0;
  const detail = text.startsWith(`${prefix}: `)
    ? text.slice(prefix.length + 2).trim()
    : compactCommandPrefix;
  const line = {
    ...(fields?.id ? { id: fields.id } : {}),
    kind,
    text,
    label: display.label,
    icon: display.emoji,
    ...(detail ? { detail } : {}),
    ...(fields?.status ? { status: fields.status } : {}),
    toolName: display.name,
  };
  setProgressDraftLineCorrelationKey(line, fields?.correlationKey);
  return line;
}
function setProgressDraftLineCorrelationKey(line, correlationKey) {
  const normalized = correlationKey?.trim();
  if (normalized) progressDraftLineCorrelationKeys.set(line, normalized);
}
function itemKindToToolName(kind) {
  switch (normalizeOptionalLowercaseString(kind)) {
    case "command":
      return "exec";
    case "patch":
      return "apply_patch";
    case "search":
      return "web_search";
    case "api":
      return "api";
    case "tool":
      return "tool_call";
    default:
      return;
  }
}
/** Tools whose detail is raw command text; commandText policy applies to these. */
function isCommandToolName(name) {
  const normalized = normalizeOptionalLowercaseString(name);
  return normalized === "exec" || normalized === "shell" || normalized === "bash";
}
function isCommandProgressItem(input) {
  return (
    normalizeOptionalLowercaseString(input.itemKind) === "command" || isCommandToolName(input.name)
  );
}
function resolveProgressDraftLineId(input, params) {
  const itemId = input.itemId?.trim();
  const toolCallId = input.toolCallId?.trim();
  if (itemId) return itemId;
  return params?.useToolCallIdFallback === true ? toolCallId : void 0;
}
function resolveCommandProgressCorrelationKey(input) {
  const toolCallId = input.toolCallId?.trim();
  return toolCallId ? `command:${toolCallId}` : void 0;
}
function isTerminalProgressStatus(status) {
  const normalized = normalizeOptionalLowercaseString(status);
  return (
    normalized === "completed" ||
    normalized === "failed" ||
    normalized?.startsWith("exit ") === true
  );
}
function isEmptyReasoningProgressItem(input, meta) {
  return (
    !meta &&
    normalizeOptionalLowercaseString(input.itemKind) === "analysis" &&
    normalizeOptionalLowercaseString(input.title) === "reasoning"
  );
}
function patchMetas(input) {
  const fileMetas = [...(input.added ?? []), ...(input.modified ?? []), ...(input.deleted ?? [])];
  return compactStrings([input.summary, ...fileMetas, input.title]);
}
function buildCommandOutputProgressLine(input, status, options) {
  const name = input.name ?? "exec";
  const correlationKey = resolveCommandProgressCorrelationKey(input);
  const detail = options?.commandText === "status" ? [] : compactStrings([input.title]);
  const line = buildNamedProgressLine(input.event, name, detail, options, {
    correlationKey,
    id: resolveProgressDraftLineId(input, { useToolCallIdFallback: true }),
    status,
  });
  if (!line || !status) return line;
  if (status === "completed") return line;
  if (!line.detail || line.detail === status) {
    const statusLine = {
      ...line,
      detail: status,
      text: formatToolAggregate(name, [status], { markdown: options?.markdown }),
    };
    setProgressDraftLineCorrelationKey(statusLine, correlationKey);
    return statusLine;
  }
  const statusLine = {
    ...line,
    text: formatToolAggregate(name, [status, line.detail], { markdown: options?.markdown }),
  };
  setProgressDraftLineCorrelationKey(statusLine, correlationKey);
  return statusLine;
}
function shouldPrefixProgressLine(line) {
  return !EMOJI_PREFIX_RE.test(line);
}
function formatChannelProgressDraftLine(input, options) {
  return buildChannelProgressDraftLine(input, options)?.text;
}
function resolveChannelProgressDraftLineOptions(entry, options) {
  return {
    ...options,
    commandText: options?.commandText ?? resolveChannelStreamingPreviewCommandText(entry),
  };
}
function buildChannelProgressDraftLineForEntry(entry, input, options) {
  return buildChannelProgressDraftLine(
    input,
    resolveChannelProgressDraftLineOptions(entry, options),
  );
}
function formatChannelProgressDraftLineForEntry(entry, input, options) {
  return buildChannelProgressDraftLineForEntry(entry, input, options)?.text;
}
function buildChannelProgressDraftLine(input, options) {
  switch (input.event) {
    case "tool": {
      const itemId = input.itemId ?? (input.toolCallId ? `tool:${input.toolCallId}` : void 0);
      return buildNamedProgressLine(
        input.event,
        input.name,
        [
          options?.commandText === "status" && isCommandToolName(input.name)
            ? void 0
            : inferToolMeta(input.name, input.args, options?.detailMode),
          input.phase && !input.name ? input.phase : void 0,
        ],
        options,
        {
          correlationKey: isCommandToolName(input.name)
            ? resolveCommandProgressCorrelationKey(input)
            : void 0,
          id: itemId,
        },
      );
    }
    case "item": {
      const name = input.name ?? itemKindToToolName(input.itemKind);
      const meta =
        input.meta ??
        input.summary ??
        (options?.commandText === "status" && isCommandProgressItem(input)
          ? void 0
          : input.progressText);
      if (isEmptyReasoningProgressItem(input, meta)) return;
      if (name)
        return buildNamedProgressLine(input.event, name, [meta], options, {
          correlationKey: isCommandProgressItem(input)
            ? resolveCommandProgressCorrelationKey(input)
            : void 0,
          id: resolveProgressDraftLineId(input),
          status: input.status,
        });
      const text = compactStrings([meta, input.title]).at(0);
      const id = resolveProgressDraftLineId(input);
      const correlationKey = isCommandProgressItem(input)
        ? resolveCommandProgressCorrelationKey(input)
        : void 0;
      if (!text) return;
      const line = {
        ...(id ? { id } : {}),
        kind: input.event,
        text,
        label: input.title?.trim() || input.itemKind?.trim() || "Update",
        ...(input.status ? { status: input.status } : {}),
      };
      setProgressDraftLineCorrelationKey(line, correlationKey);
      return line;
    }
    case "plan":
      if (input.phase !== void 0 && input.phase !== "update") return;
      return buildNamedProgressLine(
        input.event,
        "update_plan",
        [input.explanation, input.steps?.[0], input.title ?? "planning"],
        options,
      );
    case "approval":
      if (input.phase !== void 0 && input.phase !== "requested") return;
      return buildNamedProgressLine(
        input.event,
        "approval",
        [input.command, input.message, input.reason, input.title ?? "approval requested"],
        options,
        { status: "requested" },
      );
    case "command-output":
      if (input.phase !== void 0 && input.phase !== "end") return;
      return buildCommandOutputProgressLine(
        input,
        input.exitCode === 0
          ? "completed"
          : input.exitCode != null
            ? `exit ${input.exitCode}`
            : input.status,
        options,
      );
    case "patch":
      if (input.phase !== void 0 && input.phase !== "end") return;
      return buildNamedProgressLine(
        input.event,
        input.name ?? "apply_patch",
        patchMetas(input),
        options,
        { id: input.itemId ?? input.toolCallId },
      );
  }
}
function createChannelProgressDraftGate(params) {
  const initialDelayMs = params.initialDelayMs ?? 5e3;
  const setTimeoutFn = params.setTimeoutFn ?? setTimeout;
  const clearTimeoutFn = params.clearTimeoutFn ?? clearTimeout;
  const reportStartError =
    params.onStartError ??
    ((error) => {
      console.warn(`[progress-draft] channel progress draft failed to start: ${String(error)}`);
    });
  let started = false;
  let disposed = false;
  let workEvents = 0;
  let timer;
  let startPromise;
  const clearTimer = () => {
    if (timer) {
      clearTimeoutFn(timer);
      timer = void 0;
    }
  };
  const start = () => {
    if (disposed || started) return startPromise ?? Promise.resolve();
    if (startPromise) return startPromise;
    clearTimer();
    started = true;
    const nextStart = Promise.resolve()
      .then(params.onStart)
      .then(() => {
        if (disposed) started = false;
        if (startPromise === nextStart) startPromise = void 0;
      })
      .catch((error) => {
        if (startPromise === nextStart) startPromise = void 0;
        started = false;
        throw error;
      });
    startPromise = nextStart;
    return startPromise;
  };
  const schedule = () => {
    if (timer || started || disposed || initialDelayMs < 0) return;
    timer = setTimeoutFn(() => {
      timer = void 0;
      start().catch((error) => {
        reportStartError(error);
      });
    }, initialDelayMs);
  };
  return {
    get hasStarted() {
      return started;
    },
    get workEvents() {
      return workEvents;
    },
    async noteWork() {
      if (disposed) return false;
      workEvents += 1;
      if (startPromise) {
        await startPromise;
        return started;
      }
      if (started) return true;
      schedule();
      return false;
    },
    async startNow() {
      await start();
    },
    cancel() {
      disposed = true;
      started = false;
      clearTimer();
    },
    reset() {
      clearTimer();
      started = false;
      disposed = false;
      workEvents = 0;
      startPromise = void 0;
    },
  };
}
function getChannelStreamingConfigObject(entry) {
  const streaming = asObjectRecord(entry?.streaming);
  return streaming ? streaming : void 0;
}
function resolveChannelStreamingPreviewToolProgress(entry, defaultValue = true) {
  const config = getChannelStreamingConfigObject(entry);
  if (resolveChannelPreviewStreamMode(entry, "partial") === "progress")
    return (
      asBoolean(config?.progress?.toolProgress) ??
      asBoolean(config?.preview?.toolProgress) ??
      defaultValue
    );
  return asBoolean(config?.preview?.toolProgress) ?? defaultValue;
}
function resolveChannelStreamingProgressCommentary(entry, defaultValue = false) {
  const config = getChannelStreamingConfigObject(entry);
  if (resolveChannelPreviewStreamMode(entry, "partial") !== "progress") return false;
  return asBoolean(asObjectRecord(config?.progress)?.commentary) ?? defaultValue;
}
function resolveChannelStreamingProgressNarration(entry, defaultValue = true) {
  return (
    asBoolean(asObjectRecord(getChannelStreamingConfigObject(entry)?.progress)?.narration) ??
    defaultValue
  );
}
function resolveChannelStreamingPreviewCommandText(entry, defaultValue = "raw") {
  const config = getChannelStreamingConfigObject(entry);
  return (
    asCommandTextMode(config?.progress?.commandText) ??
    asCommandTextMode(config?.preview?.commandText) ??
    defaultValue
  );
}
function resolveChannelStreamingSuppressDefaultToolProgressMessages(entry, options) {
  if (options?.draftStreamActive === false || options?.previewStreamingEnabled === false)
    return false;
  const mode = resolveChannelPreviewStreamMode(entry, "off");
  if (mode === "off") return false;
  if (mode === "progress") return true;
  if (options?.draftStreamActive === true) return true;
  return options?.previewToolProgressEnabled ?? resolveChannelStreamingPreviewToolProgress(entry);
}
function resolveChannelStreamingNativeTransport(entry) {
  return asBoolean(getChannelStreamingConfigObject(entry)?.nativeTransport);
}
function resolveChannelPreviewStreamMode(entry, defaultMode) {
  const streamingConfig = getChannelStreamingConfigObject(entry);
  const parsedStreaming = parsePreviewStreamingMode(streamingConfig?.mode ?? entry?.streaming);
  if (parsedStreaming) {
    if (!streamingConfig) warnFlatStreamingKeyFallback("streaming", "mode");
    return parsedStreaming;
  }
  if (typeof entry?.streaming === "boolean") {
    warnFlatStreamingKeyFallback("streaming", "mode");
    return entry.streaming ? "partial" : "off";
  }
  return defaultMode;
}
function resolveChannelProgressDraftConfig(entry) {
  return asProgressConfig(getChannelStreamingConfigObject(entry)?.progress) ?? {};
}
function normalizeProgressLabels(labels) {
  const normalized = normalizeTrimmedStringList(labels);
  if (normalized.length === 0) return [...DEFAULT_PROGRESS_DRAFT_LABELS];
  return normalized;
}
function resolveChannelProgressDraftLabel(params) {
  const progress = resolveChannelProgressDraftConfig(params.entry);
  if (progress.label === false) return;
  const normalizedLabel =
    typeof progress.label === "string" ? normalizeOptionalLowercaseString(progress.label) : null;
  if (typeof progress.label === "string" && progress.label.trim() && normalizedLabel !== "auto")
    return progress.label.trim();
  return selectProgressLabel({
    labels: normalizeProgressLabels(progress.labels),
    seed: params.seed,
    random: params.random,
  });
}
function resolveChannelProgressDraftMaxLines(entry, defaultValue = 8) {
  const configured = asInteger(resolveChannelProgressDraftConfig(entry).maxLines);
  return configured && configured > 0 ? configured : defaultValue;
}
function resolveChannelProgressDraftMaxLineChars(
  entry,
  defaultValue = DEFAULT_PROGRESS_DRAFT_MAX_LINE_CHARS,
) {
  const configured = asInteger(resolveChannelProgressDraftConfig(entry).maxLineChars);
  return configured && configured > 0 ? configured : defaultValue;
}
function resolveChannelProgressDraftRender(entry, defaultValue = "text") {
  const configured = resolveChannelProgressDraftConfig(entry).render;
  return configured === "rich" || configured === "text" ? configured : defaultValue;
}
function sliceCodePoints(value, start, end) {
  return Array.from(value).slice(start, end).join("");
}
function compactProgressLineDetail(detail, maxChars) {
  const chars = Array.from(detail);
  if (chars.length <= maxChars) return detail;
  if (maxChars <= 1) return "…";
  const keepStart = Math.max(1, Math.ceil((maxChars - 1) * 0.45));
  const keepEnd = Math.max(1, maxChars - keepStart - 1);
  const rawStart = chars.slice(0, keepStart).join("").trimEnd();
  return `${rawStart.length > 8 && /\s+\S+$/.test(rawStart) ? rawStart.replace(/\s+\S+$/, "") : rawStart}…${chars.slice(-keepEnd).join("").trimStart()}`;
}
function removeUnbalancedInlineBackticks(value) {
  if (Array.from(value).filter((char) => char === "`").length % 2 === 0) return value;
  return value.trimStart().startsWith("`") ? value.replaceAll("`", "'") : value.replaceAll("`", "");
}
function repairCompactedProgressMarkdown(value) {
  const withoutDanglingBackticks = removeUnbalancedInlineBackticks(value);
  const trimmedStart = withoutDanglingBackticks.trimStart();
  if (!trimmedStart.startsWith("_") || trimmedStart.endsWith("_")) return withoutDanglingBackticks;
  if (Array.from(trimmedStart).filter((char) => char === "_").length % 2 === 0)
    return withoutDanglingBackticks;
  return `${withoutDanglingBackticks.slice(0, withoutDanglingBackticks.length - trimmedStart.length)}${trimmedStart.slice(1)}`;
}
function compactChannelProgressDraftNarration(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (Array.from(normalized).length <= PROGRESS_DRAFT_NARRATION_MAX_CHARS) return normalized;
  return compactPlainProgressLine(normalized, PROGRESS_DRAFT_NARRATION_MAX_CHARS);
}
function compactPlainProgressLine(line, maxChars) {
  const head = sliceCodePoints(line, 0, maxChars - 1).trimEnd();
  const boundary = head.search(/\s+\S*$/u);
  if (boundary > Math.floor(maxChars * 0.6)) return `${head.slice(0, boundary).trimEnd()}…`;
  return `${head}…`;
}
function compactChannelProgressDraftLine(line, maxChars) {
  const normalized = line.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (Array.from(normalized).length <= maxChars) return normalized;
  if (maxChars <= 1) return "…";
  const compactWithPrefix = (prefix, detail) => {
    const detailLimit = maxChars - Array.from(prefix).length;
    if (detailLimit < 8) return;
    return repairCompactedProgressMarkdown(
      `${prefix}${compactProgressLineDetail(detail, detailLimit)}`,
    );
  };
  const splitIndex = normalized.indexOf(": ");
  if (splitIndex > 0) {
    const compact = compactWithPrefix(
      normalized.slice(0, splitIndex + 2),
      normalized.slice(splitIndex + 2),
    );
    if (compact) return compact;
  }
  const compactCommandPrefixMatch = normalized.match(/^🛠️\s+/u);
  if (compactCommandPrefixMatch) {
    const prefix = compactCommandPrefixMatch[0];
    const compact = compactWithPrefix(prefix, normalized.slice(prefix.length));
    if (compact) return compact;
  }
  return repairCompactedProgressMarkdown(compactPlainProgressLine(normalized, maxChars));
}
function getProgressDraftLineText(line) {
  if (typeof line === "string") return line;
  const icon = line.icon?.trim();
  const prefix = icon ? `${icon} ` : "";
  const label = line.label.trim();
  const detail = line.detail?.trim();
  const status = line.status?.trim();
  const displayStatus = status === "completed" ? void 0 : status;
  if (detail) {
    const compactCommandLine =
      line.toolName === "exec" || line.toolName === "bash" || line.toolName === "shell";
    if (line.kind === "command-output" && displayStatus && detail !== displayStatus) {
      const outputDetail = detail.startsWith(`${displayStatus};`)
        ? detail
        : `${displayStatus}; ${detail}`;
      if (compactCommandLine) return `${prefix}${outputDetail}`;
      return label ? `${prefix}${label}: ${outputDetail}` : `${prefix}${outputDetail}`;
    }
    if (line.kind !== "patch" && label && !compactCommandLine)
      return `${prefix}${label}: ${detail}`;
    return `${prefix}${detail}`;
  }
  if (displayStatus) {
    if (label) return `${prefix}${label}: ${displayStatus}`;
    return `${prefix}${displayStatus}`;
  }
  const text = line.text.trim();
  if (!icon && text && text !== label) return text;
  return `${prefix}${label}`.trim();
}
function normalizeChannelProgressDraftLineIdentity(line) {
  return (
    (typeof line === "string" ? line : line ? getProgressDraftLineText(line) : void 0)
      ?.replace(/`([^`]+)`/gu, "$1")
      .replace(/\s+/g, " ")
      .trim() ?? ""
  );
}
function mergeChannelProgressDraftLine(lines, line, params) {
  const normalized = normalizeChannelProgressDraftLineIdentity(line);
  if (!normalized) return lines;
  const maxLines = Math.max(1, params.maxLines);
  const lineKeys = resolveProgressDraftLineMergeKeys(line);
  if (lineKeys.length > 0) {
    const existingIndex = lines.findIndex((entry) =>
      resolveProgressDraftLineMergeKeys(entry).some((entryKey) => lineKeys.includes(entryKey)),
    );
    if (existingIndex >= 0) {
      const replacement = mergeProgressDraftLineUpdate(
        expectDefined(lines[existingIndex], "lines entry at existing index"),
        line,
      );
      if (replacement === lines[existingIndex]) return lines;
      const next = [...lines];
      next[existingIndex] = replacement;
      return next.slice(-maxLines);
    }
  }
  const previous = lines.at(-1);
  if (previous && normalizeChannelProgressDraftLineIdentity(previous) === normalized) return lines;
  return [...lines, line].slice(-maxLines);
}
function mergeProgressDraftLineUpdate(previous, line) {
  if (typeof previous !== "object" || typeof line !== "object") return line;
  if (
    line.kind !== "command-output" ||
    !line.status ||
    (line.detail && line.detail !== line.status)
  )
    return line;
  const previousDetail = previous.detail?.trim();
  if (
    !previousDetail ||
    previousDetail === previous.status ||
    isTerminalProgressStatus(previous.status)
  )
    return line;
  const replacement = {
    ...line,
    detail: previousDetail,
  };
  replacement.text = getProgressDraftLineText(replacement);
  setProgressDraftLineCorrelationKey(
    replacement,
    progressDraftLineCorrelationKeys.get(line) ?? progressDraftLineCorrelationKeys.get(previous),
  );
  return replacement;
}
function resolveProgressDraftLineMergeKeys(line) {
  if (typeof line !== "object") return [];
  const keys = [progressDraftLineCorrelationKeys.get(line), line.id]
    .map((key) => key?.trim())
    .filter((key) => Boolean(key));
  return [...new Set(keys)];
}
function formatChannelProgressDraftText(params) {
  const narration = params.narration ? compactChannelProgressDraftNarration(params.narration) : "";
  const progress = resolveChannelProgressDraftConfig(params.entry);
  const hasConfiguredLabel = progress.label !== void 0 || progress.labels !== void 0;
  const resolvedLabel =
    narration && !hasConfiguredLabel
      ? void 0
      : resolveChannelProgressDraftLabel({
          entry: params.entry,
          seed: params.seed,
          random: params.random,
        });
  if (narration) {
    const formatted = (params.formatLine ?? ((line) => line))(narration);
    return resolvedLabel ? `${resolvedLabel}\n\n${formatted}` : formatted;
  }
  const maxLines = resolveChannelProgressDraftMaxLines(params.entry);
  const maxLineChars = resolveChannelProgressDraftMaxLineChars(params.entry);
  const formatLine = params.formatLine ?? ((line) => line);
  const bullet = params.bullet ?? "•";
  const lines = (resolvedLabel ? [{ draftLabel: resolvedLabel }, ...params.lines] : params.lines)
    .map((line) => {
      const isLabelLine = typeof line === "object" && line !== null && "draftLabel" in line;
      const prefix =
        !isLabelLine && typeof line === "object" && line !== null ? line.prefix !== false : true;
      const text = compactChannelProgressDraftLine(
        isLabelLine
          ? line.draftLabel
          : typeof line === "string"
            ? line
            : getProgressDraftLineText(line),
        maxLineChars,
      );
      return text
        ? {
            text,
            isLabelLine,
            prefix,
          }
        : void 0;
    })
    .filter((line) => Boolean(line))
    .slice(-maxLines)
    .map(({ text, isLabelLine, prefix }) => {
      const formatted = isLabelLine ? text : formatLine(text);
      return {
        text:
          !isLabelLine && prefix && shouldPrefixProgressLine(text)
            ? `${bullet} ${formatted}`
            : formatted,
        isLabelLine,
      };
    });
  const renderedLines = lines.map((line) => line.text).filter((line) => Boolean(line));
  if (renderedLines.length > 1 && lines[0]?.isLabelLine)
    return `${renderedLines[0]}\n\n${renderedLines.slice(1).join("\n")}`;
  return renderedLines.join("\n");
}
//#endregion
export {
  resolveChannelStreamingBlockCoalesce as A,
  resolveChannelStreamingPreviewCommandText as C,
  resolveChannelStreamingSuppressDefaultToolProgressMessages as D,
  resolveChannelStreamingProgressNarration as E,
  resolveChannelStreamingChunkMode as M,
  resolveChannelStreamingPreviewChunk as N,
  resolveTranscriptBackedChannelFinalText as O,
  formatToolAggregate as P,
  resolveChannelStreamingNativeTransport as S,
  resolveChannelStreamingProgressCommentary as T,
  resolveChannelProgressDraftLabel as _,
  createChannelProgressDraftGate as a,
  resolveChannelProgressDraftMaxLines as b,
  formatChannelProgressDraftText as c,
  isCommandToolName as d,
  isPotentialTruncatedFinal as f,
  resolveChannelProgressDraftConfig as g,
  resolveChannelPreviewStreamMode as h,
  buildChannelProgressDraftLineForEntry as i,
  resolveChannelStreamingBlockEnabled as j,
  selectLongerFinalText as k,
  getChannelStreamingConfigObject as l,
  normalizeChannelProgressDraftLineIdentity as m,
  DEFAULT_PROGRESS_DRAFT_LABELS as n,
  formatChannelProgressDraftLine as o,
  mergeChannelProgressDraftLine as p,
  buildChannelProgressDraftLine as r,
  formatChannelProgressDraftLineForEntry as s,
  DEFAULT_PROGRESS_DRAFT_INITIAL_DELAY_MS as t,
  isChannelProgressDraftWorkToolName as u,
  resolveChannelProgressDraftLineOptions as v,
  resolveChannelStreamingPreviewToolProgress as w,
  resolveChannelProgressDraftRender as x,
  resolveChannelProgressDraftMaxLineChars as y,
};
