import { f as runBeforeToolCallHook } from "./agent-tools.before-tool-call-B7gv78c3.js";
import { n as ToolInputError } from "./common-DyDSUect.js";
import { a as isTestDefaultMemorySlotDisabled } from "./config-state-C1Qyxaws.js";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.js";
import { x as getChannelAgentToolMeta } from "./gateway-Dyh1k_4Q.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { a as resolveMainSessionKey } from "./main-session-nrmKYo2W.js";
import {
  Gt as canonicalizeSessionKeyForAgent,
  q as resolveSessionEntryAccessTarget,
} from "./session-accessor-PZVNxFCV.js";
import { n as defaultSlotIdForKey } from "./slots-kpL659LX.js";
import "./sessions-CEG7v41b.js";
import {
  Ct as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE,
  Dt as isAgentHarnessSessionStoreEntryProtected,
  Tt as isAgentHarnessSessionKey,
} from "./store-CzZJhTF6.js";
import {
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { r as isKnownCoreToolId } from "./tool-catalog-fgOwzAUV.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-vc04OURE.js";
import "./agent-tools-CQdhKaa9.js";
import { t as resolveGatewayScopedTools } from "./tool-resolution-CJt3Kur-.js";
import { i as getPluginToolMeta } from "./tools-K3NqAe9E.js";
//#region src/gateway/tools-invoke-shared.ts
const MEMORY_TOOL_NAMES = /* @__PURE__ */ new Set(["memory_search", "memory_get"]);
function resolveSessionKey(params) {
  const rawSessionKey = normalizeOptionalString(params.input.sessionKey);
  if (rawSessionKey && rawSessionKey !== "main") return rawSessionKey;
  const agentId = normalizeOptionalString(params.input.agentId);
  if (agentId) return canonicalizeSessionKeyForAgent(agentId, "main");
  return resolveMainSessionKey(params.cfg);
}
function resolveMemoryToolDisableReasons(cfg) {
  if (!process.env.VITEST) return [];
  const reasons = [];
  const plugins = cfg.plugins;
  const slotRaw = plugins?.slots?.memory;
  const slotDisabled = slotRaw === null || normalizeOptionalLowercaseString(slotRaw) === "none";
  const pluginsDisabled = plugins?.enabled === false;
  const defaultDisabled = isTestDefaultMemorySlotDisabled(cfg);
  if (pluginsDisabled) reasons.push("plugins.enabled=false");
  if (slotDisabled)
    reasons.push(slotRaw === null ? "plugins.slots.memory=null" : 'plugins.slots.memory="none"');
  if (!pluginsDisabled && !slotDisabled && defaultDisabled)
    reasons.push("memory plugin disabled by test default");
  return reasons;
}
function mergeActionIntoArgsIfSupported(params) {
  const { toolSchema, action, args } = params;
  if (!action || args.action !== void 0) return args;
  const schemaObj = toolSchema;
  return Boolean(
    schemaObj &&
    typeof schemaObj === "object" &&
    schemaObj.properties &&
    "action" in schemaObj.properties,
  )
    ? {
        ...args,
        action,
      }
    : args;
}
function getErrorMessage(err) {
  if (err instanceof Error) return err.message || String(err);
  if (typeof err === "string") return err;
  return String(err);
}
function resolveToolInputErrorStatus(err) {
  if (err instanceof ToolInputError) {
    const status = err.status;
    return typeof status === "number" ? status : 400;
  }
  if (typeof err !== "object" || err === null || !("name" in err)) return null;
  const name = err.name;
  if (name !== "ToolInputError" && name !== "ToolAuthorizationError") return null;
  const status = err.status;
  if (typeof status === "number") return status;
  return name === "ToolAuthorizationError" ? 403 : 400;
}
function resolveToolSource(tool) {
  if (getPluginToolMeta(tool)) return "plugin";
  if (getChannelAgentToolMeta(tool)) return "channel";
  return "core";
}
/** Resolves, authorizes, and invokes one gateway-visible core/plugin/channel tool. */
async function invokeGatewayTool(params) {
  const conversationReadOrigin = normalizeConversationReadInvocationOrigin(
    params.conversationReadOrigin,
  );
  const toolName = normalizeOptionalString(params.input.name ?? params.input.tool) ?? "";
  if (!toolName)
    return {
      ok: false,
      status: 400,
      toolName: "",
      error: {
        type: "invalid_request",
        message: "tools.invoke requires name",
      },
    };
  if (process.env.VITEST && MEMORY_TOOL_NAMES.has(toolName)) {
    const reasons = resolveMemoryToolDisableReasons(params.cfg);
    if (reasons.length > 0)
      return {
        ok: false,
        status: 400,
        toolName,
        error: {
          type: "invalid_request",
          message: `memory tools are disabled in tests${` (${reasons.join(", ")})`}. Enable by setting plugins.slots.memory="${defaultSlotIdForKey("memory")}" (and ensure plugins.enabled is not false).`,
        },
      };
  }
  const knownCoreTool = isKnownCoreToolId(toolName);
  const gatewayRequestedTools = knownCoreTool ? [] : [toolName];
  const action = normalizeOptionalString(params.input.action);
  const argsRaw = params.input.args;
  const args = argsRaw && typeof argsRaw === "object" && !Array.isArray(argsRaw) ? argsRaw : {};
  const sessionKey = resolveSessionKey({
    cfg: params.cfg,
    input: params.input,
  });
  const harnessEntry = isAgentHarnessSessionKey(sessionKey)
    ? resolveSessionEntryAccessTarget({
        cfg: params.cfg,
        sessionKey,
      }).entry
    : void 0;
  if (
    isAgentHarnessSessionKey(sessionKey) &&
    (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, harnessEntry))
  )
    return {
      ok: false,
      status: 400,
      toolName,
      error: {
        type: "invalid_request",
        message: AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE,
      },
    };
  const resolveTools = (disablePluginTools) =>
    resolveGatewayScopedTools({
      cfg: params.cfg,
      sessionKey,
      messageProvider: params.messageChannel,
      accountId: params.accountId,
      agentTo: params.agentTo,
      agentThreadId: params.agentThreadId,
      senderIsOwner: params.senderIsOwner,
      clientCaps: params.clientCaps,
      conversationReadOrigin,
      allowGatewaySubagentBinding: true,
      allowMediaInvokeCommands: true,
      surface: "http",
      disablePluginTools,
      gatewayRequestedTools,
    });
  let { agentId, tools, workspaceDir } = resolveTools(knownCoreTool);
  if (knownCoreTool && !tools.some((candidate) => candidate.name === toolName))
    ({ agentId, tools, workspaceDir } = resolveTools(false));
  const requestedAgentId = normalizeOptionalString(params.input.agentId);
  if (requestedAgentId && agentId && requestedAgentId !== agentId)
    return {
      ok: false,
      status: 400,
      toolName,
      error: {
        type: "invalid_request",
        message: `agent id "${requestedAgentId}" does not match session agent "${agentId}"`,
      },
    };
  const tool = tools.find((candidate) => candidate.name === toolName);
  if (!tool)
    return {
      ok: false,
      status: 404,
      toolName,
      error: {
        type: "not_found",
        message: `Tool not available: ${toolName}`,
      },
    };
  try {
    const gatewayTool = tool;
    const idempotencyKey = normalizeOptionalString(params.input.idempotencyKey);
    const toolCallId = idempotencyKey
      ? `${params.toolCallIdPrefix}-${conversationReadOrigin}-${idempotencyKey}`
      : `${params.toolCallIdPrefix}-${conversationReadOrigin}-${Date.now()}`;
    const hookResult = await runBeforeToolCallHook({
      toolName,
      params: mergeActionIntoArgsIfSupported({
        toolSchema: gatewayTool.parameters,
        action,
        args,
      }),
      toolCallId,
      ctx: {
        agentId,
        config: params.cfg,
        sessionKey,
        workspaceDir,
        loopDetection: resolveToolLoopDetectionConfig({
          cfg: params.cfg,
          agentId,
        }),
      },
      approvalMode: params.approvalMode,
    });
    if (hookResult.blocked)
      return {
        ok: false,
        status: 403,
        toolName,
        error: {
          type: "tool_call_blocked",
          message: hookResult.reason,
          requiresApproval: hookResult.deniedReason === "plugin-approval",
        },
      };
    return {
      ok: true,
      status: 200,
      toolName,
      source: resolveToolSource(gatewayTool),
      result: await gatewayTool.execute?.(toolCallId, hookResult.params),
    };
  } catch (err) {
    const inputStatus = resolveToolInputErrorStatus(err);
    if (inputStatus !== null)
      return {
        ok: false,
        status: inputStatus === 403 ? 403 : 400,
        toolName,
        error: {
          type: "tool_error",
          message: getErrorMessage(err) || "invalid tool arguments",
        },
      };
    logWarn(`tools-invoke: tool execution failed: ${String(err)}`);
    return {
      ok: false,
      status: 500,
      toolName,
      error: {
        type: "tool_error",
        message: "tool execution failed",
      },
    };
  }
}
//#endregion
export { invokeGatewayTool as t };
