import { randomUUID } from "node:crypto";
import { n as agentCommandFromIngress } from "./agent-command-CxzoW4-d.js";
import { v as onAgentEvent } from "./agent-events-D4UsOPeT.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { v as resolveSessionAgentId } from "./agent-scope-y9xQv_q1.js";
import {
  S as setEmbeddedMode,
  b as setEmbeddedPluginApprovalBroker,
  v as EmbeddedPluginApprovalBroker,
  y as clearEmbeddedPluginApprovalBroker,
} from "./agent-tools.before-tool-call-B7gv78c3.js";
import { o as isChatStopCommandText } from "./chat-abort-DGc7CDOP.js";
import "./config-BDv-QbJ6.js";
import {
  a as replaceOversizedChatHistoryMessages,
  i as enforceChatHistoryFinalBudget,
  r as CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES,
} from "./chat-BheIr_Bk.js";
import { t as augmentChatHistoryWithCliSessionImports } from "./cli-session-history-QegNEJKL.js";
import { t as loadCombinedSessionStoreForGateway } from "./combined-store-gateway-TXobKXN7.js";
import "./message-channel-NQc9DJ6B.js";
import { a as parseGoalCommand } from "./commands-goal-8338SFRd.js";
import { r as ensureContextWindowCacheLoaded } from "./context-D1brGGkh.js";
import { r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as createDefaultDeps } from "./deps-BDX9tA_j.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  a as shouldSuppressAssistantEventForLiveChat,
  i as resolveMergedAssistantText,
  n as projectLiveAssistantBufferedText,
  r as resolveAssistantLiveChatInput,
  t as normalizeLiveAssistantBufferedText,
} from "./live-chat-projector-DKETpCbK.js";
import { t as resolveLocalRunShutdownGraceMs } from "./local-run-shutdown-BiT-iHb_.js";
import { a as logWarn, r as logInfo } from "./logger-BegyOJlO.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-CvbXi0yz.js";
import { t as buildAllowedModelSet } from "./model-selection-DOlkTrQa.js";
import { r as buildConfiguredModelCatalog } from "./model-selection-shared-BliwFXJy.js";
import { t as resolveThinkingDefault } from "./model-thinking-default-C_eCEq4B.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as ensureRuntimePluginsLoaded } from "./runtime-plugins-CwbL9nR9.js";
import { c as getMaxChatHistoryMessagesBytes } from "./server-constants-DKuFNbQH.js";
import { t as loadGatewayModelCatalog } from "./server-model-catalog-GcPTRbL-.js";
import { s as applySessionPatchProjection } from "./session-accessor-PZVNxFCV.js";
import {
  i as projectSessionsPatchEntry,
  n as createGatewaySession,
} from "./session-create-service-Cu4fMU-m.js";
import { n as resolveSessionModelRef } from "./session-model-ref-1c6_XVhy.js";
import { c as performGatewaySessionReset } from "./session-reset-service-DmIkbVGF.js";
import {
  c as resolveEffectiveChatHistoryMaxChars,
  r as augmentChatHistoryWithCanvasBlocks,
  s as projectRecentChatDisplayMessages,
} from "./session-transcript-path-CoSCKxoF.js";
import {
  s as readSessionMessagesAsync,
  v as capArrayByJsonBytes,
} from "./session-transcript-readers-Bv0ty7AX.js";
import {
  a as getSessionDefaults,
  c as listSessionsFromStoreAsync,
  d as migrateAndPruneGatewaySessionStoreKey,
  h as resolveGatewaySessionStoreTarget,
  o as listAgentsForGateway,
  t as buildGatewaySessionInfo,
  u as loadSessionEntry,
} from "./session-utils-DjTWBI0J.js";
import {
  c as clearSessionGoal,
  d as getSessionGoal,
  l as createSessionGoal,
  m as updateSessionGoalStatus,
  p as updateSessionGoalObjective,
  u as formatSessionGoalStatus,
} from "./sessions-CEG7v41b.js";
import { r as readToolValidationErrorSummary } from "./tool-error-summary-DDV0ZoKC.js";
//#region src/tui/embedded-backend.ts
const LIFECYCLE_ERROR_RETRY_GRACE_MS = 15e3;
const silentRuntime = {
  log: (..._args) => void 0,
  error: (..._args) => void 0,
  exit: (code) => {
    throw new Error(`embedded tui runtime exit ${String(code)}`);
  },
};
const embeddedSessionStartupMigrationLog = {
  info: (message) => logInfo(message, silentRuntime),
  warn: (message) => logWarn(message, silentRuntime),
};
function hasProviderWildcardModelAllowlist(cfg) {
  return [
    cfg.agents?.defaults?.models,
    ...(cfg.agents?.list?.map((agent) => agent?.models) ?? []),
  ].some((models) => Object.keys(models ?? {}).some((key) => key.trim().endsWith("/*")));
}
function resolveConfiguredReplaceModeCatalog(cfg) {
  if (cfg.models?.mode !== "replace") return;
  if (hasProviderWildcardModelAllowlist(cfg)) return;
  return buildConfiguredModelCatalog({ cfg });
}
function shouldLoadFullGatewayCatalogForReplaceMode(cfg) {
  return cfg.models?.mode === "replace" && hasProviderWildcardModelAllowlist(cfg);
}
function ensureEmbeddedHistoryRuntimePluginsLoaded(params) {
  try {
    const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.sessionAgentId);
    ensureRuntimePluginsLoaded({
      config: params.cfg,
      workspaceDir,
    });
    return { status: "warmed" };
  } catch (err) {
    return {
      status: "failed",
      error: String(err),
    };
  }
}
async function loadEmbeddedTuiModelCatalog(cfg) {
  const configuredCatalog = resolveConfiguredReplaceModeCatalog(cfg);
  if (configuredCatalog !== void 0) return configuredCatalog;
  return await loadGatewayModelCatalog(
    shouldLoadFullGatewayCatalogForReplaceMode(cfg) ? { readOnly: false } : void 0,
  );
}
function resolveBtwQuestion(message) {
  const question = /^\/(?:btw|side)(?::|\s)+(.*)$/i.exec(message.trim())?.[1]?.trim();
  return question ? question : void 0;
}
function payloadText(parts) {
  if (!Array.isArray(parts)) return "";
  return parts
    .map((part) => {
      if (!part || typeof part !== "object") return "";
      const payload = part;
      return typeof payload.text === "string" ? payload.text.trim() : "";
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();
}
function timeoutSecondsFromMs(timeoutMs) {
  if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs) || timeoutMs < 0) return;
  return String(Math.max(0, Math.ceil(timeoutMs / 1e3)));
}
function resolveDeltaPayload(text, previousText) {
  if (previousText === void 0) return { deltaText: text };
  if (!text.startsWith(previousText))
    return {
      deltaText: text,
      replace: true,
    };
  return { deltaText: text.slice(previousText.length) };
}
function createQueuedRunReadiness() {
  let resolve;
  const promise = new Promise((ready) => {
    resolve = ready;
  });
  if (!resolve) throw new Error("Expected queue readiness resolver to be initialized");
  const resolveReady = resolve;
  let settled = false;
  return {
    promise,
    markReady: () => {
      if (settled) return;
      settled = true;
      resolveReady();
    },
  };
}
async function waitForLocalRunShutdown(promises) {
  if (promises.length === 0) return true;
  const timeoutMs = resolveLocalRunShutdownGraceMs();
  if (timeoutMs <= 0) return false;
  let timeout;
  let completed = false;
  await Promise.race([
    Promise.allSettled(promises).then(() => {
      completed = true;
    }),
    new Promise((resolve) => {
      timeout = setTimeout(resolve, timeoutMs);
      timeout.unref?.();
    }),
  ]);
  if (timeout) clearTimeout(timeout);
  return completed;
}
async function waitForQueuedLocalRun(previousRun, runId) {
  await previousRun.run.queuedRunReady;
  if (!previousRun.run.finishing && !previousRun.run.lifecycleEnded) {
    await previousRun.promise;
    return;
  }
  const timeoutMs = resolveLocalRunShutdownGraceMs();
  if (timeoutMs <= 0)
    throw new Error(
      `timed out waiting for previous local run to finish post-turn maintenance for ${runId}`,
    );
  let timeout;
  try {
    await Promise.race([
      previousRun.promise,
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          reject(
            /* @__PURE__ */ new Error(
              `timed out waiting for previous local run to finish post-turn maintenance for ${runId}`,
            ),
          );
        }, timeoutMs);
        timeout.unref?.();
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
var EmbeddedTuiBackend = class {
  constructor() {
    this.connection = { url: "local embedded" };
    this.deps = createDefaultDeps();
    this.runs = /* @__PURE__ */ new Map();
    this.runPromises = /* @__PURE__ */ new Map();
    this.seq = 0;
    this.pendingLifecycleErrors = /* @__PURE__ */ new Map();
    this.pluginApprovalBroker = new EmbeddedPluginApprovalBroker();
    this.ready = Promise.resolve();
  }
  start() {
    if (this.unsubscribe) return;
    setEmbeddedMode(true);
    ensureContextWindowCacheLoaded();
    this.previousRuntimeLog = defaultRuntime.log;
    this.previousRuntimeError = defaultRuntime.error;
    defaultRuntime.log = silentRuntime.log;
    defaultRuntime.error = silentRuntime.error;
    this.unsubscribe = onAgentEvent((evt) => this.handleAgentEvent(evt));
    setEmbeddedPluginApprovalBroker(this.pluginApprovalBroker);
    this.unsubscribePluginApprovals = this.pluginApprovalBroker.subscribe((event) => {
      this.emit(event.event, event.payload);
    });
    this.ready = (async () => {
      const { runSessionStartupMigration } = await import("./startup-migration-CBu7KzOJ.js");
      await runSessionStartupMigration({
        cfg: getRuntimeConfig(),
        env: process.env,
        log: embeddedSessionStartupMigrationLog,
      });
    })();
    queueMicrotask(() => {
      this.onConnected?.();
    });
  }
  async stop() {
    clearEmbeddedPluginApprovalBroker(this.pluginApprovalBroker);
    this.unsubscribePluginApprovals?.();
    this.unsubscribePluginApprovals = void 0;
    const maintenancePromises = [];
    for (const [runId, run] of this.runs) {
      if (run.finishing || run.lifecycleEnded) {
        const promise = this.runPromises.get(runId);
        if (promise) maintenancePromises.push(promise);
        continue;
      }
      run.controller.abort();
    }
    this.pluginApprovalBroker.stop();
    if (!(await waitForLocalRunShutdown(maintenancePromises))) {
      for (const run of this.runs.values())
        if (run.finishing || run.lifecycleEnded) run.controller.abort();
    }
    this.unsubscribe?.();
    this.unsubscribe = void 0;
    this.clearPendingLifecycleErrors();
    for (const run of this.runs.values()) run.controller.abort();
    this.runs.clear();
    this.runPromises.clear();
    defaultRuntime.log = this.previousRuntimeLog ?? defaultRuntime.log;
    defaultRuntime.error = this.previousRuntimeError ?? defaultRuntime.error;
    this.previousRuntimeLog = void 0;
    this.previousRuntimeError = void 0;
    setEmbeddedMode(false);
  }
  async sendChat(opts) {
    await this.ready;
    const runId = opts.runId ?? randomUUID();
    const question = resolveBtwQuestion(opts.message);
    const runScope = {
      sessionKey: opts.sessionKey,
      agentId: opts.agentId,
    };
    const stopCommand =
      this.hasAbortableSessionRun(runScope) && isChatStopCommandText(opts.message);
    const queuedAfter =
      question || stopCommand ? void 0 : this.findQueuedSessionRunPromise(runScope);
    if (stopCommand) {
      this.abortSessionRuns(runScope);
      return { runId };
    }
    const controller = new AbortController();
    const queuedRunReadiness = createQueuedRunReadiness();
    this.runs.set(runId, {
      sessionKey: opts.sessionKey,
      agentId: opts.agentId,
      controller,
      buffer: "",
      isBtw: Boolean(question),
      question,
      finishing: false,
      lifecycleEnded: false,
      finalSent: false,
      registered: false,
      queuedRunReady: queuedRunReadiness.promise,
      markQueuedRunReady: queuedRunReadiness.markReady,
    });
    const runPromise = this.runTurn({
      runId,
      sessionKey: opts.sessionKey,
      agentId: opts.agentId,
      message: opts.message,
      thinking: opts.thinking,
      deliver: opts.deliver,
      timeoutMs: opts.timeoutMs,
      controller,
      queuedAfter,
    });
    this.runPromises.set(runId, runPromise);
    runPromise.finally(() => {
      this.runPromises.delete(runId);
    });
    return { runId };
  }
  async abortChat(opts) {
    if (!opts.runId) {
      let aborted = false;
      const runIds = [];
      for (const [runId, run] of this.runs) {
        if (run.isBtw) continue;
        if (run.sessionKey !== opts.sessionKey) continue;
        if (opts.sessionKey === "global") {
          const defaultAgentId = resolveDefaultAgentId(getRuntimeConfig());
          const requestedAgentId = opts.agentId ? normalizeAgentId(opts.agentId) : defaultAgentId;
          if ((run.agentId ? normalizeAgentId(run.agentId) : defaultAgentId) !== requestedAgentId)
            continue;
        }
        if (!this.isAbortableRun(runId, run)) continue;
        run.controller.abort();
        aborted = true;
        runIds.push(runId);
      }
      return {
        ok: true,
        aborted,
        runIds,
      };
    }
    const run = this.runs.get(opts.runId);
    if (!run || run.sessionKey !== opts.sessionKey)
      return {
        ok: true,
        aborted: false,
        runIds: [],
      };
    if (opts.sessionKey === "global") {
      const defaultAgentId = resolveDefaultAgentId(getRuntimeConfig());
      const requestedAgentId = opts.agentId ? normalizeAgentId(opts.agentId) : defaultAgentId;
      if ((run.agentId ? normalizeAgentId(run.agentId) : defaultAgentId) !== requestedAgentId)
        return {
          ok: true,
          aborted: false,
          runIds: [],
        };
    }
    if (!this.isAbortableRun(opts.runId, run))
      return {
        ok: true,
        aborted: false,
        runIds: [],
      };
    run.controller.abort();
    return {
      ok: true,
      aborted: true,
      runIds: [opts.runId],
    };
  }
  async loadHistory(opts) {
    await this.ready;
    const loadOptions = opts.agentId ? { agentId: opts.agentId } : void 0;
    const { cfg, storePath, store, entry, canonicalKey } = loadSessionEntry(
      opts.sessionKey,
      loadOptions,
    );
    const sessionId = entry?.sessionId;
    const sessionAgentId = resolveSessionAgentId({
      sessionKey: opts.sessionKey,
      config: cfg,
      agentId: opts.agentId,
    });
    const runtimePluginsPrewarm = ensureEmbeddedHistoryRuntimePluginsLoaded({
      cfg,
      sessionAgentId,
    });
    const resolvedSessionModel = resolveSessionModelRef(cfg, entry, sessionAgentId);
    const max = Math.min(1e3, typeof opts.limit === "number" ? opts.limit : 200);
    const maxHistoryBytes = getMaxChatHistoryMessagesBytes();
    const localMessages =
      sessionId && storePath
        ? await readSessionMessagesAsync(
            {
              agentId: sessionAgentId,
              sessionEntry: entry,
              sessionId,
              sessionKey: canonicalKey,
              storePath,
            },
            {
              mode: "recent",
              maxMessages: max,
              maxBytes: Math.max(maxHistoryBytes * 2, 1024 * 1024),
              allowResetArchiveFallback: true,
            },
          )
        : [];
    const capped = capArrayByJsonBytes(
      replaceOversizedChatHistoryMessages({
        messages: augmentChatHistoryWithCanvasBlocks(
          projectRecentChatDisplayMessages(
            augmentChatHistoryWithCliSessionImports({
              entry,
              provider: resolvedSessionModel.provider,
              localMessages,
            }),
            {
              maxChars: resolveEffectiveChatHistoryMaxChars(cfg),
              maxMessages: max,
            },
          ),
        ),
        maxSingleMessageBytes: Math.min(CHAT_HISTORY_MAX_SINGLE_MESSAGE_BYTES, maxHistoryBytes),
      }).messages,
      maxHistoryBytes,
    ).items;
    const messages = enforceChatHistoryFinalBudget({
      messages: capped,
      maxBytes: maxHistoryBytes,
    }).messages;
    let thinkingLevel = entry?.thinkingLevel;
    if (!thinkingLevel) {
      const catalog = await loadEmbeddedTuiModelCatalog(cfg);
      thinkingLevel = resolveThinkingDefault({
        cfg,
        provider: resolvedSessionModel.provider,
        model: resolvedSessionModel.model,
        catalog,
      });
    }
    const defaults = getSessionDefaults(cfg, void 0, { allowPluginNormalization: false });
    const sessionInfo = buildGatewaySessionInfo({
      cfg,
      storePath,
      store,
      key: canonicalKey,
      entry,
      agentId: opts.agentId,
    });
    sessionInfo.thinkingLevel = thinkingLevel;
    sessionInfo.verboseLevel = entry?.verboseLevel ?? cfg.agents?.defaults?.verboseDefault;
    return {
      sessionKey: opts.sessionKey,
      sessionId,
      messages,
      defaults,
      sessionInfo,
      thinkingLevel,
      fastMode: entry?.fastMode,
      verboseLevel: sessionInfo.verboseLevel,
      runtimePluginsPrewarm,
    };
  }
  async listSessions(opts) {
    await this.ready;
    const cfg = getRuntimeConfig();
    const { storePath, store } = loadCombinedSessionStoreForGateway(cfg, {
      agentId: opts?.agentId,
    });
    return await listSessionsFromStoreAsync({
      cfg,
      storePath,
      store,
      opts: opts ?? {},
    });
  }
  async listAgents() {
    return listAgentsForGateway(getRuntimeConfig());
  }
  async patchSession(opts) {
    await this.ready;
    const cfg = getRuntimeConfig();
    const target = resolveGatewaySessionStoreTarget({
      cfg,
      key: opts.key,
      agentId: opts.agentId,
    });
    const applied = await applySessionPatchProjection({
      storePath: target.storePath,
      resolveTarget: ({ entries }) => {
        const store = Object.fromEntries(
          entries.map(({ sessionKey, entry }) => [sessionKey, entry]),
        );
        const { target: migratedTarget, primaryKey } = migrateAndPruneGatewaySessionStoreKey({
          cfg,
          key: opts.key,
          store,
          agentId: opts.agentId,
        });
        return {
          primaryKey,
          candidateKeys: migratedTarget.storeKeys,
        };
      },
      project: async ({ primaryKey, existingEntry, entries }) =>
        await projectSessionsPatchEntry({
          cfg,
          entries,
          existingEntry,
          storeKey: primaryKey,
          agentId: opts.agentId,
          patch: opts,
          loadGatewayModelCatalog: () => loadEmbeddedTuiModelCatalog(cfg),
        }),
    });
    if (!applied.ok) throw new Error(applied.error.message);
    const agentId = resolveSessionAgentId({
      sessionKey: target.canonicalKey ?? opts.key,
      config: cfg,
      agentId: opts.agentId,
    });
    const resolved = resolveSessionModelRef(cfg, applied.entry, agentId);
    return {
      ok: true,
      path: target.storePath,
      key: target.canonicalKey ?? opts.key,
      entry: applied.entry,
      resolved: {
        modelProvider: resolved.provider,
        model: resolved.model,
      },
    };
  }
  async resetSession(key, reason, opts) {
    await this.ready;
    const result = await performGatewaySessionReset({
      key,
      ...(opts?.agentId ? { agentId: opts.agentId } : {}),
      reason: reason === "new" ? "new" : "reset",
      commandSource: "tui:embedded",
    });
    if (!result.ok) throw new Error(result.error.message);
    return {
      ok: true,
      key: result.key,
      entry: result.entry,
      resolved: result.resolved,
    };
  }
  async createSession(opts) {
    await this.ready;
    const cfg = getRuntimeConfig();
    const result = await createGatewaySession({
      cfg,
      ...opts,
      emitCommandHooks: Boolean(opts.parentSessionKey),
      commandSource: "tui:embedded",
      loadGatewayModelCatalog: () => loadEmbeddedTuiModelCatalog(cfg),
    });
    if (!result.ok) throw new Error(result.error.message);
    return {
      ok: true,
      key: result.key,
      entry: result.entry,
      resolved: result.resolved,
    };
  }
  async runBtwTurn(params) {
    const loadOptions = params.agentId ? { agentId: params.agentId } : void 0;
    const { cfg, canonicalKey, storePath, store, entry } = loadSessionEntry(
      params.sessionKey,
      loadOptions,
    );
    if (!entry?.sessionId)
      throw new Error("/btw requires an active session with existing context.");
    const sessionAgentId = resolveSessionAgentId({
      sessionKey: canonicalKey,
      config: cfg,
      agentId: params.agentId,
    });
    const resolvedModel = resolveSessionModelRef(cfg, entry, sessionAgentId);
    const timeoutSeconds = timeoutSecondsFromMs(params.timeoutMs);
    const { runBtwSideQuestion } = await import("./btw-CBL7SbwR.js");
    const reply = await runBtwSideQuestion({
      cfg,
      agentDir: resolveAgentDir(cfg, sessionAgentId),
      provider: resolvedModel.provider,
      model: resolvedModel.model,
      question: params.question,
      sessionEntry: entry,
      sessionStore: store,
      sessionKey: canonicalKey,
      storePath,
      resolvedThinkLevel: "off",
      resolvedReasoningLevel: "off",
      opts: {
        runId: params.runId,
        abortSignal: params.controller.signal,
        ...(timeoutSeconds !== void 0 ? { timeoutOverrideSeconds: Number(timeoutSeconds) } : {}),
      },
      isNewSession: false,
      messageChannel: INTERNAL_MESSAGE_CHANNEL,
      messageProvider: INTERNAL_MESSAGE_CHANNEL,
      currentChannelId: INTERNAL_MESSAGE_CHANNEL,
    });
    const text = reply?.text?.trim() ?? "";
    if (!text) throw new Error("/btw produced no answer.");
    return {
      sessionKey: canonicalKey,
      text,
      isError: reply?.isError === true,
    };
  }
  async getGatewayStatus() {
    return `local embedded mode${this.runs.size > 0 ? ` (${String(this.runs.size)} active run${this.runs.size === 1 ? "" : "s"})` : ""}`;
  }
  async listPluginApprovals() {
    return this.pluginApprovalBroker.listPending();
  }
  async resolvePluginApproval(id, decision) {
    return { ok: this.pluginApprovalBroker.resolve(id, decision) };
  }
  async listModels() {
    const cfg = getRuntimeConfig();
    const catalog = await loadEmbeddedTuiModelCatalog(cfg);
    const { allowedCatalog } = buildAllowedModelSet({
      cfg,
      catalog,
      defaultProvider: DEFAULT_PROVIDER,
    });
    return (allowedCatalog.length > 0 ? allowedCatalog : catalog).map((entry) => ({
      id: entry.id,
      name: entry.name ?? entry.id,
      provider: entry.provider,
      contextWindow: entry.contextWindow,
      reasoning: entry.reasoning,
    }));
  }
  async runGoalCommand(opts) {
    await this.ready;
    const loadOptions = opts.agentId ? { agentId: opts.agentId } : void 0;
    const { canonicalKey, storePath, entry } = loadSessionEntry(opts.sessionKey, loadOptions);
    const sessionKey = canonicalKey ?? opts.sessionKey;
    const parsed = parseGoalCommand(opts.command.trim());
    if (!parsed) throw new Error("invalid goal command");
    switch (parsed.action) {
      case "status":
        return {
          text: formatSessionGoalStatus(
            (
              await getSessionGoal({
                sessionKey,
                storePath,
              })
            ).goal,
          ),
        };
      case "start":
      case "set":
      case "create": {
        const objective = parsed.text.trim();
        if (!objective) return { text: "Usage: /goal start <objective>" };
        return {
          text: `Goal started: ${
            (
              await createSessionGoal({
                sessionKey,
                storePath,
                objective,
                fallbackEntry: entry ?? {
                  sessionId: randomUUID(),
                  updatedAt: Date.now(),
                },
                actor: { type: "human" },
                agentId: opts.agentId,
              })
            ).objective
          }`,
        };
      }
      case "edit": {
        const objective = parsed.text.trim();
        if (!objective) return { text: "Usage: /goal edit <objective>" };
        return {
          text: `Goal updated: ${
            (
              await updateSessionGoalObjective({
                sessionKey,
                storePath,
                objective,
                actor: { type: "human" },
                agentId: opts.agentId,
              })
            ).objective
          }`,
        };
      }
      case "pause":
        return {
          text: `Goal paused: ${
            (
              await updateSessionGoalStatus({
                sessionKey,
                storePath,
                status: "paused",
                actor: { type: "human" },
                agentId: opts.agentId,
                ...(parsed.text ? { note: parsed.text } : {}),
              })
            ).objective
          }`,
        };
      case "resume":
        return {
          text: `Goal resumed: ${
            (
              await updateSessionGoalStatus({
                sessionKey,
                storePath,
                status: "active",
                actor: { type: "human" },
                agentId: opts.agentId,
                ...(parsed.text ? { note: parsed.text } : {}),
              })
            ).objective
          }`,
        };
      case "complete":
      case "done": {
        const goal = await updateSessionGoalStatus({
          sessionKey,
          storePath,
          status: "complete",
          actor: { type: "human" },
          agentId: opts.agentId,
          ...(parsed.text ? { note: parsed.text } : {}),
        });
        return { text: `Goal complete: ${goal.objective}\nTokens used: ${goal.tokensUsed}` };
      }
      case "block":
      case "blocked":
        return {
          text: `Goal blocked: ${
            (
              await updateSessionGoalStatus({
                sessionKey,
                storePath,
                status: "blocked",
                actor: { type: "human" },
                agentId: opts.agentId,
                ...(parsed.text ? { note: parsed.text } : {}),
              })
            ).objective
          }`,
        };
      case "clear":
        return {
          text: (await clearSessionGoal({
            sessionKey,
            storePath,
            actor: { type: "human" },
            agentId: opts.agentId,
          }))
            ? "Goal cleared."
            : "No goal to clear.",
        };
      default:
        return {
          text: "Usage: /goal [status] | /goal start <objective> | /goal edit <objective> | /goal pause|resume|complete|block|clear",
        };
    }
  }
  findQueuedSessionRunPromise(params) {
    let queuedAfter;
    for (const [runId, run] of this.runs)
      if (this.isSameRunScope(run, params) && !run.isBtw) {
        const promise = this.runPromises.get(runId);
        if (promise)
          queuedAfter = {
            run,
            promise,
          };
      }
    return queuedAfter;
  }
  abortSessionRuns(params) {
    for (const [runId, run] of this.runs)
      if (this.isSameRunScope(run, params) && !run.isBtw && this.isAbortableRun(runId, run))
        run.controller.abort();
  }
  hasAbortableSessionRun(params) {
    for (const [runId, run] of this.runs)
      if (this.isSameRunScope(run, params) && !run.isBtw && this.isAbortableRun(runId, run))
        return true;
    return false;
  }
  isSameRunScope(run, params) {
    if (run.sessionKey !== params.sessionKey) return false;
    if (params.sessionKey !== "global") return true;
    return run.agentId === params.agentId;
  }
  isAbortableRun(runId, run) {
    return !run.lifecycleEnded || this.runPromises.has(runId);
  }
  nextSeq() {
    this.seq += 1;
    return this.seq;
  }
  emit(event, payload) {
    this.onEvent?.({
      event,
      payload,
      seq: this.nextSeq(),
    });
  }
  clearPendingLifecycleError(runId) {
    const pending = this.pendingLifecycleErrors.get(runId);
    if (!pending) return;
    clearTimeout(pending);
    this.pendingLifecycleErrors.delete(runId);
  }
  clearPendingLifecycleErrors() {
    for (const pending of this.pendingLifecycleErrors.values()) clearTimeout(pending);
    this.pendingLifecycleErrors.clear();
  }
  scheduleChatError(runId, run, errorMessage) {
    this.clearPendingLifecycleError(runId);
    const timer = setTimeout(() => {
      this.pendingLifecycleErrors.delete(runId);
      this.emitChatError(runId, run, errorMessage);
    }, LIFECYCLE_ERROR_RETRY_GRACE_MS);
    timer.unref?.();
    this.pendingLifecycleErrors.set(runId, timer);
  }
  emitChatDelta(runId, run) {
    const projected = projectLiveAssistantBufferedText(
      normalizeLiveAssistantBufferedText(run.buffer).trim(),
      { suppressLeadFragments: true },
    );
    const text = projected.text.trim();
    if (!text || projected.suppress) return;
    const deltaPayload = resolveDeltaPayload(text, run.lastBroadcastText);
    if (!deltaPayload.deltaText && !deltaPayload.replace) return;
    run.registered = true;
    run.lastBroadcastText = text;
    this.emit("chat", {
      runId,
      sessionKey: run.sessionKey,
      state: "delta",
      ...deltaPayload,
      message: {
        role: "assistant",
        content: [
          {
            type: "text",
            text,
          },
        ],
        timestamp: Date.now(),
      },
    });
  }
  emitChatFinal(runId, run, stopReason) {
    this.clearPendingLifecycleError(runId);
    run.markQueuedRunReady();
    const alreadyFinal = run.finalSent;
    run.finishing = false;
    run.lifecycleEnded = true;
    run.finalSent = true;
    if (alreadyFinal) return;
    run.registered = true;
    run.lastBroadcastText = void 0;
    const projected = projectLiveAssistantBufferedText(
      normalizeLiveAssistantBufferedText(run.buffer).trim(),
      { suppressLeadFragments: false },
    );
    const text = projected.text.trim();
    const shouldIncludeMessage = Boolean(text) && !projected.suppress;
    this.emit("chat", {
      runId,
      sessionKey: run.sessionKey,
      state: "final",
      ...(stopReason ? { stopReason } : {}),
      ...(shouldIncludeMessage
        ? {
            message: {
              role: "assistant",
              content: [
                {
                  type: "text",
                  text,
                },
              ],
              timestamp: Date.now(),
            },
          }
        : {}),
    });
  }
  emitChatAborted(runId, run, errorMessage) {
    this.clearPendingLifecycleError(runId);
    run.markQueuedRunReady();
    const alreadyFinal = run.finalSent;
    run.finishing = false;
    run.lifecycleEnded = true;
    run.finalSent = true;
    if (alreadyFinal) return;
    run.registered = true;
    run.lastBroadcastText = void 0;
    const diagnostic = errorMessage ?? run.toolErrorSummary;
    this.emit("chat", {
      runId,
      sessionKey: run.sessionKey,
      state: "aborted",
      ...(diagnostic ? { errorMessage: diagnostic } : {}),
    });
  }
  emitChatError(runId, run, errorMessage) {
    this.clearPendingLifecycleError(runId);
    run.markQueuedRunReady();
    const alreadyFinal = run.finalSent;
    run.finishing = false;
    run.lifecycleEnded = true;
    run.finalSent = true;
    if (alreadyFinal) return;
    run.registered = true;
    run.lastBroadcastText = void 0;
    this.emit("chat", {
      runId,
      sessionKey: run.sessionKey,
      state: "error",
      ...(errorMessage ? { errorMessage } : {}),
    });
  }
  ensureRunRegistered(runId, run) {
    if (run.registered || run.isBtw) return;
    run.registered = true;
    run.lastBroadcastText = "";
    this.emit("chat", {
      runId,
      sessionKey: run.sessionKey,
      state: "delta",
      deltaText: "",
      message: {
        role: "assistant",
        content: [
          {
            type: "text",
            text: "",
          },
        ],
        timestamp: Date.now(),
      },
    });
  }
  handleAgentEvent(evt) {
    const run = this.runs.get(evt.runId);
    if (!run) return;
    const lifecyclePhase =
      evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : "";
    if (evt.stream !== "lifecycle" || lifecyclePhase !== "error")
      this.clearPendingLifecycleError(evt.runId);
    if (evt.stream !== "assistant") this.ensureRunRegistered(evt.runId, run);
    this.emit("agent", {
      runId: evt.runId,
      stream: evt.stream,
      data: evt.data,
    });
    if (evt.stream === "assistant" || (evt.stream === "tool" && evt.data?.phase === "start"))
      run.toolErrorSummary = void 0;
    else if (evt.stream === "tool" && evt.data?.phase === "result")
      run.toolErrorSummary = readToolValidationErrorSummary(evt.data.toolErrorSummary);
    const assistantLiveChatInput =
      evt.stream === "assistant" ? resolveAssistantLiveChatInput(evt.data) : void 0;
    if (
      assistantLiveChatInput &&
      !run.isBtw &&
      !shouldSuppressAssistantEventForLiveChat(evt.data)
    ) {
      run.buffer = resolveMergedAssistantText({
        previousText: run.buffer,
        nextText: assistantLiveChatInput.text,
        nextDelta: assistantLiveChatInput.delta,
      });
      this.emitChatDelta(evt.runId, run);
      return;
    }
    if (evt.stream !== "lifecycle") return;
    const phase = lifecyclePhase;
    const aborted = evt.data?.aborted === true || run.controller.signal.aborted;
    const toolErrorSummary = readToolValidationErrorSummary(evt.data?.toolErrorSummary);
    if (phase === "finishing") {
      run.finishing = true;
      run.markQueuedRunReady();
      run.lifecycleStopReason =
        typeof evt.data?.stopReason === "string" ? evt.data.stopReason : void 0;
      return;
    }
    if (phase === "end") {
      run.finishing = false;
      if (aborted) {
        this.emitChatAborted(evt.runId, run, toolErrorSummary);
        return;
      }
      run.lifecycleEnded = true;
      run.markQueuedRunReady();
      run.lifecycleStopReason =
        typeof evt.data?.stopReason === "string" ? evt.data.stopReason : void 0;
      return;
    }
    if (phase === "error") {
      run.finishing = false;
      if (aborted) {
        this.emitChatAborted(evt.runId, run, toolErrorSummary);
        return;
      }
      const errorMessage = typeof evt.data?.error === "string" ? evt.data.error : void 0;
      run.buffer = "";
      this.scheduleChatError(evt.runId, run, errorMessage);
    }
  }
  async runTurn(params) {
    try {
      if (params.queuedAfter) {
        try {
          await waitForQueuedLocalRun(params.queuedAfter, params.runId);
        } catch (error) {
          const run = this.runs.get(params.runId);
          if (run) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.emitChatError(
              params.runId,
              run,
              `previous run did not finish cleanly: ${errorMessage}`,
            );
          }
          return;
        }
        if (params.controller.signal.aborted) {
          const run = this.runs.get(params.runId);
          if (run) this.emitChatAborted(params.runId, run);
          return;
        }
      }
      const activeRun = this.runs.get(params.runId);
      if (activeRun?.isBtw && activeRun.question) {
        const result = await this.runBtwTurn({
          runId: params.runId,
          sessionKey: params.sessionKey,
          ...(params.agentId ? { agentId: params.agentId } : {}),
          question: activeRun.question,
          timeoutMs: params.timeoutMs,
          controller: params.controller,
        });
        const run = this.runs.get(params.runId);
        if (!run) return;
        if (params.controller.signal.aborted) {
          this.emitChatAborted(params.runId, run);
          return;
        }
        this.emit("chat.side_result", {
          kind: "btw",
          runId: params.runId,
          sessionKey: result.sessionKey,
          question: run.question,
          text: result.text,
          ...(result.isError ? { isError: true } : {}),
        });
        this.emitChatFinal(params.runId, run);
        return;
      }
      const loadOptions = params.agentId ? { agentId: params.agentId } : void 0;
      const { canonicalKey, entry } = loadSessionEntry(params.sessionKey, loadOptions);
      const result = await agentCommandFromIngress(
        {
          message: params.message,
          sessionKey: canonicalKey,
          ...(params.agentId ? { agentId: params.agentId } : {}),
          ...(entry?.sessionId ? { sessionId: entry.sessionId } : {}),
          thinking: params.thinking,
          deliver: params.deliver,
          channel: INTERNAL_MESSAGE_CHANNEL,
          runContext: { messageChannel: INTERNAL_MESSAGE_CHANNEL },
          timeout: timeoutSecondsFromMs(params.timeoutMs),
          runId: params.runId,
          abortSignal: params.controller.signal,
          allowModelOverride: false,
        },
        silentRuntime,
        this.deps,
      );
      const run = this.runs.get(params.runId);
      if (!run) return;
      if (params.controller.signal.aborted || result?.meta?.aborted === true) {
        this.emitChatAborted(params.runId, run);
        return;
      }
      if (run.isBtw) {
        const text = payloadText(result?.payloads);
        if (run.question && text)
          this.emit("chat.side_result", {
            kind: "btw",
            runId: params.runId,
            sessionKey: run.sessionKey,
            question: run.question,
            text,
          });
        this.emitChatFinal(params.runId, run);
        return;
      }
      if (!run.finalSent) {
        const normalizedText = payloadText(result?.payloads);
        if (normalizedText && !run.buffer) run.buffer = normalizedText;
        const stopReason =
          run.lifecycleStopReason ??
          (typeof result?.meta?.stopReason === "string" ? result.meta.stopReason : void 0);
        this.emitChatFinal(params.runId, run, stopReason);
      }
    } catch (error) {
      const run = this.runs.get(params.runId);
      if (!run) return;
      if (params.controller.signal.aborted) {
        this.emitChatAborted(params.runId, run);
        return;
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.emitChatError(params.runId, run, errorMessage);
    } finally {
      this.runs.get(params.runId)?.markQueuedRunReady();
      this.runs.delete(params.runId);
    }
  }
};
//#endregion
export { EmbeddedTuiBackend };
