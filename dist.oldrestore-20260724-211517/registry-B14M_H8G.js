import { randomUUID } from "node:crypto";
import * as fsPromises from "node:fs/promises";
import { lstat } from "node:fs/promises";
import path from "node:path";
import { c as emitAgentEvent } from "./agent-events-D4UsOPeT.js";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import {
  a as normalizePluginToolContractNames,
  i as findUndeclaredPluginToolNames,
  n as normalizeAgentToolResultMiddlewareRuntimeIds,
  o as normalizePluginToolNames,
  r as normalizeAgentToolResultMiddlewareRuntimes,
} from "./agent-tool-result-middleware-DHyndnr5.js";
import { t as buildPluginApi } from "./api-builder-B6HcSqZf.js";
import {
  O as normalizeCommandDescriptorName,
  k as sanitizeCommandDescriptorDescription,
} from "./argv-zTv4_Dzq.js";
import "./utils-DtcDeqWS.js";
import { d as normalizeChannelMeta } from "./bundled-CmD3EzUu.js";
import { r as listChatChannels } from "./chat-meta-B_W7YKQn.js";
import {
  i as registerPluginCommand,
  l as clearPluginCommandsForPlugin,
  o as validatePluginCommandDefinition,
  p as pluginCommands,
  t as isReservedCommandName,
} from "./command-registration-CTCK5hi-.js";
import { t as extractDeliveryInfo } from "./delivery-info-Du3-Z2RS.js";
import {
  i as registerDetachedTaskLifecycleRuntime,
  n as getDetachedTaskLifecycleRuntimeRegistration,
} from "./detached-task-runtime-state-BrJUgd0A.js";
import "./agent-scope-y9xQv_q1.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as normalizePluginGatewayMethodScope } from "./gateway-method-policy-BQVhuE4m.js";
import {
  i as withPluginRuntimePluginScope,
  r as withPluginRuntimePluginIdScope,
} from "./gateway-request-scope-CiIBNuZX.js";
import {
  S as registerEmbeddingProvider,
  b as getRegisteredEmbeddingProvider,
} from "./gateway-startup-plugin-ids-C7oHc3ol.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import {
  n as normalizePluginHttpPath,
  t as findOverlappingPluginHttpRoute,
} from "./http-route-overlap--iFT7z_9.js";
import { i as GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA } from "./ids-lBaN9yr4.js";
import { _ as getPluginCompatRecord } from "./installed-plugin-index-lBfkb-7L.js";
import {
  a as registerRegistryPluginInteractiveHandler,
  n as clearPluginInteractiveHandlersForPlugin,
} from "./interactive-registry-BnOxEacm.js";
import {
  f as registerInternalHook,
  h as unregisterInternalHook,
} from "./internal-hooks-CckLIOgu.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  d as registerMemoryFlushPlanResolverForPlugin,
  f as registerMemoryPromptSectionForPlugin,
  l as registerMemoryCapability,
  m as registerMemoryRuntimeForPlugin,
  p as registerMemoryPromptSupplement,
  u as registerMemoryCorpusSupplement,
} from "./memory-state-z9GGEQiO.js";
import {
  i as normalizeMessageChannel,
  t as isDeliverableMessageChannel,
} from "./message-channel-normalize-Be6uJOzO.js";
import {
  n as detectMime,
  t as FILE_TYPE_SNIFF_MAX_BYTES,
  u as normalizeMimeType,
} from "./mime-BSEMEb3s.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BcuK-xC3.js";
import {
  d as NODE_SYSTEM_NOTIFY_COMMAND,
  f as NODE_SYSTEM_RUN_COMMANDS,
  o as NODE_EXEC_APPROVALS_COMMANDS,
} from "./node-commands-zATGYJg5.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  P as timestampMsToIsoString,
} from "./number-coercion-CJQ8TR--.js";
import { z as normalizeOptionalAgentRuntimeId } from "./openai-routing-Cu28Ynzk.js";
import {
  L as executeSqliteQuerySync,
  R as executeSqliteQueryTakeFirstSync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { s as isOperatorScope } from "./operator-scopes-CpPJIv7P.js";
import { t as resolvePathFromInput } from "./path-policy-D_kcZMAl.js";
import {
  n as createPluginStateKeyedStore,
  r as createPluginStateSyncKeyedStore,
} from "./plugin-state-store-CdAHpy0G.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { r as createPluginGatewayMethodDescriptor } from "./registry-Dv_VSoII.js";
import {
  a as registerContextEngineForOwner,
  t as clearContextEnginesForOwner,
} from "./registry-DXbEDAsr.js";
import { a as registerAgentHarness, r as getRegisteredAgentHarness } from "./registry-ef8V3P8D.js";
import "./message-channel-NQc9DJ6B.js";
import {
  A as clearPluginRunContext,
  B as isPluginRegistryActivated,
  F as registerPluginSessionSchedulerJob,
  I as setPluginRunContext,
  L as buildPluginAgentTurnPrepareContext,
  M as getPluginRunContext,
  N as getPluginSessionSchedulerJobGeneration,
  O as createEmptyPluginRegistry,
  R as normalizePluginHostHookId,
  V as isPluginRegistryRetired,
  c as getActivePluginRegistry,
  j as deletePluginSessionSchedulerJob,
  p as getActivePluginSessionExtensionRegistry,
} from "./runtime-CcYnX0B4.js";
import {
  i as readRecordValue,
  n as copyRecordEntries,
  r as isRecordWithoutThrowing,
  t as copyArrayEntries,
} from "./safe-record-Cx9ufCqd.js";
import { t as validateJsonSchemaValue } from "./schema-validator-BAYKPBuJ.js";
import {
  it as updateResolvedSessionEntry,
  q as resolveSessionEntryAccessTarget,
} from "./session-accessor-PZVNxFCV.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import { n as defaultSlotIdForKey, r as hasKind } from "./slots-kpL659LX.js";
import {
  Et as isAgentHarnessSessionKeyOwnedBy,
  Tt as isAgentHarnessSessionKey,
  h as normalizeSessionEntrySlotKey,
} from "./store-CzZJhTF6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  f as normalizeStringifiedOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  h as normalizeUniqueTrimmedStringList,
  l as normalizeStringEntries,
  p as normalizeUniqueStringEntries,
  v as uniqueValues,
} from "./string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  c as isConversationHookName,
  d as isPromptInjectionHookName,
  i as DEPRECATED_PLUGIN_HOOKS,
  l as isDeprecatedPluginHookName,
  m as stripPromptMutationFieldsFromLegacyHookResult,
  u as isPluginHookName,
} from "./types-DN4huvwe.js";
import { s as validateWorkerProviderContract } from "./worker-provider-registry-CKsY-3qr.js";
import { n as resolveWorkspaceRoot } from "./workspace-dir-C7a6XA8X.js";
//#region src/plugins/compaction-provider.ts
const COMPACTION_PROVIDER_REGISTRY_STATE = Symbol.for("openclaw.compactionProviderRegistryState");
function getCompactionProviderRegistryState() {
  const globalState = globalThis;
  if (!globalState[COMPACTION_PROVIDER_REGISTRY_STATE])
    globalState[COMPACTION_PROVIDER_REGISTRY_STATE] = { providers: /* @__PURE__ */ new Map() };
  return globalState[COMPACTION_PROVIDER_REGISTRY_STATE];
}
/**
 * Register a compaction provider implementation.
 * Pass `ownerPluginId` so the loader can snapshot/restore correctly.
 */
function registerCompactionProvider(provider, options) {
  getCompactionProviderRegistryState().providers.set(provider.id, {
    provider,
    ownerPluginId: options?.ownerPluginId,
  });
}
/** Return the provider for the given id, or undefined. */
function getCompactionProvider(id) {
  return getCompactionProviderRegistryState().providers.get(id)?.provider;
}
/** Return the registered entry (provider + owner) for the given id. */
function getRegisteredCompactionProvider(id) {
  return getCompactionProviderRegistryState().providers.get(id);
}
/** List all registered entries with owner metadata (for snapshot/restore). */
function listRegisteredCompactionProviders() {
  return Array.from(getCompactionProviderRegistryState().providers.values());
}
/** Clear all compaction providers. Used by clearPluginLoaderCache() and reload. */
function clearCompactionProviders() {
  getCompactionProviderRegistryState().providers.clear();
}
/** Restore from a snapshot, replacing all current entries. */
function restoreRegisteredCompactionProviders(entries) {
  const map = getCompactionProviderRegistryState().providers;
  map.clear();
  for (const entry of entries) map.set(entry.provider.id, entry);
}
//#endregion
//#region src/plugins/memory-embedding-providers.ts
const MEMORY_EMBEDDING_PROVIDERS_KEY = Symbol.for("openclaw.memoryEmbeddingProviders");
function getMemoryEmbeddingProviders() {
  const globalStore = globalThis;
  const existing = globalStore[MEMORY_EMBEDDING_PROVIDERS_KEY];
  if (existing instanceof Map) return existing;
  const created = /* @__PURE__ */ new Map();
  globalStore[MEMORY_EMBEDDING_PROVIDERS_KEY] = created;
  return created;
}
/** Registers a memory embedding provider adapter for the current process. */
function registerMemoryEmbeddingProvider(adapter, options) {
  getMemoryEmbeddingProviders().set(adapter.id, {
    adapter,
    ownerPluginId: options?.ownerPluginId,
  });
}
/** Returns a registered memory embedding provider entry. */
function getRegisteredMemoryEmbeddingProvider(id) {
  return getMemoryEmbeddingProviders().get(id);
}
/** Returns only the memory embedding provider adapter. */
function getMemoryEmbeddingProvider(id) {
  return getMemoryEmbeddingProviders().get(id)?.adapter;
}
/** Lists registered memory embedding provider entries. */
function listRegisteredMemoryEmbeddingProviders() {
  return Array.from(getMemoryEmbeddingProviders().values());
}
/** Lists registered memory embedding provider adapters. */
function listMemoryEmbeddingProviders() {
  return listRegisteredMemoryEmbeddingProviders().map((entry) => entry.adapter);
}
/** Replaces registered memory embedding providers while preserving metadata. */
function restoreRegisteredMemoryEmbeddingProviders(entries) {
  getMemoryEmbeddingProviders().clear();
  for (const entry of entries)
    registerMemoryEmbeddingProvider(entry.adapter, { ownerPluginId: entry.ownerPluginId });
}
/** Clears registered memory embedding providers. */
function clearMemoryEmbeddingProviders() {
  getMemoryEmbeddingProviders().clear();
}
//#endregion
//#region src/agents/code-mode-json.ts
function toCodeModeJsonSafe(value) {
  if (value === void 0) return null;
  try {
    const serialized = JSON.stringify(value);
    return serialized === void 0 ? null : JSON.parse(serialized);
  } catch {
    if (value instanceof Error)
      return {
        name: value.name,
        message: value.message,
      };
    if (value === null) return null;
    switch (typeof value) {
      case "string":
      case "number":
      case "boolean":
        return value;
      case "bigint":
      case "symbol":
      case "function":
        return String(value);
      default:
        return Object.prototype.toString.call(value);
    }
  }
}
//#endregion
//#region src/agents/code-mode-namespaces.ts
/**
 * Registry and runtime projection for code-mode namespaces. Plugins register
 * namespaced tool scopes here; code mode receives descriptors, virtual API
 * files, and a guarded invocation runtime.
 */
const FORBIDDEN_NAMESPACE_PATH_SEGMENTS = /* @__PURE__ */ new Set([
  "__proto__",
  "constructor",
  "prototype",
]);
const NAMESPACE_PATH_KEY_SEPARATOR = "\0";
const CODE_MODE_NAMESPACE_TOOL_CALL = Symbol.for("openclaw.codeMode.namespaceToolCall");
const RESERVED_NAMESPACE_GLOBALS = /* @__PURE__ */ new Set([
  "ALL_TOOLS",
  "API",
  "Array",
  "Boolean",
  "Date",
  "Error",
  "globalThis",
  "json",
  "JSON",
  "Map",
  "Math",
  "MCP",
  "namespaces",
  "Number",
  "Object",
  "Promise",
  "Set",
  "String",
  "text",
  "tools",
  "yield_control",
]);
const CODE_MODE_NAMESPACE_REGISTRY_KEY = Symbol.for("openclaw.codeMode.namespaces");
const globalWithRegistry = globalThis;
const registryState =
  globalWithRegistry[CODE_MODE_NAMESPACE_REGISTRY_KEY] ??
  (globalWithRegistry[CODE_MODE_NAMESPACE_REGISTRY_KEY] = {
    registrations: /* @__PURE__ */ new Map(),
  });
