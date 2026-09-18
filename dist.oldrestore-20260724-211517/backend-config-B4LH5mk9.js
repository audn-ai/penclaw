import fs from "node:fs";
import path from "node:path";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  a as resolveMemoryHostUserPath,
  r as resolveMemoryHostAgentWorkspaceDir,
  t as MEMORY_HOST_ROOT_FILENAME,
} from "./config-utils-CrO_J2Yw.js";
import { t as parseDurationMs } from "./parse-duration-Be19e01j.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import "./fs-utils-urkAyyL8.js";
import { N as splitShellArgs } from "./shell-wrapper-resolution-DlXABXcG.js";
import "./openclaw-runtime-config-7oDmkPWd.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
//#region packages/memory-host-sdk/src/host/backend-config.ts
function escapeQmdExactFilePattern(fileName) {
  return fileName.replace(/[\\*?[\]{}()!+@]/g, "\\$&");
}
const WINDOWS_COMMAND_EXTENSION_RE =
  /^((?:[A-Za-z]:[\\/]|\\\\[^\\/]+[\\/][^\\/]+[\\/]).*?\.(?:bat|cmd|cjs|exe|js|mjs|ps1))(?:\s+|$)/i;
function resolveQmdCommand(rawCommand) {
  const trimmedCommand = rawCommand.trim();
  const windowsCommand = resolveWindowsAbsoluteCommand(trimmedCommand);
  if (windowsCommand) return windowsCommand;
  return splitShellArgs(trimmedCommand)?.[0] || trimmedCommand.split(/\s+/)[0] || "qmd";
}
function resolveWindowsAbsoluteCommand(rawCommand) {
  if (!path.win32.isAbsolute(rawCommand)) return;
  const extensionMatch = WINDOWS_COMMAND_EXTENSION_RE.exec(rawCommand);
  if (extensionMatch) return extensionMatch[1];
  const firstWhitespace = rawCommand.search(/\s/);
  return firstWhitespace === -1 ? rawCommand : rawCommand.slice(0, firstWhitespace);
}
const DEFAULT_BACKEND = "builtin";
const DEFAULT_CITATIONS = "auto";
const DEFAULT_QMD_INTERVAL = "5m";
const DEFAULT_QMD_DEBOUNCE_MS = 15e3;
const DEFAULT_QMD_TIMEOUT_MS = 4e3;
const DEFAULT_QMD_SEARCH_MODE = "search";
const DEFAULT_QMD_STARTUP = "off";
const DEFAULT_QMD_STARTUP_DELAY_MS = 12e4;
const DEFAULT_QMD_EMBED_INTERVAL = "60m";
const DEFAULT_QMD_COMMAND_TIMEOUT_MS = 3e4;
const DEFAULT_QMD_UPDATE_TIMEOUT_MS = 12e4;
const DEFAULT_QMD_EMBED_TIMEOUT_MS = 12e4;
const DEFAULT_QMD_LIMITS = {
  maxResults: 4,
  maxSnippetChars: 450,
  maxInjectedChars: 2200,
  timeoutMs: DEFAULT_QMD_TIMEOUT_MS,
};
const DEFAULT_QMD_MCPORTER = {
  enabled: false,
  serverName: "qmd",
  startDaemon: true,
};
const DEFAULT_QMD_SCOPE = {
  default: "deny",
  rules: [
    {
      action: "allow",
      match: { chatType: "direct" },
    },
  ],
};
function sanitizeName(input) {
  return (
    normalizeLowercaseStringOrEmpty(input)
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "collection"
  );
}
function scopeCollectionBase(base, agentId) {
  return `${base}-${sanitizeName(agentId)}`;
}
function canonicalizePathForContainment(rawPath) {
  const resolved = path.resolve(rawPath);
  let current = resolved;
  const suffix = [];
  while (true)
    try {
      const canonical = path.normalize(fs.realpathSync.native(current));
      return path.normalize(path.join(canonical, ...suffix));
    } catch {
      const parent = path.dirname(current);
      if (parent === current) return path.normalize(resolved);
      suffix.unshift(path.basename(current));
      current = parent;
    }
}
function isPathInsideRoot(candidatePath, rootPath) {
  return isPathInside(
    canonicalizePathForContainment(rootPath),
    canonicalizePathForContainment(candidatePath),
  );
}
function ensureUniqueName(base, existing) {
  const name = sanitizeName(base);
  if (!existing.has(name)) {
    existing.add(name);
    return name;
  }
  let suffix = 2;
  while (existing.has(`${name}-${suffix}`)) suffix += 1;
  const unique = `${name}-${suffix}`;
  existing.add(unique);
  return unique;
}
function resolvePath(raw, workspaceDir) {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("path required");
  if (trimmed.startsWith("~") || path.isAbsolute(trimmed))
    return path.normalize(resolveMemoryHostUserPath(trimmed));
  return path.normalize(path.resolve(workspaceDir, trimmed));
}
function resolveIntervalMs(raw) {
  const value = raw?.trim();
  if (!value) return parseDurationMs(DEFAULT_QMD_INTERVAL, { defaultUnit: "m" });
  try {
    return parseDurationMs(value, { defaultUnit: "m" });
  } catch {
    return parseDurationMs(DEFAULT_QMD_INTERVAL, { defaultUnit: "m" });
  }
}
function resolveEmbedIntervalMs(raw) {
  const value = raw?.trim();
  if (!value) return parseDurationMs(DEFAULT_QMD_EMBED_INTERVAL, { defaultUnit: "m" });
  try {
    return parseDurationMs(value, { defaultUnit: "m" });
  } catch {
    return parseDurationMs(DEFAULT_QMD_EMBED_INTERVAL, { defaultUnit: "m" });
  }
}
function resolveDebounceMs(raw) {
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) return Math.floor(raw);
  return DEFAULT_QMD_DEBOUNCE_MS;
}
function resolveTimeoutMs(raw, fallback) {
  return resolvePositiveIntegerConfig(raw, fallback);
}
function resolvePositiveIntegerConfig(raw, fallback) {
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw <= 0) return fallback;
  return Math.max(1, Math.floor(raw));
}
function resolveStartupMode(raw) {
  const value = raw?.startup;
  if (value === "idle" || value === "immediate" || value === "off") return value;
  return DEFAULT_QMD_STARTUP;
}
function resolveStartupDelayMs(raw) {
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= 0) return Math.floor(raw);
  return DEFAULT_QMD_STARTUP_DELAY_MS;
}
function resolveLimits(raw) {
  return {
    maxResults: resolvePositiveIntegerConfig(raw?.maxResults, DEFAULT_QMD_LIMITS.maxResults),
    maxSnippetChars: resolvePositiveIntegerConfig(
      raw?.maxSnippetChars,
      DEFAULT_QMD_LIMITS.maxSnippetChars,
    ),
    maxInjectedChars: resolvePositiveIntegerConfig(
      raw?.maxInjectedChars,
      DEFAULT_QMD_LIMITS.maxInjectedChars,
    ),
    timeoutMs: resolvePositiveIntegerConfig(raw?.timeoutMs, DEFAULT_QMD_LIMITS.timeoutMs),
  };
}
function resolveSearchMode(raw) {
  if (raw === "search" || raw === "vsearch" || raw === "query") return raw;
  return DEFAULT_QMD_SEARCH_MODE;
}
function resolveSearchTool(raw) {
  const value = raw?.trim();
  return value ? value : void 0;
}
function resolveSessionConfig(cfg, workspaceDir) {
  const enabled = Boolean(cfg?.enabled);
  const exportDirRaw = cfg?.exportDir?.trim();
  return {
    enabled,
    exportDir: exportDirRaw ? resolvePath(exportDirRaw, workspaceDir) : void 0,
    retentionDays: resolvePositiveIntegerConfig(cfg?.retentionDays),
  };
}
function resolveCustomPaths(rawPaths, workspaceDir, existing, agentId) {
  if (!rawPaths?.length) return [];
  const collections = [];
  const seenRoots = /* @__PURE__ */ new Set();
  rawPaths.forEach((entry, index) => {
    const trimmedPath = entry?.path?.trim();
    if (!trimmedPath) return;
    let resolved;
    let collectionPath;
    try {
      resolved = resolvePath(trimmedPath, workspaceDir);
    } catch {
      return;
    }
    collectionPath = resolved;
    let pattern = entry.pattern?.trim() || "**/*.md";
    try {
      if (fs.statSync(resolved).isFile()) {
        collectionPath = path.dirname(resolved);
        pattern = escapeQmdExactFilePattern(path.basename(resolved));
      }
    } catch {}
    const dedupeKey = `${collectionPath}\u0000${pattern}`;
    if (seenRoots.has(dedupeKey)) return;
    seenRoots.add(dedupeKey);
    const explicitName = entry.name?.trim();
    const name = ensureUniqueName(
      explicitName && !isPathInsideRoot(collectionPath, workspaceDir)
        ? explicitName
        : scopeCollectionBase(explicitName || `custom-${index + 1}`, agentId),
      existing,
    );
    collections.push({
      name,
      path: collectionPath,
      pattern,
      kind: "custom",
    });
  });
  return collections;
}
function resolveMcporterConfig(raw) {
  const parsed = { ...DEFAULT_QMD_MCPORTER };
  if (!raw) return parsed;
  if (raw.enabled !== void 0) parsed.enabled = raw.enabled;
  if (typeof raw.serverName === "string" && raw.serverName.trim())
    parsed.serverName = raw.serverName.trim();
  if (raw.startDaemon !== void 0) parsed.startDaemon = raw.startDaemon;
  if (parsed.enabled && raw.startDaemon === void 0) parsed.startDaemon = true;
  return parsed;
}
function resolveDefaultCollections(include, workspaceDir, existing, agentId) {
  if (!include) return [];
  return [
    {
      path: workspaceDir,
      pattern: MEMORY_HOST_ROOT_FILENAME,
      base: "memory-root",
    },
    {
      path: path.join(workspaceDir, "memory"),
      pattern: "**/*.md",
      base: "memory-dir",
    },
  ].map((entry) => ({
    name: ensureUniqueName(scopeCollectionBase(entry.base, agentId), existing),
    path: entry.path,
    pattern: entry.pattern,
    kind: "memory",
  }));
}
function resolveMemoryBackendConfig(params) {
  const normalizedAgentId = normalizeAgentId(params.agentId);
  const backend = params.cfg.memory?.backend ?? DEFAULT_BACKEND;
  const citations = params.cfg.memory?.citations ?? DEFAULT_CITATIONS;
  if (backend !== "qmd")
    return {
      backend: "builtin",
      citations,
    };
  const workspaceDir = resolveMemoryHostAgentWorkspaceDir(params.cfg, normalizedAgentId);
  const qmdCfg = params.cfg.memory?.qmd;
  const includeDefaultMemory = qmdCfg?.includeDefaultMemory !== false;
  const nameSet = /* @__PURE__ */ new Set();
  const agentEntry = params.cfg.agents?.list?.find(
    (entry) => normalizeAgentId(entry?.id) === normalizedAgentId,
  );
  const searchExtraPaths = uniqueStrings(
    normalizeStringEntries(
      [
        ...(params.cfg.agents?.defaults?.memorySearch?.extraPaths ?? []),
        ...(agentEntry?.memorySearch?.extraPaths ?? []),
      ].filter((value) => typeof value === "string"),
    ),
  ).map((pathValue) => ({ path: pathValue }));
  const mergedExtraCollections = [
    ...(params.cfg.agents?.defaults?.memorySearch?.qmd?.extraCollections ?? []),
    ...(agentEntry?.memorySearch?.qmd?.extraCollections ?? []),
  ].filter(
    (value) => value !== null && typeof value === "object" && typeof value.path === "string",
  );
  const allQmdPaths = [...(qmdCfg?.paths ?? []), ...searchExtraPaths, ...mergedExtraCollections];
  const collections = [
    ...resolveDefaultCollections(includeDefaultMemory, workspaceDir, nameSet, normalizedAgentId),
    ...resolveCustomPaths(allQmdPaths, workspaceDir, nameSet, normalizedAgentId),
  ];
  return {
    backend: "qmd",
    citations,
    qmd: {
      command: resolveQmdCommand(qmdCfg?.command?.trim() || "qmd"),
      mcporter: resolveMcporterConfig(qmdCfg?.mcporter),
      searchMode: resolveSearchMode(qmdCfg?.searchMode),
      rerank: qmdCfg?.rerank,
      searchTool: resolveSearchTool(qmdCfg?.searchTool),
      collections,
      includeDefaultMemory,
      sessions: resolveSessionConfig(qmdCfg?.sessions, workspaceDir),
      update: {
        intervalMs: resolveIntervalMs(qmdCfg?.update?.interval),
        debounceMs: resolveDebounceMs(qmdCfg?.update?.debounceMs),
        onBoot: qmdCfg?.update?.onBoot !== false,
        startup: resolveStartupMode(qmdCfg?.update),
        startupDelayMs: resolveStartupDelayMs(qmdCfg?.update?.startupDelayMs),
        waitForBootSync: qmdCfg?.update?.waitForBootSync === true,
        embedIntervalMs: resolveEmbedIntervalMs(qmdCfg?.update?.embedInterval),
        commandTimeoutMs: resolveTimeoutMs(
          qmdCfg?.update?.commandTimeoutMs,
          DEFAULT_QMD_COMMAND_TIMEOUT_MS,
        ),
        updateTimeoutMs: resolveTimeoutMs(
          qmdCfg?.update?.updateTimeoutMs,
          DEFAULT_QMD_UPDATE_TIMEOUT_MS,
        ),
        embedTimeoutMs: resolveTimeoutMs(
          qmdCfg?.update?.embedTimeoutMs,
          DEFAULT_QMD_EMBED_TIMEOUT_MS,
        ),
      },
      limits: resolveLimits(qmdCfg?.limits),
      scope: qmdCfg?.scope ?? DEFAULT_QMD_SCOPE,
    },
  };
}
//#endregion
export { resolveMemoryBackendConfig as t };
