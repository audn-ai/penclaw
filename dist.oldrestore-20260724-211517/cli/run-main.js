import { existsSync } from "node:fs";
import path from "node:path";
import process$1 from "node:process";
import { t as resolveCliArgvInvocation } from "../argv-invocation-BjvIqM-C.js";
import {
  A as consumeRootOptionToken,
  C as getCoreCliCommandNames,
  T as getCoreCliParentDefaultHelpCommands,
  b as getSubCliParentDefaultHelpCommands,
  g as normalizeRootNoColorArgv,
  h as normalizeRootLogLevelArgv,
  j as isValueToken,
  m as normalizeRootHelpTargetArgv,
  p as normalizeGeneratedHelpCommandArgv,
  y as getSubCliEntries,
} from "../argv-zTv4_Dzq.js";
import {
  a as consumeGatewayFastPathRootOptionToken,
  c as resolveGatewayRunPreBootstrapOptions,
  n as resolveCliNetworkProxyPolicy,
  o as consumeGatewayRunOptionToken,
  s as resolveGatewayCatalogCommandPath,
  t as resolveCliCommandPathPolicy,
} from "../command-path-policy-CHhtag3S.js";
import {
  a as shouldSkipPluginCommandRegistration,
  r as shouldRegisterPrimaryCommandOnly,
  t as isReservedNonPluginCommandRoot,
} from "../command-registration-policy-BG3v7CNP.js";
import { t as formatCliCommandSuggestions } from "../command-suggestions-D8Quqf_8.js";
import { a as normalizeEnv, n as isTruthyEnvValue } from "../env-Di-LcxqW.js";
import { u as tryProcessCwd } from "../home-dir-DxrrpDft.js";
import {
  n as withConsoleLogsRoutedToStderrForJson,
  t as hasJsonOutputFlag,
} from "../json-output-mode-DgaytQ3L.js";
import {
  n as resolveManifestCommandAliasOwnerInRegistry,
  r as resolveManifestToolOwnerInRegistry,
} from "../manifest-command-aliases-DrFybOtt.js";
import { r as isLoopbackAddress, s as isSecureWebSocketUrl } from "../net-BpMGIYrw.js";
import { t as flushExitAfterOneShotOutput } from "../one-shot-exit-DdMGi0bf.js";
import { t as ensureOpenClawCliOnPath } from "../path-env-Ch4tyXXb.js";
import { y as resolveStateDir } from "../paths-DEklnbzU.js";
import { t as assertSupportedRuntime } from "../runtime-guard-BFPw9ugu.js";
import {
  r as waitForSignalExitBarriers,
  t as registerSignalExitBarrier,
} from "../signal-exit-barrier-C0rFK2ZS.js";
import {
  a as maybeRunCliInContainer,
  i as tryOutputPrecomputedCommandHelp,
  n as applyCliProfileEnv,
  o as parseCliContainerArgs,
  r as parseCliProfileArgs,
  t as createGatewayStartupTrace,
} from "../startup-trace-Bqh9afDl.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "../string-coerce-DW4mBlAt.js";
import { t as normalizeWindowsArgv } from "../windows-argv-8XbjFcoh.js";
//#region src/cli/fresh-install-config.ts
const UNCONFIGURED_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set(["$schema", "meta"]);
function isIncompleteWizardConfig(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).every((key) => key === "securityAcknowledgedAt")
  );
}
function isUnconfiguredConfigSource(sourceConfig) {
  return Object.entries(sourceConfig).every(
    ([key, value]) =>
      UNCONFIGURED_CONFIG_IGNORED_KEYS.has(key) ||
      (key === "wizard" && isIncompleteWizardConfig(value)),
  );
}
//#endregion
//#region src/cli/run-main-policy.ts
const ROOT_HELP_ALIASES = /* @__PURE__ */ new Set(["tools"]);
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
  "setup",
  "onboard",
  "configure",
]);
const BARE_PARENT_DEFAULT_HELP_COMMANDS = /* @__PURE__ */ new Set([
  ...getCoreCliParentDefaultHelpCommands(),
  ...getSubCliParentDefaultHelpCommands(),
]);
function isBareParentDefaultHelpArgv(argv) {
  const invocation = resolveCliArgvInvocation(argv);
  const [primary, extra] = invocation.commandPath;
  return !invocation.hasHelpOrVersion && primary !== void 0 && extra === void 0
    ? BARE_PARENT_DEFAULT_HELP_COMMANDS.has(primary)
    : false;
}
function rewriteUpdateFlagArgv(argv) {
  const updateIndex = argv.indexOf("--update");
  if (updateIndex === -1) return argv;
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg || arg === "--") return argv;
    if (i === updateIndex) {
      const next = [...argv];
      next.splice(updateIndex, 1, "update");
      return next;
    }
    const consumed = consumeRootOptionToken(argv, i);
    if (consumed > 0) {
      i += consumed - 1;
      continue;
    }
    if (!arg.startsWith("-")) return argv;
  }
  return argv;
}
function shouldEnsureCliPath(argv) {
  const invocation = resolveCliArgvInvocation(argv);
  if (
    invocation.hasHelpOrVersion ||
    shouldHandleBareRoot(argv) ||
    isBareParentDefaultHelpArgv(argv)
  )
    return false;
  return resolveCliCommandPathPolicy(invocation.commandPath).ensureCliPath;
}
function shouldUseRootHelpFastPath(argv, env = process.env) {
  const invocation = resolveCliArgvInvocation(argv);
  return (
    env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH !== "1" &&
    (invocation.isRootHelpInvocation ||
      (invocation.commandPath.length === 1 &&
        ROOT_HELP_ALIASES.has(invocation.commandPath[0] ?? "") &&
        invocation.hasHelpOrVersion) ||
      (invocation.commandPath.length === 1 &&
        invocation.commandPath[0] === "help" &&
        invocation.hasHelpOrVersion))
  );
}
function shouldUseSetupOnboardConfigureHelpFastPath(argv, env = process.env) {
  if (env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
  const invocation = resolveCliArgvInvocation(argv);
  return (
    invocation.commandPath.length === 1 &&
    SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS.has(invocation.commandPath[0] ?? "") &&
    invocation.hasHelpOrVersion
  );
}
function shouldHandleBareRoot(argv) {
  const invocation = resolveCliArgvInvocation(argv);
  return invocation.commandPath.length === 0 && !invocation.hasHelpOrVersion;
}
function shouldStartProxyForCli(argv) {
  const policyArgv = rewriteUpdateFlagArgv(argv);
  const invocation = resolveCliArgvInvocation(policyArgv);
  const [primary] = invocation.commandPath;
  if (invocation.hasHelpOrVersion || !primary) return false;
  if (isBareParentDefaultHelpArgv(policyArgv)) return false;
  return resolveCliNetworkProxyPolicy(policyArgv) === "default";
}
function resolveMissingPluginCommandMessage$1(pluginId, config, options) {
  const normalizedPluginId = normalizeLowercaseStringOrEmpty(pluginId);
  if (!normalizedPluginId) return null;
  const allow =
    Array.isArray(config?.plugins?.allow) && config.plugins.allow.length > 0
      ? config.plugins.allow
          .filter((entry) => typeof entry === "string")
          .map((entry) => normalizeOptionalLowercaseString(entry))
          .filter(Boolean)
      : [];
  const commandAlias = options?.registry
    ? resolveManifestCommandAliasOwnerInRegistry({
        command: normalizedPluginId,
        registry: options.registry,
      })
    : options?.resolveCommandAliasOwner?.({
        command: normalizedPluginId,
        config,
        ...(options?.registry ? { registry: options.registry } : {}),
      });
  const parentPluginId = commandAlias?.pluginId;
  if (parentPluginId) {
    if (allow.length > 0 && !allow.includes(parentPluginId)) {
      if (parentPluginId === normalizedPluginId)
        return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.allow\` excludes "${normalizedPluginId}". Add "${normalizedPluginId}" to \`plugins.allow\` if you want that bundled plugin CLI surface.`;
      return `"${normalizedPluginId}" is not a plugin; it is a command provided by the "${parentPluginId}" plugin. Add "${parentPluginId}" to \`plugins.allow\` instead of "${normalizedPluginId}".`;
    }
    if (config?.plugins?.entries?.[parentPluginId]?.enabled === false)
      return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${parentPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin command surface.`;
    if (
      commandAlias.kind !== "runtime-slash" &&
      commandAlias.enabledByDefault !== true &&
      config?.plugins?.entries?.[parentPluginId]?.enabled !== true
    )
      return `The \`openclaw ${normalizedPluginId}\` command is provided by the "${parentPluginId}" plugin, but that bundled plugin is disabled by default. Run \`openclaw plugins enable ${parentPluginId}\` to enable that CLI surface.`;
    if (commandAlias.kind === "runtime-slash")
      return `"${normalizedPluginId}" is a runtime slash command (/${normalizedPluginId}), not a CLI command. It is provided by the "${parentPluginId}" plugin. ${commandAlias.cliCommand ? `Use \`openclaw ${commandAlias.cliCommand}\` for related CLI operations, or ` : "Use "}\`/${normalizedPluginId}\` in a chat session.`;
  }
  if (isReservedNonPluginCommandRoot(normalizedPluginId)) return null;
  const toolOwner = options?.registry
    ? resolveManifestToolOwnerInRegistry({
        toolName: normalizedPluginId,
        registry: options.registry,
      })
    : options?.resolveToolOwner?.({
        toolName: normalizedPluginId,
        config,
        ...(options?.registry ? { registry: options.registry } : {}),
      });
  if (toolOwner) {
    if (
      config?.plugins?.entries?.[toolOwner.pluginId]?.enabled !== false &&
      (allow.length === 0 || allow.includes(toolOwner.pluginId))
    ) {
      if (toolOwner.availability === "manifest-only")
        return `"${normalizedPluginId}" may be provided by the "${toolOwner.pluginId}" plugin as an agent tool, not a CLI subcommand. Run \`openclaw --help\` to see available CLI subcommands.`;
      return `"${normalizedPluginId}" is an agent tool available from the "${toolOwner.pluginId}" plugin, not a CLI subcommand. Use it from an agent turn (model tool-use), not the CLI. Run \`openclaw --help\` to see available CLI subcommands.`;
    }
  }
  if (allow.length > 0 && !allow.includes(normalizedPluginId)) {
    if (parentPluginId && allow.includes(parentPluginId)) return null;
    const normalizedCliCommandSurfaceOwner = normalizeOptionalLowercaseString(
      options?.resolveCliCommandSurfaceOwner
        ? options.resolveCliCommandSurfaceOwner({
            command: normalizedPluginId,
            config,
            ...(options?.registry ? { registry: options.registry } : {}),
          })
        : options?.registry
          ? resolveManifestCommandAliasOwnerInRegistry({
              command: normalizedPluginId,
              registry: options.registry,
            })?.pluginId
          : void 0,
    );
    if (!normalizedCliCommandSurfaceOwner) return null;
    if (allow.includes(normalizedCliCommandSurfaceOwner)) return null;
    if (normalizedCliCommandSurfaceOwner !== normalizedPluginId)
      return `"${normalizedPluginId}" is not a plugin; it is a command provided by the "${normalizedCliCommandSurfaceOwner}" plugin. Add "${normalizedCliCommandSurfaceOwner}" to \`plugins.allow\` instead of "${normalizedPluginId}".`;
    return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.allow\` excludes "${normalizedPluginId}". Add "${normalizedPluginId}" to \`plugins.allow\` if you want that bundled plugin CLI surface.`;
  }
  if (config?.plugins?.entries?.[normalizedPluginId]?.enabled === false)
    return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${normalizedPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin CLI surface.`;
  return null;
}
//#endregion
//#region src/cli/run-main.ts
const CLI_PROXY_ENV_KEYS = [
  "HTTP_PROXY",
  "HTTPS_PROXY",
  "ALL_PROXY",
  "http_proxy",
  "https_proxy",
  "all_proxy",
];
const loadRootHelpLiveConfigModule = async () =>
  await import("../root-help-live-config-DLFpCf-w.js");
const loadRootHelpMetadataModule = async () => await import("../root-help-metadata-Oxd_25lt.js");
const loadLoggingModule = async () => await import("../logging-WRNLbK-5.js");
const loadCliRegistryLoaderModule = async () => await import("../cli-registry-loader-kaj_fEsb.js");
const loadManifestCommandAliasesRuntimeModule = async () =>
  await import("../manifest-command-aliases.runtime-BshQwalD.js");
const loadProxyLifecycleModule = async () => await import("../proxy-lifecycle-C0RXZ_QW.js");
const loadProgressModule = async () => await import("../progress-_D0rc7TD.js");
function isRemoteAgentDispatchInvocation(argv, primary) {
  return primary === "agent" && !argv.includes("--local");
}
function isGatewayRunFastPathArgv(argv) {
  if (resolveCliArgvInvocation(argv).hasHelpOrVersion) return false;
  const args = argv.slice(2);
  let sawGateway = false;
  let sawRun = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg || arg === "--") return false;
    if (!sawGateway) {
      const consumed = consumeGatewayFastPathRootOptionToken(args, index);
      if (consumed > 0) {
        index += consumed - 1;
        continue;
      }
      if (arg !== "gateway") return false;
      sawGateway = true;
      continue;
    }
    const consumed = consumeGatewayRunOptionToken(args, index);
    if (consumed > 0) {
      index += consumed - 1;
      continue;
    }
    if (!sawRun && arg === "run") {
      sawRun = true;
      continue;
    }
    return false;
  }
  return sawGateway;
}
function isGatewayRunInvocationArgv(argv) {
  const commandPath = resolveGatewayCatalogCommandPath(argv);
  return (
    commandPath?.length === 1 ||
    (commandPath?.length === 2 && commandPath[0] === "gateway" && commandPath[1] === "run")
  );
}
async function tryRunGatewayRunFastPath(argv, startupTrace) {
  if (!isGatewayRunFastPathArgv(argv)) return false;
  const [
    { Command },
    { addGatewayRunCommand },
    { VERSION },
    { emitCliBanner },
    { resolveCliStartupPolicy },
    { enableConsoleCapture },
    { ensureCliExecutionBootstrap },
    { defaultRuntime },
  ] = await startupTrace.measure("gateway-run-imports", () =>
    Promise.all([
      import("commander"),
      import("../run-command-BvQ0sjkQ.js"),
      import("../version-BmsGkjsI.js"),
      import("../banner-BoV1GSPO.js"),
      import("../command-startup-policy-CIoRkpmR.js"),
      loadLoggingModule(),
      import("../command-execution-startup-DaEMuS6P.js"),
      import("../runtime-Dvam4E8I.js"),
    ]),
  );
  const commandPath = resolveGatewayCatalogCommandPath(argv) ?? ["gateway"];
  const startupPolicy = resolveCliStartupPolicy({
    argv,
    commandPath,
    jsonOutputMode: hasJsonOutputFlag(argv),
    routeMode: true,
  });
  if (!startupPolicy.hideBanner) emitCliBanner(VERSION, { argv });
  const program = new Command();
  program.name("openclaw");
  program.enablePositionalOptions();
  program.option("--no-color", "Disable ANSI colors", false);
  program.exitOverride((err) => {
    process$1.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
    throw err;
  });
  const beforeRun = async (opts) => {
    let beforeStateMigrations;
    let skipPristineStartupStateMigrations = false;
    let skipPristineCoreStateMigrations = false;
    if (
      !(await startupTrace.measure("gateway-run-pre-bootstrap", async () => {
        const {
          prepareGatewayRunBootstrap,
          recheckGatewayRunBootstrap,
          wasPreparedGatewayRunCoreStatePristine,
          wasPreparedGatewayRunStatePristine,
        } = await import("../pre-bootstrap-CrIDedhu.js");
        const prepared = await prepareGatewayRunBootstrap({
          opts,
          runtime: defaultRuntime,
        });
        if (prepared) {
          skipPristineStartupStateMigrations = wasPreparedGatewayRunStatePristine();
          skipPristineCoreStateMigrations = wasPreparedGatewayRunCoreStatePristine();
          beforeStateMigrations = (snapshot) =>
            recheckGatewayRunBootstrap({
              opts,
              runtime: defaultRuntime,
              ...(snapshot ? { snapshot } : {}),
            });
        }
        return prepared;
      }))
    )
      return;
    await startupTrace.measure("gateway-run-bootstrap", async () => {
      await ensureCliExecutionBootstrap({
        runtime: defaultRuntime,
        commandPath,
        startupPolicy,
        loadPlugins: false,
        ...(beforeStateMigrations ? { beforeStateMigrations } : {}),
        ...(skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {}),
        ...(skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}),
      });
      const { reloadTrustedGatewayRunEnvironment } = await import("../pre-bootstrap-CrIDedhu.js");
      await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime });
    });
  };
  addGatewayRunCommand(
    addGatewayRunCommand(
      program.command("gateway").description("Run, inspect, and query the WebSocket Gateway"),
      { beforeRun },
    )
      .command("run")
      .description("Run the WebSocket Gateway (foreground)"),
    { beforeRun },
  );
  enableConsoleCapture();
  try {
    await startupTrace.measure("gateway-run-parse", () => program.parseAsync(argv));
  } catch (error) {
    if (!isCommanderParseExit(error)) throw error;
    process$1.exitCode = error.exitCode;
  }
  return true;
}
async function closeCliMemoryManagers() {
  try {
    const { hasMemoryRuntime } = await import("../plugins/memory-state.js");
    if (!hasMemoryRuntime()) return;
    const { closeActiveMemorySearchManagers } = await import("../memory-runtime--aoMwUIJ.js");
    await closeActiveMemorySearchManagers();
  } catch {}
}
async function disposeCliAgentHarnesses() {
  try {
    const { listRegisteredAgentHarnesses, disposeRegisteredAgentHarnesses } =
      await import("../registry-Ci5tfeO3.js");
    if (listRegisteredAgentHarnesses().length === 0) return;
    await disposeRegisteredAgentHarnesses();
  } catch {}
}
function isUnconfiguredConfigSnapshot(snapshot) {
  if (!snapshot.exists) return true;
  if (!snapshot.valid) return false;
  return isUnconfiguredConfigSource(snapshot.sourceConfig);
}
async function shouldStartOnboardingForFreshInstall(argv) {
  if (!shouldHandleBareRoot(argv)) return false;
  const { readConfigFileSnapshot } = await import("../config/config.js");
  return isUnconfiguredConfigSnapshot(await readConfigFileSnapshot());
}
async function resolveBareRootLaunchTarget(argv) {
  if (!shouldHandleBareRoot(argv)) return null;
  const { readConfigFileSnapshot } = await import("../config/config.js");
  const snapshot = await readConfigFileSnapshot();
  if (isUnconfiguredConfigSnapshot(snapshot)) return { kind: "onboarding" };
  if (!snapshot.valid)
    return {
      kind: "onboarding",
      classic: true,
    };
  return resolveConfiguredTuiLaunchTarget(snapshot.config ?? snapshot.sourceConfig, {
    hasConfiguredGateway: snapshot.sourceConfig.gateway !== void 0,
  });
}
async function resolveConfiguredTuiLaunchTarget(config, options) {
  const gatewayResolution = await resolveReachableGateway(config, options);
  if (
    gatewayResolution.kind === "configured" ||
    gatewayResolution.kind === "reachable-unverified" ||
    gatewayResolution.kind === "configured-unreachable"
  ) {
    const gateway = gatewayResolution.gateway;
    const target = {
      kind: "tui",
      local: false,
      gatewayUrl: gateway.url,
    };
    if (gateway.authSource) target.authSource = gateway.authSource;
    if (gateway.tlsFingerprint) target.tlsFingerprint = gateway.tlsFingerprint;
    return target;
  }
  if (gatewayResolution.kind === "missing-configured-model") {
    if (gatewayResolution.gateway.remote)
      return {
        kind: "remote-gateway-inference",
        target: {
          config,
          gatewayUrl: gatewayResolution.gateway.url,
          ...(gatewayResolution.gateway.token ? { token: gatewayResolution.gateway.token } : {}),
          ...(gatewayResolution.gateway.password
            ? { password: gatewayResolution.gateway.password }
            : {}),
          ...(gatewayResolution.gateway.tlsFingerprint
            ? { tlsFingerprint: gatewayResolution.gateway.tlsFingerprint }
            : {}),
        },
      };
    return { kind: "onboarding" };
  }
  const { resolveAgentEffectiveModelPrimary, resolveDefaultAgentId } =
    await import("../agent-scope-DfhU1PO5.js");
  if (!resolveAgentEffectiveModelPrimary(config, resolveDefaultAgentId(config)))
    return { kind: "onboarding" };
  return {
    kind: "tui",
    local: true,
  };
}
function toReachableGateway(target, auth) {
  return {
    url: target.url,
    remote: target.scope === "remote",
    ...(auth.authSource ? { authSource: auth.authSource } : {}),
    ...(auth.token ? { token: auth.token } : {}),
    ...(auth.password ? { password: auth.password } : {}),
    ...(target.tlsFingerprint ? { tlsFingerprint: target.tlsFingerprint } : {}),
  };
}
async function resolveReachableGateway(config, options) {
  const targets = await resolveGatewayProbeTargets(config);
  if (targets.length === 0) return { kind: "unreachable" };
  const auth = await resolveGatewayProbeAuth(
    config,
    targets.some((target) => target.auth === "remote") ? "remote" : "local",
  );
  const { probeGatewayConfiguredModel } = await import("../onboard-helpers-LaeM9LZm.js");
  let missingModelGateway;
  let reachableUnverifiedGateway;
  let configuredGateway;
  for (const target of targets) {
    if (!isSafeGatewayProbeTarget(target)) continue;
    if (options.hasConfiguredGateway && !configuredGateway)
      configuredGateway = toReachableGateway(target, auth);
    const probeOptions = { url: target.url };
    if (auth.token) probeOptions.token = auth.token;
    if (auth.password) probeOptions.password = auth.password;
    if (target.tlsFingerprint) probeOptions.tlsFingerprint = target.tlsFingerprint;
    if (target.preauthHandshakeTimeoutMs)
      probeOptions.preauthHandshakeTimeoutMs = target.preauthHandshakeTimeoutMs;
    const probe = await probeGatewayConfiguredModel(probeOptions);
    if (probe.kind === "configured")
      return {
        kind: "configured",
        gateway: toReachableGateway(target, auth),
      };
    if (probe.kind === "missing-configured-model") {
      missingModelGateway ??= toReachableGateway(target, auth);
      continue;
    }
    if (probe.kind === "reachable-unverified" && !reachableUnverifiedGateway)
      reachableUnverifiedGateway = toReachableGateway(target, auth);
  }
  if (missingModelGateway)
    return {
      kind: "missing-configured-model",
      gateway: missingModelGateway,
    };
  if (reachableUnverifiedGateway)
    return {
      kind: "reachable-unverified",
      gateway: reachableUnverifiedGateway,
    };
  if (configuredGateway)
    return {
      kind: "configured-unreachable",
      gateway: configuredGateway,
    };
  return { kind: "unreachable" };
}
async function resolveGatewayProbeAuth(config, auth) {
  const { resolveGatewayProbeSurfaceAuth } = await import("../auth-surface-resolution-CByohNdy.js");
  const authResolution = await resolveGatewayProbeSurfaceAuth({
    config,
    surface: auth,
  });
  const resolved = {};
  if (authResolution.token) resolved.token = authResolution.token;
  if (authResolution.password) resolved.password = authResolution.password;
  if (authResolution.source === "config") resolved.authSource = "config";
  return resolved;
}
async function resolveGatewayProbeTargets(config) {
  const remoteUrl = normalizeOptionalString(config.gateway?.remote?.url);
  if (normalizeOptionalString(config.gateway?.mode) === "remote" && remoteUrl) {
    const url = await resolveValidatedRemoteGatewayUrl(config);
    const tlsFingerprint = normalizeOptionalString(config.gateway?.remote?.tlsFingerprint);
    const preauthHandshakeTimeoutMs = config.gateway?.handshakeTimeoutMs;
    return url
      ? [
          {
            url,
            auth: "remote",
            scope: "remote",
            ...(tlsFingerprint ? { tlsFingerprint } : {}),
            ...(preauthHandshakeTimeoutMs ? { preauthHandshakeTimeoutMs } : {}),
          },
        ]
      : [];
  }
  return resolveLocalGatewayProbeTargets(config);
}
function isSafeGatewayProbeTarget(target) {
  if (target.scope === "remote") return isSafeRemoteGatewayProbeUrl(target.url);
  return isSecureWebSocketUrl(target.url, {
    allowPrivateWs: process$1.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1",
  });
}
function isSafeRemoteGatewayProbeUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  const protocol =
    parsed.protocol === "https:" ? "wss:" : parsed.protocol === "http:" ? "ws:" : parsed.protocol;
  if (protocol === "wss:") return true;
  if (protocol !== "ws:") return false;
  if (isLoopbackGatewayHost(parsed.hostname)) return true;
  return (
    process$1.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" &&
    isSecureWebSocketUrl(url, { allowPrivateWs: true })
  );
}
function isLoopbackGatewayHost(hostname) {
  const normalized = hostname.toLowerCase().replace(/\.+$/, "");
  if (normalized === "localhost") return true;
  return isLoopbackAddress(
    normalized.startsWith("[") && normalized.endsWith("]") ? normalized.slice(1, -1) : normalized,
  );
}
async function resolveValidatedRemoteGatewayUrl(config) {
  try {
    const { buildGatewayConnectionDetailsWithResolvers } =
      await import("../connection-details-CesX9jCn.js");
    return buildGatewayConnectionDetailsWithResolvers({
      config,
      ignoreEnvUrlOverride: true,
    }).url;
  } catch {
    return null;
  }
}
async function resolveLocalGatewayProbeTargets(config) {
  const [
    { resolveGatewayPort },
    { resolveControlUiLinks },
    { buildGatewayProbeConnectionDetails },
    { readActiveGatewayLockPort },
  ] = await Promise.all([
    import("../paths-DKrK1elB.js"),
    import("../control-ui-links-CPg8dAGH.js"),
    import("../call-BtFiTrFI.js"),
    import("../gateway-lock-DiZY4FP0.js"),
  ]);
  const gateway = config.gateway;
  const configuredPort = resolveGatewayPort(config);
  const port =
    (Boolean(normalizeOptionalString(process$1.env.OPENCLAW_GATEWAY_PORT))
      ? void 0
      : await readActiveGatewayLockPort()) ?? configuredPort;
  const connection = await buildGatewayProbeConnectionDetails({
    config,
    localPortOverride: port,
  });
  const baseParams = {
    port,
    basePath: gateway?.controlUi?.basePath,
    tlsEnabled: gateway?.tls?.enabled === true,
  };
  const sharedTarget = {
    auth: "local",
    ...(connection.tlsFingerprint ? { tlsFingerprint: connection.tlsFingerprint } : {}),
    ...(connection.preauthHandshakeTimeoutMs
      ? { preauthHandshakeTimeoutMs: connection.preauthHandshakeTimeoutMs }
      : {}),
  };
  const loopbackTarget = {
    ...sharedTarget,
    url: connection.url,
    scope: "local-loopback",
  };
  const bind = gateway?.bind;
  if (bind !== "tailnet" && bind !== "custom") return [loopbackTarget];
  const configuredLinks = resolveControlUiLinks({
    ...baseParams,
    bind,
    customBindHost: gateway?.customBindHost,
  });
  return configuredLinks.wsUrl === connection.url
    ? [loopbackTarget]
    : [
        loopbackTarget,
        {
          ...sharedTarget,
          url: configuredLinks.wsUrl,
          scope: "local-configured",
        },
      ];
}
function pauseNonTtyStdinForCliExit() {
  const stdin = process$1.stdin;
  if (stdin.isTTY) return;
  try {
    stdin.pause();
  } catch {}
}
function resolveMissingPluginCommandMessage(pluginId, config, options) {
  return resolveMissingPluginCommandMessage$1(
    pluginId,
    config,
    options?.registry ? { registry: options.registry } : void 0,
  );
}
function shouldLoadCliDotEnv(env = process$1.env) {
  const cwd = tryProcessCwd();
  if (cwd && existsSync(path.join(cwd, ".env"))) return true;
  return existsSync(path.join(resolveStateDir(env), ".env"));
}
function isCommanderParseExit(error) {
  if (!error || typeof error !== "object") return false;
  const candidate = error;
  return (
    typeof candidate.exitCode === "number" &&
    Number.isInteger(candidate.exitCode) &&
    typeof candidate.code === "string" &&
    candidate.code.startsWith("commander.")
  );
}
function findCommandOption(command, token) {
  const equalsIndex = token.indexOf("=");
  const flag = equalsIndex === -1 ? token : token.slice(0, equalsIndex);
  return command.options.find((option) => option.long === flag || option.short === flag);
}
function findSubcommand(command, name) {
  return command.commands.find(
    (subcommand) => subcommand.name() === name || subcommand.aliases().includes(name),
  );
}
function shouldOptionConsumeFollowingToken(option, token, next) {
  if (!option || token.includes("=")) return false;
  if (option.required) return true;
  return option.optional && isValueToken(next);
}
function isNoColorConsumedAsCommandOptionValue(program, remainingArgs, noColorIndex) {
  let command = program;
  let pendingValue = false;
  for (let index = 0; index < noColorIndex; index += 1) {
    const arg = remainingArgs[index];
    if (!arg || arg === "--") return false;
    if (pendingValue) {
      pendingValue = false;
      continue;
    }
    if (arg.startsWith("-")) {
      const option = findCommandOption(command, arg);
      if (!option && index === noColorIndex - 1 && !arg.includes("=")) return true;
      pendingValue = shouldOptionConsumeFollowingToken(option, arg, remainingArgs[index + 1]);
      continue;
    }
    command = findSubcommand(command, arg) ?? command;
  }
  return pendingValue;
}
function isLogLevelConsumedAsCommandOption(program, remainingArgs, logLevelIndex) {
  let command = program;
  let pendingValue = false;
  for (let index = 0; index < logLevelIndex; index += 1) {
    const arg = remainingArgs[index];
    if (!arg || arg === "--") return false;
    if (pendingValue) {
      pendingValue = false;
      continue;
    }
    if (arg.startsWith("-")) {
      const option = findCommandOption(command, arg);
      if (!option && index === logLevelIndex - 1 && !arg.includes("=")) return true;
      pendingValue = shouldOptionConsumeFollowingToken(option, arg, remainingArgs[index + 1]);
      continue;
    }
    command = findSubcommand(command, arg) ?? command;
  }
  if (pendingValue) return true;
  const arg = remainingArgs[logLevelIndex];
  return command !== program && arg !== void 0 && findCommandOption(command, arg) !== void 0;
}
function normalizeRootNoColorArgvForProgram(argv, program) {
  return normalizeRootNoColorArgv(argv, {
    shouldPreserveNoColor: ({ remainingArgs, noColorIndex }) =>
      isNoColorConsumedAsCommandOptionValue(program, remainingArgs, noColorIndex),
  });
}
function normalizeRootLogLevelArgvForProgram(argv, program) {
  return normalizeRootLogLevelArgv(argv, {
    shouldPreserveLogLevel: ({ remainingArgs, logLevelIndex }) =>
      isLogLevelConsumedAsCommandOption(program, remainingArgs, logLevelIndex),
  });
}
async function ensureCliEnvProxyDispatcher() {
  try {
    const { hasEnvHttpProxyAgentConfigured } = await import("../proxy-env-BWZ8h7zv.js");
    if (!hasEnvHttpProxyAgentConfigured()) return;
    const { ensureGlobalUndiciEnvProxyDispatcher } =
      await import("../undici-global-dispatcher-CxQJWVQH.js");
    ensureGlobalUndiciEnvProxyDispatcher();
  } catch {}
}
function shouldBootstrapCliProxyBeforeFastPath(env = process$1.env) {
  if (
    isTruthyEnvValue(env.OPENCLAW_DEBUG_PROXY_ENABLED) ||
    isTruthyEnvValue(env.OPENCLAW_DEBUG_PROXY_REQUIRE)
  )
    return true;
  return CLI_PROXY_ENV_KEYS.some((key) => {
    const value = env[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}
function isKnownBuiltInCommandRoot(primary) {
  return (
    getCoreCliCommandNames().includes(primary) ||
    getSubCliEntries().some((entry) => entry.name === primary)
  );
}
async function isPluginCliRoot(params) {
  try {
    const { resolvePluginCliRootOwnerIds } = await loadCliRegistryLoaderModule();
    const ownerIds = await resolvePluginCliRootOwnerIds({
      cfg: params.config,
      env: process$1.env,
      primaryCommand: params.primary,
    });
    return ownerIds === null ? null : ownerIds.length > 0;
  } catch {
    return null;
  }
}
function createAllowlistAgnosticCliLookupConfig(config) {
  if (!Array.isArray(config.plugins?.allow) || config.plugins.allow.length === 0) return config;
  return {
    ...config,
    plugins: {
      ...config.plugins,
      allow: [],
    },
  };
}
async function resolveCliCommandSurfaceOwner(params) {
  const { resolveManifestCliCommandSurfaceOwner } = await loadManifestCommandAliasesRuntimeModule();
  const manifestOwner = resolveManifestCliCommandSurfaceOwner({
    command: params.primary,
    config: params.config,
    env: process$1.env,
  });
  if (manifestOwner) return manifestOwner;
  try {
    const { resolvePluginCliRootOwnerIds } = await loadCliRegistryLoaderModule();
    return (
      await resolvePluginCliRootOwnerIds({
        cfg: createAllowlistAgnosticCliLookupConfig(params.config),
        env: process$1.env,
        primaryCommand: params.primary,
      })
    )?.[0];
  } catch {
    return;
  }
}
function resolveUnownedCliPrimaryCandidate(argv) {
  const { primary } = resolveCliArgvInvocation(rewriteUpdateFlagArgv(argv));
  if (
    !primary ||
    primary === "help" ||
    isReservedNonPluginCommandRoot(primary) ||
    isKnownBuiltInCommandRoot(primary)
  )
    return null;
  return primary;
}
async function resolveUnownedCliPrimary(params) {
  const primary = resolveUnownedCliPrimaryCandidate(params.argv);
  if (!primary) return null;
  if (
    (await isPluginCliRoot({
      primary,
      config: params.config,
    })) !== false
  )
    return null;
  return primary;
}
async function resolveUnownedCliPrimaryMessage(params) {
  const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } =
    await loadManifestCommandAliasesRuntimeModule();
  const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner(params);
  const pluginPolicyMessage = resolveMissingPluginCommandMessage$1(params.primary, params.config, {
    resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
    resolveToolOwner: resolveManifestToolOwner,
    resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner,
  });
  if (pluginPolicyMessage) return pluginPolicyMessage;
  const suggestion = formatCliCommandSuggestions(params.primary);
  return [
    `Unknown command: openclaw ${params.primary}. No built-in command or plugin CLI metadata owns "${params.primary}".`,
    suggestion,
  ]
    .filter(Boolean)
    .join("\n");
}
async function bootstrapCliProxyCaptureAndDispatcher(startupTrace, options = {}) {
  const [
    { initializeDebugProxyCapture, finalizeDebugProxyCapture },
    { maybeWarnAboutDebugProxyCoverage },
  ] = await startupTrace.measure("proxy-imports", () =>
    Promise.all([import("../runtime-C1OWSrpp.js"), import("../coverage-DrNoQecw.js")]),
  );
  initializeDebugProxyCapture("cli");
  process$1.once("exit", () => {
    finalizeDebugProxyCapture();
  });
  if (options.ensureDispatcher !== false)
    await startupTrace.measure("proxy-dispatcher", () => ensureCliEnvProxyDispatcher());
  maybeWarnAboutDebugProxyCoverage();
}
async function runCli(argv = process$1.argv) {
  const originalArgv = normalizeWindowsArgv(argv);
  const startupTrace = createGatewayStartupTrace(originalArgv, "cli.main");
  const parsedContainer = parseCliContainerArgs(originalArgv);
  if (!parsedContainer.ok) throw new Error(parsedContainer.error);
  const parsedProfile = parseCliProfileArgs(parsedContainer.argv);
  if (!parsedProfile.ok) throw new Error(parsedProfile.error);
  if (parsedProfile.profile) applyCliProfileEnv({ profile: parsedProfile.profile });
  if (
    (parsedContainer.container ??
      normalizeOptionalString(process$1.env.OPENCLAW_CONTAINER) ??
      null) &&
    parsedProfile.profile
  )
    throw new Error("--container cannot be combined with --profile/--dev");
  const containerTarget = maybeRunCliInContainer(originalArgv);
  if (containerTarget.handled) {
    if (containerTarget.exitCode !== 0) process$1.exitCode = containerTarget.exitCode;
    return;
  }
  const normalizedArgv = normalizeRootHelpTargetArgv(normalizeRootNoColorArgv(parsedProfile.argv));
  const normalizedInvocation = resolveCliArgvInvocation(normalizedArgv);
  const isHelpOrVersionInvocation = normalizedInvocation.hasHelpOrVersion;
  const isGatewayRunInvocation = isGatewayRunInvocationArgv(normalizedArgv);
  startupTrace.mark("argv");
  assertSupportedRuntime();
  if (!isHelpOrVersionInvocation && (isGatewayRunInvocation || shouldLoadCliDotEnv()))
    await startupTrace.measure("dotenv", async () => {
      if (isRemoteAgentDispatchInvocation(normalizedArgv, normalizedInvocation.primary)) {
        const { loadGatewayDispatchCliDotEnv } =
          await import("../gateway-dispatch-dotenv-BeYTRtnH.js");
        await loadGatewayDispatchCliDotEnv({ quiet: true });
      } else {
        const { loadCliDotEnv } = await import("../dotenv-Br0fAcxM.js");
        loadCliDotEnv({
          loadGlobalEnv: !isGatewayRunInvocation,
          quiet: true,
        });
      }
    });
  if (!isHelpOrVersionInvocation && isGatewayRunInvocation)
    await startupTrace.measure("gateway-run-select-environment", async () => {
      const [{ selectGatewayRunEnvironment }, { defaultRuntime }] = await Promise.all([
        import("../pre-bootstrap-CrIDedhu.js"),
        import("../runtime-Dvam4E8I.js"),
      ]);
      await selectGatewayRunEnvironment({
        opts: resolveGatewayRunPreBootstrapOptions(normalizedArgv) ?? {},
        runtime: defaultRuntime,
      });
    });
  normalizeEnv();
  if (shouldEnsureCliPath(normalizedArgv)) ensureOpenClawCliOnPath();
  let proxyHandle = null;
  let onSigterm = null;
  let onSigint = null;
  let onExit = null;
  let unregisterProxySignalExitBarrier = null;
  let bestEffortConfigPromise = null;
  const isolateProxyConfigEnv = isGatewayRunInvocation;
  const readBestEffortCliConfig = async () => {
    if (!bestEffortConfigPromise)
      bestEffortConfigPromise = import("../io-CThf_xQw.js").then(({ readBestEffortConfig }) =>
        readBestEffortConfig(
          isolateProxyConfigEnv
            ? {
                isolateEnv: true,
                observe: false,
              }
            : void 0,
        ),
      );
    return await bestEffortConfigPromise;
  };
  const uninstallProxySignalHandlers = () => {
    if (onSigterm) {
      process$1.off("SIGTERM", onSigterm);
      onSigterm = null;
    }
    if (onSigint) {
      process$1.off("SIGINT", onSigint);
      onSigint = null;
    }
    if (onExit) {
      process$1.off("exit", onExit);
      onExit = null;
    }
  };
  const stopStartedProxy = async () => {
    unregisterProxySignalExitBarrier?.();
    unregisterProxySignalExitBarrier = null;
    uninstallProxySignalHandlers();
    const handle = proxyHandle;
    proxyHandle = null;
    if (handle) {
      const { stopProxy } = await loadProxyLifecycleModule();
      await stopProxy(handle);
    }
  };
  const killStartedProxy = () => {
    const handle = proxyHandle;
    proxyHandle = null;
    handle?.kill("SIGTERM");
  };
  const installProxySignalHandlers = () => {
    if (!proxyHandle || onSigterm || onSigint || onExit) return;
    unregisterProxySignalExitBarrier = registerSignalExitBarrier(stopStartedProxy);
    const shutdown = (exitCode) => {
      waitForSignalExitBarriers().finally(() => {
        process$1.exit(exitCode);
      });
    };
    onSigterm = () => shutdown(143);
    onSigint = () => shutdown(130);
    onExit = () => killStartedProxy();
    process$1.once("SIGTERM", onSigterm);
    process$1.once("SIGINT", onSigint);
    process$1.once("exit", onExit);
  };
  const replaceStartedProxy = async (config) => {
    await stopStartedProxy();
    const { startProxy } = await loadProxyLifecycleModule();
    proxyHandle = await startProxy(config);
    installProxySignalHandlers();
  };
  if (!isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv)) {
    const config = await readBestEffortCliConfig();
    const unownedPrimary = await resolveUnownedCliPrimary({
      argv: normalizedArgv,
      config,
    });
    if (unownedPrimary)
      throw new Error(
        await resolveUnownedCliPrimaryMessage({
          primary: unownedPrimary,
          config,
        }),
      );
    await replaceStartedProxy(config?.proxy ?? void 0);
  }
  let uninstallGatewayRunRuntimeHooks = null;
  if (!isHelpOrVersionInvocation && isGatewayRunInvocation) {
    const { installGatewayRunRuntimeHooks } = await import("../runtime-hooks-DrZePdac.js");
    uninstallGatewayRunRuntimeHooks = installGatewayRunRuntimeHooks({
      releaseManagedProxy: stopStartedProxy,
      refreshManagedProxy: replaceStartedProxy,
    });
  }
  try {
    if (shouldUseRootHelpFastPath(normalizedArgv)) {
      const { loadRootHelpRenderOptionsForConfigSensitivePlugins } =
        await loadRootHelpLiveConfigModule();
      const liveRootHelpOptions = await loadRootHelpRenderOptionsForConfigSensitivePlugins(
        process$1.env,
      );
      if (!liveRootHelpOptions) {
        const { outputPrecomputedRootHelpText } = await loadRootHelpMetadataModule();
        if (outputPrecomputedRootHelpText()) return;
      }
      const { outputRootHelp } = await import("../root-help-Cee7pbj5.js");
      await outputRootHelp(liveRootHelpOptions ?? void 0);
      return;
    }
    if (await tryOutputPrecomputedCommandHelp(normalizedArgv)) return;
    if (shouldUseSetupOnboardConfigureHelpFastPath(normalizedArgv)) {
      const { tryOutputSetupOnboardConfigureHelp } =
        await import("../setup-onboard-configure-help-fast-path-D_dvlE1N.js");
      if (await tryOutputSetupOnboardConfigureHelp(normalizedArgv)) return;
    }
    if (resolveUnownedCliPrimaryCandidate(normalizedArgv)) {
      const config = await readBestEffortCliConfig();
      const unownedPrimary = await resolveUnownedCliPrimary({
        argv: normalizedArgv,
        config,
      });
      if (unownedPrimary)
        throw new Error(
          await resolveUnownedCliPrimaryMessage({
            primary: unownedPrimary,
            config,
          }),
        );
    }
    const shouldRunBareRootCommand = shouldHandleBareRoot(normalizedArgv);
    if (shouldRunBareRootCommand) await ensureCliEnvProxyDispatcher();
    const bareRootLaunchTarget = shouldRunBareRootCommand
      ? await resolveBareRootLaunchTarget(normalizedArgv)
      : null;
    if (bareRootLaunchTarget) {
      if (bareRootLaunchTarget.kind === "remote-gateway-inference") {
        if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
          console.error(
            "Remote Gateway inference setup needs an interactive TTY. Re-run `openclaw` in a terminal connected to this Gateway.",
          );
          process$1.exitCode = 1;
          return;
        }
        const { runRemoteGatewayInferenceOnboarding } =
          await import("../onboard-remote-gateway-C2ruW0mi.js");
        await runRemoteGatewayInferenceOnboarding(bareRootLaunchTarget.target);
        return;
      }
      if (bareRootLaunchTarget.kind === "onboarding") {
        if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
          console.error(
            bareRootLaunchTarget.classic
              ? "OpenClaw config is invalid. Run `openclaw doctor --fix` before onboarding."
              : "Onboarding needs an interactive TTY. Use `openclaw onboard --non-interactive --accept-risk ...` for automation.",
          );
          process$1.exitCode = 1;
          return;
        }
        const { setupWizardCommand } = await import("../onboard-BFhlPwFB.js");
        await setupWizardCommand(bareRootLaunchTarget.classic ? { classic: true } : {});
        return;
      }
      if (bareRootLaunchTarget.kind === "tui") {
        if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
          console.error(
            "OpenClaw TUI needs an interactive TTY. Use `openclaw agent --local ...` for automation.",
          );
          process$1.exitCode = 1;
          return;
        }
        const { launchTuiCli } = await import("../tui-launch-ddCgIRxZ.js");
        const tuiOptions = bareRootLaunchTarget.local
          ? {
              deliver: false,
              local: true,
            }
          : {
              deliver: false,
              ...(bareRootLaunchTarget.tlsFingerprint
                ? { tlsFingerprint: bareRootLaunchTarget.tlsFingerprint }
                : {}),
            };
        const tuiLaunchOptions = {};
        if (bareRootLaunchTarget.gatewayUrl)
          tuiLaunchOptions.gatewayUrl = bareRootLaunchTarget.gatewayUrl;
        if (bareRootLaunchTarget.authSource)
          tuiLaunchOptions.authSource = bareRootLaunchTarget.authSource;
        await launchTuiCli(tuiOptions, tuiLaunchOptions);
        return;
      }
    }
    const shouldUseCliEnvProxy =
      !isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv);
    const bootstrapProxyBeforeFastPath =
      shouldUseCliEnvProxy && shouldBootstrapCliProxyBeforeFastPath();
    if (
      !bootstrapProxyBeforeFastPath &&
      (await tryRunGatewayRunFastPath(normalizedArgv, startupTrace))
    )
      return;
    if (!isHelpOrVersionInvocation)
      await bootstrapCliProxyCaptureAndDispatcher(startupTrace, {
        ensureDispatcher: shouldUseCliEnvProxy,
      });
    if (
      bootstrapProxyBeforeFastPath &&
      (await tryRunGatewayRunFastPath(normalizedArgv, startupTrace))
    )
      return;
    const { tryRouteCli } = await startupTrace.measure(
      "route-import",
      () => import("../route-4Gmw3u9P.js"),
    );
    if (await startupTrace.measure("route", () => tryRouteCli(normalizedArgv))) return;
    let parseArgv = normalizeGeneratedHelpCommandArgv(rewriteUpdateFlagArgv(normalizedArgv));
    const suppressStartupProgress = hasJsonOutputFlag(parseArgv);
    const { createCliProgress } = await loadProgressModule();
    const startupProgress = createCliProgress({
      label: "Loading OpenClaw CLI…",
      indeterminate: true,
      delayMs: 0,
      ...(suppressStartupProgress ? { enabled: false } : {}),
    });
    let startupProgressStopped = false;
    const stopStartupProgress = () => {
      if (startupProgressStopped) return;
      startupProgressStopped = true;
      startupProgress.done();
    };
    try {
      const { enableConsoleCapture } = await loadLoggingModule();
      enableConsoleCapture();
      const [
        { buildProgram },
        { formatUncaughtError },
        { formatCliFailureLines },
        { runFatalErrorHooks },
        {
          installUnhandledRejectionHandler,
          isBenignUncaughtExceptionError,
          isUncaughtExceptionHandled,
        },
        { restoreTerminalState },
      ] = await startupTrace.measure("core-imports", () =>
        Promise.all([
          import("../program-D3EBCf4f.js"),
          import("../infra/errors.js"),
          import("../failure-output-Dfsu97Wc.js"),
          import("../fatal-error-hooks-BiXaGF_Q.js"),
          import("../unhandled-rejections-CQf8yGGk.js"),
          import("../terminal-core/restore.js"),
        ]),
      );
      const program = await startupTrace.measure("build-program", () => buildProgram());
      installUnhandledRejectionHandler();
      process$1.on("uncaughtException", (error) => {
        if (isUncaughtExceptionHandled(error)) return;
        if (isBenignUncaughtExceptionError(error)) {
          console.warn(
            "[openclaw] Non-fatal uncaught exception (continuing):",
            formatUncaughtError(error),
          );
          return;
        }
        for (const line of formatCliFailureLines({
          title: "OpenClaw hit an unexpected runtime error.",
          error,
          argv: normalizedArgv,
        }))
          console.error(line);
        for (const message of runFatalErrorHooks({
          reason: "uncaught_exception",
          error,
        }))
          console.error("[openclaw]", message);
        restoreTerminalState("uncaught exception", { resumeStdinIfPaused: false });
        process$1.exit(1);
      });
      const { primary } = resolveCliArgvInvocation(parseArgv);
      if (primary && shouldRegisterPrimaryCommandOnly(parseArgv))
        await startupTrace.measure("register-primary", async () => {
          const { getProgramContext } = await import("../program-context-C5CVUqfZ.js");
          const ctx = getProgramContext(program);
          if (ctx) {
            const { registerCoreCliByName } = await import("../command-registry-CYp_cjLC.js");
            await registerCoreCliByName(program, ctx, primary, parseArgv);
          }
          const { registerSubCliByName } = await import("../register.subclis-DXeMYOL_.js");
          await registerSubCliByName(program, primary, parseArgv);
        });
      const hasBuiltinPrimary =
        primary !== null &&
        program.commands.some(
          (command) => command.name() === primary || command.aliases().includes(primary),
        );
      if (
        !shouldSkipPluginCommandRegistration({
          argv: parseArgv,
          primary,
          hasBuiltinPrimary,
        })
      ) {
        const config = await startupTrace.measure("register-plugin-commands", async () => {
          const { registerPluginCliCommandsFromValidatedConfig } =
            await import("../cli-7HKqAFzS.js");
          return await withConsoleLogsRoutedToStderrForJson(parseArgv, () =>
            registerPluginCliCommandsFromValidatedConfig(program, void 0, void 0, {
              mode: "lazy",
              primary,
            }),
          );
        });
        if (config) {
          if (
            primary &&
            !program.commands.some(
              (command) => command.name() === primary || command.aliases().includes(primary),
            )
          ) {
            const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } =
              await loadManifestCommandAliasesRuntimeModule();
            const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner({
              primary,
              config,
            });
            const missingPluginCommandMessage = resolveMissingPluginCommandMessage$1(
              primary,
              config,
              {
                resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
                resolveToolOwner: resolveManifestToolOwner,
                resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner,
              },
            );
            if (missingPluginCommandMessage) throw new Error(missingPluginCommandMessage);
          }
        }
      }
      parseArgv = normalizeRootLogLevelArgvForProgram(
        normalizeRootNoColorArgvForProgram(parseArgv, program),
        program,
      );
      stopStartupProgress();
      try {
        await startupTrace.measure("parse", () => program.parseAsync(parseArgv));
      } catch (error) {
        if (!isCommanderParseExit(error)) throw error;
        process$1.exitCode = error.exitCode;
      }
    } finally {
      stopStartupProgress();
    }
  } finally {
    uninstallGatewayRunRuntimeHooks?.();
    await stopStartedProxy();
    await disposeCliAgentHarnesses();
    await closeCliMemoryManagers();
    pauseNonTtyStdinForCliExit();
    flushExitAfterOneShotOutput();
  }
}
//#endregion
export {
  isGatewayRunFastPathArgv,
  resolveMissingPluginCommandMessage,
  rewriteUpdateFlagArgv,
  runCli,
  shouldEnsureCliPath,
  shouldHandleBareRoot,
  shouldStartOnboardingForFreshInstall,
  shouldStartProxyForCli,
  shouldUseRootHelpFastPath,
  shouldUseSetupOnboardConfigureHelpFastPath,
};
