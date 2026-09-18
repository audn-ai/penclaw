import { t as resolveCliArgvInvocation } from "./argv-invocation-BjvIqM-C.js";
import {
  a as getPositiveIntFlagValue,
  c as hasFlag,
  i as getFlagValue,
  j as isValueToken,
  r as getCommandPositionalsWithRootOptions,
  s as getVerboseFlag,
} from "./argv-zTv4_Dzq.js";
import {
  n as ensureCliExecutionBootstrap,
  r as resolveCliExecutionStartupContext,
  t as applyCliExecutionStartupPresentation,
} from "./command-execution-startup-DRS8sqFq.js";
import {
  i as cliCommandCatalog,
  r as matchesCommandPath,
  t as resolveCliCommandPathPolicy,
} from "./command-path-policy-CHhtag3S.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { i as parseStrictPositiveIntOrUndefined } from "./helpers-WGaRKVcg.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import { x as tryParseLogLevel } from "./logger-BUux_Jpv.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
//#region src/cli/program/route-args.ts
function parseOptionalFlagValue(argv, name) {
  const value = getFlagValue(argv, name);
  if (value === null) return { ok: false };
  return {
    ok: true,
    value,
  };
}
function parseRepeatedFlagValues(argv, name) {
  const values = [];
  const args = argv.slice(2);
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg || arg === "--") break;
    if (arg === name) {
      const next = args[i + 1];
      if (next === void 0 || !isValueToken(next)) return null;
      values.push(next);
      i += 1;
      continue;
    }
    if (arg.startsWith(`${name}=`)) {
      const value = arg.slice(name.length + 1).trim();
      if (!value) return null;
      values.push(value);
    }
  }
  return values;
}
function parseSinglePositional(argv, params) {
  const positionals = getCommandPositionalsWithRootOptions(argv, params);
  if (!positionals || positionals.length !== 1) return null;
  return positionals[0] ?? null;
}
/** Parse `openclaw health` flags for the route-first status family. */
function parseHealthRouteArgs(argv) {
  const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
  if (timeoutMs === null) return null;
  return {
    json: hasFlag(argv, "--json"),
    verbose: getVerboseFlag(argv, { includeDebug: true }),
    timeoutMs,
  };
}
/** Parse `openclaw status` flags without registering the full command tree. */
function parseStatusRouteArgs(argv) {
  const timeoutMs = getPositiveIntFlagValue(argv, "--timeout");
  if (timeoutMs === null) return null;
  return {
    json: hasFlag(argv, "--json"),
    deep: hasFlag(argv, "--deep"),
    all: hasFlag(argv, "--all"),
    usage: hasFlag(argv, "--usage"),
    verbose: getVerboseFlag(argv, { includeDebug: true }),
    timeoutMs,
  };
}
/** Parse `openclaw gateway status` RPC-only flags accepted by the fast route. */
function parseGatewayStatusRouteArgs(argv) {
  const url = parseOptionalFlagValue(argv, "--url");
  if (!url.ok) return null;
  const token = parseOptionalFlagValue(argv, "--token");
  if (!token.ok) return null;
  const password = parseOptionalFlagValue(argv, "--password");
  if (!password.ok) return null;
  const timeout = parseOptionalFlagValue(argv, "--timeout");
  if (!timeout.ok) return null;
  const ssh = parseOptionalFlagValue(argv, "--ssh");
  if (!ssh.ok || ssh.value !== void 0) return null;
  const sshIdentity = parseOptionalFlagValue(argv, "--ssh-identity");
  if (!sshIdentity.ok || sshIdentity.value !== void 0) return null;
  if (hasFlag(argv, "--ssh-auto")) return null;
  return {
    rpc: {
      url: url.value,
      token: token.value,
      password: password.value,
      timeout: timeout.value,
    },
    deep: hasFlag(argv, "--deep"),
    json: hasFlag(argv, "--json"),
    requireRpc: hasFlag(argv, "--require-rpc"),
    probe: !hasFlag(argv, "--no-probe"),
  };
}
/** Parse `openclaw sessions` filters for JSON/list route execution. */
function parseSessionsRouteArgs(argv) {
  const agent = parseOptionalFlagValue(argv, "--agent");
  if (!agent.ok) return null;
  const store = parseOptionalFlagValue(argv, "--store");
  if (!store.ok) return null;
  const active = parseOptionalFlagValue(argv, "--active");
  if (!active.ok) return null;
  const limit = parseOptionalFlagValue(argv, "--limit");
  if (!limit.ok) return null;
  return {
    json: hasFlag(argv, "--json"),
    allAgents: hasFlag(argv, "--all-agents"),
    agent: agent.value,
    store: store.value,
    active: active.value,
    limit: limit.value,
  };
}
/** Parse `openclaw agents list` display switches for route-first execution. */
function parseAgentsListRouteArgs(argv) {
  return {
    json: hasFlag(argv, "--json"),
    bindings: hasFlag(argv, "--bindings"),
  };
}
/** Parse `openclaw config get <path>` while preserving root option handling. */
function parseConfigGetRouteArgs(argv) {
  const path = parseSinglePositional(argv, {
    commandPath: ["config", "get"],
    booleanFlags: ["--json"],
  });
  if (!path) return null;
  return {
    path,
    json: hasFlag(argv, "--json"),
  };
}
/** Parse `openclaw config unset <path>` and its mutation guard flags. */
function parseConfigUnsetRouteArgs(argv) {
  const path = parseSinglePositional(argv, {
    commandPath: ["config", "unset"],
    booleanFlags: ["--dry-run", "--allow-exec", "--json"],
  });
  if (!path) return null;
  return {
    path,
    cliOptions: {
      dryRun: hasFlag(argv, "--dry-run"),
      allowExec: hasFlag(argv, "--allow-exec"),
      json: hasFlag(argv, "--json"),
    },
  };
}
/** Parse `openclaw models list` filters for the lightweight model catalog route. */
function parseModelsListRouteArgs(argv) {
  const provider = parseOptionalFlagValue(argv, "--provider");
  if (!provider.ok) return null;
  return {
    provider: provider.value,
    all: hasFlag(argv, "--all"),
    local: hasFlag(argv, "--local"),
    json: hasFlag(argv, "--json"),
    plain: hasFlag(argv, "--plain"),
  };
}
/** Parse `openclaw models status` probe controls for the route-first status path. */
function parseModelsStatusRouteArgs(argv) {
  const probeProvider = parseOptionalFlagValue(argv, "--probe-provider");
  if (!probeProvider.ok) return null;
  const probeTimeout = parseOptionalFlagValue(argv, "--probe-timeout");
  if (!probeTimeout.ok) return null;
  const probeConcurrency = parseOptionalFlagValue(argv, "--probe-concurrency");
  if (!probeConcurrency.ok) return null;
  const probeMaxTokens = parseOptionalFlagValue(argv, "--probe-max-tokens");
  if (!probeMaxTokens.ok) return null;
  const agent = parseOptionalFlagValue(argv, "--agent");
  if (!agent.ok) return null;
  const probeProfileValues = parseRepeatedFlagValues(argv, "--probe-profile");
  if (probeProfileValues === null) return null;
  const probeProfile =
    probeProfileValues.length === 0
      ? void 0
      : probeProfileValues.length === 1
        ? probeProfileValues[0]
        : probeProfileValues;
  return {
    probeProvider: probeProvider.value,
    probeTimeout: probeTimeout.value,
    probeConcurrency: probeConcurrency.value,
    probeMaxTokens: probeMaxTokens.value,
    agent: agent.value,
    probeProfile,
    json: hasFlag(argv, "--json"),
    plain: hasFlag(argv, "--plain"),
    check: hasFlag(argv, "--check"),
    probe: hasFlag(argv, "--probe"),
  };
}
/** Parse `openclaw channels list` display flags for the route-first list path. */
function parseChannelsListRouteArgs(argv) {
  return {
    json: hasFlag(argv, "--json"),
    all: hasFlag(argv, "--all"),
  };
}
/** Parse `openclaw channels status` probe flags without full CLI registration. */
function parseChannelsStatusRouteArgs(argv) {
  const timeout = parseOptionalFlagValue(argv, "--timeout");
  const channel = parseOptionalFlagValue(argv, "--channel");
  if (!timeout.ok) return null;
  if (!channel.ok) return null;
  return {
    channel: channel.value,
    json: hasFlag(argv, "--json"),
    probe: hasFlag(argv, "--probe"),
    timeout: timeout.value,
  };
}
/** Parse JSON-only `openclaw plugins list` flags for plugin inventory output. */
function parsePluginsListRouteArgs(argv) {
  if (!hasFlag(argv, "--json")) return null;
  const positionals = getCommandPositionalsWithRootOptions(argv, {
    commandPath: ["plugins", "list"],
    booleanFlags: ["--json", "--enabled", "--verbose"],
  });
  if (!positionals || positionals.length !== 0) return null;
  return {
    json: true,
    enabled: hasFlag(argv, "--enabled"),
    verbose: hasFlag(argv, "--verbose"),
  };
}
function parseTasksListRouteArgsForCommandPath(argv, commandPath) {
  if (!hasFlag(argv, "--json")) return null;
  const positionals = getCommandPositionalsWithRootOptions(argv, {
    commandPath,
    booleanFlags: ["--json"],
    valueFlags: ["--runtime", "--status"],
  });
  if (!positionals || positionals.length !== 0) return null;
  const runtime = parseOptionalFlagValue(argv, "--runtime");
  if (!runtime.ok) return null;
  const status = parseOptionalFlagValue(argv, "--status");
  if (!status.ok) return null;
  return {
    json: true,
    runtime: runtime.value,
    status: status.value,
  };
}
/** Parse both `openclaw tasks --json` and `openclaw tasks list --json` aliases. */
function parseTasksListRouteArgs(argv) {
  return (
    parseTasksListRouteArgsForCommandPath(argv, ["tasks"]) ??
    parseTasksListRouteArgsForCommandPath(argv, ["tasks", "list"])
  );
}
/** Parse JSON-only `openclaw tasks audit` filters for the route-first audit path. */
function parseTasksAuditRouteArgs(argv) {
  if (!hasFlag(argv, "--json")) return null;
  const positionals = getCommandPositionalsWithRootOptions(argv, {
    commandPath: ["tasks", "audit"],
    booleanFlags: ["--json"],
    valueFlags: ["--severity", "--code", "--limit"],
  });
  if (!positionals || positionals.length !== 0) return null;
  const severity = parseOptionalFlagValue(argv, "--severity");
  if (!severity.ok) return null;
  const code = parseOptionalFlagValue(argv, "--code");
  if (!code.ok) return null;
  const rawLimit = getFlagValue(argv, "--limit");
  if (rawLimit === null) return null;
  const limit = rawLimit === void 0 ? void 0 : parseStrictPositiveIntOrUndefined(rawLimit);
  if (rawLimit !== void 0 && limit === void 0) return null;
  return {
    json: true,
    severity: severity.value,
    code: code.value,
    limit,
  };
}
//#endregion
//#region src/cli/program/routed-command-definitions.ts
function defineRoutedCommand(definition) {
  return definition;
}
const configCliLoader = createLazyImportLoader(() => import("./config-cli-Dsa4PXNC.js"));
const agentsListCommandLoader = createLazyImportLoader(
  () => import("./agents.commands.list-DaKhu95A.js"),
);
const modelsListCommandLoader = createLazyImportLoader(
  () => import("./list.list-command-BWQX24yw.js"),
);
const modelsStatusCommandLoader = createLazyImportLoader(
  () => import("./list.status-command-BbCDzNXP.js"),
);
const tasksJsonCommandLoader = createLazyImportLoader(() => import("./tasks-json-yFdrt6q-.js"));
function loadConfigCli() {
  return configCliLoader.load();
}
function loadAgentsListCommand() {
  return agentsListCommandLoader.load();
}
function loadModelsListCommand() {
  return modelsListCommandLoader.load();
}
function loadModelsStatusCommand() {
  return modelsStatusCommandLoader.load();
}
function loadTasksJsonCommand() {
  return tasksJsonCommandLoader.load();
}
/** Route id to lazy parser/runner definition. */
const routedCommandDefinitions = {
  health: defineRoutedCommand({
    parseArgs: parseHealthRouteArgs,
    runParsedArgs: async (args) => {
      const { healthCommand } = await import("./health-D283zUOU.js");
      await healthCommand(args, defaultRuntime);
    },
  }),
  status: defineRoutedCommand({
    parseArgs: parseStatusRouteArgs,
    runParsedArgs: async (args) => {
      if (args.json) {
        const { statusJsonCommand } = await import("./status-json-j1wRzytt.js");
        await statusJsonCommand(
          {
            deep: args.deep,
            all: args.all,
            usage: args.usage,
            timeoutMs: args.timeoutMs,
          },
          defaultRuntime,
        );
        return;
      }
      const { statusCommand } = await import("./status-DHs7S7R5.js");
      await statusCommand(args, defaultRuntime);
    },
  }),
  "gateway-status": defineRoutedCommand({
    parseArgs: parseGatewayStatusRouteArgs,
    runParsedArgs: async (args) => {
      const { runDaemonStatus } = await import("./status-BCE5cp41.js");
      await runDaemonStatus(args);
    },
  }),
  sessions: defineRoutedCommand({
    parseArgs: parseSessionsRouteArgs,
    runParsedArgs: async (args) => {
      const { sessionsCommand } = await import("./sessions-DZ5z9wOQ.js");
      await sessionsCommand(args, defaultRuntime);
    },
  }),
  "agents-list": defineRoutedCommand({
    parseArgs: parseAgentsListRouteArgs,
    runParsedArgs: async (args) => {
      const { agentsListCommand } = await loadAgentsListCommand();
      await agentsListCommand(args, defaultRuntime);
    },
  }),
  "config-get": defineRoutedCommand({
    parseArgs: parseConfigGetRouteArgs,
    runParsedArgs: async (args) => {
      const { runConfigGet } = await loadConfigCli();
      await runConfigGet(args);
    },
  }),
  "config-unset": defineRoutedCommand({
    parseArgs: parseConfigUnsetRouteArgs,
    runParsedArgs: async (args) => {
      const { runConfigUnset } = await loadConfigCli();
      await runConfigUnset(args);
    },
  }),
  "models-list": defineRoutedCommand({
    parseArgs: parseModelsListRouteArgs,
    runParsedArgs: async (args) => {
      const { modelsListCommand } = await loadModelsListCommand();
      await modelsListCommand(args, defaultRuntime);
    },
  }),
  "models-status": defineRoutedCommand({
    parseArgs: parseModelsStatusRouteArgs,
    runParsedArgs: async (args) => {
      const { modelsStatusCommand } = await loadModelsStatusCommand();
      await modelsStatusCommand(args, defaultRuntime);
    },
  }),
  "tasks-list": defineRoutedCommand({
    parseArgs: parseTasksListRouteArgs,
    runParsedArgs: async (args) => {
      const { tasksListJsonCommand } = await loadTasksJsonCommand();
      await tasksListJsonCommand(args, defaultRuntime);
    },
  }),
  "tasks-audit": defineRoutedCommand({
    parseArgs: parseTasksAuditRouteArgs,
    runParsedArgs: async (args) => {
      const { tasksAuditJsonCommand } = await loadTasksJsonCommand();
      await tasksAuditJsonCommand(args, defaultRuntime);
    },
  }),
  "channels-list": defineRoutedCommand({
    parseArgs: parseChannelsListRouteArgs,
    runParsedArgs: async (args) => {
      const { channelsListCommand } = await import("./list-CfbG3iSN.js");
      await channelsListCommand(args, defaultRuntime);
    },
  }),
  "channels-status": defineRoutedCommand({
    parseArgs: parseChannelsStatusRouteArgs,
    runParsedArgs: async (args) => {
      const { channelsStatusCommand } = await import("./status-B9yM6nHN.js");
      await channelsStatusCommand(args, defaultRuntime);
    },
  }),
  "plugins-list": defineRoutedCommand({
    parseArgs: parsePluginsListRouteArgs,
    runParsedArgs: async (args) => {
      const { runPluginsListCommand } = await import("./plugins-list-command-nvGcnKNj.js");
      await runPluginsListCommand(args, defaultRuntime);
    },
  }),
};
//#endregion
//#region src/cli/program/route-specs.ts
function createCommandLoadPlugins(commandPath) {
  return (argv) => {
    const loadPlugins = resolveCliCommandPathPolicy([...commandPath]).loadPlugins;
    return loadPlugins === "always" || (loadPlugins === "text-only" && !hasFlag(argv, "--json"));
  };
}
function createParsedRoute(params) {
  return {
    matches: (path) =>
      matchesCommandPath(path, params.entry.commandPath, { exact: params.entry.exact }),
    canRun: (argv) => Boolean(params.definition.parseArgs(argv)),
    loadPlugins: params.entry.route?.preloadPlugins
      ? createCommandLoadPlugins(params.entry.commandPath)
      : void 0,
    run: async (argv) => {
      const args = params.definition.parseArgs(argv);
      if (!args) return false;
      await params.definition.runParsedArgs(args);
      return true;
    },
  };
}
/** Route specs generated from catalog entries with parseable routed-command definitions. */
const routedCommands = cliCommandCatalog
  .filter((entry) => Boolean(entry.route))
  .flatMap((entry) => {
    const definition = routedCommandDefinitions[entry.route.id];
    return definition
      ? [
          createParsedRoute({
            entry,
            definition,
          }),
        ]
      : [];
  });
