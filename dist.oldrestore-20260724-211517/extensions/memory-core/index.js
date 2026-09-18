import { y as resolveSessionAgentIds } from "../../agent-scope-y9xQv_q1.js";
import { t as resolveMemoryBackendConfig } from "../../backend-config-B4LH5mk9.js";
import { n as resolveCronStyleNow } from "../../current-time-B0TYU-XW.js";
import { t as registerShortTermPromotionDreaming } from "../../dreaming-Bq4Gskbo.js";
import { u as configureMemoryCoreDreamingState } from "../../dreaming-state-DLMGVRgZ.js";
import "../../agent-settings-CAPRfR7V.js";
import { r as createLazyRuntimeModule } from "../../lazy-runtime-B-Fc-m0I.js";
import { t as resolveMemorySearchConfig } from "../../memory-search-C1x_ATR9.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { t as resolveMemoryCoreNowMs } from "../../time-ngD8glCa.js";
import "../../memory-core-host-runtime-core-gYnLukPo.js";
import "../../memory-core-host-runtime-files-DtgL-bJu.js";
import { n as SILENT_REPLY_TOKEN } from "../../tokens-DKI4eGAu.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { r as parseNonNegativeByteSize } from "../../zod-schema-BY8YFj8I.js";
//#region extensions/memory-core/src/flush-plan.ts
const DEFAULT_MEMORY_FLUSH_SOFT_TOKENS = 4e3;
const DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES = 2 * 1024 * 1024;
const MEMORY_FLUSH_TARGET_HINT =
  "Store durable memories only in memory/YYYY-MM-DD.md (create memory/ if needed).";
const MEMORY_FLUSH_APPEND_ONLY_HINT =
  "If memory/YYYY-MM-DD.md already exists, APPEND new content only and do not overwrite existing entries.";
const MEMORY_FLUSH_READ_ONLY_HINT =
  "Treat workspace bootstrap/reference files such as MEMORY.md, DREAMS.md, SOUL.md, TOOLS.md, and AGENTS.md as read-only during this flush; never overwrite, replace, or edit them.";
