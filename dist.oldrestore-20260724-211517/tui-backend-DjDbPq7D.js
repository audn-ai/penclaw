import { randomUUID } from "node:crypto";
import { t as CrestodianChatEngine } from "./chat-engine-C5mxheoh.js";
import {
  n as isCrestodianInferenceUnavailableError,
  t as CrestodianInferenceUnavailableError,
} from "./inference-error-FHRbX8O-.js";
import { t as notifyListeners } from "./listeners-BogSNJ-R.js";
import { t as buildOnboardingWelcome } from "./onboarding-welcome-Dk10Yeht.js";
import { n as executeCrestodianOperation } from "./operations-Cj3q63k5.js";
import {
  i as loadCrestodianOverview,
  r as formatCrestodianStartupMessage,
} from "./overview-DfQOIIFh.js";
import { i as buildAgentMainSessionKey } from "./session-key-druuY-GG.js";
import { b as runTui } from "./tui-DvQ9rjV_.js";
import { a as resolveCrestodianVerifiedInferenceRoute } from "./verified-inference-CEqscfYA.js";
//#region src/crestodian/tui-backend.ts
const CRESTODIAN_AGENT_ID = "crestodian";
const CRESTODIAN_SESSION_KEY = buildAgentMainSessionKey({ agentId: CRESTODIAN_AGENT_ID });
function createChatEngine(opts) {
  return new CrestodianChatEngine({
    yes: opts.yes,
    deps: opts.deps,
    planWithAssistant: opts.planWithAssistant,
    surface: "cli",
    verifiedInference: opts.verifiedInference,
    ...(opts.runChannelSetupWizard ? { runChannelSetupWizard: opts.runChannelSetupWizard } : {}),
  });
}
async function loadOverviewForTui(opts) {
  if (opts.deps?.loadOverview) return await opts.deps.loadOverview();
  return await loadCrestodianOverview();
}
function message(role, text) {
  return {
    role,
    content: [
      {
        type: "text",
        text,
      },
    ],
    timestamp: Date.now(),
  };
}
function splitModelRef(ref) {
  const trimmed = ref?.trim();
  if (!trimmed) return {};
  const slash = trimmed.indexOf("/");
  if (slash <= 0 || slash >= trimmed.length - 1) return { model: trimmed };
  return {
    provider: trimmed.slice(0, slash),
    model: trimmed.slice(slash + 1),
  };
}
var CrestodianTuiBackend = class {
  constructor(opts, welcome, engine) {
    this.opts = opts;
    this.connection = { url: "crestodian local" };
    this.seq = 0;
    this.engineDisposal = null;
    this.inferenceFailure = null;
    this.handoff = null;
    this.requestExit = null;
    this.responseQueue = Promise.resolve();
    this.messages = [];
    this.engine = engine;
    this.messages.push(message("assistant", welcome));
  }
  setRequestExitHandler(handler) {
    this.requestExit = handler;
    if (this.inferenceFailure) queueMicrotask(handler);
  }
  consumeHandoff() {
    const handoff = this.handoff;
    this.handoff = null;
    return handoff;
  }
  start() {
    queueMicrotask(() => {
      this.onConnected?.();
    });
  }
  stop() {}
  async sendChat(opts) {
    const runId = opts.runId ?? randomUUID();
    const text = opts.message.trim();
    this.messages.push(message("user", opts.message));
    const response = this.responseQueue.then(() => this.respond(runId, opts.sessionKey, text));
    this.responseQueue = response.catch(() => void 0);
    return { runId };
  }
  async abortChat() {
    return {
      ok: true,
      aborted: false,
    };
  }
  async loadHistory() {
    return {
      sessionId: "crestodian",
      messages: this.messages,
      thinkingLevel: "off",
      verboseLevel: "off",
    };
  }
  async listSessions() {
    const model = splitModelRef((await loadOverviewForTui(this.opts)).defaultModel);
    return {
      ts: Date.now(),
      path: "crestodian",
      count: 1,
      defaults: {
        model: model.model ?? null,
        modelProvider: model.provider ?? null,
        contextTokens: null,
      },
      sessions: [
        {
          key: CRESTODIAN_SESSION_KEY,
          sessionId: "crestodian",
          displayName: "Crestodian",
          updatedAt: Date.now(),
          thinkingLevel: "off",
          verboseLevel: "off",
          model: model.model,
          modelProvider: model.provider,
        },
      ],
    };
  }
  async listAgents() {
    return {
      defaultId: CRESTODIAN_AGENT_ID,
      mainKey: "main",
      scope: "per-sender",
      agents: [
        {
          id: CRESTODIAN_AGENT_ID,
          name: "Crestodian",
        },
      ],
    };
  }
  async patchSession(opts) {
    const model = splitModelRef(typeof opts.model === "string" ? opts.model : void 0);
    return {
      ok: true,
      path: "crestodian",
      key: CRESTODIAN_SESSION_KEY,
      entry: {
        sessionId: "crestodian",
        displayName: "Crestodian",
        updatedAt: Date.now(),
        ...(model.model ? { model: model.model } : {}),
        ...(model.provider ? { modelProvider: model.provider } : {}),
      },
      resolved: {
        modelProvider: model.provider,
        model: model.model,
      },
    };
  }
  async resetSession() {
    if (this.inferenceFailure) throw this.inferenceFailure;
    await this.disposeEngine();
    this.engine = createChatEngine(this.opts);
    this.engineDisposal = null;
    const overview = await loadOverviewForTui(this.opts);
    this.messages.splice(
      0,
      this.messages.length,
      message("assistant", formatCrestodianStartupMessage(overview)),
    );
    return { ok: true };
  }
  async createSession(_opts) {
    await this.resetSession();
    return {
      ok: true,
      key: CRESTODIAN_SESSION_KEY,
      entry: {
        sessionId: "crestodian",
        updatedAt: Date.now(),
      },
    };
  }
  async getGatewayStatus() {
    return (await loadOverviewForTui(this.opts)).gateway.reachable
      ? "Gateway reachable"
      : "Gateway unreachable";
  }
  async listModels() {
    return [];
  }
  async dispose() {
    try {
      await this.disposeEngine();
    } catch (error) {
      if (!this.inferenceFailure) throw error;
    }
  }
  disposeEngine() {
    this.engineDisposal ??= this.engine.dispose();
    return this.engineDisposal;
  }
  nextSeq() {
    this.seq += 1;
    return this.seq;
  }
  emit(event, payload) {
    const listener = this.onEvent;
    if (!listener) return;
    notifyListeners([listener], {
      event,
      payload,
      seq: this.nextSeq(),
    });
  }
  emitFinal(runId, sessionKey, text) {
    const assistant = message(
      "assistant",
      text || "Crestodian listened and found nothing to change.",
    );
    this.messages.push(assistant);
    this.emit("chat", {
      runId,
      sessionKey,
      state: "final",
      message: assistant,
    });
  }
  emitError(runId, sessionKey, error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.emit("chat", {
      runId,
      sessionKey,
      state: "error",
      errorMessage,
    });
  }
  async respond(runId, sessionKey, text) {
    if (this.inferenceFailure) {
      this.emitError(runId, sessionKey, this.inferenceFailure);
      queueMicrotask(() => this.requestExit?.());
      return;
    }
    try {
      const reply = await this.engine.handle(text);
      if ((reply.action === "open-tui" || reply.action === "open-setup") && reply.handoff) {
        this.handoff = reply.handoff;
        queueMicrotask(() => this.requestExit?.());
      } else if (reply.action === "exit") queueMicrotask(() => this.requestExit?.());
      this.emitFinal(runId, sessionKey, reply.text);
    } catch (error) {
      if (isCrestodianInferenceUnavailableError(error)) {
        this.inferenceFailure = error;
        this.handoff = null;
        try {
          await this.disposeEngine();
        } catch {}
        this.emitError(runId, sessionKey, error);
        queueMicrotask(() => this.requestExit?.());
        return;
      }
      this.emitError(runId, sessionKey, error);
    }
  }
};
async function runSetupHandoff(handoff, opts, runtime) {
  if (handoff.target !== "channels") {
    runtime.error(
      "Setup cannot replace the inference route powering Crestodian. Exit and run `openclaw onboard`, then start Crestodian again.",
    );
    return;
  }
  const runChannelsAdd =
    opts.runChannelsAdd ?? (await import("./add-Cu5-OuPa.js")).channelsAddCommand;
  const beforePersistentEffect = async () => {
    const binding = opts?.verifiedInference;
    if (!binding) throw new CrestodianInferenceUnavailableError("conversation");
    try {
      const { resolveCrestodianInferenceForPersistentApply } =
        await import("./crestodian/setup-inference.js");
      if (
        await resolveCrestodianInferenceForPersistentApply({
          binding,
          runtime,
          deps: opts.deps,
        })
      )
        return;
    } catch (error) {
      if (isCrestodianInferenceUnavailableError(error)) throw error;
      throw new CrestodianInferenceUnavailableError("conversation", [error]);
    }
    throw new CrestodianInferenceUnavailableError("conversation");
  };
  await runChannelsAdd(handoff.channel ? { channel: handoff.channel } : {}, runtime, {
    hasFlags: false,
    beforePersistentEffect,
  });
}
async function runCrestodianTui(opts, runtime) {
  const binding = opts?.verifiedInference;
  if (!binding) throw new CrestodianInferenceUnavailableError("conversation");
  const boundOpts = {
    ...opts,
    verifiedInference: binding,
  };
  let nextInput;
  let welcomeVariant = boundOpts.welcomeVariant;
  for (;;) {
    await requireTuiVerifiedInference(boundOpts);
    const initialMessage = nextInput;
    const engine = createChatEngine(boundOpts);
    let welcome;
    if (welcomeVariant === "onboarding")
      welcome = await buildOnboardingWelcome({
        engine,
        ...(boundOpts.setupWorkspace ? { workspace: boundOpts.setupWorkspace } : {}),
      });
    else {
      welcome = formatCrestodianStartupMessage(await loadOverviewForTui(boundOpts));
      engine.noteAssistantMessage(welcome);
    }
    welcomeVariant = void 0;
    const backend = new CrestodianTuiBackend(boundOpts, welcome, engine);
    const runTui$1 = boundOpts.runTui ?? runTui;
    try {
      await runTui$1({
        local: true,
        session: CRESTODIAN_SESSION_KEY,
        historyLimit: 200,
        backend,
        config: {},
        title: "openclaw crestodian",
        ...(initialMessage ? { message: initialMessage } : {}),
      });
    } finally {
      await backend.dispose();
    }
    const handoff = backend.consumeHandoff();
    if (!handoff) return;
    if (handoff.kind === "model-setup") {
      runtime.error(
        "Crestodian cannot replace its active inference route. Run `openclaw onboard` outside this session, then start Crestodian again.",
      );
      return;
    }
    if (handoff.kind === "open-setup") {
      await runSetupHandoff(handoff, boundOpts, runtime);
      return;
    }
    nextInput = (
      await executeCrestodianOperation(handoff, runtime, {
        approved: true,
        deps: boundOpts.deps,
      })
    ).nextInput;
    if (!nextInput?.trim()) return;
  }
}
async function requireTuiVerifiedInference(opts) {
  const binding = opts?.verifiedInference;
  if (!binding) throw new CrestodianInferenceUnavailableError("conversation");
  try {
    if (await resolveCrestodianVerifiedInferenceRoute(binding, opts.deps)) return;
  } catch (error) {
    throw new CrestodianInferenceUnavailableError("conversation", [error]);
  }
  throw new CrestodianInferenceUnavailableError("conversation");
}
//#endregion
export { runCrestodianTui };
