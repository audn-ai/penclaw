import { isDeepStrictEqual } from "node:util";
import { v as onAgentEvent } from "../../agent-events-D4UsOPeT.js";
import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
  r as resolveAgentConfig,
} from "../../agent-scope-config-DVIR1nBa.js";
import {
  a as resolveInheritedToolPolicyForSession,
  o as resolveSubagentToolPolicyForSession,
  r as resolveEffectiveToolPolicy,
} from "../../agent-tools.policy-BQgyHzcD.js";
import "../../agent-scope-y9xQv_q1.js";
import { r as replaceConfigFile, t as mutateConfigFile } from "../../config-BDv-QbJ6.js";
import { i as resolveSandboxConfigForAgent } from "../../config-l1rpbjvM.js";
import { o as mediaKindFromMime } from "../../constants-Mf57IYS0.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "../../defaults-CdX9UGcX.js";
import { o as normalizeDeliveryContext } from "../../delivery-context.shared-WPZGmi9R.js";
import { t as RequestScopedSubagentRuntimeError } from "../../error-runtime-BIAwr399.js";
import { k as normalizeExecTarget } from "../../exec-approvals-Bz218bS2.js";
import { r as runCommandWithTimeout } from "../../exec-CXKmx4dL.js";
import { t as gatewaySubagentState } from "../../gateway-bindings-mC4XKGVC.js";
import { t as getPluginRuntimeGatewayRequestScope } from "../../gateway-request-scope-CiIBNuZX.js";
import { a as shouldLogVerbose } from "../../globals-CNUzHTcU.js";
import { o as requestHeartbeat } from "../../heartbeat-wake-B-63db0Y.js";
import { n as resolveAgentIdentity } from "../../identity-CceraXdn.js";
import { i as getRuntimeConfig } from "../../io-B3ne6NxF.js";
import {
  a as createLazyRuntimeSurface,
  n as createLazyRuntimeMethodBinder,
  r as createLazyRuntimeModule,
  t as createLazyRuntimeMethod,
} from "../../lazy-runtime-B-Fc-m0I.js";
import { s as resolveSessionWorkStartError } from "../../lifecycle-5_TQ_dr5.js";
import { a as logWarn } from "../../logger-BegyOJlO.js";
import {
  b as normalizeLogLevel,
  o as isFileLogLevelEnabled,
  r as getChildLogger,
} from "../../logger-BUux_Jpv.js";
import { f as isVoiceCompatibleAudio } from "../../media-runtime-BhmZORKM.js";
import "../../logging-C8NGWOYr.js";
import { _ as resizeToJpeg, u as getImageMetadata } from "../../media-services-Czws84B5.js";
import "../../model-selection-DOlkTrQa.js";
import { n as detectMime } from "../../mime-BSEMEb3s.js";
import {
  i as buildModelAliasIndex,
  r as buildConfiguredModelCatalog,
  x as resolveModelRefFromString,
} from "../../model-selection-shared-BliwFXJy.js";
import { t as resolveThinkingDefault } from "../../model-thinking-default-C_eCEq4B.js";
import {
  o as generateMusic,
  s as listRuntimeMusicGenerationProviders,
} from "../../openclaw-tools-DGecpaCF.js";
import { y as resolveStateDir } from "../../paths-DEklnbzU.js";
import { l as resolveStorePath } from "../../paths-TfuVT-K8.js";
import {
  n as listRuntimeImageGenerationProviders,
  t as generateImage,
} from "../../runtime-0eEMS5sH.js";
import { t as createRuntimeChannel } from "../../runtime-channel-DksEuOHj.js";
import {
  n as listRuntimeVideoGenerationProviders,
  t as generateVideo,
} from "../../runtime-DTZO5SxU.js";
import "../../runtime-internal-B2_XwK02.js";
import { a as runWebSearch, r as listWebSearchProviders } from "../../runtime-Inp394Wl.js";
import { n as resolveSandboxRuntimeStatus } from "../../runtime-status-DT_QCQQG.js";
import {
  D as patchSessionEntry$1,
  S as loadSessionEntry,
  V as replaceSessionEntry,
  at as updateSessionEntry,
  h as deleteSessionEntryLifecycle,
  nt as rollbackPluginOwnedSessionEntryLifecycle,
  tt as rollbackAgentHarnessSessionEntryLifecycle,
  y as listSessionEntries$1,
} from "../../session-accessor-PZVNxFCV.js";
import { n as resolveSessionModelRef } from "../../session-model-ref-1c6_XVhy.js";
import { o as resolveEffectiveSessionToolsVisibility } from "../../session-visibility-B7S_cwHU.js";
import {
  X as beginSessionWorkAdmission,
  j as normalizeResolvedMaintenanceConfigInput,
  nt as isSessionWorkAdmissionActive,
  rt as runExclusiveSessionLifecycleMutation,
} from "../../store-CzZJhTF6.js";
import { a as enqueueSystemEvent } from "../../system-events-CIAdjAwz.js";
import {
  _ as findLatestTaskFlowForOwner,
  b as resolveTaskFlowForLookupTokenForOwner,
  d as getFlowTaskSummary,
  m as runTaskInFlowForOwner,
  r as cancelFlowByIdForOwner,
  t as cancelDetachedTaskRunById,
  v as getTaskFlowByIdForOwner,
  y as listTaskFlowsForOwner,
} from "../../task-executor-BF9XEI4q.js";
import {
  a as getTaskByIdForOwner,
  o as listTasksForRelatedSessionKeyForOwner,
  r as findLatestTaskForRelatedSessionKeyForOwner,
  s as resolveTaskForLookupTokenForOwner,
} from "../../task-owner-access-CsO1Y--R.js";
import {
  B as failFlow,
  H as finishFlow,
  I as createManagedTaskFlow,
  J as requestFlowCancel,
  X as resumeFlow,
  Z as setFlowWaiting,
  g as listTasksForFlowId,
} from "../../task-registry-C44yDrOW.js";
import { n as summarizeTaskRecords } from "../../task-registry.summary-BwpoHlXv.js";
import { c as resolveThinkingProfile } from "../../thinking-CVcRbjTC.js";
import {
  r as resolveEffectiveAgentRuntime,
  t as concretizeAgentRuntime,
} from "../../thinking-runtime-D675lyzz.js";
import { s as normalizeThinkLevel } from "../../thinking.shared-BWnbgBUO.js";
import { n as resolveAgentTimeoutMs } from "../../timeout-CjPlNzdm.js";
import {
  c as mergeAlsoAllowPolicy,
  f as expandToolGroups,
  h as resolveToolProfilePolicy,
  m as normalizeToolName,
} from "../../tool-policy-1QHiwXPv.js";
import { t as isToolAllowedByPolicies } from "../../tool-policy-match-Bq6mIgOa.js";
import { r as onSessionTranscriptUpdate } from "../../transcript-events-BodrDS39.js";
import { n as VERSION } from "../../version-CeFj_iGk.js";
import { n as loadWebMedia } from "../../web-media-3hQ71Ejp.js";
import { d as ensureAgentWorkspace } from "../../workspace-DXzCbuC0.js";
//#region src/agents/sandbox/workspace-authority.ts
const WORKSPACE_CONFINED_SANDBOX_TOOLS = /* @__PURE__ */ new Set([
  "apply_patch",
  "edit",
  "exec",
  "image",
  "process",
  "read",
  "session_status",
  "sessions_history",
  "sessions_list",
  "sessions_search",
  "sessions_yield",
  "update_plan",
  "web_fetch",
  "web_search",
  "write",
]);
function findUnconfinedAllowedTool(policies, confinedToolNames) {
  const candidatePolicy = policies
    .filter((policy) => Boolean(policy?.allow?.length))
    .toSorted((left, right) => left.allow.length - right.allow.length)[0];
  if (!candidatePolicy?.allow?.length) return "unbounded allow policy";
  for (const entry of candidatePolicy.allow)
    for (const candidate of expandToolGroups([entry])) {
      const normalized = normalizeToolName(candidate);
      if (!isToolAllowedByPolicies(normalized, policies)) continue;
      if (WORKSPACE_CONFINED_SANDBOX_TOOLS.has(normalized) || confinedToolNames.has(normalized))
        continue;
      return entry;
    }
}
function resolveWorkspaceToolPolicies(params) {
  const effective = resolveEffectiveToolPolicy({
    config: params.config,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
    modelProvider: params.modelProvider,
    modelId: params.modelId,
  });
  return [
    mergeAlsoAllowPolicy(resolveToolProfilePolicy(effective.profile), effective.profileAlsoAllow),
    mergeAlsoAllowPolicy(
      resolveToolProfilePolicy(effective.providerProfile),
      effective.providerProfileAlsoAllow,
    ),
    effective.globalPolicy,
    effective.globalProviderPolicy,
    effective.agentPolicy,
    effective.agentProviderPolicy,
    params.sandboxPolicy,
    resolveSubagentToolPolicyForSession(params.config, params.sessionKey),
    resolveInheritedToolPolicyForSession(params.config, params.sessionKey),
  ];
}
function resolveWorkspaceAuthorityModel(params) {
  const selected = resolveSessionModelRef(params.config, params.sessionEntry, params.agentId);
  const explicitProvider = params.modelProvider?.trim();
  const explicitModel = params.modelId?.trim();
  if (!explicitModel)
    return {
      provider: explicitProvider ?? selected.provider,
      model: selected.model,
    };
  const defaultProvider = explicitProvider ?? selected.provider;
  const raw =
    explicitProvider && !explicitModel.includes("/")
      ? `${explicitProvider}/${explicitModel}`
      : explicitModel;
  return (
    resolveModelRefFromString({
      cfg: params.config,
      raw,
      defaultProvider,
      aliasIndex: buildModelAliasIndex({
        cfg: params.config,
        defaultProvider,
      }),
    })?.ref ?? {
      provider: defaultProvider,
      model: explicitModel,
    }
  );
}
function resolveSandboxWorkspaceAuthority(params) {
  const runtime = resolveSandboxRuntimeStatus({
    cfg: params.config,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
  });
  const sandbox = resolveSandboxConfigForAgent(params.config, runtime.agentId);
  if (!runtime.sandboxed)
    return {
      sandboxed: false,
      workspaceAccess: sandbox.workspaceAccess,
    };
  let confinementError;
  if (sandbox.backend !== "docker")
    confinementError = "target sandbox backend does not provide local workspace confinement.";
  else if (sandbox.scope !== "session")
    confinementError = "target sandbox is not exclusive to this worker session.";
  else if (
    sandbox.docker.dangerouslyAllowExternalBindSources === true ||
    sandbox.docker.dangerouslyAllowReservedContainerTargets === true ||
    sandbox.docker.dangerouslyAllowContainerNamespaceJoin === true
  )
    confinementError = "target sandbox enables dangerous Docker isolation overrides.";
  else {
    const elevated = resolveAgentConfig(params.config, runtime.agentId)?.tools?.elevated;
    if (params.config.tools?.elevated?.enabled === true && elevated?.enabled !== false)
      confinementError = "target agent can request host-level elevated execution.";
    const rawSessionExecHost = params.sessionEntry?.execHost?.trim();
    const sessionExecHost = normalizeExecTarget(rawSessionExecHost);
    const execHost =
      sessionExecHost ??
      resolveAgentConfig(params.config, runtime.agentId)?.tools?.exec?.host ??
      params.config.tools?.exec?.host ??
      "auto";
    if (!confinementError && rawSessionExecHost && !sessionExecHost)
      confinementError = "target session has an invalid shell execution override.";
    else if (
      !confinementError &&
      (Boolean(params.sessionEntry?.execNode?.trim()) ||
        (execHost !== "auto" && execHost !== "sandbox"))
    )
      confinementError = "target sandbox routes shell execution outside the sandbox.";
    else if (!confinementError && sandbox.browser.allowHostControl)
      confinementError = "target sandbox allows host browser control.";
    else if (
      !confinementError &&
      ["agent", "all"].includes(
        resolveEffectiveSessionToolsVisibility({
          cfg: params.config,
          sandboxed: true,
        }),
      )
    )
      confinementError = "target sandbox allows access to host-wide sessions.";
    else if (!confinementError) {
      const model = resolveWorkspaceAuthorityModel({
        config: params.config,
        agentId: runtime.agentId,
        sessionEntry: params.sessionEntry,
        modelProvider: params.modelProvider,
        modelId: params.modelId,
      });
      const policies = resolveWorkspaceToolPolicies({
        config: params.config,
        agentId: runtime.agentId,
        sessionKey: params.sessionKey,
        modelProvider: model.provider,
        modelId: model.model,
        sandboxPolicy: sandbox.tools,
      });
      const unavailableTool = (params.requiredToolNames ?? [])
        .map(normalizeToolName)
        .find((name) => !isToolAllowedByPolicies(name, policies));
      if (unavailableTool)
        confinementError = `target tool policy blocks required tool ${unavailableTool}.`;
      else {
        const unsafeTool = findUnconfinedAllowedTool(
          policies,
          new Set((params.confinedToolNames ?? []).map(normalizeToolName)),
        );
        if (unsafeTool)
          confinementError = `target sandbox allows unclassified tool surface ${unsafeTool}.`;
      }
    }
  }
  return {
    sandboxed: true,
    workspaceAccess: sandbox.workspaceAccess,
    ...(confinementError ? { confinementError } : {}),
  };
}
//#endregion
//#region src/plugins/runtime/runtime-agent-thinking.ts
function resolveRuntimeThinkingCatalog(params, buildConfiguredCatalog) {
  if (params.catalog) return params.catalog;
  const configuredCatalog = buildConfiguredCatalog();
  return configuredCatalog.length > 0 ? configuredCatalog : void 0;
}
//#endregion
//#region src/plugins/runtime/runtime-cache.ts
/** Defines a lazily computed enumerable property on a runtime facade. */
function defineCachedValue(target, key, create) {
  let cached;
  let ready = false;
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (!ready) {
        cached = create();
        ready = true;
      }
      return cached;
    },
  });
}
//#endregion
//#region src/plugins/runtime/runtime-agent.ts
const loadEmbeddedAgentRuntime = createLazyRuntimeModule(
  () => import("../../runtime-embedded-agent.runtime-BcL2yiek.js"),
);
function toSessionAccessScope(params) {
  return {
    sessionKey: params.sessionKey,
    ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
    ...(params.env !== void 0 ? { env: params.env } : {}),
    ...(params.hydrateSkillPromptRefs !== void 0
      ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs }
      : {}),
    ...(params.readConsistency !== void 0 ? { readConsistency: params.readConsistency } : {}),
    ...(params.storePath !== void 0 ? { storePath: params.storePath } : {}),
  };
}
function getSessionEntry(params) {
  return loadSessionEntry(toSessionAccessScope(params));
}
function listSessionEntries(params = {}) {
  return listSessionEntries$1({
    ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
    ...(params.env !== void 0 ? { env: params.env } : {}),
    ...(params.hydrateSkillPromptRefs !== void 0
      ? { hydrateSkillPromptRefs: params.hydrateSkillPromptRefs }
      : {}),
    ...(params.storePath !== void 0 ? { storePath: params.storePath } : {}),
  });
}
async function patchSessionEntry(params) {
  return await patchSessionEntry$1(toSessionAccessScope(params), params.update, {
    fallbackEntry: params.fallbackEntry,
    maintenanceConfig:
      params.maintenanceConfig !== void 0
        ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig)
        : void 0,
    preserveActivity: params.preserveActivity,
    replaceEntry: params.replaceEntry,
  });
}
async function updateSessionStoreEntry(params) {
  return await updateSessionEntry(
    {
      sessionKey: params.sessionKey,
      storePath: params.storePath,
    },
    params.update,
    {
      skipMaintenance: params.skipMaintenance,
      takeCacheOwnership: params.takeCacheOwnership,
      requireWriteSuccess: params.requireWriteSuccess,
    },
  );
}
async function upsertSessionEntry(params) {
  await replaceSessionEntry(toSessionAccessScope(params), params.entry);
}
async function createSessionEntry(params) {
  const [{ createGatewaySession }, { resolveGatewaySessionStoreTarget }] = await Promise.all([
    import("../../session-create-service-C7LDrNrS.js"),
    import("../../session-utils-D4f-v1vr.js"),
  ]);
  const target = resolveGatewaySessionStoreTarget({
    cfg: params.cfg,
    key: params.key,
    ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
  });
  const cliInitial = "cliBackendId" in params.initialEntry ? params.initialEntry : void 0;
  const harnessInitial = "agentHarnessId" in params.initialEntry ? params.initialEntry : void 0;
  const identities = /* @__PURE__ */ new Set([target.canonicalKey, ...target.storeKeys]);
  return await runExclusiveSessionLifecycleMutation({
    scope: target.storePath,
    identities,
    prepare: async () => {
      if (isSessionWorkAdmissionActive(target.storePath, identities))
        throw new Error(`Session "${target.canonicalKey}" is still active; retry creation later.`);
    },
    run: async () => {
      const afterCreate = params.afterCreate;
      let callbackContext;
      let finalEntryPatch;
      let rollbackExpectedEntry;
      const runAfterCreate = async (context) => {
        callbackContext = context;
        rollbackExpectedEntry = structuredClone(context.entry);
        if (!afterCreate) return;
        const finalPatch = await afterCreate({
          key: context.key,
          agentId: context.agentId,
          sessionId: context.entry.sessionId,
          entry: structuredClone(context.entry),
        });
        if (finalPatch === void 0) return;
        const patchKeys = Object.keys(finalPatch);
        if (patchKeys.length !== 1 || patchKeys[0] !== "pluginExtensions")
          throw new Error("session creation final patch may only contain pluginExtensions");
        finalEntryPatch = { pluginExtensions: structuredClone(finalPatch.pluginExtensions) };
      };
      try {
        const matchingEntry =
          params.recoverMatchingInitialEntry === true
            ? getSessionEntry({
                sessionKey: target.canonicalKey,
                storePath: target.storePath,
                readConsistency: "latest",
              })
            : void 0;
        let recovered = false;
        let created;
        if (matchingEntry) {
          const expectedSpawnedCwd = params.spawnedCwd?.trim() || void 0;
          const expectedExecNode = params.execNode?.trim() || void 0;
          const expectedExecCwd = params.execCwd?.trim() || void 0;
          if (
            !(
              matchingEntry.initializationPending === true &&
              matchingEntry.agentHarnessId === harnessInitial?.agentHarnessId &&
              matchingEntry.pluginOwnerId === cliInitial?.pluginOwnerId &&
              matchingEntry.modelSelectionLocked === params.initialEntry.modelSelectionLocked &&
              (!cliInitial ||
                (matchingEntry.providerOverride === cliInitial.cliBackendId &&
                  matchingEntry.modelOverride === cliInitial.model &&
                  isDeepStrictEqual(
                    matchingEntry.cliSessionBindings?.[cliInitial.cliBackendId],
                    cliInitial.cliSessionBinding,
                  ))) &&
              matchingEntry.spawnedCwd === expectedSpawnedCwd &&
              matchingEntry.execNode === expectedExecNode &&
              matchingEntry.execCwd === expectedExecCwd &&
              isDeepStrictEqual(
                matchingEntry.pluginExtensions,
                params.initialEntry.pluginExtensions,
              )
            )
          )
            throw new Error(
              `Session "${target.canonicalKey}" does not match its trusted recovery state.`,
            );
          if (!afterCreate) throw new Error("session creation recovery requires an initializer");
          recovered = true;
          created = {
            key: target.canonicalKey,
            agentId: target.agentId,
            entry: matchingEntry,
          };
          await runAfterCreate({
            ...created,
            storePath: target.storePath,
          });
        } else {
          const result = await createGatewaySession({
            cfg: params.cfg,
            key: params.key,
            ...(params.agentId !== void 0 ? { agentId: params.agentId } : {}),
            ...(params.label !== void 0 ? { label: params.label } : {}),
            ...(params.spawnedCwd !== void 0 ? { spawnedCwd: params.spawnedCwd } : {}),
            ...(params.execNode !== void 0 ? { execNode: params.execNode } : {}),
            ...(params.execCwd !== void 0 ? { execCwd: params.execCwd } : {}),
            initialEntry: {
              ...(harnessInitial ? { agentHarnessId: harnessInitial.agentHarnessId } : {}),
              ...(cliInitial
                ? {
                    pluginOwnerId: cliInitial.pluginOwnerId,
                    providerOverride: cliInitial.cliBackendId,
                    modelOverride: cliInitial.model,
                    cliSessionBindings: { [cliInitial.cliBackendId]: cliInitial.cliSessionBinding },
                  }
                : {}),
              ...(params.initialEntry.modelSelectionLocked === true
                ? { modelSelectionLocked: true }
                : {}),
              ...(params.initialEntry.pluginExtensions
                ? { pluginExtensions: params.initialEntry.pluginExtensions }
                : {}),
              ...(afterCreate ? { initializationPending: true } : {}),
            },
            ...(harnessInitial ? { authorizedAgentHarnessId: harnessInitial.agentHarnessId } : {}),
            ...(cliInitial?.pluginOwnerId ? { authorizedPluginId: cliInitial.pluginOwnerId } : {}),
            commandSource: "plugin-runtime",
            ...(afterCreate ? { afterCreate: runAfterCreate } : {}),
          });
          if (!result.ok) throw new Error(result.error.message);
          created = result;
        }
        if (recovered && !finalEntryPatch)
          throw new Error("session creation recovery requires a final patch");
        let finalEntry = created.entry;
        if (afterCreate) {
          const patch = {
            ...finalEntryPatch,
            initializationPending: void 0,
          };
          const expectedEntry = rollbackExpectedEntry;
          if (!callbackContext || !expectedEntry)
            throw new Error("session creation final patch is missing its created entry");
          const createdContext = callbackContext;
          const finalized = await patchSessionEntry$1(
            {
              sessionKey: createdContext.key,
              storePath: createdContext.storePath,
            },
            (currentEntry) => {
              if (JSON.stringify(currentEntry) !== JSON.stringify(expectedEntry))
                throw new Error(
                  `created session ${createdContext.key} changed before finalization`,
                );
              return patch;
            },
            {
              preserveActivity: true,
              requireWriteSuccess: true,
            },
          );
          if (!finalized)
            throw new Error(
              `created session ${createdContext.key} disappeared before finalization`,
            );
          finalEntry = finalized;
          rollbackExpectedEntry = structuredClone(finalized);
        }
        return {
          key: created.key,
          agentId: created.agentId,
          sessionId: finalEntry.sessionId,
          entry: finalEntry,
        };
      } catch (error) {
        if (!callbackContext) throw error;
        try {
          const expectedEntry = rollbackExpectedEntry ?? callbackContext.entry;
          const rollbackParams = {
            agentId: callbackContext.agentId,
            archiveTranscript: true,
            expectedEntry,
            expectedSessionId: callbackContext.entry.sessionId,
            expectedUpdatedAt: expectedEntry.updatedAt,
            storePath: callbackContext.storePath,
            target: {
              canonicalKey: callbackContext.key,
              storeKeys: [callbackContext.key],
            },
          };
          if (
            !(
              expectedEntry.modelSelectionLocked === true
                ? expectedEntry.agentHarnessId
                  ? await rollbackAgentHarnessSessionEntryLifecycle(rollbackParams)
                  : await rollbackPluginOwnedSessionEntryLifecycle({
                      ...rollbackParams,
                      expectedPluginOwnerId: cliInitial?.pluginOwnerId ?? "",
                    })
                : await deleteSessionEntryLifecycle(rollbackParams)
            ).deleted
          )
            throw new Error(`created session ${callbackContext.key} changed before rollback`, {
              cause: error,
            });
        } catch (rollbackError) {
          throw new AggregateError(
            [error, rollbackError],
            `Session initialization failed and guarded rollback did not complete for ${callbackContext.key}.`,
            { cause: rollbackError },
          );
        }
        throw error;
      }
    },
  });
}
async function runWithSessionWorkAdmission(params, run) {
  const initialEntry = getSessionEntry({
    storePath: params.storePath,
    sessionKey: params.sessionKey,
    readConsistency: "latest",
  });
  const lifecycleAbortController = new AbortController();
  const admission = await beginSessionWorkAdmission({
    scope: params.storePath,
    identities: [params.sessionKey, initialEntry?.sessionId],
    signal: params.signal,
    onInterrupt: () =>
      lifecycleAbortController.abort(
        /* @__PURE__ */ new Error("Agent work interrupted by a session lifecycle change."),
      ),
    assertAllowed: () => {
      const currentEntry = getSessionEntry({
        storePath: params.storePath,
        sessionKey: params.sessionKey,
        readConsistency: "latest",
      });
      if (
        initialEntry
          ? !currentEntry || currentEntry.sessionId !== initialEntry.sessionId
          : Boolean(currentEntry)
      )
        throw new Error(`Session "${params.sessionKey}" changed while starting work. Retry.`);
      const archivedSessionError = resolveSessionWorkStartError(params.sessionKey, currentEntry);
      if (archivedSessionError) throw new Error(archivedSessionError);
    },
  });
  try {
    const signal = params.signal
      ? AbortSignal.any([params.signal, lifecycleAbortController.signal])
      : lifecycleAbortController.signal;
    return await admission.run(async () => await run(signal));
  } finally {
    admission.release();
  }
}
/** Creates the plugin runtime agent facade with lazy embedded-agent/session helpers. */
function createRuntimeAgent() {
  const agentRuntime = {
    defaults: {
      model: DEFAULT_MODEL,
      provider: DEFAULT_PROVIDER,
    },
    resolveAgentDir,
    resolveAgentWorkspaceDir,
    resolveAgentIdentity,
    resolveThinkingDefault,
    normalizeThinkingLevel: normalizeThinkLevel,
    resolveThinkingPolicy: (params) => {
      const cfg = getRuntimeConfig();
      const effectiveRuntime = params.agentRuntime
        ? concretizeAgentRuntime(params.agentRuntime)
        : params.provider && params.model
          ? resolveEffectiveAgentRuntime({
              cfg,
              provider: params.provider,
              modelId: params.model,
            })
          : void 0;
      const profile = resolveThinkingProfile({
        ...params,
        agentRuntime: effectiveRuntime,
        catalog: resolveRuntimeThinkingCatalog(params, () =>
          buildConfiguredModelCatalog({ cfg: getRuntimeConfig() }),
        ),
      });
      const policy = {
        levels: profile.levels.map(({ id, label }) => ({
          id,
          label,
        })),
      };
      return profile.defaultLevel
        ? {
            ...policy,
            defaultLevel: profile.defaultLevel,
          }
        : policy;
    },
    resolveAgentTimeoutMs,
    ensureAgentWorkspace,
  };
  defineCachedValue(agentRuntime, "runEmbeddedAgent", () =>
    createLazyRuntimeMethod(loadEmbeddedAgentRuntime, (runtime) => runtime.runEmbeddedAgent),
  );
  defineCachedValue(agentRuntime, "runEmbeddedPiAgent", () => agentRuntime.runEmbeddedAgent);
  defineCachedValue(agentRuntime, "session", () => ({
    resolveStorePath,
    createSessionEntry,
    getSessionEntry,
    listSessionEntries,
    patchSessionEntry,
    upsertSessionEntry,
    runWithWorkAdmission: runWithSessionWorkAdmission,
    updateSessionStoreEntry,
  }));
  return agentRuntime;
}
//#endregion
//#region src/plugins/runtime/runtime-config.ts
const RUNTIME_CONFIG_LOAD_WRITE_COMPAT_CODE = "runtime-config-load-write";
const warnedDeprecatedConfigApis = /* @__PURE__ */ new Set();
function formatDeprecatedConfigApiSubject(name) {
  const scope = getPluginRuntimeGatewayRequestScope();
  if (!scope?.pluginId) return `plugin runtime config.${name}()`;
  return `plugin "${scope.pluginId}" runtime config.${name}()`;
}
function formatDeprecatedConfigApiSource() {
  const scope = getPluginRuntimeGatewayRequestScope();
  return scope?.pluginSource ? ` Source: ${scope.pluginSource}` : "";
}
function formatDeprecatedConfigApiWarningKey(name) {
  return `${name}:${getPluginRuntimeGatewayRequestScope()?.pluginId ?? "anonymous"}`;
}
function warnDeprecatedConfigApiOnce(name, replacement) {
  const warningKey = formatDeprecatedConfigApiWarningKey(name);
  if (warnedDeprecatedConfigApis.has(warningKey)) return;
  warnedDeprecatedConfigApis.add(warningKey);
  logWarn(
    `${formatDeprecatedConfigApiSubject(name)} is deprecated (${RUNTIME_CONFIG_LOAD_WRITE_COMPAT_CODE}); use ${replacement}.${formatDeprecatedConfigApiSource()}`,
  );
}
function createRuntimeConfig() {
  return {
    current: getRuntimeConfig,
    mutateConfigFile: async (params) =>
      await mutateConfigFile({
        ...params,
        writeOptions: params.writeOptions,
      }),
    replaceConfigFile: async (params) =>
      await replaceConfigFile({
        ...params,
        writeOptions: params.writeOptions,
      }),
    loadConfig: () => {
      warnDeprecatedConfigApiOnce("loadConfig", "config.current()");
      return getRuntimeConfig();
    },
    writeConfigFile: async (cfg, options) => {
      warnDeprecatedConfigApiOnce(
        "writeConfigFile",
        "config.mutateConfigFile(...) or config.replaceConfigFile(...)",
      );
      await replaceConfigFile({
        nextConfig: cfg,
        afterWrite: options?.afterWrite ?? { mode: "auto" },
        writeOptions: options,
      });
    },
  };
}
//#endregion
//#region src/plugins/runtime/runtime-events.ts
/** Creates the plugin runtime event subscription facade. */
function createRuntimeEvents() {
  return {
    onAgentEvent,
    onSessionTranscriptUpdate,
  };
}
//#endregion
//#region src/plugins/runtime/runtime-logging.ts
function writeRuntimeLog(log, message, meta) {
  if (meta && Object.keys(meta).length > 0) {
    log(meta, message);
    return;
  }
  log(message);
}
/** Creates the plugin runtime logging facade. */
function createRuntimeLogging() {
  return {
    shouldLogVerbose,
    getChildLogger: (bindings, opts) => {
      const overrideLevel = opts?.level ? normalizeLogLevel(opts.level) : void 0;
      const childOpts = overrideLevel ? { level: overrideLevel } : void 0;
      const emit = (level) => (message, meta) => {
        if (!overrideLevel && !isFileLogLevelEnabled(level)) return;
        const logger = getChildLogger(bindings, childOpts);
        writeRuntimeLog(logger[level].bind(logger), message, meta);
      };
      return {
        debug: emit("debug"),
        info: emit("info"),
        warn: emit("warn"),
        error: emit("error"),
      };
    },
  };
}
//#endregion
//#region src/plugins/runtime/runtime-media.ts
/** Creates the plugin runtime media facade. */
function createRuntimeMedia() {
  return {
    loadWebMedia,
    detectMime,
    mediaKindFromMime,
    isVoiceCompatibleAudio,
    getImageMetadata,
    resizeToJpeg,
  };
}
//#endregion
//#region src/plugins/runtime/native-deps.ts
/** Formats concise guidance for installing and rebuilding a native dependency. */
function formatNativeDependencyHint(params) {
  const manager = params.manager ?? "pnpm";
  const rebuildCommand =
    params.rebuildCommand ??
    (manager === "npm"
      ? `npm rebuild ${params.packageName}`
      : manager === "yarn"
        ? `yarn rebuild ${params.packageName}`
        : `pnpm rebuild ${params.packageName}`);
  const steps = [
    params.approveBuildsCommand ??
      (manager === "pnpm" ? `pnpm approve-builds (select ${params.packageName})` : void 0),
    rebuildCommand,
    params.downloadCommand,
  ].filter((step) => Boolean(step));
  if (steps.length === 0) return `Install ${params.packageName} and rebuild its native module.`;
  return `Install ${params.packageName} and rebuild its native module (${steps.join("; ")}).`;
}
//#endregion
//#region src/plugins/runtime/runtime-system.ts
const runHeartbeatOnceInternal = createLazyRuntimeMethod(
  createLazyRuntimeModule(() => import("../../heartbeat-runner-CvUIXqXL.js")),
  (runtime) => runtime.runHeartbeatOnce,
);
/** Creates the plugin runtime system facade with heartbeat/event/process helpers. */
function createRuntimeSystem() {
  const requestHeartbeatNow = (opts) =>
    requestHeartbeat({
      source: opts?.source ?? "other",
      intent: opts?.intent ?? "immediate",
      reason: opts?.reason,
      coalesceMs: opts?.coalesceMs,
      agentId: opts?.agentId,
      sessionKey: opts?.sessionKey,
      heartbeat: opts?.heartbeat,
    });
  return {
    enqueueSystemEvent,
    requestHeartbeat,
    requestHeartbeatNow,
    runHeartbeatOnce: (opts) => {
      const { reason, agentId, sessionKey, heartbeat } = opts ?? {};
      return runHeartbeatOnceInternal({
        reason,
        agentId,
        sessionKey,
        heartbeat: heartbeat ? { target: heartbeat.target } : void 0,
      });
    },
    runCommandWithTimeout,
    formatNativeDependencyHint,
  };
}
//#endregion
//#region src/plugins/runtime/runtime-taskflow.ts
function assertSessionKey$1(sessionKey, errorMessage) {
  const normalized = sessionKey?.trim();
  if (!normalized) throw new Error(errorMessage);
  return normalized;
}
function asManagedTaskFlowRecord(flow) {
  if (!flow || flow.syncMode !== "managed" || !flow.controllerId) return;
  return flow;
}
function mapFlowUpdateResult(result) {
  if (result.applied) {
    const managed = asManagedTaskFlowRecord(result.flow);
    if (!managed)
      return {
        applied: false,
        code: "not_managed",
        current: result.flow,
      };
    return {
      applied: true,
      flow: managed,
    };
  }
  return {
    applied: false,
    code: result.reason,
    ...(result.current ? { current: result.current } : {}),
  };
}
function applyManagedFlowMutationForOwner(params) {
  const flow = getTaskFlowByIdForOwner({
    flowId: params.flowId,
    callerOwnerKey: params.ownerKey,
  });
  if (!flow)
    return {
      applied: false,
      code: "not_found",
    };
  const managed = asManagedTaskFlowRecord(flow);
  if (!managed)
    return {
      applied: false,
      code: "not_managed",
      current: flow,
    };
  return mapFlowUpdateResult(params.mutate(managed.flowId));
}
function createBoundTaskFlowRuntime(params) {
  const ownerKey = assertSessionKey$1(
    params.sessionKey,
    "TaskFlow runtime requires a bound sessionKey.",
  );
  const requesterOrigin = params.requesterOrigin
    ? normalizeDeliveryContext(params.requesterOrigin)
    : void 0;
  const tryCreateManaged = (input) => {
    return (
      asManagedTaskFlowRecord(
        createManagedTaskFlow({
          ownerKey,
          controllerId: input.controllerId,
          requesterOrigin,
          status: input.status,
          notifyPolicy: input.notifyPolicy,
          goal: input.goal,
          currentStep: input.currentStep,
          stateJson: input.stateJson,
          waitJson: input.waitJson,
          cancelRequestedAt: input.cancelRequestedAt,
          createdAt: input.createdAt,
          updatedAt: input.updatedAt,
          endedAt: input.endedAt,
        }) ?? void 0,
      ) ?? null
    );
  };
  return {
    sessionKey: ownerKey,
    ...(requesterOrigin ? { requesterOrigin } : {}),
    createManaged: (input) => {
      const flow = tryCreateManaged(input);
      if (!flow) throw new Error("TaskFlow persistence failed.");
      return flow;
    },
    tryCreateManaged,
    get: (flowId) =>
      getTaskFlowByIdForOwner({
        flowId,
        callerOwnerKey: ownerKey,
      }),
    list: () => listTaskFlowsForOwner({ callerOwnerKey: ownerKey }),
    findLatest: () => findLatestTaskFlowForOwner({ callerOwnerKey: ownerKey }),
    resolve: (token) =>
      resolveTaskFlowForLookupTokenForOwner({
        token,
        callerOwnerKey: ownerKey,
      }),
    getTaskSummary: (flowId) => {
      const flow = getTaskFlowByIdForOwner({
        flowId,
        callerOwnerKey: ownerKey,
      });
      return flow ? getFlowTaskSummary(flow.flowId) : void 0;
    },
    setWaiting: (input) =>
      applyManagedFlowMutationForOwner({
        flowId: input.flowId,
        ownerKey,
        mutate: (flowId) =>
          setFlowWaiting({
            flowId,
            expectedRevision: input.expectedRevision,
            currentStep: input.currentStep,
            stateJson: input.stateJson,
            waitJson: input.waitJson,
            blockedTaskId: input.blockedTaskId,
            blockedSummary: input.blockedSummary,
            updatedAt: input.updatedAt,
          }),
      }),
    resume: (input) =>
      applyManagedFlowMutationForOwner({
        flowId: input.flowId,
        ownerKey,
        mutate: (flowId) =>
          resumeFlow({
            flowId,
            expectedRevision: input.expectedRevision,
            status: input.status,
            currentStep: input.currentStep,
            stateJson: input.stateJson,
            updatedAt: input.updatedAt,
          }),
      }),
    finish: (input) =>
      applyManagedFlowMutationForOwner({
        flowId: input.flowId,
        ownerKey,
        mutate: (flowId) =>
          finishFlow({
            flowId,
            expectedRevision: input.expectedRevision,
            stateJson: input.stateJson,
            updatedAt: input.updatedAt,
            endedAt: input.endedAt,
          }),
      }),
    fail: (input) =>
      applyManagedFlowMutationForOwner({
        flowId: input.flowId,
        ownerKey,
        mutate: (flowId) =>
          failFlow({
            flowId,
            expectedRevision: input.expectedRevision,
            stateJson: input.stateJson,
            blockedTaskId: input.blockedTaskId,
            blockedSummary: input.blockedSummary,
            updatedAt: input.updatedAt,
            endedAt: input.endedAt,
          }),
      }),
    requestCancel: (input) =>
      applyManagedFlowMutationForOwner({
        flowId: input.flowId,
        ownerKey,
        mutate: (flowId) =>
          requestFlowCancel({
            flowId,
            expectedRevision: input.expectedRevision,
            cancelRequestedAt: input.cancelRequestedAt,
          }),
      }),
    cancel: ({ flowId, cfg }) =>
      cancelFlowByIdForOwner({
        cfg,
        flowId,
        callerOwnerKey: ownerKey,
      }),
    runTask: (input) => {
      const created = runTaskInFlowForOwner({
        flowId: input.flowId,
        callerOwnerKey: ownerKey,
        runtime: input.runtime,
        sourceId: input.sourceId,
        childSessionKey: input.childSessionKey,
        parentTaskId: input.parentTaskId,
        agentId: input.agentId,
        runId: input.runId,
        label: input.label,
        task: input.task,
        preferMetadata: input.preferMetadata,
        notifyPolicy: input.notifyPolicy,
        deliveryStatus: input.deliveryStatus,
        status: input.status,
        startedAt: input.startedAt,
        lastEventAt: input.lastEventAt,
        progressSummary: input.progressSummary,
      });
      if (!created.created)
        return {
          created: false,
          found: created.found,
          reason: created.reason ?? "Task was not created.",
          ...(created.flow ? { flow: created.flow } : {}),
        };
      const managed = asManagedTaskFlowRecord(created.flow);
      if (!managed)
        return {
          created: false,
          found: true,
          reason: "TaskFlow does not accept managed child tasks.",
          flow: created.flow,
        };
      if (!created.task)
        return {
          created: false,
          found: true,
          reason: "Task was not created.",
          flow: created.flow,
        };
      return {
        created: true,
        flow: managed,
        task: created.task,
      };
    },
  };
}
function createRuntimeTaskFlow() {
  return {
    bindSession: (params) =>
      createBoundTaskFlowRuntime({
        sessionKey: params.sessionKey,
        requesterOrigin: params.requesterOrigin,
      }),
    fromToolContext: (ctx) =>
      createBoundTaskFlowRuntime({
        sessionKey: assertSessionKey$1(
          ctx.sessionKey,
          "TaskFlow runtime requires tool context with a sessionKey.",
        ),
        requesterOrigin: ctx.deliveryContext,
      }),
  };
}
//#endregion
//#region src/tasks/task-domain-views.ts
/** Maps internal task summary counts to the plugin task-domain view contract. */
function mapTaskRunAggregateSummary(summary) {
  return {
    total: summary.total,
    active: summary.active,
    terminal: summary.terminal,
    failures: summary.failures,
    byStatus: { ...summary.byStatus },
    byRuntime: { ...summary.byRuntime },
  };
}
function mapTaskRunView(task) {
  return {
    id: task.taskId,
    runtime: task.runtime,
    ...(task.sourceId ? { sourceId: task.sourceId } : {}),
    sessionKey: task.requesterSessionKey,
    ownerKey: task.ownerKey,
    scope: task.scopeKind,
    ...(task.childSessionKey ? { childSessionKey: task.childSessionKey } : {}),
    ...(task.parentFlowId ? { flowId: task.parentFlowId } : {}),
    ...(task.parentTaskId ? { parentTaskId: task.parentTaskId } : {}),
    ...(task.agentId ? { agentId: task.agentId } : {}),
    ...(task.runId ? { runId: task.runId } : {}),
    ...(task.label ? { label: task.label } : {}),
    title: task.task,
    status: task.status,
    deliveryStatus: task.deliveryStatus,
    notifyPolicy: task.notifyPolicy,
    createdAt: task.createdAt,
    ...(task.startedAt !== void 0 ? { startedAt: task.startedAt } : {}),
    ...(task.endedAt !== void 0 ? { endedAt: task.endedAt } : {}),
    ...(task.lastEventAt !== void 0 ? { lastEventAt: task.lastEventAt } : {}),
    ...(task.cleanupAfter !== void 0 ? { cleanupAfter: task.cleanupAfter } : {}),
    ...(task.error ? { error: task.error } : {}),
    ...(task.progressSummary ? { progressSummary: task.progressSummary } : {}),
    ...(task.terminalSummary ? { terminalSummary: task.terminalSummary } : {}),
    ...(task.terminalOutcome ? { terminalOutcome: task.terminalOutcome } : {}),
  };
}
function mapTaskRunDetail(task) {
  return mapTaskRunView(task);
}
function mapTaskFlowView(flow) {
  return {
    id: flow.flowId,
    ownerKey: flow.ownerKey,
    ...(flow.requesterOrigin ? { requesterOrigin: { ...flow.requesterOrigin } } : {}),
    status: flow.status,
    notifyPolicy: flow.notifyPolicy,
    goal: flow.goal,
    ...(flow.currentStep ? { currentStep: flow.currentStep } : {}),
    ...(flow.cancelRequestedAt !== void 0 ? { cancelRequestedAt: flow.cancelRequestedAt } : {}),
    createdAt: flow.createdAt,
    updatedAt: flow.updatedAt,
    ...(flow.endedAt !== void 0 ? { endedAt: flow.endedAt } : {}),
  };
}
function mapTaskFlowDetail(params) {
  const summary = params.summary ?? summarizeTaskRecords(params.tasks);
  return {
    ...mapTaskFlowView(params.flow),
    ...(params.flow.stateJson !== void 0 ? { state: params.flow.stateJson } : {}),
    ...(params.flow.waitJson !== void 0 ? { wait: params.flow.waitJson } : {}),
    ...(params.flow.blockedTaskId || params.flow.blockedSummary
      ? {
          blocked: {
            ...(params.flow.blockedTaskId ? { taskId: params.flow.blockedTaskId } : {}),
            ...(params.flow.blockedSummary ? { summary: params.flow.blockedSummary } : {}),
          },
        }
      : {}),
    tasks: params.tasks.map((task) => mapTaskRunView(task)),
    taskSummary: mapTaskRunAggregateSummary(summary),
  };
}
//#endregion
//#region src/plugins/runtime/runtime-tasks.ts
function assertSessionKey(sessionKey, errorMessage) {
  const normalized = sessionKey?.trim();
  if (!normalized) throw new Error(errorMessage);
  return normalized;
}
function mapCancelledTaskResult(result) {
  return {
    found: result.found,
    cancelled: result.cancelled,
    ...(result.reason ? { reason: result.reason } : {}),
    ...(result.task ? { task: mapTaskRunDetail(result.task) } : {}),
  };
}
function createBoundTaskRunsRuntime(params) {
  const ownerKey = assertSessionKey(
    params.sessionKey,
    "Tasks runtime requires a bound sessionKey.",
  );
  const requesterOrigin = params.requesterOrigin
    ? normalizeDeliveryContext(params.requesterOrigin)
    : void 0;
  return {
    sessionKey: ownerKey,
    ...(requesterOrigin ? { requesterOrigin } : {}),
    get: (taskId) => {
      const task = getTaskByIdForOwner({
        taskId,
        callerOwnerKey: ownerKey,
      });
      return task ? mapTaskRunDetail(task) : void 0;
    },
    list: () =>
      listTasksForRelatedSessionKeyForOwner({
        relatedSessionKey: ownerKey,
        callerOwnerKey: ownerKey,
      }).map((task) => mapTaskRunView(task)),
    findLatest: () => {
      const task = findLatestTaskForRelatedSessionKeyForOwner({
        relatedSessionKey: ownerKey,
        callerOwnerKey: ownerKey,
      });
      return task ? mapTaskRunDetail(task) : void 0;
    },
    resolve: (token) => {
      const task = resolveTaskForLookupTokenForOwner({
        token,
        callerOwnerKey: ownerKey,
      });
      return task ? mapTaskRunDetail(task) : void 0;
    },
    cancel: async ({ taskId, cfg }) => {
      const task = getTaskByIdForOwner({
        taskId,
        callerOwnerKey: ownerKey,
      });
      if (!task)
        return {
          found: false,
          cancelled: false,
          reason: "Task not found.",
        };
      return mapCancelledTaskResult(
        await cancelDetachedTaskRunById({
          cfg,
          taskId: task.taskId,
        }),
      );
    },
  };
}
function createBoundTaskFlowsRuntime(params) {
  const ownerKey = assertSessionKey(
    params.sessionKey,
    "TaskFlow runtime requires a bound sessionKey.",
  );
  const requesterOrigin = params.requesterOrigin
    ? normalizeDeliveryContext(params.requesterOrigin)
    : void 0;
  const getDetail = (flowId) => {
    const flow = getTaskFlowByIdForOwner({
      flowId,
      callerOwnerKey: ownerKey,
    });
    if (!flow) return;
    return mapTaskFlowDetail({
      flow,
      tasks: listTasksForFlowId(flow.flowId),
      summary: getFlowTaskSummary(flow.flowId),
    });
  };
  return {
    sessionKey: ownerKey,
    ...(requesterOrigin ? { requesterOrigin } : {}),
    get: (flowId) => getDetail(flowId),
    list: () =>
      listTaskFlowsForOwner({ callerOwnerKey: ownerKey }).map((flow) => mapTaskFlowView(flow)),
    findLatest: () => {
      const flow = findLatestTaskFlowForOwner({ callerOwnerKey: ownerKey });
      return flow ? getDetail(flow.flowId) : void 0;
    },
    resolve: (token) => {
      const flow = resolveTaskFlowForLookupTokenForOwner({
        token,
        callerOwnerKey: ownerKey,
      });
      return flow ? getDetail(flow.flowId) : void 0;
    },
    getTaskSummary: (flowId) => {
      const flow = getTaskFlowByIdForOwner({
        flowId,
        callerOwnerKey: ownerKey,
      });
      return flow ? mapTaskRunAggregateSummary(getFlowTaskSummary(flow.flowId)) : void 0;
    },
  };
}
function createRuntimeTaskRuns() {
  return {
    bindSession: (params) =>
      createBoundTaskRunsRuntime({
        sessionKey: params.sessionKey,
        requesterOrigin: params.requesterOrigin,
      }),
    fromToolContext: (ctx) =>
      createBoundTaskRunsRuntime({
        sessionKey: assertSessionKey(
          ctx.sessionKey,
          "Tasks runtime requires tool context with a sessionKey.",
        ),
        requesterOrigin: ctx.deliveryContext,
      }),
  };
}
function createRuntimeTaskFlows() {
  return {
    bindSession: (params) =>
      createBoundTaskFlowsRuntime({
        sessionKey: params.sessionKey,
        requesterOrigin: params.requesterOrigin,
      }),
    fromToolContext: (ctx) =>
      createBoundTaskFlowsRuntime({
        sessionKey: assertSessionKey(
          ctx.sessionKey,
          "TaskFlow runtime requires tool context with a sessionKey.",
        ),
        requesterOrigin: ctx.deliveryContext,
      }),
  };
}
function createRuntimeTasks(params) {
  return {
    runs: createRuntimeTaskRuns(),
    flows: createRuntimeTaskFlows(),
    managedFlows: params.legacyTaskFlow,
    flow: params.legacyTaskFlow,
  };
}
//#endregion
//#region src/plugins/runtime/index.ts
const loadTtsRuntime = createLazyRuntimeModule(() => import("../../tts-Cp7At8XR.js"));
const loadMediaUnderstandingRuntime = createLazyRuntimeModule(
  () => import("../../runtime-BhSlEe15.js"),
);
const loadModelAuthRuntime = createLazyRuntimeModule(
  () => import("../../runtime-model-auth.runtime-CTQorBPN.js"),
);
const loadGatewayPluginRuntime = createLazyRuntimeModule(
  () => import("../../server-plugins-DrgT_-nE.js"),
);
function createRuntimeGateway() {
  return {
    isAvailable: async () => {
      return (await loadGatewayPluginRuntime()).hasInProcessGatewayContext();
    },
    request: async (method, params, options) => {
      return (await loadGatewayPluginRuntime()).dispatchTrustedPluginGatewayMethod(
        method,
        params,
        options,
      );
    },
  };
}
function createRuntimeTts() {
  const bindTtsRuntime = createLazyRuntimeMethodBinder(loadTtsRuntime);
  return {
    textToSpeech: bindTtsRuntime((runtime) => runtime.textToSpeech),
    textToSpeechStream: bindTtsRuntime((runtime) => runtime.textToSpeechStream),
    textToSpeechTelephony: bindTtsRuntime((runtime) => runtime.textToSpeechTelephony),
    listVoices: bindTtsRuntime((runtime) => runtime.listSpeechVoices),
  };
}
function createRuntimeMediaUnderstandingFacade() {
  const bindMediaUnderstandingRuntime = createLazyRuntimeMethodBinder(
    loadMediaUnderstandingRuntime,
  );
  return {
    runFile: bindMediaUnderstandingRuntime((runtime) => runtime.runMediaUnderstandingFile),
    describeImageFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeImageFile),
    describeImageFileWithModel: bindMediaUnderstandingRuntime(
      (runtime) => runtime.describeImageFileWithModel,
    ),
    extractStructuredWithModel: bindMediaUnderstandingRuntime(
      (runtime) => runtime.extractStructuredWithModel,
    ),
    describeVideoFile: bindMediaUnderstandingRuntime((runtime) => runtime.describeVideoFile),
    transcribeAudioFile: bindMediaUnderstandingRuntime((runtime) => runtime.transcribeAudioFile),
  };
}
function createRuntimeImageGeneration() {
  return {
    generate: (params) => generateImage(params),
    listProviders: (params) => listRuntimeImageGenerationProviders(params),
  };
}
function createRuntimeVideoGeneration() {
  return {
    generate: (params) => generateVideo(params),
    listProviders: (params) => listRuntimeVideoGenerationProviders(params),
  };
}
function createRuntimeMusicGeneration() {
  return {
    generate: (params) => generateMusic(params),
    listProviders: (params) => listRuntimeMusicGenerationProviders(params),
  };
}
function createRuntimeLlmFacade() {
  const loadAcquireLocalService = createLazyRuntimeMethod(
    () => import("../../provider-local-service-18tzecvh.js"),
    (runtime) => runtime.createConfiguredProviderLocalServiceAcquirer(getRuntimeConfig),
  );
  const loadLlm = createLazyRuntimeSurface(
    () => import("../../runtime-llm.runtime-DV4chpHN.js"),
    (m) =>
      m.createRuntimeLlm({
        getConfig: getRuntimeConfig,
        authority: { allowComplete: true },
      }),
  );
  return {
    acquireLocalService: (...args) => loadAcquireLocalService(...args),
    complete: async (params) => {
      return (await loadLlm()).complete(params);
    },
  };
}
function createRuntimeModelAuth() {
  const getApiKeyForModel = createLazyRuntimeMethod(
    loadModelAuthRuntime,
    (runtime) => runtime.getApiKeyForModel,
  );
  const getRuntimeAuthForModel = createLazyRuntimeMethod(
    loadModelAuthRuntime,
    (runtime) => runtime.getRuntimeAuthForModel,
  );
  const resolveApiKeyForProvider = createLazyRuntimeMethod(
    loadModelAuthRuntime,
    (runtime) => runtime.resolveApiKeyForProvider,
  );
  return {
    getApiKeyForModel: (params) =>
      getApiKeyForModel({
        model: params.model,
        cfg: params.cfg,
        workspaceDir: params.workspaceDir,
      }),
    getRuntimeAuthForModel: (params) =>
      getRuntimeAuthForModel({
        model: params.model,
        cfg: params.cfg,
        workspaceDir: params.workspaceDir,
      }),
    resolveApiKeyForProvider: (params) =>
      resolveApiKeyForProvider({
        provider: params.provider,
        cfg: params.cfg,
        workspaceDir: params.workspaceDir,
      }),
  };
}
function createUnavailableSubagentRuntime() {
  const unavailable = () => {
    throw new RequestScopedSubagentRuntimeError();
  };
  return {
    run: unavailable,
    waitForRun: unavailable,
    getSessionMessages: unavailable,
    getSession: unavailable,
    deleteSession: unavailable,
  };
}
/**
 * Create a late-binding subagent that resolves to:
 * 1. An explicitly provided subagent (from runtimeOptions), OR
 * 2. The process-global gateway subagent when the caller explicitly opts in, OR
 * 3. The unavailable fallback (throws with a clear error message).
 */
