import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  t as listAgentEntries,
} from "./agent-scope-config-DVIR1nBa.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-y9xQv_q1.js";
import {
  n as OPENCLAW_SOURCE_URL,
  r as resolveOpenClawReferencePaths,
  t as OPENCLAW_DOCS_URL,
} from "./docs-path-CIMgdwYZ.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./config-BDv-QbJ6.js";
import { c as resolveConfigPath, f as resolveGatewayPort } from "./paths-DEklnbzU.js";
//#region src/crestodian/probes.ts
const LOCAL_COMMAND_PROBE_OUTPUT_MAX_CHARS = 16 * 1024;
/** Probe a command by running a small version command with bounded output and timeout. */
async function probeLocalCommand(command, args = ["--version"], opts = {}) {
  const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 1500);
  const outputLimit = opts.outputLimit ?? LOCAL_COMMAND_PROBE_OUTPUT_MAX_CHARS;
  try {
    const result = await runCommandWithTimeout([command, ...args], {
      killProcessTree: true,
      maxOutputBytes: outputLimit,
      timeoutMs,
    });
    if (result.termination === "timeout")
      return {
        command,
        found: true,
        error: `timed out after ${timeoutMs}ms`,
      };
    const text = `${result.stdout}\n${result.stderr}`.trim().split(/\r?\n/)[0]?.trim();
    return {
      command,
      found: result.code === 0 || Boolean(text),
      version: text || void 0,
      error: result.code === 0 ? void 0 : `exited ${String(result.code)}`,
    };
  } catch (error) {
    const spawnError = error;
    return {
      command,
      found: spawnError.code !== "ENOENT",
      error: spawnError.code === "ENOENT" ? "not found" : spawnError.message,
    };
  }
}
/** Probe a Gateway URL by translating it to its HTTP /healthz endpoint. */
async function probeGatewayUrl(url, opts = {}) {
  const httpUrl = url.replace(/^ws:/, "http:").replace(/^wss:/, "https:");
  const healthUrl = new URL("/healthz", httpUrl).toString();
  const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, 900);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(healthUrl, {
      method: "GET",
      signal: controller.signal,
    });
    return {
      reachable: response.ok,
      url,
      error: response.ok ? void 0 : response.statusText,
    };
  } catch (err) {
    return {
      reachable: false,
      url,
      error: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timeout);
    await response?.body?.cancel().catch(() => void 0);
  }
}
//#endregion
//#region src/crestodian/overview.ts
function issueMessages(snapshot) {
  return snapshot.issues.map((issue) => {
    return `${issue.path ? `${issue.path}: ` : ""}${issue.message}`;
  });
}
function buildAgentSummaries(cfg) {
  const defaultAgentId = resolveDefaultAgentId(cfg);
  const entries = listAgentEntries(cfg);
  if (entries.length === 0)
    return [
      {
        id: defaultAgentId,
        isDefault: true,
        model: resolveAgentEffectiveModelPrimary(cfg, defaultAgentId),
      },
    ];
  const seen = /* @__PURE__ */ new Set();
  const summaries = [];
  for (const entry of entries) {
    const id = normalizeAgentId(entry.id);
    if (seen.has(id)) continue;
    seen.add(id);
    const summary = {
      id,
      isDefault: id === defaultAgentId,
    };
    if (typeof entry.name === "string") summary.name = entry.name;
    const model = resolveAgentEffectiveModelPrimary(cfg, id);
    if (model) summary.model = model;
    if (typeof entry.workspace === "string") summary.workspace = entry.workspace;
    summaries.push(summary);
  }
  return summaries;
}
function resolveFastTestReferences(env) {
  if (env.OPENCLAW_TEST_FAST !== "1") return;
  const sourcePath = process.cwd();
  return {
    sourcePath,
    docsPath: `${sourcePath}/docs`,
  };
}
async function loadCrestodianOverview(opts = {}) {
  const env = opts.env ?? process.env;
  const deps = opts.deps ?? {};
  const snapshot = await (deps.readConfigFileSnapshot ?? readConfigFileSnapshot)();
  const cfg = snapshot.runtimeConfig ?? snapshot.sourceConfig ?? {};
  const defaultAgentId = resolveDefaultAgentId(cfg);
  const defaultModel =
    resolveAgentEffectiveModelPrimary(cfg, defaultAgentId) ??
    resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model);
  const configPath = snapshot.path || (deps.resolveConfigPath ?? resolveConfigPath)(env);
  let gatewayUrl = `ws://127.0.0.1:${(deps.resolveGatewayPort ?? resolveGatewayPort)(cfg, env)}`;
  let gatewaySource = "local loopback";
  let gatewayError;
  try {
    const details = (
      deps.buildGatewayConnectionDetails ??
      (await import("./call-BtFiTrFI.js")).buildGatewayConnectionDetails
    )({
      config: cfg,
      configPath,
    });
    gatewayUrl = details.url;
    gatewaySource = details.urlSource;
    gatewayError = details.remoteFallbackNote;
  } catch (err) {
    gatewayError = err instanceof Error ? err.message : String(err);
  }
  const resolveReferences = deps.resolveOpenClawReferencePaths ?? resolveOpenClawReferencePaths;
  const commandProbe = deps.probeLocalCommand ?? probeLocalCommand;
  const [codex, claude, gemini, gateway, references] = await Promise.all([
    commandProbe("codex"),
    commandProbe("claude"),
    commandProbe("gemini"),
    (deps.probeGatewayUrl ?? probeGatewayUrl)(gatewayUrl),
    resolveFastTestReferences(env) ??
      resolveReferences({
        argv1: process.argv[1],
        cwd: process.cwd(),
        moduleUrl: import.meta.url,
      }),
  ]);
  return {
    config: {
      path: configPath,
      exists: snapshot.exists,
      valid: snapshot.valid,
      issues: issueMessages(snapshot),
      hash: snapshot.hash ?? null,
    },
    agents: buildAgentSummaries(cfg),
    defaultAgentId,
    defaultModel,
    tools: {
      codex,
      claude,
      gemini,
      apiKeys: {
        openai: Boolean(env.OPENAI_API_KEY?.trim()),
        anthropic: Boolean(env.ANTHROPIC_API_KEY?.trim()),
      },
    },
    gateway: {
      url: gateway.url,
      source: gatewaySource,
      reachable: gateway.reachable,
      error: gateway.error ?? gatewayError,
    },
    references: {
      docsPath: references.docsPath ?? void 0,
      docsUrl: OPENCLAW_DOCS_URL,
      sourcePath: references.sourcePath ?? void 0,
      sourceUrl: OPENCLAW_SOURCE_URL,
    },
  };
}
function formatCommandProbe(probe) {
  if (!probe.found) return "not found";
  if (probe.version) return probe.version;
  return probe.error ? `found (${probe.error})` : "found";
}
function formatCrestodianOverview(overview) {
  const agentLines = overview.agents.map((agent) => {
    return `  - ${[
      agent.id,
      agent.isDefault ? "default" : void 0,
      agent.name ? `name=${agent.name}` : void 0,
      agent.model ? `model=${agent.model}` : void 0,
      agent.workspace ? `workspace=${agent.workspace}` : void 0,
    ]
      .filter(Boolean)
      .join(" | ")}`;
  });
  const configStatus = overview.config.valid
    ? overview.config.exists
      ? "valid"
      : "missing"
    : "invalid";
  const issueLines =
    overview.config.issues.length > 0
      ? ["Config issues:", ...overview.config.issues.map((issue) => `  - ${issue}`)]
      : [];
  return [
    "Crestodian online. Little claws, typed tools.",
    "",
    `Config: ${configStatus}`,
    `Path: ${overview.config.path}`,
    `Default agent: ${overview.defaultAgentId}`,
    `Default model: ${overview.defaultModel ?? "not configured"}`,
    "Agents:",
    ...agentLines,
    `Codex: ${formatCommandProbe(overview.tools.codex)}`,
    `Claude Code: ${formatCommandProbe(overview.tools.claude)}`,
    `Gemini CLI: ${formatCommandProbe(overview.tools.gemini)}`,
    `API keys: OpenAI ${overview.tools.apiKeys.openai ? "found" : "not found"}, Anthropic ${overview.tools.apiKeys.anthropic ? "found" : "not found"}`,
    `AI: ${overview.defaultModel ? `conversation runs on ${overview.defaultModel}` : "inference unavailable; run openclaw onboard before starting Crestodian"}`,
    `Docs: ${overview.references.docsPath ?? overview.references.docsUrl}`,
    overview.references.sourcePath
      ? `Source: ${overview.references.sourcePath}`
      : `Source: ${overview.references.sourceUrl}`,
    `Gateway: ${overview.gateway.reachable ? "reachable" : "not reachable"} (${overview.gateway.url}, ${overview.gateway.source})`,
    overview.gateway.error ? `Gateway note: ${overview.gateway.error}` : void 0,
    `Next: ${recommendCrestodianNextStep(overview)}`,
    ...issueLines,
  ]
    .filter((line) => line !== void 0)
    .join("\n");
}
function recommendCrestodianNextStep(overview) {
  if (!overview.config.exists) return 'run "openclaw onboard" to establish inference';
  if (!overview.config.valid) return 'run "validate config" or "doctor" to inspect the config';
  if (!overview.defaultModel) return 'run "openclaw onboard" to establish inference';
  if (!overview.gateway.reachable) return 'run "gateway status" or "restart gateway"';
  return 'run "talk to agent" to enter your default agent';
}
function formatStartupConfigStatus(overview) {
  if (!overview.config.exists) return "missing";
  return overview.config.valid ? "valid" : "invalid";
}
function formatStartupUse(overview) {
  if (overview.defaultModel) return `Using: ${overview.defaultModel} — just tell me what you want.`;
  return "Inference unavailable: run `openclaw onboard` and complete a live model check first.";
}
function formatStartupGatewayStatus(overview) {
  if (overview.gateway.reachable) return `Gateway: reachable at ${overview.gateway.url}.`;
  return `Gateway: not reachable at ${overview.gateway.url}; I already did the first probe.`;
}
function formatStartupAction(overview) {
  if (!overview.config.valid) return "I can start debugging with `validate config` or `doctor`.";
  if (!overview.defaultModel)
    return "Crestodian needs working inference before it can help with the rest of setup.";
  if (!overview.config.exists)
    return "Run `openclaw onboard` to establish inference before starting Crestodian.";
  if (!overview.gateway.reachable)
    return "I can start debugging with `gateway status`, or queue `restart gateway` for approval.";
  return "Everything basic is reachable. Use `talk to agent` when you want the normal agent.";
}
/**
 * Welcome shown right after inference activation. Crestodian owns the
 * remaining workspace, Gateway, channel, and agent setup.
 */
