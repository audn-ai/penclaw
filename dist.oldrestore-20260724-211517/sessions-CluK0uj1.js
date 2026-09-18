import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import "./src-Bl7G9qvi.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as normalizeRpcAttachmentsToChatAttachments } from "./attachment-normalize-6nV4PWtm.js";
import "./agent-scope-y9xQv_q1.js";
import { s as asWorkerInferenceControl, t as chatHandlers } from "./chat-BheIr_Bk.js";
import { t as clearSessionQueues } from "./cleanup-DDlcY-PM.js";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-Br1guPTt.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-TXobKXN7.js";
import "./thinking-CVcRbjTC.js";
import {
  c as createFileBackedCompactionCheckpointStore,
  l as getSessionCompactionCheckpoint,
  u as listSessionCompactionCheckpoints,
} from "./compaction-hooks-C1YwjfxH.js";
import { r as compactEmbeddedAgentSession } from "./embedded-agent-T_kAEk06.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as insideGitCheckout } from "./git-CvJkUhVJ.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  s as resolveSessionWorkStartError,
  t as SESSION_LIFECYCLE_CHANGED_ERROR_REASON,
} from "./lifecycle-5_TQ_dr5.js";
import {
  a as resolveMainSessionKey,
  r as resolveAgentMainSessionKey,
} from "./main-session-nrmKYo2W.js";
import { a as isModelSelectionLocked } from "./model-overrides-BlzAR7Nc.js";
import {
  L as executeSqliteQuerySync,
  l as runOpenClawStateWriteTransaction,
  s as openOpenClawStateDatabase,
  z as getNodeSqliteKysely,
} from "./openclaw-state-db-Bsa8Tv1Z.js";
import { r as canReviewOperatorApproval } from "./operator-approval-authorization-D6fQvi72.js";
import { n as APPROVALS_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { t as loadOptionalServerMethodModelCatalog } from "./optional-model-catalog-CB9dD03E.js";
import {
  n as resolveWorkerPlacementSessionRuntime,
  t as isWorkerPlacementSessionRuntimeSupported,
} from "./placement-session-runtime-DGVvnC4k.js";
import {
  l as measureDiagnosticsTimelineSpan,
  u as measureDiagnosticsTimelineSpanSync,
} from "./plugin-metadata-snapshot-BMgImu0m.js";
import { g as patchPluginSessionExtension } from "./registry-B14M_H8G.js";
import { S as replyRunRegistry } from "./reply-run-registry-CmZS-dyq.js";
import {
  A as waitForEmbeddedAgentRunEnd,
  d as isEmbeddedAgentRunActive,
  n as abortEmbeddedAgentRun,
} from "./runs-GL_-RIwi.js";
import { n as resolveSessionKeyForRun } from "./server-session-key-CtUYjV6x.js";
import { o as managedWorktrees } from "./service-Dhl824Yp.js";
import {
  C as loadTranscriptEvents,
  Jt as resolveSessionStoreKey,
  M as preflightSessionTranscriptForManualCompact,
  Q as resolveSessionTranscriptRuntimeTarget,
  Xt as resolveStoredSessionOwnerAgentId,
  Yt as resolveStoredSessionKeyForAgentStore,
  h as deleteSessionEntryLifecycle,
  nt as rollbackPluginOwnedSessionEntryLifecycle,
  o as applySessionEntryReplacements,
  qt as resolveSessionStoreAgentId,
  rt as trimSessionTranscriptForManualCompact,
  s as applySessionPatchProjection,
} from "./session-accessor-PZVNxFCV.js";
import {
  n as hasVisibleActiveSessionRun,
  r as resolveVisibleActiveSessionRunState,
  t as hasTrackedActiveSessionRun,
} from "./session-active-runs-D4kaUdsk.js";
import { t as resolveSessionCatalogCreateTarget } from "./session-catalog-DVKnKnTB.js";
import {
  n as setGatewayDedupeEntry,
  t as emitSessionsChanged,
} from "./session-change-event-D7K-El-z.js";
import {
  i as projectSessionsPatchEntry,
  n as createGatewaySession,
  r as resolveRequestedSessionAgentId,
  t as buildDashboardSessionKey,
} from "./session-create-service-Cu4fMU-m.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { n as resolveSessionModelRef } from "./session-model-ref-1c6_XVhy.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-BiLQgeII.js";
import { n as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-DgCFENjt.js";
import {
  a as handleSessionStateSessionDeleted,
  c as recordSessionCompacted,
} from "./session-state-events-DXdC9X_q.js";
import { t as reactivateCompletedSubagentSession } from "./session-subagent-reactivation-BOgjVPnL.js";
import { t as resolveWorkerSessionTarget } from "./session-target-CAMdjbd6.js";
import {
  o as readSessionMessageCountAsync,
  r as readRecentSessionMessagesWithStatsAsync,
  u as readSessionPreviewItemsFromTranscript,
} from "./session-transcript-readers-Bv0ty7AX.js";
import { t as searchSessionTranscripts } from "./session-transcript-search-BK7kW_Jf.js";
import {
  C as disableCronJobsBoundToSession,
  _ as resolveGatewaySessionThinkingProjection,
  c as listSessionsFromStoreAsync,
  d as migrateAndPruneGatewaySessionStoreKey,
  f as resolveDeletedAgentIdFromSessionKey,
  g as resolveGatewaySessionStoreTargetWithStore,
  h as resolveGatewaySessionStoreTarget,
  n as buildGatewaySessionRow,
  p as resolveFreshestSessionEntryFromStoreKeys,
  u as loadSessionEntry,
  v as resolveSessionDisplayModelIdentityRef,
} from "./session-utils-DjTWBI0J.js";
import {
  i as serializeSessionCleanupResult,
  r as runSessionsCleanup,
} from "./sessions-CEG7v41b.js";
import { t as resolveSessionKeyFromResolveParams } from "./sessions-resolve-tmDvycR9.js";
import { r as resolveIngressWorkspaceOverrideForSessionRun } from "./spawned-context-Cp4BOB_e.js";
import {
  Gn as validateSessionsCompactionGetParams,
  Hn as validateSessionsCleanupParams,
  Jn as validateSessionsCreateParams,
  Kn as validateSessionsCompactionListParams,
  Ln as validateSessionsAbortParams,
  Qn as validateSessionsDispatchParams,
  Un as validateSessionsCompactParams,
  Wn as validateSessionsCompactionBranchParams,
  Xn as validateSessionsDescribeParams,
  Yn as validateSessionsDeleteParams,
  _r as validateSessionsSendParams,
  ar as validateSessionsGroupsPutParams,
  cr as validateSessionsMessagesSubscribeParams,
  dr as validateSessionsPluginPatchParams,
  fr as validateSessionsPreviewParams,
  hr as validateSessionsSearchParams,
  ir as validateSessionsGroupsListParams,
  lr as validateSessionsMessagesUnsubscribeParams,
  mr as validateSessionsResolveParams,
  or as validateSessionsGroupsRenameParams,
  pr as validateSessionsResetParams,
  qn as validateSessionsCompactionRestoreParams,
  rr as validateSessionsGroupsDeleteParams,
  sr as validateSessionsListParams,
  ur as validateSessionsPatchParams,
} from "./src-CIJf1lT0.js";
import {
  Pt as resolveMissingAgentHarnessSessionError,
  Tt as isAgentHarnessSessionKey,
  Y as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
  et as interruptSessionWorkAdmissions,
  nt as isSessionWorkAdmissionActive,
  rt as runExclusiveSessionLifecycleMutation,
  tt as isSessionLifecycleMutationActive,
} from "./store-CzZJhTF6.js";
import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import {
  i as resolveAllAgentSessionStoreTargetsSync,
  t as listConfiguredSessionStoreAgentIds,
} from "./targets-CjMfpXbt.js";
import {
  o as normalizeReasoningLevel,
  s as normalizeThinkLevel,
} from "./thinking.shared-BWnbgBUO.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
//#region src/gateway/session-groups.ts
function dbFor(env) {
  return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
  return getNodeSqliteKysely(db);
}
function normalizeGroupNames(names) {
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const raw of names) {
    const name = normalizeOptionalString(raw);
    if (!name || seen.has(name)) continue;
    seen.add(name);
    normalized.push(name);
  }
  return normalized;
}
function listSessionGroups(env = process.env) {
  const db = dbFor(env);
  return executeSqliteQuerySync(
    db,
    kyselyFor(db)
      .selectFrom("session_groups")
      .select(["name", "position"])
      .orderBy("position", "asc")
      .orderBy("name", "asc"),
  ).rows.map((row) => ({
    name: row.name,
    position: row.position,
  }));
}
/** Replaces the ordered catalog. Sessions keep their category even when a name is dropped. */
function putSessionGroups(names, env = process.env) {
  const normalized = normalizeGroupNames(names);
  const now = Date.now();
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      const kysely = kyselyFor(db);
      const existing = new Map(
        executeSqliteQuerySync(
          db,
          kysely.selectFrom("session_groups").select(["name", "created_at"]),
        ).rows.map((row) => [row.name, row.created_at]),
      );
      executeSqliteQuerySync(db, kysely.deleteFrom("session_groups"));
      normalized.forEach((name, position) => {
        executeSqliteQuerySync(
          db,
          kysely.insertInto("session_groups").values({
            name,
            position,
            created_at: existing.get(name) ?? now,
          }),
        );
      });
    },
    { env },
  );
  return normalized.map((name, position) => ({
    name,
    position,
  }));
}
/**
 * Absorbs a category assigned through sessions.patch so the catalog keeps
 * covering every group an operator UI can observe, appended at the end.
 */
function ensureSessionGroupRegistered(name, env = process.env) {
  const normalized = normalizeOptionalString(name);
  if (!normalized) return;
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      const kysely = kyselyFor(db);
      if (
        executeSqliteQuerySync(
          db,
          kysely
            .selectFrom("session_groups")
            .select("name")
            .where("name", "=", normalized)
            .limit(1),
        ).rows[0]
      )
        return;
      const maxRow = executeSqliteQuerySync(
        db,
        kysely.selectFrom("session_groups").select("position").orderBy("position", "desc").limit(1),
      ).rows[0];
      executeSqliteQuerySync(
        db,
        kysely.insertInto("session_groups").values({
          name: normalized,
          position: (maxRow?.position ?? -1) + 1,
          created_at: Date.now(),
        }),
      );
    },
    { env },
  );
}
function renameCatalogEntry(from, to, env) {
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      const kysely = kyselyFor(db);
      const source = executeSqliteQuerySync(
        db,
        kysely.selectFrom("session_groups").selectAll().where("name", "=", from).limit(1),
      ).rows[0];
      const targetExists = executeSqliteQuerySync(
        db,
        kysely.selectFrom("session_groups").select("name").where("name", "=", to).limit(1),
      ).rows[0];
      executeSqliteQuerySync(db, kysely.deleteFrom("session_groups").where("name", "=", from));
      if (targetExists) return;
      executeSqliteQuerySync(
        db,
        kysely.insertInto("session_groups").values({
          name: to,
          position: source?.position ?? 0,
          created_at: source?.created_at ?? Date.now(),
        }),
      );
    },
    { env },
  );
}
/**
 * Bulk-updates member session categories across every agent store without
 * bumping updatedAt: group maintenance must not reshuffle recency ordering.
 */
