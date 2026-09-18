import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { i as normalizeFileToolPathParam } from "./agent-tools.params-BZyOAvBo.js";
import {
  a as getCodeModeExecBeforeHookMetadataForToolKind,
  d as reconcileCodeModeExecBeforeHookParams,
  i as getCodeModeExecBeforeHookMetadata,
  l as normalizeCodeModeExecBeforeHookParams,
  u as normalizeCodeModeExecBeforeHookParamsForToolKind,
} from "./code-mode-control-tools-B27uc_a6.js";
import { t as resolveSkillWorkshopConfig } from "./config-XlfFMqhc.js";
import { I as canonicalizePath } from "./curator-BbVbrcMR.js";
import "./utils-DtcDeqWS.js";
import {
  i as diagnosticHttpStatusCode,
  t as diagnosticErrorCategory,
} from "./diagnostic-error-metadata-yrw7ASmg.js";
import {
  T as freezeDiagnosticTraceContext,
  c as emitTrustedSecurityEvent,
  l as emitTrustedSkillUsedDiagnosticEvent,
  o as emitTrustedDiagnosticEvent,
  s as emitTrustedDiagnosticEventWithPrivateData,
  x as createChildDiagnosticTraceContext,
} from "./diagnostic-events-5-gsFhkM.js";
import {
  n as resolveDiagnosticModelContentCapturePolicy,
  t as cloneDiagnosticContentValue,
} from "./diagnostic-llm-content-CU_-DTjY.js";
import "./config-BDv-QbJ6.js";
import "./client-BkZfVL9e.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  i as resolveApprovalInitiatingSurfaceState,
  n as describeNativePluginApprovalClientSetup,
} from "./exec-approval-surface-B6pFXhj3.js";
import {
  C as BEFORE_TOOL_CALL_HOOK_CONTEXT,
  S as BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS,
  T as BEFORE_TOOL_CALL_WRAPPED,
  b as copyChannelAgentToolMeta,
  d as copyToolTerminalPresentation,
  f as getToolTerminalPresentation,
  t as callGatewayTool,
  w as BEFORE_TOOL_CALL_SOURCE_TOOL,
  x as getChannelAgentToolMeta,
} from "./gateway-Dyh1k_4Q.js";
import {
  f as getGlobalHookRunnerRegistry,
  t as getGlobalHookRunner,
} from "./hook-runner-global-CPEPIvCK.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { a as createLazyRuntimeSurface } from "./lazy-runtime-B-Fc-m0I.js";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-CJQ8TR--.js";
import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-B7vhht0w.js";
import {
  n as DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS,
  r as MAX_PLUGIN_APPROVAL_TIMEOUT_MS,
} from "./plugin-approvals-D2muXfhg.js";
import { n as asNullableRecord } from "./record-coerce-DHZ4bFlT.js";
import { l as redactToolDetail } from "./redact-CUe6Oey5.js";
import { h as getPluginSessionExtensionStateSync } from "./registry-B14M_H8G.js";
import { c as resolveAgentRunAbortLifecycleFields } from "./run-termination-BEbihwT8.js";
import { c as getActivePluginRegistry } from "./runtime-CcYnX0B4.js";
import { i as resolveSandboxInputPath } from "./sandbox-paths-DxDLkOQF.js";
import { p as resolvePendingSkillProposal } from "./service-CFZizBrk.js";
import {
  n as resolveSkillTelemetrySource,
  r as resolveSkillTelemetrySourceValue,
} from "./source-9Jdpd6BI.js";
import { n as GatewayClientRequestError } from "./src-BOx4iLSi.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
import {
  a as resolveToolExecutionErrorKind,
  o as resolveToolResultFailureKind,
  t as formatToolExecutionErrorMessage,
} from "./tool-result-error-1qgstja-.js";
import { i as getPluginToolMeta, n as copyPluginToolMeta } from "./tools-K3NqAe9E.js";
import { f as PluginApprovalResolutions } from "./types-DN4huvwe.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/infra/embedded-mode.ts
let embeddedModeValue = false;
/** Sets the process-local embedded-mode flag used by UI and hosted runtimes. */
function setEmbeddedMode(value) {
  embeddedModeValue = value;
}
/** Returns whether the current process is running inside an embedded OpenClaw host. */
function isEmbeddedMode() {
  return embeddedModeValue;
}
//#endregion
//#region src/infra/embedded-plugin-approval-broker.ts
let activeBroker = null;
var EmbeddedPluginApprovalBroker = class {
  constructor() {
    this.pending = /* @__PURE__ */ new Map();
    this.listeners = /* @__PURE__ */ new Set();
  }
  subscribe(listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  listPending() {
    return [...this.pending.values()].map((entry) => entry.record);
  }
  async request(params) {
    if (params.signal?.aborted)
      throw params.signal.reason ?? /* @__PURE__ */ new Error("approval request aborted");
    const id = `plugin:${randomUUID()}`;
    const createdAtMs = Date.now();
    const record = {
      id,
      request: params.request,
      createdAtMs,
      expiresAtMs: createdAtMs + params.timeoutMs,
    };
    let resolve;
    let reject;
    const decision = new Promise((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });
    const timer = setTimeout(() => {
      const entry = this.pending.get(id);
      if (!entry) return;
      this.pending.delete(id);
      entry.resolve(null);
      this.emit({
        event: "plugin.approval.removed",
        payload: { id },
      });
    }, params.timeoutMs);
    timer.unref?.();
    this.pending.set(id, {
      record,
      timer,
      resolve,
      reject,
    });
    const abort = () => {
      const entry = this.pending.get(id);
      if (!entry) return;
      clearTimeout(entry.timer);
      this.pending.delete(id);
      entry.reject(params.signal?.reason ?? /* @__PURE__ */ new Error("approval request aborted"));
      this.emit({
        event: "plugin.approval.removed",
        payload: { id },
      });
    };
    params.signal?.addEventListener("abort", abort, { once: true });
    this.emit({
      event: "plugin.approval.requested",
      payload: record,
    });
    try {
      return {
        id,
        decision: await decision,
      };
    } finally {
      params.signal?.removeEventListener("abort", abort);
    }
  }
  resolve(id, decision) {
    const entry = this.pending.get(id);
    if (
      !entry ||
      !resolveCanonicalPluginApprovalRequestAllowedDecisions(entry.record.request).includes(
        decision,
      )
    )
      return false;
    clearTimeout(entry.timer);
    this.pending.delete(id);
    entry.resolve(decision);
    this.emit({
      event: "plugin.approval.resolved",
      payload: {
        id,
        decision,
        resolvedBy: "tui:embedded",
        ts: Date.now(),
        request: entry.record.request,
      },
    });
    return true;
  }
  stop(reason = /* @__PURE__ */ new Error("embedded plugin approval broker stopped")) {
    for (const [id, entry] of this.pending) {
      clearTimeout(entry.timer);
      entry.reject(reason);
      this.emit({
        event: "plugin.approval.removed",
        payload: { id },
      });
    }
    this.pending.clear();
    this.listeners.clear();
  }
  emit(event) {
    for (const listener of this.listeners) listener(event);
  }
};
function setEmbeddedPluginApprovalBroker(broker) {
  activeBroker = broker;
}
function clearEmbeddedPluginApprovalBroker(broker) {
  if (activeBroker === broker) activeBroker = null;
}
function getEmbeddedPluginApprovalBroker() {
  return activeBroker;
}
//#endregion
//#region src/agents/apply-patch-paths.ts
/**
 * Path extraction for the apply_patch envelope grammar.
 * Used by pre-execution policy hooks that only need destination paths, not the
 * full strict patch parser.
 */
/**
 * Lightweight path extractor for the `apply_patch` envelope grammar.
 *
 * The full parser in `apply-patch.ts` validates and applies a patch end-to-end.
 * Plugins running inside `before_tool_call` only need the destination paths so
 * they can compute path policy decisions before the patch is applied. This
 * helper walks the input lines and collects every path mentioned by:
 *
 *   - `*** Add File: <path>`
 *   - `*** Update File: <path>`         (and the optional `*** Move to: <new>`
 *                                         sub-marker that immediately follows)
 *   - `*** Delete File: <path>`
 *
 * Unlike the strict parser, this helper is forgiving: it does not require the
 * `*** Begin Patch` / `*** End Patch` envelope, it ignores non-marker lines
 * while scanning the full input, and it may therefore still pick up marker-like
 * lines that appear later in malformed input. Top-level hunk headers are matched
 * after trimming leading whitespace, like the executor parser; marker-like patch
 * body lines remain ignored while scanning an update hunk. Empty paths are dropped.
 *
 * The shape of the input mirrors how `apply_patch` receives it: either a
 * string (the full patch text) or an object with an `input` field carrying the
 * patch text. Anything else returns an empty array.
 */
const ADD_FILE_MARKER = "*** Add File: ";
const DELETE_FILE_MARKER = "*** Delete File: ";
const UPDATE_FILE_MARKER = "*** Update File: ";
const MOVE_TO_MARKER = "*** Move to: ";
function readPatchText(input) {
  if (typeof input === "string") return input;
  if (input && typeof input === "object" && "input" in input) {
    const candidate = input.input;
    if (typeof candidate === "string") return candidate;
  }
}
function normalizePatchPath(raw, options = {}) {
  if (raw.length === 0) return;
  const cwd = options.cwd ?? options.sandbox?.root ?? process.cwd();
  try {
    const resolved = options.sandbox
      ? options.sandbox.bridge.resolvePath({
          filePath: raw,
          cwd,
        })
      : void 0;
    const normalized = path.normalize(
      resolved ? (resolved.hostPath ?? resolved.containerPath) : resolveSandboxInputPath(raw, cwd),
    );
    return normalized && normalized !== "." ? normalized : void 0;
  } catch {
    return;
  }
}
function pushPath(target, seen, raw, options) {
  const normalized = normalizePatchPath(raw, options);
  if (!normalized) return;
  if (seen.has(normalized)) return;
  seen.add(normalized);
  target.push(normalized);
}
function readMarkerPath(line, marker) {
  const candidate = normalizeMarkerHeaderLine(line);
  if (!candidate?.startsWith(marker)) return;
  return candidate.slice(marker.length);
}
function normalizeMarkerHeaderLine(line, options) {
  if (line === void 0) return;
  const startTrimmed = line.trimStart();
  if (!startTrimmed.startsWith("***")) return;
  const leadingWhitespace = line.length - startTrimmed.length;
  if (options?.allowSingleSpaceIndent === false && leadingWhitespace === 1 && line.startsWith(" "))
    return;
  return startTrimmed.trimEnd();
}
/**
 * Walk an apply_patch envelope and return every destination path found, in
 * the order they appear. Duplicates are de-duplicated (the same file may be
 * referenced multiple times within a single envelope). Returns `[]` for any
 * input that is not a recognised envelope.
 */
function extractApplyPatchTargetPaths(input, options = {}) {
  const text = readPatchText(input);
  if (text === void 0 || text.length === 0) return [];
  const lines = text.split(/\r?\n/);
  const paths = [];
  const seen = /* @__PURE__ */ new Set();
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines.at(index);
    if (line === void 0) break;
    const addPath = readMarkerPath(line, ADD_FILE_MARKER);
    if (addPath !== void 0) {
      pushPath(paths, seen, addPath, options);
      while (index + 1 < lines.length && lines.at(index + 1)?.startsWith("+")) index += 1;
      continue;
    }
    const deletePath = readMarkerPath(line, DELETE_FILE_MARKER);
    if (deletePath !== void 0) {
      pushPath(paths, seen, deletePath, options);
      continue;
    }
    const updatePath = readMarkerPath(line, UPDATE_FILE_MARKER);
    if (updatePath !== void 0) {
      pushPath(paths, seen, updatePath, options);
      let lookahead = index + 1;
      while (lookahead < lines.length && lines.at(lookahead)?.trim() === "") lookahead += 1;
      const movePath = readMarkerPath(lines.at(lookahead), MOVE_TO_MARKER);
      if (movePath !== void 0) {
        pushPath(paths, seen, movePath, options);
        lookahead += 1;
      }
      while (lookahead < lines.length) {
        const lookaheadLine = lines.at(lookahead);
        if (lookaheadLine === void 0) break;
        if (lookaheadLine.trim() === "") {
          lookahead += 1;
          continue;
        }
        if (lookaheadLine.startsWith("***")) break;
        lookahead += 1;
      }
      index = lookahead - 1;
    }
  }
  return paths;
}
//#endregion
//#region src/plugins/host-tool-param-parsers.ts
/**
 * Per-tool host-owned param derivers. Keep this map small and focused — every
 * entry runs synchronously inside the before_tool_call hot path.
 */
