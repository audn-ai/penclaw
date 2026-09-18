import { setTimeout } from "node:timers/promises";
import {
  g as isGatewayTransportError,
  o as buildGatewayConnectionDetails,
} from "./call-BVMO6az_.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { d as readConnectPairingRequiredMessage } from "./connect-error-details-BxqBqDDT.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DpocbsVi.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as readConfiguredLogTail } from "./log-tail-DCUXlFWQ.js";
import { f as formatTimestamp } from "./logger-BUux_Jpv.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import {
  D as resolveIntegerOption,
  b as parseStrictPositiveInteger,
} from "./number-coercion-CJQ8TR--.js";
import { t as parseLogLine } from "./parse-log-line-nekpsHRk.js";
import { t as clearActiveProgressLine } from "./progress-line-DiTuCPbL.js";
import "./backoff-Z63_cX9p.js";
import { f as resolveRedactOptions, s as redactSensitiveLines } from "./redact-CUe6Oey5.js";
import { n as computeBackoff } from "./src-Dqmh2693.js";
import { t as createSafeStreamWriter } from "./stream-writer-L0h9wG4J.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { n as isRich, r as theme, t as colorize } from "./theme-vjDs9tao.js";
//#region src/cli/logs-cli.ts
async function loadLogsCliRuntime() {
  return await import("./logs-cli.runtime.js");
}
const LOCAL_FALLBACK_NOTICE = "Local Gateway RPC unavailable; reading configured file log instead.";
const JOURNAL_FALLBACK_NOTICE =
  "Local Gateway RPC unavailable; reading active systemd gateway journal instead.";
