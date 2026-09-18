import {
  f as expandToolGroups,
  m as normalizeToolName,
  o as expandPolicyWithPluginGroups,
  p as normalizeToolList,
  r as buildPluginToolGroups,
} from "./tool-policy-1QHiwXPv.js";
import { n as isToolAllowedByPolicyName } from "./tool-policy-match-Bq6mIgOa.js";
const CORE_TOOL_FACTORY_FAMILY_BY_NAME = new Map(
  [
    {
      name: "edit",
      family: "base-coding",
    },
    {
      name: "read",
      family: "base-coding",
    },
    {
      name: "write",
      family: "base-coding",
    },
    {
      name: "apply_patch",
      family: "shell",
    },
    {
      name: "exec",
      family: "shell",
    },
    {
      name: "process",
      family: "shell",
    },
    {
      name: "agents_list",
      family: "openclaw",
    },
    {
      name: "crestodian",
      family: "openclaw",
    },
    {
      name: "computer",
      family: "openclaw",
    },
    {
      name: "cron",
      family: "openclaw",
    },
    {
      name: "gateway",
      family: "openclaw",
    },
    {
      name: "get_goal",
      family: "openclaw",
    },
    {
      name: "heartbeat_respond",
      family: "openclaw",
    },
    {
      name: "image",
      family: "openclaw",
    },
    {
      name: "image_generate",
      family: "openclaw",
    },
    {
      name: "message",
      family: "openclaw",
    },
    {
      name: "music_generate",
      family: "openclaw",
    },
    {
      name: "nodes",
      family: "openclaw",
    },
    {
      name: "pdf",
      family: "openclaw",
    },
    {
      name: "session_status",
      family: "openclaw",
    },
    {
      name: "sessions_history",
      family: "openclaw",
    },
    {
      name: "sessions_list",
      family: "openclaw",
    },
    {
      name: "sessions_search",
      family: "openclaw",
    },
    {
      name: "sessions_send",
      family: "openclaw",
    },
    {
      name: "sessions_spawn",
      family: "openclaw",
    },
    {
      name: "sessions_yield",
      family: "openclaw",
    },
    {
      name: "skill_workshop",
      family: "openclaw",
    },
    {
      name: "spawn_task",
      family: "openclaw",
    },
    {
      name: "create_goal",
      family: "openclaw",
    },
    {
      name: "subagents",
      family: "openclaw",
    },
    {
      name: "transcripts",
      family: "openclaw",
    },
    {
      name: "tts",
      family: "openclaw",
    },
    {
      name: "update_goal",
      family: "openclaw",
    },
    {
      name: "update_plan",
      family: "openclaw",
    },
    {
      name: "dismiss_task",
      family: "openclaw",
    },
    {
      name: "video_generate",
      family: "openclaw",
    },
    {
      name: "web_fetch",
      family: "openclaw",
    },
    {
      name: "web_search",
      family: "openclaw",
    },
  ].map(({ name, family }) => [name, family]),
);
function resolveCoreToolFactoryFamily(name) {
  return CORE_TOOL_FACTORY_FAMILY_BY_NAME.get(name);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-construction-plan.ts
/**
 * Plans which core, bundle MCP, and bundle LSP tools an attempt should build.
 */
const ALL_CODING_TOOL_CONSTRUCTION_PLAN = {
  includeBaseCodingTools: true,
  includeShellTools: true,
  includeChannelTools: true,
  includeOpenClawTools: true,
  includePluginTools: true,
};
const NO_CODING_TOOL_CONSTRUCTION_PLAN = {
  includeBaseCodingTools: false,
  includeShellTools: false,
  includeChannelTools: false,
  includeOpenClawTools: false,
  includePluginTools: false,
};
function cloneCodingToolConstructionPlan(plan) {
  return { ...plan };
}
function isBundleMcpAllowlistName(normalized) {
  return normalized === "bundle-mcp" || normalized.includes("__");
}
function isPluginGroupAllowlistName(normalized) {
  return normalized === "group:plugins";
}
function hasWildcardToolAllowlist(toolsAllow) {
  return toolsAllow.some((entry) => normalizeToolName(entry) === "*");
}
/**
 * Applies a runtime allowlist to a concrete tool list after expanding tool and
 * plugin groups. Undefined allowlists keep all tools; an explicit empty list
 * intentionally disables all runtime tools.
 */
function applyEmbeddedAttemptToolsAllow(tools, toolsAllow, options) {
  if (!toolsAllow) return tools;
  if (toolsAllow.length === 0) return [];
  if (hasWildcardToolAllowlist(toolsAllow)) return tools;
  const pluginGroups = options?.toolMeta
    ? buildPluginToolGroups({
        tools,
        toolMeta: options.toolMeta,
      })
    : void 0;
  const policy = pluginGroups
    ? expandPolicyWithPluginGroups({ allow: toolsAllow }, pluginGroups)
    : { allow: toolsAllow };
  return tools.filter((tool) => isToolAllowedByPolicyName(tool.name, policy));
}
/**
 * Adds the message tool to a narrowed allowlist when the caller must support
 * forced source-reply delivery. Wildcard and undefined allowlists already cover
 * message, while an empty allowlist becomes message-only.
 */
function mergeForcedEmbeddedAttemptToolsAllow(toolsAllow, params) {
  if (!params.forceMessageTool || toolsAllow === void 0 || hasWildcardToolAllowlist(toolsAllow))
    return toolsAllow;
  if (toolsAllow.length === 0) return ["message"];
  return new Set(toolsAllow.map((entry) => normalizeToolName(entry))).has("message")
    ? toolsAllow
    : [...toolsAllow, "message"];
}
function resolveCodingToolConstructionPlanForAllowlist(toolsAllow) {
  if (!toolsAllow) return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
  if (toolsAllow.length === 0)
    return cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN);
  if (hasWildcardToolAllowlist(toolsAllow))
    return cloneCodingToolConstructionPlan(ALL_CODING_TOOL_CONSTRUCTION_PLAN);
  const normalized = normalizeToolList(expandToolGroups(toolsAllow));
  const coreFamilies = /* @__PURE__ */ new Set();
  let includePluginTools = false;
  for (const name of normalized) {
    const family = resolveCoreToolFactoryFamily(name);
    if (family) {
      coreFamilies.add(family);
      continue;
    }
    if (!isBundleMcpAllowlistName(name)) includePluginTools = true;
  }
  const includeBaseCodingTools = coreFamilies.has("base-coding");
  const includeShellTools = coreFamilies.has("shell");
  const includeOpenClawTools = coreFamilies.has("openclaw");
  return {
    includeBaseCodingTools,
    includeShellTools,
    includeChannelTools: includePluginTools,
    includeOpenClawTools,
    includePluginTools,
  };
}
/**
 * Decides which tool families need to be constructed for an embedded attempt.
 * This keeps allowlisted plugin/channel tools available without forcing every
 * local core tool factory to run for narrow plugin-only configurations.
 */