async function updateMemberCategories(cfg, from, to, env) {
  let updated = 0;
  for (const target of resolveAllAgentSessionStoreTargetsSync(cfg, { env }))
    updated += await applySessionEntryReplacements({
      storePath: target.storePath,
      update: (entries) => {
        const replacements = entries.flatMap(({ sessionKey, entry }) => {
          if (entry.category?.trim() !== from) return [];
          const next = { ...entry };
          if (to === void 0) delete next.category;
          else next.category = to;
          return [
            {
              sessionKey,
              entry: next,
            },
          ];
        });
        return {
          replacements,
          result: replacements.length,
        };
      },
    });
  return updated;
}
async function renameSessionGroup(params) {
  const env = params.env ?? process.env;
  const from = normalizeOptionalString(params.name);
  const to = normalizeOptionalString(params.to);
  if (!from || !to) throw new Error("group rename requires non-empty names");
  if (from !== to) renameCatalogEntry(from, to, env);
  const updatedSessions = from === to ? 0 : await updateMemberCategories(params.cfg, from, to, env);
  return {
    groups: listSessionGroups(env),
    updatedSessions,
  };
}
async function deleteSessionGroup(params) {
  const env = params.env ?? process.env;
  const name = normalizeOptionalString(params.name);
  if (!name) throw new Error("group delete requires a non-empty name");
  runOpenClawStateWriteTransaction(
    ({ db }) => {
      executeSqliteQuerySync(
        db,
        kyselyFor(db).deleteFrom("session_groups").where("name", "=", name),
      );
    },
    { env },
  );
  const updatedSessions = await updateMemberCategories(params.cfg, name, void 0, env);
  return {
    groups: listSessionGroups(env),
    updatedSessions,
  };
}
//#endregion
//#region src/gateway/worker-environments/placement-projector.ts
/** Removes gateway-only identity and turn-claim fields from the operator projection. */
function projectWorkerSessionPlacement(record) {
  const timing = {
    generation: record.generation,
    createdAtMs: record.createdAtMs,
    updatedAtMs: record.updatedAtMs,
    stateChangedAtMs: record.stateChangedAtMs,
  };
  switch (record.state) {
    case "local":
      return {
        state: "local",
        ...timing,
      };
    case "requested":
      return {
        state: "requested",
        ...timing,
      };
    case "provisioning":
      return {
        state: "provisioning",
        ...timing,
        ...(record.environmentId ? { environmentId: record.environmentId } : {}),
      };
    case "syncing":
      return {
        state: "syncing",
        ...timing,
        environmentId: record.environmentId,
        workerBundleHash: record.workerBundleHash,
      };
    case "starting":
      return {
        state: "starting",
        ...timing,
        environmentId: record.environmentId,
        workerBundleHash: record.workerBundleHash,
        workspaceBaseManifestRef: record.workspaceBaseManifestRef,
        remoteWorkspaceDir: record.remoteWorkspaceDir,
      };
    case "active":
      return {
        state: "active",
        ...timing,
        environmentId: record.environmentId,
        activeOwnerEpoch: record.activeOwnerEpoch,
        workerBundleHash: record.workerBundleHash,
        workspaceBaseManifestRef: record.workspaceBaseManifestRef,
        remoteWorkspaceDir: record.remoteWorkspaceDir,
        ...(record.lastTranscriptAckCursor !== null
          ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor }
          : {}),
        ...(record.lastLiveEventAckCursor !== null
          ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor }
          : {}),
      };
    case "draining":
      return {
        state: "draining",
        ...timing,
        environmentId: record.environmentId,
        activeOwnerEpoch: record.activeOwnerEpoch,
        workerBundleHash: record.workerBundleHash,
        workspaceBaseManifestRef: record.workspaceBaseManifestRef,
        remoteWorkspaceDir: record.remoteWorkspaceDir,
        ...(record.lastTranscriptAckCursor !== null
          ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor }
          : {}),
        ...(record.lastLiveEventAckCursor !== null
          ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor }
          : {}),
      };
    case "reconciling":
      return {
        state: "reconciling",
        ...timing,
        environmentId: record.environmentId,
        activeOwnerEpoch: record.activeOwnerEpoch,
        workerBundleHash: record.workerBundleHash,
        workspaceBaseManifestRef: record.workspaceBaseManifestRef,
        remoteWorkspaceDir: record.remoteWorkspaceDir,
        ...(record.lastTranscriptAckCursor !== null
          ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor }
          : {}),
        ...(record.lastLiveEventAckCursor !== null
          ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor }
          : {}),
      };
    case "reclaimed":
      return {
        state: "reclaimed",
        ...timing,
        ...(record.environmentId ? { environmentId: record.environmentId } : {}),
        ...(record.activeOwnerEpoch !== null ? { activeOwnerEpoch: record.activeOwnerEpoch } : {}),
        ...(record.workspaceBaseManifestRef
          ? { workspaceBaseManifestRef: record.workspaceBaseManifestRef }
          : {}),
        ...(record.remoteWorkspaceDir ? { remoteWorkspaceDir: record.remoteWorkspaceDir } : {}),
        ...(record.workerBundleHash ? { workerBundleHash: record.workerBundleHash } : {}),
        ...(record.lastTranscriptAckCursor !== null
          ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor }
          : {}),
        ...(record.lastLiveEventAckCursor !== null
          ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor }
          : {}),
      };
    case "failed":
      return {
        state: "failed",
        ...timing,
        ...(record.environmentId ? { environmentId: record.environmentId } : {}),
        ...(record.activeOwnerEpoch !== null ? { activeOwnerEpoch: record.activeOwnerEpoch } : {}),
        ...(record.workspaceBaseManifestRef
          ? { workspaceBaseManifestRef: record.workspaceBaseManifestRef }
          : {}),
        ...(record.remoteWorkspaceDir ? { remoteWorkspaceDir: record.remoteWorkspaceDir } : {}),
        ...(record.workerBundleHash ? { workerBundleHash: record.workerBundleHash } : {}),
        ...(record.lastTranscriptAckCursor !== null
          ? { lastTranscriptAckCursor: record.lastTranscriptAckCursor }
          : {}),
        ...(record.lastLiveEventAckCursor !== null
          ? { lastLiveEventAckCursor: record.lastLiveEventAckCursor }
          : {}),
        recoveryError: record.recoveryError,
      };
  }
  return record;
}
//#endregion
//#region src/gateway/server-methods/session-create-initial-turn.ts
function resolveOptionalInitialSessionMessage(params) {
  if (typeof params.task === "string" && params.task.trim()) return params.task;
  if (typeof params.message === "string" && params.message.trim()) return params.message;
}
function resolveSessionCreateInitialTurn(params) {
  const message = resolveOptionalInitialSessionMessage(params);
  const normalizedAttachments = normalizeRpcAttachmentsToChatAttachments(params.attachments);
  if (params.attachments?.length && !message && normalizedAttachments.length === 0) return null;
  const attachments = normalizedAttachments.length ? normalizedAttachments : void 0;
  return {
    attachments,
    hasInitialTurn: message !== void 0 || attachments !== void 0,
    message,
  };
}
function shouldAttachPendingMessageSeq(params) {
  if (params.cached) return false;
  return (
    (params.payload && typeof params.payload === "object" ? params.payload.status : void 0) ===
    "started"
  );
}
//#endregion
//#region src/gateway/server-methods/sessions.ts
const log = createSubsystemLogger("gateway/sessions");
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
const MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE =
  "Checkpoint branch and restore are unavailable while model selection is locked.";
