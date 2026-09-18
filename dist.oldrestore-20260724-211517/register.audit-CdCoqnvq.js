import { c as callGateway } from "./call-BVMO6az_.js";
import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import {
  P as timestampMsToIsoString,
  b as parseStrictPositiveInteger,
} from "./number-coercion-CJQ8TR--.js";
import { t as parseAbsoluteTimeMs } from "./parse-CbtxGw67.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/commands/audit.ts
/** Operator CLI for bounded metadata-only activity audit pages. */
const DEFAULT_AUDIT_LIMIT = 100;
const MAX_AUDIT_LIMIT = 500;
function parseAuditTimestamp(value, flag) {
  const trimmed = value?.trim();
  if (!trimmed) return;
  if (/^\d+$/.test(trimmed)) {
    const parsed = Number(trimmed);
    if (Number.isSafeInteger(parsed)) return parsed;
  }
  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed) && parseAbsoluteTimeMs(trimmed) !== null) return parsed;
  throw new Error(`${flag} must be an ISO timestamp or Unix milliseconds.`);
}
function parseAuditLimit(value) {
  if (!value) return DEFAULT_AUDIT_LIMIT;
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0 || parsed > MAX_AUDIT_LIMIT)
    throw new Error(`--limit must be between 1 and ${MAX_AUDIT_LIMIT}.`);
  return parsed;
}
function short(value, maxChars) {
  if (!value) return "-";
  const sanitized = sanitizeTerminalText(value);
  if (!sanitized) return "-";
  return sanitized.length <= maxChars
    ? sanitized
    : `${truncateUtf16Safe(sanitized, maxChars - 1)}…`;
}
function formatAuditRows(events) {
  const rows = ["TIME	KIND	DIRECTION	CHANNEL	STATUS	AGENT	RUN	ACTION"];
  for (const event of events)
    rows.push(
      [
        timestampMsToIsoString(event.occurredAt) ?? String(event.occurredAt),
        event.kind,
        short(event.direction, 10),
        short(event.channel, 18),
        event.status,
        short(event.agentId, 18),
        short(event.runId, 18),
        event.toolName ? `${event.action}:${short(event.toolName, 28)}` : event.action,
      ].join("	"),
    );
  return rows;
}
function isUnsupportedActivityMethodError(value) {
  return (
    value instanceof Error &&
    value.name === "GatewayClientRequestError" &&
    value.gatewayCode === "INVALID_REQUEST" &&
    (value.message === "unknown method: audit.activity.list" ||
      value.message === "missing scope: operator.admin")
  );
}
function hasMessageSpecificFilters(options) {
  return options.kind === "message" || options.direction !== void 0 || options.channel !== void 0;
}
function validateAuditKind(kind) {
  if (kind !== void 0 && kind !== "agent_run" && kind !== "tool_action" && kind !== "message")
    throw new Error("--kind must be agent_run, tool_action, or message.");
}
function toLegacyAuditListParams(params) {
  return {
    ...(params.agentId ? { agentId: params.agentId } : {}),
    ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
    ...(params.runId ? { runId: params.runId } : {}),
    ...(params.kind === "agent_run" || params.kind === "tool_action" ? { kind: params.kind } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.after !== void 0 ? { after: params.after } : {}),
    ...(params.before !== void 0 ? { before: params.before } : {}),
    ...(params.limit !== void 0 ? { limit: params.limit } : {}),
    ...(params.cursor ? { cursor: params.cursor } : {}),
  };
}
async function queryAuditActivity(params, options) {
  try {
    return await callGateway({
      method: "audit.activity.list",
      params,
    });
  } catch (error) {
    if (!isUnsupportedActivityMethodError(error)) throw error;
    if (hasMessageSpecificFilters(options))
      throw new Error(
        "The connected Gateway does not support message audit filters. Upgrade the Gateway to use --kind message, --direction, or --channel.",
        { cause: error },
      );
    return await callGateway({
      method: "audit.list",
      params: toLegacyAuditListParams(params),
    });
  }
}
/** Query one stable page. JSON output is a bounded export with its next cursor. */
async function auditListCommand(options, runtime) {
  validateAuditKind(options.kind);
  const after = parseAuditTimestamp(options.after, "--after");
  const before = parseAuditTimestamp(options.before, "--before");
  if (after !== void 0 && before !== void 0 && after > before)
    throw new Error("--after must not be later than --before.");
  const result = await queryAuditActivity(
    {
      limit: parseAuditLimit(options.limit),
      ...(options.agentId ? { agentId: options.agentId } : {}),
      ...(options.sessionKey ? { sessionKey: options.sessionKey } : {}),
      ...(options.runId ? { runId: options.runId } : {}),
      ...(options.kind ? { kind: options.kind } : {}),
      ...(options.status ? { status: options.status } : {}),
      ...(options.direction ? { direction: options.direction } : {}),
      ...(options.channel ? { channel: options.channel } : {}),
      ...(after !== void 0 ? { after } : {}),
      ...(before !== void 0 ? { before } : {}),
      ...(options.cursor ? { cursor: options.cursor } : {}),
    },
    options,
  );
  if (options.json) {
    writeRuntimeJson(runtime, result);
    return;
  }
  for (const row of formatAuditRows(result.events)) runtime.log(row);
  if (result.nextCursor) runtime.log(`More records: --cursor ${result.nextCursor}`);
}
//#endregion
//#region src/cli/program/register.audit.ts
/** Register the bounded operator audit query command. */
function registerAuditCommand(program) {
  program
    .command("audit")
    .description("Inspect metadata-only run, tool, and message lifecycle records")
    .option("--agent <id>", "Filter by agent id")
    .option("--session <key>", "Filter by exact session key")
    .option("--run <id>", "Filter by run id")
    .option("--kind <kind>", "Filter by kind (agent_run, tool_action, or message)")
    .option(
      "--status <status>",
      "Filter by status (started, succeeded, failed, cancelled, timed_out, blocked, unknown)",
    )
    .option("--direction <direction>", "Filter message direction (inbound or outbound)")
    .option("--channel <channel>", "Filter message channel")
    .option("--after <timestamp>", "Include records at/after ISO time or Unix milliseconds")
    .option("--before <timestamp>", "Include records at/before ISO time or Unix milliseconds")
    .option("--cursor <sequence>", "Continue from a previous result cursor")
    .option("--limit <count>", "Maximum records (1-500)", "100")
    .option("--json", "Output a bounded JSON page", false)
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/audit", "docs.openclaw.ai/cli/audit")}\n`,
    )
    .action(async (opts) => {
      await runCommandWithRuntime(defaultRuntime, async () => {
        await auditListCommand(
          {
            agentId: opts.agent,
            sessionKey: opts.session,
            runId: opts.run,
            kind: opts.kind,
            status: opts.status,
            direction: opts.direction,
            channel: opts.channel,
            after: opts.after,
            before: opts.before,
            cursor: opts.cursor,
            limit: opts.limit,
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });
}
//#endregion
export { registerAuditCommand };