//#endregion
//#region src/cli/program/routes.ts
/** Routed command contract re-exported for callers that only need route lookup. */
/** Find the first route matching a command path and parseable argv. */
function findRoutedCommand(path, argv) {
  for (const route of routedCommands)
    if (route.matches(path)) {
      if (argv && route.canRun && !route.canRun(argv)) continue;
      return route;
    }
  return null;
}
//#endregion
//#region src/cli/route.ts
const LOG_LEVEL_FLAG = "--log-level";
const LOG_LEVEL_EQUALS_PREFIX = `${LOG_LEVEL_FLAG}=`;
function resolveRoutedCliLogLevel(argv) {
  const args = argv.slice(2);
  let logLevel;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg || arg === "--") break;
    if (arg === LOG_LEVEL_FLAG) {
      const value = args[index + 1];
      if (!isValueToken(value)) return null;
      const parsed = tryParseLogLevel(value);
      if (!parsed) return null;
      logLevel = parsed;
      index += 1;
      continue;
    }
    if (arg.startsWith(LOG_LEVEL_EQUALS_PREFIX)) {
      const parsed = tryParseLogLevel(arg.slice(LOG_LEVEL_EQUALS_PREFIX.length));
      if (!parsed) return null;
      logLevel = parsed;
    }
  }
  return logLevel;
}
async function prepareRoutedCommand(params) {
  const { startupPolicy } = resolveCliExecutionStartupContext({
    argv: params.argv,
    jsonOutputMode: hasFlag(params.argv, "--json"),
    env: process.env,
    routeMode: true,
  });
  const { VERSION } = await import("./version-BmsGkjsI.js");
  await applyCliExecutionStartupPresentation({
    argv: params.argv,
    startupPolicy,
    showBanner: process.stdout.isTTY && !startupPolicy.suppressDoctorStdout,
    version: VERSION,
  });
  const shouldLoadPlugins =
    typeof params.loadPlugins === "function" ? params.loadPlugins(params.argv) : params.loadPlugins;
  await ensureCliExecutionBootstrap({
    runtime: defaultRuntime,
    commandPath: params.commandPath,
    startupPolicy,
    loadPlugins: shouldLoadPlugins ?? startupPolicy.loadPlugins,
  });
}
/** Try a lightweight route-first command before falling back to the full CLI program. */
async function tryRouteCli(argv) {
  if (isTruthyEnvValue(process.env.OPENCLAW_DISABLE_ROUTE_FIRST)) return false;
  const invocation = resolveCliArgvInvocation(argv);
  if (invocation.hasHelpOrVersion) return false;
  if (!invocation.commandPath[0]) return false;
  const route = findRoutedCommand(invocation.commandPath, argv);
  if (!route) return false;
  if (route.canRun && !route.canRun(argv)) return false;
  const logLevel = resolveRoutedCliLogLevel(argv);
  if (logLevel === null) return false;
  if (logLevel) process.env.OPENCLAW_LOG_LEVEL = logLevel;
  await prepareRoutedCommand({
    argv,
    commandPath: invocation.commandPath,
    loadPlugins: route.loadPlugins,
  });
  return route.run(argv);
}
//#endregion
export { tryRouteCli };
