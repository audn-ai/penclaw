import { randomUUID } from "node:crypto";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import path from "node:path";
import { inspect } from "node:util";
import "./config-schema-B4teWnv2.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./runtime-api-C15FJE4y.js";
import { n as readJsonFileWithFallback } from "./json-store-CSxUwOCu.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { p as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CJQ8TR--.js";
import {
  a as createAcpxProcessLeaseStore,
  d as ACPX_GATEWAY_INSTANCE_KEY,
  f as ACPX_GATEWAY_INSTANCE_NAMESPACE,
  h as normalizeAcpxGatewayInstanceRecord,
  l as openAcpxProcessLeaseStateStore,
  n as OPENCLAW_ACPX_LEASE_ID_ENV,
  r as OPENCLAW_GATEWAY_INSTANCE_ID_ARG,
  t as OPENCLAW_ACPX_LEASE_ID_ARG,
} from "./process-lease-DiKkFj6F.js";
import {
  a as resolveAcpxPluginRoot,
  c as splitCommandParts,
  i as resolveAcpxPluginConfig,
  o as toAcpMcpServers,
  r as reapStaleOpenClawOwnedAcpxOrphans,
  s as quoteCommandPart,
  t as cleanupOpenClawOwnedAcpxProcessTree,
} from "./process-reaper-BUFiavaJ.js";
import {
  a as unregisterAcpRuntimeBackend,
  n as registerAcpRuntimeBackend,
} from "./registry-BVG2dQ33.js";
import { t as createLazyAcpRuntimeProxy } from "./runtime-proxy-BTnYAJY7.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region extensions/acpx/src/codex-trust-config.ts
/**
 * Builds isolated Codex config for ACPX sessions. It preserves safe inherited
 * runtime options while rendering only trusted project entries for the session.
 */
