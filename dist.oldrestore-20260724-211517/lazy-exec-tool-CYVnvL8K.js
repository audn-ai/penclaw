import { r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
import { t as describeExecTool } from "./bash-tools.descriptions-B9OIpG9q.js";
import "./agent-scope-y9xQv_q1.js";
import { t as execSchema } from "./bash-tools.schemas-DTbbXMLb.js";
import "./tool-catalog-fgOwzAUV.js";
import { t as resolveExecCommandHighlighting } from "./exec-command-highlighting-B_HAylv-.js";
import { t as applyExecPolicyLayer } from "./exec-policy-DDAbB8Ct.js";
import { i as resolveMergedSafeBinProfileFixtures } from "./exec-safe-bin-runtime-policy-N0nkVI45.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/agents/agent-tools.message-provider-policy.ts
/**
 * Message-provider tool filtering.
 * Channels can restrict tool names after runtime assembly when the active
 * transport cannot safely render or execute a class of tools.
 */
const TOOL_DENY_BY_MESSAGE_PROVIDER = {
  "discord-voice": ["tts"],
  voice: ["tts"],
};
const TOOL_ALLOW_BY_MESSAGE_PROVIDER = {
  node: ["canvas", "image", "pdf", "tts", "web_fetch", "web_search"],
};
/** Applies message-provider filtering while preserving duplicate tool entries. */
function filterToolsByMessageProvider(tools, messageProvider) {
  const normalizedProvider = normalizeOptionalLowercaseString(messageProvider);
  if (!normalizedProvider) return [...tools];
  const allowedTools = TOOL_ALLOW_BY_MESSAGE_PROVIDER[normalizedProvider];
  if (allowedTools && allowedTools.length > 0) {
    const allowedSet = new Set(allowedTools);
    return tools.filter((tool) => allowedSet.has(tool.name));
  }
  const deniedTools = TOOL_DENY_BY_MESSAGE_PROVIDER[normalizedProvider];
  if (!deniedTools || deniedTools.length === 0) return [...tools];
  const deniedSet = new Set(deniedTools);
  return tools.filter((tool) => !deniedSet.has(tool.name));
}
//#endregion
//#region src/agents/lazy-exec-tool.ts
const bashToolsModuleLoader = createLazyImportLoader(() => import("./bash-tools-DVGiUk7W.js"));
/** Build the exec tool lazily so non-shell agent surfaces avoid loading bash runtime code. */
function createLazyExecTool(defaults, presentation) {
  let loadedTool;
  const loadTool = async () => {
    if (!loadedTool) {
      const { createExecTool } = await bashToolsModuleLoader.load();
      loadedTool = createExecTool(defaults);
    }
    return loadedTool;
  };
  return {
    name: "exec",
    label: "exec",
    displaySummary: presentation?.displaySummary ?? "Run shell now.",
    get description() {
      return (
        presentation?.description ??
        describeExecTool({
          agentId: defaults?.agentId,
          hasCronTool: defaults?.hasCronTool === true,
        })
      );
    },
    parameters: presentation?.parameters ?? execSchema,
    prepareBeforeToolCallParams: async (...args) =>
      (await loadTool()).prepareBeforeToolCallParams?.(...args) ?? args[0],
    finalizeBeforeToolCallParams: (params, preparedParams) =>
      loadedTool?.finalizeBeforeToolCallParams?.(params, preparedParams) ?? params,
    execute: async (...args) => (await loadTool()).execute(...args),
  };
}
/** Resolve global and per-agent exec defaults before runtime-only overrides. */
function resolveExecToolConfig(params) {
  const cfg = params.cfg;
  const globalExec = cfg?.tools?.exec;
  const agentExec =
    cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.exec : void 0;
  const layeredPolicy = applyExecPolicyLayer(applyExecPolicyLayer({}, globalExec), agentExec);
  return {
    host: agentExec?.host ?? globalExec?.host,
    mode: layeredPolicy.mode,
    security: layeredPolicy.security,
    ask: layeredPolicy.ask,
    node: agentExec?.node ?? globalExec?.node,
    pathPrepend: agentExec?.pathPrepend ?? globalExec?.pathPrepend,
    safeBins: agentExec?.safeBins ?? globalExec?.safeBins,
    strictInlineEval: agentExec?.strictInlineEval ?? globalExec?.strictInlineEval,
    commandHighlighting: resolveExecCommandHighlighting({
      config: cfg,
      agentId: params.agentId,
    }),
    safeBinTrustedDirs: agentExec?.safeBinTrustedDirs ?? globalExec?.safeBinTrustedDirs,
    safeBinProfiles: resolveMergedSafeBinProfileFixtures({
      global: globalExec,
      local: agentExec,
    }),
    reviewer: agentExec?.reviewer ?? globalExec?.reviewer,
    backgroundMs: agentExec?.backgroundMs ?? globalExec?.backgroundMs,
    timeoutSec: agentExec?.timeoutSec ?? globalExec?.timeoutSec,
    approvalRunningNoticeMs:
      agentExec?.approvalRunningNoticeMs ?? globalExec?.approvalRunningNoticeMs,
    cleanupMs: agentExec?.cleanupMs ?? globalExec?.cleanupMs,
    notifyOnExit: agentExec?.notifyOnExit ?? globalExec?.notifyOnExit,
    notifyOnExitEmptySuccess:
      agentExec?.notifyOnExitEmptySuccess ?? globalExec?.notifyOnExitEmptySuccess,
    applyPatch: agentExec?.applyPatch ?? globalExec?.applyPatch,
  };
}
//#endregion
export { resolveExecToolConfig as n, filterToolsByMessageProvider as r, createLazyExecTool as t };
