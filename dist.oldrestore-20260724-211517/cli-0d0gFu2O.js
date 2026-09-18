import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./number-runtime-B-n-wjMn.js";
import "./text-utility-runtime-CJESZCN5.js";
//#region extensions/onepassword/src/cli.ts
function parseLimit(value) {
  if (value === void 0) return 50;
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0 || parsed > 1e3)
    throw new Error("--limit must be an integer from 1 to 1000");
  return parsed;
}
function truncateReason(reason) {
  return reason.length <= 80 ? reason : `${truncateUtf16Safe(reason, 77)}...`;
}
async function buildStatus(config, opClient) {
  const policies = {
    auto: 0,
    approve: 0,
    deny: 0,
  };
  for (const item of Object.values(config?.items ?? {})) policies[item.policy] += 1;
  return {
    tokenFilePresent: await opClient.tokenFilePresent(),
    opBinaryResolved: Boolean(opClient.opBin),
    opBinaryPath: opClient.opBin ?? null,
    itemCount: Object.keys(config?.items ?? {}).length,
    policyCounts: policies,
  };
}
async function readAuditRows(auditStore, limit) {
  return (await auditStore.entries())
    .toSorted(
      (left, right) =>
        right.value.timestampMs - left.value.timestampMs || right.key.localeCompare(left.key),
    )
    .slice(0, limit)
    .map(({ value }) => ({
      timestamp: new Date(value.timestampMs).toISOString(),
      agent: value.agentId,
      slug: value.slug,
      outcome: value.outcome,
      reason: truncateReason(value.reason),
    }));
}
function registerOnePasswordCommands(context) {
  const write = context.write ?? ((message) => process.stdout.write(`${message}\n`));
  const command = context.program
    .command("onepassword")
    .description("Inspect the 1Password broker");
  command
    .command("status")
    .description("Show broker readiness without secret values")
    .action(async () => {
      write(
        JSON.stringify(
          await buildStatus(context.resolveConfig(), context.resolveOpClient()),
          null,
          2,
        ),
      );
    });
  command
    .command("audit")
    .description("Show recent 1Password access audit rows")
    .option("--limit <number>", "Maximum rows to print", "50")
    .action(async (options) => {
      write(
        JSON.stringify(await readAuditRows(context.auditStore, parseLimit(options.limit)), null, 2),
      );
    });
}
//#endregion
export { registerOnePasswordCommands };
