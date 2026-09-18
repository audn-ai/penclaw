import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import "./src-Bl7G9qvi.js";
import path from "node:path";
import "./errors-BoHeli7m.js";
import { createInterface } from "node:readline";
import { StringDecoder } from "node:string_decoder";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { t as BoundedBuffer } from "./bounded-buffer-C08_hwby.js";
import { t as GatewayClient } from "./client-BkZfVL9e.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-_Anybv37.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import {
  n as loadNodeHostConfig,
  r as saveNodeHostConfig,
  t as ensureNodeHostConfig,
} from "./config-BCurrMjt.js";
import { t as ConnectErrorDetailCodes } from "./connect-error-details-BxqBqDDT.js";
import { t as resolveGatewayConnectionAuth } from "./connection-auth-DnCi7hut.js";
import {
  _ as resolveNodeSystemdServiceName,
  g as resolveNodeLaunchAgentLabel,
  l as formatNodeServiceDescription,
  v as resolveNodeWindowsTaskName,
} from "./constants-obO8goqF.js";
import "./path-guards-CBe_wA_B.js";
import {
  n as resolveDaemonInstallRuntimeInputs,
  r as resolveDaemonNodeBinDir,
  t as emitDaemonInstallRuntimeWarning,
} from "./daemon-install-plan.shared-Bcqb6z_A.js";
import "./fs-safe-advanced-CBe_wA_B.js";
import {
  r as isGatewayDaemonRuntime,
  t as DEFAULT_GATEWAY_DAEMON_RUNTIME,
} from "./daemon-runtime-CHOL1Kuf.js";
import {
  n as loadDeviceIdentityIfPresent,
  o as publicKeyRawBase64UrlFromPem,
  r as loadOrCreateDeviceIdentity,
} from "./device-identity-BmJfeLuX.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import {
  n as formatInvalidConfigPort,
  r as formatInvalidPortOption,
} from "./error-format-CG7mpTEd.js";
import {
  d as PNPM_DLX_OPTIONS_WITH_VALUE,
  f as PNPM_FLAG_OPTIONS,
  g as planShellAuthorization,
  h as unwrapKnownPackageManagerExecInvocation,
  i as evaluateShellAllowlistWithAuthorization,
  m as normalizePackageManagerExecToken,
  p as PNPM_OPTIONS_WITH_VALUE,
  t as evaluateExecAllowlist,
  u as PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE,
} from "./exec-approvals-allowlist-Bc6wvPEu.js";
import {
  n as resolvePlannedSegmentArgv,
  r as analyzeArgvCommand,
} from "./exec-approvals-analysis-C-pXO6pp.js";
import {
  B as resolveDurableExecApprovalRequirement,
  L as requiresExecApproval,
  M as readExecApprovalsSnapshot,
  Q as resolveExecModePolicy,
  R as resolveAllowAlwaysPatternCoverage,
  S as minSecurity,
  _ as isExecApprovalPolicySnapshotCurrent,
  b as maxAsk,
  c as commandRequiresSecurityAuditSuppressionApproval,
  f as ensureExecApprovalsSnapshot,
  it as requestJsonlSocket,
  l as commitExecAuthorizationLocked,
  p as hasDurableExecApproval,
  q as resolveExecApprovalsLocked,
  rt as updateExecApprovals,
  u as createExecApprovalPolicySnapshot,
  w as normalizeExecApprovals,
  x as mergeExecApprovalsSocketDefaults,
  z as resolveAllowAlwaysPersistenceDecision,
} from "./exec-approvals-Bz218bS2.js";
import { t as buildAuthorizedShellCommandFromPlan } from "./exec-authorization-render-D-Y4c_uA.js";
import {
  a as resolveApprovalAuditTrustPath,
  s as resolveCommandResolutionFromArgv,
} from "./exec-command-resolution-CApTmCLK.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as applyExecPolicyLayer } from "./exec-policy-DDAbB8Ct.js";
import "./config-BDv-QbJ6.js";
import {
  r as resolveExecSafeBinRuntimePolicy,
  t as isInterpreterLikeSafeBin,
} from "./exec-safe-bin-runtime-policy-N0nkVI45.js";
import { r as resolveExecutableFromPathEnv } from "./executable-path-BP9CqJ6T.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as sameFileIdentity } from "./file-identity-C0fBiekR.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { t as listHostDirectories } from "./host-directory-listing-Dsq7vChC.js";
import {
  l as sanitizeSystemRunEnvOverrides,
  s as sanitizeHostExecEnv,
  t as inspectHostExecEnvOverrides,
} from "./host-env-security-pMY6K0Qy.js";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.js";
import { t as decodeClaudeCliNodeRunParams } from "./invoke-agent-cli-claude-params-DM7e3NDF.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { n as signalProcessTree } from "./kill-tree-Cr15jS_s.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  i as runServiceUninstall,
  n as runServiceStart,
  r as runServiceStop,
  t as runServiceRestart,
} from "./lifecycle-core-DZXaM2l1.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as loadSkillsFromDirSafe } from "./local-loader-BxASAwJb.js";
import { a as logWarn, t as logDebug } from "./logger-BegyOJlO.js";
import { t as getMachineDisplayName } from "./machine-name-CsNA1WMX.js";
import "./exec-wrapper-resolution-CSf7MIn-.js";
import { r as normalizeConfiguredMcpServers } from "./mcp-config-normalize-Cgi6vawf.js";
import { t as mcpContentBlockToAgentContent } from "./mcp-content-WEFrHX9X.js";
import {
  a as matchesMcpToolFilterPattern,
  i as createMcpJsonSchemaValidator,
  r as sanitizeMcpMetadataText,
  t as resolveMcpTransport,
} from "./mcp-transport-BsCWC6pp.js";
import {
  a as NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
  c as NODE_MCP_TOOLS_CALL_COMMAND,
  f as NODE_SYSTEM_RUN_COMMANDS,
  o as NODE_EXEC_APPROVALS_COMMANDS,
  r as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND,
  s as NODE_FS_LIST_DIR_COMMAND,
  u as NODE_MCP_TOOL_CALL_TIMEOUT_MS,
} from "./node-commands-zATGYJg5.js";
import { t as resolveNodeService } from "./node-service-DEXjf2qG.js";
import {
  i as NODE_SKILL_NAME_RE,
  r as NODE_SKILL_MAX_TOTAL_BYTES,
  t as NODE_SKILL_MAX_CONTENT_BYTES,
} from "./node-skill-constraints-DLpuutsb.js";
import { t as parsePort } from "./parse-port-DxlKuJRE.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { t as ensureOpenClawCliOnPath } from "./path-env-Ch4tyXXb.js";
import { n as detectPolicyInlineEval } from "./policy-BIrebRn7.js";
import { r as resolveNodeProgramArguments } from "./program-args-CoV0mEiK.js";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-CPcFXf0r.js";
import { c as describeInterpreterInlineEval } from "./risks-Bhlho1S0.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { c as getActivePluginRegistry } from "./runtime-CcYnX0B4.js";
import {
  n as buildPlatformServiceStartHints,
  r as formatRuntimeStatus,
  t as buildPlatformRuntimeLogHints,
} from "./runtime-hints-DaMB6xc0.js";
import { u as buildNodeServiceEnvironment } from "./runtime-paths-DxDI3o5V.js";
import {
  a as filterDaemonEnv,
  d as resolveRuntimeStatusColor,
  g as installDaemonServiceAndEmit,
  n as createDaemonInstallActionContext,
  p as buildDaemonServiceSnapshot,
  r as failIfNixDaemonInstallMode,
  t as createCliStatusTextStyles,
} from "./shared-BM2cZyxM.js";
import {
  N as splitShellArgs,
  T as unwrapKnownDispatchWrapperInvocation,
  d as unwrapKnownShellMultiplexerInvocation,
  f as POSIX_INLINE_COMMAND_FLAGS,
  i as extractShellWrapperCommand,
  j as normalizeExecutableToken,
  l as isShellWrapperInvocation,
  p as advancePosixInlineOptionScan,
  s as isBlockedShellWrapperCommand,
  t as POSIX_SHELL_WRAPPERS,
  u as resolveShellWrapperTransportArgv,
  x as extractEnvAssignmentKeysFromDispatchWrappers,
  y as resolveInlineCommandMatch,
} from "./shell-wrapper-resolution-DlXABXcG.js";
import { n as GatewayClientRequestError } from "./src-BOx4iLSi.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  o as normalizeNullableString,
} from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import {
  c as normalizeSystemRunApprovalPlan,
  n as formatExecCommand,
  r as resolveSystemRunCommandRequest,
} from "./system-run-command-rsR6f6wc.js";
import { r as theme, t as colorize } from "./theme-vjDs9tao.js";
import { n as truncateUtf8Suffix, t as truncateUtf8Prefix } from "./utf8-truncate-Dro7v_iB.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import { d as resolveConfigDir } from "./utils-DtcDeqWS.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { r as resolveSafeChildProcessInvocation } from "./windows-command-DMZlx6HX.js";
//#region src/node-host/invoke-payload.ts
const MAX_INVOKE_INPUT_BYTES = 16 * 1024;
function coerceNodeInvokePayload(payload) {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload;
  const id = typeof obj.id === "string" ? obj.id.trim() : "";
  const nodeId = typeof obj.nodeId === "string" ? obj.nodeId.trim() : "";
  const command = typeof obj.command === "string" ? obj.command.trim() : "";
  if (!id || !nodeId || !command) return null;
  return {
    id,
    nodeId,
    command,
    paramsJSON:
      typeof obj.paramsJSON === "string"
        ? obj.paramsJSON
        : obj.params !== void 0
          ? JSON.stringify(obj.params)
          : null,
    timeoutMs: typeof obj.timeoutMs === "number" ? obj.timeoutMs : null,
    idempotencyKey: typeof obj.idempotencyKey === "string" ? obj.idempotencyKey : null,
  };
}
function coerceNodeInvokeCancelPayload(payload) {
  const value = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
  return value && typeof value.invokeId === "string" && typeof value.nodeId === "string"
    ? {
        invokeId: value.invokeId,
        nodeId: value.nodeId,
      }
    : null;
}
function coerceNodeInvokeInputPayload(payload) {
  const value = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : null;
  if (
    !value ||
    typeof value.id !== "string" ||
    typeof value.nodeId !== "string" ||
    !Number.isInteger(value.seq) ||
    value.seq < 0 ||
    typeof value.payloadJSON !== "string" ||
    Buffer.byteLength(value.payloadJSON, "utf8") > MAX_INVOKE_INPUT_BYTES
  )
    return null;
  return {
    invokeId: value.id,
    nodeId: value.nodeId,
    seq: value.seq,
    payloadJSON: value.payloadJSON,
  };
}
//#endregion
//#region src/infra/exec-host.ts
/** Send an authenticated exec request over the host JSONL socket. */
async function requestExecHostViaSocket(params) {
  const { socketPath, token, request } = params;
  if (!socketPath || !token) return null;
  const timeoutMs = params.timeoutMs ?? 2e4;
  const requestJson = JSON.stringify(request);
  const nonce = crypto.randomBytes(16).toString("hex");
  const ts = Date.now();
  const hmac = crypto
    .createHmac("sha256", token)
    .update(`${nonce}:${ts}:${requestJson}`)
    .digest("hex");
  return await requestJsonlSocket({
    socketPath,
    requestLine: JSON.stringify({
      type: "exec",
      id: crypto.randomUUID(),
      nonce,
      ts,
      hmac,
      requestJson,
    }),
    timeoutMs,
    accept: (value) => {
      const msg = value;
      if (msg?.type !== "exec-res") return;
      if (msg.ok === true && msg.payload)
        return {
          ok: true,
          payload: msg.payload,
        };
      if (msg.ok === false && msg.error)
        return {
          ok: false,
          error: msg.error,
        };
      return null;
    },
  });
}
//#endregion
//#region src/node-host/node-invoke-progress.ts
const PROGRESS_CHUNK_BYTES = 16 * 1024;
const MIN_HEARTBEAT_INTERVAL_MS = 250;
const MAX_HEARTBEAT_INTERVAL_MS = 5e3;
function resolveNodeInvokeHeartbeatInterval(idleTimeoutMs) {
  return Math.max(
    MIN_HEARTBEAT_INTERVAL_MS,
    Math.min(MAX_HEARTBEAT_INTERVAL_MS, Math.floor(idleTimeoutMs / 2)),
  );
}
function createNodeInvokeProgressWriter(params) {
  let seq = 0;
  let queue = Promise.resolve();
  let progressError;
  let heartbeatQueued = false;
  let heartbeatDirty = false;
  let heartbeatTimer;
  let recurringHeartbeats = false;
  let stopped = false;
  let lastProgressAt = 0;
  const heartbeatIntervalMs = resolveNodeInvokeHeartbeatInterval(params.idleTimeoutMs);
  const recordError = (error) => {
    progressError = error instanceof Error ? error : new Error(String(error));
    params.onError(progressError);
  };
  const enqueue = (task, pausable) => {
    pausable?.pause();
    queue = queue
      .then(task)
      .catch(recordError)
      .finally(() => pausable?.resume());
    return queue;
  };
  const sendText = async (text) => {
    let remaining = text;
    while (remaining) {
      const chunk = truncateUtf8Prefix(remaining, PROGRESS_CHUNK_BYTES);
      if (!chunk) break;
      await params.client.request("node.invoke.progress", {
        invokeId: params.frame.id,
        nodeId: params.frame.nodeId,
        seq,
        chunk,
      });
      seq += 1;
      remaining = remaining.slice(chunk.length);
    }
  };
  const queueHeartbeat = () => {
    if (stopped) return;
    if (heartbeatQueued) {
      heartbeatDirty = true;
      return;
    }
    heartbeatQueued = true;
    const delayMs = Math.max(0, heartbeatIntervalMs - (Date.now() - lastProgressAt));
    heartbeatTimer = setTimeout(() => {
      heartbeatTimer = void 0;
      enqueue(async () => {
        await params.client.request("node.invoke.progress", {
          invokeId: params.frame.id,
          nodeId: params.frame.nodeId,
          seq,
          chunk: "",
        });
        seq += 1;
        lastProgressAt = Date.now();
      }).finally(() => {
        heartbeatQueued = false;
        if ((heartbeatDirty || recurringHeartbeats) && !stopped) {
          heartbeatDirty = false;
          queueHeartbeat();
        }
      });
    }, delayMs);
  };
  return {
    write(text, pausable) {
      if (!text || stopped) return queue;
      lastProgressAt = Date.now();
      return enqueue(() => sendText(text), pausable);
    },
    queueHeartbeat,
    startHeartbeats() {
      recurringHeartbeats = true;
      queueHeartbeat();
    },
    stopHeartbeats() {
      recurringHeartbeats = false;
      heartbeatDirty = false;
      clearTimeout(heartbeatTimer);
      heartbeatTimer = void 0;
      heartbeatQueued = false;
    },
    async flush() {
      await queue.catch(() => {});
    },
    stop() {
      stopped = true;
      recurringHeartbeats = false;
      heartbeatDirty = false;
      clearTimeout(heartbeatTimer);
      heartbeatTimer = void 0;
    },
    get error() {
      return progressError;
    },
  };
}
//#endregion
//#region src/node-host/invoke-agent-cli-claude.ts
/** Validates and streams one approval-gated Claude CLI turn on a headless node. */
const OUTPUT_CAP_BYTES = 2e5;
const STDERR_TAIL_BYTES = 2e4;
const TERMINAL_EVENT_MAX_BYTES = 1024 * 1024;
function isClaudeResultLine(line) {
  try {
    return JSON.parse(line)?.type === "result";
  } catch {
    return false;
  }
}
/** Spawn the node-resolved Claude binary and stream bounded UTF-8 stdout. */
async function runClaudeCliNodeCommand(params) {
  const cancelledResult = () => ({
    exitCode: 130,
    timedOut: false,
    success: false,
    stdout: "",
    stderr: "Claude CLI invocation cancelled",
    error: null,
    truncated: false,
  });
  if (params.signal?.aborted) return cancelledResult();
  let promptDir;
  let argv = params.argv;
  try {
    if (params.request.systemPrompt !== void 0) {
      promptDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-node-claude-prompt-"));
      const promptPath = path.join(promptDir, "system-prompt.md");
      await fs$1.writeFile(promptPath, params.request.systemPrompt, { mode: 384 });
      argv = [...argv, "--append-system-prompt-file", promptPath];
    }
    if (params.signal?.aborted) return cancelledResult();
    return await new Promise((resolve) => {
      let settled = false;
      let hardTimedOut = false;
      let idleTimedOut = false;
      let cancelled = false;
      let truncated = false;
      let outputBytes = 0;
      let stderr = "";
      const decoder = new StringDecoder("utf8");
      const stderrDecoder = new StringDecoder("utf8");
      const terminalDecoder = new StringDecoder("utf8");
      let terminalLineBuffer = "";
      let terminalLineTouchesTruncation = false;
      let terminalResultLine;
      const invocation = resolveSafeChildProcessInvocation({
        argv,
        cwd: params.cwd,
        env: params.env ?? process.env,
      });
      const child = spawn(invocation.command, invocation.args, {
        cwd: params.cwd,
        env: params.env,
        stdio: ["pipe", "pipe", "pipe"],
        ...(process.platform !== "win32" ? { detached: true } : {}),
        windowsHide: invocation.windowsHide,
        windowsVerbatimArguments: invocation.windowsVerbatimArguments,
      });
      const kill = () => {
        const pid = child.pid;
        if (typeof pid === "number" && pid > 0)
          signalProcessTree(pid, "SIGKILL", { detached: process.platform !== "win32" });
        try {
          child.kill("SIGKILL");
        } catch {}
      };
      const progress = createNodeInvokeProgressWriter({
        client: params.client,
        frame: params.frame,
        idleTimeoutMs: params.request.idleTimeoutMs,
        onError: kill,
      });
      const abortRun = () => {
        cancelled = true;
        kill();
      };
      params.signal?.addEventListener("abort", abortRun, { once: true });
      if (params.signal?.aborted) abortRun();
      const hardTimer = setTimeout(() => {
        hardTimedOut = true;
        kill();
      }, params.timeoutMs ?? params.request.timeoutMs);
      let idleTimer;
      const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          idleTimedOut = true;
          kill();
        }, params.request.idleTimeoutMs);
      };
      resetIdleTimer();
      const retain = (chunk) => {
        if (outputBytes >= OUTPUT_CAP_BYTES) {
          truncated = true;
          return Buffer.alloc(0);
        }
        const remaining = OUTPUT_CAP_BYTES - outputBytes;
        const retained = chunk.length > remaining ? chunk.subarray(0, remaining) : chunk;
        outputBytes += retained.length;
        if (retained.length !== chunk.length) truncated = true;
        return retained;
      };
      const captureTerminalLines = (raw, touchesTruncation) => {
        terminalLineBuffer += terminalDecoder.write(raw);
        terminalLineTouchesTruncation ||= touchesTruncation;
        while (true) {
          const newline = terminalLineBuffer.indexOf("\n");
          if (newline < 0) break;
          const line = terminalLineBuffer.slice(0, newline).replace(/\r$/u, "");
          terminalLineBuffer = terminalLineBuffer.slice(newline + 1);
          if (
            terminalLineTouchesTruncation &&
            Buffer.byteLength(line, "utf8") <= TERMINAL_EVENT_MAX_BYTES &&
            isClaudeResultLine(line)
          )
            terminalResultLine = line;
          terminalLineTouchesTruncation = touchesTruncation;
        }
        if (Buffer.byteLength(terminalLineBuffer, "utf8") > TERMINAL_EVENT_MAX_BYTES) {
          terminalLineBuffer = "";
          terminalLineTouchesTruncation = false;
        }
      };
      child.stdout.on("data", (raw) => {
        const retained = retain(raw);
        if (retained.length > 0) captureTerminalLines(retained, false);
        if (retained.length < raw.length) captureTerminalLines(raw.subarray(retained.length), true);
        resetIdleTimer();
        if (retained.length === 0) {
          progress.queueHeartbeat();
          return;
        }
        const text = decoder.write(retained);
        progress.write(text, child.stdout);
      });
      child.stderr.on("data", (raw) => {
        retain(raw);
        stderr = truncateUtf8Suffix(`${stderr}${stderrDecoder.write(raw)}`, STDERR_TAIL_BYTES);
        resetIdleTimer();
        progress.queueHeartbeat();
      });
      child.stdin.on("error", () => {});
      child.stdin.end(params.request.stdin ?? "");
      const finish = async (exitCode, error) => {
        if (settled) return;
        settled = true;
        clearTimeout(hardTimer);
        clearTimeout(idleTimer);
        progress.stopHeartbeats();
        params.signal?.removeEventListener("abort", abortRun);
        const finalText = decoder.end();
        if (finalText) progress.write(finalText);
        const terminalText = terminalDecoder.end();
        if (terminalText) terminalLineBuffer += terminalText;
        const finalStderr = stderrDecoder.end();
        if (finalStderr) stderr = truncateUtf8Suffix(`${stderr}${finalStderr}`, STDERR_TAIL_BYTES);
        if (
          terminalLineTouchesTruncation &&
          Buffer.byteLength(terminalLineBuffer, "utf8") <= TERMINAL_EVENT_MAX_BYTES &&
          isClaudeResultLine(terminalLineBuffer)
        )
          terminalResultLine = terminalLineBuffer;
        if (truncated && terminalResultLine) progress.write(`\n${terminalResultLine}\n`);
        await progress.flush();
        progress.stop();
        const timeoutMessage = idleTimedOut
          ? "Claude CLI produced no output before the idle timeout"
          : hardTimedOut
            ? "Claude CLI exceeded the hard timeout"
            : "";
        const finalError = progress.error ?? error;
        resolve({
          exitCode: exitCode ?? (idleTimedOut || hardTimedOut ? 124 : cancelled ? 130 : 1),
          timedOut: idleTimedOut || hardTimedOut,
          noOutputTimedOut: idleTimedOut,
          success: exitCode === 0 && !idleTimedOut && !hardTimedOut && !cancelled && !finalError,
          stdout: "",
          stderr: truncateUtf8Suffix(
            [
              stderr,
              timeoutMessage,
              cancelled ? "Claude CLI invocation cancelled" : "",
              finalError?.message,
            ]
              .filter(Boolean)
              .join("\n"),
            STDERR_TAIL_BYTES,
          ),
          error: finalError?.message ?? null,
          truncated,
        });
      };
      child.once("error", (error) => void finish(null, error));
      child.once("close", (code) => void finish(code));
    });
  } finally {
    if (promptDir)
      await fs$1.rm(promptDir, {
        recursive: true,
        force: true,
      });
  }
}
//#endregion
//#region src/node-host/exec-policy.ts
/** Evaluates node-host exec policy from security, approval, and allowlist context. */
/** Normalizes raw approval decisions from node-host payloads. */
function resolveExecApprovalDecision(value) {
  if (value === "allow-once" || value === "allow-always") return value;
  return null;
}
function formatSystemRunAllowlistMissMessage(params) {
  if (params?.windowsShellWrapperBlocked)
    return "SYSTEM_RUN_DENIED: allowlist miss (Windows shell wrappers like cmd.exe /c require approval; approve once/always or run with --ask on-miss|always)";
  return "SYSTEM_RUN_DENIED: allowlist miss";
}
/** Combines exec security, allowlist analysis, and approval state into an allow/deny decision. */
function evaluateSystemRunPolicy(params) {
  const windowsShellWrapperBlocked =
    params.security === "allowlist" &&
    params.shellWrapperInvocation &&
    params.isWindows &&
    params.cmdInvocation;
  const shellWrapperBlocked = windowsShellWrapperBlocked;
  const analysisOk = shellWrapperBlocked ? false : params.analysisOk;
  const allowlistSatisfied = shellWrapperBlocked ? false : params.allowlistSatisfied;
  const approvedByAsk = params.approvalDecision !== null || params.approved === true;
  if (params.security === "deny")
    return {
      allowed: false,
      eventReason: "security=deny",
      errorMessage: "SYSTEM_RUN_DISABLED: security=deny",
      analysisOk,
      allowlistSatisfied,
      shellWrapperBlocked,
      windowsShellWrapperBlocked,
      requiresAsk: false,
      approvalDecision: params.approvalDecision,
      approvedByAsk,
    };
  const requiresAsk = requiresExecApproval({
    ask: params.ask,
    security: params.security,
    analysisOk,
    allowlistSatisfied,
    durableApprovalSatisfied: params.durableApprovalSatisfied,
  });
  if (requiresAsk && !approvedByAsk)
    return {
      allowed: false,
      eventReason: "approval-required",
      errorMessage: "SYSTEM_RUN_DENIED: approval required",
      analysisOk,
      allowlistSatisfied,
      shellWrapperBlocked,
      windowsShellWrapperBlocked,
      requiresAsk,
      approvalDecision: params.approvalDecision,
      approvedByAsk,
    };
  if (params.security === "allowlist" && (!analysisOk || !allowlistSatisfied) && !approvedByAsk) {
    if (params.durableApprovalSatisfied)
      return {
        allowed: true,
        analysisOk,
        allowlistSatisfied,
        shellWrapperBlocked,
        windowsShellWrapperBlocked,
        requiresAsk,
        approvalDecision: params.approvalDecision,
        approvedByAsk,
      };
    return {
      allowed: false,
      eventReason: "allowlist-miss",
      errorMessage: formatSystemRunAllowlistMissMessage({ windowsShellWrapperBlocked }),
      analysisOk,
      allowlistSatisfied,
      shellWrapperBlocked,
      windowsShellWrapperBlocked,
      requiresAsk,
      approvalDecision: params.approvalDecision,
      approvedByAsk,
    };
  }
  return {
    allowed: true,
    analysisOk,
    allowlistSatisfied,
    shellWrapperBlocked,
    windowsShellWrapperBlocked,
    requiresAsk,
    approvalDecision: params.approvalDecision,
    approvedByAsk,
  };
}
//#endregion
//#region src/node-host/invoke-system-run-allowlist.ts
/** Resolves system.run allowlist matches, argv plans, and truncated command output. */
/**
 * Allowlist analysis and argv rewriting for node-host system.run.
 *
 * This module keeps command approval analysis separate from process execution,
 * and only rewrites shell transports when the rebuilt command still satisfies policy.
 */
