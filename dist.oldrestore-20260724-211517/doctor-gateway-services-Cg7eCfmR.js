import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution--RLjXsYk.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { a as trimToUndefined } from "./credential-planner-BTC1pLMc.js";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-DbcV1pnD.js";
import { t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-CHOL1Kuf.js";
import { t as isDoctorUpdateRepairMode } from "./doctor-repair-mode-DtuLXARs.js";
import {
  a as resolveServiceRepairPolicy,
  i as isServiceRepairExternallyManaged,
  r as confirmDoctorServiceRepair,
  t as EXTERNAL_SERVICE_REPAIR_NOTE,
} from "./doctor-service-repair-policy-D0NFzdqc.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import "./credentials-DqHTozxM.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import {
  i as renderGatewayServiceCleanupHints,
  n as findExtraGatewayServices,
} from "./inspect-CD2p_qWO.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { f as resolveGatewayPort, m as resolveIsNixMode } from "./paths-DEklnbzU.js";
import { t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-CoV0mEiK.js";
import {
  a as resolveSystemNodeInfo,
  r as renderSystemNodeWarning,
} from "./runtime-paths-DxDI3o5V.js";
import { a as readWindowsStartupFallbackRuntimeForUpdate } from "./schtasks-BnFuQtB2.js";
import {
  a as readEmbeddedGatewayToken,
  i as needsNodeRuntimeMigration,
  n as auditGatewayServiceConfig,
  t as SERVICE_AUDIT_CODES,
} from "./service-audit-HqR_kPc_.js";
import { a as resolveGatewayService } from "./service-Dw37Ek79.js";
import { t as summarizeGatewayServiceLayout } from "./service-layout-Djhk2cQN.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import {
  C as readManagedServiceEnvKeysFromEnvironment,
  a as isSystemdUnitActive,
  p as uninstallLegacySystemdUnits,
} from "./systemd-BI3sgDKJ.js";
import { g as resolveSecretInputRef } from "./types.secrets-BV0ywRAy.js";
import {
  i as UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV,
  r as UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV,
} from "./update-phase-RYqcMEby.js";
import { i as readWindowsProcessArgsSync } from "./windows-port-pids-ClQ99WdK.js";
//#region src/commands/doctor-gateway-auth-token.ts
/**
 * Resolves the token a managed gateway service can receive at install/update time.
 *
 * Exec SecretRefs are skipped by default because the service installer cannot safely evaluate
 * arbitrary commands; OPENCLAW_GATEWAY_TOKEN remains an explicit env override.
 */
async function resolveGatewayAuthTokenForService(cfg, env, options = {}) {
  if (
    resolveSecretInputRef({
      value: cfg.gateway?.auth?.token,
      defaults: cfg.secrets?.defaults,
    }).ref?.source === "exec" &&
    options.allowExecSecretRefs !== true
  ) {
    const envToken = trimToUndefined(env.OPENCLAW_GATEWAY_TOKEN);
    return envToken ? { token: envToken } : {};
  }
  const resolved = await resolveGatewayAuthToken({
    cfg,
    env,
    unresolvedReasonStyle: "detailed",
    envFallback: "always",
  });
  if (resolved.token) return { token: resolved.token };
  if (!resolved.secretRefConfigured) return {};
  if (resolved.unresolvedRefReason?.includes("resolved to an empty value"))
    return { unavailableReason: resolved.unresolvedRefReason };
  return {
    unavailableReason: `gateway.auth.token SecretRef is configured but unresolved (${resolved.unresolvedRefReason ?? "unknown reason"}).`,
  };
}
//#endregion
//#region src/commands/doctor-gateway-services.ts
/** Doctor repairs for installed gateway service config and duplicate legacy services. */
function shouldSkipLegacyUpdateRepairConfigWrite(env) {
  return (
    isTruthyEnvValue(env["OPENCLAW_UPDATE_IN_PROGRESS"]) &&
    !isTruthyEnvValue(env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"])
  );
}
function updateParentAllowsGatewayActivation(env) {
  const activationPolicy = env[UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV];
  if (activationPolicy !== void 0) return isTruthyEnvValue(activationPolicy);
  const parentArgs = readWindowsProcessArgsSync(process.ppid, 1500);
  if (parentArgs === null) return false;
  const normalizedParentArgs = parentArgs.map(normalizeLowercaseStringOrEmpty);
  const updateIndex = Math.max(
    normalizedParentArgs.lastIndexOf("update"),
    normalizedParentArgs.lastIndexOf("--update"),
  );
  const legacyDoctorUpdateParent = normalizedParentArgs.lastIndexOf("doctor") >= 0;
  const legacyWizardParent = updateIndex >= 0 && normalizedParentArgs[updateIndex + 1] === "wizard";
  return (
    (updateIndex >= 0 || legacyDoctorUpdateParent) &&
    !legacyWizardParent &&
    !normalizedParentArgs.includes("--no-restart")
  );
}
function updateParentAllowsGatewayServiceRepair(env) {
  const repairPolicy = env[UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV];
  return repairPolicy !== void 0 && isTruthyEnvValue(repairPolicy);
}
const EXECSTART_REPAIR_CODES = /* @__PURE__ */ new Set([
  SERVICE_AUDIT_CODES.gatewayCommandMissing,
  SERVICE_AUDIT_CODES.gatewayEntrypointMismatch,
]);
const runLaunchctlQuietly = (args) =>
  runExec("launchctl", args, { logOutput: false }).catch(() => void 0);
const GATEWAY_SERVICES_EXTRA_CHECK_ID = "core/doctor/gateway-services/extra";
function detectGatewayRuntime(programArguments) {
  const first = programArguments?.[0];
  if (first) {
    const base = normalizeLowercaseStringOrEmpty(path.basename(first));
    if (base === "bun" || base === "bun.exe") return DEFAULT_GATEWAY_DAEMON_RUNTIME;
    if (base === "node" || base === "node.exe") return "node";
  }
  return DEFAULT_GATEWAY_DAEMON_RUNTIME;
}
function findGatewayEntrypoint(programArguments) {
  if (!programArguments || programArguments.length === 0) return null;
  const gatewayIndex = programArguments.indexOf("gateway");
  if (gatewayIndex <= 0) return null;
  return programArguments[gatewayIndex - 1] ?? null;
}
function buildGatewayServiceRepairEnv(command) {
  const wrapperPath = command?.environment?.[OPENCLAW_WRAPPER_ENV_KEY]?.trim();
  if (!wrapperPath || Object.hasOwn(process.env, "OPENCLAW_WRAPPER")) return process.env;
  return {
    ...process.env,
    [OPENCLAW_WRAPPER_ENV_KEY]: wrapperPath,
  };
}
function resolveGatewayServiceWrapperPath(command) {
  return normalizeOptionalString(command?.environment?.["OPENCLAW_WRAPPER"]) ?? null;
}
async function buildExpectedGatewayServicePlan(params) {
  return buildGatewayInstallPlan({
    env: params.serviceInstallEnv,
    port: params.port,
    runtime: params.runtime,
    nodePath: params.nodePath,
    existingEnvironment: params.command.environment,
    existingEnvironmentValueSources: params.command.environmentValueSources,
    warn: (message, title) => note(message, title),
    config: params.cfg,
  });
}
async function buildGatewayServiceAuditInputs(params) {
  const port = resolveGatewayPort(params.cfg, process.env);
  const runtimeChoice = detectGatewayRuntime(params.command.programArguments);
  const expectedPlan = await buildExpectedGatewayServicePlan({
    cfg: params.cfg,
    command: params.command,
    serviceInstallEnv: params.serviceInstallEnv,
    port,
    runtime: runtimeChoice,
  });
  return {
    expectedManagedServiceEnvKeys: readManagedServiceEnvKeysFromEnvironment(
      expectedPlan.environment,
    ),
    expectedPlan,
    port,
    runtimeChoice,
  };
}
async function normalizeExecutablePath(value) {
  const resolvedPath = path.resolve(value);
  try {
    return await fs.realpath(resolvedPath);
  } catch {
    return resolvedPath;
  }
}
function extractDetailPath(detail, prefix) {
  if (!detail.startsWith(prefix)) return null;
  const value = detail.slice(prefix.length).trim();
  return value.length > 0 ? value : null;
}
function isExecStartRepairIssue(issue) {
  return EXECSTART_REPAIR_CODES.has(issue.code);
}
function resolveSystemdScopeFromServicePath(sourcePath) {
  const normalized = sourcePath?.replaceAll("\\", "/") ?? "";
  return normalized.startsWith("/etc/systemd/") ||
    normalized.startsWith("/usr/lib/systemd/") ||
    normalized.startsWith("/lib/systemd/")
    ? "system"
    : "user";
}
function resolveSystemdUnitNameFromServicePath(sourcePath) {
  const base = sourcePath ? path.posix.basename(sourcePath.replaceAll("\\", "/")) : "";
  return base.endsWith(".service") ? base : "openclaw-gateway.service";
}
function shouldDeferUpdateModeSystemdServiceRepair(params) {
  return (
    process.platform === "linux" &&
    isDoctorUpdateRepairMode(params.repairMode) &&
    !params.shouldForce
  );
}
async function readWindowsGatewayRuntimeForUpdateRepair(params) {
  if (process.platform !== "win32") return null;
  return await params.service.readRuntime(params.env).catch(() => null);
}
async function suppressRunningSystemdExecStartRepairs(params) {
  if (process.platform !== "linux") return false;
  if (!params.issues.some(isExecStartRepairIssue)) return false;
  const unitName = resolveSystemdUnitNameFromServicePath(params.command.sourcePath);
  const scope = resolveSystemdScopeFromServicePath(params.command.sourcePath);
  if (!(await isSystemdUnitActive(process.env, unitName, scope))) return false;
  const before = params.issues.length;
  params.issues.splice(
    0,
    params.issues.length,
    ...params.issues.filter((issue) => !isExecStartRepairIssue(issue)),
  );
  if (params.issues.length !== before)
    note(
      `Gateway service ${unitName} is running; skipped command/entrypoint rewrites for this doctor pass.`,
      "Gateway service config",
    );
  return true;
}
async function filterInactiveExtraGatewayServices(services) {
  if (process.platform !== "linux") return services;
  const activeOrLegacy = [];
  for (const svc of services) {
    if (svc.platform !== "linux" || svc.legacy === true) {
      activeOrLegacy.push(svc);
      continue;
    }
    if (await isSystemdUnitActive(process.env, svc.label, svc.scope)) activeOrLegacy.push(svc);
  }
  return activeOrLegacy;
}
async function detectExtraGatewayServiceIssues(options = {}) {
  return await filterInactiveExtraGatewayServices(
    await findExtraGatewayServices(process.env, { deep: options.deep }),
  );
}
function extraGatewayServiceToHealthFinding(service) {
  return {
    checkId: GATEWAY_SERVICES_EXTRA_CHECK_ID,
    severity: service.legacy === true ? "warning" : "info",
    message: `Other gateway-like service detected: ${service.label} (${service.scope}, ${service.detail})`,
    source: service.platform,
    target: service.label,
    fixHint:
      service.legacy === true
        ? "Run openclaw doctor --fix to remove legacy gateway services."
        : "Run a single gateway per machine unless this extra gateway is intentional.",
  };
}
function extraGatewayServiceToRepairEffects(service) {
  if (service.legacy !== true) return [];
  return [
    {
      kind: "service",
      action: "would-remove-legacy-gateway-service",
      target: service.label,
      dryRunSafe: false,
    },
  ];
}
async function cleanupLegacyLaunchdService(params) {
  const domain = typeof process.getuid === "function" ? `gui/${process.getuid()}` : "gui/501";
  await runLaunchctlQuietly(["bootout", domain, params.plistPath]);
  await runLaunchctlQuietly(["unload", params.plistPath]);
  const trashDir = path.join(os.homedir(), ".Trash");
  try {
    await fs.mkdir(trashDir, { recursive: true });
  } catch {}
  try {
    await fs.access(params.plistPath);
  } catch {
    return null;
  }
  const dest = path.join(trashDir, `${params.label}-${Date.now()}.plist`);
  try {
    await fs.rename(params.plistPath, dest);
    return dest;
  } catch {
    return null;
  }
}
function classifyLegacyServices(legacyServices) {
  const darwinUserServices = [];
  const linuxUserServices = [];
  const failed = [];
  for (const svc of legacyServices) {
    if (svc.platform === "darwin") {
      if (svc.scope === "user") darwinUserServices.push(svc);
      else failed.push(`${svc.label} (${svc.scope})`);
      continue;
    }
    if (svc.platform === "linux") {
      if (svc.scope === "user") linuxUserServices.push(svc);
      else failed.push(`${svc.label} (${svc.scope})`);
      continue;
    }
    failed.push(`${svc.label} (${svc.platform})`);
  }
  return {
    darwinUserServices,
    linuxUserServices,
    failed,
  };
}
async function cleanupLegacyDarwinServices(services) {
  const removed = [];
  const failed = [];
  for (const svc of services) {
    const plistPath = extractDetailPath(svc.detail, "plist:");
    if (!plistPath) {
      failed.push(`${svc.label} (missing plist path)`);
      continue;
    }
    const dest = await cleanupLegacyLaunchdService({
      label: svc.label,
      plistPath,
    });
    removed.push(dest ? `${svc.label} -> ${dest}` : svc.label);
  }
  return {
    removed,
    failed,
  };
}
async function cleanupLegacyLinuxUserServices(services, runtime) {
  const removed = [];
  const failed = [];
  try {
    const removedUnits = await uninstallLegacySystemdUnits({
      env: process.env,
      stdout: process.stdout,
    });
    const removedByLabel = new Map(removedUnits.map((unit) => [`${unit.name}.service`, unit]));
    for (const svc of services) {
      const removedUnit = removedByLabel.get(svc.label);
      if (!removedUnit) {
        failed.push(`${svc.label} (legacy unit name not recognized)`);
        continue;
      }
      removed.push(`${svc.label} -> ${removedUnit.unitPath}`);
    }
  } catch (err) {
    runtime.error(`Legacy Linux gateway cleanup failed: ${String(err)}`);
    for (const svc of services) failed.push(`${svc.label} (linux cleanup failed)`);
  }
  return {
    removed,
    failed,
  };
}
/**
 * Audits and optionally rewrites the installed local gateway service configuration.
 *
 * The repair preserves managed env sources and avoids Nix/remote installs. Update-mode repairs
 * stay staged except for running Windows services, which must be activated to replace a fallback.
 */
async function maybeRepairGatewayServiceConfig(cfg, mode, runtime, prompter, options = {}) {
  if (resolveIsNixMode(process.env)) {
    note("Nix mode detected; skip service updates.", "Gateway");
    return cfg;
  }
  if (mode === "remote") {
    note("Gateway mode is remote; skipped local service audit.", "Gateway");
    return cfg;
  }
  const service = resolveGatewayService();
  let command;
  try {
    command = await service.readCommand(process.env);
  } catch {
    command = null;
  }
  if (!command) return cfg;
  const serviceInstallEnv = buildGatewayServiceRepairEnv(command);
  const serviceWrapperPath = resolveGatewayServiceWrapperPath(command);
  if (serviceWrapperPath)
    note(`Gateway service invokes ${OPENCLAW_WRAPPER_ENV_KEY}: ${serviceWrapperPath}`, "Gateway");
  const serviceLayout = await summarizeGatewayServiceLayout(command);
  const sourceCheckoutWarning = serviceLayout?.entrypointSourceCheckout
    ? [
        `Gateway service entrypoint resolves to a source checkout: ${serviceLayout.packageRootReal ?? serviceLayout.packageRoot ?? serviceLayout.entrypointReal ?? serviceLayout.entrypoint}.`,
        "Run `openclaw doctor --fix` from the intended package install, or reinstall the gateway service with `openclaw gateway install --force`.",
      ].join("\n")
    : null;
  const tokenRefConfigured = Boolean(
    resolveSecretInputRef({
      value: cfg.gateway?.auth?.token,
      defaults: cfg.secrets?.defaults,
    }).ref,
  );
  const gatewayTokenResolution = await resolveGatewayAuthTokenForService(cfg, process.env, {
    allowExecSecretRefs: options.allowExecSecretRefs === true,
  });
  if (gatewayTokenResolution.unavailableReason)
    note(
      `Unable to verify gateway service token drift: ${gatewayTokenResolution.unavailableReason}`,
      "Gateway service config",
    );
  const expectedGatewayToken = tokenRefConfigured ? void 0 : gatewayTokenResolution.token;
  const { expectedManagedServiceEnvKeys, expectedPlan, port, runtimeChoice } =
    await buildGatewayServiceAuditInputs({
      cfg,
      command,
      serviceInstallEnv,
    });
  const audit = await auditGatewayServiceConfig({
    env: process.env,
    command,
    expectedGatewayToken,
    expectedManagedServiceEnvKeys,
    expectedServicePath: expectedPlan.environment.PATH,
    expectedPort: port,
  });
  const serviceToken = readEmbeddedGatewayToken(command);
  if (tokenRefConfigured && serviceToken)
    audit.issues.push({
      code: SERVICE_AUDIT_CODES.gatewayTokenMismatch,
      message:
        "Gateway service OPENCLAW_GATEWAY_TOKEN should be unset when gateway.auth.token is SecretRef-managed",
      detail: "service token is stale",
      level: "recommended",
    });
  const needsNodeRuntime = needsNodeRuntimeMigration(audit.issues);
  const systemNodeInfo = needsNodeRuntime
    ? await resolveSystemNodeInfo({ env: process.env })
    : null;
  const systemNodePath = systemNodeInfo?.supported ? systemNodeInfo.path : null;
  if (needsNodeRuntime && !systemNodePath && runtimeChoice !== "node") {
    const warning = renderSystemNodeWarning(systemNodeInfo);
    if (warning) note(warning, "Gateway runtime");
    else
      note(
        "System Node 22 LTS (22.22.3+) or Node 24.15+ not found. Install via Homebrew/apt/choco and rerun doctor to migrate off Bun/version managers.",
        "Gateway runtime",
      );
  }
  const { programArguments } =
    needsNodeRuntime && systemNodePath
      ? await buildExpectedGatewayServicePlan({
          cfg,
          command,
          serviceInstallEnv,
          port,
          runtime: "node",
          nodePath: systemNodePath,
        })
      : expectedPlan;
  const expectedEntrypoint = findGatewayEntrypoint(programArguments);
  const currentEntrypoint = findGatewayEntrypoint(command.programArguments);
  const normalizedExpectedEntrypoint = expectedEntrypoint
    ? await normalizeExecutablePath(expectedEntrypoint)
    : null;
  const normalizedCurrentEntrypoint = currentEntrypoint
    ? await normalizeExecutablePath(currentEntrypoint)
    : null;
  if (
    normalizedExpectedEntrypoint &&
    normalizedCurrentEntrypoint &&
    normalizedExpectedEntrypoint !== normalizedCurrentEntrypoint
  )
    audit.issues.push({
      code: SERVICE_AUDIT_CODES.gatewayEntrypointMismatch,
      message: "Gateway service entrypoint does not match the current install.",
      detail: `${currentEntrypoint} -> ${expectedEntrypoint}`,
      level: "recommended",
    });
  const serviceRewriteBlocked = await suppressRunningSystemdExecStartRepairs({
    command,
    issues: audit.issues,
  });
  const hasEntrypointMismatch = audit.issues.some(
    (issue) => issue.code === SERVICE_AUDIT_CODES.gatewayEntrypointMismatch,
  );
  const showSourceCheckoutWarning = sourceCheckoutWarning !== null && !hasEntrypointMismatch;
  if (audit.issues.length === 0) {
    if (sourceCheckoutWarning !== null && !hasEntrypointMismatch)
      note(sourceCheckoutWarning, "Gateway service config");
    return cfg;
  }
  const serviceRepairExternal = isServiceRepairExternallyManaged(resolveServiceRepairPolicy());
  const consolidatedLines = [];
  let emittedSourceCheckoutWarning = false;
  if (sourceCheckoutWarning !== null && showSourceCheckoutWarning) {
    consolidatedLines.push(sourceCheckoutWarning);
    consolidatedLines.push("");
    emittedSourceCheckoutWarning = true;
  }
  consolidatedLines.push(
    ...audit.issues.map((issue) =>
      issue.detail ? `- ${issue.message} (${issue.detail})` : `- ${issue.message}`,
    ),
  );
  note(consolidatedLines.join("\n"), "Gateway service config");
  const needsAggressive = audit.issues.filter((issue) => issue.level === "aggressive").length > 0;
  if (needsAggressive && !prompter.shouldForce)
    note(
      "Custom or unexpected service edits detected. Rerun with --force to overwrite.",
      "Gateway service config",
    );
  if (serviceRepairExternal) {
    note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway service config");
    return cfg;
  }
  if (serviceRewriteBlocked) {
    note(
      "Gateway service is running; leaving supervisor metadata unchanged. Stop the service first or use `openclaw gateway install --force` when you want to replace the active launcher.",
      "Gateway service config",
    );
    return cfg;
  }
  const updateRepairMode = isDoctorUpdateRepairMode(prompter.repairMode);
  if (updateRepairMode && !updateParentAllowsGatewayServiceRepair(process.env)) {
    note(
      "Update parent did not authorize changes to this gateway service definition; leaving it unchanged.",
      "Gateway service config",
    );
    return cfg;
  }
  if (
    shouldDeferUpdateModeSystemdServiceRepair({
      repairMode: prompter.repairMode,
      shouldForce: prompter.shouldForce,
    })
  ) {
    note(
      "Update-mode doctor detected gateway service drift but left the live systemd unit unchanged. Review the service file and run `openclaw gateway install --force` when you want OpenClaw to replace operator-owned systemd directives.",
      "Gateway service config",
    );
    return cfg;
  }
  const repairMessage = needsAggressive
    ? "Overwrite gateway service config with current defaults now?"
    : "Update gateway service config to the recommended defaults now?";
  if (
    !(updateRepairMode
      ? needsAggressive
        ? await prompter.confirmAggressiveAutoFix({
            message: repairMessage,
            initialValue: prompter.shouldForce,
          })
        : await prompter.confirmAutoFix({
            message: repairMessage,
            initialValue: true,
          })
      : await prompter.confirmRuntimeRepair({
          message: repairMessage,
          initialValue: needsAggressive ? prompter.shouldForce : true,
          requiresInteractiveConfirmation: true,
        }))
  ) {
    if (!emittedSourceCheckoutWarning)
      note(
        "Run `openclaw gateway install --force` when you want to replace the gateway service definition.",
        "Gateway service config",
      );
    return cfg;
  }
  const serviceEmbeddedToken = readEmbeddedGatewayToken(command);
  const gatewayTokenForRepair = expectedGatewayToken ?? serviceEmbeddedToken;
  const configuredGatewayToken =
    typeof cfg.gateway?.auth?.token === "string"
      ? normalizeOptionalString(cfg.gateway.auth.token)
      : void 0;
  let cfgForServiceInstall = cfg;
  const updateRepairWillRewriteWindowsTask = updateRepairMode && process.platform === "win32";
  const serviceRuntimeEnv = {
    ...serviceInstallEnv,
    ...command.environment,
  };
  const installedWindowsTaskName = command.environment?.OPENCLAW_WINDOWS_TASK_NAME?.trim();
  const serviceRepairEnv =
    updateRepairWillRewriteWindowsTask && installedWindowsTaskName
      ? {
          ...serviceInstallEnv,
          OPENCLAW_WINDOWS_TASK_NAME: installedWindowsTaskName,
        }
      : serviceInstallEnv;
  const updateRepairShouldInstall =
    (updateRepairWillRewriteWindowsTask && updateParentAllowsGatewayActivation(process.env)
      ? await readWindowsGatewayRuntimeForUpdateRepair({
          service,
          env: serviceRuntimeEnv,
        })
      : null
    )?.status === "running";
  let startupFallbackTakeoverRuntime;
  if (updateRepairShouldInstall)
    try {
      const fallbackRuntime = await readWindowsStartupFallbackRuntimeForUpdate(serviceRuntimeEnv);
      if (fallbackRuntime && (fallbackRuntime.status !== "running" || !fallbackRuntime.pid)) {
        note(
          "Could not verify the running Windows login item before service repair; leaving it unchanged.",
          "Gateway",
        );
        return cfg;
      }
      startupFallbackTakeoverRuntime = fallbackRuntime ?? void 0;
    } catch (err) {
      runtime.error(
        `Could not inspect the Windows login item before service repair: ${String(err)}`,
      );
      return cfg;
    }
  if (
    (!updateRepairMode || updateRepairWillRewriteWindowsTask) &&
    !tokenRefConfigured &&
    !configuredGatewayToken &&
    gatewayTokenForRepair
  ) {
    if (
      updateRepairWillRewriteWindowsTask &&
      shouldSkipLegacyUpdateRepairConfigWrite(process.env)
    ) {
      note(
        "Legacy update parent cannot persist gateway.auth.token before service repair; leaving the existing gateway service unchanged.",
        "Gateway",
      );
      return cfg;
    }
    const nextCfg = {
      ...cfg,
      gateway: {
        ...cfg.gateway,
        auth: {
          ...cfg.gateway?.auth,
          mode: cfg.gateway?.auth?.mode ?? "token",
          token: gatewayTokenForRepair,
        },
      },
    };
    try {
      await replaceConfigFile({
        nextConfig: nextCfg,
        afterWrite: { mode: "auto" },
        writeOptions: {
          allowConfigSizeDrop: options.allowConfigSizeDrop === true || updateRepairMode,
          skipPluginValidation: options.skipPluginValidation === true || updateRepairMode,
          preservedLegacyRootKeys: options.preservedLegacyRootKeys,
          ...(options.lastTouchedVersionOverride
            ? { lastTouchedVersionOverride: options.lastTouchedVersionOverride }
            : {}),
        },
      });
      cfgForServiceInstall = nextCfg;
      note(
        expectedGatewayToken
          ? "Persisted gateway.auth.token from environment before reinstalling service."
          : "Persisted gateway.auth.token from existing service definition before reinstalling service.",
        "Gateway",
      );
    } catch (err) {
      runtime.error(`Failed to persist gateway.auth.token before service repair: ${String(err)}`);
      return cfg;
    }
  }
  const updatedPort = resolveGatewayPort(cfgForServiceInstall, process.env);
  const updatedPlan = await buildExpectedGatewayServicePlan({
    cfg: cfgForServiceInstall,
    command,
    serviceInstallEnv,
    port: updatedPort,
    runtime: needsNodeRuntime && systemNodePath ? "node" : runtimeChoice,
    nodePath: systemNodePath ?? void 0,
  });
  const repairService =
    updateRepairMode && !updateRepairShouldInstall ? service.stage : service.install;
  try {
    await repairService({
      env: serviceRepairEnv,
      stdout: process.stdout,
      warn: (message) => note(message, "Gateway"),
      programArguments: updatedPlan.programArguments,
      workingDirectory: updatedPlan.workingDirectory,
      environment: updatedPlan.environment,
      environmentValueSources: updatedPlan.environmentValueSources,
      startupFallbackTakeoverRuntime,
    });
    if (
      updateRepairShouldInstall &&
      !isTruthyEnvValue(process.env["OPENCLAW_UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART"])
    ) {
      const restartEnv = {
        ...serviceRepairEnv,
        ...updatedPlan.environment,
      };
      if (installedWindowsTaskName)
        restartEnv.OPENCLAW_WINDOWS_TASK_NAME = installedWindowsTaskName;
      await service.restart({
        env: restartEnv,
        stdout: process.stdout,
      });
      note("Restarted the repaired gateway for a legacy update parent.", "Gateway");
    }
  } catch (err) {
    runtime.error(`Gateway service update failed: ${String(err)}`);
  }
  return cfgForServiceInstall;
}
/**
 * Reports duplicate gateway-like services and removes legacy user services after confirmation.
 */
async function maybeScanExtraGatewayServices(options, runtime, prompter) {
  const extraServices = await detectExtraGatewayServiceIssues(options);
  if (extraServices.length === 0) return;
  note(
    extraServices.map((svc) => `- ${svc.label} (${svc.scope}, ${svc.detail})`).join("\n"),
    "Other gateway-like services detected",
  );
  const legacyServices = extraServices.filter((svc) => svc.legacy === true);
  if (legacyServices.length > 0) {
    const serviceRepairPolicy = resolveServiceRepairPolicy();
    const serviceRepairExternal = isServiceRepairExternallyManaged(serviceRepairPolicy);
    if (serviceRepairExternal) note(EXTERNAL_SERVICE_REPAIR_NOTE, "Legacy gateway cleanup skipped");
    if (
      serviceRepairExternal
        ? false
        : await confirmDoctorServiceRepair(
            prompter,
            {
              message: "Remove legacy gateway services now?",
              initialValue: true,
            },
            serviceRepairPolicy,
          )
    ) {
      const removed = [];
      const { darwinUserServices, linuxUserServices, failed } =
        classifyLegacyServices(legacyServices);
      if (darwinUserServices.length > 0) {
        const result = await cleanupLegacyDarwinServices(darwinUserServices);
        removed.push(...result.removed);
        failed.push(...result.failed);
      }
      if (linuxUserServices.length > 0) {
        const result = await cleanupLegacyLinuxUserServices(linuxUserServices, runtime);
        removed.push(...result.removed);
        failed.push(...result.failed);
      }
      if (removed.length > 0)
        note(removed.map((line) => `- ${line}`).join("\n"), "Legacy gateway removed");
      if (failed.length > 0)
        note(failed.map((line) => `- ${line}`).join("\n"), "Legacy gateway cleanup skipped");
      if (removed.length > 0)
        runtime.log("Legacy gateway services removed. Installing OpenClaw gateway next.");
    }
  }
  const cleanupHints = renderGatewayServiceCleanupHints();
  if (cleanupHints.length > 0)
    note(cleanupHints.map((hint) => `- ${hint}`).join("\n"), "Cleanup hints");
  note(
    [
      "Recommendation: run a single gateway per machine for most setups.",
      "One gateway supports multiple agents.",
      "If you need multiple gateways (e.g., a rescue bot on the same host), isolate ports + config/state (see docs: /gateway#multiple-gateways-same-host).",
    ].join("\n"),
    "Gateway recommendation",
  );
}
//#endregion
export {
  detectExtraGatewayServiceIssues,
  extraGatewayServiceToHealthFinding,
  extraGatewayServiceToRepairEffects,
  maybeRepairGatewayServiceConfig,
  maybeScanExtraGatewayServices,
};