function resolveEmbeddedAttemptToolConstructionPlan(params) {
  if (
    params.disableTools === true ||
    params.isRawModelRun === true ||
    params.toolsEnabled === false
  )
    return {
      constructTools: false,
      includeCoreTools: false,
      codingToolConstructionPlan: cloneCodingToolConstructionPlan(NO_CODING_TOOL_CONSTRUCTION_PLAN),
    };
  const toolsAllow = mergeForcedEmbeddedAttemptToolsAllow(params.toolsAllow, {
    forceMessageTool: params.forceMessageTool,
  });
  const codingToolConstructionPlan = resolveCodingToolConstructionPlanForAllowlist(toolsAllow);
  const includeCoreTools =
    codingToolConstructionPlan.includeBaseCodingTools ||
    codingToolConstructionPlan.includeShellTools ||
    codingToolConstructionPlan.includeOpenClawTools;
  return {
    constructTools:
      includeCoreTools ||
      codingToolConstructionPlan.includeChannelTools ||
      codingToolConstructionPlan.includePluginTools,
    includeCoreTools,
    ...(toolsAllow ? { runtimeToolAllowlist: toolsAllow } : {}),
    codingToolConstructionPlan,
  };
}
function shouldCreateBundleRuntimeForAttempt(params, matchesAllowlist) {
  if (!params.toolsEnabled || params.disableTools === true) return false;
  if (!params.toolsAllow) return true;
  if (params.toolsAllow.length === 0) return false;
  if (hasWildcardToolAllowlist(params.toolsAllow)) return true;
  return params.toolsAllow.some((toolName) => matchesAllowlist(normalizeToolName(toolName)));
}
/**
 * Decides whether the bundled MCP runtime is needed for this attempt. Bundle
 * runtime creation follows explicit bundle/plugin allowlist names rather than
 * generic local tool names.
 */
function shouldCreateBundleMcpRuntimeForAttempt(params) {
  return shouldCreateBundleRuntimeForAttempt(params, (normalized) => {
    return isBundleMcpAllowlistName(normalized) || isPluginGroupAllowlistName(normalized);
  });
}
/**
 * Decides whether the bundled LSP runtime is needed for this attempt. LSP tools
 * are enabled by default/wildcard and by allowlist entries with the `lsp_`
 * prefix.
 */
function shouldCreateBundleLspRuntimeForAttempt(params) {
  return shouldCreateBundleRuntimeForAttempt(params, (normalized) => {
    return normalized.startsWith("lsp_");
  });
}
//#endregion
export {
  shouldCreateBundleMcpRuntimeForAttempt as a,
  shouldCreateBundleLspRuntimeForAttempt as i,
  mergeForcedEmbeddedAttemptToolsAllow as n,
  resolveEmbeddedAttemptToolConstructionPlan as r,
  applyEmbeddedAttemptToolsAllow as t,
};
