import { fork } from "node:child_process";
import path from "node:path";
import "./src-Bl7G9qvi.js";
import { fileURLToPath } from "node:url";
import "./embedding-defaults-BP3wPc9o.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as toRetryError } from "./src-Dqmh2693.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region packages/memory-host-sdk/src/host/embedding-vectors.ts
/** Replace invalid coordinates and L2-normalize non-empty vectors. */
function sanitizeAndNormalizeEmbedding(vec) {
  const sanitized = vec.map((value) => (Number.isFinite(value) ? value : 0));
  const magnitude = Math.sqrt(sanitized.reduce((sum, value) => sum + value * value, 0));
  if (magnitude < 1e-10) return sanitized;
  return sanitized.map((value) => value / magnitude);
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-worker-errors.ts
/** Stable error codes emitted by the local embedding worker supervisor. */
const LOCAL_EMBEDDING_WORKER_ERROR_CODES = {
  exited: "LOCAL_EMBEDDING_WORKER_EXITED",
  processError: "LOCAL_EMBEDDING_WORKER_PROCESS_ERROR",
  ipcError: "LOCAL_EMBEDDING_WORKER_IPC_ERROR",
};
/** Create a local embedding worker failure with stable metadata fields. */
function createLocalEmbeddingWorkerFailureError(params) {
  return Object.assign(new Error(params.message), {
    code: params.code,
    reason: params.reason,
    ...(params.exitCode !== void 0 ? { exitCode: params.exitCode } : {}),
    ...(params.signal !== void 0 ? { signal: params.signal } : {}),
    ...(params.cause !== void 0 ? { cause: params.cause } : {}),
  });
}
//#endregion
//#region packages/memory-host-sdk/src/host/local-embedding-runtime-facts.ts
const LOCAL_EMBEDDING_RUNTIME_FACTS = Symbol.for("openclaw.localEmbeddingRuntimeFacts");
function attachLocalEmbeddingRuntimeFacts(target, getFacts) {
  Object.defineProperty(target, LOCAL_EMBEDDING_RUNTIME_FACTS, {
    configurable: false,
    enumerable: false,
    value: getFacts,
    writable: false,
  });
}
function getLocalEmbeddingRuntimeFacts(target) {
  if (!target) return;
  const getFacts = Reflect.get(target, LOCAL_EMBEDDING_RUNTIME_FACTS);
  return typeof getFacts === "function" ? getFacts() : void 0;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings-worker.ts
/** Resolve the worker child script for source, package, and bundled runtime layouts. */
function resolveDefaultWorkerScriptPath() {
  const currentPath = fileURLToPath(import.meta.url);
  const extension = path.extname(currentPath);
  const currentName = path.basename(currentPath);
  const sibling =
    extension === ".ts"
      ? "embeddings-worker-child.ts"
      : currentName.startsWith("embeddings-worker.")
        ? "embeddings-worker-child.js"
        : "memory-core-local-embedding-worker.js";
  return path.join(path.dirname(currentPath), sibling);
}
/** Keep only local embedding options that are safe and necessary to send over IPC. */
function serializeLocalEmbeddingOptions(options, runtimeOptions) {
  return {
    config: {},
    provider: "local",
    model: options.model,
    fallback: "none",
    outputDimensionality: options.outputDimensionality,
    local: {
      ...options.local,
      ...(runtimeOptions?.nodeLlamaCppImportUrl
        ? { nodeLlamaCppImportUrl: runtimeOptions.nodeLlamaCppImportUrl }
        : {}),
    },
  };
}
/** Create a typed failure for unexpected worker process exits. */
function createWorkerExitError(code, signal) {
  return createLocalEmbeddingWorkerFailureError({
    message: `Local embedding worker exited unexpectedly (${signal ? `signal ${signal}` : `exit code ${code ?? "unknown"}`})`,
    code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.exited,
    reason: signal ? "signal" : "exit",
    exitCode: code,
    signal,
  });
}
/** Convert worker response errors into Error objects while preserving worker error codes. */
function createWorkerResponseError(error) {
  if (typeof error.error === "object" && error.error) {
    const message = error.error.message || "Local embedding worker failed";
    const workerError = new Error(message);
    if (error.error.code) workerError.code = error.error.code;
    return workerError;
  }
  return new Error(error.error || "Local embedding worker failed");
}
const WORKER_UNSAFE_EXEC_ARGV_FLAGS = /* @__PURE__ */ new Set(["--inspect", "--inspect-brk"]);
const WORKER_UNSAFE_EXEC_ARGV_FLAGS_WITH_VALUE = /* @__PURE__ */ new Set([
  "--eval",
  "-e",
  "--print",
  "-p",
  "--input-type",
  "--inspect-port",
]);
const WORKER_UNSAFE_EXEC_ARGV_OPTION_PREFIXES = [
  "--eval=",
  "--print=",
  "--input-type=",
  "--inspect=",
  "--inspect-brk=",
  "--inspect-port=",
];
const WORKER_CLOSE_GRACE_MS = 250;
/** Drop execArgv flags that would make forked workers debug/eval stateful or unsafe. */
function resolveWorkerExecArgv() {
  const args = [];
  let skipNext = false;
  for (const arg of process.execArgv) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (WORKER_UNSAFE_EXEC_ARGV_FLAGS.has(arg)) continue;
    if (WORKER_UNSAFE_EXEC_ARGV_FLAGS_WITH_VALUE.has(arg)) {
      skipNext = true;
      continue;
    }
    if (WORKER_UNSAFE_EXEC_ARGV_OPTION_PREFIXES.some((prefix) => arg.startsWith(prefix))) continue;
    args.push(arg);
  }
  return args;
}
/** IPC client that serializes local embedding calls through one child process. */
var LocalEmbeddingWorkerClient = class {
  constructor(scriptPath) {
    this.scriptPath = scriptPath;
    this.child = null;
    this.nextRequestId = 1;
    this.pending = /* @__PURE__ */ new Map();
  }
  /** Start or reuse the child worker and initialize its provider. */
  async initialize(options) {
    await this.send({
      type: "initialize",
      options,
    });
  }
  /** Request one query embedding from the child worker. */
  async embedQuery(options, text, callOptions) {
    const result = await this.send(
      {
        type: "embedQuery",
        options,
        text,
      },
      callOptions,
    );
    return Array.isArray(result) ? result : [];
  }
  /** Request a batch of embeddings from the child worker. */
  async embedBatch(options, texts, callOptions) {
    const result = await this.send(
      {
        type: "embedBatch",
        options,
        texts,
      },
      callOptions,
    );
    return Array.isArray(result) ? result : [];
  }
  getRuntimeFacts() {
    return this.lastRuntimeFacts;
  }
  /** Ask the child to close gracefully, then force shutdown after a short grace period. */
  async close() {
    if (!this.child) return;
    let timeout;
    const closeRequest = this.send({ type: "close" }).then(() => "closed");
    const closeTimeout = new Promise((resolve) => {
      timeout = setTimeout(() => resolve("timeout"), WORKER_CLOSE_GRACE_MS);
      timeout.unref?.();
    });
    try {
      if ((await Promise.race([closeRequest, closeTimeout])) === "timeout")
        closeRequest.catch(() => {});
    } finally {
      if (timeout) clearTimeout(timeout);
      this.shutdownChild();
    }
  }
  /** Ensure the child process exists and has lifecycle failure handlers installed. */
  ensureChild() {
    if (this.child?.connected) return this.child;
    const child = fork(this.scriptPath, [], {
      execArgv: resolveWorkerExecArgv(),
      serialization: "json",
      stdio: ["ignore", "ignore", "ignore", "ipc"],
    });
    child.on("message", (message) => this.handleMessage(message));
    child.on("exit", (code, signal) => {
      if (this.child === child) this.child = null;
      this.rejectPending(createWorkerExitError(code, signal));
    });
    child.on("error", (err) => {
      if (this.child === child) this.child = null;
      this.rejectPending(
        createLocalEmbeddingWorkerFailureError({
          message: `Local embedding worker process failed: ${err.message}`,
          code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.processError,
          reason: "process-error",
          cause: err,
        }),
      );
    });
    this.child = child;
    return child;
  }
  /** Send one request over IPC and bind its abort signal to child shutdown. */
  async send(request, options) {
    options?.signal?.throwIfAborted();
    const child = this.ensureChild();
    const id = this.nextRequestId++;
    const payload = {
      ...request,
      id,
    };
    return await new Promise((resolve, reject) => {
      const pending = {
        resolve,
        reject,
      };
      if (options?.signal) {
        const abort = () => {
          this.pending.delete(id);
          this.shutdownChild();
          reject(
            toLintErrorObject(
              options.signal?.reason ??
                /* @__PURE__ */ new Error("Local embedding request aborted"),
              "Non-Error rejection",
            ),
          );
        };
        options.signal.addEventListener("abort", abort, { once: true });
        pending.abort = () => options.signal?.removeEventListener("abort", abort);
      }
      this.pending.set(id, pending);
      child.send(payload, (err) => {
        if (err) {
          this.pending.delete(id);
          pending.abort?.();
          reject(
            createLocalEmbeddingWorkerFailureError({
              message: `Local embedding worker IPC failed: ${err.message}`,
              code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.ipcError,
              reason: "ipc",
              cause: err,
            }),
          );
        }
      });
    });
  }
  /** Route one worker response to the matching pending request. */
  handleMessage(message) {
    const response = message;
    if (typeof response.id !== "number") return;
    if (response.runtimeFacts) this.lastRuntimeFacts = response.runtimeFacts;
    const pending = this.pending.get(response.id);
    if (!pending) return;
    this.pending.delete(response.id);
    pending.abort?.();
    if (response.ok) {
      pending.resolve(response.value);
      return;
    }
    pending.reject(createWorkerResponseError(response));
  }
  /** Disconnect and kill the current child process if it is still alive. */
  shutdownChild() {
    const child = this.child;
    this.child = null;
    if (!child) return;
    this.rejectPending(
      createLocalEmbeddingWorkerFailureError({
        message: "Local embedding worker exited unexpectedly (shutdown)",
        code: LOCAL_EMBEDDING_WORKER_ERROR_CODES.exited,
        reason: "exit",
      }),
    );
    if (child.connected) child.disconnect();
    if (!child.killed) child.kill();
  }
  /** Reject all pending requests after child process failure. */
  rejectPending(err) {
    const pending = [...this.pending.values()];
    this.pending.clear();
    for (const entry of pending) {
      entry.abort?.();
      entry.reject(err);
    }
  }
};
/** Create the public local embedding provider backed by the child worker client. */
async function createLocalEmbeddingWorkerProvider(options, runtimeOptions) {
  const modelPath =
    normalizeOptionalString(options.local?.modelPath) ||
    "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
  const workerOptions = serializeLocalEmbeddingOptions(options, runtimeOptions);
  const client = new LocalEmbeddingWorkerClient(
    runtimeOptions?.workerScriptPath ?? resolveDefaultWorkerScriptPath(),
  );
  try {
    await client.initialize(workerOptions);
  } catch (err) {
    await client.close().catch(() => {});
    throw err;
  }
  let closed = false;
  const throwIfClosed = () => {
    if (closed) throw new Error("Local embedding provider has been closed");
  };
  const provider = {
    id: "local",
    model: modelPath,
    embedQuery: async (text, callOptions) => {
      throwIfClosed();
      return await client.embedQuery(workerOptions, text, callOptions);
    },
    embedBatch: async (texts, callOptions) => {
      throwIfClosed();
      return await client.embedBatch(workerOptions, texts, callOptions);
    },
    close: async () => {
      if (closed) return;
      closed = true;
      await client.close();
    },
  };
  attachLocalEmbeddingRuntimeFacts(provider, () => client.getRuntimeFacts());
  return provider;
}
/** Convert abort reasons or arbitrary thrown values into lint-safe Error objects. */
function toLintErrorObject(value, fallbackMessage) {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  const error = new Error(fallbackMessage, { cause: value });
  if ((typeof value === "object" && value !== null) || typeof value === "function")
    Object.assign(error, value);
  return error;
}
//#endregion
//#region packages/memory-host-sdk/src/host/node-llama.ts
const NODE_LLAMA_CPP_MODULE = "node-llama-cpp";
/** Dynamically import node-llama-cpp so the optional dependency is loaded only when needed. */
async function importNodeLlamaCpp(moduleSpecifier = NODE_LLAMA_CPP_MODULE) {
  return import(moduleSpecifier);
}
//#endregion
//#region packages/memory-host-sdk/src/host/embeddings.ts
function copyEmbeddingVector(vector, maxLength) {
  const length = Math.min(maxLength ?? vector.length, vector.length);
  const values = [];
  for (let index = 0; index < length; index += 1)
    values.push(expectDefined(vector[index], `embedding value ${index}`));
  return values;
}
async function disposeResources(resources) {
  let firstError;
  for (const resource of resources)
    try {
      await resource?.dispose?.();
    } catch (err) {
      firstError ??= err;
    }
  if (firstError) throw toRetryError(firstError);
}
async function readLlamaRuntimeFacts(llama) {
  const facts = {
    engine: "llama.cpp",
    state: "failed",
    backend: llama.gpu || "cpu",
    buildType: llama.buildType,
    offload: { supported: llama.supportsGpuOffloading },
  };
  try {
    facts.deviceNames = await llama.getGpuDeviceNames();
  } catch {}
  try {
    const memory = await llama.getVramState();
    facts.memory = {
      totalBytes: memory.total,
      usedBytes: memory.used,
      freeBytes: memory.free,
      unifiedBytes: memory.unifiedSize,
      observedAtMs: Date.now(),
    };
  } catch {}
  return facts;
}
function formatRuntimeLoadError(err) {
  return err instanceof Error ? err.message : String(err);
}
async function createLocalEmbeddingProvider(options, runtimeOptions) {
  return await createLocalEmbeddingWorkerProvider(options, runtimeOptions);
}
async function createLocalEmbeddingProviderInProcess(options) {
  const modelPath =
    normalizeOptionalString(options.local?.modelPath) ||
    "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
  const modelCacheDir = normalizeOptionalString(options.local?.modelCacheDir);
  const nodeLlamaCppImportUrl = normalizeOptionalString(options.local?.nodeLlamaCppImportUrl);
  const contextSize = options.local?.contextSize ?? 4096;
  const { getLlama, resolveModelFile, LlamaLogLevel } =
    await importNodeLlamaCpp(nodeLlamaCppImportUrl);
  let llama = null;
  let embeddingModel = null;
  let embeddingContext = null;
  let initPromise = null;
  let initAbortController = null;
  let closePromise = null;
  let runtimeFacts;
  let closed = false;
  const throwIfClosed = () => {
    if (closed) throw new Error("Local embedding provider has been closed");
  };
  const disposeAndThrowIfClosed = async (resource) => {
    if (!closed) return resource;
    await disposeResources([resource]);
    throwIfClosed();
    return resource;
  };
  const ensureContext = async () => {
    throwIfClosed();
    if (embeddingContext) return embeddingContext;
    if (initPromise) return initPromise;
    initPromise = (async () => {
      const abortController = new AbortController();
      initAbortController = abortController;
      try {
        if (!llama) {
          const nextLlama = await getLlama({ logLevel: LlamaLogLevel.error });
          llama = await disposeAndThrowIfClosed(nextLlama);
          runtimeFacts = {
            ...(await readLlamaRuntimeFacts(llama)),
            context: { requestedSize: contextSize },
          };
        }
        if (!embeddingModel) {
          const resolved = await resolveModelFile(modelPath, {
            ...(modelCacheDir ? { directory: modelCacheDir } : {}),
            signal: abortController.signal,
          });
          throwIfClosed();
          const nextModel = await llama.loadModel({
            modelPath: resolved,
            loadSignal: abortController.signal,
            ...(typeof contextSize === "number"
              ? {
                  gpuLayers: {
                    fitContext: {
                      contextSize,
                      embeddingContext: true,
                    },
                  },
                }
              : {}),
          });
          embeddingModel = await disposeAndThrowIfClosed(nextModel);
          runtimeFacts = {
            ...runtimeFacts,
            engine: "llama.cpp",
            state: "failed",
            offload: {
              supported: llama.supportsGpuOffloading,
              offloadedLayers: embeddingModel.gpuLayers,
              totalLayers: embeddingModel.fileInsights.totalLayers,
            },
          };
        }
        if (!embeddingContext) {
          const nextContext = await embeddingModel.createEmbeddingContext({
            contextSize,
            createSignal: abortController.signal,
          });
          embeddingContext = await disposeAndThrowIfClosed(nextContext);
          const refreshedRuntimeFacts = await readLlamaRuntimeFacts(llama);
          runtimeFacts = {
            ...runtimeFacts,
            ...refreshedRuntimeFacts,
            engine: "llama.cpp",
            state: "ready",
            offload: {
              supported: llama.supportsGpuOffloading,
              offloadedLayers: embeddingModel.gpuLayers,
              totalLayers: embeddingModel.fileInsights.totalLayers,
            },
            context: { requestedSize: contextSize },
            loadError: void 0,
          };
        }
        return embeddingContext;
      } catch (err) {
        runtimeFacts = {
          ...runtimeFacts,
          engine: "llama.cpp",
          state: "failed",
          context: { requestedSize: contextSize },
          loadError: formatRuntimeLoadError(err),
        };
        initPromise = null;
        throw err;
      } finally {
        if (initAbortController === abortController) initAbortController = null;
      }
    })();
    return initPromise;
  };
  const outputDimensionality =
    typeof options.outputDimensionality === "number" ? options.outputDimensionality : void 0;
  const normalize = (vector) =>
    sanitizeAndNormalizeEmbedding(copyEmbeddingVector(vector, outputDimensionality));
  const provider = {
    id: "local",
    model: modelPath,
    embedQuery: async (text, optionsValue) => {
      throwIfClosed();
      optionsValue?.signal?.throwIfAborted();
      const ctx = await ensureContext();
      throwIfClosed();
      optionsValue?.signal?.throwIfAborted();
      const embedding = await ctx.getEmbeddingFor(text);
      return normalize(embedding.vector);
    },
    embedBatch: async (texts, optionsLocal) => {
      throwIfClosed();
      optionsLocal?.signal?.throwIfAborted();
      const ctx = await ensureContext();
      throwIfClosed();
      optionsLocal?.signal?.throwIfAborted();
      const embeddings = [];
      for (const text of texts) {
        throwIfClosed();
        optionsLocal?.signal?.throwIfAborted();
        const embedding = await ctx.getEmbeddingFor(text);
        embeddings.push(normalize(embedding.vector));
      }
      return embeddings;
    },
    close: async () => {
      if (closePromise) return closePromise;
      closed = true;
      initAbortController?.abort();
      initAbortController = null;
      closePromise = (async () => {
        const context = embeddingContext;
        const model = embeddingModel;
        const runtime = llama;
        embeddingContext = null;
        embeddingModel = null;
        llama = null;
        initPromise = null;
        await disposeResources([context, model, runtime]);
      })();
      return closePromise;
    },
  };
  attachLocalEmbeddingRuntimeFacts(provider, () => runtimeFacts);
  return provider;
}
//#endregion
export {
  sanitizeAndNormalizeEmbedding as i,
  createLocalEmbeddingProviderInProcess as n,
  getLocalEmbeddingRuntimeFacts as r,
  createLocalEmbeddingProvider as t,
};
