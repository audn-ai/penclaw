import "./agent-scope-y9xQv_q1.js";
import "./provider-auth-aliases-RaEzqkSo.js";
import "./sandbox-paths-DxDLkOQF.js";
import "./auth-profiles-CX7JDmZ9.js";
import "./model-auth-markers-CA2Xy59Z.js";
import "./model-selection-DOlkTrQa.js";
import "./model-catalog-DxYvPELu.js";
import "./common-DyDSUect.js";
import "./model-auth-BWFdcEzF.js";
import "./embedded-agent-utils-Coji3F8W.js";
import "./typebox-D411BFJf.js";
import "./identity-CceraXdn.js";
import "./simple-completion-runtime-DThW6g7z.js";
import "./tts-BzX0GOhC.js";
import "./web-fetch-utils-Pr5OiX35.js";
import "./web-shared-C-2hVbyp.js";
import "./date-time-CcWivhrg.js";
import "./current-time-B0TYU-XW.js";
import "./identity-avatar-C7CduG15.js";
import "./agent-dir-compat-d7bWcNLv.js";
import "./web-guarded-fetch-Clw9u5_V.js";
import "./agent-command-CxzoW4-d.js";
//#region src/tools/availability.ts
/**
 * Tool availability evaluator for descriptor-driven tool planning.
 *
 * Descriptors express why a tool can be shown as small signals; this module
 * turns those signals into diagnostics without knowing any concrete tool owner.
 */
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function resolveConfigPath(config, path) {
  let current = config;
  for (const segment of path) {
    if (!isRecord(current)) return;
    current = current[segment];
  }
  return current;
}
function hasConfiguredValue(params) {
  const { value, signal } = params;
  if (value === void 0 || value === null) return false;
  if ((signal.check ?? "exists") === "available")
    return (
      params.context.isConfigValueAvailable?.({
        value,
        path: signal.path,
        signal,
      }) === true
    );
  if ((signal.check ?? "exists") === "exists") return true;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function isJsonPrimitive(value) {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}
function isStringArray(value) {
  return Array.isArray(value) && Array.from(value).every((entry) => typeof entry === "string");
}
function isAvailabilitySignal(value) {
  switch (value.kind) {
    case "always":
      return true;
    case "auth":
      return isNonEmptyString(value.providerId);
    case "config":
      return (
        isStringArray(value.path) &&
        (value.check === void 0 ||
          value.check === "exists" ||
          value.check === "non-empty" ||
          value.check === "available")
      );
    case "env":
      return isNonEmptyString(value.name);
    case "plugin-enabled":
      return isNonEmptyString(value.pluginId);
    case "context":
      return isNonEmptyString(value.key) && (!("equals" in value) || isJsonPrimitive(value.equals));
    default:
      return false;
  }
}
function isAvailabilityExpression(value, active) {
  if (!value || typeof value !== "object" || Array.isArray(value) || active.has(value))
    return false;
  active.add(value);
  try {
    const expression = value;
    if (
      Number("kind" in expression) +
        Number("allOf" in expression) +
        Number("anyOf" in expression) !==
      1
    )
      return false;
    if ("kind" in expression) return isAvailabilitySignal(expression);
    const entries = "allOf" in expression ? expression.allOf : expression.anyOf;
    return (
      Array.isArray(entries) &&
      Array.from(entries).every((entry) => isAvailabilityExpression(entry, active))
    );
  } finally {
    active.delete(value);
  }
}
function diagnostic(reason, signal, message) {
  return {
    reason,
    signal,
    message,
  };
}
function evaluateSignal(signal, context) {
  switch (signal.kind) {
    case "always":
      return null;
    case "auth":
      return context.authProviderIds?.has(signal.providerId)
        ? null
        : diagnostic("auth-missing", signal, `Missing auth provider: ${signal.providerId}`);
    case "config":
      return hasConfiguredValue({
        value: resolveConfigPath(context.config, signal.path),
        signal,
        context,
      })
        ? null
        : diagnostic("config-missing", signal, `Missing config path: ${signal.path.join(".")}`);
    case "env":
      return context.env?.[signal.name]?.trim()
        ? null
        : diagnostic("env-missing", signal, `Missing environment value: ${signal.name}`);
    case "plugin-enabled":
      return context.enabledPluginIds?.has(signal.pluginId)
        ? null
        : diagnostic("plugin-disabled", signal, `Plugin is not enabled: ${signal.pluginId}`);
    case "context": {
      const value = context.values?.[signal.key];
      if (!("equals" in signal))
        return value === void 0
          ? diagnostic("context-mismatch", signal, `Missing context value: ${signal.key}`)
          : null;
      return value === signal.equals
        ? null
        : diagnostic("context-mismatch", signal, `Context value did not match: ${signal.key}`);
    }
    default:
      return diagnostic("unsupported-signal", signal, "Unsupported availability signal");
  }
}
function evaluateExpression(expression, context) {
  if ("kind" in expression) {
    const diagnosticLocal = evaluateSignal(expression, context);
    return diagnosticLocal ? [diagnosticLocal] : [];
  }
  if ("allOf" in expression) {
    if (expression.allOf.length === 0)
      return [
        {
          reason: "unsupported-signal",
          message: "Empty availability allOf group",
        },
      ];
    return expression.allOf.flatMap((entry) => evaluateExpression(entry, context));
  }
  if ("anyOf" in expression) {
    if (expression.anyOf.length === 0)
      return [
        {
          reason: "unsupported-signal",
          message: "Empty availability anyOf group",
        },
      ];
    const diagnostics = expression.anyOf.map((entry) => evaluateExpression(entry, context));
    const unsupported = diagnostics.flat().filter((entry) => entry.reason === "unsupported-signal");
    if (diagnostics.some((entries) => entries.length === 0)) return unsupported;
    return diagnostics.flat();
  }
  return [
    {
      reason: "unsupported-signal",
      message: "Unsupported availability expression",
    },
  ];
}
/** Evaluate one descriptor against runtime context and return hidden-tool diagnostics. */
function evaluateToolAvailability(params) {
  const context = params.context ?? {};
  const availability = params.descriptor.availability;
  if (availability === void 0) return [];
  if (!isAvailabilityExpression(availability, /* @__PURE__ */ new WeakSet()))
    return [
      {
        reason: "unsupported-signal",
        message: "Unsupported availability expression",
      },
    ];
  return evaluateExpression(availability, context);
}
//#endregion
//#region src/tools/descriptors.ts
/**
 * Identity helpers for authoring tool descriptors with stable inferred types.
 *
 * Callers use these at declaration sites so descriptor arrays keep readonly
 * shapes while still validating against the public ToolDescriptor contract.
 */
/** Define one tool descriptor without changing its runtime shape. */
function defineToolDescriptor(descriptor) {
  return descriptor;
}
/** Define a readonly descriptor list without changing runtime order or entries. */
function defineToolDescriptors(descriptors) {
  return descriptors;
}
//#endregion
//#region src/tools/diagnostics.ts
/** Error thrown when a visible tool plan cannot be built from descriptors. */
var ToolPlanContractError = class extends Error {
  constructor(params) {
    super(params.message);
    this.name = "ToolPlanContractError";
    this.code = params.code;
    this.toolName = params.toolName;
  }
};
//#endregion
//#region src/tools/execution.ts
/**
 * Formatting helpers for tool executor references.
 *
 * Executor refs are closed discriminated unions; the formatted string is for
 * diagnostics/logging and must not become a parser contract.
 */
/** Render an executor ref as a compact diagnostic label. */
function formatToolExecutorRef(ref) {
  switch (ref.kind) {
    case "core":
      return `core:${ref.executorId}`;
    case "plugin":
      return `plugin:${ref.pluginId}:${ref.toolName}`;
    case "channel":
      return `channel:${ref.channelId}:${ref.actionId}`;
    case "mcp":
      return `mcp:${ref.serverId}:${ref.toolName}`;
    default:
      return ref;
  }
}
//#endregion
//#region src/tools/planner.ts
/**
 * Deterministic planner for descriptor-backed tools.
 *
 * The planner sorts descriptors, hides unavailable tools with diagnostics, and
 * throws only when visible tool descriptors violate executor/name contracts.
 */
function compareDescriptors(left, right) {
  return (
    (left.sortKey ?? left.name).localeCompare(right.sortKey ?? right.name) ||
    left.name.localeCompare(right.name)
  );
}
function assertUniqueNames(descriptors) {
  const seen = /* @__PURE__ */ new Set();
  for (const descriptor of descriptors) {
    if (seen.has(descriptor.name))
      throw new ToolPlanContractError({
        code: "duplicate-tool-name",
        toolName: descriptor.name,
        message: `Duplicate tool descriptor name: ${descriptor.name}`,
      });
    seen.add(descriptor.name);
  }
}
/** Build the visible and hidden tool plan for a runtime context. */
function buildToolPlan(options) {
  const descriptors = options.descriptors.toSorted(compareDescriptors);
  assertUniqueNames(descriptors);
  const visible = [];
  const hidden = [];
  for (const descriptor of descriptors) {
    const diagnostics = [
      ...evaluateToolAvailability({
        descriptor,
        context: options.availability,
      }),
    ];
    if (diagnostics.length > 0) {
      hidden.push({
        descriptor,
        diagnostics,
      });
      continue;
    }
    if (!descriptor.executor)
      throw new ToolPlanContractError({
        code: "missing-executor",
        toolName: descriptor.name,
        message: `Visible tool descriptor has no executor ref: ${descriptor.name}`,
      });
    visible.push({
      descriptor,
      executor: descriptor.executor,
    });
  }
  return {
    visible,
    hidden,
  };
}
//#endregion
//#region src/tools/protocol.ts
function toToolProtocolDescriptor(entry) {
  return {
    name: entry.descriptor.name,
    description: entry.descriptor.description,
    inputSchema: entry.descriptor.inputSchema,
  };
}
function toToolProtocolDescriptors(entries) {
  return entries.map(toToolProtocolDescriptor);
}
//#endregion
export {
  ToolPlanContractError as a,
  evaluateToolAvailability as c,
  formatToolExecutorRef as i,
  toToolProtocolDescriptors as n,
  defineToolDescriptor as o,
  buildToolPlan as r,
  defineToolDescriptors as s,
  toToolProtocolDescriptor as t,
};