const POSIX_SHELL_WRAPPER_NAMES = POSIX_SHELL_WRAPPERS;
/** Evaluates analyzed command segments against allowlist and trusted safe-bin policy. */
async function evaluateSystemRunAllowlist(params) {
  if (params.shellCommand) {
    const allowlistEval = await evaluateShellAllowlistWithAuthorization({
      command: params.shellCommand,
      allowlist: params.approvals.allowlist,
      safeBins: params.safeBins,
      safeBinProfiles: params.safeBinProfiles,
      cwd: params.cwd,
      env: params.env,
      trustedSafeBinDirs: params.trustedSafeBinDirs,
      skillBins: params.skillBins,
      autoAllowSkills: params.autoAllowSkills,
      platform: process.platform,
    });
    return {
      analysisOk: allowlistEval.analysisOk,
      allowlistMatches: allowlistEval.allowlistMatches,
      allowlistSatisfied:
        params.security === "allowlist" && allowlistEval.analysisOk
          ? allowlistEval.allowlistSatisfied
          : false,
      allowlistAuthorizationSatisfied: allowlistEval.analysisOk && allowlistEval.allowlistSatisfied,
      segments: allowlistEval.segments,
      segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
      segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy,
      ...(allowlistEval.authorizationPlan
        ? { authorizationPlan: allowlistEval.authorizationPlan }
        : {}),
    };
  }
  const analysis = analyzeArgvCommand({
    argv: params.argv,
    cwd: params.cwd,
    env: params.env,
  });
  const allowlistEval = evaluateExecAllowlist({
    analysis,
    allowlist: params.approvals.allowlist,
    safeBins: params.safeBins,
    safeBinProfiles: params.safeBinProfiles,
    cwd: params.cwd,
    trustedSafeBinDirs: params.trustedSafeBinDirs,
    skillBins: params.skillBins,
    autoAllowSkills: params.autoAllowSkills,
  });
  return {
    analysisOk: analysis.ok,
    allowlistMatches: allowlistEval.allowlistMatches,
    allowlistSatisfied:
      params.security === "allowlist" && analysis.ok ? allowlistEval.allowlistSatisfied : false,
    allowlistAuthorizationSatisfied: analysis.ok && allowlistEval.allowlistSatisfied,
    segments: analysis.segments,
    segmentAllowlistEntries: allowlistEval.segmentAllowlistEntries,
    segmentSatisfiedBy: allowlistEval.segmentSatisfiedBy,
  };
}
/** Resolve the single planned argv that can replace the caller argv after allowlist approval. */
function resolvePlannedAllowlistArgv(params) {
  if (
    params.security !== "allowlist" ||
    params.policy.approvedByAsk ||
    params.shellCommand ||
    !params.policy.analysisOk ||
    !params.policy.allowlistSatisfied ||
    params.segments.length !== 1
  )
    return;
  const plannedAllowlistArgv = resolvePlannedSegmentArgv(
    expectDefined(params.segments[0], "segments entry at 0"),
  );
  return plannedAllowlistArgv && plannedAllowlistArgv.length > 0 ? plannedAllowlistArgv : null;
}
/** Resolve final argv after safe-bin shell rewriting. */
async function resolveSystemRunExecArgv(params) {
  let execArgv = params.plannedAllowlistArgv ?? params.argv;
  if (
    params.security === "allowlist" &&
    params.isWindows &&
    !params.policy.approvedByAsk &&
    params.shellCommand &&
    params.policy.analysisOk &&
    params.policy.allowlistSatisfied &&
    params.segments.length === 1
  ) {
    const plannedArgv = resolvePlannedSegmentArgv(
      expectDefined(params.segments[0], "segments entry at 0"),
    );
    if (!plannedArgv) return null;
    execArgv = plannedArgv;
  }
  if (
    params.security === "allowlist" &&
    !params.isWindows &&
    !params.policy.approvedByAsk &&
    params.shellCommand &&
    params.policy.analysisOk &&
    params.policy.allowlistSatisfied &&
    params.segmentSatisfiedBy.some((entry) => entry === "safeBins" || entry === "inlineChain") &&
    isPosixShellInlineCommandTransport(params.argv)
  ) {
    if (!params.authorizationPlan) return null;
    const rebuilt = buildAuthorizedShellCommandFromPlan({
      plan: params.authorizationPlan,
      mode: "safeBins",
      segmentSatisfiedBy: params.segmentSatisfiedBy,
    });
    if (!rebuilt.ok || !rebuilt.command) return null;
    const rewrittenArgv = replacePosixShellInlineCommand({
      argv: params.argv,
      oldCommand: params.shellCommand,
      nextCommand: rebuilt.command,
    });
    if (!rewrittenArgv) return null;
    execArgv = rewrittenArgv;
  }
  return execArgv;
}
function isPosixShellInlineCommandTransport(argv) {
  const transportArgv = resolveShellWrapperTransportArgv(argv);
  return Boolean(
    transportArgv &&
    POSIX_SHELL_WRAPPER_NAMES.has(normalizeExecutableToken(transportArgv[0] ?? "")),
  );
}
function findSubsequence(haystack, needle) {
  if (needle.length === 0 || needle.length > haystack.length) return -1;
  for (let start = 0; start <= haystack.length - needle.length; start += 1) {
    let matches = true;
    for (let offset = 0; offset < needle.length; offset += 1)
      if (haystack[start + offset] !== needle[offset]) {
        matches = false;
        break;
      }
    if (matches) return start;
  }
  return -1;
}
function replacePosixShellInlineCommand(params) {
  const transportArgv = resolveShellWrapperTransportArgv(params.argv);
  if (
    !transportArgv ||
    !POSIX_SHELL_WRAPPER_NAMES.has(normalizeExecutableToken(transportArgv[0] ?? ""))
  )
    return null;
  const transportStart = findSubsequence(params.argv, transportArgv);
  if (transportStart < 0) return null;
  const match = resolveInlineCommandMatch(transportArgv, POSIX_INLINE_COMMAND_FLAGS, {
    allowCombinedC: true,
  });
  if (match.valueTokenIndex === null) return null;
  const absoluteValueIndex = transportStart + match.valueTokenIndex;
  const token = params.argv[absoluteValueIndex];
  if (token === void 0) return null;
  const rewritten = [...params.argv];
  if (token === params.oldCommand) {
    rewritten[absoluteValueIndex] = params.nextCommand;
    return rewritten;
  }
  if (token.endsWith(params.oldCommand)) {
    rewritten[absoluteValueIndex] =
      token.slice(0, token.length - params.oldCommand.length) + params.nextCommand;
    return rewritten;
  }
  return null;
}
/** Mark truncated output in stderr when possible, otherwise stdout. */
/** Truncates captured stdout/stderr in place to the node-host output cap. */
function applyOutputTruncation(result) {
  if (!result.truncated) return;
  const suffix = "... (truncated)";
  if (result.stderr.trim().length > 0) result.stderr = `${result.stderr}\n${suffix}`;
  else result.stdout = `${result.stdout}\n${suffix}`;
}
//#endregion
//#region src/node-host/invoke-system-run-plan.ts
/** Builds and revalidates system.run approval plans for cwd and mutable executable operands. */
const MUTABLE_ARGV1_INTERPRETER_PATTERNS = [
  /^(?:node|nodejs)$/,
  /^perl$/,
  /^php$/,
  /^python(?:\d+(?:\.\d+)*)?$/,
  /^ruby$/,
];
const GENERIC_MUTABLE_SCRIPT_RUNNERS = /* @__PURE__ */ new Set([
  "esno",
  "jiti",
  "ts-node",
  "ts-node-esm",
  "tsx",
  "vite-node",
]);
const OPAQUE_MUTABLE_SCRIPT_RUNNERS = /* @__PURE__ */ new Set(["busybox", "toybox"]);
const BUN_SUBCOMMANDS = /* @__PURE__ */ new Set([
  "add",
  "audit",
  "completions",
  "create",
  "exec",
  "help",
  "init",
  "install",
  "link",
  "outdated",
  "patch",
  "pm",
  "publish",
  "remove",
  "repl",
  "run",
  "test",
  "unlink",
  "update",
  "upgrade",
  "x",
]);
const BUN_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
  "--backend",
  "--bunfig",
  "--conditions",
  "--config",
  "--console-depth",
  "--cwd",
  "--define",
  "--elide-lines",
  "--env-file",
  "--extension-order",
  "--filter",
  "--hot",
  "--inspect",
  "--inspect-brk",
  "--inspect-wait",
  "--install",
  "--jsx-factory",
  "--jsx-fragment",
  "--jsx-import-source",
  "--loader",
  "--origin",
  "--port",
  "--preload",
  "--smol",
  "--tsconfig-override",
  "-c",
  "-e",
  "-p",
  "-r",
]);
const DENO_RUN_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
  "--cached-only",
  "--cert",
  "--config",
  "--env-file",
  "--ext",
  "--harmony-import-attributes",
  "--import-map",
  "--inspect",
  "--inspect-brk",
  "--inspect-wait",
  "--location",
  "--log-level",
  "--lock",
  "--node-modules-dir",
  "--no-check",
  "--preload",
  "--reload",
  "--seed",
  "--strace-ops",
  "--unstable-bare-node-builtins",
  "--v8-flags",
  "--watch",
  "--watch-exclude",
  "-L",
]);
const NODE_OPTIONS_WITH_FILE_VALUE = /* @__PURE__ */ new Set([
  "-r",
  "--experimental-loader",
  "--import",
  "--loader",
  "--require",
]);
const RUBY_UNSAFE_APPROVAL_FLAGS = /* @__PURE__ */ new Set(["-I", "-r", "--require"]);
const PERL_UNSAFE_APPROVAL_FLAGS = /* @__PURE__ */ new Set(["-I", "-M", "-m"]);
function normalizeOptionFlag(token) {
  return normalizeLowercaseStringOrEmpty(parseInlineOptionToken(token).name);
}
function readTrimmedArgToken(argv, index) {
  return normalizeNullableString(argv[index]) ?? "";
}
const POSIX_SHELL_OPTIONS_WITH_VALUE = /* @__PURE__ */ new Set([
  "--init-file",
  "--rcfile",
  "--startup-script",
  "-O",
  "-o",
  "+O",
  "+o",
]);
const POSIX_SHELLS_WITH_PLUS_OPTIONS = /* @__PURE__ */ new Set([
  "ash",
  "bash",
  "dash",
  "ksh",
  "sh",
  "zsh",
]);
function isPosixShellOptionToken(token, supportsPlusOptions) {
  return token.startsWith("-") || (supportsPlusOptions && token.startsWith("+"));
}
function pathComponentsFromRootSync(targetPath) {
  const absolute = path.resolve(targetPath);
  const parts = [];
  let cursor = absolute;
  while (true) {
    parts.unshift(cursor);
    const parent = path.dirname(cursor);
    if (parent === cursor) return parts;
    cursor = parent;
  }
}
function isOwnedByCurrentProcessSync(candidate) {
  if (process.platform === "win32" || typeof process.getuid !== "function") return false;
  try {
    return fs.statSync(candidate).uid === process.getuid();
  } catch {
    return false;
  }
}
function isMutableByCurrentProcessSync(candidate) {
  try {
    fs.accessSync(candidate, fs.constants.W_OK);
    return true;
  } catch {
    return isOwnedByCurrentProcessSync(candidate);
  }
}
function hasMutableSymlinkPathComponentSync(targetPath) {
  for (const component of pathComponentsFromRootSync(targetPath))
    try {
      if (!fs.lstatSync(component).isSymbolicLink()) continue;
      if (isMutableByCurrentProcessSync(path.dirname(component))) return true;
    } catch {
      return true;
    }
  return false;
}
function pathLooksMutableForShellPayloadSync(targetPath) {
  if (
    isMutableByCurrentProcessSync(targetPath) ||
    isMutableByCurrentProcessSync(path.dirname(targetPath)) ||
    hasMutableSymlinkPathComponentSync(targetPath)
  )
    return true;
  let realPath;
  try {
    realPath = fs.realpathSync(targetPath);
  } catch {
    return true;
  }
  return (
    isMutableByCurrentProcessSync(realPath) ||
    isMutableByCurrentProcessSync(path.dirname(realPath)) ||
    hasMutableSymlinkPathComponentSync(realPath)
  );
}
function shouldPinExecutableForApproval(params) {
  if (params.shellCommand !== null) return false;
  return (params.wrapperChain?.length ?? 0) === 0;
}
function hashFileContentsSync(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}
function looksLikePathToken(token) {
  return (
    token.startsWith(".") ||
    token.startsWith("/") ||
    token.startsWith("\\") ||
    token.includes("/") ||
    token.includes("\\") ||
    path.extname(token).length > 0
  );
}
function resolvesToExistingFileSync(rawOperand, cwd) {
  if (!rawOperand) return false;
  try {
    return fs.statSync(path.resolve(cwd ?? process.cwd(), rawOperand)).isFile();
  } catch {
    return false;
  }
}
function isKnownBinaryExecutableHeader(buffer) {
  if (buffer.length >= 4 && buffer.subarray(0, 4).equals(Buffer.from([127, 69, 76, 70])))
    return true;
  if (
    buffer.length >= 4 &&
    (buffer.subarray(0, 4).equals(Buffer.from([254, 237, 250, 206])) ||
      buffer.subarray(0, 4).equals(Buffer.from([206, 250, 237, 254])) ||
      buffer.subarray(0, 4).equals(Buffer.from([254, 237, 250, 207])) ||
      buffer.subarray(0, 4).equals(Buffer.from([207, 250, 237, 254])) ||
      buffer.subarray(0, 4).equals(Buffer.from([202, 254, 186, 190])) ||
      buffer.subarray(0, 4).equals(Buffer.from([190, 186, 254, 202])) ||
      buffer.subarray(0, 4).equals(Buffer.from([202, 254, 186, 191])) ||
      buffer.subarray(0, 4).equals(Buffer.from([191, 186, 254, 202])))
  )
    return true;
  if (buffer.length < 64 || !buffer.subarray(0, 2).equals(Buffer.from([77, 90]))) return false;
  const peOffset = buffer.readUInt32LE(60);
  return (
    peOffset >= 0 &&
    peOffset <= buffer.length - 4 &&
    buffer.subarray(peOffset, peOffset + 4).equals(Buffer.from([80, 69, 0, 0]))
  );
}
function isLikelyScriptLikePathSync(targetPath) {
  let stat;
  try {
    stat = fs.statSync(targetPath);
  } catch {
    return true;
  }
  if (!stat.isFile()) return true;
  let header;
  try {
    const fd = fs.openSync(targetPath, "r");
    try {
      header = Buffer.alloc(1024);
      const bytesRead = fs.readSync(fd, header, 0, header.length, 0);
      header = header.subarray(0, bytesRead);
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return true;
  }
  if (header.length === 0) return true;
  if (header.subarray(0, 2).equals(Buffer.from("#!"))) return true;
  if (isKnownBinaryExecutableHeader(header)) return false;
  return true;
}
function unwrapArgvForMutableOperand(argv) {
  let current = argv;
  let baseIndex = 0;
  let opaqueMultiplexerSeen = false;
  while (true) {
    const dispatchUnwrap = unwrapKnownDispatchWrapperInvocation(current);
    if (dispatchUnwrap.kind === "unwrapped") {
      baseIndex += current.length - dispatchUnwrap.argv.length;
      current = dispatchUnwrap.argv;
      continue;
    }
    const shellMultiplexerUnwrap = unwrapKnownShellMultiplexerInvocation(current);
    if (shellMultiplexerUnwrap.kind === "unwrapped") {
      if (OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(shellMultiplexerUnwrap.wrapper))
        opaqueMultiplexerSeen = true;
      baseIndex += current.length - shellMultiplexerUnwrap.argv.length;
      current = shellMultiplexerUnwrap.argv;
      continue;
    }
    const packageManagerUnwrap = unwrapKnownPackageManagerExecInvocation(current);
    if (packageManagerUnwrap) {
      baseIndex += current.length - packageManagerUnwrap.length;
      current = packageManagerUnwrap;
      continue;
    }
    return {
      argv: current,
      baseIndex,
      opaqueMultiplexerSeen,
    };
  }
}
function resolvePosixShellScriptOperandIndex(argv, executable) {
  const supportsPlusOptions = POSIX_SHELLS_WITH_PLUS_OPTIONS.has(executable);
  if (
    resolveInlineCommandMatch(argv, POSIX_INLINE_COMMAND_FLAGS, {
      allowCombinedC: true,
      isOptionToken: (token) => isPosixShellOptionToken(token, supportsPlusOptions),
      stopAtFirstNonOption: true,
    }).valueTokenIndex !== null
  )
    return null;
  let afterDoubleDash = false;
  for (let i = 1; i < argv.length; i += 1) {
    const token = readTrimmedArgToken(argv, i);
    if (!token) continue;
    if (token === "-") return null;
    if (!afterDoubleDash && token === "--") {
      afterDoubleDash = true;
      continue;
    }
    if (!afterDoubleDash && token === "-s") return null;
    if (!afterDoubleDash && isPosixShellOptionToken(token, supportsPlusOptions)) {
      const flag = normalizeOptionFlag(token);
      if (POSIX_SHELL_OPTIONS_WITH_VALUE.has(flag)) {
        if (!token.includes("=")) i += 1;
        continue;
      }
      i += advancePosixInlineOptionScan(token) - 1;
      continue;
    }
    return i;
  }
  return null;
}
function resolveOptionFilteredFileOperandIndex(params) {
  let afterDoubleDash = false;
  for (let i = params.startIndex; i < params.argv.length; i += 1) {
    const token = readTrimmedArgToken(params.argv, i);
    if (!token) continue;
    if (afterDoubleDash) return resolvesToExistingFileSync(token, params.cwd) ? i : null;
    if (token === "--") {
      afterDoubleDash = true;
      continue;
    }
    if (token === "-") return null;
    if (token.startsWith("-")) {
      if (!token.includes("=") && params.optionsWithValue?.has(token)) i += 1;
      continue;
    }
    return resolvesToExistingFileSync(token, params.cwd) ? i : null;
  }
  return null;
}
function resolveOptionFilteredPositionalIndex(params) {
  let afterDoubleDash = false;
  for (let i = params.startIndex; i < params.argv.length; i += 1) {
    const token = readTrimmedArgToken(params.argv, i);
    if (!token) continue;
    if (afterDoubleDash) return i;
    if (token === "--") {
      afterDoubleDash = true;
      continue;
    }
    if (token === "-") return null;
    if (token.startsWith("-")) {
      if (!token.includes("=") && params.optionsWithValue?.has(token)) i += 1;
      continue;
    }
    return i;
  }
  return null;
}
function collectExistingFileOperandIndexes(params) {
  let afterDoubleDash = false;
  const hits = [];
  for (let i = params.startIndex; i < params.argv.length; i += 1) {
    const token = readTrimmedArgToken(params.argv, i);
    if (!token) continue;
    if (afterDoubleDash) {
      if (resolvesToExistingFileSync(token, params.cwd)) hits.push(i);
      continue;
    }
    if (token === "--") {
      afterDoubleDash = true;
      continue;
    }
    if (token === "-")
      return {
        hits: [],
        sawOptionValueFile: false,
      };
    if (token.startsWith("-")) {
      const option = parseInlineOptionToken(token);
      const flag = option.name;
      const inlineValue = option.hasInlineValue ? option.inlineValue : void 0;
      if (params.optionsWithFileValue?.has(normalizeLowercaseStringOrEmpty(flag))) {
        if (inlineValue && resolvesToExistingFileSync(inlineValue, params.cwd)) {
          hits.push(i);
          return {
            hits,
            sawOptionValueFile: true,
          };
        }
        const nextToken = readTrimmedArgToken(params.argv, i + 1);
        if (!inlineValue && nextToken && resolvesToExistingFileSync(nextToken, params.cwd)) {
          hits.push(i + 1);
          return {
            hits,
            sawOptionValueFile: true,
          };
        }
      }
      continue;
    }
    if (resolvesToExistingFileSync(token, params.cwd)) hits.push(i);
  }
  return {
    hits,
    sawOptionValueFile: false,
  };
}
function resolveGenericInterpreterScriptOperandIndex(params) {
  const collection = collectExistingFileOperandIndexes({
    argv: params.argv,
    startIndex: 1,
    cwd: params.cwd,
    optionsWithFileValue: params.optionsWithFileValue,
  });
  if (collection.sawOptionValueFile) return null;
  return collection.hits.length === 1 ? expectDefined(collection.hits[0], "hits entry at 0") : null;
}
function resolveBunScriptOperandIndex(params) {
  const directIndex = resolveOptionFilteredPositionalIndex({
    argv: params.argv,
    startIndex: 1,
    optionsWithValue: BUN_OPTIONS_WITH_VALUE,
  });
  if (directIndex === null) return null;
  const directToken = readTrimmedArgToken(params.argv, directIndex);
  if (directToken === "run")
    return resolveOptionFilteredFileOperandIndex({
      argv: params.argv,
      startIndex: directIndex + 1,
      cwd: params.cwd,
      optionsWithValue: BUN_OPTIONS_WITH_VALUE,
    });
  if (BUN_SUBCOMMANDS.has(directToken)) return null;
  if (!looksLikePathToken(directToken)) return null;
  return directIndex;
}
function resolveDenoRunScriptOperandIndex(params) {
  if (readTrimmedArgToken(params.argv, 1) !== "run") return null;
  return resolveOptionFilteredFileOperandIndex({
    argv: params.argv,
    startIndex: 2,
    cwd: params.cwd,
    optionsWithValue: DENO_RUN_OPTIONS_WITH_VALUE,
  });
}
function hasRubyUnsafeApprovalFlag(argv) {
  let afterDoubleDash = false;
  for (let i = 1; i < argv.length; i += 1) {
    const token = readTrimmedArgToken(argv, i);
    if (!token) continue;
    if (afterDoubleDash) return false;
    if (token === "--") {
      afterDoubleDash = true;
      continue;
    }
    if (token === "-I" || token === "-r") return true;
    if (token.startsWith("-I") || token.startsWith("-r")) return true;
    if (RUBY_UNSAFE_APPROVAL_FLAGS.has(normalizeLowercaseStringOrEmpty(token))) return true;
  }
  return false;
}
function hasPerlUnsafeApprovalFlag(argv) {
  let afterDoubleDash = false;
  for (let i = 1; i < argv.length; i += 1) {
    const token = readTrimmedArgToken(argv, i);
    if (!token) continue;
    if (afterDoubleDash) return false;
    if (token === "--") {
      afterDoubleDash = true;
      continue;
    }
    if (token === "-I" || token === "-M" || token === "-m") return true;
    if (token.startsWith("-I") || token.startsWith("-M") || token.startsWith("-m")) return true;
    if (PERL_UNSAFE_APPROVAL_FLAGS.has(token)) return true;
  }
  return false;
}
function isMutableScriptRunner(executable) {
  return (
    GENERIC_MUTABLE_SCRIPT_RUNNERS.has(executable) ||
    OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(executable) ||
    isInterpreterLikeSafeBin(executable)
  );
}
function resolveMutableFileOperandIndex(argv, cwd) {
  const unwrapped = unwrapArgvForMutableOperand(argv);
  const executable = normalizeExecutableToken(unwrapped.argv[0] ?? "");
  if (!executable) return null;
  if (unwrapped.opaqueMultiplexerSeen || OPAQUE_MUTABLE_SCRIPT_RUNNERS.has(executable)) return null;
  if (POSIX_SHELL_WRAPPERS.has(executable)) {
    const shellIndex = resolvePosixShellScriptOperandIndex(unwrapped.argv, executable);
    return shellIndex === null ? null : unwrapped.baseIndex + shellIndex;
  }
  if (MUTABLE_ARGV1_INTERPRETER_PATTERNS.some((pattern) => pattern.test(executable))) {
    const operand = readTrimmedArgToken(unwrapped.argv, 1);
    if (operand && operand !== "-" && !operand.startsWith("-")) return unwrapped.baseIndex + 1;
  }
  if (executable === "bun") {
    const bunIndex = resolveBunScriptOperandIndex({
      argv: unwrapped.argv,
      cwd,
    });
    if (bunIndex !== null) return unwrapped.baseIndex + bunIndex;
  }
  if (executable === "deno") {
    const denoIndex = resolveDenoRunScriptOperandIndex({
      argv: unwrapped.argv,
      cwd,
    });
    if (denoIndex !== null) return unwrapped.baseIndex + denoIndex;
  }
  if (executable === "ruby" && hasRubyUnsafeApprovalFlag(unwrapped.argv)) return null;
  if (executable === "perl" && hasPerlUnsafeApprovalFlag(unwrapped.argv)) return null;
  if (!isMutableScriptRunner(executable)) return null;
  const genericIndex = resolveGenericInterpreterScriptOperandIndex({
    argv: unwrapped.argv,
    cwd,
    optionsWithFileValue:
      executable === "node" || executable === "nodejs" ? NODE_OPTIONS_WITH_FILE_VALUE : void 0,
  });
  return genericIndex === null ? null : unwrapped.baseIndex + genericIndex;
}
function shellPayloadNeedsStableBinding(shellCommand, cwd) {
  const argv = splitShellArgs(shellCommand);
  if (!argv || argv.length === 0) return false;
  const snapshot = resolveMutableFileOperandSnapshotSync({
    argv,
    cwd,
    shellCommand: null,
  });
  if (!snapshot.ok) return true;
  if (snapshot.snapshot) return true;
  const firstToken = readTrimmedArgToken(argv, 0);
  if (!resolvesToExistingFileSync(firstToken, cwd)) return false;
  if (!path.isAbsolute(firstToken)) return true;
  const resolvedPath = path.resolve(cwd ?? process.cwd(), firstToken);
  if (pathLooksMutableForShellPayloadSync(resolvedPath)) return true;
  return isLikelyScriptLikePathSync(resolvedPath);
}
function requiresStableInterpreterApprovalBindingWithShellCommand(params) {
  const unwrapped = unwrapArgvForMutableOperand(params.argv);
  if (unwrapped.opaqueMultiplexerSeen) return true;
  if (params.shellCommand !== null)
    return shellPayloadNeedsStableBinding(params.shellCommand, params.cwd);
  if (pnpmDlxInvocationNeedsFailClosedBinding(params.argv, params.cwd)) return true;
  const executable = normalizeExecutableToken(unwrapped.argv[0] ?? "");
  if (!executable) return false;
  if (POSIX_SHELL_WRAPPERS.has(executable)) return false;
  return isMutableScriptRunner(executable);
}
function pnpmDlxInvocationNeedsFailClosedBinding(argv, cwd) {
  if (normalizePackageManagerExecToken(argv[0] ?? "") !== "pnpm") return false;
  let idx = 1;
  while (idx < argv.length) {
    const token = readTrimmedArgToken(argv, idx);
    if (!token) {
      idx += 1;
      continue;
    }
    if (token === "--") {
      idx += 1;
      continue;
    }
    if (!token.startsWith("-")) {
      if (token !== "dlx") return false;
      return pnpmDlxTailNeedsFailClosedBinding(argv.slice(idx + 1), cwd);
    }
    const parsedOption = parseInlineOptionToken(token);
    const flag = normalizeLowercaseStringOrEmpty(parsedOption.name);
    if (PNPM_OPTIONS_WITH_VALUE.has(flag) || PNPM_DLX_OPTIONS_WITH_VALUE.has(flag)) {
      idx += token.includes("=") ? 1 : 2;
      continue;
    }
    if (PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE.has(parsedOption.name)) {
      idx += token.includes("=") ? 1 : 2;
      continue;
    }
    if (PNPM_FLAG_OPTIONS.has(flag)) {
      idx += 1;
      continue;
    }
    return true;
  }
  return false;
}
function pnpmDlxTailNeedsFailClosedBinding(argv, cwd) {
  let idx = 0;
  while (idx < argv.length) {
    const token = readTrimmedArgToken(argv, idx);
    if (!token) {
      idx += 1;
      continue;
    }
    if (token === "--") return pnpmDlxTailMayNeedStableBinding(argv.slice(idx + 1), cwd);
    if (!token.startsWith("-")) return pnpmDlxTailMayNeedStableBinding(argv.slice(idx), cwd);
    const parsedOption = parseInlineOptionToken(token);
    const flag = normalizeLowercaseStringOrEmpty(parsedOption.name);
    if (flag === "-c" || flag === "--shell-mode") return false;
    if (PNPM_OPTIONS_WITH_VALUE.has(flag) || PNPM_DLX_OPTIONS_WITH_VALUE.has(flag)) {
      idx += token.includes("=") ? 1 : 2;
      continue;
    }
    if (PNPM_CASE_SENSITIVE_OPTIONS_WITH_VALUE.has(parsedOption.name)) {
      idx += token.includes("=") ? 1 : 2;
      continue;
    }
    if (PNPM_FLAG_OPTIONS.has(flag)) {
      idx += 1;
      continue;
    }
    return true;
  }
  return true;
}
function pnpmDlxTailMayNeedStableBinding(argv, cwd) {
  const snapshot = resolveMutableFileOperandSnapshotSync({
    argv,
    cwd,
    shellCommand: null,
  });
  return snapshot.ok && snapshot.snapshot !== null;
}
/** Captures file identity for a mutable script operand that approval is bound to. */
function resolveMutableFileOperandSnapshotSync(params) {
  const argvIndex = resolveMutableFileOperandIndex(params.argv, params.cwd);
  if (argvIndex === null) {
    if (
      requiresStableInterpreterApprovalBindingWithShellCommand({
        argv: params.argv,
        shellCommand: params.shellCommand,
        cwd: params.cwd,
      })
    )
      return {
        ok: false,
        message: "SYSTEM_RUN_DENIED: approval cannot safely bind this interpreter/runtime command",
      };
    return {
      ok: true,
      snapshot: null,
    };
  }
  const rawOperand = readTrimmedArgToken(params.argv, argvIndex);
  if (!rawOperand)
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval requires a stable script operand",
    };
  const resolvedPath = path.resolve(params.cwd ?? process.cwd(), rawOperand);
  let realPath;
  let stat;
  try {
    realPath = fs.realpathSync(resolvedPath);
    stat = fs.statSync(realPath);
  } catch {
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval requires an existing script operand",
    };
  }
  if (!stat.isFile())
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval requires a file script operand",
    };
  return {
    ok: true,
    snapshot: {
      argvIndex,
      path: realPath,
      sha256: hashFileContentsSync(realPath),
    },
  };
}
function resolveCanonicalApprovalCwdSync(cwd) {
  const requestedCwd = path.resolve(cwd);
  let cwdLstat;
  let cwdStat;
  let cwdReal;
  let cwdRealStat;
  try {
    cwdLstat = fs.lstatSync(requestedCwd);
    cwdStat = fs.statSync(requestedCwd);
    cwdReal = fs.realpathSync(requestedCwd);
    cwdRealStat = fs.statSync(cwdReal);
  } catch {
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval requires an existing canonical cwd",
    };
  }
  if (!cwdStat.isDirectory())
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval requires cwd to be a directory",
    };
  if (hasMutableSymlinkPathComponentSync(requestedCwd))
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval requires canonical cwd (no symlink path components)",
    };
  if (cwdLstat.isSymbolicLink())
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval requires canonical cwd (no symlink cwd)",
    };
  if (
    !sameFileIdentity(cwdStat, cwdLstat) ||
    !sameFileIdentity(cwdStat, cwdRealStat) ||
    !sameFileIdentity(cwdLstat, cwdRealStat)
  )
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval cwd identity mismatch",
    };
  return {
    ok: true,
    snapshot: {
      cwd: cwdReal,
      stat: cwdStat,
    },
  };
}
/** Rechecks that the approved cwd still points at the same directory identity. */
function revalidateApprovedCwdSnapshot(params) {
  const current = resolveCanonicalApprovalCwdSync(params.snapshot.cwd);
  if (!current.ok) return false;
  return sameFileIdentity(params.snapshot.stat, current.snapshot.stat);
}
function revalidateApprovedMutableFileOperand(params) {
  const operand = params.argv[params.snapshot.argvIndex]?.trim();
  if (!operand) return false;
  const resolvedPath = path.resolve(params.cwd ?? process.cwd(), operand);
  let realPath;
  try {
    realPath = fs.realpathSync(resolvedPath);
  } catch {
    return false;
  }
  if (realPath !== params.snapshot.path) return false;
  try {
    return hashFileContentsSync(realPath) === params.snapshot.sha256;
  } catch {
    return false;
  }
}
function hardenApprovedExecutionPaths(params) {
  if (!params.approvedByAsk)
    return {
      ok: true,
      argv: params.argv,
      argvChanged: false,
      cwd: params.cwd,
      approvedCwdSnapshot: void 0,
    };
  let hardenedCwd = params.cwd;
  let approvedCwdSnapshot;
  if (hardenedCwd) {
    const canonicalCwd = resolveCanonicalApprovalCwdSync(hardenedCwd);
    if (!canonicalCwd.ok) return canonicalCwd;
    hardenedCwd = canonicalCwd.snapshot.cwd;
    approvedCwdSnapshot = canonicalCwd.snapshot;
  }
  if (params.argv.length === 0)
    return {
      ok: true,
      argv: params.argv,
      argvChanged: false,
      cwd: hardenedCwd,
      approvedCwdSnapshot,
    };
  const resolution = resolveCommandResolutionFromArgv(params.argv, hardenedCwd);
  if (
    !shouldPinExecutableForApproval({
      shellCommand: params.shellCommand,
      wrapperChain: resolution?.wrapperChain,
    })
  )
    return {
      ok: true,
      argv: params.argv,
      argvChanged: false,
      cwd: hardenedCwd,
      approvedCwdSnapshot,
    };
  const pinnedExecutable =
    resolution?.execution.resolvedRealPath ?? resolution?.execution.resolvedPath;
  if (!pinnedExecutable)
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval requires a stable executable path",
    };
  if (pinnedExecutable === params.argv[0])
    return {
      ok: true,
      argv: params.argv,
      argvChanged: false,
      cwd: hardenedCwd,
      approvedCwdSnapshot,
    };
  const argv = [...params.argv];
  argv[0] = pinnedExecutable;
  return {
    ok: true,
    argv,
    argvChanged: true,
    cwd: hardenedCwd,
    approvedCwdSnapshot,
  };
}
function buildSystemRunApprovalPlan(params) {
  const command = resolveSystemRunCommandRequest({
    command: params.command,
    rawCommand: params.rawCommand,
  });
  if (!command.ok)
    return {
      ok: false,
      message: command.message,
    };
  if (command.argv.length === 0)
    return {
      ok: false,
      message: "command required",
    };
  if (command.shellPayload === null && isBlockedShellWrapperCommand(command.argv))
    return {
      ok: false,
      message: "SYSTEM_RUN_DENIED: approval cannot safely bind this interpreter/runtime command",
    };
  const hardening = hardenApprovedExecutionPaths({
    approvedByAsk: true,
    argv: command.argv,
    shellCommand: command.shellPayload,
    cwd: normalizeNullableString(params.cwd) ?? void 0,
  });
  if (!hardening.ok)
    return {
      ok: false,
      message: hardening.message,
    };
  const commandText = formatExecCommand(hardening.argv);
  const commandPreview =
    command.previewText?.trim() && command.previewText.trim() !== commandText
      ? command.previewText.trim()
      : null;
  const mutableFileOperand = resolveMutableFileOperandSnapshotSync({
    argv: hardening.argv,
    cwd: hardening.cwd,
    shellCommand: command.shellPayload,
  });
  if (!mutableFileOperand.ok)
    return {
      ok: false,
      message: mutableFileOperand.message,
    };
  return {
    ok: true,
    plan: {
      argv: hardening.argv,
      cwd: hardening.cwd ?? null,
      commandText,
      commandPreview,
      agentId: normalizeNullableString(params.agentId),
      sessionKey: normalizeNullableString(params.sessionKey),
      mutableFileOperand: mutableFileOperand.snapshot ?? void 0,
    },
  };
}
//#endregion
//#region src/node-host/invoke-system-run.ts
/** Policy and execution pipeline for approved node-host system.run requests. */
const safeBinTrustedDirWarningCache = /* @__PURE__ */ new Set();
const APPROVAL_CWD_DRIFT_DENIED_MESSAGE =
  "SYSTEM_RUN_DENIED: approval cwd changed before execution";
