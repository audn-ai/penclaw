import fs from "node:fs/promises";
import path from "node:path";
import { _ as readCodexNotificationItem } from "./attempt-notifications-jKAL7Gfs.js";
import "./temp-path-DYqJUh96.js";
import "./number-runtime-B-n-wjMn.js";
import { f as resolveCodexAppServerRuntimeOptions } from "./config-C1imjxk6.js";
import { r as readModelListResult } from "./models-D8uZmu75.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { r as withTempWorkspace } from "./private-temp-workspace-BrSGWjaU.js";
import { i as isJsonObject } from "./protocol-BMifTfdW.js";
import {
  i as assertCodexTurnStartResponse,
  l as readCodexTurnCompletedNotification,
  o as readCodexErrorNotification,
  r as assertCodexThreadStartResponse,
} from "./protocol-validators-CfDblFS1.js";
import { l as isCodexAppServerStartSelectionChangedError } from "./shared-client-a36Mluj-.js";
import {
  W as mergeCodexThreadConfigs,
  r as buildCodexRuntimeThreadConfig,
} from "./thread-lifecycle-BI8tSeEg.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/codex/src/app-server/bounded-turn.ts
const CODEX_PRIVATE_STDIO_ARGS = ["app-server", "--listen", "stdio://"];
const OPENCLAW_CODEX_APP_SERVER_ARGS_ENV_VAR = "OPENCLAW_CODEX_APP_SERVER_ARGS";
const CODEX_BOUNDED_THREAD_CONFIG = {
  "features.multi_agent": false,
  "features.apps": false,
  "features.plugins": false,
  "features.image_generation": false,
  "features.standalone_web_search": false,
  web_search: "disabled",
};
const CODEX_PRIVATE_BOUNDED_THREAD_CONFIG = {
  "features.hooks": false,
  notify: [],
};
async function runBoundedCodexAppServerTurn(params) {
  const appServer = resolveCodexAppServerRuntimeOptions({
    pluginConfig: params.options.pluginConfig,
    managedCommandOrder: params.isolation === "private-stdio" ? "package-first" : void 0,
  });
  if (params.isolation === "configured-transport")
    return await runBoundedCodexAppServerTurnInWorkspace(params, appServer, {
      cwd: params.agentDir?.trim() || process.cwd(),
    });
  if (appServer.start.transport !== "stdio")
    throw new Error("Bounded Codex turns require stdio transport so native tools can be isolated.");
  return await withTempWorkspace(
    {
      rootDir: resolvePreferredOpenClawTmpDir(),
      prefix: "codex-bounded-turn-",
    },
    async (workspace) => {
      const codexHome = path.join(workspace.dir, "codex-home");
      const cwd = path.join(workspace.dir, "workspace");
      await Promise.all([
        fs.mkdir(codexHome, { recursive: true }),
        fs.mkdir(cwd, { recursive: true }),
      ]);
      return await runBoundedCodexAppServerTurnInWorkspace(params, appServer, {
        codexHome,
        cwd,
      });
    },
  );
}
async function runBoundedCodexAppServerTurnInWorkspace(
  params,
  appServer,
  workspace,
  selectionAttempt = 0,
  timing,
) {
  const totalTimeoutMs = timing?.timeoutMs ?? resolveTimerTimeoutMs(params.timeoutMs, 100, 100);
  const deadline = timing?.deadline ?? Date.now() + totalTimeoutMs;
  const timeoutMs = deadline - Date.now();
  if (timeoutMs <= 0) throw new Error(`${params.taskLabel} timed out`);
  const agentDir = params.agentDir?.trim() || void 0;
  const startOptions = workspace.codexHome
    ? buildPrivateCodexAppServerStartOptions(appServer.start, workspace.codexHome)
    : appServer.start;
  const ownsClient = !params.options.clientFactory;
  const client = params.options.clientFactory
    ? await params.options.clientFactory({
        startOptions,
        authProfileId: params.profile,
        agentDir,
        config: params.config,
        timeoutMs,
      })
    : await import("./shared-client-Bt7kZiNA.js").then(({ createIsolatedCodexAppServerClient }) =>
        createIsolatedCodexAppServerClient({
          startOptions,
          timeoutMs,
          authProfileId: params.profile,
          agentDir,
          authProfileStore: params.authProfileStore,
          config: params.config,
        }),
      );
  const abortController = new AbortController();
  const abortFromCaller = () => abortController.abort(params.signal?.reason ?? "aborted");
  if (params.signal?.aborted) abortFromCaller();
  else params.signal?.addEventListener("abort", abortFromCaller, { once: true });
  const remainingRunMs = deadline - Date.now();
  if (remainingRunMs <= 0) abortController.abort("timeout");
  const timeout = setTimeout(() => abortController.abort("timeout"), Math.max(1, remainingRunMs));
  timeout.unref?.();
  let retrySelection = false;
  try {
    const model = await resolveCodexBoundedTurnModel({
      client,
      selection: params.model,
      requiredModalities: params.requiredModalities,
      timeoutMs,
      signal: abortController.signal,
    });
    const thread = assertCodexThreadStartResponse(
      await client.request(
        "thread/start",
        {
          model,
          modelProvider: "openai",
          cwd: workspace.cwd,
          approvalPolicy: "on-request",
          sandbox: "read-only",
          serviceName: "OpenClaw",
          developerInstructions: params.developerInstructions,
          config: buildCodexRuntimeThreadConfig(resolveBoundedThreadConfig(params, workspace), {
            nativeCodeModeEnabled: false,
          }),
          environments: [],
          dynamicTools: [],
          experimentalRawEvents: true,
          ephemeral: true,
        },
        {
          timeoutMs,
          signal: abortController.signal,
        },
      ),
    );
    const collector = createCodexBoundedTurnCollector(thread.thread.id, params.taskLabel);
    const cleanup = client.addNotificationHandler(collector.handleNotification);
    const requestCleanup = client.addRequestHandler(
      createCodexBoundedApprovalHandler(params.taskLabel),
    );
    try {
      const turn = assertCodexTurnStartResponse(
        await client.request(
          "turn/start",
          {
            threadId: thread.thread.id,
            input: params.input,
            cwd: workspace.cwd,
            approvalPolicy: "on-request",
            model,
            effort: "low",
          },
          {
            timeoutMs,
            signal: abortController.signal,
          },
        ),
      );
      return {
        ...(await collector.collect(turn.turn, {
          timeoutMs,
          signal: abortController.signal,
        })),
        model,
      };
    } finally {
      requestCleanup();
      cleanup();
    }
  } catch (error) {
    if (ownsClient && isCodexAppServerStartSelectionChangedError(error) && selectionAttempt === 0)
      retrySelection = true;
    else throw error;
  } finally {
    clearTimeout(timeout);
    params.signal?.removeEventListener("abort", abortFromCaller);
    if (ownsClient) client.close();
  }
  if (retrySelection)
    return await runBoundedCodexAppServerTurnInWorkspace(
      params,
      appServer,
      workspace,
      selectionAttempt + 1,
      {
        deadline,
        timeoutMs: totalTimeoutMs,
      },
    );
  throw new Error("Codex bounded turn selection retry exited unexpectedly");
}
function resolveBoundedThreadConfig(params, workspace) {
  const boundedConfig =
    mergeCodexThreadConfigs(CODEX_BOUNDED_THREAD_CONFIG, params.threadConfig) ??
    CODEX_BOUNDED_THREAD_CONFIG;
  return workspace.codexHome
    ? (mergeCodexThreadConfigs(boundedConfig, CODEX_PRIVATE_BOUNDED_THREAD_CONFIG) ?? boundedConfig)
    : boundedConfig;
}
function buildPrivateCodexAppServerStartOptions(start, codexHome) {
  const privateEnv = Object.fromEntries(
    Object.entries(start.env ?? {}).filter(
      ([name]) => name.trim().toUpperCase() !== OPENCLAW_CODEX_APP_SERVER_ARGS_ENV_VAR,
    ),
  );
  const clearEnv = (start.clearEnv ?? []).filter((name) => {
    const normalized = name.trim().toUpperCase();
    return normalized !== "CODEX_HOME" && normalized !== OPENCLAW_CODEX_APP_SERVER_ARGS_ENV_VAR;
  });
  return {
    ...start,
    args: [...CODEX_PRIVATE_STDIO_ARGS],
    env: {
      ...privateEnv,
      CODEX_HOME: codexHome,
    },
    clearEnv: [...clearEnv, OPENCLAW_CODEX_APP_SERVER_ARGS_ENV_VAR],
  };
}
function createCodexBoundedApprovalHandler(taskLabel) {
  return (request) => {
    if (
      request.method === "item/commandExecution/requestApproval" ||
      request.method === "item/fileChange/requestApproval"
    )
      return {
        decision: "decline",
        reason: `OpenClaw Codex ${taskLabel} does not grant tool or file approvals.`,
      };
    if (request.method === "item/permissions/requestApproval")
      return {
        permissions: {},
        scope: "turn",
      };
    if (request.method.includes("requestApproval"))
      return {
        decision: "decline",
        reason: `OpenClaw Codex ${taskLabel} does not grant native approvals.`,
      };
    if (request.method === "mcpServer/elicitation/request") return { action: "decline" };
  };
}
async function resolveCodexBoundedTurnModel(params) {
  const listed = readModelListResult(
    await params.client.request(
      "model/list",
      {
        limit: null,
        cursor: null,
        includeHidden: false,
      },
      {
        timeoutMs: Math.min(params.timeoutMs, 5e3),
        signal: params.signal,
      },
    ),
  ).models;
  if (params.selection.mode === "live-default") {
    const supported = listed.filter((entry) =>
      params.requiredModalities.every((modality) => entry.inputModalities.includes(modality)),
    );
    const selected = supported.find((entry) => entry.isDefault) ?? supported[0];
    if (!selected)
      throw new Error(
        `Codex app-server has no model supporting ${params.requiredModalities.join(" and ")} input.`,
      );
    return selected.model;
  }
  const model = params.selection.id;
  const match = listed.find((entry) => entry.model === model || entry.id === model);
  if (!match) throw new Error(`Codex app-server model not found: ${model}`);
  if (params.requiredModalities.includes("image") && !match.inputModalities.includes("image"))
    throw new Error(`Codex app-server model does not support images: ${model}`);
  if (params.requiredModalities.includes("text") && !match.inputModalities.includes("text"))
    throw new Error(`Codex app-server model does not support text: ${model}`);
  return model;
}
function createCodexBoundedTurnCollector(threadId, taskLabel) {
  let turnId;
  let completedTurn;
  let promptError;
  const pending = [];
  const completedItems = /* @__PURE__ */ new Map();
  const assistantTextByItem = /* @__PURE__ */ new Map();
  const assistantItemOrder = [];
  let resolveCompletion;
  const completion = new Promise((resolve) => {
    resolveCompletion = resolve;
  });
  const rememberAssistantText = (itemId, text) => {
    if (!text) return;
    if (!assistantTextByItem.has(itemId)) assistantItemOrder.push(itemId);
    assistantTextByItem.set(itemId, text);
  };
  const handleNotification = (notification) => {
    const params = isJsonObject(notification.params) ? notification.params : void 0;
    if (!params || readString(params, "threadId") !== threadId) return;
    if (!turnId) {
      pending.push(notification);
      return;
    }
    if (readNotificationTurnId(params) !== turnId) return;
    if (notification.method === "item/completed") {
      const item = readCodexNotificationItem(notification.params);
      if (item) {
        completedItems.set(item.id, item);
        if (item.type === "agentMessage" && typeof item.text === "string")
          rememberAssistantText(item.id, item.text);
      }
      return;
    }
    if (notification.method === "item/agentMessage/delta") {
      const itemId = readString(params, "itemId") ?? readString(params, "id") ?? "assistant";
      const delta = readString(params, "delta") ?? "";
      rememberAssistantText(itemId, `${assistantTextByItem.get(itemId) ?? ""}${delta}`);
      return;
    }
    if (notification.method === "turn/completed") {
      completedTurn =
        readCodexTurnCompletedNotification(notification.params)?.turn ?? completedTurn;
      resolveCompletion?.();
      return;
    }
    if (notification.method === "error") {
      promptError =
        readCodexErrorNotification(notification.params)?.error.message ??
        `codex app-server ${taskLabel} turn failed`;
      resolveCompletion?.();
    }
  };
  return {
    handleNotification,
    async collect(startedTurn, options) {
      turnId = startedTurn.id;
      if (isTerminalTurn(startedTurn)) completedTurn = startedTurn;
      for (const notification of pending.splice(0)) handleNotification(notification);
      if (!completedTurn && !promptError)
        await waitForTurnCompletion({
          completion,
          timeoutMs: options.timeoutMs,
          signal: options.signal,
          taskLabel,
        });
      if (promptError) throw new Error(promptError);
      if (completedTurn?.status === "failed")
        throw new Error(
          completedTurn.error?.message ?? `codex app-server ${taskLabel} turn failed`,
        );
      const items = collectCompletedItems(completedTurn?.items, completedItems);
      const itemText = collectAssistantTextFromItems(items);
      const deltaText = assistantItemOrder
        .map((itemId) => assistantTextByItem.get(itemId)?.trim())
        .filter((text) => Boolean(text))
        .join("\n\n")
        .trim();
      const text = (itemText || deltaText).trim();
      if (!text) throw new Error(`Codex app-server ${taskLabel} turn returned no text.`);
      return {
        text,
        items,
      };
    },
  };
}
function collectCompletedItems(turnItems, notificationItems) {
  const items = new Map(notificationItems);
  for (const item of turnItems ?? []) items.set(item.id, item);
  return [...items.values()];
}
async function waitForTurnCompletion(params) {
  if (params.signal.aborted) throw new Error(`codex app-server ${params.taskLabel} turn aborted`);
  let timeout;
  let cleanupAbort;
  try {
    await Promise.race([
      params.completion,
      new Promise((_, reject) => {
        timeout = setTimeout(
          () =>
            reject(
              /* @__PURE__ */ new Error(`codex app-server ${params.taskLabel} turn timed out`),
            ),
          params.timeoutMs,
        );
        timeout.unref?.();
        const abortListener = () =>
          reject(/* @__PURE__ */ new Error(`codex app-server ${params.taskLabel} turn aborted`));
        params.signal.addEventListener("abort", abortListener, { once: true });
        cleanupAbort = () => params.signal.removeEventListener("abort", abortListener);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
    cleanupAbort?.();
  }
}
function collectAssistantTextFromItems(items) {
  return (items ?? [])
    .filter((item) => item.type === "agentMessage")
    .map((item) => item.text.trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}
function readNotificationTurnId(record) {
  const direct = readString(record, "turnId");
  if (direct) return direct;
  return isJsonObject(record.turn) ? readString(record.turn, "id") : void 0;
}
function readString(record, key) {
  const value = record[key];
  return typeof value === "string" ? value : void 0;
}
function isTerminalTurn(turn) {
  return turn.status === "completed" || turn.status === "interrupted" || turn.status === "failed";
}
//#endregion
export { runBoundedCodexAppServerTurn as t };
