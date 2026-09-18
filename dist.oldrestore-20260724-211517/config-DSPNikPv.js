import path from "node:path";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { i as asOptionalRecord } from "./record-coerce-DHZ4bFlT.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./number-runtime-B-n-wjMn.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import {
  D as DEFAULT_TIMEOUT_MS,
  I as MAX_SETUP_GRACE_TIMEOUT_MS,
  L as MAX_TIMEOUT_MS,
  M as LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW,
  O as DEFAULT_TRANSCRIPT_DIR,
  b as DEFAULT_QMD_SEARCH_MODE,
  d as DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW,
  m as DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS,
  p as DEFAULT_CACHE_TTL_MS,
  s as ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW,
  x as DEFAULT_QUERY_MODE,
} from "./types-gz2L16qk.js";
//#region extensions/active-memory/config.ts
let minimumTimeoutMs = 250;
let setupGraceTimeoutMs = 0;
function parseOptionalPositiveInt(value, fallback) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? parseStrictPositiveInteger(value)
        : NaN;
  return parsed !== void 0 && Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
function clampInt(value, fallback, min, max) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(value)));
}
function normalizeTranscriptDir(value) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return DEFAULT_TRANSCRIPT_DIR;
  const safeParts = raw
    .replace(/\\/g, "/")
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part !== "." && part !== "..");
  return safeParts.length > 0 ? path.join(...safeParts) : DEFAULT_TRANSCRIPT_DIR;
}
function normalizeChatIdList(value) {
  if (!Array.isArray(value)) return [];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim().toLowerCase();
    if (!trimmed) continue;
    if (seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}
function normalizeConfiguredToolsAllow(value) {
  if (!Array.isArray(value)) return;
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const normalized = normalizeLowercaseStringOrEmpty(entry);
    if (!normalized || isReservedActiveMemoryToolsAllowEntry(normalized) || seen.has(normalized))
      continue;
    seen.add(normalized);
    out.push(normalized);
    if (out.length >= 32) break;
  }
  return out.length > 0 ? out : void 0;
}
function isReservedActiveMemoryToolsAllowEntry(value) {
  const normalized = value.trim().toLowerCase();
  return normalized.startsWith("group:") || ACTIVE_MEMORY_RESERVED_TOOLS_ALLOW.has(normalized);
}
function resolveDefaultToolsAllow(cfg) {
  return cfg?.plugins?.slots?.memory === "memory-lancedb"
    ? [...LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW]
    : [...DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW];
}
function resolveToolsAllow(params) {
  return (
    normalizeConfiguredToolsAllow(params.pluginToolsAllow) ?? resolveDefaultToolsAllow(params.cfg)
  );
}
function normalizePromptConfigText(value) {
  const text = typeof value === "string" ? value.trim() : "";
  return text ? text : void 0;
}
function resolveQmdSearchMode(value) {
  if (value === "inherit" || value === "search" || value === "vsearch" || value === "query")
    return value;
  return DEFAULT_QMD_SEARCH_MODE;
}
function hasDeprecatedModelFallbackPolicy(pluginConfig) {
  const raw = asOptionalRecord(pluginConfig);
  return raw ? Object.hasOwn(raw, "modelFallbackPolicy") : false;
}
function resolveSafeTranscriptDir(baseSessionsDir, transcriptDir) {
  const normalized = transcriptDir.trim();
  if (!normalized || normalized.includes(":") || path.isAbsolute(normalized))
    return path.resolve(baseSessionsDir, DEFAULT_TRANSCRIPT_DIR);
  const resolvedBase = path.resolve(baseSessionsDir);
  const candidate = path.resolve(resolvedBase, normalized);
  if (!isPathInside(resolvedBase, candidate))
    return path.resolve(resolvedBase, DEFAULT_TRANSCRIPT_DIR);
  return candidate;
}
function toSafeTranscriptAgentDirName(agentId) {
  const encoded = encodeURIComponent(agentId.trim());
  return encoded ? encoded : "unknown-agent";
}
function resolvePersistentTranscriptBaseDir(api, agentId) {
  return path.join(
    api.runtime.state.resolveStateDir(),
    "plugins",
    "active-memory",
    "transcripts",
    "agents",
    toSafeTranscriptAgentDirName(agentId),
  );
}
function requireTransientWorkspaceDir(tempDir) {
  if (!tempDir) throw new Error("Active memory transient workspace was not initialized.");
  return tempDir;
}
function formatRuntimeToolsAllowSource(toolsAllow) {
  return `runtime toolsAllow: ${toolsAllow.join(", ")}`;
}
function isMissingRegisteredMemoryToolsError(
  error,
  toolsAllow = DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW,
) {
  if (!(error instanceof Error)) return false;
  const message = error.message.trim();
  if (
    !message.startsWith("No callable tools remain after resolving explicit tool allowlist (") ||
    !message.endsWith(
      "); no registered tools matched. Fix the allowlist or enable the plugin that registers the requested tool.",
    )
  )
    return false;
  const sources = message.slice(66, -105);
  const runtimeSource = formatRuntimeToolsAllowSource(toolsAllow);
  return sources
    .split(";")
    .map((source) => source.trim())
    .filter(Boolean)
    .includes(runtimeSource);
}
function normalizePluginConfig(pluginConfig, cfg) {
  const raw = pluginConfig && typeof pluginConfig === "object" ? pluginConfig : {};
  const qmd = asOptionalRecord(raw.qmd);
  const allowedChatTypes = Array.isArray(raw.allowedChatTypes)
    ? raw.allowedChatTypes.filter(
        (value) =>
          value === "direct" || value === "group" || value === "channel" || value === "explicit",
      )
    : [];
  return {
    enabled: raw.enabled !== false,
    agents: Array.isArray(raw.agents) ? normalizeStringEntries(raw.agents) : [],
    model: typeof raw.model === "string" && raw.model.trim() ? raw.model.trim() : void 0,
    modelFallback:
      typeof raw.modelFallback === "string" && raw.modelFallback.trim()
        ? raw.modelFallback.trim()
        : void 0,
    modelFallbackPolicy:
      raw.modelFallbackPolicy === "resolved-only" ? "resolved-only" : "default-remote",
    allowedChatTypes: allowedChatTypes.length > 0 ? allowedChatTypes : ["direct"],
    allowedChatIds: normalizeChatIdList(raw.allowedChatIds),
    deniedChatIds: normalizeChatIdList(raw.deniedChatIds),
    thinking: resolveThinkingLevel(raw.thinking),
    promptStyle: resolvePromptStyle(raw.promptStyle, raw.queryMode),
    toolsAllow: resolveToolsAllow({
      pluginToolsAllow: raw.toolsAllow,
      cfg,
    }),
    promptOverride: normalizePromptConfigText(raw.promptOverride),
    promptAppend: normalizePromptConfigText(raw.promptAppend),
    timeoutMs: clampInt(
      parseOptionalPositiveInt(raw.timeoutMs, DEFAULT_TIMEOUT_MS),
      DEFAULT_TIMEOUT_MS,
      minimumTimeoutMs,
      MAX_TIMEOUT_MS,
    ),
    setupGraceTimeoutMs: clampInt(
      raw.setupGraceTimeoutMs,
      setupGraceTimeoutMs,
      0,
      MAX_SETUP_GRACE_TIMEOUT_MS,
    ),
    queryMode:
      raw.queryMode === "message" || raw.queryMode === "recent" || raw.queryMode === "full"
        ? raw.queryMode
        : DEFAULT_QUERY_MODE,
    maxSummaryChars: clampInt(raw.maxSummaryChars, 220, 40, 1e3),
    recentUserTurns: clampInt(raw.recentUserTurns, 2, 0, 4),
    recentAssistantTurns: clampInt(raw.recentAssistantTurns, 1, 0, 3),
    recentUserChars: clampInt(raw.recentUserChars, 220, 40, 1e3),
    recentAssistantChars: clampInt(raw.recentAssistantChars, 180, 40, 1e3),
    logging: raw.logging === true,
    cacheTtlMs: clampInt(raw.cacheTtlMs, DEFAULT_CACHE_TTL_MS, 1e3, 12e4),
    circuitBreakerMaxTimeouts: clampInt(raw.circuitBreakerMaxTimeouts, 3, 1, 20),
    circuitBreakerCooldownMs: clampInt(
      raw.circuitBreakerCooldownMs,
      DEFAULT_CIRCUIT_BREAKER_COOLDOWN_MS,
      5e3,
      6e5,
    ),
    persistTranscripts: raw.persistTranscripts === true,
    transcriptDir: normalizeTranscriptDir(raw.transcriptDir),
    qmd: { searchMode: resolveQmdSearchMode(qmd?.searchMode) },
  };
}
function applyActiveMemoryRuntimeConfigSnapshot(cfg, pluginConfig) {
  const existingEntry = asOptionalRecord(cfg.plugins?.entries?.["active-memory"]);
  const existingPluginConfig = asOptionalRecord(existingEntry?.config);
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      entries: {
        ...cfg.plugins?.entries,
        "active-memory": {
          ...existingEntry,
          config: {
            ...existingPluginConfig,
            qmd: {
              ...asOptionalRecord(existingPluginConfig?.qmd),
              searchMode: pluginConfig.qmd.searchMode,
            },
          },
        },
      },
    },
  };
}
function resolveActiveMemoryCleanupConfig(api) {
  try {
    return api.runtime.config?.current?.() ?? api.config;
  } catch {
    return api.config;
  }
}
function resolveThinkingLevel(thinking) {
  if (
    thinking === "off" ||
    thinking === "minimal" ||
    thinking === "low" ||
    thinking === "medium" ||
    thinking === "high" ||
    thinking === "xhigh" ||
    thinking === "adaptive" ||
    thinking === "max"
  )
    return thinking;
  return "off";
}
function resolvePromptStyle(promptStyle, queryMode) {
  if (
    promptStyle === "balanced" ||
    promptStyle === "strict" ||
    promptStyle === "contextual" ||
    promptStyle === "recall-heavy" ||
    promptStyle === "precision-heavy" ||
    promptStyle === "preference-only"
  )
    return promptStyle;
  if (queryMode === "message") return "strict";
  if (queryMode === "full") return "contextual";
  return "balanced";
}
function resetActiveMemoryConfigForTests() {
  minimumTimeoutMs = 250;
  setupGraceTimeoutMs = 0;
}
function setMinimumTimeoutMsForTests(value) {
  minimumTimeoutMs = value;
}
function setSetupGraceTimeoutMsForTests(value) {
  setupGraceTimeoutMs = Math.max(0, Math.floor(value));
}
//#endregion
export {
  normalizePluginConfig as a,
  resolveActiveMemoryCleanupConfig as c,
  setMinimumTimeoutMsForTests as d,
  setSetupGraceTimeoutMsForTests as f,
  isMissingRegisteredMemoryToolsError as i,
  resolvePersistentTranscriptBaseDir as l,
  clampInt as n,
  requireTransientWorkspaceDir as o,
  hasDeprecatedModelFallbackPolicy as r,
  resetActiveMemoryConfigForTests as s,
  applyActiveMemoryRuntimeConfigSnapshot as t,
  resolveSafeTranscriptDir as u,
};
