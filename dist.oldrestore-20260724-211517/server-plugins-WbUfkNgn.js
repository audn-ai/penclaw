import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { c as normalizePluginsConfig } from "./config-state-C1Qyxaws.js";
import { t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-CiIBNuZX.js";
import { n as resolveGlobalSingleton } from "./global-singleton-PwlQSEal.js";
import { r as createPluginRuntimeLoaderLogger } from "./load-context-ux2duVks.js";
import {
  o as loadOpenClawPlugins,
  t as clearActivatedPluginRuntimeState,
} from "./loader-3uGIvPnj.js";
import "./version-CwNT1gaY.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BcuK-xC3.js";
import {
  a as normalizeModelRef,
  c as parseModelRef,
} from "./model-selection-normalize-BoKGJiBx.js";
import "./method-scopes-DrxGpKMT.js";
import {
  l as resolveNodeCommandAllowlist,
  o as isNodeCommandAllowed,
} from "./node-command-policy-pdhFRd-t.js";
import { c as normalizeOperatorScopeList, t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DAo0bjMj.js";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-C52ChtE8.js";
import { i as getPluginModuleLoaderStats } from "./plugin-module-loader-cache-CDpLvLFE.js";
import "./model-selection-DOlkTrQa.js";
import {
  D as setActivePluginRegistry,
  O as createEmptyPluginRegistry,
  c as getActivePluginRegistry,
} from "./runtime-CcYnX0B4.js";
import { n as getFallbackGatewayContext } from "./server-plugin-fallback-context-D6HXEDNK.js";
import { n as GatewayClientRequestError } from "./src-BOx4iLSi.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { s as resolveSafeTimeoutDelayMs } from "./timeouts-Dewo7BbT.js";
import { r as isKnownCoreToolId } from "./tool-catalog-fgOwzAUV.js";
import { m as normalizeToolName } from "./tool-policy-1QHiwXPv.js";
//#region src/gateway/server-plugin-runtime-client.ts
function createSyntheticPluginRuntimeClient(params) {
  const pluginRuntimeOwnerId =
    typeof params?.pluginRuntimeOwnerId === "string" && params.pluginRuntimeOwnerId.trim()
      ? params.pluginRuntimeOwnerId.trim()
      : void 0;
  return {
    connect: {
      minProtocol: 4,
      maxProtocol: 4,
      client: {
        id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
        version: "internal",
        platform: "node",
        mode: GATEWAY_CLIENT_MODES.BACKEND,
      },
      role: "operator",
      scopes: params?.scopes ?? ["operator.write"],
    },
    internal: {
      allowModelOverride: params?.allowModelOverride === true,
      ...(params?.agentRunTracking ? { agentRunTracking: params.agentRunTracking } : {}),
      ...(params?.cronRunContinuation === true ? { cronRunContinuation: true } : {}),
      ...(params?.scopes?.includes("operator.approvals") ? { approvalRuntime: true } : {}),
      ...(pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {}),
      ...(params?.runtimePluginToolGrant
        ? { runtimePluginToolGrant: params.runtimePluginToolGrant }
        : {}),
    },
  };
}
function mergePluginRuntimeClientInternal(client, internal) {
  if (!client || !internal) return client ?? null;
  return {
    ...client,
    internal: {
      ...client.internal,
      ...internal,
    },
  };
}
function resolvePluginSubagentToolsAlsoAllow(params) {
  const requested = uniqueStrings(
    (params.toolsAlsoAllow ?? []).map((entry) => normalizeToolName(entry.trim())).filter(Boolean),
  );
  if (requested.length === 0) return;
  const pluginId = params.pluginId?.trim();
  if (!pluginId) throw new Error("toolsAlsoAllow requires plugin identity for subagent runs.");
  const registry = getActivePluginRegistry();
  for (const toolName of requested) {
    if (isKnownCoreToolId(toolName))
      throw new Error(`plugin "${pluginId}" may not add core tool "${toolName}" to subagent runs.`);
    const owners = uniqueStrings(
      (registry?.tools ?? [])
        .filter((registration) =>
          [...registration.names, ...(registration.declaredNames ?? [])].some(
            (registeredName) => normalizeToolName(registeredName) === toolName,
          ),
        )
        .map((registration) => registration.pluginId),
    );
    if (owners.length !== 1 || owners[0] !== pluginId)
      throw new Error(`plugin "${pluginId}" does not uniquely own subagent tool "${toolName}".`);
  }
  return {
    pluginId,
    toolNames: requested,
  };
}
//#endregion
//#region src/gateway/server-plugins-node-runtime.ts
function hasInProcessGatewayContext() {
  return Boolean(getPluginRuntimeGatewayRequestScope()?.context ?? getFallbackGatewayContext());
}
function projectGatewayRuntimeNodes(nodes) {
  const context = getPluginRuntimeGatewayRequestScope()?.context ?? getFallbackGatewayContext();
  return nodes.map((node) => {
    if (
      !node ||
      typeof node !== "object" ||
      Array.isArray(node) ||
      !context?.nodeRegistry?.get ||
      !context.getRuntimeConfig
    )
      return node;
    const nodeRecord = node;
    const nodeId = typeof nodeRecord.nodeId === "string" ? nodeRecord.nodeId : "";
    const liveNode = nodeId ? context.nodeRegistry.get(nodeId) : void 0;
    if (!liveNode) return node;
    const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
      ...liveNode,
      approvedCommands: liveNode.commands,
    });
    const invocableCommands = liveNode.commands.filter(
      (command) =>
        isNodeCommandAllowed({
          command,
          declaredCommands: liveNode.commands,
          allowlist,
        }).ok,
    );
    return Object.assign({}, nodeRecord, { invocableCommands });
  });
}
//#endregion
//#region src/gateway/server-plugins.ts
const PLUGIN_SUBAGENT_POLICY_STATE_KEY = Symbol.for("openclaw.pluginSubagentOverridePolicyState");
const getPluginSubagentPolicyState = () =>
  resolveGlobalSingleton(PLUGIN_SUBAGENT_POLICY_STATE_KEY, () => ({ policies: {} }));
