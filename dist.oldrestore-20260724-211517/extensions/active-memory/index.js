import {
  a as normalizePluginConfig,
  d as setMinimumTimeoutMsForTests,
  f as setSetupGraceTimeoutMsForTests,
  i as isMissingRegisteredMemoryToolsError,
  r as hasDeprecatedModelFallbackPolicy,
  s as resetActiveMemoryConfigForTests,
} from "../../config-DSPNikPv.js";
import { n as resolveLivePluginConfigObject } from "../../plugin-config-runtime-ef53THzv.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { n as buildPromptPrefix, t as buildMetadata } from "../../prompt-CFlUxlid.js";
import {
  n as buildSearchQuery,
  r as extractRecentTurns,
  t as buildQuery,
} from "../../query-DX527y0q.js";
import { t as maybeResolveActiveRecall } from "../../recall-BGXARUES.js";
import {
  a as isCircuitBreakerOpen,
  d as shouldCacheResult,
  f as toSingleLineLogValue,
  i as getCircuitBreakerEntry,
  n as buildCircuitBreakerKey,
  r as getCachedResult,
  s as resetActiveRecallStateForTests,
  t as buildCacheKey,
  u as setCachedResult,
} from "../../recall-state-BtFV2Jn8.js";
import {
  i as resolveCanonicalSessionKeyFromSessionId,
  n as buildPluginStatusLine,
  o as resolveStatusUpdateAgentId,
  r as persistPluginStatusLines,
} from "../../session-BHzzCQEf.js";
import {
  a as isAllowedChatType,
  c as isSessionActiveMemoryDisabled,
  d as setSessionActiveMemoryDisabled,
  f as shouldSkipActiveMemoryForHarnessSession,
  i as isAllowedChatId,
  l as lacksAdminToMutateActiveMemoryGlobal,
  n as formatActiveMemoryCommandHelp,
  o as isEligibleInteractiveSession,
  p as updateActiveMemoryGlobalEnabledInConfig,
  r as isActiveMemoryGloballyEnabled,
  s as isEnabledForAgent,
  t as ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT,
  u as resolveCommandSessionKey,
} from "../../session-policy-CEh095m2.js";
import {
  s as hasUsableMemoryResultInSessionRecord,
  t as createActiveMemoryHookDeadline,
} from "../../transcript-Dzo9636l.js";
import {
  a as readPartialAssistantText,
  c as resetActiveMemoryTranscriptForTests,
  l as setTimeoutPartialDataGraceMsForTests,
} from "../../transcript-result-CGTBO0My.js";
import { t as readActiveMemorySearchDebug } from "../../transcript-watch-BDDL56fg.js";
import {
  I as MAX_SETUP_GRACE_TIMEOUT_MS,
  L as MAX_TIMEOUT_MS,
  j as HOOK_TIMEOUT_RECOVERY_GRACE_MS,
} from "../../types-gz2L16qk.js";
//#region extensions/active-memory/index.ts
/** Plugin entry registering Active Memory hooks, tools, config schema, and doctor cleanup. */
var active_memory_default = definePluginEntry({
  id: "active-memory",
  name: "Active Memory",
  description: "Proactively surfaces relevant memory before eligible conversational replies.",
  register(api) {
    const readCurrentConfig = () => {
      try {
        return api.runtime.config?.current?.() ?? api.config;
      } catch {
        return api.config;
      }
    };
    let config = normalizePluginConfig(api.pluginConfig, readCurrentConfig());
    const warnDeprecatedModelFallbackPolicy = (pluginConfig) => {
      if (hasDeprecatedModelFallbackPolicy(pluginConfig))
        api.logger.warn?.(
          "active-memory: config.modelFallbackPolicy is deprecated and no longer changes runtime behavior. config.modelFallback is a chain-resolution last-resort (consulted only when config.model, the current run's model, and the agent's configured default all resolve to nothing) — it is NOT a runtime failover that substitutes a different model when the resolved model errors out.",
        );
    };
    warnDeprecatedModelFallbackPolicy(api.pluginConfig);
    const refreshLiveConfigFromRuntime = () => {
      const livePluginConfig = resolveLivePluginConfigObject(
        api.runtime.config?.current ? () => api.runtime.config.current() : void 0,
        "active-memory",
        api.pluginConfig,
      );
      config = normalizePluginConfig(livePluginConfig ?? { enabled: false }, readCurrentConfig());
      if (livePluginConfig) warnDeprecatedModelFallbackPolicy(livePluginConfig);
    };
    api.registerCommand({
      name: "active-memory",
      description: "Enable, disable, or inspect Active Memory for this session.",
      acceptsArgs: true,
      exposeSenderIsOwner: true,
      handler: async (ctx) => {
        const tokens = ctx.args?.trim().split(/\s+/).filter(Boolean) ?? [];
        const isGlobal = tokens.includes("--global");
        const action = (tokens.find((token) => token !== "--global") ?? "status").toLowerCase();
        if (action === "help") return { text: formatActiveMemoryCommandHelp() };
        if (isGlobal) {
          const currentConfig = api.runtime.config.current();
          if (action === "status")
            return {
              text: `Active Memory: ${isActiveMemoryGloballyEnabled(currentConfig) ? "on" : "off"} globally.`,
            };
          if (
            lacksAdminToMutateActiveMemoryGlobal({
              senderIsOwner: ctx.senderIsOwner,
              gatewayClientScopes: ctx.gatewayClientScopes,
            })
          )
            return { text: ACTIVE_MEMORY_GLOBAL_MUTATION_ADMIN_REQUIRED_TEXT };
          if (action === "on" || action === "enable" || action === "enabled") {
            await api.runtime.config.mutateConfigFile({
              afterWrite: { mode: "auto" },
              mutate: (draft) => {
                const nextConfig = updateActiveMemoryGlobalEnabledInConfig(draft, true);
                Object.assign(draft, nextConfig);
              },
            });
            refreshLiveConfigFromRuntime();
            return { text: "Active Memory: on globally." };
          }
          if (action === "off" || action === "disable" || action === "disabled") {
            await api.runtime.config.mutateConfigFile({
              afterWrite: { mode: "auto" },
              mutate: (draft) => {
                const nextConfig = updateActiveMemoryGlobalEnabledInConfig(draft, false);
                Object.assign(draft, nextConfig);
              },
            });
            refreshLiveConfigFromRuntime();
            return { text: "Active Memory: off globally." };
          }
        }
        const sessionKey = resolveCommandSessionKey({
          api,
          config,
          sessionKey: ctx.sessionKey,
          sessionId: ctx.sessionId,
        });
        if (!sessionKey)
          return {
            text: "Active Memory: session toggle unavailable because this command has no session context.",
          };
        const commandAgentId = resolveStatusUpdateAgentId({ sessionKey });
        if (!isEnabledForAgent(config, commandAgentId))
          return { text: "Active Memory: off for this session." };
        if (action === "status")
          return {
            text: `Active Memory: ${
              (await isSessionActiveMemoryDisabled({
                api,
                sessionKey,
              }))
                ? "off"
                : "on"
            } for this session.`,
          };
        if (action === "on" || action === "enable" || action === "enabled") {
          await setSessionActiveMemoryDisabled({
            api,
            sessionKey,
            disabled: false,
          });
          return { text: "Active Memory: on for this session." };
        }
        if (action === "off" || action === "disable" || action === "disabled") {
          await setSessionActiveMemoryDisabled({
            api,
            sessionKey,
            disabled: true,
          });
          await persistPluginStatusLines({
            api,
            agentId: resolveStatusUpdateAgentId({ sessionKey }),
            sessionKey,
          });
          return { text: "Active Memory: off for this session." };
        }
        return {
          text: `Unknown Active Memory action: ${action}\n\n${formatActiveMemoryCommandHelp()}`,
        };
      },
    });
    const beforePromptBuildTimeoutMs =
      MAX_TIMEOUT_MS + MAX_SETUP_GRACE_TIMEOUT_MS + HOOK_TIMEOUT_RECOVERY_GRACE_MS * 2;
    api.on(
      "before_prompt_build",
      async (event, ctx) => {
        refreshLiveConfigFromRuntime();
        const invocationConfig = config;
        const liveRecallTimeoutMs =
          invocationConfig.timeoutMs +
          invocationConfig.setupGraceTimeoutMs +
          HOOK_TIMEOUT_RECOVERY_GRACE_MS;
        const deadlineController = new AbortController();
        const hookDeadline = createActiveMemoryHookDeadline();
        const armHookDeadline = (timeoutMs, phase) => {
          hookDeadline.arm(timeoutMs, () => {
            deadlineController.abort(
              /* @__PURE__ */ new Error(`active-memory ${phase} timeout after ${timeoutMs}ms`),
            );
            api.logger.warn?.(
              `active-memory: before_prompt_build ${phase} timed out after ${String(timeoutMs)}ms; skipping memory lookup`,
            );
          });
        };
        armHookDeadline(HOOK_TIMEOUT_RECOVERY_GRACE_MS, "preflight");
        const handlerPromise = (async () => {
          try {
            const resolvedAgentId = resolveStatusUpdateAgentId(ctx);
            const resolvedSessionKey =
              ctx.sessionKey?.trim() ||
              (resolvedAgentId
                ? resolveCanonicalSessionKeyFromSessionId({
                    api,
                    agentId: resolvedAgentId,
                    sessionId: ctx.sessionId,
                  })
                : void 0);
            const effectiveAgentId =
              resolvedAgentId || resolveStatusUpdateAgentId({ sessionKey: resolvedSessionKey });
            if (
              shouldSkipActiveMemoryForHarnessSession({
                api,
                agentId: effectiveAgentId,
                sessionKey: resolvedSessionKey,
              })
            )
              return;
            const sessionDisabled = await isSessionActiveMemoryDisabled({
              api,
              sessionKey: resolvedSessionKey,
            });
            deadlineController.signal.throwIfAborted();
            if (sessionDisabled) {
              await persistPluginStatusLines({
                api,
                agentId: effectiveAgentId,
                sessionKey: resolvedSessionKey,
              });
              return;
            }
            if (!isEnabledForAgent(invocationConfig, effectiveAgentId)) {
              await persistPluginStatusLines({
                api,
                agentId: effectiveAgentId,
                sessionKey: resolvedSessionKey,
              });
              return;
            }
            if (
              !isEligibleInteractiveSession({
                ...ctx,
                sessionKey: resolvedSessionKey ?? ctx.sessionKey,
              })
            ) {
              await persistPluginStatusLines({
                api,
                agentId: effectiveAgentId,
                sessionKey: resolvedSessionKey,
              });
              return;
            }
            if (
              !isAllowedChatType(invocationConfig, {
                ...ctx,
                sessionKey: resolvedSessionKey ?? ctx.sessionKey,
                mainKey: api.config.session?.mainKey,
              })
            ) {
              await persistPluginStatusLines({
                api,
                agentId: effectiveAgentId,
                sessionKey: resolvedSessionKey,
              });
              return;
            }
            if (
              !isAllowedChatId(invocationConfig, {
                sessionKey: resolvedSessionKey ?? ctx.sessionKey,
                messageProvider: ctx.messageProvider,
              })
            ) {
              await persistPluginStatusLines({
                api,
                agentId: effectiveAgentId,
                sessionKey: resolvedSessionKey,
              });
              return;
            }
            const recentTurns = extractRecentTurns(event.messages);
            const query = buildQuery({
              latestUserMessage: event.prompt,
              recentTurns,
              config: invocationConfig,
            });
            const searchQuery = buildSearchQuery({
              latestUserMessage: event.prompt,
              recentTurns,
            });
            armHookDeadline(liveRecallTimeoutMs, "recall");
            const result = await maybeResolveActiveRecall({
              api,
              config: invocationConfig,
              agentId: effectiveAgentId,
              sessionKey: resolvedSessionKey,
              sessionId: ctx.sessionId,
              messageProvider: ctx.messageProvider,
              channelId: ctx.channelId,
              query,
              searchQuery,
              currentModelProviderId: ctx.modelProviderId,
              currentModelId: ctx.modelId,
              abortSignal: deadlineController.signal,
            });
            deadlineController.signal.throwIfAborted();
            if (!result.summary) return;
            const promptPrefix = buildPromptPrefix(result.summary);
            if (!promptPrefix) return;
            return { prependContext: promptPrefix };
          } catch (error) {
            if (deadlineController.signal.aborted) return;
            const message = toSingleLineLogValue(
              error instanceof Error ? error.message : String(error),
            );
            api.logger.warn?.(
              `active-memory: before_prompt_build failed, skipping memory lookup: ${message}`,
            );
            return;
          }
        })();
        try {
          const result = await Promise.race([handlerPromise, hookDeadline.promise]);
          return typeof result === "symbol" ? void 0 : result;
        } finally {
          hookDeadline.stop();
        }
      },
      { timeoutMs: beforePromptBuildTimeoutMs },
    );
  },
});
const testing = {
  buildSearchQuery,
  buildCacheKey,
  buildCircuitBreakerKey,
  buildMetadata,
  buildPluginStatusLine,
  buildPromptPrefix,
  getCachedResult,
  hasUsableMemoryResultInSessionRecord,
  isCircuitBreakerOpen,
  isMissingRegisteredMemoryToolsError,
  normalizePluginConfig,
  readActiveMemorySearchDebug,
  readPartialAssistantText,
  shouldCacheResult,
  resetActiveRecallCacheForTests() {
    resetActiveRecallStateForTests();
    resetActiveMemoryConfigForTests();
    resetActiveMemoryTranscriptForTests();
  },
  setMinimumTimeoutMsForTests,
  setSetupGraceTimeoutMsForTests,
  setTimeoutPartialDataGraceMsForTests,
  setCachedResult,
  getCircuitBreakerEntry,
};
//#endregion
export { testing as __testing, testing, active_memory_default as default };
