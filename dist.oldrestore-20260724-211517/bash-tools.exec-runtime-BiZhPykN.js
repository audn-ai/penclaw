import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  f as markExited,
  m as tail,
  n as appendOutput,
  r as createSessionSlug,
  t as addSession,
} from "./bash-process-registry-DQZTRcsj.js";
import {
  c as readEnvInt,
  i as clampWithDefault,
  r as chunkString,
  t as buildDockerExecArgs,
} from "./bash-tools.shared-BjYufFPv.js";
import { o as normalizeDeliveryContext } from "./delivery-context.shared-WPZGmi9R.js";
import { n as emitDiagnosticEvent } from "./diagnostic-events-5-gsFhkM.js";
import {
  i as scopedHeartbeatWakeOptionsForPolicy,
  t as resolveEventSessionKeyForPolicy,
} from "./event-session-routing-zOSuMGLJ.js";
import {
  V as resolveExecApprovalAllowedDecisions,
  r as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS,
} from "./exec-approvals-Bz218bS2.js";
import { o as requestHeartbeat } from "./heartbeat-wake-B-63db0Y.js";
import { t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { t as formatFencedCodeBlock } from "./markdown-code-Buzx6wvi.js";
import {
  a as removePathPrepend,
  n as findPathKey,
  r as mergePathPrepend,
} from "./path-prepend-CSea97Kz.js";
import "./bash-tools.schemas-DTbbXMLb.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { a as isSubagentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { o as sanitizeBinaryOutput, r as getShellConfig } from "./shell-utils-MIUiOyvx.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { t as getProcessSupervisor } from "./supervisor-BdR4bacv.js";
import { a as enqueueSystemEvent } from "./system-events-CIAdjAwz.js";
import { s as resolveSafeTimeoutDelayMs } from "./timeouts-Dewo7BbT.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/bash-tools.exec-output.ts
/**
 * Rendering helpers for exec output/status updates.
 * Keeps no-output placeholders and warning placement consistent across exec
 * progress, polling, and completion surfaces.
 */
const EXEC_NO_OUTPUT_PLACEHOLDER = "(no output)";
/** Render command output with a stable placeholder for empty output. */
function renderExecOutputText(value) {
  return value || EXEC_NO_OUTPUT_PLACEHOLDER;
}
/** Render the text shown in exec progress updates, including warnings first. */
function renderExecUpdateText(params) {
  return (
    (params.warnings.length ? `${params.warnings.join("\n")}\n\n` : "") +
    renderExecOutputText(params.tailText)
  );
}
//#endregion
//#region src/agents/pty-dsr.ts
const DSR_PATTERN = new RegExp(`${String.fromCharCode(27)}\\[\\??6n`, "g");
/** Removes terminal device-status-report cursor requests and counts them. */
function stripDsrRequests(input) {
  let requests = 0;
  return {
    cleaned: input.replace(DSR_PATTERN, () => {
      requests += 1;
      return "";
    }),
    requests,
  };
}
/** Builds a terminal cursor-position response for intercepted DSR requests. */
function buildCursorPositionResponse(row = 1, col = 1) {
  return `\x1b[${row};${col}R`;
}
//#endregion
//#region src/agents/shell-snapshot.ts
/**
 * Login-shell environment snapshot capture.
 *
 * Caches safe shell-derived environment variables while filtering secrets and stale snapshots.
 */
const SNAPSHOT_VERSION = 1;
const SNAPSHOT_REFRESH_MS = 300 * 1e3;
const SNAPSHOT_MAX_AGE_MS = 4320 * 60 * 1e3;
const CAPTURE_MARKER = "__OPENCLAW_SHELL_SNAPSHOT_CAPTURE__";
const ENV_MARKER = "__OPENCLAW_SHELL_SNAPSHOT_ENV__";
const EXEC_SHELL_SNAPSHOT_ENV = "OPENCLAW_EXEC_SHELL_SNAPSHOT";
const VALID_ENV_NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;
const SNAPSHOT_SHELLS = /* @__PURE__ */ new Set(["bash", "zsh"]);
const SNAPSHOT_DISABLE_VALUES = /* @__PURE__ */ new Set(["0", "false", "no", "off"]);
const SAFE_ENV_NAMES = /* @__PURE__ */ new Set([
  "ASDF_DIR",
  "BUN_INSTALL",
  "CARGO_HOME",
  "CDPATH",
  "GOPATH",
  "GOROOT",
  "GOENV_ROOT",
  "HOMEBREW_CELLAR",
  "HOMEBREW_PREFIX",
  "HOMEBREW_REPOSITORY",
  "INFOPATH",
  "MANPATH",
  "NVM_DIR",
  "PATH",
  "PNPM_HOME",
  "PYENV_ROOT",
  "RBENV_ROOT",
  "RUSTUP_HOME",
  "VOLTA_HOME",
]);
const CAPTURE_ENV_NAMES = /* @__PURE__ */ new Set([
  ...SAFE_ENV_NAMES,
  "HOME",
  "OPENCLAW_SHELL",
  "SHELL",
  "USERPROFILE",
  "ZDOTDIR",
]);
const SECRET_ENV_PATTERN = /(secret|token|password|passwd|credential|cookie|session|auth|key)/i;
const SECRET_SHELL_STATE_PATTERNS = [
  /\b(authorization|api[_-]?key|access[_-]?token|refresh[_-]?token|secret|password|passwd|credential)\b\s*[:=]/i,
  /\b[A-Z][A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PASSWD|CREDENTIAL|API_KEY|ACCESS_KEY|SESSION)[A-Z0-9_]*\s*[:=]/,
  /\b(GITHUB_TOKEN|OPENAI_API_KEY|ANTHROPIC_API_KEY|GOOGLE_API_KEY|GEMINI_API_KEY)\b/,
  /\b(ghp_|github_pat_|sk-[A-Za-z0-9]|xox[baprs]-|ya29\.|AIza[0-9A-Za-z_-]|AKIA[0-9A-Z]{16})/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
];
const snapshotCache = /* @__PURE__ */ new Map();
let cleanupPromise = null;
async function maybeWrapCommandWithShellSnapshot(opts) {
  if (
    process.platform === "win32" ||
    isExecShellSnapshotDisabled(process.env) ||
    !isSupportedSnapshotShell(opts.shell, opts.shellArgs)
  )
    return opts.command;
  try {
    const snapshot = await getOrCreateShellSnapshot(opts);
    return snapshot
      ? buildSnapshotWrappedCommand(
          opts.command,
          snapshot.path,
          buildRuntimeEnvRestoreScript(opts.env),
        )
      : opts.command;
  } catch {
    return opts.command;
  }
}
function resolveShellSnapshotDir(env = process.env) {
  return path.join(resolveStateDir(env), "cache", "shell-snapshots");
}
function isSupportedSnapshotShell(shell, shellArgs) {
  return shellArgs.includes("-c") && SNAPSHOT_SHELLS.has(path.basename(shell));
}
function isExecShellSnapshotDisabled(env) {
  const value = env[EXEC_SHELL_SNAPSHOT_ENV]?.trim().toLowerCase();
  return Boolean(value && SNAPSHOT_DISABLE_VALUES.has(value));
}
async function getOrCreateShellSnapshot(opts) {
  const key = buildSnapshotKey(opts);
  const cached = snapshotCache.get(key);
  const now = Date.now();
  if (cached && now - cached.createdAtMs < SNAPSHOT_REFRESH_MS) return await cached.promise;
  const created = createShellSnapshot(opts, key, { forceRefresh: Boolean(cached) });
  snapshotCache.set(key, {
    createdAtMs: now,
    promise: created,
  });
  return await created;
}
function buildSnapshotKey(opts) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        version: SNAPSHOT_VERSION,
        shell: opts.shell,
        shellArgs: opts.shellArgs,
        cwd: path.resolve(opts.cwd),
        home: getTrustedShellHome(),
        stateDir: resolveStateDir(process.env),
        env: buildSafeEnvSignature(process.env),
        startup: buildStartupSignature(opts.shell),
      }),
    )
    .digest("hex");
}
function buildSafeEnvSignature(env) {
  return [...SAFE_ENV_NAMES].toSorted().map((key) => [key, env[key] ?? null]);
}
function buildStartupSignature(shell) {
  const shellName = path.basename(shell);
  const home = getTrustedShellHome();
  const zdotdir = process.env.ZDOTDIR?.trim() || home;
  return (
    shellName === "zsh"
      ? [path.join(zdotdir, ".zshrc")]
      : shellName === "bash"
        ? [path.join(home, ".bashrc")]
        : []
  ).map((candidate) => {
    try {
      const stat = statSync(candidate);
      return [candidate, stat.mtimeMs, stat.size];
    } catch {
      return [candidate, null];
    }
  });
}
function getTrustedShellHome() {
  return process.env.HOME ?? process.env.USERPROFILE ?? os.homedir();
}
async function createShellSnapshot(opts, key, options) {
  const snapshotDir = resolveShellSnapshotDir(process.env);
  await fs$1.mkdir(snapshotDir, {
    recursive: true,
    mode: 448,
  });
  cleanupPromise ??= cleanupStaleSnapshots(snapshotDir);
  const snapshotPath = path.join(snapshotDir, `${key}.sh`);
  if (
    options?.forceRefresh !== true &&
    (await isFreshSnapshot(snapshotPath)) &&
    (await validateSnapshot(opts, snapshotPath))
  )
    return { path: snapshotPath };
  const capture = await captureShellSnapshot(opts);
  if (!capture) return null;
  const tmpPath = path.join(snapshotDir, `${key}.${process.pid}.${Date.now()}.tmp`);
  await fs$1.writeFile(tmpPath, capture, {
    encoding: "utf8",
    mode: 384,
  });
  await fs$1.chmod(tmpPath, 384);
  if (!(await validateSnapshot(opts, tmpPath))) {
    await fs$1.rm(tmpPath, { force: true });
    return null;
  }
  await fs$1.rename(tmpPath, snapshotPath);
  await fs$1.chmod(snapshotPath, 384);
  return { path: snapshotPath };
}
async function isFreshSnapshot(snapshotPath) {
  try {
    const stat = await fs$1.stat(snapshotPath);
    return Date.now() - stat.mtimeMs < SNAPSHOT_REFRESH_MS;
  } catch {
    return false;
  }
}
async function validateSnapshot(opts, snapshotPath) {
  try {
    await fs$1.access(snapshotPath);
  } catch {
    return false;
  }
  return (
    (
      await runShell({
        shell: opts.shell,
        shellArgs: opts.shellArgs,
        cwd: opts.cwd,
        env: buildTrustedSnapshotCaptureEnv(opts.env),
        command: `. ${shQuote(snapshotPath)} >/dev/null 2>&1`,
        timeoutMs: 2e3,
      })
    ).status === 0
  );
}
async function captureShellSnapshot(opts) {
  const shellName = path.basename(opts.shell);
  const captureOutputDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-shell-snapshot-"));
  await fs$1.chmod(captureOutputDir, 448);
  const captureOutputPath = path.join(captureOutputDir, "snapshot.out");
  await (await fs$1.open(captureOutputPath, "wx", 384)).close();
  const captureCommand = [
    "{",
    buildStartupSourceScript(shellName),
    `printf '\\n%s\\n' ${shQuote(CAPTURE_MARKER)}`,
    buildAliasCaptureScript(shellName),
    "(typeset -f 2>/dev/null || declare -f 2>/dev/null || true)",
    `printf '\\n%s\\n' ${shQuote(ENV_MARKER)}`,
    `${shQuote(process.execPath)} -e ${shQuote(ENV_CAPTURE_NODE_SCRIPT)}`,
    `} > ${shQuote(captureOutputPath)}`,
  ].join("\n");
  try {
    if (
      (
        await runShell({
          shell: opts.shell,
          shellArgs: buildCaptureShellArgs(shellName, opts.shellArgs),
          cwd: opts.cwd,
          env: buildTrustedSnapshotCaptureEnv(opts.env),
          command: captureCommand,
          timeoutMs: 5e3,
        })
      ).status !== 0
    )
      return null;
    return buildSnapshotFile(await fs$1.readFile(captureOutputPath, "utf8"));
  } finally {
    await fs$1.rm(captureOutputDir, {
      force: true,
      recursive: true,
    });
  }
}
function buildCaptureShellArgs(shellName, shellArgs) {
  if (shellName === "bash") return ["-i", "-c"];
  if (shellName === "zsh") return ["-f", "-i", "-c"];
  return shellArgs;
}
function buildSnapshotCaptureEnv(env) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([key]) => CAPTURE_ENV_NAMES.has(key) && !SECRET_ENV_PATTERN.test(key),
    ),
  );
}
function buildTrustedSnapshotCaptureEnv(runtimeEnv) {
  const env = buildSnapshotCaptureEnv(process.env);
  if (runtimeEnv.OPENCLAW_SHELL === "exec") env.OPENCLAW_SHELL = "exec";
  return env;
}
function buildStartupSourceScript(shellName) {
  if (shellName === "zsh")
    return `if [ -r "\${ZDOTDIR:-$HOME}/.zshrc" ]; then . "\${ZDOTDIR:-$HOME}/.zshrc"; fi`;
  if (shellName === "bash") return ":";
  return ":";
}
function buildAliasCaptureScript(shellName) {
  return shellName === "zsh" ? "alias -L 2>/dev/null || true" : "alias 2>/dev/null || true";
}
const ENV_CAPTURE_NODE_SCRIPT = `
const safe = new Set(${JSON.stringify([...SAFE_ENV_NAMES].toSorted())});
const blocked = ${SECRET_ENV_PATTERN.toString()};
const out = {};
for (const [key, value] of Object.entries(process.env)) {
  if (!safe.has(key) || blocked.test(key)) continue;
  out[key] = value;
}
process.stdout.write(JSON.stringify(out));
`.trim();
function buildSnapshotFile(stdout) {
  const captureIndex = stdout.indexOf(CAPTURE_MARKER);
  const envIndex = stdout.indexOf(ENV_MARKER);
  if (captureIndex === -1 || envIndex === -1 || envIndex <= captureIndex) return null;
  const shellState = stdout
    .slice(captureIndex + 35, envIndex)
    .trim()
    .split(/\r?\n/)
    .filter((line) => !line.includes(CAPTURE_MARKER) && !line.includes(ENV_MARKER))
    .join("\n");
  if (containsSecretLikeShellState(shellState)) return null;
  return [
    "# OpenClaw exec shell snapshot. Generated; do not edit.",
    'if [ -n "${BASH_VERSION:-}" ]; then shopt -s expand_aliases 2>/dev/null || true; fi',
    "unalias -a 2>/dev/null || true",
    shellState,
    parseSafeEnvExports(stdout.slice(envIndex + 31).trim()),
    "",
  ]
    .filter((part) => part.trim().length > 0)
    .join("\n");
}
function containsSecretLikeShellState(shellState) {
  return SECRET_SHELL_STATE_PATTERNS.some((pattern) => pattern.test(shellState));
}
function parseSafeEnvExports(envJson) {
  let parsed;
  try {
    parsed = JSON.parse(envJson);
  } catch {
    return "";
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return "";
  return Object.entries(parsed)
    .filter(
      (entry) =>
        VALID_ENV_NAME.test(entry[0]) &&
        SAFE_ENV_NAMES.has(entry[0]) &&
        !SECRET_ENV_PATTERN.test(entry[0]) &&
        typeof entry[1] === "string",
    )
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `export ${key}=${shQuote(value)}`)
    .join("\n");
}
function buildRuntimeEnvRestoreScript(env) {
  return [...SAFE_ENV_NAMES]
    .toSorted()
    .filter((key) => env[key] !== process.env[key] && !SECRET_ENV_PATTERN.test(key))
    .map((key) =>
      typeof env[key] === "string" ? `export ${key}=${shQuote(env[key])}` : `unset ${key}`,
    )
    .join("\n");
}
function buildSnapshotWrappedCommand(command, snapshotPath, runtimeEnvRestoreScript) {
  return [
    `if [ -r ${shQuote(snapshotPath)} ]; then . ${shQuote(snapshotPath)}; fi`,
    runtimeEnvRestoreScript,
    `eval ${shQuote(command)}`,
  ]
    .filter((part) => part.trim().length > 0)
    .join("\n");
}
function shQuote(value) {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}
async function runShell(opts) {
  return await new Promise((resolve) => {
    const child = spawn(opts.shell, [...opts.shellArgs, opts.command], {
      cwd: opts.cwd,
      detached: process.platform !== "win32",
      env: opts.env,
      stdio: "ignore",
      windowsHide: true,
    });
    let settled = false;
    const finish = (status) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      killProcessTree(child.pid ?? 0, { graceMs: 0 });
      resolve({ status });
    };
    const timeout = setTimeout(() => {
      killProcessTree(child.pid ?? 0, { graceMs: 250 });
      finish(null);
    }, opts.timeoutMs);
    child.on("error", () => {
      finish(null);
    });
    child.on("exit", (status) => {
      setTimeout(() => finish(status), 250);
    });
    child.on("close", (status) => {
      finish(status);
    });
  });
}
async function cleanupStaleSnapshots(snapshotDir) {
  const cutoff = Date.now() - SNAPSHOT_MAX_AGE_MS;
  let entries;
  try {
    entries = await fs$1.readdir(snapshotDir);
  } catch {
    return;
  }
  await Promise.all(
    entries
      .filter((entry) => entry.endsWith(".sh") || entry.endsWith(".tmp"))
      .map(async (entry) => {
        const target = path.join(snapshotDir, entry);
        try {
          if ((await fs$1.stat(target)).mtimeMs < cutoff) await fs$1.rm(target, { force: true });
        } catch {}
      }),
  );
}
//#endregion
//#region src/agents/bash-tools.exec-runtime.ts
/**
 * Bash exec runtime.
 * Spawns host/sandbox processes, manages session updates/backgrounding,
 * approval messaging constants, environment safety, and exit outcome shaping.
 */