const MEMORY_FLUSH_REQUIRED_HINTS = [
  MEMORY_FLUSH_TARGET_HINT,
  MEMORY_FLUSH_APPEND_ONLY_HINT,
  MEMORY_FLUSH_READ_ONLY_HINT,
];
const DEFAULT_MEMORY_FLUSH_PROMPT = [
  "Pre-compaction memory flush.",
  MEMORY_FLUSH_TARGET_HINT,
  MEMORY_FLUSH_READ_ONLY_HINT,
  MEMORY_FLUSH_APPEND_ONLY_HINT,
  "Do NOT create timestamped variant files (e.g., YYYY-MM-DD-HHMM.md); always use the canonical YYYY-MM-DD.md filename.",
  `If nothing to store, reply with ${SILENT_REPLY_TOKEN}.`,
].join(" ");
const DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT = [
  "Pre-compaction memory flush turn.",
  "The session is near auto-compaction; capture durable memories to disk.",
  MEMORY_FLUSH_TARGET_HINT,
  MEMORY_FLUSH_READ_ONLY_HINT,
  MEMORY_FLUSH_APPEND_ONLY_HINT,
  `You may reply, but usually ${SILENT_REPLY_TOKEN} is correct.`,
].join(" ");
function formatDateStampInTimezone(nowMs, timezone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(nowMs));
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (year && month && day) return `${year}-${month}-${day}`;
  return new Date(resolveMemoryCoreNowMs(nowMs)).toISOString().slice(0, 10);
}
function normalizeNonNegativeInt(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const int = Math.floor(value);
  return int >= 0 ? int : null;
}
function ensureNoReplyHint(text) {
  if (text.includes("NO_REPLY")) return text;
  return `${text}\n\nIf no user-visible reply is needed, start with ${SILENT_REPLY_TOKEN}.`;
}
function ensureMemoryFlushSafetyHints(text) {
  let next = text.trim();
  for (const hint of MEMORY_FLUSH_REQUIRED_HINTS)
    if (!next.includes(hint)) next = next ? `${next}\n\n${hint}` : hint;
  return next;
}
function appendCurrentTimeLine(text, timeLine) {
  const trimmed = text.trimEnd();
  if (!trimmed) return timeLine;
  if (trimmed.includes("Current time:")) return trimmed;
  return `${trimmed}\n${timeLine}`;
}
function buildMemoryFlushPlan(params = {}) {
  const resolved = params;
  const nowMs = resolveMemoryCoreNowMs(resolved.nowMs);
  const cfg = resolved.cfg;
  const defaults = cfg?.agents?.defaults?.compaction?.memoryFlush;
  if (defaults?.enabled === false) return null;
  const softThresholdTokens =
    normalizeNonNegativeInt(defaults?.softThresholdTokens) ?? DEFAULT_MEMORY_FLUSH_SOFT_TOKENS;
  const forceFlushTranscriptBytes =
    parseNonNegativeByteSize(defaults?.forceFlushTranscriptBytes) ??
    DEFAULT_MEMORY_FLUSH_FORCE_TRANSCRIPT_BYTES;
  const reserveTokensFloor =
    normalizeNonNegativeInt(cfg?.agents?.defaults?.compaction?.reserveTokensFloor) ?? 2e4;
  const { timeLine, userTimezone } = resolveCronStyleNow(cfg ?? {}, nowMs);
  const dateStamp = formatDateStampInTimezone(nowMs, userTimezone);
  const relativePath = `memory/${dateStamp}.md`;
  const promptBase = ensureNoReplyHint(
    ensureMemoryFlushSafetyHints(defaults?.prompt?.trim() || DEFAULT_MEMORY_FLUSH_PROMPT),
  );
  const systemPrompt = ensureNoReplyHint(
    ensureMemoryFlushSafetyHints(
      defaults?.systemPrompt?.trim() || DEFAULT_MEMORY_FLUSH_SYSTEM_PROMPT,
    ),
  );
  return {
    softThresholdTokens,
    forceFlushTranscriptBytes,
    reserveTokensFloor,
    model: defaults?.model?.trim() || void 0,
    prompt: appendCurrentTimeLine(promptBase.replaceAll("YYYY-MM-DD", dateStamp), timeLine),
    systemPrompt: systemPrompt.replaceAll("YYYY-MM-DD", dateStamp),
    relativePath,
  };
}
//#endregion
//#region extensions/memory-core/src/prompt-section.ts
const buildPromptSection = ({ availableTools, citationsMode }) => {
  const hasMemorySearch = availableTools.has("memory_search");
  const hasMemoryGet = availableTools.has("memory_get");
  if (!hasMemorySearch && !hasMemoryGet) return [];
  let toolGuidance;
  if (hasMemorySearch && hasMemoryGet)
    toolGuidance =
      "Before answering anything about prior work, decisions, dates, people, preferences, or todos: run memory_search on MEMORY.md + memory/*.md + indexed session transcripts; then use memory_get to pull only the needed lines. If low confidence after search, say you checked.";
  else if (hasMemorySearch)
    toolGuidance =
      "Before answering anything about prior work, decisions, dates, people, preferences, or todos: run memory_search on MEMORY.md + memory/*.md + indexed session transcripts and answer from the matching results. If low confidence after search, say you checked.";
  else
    toolGuidance =
      "Before answering anything about prior work, decisions, dates, people, preferences, or todos that already point to a specific memory file or note: run memory_get to pull only the needed lines. If low confidence after reading them, say you checked.";
  const lines = ["## Memory Recall", toolGuidance];
  if (citationsMode === "off")
    lines.push(
      "Citations are disabled: do not mention file paths or line numbers in replies unless the user explicitly asks.",
    );
  else
    lines.push(
      "Citations: include Source: <path#line> when it helps the user verify memory snippets.",
    );
  lines.push("");
  return lines;
};
//#endregion
//#region extensions/memory-core/index.ts
const loadMemoryToolsModule = createLazyRuntimeModule(() => import("../../tools-Bdx4FACn.js"));
const loadRuntimeProviderModule = createLazyRuntimeModule(
  () => import("../../runtime-provider-CAG-RfT0.js"),
);
function getToolConfig(options) {
  return options.getConfig?.() ?? options.config;
}
function hasMemoryToolContext(options) {
  const cfg = getToolConfig(options);
  if (!cfg) return false;
  const { sessionAgentId: agentId } = resolveSessionAgentIds({
    sessionKey: options.agentSessionKey,
    config: cfg,
    agentId: options.agentId,
  });
  return Boolean(resolveMemorySearchConfig(cfg, agentId));
}
const MemorySearchSchema = {
  type: "object",
  properties: {
    query: { type: "string" },
    maxResults: {
      type: "integer",
      minimum: 1,
    },
    minScore: { type: "number" },
    corpus: {
      type: "string",
      enum: ["memory", "wiki", "all", "sessions"],
    },
  },
  required: ["query"],
  additionalProperties: false,
};
const MemoryGetSchema = {
  type: "object",
  properties: {
    path: { type: "string" },
    from: {
      type: "integer",
      minimum: 1,
    },
    lines: {
      type: "integer",
      minimum: 1,
    },
    corpus: {
      type: "string",
      enum: ["memory", "wiki", "all"],
    },
  },
  required: ["path"],
  additionalProperties: false,
};
function createLazyMemoryTool(params) {
  if (!hasMemoryToolContext(params.options)) return null;
  let toolPromise;
  const loadTool = async () => {
    toolPromise ??= loadMemoryToolsModule().then((module) => params.load(module, params.options));
    return await toolPromise;
  };
  return {
    label: params.label,
    name: params.name,
    description: params.description,
    parameters: params.parameters,
    execute: async (toolCallId, toolParams, signal, onUpdate) => {
      const tool = await loadTool();
      if (!tool)
        return jsonResult({
          disabled: true,
          unavailable: true,
          error: "memory search unavailable",
        });
      return await tool.execute(toolCallId, toolParams, signal, onUpdate);
    },
  };
}
function createLazyMemorySearchTool(options) {
  return createLazyMemoryTool({
    options,
    label: "Memory Search",
    name: "memory_search",
    description:
      "Mandatory recall step: semantically search MEMORY.md + memory/*.md (and optional session transcripts) before answering questions about prior work, decisions, dates, people, preferences, or todos. Optional `corpus=wiki` or `corpus=all` also searches registered compiled-wiki supplements. `corpus=memory` restricts hits to indexed memory files (excludes session transcript chunks from ranking). `corpus=sessions` restricts hits to indexed session transcripts (same visibility rules as session history tools). If response has disabled=true, memory retrieval is unavailable and should be surfaced to the user.",
    parameters: MemorySearchSchema,
    load: (module, loadOptions) => module.createMemorySearchTool(loadOptions),
  });
}
function createLazyMemoryGetTool(options) {
  return createLazyMemoryTool({
    options,
    label: "Memory Get",
    name: "memory_get",
    description:
      "Safe exact excerpt read from MEMORY.md or memory/*.md. Defaults to a bounded excerpt when lines are omitted, includes truncation/continuation info when more content exists, and `corpus=wiki` reads from registered compiled-wiki supplements.",
    parameters: MemoryGetSchema,
    load: (module, loadOptions) => module.createMemoryGetTool(loadOptions),
  });
}
function resolveMemoryToolOptions(ctx, acquireLocalService) {
  const getConfig = () => ctx.getRuntimeConfig?.() ?? ctx.runtimeConfig ?? ctx.config;
  return {
    config: getConfig(),
    getConfig,
    agentId: ctx.agentId,
    agentSessionKey: ctx.sessionKey,
    sandboxed: ctx.sandboxed,
    oneShotCliRun: ctx.oneShotCliRun,
    ...(acquireLocalService ? { acquireLocalService } : {}),
  };
}
function createLazyMemoryRuntime(acquireLocalService) {
  return {
    async getMemorySearchManager(params) {
      const { createMemoryRuntime } = await loadRuntimeProviderModule();
      return await createMemoryRuntime(acquireLocalService).getMemorySearchManager(params);
    },
    resolveMemoryBackendConfig(params) {
      return resolveMemoryBackendConfig(params);
    },
    async closeAllMemorySearchManagers() {
      const { memoryRuntime: runtime } = await loadRuntimeProviderModule();
      await runtime.closeAllMemorySearchManagers?.();
    },
    async closeMemorySearchManager(params) {
      const { memoryRuntime: runtime } = await loadRuntimeProviderModule();
      await runtime.closeMemorySearchManager?.(params);
    },
  };
}
var memory_core_default = definePluginEntry({
  id: "memory-core",
  name: "Memory (Core)",
  description: "File-backed memory search tools and CLI",
  kind: "memory",
  register(api) {
    const acquireLocalService = api.runtime.llm?.acquireLocalService;
    configureMemoryCoreDreamingState((options) => api.runtime.state.openKeyedStore(options));
    registerShortTermPromotionDreaming(api);
    api.registerMemoryCapability({
      promptBuilder: buildPromptSection,
      flushPlanResolver: buildMemoryFlushPlan,
      runtime: createLazyMemoryRuntime(acquireLocalService),
      publicArtifacts: {
        async listArtifacts(params) {
          const { listMemoryCorePublicArtifacts } =
            await import("../../public-artifacts-KKwWdDAJ.js");
          return await listMemoryCorePublicArtifacts(params);
        },
      },
    });
    api.registerTool(
      (ctx) => createLazyMemorySearchTool(resolveMemoryToolOptions(ctx, acquireLocalService)),
      { names: ["memory_search"] },
    );
    api.registerTool(
      (ctx) => createLazyMemoryGetTool(resolveMemoryToolOptions(ctx, acquireLocalService)),
      { names: ["memory_get"] },
    );
    api.registerCommand({
      name: "dreaming",
      description: "Enable or disable memory dreaming.",
      acceptsArgs: true,
      exposeSenderIsOwner: true,
      handler: async (ctx) => {
        const { handleDreamingCommand } = await import("../../dreaming-command-eyAgS-XA.js");
        return await handleDreamingCommand(api, ctx);
      },
    });
    api.registerCli(
      async ({ program }) => {
        const { registerMemoryCli } = await import("./cli.js");
        registerMemoryCli(program, { acquireLocalService });
      },
      {
        descriptors: [
          {
            name: "memory",
            description: "Search, inspect, and reindex memory files",
            hasSubcommands: true,
          },
        ],
      },
    );
  },
});
//#endregion
export { memory_core_default as default };
