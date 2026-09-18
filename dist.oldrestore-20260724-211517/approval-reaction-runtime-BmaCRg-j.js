import { t as formatApprovalDisplayPath } from "./approval-display-paths-DlQSsCnq.js";
import {
  r as buildPluginApprovalPendingReplyPayload,
  t as buildApprovalPendingReplyPayload,
} from "./approval-renderers-DA2dW1_1.js";
import { n as buildPendingApprovalView } from "./approval-view-model-C_rBVrVD.js";
import {
  o as buildExecApprovalPendingReplyPayload,
  p as formatExecApprovalExpiresIn,
} from "./exec-approval-reply-Djiq6tOJ.js";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.js";
import { t as sanitizeForPromptLiteral } from "./sanitize-for-prompt-Drdy09dw.js";
import "./approval-native-helpers-BZsvz7Nq.js";
//#region src/plugin-sdk/approval-reaction-runtime.ts
/**
 * @deprecated Compatibility subpath for shipped approval reaction helpers.
 * New plugin code should use the focused approval runtime/reply subpaths.
 */
/** Canonical reaction controls shown for approval prompts, in product display order. */
const APPROVAL_REACTION_BINDINGS = [
  {
    decision: "allow-once",
    emoji: "👍",
    label: "Allow Once",
  },
  {
    decision: "allow-always",
    emoji: "♾️",
    label: "Allow Always",
  },
  {
    decision: "deny",
    emoji: "👎",
    label: "Deny",
  },
];
const APPROVAL_REACTION_ORDER = APPROVAL_REACTION_BINDINGS.map((binding) => binding.decision);
const VARIATION_SELECTOR_RE = /[\uFE0E\uFE0F]/gu;
const FITZPATRICK_MODIFIER_RE = /[\u{1F3FB}-\u{1F3FF}]/gu;
function normalizeDecisionList(allowedDecisions) {
  const allowed = new Set(allowedDecisions);
  return APPROVAL_REACTION_ORDER.filter((decision) => allowed.has(decision));
}
/** List the canonical reaction bindings allowed for a specific approval request. */
function listApprovalReactionBindings(params) {
  const allowed = new Set(normalizeDecisionList(params.allowedDecisions));
  return APPROVAL_REACTION_BINDINGS.filter((binding) => allowed.has(binding.decision)).map(
    (binding) => ({
      decision: binding.decision,
      emoji: binding.emoji,
      label: binding.label,
    }),
  );
}
/** Build user-facing reaction instructions, or null when no reaction decisions are allowed. */
function buildApprovalReactionHint(params) {
  const bindings = listApprovalReactionBindings(params);
  if (bindings.length === 0) return null;
  return `React with:\n\n${bindings.map((binding) => `${binding.emoji} ${binding.label}`).join("\n")}`;
}
const APPROVAL_REACTION_HINT_PRESENT_RE = /(^|\n)React with:\s*(\n|$)/i;
/** True when approval prompt text already carries a reaction hint block. */
function hasApprovalReactionHintText(text) {
  return APPROVAL_REACTION_HINT_PRESENT_RE.test(text ?? "");
}
/** Inserts a reaction hint after the `ID: <id>` header line, else prepends it. */
function insertApprovalReactionHintNearIdHeader(params) {
  const lines = params.text.split(/\r?\n/);
  const idLineIndex = lines.findIndex((line) => /^ID:\s*\S+/.test(line.trim()));
  if (idLineIndex >= 0) {
    const before = lines.slice(0, idLineIndex + 1).join("\n");
    const after = lines
      .slice(idLineIndex + 1)
      .join("\n")
      .replace(/^\n+/, "");
    return after ? `${before}\n\n${params.hint}\n\n${after}` : `${before}\n\n${params.hint}`;
  }
  return `${params.hint}\n\n${params.text}`;
}
/** Adds the canonical reaction hint to approval prompt text unless one is present. */
function addApprovalReactionHintToText(params) {
  if (hasApprovalReactionHintText(params.text)) return params.text;
  const hint = buildApprovalReactionHint({ allowedDecisions: params.allowedDecisions });
  return hint
    ? insertApprovalReactionHintNearIdHeader({
        text: params.text,
        hint,
      })
    : params.text;
}
/** Normalize reaction emoji so skin-tone and text/presentation variants match canonical bindings. */
function normalizeApprovalReactionEmoji(reactionKey) {
  const normalized = reactionKey
    .trim()
    .replace(VARIATION_SELECTOR_RE, "")
    .replace(FITZPATRICK_MODIFIER_RE, "");
  if (normalized === "♾") return "♾️";
  return normalized;
}
/** Resolve a reaction key to an allowed approval decision. */
function resolveApprovalReactionDecision(params) {
  const normalizedEmoji = normalizeApprovalReactionEmoji(params.reactionKey);
  if (!normalizedEmoji) return null;
  for (const binding of listApprovalReactionBindings(params))
    if (binding.emoji === normalizedEmoji)
      return {
        decision: binding.decision,
        normalizedEmoji,
      };
  return null;
}
function resolveApprovalReactionTargetInternal(params) {
  const target = params.target;
  if (!target) return null;
  const decision = resolveApprovalReactionDecision({
    reactionKey: params.reactionKey,
    allowedDecisions: target.allowedDecisions,
  });
  if (!decision) return null;
  const approvalId = params.allowLegacyKindInference ? target.approvalId.trim() : target.approvalId;
  const approvalKind = target.approvalKind;
  if (!approvalId) return null;
  const resolvedKind =
    approvalKind === "exec" || approvalKind === "plugin"
      ? approvalKind
      : params.allowLegacyKindInference
        ? approvalId.startsWith("plugin:")
          ? "plugin"
          : "exec"
        : null;
  if (!resolvedKind) return null;
  return {
    approvalId,
    approvalKind: resolvedKind,
    decision: decision.decision,
    normalizedEmoji: decision.normalizedEmoji,
    ...(target.route === void 0 ? {} : { route: target.route }),
  };
}
/** Resolve an explicitly typed target without deriving ownership from its id. */
function resolveTypedApprovalReactionTarget(params) {
  return resolveApprovalReactionTargetInternal({
    ...params,
    allowLegacyKindInference: false,
  });
}
function formatSeverity(value) {
  return value === "critical" ? "Critical" : value === "info" ? "Info" : "Warning";
}
function buildDecisionText(allowedDecisions) {
  return allowedDecisions.join("|");
}
function buildManualInstructionSection(params) {
  const lines = [];
  if (!params.allowedDecisions.includes("allow-always"))
    lines.push(
      params.approvalKind === "exec"
        ? "Allow Always is unavailable for this command."
        : "Allow Always is unavailable because the effective policy requires approval every time.",
    );
  if (params.allowedDecisions.length > 0)
    lines.push(
      `Reply with: /approve ${params.approvalId} ${buildDecisionText(params.allowedDecisions)}`,
    );
  return lines;
}
function buildCommandActionInstructionSection(actions) {
  return actions.flatMap((action) =>
    action.command.trim() ? [`${action.label}: ${action.command}`] : [],
  );
}
function listDecisionActions(actions) {
  return normalizeDecisionList(
    actions.flatMap((action) => ("decision" in action && action.decision ? [action.decision] : [])),
  );
}
function buildApprovalReactionPromptText(params) {
  const { view } = params;
  const allowedDecisions = listDecisionActions(view.actions);
  const sections = [];
  if (view.approvalKind === "exec") {
    const header = ["Exec approval required", `ID: ${view.approvalId}`];
    sections.push(header.join("\n"));
    const warningText = view.warningText?.trim();
    if (warningText) sections.push(warningText);
    const warningLines = view.commandAnalysis?.warningLines
      ?.map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 5);
    if (warningLines?.length)
      sections.push(["Command analysis:", ...warningLines.map((line) => `- ${line}`)].join("\n"));
    sections.push(["Pending command:", formatFencedCodeBlock(view.commandText, "sh")].join("\n"));
    const info = [];
    if (view.cwd)
      info.push(`CWD: ${formatApprovalDisplayPath(sanitizeForPromptLiteral(view.cwd))}`);
    if (view.host) info.push(`Host: ${view.host}`);
    if (view.nodeId) info.push(`Node: ${view.nodeId}`);
    if (view.agentId) info.push(`Agent: ${view.agentId}`);
    if (view.ask) info.push(`Ask: ${view.ask}`);
    info.push(`Expires in: ${formatExecApprovalExpiresIn(view.expiresAtMs, params.nowMs)}`);
    info.push(`Full id: \`${view.approvalId}\``);
    sections.push(info.join("\n"));
  } else {
    const header = ["Plugin approval required", `ID: ${view.approvalId}`];
    sections.push(header.join("\n"));
    const details = [`Title: ${view.title}`];
    if (view.description) details.push(`Description: ${view.description}`);
    details.push(`Severity: ${formatSeverity(view.severity)}`);
    if (view.toolName) details.push(`Tool: ${view.toolName}`);
    if (view.pluginId) details.push(`Plugin: ${view.pluginId}`);
    if (view.agentId) details.push(`Agent: ${view.agentId}`);
    details.push(`Expires in: ${formatExecApprovalExpiresIn(view.expiresAtMs, params.nowMs)}`);
    details.push(`Full id: \`${view.approvalId}\``);
    sections.push(details.join("\n"));
  }
  if (params.reactionHint) sections.push(params.reactionHint);
  const commandInstructions = buildCommandActionInstructionSection(view.actions);
  if (commandInstructions.length > 0) sections.push(commandInstructions.join("\n"));
  const manualInstructions = buildManualInstructionSection({
    approvalKind: view.approvalKind,
    approvalId: view.approvalId,
    allowedDecisions,
  });
  if (manualInstructions.length > 0) sections.push(manualInstructions.join("\n"));
  return sections.filter(Boolean).join("\n\n");
}
function withoutPresentation(payload) {
  const { presentation: _presentation, interactive: _interactive, ...rest } = payload;
  return rest;
}
function buildMetadataPayload(params) {
  const sessionKey =
    params.request.request && "sessionKey" in params.request.request
      ? params.request.request.sessionKey
      : null;
  return withoutPresentation(
    buildApprovalPendingReplyPayload({
      approvalKind: params.view.approvalKind,
      approvalId: params.view.approvalId,
      approvalSlug: params.view.approvalId.slice(0, 8),
      text: params.text,
      agentId: params.view.agentId ?? null,
      allowedDecisions: params.allowedDecisions,
      sessionKey,
    }),
  );
}
/** Build an approval prompt payload with reaction bindings for a prepared view. */
function buildApprovalPendingPromptPayload(params) {
  const allowedDecisions = listDecisionActions(params.view.actions);
  const reactionBindings = listApprovalReactionBindings({ allowedDecisions });
  const text = buildApprovalReactionPromptText({
    view: params.view,
    nowMs: params.nowMs,
    reactionHint: buildApprovalReactionHint({ allowedDecisions }),
  });
  return {
    ...buildMetadataPayload({
      request: params.request,
      view: params.view,
      text,
      allowedDecisions,
    }),
    allowedDecisions,
    reactionBindings,
  };
}
/** Build an approval prompt payload with reaction bindings directly from a request. */
function buildApprovalReactionPromptPayloadForRequest(params) {
  return buildApprovalPendingPromptPayload({
    request: params.request,
    view: buildPendingApprovalView(params.request),
    nowMs: params.nowMs,
  });
}
function replaceApprovalIdPlaceholder(text, approvalId) {
  return (text ?? "").replace(/\/approve\s+<id>/g, `/approve ${approvalId}`);
}
/** Build reaction and manual-fallback pending approval content for a prepared view. */
function buildApprovalReactionPendingContent(params) {
  const reactionPayload = buildApprovalPendingPromptPayload(params);
  return {
    reactionPayload,
    manualFallbackPayload:
      params.view.approvalKind === "plugin"
        ? (() => {
            const payload = buildPluginApprovalPendingReplyPayload({
              request: params.request,
              nowMs: params.nowMs,
              allowedDecisions: reactionPayload.allowedDecisions,
            });
            return withoutPresentation({
              ...payload,
              text: replaceApprovalIdPlaceholder(payload.text, params.request.id),
            });
          })()
        : withoutPresentation(
            buildExecApprovalPendingReplyPayload({
              approvalId: params.request.id,
              approvalSlug: params.request.id.slice(0, 8),
              approvalCommandId: params.request.id,
              warningText: params.view.warningText ?? void 0,
              ask: params.view.ask ?? null,
              agentId: params.view.agentId ?? null,
              allowedDecisions: reactionPayload.allowedDecisions,
              command: params.view.commandText,
              cwd: params.view.cwd ?? void 0,
              host: params.view.host === "node" ? "node" : "gateway",
              nodeId: params.view.nodeId ?? void 0,
              sessionKey: params.view.sessionKey ?? null,
              expiresAtMs: params.request.expiresAtMs,
              nowMs: params.nowMs,
            }),
          ),
  };
}
/** Build reaction and manual-fallback pending approval content directly from a request. */
function buildApprovalReactionPendingContentForRequest(params) {
  return buildApprovalReactionPendingContent({
    request: params.request,
    view: buildPendingApprovalView(params.request),
    nowMs: params.nowMs,
  });
}
/** Create an approval target store backed by memory with optional persistent storage. */
function createApprovalReactionTargetStore(params) {
  const nowMs = params.nowMs ?? Date.now;
  const memory = /* @__PURE__ */ new Map();
  let persistentStore;
  let persistentStoreDisabled = false;
  const disablePersistentStore = (error) => {
    persistentStoreDisabled = true;
    persistentStore = void 0;
    params.logPersistentError?.(error);
  };
  const getPersistentStore = () => {
    if (persistentStoreDisabled || !params.openStore) return;
    if (persistentStore) return persistentStore;
    try {
      persistentStore = params.openStore({
        namespace: params.namespace,
        maxEntries: params.maxEntries,
        defaultTtlMs: params.defaultTtlMs,
      });
      return persistentStore;
    } catch (error) {
      disablePersistentStore(error);
      return;
    }
  };
  const pruneMemory = () => {
    const now = nowMs();
    for (const [key, entry] of memory) if (entry.expiresAtMs <= now) memory.delete(key);
    while (memory.size > params.maxEntries) {
      const oldestKey = memory.keys().next().value;
      if (!oldestKey) return;
      memory.delete(oldestKey);
    }
  };
  return {
    register(key, target, opts) {
      const normalizedKey = key.trim();
      if (!normalizedKey) return;
      const ttlMs = Math.max(1, opts?.ttlMs ?? params.defaultTtlMs);
      memory.set(normalizedKey, {
        target,
        expiresAtMs: nowMs() + ttlMs,
      });
      pruneMemory();
      const store = getPersistentStore();
      if (!store) return;
      store
        .register(
          normalizedKey,
          {
            version: 1,
            target,
          },
          { ttlMs },
        )
        .catch(disablePersistentStore);
    },
    async lookup(key) {
      const normalizedKey = key.trim();
      if (!normalizedKey) return null;
      pruneMemory();
      const entry = memory.get(normalizedKey);
      if (entry) return entry.target;
      const store = getPersistentStore();
      if (!store) return null;
      try {
        const persisted = await store.lookup(normalizedKey);
        if (persisted?.version !== 1) return null;
        return params.readPersistedTarget
          ? params.readPersistedTarget(persisted.target)
          : persisted.target;
      } catch (error) {
        disablePersistentStore(error);
        return null;
      }
    },
    delete(key) {
      const normalizedKey = key.trim();
      if (!normalizedKey) return;
      memory.delete(normalizedKey);
      const store = getPersistentStore();
      if (!store) return;
      store.delete(normalizedKey).catch(disablePersistentStore);
    },
    clearForTest() {
      memory.clear();
      persistentStore = void 0;
      persistentStoreDisabled = false;
    },
  };
}
//#endregion
export {
  buildApprovalReactionPendingContent as a,
  createApprovalReactionTargetStore as c,
  listApprovalReactionBindings as d,
  normalizeApprovalReactionEmoji as f,
  buildApprovalReactionHint as i,
  hasApprovalReactionHintText as l,
  resolveTypedApprovalReactionTarget as m,
  addApprovalReactionHintToText as n,
  buildApprovalReactionPendingContentForRequest as o,
  resolveApprovalReactionDecision as p,
  buildApprovalPendingPromptPayload as r,
  buildApprovalReactionPromptPayloadForRequest as s,
  APPROVAL_REACTION_BINDINGS as t,
  insertApprovalReactionHintNearIdHeader as u,
};