const SMKX = "\x1B[?1h";
const RMKX = "\x1B[?1l";
function resolveExecTimeoutMs(timeoutSec) {
  if (typeof timeoutSec !== "number" || !Number.isFinite(timeoutSec) || timeoutSec <= 0) return;
  return resolveSafeTimeoutDelayMs(timeoutSec * 1e3);
}
/**
 * Detect cursor key mode from PTY output chunk.
 * Uses lastIndexOf to find the *last* toggle in the chunk.
 * Returns "application" if smkx is the last toggle, "normal" if rmkx is last,
 * or null if no toggle is found.
 */
function detectCursorKeyMode(raw) {
  const lastSmkx = raw.lastIndexOf(SMKX);
  const lastRmkx = raw.lastIndexOf(RMKX);
  if (lastSmkx === -1 && lastRmkx === -1) return null;
  return lastSmkx > lastRmkx ? "application" : "normal";
}
/** Default retained aggregate output cap for exec sessions. */
const DEFAULT_MAX_OUTPUT = clampWithDefault(
  readEnvInt("OPENCLAW_BASH_MAX_OUTPUT_CHARS", "PI_BASH_MAX_OUTPUT_CHARS"),
  2e5,
  1e3,
  2e5,
);
/** Default pending output cap for poll/update buffers. */
const DEFAULT_PENDING_MAX_OUTPUT = clampWithDefault(
  readEnvInt("OPENCLAW_BASH_PENDING_MAX_OUTPUT_CHARS"),
  3e4,
  1e3,
  2e5,
);
/** Fallback PATH used when the process environment has no PATH. */
const DEFAULT_PATH =
  process.env.PATH ?? "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const DEFAULT_NOTIFY_SNIPPET_CHARS = 180;