function createCodeModeNamespaceCatalogTool(catalogId, toolName, input) {
  const normalizedCatalogId = catalogId.trim();
  const normalizedToolName = toolName.trim();
  if (!normalizedCatalogId) throw new Error("Code mode namespace catalogId must be non-empty.");
  if (!normalizedToolName) throw new Error("Code mode namespace toolName must be non-empty.");
  return {
    [CODE_MODE_NAMESPACE_TOOL_CALL]: true,
    catalogId: normalizedCatalogId,
    toolName: normalizedToolName,
    ...(input ? { input } : {}),
  };
}
function createCodeModeNamespaceLocalFunction(toolName, input) {
  const normalizedToolName = toolName.trim();
  if (!normalizedToolName)
    throw new Error("Code mode namespace local function name must be non-empty.");
  return {
    [CODE_MODE_NAMESPACE_TOOL_CALL]: true,
    toolName: normalizedToolName,
    local: true,
    input,
  };
}
function isCodeModeNamespaceToolCall(value) {
  const record = isRecord(value) ? value : void 0;
  return (
    record?.[CODE_MODE_NAMESPACE_TOOL_CALL] === true &&
    typeof record.toolName === "string" &&
    record.toolName.trim().length > 0
  );
}
/** Lists registered namespaces in deterministic id order. */
function listCodeModeNamespaces() {
  return [...registryState.registrations.values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
/** Clears namespace registrations owned by one plugin. */
function clearCodeModeNamespacesForPlugin(pluginId) {
  const normalized = pluginId.trim();
  for (const registration of registryState.registrations.values())
    if (registration.pluginId === normalized) registryState.registrations.delete(registration.id);
}
function promptForRegistration(registration, ctx) {
  const prompt =
    typeof registration.prompt === "function" ? registration.prompt(ctx) : registration.prompt;
  return typeof prompt === "string" && prompt.trim() ? prompt.trim() : void 0;
}
function registrationHasVisibleRequiredTools(registration, catalog) {
  const ownedVisibleToolNames = new Set(
    catalog
      .filter((entry) => entry.sourceName === registration.pluginId)
      .map((entry) => entry.name),
  );
  return registration.requiredToolNames.every((toolName) => ownedVisibleToolNames.has(toolName));
}
function filterRegistrationsByVisibleTools(catalog) {
  return listCodeModeNamespaces().filter((registration) =>
    registrationHasVisibleRequiredTools(registration, catalog),
  );
}
function toIdentifier(value, fallback) {
  const words = value
    .trim()
    .split(/[^A-Za-z0-9]+/u)
    .map((word) => word.trim())
    .filter(Boolean);
  const safe = (
    words.length === 0
      ? fallback
      : words
          .map((word, index) =>
            index === 0
              ? word.charAt(0).toLowerCase() + word.slice(1)
              : word.charAt(0).toUpperCase() + word.slice(1),
          )
          .join("")
  )
    .replace(/^[^A-Za-z_$]+/u, "")
    .replace(/[^A-Za-z0-9_$]/gu, "");
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(safe) ? safe : fallback;
}
function uniqueIdentifier(base, used) {
  let candidate = base;
  let index = 2;
  while (
    used.has(candidate) ||
    RESERVED_NAMESPACE_GLOBALS.has(candidate) ||
    FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(candidate)
  ) {
    candidate = `${base}${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}
function readSchemaRecord(schema) {
  return isRecord(schema) ? schema : void 0;
}
function readSchemaProperties(schema) {
  const record = readSchemaRecord(schema);
  return isRecord(record?.properties) ? record.properties : {};
}
function readSchemaString(schema, key) {
  const value = readSchemaRecord(schema)?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function readRequiredKeys(schema) {
  const record = readSchemaRecord(schema);
  return Array.isArray(record?.required)
    ? record.required.filter((entry) => typeof entry === "string")
    : [];
}
function orderedSchemaKeys(schema) {
  const required = readRequiredKeys(schema);
  const properties = Object.keys(readSchemaProperties(schema));
  return [.../* @__PURE__ */ new Set([...required, ...properties])];
}
function applySchemaDefaults(schema, input) {
  const result = { ...input };
  for (const [key, descriptor] of Object.entries(readSchemaProperties(schema))) {
    if (!isRecord(descriptor) || !("default" in descriptor) || result[key] !== void 0) continue;
    result[key] = descriptor.default;
  }
  return result;
}
function mapMcpNamespaceInput(schema, args) {
  if (args.length > 1) throw new Error("MCP namespace tools accept one object argument.");
  const firstArg = args[0];
  const result = firstArg === void 0 ? {} : isRecord(firstArg) ? { ...firstArg } : {};
  if (firstArg !== void 0 && !isRecord(firstArg))
    throw new Error("MCP namespace tools accept one object argument.");
  const withDefaults = applySchemaDefaults(schema, result);
  const missing = readRequiredKeys(schema).filter((key) => withDefaults[key] === void 0);
  if (missing.length > 0)
    throw new Error(
      `Missing required MCP namespace argument${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`,
    );
  return withDefaults;
}
function escapeDocComment(value) {
  return value.replace(/\*\//gu, "* /").trim();
}
function indent(lines, prefix) {
  return lines.map((line) => `${prefix}${line}`);
}
function renderDocComment(summary, params) {
  const lines = [];
  const docLines = normalizeDocLines(summary);
  if (docLines.length === 0 && params.length === 0) return lines;
  lines.push("/**");
  for (const line of docLines) lines.push(` * ${escapeDocComment(line)}`);
  if (docLines.length > 0 && params.length > 0) lines.push(" *");
  for (const param of params) {
    const description = collapseDocText(param.description);
    if (description)
      lines.push(
        ` * @param ${param.name}${param.required ? "" : "?"} ${escapeDocComment(description)}`,
      );
  }
  lines.push(" */");
  return lines;
}
function normalizeDocLines(value) {
  if (!value) return [];
  return value
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);
}
function collapseDocText(value) {
  return normalizeDocLines(value).join(" ");
}
function schemaType(schema) {
  const record = readSchemaRecord(schema);
  if (!record) return "unknown";
  const enumValues = Array.isArray(record.enum)
    ? record.enum.filter(
        (entry) =>
          typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean",
      )
    : [];
  if (enumValues.length > 0 && enumValues.length <= 16)
    return enumValues.map((entry) => JSON.stringify(entry)).join(" | ");
  const oneOf = Array.isArray(record.oneOf) ? record.oneOf : void 0;
  const anyOf = Array.isArray(record.anyOf) ? record.anyOf : void 0;
  const union = oneOf ?? anyOf;
  if (union && union.length > 0 && union.length <= 8)
    return union.map((entry) => schemaType(entry)).join(" | ");
  const type = record.type;
  if (Array.isArray(type))
    return type
      .map((entry) =>
        schemaType({
          ...record,
          type: entry,
        }),
      )
      .join(" | ");
  switch (type) {
    case "string":
      return "string";
    case "integer":
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "array":
      return `${schemaType(record.items)}[]`;
    case "object":
      return renderInlineObjectType(record);
    case "null":
      return "null";
    default:
      return Object.keys(readSchemaProperties(schema)).length > 0
        ? renderInlineObjectType(record)
        : "unknown";
  }
}
function tsPropertyName(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(name) ? name : JSON.stringify(name);
}
function renderInlineObjectType(schema) {
  const properties = readSchemaProperties(schema);
  const keys = Object.keys(properties);
  if (keys.length === 0) return "Record<string, unknown>";
  const required = new Set(readRequiredKeys(schema));
  return `{ ${keys.map((key) => `${tsPropertyName(key)}${required.has(key) ? "" : "?"}: ${schemaType(properties[key])}`).join("; ")} }`;
}
function buildMcpParamDocs(schema) {
  const required = new Set(readRequiredKeys(schema));
  return orderedSchemaKeys(schema).map((key) => {
    const descriptor = readSchemaProperties(schema)[key];
    const doc = {
      name: key,
      required: required.has(key),
      type: schemaType(descriptor),
    };
    const description = readSchemaString(descriptor, "description");
    if (description) doc.description = description;
    if (isRecord(descriptor) && "default" in descriptor) doc.defaultValue = descriptor.default;
    return doc;
  });
}
function renderMcpInputType(params) {
  if (params.length === 0) return ["input?: Record<string, never>"];
  const lines = ["input: {"];
  for (const param of params) {
    if (param.description || param.defaultValue !== void 0) {
      const description = collapseDocText(param.description);
      const suffix =
        param.defaultValue === void 0 ? "" : ` Default: ${JSON.stringify(param.defaultValue)}.`;
      lines.push(`  /** ${escapeDocComment(`${description}${suffix}`.trim())} */`);
    }
    lines.push(`  ${tsPropertyName(param.name)}${param.required ? "" : "?"}: ${param.type};`);
  }
  lines.push("}");
  return lines;
}
function renderMcpToolSignature(tool, functionName = tool.path.at(-1) ?? tool.method) {
  const lines = renderDocComment(tool.description, tool.params);
  lines.push(`function ${functionName}(`);
  lines.push(...indent(renderMcpInputType(tool.params), "  "));
  lines.push("): Promise<McpToolResult>;");
  return lines;
}
function renderMcpServerHeader(server, tools) {
  const lines = [
    "type McpApiHeader = { header: string; tools?: unknown[]; schemas?: Record<string, unknown> };",
    "",
    "type McpToolResult = {",
    "  content?: unknown[];",
    "  structuredContent?: unknown;",
    "  isError?: boolean;",
    "  [key: string]: unknown;",
    "};",
    "",
    `declare namespace MCP.${server.identifier} {`,
    "  /** Return this TypeScript-style API header. */",
    "  function $api(toolName?: string, options?: { schema?: boolean }): Promise<McpApiHeader>;",
  ];
  const topLevelTools = tools.filter((tool) => tool.path.length === 1);
  const nestedTools = tools.filter((tool) => tool.path.length > 1);
  for (const tool of topLevelTools) {
    lines.push("");
    lines.push(...indent(renderMcpToolSignature(tool), "  "));
  }
  const nestedGroups = /* @__PURE__ */ new Map();
  for (const tool of nestedTools) {
    const groupName = tool.path[0] ?? "tools";
    nestedGroups.set(groupName, [...(nestedGroups.get(groupName) ?? []), tool]);
  }
  for (const [groupName, groupTools] of [...nestedGroups.entries()].toSorted((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push("");
    lines.push(`  namespace ${groupName} {`);
    for (const tool of groupTools) {
      lines.push("");
      lines.push(...indent(renderMcpToolSignature(tool, tool.path.at(-1) ?? tool.method), "    "));
    }
    lines.push("  }");
  }
  lines.push("}");
  return lines.join("\n");
}
function renderMcpRootHeader(servers) {
  return [
    "type McpApiHeader = { header: string; servers?: unknown[] };",
    "",
    "declare const MCP: {",
    "  /** List visible MCP servers and request server-specific headers. */",
    "  $api(): Promise<McpApiHeader>;",
    ...servers.map((server) => `  readonly ${server.identifier}: typeof MCP.${server.identifier};`),
    "};",
  ].join("\n");
}
function renderMcpRootFile(servers) {
  return [
    ...servers.map((server) => `/// <reference path="./${server.identifier}.d.ts" />`),
    "",
    renderMcpRootHeader(servers),
  ].join("\n");
}
function buildMcpApiResponse(params) {
  const [selector, options] = params.args;
  const includeSchema = isRecord(options) && options.schema === true;
  if (!params.server)
    return {
      kind: "mcp_api",
      scope: "root",
      header: renderMcpRootHeader(params.servers),
      servers: params.servers.map((server) => ({
        identifier: server.identifier,
        serverName: server.serverName,
        toolCount: server.tools.length,
      })),
      note: "Call MCP.<server>.$api() for a TypeScript-style header, then call tools with one object argument matching the shown input type.",
    };
  const selected =
    typeof selector === "string" && selector.trim()
      ? params.server.tools.filter(
          (tool) =>
            tool.method === selector.trim() ||
            tool.path.join(".") === selector.trim() ||
            tool.mcpTool === selector.trim(),
        )
      : params.server.tools;
  return {
    kind: "mcp_api",
    scope: selected.length === 1 ? "tool" : "server",
    server: {
      identifier: params.server.identifier,
      serverName: params.server.serverName,
    },
    header: renderMcpServerHeader(params.server, selected),
    tools: selected.map((tool) => ({
      method: tool.method,
      path: tool.path,
      mcpTool: tool.mcpTool,
      operation: tool.operation,
      description: tool.description,
    })),
    ...(includeSchema
      ? { schemas: Object.fromEntries(selected.map((tool) => [tool.method, tool.parameters])) }
      : {}),
    note: "Call MCP tools with one object argument, for example MCP.server.tool({ requiredField: value }).",
  };
}
function scopeAtPath(root, path) {
  let current = root;
  for (const segment of path) {
    const next = current[segment];
    if (!isRecord(next)) {
      const object = Object.create(null);
      current[segment] = object;
      current = object;
      continue;
    }
    current = next;
  }
  return current;
}
function toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier) {
  const existing = usedToolIdentifiers.get(serverIdentifier);
  if (existing) return existing;
  const created = /* @__PURE__ */ new Set(["$api", "resources", "prompts"]);
  usedToolIdentifiers.set(serverIdentifier, created);
  return created;
}
function createMcpNamespaceModel(catalog) {
  const mcpEntries = catalog.filter((entry) => entry.source === "mcp" && entry.id && entry.mcp);
  if (mcpEntries.length === 0) return;
  const serverNames = /* @__PURE__ */ new Map();
  const usedServerIdentifiers = /* @__PURE__ */ new Set();
  for (const entry of mcpEntries) {
    const safeServerName = entry.mcp?.safeServerName ?? entry.sourceName ?? "mcp";
    if (serverNames.has(safeServerName)) continue;
    serverNames.set(
      safeServerName,
      uniqueIdentifier(toIdentifier(safeServerName, "server"), usedServerIdentifiers),
    );
  }
  const usedToolIdentifiers = /* @__PURE__ */ new Map();
  const root = Object.create(null);
  const serverDocs = /* @__PURE__ */ new Map();
  for (const entry of mcpEntries.toSorted((a, b) => (a.id ?? "").localeCompare(b.id ?? ""))) {
    const mcp = entry.mcp;
    if (!mcp || !entry.id) continue;
    const serverIdentifier =
      serverNames.get(mcp.safeServerName) ?? uniqueIdentifier("server", usedServerIdentifiers);
    const serverScope = scopeAtPath(root, [serverIdentifier]);
    serverScope.$serverName = mcp.serverName;
    let serverDoc = serverDocs.get(serverIdentifier);
    if (!serverDoc) {
      serverDoc = {
        identifier: serverIdentifier,
        serverName: mcp.serverName,
        tools: [],
      };
      serverDocs.set(serverIdentifier, serverDoc);
    }
    const path =
      mcp.operation === "resources_list"
        ? ["resources", "list"]
        : mcp.operation === "resources_read"
          ? ["resources", "read"]
          : mcp.operation === "prompts_list"
            ? ["prompts", "list"]
            : mcp.operation === "prompts_get"
              ? ["prompts", "get"]
              : [
                  uniqueIdentifier(
                    toIdentifier(mcp.toolName, "tool"),
                    toolIdentifiersForServer(usedToolIdentifiers, serverIdentifier),
                  ),
                ];
    const parent = scopeAtPath(serverScope, path.slice(0, -1));
    parent[path.at(-1) ?? "tool"] = createCodeModeNamespaceCatalogTool(
      entry.id,
      entry.name,
      (args) => mapMcpNamespaceInput(entry.parameters, args),
    );
    serverDoc.tools.push({
      method: path.join("."),
      path,
      mcpTool: mcp.toolName,
      operation: mcp.operation,
      description: entry.description,
      parameters: entry.parameters,
      params: buildMcpParamDocs(entry.parameters),
    });
  }
  const docs = [...serverDocs.values()].map((server) =>
    Object.assign({}, server, {
      tools: server.tools.toSorted((a, b) => a.method.localeCompare(b.method)),
    }),
  );
  root.$api = createCodeModeNamespaceLocalFunction("$api", (args) =>
    buildMcpApiResponse({
      servers: docs,
      args,
    }),
  );
  for (const server of docs) {
    const serverScope = scopeAtPath(root, [server.identifier]);
    serverScope.$api = createCodeModeNamespaceLocalFunction("$api", (args) =>
      buildMcpApiResponse({
        servers: docs,
        server,
        args,
      }),
    );
  }
  return {
    root,
    docs,
  };
}
function createMcpNamespaceScope(catalog) {
  return createMcpNamespaceModel(catalog)?.root;
}
/** Builds virtual API declaration files for visible MCP namespace tools. */
function createCodeModeApiVirtualFiles(catalog = []) {
  const model = createMcpNamespaceModel(catalog);
  if (!model) return [];
  const rootContent = renderMcpRootFile(model.docs);
  const files = [
    {
      path: "mcp/index.d.ts",
      description: "Root MCP namespace declaration and server list.",
      content: rootContent,
      bytes: Buffer.byteLength(rootContent, "utf8"),
    },
  ];
  for (const server of model.docs) {
    const content = renderMcpServerHeader(server, server.tools);
    files.push({
      path: `mcp/${server.identifier}.d.ts`,
      description: `MCP server declaration for ${server.serverName}.`,
      content,
      bytes: Buffer.byteLength(content, "utf8"),
    });
  }
  return files;
}
function createMcpNamespaceEntry(catalog) {
  const scope = createMcpNamespaceScope(catalog);
  if (!scope) return;
  const callablePaths = /* @__PURE__ */ new Set();
  return {
    registration: {
      id: "mcp",
      pluginId: "bundle-mcp",
      globalName: "MCP",
      requiredToolNames: [],
      description: "MCP server tools grouped by server.",
      createScope: () => scope,
    },
    callablePaths,
    scope,
    descriptor: {
      id: "mcp",
      globalName: "MCP",
      description: "MCP server tools grouped by server.",
      scope: serializeNamespaceScopeValue(scope, [], /* @__PURE__ */ new WeakSet(), callablePaths),
    },
  };
}
function describeMcpNamespaceForPrompt(catalog) {
  const scope = createMcpNamespaceScope(catalog);
  if (!scope) return [];
  const servers = Object.entries(scope)
    .filter(([, value]) => isRecord(value) && typeof value.$serverName === "string")
    .map(([key]) => key)
    .toSorted();
  if (servers.length === 0) return [];
  return [
    "- MCP: MCP server tools grouped by server.",
    `Read API files such as mcp/index.d.ts and mcp/<server>.d.ts for TypeScript-style MCP headers; visible servers: ${servers.join(", ")}.`,
    "Call MCP tools as MCP.<server>.<tool>({ ...input }) with one object argument matching the header.",
  ];
}
/** Builds system-prompt text describing visible code-mode namespace globals. */
function describeCodeModeNamespacesForPrompt(ctx, catalog) {
  if (!catalog) return "";
  const registrations = filterRegistrationsByVisibleTools(catalog);
  const mcpPrompt = describeMcpNamespaceForPrompt(catalog);
  if (registrations.length === 0 && mcpPrompt.length === 0) return "";
  const lines = ["Registered namespace globals are available in code mode:"];
  lines.push(...mcpPrompt);
  for (const registration of registrations) {
    const description = registration.description?.trim();
    lines.push(
      description ? `- ${registration.globalName}: ${description}` : `- ${registration.globalName}`,
    );
    const prompt = promptForRegistration(registration, ctx);
    if (prompt) lines.push(prompt);
  }
  return lines.join("\n");
}
function assertNamespacePathSegment(segment) {
  if (
    !segment ||
    segment.includes(NAMESPACE_PATH_KEY_SEPARATOR) ||
    FORBIDDEN_NAMESPACE_PATH_SEGMENTS.has(segment)
  )
    throw new Error(`Invalid code mode namespace path segment: ${segment || "(empty)"}`);
}
function namespacePathKey(path) {
  return path.join(NAMESPACE_PATH_KEY_SEPARATOR);
}
function serializeNamespaceScopeValue(
  value,
  path = [],
  stack = /* @__PURE__ */ new WeakSet(),
  callablePaths = /* @__PURE__ */ new Set(),
) {
  if (isCodeModeNamespaceToolCall(value)) {
    callablePaths.add(namespacePathKey(path));
    return {
      kind: "function",
      path,
    };
  }
  if (typeof value === "function")
    throw new Error(
      `Code mode namespace function at ${path.join(".") || "(root)"} must be created with createCodeModeNamespaceTool.`,
    );
  if (value === null || typeof value !== "object")
    return {
      kind: "value",
      value: toCodeModeJsonSafe(value),
    };
  if (stack.has(value))
    throw new Error(`Circular code mode namespace scope at ${path.join(".") || "(root)"}.`);
  stack.add(value);
  try {
    if (Array.isArray(value))
      return {
        kind: "array",
        items: value.map((item, index) =>
          serializeNamespaceScopeValue(item, [...path, String(index)], stack, callablePaths),
        ),
      };
    const entries = [];
    for (const [key, child] of Object.entries(value)) {
      assertNamespacePathSegment(key);
      entries.push([
        key,
        serializeNamespaceScopeValue(child, [...path, key], stack, callablePaths),
      ]);
    }
    return {
      kind: "object",
      entries,
    };
  } finally {
    stack.delete(value);
  }
}
function resolveNamespacePath(scope, path) {
  let current = scope;
  let parent = void 0;
  for (const segment of path) {
    assertNamespacePathSegment(segment);
    parent = current;
    if (!isRecord(current) && !Array.isArray(current))
      return {
        target: void 0,
        parent,
      };
    current = current[segment];
  }
  return {
    target: current,
    parent,
  };
}
function readScope(value, id) {
  if (!isRecord(value))
    throw new Error(`Code mode namespace "${id}" createScope must return an object.`);
  return value;
}
/** Creates the runtime descriptor/invocation layer for visible namespaces. */
async function createCodeModeNamespaceRuntime(ctx, catalog = []) {
  const entries = [];
  const mcpEntry = createMcpNamespaceEntry(catalog);
  if (mcpEntry) entries.push(mcpEntry);
  for (const registration of listCodeModeNamespaces()) {
    if (!registrationHasVisibleRequiredTools(registration, catalog)) continue;
    const scope = readScope(await registration.createScope(ctx), registration.id);
    const callablePaths = /* @__PURE__ */ new Set();
    entries.push({
      registration,
      callablePaths,
      scope,
      descriptor: {
        id: registration.id,
        globalName: registration.globalName,
        ...(registration.description?.trim()
          ? { description: registration.description.trim() }
          : {}),
        scope: serializeNamespaceScopeValue(
          scope,
          [],
          /* @__PURE__ */ new WeakSet(),
          callablePaths,
        ),
      },
    });
  }
  const byId = new Map(entries.map((entry) => [entry.registration.id, entry]));
  return {
    descriptors: entries.map((entry) => entry.descriptor),
    async invoke(namespaceId, path, args, executeTool) {
      const entry = byId.get(namespaceId);
      if (!entry) throw new Error(`Unknown code mode namespace: ${namespaceId}`);
      for (const segment of path) assertNamespacePathSegment(segment);
      if (!entry.callablePaths.has(namespacePathKey(path)))
        throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
      const { target } = resolveNamespacePath(entry.scope, path);
      if (!isCodeModeNamespaceToolCall(target))
        throw new Error(`Code mode namespace path is not callable: ${path.join(".")}`);
      const input = target.input ? await target.input(args) : (args[0] ?? {});
      if (target.local) return toCodeModeJsonSafe(input);
      if (!target.catalogId && !entry.registration.requiredToolNames.includes(target.toolName))
        throw new Error(`Code mode namespace path targets undeclared tool: ${target.toolName}`);
      return toCodeModeJsonSafe(
        await executeTool({
          pluginId: entry.registration.pluginId,
          toolName: target.toolName,
          ...(target.catalogId ? { catalogId: target.catalogId } : {}),
          input,
          namespaceId,
          path: [...path],
        }),
      );
    },
  };
}
//#endregion
//#region src/plugins/agent-event-emission.ts
const HOST_OWNED_AGENT_EVENT_STREAMS = /* @__PURE__ */ new Set([
  "lifecycle",
  "tool",
  "assistant",
  "error",
  "item",
  "plan",
  "approval",
  "command_output",
  "patch",
  "compaction",
  "thinking",
  "model",
]);
function isPluginOwnedAgentEventStream(pluginId, stream) {
  return stream === pluginId || stream.startsWith(`${pluginId}.`);
}
function normalizePluginEventData(params) {
  if (params.data && typeof params.data === "object" && !Array.isArray(params.data))
    return {
      ...params.data,
      pluginId: params.pluginId,
      ...(params.pluginName ? { pluginName: params.pluginName } : {}),
    };
  return {
    value: params.data,
    pluginId: params.pluginId,
    ...(params.pluginName ? { pluginName: params.pluginName } : {}),
  };
}
function emitPluginAgentEvent(params) {
  const runId = normalizeOptionalString(params.event.runId);
  const sessionKey = normalizeOptionalString(params.event.sessionKey);
  const stream = normalizeOptionalString(params.event.stream);
  if (!runId || !stream)
    return {
      emitted: false,
      reason: "runId and stream are required",
    };
  if (!isPluginJsonValue(params.event.data))
    return {
      emitted: false,
      reason: "event data must be JSON-compatible",
    };
  if (params.origin !== "bundled" && HOST_OWNED_AGENT_EVENT_STREAMS.has(stream))
    return {
      emitted: false,
      reason: `stream ${stream} is reserved for bundled plugins`,
    };
  if (params.origin !== "bundled" && !isPluginOwnedAgentEventStream(params.pluginId, stream))
    return {
      emitted: false,
      reason: `stream ${stream} must be scoped to plugin ${params.pluginId}`,
    };
  emitAgentEvent({
    runId,
    stream,
    ...(sessionKey ? { sessionKey } : {}),
    data: normalizePluginEventData({
      pluginId: params.pluginId,
      pluginName: params.pluginName,
      data: params.event.data,
    }),
  });
  return {
    emitted: true,
    stream,
  };
}
//#endregion
//#region src/plugins/host-hook-attachments.ts
const DEFAULT_ATTACHMENT_MAX_BYTES = 25 * 1024 * 1024;
/** Filesystem adapter used by attachment MIME probes and tests. */
const attachmentProbeFs = { open: (...args) => fsPromises.open(...args) };
const MAX_ATTACHMENT_FILES = 10;
const loadSendMessage = createLazyRuntimeModule(() =>
  import("./message-BUyk_6HT.js").then((module) => module.sendMessage),
);
const loadGetChannelPlugin = createLazyRuntimeModule(() =>
  import("./plugins-DKUiZRqh.js").then((module) => module.getChannelPlugin),
);
function captionFormatToParseMode(captionFormat) {
  if (captionFormat === "html") return "HTML";
}
function escapeHtmlText(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
async function readMimeSniffBuffer(filePath, size) {
  let handle;
  try {
    handle = await attachmentProbeFs.open(filePath, "r");
    const length = Math.min(Math.max(0, size), FILE_TYPE_SNIFF_MAX_BYTES);
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await handle.read(buffer, 0, length, 0);
    return buffer.subarray(0, bytesRead);
  } catch (error) {
    return {
      error: `attachment file MIME read failed for ${filePath}: ${formatErrorMessage(error)}`,
    };
  } finally {
    await handle?.close().catch(() => void 0);
  }
}
/** Resolves channel-specific attachment delivery options from caption format and hints. */
function resolveAttachmentDelivery(params) {
  const fallbackParseMode = captionFormatToParseMode(params.captionFormat);
  const channel = params.channel.trim().toLowerCase();
  if (channel === "telegram") {
    const hint = params.channelHints?.telegram;
    const parseMode =
      hint?.parseMode ?? (params.captionFormat === "plain" ? "HTML" : fallbackParseMode);
    const escapePlainHtmlCaption = params.captionFormat === "plain" && parseMode === "HTML";
    const forceDocumentMime = normalizeMimeType(hint?.forceDocumentMime);
    return {
      ...(parseMode ? { parseMode } : {}),
      ...(escapePlainHtmlCaption ? { escapePlainHtmlCaption: true } : {}),
      ...(hint?.disableNotification !== void 0
        ? { disableNotification: hint.disableNotification }
        : {}),
      ...(forceDocumentMime ? { forceDocumentMime } : {}),
    };
  }
  if (channel === "discord") return fallbackParseMode ? { parseMode: fallbackParseMode } : {};
  if (channel === "slack") {
    const hint = params.channelHints?.slack;
    const threadTs = normalizeOptionalString(hint?.threadTs);
    return {
      ...(fallbackParseMode ? { parseMode: fallbackParseMode } : {}),
      ...(threadTs ? { threadTs } : {}),
    };
  }
  return fallbackParseMode ? { parseMode: fallbackParseMode } : {};
}
async function validateAttachmentFiles(files, maxBytes, options) {
  if (files.length > MAX_ATTACHMENT_FILES)
    return { error: `at most ${MAX_ATTACHMENT_FILES} attachment files are allowed` };
  const paths = [];
  let totalBytes = 0;
  for (const file of files) {
    if (!file || typeof file !== "object" || Array.isArray(file))
      return { error: "attachment file entry must be an object" };
    const filePath = normalizeOptionalString(file.path);
    if (!filePath) return { error: "attachment file path is required" };
    const resolvedPath = resolveAttachmentFilePath({
      filePath,
      config: options?.config,
      sessionKey: options?.sessionKey,
    });
    const info = await lstat(resolvedPath).catch(() => void 0);
    if (info?.isSymbolicLink())
      return { error: `attachment file symlinks are not allowed: ${resolvedPath}` };
    if (!info?.isFile()) return { error: `attachment file not found: ${resolvedPath}` };
    if (info.size > maxBytes)
      return { error: `attachment file exceeds ${maxBytes} bytes: ${resolvedPath}` };
    if (options?.forceDocumentMime) {
      const fileBuffer = await readMimeSniffBuffer(resolvedPath, info.size);
      if (!Buffer.isBuffer(fileBuffer)) return fileBuffer;
      let detectedMime;
      try {
        detectedMime = normalizeMimeType(await detectMime({ buffer: fileBuffer }));
      } catch (error) {
        return {
          error:
            `attachment file MIME detection failed for ${filePath}: ` + formatErrorMessage(error),
        };
      }
      if (detectedMime !== options.forceDocumentMime)
        return {
          error: `attachment file MIME mismatch for ${resolvedPath}: expected ${options.forceDocumentMime}, got ${detectedMime ?? "unknown"}`,
        };
    }
    totalBytes += info.size;
    if (totalBytes > maxBytes) return { error: `attachment files exceed ${maxBytes} bytes total` };
    paths.push(resolvedPath);
  }
  return paths;
}
function resolveAttachmentFilePath(params) {
  const workspaceDir =
    params.sessionKey && params.config
      ? resolveAgentWorkspaceDir(params.config, resolveAgentIdFromSessionKey(params.sessionKey))
      : void 0;
  return resolvePathFromInput(params.filePath, resolveWorkspaceRoot(workspaceDir));
}
function normalizeOptionalThreadId(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return normalizeOptionalString(value);
}
/** Resolves the thread id used when delivering a plugin session attachment. */
function resolveSessionAttachmentThreadId(params) {
  return (
    params.hintThreadTs ??
    normalizeOptionalThreadId(params.explicitThreadId) ??
    normalizeOptionalThreadId(params.fallbackThreadId) ??
    normalizeOptionalThreadId(params.deliveryThreadId)
  );
}
/** Sends a bundled-plugin session attachment through the session's active delivery route. */
async function sendPluginSessionAttachment(params) {
  if (params.origin !== "bundled")
    return {
      ok: false,
      error: "session attachments are restricted to bundled plugins",
    };
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (!sessionKey)
    return {
      ok: false,
      error: "sessionKey is required",
    };
  if (!Array.isArray(params.files) || params.files.length === 0)
    return {
      ok: false,
      error: "at least one attachment file is required",
    };
  const maxBytes =
    typeof params.maxBytes === "number" && Number.isFinite(params.maxBytes)
      ? Math.min(DEFAULT_ATTACHMENT_MAX_BYTES, Math.max(1, Math.floor(params.maxBytes)))
      : DEFAULT_ATTACHMENT_MAX_BYTES;
  const { deliveryContext, threadId } = extractDeliveryInfo(sessionKey, { cfg: params.config });
  if (!deliveryContext?.channel || !deliveryContext.to)
    return {
      ok: false,
      error: `session has no active delivery route: ${sessionKey}`,
    };
  const normalizedChannel = normalizeMessageChannel(deliveryContext.channel);
  try {
    if (
      (normalizedChannel && isDeliverableMessageChannel(normalizedChannel)
        ? (await loadGetChannelPlugin())(normalizedChannel)
        : void 0
      )?.outbound?.deliveryMode === "gateway"
    )
      return {
        ok: false,
        error: `session attachments require direct outbound delivery for channel ${deliveryContext.channel}; channel uses gateway delivery`,
      };
  } catch (error) {
    return {
      ok: false,
      error: `attachment delivery setup failed: ${formatErrorMessage(error)}`,
    };
  }
  const rawText = normalizeOptionalString(params.text) ?? "";
  const resolvedDelivery = resolveAttachmentDelivery({
    channel: deliveryContext.channel,
    captionFormat: params.captionFormat,
    channelHints: params.channelHints,
  });
  const validated = await validateAttachmentFiles(params.files, maxBytes, {
    forceDocumentMime: resolvedDelivery.forceDocumentMime,
    config: params.config,
    sessionKey,
  });
  if (!Array.isArray(validated))
    return {
      ok: false,
      error: validated.error,
    };
  const resolvedThreadId = resolveSessionAttachmentThreadId({
    deliveryThreadId: deliveryContext.threadId,
    explicitThreadId: params.threadId,
    fallbackThreadId: threadId,
    hintThreadTs: resolvedDelivery.threadTs,
  });
  let result;
  try {
    result = await (
      await loadSendMessage()
    )({
      to: deliveryContext.to,
      content: resolvedDelivery.escapePlainHtmlCaption ? escapeHtmlText(rawText) : rawText,
      channel: deliveryContext.channel,
      accountId: deliveryContext.accountId,
      threadId: resolvedThreadId,
      requesterSessionKey: sessionKey,
      mediaUrls: validated,
      forceDocument: resolvedDelivery.forceDocumentMime ? true : params.forceDocument,
      bestEffort: false,
      cfg: params.config,
      ...(resolvedDelivery.parseMode ? { parseMode: resolvedDelivery.parseMode } : {}),
      ...(resolvedDelivery.disableNotification !== void 0
        ? { silent: resolvedDelivery.disableNotification }
        : {}),
    });
  } catch (error) {
    return {
      ok: false,
      error: `attachment delivery failed: ${formatErrorMessage(error)}`,
    };
  }
  if (!result.result)
    return {
      ok: false,
      error: "attachment delivery failed: no delivery result returned",
    };
  return {
    ok: true,
    channel: result.channel,
    deliveredTo: deliveryContext.to,
    count: validated.length,
  };
}
//#endregion
//#region src/plugins/host-hook-scheduled-turns.ts
const log$1 = createSubsystemLogger("plugins/host-scheduled-turns");
const PLUGIN_CRON_NAME_PREFIX = "plugin:";
const PLUGIN_CRON_TAG_MARKER = ":tag:";
function resolveSchedule(params) {
  const cron = normalizeOptionalString(params.cron);
  if (cron) {
    const tz = normalizeOptionalString(params.tz);
    return {
      kind: "cron",
      expr: cron,
      ...(tz ? { tz } : {}),
    };
  }
  if ("delayMs" in params) {
    if (!Number.isFinite(params.delayMs) || params.delayMs < 0) return;
    const at = timestampMsToIsoString(
      resolveExpiresAtMsFromDurationMs(Math.max(1, Math.floor(params.delayMs))),
    );
    if (!at) return;
    return {
      kind: "at",
      at,
    };
  }
  const rawAt = params.at;
  const at = rawAt instanceof Date ? rawAt : new Date(rawAt);
  if (!Number.isFinite(at.getTime())) return;
  return {
    kind: "at",
    at: at.toISOString(),
  };
}
function resolveSessionEventDeliveryMode(deliveryMode) {
  if (deliveryMode === void 0) return;
  if (deliveryMode === "none" || deliveryMode === "announce") return deliveryMode;
}
function formatScheduleLogContext(params) {
  const parts = [`pluginId=${params.pluginId}`];
  if (params.sessionKey) parts.push(`sessionKey=${params.sessionKey}`);
  if (params.name) parts.push(`name=${params.name}`);
  if (params.jobId) parts.push(`jobId=${params.jobId}`);
  return parts.join(" ");
}
async function removeScheduledSessionTurn(params) {
  try {
    return didCronCleanupJob(await params.cron.remove(params.jobId));
  } catch (error) {
    log$1.warn(
      `plugin session turn cleanup failed (${formatScheduleLogContext(params)}): ${formatErrorMessage(error)}`,
    );
    return false;
  }
}
function didCronRemoveJob(value) {
  return isCronRemoveResult(value) && value.ok && value.removed;
}
function didCronCleanupJob(value) {
  return isCronRemoveResult(value) && value.ok;
}
const PLUGIN_CRON_RESERVED_DELIMITER = ":";
function resolvePluginSessionTurnTag(value) {
  const tag = normalizeOptionalString(value);
  if (!tag) return { invalid: false };
  if (tag.includes(PLUGIN_CRON_RESERVED_DELIMITER)) return { invalid: true };
  return {
    tag,
    invalid: false,
  };
}
function buildPluginSchedulerCronName(params) {
  const uniqueId = params.uniqueId ?? randomUUID();
  if (!params.tag)
    return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}:${params.sessionKey}:${uniqueId}`;
  return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:${uniqueId}`;
}
function buildPluginSchedulerTagPrefix(params) {
  return `${PLUGIN_CRON_NAME_PREFIX}${params.pluginId}${PLUGIN_CRON_TAG_MARKER}${params.tag}:${params.sessionKey}:`;
}
function isCronRemoveResult(value) {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.ok === "boolean" &&
    typeof value.removed === "boolean"
  );
}
async function listAllCronJobsForPluginTagCleanup(cron, query) {
  const jobs = [];
  let offset = 0;
  for (;;) {
    const listResult = await cron.listPage({
      includeDisabled: true,
      limit: 200,
      query,
      sortBy: "name",
      sortDir: "asc",
      ...(offset > 0 ? { offset } : {}),
    });
    jobs.push(...listResult.jobs);
    if (!listResult.hasMore) return jobs;
    if (listResult.nextOffset === null || listResult.nextOffset <= offset) return jobs;
    offset = listResult.nextOffset;
  }
}
async function schedulePluginSessionTurn(params) {
  if (params.origin !== "bundled") return;
  const sessionKey = normalizeOptionalString(params.schedule.sessionKey);
  const message = normalizeOptionalString(params.schedule.message);
  if (!sessionKey || !message) return;
  const cronSchedule = resolveSchedule(params.schedule);
  if (!cronSchedule) return;
  const rawDeliveryMode = params.schedule.deliveryMode;
  const deliveryMode = resolveSessionEventDeliveryMode(rawDeliveryMode);
  const scheduleName = normalizeOptionalString(params.schedule.name);
  if (rawDeliveryMode !== void 0 && !deliveryMode) {
    log$1.warn(
      `plugin session turn scheduling failed (${formatScheduleLogContext({
        pluginId: params.pluginId,
        sessionKey,
        ...(scheduleName ? { name: scheduleName } : {}),
      })}): unsupported deliveryMode`,
    );
    return;
  }
  if (cronSchedule.kind === "cron" && params.schedule.deleteAfterRun === true) {
    log$1.warn(
      `plugin session turn scheduling failed (${formatScheduleLogContext({
        pluginId: params.pluginId,
        sessionKey,
        ...(scheduleName ? { name: scheduleName } : {}),
      })}): deleteAfterRun requires a one-shot schedule`,
    );
    return;
  }
  const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.schedule.tag);
  if (invalidTag) {
    log$1.warn(
      `plugin session turn scheduling failed (${formatScheduleLogContext({
        pluginId: params.pluginId,
        sessionKey,
        ...(scheduleName ? { name: scheduleName } : {}),
      })}): tag contains reserved delimiter ":"`,
    );
    return;
  }
  const cronDeliveryMode = deliveryMode ?? "announce";
  if (params.shouldCommit && !params.shouldCommit()) return;
  if (!params.cron) {
    log$1.warn(
      `plugin session turn scheduling failed (${formatScheduleLogContext({
        pluginId: params.pluginId,
        sessionKey,
        ...(scheduleName ? { name: scheduleName } : {}),
      })}): cron service unavailable`,
    );
    return;
  }
  const cron = params.cron;
  const cronJobName = buildPluginSchedulerCronName({
    pluginId: params.pluginId,
    sessionKey,
    ...(tag !== void 0 ? { tag } : {}),
    ...(scheduleName ? { uniqueId: scheduleName } : {}),
  });
  const cronPayload = {
    kind: "agentTurn",
    message,
  };
  let result;
  try {
    result = await cron.add({
      name: cronJobName,
      enabled: true,
      schedule: cronSchedule,
      sessionTarget: `session:${sessionKey}`,
      payload: cronPayload,
      ...(params.schedule.agentId ? { agentId: params.schedule.agentId } : {}),
      deleteAfterRun: params.schedule.deleteAfterRun ?? cronSchedule.kind === "at",
      wakeMode: "now",
      delivery: {
        mode: cronDeliveryMode,
        ...(cronDeliveryMode === "announce" ? { channel: "last" } : {}),
      },
    });
  } catch (error) {
    log$1.warn(
      `plugin session turn scheduling failed (${formatScheduleLogContext({
        pluginId: params.pluginId,
        sessionKey,
        name: cronJobName,
      })}): ${formatErrorMessage(error)}`,
    );
    return;
  }
  const jobId = result.id;
  if (!jobId) return;
  if (params.shouldCommit && !params.shouldCommit()) {
    if (
      !(await removeScheduledSessionTurn({
        cron,
        jobId,
        pluginId: params.pluginId,
        sessionKey,
        name: cronJobName,
      }))
    )
      log$1.warn(
        `plugin session turn scheduling rollback failed (${formatScheduleLogContext({
          pluginId: params.pluginId,
          sessionKey,
          name: cronJobName,
          jobId,
        })}): failed to remove stale scheduled session turn`,
      );
    return;
  }
  return registerPluginSessionSchedulerJob({
    pluginId: params.pluginId,
    pluginName: params.pluginName,
    ownerRegistry: params.ownerRegistry,
    job: {
      id: jobId,
      sessionKey,
      kind: "session-turn",
      cleanup: async () => {
        if (
          !(await removeScheduledSessionTurn({
            cron,
            jobId,
            pluginId: params.pluginId,
            sessionKey,
            name: cronJobName,
          }))
        )
          throw new Error(`failed to remove scheduled session turn: ${jobId}`);
      },
    },
  });
}
async function unschedulePluginSessionTurnsByTag(params) {
  if (params.origin !== "bundled")
    return {
      removed: 0,
      failed: 0,
    };
  const sessionKey = normalizeOptionalString(params.request.sessionKey);
  const { tag, invalid: invalidTag } = resolvePluginSessionTurnTag(params.request.tag);
  if (!sessionKey || !tag || invalidTag)
    return {
      removed: 0,
      failed: 0,
    };
  if (!params.cron) {
    log$1.warn("plugin session turn untag-list failed: cron service unavailable");
    return {
      removed: 0,
      failed: 1,
    };
  }
  const cron = params.cron;
  const namePrefix = buildPluginSchedulerTagPrefix({
    pluginId: params.pluginId,
    tag,
    sessionKey,
  });
  let jobs;
  try {
    jobs = await listAllCronJobsForPluginTagCleanup(cron, namePrefix);
  } catch (error) {
    log$1.warn(`plugin session turn untag-list failed: ${formatErrorMessage(error)}`);
    return {
      removed: 0,
      failed: 1,
    };
  }
  const candidates = jobs.filter((job) => {
    return job.name.startsWith(namePrefix) && job.sessionTarget === `session:${sessionKey}`;
  });
  let removed = 0;
  let failed = 0;
  for (const job of candidates) {
    const id = job.id.trim();
    if (!id) continue;
    try {
      if (didCronRemoveJob(await cron.remove(id))) {
        removed += 1;
        deletePluginSessionSchedulerJob({
          pluginId: params.pluginId,
          jobId: id,
          sessionKey,
        });
      } else failed += 1;
    } catch (error) {
      log$1.warn(
        `plugin session turn untag-remove failed: id=${id} error=${formatErrorMessage(error)}`,
      );
      failed += 1;
    }
  }
  return {
    removed,
    failed,
  };
}
//#endregion
//#region src/plugins/host-hook-state.ts
const log = createSubsystemLogger("plugins/host-hook-state");
const PROJECTION_FAILED = Symbol("plugin-session-extension-projection-failed");
const MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH = 32 * 1024;
const MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH = 512;
const MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION = 32;
function normalizeNamespace(value) {
  return value.trim();
}
function copyJsonValue(value) {
  return structuredClone(value);
}
function isPluginNextTurnInjectionPlacement(value) {
  return value === "prepend_context" || value === "append_context";
}
function isPluginNextTurnInjectionRecord(value) {
  if (!value || typeof value !== "object") return false;
  const candidate = value;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.pluginId === "string" &&
    typeof candidate.text === "string" &&
    typeof candidate.createdAt === "number" &&
    Number.isFinite(candidate.createdAt) &&
    isPluginNextTurnInjectionPlacement(candidate.placement) &&
    (candidate.ttlMs === void 0 ||
      (typeof candidate.ttlMs === "number" &&
        Number.isFinite(candidate.ttlMs) &&
        candidate.ttlMs >= 0)) &&
    (candidate.idempotencyKey === void 0 || typeof candidate.idempotencyKey === "string")
  );
}
function isExpired(entry, now) {
  if (!isPluginNextTurnInjectionRecord(entry)) return true;
  return typeof entry.ttlMs === "number" && entry.ttlMs >= 0 && now - entry.createdAt > entry.ttlMs;
}
function isPluginPromptInjectionEnabled(cfg, pluginId) {
  return cfg.plugins?.entries?.[pluginId]?.hooks?.allowPromptInjection !== false;
}
function toPluginNextTurnInjectionRecord(params) {
  return {
    id: params.injection.idempotencyKey?.trim() || randomUUID(),
    pluginId: params.pluginId,
    pluginName: params.pluginName,
    text: params.injection.text,
    idempotencyKey: params.injection.idempotencyKey?.trim() || void 0,
    placement: params.injection.placement ?? "prepend_context",
    ttlMs: params.injection.ttlMs,
    createdAt: params.now,
    metadata: params.injection.metadata,
  };
}
async function enqueuePluginNextTurnInjection(params) {
  if (typeof params.injection.sessionKey !== "string")
    return {
      enqueued: false,
      id: "",
      sessionKey: "",
    };
  const sessionKey = params.injection.sessionKey.trim();
  if (!sessionKey)
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  if (typeof params.injection.text !== "string")
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  const text = params.injection.text.trim();
  if (!text)
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  if (text.length > MAX_PLUGIN_NEXT_TURN_INJECTION_TEXT_LENGTH)
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  if (params.injection.metadata !== void 0 && !isPluginJsonValue(params.injection.metadata))
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  if (
    params.injection.idempotencyKey !== void 0 &&
    (typeof params.injection.idempotencyKey !== "string" ||
      params.injection.idempotencyKey.trim().length === 0 ||
      params.injection.idempotencyKey.length >
        MAX_PLUGIN_NEXT_TURN_INJECTION_IDEMPOTENCY_KEY_LENGTH)
  )
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  if (
    params.injection.placement !== void 0 &&
    !isPluginNextTurnInjectionPlacement(params.injection.placement)
  )
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  if (
    params.injection.ttlMs !== void 0 &&
    (!Number.isFinite(params.injection.ttlMs) || params.injection.ttlMs < 0)
  )
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  const now = params.now ?? Date.now();
  const record = toPluginNextTurnInjectionRecord({
    pluginId: params.pluginId,
    pluginName: params.pluginName,
    injection: {
      ...params.injection,
      sessionKey,
      text,
    },
    now,
  });
  const updated = await updateResolvedSessionEntry(
    {
      cfg: params.cfg,
      sessionKey,
    },
    (entry) => {
      let enqueued = false;
      let resultId = record.id;
      const injections = { ...entry.pluginNextTurnInjections };
      const rawExisting = injections[params.pluginId];
      const existing = (Array.isArray(rawExisting) ? [...rawExisting] : []).filter(
        (candidate) => !isExpired(candidate, now),
      );
      const duplicate = record.idempotencyKey
        ? existing.find((candidate) => candidate.idempotencyKey === record.idempotencyKey)
        : void 0;
      if (duplicate) {
        resultId = duplicate.id;
        injections[params.pluginId] = existing;
        entry.pluginNextTurnInjections = injections;
        return {
          enqueued,
          id: resultId,
        };
      }
      if (existing.length >= MAX_PLUGIN_NEXT_TURN_INJECTIONS_PER_SESSION) {
        injections[params.pluginId] = existing;
        entry.pluginNextTurnInjections = injections;
        return {
          enqueued,
          id: resultId,
        };
      }
      injections[params.pluginId] = [...existing, record];
      entry.pluginNextTurnInjections = injections;
      entry.updatedAt = now;
      enqueued = true;
      return {
        enqueued,
        id: resultId,
      };
    },
  );
  if (!updated.found)
    return {
      enqueued: false,
      id: "",
      sessionKey,
    };
  return {
    ...updated.result,
    sessionKey: updated.canonicalKey,
  };
}
async function drainPluginNextTurnInjections(params) {
  const sessionKey = params.sessionKey?.trim();
  if (!sessionKey) return [];
  const target = resolveSessionEntryAccessTarget({
    cfg: params.cfg,
    sessionKey,
  });
  if (!target.entry) return [];
  if (
    !target.entry.pluginNextTurnInjections ||
    Object.keys(target.entry.pluginNextTurnInjections).length === 0
  )
    return [];
  const now = params.now ?? Date.now();
  const updated = await updateResolvedSessionEntry(
    {
      cfg: params.cfg,
      sessionKey,
    },
    (entry) => {
      if (!entry?.pluginNextTurnInjections) return [];
      const activePluginIds = new Set(
        (getActivePluginRegistry()?.plugins ?? [])
          .filter((plugin) => plugin.status === "loaded")
          .map((plugin) => plugin.id),
      );
      const drained = [];
      for (const [pluginId, entries] of Object.entries(entry.pluginNextTurnInjections)) {
        if (!activePluginIds.has(pluginId) || !isPluginPromptInjectionEnabled(params.cfg, pluginId))
          continue;
        if (!Array.isArray(entries)) continue;
        const liveEntries = entries.filter((candidate) => !isExpired(candidate, now));
        drained.push(...liveEntries);
      }
      drained.sort((left, right) => left.createdAt - right.createdAt);
      delete entry.pluginNextTurnInjections;
      if (drained.length > 0) entry.updatedAt = now;
      return drained;
    },
  );
  return updated.found ? updated.result : [];
}
async function drainPluginNextTurnInjectionContext(params) {
  const queuedInjections = await drainPluginNextTurnInjections(params);
  return {
    queuedInjections,
    ...buildPluginAgentTurnPrepareContext({ queuedInjections }),
  };
}
function getPluginSessionExtensionStateSync(params) {
  const pluginId = params.pluginId.trim();
  const sessionKey = normalizeOptionalString(params.sessionKey);
  if (!pluginId || !sessionKey) return;
  const value = resolveSessionEntryAccessTarget({
    cfg: params.cfg,
    sessionKey,
  }).entry?.pluginExtensions?.[pluginId];
  return value ? copyJsonValue(value) : void 0;
}
async function patchPluginSessionExtension(params) {
  const namespace = normalizeNamespace(params.namespace);
  const pluginId = params.pluginId.trim();
  if (!pluginId || !namespace)
    return {
      ok: false,
      error: "pluginId and namespace are required",
    };
  if (params.unset === true && params.value !== void 0)
    return {
      ok: false,
      error: "plugin session extension cannot specify both unset and value",
    };
  if (params.value !== void 0 && !isPluginJsonValue(params.value))
    return {
      ok: false,
      error: "plugin session extension value must be JSON-compatible",
    };
  if (params.unset !== true && params.value === void 0)
    return {
      ok: false,
      error: "plugin session extension value is required unless unset is true",
    };
  const nextPluginValue = params.value;
  const registration = (getActivePluginSessionExtensionRegistry()?.sessionExtensions ?? []).find(
    (entry) => entry.pluginId === pluginId && entry.extension.namespace === namespace,
  );
  if (!registration)
    return {
      ok: false,
      error: `unknown plugin session extension: ${pluginId}/${namespace}`,
    };
  const rawSlotKey = normalizeOptionalString(registration.extension.sessionEntrySlotKey);
  const normalizedSlotKey = rawSlotKey ? normalizeSessionEntrySlotKey(rawSlotKey) : void 0;
  if (normalizedSlotKey?.ok === false)
    log.warn(
      `plugin session extension slot promotion skipped for ${pluginId}/${namespace}: ${normalizedSlotKey.error}`,
    );
  const slotKey = normalizedSlotKey?.ok === true ? normalizedSlotKey.key : void 0;
  const updated = await updateResolvedSessionEntry(
    {
      cfg: params.cfg,
      sessionKey: params.sessionKey,
    },
    (entry, context) => {
      const entryRecord = entry;
      const pluginExtensions = { ...entry.pluginExtensions };
      const pluginState = { ...pluginExtensions[pluginId] };
      if (params.unset === true) delete pluginState[namespace];
      else pluginState[namespace] = copyJsonValue(nextPluginValue);
      if (Object.keys(pluginState).length > 0) pluginExtensions[pluginId] = pluginState;
      else delete pluginExtensions[pluginId];
      if (Object.keys(pluginExtensions).length > 0) entry.pluginExtensions = pluginExtensions;
      else delete entry.pluginExtensions;
      const storedSlotKeys = { ...entry.pluginExtensionSlotKeys };
      const pluginSlotKeys = { ...storedSlotKeys[pluginId] };
      const previousSlotKey = normalizeSessionEntrySlotKey(pluginSlotKeys[namespace]);
      if (previousSlotKey.ok && previousSlotKey.key !== slotKey)
        delete entryRecord[previousSlotKey.key];
      if (slotKey && params.unset !== true) pluginSlotKeys[namespace] = slotKey;
      else delete pluginSlotKeys[namespace];
      if (Object.keys(pluginSlotKeys).length > 0) storedSlotKeys[pluginId] = pluginSlotKeys;
      else delete storedSlotKeys[pluginId];
      if (Object.keys(storedSlotKeys).length > 0) entry.pluginExtensionSlotKeys = storedSlotKeys;
      else delete entry.pluginExtensionSlotKeys;
      if (slotKey) {
        const projected = projectSessionExtensionValueForSlot({
          registration,
          sessionKey: context.canonicalKey,
          sessionId: entry.sessionId,
          nextValue: params.unset === true ? void 0 : nextPluginValue,
        });
        if (projected === void 0) delete entryRecord[slotKey];
        else entryRecord[slotKey] = projected;
      }
      entry.updatedAt = Date.now();
      return pluginState[namespace];
    },
  );
  if (!updated.found)
    return {
      ok: false,
      error: `unknown session key: ${params.sessionKey}`,
    };
  return {
    ok: true,
    key: updated.canonicalKey,
    value: updated.result,
  };
}
/**
 * Resolve the value that should be mirrored to `SessionEntry[slotKey]` for a
 * promoted session-extension namespace. Failures are swallowed so a
 * misbehaving projector cannot block the primary patch from being persisted.
 */
function projectSessionExtensionValueForSlot(params) {
  if (params.nextValue === void 0) return;
  const projected = projectSessionExtensionValue({
    pluginId: params.registration.pluginId,
    namespace: params.registration.extension.namespace,
    project: params.registration.extension.project,
    sessionKey: params.sessionKey,
    sessionId: params.sessionId,
    state: params.nextValue,
  });
  if (projected === PROJECTION_FAILED) return;
  if (isPromiseLike(projected)) {
    discardUnexpectedPromiseProjection(projected);
    return;
  }
  if (projected === void 0 || !isPluginJsonValue(projected)) return;
  return copyJsonValue(projected);
}
function collectPluginSessionExtensionProjections(params) {
  const extensions = getActivePluginSessionExtensionRegistry()?.sessionExtensions ?? [];
  if (extensions.length === 0) return [];
  const projections = [];
  for (const registration of extensions) {
    const state =
      params.entry.pluginExtensions?.[registration.pluginId]?.[registration.extension.namespace];
    if (state === void 0) continue;
    const projected = projectSessionExtensionValue({
      pluginId: registration.pluginId,
      namespace: registration.extension.namespace,
      project: registration.extension.project,
      sessionKey: params.sessionKey,
      sessionId: params.entry.sessionId,
      state,
    });
    if (projected === PROJECTION_FAILED) continue;
    if (isPromiseLike(projected)) {
      discardUnexpectedPromiseProjection(projected);
      continue;
    }
    if (projected !== void 0 && isPluginJsonValue(projected))
      projections.push({
        pluginId: registration.pluginId,
        namespace: registration.extension.namespace,
        value: copyJsonValue(projected),
      });
  }
  return projections;
}
function isPromiseLike(value) {
  return Boolean(value && typeof value.then === "function");
}
function discardUnexpectedPromiseProjection(value) {
  Promise.resolve(value).catch(() => void 0);
}
function projectSessionExtensionValue(params) {
  try {
    return params.project
      ? params.project({
          sessionKey: params.sessionKey,
          sessionId: params.sessionId,
          state: params.state,
        })
      : params.state;
  } catch (error) {
    log.warn(
      `plugin session extension projection failed: plugin=${params.pluginId} namespace=${params.namespace} error=${String(error)}`,
    );
    return PROJECTION_FAILED;
  }
}
function projectPluginSessionExtensionsSync(params) {
  return collectPluginSessionExtensionProjections(params);
}
//#endregion
//#region packages/media-generation-core/src/string.ts
/** Return unique trimmed strings while preserving first-seen order. */
function uniqueTrimmedStrings(values) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const value of values) {
    const normalized = normalizeOptionalString(value);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}
//#endregion
//#region packages/media-generation-core/src/catalog.ts
/** Return unique configured models with default model first when present. */
function uniqueModels(provider) {
  return uniqueTrimmedStrings([provider.defaultModel, ...(provider.models ?? [])]);
}
/** Synthesize static catalog entries from provider metadata. */
function synthesizeMediaGenerationCatalogEntries(params) {
  const defaultModel = uniqueTrimmedStrings([params.provider.defaultModel])[0];
  return uniqueModels(params.provider).map((model) => {
    const modelCatalogEntry = params.provider.catalogByModel?.[model];
    const entry = {
      kind: params.kind,
      provider: params.provider.id,
      model,
      source: "static",
      capabilities: modelCatalogEntry?.capabilities ?? params.provider.capabilities,
    };
    if (params.provider.label) entry.label = params.provider.label;
    if (model === defaultModel) entry.default = true;
    const modes = modelCatalogEntry?.modes ?? params.modes;
    if (modes) entry.modes = modes;
    return entry;
  });
}
/** Return unique model ids exposed by a media generation provider. */
function listMediaGenerationProviderModels(provider) {
  return uniqueModels(provider);
}
//#endregion
//#region packages/speech-core/voice-models.ts
function normalizeString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function normalizeLowercaseString(value) {
  return normalizeString(value)?.toLowerCase();
}
function normalizeTimeoutMs(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : void 0;
}
function parseVoiceModelRef(value) {
  const parsed = typeof value === "string" ? parseModelCatalogRef(value) : null;
  return parsed
    ? {
        provider: parsed.provider,
        model: parsed.modelId,
      }
    : void 0;
}
function sameProvider(left, right) {
  const normalizedLeft = normalizeLowercaseString(left);
  return Boolean(normalizedLeft && normalizedLeft === normalizeLowercaseString(right));
}
/** Match provider ids case-insensitively across canonical id and aliases. */
function providerMatchesId(provider, providerId) {
  return (
    sameProvider(provider.id, providerId) ||
    (provider.aliases ?? []).some((alias) => sameProvider(alias, providerId))
  );
}
/** Find the provider metadata for a configured provider id or alias. */
function findVoiceModelProvider(params) {
  return params.providers.find((provider) => providerMatchesId(provider, params.providerId));
}
/** Return true when a provider advertises the requested model. */
function voiceProviderSupportsModel(provider, model) {
  if (!provider) return false;
  const normalizedModel = normalizeString(model);
  return [provider.defaultModel, ...(provider.models ?? [])].some(
    (candidate) => normalizeString(candidate) === normalizedModel,
  );
}
/** Parse primary/fallback voice model refs from config. */
function resolveVoiceModelRefs(config) {
  const voiceModel = config;
  if (typeof voiceModel === "string") {
    const parsed = parseVoiceModelRef(voiceModel);
    return parsed ? [parsed] : [];
  }
  if (typeof voiceModel !== "object" || voiceModel === null || Array.isArray(voiceModel)) return [];
  const timeoutMs = normalizeTimeoutMs(voiceModel.timeoutMs);
  const refs = [];
  const addRef = (value) => {
    const parsed = parseVoiceModelRef(value);
    if (parsed)
      refs.push({
        ...parsed,
        ...(timeoutMs === void 0 ? {} : { timeoutMs }),
      });
  };
  addRef(voiceModel.primary);
  if (Array.isArray(voiceModel.fallbacks))
    for (const fallback of voiceModel.fallbacks) addRef(fallback);
  return refs;
}
/** Resolve configured voice model refs that are supported by known providers. */
function resolveSupportedVoiceModelRefs(params) {
  return resolveVoiceModelRefs(params.config).flatMap((ref) => {
    const provider = findVoiceModelProvider({
      providers: params.providers,
      providerId: ref.provider,
    });
    if (!provider || (params.providerId && !providerMatchesId(provider, params.providerId)))
      return [];
    return voiceProviderSupportsModel(provider, ref.model)
      ? [
          {
            ...ref,
            provider: provider.id,
          },
        ]
      : [];
  });
}
/** Build ordered provider candidates from primary provider plus voice-model fallbacks. */
function resolveVoiceProviderCandidates(params) {
  const primary =
    findVoiceModelProvider({
      providers: params.providers,
      providerId: params.primaryProvider,
    })?.id ?? params.primaryProvider;
  const candidates = [];
  const seenProviders = /* @__PURE__ */ new Set();
  const addCandidate = (candidate) => {
    candidates.push(candidate);
    seenProviders.add(candidate.provider);
  };
  const refs = resolveSupportedVoiceModelRefs({
    config: params.voiceModelConfig,
    providers: params.providers,
  });
  const primaryRefs = refs.filter((ref) => ref.provider === primary);
  for (const voiceModel of primaryRefs)
    addCandidate({
      provider: primary,
      voiceModel,
    });
  if (primaryRefs.length === 0) addCandidate({ provider: primary });
  for (const voiceModel of refs)
    if (voiceModel.provider !== primary)
      addCandidate({
        provider: voiceModel.provider,
        voiceModel,
      });
  for (const provider of params.providers)
    if (!seenProviders.has(provider.id)) addCandidate({ provider: provider.id });
  return candidates;
}
/** Resolve only the primary provider candidate for direct synthesis paths. */
function resolvePrimaryVoiceProviderCandidate(params) {
  const provider =
    findVoiceModelProvider({
      providers: params.providers,
      providerId: params.primaryProvider,
    })?.id ?? params.primaryProvider;
  const voiceModel = resolveSupportedVoiceModelRefs({
    config: params.voiceModelConfig,
    providers: params.providers,
    providerId: provider,
  })[0];
  return voiceModel
    ? {
        provider,
        voiceModel,
      }
    : { provider };
}
/** Read provider config by configured id, canonical id, or alias. */
function getVoiceProviderConfig(params) {
  const candidates = [
    normalizeString(params.configuredProviderId),
    params.provider.id,
    ...(params.provider.aliases ?? []),
  ].filter((key) => Boolean(key));
  const configuredKeys = Object.keys(params.providerConfigs);
  for (const candidate of candidates) {
    if (Object.hasOwn(params.providerConfigs, candidate))
      return params.providerConfigs[candidate] ?? {};
    const normalizedCandidate = normalizeLowercaseString(candidate);
    const matchingKey = configuredKeys.find(
      (key) => normalizeLowercaseString(key) === normalizedCandidate,
    );
    if (matchingKey) return params.providerConfigs[matchingKey] ?? {};
  }
  return {};
}
/** Convert provider metadata into static voice catalog entries. */
function synthesizeVoiceModelCatalogEntries(params) {
  const seen = /* @__PURE__ */ new Set();
  return [params.provider.defaultModel, ...(params.provider.models ?? [])]
    .flatMap((entry) => {
      const model = normalizeString(entry);
      if (!model || seen.has(model)) return [];
      seen.add(model);
      return [model];
    })
    .map((model) => {
      const entry = {
        kind: "voice",
        provider: params.provider.id,
        model,
        source: "static",
        capabilities: params.capabilities,
      };
      if (params.provider.label) entry.label = params.provider.label;
      if (model === params.provider.defaultModel) entry.default = true;
      if (params.modes) entry.modes = params.modes;
      return entry;
    });
}
//#endregion
//#region src/plugins/provider-catalog-result.ts
const MODEL_PROVIDER_CONFIG_KEYS = [
  "baseUrl",
  "apiKey",
  "auth",
  "api",
  "contextWindow",
  "contextTokens",
  "maxTokens",
  "timeoutSeconds",
  "region",
  "injectNumCtxForOpenAICompat",
  "params",
  "agentRuntime",
  "localService",
  "headers",
  "authHeader",
  "request",
];
const MODEL_DEFINITION_CONFIG_KEYS = [
  "api",
  "baseUrl",
  "reasoning",
  "input",
  "cost",
  "contextWindow",
  "contextTokens",
  "maxTokens",
  "thinkingLevelMap",
  "params",
  "agentRuntime",
  "headers",
  "compat",
  "mediaInput",
  "metadataSource",
];
/** Copies provider config data out of a provider catalog result. */
function copyProviderCatalogResultProjection(result) {
  const provider = copyProviderCatalogProviderConfig(readRecordValue(result, "provider"));
  if (provider)
    return {
      kind: "provider",
      provider,
    };
  const providers = copyRecordEntries(readRecordValue(result, "providers")).flatMap(
    ([providerId, providerConfig]) => {
      const copied = copyProviderCatalogProviderConfig(providerConfig);
      return copied ? [[providerId, copied]] : [];
    },
  );
  return providers.length > 0
    ? {
        kind: "providers",
        providers,
      }
    : { kind: "empty" };
}
/** Copies provider catalog result entries, using providerId for single-provider results. */
function copyProviderCatalogResultEntries(params) {
  const projection = copyProviderCatalogResultProjection(params.result);
  if (projection.kind === "provider") return [[params.providerId, projection.provider]];
  return projection.kind === "providers" ? projection.providers : [];
}
/** Copies model definitions from provider catalog provider config. */
function copyProviderCatalogModels(providerConfig) {
  return copyArrayEntries(readRecordValue(providerConfig, "models")).flatMap((entry) => {
    const copied = copyProviderCatalogModel(entry);
    return copied ? [copied] : [];
  });
}
function copyProviderCatalogModel(model) {
  if (!isRecordWithoutThrowing(model)) return;
  const id = readRecordValue(model, "id");
  const name = readRecordValue(model, "name");
  if (typeof id !== "string") return;
  const copied = {
    id,
    name: typeof name === "string" ? name : id,
  };
  for (const key of MODEL_DEFINITION_CONFIG_KEYS) {
    const value = readRecordValue(model, key);
    if (value !== void 0) copied[key] = value;
  }
  return copied;
}
/** Copies the supported provider config fields from a provider catalog result. */
function copyProviderCatalogProviderConfig(providerConfig) {
  if (!isRecordWithoutThrowing(providerConfig)) return;
  const baseUrl = readRecordValue(providerConfig, "baseUrl");
  if (typeof baseUrl !== "string") return;
  const copied = {
    baseUrl,
    models: copyProviderCatalogModels(providerConfig),
  };
  for (const key of MODEL_PROVIDER_CONFIG_KEYS) {
    if (key === "baseUrl") continue;
    const value = readRecordValue(providerConfig, key);
    if (value !== void 0) copied[key] = value;
  }
  return copied;
}
//#endregion
//#region src/plugins/provider-catalog-unified-text.ts
/** Projects plugin provider catalog results into unified text-model catalog rows. */
function projectProviderCatalogResultToUnifiedTextRows(params) {
  const rows = [];
  for (const [providerId, providerConfig] of copyProviderCatalogResultEntries(params))
    for (const model of copyProviderCatalogModels(providerConfig)) {
      const modelId = readRecordValue(model, "id");
      if (typeof modelId !== "string") continue;
      const modelName = readRecordValue(model, "name");
      rows.push({
        kind: "text",
        provider: providerId,
        model: modelId,
        ...(typeof modelName === "string" && modelName ? { label: modelName } : {}),
        source: params.source,
      });
    }
  return rows;
}
//#endregion
//#region src/plugins/model-catalog-registration.ts
function mergeCatalogHookResults(source, left, right) {
  const rows = [...(left ?? []), ...(right ?? [])];
  if (rows.length === 0) return null;
  const mergedRows = [];
  for (const row of rows)
    mergedRows.push({
      ...row,
      source,
    });
  return mergedRows;
}
function mergeModelCatalogHooks(source, left, right) {
  if (!left) return right;
  if (!right) return left;
  return async (ctx) => {
    const [leftRows, rightRows] = await Promise.all([left(ctx), right(ctx)]);
    return mergeCatalogHookResults(source, leftRows, rightRows);
  };
}
/** Creates handlers that register plugin model catalog providers into a registry. */
function createModelCatalogRegistrationHandlers(params) {
  const registerModelCatalogProvider = (record, provider) => {
    const providerId = normalizeOptionalString(provider.provider) ?? "";
    if (!providerId) {
      params.pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "model catalog provider registration missing provider",
      });
      return;
    }
    if (!provider.kinds || provider.kinds.length === 0) {
      params.pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `model catalog provider "${providerId}" registration missing kinds`,
      });
      return;
    }
    const existing = params.registry.modelCatalogProviders.find(
      (entry) => entry.provider.provider === providerId && entry.pluginId !== record.id,
    );
    if (existing) {
      params.pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `model catalog provider already registered: ${providerId} (${existing.pluginId})`,
      });
      return;
    }
    const normalizedKinds = uniqueValues(provider.kinds);
    const samePluginOverlapping = params.registry.modelCatalogProviders.find(
      (entry) =>
        entry.provider.provider === providerId &&
        entry.pluginId === record.id &&
        entry.provider.kinds.some((kind) => normalizedKinds.includes(kind)),
    );
    if (samePluginOverlapping) {
      samePluginOverlapping.provider = {
        ...samePluginOverlapping.provider,
        ...provider,
        provider: providerId,
        kinds: uniqueValues([...samePluginOverlapping.provider.kinds, ...normalizedKinds]),
        staticCatalog: mergeModelCatalogHooks(
          "static",
          samePluginOverlapping.provider.staticCatalog,
          provider.staticCatalog,
        ),
        liveCatalog: mergeModelCatalogHooks(
          "live",
          samePluginOverlapping.provider.liveCatalog,
          provider.liveCatalog,
        ),
      };
      return;
    }
    params.registry.modelCatalogProviders.push({
      pluginId: record.id,
      pluginName: record.name,
      provider: {
        ...provider,
        provider: providerId,
        kinds: normalizedKinds,
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerSynthesizedTextModelCatalogProvider = (registration) => {
    if (!registration.provider.catalog && !registration.provider.staticCatalog) return;
    registerModelCatalogProvider(registration.record, {
      provider: registration.provider.id,
      kinds: ["text"],
      ...(registration.provider.staticCatalog
        ? {
            staticCatalog: async (ctx) =>
              projectProviderCatalogResultToUnifiedTextRows({
                providerId: registration.provider.id,
                result: await registration.provider.staticCatalog.run(ctx),
                source: "static",
              }),
          }
        : {}),
      ...(registration.provider.catalog
        ? {
            liveCatalog: async (ctx) =>
              projectProviderCatalogResultToUnifiedTextRows({
                providerId: registration.provider.id,
                result: await registration.provider.catalog.run(ctx),
                source: "live",
              }),
          }
        : {}),
    });
  };
  const registerSynthesizedMediaModelCatalogProvider = (registration) => {
    registerModelCatalogProvider(registration.record, {
      provider: registration.provider.id,
      kinds: [registration.kind],
      staticCatalog: () =>
        synthesizeMediaGenerationCatalogEntries({
          kind: registration.kind,
          provider: registration.provider,
        }),
    });
  };
  const registerSynthesizedVoiceModelCatalogProvider = (registration) => {
    registerModelCatalogProvider(registration.record, {
      provider: registration.provider.id,
      kinds: ["voice"],
      staticCatalog: () =>
        synthesizeVoiceModelCatalogEntries({
          provider: registration.provider,
          capabilities: registration.capabilities,
          modes: registration.modes,
        }),
    });
  };
  return {
    registerModelCatalogProvider,
    registerSynthesizedTextModelCatalogProvider,
    registerSynthesizedMediaModelCatalogProvider,
    registerSynthesizedVoiceModelCatalogProvider,
  };
}
//#endregion
//#region src/plugins/registry-state.ts
/** Decode the public mode once so domain registrars do not repeat string checks. */
function resolvePluginRegistrationCapabilities(mode) {
  return {
    capabilityHandlers: mode === "full" || mode === "discovery" || mode === "tool-discovery",
    setupRuntimeHandlers: mode === "setup-runtime",
    runtimeChannel: mode !== "setup-only" && mode !== "tool-discovery",
  };
}
function normalizeHookTimeoutMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
  return Math.floor(value);
}
function resolveTypedHookTimeoutMs(params) {
  return (
    normalizeHookTimeoutMs(params.policy?.timeouts?.[params.hookName]) ??
    normalizeHookTimeoutMs(params.policy?.timeoutMs) ??
    normalizeHookTimeoutMs(params.opts?.timeoutMs)
  );
}
function createPluginRegistryState(registryParams) {
  const registry = createEmptyPluginRegistry();
  const coreGatewayMethodNames = Array.from(
    /* @__PURE__ */ new Set([
      ...(registryParams.coreGatewayMethodNames ?? []),
      ...Object.keys(registryParams.coreGatewayHandlers ?? {}),
    ]),
  ).toSorted();
  registry.coreGatewayMethodNames = coreGatewayMethodNames;
  const pushDiagnostic = (diagnostic) => {
    registry.diagnostics.push(diagnostic);
  };
  const modelCatalogRegistrars = createModelCatalogRegistrationHandlers({
    registry,
    pushDiagnostic,
  });
  return {
    registry,
    registryParams,
    coreGatewayMethods: new Set(coreGatewayMethodNames),
    getHostCronService: () => registryParams.hostServices?.cron,
    pluginHookRollback: /* @__PURE__ */ new Map(),
    pluginsWithChannelRegistrationConflict: /* @__PURE__ */ new Set(),
    pluginSideEffectGuards: /* @__PURE__ */ new Map(),
    pushDiagnostic,
    ...modelCatalogRegistrars,
  };
}
//#endregion
//#region src/plugins/registry-api.ts
function normalizeLogger(logger) {
  return {
    info: logger.info,
    warn: logger.warn,
    error: logger.error,
    debug: logger.debug,
  };
}
function resolvePluginPath(input, rootDir) {
  const trimmed = input.trim();
  if (!trimmed || path.isAbsolute(trimmed) || trimmed.startsWith("~"))
    return resolveUserPath(input);
  return rootDir ? path.resolve(rootDir, trimmed) : resolveUserPath(input);
}
function createPluginApiFactory(state, registrars, runtimeResolver) {
  const { registry, registryParams, getHostCronService, pluginSideEffectGuards, pushDiagnostic } =
    state;
  const {
    registerTool,
    registerHook,
    registerHttpRoute,
    registerHostedMediaResolver,
    registerProvider,
    registerWorkerProvider,
    registerModelCatalogProvider,
    registerEmbeddingProvider,
    registerAgentHarness,
    registerDetachedTaskRuntime,
    registerSpeechProvider,
    registerRealtimeTranscriptionProvider,
    registerRealtimeVoiceProvider,
    registerMediaUnderstandingProvider,
    registerTranscriptSourceProvider,
    registerImageGenerationProvider,
    registerVideoGenerationProvider,
    registerMusicGenerationProvider,
    registerWebFetchProvider,
    registerWebSearchProvider,
    registerMigrationProvider,
    registerGatewayMethod,
    registerSessionCatalog,
    registerService,
    registerGatewayDiscoveryService,
    registerCliBackend,
    registerTextTransforms,
    registerReload,
    registerNodeHostCommand,
    registerNodeInvokePolicy,
    registerSecurityAuditCollector,
    registerInteractiveHandler,
    registerConversationBindingResolvedHandler,
    registerCommand,
    registerContextEngine,
    registerCompactionProvider,
    registerCodexAppServerExtensionFactory,
    registerAgentToolResultMiddleware,
    registerSessionExtension,
    registerTrustedToolPolicy,
    registerToolMetadata,
    registerControlUiDescriptor,
    registerRuntimeLifecycle,
    registerAgentEventSubscription,
    registerSessionSchedulerJob,
    registerSessionAction,
    registerTypedHook,
    registerMemoryCapability,
    registerMemoryPromptSection,
    registerMemoryPromptSupplement,
    registerMemoryCorpusSupplement,
    registerMemoryFlushPlan,
    registerMemoryRuntime,
    registerMemoryEmbeddingProvider,
    registerCli,
    registerChannel,
  } = registrars;
  const { resolvePluginRuntime, setPluginRuntimeRecord } = runtimeResolver;
  const createPluginSideEffectGuard = (pluginId) => {
    const guard = { active: true };
    const guards = pluginSideEffectGuards.get(pluginId) ?? /* @__PURE__ */ new Set();
    guards.add(guard);
    pluginSideEffectGuards.set(pluginId, guards);
    return guard;
  };
  const deactivatePluginSideEffectGuards = (pluginId) => {
    const guards = pluginSideEffectGuards.get(pluginId);
    if (!guards) return;
    for (const guard of guards) guard.active = false;
    pluginSideEffectGuards.delete(pluginId);
  };
  const createApi = (record, params) => {
    const registrationMode = params.registrationMode ?? "full";
    const registrationCapabilities = resolvePluginRegistrationCapabilities(registrationMode);
    setPluginRuntimeRecord(record);
    const sideEffectGuard = createPluginSideEffectGuard(record.id);
    const isLoadedRecordInRegistry = () =>
      registry.plugins.some((plugin) => plugin.id === record.id && plugin.status === "loaded");
    const isLoadedRecordInActiveRegistry = () =>
      getActivePluginRegistry() === registry && isLoadedRecordInRegistry();
    const isActivatingLoadedRecord = () =>
      registryParams.activateGlobalSideEffects !== false &&
      record.enabled &&
      record.status === "loaded" &&
      !registry.plugins.some((plugin) => plugin.id === record.id);
    const shouldCommitWorkflowSideEffect = () =>
      sideEffectGuard.active &&
      !isPluginRegistryRetired(registry) &&
      (isActivatingLoadedRecord() ||
        (isPluginRegistryActivated(registry) && isLoadedRecordInRegistry()));
    return buildPluginApi({
      id: record.id,
      name: record.name,
      version: record.version,
      description: record.description,
      source: record.source,
      rootDir: record.rootDir,
      registrationMode,
      config: params.config,
      pluginConfig: params.pluginConfig,
      runtime: resolvePluginRuntime(record.id),
      logger: normalizeLogger(registryParams.logger),
      resolvePath: (input) => resolvePluginPath(input, record.rootDir),
      handlers: {
        ...(registrationCapabilities.capabilityHandlers
          ? {
              registerTool: (tool, opts) => registerTool(record, tool, opts),
              registerHook: (events, handler, opts) =>
                registerHook(record, events, handler, opts, params.config, params.pluginConfig),
              registerHttpRoute: (routeParams) => registerHttpRoute(record, routeParams),
              registerHostedMediaResolver: (resolver) =>
                registerHostedMediaResolver(record, resolver),
              registerProvider: (provider) => registerProvider(record, provider),
              registerWorkerProvider: (provider) => registerWorkerProvider(record, provider),
              registerModelCatalogProvider: (provider) =>
                registerModelCatalogProvider(record, provider),
              registerEmbeddingProvider: (provider) => registerEmbeddingProvider(record, provider),
              registerAgentHarness: (harness) => registerAgentHarness(record, harness),
              registerDetachedTaskRuntime: (runtime) =>
                registerDetachedTaskRuntime(record, runtime),
              registerSpeechProvider: (provider) => registerSpeechProvider(record, provider),
              registerRealtimeTranscriptionProvider: (provider) =>
                registerRealtimeTranscriptionProvider(record, provider),
              registerRealtimeVoiceProvider: (provider) =>
                registerRealtimeVoiceProvider(record, provider),
              registerMediaUnderstandingProvider: (provider) =>
                registerMediaUnderstandingProvider(record, provider),
              registerTranscriptSourceProvider: (provider) =>
                registerTranscriptSourceProvider(record, provider),
              registerImageGenerationProvider: (provider) =>
                registerImageGenerationProvider(record, provider),
              registerVideoGenerationProvider: (provider) =>
                registerVideoGenerationProvider(record, provider),
              registerMusicGenerationProvider: (provider) =>
                registerMusicGenerationProvider(record, provider),
              registerWebFetchProvider: (provider) => registerWebFetchProvider(record, provider),
              registerWebSearchProvider: (provider) => registerWebSearchProvider(record, provider),
              registerMigrationProvider: (provider) => registerMigrationProvider(record, provider),
              registerGatewayMethod: (method, handler, opts) =>
                registerGatewayMethod(record, method, handler, opts),
              registerSessionCatalog: (provider) => registerSessionCatalog(record, provider),
              registerService: (service) => registerService(record, service),
              registerGatewayDiscoveryService: (service) =>
                registerGatewayDiscoveryService(record, service),
              registerCliBackend: (backend) => registerCliBackend(record, backend),
              registerTextTransforms: (transforms) => registerTextTransforms(record, transforms),
              registerReload: (registration) => registerReload(record, registration),
              registerNodeHostCommand: (command) => registerNodeHostCommand(record, command),
              registerNodeInvokePolicy: (policy) =>
                registerNodeInvokePolicy(record, policy, params.pluginConfig),
              registerSecurityAuditCollector: (collector) =>
                registerSecurityAuditCollector(record, collector),
              registerInteractiveHandler: (registration) =>
                registerInteractiveHandler(record, registration),
              onConversationBindingResolved: (handler) =>
                registerConversationBindingResolvedHandler(record, handler),
              registerCommand: (command) => registerCommand(record, command),
              registerContextEngine: (id, factory) =>
                registerContextEngine(record, id, factory, registrationMode),
              registerCompactionProvider: (provider) =>
                registerCompactionProvider(record, provider),
              registerCodexAppServerExtensionFactory: (factory) => {
                registerCodexAppServerExtensionFactory(record, factory);
              },
              registerAgentToolResultMiddleware: (handler, options) => {
                registerAgentToolResultMiddleware(record, handler, options);
              },
              registerSessionExtension: (extension) => registerSessionExtension(record, extension),
              enqueueNextTurnInjection: (injection) => {
                if (params.hookPolicy?.allowPromptInjection === false) {
                  pushDiagnostic({
                    level: "warn",
                    pluginId: record.id,
                    source: record.source,
                    message: `next-turn injection blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`,
                  });
                  return Promise.resolve({
                    enqueued: false,
                    id: "",
                    sessionKey: injection.sessionKey,
                  });
                }
                return enqueuePluginNextTurnInjection({
                  cfg: registryParams.runtime.config.current(),
                  pluginId: record.id,
                  pluginName: record.name,
                  injection,
                });
              },
              registerTrustedToolPolicy: (policy) => registerTrustedToolPolicy(record, policy),
              registerToolMetadata: (metadata) => registerToolMetadata(record, metadata),
              registerControlUiDescriptor: (descriptor) =>
                registerControlUiDescriptor(record, descriptor),
              registerRuntimeLifecycle: (lifecycle) => registerRuntimeLifecycle(record, lifecycle),
              registerAgentEventSubscription: (subscription) =>
                registerAgentEventSubscription(record, subscription),
              emitAgentEvent: (event) => {
                if (registryParams.activateGlobalSideEffects === false)
                  return {
                    emitted: false,
                    reason: "global side effects disabled",
                  };
                if (!shouldCommitWorkflowSideEffect())
                  return {
                    emitted: false,
                    reason: "plugin is not loaded",
                  };
                return emitPluginAgentEvent({
                  pluginId: record.id,
                  pluginName: record.name,
                  origin: record.origin,
                  event,
                });
              },
              setRunContext: (patch) =>
                registryParams.activateGlobalSideEffects !== false &&
                shouldCommitWorkflowSideEffect()
                  ? setPluginRunContext({
                      pluginId: record.id,
                      patch,
                    })
                  : false,
              getRunContext: (get) =>
                getPluginRunContext({
                  pluginId: record.id,
                  get,
                }),
              clearRunContext: (paramsLocal) => {
                if (
                  registryParams.activateGlobalSideEffects === false ||
                  !shouldCommitWorkflowSideEffect()
                )
                  return;
                clearPluginRunContext({
                  pluginId: record.id,
                  runId: paramsLocal.runId,
                  namespace: paramsLocal.namespace,
                });
              },
              registerSessionSchedulerJob: (job) => registerSessionSchedulerJob(record, job),
              registerSessionAction: (action) => registerSessionAction(record, action),
              sendSessionAttachment: async (attachment) => {
                if (registryParams.activateGlobalSideEffects === false)
                  return {
                    ok: false,
                    error: "global side effects disabled",
                  };
                try {
                  if (!isLoadedRecordInActiveRegistry())
                    return {
                      ok: false,
                      error: "plugin is not loaded",
                    };
                  const runtimeConfig = registryParams.runtime.config?.current?.() ?? params.config;
                  return await sendPluginSessionAttachment({
                    ...attachment,
                    config: runtimeConfig,
                    origin: record.origin,
                  });
                } catch (error) {
                  return {
                    ok: false,
                    error: `attachment delivery setup failed: ${formatErrorMessage(error)}`,
                  };
                }
              },
              scheduleSessionTurn: async (schedule) => {
                if (registryParams.activateGlobalSideEffects === false) return;
                await Promise.resolve();
                return schedulePluginSessionTurn({
                  pluginId: record.id,
                  pluginName: record.name,
                  origin: record.origin,
                  schedule,
                  cron: getHostCronService(),
                  shouldCommit: isLoadedRecordInActiveRegistry,
                  ownerRegistry: registry,
                });
              },
              unscheduleSessionTurnsByTag: async (request) => {
                if (registryParams.activateGlobalSideEffects === false)
                  return {
                    removed: 0,
                    failed: 0,
                  };
                await Promise.resolve();
                if (!isLoadedRecordInActiveRegistry())
                  return {
                    removed: 0,
                    failed: 0,
                  };
                return unschedulePluginSessionTurnsByTag({
                  pluginId: record.id,
                  origin: record.origin,
                  cron: getHostCronService(),
                  request,
                });
              },
              registerMemoryCapability: (capability) =>
                registerMemoryCapability(record, capability),
              registerMemoryPromptSection: (builder) =>
                registerMemoryPromptSection(record, builder),
              registerMemoryPromptSupplement: (builder) =>
                registerMemoryPromptSupplement(record, builder),
              registerMemoryCorpusSupplement: (supplement) =>
                registerMemoryCorpusSupplement(record, supplement),
              registerMemoryFlushPlan: (resolver) => registerMemoryFlushPlan(record, resolver),
              registerMemoryRuntime: (runtime) => registerMemoryRuntime(record, runtime),
              registerMemoryEmbeddingProvider: (adapter) =>
                registerMemoryEmbeddingProvider(record, adapter),
              on: (hookName, handler, opts) =>
                registerTypedHook(record, hookName, handler, opts, params.hookPolicy),
            }
          : {}),
        ...(registrationCapabilities.setupRuntimeHandlers
          ? {
              registerHttpRoute: (routeParams) => registerHttpRoute(record, routeParams),
              registerGatewayMethod: (method, handler, opts) =>
                registerGatewayMethod(record, method, handler, opts),
              registerSessionCatalog: (provider) => registerSessionCatalog(record, provider),
            }
          : {}),
        registerCli: (registrar, opts) => registerCli(record, registrar, opts),
        registerChannel: (registration) => registerChannel(record, registration, registrationMode),
      },
    });
  };
  return {
    createApi,
    deactivatePluginSideEffectGuards,
  };
}
//#endregion
//#region src/plugins/registry-registrars-capabilities.ts
function createCapabilityRegistrars(state) {
  const { registry, pushDiagnostic } = state;
  const registerDetachedTaskRuntime = (record, runtime) => {
    const existing = getDetachedTaskLifecycleRuntimeRegistration();
    if (existing && existing.pluginId !== record.id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `detached task runtime already registered by ${existing.pluginId}`,
      });
      return;
    }
    registerDetachedTaskLifecycleRuntime(record.id, runtime);
  };
  const registerInteractiveHandler = (record, registration) => {
    const result = registerRegistryPluginInteractiveHandler(record.id, registration, {
      pluginName: record.name,
      pluginRoot: record.rootDir,
    });
    if (!result.ok) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: result.error ?? "interactive handler registration failed",
      });
      return;
    }
    registry.interactiveHandlers.push({
      ...registration,
      pluginId: record.id,
      pluginName: record.name,
      pluginRoot: record.rootDir,
    });
  };
  const registerContextEngine = (record, id, factory, registrationMode) => {
    const normalizedId = normalizeOptionalString(id) ?? "";
    if (!normalizedId) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "context engine registration missing id",
      });
      return;
    }
    if (typeof factory !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `context engine "${normalizedId}" registration missing factory`,
      });
      return;
    }
    if (normalizedId === defaultSlotIdForKey("contextEngine")) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `context engine id reserved by core: ${normalizedId}`,
      });
      return;
    }
    const result = registerContextEngineForOwner(normalizedId, factory, `plugin:${record.id}`, {
      allowSameOwnerRefresh: true,
      lifecycle: registrationMode === "full" ? "runtime" : "readOnlyDiscovery",
    });
    if (!result.ok) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `context engine already registered: ${normalizedId} (${result.existingOwner})`,
      });
      return;
    }
    if (!record.contextEngineIds?.includes(normalizedId))
      record.contextEngineIds = [...(record.contextEngineIds ?? []), normalizedId];
  };
  const registerCompactionProvider$1 = (record, provider) => {
    const id = normalizeOptionalString(provider?.id);
    if (!id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "compaction provider registration missing id",
      });
      return;
    }
    if (typeof provider?.summarize !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `compaction provider "${id}" registration missing summarize`,
      });
      return;
    }
    const existing = getRegisteredCompactionProvider(id);
    if (existing) {
      const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `compaction provider already registered: ${id}${ownerDetail}`,
      });
      return;
    }
    registerCompactionProvider(provider, { ownerPluginId: record.id });
  };
  return {
    registerDetachedTaskRuntime,
    registerInteractiveHandler,
    registerContextEngine,
    registerCompactionProvider: registerCompactionProvider$1,
  };
}
//#endregion
//#region src/plugins/registry-registrars-host.ts
const controlUiSurfaces = /* @__PURE__ */ new Set(["session", "tool", "run", "settings", "tab"]);
function normalizeHostHookString(value) {
  return typeof value === "string" ? normalizePluginHostHookId(value) : "";
}
function normalizeOptionalHostHookString(value) {
  if (value === void 0) return;
  if (typeof value !== "string") return "";
  return value.trim();
}
function normalizeHostHookStringList(value) {
  if (value === void 0) return;
  if (!Array.isArray(value)) return null;
  const normalized = value.map((item) => normalizeOptionalHostHookString(item));
  if (normalized.some((item) => !item)) return null;
  return normalized;
}
function createHostRegistrars(state) {
  const { registry, registryParams, pushDiagnostic } = state;
  const validateSessionActionSchema = (record, id, schema) => {
    if (schema === void 0) return true;
    if (!isPluginJsonValue(schema)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `session action schema must be JSON-compatible: ${id}`,
      });
      return false;
    }
    if (
      typeof schema !== "boolean" &&
      (!schema || typeof schema !== "object" || Array.isArray(schema))
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `session action schema must be a JSON schema object or boolean: ${id}`,
      });
      return false;
    }
    try {
      validateJsonSchemaValue({
        schema,
        cacheKey: `plugin-session-action-registration:${record.id}:${id}`,
        value: void 0,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `session action schema is not valid JSON Schema: ${id}: ${message}`,
      });
      return false;
    }
    return true;
  };
  const registerSessionExtension = (record, extension) => {
    const namespace = normalizeHostHookString(extension.namespace);
    const description = normalizeHostHookString(extension.description);
    const project = extension.project;
    let normalizedSessionEntrySlotKey;
    let invalidMessage;
    if (!namespace || !description)
      invalidMessage = "session extension registration requires namespace and description";
    else if (project !== void 0 && typeof project !== "function")
      invalidMessage = "session extension projector must be a function";
    else if (project?.constructor?.name === "AsyncFunction")
      invalidMessage = "session extension projector must be synchronous";
    else if (extension.cleanup !== void 0 && typeof extension.cleanup !== "function")
      invalidMessage = "session extension cleanup must be a function";
    else if (extension.sessionEntrySlotKey !== void 0) {
      const slotKey = normalizeSessionEntrySlotKey(extension.sessionEntrySlotKey);
      if (!slotKey.ok) invalidMessage = slotKey.error;
      else normalizedSessionEntrySlotKey = slotKey.key;
    }
    if (invalidMessage) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: invalidMessage,
      });
      return;
    }
    if (
      registry.sessionExtensions.find(
        (entry) => entry.pluginId === record.id && entry.extension.namespace === namespace,
      )
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `session extension already registered: ${namespace}`,
      });
      return;
    }
    if (normalizedSessionEntrySlotKey) {
      if (
        registry.sessionExtensions.find((entry) => {
          const existingSlotKey = entry.extension.sessionEntrySlotKey;
          if (existingSlotKey === void 0) return false;
          const normalizedExistingSlotKey = normalizeSessionEntrySlotKey(existingSlotKey);
          return (
            normalizedExistingSlotKey.ok &&
            normalizedExistingSlotKey.key === normalizedSessionEntrySlotKey
          );
        })
      ) {
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `sessionEntrySlotKey already registered: ${normalizedSessionEntrySlotKey}`,
        });
        return;
      }
    }
    registry.sessionExtensions.push({
      pluginId: record.id,
      pluginName: record.name,
      extension: {
        ...extension,
        namespace,
        description,
        ...(normalizedSessionEntrySlotKey
          ? { sessionEntrySlotKey: normalizedSessionEntrySlotKey }
          : {}),
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerTrustedToolPolicy = (record, policy) => {
    if (!policy || typeof policy !== "object") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "trusted tool policy registration requires id, description, and evaluate()",
      });
      return;
    }
    const id = normalizeHostHookString(policy.id);
    const description = normalizeHostHookString(policy.description);
    if (!id || !description || typeof policy.evaluate !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "trusted tool policy registration requires id, description, and evaluate()",
      });
      return;
    }
    if (
      record.origin !== "bundled" &&
      !(record.contracts?.trustedToolPolicies ?? []).includes(id)
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `plugin must declare contracts.trustedToolPolicies for: ${id}`,
      });
      return;
    }
    if (record.origin !== "bundled" && !(record.enabled && record.explicitlyEnabled === true)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `plugin must be explicitly enabled to register trusted tool policy: ${id}`,
      });
      return;
    }
    const policies = registry.trustedToolPolicies;
    const existing = policies.find(
      (entry) => entry.pluginId === record.id && entry.policy.id === id,
    );
    if (existing) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `trusted tool policy already registered: ${id} (${existing.pluginId})`,
      });
      return;
    }
    const registration = {
      pluginId: record.id,
      pluginName: record.name,
      policy: {
        ...policy,
        id,
        description,
      },
      origin: record.origin,
      source: record.source,
      rootDir: record.rootDir,
    };
    if (record.origin === "bundled") {
      const firstInstalledPolicyIndex = policies.findIndex((entry) => entry.origin !== "bundled");
      if (firstInstalledPolicyIndex === -1) policies.push(registration);
      else policies.splice(firstInstalledPolicyIndex, 0, registration);
      return;
    }
    policies.push(registration);
  };
  const registerToolMetadata = (record, metadata) => {
    const toolName = normalizeHostHookString(metadata.toolName);
    if (!toolName) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "tool metadata registration missing toolName",
      });
      return;
    }
    const undeclared = findUndeclaredPluginToolNames({
      declaredNames: normalizePluginToolContractNames(record.contracts),
      toolNames: [toolName],
    });
    if (undeclared.length > 0) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `plugin must declare contracts.tools for tool metadata: ${undeclared.join(", ")}`,
      });
      return;
    }
    const existing = registry.toolMetadata.find(
      (entry) => entry.pluginId === record.id && entry.metadata.toolName === toolName,
    );
    if (existing) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `tool metadata already registered: ${toolName} (${existing.pluginId})`,
      });
      return;
    }
    const displayName = normalizeOptionalHostHookString(metadata.displayName);
    const description = normalizeOptionalHostHookString(metadata.description);
    const tags = normalizeHostHookStringList(metadata.tags);
    if (
      displayName === "" ||
      description === "" ||
      tags === null ||
      (metadata.risk !== void 0 && !["low", "medium", "high"].includes(metadata.risk))
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `tool metadata registration has invalid metadata: ${toolName}`,
      });
      return;
    }
    registry.toolMetadata.push({
      pluginId: record.id,
      pluginName: record.name,
      metadata: {
        ...metadata,
        toolName,
        ...(displayName !== void 0 ? { displayName } : {}),
        ...(description !== void 0 ? { description } : {}),
        ...(tags !== void 0 ? { tags } : {}),
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerControlUiDescriptor = (record, descriptor) => {
    const legacyDescriptor = descriptor;
    const id = normalizeHostHookString(descriptor.id);
    const label = normalizeHostHookString(descriptor.label ?? legacyDescriptor.name);
    const description = normalizeOptionalHostHookString(descriptor.description);
    const placement = normalizeOptionalHostHookString(descriptor.placement);
    const requiredScopes = normalizeHostHookStringList(descriptor.requiredScopes);
    const surface = typeof descriptor.surface === "string" ? descriptor.surface : "session";
    if (
      !id ||
      !label ||
      !controlUiSurfaces.has(surface) ||
      description === "" ||
      placement === "" ||
      requiredScopes === null
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message:
          "control UI descriptor registration requires id, surface, label, and valid optional fields",
      });
      return;
    }
    if (requiredScopes !== void 0) {
      const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
      if (unknownScope !== void 0) {
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `control UI descriptor requiredScopes contains unknown operator scope: ${unknownScope}`,
        });
        return;
      }
    }
    if (descriptor.schema !== void 0 && !isPluginJsonValue(descriptor.schema)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `control UI descriptor schema must be JSON-compatible: ${id}`,
      });
      return;
    }
    if (
      registry.controlUiDescriptors.find(
        (entry) => entry.pluginId === record.id && entry.descriptor.id === id,
      )
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `control UI descriptor already registered: ${id}`,
      });
      return;
    }
    const icon = normalizeOptionalHostHookString(descriptor.icon);
    const tabPath = normalizeOptionalHostHookString(descriptor.path);
    if (
      !(
        tabPath === void 0 ||
        (tabPath.startsWith("/") && !tabPath.startsWith("//") && !tabPath.startsWith("/\\"))
      )
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `control UI descriptor path must be a gateway-local absolute path: ${id}`,
      });
      return;
    }
    const group =
      descriptor.group === "control" || descriptor.group === "agent" ? descriptor.group : void 0;
    const order =
      typeof descriptor.order === "number" && Number.isFinite(descriptor.order)
        ? descriptor.order
        : void 0;
    registry.controlUiDescriptors.push({
      pluginId: record.id,
      pluginName: record.name,
      descriptor: {
        ...descriptor,
        id,
        surface,
        label,
        ...(description !== void 0 ? { description } : {}),
        ...(placement !== void 0 ? { placement } : {}),
        ...(requiredScopes !== void 0 ? { requiredScopes } : {}),
        icon,
        path: tabPath,
        group,
        order,
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerRuntimeLifecycle = (record, lifecycle) => {
    const id = normalizePluginHostHookId(lifecycle.id);
    if (!id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "runtime lifecycle registration missing id",
      });
      return;
    }
    if (
      registry.runtimeLifecycles.find(
        (entry) => entry.pluginId === record.id && entry.lifecycle.id === id,
      )
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `runtime lifecycle already registered: ${id}`,
      });
      return;
    }
    if (lifecycle.cleanup !== void 0 && typeof lifecycle.cleanup !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `runtime lifecycle cleanup must be a function: ${id}`,
      });
      return;
    }
    registry.runtimeLifecycles.push({
      pluginId: record.id,
      pluginName: record.name,
      lifecycle: {
        ...lifecycle,
        id,
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerAgentEventSubscription = (record, subscription) => {
    const id = normalizePluginHostHookId(subscription.id);
    if (!id || typeof subscription.handle !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "agent event subscription registration requires id and handle",
      });
      return;
    }
    const streams = normalizeHostHookStringList(subscription.streams);
    if (streams === null) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `agent event subscription streams must be an array of strings: ${id}`,
      });
      return;
    }
    if (
      registry.agentEventSubscriptions.find(
        (entry) => entry.pluginId === record.id && entry.subscription.id === id,
      )
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `agent event subscription already registered: ${id}`,
      });
      return;
    }
    registry.agentEventSubscriptions.push({
      pluginId: record.id,
      pluginName: record.name,
      subscription: {
        ...subscription,
        id,
        ...(streams !== void 0 ? { streams } : {}),
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerSessionSchedulerJob = (record, job) => {
    const jobId = normalizeHostHookString(job.id);
    const sessionKey = normalizeHostHookString(job.sessionKey);
    const kind = normalizeHostHookString(job.kind);
    if (
      jobId &&
      registry.sessionSchedulerJobs.some(
        (entry) => entry.pluginId === record.id && entry.job.id === jobId,
      )
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `session scheduler job already registered: ${jobId}`,
      });
      return;
    }
    if (!jobId || !sessionKey || !kind) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "session scheduler job registration requires unique id, sessionKey, and kind",
      });
      return;
    }
    if (job.cleanup !== void 0 && typeof job.cleanup !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `session scheduler job cleanup must be a function: ${jobId}`,
      });
      return;
    }
    if (registryParams.activateGlobalSideEffects === false) {
      registry.sessionSchedulerJobs.push({
        pluginId: record.id,
        pluginName: record.name,
        job: {
          ...job,
          id: jobId,
          sessionKey,
          kind,
        },
        source: record.source,
        rootDir: record.rootDir,
      });
      return {
        id: jobId,
        pluginId: record.id,
        sessionKey,
        kind,
      };
    }
    const handle = registerPluginSessionSchedulerJob({
      pluginId: record.id,
      pluginName: record.name,
      ownerRegistry: registry,
      job: {
        ...job,
        id: jobId,
        sessionKey,
        kind,
      },
    });
    if (!handle) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "session scheduler job registration requires unique id, sessionKey, and kind",
      });
      return;
    }
    registry.sessionSchedulerJobs.push({
      pluginId: record.id,
      pluginName: record.name,
      job: {
        ...job,
        id: handle.id,
        sessionKey: handle.sessionKey,
        kind: handle.kind,
      },
      generation: getPluginSessionSchedulerJobGeneration({
        pluginId: record.id,
        jobId: handle.id,
        sessionKey: handle.sessionKey,
      }),
      source: record.source,
      rootDir: record.rootDir,
    });
    return handle;
  };
  const registerSessionAction = (record, action) => {
    const id = normalizeHostHookString(action.id);
    const description = normalizeOptionalHostHookString(action.description);
    const requiredScopes = normalizeHostHookStringList(action.requiredScopes);
    if (
      !id ||
      description === "" ||
      requiredScopes === null ||
      typeof action.handler !== "function"
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "session action registration requires id, handler, and valid optional fields",
      });
      return;
    }
    if (requiredScopes !== void 0) {
      const unknownScope = requiredScopes.find((scope) => !isOperatorScope(scope));
      if (unknownScope !== void 0) {
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `session action requiredScopes contains unknown operator scope: ${unknownScope}`,
        });
        return;
      }
    }
    if (!validateSessionActionSchema(record, id, action.schema)) return;
    if (
      registry.sessionActions.find(
        (entry) => entry.pluginId === record.id && entry.action.id === id,
      )
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `session action already registered: ${id}`,
      });
      return;
    }
    registry.sessionActions.push({
      pluginId: record.id,
      pluginName: record.name,
      action: {
        ...action,
        id,
        ...(description !== void 0 ? { description } : {}),
        ...(requiredScopes !== void 0 ? { requiredScopes } : {}),
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerConversationBindingResolvedHandler = (record, handler) => {
    registry.conversationBindingResolvedHandlers.push({
      pluginId: record.id,
      pluginName: record.name,
      pluginRoot: record.rootDir,
      handler,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  return {
    registerSessionExtension,
    registerTrustedToolPolicy,
    registerToolMetadata,
    registerControlUiDescriptor,
    registerRuntimeLifecycle,
    registerAgentEventSubscription,
    registerSessionSchedulerJob,
    registerSessionAction,
    registerConversationBindingResolvedHandler,
  };
}
//#endregion
//#region src/plugins/registry-registrars-memory.ts
function createMemoryRegistrars(state) {
  const { registry, pushDiagnostic } = state;
  const requireMemorySlot = (record, surface) => {
    if (!hasKind(record.kind, "memory"))
      throw new Error(`only memory plugins can register a memory ${surface}`);
    if (Array.isArray(record.kind) && record.kind.length > 1 && !record.memorySlotSelected) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: `dual-kind plugin not selected for memory slot; skipping memory ${surface} registration`,
      });
      return false;
    }
    return true;
  };
  const registerMemoryCapability$1 = (record, capability) => {
    if (requireMemorySlot(record, "capability")) registerMemoryCapability(record.id, capability);
  };
  const registerMemoryPromptSection = (record, builder) => {
    if (requireMemorySlot(record, "prompt section"))
      registerMemoryPromptSectionForPlugin(record.id, builder);
  };
  const registerMemoryPromptSupplement$1 = (record, builder) => {
    if (typeof builder !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "memory prompt supplement registration missing builder",
      });
      return;
    }
    registerMemoryPromptSupplement(record.id, builder);
  };
  const registerMemoryCorpusSupplement$1 = (record, supplement) => {
    registerMemoryCorpusSupplement(record.id, supplement);
  };
  const registerMemoryFlushPlan = (record, resolver) => {
    if (requireMemorySlot(record, "flush plan"))
      registerMemoryFlushPlanResolverForPlugin(record.id, resolver);
  };
  const registerMemoryRuntime = (record, runtime) => {
    if (requireMemorySlot(record, "runtime")) registerMemoryRuntimeForPlugin(record.id, runtime);
  };
  const registerMemoryEmbeddingProvider$1 = (record, adapter) => {
    if (hasKind(record.kind, "memory")) {
      if (!requireMemorySlot(record, "embedding provider")) return;
    } else if (!(record.contracts?.memoryEmbeddingProviders ?? []).includes(adapter.id)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `plugin must own memory slot or declare contracts.memoryEmbeddingProviders for adapter: ${adapter.id}`,
      });
      return;
    }
    const existing = getRegisteredMemoryEmbeddingProvider(adapter.id);
    if (existing) {
      const ownerDetail = existing.ownerPluginId ? ` (owner: ${existing.ownerPluginId})` : "";
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `memory embedding provider already registered: ${adapter.id}${ownerDetail}`,
      });
      return;
    }
    registerMemoryEmbeddingProvider(adapter, { ownerPluginId: record.id });
    registry.memoryEmbeddingProviders.push({
      pluginId: record.id,
      pluginName: record.name,
      provider: adapter,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  return {
    registerMemoryCapability: registerMemoryCapability$1,
    registerMemoryPromptSection,
    registerMemoryPromptSupplement: registerMemoryPromptSupplement$1,
    registerMemoryCorpusSupplement: registerMemoryCorpusSupplement$1,
    registerMemoryFlushPlan,
    registerMemoryRuntime,
    registerMemoryEmbeddingProvider: registerMemoryEmbeddingProvider$1,
  };
}
//#endregion
//#region src/plugins/validation-diagnostics.ts
/** Pushes a normalized plugin validation diagnostic. */
function pushPluginValidationDiagnostic(params) {
  params.pushDiagnostic({
    level: params.level,
    pluginId: params.pluginId,
    source: params.source,
    message: params.message,
  });
}
//#endregion
//#region src/plugins/channel-validation.ts
function resolveBundledChannelMeta(id) {
  return (
    listChatChannels().find((meta) => meta?.id === id) ?? resolveGeneratedBundledChannelMeta(id)
  );
}
function resolveGeneratedBundledChannelMeta(id) {
  const channel = GENERATED_BUNDLED_CHANNEL_CONFIG_METADATA.find(
    (entry) => entry.channelId === id && entry.configurable !== false,
  );
  const label = normalizeOptionalString(channel?.label);
  if (!channel || !label) return;
  return {
    id,
    label,
    selectionLabel: label,
    docsPath: `/channels/${id}`,
    blurb: normalizeOptionalString(channel.description) ?? "",
  };
}
function collectMissingChannelMetaFields(meta) {
  const missing = [];
  if (!normalizeOptionalString(meta?.label)) missing.push("label");
  if (!normalizeOptionalString(meta?.selectionLabel)) missing.push("selectionLabel");
  if (!normalizeOptionalString(meta?.docsPath)) missing.push("docsPath");
  if (typeof meta?.blurb !== "string") missing.push("blurb");
  return missing;
}
/** Validates and normalizes a channel plugin registration before runtime catalog insertion. */
function normalizeRegisteredChannelPlugin(params) {
  const id =
    normalizeOptionalString(params.plugin?.id) ??
    normalizeStringifiedOptionalString(params.plugin?.id) ??
    "";
  if (!id) {
    pushPluginValidationDiagnostic({
      level: "error",
      pluginId: params.pluginId,
      source: params.source,
      message: "channel registration missing id",
      pushDiagnostic: params.pushDiagnostic,
    });
    return null;
  }
  if (
    typeof params.plugin.config?.listAccountIds !== "function" ||
    typeof params.plugin.config?.resolveAccount !== "function"
  ) {
    pushPluginValidationDiagnostic({
      level: "error",
      pluginId: params.pluginId,
      source: params.source,
      message: `channel "${id}" registration missing required config helpers`,
      pushDiagnostic: params.pushDiagnostic,
    });
    return null;
  }
  const rawMeta = params.plugin.meta;
  const rawMetaId = normalizeOptionalString(rawMeta?.id);
  if (rawMetaId && rawMetaId !== id)
    pushPluginValidationDiagnostic({
      level: "warn",
      pluginId: params.pluginId,
      source: params.source,
      message: `channel "${id}" meta.id mismatch ("${rawMetaId}"); using registered channel id`,
      pushDiagnostic: params.pushDiagnostic,
    });
  const missingFields = collectMissingChannelMetaFields(rawMeta);
  if (missingFields.length > 0)
    pushPluginValidationDiagnostic({
      level: "warn",
      pluginId: params.pluginId,
      source: params.source,
      message: `channel "${id}" registered incomplete metadata; filled missing ${missingFields.join(", ")}`,
      pushDiagnostic: params.pushDiagnostic,
    });
  return {
    ...params.plugin,
    id,
    meta: normalizeChannelMeta({
      id,
      meta: rawMeta,
      existing: resolveBundledChannelMeta(id),
    }),
  };
}
//#endregion
//#region src/plugins/registry-registrars-network.ts
const GATEWAY_METHOD_DISPATCH_CONTRACT = "authenticated-request";
function adaptPluginGatewayMethodHandler(handler) {
  return async (opts) => {
    let responded = false;
    const respond = (ok, payload, error, meta) => {
      responded = true;
      opts.respond(ok, payload, error, meta);
    };
    const result = await handler({
      ...opts,
      respond,
    });
    if (!responded && result !== void 0) respond(true, result);
  };
}
function createNetworkRegistrars(state) {
  const { registry, coreGatewayMethods, pluginsWithChannelRegistrationConflict, pushDiagnostic } =
    state;
  const registerGatewayMethod = (record, method, handler, opts) => {
    const trimmed = method.trim();
    if (!trimmed) return;
    if (coreGatewayMethods.has(trimmed) || registry.gatewayHandlers[trimmed]) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `gateway method already registered: ${trimmed}`,
      });
      return;
    }
    const wrappedHandler = adaptPluginGatewayMethodHandler(handler);
    registry.gatewayHandlers[trimmed] = wrappedHandler;
    const normalizedScope = normalizePluginGatewayMethodScope(trimmed, opts?.scope);
    if (normalizedScope.coercedToReservedAdmin)
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: `gateway method scope coerced to operator.admin for reserved core namespace: ${trimmed}`,
      });
    registry.gatewayMethodDescriptors.push(
      createPluginGatewayMethodDescriptor({
        pluginId: record.id,
        name: trimmed,
        handler: wrappedHandler,
        scope: normalizedScope.scope,
      }),
    );
  };
  const registerSessionCatalog = (record, provider) => {
    const id = provider.id.trim();
    const label = provider.label.trim();
    if (!id || !label) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "session catalog requires non-empty id and label",
      });
      return;
    }
    const existing = registry.sessionCatalogs.find((entry) => entry.provider.id === id);
    if (existing) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `session catalog already registered: ${id} (${existing.pluginId})`,
      });
      return;
    }
    registry.sessionCatalogs.push({
      pluginId: record.id,
      pluginName: record.name,
      provider: {
        ...provider,
        id,
        label,
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const describeHttpRouteOwner = (entry) => {
    return `${normalizeOptionalString(entry.pluginId) || "unknown-plugin"} (${normalizeOptionalString(entry.source) || "unknown-source"})`;
  };
  const canDispatchGatewayMethodsFromHttpRoute = (record) =>
    (record.contracts?.gatewayMethodDispatch ?? []).includes(GATEWAY_METHOD_DISPATCH_CONTRACT);
  const registerHttpRoute = (record, params) => {
    const normalizedPath = normalizePluginHttpPath(params.path);
    if (!normalizedPath) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: "http route registration missing path",
      });
      return;
    }
    if (params.auth !== "gateway" && params.auth !== "plugin") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `http route registration missing or invalid auth: ${normalizedPath}`,
      });
      return;
    }
    const match = params.match ?? "exact";
    const overlappingRoute = findOverlappingPluginHttpRoute(registry.httpRoutes, {
      path: normalizedPath,
      match,
    });
    if (overlappingRoute && overlappingRoute.auth !== params.auth) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `http route overlap rejected: ${normalizedPath} (${match}, ${params.auth}) overlaps ${overlappingRoute.path} (${overlappingRoute.match}, ${overlappingRoute.auth}) owned by ${describeHttpRouteOwner(overlappingRoute)}`,
      });
      return;
    }
    const existingIndex = registry.httpRoutes.findIndex(
      (entry) => entry.path === normalizedPath && entry.match === match,
    );
    const registration = {
      pluginId: record.id,
      path: normalizedPath,
      handler: params.handler,
      ...(params.handleUpgrade ? { handleUpgrade: params.handleUpgrade } : {}),
      auth: params.auth,
      match,
      ...(params.gatewayRuntimeScopeSurface
        ? { gatewayRuntimeScopeSurface: params.gatewayRuntimeScopeSurface }
        : {}),
      ...(canDispatchGatewayMethodsFromHttpRoute(record)
        ? { gatewayMethodDispatchAllowed: true }
        : {}),
      ...(params.nodeCapability ? { nodeCapability: { ...params.nodeCapability } } : {}),
      source: record.source,
    };
    if (existingIndex >= 0) {
      const existing = registry.httpRoutes[existingIndex];
      if (!existing) return;
      if (!params.replaceExisting && existing.pluginId !== record.id) {
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `http route already registered: ${normalizedPath} (${match}) by ${describeHttpRouteOwner(existing)}`,
        });
        return;
      }
      if (existing.pluginId && existing.pluginId !== record.id) {
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `http route replacement rejected: ${normalizedPath} (${match}) owned by ${describeHttpRouteOwner(existing)}`,
        });
        return;
      }
      registry.httpRoutes[existingIndex] = registration;
      return;
    }
    record.httpRoutes += 1;
    registry.httpRoutes.push(registration);
  };
  const registerHostedMediaResolver = (record, resolver) => {
    if (typeof resolver !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "hosted media resolver registration missing resolver",
      });
      return;
    }
    registry.hostedMediaResolvers.push({
      pluginId: record.id,
      pluginName: record.name,
      resolver,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerChannel = (record, registration, mode = "full") => {
    if (record.origin === "workspace" && !record.enabled) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: `channel registration rejected for disabled workspace plugin: ${record.id}`,
      });
      return;
    }
    const registrationCapabilities = resolvePluginRegistrationCapabilities(mode);
    const normalized =
      typeof registration.plugin === "object" ? registration : { plugin: registration };
    const plugin = normalizeRegisteredChannelPlugin({
      pluginId: record.id,
      source: record.source,
      plugin: normalized.plugin,
      pushDiagnostic,
    });
    if (!plugin) return;
    const id = plugin.id;
    const existingRuntime = registry.channels.find((entry) => entry.plugin.id === id);
    if (registrationCapabilities.runtimeChannel && existingRuntime) {
      if (existingRuntime.pluginId === record.id) {
        existingRuntime.plugin = plugin;
        existingRuntime.pluginName = record.name;
        existingRuntime.origin = record.origin;
        existingRuntime.source = record.source;
        existingRuntime.rootDir = record.rootDir;
        const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
        if (existingSetup) {
          existingSetup.plugin = plugin;
          existingSetup.pluginName = record.name;
          existingSetup.origin = record.origin;
          existingSetup.source = record.source;
          existingSetup.enabled = record.enabled;
          existingSetup.rootDir = record.rootDir;
        }
        return;
      }
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `channel already registered: ${id} (${existingRuntime.pluginId})`,
      });
      pluginsWithChannelRegistrationConflict.add(record.id);
      return;
    }
    const existingSetup = registry.channelSetups.find((entry) => entry.plugin.id === id);
    if (existingSetup) {
      if (existingSetup.pluginId === record.id) {
        existingSetup.plugin = plugin;
        existingSetup.pluginName = record.name;
        existingSetup.origin = record.origin;
        existingSetup.source = record.source;
        existingSetup.enabled = record.enabled;
        existingSetup.rootDir = record.rootDir;
        return;
      }
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `channel setup already registered: ${id} (${existingSetup.pluginId})`,
      });
      pluginsWithChannelRegistrationConflict.add(record.id);
      return;
    }
    if (!record.channelIds.includes(id)) record.channelIds.push(id);
    registry.channelSetups.push({
      pluginId: record.id,
      pluginName: record.name,
      plugin,
      origin: record.origin,
      source: record.source,
      enabled: record.enabled,
      rootDir: record.rootDir,
    });
    if (!registrationCapabilities.runtimeChannel) return;
    registry.channels.push({
      pluginId: record.id,
      pluginName: record.name,
      plugin,
      origin: record.origin,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  return {
    registerGatewayMethod,
    registerSessionCatalog,
    registerHttpRoute,
    registerHostedMediaResolver,
    registerChannel,
  };
}
//#endregion
//#region src/plugins/registry-registrars-operations.ts
function isOfficialCodexPluginRecord(record) {
  if (record.id !== "codex" || record.origin !== "global") return false;
  if (record.packageName === "@openclaw/codex") return true;
  return path
    .normalize(record.rootDir ?? record.source)
    .split(path.sep)
    .join("/")
    .includes("/node_modules/@openclaw/codex");
}
function canClaimReservedCommandOwnership(record) {
  return record.origin === "bundled" || isOfficialCodexPluginRecord(record);
}
function createOperationRegistrars(state) {
  const { registry, registryParams, pushDiagnostic } = state;
  const registerCli = (record, registrar, opts) => {
    const normalizeCommandRoot = (raw, source) => {
      const normalized = normalizeCommandDescriptorName(raw);
      if (!normalized)
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `invalid cli ${source} name: ${JSON.stringify(raw.trim())}`,
        });
      return normalized;
    };
    const parentPath = (opts?.parentPath ?? []).map((segment) =>
      normalizeCommandRoot(segment, "command"),
    );
    if (parentPath.some((segment) => segment === null)) return;
    const normalizedParentPath = parentPath;
    const descriptors = (opts?.descriptors ?? [])
      .map((descriptor) => {
        const name = normalizeCommandRoot(descriptor.name, "descriptor");
        const description = sanitizeCommandDescriptorDescription(descriptor.description);
        return name && description
          ? {
              name,
              description,
              hasSubcommands: descriptor.hasSubcommands,
            }
          : null;
      })
      .filter((descriptor) => descriptor !== null);
    const commands = [
      ...(opts?.commands ?? []),
      ...descriptors.map((descriptor) => descriptor.name),
    ]
      .map((command) => normalizeCommandRoot(command, "command"))
      .filter((command) => command !== null);
    if (commands.length === 0) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "cli registration missing explicit commands metadata",
      });
      return;
    }
    const serializeCommandPath = (command) => [...normalizedParentPath, command].join(" ");
    const commandPaths = commands.map(serializeCommandPath);
    const commandPathSet = new Set(commandPaths);
    const existing = registry.cliRegistrars.find((entry) =>
      entry.commands
        .map((command) => [...(entry.parentPath ?? []), command].join(" "))
        .some((commandPath) => commandPathSet.has(commandPath)),
    );
    if (existing) {
      const existingCommandPaths = new Set(
        existing.commands.map((command) => [...(existing.parentPath ?? []), command].join(" ")),
      );
      const overlap = commandPaths.find((commandPath) => existingCommandPaths.has(commandPath));
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `cli command already registered: ${overlap ?? commands[0]} (${existing.pluginId})`,
      });
      return;
    }
    record.cliCommands.push(...commandPaths);
    registry.cliRegistrars.push({
      pluginId: record.id,
      pluginName: record.name,
      register: registrar,
      parentPath: normalizedParentPath,
      commands,
      descriptors,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerReload = (record, registration) => {
    const normalized = {
      restartPrefixes: normalizeStringEntries(registration.restartPrefixes),
      hotPrefixes: normalizeStringEntries(registration.hotPrefixes),
      noopPrefixes: normalizeStringEntries(registration.noopPrefixes),
    };
    if (
      (normalized.restartPrefixes?.length ?? 0) === 0 &&
      (normalized.hotPrefixes?.length ?? 0) === 0 &&
      (normalized.noopPrefixes?.length ?? 0) === 0
    ) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: "reload registration missing prefixes",
      });
      return;
    }
    registry.reloads.push({
      pluginId: record.id,
      pluginName: record.name,
      registration: normalized,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const reservedNodeHostCommands = /* @__PURE__ */ new Set([
    ...NODE_SYSTEM_RUN_COMMANDS,
    ...NODE_EXEC_APPROVALS_COMMANDS,
    NODE_SYSTEM_NOTIFY_COMMAND,
  ]);
  const registerNodeHostCommand = (record, nodeCommand) => {
    const command = nodeCommand.command.trim();
    if (!command) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "node host command registration missing command",
      });
      return;
    }
    const bundledSystemNotify = record.origin === "bundled" && command === "system.notify";
    if (reservedNodeHostCommands.has(command) && !bundledSystemNotify) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `node host command reserved by core: ${command}`,
      });
      return;
    }
    const existing = registry.nodeHostCommands.find((entry) => entry.command.command === command);
    if (existing) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `node host command already registered: ${command} (${existing.pluginId})`,
      });
      return;
    }
    registry.nodeHostCommands.push({
      pluginId: record.id,
      pluginName: record.name,
      command: {
        ...nodeCommand,
        command,
        cap: normalizeOptionalString(nodeCommand.cap),
      },
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerNodeInvokePolicy = (record, policy, pluginConfig) => {
    const commands = normalizeUniqueStringEntries(
      Array.isArray(policy.commands) ? policy.commands : [],
    );
    if (commands.length === 0) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "node invoke policy registration missing commands",
      });
      return;
    }
    if (typeof policy.handle !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `node invoke policy registration missing handler: ${commands.join(", ")}`,
      });
      return;
    }
    for (const command of commands) {
      const existing = registry.nodeInvokePolicies.find((entry) =>
        entry.policy.commands.includes(command),
      );
      if (existing) {
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `node invoke policy already registered for ${command} (${existing.pluginId})`,
        });
        return;
      }
    }
    registry.nodeInvokePolicies.push({
      pluginId: record.id,
      pluginName: record.name,
      policy: {
        ...policy,
        commands,
      },
      pluginConfig,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerSecurityAuditCollector = (record, collector) => {
    registry.securityAuditCollectors.push({
      pluginId: record.id,
      pluginName: record.name,
      collector,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerService = (record, service) => {
    const id = service.id.trim();
    if (!id) return;
    const existing = registry.services.find((entry) => entry.service.id === id);
    if (existing) {
      if (existing.pluginId === record.id) return;
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `service already registered: ${id} (${existing.pluginId})`,
      });
      return;
    }
    record.services.push(id);
    registry.services.push({
      pluginId: record.id,
      pluginName: record.name,
      service,
      source: record.source,
      origin: record.origin,
      trustedOfficialInstall: record.trustedOfficialInstall,
      rootDir: record.rootDir,
    });
  };
  const registerGatewayDiscoveryService = (record, service) => {
    const id = service.id.trim();
    if (!id) return;
    const existing = registry.gatewayDiscoveryServices.find((entry) => entry.service.id === id);
    if (existing) {
      if (existing.pluginId === record.id) return;
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `gateway discovery service already registered: ${id} (${existing.pluginId})`,
      });
      return;
    }
    record.gatewayDiscoveryServiceIds.push(id);
    registry.gatewayDiscoveryServices.push({
      pluginId: record.id,
      pluginName: record.name,
      service,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerCommand = (record, command) => {
    const name = command.name.trim();
    if (!name) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "command registration missing name",
      });
      return;
    }
    const allowReservedCommandNames = command.ownership === "reserved";
    if (allowReservedCommandNames && !canClaimReservedCommandOwnership(record)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `only bundled plugins can claim reserved command ownership: ${name}`,
      });
      return;
    }
    if (allowReservedCommandNames && !isReservedCommandName(name)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `reserved command ownership requires a reserved command name: ${name}`,
      });
      return;
    }
    if (allowReservedCommandNames && record.id !== normalizeLowercaseStringOrEmpty(name)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `command registration failed: Reserved command ownership requires plugin id "${record.id}" to match reserved command name "${normalizeLowercaseStringOrEmpty(name)}"`,
      });
      return;
    }
    if (!registryParams.activateGlobalSideEffects) {
      const validationError = validatePluginCommandDefinition(command, {
        allowReservedCommandNames,
      });
      if (validationError) {
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `command registration failed: ${validationError}`,
        });
        return;
      }
    } else {
      const { ownership: _ownership, ...commandForRegistration } = command;
      const result = registerPluginCommand(
        record.id,
        allowReservedCommandNames ? commandForRegistration : command,
        {
          pluginName: record.name,
          pluginRoot: record.rootDir,
          allowReservedCommandNames,
          allowOwnerStatusExposure: canClaimReservedCommandOwnership(record),
        },
      );
      if (!result.ok) {
        pushDiagnostic({
          level: "error",
          pluginId: record.id,
          source: record.source,
          message: `command registration failed: ${result.error}`,
        });
        return;
      }
      if (allowReservedCommandNames) {
        const registeredCommand = pluginCommands.get(`/${name.toLowerCase()}`);
        if (registeredCommand?.pluginId === record.id) registeredCommand.ownership = "reserved";
      }
    }
    record.commands.push(name);
    registry.commands.push({
      pluginId: record.id,
      pluginName: record.name,
      command,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  return {
    registerCli,
    registerReload,
    registerNodeHostCommand,
    registerNodeInvokePolicy,
    registerSecurityAuditCollector,
    registerService,
    registerGatewayDiscoveryService,
    registerCommand,
  };
}
//#endregion
//#region src/plugins/provider-validation.ts
/** Validates and normalizes provider plugin definitions before registry registration. */
const warnedDeprecatedDiscoveryProviders = /* @__PURE__ */ new Set();
function normalizeTextList(values) {
  const normalized = normalizeUniqueTrimmedStringList(values);
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeOnboardingScopes(values) {
  const normalized = Array.from(
    new Set(
      (values ?? []).filter(
        (value) =>
          value === "text-inference" ||
          value === "image-generation" ||
          value === "music-generation",
      ),
    ),
  );
  return normalized.length > 0 ? normalized : void 0;
}
function normalizeProviderOAuthProfileIdRepairs(values) {
  if (!Array.isArray(values)) return;
  const normalized = values
    .map((value) => {
      const legacyProfileId = normalizeOptionalString(value?.legacyProfileId);
      const promptLabel = normalizeOptionalString(value?.promptLabel);
      if (!legacyProfileId && !promptLabel) return null;
      return {
        ...(legacyProfileId ? { legacyProfileId } : {}),
        ...(promptLabel ? { promptLabel } : {}),
      };
    })
    .filter((value) => value !== null);
  return normalized.length > 0 ? normalized : void 0;
}
function resolveWizardMethodId(params) {
  if (!params.methodId) return;
  if (params.auth.some((method) => method.id === params.methodId)) return params.methodId;
  pushPluginValidationDiagnostic({
    level: "warn",
    pluginId: params.pluginId,
    source: params.source,
    message: `provider "${params.providerId}" ${params.metadataKind} method "${params.methodId}" not found; falling back to available methods`,
    pushDiagnostic: params.pushDiagnostic,
  });
}
function buildNormalizedModelAllowlist(modelAllowlist) {
  if (!modelAllowlist) return;
  const allowedKeys = normalizeTextList(modelAllowlist.allowedKeys);
  const initialSelections = normalizeTextList(modelAllowlist.initialSelections);
  const loadCatalog = modelAllowlist.loadCatalog === true;
  const message = normalizeOptionalString(modelAllowlist.message);
  if (!allowedKeys && !initialSelections && !loadCatalog && !message) return;
  return {
    ...(allowedKeys ? { allowedKeys } : {}),
    ...(initialSelections ? { initialSelections } : {}),
    ...(loadCatalog ? { loadCatalog } : {}),
    ...(message ? { message } : {}),
  };
}
function buildNormalizedWizardSetup(params) {
  const choiceId = normalizeOptionalString(params.setup.choiceId);
  const choiceLabel = normalizeOptionalString(params.setup.choiceLabel);
  const choiceHint = normalizeOptionalString(params.setup.choiceHint);
  const groupId = normalizeOptionalString(params.setup.groupId);
  const groupLabel = normalizeOptionalString(params.setup.groupLabel);
  const groupHint = normalizeOptionalString(params.setup.groupHint);
  const onboardingScopes = normalizeOnboardingScopes(params.setup.onboardingScopes);
  const modelAllowlist = buildNormalizedModelAllowlist(params.setup.modelAllowlist);
  return {
    ...(choiceId ? { choiceId } : {}),
    ...(choiceLabel ? { choiceLabel } : {}),
    ...(choiceHint ? { choiceHint } : {}),
    ...(typeof params.setup.assistantPriority === "number" &&
    Number.isFinite(params.setup.assistantPriority)
      ? { assistantPriority: params.setup.assistantPriority }
      : {}),
    ...(params.setup.assistantVisibility === "manual-only" ||
    params.setup.assistantVisibility === "visible"
      ? { assistantVisibility: params.setup.assistantVisibility }
      : {}),
    ...(params.setup.onboardingFeatured === true ? { onboardingFeatured: true } : {}),
    ...(groupId ? { groupId } : {}),
    ...(groupLabel ? { groupLabel } : {}),
    ...(groupHint ? { groupHint } : {}),
    ...(params.methodId ? { methodId: params.methodId } : {}),
    ...(onboardingScopes ? { onboardingScopes } : {}),
    ...(modelAllowlist ? { modelAllowlist } : {}),
  };
}
function buildNormalizedModelPicker(modelPicker, methodId) {
  const label = normalizeOptionalString(modelPicker.label);
  const hint = normalizeOptionalString(modelPicker.hint);
  return {
    ...(label ? { label } : {}),
    ...(hint ? { hint } : {}),
    ...(methodId ? { methodId } : {}),
  };
}
function normalizeProviderWizardSetup(params) {
  const hasAuthMethods = params.auth.length > 0;
  if (!params.setup) return;
  if (!hasAuthMethods) {
    pushPluginValidationDiagnostic({
      level: "warn",
      pluginId: params.pluginId,
      source: params.source,
      message: `provider "${params.providerId}" setup metadata ignored because it has no auth methods`,
      pushDiagnostic: params.pushDiagnostic,
    });
    return;
  }
  const methodId = resolveWizardMethodId({
    providerId: params.providerId,
    pluginId: params.pluginId,
    source: params.source,
    auth: params.auth,
    methodId: normalizeOptionalString(params.setup.methodId),
    metadataKind: "setup",
    pushDiagnostic: params.pushDiagnostic,
  });
  return buildNormalizedWizardSetup({
    setup: params.setup,
    methodId,
  });
}
function normalizeProviderAuthMethods(params) {
  const seenMethodIds = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const method of params.auth) {
    const methodId = normalizeOptionalString(method.id);
    if (!methodId) {
      pushPluginValidationDiagnostic({
        level: "error",
        pluginId: params.pluginId,
        source: params.source,
        message: `provider "${params.providerId}" auth method missing id`,
        pushDiagnostic: params.pushDiagnostic,
      });
      continue;
    }
    if (seenMethodIds.has(methodId)) {
      pushPluginValidationDiagnostic({
        level: "error",
        pluginId: params.pluginId,
        source: params.source,
        message: `provider "${params.providerId}" auth method duplicated id "${methodId}"`,
        pushDiagnostic: params.pushDiagnostic,
      });
      continue;
    }
    seenMethodIds.add(methodId);
    const wizardSetup = method.wizard;
    const wizard = wizardSetup
      ? normalizeProviderWizardSetup({
          providerId: params.providerId,
          pluginId: params.pluginId,
          source: params.source,
          auth: [
            {
              ...method,
              id: methodId,
            },
          ],
          setup: wizardSetup,
          pushDiagnostic: params.pushDiagnostic,
        })
      : void 0;
    normalized.push({
      ...method,
      id: methodId,
      label: normalizeOptionalString(method.label) ?? methodId,
      ...(normalizeOptionalString(method.hint)
        ? { hint: normalizeOptionalString(method.hint) }
        : {}),
      ...(wizard ? { wizard } : {}),
    });
  }
  return normalized;
}
function normalizeProviderWizard(params) {
  if (!params.wizard) return;
  const hasAuthMethods = params.auth.length > 0;
  const normalizeSetup = () => {
    const setup = params.wizard?.setup;
    if (!setup) return;
    return normalizeProviderWizardSetup({
      providerId: params.providerId,
      pluginId: params.pluginId,
      source: params.source,
      auth: params.auth,
      setup,
      pushDiagnostic: params.pushDiagnostic,
    });
  };
  const normalizeModelPicker = () => {
    const modelPicker = params.wizard?.modelPicker;
    if (!modelPicker) return;
    if (!hasAuthMethods) {
      pushPluginValidationDiagnostic({
        level: "warn",
        pluginId: params.pluginId,
        source: params.source,
        message: `provider "${params.providerId}" model-picker metadata ignored because it has no auth methods`,
        pushDiagnostic: params.pushDiagnostic,
      });
      return;
    }
    return buildNormalizedModelPicker(
      modelPicker,
      resolveWizardMethodId({
        providerId: params.providerId,
        pluginId: params.pluginId,
        source: params.source,
        auth: params.auth,
        methodId: normalizeOptionalString(modelPicker.methodId),
        metadataKind: "model-picker",
        pushDiagnostic: params.pushDiagnostic,
      }),
    );
  };
  const setup = normalizeSetup();
  const modelPicker = normalizeModelPicker();
  if (!setup && !modelPicker) return;
  return {
    ...(setup ? { setup } : {}),
    ...(modelPicker ? { modelPicker } : {}),
  };
}
/** Normalizes provider plugin metadata and emits diagnostics for invalid public fields. */
/** Returns a normalized provider plugin plus validation diagnostics for registry insertion. */
function normalizeRegisteredProvider(params) {
  const id = normalizeOptionalString(params.provider.id);
  if (!id) {
    pushPluginValidationDiagnostic({
      level: "error",
      pluginId: params.pluginId,
      source: params.source,
      message: "provider registration missing id",
      pushDiagnostic: params.pushDiagnostic,
    });
    return null;
  }
  const auth = normalizeProviderAuthMethods({
    providerId: id,
    pluginId: params.pluginId,
    source: params.source,
    auth: params.provider.auth ?? [],
    pushDiagnostic: params.pushDiagnostic,
  });
  const docsPath = normalizeOptionalString(params.provider.docsPath);
  const aliases = normalizeTextList(params.provider.aliases);
  const deprecatedProfileIds = normalizeTextList(params.provider.deprecatedProfileIds);
  const oauthProfileIdRepairs = normalizeProviderOAuthProfileIdRepairs(
    params.provider.oauthProfileIdRepairs,
  );
  const envVars = normalizeTextList(params.provider.envVars);
  const wizard = normalizeProviderWizard({
    providerId: id,
    pluginId: params.pluginId,
    source: params.source,
    auth,
    wizard: params.provider.wizard,
    pushDiagnostic: params.pushDiagnostic,
  });
  const catalog = params.provider.catalog;
  const discovery = params.provider.discovery;
  if (catalog && discovery)
    pushPluginValidationDiagnostic({
      level: "warn",
      pluginId: params.pluginId,
      source: params.source,
      message: `provider "${id}" registered both catalog and discovery; using catalog`,
      pushDiagnostic: params.pushDiagnostic,
    });
  if (!catalog && discovery) {
    const warningKey = `${params.pluginId}:${id}:discovery`;
    if (!warnedDeprecatedDiscoveryProviders.has(warningKey)) {
      warnedDeprecatedDiscoveryProviders.add(warningKey);
      pushPluginValidationDiagnostic({
        level: "warn",
        pluginId: params.pluginId,
        source: params.source,
        message: `provider "${id}" uses deprecated discovery; use catalog`,
        pushDiagnostic: params.pushDiagnostic,
      });
    }
  }
  const {
    wizard: _ignoredWizard,
    docsPath: _ignoredDocsPath,
    aliases: _ignoredAliases,
    envVars: _ignoredEnvVars,
    catalog: _ignoredCatalog,
    discovery: _ignoredDiscovery,
    ...restProvider
  } = params.provider;
  return {
    ...restProvider,
    id,
    label: normalizeOptionalString(params.provider.label) ?? id,
    ...(docsPath ? { docsPath } : {}),
    ...(aliases ? { aliases } : {}),
    ...(deprecatedProfileIds ? { deprecatedProfileIds } : {}),
    ...(oauthProfileIdRepairs ? { oauthProfileIdRepairs } : {}),
    ...(envVars ? { envVars } : {}),
    auth,
    ...(catalog ? { catalog } : {}),
    ...(!catalog && discovery ? { discovery } : {}),
    ...(wizard ? { wizard } : {}),
  };
}
//#endregion
//#region src/plugins/registry-registrars-providers.ts
function createProviderRegistrars(state) {
  const {
    registry,
    registryParams,
    pushDiagnostic,
    registerSynthesizedTextModelCatalogProvider,
    registerSynthesizedMediaModelCatalogProvider,
    registerSynthesizedVoiceModelCatalogProvider,
  } = state;
  const registerProvider = (record, provider) => {
    const normalizedProvider = normalizeRegisteredProvider({
      pluginId: record.id,
      source: record.source,
      provider,
      pushDiagnostic,
    });
    if (!normalizedProvider) return;
    const id = normalizedProvider.id;
    const existing = registry.providers.find((entry) => entry.provider.id === id);
    if (existing) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `provider already registered: ${id} (${existing.pluginId})`,
      });
      return;
    }
    if (!record.providerIds.includes(id)) record.providerIds.push(id);
    registry.providers.push({
      pluginId: record.id,
      pluginName: record.name,
      provider: normalizedProvider,
      source: record.source,
      rootDir: record.rootDir,
    });
    registerSynthesizedTextModelCatalogProvider({
      record,
      provider: normalizedProvider,
    });
  };
  const registerAgentHarness$1 = (record, harness) => {
    const id = normalizeOptionalString(harness?.id) ?? "";
    if (!id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "agent harness registration missing id",
      });
      return;
    }
    if (typeof harness.supports !== "function" || typeof harness.runAttempt !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `agent harness "${id}" registration missing required runtime methods`,
      });
      return;
    }
    const existing =
      registryParams.activateGlobalSideEffects === false
        ? registry.agentHarnesses.find((entry) => entry.harness.id === id)
        : getRegisteredAgentHarness(id);
    if (existing) {
      const ownerPluginId =
        "ownerPluginId" in existing
          ? existing.ownerPluginId
          : "pluginId" in existing
            ? existing.pluginId
            : void 0;
      const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `agent harness already registered: ${id}${ownerDetail}`,
      });
      return;
    }
    const normalizedHarness = {
      ...harness,
      id,
      pluginId: harness.pluginId ?? record.id,
    };
    if (registryParams.activateGlobalSideEffects !== false)
      registerAgentHarness(normalizedHarness, { ownerPluginId: record.id });
    record.agentHarnessIds.push(id);
    registry.agentHarnesses.push({
      pluginId: record.id,
      pluginName: record.name,
      harness: normalizedHarness,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerCliBackend = (record, backend) => {
    const id = backend.id.trim();
    if (!id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "cli backend registration missing id",
      });
      return;
    }
    const existing = registry.cliBackends.find((entry) => entry.backend.id === id);
    if (existing) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `cli backend already registered: ${id} (${existing.pluginId})`,
      });
      return;
    }
    registry.cliBackends.push({
      pluginId: record.id,
      pluginName: record.name,
      backend: {
        ...backend,
        id,
      },
      source: record.source,
      rootDir: record.rootDir,
    });
    record.cliBackendIds.push(id);
  };
  const registerTextTransforms = (record, transforms) => {
    if (
      (!transforms.input || transforms.input.length === 0) &&
      (!transforms.output || transforms.output.length === 0)
    ) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: "text transform registration has no input or output replacements",
      });
      return;
    }
    registry.textTransforms.push({
      pluginId: record.id,
      pluginName: record.name,
      transforms,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerEmbeddingProvider$1 = (record, adapter) => {
    const id = adapter.id.trim();
    if (!id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "embedding provider registration missing id",
      });
      return;
    }
    if (!(record.contracts?.embeddingProviders ?? []).includes(id)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `plugin must declare contracts.embeddingProviders for adapter: ${id}`,
      });
      return;
    }
    const existing =
      registryParams.activateGlobalSideEffects === false
        ? registry.embeddingProviders.find((entry) => entry.provider.id === id)
        : getRegisteredEmbeddingProvider(id);
    if (existing) {
      const ownerPluginId =
        "ownerPluginId" in existing
          ? existing.ownerPluginId
          : "pluginId" in existing
            ? existing.pluginId
            : void 0;
      const ownerDetail = ownerPluginId ? ` (owner: ${ownerPluginId})` : "";
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `embedding provider already registered: ${id}${ownerDetail}`,
      });
      return;
    }
    if (registryParams.activateGlobalSideEffects !== false)
      registerEmbeddingProvider(adapter, { ownerPluginId: record.id });
    registry.embeddingProviders.push({
      pluginId: record.id,
      pluginName: record.name,
      provider: adapter,
      source: record.source,
      rootDir: record.rootDir,
    });
    if (!record.embeddingProviderIds.includes(id)) record.embeddingProviderIds.push(id);
  };
  const registerUniqueProviderLike = (params) => {
    const id = params.provider.id.trim();
    const { record, kindLabel } = params;
    if (!id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `${kindLabel} registration missing id`,
      });
      return false;
    }
    const existing = params.registrations.find((entry) => entry.provider.id === id);
    if (existing) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `${kindLabel} already registered: ${id} (${existing.pluginId})`,
      });
      return false;
    }
    if (!params.ownedIds.includes(id)) params.ownedIds.push(id);
    params.registrations.push({
      pluginId: record.id,
      pluginName: record.name,
      provider: params.provider,
      source: record.source,
      rootDir: record.rootDir,
    });
    return true;
  };
  const registerWorkerProvider = (record, provider) => {
    const reject = (message) =>
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message,
      });
    const validation = validateWorkerProviderContract(
      provider,
      record.contracts?.workerProviders ?? [],
    );
    if (!validation.ok) {
      reject(validation.message);
      return;
    }
    const { id } = validation;
    const existing = registry.workerProviders.get(id);
    if (existing) {
      reject(`worker provider already registered: ${id} (${existing.pluginId})`);
      return;
    }
    registry.workerProviders.set(id, {
      pluginId: record.id,
      pluginName: record.name,
      provider,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerSpeechProvider = (record, provider) => {
    if (
      registerUniqueProviderLike({
        record,
        provider,
        kindLabel: "speech provider",
        registrations: registry.speechProviders,
        ownedIds: record.speechProviderIds,
      })
    )
      registerSynthesizedVoiceModelCatalogProvider({
        record,
        provider,
        capabilities: { tts: true },
        modes: ["tts"],
      });
  };
  const registerRealtimeTranscriptionProvider = (record, provider) => {
    if (
      registerUniqueProviderLike({
        record,
        provider,
        kindLabel: "realtime transcription provider",
        registrations: registry.realtimeTranscriptionProviders,
        ownedIds: record.realtimeTranscriptionProviderIds,
      })
    )
      registerSynthesizedVoiceModelCatalogProvider({
        record,
        provider,
        capabilities: { realtime_transcription: true },
        modes: ["realtime_transcription"],
      });
  };
  const registerRealtimeVoiceProvider = (record, provider) => {
    if (
      registerUniqueProviderLike({
        record,
        provider,
        kindLabel: "realtime voice provider",
        registrations: registry.realtimeVoiceProviders,
        ownedIds: record.realtimeVoiceProviderIds,
      })
    )
      registerSynthesizedVoiceModelCatalogProvider({
        record,
        provider,
        capabilities: { realtime_voice: true },
        modes: ["realtime_voice"],
      });
  };
  const registerMediaUnderstandingProvider = (record, provider) =>
    registerUniqueProviderLike({
      record,
      provider,
      kindLabel: "media provider",
      registrations: registry.mediaUnderstandingProviders,
      ownedIds: record.mediaUnderstandingProviderIds,
    });
  const registerTranscriptSourceProvider = (record, provider) =>
    registerUniqueProviderLike({
      record,
      provider,
      kindLabel: "transcripts source provider",
      registrations: registry.transcriptSourceProviders,
      ownedIds: record.transcriptSourceProviderIds,
    });
  const registerImageGenerationProvider = (record, provider) => {
    if (
      registerUniqueProviderLike({
        record,
        provider,
        kindLabel: "image-generation provider",
        registrations: registry.imageGenerationProviders,
        ownedIds: record.imageGenerationProviderIds,
      })
    )
      registerSynthesizedMediaModelCatalogProvider({
        record,
        kind: "image_generation",
        provider,
      });
  };
  const registerVideoGenerationProvider = (record, provider) => {
    if (
      registerUniqueProviderLike({
        record,
        provider,
        kindLabel: "video-generation provider",
        registrations: registry.videoGenerationProviders,
        ownedIds: record.videoGenerationProviderIds,
      })
    )
      registerSynthesizedMediaModelCatalogProvider({
        record,
        kind: "video_generation",
        provider,
      });
  };
  const registerMusicGenerationProvider = (record, provider) => {
    if (
      registerUniqueProviderLike({
        record,
        provider,
        kindLabel: "music-generation provider",
        registrations: registry.musicGenerationProviders,
        ownedIds: record.musicGenerationProviderIds,
      })
    )
      registerSynthesizedMediaModelCatalogProvider({
        record,
        kind: "music_generation",
        provider,
      });
  };
  const registerWebFetchProvider = (record, provider) =>
    registerUniqueProviderLike({
      record,
      provider,
      kindLabel: "web fetch provider",
      registrations: registry.webFetchProviders,
      ownedIds: record.webFetchProviderIds,
    });
  const registerWebSearchProvider = (record, provider) =>
    registerUniqueProviderLike({
      record,
      provider,
      kindLabel: "web search provider",
      registrations: registry.webSearchProviders,
      ownedIds: record.webSearchProviderIds,
    });
  const registerMigrationProvider = (record, provider) =>
    registerUniqueProviderLike({
      record,
      provider,
      kindLabel: "migration provider",
      registrations: registry.migrationProviders,
      ownedIds: record.migrationProviderIds,
    });
  return {
    registerProvider,
    registerAgentHarness: registerAgentHarness$1,
    registerCliBackend,
    registerTextTransforms,
    registerEmbeddingProvider: registerEmbeddingProvider$1,
    registerWorkerProvider,
    registerSpeechProvider,
    registerRealtimeTranscriptionProvider,
    registerRealtimeVoiceProvider,
    registerMediaUnderstandingProvider,
    registerTranscriptSourceProvider,
    registerImageGenerationProvider,
    registerVideoGenerationProvider,
    registerMusicGenerationProvider,
    registerWebFetchProvider,
    registerWebSearchProvider,
    registerMigrationProvider,
  };
}
/** Lists active Codex app-server extension factories from the plugin registry. */
function listCodexAppServerExtensionFactories() {
  return (
    getActivePluginRegistry()?.codexAppServerExtensionFactories?.map((entry) => entry.factory) ?? []
  );
}
//#endregion
//#region src/plugins/registry-registrars-tools-hooks.ts
const LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT = getPluginCompatRecord("legacy-deactivate-hook-alias");
const LEGACY_SUBAGENT_SPAWNING_HOOK_COMPAT = getPluginCompatRecord("legacy-subagent-spawning-hook");
const activePluginHookRegistrations = resolveGlobalSingleton(
  Symbol.for("openclaw.activePluginHookRegistrations"),
  () => /* @__PURE__ */ new Map(),
);
function formatLegacyDeactivateHookAliasDiagnostic() {
  const removeAfter =
    LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT.removeAfter ?? "a future breaking release";
  return `typed hook "deactivate" is deprecated (${LEGACY_DEACTIVATE_HOOK_ALIAS_COMPAT.code}); use "gateway_stop". This compatibility alias will be removed after ${removeAfter}.`;
}
function formatDeprecatedTypedHookDiagnostic(hookName) {
  if (!isDeprecatedPluginHookName(hookName) || hookName === "deactivate") return;
  const deprecation = DEPRECATED_PLUGIN_HOOKS[hookName];
  const compat = hookName === "subagent_spawning" ? LEGACY_SUBAGENT_SPAWNING_HOOK_COMPAT : void 0;
  const removeAfter = compat?.removeAfter ?? deprecation.removeAfter ?? "a future breaking release";
  return `typed hook "${hookName}" is deprecated (${compat?.code ?? "deprecated-plugin-hook"}); ${deprecation.reason} Use ${deprecation.replacement}. This compatibility hook will be removed after ${removeAfter}.`;
}
function canRegisterInstalledTrustedHook(record) {
  return record.origin === "bundled" || (record.enabled && record.explicitlyEnabled === true);
}
const constrainLegacyPromptInjectionHook = (handler) => {
  return (event, ctx) => {
    const result = handler(event, ctx);
    if (result && typeof result === "object" && "then" in result)
      return Promise.resolve(result).then((resolved) =>
        stripPromptMutationFieldsFromLegacyHookResult(resolved),
      );
    return stripPromptMutationFieldsFromLegacyHookResult(result);
  };
};
function createToolHookRegistrars(state) {
  const {
    registry,
    registryParams,
    pluginHookRollback,
    pluginsWithChannelRegistrationConflict,
    pushDiagnostic,
  } = state;
  const registerCodexAppServerExtensionFactory = (record, factory) => {
    if (record.origin !== "bundled") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "only bundled plugins can register Codex app-server extension factories",
      });
      return;
    }
    if (!(record.contracts?.embeddedExtensionFactories ?? []).includes("codex-app-server")) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message:
          'plugin must declare contracts.embeddedExtensionFactories: ["codex-app-server"] to register Codex app-server extension factories',
      });
      return;
    }
    if (typeof factory !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "codex app-server extension factory must be a function",
      });
      return;
    }
    if (
      registry.codexAppServerExtensionFactories.some(
        (entry) => entry.pluginId === record.id && entry.rawFactory === factory,
      )
    )
      return;
    const safeFactory = async (codex) => {
      try {
        await factory(codex);
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        registryParams.logger.warn(
          `[plugins] codex app-server extension factory failed for ${record.id}: ${detail}`,
        );
      }
    };
    registry.codexAppServerExtensionFactories.push({
      pluginId: record.id,
      pluginName: record.name,
      rawFactory: factory,
      factory: safeFactory,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerAgentToolResultMiddleware = (record, handler, options) => {
    if (typeof handler !== "function") {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "agent tool result middleware must be a function",
      });
      return;
    }
    const runtimes = normalizeAgentToolResultMiddlewareRuntimes(options);
    if (runtimes.length === 0) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "agent tool result middleware must target at least one supported runtime",
      });
      return;
    }
    const declared = normalizeAgentToolResultMiddlewareRuntimeIds(
      record.contracts?.agentToolResultMiddleware,
    );
    const missing = runtimes.filter((runtime) => !declared.includes(runtime));
    if (missing.length > 0) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `plugin must declare contracts.agentToolResultMiddleware for: ${missing.join(", ")}`,
      });
      return;
    }
    if (!canRegisterInstalledTrustedHook(record)) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "plugin must be explicitly enabled to register agent tool result middleware",
      });
      return;
    }
    const existing = registry.agentToolResultMiddlewares.find(
      (entry) => entry.pluginId === record.id && entry.rawHandler === handler,
    );
    if (existing) {
      existing.runtimes = uniqueValues([...existing.runtimes, ...runtimes]);
      return;
    }
    const safeHandler = async (event, ctx) => {
      try {
        return await handler(event, ctx);
      } catch (error) {
        registryParams.logger.warn(
          `[plugins] agent tool result middleware failed for ${record.id}`,
        );
        throw error;
      }
    };
    registry.agentToolResultMiddlewares.push({
      pluginId: record.id,
      pluginName: record.name,
      rawHandler: handler,
      handler: safeHandler,
      runtimes,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerTool = (record, tool, opts) => {
    if (pluginsWithChannelRegistrationConflict.has(record.id)) return;
    const declaredNames = normalizePluginToolContractNames(record.contracts);
    if (declaredNames.length === 0) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "plugin must declare contracts.tools before registering agent tools",
      });
      return;
    }
    const names = [...(opts?.names ?? []), ...(opts?.name ? [opts.name] : [])];
    const optional = opts?.optional === true;
    const factory = typeof tool === "function" ? tool : (_ctx) => tool;
    if (typeof tool !== "function") names.push(tool.name);
    const normalized = normalizePluginToolNames(names);
    const undeclared = findUndeclaredPluginToolNames({
      declaredNames,
      toolNames: normalized,
    });
    if (undeclared.length > 0) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `plugin must declare contracts.tools for: ${undeclared.join(", ")}`,
      });
      return;
    }
    if (normalized.length > 0) record.toolNames.push(...normalized);
    registry.tools.push({
      pluginId: record.id,
      pluginName: record.name,
      factory,
      names: normalized,
      declaredNames,
      optional,
      origin: record.origin,
      source: record.source,
      rootDir: record.rootDir,
    });
  };
  const registerHook = (record, events, handler, opts, config, pluginConfig) => {
    const normalizedEvents = normalizeStringEntries(Array.isArray(events) ? events : [events]);
    const entry = opts?.entry ?? null;
    const hookName = entry?.hook.name ?? opts?.name?.trim();
    if (!hookName) throw new Error("hook registration missing name");
    const existingHook = registry.hooks.find(
      (entryLocal) => entryLocal.entry.hook.name === hookName,
    );
    if (existingHook) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: `hook already registered: ${hookName} (${existingHook.pluginId})`,
      });
      return;
    }
    const description = entry?.hook.description ?? opts?.description ?? "";
    const hookEntry = entry
      ? {
          ...entry,
          hook: {
            ...entry.hook,
            name: hookName,
            description,
            source: "openclaw-plugin",
            pluginId: record.id,
          },
          metadata: {
            ...entry.metadata,
            events: normalizedEvents,
          },
        }
      : {
          hook: {
            name: hookName,
            description,
            source: "openclaw-plugin",
            pluginId: record.id,
            filePath: record.source,
            baseDir: path.dirname(record.source),
            handlerPath: record.source,
          },
          frontmatter: {},
          metadata: { events: normalizedEvents },
          invocation: { enabled: true },
        };
    record.hookNames.push(hookName);
    registry.hooks.push({
      pluginId: record.id,
      entry: hookEntry,
      events: normalizedEvents,
      source: record.source,
    });
    const hookSystemEnabled = config?.hooks?.internal?.enabled !== false;
    if (!registryParams.activateGlobalSideEffects || !hookSystemEnabled || opts?.register === false)
      return;
    const previousRegistrations = activePluginHookRegistrations.get(hookName) ?? [];
    for (const registration of previousRegistrations)
      unregisterInternalHook(registration.event, registration.handler);
    const nextRegistrations = [];
    for (const event of normalizedEvents) {
      const wrappedHandler = async (evt) => {
        const context = evt.context;
        const hadPluginConfig = Object.hasOwn(context, "pluginConfig");
        const previousPluginConfig = context.pluginConfig;
        context.pluginConfig = pluginConfig;
        try {
          return await handler({
            ...evt,
            context,
          });
        } finally {
          if (hadPluginConfig) context.pluginConfig = previousPluginConfig;
          else delete context.pluginConfig;
        }
      };
      registerInternalHook(event, wrappedHandler);
      nextRegistrations.push({
        event,
        handler: wrappedHandler,
      });
    }
    activePluginHookRegistrations.set(hookName, nextRegistrations);
    const rollbackEntries = pluginHookRollback.get(record.id) ?? [];
    rollbackEntries.push({
      name: hookName,
      previousRegistrations: [...previousRegistrations],
    });
    pluginHookRollback.set(record.id, rollbackEntries);
  };
  const registerTypedHook = (record, hookName, handler, opts, policy) => {
    if (!isPluginHookName(hookName)) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: `unknown typed hook "${String(hookName)}" ignored`,
      });
      return;
    }
    const effectiveHookName = hookName === "deactivate" ? "gateway_stop" : hookName;
    if (hookName === "deactivate")
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: formatLegacyDeactivateHookAliasDiagnostic(),
      });
    else {
      const diagnostic = formatDeprecatedTypedHookDiagnostic(hookName);
      if (diagnostic)
        pushDiagnostic({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: diagnostic,
        });
    }
    let effectiveHandler = handler;
    if (policy?.allowPromptInjection === false && isPromptInjectionHookName(effectiveHookName)) {
      if (effectiveHookName !== "before_agent_start") {
        pushDiagnostic({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: `typed hook "${effectiveHookName}" blocked by plugins.entries.${record.id}.hooks.allowPromptInjection=false`,
        });
        return;
      }
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: `typed hook "${effectiveHookName}" prompt fields constrained by plugins.entries.${record.id}.hooks.allowPromptInjection=false`,
      });
      effectiveHandler = constrainLegacyPromptInjectionHook(handler);
    }
    if (isConversationHookName(effectiveHookName)) {
      const explicitConversationAccess = policy?.allowConversationAccess;
      if (record.origin !== "bundled" && explicitConversationAccess !== true) {
        pushDiagnostic({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: `typed hook "${effectiveHookName}" blocked because non-bundled plugins must set plugins.entries.${record.id}.hooks.allowConversationAccess=true`,
        });
        return;
      }
      if (record.origin === "bundled" && explicitConversationAccess === false) {
        pushDiagnostic({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: `typed hook "${effectiveHookName}" blocked by plugins.entries.${record.id}.hooks.allowConversationAccess=false`,
        });
        return;
      }
    }
    const timeoutMs = resolveTypedHookTimeoutMs({
      hookName: effectiveHookName,
      opts,
      policy,
    });
    record.hookCount += 1;
    registry.typedHooks.push({
      pluginId: record.id,
      hookName: effectiveHookName,
      handler: effectiveHandler,
      priority: opts?.priority,
      ...(timeoutMs !== void 0 ? { timeoutMs } : {}),
      source: record.source,
    });
  };
  const rollbackHooks = (pluginId) => {
    const hookRollbackEntries = pluginHookRollback.get(pluginId) ?? [];
    for (const entry of hookRollbackEntries.toReversed()) {
      const activeRegistrations = activePluginHookRegistrations.get(entry.name) ?? [];
      for (const registration of activeRegistrations)
        unregisterInternalHook(registration.event, registration.handler);
      if (entry.previousRegistrations.length === 0) {
        activePluginHookRegistrations.delete(entry.name);
        continue;
      }
      for (const registration of entry.previousRegistrations)
        registerInternalHook(registration.event, registration.handler);
      activePluginHookRegistrations.set(entry.name, [...entry.previousRegistrations]);
    }
    pluginHookRollback.delete(pluginId);
  };
  return {
    registerCodexAppServerExtensionFactory,
    registerAgentToolResultMiddleware,
    registerTool,
    registerHook,
    registerTypedHook,
    rollbackHooks,
  };
}
//#endregion
//#region src/plugins/registry-registrars.ts
/** Compose domain registrars over one explicit mutable registry state. */
function createPluginRegistrars(state) {
  return {
    ...createCapabilityRegistrars(state),
    ...createToolHookRegistrars(state),
    ...createNetworkRegistrars(state),
    ...createProviderRegistrars(state),
    ...createOperationRegistrars(state),
    ...createHostRegistrars(state),
    ...createMemoryRegistrars(state),
    registerModelCatalogProvider: state.registerModelCatalogProvider,
  };
}
//#endregion
//#region src/channels/message/ingress-queue.ts
/**
 * Durable channel ingress queue.
 *
 * Stores, claims, completes, and tombstones inbound channel events in OpenClaw state.
 */
