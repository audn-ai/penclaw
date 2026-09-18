import { t as CrestodianChatEngine } from "./chat-engine-C5mxheoh.js";
import {
  h as setCommandLaneConcurrency,
  r as enqueueCommandInLane,
} from "./command-queue-CVn1dJsm.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { n as isCrestodianInferenceUnavailableError } from "./inference-error-FHRbX8O-.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { t as buildOnboardingWelcome } from "./onboarding-welcome-Dk10Yeht.js";
import { r as formatCrestodianStartupMessage } from "./overview-DfQOIIFh.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as WizardSession } from "./session-BDeUy4HN.js";
import {
  $ as validateCrestodianSetupDetectParams,
  Q as validateCrestodianSetupAuthStartParams,
  X as validateCrestodianChatParams,
  Z as validateCrestodianSetupActivateParams,
  et as validateCrestodianSetupVerifyParams,
} from "./src-CIJf1lT0.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
//#region src/gateway/server-methods/crestodian.ts
const MAX_CRESTODIAN_SESSIONS = 8;
const PROVIDER_AUTH_SESSION_TIMEOUT_MS = 1500 * 1e3;
const CRESTODIAN_GATEWAY_EXECUTION_KEY = "gateway";
const crestodianGatewayExecutionQueue = new KeyedAsyncQueue();
const crestodianSessionQueues = /* @__PURE__ */ new WeakMap();
function getCrestodianSessionQueue(sessions) {
  let queue = crestodianSessionQueues.get(sessions);
  if (!queue) {
    queue = new KeyedAsyncQueue();
    crestodianSessionQueues.set(sessions, queue);
  }
  return queue;
}
async function runCrestodianGatewayTask(task) {
  setCommandLaneConcurrency("crestodian", Number.MAX_SAFE_INTEGER);
  return await enqueueCommandInLane("crestodian", () =>
    crestodianGatewayExecutionQueue.enqueue(CRESTODIAN_GATEWAY_EXECUTION_KEY, task),
  );
}
let crestodianSetupActivationInProgress = false;
var CrestodianSetupActivationBusyError = class extends Error {};
/** Admit one setup mutation without queueing work past a caller timeout. */
async function runExclusiveCrestodianSetupActivation(task) {
  if (crestodianSetupActivationInProgress)
    throw new CrestodianSetupActivationBusyError(
      "Crestodian setup is already in progress; try again when it finishes.",
    );
  crestodianSetupActivationInProgress = true;
  try {
    return await task();
  } finally {
    crestodianSetupActivationInProgress = false;
  }
}
async function evictOldestSession(sessions) {
  if (sessions.size < MAX_CRESTODIAN_SESSIONS) return;
  let oldestKey;
  let oldestAt = Number.POSITIVE_INFINITY;
  for (const [key, session] of sessions)
    if (session.lastUsedAt < oldestAt) {
      oldestAt = session.lastUsedAt;
      oldestKey = key;
    }
  if (oldestKey !== void 0) {
    await sessions.get(oldestKey)?.engine.dispose();
    sessions.delete(oldestKey);
  }
}
const crestodianHandlers = {
  /** Structured onboarding: list reusable AI access on this host. */
  "crestodian.setup.detect": async ({ params, respond }) => {
    if (
      !assertValidParams(
        params,
        validateCrestodianSetupDetectParams,
        "crestodian.setup.detect",
        respond,
      )
    )
      return;
    await runCrestodianGatewayTask(async () => {
      const { detectSetupInference } = await import("./crestodian/setup-inference.js");
      respond(true, await detectSetupInference(), void 0);
    });
  },
  /** Re-run the exact current default-agent inference route without mutating setup. */
  "crestodian.setup.verify": async ({ params, respond }) => {
    if (
      !assertValidParams(
        params,
        validateCrestodianSetupVerifyParams,
        "crestodian.setup.verify",
        respond,
      )
    )
      return;
    await runCrestodianGatewayTask(async () => {
      const { verifySetupInference } = await import("./crestodian/setup-inference.js");
      respond(true, await verifySetupInference({ runtime: defaultRuntime }), void 0);
    });
  },
  /** Start one provider-owned OAuth/device-code login over the shared wizard transport. */
  "crestodian.setup.auth.start": async ({ params, respond, context }) => {
    if (
      !assertValidParams(
        params,
        validateCrestodianSetupAuthStartParams,
        "crestodian.setup.auth.start",
        respond,
      )
    )
      return;
    if (context.findRunningWizard()) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "wizard already running"));
      return;
    }
    const sessionId = params.sessionId;
    const session = new WizardSession(
      async (prompter, signal) => {
        const result = await runExclusiveCrestodianSetupActivation(async () =>
          runCrestodianGatewayTask(async () => {
            const { activateSetupInference } = await import("./crestodian/setup-inference.js");
            return await activateSetupInference({
              kind: "provider-auth",
              authChoice: params.authChoice,
              ...(params.workspace !== void 0 ? { workspace: params.workspace } : {}),
              surface: "gateway",
              runtime: {
                ...defaultRuntime,
                exit: (code) => {
                  throw new Error(`setup step exited with code ${String(code)}`);
                },
              },
              prompter,
              signal,
              isCancelled: () => signal.aborted,
              onCommitStarted: () => session.lockCancellation(),
            });
          }),
        );
        if (!result.ok) throw new Error(result.error);
      },
      { timeoutMs: PROVIDER_AUTH_SESSION_TIMEOUT_MS },
    );
    context.wizardSessions.set(sessionId, session);
    respond(
      true,
      {
        sessionId,
        done: false,
        status: "running",
      },
      void 0,
    );
  },
  /**
   * Structured onboarding: live-test one candidate and persist it on success.
   * Single-flight per gateway process because testing and persistence span
   * multiple config/plugin mutations. Concurrent callers fail fast instead of
   * queueing work that could outlive their RPC timeout. A failed attempt never
   * commits a broken model, managed plugin install, or setup state.
   */
  "crestodian.setup.activate": async ({ params, respond }) => {
    if (
      !assertValidParams(
        params,
        validateCrestodianSetupActivateParams,
        "crestodian.setup.activate",
        respond,
      )
    )
      return;
    try {
      await runExclusiveCrestodianSetupActivation(async () => {
        await runCrestodianGatewayTask(async () => {
          const { activateSetupInference } = await import("./crestodian/setup-inference.js");
          const runtime = {
            ...defaultRuntime,
            exit: (code) => {
              throw new Error(`setup step exited with code ${String(code)}`);
            },
          };
          respond(
            true,
            await activateSetupInference({
              kind: params.kind,
              ...(params.modelRef !== void 0 ? { modelRef: params.modelRef } : {}),
              ...(params.authChoice !== void 0 ? { authChoice: params.authChoice } : {}),
              ...(params.apiKey !== void 0 ? { apiKey: params.apiKey } : {}),
              ...(params.workspace !== void 0 ? { workspace: params.workspace } : {}),
              surface: "gateway",
              runtime,
            }),
            void 0,
          );
        });
      });
    } catch (error) {
      if (!(error instanceof CrestodianSetupActivationBusyError)) throw error;
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.UNAVAILABLE, error.message, { retryable: true }),
      );
    }
  },
  "crestodian.chat": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateCrestodianChatParams, "crestodian.chat", respond))
      return;
    await runCrestodianGatewayTask(async () => {
      const sessions = context.crestodianSessions;
      const sessionId = params.sessionId;
      await getCrestodianSessionQueue(sessions).enqueue(sessionId, async () => {
        if (params.reset) {
          const existing = sessions.get(sessionId);
          sessions.delete(sessionId);
          await existing?.engine.dispose();
        }
        let session = sessions.get(sessionId);
        if (!session) {
          const { verifySetupInference } = await import("./crestodian/setup-inference.js");
          const inference = await verifySetupInference({
            runtime: defaultRuntime,
            bindSession: true,
          });
          if (!inference.ok) {
            respond(
              false,
              void 0,
              errorShape(
                ErrorCodes.UNAVAILABLE,
                `Crestodian requires working inference: ${inference.error}`,
              ),
            );
            return;
          }
          const engine = new CrestodianChatEngine({
            surface: "gateway",
            verifiedInference: inference.binding,
          });
          let welcome;
          try {
            if (params.welcomeVariant === "onboarding")
              welcome = await buildOnboardingWelcome({ engine });
            else {
              welcome = formatCrestodianStartupMessage(await engine.loadOverview());
              engine.noteAssistantMessage(welcome);
            }
          } catch (error) {
            await engine.dispose().catch(() => void 0);
            if (!isCrestodianInferenceUnavailableError(error)) throw error;
            respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message));
            return;
          }
          await evictOldestSession(sessions);
          session = {
            engine,
            welcome,
            lastUsedAt: Date.now(),
          };
          sessions.set(sessionId, session);
          if (params.message === void 0 || !params.message.trim()) {
            respond(
              true,
              {
                sessionId,
                reply: session.welcome,
                action: "none",
              },
              void 0,
            );
            return;
          }
        }
        session.lastUsedAt = Date.now();
        if (params.message === void 0 || !params.message.trim()) {
          respond(
            true,
            {
              sessionId,
              reply: session.welcome,
              action: "none",
            },
            void 0,
          );
          return;
        }
        let reply;
        try {
          reply = await session.engine.handle(params.message);
        } catch (error) {
          if (!isCrestodianInferenceUnavailableError(error)) throw error;
          if (sessions.get(sessionId)?.engine === session.engine) sessions.delete(sessionId);
          try {
            await session.engine.dispose();
          } catch {}
          respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, error.message));
          return;
        }
        const action =
          reply.action === "open-tui"
            ? "open-agent"
            : reply.action === "open-setup"
              ? "none"
              : reply.action;
        respond(
          true,
          {
            sessionId,
            reply:
              reply.text ||
              (action === "open-agent"
                ? "Setup here is done — continue with your agent."
                : "Nothing to change."),
            action,
            ...(reply.sensitive === true ? { sensitive: true } : {}),
          },
          void 0,
        );
      });
    });
  },
};
//#endregion
export { crestodianHandlers, runExclusiveCrestodianSetupActivation };
