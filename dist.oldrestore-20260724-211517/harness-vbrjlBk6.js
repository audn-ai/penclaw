//#region extensions/codex/harness.ts
const DEFAULT_CODEX_HARNESS_PROVIDER_IDS = /* @__PURE__ */ new Set(["codex", "openai"]);
const SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER = Symbol.for("openclaw.codexAppServerClientDisposer");
const CODEX_APP_SERVER_CONTEXT_ENGINE_HOST_CAPABILITIES = [
  "bootstrap",
  "assemble-before-prompt",
  "after-turn",
  "maintain",
  "compact",
  "runtime-llm-complete",
  "thread-bootstrap-projection",
];
async function disposeSharedCodexAppServerClients() {
  const dispose = globalThis[SHARED_CODEX_APP_SERVER_CLIENT_DISPOSER];
  await dispose?.();
}
/**
 * Creates the Codex app-server harness used for attempts, side questions,
 * compaction, reset, and disposal.
 */
function createCodexAppServerAgentHarness(options) {
  const harnessRuntimeId = options?.id ?? "codex";
  const normalizedHarnessRuntimeId = harnessRuntimeId.trim().toLowerCase();
  const providerIds = new Set(
    [...(options?.providerIds ?? DEFAULT_CODEX_HARNESS_PROVIDER_IDS)].map((id) =>
      id.trim().toLowerCase(),
    ),
  );
  return {
    id: harnessRuntimeId,
    label: options?.label ?? "Codex agent harness",
    delegatedExecutionPluginIds: ["voice-call"],
    contextEngineHostCapabilities: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST_CAPABILITIES,
    deliveryDefaults: { sourceVisibleReplies: "message_tool" },
    authBootstrap: "harness",
    authBinding: {
      fingerprint: async (params) => {
        const { fingerprintCodexAppServerAuthBinding } = await import("./auth-binding-BVMeY7iZ.js");
        return fingerprintCodexAppServerAuthBinding(params);
      },
    },
    runtimeArtifact: {
      validate: async (binding) => {
        const { validateCodexAppServerRuntimeArtifact } =
          await import("./runtime-artifact-BF9V7baL.js");
        return validateCodexAppServerRuntimeArtifact(binding);
      },
    },
    supports: (ctx) => {
      const provider = ctx.provider.trim().toLowerCase();
      if (!providerIds.has(provider))
        return {
          supported: false,
          reason: `provider is not one of: ${[...providerIds].toSorted().join(", ")}`,
        };
      if (ctx.modelProvider?.requestTransportOverrides === "present")
        return {
          supported: false,
          reason: "Codex cannot reproduce authored request transport overrides",
        };
      const preparedAuth = ctx.modelProvider?.preparedAuth;
      const runtimePolicy = ctx.modelProvider?.runtimePolicy;
      if (runtimePolicy) {
        if (
          !runtimePolicy.compatibleIds.some(
            (id) => id.trim().toLowerCase() === normalizedHarnessRuntimeId,
          )
        )
          return {
            supported: false,
            reason: "Codex cannot reproduce the prepared provider route",
          };
      } else if (ctx.modelProvider && provider !== "codex")
        return {
          supported: false,
          reason: "provider route compatibility with Codex is not declared",
        };
      if (preparedAuth?.requirement === "subscription") {
        if (
          !(
            preparedAuth.source === "profile" &&
            (preparedAuth.mode === "oauth" || preparedAuth.mode === "token")
          )
        )
          return {
            supported: false,
            reason: "Codex subscription auth requires a prepared OAuth or token profile",
          };
      } else if (preparedAuth?.requirement === "api-key") {
        if (
          !(
            preparedAuth.source !== "none" &&
            preparedAuth.source !== "harness" &&
            (preparedAuth.mode === "api-key" || preparedAuth.mode === "api_key")
          )
        )
          return {
            supported: false,
            reason: "Codex Platform auth requires a prepared API key",
          };
      }
      return {
        supported: true,
        priority: 100,
      };
    },
    runAttempt: async (params) => {
      const { runCodexAppServerAttempt } = await import("./run-attempt-BkafXK38.js");
      return runCodexAppServerAttempt(params, {
        bindingStore: options.bindingStore,
        pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
        nativeHookRelay: { enabled: true },
      });
    },
    runSideQuestion: async (params) => {
      const { runCodexAppServerSideQuestion } = await import("./side-question-BDlMcasz.js");
      return runCodexAppServerSideQuestion(params, {
        bindingStore: options.bindingStore,
        pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
        nativeHookRelay: { enabled: true },
      });
    },
    compact: async (params) => {
      const { maybeCompactCodexAppServerSession } = await import("./compact-CnSY_HYf.js");
      return maybeCompactCodexAppServerSession(params, {
        bindingStore: options.bindingStore,
        pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
      });
    },
    compactAfterContextEngine: async (params) => {
      const { maybeCompactCodexAppServerSession } = await import("./compact-CnSY_HYf.js");
      return maybeCompactCodexAppServerSession(params, {
        bindingStore: options.bindingStore,
        pluginConfig: options?.resolvePluginConfig?.() ?? options?.pluginConfig,
        allowNonManualNativeRequest: true,
      });
    },
    reset: async (params) => {
      if (params.sessionId) {
        const { reclaimCurrentCodexSessionGeneration, sessionBindingIdentity } =
          await import("./session-binding-C8Ve8W4V.js");
        const identity = sessionBindingIdentity({
          agentId: params.agentId,
          sessionId: params.sessionId,
          sessionKey: params.sessionKey,
        });
        let retired = await options.bindingStore.retireSessionGeneration(identity);
        if (retired === "conflict") {
          if (
            await reclaimCurrentCodexSessionGeneration({
              bindingStore: options.bindingStore,
              identity,
              config: options.resolveConfig?.(),
            })
          )
            retired = await options.bindingStore.retireSessionGeneration(identity);
        }
        if (retired === "conflict")
          throw new Error(
            `Codex binding generation changed before session ${params.sessionId} could reset`,
          );
      }
    },
    dispose: disposeSharedCodexAppServerClients,
  };
}
//#endregion
export { createCodexAppServerAgentHarness as t };
