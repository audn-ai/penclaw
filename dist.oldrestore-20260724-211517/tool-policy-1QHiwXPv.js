import { r as sanitizeServerName } from "./agent-bundle-mcp-names-B9PLR-i_.js";
import { t as IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW } from "./sandbox-tool-policy-ClB7s2K0.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import {
  a as resolveCoreToolProfilePolicy,
  t as CORE_TOOL_GROUPS,
} from "./tool-catalog-fgOwzAUV.js";
//#region src/agents/tool-policy-shared.ts
/**
 * Shared runtime tool policy normalization.
 *
 * Keeps aliases, groups, profile expansion, and prefix matching consistent across allow/deny paths.
 */
const TOOL_NAME_ALIASES = {
  bash: "exec",
  "apply-patch": "apply_patch",
};
/** Core tool groups exposed to allow/deny policy config. */
const TOOL_GROUPS = { ...CORE_TOOL_GROUPS };
/** Normalizes a tool name or alias to the policy id used for matching. */
function normalizeToolName(name) {
  const normalized = normalizeLowercaseStringOrEmpty(name);
  return TOOL_NAME_ALIASES[normalized] ?? normalized;
}
/** Checks whether an in-progress prefix can still resolve to an allowed tool or alias. */
function couldNormalizeToolNamePrefixToAllowedTool(prefix, allowedToolNames) {
  const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
  if (!normalizedPrefix) return false;
  const allowed = /* @__PURE__ */ new Set();
  for (const toolName of allowedToolNames) {
    const normalizedToolName = normalizeToolName(toolName);
    const foldedToolName = normalizeLowercaseStringOrEmpty(toolName);
    if (normalizedToolName) allowed.add(normalizedToolName);
    if (foldedToolName) allowed.add(foldedToolName);
    if (
      normalizedToolName.startsWith(normalizedPrefix) ||
      foldedToolName.startsWith(normalizedPrefix)
    )
      return true;
  }
  const resolvedPrefix = normalizeToolName(normalizedPrefix);
  if (resolvedPrefix !== normalizedPrefix) {
    for (const toolName of allowed) if (toolName.startsWith(resolvedPrefix)) return true;
  }
  for (const [alias, toolName] of Object.entries(TOOL_NAME_ALIASES))
    if (alias.startsWith(normalizedPrefix) && allowed.has(toolName)) return true;
  return false;
}
/** Normalizes a configured allow/deny list while dropping blank entries. */
function normalizeToolList(list) {
  if (!list) return [];
  return list.map(normalizeToolName).filter(Boolean);
}
/** Expands named tool groups into concrete tool ids. */
function expandToolGroups(list) {
  const normalized = normalizeToolList(list);
  const expanded = [];
  for (const value of normalized) {
    const group = TOOL_GROUPS[value];
    if (group) {
      expanded.push(...group);
      continue;
    }
    expanded.push(value);
  }
  return uniqueStrings(expanded);
}
/** Resolves a built-in tool profile policy by id. */
function resolveToolProfilePolicy(profile) {
  return resolveCoreToolProfilePolicy(profile);
}
//#endregion
//#region src/agents/tool-policy.ts
/**
 * Tool allow/deny policy helpers.
 * Normalizes core and plugin tool groups, expands plugin entries, and extracts
 * explicit operator allow/deny lists.
 */