function formatCrestodianOnboardingWelcome(overview) {
  return [
    "## Inference is ready.",
    "",
    `- Verified model: ${overview.defaultModel ?? "not configured"}.`,
    `- ${overview.gateway.reachable ? `Gateway: running at ${overview.gateway.url}.` : "Gateway: not configured or reachable yet."}`,
    "- I can now finish your workspace, Gateway, channels, agents, plugins, and other optional setup.",
    "- Connect how you want to talk: say `connect whatsapp`, `connect telegram`, `connect slack`, `connect discord` — or `channels` for the full list.",
    "",
    "Say `talk to agent` to meet your agent right here, or `help` for everything I can do.",
  ].join("\n");
}
function formatCrestodianStartupMessage(overview) {
  const agent = overview.agents.find((entry) => entry.id === overview.defaultAgentId);
  const agentLabel = agent?.name
    ? `${overview.defaultAgentId} (${agent.name})`
    : overview.defaultAgentId;
  return [
    "## Hi, I'm Crestodian.",
    "",
    "- Start me when setup, config, Gateway, model choice, or agent routing feels off.",
    `- ${formatStartupUse(overview)}`,
    `- Config: ${formatStartupConfigStatus(overview)}. Default agent: ${agentLabel}.`,
    `- ${formatStartupGatewayStatus(overview)}`,
    "",
    formatStartupAction(overview),
  ].join("\n");
}
//#endregion
export {
  probeLocalCommand as a,
  loadCrestodianOverview as i,
  formatCrestodianOverview as n,
  formatCrestodianStartupMessage as r,
  formatCrestodianOnboardingWelcome as t,
};
