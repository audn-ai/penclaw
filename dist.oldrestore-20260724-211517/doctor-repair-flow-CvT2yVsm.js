import { t as scrubDoctorErrorMessage } from "./doctor-error-message-DaJAxzRf.js";
import { t as normalizeHealthCheck } from "./health-check-adapter-N54q7s7x.js";
import { a as listHealthChecks } from "./health-check-registry-CBs_fO63.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/flows/doctor-repair-flow.ts
/** Runs health checks in fix mode, applies repair outputs, and validates repaired scopes. */
async function runDoctorHealthRepairs(ctx, opts = {}) {
  const checks = (opts.checks ?? listHealthChecks()).map(normalizeHealthCheck);
  const findings = [];
  const remainingFindings = [];
  const changes = [];
  const warnings = [];
  const diffs = [];
  const effects = [];
  let cfg = ctx.cfg;
  let checksRepaired = 0;
  let checksValidated = 0;
  for (const check of checks) {
    const runResult = await runHealthCheck(
      check,
      {
        ...ctx,
        cfg,
      },
      opts,
    );
    cfg = runResult.config;
    findings.push(...runResult.findings);
    remainingFindings.push(...runResult.remainingFindings);
    changes.push(...runResult.changes);
    warnings.push(...runResult.warnings);
    diffs.push(...runResult.diffs);
    effects.push(...runResult.effects);
    checksRepaired += runResult.checksRepaired;
    checksValidated += runResult.checksValidated;
  }
  return {
    config: cfg,
    findings,
    remainingFindings,
    changes,
    warnings,
    diffs,
    effects,
    checksRun: checks.length,
    checksRepaired,
    checksValidated,
  };
}
async function runHealthCheck(check, ctx, opts) {
  if (check.sourceContract === "split") return runSplitHealthCheck(check, ctx, opts);
  return runRunnableHealthCheck(check, ctx, opts);
}
async function runSplitHealthCheck(check, ctx, opts) {
  const findings = [];
  const remainingFindings = [];
  const changes = [];
  const warnings = [];
  const diffs = [];
  const effects = [];
  let cfg = ctx.cfg;
  let checksRepaired = 0;
  let checksValidated = 0;
  let checkFindings;
  try {
    checkFindings = await check.detect(ctx);
  } catch (err) {
    warnings.push(`${check.id} detect failed: ${scrubDoctorErrorMessage(err)}`);
    return repairRunResult(cfg, findings, remainingFindings, changes, warnings, diffs, effects);
  }
  findings.push(...checkFindings);
  if (checkFindings.length === 0 || check.repair === void 0)
    return repairRunResult(cfg, findings, remainingFindings, changes, warnings, diffs, effects);
  try {
    const result = await check.repair(
      {
        ...ctx,
        dryRun: opts.dryRun === true,
        diff: opts.diff === true,
      },
      checkFindings,
    );
    warnings.push(...(result.warnings ?? []));
    diffs.push(...(result.diffs ?? []));
    effects.push(...(result.effects ?? []));
    changes.push(...result.changes);
    const status = result.status ?? "repaired";
    if (status !== "repaired") {
      warnings.push(`${check.id} repair ${status}${result.reason ? `: ${result.reason}` : ""}`);
      return repairRunResult(cfg, findings, remainingFindings, changes, warnings, diffs, effects);
    }
    if (result.config !== void 0 && opts.dryRun !== true) cfg = result.config;
    checksRepaired++;
    if (opts.dryRun === true)
      return repairRunResult(cfg, findings, remainingFindings, changes, warnings, diffs, effects, {
        checksRepaired,
        checksValidated,
      });
    try {
      const validationFindings = await check.detect(
        {
          ...ctx,
          cfg,
        },
        createValidationScope(findings),
      );
      remainingFindings.push(...validationFindings);
      checksValidated++;
      if (validationFindings.length > 0)
        warnings.push(`${check.id} repair left ${validationFindings.length} finding(s)`);
    } catch (err) {
      warnings.push(`${check.id} validation failed: ${scrubDoctorErrorMessage(err)}`);
    }
  } catch (err) {
    warnings.push(`${check.id} repair failed: ${scrubDoctorErrorMessage(err)}`);
  }
  return repairRunResult(cfg, findings, remainingFindings, changes, warnings, diffs, effects, {
    checksRepaired,
    checksValidated,
  });
}
async function runRunnableHealthCheck(check, ctx, opts) {
  const findings = [];
  const remainingFindings = [];
  const changes = [];
  const warnings = [];
  const diffs = [];
  const effects = [];
  let cfg = ctx.cfg;
  let checksRepaired = 0;
  let checksValidated = 0;
  let result;
  try {
    result = await check.run({
      ...ctx,
      repair: opts.dryRun !== true,
      diff: opts.diff === true,
      previewRepair: opts.dryRun === true,
    });
  } catch (err) {
    warnings.push(`${check.id} run failed: ${scrubDoctorErrorMessage(err)}`);
    return repairRunResult(ctx.cfg, findings, remainingFindings, changes, warnings, diffs, effects);
  }
  findings.push(...(result.findings ?? []));
  warnings.push(...(result.warnings ?? []));
  diffs.push(...(result.diffs ?? []));
  effects.push(...(result.effects ?? []));
  const status = result.status ?? "repaired";
  const hasRepairOutput = hasHealthRepairOutput(result);
  if (status === "repairable") {
    changes.push(...(result.changes ?? []));
    return repairRunResult(cfg, findings, remainingFindings, changes, warnings, diffs, effects, {
      checksRepaired: hasRepairOutput ? 1 : 0,
      checksValidated,
    });
  }
  if (status !== "repaired") {
    warnings.push(`${check.id} repair ${status}${result.reason ? `: ${result.reason}` : ""}`);
    return repairRunResult(ctx.cfg, findings, remainingFindings, changes, warnings, diffs, effects);
  }
  if (result.config !== void 0 && opts.dryRun !== true) cfg = result.config;
  changes.push(...(result.changes ?? []));
  if (hasRepairOutput) checksRepaired++;
  if (opts.dryRun === true || !hasRepairOutput)
    return repairRunResult(cfg, findings, remainingFindings, changes, warnings, diffs, effects, {
      checksRepaired,
      checksValidated,
    });
  try {
    const validation = await check.run(
      {
        ...ctx,
        mode: "lint",
        cfg,
        repair: false,
        diff: opts.diff === true,
        previewRepair: false,
      },
      createValidationScope(findings),
    );
    remainingFindings.push(...(validation.findings ?? []));
    checksValidated++;
    if (validation.findings !== void 0 && validation.findings.length > 0)
      warnings.push(`${check.id} repair left ${validation.findings.length} finding(s)`);
  } catch (err) {
    warnings.push(`${check.id} validation failed: ${scrubDoctorErrorMessage(err)}`);
  }
  return repairRunResult(cfg, findings, remainingFindings, changes, warnings, diffs, effects, {
    checksRepaired,
    checksValidated,
  });
}
function hasHealthRepairOutput(result) {
  return (
    result.config !== void 0 ||
    (result.changes?.length ?? 0) > 0 ||
    (result.diffs?.length ?? 0) > 0 ||
    (result.effects?.length ?? 0) > 0
  );
}
function repairRunResult(
  config,
  findings,
  remainingFindings,
  changes,
  warnings,
  diffs,
  effects,
  counts = {},
) {
  return {
    config,
    findings,
    remainingFindings,
    changes,
    warnings,
    diffs,
    effects,
    checksRun: 1,
    checksRepaired: counts.checksRepaired ?? 0,
    checksValidated: counts.checksValidated ?? 0,
  };
}
function createValidationScope(findings) {
  return {
    findings,
    paths: uniqueDefined(findings.map((finding) => finding.path)),
    ocPaths: uniqueDefined(findings.map((finding) => finding.ocPath)),
  };
}
function uniqueDefined(values) {
  return uniqueStrings(values.filter((value) => value !== void 0));
}
//#endregion
export { runDoctorHealthRepairs };