function normalizePart(value, fallback) {
  const normalized = value?.trim();
  return normalized ? normalized : fallback;
}
function createStateDirEnv(stateDir, baseEnv = process.env) {
  const env = Object.create(baseEnv);
  env.OPENCLAW_STATE_DIR = stateDir;
  return env;
}
function openStateDatabase(stateDir) {
  return openOpenClawStateDatabase({ env: stateDir ? createStateDirEnv(stateDir) : process.env });
}
function getChannelIngressKysely(db) {
  return getNodeSqliteKysely(db);
}
function affectedRows(result) {
  return Number(result.numAffectedRows ?? 0n);
}
function parseJson(value) {
  try {
    return {
      ok: true,
      value: JSON.parse(value),
    };
  } catch {
    return { ok: false };
  }
}
function baseRecord(row) {
  const payloadResult = parseJson(row.payload_json);
  if (!payloadResult.ok) return null;
  const metaResult = row.metadata_json === null ? null : parseJson(row.metadata_json);
  return {
    id: row.event_id,
    channelId: row.channel_id,
    accountId: row.account_id,
    queueName: row.queue_name,
    payload: payloadResult.value,
    ...(metaResult === null || !metaResult.ok ? {} : { metadata: metaResult.value }),
    receivedAt: row.received_at,
    updatedAt: row.updated_at,
    ...(row.lane_key === null ? {} : { laneKey: row.lane_key }),
    attempts: row.attempts,
    ...(row.last_attempt_at === null ? {} : { lastAttemptAt: row.last_attempt_at }),
    ...(row.last_error === null ? {} : { lastError: row.last_error }),
  };
}
function claimedRecord(row) {
  const base = baseRecord(row);
  if (base === null) return null;
  return {
    ...base,
    claim: {
      token: row.claim_token ?? "",
      ownerId: row.claim_owner ?? "",
      claimedAt: row.claimed_at ?? 0,
    },
  };
}
function corruptClaimRecord(row) {
  const claimValue = row.claim_token ?? "";
  return {
    id: row.event_id,
    channelId: row.channel_id,
    accountId: row.account_id,
    queueName: row.queue_name,
    ...(row.lane_key === null ? {} : { laneKey: row.lane_key }),
    reason: "corrupt_payload",
    claim: {
      token: claimValue,
      ownerId: row.claim_owner ?? "",
      claimedAt: row.claimed_at ?? 0,
    },
  };
}
function completedRecord(row) {
  const metaResult =
    row.completed_metadata_json === null ? null : parseJson(row.completed_metadata_json);
  return {
    id: row.event_id,
    channelId: row.channel_id,
    accountId: row.account_id,
    queueName: row.queue_name,
    completedAt: row.completed_at ?? row.updated_at,
    ...(metaResult === null || !metaResult.ok ? {} : { metadata: metaResult.value }),
  };
}
function failedRecord(row) {
  return {
    id: row.event_id,
    channelId: row.channel_id,
    accountId: row.account_id,
    queueName: row.queue_name,
    failedAt: row.failed_at ?? row.updated_at,
    reason: row.failed_reason ?? "failed",
    ...(row.last_error === null ? {} : { message: row.last_error }),
  };
}
function selectRow(db, queueName, id) {
  return executeSqliteQueryTakeFirstSync(
    db,
    getChannelIngressKysely(db)
      .selectFrom("channel_ingress_events")
      .selectAll()
      .where("queue_name", "=", queueName)
      .where("event_id", "=", id),
  );
}
function tombstoneCorruptPayloadRow(params) {
  const baseUpdate = getChannelIngressKysely(params.db)
    .updateTable("channel_ingress_events")
    .set({
      status: "failed",
      failed_at: params.failedAt,
      failed_reason: "corrupt_payload",
      last_error: null,
      payload_json: "null",
      metadata_json: null,
      claim_token: null,
      claim_owner: null,
      claimed_at: null,
      updated_at: params.failedAt,
    })
    .where("queue_name", "=", params.row.queue_name)
    .where("event_id", "=", params.row.event_id)
    .where("status", "=", params.expectedStatus);
  if (params.expectedStatus === "pending")
    return affectedRows(executeSqliteQuerySync(params.db, baseUpdate)) > 0;
  const claimGuardedUpdate =
    params.row.claim_token === null
      ? baseUpdate.where("claim_token", "is", null)
      : baseUpdate.where("claim_token", "=", params.row.claim_token);
  const staleGuardedUpdate =
    params.staleCutoff === void 0
      ? claimGuardedUpdate
      : claimGuardedUpdate.where("claimed_at", "<=", params.staleCutoff);
  return affectedRows(executeSqliteQuerySync(params.db, staleGuardedUpdate)) > 0;
}
function idFrom(idOrRecord) {
  const id = normalizePart(typeof idOrRecord === "string" ? idOrRecord : idOrRecord.id, "");
  if (!id) throw new Error("Channel ingress event id cannot be empty");
  return id;
}
function claimTokenFrom(idOrClaim) {
  return typeof idOrClaim === "string" ? null : (idOrClaim.claim?.token ?? null);
}
function rowToEnqueueResult(row) {
  if (row.status === "completed")
    return {
      kind: "completed",
      duplicate: true,
      record: completedRecord(row),
    };
  if (row.status === "failed")
    return {
      kind: "failed",
      duplicate: true,
      record: failedRecord(row),
    };
  if (row.status === "claimed") {
    const rec = claimedRecord(row);
    return rec
      ? {
          kind: "claimed",
          duplicate: true,
          record: rec,
        }
      : null;
  }
  const rec = baseRecord(row);
  return rec
    ? {
        kind: "pending",
        duplicate: true,
        record: rec,
      }
    : null;
}
function normalizeLimit(limit) {
  return limit === "all" ? Number.MAX_SAFE_INTEGER : Math.max(1, Math.floor(limit ?? 100));
}
function normalizeScanLimit(limit) {
  return Math.max(1, Math.floor(limit ?? 100));
}
const LIST_PENDING_BATCH_SIZE = 100;
const MAX_CORRUPT_RECONCILIATIONS_PER_CLAIM = 100;
function normalizeMaxEntries(value) {
  return value === void 0 ? null : Math.max(0, Math.floor(value));
}
function normalizedProtectedIds(ids) {
  return [...(ids ?? [])].map((id) => id.trim()).filter(Boolean);
}
function normalizedCandidateIds(ids) {
  return ids === void 0 ? void 0 : [...ids].map((id) => id.trim()).filter(Boolean);
}
function queueNameForParts(channelId, accountId) {
  return JSON.stringify([channelId, accountId]);
}
/** Creates a durable channel/account-scoped ingress queue backed by the OpenClaw state database. */
function createChannelIngressQueue(options) {
  const channelId = normalizePart(options.channelId, "unknown");
  const accountId = normalizePart(options.accountId, "default");
  const queueName = queueNameForParts(channelId, accountId);
  const now = options.now ?? Date.now;
  const enqueue = async (id, payload, enqueueOptions) => {
    const eventId = normalizePart(id, "");
    if (!eventId) throw new Error("Channel ingress event id cannot be empty");
    const receivedAt = enqueueOptions?.receivedAt ?? now();
    const updatedAt = now();
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const kysely = getChannelIngressKysely(tx.db);
        const insert = executeSqliteQuerySync(
          tx.db,
          kysely
            .insertInto("channel_ingress_events")
            .values({
              queue_name: queueName,
              event_id: eventId,
              channel_id: channelId,
              account_id: accountId,
              status: "pending",
              lane_key: enqueueOptions?.laneKey ?? null,
              payload_json: JSON.stringify(payload),
              metadata_json:
                enqueueOptions?.metadata === void 0
                  ? null
                  : JSON.stringify(enqueueOptions.metadata),
              received_at: receivedAt,
              updated_at: updatedAt,
              attempts: 0,
            })
            .onConflict((conflict) => conflict.columns(["queue_name", "event_id"]).doNothing()),
        );
        const row = selectRow(tx.db, queueName, eventId);
        if (!row) throw new Error(`Failed to read channel ingress event ${queueName}/${eventId}`);
        if (affectedRows(insert) > 0) {
          const fresh = baseRecord(row);
          if (fresh === null)
            throw new Error(
              `Corrupt payload_json in channel ingress event ${queueName}/${eventId}`,
            );
          return {
            kind: "accepted",
            duplicate: false,
            record: fresh,
          };
        }
        const dup = rowToEnqueueResult(row);
        if (dup === null) {
          if (row.status === "claimed")
            throw new Error(
              `Corrupt payload_json in claimed channel ingress event ${queueName}/${eventId}`,
            );
          if (
            !tombstoneCorruptPayloadRow({
              db: tx.db,
              row,
              expectedStatus: "pending",
              failedAt: updatedAt,
            })
          )
            throw new Error(`Failed to tombstone corrupt ingress event ${queueName}/${eventId}`);
          return {
            kind: "failed",
            duplicate: true,
            record: {
              id: row.event_id,
              channelId: row.channel_id,
              accountId: row.account_id,
              queueName: row.queue_name,
              failedAt: updatedAt,
              reason: "corrupt_payload",
            },
          };
        }
        return dup;
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const listPending = async (listOptions) => {
    const { db } = openStateDatabase(options.stateDir);
    const kysely = getChannelIngressKysely(db);
    const limit = normalizeLimit(listOptions?.limit);
    const records = [];
    let lastRow;
    while (records.length < limit) {
      let pageQuery = kysely
        .selectFrom("channel_ingress_events")
        .selectAll()
        .where("queue_name", "=", queueName)
        .where("status", "=", "pending");
      if (lastRow) {
        const cursor = lastRow;
        pageQuery =
          listOptions?.orderBy === "id"
            ? pageQuery.where("event_id", ">", cursor.event_id)
            : pageQuery.where((eb) =>
                eb.or([
                  eb("received_at", ">", cursor.received_at),
                  eb.and([
                    eb("received_at", "=", cursor.received_at),
                    eb("event_id", ">", cursor.event_id),
                  ]),
                ]),
              );
      }
      const rows = executeSqliteQuerySync(
        db,
        (listOptions?.orderBy === "id"
          ? pageQuery.orderBy("event_id", "asc")
          : pageQuery.orderBy("received_at", "asc").orderBy("event_id", "asc")
        ).limit(LIST_PENDING_BATCH_SIZE),
      ).rows;
      for (const row of rows) {
        const record = baseRecord(row);
        if (record) {
          records.push(record);
          if (records.length === limit) break;
        }
      }
      if (rows.length < LIST_PENDING_BATCH_SIZE) break;
      lastRow = rows.at(-1);
    }
    return records;
  };
  const listClaims = async () => {
    const { db } = openStateDatabase(options.stateDir);
    return executeSqliteQuerySync(
      db,
      getChannelIngressKysely(db)
        .selectFrom("channel_ingress_events")
        .selectAll()
        .where("queue_name", "=", queueName)
        .where("status", "=", "claimed")
        .orderBy("claimed_at", "asc")
        .orderBy("received_at", "asc")
        .orderBy("event_id", "asc"),
    )
      .rows.map((row) => claimedRecord(row))
      .filter((rec) => rec !== null);
  };
  const claimNext = async (claimOptions) => {
    if (claimOptions?.staleMs !== void 0)
      await recoverStaleClaims({ staleMs: claimOptions.staleMs });
    const blocked = new Set(
      [...(claimOptions?.blockedLaneKeys ?? [])].map((key) => key.trim()).filter(Boolean),
    );
    const candidateIds = normalizedCandidateIds(claimOptions?.candidateIds);
    if (candidateIds?.length === 0) return null;
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const kysely = getChannelIngressKysely(tx.db);
        let effectiveBlocked = blocked;
        if (candidateIds && candidateIds.length > 0) {
          const claimedCandidateLaneKeys = executeSqliteQuerySync(
            tx.db,
            kysely
              .selectFrom("channel_ingress_events")
              .selectAll()
              .where("queue_name", "=", queueName)
              .where("status", "=", "claimed")
              .where("event_id", "in", candidateIds),
          )
            .rows.map((row) => {
              if (row.lane_key) return row.lane_key;
              if (!claimOptions?.deriveLaneKey) return;
              const rec = baseRecord(row);
              return rec ? claimOptions.deriveLaneKey(rec) : void 0;
            })
            .filter((laneKey) => Boolean(laneKey));
          if (claimedCandidateLaneKeys.length > 0)
            effectiveBlocked = /* @__PURE__ */ new Set([...blocked, ...claimedCandidateLaneKeys]);
        }
        let select = kysely
          .selectFrom("channel_ingress_events")
          .selectAll()
          .where("queue_name", "=", queueName)
          .where("status", "=", "pending");
        if (candidateIds) select = select.where("event_id", "in", candidateIds);
        if (effectiveBlocked.size > 0 && !claimOptions?.deriveLaneKey)
          select = select.where((eb) =>
            eb.or([eb("lane_key", "is", null), eb("lane_key", "not in", [...effectiveBlocked])]),
          );
        let orderedSelect =
          claimOptions?.orderBy === "id"
            ? select.orderBy("event_id", "asc")
            : select.orderBy("received_at", "asc").orderBy("event_id", "asc");
        orderedSelect = orderedSelect.limit(normalizeScanLimit(claimOptions?.scanLimit));
        const transitionAt = now();
        let corruptReconciliations = 0;
        let selected;
        while (!selected) {
          const rows = executeSqliteQuerySync(tx.db, orderedSelect).rows;
          let tombstonedCorruptRow = false;
          for (const row of rows) {
            const rec = baseRecord(row);
            if (rec === null) {
              if (corruptReconciliations >= MAX_CORRUPT_RECONCILIATIONS_PER_CLAIM) continue;
              const didTombstone = tombstoneCorruptPayloadRow({
                db: tx.db,
                row,
                expectedStatus: "pending",
                failedAt: transitionAt,
              });
              tombstonedCorruptRow = didTombstone || tombstonedCorruptRow;
              if (didTombstone) corruptReconciliations += 1;
              continue;
            }
            const laneKey =
              row.lane_key ??
              (claimOptions?.deriveLaneKey ? claimOptions.deriveLaneKey(rec) : void 0);
            if (!laneKey || !effectiveBlocked.has(laneKey)) {
              selected = {
                row,
                record: rec,
              };
              break;
            }
          }
          if (
            selected ||
            !tombstonedCorruptRow ||
            corruptReconciliations >= MAX_CORRUPT_RECONCILIATIONS_PER_CLAIM
          )
            break;
        }
        if (!selected) return null;
        const derivedLaneKey =
          selected.row.lane_key ??
          (claimOptions?.deriveLaneKey ? claimOptions.deriveLaneKey(selected.record) : void 0);
        const token = randomUUID();
        const ownerId = normalizePart(claimOptions?.ownerId, `${process.pid}`);
        if (
          affectedRows(
            executeSqliteQuerySync(
              tx.db,
              kysely
                .updateTable("channel_ingress_events")
                .set({
                  status: "claimed",
                  claim_token: token,
                  claim_owner: ownerId,
                  claimed_at: transitionAt,
                  ...(derivedLaneKey ? { lane_key: derivedLaneKey } : {}),
                  updated_at: transitionAt,
                })
                .where("queue_name", "=", queueName)
                .where("event_id", "=", selected.row.event_id)
                .where("status", "=", "pending"),
            ),
          ) === 0
        )
          return null;
        const row = selectRow(tx.db, queueName, selected.row.event_id);
        return row ? claimedRecord(row) : null;
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const claim = async (id, claimOptions) => {
    const eventId = normalizePart(id, "");
    if (!eventId) throw new Error("Channel ingress event id cannot be empty");
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const kysely = getChannelIngressKysely(tx.db);
        const transitionAt = now();
        const pendingRow = selectRow(tx.db, queueName, eventId);
        if (!pendingRow || pendingRow.status !== "pending") return null;
        if (baseRecord(pendingRow) === null) {
          tombstoneCorruptPayloadRow({
            db: tx.db,
            row: pendingRow,
            expectedStatus: "pending",
            failedAt: transitionAt,
          });
          return null;
        }
        const token = randomUUID();
        const ownerId = normalizePart(claimOptions?.ownerId, `${process.pid}`);
        if (
          affectedRows(
            executeSqliteQuerySync(
              tx.db,
              kysely
                .updateTable("channel_ingress_events")
                .set({
                  status: "claimed",
                  claim_token: token,
                  claim_owner: ownerId,
                  claimed_at: transitionAt,
                  updated_at: transitionAt,
                })
                .where("queue_name", "=", queueName)
                .where("event_id", "=", eventId)
                .where("status", "=", "pending"),
            ),
          ) === 0
        )
          return null;
        const row = selectRow(tx.db, queueName, eventId);
        return row ? claimedRecord(row) : null;
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const refreshClaim = async (claimRef, refreshOptions) => {
    const eventId = idFrom(claimRef);
    const refreshedAt = refreshOptions?.refreshedAt ?? now();
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const kysely = getChannelIngressKysely(tx.db);
        return (
          affectedRows(
            executeSqliteQuerySync(
              tx.db,
              kysely
                .updateTable("channel_ingress_events")
                .set({
                  claimed_at: refreshedAt,
                  updated_at: refreshedAt,
                })
                .where("queue_name", "=", queueName)
                .where("event_id", "=", eventId)
                .where("status", "=", "claimed")
                .where("claim_token", "=", claimRef.claim.token),
            ),
          ) > 0
        );
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const releaseClaimIfStillStale = async (claimRef, releaseOptions) => {
    const eventId = idFrom(claimRef);
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const kysely = getChannelIngressKysely(tx.db);
        return (
          affectedRows(
            executeSqliteQuerySync(
              tx.db,
              kysely
                .updateTable("channel_ingress_events")
                .set((eb) => ({
                  status: "pending",
                  claim_token: null,
                  claim_owner: null,
                  claimed_at: null,
                  attempts: eb("attempts", "+", 1),
                  last_attempt_at: releaseOptions.releasedAt,
                  updated_at: releaseOptions.releasedAt,
                }))
                .where("queue_name", "=", queueName)
                .where("event_id", "=", eventId)
                .where("status", "=", "claimed")
                .where("claim_token", "=", claimRef.claim.token)
                .where("claimed_at", "<=", releaseOptions.cutoff),
            ),
          ) > 0
        );
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const recoverStaleClaims = async (recoverOptions) => {
    const current = recoverOptions?.now ?? now();
    const cutoff = current - Math.max(0, Math.floor(recoverOptions?.staleMs ?? 0));
    const database = openStateDatabase(options.stateDir);
    const claimedRows = executeSqliteQuerySync(
      database.db,
      getChannelIngressKysely(database.db)
        .selectFrom("channel_ingress_events")
        .selectAll()
        .where("queue_name", "=", queueName)
        .where("status", "=", "claimed")
        .where("claimed_at", "<=", cutoff),
    ).rows;
    let recovered = 0;
    for (const row of claimedRows) {
      const claimRec = claimedRecord(row);
      if (claimRec === null) {
        const shouldRecoverCorrupt = recoverOptions?.shouldRecoverCorrupt;
        if (shouldRecoverCorrupt) {
          if (!(await shouldRecoverCorrupt(corruptClaimRecord(row)))) continue;
        } else if (recoverOptions?.shouldRecover) continue;
        if (
          runOpenClawStateWriteTransaction(
            (tx) =>
              tombstoneCorruptPayloadRow({
                db: tx.db,
                row,
                expectedStatus: "claimed",
                failedAt: current,
                staleCutoff: cutoff,
              }),
            { path: database.path },
          )
        )
          recovered += 1;
        continue;
      }
      if (recoverOptions?.shouldRecover && !(await recoverOptions.shouldRecover(claimRec)))
        continue;
      if (
        await releaseClaimIfStillStale(claimRec, {
          cutoff,
          releasedAt: current,
        })
      )
        recovered += 1;
    }
    return recovered;
  };
  const complete = async (idOrClaim, completeOptions) => {
    const eventId = idFrom(idOrClaim);
    const token = claimTokenFrom(idOrClaim);
    const completedAt = completeOptions?.completedAt ?? now();
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const kysely = getChannelIngressKysely(tx.db);
        const baseUpdate = kysely
          .updateTable("channel_ingress_events")
          .set({
            status: "completed",
            completed_at: completedAt,
            completed_metadata_json:
              completeOptions?.metadata === void 0
                ? null
                : JSON.stringify(completeOptions.metadata),
            payload_json: "null",
            metadata_json: null,
            claim_token: null,
            claim_owner: null,
            claimed_at: null,
            last_attempt_at: null,
            last_error: null,
            updated_at: completedAt,
          })
          .where("queue_name", "=", queueName)
          .where("event_id", "=", eventId);
        const update =
          token === null
            ? baseUpdate.where("status", "=", "pending")
            : baseUpdate.where("status", "=", "claimed").where("claim_token", "=", token);
        if (affectedRows(executeSqliteQuerySync(tx.db, update)) > 0) return true;
        if (token !== null) return false;
        return (
          affectedRows(
            executeSqliteQuerySync(
              tx.db,
              kysely
                .insertInto("channel_ingress_events")
                .values({
                  queue_name: queueName,
                  event_id: eventId,
                  channel_id: channelId,
                  account_id: accountId,
                  status: "completed",
                  lane_key: null,
                  payload_json: "null",
                  metadata_json: null,
                  received_at: completedAt,
                  updated_at: completedAt,
                  attempts: 0,
                  completed_at: completedAt,
                  completed_metadata_json:
                    completeOptions?.metadata === void 0
                      ? null
                      : JSON.stringify(completeOptions.metadata),
                })
                .onConflict((conflict) => conflict.columns(["queue_name", "event_id"]).doNothing()),
            ),
          ) > 0
        );
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const release = async (idOrClaim, releaseOptions) => {
    const eventId = idFrom(idOrClaim);
    const token = claimTokenFrom(idOrClaim);
    const releasedAt = releaseOptions?.releasedAt ?? now();
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const baseUpdate = getChannelIngressKysely(tx.db)
          .updateTable("channel_ingress_events")
          .set((eb) => ({
            status: "pending",
            claim_token: null,
            claim_owner: null,
            claimed_at: null,
            ...(releaseOptions?.recordAttempt === false
              ? {}
              : {
                  attempts: eb("attempts", "+", 1),
                  last_attempt_at: releasedAt,
                }),
            ...(releaseOptions?.lastError === void 0
              ? {}
              : { last_error: releaseOptions.lastError }),
            updated_at: releasedAt,
          }))
          .where("queue_name", "=", queueName)
          .where("event_id", "=", eventId);
        const update =
          token === null
            ? baseUpdate.where("status", "=", "pending")
            : baseUpdate.where("status", "=", "claimed").where("claim_token", "=", token);
        return affectedRows(executeSqliteQuerySync(tx.db, update)) > 0;
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const fail = async (idOrClaim, failOptions) => {
    const eventId = idFrom(idOrClaim);
    const token = claimTokenFrom(idOrClaim);
    const failedAt = failOptions.failedAt ?? now();
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const baseUpdate = getChannelIngressKysely(tx.db)
          .updateTable("channel_ingress_events")
          .set({
            status: "failed",
            failed_at: failedAt,
            failed_reason: failOptions.reason,
            last_error: failOptions.message ?? null,
            payload_json: "null",
            metadata_json: null,
            claim_token: null,
            claim_owner: null,
            claimed_at: null,
            updated_at: failedAt,
          })
          .where("queue_name", "=", queueName)
          .where("event_id", "=", eventId);
        const update =
          token === null
            ? baseUpdate.where("status", "=", "pending")
            : baseUpdate.where("status", "=", "claimed").where("claim_token", "=", token);
        return affectedRows(executeSqliteQuerySync(tx.db, update)) > 0;
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const deleteEntry = async (idOrRecord) => {
    const eventId = idFrom(idOrRecord);
    const token = claimTokenFrom(idOrRecord);
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const baseDelete = getChannelIngressKysely(tx.db)
          .deleteFrom("channel_ingress_events")
          .where("queue_name", "=", queueName)
          .where("event_id", "=", eventId);
        const deleteQuery =
          token === null
            ? baseDelete.where("status", "=", "pending")
            : baseDelete.where("status", "=", "claimed").where("claim_token", "=", token);
        return affectedRows(executeSqliteQuerySync(tx.db, deleteQuery)) > 0;
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  const prune = async (pruneOptions) => {
    const current = pruneOptions?.now ?? now();
    const pendingCutoff =
      pruneOptions?.pendingTtlMs === void 0 ? null : current - pruneOptions.pendingTtlMs;
    const completedCutoff =
      pruneOptions?.completedTtlMs === void 0 ? null : current - pruneOptions.completedTtlMs;
    const failedCutoff =
      pruneOptions?.failedTtlMs === void 0 ? null : current - pruneOptions.failedTtlMs;
    const pendingMaxEntries = normalizeMaxEntries(pruneOptions?.pendingMaxEntries);
    const completedMaxEntries = normalizeMaxEntries(pruneOptions?.completedMaxEntries);
    const failedMaxEntries = normalizeMaxEntries(pruneOptions?.failedMaxEntries);
    const protectIds = normalizedProtectedIds(pruneOptions?.protectIds);
    if (
      pendingCutoff === null &&
      completedCutoff === null &&
      failedCutoff === null &&
      pendingMaxEntries === null &&
      completedMaxEntries === null &&
      failedMaxEntries === null
    )
      return 0;
    return runOpenClawStateWriteTransaction(
      (tx) => {
        const kysely = getChannelIngressKysely(tx.db);
        let deleted = 0;
        if (pendingCutoff !== null) {
          let deleteQuery = kysely
            .deleteFrom("channel_ingress_events")
            .where("queue_name", "=", queueName)
            .where("status", "=", "pending")
            .where("updated_at", "<", pendingCutoff);
          if (protectIds.length > 0)
            deleteQuery = deleteQuery.where("event_id", "not in", protectIds);
          deleted += affectedRows(executeSqliteQuerySync(tx.db, deleteQuery));
        }
        if (completedCutoff !== null) {
          let deleteQuery = kysely
            .deleteFrom("channel_ingress_events")
            .where("queue_name", "=", queueName)
            .where("status", "=", "completed")
            .where("completed_at", "<", completedCutoff);
          if (protectIds.length > 0)
            deleteQuery = deleteQuery.where("event_id", "not in", protectIds);
          deleted += affectedRows(executeSqliteQuerySync(tx.db, deleteQuery));
        }
        if (failedCutoff !== null) {
          let deleteQuery = kysely
            .deleteFrom("channel_ingress_events")
            .where("queue_name", "=", queueName)
            .where("status", "=", "failed")
            .where("failed_at", "<", failedCutoff);
          if (protectIds.length > 0)
            deleteQuery = deleteQuery.where("event_id", "not in", protectIds);
          deleted += affectedRows(executeSqliteQuerySync(tx.db, deleteQuery));
        }
        const pruneMaxEntries = (status, maxEntries) => {
          if (maxEntries === null) return;
          const batchSize = 500;
          const protectedSet = new Set(protectIds);
          while (true) {
            const ids = executeSqliteQuerySync(
              tx.db,
              kysely
                .selectFrom("channel_ingress_events")
                .select("event_id")
                .where("queue_name", "=", queueName)
                .where("status", "=", status)
                .orderBy("updated_at", "desc")
                .orderBy("event_id", "desc")
                .limit(maxEntries + batchSize),
            )
              .rows.slice(maxEntries)
              .map((row) => row.event_id)
              .filter((id) => !protectedSet.has(id));
            if (ids.length === 0) return;
            deleted += affectedRows(
              executeSqliteQuerySync(
                tx.db,
                kysely
                  .deleteFrom("channel_ingress_events")
                  .where("queue_name", "=", queueName)
                  .where("status", "=", status)
                  .where("event_id", "in", ids),
              ),
            );
          }
        };
        pruneMaxEntries("pending", pendingMaxEntries);
        pruneMaxEntries("completed", completedMaxEntries);
        pruneMaxEntries("failed", failedMaxEntries);
        return deleted;
      },
      { path: openStateDatabase(options.stateDir).path },
    );
  };
  return {
    enqueue,
    listPending,
    listClaims,
    claimNext,
    claim,
    refreshClaim,
    complete,
    release,
    fail,
    delete: deleteEntry,
    recoverStaleClaims,
    prune,
  };
}
//#endregion
//#region src/plugins/registry-runtime.ts
const PLUGIN_GATEWAY_SESSION_MUTATION_METHODS = /* @__PURE__ */ new Set([
  "agent",
  "chat.abort",
  "chat.inject",
  "chat.send",
  "message.action",
  "plugins.sessionAction",
  "send",
  "sessions.abort",
  "sessions.compact",
  "sessions.compaction.branch",
  "sessions.compaction.restore",
  "sessions.create",
  "sessions.delete",
  "sessions.patch",
  "sessions.pluginPatch",
  "sessions.reset",
  "sessions.send",
  "sessions.steer",
  "wake",
]);
const PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS = /* @__PURE__ */ new Set([
  "sessions.cleanup",
  "sessions.groups.delete",
  "sessions.groups.rename",
]);
function createPluginRuntimeResolver(state) {
  const { registry, registryParams } = state;
  const pluginRuntimeById = /* @__PURE__ */ new Map();
  const pluginRuntimeRecordById = /* @__PURE__ */ new Map();
  const addPluginRuntimeResolutionContext = (params) => {
    const { error, pluginId, prop } = params;
    if (
      error instanceof Error &&
      error.message.startsWith("Unable to resolve plugin runtime module") &&
      !error.message.includes("pluginRuntimeContext=")
    ) {
      const record =
        pluginRuntimeRecordById.get(pluginId) ??
        registry.plugins.find((entry) => entry.id === pluginId);
      const propName =
        typeof prop === "symbol" ? (prop.description ?? prop.toString()) : String(prop);
      error.message = [
        error.message,
        `pluginRuntimeContext=pluginId:${pluginId}`,
        `property:${propName}`,
        ...(record?.source ? [`source:${record.source}`] : []),
      ].join("; ");
    }
    throw error;
  };
  const resolvePluginRuntime = (pluginId) => {
    const cached = pluginRuntimeById.get(pluginId);
    if (cached) return cached;
    const resolveHarnessRegistration = (harnessId) => {
      const normalizedHarnessId = normalizeOptionalAgentRuntimeId(harnessId);
      return normalizedHarnessId
        ? registry.agentHarnesses.find(
            (entry) => normalizeOptionalAgentRuntimeId(entry.harness.id) === normalizedHarnessId,
          )
        : void 0;
    };
    const resolveHarnessRegistrationForSessionKey = (sessionKey) =>
      registry.agentHarnesses.find((entry) => {
        const rawHarnessId = normalizeOptionalString(entry.harness.id)?.toLowerCase();
        return (
          rawHarnessId === normalizeOptionalAgentRuntimeId(rawHarnessId) &&
          isAgentHarnessSessionKeyOwnedBy(sessionKey, rawHarnessId)
        );
      });
    const assertOwnedHarness = (harnessId, action) => {
      const normalizedHarnessId = normalizeOptionalAgentRuntimeId(harnessId);
      if (!normalizedHarnessId)
        throw new Error(
          `Plugin "${pluginId}" must provide a registered agent harness id to ${action}.`,
        );
      const registration = resolveHarnessRegistration(normalizedHarnessId);
      if (!registration)
        throw new Error(
          `Plugin "${pluginId}" must register agent harness "${normalizedHarnessId}" before it can ${action}.`,
        );
      if (registration.pluginId !== pluginId)
        throw new Error(
          `Agent harness "${normalizedHarnessId}" is owned by plugin "${registration.pluginId}", not "${pluginId}".`,
        );
      return normalizedHarnessId;
    };
    const assertReservedSessionKeyOwned = (sessionKey, action) => {
      const normalizedSessionKey = normalizeOptionalString(sessionKey);
      if (!normalizedSessionKey || !isAgentHarnessSessionKey(normalizedSessionKey)) return;
      const registration = resolveHarnessRegistrationForSessionKey(normalizedSessionKey);
      if (!registration)
        throw new Error(
          `Plugin "${pluginId}" cannot ${action} reserved agent harness session "${normalizedSessionKey}" because its harness is not registered.`,
        );
      if (registration.pluginId !== pluginId)
        throw new Error(
          `Plugin "${pluginId}" cannot ${action} reserved agent harness session "${normalizedSessionKey}" owned by plugin "${registration.pluginId}".`,
        );
    };
    const resolveLockedSessionHarnessRegistration = (sessionKey, entry, action) => {
      if (entry.modelSelectionLocked !== true) return;
      const harnessId = normalizeOptionalAgentRuntimeId(entry.agentHarnessId);
      if (!harnessId) {
        const pluginOwnerId = normalizeOptionalString(entry.pluginOwnerId);
        if (pluginOwnerId) return { ownerPluginId: pluginOwnerId };
        throw new Error(
          `Plugin "${pluginId}" must provide a registered agent harness id to ${action} locked sessions.`,
        );
      }
      const registration = resolveHarnessRegistration(harnessId);
      if (!registration)
        throw new Error(
          `Plugin "${pluginId}" must register agent harness "${harnessId}" before it can ${action} locked sessions.`,
        );
      if (
        isAgentHarnessSessionKey(sessionKey) &&
        !isAgentHarnessSessionKeyOwnedBy(sessionKey, harnessId)
      )
        throw new Error(
          `Locked session "${sessionKey}" belongs to agent harness "${harnessId}", which does not match its reserved session key.`,
        );
      return {
        ownerPluginId: registration.pluginId,
        harnessId,
        registration,
      };
    };
    const assertLockedSessionEntryOwned = (sessionKey, entry, action) => {
      const resolved = resolveLockedSessionHarnessRegistration(sessionKey, entry, action);
      if (!resolved) return;
      if (resolved.ownerPluginId !== pluginId)
        throw new Error(
          `Locked session "${sessionKey}" is owned by plugin "${resolved.ownerPluginId}", not "${pluginId}".`,
        );
    };
    const assertSessionEntryOwned = (params) => {
      if (params.entry) {
        assertLockedSessionEntryOwned(params.sessionKey, params.entry, params.action);
        return;
      }
      assertReservedSessionKeyOwned(params.sessionKey, params.action);
    };
    const assertStoredSessionEntryOwned = (params) => {
      const entry = registryParams.runtime.agent.session.getSessionEntry({
        sessionKey: params.sessionKey,
        readConsistency: "latest",
        ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
        ...(params.env !== void 0 ? { env: params.env } : {}),
        ...(params.storePath !== void 0 ? { storePath: params.storePath } : {}),
      });
      assertSessionEntryOwned({
        action: params.action,
        entry,
        sessionKey: params.sessionKey,
      });
      return entry;
    };
    const resolveStoredSessionExecutionOwner = (params) => {
      const entry = registryParams.runtime.agent.session.getSessionEntry({
        sessionKey: params.sessionKey,
        readConsistency: "latest",
        ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
        ...(params.storePath !== void 0 ? { storePath: params.storePath } : {}),
      });
      const locked = entry
        ? resolveLockedSessionHarnessRegistration(params.sessionKey, entry, params.action)
        : void 0;
      if (!entry || !locked || locked.ownerPluginId === pluginId) {
        assertSessionEntryOwned({
          action: params.action,
          entry,
          sessionKey: params.sessionKey,
        });
        return;
      }
      const registration = "registration" in locked ? locked.registration : void 0;
      if (!registration)
        throw new Error(
          `Locked session "${params.sessionKey}" is owned by plugin "${locked.ownerPluginId}", not "${pluginId}".`,
        );
      if (!registration.harness.delegatedExecutionPluginIds?.includes(pluginId))
        assertLockedSessionEntryOwned(params.sessionKey, entry, params.action);
      return locked.ownerPluginId;
    };
    const assertSessionIdentitiesOwned = (params) => {
      const agentId = normalizeOptionalString(params.agentId);
      const storePath = normalizeOptionalString(params.storePath);
      const sessionKeys = /* @__PURE__ */ new Set();
      for (const value of params.sessionKeys ?? []) {
        const sessionKey = normalizeOptionalString(value);
        if (sessionKey) sessionKeys.add(sessionKey);
      }
      for (const sessionKey of sessionKeys)
        assertStoredSessionEntryOwned({
          action: params.action,
          sessionKey,
          ...(agentId ? { agentId } : {}),
          ...(storePath ? { storePath } : {}),
        });
      const sessionIds = /* @__PURE__ */ new Set();
      for (const value of params.sessionIds ?? []) {
        const sessionId = normalizeOptionalString(value);
        if (sessionId) sessionIds.add(sessionId);
      }
      const sessionFiles = /* @__PURE__ */ new Set();
      for (const value of params.sessionFiles ?? []) {
        const sessionFile = normalizeOptionalString(value);
        if (sessionFile) sessionFiles.add(sessionFile);
      }
      if (sessionIds.size === 0 && sessionFiles.size === 0) return;
      const entries = registryParams.runtime.agent.session.listSessionEntries({
        ...(agentId ? { agentId } : {}),
        ...(storePath ? { storePath } : {}),
      });
      for (const { sessionKey, entry } of entries)
        if (
          sessionIds.has(entry.sessionId) ||
          (entry.sessionFile ? sessionFiles.has(entry.sessionFile) : false)
        )
          assertSessionEntryOwned({
            action: params.action,
            entry,
            sessionKey,
          });
    };
    const resolveRunSessionExecutionOwner = (params) => {
      const target = params.sessionTarget;
      const targetSessionKey = normalizeOptionalString(target?.sessionKey);
      const directSessionKey = normalizeOptionalString(params.sessionKey);
      if (targetSessionKey && directSessionKey && targetSessionKey !== directSessionKey)
        throw new Error("Delegated agent execution requires one exact session key.");
      const sessionKey = targetSessionKey ?? directSessionKey;
      const storePath = normalizeOptionalString(target?.storePath);
      const agentId = normalizeOptionalString(target?.agentId ?? params.agentId);
      const entry = sessionKey
        ? registryParams.runtime.agent.session.getSessionEntry({
            sessionKey,
            readConsistency: "latest",
            ...(agentId ? { agentId } : {}),
            ...(storePath ? { storePath } : {}),
          })
        : void 0;
      const targetSessionId = normalizeOptionalString(target?.sessionId);
      const targetAgentId = normalizeOptionalString(target?.agentId);
      const directSessionId = normalizeOptionalString(params.sessionId);
      const directAgentId = normalizeOptionalString(params.agentId);
      const sessionFile = normalizeOptionalString(params.sessionFile);
      if (target) {
        if (
          !(
            targetSessionKey === sessionKey &&
            Boolean(storePath) &&
            Boolean(entry) &&
            targetSessionId === entry?.sessionId &&
            directSessionId === entry?.sessionId &&
            targetAgentId === directAgentId &&
            (!sessionFile || sessionFile === entry?.sessionFile)
          )
        )
          throw new Error(
            `Plugin "${pluginId}" may execute a persisted session only with its exact session target identity.`,
          );
      }
      const locked =
        sessionKey && entry
          ? resolveLockedSessionHarnessRegistration(sessionKey, entry, "run")
          : void 0;
      const ownerPluginId = locked?.ownerPluginId;
      if (locked && entry && sessionKey && ownerPluginId !== pluginId) {
        const registration = "registration" in locked ? locked.registration : void 0;
        if (!registration)
          throw new Error(
            `Locked session "${sessionKey}" is owned by plugin "${locked.ownerPluginId}", not "${pluginId}".`,
          );
        if (!registration.harness.delegatedExecutionPluginIds?.includes(pluginId))
          assertLockedSessionEntryOwned(sessionKey, entry, "run");
        const requestedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
        const requestedRuntimeOverride = normalizeOptionalAgentRuntimeId(
          params.agentHarnessRuntimeOverride,
        );
        const identityMatches =
          Boolean(target) &&
          targetSessionId === entry.sessionId &&
          directSessionId === entry.sessionId;
        const harnessMatches =
          params.modelSelectionLocked === true &&
          requestedHarnessId === locked.harnessId &&
          requestedRuntimeOverride === locked.harnessId;
        if (!identityMatches || !harnessMatches)
          throw new Error(
            `Plugin "${pluginId}" may execute locked session "${sessionKey}" only with its exact persisted identity and harness.`,
          );
        return ownerPluginId;
      }
      assertSessionIdentitiesOwned({
        action: "run",
        agentId: target?.agentId ?? params.agentId,
        sessionFiles: [params.sessionFile],
        sessionIds: [target?.sessionId ?? params.sessionId],
        sessionKeys: [target?.sessionKey ?? params.sessionKey],
        storePath: target?.storePath,
      });
    };
    const assertGatewaySessionRequestOwned = (method, params) => {
      if (PLUGIN_GATEWAY_GLOBAL_SESSION_MUTATION_METHODS.has(method))
        throw new Error(`Plugin "${pluginId}" cannot request global session mutation "${method}".`);
      if (!PLUGIN_GATEWAY_SESSION_MUTATION_METHODS.has(method)) return;
      const request = params ?? {};
      const sessionKeys = [request.sessionKey, request.key, request.parentSessionKey];
      const sessionIds = [request.sessionId];
      assertSessionIdentitiesOwned({
        action: `request gateway method "${method}" for`,
        agentId: request.agentId,
        sessionIds,
        sessionKeys,
      });
      if (
        method === "sessions.abort" &&
        !sessionKeys.some((value) => normalizeOptionalString(value)) &&
        !sessionIds.some((value) => normalizeOptionalString(value))
      )
        throw new Error(
          `Plugin "${pluginId}" must provide a session key when requesting gateway method "${method}".`,
        );
    };
    const assertStoreEntryOwned = (params) => {
      if (params.entry.modelSelectionLocked === true) {
        assertLockedSessionEntryOwned(params.sessionKey, params.entry, params.action);
        return;
      }
      if (params.before?.modelSelectionLocked === true) {
        assertLockedSessionEntryOwned(params.sessionKey, params.before, params.action);
        return;
      }
      if (isAgentHarnessSessionKey(params.sessionKey) && !params.before)
        assertReservedSessionKeyOwned(params.sessionKey, params.action);
    };
    let scopedAgentRuntime;
    const runtime = new Proxy(registryParams.runtime, {
      get(target, prop, receiver) {
        const runWithPluginScope = (run) => {
          const record =
            pluginRuntimeRecordById.get(pluginId) ??
            registry.plugins.find((entry) => entry.id === pluginId);
          return record?.source
            ? withPluginRuntimePluginScope(
                {
                  pluginId,
                  pluginSource: record.source,
                  pluginOrigin: record.origin,
                  pluginTrustedOfficialInstall: record.trustedOfficialInstall,
                },
                run,
              )
            : withPluginRuntimePluginScope({ pluginId }, run);
        };
        const getRuntimeProperty = () => {
          try {
            return Reflect.get(target, prop, receiver);
          } catch (error) {
            return addPluginRuntimeResolutionContext({
              error,
              pluginId,
              prop,
            });
          }
        };
        if (prop === "state") {
          const baseState = getRuntimeProperty();
          const assertPluginStateAllowed = () => {
            const record =
              pluginRuntimeRecordById.get(pluginId) ??
              registry.plugins.find((entry) => entry.id === pluginId);
            if (record?.origin !== "bundled" && record?.trustedOfficialInstall !== true)
              throw new Error(
                "openKeyedStore is only available for trusted plugins in this release.",
              );
          };
          return {
            ...baseState,
            openKeyedStore: (options) => {
              assertPluginStateAllowed();
              return createPluginStateKeyedStore(pluginId, options);
            },
            openSyncKeyedStore: (options) => {
              assertPluginStateAllowed();
              return createPluginStateSyncKeyedStore(pluginId, options);
            },
            openChannelIngressQueue: (options) => {
              assertPluginStateAllowed();
              const stateDir = options?.stateDir ?? baseState.resolveStateDir();
              return createChannelIngressQueue({
                ...options,
                channelId: pluginId,
                stateDir,
              });
            },
          };
        }
        if (prop === "config") {
          const config = getRuntimeProperty();
          return {
            ...config,
            current: () => runWithPluginScope(() => config.current()),
            mutateConfigFile: (params) => runWithPluginScope(() => config.mutateConfigFile(params)),
            replaceConfigFile: (params) =>
              runWithPluginScope(() => config.replaceConfigFile(params)),
          };
        }
        if (prop === "llm") {
          const llm = getRuntimeProperty();
          return {
            acquireLocalService: (...args) =>
              withPluginRuntimePluginIdScope(pluginId, () => llm.acquireLocalService(...args)),
            complete: (params) =>
              withPluginRuntimePluginIdScope(pluginId, () => llm.complete(params)),
          };
        }
        if (prop === "gateway") {
          const gateway = getRuntimeProperty();
          return {
            isAvailable: () => runWithPluginScope(() => gateway.isAvailable()),
            request: async (method, params, options) =>
              await runWithPluginScope(async () => {
                assertGatewaySessionRequestOwned(method, params);
                return await gateway.request(method, params, options);
              }),
          };
        }
        if (prop === "nodes") {
          const nodes = getRuntimeProperty();
          return {
            list: (params) => runWithPluginScope(() => nodes.list(params)),
            invoke: (params) => runWithPluginScope(() => nodes.invoke(params)),
          };
        }
        if (prop === "agent") {
          if (scopedAgentRuntime) return scopedAgentRuntime;
          const agent = getRuntimeProperty();
          const session = agent.session;
          const scopedSession = {
            resolveStorePath: session.resolveStorePath,
            getSessionEntry: session.getSessionEntry,
            listSessionEntries: session.listSessionEntries,
            createSessionEntry: async (params) =>
              await runWithPluginScope(async () => {
                if (
                  "agentHarnessId" in params.initialEntry ===
                  "cliBackendId" in params.initialEntry
                )
                  throw new Error(
                    `Plugin "${pluginId}" session creation requires exactly one runtime owner.`,
                  );
                if ("agentHarnessId" in params.initialEntry) {
                  assertOwnedHarness(params.initialEntry.agentHarnessId, "create its sessions");
                  assertReservedSessionKeyOwned(params.key, "create");
                  return await session.createSessionEntry(params);
                }
                const cliInitial = params.initialEntry;
                const backend = registry.cliBackends.find(
                  (entry) => entry.backend.id === cliInitial.cliBackendId,
                );
                if (!backend || backend.pluginId !== pluginId)
                  throw new Error(
                    `Plugin "${pluginId}" must own CLI backend "${cliInitial.cliBackendId}" to create its sessions.`,
                  );
                if (!params.key.startsWith(`plugin:${pluginId}:`))
                  throw new Error(
                    `Plugin "${pluginId}" session keys must start with "plugin:${pluginId}:".`,
                  );
                return await session.createSessionEntry({
                  ...params,
                  initialEntry: {
                    ...cliInitial,
                    pluginOwnerId: pluginId,
                  },
                });
              }),
            patchSessionEntry: async (params) =>
              await runWithPluginScope(async () => {
                assertStoredSessionEntryOwned({
                  action: "patch",
                  sessionKey: params.sessionKey,
                  ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
                  ...(params.env !== void 0 ? { env: params.env } : {}),
                  ...(params.storePath !== void 0 ? { storePath: params.storePath } : {}),
                });
                return await session.patchSessionEntry({
                  ...params,
                  update: async (entry, context) => {
                    const patch = await params.update(entry, context);
                    if (!patch) return patch;
                    const next = params.replaceEntry
                      ? patch
                      : {
                          ...entry,
                          ...patch,
                        };
                    assertStoreEntryOwned({
                      action: "patch",
                      before: context.existingEntry ?? entry,
                      entry: next,
                      sessionKey: params.sessionKey,
                    });
                    return patch;
                  },
                });
              }),
            upsertSessionEntry: async (params) =>
              await runWithPluginScope(async () => {
                const before = assertStoredSessionEntryOwned({
                  action: "upsert",
                  sessionKey: params.sessionKey,
                  ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
                  ...(params.env !== void 0 ? { env: params.env } : {}),
                  ...(params.storePath !== void 0 ? { storePath: params.storePath } : {}),
                });
                assertStoreEntryOwned({
                  action: "upsert",
                  before,
                  entry: params.entry,
                  sessionKey: params.sessionKey,
                });
                await session.upsertSessionEntry(params);
              }),
            runWithWorkAdmission: async (params, run) =>
              await runWithPluginScope(async () => {
                const resolveCurrentExecutionOwner = () =>
                  resolveStoredSessionExecutionOwner({
                    action: "admit work on",
                    sessionKey: params.sessionKey,
                    storePath: params.storePath,
                  });
                const ownerPluginId = resolveCurrentExecutionOwner();
                return await (
                  ownerPluginId ? resolvePluginRuntime(ownerPluginId).agent.session : session
                ).runWithWorkAdmission(params, async (signal) => {
                  if (resolveCurrentExecutionOwner() !== ownerPluginId)
                    throw new Error(
                      `Session "${params.sessionKey}" changed execution ownership while starting work.`,
                    );
                  return await runWithPluginScope(() => run(signal));
                });
              }),
            updateSessionStoreEntry: async (params) =>
              await runWithPluginScope(async () => {
                assertStoredSessionEntryOwned({
                  action: "update",
                  sessionKey: params.sessionKey,
                  storePath: params.storePath,
                });
                return await session.updateSessionStoreEntry({
                  ...params,
                  update: async (entry) => {
                    const patch = await params.update(entry);
                    if (!patch) return patch;
                    assertStoreEntryOwned({
                      action: "update",
                      before: entry,
                      entry: {
                        ...entry,
                        ...patch,
                      },
                      sessionKey: params.sessionKey,
                    });
                    return patch;
                  },
                });
              }),
          };
          const runEmbeddedAgent = async (params) =>
            await runWithPluginScope(async () => {
              const ownerPluginId = resolveRunSessionExecutionOwner(params);
              return ownerPluginId
                ? await resolvePluginRuntime(ownerPluginId).agent.runEmbeddedAgent(params)
                : await agent.runEmbeddedAgent(params);
            });
          const scopedAgent = Object.create(
            Object.getPrototypeOf(agent),
            Object.getOwnPropertyDescriptors(agent),
          );
          Object.defineProperties(scopedAgent, {
            runEmbeddedAgent: {
              configurable: true,
              enumerable: true,
              value: runEmbeddedAgent,
            },
            runEmbeddedPiAgent: {
              configurable: true,
              enumerable: true,
              value: runEmbeddedAgent,
            },
            session: {
              configurable: true,
              enumerable: true,
              value: scopedSession,
            },
          });
          scopedAgentRuntime = scopedAgent;
          return scopedAgentRuntime;
        }
        if (prop !== "subagent") return getRuntimeProperty();
        const subagent = getRuntimeProperty();
        return {
          run: async (params) =>
            await withPluginRuntimePluginIdScope(pluginId, async () => {
              assertSessionIdentitiesOwned({
                action: "run",
                sessionKeys: [params.sessionKey],
              });
              return await subagent.run(params);
            }),
          waitForRun: (params) =>
            withPluginRuntimePluginIdScope(pluginId, () => subagent.waitForRun(params)),
          getSessionMessages: (params) =>
            withPluginRuntimePluginIdScope(pluginId, () => subagent.getSessionMessages(params)),
          getSession: (params) =>
            withPluginRuntimePluginIdScope(pluginId, () => subagent.getSession(params)),
          deleteSession: async (params) =>
            await withPluginRuntimePluginIdScope(pluginId, async () => {
              assertStoredSessionEntryOwned({
                action: "delete",
                sessionKey: params.sessionKey,
              });
              await subagent.deleteSession(params);
            }),
        };
      },
    });
    pluginRuntimeById.set(pluginId, runtime);
    return runtime;
  };
  return {
    resolvePluginRuntime,
    setPluginRuntimeRecord: (record) => {
      pluginRuntimeRecordById.set(record.id, record);
    },
  };
}
//#endregion
//#region src/plugins/registry.ts
/** In-memory plugin registry builder and mutation API for plugin runtime registration. */
/**
 * Compose the registry state, domain registrars, scoped runtime, and plugin API.
 * Domain modules own validation and mutation; this function owns lifecycle wiring only.
 */
function createPluginRegistry(registryParams) {
  const state = createPluginRegistryState(registryParams);
  const registrars = createPluginRegistrars(state);
  const { createApi, deactivatePluginSideEffectGuards } = createPluginApiFactory(
    state,
    registrars,
    createPluginRuntimeResolver(state),
  );
  const rollbackPluginGlobalSideEffects = (pluginId) => {
    deactivatePluginSideEffectGuards(pluginId);
    if (registryParams.activateGlobalSideEffects === false) return;
    clearPluginCommandsForPlugin(pluginId);
    clearPluginInteractiveHandlersForPlugin(pluginId);
    clearCodeModeNamespacesForPlugin(pluginId);
    clearContextEnginesForOwner(`plugin:${pluginId}`);
    registrars.rollbackHooks(pluginId);
  };
  return {
    registry: state.registry,
    createApi,
    rollbackPluginGlobalSideEffects,
    pushDiagnostic: state.pushDiagnostic,
    registerTool: registrars.registerTool,
    registerChannel: registrars.registerChannel,
    registerHostedMediaResolver: registrars.registerHostedMediaResolver,
    registerProvider: registrars.registerProvider,
    registerWorkerProvider: registrars.registerWorkerProvider,
    registerModelCatalogProvider: registrars.registerModelCatalogProvider,
    registerAgentHarness: registrars.registerAgentHarness,
    registerCliBackend: registrars.registerCliBackend,
    registerTextTransforms: registrars.registerTextTransforms,
    registerEmbeddingProvider: registrars.registerEmbeddingProvider,
    registerSpeechProvider: registrars.registerSpeechProvider,
    registerRealtimeTranscriptionProvider: registrars.registerRealtimeTranscriptionProvider,
    registerRealtimeVoiceProvider: registrars.registerRealtimeVoiceProvider,
    registerMediaUnderstandingProvider: registrars.registerMediaUnderstandingProvider,
    registerTranscriptSourceProvider: registrars.registerTranscriptSourceProvider,
    registerImageGenerationProvider: registrars.registerImageGenerationProvider,
    registerVideoGenerationProvider: registrars.registerVideoGenerationProvider,
    registerMusicGenerationProvider: registrars.registerMusicGenerationProvider,
    registerWebSearchProvider: registrars.registerWebSearchProvider,
    registerMigrationProvider: registrars.registerMigrationProvider,
    registerGatewayMethod: registrars.registerGatewayMethod,
    registerSessionCatalog: registrars.registerSessionCatalog,
    registerCli: registrars.registerCli,
    registerReload: registrars.registerReload,
    registerNodeHostCommand: registrars.registerNodeHostCommand,
    registerSecurityAuditCollector: registrars.registerSecurityAuditCollector,
    registerService: registrars.registerService,
    registerCommand: registrars.registerCommand,
    registerSessionExtension: registrars.registerSessionExtension,
    registerTrustedToolPolicy: registrars.registerTrustedToolPolicy,
    registerToolMetadata: registrars.registerToolMetadata,
    registerControlUiDescriptor: registrars.registerControlUiDescriptor,
    registerRuntimeLifecycle: registrars.registerRuntimeLifecycle,
    registerAgentEventSubscription: registrars.registerAgentEventSubscription,
    registerSessionSchedulerJob: registrars.registerSessionSchedulerJob,
    registerSessionAction: registrars.registerSessionAction,
    registerHook: registrars.registerHook,
    registerTypedHook: registrars.registerTypedHook,
  };
}
//#endregion
export {
  getCompactionProvider as A,
  getMemoryEmbeddingProvider as C,
  registerMemoryEmbeddingProvider as D,
  listRegisteredMemoryEmbeddingProviders as E,
  restoreRegisteredCompactionProviders as M,
  restoreRegisteredMemoryEmbeddingProviders as O,
  clearMemoryEmbeddingProviders as S,
  listMemoryEmbeddingProviders as T,
  projectPluginSessionExtensionsSync as _,
  getVoiceProviderConfig as a,
  describeCodeModeNamespacesForPrompt as b,
  resolveSupportedVoiceModelRefs as c,
  voiceProviderSupportsModel as d,
  listMediaGenerationProviderModels as f,
  patchPluginSessionExtension as g,
  getPluginSessionExtensionStateSync as h,
  copyProviderCatalogResultProjection as i,
  listRegisteredCompactionProviders as j,
  clearCompactionProviders as k,
  resolveVoiceModelRefs as l,
  drainPluginNextTurnInjectionContext as m,
  listCodexAppServerExtensionFactories as n,
  providerMatchesId as o,
  synthesizeMediaGenerationCatalogEntries as p,
  projectProviderCatalogResultToUnifiedTextRows as r,
  resolvePrimaryVoiceProviderCandidate as s,
  createPluginRegistry as t,
  resolveVoiceProviderCandidates as u,
  createCodeModeApiVirtualFiles as v,
  getRegisteredMemoryEmbeddingProvider as w,
  toCodeModeJsonSafe as x,
  createCodeModeNamespaceRuntime as y,
};
