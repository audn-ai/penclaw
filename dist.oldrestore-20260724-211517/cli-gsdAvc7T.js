import { t as resolveWorkboardCardByIdOrPrefix } from "./card-lookup-BoXKYGHH.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-DpocbsVi.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./runtime-config-snapshot-hRn3WGyJ.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./gateway-runtime-IrTdjV5_.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { f as WORKBOARD_STATUSES } from "./src-CpFrZXrA.js";
//#region extensions/workboard/src/cli.ts
function invalidCliArgument(message) {
  const error = new Error(message);
  error.name = "InvalidArgumentError";
  error.code = "commander.invalidArgument";
  error.exitCode = 1;
  return error;
}
function parsePositiveIntegerOption(value, flag) {
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0) throw invalidCliArgument(`${flag} must be a positive integer.`);
  return parsed;
}
function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function writeLine(value) {
  process.stdout.write(`${value}\n`);
}
function splitLabels(value) {
  return value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
function isWorkboardStatus(value) {
  return WORKBOARD_STATUSES.includes(value);
}
function formatCardLine(card) {
  const boardId = card.metadata?.automation?.boardId ?? "default";
  const agent = card.agentId ? ` ${card.agentId}` : "";
  return `${card.id.slice(0, 8)}  ${card.status.padEnd(8)}  ${card.priority.padEnd(6)}  ${boardId}${agent}  ${card.title}`;
}
function redactClaimToken(card) {
  const claim = card.metadata?.claim;
  if (!claim) return card;
  return {
    ...card,
    metadata: {
      ...card.metadata,
      claim: {
        ...claim,
        token: "[redacted]",
      },
    },
  };
}
function redactDispatchResult(result) {
  return {
    ...result,
    promoted: result.promoted.map(redactClaimToken),
    reclaimed: result.reclaimed.map(redactClaimToken),
    blocked: result.blocked.map(redactClaimToken),
    orchestrated: result.orchestrated.map(redactClaimToken),
  };
}
function writeCards(cards, options) {
  if (options.json) {
    writeJson({ cards: cards.map(redactClaimToken) });
    return;
  }
  for (const card of cards) writeLine(formatCardLine(card));
}
async function callWorkboardGateway(method, options, params) {
  return await callGatewayFromCli(method, options, params, {
    mode: "cli",
    scopes: options.admin
      ? ["operator.admin", "operator.write", "operator.read"]
      : ["operator.write", "operator.read"],
  });
}
function isGatewayUnavailableError(error) {
  const message = formatErrorMessage(error).toLowerCase();
  if (
    [
      "econnrefused",
      "econnreset",
      "ehostunreach",
      "enotfound",
      "gateway not connected",
      "gateway unavailable",
    ].some((marker) => message.includes(marker))
  )
    return true;
  return message.match(/unknown method:\s*([a-z0-9._-]+)/)?.[1] === "workboard.cards.dispatch";
}
function hasExplicitGatewayTarget(options) {
  return Boolean(options.url?.trim() || options.token?.trim());
}
function hasConfiguredRemoteGatewayTarget() {
  if (process.env.OPENCLAW_GATEWAY_URL?.trim()) return true;
  try {
    return getRuntimeConfig().gateway?.mode === "remote";
  } catch {
    return false;
  }
}
function registerWorkboardCli(params) {
  const workboard = params.program
    .command("workboard")
    .description("Manage Workboard cards and worker dispatch");
  workboard
    .command("list")
    .description("List Workboard cards")
    .option("--board <id>", "Board id")
    .option("--status <status>", "Filter by status")
    .option("--include-archived", "Include archived cards (default false)")
    .option("--json", "Print JSON", false)
    .action(async (options) => {
      let cards = await params.store.list({ boardId: options.board });
      if (!options.json && options.includeArchived !== true)
        cards = cards.filter((card) => !card.metadata?.archivedAt);
      if (options.status) cards = cards.filter((card) => card.status === options.status);
      writeCards(cards, options);
    });
  workboard
    .command("create")
    .argument("<title...>", "Card title")
    .description("Create a Workboard card")
    .option("--notes <text>", "Card notes")
    .option("--status <status>", "Initial status", "todo")
    .option("--priority <priority>", "Priority", "normal")
    .option("--agent <id>", "Assigned agent id")
    .option("--board <id>", "Board id")
    .option("--labels <items>", "Comma-separated labels")
    .option("--json", "Print JSON", false)
    .action(async (title, options) => {
      const card = await params.store.create({
        title: title.join(" "),
        notes: options.notes,
        status: options.status,
        priority: options.priority,
        agentId: options.agent,
        boardId: options.board,
        labels: splitLabels(options.labels),
        workspaceAccess: { unrestricted: true },
      });
      if (options.json) writeJson({ card: redactClaimToken(card) });
      else writeLine(formatCardLine(card));
    });
  workboard
    .command("show")
    .argument("<id>", "Card id or prefix")
    .description("Show one Workboard card")
    .option("--json", "Print JSON", false)
    .action(async (id, options) => {
      const { card, error } = resolveWorkboardCardByIdOrPrefix(await params.store.list(), id);
      if (!card) throw new Error(error);
      if (options.json) writeJson({ card: redactClaimToken(card) });
      else {
        writeLine(formatCardLine(card));
        if (card.notes) writeLine(card.notes);
      }
    });
  workboard
    .command("move")
    .argument("<id>", "Card id or prefix")
    .description("Move a Workboard card to another status")
    .requiredOption("--status <status>", "Target status")
    .option("--json", "Print JSON", false)
    .action(async (id, options) => {
      if (!isWorkboardStatus(options.status))
        throw new Error(`--status must be one of: ${WORKBOARD_STATUSES.join(", ")}.`);
      const { card, error } = resolveWorkboardCardByIdOrPrefix(await params.store.list(), id);
      if (!card) throw new Error(error);
      const updated = await params.store.move(card.id, options.status, void 0);
      if (options.json) writeJson({ card: redactClaimToken(updated) });
      else writeLine(formatCardLine(updated));
    });
  addGatewayClientOptions(
    workboard
      .command("dispatch")
      .description("Promote ready cards and start worker runs through the Gateway")
      .option("--board <id>", "Dispatch a single board")
      .option(
        "--max-starts <count>",
        "Maximum new worker runs to start in this pass (default 3)",
        (value) => parsePositiveIntegerOption(value, "--max-starts"),
      )
      .option("--admin", "Request full-host workspace access", false)
      .option("--json", "Print JSON", false),
  ).action(async (options) => {
    try {
      const result = await callWorkboardGateway(
        options.maxStarts === void 0
          ? "workboard.cards.dispatch"
          : "workboard.cards.dispatchWithOptions",
        options,
        {
          boardId: options.board,
          ...(options.maxStarts !== void 0 ? { maxStarts: options.maxStarts } : {}),
        },
      );
      if (options.json) writeJson(result);
      else {
        const record = isRecord(result) ? result : {};
        writeLine(
          `dispatch complete: started=${Array.isArray(record.started) ? record.started.length : 0} failures=${Array.isArray(record.startFailures) ? record.startFailures.length : 0}`,
        );
      }
    } catch (error) {
      if (
        !isGatewayUnavailableError(error) ||
        hasExplicitGatewayTarget(options) ||
        hasConfiguredRemoteGatewayTarget()
      )
        throw error;
      const result = redactDispatchResult(await params.store.dispatch({ boardId: options.board }));
      if (options.json)
        writeJson({
          ...result,
          gatewayUnavailable: true,
        });
      else
        writeLine(
          `gateway unavailable; data dispatch only: promoted=${result.promoted.length} blocked=${result.blocked.length}`,
        );
    }
  });
}
//#endregion
export { registerWorkboardCli };
