import { randomUUID } from "node:crypto";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
//#region src/commands/onboard-remote-gateway.ts
const GATEWAY_SETUP_DETECT_TIMEOUT_MS = 2e4;
const GATEWAY_SETUP_ACTIVATE_TIMEOUT_MS = 15e4;
const GATEWAY_CODEX_SETUP_ACTIVATE_TIMEOUT_MS = 48e4;
const GATEWAY_SETUP_VERIFY_TIMEOUT_MS = 3e4;
const GATEWAY_CRESTODIAN_CHAT_TIMEOUT_MS = 19e4;
function toSetupInferenceDetection(result) {
  return {
    candidates: result.candidates.map((candidate) => ({
      kind: candidate.kind,
      label: candidate.label,
      detail: candidate.detail,
      modelRef: candidate.modelRef,
      recommended: false,
      ...(candidate.credentials !== void 0 ? { credentials: candidate.credentials } : {}),
    })),
    manualProviders: result.manualProviders.map((provider) => ({
      id: provider.id,
      label: provider.label,
      ...(provider.hint !== void 0 ? { hint: provider.hint } : {}),
    })),
    authOptions: (result.authOptions ?? []).map((option) =>
      Object.assign(
        {
          id: option.id,
          label: option.label,
          kind: option.kind,
          featured: option.featured,
        },
        option.hint !== void 0 ? { hint: option.hint } : {},
        option.groupLabel !== void 0 ? { groupLabel: option.groupLabel } : {},
      ),
    ),
    workspace: result.workspace,
    ...(result.configuredModel !== void 0 ? { configuredModel: result.configuredModel } : {}),
    setupComplete: result.setupComplete,
  };
}
function isSetupInferenceFailureStatus(value) {
  return (
    value === "auth" ||
    value === "rate_limit" ||
    value === "billing" ||
    value === "timeout" ||
    value === "format" ||
    value === "unavailable" ||
    value === "unknown"
  );
}
function toSetupInferenceActivationResult(result) {
  if (result.ok) {
    if (
      !result.modelRef?.trim() ||
      typeof result.latencyMs !== "number" ||
      !Array.isArray(result.lines)
    )
      throw new Error("Gateway returned an invalid successful inference activation result.");
    return {
      ok: true,
      modelRef: result.modelRef,
      latencyMs: result.latencyMs,
      lines: result.lines,
    };
  }
  if (!isSetupInferenceFailureStatus(result.status) || !result.error?.trim())
    throw new Error("Gateway returned an invalid failed inference activation result.");
  return {
    ok: false,
    status: result.status,
    error: result.error,
  };
}
function activationTimeoutMs(kind) {
  return kind === "codex-cli"
    ? GATEWAY_CODEX_SETUP_ACTIVATE_TIMEOUT_MS
    : GATEWAY_SETUP_ACTIVATE_TIMEOUT_MS;
}
function bindGatewayConfig(target) {
  return {
    ...target.config,
    gateway: {
      ...target.config.gateway,
      mode: "remote",
      remote: {
        ...target.config.gateway?.remote,
        url: target.gatewayUrl,
      },
    },
  };
}
function assertVerifiedActivation(params) {
  if (
    params.requestedModelRef &&
    params.activation.modelRef.trim() !== params.requestedModelRef.trim()
  )
    throw new Error(
      `Gateway activated ${params.activation.modelRef}, not the selected ${params.requestedModelRef}.`,
    );
  if (!params.verification.ok)
    throw new Error(`Gateway inference verification failed: ${params.verification.error}`);
  if (params.verification.modelRef.trim() !== params.activation.modelRef.trim())
    throw new Error(
      `Gateway verified ${params.verification.modelRef}, not the activated ${params.activation.modelRef}.`,
    );
}
/**
 * Configure missing inference on the selected remote Gateway, then let that
 * Gateway's Crestodian finish setup before handing off to its normal TUI.
 * The local config is routing input only; every setup mutation runs through
 * Gateway RPC.
 */