const JOURNAL_CURSOR_PREFIX = "-- cursor: ";
const JOURNAL_MAX_LIMIT = 5e3;
const JOURNAL_MAX_BYTES = 1e6;
function parsePositiveInt(value, fallback, flag) {
  if (!value) return fallback;
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
  return parsed;
}
function normalizeLogTailPayloadSource(payload) {
  if (payload.sourceKind || !payload.file) return payload;
  return {
    ...payload,
    sourceKind: "file",
  };
}
function buildLogSourceIdentity(payload) {
  const sourceKind = payload.sourceKind ?? (payload.file ? "file" : void 0);
  if (!sourceKind && !payload.file && !payload.source) return;
  const identity = {
    file: payload.file,
    source: payload.source,
    sourceKind,
    servicePid: payload.service?.pid,
    serviceUnit: payload.service?.unit,
    localFallback: payload.localFallback === true ? true : void 0,
  };
  return JSON.stringify(identity);
}
function buildLogMetaRecord(payload) {
  return {
    type: "meta",
    file: payload.file,
    source: payload.source,
    sourceKind: payload.sourceKind ?? (payload.file ? "file" : void 0),
    service: payload.service,
    cursor: payload.cursor,
    size: payload.size,
    localFallback: payload.localFallback === true ? true : void 0,
  };
}
async function fetchGatewayLogs(opts, gatewayCursor, showProgress, params) {
  const gatewayExtra = buildLogsTailGatewayExtra(opts, showProgress);
  const payload = await callGatewayFromCli(
    "logs.tail",
    opts,
    {
      cursor: gatewayCursor,
      limit: params.limit,
      maxBytes: params.maxBytes,
    },
    params.signal
      ? {
          ...gatewayExtra,
          signal: params.signal,
        }
      : gatewayExtra,
  );
  if (!payload || typeof payload !== "object") throw new Error("Unexpected logs.tail response");
  return payload;
}
async function fetchLogs(opts, cursors, showProgress, params) {
  const { limit, maxBytes } = params;
  try {
    return await fetchGatewayLogs(opts, cursors.gateway, showProgress, params);
  } catch (error) {
    if (!shouldUseLocalLogsFallback(opts, error)) throw error;
    if (opts.follow) {
      const journalPayload = await readSystemdJournalFallback({
        cursor: cursors.journal,
        since: cursors.journalSince,
        limit,
        maxBytes,
      });
      if (journalPayload) return journalPayload;
      throw error;
    }
    return {
      ...(await readConfiguredLogTail({
        cursor: cursors.gateway,
        limit,
        maxBytes,
      })),
      sourceKind: "file",
      localFallback: true,
    };
  }
}
function normalizeErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return String(error);
}
function normalizeError(error) {
  return error instanceof Error ? error : new Error(String(error));
}
function shouldUseLocalLogsFallback(opts, error) {
  if (!isLocalGatewayRpcUnavailableError(error)) return false;
  if (typeof opts.url === "string" && opts.url.trim().length > 0) return false;
  return isImplicitLoopbackGatewayConnection(
    isGatewayTransportError(error) ? error.connectionDetails : buildGatewayConnectionDetails(),
  );
}
function buildLogsTailGatewayExtra(opts, showProgress) {
  const base = { progress: showProgress };
  if (!shouldUsePassiveLocalLogsClient(opts)) return base;
  return {
    ...base,
    clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
    mode: GATEWAY_CLIENT_MODES.BACKEND,
    deviceIdentity: null,
  };
}
function shouldUsePassiveLocalLogsClient(opts) {
  if (typeof opts.url === "string" && opts.url.trim().length > 0) return false;
  return isImplicitLoopbackGatewayConnection(buildGatewayConnectionDetails());
}
function isImplicitLoopbackGatewayConnection(connection) {
  if (connection.urlSource !== "local loopback") return false;
  try {
    return isLoopbackHost(new URL(connection.url).hostname);
  } catch {
    return false;
  }
}
function isLocalGatewayRpcUnavailableError(error) {
  if (isGatewayTransportError(error)) return error.kind === "closed" || error.kind === "timeout";
  const message = normalizeLowercaseStringOrEmpty(normalizeErrorMessage(error));
  if (readConnectPairingRequiredMessage(message)) return true;
  return isPlainGatewayRequestCloseError(message) || isPlainGatewayRequestTimeoutError(message);
}
function isPlainGatewayRequestCloseError(message) {
  return message.startsWith("gateway closed (");
}
function isPlainGatewayRequestTimeoutError(message) {
  return /^gateway timeout after \d+ms\b/u.test(message);
}
async function readSystemdJournalFallback(params) {
  if (process.platform !== "linux") return null;
  const runtime = await loadLogsCliRuntime();
  const service = await runtime.readSystemdServiceRuntime(process.env);
  if (service.status !== "running" || typeof service.pid !== "number") return null;
  const limit = resolveIntegerOption(params.limit, 1, {
    min: 1,
    max: JOURNAL_MAX_LIMIT,
  });
  const maxBytes = resolveIntegerOption(params.maxBytes, 1, {
    min: 1,
    max: JOURNAL_MAX_BYTES,
  });
  const unitName = resolveLogsSystemdUnitName(runtime, process.env);
  const source = `journalctl --user --boot --user-unit=${unitName} _PID=${service.pid}`;
  const args = [
    "--user",
    "--boot",
    `--user-unit=${unitName}`,
    `_PID=${service.pid}`,
    "--no-pager",
    "--output=cat",
    "--show-cursor",
  ];
  if (typeof params.cursor === "string" && params.cursor.trim().length > 0)
    args.push(`--after-cursor=${params.cursor}`);
  else if (params.since) args.push(`--since=${params.since}`);
  else args.push("-n", String(limit));
  const result = await runtime.execFileUtf8Tail("journalctl", args, {
    env: process.env,
    maxBytes,
  });
  if (result.code !== 0) return null;
  const boundedOutput = normalizeTailText(result.stdout, result.truncated);
  const parsed = parseJournalctlOutput(boundedOutput.text);
  const lines = parsed.lines.length > limit ? parsed.lines.slice(-limit) : parsed.lines;
  const redaction = resolveRedactOptions();
  return {
    source,
    sourceKind: "journal",
    service: {
      pid: service.pid,
      unit: unitName,
    },
    cursor: parsed.cursor ?? params.cursor,
    lines: redactSensitiveLines(lines, redaction),
    truncated: boundedOutput.truncated || parsed.lines.length > limit,
    localFallback: true,
  };
}
function normalizeTailText(text, truncated) {
  if (!truncated)
    return {
      text,
      truncated,
    };
  const firstNewline = text.indexOf("\n");
  if (firstNewline < 0)
    return {
      text: "",
      truncated,
    };
  return {
    text: text.slice(firstNewline + 1),
    truncated,
  };
}
function parseJournalctlOutput(output) {
  const lines = [];
  let cursor;
  for (const rawLine of output.split(/\r?\n/u)) {
    if (!rawLine) continue;
    if (rawLine.startsWith(JOURNAL_CURSOR_PREFIX)) {
      cursor = rawLine.slice(11).trim() || cursor;
      continue;
    }
    lines.push(rawLine);
  }
  return {
    lines,
    cursor,
  };
}
function resolveLogsSystemdUnitName(runtime, env) {
  const override = env.OPENCLAW_SYSTEMD_UNIT?.trim();
  if (override) return override.endsWith(".service") ? override : `${override}.service`;
  return `${runtime.resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
}
const MAX_FOLLOW_RETRIES = 8;
const FOLLOW_BACKOFF_POLICY = {
  initialMs: 1e3,
  maxMs: 3e4,
  factor: 2,
  jitter: 0.2,
};
function isTransientFollowError(error) {
  if (isGatewayTransportError(error)) {
    if (error.kind === "timeout") return true;
    const code = error.code ?? 0;
    return code !== 1008 && !(code >= 4e3 && code <= 4999);
  }
  const message = normalizeLowercaseStringOrEmpty(normalizeErrorMessage(error));
  if (readConnectPairingRequiredMessage(message)) return false;
  return isPlainGatewayRequestCloseError(message) || isPlainGatewayRequestTimeoutError(message);
}
function formatLogTimestamp(value, mode = "plain", localTime = true) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  if (mode === "pretty")
    return formatTimestamp(parsed, {
      style: "short",
      timeZone: localTime ? void 0 : "UTC",
    });
  return localTime ? formatTimestamp(parsed, { style: "long" }) : parsed.toISOString();
}
function formatLogLine(raw, opts) {
  const parsed = parseLogLine(raw);
  if (!parsed) return raw;
  const label = parsed.subsystem ?? parsed.module ?? "";
  const time = formatLogTimestamp(parsed.time, opts.pretty ? "pretty" : "plain", opts.localTime);
  const level = parsed.level ?? "";
  const levelLabel = level.padEnd(5).trim();
  const message = parsed.message || parsed.raw;
  if (!opts.pretty) return [time, level, label, message].filter(Boolean).join(" ").trim();
  const timeLabel = colorize(opts.rich, theme.muted, time);
  const labelValue = colorize(opts.rich, theme.accent, label);
  const levelValue =
    level === "error" || level === "fatal"
      ? colorize(opts.rich, theme.error, levelLabel)
      : level === "warn"
        ? colorize(opts.rich, theme.warn, levelLabel)
        : level === "debug" || level === "trace"
          ? colorize(opts.rich, theme.muted, levelLabel)
          : colorize(opts.rich, theme.info, levelLabel);
  const messageValue =
    level === "error" || level === "fatal"
      ? colorize(opts.rich, theme.error, message)
      : level === "warn"
        ? colorize(opts.rich, theme.warn, message)
        : level === "debug" || level === "trace"
          ? colorize(opts.rich, theme.muted, message)
          : colorize(opts.rich, theme.info, message);
  return [[timeLabel, levelValue, labelValue].filter(Boolean).join(" "), messageValue]
    .filter(Boolean)
    .join(" ")
    .trim();
}
function createLogWriters(onOutputClosed) {
  const writer = createSafeStreamWriter({
    beforeWrite: () => clearActiveProgressLine(),
    onBrokenPipe: (err, stream) => {
      onOutputClosed?.();
      const code = err.code ?? "EPIPE";
      const message = `openclaw logs: output ${stream === process.stdout ? "stdout" : "stderr"} closed (${code}). Stopping tail.`;
      try {
        clearActiveProgressLine();
        process.stderr.write(`${message}\n`);
      } catch {}
    },
  });
  return {
    logLine: (text) => writer.writeLine(process.stdout, text),
    errorLine: (text) => writer.writeLine(process.stderr, text),
    emitJsonLine: (payload, toStdErr = false) =>
      writer.write(toStdErr ? process.stderr : process.stdout, `${JSON.stringify(payload)}\n`),
  };
}
async function emitGatewayError(err, opts, mode, rich, emitJsonLine, errorLine) {
  const message = "Gateway not reachable. Is it running and accessible?";
  const hint = `Hint: run \`${formatCliCommand("openclaw doctor")}\`.`;
  const errorText = formatErrorMessage(err);
  const details = buildGatewayConnectionDetails({ url: opts.url });
  if (mode === "json") {
    if (
      !emitJsonLine(
        {
          type: "error",
          message,
          error: errorText,
          details,
          hint,
        },
        true,
      )
    )
      return;
    return;
  }
  if (!errorLine(colorize(rich, theme.error, message))) return;
  if (!errorLine(details.message)) return;
  errorLine(colorize(rich, theme.muted, hint));
}
function registerLogsCli(program) {
  const logs = program
    .command("logs")
    .description("Tail gateway file logs via RPC")
    .option("--limit <n>", "Max lines to return", "200")
    .option("--max-bytes <n>", "Max bytes to read", "250000")
    .option("--follow", "Follow log output", false)
    .option("--interval <ms>", "Polling interval in ms", "1000")
    .option("--json", "Emit JSON log lines", false)
    .option("--plain", "Plain text output (no ANSI styling)", false)
    .option("--no-color", "Disable ANSI colors")
    .option("--local-time", "Display timestamps in local timezone (default)", false)
    .option("--utc", "Display timestamps in UTC", false)
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/logs", "docs.openclaw.ai/cli/logs")}\n`,
    );
  addGatewayClientOptions(logs);
  logs.action(async (opts) => {
    let gatewayRecovery = { kind: "idle" };
    const abortGatewayRecoveryProbe = () => {
      if (gatewayRecovery.kind === "probing") {
        gatewayRecovery.abortController.abort();
        gatewayRecovery = { kind: "idle" };
      }
    };
    const clearConsumedGatewayRecovery = (promise, result) => {
      const isMatchingProbe =
        gatewayRecovery.kind === "probing" && gatewayRecovery.promise === promise;
      const isMatchingResult =
        gatewayRecovery.kind === "settled" && gatewayRecovery.result === result;
      if (isMatchingProbe || isMatchingResult) gatewayRecovery = { kind: "idle" };
    };
    const { logLine, errorLine, emitJsonLine } = createLogWriters(abortGatewayRecoveryProbe);
    const interval = parsePositiveInt(opts.interval, 1e3, "--interval");
    const limit = parsePositiveInt(opts.limit, 200, "--limit");
    const maxBytes = parsePositiveInt(opts.maxBytes, 25e4, "--max-bytes");
    let gatewayCursor;
    let journalCursor;
    let journalSince;
    let preferJournal = false;
    let first = true;
    let lastSourceIdentity;
    const jsonMode = Boolean(opts.json);
    const pretty = !jsonMode && process.stdout.isTTY && !opts.plain;
    const rich = isRich() && opts.color !== false;
    const localTime = !opts.utc;
    const startGatewayRecoveryProbe = () => {
      if (!preferJournal || gatewayRecovery.kind !== "idle") return;
      const startedAt = /* @__PURE__ */ new Date().toISOString();
      const abortController = new AbortController();
      const promise = fetchGatewayLogs(opts, gatewayCursor, false, {
        limit,
        maxBytes,
        signal: abortController.signal,
      }).then(
        (payload) => ({
          ok: true,
          payload,
          startedAt,
        }),
        (error) => ({
          ok: false,
          error,
        }),
      );
      gatewayRecovery = {
        kind: "probing",
        promise,
        abortController,
      };
      promise.then((result) => {
        if (gatewayRecovery.kind === "probing" && gatewayRecovery.promise === promise)
          gatewayRecovery = {
            kind: "settled",
            result,
          };
      });
    };
    const readJournalWhileProbingRecovery = async () => {
      let fallbackError;
      if (gatewayRecovery.kind === "settled") {
        const result = gatewayRecovery.result;
        gatewayRecovery = { kind: "idle" };
        if (result.ok)
          return {
            payload: result.payload,
            gatewayPollStartedAt: result.startedAt,
          };
        if (!shouldUseLocalLogsFallback(opts, result.error)) throw normalizeError(result.error);
        fallbackError = normalizeError(result.error);
      }
      const activeProbe = gatewayRecovery.kind === "probing" ? gatewayRecovery.promise : void 0;
      const journalPayload = await readSystemdJournalFallback({
        cursor: journalCursor,
        since: journalSince,
        limit,
        maxBytes,
      });
      if (journalPayload) return { payload: journalPayload };
      if (activeProbe) {
        const result = await activeProbe;
        clearConsumedGatewayRecovery(activeProbe, result);
        if (result.ok)
          return {
            payload: result.payload,
            gatewayPollStartedAt: result.startedAt,
          };
        throw normalizeError(result.error);
      }
      throw (
        fallbackError ??
        /* @__PURE__ */ new Error("Active systemd journal unavailable for logs follow")
      );
    };
    let followRetryAttempt = 0;
    while (true) {
      let payload;
      const showProgress = first && !opts.follow;
      let gatewayPollStartedAt = /* @__PURE__ */ new Date().toISOString();
      try {
        if (preferJournal) {
          startGatewayRecoveryProbe();
          const result = await readJournalWhileProbingRecovery();
          payload = result.payload;
          gatewayPollStartedAt = result.gatewayPollStartedAt ?? gatewayPollStartedAt;
        } else
          payload = await fetchLogs(
            opts,
            {
              gateway: gatewayCursor,
              journal: journalCursor,
              journalSince,
            },
            showProgress,
            {
              limit,
              maxBytes,
            },
          );
      } catch (err) {
        if (opts.follow && followRetryAttempt < MAX_FOLLOW_RETRIES && isTransientFollowError(err)) {
          followRetryAttempt += 1;
          const backoffMs = computeBackoff(FOLLOW_BACKOFF_POLICY, followRetryAttempt);
          const message = `[logs] gateway disconnected, reconnecting in ${Math.round(backoffMs / 1e3)}s...`;
          if (jsonMode) {
            if (
              !emitJsonLine(
                {
                  type: "notice",
                  message,
                },
                true,
              )
            )
              return;
          } else if (!errorLine(colorize(rich, theme.warn, message))) return;
          await setTimeout(backoffMs);
          continue;
        }
        await emitGatewayError(
          err,
          opts,
          jsonMode ? "json" : "text",
          rich,
          emitJsonLine,
          errorLine,
        );
        process.exit(1);
        return;
      }
      if (followRetryAttempt > 0) {
        const message = "[logs] gateway reconnected";
        if (jsonMode) {
          if (
            !emitJsonLine(
              {
                type: "notice",
                message,
              },
              true,
            )
          )
            return;
        } else if (!errorLine(colorize(rich, theme.muted, message))) return;
      }
      followRetryAttempt = 0;
      payload = normalizeLogTailPayloadSource(payload);
      const sourceIdentity = buildLogSourceIdentity(payload);
      const shouldEmitSourceMetadata =
        first || (sourceIdentity !== void 0 && sourceIdentity !== lastSourceIdentity);
      const lines = Array.isArray(payload.lines) ? payload.lines : [];
      if (jsonMode) {
        if (shouldEmitSourceMetadata) {
          if (!emitJsonLine(buildLogMetaRecord(payload))) return;
        }
        for (const line of lines) {
          const parsed = parseLogLine(line);
          if (parsed) {
            if (
              !emitJsonLine({
                type: "log",
                ...parsed,
              })
            )
              return;
          } else if (
            !emitJsonLine({
              type: "raw",
              raw: line,
            })
          )
            return;
        }
        if (payload.truncated) {
          if (
            !emitJsonLine({
              type: "notice",
              message: "Log tail truncated (increase --max-bytes).",
            })
          )
            return;
        }
        if (payload.reset) {
          if (
            !emitJsonLine({
              type: "notice",
              message: "Log cursor reset (file rotated).",
            })
          )
            return;
        }
      } else {
        if (shouldEmitSourceMetadata && payload.localFallback === true) {
          const notice =
            payload.sourceKind === "journal" ? JOURNAL_FALLBACK_NOTICE : LOCAL_FALLBACK_NOTICE;
          if (!errorLine(colorize(rich, theme.warn, notice))) return;
        }
        if (shouldEmitSourceMetadata) {
          if (payload.sourceKind === "journal" && payload.source) {
            if (
              !logLine(
                `${pretty ? colorize(rich, theme.muted, "Log source:") : "Log source:"} ${payload.source}`,
              )
            )
              return;
            if (payload.service?.pid !== void 0 && !logLine(`Service PID: ${payload.service.pid}`))
              return;
            if (payload.service?.unit && !logLine(`Service Unit: ${payload.service.unit}`)) return;
          } else if (payload.file) {
            if (
              !logLine(
                `${pretty ? colorize(rich, theme.muted, "Log file:") : "Log file:"} ${payload.file}`,
              )
            )
              return;
          }
        }
        for (const line of lines)
          if (
            !logLine(
              formatLogLine(line, {
                pretty,
                rich,
                localTime,
              }),
            )
          )
            return;
        if (payload.truncated) {
          if (!errorLine("Log tail truncated (increase --max-bytes).")) return;
        }
        if (payload.reset) {
          if (!errorLine("Log cursor reset (file rotated).")) return;
        }
      }
      if (payload.sourceKind === "journal") {
        preferJournal = true;
        if (typeof payload.cursor === "string" && payload.cursor.trim().length > 0)
          journalCursor = payload.cursor;
        startGatewayRecoveryProbe();
      } else {
        preferJournal = false;
        gatewayRecovery = { kind: "idle" };
        if (typeof payload.cursor === "number" && Number.isFinite(payload.cursor)) {
          gatewayCursor = payload.cursor;
          if (opts.follow) {
            journalCursor = void 0;
            journalSince = gatewayPollStartedAt;
          }
        } else if (typeof payload.cursor === "string" && payload.cursor.trim().length > 0)
          journalCursor = payload.cursor;
      }
      if (sourceIdentity !== void 0) lastSourceIdentity = sourceIdentity;
      first = false;
      if (!opts.follow) return;
      await setTimeout(interval);
    }
  });
}
//#endregion
export { formatLogTimestamp, registerLogsCli };
