import { createHash } from "node:crypto";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import { r as buildBootstrapInjectionStats } from "./bootstrap-budget-DFC5I5_X.js";
import { n as resolveBootstrapMode } from "./bootstrap-mode-DiBGJeJJ.js";
import "./registry-xXjI-8UE.js";
import "./workspace-DXzCbuC0.js";
import { v as resolveChannelPromptCapabilities } from "./gateway-Dyh1k_4Q.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
import { a as isSubagentSessionKey, n as isAcpSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import {
  l as normalizeStringEntries,
  u as normalizeStringEntriesLower,
} from "./string-normalization-CRyoFBPt.js";
import {
  f as supportsAutomaticThreadBindingSpawn,
  u as resolveThreadBindingSpawnPolicy,
} from "./thread-bindings-policy-d6bhdGnZ.js";
//#region src/agents/bootstrap-routing.ts
/**
 * Resolves workspace bootstrap routing for one agent run. Shared by the
 * embedded attempt runner and CLI-backend runs so both runtimes gate the
 * first reply on a pending BOOTSTRAP.md the same way.
 */
/**
 * Returns whether a session should receive primary bootstrap context. Subagents
 * and ACP worker sessions inherit/run their own context path instead of getting
 * the top-level bootstrap payload again.
 */
function isPrimaryBootstrapRun(sessionKey) {
  return !isSubagentSessionKey(sessionKey) && !isAcpSessionKey(sessionKey);
}
function resolveBootstrapRouting(params) {
  const bootstrapMode = resolveBootstrapMode({
    bootstrapPending: params.workspaceBootstrapPending,
    runKind: params.bootstrapContextRunKind ?? "default",
    isInteractiveUserFacing: params.trigger === "user" || params.trigger === "manual",
    isPrimaryRun: params.isPrimaryRun,
    isCanonicalWorkspace:
      (params.isCanonicalWorkspace ?? true) &&
      params.effectiveWorkspace === params.resolvedWorkspace,
    hasBootstrapFileAccess: params.hasBootstrapFileAccess,
  });
  return {
    bootstrapMode,
    includeBootstrapInSystemContext: bootstrapMode === "full",
    includeBootstrapInRuntimeContext: false,
  };
}
/**
 * Resolves workspace bootstrap routing after checking pending state and
 * loaded bootstrap files. Content can prove bootstrap is pending; callers
 * decide whether that content also proves the run can complete file changes.
 */
async function resolveWorkspaceBootstrapRouting(params) {
  const workspaceBootstrapPending = await params.isWorkspaceBootstrapPending(
    params.resolvedWorkspace,
  );
  const hasBootstrapContent =
    params.bootstrapFiles?.some(
      (file) =>
        file.name === "BOOTSTRAP.md" &&
        !file.missing &&
        typeof file.content === "string" &&
        file.content.trim().length > 0,
    ) ?? false;
  return resolveBootstrapRouting({
    ...params,
    workspaceBootstrapPending: workspaceBootstrapPending || hasBootstrapContent,
    hasBootstrapFileAccess:
      params.hasBootstrapFileAccess ||
      (params.bootstrapFilesProvideAccess !== false && hasBootstrapContent),
  });
}
//#endregion
//#region src/config/channel-capabilities.ts
const isStringArray = (value) =>
  Array.isArray(value) && value.every((entry) => typeof entry === "string");
function normalizeCapabilities(capabilities) {
  if (!isStringArray(capabilities)) return;
  const normalized = normalizeStringEntries(capabilities);
  return normalized.length > 0 ? normalized : void 0;
}
function resolveAccountCapabilities(params) {
  const cfg = params.cfg;
  if (!cfg) return;
  const normalizedAccountId = normalizeAccountId(params.accountId);
  const accounts = cfg.accounts;
  if (accounts && typeof accounts === "object") {
    const match = resolveAccountEntry(accounts, normalizedAccountId);
    if (match)
      return normalizeCapabilities(match.capabilities) ?? normalizeCapabilities(cfg.capabilities);
  }
  return normalizeCapabilities(cfg.capabilities);
}
/** Resolves normalized string capabilities for a channel/account config pair. */
function resolveChannelCapabilities(params) {
  const cfg = params.cfg;
  const channel = normalizeAnyChannelId(params.channel);
  if (!cfg || !channel) return;
  return resolveAccountCapabilities({
    cfg: cfg.channels?.[channel] ?? cfg[channel],
    accountId: params.accountId,
  });
}
//#endregion
//#region src/agents/runtime-capabilities.ts
/**
 * Runtime channel capability collector.
 *
 * Agent startup uses this to merge configured channel capabilities with prompt
 * tools and thread-bound spawn features that depend on channel policy.
 */
const THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY = "threadbound-subagent-spawn";
const THREAD_BOUND_ACP_SPAWN_CAPABILITY = "threadbound-acp-spawn";
function mergeRuntimeCapabilities(base, additions = []) {
  const merged = [...(base ?? [])];
  const seen = new Set(normalizeStringEntriesLower(merged));
  for (const capability of additions) {
    const normalizedCapability = normalizeOptionalLowercaseString(capability);
    if (!normalizedCapability || seen.has(normalizedCapability)) continue;
    seen.add(normalizedCapability);
    merged.push(capability);
  }
  return merged.length > 0 ? merged : void 0;
}
/** Collects the effective runtime capabilities for a channel/account pair. */
function collectRuntimeChannelCapabilities(params) {
  if (!params.channel) return;
  const threadSpawnCapabilities = [];
  if (params.cfg && supportsAutomaticThreadBindingSpawn(params.channel))
    for (const [kind, capability] of [
      ["subagent", THREAD_BOUND_SUBAGENT_SPAWN_CAPABILITY],
      ["acp", THREAD_BOUND_ACP_SPAWN_CAPABILITY],
    ]) {
      const policy = resolveThreadBindingSpawnPolicy({
        cfg: params.cfg,
        channel: params.channel,
        accountId: params.accountId ?? void 0,
        kind,
      });
      if (policy.enabled && policy.spawnEnabled) threadSpawnCapabilities.push(capability);
    }
  return mergeRuntimeCapabilities(
    resolveChannelCapabilities(params),
    params.cfg
      ? [...resolveChannelPromptCapabilities(params), ...threadSpawnCapabilities]
      : threadSpawnCapabilities,
  );
}
//#endregion
//#region src/agents/system-prompt-report.ts
/**
 * System prompt report builder.
 *
 * Session metadata uses this report to account for prompt size, bootstrap file
 * injection, skills, and tool schema footprint without storing raw prompt text.
 */
const toolReportEntryCache = /* @__PURE__ */ new WeakMap();
const toolSchemaStatsCache = /* @__PURE__ */ new WeakMap();
function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}
function extractBetween(input, startMarker, endMarker) {
  const start = input.indexOf(startMarker);
  if (start === -1) return "";
  const end = input.indexOf(endMarker, start + startMarker.length);
  return end === -1 ? input.slice(start) : input.slice(start, end);
}
function parseSkillBlocks(skillsPrompt) {
  const prompt = skillsPrompt.trim();
  if (!prompt) return [];
  return Array.from(prompt.matchAll(/<skill>[\s\S]*?<\/skill>/gi))
    .map((match) => match[0] ?? "")
    .map((block) => {
      return {
        name: block.match(/<name>\s*([^<]+?)\s*<\/name>/i)?.[1]?.trim() || "(unknown)",
        blockChars: block.length,
      };
    })
    .filter((b) => b.blockChars > 0);
}
function buildToolSchemaStats(parameters) {
  if (!parameters || typeof parameters !== "object")
    return {
      schemaChars: 0,
      schemaHash: sha256(""),
      propertiesCount: null,
    };
  const cached = toolSchemaStatsCache.get(parameters);
  if (cached) return cached;
  let schemaJson;
  try {
    schemaJson = JSON.stringify(parameters);
  } catch {
    schemaJson = "";
  }
  const stats = {
    schemaChars: schemaJson.length,
    schemaHash: sha256(schemaJson),
    propertiesCount: (() => {
      const schema = parameters;
      const props = typeof schema.properties === "object" ? schema.properties : null;
      if (!props || typeof props !== "object") return null;
      return Object.keys(props).length;
    })(),
  };
  toolSchemaStatsCache.set(parameters, stats);
  return stats;
}
function buildToolsEntries(tools) {
  return tools.map((tool) => {
    const cached = toolReportEntryCache.get(tool);
    if (cached) return cached;
    const name = tool.name;
    const summary = tool.description?.trim() || tool.label?.trim() || "";
    const summaryChars = summary.length;
    const schemaStats = buildToolSchemaStats(tool.parameters);
    const entry = {
      name,
      summaryChars,
      summaryHash: sha256(summary),
      ...schemaStats,
    };
    toolReportEntryCache.set(tool, entry);
    return entry;
  });
}
function measureRenderedProjectContextChars(systemPrompt) {
  return extractBetween(systemPrompt, "\n# Project Context\n", "\n## Silent Replies\n").length;
}
/** Builds the stored report for a rendered system prompt and its inputs. */
function buildSystemPromptReport(params) {
  const systemPromptChars = params.systemPrompt.length;
  const projectContextChars = measureRenderedProjectContextChars(params.systemPrompt);
  const toolsEntries = buildToolsEntries(params.tools);
  const toolsSchemaChars = toolsEntries.reduce((sum, t) => sum + (t.schemaChars ?? 0), 0);
  const skillsEntries = parseSkillBlocks(params.skillsPrompt);
  return {
    source: params.source,
    generatedAt: params.generatedAt,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    provider: params.provider,
    model: params.model,
    workspaceDir: params.workspaceDir,
    bootstrapMaxChars: params.bootstrapMaxChars,
    bootstrapTotalMaxChars: params.bootstrapTotalMaxChars,
    ...(params.bootstrapTruncation ? { bootstrapTruncation: params.bootstrapTruncation } : {}),
    sandbox: params.sandbox,
    systemPrompt: {
      chars: systemPromptChars,
      hash: sha256(params.systemPrompt),
      projectContextChars,
      nonProjectContextChars: Math.max(0, systemPromptChars - projectContextChars),
    },
    ...(params.currentTurn ? { currentTurn: params.currentTurn } : {}),
    injectedWorkspaceFiles: buildBootstrapInjectionStats({
      bootstrapFiles: params.bootstrapFiles,
      injectedFiles: params.injectedFiles,
    }),
    skills: {
      promptChars: params.skillsPrompt.length,
      hash: sha256(params.skillsPrompt),
      entries: skillsEntries,
    },
    tools: {
      listChars: 0,
      schemaChars: toolsSchemaChars,
      entries: toolsEntries,
    },
  };
}
//#endregion
export {
  resolveWorkspaceBootstrapRouting as i,
  collectRuntimeChannelCapabilities as n,
  isPrimaryBootstrapRun as r,
  buildSystemPromptReport as t,
};
