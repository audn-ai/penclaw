import path from "node:path";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { c as callGateway } from "./call-BVMO6az_.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import {
  a as resolveHookEntries,
  i as resolveHookEnableState,
  r as resolveHookConfig,
  t as isHookConfigPathTruthy,
} from "./config-CzBjCjbr.js";
import "./agent-scope-y9xQv_q1.js";
import { n as hasBinary } from "./config-eval-BLzabchw.js";
import { n as decorativePrefix, t as decorativeEmoji } from "./decorative-emoji--qGdsZZ4.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { i as getRuntimeConfig, u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import {
  a as isNativeHookRelayBridgeStaleRegistrationError,
  i as invokeNativeHookRelayBridge,
  s as renderNativeHookRelayUnavailableResponse,
} from "./native-hook-relay-WEC9uRFL.js";
import "./method-scopes-DrxGpKMT.js";
import { n as requestExitAfterOneShotOutput } from "./one-shot-exit-DdMGi0bf.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DZMZaF9B.js";
import { n as runPluginInstallCommand } from "./plugins-install-command-DS-M8HRr.js";
import { t as runPluginUpdateCommand } from "./plugins-update-command-CVaIOPRi.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { m as evaluateEntryRequirementsForCurrentPlatform } from "./status-D7X0puSr.js";
import { a as buildPluginDiagnosticsReport } from "./status-V8msAxCA.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-quSzXaPg.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { t as setSafeTimeout } from "./timer-delay-Bw3nwNkv.js";
import { h as shortenHomePath, t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
import {
  n as isKnownInternalHookEventKey,
  t as loadWorkspaceHookEntries,
} from "./workspace-C3bYPRRI.js";
//#region src/hooks/hooks-status.ts
function resolveHookKey(entry) {
  return entry.metadata?.hookKey ?? entry.hook.name;
}
function normalizeInstallOptions(entry) {
  const install = entry.metadata?.install ?? [];
  if (install.length === 0) return [];
  return install.map((spec, index) => {
    const id = (spec.id ?? `${spec.kind}-${index}`).trim();
    const bins = spec.bins ?? [];
    let label = (spec.label ?? "").trim();
    if (!label)
      if (spec.kind === "bundled") label = "Bundled with OpenClaw";
      else if (spec.kind === "npm" && spec.package) label = `Install ${spec.package} (npm)`;
      else if (spec.kind === "git" && spec.repository) label = `Install from ${spec.repository}`;
      else label = "Run installer";
    return {
      id,
      kind: spec.kind,
      label,
      bins,
    };
  });
}
function buildHookStatus(entry, config, eligibility) {
  const hookKey = resolveHookKey(entry);
  const hookConfig = resolveHookConfig(config, hookKey);
  const managedByPlugin = entry.hook.source === "openclaw-plugin";
  const enableState = resolveHookEnableState({
    entry,
    config,
    hookConfig,
  });
  const always = entry.metadata?.always === true;
  const events = entry.metadata?.events ?? [];
  const unknownEvents = events.filter((event) => !isKnownInternalHookEventKey(event));
  const isEnvSatisfied = (envName) => Boolean(process.env[envName] || hookConfig?.env?.[envName]);
  const isConfigSatisfied = (pathStr) => isHookConfigPathTruthy(config, pathStr);
  const { emoji, homepage, required, missing, requirementsSatisfied, configChecks } =
    evaluateEntryRequirementsForCurrentPlatform({
      always,
      entry,
      hasLocalBin: hasBinary,
      remote: eligibility?.remote,
      isEnvSatisfied,
      isConfigSatisfied,
    });
  const enabledByConfig = enableState.enabled;
  const loadable = enabledByConfig && requirementsSatisfied;
  const blockedReason =
    enableState.reason ?? (requirementsSatisfied ? void 0 : "missing requirements");
  return {
    name: entry.hook.name,
    description: entry.hook.description,
    source: entry.hook.source,
    pluginId: entry.hook.pluginId,
    filePath: entry.hook.filePath,
    baseDir: entry.hook.baseDir,
    handlerPath: entry.hook.handlerPath,
    hookKey,
    emoji,
    homepage,
    events,
    unknownEvents,
    always,
    enabledByConfig,
    requirementsSatisfied,
    loadable,
    blockedReason,
    managedByPlugin,
    requirements: required,
    missing,
    configChecks,
    install: normalizeInstallOptions(entry),
  };
}
function buildWorkspaceHookStatus(workspaceDir, opts) {
  return {
    workspaceDir,
    managedHooksDir: opts?.managedHooksDir ?? path.join(CONFIG_DIR, "hooks"),
    hooks: resolveHookEntries(opts?.entries ?? loadWorkspaceHookEntries(workspaceDir, opts)).map(
      (entry) => buildHookStatus(entry, opts?.config, opts?.eligibility),
    ),
  };
}
//#endregion
//#region src/cli/native-hook-relay-cli.ts
const MAX_NATIVE_HOOK_STDIN_BYTES = 1024 * 1024;
var NativeHookRelayDeadlineError = class extends Error {
  constructor(timeoutMs) {
    super(`native hook relay timed out after ${timeoutMs}ms`);
    this.name = "NativeHookRelayDeadlineError";
  }
};
/** Run one native hook relay invocation from stdin JSON to stdout/stderr response streams. */
async function runNativeHookRelayCli(opts, deps = {}) {
  const stdin = deps.stdin ?? process.stdin;
  const stdout = deps.stdout ?? process.stdout;
  const stderr = deps.stderr ?? process.stderr;
  const invokeBridge = deps.invokeBridge ?? invokeNativeHookRelayBridge;
  const callGatewayFn = deps.callGateway ?? callGateway;
  const provider = readRequiredOption(opts.provider, "provider");
  const relayId = readRequiredOption(opts.relayId, "relay-id");
  const generation = opts.generation?.trim() || void 0;
  const event = readRequiredOption(opts.event, "event");
  let timeoutMs;
  try {
    timeoutMs = parseTimeoutMsWithFallback(opts.timeout, 5e3);
  } catch (error) {
    writeText(stderr, formatRelayCliError("invalid native hook timeout", error));
    return 1;
  }
  const deadline = createNativeHookRelayDeadline(timeoutMs);
  try {
    let rawPayload;
    try {
      const rawInput = await readStreamText(stdin, MAX_NATIVE_HOOK_STDIN_BYTES, deadline);
      rawPayload = rawInput.trim() ? JSON.parse(rawInput) : null;
    } catch (error) {
      if (isNativeHookRelayDeadlineError(error))
        return writeNativeHookRelayDeadlineResponse({
          stdout,
          stderr,
          opts,
          provider,
          event,
          error,
        });
      writeText(stderr, formatRelayCliError("failed to read native hook input", error));
      return 1;
    }
    try {
      const remainingMs = remainingNativeHookRelayDeadlineMs(deadline);
      const response = await withNativeHookRelayDeadline(
        deadline,
        invokeBridge({
          provider,
          relayId,
          generation,
          event,
          rawPayload,
          registrationTimeoutMs: Math.min(100, remainingMs),
          timeoutMs: remainingMs,
        }),
      );
      writeText(stdout, response.stdout);
      writeText(stderr, response.stderr);
      return response.exitCode;
    } catch (error) {
      if (isNativeHookRelayDeadlineError(error))
        return writeNativeHookRelayDeadlineResponse({
          stdout,
          stderr,
          opts,
          provider,
          event,
          error,
        });
      if (isNativeHookRelayBridgeStaleRegistrationError(error)) {
        writeText(stderr, formatRelayCliError("native hook relay unavailable", error));
        return writeNativeHookRelayUnavailableResponse({
          stdout,
          stderr,
          opts,
          provider,
          event,
        });
      }
    }
    try {
      const response = await withNativeHookRelayDeadline(
        deadline,
        callGatewayFn({
          method: "nativeHook.invoke",
          params: {
            provider,
            relayId,
            generation,
            event,
            rawPayload,
          },
          timeoutMs: remainingNativeHookRelayDeadlineMs(deadline),
          signal: deadline.signal,
          scopes: [ADMIN_SCOPE],
        }),
      );
      writeText(stdout, response.stdout);
      writeText(stderr, response.stderr);
      return response.exitCode;
    } catch (error) {
      if (isNativeHookRelayDeadlineError(error))
        return writeNativeHookRelayDeadlineResponse({
          stdout,
          stderr,
          opts,
          provider,
          event,
          error,
        });
      writeText(stderr, formatRelayCliError("native hook relay unavailable", error));
      return writeNativeHookRelayUnavailableResponse({
        stdout,
        stderr,
        opts,
        provider,
        event,
      });
    }
  } finally {
    deadline.dispose();
  }
}
function readRequiredOption(value, name) {
  if (typeof value === "string" && value.trim()) return value.trim();
  throw new Error(`Missing required option --${name}`);
}
async function readStreamText(stream, maxBytes, deadline) {
  const chunks = [];
  let total = 0;
  const abortRead = () => {
    destroyReadableStream(stream, createNativeHookRelayDeadlineError(deadline));
  };
  deadline.signal.addEventListener("abort", abortRead, { once: true });
  try {
    throwIfNativeHookRelayDeadlineExpired(deadline);
    for await (const chunk of stream) {
      throwIfNativeHookRelayDeadlineExpired(deadline);
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      total += buffer.byteLength;
      if (total > maxBytes) throw new Error(`native hook input exceeds ${maxBytes} bytes`);
      chunks.push(buffer);
    }
    throwIfNativeHookRelayDeadlineExpired(deadline);
    return Buffer.concat(chunks, total).toString("utf8");
  } catch (error) {
    if (isNativeHookRelayDeadlineError(error) || deadline.signal.aborted)
      throw createNativeHookRelayDeadlineError(deadline);
    throw error;
  } finally {
    deadline.signal.removeEventListener("abort", abortRead);
  }
}
function writeText(stream, value) {
  if (value) stream.write(value);
}
function formatRelayCliError(prefix, error) {
  return `${prefix}: ${error instanceof Error ? error.message : String(error)}\n`;
}
function createNativeHookRelayDeadline(timeoutMs) {
  const controller = new AbortController();
  const timer = setSafeTimeout(() => controller.abort(), timeoutMs);
  timer.unref?.();
  return {
    expiresAtMs: Date.now() + timeoutMs,
    signal: controller.signal,
    timeoutMs,
    dispose: () => clearTimeout(timer),
  };
}
function createNativeHookRelayDeadlineError(deadline) {
  return new NativeHookRelayDeadlineError(deadline.timeoutMs);
}
function isNativeHookRelayDeadlineError(error) {
  return error instanceof Error && error.name === "NativeHookRelayDeadlineError";
}
function remainingNativeHookRelayDeadlineMs(deadline) {
  const remainingMs = deadline.expiresAtMs - Date.now();
  if (remainingMs <= 0 || deadline.signal.aborted)
    throw createNativeHookRelayDeadlineError(deadline);
  return Math.max(1, remainingMs);
}
function throwIfNativeHookRelayDeadlineExpired(deadline) {
  remainingNativeHookRelayDeadlineMs(deadline);
}
function destroyReadableStream(stream, error) {
  const destroy = stream.destroy;
  if (typeof destroy === "function") {
    destroy.call(stream, error);
    return;
  }
  stream.pause();
}
async function withNativeHookRelayDeadline(deadline, promise) {
  throwIfNativeHookRelayDeadlineExpired(deadline);
  return await new Promise((resolve, reject) => {
    const cleanup = () => deadline.signal.removeEventListener("abort", abort);
    const abort = () => {
      cleanup();
      reject(createNativeHookRelayDeadlineError(deadline));
    };
    deadline.signal.addEventListener("abort", abort, { once: true });
    promise.then(
      (value) => {
        cleanup();
        resolve(value);
      },
      (error) => {
        cleanup();
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}
function writeNativeHookRelayUnavailableResponse(params) {
  const response = renderNativeHookRelayUnavailableResponse({
    provider: params.provider,
    event: params.event,
    preToolUseUnavailable: params.opts.preToolUseUnavailable,
    message: params.message ?? "Native hook relay unavailable",
  });
  writeText(params.stdout, response.stdout);
  writeText(params.stderr, response.stderr);
  return response.exitCode;
}
function writeNativeHookRelayDeadlineResponse(params) {
  writeText(params.stderr, formatRelayCliError("native hook relay timed out", params.error));
  return writeNativeHookRelayUnavailableResponse({
    stdout: params.stdout,
    stderr: params.stderr,
    opts: params.opts,
    provider: params.provider,
    event: params.event,
    message: "Native hook relay timed out",
  });
}
//#endregion
//#region src/cli/hooks-cli.ts
function mergeHookEntries(pluginEntries, workspaceEntries) {
  return resolveHookEntries([...pluginEntries, ...workspaceEntries]);
}
function buildHooksReport(config) {
  const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
  const workspaceEntries = loadWorkspaceHookEntries(workspaceDir, { config });
  return buildWorkspaceHookStatus(workspaceDir, {
    config,
    entries: mergeHookEntries(
      buildPluginDiagnosticsReport({
        config,
        workspaceDir,
      }).hooks.map((hook) => hook.entry),
      workspaceEntries,
    ),
  });
}
function resolveHookForToggle(report, hookName, opts) {
  const hook = report.hooks.find((h) => h.name === hookName);
  if (!hook) throw new Error(`Hook "${hookName}" not found`);
  if (hook.managedByPlugin)
    throw new Error(
      `Hook "${hookName}" is managed by plugin "${hook.pluginId ?? "unknown"}" and cannot be enabled/disabled.`,
    );
  if (opts?.requireEligible && !hook.requirementsSatisfied)
    throw new Error(`Hook "${hookName}" is not eligible (missing requirements)`);
  return hook;
}
function buildConfigWithHookEnabled(params) {
  const entries = { ...params.config.hooks?.internal?.entries };
  entries[params.hookName] = {
    ...entries[params.hookName],
    enabled: params.enabled,
  };
  const internal = {
    ...params.config.hooks?.internal,
    ...(params.ensureHooksEnabled ? { enabled: true } : {}),
    entries,
  };
  return {
    ...params.config,
    hooks: {
      ...params.config.hooks,
      internal,
    },
  };
}
function formatHookStatus(hook) {
  if (hook.loadable) return theme.success("✓ ready");
  if (!hook.enabledByConfig) return theme.warn(decorativePrefix("⏸", "disabled"));
  return theme.error("✗ missing");
}
function formatHookName(hook) {
  const emoji = hook.emoji ?? decorativeEmoji("🔗");
  const name = theme.command(hook.name);
  return emoji ? `${emoji} ${name}` : name;
}
function formatHookSource(hook) {
  if (!hook.managedByPlugin) return hook.source;
  return `plugin:${hook.pluginId ?? "unknown"}`;
}
function formatHookMissingSummary(hook) {
  const missing = [];
  if (hook.missing.bins.length > 0) missing.push(`bins: ${hook.missing.bins.join(", ")}`);
  if (hook.missing.anyBins.length > 0) missing.push(`anyBins: ${hook.missing.anyBins.join(", ")}`);
  if (hook.missing.env.length > 0) missing.push(`env: ${hook.missing.env.join(", ")}`);
  if (hook.missing.config.length > 0) missing.push(`config: ${hook.missing.config.join(", ")}`);
  if (hook.missing.os.length > 0) missing.push(`os: ${hook.missing.os.join(", ")}`);
  return missing.join("; ");
}
function exitHooksCliWithError(err) {
  defaultRuntime.error(`${theme.error("Error:")} ${formatErrorMessage(err)}`);
  process.exit(1);
}
function writeHooksOutput(value, json) {
  if (json) {
    defaultRuntime.writeStdout(value);
    return;
  }
  defaultRuntime.log(value);
}
async function runHooksCliAction(action) {
  try {
    return await action();
  } catch (err) {
    return exitHooksCliWithError(err);
  }
}
async function runOneShotHooksCliAction(action) {
  const result = await runHooksCliAction(action);
  requestExitAfterOneShotOutput(defaultRuntime, typeof result === "number" ? result : 0);
}
/**
 * Format the hooks list output
 */
function formatHooksList(report, opts) {
  const hooks = opts.eligible ? report.hooks.filter((h) => h.loadable) : report.hooks;
  if (opts.json) {
    const jsonReport = {
      workspaceDir: report.workspaceDir,
      managedHooksDir: report.managedHooksDir,
      hooks: hooks.map((h) => ({
        name: h.name,
        description: h.description,
        emoji: h.emoji,
        eligible: h.loadable,
        disabled: !h.enabledByConfig,
        enabledByConfig: h.enabledByConfig,
        requirementsSatisfied: h.requirementsSatisfied,
        loadable: h.loadable,
        blockedReason: h.blockedReason,
        source: h.source,
        pluginId: h.pluginId,
        events: h.events,
        unknownEvents: h.unknownEvents,
        homepage: h.homepage,
        missing: h.missing,
        managedByPlugin: h.managedByPlugin,
      })),
    };
    return JSON.stringify(jsonReport, null, 2);
  }
  if (hooks.length === 0)
    return opts.eligible
      ? `No eligible hooks found. Run \`${formatCliCommand("openclaw hooks list")}\` to see all hooks.`
      : "No hooks found.";
  const eligible = hooks.filter((h) => h.loadable);
  const tableWidth = getTerminalTableWidth();
  const rows = hooks.map((hook) => {
    const missing = formatHookMissingSummary(hook);
    return {
      Status: formatHookStatus(hook),
      Hook: formatHookName(hook),
      Description: theme.muted(hook.description),
      Source: formatHookSource(hook),
      Missing: missing ? theme.warn(missing) : "",
    };
  });
  const columns = [
    {
      key: "Status",
      header: "Status",
      minWidth: 10,
    },
    {
      key: "Hook",
      header: "Hook",
      minWidth: 18,
      flex: true,
    },
    {
      key: "Description",
      header: "Description",
      minWidth: 24,
      flex: true,
    },
    {
      key: "Source",
      header: "Source",
      minWidth: 12,
      flex: true,
    },
  ];
  if (opts.verbose)
    columns.push({
      key: "Missing",
      header: "Missing",
      minWidth: 18,
      flex: true,
    });
  const lines = [];
  lines.push(
    `${theme.heading("Hooks")} ${theme.muted(`(${eligible.length}/${hooks.length} ready)`)}`,
  );
  lines.push(
    renderTable({
      width: tableWidth,
      columns,
      rows,
    }).trimEnd(),
  );
  return lines.join("\n");
}
/**
 * Format detailed info for a single hook
 */
function formatHookInfo(report, hookName, opts) {
  const hook = report.hooks.find((h) => h.name === hookName || h.hookKey === hookName);
  if (!hook) {
    if (opts.json)
      return JSON.stringify(
        {
          error: "not found",
          hook: hookName,
        },
        null,
        2,
      );
    return `Hook "${hookName}" not found. Run \`${formatCliCommand("openclaw hooks list")}\` to see available hooks.`;
  }
  if (opts.json)
    return JSON.stringify(
      {
        ...hook,
        eligible: hook.loadable,
        disabled: !hook.enabledByConfig,
      },
      null,
      2,
    );
  const lines = [];
  const emoji = hook.emoji ?? decorativeEmoji("🔗");
  const status = hook.loadable
    ? theme.success("✓ Ready")
    : !hook.enabledByConfig
      ? theme.warn(decorativePrefix("⏸", "Disabled"))
      : theme.error("✗ Missing requirements");
  lines.push(`${emoji ? `${emoji} ` : ""}${theme.heading(hook.name)} ${status}`);
  lines.push("");
  lines.push(hook.description);
  lines.push("");
  lines.push(theme.heading("Details:"));
  if (hook.managedByPlugin)
    lines.push(`${theme.muted("  Source:")} ${hook.source} (${hook.pluginId ?? "unknown"})`);
  else lines.push(`${theme.muted("  Source:")} ${hook.source}`);
  lines.push(`${theme.muted("  Path:")} ${shortenHomePath(hook.filePath)}`);
  lines.push(`${theme.muted("  Handler:")} ${shortenHomePath(hook.handlerPath)}`);
  if (hook.homepage) lines.push(`${theme.muted("  Homepage:")} ${hook.homepage}`);
  if (hook.events.length > 0) lines.push(`${theme.muted("  Events:")} ${hook.events.join(", ")}`);
  if (hook.unknownEvents.length > 0)
    lines.push(
      theme.warn(
        `  ⚠ Event${hook.unknownEvents.length === 1 ? "" : "s"} not emitted by core (likely typo): ${hook.unknownEvents.join(", ")}`,
      ),
    );
  if (hook.managedByPlugin)
    lines.push(theme.muted("  Managed by plugin; enable/disable via hooks CLI not available."));
  if (hook.blockedReason) lines.push(`${theme.muted("  Blocked reason:")} ${hook.blockedReason}`);
  if (
    hook.requirements.bins.length > 0 ||
    hook.requirements.anyBins.length > 0 ||
    hook.requirements.env.length > 0 ||
    hook.requirements.config.length > 0 ||
    hook.requirements.os.length > 0
  ) {
    lines.push("");
    lines.push(theme.heading("Requirements:"));
    if (hook.requirements.bins.length > 0) {
      const binsStatus = hook.requirements.bins.map((bin) => {
        return hook.missing.bins.includes(bin)
          ? theme.error(`✗ ${bin}`)
          : theme.success(`✓ ${bin}`);
      });
      lines.push(`${theme.muted("  Binaries:")} ${binsStatus.join(", ")}`);
    }
    if (hook.requirements.anyBins.length > 0) {
      const anyBinsStatus =
        hook.missing.anyBins.length > 0
          ? theme.error(`✗ (any of: ${hook.requirements.anyBins.join(", ")})`)
          : theme.success(`✓ (any of: ${hook.requirements.anyBins.join(", ")})`);
      lines.push(`${theme.muted("  Any binary:")} ${anyBinsStatus}`);
    }
    if (hook.requirements.env.length > 0) {
      const envStatus = hook.requirements.env.map((env) => {
        return hook.missing.env.includes(env) ? theme.error(`✗ ${env}`) : theme.success(`✓ ${env}`);
      });
      lines.push(`${theme.muted("  Environment:")} ${envStatus.join(", ")}`);
    }
    if (hook.requirements.config.length > 0) {
      const configStatus = hook.configChecks.map((check) => {
        return check.satisfied ? theme.success(`✓ ${check.path}`) : theme.error(`✗ ${check.path}`);
      });
      lines.push(`${theme.muted("  Config:")} ${configStatus.join(", ")}`);
    }
    if (hook.requirements.os.length > 0) {
      const osStatus =
        hook.missing.os.length > 0
          ? theme.error(`✗ (${hook.requirements.os.join(", ")})`)
          : theme.success(`✓ (${hook.requirements.os.join(", ")})`);
      lines.push(`${theme.muted("  OS:")} ${osStatus}`);
    }
  }
  return lines.join("\n");
}
/**
 * Format check output
 */
function formatHooksCheck(report, opts) {
  if (opts.json) {
    const eligible = report.hooks.filter((h) => h.loadable);
    const notEligible = report.hooks.filter((h) => !h.loadable);
    return JSON.stringify(
      {
        total: report.hooks.length,
        eligible: eligible.length,
        notEligible: notEligible.length,
        hooks: {
          eligible: eligible.map((h) => h.name),
          notEligible: notEligible.map((h) => ({
            name: h.name,
            blockedReason: h.blockedReason,
            missing: h.missing,
          })),
        },
      },
      null,
      2,
    );
  }
  const eligible = report.hooks.filter((h) => h.loadable);
  const notEligible = report.hooks.filter((h) => !h.loadable);
  const lines = [];
  lines.push(theme.heading("Hooks Status"));
  lines.push("");
  lines.push(`${theme.muted("Total hooks:")} ${report.hooks.length}`);
  lines.push(`${theme.success("Ready:")} ${eligible.length}`);
  lines.push(`${theme.warn("Not ready:")} ${notEligible.length}`);
  if (notEligible.length > 0) {
    lines.push("");
    lines.push(theme.heading("Hooks not ready:"));
    for (const hook of notEligible) {
      const reasons = [];
      if (hook.blockedReason && hook.blockedReason !== "missing requirements")
        reasons.push(hook.blockedReason);
      if (hook.missing.bins.length > 0) reasons.push(`bins: ${hook.missing.bins.join(", ")}`);
      if (hook.missing.anyBins.length > 0)
        reasons.push(`anyBins: ${hook.missing.anyBins.join(", ")}`);
      if (hook.missing.env.length > 0) reasons.push(`env: ${hook.missing.env.join(", ")}`);
      if (hook.missing.config.length > 0) reasons.push(`config: ${hook.missing.config.join(", ")}`);
      if (hook.missing.os.length > 0) reasons.push(`os: ${hook.missing.os.join(", ")}`);
      const emoji = hook.emoji ?? decorativeEmoji("🔗");
      lines.push(`  ${emoji ? `${emoji} ` : ""}${hook.name} - ${reasons.join("; ")}`);
    }
  }
  return lines.join("\n");
}
async function enableHook(hookName) {
  const snapshot = await readConfigFileSnapshot();
  const config = snapshot.sourceConfig ?? snapshot.config;
  const hook = resolveHookForToggle(buildHooksReport(config), hookName, { requireEligible: true });
  await replaceConfigFile({
    nextConfig: buildConfigWithHookEnabled({
      config,
      hookName,
      enabled: true,
      ensureHooksEnabled: true,
    }),
    ...(snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {}),
  });
  defaultRuntime.log(
    `${theme.success("✓")} Enabled hook: ${hook.emoji ? `${hook.emoji} ${theme.command(hookName)}` : decorativePrefix("🔗", theme.command(hookName))}`,
  );
}
async function disableHook(hookName) {
  const snapshot = await readConfigFileSnapshot();
  const config = snapshot.sourceConfig ?? snapshot.config;
  const hook = resolveHookForToggle(buildHooksReport(config), hookName);
  await replaceConfigFile({
    nextConfig: buildConfigWithHookEnabled({
      config,
      hookName,
      enabled: false,
    }),
    ...(snapshot.hash !== void 0 ? { baseHash: snapshot.hash } : {}),
  });
  defaultRuntime.log(
    `${theme.warn(decorativePrefix("⏸", "Disabled hook:"))} ${hook.emoji ? `${hook.emoji} ${theme.command(hookName)}` : decorativePrefix("🔗", theme.command(hookName))}`,
  );
}
function registerHooksCli(program) {
  const hooks = program
    .command("hooks")
    .description("Manage internal agent hooks")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/hooks", "docs.openclaw.ai/cli/hooks")}\n`,
    );
  hooks
    .command("list")
    .description("List all hooks")
    .option("--eligible", "Show only eligible hooks", false)
    .option("--json", "Output as JSON", false)
    .option("-v, --verbose", "Show more details including missing requirements", false)
    .action(async (opts) =>
      runOneShotHooksCliAction(async () => {
        writeHooksOutput(formatHooksList(buildHooksReport(getRuntimeConfig()), opts), opts.json);
      }),
    );
  hooks
    .command("info <name>")
    .description("Show detailed information about a hook")
    .option("--json", "Output as JSON", false)
    .action(async (name, opts) =>
      runOneShotHooksCliAction(async () => {
        writeHooksOutput(
          formatHookInfo(buildHooksReport(getRuntimeConfig()), name, opts),
          opts.json,
        );
      }),
    );
  hooks
    .command("check")
    .description("Check hooks eligibility status")
    .option("--json", "Output as JSON", false)
    .action(async (opts) =>
      runOneShotHooksCliAction(async () => {
        writeHooksOutput(formatHooksCheck(buildHooksReport(getRuntimeConfig()), opts), opts.json);
      }),
    );
  hooks
    .command("enable <name>")
    .description("Enable a hook")
    .action(async (name) =>
      runOneShotHooksCliAction(async () => {
        await enableHook(name);
      }),
    );
  hooks
    .command("disable <name>")
    .description("Disable a hook")
    .action(async (name) =>
      runOneShotHooksCliAction(async () => {
        await disableHook(name);
      }),
    );
  hooks
    .command("relay", { hidden: true })
    .description("Internal native harness hook relay")
    .requiredOption("--provider <provider>", "Native harness provider")
    .requiredOption("--relay-id <id>", "Native hook relay id")
    .option("--generation <generation>", "Native hook relay registration generation")
    .requiredOption("--event <event>", "Native hook event")
    .option(
      "--pre-tool-use-unavailable <mode>",
      "PreToolUse fallback mode when the originating relay is unavailable",
    )
    .option("--timeout <ms>", "Gateway timeout in ms", "5000")
    .action(async (opts) => runOneShotHooksCliAction(() => runNativeHookRelayCli(opts)));
  hooks
    .command("install")
    .description("Deprecated: install a hook pack via `openclaw plugins install`")
    .argument("<path-or-spec>", "Path to a hook pack or npm package spec")
    .option("-l, --link", "Link a local path instead of copying", false)
    .option("--pin", "Record npm installs as exact resolved <name>@<version>", false)
    .action(async (raw, opts) => {
      defaultRuntime.log(
        theme.warn("`openclaw hooks install` is deprecated; use `openclaw plugins install`."),
      );
      await runPluginInstallCommand({
        raw,
        opts,
        invalidateRuntimeCache: false,
      });
    });
  hooks
    .command("update")
    .description("Deprecated: update hook packs via `openclaw plugins update`")
    .argument("[id]", "Hook pack id (omit with --all)")
    .option("--all", "Update all tracked hooks", false)
    .option("--dry-run", "Show what would change without writing", false)
    .action(async (id, opts) => {
      defaultRuntime.log(
        theme.warn("`openclaw hooks update` is deprecated; use `openclaw plugins update`."),
      );
      await runPluginUpdateCommand({
        id,
        opts,
      });
    });
  hooks.action(async () =>
    runOneShotHooksCliAction(async () => {
      const report = buildHooksReport(getRuntimeConfig());
      defaultRuntime.log(formatHooksList(report, {}));
    }),
  );
}
//#endregion
export { formatHookInfo, formatHooksCheck, formatHooksList, registerHooksCli };
