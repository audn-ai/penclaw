import { format } from "node:util";
import {
  a as resolveMatrixAccountConfig,
  i as resolveMatrixAccountAllowlistConfig,
} from "./account-config-Cth1-JFA.js";
import { n as resolveConfiguredMatrixBotUserIds } from "./accounts-qvek289C.js";
import { n as setActiveMatrixClient } from "./active-client-CD1wI1Ud.js";
import {
  c as buildAllowlistResolutionSummary,
  d as patchAllowlistUsersInConfigEntries,
  f as summarizeMapping,
  l as canonicalizeAllowlistWithResolvedIds,
  s as addAllowlistUserEntriesFromConfigEntry,
} from "./allow-from-BCaLdTTU.js";
import {
  n as normalizeMatrixUserId,
  r as resolveMatrixAllowListMatch,
  t as normalizeMatrixAllowList,
} from "./allowlist-D7LjwHLa.js";
import { t as CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY } from "./approval-handler-adapter-runtime-DjbKLbMW.js";
import { a as waitUntilAbort } from "./channel-lifecycle.core-BZ1pethE.js";
import { r as registerChannelRuntimeContext } from "./channel-runtime-context-gztTEkoq.js";
import {
  n as resolveMatrixAuth,
  r as resolveMatrixAuthContext,
  t as backfillMatrixAuthDeviceIdAfterStartup,
} from "./config-sv-OBcvj.js";
import { t as buildChannelInboundEventContext } from "./context-DMJN91Z-.js";
import { t as resolveChannelContextVisibilityMode } from "./context-visibility-BVlvSMUZ.js";
import { t as evaluateSupplementalContextVisibility } from "./context-visibility-C5CaKMWO.js";
import { n as isDangerousNameMatchingEnabled } from "./dangerous-name-matching-Z6nhxFXz.js";
import {
  o as MATRIX_OPENCLAW_FINALIZED_PREVIEW_KEY,
  r as promoteMatrixDirectRoomCandidate,
} from "./direct-management-C8DSVoOg.js";
import {
  a as readJoinedMatrixMembers,
  r as isStrictDirectMembership,
  t as hasDirectMatrixMemberFlag,
} from "./direct-room-DeTW2q2I.js";
import { l as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-d7KFGRtT.js";
import { t as formatMatrixEncryptedEventDisabledWarning } from "./encryption-guidance-CLcuv2ux.js";
import { t as formatMatrixErrorMessage } from "./errors-DJRnBTUk.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-env-D0V-7Gqz.js";
import "./security-runtime-CraX8Pqe.js";
import {
  n as createConnectedChannelStatusPatch,
  r as createTransportActivityStatusPatch,
} from "./gateway-runtime-IrTdjV5_.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { o as buildInboundHistoryFromEntries } from "./history-DdfM33Aj.js";
import "./routing-CwvmVRHd.js";
import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.js";
import {
  i as isMatrixMediaSizeLimitError,
  r as MatrixMediaSizeLimitError,
} from "./http-client-De_Pc1ST.js";
import { t as resolveAckReaction } from "./identity-CceraXdn.js";
import { i as createMatrixInboundEventDeduper } from "./inbound-dedupe-COPa_t_3.js";
import { g as toInboundMediaFacts, l as hasFinalChannelTurnDispatch } from "./kernel-BhdvbEs2.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import "./reply-history-DTabwFaD.js";
import {
  a as deliverWithFinalizableLivePreviewAdapter,
  n as createPreviewMessageReceipt,
  r as defineFinalizableLivePreviewAdapter,
} from "./live-DjttXqqq.js";
import { r as getAgentScopedMediaLocalRoots } from "./local-roots-CgMgS9r2.js";
import { n as logInboundDrop, r as logTypingFailure } from "./logging-gUWPKC5g.js";
import {
  a as resolveMatrixMessageAttachment,
  c as fetchMatrixPollSnapshot,
  i as isLikelyBareFilename,
  n as formatMatrixMediaUnavailableText,
  o as resolveMatrixMessageBody,
  r as formatMatrixMessageText,
  t as formatMatrixMediaTooLargeText,
} from "./media-text-Dj0Yh4UP.js";
import "./channel-outbound-DlkFd7rO.js";
import {
  n as createChannelIngressResolver,
  o as defineStableChannelIngressIdentity,
} from "./message-access-DY5sc0VK.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  _ as parseStrictFiniteNumber,
  k as resolveOptionalIntegerOption,
  m as isFutureDateTimestampMs,
} from "./number-coercion-CJQ8TR--.js";
import "./html-entity-runtime-DaPF1Tq9.js";
import "./dangerous-name-runtime-cJriWyuh.js";
import "./channel-inbound-vhkYEe2n.js";
import "./channel-feedback-lNNgzRXo.js";
import { i as mergePairLoopGuardConfig } from "./pair-loop-guard-runtime-D0pZ_1is.js";
import "./channel-ingress-runtime-B6CHO2ZB.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import {
  o as getReplyPayloadTtsSupplement,
  r as buildTtsSupplementMediaPayload,
} from "./reply-payload-BK_jICQ3.js";
import { E as formatLocationText, O as toLocationContext } from "./reply-payload-DDwHXDkv.js";
import { n as createReplyPrefixOptions } from "./reply-prefix-C5dokQJN.js";
import { a as resolveInboundLastRouteSessionKey } from "./resolve-route-oiOq6bK9.js";
import { t as resolveMatrixTargets } from "./resolve-targets-DPl1UU3w.js";
import { t as createMatrixRoomInfoResolver } from "./room-info-CjqU6iDz.js";
import { n as resolveMatrixRoomConfig } from "./rooms-RrimWzo2.js";
import {
  a as EventType,
  i as resolveMatrixThreadRouting,
  n as resolveMatrixReplyToEventId,
  o as RelationType,
  r as resolveMatrixThreadRootId,
  t as resolveMatrixInboundRoute,
} from "./route-BVsVTBX9.js";
import { t as isBunRuntime } from "./runtime-BefyhPWv.js";
import { t as getMatrixRuntime } from "./runtime-C3viBnoh.js";
import {
  a as warnMissingProviderGroupPolicyFallbackOnce,
  n as resolveAllowlistProviderRuntimeGroupPolicy,
  r as resolveDefaultGroupPolicy,
  t as GROUP_POLICY_BLOCKED_LABEL,
} from "./runtime-group-policy-BEjP88cf.js";
import {
  _ as isPollStartType,
  a as sendMessageMatrix,
  g as isPollEventType,
  m as formatPollAsText,
  t as chunkMatrixText,
  y as parsePollStartContent,
} from "./send-DDFybVmB.js";
import { t as resolveMatrixStoredSessionMeta } from "./session-store-metadata-ClU8Lvaz.js";
import { r as getSessionEntry } from "./session-store-runtime-BwE6SlGz.js";
import {
  i as resolveSharedMatrixClient,
  n as releaseSharedClientInstance,
} from "./shared-BQILq3IO.js";
import {
  i as throwIfMatrixStartupAborted,
  r as isMatrixStartupAbortError,
} from "./startup-abort-D9iZK8RV.js";
import {
  a as createChannelProgressDraftGate,
  b as resolveChannelProgressDraftMaxLines,
  c as formatChannelProgressDraftText,
  i as buildChannelProgressDraftLineForEntry,
  j as resolveChannelStreamingBlockEnabled,
  m as normalizeChannelProgressDraftLineIdentity,
  o as formatChannelProgressDraftLine,
  p as mergeChannelProgressDraftLine,
  u as isChannelProgressDraftWorkToolName,
} from "./streaming-D_YE0SPS.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  d as normalizeStringifiedEntries,
} from "./string-coerce-DW4mBlAt.js";
import "./client-Cy4l1-OV.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./runtime-api-CorvIo5f.js";
import {
  n as isMatrixReadySyncState,
  r as isMatrixTerminalSyncState,
  t as isMatrixDisconnectedSyncState,
} from "./sync-state-CWbp0QSY.js";
import { t as isMatrixQualifiedUserId } from "./target-ids-CmrXcyY1.js";
import { t as createMatrixThreadBindingManager } from "./thread-bindings-CDArbsZB.js";
import {
  c as resolveThreadBindingMaxAgeMsForChannel,
  o as resolveThreadBindingIdleTimeoutMsForChannel,
} from "./thread-bindings-policy-d6bhdGnZ.js";
import { t as createTypingCallbacks } from "./typing-DnYJejsM.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/matrix/src/matrix/monitor/auto-join.ts
function registerMatrixAutoJoin(params) {
  const { client, accountConfig, runtime } = params;
  const core = getMatrixRuntime();
  const logVerbose = (message) => {
    if (!core.logging.shouldLogVerbose()) return;
    runtime.log?.(message);
  };
  const autoJoin = accountConfig.autoJoin ?? "off";
  const rawAllowlist = normalizeStringifiedEntries(accountConfig.autoJoinAllowlist ?? []);
  const autoJoinAllowlist = new Set(rawAllowlist);
  const allowedRoomIds = new Set(rawAllowlist.filter((entry) => entry.startsWith("!")));
  const allowedAliases = rawAllowlist.filter((entry) => entry.startsWith("#"));
  const resolvedAliasRoomIds = /* @__PURE__ */ new Map();
  if (autoJoin === "off") return;
  if (autoJoin === "always") logVerbose("matrix: auto-join enabled for all invites");
  else logVerbose("matrix: auto-join enabled for allowlist invites");
  const resolveAllowedAliasRoomId = async (alias) => {
    if (resolvedAliasRoomIds.has(alias)) return resolvedAliasRoomIds.get(alias) ?? null;
    const resolved = await params.client.resolveRoom(alias);
    if (resolved) resolvedAliasRoomIds.set(alias, resolved);
    return resolved;
  };
  const resolveAllowedAliasRoomIds = async () => {
    return (
      await Promise.all(
        allowedAliases.map(async (alias) => {
          try {
            return await resolveAllowedAliasRoomId(alias);
          } catch (err) {
            runtime.error?.(`matrix: failed resolving allowlisted alias ${alias}: ${String(err)}`);
            return null;
          }
        }),
      )
    ).filter((roomId) => Boolean(roomId));
  };
  const runInviteTask = (roomId, task) => {
    Promise.resolve()
      .then(task)
      .catch((err) => {
        runtime.error?.(
          `matrix: auto-join invite handler failed for room ${roomId}: ${String(err)}`,
        );
      });
  };
  client.on("room.invite", (roomId, _inviteEvent) => {
    runInviteTask(roomId, async () => {
      if (autoJoin === "allowlist") {
        const allowedAliasRoomIds = await resolveAllowedAliasRoomIds();
        if (
          !(
            autoJoinAllowlist.has("*") ||
            allowedRoomIds.has(roomId) ||
            allowedAliasRoomIds.some((resolvedRoomId) => resolvedRoomId === roomId)
          )
        ) {
          logVerbose(`matrix: invite ignored (not in allowlist) room=${roomId}`);
          return;
        }
      }
      try {
        await client.joinRoom(roomId);
        logVerbose(`matrix: joined room ${roomId}`);
      } catch (err) {
        runtime.error?.(`matrix: failed to join room ${roomId}: ${String(err)}`);
      }
    });
  });
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/config.ts
function normalizeMatrixUserLookupEntry(raw) {
  return raw
    .replace(/^matrix:/i, "")
    .replace(/^user:/i, "")
    .trim();
}
function normalizeMatrixRoomLookupEntry(raw) {
  return raw
    .replace(/^matrix:/i, "")
    .replace(/^(room|channel):/i, "")
    .trim();
}
function filterResolvedMatrixAllowlistEntries(entries) {
  return entries.filter((entry) => {
    const trimmed = entry.trim();
    if (!trimmed) return false;
    if (trimmed === "*") return true;
    return isMatrixQualifiedUserId(normalizeMatrixUserLookupEntry(trimmed));
  });
}
function filterFailClosedMatrixAllowlistEntries(entries) {
  return entries.filter((entry) => entry.trim().length > 0);
}
function listResolvedMatrixAllowlistEntries(params) {
  const resolvedEntries = [];
  const seen = /* @__PURE__ */ new Set();
  for (const entry of params.entries) {
    const input = String(entry).trim();
    if (!input || seen.has(input)) continue;
    seen.add(input);
    const resolved = params.resolvedMap.get(input);
    if (!resolved?.resolved || !resolved.id) continue;
    const id = normalizeMatrixUserId(resolved.id);
    if (isMatrixQualifiedUserId(id))
      resolvedEntries.push({
        input,
        id,
      });
  }
  return resolvedEntries;
}
function normalizeConfiguredMatrixAllowlistEntries(entries) {
  const normalized = [];
  for (const entry of entries ?? []) {
    const trimmed = String(entry).trim();
    if (trimmed) normalized.push(trimmed);
  }
  return normalized;
}
function isMatrixDangerousNameMatchingEnabled(params) {
  return isDangerousNameMatchingEnabled(
    resolveMatrixAccountConfig({
      cfg: params.cfg,
      accountId: params.accountId,
    }),
  );
}
function addUniqueMatrixAllowlistEntry(params) {
  const trimmed = params.entry.trim();
  if (!trimmed) return;
  const key = trimmed.toLowerCase();
  if (params.seen.has(key)) return;
  params.seen.add(key);
  params.entries.push(trimmed);
}
function resolveStableMatrixMonitorUserEntries(entries) {
  const directMatches = [];
  for (const entry of entries) {
    const input = String(entry).trim();
    if (!input) continue;
    const query = normalizeMatrixUserLookupEntry(input);
    if (!query || query === "*") continue;
    directMatches.push(
      isMatrixQualifiedUserId(query)
        ? {
            input,
            resolved: true,
            id: normalizeMatrixUserId(query),
          }
        : {
            input,
            resolved: false,
          },
    );
  }
  return buildAllowlistResolutionSummary(directMatches);
}
function logStableMatrixAllowlistUnresolved(params) {
  if (params.unresolved.length === 0) return;
  summarizeMapping(params.label, [], params.unresolved, params.runtime);
  params.runtime.log?.(
    `${params.label} entries must be full Matrix IDs (example: @user:server). Unresolved entries will not match any sender. To match Matrix display names, set channels.matrix.dangerouslyAllowNameMatching=true.`,
  );
}
function resolveStableMatrixMonitorUserAllowlist(params) {
  const allowList = params.allowList;
  const resolution = resolveStableMatrixMonitorUserEntries(allowList);
  const canonicalized = canonicalizeAllowlistWithResolvedIds({
    existing: allowList,
    resolvedMap: resolution.resolvedMap,
  });
  logStableMatrixAllowlistUnresolved({
    label: params.label,
    unresolved: resolution.unresolved,
    runtime: params.runtime,
  });
  return {
    entries: params.failClosedOnUnresolved
      ? filterFailClosedMatrixAllowlistEntries(canonicalized)
      : filterResolvedMatrixAllowlistEntries(canonicalized),
    resolvedEntries: listResolvedMatrixAllowlistEntries({
      entries: allowList,
      resolvedMap: resolution.resolvedMap,
    }),
  };
}
async function resolveMatrixMonitorUserEntries(params) {
  const directMatches = [];
  const pending = [];
  for (const entry of params.entries) {
    const input = String(entry).trim();
    if (!input) continue;
    const query = normalizeMatrixUserLookupEntry(input);
    if (!query || query === "*") continue;
    if (isMatrixQualifiedUserId(query)) {
      directMatches.push({
        input,
        resolved: true,
        id: normalizeMatrixUserId(query),
      });
      continue;
    }
    pending.push({
      input,
      query,
    });
  }
  (pending.length === 0
    ? []
    : await params.resolveTargets({
        cfg: params.cfg,
        accountId: params.accountId,
        inputs: pending.map((entry) => entry.query),
        kind: "user",
        runtime: params.runtime,
      })
  ).forEach((entry, index) => {
    const source = pending[index];
    if (!source) return;
    directMatches.push({
      input: source.input,
      resolved: entry.resolved,
      id: entry.id ? normalizeMatrixUserId(entry.id) : void 0,
    });
  });
  return buildAllowlistResolutionSummary(directMatches);
}
async function resolveMatrixMonitorUserAllowlist(params) {
  const allowList = (params.list ?? []).map(String);
  if (allowList.length === 0)
    return {
      entries: allowList,
      resolvedEntries: [],
    };
  if (
    !isMatrixDangerousNameMatchingEnabled({
      cfg: params.cfg,
      accountId: params.accountId,
    })
  )
    return resolveStableMatrixMonitorUserAllowlist({
      allowList,
      failClosedOnUnresolved: params.failClosedOnUnresolved,
      label: params.label,
      runtime: params.runtime,
    });
  const resolution = await resolveMatrixMonitorUserEntries({
    cfg: params.cfg,
    accountId: params.accountId,
    entries: allowList,
    runtime: params.runtime,
    resolveTargets: params.resolveTargets,
  });
  const canonicalized = canonicalizeAllowlistWithResolvedIds({
    existing: allowList,
    resolvedMap: resolution.resolvedMap,
  });
  summarizeMapping(params.label, resolution.mapping, resolution.unresolved, params.runtime);
  if (resolution.unresolved.length > 0)
    params.runtime.log?.(
      `${params.label} entries must be full Matrix IDs (example: @user:server). Unresolved entries will not match any sender.`,
    );
  return {
    entries: params.failClosedOnUnresolved
      ? filterFailClosedMatrixAllowlistEntries(canonicalized)
      : filterResolvedMatrixAllowlistEntries(canonicalized),
    resolvedEntries: listResolvedMatrixAllowlistEntries({
      entries: allowList,
      resolvedMap: resolution.resolvedMap,
    }),
  };
}
async function resolveMatrixMonitorLiveUserAllowlist(params) {
  const liveEntries = normalizeConfiguredMatrixAllowlistEntries(params.entries);
  if (liveEntries.length === 0) return [];
  const allowNameMatching = isMatrixDangerousNameMatchingEnabled({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  const effective = [];
  const seen = /* @__PURE__ */ new Set();
  const startupByInput = new Map(
    (params.startupResolvedEntries ?? []).map((entry) => [entry.input, entry.id]),
  );
  const pending = [];
  for (const entry of liveEntries) {
    const query = normalizeMatrixUserLookupEntry(entry);
    if (entry === "*") {
      addUniqueMatrixAllowlistEntry({
        entries: effective,
        seen,
        entry,
      });
      continue;
    }
    if (isMatrixQualifiedUserId(query)) {
      addUniqueMatrixAllowlistEntry({
        entries: effective,
        seen,
        entry: normalizeMatrixUserId(query),
      });
      continue;
    }
    const startupId = startupByInput.get(entry);
    if (allowNameMatching && startupId) {
      addUniqueMatrixAllowlistEntry({
        entries: effective,
        seen,
        entry: startupId,
      });
      continue;
    }
    if (allowNameMatching) {
      pending.push(entry);
      continue;
    }
    if (params.failClosedOnUnresolved)
      addUniqueMatrixAllowlistEntry({
        entries: effective,
        seen,
        entry,
      });
  }
  if (pending.length === 0) return effective;
  const canonicalized = canonicalizeAllowlistWithResolvedIds({
    existing: pending,
    resolvedMap: (
      await resolveMatrixMonitorUserEntries({
        cfg: params.cfg,
        accountId: params.accountId,
        entries: pending,
        runtime: params.runtime,
        resolveTargets: params.resolveTargets ?? resolveMatrixTargets,
      })
    ).resolvedMap,
  });
  const resolvedEntries = params.failClosedOnUnresolved
    ? filterFailClosedMatrixAllowlistEntries(canonicalized)
    : filterResolvedMatrixAllowlistEntries(canonicalized);
  for (const entry of resolvedEntries)
    addUniqueMatrixAllowlistEntry({
      entries: effective,
      seen,
      entry,
    });
  return effective;
}
async function resolveMatrixMonitorRoomsConfig(params) {
  const roomsConfig = params.roomsConfig;
  if (!roomsConfig || Object.keys(roomsConfig).length === 0) return roomsConfig;
  const mapping = [];
  const unresolved = [];
  const nextRooms = {};
  const allowNameMatching = isMatrixDangerousNameMatchingEnabled({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  if (roomsConfig["*"]) nextRooms["*"] = roomsConfig["*"];
  const pending = [];
  for (const [entry, roomConfig] of Object.entries(roomsConfig)) {
    if (entry === "*") continue;
    const input = entry.trim();
    if (!input) continue;
    const cleaned = normalizeMatrixRoomLookupEntry(input);
    if (!cleaned) {
      unresolved.push(entry);
      continue;
    }
    if (cleaned.startsWith("!") && cleaned.includes(":")) {
      if (!nextRooms[cleaned]) nextRooms[cleaned] = roomConfig;
      if (cleaned !== input) mapping.push(`${input}→${cleaned}`);
      continue;
    }
    if (!cleaned.startsWith("#") && !allowNameMatching) {
      unresolved.push(input);
      continue;
    }
    pending.push({
      input,
      query: cleaned,
      config: roomConfig,
    });
  }
  if (pending.length > 0)
    (
      await params.resolveTargets({
        cfg: params.cfg,
        accountId: params.accountId,
        inputs: pending.map((entry) => entry.query),
        kind: "group",
        runtime: params.runtime,
      })
    ).forEach((entry, index) => {
      const source = pending[index];
      if (!source) return;
      if (entry.resolved && entry.id) {
        const roomKey = normalizeMatrixRoomLookupEntry(entry.id);
        if (!nextRooms[roomKey]) nextRooms[roomKey] = source.config;
        mapping.push(`${source.input}→${roomKey}`);
      } else unresolved.push(source.input);
    });
  summarizeMapping("matrix rooms", mapping, unresolved, params.runtime);
  if (unresolved.length > 0)
    params.runtime.log?.(
      "matrix rooms must be room IDs or aliases (example: !room:server or #alias:server). Unresolved entries are ignored.",
    );
  const roomUsers = /* @__PURE__ */ new Set();
  for (const roomConfig of Object.values(nextRooms))
    addAllowlistUserEntriesFromConfigEntry(roomUsers, roomConfig);
  if (roomUsers.size === 0) return nextRooms;
  if (!allowNameMatching) {
    const resolution = resolveStableMatrixMonitorUserEntries(Array.from(roomUsers));
    logStableMatrixAllowlistUnresolved({
      label: "matrix room users",
      unresolved: resolution.unresolved,
      runtime: params.runtime,
    });
    return patchAllowlistUsersInConfigEntries({
      entries: nextRooms,
      resolvedMap: resolution.resolvedMap,
      strategy: "canonicalize",
    });
  }
  const resolution = await resolveMatrixMonitorUserEntries({
    cfg: params.cfg,
    accountId: params.accountId,
    entries: Array.from(roomUsers),
    runtime: params.runtime,
    resolveTargets: params.resolveTargets,
  });
  summarizeMapping("matrix room users", resolution.mapping, resolution.unresolved, params.runtime);
  if (resolution.unresolved.length > 0)
    params.runtime.log?.(
      "matrix room users entries must be full Matrix IDs (example: @user:server). Unresolved entries will not match any sender.",
    );
  return patchAllowlistUsersInConfigEntries({
    entries: nextRooms,
    resolvedMap: resolution.resolvedMap,
    strategy: "canonicalize",
  });
}
async function resolveMatrixMonitorConfig(params) {
  const resolveTargets = params.resolveTargets ?? resolveMatrixTargets;
  const [allowFrom, groupAllowFrom, roomsConfig] = await Promise.all([
    resolveMatrixMonitorUserAllowlist({
      cfg: params.cfg,
      accountId: params.accountId,
      label: "matrix dm allowlist",
      list: params.allowFrom,
      runtime: params.runtime,
      resolveTargets,
    }),
    resolveMatrixMonitorUserAllowlist({
      cfg: params.cfg,
      accountId: params.accountId,
      label: "matrix group allowlist",
      list: params.groupAllowFrom,
      failClosedOnUnresolved: true,
      runtime: params.runtime,
      resolveTargets,
    }),
    resolveMatrixMonitorRoomsConfig({
      cfg: params.cfg,
      accountId: params.accountId,
      roomsConfig: params.roomsConfig,
      runtime: params.runtime,
      resolveTargets,
    }),
  ]);
  return {
    allowFrom: allowFrom.entries,
    allowFromResolvedEntries: allowFrom.resolvedEntries,
    groupAllowFrom: groupAllowFrom.entries,
    groupAllowFromResolvedEntries: groupAllowFrom.resolvedEntries,
    roomsConfig,
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/direct.ts
const DM_CACHE_TTL_MS = 3e4;
const RECENT_INVITE_TTL_MS = 3e4;
const MAX_TRACKED_DM_ROOMS = 1024;
const MAX_TRACKED_DM_MEMBER_FLAGS = 2048;
function rememberBounded(map, key, value, maxSize = MAX_TRACKED_DM_ROOMS) {
  map.set(key, value);
  if (map.size > maxSize) {
    const oldest = map.keys().next().value;
    if (typeof oldest === "string") map.delete(oldest);
  }
}
function createDirectRoomTracker(client, opts = {}) {
  const log = opts.log ?? (() => {});
  let lastDmUpdateMs = 0;
  let hasSeededDmCache = false;
  let cachedSelfUserId = null;
  const joinedMembersCache = /* @__PURE__ */ new Map();
  const directMemberFlagCache = /* @__PURE__ */ new Map();
  const recentInviteCandidates = /* @__PURE__ */ new Map();
  const locallyPromotedDirectRooms = /* @__PURE__ */ new Map();
  const ensureSelfUserId = async () => {
    if (cachedSelfUserId) return cachedSelfUserId;
    try {
      cachedSelfUserId = await client.getUserId();
    } catch {
      cachedSelfUserId = null;
    }
    return cachedSelfUserId;
  };
  const refreshDmCache = async () => {
    const now = Date.now();
    if (now - lastDmUpdateMs < DM_CACHE_TTL_MS) return;
    lastDmUpdateMs = now;
    hasSeededDmCache = (await client.dms.update()) || hasSeededDmCache;
  };
  const resolveJoinedMembers = async (roomId) => {
    const cached = joinedMembersCache.get(roomId);
    const now = Date.now();
    if (cached && now - cached.ts < DM_CACHE_TTL_MS) return cached.members;
    try {
      const normalized = await readJoinedMatrixMembers(client, roomId);
      if (!normalized) throw new Error("membership unavailable");
      rememberBounded(joinedMembersCache, roomId, {
        members: normalized,
        ts: now,
      });
      return normalized;
    } catch (err) {
      log(`matrix: dm member lookup failed room=${roomId} (${String(err)})`);
      return null;
    }
  };
  const resolveDirectMemberFlag = async (roomId, userId) => {
    const normalizedUserId = userId?.trim();
    if (!normalizedUserId) return null;
    const cacheKey = `${roomId}\n${normalizedUserId}`;
    const cached = directMemberFlagCache.get(cacheKey);
    const now = Date.now();
    if (cached && now - cached.ts < DM_CACHE_TTL_MS) return cached.isDirect;
    const isDirect = await hasDirectMatrixMemberFlag(client, roomId, normalizedUserId);
    rememberBounded(
      directMemberFlagCache,
      cacheKey,
      {
        isDirect,
        ts: now,
      },
      MAX_TRACKED_DM_MEMBER_FLAGS,
    );
    return isDirect;
  };
  const hasRecentInviteCandidate = (roomId, remoteUserId) => {
    const normalizedRemoteUserId = remoteUserId?.trim();
    if (!normalizedRemoteUserId) return false;
    const cached = recentInviteCandidates.get(roomId);
    if (!cached) return false;
    if (Date.now() - cached.ts >= RECENT_INVITE_TTL_MS) {
      recentInviteCandidates.delete(roomId);
      return false;
    }
    return cached.remoteUserId === normalizedRemoteUserId;
  };
  const canPromoteRecentInvite = async (roomId) => {
    try {
      return (await opts.canPromoteRecentInvite?.(roomId)) ?? true;
    } catch (err) {
      log(`matrix: recent invite promotion veto failed room=${roomId} (${String(err)})`);
      return false;
    }
  };
  const canPromoteUnmappedStrictRoom = async (roomId) => {
    try {
      return (await opts.canPromoteUnmappedStrictRoom?.(roomId)) ?? false;
    } catch (err) {
      log(`matrix: unmapped strict room promotion veto failed room=${roomId} (${String(err)})`);
      return false;
    }
  };
  const shouldKeepLocallyPromotedDirectRoom = async (roomId) => {
    try {
      return await opts.shouldKeepLocallyPromotedDirectRoom?.(roomId);
    } catch (err) {
      log(`matrix: local promotion keep-check failed room=${roomId} (${String(err)})`);
      return;
    }
  };
  const isExplicitlyConfiguredRoom = async (roomId) => {
    try {
      return (await opts.isExplicitlyConfiguredRoom?.(roomId)) ?? false;
    } catch (err) {
      log(`matrix: configured room check failed room=${roomId} (${String(err)})`);
      return true;
    }
  };
  const hasLocallyPromotedDirectRoom = (roomId, remoteUserId) => {
    const normalizedRemoteUserId = remoteUserId?.trim();
    if (!normalizedRemoteUserId) return false;
    return locallyPromotedDirectRooms.get(roomId)?.remoteUserId === normalizedRemoteUserId;
  };
  const rememberLocallyPromotedDirectRoom = (roomId, remoteUserId) => {
    const normalizedRemoteUserId = remoteUserId.trim();
    if (!normalizedRemoteUserId) return;
    rememberBounded(locallyPromotedDirectRooms, roomId, { remoteUserId: normalizedRemoteUserId });
  };
  return {
    invalidateRoom: (roomId) => {
      joinedMembersCache.delete(roomId);
      for (const key of directMemberFlagCache.keys())
        if (key.startsWith(`${roomId}\n`)) directMemberFlagCache.delete(key);
      lastDmUpdateMs = 0;
      log(`matrix: invalidated dm cache room=${roomId}`);
    },
    rememberInvite: (roomId, remoteUserId) => {
      const normalizedRemoteUserId = remoteUserId.trim();
      if (!normalizedRemoteUserId) return;
      rememberBounded(recentInviteCandidates, roomId, {
        remoteUserId: normalizedRemoteUserId,
        ts: Date.now(),
      });
      log(`matrix: remembered invite candidate room=${roomId} sender=${normalizedRemoteUserId}`);
    },
    isDirectMessage: async (params) => {
      const { roomId, senderId } = params;
      if (await isExplicitlyConfiguredRoom(roomId)) {
        log(`matrix: dm rejected via explicit room config room=${roomId}`);
        return false;
      }
      const selfUserId = params.selfUserId ?? (await ensureSelfUserId());
      const joinedMembers = await resolveJoinedMembers(roomId);
      const strictDirectMembership = isStrictDirectMembership({
        selfUserId,
        remoteUserId: senderId,
        joinedMembers,
      });
      try {
        await refreshDmCache();
      } catch (err) {
        log(`matrix: dm cache refresh failed (${String(err)})`);
      }
      if (client.dms.isDm(roomId)) {
        if (strictDirectMembership) {
          log(`matrix: dm detected via m.direct room=${roomId}`);
          return true;
        }
        log(`matrix: ignoring stale m.direct classification room=${roomId}`);
      }
      if (strictDirectMembership) {
        const directViaSelf = await resolveDirectMemberFlag(roomId, selfUserId);
        if (directViaSelf === true) {
          log(`matrix: dm detected via member state room=${roomId}`);
          return true;
        }
        if (directViaSelf === false) {
          log(`matrix: dm rejected via member state room=${roomId}`);
          return false;
        }
        if (!hasSeededDmCache) {
          log(
            `matrix: dm detected via exact 2-member fallback before dm cache seed room=${roomId}`,
          );
          return true;
        }
        if (hasLocallyPromotedDirectRoom(roomId, senderId)) {
          if ((await shouldKeepLocallyPromotedDirectRoom(roomId)) !== false) {
            log(`matrix: dm detected via local promotion room=${roomId}`);
            return true;
          }
          locallyPromotedDirectRooms.delete(roomId);
          log(`matrix: local promotion cleared room=${roomId}`);
        }
        if (hasRecentInviteCandidate(roomId, senderId) && (await canPromoteRecentInvite(roomId))) {
          const promotion = await promoteMatrixDirectRoomCandidate({
            client,
            remoteUserId: senderId ?? "",
            roomId,
            selfUserId,
          });
          if (promotion.classifyAsDirect) {
            rememberLocallyPromotedDirectRoom(roomId, senderId ?? "");
            log(
              `matrix: dm detected via recent invite room=${roomId} reason=${promotion.reason} repaired=${String(promotion.repaired)}`,
            );
            return true;
          }
        }
        if (await canPromoteUnmappedStrictRoom(roomId)) {
          const promotion = await promoteMatrixDirectRoomCandidate({
            client,
            remoteUserId: senderId ?? "",
            roomId,
            selfUserId,
          });
          if (promotion.classifyAsDirect) {
            rememberLocallyPromotedDirectRoom(roomId, senderId ?? "");
            log(
              `matrix: dm detected via per-room strict fallback room=${roomId} reason=${promotion.reason} repaired=${String(promotion.repaired)}`,
            );
            return true;
          }
        }
      }
      log(
        `matrix: dm check room=${roomId} result=group members=${joinedMembers?.length ?? "unknown"}`,
      );
      return false;
    },
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/access-state.ts
function normalizeMatrixEntry(raw) {
  return normalizeMatrixAllowList([raw ?? ""])[0] ?? null;
}
const matrixIngressIdentity = defineStableChannelIngressIdentity({
  key: "sender-id",
  normalize: normalizeMatrixEntry,
  matchEntry({ subject, entry }) {
    const senderId = subject.identifiers[0]?.value;
    return (
      entry.value === "*" ||
      resolveMatrixAllowListMatch({
        allowList: [entry.value],
        userId: senderId ?? "",
      }).allowed
    );
  },
});
function resolveMatrixGroupIngress(params) {
  if (params.groupPolicy === "disabled")
    return {
      groupPolicy: "disabled",
      groupAllowFrom: [],
    };
  if (params.effectiveRoomUsers.length > 0)
    return {
      groupPolicy: "allowlist",
      groupAllowFrom: params.effectiveRoomUsers,
    };
  if (params.groupPolicy === "allowlist" && params.effectiveGroupAllowFrom.length > 0)
    return {
      groupPolicy: "allowlist",
      groupAllowFrom: params.effectiveGroupAllowFrom,
    };
  return {
    groupPolicy: "open",
    groupAllowFrom: [],
  };
}
async function resolveMatrixMonitorAccessState(params) {
  const dmPolicy = params.dmPolicy ?? "pairing";
  const groupPolicy = params.groupPolicy ?? "open";
  const effectiveGroupAllowFrom = normalizeMatrixAllowList(params.groupAllowFrom);
  const effectiveRoomUsers = normalizeMatrixAllowList(params.roomUsers);
  const groupIngress = resolveMatrixGroupIngress({
    groupPolicy,
    effectiveGroupAllowFrom,
    effectiveRoomUsers,
  });
  const accountId = params.accountId ?? "default";
  const eventKind = params.eventKind ?? "message";
  return {
    effectiveGroupAllowFrom,
    effectiveRoomUsers,
    messageIngress: await createChannelIngressResolver({
      channelId: "matrix",
      accountId,
      identity: matrixIngressIdentity,
      readStoreAllowFrom: async () => params.storeAllowFrom,
    }).message({
      subject: { stableId: params.senderId },
      conversation: {
        kind: params.isRoom ? "group" : "direct",
        id: params.isRoom ? "matrix-room" : "matrix-dm",
      },
      event: {
        kind: eventKind,
        authMode: "inbound",
        mayPair: params.isRoom ? false : eventKind === "message",
      },
      dmPolicy,
      groupPolicy: params.isRoom ? groupIngress.groupPolicy : "disabled",
      policy: { groupAllowFromFallbackToAllowFrom: false },
      allowFrom: params.allowFrom,
      ...(params.isRoom ? { groupAllowFrom: groupIngress.groupAllowFrom } : {}),
    }),
    accountId,
    senderId: params.senderId,
    isRoom: params.isRoom,
  };
}
async function resolveMatrixMonitorCommandAccess(state, params) {
  const commandAllowFrom = state.isRoom ? [] : state.messageIngress.senderAccess.effectiveAllowFrom;
  const commandGroupAllowFrom =
    state.effectiveRoomUsers.length > 0 ? state.effectiveRoomUsers : state.effectiveGroupAllowFrom;
  return (
    await createChannelIngressResolver({
      channelId: "matrix",
      accountId: state.accountId,
      identity: matrixIngressIdentity,
    }).command({
      subject: { stableId: state.senderId },
      conversation: {
        kind: state.isRoom ? "group" : "direct",
        id: state.isRoom ? "matrix-room" : "matrix-dm",
      },
      dmPolicy: "allowlist",
      groupPolicy: "allowlist",
      policy: { groupAllowFromFallbackToAllowFrom: false },
      allowFrom: commandAllowFrom,
      groupAllowFrom: commandGroupAllowFrom,
      command: {
        useAccessGroups: params.useAccessGroups,
        allowTextCommands: params.allowTextCommands,
        hasControlCommand: params.hasControlCommand,
        groupOwnerAllowFrom: "none",
        commandGroupAllowFromFallbackToAllowFrom: false,
      },
    })
  ).commandAccess;
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/verification-utils.ts
const VERIFICATION_EVENT_PREFIX = "m.key.verification.";
const VERIFICATION_REQUEST_MSGTYPE = "m.key.verification.request";
const VERIFICATION_NOTICE_PREFIXES = [
  "Matrix verification request received from ",
  "Matrix verification is ready with ",
  "Matrix verification started with ",
  "Matrix verification completed with ",
  "Matrix verification cancelled by ",
  "Matrix verification SAS with ",
];
function trimMaybeString$1(input) {
  return normalizeOptionalString(input) ?? "";
}
function isMatrixVerificationEventType(type) {
  return trimMaybeString$1(type).startsWith(VERIFICATION_EVENT_PREFIX);
}
function isMatrixVerificationRequestMsgType(msgtype) {
  return trimMaybeString$1(msgtype) === VERIFICATION_REQUEST_MSGTYPE;
}
function isMatrixVerificationNoticeBody(body) {
  const text = trimMaybeString$1(body);
  return VERIFICATION_NOTICE_PREFIXES.some((prefix) => text.startsWith(prefix));
}
function isMatrixVerificationRoomMessage(content) {
  return (
    isMatrixVerificationRequestMsgType(content.msgtype) ||
    (trimMaybeString$1(content.msgtype) === "m.notice" &&
      isMatrixVerificationNoticeBody(content.body))
  );
}
const matrixVerificationConstants = {
  eventPrefix: VERIFICATION_EVENT_PREFIX,
  requestMsgtype: VERIFICATION_REQUEST_MSGTYPE,
};
//#endregion
//#region extensions/matrix/src/matrix/monitor/verification-events.ts
const MAX_TRACKED_VERIFICATION_EVENTS = 1024;
const SAS_NOTICE_RETRY_DELAY_MS = 750;
const VERIFICATION_EVENT_STARTUP_GRACE_MS = 3e4;
const loadMatrixDirectRoomDeps = createLazyRuntimeModule(() =>
  Promise.all([
    import("./direct-management-B3mCtuiO.js"),
    import("./direct-room--7Gc1VbC.js"),
  ]).then(([directManagementModule, directRoomModule]) => ({
    inspectMatrixDirectRooms: directManagementModule.inspectMatrixDirectRooms,
    isStrictDirectRoom: directRoomModule.isStrictDirectRoom,
  })),
);
function trimMaybeString(input) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : null;
}
function readVerificationSignal(event) {
  const type = trimMaybeString(event?.type) ?? "";
  const content = event?.content ?? {};
  const msgtype = trimMaybeString(content.msgtype) ?? "";
  const relatedEventId = trimMaybeString(content["m.relates_to"]?.event_id);
  const transactionId = trimMaybeString(content.transaction_id);
  if (type === EventType.RoomMessage && isMatrixVerificationRequestMsgType(msgtype))
    return {
      stage: "request",
      flowId: trimMaybeString(event.event_id) ?? transactionId ?? relatedEventId,
    };
  if (!isMatrixVerificationEventType(type)) return null;
  const flowId = transactionId ?? relatedEventId ?? trimMaybeString(event.event_id);
  if (type === `${matrixVerificationConstants.eventPrefix}request`)
    return {
      stage: "request",
      flowId,
    };
  if (type === `${matrixVerificationConstants.eventPrefix}ready`)
    return {
      stage: "ready",
      flowId,
    };
  if (type === "m.key.verification.start")
    return {
      stage: "start",
      flowId,
    };
  if (type === "m.key.verification.cancel")
    return {
      stage: "cancel",
      flowId,
    };
  if (type === "m.key.verification.done")
    return {
      stage: "done",
      flowId,
    };
  return {
    stage: "other",
    flowId,
  };
}
function formatVerificationStageNotice(params) {
  const { stage, senderId, event } = params;
  const content = event.content;
  switch (stage) {
    case "request":
      return `Matrix verification request received from ${senderId}. Open "Verify by emoji" in your Matrix client to continue.`;
    case "ready":
      return `Matrix verification is ready with ${senderId}. Choose "Verify by emoji" to reveal the emoji sequence.`;
    case "start":
      return `Matrix verification started with ${senderId}.`;
    case "done":
      return `Matrix verification completed with ${senderId}.`;
    case "cancel": {
      const code = trimMaybeString(content.code);
      const reason = trimMaybeString(content.reason);
      if (code && reason)
        return `Matrix verification cancelled by ${senderId} (${code}: ${reason}).`;
      if (reason) return `Matrix verification cancelled by ${senderId} (${reason}).`;
      return `Matrix verification cancelled by ${senderId}.`;
    }
    default:
      return null;
  }
}
function formatVerificationSasNotice(summary) {
  const sas = summary.sas;
  if (!sas) return null;
  const emojiLine =
    Array.isArray(sas.emoji) && sas.emoji.length > 0
      ? `SAS emoji: ${sas.emoji.map(([emoji, name]) => `${trimMaybeString(emoji) ?? "?"} ${trimMaybeString(name) ?? "?"}`).join(" | ")}`
      : null;
  const decimalLine =
    Array.isArray(sas.decimal) && sas.decimal.length === 3
      ? `SAS decimal: ${sas.decimal.join(" ")}`
      : null;
  if (!emojiLine && !decimalLine) return null;
  const lines = [`Matrix verification SAS with ${summary.otherUserId}:`];
  if (emojiLine) lines.push(emojiLine);
  if (decimalLine) lines.push(decimalLine);
  lines.push("If both sides match, choose 'They match' in your Matrix app.");
  return lines.join("\n");
}
function resolveVerificationFlowCandidates(params) {
  const { event, flowId } = params;
  const content = event.content;
  const candidates = /* @__PURE__ */ new Set();
  const add = (value) => {
    const normalized = trimMaybeString(value);
    if (normalized) candidates.add(normalized);
  };
  add(flowId);
  add(event.event_id);
  add(content.transaction_id);
  add(content["m.relates_to"]?.event_id);
  return Array.from(candidates);
}
function resolveSummaryRecency(summary) {
  const ts = Date.parse(summary.updatedAt ?? "");
  return Number.isFinite(ts) ? ts : 0;
}
function isActiveVerificationSummary(summary) {
  if (summary.completed === true) return false;
  if (summary.phaseName === "cancelled" || summary.phaseName === "done") return false;
  if (typeof summary.phase === "number" && summary.phase >= 4) return false;
  return true;
}
async function resolveVerificationSummaryForSignal(client, params) {
  if (!client.crypto) return null;
  await client.crypto
    .ensureVerificationDmTracked({
      roomId: params.roomId,
      userId: params.senderId,
    })
    .catch(() => null);
  const list = await client.crypto.listVerifications();
  if (list.length === 0) return null;
  const candidates = resolveVerificationFlowCandidates({
    event: params.event,
    flowId: params.flowId,
  });
  const byTransactionId = list.find((entry) =>
    candidates.some((candidate) => entry.transactionId === candidate),
  );
  if (byTransactionId) return byTransactionId;
  const { inspectMatrixDirectRooms, isStrictDirectRoom } = await loadMatrixDirectRoomDeps();
  const activeRoomId = trimMaybeString(
    (
      await inspectMatrixDirectRooms({
        client,
        remoteUserId: params.senderId,
      }).catch(() => null)
    )?.activeRoomId,
  );
  if (activeRoomId) {
    if (activeRoomId !== params.roomId) return null;
  } else if (
    !(await isStrictDirectRoom({
      client,
      roomId: params.roomId,
      remoteUserId: params.senderId,
    }))
  )
    return null;
  const activeByUser = list
    .filter((entry) => entry.otherUserId === params.senderId && isActiveVerificationSummary(entry))
    .toSorted((a, b) => resolveSummaryRecency(b) - resolveSummaryRecency(a));
  const activeInRoom = activeByUser.filter((entry) => {
    return trimMaybeString(entry.roomId) === params.roomId;
  });
  if (activeInRoom.length > 0) return activeInRoom[0] ?? null;
  return activeByUser[0] ?? null;
}
async function resolveVerificationSasNoticeForSignal(client, params) {
  const summary = await resolveVerificationSummaryForSignal(client, params);
  const immediateNotice =
    summary && isActiveVerificationSummary(summary) ? formatVerificationSasNotice(summary) : null;
  if (immediateNotice || (params.stage !== "ready" && params.stage !== "start"))
    return {
      summary,
      sasNotice: immediateNotice,
    };
  await new Promise((resolve) => {
    setTimeout(resolve, params.sasNoticeRetryDelayMs ?? SAS_NOTICE_RETRY_DELAY_MS);
  });
  const retriedSummary = await resolveVerificationSummaryForSignal(client, params);
  return {
    summary: retriedSummary,
    sasNotice:
      retriedSummary && isActiveVerificationSummary(retriedSummary)
        ? formatVerificationSasNotice(retriedSummary)
        : null,
  };
}
function trackBounded(set, value) {
  if (!value || set.has(value)) return false;
  set.add(value);
  if (set.size > MAX_TRACKED_VERIFICATION_EVENTS) {
    const oldest = set.values().next().value;
    if (typeof oldest === "string") set.delete(oldest);
  }
  return true;
}
async function sendVerificationNotice(params) {
  const roomId = trimMaybeString(params.roomId);
  if (!roomId) return;
  try {
    await params.client.sendMessage(roomId, {
      msgtype: "m.notice",
      body: params.body,
    });
  } catch (err) {
    params.logVerboseMessage(
      `matrix: failed sending verification notice room=${roomId}: ${String(err)}`,
    );
  }
}
async function isVerificationNoticeAuthorized(params) {
  if (!params.dmEnabled || params.dmPolicy === "disabled") {
    params.logVerboseMessage(
      `matrix: blocked verification sender ${params.senderId} (dmPolicy=${params.dmPolicy}, dmEnabled=${String(params.dmEnabled)})`,
    );
    return false;
  }
  const storeAllowFrom =
    params.dmPolicy !== "allowlist" && params.dmPolicy !== "open"
      ? await params.readStoreAllowFrom()
      : [];
  if (
    (
      await resolveMatrixMonitorAccessState({
        allowFrom: params.allowFrom,
        storeAllowFrom,
        dmPolicy: params.dmPolicy,
        groupPolicy: "open",
        groupAllowFrom: [],
        roomUsers: [],
        senderId: params.senderId,
        isRoom: false,
      })
    ).messageIngress.senderAccess.decision === "allow"
  )
    return true;
  params.logVerboseMessage(
    `matrix: blocked verification sender ${params.senderId} (dmPolicy=${params.dmPolicy})`,
  );
  return false;
}
function createMatrixVerificationEventRouter(params) {
  const routerStartedAtMs = Date.now();
  const routedVerificationEvents = /* @__PURE__ */ new Set();
  const routedVerificationSasFingerprints = /* @__PURE__ */ new Set();
  const routedVerificationStageNotices = /* @__PURE__ */ new Set();
  const verificationFlowRooms = /* @__PURE__ */ new Map();
  const verificationUserRooms = /* @__PURE__ */ new Map();
  async function resolveActiveDirectRoomId(remoteUserId) {
    const { inspectMatrixDirectRooms } = await loadMatrixDirectRoomDeps();
    return trimMaybeString(
      (
        await inspectMatrixDirectRooms({
          client: params.client,
          remoteUserId,
        }).catch(() => null)
      )?.activeRoomId,
    );
  }
  function shouldEmitVerificationEventNotice(event) {
    const eventTs =
      typeof event.origin_server_ts === "number" && Number.isFinite(event.origin_server_ts)
        ? event.origin_server_ts
        : null;
    if (eventTs === null) return true;
    return eventTs >= routerStartedAtMs - VERIFICATION_EVENT_STARTUP_GRACE_MS;
  }
  function rememberVerificationRoom(roomId, event, flowId) {
    for (const candidate of resolveVerificationFlowCandidates({
      event,
      flowId,
    })) {
      verificationFlowRooms.set(candidate, roomId);
      if (verificationFlowRooms.size > MAX_TRACKED_VERIFICATION_EVENTS) {
        const oldest = verificationFlowRooms.keys().next().value;
        if (typeof oldest === "string") verificationFlowRooms.delete(oldest);
      }
    }
  }
  function rememberVerificationUserRoom(remoteUserId, roomId) {
    const normalizedUserId = trimMaybeString(remoteUserId);
    const normalizedRoomId = trimMaybeString(roomId);
    if (!normalizedUserId || !normalizedRoomId) return;
    verificationUserRooms.delete(normalizedUserId);
    verificationUserRooms.set(normalizedUserId, normalizedRoomId);
    if (verificationUserRooms.size > MAX_TRACKED_VERIFICATION_EVENTS) {
      const oldest = verificationUserRooms.keys().next().value;
      if (typeof oldest === "string") verificationUserRooms.delete(oldest);
    }
  }
  async function resolveSummaryRoomId(summary) {
    const mappedRoomId =
      trimMaybeString(summary.roomId) ??
      trimMaybeString(
        summary.transactionId ? verificationFlowRooms.get(summary.transactionId) : null,
      ) ??
      trimMaybeString(verificationFlowRooms.get(summary.id));
    if (mappedRoomId) return mappedRoomId;
    const remoteUserId = trimMaybeString(summary.otherUserId);
    if (!remoteUserId) return null;
    const recentRoomId = trimMaybeString(verificationUserRooms.get(remoteUserId));
    const activeRoomId = await resolveActiveDirectRoomId(remoteUserId);
    if (recentRoomId && activeRoomId && recentRoomId === activeRoomId) return recentRoomId;
    if (activeRoomId) return activeRoomId;
    if (
      recentRoomId &&
      (await (
        await loadMatrixDirectRoomDeps()
      ).isStrictDirectRoom({
        client: params.client,
        roomId: recentRoomId,
        remoteUserId,
      }))
    )
      return recentRoomId;
    return null;
  }
  async function routeVerificationSummary(summary) {
    const roomId = await resolveSummaryRoomId(summary);
    if (!roomId || !isActiveVerificationSummary(summary)) return;
    if (
      !(await (
        await loadMatrixDirectRoomDeps()
      ).isStrictDirectRoom({
        client: params.client,
        roomId,
        remoteUserId: summary.otherUserId,
      }))
    ) {
      params.logVerboseMessage(
        `matrix: ignoring verification summary outside strict DM room=${roomId} sender=${summary.otherUserId}`,
      );
      return;
    }
    if (
      !(await isVerificationNoticeAuthorized({
        senderId: summary.otherUserId,
        allowFrom: params.allowFrom,
        dmEnabled: params.dmEnabled,
        dmPolicy: params.dmPolicy,
        readStoreAllowFrom: params.readStoreAllowFrom,
        logVerboseMessage: params.logVerboseMessage,
      }))
    )
      return;
    const sasNotice = formatVerificationSasNotice(summary);
    if (!sasNotice) return;
    const sasFingerprint = `${summary.id}:${JSON.stringify(summary.sas)}`;
    if (!trackBounded(routedVerificationSasFingerprints, sasFingerprint)) return;
    await sendVerificationNotice({
      client: params.client,
      roomId,
      body: sasNotice,
      logVerboseMessage: params.logVerboseMessage,
    });
  }
  function routeVerificationEvent(roomId, event) {
    const senderId = trimMaybeString(event?.sender);
    if (!senderId) return false;
    const signal = readVerificationSignal(event);
    if (!signal) return false;
    rememberVerificationRoom(roomId, event, signal.flowId);
    const routeTask = async () => {
      if (!shouldEmitVerificationEventNotice(event)) {
        params.logVerboseMessage(
          `matrix: ignoring historical verification event room=${roomId} id=${event.event_id ?? "unknown"} type=${event.type ?? "unknown"}`,
        );
        return;
      }
      const flowId = signal.flowId;
      const sourceFingerprint =
        trimMaybeString(event?.event_id) ?? `${senderId}:${event.type}:${flowId ?? "none"}`;
      if (
        !(await (
          await loadMatrixDirectRoomDeps()
        ).isStrictDirectRoom({
          client: params.client,
          roomId,
          remoteUserId: senderId,
        }))
      ) {
        params.logVerboseMessage(
          `matrix: ignoring verification event outside strict DM room=${roomId} sender=${senderId}`,
        );
        return;
      }
      if (
        !(await isVerificationNoticeAuthorized({
          senderId,
          allowFrom: params.allowFrom,
          dmEnabled: params.dmEnabled,
          dmPolicy: params.dmPolicy,
          readStoreAllowFrom: params.readStoreAllowFrom,
          logVerboseMessage: params.logVerboseMessage,
        }))
      )
        return;
      rememberVerificationUserRoom(senderId, roomId);
      if (!trackBounded(routedVerificationEvents, sourceFingerprint)) return;
      const stageNotice = formatVerificationStageNotice({
        stage: signal.stage,
        senderId,
        event,
      });
      const { summary, sasNotice } = await resolveVerificationSasNoticeForSignal(params.client, {
        roomId,
        event,
        senderId,
        flowId,
        stage: signal.stage,
        sasNoticeRetryDelayMs: params.sasNoticeRetryDelayMs,
      }).catch(() => ({
        summary: null,
        sasNotice: null,
      }));
      const notices = [];
      if (stageNotice) {
        const stageKey = `${roomId}:${senderId}:${flowId ?? sourceFingerprint}:${signal.stage}`;
        if (trackBounded(routedVerificationStageNotices, stageKey)) notices.push(stageNotice);
      }
      if (summary && sasNotice) {
        const sasFingerprint = `${summary.id}:${JSON.stringify(summary.sas)}`;
        if (trackBounded(routedVerificationSasFingerprints, sasFingerprint))
          notices.push(sasNotice);
      }
      if (notices.length === 0) return;
      for (const body of notices)
        await sendVerificationNotice({
          client: params.client,
          roomId,
          body,
          logVerboseMessage: params.logVerboseMessage,
        });
    };
    if (params.runDetachedTask)
      params.runDetachedTask(
        `verification event handler room=${roomId} id=${event.event_id ?? "unknown"}`,
        routeTask,
      );
    else
      routeTask().catch((err) => {
        params.logVerboseMessage(`matrix: failed routing verification event: ${String(err)}`);
      });
    return true;
  }
  return {
    routeVerificationEvent,
    routeVerificationSummary,
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/events.ts
const MATRIX_POST_HEALTHY_SYNC_DECRYPT_FAILURE_WINDOW_MS = 2 * 6e4;
const MATRIX_POST_HEALTHY_SYNC_DECRYPT_FAILURE_THRESHOLD = 3;
const MATRIX_POST_HEALTHY_SYNC_DECRYPT_FAILURE_SAMPLE_LIMIT = 3;
function formatMatrixPostHealthySyncDecryptionHint(accountId) {
  return `matrix: repeated fresh encrypted messages are still failing to decrypt after Matrix resumed healthy sync. This device may still be missing new room keys. Check 'openclaw matrix verify status --verbose --account ${accountId}' and 'openclaw matrix devices list --account ${accountId}'.`;
}
function isFreshPostHealthySyncDecryptFailure(params) {
  const { event, healthySyncSinceMs, graceMs = 0, nowMs } = params;
  if (typeof healthySyncSinceMs !== "number" || !Number.isFinite(healthySyncSinceMs)) return false;
  const eventTs = event.origin_server_ts;
  if (!Number.isFinite(eventTs) || eventTs <= 0) return false;
  if (eventTs < healthySyncSinceMs + graceMs) return false;
  if (eventTs > nowMs + 6e4) return false;
  return true;
}
function createMatrixPostHealthySyncDecryptFailureTracker(params) {
  let observations = [];
  let warningEmitted = false;
  let trackedHealthySyncSinceMs;
  const resetObservations = () => {
    observations = [];
    warningEmitted = false;
  };
  const pruneObservations = (nowMs) => {
    observations = observations.filter(
      (entry) => nowMs - entry.eventTs <= MATRIX_POST_HEALTHY_SYNC_DECRYPT_FAILURE_WINDOW_MS,
    );
    if (observations.length === 0) warningEmitted = false;
  };
  return {
    recordFailure(roomId, event, error) {
      const nowMs = Date.now();
      const healthySyncSinceMs = params.getHealthySyncSinceMs?.();
      if (healthySyncSinceMs !== trackedHealthySyncSinceMs) {
        trackedHealthySyncSinceMs = healthySyncSinceMs;
        resetObservations();
      }
      if (
        !isFreshPostHealthySyncDecryptFailure({
          event,
          healthySyncSinceMs,
          graceMs: params.startupGraceMs,
          nowMs,
        })
      )
        return {
          freshAfterHealthySync: false,
          failureCount: 0,
        };
      pruneObservations(nowMs);
      const key = `${roomId}|${event.event_id}`;
      if (!observations.some((entry) => entry.key === key))
        observations.push({
          key,
          roomId,
          eventId: event.event_id,
          sender: typeof event.sender === "string" ? event.sender : null,
          eventTs: event.origin_server_ts,
          error: error.message,
        });
      const failureCount = observations.length;
      if (warningEmitted || failureCount < MATRIX_POST_HEALTHY_SYNC_DECRYPT_FAILURE_THRESHOLD)
        return {
          freshAfterHealthySync: true,
          failureCount,
        };
      warningEmitted = true;
      const rooms = uniqueStrings(observations.map((entry) => entry.roomId)).slice(
        0,
        MATRIX_POST_HEALTHY_SYNC_DECRYPT_FAILURE_SAMPLE_LIMIT,
      );
      const senders = uniqueStrings(
        observations.map((entry) => entry.sender).filter((sender) => Boolean(sender)),
      ).slice(0, MATRIX_POST_HEALTHY_SYNC_DECRYPT_FAILURE_SAMPLE_LIMIT);
      const eventIds = observations.slice(-3).map((entry) => entry.eventId);
      const latestError = observations.at(-1)?.error ?? error.message;
      return {
        freshAfterHealthySync: true,
        failureCount,
        warning: {
          rooms,
          roomCount: new Set(observations.map((entry) => entry.roomId)).size,
          senders,
          senderCount: new Set(observations.map((entry) => entry.sender).filter(Boolean)).size,
          eventIds,
          latestError,
          windowMs: MATRIX_POST_HEALTHY_SYNC_DECRYPT_FAILURE_WINDOW_MS,
        },
      };
    },
  };
}
function formatMatrixSelfDecryptionHint(accountId) {
  return `matrix: failed to decrypt a message from this same Matrix user. This usually means another Matrix device did not share the room key, or another OpenClaw runtime is using the same account. Check 'openclaw matrix verify status --verbose --account ${accountId}' and 'openclaw matrix devices list --account ${accountId}'.`;
}
async function resolveMatrixSelfUserId(client, logVerboseMessage) {
  if (typeof client.getUserId !== "function") return null;
  try {
    return (await client.getUserId()) ?? null;
  } catch (err) {
    logVerboseMessage(`matrix: failed resolving self user id for decrypt warning: ${String(err)}`);
    return null;
  }
}
function registerMatrixMonitorEvents(params) {
  const {
    cfg,
    client,
    auth,
    allowFrom,
    dmEnabled,
    dmPolicy,
    readStoreAllowFrom,
    directTracker,
    logVerboseMessage,
    warnedEncryptedRooms,
    warnedCryptoMissingRooms,
    logger,
    startupGraceMs,
    getHealthySyncSinceMs,
    formatNativeDependencyHint,
    onRoomMessage,
    runDetachedTask,
    sasNoticeRetryDelayMs,
  } = params;
  const postHealthySyncDecryptFailureTracker = createMatrixPostHealthySyncDecryptFailureTracker({
    getHealthySyncSinceMs,
    startupGraceMs,
  });
  const { routeVerificationEvent, routeVerificationSummary } = createMatrixVerificationEventRouter({
    client,
    allowFrom,
    dmEnabled,
    dmPolicy,
    readStoreAllowFrom,
    logVerboseMessage,
    runDetachedTask,
    sasNoticeRetryDelayMs,
  });
  const runMonitorTask = (label, task) => {
    if (runDetachedTask) return runDetachedTask(label, task);
    return Promise.resolve()
      .then(task)
      .catch((error) => {
        logVerboseMessage(`matrix: ${label} failed (${String(error)})`);
      });
  };
  client.on("room.message", (roomId, event) => {
    if (routeVerificationEvent(roomId, event)) return;
    runMonitorTask(
      `room message handler room=${roomId} id=${event.event_id ?? "unknown"}`,
      async () => {
        await onRoomMessage(roomId, event);
      },
    );
  });
  client.on("room.encrypted_event", (roomId, event) => {
    const eventId = event?.event_id ?? "unknown";
    const eventType = event?.type ?? "unknown";
    logVerboseMessage(`matrix: encrypted event room=${roomId} type=${eventType} id=${eventId}`);
  });
  client.on("room.decrypted_event", (roomId, event) => {
    const eventId = event?.event_id ?? "unknown";
    const eventType = event?.type ?? "unknown";
    logVerboseMessage(`matrix: decrypted event room=${roomId} type=${eventType} id=${eventId}`);
    if (routeVerificationEvent(roomId, event)) return;
    if (eventType !== EventType.RoomMessage) return;
    runMonitorTask(
      `decrypted room message handler room=${roomId} id=${event.event_id ?? "unknown"}`,
      async () => {
        await onRoomMessage(roomId, event);
      },
    );
  });
  client.on("room.failed_decryption", (roomId, event, error) => {
    runMonitorTask(
      `failed decryption handler room=${roomId} id=${event.event_id ?? "unknown"}`,
      async () => {
        const failureState = postHealthySyncDecryptFailureTracker.recordFailure(
          roomId,
          event,
          error,
        );
        const selfUserId = await resolveMatrixSelfUserId(client, logVerboseMessage);
        const sender = typeof event.sender === "string" ? event.sender : null;
        const senderMatchesOwnUser = Boolean(selfUserId && sender && selfUserId === sender);
        logger.warn(
          failureState.freshAfterHealthySync
            ? "Failed to decrypt fresh post-healthy-sync message"
            : "Failed to decrypt message",
          {
            roomId,
            eventId: event.event_id,
            sender,
            senderMatchesOwnUser,
            error: error.message,
            freshAfterHealthySync: failureState.freshAfterHealthySync,
            ...(failureState.freshAfterHealthySync
              ? { postHealthySyncFailureCount: failureState.failureCount }
              : {}),
          },
        );
        if (failureState.warning)
          logger.warn(formatMatrixPostHealthySyncDecryptionHint(auth.accountId), {
            roomId,
            eventId: event.event_id,
            failureCount: failureState.failureCount,
            roomCount: failureState.warning.roomCount,
            rooms: failureState.warning.rooms,
            senderCount: failureState.warning.senderCount,
            senders: failureState.warning.senders,
            sampleEventIds: failureState.warning.eventIds,
            latestError: failureState.warning.latestError,
            windowMs: failureState.warning.windowMs,
          });
        if (senderMatchesOwnUser)
          logger.warn(formatMatrixSelfDecryptionHint(auth.accountId), {
            roomId,
            eventId: event.event_id,
            sender,
          });
        logVerboseMessage(
          `matrix: failed decrypt room=${roomId} id=${event.event_id ?? "unknown"} freshAfterHealthySync=${String(failureState.freshAfterHealthySync)} error=${error.message}`,
        );
      },
    );
  });
  client.on("verification.summary", (summary) => {
    runMonitorTask("verification summary handler", async () => {
      await routeVerificationSummary(summary);
    });
  });
  client.on("room.invite", (roomId, event) => {
    directTracker?.invalidateRoom(roomId);
    const eventId = event?.event_id ?? "unknown";
    const sender = event?.sender ?? "unknown";
    const invitee = normalizeOptionalString(event?.state_key) ?? "";
    const senderIsInvitee =
      Boolean(invitee) && (normalizeOptionalString(event?.sender) ?? "") === invitee;
    const isDirect = event?.content?.is_direct === true;
    const rememberedSender = normalizeOptionalString(event?.sender);
    if (rememberedSender && !senderIsInvitee)
      directTracker?.rememberInvite?.(roomId, rememberedSender);
    logVerboseMessage(
      `matrix: invite room=${roomId} sender=${sender} direct=${String(isDirect)} id=${eventId}`,
    );
  });
  client.on("room.join", (roomId, event) => {
    directTracker?.invalidateRoom(roomId);
    const eventId = event?.event_id ?? "unknown";
    logVerboseMessage(`matrix: join room=${roomId} id=${eventId}`);
  });
  client.on("room.event", (roomId, event) => {
    const eventType = event?.type ?? "unknown";
    if (eventType === EventType.RoomMessageEncrypted) {
      logVerboseMessage(
        `matrix: encrypted raw event room=${roomId} id=${event?.event_id ?? "unknown"}`,
      );
      if (auth.encryption !== true && !warnedEncryptedRooms.has(roomId)) {
        warnedEncryptedRooms.add(roomId);
        const warning = formatMatrixEncryptedEventDisabledWarning(cfg, auth.accountId);
        logger.warn(warning, { roomId });
      }
      if (auth.encryption === true && !client.crypto && !warnedCryptoMissingRooms.has(roomId)) {
        warnedCryptoMissingRooms.add(roomId);
        const warning = `matrix: encryption enabled but crypto is unavailable; ${formatNativeDependencyHint(
          {
            packageName: "@matrix-org/matrix-sdk-crypto-nodejs",
            manager: "pnpm",
            downloadCommand:
              "node node_modules/@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js",
          },
        )}`;
        logger.warn(warning, { roomId });
      }
      return;
    }
    if (eventType === EventType.RoomMember) {
      directTracker?.invalidateRoom(roomId);
      const membership = event?.content?.membership;
      const stateKey = event.state_key ?? "";
      logVerboseMessage(
        `matrix: member event room=${roomId} stateKey=${stateKey} membership=${membership ?? "unknown"}`,
      );
    }
    if (eventType === EventType.Reaction) {
      runMonitorTask(
        `reaction handler room=${roomId} id=${event.event_id ?? "unknown"}`,
        async () => {
          await onRoomMessage(roomId, event);
        },
      );
      return;
    }
    routeVerificationEvent(roomId, event);
  });
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/ack-config.ts
function resolveMatrixAckReactionConfig(params) {
  const matrixConfig = params.cfg.channels?.matrix;
  const accountConfig = resolveMatrixAccountConfig({
    cfg: params.cfg,
    accountId: params.accountId,
  });
  return {
    ackReaction: resolveAckReaction(params.cfg, params.agentId, {
      channel: "matrix",
      accountId: params.accountId ?? void 0,
    }).trim(),
    ackReactionScope:
      accountConfig.ackReactionScope ??
      matrixConfig?.ackReactionScope ??
      params.cfg.messages?.ackReactionScope ??
      "group-mentions",
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/location.ts
function decodeGeoUriParamValue(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
function parseGeoUri(value) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("geo:")) return null;
  const [coordsPart, ...paramParts] = trimmed.slice(4).split(";");
  if (!coordsPart) return null;
  const coords = coordsPart.split(",");
  if (coords.length < 2) return null;
  const latitude = parseStrictFiniteNumber(coords[0] ?? "");
  const longitude = parseStrictFiniteNumber(coords[1] ?? "");
  if (latitude === void 0 || longitude === void 0) return null;
  const params = /* @__PURE__ */ new Map();
  for (const part of paramParts) {
    const segment = part.trim();
    if (!segment) continue;
    const eqIndex = segment.indexOf("=");
    const rawKey = eqIndex === -1 ? segment : segment.slice(0, eqIndex);
    const rawValue = eqIndex === -1 ? "" : segment.slice(eqIndex + 1);
    const key = normalizeLowercaseStringOrEmpty(rawKey);
    if (!key) continue;
    const valuePart = rawValue.trim();
    params.set(key, valuePart ? decodeGeoUriParamValue(valuePart) : "");
  }
  const accuracyRaw = params.get("u");
  return {
    latitude,
    longitude,
    accuracy: accuracyRaw ? parseStrictFiniteNumber(accuracyRaw) : void 0,
  };
}
function resolveMatrixLocation(params) {
  const { eventType, content } = params;
  if (
    !(
      eventType === EventType.Location ||
      (eventType === EventType.RoomMessage && content.msgtype === EventType.Location)
    )
  )
    return null;
  const geoUri = normalizeOptionalString(content.geo_uri) ?? "";
  if (!geoUri) return null;
  const parsed = parseGeoUri(geoUri);
  if (!parsed) return null;
  const caption = normalizeOptionalString(content.body) ?? "";
  const location = {
    latitude: parsed.latitude,
    longitude: parsed.longitude,
    accuracy: parsed.accuracy,
    caption: caption || void 0,
    source: "pin",
    isLive: false,
  };
  return {
    text: formatLocationText(location),
    context: toLocationContext(location),
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/media.ts
const MATRIX_MEDIA_DOWNLOAD_IDLE_TIMEOUT_MS = 3e4;
async function fetchMatrixMediaBuffer(params) {
  try {
    return {
      buffer: await params.client.downloadContent(params.mxcUrl, {
        maxBytes: params.maxBytes,
        readIdleTimeoutMs: MATRIX_MEDIA_DOWNLOAD_IDLE_TIMEOUT_MS,
      }),
    };
  } catch (err) {
    if (isMatrixMediaSizeLimitError(err)) throw err;
    throw new Error(`Matrix media download failed: ${String(err)}`, { cause: err });
  }
}
/**
 * Download and decrypt encrypted media from a Matrix room.
 * Uses the Matrix crypto adapter's decryptMedia helper.
 */
async function fetchEncryptedMediaBuffer(params) {
  if (!params.client.crypto) throw new Error("Cannot decrypt media: crypto not enabled");
  const decrypted = await params.client.crypto.decryptMedia(params.file, {
    maxBytes: params.maxBytes,
    readIdleTimeoutMs: MATRIX_MEDIA_DOWNLOAD_IDLE_TIMEOUT_MS,
  });
  if (decrypted.byteLength > params.maxBytes) throw new MatrixMediaSizeLimitError();
  return { buffer: decrypted };
}
async function downloadMatrixMedia(params) {
  let fetched;
  if (typeof params.sizeBytes === "number" && params.sizeBytes > params.maxBytes)
    throw new MatrixMediaSizeLimitError();
  if (params.file)
    fetched = await fetchEncryptedMediaBuffer({
      client: params.client,
      file: params.file,
      maxBytes: params.maxBytes,
    });
  else
    fetched = await fetchMatrixMediaBuffer({
      client: params.client,
      mxcUrl: params.mxcUrl,
      maxBytes: params.maxBytes,
    });
  if (!fetched) return null;
  const headerType = params.contentType ?? void 0;
  const saved = await getMatrixRuntime().channel.media.saveMediaBuffer(
    fetched.buffer,
    headerType,
    "inbound",
    params.maxBytes,
    params.originalFilename,
  );
  return {
    path: saved.path,
    contentType: saved.contentType,
    placeholder: "[matrix media]",
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/mentions.ts
const MATRIX_HTML_ENTITY_RE = /&(?:#x?[0-9a-f]+|amp|apos|gt|lt|nbsp|quot);/gi;
function decodeVisibleHtmlEntities(value) {
  return value.replace(MATRIX_HTML_ENTITY_RE, (entity) => {
    const decoded = decodeHtmlEntities(entity.startsWith("&#") ? entity : entity.toLowerCase());
    return decoded === "\xA0" ? " " : decoded;
  });
}
function normalizeVisibleMentionText(value) {
  return normalizeLowercaseStringOrEmpty(
    decodeVisibleHtmlEntities(
      value.replace(/<[^>]+>/g, " ").replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f]/g, ""),
    ).replace(/\s+/g, " "),
  );
}
function extractVisibleMentionText(value) {
  return normalizeVisibleMentionText(value ?? "");
}
function resolveMatrixUserLocalpart(userId) {
  const trimmed = userId.trim();
  if (!trimmed.startsWith("@")) return null;
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex <= 1) return null;
  return trimmed.slice(1, colonIndex).trim() || null;
}
function resolveMatrixMentionPrefixCandidates(params) {
  const candidates = [];
  const seen = /* @__PURE__ */ new Set();
  const append = (candidate) => {
    const trimmed = candidate?.trim();
    if (!trimmed) return;
    const normalized = normalizeLowercaseStringOrEmpty(trimmed);
    if (seen.has(normalized)) return;
    seen.add(normalized);
    candidates.push(trimmed);
  };
  append(params.userId);
  const localpart = params.userId ? resolveMatrixUserLocalpart(params.userId) : null;
  append(localpart ? `@${localpart}` : null);
  append(params.displayName);
  append(params.displayName ? `@${params.displayName}` : null);
  append(params.displayName ? `@[${params.displayName}]` : null);
  return candidates;
}
function stripMatchedMatrixMentionPrefix(text, pattern) {
  const match = text.match(pattern);
  if (!match) return null;
  return text.slice(match[0].length).trimStart();
}
function stripNativeMatrixMentionPrefix(text, candidate) {
  return stripMatchedMatrixMentionPrefix(
    text,
    new RegExp(`^\\s*${escapeRegExp(candidate)}(?:\\s*[:,])?(?:\\s+|$)`, "i"),
  );
}
function stripRegexMatrixMentionPrefix(text, pattern) {
  const flags = pattern.flags.replace(/[gy]/g, "");
  return stripMatchedMatrixMentionPrefix(
    text,
    new RegExp(`^\\s*(?:${pattern.source})(?:\\s*[:,])?(?:\\s+|$)`, flags),
  );
}
function stripMatrixMentionPrefix(params) {
  const text = params.text;
  if (!text) return text;
  for (const candidate of resolveMatrixMentionPrefixCandidates(params)) {
    const stripped = stripNativeMatrixMentionPrefix(text, candidate);
    if (stripped !== null) return stripped;
  }
  for (const pattern of params.mentionRegexes ?? []) {
    const stripped = stripRegexMatrixMentionPrefix(text, pattern);
    if (stripped !== null) return stripped;
  }
  return text;
}
function isVisibleMentionLabel(params) {
  const cleaned = extractVisibleMentionText(params.text);
  if (!cleaned) return false;
  if (params.mentionRegexes.some((pattern) => pattern.test(cleaned))) return true;
  const localpart = resolveMatrixUserLocalpart(params.userId);
  return [
    extractVisibleMentionText(params.userId),
    localpart ? extractVisibleMentionText(localpart) : null,
    localpart ? extractVisibleMentionText(`@${localpart}`) : null,
    params.displayName ? extractVisibleMentionText(params.displayName) : null,
    params.displayName ? extractVisibleMentionText(`@${params.displayName}`) : null,
    params.displayName ? extractVisibleMentionText(`@[${params.displayName}]`) : null,
  ]
    .filter((value) => Boolean(value))
    .includes(cleaned);
}
function hasVisibleRoomMention(value) {
  const cleaned = extractVisibleMentionText(value);
  return /(^|[^a-z0-9_])@room\b/i.test(cleaned);
}
/**
 * Check if formatted_body contains a matrix.to link whose visible label still
 * looks like a real mention for the given user. Do not trust href alone, since
 * senders can hide arbitrary matrix.to links behind unrelated link text.
 * Many Matrix clients (including Element) use HTML links in formatted_body instead of
 * or in addition to the m.mentions field.
 */
function checkFormattedBodyMention(params) {
  if (!params.formattedBody || !params.userId) return false;
  for (const match of params.formattedBody.matchAll(
    /<a\b[^>]*href=(["'])(https:\/\/matrix\.to\/#[^"']+)\1[^>]*>(.*?)<\/a>/gis,
  )) {
    const href = match[2];
    const visibleLabel = match[3] ?? "";
    if (!href) continue;
    try {
      const parsed = new URL(href);
      if (decodeURIComponent(parsed.hash.replace(/^#\/?/, "").trim()) !== params.userId.trim())
        continue;
      if (
        isVisibleMentionLabel({
          text: visibleLabel,
          userId: params.userId,
          mentionRegexes: params.mentionRegexes,
          displayName: params.displayName,
        })
      )
        return true;
    } catch {
      continue;
    }
  }
  return false;
}
function resolveMentions(params) {
  const mentions = params.content["m.mentions"];
  const mentionedUsers = Array.isArray(mentions?.user_ids)
    ? new Set(mentions.user_ids)
    : /* @__PURE__ */ new Set();
  const textMentioned = getMatrixRuntime().channel.mentions.matchesMentionPatterns(
    params.text ?? "",
    params.mentionRegexes,
  );
  const visibleRoomMention =
    hasVisibleRoomMention(params.text) || hasVisibleRoomMention(params.content.formatted_body);
  const mentionedInFormattedBody = params.userId
    ? checkFormattedBodyMention({
        formattedBody: params.content.formatted_body,
        userId: params.userId,
        displayName: params.displayName,
        mentionRegexes: params.mentionRegexes,
      })
    : false;
  const metadataBackedUserMention = Boolean(
    params.userId &&
    mentionedUsers.has(params.userId) &&
    (mentionedInFormattedBody || textMentioned),
  );
  const metadataBackedRoomMention = Boolean(mentions?.room) && visibleRoomMention;
  const explicitMention =
    mentionedInFormattedBody || metadataBackedUserMention || metadataBackedRoomMention;
  return {
    wasMentioned: explicitMention || textMentioned || visibleRoomMention,
    hasExplicitMention: explicitMention,
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/preflight-audio.ts
const MATRIX_DEFAULT_ECHO_TRANSCRIPT_FORMAT = '📝 "{transcript}"';
const loadMatrixPreflightAudioRuntime = createLazyRuntimeModule(
  () => import("./preflight-audio.runtime-Dqm2ZS5d.js"),
);
function formatMatrixAudioTranscript(transcript) {
  return `[Audio transcript (machine-generated, untrusted)]: ${JSON.stringify(transcript)}`;
}
function formatMatrixAudioTranscriptEcho(transcript, format) {
  return format.replace("{transcript}", () => transcript);
}
function suppressMatrixPreflightAudioEcho(cfg) {
  const audio = cfg.tools?.media?.audio;
  if (!audio?.echoTranscript) return cfg;
  return {
    ...cfg,
    tools: {
      ...cfg.tools,
      media: {
        ...cfg.tools?.media,
        audio: {
          ...audio,
          echoTranscript: false,
        },
      },
    },
  };
}
function isMatrixAudioContent(params) {
  if (params.msgtype === "m.audio") return true;
  if (params.msgtype === "m.file" && typeof params.mimetype === "string")
    return params.mimetype.toLowerCase().startsWith("audio/");
  return false;
}
async function resolveMatrixPreflightAudioTranscript(params) {
  if (params.abortSignal?.aborted) return;
  try {
    const { transcribeFirstAudio } = await loadMatrixPreflightAudioRuntime();
    if (params.abortSignal?.aborted) return;
    const transcript = await transcribeFirstAudio({
      ctx: {
        MediaPaths: [params.mediaPath],
        MediaTypes: params.mediaContentType ? [params.mediaContentType] : void 0,
        Provider: "matrix",
        Surface: "matrix",
        OriginatingChannel: "matrix",
        OriginatingTo: params.originatingTo,
        AccountId: params.accountId,
        MessageThreadId: params.messageThreadId,
        ChatType: params.chatType,
        SessionKey: params.sessionKey,
      },
      cfg: suppressMatrixPreflightAudioEcho(params.cfg),
    });
    return params.abortSignal?.aborted ? void 0 : transcript;
  } catch (err) {
    logVerbose(`matrix: audio preflight transcription failed: ${String(err)}`);
    return;
  }
}
async function sendMatrixPreflightAudioTranscriptEcho(params) {
  const audio = params.cfg.tools?.media?.audio;
  if (!audio?.echoTranscript) return;
  const text = formatMatrixAudioTranscriptEcho(
    params.transcript,
    audio.echoFormat ?? MATRIX_DEFAULT_ECHO_TRANSCRIPT_FORMAT,
  );
  try {
    const { sendDurableMessageBatch } = await loadMatrixPreflightAudioRuntime();
    const send = await sendDurableMessageBatch({
      cfg: params.cfg,
      channel: "matrix",
      to: params.originatingTo,
      accountId: params.accountId,
      threadId: params.messageThreadId,
      payloads: [{ text }],
      bestEffort: true,
      durability: "best_effort",
    });
    if (send.status === "failed") throw send.error;
  } catch (err) {
    logVerbose(`matrix: audio transcript echo failed: ${String(err)}`);
  }
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/replies.ts
const THINKING_TAG_RE = /<\s*\/?\s*(?:think(?:ing)?|thought|antthinking)\b[^<>]*>/gi;
const THINKING_BLOCK_RE =
  /<\s*(?:think(?:ing)?|thought|antthinking)\b[^<>]*>[\s\S]*?<\s*\/\s*(?:think(?:ing)?|thought|antthinking)\s*>/gi;
function shouldSuppressReasoningReplyText(text) {
  if (typeof text !== "string") return false;
  const trimmedStart = text.trimStart();
  if (!trimmedStart) return false;
  if (normalizeLowercaseStringOrEmpty(trimmedStart).startsWith("reasoning:")) return true;
  THINKING_TAG_RE.lastIndex = 0;
  if (!THINKING_TAG_RE.test(text)) return false;
  THINKING_BLOCK_RE.lastIndex = 0;
  const withoutThinkingBlocks = text.replace(THINKING_BLOCK_RE, "");
  THINKING_TAG_RE.lastIndex = 0;
  return !withoutThinkingBlocks.replace(THINKING_TAG_RE, "").trim();
}
async function deliverMatrixReplies(params) {
  const core = getMatrixRuntime();
  const tableMode =
    params.tableMode ??
    core.channel.text.resolveMarkdownTableMode({
      cfg: params.cfg,
      channel: "matrix",
      accountId: params.accountId,
    });
  const logVerbose = (message) => {
    if (core.logging.shouldLogVerbose()) params.runtime.log?.(message);
  };
  let hasReplied = false;
  let deliveredAny = false;
  for (const reply of params.replies) {
    if (reply.isReasoning === true || shouldSuppressReasoningReplyText(reply.text)) {
      logVerbose("matrix reply suppressed as reasoning-only");
      continue;
    }
    const hasMedia = Boolean(reply?.mediaUrl) || (reply?.mediaUrls?.length ?? 0) > 0;
    if (!reply?.text && !hasMedia) {
      if (reply?.audioAsVoice) {
        logVerbose("matrix reply has audioAsVoice without media/text; skipping");
        continue;
      }
      params.runtime.error?.("matrix reply missing text/media");
      continue;
    }
    const replyToIdRaw = (reply.replyToId ?? params.replyToId)?.trim();
    const replyToId = params.threadId
      ? replyToIdRaw
      : params.replyToMode === "off"
        ? void 0
        : replyToIdRaw;
    const rawText = reply.text ?? "";
    const mediaList = reply.mediaUrls?.length
      ? reply.mediaUrls
      : reply.mediaUrl
        ? [reply.mediaUrl]
        : [];
    const shouldIncludeReply = (id) =>
      Boolean(id) && (params.threadId || params.replyToMode === "all" || !hasReplied);
    const replyToIdForReply = shouldIncludeReply(replyToId) ? replyToId : void 0;
    if (mediaList.length === 0) {
      let sentTextChunk = false;
      const { chunks } = chunkMatrixText(rawText, {
        cfg: params.cfg,
        accountId: params.accountId,
        tableMode,
      });
      for (const chunk of chunks) {
        const trimmed = chunk.trim();
        if (!trimmed) continue;
        await sendMessageMatrix(params.roomId, trimmed, {
          client: params.client,
          cfg: params.cfg,
          replyToId: replyToIdForReply,
          threadId: params.threadId,
          accountId: params.accountId,
        });
        deliveredAny = true;
        sentTextChunk = true;
      }
      if (replyToIdForReply && !hasReplied && sentTextChunk) hasReplied = true;
      continue;
    }
    let first = true;
    for (const mediaUrl of mediaList) {
      const caption = first ? rawText : "";
      await sendMessageMatrix(params.roomId, caption, {
        client: params.client,
        cfg: params.cfg,
        mediaUrl,
        mediaLocalRoots: params.mediaLocalRoots,
        replyToId: replyToIdForReply,
        threadId: params.threadId,
        audioAsVoice: reply.audioAsVoice,
        accountId: params.accountId,
      });
      deliveredAny = true;
      first = false;
    }
    if (replyToIdForReply && !hasReplied) hasReplied = true;
  }
  return deliveredAny;
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/context-summary.ts
function trimMatrixMaybeString(value) {
  if (typeof value !== "string") return;
  return value.trim() || void 0;
}
function summarizeMatrixMessageContextEvent(event) {
  if (isPollStartType(event.type)) {
    const pollSummary = parsePollStartContent(event.content);
    if (pollSummary) return formatPollAsText(pollSummary);
  }
  const content = event.content;
  return formatMatrixMessageText({
    body: resolveMatrixMessageBody({
      body: trimMatrixMaybeString(content.body),
      filename: trimMatrixMaybeString(content.filename),
      msgtype: trimMatrixMaybeString(content.msgtype),
    }),
    attachment: resolveMatrixMessageAttachment({
      body: trimMatrixMaybeString(content.body),
      filename: trimMatrixMaybeString(content.filename),
      msgtype: trimMatrixMaybeString(content.msgtype),
    }),
  });
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/reply-context.ts
const MAX_CACHED_REPLY_CONTEXTS = 256;
const MAX_REPLY_BODY_LENGTH = 500;
function truncateReplyBody(value) {
  if (value.length <= MAX_REPLY_BODY_LENGTH) return value;
  return `${sliceUtf16Safe(value, 0, MAX_REPLY_BODY_LENGTH - 3)}...`;
}
function summarizeMatrixReplyEvent(event) {
  const body = summarizeMatrixMessageContextEvent(event);
  return body ? truncateReplyBody(body) : void 0;
}
/**
 * Creates a cached resolver that fetches the body and sender of a replied-to
 * Matrix event. This allows the agent to see the content of the message being
 * replied to, not just its event ID.
 */
function createMatrixReplyContextResolver(params) {
  const cache = /* @__PURE__ */ new Map();
  const remember = (key, value) => {
    cache.set(key, value);
    if (cache.size > MAX_CACHED_REPLY_CONTEXTS) {
      const oldest = cache.keys().next().value;
      if (typeof oldest === "string") cache.delete(oldest);
    }
    return value;
  };
  return async (input) => {
    const cacheKey = `${input.roomId}:${input.eventId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      cache.delete(cacheKey);
      cache.set(cacheKey, cached);
      return cached;
    }
    const event = await params.client.getEvent(input.roomId, input.eventId).catch((err) => {
      params.logVerboseMessage(
        `matrix: failed resolving reply context room=${input.roomId} id=${input.eventId}: ${String(err)}`,
      );
      return null;
    });
    if (!event) return {};
    const rawEvent = event;
    if (rawEvent.unsigned?.redacted_because) return remember(cacheKey, {});
    const replyToBody = summarizeMatrixReplyEvent(rawEvent);
    if (!replyToBody) return remember(cacheKey, {});
    const senderId = trimMatrixMaybeString(rawEvent.sender);
    const senderName =
      senderId && (await params.getMemberDisplayName(input.roomId, senderId).catch(() => void 0));
    return remember(cacheKey, {
      replyToBody,
      replyToSender: senderName ?? senderId,
      replyToSenderId: senderId,
    });
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/room-history.ts
/** Maximum entries retained per room (hard cap to bound memory). */
const DEFAULT_MAX_QUEUE_SIZE = 200;
/** Maximum number of rooms to retain queues for (FIFO eviction beyond this). */
const DEFAULT_MAX_ROOM_QUEUES = 1e3;
/** Maximum number of (agentId, roomId) watermark entries to retain. */
const MAX_WATERMARK_ENTRIES = 5e3;
/** Maximum prepared trigger snapshots retained per room for retry reuse. */
const MAX_PREPARED_TRIGGER_ENTRIES = 500;
/** Maximum thread queues retained per room (FIFO eviction beyond this). */
const MAX_THREAD_QUEUES_PER_ROOM = 200;
function createRoomHistoryTrackerInternal(
  maxQueueSize = DEFAULT_MAX_QUEUE_SIZE,
  maxRoomQueues = DEFAULT_MAX_ROOM_QUEUES,
  maxWatermarkEntries = MAX_WATERMARK_ENTRIES,
  maxPreparedTriggerEntries = MAX_PREPARED_TRIGGER_ENTRIES,
) {
  const roomQueues = /* @__PURE__ */ new Map();
  /** Maps `{agentId, roomId, scope}` → absolute consumed-up-to index */
  const agentWatermarks = /* @__PURE__ */ new Map();
  let nextQueueGeneration = 1;
  function clearRoomWatermarks(roomId) {
    for (const key of agentWatermarks.keys())
      if (JSON.parse(key)?.roomId === roomId) agentWatermarks.delete(key);
  }
  function clearThreadWatermarks(roomId, threadRootId) {
    for (const key of agentWatermarks.keys()) {
      const parsed = JSON.parse(key);
      if (parsed?.roomId === roomId && parsed.scope === threadRootId) agentWatermarks.delete(key);
    }
  }
  function createHistoryQueue() {
    return {
      entries: [],
      baseIndex: 0,
      generation: nextQueueGeneration++,
      preparedTriggers: /* @__PURE__ */ new Map(),
    };
  }
  function getOrCreateQueue(roomId) {
    let queue = roomQueues.get(roomId);
    if (!queue) {
      queue = {
        ...createHistoryQueue(),
        threadQueues: /* @__PURE__ */ new Map(),
      };
      roomQueues.set(roomId, queue);
      if (roomQueues.size > maxRoomQueues) {
        const oldest = roomQueues.keys().next().value;
        if (oldest !== void 0) {
          roomQueues.delete(oldest);
          clearRoomWatermarks(oldest);
        }
      }
    }
    return queue;
  }
  function getOrCreateThreadQueue(roomId, roomQueue, threadRootId) {
    let queue = roomQueue.threadQueues.get(threadRootId);
    if (!queue) {
      queue = createHistoryQueue();
      roomQueue.threadQueues.set(threadRootId, queue);
      if (roomQueue.threadQueues.size > MAX_THREAD_QUEUES_PER_ROOM) {
        const oldest = roomQueue.threadQueues.keys().next().value;
        if (oldest !== void 0) {
          roomQueue.threadQueues.delete(oldest);
          clearThreadWatermarks(roomId, oldest);
        }
      }
    }
    return queue;
  }
  function getScopedQueue(roomId, threadRootId) {
    const roomQueue = getOrCreateQueue(roomId);
    return threadRootId ? getOrCreateThreadQueue(roomId, roomQueue, threadRootId) : roomQueue;
  }
  function findScopedQueue(roomId, threadRootId) {
    const roomQueue = roomQueues.get(roomId);
    if (!roomQueue) return;
    return threadRootId ? roomQueue.threadQueues.get(threadRootId) : roomQueue;
  }
  function appendToQueue(queue, entry) {
    queue.entries.push(entry);
    if (queue.entries.length > maxQueueSize) {
      const overflow = queue.entries.length - maxQueueSize;
      queue.entries.splice(0, overflow);
      queue.baseIndex += overflow;
    }
    return {
      snapshotIdx: queue.baseIndex + queue.entries.length,
      queueGeneration: queue.generation,
    };
  }
  function wmKey(agentId, roomId, threadRootId) {
    return JSON.stringify({
      agentId,
      roomId,
      scope: threadRootId ?? "main",
    });
  }
  function preparedTriggerKey(agentId, messageId) {
    if (!messageId?.trim()) return null;
    return `${agentId}:${messageId.trim()}`;
  }
  function rememberWatermark(key, snapshotIdx) {
    const nextSnapshotIdx = Math.max(agentWatermarks.get(key) ?? 0, snapshotIdx);
    if (agentWatermarks.has(key)) agentWatermarks.delete(key);
    agentWatermarks.set(key, nextSnapshotIdx);
    if (agentWatermarks.size > maxWatermarkEntries) {
      const oldest = agentWatermarks.keys().next().value;
      if (oldest !== void 0) agentWatermarks.delete(oldest);
    }
  }
  function markConsumedAfterReservedGap(queue, key, firstReservedRel, snapshotIdx) {
    const endRel = Math.min(snapshotIdx - queue.baseIndex, queue.entries.length);
    for (let rel = firstReservedRel + 1; rel < endRel; rel += 1) {
      const entry = queue.entries[rel];
      if (!entry || entry.reserved || entry.discarded) continue;
      entry.consumedBy ??= /* @__PURE__ */ new Set();
      entry.consumedBy.add(key);
    }
  }
  function rememberPreparedTrigger(queue, retryKey, prepared) {
    if (queue.preparedTriggers.has(retryKey)) queue.preparedTriggers.delete(retryKey);
    queue.preparedTriggers.set(retryKey, prepared);
    if (queue.preparedTriggers.size > maxPreparedTriggerEntries) {
      const oldest = queue.preparedTriggers.keys().next().value;
      if (oldest !== void 0) queue.preparedTriggers.delete(oldest);
    }
    return prepared;
  }
  function computePendingHistory(
    queue,
    agentId,
    roomId,
    limit,
    endAbsExclusive = queue.baseIndex + queue.entries.length,
    startAbsOverride,
    threadRootId,
  ) {
    if (limit <= 0 || queue.entries.length === 0) return [];
    const wm = startAbsOverride ?? agentWatermarks.get(wmKey(agentId, roomId, threadRootId)) ?? 0;
    const startRel = Math.max(wm, queue.baseIndex) - queue.baseIndex;
    const endRel = Math.max(
      startRel,
      Math.min(endAbsExclusive - queue.baseIndex, queue.entries.length),
    );
    const available = queue.entries
      .slice(startRel, endRel)
      .filter(
        (entry) =>
          !entry.discarded &&
          !entry.reserved &&
          !entry.consumedBy?.has(wmKey(agentId, roomId, threadRootId)),
      );
    return available.length > limit ? available.slice(-limit) : available;
  }
  function prepareTriggerInternal(agentId, roomId, limit, entry, threadRootId) {
    const queue = getScopedQueue(roomId, threadRootId);
    const retryKey = preparedTriggerKey(agentId, entry.messageId);
    if (retryKey) {
      const prepared = queue.preparedTriggers.get(retryKey);
      if (prepared) return rememberPreparedTrigger(queue, retryKey, prepared);
    }
    const prepared = {
      history: computePendingHistory(queue, agentId, roomId, limit, void 0, void 0, threadRootId),
      ...appendToQueue(queue, entry),
    };
    if (retryKey) return rememberPreparedTrigger(queue, retryKey, prepared);
    return prepared;
  }
  return {
    recordPending(roomId, entry, threadRootId) {
      appendToQueue(getScopedQueue(roomId, threadRootId), entry);
    },
    reservePending(agentId, roomId, entry, threadRootId) {
      const snapshot = appendToQueue(getScopedQueue(roomId, threadRootId), {
        ...entry,
        reserved: true,
      });
      return {
        ...snapshot,
        slotIdx: snapshot.snapshotIdx - 1,
        watermarkIdx: agentWatermarks.get(wmKey(agentId, roomId, threadRootId)) ?? 0,
      };
    },
    finalizePending(roomId, slot, entry, threadRootId) {
      const queue = findScopedQueue(roomId, threadRootId);
      if (!queue || queue.generation !== slot.queueGeneration) return;
      const rel = slot.slotIdx - queue.baseIndex;
      if (rel < 0 || rel >= queue.entries.length) return;
      queue.entries[rel] = entry;
    },
    discardPending(roomId, slot, threadRootId) {
      const queue = findScopedQueue(roomId, threadRootId);
      if (!queue || queue.generation !== slot.queueGeneration) return;
      const rel = slot.slotIdx - queue.baseIndex;
      if (rel < 0 || rel >= queue.entries.length) return;
      queue.entries[rel] = {
        sender: "",
        body: "",
        messageId: void 0,
        discarded: true,
      };
    },
    getPendingHistory(agentId, roomId, limit, threadRootId) {
      const queue = findScopedQueue(roomId, threadRootId);
      if (!queue) return [];
      return computePendingHistory(queue, agentId, roomId, limit, void 0, void 0, threadRootId);
    },
    recordTrigger(roomId, entry, threadRootId) {
      return appendToQueue(getScopedQueue(roomId, threadRootId), entry);
    },
    prepareTrigger(agentId, roomId, limit, entry, threadRootId) {
      return prepareTriggerInternal(agentId, roomId, limit, entry, threadRootId);
    },
    prepareReservedTrigger(agentId, roomId, limit, slot, entry, threadRootId) {
      const queue = findScopedQueue(roomId, threadRootId);
      if (!queue || queue.generation !== slot.queueGeneration)
        return prepareTriggerInternal(agentId, roomId, limit, entry, threadRootId);
      const rel = slot.slotIdx - queue.baseIndex;
      if (rel < 0 || rel >= queue.entries.length)
        return prepareTriggerInternal(agentId, roomId, limit, entry, threadRootId);
      const retryKey = preparedTriggerKey(agentId, entry.messageId);
      if (retryKey) {
        const prepared = queue.preparedTriggers.get(retryKey);
        if (prepared) {
          queue.entries[rel] = {
            sender: "",
            body: "",
            messageId: void 0,
            discarded: true,
          };
          return rememberPreparedTrigger(queue, retryKey, prepared);
        }
      }
      queue.entries[rel] = entry;
      const prepared = {
        history: computePendingHistory(
          queue,
          agentId,
          roomId,
          limit,
          slot.slotIdx,
          slot.watermarkIdx,
          threadRootId,
        ),
        snapshotIdx: slot.slotIdx + 1,
        queueGeneration: queue.generation,
      };
      if (retryKey) return rememberPreparedTrigger(queue, retryKey, prepared);
      return prepared;
    },
    consumeHistory(agentId, roomId, snapshot, messageId, threadRootId) {
      const key = wmKey(agentId, roomId, threadRootId);
      const queue = findScopedQueue(roomId, threadRootId);
      if (!queue) {
        agentWatermarks.delete(key);
        return;
      }
      if (queue.generation !== snapshot.queueGeneration) return;
      const firstReservedRel = queue.entries.findIndex(
        (entry, index) => entry.reserved === true && queue.baseIndex + index < snapshot.snapshotIdx,
      );
      if (firstReservedRel >= 0)
        markConsumedAfterReservedGap(queue, key, firstReservedRel, snapshot.snapshotIdx);
      rememberWatermark(
        key,
        firstReservedRel >= 0 ? queue.baseIndex + firstReservedRel : snapshot.snapshotIdx,
      );
      const retryKey = preparedTriggerKey(agentId, messageId);
      if (retryKey) queue.preparedTriggers.delete(retryKey);
    },
  };
}
function createRoomHistoryTracker(
  maxQueueSize = DEFAULT_MAX_QUEUE_SIZE,
  maxRoomQueues = DEFAULT_MAX_ROOM_QUEUES,
  maxWatermarkEntries = MAX_WATERMARK_ENTRIES,
  maxPreparedTriggerEntries = MAX_PREPARED_TRIGGER_ENTRIES,
) {
  const tracker = createRoomHistoryTrackerInternal(
    maxQueueSize,
    maxRoomQueues,
    maxWatermarkEntries,
    maxPreparedTriggerEntries,
  );
  return {
    recordPending: tracker.recordPending,
    reservePending: tracker.reservePending,
    finalizePending: tracker.finalizePending,
    discardPending: tracker.discardPending,
    prepareTrigger: tracker.prepareTrigger,
    prepareReservedTrigger: tracker.prepareReservedTrigger,
    consumeHistory: tracker.consumeHistory,
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/thread-context.ts
const MAX_TRACKED_THREAD_STARTERS = 256;
const MAX_THREAD_STARTER_BODY_LENGTH = 500;
function truncateThreadStarterBody(value) {
  if (value.length <= MAX_THREAD_STARTER_BODY_LENGTH) return value;
  return `${sliceUtf16Safe(value, 0, MAX_THREAD_STARTER_BODY_LENGTH - 3)}...`;
}
function summarizeMatrixThreadStarterEvent(event) {
  const body = summarizeMatrixMessageContextEvent(event);
  if (body) return truncateThreadStarterBody(body);
  const content = event.content;
  const msgtype = trimMatrixMaybeString(content.msgtype);
  if (msgtype) return `Matrix ${msgtype} message`;
  const eventType = trimMatrixMaybeString(event.type);
  return eventType ? `Matrix ${eventType} event` : void 0;
}
function formatMatrixThreadStarterBody(params) {
  const senderLabel = params.senderName ?? params.senderId ?? "unknown sender";
  const lines = [`Matrix thread root ${params.threadRootId} from ${senderLabel}:`];
  if (params.summary) lines.push(params.summary);
  return lines.join("\n");
}
function createMatrixThreadContextResolver(params) {
  const cache = /* @__PURE__ */ new Map();
  const remember = (key, value) => {
    cache.set(key, value);
    if (cache.size > MAX_TRACKED_THREAD_STARTERS) {
      const oldest = cache.keys().next().value;
      if (typeof oldest === "string") cache.delete(oldest);
    }
    return value;
  };
  return async (input) => {
    const cacheKey = `${input.roomId}:${input.threadRootId}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;
    const rootEvent = await params.client
      .getEvent(input.roomId, input.threadRootId)
      .catch((err) => {
        params.logVerboseMessage(
          `matrix: failed resolving thread root room=${input.roomId} id=${input.threadRootId}: ${String(err)}`,
        );
        return null;
      });
    if (!rootEvent) return { threadStarterBody: `Matrix thread root ${input.threadRootId}` };
    const rawEvent = rootEvent;
    const senderId = trimMatrixMaybeString(rawEvent.sender);
    const senderName =
      senderId && (await params.getMemberDisplayName(input.roomId, senderId).catch(() => void 0));
    const senderLabel = senderName ?? senderId;
    const summary = summarizeMatrixThreadStarterEvent(rawEvent);
    return remember(cacheKey, {
      threadStarterBody: formatMatrixThreadStarterBody({
        threadRootId: input.threadRootId,
        senderId,
        senderName,
        summary,
      }),
      senderId,
      senderLabel,
      summary,
    });
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/handler.ts
const ALLOW_FROM_STORE_CACHE_TTL_MS = 3e4;
const PAIRING_REPLY_COOLDOWN_MS = 5 * 6e4;
const MATRIX_TOOL_PROGRESS_MAX_CHARS = 300;
const loadMatrixSendModule = createLazyRuntimeModule(() => import("./send-9ZbyuTAU.js"));
const loadAcpBindingRuntime = createLazyRuntimeModule(
  () => import("./plugin-sdk/acp-binding-runtime.js"),
);
const loadSessionBindingRuntime = createLazyRuntimeModule(
  () => import("./plugin-sdk/session-binding-runtime.js"),
);
const loadMatrixReactionEvents = createLazyRuntimeModule(
  () => import("./reaction-events-Bqv1ZuFB.js"),
);
const loadMatrixDraftStream = createLazyRuntimeModule(() => import("./draft-stream-DOQxJXfi.js"));
async function matrixTextWouldActivateMentions(client, text) {
  const { resolveMatrixMentionsForBody } = await loadMatrixSendModule();
  const mentions = await resolveMatrixMentionsForBody({
    client,
    body: text,
  });
  return mentions.room === true || (mentions.user_ids?.length ?? 0) > 0;
}
const MAX_TRACKED_PAIRING_REPLY_SENDERS = 512;
const MAX_TRACKED_SHARED_DM_CONTEXT_NOTICES = 512;
var MatrixRetryableInboundError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "MatrixRetryableInboundError";
  }
};
async function redactMatrixDraftEvent(client, roomId, draftEventId) {
  await client.redactEvent(roomId, draftEventId).catch(() => {});
}
function buildMatrixFinalizedPreviewContent() {
  return { [MATRIX_OPENCLAW_FINALIZED_PREVIEW_KEY]: true };
}
function resolveMatrixMentionPrecheckText(params) {
  if (params.locationText?.trim()) return params.locationText.trim();
  if (typeof params.content.body === "string" && params.content.body.trim())
    return params.content.body.trim();
  if (isPollStartType(params.eventType)) {
    const parsed = parsePollStartContent(params.content);
    if (parsed) return formatPollAsText(parsed);
  }
  return "";
}
function hasBundledMatrixReplacementRelation(event) {
  const relations = event.unsigned?.["m.relations"];
  if (!relations || typeof relations !== "object") return false;
  return relations[RelationType.Replace] !== void 0;
}
function resolveMatrixInboundBodyText(params) {
  if (params.mediaPlaceholder) return params.rawBody || params.mediaPlaceholder;
  if (!params.mediaDownloadFailed || !params.hadMediaUrl) return params.rawBody;
  if (params.mediaSizeLimitExceeded)
    return formatMatrixMediaTooLargeText({
      body: params.rawBody,
      filename: params.filename,
      msgtype: params.msgtype,
    });
  return formatMatrixMediaUnavailableText({
    body: params.rawBody,
    filename: params.filename,
    msgtype: params.msgtype,
  });
}
function markTrackedRoomIfFirst(set, roomId) {
  if (set.has(roomId)) return false;
  set.add(roomId);
  if (set.size > MAX_TRACKED_SHARED_DM_CONTEXT_NOTICES) {
    const oldest = set.keys().next().value;
    if (typeof oldest === "string") set.delete(oldest);
  }
  return true;
}
function resolveMatrixSharedDmContextNotice(params) {
  if ((params.dmSessionScope ?? "per-user") === "per-room") return null;
  if (params.sentRooms.has(params.roomId)) return null;
  try {
    const currentSession = resolveMatrixStoredSessionMeta(
      getSessionEntry({
        storePath: params.storePath,
        sessionKey: params.sessionKey,
      }),
    );
    if (!currentSession) return null;
    if (currentSession.channel && currentSession.channel !== "matrix") return null;
    if (currentSession.accountId && currentSession.accountId !== params.accountId) return null;
    if (!currentSession.directUserId) return null;
    if (!currentSession.roomId || currentSession.roomId === params.roomId) return null;
    return [
      "This Matrix DM is sharing a session with another Matrix DM room.",
      "Use /focus here for a one-off isolated thread session when thread bindings are enabled, or set",
      "channels.matrix.dm.sessionScope to per-room to isolate each Matrix DM room.",
    ].join(" ");
  } catch (err) {
    params.logVerboseMessage(
      `matrix: failed checking shared DM session notice room=${params.roomId} (${String(err)})`,
    );
    return null;
  }
}
function resolveMatrixPendingHistoryText(params) {
  if (params.mentionPrecheckText) return params.mentionPrecheckText;
  if (!params.mediaUrl) return "";
  const body = typeof params.content.body === "string" ? params.content.body.trim() : void 0;
  const filename =
    typeof params.content.filename === "string" ? params.content.filename.trim() : void 0;
  const msgtype = typeof params.content.msgtype === "string" ? params.content.msgtype : void 0;
  return (
    formatMatrixMessageText({
      body: resolveMatrixMessageBody({
        body,
        filename,
        msgtype,
      }),
      attachment: resolveMatrixMessageAttachment({
        body,
        filename,
        msgtype,
      }),
    }) ?? ""
  );
}
function isMatrixAudioMediaEnabled(cfg) {
  return cfg.tools?.media?.audio?.enabled !== false;
}
function shouldDeferMatrixAudioPreflightForRoomIngress(params) {
  if (!isMatrixAudioMediaEnabled(params.cfg)) return false;
  const content = params.content;
  const contentUrl = "url" in content && typeof content.url === "string" ? content.url : void 0;
  const contentFile =
    "file" in content && content.file && typeof content.file === "object" ? content.file : void 0;
  const mediaUrl = contentUrl ?? contentFile?.url;
  const contentInfo =
    "info" in content && content.info && typeof content.info === "object" ? content.info : void 0;
  return (
    mediaUrl?.startsWith("mxc://") === true &&
    isMatrixAudioContent({
      msgtype: typeof content.msgtype === "string" ? content.msgtype : void 0,
      mimetype: contentInfo?.mimetype,
    })
  );
}
function resolveMatrixAllowBotsMode(value) {
  if (value === true) return "all";
  if (value === "mentions") return "mentions";
  return "off";
}
function formatMatrixToolProgressMarkdownCode(text) {
  return `\`${(text.length <= MATRIX_TOOL_PROGRESS_MAX_CHARS ? text : `${truncateUtf16Safe(text, MATRIX_TOOL_PROGRESS_MAX_CHARS - 1).trimEnd()}...`).replaceAll("`", "'")}\``;
}
function createMatrixRoomMessageHandler(params) {
  const {
    client,
    core,
    cfg,
    accountId,
    accountConfig,
    runtime,
    logger,
    logVerboseMessage,
    allowFromResolvedEntries = [],
    groupAllowFromResolvedEntries = [],
    roomsConfig,
    accountAllowBots,
    configuredBotUserIds = /* @__PURE__ */ new Set(),
    groupPolicy,
    replyToMode,
    threadReplies,
    dmThreadReplies,
    dmSessionScope,
    streaming,
    previewToolProgressEnabled,
    blockStreamingEnabled,
    dmEnabled,
    dmPolicy,
    textLimit,
    mediaMaxBytes,
    historyLimit,
    startupMs,
    startupGraceMs,
    dropPreStartupMessages,
    inboundDeduper,
    directTracker,
    getRoomInfo,
    getMemberDisplayName,
    needsRoomAliasesForConfig,
    resolveLiveUserAllowlist = resolveMatrixMonitorLiveUserAllowlist,
  } = params;
  const contextVisibilityMode = resolveChannelContextVisibilityMode({
    cfg,
    channel: "matrix",
    accountId,
  });
  let cachedStoreAllowFrom = null;
  let liveDmAllowlistCache = null;
  let liveGroupAllowlistCache = null;
  const resolveCachedLiveAllowlist = async (paramsValue) => {
    const accountConfigLocal = resolveMatrixAccountConfig({
      cfg: paramsValue.cfg,
      accountId,
    });
    const signature = JSON.stringify({
      entries: (paramsValue.entries ?? []).map((entry) => String(entry).trim()),
      failClosedOnUnresolved: paramsValue.failClosedOnUnresolved === true,
      dangerouslyAllowNameMatching: isDangerousNameMatchingEnabled(accountConfigLocal),
    });
    if (paramsValue.cache?.signature === signature) return paramsValue.cache.entries;
    const entries = await resolveLiveUserAllowlist({
      cfg: paramsValue.cfg,
      accountId,
      entries: paramsValue.entries,
      failClosedOnUnresolved: paramsValue.failClosedOnUnresolved,
      startupResolvedEntries: paramsValue.startupResolvedEntries,
      runtime,
    });
    const next = {
      signature,
      entries,
    };
    paramsValue.updateCache(next);
    return entries;
  };
  const pairingReplySentAtMsBySender = /* @__PURE__ */ new Map();
  const resolveThreadContext = createMatrixThreadContextResolver({
    client,
    getMemberDisplayName,
    logVerboseMessage,
  });
  const resolveReplyContext = createMatrixReplyContextResolver({
    client,
    getMemberDisplayName,
    logVerboseMessage,
  });
  const roomHistoryTracker = createRoomHistoryTracker();
  const roomIngressQueue = new KeyedAsyncQueue();
  const sharedDmContextNoticeRooms = /* @__PURE__ */ new Set();
  const readStoreAllowFrom = async () => {
    const now = Date.now();
    if (
      cachedStoreAllowFrom &&
      isFutureDateTimestampMs(cachedStoreAllowFrom.expiresAtMs, { nowMs: now })
    )
      return cachedStoreAllowFrom.value;
    cachedStoreAllowFrom = null;
    const value = await core.channel.pairing
      .readAllowFromStore({
        channel: "matrix",
        env: process.env,
        accountId,
      })
      .catch(() => []);
    const expiresAtMs = resolveExpiresAtMsFromDurationMs(ALLOW_FROM_STORE_CACHE_TTL_MS, {
      nowMs: now,
    });
    cachedStoreAllowFrom =
      expiresAtMs === void 0
        ? null
        : {
            value,
            expiresAtMs,
          };
    return value;
  };
  const shouldSendPairingReply = (senderId, created) => {
    const now = Date.now();
    if (created) {
      pairingReplySentAtMsBySender.set(senderId, now);
      return true;
    }
    const lastSentAtMs = pairingReplySentAtMsBySender.get(senderId);
    if (typeof lastSentAtMs === "number" && now - lastSentAtMs < PAIRING_REPLY_COOLDOWN_MS)
      return false;
    pairingReplySentAtMsBySender.set(senderId, now);
    if (pairingReplySentAtMsBySender.size > MAX_TRACKED_PAIRING_REPLY_SENDERS) {
      const oldestSender = pairingReplySentAtMsBySender.keys().next().value;
      if (typeof oldestSender === "string") pairingReplySentAtMsBySender.delete(oldestSender);
    }
    return true;
  };
  const runRoomIngress = async (roomId, task) => {
    return await roomIngressQueue.enqueue(roomId, task);
  };
  return async (roomId, event) => {
    const eventId = typeof event.event_id === "string" ? event.event_id.trim() : "";
    let claimedInboundEvent = false;
    let draftStreamRef;
    let draftConsumed = false;
    try {
      const eventType = event.type;
      if (eventType === EventType.RoomMessageEncrypted) return;
      const isPollEvent = isPollEventType(eventType);
      const isReactionEvent = eventType === EventType.Reaction;
      const locationContent = event.content;
      const isLocationEvent =
        eventType === EventType.Location ||
        (eventType === EventType.RoomMessage && locationContent.msgtype === EventType.Location);
      if (
        eventType !== EventType.RoomMessage &&
        !isPollEvent &&
        !isLocationEvent &&
        !isReactionEvent
      )
        return;
      logVerboseMessage(
        `matrix: inbound event room=${roomId} type=${eventType} id=${event.event_id ?? "unknown"}`,
      );
      if (event.unsigned?.redacted_because) return;
      const senderId = event.sender;
      if (!senderId) return;
      const eventTs = event.origin_server_ts;
      const eventAge = event.unsigned?.age;
      const commitInboundEventIfClaimed = async () => {
        if (!claimedInboundEvent || !inboundDeduper || !eventId) return;
        await inboundDeduper.commitEvent({
          roomId,
          eventId,
        });
        claimedInboundEvent = false;
      };
      const readIngressPrefix = async () => {
        const selfUserId = await client.getUserId();
        if (senderId === selfUserId) return;
        if (dropPreStartupMessages) {
          if (typeof eventTs === "number" && eventTs < startupMs - startupGraceMs) return;
          if (
            typeof eventTs !== "number" &&
            typeof eventAge === "number" &&
            eventAge > startupGraceMs
          )
            return;
        }
        const content = event.content;
        if (
          eventType === EventType.RoomMessage &&
          isMatrixVerificationRoomMessage({
            msgtype: content.msgtype,
            body: content.body,
          })
        ) {
          logVerboseMessage(`matrix: skip verification/system room message room=${roomId}`);
          return;
        }
        const locationPayload = resolveMatrixLocation({
          eventType,
          content,
        });
        const relates = content["m.relates_to"];
        if (relates && "rel_type" in relates && relates.rel_type === RelationType.Replace) return;
        if (hasBundledMatrixReplacementRelation(event)) return;
        if (eventId && inboundDeduper) {
          claimedInboundEvent = await inboundDeduper.claimEvent({
            roomId,
            eventId,
          });
          if (!claimedInboundEvent) {
            logVerboseMessage(`matrix: skip duplicate inbound event room=${roomId} id=${eventId}`);
            return;
          }
        }
        return {
          content,
          isDirectMessage: await directTracker.isDirectMessage({
            roomId,
            senderId,
            selfUserId,
          }),
          locationPayload,
          selfUserId,
        };
      };
      const continueIngress = async (paramsLocal) => {
        let content = paramsLocal.content;
        const isDirectMessage = paramsLocal.isDirectMessage;
        const isRoom = !isDirectMessage;
        const { audioPreflightMode, locationPayload, reservedHistorySlot, selfUserId } =
          paramsLocal;
        const messageId = event.event_id ?? "";
        const threadRootId = resolveMatrixThreadRootId({
          event,
          content,
        });
        const thread = resolveMatrixThreadRouting({
          isDirectMessage,
          threadReplies,
          dmThreadReplies,
          messageId,
          threadRootId,
        });
        const historyThreadId = threadRootId ? thread.threadId : void 0;
        let reservedHistorySlotConsumed = false;
        const discardReservedHistorySlot = () => {
          if (reservedHistorySlot && !reservedHistorySlotConsumed) {
            roomHistoryTracker.discardPending(roomId, reservedHistorySlot, historyThreadId);
            reservedHistorySlotConsumed = true;
          }
        };
        const commitInboundEventIfClaimedAndDiscardReserved = async () => {
          discardReservedHistorySlot();
          await commitInboundEventIfClaimed();
        };
        if (isRoom && groupPolicy === "disabled") {
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        const roomInfoForConfig =
          isRoom && needsRoomAliasesForConfig
            ? await getRoomInfo(roomId, { includeAliases: true })
            : void 0;
        const roomAliasesForConfig = roomInfoForConfig
          ? [roomInfoForConfig.canonicalAlias ?? "", ...roomInfoForConfig.altAliases].filter(
              Boolean,
            )
          : [];
        const roomConfigInfo = isRoom
          ? resolveMatrixRoomConfig({
              rooms: roomsConfig,
              roomId,
              aliases: roomAliasesForConfig,
            })
          : void 0;
        const roomConfig = roomConfigInfo?.config;
        const allowBotsMode = resolveMatrixAllowBotsMode(roomConfig?.allowBots ?? accountAllowBots);
        const isConfiguredBotSender = configuredBotUserIds.has(senderId);
        const roomMatchMeta = roomConfigInfo
          ? `matchKey=${roomConfigInfo.matchKey ?? "none"} matchSource=${roomConfigInfo.matchSource ?? "none"}`
          : "matchKey=none matchSource=none";
        if (isConfiguredBotSender && allowBotsMode === "off") {
          logVerboseMessage(
            `matrix: drop configured bot sender=${senderId} (allowBots=false${isDirectMessage ? "" : `, ${roomMatchMeta}`})`,
          );
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        const botLoopProtection =
          isConfiguredBotSender && senderId !== selfUserId
            ? {
                scopeId: accountId,
                conversationId: roomId,
                senderId,
                receiverId: selfUserId,
                config: mergePairLoopGuardConfig(
                  accountConfig?.botLoopProtection,
                  roomConfig?.botLoopProtection,
                ),
                defaultsConfig: cfg.channels?.defaults?.botLoopProtection,
                defaultEnabled: true,
                nowMs: eventTs ?? void 0,
              }
            : void 0;
        if (isRoom && roomConfig && !roomConfigInfo?.allowed) {
          logVerboseMessage(`matrix: room disabled room=${roomId} (${roomMatchMeta})`);
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        if (isRoom && groupPolicy === "allowlist") {
          if (!roomConfigInfo?.allowlistConfigured) {
            logVerboseMessage(`matrix: drop room message (no allowlist, ${roomMatchMeta})`);
            await commitInboundEventIfClaimedAndDiscardReserved();
            return;
          }
          if (!roomConfig) {
            logVerboseMessage(`matrix: drop room message (not in allowlist, ${roomMatchMeta})`);
            await commitInboundEventIfClaimedAndDiscardReserved();
            return;
          }
        }
        let senderNamePromise = null;
        const getSenderName = async () => {
          senderNamePromise ??= getMemberDisplayName(roomId, senderId).catch(() => senderId);
          return await senderNamePromise;
        };
        const storeAllowFrom =
          isDirectMessage && dmPolicy !== "allowlist" && dmPolicy !== "open"
            ? await readStoreAllowFrom()
            : [];
        const roomUsers = roomConfig?.users ?? [];
        const liveCfg = core.config.current();
        const liveAccountAllowlists = resolveMatrixAccountAllowlistConfig({
          cfg: liveCfg,
          accountId,
        });
        const liveDmAllowFrom = await resolveCachedLiveAllowlist({
          cfg: liveCfg,
          entries: liveAccountAllowlists.dmAllowFrom,
          startupResolvedEntries: allowFromResolvedEntries,
          cache: liveDmAllowlistCache,
          updateCache: (next) => {
            liveDmAllowlistCache = next;
          },
        });
        const liveGroupAllowFrom = await resolveCachedLiveAllowlist({
          cfg: liveCfg,
          entries: liveAccountAllowlists.groupAllowFrom,
          failClosedOnUnresolved: true,
          startupResolvedEntries: groupAllowFromResolvedEntries,
          cache: liveGroupAllowlistCache,
          updateCache: (next) => {
            liveGroupAllowlistCache = next;
          },
        });
        const accessState = await resolveMatrixMonitorAccessState({
          allowFrom: liveDmAllowFrom,
          storeAllowFrom,
          dmPolicy,
          groupPolicy,
          groupAllowFrom: liveGroupAllowFrom,
          roomUsers,
          senderId,
          isRoom,
          accountId,
          eventKind: isReactionEvent ? "reaction" : "message",
        });
        const { effectiveGroupAllowFrom, effectiveRoomUsers, messageIngress } = accessState;
        const ingressDecision = messageIngress.ingress;
        if (isDirectMessage) {
          if (!dmEnabled || dmPolicy === "disabled") {
            await commitInboundEventIfClaimedAndDiscardReserved();
            return;
          }
          const senderReason = messageIngress.senderAccess.reasonCode;
          if (ingressDecision.decision !== "allow") {
            if (ingressDecision.admission === "pairing-required") {
              const senderName = await getSenderName();
              const { code, created } = await core.channel.pairing.upsertPairingRequest({
                channel: "matrix",
                id: senderId,
                accountId,
                meta: { name: senderName },
              });
              if (shouldSendPairingReply(senderId, created)) {
                const pairingReply = core.channel.pairing.buildPairingReply({
                  channel: "matrix",
                  idLine: `Your Matrix user id: ${senderId}`,
                  code,
                });
                logVerboseMessage(
                  created
                    ? `matrix pairing request sender=${senderId} name=${senderName ?? "unknown"} (reason=${senderReason})`
                    : `matrix pairing reminder sender=${senderId} name=${senderName ?? "unknown"} (reason=${senderReason})`,
                );
                try {
                  const { sendMessageMatrix } = await loadMatrixSendModule();
                  await sendMessageMatrix(
                    `room:${roomId}`,
                    created
                      ? pairingReply
                      : `${pairingReply}\n\nPairing request is still pending approval. Reusing existing code.`,
                    {
                      client,
                      cfg,
                      accountId,
                    },
                  );
                  await commitInboundEventIfClaimed();
                } catch (err) {
                  logVerboseMessage(`matrix pairing reply failed for ${senderId}: ${String(err)}`);
                  discardReservedHistorySlot();
                  return;
                }
              } else {
                logVerboseMessage(
                  `matrix pairing reminder suppressed sender=${senderId} (cooldown)`,
                );
                await commitInboundEventIfClaimedAndDiscardReserved();
              }
            }
            if (isReactionEvent || dmPolicy !== "pairing") {
              logVerboseMessage(
                `matrix: blocked ${isReactionEvent ? "reaction" : "dm"} sender ${senderId} (dmPolicy=${dmPolicy}, reason=${senderReason})`,
              );
              await commitInboundEventIfClaimedAndDiscardReserved();
            }
            return;
          }
        }
        if (isRoom && ingressDecision.decision !== "allow") {
          logVerboseMessage(
            `matrix: blocked sender ${senderId} (ingress=${ingressDecision.reasonCode}, ${roomMatchMeta})`,
          );
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        if (isRoom) logVerboseMessage(`matrix: allow room ${roomId} (${roomMatchMeta})`);
        if (isReactionEvent) {
          const senderName = await getSenderName();
          const { handleInboundMatrixReaction } = await loadMatrixReactionEvents();
          await handleInboundMatrixReaction({
            client,
            core,
            cfg,
            accountId,
            roomId,
            event,
            senderId,
            senderLabel: senderName,
            selfUserId,
            isDirectMessage,
            logVerboseMessage,
          });
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        let pollSnapshotPromise = null;
        const getPollSnapshot = async () => {
          if (!isPollEvent) return null;
          pollSnapshotPromise ??= fetchMatrixPollSnapshot(client, roomId, event).catch((err) => {
            logVerboseMessage(
              `matrix: failed resolving poll snapshot room=${roomId} id=${event.event_id ?? "unknown"}: ${String(err)}`,
            );
            return null;
          });
          return await pollSnapshotPromise;
        };
        const mentionPrecheckText = resolveMatrixMentionPrecheckText({
          eventType,
          content,
          locationText: locationPayload?.text,
        });
        const contentUrl =
          "url" in content && typeof content.url === "string" ? content.url : void 0;
        const contentFile =
          "file" in content && content.file && typeof content.file === "object"
            ? content.file
            : void 0;
        const mediaUrl = contentUrl ?? contentFile?.url;
        const earlyContentInfo =
          "info" in content && content.info && typeof content.info === "object"
            ? content.info
            : void 0;
        const earlyContentType = earlyContentInfo?.mimetype;
        const earlyContentSize =
          typeof earlyContentInfo?.size === "number" ? earlyContentInfo.size : void 0;
        const earlyContentBody = typeof content.body === "string" ? content.body.trim() : "";
        const earlyOriginalFilename =
          (typeof content.filename === "string" ? content.filename.trim() : "") ||
          earlyContentBody ||
          void 0;
        const pendingHistoryText = resolveMatrixPendingHistoryText({
          mentionPrecheckText,
          content,
          mediaUrl,
        });
        const pendingHistoryPollText =
          !pendingHistoryText && isPollEvent && historyLimit > 0
            ? (await getPollSnapshot())?.text
            : "";
        if (!mentionPrecheckText && !mediaUrl && !isPollEvent) {
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        let preflightMedia = null;
        let preflightMediaDownloadFailed = false;
        let preflightMediaSizeLimitExceeded = false;
        let preflightAudioTranscript;
        const {
          route: _route,
          configuredBinding: _configuredBinding,
          runtimeBindingId: _runtimeBindingId,
        } = resolveMatrixInboundRoute({
          cfg,
          accountId,
          roomId,
          senderId,
          isDirectMessage,
          dmSessionScope,
          threadId: thread.threadId,
          eventTs: eventTs ?? void 0,
          resolveAgentRoute: core.channel.routing.resolveAgentRoute,
        });
        const hasExplicitSessionBinding = _configuredBinding !== null || _runtimeBindingId !== null;
        const preflightAudioMediaUrl = mediaUrl?.startsWith("mxc://") ? mediaUrl : void 0;
        const shouldRunMatrixAudioPreflight =
          isMatrixAudioContent({
            msgtype: typeof content.msgtype === "string" ? content.msgtype : void 0,
            mimetype: earlyContentType,
          }) &&
          isMatrixAudioMediaEnabled(cfg) &&
          preflightAudioMediaUrl !== void 0;
        if (
          shouldRunMatrixAudioPreflight &&
          audioPreflightMode === "defer" &&
          isRoom &&
          historyLimit > 0 &&
          !reservedHistorySlot
        ) {
          const reserved = roomHistoryTracker.reservePending(
            _route.agentId,
            roomId,
            {
              sender: senderId,
              body: pendingHistoryText,
              timestamp: eventTs ?? void 0,
              messageId,
            },
            historyThreadId,
          );
          return {
            deferredPrefix: {
              ...paramsLocal,
              audioPreflightMode: "run",
              reservedHistorySlot: reserved,
            },
          };
        }
        if (shouldRunMatrixAudioPreflight) {
          try {
            preflightMedia = await downloadMatrixMedia({
              client,
              mxcUrl: preflightAudioMediaUrl,
              contentType: earlyContentType,
              sizeBytes: earlyContentSize,
              maxBytes: mediaMaxBytes,
              file: contentFile,
              originalFilename: earlyOriginalFilename,
            });
          } catch (err) {
            preflightMediaDownloadFailed = true;
            if (isMatrixMediaSizeLimitError(err)) preflightMediaSizeLimitExceeded = true;
            const errorText = formatMatrixErrorMessage(err);
            logVerboseMessage(
              `matrix: media download failed room=${roomId} id=${event.event_id ?? "unknown"} type=${content.msgtype} error=${errorText}`,
            );
            logger.warn("matrix media download failed", {
              roomId,
              eventId: event.event_id,
              msgtype: content.msgtype,
              encrypted: Boolean(contentFile),
              error: errorText,
            });
          }
          if (preflightMedia)
            preflightAudioTranscript = await resolveMatrixPreflightAudioTranscript({
              mediaPath: preflightMedia.path,
              mediaContentType: preflightMedia.contentType,
              cfg,
              accountId,
              chatType: isDirectMessage ? "direct" : "channel",
              originatingTo: `room:${roomId}`,
              messageThreadId: thread.threadId,
              sessionKey: _route.sessionKey,
            });
        }
        const agentMentionRegexes = core.channel.mentions.buildMentionRegexes(cfg, _route.agentId, {
          provider: "matrix",
          conversationId: roomId,
          providerPolicy: accountConfig?.mentionPatterns,
        });
        const selfDisplayName = content.formatted_body
          ? await getMemberDisplayName(roomId, selfUserId).catch(() => void 0)
          : void 0;
        const mentionPrecheckTextWithTranscript = preflightAudioTranscript
          ? [mentionPrecheckText, preflightAudioTranscript].filter(Boolean).join("\n").trim()
          : mentionPrecheckText;
        const { wasMentioned, hasExplicitMention } = resolveMentions({
          content,
          userId: selfUserId,
          displayName: selfDisplayName,
          text: mentionPrecheckTextWithTranscript,
          mentionRegexes: agentMentionRegexes,
        });
        if (
          isConfiguredBotSender &&
          allowBotsMode === "mentions" &&
          !isDirectMessage &&
          !wasMentioned
        ) {
          logVerboseMessage(
            `matrix: drop configured bot sender=${senderId} (allowBots=mentions, missing mention, ${roomMatchMeta})`,
          );
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        const allowTextCommands = core.channel.commands.shouldHandleTextCommands({
          cfg,
          surface: "matrix",
        });
        const useAccessGroups = cfg.commands?.useAccessGroups !== false;
        const commandCheckText = stripMatrixMentionPrefix({
          text: mentionPrecheckText,
          userId: selfUserId,
          displayName: selfDisplayName,
          mentionRegexes: agentMentionRegexes,
        });
        const hasControlCommandInMessage = core.channel.text.hasControlCommand(
          commandCheckText,
          cfg,
        );
        const commandAccess = await resolveMatrixMonitorCommandAccess(accessState, {
          useAccessGroups,
          allowTextCommands,
          hasControlCommand: hasControlCommandInMessage,
        });
        const commandAuthorized = commandAccess.authorized;
        if (isRoom && commandAccess.shouldBlockControlCommand) {
          logInboundDrop({
            log: logVerboseMessage,
            channel: "matrix",
            reason: "control command (unauthorized)",
            target: senderId,
          });
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        const shouldRequireMention = isRoom
          ? roomConfig?.autoReply === true
            ? false
            : roomConfig?.autoReply === false
              ? true
              : typeof roomConfig?.requireMention === "boolean"
                ? roomConfig?.requireMention
                : true
          : false;
        const shouldBypassMention =
          allowTextCommands &&
          isRoom &&
          shouldRequireMention &&
          !wasMentioned &&
          !hasExplicitMention &&
          commandAuthorized &&
          hasControlCommandInMessage;
        const canDetectMention = agentMentionRegexes.length > 0 || hasExplicitMention;
        if (isRoom && shouldRequireMention && !wasMentioned && !shouldBypassMention) {
          const pendingHistoryBody = preflightAudioTranscript
            ? formatMatrixAudioTranscript(preflightAudioTranscript)
            : pendingHistoryText || pendingHistoryPollText;
          if (historyLimit > 0 && pendingHistoryBody) {
            const pendingEntry = {
              sender: senderId,
              body: pendingHistoryBody,
              timestamp: eventTs ?? void 0,
              messageId,
            };
            if (reservedHistorySlot) {
              roomHistoryTracker.finalizePending(
                roomId,
                reservedHistorySlot,
                pendingEntry,
                historyThreadId,
              );
              reservedHistorySlotConsumed = true;
            } else roomHistoryTracker.recordPending(roomId, pendingEntry, historyThreadId);
          }
          logger.info("skipping room message", {
            roomId,
            reason: "no-mention",
          });
          await commitInboundEventIfClaimed();
          return;
        }
        if (preflightAudioTranscript)
          await sendMatrixPreflightAudioTranscriptEcho({
            transcript: preflightAudioTranscript,
            cfg,
            accountId,
            originatingTo: `room:${roomId}`,
            messageThreadId: thread.threadId,
          });
        if (isPollEvent) {
          const pollSnapshot = await getPollSnapshot();
          if (!pollSnapshot) {
            discardReservedHistorySlot();
            return;
          }
          content = {
            msgtype: "m.text",
            body: pollSnapshot.text,
          };
        }
        let media = preflightMedia;
        let mediaDownloadFailed = preflightMediaDownloadFailed;
        let mediaSizeLimitExceeded = preflightMediaSizeLimitExceeded;
        const finalContentUrl =
          "url" in content && typeof content.url === "string" ? content.url : void 0;
        const finalContentFile =
          "file" in content && content.file && typeof content.file === "object"
            ? content.file
            : void 0;
        const finalMediaUrl = finalContentUrl ?? finalContentFile?.url;
        const contentBody = typeof content.body === "string" ? content.body.trim() : "";
        const originalFilename =
          (typeof content.filename === "string" ? content.filename.trim() : "") ||
          contentBody ||
          void 0;
        const contentInfo =
          "info" in content && content.info && typeof content.info === "object"
            ? content.info
            : void 0;
        const contentType = contentInfo?.mimetype;
        const contentSize = typeof contentInfo?.size === "number" ? contentInfo.size : void 0;
        if (!media && !mediaDownloadFailed && finalMediaUrl?.startsWith("mxc://"))
          try {
            media = await downloadMatrixMedia({
              client,
              mxcUrl: finalMediaUrl,
              contentType,
              sizeBytes: contentSize,
              maxBytes: mediaMaxBytes,
              file: finalContentFile,
              originalFilename,
            });
          } catch (err) {
            mediaDownloadFailed = true;
            if (isMatrixMediaSizeLimitError(err)) mediaSizeLimitExceeded = true;
            const errorText = formatMatrixErrorMessage(err);
            logVerboseMessage(
              `matrix: media download failed room=${roomId} id=${event.event_id ?? "unknown"} type=${content.msgtype} error=${errorText}`,
            );
            logger.warn("matrix media download failed", {
              roomId,
              eventId: event.event_id,
              msgtype: content.msgtype,
              encrypted: Boolean(finalContentFile),
              error: errorText,
            });
          }
        let bodyText = resolveMatrixInboundBodyText({
          rawBody: locationPayload?.text ?? contentBody,
          filename: typeof content.filename === "string" ? content.filename : void 0,
          mediaPlaceholder: media?.placeholder,
          msgtype: content.msgtype,
          hadMediaUrl: Boolean(finalMediaUrl),
          mediaDownloadFailed,
          mediaSizeLimitExceeded,
        });
        if (
          preflightMedia &&
          bodyText &&
          bodyText !== preflightMedia.placeholder &&
          isLikelyBareFilename(bodyText)
        )
          bodyText = preflightMedia.placeholder;
        if (preflightAudioTranscript) {
          const transcriptBody = formatMatrixAudioTranscript(preflightAudioTranscript);
          bodyText =
            !bodyText || bodyText === media?.placeholder
              ? transcriptBody
              : `${bodyText}\n${transcriptBody}`;
        }
        if (!bodyText) {
          await commitInboundEventIfClaimedAndDiscardReserved();
          return;
        }
        const commandBodyText = hasControlCommandInMessage ? commandCheckText : bodyText;
        const senderName = await getSenderName();
        if (_configuredBinding) {
          const { ensureConfiguredAcpBindingReady } = await loadAcpBindingRuntime();
          if (
            !(
              await ensureConfiguredAcpBindingReady({
                cfg,
                configuredBinding: _configuredBinding,
              })
            ).ok
          ) {
            logInboundDrop({
              log: logVerboseMessage,
              channel: "matrix",
              reason: "configured ACP binding unavailable",
              target: _configuredBinding.spec.conversationId,
            });
            discardReservedHistorySlot();
            return;
          }
        }
        if (_runtimeBindingId) {
          const { getSessionBindingService } = await loadSessionBindingRuntime();
          getSessionBindingService().touch(_runtimeBindingId, eventTs ?? void 0);
        }
        const preparedTrigger =
          isRoom && historyLimit > 0
            ? reservedHistorySlot
              ? roomHistoryTracker.prepareReservedTrigger(
                  _route.agentId,
                  roomId,
                  historyLimit,
                  reservedHistorySlot,
                  {
                    sender: senderName,
                    body: bodyText,
                    timestamp: eventTs ?? void 0,
                    messageId,
                  },
                  historyThreadId,
                )
              : roomHistoryTracker.prepareTrigger(
                  _route.agentId,
                  roomId,
                  historyLimit,
                  {
                    sender: senderName,
                    body: bodyText,
                    timestamp: eventTs ?? void 0,
                    messageId,
                  },
                  historyThreadId,
                )
            : void 0;
        if (reservedHistorySlot && preparedTrigger) reservedHistorySlotConsumed = true;
        return {
          route: _route,
          hasExplicitSessionBinding,
          roomConfig,
          isDirectMessage,
          isRoom,
          shouldRequireMention,
          wasMentioned,
          shouldBypassMention,
          canDetectMention,
          commandAuthorized,
          inboundHistory: preparedTrigger
            ? buildInboundHistoryFromEntries({
                entries: preparedTrigger.history,
                limit: historyLimit,
              })
            : void 0,
          senderName,
          bodyText,
          commandBodyText,
          media,
          preflightAudioTranscript,
          locationPayload,
          messageId,
          triggerSnapshot: preparedTrigger,
          threadRootId,
          thread,
          botLoopProtection,
          effectiveGroupAllowFrom,
          effectiveRoomUsers,
        };
      };
      const ingressResult =
        historyLimit > 0
          ? await runRoomIngress(roomId, async () => {
              const prefix = await readIngressPrefix();
              if (!prefix) return;
              if (prefix.isDirectMessage) return { deferredPrefix: prefix };
              const result = await continueIngress({
                ...prefix,
                audioPreflightMode: shouldDeferMatrixAudioPreflightForRoomIngress({
                  content: prefix.content,
                  cfg,
                })
                  ? "defer"
                  : "run",
              });
              return result && "deferredPrefix" in result
                ? { deferredPrefix: result.deferredPrefix }
                : { ingressResult: result };
            })
          : void 0;
      const resolvedIngressResult =
        historyLimit > 0
          ? ingressResult?.deferredPrefix
            ? await continueIngress(ingressResult.deferredPrefix)
            : ingressResult?.ingressResult
          : await (async () => {
              const prefix = await readIngressPrefix();
              if (!prefix) return;
              return await continueIngress(prefix);
            })();
      if (!resolvedIngressResult) return;
      if ("deferredPrefix" in resolvedIngressResult) return;
      const {
        route: _route,
        hasExplicitSessionBinding,
        roomConfig,
        isDirectMessage,
        isRoom,
        shouldRequireMention,
        wasMentioned,
        shouldBypassMention,
        canDetectMention,
        commandAuthorized,
        inboundHistory,
        senderName,
        bodyText,
        commandBodyText,
        media,
        preflightAudioTranscript,
        locationPayload,
        messageId,
        triggerSnapshot,
        threadRootId,
        thread,
        botLoopProtection,
        effectiveGroupAllowFrom,
        effectiveRoomUsers,
      } = resolvedIngressResult;
      const replyToEventId = resolveMatrixReplyToEventId(event.content);
      const threadTarget = thread.threadId;
      const isRoomContextSenderAllowed = (contextSenderId) => {
        if (!isRoom || !contextSenderId) return true;
        if (effectiveRoomUsers.length > 0)
          return resolveMatrixAllowListMatch({
            allowList: effectiveRoomUsers,
            userId: contextSenderId,
          }).allowed;
        if (groupPolicy === "allowlist" && effectiveGroupAllowFrom.length > 0)
          return resolveMatrixAllowListMatch({
            allowList: effectiveGroupAllowFrom,
            userId: contextSenderId,
          }).allowed;
        return true;
      };
      const shouldIncludeRoomContextSender = (kind, contextSenderId) =>
        evaluateSupplementalContextVisibility({
          mode: contextVisibilityMode,
          kind,
          senderAllowed: isRoomContextSenderAllowed(contextSenderId),
        }).include;
      let threadContext = threadRootId
        ? await resolveThreadContext({
            roomId,
            threadRootId,
          })
        : void 0;
      let threadContextBlockedByPolicy = false;
      if (
        threadContext?.senderId &&
        !shouldIncludeRoomContextSender("thread", threadContext.senderId)
      ) {
        logVerboseMessage(`matrix: drop thread root context (mode=${contextVisibilityMode})`);
        threadContextBlockedByPolicy = true;
        threadContext = void 0;
      }
      let replyContext;
      if (replyToEventId && replyToEventId === threadRootId && threadContext?.summary)
        replyContext = {
          replyToBody: threadContext.summary,
          replyToSender: threadContext.senderLabel,
          replyToSenderId: threadContext.senderId,
        };
      else if (replyToEventId && replyToEventId === threadRootId && threadContextBlockedByPolicy)
        replyContext = await resolveReplyContext({
          roomId,
          eventId: replyToEventId,
        });
      else
        replyContext = replyToEventId
          ? await resolveReplyContext({
              roomId,
              eventId: replyToEventId,
            })
          : void 0;
      const replySenderAllowed =
        !replyContext?.replyToSenderId || isRoomContextSenderAllowed(replyContext.replyToSenderId);
      const roomName = (isRoom ? await getRoomInfo(roomId) : void 0)?.name;
      const envelopeFrom = isDirectMessage ? senderName : (roomName ?? roomId);
      const textWithId = `${bodyText}\n[matrix event id: ${messageId} room: ${roomId}]`;
      const storePath = core.channel.session.resolveStorePath(cfg.session?.store, {
        agentId: _route.agentId,
      });
      const envelopeOptions = core.channel.reply.resolveEnvelopeFormatOptions(cfg);
      const previousTimestamp = core.channel.session.readSessionUpdatedAt({
        storePath,
        sessionKey: _route.sessionKey,
      });
      const sharedDmNoticeSessionKey = threadTarget
        ? _route.mainSessionKey || _route.sessionKey
        : _route.sessionKey;
      const sharedDmContextNotice = isDirectMessage
        ? hasExplicitSessionBinding
          ? null
          : resolveMatrixSharedDmContextNotice({
              storePath,
              sessionKey: sharedDmNoticeSessionKey,
              roomId,
              accountId: _route.accountId,
              dmSessionScope,
              sentRooms: sharedDmContextNoticeRooms,
              logVerboseMessage,
            })
        : null;
      const body = core.channel.reply.formatAgentEnvelope({
        channel: "Matrix",
        from: envelopeFrom,
        timestamp: eventTs ?? void 0,
        previousTimestamp,
        envelope: envelopeOptions,
        body: textWithId,
      });
      const groupSystemPrompt = normalizeOptionalString(roomConfig?.systemPrompt);
      const quoteHidden = Boolean(
        replyContext &&
        !evaluateSupplementalContextVisibility({
          mode: contextVisibilityMode,
          kind: "quote",
          senderAllowed: replySenderAllowed,
        }).include,
      );
      const ctxPayload = buildChannelInboundEventContext({
        channel: "matrix",
        finalize: core.channel.reply.finalizeInboundContext,
        contextVisibility: contextVisibilityMode,
        supplemental: {
          quote: replyContext
            ? {
                id: threadTarget ? void 0 : (replyToEventId ?? void 0),
                body: replyContext.replyToBody,
                sender: replyContext.replyToSender,
                senderAllowed: replySenderAllowed,
              }
            : void 0,
          thread: {
            starterBody: threadContext?.threadStarterBody,
            senderAllowed: threadContext ? true : void 0,
          },
          groupSystemPrompt: isRoom ? groupSystemPrompt : void 0,
        },
        media: toInboundMediaFacts(
          media
            ? [
                {
                  path: media.path,
                  url: media.path,
                  contentType: media.contentType,
                  transcribed: preflightAudioTranscript !== void 0,
                },
              ]
            : void 0,
        ),
        messageId,
        timestamp: eventTs ?? void 0,
        from: isDirectMessage ? `matrix:${senderId}` : `matrix:channel:${roomId}`,
        sender: {
          id: senderId,
          name: senderName,
          username: senderId.split(":")[0]?.replace(/^@/, ""),
        },
        conversation: {
          kind: isDirectMessage ? "direct" : "channel",
          id: roomId,
          label: envelopeFrom,
          nativeChannelId: roomId,
          threadId: threadTarget,
        },
        route: {
          agentId: _route.agentId,
          accountId: _route.accountId,
          routeSessionKey: _route.sessionKey,
        },
        reply: {
          to: `room:${roomId}`,
          replyToId: threadTarget ? void 0 : (replyToEventId ?? void 0),
          messageThreadId: threadTarget,
          nativeChannelId: roomId,
        },
        message: {
          body,
          rawBody: bodyText,
          commandBody: commandBodyText,
          bodyForAgent: bodyText,
          inboundHistory: inboundHistory && inboundHistory.length > 0 ? inboundHistory : void 0,
        },
        access: {
          ...(isRoom
            ? {
                mentions: {
                  canDetectMention: true,
                  wasMentioned,
                  requireMention: shouldRequireMention,
                },
              }
            : {}),
          commands: { authorized: commandAuthorized },
        },
        extra: {
          GroupSubject: isRoom ? (roomName ?? roomId) : void 0,
          GroupId: isRoom ? roomId : void 0,
          GroupChannel: isRoom ? roomId : void 0,
          ...locationPayload?.context,
          CommandSource: "text",
          NativeDirectUserId: isDirectMessage ? senderId : void 0,
        },
      });
      if (quoteHidden)
        logVerboseMessage(`matrix: drop reply context (mode=${contextVisibilityMode})`);
      const preview = truncateUtf16Safe(bodyText, 200).replace(/\n/g, "\\n");
      logVerboseMessage(`matrix inbound: room=${roomId} from=${senderId} preview="${preview}"`);
      const replyTarget = ctxPayload.To;
      if (!replyTarget) {
        runtime.error?.("matrix: missing reply target");
        return;
      }
      const { ackReaction, ackReactionScope: ackScope } = resolveMatrixAckReactionConfig({
        cfg,
        agentId: _route.agentId,
        accountId,
      });
      const shouldAckReaction = () =>
        Boolean(
          ackReaction &&
          core.channel.reactions.shouldAckReaction({
            scope: ackScope,
            isDirect: isDirectMessage,
            isGroup: isRoom,
            isMentionableGroup: isRoom,
            requireMention: shouldRequireMention,
            canDetectMention,
            effectiveWasMentioned: wasMentioned || shouldBypassMention,
            shouldBypassMention,
          }),
        );
      if (shouldAckReaction() && messageId)
        loadMatrixSendModule()
          .then(({ reactMatrixMessage }) =>
            reactMatrixMessage(roomId, messageId, ackReaction, client),
          )
          .catch((err) => {
            logVerboseMessage(`matrix react failed for room ${roomId}: ${String(err)}`);
          });
      if (messageId)
        loadMatrixSendModule()
          .then(({ sendReadReceiptMatrix }) => sendReadReceiptMatrix(roomId, messageId, client))
          .catch((err) => {
            logVerboseMessage(
              `matrix: read receipt failed room=${roomId} id=${messageId}: ${String(err)}`,
            );
          });
      const tableMode = core.channel.text.resolveMarkdownTableMode({
        cfg,
        channel: "matrix",
        accountId: _route.accountId,
      });
      const mediaLocalRoots = getAgentScopedMediaLocalRoots(cfg, _route.agentId);
      let finalReplyDeliveryFailed = false;
      let nonFinalReplyDeliveryFailed = false;
      let retryableReplyDeliveryFailed = false;
      const { onModelSelected, ...prefixOptions } = createReplyPrefixOptions({
        cfg,
        agentId: _route.agentId,
        channel: "matrix",
        accountId: _route.accountId,
      });
      const typingCallbacks = createTypingCallbacks({
        start: async () => {
          const { sendTypingMatrix } = await loadMatrixSendModule();
          await sendTypingMatrix(roomId, true, void 0, client);
        },
        stop: async () => {
          const { sendTypingMatrix } = await loadMatrixSendModule();
          await sendTypingMatrix(roomId, false, void 0, client);
        },
        onStartError: (err) => {
          logTypingFailure({
            log: logVerboseMessage,
            channel: "matrix",
            action: "start",
            target: roomId,
            error: err,
          });
        },
        onStopError: (err) => {
          logTypingFailure({
            log: logVerboseMessage,
            channel: "matrix",
            action: "stop",
            target: roomId,
            error: err,
          });
        },
      });
      const draftStreamingEnabled = streaming !== "off";
      const quietDraftStreaming = streaming === "quiet" || streaming === "progress";
      const progressDraftStreaming = streaming === "progress";
      const draftReplyToId = replyToMode !== "off" && !threadTarget ? messageId : void 0;
      const draftStream = draftStreamingEnabled
        ? await loadMatrixDraftStream().then(({ createMatrixDraftStream }) =>
            createMatrixDraftStream({
              roomId,
              client,
              cfg,
              mode: quietDraftStreaming ? "quiet" : "partial",
              threadId: threadTarget,
              replyToId: draftReplyToId,
              preserveReplyId: replyToMode === "all",
              accountId: _route.accountId,
              log: logVerboseMessage,
            }),
          )
        : void 0;
      draftStreamRef = draftStream;
      const shouldStreamPreviewToolProgress = Boolean(draftStream) && previewToolProgressEnabled;
      const shouldSuppressDefaultToolProgressMessages =
        Boolean(draftStream) &&
        (shouldStreamPreviewToolProgress || params.streaming === "progress");
      let currentDraftMessageGeneration = 0;
      let currentDraftBlockOffset = 0;
      let latestDraftFullText = "";
      const pendingDraftBoundaries = [];
      const latestQueuedDraftBoundaryOffsets = /* @__PURE__ */ new Map();
      let currentDraftReplyToId = draftReplyToId;
      let previewToolProgressSuppressed = false;
      let previewToolProgressLines = [];
      const progressConfigEntry = params.accountConfig ?? cfg.channels?.matrix;
      const progressSeed = `${_route.accountId}:${roomId}`;
      const renderProgressDraft = () => {
        if (!draftStream || !progressDraftStreaming) return;
        const previewText = formatChannelProgressDraftText({
          entry: progressConfigEntry,
          lines: previewToolProgressLines,
          seed: progressSeed,
          formatLine: formatMatrixToolProgressMarkdownCode,
          bullet: "-",
        });
        if (!previewText) return;
        draftStream.update(previewText);
      };
      const progressDraftGate = createChannelProgressDraftGate({ onStart: renderProgressDraft });
      const pushPreviewToolProgress = async (line, options) => {
        if (!draftStream) return;
        if (options?.toolName !== void 0 && !isChannelProgressDraftWorkToolName(options.toolName))
          return;
        const normalized = normalizeChannelProgressDraftLineIdentity(line);
        const progressLine = typeof line === "object" && line !== void 0 ? line : normalized;
        if (!progressDraftStreaming) {
          if (!shouldStreamPreviewToolProgress || previewToolProgressSuppressed || !normalized)
            return;
          const nextLines = mergeChannelProgressDraftLine(previewToolProgressLines, progressLine, {
            maxLines: resolveChannelProgressDraftMaxLines(progressConfigEntry),
          });
          if (nextLines === previewToolProgressLines) return;
          previewToolProgressLines = nextLines;
          draftStream.update(
            formatChannelProgressDraftText({
              entry: progressConfigEntry,
              lines: previewToolProgressLines,
              seed: progressSeed,
              formatLine: formatMatrixToolProgressMarkdownCode,
              bullet: "-",
            }),
          );
          return;
        }
        if (shouldStreamPreviewToolProgress && !previewToolProgressSuppressed && normalized)
          previewToolProgressLines = mergeChannelProgressDraftLine(
            previewToolProgressLines,
            progressLine,
            { maxLines: resolveChannelProgressDraftMaxLines(progressConfigEntry) },
          );
        const alreadyStarted = progressDraftGate.hasStarted;
        const progressActive = await progressDraftGate.noteWork();
        if ((alreadyStarted || progressActive) && progressDraftGate.hasStarted)
          renderProgressDraft();
      };
      const suppressPreviewToolProgressForAnswerText = (text) => {
        if (!text?.trim()) return;
        previewToolProgressSuppressed = true;
        previewToolProgressLines = [];
      };
      const resetPreviewToolProgress = () => {
        previewToolProgressSuppressed = false;
        previewToolProgressLines = [];
      };
      const buildPreviewToolProgressReplyOptions = () => {
        if (!shouldSuppressDefaultToolProgressMessages) return {};
        const options = { suppressDefaultToolProgressMessages: true };
        if (!shouldStreamPreviewToolProgress) return options;
        return {
          ...options,
          onToolStart: async (payload) => {
            const toolName = payload.name?.trim();
            await pushPreviewToolProgress(
              buildChannelProgressDraftLineForEntry(
                progressConfigEntry,
                {
                  event: "tool",
                  itemId: payload.itemId,
                  toolCallId: payload.toolCallId,
                  name: toolName,
                  phase: payload.phase,
                  args: payload.args,
                },
                payload.detailMode ? { detailMode: payload.detailMode } : void 0,
              ),
              { toolName },
            );
          },
          onItemEvent: async (payload) => {
            await pushPreviewToolProgress(
              buildChannelProgressDraftLineForEntry(progressConfigEntry, {
                event: "item",
                itemId: payload.itemId,
                toolCallId: payload.toolCallId,
                itemKind: payload.kind,
                title: payload.title,
                name: payload.name,
                phase: payload.phase,
                status: payload.status,
                summary: payload.summary,
                progressText: payload.progressText,
                meta: payload.meta,
              }),
            );
          },
          onPlanUpdate: async (payload) => {
            if (payload.phase !== "update") return;
            await pushPreviewToolProgress(
              formatChannelProgressDraftLine({
                event: "plan",
                phase: payload.phase,
                title: payload.title,
                explanation: payload.explanation,
                steps: payload.steps,
              }),
            );
          },
          onApprovalEvent: async (payload) => {
            if (payload.phase !== "requested") return;
            await pushPreviewToolProgress(
              formatChannelProgressDraftLine({
                event: "approval",
                phase: payload.phase,
                title: payload.title,
                command: payload.command,
                reason: payload.reason,
                message: payload.message,
              }),
            );
          },
          onCommandOutput: async (payload) => {
            if (payload.phase !== "end") return;
            await pushPreviewToolProgress(
              buildChannelProgressDraftLineForEntry(progressConfigEntry, {
                event: "command-output",
                itemId: payload.itemId,
                toolCallId: payload.toolCallId,
                phase: payload.phase,
                title: payload.title,
                name: payload.name,
                status: payload.status,
                exitCode: payload.exitCode,
              }),
            );
          },
          onPatchSummary: async (payload) => {
            if (payload.phase !== "end") return;
            await pushPreviewToolProgress(
              buildChannelProgressDraftLineForEntry(progressConfigEntry, {
                event: "patch",
                itemId: payload.itemId,
                toolCallId: payload.toolCallId,
                phase: payload.phase,
                title: payload.title,
                name: payload.name,
                added: payload.added,
                modified: payload.modified,
                deleted: payload.deleted,
                summary: payload.summary,
              }),
            );
          },
        };
      };
      const getDisplayableDraftText = () => {
        const nextDraftBoundaryOffset = pendingDraftBoundaries.find(
          (boundary) => boundary.messageGeneration === currentDraftMessageGeneration,
        )?.endOffset;
        if (nextDraftBoundaryOffset === void 0)
          return latestDraftFullText.slice(currentDraftBlockOffset);
        return latestDraftFullText.slice(currentDraftBlockOffset, nextDraftBoundaryOffset);
      };
      const updateDraftFromLatestFullText = () => {
        const blockText = getDisplayableDraftText();
        if (blockText) draftStream?.update(blockText);
      };
      const queueDraftBlockBoundary = (payload, context) => {
        const payloadTextLength = payload.text?.length ?? 0;
        const messageGeneration = context?.assistantMessageIndex ?? currentDraftMessageGeneration;
        const nextDraftBoundaryOffset =
          (latestQueuedDraftBoundaryOffsets.get(messageGeneration) ?? 0) + payloadTextLength;
        latestQueuedDraftBoundaryOffsets.set(messageGeneration, nextDraftBoundaryOffset);
        pendingDraftBoundaries.push({
          messageGeneration,
          endOffset: nextDraftBoundaryOffset,
        });
      };
      const advanceDraftBlockBoundary = (options) => {
        const completedBoundary = pendingDraftBoundaries.shift();
        if (completedBoundary) {
          if (
            !pendingDraftBoundaries.some(
              (entry) => entry.messageGeneration === completedBoundary.messageGeneration,
            )
          )
            latestQueuedDraftBoundaryOffsets.delete(completedBoundary.messageGeneration);
          if (completedBoundary.messageGeneration === currentDraftMessageGeneration)
            currentDraftBlockOffset = completedBoundary.endOffset;
          return;
        }
        if (options?.fallbackToLatestEnd) currentDraftBlockOffset = latestDraftFullText.length;
      };
      const resetDraftBlockOffsets = () => {
        currentDraftMessageGeneration += 1;
        currentDraftBlockOffset = 0;
        latestDraftFullText = "";
      };
      const { dispatcher, replyOptions, markDispatchIdle, markRunComplete } =
        core.channel.reply.createReplyDispatcherWithTyping({
          ...prefixOptions,
          humanDelay: core.channel.reply.resolveHumanDelayConfig(cfg, _route.agentId),
          deliver: async (payload, info) => {
            if (draftStream && info.kind !== "tool" && !payload.isCompactionNotice) {
              const hasMedia = Boolean(payload.mediaUrl) || (payload.mediaUrls?.length ?? 0) > 0;
              const ttsSupplement = getReplyPayloadTtsSupplement(payload);
              const fallbackPayload =
                ttsSupplement &&
                ttsSupplement.visibleTextAlreadyDelivered !== true &&
                !payload.text?.trim()
                  ? {
                      ...payload,
                      text: ttsSupplement.spokenText,
                    }
                  : payload;
              if (draftConsumed) {
                await draftStream.discardPending();
                await deliverMatrixReplies({
                  cfg,
                  replies: [fallbackPayload],
                  roomId,
                  client,
                  runtime,
                  textLimit,
                  replyToMode,
                  threadId: threadTarget,
                  replyToId: threadTarget ?? replyToEventId ?? void 0,
                  accountId: _route.accountId,
                  mediaLocalRoots,
                  tableMode,
                });
                return;
              }
              const payloadReplyToId = normalizeOptionalString(payload.replyToId);
              const payloadReplyMismatch =
                replyToMode !== "off" &&
                !threadTarget &&
                payloadReplyToId !== currentDraftReplyToId;
              let mustDeliverFinalNormally = draftStream.mustDeliverFinalNormally();
              if (
                Boolean(payload.text?.trim()) &&
                !payload.isError &&
                !payloadReplyMismatch &&
                !mustDeliverFinalNormally
              ) {
                await draftStream.stop();
                mustDeliverFinalNormally = draftStream.mustDeliverFinalNormally();
              } else await draftStream.discardPending();
              const draftEventId = draftStream.eventId();
              const draftFinalTextNeedsNormalMentionDelivery =
                Boolean(draftEventId) &&
                typeof payload.text === "string" &&
                Boolean(payload.text.trim()) &&
                !payload.isError &&
                !payloadReplyMismatch &&
                !mustDeliverFinalNormally &&
                (await matrixTextWouldActivateMentions(client, payload.text));
              if (
                draftEventId &&
                payload.text &&
                !payload.isError &&
                !hasMedia &&
                !payloadReplyMismatch &&
                !mustDeliverFinalNormally &&
                !draftFinalTextNeedsNormalMentionDelivery
              ) {
                const finalPreviewText = payload.text;
                await deliverWithFinalizableLivePreviewAdapter({
                  kind: "final",
                  payload,
                  adapter: defineFinalizableLivePreviewAdapter({
                    draft: {
                      flush: async () => {},
                      clear: async () => {},
                      discardPending: async () => {},
                      id: () => draftEventId,
                    },
                    buildFinalEdit: () => ({
                      text: finalPreviewText,
                      finalizeLive: !(
                        quietDraftStreaming || !draftStream.matchesPreparedText(finalPreviewText)
                      ),
                      ...(quietDraftStreaming
                        ? { extraContent: buildMatrixFinalizedPreviewContent() }
                        : {}),
                    }),
                    editFinal: async (_draftEventId, edit) => {
                      if (edit.finalizeLive) {
                        if (!(await draftStream.finalizeLive()))
                          throw new Error("Matrix draft live finalize failed");
                        return;
                      }
                      const { editMessageMatrix } = await loadMatrixSendModule();
                      await editMessageMatrix(roomId, _draftEventId, edit.text, {
                        client,
                        cfg,
                        threadId: threadTarget,
                        accountId: _route.accountId,
                        extraContent: edit.extraContent,
                      });
                    },
                    createPreviewReceipt: (id) =>
                      createPreviewMessageReceipt({
                        id,
                        ...(threadTarget ? { threadId: threadTarget } : {}),
                        ...(currentDraftReplyToId ? { replyToId: currentDraftReplyToId } : {}),
                      }),
                    logPreviewEditFailure: (err) => {
                      logVerboseMessage(`matrix: preview final edit failed: ${String(err)}`);
                    },
                  }),
                  deliverNormally: async () => {
                    await redactMatrixDraftEvent(client, roomId, draftEventId);
                    await deliverMatrixReplies({
                      cfg,
                      replies: [fallbackPayload],
                      roomId,
                      client,
                      runtime,
                      textLimit,
                      replyToMode,
                      threadId: threadTarget,
                      replyToId: threadTarget ?? replyToEventId ?? void 0,
                      accountId: _route.accountId,
                      mediaLocalRoots,
                      tableMode,
                    });
                  },
                });
                draftConsumed = true;
              } else if (draftEventId && hasMedia && !payloadReplyMismatch) {
                let textEditOk = !mustDeliverFinalNormally;
                const payloadText = payload.text ?? ttsSupplement?.spokenText;
                const payloadTextMatchesDraft =
                  typeof payloadText === "string" && draftStream.matchesPreparedText(payloadText);
                const reusesDraftTextUnchanged =
                  typeof payloadText === "string" &&
                  Boolean(payloadText.trim()) &&
                  payloadTextMatchesDraft;
                const mediaTextNeedsNormalMentionDelivery =
                  typeof payloadText === "string" &&
                  Boolean(payloadText.trim()) &&
                  (await matrixTextWouldActivateMentions(client, payloadText));
                const requiresFinalTextEdit =
                  quietDraftStreaming ||
                  (typeof payloadText === "string" && !payloadTextMatchesDraft);
                if (textEditOk && mediaTextNeedsNormalMentionDelivery) textEditOk = false;
                else if (textEditOk && payloadText && requiresFinalTextEdit) {
                  const { editMessageMatrix } = await loadMatrixSendModule();
                  textEditOk = await editMessageMatrix(roomId, draftEventId, payloadText, {
                    client,
                    cfg,
                    threadId: threadTarget,
                    accountId: _route.accountId,
                    extraContent: quietDraftStreaming
                      ? buildMatrixFinalizedPreviewContent()
                      : void 0,
                  }).then(
                    () => true,
                    () => false,
                  );
                } else if (textEditOk && reusesDraftTextUnchanged)
                  textEditOk = await draftStream.finalizeLive();
                const reusesDraftAsFinalText = Boolean(payloadText?.trim()) && textEditOk;
                if (!reusesDraftAsFinalText)
                  await redactMatrixDraftEvent(client, roomId, draftEventId);
                const mediaPayload =
                  ttsSupplement && reusesDraftAsFinalText
                    ? buildTtsSupplementMediaPayload(payload)
                    : {
                        ...payload,
                        text: reusesDraftAsFinalText
                          ? void 0
                          : (payload.text ??
                            (ttsSupplement?.visibleTextAlreadyDelivered === true
                              ? void 0
                              : ttsSupplement?.spokenText)),
                      };
                await deliverMatrixReplies({
                  cfg,
                  replies: [mediaPayload],
                  roomId,
                  client,
                  runtime,
                  textLimit,
                  replyToMode,
                  threadId: threadTarget,
                  replyToId: threadTarget ?? replyToEventId ?? void 0,
                  accountId: _route.accountId,
                  mediaLocalRoots,
                  tableMode,
                });
                draftConsumed = true;
              } else {
                const draftRedacted =
                  Boolean(draftEventId) &&
                  (payload.isError ||
                    payloadReplyMismatch ||
                    mustDeliverFinalNormally ||
                    draftFinalTextNeedsNormalMentionDelivery);
                if (draftRedacted && draftEventId)
                  await redactMatrixDraftEvent(client, roomId, draftEventId);
                const deliveredFallback = await deliverMatrixReplies({
                  cfg,
                  replies: [fallbackPayload],
                  roomId,
                  client,
                  runtime,
                  textLimit,
                  replyToMode,
                  threadId: threadTarget,
                  replyToId: threadTarget ?? replyToEventId ?? void 0,
                  accountId: _route.accountId,
                  mediaLocalRoots,
                  tableMode,
                });
                if (draftRedacted || deliveredFallback) draftConsumed = true;
              }
              if (info.kind === "block") {
                draftConsumed = false;
                advanceDraftBlockBoundary({ fallbackToLatestEnd: true });
                draftStream.reset();
                currentDraftReplyToId = replyToMode === "all" ? draftReplyToId : void 0;
                updateDraftFromLatestFullText();
                const { sendTypingMatrix } = await loadMatrixSendModule();
                await sendTypingMatrix(roomId, true, void 0, client).catch(() => {});
              }
            } else
              await deliverMatrixReplies({
                cfg,
                replies: [payload],
                roomId,
                client,
                runtime,
                textLimit,
                replyToMode,
                threadId: threadTarget,
                replyToId: threadTarget ?? replyToEventId ?? void 0,
                accountId: _route.accountId,
                mediaLocalRoots,
                tableMode,
              });
          },
          onError: (err, info) => {
            if (err instanceof MatrixRetryableInboundError) retryableReplyDeliveryFailed = true;
            if (info.kind === "final") finalReplyDeliveryFailed = true;
            else nonFinalReplyDeliveryFailed = true;
            if (info.kind === "block") advanceDraftBlockBoundary({ fallbackToLatestEnd: true });
            runtime.error?.(`matrix ${info.kind} reply failed: ${String(err)}`);
          },
          onReplyStart: typingCallbacks.onReplyStart,
          onIdle: typingCallbacks.onIdle,
        });
      const pinnedMainDmOwner = isDirectMessage
        ? await (async () => {
            const livePinnedCfg = core.config.current();
            const livePinnedAllowlists = resolveMatrixAccountAllowlistConfig({
              cfg: livePinnedCfg,
              accountId,
            });
            const livePinnedDmAllowFrom = await resolveCachedLiveAllowlist({
              cfg: livePinnedCfg,
              entries: livePinnedAllowlists.dmAllowFrom,
              startupResolvedEntries: allowFromResolvedEntries,
              cache: liveDmAllowlistCache,
              updateCache: (next) => {
                liveDmAllowlistCache = next;
              },
            });
            return resolvePinnedMainDmOwnerFromAllowlist({
              dmScope: livePinnedCfg.session?.dmScope,
              allowFrom: livePinnedDmAllowFrom,
              normalizeEntry: normalizeMatrixUserId,
            });
          })()
        : null;
      const inboundLastRouteSessionKey = resolveInboundLastRouteSessionKey({
        route: _route,
        sessionKey: _route.sessionKey,
      });
      const turnResult = await core.channel.inbound.run({
        channel: "matrix",
        accountId: _route.accountId,
        raw: event,
        adapter: {
          ingest: () => ({
            id: messageId,
            rawText: bodyText,
            textForAgent: ctxPayload.BodyForAgent,
            textForCommands: ctxPayload.CommandBody,
            raw: event,
          }),
          resolveTurn: () => ({
            channel: "matrix",
            accountId: _route.accountId,
            routeSessionKey: _route.sessionKey,
            storePath,
            ctxPayload,
            recordInboundSession: core.channel.session.recordInboundSession,
            botLoopProtection,
            record: {
              updateLastRoute: isDirectMessage
                ? {
                    sessionKey: inboundLastRouteSessionKey,
                    channel: "matrix",
                    to: `room:${roomId}`,
                    accountId: _route.accountId,
                    mainDmOwnerPin:
                      inboundLastRouteSessionKey === _route.mainSessionKey && pinnedMainDmOwner
                        ? {
                            ownerRecipient: pinnedMainDmOwner,
                            senderRecipient: normalizeMatrixUserId(senderId),
                            onSkip: ({ ownerRecipient, senderRecipient }) => {
                              logVerboseMessage(
                                `matrix: skip main-session last route for ${senderRecipient} (pinned owner ${ownerRecipient})`,
                              );
                            },
                          }
                        : void 0,
                  }
                : void 0,
              onRecordError: (err) => {
                logger.warn("failed updating session meta", {
                  error: String(err),
                  storePath,
                  sessionKey: ctxPayload.SessionKey ?? _route.sessionKey,
                });
              },
            },
            onPreDispatchFailure: () =>
              core.channel.reply.settleReplyDispatcher({
                dispatcher,
                onSettled: () => {
                  markRunComplete();
                  markDispatchIdle();
                },
              }),
            runDispatch: async () => {
              if (
                sharedDmContextNotice &&
                markTrackedRoomIfFirst(sharedDmContextNoticeRooms, roomId)
              )
                try {
                  await client.sendMessage(roomId, {
                    msgtype: "m.notice",
                    body: sharedDmContextNotice,
                  });
                } catch (err) {
                  logVerboseMessage(
                    `matrix: failed sending shared DM session notice room=${roomId}: ${String(err)}`,
                  );
                }
              return await core.channel.reply.withReplyDispatcher({
                dispatcher,
                onSettled: () => {
                  markDispatchIdle();
                },
                run: async () => {
                  try {
                    return await core.channel.reply.dispatchReplyFromConfig({
                      ctx: ctxPayload,
                      cfg,
                      dispatcher,
                      replyOptions: {
                        ...replyOptions,
                        skillFilter: roomConfig?.skills,
                        disableBlockStreaming: !blockStreamingEnabled,
                        onPartialReply: draftStream
                          ? (payload) => {
                              if (progressDraftStreaming) return;
                              latestDraftFullText = payload.text ?? "";
                              suppressPreviewToolProgressForAnswerText(latestDraftFullText);
                              updateDraftFromLatestFullText();
                            }
                          : void 0,
                        onBlockReplyQueued: draftStream
                          ? (payload, context) => {
                              if (payload.isCompactionNotice === true) return;
                              queueDraftBlockBoundary(payload, context);
                            }
                          : void 0,
                        onAssistantMessageStart: draftStream
                          ? () => {
                              resetDraftBlockOffsets();
                              resetPreviewToolProgress();
                            }
                          : void 0,
                        ...buildPreviewToolProgressReplyOptions(),
                        onModelSelected,
                      },
                    });
                  } finally {
                    progressDraftGate.cancel();
                    markRunComplete();
                  }
                },
              });
            },
          }),
        },
      });
      if (!turnResult.dispatched) {
        if (
          turnResult.admission.kind === "drop" &&
          turnResult.admission.reason === "bot-loop-protection"
        )
          await commitInboundEventIfClaimed();
        return;
      }
      const { dispatchResult } = turnResult;
      const { queuedFinal, counts } = dispatchResult;
      if (finalReplyDeliveryFailed) {
        if (retryableReplyDeliveryFailed) {
          logVerboseMessage(
            `matrix: final reply delivery failed room=${roomId} id=${messageId}; leaving event uncommitted`,
          );
          return;
        }
        logVerboseMessage(
          `matrix: final reply delivery failed room=${roomId} id=${messageId}; keeping replay committed`,
        );
        await commitInboundEventIfClaimed();
        return;
      }
      if (!queuedFinal && nonFinalReplyDeliveryFailed) {
        if (retryableReplyDeliveryFailed) {
          logVerboseMessage(
            `matrix: non-final reply delivery failed room=${roomId} id=${messageId}; leaving event uncommitted`,
          );
          return;
        }
        logVerboseMessage(
          `matrix: non-final reply delivery failed room=${roomId} id=${messageId}; keeping replay committed`,
        );
        await commitInboundEventIfClaimed();
        return;
      }
      if (isRoom && triggerSnapshot)
        roomHistoryTracker.consumeHistory(
          _route.agentId,
          roomId,
          triggerSnapshot,
          messageId,
          threadRootId ? thread.threadId : void 0,
        );
      if (
        !hasFinalChannelTurnDispatch({
          queuedFinal,
          counts,
        })
      ) {
        await commitInboundEventIfClaimed();
        return;
      }
      const finalCount = counts.final;
      logVerboseMessage(
        `matrix: delivered ${finalCount} reply${finalCount === 1 ? "" : "ies"} to ${replyTarget}`,
      );
      await commitInboundEventIfClaimed();
    } catch (err) {
      runtime.error?.(`matrix handler failed: ${String(err)}`);
    } finally {
      if (draftStreamRef) {
        const draftEventId = await draftStreamRef.stop().catch(() => void 0);
        if (draftEventId && !draftConsumed)
          await redactMatrixDraftEvent(client, roomId, draftEventId);
      }
      if (claimedInboundEvent && inboundDeduper && eventId)
        inboundDeduper.releaseEvent({
          roomId,
          eventId,
        });
    }
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/recent-invite.ts
function shouldPromoteRecentInviteRoom(params) {
  if (!params.roomInfo.nameResolved || !params.roomInfo.aliasesResolved) return false;
  const roomAliases = [params.roomInfo.canonicalAlias ?? "", ...params.roomInfo.altAliases].filter(
    Boolean,
  );
  if ((params.roomInfo.name?.trim() ?? "") || roomAliases.length > 0) return false;
  return (
    resolveMatrixRoomConfig({
      rooms: params.rooms,
      roomId: params.roomId,
      aliases: roomAliases,
    }).matchSource === void 0
  );
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/startup.ts
const loadMatrixStartupMaintenanceDeps = createLazyRuntimeModule(() =>
  Promise.all([
    import("./config-update-yXaEd-d4.js"),
    import("./device-health-CA7cIiLv.js"),
    import("./profile-CmmJwzYt.js"),
    import("./startup-verification-DdjM-y4C.js"),
  ]).then(([configUpdateModule, deviceHealthModule, profileModule, startupVerificationModule]) => ({
    updateMatrixAccountConfig: configUpdateModule.updateMatrixAccountConfig,
    summarizeMatrixDeviceHealth: deviceHealthModule.summarizeMatrixDeviceHealth,
    syncMatrixOwnProfile: profileModule.syncMatrixOwnProfile,
    ensureMatrixStartupVerification: startupVerificationModule.ensureMatrixStartupVerification,
  })),
);
async function runMatrixStartupMaintenance(params, deps) {
  const runtimeDeps = deps ?? (await loadMatrixStartupMaintenanceDeps());
  throwIfMatrixStartupAborted(params.abortSignal);
  try {
    const profileSync = await runtimeDeps.syncMatrixOwnProfile({
      client: params.client,
      userId: params.auth.userId,
      displayName: params.accountConfig.name,
      avatarUrl: params.accountConfig.avatarUrl,
      loadAvatarFromUrl: async (url, maxBytes) => await params.loadWebMedia(url, maxBytes),
    });
    throwIfMatrixStartupAborted(params.abortSignal);
    if (profileSync.displayNameUpdated)
      params.logger.info(`matrix: profile display name updated for ${params.auth.userId}`);
    if (profileSync.avatarUpdated)
      params.logger.info(`matrix: profile avatar updated for ${params.auth.userId}`);
    if (
      profileSync.convertedAvatarFromHttp &&
      profileSync.resolvedAvatarUrl &&
      params.accountConfig.avatarUrl !== profileSync.resolvedAvatarUrl
    ) {
      const latestCfg = params.getRuntimeConfig();
      const updatedCfg = runtimeDeps.updateMatrixAccountConfig(latestCfg, params.accountId, {
        avatarUrl: profileSync.resolvedAvatarUrl,
      });
      await params.replaceConfigFile(updatedCfg);
      throwIfMatrixStartupAborted(params.abortSignal);
      params.logVerboseMessage(
        `matrix: persisted converted avatar URL for account ${params.accountId} (${profileSync.resolvedAvatarUrl})`,
      );
    }
  } catch (err) {
    if (isMatrixStartupAbortError(err)) throw err;
    params.logger.warn("matrix: failed to sync profile from config", { error: String(err) });
  }
  if (!(params.auth.encryption && params.client.crypto)) return;
  try {
    throwIfMatrixStartupAborted(params.abortSignal);
    const deviceHealth = runtimeDeps.summarizeMatrixDeviceHealth(
      await params.client.listOwnDevices(),
    );
    if (deviceHealth.staleOpenClawDevices.length > 0)
      params.logger.warn(
        `matrix: stale OpenClaw devices detected for ${params.auth.userId}: ${deviceHealth.staleOpenClawDevices.map((device) => device.deviceId).join(", ")}. Run 'openclaw matrix devices prune-stale --account ${params.effectiveAccountId}' to keep encrypted-room trust healthy.`,
      );
  } catch (err) {
    if (isMatrixStartupAbortError(err)) throw err;
    params.logger.debug?.("Failed to inspect matrix device hygiene (non-fatal)", {
      error: String(err),
    });
  }
  try {
    throwIfMatrixStartupAborted(params.abortSignal);
    const startupVerification = await runtimeDeps.ensureMatrixStartupVerification({
      client: params.client,
      auth: params.auth,
      accountConfig: params.accountConfig,
      env: params.env,
    });
    throwIfMatrixStartupAborted(params.abortSignal);
    if (startupVerification.kind === "verified")
      params.logger.info("matrix: device is verified by its owner and ready for encrypted rooms");
    else if (
      startupVerification.kind === "disabled" ||
      startupVerification.kind === "cooldown" ||
      startupVerification.kind === "pending" ||
      startupVerification.kind === "request-failed"
    ) {
      params.logger.info(
        "matrix: device not verified — run 'openclaw matrix verify device <key>' to enable E2EE",
      );
      if (startupVerification.kind === "pending")
        params.logger.info(
          "matrix: startup verification request is already pending; finish it in another Matrix client",
        );
      else if (startupVerification.kind === "cooldown")
        params.logVerboseMessage(
          `matrix: skipped startup verification request due to cooldown (retryAfterMs=${startupVerification.retryAfterMs ?? 0})`,
        );
      else if (startupVerification.kind === "request-failed")
        params.logger.debug?.("Matrix startup verification request failed (non-fatal)", {
          error: startupVerification.error ?? "unknown",
        });
    } else if (startupVerification.kind === "requested")
      params.logger.info(
        "matrix: device not verified — requested verification in another Matrix client",
      );
  } catch (err) {
    if (isMatrixStartupAbortError(err)) throw err;
    params.logger.debug?.("Failed to resolve matrix verification status (non-fatal)", {
      error: String(err),
    });
  }
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/status.ts
function cloneLastDisconnect(value) {
  if (!value || typeof value === "string") return value ?? null;
  return { ...value };
}
function formatSyncError(error) {
  if (!error) return null;
  if (error instanceof Error) return error.message || error.name || "unknown";
  return formatMatrixErrorMessage(error);
}
function createMatrixMonitorStatusController(params) {
  const status = {
    accountId: params.accountId,
    ...(params.baseUrl ? { baseUrl: params.baseUrl } : {}),
    connected: false,
    lastConnectedAt: null,
    lastDisconnect: null,
    lastError: null,
    healthState: "starting",
  };
  const emit = () => {
    params.statusSink?.({
      ...status,
      lastDisconnect: cloneLastDisconnect(status.lastDisconnect),
    });
  };
  const noteConnected = (at = Date.now(), options) => {
    if (status.connected === true) status.lastEventAt = at;
    else Object.assign(status, createConnectedChannelStatusPatch(at));
    if (options?.transportActivity) Object.assign(status, createTransportActivityStatusPatch(at));
    status.lastError = null;
    status.lastDisconnect = null;
    status.healthState = "healthy";
    emit();
  };
  const noteDisconnected = (paramsLocal) => {
    const at = paramsLocal.at ?? Date.now();
    const error = formatSyncError(paramsLocal.error);
    status.connected = false;
    status.lastEventAt = at;
    status.lastDisconnect = {
      at,
      ...(error ? { error } : {}),
    };
    status.lastError = error;
    status.healthState = paramsLocal.state.toLowerCase();
    emit();
  };
  emit();
  return {
    noteSyncState(state, error, at = Date.now()) {
      if (isMatrixReadySyncState(state)) {
        noteConnected(at, { transportActivity: state === "SYNCING" });
        return;
      }
      if (isMatrixDisconnectedSyncState(state)) {
        noteDisconnected({
          state,
          at,
          error,
        });
        return;
      }
      status.lastEventAt = at;
      status.healthState = state.toLowerCase();
      emit();
    },
    noteUnexpectedError(error, at = Date.now()) {
      noteDisconnected({
        state: "ERROR",
        at,
        error,
      });
    },
    markStopped(at = Date.now()) {
      status.connected = false;
      status.lastEventAt = at;
      if (status.healthState !== "error") status.healthState = "stopped";
      emit();
    },
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/sync-lifecycle.ts
function formatSyncLifecycleError(state, error) {
  if (error instanceof Error) return error;
  const message = typeof error === "string" && error.trim() ? error.trim() : void 0;
  if (state === "STOPPED") return new Error(message ?? "Matrix sync stopped unexpectedly");
  if (state === "ERROR") return new Error(message ?? "Matrix sync entered ERROR unexpectedly");
  return new Error(message ?? `Matrix sync entered ${state} unexpectedly`);
}
function createMatrixMonitorSyncLifecycle(params) {
  let fatalError = null;
  let resolveFatalWait = null;
  let rejectFatalWait = null;
  const settleFatal = (error) => {
    if (fatalError) return;
    fatalError = error;
    rejectFatalWait?.(error);
    resolveFatalWait = null;
    rejectFatalWait = null;
  };
  const onSyncState = (state, _prevState, error) => {
    if (isMatrixTerminalSyncState(state) && !params.isStopping?.()) {
      const fatalErrorLocal = formatSyncLifecycleError(state, error);
      params.statusController.noteUnexpectedError(fatalErrorLocal);
      settleFatal(fatalErrorLocal);
      return;
    }
    if (fatalError) return;
    if (params.isStopping?.() && !isMatrixTerminalSyncState(state)) return;
    params.statusController.noteSyncState(state, error);
  };
  const onUnexpectedError = (error) => {
    if (params.isStopping?.()) return;
    params.statusController.noteUnexpectedError(error);
    settleFatal(error);
  };
  params.client.on("sync.state", onSyncState);
  params.client.on("sync.unexpected_error", onUnexpectedError);
  return {
    async waitForFatalStop() {
      if (fatalError) throw fatalError;
      if (resolveFatalWait || rejectFatalWait)
        throw new Error("Matrix fatal-stop wait already in progress");
      await new Promise((resolve, reject) => {
        resolveFatalWait = resolve;
        rejectFatalWait = (error) => reject(error);
      });
    },
    dispose() {
      resolveFatalWait?.();
      resolveFatalWait = null;
      rejectFatalWait = null;
      params.client.off("sync.state", onSyncState);
      params.client.off("sync.unexpected_error", onUnexpectedError);
    },
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/task-runner.ts
function createMatrixMonitorTaskRunner(params) {
  const inFlight = /* @__PURE__ */ new Set();
  const runDetachedTask = (label, task) => {
    const trackedTask = Promise.resolve()
      .then(task)
      .catch((error) => {
        const message = String(error);
        params.logVerboseMessage(`matrix: ${label} failed (${message})`);
        params.logger.warn("matrix background task failed", {
          task: label,
          error: message,
        });
      })
      .finally(() => {
        inFlight.delete(trackedTask);
      });
    inFlight.add(trackedTask);
    return trackedTask;
  };
  const waitForIdle = async () => {
    while (inFlight.size > 0) await Promise.allSettled(Array.from(inFlight));
  };
  return {
    runDetachedTask,
    waitForIdle,
  };
}
//#endregion
//#region extensions/matrix/src/matrix/monitor/index.ts
function isMatrixStreamingConfig(streaming) {
  return Boolean(streaming && typeof streaming === "object" && !Array.isArray(streaming));
}
function resolveMatrixStreamingMode(streaming) {
  if (streaming === true || streaming === "partial") return "partial";
  if (streaming === "quiet") return "quiet";
  if (streaming === "progress") return "progress";
  if (isMatrixStreamingConfig(streaming)) {
    if (streaming.mode === "partial" || streaming.mode === "quiet" || streaming.mode === "progress")
      return streaming.mode;
  }
  return "off";
}
function resolveMatrixPreviewToolProgress(streaming) {
  if (!isMatrixStreamingConfig(streaming)) return true;
  if (resolveMatrixStreamingMode(streaming) === "progress")
    return streaming.progress?.toolProgress ?? streaming.preview?.toolProgress ?? true;
  return streaming.preview?.toolProgress ?? true;
}
function resolveMatrixPreviewToolProgressEnabled(streaming) {
  return (
    resolveMatrixStreamingMode(streaming) !== "off" && resolveMatrixPreviewToolProgress(streaming)
  );
}
const DEFAULT_MEDIA_MAX_MB = 20;
async function monitorMatrixProvider(opts = {}) {
  if (opts.abortSignal?.aborted) return;
  if (isBunRuntime()) throw new Error("Matrix provider requires Node (bun runtime not supported)");
  const core = getMatrixRuntime();
  let cfg = core.config.current();
  if (cfg.channels?.["matrix"]?.enabled === false) return;
  const logger = core.logging.getChildLogger({ module: "matrix-auto-reply" });
  const formatRuntimeMessage = (...args) => format(...args);
  const runtime = opts.runtime ?? {
    log: (...args) => {
      logger.info(formatRuntimeMessage(...args));
    },
    error: (...args) => {
      logger.error(formatRuntimeMessage(...args));
    },
    exit: (code) => {
      throw new Error(`exit ${code}`);
    },
  };
  const logVerboseMessage = (message) => {
    if (!core.logging.shouldLogVerbose()) return;
    logger.debug?.(message);
  };
  const effectiveAccountId = resolveMatrixAuthContext({
    cfg,
    accountId: opts.accountId,
  }).accountId;
  const accountConfig = resolveMatrixAccountConfig({
    cfg,
    accountId: effectiveAccountId,
  });
  const allowlistOnly = accountConfig.allowlistOnly === true;
  const accountAllowBots = accountConfig.allowBots;
  let roomsConfig = accountConfig.groups ?? accountConfig.rooms;
  let needsRoomAliasesForConfig = false;
  const initialAllowFrom = (accountConfig.dm?.allowFrom ?? []).map(String);
  const initialGroupAllowFrom = (accountConfig.groupAllowFrom ?? []).map(String);
  const configuredBotUserIds = resolveConfiguredMatrixBotUserIds({
    cfg,
    accountId: effectiveAccountId,
  });
  const {
    allowFrom,
    allowFromResolvedEntries,
    groupAllowFrom,
    groupAllowFromResolvedEntries,
    roomsConfig: resolvedRoomsConfig,
  } = await resolveMatrixMonitorConfig({
    cfg,
    accountId: effectiveAccountId,
    allowFrom: initialAllowFrom,
    groupAllowFrom: initialGroupAllowFrom,
    roomsConfig,
    runtime,
  });
  roomsConfig = resolvedRoomsConfig;
  needsRoomAliasesForConfig = Boolean(
    roomsConfig && Object.keys(roomsConfig).some((key) => key.trim().startsWith("#")),
  );
  cfg = {
    ...cfg,
    channels: {
      ...cfg.channels,
      matrix: {
        ...cfg.channels?.["matrix"],
        dm: {
          ...cfg.channels?.["matrix"]?.dm,
          allowFrom,
        },
        groupAllowFrom,
        ...(roomsConfig ? { groups: roomsConfig } : {}),
      },
    },
  };
  const auth = await resolveMatrixAuth({
    cfg,
    accountId: effectiveAccountId,
  });
  const resolvedInitialSyncLimit =
    resolveOptionalIntegerOption(opts.initialSyncLimit, { min: 0 }) ?? auth.initialSyncLimit;
  const authWithLimit =
    resolvedInitialSyncLimit === auth.initialSyncLimit
      ? auth
      : {
          ...auth,
          initialSyncLimit: resolvedInitialSyncLimit,
        };
  const statusController = createMatrixMonitorStatusController({
    accountId: auth.accountId,
    baseUrl: auth.homeserver,
    statusSink: opts.setStatus,
  });
  let cleanedUp = false;
  let client = null;
  let threadBindingManager = null;
  const monitorTaskRunner = createMatrixMonitorTaskRunner({
    logger,
    logVerboseMessage,
  });
  let syncLifecycle = null;
  const cleanup = async (mode = "persist") => {
    if (cleanedUp) return;
    cleanedUp = true;
    try {
      client?.stopSyncWithoutPersist();
      if (client && mode === "persist")
        await client.drainPendingDecryptions("matrix monitor shutdown");
      if (mode === "persist") await monitorTaskRunner.waitForIdle();
      threadBindingManager?.stop();
      if (client) await releaseSharedClientInstance(client, mode);
    } finally {
      client?.off("sync.state", onSyncState);
      syncLifecycle?.dispose();
      statusController.markStopped();
      setActiveMatrixClient(null, auth.accountId);
    }
  };
  const defaultGroupPolicy = resolveDefaultGroupPolicy(cfg);
  const { groupPolicy: groupPolicyRaw, providerMissingFallbackApplied } =
    resolveAllowlistProviderRuntimeGroupPolicy({
      providerConfigPresent: cfg.channels?.["matrix"] !== void 0,
      groupPolicy: accountConfig.groupPolicy,
      defaultGroupPolicy,
    });
  warnMissingProviderGroupPolicyFallbackOnce({
    providerMissingFallbackApplied,
    providerKey: "matrix",
    accountId: effectiveAccountId,
    blockedLabel: GROUP_POLICY_BLOCKED_LABEL.room,
    log: (message) => logVerboseMessage(message),
  });
  const groupPolicy = allowlistOnly && groupPolicyRaw === "open" ? "allowlist" : groupPolicyRaw;
  const replyToMode = opts.replyToMode ?? accountConfig.replyToMode ?? "off";
  const threadReplies = accountConfig.threadReplies ?? "inbound";
  const dmThreadReplies = accountConfig.dm?.threadReplies;
  const threadBindingIdleTimeoutMs = resolveThreadBindingIdleTimeoutMsForChannel({
    cfg,
    channel: "matrix",
    accountId: effectiveAccountId,
  });
  const threadBindingMaxAgeMs = resolveThreadBindingMaxAgeMsForChannel({
    cfg,
    channel: "matrix",
    accountId: effectiveAccountId,
  });
  const dmConfig = accountConfig.dm;
  const dmEnabled = dmConfig?.enabled ?? true;
  const dmPolicyRaw = dmConfig?.policy ?? "pairing";
  const dmPolicy = allowlistOnly && dmPolicyRaw !== "disabled" ? "allowlist" : dmPolicyRaw;
  const dmSessionScope = dmConfig?.sessionScope ?? "per-user";
  const textLimit = core.channel.text.resolveTextChunkLimit(cfg, "matrix", effectiveAccountId);
  const globalGroupChatHistoryLimit = cfg.messages?.groupChat?.historyLimit;
  const historyLimit = Math.max(0, accountConfig.historyLimit ?? globalGroupChatHistoryLimit ?? 0);
  const mediaMaxMb = opts.mediaMaxMb ?? accountConfig.mediaMaxMb ?? DEFAULT_MEDIA_MAX_MB;
  const mediaMaxBytes = Math.max(1, mediaMaxMb) * 1024 * 1024;
  const streaming = resolveMatrixStreamingMode(accountConfig.streaming);
  const previewToolProgressEnabled = resolveMatrixPreviewToolProgressEnabled(
    accountConfig.streaming,
  );
  const blockStreamingEnabled = resolveChannelStreamingBlockEnabled(accountConfig) === true;
  const startupMs = Date.now();
  const startupGraceMs = 0;
  const warnedEncryptedRooms = /* @__PURE__ */ new Set();
  const warnedCryptoMissingRooms = /* @__PURE__ */ new Set();
  let healthySyncSinceMs;
  const noteSyncHealthState = (state, at = Date.now()) => {
    if (isMatrixReadySyncState(state)) {
      healthySyncSinceMs ??= at;
      return;
    }
    if (isMatrixDisconnectedSyncState(state)) healthySyncSinceMs = void 0;
  };
  const onSyncState = (state) => {
    noteSyncHealthState(state);
  };
  try {
    client = await resolveSharedMatrixClient({
      cfg,
      auth: authWithLimit,
      startClient: false,
      accountId: auth.accountId,
    });
    setActiveMatrixClient(client, auth.accountId);
    const inboundDeduper = createMatrixInboundEventDeduper({
      auth,
      env: process.env,
    });
    syncLifecycle = createMatrixMonitorSyncLifecycle({
      client,
      statusController,
      isStopping: () => cleanedUp || opts.abortSignal?.aborted === true,
    });
    client.on("sync.state", onSyncState);
    const dropPreStartupMessages = !client.hasPersistedSyncState();
    const { getRoomInfo, getMemberDisplayName } = createMatrixRoomInfoResolver(client);
    const isExplicitlyConfiguredRoom = async (roomId) => {
      const roomInfoForConfig = needsRoomAliasesForConfig
        ? await getRoomInfo(roomId, { includeAliases: true })
        : void 0;
      const aliases = roomInfoForConfig
        ? [roomInfoForConfig.canonicalAlias ?? "", ...roomInfoForConfig.altAliases].filter(Boolean)
        : [];
      return (
        resolveMatrixRoomConfig({
          rooms: roomsConfig,
          roomId,
          aliases,
        }).matchSource === "direct"
      );
    };
    const directTracker = createDirectRoomTracker(client, {
      log: logVerboseMessage,
      isExplicitlyConfiguredRoom,
      canPromoteRecentInvite: async (roomId) =>
        shouldPromoteRecentInviteRoom({
          roomId,
          roomInfo: await getRoomInfo(roomId, { includeAliases: true }),
          rooms: roomsConfig,
        }),
      ...(dmSessionScope === "per-room"
        ? {
            canPromoteUnmappedStrictRoom: async (roomId) =>
              shouldPromoteRecentInviteRoom({
                roomId,
                roomInfo: await getRoomInfo(roomId, { includeAliases: true }),
                rooms: roomsConfig,
              }),
          }
        : {}),
      shouldKeepLocallyPromotedDirectRoom: async (roomId) => {
        try {
          const roomInfo = await getRoomInfo(roomId, { includeAliases: true });
          if (!roomInfo.nameResolved || !roomInfo.aliasesResolved) return;
          return shouldPromoteRecentInviteRoom({
            roomId,
            roomInfo,
            rooms: roomsConfig,
          });
        } catch (err) {
          logVerboseMessage(
            `matrix: local promotion revalidation failed room=${roomId} (${String(err)})`,
          );
          return;
        }
      },
    });
    registerMatrixAutoJoin({
      client,
      accountConfig,
      runtime,
    });
    const handleRoomMessage = createMatrixRoomMessageHandler({
      client,
      core,
      cfg,
      accountId: effectiveAccountId,
      accountConfig,
      runtime,
      logger,
      logVerboseMessage,
      allowFrom,
      allowFromResolvedEntries,
      groupAllowFrom,
      groupAllowFromResolvedEntries,
      roomsConfig,
      accountAllowBots,
      configuredBotUserIds,
      groupPolicy,
      replyToMode,
      threadReplies,
      dmThreadReplies,
      dmSessionScope,
      streaming,
      previewToolProgressEnabled,
      blockStreamingEnabled,
      dmEnabled,
      dmPolicy,
      textLimit,
      mediaMaxBytes,
      historyLimit,
      startupMs,
      startupGraceMs,
      dropPreStartupMessages,
      inboundDeduper,
      directTracker,
      getRoomInfo,
      getMemberDisplayName,
      needsRoomAliasesForConfig,
    });
    threadBindingManager = await createMatrixThreadBindingManager({
      cfg,
      accountId: effectiveAccountId,
      auth,
      client,
      env: process.env,
      idleTimeoutMs: threadBindingIdleTimeoutMs,
      maxAgeMs: threadBindingMaxAgeMs,
      logVerboseMessage,
    });
    logVerboseMessage(
      `matrix: thread bindings ready account=${threadBindingManager.accountId} idleMs=${threadBindingIdleTimeoutMs} maxAgeMs=${threadBindingMaxAgeMs}`,
    );
    registerMatrixMonitorEvents({
      cfg,
      client,
      auth,
      allowFrom,
      dmEnabled,
      dmPolicy,
      readStoreAllowFrom: async () =>
        await core.channel.pairing
          .readAllowFromStore({
            channel: "matrix",
            env: process.env,
            accountId: effectiveAccountId,
          })
          .catch(() => []),
      directTracker,
      logVerboseMessage,
      warnedEncryptedRooms,
      warnedCryptoMissingRooms,
      logger,
      startupGraceMs,
      getHealthySyncSinceMs: () => healthySyncSinceMs,
      formatNativeDependencyHint: core.system.formatNativeDependencyHint,
      onRoomMessage: handleRoomMessage,
      runDetachedTask: monitorTaskRunner.runDetachedTask,
    });
    logVerboseMessage("matrix: starting client");
    await resolveSharedMatrixClient({
      cfg,
      auth: authWithLimit,
      accountId: auth.accountId,
      abortSignal: opts.abortSignal,
    });
    logVerboseMessage("matrix: client started");
    logger.info(`matrix: logged in as ${auth.userId}`);
    backfillMatrixAuthDeviceIdAfterStartup({
      auth,
      env: process.env,
      abortSignal: opts.abortSignal,
    }).catch((err) => {
      logVerboseMessage(`matrix: failed to backfill deviceId after startup (${String(err)})`);
    });
    registerChannelRuntimeContext({
      channelRuntime: opts.channelRuntime,
      channelId: "matrix",
      accountId: effectiveAccountId,
      capability: CHANNEL_APPROVAL_NATIVE_RUNTIME_CONTEXT_CAPABILITY,
      context: { client },
      abortSignal: opts.abortSignal,
    });
    await runMatrixStartupMaintenance({
      client,
      auth,
      accountId: effectiveAccountId,
      effectiveAccountId,
      accountConfig,
      logger,
      logVerboseMessage,
      getRuntimeConfig: () => core.config.current(),
      replaceConfigFile: async (nextCfg) => {
        await core.config.replaceConfigFile({
          nextConfig: nextCfg,
          afterWrite: { mode: "auto" },
        });
      },
      loadWebMedia: async (url, maxBytes) => await core.media.loadWebMedia(url, maxBytes),
      env: process.env,
      abortSignal: opts.abortSignal,
    });
    await Promise.race([
      waitUntilAbort(opts.abortSignal, async () => {
        try {
          logVerboseMessage("matrix: stopping client");
          await cleanup();
        } catch (err) {
          logger.warn("matrix: failed during monitor shutdown cleanup", { error: String(err) });
        }
      }),
      syncLifecycle.waitForFatalStop(),
    ]);
  } catch (err) {
    if (opts.abortSignal?.aborted === true && isMatrixStartupAbortError(err)) {
      await cleanup("stop");
      return;
    }
    statusController.noteUnexpectedError(err);
    await cleanup();
    throw err;
  }
}
//#endregion
export { monitorMatrixProvider };
