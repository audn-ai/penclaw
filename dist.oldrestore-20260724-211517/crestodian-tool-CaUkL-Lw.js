import { createHash } from "node:crypto";
import { Type } from "typebox";
import { n as ToolInputError, y as readStringParam } from "./common-DyDSUect.js";
import {
  i as isPersistentCrestodianOperation,
  n as executeCrestodianOperation,
} from "./operations-Cj3q63k5.js";
import { t as stableStringify } from "./stable-stringify-Cd9_EGsU.js";
import { n as textResult } from "./tool-results-BCM3fdVS.js";
import { s as stringEnum } from "./typebox-D411BFJf.js";
//#region src/agents/tools/crestodian-tool.ts
/**
 * crestodian built-in tool: ring-zero setup/repair actions for the Crestodian
 * agent. Never exposed to normal agents — construction is bound to a host-owned
 * per-run scope, and every action funnels through Crestodian's typed operation
 * union with approval assertions and the audit log.
 */
/** Canonical operation fingerprint used to bind "yes" to one exact mutation. */
function hashCrestodianOperation(operation) {
  return createHash("sha256").update(stableStringify(operation)).digest("hex");
}
/** Result markers shared with out-of-process hosts (CLI MCP runs). */
const CRESTODIAN_NEEDS_APPROVAL_PREFIX = "needs-approval:";
const CRESTODIAN_APPROVAL_MISMATCH_PREFIX = "approval-mismatch:";
const CRESTODIAN_DIRECTIVE_PREFIX = "directive:";
const CRESTODIAN_APPROVED_OPERATION_PREFIX = `${CRESTODIAN_DIRECTIVE_PREFIX}approved-operation:`;
/**
 * Reconstruct a host directive from an out-of-process tool result. Directive
 * actions run inside the MCP subprocess on CLI-harness runs, so the host
 * replays them from harness tool events the same way proposals are mirrored.
 */
function resolveCrestodianDirectiveTransition(params) {
  if (!params.resultText.startsWith(CRESTODIAN_DIRECTIVE_PREFIX)) return null;
  try {
    const operation = operationForAction(params.args);
    if (
      params.resultText.startsWith(CRESTODIAN_APPROVED_OPERATION_PREFIX) &&
      isPersistentCrestodianOperation(operation)
    )
      return {
        kind: "approved-operation",
        operation,
      };
    return directiveForOperation(operation);
  } catch {
    return null;
  }
}
function directiveForOperation(operation) {
  if (operation.kind === "channel-setup")
    return {
      kind: "channel-setup",
      channel: operation.channel,
    };
  if (operation.kind === "model-setup")
    return {
      kind: "model-setup",
      ...(operation.workspace ? { workspace: operation.workspace } : {}),
    };
  if (operation.kind === "open-tui")
    return {
      kind: "open-tui",
      ...(operation.agentId ? { agentId: operation.agentId } : {}),
      ...(operation.workspace ? { workspace: operation.workspace } : {}),
    };
  if (operation.kind === "open-setup") return operation;
  return null;
}
/**
 * Mirror a proposalRef transition from an out-of-process tool result. CLI MCP
 * runs execute this tool in a stdio subprocess whose proposalRef dies with the
 * run; the host replays the same lifecycle from harness tool events: denial
 * registers the exact-operation hash, mismatch voids it, execution consumes it.
 */
