import { randomUUID } from "node:crypto";
import { t as createDeferred } from "./deferred-DJrEoFQk.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
//#region src/wizard/session.ts
function normalizeTextAnswer(value) {
  if (value === null || value === void 0) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint")
    return String(value);
}
var WizardSessionPrompter = class {
  constructor(session) {
    this.session = session;
  }
  async intro(title) {
    await this.prompt({
      type: "note",
      title,
      message: "",
      executor: "client",
    });
  }
  async outro(message) {
    await this.prompt({
      type: "note",
      title: "Done",
      message,
      executor: "client",
    });
  }
  async note(message, title) {
    await this.prompt({
      type: "note",
      title,
      message,
      executor: "client",
    });
  }
  async deviceCode(params) {
    const fallbackMessage = [
      params.message ?? "Enter this one-time code on the provider's sign-in page.",
      `Code: ${params.code}`,
      ...(params.expiresInMinutes
        ? [`Code expires in ${params.expiresInMinutes} minutes. Never share it.`]
        : []),
    ].join("\n");
    await this.prompt({
      type: "note",
      title: params.title,
      message: fallbackMessage,
      deviceCode: {
        code: params.code,
        ...(params.expiresInMinutes ? { expiresInMinutes: params.expiresInMinutes } : {}),
        ...(params.message ? { message: params.message } : {}),
      },
      executor: "client",
    });
  }
  async plain(message) {
    await this.prompt({
      type: "note",
      message,
      format: "plain",
      executor: "client",
    });
  }
  async select(params) {
    return await this.prompt({
      type: "select",
      message: params.message,
      options: params.options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        hint: opt.hint,
      })),
      initialValue: params.initialValue,
      executor: "client",
    });
  }
  async multiselect(params) {
    const res = await this.prompt({
      type: "multiselect",
      message: params.message,
      options: params.options.map((opt) => ({
        value: opt.value,
        label: opt.label,
        hint: opt.hint,
      })),
      initialValue: params.initialValues,
      executor: "client",
    });
    return Array.isArray(res) ? res : [];
  }
  async text(params) {
    const res = await this.session.awaitAnswer(
      this.createStep({
        type: "text",
        message: params.message,
        initialValue: params.initialValue,
        placeholder: params.placeholder,
        sensitive: params.sensitive,
        executor: "client",
      }),
      params.validate,
    );
    return res === null || res === void 0
      ? ""
      : typeof res === "string"
        ? res
        : typeof res === "number" || typeof res === "boolean" || typeof res === "bigint"
          ? String(res)
          : "";
  }
  async confirm(params) {
    const res = await this.prompt({
      type: "confirm",
      message: params.message,
      initialValue: params.initialValue,
      executor: "client",
    });
    return Boolean(res);
  }
  progress(_label) {
    return {
      update: (_message) => {},
      stop: (_message) => {},
    };
  }
  async openUrl(url) {
    this.session.queueExternalUrl(url);
  }
  async prompt(step) {
    return await this.session.awaitAnswer(this.createStep(step));
  }
  createStep(step) {
    const externalUrl = this.session.consumeExternalUrl();
    return {
      ...step,
      ...(externalUrl ? { externalUrl } : {}),
      id: randomUUID(),
    };
  }
};
var WizardSession = class {
  constructor(runner, options) {
    this.runner = runner;
    this.abortController = new AbortController();
    this.currentStep = null;
    this.stepDeferred = null;
    this.pendingTerminalResolution = false;
    this.cancellationLocked = false;
    this.answerDeferred = /* @__PURE__ */ new Map();
    this.status = "running";
    const prompter = new WizardSessionPrompter(this);
    if (options?.timeoutMs !== void 0) {
      this.expiryTimer = setTimeout(() => this.cancel(), options.timeoutMs);
      this.expiryTimer.unref?.();
    }
    this.run(prompter);
  }
  async next() {
    if (this.currentStep)
      return {
        done: false,
        step: this.currentStep,
        status: this.status,
      };
    if (this.pendingTerminalResolution) {
      this.pendingTerminalResolution = false;
      return this.terminalResult();
    }
    if (this.status !== "running") return this.terminalResult();
    if (!this.stepDeferred) this.stepDeferred = createDeferred();
    const step = await this.stepDeferred.promise;
    if (step)
      return {
        done: false,
        step,
        status: this.status,
      };
    return this.terminalResult();
  }
  terminalResult() {
    if (!this.configuredAccounts)
      return {
        done: true,
        status: this.status,
        error: this.error,
      };
    return {
      done: true,
      status: this.status,
      error: this.error,
      channels: [...new Set(this.configuredAccounts.map((entry) => entry.channel))],
      accounts: this.configuredAccounts.map((entry) => ({ ...entry })),
    };
  }
  /** Record what the channels flow actually configured (channels flow only). */
  setConfiguredAccounts(accounts) {
    this.configuredAccounts = accounts.map((entry) => ({ ...entry }));
  }
  async answer(stepId, value) {
    const pending = this.answerDeferred.get(stepId);
    if (!pending) throw new Error("wizard: no pending step");
    const normalizedValue = pending.text ? normalizeTextAnswer(value) : value;
    if (pending.text && normalizedValue === void 0)
      return "wizard: text answer must be a scalar value";
    const validationError = pending.validate?.(normalizedValue) ?? void 0;
    if (validationError) return validationError;
    this.answerDeferred.delete(stepId);
    this.currentStep = null;
    pending.deferred.resolve(normalizedValue);
  }
  cancel() {
    if (this.status !== "running" || this.cancellationLocked) return false;
    this.status = "cancelled";
    this.error = "cancelled";
    this.abortController.abort(new WizardCancelledError());
    this.currentStep = null;
    for (const [, pending] of this.answerDeferred)
      pending.deferred.reject(new WizardCancelledError());
    this.answerDeferred.clear();
    this.resolveStep(null);
    return true;
  }
  /** The underlying mutation crossed its durable commit point and must finish. */
  lockCancellation() {
    this.cancellationLocked = true;
  }
  get signal() {
    return this.abortController.signal;
  }
  pushStep(step) {
    this.currentStep = step;
    this.resolveStep(step);
  }
  queueExternalUrl(url) {
    this.pendingExternalUrl = url;
  }
  consumeExternalUrl() {
    const url = this.pendingExternalUrl;
    this.pendingExternalUrl = void 0;
    return url;
  }
  async run(prompter) {
    try {
      await this.runner(prompter, this.signal, this);
      if (this.status === "running") this.status = "done";
    } catch (err) {
      if (this.status !== "running") return;
      if (err instanceof WizardCancelledError) {
        this.status = "cancelled";
        this.error = err.message;
      } else {
        this.status = "error";
        this.error = String(err);
      }
    } finally {
      if (this.expiryTimer) clearTimeout(this.expiryTimer);
      this.resolveStep(null);
    }
  }
  async awaitAnswer(step, validate) {
    if (this.status !== "running") throw new Error("wizard: session not running");
    this.pushStep(step);
    const deferred = createDeferred();
    this.answerDeferred.set(step.id, {
      deferred,
      text: step.type === "text",
      validate,
    });
    return await deferred.promise;
  }
  resolveStep(step) {
    if (!this.stepDeferred) {
      if (step === null) this.pendingTerminalResolution = true;
      return;
    }
    const deferred = this.stepDeferred;
    this.stepDeferred = null;
    deferred.resolve(step);
  }
  getStatus() {
    return this.status;
  }
  getError() {
    return this.error;
  }
};
//#endregion
export { WizardSession as t };