var SessionWorkerPlacementMutationError = class extends Error {
  constructor(placementState, action, key) {
    super(`Session ${key} cannot ${action} while cloud worker placement is ${placementState}.`);
    this.placementState = placementState;
  }
};
function resolveSessionWorkerPlacementMutationError(params) {
  if (!params.sessionId) return;
  const placement = params.context.workerSessionPlacementService
    ?.getMany([params.sessionId])
    .get(params.sessionId);
  if (
    !placement ||
    placement.state === "local" ||
    (params.action === "delete" && placement.state === "reclaimed")
  )
    return;
  return new SessionWorkerPlacementMutationError(placement.state, params.action, params.key);
}
function respondSessionWorkerPlacementMutationError(error, respond) {
  respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message));
}
function resolveSessionWorkerPlacementPatchError(params) {
  const placement = params.entry?.sessionId
    ? params.context.workerSessionPlacementService
        ?.getMany([params.entry.sessionId])
        .get(params.entry.sessionId)
    : void 0;
  if (!placement || placement.state === "local") return;
  if (params.patch.archived !== void 0)
    return `Session ${params.key} cannot change archive state while cloud worker placement is ${placement.state}.`;
  if (!params.validateModelRuntime || params.patch.model === void 0 || !params.entry) return;
  const runtime = resolveWorkerPlacementSessionRuntime({
    cfg: params.cfg,
    entry: params.entry,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
  if (isWorkerPlacementSessionRuntimeSupported(runtime)) return;
  return `Session ${params.key} cannot select the ${runtime} runtime while cloud worker placement is ${placement.state}.`;
}
function filterSessionStoreToConfiguredAgents(cfg, store) {
  const configuredAgentIds = new Set(listConfiguredSessionStoreAgentIds(cfg));
  const isConfiguredSessionKey = (key) => {
    const normalizedKey = normalizeOptionalString(key);
    if (!normalizedKey) return false;
    const agentId = resolveSessionStoreAgentId(
      cfg,
      resolveSessionStoreKey({
        cfg,
        sessionKey: normalizedKey,
      }),
    );
    return configuredAgentIds.has(normalizeAgentId(agentId));
  };
  return Object.fromEntries(
    Object.entries(store).filter(([key, entry]) => {
      if (key === "global" || key === "unknown") return true;
      if (isConfiguredSessionKey(key)) return true;
      return (
        isConfiguredSessionKey(entry?.spawnedBy) || isConfiguredSessionKey(entry?.parentSessionKey)
      );
    }),
  );
}
const loadSessionsRuntimeModule = createLazyRuntimeModule(() => import("./sessions.runtime.js"));
function requireSessionKey(key, respond) {
  const normalized =
    normalizeOptionalString(
      typeof key === "string"
        ? key
        : typeof key === "number"
          ? String(key)
          : typeof key === "bigint"
            ? String(key)
            : "",
    ) ?? "";
  if (!normalized) {
    respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "key required"));
    return null;
  }
  return normalized;
}
function rejectPluginRuntimeDeleteMismatch(params) {
  const pluginOwnerId = normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId);
  if (!pluginOwnerId || !params.entry) return false;
  if (normalizeOptionalString(params.entry.pluginOwnerId) === pluginOwnerId) return false;
  params.respond(
    false,
    void 0,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `Plugin "${pluginOwnerId}" cannot delete session "${params.key}" because it did not create it.`,
    ),
  );
  return true;
}
function resolveGatewaySessionTargetFromKey(key, cfg, opts) {
  const target = resolveGatewaySessionStoreTarget({
    cfg,
    key,
    ...(opts?.agentId ? { agentId: opts.agentId } : {}),
  });
  return {
    cfg,
    target,
    storePath: target.storePath,
  };
}
function loadAccessorSessionEntryForGatewayTarget(params) {
  const target = resolveGatewaySessionStoreTargetWithStore({
    cfg: params.cfg,
    key: params.key,
    clone: false,
    ...(params.agentId ? { agentId: params.agentId } : {}),
  });
  let best;
  for (const sessionStoreKey of target.storeKeys) {
    const entry = target.store[sessionStoreKey];
    if (entry) {
      if (!best || (entry.updatedAt ?? 0) > (best.entry.updatedAt ?? 0))
        best = {
          entry,
          sessionStoreKey,
        };
    }
  }
  if (best)
    return {
      target,
      storePath: target.storePath,
      entry: best.entry,
      canonicalKey: target.canonicalKey,
      sessionStoreKey: best.sessionStoreKey,
    };
  return {
    target,
    storePath: target.storePath,
    entry: void 0,
    canonicalKey: target.canonicalKey,
    sessionStoreKey: target.canonicalKey,
  };
}
function loadSessionEntriesForTarget(params) {
  const target = resolveGatewaySessionStoreTargetWithStore({
    cfg: params.cfg,
    key: params.key,
    clone: false,
    ...(params.agentId ? { agentId: params.agentId } : {}),
  });
  const store = target.store;
  const entry = resolveFreshestSessionEntryFromStoreKeys(store, target.storeKeys);
  return {
    target,
    storePath: target.storePath,
    store,
    entry,
  };
}
function emitSessionOperation(context, payload) {
  const connIds = context.getSessionEventSubscriberConnIds();
  if (connIds.size === 0) return;
  context.broadcastToConnIds(
    "session.operation",
    {
      ...payload,
      ts: Date.now(),
    },
    connIds,
    { dropIfSlow: true },
  );
}
function rejectWebchatSessionMutation(params) {
  if (!params.client?.connect || !params.isWebchatConnect(params.client.connect)) return false;
  if (params.client.connect.client.id === GATEWAY_CLIENT_IDS.CONTROL_UI) return false;
  params.respond(
    false,
    void 0,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `webchat clients cannot ${params.action} sessions; use chat.send for session-scoped updates`,
    ),
  );
  return true;
}
function isWorkerDispatchInputError(error) {
  if (typeof error !== "object" || error === null || !("code" in error)) return false;
  const code = error.code;
  return code === "invalid_profile" || code === "profile_not_found" || code === "invalid_state";
}
function isAgentMainSessionKey(cfg, sessionKey) {
  const parsed = parseAgentSessionKey(sessionKey);
  if (!parsed) return false;
  return (
    sessionKey ===
    resolveAgentMainSessionKey({
      cfg,
      agentId: parsed.agentId,
    })
  );
}
async function createAgentMainSessionForSend(params) {
  const agentId = parseAgentSessionKey(params.canonicalKey)?.agentId;
  if (!agentId)
    return {
      ok: false,
      error: errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${params.canonicalKey}`),
    };
  let createResult;
  await expectDefined(
    sessionsHandlers["sessions.create"],
    "sessions.create handler",
  )({
    req: params.req,
    params: {
      key: params.canonicalKey,
      agentId,
    },
    respond: (ok, payload, error) => {
      createResult = {
        ok,
        payload: payload && typeof payload === "object" ? payload : void 0,
        error,
      };
    },
    context: params.context,
    client: params.client,
    isWebchatConnect: params.isWebchatConnect,
  });
  if (!createResult)
    return {
      ok: false,
      error: errorShape(ErrorCodes.UNAVAILABLE, "sessions.create did not respond"),
    };
  if (!createResult.ok)
    return {
      ok: false,
      error: createResult.error ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to create session"),
    };
  const createdKey = normalizeOptionalString(createResult.payload?.key) ?? params.canonicalKey;
  const loaded = loadSessionEntry(createdKey);
  if (!loaded.entry?.sessionId)
    return {
      ok: false,
      error: errorShape(ErrorCodes.UNAVAILABLE, `session not created: ${createdKey}`),
    };
  return {
    ok: true,
    entry: loaded.entry,
    canonicalKey: loaded.canonicalKey,
    storePath: loaded.storePath,
  };
}
function resolveAbortSessionKey(params) {
  if (params.activeRunSessionKey) return params.activeRunSessionKey;
  const candidates = [params.canonicalKey, params.requestedKey, ...(params.aliasKeys ?? [])];
  for (const active of params.context.chatAbortControllers.values()) {
    if (active.controlUiVisible === false) continue;
    for (const candidate of candidates) if (active.sessionKey === candidate) return candidate;
  }
  return params.requestedKey;
}
function resolveSessionKeyAgentId(sessionKey, cfg) {
  const key = normalizeOptionalString(sessionKey);
  if (!key) return;
  if (!parseAgentSessionKey(key) && key.toLowerCase().startsWith("agent:")) return;
  return resolveSessionStoreAgentId(
    cfg,
    resolveSessionStoreKey({
      cfg,
      sessionKey: key,
    }),
  );
}
function sessionKeyBelongsToAgent(sessionKey, agentId, cfg) {
  const key = normalizeOptionalString(sessionKey);
  if (cfg.session?.scope === "global" && key?.toLowerCase() === "global") return true;
  const sessionAgentId = resolveSessionKeyAgentId(sessionKey, cfg);
  return Boolean(sessionAgentId && sessionAgentId === normalizeAgentId(agentId));
}
function resolveScopedAbortKey(params) {
  const key = normalizeOptionalString(params.key);
  if (!key) return;
  const requestedAgentId = normalizeOptionalString(params.agentId);
  if (!requestedAgentId) return key;
  const scopedAgentId = normalizeAgentId(requestedAgentId);
  const ownerAgentId = resolveStoredSessionOwnerAgentId({
    cfg: params.cfg,
    agentId: scopedAgentId,
    sessionKey: key,
  });
  if (ownerAgentId && ownerAgentId !== scopedAgentId) return;
  return resolveStoredSessionKeyForAgentStore({
    cfg: params.cfg,
    agentId: scopedAgentId,
    sessionKey: key,
  });
}
function resolveSessionMessageSubscriptionKey(params) {
  const agentId = params.agentId
    ? normalizeAgentId(params.agentId)
    : params.canonicalKey === "global" && params.defaultAgentId
      ? normalizeAgentId(params.defaultAgentId)
      : void 0;
  return params.canonicalKey === "global" && agentId
    ? `agent:${agentId}:global`
    : params.canonicalKey;
}
async function interruptSessionRunIfActive(params) {
  const cfg = params.context.getRuntimeConfig();
  const hasTrackedRun = hasTrackedActiveSessionRun({
    context: params.context,
    requestedKey: params.requestedKey,
    canonicalKey: params.canonicalKey,
    agentId: params.agentId,
    defaultAgentId: resolveDefaultAgentId(cfg),
  });
  const hasEmbeddedRun =
    typeof params.sessionId === "string" && params.sessionId
      ? isEmbeddedAgentRunActive(params.sessionId)
      : false;
  const hasWorkerRun =
    typeof params.sessionId === "string" && params.sessionId
      ? (asWorkerInferenceControl(params.context.workerEnvironmentService)?.hasInferenceForSession(
          params.sessionId,
        ) ?? false)
      : false;
  if (!hasTrackedRun && !hasEmbeddedRun && !hasWorkerRun) return { interrupted: false };
  if (hasTrackedRun || hasWorkerRun) {
    let abortOk = true;
    let abortError;
    const abortSessionKey = resolveAbortSessionKey({
      context: params.context,
      requestedKey: params.requestedKey,
      canonicalKey: params.canonicalKey,
    });
    await expectDefined(
      chatHandlers["chat.abort"],
      "chat.abort handler",
    )({
      req: params.req,
      params: {
        sessionKey: abortSessionKey,
        ...(params.canonicalKey === "global" && params.agentId ? { agentId: params.agentId } : {}),
      },
      respond: (ok, _payload, error) => {
        abortOk = ok;
        abortError = error;
      },
      context: params.context,
      client: params.client,
      isWebchatConnect: params.isWebchatConnect,
    });
    if (!abortOk)
      return {
        interrupted: true,
        error:
          abortError ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to interrupt active session"),
      };
  }
  if (hasEmbeddedRun && params.sessionId) abortEmbeddedAgentRun(params.sessionId);
  clearSessionQueues([params.requestedKey, params.canonicalKey, params.sessionId]);
  if (hasEmbeddedRun && params.sessionId) {
    if (!(await waitForEmbeddedAgentRunEnd(params.sessionId, 15e3)))
      return {
        interrupted: true,
        error: errorShape(
          ErrorCodes.UNAVAILABLE,
          `Session ${params.requestedKey} is still active; try again in a moment.`,
        ),
      };
  }
  return { interrupted: true };
}
async function handleSessionSend(params) {
  if (!assertValidParams(params.params, validateSessionsSendParams, params.method, params.respond))
    return;
  const p = params.params;
  const key = requireSessionKey(p.key, params.respond);
  if (!key) return;
  const cfg = params.context.getRuntimeConfig();
  const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
  if (!requestedAgent.ok) {
    params.respond(false, void 0, requestedAgent.error);
    return;
  }
  const requestedAgentId = requestedAgent.agentId;
  const loaded = loadSessionEntry(key, { agentId: requestedAgentId });
  const { legacyKey } = loaded;
  let { entry, canonicalKey, storePath } = loaded;
  const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, canonicalKey, entry, {
    acpMetadataSessionKey: legacyKey ?? canonicalKey,
  });
  if (deletedAgentId !== null) {
    params.respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        `Agent "${deletedAgentId}" no longer exists in configuration`,
      ),
    );
    return;
  }
  const rawIdempotencyKey = p.idempotencyKey;
  const explicitIdempotencyKey =
    typeof rawIdempotencyKey === "string" && rawIdempotencyKey.trim()
      ? rawIdempotencyKey.trim()
      : void 0;
  const idempotencyKey = explicitIdempotencyKey ?? randomUUID();
  const dispatchChatSend = async (respond) => {
    await expectDefined(
      chatHandlers["chat.send"],
      "chat.send handler",
    )({
      req: params.req,
      params: {
        sessionKey: canonicalKey,
        ...(canonicalKey === "global" && requestedAgentId ? { agentId: requestedAgentId } : {}),
        message: p.message,
        thinking: p.thinking,
        attachments: p.attachments,
        timeoutMs: p.timeoutMs,
        idempotencyKey,
      },
      respond,
      context: params.context,
      client: params.client,
      isWebchatConnect: params.isWebchatConnect,
    });
  };
  const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
  if (archivedSessionError) {
    if (explicitIdempotencyKey) {
      await dispatchChatSend(params.respond);
      return;
    }
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
    return;
  }
  if (!entry?.sessionId && !params.interruptIfActive && isAgentMainSessionKey(cfg, canonicalKey)) {
    const created = await createAgentMainSessionForSend({
      req: params.req,
      canonicalKey,
      context: params.context,
      client: params.client,
      isWebchatConnect: params.isWebchatConnect,
    });
    if (!created.ok) {
      params.respond(false, void 0, created.error);
      return;
    }
    entry = created.entry;
    canonicalKey = created.canonicalKey;
    storePath = created.storePath;
  }
  if (!entry?.sessionId) {
    params.respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`),
    );
    return;
  }
  let interruptedActiveRun = false;
  if (params.interruptIfActive) {
    const interruptResult = await interruptSessionRunIfActive({
      req: params.req,
      context: params.context,
      client: params.client,
      isWebchatConnect: params.isWebchatConnect,
      requestedKey: key,
      canonicalKey,
      agentId: requestedAgentId,
      sessionId: entry.sessionId,
    });
    if (interruptResult.error) {
      params.respond(false, void 0, interruptResult.error);
      return;
    }
    interruptedActiveRun = interruptResult.interrupted;
  }
  const messageSeq =
    (await readSessionMessageCountAsync({
      agentId: requestedAgentId,
      sessionEntry: entry,
      sessionId: entry.sessionId,
      sessionKey: canonicalKey,
      storePath,
    })) + 1;
  let sendAcked = false;
  let sendPayload;
  let sendCached = false;
  let startedRunId;
  await dispatchChatSend((ok, payload, error, meta) => {
    sendAcked = ok;
    sendPayload = payload;
    sendCached = meta?.cached === true;
    startedRunId =
      payload && typeof payload === "object" && typeof payload.runId === "string"
        ? payload.runId
        : void 0;
    if (
      ok &&
      shouldAttachPendingMessageSeq({
        payload,
        cached: meta?.cached === true,
      })
    ) {
      params.respond(
        true,
        {
          ...(payload && typeof payload === "object" ? payload : {}),
          messageSeq,
          ...(interruptedActiveRun ? { interruptedActiveRun: true } : {}),
        },
        void 0,
        meta,
      );
      return;
    }
    params.respond(
      ok,
      ok && payload && typeof payload === "object"
        ? {
            ...payload,
            ...(interruptedActiveRun ? { interruptedActiveRun: true } : {}),
          }
        : payload,
      error,
      meta,
    );
  });
  if (sendAcked) {
    if (
      shouldAttachPendingMessageSeq({
        payload: sendPayload,
        cached: sendCached,
      })
    )
      await reactivateCompletedSubagentSession({
        sessionKey: canonicalKey,
        runId: startedRunId,
        task: p.message,
      });
    emitSessionsChanged(params.context, {
      sessionKey: canonicalKey,
      ...(canonicalKey === "global" && requestedAgentId ? { agentId: requestedAgentId } : {}),
      reason: interruptedActiveRun ? "steer" : "send",
    });
  }
}
const sessionsHandlers = {
  "sessions.search": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateSessionsSearchParams, "sessions.search", respond))
      return;
    const query = params.query.trim();
    if (!query) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "query must not be empty"));
      return;
    }
    const cfg = context.getRuntimeConfig();
    if (params.agentId && !params.sessionKeys) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "agentId requires sessionKeys"),
      );
      return;
    }
    const requestedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
    const sessionKeys = params.sessionKeys?.map((sessionKey) =>
      requestedAgentId
        ? resolveStoredSessionKeyForAgentStore({
            cfg,
            agentId: requestedAgentId,
            sessionKey,
          })
        : resolveSessionStoreKey({
            cfg,
            sessionKey,
          }),
    );
    const agentIds = new Set(
      sessionKeys?.map((sessionKey) =>
        requestedAgentId && (sessionKey === "global" || sessionKey === "unknown")
          ? requestedAgentId
          : resolveSessionStoreAgentId(cfg, sessionKey),
      ),
    );
    if (
      agentIds.size > 1 ||
      (requestedAgentId && [...agentIds].some((agentId) => agentId !== requestedAgentId))
    ) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "sessions.search supports one agent per call"),
      );
      return;
    }
    const agentId =
      requestedAgentId ?? agentIds.values().next().value ?? resolveDefaultAgentId(cfg);
    try {
      const result = searchSessionTranscripts({
        agentId,
        query,
        limit: params.limit,
        ...(sessionKeys ? { sessionKeys } : {}),
      });
      respond(true, {
        results: result.hits,
        ...(result.indexing ? { indexing: true } : {}),
        ...(result.truncated ? { truncated: true } : {}),
      });
    } catch (error) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
    }
  },
  "sessions.list": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateSessionsListParams, "sessions.list", respond)) return;
    const p = params;
    const cfg = context.getRuntimeConfig();
    const configuredAgentsOnly = p.configuredAgentsOnly === true;
    respond(
      true,
      await measureDiagnosticsTimelineSpan(
        "gateway.sessions.list",
        async () => {
          const { storePath, store } = measureDiagnosticsTimelineSpanSync(
            "gateway.sessions.list.store_load",
            () => loadCombinedSessionStoreForGateway(cfg, { agentId: p.agentId }),
            {
              config: cfg,
              phase: "sessions.list",
              attributes: {
                agentId: p.agentId ?? null,
                configuredAgentsOnly,
              },
            },
          );
          const listStore = configuredAgentsOnly
            ? filterSessionStoreToConfiguredAgents(cfg, store)
            : store;
          const modelCatalog = await measureDiagnosticsTimelineSpan(
            "gateway.sessions.list.model_catalog",
            () => loadOptionalServerMethodModelCatalog(context, "sessions.list"),
            {
              config: cfg,
              phase: "sessions.list",
            },
          );
          const result = await measureDiagnosticsTimelineSpan(
            "gateway.sessions.list.rows",
            () =>
              listSessionsFromStoreAsync({
                cfg,
                storePath,
                store: listStore,
                modelCatalog,
                opts: p,
              }),
            {
              config: cfg,
              phase: "sessions.list",
              attributes: { storeEntries: Object.keys(listStore).length },
            },
          );
          const placementsBySessionId = context.workerSessionPlacementService?.getMany(
            result.sessions.flatMap((session) => (session.sessionId ? [session.sessionId] : [])),
          );
          const sessions = measureDiagnosticsTimelineSpanSync(
            "gateway.sessions.list.active_run_flags",
            () => {
              return result.sessions.map((session) => {
                const placementRecord = session.sessionId
                  ? placementsBySessionId?.get(session.sessionId)
                  : void 0;
                const activeRunState = resolveVisibleActiveSessionRunState({
                  context,
                  requestedKey: session.key,
                  canonicalKey: session.key,
                  sessionId: session.sessionId,
                  ...(session.key === "global" && p.agentId ? { agentId: p.agentId } : {}),
                  defaultAgentId: resolveDefaultAgentId(cfg),
                });
                return Object.assign({}, session, {
                  hasActiveRun: activeRunState.active,
                  ...(placementRecord
                    ? { placement: projectWorkerSessionPlacement(placementRecord) }
                    : {}),
                  ...(activeRunState.runIds.length > 0
                    ? { activeRunIds: activeRunState.runIds }
                    : {}),
                });
              });
            },
            {
              config: cfg,
              phase: "sessions.list",
              attributes: { sessions: result.sessions.length },
            },
          );
          return {
            ...result,
            sessions,
          };
        },
        {
          config: cfg,
          phase: "sessions.list",
          attributes: {
            agentId: p.agentId ?? null,
            configuredAgentsOnly,
          },
        },
      ),
      void 0,
    );
  },
  "sessions.cleanup": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateSessionsCleanupParams, "sessions.cleanup", respond))
      return;
    const p = params;
    try {
      const { mode, appliedSummaries } = await runSessionsCleanup({
        cfg: context.getRuntimeConfig(),
        opts: {
          agent: p.agent,
          allAgents: p.allAgents,
          enforce: p.enforce,
          activeKey: p.activeKey,
          fixMissing: p.fixMissing,
          fixDmScope: p.fixDmScope,
        },
      });
      respond(
        true,
        serializeSessionCleanupResult({
          mode,
          dryRun: false,
          summaries: appliedSummaries,
        }),
        void 0,
      );
      for (const summary of appliedSummaries) {
        emitSessionsChanged(context, {
          reason: "cleanup",
          sessionKey: void 0,
        });
        if (summary.wouldMutate)
          context.logGateway.debug(
            `sessions.cleanup applied ${summary.storePath}: ${summary.beforeCount} -> ${summary.afterCount}`,
          );
      }
    } catch (error) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error)));
    }
  },
  "sessions.subscribe": ({ client, context, respond }) => {
    const connId = client?.connId?.trim();
    if (connId) context.subscribeSessionEvents(connId);
    respond(true, { subscribed: Boolean(connId) }, void 0);
  },
  "sessions.unsubscribe": ({ client, context, respond }) => {
    const connId = client?.connId?.trim();
    if (connId) context.unsubscribeSessionEvents(connId);
    respond(true, { subscribed: false }, void 0);
  },
  "sessions.messages.subscribe": ({ params, client, context, respond }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsMessagesSubscribeParams,
        "sessions.messages.subscribe",
        respond,
      )
    )
      return;
    const connId = client?.connId?.trim();
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    if (p.includeApprovals === true && !canReviewOperatorApproval(client)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `sessions.messages.subscribe includeApprovals requires a paired device and gateway scope: ${APPROVALS_SCOPE}`,
        ),
      );
      return;
    }
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const requestedAgentId = requestedAgent.agentId;
    const { canonicalKey } = loadSessionEntry(key, { agentId: requestedAgentId });
    const subscriptionKey = resolveSessionMessageSubscriptionKey({
      canonicalKey,
      agentId: requestedAgentId,
      defaultAgentId: resolveDefaultAgentId(cfg),
    });
    if (connId) {
      let approvalReplay;
      if (p.includeApprovals === true) {
        const rollbackSubscription = context.subscribeSessionMessageEvents(
          connId,
          subscriptionKey,
          { includeApprovals: true },
        );
        try {
          approvalReplay = context.listSessionPendingApprovals?.(subscriptionKey, client);
        } catch (error) {
          rollbackSubscription?.();
          context.logGateway.error(`session approval replay failed: ${String(error)}`);
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.UNAVAILABLE, "session approval replay unavailable"),
          );
          return;
        }
        if (!approvalReplay) {
          rollbackSubscription?.();
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.UNAVAILABLE, "session approval replay unavailable"),
          );
          return;
        }
      } else context.subscribeSessionMessageEvents(connId, subscriptionKey);
      respond(
        true,
        {
          subscribed: true,
          key: canonicalKey,
          ...(p.includeApprovals === true ? { approvalReplay } : {}),
        },
        void 0,
      );
      return;
    }
    respond(
      true,
      {
        subscribed: false,
        key: canonicalKey,
      },
      void 0,
    );
  },
  "sessions.messages.unsubscribe": ({ params, client, context, respond }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsMessagesUnsubscribeParams,
        "sessions.messages.unsubscribe",
        respond,
      )
    )
      return;
    const connId = client?.connId?.trim();
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const requestedAgentId = requestedAgent.agentId;
    const { canonicalKey } = loadSessionEntry(key, { agentId: requestedAgentId });
    const subscriptionKey = resolveSessionMessageSubscriptionKey({
      canonicalKey,
      agentId: requestedAgentId,
      defaultAgentId: resolveDefaultAgentId(cfg),
    });
    if (connId) context.unsubscribeSessionMessageEvents(connId, subscriptionKey);
    respond(
      true,
      {
        subscribed: false,
        key: canonicalKey,
      },
      void 0,
    );
  },
  "sessions.preview": ({ params, respond, context }) => {
    if (!assertValidParams(params, validateSessionsPreviewParams, "sessions.preview", respond))
      return;
    const p = params;
    const keys = (Array.isArray(p.keys) ? p.keys : [])
      .map((key) => normalizeOptionalString(key ?? ""))
      .filter((key) => Boolean(key))
      .slice(0, 64);
    const limit =
      typeof p.limit === "number" && Number.isFinite(p.limit) ? Math.max(1, p.limit) : 12;
    const maxChars =
      typeof p.maxChars === "number" && Number.isFinite(p.maxChars)
        ? Math.max(20, p.maxChars)
        : 240;
    if (keys.length === 0) {
      respond(
        true,
        {
          ts: Date.now(),
          previews: [],
        },
        void 0,
      );
      return;
    }
    const cfg = context.getRuntimeConfig();
    const storeCache = /* @__PURE__ */ new Map();
    const previews = [];
    for (const key of keys)
      try {
        const cachedStoreTarget = resolveGatewaySessionStoreTargetWithStore({
          cfg,
          key,
        });
        const store = storeCache.get(cachedStoreTarget.storePath) ?? cachedStoreTarget.store;
        storeCache.set(cachedStoreTarget.storePath, store);
        const target = resolveGatewaySessionStoreTarget({
          cfg,
          key,
          store,
        });
        const entry = resolveFreshestSessionEntryFromStoreKeys(store, target.storeKeys);
        if (!entry?.sessionId) {
          previews.push({
            key,
            status: "missing",
            items: [],
          });
          continue;
        }
        const items = readSessionPreviewItemsFromTranscript(
          {
            agentId: target.agentId,
            sessionEntry: entry,
            sessionId: entry.sessionId,
            sessionKey: target.canonicalKey,
            storePath: target.storePath,
          },
          limit,
          maxChars,
        );
        previews.push({
          key,
          status: items.length > 0 ? "ok" : "empty",
          items,
        });
      } catch {
        previews.push({
          key,
          status: "error",
          items: [],
        });
      }
    respond(
      true,
      {
        ts: Date.now(),
        previews,
      },
      void 0,
    );
  },
  "sessions.describe": ({ params, respond, context }) => {
    if (!assertValidParams(params, validateSessionsDescribeParams, "sessions.describe", respond))
      return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    const cfg = context.getRuntimeConfig();
    const { target, storePath, store, entry } = loadSessionEntriesForTarget({
      key,
      cfg,
    });
    if (!entry) {
      respond(true, { session: null }, void 0);
      return;
    }
    const row = buildGatewaySessionRow({
      cfg,
      storePath,
      store,
      key: target.canonicalKey,
      entry,
      includeDerivedTitles: p.includeDerivedTitles,
      includeLastMessage: p.includeLastMessage,
      transcriptUsageMaxBytes: 64 * 1024,
    });
    const placement = row.sessionId
      ? context.workerSessionPlacementService?.getMany([row.sessionId]).get(row.sessionId)
      : void 0;
    respond(
      true,
      {
        session: placement
          ? {
              ...row,
              placement: projectWorkerSessionPlacement(placement),
            }
          : row,
      },
      void 0,
    );
  },
  "sessions.resolve": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateSessionsResolveParams, "sessions.resolve", respond))
      return;
    const p = params;
    const resolved = await resolveSessionKeyFromResolveParams({
      cfg: context.getRuntimeConfig(),
      p,
    });
    if (!resolved.ok) {
      respond(false, void 0, resolved.error);
      return;
    }
    if ("missing" in resolved) {
      respond(true, { ok: false }, void 0);
      return;
    }
    respond(
      true,
      {
        ok: true,
        key: resolved.key,
      },
      void 0,
    );
  },
  "sessions.compaction.list": ({ params, respond, context }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsCompactionListParams,
        "sessions.compaction.list",
        respond,
      )
    )
      return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const { entry, canonicalKey } = loadAccessorSessionEntryForGatewayTarget({
      key,
      cfg,
      agentId: requestedAgent.agentId,
    });
    respond(
      true,
      {
        ok: true,
        key: canonicalKey,
        checkpoints: listSessionCompactionCheckpoints(entry),
      },
      void 0,
    );
  },
  "sessions.compaction.get": ({ params, respond, context }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsCompactionGetParams,
        "sessions.compaction.get",
        respond,
      )
    )
      return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    const checkpointId = normalizeOptionalString(p.checkpointId) ?? "";
    if (!checkpointId) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "checkpointId required"));
      return;
    }
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const { entry, canonicalKey } = loadAccessorSessionEntryForGatewayTarget({
      key,
      cfg,
      agentId: requestedAgent.agentId,
    });
    const checkpoint = getSessionCompactionCheckpoint({
      entry,
      checkpointId,
    });
    if (!checkpoint) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`),
      );
      return;
    }
    respond(
      true,
      {
        ok: true,
        key: canonicalKey,
        checkpoint,
      },
      void 0,
    );
  },
  "sessions.create": async ({ req, params, respond, context, client, isWebchatConnect }) => {
    if (!assertValidParams(params, validateSessionsCreateParams, "sessions.create", respond))
      return;
    const p = params;
    const cfg = context.getRuntimeConfig();
    const catalogId = normalizeOptionalString(p.catalogId);
    if (catalogId && p.model) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create catalogId cannot include model"),
      );
      return;
    }
    if (catalogId && p.key) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create catalogId cannot include key"),
      );
      return;
    }
    const catalogRequestedKey = normalizeOptionalString(p.key) ?? "global";
    const catalogAgentId = catalogId
      ? normalizeAgentId(
          normalizeOptionalString(p.agentId) ??
            parseAgentSessionKey(catalogRequestedKey)?.agentId ??
            resolveDefaultAgentId(cfg),
        )
      : void 0;
    const catalogRequestedAgent = catalogAgentId
      ? resolveRequestedSessionAgentId(cfg, catalogRequestedKey, catalogAgentId)
      : void 0;
    if (catalogRequestedAgent && !catalogRequestedAgent.ok) {
      respond(false, void 0, catalogRequestedAgent.error);
      return;
    }
    const catalogTarget =
      catalogId && catalogAgentId
        ? resolveSessionCatalogCreateTarget(catalogId, catalogAgentId)
        : void 0;
    if (catalogTarget && !catalogTarget.ok) {
      respond(
        false,
        void 0,
        errorShape(
          catalogTarget.unknownCatalog ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE,
          catalogTarget.message,
        ),
      );
      return;
    }
    const initialTurn = resolveSessionCreateInitialTurn(p);
    if (!initialTurn) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "sessions.create attachments require usable content",
        ),
      );
      return;
    }
    const {
      attachments: initialAttachments,
      hasInitialTurn,
      message: initialMessage,
    } = initialTurn;
    const requestedCwd = normalizeOptionalString(p.cwd);
    const requestedExecNode = normalizeOptionalString(p.execNode);
    if (requestedCwd && p.worktree !== true && !requestedExecNode) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "sessions.create cwd requires worktree=true or execNode",
        ),
      );
      return;
    }
    if (
      !(
        !requestedCwd ||
        path.isAbsolute(requestedCwd) ||
        Boolean(requestedExecNode && path.win32.isAbsolute(requestedCwd))
      )
    ) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create cwd must be absolute"),
      );
      return;
    }
    if (requestedExecNode && p.worktree === true) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create worktree cannot target execNode"),
      );
      return;
    }
    const requestedWorktreeBaseRef = normalizeOptionalString(p.worktreeBaseRef);
    const requestedWorktreeName = normalizeOptionalString(p.worktreeName);
    if ((requestedWorktreeBaseRef || requestedWorktreeName) && p.worktree !== true) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "sessions.create worktreeBaseRef/worktreeName require worktree=true",
        ),
      );
      return;
    }
    let sessionKey = p.key;
    let sessionAgentId = catalogAgentId ?? p.agentId;
    let sessionWorktree;
    const sessionExecCwd = requestedExecNode ? requestedCwd : void 0;
    let sessionCwd;
    let sessionSourceRoot;
    let provisionedSessionWorktree = false;
    if (p.worktree === true) {
      const explicitKey = normalizeOptionalString(p.key);
      const requestedKey = explicitKey ?? "global";
      const requestedAgent = resolveRequestedSessionAgentId(cfg, requestedKey, p.agentId);
      if (!requestedAgent.ok) {
        respond(false, void 0, requestedAgent.error);
        return;
      }
      const agentId = normalizeAgentId(
        requestedAgent.agentId ??
          normalizeOptionalString(p.agentId) ??
          parseAgentSessionKey(requestedKey)?.agentId ??
          resolveDefaultAgentId(cfg),
      );
      let targetKey = explicitKey;
      let preservesUnspecifiedKey = false;
      const parentSessionKey = normalizeOptionalString(p.parentSessionKey);
      if (
        !targetKey &&
        parentSessionKey &&
        p.emitCommandHooks === true &&
        !hasInitialTurn &&
        cfg.session?.dmScope === "main"
      ) {
        const parent = loadSessionEntry(
          parentSessionKey,
          requestedAgent.agentId ? { agentId: requestedAgent.agentId } : void 0,
        );
        const parentAgentId = normalizeAgentId(
          requestedAgent.agentId ?? resolveSessionStoreAgentId(cfg, parent.canonicalKey),
        );
        if (
          parent.entry?.sessionId &&
          parent.canonicalKey ===
            resolveAgentMainSessionKey({
              cfg,
              agentId: parentAgentId,
            })
        ) {
          targetKey = parent.canonicalKey;
          preservesUnspecifiedKey = true;
        }
      }
      targetKey ??= buildDashboardSessionKey(agentId);
      const target = resolveGatewaySessionStoreTarget({
        cfg,
        key: targetKey,
        agentId,
      });
      sessionKey = preservesUnspecifiedKey ? void 0 : targetKey;
      sessionAgentId = target.agentId;
      const workspace = requestedCwd ?? resolveAgentWorkspaceDir(cfg, target.agentId);
      if (!insideGitCheckout(workspace)) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "agent workspace is not a git checkout"),
        );
        return;
      }
      try {
        const requestedRepository = await managedWorktrees.resolveRepositoryPaths(workspace);
        sessionSourceRoot = requestedRepository.sourceRoot;
        const existing = managedWorktrees.findLiveByOwner("session", target.canonicalKey);
        let existingDirectory = false;
        if (existing)
          try {
            existingDirectory = fs.lstatSync(existing.path).isDirectory();
          } catch {}
        if (existing && existingDirectory) {
          if (existing.repoRoot !== requestedRepository.canonicalRoot) {
            respond(
              false,
              void 0,
              errorShape(
                ErrorCodes.INVALID_REQUEST,
                "session worktree belongs to a different repository",
              ),
            );
            return;
          }
          if (
            (requestedWorktreeName && existing.name !== requestedWorktreeName) ||
            requestedWorktreeBaseRef
          ) {
            respond(
              false,
              void 0,
              errorShape(
                ErrorCodes.INVALID_REQUEST,
                `session is already bound to worktree ${existing.name} (${existing.branch})`,
              ),
            );
            return;
          }
          sessionWorktree = existing;
        } else {
          const scopes = Array.isArray(client?.connect.scopes) ? client.connect.scopes : [];
          sessionWorktree = await managedWorktrees.create({
            repoRoot: workspace,
            ownerKind: "session",
            ownerId: target.canonicalKey,
            name: requestedWorktreeName,
            baseRef: requestedWorktreeBaseRef,
            runSetupScript: scopes.includes(ADMIN_SCOPE),
          });
          provisionedSessionWorktree = true;
        }
      } catch (error) {
        respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
        return;
      }
      sessionCwd = sessionWorktree.path;
      try {
        const relative = path.relative(
          sessionSourceRoot ?? fs.realpathSync(sessionWorktree.repoRoot),
          fs.realpathSync(workspace),
        );
        if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
          sessionCwd = path.join(sessionWorktree.path, relative);
          fs.mkdirSync(sessionCwd, { recursive: true });
        }
      } catch {
        sessionCwd = sessionWorktree.path;
      }
    }
    let runPayload;
    let runError;
    let runMeta;
    let messageSeq;
    const created = await createGatewaySession({
      cfg,
      key: sessionKey,
      agentId: sessionAgentId,
      label: p.label,
      ...(catalogTarget ? { catalogTarget: catalogTarget.target } : { model: p.model }),
      parentSessionKey: p.parentSessionKey,
      spawnedCwd: sessionCwd,
      worktree: sessionWorktree
        ? {
            id: sessionWorktree.id,
            branch: sessionWorktree.branch,
            repoRoot: sessionWorktree.repoRoot,
          }
        : void 0,
      execNode: requestedExecNode,
      execCwd: sessionExecCwd,
      clearExecBinding: !requestedExecNode,
      clearSpawnedCwd: p.worktree !== true,
      fork: p.fork,
      emitCommandHooks: p.emitCommandHooks,
      resetMainWhenUnspecified: !hasInitialTurn,
      commandSource: "webchat",
      loadGatewayModelCatalog: context.loadGatewayModelCatalog,
      afterCreate: hasInitialTurn
        ? async ({ key, agentId, entry, storePath }) => {
            messageSeq =
              (await readSessionMessageCountAsync({
                agentId,
                sessionEntry: entry,
                sessionId: entry.sessionId,
                sessionKey: key,
                storePath,
              })) + 1;
            await expectDefined(
              chatHandlers["chat.send"],
              "chat.send handler",
            )({
              req,
              params: {
                sessionKey: key,
                ...(key === "global" ? { agentId } : {}),
                message: initialMessage ?? "",
                idempotencyKey: randomUUID(),
                ...(initialAttachments ? { attachments: initialAttachments } : {}),
              },
              respond: (ok, payload, error, meta) => {
                if (ok && payload && typeof payload === "object") runPayload = payload;
                else runError = error;
                runMeta = meta;
              },
              context,
              client,
              isWebchatConnect,
            });
          }
        : void 0,
    });
    if (!created.ok) {
      if (sessionWorktree && provisionedSessionWorktree)
        try {
          await managedWorktrees.remove({
            id: sessionWorktree.id,
            reason: "session-create-failed",
            force: true,
          });
        } catch (error) {
          log.warn(
            `failed to clean up worktree after session creation failed: ${formatErrorMessage(error)}`,
          );
        }
      respond(false, void 0, created.error);
      return;
    }
    if (p.worktree !== true)
      try {
        const owned = managedWorktrees.findLiveByOwner("session", created.key);
        if (owned) await managedWorktrees.removeIfLossless(owned.id);
      } catch (error) {
        log.warn(
          `failed to release worktree for reset session ${created.key}: ${formatErrorMessage(error)}`,
        );
      }
    const createdWorktree = sessionWorktree
      ? {
          id: sessionWorktree.id,
          path: sessionWorktree.path,
          branch: sessionWorktree.branch,
        }
      : void 0;
    if (created.resetExisting) {
      respond(
        true,
        {
          ok: true,
          key: created.key,
          sessionId: created.entry.sessionId,
          entry: created.entry,
          resolved: created.resolved,
          runStarted: false,
          ...(createdWorktree ? { worktree: createdWorktree } : {}),
        },
        void 0,
      );
      emitSessionsChanged(context, {
        sessionKey: created.key,
        ...(created.key === "global" ? { agentId: created.agentId } : {}),
        reason: "new",
      });
      return;
    }
    const runStarted =
      runPayload !== void 0 &&
      shouldAttachPendingMessageSeq({
        payload: runPayload,
        cached: runMeta?.cached === true,
      });
    respond(
      true,
      {
        ok: true,
        key: created.key,
        sessionId: created.entry.sessionId,
        entry: created.entry,
        runStarted,
        ...(runPayload ? runPayload : {}),
        ...(runStarted && typeof messageSeq === "number" ? { messageSeq } : {}),
        ...(runError ? { runError } : {}),
        resolved: created.resolved,
        ...(createdWorktree ? { worktree: createdWorktree } : {}),
      },
      void 0,
    );
    emitSessionsChanged(context, {
      sessionKey: created.key,
      ...(created.key === "global" ? { agentId: created.agentId } : {}),
      reason: "create",
    });
    if (runStarted)
      emitSessionsChanged(context, {
        sessionKey: created.key,
        ...(created.key === "global" ? { agentId: created.agentId } : {}),
        reason: "send",
      });
  },
  "sessions.compaction.branch": async ({ params, respond, context }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsCompactionBranchParams,
        "sessions.compaction.branch",
        respond,
      )
    )
      return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    const checkpointId =
      typeof p.checkpointId === "string" && p.checkpointId.trim() ? p.checkpointId.trim() : "";
    if (!checkpointId) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "checkpointId required"));
      return;
    }
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const { entry, canonicalKey, sessionStoreKey, target, storePath } =
      loadAccessorSessionEntryForGatewayTarget({
        key,
        cfg,
        agentId: requestedAgent.agentId,
      });
    if (!entry?.sessionId) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
      return;
    }
    if (
      !getSessionCompactionCheckpoint({
        entry,
        checkpointId,
      })
    ) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`),
      );
      return;
    }
    const nextKey = buildDashboardSessionKey(target.agentId);
    const branchedSession = await compactionCheckpointStore.branchCheckpointSession({
      agentId: target.agentId,
      storePath,
      sourceKey: canonicalKey,
      sourceStoreKey: sessionStoreKey,
      nextKey,
      checkpointId,
    });
    if (
      branchedSession.status === "missing-checkpoint" ||
      branchedSession.status === "missing-boundary"
    ) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`),
      );
      return;
    }
    if (branchedSession.status === "missing-session") {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
      return;
    }
    if (branchedSession.status === "model-selection-locked") {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE),
      );
      return;
    }
    if (branchedSession.status === "failed") {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.UNAVAILABLE, "failed to create checkpoint branch transcript"),
      );
      return;
    }
    respond(
      true,
      {
        ok: true,
        sourceKey: canonicalKey,
        key: branchedSession.key,
        sessionId: branchedSession.entry.sessionId,
        checkpoint: branchedSession.checkpoint,
        entry: branchedSession.entry,
      },
      void 0,
    );
    emitSessionsChanged(context, {
      sessionKey: canonicalKey,
      ...(canonicalKey === "global" && requestedAgent.agentId
        ? { agentId: requestedAgent.agentId }
        : {}),
      reason: "checkpoint-branch",
    });
    emitSessionsChanged(context, {
      sessionKey: branchedSession.key,
      reason: "checkpoint-branch",
    });
  },
  "sessions.compaction.restore": async ({
    req,
    params,
    respond,
    context,
    client,
    isWebchatConnect,
  }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsCompactionRestoreParams,
        "sessions.compaction.restore",
        respond,
      )
    )
      return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    if (
      rejectWebchatSessionMutation({
        action: "restore",
        client,
        isWebchatConnect,
        respond,
      })
    )
      return;
    const checkpointId =
      typeof p.checkpointId === "string" && p.checkpointId.trim() ? p.checkpointId.trim() : "";
    if (!checkpointId) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "checkpointId required"));
      return;
    }
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const { entry, canonicalKey, sessionStoreKey, storePath } =
      loadAccessorSessionEntryForGatewayTarget({
        key,
        cfg,
        agentId: requestedAgent.agentId,
      });
    if (!entry?.sessionId) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
      return;
    }
    if (
      !getSessionCompactionCheckpoint({
        entry,
        checkpointId,
      })
    ) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`),
      );
      return;
    }
    const initialPlacementError = resolveSessionWorkerPlacementMutationError({
      action: "restore",
      context,
      key,
      sessionId: entry.sessionId,
    });
    if (initialPlacementError) {
      respondSessionWorkerPlacementMutationError(initialPlacementError, respond);
      return;
    }
    const lifecycleIdentities = [
      key,
      canonicalKey,
      sessionStoreKey,
      entry.sessionId,
      entry.lifecycleRevision,
    ];
    const restoreLockIdentities = [entry.sessionId, entry.lifecycleRevision];
    let admittedWorkReleased = true;
    let restoreTargetStillCurrent = true;
    let restoreBlockedByModelLock = false;
    let restorePlacementError;
    await runExclusiveSessionLifecycleMutation({
      scope: storePath,
      identities: restoreLockIdentities,
      prepare: async () => {
        const current = loadAccessorSessionEntryForGatewayTarget({
          key,
          cfg,
          agentId: requestedAgent.agentId,
        });
        const currentCheckpoint = current.entry
          ? getSessionCompactionCheckpoint({
              entry: current.entry,
              checkpointId,
            })
          : void 0;
        restoreTargetStillCurrent =
          current.entry?.sessionId === entry.sessionId &&
          current.entry.lifecycleRevision === entry.lifecycleRevision &&
          currentCheckpoint !== void 0;
        if (!restoreTargetStillCurrent) return;
        restoreBlockedByModelLock = current.entry?.modelSelectionLocked === true;
        if (restoreBlockedByModelLock) return;
        restorePlacementError = resolveSessionWorkerPlacementMutationError({
          action: "restore",
          context,
          key,
          sessionId: current.entry?.sessionId,
        });
        if (restorePlacementError) return;
        clearSessionQueues([
          key,
          current.canonicalKey,
          current.sessionStoreKey,
          current.entry?.sessionId,
        ]);
        admittedWorkReleased = await interruptSessionWorkAdmissions({
          scope: storePath,
          identities: lifecycleIdentities,
          timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
        });
      },
      run: async () => {
        if (!restoreTargetStillCurrent) {
          respond(
            false,
            void 0,
            errorShape(
              ErrorCodes.INVALID_REQUEST,
              `Session ${key} changed before checkpoint restore. Retry.`,
              { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } },
            ),
          );
          return;
        }
        if (restoreBlockedByModelLock) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE),
          );
          return;
        }
        if (restorePlacementError) {
          respondSessionWorkerPlacementMutationError(restorePlacementError, respond);
          return;
        }
        if (!admittedWorkReleased) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`),
          );
          return;
        }
        const current = loadAccessorSessionEntryForGatewayTarget({
          key,
          cfg,
          agentId: requestedAgent.agentId,
        });
        if (!current.entry?.sessionId) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`),
          );
          return;
        }
        if (current.entry.modelSelectionLocked === true) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE),
          );
          return;
        }
        if (
          !getSessionCompactionCheckpoint({
            entry: current.entry,
            checkpointId,
          })
        ) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`),
          );
          return;
        }
        const interruptResult = await interruptSessionRunIfActive({
          req,
          context,
          client,
          isWebchatConnect,
          requestedKey: key,
          canonicalKey: current.canonicalKey,
          agentId: requestedAgent.agentId,
          sessionId: current.entry.sessionId,
        });
        if (interruptResult.error) {
          respond(false, void 0, interruptResult.error);
          return;
        }
        const restoredSession = await compactionCheckpointStore.restoreCheckpointSession({
          agentId: requestedAgent.agentId,
          storePath,
          sessionKey: current.canonicalKey,
          sessionStoreKey: current.sessionStoreKey,
          checkpointId,
        });
        if (
          restoredSession.status === "missing-checkpoint" ||
          restoredSession.status === "missing-boundary"
        ) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, `checkpoint not found: ${checkpointId}`),
          );
          return;
        }
        if (restoredSession.status === "missing-session") {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`),
          );
          return;
        }
        if (restoredSession.status === "model-selection-locked") {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, MODEL_SELECTION_LOCKED_CHECKPOINT_MESSAGE),
          );
          return;
        }
        if (restoredSession.status === "failed") {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.UNAVAILABLE, "failed to restore checkpoint transcript"),
          );
          return;
        }
        respond(
          true,
          {
            ok: true,
            key: restoredSession.key,
            sessionId: restoredSession.entry.sessionId,
            checkpoint: restoredSession.checkpoint,
            entry: restoredSession.entry,
          },
          void 0,
        );
        emitSessionsChanged(context, {
          sessionKey: current.canonicalKey,
          ...(current.canonicalKey === "global" && requestedAgent.agentId
            ? { agentId: requestedAgent.agentId }
            : {}),
          reason: "checkpoint-restore",
        });
      },
    });
  },
  "sessions.dispatch": async ({ params, respond, context, client, isWebchatConnect }) => {
    if (!assertValidParams(params, validateSessionsDispatchParams, "sessions.dispatch", respond))
      return;
    const key = requireSessionKey(params.key, respond);
    if (!key) return;
    if (
      rejectWebchatSessionMutation({
        action: "dispatch",
        client,
        isWebchatConnect,
        respond,
      })
    )
      return;
    const dispatchService = context.workerPlacementDispatchService;
    const placementReader = context.workerSessionPlacementService;
    if (!dispatchService || !placementReader) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "cloud worker dispatch is not configured"),
      );
      return;
    }
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, params.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    if (!Object.hasOwn(cfg.cloudWorkers?.profiles ?? {}, params.profileId)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `cloud worker profile is not configured: ${params.profileId}`,
        ),
      );
      return;
    }
    const target = loadAccessorSessionEntryForGatewayTarget({
      key,
      cfg,
      agentId: requestedAgent.agentId,
    });
    const entry = target.entry;
    const sessionId = normalizeOptionalString(entry?.sessionId);
    if (!entry || !sessionId) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
      return;
    }
    if (entry.archivedAt !== void 0) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "cannot dispatch an archived session"),
      );
      return;
    }
    const sessionRuntime = resolveWorkerPlacementSessionRuntime({
      cfg,
      entry,
      agentId: target.target.agentId,
      sessionKey: target.canonicalKey,
    });
    if (!isWorkerPlacementSessionRuntimeSupported(sessionRuntime)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `cloud worker dispatch requires the OpenClaw runtime, not ${sessionRuntime}`,
        ),
      );
      return;
    }
    const existingPlacement = placementReader.getMany([sessionId]).get(sessionId);
    if (
      existingPlacement &&
      existingPlacement.state !== "local" &&
      existingPlacement.state !== "reclaimed"
    ) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `session cannot dispatch from placement ${existingPlacement.state}`,
        ),
      );
      return;
    }
    const worktree = managedWorktrees.findLiveByOwner("session", target.canonicalKey);
    if (
      !target.entry?.worktree?.id ||
      !worktree ||
      worktree.id !== target.entry.worktree.id ||
      worktree.ownerId !== target.canonicalKey
    ) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "sessions.dispatch requires a session-owned managed worktree",
        ),
      );
      return;
    }
    try {
      const placement = await dispatchService.dispatch({
        sessionId,
        sessionKey: target.canonicalKey,
        agentId: target.target.agentId,
        profileId: params.profileId,
      });
      respond(
        true,
        {
          ok: true,
          key: target.canonicalKey,
          sessionId,
          placement: projectWorkerSessionPlacement(placement),
        },
        void 0,
      );
    } catch (error) {
      respond(
        false,
        void 0,
        errorShape(
          isWorkerDispatchInputError(error) ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE,
          formatErrorMessage(error),
        ),
      );
    }
  },
  "sessions.send": async ({ req, params, respond, context, client, isWebchatConnect }) => {
    await handleSessionSend({
      method: "sessions.send",
      req,
      params,
      respond,
      context,
      client,
      isWebchatConnect,
      interruptIfActive: false,
    });
  },
  "sessions.steer": async ({ req, params, respond, context, client, isWebchatConnect }) => {
    await handleSessionSend({
      method: "sessions.steer",
      req,
      params,
      respond,
      context,
      client,
      isWebchatConnect,
      interruptIfActive: true,
    });
  },
  "sessions.abort": async ({ req, params, respond, context, client, isWebchatConnect }) => {
    if (!assertValidParams(params, validateSessionsAbortParams, "sessions.abort", respond)) return;
    const p = params;
    const cfg = context.getRuntimeConfig();
    const requestedRunId = readStringValue(p.runId);
    const requestedKey = normalizeOptionalString(p.key);
    const requestedParamAgentId = normalizeOptionalString(p.agentId);
    const workerRunSessionId = requestedRunId
      ? asWorkerInferenceControl(context.workerEnvironmentService)?.resolveInferenceSessionForRunId(
          requestedRunId,
        )
      : void 0;
    const workerRunTarget = workerRunSessionId
      ? resolveWorkerSessionTarget(cfg, workerRunSessionId)
      : void 0;
    const scopedRequestedKey = resolveScopedAbortKey({
      cfg,
      key: requestedKey,
      agentId: requestedParamAgentId,
    });
    if (requestedKey && requestedParamAgentId && !scopedRequestedKey) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId"),
      );
      return;
    }
    const requestedKeyAgentId = scopedRequestedKey
      ? resolveSessionKeyAgentId(scopedRequestedKey, cfg)
      : void 0;
    const activeRun = requestedRunId ? context.chatAbortControllers.get(requestedRunId) : void 0;
    const activeRunSessionKey = activeRun?.sessionKey;
    const activeRunAgentId = normalizeOptionalString(activeRun?.agentId);
    const inferredRunAgentId =
      requestedParamAgentId ??
      (requestedRunId && scopedRequestedKey?.toLowerCase() === "global"
        ? activeRunAgentId
        : void 0) ??
      requestedKeyAgentId ??
      workerRunTarget?.agentId ??
      (requestedRunId && !activeRunSessionKey ? resolveDefaultAgentId(cfg) : void 0);
    const requestedRunAgentId = requestedRunId
      ? inferredRunAgentId
        ? normalizeAgentId(inferredRunAgentId)
        : void 0
      : void 0;
    const scopedActiveRunSessionKey = activeRunSessionKey
      ? requestedRunAgentId
        ? sessionKeyBelongsToAgent(activeRunSessionKey, requestedRunAgentId, cfg)
          ? activeRunSessionKey
          : void 0
        : activeRunSessionKey
      : void 0;
    const keyCandidate =
      scopedRequestedKey ??
      scopedActiveRunSessionKey ??
      (requestedRunId
        ? resolveSessionKeyForRun(requestedRunId, {
            agentId: requestedRunAgentId ?? resolveDefaultAgentId(cfg),
          })
        : void 0) ??
      workerRunTarget?.sessionKey;
    if (!keyCandidate && requestedRunId) {
      respond(true, {
        ok: true,
        abortedRunId: null,
        status: "no-active-run",
      });
      return;
    }
    const key = requireSessionKey(keyCandidate, respond);
    if (!key) return;
    const requestedGlobalAgent = resolveRequestedSessionAgentId(
      cfg,
      key,
      requestedParamAgentId ?? requestedRunAgentId,
    );
    if (!requestedGlobalAgent.ok) {
      respond(false, void 0, requestedGlobalAgent.error);
      return;
    }
    const requestedGlobalAgentId = requestedGlobalAgent.agentId;
    const { canonicalKey } = loadSessionEntry(key, { agentId: requestedGlobalAgentId });
    const resolvedAbortSessionKey = resolveAbortSessionKey({
      context,
      requestedKey: key,
      canonicalKey,
      activeRunSessionKey: scopedActiveRunSessionKey,
      aliasKeys:
        requestedKey &&
        requestedKey !== key &&
        (!requestedParamAgentId ||
          sessionKeyBelongsToAgent(requestedKey, requestedParamAgentId, cfg))
          ? [requestedKey]
          : void 0,
    });
    const abortSessionKey =
      canonicalKey === "global" && requestedGlobalAgentId ? "global" : resolvedAbortSessionKey;
    const abortAgentId =
      abortSessionKey === "global" ? (requestedGlobalAgentId ?? activeRunAgentId) : void 0;
    const preAbortRunKinds = /* @__PURE__ */ new Map();
    if (requestedRunId) preAbortRunKinds.set(requestedRunId, activeRun?.kind);
    else
      for (const [rid, entry] of context.chatAbortControllers)
        preAbortRunKinds.set(rid, entry.kind);
    let abortedRunId = null;
    await expectDefined(
      chatHandlers["chat.abort"],
      "chat.abort handler",
    )({
      req,
      params: {
        sessionKey: abortSessionKey,
        runId: requestedRunId,
        ...(abortAgentId ? { agentId: abortAgentId } : {}),
      },
      respond: (ok, payload, error, meta) => {
        if (!ok) {
          respond(ok, payload, error, meta);
          return;
        }
        const firstAbortedRunId =
          (payload && typeof payload === "object" && Array.isArray(payload.runIds)
            ? payload.runIds.filter((value) => Boolean(normalizeOptionalString(value)))
            : [])[0] ?? null;
        abortedRunId = firstAbortedRunId;
        if (firstAbortedRunId && !Boolean(workerRunSessionId && !activeRun)) {
          const endedAt = Date.now();
          const dedupePrefix =
            preAbortRunKinds.get(firstAbortedRunId) === "agent" ? "agent" : "chat";
          setGatewayDedupeEntry({
            dedupe: context.dedupe,
            key: `${dedupePrefix}:${firstAbortedRunId}`,
            entry: {
              ts: endedAt,
              ok: true,
              payload: {
                status: "timeout",
                runId: firstAbortedRunId,
                ...(abortAgentId ? { agentId: abortAgentId } : {}),
                stopReason: "rpc",
                endedAt,
              },
            },
          });
        }
        respond(
          true,
          {
            ok: true,
            abortedRunId,
            status: abortedRunId ? "aborted" : "no-active-run",
          },
          void 0,
          meta,
        );
      },
      context,
      client,
      isWebchatConnect,
    });
    if (abortedRunId)
      emitSessionsChanged(context, {
        sessionKey: canonicalKey,
        ...(canonicalKey === "global" && abortAgentId ? { agentId: abortAgentId } : {}),
        reason: "abort",
      });
  },
  "sessions.patch": async ({ params, respond, context, client, isWebchatConnect }) => {
    if (!assertValidParams(params, validateSessionsPatchParams, "sessions.patch", respond)) return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    if (
      rejectWebchatSessionMutation({
        action: "patch",
        client,
        isWebchatConnect,
        respond,
      })
    )
      return;
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const requestedAgentId = requestedAgent.agentId;
    const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, {
      agentId: requestedAgentId,
    });
    const canonicalKey = target.canonicalKey ?? key;
    const lifecycleEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
    const missingHarnessSessionError = resolveMissingAgentHarnessSessionError(
      canonicalKey,
      lifecycleEntry,
    );
    if (missingHarnessSessionError) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, missingHarnessSessionError));
      return;
    }
    const initialPlacementPatchError = resolveSessionWorkerPlacementPatchError({
      agentId: target.agentId,
      cfg,
      context,
      entry: lifecycleEntry,
      key,
      patch: p,
      sessionKey: canonicalKey,
      validateModelRuntime: false,
    });
    if (initialPlacementPatchError) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, initialPlacementPatchError));
      return;
    }
    const lifecycleIdentities = [canonicalKey, key, lifecycleEntry?.sessionId];
    if (p.archived === true && isSessionLifecycleMutationActive(storePath, lifecycleIdentities)) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive a session with an active run."),
      );
      return;
    }
    let patchModelCatalog;
    const loadPatchModelCatalog = async () => {
      const catalog = await context.loadGatewayModelCatalog();
      patchModelCatalog = catalog;
      return catalog;
    };
    const applyPatch = async () => {
      const currentLifecycleEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
      const lifecycleEntryRemoved = lifecycleEntry !== void 0 && currentLifecycleEntry === void 0;
      const archiveTargetChanged =
        p.archived === true &&
        (lifecycleEntry === void 0
          ? currentLifecycleEntry !== void 0
          : currentLifecycleEntry !== void 0 &&
            (currentLifecycleEntry.sessionId !== lifecycleEntry.sessionId ||
              currentLifecycleEntry.lifecycleRevision !== lifecycleEntry.lifecycleRevision));
      if (lifecycleEntryRemoved || archiveTargetChanged) {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before patch. Retry.`),
        );
        return null;
      }
      if (p.archived === true) {
        if (canonicalKey === "global" || isAgentMainSessionKey(cfg, canonicalKey)) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive an agent's main session."),
          );
          return null;
        }
        const { entry } = loadSessionEntry(key, { agentId: requestedAgentId });
        const activeIdentities = [canonicalKey, key, entry?.sessionId];
        if (
          isSessionWorkAdmissionActive(storePath, activeIdentities) ||
          replyRunRegistry.isActive(canonicalKey) ||
          replyRunRegistry.isActive(key) ||
          hasVisibleActiveSessionRun({
            context,
            requestedKey: key,
            canonicalKey,
            sessionId: entry?.sessionId,
            defaultAgentId: resolveDefaultAgentId(cfg),
          })
        ) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.INVALID_REQUEST, "Cannot archive a session with an active run."),
          );
          return null;
        }
      }
      return await applySessionPatchProjection({
        agentId: target.agentId,
        storePath,
        resolveTarget: ({ entries }) => {
          const store = Object.fromEntries(
            entries.map(({ sessionKey, entry }) => [sessionKey, entry]),
          );
          const { target: migratedTarget, primaryKey } = migrateAndPruneGatewaySessionStoreKey({
            cfg,
            key,
            store,
            agentId: requestedAgentId,
          });
          return {
            primaryKey,
            candidateKeys: migratedTarget.storeKeys,
          };
        },
        project: async ({ primaryKey, existingEntry, entries }) => {
          const projected = await projectSessionsPatchEntry({
            cfg,
            entries,
            existingEntry,
            storeKey: primaryKey,
            agentId: requestedAgentId,
            patch: p,
            loadGatewayModelCatalog: loadPatchModelCatalog,
          });
          if (!projected.ok) return projected;
          const placementPatchError = resolveSessionWorkerPlacementPatchError({
            agentId: target.agentId,
            cfg,
            context,
            entry: projected.entry,
            key,
            patch: p,
            sessionKey: canonicalKey,
            validateModelRuntime: true,
          });
          return placementPatchError
            ? {
                ok: false,
                error: errorShape(ErrorCodes.INVALID_REQUEST, placementPatchError),
              }
            : projected;
        },
      });
    };
    const applied = await runExclusiveSessionLifecycleMutation({
      scope: storePath,
      identities: lifecycleIdentities,
      run: applyPatch,
    });
    if (!applied) return;
    if (!applied.ok) {
      respond(false, void 0, applied.error);
      return;
    }
    triggerSessionPatchHook({
      cfg,
      sessionEntry: applied.entry,
      sessionKey: target.canonicalKey ?? key,
      patch: p,
    });
    const callerScopes = client?.connect ? (client.connect.scopes ?? []) : null;
    const callerCanManageCron = callerScopes === null || callerScopes.includes("operator.admin");
    if (p.archived === true && callerCanManageCron)
      try {
        const disabledJobIds = await disableCronJobsBoundToSession({
          cron: context.cron,
          cfg,
          sessionKey: target.canonicalKey ?? key,
        });
        if (disabledJobIds.length > 0)
          log.info(
            `sessions.patch: disabled cron jobs bound to archived session ${target.canonicalKey ?? key}: ${disabledJobIds.join(", ")}`,
          );
      } catch (error) {
        log.warn(
          `sessions.patch: failed to disable cron jobs for archived session ${target.canonicalKey ?? key}: ${formatErrorMessage(error)}`,
        );
      }
    if (typeof p.category === "string" && p.category.trim())
      ensureSessionGroupRegistered(p.category);
    const parsed = parseAgentSessionKey(target.canonicalKey ?? key);
    const agentId = normalizeAgentId(
      target.canonicalKey === "global"
        ? target.agentId
        : (parsed?.agentId ?? resolveDefaultAgentId(cfg)),
    );
    const resolved = resolveSessionModelRef(cfg, applied.entry, agentId);
    const resolvedDisplayModel = resolveSessionDisplayModelIdentityRef({
      cfg,
      agentId,
      provider: resolved.provider,
      model: resolved.model,
    });
    const thinkingProjection = resolveGatewaySessionThinkingProjection({
      cfg,
      agentId,
      provider: resolvedDisplayModel.provider ?? resolved.provider,
      model: resolvedDisplayModel.model ?? resolved.model,
      sessionKey: target.canonicalKey ?? key,
      entry: applied.entry,
      modelCatalog: patchModelCatalog,
    });
    const resolvedThinkingMetadata =
      patchModelCatalog === void 0
        ? {}
        : {
            thinkingLevel: thinkingProjection.effectiveThinkingLevel,
            thinkingLevels: thinkingProjection.thinkingLevels,
          };
    respond(
      true,
      {
        ok: true,
        path: storePath,
        key: target.canonicalKey,
        entry: applied.entry,
        resolved: {
          modelProvider: resolvedDisplayModel.provider,
          model: resolvedDisplayModel.model,
          agentRuntime: thinkingProjection.agentRuntime,
          ...resolvedThinkingMetadata,
        },
      },
      void 0,
    );
    emitSessionsChanged(context, {
      sessionKey: target.canonicalKey,
      ...(target.canonicalKey === "global" && requestedAgentId
        ? { agentId: requestedAgentId }
        : {}),
      reason: "patch",
    });
  },
  "sessions.pluginPatch": async ({ params, respond, context, client, isWebchatConnect }) => {
    if (
      !assertValidParams(params, validateSessionsPluginPatchParams, "sessions.pluginPatch", respond)
    )
      return;
    const key = requireSessionKey(params.key, respond);
    if (!key) return;
    if (
      rejectWebchatSessionMutation({
        action: "patch",
        client,
        isWebchatConnect,
        respond,
      })
    )
      return;
    if (
      !(Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).includes(
        "operator.admin",
      )
    ) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `sessions.pluginPatch requires gateway scope: ${ADMIN_SCOPE}`,
        ),
      );
      return;
    }
    const pluginId = normalizeOptionalString(params.pluginId);
    const namespace = normalizeOptionalString(params.namespace);
    if (!pluginId || !namespace) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "pluginId and namespace are required"),
      );
      return;
    }
    if (params.unset === true && params.value !== void 0) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "sessions.pluginPatch cannot specify both unset and value",
        ),
      );
      return;
    }
    if (params.value !== void 0 && !isPluginJsonValue(params.value)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "sessions.pluginPatch value must be JSON-compatible",
        ),
      );
      return;
    }
    const patched = await patchPluginSessionExtension({
      cfg: context.getRuntimeConfig(),
      sessionKey: key,
      pluginId,
      namespace,
      value: params.value,
      unset: params.unset === true,
    });
    if (!patched.ok) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, patched.error));
      return;
    }
    respond(
      true,
      {
        ok: true,
        key: patched.key,
        value: patched.value,
      },
      void 0,
    );
    emitSessionsChanged(context, {
      sessionKey: patched.key,
      reason: "plugin-patch",
    });
  },
  "sessions.reset": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateSessionsResetParams, "sessions.reset", respond)) return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    const reason = p.reason === "new" ? "new" : "reset";
    const { performGatewaySessionReset } = await loadSessionsRuntimeModule();
    const result = await performGatewaySessionReset({
      key,
      ...(p.agentId ? { agentId: p.agentId } : {}),
      reason,
      commandSource: "gateway:sessions.reset",
    });
    if (!result.ok) {
      respond(false, void 0, result.error);
      return;
    }
    respond(
      true,
      {
        ok: true,
        key: result.key,
        entry: result.entry,
        resolved: result.resolved,
      },
      void 0,
    );
    emitSessionsChanged(context, {
      sessionKey: result.key,
      ...(result.key === "global" ? { agentId: result.agentId } : {}),
      reason,
    });
  },
  "sessions.delete": async ({ req, params, respond, client, isWebchatConnect, context }) => {
    if (!assertValidParams(params, validateSessionsDeleteParams, "sessions.delete", respond))
      return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    if (
      rejectWebchatSessionMutation({
        action: "delete",
        client,
        isWebchatConnect,
        respond,
      })
    )
      return;
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const requestedAgentId = requestedAgent.agentId;
    const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, {
      agentId: requestedAgentId,
    });
    const mainKey = resolveMainSessionKey(cfg);
    const isSelectedNonDefaultGlobal =
      target.canonicalKey === "global" &&
      requestedAgentId !== void 0 &&
      requestedAgentId !== resolveDefaultAgentId(cfg);
    if (target.canonicalKey === mainKey && !isSelectedNonDefaultGlobal) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `Cannot delete the main session (${mainKey}).`),
      );
      return;
    }
    const deleteTranscript = typeof p.deleteTranscript === "boolean" ? p.deleteTranscript : true;
    const {
      cleanupSessionBeforeMutation,
      emitGatewaySessionEndPluginHook,
      emitSessionUnboundLifecycleEvent,
    } = await loadSessionsRuntimeModule();
    const initialDeleteEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
    const rejectModelSelectionLockedDelete = (entry, sessionKey) => {
      if (!isModelSelectionLocked(entry)) return false;
      if (
        normalizeOptionalString(entry?.pluginOwnerId) !== void 0 &&
        entry?.agentHarnessId === void 0 &&
        !isAgentHarnessSessionKey(sessionKey)
      )
        return false;
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          "This session cannot be deleted while model selection is locked.",
        ),
      );
      return true;
    };
    if (rejectModelSelectionLockedDelete(initialDeleteEntry, target.canonicalKey)) return;
    if (p.archivedOnly === true && initialDeleteEntry?.archivedAt === void 0) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `Session ${key} is not archived. Archive it first, then delete it.`,
        ),
      );
      return;
    }
    const expectedSessionId = p.expectedSessionId?.trim();
    const expectedLifecycleRevision = p.expectedLifecycleRevision?.trim();
    const expectedSessionUpdatedAt = p.expectedSessionUpdatedAt;
    const expectedLifecycleRevisionMatches = (entry) =>
      !expectedLifecycleRevision || entry?.lifecycleRevision === expectedLifecycleRevision;
    const expectedSessionIdMatches = (entry) => {
      if (!expectedSessionId || entry?.sessionId === expectedSessionId) return true;
      return false;
    };
    const respondSessionChanged = () => {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `Session ${key} changed before deletion. Retry.`, {
          details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON },
        }),
      );
    };
    const rejectExpectedSessionMismatch = (entry) => {
      const updatedAtMatches =
        expectedSessionUpdatedAt === void 0 || entry?.updatedAt === expectedSessionUpdatedAt;
      if (
        expectedLifecycleRevisionMatches(entry) &&
        expectedSessionIdMatches(entry) &&
        updatedAtMatches
      )
        return false;
      respondSessionChanged();
      return true;
    };
    if (rejectExpectedSessionMismatch(initialDeleteEntry)) return;
    const initialPlacementError = resolveSessionWorkerPlacementMutationError({
      action: "delete",
      context,
      key,
      sessionId: normalizeOptionalString(initialDeleteEntry?.sessionId),
    });
    if (initialPlacementError) {
      respondSessionWorkerPlacementMutationError(initialPlacementError, respond);
      return;
    }
    if (
      rejectPluginRuntimeDeleteMismatch({
        client,
        key: target.canonicalKey ?? key,
        entry: initialDeleteEntry,
        respond,
      })
    )
      return;
    let abortResult;
    const abortSessionKey = target.canonicalKey ?? key;
    const chatAbort = chatHandlers["chat.abort"];
    if (!chatAbort) throw new Error("chat.abort handler is not registered");
    await chatAbort({
      req,
      params: {
        sessionKey: abortSessionKey,
        ...(requestedAgentId ? { agentId: requestedAgentId } : {}),
      },
      respond: (ok, _payload, error) => {
        abortResult = {
          ok,
          ...(error ? { error } : {}),
        };
      },
      context,
      client,
      isWebchatConnect,
    });
    if (abortResult?.ok === false) {
      respond(false, void 0, abortResult.error);
      return;
    }
    const deleteLifecycleIdentities = [
      target.canonicalKey,
      key,
      initialDeleteEntry?.sessionId,
      expectedSessionId,
    ];
    let admittedWorkReleased = true;
    let expectedSessionStillCurrent = true;
    let deleteBlockedByModelLock = false;
    let deleteBlockedByWorkerPlacement = false;
    const deletion = await runExclusiveSessionLifecycleMutation({
      scope: storePath,
      identities: deleteLifecycleIdentities,
      prepare: async () => {
        const preparedEntry = loadSessionEntry(key, { agentId: requestedAgentId }).entry;
        deleteBlockedByModelLock = rejectModelSelectionLockedDelete(
          preparedEntry,
          target.canonicalKey,
        );
        if (deleteBlockedByModelLock) return;
        expectedSessionStillCurrent = !rejectExpectedSessionMismatch(preparedEntry);
        if (!expectedSessionStillCurrent) return;
        const placementError = resolveSessionWorkerPlacementMutationError({
          action: "delete",
          context,
          key,
          sessionId: normalizeOptionalString(preparedEntry?.sessionId),
        });
        if (placementError) {
          deleteBlockedByWorkerPlacement = true;
          respondSessionWorkerPlacementMutationError(placementError, respond);
          return;
        }
        admittedWorkReleased = await interruptSessionWorkAdmissions({
          scope: storePath,
          identities: deleteLifecycleIdentities,
          timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
        });
      },
      run: async () => {
        if (
          deleteBlockedByModelLock ||
          deleteBlockedByWorkerPlacement ||
          !expectedSessionStillCurrent
        )
          return;
        if (!admittedWorkReleased) {
          respond(
            false,
            void 0,
            errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`),
          );
          return;
        }
        const { entry, legacyKey, canonicalKey } = loadSessionEntry(key, {
          agentId: requestedAgentId,
        });
        if (rejectModelSelectionLockedDelete(entry, canonicalKey ?? target.canonicalKey)) return;
        if (rejectExpectedSessionMismatch(entry)) return;
        if (p.archivedOnly === true && entry?.archivedAt === void 0) {
          respond(
            false,
            void 0,
            errorShape(
              ErrorCodes.INVALID_REQUEST,
              `Session ${key} is not archived. Archive it first, then delete it.`,
            ),
          );
          return;
        }
        if (
          rejectPluginRuntimeDeleteMismatch({
            client,
            key: canonicalKey ?? key,
            entry,
            respond,
          })
        )
          return;
        const mutationCleanupError = await cleanupSessionBeforeMutation({
          cfg,
          key,
          target,
          entry,
          legacyKey,
          canonicalKey,
          reason: "session-delete",
        });
        if (mutationCleanupError) {
          respond(false, void 0, mutationCleanupError);
          return;
        }
        const postCleanupTarget = loadAccessorSessionEntryForGatewayTarget({
          key,
          cfg,
          ...(requestedAgentId ? { agentId: requestedAgentId } : {}),
        });
        const postCleanupEntry = postCleanupTarget.entry;
        if (
          !expectedLifecycleRevisionMatches(postCleanupEntry) ||
          !expectedSessionIdMatches(postCleanupEntry)
        ) {
          respondSessionChanged();
          return;
        }
        const pluginOwnerId = normalizeOptionalString(postCleanupEntry?.pluginOwnerId);
        const deletionParams = {
          agentId: target.agentId,
          archiveTranscript: deleteTranscript,
          expectedEntry: postCleanupEntry,
          expectedLifecycleRevision,
          expectedSessionId,
          expectedUpdatedAt: postCleanupEntry?.updatedAt,
          storePath,
          target: {
            canonicalKey: target.canonicalKey,
            storeKeys: target.storeKeys,
          },
        };
        const result =
          postCleanupEntry && pluginOwnerId && isModelSelectionLocked(postCleanupEntry)
            ? await rollbackPluginOwnedSessionEntryLifecycle({
                ...deletionParams,
                expectedEntry: postCleanupEntry,
                expectedPluginOwnerId: pluginOwnerId,
                target: {
                  canonicalKey: postCleanupTarget.target.canonicalKey,
                  storeKeys: postCleanupTarget.target.storeKeys,
                },
              })
            : await deleteSessionEntryLifecycle(deletionParams);
        if (result.expectedEntryMismatch) {
          respondSessionChanged();
          return;
        }
        if (result.deleted) {
          emitGatewaySessionEndPluginHook({
            cfg,
            sessionKey: target.canonicalKey ?? key,
            sessionId: result.deletedSessionId,
            storePath,
            sessionFile: result.deletedSessionFile,
            agentId: target.agentId,
            reason: "deleted",
            archivedTranscripts: result.archivedTranscripts,
          });
          await emitSessionUnboundLifecycleEvent({
            targetSessionKey: target.canonicalKey ?? key,
            reason: "session-delete",
            emitHooks: p.emitLifecycleHooks !== false,
          });
        }
        return result;
      },
    });
    if (!deletion) return;
    const deleted = deletion.deleted;
    const archived = deletion.archivedTranscripts.map((entryLocal) => entryLocal.archivedPath);
    let worktreePreserved;
    if (deleted) {
      handleSessionStateSessionDeleted(
        target.canonicalKey ?? key,
        requestedAgentId ?? resolveSessionStoreAgentId(cfg, target.canonicalKey ?? key),
      );
      try {
        const worktree = managedWorktrees.findLiveByOwner("session", target.canonicalKey);
        if (worktree && !(await managedWorktrees.removeIfLossless(worktree.id)))
          worktreePreserved = {
            id: worktree.id,
            branch: worktree.branch,
            path: worktree.path,
          };
      } catch (error) {
        log.warn(
          `failed to clean up worktree for deleted session ${target.canonicalKey}: ${formatErrorMessage(error)}`,
        );
      }
    }
    respond(
      true,
      {
        ok: true,
        key: target.canonicalKey,
        deleted,
        archived,
        ...(worktreePreserved ? { worktreePreserved } : {}),
      },
      void 0,
    );
    if (deleted)
      emitSessionsChanged(context, {
        sessionKey: target.canonicalKey,
        ...(target.canonicalKey === "global" && requestedAgentId
          ? { agentId: requestedAgentId }
          : {}),
        reason: "delete",
      });
  },
  "sessions.groups.list": async ({ params, respond }) => {
    if (
      !assertValidParams(params, validateSessionsGroupsListParams, "sessions.groups.list", respond)
    )
      return;
    respond(true, { groups: listSessionGroups() }, void 0);
  },
  "sessions.groups.put": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateSessionsGroupsPutParams, "sessions.groups.put", respond))
      return;
    respond(
      true,
      {
        ok: true,
        groups: putSessionGroups(params.names),
      },
      void 0,
    );
    emitSessionsChanged(context, { reason: "groups" });
  },
  "sessions.groups.rename": async ({ params, respond, context }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsGroupsRenameParams,
        "sessions.groups.rename",
        respond,
      )
    )
      return;
    try {
      respond(
        true,
        {
          ok: true,
          ...(await renameSessionGroup({
            cfg: context.getRuntimeConfig(),
            name: params.name,
            to: params.to,
          })),
        },
        void 0,
      );
      emitSessionsChanged(context, { reason: "groups" });
    } catch (error) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
    }
  },
  "sessions.groups.delete": async ({ params, respond, context }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsGroupsDeleteParams,
        "sessions.groups.delete",
        respond,
      )
    )
      return;
    try {
      respond(
        true,
        {
          ok: true,
          ...(await deleteSessionGroup({
            cfg: context.getRuntimeConfig(),
            name: params.name,
          })),
        },
        void 0,
      );
      emitSessionsChanged(context, { reason: "groups" });
    } catch (error) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
    }
  },
  "sessions.get": async ({ params, respond, context }) => {
    const p = params;
    const key = requireSessionKey(p.key ?? p.sessionKey, respond);
    if (!key) return;
    const limit =
      typeof p.limit === "number" && Number.isFinite(p.limit)
        ? Math.max(1, Math.floor(p.limit))
        : 200;
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(
      cfg,
      key,
      normalizeOptionalString(p.agentId),
    );
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const { storePath, entry } = loadSessionEntriesForTarget({
      key,
      cfg,
      agentId: requestedAgent.agentId,
    });
    if (!entry?.sessionId) {
      respond(true, { messages: [] }, void 0);
      return;
    }
    const { messages } = await readRecentSessionMessagesWithStatsAsync(
      {
        agentId: requestedAgent.agentId,
        sessionEntry: entry,
        sessionId: entry.sessionId,
        sessionKey: key,
        storePath,
      },
      {
        maxMessages: limit,
        maxLines: limit * 20 + 20,
        allowResetArchiveFallback: true,
      },
    );
    respond(true, { messages }, void 0);
  },
  "sessions.compact": async ({ req, params, respond, context, client, isWebchatConnect }) => {
    if (!assertValidParams(params, validateSessionsCompactParams, "sessions.compact", respond))
      return;
    const p = params;
    const key = requireSessionKey(p.key, respond);
    if (!key) return;
    if (
      rejectWebchatSessionMutation({
        action: "compact",
        client,
        isWebchatConnect,
        respond,
      })
    )
      return;
    const maxLines =
      typeof p.maxLines === "number" && Number.isFinite(p.maxLines)
        ? Math.max(1, Math.floor(p.maxLines))
        : void 0;
    const cfg = context.getRuntimeConfig();
    const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
    if (!requestedAgent.ok) {
      respond(false, void 0, requestedAgent.error);
      return;
    }
    const requestedAgentId = requestedAgent.agentId;
    const { target, storePath } = resolveGatewaySessionTargetFromKey(key, cfg, {
      agentId: requestedAgentId,
    });
    let compactPrimaryKey = target.canonicalKey;
    const compactRead = await applySessionPatchProjection({
      agentId: target.agentId,
      storePath,
      resolveTarget: ({ entries }) => {
        const snapshot = Object.fromEntries(
          entries.map(({ sessionKey, entry }) => [sessionKey, entry]),
        );
        const { target: migratedTarget, primaryKey } = migrateAndPruneGatewaySessionStoreKey({
          cfg,
          key,
          store: snapshot,
          agentId: requestedAgentId,
        });
        compactPrimaryKey = primaryKey;
        return {
          primaryKey,
          candidateKeys: migratedTarget.storeKeys,
        };
      },
      project: ({ existingEntry }) =>
        existingEntry
          ? {
              ok: true,
              entry: existingEntry,
            }
          : { ok: false },
    });
    const compactTarget = {
      entry: compactRead.ok ? compactRead.entry : void 0,
      primaryKey: compactPrimaryKey,
    };
    const entry = compactTarget.entry;
    const sessionId = entry?.sessionId;
    if (!sessionId) {
      respond(
        true,
        {
          ok: true,
          key: target.canonicalKey,
          compacted: false,
          reason: "no sessionId",
        },
        void 0,
      );
      return;
    }
    if (maxLines !== void 0) {
      const trimPreflight = await preflightSessionTranscriptForManualCompact(
        {
          sessionId,
          storePath,
          sessionKey: compactTarget.primaryKey,
          agentId: target.agentId,
        },
        {
          maxLines,
          sessionFile: entry.sessionFile,
        },
      );
      if (!trimPreflight.compacted) {
        respond(
          true,
          {
            ok: true,
            key: target.canonicalKey,
            compacted: false,
            ...("kept" in trimPreflight
              ? { kept: trimPreflight.kept }
              : { reason: "no transcript" }),
          },
          void 0,
        );
        return;
      }
    } else if (
      (
        await loadTranscriptEvents({
          agentId: target.agentId,
          sessionId,
          sessionKey: compactTarget.primaryKey,
          storePath,
        }).catch(() => [])
      ).length === 0
    ) {
      respond(
        true,
        {
          ok: true,
          key: target.canonicalKey,
          compacted: false,
          reason: "no transcript",
        },
        void 0,
      );
      return;
    }
    const lifecycleRevision = entry.lifecycleRevision;
    const lifecycleIdentities = [
      key,
      target.canonicalKey,
      compactTarget.primaryKey,
      sessionId,
      lifecycleRevision,
    ];
    let sessionStillCurrent = true;
    let admittedWorkReleased = true;
    try {
      await runExclusiveSessionLifecycleMutation({
        scope: storePath,
        identities: lifecycleIdentities,
        kind: "compaction",
        prepare: async () => {
          const latestEntry = loadAccessorSessionEntryForGatewayTarget({
            key,
            cfg,
            agentId: requestedAgentId,
          }).entry;
          sessionStillCurrent = Boolean(
            latestEntry &&
            latestEntry.sessionId === sessionId &&
            latestEntry.lifecycleRevision === lifecycleRevision &&
            !resolveSessionWorkStartError(target.canonicalKey, latestEntry),
          );
          if (!sessionStillCurrent) return;
          clearSessionQueues([key, target.canonicalKey, compactTarget.primaryKey, sessionId]);
          admittedWorkReleased = await interruptSessionWorkAdmissions({
            scope: storePath,
            identities: lifecycleIdentities,
            timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
          });
        },
        run: async () => {
          if (!sessionStillCurrent) {
            respond(
              false,
              void 0,
              errorShape(
                ErrorCodes.INVALID_REQUEST,
                `Session ${key} changed before compaction. Retry.`,
                { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } },
              ),
            );
            return;
          }
          if (!admittedWorkReleased) {
            respond(
              false,
              void 0,
              errorShape(ErrorCodes.UNAVAILABLE, `Session ${key} is still active; try again.`),
            );
            return;
          }
          const latestEntry = loadAccessorSessionEntryForGatewayTarget({
            key,
            cfg,
            agentId: requestedAgentId,
          }).entry;
          if (
            !latestEntry ||
            latestEntry.sessionId !== sessionId ||
            latestEntry.lifecycleRevision !== lifecycleRevision ||
            resolveSessionWorkStartError(target.canonicalKey, latestEntry)
          ) {
            respond(
              false,
              void 0,
              errorShape(
                ErrorCodes.INVALID_REQUEST,
                `Session ${key} changed before compaction. Retry.`,
                { details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON } },
              ),
            );
            return;
          }
          const interruptResult = await interruptSessionRunIfActive({
            req,
            context,
            client,
            isWebchatConnect,
            requestedKey: key,
            canonicalKey: target.canonicalKey,
            agentId: requestedAgentId,
            sessionId,
          });
          if (interruptResult.error) {
            respond(false, void 0, interruptResult.error);
            return;
          }
          const operationId = randomUUID();
          if (maxLines !== void 0) {
            const trimResult = await trimSessionTranscriptForManualCompact(
              {
                sessionId,
                storePath,
                sessionKey: compactTarget.primaryKey,
                agentId: target.agentId,
              },
              {
                maxLines,
                sessionFile: latestEntry.sessionFile,
              },
            );
            respond(
              true,
              {
                ok: true,
                key: target.canonicalKey,
                compacted: trimResult.compacted,
                ...(trimResult.compacted
                  ? {
                      archived: trimResult.archived,
                      kept: trimResult.kept,
                    }
                  : "kept" in trimResult
                    ? { kept: trimResult.kept }
                    : { reason: "no transcript" }),
              },
              void 0,
            );
            if (trimResult.compacted) {
              recordSessionCompacted({
                sessionKey: target.canonicalKey,
                operationId,
                sessionId,
                agentId: target.agentId ?? requestedAgentId,
              });
              emitSessionsChanged(context, {
                sessionKey: target.canonicalKey,
                ...(target.canonicalKey === "global" && target.agentId
                  ? { agentId: target.agentId }
                  : {}),
                reason: "compact",
                compacted: true,
              });
            }
            return;
          }
          if (
            (
              await loadTranscriptEvents({
                agentId: target.agentId,
                sessionId,
                sessionKey: compactTarget.primaryKey,
                storePath,
              }).catch(() => [])
            ).length === 0
          ) {
            respond(
              true,
              {
                ok: true,
                key: target.canonicalKey,
                compacted: false,
                reason: "no transcript",
              },
              void 0,
            );
            return;
          }
          const compactionTranscriptTarget = await resolveSessionTranscriptRuntimeTarget({
            agentId: target.agentId,
            sessionId,
            sessionKey: compactTarget.primaryKey,
            storePath,
          });
          const resolvedModel = resolveSessionModelRef(cfg, latestEntry, target.agentId);
          const workspaceDir =
            resolveIngressWorkspaceOverrideForSessionRun({
              spawnedBy: latestEntry.spawnedBy,
              workspaceDir: latestEntry.spawnedWorkspaceDir,
              cwd: latestEntry.spawnedCwd,
            }) ?? resolveAgentWorkspaceDir(cfg, target.agentId);
          emitSessionOperation(context, {
            operationId,
            operation: "compact",
            phase: "start",
            sessionKey: target.canonicalKey,
            ...(target.canonicalKey === "global" && target.agentId
              ? { agentId: target.agentId }
              : {}),
          });
          const emitCompactionEnd = (completed, reason) =>
            emitSessionOperation(context, {
              operationId,
              operation: "compact",
              phase: "end",
              sessionKey: target.canonicalKey,
              ...(target.canonicalKey === "global" && target.agentId
                ? { agentId: target.agentId }
                : {}),
              completed,
              reason,
            });
          let result;
          try {
            result = await compactEmbeddedAgentSession({
              sessionId,
              sessionKey: target.canonicalKey,
              agentId: target.agentId,
              sessionTarget: {
                agentId: target.agentId,
                sessionId,
                sessionKey: target.canonicalKey,
                storePath,
              },
              allowGatewaySubagentBinding: true,
              sessionFile: compactionTranscriptTarget.sessionFile,
              workspaceDir,
              cwd: normalizeOptionalString(latestEntry.spawnedCwd),
              config: cfg,
              provider: resolvedModel.provider,
              model: resolvedModel.model,
              authProfileId: latestEntry.authProfileOverride,
              authProfileIdSource:
                latestEntry.authProfileOverrideSource ??
                (latestEntry.authProfileOverride
                  ? typeof latestEntry.authProfileOverrideCompactionCount === "number"
                    ? "auto"
                    : "user"
                  : void 0),
              agentHarnessId:
                latestEntry.modelSelectionLocked === true
                  ? resolvePersistedSessionRuntimeId(latestEntry)
                  : latestEntry.agentHarnessId,
              modelSelectionLocked: latestEntry.modelSelectionLocked === true,
              thinkLevel: normalizeThinkLevel(latestEntry.thinkingLevel),
              reasoningLevel: normalizeReasoningLevel(latestEntry.reasoningLevel),
              bashElevated: {
                enabled: false,
                allowed: false,
                defaultLevel: "off",
              },
              trigger: "manual",
            });
          } catch (err) {
            emitCompactionEnd(false, formatErrorMessage(err));
            throw err;
          }
          if (result.ok && result.compacted) {
            let persisted;
            try {
              persisted = (
                await applySessionPatchProjection({
                  agentId: target.agentId,
                  storePath,
                  resolveTarget: () => ({ primaryKey: compactTarget.primaryKey }),
                  project: ({ existingEntry }) => {
                    if (
                      !existingEntry ||
                      existingEntry.sessionId !== sessionId ||
                      existingEntry.lifecycleRevision !== lifecycleRevision ||
                      resolveSessionWorkStartError(target.canonicalKey, existingEntry)
                    )
                      return { ok: false };
                    const entryToUpdate = existingEntry;
                    entryToUpdate.updatedAt = Date.now();
                    entryToUpdate.compactionCount =
                      Math.max(0, entryToUpdate.compactionCount ?? 0) + 1;
                    if (
                      result.result?.sessionId &&
                      result.result.sessionId !== entryToUpdate.sessionId
                    )
                      entryToUpdate.sessionId = result.result.sessionId;
                    delete entryToUpdate.inputTokens;
                    delete entryToUpdate.outputTokens;
                    delete entryToUpdate.contextBudgetStatus;
                    if (
                      typeof result.result?.tokensAfter === "number" &&
                      Number.isFinite(result.result.tokensAfter)
                    ) {
                      entryToUpdate.totalTokens = result.result.tokensAfter;
                      entryToUpdate.totalTokensFresh = true;
                    } else {
                      delete entryToUpdate.totalTokens;
                      delete entryToUpdate.totalTokensFresh;
                    }
                    return {
                      ok: true,
                      entry: entryToUpdate,
                    };
                  },
                })
              ).ok;
            } catch (err) {
              emitCompactionEnd(false, formatErrorMessage(err));
              throw err;
            }
            if (!persisted) {
              const reason = `Session ${key} changed before compaction completed. Retry.`;
              emitCompactionEnd(false, reason);
              respond(
                false,
                void 0,
                errorShape(ErrorCodes.INVALID_REQUEST, reason, {
                  details: { reason: SESSION_LIFECYCLE_CHANGED_ERROR_REASON },
                }),
              );
              return;
            }
            recordSessionCompacted({
              sessionKey: target.canonicalKey,
              operationId,
              sessionId: result.result?.sessionId ?? sessionId,
              agentId: target.agentId ?? requestedAgentId,
            });
          }
          emitCompactionEnd(result.ok && result.compacted, result.reason);
          respond(
            true,
            {
              ok: result.ok,
              key: target.canonicalKey,
              compacted: result.compacted,
              reason: result.reason,
              result: result.result,
            },
            void 0,
          );
          if (result.ok)
            emitSessionsChanged(context, {
              sessionKey: target.canonicalKey,
              ...(target.canonicalKey === "global" && target.agentId
                ? { agentId: target.agentId }
                : {}),
              reason: "compact",
              compacted: result.compacted,
            });
        },
      });
    } catch (err) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(err)));
    }
  },
};
//#endregion
export { sessionsHandlers as t };
