import fs from "node:fs/promises";
import path from "node:path";
import JSON5 from "json5";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as resolveAdvertisedControlUiLinks } from "./control-ui-links-BImlWgwk.js";
import { a as trimToUndefined } from "./credential-planner-BTC1pLMc.js";
import { t as gatewaySecretInputPathCanWin } from "./credentials-secret-inputs-CzaPJ-pp.js";
import { n as readLastGatewayErrorLine } from "./diagnostics-fiGytHJL.js";
import { t as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-D7CXgzhH.js";
import { r as createConfigIO } from "./io-B3ne6NxF.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import "./credentials-DqHTozxM.js";
import {
  g as formatLocalDate,
  h as canUseNodeFs,
  m as LOG_SUFFIX,
  p as LOG_PREFIX,
} from "./logger-BUux_Jpv.js";
import "./config-BDv-QbJ6.js";
import {
  r as resolveBestEffortGatewayBindHostForDisplay,
  t as inspectBestEffortPrimaryTailnetIPv4,
} from "./network-discovery-display-hQA33VdG.js";
import "./ports-miNUZKci.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import {
  c as resolveConfigPath,
  f as resolveGatewayPort,
  y as resolveStateDir,
} from "./paths-DEklnbzU.js";
import { t as detectPluginVersionDrift } from "./plugin-version-drift-Bbktn82g.js";
import {
  i as formatPortDiagnostics,
  n as inspectPortUsage,
  t as inspectPortConnections,
} from "./ports-inspect-DyOb8qZr.js";
import { a as resolveGatewayProbeCredentialConfig } from "./probe-auth-BDCrvP-B.js";
import { n as readGatewayRestartHandoffSync } from "./restart-handoff-C_HtGsPl.js";
import {
  a as readGatewaySecretInputValue,
  t as ALL_GATEWAY_SECRET_INPUT_PATHS,
} from "./secret-input-paths-BqHb6OmN.js";
import { a as resolveGatewayService } from "./service-Dw37Ek79.js";
import {
  c as pickProbeHostForBind,
  o as normalizeListenerAddress,
  s as parsePortFromArgs,
} from "./shared-BM2cZyxM.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import {
  n as resolvePreferredOpenClawTmpDir,
  t as POSIX_OPENCLAW_TMP_DIR,
} from "./tmp-openclaw-dir-uPgNO8da.js";
import { g as resolveSecretInputRef } from "./types.secrets-BV0ywRAy.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { n as inspectWindowsGatewayFirewall } from "./windows-gateway-firewall-diagnostics-Cwjm2Cse.js";
//#region src/logging/log-file-path.ts
function resolveDefaultRollingLogFile(date = /* @__PURE__ */ new Date()) {
  const logDir = canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : POSIX_OPENCLAW_TMP_DIR;
  return path.join(logDir, `${LOG_PREFIX}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
/** Resolves the configured log file or today's rolling default log path. */
function resolveConfiguredLogFilePath(config) {
  return config?.logging?.file ?? resolveDefaultRollingLogFile();
}
//#endregion
//#region src/cli/daemon-cli/status.gather.ts
const gatewayProbeAuthModuleLoader = createLazyImportLoader(
  () => import("./probe-auth-C1CYfVrf.js"),
);
const daemonInspectModuleLoader = createLazyImportLoader(() => import("./inspect-_3VdLuxO.js"));
const launchdModuleLoader = createLazyImportLoader(() => import("./launchd-c-Tp5XlW.js"));
const serviceAuditModuleLoader = createLazyImportLoader(
  () => import("./service-audit-8fQXv9iM.js"),
);
const gatewayTlsModuleLoader = createLazyImportLoader(() => import("./gateway-BlHdUVDk.js"));
const daemonProbeModuleLoader = createLazyImportLoader(() => import("./probe-CjCX9aLe.js"));
const restartHealthModuleLoader = createLazyImportLoader(
  () => import("./restart-health-C2G6Ltoj.js"),
);
function loadGatewayProbeAuthModule() {
  return gatewayProbeAuthModuleLoader.load();
}
function loadDaemonInspectModule() {
  return daemonInspectModuleLoader.load();
}
function loadLaunchdModule() {
  return launchdModuleLoader.load();
}
function loadServiceAuditModule() {
  return serviceAuditModuleLoader.load();
}
function loadGatewayTlsModule() {
  return gatewayTlsModuleLoader.load();
}
function loadDaemonProbeModule() {
  return daemonProbeModuleLoader.load();
}
function loadRestartHealthModule() {
  return restartHealthModuleLoader.load();
}
function resolveSnapshotRuntimeConfig(snapshot) {
  if (!snapshot?.valid || !snapshot.runtimeConfig) return null;
  return snapshot.runtimeConfig;
}
function coerceStatusConfig(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
}
function hasOwnKey(value, key) {
  return Boolean(
    value && typeof value === "object" && !Array.isArray(value) && Object.hasOwn(value, key),
  );
}
function needsFullStatusConfigRead(raw, parsed) {
  return raw.includes("$include") || raw.includes("${") || hasOwnKey(parsed, "env");
}
async function readFastStatusConfig(configPath) {
  let raw;
  try {
    raw = await fs.readFile(configPath, "utf8");
  } catch {
    return null;
  }
  let parsed;
  try {
    parsed = JSON5.parse(raw);
  } catch (err) {
    return {
      summary: {
        path: configPath,
        exists: true,
        valid: false,
        issues: [
          {
            path: "",
            message: `JSON5 parse failed: ${String(err)}`,
          },
        ],
      },
      cfg: {},
      mode: "fast",
    };
  }
  if (needsFullStatusConfigRead(raw, parsed)) return null;
  const cfg = coerceStatusConfig(parsed);
  return {
    summary: {
      path: configPath,
      exists: true,
      valid: true,
      controlUi: cfg.gateway?.controlUi,
    },
    cfg,
    mode: "fast",
  };
}
async function readFullStatusConfig(params) {
  const io = createConfigIO({
    env: params.env,
    configPath: params.configPath,
    pluginValidation: params.pluginValidation ?? "skip",
    logger: {
      error: () => {},
      warn: () => {},
    },
  });
  const snapshot = await io.readConfigFileSnapshot().catch(() => null);
  const cfg = resolveSnapshotRuntimeConfig(snapshot) ?? io.loadConfig();
  return {
    summary: {
      path: snapshot?.path ?? params.configPath,
      exists: snapshot?.exists ?? false,
      valid: snapshot?.valid ?? true,
      ...(snapshot?.issues?.length ? { issues: snapshot.issues } : {}),
      ...(snapshot?.warnings?.length ? { warnings: snapshot.warnings } : {}),
      controlUi: cfg.gateway?.controlUi,
    },
    cfg,
    mode: "full",
  };
}
async function readStatusConfig(params) {
  return (
    (params.deep ? null : await readFastStatusConfig(params.configPath)) ??
    (await readFullStatusConfig({
      env: params.env,
      configPath: params.configPath,
      pluginValidation: params.deep ? "full" : "skip",
    }))
  );
}
function appendProbeNote(existing, extra) {
  const values = [existing, extra].filter((value) => Boolean(value?.trim()));
  if (values.length === 0) return;
  return uniqueStrings(values).join(" ");
}
function shouldReportPortUsage(status, rpcOk) {
  if (status !== "busy") return false;
  if (rpcOk === true) return false;
  return true;
}
function resolveCliStatusSummary(argv = process.argv) {
  const entrypoint = argv[1]?.trim();
  return {
    version: VERSION,
    ...(entrypoint ? { entrypoint } : {}),
  };
}
async function loadDaemonConfigContext(serviceEnv, opts = {}) {
  const mergedDaemonEnv = {
    ...process.env,
    ...(serviceEnv ?? void 0),
  };
  const cliConfigPath = resolveConfigPath(process.env, resolveStateDir(process.env));
  const daemonConfigPath = resolveConfigPath(mergedDaemonEnv, resolveStateDir(mergedDaemonEnv));
  const sameConfigPath = cliConfigPath === daemonConfigPath;
  const cliConfigRead = await readStatusConfig({
    env: process.env,
    configPath: cliConfigPath,
    deep: opts.deep,
  });
  const daemonConfigRead =
    sameConfigPath && (cliConfigRead.mode === "fast" || !serviceEnv)
      ? cliConfigRead
      : await readStatusConfig({
          env: mergedDaemonEnv,
          configPath: daemonConfigPath,
          deep: opts.deep,
        });
  return {
    mergedDaemonEnv,
    cliCfg: cliConfigRead.cfg,
    daemonCfg: daemonConfigRead.cfg,
    cliConfigSummary: cliConfigRead.summary,
    daemonConfigSummary: daemonConfigRead.summary,
    configMismatch: cliConfigRead.summary.path !== daemonConfigRead.summary.path,
  };
}
async function resolveGatewayStatusSummary(params) {
  const portFromArgs = parsePortFromArgs(params.commandProgramArguments);
  const daemonPort = portFromArgs ?? resolveGatewayPort(params.daemonCfg, params.mergedDaemonEnv);
  const portSource = portFromArgs ? "service args" : "env/config";
  const bindMode = params.daemonCfg.gateway?.bind ?? "loopback";
  const customBindHost = params.daemonCfg.gateway?.customBindHost;
  const { bindHost, warning: bindHostWarning } = await resolveBestEffortGatewayBindHostForDisplay({
    bindMode,
    customBindHost,
    warningPrefix: "Status is using fallback network details because interface discovery failed",
  });
  const { tailnetIPv4, warning: tailnetWarning } = inspectBestEffortPrimaryTailnetIPv4({
    warningPrefix: "Status could not inspect tailnet addresses",
  });
  const probeHost = pickProbeHostForBind(bindMode, tailnetIPv4, customBindHost);
  const probeUrlOverride = trimToUndefined(params.rpcUrlOverride) ?? null;
  const tlsEnabled = params.daemonCfg.gateway?.tls?.enabled === true;
  const probeUrl = probeUrlOverride ?? `${tlsEnabled ? "wss" : "ws"}://${probeHost}:${daemonPort}`;
  const controlUiLinks =
    params.daemonCfg.gateway?.controlUi?.enabled === false
      ? void 0
      : await resolveAdvertisedControlUiLinks({
          port: daemonPort,
          bind: bindMode,
          customBindHost,
          basePath: params.daemonCfg.gateway?.controlUi?.basePath,
          tlsEnabled,
        });
  let probeNote =
    !probeUrlOverride && bindMode === "lan"
      ? `bind=lan listens on 0.0.0.0 (all interfaces); probing via ${probeHost}.`
      : !probeUrlOverride && bindMode === "loopback"
        ? "Loopback-only gateway; only local clients can connect."
        : void 0;
  probeNote = appendProbeNote(probeNote, bindHostWarning);
  probeNote = appendProbeNote(probeNote, tailnetWarning);
  return {
    gateway: {
      bindMode,
      bindHost,
      customBindHost,
      ...(tlsEnabled ? { tlsEnabled } : {}),
      port: daemonPort,
      portSource,
      probeUrl,
      ...(controlUiLinks ? { controlUiLinks } : {}),
      ...(probeNote ? { probeNote } : {}),
    },
    daemonPort,
    cliPort: resolveGatewayPort(params.cliCfg, process.env),
    probeUrlOverride,
  };
}
function toPortStatusSummary(diagnostics) {
  if (!diagnostics) return;
  return {
    port: diagnostics.port,
    status: diagnostics.status,
    listeners: diagnostics.listeners,
    hints: diagnostics.hints,
  };
}
async function inspectDaemonPortStatuses(params) {
  const [portDiagnostics, portCliDiagnostics] = await Promise.all([
    inspectPortUsage(params.daemonPort).catch(() => null),
    params.cliPort !== params.daemonPort
      ? inspectPortUsage(params.cliPort).catch(() => null)
      : null,
  ]);
  return {
    portStatus: toPortStatusSummary(portDiagnostics),
    portCliStatus: toPortStatusSummary(portCliDiagnostics),
  };
}
async function inspectEstablishedGatewayClients(params) {
  if (params.deep !== true || params.gatewayMode === "remote") return;
  const result = await inspectPortConnections(params.daemonPort).catch(() => null);
  const establishedClients = result?.connections.filter(
    (connection) => connection.direction !== "server",
  );
  if (!result || !establishedClients || establishedClients.length === 0) return;
  return {
    port: result.port,
    established: establishedClients,
  };
}
function hasActiveGatewayExecProbeCredential(params) {
  const cfg = resolveGatewayProbeCredentialConfig({
    cfg: params.cfg,
    mode: params.mode,
  });
  return ALL_GATEWAY_SECRET_INPUT_PATHS.some((path) => {
    if (
      !gatewaySecretInputPathCanWin({
        config: cfg,
        env: params.env,
        explicitAuth: params.explicitAuth,
        modeOverride: params.mode,
        path,
        remoteTokenFallback: "remote-only",
      })
    )
      return false;
    return (
      resolveSecretInputRef({
        value: readGatewaySecretInputValue(cfg, path),
        defaults: cfg.secrets?.defaults,
      }).ref?.source === "exec"
    );
  });
}
async function gatherDaemonStatus(opts) {
  const service = resolveGatewayService();
  const command = await service.readCommand(process.env).catch(() => null);
  const serviceEnv = command?.environment
    ? {
        ...process.env,
        ...command.environment,
      }
    : process.env;
  const [loaded, runtime] = await Promise.all([
    service.isLoaded({ env: serviceEnv }).catch(() => false),
    service.readRuntime(serviceEnv).catch((err) => ({
      status: "unknown",
      detail: String(err),
    })),
  ]);
  const restartHandoff = opts.deep ? readGatewayRestartHandoffSync(serviceEnv) : null;
  const configAudit = command
    ? await loadServiceAuditModule().then(({ auditGatewayServiceConfig }) =>
        auditGatewayServiceConfig({
          env: process.env,
          command,
        }),
      )
    : {
        ok: true,
        issues: [],
      };
  const {
    mergedDaemonEnv,
    cliCfg,
    daemonCfg,
    cliConfigSummary,
    daemonConfigSummary,
    configMismatch,
  } = await loadDaemonConfigContext(command?.environment, { deep: opts.deep });
  const { gateway, daemonPort, cliPort, probeUrlOverride } = await resolveGatewayStatusSummary({
    cliCfg,
    daemonCfg,
    mergedDaemonEnv,
    commandProgramArguments: command?.programArguments,
    rpcUrlOverride: opts.rpc.url,
  });
  const shouldInspectLocalGateway = daemonCfg.gateway?.mode !== "remote" && !probeUrlOverride;
  const windowsFirewall =
    opts.deep === true && shouldInspectLocalGateway
      ? await inspectWindowsGatewayFirewall({
          bind: gateway.bindMode,
          mode: "quick",
          port: daemonPort,
          platform: process.platform,
        })
      : void 0;
  const { portStatus, portCliStatus } = await inspectDaemonPortStatuses({
    daemonPort,
    cliPort,
  });
  const establishedClients = await inspectEstablishedGatewayClients({
    daemonPort,
    deep: opts.deep,
    gatewayMode: daemonCfg.gateway?.mode,
  });
  const extraServices = opts.deep
    ? await loadDaemonInspectModule()
        .then(({ findExtraGatewayServices }) =>
          findExtraGatewayServices(process.env, { deep: true }),
        )
        .catch(() => [])
    : [];
  const staleUpdateLaunchdJobs =
    opts.deep && process.platform === "darwin"
      ? await loadLaunchdModule()
          .then(({ findStaleOpenClawUpdateLaunchdJobs }) =>
            findStaleOpenClawUpdateLaunchdJobs(serviceEnv),
          )
          .catch(() => [])
      : [];
  const timeoutMs =
    parseStrictPositiveInteger(opts.rpc.timeout ?? void 0) ??
    Math.max(1e4, daemonCfg.gateway?.handshakeTimeoutMs ?? 0);
  const tlsEnabled = daemonCfg.gateway?.tls?.enabled === true;
  const shouldUseLocalTlsRuntime = opts.probe && !probeUrlOverride && tlsEnabled;
  const tlsRuntime = shouldUseLocalTlsRuntime
    ? await loadGatewayTlsModule().then(({ loadGatewayTlsRuntime }) =>
        loadGatewayTlsRuntime(daemonCfg.gateway?.tls),
      )
    : void 0;
  let daemonProbeAuth;
  let rpcAuthWarning;
  let allowRpcConfigCredentials = true;
  let skippedProbeAuthForDisabledExecSecretRef = false;
  if (opts.probe) {
    const probeMode = daemonCfg.gateway?.mode === "remote" ? "remote" : "local";
    const explicitAuth = {
      token: opts.rpc.token,
      password: opts.rpc.password,
    };
    if (
      opts.allowExecSecretRefs !== false ||
      !hasActiveGatewayExecProbeCredential({
        cfg: daemonCfg,
        env: mergedDaemonEnv,
        explicitAuth,
        mode: probeMode,
      })
    ) {
      const probeAuthResolution = await loadGatewayProbeAuthModule().then(
        ({ resolveGatewayProbeAuthSafeWithSecretInputs }) =>
          resolveGatewayProbeAuthSafeWithSecretInputs({
            cfg: daemonCfg,
            mode: probeMode,
            env: mergedDaemonEnv,
            explicitAuth,
          }),
      );
      daemonProbeAuth = probeAuthResolution.auth;
      rpcAuthWarning = probeAuthResolution.warning;
    } else {
      allowRpcConfigCredentials = false;
      skippedProbeAuthForDisabledExecSecretRef = true;
      rpcAuthWarning =
        "Gateway probe auth skipped because gateway credentials use an exec SecretRef and exec SecretRefs are disabled for this status request.";
    }
  }
  const rpc = opts.probe
    ? await loadDaemonProbeModule().then(({ probeGatewayStatus }) =>
        probeGatewayStatus({
          url: gateway.probeUrl,
          token: daemonProbeAuth?.token,
          password: daemonProbeAuth?.password,
          config: daemonCfg,
          tlsFingerprint:
            shouldUseLocalTlsRuntime && tlsRuntime?.enabled ? tlsRuntime.fingerprintSha256 : void 0,
          preauthHandshakeTimeoutMs: daemonCfg.gateway?.handshakeTimeoutMs,
          timeoutMs,
          json: opts.rpc.json,
          requireRpc: opts.requireRpc,
          allowRpcConfigCredentials,
          configPath: daemonConfigSummary.path,
        }),
      )
    : void 0;
  if (rpc?.ok && !skippedProbeAuthForDisabledExecSecretRef) rpcAuthWarning = void 0;
  const health =
    opts.probe && loaded && rpc?.ok !== true
      ? await loadRestartHealthModule()
          .then(({ inspectGatewayRestart }) =>
            inspectGatewayRestart({
              service,
              port: daemonPort,
              env: serviceEnv,
            }),
          )
          .catch(() => void 0)
      : void 0;
  const gatewayVersion = opts.probe
    ? ((rpc && "server" in rpc ? rpc.server?.version : void 0) ??
      (rpc && "version" in rpc ? rpc.version : void 0) ??
      null)
    : void 0;
  let lastError;
  if (
    shouldInspectLocalGateway &&
    loaded &&
    runtime?.status === "running" &&
    portStatus &&
    (portStatus.status !== "busy" || rpc?.ok === false)
  )
    lastError =
      (await readLastGatewayErrorLine(mergedDaemonEnv, {
        requirePatternMatch: portStatus.status === "busy",
      })) ?? void 0;
  let pluginVersionDrift;
  if (shouldInspectLocalGateway)
    try {
      const installRecords = await loadInstalledPluginIndexInstallRecords({ env: mergedDaemonEnv });
      pluginVersionDrift = detectPluginVersionDrift({
        gatewayVersion: gatewayVersion ?? VERSION,
        installRecords,
        config: daemonCfg,
      });
    } catch {
      pluginVersionDrift = void 0;
    }
  return {
    cli: resolveCliStatusSummary(),
    logFile: resolveConfiguredLogFilePath(cliCfg),
    service: {
      label: service.label,
      loaded,
      loadedText: service.loadedText,
      notLoadedText: service.notLoadedText,
      command,
      runtime,
      configAudit,
      ...(restartHandoff ? { restartHandoff } : {}),
      ...(staleUpdateLaunchdJobs.length > 0 ? { staleUpdateLaunchdJobs } : {}),
    },
    config: {
      cli: cliConfigSummary,
      daemon: daemonConfigSummary,
      ...(configMismatch ? { mismatch: true } : {}),
    },
    gateway: {
      ...gateway,
      ...(windowsFirewall?.applies ? { windowsFirewall } : {}),
      ...(opts.probe ? { version: gatewayVersion } : {}),
    },
    port: portStatus,
    ...(portCliStatus ? { portCli: portCliStatus } : {}),
    ...(establishedClients ? { connections: establishedClients } : {}),
    lastError,
    ...(rpc
      ? {
          rpc: {
            ...rpc,
            url: gateway.probeUrl,
            ...(rpcAuthWarning ? { authWarning: rpcAuthWarning } : {}),
          },
        }
      : {}),
    ...(health
      ? {
          health: {
            healthy: health.healthy,
            staleGatewayPids: health.staleGatewayPids,
          },
        }
      : {}),
    extraServices,
    ...(pluginVersionDrift ? { pluginVersionDrift } : {}),
  };
}
function renderPortDiagnosticsForCli(status, rpcOk) {
  if (!status.port || !shouldReportPortUsage(status.port.status, rpcOk)) return [];
  return formatPortDiagnostics({
    port: status.port.port,
    status: status.port.status,
    listeners: status.port.listeners,
    hints: status.port.hints,
  });
}
function resolvePortListeningAddresses(status) {
  return Array.from(
    new Set(
      status.port?.listeners
        ?.map((l) => (l.address ? normalizeListenerAddress(l.address) : ""))
        .filter((v) => Boolean(v)) ?? [],
    ),
  );
}
//#endregion
export {
  renderPortDiagnosticsForCli as n,
  resolvePortListeningAddresses as r,
  gatherDaemonStatus as t,
};
