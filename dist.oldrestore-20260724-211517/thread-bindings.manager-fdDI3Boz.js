import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { ot as getChannel } from "./discord-bgbU23Hx.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { i as getRuntimeConfigSnapshot } from "./runtime-snapshot-BbbqRiDR.js";
import { I as createDiscordRestClient } from "./send.shared-Ciix19qx.js";
import {
  i as registerSessionBindingAdapter,
  o as unregisterSessionBindingAdapter,
} from "./session-binding-service-DPVMwWUH.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import "./runtime-config-snapshot-hRn3WGyJ.js";
import "./runtime-env-D0V-7Gqz.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./routing-CwvmVRHd.js";
import "./conversation-runtime-DuXhVyjf.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as resolveDiscordChannelId } from "./target-parsing-DA2e4aeg.js";
import { t as resolveThreadBindingConversationIdFromBindingId } from "./thread-binding-id-BrCEIIq-.js";
import {
  i as resolveThreadBindingThreadName,
  n as resolveThreadBindingFarewellText,
} from "./thread-bindings-messages-C6JmokKM.js";
import {
  a as isThreadArchived,
  c as summarizeDiscordError,
  i as isDiscordThreadGoneError,
  n as createWebhookForChannel,
  o as maybeSendBindingMessage,
  r as findReusableWebhook,
  s as resolveChannelIdForBinding,
  t as createThreadForBinding,
} from "./thread-bindings.discord-api-3Lk5SIht.js";
import {
  C as resolveThreadBindingIdleTimeoutMs,
  D as saveBindingsToDisk,
  E as resolveThreadBindingMaxAgeMs,
  F as THREAD_BINDINGS_SWEEP_INTERVAL_MS,
  N as DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS,
  O as setBindingRecord,
  S as resolveBindingRecordKey,
  T as resolveThreadBindingMaxAgeExpiresAt,
  b as resetThreadBindingsForTests,
  c as ensureBindingsLoaded,
  g as rememberRecentUnboundWebhookEcho,
  h as normalizeThreadId,
  k as shouldDefaultPersist,
  l as forgetThreadBindingToken,
  m as normalizeThreadBindingDurationMs,
  n as MANAGERS_BY_ACCOUNT_ID,
  p as normalizeTargetKind,
  r as PERSIST_BY_ACCOUNT_ID,
  s as THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS,
  t as BINDINGS_BY_THREAD_ID,
  u as getThreadBindingToken,
  v as rememberThreadBindingToken,
  w as resolveThreadBindingInactivityExpiresAt,
  x as resolveBindingIdsForSession,
  y as removeBindingRecord,
} from "./thread-bindings.state-Da_kQ-2B.js";
//#region extensions/discord/src/monitor/thread-bindings.session-adapter.ts
function normalizeChildBindingParentChannelId(raw) {
  const trimmed = normalizeOptionalString(raw) ?? "";
  if (!trimmed) return;
  try {
    return resolveDiscordChannelId(trimmed);
  } catch {
    return;
  }
}
function toSessionBindingTargetKind(raw) {
  return raw === "subagent" ? "subagent" : "session";
}
function toThreadBindingTargetKind(raw) {
  return raw === "subagent" ? "subagent" : "acp";
}
function resolveEffectiveBindingExpiresAt(params) {
  const inactivityExpiresAt = resolveThreadBindingInactivityExpiresAt({
    record: params.record,
    defaultIdleTimeoutMs: params.defaultIdleTimeoutMs,
  });
  const maxAgeExpiresAt = resolveThreadBindingMaxAgeExpiresAt({
    record: params.record,
    defaultMaxAgeMs: params.defaultMaxAgeMs,
  });
  if (inactivityExpiresAt != null && maxAgeExpiresAt != null)
    return Math.min(inactivityExpiresAt, maxAgeExpiresAt);
  return inactivityExpiresAt ?? maxAgeExpiresAt;
}
function toSessionBindingRecord(record, defaults) {
  return {
    bindingId:
      resolveBindingRecordKey({
        accountId: record.accountId,
        threadId: record.threadId,
      }) ?? `${record.accountId}:${record.threadId}`,
    targetSessionKey: record.targetSessionKey,
    targetKind: toSessionBindingTargetKind(record.targetKind),
    conversation: {
      channel: "discord",
      accountId: record.accountId,
      conversationId: record.threadId,
      parentConversationId: record.channelId,
    },
    status: "active",
    boundAt: record.boundAt,
    expiresAt: resolveEffectiveBindingExpiresAt({
      record,
      defaultIdleTimeoutMs: defaults.idleTimeoutMs,
      defaultMaxAgeMs: defaults.maxAgeMs,
    }),
    metadata: {
      agentId: record.agentId,
      label: record.label,
      webhookId: record.webhookId,
      webhookToken: record.webhookToken,
      boundBy: record.boundBy,
      lastActivityAt: record.lastActivityAt,
      idleTimeoutMs: resolveThreadBindingIdleTimeoutMs({
        record,
        defaultIdleTimeoutMs: defaults.idleTimeoutMs,
      }),
      maxAgeMs: resolveThreadBindingMaxAgeMs({
        record,
        defaultMaxAgeMs: defaults.maxAgeMs,
      }),
      ...record.metadata,
    },
  };
}
function createThreadBindingSessionAdapter(params) {
  const toRecord = (entry) => toSessionBindingRecord(entry, params.defaults);
  return {
    channel: "discord",
    accountId: params.accountId,
    capabilities: { placements: ["current", "child"] },
    bind: async (input) => {
      if (input.conversation.channel !== "discord") return null;
      const targetSessionKey = input.targetSessionKey.trim();
      if (!targetSessionKey) return null;
      const conversationId = normalizeOptionalString(input.conversation.conversationId) ?? "";
      const placement = input.placement === "child" ? "child" : "current";
      const metadata = input.metadata ?? {};
      const label = normalizeOptionalString(metadata.label);
      const threadName =
        typeof metadata.threadName === "string"
          ? normalizeOptionalString(metadata.threadName)
          : void 0;
      const introText =
        typeof metadata.introText === "string"
          ? normalizeOptionalString(metadata.introText)
          : void 0;
      const boundBy =
        typeof metadata.boundBy === "string" ? normalizeOptionalString(metadata.boundBy) : void 0;
      const agentId =
        typeof metadata.agentId === "string" ? normalizeOptionalString(metadata.agentId) : void 0;
      let threadId;
      let channelId;
      let createThread = false;
      if (placement === "child") {
        createThread = true;
        channelId = normalizeChildBindingParentChannelId(input.conversation.parentConversationId);
        if (!channelId && conversationId)
          channelId =
            (await resolveChannelIdForBinding({
              cfg: params.resolveCurrentCfg(),
              accountId: params.accountId,
              token: params.resolveCurrentToken(),
              threadId: conversationId,
            })) ?? void 0;
      } else threadId = conversationId || void 0;
      const bound = await params.manager.bindTarget({
        threadId,
        channelId,
        createThread,
        threadName,
        targetKind: toThreadBindingTargetKind(input.targetKind),
        targetSessionKey,
        agentId,
        label,
        boundBy,
        introText,
        metadata,
      });
      return bound ? toRecord(bound) : null;
    },
    listBySession: (targetSessionKey) =>
      params.manager.listBySessionKey(targetSessionKey).map(toRecord),
    resolveByConversation: (ref) => {
      if (ref.channel !== "discord") return null;
      const binding = params.manager.getByThreadId(ref.conversationId);
      return binding ? toRecord(binding) : null;
    },
    touch: (bindingId, at) => {
      const threadId = resolveThreadBindingConversationIdFromBindingId({
        accountId: params.accountId,
        bindingId,
      });
      if (!threadId) return;
      params.manager.touchThread({
        threadId,
        at,
        persist: true,
      });
    },
    unbind: async (input) => {
      if (input.targetSessionKey?.trim())
        return params.manager
          .unbindBySessionKey({
            targetSessionKey: input.targetSessionKey,
            reason: input.reason,
          })
          .map(toRecord);
      const threadId = resolveThreadBindingConversationIdFromBindingId({
        accountId: params.accountId,
        bindingId: input.bindingId,
      });
      if (!threadId) return [];
      const removed = params.manager.unbindThread({
        threadId,
        reason: input.reason,
      });
      return removed ? [toRecord(removed)] : [];
    },
  };
}
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.manager.ts
function registerManager(manager) {
  MANAGERS_BY_ACCOUNT_ID.set(manager.accountId, manager);
}
function unregisterManager(accountId, manager) {
  if (MANAGERS_BY_ACCOUNT_ID.get(accountId) === manager) MANAGERS_BY_ACCOUNT_ID.delete(accountId);
}
const SWEEPERS_BY_ACCOUNT_ID = /* @__PURE__ */ new Map();
function createNoopManager(accountIdRaw) {
  return {
    accountId: normalizeAccountId(accountIdRaw),
    getIdleTimeoutMs: () => DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS,
    getMaxAgeMs: () => 0,
    getByThreadId: () => void 0,
    getBySessionKey: () => void 0,
    listBySessionKey: () => [],
    listBindings: () => [],
    touchThread: () => null,
    bindTarget: async () => null,
    unbindThread: () => null,
    unbindBySessionKey: () => [],
    stop: () => {},
  };
}
function isDirectConversationBindingId(value) {
  const trimmed = normalizeOptionalString(value);
  return Boolean(trimmed && /^(user:|channel:)/i.test(trimmed));
}
function createThreadBindingManager(params) {
  ensureBindingsLoaded();
  const accountId = normalizeAccountId(params.accountId);
  const existing = MANAGERS_BY_ACCOUNT_ID.get(accountId);
  if (existing) {
    rememberThreadBindingToken({
      accountId,
      token: params.token,
    });
    return existing;
  }
  rememberThreadBindingToken({
    accountId,
    token: params.token,
  });
  const persist = params.persist ?? shouldDefaultPersist();
  PERSIST_BY_ACCOUNT_ID.set(accountId, persist);
  const idleTimeoutMs = normalizeThreadBindingDurationMs(
    params.idleTimeoutMs,
    DEFAULT_THREAD_BINDING_IDLE_TIMEOUT_MS,
  );
  const maxAgeMs = normalizeThreadBindingDurationMs(params.maxAgeMs, 0);
  const resolveCurrentCfg = () => getRuntimeConfigSnapshot() ?? params.cfg;
  const resolveCurrentToken = () => getThreadBindingToken(accountId) ?? params.token;
  let sweepTimer = null;
  const runSweepOnce = async () => {
    const bindings = manager.listBindings();
    if (bindings.length === 0) return;
    let rest = null;
    for (const snapshotBinding of bindings) {
      const binding = manager.getByThreadId(snapshotBinding.threadId);
      if (!binding) continue;
      const now = Date.now();
      const inactivityExpiresAt = resolveThreadBindingInactivityExpiresAt({
        record: binding,
        defaultIdleTimeoutMs: idleTimeoutMs,
      });
      const maxAgeExpiresAt = resolveThreadBindingMaxAgeExpiresAt({
        record: binding,
        defaultMaxAgeMs: maxAgeMs,
      });
      const expirationCandidates = [];
      if (inactivityExpiresAt != null && now >= inactivityExpiresAt)
        expirationCandidates.push({
          reason: "idle-expired",
          at: inactivityExpiresAt,
        });
      if (maxAgeExpiresAt != null && now >= maxAgeExpiresAt)
        expirationCandidates.push({
          reason: "max-age-expired",
          at: maxAgeExpiresAt,
        });
      if (expirationCandidates.length > 0) {
        expirationCandidates.sort((a, b) => a.at - b.at);
        const reason = expirationCandidates[0]?.reason ?? "idle-expired";
        manager.unbindThread({
          threadId: binding.threadId,
          reason,
          sendFarewell: true,
          farewellText: resolveThreadBindingFarewellText({
            reason,
            idleTimeoutMs: resolveThreadBindingIdleTimeoutMs({
              record: binding,
              defaultIdleTimeoutMs: idleTimeoutMs,
            }),
            maxAgeMs: resolveThreadBindingMaxAgeMs({
              record: binding,
              defaultMaxAgeMs: maxAgeMs,
            }),
          }),
        });
        continue;
      }
      if (isDirectConversationBindingId(binding.threadId)) continue;
      if (!rest)
        try {
          rest = createDiscordRestClient({
            cfg: resolveCurrentCfg(),
            accountId,
            token: resolveCurrentToken(),
          }).rest;
        } catch {
          return;
        }
      try {
        const channel = await getChannel(rest, binding.threadId);
        if (!channel || typeof channel !== "object") {
          logVerbose(
            `discord thread binding sweep probe returned invalid payload for ${binding.threadId}`,
          );
          continue;
        }
        if (isThreadArchived(channel))
          manager.unbindThread({
            threadId: binding.threadId,
            reason: "thread-archived",
            sendFarewell: true,
          });
      } catch (err) {
        if (isDiscordThreadGoneError(err)) {
          logVerbose(
            `discord thread binding sweep removing stale binding ${binding.threadId}: ${summarizeDiscordError(err)}`,
          );
          manager.unbindThread({
            threadId: binding.threadId,
            reason: "thread-delete",
            sendFarewell: false,
          });
          continue;
        }
        logVerbose(
          `discord thread binding sweep probe failed for ${binding.threadId}: ${summarizeDiscordError(err)}`,
        );
      }
    }
  };
  SWEEPERS_BY_ACCOUNT_ID.set(accountId, runSweepOnce);
  const manager = {
    accountId,
    getIdleTimeoutMs: () => idleTimeoutMs,
    getMaxAgeMs: () => maxAgeMs,
    getByThreadId: (threadId) => {
      const key = resolveBindingRecordKey({
        accountId,
        threadId,
      });
      if (!key) return;
      const entry = BINDINGS_BY_THREAD_ID.get(key);
      if (!entry || entry.accountId !== accountId) return;
      return entry;
    },
    getBySessionKey: (targetSessionKey) => {
      return manager.listBySessionKey(targetSessionKey)[0];
    },
    listBySessionKey: (targetSessionKey) => {
      return resolveBindingIdsForSession({
        targetSessionKey,
        accountId,
      })
        .map((bindingKey) => BINDINGS_BY_THREAD_ID.get(bindingKey))
        .filter((entry) => Boolean(entry));
    },
    listBindings: () =>
      [...BINDINGS_BY_THREAD_ID.values()].filter((entry) => entry.accountId === accountId),
    touchThread: (touchParams) => {
      const key = resolveBindingRecordKey({
        accountId,
        threadId: touchParams.threadId,
      });
      if (!key) return null;
      const existingResult = BINDINGS_BY_THREAD_ID.get(key);
      if (!existingResult || existingResult.accountId !== accountId) return null;
      const now = Date.now();
      const at =
        typeof touchParams.at === "number" && Number.isFinite(touchParams.at)
          ? Math.max(0, Math.floor(touchParams.at))
          : now;
      const nextRecord = {
        ...existingResult,
        lastActivityAt: Math.max(existingResult.lastActivityAt || 0, at),
      };
      setBindingRecord(nextRecord);
      if (touchParams.persist ?? persist)
        saveBindingsToDisk({ minIntervalMs: THREAD_BINDING_TOUCH_PERSIST_MIN_INTERVAL_MS });
      return nextRecord;
    },
    bindTarget: async (bindParams) => {
      const cfg = resolveCurrentCfg();
      let threadId = normalizeThreadId(bindParams.threadId);
      let channelId = normalizeOptionalString(bindParams.channelId) ?? "";
      const directConversationBinding =
        isDirectConversationBindingId(threadId) || isDirectConversationBindingId(channelId);
      if (!threadId && bindParams.createThread) {
        if (!channelId) return null;
        const threadName = resolveThreadBindingThreadName({
          agentId: bindParams.agentId,
          label: bindParams.label,
        });
        threadId =
          (await createThreadForBinding({
            cfg,
            accountId,
            token: resolveCurrentToken(),
            channelId,
            threadName: normalizeOptionalString(bindParams.threadName) ?? threadName,
          })) ?? void 0;
      }
      if (!threadId) return null;
      if (!channelId && directConversationBinding) channelId = threadId;
      if (!channelId)
        channelId =
          (await resolveChannelIdForBinding({
            cfg,
            accountId,
            token: resolveCurrentToken(),
            threadId,
            channelId: bindParams.channelId,
          })) ?? "";
      if (!channelId) return null;
      const existingValue = manager.getByThreadId(threadId);
      const targetSessionKey = normalizeOptionalString(bindParams.targetSessionKey) ?? "";
      if (!targetSessionKey) return null;
      const targetKind = normalizeTargetKind(bindParams.targetKind, targetSessionKey);
      let webhookId =
        normalizeOptionalString(bindParams.webhookId) ??
        normalizeOptionalString(existingValue?.webhookId) ??
        "";
      let webhookToken =
        normalizeOptionalString(bindParams.webhookToken) ??
        normalizeOptionalString(existingValue?.webhookToken) ??
        "";
      if (!directConversationBinding && (!webhookId || !webhookToken)) {
        const cachedWebhook = findReusableWebhook({
          accountId,
          channelId,
        });
        webhookId = cachedWebhook.webhookId ?? "";
        webhookToken = cachedWebhook.webhookToken ?? "";
      }
      if (!directConversationBinding && (!webhookId || !webhookToken)) {
        const createdWebhook = await createWebhookForChannel({
          cfg,
          accountId,
          token: resolveCurrentToken(),
          channelId,
        });
        webhookId = createdWebhook.webhookId ?? "";
        webhookToken = createdWebhook.webhookToken ?? "";
      }
      const now = Date.now();
      const record = {
        accountId,
        channelId,
        threadId,
        targetKind,
        targetSessionKey,
        agentId:
          normalizeOptionalString(bindParams.agentId) ??
          normalizeOptionalString(existingValue?.agentId) ??
          resolveAgentIdFromSessionKey(targetSessionKey),
        label:
          normalizeOptionalString(bindParams.label) ??
          normalizeOptionalString(existingValue?.label),
        webhookId: webhookId || void 0,
        webhookToken: webhookToken || void 0,
        boundBy:
          normalizeOptionalString(bindParams.boundBy) ??
          normalizeOptionalString(existingValue?.boundBy) ??
          "system",
        boundAt: now,
        lastActivityAt: now,
        idleTimeoutMs:
          typeof existingValue?.idleTimeoutMs === "number"
            ? existingValue.idleTimeoutMs
            : idleTimeoutMs,
        maxAgeMs: typeof existingValue?.maxAgeMs === "number" ? existingValue.maxAgeMs : maxAgeMs,
        metadata:
          bindParams.metadata && typeof bindParams.metadata === "object"
            ? {
                ...existingValue?.metadata,
                ...bindParams.metadata,
              }
            : existingValue?.metadata
              ? { ...existingValue.metadata }
              : void 0,
      };
      setBindingRecord(record);
      if (persist) saveBindingsToDisk();
      const introText = bindParams.introText?.trim();
      if (introText && cfg)
        maybeSendBindingMessage({
          cfg,
          record,
          text: introText,
        });
      return record;
    },
    unbindThread: (unbindParams) => {
      const bindingKey = resolveBindingRecordKey({
        accountId,
        threadId: unbindParams.threadId,
      });
      if (!bindingKey) return null;
      const existingLocal = BINDINGS_BY_THREAD_ID.get(bindingKey);
      if (!existingLocal || existingLocal.accountId !== accountId) return null;
      const removed = removeBindingRecord(bindingKey);
      if (!removed) return null;
      rememberRecentUnboundWebhookEcho(removed);
      if (persist) saveBindingsToDisk();
      if (unbindParams.sendFarewell !== false) {
        const cfg = resolveCurrentCfg();
        const farewell = resolveThreadBindingFarewellText({
          reason: unbindParams.reason,
          farewellText: unbindParams.farewellText,
          idleTimeoutMs: resolveThreadBindingIdleTimeoutMs({
            record: removed,
            defaultIdleTimeoutMs: idleTimeoutMs,
          }),
          maxAgeMs: resolveThreadBindingMaxAgeMs({
            record: removed,
            defaultMaxAgeMs: maxAgeMs,
          }),
        });
        if (cfg)
          maybeSendBindingMessage({
            cfg,
            record: removed,
            text: farewell,
            preferWebhook: false,
          });
      }
      return removed;
    },
    unbindBySessionKey: (unbindParams) => {
      const ids = resolveBindingIdsForSession({
        targetSessionKey: unbindParams.targetSessionKey,
        accountId,
        targetKind: unbindParams.targetKind,
      });
      if (ids.length === 0) return [];
      const removed = [];
      for (const bindingKey of ids) {
        const binding = BINDINGS_BY_THREAD_ID.get(bindingKey);
        if (!binding) continue;
        const entry = manager.unbindThread({
          threadId: binding.threadId,
          reason: unbindParams.reason,
          sendFarewell: unbindParams.sendFarewell,
          farewellText: unbindParams.farewellText,
        });
        if (entry) removed.push(entry);
      }
      return removed;
    },
    stop: () => {
      if (sweepTimer) {
        clearInterval(sweepTimer);
        sweepTimer = null;
      }
      SWEEPERS_BY_ACCOUNT_ID.delete(accountId);
      unregisterManager(accountId, manager);
      unregisterSessionBindingAdapter({
        channel: "discord",
        accountId,
        adapter: sessionBindingAdapter,
      });
      forgetThreadBindingToken(accountId);
    },
  };
  if (params.enableSweeper !== false) {
    sweepTimer = setInterval(() => {
      runSweepOnce();
    }, THREAD_BINDINGS_SWEEP_INTERVAL_MS);
    if (!(process.env.VITEST || false)) sweepTimer.unref?.();
  }
  const sessionBindingAdapter = createThreadBindingSessionAdapter({
    accountId,
    manager,
    defaults: {
      idleTimeoutMs,
      maxAgeMs,
    },
    resolveCurrentCfg,
    resolveCurrentToken,
  });
  registerSessionBindingAdapter(sessionBindingAdapter);
  registerManager(manager);
  return manager;
}
function createNoopThreadBindingManager(accountId) {
  return createNoopManager(accountId);
}
function getThreadBindingManager(accountId) {
  const normalized = normalizeAccountId(accountId);
  return MANAGERS_BY_ACCOUNT_ID.get(normalized) ?? null;
}
const testing = {
  resolveThreadBindingThreadName,
  resetThreadBindingsForTests,
  runThreadBindingSweepForAccount: async (accountId) => {
    const sweep = SWEEPERS_BY_ACCOUNT_ID.get(normalizeAccountId(accountId));
    if (sweep) await sweep();
  },
};
//#endregion
export {
  testing as i,
  createThreadBindingManager as n,
  getThreadBindingManager as r,
  createNoopThreadBindingManager as t,
};
