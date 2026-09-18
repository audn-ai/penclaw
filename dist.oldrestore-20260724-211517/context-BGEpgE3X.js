import path from "node:path";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { N as timestampMsToIsoFileStamp } from "./number-coercion-CJQ8TR--.js";
import "./config-BDv-QbJ6.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
//#region src/commands/migrate/context.ts
/** Migration provider context and report-directory helpers. */
/** Builds a migration logger that keeps JSON stdout machine-readable. */
function createMigrationLogger(runtime, opts = {}) {
  const info = opts.json ? runtime.error : runtime.log;
  return {
    debug: (message) => {
      if (process.env.OPENCLAW_VERBOSE === "1") info(message);
    },
    info: (message) => info(message),
    warn: (message) => runtime.error(message),
    error: (message) => runtime.error(message),
  };
}
/** Builds the timestamped directory where a provider writes migration reports. */
function buildMigrationReportDir(providerId, stateDir, nowMs = Date.now()) {
  const stamp = timestampMsToIsoFileStamp(nowMs);
  return path.join(stateDir, "migration", providerId, stamp);
}
/** Builds the provider-facing migration context from CLI options and runtime state. */
function buildMigrationContext(params) {
  return {
    config: params.configOverride ?? getRuntimeConfig(),
    stateDir: resolveStateDir(),
    targetAgentId: params.targetAgentId,
    itemKinds: params.itemKinds,
    source: params.source,
    includeSecrets: Boolean(params.includeSecrets),
    overwrite: Boolean(params.overwrite),
    providerOptions: params.providerOptions,
    backupPath: params.backupPath,
    reportDir: params.reportDir,
    logger: createMigrationLogger(params.runtime, { json: params.json }),
  };
}
//#endregion
export { buildMigrationReportDir as n, createMigrationLogger as r, buildMigrationContext as t };
