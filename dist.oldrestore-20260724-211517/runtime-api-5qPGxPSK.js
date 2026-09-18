import { randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import {
  c as resolveDefaultAgentId,
  n as listAgentIds,
  o as resolveAgentWorkspaceDir,
  r as resolveAgentConfig,
} from "./agent-scope-config-DVIR1nBa.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { x as canonicalPathFromExistingAncestor } from "./fs-safe-RNq3oO57.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  b as parseStrictPositiveInteger,
  m as isFutureDateTimestampMs,
  t as MAX_DATE_TIMESTAMP_MS,
} from "./number-coercion-CJQ8TR--.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./security-runtime-CraX8Pqe.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./agent-runtime-BiQiwmwD.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { t as createWorkboardSqliteStores } from "./sqlite-store-Csd4QS_7.js";
import {
  a as WORKBOARD_EXECUTION_ENGINES,
  c as WORKBOARD_LINK_TYPES,
  d as WORKBOARD_PROOF_STATUSES,
  f as WORKBOARD_STATUSES,
  i as WORKBOARD_EVENT_KINDS,
  l as WORKBOARD_NOTIFICATION_KINDS,
  n as WORKBOARD_DIAGNOSTIC_KINDS,
  o as WORKBOARD_EXECUTION_MODES,
  p as WORKBOARD_TEMPLATE_IDS,
  r as WORKBOARD_DIAGNOSTIC_SEVERITIES,
  s as WORKBOARD_EXECUTION_STATUSES,
  t as WORKBOARD_ATTEMPT_STATUSES,
  u as WORKBOARD_PRIORITIES,
} from "./src-CpFrZXrA.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/workboard/src/workspace-access.ts
const WORKBOARD_TOOL_NAMES = [
  "workboard_list",
  "workboard_create",
  "workboard_link",
  "workboard_read",
  "workboard_claim",
  "workboard_heartbeat",
  "workboard_complete",
  "workboard_attachment_add",
  "workboard_attachment_read",
  "workboard_attachment_delete",
  "workboard_block",
  "workboard_boards",
  "workboard_board_create",
  "workboard_board_archive",
  "workboard_board_delete",
  "workboard_stats",
  "workboard_runs",
  "workboard_specify",
  "workboard_decompose",
  "workboard_notify_subscribe",
  "workboard_notify_list",
  "workboard_notify_events",
  "workboard_notify_advance",
  "workboard_notify_unsubscribe",
  "workboard_promote",
  "workboard_reassign",
  "workboard_reclaim",
  "workboard_dispatch",
  "workboard_release",
  "workboard_comment",
  "workboard_proof",
  "workboard_worker_log",
  "workboard_protocol_violation",
  "workboard_unblock",
  "workboard_move",
];
const WORKBOARD_REQUIRED_WORKER_TOOLS = [
  "workboard_heartbeat",
  "workboard_complete",
  "workboard_block",
];
function resolveWorkboardAgentWorkspace(config, agentId) {
  return resolveAgentWorkspaceDir(config, agentId ?? resolveDefaultAgentId(config));
}
function resolveConfiguredWorkboardWorkspaceAccess(params) {
  if (params.unrestricted) return { unrestricted: true };
  return {
    unrestricted: false,
    writable: true,
    roots: listAgentIds(params.config).map((agentId) =>
      resolveAgentWorkspaceDir(params.config, agentId),
    ),
  };
}
async function resolveAgentWorkboardWorkspaceRuntime(params) {
  const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
  const sandboxRuntime = await params.prepareSandboxWorkspaceAuthority({
    config: params.config,
    agentId,
    confinedToolNames: WORKBOARD_TOOL_NAMES,
    requiredToolNames: WORKBOARD_REQUIRED_WORKER_TOOLS,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
    sessionKey: params.sessionKey,
    workspaceDir: params.workspaceDir,
  });
  return {
    sandboxed: sandboxRuntime.sandboxed,
    workspaceAccess: sandboxRuntime.sandboxed
      ? {
          unrestricted: false,
          roots: [resolveAgentWorkspaceDir(params.config, agentId)],
          writable: sandboxRuntime.workspaceAccess === "rw",
        }
      : { unrestricted: true },
    ...(sandboxRuntime.confinementError
      ? { confinementError: sandboxRuntime.confinementError }
      : {}),
  };
}
function resolveCommandWorkboardWorkspaceAccess(params) {
  if (params.gatewayClientScopes)
    return resolveConfiguredWorkboardWorkspaceAccess({
      config: params.config,
      unrestricted: params.gatewayClientScopes.includes("operator.admin"),
    });
  const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
  const sandboxRuntime =
    params.sessionKey && params.resolveSandboxWorkspaceAuthority
      ? params.resolveSandboxWorkspaceAuthority({
          config: params.config,
          agentId,
          sessionKey: params.sessionKey,
        })
      : void 0;
  if (sandboxRuntime?.sandboxed)
    return {
      unrestricted: false,
      roots: [resolveAgentWorkspaceDir(params.config, agentId)],
      writable: sandboxRuntime.workspaceAccess === "rw",
    };
  return (resolveAgentConfig(params.config, agentId)?.tools?.fs?.workspaceOnly ??
    params.config.tools?.fs?.workspaceOnly) === true
    ? {
        unrestricted: false,
        roots: [resolveAgentWorkspaceDir(params.config, agentId)],
        writable: true,
      }
    : { unrestricted: true };
}
function resolveToolWorkboardWorkspaceAccess(context, resolveSandboxWorkspaceAuthority) {
  if (!context?.sandboxed && context?.fsPolicy?.workspaceOnly !== true)
    return { unrestricted: true };
  const config = context.runtimeConfig ?? context.getRuntimeConfig?.() ?? context.config;
  const sandboxRuntime =
    context.sandboxed && config && context.sessionKey && resolveSandboxWorkspaceAuthority
      ? resolveSandboxWorkspaceAuthority({
          config,
          agentId: context.agentId,
          sessionKey: context.sessionKey,
        })
      : void 0;
  return {
    unrestricted: false,
    roots: context.workspaceDir ? [context.workspaceDir] : [],
    writable: sandboxRuntime ? sandboxRuntime.workspaceAccess === "rw" : !context.sandboxed,
  };
}
async function canonicalizeWorkboardWorkspaceAccess(access) {
  if (access.unrestricted) return access;
  const roots = Array.from(
    new Set(
      await Promise.all(
        access.roots.map(async (root) => await canonicalPathFromExistingAncestor(root)),
      ),
    ),
  );
  if (roots.length === 0) throw new Error("restricted workspace access has no allowed roots.");
  return {
    unrestricted: false,
    roots,
    writable: access.writable,
  };
}
function intersectWorkboardWorkspaceAccess(left, right) {
  if (left.unrestricted) return right;
  if (right.unrestricted) return left;
  const roots = /* @__PURE__ */ new Set();
  for (const leftRoot of left.roots)
    for (const rightRoot of right.roots)
      if (leftRoot === rightRoot || isPathInside(leftRoot, rightRoot)) roots.add(rightRoot);
      else if (isPathInside(rightRoot, leftRoot)) roots.add(leftRoot);
  if (roots.size === 0)
    throw new Error("workspace access does not overlap the card's persisted authority.");
  return {
    unrestricted: false,
    roots: Array.from(roots),
    writable: left.writable && right.writable,
  };
}
async function assertCanonicalWorkboardPathAccess(candidate, access) {
  if (access.unrestricted) return candidate;
  for (const root of access.roots)
    if (isPathInside(await canonicalPathFromExistingAncestor(root), candidate)) return candidate;
  throw new Error("workspace path is outside the caller's allowed workspaces.");
}
async function assertCanonicalWorkboardRootAccess(candidate, access) {
  if (access.unrestricted) return candidate;
  for (const root of access.roots)
    if ((await canonicalPathFromExistingAncestor(root)) === candidate) return candidate;
  throw new Error("workspace path must equal one of the caller's allowed workspace roots.");
}
async function assertPathAllowed(value, access) {
  if (typeof value !== "string" || !value.trim()) return;
  return await assertCanonicalWorkboardPathAccess(
    await canonicalPathFromExistingAncestor(value.trim()),
    access,
  );
}
async function assertWorkspaceAllowed(value, access, options) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const workspace = value;
  if (options?.sourceOnly)
    return await assertPathAllowed(workspace.sourcePath ?? workspace.path, access);
  await assertPathAllowed(workspace.path, access);
  await assertPathAllowed(workspace.sourcePath, access);
}
function readRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function containsWorkboardWorkspaceMutation(value) {
  const record = readRecord(value);
  if (!record) return false;
  if (Object.hasOwn(record, "workspace") || Object.hasOwn(record, "defaultWorkspace")) return true;
  return (
    containsWorkboardWorkspaceMutation(record.patch) ||
    containsWorkboardWorkspaceMutation(readRecord(record.metadata)?.automation) ||
    (Array.isArray(record.children) &&
      record.children.some((child) => containsWorkboardWorkspaceMutation(child)))
  );
}
function withWorkboardWorkspaceAccess(value, access) {
  return {
    ...withoutWorkboardWorkspaceAccess(value),
    workspaceAccess: access,
  };
}
function withoutWorkboardWorkspaceAccess(value) {
  const { workspaceAccess: _untrustedWorkspaceAccess, ...rest } = readRecord(value) ?? {};
  return rest;
}
function withWorkboardDecomposeWorkspaceAccess(value, access) {
  const record = withoutWorkboardWorkspaceAccess(value);
  return {
    ...record,
    ...(Array.isArray(record.children)
      ? { children: record.children.map((child) => withWorkboardWorkspaceAccess(child, access)) }
      : {}),
  };
}
async function assertWorkboardWorkspaceMutationAccess(value, access) {
  if (access.unrestricted) return;
  const record = readRecord(value);
  if (!record) return;
  await assertWorkspaceAllowed(record.workspace, access);
  await assertWorkspaceAllowed(record.defaultWorkspace, access);
  const patch = readRecord(record.patch);
  if (patch) await assertWorkboardWorkspaceMutationAccess(patch, access);
  const automation = readRecord(readRecord(record.metadata)?.automation);
  if (automation) await assertWorkboardWorkspaceMutationAccess(automation, access);
  if (Array.isArray(record.children))
    for (const child of record.children)
      await assertWorkboardWorkspaceMutationAccess(child, access);
}
async function assertWorkboardWorkspaceSourceAccess(workspace, access) {
  return await assertWorkspaceAllowed(workspace, access, { sourceOnly: true });
}
function guardWorkboardToolsForWorkspaceAccess(tools, context, resolveSandboxWorkspaceAuthority) {
  const workspaceAccess = resolveToolWorkboardWorkspaceAccess(
    context,
    resolveSandboxWorkspaceAuthority,
  );
  return tools.map((tool) => ({
    ...tool,
    execute: async (toolCallId, rawParams, signal, onUpdate) => {
      const canonicalAccess = await canonicalizeWorkboardWorkspaceAccess(workspaceAccess);
      await assertWorkboardWorkspaceMutationAccess(rawParams, canonicalAccess);
      const sanitizedParams = withoutWorkboardWorkspaceAccess(rawParams);
      const constrainedParams =
        tool.name === "workboard_create"
          ? withWorkboardWorkspaceAccess(sanitizedParams, canonicalAccess)
          : tool.name === "workboard_decompose"
            ? withWorkboardDecomposeWorkspaceAccess(sanitizedParams, canonicalAccess)
            : tool.name === "workboard_specify" &&
                containsWorkboardWorkspaceMutation(sanitizedParams)
              ? withWorkboardWorkspaceAccess(sanitizedParams, canonicalAccess)
              : sanitizedParams;
      return await tool.execute(toolCallId, constrainedParams, signal, onUpdate);
    },
  }));
}
//#endregion
//#region extensions/workboard/src/dispatcher-workspace.ts
function managedWorktreeName(cardId) {
  return `wb-${cardId
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")}`
    .slice(0, 64)
    .replace(/-$/, "");
}
async function cleanupWorkboardRunWorktree(params) {
  const card = (await params.store.list()).find((entry) => entry.runId === params.runId);
  const workspace = card?.metadata?.automation?.workspace;
  if (!card || workspace?.kind !== "worktree" || !workspace.path) return;
  await params.worktrees.removeIfLossless({
    path: workspace.path,
    ownerKind: "workboard",
    ownerId: card.id,
  });
}
async function resolveDispatchWorkspaceAccess(params) {
  const currentAccess = await canonicalizeWorkboardWorkspaceAccess(
    params.currentAccess ?? { unrestricted: true },
  );
  const persistedAccess = params.card.metadata?.automation?.workspaceAccess;
  const workspace = params.card.metadata?.automation?.workspace;
  let targetWorkspace;
  if (!persistedAccess?.unrestricted || !currentAccess.unrestricted) {
    const resolved = params.resolveAgentWorkspace?.(params.card.agentId);
    targetWorkspace = resolved ? await canonicalPathFromExistingAncestor(resolved) : void 0;
  }
  const workspaceAccess = intersectWorkboardWorkspaceAccess(
    persistedAccess
      ? await canonicalizeWorkboardWorkspaceAccess(persistedAccess)
      : currentAccess.unrestricted
        ? !workspace || workspace.kind === "scratch"
          ? currentAccess
          : (() => {
              throw new Error(
                "card workspace authority is unknown; re-save its workspace with current permissions before dispatch.",
              );
            })()
        : currentAccess,
    currentAccess,
  );
  if (!workspaceAccess.unrestricted && !workspaceAccess.writable)
    throw new Error(
      "card workspace authority is read-only; manual movement is allowed but worker dispatch requires write access.",
    );
  return {
    workspaceAccess,
    ...(targetWorkspace ? { targetWorkspace } : {}),
    persistWorkspaceAccess: !persistedAccess,
  };
}
async function assertRestrictedWorkboardTarget(params) {
  const resolved = params.resolveAgentWorkspaceRuntime
    ? await params.resolveAgentWorkspaceRuntime(
        params.agentId,
        params.sessionKey,
        params.root,
        params.modelProvider,
        params.modelId,
      )
    : {
        sandboxed: false,
        workspaceAccess: { unrestricted: true },
      };
  const targetRuntime = {
    ...resolved,
    workspaceAccess: await canonicalizeWorkboardWorkspaceAccess(resolved.workspaceAccess),
  };
  if (!targetRuntime.sandboxed)
    throw new Error("target agent is not sandboxed for this restricted Workboard card.");
  if (targetRuntime.confinementError) throw new Error(targetRuntime.confinementError);
  if (targetRuntime.workspaceAccess.unrestricted || !targetRuntime.workspaceAccess.writable)
    throw new Error("target agent does not have writable workspace-only access.");
  await assertCanonicalWorkboardRootAccess(params.root, targetRuntime.workspaceAccess);
  if (!params.worktrees)
    throw new Error("workspace checkout inspection is unavailable for restricted dispatch.");
  const checkoutRoot = await params.worktrees.resolveCheckoutRoot({ path: params.root });
  if (!checkoutRoot) return;
  if ((await canonicalPathFromExistingAncestor(checkoutRoot)) !== params.root)
    throw new Error("workspace root is nested inside a broader Git checkout.");
  if (
    !params.worktrees.hasSelfContainedCheckoutMetadata ||
    !(await params.worktrees.hasSelfContainedCheckoutMetadata({ path: params.root }))
  )
    throw new Error("restricted workspace Git metadata must be contained inside its root.");
}
//#endregion
//#region extensions/workboard/src/store-constants.ts
const POSITION_STEP = 1e3;
const MAX_CARDS = 2e3;
const MAX_ATTACHMENT_ENTRIES = MAX_CARDS * 21;
const MAX_ATTACHMENT_BYTES = 256 * 1024;
const MAX_CARD_METADATA_BYTES = 24 * 1024;
const DEFAULT_CLAIM_TTL_MS = 1800 * 1e3;
function secondsToDurationMs(seconds) {
  const ms = Math.trunc(seconds) * 1e3;
  return Number.isFinite(ms)
    ? Math.min(MAX_DATE_TIMESTAMP_MS, Math.max(1, ms))
    : MAX_DATE_TIMESTAMP_MS;
}
function addWorkboardDurationMs(now, durationMs) {
  return resolveExpiresAtMsFromDurationMs(durationMs, { nowMs: now }) ?? 864e13;
}
//#endregion
//#region extensions/workboard/src/workspace-path.ts
function isAbsoluteWorkspacePath(value) {
  return (
    value.startsWith("/") || /^[A-Za-z]:[\\/]/.test(value) || /^\\\\[^\\]+\\[^\\]+/.test(value)
  );
}
//#endregion
//#region extensions/workboard/src/store-normalizers.ts
function normalizeOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function normalizeBoardId(value, fallback) {
  const raw = normalizeBoundedString(value, fallback, 80, "board id");
  if (!raw) return;
  const boardId = raw.toLowerCase();
  if (!/^[a-z0-9][a-z0-9._-]{0,79}$/.test(boardId))
    throw new Error(
      "board id must start with a letter or number and use letters, numbers, dots, dashes, or underscores.",
    );
  return boardId;
}
function normalizeBoardIdRequired(value) {
  return normalizeBoardId(value) ?? "default";
}
function normalizeBoardMetadata(input, fallback, now = Date.now()) {
  const id = normalizeBoardId(input.id, fallback?.id) ?? "default";
  const name = normalizeBoundedString(input.name, fallback?.name, 120, "board name");
  const description = normalizeBoundedString(
    input.description,
    fallback?.description,
    1e3,
    "board description",
  );
  const icon = normalizeBoundedString(input.icon, fallback?.icon, 40, "board icon");
  const color = normalizeBoundedString(input.color, fallback?.color, 40, "board color");
  const defaultWorkspace = Object.hasOwn(input, "defaultWorkspace")
    ? normalizeWorkspace(input.defaultWorkspace, fallback?.defaultWorkspace)
    : fallback?.defaultWorkspace;
  const orchestration = Object.hasOwn(input, "orchestration")
    ? normalizeOrchestration(input.orchestration, fallback?.orchestration)
    : fallback?.orchestration;
  const archivedAt = Object.hasOwn(input, "archived")
    ? input.archived === false
      ? void 0
      : now
    : fallback?.archivedAt;
  return {
    id,
    ...(name ? { name } : {}),
    ...(description ? { description } : {}),
    ...(icon ? { icon } : {}),
    ...(color ? { color } : {}),
    ...(defaultWorkspace ? { defaultWorkspace } : {}),
    ...(orchestration ? { orchestration } : {}),
    createdAt: fallback?.createdAt ?? now,
    updatedAt: now,
    ...(archivedAt ? { archivedAt } : {}),
  };
}
function normalizeOrchestration(value, fallback) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const record = value;
  const autoDecompose =
    typeof record.autoDecompose === "boolean" ? record.autoDecompose : fallback?.autoDecompose;
  const autoDecomposePerDispatch =
    typeof record.autoDecomposePerDispatch === "number" &&
    Number.isFinite(record.autoDecomposePerDispatch)
      ? Math.max(1, Math.min(20, Math.trunc(record.autoDecomposePerDispatch)))
      : fallback?.autoDecomposePerDispatch;
  const defaultAssignee = normalizeBoundedString(
    record.defaultAssignee,
    fallback?.defaultAssignee,
    120,
    "default assignee",
  );
  const orchestratorProfile = normalizeBoundedString(
    record.orchestratorProfile,
    fallback?.orchestratorProfile,
    120,
    "orchestrator profile",
  );
  const next = {
    ...(autoDecompose !== void 0 ? { autoDecompose } : {}),
    ...(autoDecomposePerDispatch ? { autoDecomposePerDispatch } : {}),
    ...(defaultAssignee ? { defaultAssignee } : {}),
    ...(orchestratorProfile ? { orchestratorProfile } : {}),
  };
  return Object.keys(next).length ? next : void 0;
}
function normalizeNotificationKinds(value) {
  if (value == null) return;
  const entries = typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : [];
  const kinds = [];
  for (const entry of entries) {
    const kind = typeof entry === "string" ? entry.trim() : "";
    if (!WORKBOARD_NOTIFICATION_KINDS.includes(kind))
      throw new Error(
        `notification kind must be one of: ${WORKBOARD_NOTIFICATION_KINDS.join(", ")}.`,
      );
    const notificationKind = kind;
    if (!kinds.includes(notificationKind)) kinds.push(notificationKind);
  }
  return kinds.length ? kinds : void 0;
}
function normalizeNotificationSubscription(input, fallback, now = Date.now()) {
  const boardId = normalizeBoardId(input.boardId, fallback?.boardId) ?? "default";
  const cardId = normalizeBoundedString(input.cardId, fallback?.cardId, 120, "card id");
  const sessionKey = normalizeBoundedString(
    input.sessionKey,
    fallback?.sessionKey,
    240,
    "session key",
  );
  const runId = normalizeBoundedString(input.runId, fallback?.runId, 160, "run id");
  const target = normalizeBoundedString(input.target, fallback?.target, 240, "notification target");
  if (!cardId && !sessionKey && !runId && !target)
    throw new Error("notification subscription needs cardId, sessionKey, runId, or target.");
  const eventKinds = normalizeNotificationKinds(input.eventKinds);
  const preservedFields = {};
  if (fallback) {
    if (fallback.lastEventAt) preservedFields.lastEventAt = fallback.lastEventAt;
    if (fallback.lastEventId) preservedFields.lastEventId = fallback.lastEventId;
    if (fallback.lastEventSequence) preservedFields.lastEventSequence = fallback.lastEventSequence;
    if (fallback.deliveredEventIds?.length)
      preservedFields.deliveredEventIds = fallback.deliveredEventIds;
  }
  return {
    id: fallback?.id ?? randomUUID(),
    boardId,
    ...(cardId ? { cardId } : {}),
    ...(sessionKey ? { sessionKey } : {}),
    ...(runId ? { runId } : {}),
    ...(target ? { target } : {}),
    ...(eventKinds ? { eventKinds } : {}),
    ...preservedFields,
    createdAt: fallback?.createdAt ?? now,
    updatedAt: now,
  };
}
function normalizeTitle(value) {
  const title = normalizeOptionalString(value);
  if (!title) throw new Error("title is required.");
  if (title.length > 180) throw new Error("title must be 180 characters or fewer.");
  return title;
}
function normalizeNotes(value) {
  const notes = normalizeOptionalString(value);
  if (!notes) return;
  if (notes.length > 4e3) throw new Error("notes must be 4000 characters or fewer.");
  return notes;
}
function normalizeBoundedString(value, fallback, maxLength, fieldName) {
  const normalized = normalizeOptionalString(value);
  if (!normalized) return fallback;
  if (normalized.length > maxLength)
    throw new Error(`${fieldName} must be ${maxLength} characters or fewer.`);
  return normalized;
}
function normalizeStatus(value, fallback) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  if (WORKBOARD_STATUSES.includes(value)) return value;
  throw new Error(`status must be one of: ${WORKBOARD_STATUSES.join(", ")}.`);
}
function normalizePriority(value, fallback) {
  if (typeof value !== "string" || !value.trim()) return fallback;
  if (WORKBOARD_PRIORITIES.includes(value)) return value;
  throw new Error(`priority must be one of: ${WORKBOARD_PRIORITIES.join(", ")}.`);
}
function normalizeLabels(value, fallback = []) {
  if (value == null) return fallback;
  const entries =
    typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : void 0;
  if (!entries) throw new Error("labels must be an array or comma-separated string.");
  const labels = [];
  for (const entry of entries) {
    const label = normalizeOptionalString(entry);
    if (!label || labels.includes(label)) continue;
    if (label.length > 40) throw new Error("labels must be 40 characters or fewer.");
    labels.push(label);
    if (labels.length >= 12) break;
  }
  return labels;
}
function normalizeStringList(value, fieldName, maxLength = 80) {
  if (value == null) return [];
  const entries =
    typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : void 0;
  if (!entries) throw new Error(`${fieldName} must be an array or comma-separated string.`);
  const values = [];
  for (const entry of entries) {
    if (Array.isArray(value) && typeof entry !== "string")
      throw new Error(`${fieldName} entries must be strings.`);
    const normalized = normalizeBoundedString(entry, void 0, maxLength, fieldName);
    if (normalized && !values.includes(normalized)) values.push(normalized);
    if (values.length > 20) throw new Error(`${fieldName} supports at most 20 entries.`);
  }
  return values;
}
function normalizePosition(value, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.max(0, Math.trunc(value));
}
function normalizePositiveInteger$1(value, fieldName) {
  if (value == null || value === "") return;
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new Error(`${fieldName} must be a number.`);
  return Math.max(1, Math.trunc(value));
}
function normalizeWorkspace(value, fallback) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const record = value;
  const kind =
    record.kind === "scratch" || record.kind === "dir" || record.kind === "worktree"
      ? record.kind
      : fallback?.kind;
  if (!kind) throw new Error("workspace kind must be scratch, dir, or worktree.");
  const workspacePath = normalizeBoundedString(record.path, fallback?.path, 2e3, "workspace path");
  if (kind === "dir" && (!workspacePath || !isAbsoluteWorkspacePath(workspacePath)))
    throw new Error("dir workspace path must be absolute.");
  const branch = normalizeBoundedString(record.branch, fallback?.branch, 160, "workspace branch");
  const sourcePath = normalizeBoundedString(
    record.sourcePath,
    fallback?.sourcePath,
    2e3,
    "workspace source path",
  );
  if (sourcePath && !isAbsoluteWorkspacePath(sourcePath))
    throw new Error("workspace source path must be absolute.");
  const sourceBranch = normalizeBoundedString(
    record.sourceBranch,
    fallback?.sourceBranch,
    160,
    "workspace source branch",
  );
  return {
    kind,
    ...(workspacePath ? { path: workspacePath } : {}),
    ...(branch ? { branch } : {}),
    ...(kind === "worktree" && sourcePath ? { sourcePath } : {}),
    ...(kind === "worktree" && sourceBranch ? { sourceBranch } : {}),
  };
}
function normalizeAutomation(value, fallback = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return Object.keys(fallback).length ? fallback : void 0;
  const record = value;
  const tenant = normalizeBoundedString(record.tenant, fallback.tenant, 80, "tenant");
  const boardId = Object.hasOwn(record, "boardId")
    ? normalizeBoardId(record.boardId, fallback.boardId)
    : fallback.boardId;
  const createdByCardId = normalizeBoundedString(
    record.createdByCardId,
    fallback.createdByCardId,
    120,
    "created by card id",
  );
  const idempotencyKey = normalizeBoundedString(
    record.idempotencyKey,
    fallback.idempotencyKey,
    160,
    "idempotency key",
  );
  const summary = normalizeBoundedString(record.summary, fallback.summary, 2e3, "summary");
  const skills = Object.hasOwn(record, "skills")
    ? normalizeStringList(record.skills, "skills")
    : fallback.skills;
  const createdCardIds = Object.hasOwn(record, "createdCardIds")
    ? normalizeStringList(record.createdCardIds, "created card ids", 120)
    : fallback.createdCardIds;
  const scheduledAt = Object.hasOwn(record, "scheduledAt")
    ? normalizeTimestamp(record.scheduledAt, 0) || void 0
    : fallback.scheduledAt;
  const maxRuntimeSeconds = Object.hasOwn(record, "maxRuntimeSeconds")
    ? normalizePositiveInteger$1(record.maxRuntimeSeconds, "max runtime seconds")
    : fallback.maxRuntimeSeconds;
  const maxRetries = Object.hasOwn(record, "maxRetries")
    ? normalizePositiveInteger$1(record.maxRetries, "max retries")
    : fallback.maxRetries;
  const dispatchCount = Object.hasOwn(record, "dispatchCount")
    ? normalizeTimestamp(record.dispatchCount, 0) || void 0
    : fallback.dispatchCount;
  const lastDispatchAt = Object.hasOwn(record, "lastDispatchAt")
    ? normalizeTimestamp(record.lastDispatchAt, 0) || void 0
    : fallback.lastDispatchAt;
  const workspace = Object.hasOwn(record, "workspace")
    ? normalizeWorkspace(record.workspace, fallback.workspace)
    : fallback.workspace;
  const workspaceAccess = fallback.workspaceAccess;
  const next = removeUndefinedAutomationFields({
    ...(tenant ? { tenant } : {}),
    ...(boardId ? { boardId } : {}),
    ...(createdByCardId ? { createdByCardId } : {}),
    ...(idempotencyKey ? { idempotencyKey } : {}),
    ...(skills?.length ? { skills } : {}),
    ...(workspace ? { workspace } : {}),
    ...(workspaceAccess ? { workspaceAccess } : {}),
    ...(maxRuntimeSeconds ? { maxRuntimeSeconds } : {}),
    ...(maxRetries ? { maxRetries } : {}),
    ...(scheduledAt ? { scheduledAt } : {}),
    ...(summary ? { summary } : {}),
    ...(createdCardIds?.length ? { createdCardIds } : {}),
    ...(dispatchCount ? { dispatchCount } : {}),
    ...(lastDispatchAt ? { lastDispatchAt } : {}),
  });
  return Object.keys(next).length ? next : void 0;
}
function deriveChildIdempotencyKey(parentKey, index) {
  if (!parentKey) return;
  const key = `${parentKey}:child:${index}`;
  return key.length <= 160 ? key : void 0;
}
function normalizeExecutionEngine(value, fallback) {
  if (typeof value === "string" && WORKBOARD_EXECUTION_ENGINES.includes(value)) return value;
  return fallback;
}
function normalizeExecutionMode(value, fallback) {
  if (typeof value === "string" && WORKBOARD_EXECUTION_MODES.includes(value)) return value;
  return fallback;
}
function normalizeExecutionStatus(value, fallback) {
  if (typeof value === "string" && WORKBOARD_EXECUTION_STATUSES.includes(value)) return value;
  return fallback;
}
function normalizeAttemptStatus(value, fallback) {
  if (typeof value === "string" && WORKBOARD_ATTEMPT_STATUSES.includes(value)) return value;
  return fallback;
}
function normalizeLinkType(value, fallback) {
  if (typeof value === "string" && WORKBOARD_LINK_TYPES.includes(value)) return value;
  return fallback;
}
function normalizeProofStatus(value, fallback) {
  if (typeof value === "string" && WORKBOARD_PROOF_STATUSES.includes(value)) return value;
  return fallback;
}
function normalizeTemplateId(value) {
  return typeof value === "string" && WORKBOARD_TEMPLATE_IDS.includes(value) ? value : void 0;
}
function normalizeTimestamp(value, fallback) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.trunc(value))
    : fallback;
}
function normalizeEvent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id);
  const kind = WORKBOARD_EVENT_KINDS.includes(record.kind) ? record.kind : null;
  const at = normalizeTimestamp(record.at, 0);
  if (!id || !kind || !at) return null;
  const fromStatus =
    typeof record.fromStatus === "string" && WORKBOARD_STATUSES.includes(record.fromStatus)
      ? record.fromStatus
      : void 0;
  const toStatus =
    typeof record.toStatus === "string" && WORKBOARD_STATUSES.includes(record.toStatus)
      ? record.toStatus
      : void 0;
  const sessionKey = normalizeOptionalString(record.sessionKey);
  const runId = normalizeOptionalString(record.runId);
  return {
    id,
    kind,
    at,
    ...(fromStatus ? { fromStatus } : {}),
    ...(toStatus ? { toStatus } : {}),
    ...(sessionKey ? { sessionKey } : {}),
    ...(runId ? { runId } : {}),
  };
}
function normalizeEvents(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(normalizeEvent)
    .filter((event) => event !== null)
    .slice(-50);
}
function normalizeAttempt(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id);
  const startedAt = normalizeTimestamp(record.startedAt, 0);
  if (!id || !startedAt) return null;
  const endedAt = normalizeTimestamp(record.endedAt, 0);
  const sessionKey = normalizeOptionalString(record.sessionKey);
  const runId = normalizeOptionalString(record.runId);
  const error = normalizeBoundedString(record.error, void 0, 800, "attempt error");
  const model = normalizeBoundedString(record.model, void 0, 160, "attempt model");
  return {
    id,
    status: normalizeAttemptStatus(record.status, "running"),
    startedAt,
    ...(endedAt ? { endedAt } : {}),
    ...(typeof record.engine === "string" && WORKBOARD_EXECUTION_ENGINES.includes(record.engine)
      ? { engine: record.engine }
      : {}),
    ...(typeof record.mode === "string" && WORKBOARD_EXECUTION_MODES.includes(record.mode)
      ? { mode: record.mode }
      : {}),
    ...(model ? { model } : {}),
    ...(sessionKey ? { sessionKey } : {}),
    ...(runId ? { runId } : {}),
    ...(error ? { error } : {}),
  };
}
function normalizeComment(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id);
  const body = normalizeBoundedString(record.body, void 0, 2e3, "comment body");
  const createdAt = normalizeTimestamp(record.createdAt, 0);
  if (!id || !body || !createdAt) return null;
  const updatedAt = normalizeTimestamp(record.updatedAt, 0);
  return {
    id,
    body,
    createdAt,
    ...(updatedAt ? { updatedAt } : {}),
  };
}
function normalizeLink(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id);
  const createdAt = normalizeTimestamp(record.createdAt, 0);
  if (!id || !createdAt) return null;
  const targetCardId = normalizeBoundedString(record.targetCardId, void 0, 120, "link target");
  const title = normalizeBoundedString(record.title, void 0, 180, "link title");
  const url = normalizeBoundedString(record.url, void 0, 2e3, "link URL");
  if (!targetCardId && !url) return null;
  return {
    id,
    type: normalizeLinkType(record.type, "relates_to"),
    createdAt,
    ...(targetCardId ? { targetCardId } : {}),
    ...(title ? { title } : {}),
    ...(url ? { url } : {}),
  };
}
function isDependencyLink(link) {
  return link.type === "parent" || link.type === "child";
}
function normalizeProof(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id);
  const createdAt = normalizeTimestamp(record.createdAt, 0);
  if (!id || !createdAt) return null;
  const label = normalizeBoundedString(record.label, void 0, 160, "proof label");
  const command = normalizeBoundedString(record.command, void 0, 1e3, "proof command");
  const url = normalizeBoundedString(record.url, void 0, 2e3, "proof URL");
  const note = normalizeBoundedString(record.note, void 0, 2e3, "proof note");
  return {
    id,
    status: normalizeProofStatus(record.status, "unknown"),
    createdAt,
    ...(label ? { label } : {}),
    ...(command ? { command } : {}),
    ...(url ? { url } : {}),
    ...(note ? { note } : {}),
  };
}
function normalizeArtifact(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id) ?? randomUUID();
  const createdAt = normalizeTimestamp(record.createdAt, Date.now());
  const label = normalizeBoundedString(record.label, void 0, 160, "artifact label");
  const url = normalizeBoundedString(record.url, void 0, 2e3, "artifact URL");
  const artifactPath = normalizeBoundedString(record.path, void 0, 2e3, "artifact path");
  const mimeType = normalizeBoundedString(record.mimeType, void 0, 160, "artifact MIME type");
  if (!url && !artifactPath) return null;
  return {
    id,
    createdAt,
    ...(label ? { label } : {}),
    ...(url ? { url } : {}),
    ...(artifactPath ? { path: artifactPath } : {}),
    ...(mimeType ? { mimeType } : {}),
  };
}
function normalizeAttachment(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id);
  const cardId = normalizeBoundedString(record.cardId, void 0, 120, "card id");
  const fileName = normalizeBoundedString(record.fileName, void 0, 240, "attachment file name");
  const createdAt = normalizeTimestamp(record.createdAt, 0);
  const byteSize =
    typeof record.byteSize === "number" && Number.isFinite(record.byteSize)
      ? Math.max(0, Math.trunc(record.byteSize))
      : 0;
  if (!id || !cardId || !fileName || !createdAt || byteSize <= 0) return null;
  const mimeType = normalizeBoundedString(record.mimeType, void 0, 160, "attachment MIME type");
  const note = normalizeBoundedString(record.note, void 0, 400, "attachment note");
  return {
    id,
    cardId,
    createdAt,
    fileName,
    byteSize,
    ...(mimeType ? { mimeType } : {}),
    ...(note ? { note } : {}),
  };
}
function normalizeWorkerLog(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id);
  const message = normalizeBoundedString(record.message, void 0, 800, "worker log message");
  const createdAt = normalizeTimestamp(record.createdAt, 0);
  if (!id || !message || !createdAt) return null;
  const level =
    record.level === "warning" || record.level === "error" || record.level === "info"
      ? record.level
      : "info";
  const sessionKey = normalizeBoundedString(record.sessionKey, void 0, 240, "session key");
  const runId = normalizeBoundedString(record.runId, void 0, 160, "run id");
  return {
    id,
    level,
    message,
    createdAt,
    ...(sessionKey ? { sessionKey } : {}),
    ...(runId ? { runId } : {}),
  };
}
function normalizeWorkerProtocol(value, fallback) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const record = value;
  const state =
    record.state === "idle" ||
    record.state === "running" ||
    record.state === "completed" ||
    record.state === "blocked" ||
    record.state === "violated"
      ? record.state
      : fallback?.state;
  if (!state) return;
  const updatedAt = normalizeTimestamp(record.updatedAt, fallback?.updatedAt ?? Date.now());
  const detail = normalizeBoundedString(record.detail, fallback?.detail, 800, "protocol detail");
  return {
    state,
    updatedAt,
    ...(detail ? { detail } : {}),
  };
}
function normalizeAttachmentInput(cardId, input, now) {
  const fileName = normalizeBoundedString(input.fileName, void 0, 240, "attachment file name");
  if (!fileName) throw new Error("attachment fileName is required.");
  const contentBase64 =
    typeof input.contentBase64 === "string" && input.contentBase64 ? input.contentBase64 : void 0;
  if (!contentBase64) throw new Error("attachment contentBase64 is required.");
  if (
    !/^[A-Za-z0-9+/]*={0,2}$/.test(contentBase64) ||
    contentBase64.length % 4 !== 0 ||
    contentBase64.length > Math.ceil(262144 / 3) * 4
  )
    throw new Error("attachment contentBase64 must be canonical base64.");
  const decoded = Buffer.from(contentBase64, "base64");
  if (decoded.toString("base64") !== contentBase64)
    throw new Error("attachment contentBase64 must be canonical base64.");
  const byteSize = decoded.length;
  if (byteSize <= 0 || byteSize > 262144)
    throw new Error(`attachment must be between 1 and ${MAX_ATTACHMENT_BYTES} bytes.`);
  const mimeType = normalizeBoundedString(input.mimeType, void 0, 160, "attachment MIME type");
  const note = normalizeBoundedString(input.note, void 0, 400, "attachment note");
  return {
    attachment: {
      id: randomUUID(),
      cardId,
      createdAt: now,
      fileName,
      byteSize,
      ...(mimeType ? { mimeType } : {}),
      ...(note ? { note } : {}),
    },
    contentBase64,
  };
}
function normalizeClaim(value, fallback) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fallback;
  const record = value;
  const ownerId = normalizeBoundedString(record.ownerId, fallback?.ownerId, 120, "claim owner");
  const token = normalizeBoundedString(record.token, fallback?.token, 160, "claim token");
  const claimedAt = normalizeTimestamp(record.claimedAt, fallback?.claimedAt ?? Date.now());
  const lastHeartbeatAt = normalizeTimestamp(
    record.lastHeartbeatAt,
    fallback?.lastHeartbeatAt ?? claimedAt,
  );
  const expiresAt = normalizeTimestamp(record.expiresAt, fallback?.expiresAt ?? 0);
  if (!ownerId || !token || !claimedAt || !lastHeartbeatAt) return;
  return {
    ownerId,
    token,
    claimedAt,
    lastHeartbeatAt,
    ...(expiresAt ? { expiresAt } : {}),
  };
}
function normalizeDiagnosticAction(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const kind =
    record.kind === "claim" ||
    record.kind === "unblock" ||
    record.kind === "reassign" ||
    record.kind === "add_proof" ||
    record.kind === "open_session"
      ? record.kind
      : void 0;
  const label = normalizeBoundedString(record.label, void 0, 120, "diagnostic action label");
  return kind && label
    ? {
        kind,
        label,
      }
    : null;
}
function normalizeDiagnostic(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const kind = WORKBOARD_DIAGNOSTIC_KINDS.includes(record.kind) ? record.kind : void 0;
  const severity = WORKBOARD_DIAGNOSTIC_SEVERITIES.includes(record.severity)
    ? record.severity
    : "warning";
  const title = normalizeBoundedString(record.title, void 0, 160, "diagnostic title");
  const detail = normalizeBoundedString(record.detail, void 0, 800, "diagnostic detail");
  const firstSeenAt = normalizeTimestamp(record.firstSeenAt, Date.now());
  const lastSeenAt = normalizeTimestamp(record.lastSeenAt, firstSeenAt);
  if (!kind || !title || !detail) return null;
  return {
    kind,
    severity,
    title,
    detail,
    firstSeenAt,
    lastSeenAt,
    count:
      typeof record.count === "number" && Number.isFinite(record.count)
        ? Math.max(1, Math.trunc(record.count))
        : 1,
    actions: Array.isArray(record.actions)
      ? record.actions
          .map(normalizeDiagnosticAction)
          .filter((action) => action !== null)
          .slice(0, 4)
      : [],
  };
}
function normalizeNotification(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value;
  const id = normalizeOptionalString(record.id) ?? randomUUID();
  const kind = WORKBOARD_NOTIFICATION_KINDS.includes(record.kind) ? record.kind : void 0;
  const createdAt = normalizeTimestamp(record.createdAt, Date.now());
  const sequence = normalizeTimestamp(record.sequence, 0) || void 0;
  const message = normalizeBoundedString(record.message, void 0, 240, "notification message");
  if (!kind || !message) return null;
  const sessionKey = normalizeBoundedString(record.sessionKey, void 0, 240, "session key");
  const runId = normalizeBoundedString(record.runId, void 0, 120, "run id");
  return {
    id,
    kind,
    createdAt,
    ...(sequence ? { sequence } : {}),
    message,
    ...(sessionKey ? { sessionKey } : {}),
    ...(runId ? { runId } : {}),
  };
}
function normalizeProofInput(input, now) {
  const label = normalizeBoundedString(input.label, void 0, 160, "proof label");
  const command = normalizeBoundedString(input.command, void 0, 1e3, "proof command");
  const url = normalizeBoundedString(input.url, void 0, 2e3, "proof URL");
  const note = normalizeBoundedString(input.note, void 0, 2e3, "proof note");
  return {
    id: randomUUID(),
    status: normalizeProofStatus(input.status, "unknown"),
    createdAt: now,
    ...(label ? { label } : {}),
    ...(command ? { command } : {}),
    ...(url ? { url } : {}),
    ...(note ? { note } : {}),
  };
}
function normalizeMetadata(value, fallback = {}, options = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return trimMetadataToBudget(fallback);
  const record = value;
  const stale =
    record.stale && typeof record.stale === "object" && !Array.isArray(record.stale)
      ? record.stale
      : null;
  const hasArchivedAt = Object.hasOwn(record, "archivedAt");
  const hasStale = Object.hasOwn(record, "stale");
  const hasLifecycleStatusSourceUpdatedAt = Object.hasOwn(record, "lifecycleStatusSourceUpdatedAt");
  const links = Array.isArray(record.links)
    ? record.links.map(normalizeLink).filter((link) => link !== null)
    : void 0;
  const normalizedLinks =
    links === void 0
      ? fallback.links
      : options.allowDependencyLinks === false
        ? (() => {
            const dependencyLinks = (fallback.links ?? []).filter(isDependencyLink);
            const ordinaryCapacity = Math.max(0, 50 - dependencyLinks.length);
            return [
              ...dependencyLinks.slice(-50),
              ...(ordinaryCapacity > 0
                ? links.filter((link) => !isDependencyLink(link)).slice(-ordinaryCapacity)
                : []),
            ];
          })()
        : links.slice(-50);
  return trimMetadataToBudget({
    attempts: Array.isArray(record.attempts)
      ? record.attempts
          .map(normalizeAttempt)
          .filter((attempt) => attempt !== null)
          .slice(-30)
      : fallback.attempts,
    comments: Array.isArray(record.comments)
      ? record.comments
          .map(normalizeComment)
          .filter((comment) => comment !== null)
          .slice(-50)
      : fallback.comments,
    links: normalizedLinks,
    proof: Array.isArray(record.proof)
      ? record.proof
          .map(normalizeProof)
          .filter((proof) => proof !== null)
          .slice(-40)
      : fallback.proof,
    artifacts: Array.isArray(record.artifacts)
      ? record.artifacts
          .map(normalizeArtifact)
          .filter((artifact) => artifact !== null)
          .slice(-40)
      : fallback.artifacts,
    attachments: Array.isArray(record.attachments)
      ? record.attachments
          .map(normalizeAttachment)
          .filter((attachment) => attachment !== null)
          .slice(-20)
      : fallback.attachments,
    workerLogs: Array.isArray(record.workerLogs)
      ? record.workerLogs
          .map(normalizeWorkerLog)
          .filter((log) => log !== null)
          .slice(-40)
      : fallback.workerLogs,
    workerProtocol: Object.hasOwn(record, "workerProtocol")
      ? normalizeWorkerProtocol(record.workerProtocol, fallback.workerProtocol)
      : fallback.workerProtocol,
    automation: Object.hasOwn(record, "automation")
      ? normalizeAutomation(record.automation, fallback.automation)
      : fallback.automation,
    claim: Object.hasOwn(record, "claim")
      ? record.claim
        ? normalizeClaim(record.claim, fallback.claim)
        : void 0
      : fallback.claim,
    diagnostics: Array.isArray(record.diagnostics)
      ? record.diagnostics
          .map(normalizeDiagnostic)
          .filter((diagnosticLocal) => diagnosticLocal !== null)
          .slice(-12)
      : fallback.diagnostics,
    notifications: Array.isArray(record.notifications)
      ? record.notifications
          .map(normalizeNotification)
          .filter((notification) => notification !== null)
          .slice(-20)
      : fallback.notifications,
    templateId: normalizeTemplateId(record.templateId) ?? fallback.templateId,
    archivedAt: hasArchivedAt
      ? normalizeTimestamp(record.archivedAt, 0) || void 0
      : fallback.archivedAt,
    stale: hasStale
      ? stale
        ? {
            detectedAt: normalizeTimestamp(stale.detectedAt, Date.now()),
            lastSessionUpdatedAt: normalizeTimestamp(stale.lastSessionUpdatedAt, 0) || void 0,
            reason:
              normalizeBoundedString(stale.reason, fallback.stale?.reason, 240, "stale reason") ??
              "Session has not reported recent activity.",
          }
        : void 0
      : fallback.stale,
    lifecycleStatusSourceUpdatedAt: hasLifecycleStatusSourceUpdatedAt
      ? normalizeTimestamp(record.lifecycleStatusSourceUpdatedAt, 0)
      : fallback.lifecycleStatusSourceUpdatedAt,
    failureCount:
      typeof record.failureCount === "number" && Number.isFinite(record.failureCount)
        ? Math.max(0, Math.trunc(record.failureCount))
        : fallback.failureCount,
  });
}
function normalizeExecution(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const record = value;
  const now = Date.now();
  const model = normalizeOptionalString(record.model);
  const id = normalizeOptionalString(record.id) ?? randomUUID();
  if (!model) return;
  const startedAt = normalizeTimestamp(record.startedAt, now);
  const updatedAt = normalizeTimestamp(record.updatedAt, startedAt);
  const sessionKey = normalizeOptionalString(record.sessionKey);
  const runId = normalizeOptionalString(record.runId);
  return {
    id,
    kind: "agent-session",
    engine: normalizeExecutionEngine(record.engine, "codex"),
    mode: normalizeExecutionMode(record.mode, "autonomous"),
    status: normalizeExecutionStatus(record.status, "idle"),
    model,
    startedAt,
    updatedAt,
    ...(sessionKey ? { sessionKey } : {}),
    ...(runId ? { runId } : {}),
  };
}
function syncExecutionSessionKey(execution, sessionKey) {
  if (!execution) return;
  return removeUndefinedExecutionFields({
    ...execution,
    sessionKey,
    updatedAt: Date.now(),
  });
}
function removeUndefinedExecutionFields(execution) {
  const next = { ...execution };
  if (next.sessionKey === void 0) delete next.sessionKey;
  if (next.runId === void 0) delete next.runId;
  return next;
}
function removeUndefinedAutomationFields(automation) {
  const next = { ...automation };
  for (const key of [
    "tenant",
    "boardId",
    "createdByCardId",
    "idempotencyKey",
    "skills",
    "workspace",
    "workspaceAccess",
    "maxRuntimeSeconds",
    "maxRetries",
    "scheduledAt",
    "summary",
    "createdCardIds",
    "dispatchCount",
    "lastDispatchAt",
  ]) {
    const value = next[key];
    if (
      value === void 0 ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && value !== null && Object.keys(value).length === 0)
    )
      delete next[key];
  }
  return next;
}
function removeUndefinedMetadataFields(metadata) {
  const next = { ...metadata };
  for (const key of [
    "attempts",
    "comments",
    "links",
    "proof",
    "artifacts",
    "attachments",
    "workerLogs",
    "workerProtocol",
    "automation",
    "claim",
    "diagnostics",
    "notifications",
    "templateId",
    "archivedAt",
    "stale",
    "lifecycleStatusSourceUpdatedAt",
    "failureCount",
  ]) {
    const value = next[key];
    if (
      value === void 0 ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "number" && value === 0 && key === "failureCount")
    )
      delete next[key];
  }
  return next;
}
function clearDiagnostics(metadata, kinds) {
  if (!metadata?.diagnostics) return metadata ?? {};
  return {
    ...metadata,
    diagnostics: metadata.diagnostics.filter((entry) => !kinds.includes(entry.kind)),
  };
}
function metadataIsEmpty(metadata) {
  return !metadata || Object.keys(metadata).length === 0;
}
function metadataByteSize(metadata) {
  return Buffer.byteLength(JSON.stringify(metadata), "utf8");
}
function dropFirst(items) {
  if (!items?.length) return;
  const next = items.slice(1);
  return next.length ? next : void 0;
}
function dropFirstNonDependencyLink(items) {
  if (!items?.length) return;
  const index = items.findIndex((link) => !isDependencyLink(link));
  if (index < 0) return items.slice();
  const next = items.filter((_, itemIndex) => itemIndex !== index);
  return next.length ? next : void 0;
}
function appendLinkPreservingDependencies(links, link) {
  const next = [...links, link];
  if (next.length <= 50) return next;
  const dropIndex = next.findIndex((entry) => !isDependencyLink(entry));
  if (dropIndex < 0 || dropIndex === next.length - 1) throw new Error("card link limit reached.");
  return next.filter((_, index) => index !== dropIndex);
}
function trimMetadataToBudget(metadata) {
  let next = removeUndefinedMetadataFields(metadata);
  while (metadataByteSize(next) > MAX_CARD_METADATA_BYTES) {
    const currentSize = metadataByteSize(next);
    if (next.attempts?.length)
      next = removeUndefinedMetadataFields({
        ...next,
        attempts: dropFirst(next.attempts),
      });
    else if (next.diagnostics?.length)
      next = removeUndefinedMetadataFields({
        ...next,
        diagnostics: dropFirst(next.diagnostics),
      });
    else if (next.notifications?.length)
      next = removeUndefinedMetadataFields({
        ...next,
        notifications: dropFirst(next.notifications),
      });
    else if (next.proof?.length)
      next = removeUndefinedMetadataFields({
        ...next,
        proof: dropFirst(next.proof),
      });
    else if (next.artifacts?.length)
      next = removeUndefinedMetadataFields({
        ...next,
        artifacts: dropFirst(next.artifacts),
      });
    else if (next.attachments?.length)
      next = removeUndefinedMetadataFields({
        ...next,
        attachments: dropFirst(next.attachments),
      });
    else if (next.workerLogs?.length)
      next = removeUndefinedMetadataFields({
        ...next,
        workerLogs: dropFirst(next.workerLogs),
      });
    else if (next.links?.length) {
      const links = dropFirstNonDependencyLink(next.links);
      if (links?.length === next.links.length)
        next = removeUndefinedMetadataFields({
          ...next,
          comments: dropFirst(next.comments),
        });
      else
        next = removeUndefinedMetadataFields({
          ...next,
          links,
        });
    } else if (next.comments?.length)
      next = removeUndefinedMetadataFields({
        ...next,
        comments: dropFirst(next.comments),
      });
    if (metadataByteSize(next) >= currentSize) break;
  }
  return next;
}
//#endregion
//#region extensions/workboard/src/store-card-helpers.ts
function compareCards(left, right) {
  if (left.status !== right.status)
    return WORKBOARD_STATUSES.indexOf(left.status) - WORKBOARD_STATUSES.indexOf(right.status);
  if (left.position !== right.position) return left.position - right.position;
  return left.createdAt - right.createdAt;
}
function cardSessionKey(card) {
  return card.sessionKey ?? card.execution?.sessionKey;
}
function cardRunId(card) {
  return card.runId ?? card.execution?.runId;
}
function executionAttemptStatus(execution) {
  if (execution.status === "running") return "running";
  if (execution.status === "blocked") return "blocked";
  if (execution.status === "done" || execution.status === "review") return "succeeded";
  return "stopped";
}
function syncExecutionAttemptMetadata(metadata, execution, now) {
  if (!execution) return metadata;
  const attemptStatus = executionAttemptStatus(execution);
  const attempts = [...(metadata.attempts ?? [])];
  const key = execution.runId ?? execution.sessionKey ?? execution.id;
  const existingIndex = attempts.findIndex(
    (attempt) =>
      (execution.runId && attempt.runId === execution.runId) ||
      (!execution.runId && attempt.id === key),
  );
  const existingAttempt = existingIndex >= 0 ? attempts[existingIndex] : void 0;
  const nextAttempt = {
    id: existingAttempt?.id ?? key,
    status: attemptStatus,
    startedAt: existingAttempt?.startedAt ?? execution.startedAt,
    engine: execution.engine,
    mode: execution.mode,
    model: execution.model,
    ...(execution.sessionKey ? { sessionKey: execution.sessionKey } : {}),
    ...(execution.runId ? { runId: execution.runId } : {}),
    ...(attemptStatus !== "running" && { endedAt: execution.updatedAt || now }),
    ...(attemptStatus !== "succeeded" && existingAttempt?.error
      ? { error: existingAttempt.error }
      : {}),
  };
  if (existingIndex >= 0) attempts[existingIndex] = nextAttempt;
  else attempts.push(nextAttempt);
  const previousFailed =
    existingAttempt?.status === "blocked" || existingAttempt?.status === "failed";
  const failureCount =
    attemptStatus === "blocked" || attemptStatus === "failed"
      ? previousFailed
        ? metadata.failureCount
        : (metadata.failureCount ?? 0) + 1
      : attemptStatus === "succeeded"
        ? 0
        : metadata.failureCount;
  return removeUndefinedMetadataFields({
    ...metadata,
    attempts: attempts.slice(-30),
    failureCount,
  });
}
function appendEvent(card, event, at = Date.now()) {
  return [
    ...normalizeEvents(card.events),
    {
      id: randomUUID(),
      at,
      ...event,
    },
  ].slice(-50);
}
function latestMetadataIdChanged(existing, next) {
  const latestId = next?.at(-1)?.id;
  return Boolean(latestId && latestId !== existing?.at(-1)?.id);
}
function lifecycleStatusSourceUpdatedAtFromPatch(metadata) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return;
  if (!Object.hasOwn(metadata, "lifecycleStatusSourceUpdatedAt")) return;
  return normalizeTimestamp(metadata.lifecycleStatusSourceUpdatedAt, 0);
}
function latestStatusTransitionAt(card) {
  for (let index = (card.events?.length ?? 0) - 1; index >= 0; index -= 1) {
    const event = card.events?.[index];
    if (
      (event?.kind === "moved" || event?.kind === "created") &&
      ((event.kind === "created" && card.status !== "todo") ||
        (event.kind === "moved" && event.fromStatus !== event.toStatus)) &&
      event.toStatus === card.status &&
      typeof event.at === "number" &&
      Number.isFinite(event.at)
    )
      return event.at;
  }
}
function shouldSkipPersistedLifecycleStatusUpdate(existing, sourceUpdatedAt) {
  const lifecycleStatusSourceUpdatedAt = existing.metadata?.lifecycleStatusSourceUpdatedAt;
  if (lifecycleStatusSourceUpdatedAt !== void 0)
    return sourceUpdatedAt < lifecycleStatusSourceUpdatedAt;
  const statusTransitionAt = latestStatusTransitionAt(existing);
  return statusTransitionAt !== void 0 && sourceUpdatedAt < statusTransitionAt;
}
function updateEvent(existing, next) {
  if (
    existing.metadata?.workerProtocol?.state !== next.metadata?.workerProtocol?.state &&
    next.metadata?.workerProtocol?.state === "violated"
  )
    return { kind: "protocol_violation" };
  if (existing.status !== next.status || existing.position !== next.position)
    return {
      kind: "moved",
      fromStatus: existing.status,
      toStatus: next.status,
    };
  if (cardSessionKey(existing) !== cardSessionKey(next))
    return {
      kind: "linked",
      ...(cardSessionKey(next) ? { sessionKey: cardSessionKey(next) } : {}),
    };
  if (existing.metadata?.claim?.token !== next.metadata?.claim?.token) return { kind: "claimed" };
  if (existing.metadata?.claim?.lastHeartbeatAt !== next.metadata?.claim?.lastHeartbeatAt)
    return { kind: "heartbeat" };
  if (
    existing.execution?.status !== next.execution?.status ||
    existing.execution?.engine !== next.execution?.engine ||
    cardRunId(existing) !== cardRunId(next)
  ) {
    const existingAttempts = existing.metadata?.attempts ?? [];
    const nextAttempts = next.metadata?.attempts ?? [];
    const latestAttempt = nextAttempts.at(-1);
    if (nextAttempts.length > existingAttempts.length)
      return {
        kind: "attempt_started",
        ...(latestAttempt?.sessionKey ? { sessionKey: latestAttempt.sessionKey } : {}),
        ...(latestAttempt?.runId ? { runId: latestAttempt.runId } : {}),
      };
    const previousAttempt = latestAttempt
      ? existingAttempts.find((attempt) => attempt.id === latestAttempt.id)
      : void 0;
    if (latestAttempt && previousAttempt?.status !== latestAttempt.status)
      return {
        kind: "attempt_updated",
        ...(latestAttempt.sessionKey ? { sessionKey: latestAttempt.sessionKey } : {}),
        ...(latestAttempt.runId ? { runId: latestAttempt.runId } : {}),
      };
    return {
      kind: "execution_updated",
      ...(cardSessionKey(next) ? { sessionKey: cardSessionKey(next) } : {}),
      ...(cardRunId(next) ? { runId: cardRunId(next) } : {}),
    };
  }
  if (
    (existing.metadata?.comments?.length ?? 0) !== (next.metadata?.comments?.length ?? 0) ||
    latestMetadataIdChanged(existing.metadata?.comments, next.metadata?.comments)
  )
    return { kind: "comment_added" };
  if (
    (existing.metadata?.links?.length ?? 0) !== (next.metadata?.links?.length ?? 0) ||
    latestMetadataIdChanged(existing.metadata?.links, next.metadata?.links)
  )
    return { kind: "link_added" };
  if (
    (existing.metadata?.proof?.length ?? 0) !== (next.metadata?.proof?.length ?? 0) ||
    latestMetadataIdChanged(existing.metadata?.proof, next.metadata?.proof)
  )
    return { kind: "proof_added" };
  if (
    (existing.metadata?.artifacts?.length ?? 0) !== (next.metadata?.artifacts?.length ?? 0) ||
    latestMetadataIdChanged(existing.metadata?.artifacts, next.metadata?.artifacts)
  )
    return { kind: "artifact_added" };
  if (
    (existing.metadata?.attachments?.length ?? 0) !== (next.metadata?.attachments?.length ?? 0) ||
    latestMetadataIdChanged(existing.metadata?.attachments, next.metadata?.attachments)
  )
    return (next.metadata?.attachments?.length ?? 0) > (existing.metadata?.attachments?.length ?? 0)
      ? { kind: "attachment_added" }
      : { kind: "edited" };
  if (existing.metadata?.workerProtocol?.state !== next.metadata?.workerProtocol?.state)
    return { kind: "orchestration" };
  if (
    (existing.metadata?.workerLogs?.length ?? 0) !== (next.metadata?.workerLogs?.length ?? 0) ||
    latestMetadataIdChanged(existing.metadata?.workerLogs, next.metadata?.workerLogs)
  )
    return { kind: "orchestration" };
  if ((existing.metadata?.diagnostics?.length ?? 0) !== (next.metadata?.diagnostics?.length ?? 0))
    return { kind: "diagnostic" };
  if (
    (existing.metadata?.notifications?.length ?? 0) !==
      (next.metadata?.notifications?.length ?? 0) ||
    latestMetadataIdChanged(existing.metadata?.notifications, next.metadata?.notifications)
  )
    return { kind: "notification" };
  if (
    existing.metadata?.automation?.dispatchCount !== next.metadata?.automation?.dispatchCount ||
    existing.metadata?.automation?.lastDispatchAt !== next.metadata?.automation?.lastDispatchAt
  )
    return { kind: "dispatch" };
  if (!existing.metadata?.archivedAt && next.metadata?.archivedAt) return { kind: "archived" };
  if (existing.metadata?.archivedAt && !next.metadata?.archivedAt) return { kind: "unarchived" };
  if (!existing.metadata?.stale && next.metadata?.stale) return { kind: "stale" };
  return { kind: "edited" };
}
function removeUndefinedCardFields(card) {
  const next = { ...card };
  for (const key of [
    "notes",
    "agentId",
    "sessionKey",
    "runId",
    "taskId",
    "sourceUrl",
    "execution",
    "startedAt",
    "completedAt",
    "metadata",
  ])
    if (next[key] === void 0) delete next[key];
  if (metadataIsEmpty(next.metadata)) delete next.metadata;
  return next;
}
function assertCanMutateClaimedCard(card, scope) {
  if (!scope) return;
  const claim = card.metadata?.claim;
  if (!claim) return;
  const ownerId = normalizeOptionalString(scope.ownerId);
  const token = normalizeOptionalString(scope.token);
  if (claim.ownerId !== ownerId && !safeEqualSecret(token, claim.token))
    throw new Error(`card is claimed by ${claim.ownerId}.`);
}
function retryBudgetExhausted(card) {
  const maxRetries = card.metadata?.automation?.maxRetries;
  return Boolean(maxRetries && (card.metadata?.failureCount ?? 0) > maxRetries);
}
function diagnostic(params, now) {
  return {
    ...params,
    firstSeenAt: now,
    lastSeenAt: now,
    count: 1,
  };
}
function mergeDiagnostics(previous, next) {
  const byKind = new Map(previous?.map((entry) => [entry.kind, entry]));
  return next.map((entry) => {
    const prior = byKind.get(entry.kind);
    return prior
      ? {
          ...entry,
          firstSeenAt: prior.firstSeenAt,
          count: prior.count + 1,
        }
      : entry;
  });
}
function computeCardDiagnostics(card, now) {
  const diagnostics = [];
  const lastHeartbeatAt =
    card.metadata?.claim?.lastHeartbeatAt ?? card.execution?.updatedAt ?? card.updatedAt;
  if (
    (card.status === "todo" || card.status === "backlog" || card.status === "ready") &&
    card.agentId &&
    now - card.updatedAt > 36e5
  )
    diagnostics.push(
      diagnostic(
        {
          kind: "stranded_ready",
          severity: "warning",
          title: "Assigned card is waiting",
          detail: "The card has an assigned agent but has not been claimed recently.",
          actions: [
            {
              kind: "claim",
              label: "Claim card",
            },
          ],
        },
        now,
      ),
    );
  if (card.status === "running" && now - lastHeartbeatAt > 12e5)
    diagnostics.push(
      diagnostic(
        {
          kind: "running_without_heartbeat",
          severity: "error",
          title: "Running card has no recent heartbeat",
          detail: "The linked run or claim has not reported recent activity.",
          actions: [
            {
              kind: "open_session",
              label: "Open session",
            },
            {
              kind: "reassign",
              label: "Reassign card",
            },
          ],
        },
        now,
      ),
    );
  if (card.status === "blocked" && now - card.updatedAt > 864e5)
    diagnostics.push(
      diagnostic(
        {
          kind: "blocked_too_long",
          severity: "warning",
          title: "Blocked card needs attention",
          detail: "The card has been blocked for more than a day.",
          actions: [
            {
              kind: "unblock",
              label: "Move to todo",
            },
          ],
        },
        now,
      ),
    );
  if ((card.metadata?.failureCount ?? 0) >= 2)
    diagnostics.push(
      diagnostic(
        {
          kind: "repeated_failures",
          severity: "error",
          title: "Repeated run failures",
          detail: "Multiple attempts failed or blocked on this card.",
          actions: [
            {
              kind: "reassign",
              label: "Reassign card",
            },
          ],
        },
        now,
      ),
    );
  if (
    card.status === "done" &&
    !(
      card.metadata?.proof?.length ||
      card.metadata?.artifacts?.length ||
      card.metadata?.attachments?.length
    )
  )
    diagnostics.push(
      diagnostic(
        {
          kind: "missing_proof",
          severity: "warning",
          title: "Done card has no proof",
          detail: "The card is marked done without proof or an attached artifact.",
          actions: [
            {
              kind: "add_proof",
              label: "Add proof",
            },
          ],
        },
        now,
      ),
    );
  if (card.sessionKey && !card.execution && card.status === "running")
    diagnostics.push(
      diagnostic(
        {
          kind: "orphaned_session",
          severity: "warning",
          title: "Running card has only a loose session link",
          detail: "The card is running but has no execution record for lifecycle handoff.",
          actions: [
            {
              kind: "open_session",
              label: "Open session",
            },
          ],
        },
        now,
      ),
    );
  return diagnostics;
}
function capText(value, max) {
  if (!value) return;
  return value.length <= max ? value : `${truncateUtf16Safe(value, Math.max(0, max - 1))}…`;
}
function cardBoardId$1(card) {
  return card.metadata?.automation?.boardId ?? "default";
}
function cardResultSummary(card) {
  return (
    card.metadata?.automation?.summary ??
    card.metadata?.comments?.findLast((comment) => comment.body.trim())?.body ??
    card.metadata?.proof?.findLast((proof) => proof.note?.trim())?.note
  );
}
function buildWorkerContext(card, cards = []) {
  const lines = [
    `# Workboard card ${card.id}`,
    `Title: ${card.title}`,
    `Status: ${card.status}`,
    `Priority: ${card.priority}`,
    `Board: ${cardBoardId$1(card)}`,
    `Agent: ${card.agentId ?? "(default)"}`,
  ];
  if (card.notes) lines.push("", "## Notes", capText(card.notes, 4e3) ?? "");
  const attempts = card.metadata?.attempts?.slice(-8) ?? [];
  if (attempts.length) {
    lines.push("", "## Recent attempts");
    for (const attempt of attempts)
      lines.push(
        `- ${attempt.status} ${attempt.model ?? ""} ${attempt.error ? `error=${capText(attempt.error, 240)}` : ""}`.trim(),
      );
  }
  const comments = card.metadata?.comments?.slice(-12) ?? [];
  if (comments.length) {
    lines.push("", "## Recent comments");
    for (const comment of comments) lines.push(`- ${capText(comment.body, 400)}`);
  }
  const proof = card.metadata?.proof?.slice(-8) ?? [];
  if (proof.length) {
    lines.push("", "## Proof");
    for (const entry of proof)
      lines.push(
        `- ${entry.status}: ${capText(entry.label ?? entry.command ?? entry.url ?? entry.note, 400)}`,
      );
  }
  const artifacts = card.metadata?.artifacts?.slice(-8) ?? [];
  if (artifacts.length) {
    lines.push("", "## Artifacts");
    for (const artifact of artifacts)
      lines.push(`- ${capText(artifact.label ?? artifact.url ?? artifact.path, 400)}`);
  }
  const attachments = card.metadata?.attachments?.slice(-8) ?? [];
  if (attachments.length) {
    lines.push("", "## Attachments");
    for (const attachment of attachments) {
      const detail = [
        attachment.fileName,
        `${attachment.byteSize} bytes`,
        attachment.mimeType,
        attachment.note,
      ]
        .filter(Boolean)
        .join(" · ");
      lines.push(`- ${capText(detail, 500)}`);
    }
  }
  if (card.metadata?.workerProtocol) {
    const protocol = card.metadata.workerProtocol;
    lines.push("", "## Worker protocol");
    lines.push(`${protocol.state}: ${capText(protocol.detail, 500) ?? "no detail"}`);
  }
  const workerLogs = card.metadata?.workerLogs?.slice(-8) ?? [];
  if (workerLogs.length) {
    lines.push("", "## Worker logs");
    for (const log of workerLogs) lines.push(`- ${log.level}: ${capText(log.message, 500)}`);
  }
  const links = card.metadata?.links?.slice(-8) ?? [];
  if (links.length) {
    lines.push("", "## Links");
    for (const link of links)
      lines.push(`- ${link.type}: ${link.title ?? link.url ?? link.targetCardId ?? ""}`);
  }
  const cardsById = new Map(cards.map((entry) => [entry.id, entry]));
  const parentResults = cardParentIds(card)
    .map((parentId) => cardsById.get(parentId))
    .filter((parent) => parent !== void 0 && parent.status === "done")
    .slice(-6);
  if (parentResults.length) {
    lines.push("", "## Parent results");
    for (const parent of parentResults)
      lines.push(
        `- ${parent.id} ${parent.title}: ${capText(cardResultSummary(parent), 500) ?? "done"}`,
      );
  }
  const recentAgentWork =
    card.agentId && cards.length
      ? cards
          .filter(
            (entry) =>
              entry.id !== card.id &&
              cardBoardId$1(entry) === cardBoardId$1(card) &&
              entry.agentId === card.agentId &&
              entry.status === "done",
          )
          .toSorted((a, b) => b.updatedAt - a.updatedAt)
          .slice(0, 5)
      : [];
  if (recentAgentWork.length) {
    lines.push("", `## Recent done work by ${card.agentId}`);
    for (const entry of recentAgentWork)
      lines.push(
        `- ${entry.id} ${entry.title}: ${capText(cardResultSummary(entry), 300) ?? "done"}`,
      );
  }
  const automation = card.metadata?.automation;
  if (automation) {
    lines.push("", "## Automation");
    if (automation.tenant) lines.push(`Tenant: ${automation.tenant}`);
    if (automation.boardId) lines.push(`Board: ${automation.boardId}`);
    if (automation.skills?.length) lines.push(`Skills: ${automation.skills.join(", ")}`);
    if (automation.workspace)
      lines.push(
        `Workspace: ${automation.workspace.kind}${automation.workspace.path ? ` ${automation.workspace.path}` : ""}`,
      );
    if (automation.summary) lines.push(`Summary: ${capText(automation.summary, 400)}`);
  }
  const diagnostics = computeCardDiagnostics(card, Date.now());
  if (diagnostics.length) {
    lines.push("", "## Active diagnostics");
    for (const entry of diagnostics) lines.push(`- ${entry.severity}: ${entry.title}`);
  }
  return lines.join("\n");
}
function cardParentIds(card) {
  return (card.metadata?.links ?? [])
    .filter((link) => link.type === "parent" && link.targetCardId)
    .map((link) => link.targetCardId)
    .filter((id, index, ids) => ids.indexOf(id) === index);
}
function cardChildIds(card) {
  return (card.metadata?.links ?? [])
    .filter((link) => link.type === "child" && link.targetCardId)
    .map((link) => link.targetCardId)
    .filter((id, index, ids) => ids.indexOf(id) === index);
}
function latestRunningAttempt(card) {
  return card.metadata?.attempts?.findLast((attempt) => attempt.status === "running");
}
function isDependencyPromotableStatus(status) {
  return (
    status === "backlog" ||
    status === "triage" ||
    status === "todo" ||
    status === "scheduled" ||
    status === "ready"
  );
}
function isActiveDependencyTarget(card, options = {}) {
  return (
    Boolean(card.metadata?.claim) ||
    card.execution?.status === "running" ||
    Boolean(latestRunningAttempt(card)) ||
    (!options.allowStatusOnly && (card.status === "running" || card.status === "review"))
  );
}
function closeRunningAttempts(attempts, now, status, reason) {
  if (!attempts?.some((attempt) => attempt.status === "running")) return attempts;
  return attempts.map((attempt) =>
    attempt.status === "running"
      ? {
          ...attempt,
          status,
          endedAt: now,
          ...(reason ? { error: reason } : {}),
        }
      : attempt,
  );
}
function notificationSequence(event) {
  return typeof event.sequence === "number" && Number.isFinite(event.sequence)
    ? Math.trunc(event.sequence)
    : void 0;
}
function compareNotifications(a, b) {
  if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
  const aSequence = notificationSequence(a);
  const bSequence = notificationSequence(b);
  if (aSequence !== void 0 && bSequence !== void 0)
    return aSequence - bSequence || a.id.localeCompare(b.id);
  if (aSequence !== void 0) return -1;
  if (bSequence !== void 0) return 1;
  return a.id.localeCompare(b.id);
}
//#endregion
//#region extensions/workboard/src/store-automation.ts
function normalizeTrustedWorkspaceAccess(value, fallback) {
  if (value === void 0) return fallback;
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("workspace access must be an object.");
  const record = value;
  if (record.unrestricted === true) return { unrestricted: true };
  if (record.unrestricted !== false || !Array.isArray(record.roots))
    throw new Error("restricted workspace access requires roots.");
  if (typeof record.writable !== "boolean")
    throw new Error("restricted workspace access requires a writable flag.");
  const roots = Array.from(
    new Set(
      record.roots.map((entry) => {
        const root = normalizeBoundedString(entry, void 0, 2e3, "workspace access root");
        if (!root || !isAbsoluteWorkspacePath(root))
          throw new Error("workspace access roots must be absolute.");
        return root;
      }),
    ),
  );
  if (roots.length === 0)
    throw new Error("restricted workspace access requires at least one root.");
  return {
    unrestricted: false,
    roots,
    writable: record.writable,
  };
}
function normalizeCardAutomation(input) {
  const workspaceAccess = normalizeTrustedWorkspaceAccess(input.workspaceAccess);
  return normalizeAutomation(
    {
      tenant: input.tenant,
      boardId: input.boardId,
      createdByCardId: input.createdByCardId,
      idempotencyKey: input.idempotencyKey,
      skills: input.skills,
      workspace: input.workspace,
      maxRuntimeSeconds: input.maxRuntimeSeconds,
      maxRetries: input.maxRetries,
      scheduledAt: input.scheduledAt,
    },
    workspaceAccess ? { workspaceAccess } : void 0,
  );
}
function normalizeAutomationPatch(patch, current) {
  const workspaceAccess = Object.hasOwn(patch, "workspaceAccess")
    ? normalizeTrustedWorkspaceAccess(patch.workspaceAccess, current?.workspaceAccess)
    : current?.workspaceAccess;
  return normalizeAutomation(patch, {
    ...current,
    ...(workspaceAccess ? { workspaceAccess } : {}),
  });
}
//#endregion
//#region extensions/workboard/src/store-core.ts
var WorkboardCoreStore = class {
  constructor(store, stores = {}) {
    this.store = store;
    this.mutationQueue = Promise.resolve();
    this.lastNotificationSequence = 0;
    this.boardStore = stores.boards ?? store;
    this.subscriptionStore = stores.subscriptions ?? store;
    this.attachmentStore = stores.attachments ?? store;
  }
  async enqueueMutation(run) {
    const result = this.mutationQueue.then(run, run);
    this.mutationQueue = result.then(
      () => void 0,
      () => void 0,
    );
    return await result;
  }
  async updateMetadata(id, mutate) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      return await this.updateCard(id, { metadata: mutate(existing) });
    });
  }
  async deleteDetachedAttachments(existing, next) {
    const nextIds = new Set(next.metadata?.attachments?.map((attachment) => attachment.id) ?? []);
    for (const attachment of existing.metadata?.attachments ?? [])
      if (!nextIds.has(attachment.id)) await this.attachmentStore.delete(attachment.id);
  }
  nextNotificationSequence(now) {
    const base = Math.max(0, Math.trunc(now)) * 1e3;
    this.lastNotificationSequence = Math.max(this.lastNotificationSequence + 1, base);
    return this.lastNotificationSequence;
  }
  async list(options = {}) {
    const boardId = normalizeBoardId(options.boardId);
    return (await this.store.entries())
      .map((entry) => entry.value)
      .filter((entry) => entry?.version === 1 && Boolean(entry.card?.id))
      .map((entry) => entry.card)
      .filter((card) => !boardId || cardBoardId$1(card) === boardId)
      .toSorted(compareCards);
  }
  async listBoards() {
    const boards = /* @__PURE__ */ new Map();
    for (const entry of await this.boardStore.entries()) {
      if (entry.value?.version !== 1 || !entry.value.board?.id) continue;
      const board = entry.value.board;
      boards.set(board.id, {
        id: board.id,
        ...(board.name ? { name: board.name } : {}),
        ...(board.description ? { description: board.description } : {}),
        ...(board.icon ? { icon: board.icon } : {}),
        ...(board.color ? { color: board.color } : {}),
        ...(board.defaultWorkspace ? { defaultWorkspace: board.defaultWorkspace } : {}),
        ...(board.orchestration ? { orchestration: board.orchestration } : {}),
        total: 0,
        active: 0,
        archived: 0,
        byStatus: {},
        updatedAt: board.updatedAt,
        ...(board.archivedAt ? { archivedAt: board.archivedAt } : {}),
      });
    }
    if (!boards.has("default"))
      boards.set("default", {
        id: "default",
        total: 0,
        active: 0,
        archived: 0,
        byStatus: {},
      });
    for (const card of await this.list()) {
      const boardId = cardBoardId$1(card);
      const summary = boards.get(boardId) ?? {
        id: boardId,
        total: 0,
        active: 0,
        archived: 0,
        byStatus: {},
      };
      summary.total += 1;
      if (card.metadata?.archivedAt) summary.archived += 1;
      else summary.active += 1;
      summary.byStatus[card.status] = (summary.byStatus[card.status] ?? 0) + 1;
      summary.updatedAt = Math.max(summary.updatedAt ?? 0, card.updatedAt);
      boards.set(boardId, summary);
    }
    return {
      boards: [...boards.values()].toSorted((a, b) =>
        a.id === "default" ? -1 : b.id === "default" ? 1 : a.id.localeCompare(b.id),
      ),
    };
  }
  async upsertBoard(input) {
    return await this.enqueueMutation(async () => {
      const id = normalizeBoardIdRequired(input.id);
      const existing = await this.boardStore.lookup(id);
      const board = normalizeBoardMetadata(
        {
          ...input,
          id,
        },
        existing?.board,
      );
      await this.boardStore.register(id, {
        version: 1,
        board,
      });
      return board;
    });
  }
  async archiveBoard(id, archived = true) {
    return await this.upsertBoard({
      id,
      archived,
    });
  }
  async deleteBoard(id) {
    return await this.enqueueMutation(async () => {
      const boardId = normalizeBoardIdRequired(id);
      if (boardId === "default") throw new Error("default board cannot be deleted.");
      if ((await this.list({ boardId })).length > 0)
        throw new Error("board still has cards; archive it or move/delete the cards first.");
      for (const entry of await this.subscriptionStore.entries())
        if (entry.value?.version === 1 && entry.value.subscription?.boardId === boardId)
          await this.subscriptionStore.delete(entry.key);
      return { deleted: await this.boardStore.delete(boardId) };
    });
  }
  async stats(input = {}, now = Date.now()) {
    const cards = await this.list(input);
    const boardId = normalizeBoardId(input.boardId) ?? "all";
    const byStatus = {};
    const byAgent = Object.create(null);
    let oldestReadyAt;
    let updatedAt;
    let archived = 0;
    for (const card of cards) {
      byStatus[card.status] = (byStatus[card.status] ?? 0) + 1;
      byAgent[card.agentId ?? "(default)"] = (byAgent[card.agentId ?? "(default)"] ?? 0) + 1;
      if (card.metadata?.archivedAt) archived += 1;
      if (card.status === "ready")
        oldestReadyAt = Math.min(oldestReadyAt ?? card.updatedAt, card.updatedAt);
      updatedAt = Math.max(updatedAt ?? 0, card.updatedAt);
    }
    return {
      id: boardId,
      total: cards.length,
      active: cards.length - archived,
      archived,
      byStatus,
      byAgent,
      ...(oldestReadyAt ? { oldestReadyAgeMs: Math.max(0, now - oldestReadyAt) } : {}),
      ...(updatedAt ? { updatedAt } : {}),
    };
  }
  async get(id) {
    const entry = await this.store.lookup(id.trim());
    return entry?.version === 1 ? entry.card : void 0;
  }
  async removeReferencesToCard(cardId) {
    for (const card of await this.list()) {
      const links = card.metadata?.links;
      if (!links?.some((link) => link.targetCardId === cardId)) continue;
      await this.updateCard(card.id, {
        metadata: {
          ...card.metadata,
          links: links.filter((link) => link.targetCardId !== cardId),
        },
      });
    }
  }
  async create(input, scope) {
    return await this.enqueueMutation(async () => await this.createDirect(input, scope));
  }
  async createDirect(input, scope) {
    const now = Date.now();
    const requestedStatus = normalizeStatus(input.status, "todo");
    const cards = await this.list();
    const parents = normalizeStringList(input.parents, "parents", 120);
    const automation = normalizeCardAutomation(input);
    const heldBySchedule =
      Boolean(automation?.scheduledAt && automation.scheduledAt > now) &&
      requestedStatus !== "blocked";
    let status = heldBySchedule ? "scheduled" : requestedStatus;
    let heldByDependencies = false;
    if (parents.length > 0 && (status === "running" || status === "review")) {
      status = "todo";
      heldByDependencies = true;
    }
    if (automation?.idempotencyKey) {
      const existing = cards.find(
        (card) =>
          card.metadata?.automation?.idempotencyKey === automation.idempotencyKey &&
          card.metadata?.automation?.tenant === automation.tenant &&
          cardBoardId$1(card) === (automation.boardId ?? "default"),
      );
      if (existing) return existing;
    }
    const cardsById = new Map(cards.map((card) => [card.id, card]));
    const parentCards = parents.map((parentId) => {
      const parent = cardsById.get(parentId);
      if (!parent) throw new Error(`card not found: ${parentId}`);
      return parent;
    });
    const childAutomation = normalizeAutomation(
      {
        ...automation,
        createdByCardId:
          automation?.createdByCardId ?? (parents.length === 1 ? parents[0] : void 0),
      },
      automation,
    );
    const normalizedPosition = normalizePosition(input.position, NaN);
    const notes = normalizeNotes(input.notes);
    const agentId = normalizeOptionalString(input.agentId);
    const sessionKey = normalizeOptionalString(input.sessionKey);
    const runId = normalizeOptionalString(input.runId);
    const taskId = normalizeOptionalString(input.taskId);
    const sourceUrl = normalizeOptionalString(input.sourceUrl);
    const normalizedExecution = normalizeExecution(input.execution);
    const execution =
      normalizedExecution?.status === "running" && (heldBySchedule || heldByDependencies)
        ? void 0
        : normalizedExecution;
    const startedAt =
      input.startedAt === void 0
        ? status === "running"
          ? now
          : void 0
        : normalizeTimestamp(input.startedAt, 0) || void 0;
    const completedAt =
      input.completedAt === void 0
        ? status === "done"
          ? now
          : void 0
        : normalizeTimestamp(input.completedAt, 0) || void 0;
    const syncedMetadata = trimMetadataToBudget(
      syncExecutionAttemptMetadata(
        normalizeMetadata(
          input.metadata,
          {
            templateId: normalizeTemplateId(input.templateId),
            ...(childAutomation ? { automation: childAutomation } : {}),
          },
          { allowDependencyLinks: false },
        ),
        execution,
        now,
      ),
    );
    const boardId = syncedMetadata.automation?.boardId ?? "default";
    const position = Number.isFinite(normalizedPosition)
      ? normalizedPosition
      : Math.max(
          0,
          ...cards
            .filter((card) => card.status === status && cardBoardId$1(card) === boardId)
            .map((card) => card.position),
        ) + POSITION_STEP;
    let card = {
      id: randomUUID(),
      title: normalizeTitle(input.title),
      status,
      priority: normalizePriority(input.priority, "normal"),
      labels: normalizeLabels(input.labels),
      position,
      createdAt: now,
      updatedAt: now,
      events: [
        {
          id: randomUUID(),
          kind: "created",
          at: now,
          toStatus: status,
          ...(sessionKey ? { sessionKey } : {}),
          ...(runId ? { runId } : {}),
        },
      ],
      ...(notes ? { notes } : {}),
      ...(agentId ? { agentId } : {}),
      ...(sessionKey ? { sessionKey } : {}),
      ...(runId ? { runId } : {}),
      ...(taskId ? { taskId } : {}),
      ...(sourceUrl ? { sourceUrl } : {}),
      ...(execution ? { execution } : {}),
      ...(startedAt ? { startedAt } : {}),
      ...(completedAt ? { completedAt } : {}),
      ...(!metadataIsEmpty(syncedMetadata) ? { metadata: syncedMetadata } : {}),
    };
    await this.store.register(card.id, {
      version: 1,
      card,
    });
    try {
      for (const parent of parentCards)
        card = await this.linkCardsDirect(parent.id, card.id, now, {
          allowStatusOnlyActiveChild: true,
          scope,
        });
    } catch (error) {
      await this.store.delete(card.id);
      await this.removeReferencesToCard(card.id);
      throw error;
    }
    return card;
  }
  async update(id, patch) {
    return await this.enqueueMutation(
      async () =>
        await this.updateCard(id, patch, {
          allowMetadataDependencyLinks: false,
          enforceStatusHolds: true,
        }),
    );
  }
  async updateCard(id, patch, options = {}) {
    const existing = await this.get(id);
    if (!existing) throw new Error(`card not found: ${id}`);
    const lifecycleStatusSourceUpdatedAt = lifecycleStatusSourceUpdatedAtFromPatch(patch.metadata);
    const existingLifecycleStatusSourceUpdatedAt =
      existing.metadata?.lifecycleStatusSourceUpdatedAt;
    const hasFreshLifecycleStatusSource =
      lifecycleStatusSourceUpdatedAt !== void 0 &&
      lifecycleStatusSourceUpdatedAt !== existingLifecycleStatusSourceUpdatedAt;
    let effectivePatch = patch;
    if (
      patch.status !== void 0 &&
      lifecycleStatusSourceUpdatedAt !== void 0 &&
      shouldSkipPersistedLifecycleStatusUpdate(existing, lifecycleStatusSourceUpdatedAt)
    ) {
      effectivePatch = {
        ...patch,
        status: void 0,
      };
      if (patch.metadata && typeof patch.metadata === "object" && !Array.isArray(patch.metadata)) {
        const { lifecycleStatusSourceUpdatedAt: _ignored, ...rest } = patch.metadata;
        effectivePatch.metadata = Object.keys(rest).length > 0 ? rest : void 0;
      }
      if (
        !Object.entries(effectivePatch).some(
          ([key, value]) => key !== "status" && key !== "metadata" && value !== void 0,
        ) &&
        effectivePatch.metadata === void 0
      )
        return existing;
    }
    const status = normalizeStatus(effectivePatch.status, existing.status);
    const now = Date.now();
    const startedAt =
      effectivePatch.startedAt === void 0
        ? status === "running"
          ? (existing.startedAt ?? now)
          : existing.startedAt
        : normalizeTimestamp(effectivePatch.startedAt, 0) || void 0;
    const completedAt =
      effectivePatch.completedAt === void 0
        ? status === "done"
          ? (existing.completedAt ?? now)
          : void 0
        : normalizeTimestamp(effectivePatch.completedAt, 0) || void 0;
    const sessionKey =
      effectivePatch.sessionKey === void 0
        ? existing.sessionKey
        : normalizeOptionalString(effectivePatch.sessionKey);
    const execution =
      effectivePatch.execution === void 0
        ? effectivePatch.sessionKey === void 0
          ? existing.execution
          : syncExecutionSessionKey(existing.execution, sessionKey)
        : normalizeExecution(effectivePatch.execution);
    let metadata = normalizeMetadata(effectivePatch.metadata, existing.metadata, {
      allowDependencyLinks: options.allowMetadataDependencyLinks !== false,
    });
    if (status !== existing.status && !hasFreshLifecycleStatusSource)
      metadata = {
        ...metadata,
        lifecycleStatusSourceUpdatedAt: void 0,
      };
    const automationPatch = {};
    for (const key of [
      "tenant",
      "boardId",
      "createdByCardId",
      "idempotencyKey",
      "skills",
      "workspace",
      "workspaceAccess",
      "maxRuntimeSeconds",
      "maxRetries",
      "scheduledAt",
    ])
      if (Object.hasOwn(effectivePatch, key) && effectivePatch[key] !== void 0)
        automationPatch[key] = effectivePatch[key];
    if (Object.keys(automationPatch).length > 0)
      metadata = trimMetadataToBudget({
        ...metadata,
        automation: normalizeAutomationPatch(automationPatch, metadata.automation),
      });
    const next = removeUndefinedCardFields({
      ...existing,
      title:
        effectivePatch.title === void 0 ? existing.title : normalizeTitle(effectivePatch.title),
      notes:
        effectivePatch.notes === void 0 ? existing.notes : normalizeNotes(effectivePatch.notes),
      status,
      priority:
        effectivePatch.priority === void 0
          ? existing.priority
          : normalizePriority(effectivePatch.priority, existing.priority),
      labels:
        effectivePatch.labels === void 0 ? existing.labels : normalizeLabels(effectivePatch.labels),
      agentId:
        effectivePatch.agentId === void 0
          ? existing.agentId
          : normalizeOptionalString(effectivePatch.agentId),
      sessionKey,
      runId:
        effectivePatch.runId === void 0
          ? existing.runId
          : normalizeOptionalString(effectivePatch.runId),
      taskId:
        effectivePatch.taskId === void 0
          ? existing.taskId
          : normalizeOptionalString(effectivePatch.taskId),
      sourceUrl:
        effectivePatch.sourceUrl === void 0
          ? existing.sourceUrl
          : normalizeOptionalString(effectivePatch.sourceUrl),
      execution,
      metadata:
        effectivePatch.templateId === void 0
          ? metadata
          : {
              ...metadata,
              templateId: normalizeTemplateId(effectivePatch.templateId),
            },
      position:
        effectivePatch.position === void 0
          ? existing.position
          : normalizePosition(effectivePatch.position, existing.position),
      updatedAt: now,
      ...(startedAt ? { startedAt } : {}),
      ...(completedAt ? { completedAt } : {}),
    });
    next.metadata = trimMetadataToBudget(
      syncExecutionAttemptMetadata(next.metadata ?? {}, execution, now),
    );
    next.events = appendEvent(next, updateEvent(existing, next), now);
    if (options.enforceStatusHolds && effectivePatch.status !== void 0)
      await this.assertActiveStatusAllowed(existing, next, now);
    if (status !== "done") delete next.completedAt;
    if (effectivePatch.startedAt !== void 0 && !startedAt) delete next.startedAt;
    if (effectivePatch.completedAt !== void 0 && !completedAt) delete next.completedAt;
    if (metadataIsEmpty(next.metadata)) delete next.metadata;
    await this.store.register(next.id, {
      version: 1,
      card: next,
    });
    await this.deleteDetachedAttachments(existing, next);
    return next;
  }
  async assertActiveStatusAllowed(existing, next, now) {
    if (
      next.status !== "ready" &&
      next.status !== "running" &&
      next.status !== "review" &&
      next.status !== "done"
    )
      return;
    const parents = cardParentIds(next);
    const cards =
      parents.length > 0 ? new Map((await this.list()).map((card) => [card.id, card])) : void 0;
    if (parents.length > 0 && !parents.every((parentId) => cards?.get(parentId)?.status === "done"))
      throw new Error("card dependencies are not done.");
    if (next.status === "done") return;
    const scheduledAt = next.metadata?.automation?.scheduledAt;
    if ((scheduledAt && scheduledAt > now) || (existing.status === "scheduled" && !scheduledAt))
      throw new Error("card is scheduled for later.");
  }
  async delete(id) {
    return await this.enqueueMutation(async () => await this.deleteDirect(id));
  }
  async deleteDirect(id) {
    const cardId = id.trim();
    if (!(await this.store.delete(cardId))) return { deleted: false };
    for (const entry of await this.subscriptionStore.entries())
      if (entry.value?.version === 1 && entry.value.subscription?.cardId === cardId)
        await this.subscriptionStore.delete(entry.key);
    for (const entry of await this.attachmentStore.entries())
      if (entry.value?.version === 1 && entry.value.attachment?.cardId === cardId)
        await this.attachmentStore.delete(entry.key);
    await this.removeReferencesToCard(cardId);
    return { deleted: true };
  }
  async addComment(id, input, scope) {
    const now = Date.now();
    const body = normalizeBoundedString(input.body, void 0, 2e3, "comment body");
    if (!body) throw new Error("comment body is required.");
    const comment = {
      id: randomUUID(),
      body,
      createdAt: now,
    };
    return await this.updateMetadata(id, (existing) => {
      assertCanMutateClaimedCard(existing, scope);
      return {
        ...existing.metadata,
        comments: [...(existing.metadata?.comments ?? []), comment].slice(-50),
      };
    });
  }
  async addLink(id, input) {
    const now = Date.now();
    const targetCardId = normalizeBoundedString(input.targetCardId, void 0, 120, "link target");
    const url = normalizeBoundedString(input.url, void 0, 2e3, "link URL");
    const title = normalizeBoundedString(input.title, void 0, 180, "link title");
    if (!targetCardId && !url) throw new Error("link targetCardId or url is required.");
    const type = normalizeLinkType(input.type, "relates_to");
    if (type === "parent" || type === "child")
      throw new Error("parent and child dependency links must use linkDependency.");
    const link = {
      id: randomUUID(),
      type,
      createdAt: now,
      ...(targetCardId ? { targetCardId } : {}),
      ...(title ? { title } : {}),
      ...(url ? { url } : {}),
    };
    return await this.updateMetadata(id, (existing) => ({
      ...existing.metadata,
      links: appendLinkPreservingDependencies(existing.metadata?.links ?? [], link),
    }));
  }
  async linkCards(parentId, childId, scope) {
    return await this.enqueueMutation(
      async () => await this.linkCardsDirect(parentId, childId, Date.now(), { scope }),
    );
  }
  async linkCardsDirect(parentId, childId, now = Date.now(), options = {}) {
    if (parentId.trim() === childId.trim()) throw new Error("parent and child cards must differ.");
    const parent = await this.get(parentId);
    const child = await this.get(childId);
    if (!parent) throw new Error(`card not found: ${parentId}`);
    if (!child) throw new Error(`card not found: ${childId}`);
    assertCanMutateClaimedCard(parent, options.scope);
    assertCanMutateClaimedCard(child, options.scope);
    if (child.status === "done" || child.status === "blocked") {
      const cardsById = new Map((await this.list()).map((card) => [card.id, card]));
      if (
        [...cardParentIds(child), parent.id]
          .filter((id, index, ids) => ids.indexOf(id) === index)
          .some((id) => cardsById.get(id)?.status !== "done")
      )
        throw new Error("terminal child cards cannot gain incomplete parent dependencies.");
    }
    if (isActiveDependencyTarget(child, { allowStatusOnly: options.allowStatusOnlyActiveChild }))
      throw new Error("active child cards cannot gain parent dependencies.");
    if (await this.dependsOn(parent.id, child.id))
      throw new Error("dependency link would create a cycle.");
    const parentLinks = parent.metadata?.links ?? [];
    const childLinks = child.metadata?.links ?? [];
    const nextParentLinks = parentLinks.some(
      (link) => link.type === "child" && link.targetCardId === child.id,
    )
      ? parentLinks
      : appendLinkPreservingDependencies(parentLinks, {
          id: randomUUID(),
          type: "child",
          targetCardId: child.id,
          createdAt: now,
        });
    const nextChildLinks = childLinks.some(
      (link) => link.type === "parent" && link.targetCardId === parent.id,
    )
      ? childLinks
      : appendLinkPreservingDependencies(childLinks, {
          id: randomUUID(),
          type: "parent",
          targetCardId: parent.id,
          createdAt: now,
        });
    await this.updateCard(parent.id, {
      metadata: {
        ...parent.metadata,
        links: nextParentLinks,
      },
    });
    const nextChild = await this.updateCard(child.id, {
      metadata: {
        ...child.metadata,
        links: nextChildLinks,
      },
    });
    return await this.promoteDependencyReady(nextChild.id);
  }
  async dependencyTargetStatus(card, now) {
    const scheduledAt = card.metadata?.automation?.scheduledAt;
    const parents = cardParentIds(card);
    if (card.status === "scheduled" && !scheduledAt) return "scheduled";
    if (parents.length === 0) {
      if (scheduledAt && scheduledAt > now && isDependencyPromotableStatus(card.status))
        return "scheduled";
      return card.status === "scheduled" ? "ready" : card.status;
    }
    const parentsDone = (await Promise.all(parents.map((parentId) => this.get(parentId)))).every(
      (parent) => parent?.status === "done",
    );
    if (
      !parentsDone &&
      scheduledAt &&
      scheduledAt > now &&
      isDependencyPromotableStatus(card.status)
    )
      return "scheduled";
    if (!parentsDone && isDependencyPromotableStatus(card.status)) return "todo";
    if (
      parentsDone &&
      scheduledAt &&
      scheduledAt > now &&
      isDependencyPromotableStatus(card.status)
    )
      return "scheduled";
    return parentsDone && isDependencyPromotableStatus(card.status) ? "ready" : card.status;
  }
  async dependsOn(cardId, targetParentId) {
    const cards = new Map((await this.list()).map((entry) => [entry.id, entry]));
    const seen = /* @__PURE__ */ new Set();
    const visit = (id) => {
      if (id === targetParentId) return true;
      if (seen.has(id)) return false;
      seen.add(id);
      const card = cards.get(id);
      return Boolean(card && cardParentIds(card).some(visit));
    };
    return visit(cardId);
  }
  async recordDispatch(card, now) {
    const metadata = trimMetadataToBudget(
      normalizeMetadata(
        {
          ...card.metadata,
          automation: normalizeAutomation(
            {
              ...card.metadata?.automation,
              dispatchCount: (card.metadata?.automation?.dispatchCount ?? 0) + 1,
              lastDispatchAt: now,
            },
            card.metadata?.automation,
          ),
        },
        card.metadata,
      ),
    );
    const next = removeUndefinedCardFields({
      ...card,
      ...(!metadataIsEmpty(metadata) ? { metadata } : { metadata: void 0 }),
      events: appendEvent(card, { kind: "dispatch" }, now),
    });
    await this.store.register(card.id, {
      version: 1,
      card: next,
    });
    return next;
  }
  async recordOrchestrationCandidate(card, now) {
    const metadata = trimMetadataToBudget({
      ...card.metadata,
      workerLogs: [
        ...(card.metadata?.workerLogs ?? []),
        {
          id: randomUUID(),
          level: "info",
          message: "Auto orchestration marked this triage card for specification or decomposition.",
          createdAt: now,
        },
      ].slice(-40),
      workerProtocol: {
        state: "idle",
        updatedAt: now,
        detail: "Awaiting workboard_specify or workboard_decompose.",
      },
    });
    const next = removeUndefinedCardFields({
      ...card,
      ...(!metadataIsEmpty(metadata) ? { metadata } : { metadata: void 0 }),
      events: appendEvent(card, { kind: "orchestration" }, now),
    });
    await this.store.register(card.id, {
      version: 1,
      card: next,
    });
    return next;
  }
  async shouldAutoOrchestrate(card) {
    if (
      card.status !== "triage" ||
      card.metadata?.archivedAt ||
      card.metadata?.workerProtocol?.state === "idle"
    )
      return false;
    const board = await this.boardStore.lookup(cardBoardId$1(card));
    return board?.version === 1 && board.board.orchestration?.autoDecompose === true;
  }
  async promoteDependencyReady(id, now = Date.now()) {
    const card = await this.get(id);
    if (!card) throw new Error(`card not found: ${id}`);
    const target = await this.dependencyTargetStatus(card, now);
    if (target === card.status) return card;
    return await this.updateCard(card.id, { status: target });
  }
  async promoteReady(now = Date.now()) {
    return await this.enqueueMutation(async () => {
      const promoted = [];
      for (const card of await this.list()) {
        const next = await this.promoteDependencyReady(card.id, now);
        if (next.status !== card.status) promoted.push(next);
      }
      return {
        cards: promoted,
        count: promoted.length,
      };
    });
  }
};
//#endregion
//#region extensions/workboard/src/store-enrichment.ts
var WorkboardEnrichmentStore = class extends WorkboardCoreStore {
  async addProof(id, input, scope) {
    const proof = normalizeProofInput(input, Date.now());
    return await this.updateMetadata(id, (existing) => {
      assertCanMutateClaimedCard(existing, scope);
      const metadata = clearDiagnostics(existing.metadata, ["missing_proof"]);
      return {
        ...metadata,
        proof: [...(metadata.proof ?? []), proof].slice(-40),
      };
    });
  }
  async addProofWithArtifact(id, proofInput, artifactInput, scope) {
    const now = Date.now();
    const proof = normalizeProofInput(proofInput, now);
    const artifact = normalizeArtifact({
      ...artifactInput,
      createdAt: now,
    });
    if (!artifact) throw new Error("artifact url or path is required.");
    return await this.updateMetadata(id, (existing) => {
      assertCanMutateClaimedCard(existing, scope);
      const metadata = clearDiagnostics(existing.metadata, ["missing_proof"]);
      return {
        ...metadata,
        proof: [...(metadata.proof ?? []), proof].slice(-40),
        artifacts: [...(metadata.artifacts ?? []), artifact].slice(-40),
      };
    });
  }
  async addArtifact(id, input, scope) {
    const artifact = normalizeArtifact({
      ...input,
      createdAt: Date.now(),
    });
    if (!artifact) throw new Error("artifact url or path is required.");
    return await this.updateMetadata(id, (existing) => {
      assertCanMutateClaimedCard(existing, scope);
      const metadata = clearDiagnostics(existing.metadata, ["missing_proof"]);
      return {
        ...metadata,
        artifacts: [...(metadata.artifacts ?? []), artifact].slice(-40),
      };
    });
  }
  async addAttachment(id, input, scope) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(existing, scope);
      const { attachment, contentBase64 } = normalizeAttachmentInput(id, input, Date.now());
      await this.attachmentStore.register(attachment.id, {
        version: 1,
        attachment,
        contentBase64,
      });
      try {
        const updated = await this.updateCard(id, {
          metadata: {
            ...clearDiagnostics(existing.metadata, ["missing_proof"]),
            attachments: [...(existing.metadata?.attachments ?? []), attachment].slice(-20),
          },
        });
        if (!updated.metadata?.attachments?.some((entry) => entry.id === attachment.id)) {
          await this.attachmentStore.delete(attachment.id);
          throw new Error("attachment metadata was trimmed before it could be indexed.");
        }
        return updated;
      } catch (error) {
        await this.attachmentStore.delete(attachment.id);
        throw error;
      }
    });
  }
  async listAttachments(id) {
    const card = await this.get(id);
    if (!card) throw new Error(`card not found: ${id}`);
    return {
      card,
      attachments: card.metadata?.attachments ?? [],
    };
  }
  async getAttachment(id) {
    const attachmentId = id.trim();
    const entry = await this.attachmentStore.lookup(attachmentId);
    return entry?.version === 1 ? entry : void 0;
  }
  async deleteAttachment(cardId, attachmentId, scope) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(cardId);
      if (!existing) throw new Error(`card not found: ${cardId}`);
      assertCanMutateClaimedCard(existing, scope);
      const attachments = existing.metadata?.attachments ?? [];
      if (!attachments.some((attachment) => attachment.id === attachmentId))
        throw new Error(`attachment not found: ${attachmentId}`);
      await this.attachmentStore.delete(attachmentId);
      return await this.updateCard(cardId, {
        metadata: {
          ...existing.metadata,
          attachments: attachments.filter((attachment) => attachment.id !== attachmentId),
        },
      });
    });
  }
  async addWorkerLog(id, input, scope) {
    const now = Date.now();
    const message = normalizeBoundedString(input.message, void 0, 800, "worker log message");
    if (!message) throw new Error("worker log message is required.");
    const level =
      input.level === "warning" || input.level === "error" || input.level === "info"
        ? input.level
        : "info";
    const sessionKey = normalizeBoundedString(input.sessionKey, void 0, 240, "session key");
    const runId = normalizeBoundedString(input.runId, void 0, 160, "run id");
    const log = {
      id: randomUUID(),
      level,
      message,
      createdAt: now,
      ...(sessionKey ? { sessionKey } : {}),
      ...(runId ? { runId } : {}),
    };
    return await this.updateMetadata(id, (existing) => {
      assertCanMutateClaimedCard(existing, scope);
      return {
        ...existing.metadata,
        workerLogs: [...(existing.metadata?.workerLogs ?? []), log].slice(-40),
      };
    });
  }
  async recordProtocolViolation(id, input = {}, scope) {
    return await this.enqueueMutation(async () => {
      const card = await this.get(id);
      if (!card) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(card, scope);
      const now = Date.now();
      const detail =
        normalizeBoundedString(input.detail, void 0, 800, "protocol violation detail") ??
        "Worker stopped without completing or blocking the card.";
      const sessionKey = normalizeBoundedString(input.sessionKey, void 0, 240, "session key");
      const runId = normalizeBoundedString(input.runId, void 0, 160, "run id");
      const log = {
        id: randomUUID(),
        level: "error",
        message: detail,
        createdAt: now,
        ...(sessionKey ? { sessionKey } : {}),
        ...(runId ? { runId } : {}),
      };
      const execution =
        card.execution?.status === "running"
          ? {
              ...card.execution,
              status: "blocked",
              updatedAt: now,
            }
          : card.execution;
      const attempts = closeRunningAttempts(card.metadata?.attempts, now, "blocked", detail);
      const notification = {
        id: randomUUID(),
        kind: "failed",
        createdAt: now,
        sequence: this.nextNotificationSequence(now),
        message: capText(detail, 240) ?? "Worker protocol violation.",
        ...(sessionKey || cardSessionKey(card)
          ? { sessionKey: sessionKey ?? cardSessionKey(card) }
          : {}),
        ...(runId || cardRunId(card) ? { runId: runId ?? cardRunId(card) } : {}),
      };
      return await this.updateCard(card.id, {
        status: card.status === "done" ? card.status : "blocked",
        ...(execution ? { execution } : {}),
        metadata: {
          ...card.metadata,
          workerLogs: [...(card.metadata?.workerLogs ?? []), log].slice(-40),
          workerProtocol: {
            state: "violated",
            updatedAt: now,
            detail,
          },
          claim: void 0,
          ...(attempts ? { attempts } : {}),
          failureCount: (card.metadata?.failureCount ?? 0) + 1,
          notifications: [...(card.metadata?.notifications ?? []), notification].slice(-20),
        },
      });
    });
  }
};
//#endregion
//#region extensions/workboard/src/store-promote.ts
var WorkboardPromoteStore = class extends WorkboardEnrichmentStore {
  async move(id, status, position, scope) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(existing, scope);
      return await this.updateCard(
        id,
        {
          status,
          position,
        },
        {
          allowMetadataDependencyLinks: false,
          enforceStatusHolds: true,
        },
      );
    });
  }
  async promote(id, input = {}, scope) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
      const reason = normalizeBoundedString(input.reason, void 0, 1e3, "promote reason");
      const comments = reason
        ? [
            ...(existing.metadata?.comments ?? []),
            {
              id: randomUUID(),
              body: reason,
              createdAt: Date.now(),
            },
          ].slice(-50)
        : existing.metadata?.comments;
      return await this.updateCard(
        id,
        {
          status: "ready",
          metadata: {
            ...clearDiagnostics(existing.metadata, ["stranded_ready", "blocked_too_long"]),
            comments,
            stale: null,
          },
        },
        { enforceStatusHolds: input.force !== true },
      );
    });
  }
};
//#endregion
//#region extensions/workboard/src/store-workflow.ts
function assertClaimIdentity(claim, input) {
  const token = normalizeOptionalString(input.token);
  const ownerId = normalizeOptionalString(input.ownerId);
  if (token && !safeEqualSecret(token, claim.token)) throw new Error("claim token does not match.");
  if (!token && ownerId && ownerId !== claim.ownerId)
    throw new Error("claim owner does not match.");
}
var WorkboardWorkflowStore = class extends WorkboardPromoteStore {
  async claim(id, input, options = {}) {
    const ownerId = normalizeBoundedString(input.ownerId, void 0, 120, "claim owner");
    if (!ownerId) throw new Error("claim ownerId is required.");
    const ttlSeconds =
      typeof input.ttlSeconds === "number" && Number.isFinite(input.ttlSeconds)
        ? Math.max(1, Math.trunc(input.ttlSeconds))
        : void 0;
    const token = normalizeBoundedString(input.token, void 0, 160, "claim token") ?? randomUUID();
    return await this.enqueueMutation(async () => {
      const now = Date.now();
      const expiresAt = addWorkboardDurationMs(
        now,
        ttlSeconds ? secondsToDurationMs(ttlSeconds) : DEFAULT_CLAIM_TTL_MS,
      );
      const guarded = await this.promoteDependencyReady(id, now);
      const expectedAuthority = options.expectedAuthority;
      if (
        expectedAuthority &&
        (guarded.agentId !== expectedAuthority.agentId ||
          !isDeepStrictEqual(
            guarded.metadata?.automation?.workspace,
            expectedAuthority.workspace,
          ) ||
          !isDeepStrictEqual(
            guarded.metadata?.automation?.workspaceAccess,
            expectedAuthority.workspaceAccess,
          ))
      )
        throw new Error("card workspace authority changed before claim.");
      const existingClaim = guarded.metadata?.claim;
      const activeClaim =
        existingClaim && isFutureDateTimestampMs(existingClaim.expiresAt, { nowMs: now })
          ? existingClaim
          : void 0;
      if (cardParentIds(guarded).length > 0 && guarded.status !== "ready" && !activeClaim)
        throw new Error("card dependencies are not done.");
      if (guarded.status === "scheduled") throw new Error("card is scheduled for later.");
      if (retryBudgetExhausted(guarded)) throw new Error("card exhausted its retry budget.");
      if (activeClaim) throw new Error(`card already claimed by ${activeClaim.ownerId}.`);
      const metadata = clearDiagnostics(
        (options.adoptWorkspaceAccess && !guarded.metadata?.automation?.workspaceAccess
          ? await this.updateCard(id, { workspaceAccess: options.adoptWorkspaceAccess })
          : guarded
        ).metadata,
        ["stranded_ready"],
      );
      const card = await this.updateCard(id, {
        metadata: {
          ...metadata,
          claim: {
            ownerId,
            token,
            claimedAt: now,
            lastHeartbeatAt: now,
            expiresAt,
          },
        },
      });
      return {
        card: await this.updateCard(card.id, {
          status:
            card.status === "backlog" || card.status === "todo" || card.status === "ready"
              ? "running"
              : card.status,
          agentId: card.agentId ?? ownerId,
        }),
        token,
      };
    });
  }
  async heartbeat(id, input) {
    const note = normalizeBoundedString(input.note, void 0, 400, "heartbeat note");
    return await this.updateMetadata(id, (existing) => {
      const claim = existing.metadata?.claim;
      if (!claim) throw new Error("card is not claimed.");
      const now = Math.max(Date.now(), claim.lastHeartbeatAt + 1);
      assertClaimIdentity(claim, input);
      const nextClaim = {
        ...claim,
        lastHeartbeatAt: now,
        expiresAt: claim.expiresAt
          ? addWorkboardDurationMs(
              now,
              Math.max(
                1,
                claim.expiresAt > claim.claimedAt
                  ? claim.expiresAt - claim.lastHeartbeatAt
                  : DEFAULT_CLAIM_TTL_MS,
              ),
            )
          : void 0,
      };
      const metadata = clearDiagnostics(existing.metadata, ["running_without_heartbeat"]);
      return {
        ...metadata,
        claim: removeUndefinedMetadataFields({ claim: nextClaim }).claim,
        comments: note
          ? [
              ...(metadata.comments ?? []),
              {
                id: randomUUID(),
                body: note,
                createdAt: now,
              },
            ].slice(-50)
          : metadata.comments,
      };
    });
  }
  async releaseClaim(id, input = {}) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      const status =
        input.status === void 0 ? existing.status : normalizeStatus(input.status, existing.status);
      const claim = existing.metadata?.claim;
      if (claim) assertClaimIdentity(claim, input);
      return await this.updateCard(
        id,
        {
          status,
          metadata: {
            ...existing.metadata,
            claim: void 0,
          },
        },
        { enforceStatusHolds: input.status !== void 0 },
      );
    });
  }
  async complete(id, input = {}, scope = input) {
    return await this.enqueueMutation(async () => await this.completeDirect(id, input, scope));
  }
  async completeDirect(id, input = {}, scope = input) {
    const existing = await this.get(id);
    if (!existing) throw new Error(`card not found: ${id}`);
    assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
    const now = Date.now();
    const createdCardIds = normalizeStringList(input.createdCardIds, "created card ids", 120);
    const childIds = cardChildIds(existing);
    for (const createdCardId of createdCardIds) {
      const createdCard = await this.get(createdCardId);
      if (!createdCard) throw new Error(`created card not found: ${createdCardId}`);
      if (!(childIds.includes(createdCardId) && cardParentIds(createdCard).includes(existing.id)))
        throw new Error(`created card is not linked to this card: ${createdCardId}`);
    }
    const summary = normalizeBoundedString(input.summary, void 0, 2e3, "summary");
    const proofInput =
      input.proof && typeof input.proof === "object" && !Array.isArray(input.proof)
        ? input.proof
        : void 0;
    const proof = proofInput ? normalizeProofInput(proofInput, now) : void 0;
    const artifacts = Array.isArray(input.artifacts)
      ? input.artifacts
          .map((artifact) =>
            normalizeArtifact({
              ...artifact,
              createdAt: now,
            }),
          )
          .filter((artifact) => artifact !== null)
          .slice(-40)
      : [];
    const metadata = clearDiagnostics(existing.metadata, ["missing_proof"]);
    const notification = {
      id: randomUUID(),
      kind: "completed",
      createdAt: now,
      sequence: this.nextNotificationSequence(now),
      message: capText(summary, 240) ?? "Workboard card completed.",
      ...(cardSessionKey(existing) ? { sessionKey: cardSessionKey(existing) } : {}),
      ...(cardRunId(existing) ? { runId: cardRunId(existing) } : {}),
    };
    const execution =
      existing.execution?.status === "running"
        ? {
            ...existing.execution,
            status: "done",
            updatedAt: now,
          }
        : existing.execution;
    return await this.updateCard(
      id,
      {
        status: "done",
        ...(execution ? { execution } : {}),
        metadata: {
          ...metadata,
          claim: void 0,
          attempts: closeRunningAttempts(metadata.attempts, now, "succeeded"),
          failureCount: 0,
          automation: normalizeAutomation(
            {
              ...metadata.automation,
              summary,
              createdCardIds,
            },
            metadata.automation,
          ),
          comments: summary
            ? [
                ...(metadata.comments ?? []),
                {
                  id: randomUUID(),
                  body: summary,
                  createdAt: now,
                },
              ].slice(-50)
            : metadata.comments,
          proof: proof ? [...(metadata.proof ?? []), proof].slice(-40) : metadata.proof,
          artifacts: artifacts.length
            ? [...(metadata.artifacts ?? []), ...artifacts].slice(-40)
            : metadata.artifacts,
          notifications: [...(metadata.notifications ?? []), notification].slice(-20),
        },
      },
      { enforceStatusHolds: true },
    );
  }
  async block(id, input = {}, scope = input) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
      const now = Date.now();
      const reason =
        normalizeBoundedString(input.reason, void 0, 2e3, "block reason") ??
        "Workboard card blocked.";
      const metadata = existing.metadata ?? {};
      const notification = {
        id: randomUUID(),
        kind: "failed",
        createdAt: now,
        sequence: this.nextNotificationSequence(now),
        message: capText(reason, 240) ?? "Workboard card blocked.",
        ...(cardSessionKey(existing) ? { sessionKey: cardSessionKey(existing) } : {}),
        ...(cardRunId(existing) ? { runId: cardRunId(existing) } : {}),
      };
      const execution =
        existing.execution?.status === "running"
          ? {
              ...existing.execution,
              status: "blocked",
              updatedAt: now,
            }
          : existing.execution;
      return await this.updateCard(id, {
        status: "blocked",
        ...(execution ? { execution } : {}),
        metadata: {
          ...metadata,
          claim: void 0,
          attempts: closeRunningAttempts(metadata.attempts, now, "blocked", reason),
          failureCount: (metadata.failureCount ?? 0) + 1,
          comments: [
            ...(metadata.comments ?? []),
            {
              id: randomUUID(),
              body: reason,
              createdAt: now,
            },
          ].slice(-50),
          notifications: [...(metadata.notifications ?? []), notification].slice(-20),
        },
      });
    });
  }
  async unblock(id, scope) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(existing, scope);
      const metadata = clearDiagnostics(existing.metadata, ["blocked_too_long"]);
      return await this.updateCard(id, {
        status: "todo",
        metadata: {
          ...metadata,
          stale: null,
        },
      });
    });
  }
  async reassign(id, input = {}, scope) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
      const agentId =
        input.agentId === void 0 ? existing.agentId : normalizeOptionalString(input.agentId);
      const status =
        input.status === void 0 ? existing.status : normalizeStatus(input.status, existing.status);
      const reason = normalizeBoundedString(input.reason, void 0, 1e3, "reassign reason");
      const shouldResetFailures = input.resetFailures !== false;
      const baseMetadata = shouldResetFailures
        ? clearDiagnostics(existing.metadata, ["blocked_too_long", "repeated_failures"])
        : existing.metadata;
      const metadata = {
        ...baseMetadata,
        ...(shouldResetFailures ? { failureCount: 0 } : {}),
        comments: reason
          ? [
              ...(baseMetadata?.comments ?? []),
              {
                id: randomUUID(),
                body: reason,
                createdAt: Date.now(),
              },
            ].slice(-50)
          : baseMetadata?.comments,
      };
      return await this.updateCard(
        id,
        {
          agentId,
          status,
          metadata,
        },
        { enforceStatusHolds: true },
      );
    });
  }
  async reclaim(id, input = {}, scope) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
      const now = Date.now();
      const reason =
        normalizeBoundedString(input.reason, void 0, 1e3, "reclaim reason") ??
        "Workboard claim reclaimed.";
      const targetStatus =
        input.status === void 0
          ? existing.status === "running"
            ? "ready"
            : existing.status
          : normalizeStatus(input.status, existing.status);
      const reclaimed = await this.updateCard(
        id,
        {
          status: targetStatus,
          execution: existing.execution?.status === "running" ? null : existing.execution,
          metadata: {
            ...existing.metadata,
            claim: void 0,
            attempts: closeRunningAttempts(existing.metadata?.attempts, now, "stopped", reason),
            comments: [
              ...(existing.metadata?.comments ?? []),
              {
                id: randomUUID(),
                body: reason,
                createdAt: now,
              },
            ].slice(-50),
            stale: null,
          },
        },
        { enforceStatusHolds: true },
      );
      return await this.promoteDependencyReady(reclaimed.id, now);
    });
  }
  async runs(id) {
    const card = await this.get(id);
    if (!card) throw new Error(`card not found: ${id}`);
    return {
      card,
      attempts: card.metadata?.attempts ?? [],
    };
  }
  async specify(id, input = {}, scope) {
    return await this.enqueueMutation(async () => {
      const existing = await this.get(id);
      if (!existing) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(existing, scope === null ? void 0 : scope);
      if (
        existing.status !== "triage" &&
        existing.status !== "backlog" &&
        existing.status !== "todo"
      )
        throw new Error("only triage, backlog, or todo cards can be specified.");
      if (normalizeStatus(input.status, "todo") !== "todo")
        throw new Error("specified cards must move to todo.");
      const now = Date.now();
      const summary = normalizeBoundedString(input.summary, void 0, 2e3, "spec summary");
      const metadata = {
        ...existing.metadata,
        comments: summary
          ? [
              ...(existing.metadata?.comments ?? []),
              {
                id: randomUUID(),
                body: summary,
                createdAt: now,
              },
            ].slice(-50)
          : existing.metadata?.comments,
        automation: normalizeAutomation(
          {
            ...existing.metadata?.automation,
            summary: summary ?? existing.metadata?.automation?.summary,
          },
          existing.metadata?.automation,
        ),
      };
      const { summary: _summary, status: _status, ...cardPatch } = input;
      const updated = await this.updateCard(
        id,
        {
          ...cardPatch,
          status: "todo",
          metadata,
        },
        { enforceStatusHolds: true },
      );
      const specified = {
        ...updated,
        events: appendEvent(updated, { kind: "specified" }, now),
      };
      await this.store.register(specified.id, {
        version: 1,
        card: specified,
      });
      return specified;
    });
  }
  async decompose(id, input = {}, scope) {
    return await this.enqueueMutation(async () => {
      const parent = await this.get(id);
      if (!parent) throw new Error(`card not found: ${id}`);
      assertCanMutateClaimedCard(parent, scope === null ? void 0 : scope);
      const childrenInput = Array.isArray(input.children) ? input.children : [];
      if (childrenInput.length === 0) throw new Error("children are required.");
      if (childrenInput.length > 20) throw new Error("at most 20 children can be created at once.");
      const parentAutomation = parent.metadata?.automation;
      const existingCardIds = new Set((await this.list()).map((card) => card.id));
      const children = [];
      const reusedChildSnapshots = /* @__PURE__ */ new Map();
      try {
        for (const rawChild of childrenInput) {
          if (!rawChild || typeof rawChild !== "object" || Array.isArray(rawChild))
            throw new Error("children must be objects.");
          const child = rawChild;
          const created = await this.createDirect(
            {
              ...child,
              parents: [parent.id],
              boardId: child.boardId ?? parentAutomation?.boardId,
              tenant: child.tenant ?? parentAutomation?.tenant,
              createdByCardId: parent.id,
              idempotencyKey:
                child.idempotencyKey ??
                deriveChildIdempotencyKey(parentAutomation?.idempotencyKey, children.length + 1),
            },
            scope === null ? void 0 : scope,
          );
          if (existingCardIds.has(created.id) && !cardParentIds(created).includes(parent.id))
            reusedChildSnapshots.set(created.id, created);
          children.push(
            cardParentIds(created).includes(parent.id)
              ? created
              : await this.linkCardsDirect(parent.id, created.id, Date.now(), {
                  allowStatusOnlyActiveChild: true,
                  scope: scope === null ? void 0 : scope,
                }),
          );
        }
        const summary = normalizeBoundedString(input.summary, void 0, 2e3, "decompose summary");
        const updatedParent =
          input.completeParent !== false
            ? await this.completeDirect(
                parent.id,
                {
                  summary,
                  createdCardIds: children.map((child) => child.id),
                },
                scope,
              )
            : await (async () => {
                const latestParent = (await this.get(parent.id)) ?? parent;
                return await this.updateCard(
                  parent.id,
                  {
                    status:
                      latestParent.status === "triage" || latestParent.status === "backlog"
                        ? "todo"
                        : latestParent.status,
                    metadata: {
                      ...latestParent.metadata,
                      automation: normalizeAutomation(
                        {
                          ...latestParent.metadata?.automation,
                          summary,
                          createdCardIds: children.map((child) => child.id),
                        },
                        latestParent.metadata?.automation,
                      ),
                    },
                  },
                  { enforceStatusHolds: true },
                );
              })();
        const decomposedParent = {
          ...updatedParent,
          events: appendEvent(updatedParent, { kind: "decomposed" }),
        };
        await this.store.register(decomposedParent.id, {
          version: 1,
          card: decomposedParent,
        });
        return {
          parent: decomposedParent,
          children,
        };
      } catch (error) {
        for (const child of children.toReversed())
          if (!existingCardIds.has(child.id)) await this.deleteDirect(child.id);
        for (const child of reusedChildSnapshots.values())
          await this.store.register(child.id, {
            version: 1,
            card: child,
          });
        await this.store.register(parent.id, {
          version: 1,
          card: parent,
        });
        throw error;
      }
    });
  }
};
//#endregion
//#region extensions/workboard/src/store-notifications.ts
var WorkboardNotificationStore = class extends WorkboardWorkflowStore {
  async subscribeNotifications(input) {
    return await this.enqueueMutation(async () => {
      const subscription = normalizeNotificationSubscription(input);
      await this.subscriptionStore.register(subscription.id, {
        version: 1,
        subscription,
      });
      return subscription;
    });
  }
  async listNotificationSubscriptions(input = {}) {
    const boardId = normalizeBoardId(input.boardId);
    const cardId = normalizeBoundedString(input.cardId, void 0, 120, "card id");
    return {
      subscriptions: (await this.subscriptionStore.entries())
        .map((entry) => entry.value)
        .filter((entry) => entry?.version === 1 && Boolean(entry.subscription?.id))
        .map((entry) => entry.subscription)
        .filter((subscription) => !boardId || subscription.boardId === boardId)
        .filter((subscription) => !cardId || subscription.cardId === cardId)
        .toSorted((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)),
    };
  }
  async deleteNotificationSubscription(id) {
    return { deleted: await this.subscriptionStore.delete(id.trim()) };
  }
  async collectNotificationEvents(input = {}) {
    const subscriptionId = normalizeBoundedString(
      input.subscriptionId,
      void 0,
      120,
      "subscription id",
    );
    const boardId = normalizeBoardId(input.boardId);
    const cardId = normalizeBoundedString(input.cardId, void 0, 120, "card id");
    const limit =
      typeof input.limit === "number" && Number.isFinite(input.limit)
        ? Math.max(1, Math.min(200, Math.trunc(input.limit)))
        : 50;
    const subscriptionEntry = subscriptionId
      ? await this.subscriptionStore.lookup(subscriptionId)
      : void 0;
    if (subscriptionId && !subscriptionEntry?.subscription)
      throw new Error(`notification subscription not found: ${subscriptionId}`);
    const subscription = subscriptionEntry?.subscription;
    const effectiveCardId = subscription?.cardId ?? cardId;
    const effectiveBoardId = effectiveCardId ? void 0 : (subscription?.boardId ?? boardId);
    const effectiveSessionKey = subscription?.sessionKey;
    const effectiveRunId = subscription?.runId;
    const events = [];
    for (const card of await this.list({ boardId: effectiveBoardId })) {
      if (effectiveCardId && card.id !== effectiveCardId) continue;
      const stale = card.metadata?.stale;
      const notifications = [
        ...(card.metadata?.notifications ?? []),
        ...(stale
          ? [
              {
                id: `stale:${card.id}:${stale.detectedAt}`,
                kind: "stale",
                createdAt: stale.detectedAt,
                sequence: stale.detectedAt * 1e3,
                message: stale.reason,
                ...(cardSessionKey(card) ? { sessionKey: cardSessionKey(card) } : {}),
                ...(cardRunId(card) ? { runId: cardRunId(card) } : {}),
              },
            ]
          : []),
      ];
      for (const event of notifications) {
        const eventSessionKey = event.sessionKey ?? cardSessionKey(card);
        const eventRunId = event.runId ?? cardRunId(card);
        if (effectiveSessionKey && eventSessionKey !== effectiveSessionKey) continue;
        if (effectiveRunId && eventRunId !== effectiveRunId) continue;
        if (subscription?.eventKinds?.length && !subscription.eventKinds.includes(event.kind))
          continue;
        const eventSequence = notificationSequence(event);
        if (subscription?.lastEventSequence && eventSequence !== void 0) {
          if (
            eventSequence < subscription.lastEventSequence ||
            (eventSequence === subscription.lastEventSequence &&
              event.id <= (subscription.lastEventId ?? ""))
          )
            continue;
        } else if (
          subscription?.lastEventAt &&
          (event.createdAt < subscription.lastEventAt ||
            (event.createdAt === subscription.lastEventAt &&
              event.id <= (subscription.lastEventId ?? "")))
        )
          continue;
        events.push(event);
      }
    }
    const sorted = events.toSorted(compareNotifications).slice(0, limit);
    return {
      ...(subscription ? { subscription } : {}),
      events: sorted,
    };
  }
  async notificationEvents(input = {}) {
    return await this.collectNotificationEvents(input);
  }
  async advanceNotificationEvents(input = {}) {
    const subscriptionId = normalizeBoundedString(
      input.subscriptionId,
      void 0,
      120,
      "subscription id",
    );
    if (!subscriptionId)
      throw new Error("subscriptionId is required to advance notification events.");
    return await this.enqueueMutation(async () => {
      const result = await this.collectNotificationEvents({
        ...input,
        subscriptionId,
      });
      if (!result.subscription || !result.events.length) return result;
      const last = result.events.at(-1);
      const lastSequence = notificationSequence(last);
      const subscription = {
        ...result.subscription,
        lastEventAt: last.createdAt,
        lastEventId: last.id,
        ...(lastSequence !== void 0 ? { lastEventSequence: lastSequence } : {}),
        updatedAt: Date.now(),
      };
      delete subscription.deliveredEventIds;
      if (lastSequence === void 0) delete subscription.lastEventSequence;
      await this.subscriptionStore.register(subscription.id, {
        version: 1,
        subscription,
      });
      return {
        subscription,
        events: result.events,
      };
    });
  }
};
//#endregion
//#region extensions/workboard/src/store.ts
var WorkboardStore = class WorkboardStore extends WorkboardNotificationStore {
  async dispatch(input = Date.now()) {
    const now = typeof input === "number" ? input : normalizeTimestamp(input.now, Date.now());
    const boardId = typeof input === "number" ? void 0 : normalizeBoardId(input.boardId);
    return await this.enqueueMutation(async () => {
      const promoted = [];
      const reclaimed = [];
      const blocked = [];
      const orchestrated = [];
      const orchestratedByBoard = /* @__PURE__ */ new Map();
      for (const card of await this.list({ boardId })) {
        let latest = await this.promoteDependencyReady(card.id, now);
        const wasPromoted = latest.status !== card.status;
        const claim = latest.metadata?.claim;
        const latestAttempt = latestRunningAttempt(latest);
        const maxRuntimeSeconds = latest.metadata?.automation?.maxRuntimeSeconds;
        const runtimeStartedAt = latestAttempt?.startedAt ?? claim?.claimedAt ?? latest.startedAt;
        const timedOut =
          Boolean(maxRuntimeSeconds && runtimeStartedAt) &&
          now - runtimeStartedAt > secondsToDurationMs(maxRuntimeSeconds);
        const claimExpired = Boolean(claim?.expiresAt && now - claim.expiresAt > 3e5);
        const retriesExhausted = retryBudgetExhausted(latest);
        if (latest.status === "running" && (timedOut || claimExpired)) {
          const reason = timedOut
            ? "Run exceeded the card max runtime."
            : "Claim expired without a recent heartbeat.";
          const execution =
            latest.execution?.status === "running"
              ? {
                  ...latest.execution,
                  status: "blocked",
                  updatedAt: now,
                }
              : latest.execution;
          latest = await this.updateCard(latest.id, {
            status: "blocked",
            ...(execution ? { execution } : {}),
            metadata: {
              ...latest.metadata,
              claim: void 0,
              attempts: closeRunningAttempts(latest.metadata?.attempts, now, "blocked", reason),
              failureCount: (latest.metadata?.failureCount ?? 0) + 1,
              notifications: [
                ...(latest.metadata?.notifications ?? []),
                {
                  id: randomUUID(),
                  kind: "failed",
                  createdAt: now,
                  sequence: this.nextNotificationSequence(now),
                  message: reason,
                },
              ].slice(-20),
            },
          });
          blocked.push(latest);
        } else if (claimExpired) {
          latest = await this.updateCard(latest.id, {
            metadata: {
              ...latest.metadata,
              claim: void 0,
            },
          });
          reclaimed.push(latest);
        }
        if (
          !latest.metadata?.claim &&
          retriesExhausted &&
          isDependencyPromotableStatus(latest.status)
        ) {
          latest = await this.updateCard(latest.id, {
            status: "blocked",
            metadata: {
              ...latest.metadata,
              notifications: [
                ...(latest.metadata?.notifications ?? []),
                {
                  id: randomUUID(),
                  kind: "failed",
                  createdAt: now,
                  sequence: this.nextNotificationSequence(now),
                  message: "Card exhausted its retry budget.",
                },
              ].slice(-20),
            },
          });
          blocked.push(latest);
        }
        if (latest.status === "ready") latest = await this.recordDispatch(latest, now);
        if (await this.shouldAutoOrchestrate(latest)) {
          const latestBoardId = cardBoardId$1(latest);
          const cap =
            (await this.boardStore.lookup(latestBoardId))?.board.orchestration
              ?.autoDecomposePerDispatch ?? 3;
          const boardCount = orchestratedByBoard.get(latestBoardId) ?? 0;
          if (boardCount < cap) {
            latest = await this.recordOrchestrationCandidate(latest, now);
            orchestrated.push(latest);
            orchestratedByBoard.set(latestBoardId, boardCount + 1);
          }
        }
        if (wasPromoted && latest.status !== "blocked") promoted.push(latest);
      }
      return {
        promoted,
        reclaimed,
        blocked,
        orchestrated,
        count: promoted.length + reclaimed.length + blocked.length + orchestrated.length,
      };
    });
  }
  async bulkUpdate(input) {
    const ids = Array.isArray(input.ids)
      ? input.ids.filter((id) => typeof id === "string" && id.trim() !== "")
      : [];
    if (ids.length === 0) throw new Error("ids are required.");
    const patch =
      input.patch && typeof input.patch === "object" && !Array.isArray(input.patch)
        ? input.patch
        : {};
    const cards = [];
    for (const id of ids) {
      const updated =
        input.archived === void 0
          ? await this.update(id, patch)
          : await this.archive(id, input.archived);
      cards.push(updated);
    }
    return { cards };
  }
  async archive(id, archived) {
    const shouldArchive = archived !== false;
    return await this.updateMetadata(id, (existing) => ({
      ...existing.metadata,
      archivedAt: shouldArchive ? Date.now() : 0,
    }));
  }
  async exportCards() {
    const cards = await this.list();
    return {
      cards,
      attachments: cards.flatMap((card) => card.metadata?.attachments ?? []),
      exportedAt: Date.now(),
    };
  }
  async diagnostics(now = Date.now()) {
    const rows = (await this.list()).flatMap((card) => {
      const diagnostics = computeCardDiagnostics(card, now);
      return diagnostics.length
        ? [
            {
              card,
              diagnostics,
            },
          ]
        : [];
    });
    return {
      diagnostics: rows,
      count: rows.reduce((total, row) => total + row.diagnostics.length, 0),
    };
  }
  async refreshDiagnostics(now = Date.now()) {
    return await this.enqueueMutation(async () => {
      const cards = await this.list();
      const rows = [];
      for (const card of cards) {
        const latest = await this.get(card.id);
        if (!latest) continue;
        const diagnostics = mergeDiagnostics(
          latest.metadata?.diagnostics,
          computeCardDiagnostics(latest, now),
        );
        if (diagnostics.length === 0 && !latest.metadata?.diagnostics?.length) continue;
        const metadata = trimMetadataToBudget({
          ...latest.metadata,
          diagnostics,
        });
        const next = removeUndefinedCardFields({
          ...latest,
          metadata: metadataIsEmpty(metadata) ? void 0 : metadata,
        });
        await this.store.register(next.id, {
          version: 1,
          card: next,
        });
        if (diagnostics.length > 0)
          rows.push({
            card: next,
            diagnostics,
          });
      }
      return {
        diagnostics: rows,
        count: rows.reduce((total, row) => total + row.diagnostics.length, 0),
      };
    });
  }
  async buildWorkerContext(id) {
    const card = await this.get(id);
    if (!card) throw new Error(`card not found: ${id}`);
    return buildWorkerContext(card, await this.list());
  }
  static open(openKeyedStore) {
    return new WorkboardStore(
      openKeyedStore({
        namespace: "workboard.cards",
        maxEntries: MAX_CARDS,
      }),
      {
        boards: openKeyedStore({
          namespace: "workboard.boards",
          maxEntries: 200,
        }),
        subscriptions: openKeyedStore({
          namespace: "workboard.notify",
          maxEntries: 2e3,
        }),
        attachments: openKeyedStore({
          namespace: "workboard.attachments",
          maxEntries: MAX_ATTACHMENT_ENTRIES,
        }),
      },
    );
  }
  static openSqlite() {
    const stores = createWorkboardSqliteStores();
    return new WorkboardStore(stores.cards, {
      boards: stores.boards,
      subscriptions: stores.subscriptions,
      attachments: stores.attachments,
    });
  }
};
//#endregion
//#region extensions/workboard/src/dispatcher.ts
const DEFAULT_DISPATCH_MAX_STARTS = 3;
const DEFAULT_DISPATCH_OWNER = "workboard-dispatcher";
const DEFAULT_DISPATCH_MODEL = "default";
function normalizePositiveInteger(value, fallback) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(0, Math.trunc(value))
    : fallback;
}
function cardBoardId(card) {
  return card.metadata?.automation?.boardId ?? "default";
}
function sanitizeSessionSegment(value, fallback) {
  return (
    (value ?? fallback)
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || fallback
  ).slice(0, 96);
}
function cardIsArchived(card) {
  return Boolean(card.metadata?.archivedAt);
}
function buildSessionKey(card) {
  const suffix = `subagent:workboard-${sanitizeSessionSegment(cardBoardId(card), "default")}-${sanitizeSessionSegment(card.id, "card")}`;
  return card.agentId ? `agent:${sanitizeSessionSegment(card.agentId, "agent")}:${suffix}` : suffix;
}
function buildExecution(params) {
  return {
    id: params.card.execution?.id ?? `${params.card.id}:codex`,
    kind: "agent-session",
    engine: "codex",
    mode: "autonomous",
    status: "running",
    model: params.model,
    sessionKey: params.sessionKey,
    runId: params.runId,
    startedAt: params.now,
    updatedAt: params.now,
  };
}
async function materializeWorkspace(params) {
  const workspace = params.card.metadata?.automation?.workspace;
  if (!workspace || workspace.kind === "scratch") return {};
  const sourcePath = workspace.sourcePath ?? workspace.path;
  const sourceBranch = workspace.sourcePath ? workspace.sourceBranch : workspace.branch;
  if (!sourcePath || !path.isAbsolute(sourcePath))
    throw new Error("worktree workspace path must be an absolute git checkout path");
  const canonicalSourcePath = await assertWorkboardWorkspaceSourceAccess(
    workspace,
    params.workspaceAccess,
  );
  if (!canonicalSourcePath) throw new Error("worktree workspace path is required");
  if (workspace.kind === "dir" || !params.workspaceAccess.unrestricted) {
    await assertCanonicalWorkboardRootAccess(canonicalSourcePath, params.workspaceAccess);
    return workspace.kind === "worktree"
      ? {
          cwd: canonicalSourcePath,
          workspace: {
            kind: "dir",
            path: canonicalSourcePath,
          },
        }
      : { cwd: canonicalSourcePath };
  }
  if (!params.materializeWorktree)
    throw new Error("managed worktree materialization was not explicitly authorized");
  if (!params.worktrees) throw new Error("managed worktree runtime is unavailable");
  const worktree = await params.worktrees.create({
    repoRoot: canonicalSourcePath,
    name: managedWorktreeName(params.card.id),
    ...(sourceBranch ? { baseRef: sourceBranch } : {}),
    ownerKind: "workboard",
    ownerId: params.card.id,
  });
  let cwd;
  try {
    cwd = await canonicalPathFromExistingAncestor(worktree.path);
  } catch (error) {
    if (
      !(await params.worktrees
        .removeIfLossless({
          path: worktree.path,
          ownerKind: "workboard",
          ownerId: params.card.id,
        })
        .catch(() => false))
    )
      throw new Error(`${formatErrorMessage(error)}; managed worktree cleanup failed`, {
        cause: error,
      });
    throw error;
  }
  return {
    cwd,
    workspace: {
      kind: "worktree",
      path: worktree.path,
      branch: worktree.branch,
      sourcePath,
      ...(sourceBranch ? { sourceBranch } : {}),
    },
  };
}
function buildWorkerPrompt(params) {
  return [
    `Work on this OpenClaw Workboard card: ${params.card.title}`,
    "",
    "## Worker protocol",
    `Card id: ${params.card.id}`,
    `Claim ownerId: ${params.ownerId}`,
    `Claim token: ${params.token}`,
    "",
    "Heartbeat with workboard_heartbeat using the card id and token while working.",
    "When done, call workboard_complete with the card id, token, summary, and proof.",
    "If blocked, call workboard_block with the card id, token, and reason.",
    "",
    params.context,
  ].join("\n");
}
function sortReadyCards(a, b) {
  const priorityRank = {
    urgent: 0,
    high: 1,
    normal: 2,
    low: 3,
  };
  return (
    priorityRank[a.priority] - priorityRank[b.priority] ||
    a.position - b.position ||
    a.createdAt - b.createdAt
  );
}
function selectStartableCards(cards, limit, candidates = cards) {
  if (limit <= 0) return [];
  const runningByOwner = /* @__PURE__ */ new Map();
  for (const card of cards) {
    if (
      !(
        card.status === "running" ||
        Boolean(card.metadata?.claim) ||
        card.execution?.status === "running"
      ) ||
      cardIsArchived(card)
    )
      continue;
    const owner = card.agentId ?? DEFAULT_DISPATCH_OWNER;
    runningByOwner.set(owner, (runningByOwner.get(owner) ?? 0) + 1);
  }
  const selected = [];
  for (const card of candidates
    .filter((entry) => entry.status === "ready" && !entry.metadata?.claim && !cardIsArchived(entry))
    .toSorted(sortReadyCards)) {
    const owner = card.agentId ?? DEFAULT_DISPATCH_OWNER;
    if ((runningByOwner.get(owner) ?? 0) > 0) continue;
    selected.push(card);
    runningByOwner.set(owner, 1);
    if (selected.length >= limit) break;
  }
  return selected;
}
async function dispatchAndStartWorkboardCards(params) {
  const now = params.options?.now ?? Date.now();
  const boardId = params.options?.boardId;
  const dispatch = await params.store.dispatch({
    now,
    boardId,
  });
  const maxStarts = normalizePositiveInteger(
    params.options?.maxStarts,
    DEFAULT_DISPATCH_MAX_STARTS,
  );
  const started = [];
  const startFailures = [];
  const model = params.options?.model?.trim() || DEFAULT_DISPATCH_MODEL;
  const cards = await params.store.list();
  const candidates = await params.store.list({ boardId });
  for (const card of selectStartableCards(cards, maxStarts, candidates)) {
    const ownerId = params.options?.ownerId?.trim() || card.agentId || DEFAULT_DISPATCH_OWNER;
    const sessionKey = buildSessionKey(card);
    let claimValue = "";
    let materializedWorkspace;
    let implicitWorkspaceCwd;
    let runStarted = false;
    const requestedWorkspace = card.metadata?.automation?.workspace;
    let workspaceAccess;
    let targetWorkspace;
    let persistWorkspaceAccess;
    try {
      ({ workspaceAccess, targetWorkspace, persistWorkspaceAccess } =
        await resolveDispatchWorkspaceAccess({
          card,
          currentAccess: params.options?.workspaceAccess,
          resolveAgentWorkspace: params.options?.resolveAgentWorkspace,
        }));
    } catch (error) {
      startFailures.push({
        cardId: card.id,
        title: card.title,
        error: formatErrorMessage(error),
      });
      continue;
    }
    if (!requestedWorkspace || requestedWorkspace.kind === "scratch") {
      if (!workspaceAccess.unrestricted) {
        if (!targetWorkspace) {
          startFailures.push({
            cardId: card.id,
            title: card.title,
            error: "target agent workspace is unavailable for restricted dispatch",
          });
          continue;
        }
        try {
          implicitWorkspaceCwd = targetWorkspace;
          await assertCanonicalWorkboardRootAccess(implicitWorkspaceCwd, workspaceAccess);
          await assertRestrictedWorkboardTarget({
            root: implicitWorkspaceCwd,
            agentId: card.agentId,
            sessionKey,
            modelProvider: params.options?.provider,
            modelId: params.options?.model,
            resolveAgentWorkspaceRuntime: params.options?.resolveAgentWorkspaceRuntime,
            worktrees: params.worktrees,
          });
        } catch (error) {
          startFailures.push({
            cardId: card.id,
            title: card.title,
            error: formatErrorMessage(error),
          });
          continue;
        }
      }
    } else
      try {
        const canonicalSourcePath = await assertWorkboardWorkspaceSourceAccess(
          requestedWorkspace,
          workspaceAccess,
        );
        if (
          canonicalSourcePath &&
          requestedWorkspace.kind === "dir" &&
          workspaceAccess.unrestricted
        )
          await assertCanonicalWorkboardRootAccess(canonicalSourcePath, workspaceAccess);
        if (canonicalSourcePath && !workspaceAccess.unrestricted) {
          await assertCanonicalWorkboardRootAccess(canonicalSourcePath, workspaceAccess);
          await assertRestrictedWorkboardTarget({
            root: canonicalSourcePath,
            agentId: card.agentId,
            sessionKey,
            modelProvider: params.options?.provider,
            modelId: params.options?.model,
            resolveAgentWorkspaceRuntime: params.options?.resolveAgentWorkspaceRuntime,
            worktrees: params.worktrees,
          });
        }
      } catch (error) {
        startFailures.push({
          cardId: card.id,
          title: card.title,
          error: formatErrorMessage(error),
        });
        continue;
      }
    try {
      const claimed = await params.store.claim(
        card.id,
        {
          ownerId,
          ttlSeconds: card.metadata?.automation?.maxRuntimeSeconds,
        },
        {
          expectedAuthority: {
            agentId: card.agentId,
            workspace: card.metadata?.automation?.workspace,
            workspaceAccess: card.metadata?.automation?.workspaceAccess,
          },
          adoptWorkspaceAccess: persistWorkspaceAccess ? workspaceAccess : void 0,
        },
      );
      claimValue = claimed.token;
      const context = await params.store.buildWorkerContext(card.id);
      const materialized = await materializeWorkspace({
        card: claimed.card,
        worktrees: params.worktrees,
        materializeWorktree: params.options?.materializeWorktree === true,
        workspaceAccess,
      });
      const runCwd = materialized.cwd ?? implicitWorkspaceCwd;
      if (runCwd && !workspaceAccess.unrestricted)
        await assertRestrictedWorkboardTarget({
          root: runCwd,
          agentId: card.agentId,
          sessionKey,
          modelProvider: params.options?.provider,
          modelId: params.options?.model,
          resolveAgentWorkspaceRuntime: params.options?.resolveAgentWorkspaceRuntime,
          worktrees: params.worktrees,
        });
      materializedWorkspace = materialized.workspace;
      if (materializedWorkspace)
        await params.store.update(card.id, {
          workspace: materializedWorkspace,
          workspaceAccess,
        });
      const run = await params.subagent.run({
        sessionKey,
        message: buildWorkerPrompt({
          card: claimed.card,
          context,
          ownerId,
          token: claimValue,
        }),
        toolsAlsoAllow: [...WORKBOARD_REQUIRED_WORKER_TOOLS],
        ...(params.options?.provider ? { provider: params.options.provider } : {}),
        ...(params.options?.model ? { model: params.options.model } : {}),
        lane: `workboard:${cardBoardId(card)}:${card.id}`,
        idempotencyKey: `workboard:${card.id}:${claimed.card.updatedAt}`,
        lightContext: true,
        deliver: false,
        ...(runCwd ? { cwd: runCwd } : {}),
      });
      runStarted = true;
      const updated = await params.store.update(card.id, {
        sessionKey,
        runId: run.runId,
        execution: buildExecution({
          card: claimed.card,
          sessionKey,
          runId: run.runId,
          model,
          now,
        }),
        ...(materializedWorkspace ? { workspace: materializedWorkspace } : {}),
      });
      await params.store.addWorkerLog(
        updated.id,
        {
          level: "info",
          message: `Dispatcher started subagent run ${run.runId}.`,
          sessionKey,
          runId: run.runId,
        },
        {
          ownerId,
          token: claimValue,
        },
      );
      started.push({
        cardId: updated.id,
        title: updated.title,
        sessionKey,
        runId: run.runId,
      });
    } catch (error) {
      if (
        !runStarted &&
        materializedWorkspace?.kind === "worktree" &&
        materializedWorkspace.path &&
        params.worktrees
      ) {
        await params.worktrees
          .removeIfLossless({
            path: materializedWorkspace.path,
            ownerKind: "workboard",
            ownerId: card.id,
          })
          .catch(() => void 0);
        const sourceWorkspace = card.metadata?.automation?.workspace;
        if (sourceWorkspace)
          await params.store.update(card.id, { workspace: sourceWorkspace }).catch(() => void 0);
      }
      const message = formatErrorMessage(error);
      startFailures.push({
        cardId: card.id,
        title: card.title,
        error: message,
      });
      if (!claimValue) continue;
      try {
        await params.store.block(
          card.id,
          {
            ownerId,
            token: claimValue,
            reason: `Dispatcher could not start worker: ${message}`,
          },
          {
            ownerId,
            token: claimValue,
          },
        );
      } catch {}
    }
  }
  return {
    ...dispatch,
    started,
    startFailures,
    count: dispatch.count + started.length + startFailures.length,
  };
}
//#endregion
//#region extensions/workboard/src/gateway-helpers.ts
function respondError(respond, error) {
  respond(false, void 0, {
    code: "workboard_error",
    message: formatErrorMessage(error),
  });
}
function readId(params) {
  const value = params.id;
  if (typeof value === "string" && value.trim()) return value.trim();
  throw new Error("id is required.");
}
function readOptionalPositiveInteger(value, fieldName) {
  if (value === void 0) return;
  const parsed = parseStrictPositiveInteger(value);
  if (typeof value !== "number" || parsed === void 0)
    throw new Error(`${fieldName} must be a positive integer.`);
  return parsed;
}
function readPatch(params) {
  const patch = params.patch;
  if (patch && typeof patch === "object" && !Array.isArray(patch)) return patch;
  return params;
}
function assertNoCursorAdvance(params) {
  if (params.advance === true)
    throw new Error("notification cursor advancement requires workboard.notifications.advance.");
}
function resolveGatewayWorkboardWorkspaceAccess(params) {
  if (!params.client) return { unrestricted: true };
  if (
    (Array.isArray(params.client?.connect?.scopes) ? params.client.connect.scopes : []).includes(
      "operator.admin",
    )
  )
    return { unrestricted: true };
  return resolveConfiguredWorkboardWorkspaceAccess({
    config: params.context.getRuntimeConfig(),
    unrestricted: false,
  });
}
function createWorkboardDispatchHandler(params) {
  return async ({ params: requestParams, respond, client, context }, options) => {
    try {
      const boardId =
        requestParams && typeof requestParams === "object" && "boardId" in requestParams
          ? requestParams.boardId
          : void 0;
      const rawMaxStarts =
        requestParams && typeof requestParams === "object" && "maxStarts" in requestParams
          ? requestParams.maxStarts
          : void 0;
      if (!options.supportsMaxStarts && rawMaxStarts !== void 0)
        throw new Error("maxStarts requires workboard.cards.dispatchWithOptions.");
      const maxStarts = options.supportsMaxStarts
        ? readOptionalPositiveInteger(rawMaxStarts, "maxStarts")
        : void 0;
      const workspaceAccess = resolveGatewayWorkboardWorkspaceAccess({
        context,
        client,
      });
      const result = await dispatchAndStartWorkboardCards({
        store: params.store,
        subagent: params.api.runtime.subagent,
        worktrees: params.api.runtime.worktrees,
        options: {
          boardId: typeof boardId === "string" ? boardId : void 0,
          ...(maxStarts !== void 0 ? { maxStarts } : {}),
          materializeWorktree: true,
          resolveAgentWorkspace: (agentId) =>
            resolveWorkboardAgentWorkspace(context.getRuntimeConfig(), agentId),
          resolveAgentWorkspaceRuntime: (
            agentId,
            sessionKey,
            workspaceDir,
            modelProvider,
            modelId,
          ) => {
            return resolveAgentWorkboardWorkspaceRuntime({
              config: context.getRuntimeConfig(),
              agentId,
              sessionKey,
              workspaceDir,
              modelProvider,
              modelId,
              prepareSandboxWorkspaceAuthority:
                params.api.runtime.sandbox.prepareWorkspaceAuthority,
            });
          },
          workspaceAccess,
        },
      });
      respond(true, {
        ...result,
        promoted: result.promoted.map(params.redactCard),
        reclaimed: result.reclaimed.map(params.redactCard),
        blocked: result.blocked.map(params.redactCard),
        orchestrated: result.orchestrated.map(params.redactCard),
      });
    } catch (error) {
      respondError(respond, error);
    }
  };
}
//#endregion
//#region extensions/workboard/src/gateway-workspace-methods.ts
const WRITE_SCOPE$1 = "operator.write";
async function resolveGatewayWorkspaceMutationAccess(request, value) {
  const access = await canonicalizeWorkboardWorkspaceAccess(
    resolveGatewayWorkboardWorkspaceAccess({
      context: request.context,
      client: request.client,
    }),
  );
  await assertWorkboardWorkspaceMutationAccess(value, access);
  return access;
}
function registerWorkboardWorkspaceCardMethods(params) {
  const { api, store, redactCard } = params;
  api.registerGatewayMethod(
    "workboard.cards.create",
    async (request) => {
      const { params: requestParams, respond } = request;
      try {
        const input = withoutWorkboardWorkspaceAccess(requestParams);
        const access = await resolveGatewayWorkspaceMutationAccess(request, input);
        respond(true, {
          card: redactCard(await store.create(withWorkboardWorkspaceAccess(input, access))),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE$1 },
  );
  api.registerGatewayMethod(
    "workboard.cards.update",
    async (request) => {
      const { params: requestParams, respond } = request;
      try {
        const patch = withoutWorkboardWorkspaceAccess(readPatch(requestParams));
        const access = await resolveGatewayWorkspaceMutationAccess(request, patch);
        respond(true, {
          card: redactCard(
            await store.update(
              readId(requestParams),
              containsWorkboardWorkspaceMutation(patch)
                ? withWorkboardWorkspaceAccess(patch, access)
                : patch,
            ),
          ),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE$1 },
  );
}
function registerWorkboardWorkspaceBulkMethod(params) {
  const { api, store, redactCard } = params;
  api.registerGatewayMethod(
    "workboard.cards.bulk",
    async (request) => {
      const { params: requestParams, respond } = request;
      try {
        const sanitizedParams = withoutWorkboardWorkspaceAccess(requestParams);
        const patch = withoutWorkboardWorkspaceAccess(readPatch(requestParams));
        const access = await resolveGatewayWorkspaceMutationAccess(request, patch);
        respond(true, {
          cards: (
            await store.bulkUpdate({
              ...sanitizedParams,
              patch: containsWorkboardWorkspaceMutation(patch)
                ? withWorkboardWorkspaceAccess(patch, access)
                : patch,
            })
          ).cards.map(redactCard),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE$1 },
  );
}
function registerWorkboardWorkspaceBoardMethod(params) {
  const { api, store } = params;
  api.registerGatewayMethod(
    "workboard.boards.upsert",
    async (request) => {
      const { params: requestParams, respond } = request;
      try {
        await resolveGatewayWorkspaceMutationAccess(request, requestParams);
        respond(true, { board: await store.upsertBoard(requestParams) });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE$1 },
  );
}
function registerWorkboardWorkspaceWorkflowMethods(params) {
  const { api, store, redactCard } = params;
  api.registerGatewayMethod(
    "workboard.cards.specify",
    async (request) => {
      const { params: requestParams, respond } = request;
      try {
        const sanitizedParams = withoutWorkboardWorkspaceAccess(requestParams);
        const access = await resolveGatewayWorkspaceMutationAccess(request, sanitizedParams);
        const input = containsWorkboardWorkspaceMutation(sanitizedParams)
          ? withWorkboardWorkspaceAccess(sanitizedParams, access)
          : sanitizedParams;
        respond(true, {
          card: redactCard(await store.specify(readId(requestParams), input, null)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE$1 },
  );
  api.registerGatewayMethod(
    "workboard.cards.decompose",
    async (request) => {
      const { params: requestParams, respond } = request;
      try {
        const sanitizedParams = withoutWorkboardWorkspaceAccess(requestParams);
        const access = await resolveGatewayWorkspaceMutationAccess(request, sanitizedParams);
        const result = await store.decompose(
          readId(requestParams),
          withWorkboardDecomposeWorkspaceAccess(sanitizedParams, access),
          null,
        );
        respond(true, {
          parent: redactCard(result.parent),
          children: result.children.map(redactCard),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE$1 },
  );
}
//#endregion
//#region extensions/workboard/src/gateway.ts
const READ_SCOPE = "operator.read";
const WRITE_SCOPE = "operator.write";
function redactClaimToken(card) {
  const claim = card.metadata?.claim;
  if (!claim) return card;
  return {
    ...card,
    metadata: {
      ...card.metadata,
      claim: {
        ...claim,
        token: "[redacted]",
      },
    },
  };
}
function redactDiagnosticsRows(result) {
  return {
    ...result,
    diagnostics: result.diagnostics.map((row) => ({
      ...row,
      card: redactClaimToken(row.card),
    })),
  };
}
function registerWorkboardGatewayMethods(params) {
  const { api } = params;
  const store = params.store ?? WorkboardStore.openSqlite();
  const dispatchCards = createWorkboardDispatchHandler({
    api,
    store,
    redactCard: redactClaimToken,
  });
  api.registerGatewayMethod(
    "workboard.cards.list",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          cards: (await store.list({ boardId: requestParams.boardId })).map(redactClaimToken),
          statuses: WORKBOARD_STATUSES,
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  registerWorkboardWorkspaceCardMethods({
    api,
    store,
    redactCard: redactClaimToken,
  });
  api.registerGatewayMethod(
    "workboard.cards.move",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(
            await store.move(readId(requestParams), requestParams.status, requestParams.position),
          ),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.delete",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, await store.delete(readId(requestParams)));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.comment",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.addComment(readId(requestParams), requestParams)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.link",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.addLink(readId(requestParams), requestParams)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.linkDependency",
    async ({ params: requestParams, respond }) => {
      try {
        const parentId = requestParams.parentId;
        const childId = requestParams.childId;
        if (typeof parentId !== "string" || typeof childId !== "string")
          throw new Error("parentId and childId are required.");
        respond(true, { card: redactClaimToken(await store.linkCards(parentId, childId)) });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.proof",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.addProof(readId(requestParams), requestParams)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.artifact",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.addArtifact(readId(requestParams), requestParams)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.claim",
    async ({ params: requestParams, respond }) => {
      try {
        const claimed = await store.claim(readId(requestParams), requestParams);
        respond(true, {
          ...claimed,
          card: redactClaimToken(claimed.card),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.heartbeat",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.heartbeat(readId(requestParams), requestParams)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.release",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.releaseClaim(readId(requestParams), requestParams)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.promote",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.promote(readId(requestParams), requestParams, null)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.reassign",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.reassign(readId(requestParams), requestParams, null)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.reclaim",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.reclaim(readId(requestParams), requestParams, null)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.complete",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.complete(readId(requestParams), requestParams, null)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.block",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.block(readId(requestParams), requestParams, null)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.unblock",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, { card: redactClaimToken(await store.unblock(readId(requestParams))) });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  registerWorkboardWorkspaceBulkMethod({
    api,
    store,
    redactCard: redactClaimToken,
  });
  api.registerGatewayMethod(
    "workboard.cards.diagnostics",
    async ({ respond }) => {
      try {
        respond(true, redactDiagnosticsRows(await store.diagnostics()));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.diagnostics.refresh",
    async ({ respond }) => {
      try {
        respond(true, redactDiagnosticsRows(await store.refreshDiagnostics()));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.dispatch",
    async (context) => await dispatchCards(context, { supportsMaxStarts: false }),
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.dispatchWithOptions",
    async (context) => await dispatchCards(context, { supportsMaxStarts: true }),
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.boards.list",
    async ({ respond }) => {
      try {
        respond(true, await store.listBoards());
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  registerWorkboardWorkspaceBoardMethod({
    api,
    store,
    redactCard: redactClaimToken,
  });
  api.registerGatewayMethod(
    "workboard.boards.archive",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          board: await store.archiveBoard(requestParams.id, requestParams.archived),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.boards.delete",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, await store.deleteBoard(requestParams.id));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.stats",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, await store.stats({ boardId: requestParams.boardId }));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.runs",
    async ({ params: requestParams, respond }) => {
      try {
        const result = await store.runs(readId(requestParams));
        respond(true, {
          ...result,
          card: redactClaimToken(result.card),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  registerWorkboardWorkspaceWorkflowMethods({
    api,
    store,
    redactCard: redactClaimToken,
  });
  api.registerGatewayMethod(
    "workboard.notifications.subscribe",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, { subscription: await store.subscribeNotifications(requestParams) });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.notifications.list",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, await store.listNotificationSubscriptions(requestParams));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.notifications.delete",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, await store.deleteNotificationSubscription(readId(requestParams)));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.notifications.events",
    async ({ params: requestParams, respond }) => {
      try {
        assertNoCursorAdvance(requestParams);
        respond(true, await store.notificationEvents(requestParams));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.notifications.advance",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, await store.advanceNotificationEvents(requestParams));
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.attachments.list",
    async ({ params: requestParams, respond }) => {
      try {
        const result = await store.listAttachments(readId(requestParams));
        respond(true, {
          ...result,
          card: redactClaimToken(result.card),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.attachments.get",
    async ({ params: requestParams, respond }) => {
      try {
        const attachment = await store.getAttachment(readId(requestParams));
        if (!attachment) throw new Error(`attachment not found: ${readId(requestParams)}`);
        respond(true, attachment);
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.attachments.add",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.addAttachment(readId(requestParams), requestParams)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.attachments.delete",
    async ({ params: requestParams, respond }) => {
      try {
        const attachmentId = requestParams.attachmentId;
        if (typeof attachmentId !== "string" || !attachmentId.trim())
          throw new Error("attachmentId is required.");
        respond(true, {
          card: redactClaimToken(
            await store.deleteAttachment(readId(requestParams), attachmentId.trim()),
          ),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.workerLog",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(await store.addWorkerLog(readId(requestParams), requestParams)),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.protocolViolation",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(
            await store.recordProtocolViolation(readId(requestParams), requestParams),
          ),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.archive",
    async ({ params: requestParams, respond }) => {
      try {
        respond(true, {
          card: redactClaimToken(
            await store.archive(readId(requestParams), requestParams.archived),
          ),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: WRITE_SCOPE },
  );
  api.registerGatewayMethod(
    "workboard.cards.export",
    async ({ respond }) => {
      try {
        const exported = await store.exportCards();
        respond(true, {
          ...exported,
          cards: exported.cards.map(redactClaimToken),
        });
      } catch (error) {
        respondError(respond, error);
      }
    },
    { scope: READ_SCOPE },
  );
}
//#endregion
export {
  WORKBOARD_TOOL_NAMES as a,
  resolveAgentWorkboardWorkspaceRuntime as c,
  cleanupWorkboardRunWorktree as i,
  resolveCommandWorkboardWorkspaceAccess as l,
  dispatchAndStartWorkboardCards as n,
  canonicalizeWorkboardWorkspaceAccess as o,
  WorkboardStore as r,
  guardWorkboardToolsForWorkspaceAccess as s,
  registerWorkboardGatewayMethods as t,
  resolveWorkboardAgentWorkspace as u,
};