function resolveCrestodianProposalTransition(params) {
  let operation;
  try {
    operation = operationForAction(params.args);
  } catch {
    return null;
  }
  if (!isPersistentCrestodianOperation(operation)) return null;
  if (params.resultText.startsWith(CRESTODIAN_APPROVAL_MISMATCH_PREFIX))
    return { proposal: void 0 };
  if (params.resultText.startsWith(CRESTODIAN_NEEDS_APPROVAL_PREFIX)) {
    const carriedHash = (params.resultText.split("\n", 1)[0] ?? "").slice(15).trim();
    return {
      proposal: /^[a-f0-9]{64}$/.test(carriedHash)
        ? carriedHash
        : hashCrestodianOperation(operation),
    };
  }
  return { proposal: void 0 };
}
const CrestodianToolSchema = Type.Object({
  action: stringEnum([
    ...[
      "status",
      "models",
      "agents",
      "channels",
      "channel_info",
      "audit",
      "validate_config",
      "doctor",
      "config_get",
      "config_schema",
      "gateway_status",
      "plugin_search",
      "connect_channel",
      "configure_model_provider",
      "open_agent",
      "open_setup",
      "setup",
      "set_default_model",
      "config_set",
      "config_set_ref",
      "create_agent",
      "gateway_start",
      "gateway_stop",
      "gateway_restart",
      "plugin_install",
      "plugin_uninstall",
    ],
  ]),
  path: Type.Optional(Type.String({ description: "Config path for config_* actions" })),
  value: Type.Optional(Type.String({ description: "Value for config_set (JSON5 or string)" })),
  envVar: Type.Optional(Type.String({ description: "Env var name for config_set_ref" })),
  model: Type.Optional(Type.String({ description: "provider/model ref" })),
  workspace: Type.Optional(Type.String({ description: "Workspace directory" })),
  agentId: Type.Optional(Type.String({ description: "Agent id for create_agent/open_agent" })),
  channel: Type.Optional(
    Type.String({
      description: "Channel id for connect_channel, channel_info, or open_setup channels",
    }),
  ),
  target: Type.Optional(
    stringEnum(["guided", "classic", "channels"], {
      description:
        "Setup target for open_setup. channels runs in this chat; guided/classic require exiting Crestodian and running openclaw onboard.",
    }),
  ),
  query: Type.Optional(Type.String({ description: "Search query for plugin_search" })),
  spec: Type.Optional(Type.String({ description: "npm/clawhub spec for plugin_install" })),
  pluginId: Type.Optional(Type.String({ description: "Plugin id for plugin_uninstall" })),
  approved: Type.Optional(
    Type.Boolean({
      description:
        "Set true ONLY after the user explicitly approved this exact change in the conversation.",
    }),
  ),
});
function createCaptureRuntime() {
  const lines = [];
  return {
    log: (...args) => lines.push(args.join(" ")),
    error: (...args) => lines.push(args.join(" ")),
    exit: (code) => {
      throw new Error(`crestodian operation exited with code ${String(code)}`);
    },
    read: () => lines.join("\n").trim(),
  };
}
function requireParam(params, name) {
  const value = readStringParam(params, name);
  if (!value?.trim()) throw new ToolInputError(`crestodian: "${name}" is required for this action`);
  return value.trim();
}
function readSetupTarget(params) {
  const target = readStringParam(params, "target")?.trim() ?? "guided";
  if (target === "guided" || target === "classic" || target === "channels") return target;
  throw new ToolInputError(`crestodian: unknown setup target "${target}"`);
}
function operationForAction(params) {
  const action = readStringParam(params, "action", { required: true });
  switch (action) {
    case "status":
      return { kind: "status" };
    case "models":
      return { kind: "models" };
    case "agents":
      return { kind: "agents" };
    case "channels":
      return { kind: "channel-list" };
    case "channel_info":
      return {
        kind: "channel-info",
        channel: requireParam(params, "channel").toLowerCase(),
      };
    case "audit":
      return { kind: "audit" };
    case "validate_config":
      return { kind: "config-validate" };
    case "doctor":
      return { kind: "doctor" };
    case "config_get":
      return {
        kind: "config-get",
        path: requireParam(params, "path"),
      };
    case "config_schema": {
      const path = readStringParam(params, "path")?.trim();
      return {
        kind: "config-schema",
        ...(path ? { path } : {}),
      };
    }
    case "gateway_status":
      return { kind: "gateway-status" };
    case "connect_channel":
      return {
        kind: "channel-setup",
        channel: requireParam(params, "channel").toLowerCase(),
      };
    case "configure_model_provider": {
      const workspace = readStringParam(params, "workspace")?.trim();
      return {
        kind: "model-setup",
        ...(workspace ? { workspace } : {}),
      };
    }
    case "open_agent": {
      const agentId = readStringParam(params, "agentId")?.trim();
      const workspace = readStringParam(params, "workspace")?.trim();
      return {
        kind: "open-tui",
        ...(agentId ? { agentId } : {}),
        ...(workspace ? { workspace } : {}),
      };
    }
    case "open_setup": {
      const target = readSetupTarget(params);
      const channel = readStringParam(params, "channel")?.trim().toLowerCase();
      return {
        kind: "open-setup",
        target,
        ...(channel ? { channel } : {}),
      };
    }
    case "gateway_start":
      return { kind: "gateway-start" };
    case "gateway_stop":
      return { kind: "gateway-stop" };
    case "gateway_restart":
      return { kind: "gateway-restart" };
    case "plugin_search":
      return {
        kind: "plugin-search",
        query: requireParam(params, "query"),
      };
    case "plugin_install":
      return {
        kind: "plugin-install",
        spec: requireParam(params, "spec"),
      };
    case "plugin_uninstall":
      return {
        kind: "plugin-uninstall",
        pluginId: requireParam(params, "pluginId"),
      };
    case "setup": {
      const workspace = readStringParam(params, "workspace")?.trim();
      const model = readStringParam(params, "model")?.trim();
      return {
        kind: "setup",
        ...(workspace ? { workspace } : {}),
        ...(model ? { model } : {}),
      };
    }
    case "set_default_model":
      return {
        kind: "set-default-model",
        model: requireParam(params, "model"),
      };
    case "create_agent": {
      const workspace = readStringParam(params, "workspace")?.trim();
      const model = readStringParam(params, "model")?.trim();
      return {
        kind: "create-agent",
        agentId: requireParam(params, "agentId"),
        ...(workspace ? { workspace } : {}),
        ...(model ? { model } : {}),
      };
    }
    case "config_set":
      return {
        kind: "config-set",
        path: requireParam(params, "path"),
        value: requireParam(params, "value"),
      };
    case "config_set_ref":
      return {
        kind: "config-set-ref",
        path: requireParam(params, "path"),
        source: "env",
        id: requireParam(params, "envVar"),
      };
    default:
      throw new ToolInputError(`crestodian: unknown action "${action}"`);
  }
}
function createCrestodianTool(options) {
  return {
    name: "crestodian",
    label: "Crestodian",
    catalogMode: "direct-only",
    description: [
      "Ring-zero setup/repair. Reads (status/models/agents/channels/channel_info/config_get/config_schema/gateway_status/plugin_search/validate_config/doctor/audit) run now.",
      "connect_channel/open_setup(target=channels) starts guided chat setup; open_agent hands off normal agent.",
      "Cannot change active inference route here. configure_model_provider/open_setup guided|classic, provider/credential/default-model change: exit and `openclaw onboard`; never ask credentials here.",
      "Writes (setup/set_default_model/config_set/config_set_ref/create_agent/gateway_*/plugin_install) need approved=true only after user clearly agrees to exact change in this conversation. Host applies after turn and rechecks live inference owner.",
      "Unknown config path: config_schema first; schema is truth. Secret: config_set_ref env, never plaintext. Raw auth/models/env/secrets/plugins/tools/agent-route/$include writes refused; typed workflow only.",
      "Plugin uninstall refused: exit, CLI. Doctor repair refused: exit, `openclaw doctor --fix`.",
      "Every write validated/audited. CONFIG INVALID => fix immediately.",
    ].join(" "),
    parameters: CrestodianToolSchema,
    execute: async (_toolCallId, args) => {
      const params = args ?? {};
      const operation = operationForAction(params);
      const directive = directiveForOperation(operation);
      if (directive) {
        if (options.directiveRef && options.directiveRef.current?.kind !== "approved-operation")
          options.directiveRef.current = directive;
        return textResult(
          directive.kind === "channel-setup"
            ? `${CRESTODIAN_DIRECTIVE_PREFIX} the host chat now starts the guided ${directive.channel} setup with the user. Tell the user the setup questions come next; do not describe steps yourself.`
            : directive.kind === "model-setup"
              ? `${CRESTODIAN_DIRECTIVE_PREFIX} the active inference route cannot be changed inside Crestodian. Tell the user to exit Crestodian and run \`openclaw onboard\`; do not ask for provider credentials here.`
              : directive.kind === "open-tui"
                ? `${CRESTODIAN_DIRECTIVE_PREFIX} the host now hands the user over to their normal agent. Say goodbye briefly.`
                : directive.target === "channels"
                  ? `${CRESTODIAN_DIRECTIVE_PREFIX} the host now opens channel setup${directive.channel ? ` for ${directive.channel}` : ""}. Tell the user the channel setup questions come next.`
                  : `${CRESTODIAN_DIRECTIVE_PREFIX} ${directive.target} setup cannot run inside Crestodian because it may change the active inference route. Tell the user to exit Crestodian and run \`openclaw onboard\`.`,
          {},
        );
      }
      if (isPersistentCrestodianOperation(operation)) {
        const operationHash = hashCrestodianOperation(operation);
        if (
          !(
            params.approved === true &&
            options.approvalArmed === true &&
            options.proposalRef?.current === operationHash
          )
        ) {
          if (options.approvalArmed === true) {
            if (options.proposalRef) options.proposalRef.current = void 0;
            return textResult(
              `${CRESTODIAN_APPROVAL_MISMATCH_PREFIX} this call is not the operation the user approved. The approval is void; describe the new change and get a fresh yes before retrying.`,
              { needsApproval: true },
            );
          }
          if (options.proposalRef) options.proposalRef.current = operationHash;
          return textResult(
            `${CRESTODIAN_NEEDS_APPROVAL_PREFIX}${operationHash}\nThis action changes state. The proposal is registered; describe this exact change and ask the user to reply yes (their approval unlocks THIS action only — then retry the exact registered operation with approved=true).`,
            { needsApproval: true },
          );
        }
        if (options.proposalRef) options.proposalRef.current = void 0;
        const approvedDirective = {
          kind: "approved-operation",
          operation,
        };
        if (options.directiveRef) options.directiveRef.current = approvedDirective;
        return textResult(
          `${CRESTODIAN_APPROVED_OPERATION_PREFIX} the host accepted this exact approved action and will apply it after this turn. Do not call it again.`,
          {},
        );
      }
      const capture = createCaptureRuntime();
      try {
        await executeCrestodianOperation(operation, capture, {
          approved: false,
          deps: { setupSurface: options.surface },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return textResult([capture.read(), `error: ${message}`].filter(Boolean).join("\n"), {
          error: true,
        });
      }
      return textResult(capture.read() || "done", {});
    },
  };
}
//#endregion
export {
  resolveCrestodianProposalTransition as i,
  hashCrestodianOperation as n,
  resolveCrestodianDirectiveTransition as r,
  createCrestodianTool as t,
};