async function runRemoteGatewayInferenceOnboarding(target, runtime = defaultRuntime, deps = {}) {
  const callGateway = deps.callGateway ?? (await import("./call-BtFiTrFI.js")).callGatewayCli;
  const runGuidedOnboarding =
    deps.runGuidedOnboarding ?? (await import("./onboard-guided-CDtimzmP.js")).runGuidedOnboarding;
  const boundConfig = bindGatewayConfig(target);
  const explicitAuth = Boolean(target.token || target.password);
  let gatewayWorkspace;
  const request = async (params) =>
    await callGateway({
      config: boundConfig,
      ...(explicitAuth ? { url: target.gatewayUrl } : {}),
      ...(target.token ? { token: target.token } : {}),
      ...(target.password ? { password: target.password } : {}),
      ...(target.tlsFingerprint ? { tlsFingerprint: target.tlsFingerprint } : {}),
      ignoreEnvUrlOverride: true,
      method: params.method,
      params: params.payload,
      timeoutMs: params.timeoutMs,
    });
  const detect = async () => {
    const detection = toSetupInferenceDetection(
      await request({
        method: "crestodian.setup.detect",
        payload: {},
        timeoutMs: GATEWAY_SETUP_DETECT_TIMEOUT_MS,
      }),
    );
    gatewayWorkspace = detection.workspace;
    return detection;
  };
  const activate = async (params) => {
    const activation = toSetupInferenceActivationResult(
      await request({
        method: "crestodian.setup.activate",
        payload: {
          kind: params.kind,
          ...(params.modelRef !== void 0 ? { modelRef: params.modelRef } : {}),
          ...(params.authChoice !== void 0 ? { authChoice: params.authChoice } : {}),
          ...(params.apiKey !== void 0 ? { apiKey: params.apiKey } : {}),
          ...(gatewayWorkspace ? { workspace: gatewayWorkspace } : {}),
        },
        timeoutMs: activationTimeoutMs(params.kind),
      }),
    );
    if (!activation.ok) return activation;
    assertVerifiedActivation({
      activation,
      verification: await request({
        method: "crestodian.setup.verify",
        payload: {},
        timeoutMs: GATEWAY_SETUP_VERIFY_TIMEOUT_MS,
      }),
      ...(params.modelRef ? { requestedModelRef: params.modelRef } : {}),
    });
    return activation;
  };
  await runGuidedOnboarding({}, runtime, {
    detect,
    activate,
    ...(deps.createPrompter ? { createPrompter: deps.createPrompter } : {}),
    runCrestodianChat: async () => {
      const prompter = await (deps.createPrompter?.() ??
        import("./clack-prompter-D6U6Ry1K.js").then(({ createClackPrompter }) =>
          createClackPrompter(),
        ));
      await prompter.intro("Crestodian");
      const sessionId = randomUUID();
      let reply = await request({
        method: "crestodian.chat",
        payload: {
          sessionId,
          welcomeVariant: "onboarding",
        },
        timeoutMs: GATEWAY_CRESTODIAN_CHAT_TIMEOUT_MS,
      });
      try {
        for (;;) {
          await prompter.note(reply.reply, "Crestodian");
          if (reply.action === "exit") {
            await prompter.outro("Crestodian setup finished.");
            return;
          }
          if (reply.action === "open-agent") {
            await prompter.outro("Opening your agent…");
            break;
          }
          const message = await prompter.text({
            message: "Reply to Crestodian",
            ...(reply.sensitive ? { sensitive: true } : {}),
            validate: (value) => (value.trim() ? void 0 : "Required"),
          });
          reply = await request({
            method: "crestodian.chat",
            payload: {
              sessionId,
              message,
            },
            timeoutMs: GATEWAY_CRESTODIAN_CHAT_TIMEOUT_MS,
          });
        }
      } catch (error) {
        if (error instanceof WizardCancelledError) {
          await prompter.outro("Crestodian setup paused.");
          return;
        }
        throw error;
      }
      await (deps.runTui ?? (await import("./tui-BHinJXPT.js")).runTui)({
        config: boundConfig,
        deliver: false,
        boundGateway: {
          url: target.gatewayUrl,
          ...(target.token ? { token: target.token } : {}),
          ...(target.password ? { password: target.password } : {}),
          ...(target.tlsFingerprint ? { tlsFingerprint: target.tlsFingerprint } : {}),
        },
      });
    },
  });
}
//#endregion
export { runRemoteGatewayInferenceOnboarding };