function normalizeAllowedModelRef(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed === "*") return "*";
  const parsed = parseModelCatalogRef(trimmed);
  if (!parsed) return null;
  const normalized = normalizeModelRef(parsed.provider, parsed.modelId);
  return `${normalized.provider}/${normalized.model}`;
}
function setPluginSubagentOverridePolicies(cfg) {
  const pluginSubagentPolicyState = getPluginSubagentPolicyState();
  const normalized = normalizePluginsConfig(cfg.plugins);
  const policies = {};
  for (const [pluginId, entry] of Object.entries(normalized.entries)) {
    const allowModelOverride = entry.subagent?.allowModelOverride === true;
    const hasConfiguredAllowlist = entry.subagent?.hasAllowedModelsConfig === true;
    const configuredAllowedModels = entry.subagent?.allowedModels ?? [];
    const allowedModels = /* @__PURE__ */ new Set();
    let allowAnyModel = false;
    for (const modelRef of configuredAllowedModels) {
      const normalizedModelRef = normalizeAllowedModelRef(modelRef);
      if (!normalizedModelRef) continue;
      if (normalizedModelRef === "*") {
        allowAnyModel = true;
        continue;
      }
      allowedModels.add(normalizedModelRef);
    }
    if (
      !allowModelOverride &&
      !hasConfiguredAllowlist &&
      allowedModels.size === 0 &&
      !allowAnyModel
    )
      continue;
    policies[pluginId] = {
      allowModelOverride,
      allowAnyModel,
      hasConfiguredAllowlist,
      allowedModels,
    };
  }
  pluginSubagentPolicyState.policies = policies;
}
function authorizeFallbackModelOverride(params) {
  const pluginSubagentPolicyState = getPluginSubagentPolicyState();
  const pluginId = params.pluginId?.trim();
  if (!pluginId)
    return {
      allowed: false,
      reason: "provider/model override requires plugin identity in fallback subagent runs.",
    };
  const policy = pluginSubagentPolicyState.policies[pluginId];
  if (!policy?.allowModelOverride)
    return {
      allowed: false,
      reason: `plugin "${pluginId}" is not trusted for fallback provider/model override requests. See https://docs.openclaw.ai/plugins/sdk-runtime#api-runtime-subagent and search for: plugins.entries.<id>.subagent.allowModelOverride`,
    };
  if (policy.allowAnyModel) return { allowed: true };
  if (policy.hasConfiguredAllowlist && policy.allowedModels.size === 0)
    return {
      allowed: false,
      reason: `plugin "${pluginId}" configured subagent.allowedModels, but none of the entries normalized to a valid provider/model target.`,
    };
  if (policy.allowedModels.size === 0) return { allowed: true };
  const requestedModelRef = resolveRequestedFallbackModelRef(params);
  if (!requestedModelRef)
    return {
      allowed: false,
      reason:
        "fallback provider/model overrides that use an allowlist must resolve to a canonical provider/model target.",
    };
  if (policy.allowedModels.has(requestedModelRef)) return { allowed: true };
  return {
    allowed: false,
    reason: `model override "${requestedModelRef}" is not allowlisted for plugin "${pluginId}".`,
  };
}
function resolveRequestedFallbackModelRef(params) {
  if (params.provider && params.model) {
    const normalizedRequest = normalizeModelRef(params.provider, params.model);
    return `${normalizedRequest.provider}/${normalizedRequest.model}`;
  }
  const rawModel = params.model?.trim();
  if (!rawModel || !rawModel.includes("/")) return null;
  const parsed = parseModelRef(rawModel, "");
  if (!parsed?.provider || !parsed.model) return null;
  return `${parsed.provider}/${parsed.model}`;
}
function hasAdminScope(client) {
  return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(
    ADMIN_SCOPE,
  );
}
function canClientUseModelOverride(client) {
  return hasAdminScope(client) || client?.internal?.allowModelOverride === true;
}
function canTrustedOfficialPluginRequestScopes(params) {
  if (!params.pluginId) return false;
  if (params.pluginOrigin === "bundled" || params.pluginTrustedOfficialInstall === true)
    return true;
  const record = getActivePluginRegistry()?.plugins.find((entry) => entry.id === params.pluginId);
  return record?.origin === "bundled" || record?.trustedOfficialInstall === true;
}
function resolveRuntimeNodeInvokeSyntheticScopes(params) {
  return params.requestedScopes && canTrustedOfficialPluginRequestScopes(params)
    ? params.requestedScopes
    : void 0;
}
function unwrapGatewayMethodDispatchResponse(method, response) {
  if (!response.ok)
    throw new GatewayClientRequestError({
      code: response.error?.code,
      message: response.error?.message ?? `Gateway method "${method}" failed.`,
      details: response.error?.details,
      retryable: response.error?.retryable,
      retryAfterMs: response.error?.retryAfterMs,
    });
  return response.payload;
}
function resolveInProcessDispatchTimeoutMs(timeoutMs) {
  return typeof timeoutMs === "number" && Number.isFinite(timeoutMs)
    ? resolveSafeTimeoutDelayMs(timeoutMs)
    : void 0;
}
function resolveInProcessDispatchDeadlineMs(timeoutMs) {
  const safeTimeoutMs = resolveInProcessDispatchTimeoutMs(timeoutMs);
  return safeTimeoutMs === void 0 ? void 0 : Date.now() + safeTimeoutMs;
}
function resolveRemainingInProcessDispatchTimeoutMs(deadlineMs) {
  return deadlineMs === void 0
    ? void 0
    : resolveSafeTimeoutDelayMs(deadlineMs - Date.now(), { minMs: 0 });
}
async function waitForInProcessDispatch(method, promise, deadlineMs) {
  const remainingTimeoutMs = resolveRemainingInProcessDispatchTimeoutMs(deadlineMs);
  if (remainingTimeoutMs === void 0) return await promise;
  let timeout;
  try {
    return await Promise.race([
      promise,
      new Promise((_resolve, reject) => {
        timeout = setTimeout(() => {
          reject(/* @__PURE__ */ new Error(`gateway request timeout for ${method}`));
        }, remainingTimeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
async function dispatchGatewayMethodInProcessRaw(method, params, options) {
  const scope = getPluginRuntimeGatewayRequestScope();
  const context = scope?.context ?? getFallbackGatewayContext();
  const isWebchatConnect = scope?.isWebchatConnect ?? (() => false);
  if (!context)
    throw new Error(
      `In-process gateway dispatch requires a gateway request scope (method: ${method}). No scope set and no fallback context available.`,
    );
  if (options?.requireScopedClient === true && !scope?.client)
    throw new Error(
      `In-process gateway dispatch requires an authenticated plugin request scope (method: ${method}).`,
    );
  let firstResponse;
  let finalResponse;
  let resolveFirstResponse;
  let rejectFirstResponse;
  let resolveFinalResponse;
  let rejectFinalResponse;
  let postFirstResponseError;
  const firstResponsePromise = new Promise((resolve, reject) => {
    resolveFirstResponse = resolve;
    rejectFirstResponse = reject;
  });
  const deadlineMs = resolveInProcessDispatchDeadlineMs(options?.timeoutMs);
  const { handleGatewayRequest } = await import("./server-methods-BCmW-KRm.js");
  const pluginRuntimeOwnerId =
    typeof options?.pluginRuntimeOwnerId === "string" && options.pluginRuntimeOwnerId.trim()
      ? options.pluginRuntimeOwnerId.trim()
      : void 0;
  const syntheticClient = createSyntheticPluginRuntimeClient({
    allowModelOverride: options?.allowSyntheticModelOverride === true,
    agentRunTracking: options?.agentRunTracking,
    cronRunContinuation: options?.allowSyntheticCronRunContinuation === true,
    ...(pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {}),
    ...(options?.runtimePluginToolGrant
      ? { runtimePluginToolGrant: options.runtimePluginToolGrant }
      : {}),
    scopes: options?.syntheticScopes,
  });
  const scopedClient = mergePluginRuntimeClientInternal(
    scope?.client,
    pluginRuntimeOwnerId || options?.agentRunTracking || options?.runtimePluginToolGrant
      ? {
          ...(options?.agentRunTracking ? { agentRunTracking: options.agentRunTracking } : {}),
          ...(pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {}),
          runtimePluginToolGrant: options?.runtimePluginToolGrant,
        }
      : void 0,
  );
  if (options?.disableSyntheticClient === true && !scopedClient)
    throw new Error(`In-process gateway dispatch requires a scoped client (method: ${method}).`);
  handleGatewayRequest({
    req: {
      type: "req",
      id: `plugin-subagent-${randomUUID()}`,
      method,
      params,
    },
    client:
      options?.forceSyntheticClient === true
        ? syntheticClient
        : (scopedClient ?? (options?.disableSyntheticClient === true ? null : syntheticClient)),
    isWebchatConnect,
    respond: (ok, payload, error, meta) => {
      const response = {
        ok,
        payload,
        error,
        ...(meta ? { meta } : {}),
      };
      if (!firstResponse) {
        firstResponse = response;
        resolveFirstResponse?.(response);
        return;
      }
      if (!finalResponse) {
        finalResponse = response;
        resolveFinalResponse?.(response);
      }
    },
    context,
  })
    .then(() => {
      if (!firstResponse)
        rejectFirstResponse?.(
          /* @__PURE__ */ new Error(`Gateway method "${method}" completed without a response.`),
        );
    })
    .catch((err) => {
      const error = err instanceof Error ? err : new Error(String(err));
      if (!firstResponse) {
        rejectFirstResponse?.(error);
        return;
      }
      postFirstResponseError = error;
      rejectFinalResponse?.(error);
    });
  firstResponse = await waitForInProcessDispatch(method, firstResponsePromise, deadlineMs);
  const firstPayload = firstResponse.payload;
  if (options?.expectFinal !== true || firstPayload?.status !== "accepted") return firstResponse;
  if (postFirstResponseError) throw postFirstResponseError;
  return (
    finalResponse ??
    (await new Promise((resolve, reject) => {
      resolveFinalResponse = resolve;
      const timeoutMs = resolveRemainingInProcessDispatchTimeoutMs(deadlineMs);
      const timeout =
        timeoutMs === void 0
          ? void 0
          : setTimeout(() => {
              reject(/* @__PURE__ */ new Error(`gateway request timeout for ${method}`));
            }, timeoutMs);
      const clearFinalTimeout = () => {
        if (timeout) clearTimeout(timeout);
      };
      rejectFinalResponse = (err) => {
        clearFinalTimeout();
        reject(err);
      };
      if (postFirstResponseError) {
        rejectFinalResponse(postFirstResponseError);
        return;
      }
      if (finalResponse) {
        clearFinalTimeout();
        resolve(finalResponse);
        return;
      }
      resolveFinalResponse = (response) => {
        clearFinalTimeout();
        resolve(response);
      };
    }))
  );
}
async function dispatchGatewayMethod(method, params, options) {
  return unwrapGatewayMethodDispatchResponse(
    method,
    await dispatchGatewayMethodInProcessRaw(method, params, options),
  );
}
async function dispatchGatewayMethodInProcess(method, params, options) {
  return await dispatchGatewayMethod(method, params, options);
}
async function dispatchTrustedPluginGatewayMethod(method, params = {}, options) {
  const scope = getPluginRuntimeGatewayRequestScope();
  const pluginId = scope?.pluginId?.trim();
  if (!canTrustedOfficialPluginRequestScopes(scope ?? {}))
    throw new Error("Gateway requests are only available to bundled or trusted official plugins.");
  const syntheticScopes = normalizeOperatorScopeList(options?.scopes);
  return await dispatchGatewayMethod(method, params, {
    forceSyntheticClient: true,
    pluginRuntimeOwnerId: pluginId,
    ...(syntheticScopes ? { syntheticScopes } : {}),
    ...(options?.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {}),
  });
}
const PLUGIN_SUBAGENT_SESSION_MESSAGES_MAX_LIMIT = 1e3;
function createGatewaySubagentRuntime() {
  const getSessionMessages = async (params) => {
    const limit =
      params.limit == null || !Number.isFinite(params.limit)
        ? void 0
        : Math.min(
            PLUGIN_SUBAGENT_SESSION_MESSAGES_MAX_LIMIT,
            Math.max(1, Math.floor(params.limit)),
          );
    const payload = await dispatchGatewayMethod("sessions.get", {
      key: params.sessionKey,
      ...(limit != null && { limit }),
    });
    return { messages: Array.isArray(payload?.messages) ? payload.messages : [] };
  };
  return {
    async run(params) {
      const scope = getPluginRuntimeGatewayRequestScope();
      const pluginId =
        typeof scope?.pluginId === "string" && scope.pluginId.trim()
          ? scope.pluginId.trim()
          : void 0;
      const runtimePluginToolGrant = resolvePluginSubagentToolsAlsoAllow({
        pluginId,
        toolsAlsoAllow: params.toolsAlsoAllow,
      });
      const overrideRequested = Boolean(params.provider || params.model);
      const hasRequestScopeClient = Boolean(scope?.client);
      let allowOverride = hasRequestScopeClient && canClientUseModelOverride(scope?.client ?? null);
      let allowSyntheticModelOverride = false;
      if (overrideRequested && !allowOverride && !hasRequestScopeClient) {
        const fallbackAuth = authorizeFallbackModelOverride({
          pluginId: scope?.pluginId,
          provider: params.provider,
          model: params.model,
        });
        if (!fallbackAuth.allowed) throw new Error(fallbackAuth.reason);
        allowOverride = true;
        allowSyntheticModelOverride = true;
      }
      if (overrideRequested && !allowOverride)
        throw new Error("provider/model override is not authorized for this plugin subagent run.");
      const runId = (
        await dispatchGatewayMethod(
          "agent",
          {
            sessionKey: params.sessionKey,
            message: params.message,
            deliver: params.deliver ?? false,
            ...(allowOverride && params.provider && { provider: params.provider }),
            ...(allowOverride && params.model && { model: params.model }),
            ...(params.extraSystemPrompt && { extraSystemPrompt: params.extraSystemPrompt }),
            ...(params.lane && { lane: params.lane }),
            ...(params.cwd && { cwd: params.cwd }),
            ...(params.lightContext === true && { bootstrapContextMode: "lightweight" }),
            idempotencyKey: params.idempotencyKey || randomUUID(),
          },
          {
            allowSyntheticModelOverride,
            agentRunTracking: "plugin_subagent",
            ...(pluginId ? { pluginRuntimeOwnerId: pluginId } : {}),
            ...(runtimePluginToolGrant ? { runtimePluginToolGrant } : {}),
          },
        )
      )?.runId;
      if (typeof runId !== "string" || !runId)
        throw new Error("Gateway agent method returned an invalid runId.");
      return { runId };
    },
    async waitForRun(params) {
      const payload = await dispatchGatewayMethod("agent.wait", {
        runId: params.runId,
        ...(params.timeoutMs != null && { timeoutMs: params.timeoutMs }),
      });
      let status = payload?.status;
      if (status === "completed" || status === "succeeded") status = "ok";
      else if (status === "error" && payload?.error?.trim().toLowerCase() === "completed")
        status = "ok";
      if (status !== "ok" && status !== "error" && status !== "timeout")
        throw new Error(`Gateway agent.wait returned unexpected status: ${payload?.status}`);
      return {
        status,
        ...(status !== "ok" &&
          typeof payload?.error === "string" &&
          payload.error && { error: payload.error }),
      };
    },
    getSessionMessages,
    async getSession(params) {
      return getSessionMessages(params);
    },
    async deleteSession(params) {
      const scope = getPluginRuntimeGatewayRequestScope();
      const pluginId =
        typeof scope?.pluginId === "string" && scope.pluginId.trim()
          ? scope.pluginId.trim()
          : void 0;
      const pluginOwnedCleanupOptions = pluginId
        ? {
            pluginRuntimeOwnerId: pluginId,
            ...(!hasAdminScope(scope?.client)
              ? {
                  forceSyntheticClient: true,
                  syntheticScopes: [ADMIN_SCOPE],
                }
              : {}),
          }
        : void 0;
      await dispatchGatewayMethod(
        "sessions.delete",
        {
          key: params.sessionKey,
          deleteTranscript: params.deleteTranscript ?? true,
        },
        pluginOwnedCleanupOptions,
      );
    },
  };
}
function createGatewayNodesRuntime() {
  return {
    async list(params) {
      const payload = await dispatchGatewayMethod("node.list", {});
      const nodes = Array.isArray(payload?.nodes) ? payload.nodes : [];
      return {
        nodes: projectGatewayRuntimeNodes(
          params?.connected === true
            ? nodes.filter(
                (node) => node !== null && typeof node === "object" && node.connected === true,
              )
            : nodes,
        ),
      };
    },
    async invoke(params) {
      const scope = getPluginRuntimeGatewayRequestScope();
      const pluginId =
        typeof scope?.pluginId === "string" && scope.pluginId.trim()
          ? scope.pluginId.trim()
          : void 0;
      const syntheticScopes = resolveRuntimeNodeInvokeSyntheticScopes({
        pluginId,
        pluginOrigin: scope?.pluginOrigin,
        pluginTrustedOfficialInstall: scope?.pluginTrustedOfficialInstall,
        requestedScopes: normalizeOperatorScopeList(params.scopes),
      });
      return await dispatchGatewayMethod(
        "node.invoke",
        {
          nodeId: params.nodeId,
          command: params.command,
          ...(params.params !== void 0 && { params: params.params }),
          timeoutMs: params.timeoutMs,
          idempotencyKey: params.idempotencyKey || randomUUID(),
        },
        {
          ...(pluginId ? { pluginRuntimeOwnerId: pluginId } : {}),
          ...(syntheticScopes
            ? {
                forceSyntheticClient: true,
                syntheticScopes,
              }
            : {}),
        },
      );
    },
  };
}
function createGatewayPluginRegistrationLogger(params) {
  const logger = createPluginRuntimeLoaderLogger();
  if (params?.suppressInfoLogs !== true) return logger;
  return {
    ...logger,
    info: (_message) => void 0,
  };
}
function loadGatewayPlugins(params) {
  const started = performance.now();
  const activationAutoEnabled =
    params.activationSourceConfig !== void 0 && params.autoEnabledReasons === void 0
      ? applyPluginAutoEnable({
          config: params.activationSourceConfig,
          env: process.env,
          ...(params.pluginLookUpTable?.manifestRegistry
            ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry }
            : {}),
          discovery: params.pluginLookUpTable?.discovery,
        })
      : void 0;
  const autoEnableMs = performance.now() - started;
  const autoEnabled =
    params.activationSourceConfig !== void 0
      ? {
          config: params.cfg,
          changes: activationAutoEnabled?.changes ?? [],
          autoEnabledReasons:
            params.autoEnabledReasons ?? activationAutoEnabled?.autoEnabledReasons ?? {},
        }
      : params.autoEnabledReasons !== void 0
        ? {
            config: params.cfg,
            changes: [],
            autoEnabledReasons: params.autoEnabledReasons,
          }
        : applyPluginAutoEnable({
            config: params.cfg,
            env: process.env,
            ...(params.pluginLookUpTable?.manifestRegistry
              ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry }
              : {}),
            discovery: params.pluginLookUpTable?.discovery,
          });
  const resolvedConfigMs = performance.now() - started;
  const resolvedConfig = autoEnabled.config;
  const pluginIds = params.pluginIds ?? [
    ...(
      params.pluginLookUpTable ??
      loadPluginLookUpTable({
        config: resolvedConfig,
        activationSourceConfig: params.activationSourceConfig,
        workspaceDir: params.workspaceDir,
        env: process.env,
      })
    ).startup.pluginIds,
  ];
  const pluginIdsMs = performance.now() - started;
  if (pluginIds.length === 0) {
    clearActivatedPluginRuntimeState();
    const pluginRegistry = createEmptyPluginRegistry();
    setActivePluginRegistry(pluginRegistry, void 0, "gateway-bindable", params.workspaceDir);
    params.startupTrace?.detail("plugins.gateway-load", [
      ["autoEnableMs", autoEnableMs],
      ["resolvedConfigMs", resolvedConfigMs],
      ["pluginIdsMs", pluginIdsMs],
      ["loadMs", 0],
      ["pluginIds", "0"],
      ["pluginCount", 0],
      ["gatewayHandlerCount", 0],
    ]);
    return {
      pluginRegistry,
      gatewayMethods: [...params.baseMethods],
    };
  }
  const beforeLoad = performance.now();
  const loaderStatsBefore = getPluginModuleLoaderStats();
  const pluginRegistry = loadOpenClawPlugins({
    config: resolvedConfig,
    activationSourceConfig: params.activationSourceConfig ?? params.cfg,
    autoEnabledReasons: autoEnabled.autoEnabledReasons,
    workspaceDir: params.workspaceDir,
    onlyPluginIds: pluginIds,
    logger: createGatewayPluginRegistrationLogger({
      suppressInfoLogs: params.suppressPluginInfoLogs,
    }),
    ...(params.coreGatewayHandlers !== void 0 && {
      coreGatewayHandlers: params.coreGatewayHandlers,
    }),
    ...(params.coreGatewayMethodNames !== void 0 && {
      coreGatewayMethodNames: params.coreGatewayMethodNames,
    }),
    ...(params.hostServices !== void 0 && { hostServices: params.hostServices }),
    runtimeOptions: { allowGatewaySubagentBinding: true },
    preferSetupRuntimeForChannelPlugins: params.preferSetupRuntimeForChannelPlugins,
    preferBuiltPluginArtifacts: true,
    ...(params.startupTrace !== void 0 && { startupTrace: params.startupTrace }),
    ...(params.pluginLookUpTable?.manifestRegistry
      ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry }
      : {}),
  });
  const loadMs = performance.now() - beforeLoad;
  const loaderStatsAfter = getPluginModuleLoaderStats();
  const pluginMethods = Object.keys(pluginRegistry.gatewayHandlers);
  const gatewayMethods = uniqueStrings([...params.baseMethods, ...pluginMethods]);
  params.startupTrace?.detail("plugins.gateway-load", [
    ["autoEnableMs", autoEnableMs],
    ["resolvedConfigMs", resolvedConfigMs],
    ["pluginIdsMs", pluginIdsMs],
    ["loadMs", loadMs],
    ["pluginIds", String(pluginIds.length)],
    ["pluginCount", pluginIds.length],
    ["gatewayHandlers", String(pluginMethods.length)],
    ["gatewayHandlerCount", pluginMethods.length],
    ["loaderCallsCount", loaderStatsAfter.calls - loaderStatsBefore.calls],
    ["loaderNativeHitsCount", loaderStatsAfter.nativeHits - loaderStatsBefore.nativeHits],
    ["loaderNativeMissesCount", loaderStatsAfter.nativeMisses - loaderStatsBefore.nativeMisses],
    [
      "loaderSourceTransformForcedCount",
      loaderStatsAfter.sourceTransformForced - loaderStatsBefore.sourceTransformForced,
    ],
    [
      "loaderSourceTransformFallbacksCount",
      loaderStatsAfter.sourceTransformFallbacks - loaderStatsBefore.sourceTransformFallbacks,
    ],
    [
      "loaderTopSourceTransformTargets",
      loaderStatsAfter.topSourceTransformTargets
        .slice(0, 3)
        .map((entry) => `${entry.count}:${entry.target}`)
        .join(","),
    ],
  ]);
  return {
    pluginRegistry,
    gatewayMethods,
  };
}
//#endregion
export {
  dispatchTrustedPluginGatewayMethod as a,
  hasInProcessGatewayContext as c,
  dispatchGatewayMethodInProcessRaw as i,
  createGatewaySubagentRuntime as n,
  loadGatewayPlugins as o,
  dispatchGatewayMethodInProcess as r,
  setPluginSubagentOverridePolicies as s,
  createGatewayNodesRuntime as t,
};