const APPROVAL_SCRIPT_OPERAND_BINDING_DENIED_MESSAGE =
  "SYSTEM_RUN_DENIED: approval missing script operand binding";
const APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE =
  "SYSTEM_RUN_DENIED: approval script operand changed before execution";
const APPROVAL_STATE_WRITE_FAILED_MESSAGE =
  "SYSTEM_RUN_DENIED: approval state could not be persisted";
function warnWritableTrustedDirOnce(message) {
  if (safeBinTrustedDirWarningCache.has(message)) return;
  safeBinTrustedDirWarningCache.add(message);
  logWarn(message);
}
function normalizeDeniedReason(reason) {
  switch (reason) {
    case "security=deny":
    case "approval-required":
    case "allowlist-miss":
    case "execution-plan-miss":
    case "companion-unavailable":
    case "permission:screenRecording":
      return reason;
    default:
      return "approval-required";
  }
}
function resolveAgentExecConfig(cfg, agentId) {
  if (!agentId) return;
  const normalizedAgentId = normalizeAgentId(agentId);
  return cfg.agents?.list?.find(
    (candidate) =>
      candidate !== null &&
      typeof candidate === "object" &&
      normalizeAgentId(candidate.id) === normalizedAgentId,
  )?.tools?.exec;
}
/** Resolves the effective exec security/ask policy for one system.run request. */
async function resolveEffectiveSystemRunExecPolicy(params) {
  const agentExec = resolveAgentExecConfig(params.cfg, params.agentId);
  const globalExec = params.cfg.tools?.exec;
  const layeredPolicy = applyExecPolicyLayer(
    applyExecPolicyLayer(
      {
        security: params.defaultSecurity,
        ask: params.defaultAsk,
      },
      globalExec,
    ),
    agentExec,
  );
  const modePolicy = resolveExecModePolicy({
    mode: layeredPolicy.mode,
    security: layeredPolicy.security,
    ask: layeredPolicy.ask,
  });
  const approvals = await resolveExecApprovalsLocked(params.agentId, {
    security: modePolicy.security,
    ask: modePolicy.ask,
    requireSocket: params.requireSocket,
  });
  return {
    agentExec,
    globalExec,
    approvals,
    security: minSecurity(modePolicy.security, approvals.agent.security),
    ask: maxAsk(modePolicy.ask, approvals.agent.ask),
    autoReview: modePolicy.autoReview,
  };
}
async function resolveSystemRunAutoReviewer(params) {
  if (params.opts.autoReviewer) return params.opts.autoReviewer;
  const { createModelExecAutoReviewer } = await import("./exec-auto-reviewer-C6Y5hmVm.js");
  return createModelExecAutoReviewer({
    cfg: params.cfg,
    agentId: params.agentId,
    reviewer: params.agentExec?.reviewer ?? params.globalExec?.reviewer,
  });
}
async function loadSystemRunConfig(opts) {
  if (opts.getRuntimeConfig) return opts.getRuntimeConfig();
  const { getRuntimeConfig } = await import("./config/config.js");
  return getRuntimeConfig();
}
async function sendSystemRunDenied(opts, execution, params) {
  await opts.sendNodeEvent(
    opts.client,
    "exec.denied",
    opts.buildExecEventPayload({
      sessionKey: execution.sessionKey,
      runId: execution.runId,
      host: "node",
      command: execution.commandText,
      reason: params.reason,
      suppressNotifyOnExit: execution.suppressNotifyOnExit,
    }),
  );
  await opts.sendInvokeResult({
    ok: false,
    error: {
      code: "UNAVAILABLE",
      message: params.message,
    },
  });
}
async function sendSystemRunCompleted(opts, execution, result, payloadJSON) {
  await opts.sendExecFinishedEvent({
    sessionKey: execution.sessionKey,
    runId: execution.runId,
    commandText: execution.commandText,
    result,
    suppressNotifyOnExit: execution.suppressNotifyOnExit,
  });
  await opts.sendInvokeResult({
    ok: true,
    payloadJSON,
  });
}
function argvArraysMatch(left, right) {
  return (
    left !== void 0 &&
    left.length === right.length &&
    left.every((entry, index) => entry === right[index])
  );
}
async function parseSystemRunPhase(opts) {
  const command = resolveSystemRunCommandRequest({
    command: opts.params.command,
    rawCommand: opts.params.rawCommand,
  });
  if (!command.ok) {
    await opts.sendInvokeResult({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: command.message,
      },
    });
    return null;
  }
  if (command.argv.length === 0) {
    await opts.sendInvokeResult({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "command required",
      },
    });
    return null;
  }
  const shellPayload = command.shellPayload;
  const shellWrapperInvocation = isShellWrapperInvocation(command.argv);
  const commandText = command.commandText;
  const approvalPlan =
    opts.params.systemRunPlan === void 0
      ? null
      : normalizeSystemRunApprovalPlan(opts.params.systemRunPlan);
  if (opts.params.systemRunPlan !== void 0 && !approvalPlan) {
    await opts.sendInvokeResult({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "systemRunPlan invalid",
      },
    });
    return null;
  }
  const agentId = normalizeOptionalString(opts.params.agentId);
  const requestedSessionKey = normalizeOptionalString(opts.params.sessionKey);
  const sessionKey = requestedSessionKey ?? "node";
  const runId = normalizeOptionalString(opts.params.runId) ?? crypto.randomUUID();
  const cwd = normalizeOptionalString(opts.params.cwd);
  const suppressNotifyOnExit = opts.params.suppressNotifyOnExit === true;
  const approvalSource = opts.params.approvalSource;
  if (
    approvalSource != null &&
    approvalSource !== "ask-fallback" &&
    approvalSource !== "auto-review"
  ) {
    await opts.sendInvokeResult({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "approvalSource invalid",
      },
    });
    return null;
  }
  const approvalDecision = resolveExecApprovalDecision(opts.params.approvalDecision);
  const approved = opts.params.approved === true;
  if (
    approvalSource != null &&
    (opts.params.approved !== void 0 || opts.params.approvalDecision !== void 0)
  ) {
    await opts.sendInvokeResult({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "approvalSource cannot be combined with explicit approval",
      },
    });
    return null;
  }
  const explicitApproval = approved || approvalDecision !== null;
  const forwardedDelayedApproval = approvalSource === "auto-review" || explicitApproval;
  if (approvalSource != null || explicitApproval) {
    if (
      !(
        approvalPlan !== null &&
        argvArraysMatch(approvalPlan.argv, command.argv) &&
        approvalPlan.commandText === commandText &&
        normalizeOptionalString(approvalPlan.cwd) === cwd &&
        normalizeOptionalString(approvalPlan.agentId) === agentId &&
        normalizeOptionalString(approvalPlan.sessionKey) === requestedSessionKey
      )
    ) {
      await opts.sendInvokeResult({
        ok: false,
        error: {
          code: "INVALID_REQUEST",
          message:
            approvalSource != null
              ? "approvalSource requires matching systemRunPlan"
              : "explicit approval requires matching systemRunPlan",
        },
      });
      return null;
    }
  }
  const delayedApprovalPolicySnapshot = forwardedDelayedApproval
    ? (approvalPlan?.policySnapshot ?? null)
    : null;
  if (forwardedDelayedApproval && !delayedApprovalPolicySnapshot) {
    await opts.sendInvokeResult({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "delayed approval requires a prepared policy snapshot",
      },
    });
    return null;
  }
  const envAssignmentKeys = extractEnvAssignmentKeysFromDispatchWrappers(command.argv);
  const envAssignmentDiagnostics = inspectHostExecEnvOverrides({
    overrides:
      envAssignmentKeys.length > 0
        ? Object.fromEntries(envAssignmentKeys.map((key) => [key, "1"]))
        : void 0,
    blockPathOverrides: true,
  });
  if (envAssignmentDiagnostics.rejectedOverrideBlockedKeys.length > 0) {
    await opts.sendInvokeResult({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: `SYSTEM_RUN_DENIED: command env assignment rejected (blocked env assignment keys: ${envAssignmentDiagnostics.rejectedOverrideBlockedKeys.join(", ")})`,
      },
    });
    return null;
  }
  const envOverrideDiagnostics = inspectHostExecEnvOverrides({
    overrides: opts.params.env ?? void 0,
    blockPathOverrides: true,
  });
  if (
    envOverrideDiagnostics.rejectedOverrideBlockedKeys.length > 0 ||
    envOverrideDiagnostics.rejectedOverrideInvalidKeys.length > 0
  ) {
    const details = [];
    if (envOverrideDiagnostics.rejectedOverrideBlockedKeys.length > 0)
      details.push(
        `blocked override keys: ${envOverrideDiagnostics.rejectedOverrideBlockedKeys.join(", ")}`,
      );
    if (envOverrideDiagnostics.rejectedOverrideInvalidKeys.length > 0)
      details.push(
        `invalid non-portable override keys: ${envOverrideDiagnostics.rejectedOverrideInvalidKeys.join(", ")}`,
      );
    await opts.sendInvokeResult({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: `SYSTEM_RUN_DENIED: environment override rejected (${details.join("; ")})`,
      },
    });
    return null;
  }
  const envOverrides = sanitizeSystemRunEnvOverrides({
    overrides: opts.params.env ?? void 0,
    shellWrapper: shellWrapperInvocation,
  });
  return {
    argv: command.argv,
    shellPayload,
    shellWrapperInvocation,
    commandText,
    commandPreview: command.previewText,
    approvalPlan,
    agentId,
    sessionKey,
    runId,
    execution: {
      sessionKey,
      runId,
      commandText,
      suppressNotifyOnExit,
    },
    approvalDecision,
    approvalSource: approvalSource ?? void 0,
    delayedApprovalPolicySnapshot,
    envOverrides,
    env: opts.sanitizeEnv(envOverrides),
    cwd,
    timeoutMs: opts.params.timeoutMs ?? void 0,
    needsScreenRecording: opts.params.needsScreenRecording === true,
    approved,
    suppressNotifyOnExit,
  };
}
async function evaluateSystemRunPolicyPhase(opts, parsed) {
  const cfg = await loadSystemRunConfig(opts);
  const effectivePolicy = await resolveEffectiveSystemRunExecPolicy({
    cfg,
    agentId: parsed.agentId,
    defaultSecurity: opts.resolveExecSecurity(void 0),
    defaultAsk: opts.resolveExecAsk(void 0),
    requireSocket: opts.preferMacAppExecHost,
  });
  const { agentExec, globalExec, approvals } = effectivePolicy;
  const currentPolicySnapshot = createExecApprovalPolicySnapshot({
    file: approvals.file,
    agentId: parsed.agentId,
  });
  if (
    parsed.delayedApprovalPolicySnapshot &&
    !isExecApprovalPolicySnapshotCurrent(
      parsed.delayedApprovalPolicySnapshot,
      currentPolicySnapshot,
    )
  ) {
    await sendSystemRunDenied(opts, parsed.execution, {
      reason: "approval-required",
      message: "SYSTEM_RUN_DENIED: exec approval policy changed; request approval again",
    });
    return null;
  }
  const evaluationPolicySnapshot = parsed.delayedApprovalPolicySnapshot ?? currentPolicySnapshot;
  const baseSecurity = effectivePolicy.security;
  const baseAsk = effectivePolicy.ask;
  const fallbackRequest = parsed.approvalSource === "ask-fallback";
  const security = fallbackRequest
    ? minSecurity(baseSecurity, approvals.agent.askFallback)
    : baseSecurity;
  const ask = fallbackRequest ? "off" : baseAsk;
  const autoAllowSkills = approvals.agent.autoAllowSkills;
  const { safeBins, safeBinProfiles, trustedSafeBinDirs } = resolveExecSafeBinRuntimePolicy({
    global: cfg.tools?.exec,
    local: agentExec,
    onWarning: warnWritableTrustedDirOnce,
  });
  const bins = autoAllowSkills ? await opts.skillBins.current() : [];
  const allowlistEvaluation = await evaluateSystemRunAllowlist({
    shellCommand: parsed.shellPayload,
    argv: parsed.argv,
    approvals,
    security,
    safeBins,
    safeBinProfiles,
    trustedSafeBinDirs,
    cwd: parsed.cwd,
    env: parsed.env,
    skillBins: bins,
    autoAllowSkills,
  });
  const {
    allowlistMatches,
    allowlistAuthorizationSatisfied,
    segments,
    segmentAllowlistEntries,
    segmentSatisfiedBy,
  } = allowlistEvaluation;
  let { analysisOk, allowlistSatisfied } = allowlistEvaluation;
  const strictInlineEval =
    agentExec?.strictInlineEval === true || cfg.tools?.exec?.strictInlineEval === true;
  const inlineEvalHit = strictInlineEval ? detectPolicyInlineEval(segments) : null;
  const isWindows = process.platform === "win32";
  const cmdDetectionArgv = resolveShellWrapperTransportArgv(parsed.argv) ?? parsed.argv;
  const cmdInvocation = opts.isCmdExeInvocation(cmdDetectionArgv);
  const durableApprovalSatisfied = hasDurableExecApproval({
    analysisOk,
    segmentAllowlistEntries,
    allowlist: approvals.allowlist,
    commandText: parsed.commandText,
  });
  const inlineEvalExecutableTrusted =
    inlineEvalHit !== null &&
    segmentAllowlistEntries.some((entry) => entry?.source === "allow-always");
  const forwardedAutoReview = parsed.approvalSource === "auto-review";
  let approvalDecision = forwardedAutoReview ? "allow-once" : parsed.approvalDecision;
  let approvalGrantSource = forwardedAutoReview
    ? "auto-review"
    : parsed.approved || approvalDecision !== null
      ? "explicit-approval"
      : null;
  let policy = evaluateSystemRunPolicy({
    security,
    ask,
    analysisOk,
    allowlistSatisfied,
    durableApprovalSatisfied: durableApprovalSatisfied || inlineEvalExecutableTrusted,
    approvalDecision,
    approved: parsed.approved,
    isWindows,
    cmdInvocation,
    shellWrapperInvocation: parsed.shellPayload !== null,
  });
  const requiresSecurityAuditSuppressionApproval =
    commandRequiresSecurityAuditSuppressionApproval({
      command: parsed.commandText,
      cwd: parsed.cwd,
      env: parsed.env,
      segments,
    }) && !(baseSecurity === "full" && baseAsk === "off" && !fallbackRequest);
  if (forwardedAutoReview && requiresSecurityAuditSuppressionApproval) {
    await sendSystemRunDenied(opts, parsed.execution, {
      reason: "approval-required",
      message: "SYSTEM_RUN_DENIED: explicit approval required",
    });
    return null;
  }
  if (requiresSecurityAuditSuppressionApproval && !policy.approvedByAsk)
    policy = {
      allowed: false,
      eventReason: "approval-required",
      errorMessage: "SYSTEM_RUN_DENIED: approval required",
      analysisOk: policy.analysisOk,
      allowlistSatisfied: policy.allowlistSatisfied,
      shellWrapperBlocked: policy.shellWrapperBlocked,
      windowsShellWrapperBlocked: policy.windowsShellWrapperBlocked,
      requiresAsk: true,
      approvalDecision: policy.approvalDecision,
      approvedByAsk: policy.approvedByAsk,
    };
  let autoReviewDeferredMessage;
  analysisOk = policy.analysisOk;
  allowlistSatisfied = policy.allowlistSatisfied;
  if (
    inlineEvalHit !== null &&
    !policy.approvedByAsk &&
    (policy.allowed ? true : policy.eventReason !== "security=deny")
  ) {
    await sendSystemRunDenied(opts, parsed.execution, {
      reason: "approval-required",
      message: `SYSTEM_RUN_DENIED: approval required (${describeInterpreterInlineEval(inlineEvalHit)} requires explicit approval in strictInlineEval mode)`,
    });
    return null;
  }
  if (!policy.allowed) {
    const [autoReviewSegment] = segments;
    const directAutoReviewArgvMatchesRequest =
      parsed.shellPayload !== null || argvArraysMatch(autoReviewSegment?.argv, parsed.argv);
    const autoReviewArgv =
      segments.length === 1 &&
      directAutoReviewArgvMatchesRequest &&
      (parsed.shellPayload === null ||
        (autoReviewSegment?.raw !== void 0 &&
          autoReviewSegment.raw.trim() === parsed.shellPayload.trim()))
        ? autoReviewSegment?.argv
        : void 0;
    if (
      !fallbackRequest &&
      effectivePolicy.autoReview &&
      ask !== "always" &&
      analysisOk &&
      autoReviewArgv !== void 0 &&
      parsed.approvalPlan !== null &&
      inlineEvalHit === null &&
      !requiresSecurityAuditSuppressionApproval &&
      policy.eventReason !== "security=deny"
    ) {
      const decision = await (
        await resolveSystemRunAutoReviewer({
          opts,
          cfg,
          agentId: parsed.agentId,
          agentExec,
          globalExec,
        })
      )({
        command: parsed.commandText,
        argv: autoReviewArgv,
        cwd: parsed.cwd,
        envKeys: Object.keys(parsed.envOverrides ?? {}).toSorted(),
        host: "node",
        reason: policy.eventReason === "allowlist-miss" ? "allowlist-miss" : "approval-required",
        analysis: {
          parsed: analysisOk,
          allowlistMatched: allowlistSatisfied,
          durableApprovalMatched: durableApprovalSatisfied,
          inlineEval: false,
          shellWrapper: parsed.shellWrapperInvocation,
        },
        agent: {
          id: parsed.agentId,
          sessionKey: parsed.sessionKey,
        },
      });
      if (decision.decision === "allow-once" && decision.risk === "low") {
        approvalDecision = "allow-once";
        approvalGrantSource = "auto-review";
        policy = evaluateSystemRunPolicy({
          security,
          ask,
          analysisOk,
          allowlistSatisfied,
          durableApprovalSatisfied: durableApprovalSatisfied || inlineEvalExecutableTrusted,
          approvalDecision,
          approved: true,
          isWindows,
          cmdInvocation,
          shellWrapperInvocation: parsed.shellPayload !== null,
        });
      } else
        autoReviewDeferredMessage = `${policy.errorMessage} (exec auto-review deferred to human approval: ${decision.rationale})`;
    }
  }
  if (!policy.allowed) {
    await sendSystemRunDenied(opts, parsed.execution, {
      reason: policy.eventReason,
      message: autoReviewDeferredMessage ?? policy.errorMessage,
    });
    return null;
  }
  if (policy.shellWrapperBlocked && !policy.approvedByAsk && !durableApprovalSatisfied) {
    await sendSystemRunDenied(opts, parsed.execution, {
      reason: "approval-required",
      message: "SYSTEM_RUN_DENIED: approval required",
    });
    return null;
  }
  const durableApprovalRequirement = resolveDurableExecApprovalRequirement({
    durableApprovalRequired:
      security === "allowlist" &&
      durableApprovalSatisfied &&
      !policy.approvedByAsk &&
      (!policy.analysisOk || !policy.allowlistSatisfied),
    allowlist: approvals.allowlist,
    commandText: parsed.commandText,
  });
  const approvalContextBound = policy.approvedByAsk || fallbackRequest;
  const hardenedPaths = hardenApprovedExecutionPaths({
    approvedByAsk: approvalContextBound,
    argv: parsed.argv,
    shellCommand: parsed.shellPayload,
    cwd: parsed.cwd,
  });
  if (!hardenedPaths.ok) {
    await sendSystemRunDenied(opts, parsed.execution, {
      reason: "approval-required",
      message: hardenedPaths.message,
    });
    return null;
  }
  const approvedCwdSnapshot = approvalContextBound ? hardenedPaths.approvedCwdSnapshot : void 0;
  if (approvalContextBound && hardenedPaths.cwd && !approvedCwdSnapshot) {
    await sendSystemRunDenied(opts, parsed.execution, {
      reason: "approval-required",
      message: APPROVAL_CWD_DRIFT_DENIED_MESSAGE,
    });
    return null;
  }
  const plannedAllowlistArgv = resolvePlannedAllowlistArgv({
    security,
    shellCommand: parsed.shellPayload,
    policy,
    segments,
  });
  if (plannedAllowlistArgv === null) {
    await sendSystemRunDenied(opts, parsed.execution, {
      reason: "execution-plan-miss",
      message: "SYSTEM_RUN_DENIED: execution plan mismatch",
    });
    return null;
  }
  return {
    ...parsed,
    approvalDecision,
    argv: hardenedPaths.argv,
    cwd: hardenedPaths.cwd,
    approvals,
    evaluationPolicySnapshot,
    security,
    ask,
    policy,
    approvalGrantSource,
    durableApprovalSatisfied,
    durableApprovalRequirement,
    strictInlineEval,
    inlineEvalHit,
    allowlistMatches,
    analysisOk,
    allowlistSatisfied,
    allowlistAuthorizationSatisfied,
    safeBins,
    safeBinProfiles,
    trustedSafeBinDirs,
    skillBins: bins,
    autoAllowSkills,
    segments,
    segmentSatisfiedBy,
    authorizationPlan: allowlistEvaluation.authorizationPlan,
    plannedAllowlistArgv: plannedAllowlistArgv ?? void 0,
    isWindows,
    approvedCwdSnapshot,
  };
}
async function revalidateSystemRunApprovedPathBindings(opts, phase) {
  if (
    phase.approvedCwdSnapshot &&
    !revalidateApprovedCwdSnapshot({ snapshot: phase.approvedCwdSnapshot })
  ) {
    logWarn(`security: system.run approval cwd drift blocked (runId=${phase.runId})`);
    await sendSystemRunDenied(opts, phase.execution, {
      reason: "approval-required",
      message: APPROVAL_CWD_DRIFT_DENIED_MESSAGE,
    });
    return false;
  }
  if (
    phase.approvalPlan?.mutableFileOperand &&
    !revalidateApprovedMutableFileOperand({
      snapshot: phase.approvalPlan.mutableFileOperand,
      argv: phase.argv,
      cwd: phase.cwd,
    })
  ) {
    logWarn(`security: system.run approval script drift blocked (runId=${phase.runId})`);
    await sendSystemRunDenied(opts, phase.execution, {
      reason: "approval-required",
      message: APPROVAL_SCRIPT_OPERAND_DRIFT_DENIED_MESSAGE,
    });
    return false;
  }
  return true;
}
async function executeSystemRunPhase(opts, phase) {
  if (!(await revalidateSystemRunApprovedPathBindings(opts, phase))) return;
  const expectedMutableFileOperand = phase.approvalPlan
    ? resolveMutableFileOperandSnapshotSync({
        argv: phase.argv,
        cwd: phase.cwd,
        shellCommand: phase.shellPayload,
      })
    : null;
  if (expectedMutableFileOperand && !expectedMutableFileOperand.ok) {
    logWarn(`security: system.run approval script binding blocked (runId=${phase.runId})`);
    await sendSystemRunDenied(opts, phase.execution, {
      reason: "approval-required",
      message: expectedMutableFileOperand.message,
    });
    return;
  }
  if (expectedMutableFileOperand?.snapshot && !phase.approvalPlan?.mutableFileOperand) {
    logWarn(`security: system.run approval script binding missing (runId=${phase.runId})`);
    await sendSystemRunDenied(opts, phase.execution, {
      reason: "approval-required",
      message: APPROVAL_SCRIPT_OPERAND_BINDING_DENIED_MESSAGE,
    });
    return;
  }
  const execArgv = await resolveSystemRunExecArgv({
    plannedAllowlistArgv: phase.plannedAllowlistArgv,
    argv: phase.argv,
    security: phase.security,
    approvals: phase.approvals,
    safeBins: phase.safeBins,
    safeBinProfiles: phase.safeBinProfiles,
    trustedSafeBinDirs: phase.trustedSafeBinDirs,
    skillBins: phase.skillBins,
    autoAllowSkills: phase.autoAllowSkills,
    isWindows: phase.isWindows,
    policy: phase.policy,
    shellCommand: phase.shellPayload,
    segments: phase.segments,
    segmentSatisfiedBy: phase.segmentSatisfiedBy,
    authorizationPlan: phase.authorizationPlan,
    cwd: phase.cwd,
    env: phase.env,
  });
  if (!execArgv) {
    await sendSystemRunDenied(opts, phase.execution, {
      reason: "execution-plan-miss",
      message: "SYSTEM_RUN_DENIED: execution plan mismatch",
    });
    return;
  }
  if (opts.preferMacAppExecHost) {
    const macApprovalSource =
      phase.approvalSource ??
      (phase.approvalGrantSource === "auto-review" ? "auto-review" : void 0);
    const macApprovalDecision = macApprovalSource
      ? null
      : phase.approvalGrantSource === "explicit-approval" && phase.approvalDecision === null
        ? "allow-once"
        : phase.approvalDecision;
    const execRequest = {
      command: execArgv,
      rawCommand: execArgv === phase.argv ? phase.commandText || null : formatExecCommand(execArgv),
      cwd: phase.cwd ?? null,
      env: phase.envOverrides ?? null,
      timeoutMs: phase.timeoutMs ?? null,
      needsScreenRecording: phase.needsScreenRecording,
      agentId: phase.agentId ?? null,
      sessionKey: phase.sessionKey ?? null,
      approvalDecision: macApprovalDecision,
      approvalSource: macApprovalSource,
      ...(phase.approvalGrantSource ? { policySnapshot: phase.evaluationPolicySnapshot } : {}),
    };
    const response = await opts.runViaMacAppExecHost({
      approvals: phase.approvals,
      request: execRequest,
    });
    if (!response) {
      if (opts.execHostEnforced || !opts.execHostFallbackAllowed) {
        await sendSystemRunDenied(opts, phase.execution, {
          reason: "companion-unavailable",
          message: "COMPANION_APP_UNAVAILABLE: macOS app exec host unreachable",
        });
        return;
      }
    } else if (!response.ok) {
      await sendSystemRunDenied(opts, phase.execution, {
        reason: normalizeDeniedReason(response.error.reason),
        message: response.error.message,
      });
      return;
    } else {
      const result = response.payload;
      await sendSystemRunCompleted(opts, phase.execution, result, JSON.stringify(result));
      return;
    }
  }
  if (phase.needsScreenRecording) {
    await sendSystemRunDenied(opts, phase.execution, {
      reason: "permission:screenRecording",
      message: "PERMISSION_MISSING: screenRecording",
    });
    return;
  }
  const allowAlwaysDecision =
    phase.policy.approvalDecision === "allow-always"
      ? resolveAllowAlwaysPersistenceDecision({
          segments: phase.segments,
          cwd: phase.cwd,
          env: phase.env,
          platform: process.platform,
          commandText: phase.commandText,
          strictInlineEval: phase.strictInlineEval,
          authorizationPlan: phase.authorizationPlan,
          runtimePayload: phase.inlineEvalHit !== null,
        })
      : void 0;
  const authorizationSource =
    phase.approvalSource === "ask-fallback"
      ? "ask-fallback"
      : phase.approvalSource === "auto-review"
        ? "auto-review"
        : (phase.approvalGrantSource ?? "current-policy");
  const delayedAuthorization =
    authorizationSource === "explicit-approval" || authorizationSource === "auto-review";
  const authorization = {
    source: authorizationSource,
    security: phase.security,
    ask: phase.ask,
    allowlistSatisfied: phase.allowlistAuthorizationSatisfied || phase.durableApprovalSatisfied,
    ...(delayedAuthorization ? { policySnapshot: phase.evaluationPolicySnapshot } : {}),
    requireAutoAllowSkills: phase.segmentSatisfiedBy.includes("skills"),
    requireExactCommandApproval: phase.durableApprovalRequirement === "exact-command",
    requireDurableAllowlistApproval: phase.durableApprovalRequirement === "segment-allowlist",
  };
  try {
    await (opts.commitExecAuthorization ?? commitExecAuthorizationLocked)({
      agentId: phase.agentId,
      matches: phase.allowlistMatches,
      command: phase.commandText,
      resolvedPath: resolveApprovalAuditTrustPath(phase.segments[0]?.resolution ?? null, phase.cwd),
      authorization,
      ...(allowAlwaysDecision ? { allowAlwaysDecision } : {}),
    });
  } catch {
    logWarn(`security: system.run approval state write failed (runId=${phase.runId})`);
    await sendSystemRunDenied(opts, phase.execution, {
      reason: "approval-state-write-failed",
      message: APPROVAL_STATE_WRITE_FAILED_MESSAGE,
    });
    return;
  }
  if (!(await revalidateSystemRunApprovedPathBindings(opts, phase))) return;
  const result = await opts.runCommand(execArgv, phase.cwd, phase.env, phase.timeoutMs);
  applyOutputTruncation(result);
  await sendSystemRunCompleted(
    opts,
    phase.execution,
    result,
    JSON.stringify({
      exitCode: result.exitCode,
      timedOut: result.timedOut,
      success: result.success,
      stdout: result.stdout,
      stderr: result.stderr,
      error: result.error ?? null,
    }),
  );
}
/** Executes a validated system.run request, emitting lifecycle events and approvals. */
async function handleSystemRunInvoke(opts) {
  const parsed = await parseSystemRunPhase(opts);
  if (!parsed) return;
  const policyPhase = await evaluateSystemRunPolicyPhase(opts, parsed);
  if (!policyPhase) return;
  await executeSystemRunPhase(opts, policyPhase);
}
//#endregion
//#region src/node-host/invoke-agent-cli-claude-handler.ts
async function handleClaudeCliNodeInvoke(params) {
  if (!params.runtime.claudePath) {
    await params.deps.sendErrorResult(
      params.client,
      params.frame,
      "UNAVAILABLE",
      "Claude CLI agent runs are unavailable",
    );
    return;
  }
  const claudePath = params.runtime.claudePath;
  let request;
  try {
    request = await decodeClaudeCliNodeRunParams(params.frame.paramsJSON);
  } catch (error) {
    await params.deps.sendInvalidRequestResult(params.client, params.frame, error);
    return;
  }
  const approvalCommand = [claudePath, ...request.argv];
  const preparedApproval = buildSystemRunApprovalPlan({
    command: approvalCommand,
    ...(request.cwd ? { cwd: request.cwd } : {}),
    ...(request.agentId ? { agentId: request.agentId } : {}),
    ...(request.sessionKey ? { sessionKey: request.sessionKey } : {}),
  });
  if (!preparedApproval.ok) {
    await params.deps.sendErrorResult(
      params.client,
      params.frame,
      "INVALID_REQUEST",
      preparedApproval.message,
    );
    return;
  }
  const { getRuntimeConfig: getNodeRuntimeConfig } = await import("./config/config.js");
  const execPolicy = await resolveEffectiveSystemRunExecPolicy({
    cfg: getNodeRuntimeConfig(),
    agentId: request.agentId,
    defaultSecurity: params.deps.resolveExecSecurity(void 0),
    defaultAsk: params.deps.resolveExecAsk(void 0),
    requireSocket: false,
  });
  const approvalPlan = {
    ...preparedApproval.plan,
    policySnapshot: createExecApprovalPolicySnapshot({
      file: execPolicy.approvals.file,
      agentId: request.agentId,
    }),
  };
  let runResult;
  await (params.runtime.handleSystemRun ?? handleSystemRunInvoke)({
    client: params.client,
    params: {
      command: approvalCommand,
      ...(request.cwd ? { cwd: request.cwd } : {}),
      ...(request.env ? { env: request.env } : {}),
      ...(request.agentId ? { agentId: request.agentId } : {}),
      ...(request.sessionKey ? { sessionKey: request.sessionKey } : {}),
      ...(request.systemRunPlan ? { systemRunPlan: request.systemRunPlan } : {}),
      ...(request.approvalDecision ? { approvalDecision: request.approvalDecision } : {}),
      timeoutMs: request.timeoutMs,
    },
    skillBins: params.skillBins,
    execHostEnforced: false,
    execHostFallbackAllowed: true,
    resolveExecSecurity: params.deps.resolveExecSecurity,
    resolveExecAsk: params.deps.resolveExecAsk,
    isCmdExeInvocation: params.deps.isCmdExeInvocation,
    sanitizeEnv: params.deps.sanitizeEnv,
    runCommand: async (approvalArgv, cwd, env, timeoutMs) => {
      runResult = await runClaudeCliNodeCommand({
        client: params.client,
        frame: params.frame,
        request,
        argv: approvalArgv,
        cwd,
        env,
        timeoutMs,
        signal: params.runtime.signal,
      });
      return runResult;
    },
    runViaMacAppExecHost: params.deps.runViaMacAppExecHost,
    sendNodeEvent: async () => {},
    buildExecEventPayload: params.deps.buildExecEventPayload,
    sendInvokeResult: async (result) => {
      if (
        !result.ok &&
        !request.approvalDecision &&
        result.error?.message?.includes("approval required")
      ) {
        await params.deps.sendInvokeResult(params.client, params.frame, {
          ok: true,
          payloadJSON: JSON.stringify({
            approvalRequired: true,
            systemRunPlan: approvalPlan,
            security: execPolicy.security,
            ask: execPolicy.ask,
          }),
        });
        return;
      }
      if (!result.ok || !runResult) {
        await params.deps.sendInvokeResult(params.client, params.frame, result);
        return;
      }
      const payload = {
        exitCode: runResult.exitCode ?? 1,
        stderrTail: runResult.stderr,
        truncated: runResult.truncated,
        ...(runResult.timedOut
          ? { timeoutKind: runResult.noOutputTimedOut ? "idle" : "hard" }
          : {}),
      };
      await params.deps.sendInvokeResult(params.client, params.frame, {
        ok: true,
        payloadJSON: JSON.stringify(payload),
      });
    },
    sendExecFinishedEvent: async () => {},
    preferMacAppExecHost: false,
  });
}
//#endregion
//#region src/node-host/mcp.ts
/** Process-lifetime MCP clients owned by the headless node host. */
const NODE_MCP_PLUGIN_ID = "node-mcp";
const NODE_MCP_DESCRIPTION_MAX_CHARS = 1024;
const NODE_MCP_NAME_MAX_CHARS = 64;
const NODE_MCP_SERVER_FRAGMENT_MAX_CHARS = 31;
const NODE_MCP_ERROR_MAX_CHARS = 1024;
const NODE_MCP_MAX_DESCRIPTORS = 128;
const NODE_MCP_MAX_DESCRIPTOR_BYTES = 1024 * 1024;
const NODE_MCP_MAX_CATALOG_BYTES = 10 * 1024 * 1024;
var NodeHostMcpError = class extends Error {
  constructor(code, message, options) {
    super(message, options);
    this.name = "NodeHostMcpError";
    this.code = code;
  }
};
function defaultWarn(message) {
  process.stderr.write(`${message}\n`);
}
function formatMcpError(error) {
  return truncateUtf16Safe(
    redactSensitiveUrlLikeString(toErrorObject(error, "MCP request failed").message),
    NODE_MCP_ERROR_MAX_CHARS,
  );
}
function sanitizeDescriptorFragment(raw, fallback) {
  const normalized =
    raw
      .trim()
      .replace(/[^A-Za-z0-9_-]+/g, "_")
      .replace(/^[_-]+|[_-]+$/g, "") || fallback;
  return /^[A-Za-z]/.test(normalized) ? normalized : `${fallback}_${normalized}`;
}
function buildDescriptorBaseName(serverName, toolName) {
  const server = sanitizeDescriptorFragment(serverName, "mcp").slice(
    0,
    NODE_MCP_SERVER_FRAGMENT_MAX_CHARS,
  );
  const toolBudget = Math.max(1, NODE_MCP_NAME_MAX_CHARS - server.length - 1);
  return `${server}_${sanitizeDescriptorFragment(toolName, "tool").slice(0, toolBudget)}`;
}
function reserveDescriptorName(baseName, usedNames) {
  let index = 1;
  while (true) {
    const suffix = index === 1 ? "" : `_${index}`;
    const candidate = `${baseName.slice(0, NODE_MCP_NAME_MAX_CHARS - suffix.length)}${suffix}`;
    const key = normalizeLowercaseStringOrEmpty(candidate);
    if (!usedNames.has(key)) {
      usedNames.add(key);
      return candidate;
    }
    index += 1;
  }
}
function normalizeInputSchema(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {
    type: "object",
    properties: {},
    additionalProperties: true,
  };
}
/** Builds provider-safe MCP descriptors in stable server/tool order. */
function buildNodeMcpToolDescriptors(listedTools) {
  const usedNames = /* @__PURE__ */ new Set();
  const descriptors = [];
  let catalogBytes = 0;
  for (const { serverName, tool } of listedTools.toSorted(
    (left, right) =>
      left.serverName.localeCompare(right.serverName) ||
      left.tool.name.localeCompare(right.tool.name),
  )) {
    const toolName = tool.name.trim();
    const descriptor = {
      pluginId: NODE_MCP_PLUGIN_ID,
      name: reserveDescriptorName(buildDescriptorBaseName(serverName, toolName), usedNames),
      description: truncateUtf16Safe(
        sanitizeMcpMetadataText(tool.description) ||
          sanitizeMcpMetadataText(toolName) ||
          "MCP tool",
        NODE_MCP_DESCRIPTION_MAX_CHARS,
      ),
      parameters: normalizeInputSchema(tool.inputSchema),
      command: NODE_MCP_TOOLS_CALL_COMMAND,
      mcp: {
        server: serverName,
        tool: toolName,
      },
    };
    const descriptorBytes = Buffer.byteLength(JSON.stringify(descriptor));
    if (
      descriptorBytes > NODE_MCP_MAX_DESCRIPTOR_BYTES ||
      catalogBytes + descriptorBytes > NODE_MCP_MAX_CATALOG_BYTES
    )
      continue;
    descriptors.push(descriptor);
    catalogBytes += descriptorBytes;
    if (descriptors.length >= NODE_MCP_MAX_DESCRIPTORS) break;
  }
  return descriptors;
}
function isOAuthServer(config) {
  return config.auth === "oauth" || Boolean(config.oauth);
}
function shouldExposeTool(config, toolName) {
  const include = config.toolFilter?.include ?? [];
  const exclude = config.toolFilter?.exclude ?? [];
  if (
    include.length > 0 &&
    !include.some((pattern) => matchesMcpToolFilterPattern(pattern, toolName))
  )
    return false;
  return !exclude.some((pattern) => matchesMcpToolFilterPattern(pattern, toolName));
}
async function connectWithTimeout(client, transport, timeoutMs) {
  let timer;
  try {
    await Promise.race([
      client.connect(transport),
      new Promise((_, reject) => {
        timer = setTimeout(
          () =>
            reject(
              /* @__PURE__ */ new Error(`MCP server connection timed out after ${timeoutMs}ms`),
            ),
          timeoutMs,
        );
        timer.unref?.();
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
async function withAbort(promise, signal) {
  if (!signal) return await promise;
  if (signal.aborted) throw new Error("MCP startup aborted");
  return await new Promise((resolve, reject) => {
    const onAbort = () => reject(/* @__PURE__ */ new Error("MCP startup aborted"));
    signal.addEventListener("abort", onAbort, { once: true });
    promise.then(
      (value) => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error) => {
        signal.removeEventListener("abort", onAbort);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}
async function listAllTools(client, timeoutMs, signal) {
  const tools = [];
  let cursor;
  do {
    const page = await withAbort(
      client.listTools(cursor ? { cursor } : void 0, { timeout: timeoutMs }),
      signal,
    );
    tools.push(...page.tools);
    cursor = page.nextCursor;
  } while (cursor);
  return tools;
}
function resolveCallTimeoutMs(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : NODE_MCP_TOOL_CALL_TIMEOUT_MS;
}
function resolveServerToolCallTimeoutMs(config) {
  if (
    typeof config.requestTimeoutMs === "number" &&
    Number.isFinite(config.requestTimeoutMs) &&
    config.requestTimeoutMs > 0
  )
    return Math.floor(config.requestTimeoutMs);
  if (typeof config.timeout === "number" && Number.isFinite(config.timeout) && config.timeout > 0)
    return Math.floor(config.timeout * 1e3);
  return NODE_MCP_TOOL_CALL_TIMEOUT_MS;
}
function isMcpTimeoutError(error) {
  return Boolean(
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === ErrorCode.RequestTimeout,
  );
}
/** Starts configured MCP servers once for the lifetime of the node host. */
async function startNodeHostMcpManager(servers, deps = {}) {
  const warn = deps.warn ?? defaultWarn;
  const createClient =
    deps.createClient ??
    (() =>
      new Client(
        {
          name: "openclaw-node-host",
          version: VERSION,
        },
        { jsonSchemaValidator: createMcpJsonSchemaValidator() },
      ));
  const resolveTransport = deps.resolveTransport ?? resolveMcpTransport;
  const configured = listEnabledNodeHostMcpServers(servers);
  const sessions = /* @__PURE__ */ new Map();
  const listedTools = [];
  await Promise.all(
    configured.map(async ([serverName, config]) => {
      if (isOAuthServer(config)) {
        warn(`node host MCP server "${serverName}" skipped: OAuth is not supported`);
        return;
      }
      let client;
      let resolved;
      let session;
      try {
        resolved = resolveTransport(serverName, config);
        if (!resolved) {
          warn(`node host MCP server "${serverName}" skipped: invalid or unsupported transport`);
          return;
        }
        client = createClient(serverName);
        session = {
          client,
          connected: false,
          tools: /* @__PURE__ */ new Set(),
          toolCallTimeoutMs: resolveServerToolCallTimeoutMs(config),
          detachStderr: resolved.detachStderr,
        };
        client.onclose = () => {
          if (session) session.connected = false;
        };
        await withAbort(
          connectWithTimeout(client, resolved.transport, resolved.connectionTimeoutMs),
          deps.signal,
        );
        session.connected = true;
        const tools = (await listAllTools(client, resolved.requestTimeoutMs, deps.signal)).filter(
          (tool) => {
            const toolName = tool.name.trim();
            return Boolean(toolName) && shouldExposeTool(config, toolName);
          },
        );
        for (const tool of tools) {
          const toolName = tool.name.trim();
          session.tools.add(toolName);
          listedTools.push({
            serverName,
            tool: {
              ...tool,
              name: toolName,
            },
          });
        }
        sessions.set(serverName, session);
      } catch (error) {
        if (session) session.connected = false;
        resolved?.detachStderr?.();
        if (client) await Promise.allSettled([client.close()]);
        if (!deps.signal?.aborted)
          warn(`node host MCP server "${serverName}" failed: ${formatMcpError(error)}`);
      }
    }),
  );
  const descriptors = buildNodeMcpToolDescriptors(listedTools);
  if (descriptors.length < listedTools.length)
    warn(
      `node host MCP catalog bounded: published ${descriptors.length} of ${listedTools.length} tools`,
    );
  let closed = false;
  return {
    configuredServerCount: configured.length,
    descriptors,
    async callMcpTool(params) {
      const session = sessions.get(params.server);
      if (!session?.connected)
        throw new NodeHostMcpError(
          "MCP_SERVER_UNAVAILABLE",
          `MCP server "${params.server}" is unavailable`,
        );
      if (!session.tools.has(params.tool))
        throw new NodeHostMcpError(
          "MCP_TOOL_UNAVAILABLE",
          `MCP tool "${params.tool}" is unavailable on server "${params.server}"`,
        );
      try {
        return await session.client.callTool(
          {
            name: params.tool,
            arguments: params.arguments ?? {},
          },
          void 0,
          { timeout: Math.min(resolveCallTimeoutMs(params.timeoutMs), session.toolCallTimeoutMs) },
        );
      } catch (error) {
        if (!session.connected)
          throw new NodeHostMcpError(
            "MCP_SERVER_UNAVAILABLE",
            `MCP server "${params.server}" disconnected`,
            { cause: error },
          );
        if (isMcpTimeoutError(error))
          throw new NodeHostMcpError("MCP_TOOL_TIMEOUT", formatMcpError(error), { cause: error });
        throw new NodeHostMcpError("MCP_TOOL_ERROR", formatMcpError(error), { cause: error });
      }
    },
    async close() {
      if (closed) return;
      closed = true;
      for (const session of sessions.values()) {
        session.connected = false;
        session.detachStderr?.();
      }
      await Promise.allSettled(Array.from(sessions.values(), (session) => session.client.close()));
      sessions.clear();
    },
  };
}
function listEnabledNodeHostMcpServers(servers) {
  return Object.entries(normalizeConfiguredMcpServers(servers))
    .filter(
      ([serverName, config]) =>
        serverName.length > 0 && serverName === serverName.trim() && config.enabled !== false,
    )
    .map(([serverName, config]) => [serverName, config])
    .toSorted(([left], [right]) => left.localeCompare(right));
}
//#endregion
//#region src/node-host/plugin-node-host.ts
/**
 * Plugin node-host command registry bridge.
 *
 * Node hosts load the active plugin registry, expose registered capabilities
 * and commands, and dispatch incoming node-host commands by exact command id.
 */
const loadPluginRegistryLoaderModule = createLazyRuntimeModule(
  () => import("./runtime-registry-loader-CACAaShx.js"),
);
/** Ensure plugin registry data is loaded before node-host command dispatch. */
async function ensureNodeHostPluginRegistry(params) {
  (await loadPluginRegistryLoaderModule()).ensurePluginRegistryLoaded({
    scope: "all",
    config: params.config,
    activationSourceConfig: params.config,
    env: params.env,
  });
}
/** List registered node-host capabilities and command ids in deterministic order. */
function listRegisteredNodeHostCapsAndCommands(context, options = {}) {
  const registry = getActivePluginRegistry();
  const caps = /* @__PURE__ */ new Set();
  const commands = /* @__PURE__ */ new Set();
  const nodePluginTools = /* @__PURE__ */ new Map();
  for (const entry of registry?.nodeHostCommands ?? []) {
    if (entry.command.duplex === true && options.includeDuplex === false) continue;
    if (entry.command.isAvailable?.(context) === false) continue;
    if (entry.command.cap) caps.add(entry.command.cap);
    commands.add(entry.command.command);
    const agentTool = buildNodePluginToolDescriptor(entry);
    if (agentTool) nodePluginTools.set(`${agentTool.pluginId}\0${agentTool.name}`, agentTool);
  }
  return {
    caps: [...caps].toSorted((left, right) => left.localeCompare(right)),
    commands: [...commands].toSorted((left, right) => left.localeCompare(right)),
    nodePluginTools: [...nodePluginTools.values()].toSorted(
      (left, right) =>
        left.pluginId.localeCompare(right.pluginId) || left.name.localeCompare(right.name),
    ),
  };
}
function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}
function normalizeRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function isProviderSafeToolName(value) {
  return /^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(value);
}
function buildNodePluginToolDescriptor(entry) {
  const agentTool = entry.command.agentTool;
  if (!agentTool) return null;
  const name = normalizeString(agentTool.name);
  const description = normalizeString(agentTool.description);
  if (!isProviderSafeToolName(name) || !description) return null;
  const mcpServer = normalizeString(agentTool.mcp?.server);
  const mcpTool = normalizeString(agentTool.mcp?.tool);
  return {
    pluginId: entry.pluginId,
    name,
    description,
    parameters: normalizeRecord(agentTool.parameters) ?? {
      type: "object",
      properties: {},
      additionalProperties: true,
    },
    command: entry.command.command,
    ...(mcpServer && mcpTool
      ? {
          mcp: {
            server: mcpServer,
            tool: mcpTool,
          },
        }
      : {}),
  };
}
/** Invoke a registered node-host plugin command, or return null for unknown commands. */
async function invokeRegisteredNodeHostCommand(command, paramsJSON, io) {
  const match = (getActivePluginRegistry()?.nodeHostCommands ?? []).find(
    (entry) => entry.command.command === command,
  );
  if (!match) return null;
  if (match.command.duplex === true) {
    if (!io) throw new Error(`node command requires duplex transport: ${command}`);
    return await match.command.handle(paramsJSON, io);
  }
  return await match.command.handle(paramsJSON);
}
function isRegisteredNodeHostCommandDuplex(command) {
  return (
    (getActivePluginRegistry()?.nodeHostCommands ?? []).find(
      (entry) => entry.command.command === command,
    )?.command.duplex === true
  );
}
//#endregion
//#region src/node-host/skills.ts
/** Resolve an advertised node skill directory locator to this node's canonical path. */
function resolveNodeHostedSkillDirectory(locator, nodeId) {
  if (!locator.startsWith("node://")) return null;
  const prefix = `node://${encodeURIComponent(nodeId)}/skills/`;
  const name = locator.startsWith(prefix) ? locator.slice(prefix.length) : "";
  if (!NODE_SKILL_NAME_RE.test(name))
    throw new Error("INVALID_REQUEST: node skill cwd locator is invalid for this node");
  try {
    const skillsDir = fs.realpathSync(path.join(resolveConfigDir(), "skills"));
    const skillDir = fs.realpathSync(path.join(skillsDir, name));
    if (
      !isPathInside(skillsDir, skillDir) ||
      !fs.statSync(path.join(skillDir, "SKILL.md")).isFile()
    )
      throw new Error("missing SKILL.md");
    return skillDir;
  } catch {
    throw new Error("INVALID_REQUEST: node skill cwd locator is unavailable");
  }
}
function listCandidateSkillFiles(skillsDir, warn) {
  let entries;
  try {
    entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  } catch (error) {
    warn(`node host skill scan skipped (${skillsDir}): ${String(error)}`);
    return [];
  }
  const candidates = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;
    const filePath = path.join(skillsDir, entry.name, "SKILL.md");
    try {
      if (fs.statSync(filePath, { throwIfNoEntry: false })?.isFile()) candidates.push(filePath);
    } catch (error) {
      warn(`node host skill skipped (${filePath}): ${String(error)}`);
    }
  }
  return candidates.toSorted((left, right) => left.localeCompare(right, "en"));
}
function scanNodeHostedSkills(options = {}) {
  const skillsDir = path.resolve(options.skillsDir ?? path.join(resolveConfigDir(), "skills"));
  const warn = options.warn ?? ((message) => process.stderr.write(`${message}\n`));
  const rootSkillFile = path.join(skillsDir, "SKILL.md");
  try {
    if (fs.statSync(rootSkillFile, { throwIfNoEntry: false })?.isFile())
      warn(`node host skill skipped (${rootSkillFile}): skills must use a named child directory`);
  } catch (error) {
    warn(`node host skill scan skipped (${rootSkillFile}): ${String(error)}`);
  }
  const candidates = listCandidateSkillFiles(skillsDir, warn);
  if (candidates.length === 0) return [];
  const loadedSkills = [];
  const frontmatterByFilePath = /* @__PURE__ */ new Map();
  for (const candidate of candidates) {
    const loaded = loadSkillsFromDirSafe({
      dir: path.dirname(candidate),
      source: "openclaw-node",
      maxBytes: NODE_SKILL_MAX_CONTENT_BYTES,
    });
    const skill = loaded.skills.find(
      (entry) => path.resolve(entry.filePath) === path.resolve(candidate),
    );
    if (skill) {
      loadedSkills.push(skill);
      const frontmatter = loaded.frontmatterByFilePath.get(skill.filePath);
      if (frontmatter) frontmatterByFilePath.set(skill.filePath, frontmatter);
      continue;
    }
    let size;
    try {
      size = fs.statSync(candidate, { throwIfNoEntry: false })?.size;
    } catch (error) {
      warn(`node host skill skipped (${candidate}): ${String(error)}`);
      continue;
    }
    warn(
      `node host skill skipped (${candidate}): ${typeof size === "number" && size > 65536 ? `exceeds ${NODE_SKILL_MAX_CONTENT_BYTES} bytes` : "has invalid or missing frontmatter"}`,
    );
  }
  const descriptors = [];
  const seenNames = /* @__PURE__ */ new Set();
  let totalBytes = 0;
  for (const skill of loadedSkills.toSorted((left, right) =>
    left.name.localeCompare(right.name, "en"),
  )) {
    const frontmatter = frontmatterByFilePath.get(skill.filePath);
    if (
      frontmatter?.name?.trim() !== skill.name ||
      frontmatter.description?.trim() !== skill.description ||
      path.basename(skill.baseDir) !== skill.name
    ) {
      warn(
        `node host skill skipped (${skill.filePath}): directory, name, and frontmatter must match`,
      );
      continue;
    }
    let content;
    try {
      content = fs.readFileSync(skill.filePath, "utf8");
    } catch (error) {
      warn(`node host skill skipped (${skill.filePath}): ${String(error)}`);
      continue;
    }
    const contentBytes = Buffer.byteLength(content, "utf8");
    if (
      !NODE_SKILL_NAME_RE.test(skill.name) ||
      !skill.description ||
      skill.description.length > 1024 ||
      contentBytes > 65536
    ) {
      warn(`node host skill skipped (${skill.filePath}): invalid name, description, or size`);
      continue;
    }
    if (seenNames.has(skill.name)) {
      warn(`node host skill skipped (${skill.filePath}): duplicate name ${skill.name}`);
      continue;
    }
    if (descriptors.length >= 64) {
      warn(`node host skill skipped (${skill.filePath}): exceeds 64 skills`);
      continue;
    }
    if (totalBytes + contentBytes > 524288) {
      warn(
        `node host skill skipped (${skill.filePath}): exceeds ${NODE_SKILL_MAX_TOTAL_BYTES} total bytes`,
      );
      continue;
    }
    seenNames.add(skill.name);
    totalBytes += contentBytes;
    descriptors.push({
      name: skill.name,
      description: skill.description,
      content,
    });
  }
  return descriptors;
}
//#endregion
//#region src/node-host/invoke.ts
/** Node-host command dispatcher for system commands, approvals, env policy, and plugin commands. */
const OUTPUT_CAP = 2e5;
const MCP_TEXT_CONTENT_MAX_BYTES = 1024 * 1024;
const MCP_TEXT_TRUNCATION_MARKER = "\n[truncated: MCP text content exceeded 1 MB]";
const MCP_INVOKE_PAYLOAD_MAX_BYTES = 20 * 1024 * 1024;
const MCP_PAYLOAD_TRUNCATION_MARKER = "[truncated: MCP result exceeded 20 MB]";
const MCP_ERROR_MESSAGE_MAX_CHARS = 1024;
const OUTPUT_EVENT_TAIL = 2e4;
const DEFAULT_NODE_PATH$1 = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const execHostEnforced =
  normalizeLowercaseStringOrEmpty(process.env.OPENCLAW_NODE_EXEC_HOST ?? "") === "app";
const execHostFallbackAllowed =
  normalizeLowercaseStringOrEmpty(process.env.OPENCLAW_NODE_EXEC_FALLBACK ?? "") !== "0";
const preferMacAppExecHost = process.platform === "darwin" && execHostEnforced;
function resolveNodeSkillCwdParam(params, nodeId) {
  if (typeof params.cwd !== "string") return params;
  const resolved = resolveNodeHostedSkillDirectory(params.cwd, nodeId);
  return resolved
    ? {
        ...params,
        cwd: resolved,
      }
    : params;
}
function buildEnvOverrideRejectionMessage(params) {
  const details = [];
  if (params.rejectedOverrideBlockedKeys.length > 0)
    details.push(`blocked override keys: ${params.rejectedOverrideBlockedKeys.join(", ")}`);
  if (params.rejectedOverrideInvalidKeys.length > 0)
    details.push(
      `invalid non-portable override keys: ${params.rejectedOverrideInvalidKeys.join(", ")}`,
    );
  return `SYSTEM_RUN_DENIED: environment override rejected (${details.join("; ")})`;
}
function buildSystemRunPrepareCoverageEnv(params) {
  const diagnostics = inspectHostExecEnvOverrides({
    overrides: params.env ?? void 0,
    blockPathOverrides: true,
  });
  if (
    diagnostics.rejectedOverrideBlockedKeys.length > 0 ||
    diagnostics.rejectedOverrideInvalidKeys.length > 0
  )
    return {
      ok: false,
      message: buildEnvOverrideRejectionMessage(diagnostics),
    };
  return {
    ok: true,
    env: sanitizeEnv(
      sanitizeSystemRunEnvOverrides({
        overrides: params.env ?? void 0,
        shellWrapper: isShellWrapperInvocation(params.argv),
      }),
    ),
  };
}
async function buildSystemRunAllowAlwaysCoverage(params) {
  const cwd = params.cwd ?? void 0;
  const shellWrapper = extractShellWrapperCommand(params.argv, params.rawCommand);
  if (shellWrapper.isWrapper) {
    if (!shellWrapper.command)
      return {
        complete: false,
        patterns: [],
      };
    const authorizationPlan = await planShellAuthorization({
      command: shellWrapper.command,
      cwd,
      env: params.env,
      platform: process.platform,
    });
    if (!authorizationPlan.ok)
      return {
        complete: false,
        patterns: [],
      };
    const candidates = authorizationPlan.groups.flatMap((group) => group.candidates);
    const reusableSegments = candidates
      .filter((candidate) => candidate.allowAlways)
      .map((candidate) => candidate.sourceSegment);
    const coverage = resolveAllowAlwaysPatternCoverage({
      segments: reusableSegments,
      cwd,
      env: params.env,
      platform: process.platform,
      strictInlineEval: params.strictInlineEval,
    });
    return {
      ...coverage,
      complete: coverage.complete && reusableSegments.length === candidates.length,
    };
  }
  const analysis = analyzeArgvCommand({
    argv: params.argv,
    cwd,
    env: params.env,
  });
  if (!analysis.ok)
    return {
      complete: false,
      patterns: [],
    };
  return resolveAllowAlwaysPatternCoverage({
    segments: analysis.segments,
    cwd,
    env: params.env,
    platform: process.platform,
    strictInlineEval: params.strictInlineEval,
  });
}
function resolveExecSecurity(value) {
  return value === "deny" || value === "allowlist" || value === "full" ? value : "allowlist";
}
function isCmdExeInvocation(argv) {
  const token = argv[0]?.trim();
  if (!token) return false;
  const base = normalizeLowercaseStringOrEmpty(path.win32.basename(token));
  return base === "cmd.exe" || base === "cmd";
}
function resolveExecAsk(value) {
  return value === "off" || value === "on-miss" || value === "always" ? value : "on-miss";
}
/** Builds a sanitized execution environment with controlled PATH and approved overrides. */
function sanitizeEnv(overrides) {
  return sanitizeHostExecEnv({
    overrides,
    blockPathOverrides: true,
  });
}
function truncateOutput(raw, maxChars) {
  if (raw.length <= maxChars)
    return {
      text: raw,
      truncated: false,
    };
  return {
    text: `... (truncated) ${sliceUtf16Safe(raw, raw.length - maxChars)}`,
    truncated: true,
  };
}
function redactExecApprovals(file) {
  const socketPath = file.socket?.path?.trim();
  return {
    ...file,
    socket: socketPath ? { path: socketPath } : void 0,
  };
}
function requireExecApprovalsBaseHash(params, snapshot) {
  const baseHash = typeof params.baseHash === "string" ? params.baseHash.trim() : "";
  if (!snapshot.exists) {
    if (baseHash && baseHash !== snapshot.hash)
      throw new Error("INVALID_REQUEST: exec approvals changed; reload and retry");
    return;
  }
  if (!snapshot.hash)
    throw new Error("INVALID_REQUEST: exec approvals base hash unavailable; reload and retry");
  if (!baseHash)
    throw new Error("INVALID_REQUEST: exec approvals base hash required; reload and retry");
  if (baseHash !== snapshot.hash)
    throw new Error("INVALID_REQUEST: exec approvals changed; reload and retry");
}
function clarifyNodeExecCwdSpawnError(error, cwd) {
  const message = error.message;
  if (!cwd || (error.code !== "ENOENT" && error.code !== "ENOTDIR")) return message;
  let reason;
  try {
    if (fs.statSync(cwd).isDirectory()) return message;
    reason = "is not a directory";
  } catch (statError) {
    const statCode = statError.code;
    if (statCode !== "ENOENT" && statCode !== "ENOTDIR") return message;
    reason =
      statCode === "ENOTDIR" || error.code === "ENOTDIR" ? "is not a directory" : "does not exist";
  }
  return `node exec working directory ${reason} on the node host: ${cwd} (os reported: ${message})`;
}
async function runCommand(argv, cwd, env, timeoutMs) {
  try {
    const result = await runCommandWithTimeout(argv, {
      baseEnv: env,
      cwd,
      killProcessTree: true,
      maxCombinedOutputBytes: OUTPUT_CAP,
      maxOutputBytes: OUTPUT_CAP,
      outputCapture: "head",
      input: Buffer.alloc(0),
      timeoutMs: timeoutMs && timeoutMs > 0 ? timeoutMs : void 0,
    });
    const timedOut = result.termination === "timeout";
    const exitCode = result.code ?? void 0;
    return {
      exitCode,
      timedOut,
      success: exitCode === 0 && !timedOut,
      stdout: result.stdout,
      stderr: result.stderr,
      error: null,
      truncated: Boolean(result.stdoutTruncatedBytes || result.stderrTruncatedBytes),
    };
  } catch (err) {
    return {
      exitCode: void 0,
      timedOut: false,
      success: false,
      stdout: "",
      stderr: "",
      error: clarifyNodeExecCwdSpawnError(err, cwd),
      truncated: false,
    };
  }
}
function resolveEnvPath(env) {
  return (env?.PATH ?? env?.Path ?? process.env.PATH ?? process.env.Path ?? DEFAULT_NODE_PATH$1)
    .split(path.delimiter)
    .filter(Boolean);
}
function resolveExecutable(bin, env) {
  if (bin.includes("/") || bin.includes("\\")) return null;
  const extensions =
    process.platform === "win32"
      ? (
          env?.PATHEXT ??
          env?.PathExt ??
          env?.Pathext ??
          process.env.PATHEXT ??
          process.env.PathExt ??
          ".EXE;.CMD;.BAT;.COM"
        )
          .split(";")
          .map((ext) => normalizeLowercaseStringOrEmpty(ext))
      : [""];
  for (const dir of resolveEnvPath(env))
    for (const ext of extensions) {
      const candidate = path.join(dir, bin + ext);
      if (fs.existsSync(candidate)) return candidate;
    }
  return null;
}
async function handleSystemWhich(params, env) {
  const bins = normalizeStringEntries(params.bins);
  const found = {};
  for (const bin of bins) {
    const pathLocal = resolveExecutable(bin, env);
    if (pathLocal) found[bin] = pathLocal;
  }
  return { bins: found };
}
function buildExecEventPayload(payload) {
  if (!payload.output) return payload;
  const trimmed = payload.output.trim();
  if (!trimmed) return payload;
  const { text } = truncateOutput(trimmed, OUTPUT_EVENT_TAIL);
  return {
    ...payload,
    output: text,
  };
}
async function sendExecFinishedEvent(params) {
  const combined = [params.result.stdout, params.result.stderr, params.result.error]
    .filter(Boolean)
    .join("\n");
  await sendNodeEvent(
    params.client,
    "exec.finished",
    buildExecEventPayload({
      sessionKey: params.sessionKey,
      runId: params.runId,
      host: "node",
      command: params.commandText,
      exitCode: params.result.exitCode ?? void 0,
      timedOut: params.result.timedOut,
      success: params.result.success,
      output: combined,
      suppressNotifyOnExit: params.suppressNotifyOnExit,
    }),
  );
}
async function runViaMacAppExecHost(params) {
  const { approvals, request } = params;
  return await requestExecHostViaSocket({
    socketPath: approvals.socketPath,
    token: approvals.token,
    request,
  });
}
async function sendJsonPayloadResult(client, frame, payload) {
  await sendInvokeResult(client, frame, {
    ok: true,
    payloadJSON: JSON.stringify(payload),
  });
}
async function sendMcpPayloadResult(client, frame, payload) {
  await sendInvokeResult(client, frame, {
    ok: true,
    payload,
  });
}
async function sendRawPayloadResult(client, frame, payloadJSON) {
  await sendInvokeResult(client, frame, {
    ok: true,
    payloadJSON,
  });
}
async function sendErrorResult(client, frame, code, message) {
  await sendInvokeResult(client, frame, {
    ok: false,
    error: {
      code,
      message,
    },
  });
}
async function sendInvalidRequestResult(client, frame, err) {
  await sendErrorResult(client, frame, "INVALID_REQUEST", String(err));
}
function classifyExecApprovalsStorageError(err) {
  return (err && typeof err === "object" && "code" in err ? err.code : null) === "file_lock_timeout"
    ? "TIMEOUT"
    : "UNAVAILABLE";
}
async function sendExecApprovalsStorageErrorResult(client, frame, err) {
  await sendErrorResult(client, frame, classifyExecApprovalsStorageError(err), String(err));
}
/** Handles one node-host command invocation payload and returns serialized results. */
async function handleInvoke(frame, client, skillBins, mcpManager, runtime = {}) {
  try {
    await dispatchInvoke(frame, client, skillBins, mcpManager, runtime);
  } catch (err) {
    logWarn(
      `node host invoke failed (command=${frame.command ?? "unknown"}, id=${frame.id}): ${String(err)}`,
    );
    try {
      await sendErrorResult(client, frame, "UNAVAILABLE", "node invocation failed");
    } catch (sendErr) {
      logWarn(
        `node host invoke failure response could not be sent (id=${frame.id}): ${String(sendErr)}`,
      );
    }
  }
}
async function dispatchInvoke(frame, client, skillBins, mcpManager, runtime = {}) {
  const command = frame.command ?? "";
  if (command === "system.execApprovals.get") {
    try {
      const snapshot = await ensureExecApprovalsSnapshot();
      await sendJsonPayloadResult(client, frame, {
        path: snapshot.path,
        exists: snapshot.exists,
        hash: snapshot.hash,
        file: redactExecApprovals(snapshot.file),
      });
    } catch (err) {
      await sendExecApprovalsStorageErrorResult(client, frame, err);
    }
    return;
  }
  if (command === "system.execApprovals.set") {
    let params;
    let normalized;
    try {
      params = decodeParams(frame.paramsJSON);
      if (!params.file || typeof params.file !== "object")
        throw new Error("INVALID_REQUEST: exec approvals file required");
      normalized = normalizeExecApprovals(params.file);
    } catch (err) {
      await sendInvalidRequestResult(client, frame, err);
      return;
    }
    let snapshot;
    try {
      snapshot = readExecApprovalsSnapshot();
    } catch (err) {
      await sendExecApprovalsStorageErrorResult(client, frame, err);
      return;
    }
    try {
      requireExecApprovalsBaseHash(params, snapshot);
    } catch (err) {
      await sendInvalidRequestResult(client, frame, err);
      return;
    }
    let nextSnapshot;
    try {
      nextSnapshot = await updateExecApprovals({
        baseHash: snapshot.hash,
        update: (current) =>
          mergeExecApprovalsSocketDefaults({
            normalized,
            current,
          }),
      });
    } catch (err) {
      await sendExecApprovalsStorageErrorResult(client, frame, err);
      return;
    }
    if (!nextSnapshot) {
      await sendErrorResult(
        client,
        frame,
        "INVALID_REQUEST",
        "INVALID_REQUEST: exec approvals changed; reload and retry",
      );
      return;
    }
    await sendJsonPayloadResult(client, frame, {
      path: nextSnapshot.path,
      exists: nextSnapshot.exists,
      hash: nextSnapshot.hash,
      file: redactExecApprovals(nextSnapshot.file),
    });
    return;
  }
  if (command === "system.which") {
    try {
      const params = decodeParams(frame.paramsJSON);
      if (!Array.isArray(params.bins)) throw new Error("INVALID_REQUEST: bins required");
      await sendJsonPayloadResult(
        client,
        frame,
        await handleSystemWhich(params, sanitizeEnv(void 0)),
      );
    } catch (err) {
      await sendInvalidRequestResult(client, frame, err);
    }
    return;
  }
  if (command === "fs.listDir") {
    try {
      const params = decodeParams(frame.paramsJSON);
      if (params.path !== void 0 && typeof params.path !== "string")
        throw new Error("INVALID_REQUEST: path must be a string");
      await sendJsonPayloadResult(client, frame, await listHostDirectories(params.path));
    } catch (err) {
      await sendInvalidRequestResult(client, frame, err);
    }
    return;
  }
  if (command === "mcp.tools.call.v1") {
    await handleMcpToolsCall(frame, client, mcpManager);
    return;
  }
  if (command === "agent.cli.claude.run.v1") {
    await handleClaudeCliNodeInvoke({
      frame,
      client,
      skillBins,
      runtime,
      deps: {
        sendErrorResult,
        sendInvalidRequestResult,
        sendInvokeResult,
        resolveExecSecurity,
        resolveExecAsk,
        isCmdExeInvocation,
        sanitizeEnv,
        runViaMacAppExecHost,
        buildExecEventPayload,
      },
    });
    return;
  }
  try {
    const pluginResult = await invokeRegisteredNodeHostCommand(
      command,
      frame.paramsJSON,
      runtime.pluginCommandIo,
    );
    if (pluginResult !== null) {
      await sendRawPayloadResult(client, frame, pluginResult);
      return;
    }
  } catch (err) {
    await sendInvalidRequestResult(client, frame, err);
    return;
  }
  if (command === "system.run.prepare") {
    try {
      const params = resolveNodeSkillCwdParam(decodeParams(frame.paramsJSON), frame.nodeId);
      const prepared = buildSystemRunApprovalPlan(params);
      if (!prepared.ok) {
        await sendErrorResult(client, frame, "INVALID_REQUEST", prepared.message);
        return;
      }
      const prepareEnv = buildSystemRunPrepareCoverageEnv({
        argv: prepared.plan.argv,
        env: params.env ?? void 0,
      });
      if (!prepareEnv.ok) {
        await sendErrorResult(client, frame, "INVALID_REQUEST", prepareEnv.message);
        return;
      }
      const { getRuntimeConfig } = await import("./config/config.js");
      const execPolicy = await resolveEffectiveSystemRunExecPolicy({
        cfg: getRuntimeConfig(),
        agentId: prepared.plan.agentId ?? void 0,
        defaultSecurity: resolveExecSecurity(void 0),
        defaultAsk: resolveExecAsk(void 0),
        requireSocket: preferMacAppExecHost,
      });
      await sendJsonPayloadResult(client, frame, {
        plan: {
          ...prepared.plan,
          policySnapshot: createExecApprovalPolicySnapshot({
            file: execPolicy.approvals.file,
            agentId: prepared.plan.agentId ?? void 0,
          }),
        },
        execPolicy: {
          security: execPolicy.security,
          ask: execPolicy.ask,
        },
        allowAlwaysCoverage: await buildSystemRunAllowAlwaysCoverage({
          argv: prepared.plan.argv,
          rawCommand: typeof params.rawCommand === "string" ? params.rawCommand : null,
          cwd: prepared.plan.cwd,
          env: prepareEnv.env,
          strictInlineEval: params.strictInlineEval === true,
        }),
      });
    } catch (err) {
      await sendInvalidRequestResult(client, frame, err);
    }
    return;
  }
  if (command !== "system.run") {
    await sendErrorResult(client, frame, "UNAVAILABLE", "command not supported");
    return;
  }
  let params;
  try {
    params = resolveNodeSkillCwdParam(decodeParams(frame.paramsJSON), frame.nodeId);
  } catch (err) {
    await sendInvalidRequestResult(client, frame, err);
    return;
  }
  if (!Array.isArray(params.command) || params.command.length === 0) {
    await sendErrorResult(client, frame, "INVALID_REQUEST", "command required");
    return;
  }
  await handleSystemRunInvoke({
    client,
    params,
    skillBins,
    execHostEnforced,
    execHostFallbackAllowed,
    resolveExecSecurity,
    resolveExecAsk,
    isCmdExeInvocation,
    sanitizeEnv,
    runCommand,
    runViaMacAppExecHost,
    sendNodeEvent,
    buildExecEventPayload,
    sendInvokeResult: async (result) => {
      await sendInvokeResult(client, frame, result);
    },
    sendExecFinishedEvent: async ({
      sessionKey,
      runId,
      commandText,
      result,
      suppressNotifyOnExit,
    }) => {
      await sendExecFinishedEvent({
        client,
        sessionKey,
        runId,
        commandText,
        result,
        suppressNotifyOnExit,
      });
    },
    preferMacAppExecHost,
  });
}
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function decodeMcpToolsCallParams(raw) {
  const value = decodeParams(raw);
  if (!isRecord(value)) throw new Error("INVALID_REQUEST: MCP tool params must be an object");
  const server = typeof value.server === "string" ? value.server.trim() : "";
  const tool = typeof value.tool === "string" ? value.tool.trim() : "";
  if (!server || !tool) throw new Error("INVALID_REQUEST: server and tool required");
  if (value.arguments !== void 0 && !isRecord(value.arguments))
    throw new Error("INVALID_REQUEST: arguments must be an object");
  return {
    server,
    tool,
    ...(value.arguments ? { arguments: value.arguments } : {}),
  };
}
function normalizeMcpContentBlock(block) {
  if (!isRecord(block)) return null;
  return mcpContentBlockToAgentContent(block);
}
function serializedJsonBytes(value) {
  return Buffer.byteLength(JSON.stringify(value));
}
/** Keeps MCP text/image content while bounding text sent through node.invoke. */
function boundMcpToolResultPayload(result) {
  const normalizedBlocks = result.content
    .map(normalizeMcpContentBlock)
    .filter((block) => block !== null);
  const totalTextBytes = normalizedBlocks.reduce(
    (total, block) =>
      total +
      (isRecord(block) && block.type === "text" && typeof block.text === "string"
        ? Buffer.byteLength(block.text)
        : 0),
    0,
  );
  let remainingTextBytes =
    totalTextBytes > MCP_TEXT_CONTENT_MAX_BYTES
      ? MCP_TEXT_CONTENT_MAX_BYTES - Buffer.byteLength(MCP_TEXT_TRUNCATION_MARKER)
      : MCP_TEXT_CONTENT_MAX_BYTES;
  let markedTruncated = false;
  const textBoundedContent = [];
  for (const block of normalizedBlocks) {
    if (
      block.type === "image" &&
      typeof block.data === "string" &&
      typeof block.mimeType === "string"
    ) {
      textBoundedContent.push(block);
      continue;
    }
    if (block.type !== "text" || typeof block.text !== "string") continue;
    if (totalTextBytes <= MCP_TEXT_CONTENT_MAX_BYTES) {
      textBoundedContent.push(block);
      continue;
    }
    if (markedTruncated) continue;
    const text = truncateUtf8Prefix(block.text, remainingTextBytes);
    remainingTextBytes -= Buffer.byteLength(text);
    const blockWasTruncated = text.length < block.text.length;
    if (text || blockWasTruncated)
      textBoundedContent.push({
        ...block,
        text: blockWasTruncated ? `${text}${MCP_TEXT_TRUNCATION_MARKER}` : text,
      });
    if (blockWasTruncated || remainingTextBytes === 0) {
      if (!blockWasTruncated)
        textBoundedContent.push({
          type: "text",
          text: MCP_TEXT_TRUNCATION_MARKER.trimStart(),
        });
      markedTruncated = true;
    }
  }
  const payloadMarker = {
    type: "text",
    text: MCP_PAYLOAD_TRUNCATION_MARKER,
  };
  const reservedMarkerBytes = serializedJsonBytes(payloadMarker) + 1;
  let usedBytes = Buffer.byteLength('{"content":[]}');
  let payloadTruncated = false;
  const content = [];
  for (const block of textBoundedContent) {
    const blockBytes = serializedJsonBytes(block) + (content.length > 0 ? 1 : 0);
    if (usedBytes + blockBytes + reservedMarkerBytes > MCP_INVOKE_PAYLOAD_MAX_BYTES) {
      payloadTruncated = true;
      continue;
    }
    content.push(block);
    usedBytes += blockBytes;
  }
  let structuredContent;
  if (result.structuredContent) {
    const structuredBytes =
      Buffer.byteLength(',"structuredContent":') + serializedJsonBytes(result.structuredContent);
    if (usedBytes + structuredBytes + reservedMarkerBytes <= MCP_INVOKE_PAYLOAD_MAX_BYTES)
      structuredContent = result.structuredContent;
    else payloadTruncated = true;
  }
  if (payloadTruncated) content.push(payloadMarker);
  return {
    content,
    ...(structuredContent ? { structuredContent } : {}),
  };
}
function mcpToolErrorMessage(result) {
  return truncateUtf16Safe(
    result.content
      .filter((block) => isRecord(block) && block.type === "text" && typeof block.text === "string")
      .map((block) => block.text.trim())
      .filter(Boolean)
      .join("\n") || "MCP tool returned an error",
    1024,
  );
}
async function handleMcpToolsCall(frame, client, mcpManager) {
  if (!mcpManager) {
    await sendErrorResult(client, frame, "MCP_SERVER_UNAVAILABLE", "node host MCP is unavailable");
    return;
  }
  let params;
  try {
    params = decodeMcpToolsCallParams(frame.paramsJSON);
  } catch (error) {
    await sendInvalidRequestResult(client, frame, error);
    return;
  }
  try {
    const result = await mcpManager.callMcpTool({
      ...params,
      timeoutMs: frame.timeoutMs ?? void 0,
    });
    if (result.isError) {
      await sendErrorResult(client, frame, "MCP_TOOL_ERROR", mcpToolErrorMessage(result));
      return;
    }
    await sendMcpPayloadResult(client, frame, boundMcpToolResultPayload(result));
  } catch (error) {
    if (error instanceof NodeHostMcpError) {
      await sendErrorResult(client, frame, error.code, error.message);
      return;
    }
    await sendErrorResult(
      client,
      frame,
      "MCP_TOOL_ERROR",
      truncateUtf16Safe(String(error), MCP_ERROR_MESSAGE_MAX_CHARS),
    );
  }
}
function decodeParams(raw) {
  if (!raw) throw new Error("INVALID_REQUEST: paramsJSON required");
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("INVALID_REQUEST: paramsJSON malformed JSON");
  }
}
async function sendInvokeResult(client, frame, result) {
  try {
    await client.request("node.invoke.result", buildNodeInvokeResultParams(frame, result));
  } catch {}
}
function buildNodeInvokeResultParams(frame, result) {
  const params = {
    id: frame.id,
    nodeId: frame.nodeId,
    ok: result.ok,
  };
  if (result.payload !== void 0) params.payload = result.payload;
  if (typeof result.payloadJSON === "string") params.payloadJSON = result.payloadJSON;
  if (result.error) params.error = result.error;
  return params;
}
function buildNodeEventParams(event, payload) {
  const payloadJSON = payload === void 0 ? void 0 : JSON.stringify(payload);
  return {
    event,
    payloadJSON: typeof payloadJSON === "string" ? payloadJSON : null,
  };
}
async function sendNodeEvent(client, event, payload) {
  try {
    await client.request("node.event", buildNodeEventParams(event, payload));
  } catch {}
}
//#endregion
//#region src/node-host/runtime.ts
/** Transport-independent CLI node-host runtime shared by Gateway and app workers. */
const DEFAULT_NODE_PATH = "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
const MAX_PENDING_INVOKE_INPUT_BYTES = 64 * 1024;
function dispatchNodeInvokeInput(target, seq, payloadJSON) {
  if (!target || target.inputFailed || seq < target.nextInputSeq) return false;
  if (seq > target.nextInputSeq)
    logDebug(`node-host: input sequence gap: expected ${target.nextInputSeq}, received ${seq}`);
  target.nextInputSeq = seq + 1;
  if (target.input) {
    target.input(payloadJSON);
    return true;
  }
  if (!target.pendingInput.push(payloadJSON)) {
    target.inputFailed = true;
    logDebug("node-host: aborted invoke after buffered input exceeded 64 KiB");
    return false;
  }
  return true;
}
function registerNodeInvokeInputHandler(target, input) {
  if (target.inputFailed) return;
  target.input = input;
  for (const pending of target.pendingInput.drain()) input(pending);
}
function resolveExecutablePathFromEnv(bin, pathEnv) {
  if (bin.includes("/") || bin.includes("\\")) return null;
  return resolveExecutableFromPathEnv(bin, pathEnv) ?? null;
}
function resolveExecutableTrustPathFromEnv(bin, pathEnv) {
  const resolvedPath = resolveExecutablePathFromEnv(bin, pathEnv);
  if (!resolvedPath) return null;
  try {
    return fs.realpathSync(resolvedPath);
  } catch {
    return resolvedPath;
  }
}
function resolveSkillBinTrustEntries(bins, pathEnv) {
  const trustEntries = [];
  const seen = /* @__PURE__ */ new Set();
  for (const raw of bins) {
    const name = raw.trim();
    if (!name) continue;
    const resolvedPath = resolveExecutableTrustPathFromEnv(name, pathEnv);
    if (!resolvedPath) continue;
    const key = `${name}\u0000${resolvedPath}`;
    if (seen.has(key)) continue;
    seen.add(key);
    trustEntries.push({
      name,
      resolvedPath,
    });
  }
  return trustEntries.toSorted(
    (left, right) =>
      left.name.localeCompare(right.name) || left.resolvedPath.localeCompare(right.resolvedPath),
  );
}
var SkillBinsCache = class {
  constructor(client, pathEnv) {
    this.client = client;
    this.pathEnv = pathEnv;
    this.bins = [];
    this.lastRefresh = 0;
    this.ttlMs = 9e4;
  }
  async current(force = false) {
    if (force || Date.now() - this.lastRefresh > this.ttlMs) await this.refresh();
    return this.bins;
  }
  async refresh() {
    try {
      const res = await this.client.request("skills.bins", {});
      const bins = Array.isArray(res?.bins) ? res.bins.map((bin) => String(bin)) : [];
      this.bins = resolveSkillBinTrustEntries(bins, this.pathEnv);
      this.lastRefresh = Date.now();
    } catch {
      if (!this.lastRefresh) this.bins = [];
    }
  }
};
function ensureNodePathEnv() {
  ensureOpenClawCliOnPath({ pathEnv: process.env.PATH ?? "" });
  const current = process.env.PATH ?? "";
  if (current.trim()) return current;
  process.env.PATH = DEFAULT_NODE_PATH;
  return DEFAULT_NODE_PATH;
}
function createInventory(params) {
  const pluginTools = [...params.pluginTools, ...(params.mcpManager?.descriptors ?? [])].toSorted(
    (left, right) => {
      const a = left;
      const b = right;
      return (
        (a.pluginId ?? "").localeCompare(b.pluginId ?? "") ||
        (a.name ?? "").localeCompare(b.name ?? "")
      );
    },
  );
  return {
    skills: params.skills,
    pluginTools,
  };
}
async function prepareNodeHostRuntime(params) {
  const config = params?.config ?? getRuntimeConfig();
  const env = params?.env ?? process.env;
  await ensureNodeHostPluginRegistry({
    config,
    env,
  });
  const pathEnv = ensureNodePathEnv();
  env.PATH = pathEnv;
  const duplexEnabled =
    params?.enableAgentRuns === true || params?.enableDuplexPluginCommands === true;
  const pluginNodeHost = listRegisteredNodeHostCapsAndCommands(
    {
      config,
      env,
    },
    { includeDuplex: duplexEnabled },
  );
  const claudePath =
    params?.enableAgentRuns === true && config.nodeHost?.agentRuns?.claude?.enabled === true
      ? resolveExecutableTrustPathFromEnv("claude", pathEnv)
      : null;
  const skills = config.nodeHost?.skills?.enabled === false ? null : scanNodeHostedSkills();
  return {
    manifest: {
      caps: [.../* @__PURE__ */ new Set(["system", "mcp", ...pluginNodeHost.caps])].toSorted(),
      commands: [
        .../* @__PURE__ */ new Set([
          ...NODE_SYSTEM_RUN_COMMANDS,
          ...NODE_EXEC_APPROVALS_COMMANDS,
          NODE_FS_LIST_DIR_COMMAND,
          NODE_MCP_TOOLS_CALL_COMMAND,
          ...(claudePath ? [NODE_AGENT_CLI_CLAUDE_RUN_COMMAND] : []),
          ...pluginNodeHost.commands,
        ]),
      ].toSorted(),
      pathEnv,
    },
    initialInventory: createInventory({
      skills,
      pluginTools: pluginNodeHost.nodePluginTools,
    }),
    start({ client, onInventoryChanged }) {
      const mcpAbort = new AbortController();
      const skillBins = new SkillBinsCache(client, pathEnv);
      const activeInvokes = /* @__PURE__ */ new Map();
      let manager;
      const startup = startNodeHostMcpManager(config.nodeHost?.mcp?.servers, {
        signal: mcpAbort.signal,
      }).then((resolved) => {
        manager = resolved;
        onInventoryChanged?.(
          createInventory({
            skills,
            pluginTools: pluginNodeHost.nodePluginTools,
            mcpManager: manager,
          }),
        );
        return resolved;
      });
      return {
        async invoke(frame) {
          const duplexCommand = duplexEnabled && isRegisteredNodeHostCommandDuplex(frame.command);
          const controller =
            (claudePath && frame.command === "agent.cli.claude.run.v1") || duplexCommand
              ? new AbortController()
              : void 0;
          const active = controller
            ? {
                controller,
                nextInputSeq: 0,
                pendingInput: new BoundedBuffer(
                  MAX_PENDING_INVOKE_INPUT_BYTES,
                  {
                    mode: "fail-closed",
                    onOverflow: () =>
                      controller.abort(
                        /* @__PURE__ */ new Error(
                          "terminal input exceeded the 64 KiB pre-spawn buffer",
                        ),
                      ),
                  },
                  (payload) => Buffer.byteLength(payload, "utf8"),
                ),
                inputFailed: false,
              }
            : void 0;
          if (active) activeInvokes.set(frame.id, active);
          const progress = duplexCommand
            ? createNodeInvokeProgressWriter({
                client,
                frame,
                idleTimeoutMs: NODE_DUPLEX_INVOKE_IDLE_TIMEOUT_MS,
                onError: () => controller?.abort(),
              })
            : void 0;
          progress?.startHeartbeats();
          const pluginCommandIo =
            controller && active && progress
              ? {
                  signal: controller.signal,
                  emitChunk: async (chunk) => await progress.write(chunk),
                  onInput: (callback) => {
                    if (activeInvokes.get(frame.id) === active)
                      registerNodeInvokeInputHandler(active, callback);
                  },
                }
              : void 0;
          try {
            await handleInvoke(frame, client, skillBins, manager, {
              ...(claudePath ? { claudePath } : {}),
              ...(controller ? { signal: controller.signal } : {}),
              ...(pluginCommandIo ? { pluginCommandIo } : {}),
            });
          } finally {
            progress?.stop();
            await progress?.flush();
            if (active && activeInvokes.get(frame.id) === active) activeInvokes.delete(frame.id);
          }
        },
        handleInput(invokeId, seq, payloadJSON) {
          if (!dispatchNodeInvokeInput(activeInvokes.get(invokeId), seq, payloadJSON))
            logDebug(`node-host: dropped inactive or duplicate input for invoke ${invokeId}`);
        },
        cancel(invokeId) {
          activeInvokes.get(invokeId)?.controller.abort();
        },
        cancelAll() {
          for (const active of activeInvokes.values()) active.controller.abort();
          activeInvokes.clear();
        },
        async close() {
          this.cancelAll();
          mcpAbort.abort();
          await (manager ?? (await startup.catch(() => void 0)))?.close();
        },
      };
    },
  };
}
//#endregion
//#region src/node-host/runner.ts
/** CLI runner for node-host stdin/stdout command dispatch. */
function resolveNodeHostGatewayPlatform(platform) {
  switch (platform) {
    case "darwin":
      return "macos";
    case "win32":
      return "windows";
    case "linux":
      return "linux";
    default:
      return "unknown";
  }
}
function resolveNodeHostGatewayDeviceFamily(platform) {
  switch (platform) {
    case "darwin":
      return "Mac";
    case "win32":
      return "Windows";
    case "linux":
      return "Linux";
    default:
      return;
  }
}
function writeStderrLine(message) {
  process.stderr.write(`${message}\n`);
}
const NODE_HOST_EXIT_ON_RECONNECT_PAUSE_CODES = /* @__PURE__ */ new Set([
  ConnectErrorDetailCodes.AUTH_TOKEN_MISSING,
  ConnectErrorDetailCodes.AUTH_TOKEN_MISMATCH,
  ConnectErrorDetailCodes.AUTH_BOOTSTRAP_TOKEN_INVALID,
  ConnectErrorDetailCodes.AUTH_PASSWORD_MISSING,
  ConnectErrorDetailCodes.AUTH_PASSWORD_MISMATCH,
  ConnectErrorDetailCodes.CLIENT_VERSION_MISMATCH,
]);
function shouldExitNodeHostOnReconnectPaused(detailCode) {
  return detailCode !== null && NODE_HOST_EXIT_ON_RECONNECT_PAUSE_CODES.has(detailCode);
}
function formatNodeHostReconnectPausedMessage(info, params) {
  const detail = info.detailCode ? ` detail=${info.detailCode}` : "";
  const reason = info.reason.trim() || "no close reason";
  const action = params?.exiting ? "exiting for supervisor restart" : "waiting for operator action";
  return `node host gateway reconnect paused after close (${info.code}): ${reason}${detail}; ${action}`;
}
function handleNodeHostReconnectPaused(info, deps = {}) {
  const shouldExit = shouldExitNodeHostOnReconnectPaused(info.detailCode);
  (deps.writeLine ?? writeStderrLine)(
    formatNodeHostReconnectPausedMessage(info, { exiting: shouldExit }),
  );
  if (!shouldExit) return;
  (deps.exit ?? ((code) => process.exit(code)))(1);
}
function isUnsupportedNodePluginToolsUpdateError(error) {
  return (
    error instanceof GatewayClientRequestError &&
    error.gatewayCode === "INVALID_REQUEST" &&
    error.message.includes("unknown method: node.pluginTools.update")
  );
}
function isUnsupportedNodeSkillsUpdateError(error) {
  return (
    error instanceof GatewayClientRequestError &&
    error.gatewayCode === "INVALID_REQUEST" &&
    error.message.includes("unknown method: node.skills.update")
  );
}
async function publishNodePluginTools(client, tools) {
  if (tools.length === 0) return;
  try {
    await client.request("node.pluginTools.update", { tools });
  } catch (error) {
    if (isUnsupportedNodePluginToolsUpdateError(error)) return;
    writeStderrLine(`node host plugin tool publish failed: ${String(error)}`);
  }
}
async function publishNodeSkills(client, skills) {
  try {
    await client.request("node.skills.update", { skills });
  } catch (error) {
    if (isUnsupportedNodeSkillsUpdateError(error)) return;
    writeStderrLine(`node host skill publish failed: ${String(error)}`);
  }
}
async function resolveNodeHostGatewayCredentials(params) {
  return await resolveGatewayConnectionAuth({
    config:
      (params.config.gateway?.mode === "remote" ? "remote" : "local") === "local"
        ? buildNodeHostLocalAuthConfig(params.config)
        : params.config,
    env: params.env,
    localTokenPrecedence: "env-first",
    localPasswordPrecedence: "env-first",
    remoteTokenPrecedence: "env-first",
    remotePasswordPrecedence: "env-first",
  });
}
function buildNodeHostLocalAuthConfig(config) {
  if (!config.gateway?.remote?.token && !config.gateway?.remote?.password) return config;
  const nextConfig = structuredClone(config);
  if (nextConfig.gateway?.remote) {
    nextConfig.gateway.remote.token = void 0;
    nextConfig.gateway.remote.password = void 0;
  }
  return nextConfig;
}
async function runNodeHost(opts) {
  const config = await ensureNodeHostConfig();
  const nodeId = opts.nodeId?.trim() || config.nodeId;
  if (nodeId !== config.nodeId) config.nodeId = nodeId;
  const displayName =
    opts.displayName?.trim() || config.displayName || (await getMachineDisplayName());
  config.displayName = displayName;
  const gateway = {
    host: opts.gatewayHost,
    port: opts.gatewayPort,
    tls: opts.gatewayTls ?? getRuntimeConfig().gateway?.tls?.enabled ?? false,
    tlsFingerprint: opts.gatewayTlsFingerprint,
    contextPath: opts.gatewayContextPath,
  };
  config.gateway = gateway;
  await saveNodeHostConfig(config);
  const cfg = getRuntimeConfig();
  const preparedRuntime = await prepareNodeHostRuntime({
    config: cfg,
    env: process.env,
    enableAgentRuns: true,
  });
  const { token, password } = await resolveNodeHostGatewayCredentials({
    config: cfg,
    env: process.env,
  });
  const host = gateway.host ?? "127.0.0.1";
  const port = gateway.port ?? 18789;
  const url = `${gateway.tls ? "wss" : "ws"}://${host}:${port}${gateway.contextPath ? (gateway.contextPath.startsWith("/") ? gateway.contextPath : `/${gateway.contextPath}`) : ""}`;
  let inventory = preparedRuntime.initialInventory;
  let gatewayHelloReceived = false;
  const publishInventory = () => {
    if (!gatewayHelloReceived) return;
    if (inventory.skills) publishNodeSkills(client, inventory.skills);
    publishNodePluginTools(client, inventory.pluginTools);
  };
  const client = new GatewayClient({
    url,
    token: token || void 0,
    password: password || void 0,
    preauthHandshakeTimeoutMs: cfg.gateway?.handshakeTimeoutMs,
    instanceId: nodeId,
    clientName: GATEWAY_CLIENT_NAMES.NODE_HOST,
    clientDisplayName: displayName,
    clientVersion: VERSION,
    platform: resolveNodeHostGatewayPlatform(process.platform),
    deviceFamily: resolveNodeHostGatewayDeviceFamily(process.platform),
    mode: GATEWAY_CLIENT_MODES.NODE,
    role: "node",
    scopes: [],
    caps: preparedRuntime.manifest.caps,
    commands: preparedRuntime.manifest.commands,
    pathEnv: preparedRuntime.manifest.pathEnv,
    permissions: void 0,
    deviceIdentity: loadOrCreateDeviceIdentity(),
    tlsFingerprint: gateway.tlsFingerprint,
    onEvent: (evt) => {
      if (evt.event === "node.invoke.cancel") {
        const payload = coerceNodeInvokeCancelPayload(evt.payload);
        if (payload) activeRuntime.cancel(payload.invokeId);
        return;
      }
      if (evt.event === "node.invoke.input") {
        const payload = coerceNodeInvokeInputPayload(evt.payload);
        if (payload) activeRuntime.handleInput(payload.invokeId, payload.seq, payload.payloadJSON);
        return;
      }
      if (evt.event !== "node.invoke.request") return;
      const payload = coerceNodeInvokePayload(evt.payload);
      if (!payload) return;
      activeRuntime.invoke(payload);
    },
    onHelloOk: () => {
      writeStderrLine(`node host gateway connected: ${url}`);
      gatewayHelloReceived = true;
      publishInventory();
    },
    onConnectError: (err) => {
      writeStderrLine(`node host gateway connect failed: ${err.message}`);
    },
    onReconnectPaused: (info) => {
      handleNodeHostReconnectPaused(info, {
        exit: (code) => {
          client.stop();
          activeRuntime.close().finally(() => process.exit(code));
        },
      });
    },
    onClose: (code, reason) => {
      activeRuntime.cancelAll();
      writeStderrLine(`node host gateway closed (${code}): ${reason}`);
    },
  });
  const activeRuntime = preparedRuntime.start({
    client,
    onInventoryChanged: (nextInventory) => {
      inventory = nextInventory;
      publishInventory();
    },
  });
  let stopping = false;
  let resolveStopped;
  const stopped = new Promise((resolve) => {
    resolveStopped = resolve;
  });
  const lifetimeInterval = setInterval(() => {}, 1e6);
  const removeSignalHandlers = () => {
    process.off("SIGINT", onSigint);
    process.off("SIGTERM", onSigterm);
  };
  const stopClientAndMcp = async () => {
    client.stop();
    try {
      await activeRuntime.close();
    } finally {
      clearInterval(lifetimeInterval);
    }
  };
  const finish = async (exitCode) => {
    if (stopping) return;
    stopping = true;
    removeSignalHandlers();
    try {
      await stopClientAndMcp();
    } finally {
      process.exitCode = exitCode;
      resolveStopped?.();
    }
  };
  const onSigint = () => void finish(130);
  const onSigterm = () => void finish(143);
  process.once("SIGINT", onSigint);
  process.once("SIGTERM", onSigterm);
  const readinessPromise = startGatewayClientWhenEventLoopReady(client, {
    clientOptions: { preauthHandshakeTimeoutMs: cfg.gateway?.handshakeTimeoutMs },
  });
  let readiness;
  try {
    readiness = await readinessPromise;
  } catch (error) {
    if (stopping) {
      await stopped;
      return;
    }
    removeSignalHandlers();
    await stopClientAndMcp();
    throw error;
  }
  if (!readiness.ready) {
    if (stopping) {
      await stopped;
      return;
    }
    removeSignalHandlers();
    await stopClientAndMcp();
    throw new Error("node host gateway event loop readiness timeout");
  }
  await stopped;
}
//#endregion
//#region src/node-host/worker-support.ts
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function parseNodeHostWorkerInput(line) {
  try {
    const parsed = asRecord(JSON.parse(line));
    const type = typeof parsed?.type === "string" ? parsed.type : "";
    if (type === "invoke") {
      const request = asRecord(parsed?.request);
      if (
        request &&
        typeof request.id === "string" &&
        typeof request.nodeId === "string" &&
        typeof request.command === "string"
      )
        return {
          type,
          request,
        };
      return null;
    }
    if (type === "gateway-response") {
      const id = typeof parsed?.id === "string" ? parsed.id : "";
      if (!id) return null;
      return parsed?.ok === true
        ? {
            type,
            id,
            ok: true,
            result: parsed.result,
          }
        : {
            type,
            id,
            ok: false,
            error: typeof parsed?.error === "string" ? parsed.error : "Gateway request failed",
          };
    }
    if (type === "invoke-input") {
      const invokeId = typeof parsed?.invokeId === "string" ? parsed.invokeId : "";
      const seq = typeof parsed?.seq === "number" ? parsed.seq : -1;
      const payloadJSON = typeof parsed?.payloadJSON === "string" ? parsed.payloadJSON : null;
      return invokeId && Number.isInteger(seq) && seq >= 0 && payloadJSON !== null
        ? {
            type,
            invokeId,
            seq,
            payloadJSON,
          }
        : null;
    }
    if (type === "invoke-cancel") {
      const invokeId = typeof parsed?.invokeId === "string" ? parsed.invokeId : "";
      return invokeId
        ? {
            type,
            invokeId,
          }
        : null;
    }
    return type === "stop" ? { type } : null;
  } catch {
    return null;
  }
}
var NodeHostWorkerBridgeClient = class {
  constructor(writeMessage) {
    this.writeMessage = writeMessage;
    this.nextRequestId = 1;
    this.pending = /* @__PURE__ */ new Map();
  }
  async request(method, params, opts) {
    if (method === "node.invoke.result") {
      this.writeMessage({
        type: "invoke-result",
        result: params ?? {},
      });
      return {};
    }
    if (method === "node.invoke.progress") {
      this.writeMessage({
        type: "invoke-progress",
        progress: params ?? {},
      });
      return {};
    }
    if (method === "node.event") {
      this.writeMessage({
        type: "node-event",
        event: params ?? {},
      });
      return {};
    }
    const id = `gateway-${this.nextRequestId++}`;
    const timeoutMs = Math.max(1, opts?.timeoutMs ?? 15e3);
    const response = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(/* @__PURE__ */ new Error(`Gateway request timed out: ${method}`));
      }, timeoutMs);
      this.pending.set(id, {
        resolve,
        reject,
        timer,
      });
    });
    this.writeMessage({
      type: "gateway-request",
      id,
      method,
      params: params ?? {},
      timeoutMs,
    });
    return await response;
  }
  handleResponse(message) {
    const pending = this.pending.get(message.id);
    if (!pending) return false;
    this.pending.delete(message.id);
    clearTimeout(pending.timer);
    if (message.ok) pending.resolve(message.result);
    else pending.reject(new Error(message.error));
    return true;
  }
  close() {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer);
      pending.reject(/* @__PURE__ */ new Error("node-host worker stopped"));
    }
    this.pending.clear();
  }
};
async function stopNodeHostWorkerFromSignal(input, stop, exitCode) {
  const stopped = stop(exitCode);
  input.close();
  await stopped;
}
//#endregion
//#region src/node-host/worker.ts
/** Private JSONL worker exposing the CLI node-host runtime to the macOS app. */
function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}
function emitInventory(inventory) {
  writeMessage({
    type: "inventory",
    inventory,
  });
}
async function runNodeHostWorker() {
  const prepared = await prepareNodeHostRuntime({ enableDuplexPluginCommands: true });
  const client = new NodeHostWorkerBridgeClient(writeMessage);
  let stopping = false;
  let resolveStopped;
  const stopped = new Promise((resolve) => {
    resolveStopped = resolve;
  });
  const stop = async (exitCode) => {
    if (stopping) return;
    stopping = true;
    try {
      client.close();
      await runtime.close();
      process.exitCode = exitCode;
    } finally {
      resolveStopped?.();
    }
  };
  const runtime = prepared.start({
    client,
    onInventoryChanged: emitInventory,
  });
  writeMessage({
    type: "ready",
    version: VERSION,
    manifest: prepared.manifest,
    inventory: prepared.initialInventory,
  });
  const input = createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
  });
  input.on("line", (line) => {
    const message = parseNodeHostWorkerInput(line);
    if (!message) {
      writeMessage({
        type: "protocol-error",
        error: "invalid worker request",
      });
      return;
    }
    if (message.type === "gateway-response") {
      client.handleResponse(message);
      return;
    }
    if (message.type === "stop") {
      input.close();
      stop(0);
      return;
    }
    if (message.type === "invoke-input") {
      runtime.handleInput(message.invokeId, message.seq, message.payloadJSON);
      return;
    }
    if (message.type === "invoke-cancel") {
      runtime.cancel(message.invokeId);
      return;
    }
    runtime.invoke(message.request);
  });
  input.on("close", () => void stop(0));
  process.once("SIGINT", () => void stopNodeHostWorkerFromSignal(input, stop, 130));
  process.once("SIGTERM", () => void stopNodeHostWorkerFromSignal(input, stop, 143));
  await stopped;
}
//#endregion
//#region src/commands/node-daemon-install-helpers.ts
/** Node-based daemon install plan builder for managed gateway services. */
function buildNodeInstallEnvironmentValueSources() {
  return {
    OPENCLAW_GATEWAY_TOKEN: "file",
    OPENCLAW_GATEWAY_PASSWORD: "file",
  };
}
/** Builds launch arguments, environment, and metadata for a Node daemon service install. */
async function buildNodeInstallPlan(params) {
  const { devMode, nodePath } = await resolveDaemonInstallRuntimeInputs({
    env: params.env,
    runtime: params.runtime,
    devMode: params.devMode,
    nodePath: params.nodePath,
  });
  const { programArguments, workingDirectory } = await resolveNodeProgramArguments({
    host: params.host,
    port: params.port,
    contextPath: params.contextPath,
    tls: params.tls,
    tlsFingerprint: params.tlsFingerprint,
    nodeId: params.nodeId,
    displayName: params.displayName,
    dev: devMode,
    runtime: params.runtime,
    nodePath,
  });
  await emitDaemonInstallRuntimeWarning({
    env: params.env,
    runtime: params.runtime,
    programArguments,
    warn: params.warn,
    title: "Node daemon runtime",
  });
  const environment = buildNodeServiceEnvironment({
    env: params.env,
    extraPathDirs: resolveDaemonNodeBinDir(nodePath),
  });
  const description = formatNodeServiceDescription({
    version: environment.OPENCLAW_SERVICE_VERSION,
  });
  return {
    programArguments,
    workingDirectory,
    environment,
    environmentValueSources: buildNodeInstallEnvironmentValueSources(),
    description,
  };
}
//#endregion
//#region src/cli/node-cli/daemon.ts
function renderNodeServiceStartHints() {
  return buildPlatformServiceStartHints({
    installCommand: formatCliCommand("openclaw node install"),
    startCommand: formatCliCommand("openclaw node start"),
    launchAgentPlistPath: `~/Library/LaunchAgents/${resolveNodeLaunchAgentLabel()}.plist`,
    systemdServiceName: resolveNodeSystemdServiceName(),
    windowsTaskName: resolveNodeWindowsTaskName(),
  });
}
function buildNodeRuntimeHints(env = process.env) {
  return buildPlatformRuntimeLogHints({
    env,
    systemdServiceName: resolveNodeSystemdServiceName(),
    windowsTaskName: resolveNodeWindowsTaskName(),
  });
}
function resolveNodeDefaults(opts, config) {
  const savedHost = config?.gateway?.host || "127.0.0.1";
  const host = normalizeOptionalString(opts.host) || savedHost;
  const retargeted = opts.host !== void 0 || opts.port !== void 0;
  const portOverride = parsePort(opts.port);
  if (opts.port !== void 0 && portOverride === null)
    return {
      host,
      port: null,
      retargeted,
      endpointChanged: false,
    };
  const savedPort = config?.gateway?.port ?? 18789;
  const port = portOverride ?? savedPort;
  const endpointChanged =
    (opts.host !== void 0 && host !== savedHost) || (opts.port !== void 0 && port !== savedPort);
  const explicitContextPath = opts.contextPath !== void 0;
  return {
    host,
    port,
    contextPath:
      normalizeOptionalString(opts.contextPath) ||
      (explicitContextPath || retargeted ? void 0 : config?.gateway?.contextPath),
    retargeted,
    endpointChanged,
  };
}
async function runNodeDaemonInstall(opts) {
  const { json, stdout, warnings, emit, fail } = createDaemonInstallActionContext(opts.json);
  if (failIfNixDaemonInstallMode(fail)) return;
  const config = await loadNodeHostConfig();
  const { host, port, contextPath, endpointChanged } = resolveNodeDefaults(opts, config);
  if (!Number.isFinite(port ?? NaN) || (port ?? 0) <= 0 || (port ?? 0) > 65535) {
    fail(
      opts.port !== void 0
        ? formatInvalidPortOption("--port")
        : formatInvalidConfigPort("node.gateway.port"),
    );
    return;
  }
  const runtimeRaw = opts.runtime ? opts.runtime : DEFAULT_GATEWAY_DAEMON_RUNTIME;
  if (!isGatewayDaemonRuntime(runtimeRaw)) {
    fail('Invalid --runtime (use "node"; Bun lacks the required node:sqlite API)');
    return;
  }
  const service = resolveNodeService();
  let loaded;
  try {
    loaded = await service.isLoaded({ env: process.env });
  } catch (err) {
    fail(`Node service check failed: ${String(err)}`);
    return;
  }
  if (loaded && !opts.force) {
    emit({
      ok: true,
      result: "already-installed",
      message: `Node service already ${service.loadedText}.`,
      service: buildDaemonServiceSnapshot(service, loaded),
      warnings: warnings.length ? warnings : void 0,
    });
    if (!json) {
      defaultRuntime.log(`Node service already ${service.loadedText}.`);
      defaultRuntime.log(`Reinstall with: ${formatCliCommand("openclaw node install --force")}`);
    }
    return;
  }
  const tlsFingerprint =
    normalizeOptionalString(opts.tlsFingerprint) ||
    (endpointChanged ? void 0 : config?.gateway?.tlsFingerprint);
  const inheritedTls = endpointChanged ? void 0 : config?.gateway?.tls;
  const tls = Boolean(opts.tls) || Boolean(tlsFingerprint) || Boolean(inheritedTls);
  const { programArguments, workingDirectory, environment, environmentValueSources, description } =
    await buildNodeInstallPlan({
      env: process.env,
      host,
      port: port ?? 18789,
      contextPath,
      tls,
      tlsFingerprint: tlsFingerprint || void 0,
      nodeId: opts.nodeId,
      displayName: opts.displayName,
      runtime: runtimeRaw,
      warn: (message) => {
        if (json) warnings.push(message);
        else defaultRuntime.log(message);
      },
    });
  const warn = (message) => {
    if (json) warnings.push(message);
    else defaultRuntime.log(message);
  };
  await installDaemonServiceAndEmit({
    serviceNoun: "Node",
    service,
    warnings,
    emit,
    fail,
    install: async () => {
      await service.install({
        env: process.env,
        stdout,
        warn,
        programArguments,
        workingDirectory,
        environment,
        environmentValueSources,
        description,
      });
    },
  });
}
async function runNodeDaemonUninstall(opts = {}) {
  return await runServiceUninstall({
    serviceNoun: "Node",
    service: resolveNodeService(),
    opts,
    stopBeforeUninstall: false,
    assertNotLoadedAfterUninstall: false,
  });
}
async function runNodeDaemonStart(opts = {}) {
  return await runServiceStart({
    serviceNoun: "Node",
    service: resolveNodeService(),
    renderStartHints: renderNodeServiceStartHints,
    opts,
  });
}
async function runNodeDaemonRestart(opts = {}) {
  await runServiceRestart({
    serviceNoun: "Node",
    service: resolveNodeService(),
    renderStartHints: renderNodeServiceStartHints,
    opts,
  });
}
async function runNodeDaemonStop(opts = {}) {
  return await runServiceStop({
    serviceNoun: "Node",
    service: resolveNodeService(),
    opts,
  });
}
async function runNodeDaemonStatus(opts = {}) {
  const json = Boolean(opts.json);
  const service = resolveNodeService();
  const [loaded, command, runtime] = await Promise.all([
    service.isLoaded({ env: process.env }).catch(() => false),
    service.readCommand(process.env).catch(() => null),
    service.readRuntime(process.env).catch((err) => ({
      status: "unknown",
      detail: String(err),
    })),
  ]);
  const payload = {
    service: {
      ...buildDaemonServiceSnapshot(service, loaded),
      command,
      runtime,
    },
  };
  if (json) {
    const safeEnvironment = filterDaemonEnv(command?.environment);
    defaultRuntime.writeJson({
      service: {
        ...payload.service,
        command: command
          ? {
              ...command,
              environment: Object.keys(safeEnvironment).length > 0 ? safeEnvironment : void 0,
            }
          : command,
      },
    });
    return;
  }
  const { rich, label, accent, infoText, okText, warnText, errorText } =
    createCliStatusTextStyles();
  const serviceStatus = loaded ? okText(service.loadedText) : warnText(service.notLoadedText);
  defaultRuntime.log(`${label("Service:")} ${accent(service.label)} (${serviceStatus})`);
  if (command?.programArguments?.length)
    defaultRuntime.log(`${label("Command:")} ${infoText(command.programArguments.join(" "))}`);
  if (command?.sourcePath)
    defaultRuntime.log(`${label("Service file:")} ${infoText(command.sourcePath)}`);
  if (command?.workingDirectory)
    defaultRuntime.log(`${label("Working dir:")} ${infoText(command.workingDirectory)}`);
  const runtimeLine = formatRuntimeStatus(runtime);
  if (runtimeLine) {
    const runtimeColor = resolveRuntimeStatusColor(runtime?.status);
    defaultRuntime.log(`${label("Runtime:")} ${colorize(rich, runtimeColor, runtimeLine)}`);
  }
  if (!loaded) {
    defaultRuntime.log("");
    for (const hint of renderNodeServiceStartHints())
      defaultRuntime.log(`${warnText("Start with:")} ${infoText(hint)}`);
    return;
  }
  const baseEnv = {
    ...process.env,
    ...(command?.environment ?? void 0),
  };
  const hintEnv = {
    ...baseEnv,
    OPENCLAW_LOG_PREFIX: baseEnv.OPENCLAW_LOG_PREFIX ?? "node",
  };
  if (runtime?.missingUnit) {
    defaultRuntime.error(errorText("Service unit not found."));
    for (const hint of buildNodeRuntimeHints(hintEnv)) defaultRuntime.log(errorText(hint));
    return;
  }
  if (runtime?.status === "stopped") {
    defaultRuntime.error(errorText("Service is loaded but not running."));
    for (const hint of buildNodeRuntimeHints(hintEnv)) defaultRuntime.log(errorText(hint));
  }
}
//#endregion
//#region src/cli/node-cli/identity.ts
/**
 * Read-only by design: the SSH-verified pairing probe calls this remotely and
 * must never mint a fresh identity on a host that has not run the node host.
 */