/** Default time an approval can remain pending. */
const DEFAULT_APPROVAL_TIMEOUT_MS = DEFAULT_EXEC_APPROVAL_TIMEOUT_MS;
/** Gateway request timeout for approval registration/wait calls. */
const DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS = DEFAULT_APPROVAL_TIMEOUT_MS + 1e4;
const DEFAULT_APPROVAL_RUNNING_NOTICE_MS = 1e4;
const APPROVAL_SLUG_LENGTH = 8;
function normalizeExecExitSignal(signal) {
  if (signal === null) return;
  return String(signal);
}
function emitExecProcessCompleted(params) {
  const exitSignal = normalizeExecExitSignal(params.outcome.exitSignal);
  emitDiagnosticEvent({
    type: "exec.process.completed",
    target: params.target,
    mode: params.mode,
    outcome: params.outcome.status,
    durationMs: params.outcome.durationMs,
    commandLength: params.command.length,
    ...(params.sessionKey?.trim() ? { sessionKey: params.sessionKey.trim() } : {}),
    ...(typeof params.outcome.exitCode === "number" ? { exitCode: params.outcome.exitCode } : {}),
    ...(exitSignal ? { exitSignal } : {}),
    ...(params.outcome.status === "failed"
      ? {
          timedOut: params.outcome.timedOut,
          failureKind: params.outcome.failureKind,
        }
      : {}),
  });
}
/** Renders a host label for user-facing exec policy messages. */
function renderExecHostLabel(host) {
  return host === "sandbox" ? "sandbox" : host === "gateway" ? "gateway" : "node";
}
/** Renders an exec target label, preserving `auto`. */
function renderExecTargetLabel(target) {
  return target === "auto" ? "auto" : renderExecHostLabel(target);
}
/** Returns true when a per-call target override is allowed by configured policy. */
function isRequestedExecTargetAllowed(params) {
  if (params.requestedTarget === params.configuredTarget) return true;
  if (params.configuredTarget === "auto") {
    if (
      params.sandboxAvailable &&
      (params.requestedTarget === "gateway" || params.requestedTarget === "node")
    )
      return false;
    return true;
  }
  return false;
}
/** Resolves configured/requested/elevated exec target into an effective host. */
function resolveExecTarget(params) {
  const configuredTarget = params.configuredTarget ?? "auto";
  const requestedTarget = params.requestedTarget ?? null;
  if (
    requestedTarget &&
    !isRequestedExecTargetAllowed({
      configuredTarget,
      requestedTarget,
      sandboxAvailable: params.sandboxAvailable,
    })
  ) {
    const allowedConfig = Array.from(
      new Set(
        configuredTarget === "auto" &&
          params.sandboxAvailable &&
          (requestedTarget === "gateway" || requestedTarget === "node")
          ? [renderExecTargetLabel(requestedTarget)]
          : requestedTarget === "gateway" && !params.sandboxAvailable
            ? ["gateway", "auto"]
            : [renderExecTargetLabel(requestedTarget), "auto"],
      ),
    ).join(" or ");
    throw new Error(
      `exec host not allowed (requested ${renderExecTargetLabel(requestedTarget)}; configured host is ${renderExecTargetLabel(configuredTarget)}; set tools.exec.host=${allowedConfig} to allow this override).`,
    );
  }
  const selectedTarget = requestedTarget ?? configuredTarget;
  const resolvedTarget = params.elevatedRequested
    ? selectedTarget === "node"
      ? "node"
      : "gateway"
    : selectedTarget;
  return {
    configuredTarget,
    requestedTarget,
    selectedTarget: resolvedTarget,
    effectiveHost:
      resolvedTarget === "auto"
        ? params.sandboxAvailable
          ? "sandbox"
          : "gateway"
        : resolvedTarget,
  };
}
/** Normalizes notification snippets to a compact single-line form. */
function normalizeNotifyOutput(value) {
  return value.replace(/\s+/g, " ").trim();
}
function compactNotifyOutput(value, maxChars = DEFAULT_NOTIFY_SNIPPET_CHARS) {
  const normalized = normalizeNotifyOutput(value);
  if (!normalized) return "";
  if (normalized.length <= maxChars) return normalized;
  return `${truncateUtf16Safe(normalized, Math.max(1, maxChars - 1))}…`;
}
/** Merges shell-discovered PATH entries into an exec environment. */
function applyShellPath(env, shellPath) {
  if (!shellPath) return;
  const entries = normalizeStringEntries(shellPath.split(path.delimiter));
  if (entries.length === 0) return;
  const pathKey = findPathKey(env);
  const merged = mergePathPrepend(env[pathKey], entries);
  if (merged) env[pathKey] = merged;
}
function maybeNotifyOnExit(session, status) {
  if (!session.backgrounded || !session.notifyOnExit || session.exitNotified) return;
  const sessionKey = session.sessionKey?.trim();
  if (!sessionKey) return;
  session.exitNotified = true;
  const exitLabel = session.exitSignal
    ? `signal ${session.exitSignal}`
    : `code ${session.exitCode ?? 0}`;
  const output = compactNotifyOutput(tail(session.tail || session.aggregated || "", 400));
  if (status === "failed" && session.exitReason === "manual-cancel" && !output) return;
  if (status === "completed" && !output && session.notifyOnExitEmptySuccess !== true) return;
  const summary = output
    ? `Exec ${status} (${session.id.slice(0, 8)}, ${exitLabel}) :: ${output}`
    : `Exec ${status} (${session.id.slice(0, 8)}, ${exitLabel})`;
  const eventRouting = session.eventRouting ?? {
    mainKey: session.mainKey,
    sessionScope: session.sessionScope,
  };
  enqueueSystemEvent(summary, {
    sessionKey: resolveEventSessionKeyForPolicy(sessionKey, eventRouting),
    deliveryContext: session.notifyDeliveryContext,
  });
  if (!isSubagentSessionKey(sessionKey))
    requestHeartbeat(
      scopedHeartbeatWakeOptionsForPolicy(
        sessionKey,
        {
          source: "exec-event",
          intent: "event",
          reason: "exec-event",
          coalesceMs: 0,
        },
        eventRouting,
      ),
    );
}
/** Creates the short approval id shown in `/approve` prompts. */
function createApprovalSlug(id) {
  return id.slice(0, APPROVAL_SLUG_LENGTH);
}
/** Builds the user-facing approval-pending message for foreground exec. */
function buildApprovalPendingMessage(params) {
  const commandBlock = formatFencedCodeBlock(params.command, "sh");
  const lines = [];
  const allowedDecisions = params.allowedDecisions ?? resolveExecApprovalAllowedDecisions();
  const decisionText = allowedDecisions.join("|");
  const warningText = params.warningText?.trim();
  if (warningText) lines.push(warningText, "");
  lines.push(`Approval required (id ${params.approvalSlug}, full ${params.approvalId}).`);
  lines.push(`Host: ${params.host}`);
  if (params.nodeId) lines.push(`Node: ${params.nodeId}`);
  lines.push(`CWD: ${params.cwd ?? "(node default)"}`);
  lines.push("Command:");
  lines.push(commandBlock);
  lines.push("Mode: foreground (interactive approvals available).");
  lines.push(
    allowedDecisions.includes("allow-always")
      ? "Background mode requires pre-approved policy (allow-always or ask=off)."
      : "Background mode requires an effective policy that allows pre-approval (for example ask=off).",
  );
  lines.push(`Reply with: /approve ${params.approvalSlug} ${decisionText}`);
  if (!allowedDecisions.includes("allow-always"))
    lines.push("Allow Always is unavailable for this command.");
  lines.push("If the short code is ambiguous, use the full id in /approve.");
  return lines.join("\n");
}
/** Normalizes the delay before showing a running approval notice. */
function resolveApprovalRunningNoticeMs(value) {
  if (typeof value !== "number" || !Number.isFinite(value))
    return DEFAULT_APPROVAL_RUNNING_NOTICE_MS;
  if (value <= 0) return 0;
  return Math.floor(value);
}
function joinExecFailureOutput(aggregated, reason) {
  return aggregated ? `${aggregated}\n\n${reason}` : reason;
}
function classifyExecFailureKind(params) {
  if (params.isShellFailure)
    return params.exitCode === 127 ? "shell-command-not-found" : "shell-not-executable";
  if (params.exitReason === "overall-timeout") return "overall-timeout";
  if (params.exitReason === "no-output-timeout") return "no-output-timeout";
  if (params.exitSignal != null) return "signal";
  return "aborted";
}
/** Formats a user-facing reason for a failed exec process exit. */
function formatExecFailureReason(params) {
  switch (params.failureKind) {
    case "shell-command-not-found":
      return "Command not found";
    case "shell-not-executable":
      return "Command not executable (permission denied)";
    case "overall-timeout":
      return typeof params.timeoutSec === "number" && params.timeoutSec > 0
        ? `Command timed out after ${params.timeoutSec} seconds. If this command is expected to take longer, re-run with a higher timeout (e.g., exec timeout=300). If it should keep running, start it with exec background=true or yieldMs so OpenClaw can register a pollable process session. Do not rely on shell backgrounding with a trailing &.`
        : "Command timed out. If this command is expected to take longer, re-run with a higher timeout (e.g., exec timeout=300). If it should keep running, start it with exec background=true or yieldMs so OpenClaw can register a pollable process session. Do not rely on shell backgrounding with a trailing &.";
    case "no-output-timeout":
      return "Command timed out waiting for output";
    case "signal":
      return `Command aborted by signal ${params.exitSignal}`;
    case "aborted":
      return "Command aborted before exit code was captured";
  }
  throw new Error("Unsupported exec failure kind");
}
/** Converts a supervisor exit record into a normalized exec process outcome. */
function buildExecExitOutcome(params) {
  const exitCode = params.exit.exitCode ?? 0;
  const isNormalExit = params.exit.reason === "exit";
  const isShellFailure = exitCode === 126 || exitCode === 127;
  if ((isNormalExit && !isShellFailure ? "completed" : "failed") === "completed") {
    const exitMsg = exitCode !== 0 ? `\n\n(Command exited with code ${exitCode})` : "";
    return {
      status: "completed",
      exitCode,
      exitSignal: params.exit.exitSignal,
      exitReason: params.exit.reason,
      durationMs: params.durationMs,
      aggregated: params.aggregated + exitMsg,
      timedOut: false,
      noOutputTimedOut: params.exit.noOutputTimedOut,
    };
  }
  const failureKind = classifyExecFailureKind({
    exitReason: params.exit.reason,
    exitCode,
    isShellFailure,
    exitSignal: params.exit.exitSignal,
  });
  const reason = formatExecFailureReason({
    failureKind,
    exitSignal: params.exit.exitSignal,
    timeoutSec: params.timeoutSec,
  });
  return {
    status: "failed",
    exitCode: params.exit.exitCode,
    exitSignal: params.exit.exitSignal,
    exitReason: params.exit.reason,
    durationMs: params.durationMs,
    aggregated: params.aggregated,
    timedOut: params.exit.timedOut,
    noOutputTimedOut: params.exit.noOutputTimedOut,
    failureKind,
    reason: joinExecFailureOutput(params.aggregated, reason),
  };
}
/** Converts spawn/runtime errors into a normalized failed exec outcome. */
function buildExecRuntimeErrorOutcome(params) {
  return {
    status: "failed",
    exitCode: null,
    exitSignal: null,
    durationMs: params.durationMs,
    aggregated: params.aggregated,
    timedOut: false,
    failureKind: "runtime-error",
    reason: joinExecFailureOutput(params.aggregated, String(params.error)),
  };
}
/**
 * Apply PATH prepends inside the shell command.
 * This ensures our paths take precedence even if user RC files (e.g. ~/.zshenv)
 * prepend their own entries to PATH during shell startup.
 */
