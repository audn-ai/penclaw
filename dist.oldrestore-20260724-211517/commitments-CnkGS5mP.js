import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as info } from "./globals-CNUzHTcU.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { P as timestampMsToIsoString } from "./number-coercion-CJQ8TR--.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import {
  c as resolveCommitmentStorePath,
  s as markCommitmentsStatus,
  t as listCommitments,
} from "./store-DbIBO_Fr.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
import "./config-BDv-QbJ6.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/commands/commitments.ts
const STATUS_VALUES = /* @__PURE__ */ new Set([
  "pending",
  "sent",
  "dismissed",
  "snoozed",
  "expired",
]);
function truncate(value, maxChars) {
  return value.length <= maxChars ? value : `${truncateUtf16Safe(value, maxChars - 1)}…`;
}
function safe(value) {
  return sanitizeTerminalText(value);
}
function parseStatus(raw, runtime) {
  const status = normalizeOptionalString(raw);
  if (!status) return;
  if (STATUS_VALUES.has(status)) return status;
  runtime.error(
    `Unknown commitment status: ${status}. Use one of: ${Array.from(STATUS_VALUES).join(", ")}.`,
  );
  runtime.exit(1);
}
function isActiveCommitment(commitment) {
  return commitment.status === "pending" || commitment.status === "snoozed";
}
function formatDue(ms) {
  return timestampMsToIsoString(ms) ?? "n/a";
}
function formatRows(commitments, rich) {
  const header = [
    "ID".padEnd(16),
    "Status".padEnd(10),
    "Kind".padEnd(16),
    "Due".padEnd(24),
    "Scope".padEnd(28),
    "Suggested text",
  ].join(" ");
  const lines = [rich ? theme.heading(header) : header];
  for (const commitment of commitments) {
    const scope = truncate(
      [
        safe(commitment.agentId),
        safe(commitment.channel),
        safe(commitment.to ?? commitment.sessionKey),
      ]
        .filter(Boolean)
        .join("/"),
      28,
    );
    lines.push(
      [
        truncate(safe(commitment.id), 16).padEnd(16),
        safe(commitment.status).padEnd(10),
        safe(commitment.kind).padEnd(16),
        formatDue(commitment.dueWindow.earliestMs).padEnd(24),
        scope.padEnd(28),
        truncate(safe(commitment.suggestedText), 90),
      ].join(" "),
    );
  }
  return lines;
}
/** List commitments with status/agent filters in text or JSON form. */
async function commitmentsListCommand(opts, runtime) {
  const cfg = getRuntimeConfig();
  const status = opts.all ? void 0 : parseStatus(opts.status ?? "pending", runtime);
  if (!opts.all && opts.status && !status) return;
  const commitments = (
    await listCommitments({
      cfg,
      status,
      agentId: normalizeOptionalString(opts.agent),
    })
  ).filter((commitment) => opts.all || status || isActiveCommitment(commitment));
  if (opts.json) {
    writeRuntimeJson(runtime, {
      count: commitments.length,
      status: status ?? (opts.all ? null : "pending"),
      agentId: normalizeOptionalString(opts.agent) ?? null,
      store: resolveCommitmentStorePath(),
      commitments,
    });
    return;
  }
  runtime.log(info(`Commitments: ${commitments.length}`));
  runtime.log(info(`Store: ${resolveCommitmentStorePath()}`));
  if (status) runtime.log(info(`Status filter: ${status}`));
  if (opts.agent) runtime.log(info(`Agent filter: ${opts.agent}`));
  if (commitments.length === 0) {
    runtime.log(
      `No commitments found. Run ${formatCliCommand("openclaw commitments --all")} to include dismissed and expired commitments.`,
    );
    return;
  }
  for (const line of formatRows(commitments, isRich())) runtime.log(line);
}
/** Mark one or more commitments as dismissed. */
async function commitmentsDismissCommand(opts, runtime) {
  const ids = normalizeStringEntries(opts.ids);
  if (ids.length === 0) {
    runtime.error(
      `At least one commitment id is required. Run ${formatCliCommand("openclaw commitments list")} to choose one.`,
    );
    runtime.exit(1);
    return;
  }
  await markCommitmentsStatus({
    cfg: getRuntimeConfig(),
    ids,
    status: "dismissed",
    nowMs: Date.now(),
  });
  if (opts.json) {
    writeRuntimeJson(runtime, { dismissed: ids });
    return;
  }
  runtime.log(info(`Dismissed commitments: ${ids.join(", ")}`));
}
//#endregion
export { commitmentsDismissCommand, commitmentsListCommand };