function runNodeIdentityShow(opts) {
  const identity = loadDeviceIdentityIfPresent();
  if (!identity) {
    defaultRuntime.error(
      "no node device identity found (start the node host once with `openclaw node run` or `openclaw node install`)",
    );
    defaultRuntime.exit(1);
    return;
  }
  const payload = {
    deviceId: identity.deviceId,
    publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem),
  };
  if (opts.json) {
    defaultRuntime.log(JSON.stringify(payload));
    return;
  }
  defaultRuntime.log(`deviceId:  ${payload.deviceId}`);
  defaultRuntime.log(`publicKey: ${payload.publicKey}`);
}
//#endregion
//#region src/cli/node-cli/register.ts
function parsePortOption(value, fallback) {
  if (value === void 0) return fallback;
  return parsePort(value);
}
function registerNodeCli(program) {
  const node = program
    .command("node")
    .description("Run and manage the headless node host service")
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples([
          [
            "openclaw node run --host 127.0.0.1 --port 18789",
            "Run the node host in the foreground.",
          ],
          ["openclaw node status", "Check node host service status."],
          ["openclaw node install", "Install the node host service."],
          ["openclaw node start", "Start the installed node host service."],
          ["openclaw node restart", "Restart the installed node host service."],
        ])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/node", "docs.openclaw.ai/cli/node")}\n`,
    );
  node
    .command("worker", { hidden: true })
    .description("Run the private macOS app node-host worker")
    .action(async () => {
      await runNodeHostWorker();
    });
  node
    .command("run")
    .description("Run the headless node host (foreground)")
    .option("--host <host>", "Gateway host")
    .option("--port <port>", "Gateway port")
    .option("--context-path <path>", "Gateway WebSocket context path (e.g. /openclaw-gw)")
    .option("--tls", "Use TLS for the gateway connection")
    .option("--no-tls", "Disable TLS for the gateway connection")
    .option("--tls-fingerprint <sha256>", "Expected TLS certificate fingerprint (sha256)")
    .option("--node-id <id>", "Override the generated node instance id")
    .option("--display-name <name>", "Override node display name")
    .action(async (opts) => {
      const existing = await loadNodeHostConfig();
      const host = normalizeOptionalString(opts.host) || existing?.gateway?.host || "127.0.0.1";
      const port = parsePortOption(opts.port, existing?.gateway?.port ?? 18789);
      if (port === null) {
        defaultRuntime.error(formatInvalidPortOption("--port"));
        defaultRuntime.exit(1);
        return;
      }
      const retargetedGateway = opts.host !== void 0 || opts.port !== void 0;
      const explicitContextPath = opts.contextPath !== void 0;
      const explicitTlsDisabled = opts.tls === false;
      if (explicitTlsDisabled && opts.tlsFingerprint !== void 0) {
        defaultRuntime.error("--no-tls cannot be combined with --tls-fingerprint");
        defaultRuntime.exit(1);
        return;
      }
      const tlsFingerprint =
        explicitTlsDisabled || retargetedGateway
          ? opts.tlsFingerprint
          : (opts.tlsFingerprint ?? existing?.gateway?.tlsFingerprint);
      const inheritedTls = retargetedGateway ? void 0 : existing?.gateway?.tls;
      await runNodeHost({
        gatewayHost: host,
        gatewayPort: port,
        gatewayTls:
          typeof opts.tls === "boolean" ? opts.tls : Boolean(tlsFingerprint) || inheritedTls,
        gatewayTlsFingerprint: tlsFingerprint,
        gatewayContextPath:
          normalizeOptionalString(opts.contextPath) ??
          (explicitContextPath || retargetedGateway ? void 0 : existing?.gateway?.contextPath),
        nodeId: opts.nodeId,
        displayName: opts.displayName,
      });
    });
  node
    .command("status")
    .description("Show node host status")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runNodeDaemonStatus(opts);
    });
  node
    .command("identity")
    .description("Print the node host device identity (device id + public key)")
    .option("--json", "Output JSON", false)
    .action((opts) => {
      runNodeIdentityShow(opts);
    });
  node
    .command("install")
    .description("Install the node host service (launchd/systemd/schtasks)")
    .option("--host <host>", "Gateway host")
    .option("--port <port>", "Gateway port")
    .option("--context-path <path>", "Gateway WebSocket context path (e.g. /openclaw-gw)")
    .option("--tls", "Use TLS for the gateway connection", false)
    .option("--tls-fingerprint <sha256>", "Expected TLS certificate fingerprint (sha256)")
    .option("--node-id <id>", "Override the generated node instance id")
    .option("--display-name <name>", "Override node display name")
    .option("--runtime <runtime>", "Service runtime (node). Default: node")
    .option("--force", "Reinstall/overwrite if already installed", false)
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runNodeDaemonInstall(opts);
    });
  node
    .command("uninstall")
    .description("Uninstall the node host service (launchd/systemd/schtasks)")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runNodeDaemonUninstall(opts);
    });
  node
    .command("stop")
    .description("Stop the node host service (launchd/systemd/schtasks)")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runNodeDaemonStop(opts);
    });
  node
    .command("start")
    .description("Start the node host service (launchd/systemd/schtasks)")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runNodeDaemonStart(opts);
    });
  node
    .command("restart")
    .description("Restart the node host service (launchd/systemd/schtasks)")
    .option("--json", "Output JSON", false)
    .action(async (opts) => {
      await runNodeDaemonRestart(opts);
    });
}
//#endregion
export { registerNodeCli };