function wrapPosixCommandWithPathPrepend(command, env, pathPrepend) {
  if (process.platform === "win32") return command;
  if (!pathPrepend || pathPrepend.length === 0) return command;
  const pathKey = findPathKey(env);
  const currentPath = env[pathKey];
  if (currentPath) {
    const newPath = removePathPrepend(currentPath, pathPrepend);
    if (newPath !== void 0) env[pathKey] = newPath;
  }
  env.OPENCLAW_PREPEND_PATH = pathPrepend.join(path.delimiter);
  return `export PATH="\${OPENCLAW_PREPEND_PATH}\${PATH:+:$PATH}"; unset OPENCLAW_PREPEND_PATH; ${command}`;
}
/** Starts a host or sandbox exec process and registers it for polling/backgrounding. */
async function runExecProcess(opts) {
  const startedAt = Date.now();
  const sessionId = createSessionSlug();
  const execCommand = opts.execCommand ?? opts.command;
  const diagnosticTarget = opts.sandbox ? "sandbox" : "host";
  const supervisor = getProcessSupervisor();
  const shellRuntimeEnv = {
    ...opts.env,
    OPENCLAW_SHELL: "exec",
  };
  const session = {
    id: sessionId,
    command: opts.command,
    scopeKey: opts.scopeKey,
    sessionKey: opts.sessionKey,
    mainKey: opts.mainKey,
    sessionScope: opts.sessionScope,
    eventRouting: opts.eventRouting,
    notifyDeliveryContext: normalizeDeliveryContext(opts.notifyDeliveryContext),
    notifyOnExit: opts.notifyOnExit,
    notifyOnExitEmptySuccess: opts.notifyOnExitEmptySuccess === true,
    exitNotified: false,
    child: void 0,
    stdin: void 0,
    pid: void 0,
    startedAt,
    cwd: opts.workdir,
    maxOutputChars: opts.maxOutput,
    pendingMaxOutputChars: opts.pendingMaxOutput,
    totalOutputChars: 0,
    pendingStdout: [],
    pendingStderr: [],
    pendingStdoutChars: 0,
    pendingStderrChars: 0,
    aggregated: "",
    tail: "",
    exited: false,
    exitCode: void 0,
    exitSignal: void 0,
    truncated: false,
    backgrounded: false,
    cursorKeyMode: opts.usePty ? "unknown" : "normal",
  };
  addSession(session);
  let updatesDisabled = false;
  const emitUpdate = () => {
    if (!opts.onUpdate) return;
    if (session.backgrounded || session.exited || updatesDisabled) return;
    const tailText = session.tail || session.aggregated;
    opts.onUpdate({
      content: [
        {
          type: "text",
          text: renderExecUpdateText({
            tailText,
            warnings: opts.warnings,
          }),
        },
      ],
      details: {
        status: "running",
        sessionId,
        pid: session.pid ?? void 0,
        startedAt,
        cwd: session.cwd,
        tail: session.tail,
      },
    });
  };
  const handleStdout = (data) => {
    const raw = data;
    const mode = detectCursorKeyMode(raw);
    if (mode) session.cursorKeyMode = mode;
    const str = sanitizeBinaryOutput(raw);
    for (const chunk of chunkString(str)) {
      appendOutput(session, "stdout", chunk);
      emitUpdate();
    }
  };
  const handleStderr = (data) => {
    const str = sanitizeBinaryOutput(data);
    for (const chunk of chunkString(str)) {
      appendOutput(session, "stderr", chunk);
      emitUpdate();
    }
  };
  const timeoutMs = resolveExecTimeoutMs(opts.timeoutSec);
  let sandboxFinalizeToken;
  let sandboxFinalized = false;
  const finalizeSandboxExec = async (params) => {
    if (sandboxFinalized || !opts.sandbox?.finalizeExec) return;
    sandboxFinalized = true;
    await opts.sandbox.finalizeExec({
      ...params,
      token: sandboxFinalizeToken,
    });
  };
  const finalizeAndSettleSession = async (outcome) => {
    let finalOutcome = outcome;
    session.finalizing = true;
    try {
      await finalizeSandboxExec({
        status: outcome.status,
        exitCode: outcome.exitCode,
        timedOut: outcome.timedOut,
      });
    } catch (error) {
      if (outcome.status === "completed")
        finalOutcome = buildExecRuntimeErrorOutcome({
          error,
          aggregated: session.aggregated.trim(),
          durationMs: Date.now() - startedAt,
        });
      else logWarn(`exec: sandbox finalize after process failure failed (${String(error)}).`);
    } finally {
      session.finalizing = false;
      if (!session.exited) {
        markExited(
          session,
          finalOutcome.exitCode,
          finalOutcome.exitSignal,
          finalOutcome.status,
          finalOutcome.exitReason,
          finalOutcome.noOutputTimedOut,
        );
        maybeNotifyOnExit(session, finalOutcome.status);
      }
    }
    return finalOutcome;
  };
  const spawnSpec = await (async () => {
    if (opts.sandbox) {
      const backendExecSpec = await opts.sandbox.buildExecSpec?.({
        command: execCommand,
        workdir: opts.containerWorkdir ?? opts.sandbox.containerWorkdir,
        env: shellRuntimeEnv,
        usePty: opts.usePty,
      });
      sandboxFinalizeToken = backendExecSpec?.finalizeToken;
      return {
        mode: "child",
        argv: backendExecSpec?.argv ?? [
          "docker",
          ...buildDockerExecArgs({
            containerName: opts.sandbox.containerName,
            command: execCommand,
            workdir: opts.containerWorkdir ?? opts.sandbox.containerWorkdir,
            env: shellRuntimeEnv,
            tty: opts.usePty,
          }),
        ],
        env: backendExecSpec?.env ?? process.env,
        stdinMode: backendExecSpec?.stdinMode ?? (opts.usePty ? "pipe-open" : "pipe-closed"),
      };
    }
    const { shell, args: shellArgs } = getShellConfig();
    const commandWithShellSnapshot = await maybeWrapCommandWithShellSnapshot({
      command: wrapPosixCommandWithPathPrepend(execCommand, shellRuntimeEnv, opts.pathPrepend),
      shell,
      shellArgs,
      cwd: opts.workdir,
      env: shellRuntimeEnv,
    });
    const childArgv = [shell, ...shellArgs, commandWithShellSnapshot];
    if (opts.usePty)
      return {
        mode: "pty",
        ptyCommand: commandWithShellSnapshot,
        childFallbackArgv: childArgv,
        env: shellRuntimeEnv,
        stdinMode: "pipe-open",
      };
    return {
      mode: "child",
      argv: childArgv,
      env: shellRuntimeEnv,
      stdinMode: "pipe-closed",
    };
  })();
  let managedRun = null;
  let usingPty = spawnSpec.mode === "pty";
  const cursorResponse = buildCursorPositionResponse();
  const onSupervisorStdout = (chunk) => {
    if (usingPty) {
      const { cleaned, requests } = stripDsrRequests(chunk);
      if (requests > 0 && managedRun?.stdin)
        for (let i = 0; i < requests; i += 1) managedRun.stdin.write(cursorResponse);
      handleStdout(cleaned);
      return;
    }
    handleStdout(chunk);
  };
  try {
    const spawnBase = {
      runId: sessionId,
      sessionId: opts.sessionKey?.trim() || sessionId,
      backendId: opts.sandbox ? "exec-sandbox" : "exec-host",
      scopeKey: opts.scopeKey,
      cwd: opts.workdir,
      env: spawnSpec.env,
      timeoutMs,
      captureOutput: false,
      onStdout: onSupervisorStdout,
      onStderr: handleStderr,
    };
    managedRun =
      spawnSpec.mode === "pty"
        ? await supervisor.spawn({
            ...spawnBase,
            mode: "pty",
            ptyCommand: spawnSpec.ptyCommand,
          })
        : await supervisor.spawn({
            ...spawnBase,
            mode: "child",
            argv: spawnSpec.argv,
            stdinMode: spawnSpec.stdinMode,
          });
  } catch (err) {
    if (spawnSpec.mode === "pty") {
      const warning = `Warning: PTY spawn failed (${String(err)}); retrying without PTY for \`${opts.command}\`.`;
      logWarn(
        `exec: PTY spawn failed (${String(err)}); retrying without PTY for "${opts.command}".`,
      );
      opts.warnings.push(warning);
      usingPty = false;
      try {
        managedRun = await supervisor.spawn({
          runId: sessionId,
          sessionId: opts.sessionKey?.trim() || sessionId,
          backendId: "exec-host",
          scopeKey: opts.scopeKey,
          mode: "child",
          argv: spawnSpec.childFallbackArgv,
          cwd: opts.workdir,
          env: spawnSpec.env,
          stdinMode: "pipe-open",
          timeoutMs,
          captureOutput: false,
          onStdout: handleStdout,
          onStderr: handleStderr,
        });
      } catch (retryErr) {
        markExited(session, null, null, "failed");
        maybeNotifyOnExit(session, "failed");
        await finalizeSandboxExec({
          status: "failed",
          exitCode: null,
          timedOut: false,
        }).catch((finalizeErr) => {
          logWarn(`exec: sandbox finalize after spawn failure failed (${String(finalizeErr)}).`);
        });
        emitExecProcessCompleted({
          command: opts.command,
          mode: "child",
          outcome: buildExecRuntimeErrorOutcome({
            error: retryErr,
            aggregated: session.aggregated.trim(),
            durationMs: Date.now() - startedAt,
          }),
          sessionKey: opts.sessionKey,
          target: diagnosticTarget,
        });
        throw retryErr;
      }
    } else {
      markExited(session, null, null, "failed");
      maybeNotifyOnExit(session, "failed");
      await finalizeSandboxExec({
        status: "failed",
        exitCode: null,
        timedOut: false,
      }).catch((finalizeErr) => {
        logWarn(`exec: sandbox finalize after spawn failure failed (${String(finalizeErr)}).`);
      });
      emitExecProcessCompleted({
        command: opts.command,
        mode: spawnSpec.mode,
        outcome: buildExecRuntimeErrorOutcome({
          error: err,
          aggregated: session.aggregated.trim(),
          durationMs: Date.now() - startedAt,
        }),
        sessionKey: opts.sessionKey,
        target: diagnosticTarget,
      });
      throw err;
    }
  }
  session.stdin = managedRun.stdin;
  session.pid = managedRun.pid;
  const promise = managedRun
    .wait()
    .then(async (exit) => {
      updatesDisabled = true;
      const durationMs = Date.now() - startedAt;
      const outcome = buildExecExitOutcome({
        exit,
        aggregated: session.aggregated.trim(),
        durationMs,
        timeoutSec: opts.timeoutSec,
      });
      const finalOutcome = await finalizeAndSettleSession(outcome);
      emitExecProcessCompleted({
        command: opts.command,
        mode: usingPty ? "pty" : "child",
        outcome: finalOutcome,
        sessionKey: opts.sessionKey,
        target: diagnosticTarget,
      });
      return finalOutcome;
    })
    .catch(async (err) => {
      updatesDisabled = true;
      const outcome = buildExecRuntimeErrorOutcome({
        error: err,
        aggregated: session.aggregated.trim(),
        durationMs: Date.now() - startedAt,
      });
      const finalOutcome = await finalizeAndSettleSession(outcome);
      emitExecProcessCompleted({
        command: opts.command,
        mode: usingPty ? "pty" : "child",
        outcome: finalOutcome,
        sessionKey: opts.sessionKey,
        target: diagnosticTarget,
      });
      return finalOutcome;
    });
  return {
    session,
    startedAt,
    pid: session.pid ?? void 0,
    promise,
    kill: () => {
      managedRun?.cancel("manual-cancel");
    },
    disableUpdates: () => {
      updatesDisabled = true;
    },
  };
}
//#endregion
export {
  renderExecUpdateText as _,
  DEFAULT_PENDING_MAX_OUTPUT as a,
  buildExecRuntimeErrorOutcome as c,
  normalizeNotifyOutput as d,
  renderExecTargetLabel as f,
  renderExecOutputText as g,
  runExecProcess as h,
  DEFAULT_PATH as i,
  createApprovalSlug as l,
  resolveExecTarget as m,
  DEFAULT_APPROVAL_TIMEOUT_MS as n,
  applyShellPath as o,
  resolveApprovalRunningNoticeMs as p,
  DEFAULT_MAX_OUTPUT as r,
  buildApprovalPendingMessage as s,
  DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS as t,
  isRequestedExecTargetAllowed as u,
};
