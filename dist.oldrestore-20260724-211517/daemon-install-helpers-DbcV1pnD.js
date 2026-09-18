import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { u as resolveGatewayLaunchAgentLabel } from "./constants-obO8goqF.js";
import {
  i as resolveDaemonServicePathDirs,
  n as resolveDaemonInstallRuntimeInputs,
  t as emitDaemonInstallRuntimeWarning,
} from "./daemon-install-plan.shared-Bcqb6z_A.js";
import {
  a as normalizeEnvVarKey,
  n as isDangerousHostEnvOverrideVarName,
  r as isDangerousHostEnvVarName,
} from "./host-env-security-pMY6K0Qy.js";
import { n as createLazyPromise } from "./lazy-promise-EhsWch5m.js";
import { t as loadPluginManifestRegistry } from "./manifest-registry-CXy9BBfE.js";
import {
  n as resolveGatewayTaskScriptPath,
  t as resolveGatewayStateDir,
} from "./paths-t9LtxoUy.js";
import {
  i as resolveOpenClawWrapperPath,
  n as resolveGatewayProgramArguments,
  t as OPENCLAW_WRAPPER_ENV_KEY,
} from "./program-args-CoV0mEiK.js";
import {
  a as isPluginIntegrationSecretProviderConfig,
  s as resolveSecretProviderIntegrationConfig,
} from "./resolve-Dvpn9c2h.js";
import { t as collectPluginConfigAssignments } from "./runtime-config-collectors-plugins-58T5GK53.js";
import {
  d as buildServiceEnvironment,
  s as isNonMinimalServicePathEntry,
} from "./runtime-paths-DxDI3o5V.js";
import "./target-registry-Db69vEew.js";
import { r as createResolverContext } from "./runtime-shared-CE1Ki5Mc.js";
import {
  C as readManagedServiceEnvKeysFromEnvironment,
  T as collectDurableServiceEnvVarSources,
  b as hasEnvironmentFileSource,
  w as writeManagedServiceEnvKeysToEnvironment,
  y as formatManagedServiceEnvKeys,
} from "./systemd-BI3sgDKJ.js";
import { n as discoverConfigSecretTargets } from "./target-registry-query-CH3KJb3I.js";
import { g as resolveSecretInputRef, s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/daemon/service-env-plan.ts
/** Builds normalized environment plans for managed daemon service rendering. */
function createMutableServiceEnvPlan() {
  return {
    environment: {},
    environmentValueSources: {},
  };
}
function normalizeServiceEnvPlanKey(rawKey) {
  return normalizeEnvVarKey(rawKey, { portable: true })?.toUpperCase();
}
function addServiceEnvPlanEntries(plan, entries, options) {
  for (const [rawKey, rawValue] of Object.entries(entries)) {
    if (typeof rawValue !== "string" || !rawValue.trim()) {
      if (options.includeRawKeys) {
        plan.environment[rawKey] = rawValue;
        plan.environmentValueSources[rawKey] = "inline";
      }
      continue;
    }
    const value = rawValue;
    const normalizedKey = normalizeServiceEnvPlanKey(rawKey);
    if (!normalizedKey) continue;
    plan.environment[rawKey] = value;
    const valueSource =
      typeof options.valueSource === "function"
        ? options.valueSource({
            rawKey,
            normalizedKey,
          })
        : options.valueSource;
    plan.environmentValueSources[rawKey] = valueSource ?? "inline";
  }
}
function compactServiceEnvPlanValueSources(plan) {
  for (const key of Object.keys(plan.environmentValueSources))
    if (!Object.hasOwn(plan.environment, key)) delete plan.environmentValueSources[key];
}
//#endregion
//#region src/daemon/service-env-render-policy.ts
/** Applies platform render policy for managed daemon service environment values. */
function isLaunchAgentServiceEnvironment(params) {
  return (
    params.platform === "darwin" &&
    Boolean(params.serviceEnvironment.OPENCLAW_LAUNCHD_LABEL?.trim())
  );
}
function addManagedServiceEnvEntries(params) {
  for (const [rawKey, value] of Object.entries(params.entries)) {
    if (typeof value !== "string" || !value.trim()) continue;
    const key = normalizeServiceEnvPlanKey(rawKey);
    if (!key || !params.managedKeys.has(key)) continue;
    params.plan.environment[rawKey] = value;
    params.plan.environmentValueSources[rawKey] = params.valueSource;
  }
}
function applyManagedServiceEnvRenderPolicy(params) {
  const launchAgent = isLaunchAgentServiceEnvironment(params);
  writeManagedServiceEnvKeysToEnvironment(params.plan.environment, params.managedServiceEnvKeys);
  if (params.plan.environment.OPENCLAW_SERVICE_MANAGED_ENV_KEYS)
    params.plan.environmentValueSources.OPENCLAW_SERVICE_MANAGED_ENV_KEYS = "inline";
  const managedKeys = readManagedServiceEnvKeysFromEnvironment({
    OPENCLAW_SERVICE_MANAGED_ENV_KEYS: params.managedServiceEnvKeys,
  });
  if (managedKeys.size === 0) return;
  if (launchAgent) {
    addManagedServiceEnvEntries({
      plan: params.plan,
      entries: params.existingEnvironmentFileEnvironment,
      managedKeys,
      valueSource: "file",
    });
    addManagedServiceEnvEntries({
      plan: params.plan,
      entries: params.stateDirDotEnvEnvironment,
      managedKeys,
      valueSource: "inline",
    });
  }
  addManagedServiceEnvEntries({
    plan: params.plan,
    entries: params.configSecretRefEnvironment,
    managedKeys,
    valueSource: params.platform === "linux" ? "file" : "inline",
  });
}
//#endregion
//#region src/commands/daemon-install-helpers.ts
const NON_PERSISTED_CONFIG_SECRET_ENV_TARGET_IDS = /* @__PURE__ */ new Set([
  "gateway.auth.password",
  "gateway.auth.token",
]);
const EXEC_SECRET_REF_PASS_ENV_ALLOWED_OVERRIDE_ONLY_KEYS = /* @__PURE__ */ new Set(["HOME"]);
function configContainsSecretRef(config) {
  if (!config) return false;
  const pending = [config];
  const seen = /* @__PURE__ */ new Set();
  const defaults = config.secrets?.defaults;
  while (pending.length > 0) {
    const value = pending.pop();
    if (coerceSecretRef(value, defaults)) return true;
    if (!value || typeof value !== "object" || seen.has(value)) continue;
    seen.add(value);
    pending.push(...Object.values(value));
  }
  return false;
}
function isBlockedExecSecretRefPassEnvKey(key) {
  if (isDangerousHostEnvVarName(key)) return true;
  if (!isDangerousHostEnvOverrideVarName(key)) return false;
  return !EXEC_SECRET_REF_PASS_ENV_ALLOWED_OVERRIDE_ONLY_KEYS.has(key.toUpperCase());
}
const loadDaemonInstallAuthProfileSourceRuntime = createLazyPromise(
  () => import("./daemon-install-auth-profiles-source.runtime.js"),
  { cacheRejections: true },
);
const loadDaemonInstallAuthProfileStoreRuntime = createLazyPromise(
  () => import("./daemon-install-auth-profiles-store.runtime.js"),
  { cacheRejections: true },
);
async function resolveAuthProfileStoreForServiceEnv(authStore) {
  if (authStore) return authStore;
  const { hasAnyAuthProfileStoreSource } = await loadDaemonInstallAuthProfileSourceRuntime();
  if (!hasAnyAuthProfileStoreSource()) return;
  const { loadAuthProfileStoreForSecretsRuntime } =
    await loadDaemonInstallAuthProfileStoreRuntime();
  return loadAuthProfileStoreForSecretsRuntime();
}
function collectAuthProfileSecretRefs(authStore) {
  if (!authStore) return [];
  const refs = [];
  for (const credential of Object.values(authStore.profiles)) {
    const ref =
      credential.type === "api_key"
        ? credential.keyRef
        : credential.type === "token"
          ? credential.tokenRef
          : void 0;
    if (ref) refs.push(ref);
  }
  return refs;
}
function collectAuthProfileServiceEnvVars(params) {
  const entries = {};
  for (const ref of collectAuthProfileSecretRefs(params.authStore)) {
    if (!ref || ref.source !== "env") continue;
    const key = normalizeEnvVarKey(ref.id, { portable: true });
    if (!key) continue;
    if (isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key)) {
      params.warn?.(
        `Auth profile env ref "${key}" blocked by host-env security policy`,
        "Auth profile",
      );
      continue;
    }
    const value = params.env[key]?.trim();
    if (!value) continue;
    entries[key] = value;
  }
  return entries;
}
function collectConfigSecretRefServiceEnvSources(params) {
  const keys = /* @__PURE__ */ new Set();
  const environment = {};
  if (!params.config || !params.configContainsSecretRef)
    return {
      keys: [],
      environment,
    };
  for (const target of discoverConfigSecretTargets(params.config)) {
    if (!target.entry.includeInPlan) continue;
    if (NON_PERSISTED_CONFIG_SECRET_ENV_TARGET_IDS.has(target.entry.id)) continue;
    const { ref } = resolveSecretInputRef({
      value: target.value,
      refValue: target.refValue,
      defaults: params.config.secrets?.defaults,
    });
    if (!ref || ref.source !== "env") continue;
    const key = normalizeEnvVarKey(ref.id, { portable: true });
    if (!key) {
      params.warn?.(
        `Config SecretRef env id "${ref.id}" is not portable and was not added to the service environment`,
        "Config SecretRef",
      );
      continue;
    }
    if (isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key)) {
      params.warn?.(
        `Config SecretRef env ref "${key}" blocked by host-env security policy`,
        "Config SecretRef",
      );
      continue;
    }
    keys.add(key.toUpperCase());
    if (Object.hasOwn(params.stateDirDotEnvEnvironment, key)) continue;
    const value = params.env[key]?.trim();
    if (!value) continue;
    environment[key] = value;
  }
  return {
    keys: [...keys],
    environment,
  };
}
function collectExecSecretRefPassEnvServiceEnvVars(params) {
  if (!params.config) return {};
  const entries = {};
  let manifestRegistry;
  const sources = [];
  if (params.configContainsSecretRef)
    for (const target of discoverConfigSecretTargets(params.config)) {
      if (!target.entry.includeInPlan) continue;
      const { ref } = resolveSecretInputRef({
        value: target.value,
        refValue: target.refValue,
        defaults: params.config.secrets?.defaults,
      });
      if (!ref || ref.source !== "exec") continue;
      sources.push({
        ref,
        warningTitle: "Config SecretRef",
      });
    }
  for (const ref of collectAuthProfileSecretRefs(params.authStore))
    if (ref.source === "exec")
      sources.push({
        ref,
        warningTitle: "Auth profile",
      });
  if (params.configContainsSecretRef) {
    for (const ref of collectPluginConfigSecretRefs({
      env: params.env,
      config: params.config,
    }))
      if (ref.source === "exec")
        sources.push({
          ref,
          warningTitle: "Plugin config SecretRef",
        });
  }
  for (const { ref, warningTitle } of sources) {
    const provider = params.config.secrets?.providers?.[ref.provider];
    if (!provider || provider.source !== "exec") continue;
    const execProvider = isPluginIntegrationSecretProviderConfig(provider)
      ? (() => {
          manifestRegistry ??= loadPluginManifestRegistry({
            config: params.config,
            env: params.env,
          });
          const resolved = resolveSecretProviderIntegrationConfig({
            manifestRegistry,
            providerAlias: ref.provider,
            providerConfig: provider,
            config: params.config,
            env: params.env,
          });
          if (!resolved.ok) {
            params.warn?.(
              `Exec SecretRef plugin provider "${ref.provider}" could not be resolved for service environment planning: ${resolved.reason}`,
              warningTitle,
            );
            return;
          }
          return resolved.providerConfig;
        })()
      : provider;
    if (!execProvider) continue;
    for (const rawKey of execProvider.passEnv ?? []) {
      const key = normalizeEnvVarKey(rawKey, { portable: true });
      if (!key) {
        params.warn?.(
          `Exec SecretRef passEnv id "${rawKey}" is not portable and was not added to the service environment`,
          warningTitle,
        );
        continue;
      }
      if (isBlockedExecSecretRefPassEnvKey(key)) {
        params.warn?.(
          `Exec SecretRef passEnv ref "${key}" blocked by host-env security policy`,
          warningTitle,
        );
        continue;
      }
      if (Object.hasOwn(params.durableEnvironment, key)) continue;
      const value = params.env[key]?.trim();
      if (!value) continue;
      entries[key] = value;
    }
  }
  return entries;
}
function collectPluginConfigSecretRefs(params) {
  const context = createResolverContext({
    sourceConfig: params.config,
    env: params.env,
  });
  collectPluginConfigAssignments({
    config: params.config,
    defaults: params.config.secrets?.defaults,
    context,
  });
  return context.assignments.map((assignment) => assignment.ref);
}
function mergeServicePath(nextPath, existingPath, tmpDir, platform) {
  const segments = [];
  const seen = /* @__PURE__ */ new Set();
  const normalizedTmpDirs = [tmpDir, os.tmpdir()]
    .map((value) => value?.trim())
    .filter((value) => Boolean(value))
    .map((value) => path.resolve(value));
  const realTmpDirs = normalizedTmpDirs.map((tmpRoot) => {
    try {
      return path.normalize(fs.realpathSync.native(tmpRoot));
    } catch {
      return tmpRoot;
    }
  });
  const isSameOrChildPath = (candidate, parent) =>
    candidate === parent || candidate.startsWith(`${parent}${path.sep}`);
  const isUnsafeProcPath = (candidate) =>
    candidate === `${path.sep}proc` || candidate.startsWith(`${path.sep}proc${path.sep}`);
  const realpathExistingPath = (candidate) => {
    const parts = [];
    let current = candidate;
    while (current && current !== path.dirname(current))
      try {
        const realCurrent = path.normalize(fs.realpathSync.native(current));
        return path.normalize(path.join(realCurrent, ...parts.toReversed()));
      } catch {
        parts.push(path.basename(current));
        current = path.dirname(current);
      }
    try {
      return path.normalize(path.join(fs.realpathSync.native(current), ...parts.toReversed()));
    } catch {
      return;
    }
  };
  const normalizePreservedPathSegment = (segment) => {
    if (!path.isAbsolute(segment)) return;
    const normalized = path.normalize(segment);
    if (isUnsafeProcPath(normalized)) return;
    const cwd = path.resolve(process.cwd());
    if (isSameOrChildPath(normalized, cwd)) return;
    try {
      const realSegment = realpathExistingPath(normalized);
      const realCwd = path.normalize(fs.realpathSync.native(cwd));
      if (realSegment && isSameOrChildPath(realSegment, realCwd)) return;
    } catch {}
    return normalized;
  };
  const shouldPreserveNormalizedPathSegment = (segment) => {
    if (isNonMinimalServicePathEntry(segment, platform)) return false;
    const resolved = path.resolve(segment);
    const realResolved = realpathExistingPath(resolved) ?? resolved;
    return ![...normalizedTmpDirs, ...realTmpDirs].some(
      (tmpRoot) => isSameOrChildPath(resolved, tmpRoot) || isSameOrChildPath(realResolved, tmpRoot),
    );
  };
  const addPath = (value, options) => {
    if (typeof value !== "string" || value.trim().length === 0) return;
    for (const segment of value.split(path.delimiter)) {
      const trimmed = segment.trim();
      const candidate = options?.preserve ? normalizePreservedPathSegment(trimmed) : trimmed;
      if (options?.preserve && (!candidate || !shouldPreserveNormalizedPathSegment(candidate)))
        continue;
      if (!candidate || seen.has(candidate)) continue;
      seen.add(candidate);
      segments.push(candidate);
    }
  };
  addPath(nextPath);
  if (platform !== "darwin") addPath(existingPath, { preserve: true });
  return segments.length > 0 ? segments.join(path.delimiter) : void 0;
}
const PRESERVED_OPENCLAW_OPERATOR_OPT_IN_ENV_KEYS = /* @__PURE__ */ new Set([
  "OPENCLAW_CLI_CONTAINER_BYPASS",
  "OPENCLAW_CONTAINER_HINT",
]);
/** Preserve safe operator-owned env vars from an existing service definition. */
function collectPreservedExistingServiceEnvVars(existingEnvironment, managedServiceEnvKeys) {
  if (!existingEnvironment) return {};
  const preserved = {};
  for (const [rawKey, rawValue] of Object.entries(existingEnvironment)) {
    const key = normalizeEnvVarKey(rawKey, { portable: true });
    if (!key) continue;
    const upper = key.toUpperCase();
    if (
      upper === "HOME" ||
      upper === "PATH" ||
      upper === "TMPDIR" ||
      (upper.startsWith("OPENCLAW_") && !PRESERVED_OPENCLAW_OPERATOR_OPT_IN_ENV_KEYS.has(upper))
    )
      continue;
    if (managedServiceEnvKeys.has(upper)) continue;
    if (isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key)) continue;
    const value = rawValue?.trim();
    if (!value) continue;
    preserved[key] = value;
  }
  return preserved;
}
function readExistingEnvironmentValueSource(params) {
  for (const [rawKey, source] of Object.entries(params.existingEnvironmentValueSources ?? {}))
    if (normalizeEnvVarKey(rawKey, { portable: true })?.toUpperCase() === params.normalizedKey)
      return source;
}
function collectExistingEnvironmentFileManagedServiceEnvVars(params) {
  if (!params.existingEnvironment || params.configSecretRefKeys.size === 0) return {};
  const preserved = {};
  for (const [rawKey, rawValue] of Object.entries(params.existingEnvironment)) {
    const key = normalizeEnvVarKey(rawKey, { portable: true });
    if (!key) continue;
    const normalizedKey = key.toUpperCase();
    if (!params.configSecretRefKeys.has(normalizedKey)) continue;
    if (isDangerousHostEnvVarName(key) || isDangerousHostEnvOverrideVarName(key)) continue;
    if (
      !hasEnvironmentFileSource(
        readExistingEnvironmentValueSource({
          existingEnvironmentValueSources: params.existingEnvironmentValueSources,
          normalizedKey,
        }),
      )
    )
      continue;
    const value = rawValue?.trim();
    if (!value) continue;
    preserved[key] = value;
  }
  return preserved;
}
function omitEnvironmentEntriesShadowedBy(entries, shadowEntries) {
  const shadowKeys = new Set(
    shadowEntries.flatMap((environment) =>
      Object.keys(environment).flatMap((key) => {
        const normalized = normalizeEnvVarKey(key, { portable: true })?.toUpperCase();
        return normalized ? [normalized] : [];
      }),
    ),
  );
  return Object.fromEntries(
    Object.entries(entries).filter(([key]) => {
      const normalized = normalizeEnvVarKey(key, { portable: true })?.toUpperCase();
      return !normalized || !shadowKeys.has(normalized);
    }),
  );
}
function resolveGatewayInstallWorkingDirectory(params) {
  if (params.workingDirectory) return params.workingDirectory;
  if (params.platform !== "darwin") return;
  return resolveGatewayStateDir(params.env);
}
async function buildGatewayInstallEnvironment(params) {
  const { stateDirDotEnvEnvironment, configEnvironment, durableEnvironment } =
    collectDurableServiceEnvVarSources({
      env: params.env,
      config: params.config,
    });
  const containsConfigSecretRef = configContainsSecretRef(params.config);
  const { keys: configSecretRefKeys, environment: configSecretRefEnvironment } =
    collectConfigSecretRefServiceEnvSources({
      env: params.env,
      config: params.config,
      configContainsSecretRef: containsConfigSecretRef,
      stateDirDotEnvEnvironment,
      warn: params.warn,
    });
  const authStore = await resolveAuthProfileStoreForServiceEnv(params.authStore);
  const execSecretRefPassEnvEnvironment = collectExecSecretRefPassEnvServiceEnvVars({
    env: params.env,
    config: params.config,
    configContainsSecretRef: containsConfigSecretRef,
    authStore,
    durableEnvironment,
    warn: params.warn,
  });
  const authProfileEnvironment = collectAuthProfileServiceEnvVars({
    env: params.env,
    authStore,
    warn: params.warn,
  });
  const stateDirDotEnvRenderEnvironment = omitEnvironmentEntriesShadowedBy(
    stateDirDotEnvEnvironment,
    [
      configEnvironment,
      configSecretRefEnvironment,
      execSecretRefPassEnvEnvironment,
      authProfileEnvironment,
    ],
  );
  const preservedExistingEnvironment = collectPreservedExistingServiceEnvVars(
    params.existingEnvironment,
    readManagedServiceEnvKeysFromEnvironment(params.existingEnvironment),
  );
  const plan = createMutableServiceEnvPlan();
  addServiceEnvPlanEntries(plan, preservedExistingEnvironment, {
    valueSource: ({ normalizedKey }) =>
      readExistingEnvironmentValueSource({
        existingEnvironmentValueSources: params.existingEnvironmentValueSources,
        normalizedKey,
      }) ?? "inline",
  });
  addServiceEnvPlanEntries(plan, stateDirDotEnvEnvironment, {});
  addServiceEnvPlanEntries(plan, configEnvironment, {});
  addServiceEnvPlanEntries(plan, configSecretRefEnvironment, {});
  addServiceEnvPlanEntries(plan, execSecretRefPassEnvEnvironment, {});
  addServiceEnvPlanEntries(plan, authProfileEnvironment, {});
  const configSecretRefKeyEnvironment = Object.fromEntries(
    configSecretRefKeys.map((key) => [key, "1"]),
  );
  const managedServiceEnvKeys = formatManagedServiceEnvKeys(
    {
      ...durableEnvironment,
      ...configSecretRefKeyEnvironment,
      ...configSecretRefEnvironment,
    },
    { omitKeys: Object.keys(params.serviceEnvironment) },
  );
  const existingEnvironmentFileRenderEnvironment = omitEnvironmentEntriesShadowedBy(
    collectExistingEnvironmentFileManagedServiceEnvVars({
      existingEnvironment: params.existingEnvironment,
      existingEnvironmentValueSources: params.existingEnvironmentValueSources,
      configSecretRefKeys: new Set(configSecretRefKeys),
    }),
    [
      stateDirDotEnvRenderEnvironment,
      configSecretRefEnvironment,
      execSecretRefPassEnvEnvironment,
      authProfileEnvironment,
    ],
  );
  applyManagedServiceEnvRenderPolicy({
    plan,
    managedServiceEnvKeys,
    serviceEnvironment: params.serviceEnvironment,
    platform: params.platform,
    existingEnvironmentFileEnvironment: existingEnvironmentFileRenderEnvironment,
    stateDirDotEnvEnvironment: stateDirDotEnvRenderEnvironment,
    configSecretRefEnvironment,
  });
  addServiceEnvPlanEntries(plan, params.serviceEnvironment, { includeRawKeys: true });
  const mergedPath = mergeServicePath(
    params.serviceEnvironment.PATH,
    params.existingEnvironment?.PATH,
    params.serviceEnvironment.TMPDIR,
    params.platform,
  );
  if (mergedPath) {
    plan.environment.PATH = mergedPath;
    plan.environmentValueSources.PATH = "inline";
  }
  compactServiceEnvPlanValueSources(plan);
  return {
    environment: plan.environment,
    environmentValueSources: plan.environmentValueSources,
  };
}
/** Build command, working directory, and environment for installing the Gateway service. */
async function buildGatewayInstallPlan(params) {
  const platform = params.platform ?? process.platform;
  const { devMode, nodePath } = await resolveDaemonInstallRuntimeInputs({
    env: params.env,
    runtime: params.runtime,
    devMode: params.devMode,
    nodePath: params.nodePath,
  });
  const wrapperInput = params.wrapperPath ?? params.env["OPENCLAW_WRAPPER"];
  const wrapperPointsAtWindowsTaskScript =
    Boolean(wrapperInput?.trim()) &&
    platform === "win32" &&
    isSameServicePath(wrapperInput, resolveGatewayTaskScriptPath(params.env), platform);
  if (wrapperPointsAtWindowsTaskScript)
    params.warn?.(
      `Ignoring ${OPENCLAW_WRAPPER_ENV_KEY} because it points to the Windows task script; using the OpenClaw gateway entrypoint directly to avoid a recursive gateway.cmd wrapper.`,
    );
  const wrapperPath = wrapperPointsAtWindowsTaskScript
    ? void 0
    : await resolveOpenClawWrapperPath(wrapperInput);
  const serviceInputEnv = wrapperPath
    ? {
        ...params.env,
        [OPENCLAW_WRAPPER_ENV_KEY]: wrapperPath,
      }
    : wrapperPointsAtWindowsTaskScript
      ? omitEnvKey(params.env, OPENCLAW_WRAPPER_ENV_KEY)
      : params.env;
  const { programArguments, workingDirectory } = await resolveGatewayProgramArguments({
    port: params.port,
    dev: devMode,
    runtime: params.runtime,
    nodePath,
    wrapperPath,
  });
  await emitDaemonInstallRuntimeWarning({
    env: params.env,
    runtime: params.runtime,
    programArguments,
    warn: params.warn,
    title: "Gateway runtime",
  });
  const serviceEnvironment = buildServiceEnvironment({
    env: serviceInputEnv,
    port: params.port,
    launchdLabel:
      platform === "darwin"
        ? resolveGatewayLaunchAgentLabel(serviceInputEnv.OPENCLAW_PROFILE)
        : void 0,
    platform,
    extraPathDirs: resolveDaemonServicePathDirs({
      nodePath,
      env: serviceInputEnv,
      platform,
    }),
  });
  const { environment, environmentValueSources } = await buildGatewayInstallEnvironment({
    env: serviceInputEnv,
    config: params.config,
    authStore: params.authStore,
    warn: params.warn,
    serviceEnvironment,
    existingEnvironment: params.existingEnvironment,
    existingEnvironmentValueSources: params.existingEnvironmentValueSources,
    platform,
  });
  return {
    programArguments,
    workingDirectory: resolveGatewayInstallWorkingDirectory({
      env: serviceInputEnv,
      platform,
      workingDirectory,
    }),
    environment,
    ...(Object.keys(environmentValueSources).length > 0 ? { environmentValueSources } : {}),
  };
}
function normalizeServicePathForCompare(value, platform) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  return platform === "win32" ? path.win32.resolve(trimmed).toLowerCase() : path.resolve(trimmed);
}
function isSameServicePath(left, right, platform) {
  const normalizedLeft = normalizeServicePathForCompare(left, platform);
  const normalizedRight = normalizeServicePathForCompare(right, platform);
  return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}
function omitEnvKey(env, key) {
  const next = { ...env };
  delete next[key];
  return next;
}
/** Return the user-facing recovery hint for failed Gateway service installation. */
function gatewayInstallErrorHint(platform = process.platform) {
  return platform === "win32"
    ? "Tip: native Windows now falls back to a per-user Startup-folder login item when Scheduled Task creation is denied; if install still fails, rerun from an elevated PowerShell or skip service install."
    : `Tip: rerun \`${formatCliCommand("openclaw gateway install")}\` after fixing the error.`;
}
//#endregion
export { gatewayInstallErrorHint as n, buildGatewayInstallPlan as t };