function stripTomlComment(line) {
  let quote = null;
  let escaping = false;
  for (let index = 0; index < line.length; index += 1) {
    const ch = line[index];
    if (escaping) {
      escaping = false;
      continue;
    }
    if (quote === '"' && ch === "\\") {
      escaping = true;
      continue;
    }
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }
    if (ch === "#") return line.slice(0, index);
  }
  return line;
}
function parseTomlString(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"'))
    try {
      return JSON.parse(trimmed);
    } catch {
      return;
    }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
}
function parseTomlDottedKey(value) {
  const parts = [];
  let current = "";
  let quote = null;
  let escaping = false;
  for (const ch of value.trim()) {
    if (escaping) {
      current += ch;
      escaping = false;
      continue;
    }
    if (quote === '"' && ch === "\\") {
      current += ch;
      escaping = true;
      continue;
    }
    if (quote) {
      current += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') {
      quote = ch;
      current += ch;
      continue;
    }
    if (ch === ".") {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts.map((part) => parseTomlString(part) ?? part);
}
function parseProjectHeader(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]") || trimmed.startsWith("[[")) return;
  const parts = parseTomlDottedKey(trimmed.slice(1, -1));
  return parts.length === 2 && parts[0] === "projects" ? parts[1] : void 0;
}
function parseTrustedInlineProjectEntries(value) {
  const trusted = [];
  for (const match of value.matchAll(
    /(?<key>"(?:\\.|[^"\\])*"|'[^']*'|[A-Za-z0-9_\-/.~:]+)\s*=\s*\{(?<body>[^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
  )) {
    const key = match.groups?.key;
    const body = match.groups?.body;
    if (!key || !body || !/\btrust_level\s*=\s*["']trusted["']/.test(body)) continue;
    const projectPath = parseTomlString(key) ?? key.trim();
    if (projectPath) trusted.push(projectPath);
  }
  return trusted;
}
/** Extract trusted project paths from Codex TOML config. */
function extractTrustedCodexProjectPaths(configToml) {
  const trusted = /* @__PURE__ */ new Set();
  let currentProjectPath;
  let inProjectsTable = false;
  for (const rawLine of configToml.split(/\r?\n/)) {
    const line = stripTomlComment(rawLine).trim();
    if (!line) continue;
    if (line.startsWith("[")) {
      currentProjectPath = parseProjectHeader(line);
      inProjectsTable = line === "[projects]";
      continue;
    }
    if (currentProjectPath && /^trust_level\s*=\s*["']trusted["']\s*$/.test(line)) {
      trusted.add(currentProjectPath);
      continue;
    }
    const assignment =
      /^(?<key>"(?:\\.|[^"\\])*"|'[^']*'|[A-Za-z0-9_\-/.~:]+)\s*=\s*(?<value>.+)$/.exec(line);
    const rawKey = assignment?.groups?.key;
    const rawValue = assignment?.groups?.value;
    if (!rawKey || rawValue === void 0) continue;
    const key = parseTomlString(rawKey) ?? rawKey;
    const value = rawValue.trim();
    if (inProjectsTable && /^\{.*\}$/.test(value)) {
      if (/\btrust_level\s*=\s*["']trusted["']/.test(value) && key) trusted.add(key);
      continue;
    }
    if (key === "projects" || inProjectsTable)
      for (const projectPath of parseTrustedInlineProjectEntries(value)) trusted.add(projectPath);
  }
  return Array.from(trusted);
}
const INHERITED_TOP_LEVEL_CODEX_CONFIG_KEYS = /* @__PURE__ */ new Set([
  "model",
  "model_provider",
  "model_reasoning_effort",
  "sandbox_mode",
]);
const INHERITED_MODEL_PROVIDER_CONFIG_KEYS = /* @__PURE__ */ new Set([
  "name",
  "base_url",
  "wire_api",
  "env_key",
  "env_key_instructions",
  "requires_openai_auth",
  "request_max_retries",
  "stream_max_retries",
  "stream_idle_timeout_ms",
]);
function parseTableHeader(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]") || trimmed.startsWith("[[")) return;
  return parseTomlDottedKey(trimmed.slice(1, -1));
}
function isInheritedModelProviderTable(parts) {
  return parts?.[0] === "model_providers" && parts.length === 2;
}
function parseTopLevelAssignmentKey(line) {
  return /^(?<key>[A-Za-z0-9_-]+)\s*=\s*(?<value>.+)$/.exec(line)?.groups?.key;
}
function extractInheritedCodexRuntimeConfig(configToml) {
  const inheritedLines = [];
  let inAnyTable = false;
  let inInheritedTable = false;
  let pendingInheritedTableHeader = "";
  function flushInheritedTableHeader() {
    if (!pendingInheritedTableHeader) return;
    if (inheritedLines.length > 0 && inheritedLines[inheritedLines.length - 1] !== "")
      inheritedLines.push("");
    inheritedLines.push(pendingInheritedTableHeader);
    pendingInheritedTableHeader = "";
  }
  for (const rawLine of configToml.split(/\r?\n/)) {
    const trimmedLine = rawLine.trim();
    const semanticLine = stripTomlComment(rawLine).trim();
    if (trimmedLine.startsWith("[")) {
      const tableParts = parseTableHeader(trimmedLine);
      inAnyTable = true;
      inInheritedTable = isInheritedModelProviderTable(tableParts);
      if (inInheritedTable) pendingInheritedTableHeader = rawLine.trimEnd();
      else pendingInheritedTableHeader = "";
      continue;
    }
    if (inInheritedTable) {
      if (!semanticLine) continue;
      const key = parseTopLevelAssignmentKey(semanticLine);
      if (!key || !INHERITED_MODEL_PROVIDER_CONFIG_KEYS.has(key)) continue;
      flushInheritedTableHeader();
      inheritedLines.push(rawLine.trimEnd());
      continue;
    }
    if (inAnyTable) continue;
    const key = parseTopLevelAssignmentKey(semanticLine);
    if (!key) continue;
    if (!INHERITED_TOP_LEVEL_CODEX_CONFIG_KEYS.has(key)) continue;
    inheritedLines.push(rawLine.trimEnd());
  }
  while (inheritedLines.length > 0 && inheritedLines[inheritedLines.length - 1] === "")
    inheritedLines.pop();
  return inheritedLines.join("\n");
}
/** Render a session-local Codex config with inherited runtime settings and trust entries. */
function renderIsolatedCodexConfig(params) {
  const normalized = Array.from(
    new Set(
      params.projectPaths
        .map((projectPath) => projectPath.trim())
        .filter(Boolean)
        .map((projectPath) => path.resolve(projectPath)),
    ),
  ).toSorted((left, right) => left.localeCompare(right));
  return [
    "# Generated by OpenClaw for Codex ACP sessions.",
    params.sourceConfigToml ? extractInheritedCodexRuntimeConfig(params.sourceConfigToml) : "",
    ...normalized.flatMap((projectPath) => [
      "",
      `[projects.${JSON.stringify(projectPath)}]`,
      'trust_level = "trusted"',
    ]),
    "",
  ]
    .filter((line, index, lines) => !(line === "" && lines[index - 1] === ""))
    .join("\n");
}
//#endregion
//#region extensions/acpx/src/codex-auth-bridge.ts
/**
 * Prepares isolated Codex and Claude ACP wrapper commands for ACPX. The bridge
 * copies safe auth/config state into plugin-owned homes and redacts diagnostics.
 */
const CODEX_ACP_PACKAGE = "@zed-industries/codex-acp";
const CODEX_ACP_BIN = "codex-acp";
const CLAUDE_ACP_PACKAGE = "@agentclientprotocol/claude-agent-acp";
const CLAUDE_ACP_BIN = "claude-agent-acp";
const RUN_CONFIGURED_COMMAND_SENTINEL = "--openclaw-run-configured";
const requireFromHere = createRequire(import.meta.url);
function readSelfManifest() {
  const manifestPath = path.join(resolveAcpxPluginRoot(import.meta.url), "package.json");
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}
function readManifestDependencyVersion(packageName) {
  const version = readSelfManifest().dependencies?.[packageName];
  if (typeof version !== "string" || version.trim() === "")
    throw new Error(`Missing ${packageName} dependency version in @openclaw/acpx manifest`);
  return version;
}
const CODEX_ACP_PACKAGE_VERSION = readManifestDependencyVersion(CODEX_ACP_PACKAGE);
const CLAUDE_ACP_PACKAGE_VERSION = readManifestDependencyVersion(CLAUDE_ACP_PACKAGE);
function basename$1(value) {
  return value.split(/[\\/]/).pop() ?? value;
}
function resolvePackageBinPath(packageJsonPath, manifest, binName) {
  const { bin } = manifest;
  const relativeBinPath =
    typeof bin === "string" ? bin : bin && typeof bin === "object" ? bin[binName] : void 0;
  if (typeof relativeBinPath !== "string" || relativeBinPath.trim() === "") return;
  return path.resolve(path.dirname(packageJsonPath), relativeBinPath);
}
async function resolveInstalledAcpPackageBinPath(packageName, binName) {
  try {
    const packageJsonPath = requireFromHere.resolve(`${packageName}/package.json`);
    const { value: manifest } = await readJsonFileWithFallback(packageJsonPath, {});
    if (manifest.name !== packageName) return;
    const binPath = resolvePackageBinPath(packageJsonPath, manifest, binName);
    if (!binPath) return;
    await fs$1.access(binPath);
    return binPath;
  } catch {
    return;
  }
}
async function resolveInstalledCodexAcpBinPath() {
  return await resolveInstalledAcpPackageBinPath(CODEX_ACP_PACKAGE, CODEX_ACP_BIN);
}
async function resolveInstalledClaudeAcpBinPath() {
  return await resolveInstalledAcpPackageBinPath(CLAUDE_ACP_PACKAGE, CLAUDE_ACP_BIN);
}
const DIAGNOSTIC_REDACTION_RULES = [
  {
    source: String.raw`(authorization\s*[:=]\s*bearer\s+)[^\s'"<>]+`,
    flags: "gi",
    replacement: "$1[REDACTED]",
  },
  {
    source: String.raw`((?:api[_-]?key|apiKey|access[_-]?token|refresh[_-]?token|client[_-]?secret|token|secret|password|passwd|credential)\s*[:=]\s*)[^\s'"<>]+`,
    flags: "gi",
    replacement: "$1[REDACTED]",
  },
  {
    source: String.raw`("(?:apiKey|token|secret|password|passwd|accessToken|refreshToken)"\s*:\s*")[^"]+`,
    flags: "g",
    replacement: "$1[REDACTED]",
  },
  {
    source: String.raw`(["']?(?:api[-_]?key|apiKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|token|secret|password|passwd|credential)["']?\s*[:=]\s*["']?)[^"',}\s<>]+`,
    flags: "gi",
    replacement: "$1[REDACTED]",
  },
  {
    source: String.raw`([?&](?:access[-_]?token|auth[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature)=)[^&\s'"<>]+`,
    flags: "gi",
    replacement: "$1[REDACTED]",
  },
  {
    source: String.raw`(--(?:api[-_]?key|token|secret|password|passwd)\s+)[^\s'"]+`,
    flags: "gi",
    replacement: "$1[REDACTED]",
  },
  {
    source:
      String.raw`-----BEGIN [A-Z ]*PRI` +
      String.raw`VATE KEY-----[\s\S]+?-----END [A-Z ]*PRI` +
      String.raw`VATE KEY-----`,
    flags: "g",
    replacement: "[REDACTED_PRIVATE_KEY]",
  },
  {
    source: String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
    flags: "g",
    replacement: "[REDACTED_OPENAI_KEY]",
  },
  {
    source: String.raw`\b(gh[pousr]_[A-Za-z0-9_]{20,})\b`,
    flags: "g",
    replacement: "[REDACTED_GITHUB_TOKEN]",
  },
  {
    source: String.raw`\b(github_pat_[A-Za-z0-9_]{20,})\b`,
    flags: "g",
    replacement: "[REDACTED_GITHUB_TOKEN]",
  },
  {
    source: String.raw`\b(xox[baprs]-[A-Za-z0-9-]{10,})\b`,
    flags: "g",
    replacement: "[REDACTED_SLACK_TOKEN]",
  },
  {
    source: String.raw`\b(gsk_[A-Za-z0-9_-]{10,})\b`,
    flags: "g",
    replacement: "[REDACTED_API_KEY]",
  },
  {
    source: String.raw`\b(AIza[0-9A-Za-z\-_]{20,})\b`,
    flags: "g",
    replacement: "[REDACTED_GOOGLE_KEY]",
  },
  {
    source: String.raw`\b(ya29\.[0-9A-Za-z_\-./+=]{10,})\b`,
    flags: "g",
    replacement: "[REDACTED_GOOGLE_TOKEN]",
  },
  {
    source: String.raw`\b(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})\b`,
    flags: "g",
    replacement: "[REDACTED_JWT]",
  },
  {
    source: String.raw`\b(pplx-[A-Za-z0-9_-]{10,})\b`,
    flags: "g",
    replacement: "[REDACTED_API_KEY]",
  },
  {
    source: String.raw`\b(npm_[A-Za-z0-9]{10,})\b`,
    flags: "g",
    replacement: "[REDACTED_NPM_TOKEN]",
  },
  {
    source: String.raw`\b(LTAI[A-Za-z0-9]{10,})\b`,
    flags: "g",
    replacement: "[REDACTED_ACCESS_KEY]",
  },
  {
    source: String.raw`\b(hf_[A-Za-z0-9]{10,})\b`,
    flags: "g",
    replacement: "[REDACTED_API_KEY]",
  },
  {
    source: String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`,
    flags: "g",
    replacement: "bot[REDACTED_TELEGRAM_TOKEN]",
  },
  {
    source: String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`,
    flags: "g",
    replacement: "[REDACTED_TELEGRAM_TOKEN]",
  },
];
function renderDiagnosticRedactionRuleSpecs() {
  return JSON.stringify(DIAGNOSTIC_REDACTION_RULES);
}
function buildAdapterWrapperScript(params) {
  return `#!/usr/bin/env node
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { fileURLToPath } from "node:url";

${params.envSetup}
const stderrLogFileNamePrefix = ${params.stderrLogFileNamePrefix ? JSON.stringify(params.stderrLogFileNamePrefix) : "undefined"};
const stderrLogMaxChars = 256 * 1024;

const openClawWrapperArgs = new Set([
  ${quoteCommandPart(OPENCLAW_ACPX_LEASE_ID_ARG)},
  ${quoteCommandPart(OPENCLAW_GATEWAY_INSTANCE_ID_ARG)},
]);

function readOpenClawWrapperArg(args, name) {
  const index = args.indexOf(name);
  if (index < 0) {
    return undefined;
  }
  const value = args[index + 1];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function safeDiagnosticFilePart(value) {
  const sanitized = String(value || "").replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120);
  return sanitized || "pid-" + process.pid;
}

function resolveStderrLogPath(args) {
  if (!stderrLogFileNamePrefix) {
    return undefined;
  }
  const leaseId =
    process.env[${JSON.stringify(OPENCLAW_ACPX_LEASE_ID_ENV)}] ||
    readOpenClawWrapperArg(args, ${quoteCommandPart(OPENCLAW_ACPX_LEASE_ID_ARG)}) ||
    "pid-" + process.pid;
  const fileName = stderrLogFileNamePrefix + "." + safeDiagnosticFilePart(leaseId) + ".log";
  return fileURLToPath(new URL("./" + fileName, import.meta.url));
}

const diagnosticRedactionRules = ${renderDiagnosticRedactionRuleSpecs()}.map((rule) => [
  new RegExp(rule.source, rule.flags),
  rule.replacement,
]);

function redactDiagnosticText(text) {
  let redacted = text;
  for (const [pattern, replacement] of diagnosticRedactionRules) {
    redacted = redacted.replace(pattern, replacement);
  }
  return redacted;
}

function tailUtf16Safe(text, maxChars) {
  let start = Math.max(0, text.length - maxChars);
  const startsInsideSurrogatePair =
    start > 0 &&
    start < text.length &&
    text.charCodeAt(start) >= 0xdc00 &&
    text.charCodeAt(start) <= 0xdfff &&
    text.charCodeAt(start - 1) >= 0xd800 &&
    text.charCodeAt(start - 1) <= 0xdbff;
  if (startsInsideSurrogatePair) {
    start += 1;
  }
  return text.slice(start);
}

let pendingStderrLogText = "";
// Pipe chunks can split a UTF-8 sequence. Preserve decoder state so diagnostic
// capture does not manufacture replacement characters between chunks.
const stderrDecoder = new StringDecoder("utf8");
const stderrPrivateKeyEndPattern = /-----END [A-Z ]*PRIVATE KEY-----/;

function hasUnclosedPrivateKeyBlock(text) {
  let lastBeginIndex = -1;
  for (const match of text.matchAll(/-----BEGIN [A-Z ]*PRIVATE KEY-----/g)) {
    lastBeginIndex = match.index ?? lastBeginIndex;
  }
  if (lastBeginIndex === -1) {
    return -1;
  }
  return stderrPrivateKeyEndPattern.test(text.slice(lastBeginIndex)) ? -1 : lastBeginIndex;
}

function writeRedactedStderrLog(text) {
  if (!stderrLogPath) {
    return;
  }
  if (!text) {
    return;
  }
  try {
    appendFileSync(stderrLogPath, redactDiagnosticText(text), "utf8");
    const current = readFileSync(stderrLogPath, "utf8");
    if (current.length > stderrLogMaxChars) {
      writeFileSync(stderrLogPath, tailUtf16Safe(current, stderrLogMaxChars), "utf8");
    }
  } catch {
    // Stderr capture is diagnostic-only; never break the ACP adapter.
  }
}

function redactIncompletePrivateKeyTail(text) {
  const unclosedPrivateKeyStart = hasUnclosedPrivateKeyBlock(text);
  if (unclosedPrivateKeyStart === -1) {
    return text;
  }
  return text.slice(0, unclosedPrivateKeyStart) + "[REDACTED_PRIVATE_KEY]";
}

function flushFinalizedStderrLogText() {
  const lastLineBreak = pendingStderrLogText.lastIndexOf("\\n");
  if (lastLineBreak === -1) {
    if (pendingStderrLogText.length > stderrLogMaxChars) {
      pendingStderrLogText = tailUtf16Safe(pendingStderrLogText, stderrLogMaxChars);
    }
    return;
  }
  let flushEnd = lastLineBreak + 1;
  const unclosedPrivateKeyStart = hasUnclosedPrivateKeyBlock(
    pendingStderrLogText.slice(0, flushEnd),
  );
  if (unclosedPrivateKeyStart !== -1) {
    flushEnd = unclosedPrivateKeyStart;
  }
  if (flushEnd <= 0) {
    if (pendingStderrLogText.length > stderrLogMaxChars) {
      pendingStderrLogText = tailUtf16Safe(pendingStderrLogText, stderrLogMaxChars);
    }
    return;
  }
  const finalizedText = pendingStderrLogText.slice(0, flushEnd);
  pendingStderrLogText = pendingStderrLogText.slice(flushEnd);
  writeRedactedStderrLog(finalizedText);
}

function appendStderrLog(chunk) {
  const text = stderrDecoder.write(chunk);
  if (!text) {
    return;
  }
  pendingStderrLogText += text;
  flushFinalizedStderrLogText();
}

function finishStderrLog() {
  pendingStderrLogText += stderrDecoder.end();
  const text = redactIncompletePrivateKeyTail(pendingStderrLogText);
  pendingStderrLogText = "";
  writeRedactedStderrLog(text);
}

function stripOpenClawWrapperArgs(args) {
  const stripped = [];
  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];
    if (openClawWrapperArgs.has(value)) {
      index += 1;
      continue;
    }
    stripped.push(value);
  }
  return stripped;
}

const rawConfiguredArgs = process.argv.slice(2);
const stderrLogPath = resolveStderrLogPath(rawConfiguredArgs);

try {
  if (stderrLogPath) {
    writeFileSync(stderrLogPath, "", "utf8");
  }
} catch {
  // Stderr capture is diagnostic-only; never break the ACP adapter.
}

const configuredArgs = stripOpenClawWrapperArgs(rawConfiguredArgs);

function resolveNpmCliPath() {
  const candidate = path.resolve(
    path.dirname(process.execPath),
    "..",
    "lib",
    "node_modules",
    "npm",
    "bin",
    "npm-cli.js",
  );
  return existsSync(candidate) ? candidate : undefined;
}

const npmCliPath = resolveNpmCliPath();
const installedBinPath = ${params.installedBinPath ? quoteCommandPart(params.installedBinPath) : "undefined"};
let defaultCommand;
let defaultArgs;
if (installedBinPath) {
  defaultCommand = process.execPath;
  defaultArgs = [installedBinPath];
} else if (npmCliPath) {
  defaultCommand = process.execPath;
  defaultArgs = [npmCliPath, "exec", "--yes", "--package", "${params.packageSpec}", "--", "${params.binName}"];
} else {
  defaultCommand = process.platform === "win32" ? "npx.cmd" : "npx";
  defaultArgs = ["--yes", "--package", "${params.packageSpec}", "--", "${params.binName}"];
}
const command =
  configuredArgs[0] === "${RUN_CONFIGURED_COMMAND_SENTINEL}" ? configuredArgs[1] : defaultCommand;
const args =
  configuredArgs[0] === "${RUN_CONFIGURED_COMMAND_SENTINEL}"
    ? configuredArgs.slice(2)
    : [...defaultArgs, ...configuredArgs];

if (!command) {
  console.error("[openclaw] missing configured ${params.displayName} ACP command");
  process.exit(1);
}

const child = spawn(command, args, {
  detached: process.platform !== "win32",
  env,
  stdio: ["inherit", "inherit", "pipe"],
  windowsHide: true,
});

child.stderr?.on("data", (chunk) => {
  appendStderrLog(chunk);
  process.stderr.write(chunk);
});

let forceKillTimer;
let orphanCleanupStarted = false;
let childExitCode = 1;

function killChildTree(signal, options = {}) {
  if (!child.pid || (!options.force && child.killed)) {
    return;
  }
  if (process.platform !== "win32") {
    try {
      // The adapter can spawn grandchildren; signaling the process group keeps
      // the generated wrapper from leaving an ACP tree behind.
      process.kill(-child.pid, signal);
      return;
    } catch {
      // Fall back to direct child signaling below.
    }
  }
  child.kill(signal);
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.once(signal, () => {
    killChildTree(signal);
  });
}

const originalParentPid = process.ppid;
const parentWatcher =
  process.platform === "win32"
    ? undefined
    : setInterval(() => {
        // Orphan detection: parent PID changed means our original parent died.
        // The new parent could be PID 1 (init) on bare-metal hosts, OR a
        // systemd user-session manager, OR a container init, OR a session
        // leader — depending on environment. Previously this only triggered
        // on PPID == 1, which missed all systemd-managed deployments and
        // leaked codex-acp adapter trees on every gateway restart.
        if (process.ppid === originalParentPid) {
          return;
        }
        if (orphanCleanupStarted) {
          return;
        }
        orphanCleanupStarted = true;
        if (parentWatcher) {
          clearInterval(parentWatcher);
        }
        killChildTree("SIGTERM");
        // Keep the wrapper alive long enough for stubborn adapters to receive
        // a forced fallback signal after SIGTERM.
        forceKillTimer = setTimeout(() => {
          killChildTree("SIGKILL", { force: true });
          childExitCode = 1;
        }, 1_500);
      }, 1_000);
parentWatcher?.unref?.();

child.on("error", (error) => {
  console.error(\`[openclaw] failed to launch ${params.displayName} ACP wrapper: \${error.message}\`);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (parentWatcher) {
    clearInterval(parentWatcher);
  }
  if (orphanCleanupStarted) {
    return;
  }
  if (forceKillTimer) {
    clearTimeout(forceKillTimer);
  }
  if (code !== null) {
    childExitCode = code;
    return;
  }
  childExitCode = signal ? 1 : 0;
});

child.on("close", () => {
  finishStderrLog();
  process.exit(childExitCode);
});
`;
}
function buildCodexAcpWrapperScript(installedBinPath) {
  return buildAdapterWrapperScript({
    displayName: "Codex",
    packageSpec: `${CODEX_ACP_PACKAGE}@${CODEX_ACP_PACKAGE_VERSION}`,
    binName: CODEX_ACP_BIN,
    installedBinPath,
    stderrLogFileNamePrefix: "codex-acp-wrapper.stderr",
    envSetup: `const codexHome = fileURLToPath(new URL("./codex-home/", import.meta.url));
const codexAuthPath = fileURLToPath(new URL("./codex-home/auth.json", import.meta.url));
const codexApiKey = (process.env.CODEX_API_KEY || process.env.OPENAI_API_KEY || "").trim();
let shouldWriteCodexApiKeyAuth = false;
if (codexApiKey) {
  if (!existsSync(codexAuthPath)) {
    shouldWriteCodexApiKeyAuth = true;
  } else {
    try {
      const existingCodexAuth = JSON.parse(readFileSync(codexAuthPath, "utf8"));
      shouldWriteCodexApiKeyAuth =
        !existingCodexAuth ||
        typeof existingCodexAuth !== "object" ||
        typeof existingCodexAuth.OPENAI_API_KEY === "string";
    } catch {
      shouldWriteCodexApiKeyAuth = true;
    }
  }
}
if (shouldWriteCodexApiKeyAuth) {
  writeFileSync(
    codexAuthPath,
    JSON.stringify({
      OPENAI_API_KEY: codexApiKey,
      tokens: null,
      last_refresh: null,
    }) + "\\n",
    { mode: 0o600 },
  );
}
const env = {
  ...process.env,
  CODEX_HOME: codexHome,
};`,
  });
}
function buildClaudeAcpWrapperScript(installedBinPath) {
  return buildAdapterWrapperScript({
    displayName: "Claude",
    packageSpec: `${CLAUDE_ACP_PACKAGE}@${CLAUDE_ACP_PACKAGE_VERSION}`,
    binName: CLAUDE_ACP_BIN,
    installedBinPath,
    envSetup: `const env = {
  ...process.env,
};`,
  });
}
async function readSourceCodexConfig(codexHome) {
  try {
    return await fs$1.readFile(path.join(codexHome, "config.toml"), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
}
async function prepareIsolatedCodexHome(params) {
  const sourceConfig = await readSourceCodexConfig(
    process.env.CODEX_HOME || path.join(os.homedir(), ".codex"),
  );
  const trustedProjectPaths = [
    ...(sourceConfig ? extractTrustedCodexProjectPaths(sourceConfig) : []),
    params.workspaceDir,
  ];
  const codexHome = path.join(params.baseDir, "codex-home");
  await fs$1.mkdir(codexHome, { recursive: true });
  await fs$1.writeFile(
    path.join(codexHome, "config.toml"),
    renderIsolatedCodexConfig({
      sourceConfigToml: sourceConfig,
      projectPaths: trustedProjectPaths,
    }),
    "utf8",
  );
  return codexHome;
}
async function makeGeneratedWrapperExecutableIfPossible(wrapperPath) {
  try {
    await fs$1.chmod(wrapperPath, 493);
  } catch {}
}
async function writeCodexAcpWrapper(baseDir, installedBinPath) {
  await fs$1.mkdir(baseDir, { recursive: true });
  const wrapperPath = path.join(baseDir, "codex-acp-wrapper.mjs");
  await fs$1.writeFile(wrapperPath, buildCodexAcpWrapperScript(installedBinPath), {
    encoding: "utf8",
  });
  await makeGeneratedWrapperExecutableIfPossible(wrapperPath);
  return wrapperPath;
}
async function writeClaudeAcpWrapper(baseDir, installedBinPath) {
  await fs$1.mkdir(baseDir, { recursive: true });
  const wrapperPath = path.join(baseDir, "claude-agent-acp-wrapper.mjs");
  await fs$1.writeFile(wrapperPath, buildClaudeAcpWrapperScript(installedBinPath), {
    encoding: "utf8",
  });
  await makeGeneratedWrapperExecutableIfPossible(wrapperPath);
  return wrapperPath;
}
function buildWrapperCommand(wrapperPath, args = []) {
  return [process.execPath, wrapperPath, ...args].map(quoteCommandPart).join(" ");
}
function isAcpPackageSpec(value, packageName) {
  const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escapedPackageName}(?:@.+)?$`, "i").test(value.trim());
}
function isAcpBinName(value, binName) {
  const commandName = basename$1(value);
  const escapedBinName = binName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escapedBinName}(?:\\.exe|\\.[cm]?js)?$`, "i").test(commandName);
}
function isPackageRunnerCommand(value) {
  return /^(?:npx|npm|pnpm|bunx)(?:\.cmd|\.exe)?$/i.test(basename$1(value));
}
function extractConfiguredAdapterArgs(params) {
  const trimmedConfiguredCommand = params.configuredCommand?.trim();
  if (!trimmedConfiguredCommand) return [];
  const parts = splitCommandParts(trimmedConfiguredCommand);
  if (!parts.length) return [];
  const packageIndex = parts.findIndex((part) => isAcpPackageSpec(part, params.packageName));
  if (packageIndex >= 0) {
    if (!isPackageRunnerCommand(parts[0] ?? "")) return;
    const afterPackage = parts.slice(packageIndex + 1);
    if (afterPackage[0] === "--" && isAcpBinName(afterPackage[1] ?? "", params.binName))
      return afterPackage.slice(2);
    if (isAcpBinName(afterPackage[0] ?? "", params.binName)) return afterPackage.slice(1);
    return afterPackage[0] === "--" ? afterPackage.slice(1) : afterPackage;
  }
  if (isAcpBinName(parts[0] ?? "", params.binName)) return parts.slice(1);
  if (basename$1(parts[0] ?? "") === "node" && isAcpBinName(parts[1] ?? "", params.binName))
    return parts.slice(2);
}
function buildCodexAcpWrapperCommand(wrapperPath, configuredCommand) {
  const configuredAdapterArgs = extractConfiguredAdapterArgs({
    configuredCommand,
    packageName: CODEX_ACP_PACKAGE,
    binName: CODEX_ACP_BIN,
  });
  if (configuredAdapterArgs) return buildWrapperCommand(wrapperPath, configuredAdapterArgs);
  return buildWrapperCommand(wrapperPath, [
    RUN_CONFIGURED_COMMAND_SENTINEL,
    ...splitCommandParts(configuredCommand?.trim() ?? ""),
  ]);
}
function buildClaudeAcpWrapperCommand(wrapperPath, configuredCommand) {
  const configuredAdapterArgs = extractConfiguredAdapterArgs({
    configuredCommand,
    packageName: CLAUDE_ACP_PACKAGE,
    binName: CLAUDE_ACP_BIN,
  });
  if (configuredAdapterArgs) return buildWrapperCommand(wrapperPath, configuredAdapterArgs);
  return configuredCommand?.trim() || buildWrapperCommand(wrapperPath);
}
/** Prepare ACPX agent commands and isolated auth homes for Codex/Claude adapters. */
async function prepareAcpxCodexAuthConfig(params) {
  params.logger;
  const codexBaseDir = path.join(params.stateDir, "acpx");
  await prepareIsolatedCodexHome({
    baseDir: codexBaseDir,
    workspaceDir: params.pluginConfig.cwd,
  });
  const installedCodexBinPath = await (
    params.resolveInstalledCodexAcpBinPath ?? resolveInstalledCodexAcpBinPath
  )();
  const installedClaudeBinPath = await (
    params.resolveInstalledClaudeAcpBinPath ?? resolveInstalledClaudeAcpBinPath
  )();
  const wrapperPath = await writeCodexAcpWrapper(codexBaseDir, installedCodexBinPath);
  const claudeWrapperPath = await writeClaudeAcpWrapper(codexBaseDir, installedClaudeBinPath);
  const configuredCodexCommand = params.pluginConfig.agents.codex;
  const configuredClaudeCommand = params.pluginConfig.agents.claude;
  return {
    ...params.pluginConfig,
    agents: {
      ...params.pluginConfig.agents,
      codex: buildCodexAcpWrapperCommand(wrapperPath, configuredCodexCommand),
      claude: buildClaudeAcpWrapperCommand(claudeWrapperPath, configuredClaudeCommand),
    },
  };
}
//#endregion
//#region extensions/acpx/src/service.ts
/**
 * ACPX plugin service lifecycle. It resolves config, prepares isolated adapter
 * wrappers, registers the ACP backend, and manages startup/cleanup probes.
 */
const ENABLE_STARTUP_PROBE_ENV = "OPENCLAW_ACPX_RUNTIME_STARTUP_PROBE";
const SKIP_RUNTIME_PROBE_ENV = "OPENCLAW_SKIP_ACPX_RUNTIME_PROBE";
const ACPX_BACKEND_ID = "acpx";
const loadRuntimeModule = createLazyRuntimeModule(() => import("./runtime-BvMyYjwc.js"));
/** Convert ACPX timeout seconds into timer-safe milliseconds. */
function resolveAcpxTimerTimeoutMs(timeoutSeconds) {
  if (timeoutSeconds === void 0) return;
  return finiteSecondsToTimerSafeMilliseconds(timeoutSeconds) ?? 1;
}
function createLazyDefaultRuntime(params) {
  let runtime = null;
  let runtimePromise = null;
  async function resolveRuntime() {
    if (runtime) return runtime;
    runtimePromise ??= loadRuntimeModule().then((module) => {
      runtime = new module.AcpxRuntime({
        cwd: params.pluginConfig.cwd,
        openclawGatewayInstanceId: params.gatewayInstanceId,
        openclawProcessLeaseStore: params.processLeaseStore,
        openclawWrapperRoot: params.wrapperRoot,
        sessionStore: module.createFileSessionStore({ stateDir: params.pluginConfig.stateDir }),
        agentRegistry: module.createAgentRegistry({ overrides: params.pluginConfig.agents }),
        probeAgent: params.pluginConfig.probeAgent,
        mcpServers: toAcpMcpServers(params.pluginConfig.mcpServers),
        openclawToolsMcpBridgeEnabled: params.pluginConfig.openClawToolsMcpBridge,
        permissionMode: params.pluginConfig.permissionMode,
        nonInteractivePermissions: params.pluginConfig.nonInteractivePermissions,
        timeoutMs: resolveAcpxTimerTimeoutMs(params.pluginConfig.timeoutSeconds),
      });
      return runtime;
    });
    return await runtimePromise;
  }
  return {
    ...createLazyAcpRuntimeProxy(resolveRuntime),
    async probeAvailability() {
      await (await resolveRuntime()).probeAvailability();
    },
    isHealthy() {
      return runtime?.isHealthy() ?? false;
    },
  };
}
function warnOnIgnoredLegacyCompatibilityConfig(params) {
  const ignoredFields = [];
  if (params.pluginConfig.legacyCompatibilityConfig.queueOwnerTtlSeconds != null)
    ignoredFields.push("queueOwnerTtlSeconds");
  if (params.pluginConfig.legacyCompatibilityConfig.strictWindowsCmdWrapper === false)
    ignoredFields.push("strictWindowsCmdWrapper=false");
  if (ignoredFields.length === 0) return;
  params.logger?.warn(
    `embedded acpx runtime ignores legacy compatibility config: ${ignoredFields.join(", ")}`,
  );
}
function formatDoctorDetail(detail) {
  if (!detail) return null;
  if (typeof detail === "string") return detail.trim() || null;
  if (detail instanceof Error) return formatErrorMessage(detail);
  if (typeof detail === "object")
    try {
      return (
        JSON.stringify(detail) ??
        inspect(detail, {
          breakLength: Infinity,
          depth: 3,
        })
      );
    } catch {
      return inspect(detail, {
        breakLength: Infinity,
        depth: 3,
      });
    }
  if (
    typeof detail === "number" ||
    typeof detail === "boolean" ||
    typeof detail === "bigint" ||
    typeof detail === "symbol"
  )
    return detail.toString();
  return inspect(detail, {
    breakLength: Infinity,
    depth: 3,
  });
}
function formatDoctorFailureMessage(report) {
  const detailText = report.details?.map(formatDoctorDetail).filter(Boolean).join("; ").trim();
  return detailText ? `${report.message} (${detailText})` : report.message;
}
function resolveAllowedAgentsProbeAgent(ctx) {
  for (const agent of ctx.config.acp?.allowedAgents ?? []) {
    const normalized = normalizeLowercaseStringOrEmpty(agent);
    if (normalized) return normalized;
  }
}
async function measureAcpxStartup(ctx, name, run) {
  return ctx.startupTrace ? await ctx.startupTrace.measure(name, run) : await run();
}
function detailAcpxStartup(ctx, name, metrics) {
  ctx.startupTrace?.detail?.(name, metrics);
}
function shouldRunStartupProbe(env = process.env) {
  return env[ENABLE_STARTUP_PROBE_ENV] !== "0";
}
function shouldProbeRuntimeAtStartup(env = process.env) {
  return shouldRunStartupProbe(env) && env[SKIP_RUNTIME_PROBE_ENV] !== "1";
}
async function withStartupProbeTimeout(params) {
  let timeout;
  const timeoutMs = resolveAcpxTimerTimeoutMs(params.timeoutSeconds) ?? 1;
  try {
    return await Promise.race([
      params.promise,
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          reject(
            /* @__PURE__ */ new Error(
              `embedded acpx runtime backend startup probe timed out after ${params.timeoutSeconds}s`,
            ),
          );
        }, timeoutMs);
        timeout.unref?.();
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
function openGatewayInstanceStateStore(openKeyedStore) {
  return openKeyedStore({
    namespace: ACPX_GATEWAY_INSTANCE_NAMESPACE,
    maxEntries: 1,
  });
}
async function resolveGatewayInstanceId(openKeyedStore) {
  const store = openGatewayInstanceStateStore(openKeyedStore);
  const existing = normalizeAcpxGatewayInstanceRecord(
    await store.lookup(ACPX_GATEWAY_INSTANCE_KEY),
  );
  if (existing) return existing.instanceId;
  const next = randomUUID();
  await store.register(ACPX_GATEWAY_INSTANCE_KEY, {
    instanceId: next,
    createdAt: Date.now(),
  });
  return next;
}
async function reapOpenAcpxProcessLeases(params) {
  const leases = await params.leaseStore.listOpen(params.gatewayInstanceId);
  const inspectedPids = [];
  const terminatedPids = [];
  const pendingLeaseRootResults = /* @__PURE__ */ new Map();
  for (const lease of leases) {
    if (lease.rootPid <= 0) {
      await params.leaseStore.markState(lease.leaseId, "closing");
      let result = pendingLeaseRootResults.get(lease.wrapperRoot);
      if (!result) {
        result = await reapStaleOpenClawOwnedAcpxOrphans({
          wrapperRoot: lease.wrapperRoot,
          deps: params.deps,
        });
        pendingLeaseRootResults.set(lease.wrapperRoot, result);
        inspectedPids.push(...result.inspectedPids);
        terminatedPids.push(...result.terminatedPids);
      }
      await params.leaseStore.markState(
        lease.leaseId,
        result.terminatedPids.length > 0 ? "closed" : "lost",
      );
      continue;
    }
    await params.leaseStore.markState(lease.leaseId, "closing");
    const result = await cleanupOpenClawOwnedAcpxProcessTree({
      rootPid: lease.rootPid,
      expectedLeaseId: lease.leaseId,
      expectedGatewayInstanceId: lease.gatewayInstanceId,
      wrapperRoot: lease.wrapperRoot,
      deps: params.deps,
    });
    inspectedPids.push(...result.inspectedPids);
    terminatedPids.push(...result.terminatedPids);
    await params.leaseStore.markState(
      lease.leaseId,
      result.terminatedPids.length > 0 ? "closed" : "lost",
    );
  }
  return {
    inspectedPids,
    terminatedPids,
  };
}
/** Create the ACPX plugin service that owns runtime registration and cleanup. */
function createAcpxRuntimeService(params = {}) {
  let runtime = null;
  let lifecycleRevision = 0;
  return {
    id: "acpx-runtime",
    async start(ctx) {
      if (process.env.OPENCLAW_SKIP_ACPX_RUNTIME === "1") {
        ctx.logger.info("skipping embedded acpx runtime backend (OPENCLAW_SKIP_ACPX_RUNTIME=1)");
        return;
      }
      const openKeyedStore = params.openKeyedStore;
      if (!openKeyedStore) throw new Error("ACPX runtime service requires plugin keyed state");
      const basePluginConfig = await measureAcpxStartup(ctx, "config.resolve", () =>
        resolveAcpxPluginConfig({
          rawConfig: params.pluginConfig,
          workspaceDir: ctx.workspaceDir,
        }),
      );
      const effectiveBasePluginConfig = {
        ...basePluginConfig,
        probeAgent: basePluginConfig.probeAgent ?? resolveAllowedAgentsProbeAgent(ctx),
      };
      const pluginConfig = await measureAcpxStartup(ctx, "config.prepare-codex-auth", () =>
        prepareAcpxCodexAuthConfig({
          pluginConfig: effectiveBasePluginConfig,
          stateDir: ctx.stateDir,
          logger: ctx.logger,
        }),
      );
      const wrapperRoot = path.join(ctx.stateDir, "acpx");
      await measureAcpxStartup(ctx, "filesystem.prepare", async () => {
        await fs$1.mkdir(pluginConfig.stateDir, { recursive: true });
        await fs$1.mkdir(wrapperRoot, { recursive: true });
      });
      const gatewayInstanceId = await measureAcpxStartup(ctx, "gateway-instance-id", () =>
        resolveGatewayInstanceId(openKeyedStore),
      );
      const processLeaseStore = createAcpxProcessLeaseStore({
        store: openAcpxProcessLeaseStateStore(openKeyedStore),
      });
      const startupReap = await measureAcpxStartup(ctx, "process-leases.reap", () =>
        reapOpenAcpxProcessLeases({
          gatewayInstanceId,
          leaseStore: processLeaseStore,
          deps: params.processCleanupDeps,
        }),
      );
      if (startupReap.terminatedPids.length > 0)
        ctx.logger.info(
          `reaped ${startupReap.terminatedPids.length} stale OpenClaw-owned ACPX process${startupReap.terminatedPids.length === 1 ? "" : "es"}`,
        );
      warnOnIgnoredLegacyCompatibilityConfig({
        pluginConfig,
        logger: ctx.logger,
      });
      const startedRuntime = await measureAcpxStartup(ctx, "runtime.create", () =>
        params.runtimeFactory
          ? params.runtimeFactory({
              pluginConfig,
              gatewayInstanceId,
              processLeaseStore,
              wrapperRoot,
              logger: ctx.logger,
            })
          : createLazyDefaultRuntime({
              pluginConfig,
              gatewayInstanceId,
              processLeaseStore,
              wrapperRoot,
              logger: ctx.logger,
            }),
      );
      runtime = startedRuntime;
      const shouldProbeRuntime = shouldProbeRuntimeAtStartup();
      detailAcpxStartup(ctx, "probe-policy", [
        ["startupProbeEnabledCount", shouldProbeRuntime ? 1 : 0],
        ["probeAgent", pluginConfig.probeAgent ?? "default"],
      ]);
      await measureAcpxStartup(ctx, "backend.register", () => {
        registerAcpRuntimeBackend({
          id: ACPX_BACKEND_ID,
          runtime: startedRuntime,
          ...(shouldProbeRuntime ? { healthy: () => runtime?.isHealthy() ?? false } : {}),
        });
        ctx.logger.info(`embedded acpx runtime backend registered (cwd: ${pluginConfig.cwd})`);
      });
      if (!shouldProbeRuntime) return;
      lifecycleRevision += 1;
      const currentRevision = lifecycleRevision;
      try {
        await measureAcpxStartup(ctx, "probe.availability", () =>
          withStartupProbeTimeout({
            promise: startedRuntime.probeAvailability(),
            timeoutSeconds: pluginConfig.timeoutSeconds ?? 120,
          }),
        );
        if (currentRevision !== lifecycleRevision) return;
        if (startedRuntime.isHealthy()) {
          detailAcpxStartup(ctx, "probe.result", [["healthyCount", 1]]);
          ctx.logger.info("embedded acpx runtime backend ready");
          return;
        }
        const doctorReport = await measureAcpxStartup(ctx, "probe.doctor", () =>
          startedRuntime.doctor?.(),
        );
        if (currentRevision !== lifecycleRevision) return;
        detailAcpxStartup(ctx, "probe.result", [["healthyCount", 0]]);
        ctx.logger.warn(
          `embedded acpx runtime backend probe failed: ${doctorReport ? formatDoctorFailureMessage(doctorReport) : "backend remained unhealthy after probe"}`,
        );
      } catch (err) {
        if (currentRevision !== lifecycleRevision) return;
        detailAcpxStartup(ctx, "probe.result", [["healthyCount", 0]]);
        ctx.logger.warn(`embedded acpx runtime setup failed: ${formatErrorMessage(err)}`);
      }
    },
    async stop(_ctx) {
      lifecycleRevision += 1;
      unregisterAcpRuntimeBackend(ACPX_BACKEND_ID);
      runtime = null;
    },
  };
}
//#endregion
export { createAcpxRuntimeService, resolveAcpxTimerTimeoutMs };
