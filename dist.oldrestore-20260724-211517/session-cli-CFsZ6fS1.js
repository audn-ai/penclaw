import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DpocbsVi.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-chunking-Dr19ggf-.js";
import "./text-utility-runtime-CJESZCN5.js";
import "./gateway-runtime-IrTdjV5_.js";
import { a as CODEX_LOCAL_SESSION_HOST_ID } from "./session-catalog-BSlvF2GM.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/codex/src/session-cli.ts
const CODEX_SESSION_CATALOG_CLI_TIMEOUT_MS = 75e3;
function writeLine(value = "") {
  process.stdout.write(`${value}\n`);
}
function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function gatewayOptions(options) {
  return {
    ...(options.url ? { url: options.url } : {}),
    ...(options.token ? { token: options.token } : {}),
    ...(options.timeout !== void 0 ? { timeout: options.timeout } : {}),
    json: options.json === true,
  };
}
function parsePageLimit(value) {
  if (value === void 0) return;
  const trimmed = value.trim();
  const parsed = Number(trimmed);
  if (!/^\d+$/.test(trimmed) || !Number.isSafeInteger(parsed) || parsed < 1 || parsed > 100)
    throw new Error(`--limit must be an integer between 1 and 100`);
  return parsed;
}
function normalizeTimestampMs(value) {
  return Math.abs(value) < 0xe8d4a51000 ? value * 1e3 : value;
}
function formatTimestamp(session) {
  const value = session.recencyAt ?? session.updatedAt ?? session.createdAt;
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";
  const date = new Date(normalizeTimestampMs(value));
  return Number.isNaN(date.getTime())
    ? "-"
    : `${date.toISOString().replace("T", " ").slice(0, 16)}Z`;
}
function singleLineTerminalText(value) {
  return sanitizeTerminalText(value).replace(/\s+/g, " ").trim();
}
function truncate(value, maxLength) {
  return value.length <= maxLength ? value : `${truncateUtf16Safe(value, maxLength - 1)}\u2026`;
}
function sessionTitle(session) {
  return truncate(
    (typeof session.name === "string" ? singleLineTerminalText(session.name) : "") ||
      singleLineTerminalText(session.threadId) ||
      "(untitled)",
    72,
  );
}
function sessionStatus(session) {
  return session.status === "notLoaded"
    ? "stored / activity unknown"
    : singleLineTerminalText(session.status) || "unknown";
}
function quoteShellArgument(value) {
  return `'${singleLineTerminalText(value).replaceAll("'", `'"'"'`)}'`;
}
function formatHostIdentity(host) {
  const identifiers = [host.kind, singleLineTerminalText(host.hostId)];
  if (host.nodeId && host.nodeId !== host.hostId)
    identifiers.push(singleLineTerminalText(host.nodeId));
  return identifiers.join(" · ");
}
function writeHost(host) {
  const connection = host.connected ? "connected" : "offline";
  const count = `${host.sessions.length} session${host.sessions.length === 1 ? "" : "s"}`;
  writeLine(
    `${singleLineTerminalText(host.label)} (${formatHostIdentity(host)}) — ${connection} — ${count}`,
  );
  if (host.error)
    writeLine(
      `  Error [${singleLineTerminalText(host.error.code)}]: ${singleLineTerminalText(host.error.message)}`,
    );
  if (host.sessions.length === 0 && !host.error) writeLine("  No sessions.");
  for (const session of host.sessions) {
    writeLine(
      `  ${formatTimestamp(session)}  ${sessionStatus(session)}  ${singleLineTerminalText(session.threadId)}  ${sessionTitle(session)}`,
    );
    const details = [
      session.cwd ? singleLineTerminalText(session.cwd) : void 0,
      session.gitBranch ? `branch ${singleLineTerminalText(session.gitBranch)}` : void 0,
      session.source ? `source ${singleLineTerminalText(session.source)}` : void 0,
      session.modelProvider ? `provider ${singleLineTerminalText(session.modelProvider)}` : void 0,
    ].filter((entry) => Boolean(entry));
    if (details.length > 0) writeLine(`    ${details.join(" · ")}`);
  }
  if (host.nextCursor)
    writeLine(
      `  More sessions: repeat the same filters with --host ${quoteShellArgument(host.hostId)} --cursor ${quoteShellArgument(host.nextCursor)}`,
    );
}
function filterHosts(result, selector) {
  return selector
    ? {
        ...result,
        hosts: result.hosts.filter((host) => host.hostId === selector),
      }
    : result;
}
async function listCodexSessions(options) {
  const host = options.host?.trim() || void 0;
  const cursor = options.cursor?.trim() || void 0;
  if (cursor && !host)
    throw new Error("--cursor requires --host so the cursor is routed to one Codex host");
  const search = options.search?.trim() || void 0;
  const limitPerHost = parsePageLimit(options.limit);
  const params = {
    ...(search ? { search } : {}),
    ...(limitPerHost !== void 0 ? { limitPerHost } : {}),
    ...(host ? { hostIds: [host] } : {}),
    ...(cursor && host ? { cursors: { [host]: cursor } } : {}),
  };
  const raw = await callGatewayFromCli(
    "sessions.catalog.list",
    gatewayOptions(options),
    {
      catalogId: "codex",
      ...params,
    },
    {
      mode: "cli",
      scopes: ["operator.write"],
    },
  );
  if (!isRecord(raw) || !Array.isArray(raw.catalogs))
    throw new Error("Codex session catalog returned an invalid result");
  const catalog = raw.catalogs.find(
    (candidate) =>
      isRecord(candidate) && candidate.id === "codex" && Array.isArray(candidate.hosts),
  );
  if (!isRecord(catalog)) throw new Error("Codex session catalog is unavailable on this Gateway");
  const result = filterHosts({ hosts: catalog.hosts }, host);
  if (options.json) {
    writeJson(result);
    return;
  }
  if (result.hosts.length === 0) {
    writeLine(
      host
        ? `No Codex session host matched "${singleLineTerminalText(host)}".`
        : "No Codex session hosts found.",
    );
    return;
  }
  result.hosts.forEach((catalogHost, index) => {
    if (index > 0) writeLine();
    writeHost(catalogHost);
  });
}
function readThreadId(value) {
  const threadId = value.trim();
  if (!threadId) throw new Error("Codex thread id must not be empty");
  return threadId;
}
async function continueCodexSession(threadIdValue, options) {
  const threadId = readThreadId(threadIdValue);
  const raw = await callGatewayFromCli(
    "sessions.catalog.continue",
    gatewayOptions(options),
    {
      catalogId: "codex",
      hostId: CODEX_LOCAL_SESSION_HOST_ID,
      threadId,
    },
    {
      mode: "cli",
      scopes: ["operator.write"],
    },
  );
  if (!isRecord(raw) || typeof raw.sessionKey !== "string" || !raw.sessionKey.trim())
    throw new Error("Codex session continue returned an invalid session key");
  const result = { sessionKey: raw.sessionKey };
  if (options.json) {
    writeJson(result);
    return;
  }
  writeLine(`OpenClaw session: ${singleLineTerminalText(result.sessionKey)}`);
}
async function archiveCodexSession(threadIdValue, options) {
  const threadId = readThreadId(threadIdValue);
  if (options.confirmNoOtherRunner !== true)
    throw new Error(
      "--confirm-no-other-runner is required because Codex client and runner activity is process-local",
    );
  const raw = await callGatewayFromCli(
    "sessions.catalog.archive",
    gatewayOptions(options),
    {
      catalogId: "codex",
      hostId: CODEX_LOCAL_SESSION_HOST_ID,
      threadId,
      confirmNoOtherRunner: true,
    },
    {
      mode: "cli",
      scopes: ["operator.write"],
    },
  );
  if (!isRecord(raw) || raw.ok !== true)
    throw new Error("Codex session archive returned an invalid result");
  const result = { ok: true };
  if (options.json) {
    writeJson(result);
    return;
  }
  writeLine(`Archived Codex thread ${singleLineTerminalText(threadId)}.`);
}
/** Registers the plugin-owned Codex session supervision CLI. */
function registerCodexSessionCli(program) {
  const codex = program
    .command("codex")
    .description("Inspect and branch from Codex sessions through the Gateway");
  addGatewayClientOptions(
    codex
      .command("sessions")
      .description("List non-archived Codex app-server sessions across connected hosts")
      .option("--search <text>", "Search session titles (case-insensitive)")
      .option("--host <id>", "Filter by stable host id")
      .option("--limit <count>", "Maximum sessions returned per host")
      .option("--cursor <cursor>", "Continue one host page (requires --host)")
      .option("--json", "Print the structured catalog response", false),
    { timeoutMs: CODEX_SESSION_CATALOG_CLI_TIMEOUT_MS },
  ).action(async (options) => {
    await listCodexSessions(options);
  });
  addGatewayClientOptions(
    codex
      .command("continue <thread-id>")
      .description("Continue a Gateway-local Codex thread as an OpenClaw branch")
      .option("--json", "Print the structured response", false),
  ).action(async (threadId, options) => {
    await continueCodexSession(threadId, options);
  });
  addGatewayClientOptions(
    codex
      .command("archive <thread-id>")
      .description("Archive a stored or idle Gateway-local Codex thread")
      .option(
        "--confirm-no-other-runner",
        "Confirm no other Codex client or OpenClaw runner is using this thread",
        false,
      )
      .option("--json", "Print the structured response", false),
  ).action(async (threadId, options) => {
    await archiveCodexSession(threadId, options);
  });
}
//#endregion
export { registerCodexSessionCli };