function createLateBindingSubagent(explicit, allowGatewaySubagentBinding = false) {
  if (explicit) return explicit;
  const unavailable = createUnavailableSubagentRuntime();
  if (!allowGatewaySubagentBinding) return unavailable;
  return new Proxy(unavailable, {
    get(_target, prop, _receiver) {
      const resolved = gatewaySubagentState.subagent ?? unavailable;
      return Reflect.get(resolved, prop, resolved);
    },
  });
}
function createUnavailableNodesRuntime() {
  const unavailable = () => {
    throw new Error("Plugin node runtime is only available inside the Gateway.");
  };
  return {
    list: unavailable,
    invoke: unavailable,
  };
}
function createLateBindingNodes(allowGatewayBinding = false) {
  const unavailable = createUnavailableNodesRuntime();
  if (!allowGatewayBinding) return unavailable;
  return new Proxy(unavailable, {
    get(_target, prop, _receiver) {
      const resolved = gatewaySubagentState.nodes ?? unavailable;
      return Reflect.get(resolved, prop, resolved);
    },
  });
}
function createRuntimeWorktrees() {
  const loadService = () => import("../../service-Bg8I2dbl.js");
  return {
    async resolveCheckoutRoot(params) {
      const { findGitCheckoutRoot } = await import("../../git-hYzVhjsm.js");
      return findGitCheckoutRoot(params.path) ?? void 0;
    },
    async hasSelfContainedCheckoutMetadata(params) {
      const { hasSelfContainedGitMetadata } = await import("../../git-hYzVhjsm.js");
      return await hasSelfContainedGitMetadata(params.path);
    },
    async create(params) {
      const { managedWorktrees } = await loadService();
      const record = await managedWorktrees.create(params);
      await managedWorktrees.acquire(record.id);
      return {
        id: record.id,
        path: record.path,
        branch: record.branch,
      };
    },
    async release(params) {
      const { managedWorktrees } = await loadService();
      await managedWorktrees.releaseByPath(params.path);
    },
    async removeIfLossless(params) {
      const { managedWorktrees } = await loadService();
      return managedWorktrees.removeIfLosslessByPath(params.path, {
        ownerKind: params.ownerKind,
        ownerId: params.ownerId,
      });
    },
  };
}
function createRuntimeSandbox(agent) {
  const resolveWorkspaceAuthority = (params) =>
    resolveSandboxWorkspaceAuthority({
      ...params,
      sessionEntry: agent.session.getSessionEntry({
        agentId: params.agentId,
        sessionKey: params.sessionKey,
      }),
    });
  return {
    resolveWorkspaceAuthority,
    async prepareWorkspaceAuthority(params) {
      const authority = resolveWorkspaceAuthority(params);
      if (!authority.sandboxed || authority.confinementError) return authority;
      const { resolveSandboxContext } = await import("../../context-CigTX_NE.js");
      await resolveSandboxContext({
        config: params.config,
        agentId: params.agentId,
        sessionKey: params.sessionKey,
        workspaceDir: params.workspaceDir,
        requireCurrentConfig: true,
      });
      return authority;
    },
  };
}
function createPluginRuntime(_options = {}) {
  const mediaUnderstanding = createRuntimeMediaUnderstandingFacade();
  const taskFlow = createRuntimeTaskFlow();
  const tasks = createRuntimeTasks({ legacyTaskFlow: taskFlow });
  const agent = createRuntimeAgent();
  const runtime = {
    version: VERSION,
    gateway: createRuntimeGateway(),
    config: createRuntimeConfig(),
    agent,
    subagent: createLateBindingSubagent(
      _options.subagent,
      _options.allowGatewaySubagentBinding === true,
    ),
    nodes: _options.nodes ?? createLateBindingNodes(_options.allowGatewaySubagentBinding === true),
    sandbox: createRuntimeSandbox(agent),
    worktrees: createRuntimeWorktrees(),
    system: createRuntimeSystem(),
    media: createRuntimeMedia(),
    webSearch: {
      listProviders: listWebSearchProviders,
      search: runWebSearch,
    },
    channel: createRuntimeChannel(),
    events: createRuntimeEvents(),
    logging: createRuntimeLogging(),
    state: {
      resolveStateDir,
      openKeyedStore: () => {
        throw new Error("openKeyedStore is only available through the plugin runtime proxy.");
      },
      openSyncKeyedStore: () => {
        throw new Error("openSyncKeyedStore is only available through the plugin runtime proxy.");
      },
      openChannelIngressQueue: () => {
        throw new Error(
          "openChannelIngressQueue is only available through the plugin runtime proxy.",
        );
      },
    },
    tasks,
    taskFlow,
  };
  defineCachedValue(runtime, "tts", createRuntimeTts);
  defineCachedValue(runtime, "mediaUnderstanding", () => mediaUnderstanding);
  defineCachedValue(runtime, "stt", () => ({
    transcribeAudioFile: mediaUnderstanding.transcribeAudioFile,
  }));
  defineCachedValue(runtime, "modelAuth", createRuntimeModelAuth);
  defineCachedValue(runtime, "imageGeneration", createRuntimeImageGeneration);
  defineCachedValue(runtime, "videoGeneration", createRuntimeVideoGeneration);
  defineCachedValue(runtime, "musicGeneration", createRuntimeMusicGeneration);
  defineCachedValue(runtime, "llm", createRuntimeLlmFacade);
  return runtime;
}
//#endregion
export { createPluginRuntime };
