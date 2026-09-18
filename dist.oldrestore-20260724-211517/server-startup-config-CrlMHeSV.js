import { isDeepStrictEqual } from "node:util";
import { n as resolveGatewayAuth } from "./auth-resolve-PY0Y7GYi.js";
import {
  n as formatPluginPackagingRuntimeOutputRecoveryHint,
  t as formatInvalidConfigRecoveryHint,
} from "./config-recovery-hints-DhFjfGDg.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import "./auth-D-Aebsmj.js";
import {
  j as applyConfigOverrides,
  p as readConfigFileSnapshotWithPluginMetadata,
} from "./io-B3ne6NxF.js";
import { t as createInvalidConfigError } from "./io.invalid-config-D9scyfF6.js";
import { n as formatConfigIssueLines } from "./issue-format-IJKFr2SL.js";
import { n as createLazyPromise } from "./lazy-promise-EhsWch5m.js";
import { a as isNixMode } from "./paths-DEklnbzU.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DAo0bjMj.js";
import { l as measureDiagnosticsTimelineSpan } from "./plugin-metadata-snapshot-BMgImu0m.js";
import { n as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CsUZ07YX.js";
import { a as prepareSecretsRuntimeFastPathSnapshot } from "./runtime-fast-path-CDvQ-ayV.js";
import {
  n as evaluateGatewayAuthSurfaceStates,
  t as GATEWAY_AUTH_SURFACE_PATHS,
} from "./runtime-gateway-auth-surfaces-bKYZ5U-_.js";
import {
  c as getActiveSecretsRuntimeSnapshotRevision,
  d as graftActiveSecretsRuntimeAuthState,
  f as hasCurrentAuthStoreCredentialsRevision,
  t as activateSecretsRuntimeSnapshotState,
} from "./runtime-state-B7u15R2P.js";
import {
  i as assertGatewayAuthNotKnownWeak,
  n as mergeGatewayAuthConfig,
  r as mergeGatewayTailscaleConfig,
  t as ensureGatewayStartupAuth,
} from "./startup-auth-2fsYhDPK.js";
//#region src/gateway/server-startup-config.ts
/** Timeline attributes kept small and deterministic for startup secret preparation spans. */
function secretsPrepareTimelineAttributes(config, activationParams) {
  return {
    activate: activationParams.activate,
    gatewayAuthSecretRef: hasActiveGatewayAuthSecretRef(config),
    reason: activationParams.reason,
  };
}
/** Load and validate the config snapshot, applying runtime-only plugin auto-enable changes. */
async function loadGatewayStartupConfigSnapshot(params) {
  const measure = params.measure ?? (async (_name, run) => await run());
  const snapshotRead =
    params.initialSnapshotRead ??
    (await measure("config.snapshot.read", () =>
      readConfigFileSnapshotWithPluginMetadata({ measure }),
    ));
  const configSnapshot = snapshotRead.snapshot;
  const pluginMetadataSnapshot = snapshotRead.pluginMetadataSnapshot;
  const wroteConfig = false;
  if (configSnapshot.legacyIssues.length > 0 && isNixMode)
    throw createInvalidConfigError(
      configSnapshot.path,
      "Legacy config entries detected while running in Nix mode. Update your Nix config to the latest schema and restart.",
    );
  if (configSnapshot.exists)
    assertValidGatewayStartupConfigSnapshot(configSnapshot, { includeDoctorHint: true });
  const autoEnable = params.minimalTestGateway
    ? {
        config: configSnapshot.config,
        changes: [],
      }
    : await measure("config.snapshot.auto-enable", () =>
        applyPluginAutoEnable({
          config: configSnapshot.sourceConfig,
          env: process.env,
          ...(pluginMetadataSnapshot?.manifestRegistry
            ? { manifestRegistry: pluginMetadataSnapshot.manifestRegistry }
            : {}),
          discovery: pluginMetadataSnapshot?.discovery,
        }),
      );
  if (autoEnable.changes.length === 0)
    return {
      snapshot: configSnapshot,
      wroteConfig,
      ...(pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}),
    };
  params.log.info(
    `gateway: auto-enabled plugins for this runtime without writing config:\n${autoEnable.changes.map((entry) => `- ${entry}`).join("\n")}`,
  );
  return {
    snapshot: withRuntimeConfig(configSnapshot, autoEnable.config),
    wroteConfig,
    ...(pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}),
  };
}
function withRuntimeConfig(snapshot, runtimeConfig) {
  return {
    ...snapshot,
    runtimeConfig,
    config: runtimeConfig,
  };
}
/** Create the serialized secrets activation function used by startup and reload paths. */
function createRuntimeSecretsActivator(params) {
  let secretsDegraded = false;
  let secretsActivationTail = Promise.resolve();
  const loadSecretsRuntime = createLazyPromise(() => import("./runtime-CfdQwfXI.js"), {
    cacheRejections: true,
  });
  const loadAuthProfiles = createLazyPromise(() => import("./auth-profiles-tbbkfm2O.js"), {
    cacheRejections: true,
  });
  const startupManifestRegistry =
    params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
  const runWithSecretsActivationLock = async (operation) => {
    const run = secretsActivationTail.then(operation, operation);
    secretsActivationTail = run.then(
      () => void 0,
      () => void 0,
    );
    return await run;
  };
  const loadActivateRuntimeSecretsSnapshot = async () => {
    if (params.activateRuntimeSecretsSnapshot) return params.activateRuntimeSecretsSnapshot;
    return (await loadSecretsRuntime()).activateSecretsRuntimeSnapshot;
  };
  const finishPreparedSnapshot = async (prepared, activationParams, options) => {
    assertRuntimeGatewayAuthNotKnownWeak(prepared.config);
    if (activationParams.activate) {
      (options?.activateRuntimeSecretsSnapshot ?? (await loadActivateRuntimeSecretsSnapshot()))(
        prepared,
      );
      options?.onActivated?.();
      logGatewayAuthSurfaceDiagnostics(prepared, params.logSecrets);
    }
    for (const warning of prepared.warnings)
      params.logSecrets.warn(`[${warning.code}] ${warning.message}`);
    if (secretsDegraded) {
      const recoveredMessage =
        "Secret resolution recovered; runtime remained on last-known-good during the outage.";
      params.logSecrets.info(`[SECRETS_RELOADER_RECOVERED] ${recoveredMessage}`);
      params.emitStateEvent("SECRETS_RELOADER_RECOVERED", recoveredMessage, prepared.config);
    }
    secretsDegraded = false;
    return prepared;
  };
  const handleSecretsActivationError = (err, activationParams, eventConfig) => {
    const details = String(err);
    if (!secretsDegraded) {
      params.logSecrets.error?.(`[SECRETS_RELOADER_DEGRADED] ${details}`);
      if (activationParams.reason !== "startup")
        params.emitStateEvent(
          "SECRETS_RELOADER_DEGRADED",
          `Secret resolution failed; runtime remains on last-known-good snapshot. ${details}`,
          eventConfig,
        );
    } else params.logSecrets.warn(`[SECRETS_RELOADER_DEGRADED] ${details}`);
    secretsDegraded = true;
    if (activationParams.reason === "startup")
      throw new Error(`Startup failed: required secrets are unavailable. ${details}`, {
        cause: err,
      });
    throw err;
  };
  const activateRuntimeSecrets = async (config, activationParams) =>
    await runWithSecretsActivationLock(async () => {
      try {
        const startupPreflight =
          activationParams.reason === "startup" || activationParams.reason === "restart-check";
        if (
          activationParams.reason === "startup" &&
          activationParams.activate &&
          !params.prepareRuntimeSecretsSnapshot &&
          !params.activateRuntimeSecretsSnapshot
        ) {
          const fastPath = prepareSecretsRuntimeFastPathSnapshot({
            config: pruneSkippedStartupSecretSurfaces(config),
            ...(startupManifestRegistry ? { manifestRegistry: startupManifestRegistry } : {}),
          });
          if (fastPath)
            return await finishPreparedSnapshot(fastPath.snapshot, activationParams, {
              activateRuntimeSecretsSnapshot: (snapshot) =>
                activateSecretsRuntimeSnapshotState({
                  snapshot,
                  refreshContext: fastPath.refreshContext,
                  refreshHandler: {
                    preflight: async (refreshParams) =>
                      await (
                        await loadSecretsRuntime()
                      ).preflightActiveSecretsRuntimeSnapshotRefresh(refreshParams),
                    refresh: async (refreshParams) =>
                      await (
                        await loadSecretsRuntime()
                      ).refreshActiveSecretsRuntimeSnapshotForConfig(refreshParams),
                  },
                }),
            });
        }
        const loadAuthStore = startupPreflight
          ? (await loadAuthProfiles()).loadAuthProfileStoreWithoutExternalProfiles
          : void 0;
        const secretsRuntime =
          params.prepareRuntimeSecretsSnapshot && params.activateRuntimeSecretsSnapshot
            ? null
            : await loadSecretsRuntime();
        const prepareRuntimeSecretsSnapshot =
          params.prepareRuntimeSecretsSnapshot ?? secretsRuntime.prepareSecretsRuntimeSnapshot;
        const prepared = await measureDiagnosticsTimelineSpan(
          "secrets.prepare",
          () =>
            prepareRuntimeSecretsSnapshot({
              config: pruneSkippedStartupSecretSurfaces(config),
              ...(activationParams.env ? { env: activationParams.env } : {}),
              includeAuthStoreRefs: activationParams.includeAuthStoreRefs,
              ...(startupManifestRegistry ? { manifestRegistry: startupManifestRegistry } : {}),
              ...(params.pluginMetadataSnapshot
                ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot }
                : {}),
              ...(loadAuthStore ? { loadAuthStore } : {}),
            }),
          {
            attributes: secretsPrepareTimelineAttributes(config, activationParams),
            config,
            env: activationParams.env ?? process.env,
            omitErrorMessage: true,
            phase: activationParams.reason,
          },
        );
        if (activationParams.includeAuthStoreRefs === false)
          graftActiveSecretsRuntimeAuthState(prepared);
        return await finishPreparedSnapshot(prepared, activationParams);
      } catch (err) {
        return handleSecretsActivationError(err, activationParams, config);
      }
    });
  activateRuntimeSecrets.activatePreparedSnapshot = async (snapshot, activationParams) =>
    await runWithSecretsActivationLock(async () => {
      try {
        return await finishPreparedSnapshot(snapshot, activationParams);
      } catch (err) {
        return handleSecretsActivationError(err, activationParams, snapshot.sourceConfig);
      }
    });
  activateRuntimeSecrets.activatePreparedSnapshotIfCurrent = async (
    snapshot,
    expectedRevision,
    activationParams,
    onActivated,
    canActivate,
  ) => {
    const activateRuntimeSecretsSnapshot = activationParams.activate
      ? await loadActivateRuntimeSecretsSnapshot()
      : void 0;
    return await runWithSecretsActivationLock(async () => {
      if (
        getActiveSecretsRuntimeSnapshotRevision() !== expectedRevision ||
        !hasCurrentAuthStoreCredentialsRevision(snapshot) ||
        (canActivate && !canActivate())
      )
        return null;
      let activated;
      let publication;
      try {
        activated = await finishPreparedSnapshot(
          snapshot,
          activationParams,
          activateRuntimeSecretsSnapshot
            ? {
                activateRuntimeSecretsSnapshot,
                ...(onActivated
                  ? {
                      onActivated: () => {
                        publication = Promise.resolve(onActivated());
                      },
                    }
                  : {}),
              }
            : void 0,
        );
      } catch (err) {
        return handleSecretsActivationError(err, activationParams, snapshot.sourceConfig);
      }
      await publication;
      return activated;
    });
  };
  return activateRuntimeSecrets;
}
/** Throw a formatted startup error when the loaded config snapshot is invalid. */
function assertValidGatewayStartupConfigSnapshot(snapshot, options = {}) {
  if (snapshot.valid) return;
  const issues =
    snapshot.issues.length > 0
      ? formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true }).join("\n")
      : "Unknown validation issue.";
  const recoveryHint =
    options.includeDoctorHint && isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot)
      ? `\n${formatPluginPackagingRuntimeOutputRecoveryHint()}`
      : options.includeDoctorHint
        ? `\n${formatInvalidConfigRecoveryHint()}`
        : "";
  throw createInvalidConfigError(snapshot.path, `${issues}${recoveryHint}`);
}
/** Prepare the effective Gateway startup config after auth, overrides, and secrets activation. */
async function prepareGatewayStartupConfig(params) {
  const measure = params.measure ?? (async (_name, run) => await run());
  await measure("config.auth.snapshot-validate", () =>
    assertValidGatewayStartupConfigSnapshot(params.configSnapshot),
  );
  const runtimeConfig = await measure("config.auth.runtime-overrides", () =>
    applyConfigOverrides(params.configSnapshot.config),
  );
  const startupPreflightConfig = await measure("config.auth.startup-overrides", () =>
    applyGatewayAuthOverridesForStartupPreflight(runtimeConfig, {
      auth: params.authOverride,
      tailscale: params.tailscaleOverride,
    }),
  );
  const needsAuthSecretPreflight = await measure("config.auth.secret-surface", () =>
    hasActiveGatewayAuthSecretRef(startupPreflightConfig),
  );
  let preflightPrepared;
  const preflightConfig = await measure(
    "config.auth.secret-preflight",
    async () => {
      if (!needsAuthSecretPreflight) return startupPreflightConfig;
      preflightPrepared = await params.activateRuntimeSecrets(startupPreflightConfig, {
        reason: "startup",
        activate: false,
      });
      return preflightPrepared.config;
    },
    { omitErrorMessage: true },
  );
  const canReusePreflightPreparedSnapshot = (config) =>
    Boolean(
      preflightPrepared &&
      params.activateRuntimeSecrets.activatePreparedSnapshot &&
      isDeepStrictEqual(pruneSkippedStartupSecretSurfaces(config), preflightPrepared.sourceConfig),
    );
  const activateStartupSecrets = async (config) => {
    if (preflightPrepared && canReusePreflightPreparedSnapshot(config))
      return await params.activateRuntimeSecrets.activatePreparedSnapshot(preflightPrepared, {
        reason: "startup",
        activate: true,
      });
    return await params.activateRuntimeSecrets(config, {
      reason: "startup",
      activate: true,
    });
  };
  const preflightAuthOverride = await measure("config.auth.preflight-override", () =>
    typeof preflightConfig.gateway?.auth?.token === "string" ||
    typeof preflightConfig.gateway?.auth?.password === "string"
      ? {
          ...params.authOverride,
          ...(typeof preflightConfig.gateway?.auth?.token === "string"
            ? { token: preflightConfig.gateway.auth.token }
            : {}),
          ...(typeof preflightConfig.gateway?.auth?.password === "string"
            ? { password: preflightConfig.gateway.auth.password }
            : {}),
        }
      : params.authOverride,
  );
  const authBootstrap = await measure("config.auth.ensure", () =>
    ensureGatewayStartupAuth({
      cfg: runtimeConfig,
      env: process.env,
      authOverride: preflightAuthOverride,
      tailscaleOverride: params.tailscaleOverride,
      warn: params.log?.warn,
      persist: params.persistStartupAuth ?? false,
      baseHash: params.configSnapshot.hash,
    }),
  );
  const runtimeStartupConfig = await measure("config.auth.runtime-startup-overrides", () =>
    applyGatewayAuthOverridesForStartupPreflight(authBootstrap.cfg, {
      auth: params.authOverride,
      tailscale: params.tailscaleOverride,
    }),
  );
  const activatedConfig = (
    await measure(
      "config.auth.secrets-activate",
      () => activateStartupSecrets(runtimeStartupConfig),
      { omitErrorMessage: true },
    )
  ).config;
  return {
    ...authBootstrap,
    cfg: activatedConfig,
  };
}
function hasActiveGatewayAuthSecretRef(config) {
  const states = evaluateGatewayAuthSurfaceStates({
    config,
    defaults: config.secrets?.defaults,
    env: process.env,
  });
  return GATEWAY_AUTH_SURFACE_PATHS.some((path) => {
    const state = states[path];
    return state.hasSecretRef && state.active;
  });
}
function pruneSkippedStartupSecretSurfaces(config) {
  if (
    !(
      isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) ||
      isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS)
    ) ||
    !config.channels
  )
    return config;
  return {
    ...config,
    channels: void 0,
  };
}
function assertRuntimeGatewayAuthNotKnownWeak(config) {
  assertGatewayAuthNotKnownWeak(
    resolveGatewayAuth({
      authConfig: config.gateway?.auth,
      env: process.env,
      tailscaleMode: config.gateway?.tailscale?.mode ?? "off",
    }),
  );
}
function logGatewayAuthSurfaceDiagnostics(prepared, logSecrets) {
  const states = evaluateGatewayAuthSurfaceStates({
    config: prepared.sourceConfig,
    defaults: prepared.sourceConfig.secrets?.defaults,
    env: process.env,
  });
  const inactiveWarnings = /* @__PURE__ */ new Map();
  for (const warning of prepared.warnings) {
    if (warning.code !== "SECRETS_REF_IGNORED_INACTIVE_SURFACE") continue;
    inactiveWarnings.set(warning.path, warning.message);
  }
  for (const path of GATEWAY_AUTH_SURFACE_PATHS) {
    const state = states[path];
    if (!state.hasSecretRef) continue;
    const stateLabel = state.active ? "active" : "inactive";
    const details =
      (!state.active && inactiveWarnings.get(path) ? inactiveWarnings.get(path) : void 0) ??
      state.reason;
    logSecrets.info(`[SECRETS_GATEWAY_AUTH_SURFACE] ${path} is ${stateLabel}. ${details}`);
  }
}
function applyGatewayAuthOverridesForStartupPreflight(config, overrides) {
  if (!overrides.auth && !overrides.tailscale) return config;
  return {
    ...config,
    gateway: {
      ...config.gateway,
      auth: mergeGatewayAuthConfig(config.gateway?.auth, overrides.auth),
      tailscale: mergeGatewayTailscaleConfig(config.gateway?.tailscale, overrides.tailscale),
    },
  };
}
//#endregion
export {
  createRuntimeSecretsActivator,
  loadGatewayStartupConfigSnapshot,
  prepareGatewayStartupConfig,
};