const HOST_TOOL_PARAM_PARSERS = {
  apply_patch: (params, options) => {
    const paths = extractApplyPatchTargetPaths(params, options);
    return paths.length > 0 ? { derivedPaths: Object.freeze([...paths]) } : {};
  },
};
/**
 * Derive host-owned metadata for a tool call. Returns an empty object when no
 * parser is registered for the tool, which lets callers spread the result
 * unconditionally without a nullability check.
 */
function deriveToolParams(toolName, params, options) {
  if (!Object.hasOwn(HOST_TOOL_PARAM_PARSERS, toolName)) return {};
  const parser = HOST_TOOL_PARAM_PARSERS[toolName];
  return parser ? parser(params, options) : {};
}
//#endregion
//#region src/plugins/trusted-tool-policy.ts
/** True when the supplied or active plugin registry has trusted tool policies. */
function hasTrustedToolPolicies(registry = getActivePluginRegistry()) {
  return copyTrustedPolicyRegistrations(registry).length > 0;
}
function unreadableTrustedPolicyRegistration() {
  return {
    pluginId: "unknown-plugin",
    source: "runtime",
    get policy() {
      throw new Error("trusted policy registration is unreadable");
    },
  };
}
function copyTrustedPolicyRegistrations(registry) {
  let policies;
  try {
    policies = registry?.trustedToolPolicies;
  } catch {
    return [unreadableTrustedPolicyRegistration()];
  }
  if (!policies) return [];
  try {
    if (!Array.isArray(policies)) return [unreadableTrustedPolicyRegistration()];
    return policies.map((policy) => policy);
  } catch {
    return [unreadableTrustedPolicyRegistration()];
  }
}
function readTrustedPolicyPluginId(registration) {
  try {
    const pluginId = registration.pluginId;
    return typeof pluginId === "string" && pluginId.trim() ? pluginId.trim() : void 0;
  } catch {
    return;
  }
}
function trustedPolicyDiagnosticPluginId(registration) {
  return readTrustedPolicyPluginId(registration) ?? "unknown-plugin";
}
function readTrustedPolicyPluginName(registration) {
  try {
    const pluginName = registration.pluginName;
    return typeof pluginName === "string" && pluginName.trim() ? pluginName.trim() : void 0;
  } catch {
    return;
  }
}
function readTrustedPolicy(registration) {
  try {
    const policy = registration.policy;
    return policy && typeof policy.evaluate === "function"
      ? {
          ok: true,
          policy,
        }
      : { ok: false };
  } catch {
    return { ok: false };
  }
}
function readTrustedPolicyId(registration) {
  const fallback = trustedPolicyDiagnosticPluginId(registration);
  const policy = readTrustedPolicy(registration);
  if (!policy.ok) return fallback;
  try {
    const id = policy.policy.id;
    return typeof id === "string" && id.trim() ? id.trim() : fallback;
  } catch {
    return fallback;
  }
}
function trustedPolicyDefaultBlockReason(registration) {
  return `blocked by ${readTrustedPolicyId(registration)}`;
}
function trustedPolicyFailureResult(registration, detail) {
  return {
    block: true,
    blockReason: `${trustedPolicyDefaultBlockReason(registration)}: ${detail}`,
  };
}
/** Lists trusted tool policies for status and diagnostics. */
function getTrustedToolPolicyDiagnosticEntries(registry = getActivePluginRegistry()) {
  return copyTrustedPolicyRegistrations(registry).map((registration) => {
    const entry = {
      id: readTrustedPolicyId(registration),
      pluginId: trustedPolicyDiagnosticPluginId(registration),
    };
    const pluginName = readTrustedPolicyPluginName(registration);
    if (pluginName) entry.pluginName = pluginName;
    return entry;
  });
}
function normalizeDerivedEventFields(value) {
  return Array.isArray(value?.derivedPaths)
    ? { derivedPaths: Object.freeze([...value.derivedPaths]) }
    : {};
}
function normalizeToolIdentity(value) {
  return {
    ...(value?.toolKind && { toolKind: value.toolKind }),
    ...(value?.toolInputKind && { toolInputKind: value.toolInputKind }),
  };
}
/** Runs trusted tool policies before a tool call and returns the first terminal decision. */
async function runTrustedToolPolicies(event, ctx, options) {
  const policies = copyTrustedPolicyRegistrations(options?.registry ?? getActivePluginRegistry());
  let adjustedParams = event.params;
  let hasAdjustedParams = false;
  let approval;
  const sessionExtensionStateCache = /* @__PURE__ */ new Map();
  let resolvedSessionConfig = options?.config;
  let didResolveSessionConfig = Boolean(options?.config);
  const resolveSessionConfig = () => {
    if (!didResolveSessionConfig) {
      didResolveSessionConfig = true;
      try {
        resolvedSessionConfig = getRuntimeConfig();
      } catch {
        resolvedSessionConfig = void 0;
      }
    }
    return resolvedSessionConfig;
  };
  const { derivedPaths, toolKind, toolInputKind, ...eventWithoutDerivedPaths } = event;
  const { toolKind: ctxToolKind, toolInputKind: ctxToolInputKind, ...ctxWithoutToolIdentity } = ctx;
  let currentDerivedEvent = normalizeDerivedEventFields({ derivedPaths });
  let currentEventToolIdentity = normalizeToolIdentity({
    toolKind,
    toolInputKind,
  });
  let currentContextToolIdentity = normalizeToolIdentity({
    toolKind: ctxToolKind,
    toolInputKind: ctxToolInputKind,
  });
  const buildEvent = () => {
    return {
      ...eventWithoutDerivedPaths,
      params: adjustedParams,
      ...currentEventToolIdentity,
      ...currentDerivedEvent,
    };
  };
  for (const registration of policies) {
    const pluginId = readTrustedPolicyPluginId(registration);
    if (!pluginId) return trustedPolicyFailureResult(registration, "policy owner is unreadable");
    const policyCtx = {
      ...ctxWithoutToolIdentity,
      ...currentContextToolIdentity,
      getSessionExtension: (namespace) => {
        const normalizedNamespace = namespace.trim();
        const cacheKey = pluginId;
        if (!sessionExtensionStateCache.has(cacheKey)) {
          const config = ctx.sessionKey ? resolveSessionConfig() : void 0;
          sessionExtensionStateCache.set(
            cacheKey,
            config
              ? getPluginSessionExtensionStateSync({
                  cfg: config,
                  pluginId,
                  sessionKey: ctx.sessionKey,
                })
              : void 0,
          );
        }
        const pluginState = sessionExtensionStateCache.get(cacheKey);
        if (!normalizedNamespace || !pluginState) return;
        return pluginState[normalizedNamespace];
      },
    };
    const policy = readTrustedPolicy(registration);
    if (!policy.ok) return trustedPolicyFailureResult(registration, "policy is unreadable");
    let decision;
    try {
      decision = await policy.policy.evaluate(buildEvent(), policyCtx);
    } catch {
      return trustedPolicyFailureResult(registration, "policy evaluation failed");
    }
    if (!decision) continue;
    try {
      if ("allow" in decision && decision.allow === false)
        return {
          block: true,
          blockReason: decision.reason ?? trustedPolicyDefaultBlockReason(registration),
        };
      if ("block" in decision && decision.block === true)
        return {
          ...decision,
          blockReason: decision.blockReason ?? trustedPolicyDefaultBlockReason(registration),
        };
      if ("params" in decision && isPlainObject(decision.params)) {
        const normalized = options?.normalizeEvent?.(
          {
            ...eventWithoutDerivedPaths,
            params: decision.params,
            ...currentEventToolIdentity,
            ...currentDerivedEvent,
          },
          policyCtx,
        );
        adjustedParams = normalized?.params ?? decision.params;
        if (normalized?.event) currentEventToolIdentity = normalizeToolIdentity(normalized.event);
        if (normalized?.ctx) currentContextToolIdentity = normalizeToolIdentity(normalized.ctx);
        else if (normalized?.event)
          currentContextToolIdentity = normalizeToolIdentity(normalized.event);
        hasAdjustedParams = true;
        currentDerivedEvent = normalizeDerivedEventFields(options?.deriveEvent?.(adjustedParams));
      }
      if ("requireApproval" in decision && decision.requireApproval && !approval)
        approval = decision.requireApproval;
    } catch {
      return trustedPolicyFailureResult(registration, "policy decision is unreadable");
    }
  }
  if (!hasAdjustedParams && !approval) return;
  return {
    ...(hasAdjustedParams ? { params: adjustedParams } : {}),
    ...(approval ? { requireApproval: approval } : {}),
  };
}
//#endregion
//#region src/skills/workshop/policy.ts
const SKILL_WORKSHOP_LIFECYCLE_ACTIONS = /* @__PURE__ */ new Set(["apply", "reject", "quarantine"]);
const SKILL_WORKSHOP_APPROVAL_TIMEOUT_MS = 7e4;
function readLifecycleAction(params) {
  const action = asNullableRecord(params)?.action;
  if (typeof action !== "string" || !SKILL_WORKSHOP_LIFECYCLE_ACTIONS.has(action)) return;
  return action;
}
function lifecycleApprovalText(action) {
  if (action === "apply")
    return {
      title: "Apply workspace skill proposal",
      description: "Apply a pending workspace skill proposal into live workspace skills.",
      severity: "warning",
    };
  if (action === "reject")
    return {
      title: "Reject workspace skill proposal",
      description: "Reject a pending workspace skill proposal.",
      severity: "info",
    };
  return {
    title: "Quarantine workspace skill proposal",
    description: "Quarantine a pending workspace skill proposal.",
    severity: "info",
  };
}
function readOptionalString(record, key) {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function formatBodySizeKb(content) {
  return (Buffer.byteLength(content, "utf8") / 1024).toFixed(1);
}
function formatApprovalField(value) {
  return value.replace(/[\p{Cc}\p{Cf}\p{Zl}\p{Zp}]/gu, (character) =>
    character === "\n" || character === "\r" || character === "\u2028" || character === "\u2029"
      ? "↵"
      : "�",
  );
}
function buildLifecycleApprovalDescription(params) {
  const description = formatApprovalField(params.description);
  const requestedSkillName = formatApprovalField(params.skillName);
  const fixedLines = [
    `Proposal ID: ${params.proposalId}`,
    `Description: ${description}`,
    `Support files: ${params.supportFileCount}`,
    `Body size: ${params.bodySizeKb} KB`,
  ];
  const skillPrefix = "Target skill: ";
  const fixedLength = fixedLines.join("\n").length + 14 + fixedLines.length;
  const availableSkillNameLength = Math.max(1, 512 - fixedLength);
  const skillName =
    requestedSkillName.length <= availableSkillNameLength
      ? requestedSkillName
      : `${truncateUtf16Safe(requestedSkillName, Math.max(0, availableSkillNameLength - 1))}…`;
  return [fixedLines[0], `${skillPrefix}${skillName}`, ...fixedLines.slice(1)].join("\n");
}
async function resolveLifecycleApprovalDescription(params) {
  if (!params.workspaceDir) return { description: params.fallback };
  const toolParams = asNullableRecord(params.toolParams);
  try {
    const proposal = await resolvePendingSkillProposal({
      proposalId: readOptionalString(toolParams, "proposal_id"),
      name: readOptionalString(toolParams, "name"),
      workspaceDir: params.workspaceDir,
    });
    const record = proposal.record;
    return {
      description: buildLifecycleApprovalDescription({
        proposalId: record.id,
        skillName: record.target.skillName,
        description: record.description,
        supportFileCount: record.supportFiles?.length ?? 0,
        bodySizeKb: formatBodySizeKb(proposal.content),
      }),
      proposalId: record.id,
    };
  } catch {
    return { description: params.fallback };
  }
}
function lifecycleApprovalTimeoutReason(proposalId) {
  return [
    "The Skill Workshop approval request expired without a decision.",
    `This lifecycle call left ${proposalId ? `Proposal ${proposalId}` : "the proposal"} unchanged and pending; check its current status in case another operator acted on it.`,
    "Decide in the Skill Workshop UI or run `openclaw skills workshop apply|reject|quarantine <id>`.",
    "Do not retry this tool call in a loop.",
  ].join(" ");
}
function resolveApprovalConfig(config) {
  if (config) return config;
  try {
    return getRuntimeConfig();
  } catch {
    return;
  }
}
/** Returns approval policy for skill workshop lifecycle tool calls. */
async function resolveSkillWorkshopToolApproval(params) {
  if (params.toolName !== "skill_workshop") return;
  const action = readLifecycleAction(params.toolParams);
  if (!action) return;
  if (resolveSkillWorkshopConfig(resolveApprovalConfig(params.config)).approvalPolicy === "auto")
    return;
  const text = lifecycleApprovalText(action);
  const approvalDescription = await resolveLifecycleApprovalDescription({
    toolParams: params.toolParams,
    workspaceDir: params.workspaceDir,
    fallback: text.description,
  });
  return {
    requireApproval: {
      ...text,
      description: approvalDescription.description,
      timeoutMs: SKILL_WORKSHOP_APPROVAL_TIMEOUT_MS,
      timeoutReason: lifecycleApprovalTimeoutReason(approvalDescription.proposalId),
      allowedDecisions: ["allow-once", "deny"],
    },
  };
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.state.ts
/**
 * Shared before_tool_call state for adjusted tool params.
 * The adapter and wrapper both consult this map so later execution can use the
 * normalized payload selected by hook processing.
 */
const adjustedParamsByToolCallId = /* @__PURE__ */ new Map();
const preExecutionBlockedToolCallIds = /* @__PURE__ */ new Set();
const structuredReplaySafeToolCallIds = /* @__PURE__ */ new Set();
function buildAdjustedParamsKey(params) {
  if (params.runId && params.runId.trim()) return `${params.runId}:${params.toolCallId}`;
  return params.toolCallId;
}
/** Consume and remove hook-adjusted params for a completed tool call. */
function consumeAdjustedParamsForToolCall(toolCallId, runId) {
  const key = buildAdjustedParamsKey({
    runId,
    toolCallId,
  });
  const params = adjustedParamsByToolCallId.get(key);
  adjustedParamsByToolCallId.delete(key);
  return params;
}
/** Snapshot hook-adjusted params without consuming later outcome bookkeeping. */
function peekAdjustedParamsForToolCall(toolCallId, runId) {
  const key = buildAdjustedParamsKey({
    runId,
    toolCallId,
  });
  const params = adjustedParamsByToolCallId.get(key);
  return params === void 0 ? void 0 : structuredClone(params);
}
/** Consume whether policy prevented the target tool from starting. */
function consumePreExecutionBlockedToolCall(toolCallId, runId) {
  const key = buildAdjustedParamsKey({
    runId,
    toolCallId,
  });
  const blocked = preExecutionBlockedToolCallIds.has(key);
  preExecutionBlockedToolCallIds.delete(key);
  return blocked;
}
function recordStructuredReplaySafeToolCall(toolCallId, runId) {
  structuredReplaySafeToolCallIds.add(
    buildAdjustedParamsKey({
      runId,
      toolCallId,
    }),
  );
}
function consumeStructuredReplaySafeToolCall(toolCallId, runId) {
  const key = buildAdjustedParamsKey({
    runId,
    toolCallId,
  });
  const replaySafe = structuredReplaySafeToolCallIds.has(key);
  structuredReplaySafeToolCallIds.delete(key);
  return replaySafe;
}
//#endregion
//#region src/agents/agent-tools.before-tool-call.ts
/**
 * before_tool_call policy runtime for agent tools.
 * Runs plugin hooks, trusted tool policies, approvals, diagnostics, loop
 * detection, skill-use telemetry, and adjusted parameter tracking.
 */
function resolvePluginToolApprovalTimeoutMs(approval) {
  if (
    typeof approval.timeoutMs !== "number" ||
    !Number.isFinite(approval.timeoutMs) ||
    approval.timeoutMs <= 0
  )
    return DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS;
  return Math.min(Math.floor(approval.timeoutMs), MAX_PLUGIN_APPROVAL_TIMEOUT_MS);
}
function resolvePluginToolApprovalGatewayTimeoutMs(timeoutMs) {
  return addTimerTimeoutGraceMs(timeoutMs, 1e4) ?? 13e4;
}
/** Return whether before_tool_call hooks or trusted policies are active. */
function getBeforeToolCallPolicyDiagnosticState() {
  const policyRegistry = getGlobalHookRunnerRegistry() ?? void 0;
  return {
    hasBeforeToolCallHook: getGlobalHookRunner()?.hasHooks("before_tool_call") === true,
    trustedToolPolicies: getTrustedToolPolicyDiagnosticEntries(policyRegistry),
  };
}
/** Return true when any before_tool_call policy could affect tool execution. */
function hasBeforeToolCallPolicy() {
  const state = getBeforeToolCallPolicyDiagnosticState();
  return state.hasBeforeToolCallHook || state.trustedToolPolicies.length > 0;
}
const log = createSubsystemLogger("agents/tools");
const BEFORE_TOOL_CALL_HOOK_FAILURE_REASON =
  "Tool call blocked because before_tool_call hook failed";
const MAX_TRACKED_ADJUSTED_PARAMS = 1024;
const MAX_PENDING_TERMINAL_PRESENTATIONS = 1024;
const LOOP_WARNING_BUCKET_SIZE = 10;
const MAX_LOOP_WARNING_KEYS = 256;
const MAX_TERMINAL_PRESENTATION_CHARS = 2e3;
const pendingTerminalPresentationByToolCall = /* @__PURE__ */ new Map();
function resolveToolTerminalPresentation(params) {
  try {
    const sourceTool = params.tool[BEFORE_TOOL_CALL_SOURCE_TOOL];
    const text = getToolTerminalPresentation(
      sourceTool && typeof sourceTool === "object" ? sourceTool : params.tool,
    )?.(params.toolParams, params.result)?.text.trim();
    if (!text) return;
    return truncateUtf16Safe(redactToolDetail(text), MAX_TERMINAL_PRESENTATION_CHARS);
  } catch (err) {
    log.warn(
      `terminal tool presentation failed: tool=${params.tool.name || "tool"} error=${String(err)}`,
    );
    return;
  }
}
function rememberPendingTerminalPresentation(params) {
  if (!params.toolCallId || !params.ctx?.onToolOutcome) return;
  const key = buildAdjustedParamsKey({
    runId: params.ctx.runId,
    toolCallId: params.toolCallId,
  });
  pendingTerminalPresentationByToolCall.set(key, {
    observer: params.ctx.onToolOutcome,
    tool: params.tool,
    toolParams: structuredClone(params.toolParams),
    toolCallOrdinal: params.toolCallOrdinal,
  });
  while (pendingTerminalPresentationByToolCall.size > MAX_PENDING_TERMINAL_PRESENTATIONS) {
    const oldestKey = pendingTerminalPresentationByToolCall.keys().next().value;
    if (!oldestKey) break;
    pendingTerminalPresentationByToolCall.delete(oldestKey);
  }
}
/** Finalizes a trusted terminal summary after harness result middleware. */
function finalizeToolTerminalPresentation(params) {
  const key = buildAdjustedParamsKey({
    runId: params.runId,
    toolCallId: params.toolCallId,
  });
  const pending = pendingTerminalPresentationByToolCall.get(key);
  pendingTerminalPresentationByToolCall.delete(key);
  const observer = pending?.observer ?? params.observer;
  if (!observer) return;
  const toolCallOrdinal = pending?.toolCallOrdinal ?? params.toolCallOrdinal;
  observer({
    toolName: pending?.tool.name || params.toolName || "tool",
    argsHash: "",
    resultHash: "",
    ...(toolCallOrdinal !== void 0 ? { toolCallOrdinal } : {}),
    terminalPresentation: params.isError
      ? void 0
      : pending
        ? resolveToolTerminalPresentation({
            tool: pending.tool,
            toolParams: pending.toolParams,
            result: params.result,
          })
        : void 0,
    presentationOnly: true,
  });
}
/**
 * Error used when before_tool_call intentionally vetoes a tool call.
 */
var BeforeToolCallBlockedError = class extends Error {
  constructor(reason) {
    super(reason);
    this.reason = reason;
    this.name = "BeforeToolCallBlockedError";
  }
};
var BeforeToolCallFailureError = class extends Error {
  constructor(message, disposition, cause) {
    super(message, cause === void 0 ? void 0 : { cause });
    this.disposition = disposition;
    this.name = "BeforeToolCallFailureError";
  }
};
function tagBeforeToolCallFailure(error, signal) {
  try {
    if (error instanceof BeforeToolCallFailureError) return error;
  } catch {}
  const message = formatToolExecutionErrorMessage(error, "before_tool_call failed");
  const disposition = resolveToolErrorDiagnostic(error, signal).terminalReason;
  return new BeforeToolCallFailureError(message, disposition, error);
}
/** Return the closed terminal disposition carried by a before-tool failure. */
function getBeforeToolCallFailureDisposition(error) {
  try {
    return error instanceof BeforeToolCallFailureError ? error.disposition : void 0;
  } catch {
    return;
  }
}
/** Remember hook-adjusted params for later adapter-side execution. */
function recordAdjustedParamsForToolCall(toolCallId, params, runId) {
  if (!toolCallId) return;
  const cloneResult = cloneParamsForAdjustedReplay(params);
  if (!cloneResult.ok) return;
  const adjustedParamsKey = buildAdjustedParamsKey({
    runId,
    toolCallId,
  });
  adjustedParamsByToolCallId.set(adjustedParamsKey, cloneResult.value);
  if (adjustedParamsByToolCallId.size > MAX_TRACKED_ADJUSTED_PARAMS) {
    const oldest = adjustedParamsByToolCallId.keys().next().value;
    if (oldest) adjustedParamsByToolCallId.delete(oldest);
  }
}
function cloneParamsForAdjustedReplay(params) {
  try {
    return {
      ok: true,
      value: structuredClone(params),
    };
  } catch {
    return { ok: false };
  }
}
/** Record that one concrete core-owned tool call may use structured replay classification. */
function recordStructuredReplayTrustForToolCall(toolCallId, tool, runId) {
  if (!toolCallId || getPluginToolMeta(tool) || getChannelAgentToolMeta(tool)) return;
  recordStructuredReplaySafeToolCall(toolCallId, runId);
  while (structuredReplaySafeToolCallIds.size > MAX_TRACKED_ADJUSTED_PARAMS) {
    const oldest = structuredReplaySafeToolCallIds.values().next().value;
    if (!oldest) break;
    structuredReplaySafeToolCallIds.delete(oldest);
  }
}
/**
 * Returns true when an error represents an intentional before_tool_call veto.
 */
function isBeforeToolCallBlockedError(err) {
  return err instanceof BeforeToolCallBlockedError;
}
const loadBeforeToolCallRuntime = createLazyRuntimeSurface(
  () => import("./agent-tools.before-tool-call.runtime.js"),
  ({ beforeToolCallRuntime }) => beforeToolCallRuntime,
);
function mergeParamsWithApprovalOverrides(originalParams, approvalParams) {
  if (approvalParams && isPlainObject(approvalParams)) {
    if (isPlainObject(originalParams))
      return {
        ...originalParams,
        ...approvalParams,
      };
    return approvalParams;
  }
  return originalParams;
}
function unwrapErrorCause(err) {
  try {
    if (!(err instanceof Error)) return err;
    const cause = Object.getOwnPropertyDescriptor(err, "cause");
    if (cause && "value" in cause && cause.value !== void 0) return cause.value;
  } catch {
    return err;
  }
  return err;
}
function resolveToolErrorDiagnostic(err, signal, errorCategory) {
  const cause = unwrapErrorCause(err);
  const errorCode = diagnosticHttpStatusCode(cause);
  const abortFields = resolveAgentRunAbortLifecycleFields(signal);
  const terminalReason = !abortFields.aborted
    ? resolveToolExecutionErrorKind(cause)
    : abortFields.stopReason === "timeout"
      ? "timed_out"
      : "cancelled";
  return {
    errorCategory:
      terminalReason === "cancelled"
        ? "aborted"
        : (errorCategory ?? diagnosticErrorCategory(cause)),
    terminalReason,
    ...(errorCode ? { errorCode } : {}),
  };
}
function resolveToolResultTerminalDiagnostic(result, durationMs) {
  const failureKind = resolveToolResultFailureKind(result);
  if (!failureKind)
    return {
      type: "tool.execution.completed",
      durationMs,
    };
  if (failureKind === "blocked")
    return {
      type: "tool.execution.blocked",
      deniedReason: "tool_result_blocked",
      reason: "tool_result_blocked",
    };
  return {
    type: "tool.execution.error",
    durationMs,
    errorCategory: "tool_result_error",
    terminalReason: failureKind,
  };
}
function resolveToolDiagnosticIdentity(tool) {
  const pluginMeta = getPluginToolMeta(tool);
  if (pluginMeta)
    return pluginMeta.pluginId === "bundle-mcp"
      ? {
          toolSource: "mcp",
          toolOwner: pluginMeta.pluginId,
        }
      : {
          toolSource: "plugin",
          toolOwner: pluginMeta.pluginId,
        };
  const channelMeta = getChannelAgentToolMeta(tool);
  if (channelMeta)
    return {
      toolSource: "channel",
      toolOwner: channelMeta.channelId,
    };
  return { toolSource: "core" };
}
function canonicalSkillFile(value) {
  const skillFile = value?.trim();
  return skillFile && path.isAbsolute(skillFile)
    ? canonicalizePath(path.resolve(skillFile))
    : void 0;
}
function resolvedSkillUsageMatch(params) {
  const skillFile = canonicalSkillFile(params.skill.filePath);
  return {
    skillName: params.skill.name.trim(),
    skillSource: resolveSkillTelemetrySource(params.skill),
    activation: params.activation,
    ...(skillFile ? { skillFile } : {}),
  };
}
function findResolvedSkillUsageMatch(params) {
  const skillName = params.skillName.trim();
  const candidates = (params.snapshot?.resolvedSkills ?? []).filter(
    (skill) => skill.name.trim() === skillName,
  );
  const skill =
    candidates.find((candidate) => resolveSkillTelemetrySource(candidate) === params.skillSource) ??
    (candidates.length === 1 ? candidates[0] : void 0);
  return skill
    ? resolvedSkillUsageMatch({
        activation: params.activation,
        skill,
      })
    : void 0;
}
function resolveRelativeToolPath(candidate, ctx) {
  const trimmed = candidate.trim();
  if (!trimmed) return;
  if (trimmed.startsWith("node://")) return trimmed;
  if (trimmed === "~") return os.homedir();
  if (trimmed.startsWith("~/")) return path.resolve(os.homedir(), trimmed.slice(2));
  if (path.isAbsolute(trimmed)) return path.resolve(trimmed);
  const base = ctx?.workspaceDir ?? ctx?.cwd;
  return base ? path.resolve(base, trimmed) : void 0;
}
function readToolPathCandidates(params, ctx) {
  if (!isPlainObject(params)) return [];
  return (typeof params.path === "string" ? [params.path] : [])
    .map((candidate) => resolveRelativeToolPath(normalizeFileToolPathParam(candidate), ctx))
    .filter((candidate) => Boolean(candidate));
}
function skillInstructionPaths(snapshot) {
  const matches = /* @__PURE__ */ new Map();
  for (const skill of snapshot?.resolvedSkills ?? []) {
    if (!(typeof skill.name === "string" ? skill.name.trim() : "")) continue;
    const match = resolvedSkillUsageMatch({
      activation: "read",
      skill,
    });
    const filePath = typeof skill.filePath === "string" ? skill.filePath.trim() : "";
    if (filePath) {
      if (filePath.startsWith("node://")) matches.set(filePath, match);
      else if (path.isAbsolute(filePath)) matches.set(path.resolve(filePath), match);
    }
    const baseDir = typeof skill.baseDir === "string" ? skill.baseDir.trim() : "";
    if (baseDir && path.isAbsolute(baseDir)) matches.set(path.resolve(baseDir, "SKILL.md"), match);
  }
  return matches;
}
function materializedSkillInstructionPaths(paths) {
  const matches = /* @__PURE__ */ new Map();
  for (const entry of paths ?? [])
    matches.set(path.resolve(entry.readPath), {
      skillFile: entry.skillFile,
      skillName: entry.skillName,
      skillSource: entry.skillSource,
      activation: "read",
    });
  return matches;
}
function findSkillUsageMatch(params) {
  const command = params.ctx?.skillCommand;
  if (command) {
    const commandToolName = normalizeToolName(command.toolName ?? params.toolName);
    if (!commandToolName || commandToolName === params.toolName) {
      const skillSource = resolveSkillTelemetrySourceValue(command.skillSource);
      const snapshotMatch = findResolvedSkillUsageMatch({
        activation: "command",
        skillName: command.skillName,
        skillSource,
        snapshot: params.ctx?.skillsSnapshot,
      });
      const skillFile = canonicalSkillFile(command.skillFile) ?? snapshotMatch?.skillFile;
      return {
        skillName: command.skillName,
        skillSource,
        activation: "command",
        ...(skillFile ? { skillFile } : {}),
      };
    }
  }
  if (params.toolName !== "read") return;
  const skillPaths = params.ctx?.skillsSnapshot?.resolvedSkills?.length
    ? skillInstructionPaths(params.ctx.skillsSnapshot)
    : materializedSkillInstructionPaths(params.ctx?.skillUsagePaths);
  for (const candidate of readToolPathCandidates(params.toolParams, params.ctx)) {
    const match = skillPaths.get(candidate);
    if (match) return match;
  }
}
function emitSkillUsedDiagnostic(params) {
  const trace = params.ctx?.trace
    ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(params.ctx.trace))
    : void 0;
  emitTrustedSkillUsedDiagnosticEvent(
    {
      type: "skill.used",
      ...(params.ctx?.runId && { runId: params.ctx.runId }),
      ...(params.ctx?.sessionKey && { sessionKey: params.ctx.sessionKey }),
      ...(params.ctx?.sessionId && { sessionId: params.ctx.sessionId }),
      ...(params.ctx?.agentId && { agentId: params.ctx.agentId }),
      ...(trace && { trace }),
      skillName: params.match.skillName,
      skillSource: params.match.skillSource,
      activation: params.match.activation,
      toolName: params.toolName,
      ...(params.toolCallId && { toolCallId: params.toolCallId }),
    },
    params.match.skillFile ? { skillUsage: { skillFile: params.match.skillFile } } : void 0,
  );
}
function emitToolBlockedSecurityEvent(params) {
  const control =
    params.deniedReason === "tool-loop"
      ? {
          policyId: "tool-loop-detection",
          controlId: "tool-loop-detection",
          family: "authorization",
        }
      : params.deniedReason === "plugin-approval"
        ? {
            policyId: "plugin-tool-approval",
            controlId: "plugin-tool-approval",
            family: "approval",
          }
        : {
            policyId: "plugin-before-tool-call",
            controlId: "before-tool-call",
            family: "approval",
          };
  emitTrustedSecurityEvent({
    category: "tool",
    action: "tool.execution.blocked",
    outcome: "denied",
    severity: "medium",
    reason: params.deniedReason,
    ...(params.trace ? { trace: params.trace } : {}),
    actor: { kind: "agent" },
    target: {
      kind: "tool",
      name: params.toolName,
      ...(params.toolIdentity.toolOwner ? { owner: params.toolIdentity.toolOwner } : {}),
    },
    policy: {
      id: control.policyId,
      decision: "deny",
      reason: params.deniedReason,
    },
    control: {
      id: control.controlId,
      family: control.family,
    },
    attributes: {
      tool_source: params.toolIdentity.toolSource,
      ...(params.paramsSummary ? { params_kind: params.paramsSummary.kind } : {}),
    },
  });
}
const warnedDeprecatedTimeoutBehaviorPluginIds = /* @__PURE__ */ new Set();
function warnDeprecatedApprovalTimeoutBehavior(approval) {
  if (approval.timeoutBehavior !== "allow") return;
  const pluginId = approval.pluginId ?? "unknown-plugin";
  if (warnedDeprecatedTimeoutBehaviorPluginIds.has(pluginId)) return;
  warnedDeprecatedTimeoutBehaviorPluginIds.add(pluginId);
  log.warn(
    `plugin '${pluginId}' sets deprecated requireApproval.timeoutBehavior:"allow"; the field is ignored and approvals fail closed on timeout (see docs/plugins/plugin-permission-requests.md)`,
  );
}
function notifyPluginApprovalResolution(approval, resolution) {
  const onResolution = approval.onResolution;
  if (typeof onResolution !== "function") return;
  try {
    Promise.resolve(onResolution(resolution)).catch((err) => {
      log.warn(`plugin onResolution callback failed: ${String(err)}`);
    });
  } catch (err) {
    log.warn(`plugin onResolution callback failed: ${String(err)}`);
  }
}
function resolvePermittedPluginApprovalResolution(decision, allowedDecisions) {
  if (
    (decision === PluginApprovalResolutions.ALLOW_ONCE ||
      decision === PluginApprovalResolutions.ALLOW_ALWAYS ||
      decision === PluginApprovalResolutions.DENY) &&
    allowedDecisions.includes(decision)
  )
    return decision;
  return PluginApprovalResolutions.TIMEOUT;
}
function buildPluginApprovalFailureReason(params) {
  const turnSourceChannel = params.ctx?.turnSourceChannel;
  if (!turnSourceChannel?.trim()) return params.fallbackReason;
  const nativePluginSurface = resolveApprovalInitiatingSurfaceState({
    channel: turnSourceChannel,
    accountId: params.ctx?.turnSourceAccountId,
    cfg: params.ctx?.config,
    approvalKind: "plugin",
  });
  const setupText = describeNativePluginApprovalClientSetup({
    channel: nativePluginSurface.channel,
    channelLabel: nativePluginSurface.channelLabel,
    accountId: nativePluginSurface.accountId,
  });
  if (!setupText) return params.fallbackReason;
  if (
    (nativePluginSurface.kind === "disabled"
      ? nativePluginSurface
      : resolveApprovalInitiatingSurfaceState({
          channel: turnSourceChannel,
          accountId: params.ctx?.turnSourceAccountId,
          cfg: params.ctx?.config,
          approvalKind: "exec",
        })
    ).kind !== "disabled"
  )
    return params.fallbackReason;
  return `${params.fallbackReason}\n\n${setupText}`;
}
async function requestPluginToolApproval(params) {
  const approval = params.approval;
  const timeoutMs = resolvePluginToolApprovalTimeoutMs(approval);
  const gatewayTimeoutMs = resolvePluginToolApprovalGatewayTimeoutMs(timeoutMs);
  const allowedDecisions = resolveCanonicalPluginApprovalRequestAllowedDecisions(approval);
  let gatewayApprovalPhase = "none";
  try {
    const embeddedApprovalBroker = isEmbeddedMode() ? getEmbeddedPluginApprovalBroker() : null;
    if (embeddedApprovalBroker) {
      const decision = (
        await embeddedApprovalBroker.request({
          request: {
            pluginId: approval.pluginId,
            title: approval.title,
            description: approval.description,
            severity: approval.severity,
            allowedDecisions: approval.allowedDecisions,
            toolName: params.toolName,
            toolCallId: params.toolCallId,
            agentId: params.ctx?.agentId,
            sessionKey: params.ctx?.sessionKey,
            turnSourceChannel: params.ctx?.turnSourceChannel,
            turnSourceTo: params.ctx?.turnSourceTo,
            turnSourceAccountId: params.ctx?.turnSourceAccountId,
            turnSourceThreadId: params.ctx?.turnSourceThreadId,
          },
          timeoutMs,
          signal: params.signal,
        })
      ).decision;
      const resolution = resolvePermittedPluginApprovalResolution(decision, allowedDecisions);
      notifyPluginApprovalResolution(approval, resolution);
      if (
        resolution === PluginApprovalResolutions.ALLOW_ONCE ||
        resolution === PluginApprovalResolutions.ALLOW_ALWAYS
      )
        return {
          blocked: false,
          params: mergeParamsWithApprovalOverrides(params.baseParams, params.overrideParams),
          approvalResolution: resolution,
        };
      if (resolution === PluginApprovalResolutions.DENY)
        return {
          blocked: true,
          kind: "failure",
          disposition: "blocked",
          deniedReason: "plugin-approval",
          reason: "Denied by user",
          params: params.baseParams,
        };
      return approval.timeoutReason
        ? {
            blocked: true,
            kind: "veto",
            deniedReason: "plugin-approval",
            reason: approval.timeoutReason,
            params: params.baseParams,
          }
        : {
            blocked: true,
            kind: "failure",
            disposition: "timed_out",
            deniedReason: "plugin-approval",
            reason: "Approval timed out",
            params: params.baseParams,
          };
    }
    gatewayApprovalPhase = "request";
    const requestResult = await callGatewayTool(
      "plugin.approval.request",
      { timeoutMs: gatewayTimeoutMs },
      {
        pluginId: approval.pluginId,
        title: approval.title,
        description: approval.description,
        severity: approval.severity,
        allowedDecisions: approval.allowedDecisions,
        toolName: params.toolName,
        toolCallId: params.toolCallId,
        agentId: params.ctx?.agentId,
        sessionKey: params.ctx?.sessionKey,
        ...(params.ctx?.approvalReviewerDeviceId
          ? { approvalReviewerDeviceIds: [params.ctx.approvalReviewerDeviceId] }
          : {}),
        turnSourceChannel: params.ctx?.turnSourceChannel,
        turnSourceTo: params.ctx?.turnSourceTo,
        turnSourceAccountId: params.ctx?.turnSourceAccountId,
        turnSourceThreadId: params.ctx?.turnSourceThreadId,
        timeoutMs,
        twoPhase: true,
      },
      { expectFinal: false },
    );
    gatewayApprovalPhase = "none";
    const id = requestResult?.id;
    if (!id) {
      notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
      return {
        blocked: true,
        kind: "failure",
        disposition: "failed",
        deniedReason: "plugin-approval",
        reason: approval.description || "Plugin approval request failed",
        params: params.baseParams,
      };
    }
    const hasImmediateDecision = Object.hasOwn(requestResult ?? {}, "decision");
    let decision;
    if (hasImmediateDecision) {
      decision = requestResult?.decision;
      if (decision === null) {
        notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
        return {
          blocked: true,
          kind: "failure",
          disposition: "failed",
          deniedReason: "plugin-approval",
          reason: buildPluginApprovalFailureReason({
            fallbackReason: "Plugin approval unavailable (no approval route)",
            ctx: params.ctx,
          }),
          params: params.baseParams,
        };
      }
    } else {
      gatewayApprovalPhase = "wait";
      const waitPromise = callGatewayTool(
        "plugin.approval.waitDecision",
        { timeoutMs: gatewayTimeoutMs },
        { id },
      );
      let waitResult;
      if (params.signal) {
        let onAbort;
        const abortPromise = new Promise((_, reject) => {
          if (params.signal.aborted) {
            reject(toLintErrorObject(params.signal.reason, "Non-Error rejection"));
            return;
          }
          onAbort = () => reject(toLintErrorObject(params.signal.reason, "Non-Error rejection"));
          params.signal.addEventListener("abort", onAbort, { once: true });
        });
        try {
          waitResult = await Promise.race([waitPromise, abortPromise]);
        } finally {
          if (onAbort) params.signal.removeEventListener("abort", onAbort);
        }
      } else waitResult = await waitPromise;
      decision = waitResult?.id === id ? waitResult.decision : void 0;
    }
    const resolution = resolvePermittedPluginApprovalResolution(decision, allowedDecisions);
    notifyPluginApprovalResolution(approval, resolution);
    if (
      resolution === PluginApprovalResolutions.ALLOW_ONCE ||
      resolution === PluginApprovalResolutions.ALLOW_ALWAYS
    )
      return {
        blocked: false,
        params: mergeParamsWithApprovalOverrides(params.baseParams, params.overrideParams),
        approvalResolution: resolution,
      };
    if (resolution === PluginApprovalResolutions.DENY)
      return {
        blocked: true,
        kind: "failure",
        disposition: "blocked",
        deniedReason: "plugin-approval",
        reason: "Denied by user",
        params: params.baseParams,
      };
    const fallbackTimeoutReason = approval.timeoutReason ?? "Approval timed out";
    const timeoutReason =
      requestResult?.deliveryRoute === "turn-source"
        ? buildPluginApprovalFailureReason({
            fallbackReason: fallbackTimeoutReason,
            ctx: params.ctx,
          })
        : fallbackTimeoutReason;
    return {
      blocked: true,
      kind: approval.timeoutReason ? "veto" : "failure",
      disposition: "timed_out",
      deniedReason: "plugin-approval",
      reason: timeoutReason,
      params: params.baseParams,
    };
  } catch (err) {
    notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
    const signal = params.signal;
    if (
      signal?.aborted === true &&
      (err === signal.reason ||
        (err instanceof Error &&
          (err.name === "AbortError" || ("cause" in err && err.cause === signal.reason))))
    ) {
      log.warn(`plugin approval wait cancelled by run abort: ${String(err)}`);
      return {
        blocked: true,
        kind: "failure",
        disposition: resolveToolErrorDiagnostic(err, signal).terminalReason,
        deniedReason: "plugin-approval",
        reason: "Approval cancelled (run aborted)",
        params: params.baseParams,
      };
    }
    const invalidRequest =
      err instanceof GatewayClientRequestError && err.gatewayCode === "INVALID_REQUEST";
    const reason =
      invalidRequest && gatewayApprovalPhase === "request"
        ? `Plugin approval request rejected: ${formatErrorMessage(err)}`
        : invalidRequest && gatewayApprovalPhase === "wait"
          ? `Plugin approval no longer available: ${formatErrorMessage(err)}`
          : "Plugin approval required (gateway unavailable)";
    log.warn(`plugin approval gateway request failed; blocking tool call: ${String(err)}`);
    return {
      blocked: true,
      kind: "failure",
      disposition: resolveToolErrorDiagnostic(err, signal).terminalReason,
      deniedReason: "plugin-approval",
      reason,
      params: params.baseParams,
    };
  }
}
/** Resolve a deferred plugin approval request at the later execution boundary. */
async function requestDeferredPluginToolApproval(params) {
  const deferred = params.deferredApproval;
  return requestPluginToolApproval({
    approval: deferred.approval,
    toolName: deferred.toolName,
    ...(deferred.toolCallId ? { toolCallId: deferred.toolCallId } : {}),
    ...(deferred.ctx ? { ctx: deferred.ctx } : {}),
    signal: params.signal,
    baseParams: deferred.baseParams,
    overrideParams: deferred.overrideParams,
  });
}
/** Notify plugin approval callbacks that a deferred approval was cancelled. */
function cancelDeferredPluginToolApproval(deferredApproval) {
  notifyPluginApprovalResolution(deferredApproval.approval, PluginApprovalResolutions.CANCELLED);
}
async function resolveBeforeToolCallApprovalOutcome(params) {
  const approval = params.result?.requireApproval;
  if (!approval) return;
  warnDeprecatedApprovalTimeoutBehavior(approval);
  if (params.approvalMode === "defer")
    return {
      blocked: false,
      params: params.baseParams,
      deferredApproval: {
        approval,
        toolName: params.toolName,
        ...(params.toolCallId ? { toolCallId: params.toolCallId } : {}),
        ...(params.ctx ? { ctx: params.ctx } : {}),
        baseParams: params.baseParams,
        overrideParams: params.result?.params,
      },
    };
  if (params.approvalMode === "report") {
    notifyPluginApprovalResolution(approval, PluginApprovalResolutions.CANCELLED);
    return {
      blocked: true,
      kind: "failure",
      disposition: "blocked",
      deniedReason: "plugin-approval",
      reason: approval.description || approval.title || "Plugin approval required",
      params: params.baseParams,
    };
  }
  return await requestPluginToolApproval({
    approval,
    toolName: params.toolName,
    ...(params.toolCallId ? { toolCallId: params.toolCallId } : {}),
    ...(params.ctx ? { ctx: params.ctx } : {}),
    signal: params.signal,
    baseParams: params.baseParams,
    overrideParams: params.result?.params,
  });
}
async function resolveSkillWorkshopApprovalForFinalParams(params) {
  return await resolveBeforeToolCallApprovalOutcome({
    result: await resolveSkillWorkshopToolApproval({
      toolName: params.toolName,
      toolParams: isPlainObject(params.params) ? params.params : {},
      ...(params.ctx?.config ? { config: params.ctx.config } : {}),
      ...(params.ctx?.workspaceDir ? { workspaceDir: params.ctx.workspaceDir } : {}),
    }),
    approvalMode: params.approvalMode,
    toolName: params.toolName,
    ...(params.toolCallId ? { toolCallId: params.toolCallId } : {}),
    ...(params.ctx ? { ctx: params.ctx } : {}),
    signal: params.signal,
    baseParams: params.params,
  });
}
/** Build the standard terminal result for vetoed tool calls. */
function buildBlockedToolResult(params) {
  recordPreExecutionBlockedToolCall(params.toolCallId, params.runId);
  return {
    content: [
      {
        type: "text",
        text: params.reason,
      },
    ],
    details: {
      status: "blocked",
      deniedReason: params.deniedReason ?? "plugin-before-tool-call",
      reason: params.reason,
    },
  };
}
function buildToolContentPrivateData(policy, args) {
  if (!policy.toolInputs && !policy.toolOutputs) return;
  const toolContent = {};
  if (policy.toolInputs) toolContent.toolInput = cloneDiagnosticContentValue(args.input);
  if (args.includeOutput && policy.toolOutputs)
    toolContent.toolOutput = cloneDiagnosticContentValue(args.output);
  return Object.keys(toolContent).length > 0 ? { toolContent } : void 0;
}
function summarizeToolParams(params) {
  if (params === null) return { kind: "null" };
  if (params === void 0) return { kind: "undefined" };
  if (Array.isArray(params))
    return {
      kind: "array",
      length: params.length,
    };
  if (typeof params === "object") return { kind: "object" };
  if (typeof params === "string")
    return {
      kind: "string",
      length: params.length,
    };
  if (typeof params === "number") return { kind: "number" };
  if (typeof params === "boolean") return { kind: "boolean" };
  return { kind: "other" };
}
function shouldEmitLoopWarning(state, warningKey, count) {
  if (!state.toolLoopWarningBuckets) state.toolLoopWarningBuckets = /* @__PURE__ */ new Map();
  const bucket = Math.floor(count / LOOP_WARNING_BUCKET_SIZE);
  if (bucket <= (state.toolLoopWarningBuckets.get(warningKey) ?? 0)) return false;
  state.toolLoopWarningBuckets.set(warningKey, bucket);
  if (state.toolLoopWarningBuckets.size > MAX_LOOP_WARNING_KEYS) {
    const oldest = state.toolLoopWarningBuckets.keys().next().value;
    if (oldest) state.toolLoopWarningBuckets.delete(oldest);
  }
  return true;
}
async function recordLoopOutcome(args) {
  if (!args.ctx?.sessionKey && !args.ctx?.sessionId) return;
  let recordedOutcome;
  try {
    const { getDiagnosticSessionState, recordToolCallOutcome } = await loadBeforeToolCallRuntime();
    const record = recordToolCallOutcome(
      getDiagnosticSessionState({
        sessionKey: args.ctx.sessionKey,
        sessionId: args.ctx.sessionId,
      }),
      {
        toolName: args.toolName,
        toolParams: args.toolParams,
        toolCallId: args.toolCallId,
        result: args.result,
        error: args.error,
        config: args.ctx.loopDetection,
        ...(args.ctx.runId && { runId: args.ctx.runId }),
      },
    );
    if (record?.resultHash && args.ctx.onToolOutcome)
      recordedOutcome = {
        toolName: record.toolName,
        argsHash: record.argsHash,
        resultHash: record.resultHash,
        ...(args.toolCallOrdinal !== void 0 ? { toolCallOrdinal: args.toolCallOrdinal } : {}),
        ...(args.terminalPresentation ? { terminalPresentation: args.terminalPresentation } : {}),
      };
  } catch (err) {
    log.warn(`tool loop outcome tracking failed: tool=${args.toolName} error=${String(err)}`);
  }
  if (recordedOutcome) args.ctx.onToolOutcome?.(recordedOutcome);
}
/** Run the full before_tool_call policy chain for a pending tool call. */
async function runBeforeToolCallHook(args) {
  const toolName = normalizeToolName(args.toolName || "tool");
  const params = args.params;
  try {
    if (args.ctx?.sessionKey) {
      const { getDiagnosticSessionState, logToolLoopAction, detectToolCallLoop, recordToolCall } =
        await loadBeforeToolCallRuntime();
      const sessionState = getDiagnosticSessionState({
        sessionKey: args.ctx.sessionKey,
        sessionId: args.ctx.sessionId,
      });
      const loopScope = args.ctx.runId ? { runId: args.ctx.runId } : void 0;
      const loopResult = detectToolCallLoop(
        sessionState,
        toolName,
        params,
        args.ctx.loopDetection,
        loopScope,
      );
      if (loopResult.stuck) {
        if (loopResult.level === "critical") {
          log.error(`Blocking ${toolName} due to critical loop: ${loopResult.message}`);
          logToolLoopAction({
            sessionKey: args.ctx.sessionKey,
            sessionId: args.ctx.sessionId,
            toolName,
            level: "critical",
            action: "block",
            detector: loopResult.detector,
            count: loopResult.count,
            message: loopResult.message,
            pairedToolName: loopResult.pairedToolName,
          });
          return {
            blocked: true,
            kind: "veto",
            deniedReason: "tool-loop",
            reason: loopResult.message,
            params,
          };
        }
        const baseWarningKey = loopResult.warningKey ?? `${loopResult.detector}:${toolName}`;
        if (
          shouldEmitLoopWarning(
            sessionState,
            args.ctx.runId ? `${args.ctx.runId}:${baseWarningKey}` : baseWarningKey,
            loopResult.count,
          )
        ) {
          log.warn(`Loop warning for ${toolName}: ${loopResult.message}`);
          logToolLoopAction({
            sessionKey: args.ctx.sessionKey,
            sessionId: args.ctx.sessionId,
            toolName,
            level: "warning",
            action: "warn",
            detector: loopResult.detector,
            count: loopResult.count,
            message: loopResult.message,
            pairedToolName: loopResult.pairedToolName,
          });
        }
      }
      if (args.ctx.loopDetection?.enabled !== false)
        recordToolCall(
          sessionState,
          toolName,
          params,
          args.toolCallId,
          args.ctx.loopDetection,
          loopScope,
        );
    }
    const hookRunner = getGlobalHookRunner();
    const hasBeforeToolCallHooks = hookRunner?.hasHooks("before_tool_call") === true;
    const policyRegistry = getGlobalHookRunnerRegistry() ?? void 0;
    const shouldRunTrustedPolicies = hasTrustedToolPolicies(policyRegistry);
    const normalizedParams = isPlainObject(params) ? params : {};
    if (
      !(await resolveSkillWorkshopToolApproval({
        toolName,
        toolParams: normalizedParams,
        ...(args.ctx?.config ? { config: args.ctx.config } : {}),
        ...(args.ctx?.workspaceDir ? { workspaceDir: args.ctx.workspaceDir } : {}),
      })) &&
      !shouldRunTrustedPolicies &&
      !hasBeforeToolCallHooks
    )
      return {
        blocked: false,
        params,
      };
    const deriveOptions =
      args.ctx?.cwd || args.ctx?.sandbox
        ? {
            ...(args.ctx.cwd ? { cwd: args.ctx.cwd } : {}),
            ...(args.ctx.sandbox ? { sandbox: args.ctx.sandbox } : {}),
          }
        : void 0;
    const derivedToolParams = deriveToolParams(toolName, normalizedParams, deriveOptions);
    const deriveToolEventParams = (candidateParams) => {
      const derived = deriveToolParams(toolName, candidateParams, deriveOptions);
      return derived.derivedPaths ? { derivedPaths: derived.derivedPaths } : {};
    };
    const toolIdentity = {
      ...(args.toolKind && { toolKind: args.toolKind }),
      ...(args.toolInputKind && { toolInputKind: args.toolInputKind }),
    };
    const buildToolContext = (identity) => ({
      toolName,
      ...identity,
      ...(args.ctx?.agentId && { agentId: args.ctx.agentId }),
      ...(args.ctx?.sessionKey && { sessionKey: args.ctx.sessionKey }),
      ...(args.ctx?.sessionId && { sessionId: args.ctx.sessionId }),
      ...(args.ctx?.runId && { runId: args.ctx.runId }),
      ...(args.ctx?.trace && { trace: freezeDiagnosticTraceContext(args.ctx.trace) }),
      ...(args.toolCallId && { toolCallId: args.toolCallId }),
      ...(args.ctx?.channelId && { channelId: args.ctx.channelId }),
    });
    const toolContext = buildToolContext(toolIdentity);
    const trustedPolicyResult = shouldRunTrustedPolicies
      ? await runTrustedToolPolicies(
          {
            toolName,
            params: normalizedParams,
            ...toolIdentity,
            ...(args.ctx?.runId && { runId: args.ctx.runId }),
            ...(args.toolCallId && { toolCallId: args.toolCallId }),
            ...(derivedToolParams.derivedPaths
              ? { derivedPaths: derivedToolParams.derivedPaths }
              : {}),
          },
          toolContext,
          {
            ...(policyRegistry ? { registry: policyRegistry } : {}),
            ...(args.ctx?.config ? { config: args.ctx.config } : {}),
            deriveEvent: deriveToolEventParams,
            normalizeEvent(eventValue) {
              const normalizedEventParams = normalizeCodeModeExecBeforeHookParamsForToolKind({
                toolKind: eventValue.toolKind,
                params: eventValue.params,
              });
              if (!isPlainObject(normalizedEventParams)) return;
              const normalizedEventIdentity = getCodeModeExecBeforeHookMetadataForToolKind({
                toolKind: eventValue.toolKind,
                params: normalizedEventParams,
              });
              return {
                params: normalizedEventParams,
                ...(normalizedEventIdentity
                  ? {
                      event: normalizedEventIdentity,
                      ctx: normalizedEventIdentity,
                    }
                  : {}),
              };
            },
          },
        )
      : void 0;
    if (trustedPolicyResult?.block)
      return {
        blocked: true,
        kind: "veto",
        deniedReason: "plugin-before-tool-call",
        reason: trustedPolicyResult.blockReason || "Tool call blocked by trusted plugin policy",
        params,
      };
    let trustedApprovalParams;
    let trustedApprovalResolution;
    if (trustedPolicyResult?.requireApproval) {
      const approvalOutcome = await resolveBeforeToolCallApprovalOutcome({
        result: trustedPolicyResult,
        approvalMode: args.approvalMode,
        toolName,
        ...(args.toolCallId ? { toolCallId: args.toolCallId } : {}),
        ...(args.ctx ? { ctx: args.ctx } : {}),
        signal: args.signal,
        baseParams: params,
      });
      if (approvalOutcome) {
        if (approvalOutcome.blocked) return approvalOutcome;
        if (approvalOutcome.deferredApproval) return approvalOutcome;
        trustedApprovalParams = approvalOutcome.params;
        trustedApprovalResolution = approvalOutcome.approvalResolution;
      }
    }
    const rawPolicyAdjustedParams = trustedApprovalParams ?? trustedPolicyResult?.params ?? params;
    const policyAdjustedParams = normalizeCodeModeExecBeforeHookParamsForToolKind({
      toolKind: args.toolKind,
      params: rawPolicyAdjustedParams,
    });
    const policyAdjustedToolIdentity =
      getCodeModeExecBeforeHookMetadataForToolKind({
        toolKind: args.toolKind,
        params: policyAdjustedParams,
      }) ?? toolIdentity;
    const policyAdjustedToolContext = buildToolContext(policyAdjustedToolIdentity);
    const policyAdjustedDerivedToolParams =
      trustedPolicyResult?.params && isPlainObject(policyAdjustedParams)
        ? deriveToolParams(toolName, policyAdjustedParams, deriveOptions)
        : derivedToolParams;
    if (!hasBeforeToolCallHooks) {
      const finalApprovalOutcome = await resolveSkillWorkshopApprovalForFinalParams({
        toolName,
        params: policyAdjustedParams,
        approvalMode: args.approvalMode,
        ...(args.toolCallId ? { toolCallId: args.toolCallId } : {}),
        ...(args.ctx ? { ctx: args.ctx } : {}),
        signal: args.signal,
      });
      if (finalApprovalOutcome) return finalApprovalOutcome;
      const allowed = {
        blocked: false,
        params: policyAdjustedParams,
      };
      if (trustedApprovalResolution) allowed.approvalResolution = trustedApprovalResolution;
      return allowed;
    }
    const hookEventParams = isPlainObject(policyAdjustedParams) ? policyAdjustedParams : {};
    const hookResult = await hookRunner.runBeforeToolCall(
      {
        toolName,
        params: hookEventParams,
        ...policyAdjustedToolIdentity,
        ...(args.ctx?.runId && { runId: args.ctx.runId }),
        ...(args.toolCallId && { toolCallId: args.toolCallId }),
        ...(policyAdjustedDerivedToolParams.derivedPaths
          ? { derivedPaths: policyAdjustedDerivedToolParams.derivedPaths }
          : {}),
      },
      policyAdjustedToolContext,
    );
    if (hookResult?.block)
      return {
        blocked: true,
        kind: "veto",
        deniedReason: "plugin-before-tool-call",
        reason: hookResult.blockReason || "Tool call blocked by plugin hook",
        params: policyAdjustedParams,
      };
    let finalParams = policyAdjustedParams;
    let finalApprovalResolution = trustedApprovalResolution;
    if (hookResult?.requireApproval) {
      const approvalOutcome = await resolveBeforeToolCallApprovalOutcome({
        result: hookResult,
        approvalMode: args.approvalMode,
        toolName,
        ...(args.toolCallId ? { toolCallId: args.toolCallId } : {}),
        ...(args.ctx ? { ctx: args.ctx } : {}),
        signal: args.signal,
        baseParams: policyAdjustedParams,
      });
      if (approvalOutcome) {
        if (approvalOutcome.blocked) return approvalOutcome;
        if (approvalOutcome.deferredApproval) return approvalOutcome;
        finalParams = approvalOutcome.params;
        finalApprovalResolution = approvalOutcome.approvalResolution ?? finalApprovalResolution;
      }
    }
    if (hookResult?.params)
      finalParams = mergeParamsWithApprovalOverrides(finalParams, hookResult.params);
    const finalApprovalOutcome = await resolveSkillWorkshopApprovalForFinalParams({
      toolName,
      params: finalParams,
      approvalMode: args.approvalMode,
      ...(args.toolCallId ? { toolCallId: args.toolCallId } : {}),
      ...(args.ctx ? { ctx: args.ctx } : {}),
      signal: args.signal,
    });
    if (finalApprovalOutcome) return finalApprovalOutcome;
    const allowed = {
      blocked: false,
      params: finalParams,
    };
    if (finalApprovalResolution) allowed.approvalResolution = finalApprovalResolution;
    return allowed;
  } catch (err) {
    const toolCallId = args.toolCallId ? ` toolCallId=${args.toolCallId}` : "";
    const cause = unwrapErrorCause(err);
    log.error(`before_tool_call hook failed: tool=${toolName}${toolCallId} error=${String(cause)}`);
    return {
      blocked: true,
      kind: "failure",
      deniedReason: "plugin-before-tool-call",
      disposition: resolveToolErrorDiagnostic(cause, args.signal).terminalReason,
      reason: BEFORE_TOOL_CALL_HOOK_FAILURE_REASON,
      params,
    };
  }
}
/** Wrap a tool execute function with before_tool_call hooks and diagnostics. */
function wrapToolWithBeforeToolCallHook(tool, ctx, options = {}) {
  const execute = tool.execute;
  if (!execute) return tool;
  const toolName = tool.name || "tool";
  const diagnosticIdentity = resolveToolDiagnosticIdentity(tool);
  const hookOptions = {
    ...(options.approvalMode ? { approvalMode: options.approvalMode } : {}),
    emitDiagnostics: options.emitDiagnostics !== false,
  };
  const toolContentPolicy = resolveDiagnosticModelContentCapturePolicy(ctx?.config);
  const wrappedTool = {
    ...tool,
    execute: async (toolCallId, params, signal, onUpdate) => {
      const toolCallOrdinal = ctx?.allocateToolOutcomeOrdinal?.(toolCallId);
      const preExecutionStartedAt = Date.now();
      const normalizedToolName = normalizeToolName(toolName || "tool");
      const trace =
        hookOptions.emitDiagnostics && ctx?.trace
          ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(ctx.trace))
          : void 0;
      const buildEventBase = (toolParams) => ({
        ...(ctx?.runId && { runId: ctx.runId }),
        ...(ctx?.sessionKey && { sessionKey: ctx.sessionKey }),
        ...(ctx?.sessionId && { sessionId: ctx.sessionId }),
        ...(ctx?.agentId && { agentId: ctx.agentId }),
        ...(trace && { trace }),
        toolName: normalizedToolName,
        ...diagnosticIdentity,
        ...(toolCallId && { toolCallId }),
        paramsSummary: summarizeToolParams(toolParams),
      });
      const recordPreExecutionError = (error, toolParams, errorCategory) => {
        recordPreExecutionBlockedToolCall(toolCallId, ctx?.runId);
        if (!hookOptions.emitDiagnostics) return;
        emitTrustedDiagnosticEvent({
          type: "tool.execution.error",
          ...buildEventBase(toolParams),
          durationMs: Date.now() - preExecutionStartedAt,
          ...resolveToolErrorDiagnostic(error, signal, errorCategory),
        });
      };
      const recordPreExecutionDisposition = (
        toolParams,
        disposition,
        errorCategory,
        deniedReason,
      ) => {
        recordPreExecutionBlockedToolCall(toolCallId, ctx?.runId);
        if (!hookOptions.emitDiagnostics) return;
        const eventBase = buildEventBase(toolParams);
        if (disposition === "blocked") {
          const reason = deniedReason ?? "plugin-before-tool-call";
          emitTrustedDiagnosticEvent({
            type: "tool.execution.blocked",
            ...eventBase,
            deniedReason: reason,
            reason,
          });
          return;
        }
        emitTrustedDiagnosticEvent({
          type: "tool.execution.error",
          ...eventBase,
          durationMs: Date.now() - preExecutionStartedAt,
          errorCategory: disposition === "cancelled" ? "aborted" : errorCategory,
          terminalReason: disposition,
        });
      };
      const prepare = tool.prepareBeforeToolCallParams;
      let preparedParams;
      try {
        preparedParams = prepare
          ? await prepare(params, {
              ...(toolCallId ? { toolCallId } : {}),
              ...(ctx ? { hookContext: ctx } : {}),
              ...(signal ? { signal } : {}),
            })
          : params;
      } catch (error) {
        recordPreExecutionError(error, params, "tool_preparation");
        throw tagBeforeToolCallFailure(error, signal);
      }
      const hookParams = normalizeCodeModeExecBeforeHookParams({
        tool,
        params: preparedParams,
      });
      const hookMetadata = getCodeModeExecBeforeHookMetadata({
        tool,
        params: preparedParams,
      });
      let outcome;
      try {
        outcome = await runBeforeToolCallHook({
          toolName,
          params: hookParams,
          ...hookMetadata,
          toolCallId,
          ctx,
          signal,
          approvalMode: hookOptions.approvalMode,
        });
      } catch (error) {
        recordPreExecutionError(error, hookParams, "before_tool_call");
        throw tagBeforeToolCallFailure(error, signal);
      }
      if (outcome.blocked) {
        if (outcome.kind !== "veto") {
          recordPreExecutionDisposition(
            outcome.params ?? hookParams,
            outcome.disposition,
            outcome.deniedReason === "plugin-approval" ? "plugin_approval" : "before_tool_call",
            outcome.deniedReason,
          );
          throw new BeforeToolCallFailureError(outcome.reason, outcome.disposition);
        }
        const eventBase = buildEventBase(outcome.params ?? hookParams);
        if (hookOptions.emitDiagnostics) {
          emitTrustedDiagnosticEvent({
            type: "tool.execution.blocked",
            ...eventBase,
            reason: outcome.reason,
            deniedReason: outcome.deniedReason ?? "plugin-before-tool-call",
          });
          emitToolBlockedSecurityEvent({
            ctx,
            deniedReason: outcome.deniedReason ?? "plugin-before-tool-call",
            toolIdentity: diagnosticIdentity,
            toolName: normalizedToolName,
            trace,
            paramsSummary: eventBase.paramsSummary,
          });
        }
        const blockedResult = buildBlockedToolResult({
          reason: outcome.reason,
          deniedReason: outcome.deniedReason ?? "plugin-before-tool-call",
          toolCallId,
          runId: ctx?.runId,
        });
        await recordLoopOutcome({
          ctx,
          toolName: normalizedToolName,
          toolParams: outcome.params ?? hookParams,
          toolCallId,
          result: blockedResult,
          toolCallOrdinal,
        });
        return blockedResult;
      }
      let executeParams;
      try {
        executeParams = reconcileCodeModeExecBeforeHookParams({
          tool,
          originalParams: preparedParams,
          hookParams,
          adjustedParams: outcome.params,
        });
        executeParams =
          tool.finalizeBeforeToolCallParams?.(executeParams, preparedParams) ?? executeParams;
      } catch (error) {
        recordPreExecutionError(error, outcome.params ?? hookParams, "tool_preparation");
        throw tagBeforeToolCallFailure(error, signal);
      }
      recordAdjustedParamsForToolCall(toolCallId, executeParams, ctx?.runId);
      const eventBase = buildEventBase(executeParams);
      if (hookOptions.emitDiagnostics)
        emitTrustedDiagnosticEvent({
          type: "tool.execution.started",
          ...eventBase,
        });
      const startedAt = Date.now();
      try {
        const result = await execute(toolCallId, executeParams, signal, onUpdate);
        const durationMs = Date.now() - startedAt;
        const terminalPresentation = resolveToolTerminalPresentation({
          tool,
          toolParams: executeParams,
          result,
        });
        await recordLoopOutcome({
          ctx,
          toolName: normalizedToolName,
          toolParams: executeParams,
          toolCallId,
          result,
          toolCallOrdinal,
          terminalPresentation,
        });
        rememberPendingTerminalPresentation({
          ctx,
          tool,
          toolParams: executeParams,
          toolCallId,
          toolCallOrdinal,
        });
        const skillMatch = findSkillUsageMatch({
          toolName: normalizedToolName,
          toolParams: executeParams,
          ctx,
        });
        if (hookOptions.emitDiagnostics) {
          if (skillMatch)
            emitSkillUsedDiagnostic({
              ctx,
              match: skillMatch,
              toolName: normalizedToolName,
              toolCallId,
            });
          const terminalEvent = resolveToolResultTerminalDiagnostic(result, durationMs);
          emitTrustedDiagnosticEventWithPrivateData(
            {
              ...eventBase,
              ...terminalEvent,
            },
            buildToolContentPrivateData(toolContentPolicy, {
              input: executeParams,
              output: result,
              includeOutput: true,
            }),
          );
        }
        return result;
      } catch (err) {
        if (hookOptions.emitDiagnostics)
          emitTrustedDiagnosticEventWithPrivateData(
            {
              type: "tool.execution.error",
              ...eventBase,
              durationMs: Date.now() - startedAt,
              ...resolveToolErrorDiagnostic(err, signal),
            },
            buildToolContentPrivateData(toolContentPolicy, {
              input: executeParams,
              includeOutput: false,
            }),
          );
        await recordLoopOutcome({
          ctx,
          toolName: normalizedToolName,
          toolParams: executeParams,
          toolCallId,
          error: err,
          toolCallOrdinal,
        });
        throw err;
      }
    },
  };
  copyPluginToolMeta(tool, wrappedTool);
  copyChannelAgentToolMeta(tool, wrappedTool);
  copyToolTerminalPresentation(tool, wrappedTool);
  Object.defineProperty(wrappedTool, BEFORE_TOOL_CALL_WRAPPED, {
    value: true,
    enumerable: true,
  });
  Object.defineProperty(wrappedTool, BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS, {
    value: hookOptions,
    enumerable: false,
  });
  Object.defineProperty(wrappedTool, BEFORE_TOOL_CALL_SOURCE_TOOL, {
    value: tool,
    enumerable: false,
  });
  Object.defineProperty(wrappedTool, BEFORE_TOOL_CALL_HOOK_CONTEXT, {
    value: ctx,
    enumerable: false,
  });
  return wrappedTool;
}
/** Rebuild a before_tool_call wrapper while preserving the original source tool. */
function rewrapToolWithBeforeToolCallHook(tool, ctx, options = {}) {
  const taggedTool = tool;
  const source = taggedTool[BEFORE_TOOL_CALL_SOURCE_TOOL];
  const wrappedContext = taggedTool[BEFORE_TOOL_CALL_HOOK_CONTEXT];
  const preservedContext =
    wrappedContext && typeof wrappedContext === "object" ? wrappedContext : void 0;
  const sourceTool = source && typeof source === "object" ? source : tool;
  if (sourceTool === tool)
    return wrapToolWithBeforeToolCallHook(tool, ctx ?? preservedContext, options);
  const rewrapSource = {
    ...tool,
    execute: sourceTool.execute,
  };
  delete rewrapSource[BEFORE_TOOL_CALL_WRAPPED];
  copyPluginToolMeta(tool, rewrapSource);
  copyChannelAgentToolMeta(tool, rewrapSource);
  copyToolTerminalPresentation(tool, rewrapSource);
  return wrapToolWithBeforeToolCallHook(rewrapSource, ctx ?? preservedContext, options);
}
function recordPreExecutionBlockedToolCall(toolCallId, runId) {
  if (!toolCallId) return;
  preExecutionBlockedToolCallIds.add(
    buildAdjustedParamsKey({
      runId,
      toolCallId,
    }),
  );
  while (preExecutionBlockedToolCallIds.size > MAX_TRACKED_ADJUSTED_PARAMS) {
    const oldest = preExecutionBlockedToolCallIds.values().next().value;
    if (!oldest) break;
    preExecutionBlockedToolCallIds.delete(oldest);
  }
}
function toLintErrorObject(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value, { cause: value });
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
export {
  setEmbeddedMode as S,
  peekAdjustedParamsForToolCall as _,
  getBeforeToolCallPolicyDiagnosticState as a,
  setEmbeddedPluginApprovalBroker as b,
  recordAdjustedParamsForToolCall as c,
  rewrapToolWithBeforeToolCallHook as d,
  runBeforeToolCallHook as f,
  consumeStructuredReplaySafeToolCall as g,
  consumePreExecutionBlockedToolCall as h,
  getBeforeToolCallFailureDisposition as i,
  recordStructuredReplayTrustForToolCall as l,
  consumeAdjustedParamsForToolCall as m,
  cancelDeferredPluginToolApproval as n,
  hasBeforeToolCallPolicy as o,
  wrapToolWithBeforeToolCallHook as p,
  finalizeToolTerminalPresentation as r,
  isBeforeToolCallBlockedError as s,
  buildBlockedToolResult as t,
  requestDeferredPluginToolApproval as u,
  EmbeddedPluginApprovalBroker as v,
  isEmbeddedMode as x,
  clearEmbeddedPluginApprovalBroker as y,
};
