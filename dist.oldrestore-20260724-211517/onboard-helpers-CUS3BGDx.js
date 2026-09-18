import fs from "node:fs/promises";
import path from "node:path";
import { inspect } from "node:util";
import { cancel, isCancel } from "@clack/prompts";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-y9xQv_q1.js";
import { t as printClawBanner } from "./claw-banner-BBegA3Bj.js";
import {
  l as readConnectErrorDetailCode,
  t as ConnectErrorDetailCodes,
} from "./connect-error-details-BxqBqDDT.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-BqBD1Err.js";
import { l as movePathToTrash } from "./fs-safe-RNq3oO57.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { c as resolveConfigPath } from "./paths-DEklnbzU.js";
import { c as resolveSessionTranscriptsDirForAgent } from "./paths-TfuVT-K8.js";
import { r as probeGateway } from "./probe-yKlqUC9v.js";
import { r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import "./control-ui-links-BImlWgwk.js";
import { t as sleep } from "./sleep-DZm1epyW.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./detect-binary-BkSLZSbH.js";
import "./browser-open-BIKaPeXy.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  d as resolveConfigDir,
  h as shortenHomePath,
  m as shortenHomeInString,
} from "./utils-DtcDeqWS.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-h9TzWSvp.js";
import {
  _ as resolveWorkspaceAttestationPaths,
  d as ensureAgentWorkspace,
  y as shouldRemoveWorkspaceAttestation,
} from "./workspace-DXzCbuC0.js";
//#region src/commands/onboard-helpers.ts
/** Shared helpers for onboarding, reset, gateway checks, and wizard output. */
/** Handles Clack cancellation by exiting through the runtime. */
function guardCancel(value, runtime, exitCode = 0) {
  if (isCancel(value)) {
    cancel(stylePromptTitle("Setup cancelled.") ?? "Setup cancelled.");
    runtime.exit(exitCode);
    throw new Error("unreachable");
  }
  return value;
}
/** Summarizes existing config values before onboarding overwrites or reuses them. */
function summarizeExistingConfig(config) {
  const rows = [];
  const defaults = config.agents?.defaults;
  if (defaults?.workspace) rows.push(shortenHomeInString(`Workspace: ${defaults.workspace}`));
  if (defaults?.model) {
    const model = resolveAgentModelPrimaryValue(defaults.model);
    if (model) rows.push(shortenHomeInString(`Model: ${model}`));
  }
  const gatewaySummary = summarizeGatewayConfig(config);
  if (gatewaySummary) rows.push(shortenHomeInString(gatewaySummary));
  if (config.skills?.install?.nodeManager)
    rows.push(shortenHomeInString(`Node manager: ${config.skills.install.nodeManager}`));
  return rows.length ? rows.join("\n") : "No key settings detected.";
}
function summarizeGatewayConfig(config) {
  const gateway = config.gateway;
  if (
    !gateway?.mode &&
    typeof gateway?.port !== "number" &&
    !gateway?.bind &&
    !gateway?.remote?.url
  )
    return null;
  const mode = normalizeOptionalString(gateway.mode);
  const bind = formatGatewayBind(gateway.bind);
  const remoteUrl = normalizeOptionalString(gateway.remote?.url);
  const useRemoteUrl = remoteUrl !== void 0 && mode !== "local";
  const endpoint =
    useRemoteUrl && remoteUrl
      ? remoteUrl
      : typeof gateway.port === "number"
        ? `:${gateway.port}`
        : void 0;
  const words = [];
  if (mode) words.push(mode);
  if (bind) words.push(mode ? `via ${bind}` : bind);
  if (mode === "remote" && !remoteUrl) {
    words.push("(missing remote URL)");
    return `Gateway: ${words.join(" ")}`;
  }
  if (endpoint) words.push(`${useRemoteUrl ? "at" : "on"} ${endpoint}`);
  return `Gateway: ${words.length > 0 ? words.join(" ") : "configured"}`;
}
function formatGatewayBind(value) {
  switch (value) {
    case "lan":
      return "LAN";
    case "loopback":
      return "loopback";
    case "tailnet":
      return "tailnet";
    case "auto":
      return "auto";
    case "custom":
      return "custom";
    default:
      return normalizeOptionalString(value);
  }
}
/** Normalizes gateway token prompts while rejecting JS stringification sentinels. */
function normalizeGatewayTokenInput(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (trimmed === "undefined" || trimmed === "null") return "";
  return trimmed;
}
/** Validates gateway password prompt input. */
function validateGatewayPasswordInput(value) {
  if (typeof value !== "string") return "Required";
  const trimmed = value.trim();
  if (!trimmed) return "Required";
  if (trimmed === "undefined" || trimmed === "null")
    return 'Cannot be the literal string "undefined" or "null"';
}
/** Prints the onboarding banner: pixel mascot beside the OPENCLAW wordmark. */
async function printWizardHeader(runtime) {
  await printClawBanner(runtime);
}
/** Records wizard provenance metadata on config writes. */
function applyWizardMetadata(cfg, params) {
  const commit =
    normalizeOptionalString(process.env.GIT_COMMIT) ?? normalizeOptionalString(process.env.GIT_SHA);
  return {
    ...cfg,
    wizard: {
      ...cfg.wizard,
      lastRunAt: /* @__PURE__ */ new Date().toISOString(),
      lastRunVersion: VERSION,
      lastRunCommit: commit,
      lastRunCommand: params.command,
      lastRunMode: params.mode,
    },
  };
}
/** Formats the no-GUI SSH tunnel hint for opening the Control UI remotely. */
function formatControlUiSshHint(params) {
  const basePath = normalizeControlUiBasePath(params.basePath);
  const uiPath = basePath ? `${basePath}/` : "/";
  const localUrl = `http://localhost:${params.port}${uiPath}`;
  const authedUrl = params.token ? `${localUrl}#token=${encodeURIComponent(params.token)}` : void 0;
  const sshTarget = resolveSshTargetHint();
  return [
    "No GUI detected. Open from your computer:",
    `ssh -N -L ${params.port}:127.0.0.1:${params.port} ${sshTarget}`,
    "Then open:",
    localUrl,
    authedUrl,
    "BYOH note: lan, tailnet, and custom bind are currently IPv4-only.",
    "If your host is IPv6-only, use an IPv4 sidecar or proxy in front of the Gateway.",
    "Docs:",
    "https://docs.openclaw.ai/gateway/remote",
    "https://docs.openclaw.ai/web/control-ui",
  ]
    .filter(Boolean)
    .join("\n");
}
function resolveSshTargetHint() {
  return `${process.env.USER || process.env.LOGNAME || "user"}@${process.env.SSH_CONNECTION?.trim().split(/\s+/)?.[2] ?? "<host>"}`;
}
/** Ensures workspace bootstrap files and session transcript directories exist. */
async function ensureWorkspaceAndSessions(workspaceDir, runtime, options) {
  const ws = await ensureAgentWorkspace({
    dir: workspaceDir,
    ensureBootstrapFiles: !options?.skipBootstrap,
    skipOptionalBootstrapFiles: options?.skipOptionalBootstrapFiles,
  });
  runtime.log(`Workspace OK: ${shortenHomePath(ws.dir)}`);
  const sessionsDir = resolveSessionTranscriptsDirForAgent(options?.agentId);
  await fs.mkdir(sessionsDir, { recursive: true });
  runtime.log(`Sessions OK: ${shortenHomePath(sessionsDir)}`);
}
/** Moves a path to Trash when it exists, logging a manual-delete fallback on failure. */
async function moveToTrash(pathname, runtime) {
  if (!pathname) return;
  try {
    await fs.access(pathname);
  } catch {
    return;
  }
  try {
    const sourcePath = await resolveMoveToTrashSourcePath(path.resolve(pathname));
    await movePathToTrash(sourcePath, {
      allowedRoots: await resolveMoveToTrashAllowedRoots(sourcePath),
    });
    runtime.log(`Moved to Trash: ${shortenHomePath(pathname)}`);
  } catch {
    runtime.log(`Failed to move to Trash (manual delete): ${shortenHomePath(pathname)}`);
  }
}
async function resolveMoveToTrashSourcePath(targetPath) {
  return path.join(await fs.realpath(path.dirname(targetPath)), path.basename(targetPath));
}
async function resolveMoveToTrashAllowedRoots(targetPath) {
  const allowedRoots = [path.dirname(targetPath)];
  if ((await fs.lstat(targetPath)).isSymbolicLink())
    try {
      allowedRoots.push(path.dirname(await fs.realpath(targetPath)));
    } catch {}
  return uniqueStrings(allowedRoots);
}
/** Deletes onboarding-managed state according to the selected reset scope. */
async function handleReset(scope, workspaceDir, runtime) {
  await moveToTrash(resolveConfigPath(), runtime);
  if (scope === "config") return;
  await moveToTrash(path.join(resolveConfigDir(), "credentials"), runtime);
  await moveToTrash(resolveSessionTranscriptsDirForAgent(), runtime);
  if (scope === "full") {
    await moveToTrash(workspaceDir, runtime);
    for (const [index, attestationPath] of resolveWorkspaceAttestationPaths(workspaceDir).entries())
      if (await shouldRemoveWorkspaceAttestation(attestationPath, { trustUnknown: index === 0 }))
        await moveToTrash(attestationPath, runtime);
  }
}
function runOnboardingGatewayProbe(params, detailLevel) {
  return probeGateway({
    url: params.url.trim(),
    timeoutMs: params.timeoutMs ?? Math.max(1500, params.preauthHandshakeTimeoutMs ?? 0),
    auth: {
      token: params.token,
      password: params.password,
    },
    ...(params.tlsFingerprint ? { tlsFingerprint: params.tlsFingerprint } : {}),
    ...(params.preauthHandshakeTimeoutMs
      ? { preauthHandshakeTimeoutMs: params.preauthHandshakeTimeoutMs }
      : {}),
    detailLevel,
  });
}
/** Runs a single lightweight gateway probe for onboarding readiness checks. */
async function probeGatewayReachable(params) {
  try {
    const probe = await runOnboardingGatewayProbe(params, "none");
    if (!probe.ok)
      return {
        ok: false,
        detail: probe.error ?? void 0,
      };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      detail: summarizeError(err),
    };
  }
}
const RECOGNIZED_GATEWAY_CONNECT_ERROR_CODES = new Set(Object.values(ConnectErrorDetailCodes));
function didProbeReachGateway(probe) {
  const connectErrorCode = readConnectErrorDetailCode(probe.connectErrorDetails);
  const recognizedConnectError =
    connectErrorCode !== null && RECOGNIZED_GATEWAY_CONNECT_ERROR_CODES.has(connectErrorCode);
  const serverVersion = probe.server?.version?.trim();
  const serverConnectionId = probe.server?.connId?.trim();
  return recognizedConnectError || Boolean(serverVersion && serverConnectionId);
}
/** Reads only Gateway config and classifies whether its default agent has inference. */
async function probeGatewayConfiguredModel(params) {
  let probe;
  try {
    probe = await runOnboardingGatewayProbe(params, "config");
  } catch (err) {
    return {
      kind: "unreachable",
      detail: summarizeError(err),
    };
  }
  const detail = probe.error ?? void 0;
  if (!didProbeReachGateway(probe))
    return {
      kind: "unreachable",
      ...(detail ? { detail } : {}),
    };
  if (!probe.ok)
    return {
      kind: "reachable-unverified",
      detail,
    };
  const snapshot = probe.configSnapshot;
  const configCandidate =
    snapshot?.valid === true ? (snapshot.runtimeConfig ?? snapshot.config) : null;
  if (!configCandidate || typeof configCandidate !== "object" || Array.isArray(configCandidate))
    return {
      kind: "reachable-unverified",
      detail: "Gateway returned an invalid config snapshot",
    };
  try {
    const config = configCandidate;
    return resolveAgentEffectiveModelPrimary(config, resolveDefaultAgentId(config))
      ? { kind: "configured" }
      : {
          kind: "missing-configured-model",
          detail: "Gateway default agent has no configured model",
        };
  } catch {
    return {
      kind: "reachable-unverified",
      detail: "Gateway returned an invalid config snapshot",
    };
  }
}
/** Polls gateway reachability until success or deadline. */
async function waitForGatewayReachable(params) {
  const deadlineMs = params.deadlineMs ?? 15e3;
  const pollMs = resolveTimerTimeoutMs(params.pollMs ?? 400, 400, 0);
  const probeTimeoutMs = params.probeTimeoutMs ?? 1500;
  const startedAt = Date.now();
  let lastDetail;
  while (Date.now() - startedAt < deadlineMs) {
    const probe = await probeGatewayReachable({
      url: params.url,
      token: params.token,
      password: params.password,
      timeoutMs: probeTimeoutMs,
    });
    if (probe.ok) return probe;
    lastDetail = probe.detail;
    const remainingMs = deadlineMs - (Date.now() - startedAt);
    if (remainingMs <= 0) break;
    await sleep(Math.min(pollMs, remainingMs));
  }
  return {
    ok: false,
    detail: lastDetail,
  };
}
function summarizeError(err) {
  let raw = "unknown error";
  if (err instanceof Error) raw = err.message || raw;
  else if (typeof err === "string") raw = err || raw;
  else if (err !== void 0) raw = inspect(err, { depth: 2 });
  const line =
    raw
      .split("\n")
      .map((s) => s.trim())
      .find(Boolean) ?? raw;
  return line.length > 120 ? `${truncateUtf16Safe(line, 119)}…` : line;
}
const testing = { summarizeError };
/** Default workspace path shown by onboarding prompts. */
const DEFAULT_WORKSPACE = DEFAULT_AGENT_WORKSPACE_DIR;
//#endregion
export {
  guardCancel as a,
  normalizeGatewayTokenInput as c,
  probeGatewayReachable as d,
  summarizeExistingConfig as f,
  waitForGatewayReachable as h,
  formatControlUiSshHint as i,
  printWizardHeader as l,
  validateGatewayPasswordInput as m,
  applyWizardMetadata as n,
  handleReset as o,
  testing as p,
  ensureWorkspaceAndSessions as r,
  moveToTrash as s,
  DEFAULT_WORKSPACE as t,
  probeGatewayConfiguredModel as u,
};