/** Synthetic allowlist entry that means "use default plugin tools". */
const DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY = "__openclaw_default_plugin_tools__";
/** Returns true when an allow policy is narrower than all/default plugin tools. */
function hasRestrictiveAllowPolicy(policy) {
  return (
    Array.isArray(policy?.allow) &&
    policy.allow.some((entry) => {
      const normalized = normalizeToolName(entry);
      return (
        Boolean(normalized) &&
        normalized !== "*" &&
        normalized !== "__openclaw_default_plugin_tools__"
      );
    })
  );
}
/** Replaces an allowlist with the normalized names of an effective tool array. */
function replaceWithEffectiveToolAllowlist(target, tools) {
  target.length = 0;
  const seen = /* @__PURE__ */ new Set();
  for (const tool of tools) {
    const normalized = normalizeToolName(tool.name);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    target.push(normalized);
  }
}
/** Collects explicit allow entries from layered policies. */
function collectExplicitAllowlist(policies) {
  const entries = [];
  for (const policy of policies) {
    if (!policy?.allow) continue;
    for (const value of policy.allow) {
      if (typeof value !== "string") continue;
      const trimmed = value.trim();
      if (trimmed === "*" && policy[IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW] === true) continue;
      if (trimmed) entries.push(trimmed);
    }
    if (policy[IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW] === true)
      entries.push(DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY);
  }
  return uniqueStrings(entries);
}
/** Collects explicit deny entries from layered policies. */
function collectExplicitDenylist(policies) {
  const entries = [];
  for (const policy of policies) {
    if (!policy?.deny) continue;
    for (const value of policy.deny) {
      if (typeof value !== "string") continue;
      const trimmed = value.trim();
      if (trimmed) entries.push(trimmed);
    }
  }
  return entries;
}
/** Builds plugin tool groups from tool metadata. */
function buildPluginToolGroups(params) {
  const all = [];
  const byPlugin = /* @__PURE__ */ new Map();
  for (const tool of params.tools) {
    const meta = params.toolMeta(tool);
    if (!meta) continue;
    const name = normalizeToolName(tool.name);
    all.push(name);
    const pluginId = normalizeOptionalLowercaseString(meta.pluginId);
    if (!pluginId) continue;
    const list = byPlugin.get(pluginId) ?? [];
    list.push(name);
    byPlugin.set(pluginId, list);
  }
  return {
    all,
    byPlugin,
  };
}
/** Expands group:plugins and plugin-id entries into concrete plugin tool names. */
function expandPluginGroups(list, groups) {
  if (!list || list.length === 0) return list;
  const expanded = [];
  for (const entry of list) {
    const normalized = normalizeToolName(entry);
    if (normalized === "group:plugins") {
      if (groups.all.length > 0) expanded.push(...groups.all);
      else expanded.push(normalized);
      continue;
    }
    const tools = groups.byPlugin.get(normalized);
    if (tools && tools.length > 0) {
      expanded.push(...tools);
      continue;
    }
    expanded.push(normalized);
  }
  return uniqueStrings(expanded);
}
/** Expands plugin groups in a policy while preserving undefined policies. */
function expandPolicyWithPluginGroups(policy, groups) {
  if (!policy) return;
  return {
    allow: expandPluginGroups(policy.allow, groups),
    deny: expandPluginGroups(policy.deny, groups),
  };
}
function buildDeclaredMcpToolPrefixes(serverNames) {
  const prefixes = /* @__PURE__ */ new Set();
  const usedNames = /* @__PURE__ */ new Set();
  for (const serverName of serverNames ?? []) {
    const prefix = normalizeToolName(sanitizeServerName(serverName, usedNames) + "__");
    if (prefix) prefixes.add(prefix);
  }
  return prefixes;
}
function normalizeDeclaredPluginIds(values) {
  return new Set(
    Array.from(values ?? [], (value) => normalizeOptionalLowercaseString(value)).filter((value) =>
      Boolean(value),
    ),
  );
}
function normalizeDeclaredToolNames(values) {
  return new Set(
    Array.from(values ?? [], (value) => normalizeToolName(value)).filter((value) => Boolean(value)),
  );
}
function isDeclaredMcpAllowlistEntry(entry, prefixes) {
  if (prefixes.size === 0) return false;
  if (entry === "bundle-mcp") return true;
  for (const prefix of prefixes)
    if (entry.length > prefix.length && entry.startsWith(prefix)) return true;
  return false;
}
/** Classifies allowlists as core, plugin-only, or unknown for diagnostics. */
function analyzeAllowlistByToolType(policy, groups, coreTools, declaredTools) {
  if (!policy?.allow || policy.allow.length === 0)
    return {
      policy,
      unknownAllowlist: [],
      pluginOnlyAllowlist: false,
    };
  const normalized = normalizeToolList(policy.allow);
  if (normalized.length === 0)
    return {
      policy,
      unknownAllowlist: [],
      pluginOnlyAllowlist: false,
    };
  const pluginIds = /* @__PURE__ */ new Set([
    ...groups.byPlugin.keys(),
    ...normalizeDeclaredPluginIds(declaredTools?.pluginIds),
  ]);
  const pluginTools = /* @__PURE__ */ new Set([
    ...groups.all,
    ...normalizeDeclaredToolNames(declaredTools?.pluginToolNames),
  ]);
  const mcpToolPrefixes = buildDeclaredMcpToolPrefixes(declaredTools?.mcpServerNames);
  const unknownAllowlist = [];
  let hasOnlyPluginEntries = true;
  for (const entry of normalized) {
    if (entry === "*") {
      hasOnlyPluginEntries = false;
      continue;
    }
    const isPluginEntry =
      entry === "group:plugins" ||
      pluginIds.has(entry) ||
      pluginTools.has(entry) ||
      isDeclaredMcpAllowlistEntry(entry, mcpToolPrefixes);
    const isCoreEntry = expandToolGroups([entry]).some((tool) => coreTools.has(tool));
    if (!isPluginEntry) hasOnlyPluginEntries = false;
    if (!isCoreEntry && !isPluginEntry) unknownAllowlist.push(entry);
  }
  const pluginOnlyAllowlist = hasOnlyPluginEntries;
  return {
    policy,
    unknownAllowlist: uniqueStrings(unknownAllowlist),
    pluginOnlyAllowlist,
  };
}
/** Merges alsoAllow entries into an existing allow policy. */
function mergeAlsoAllowPolicy(policy, alsoAllow) {
  if (!policy?.allow || !Array.isArray(alsoAllow) || alsoAllow.length === 0) return policy;
  return {
    ...policy,
    allow: uniqueStrings([...policy.allow, ...alsoAllow]),
  };
}
//#endregion
export {
  collectExplicitDenylist as a,
  mergeAlsoAllowPolicy as c,
  couldNormalizeToolNamePrefixToAllowedTool as d,
  expandToolGroups as f,
  resolveToolProfilePolicy as h,
  collectExplicitAllowlist as i,
  replaceWithEffectiveToolAllowlist as l,
  normalizeToolName as m,
  analyzeAllowlistByToolType as n,
  expandPolicyWithPluginGroups as o,
  normalizeToolList as p,
  buildPluginToolGroups as r,
  hasRestrictiveAllowPolicy as s,
  DEFAULT_PLUGIN_TOOLS_ALLOWLIST_ENTRY as t,
  TOOL_GROUPS as u,
};
