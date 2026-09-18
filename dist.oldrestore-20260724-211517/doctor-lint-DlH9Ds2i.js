import "./agent-scope-y9xQv_q1.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as registerBundledHealthChecks } from "./bundled-health-checks-CpqM4DW_.js";
import "./config-BDv-QbJ6.js";
import { i as configValidationIssuesToHealthFindings } from "./doctor-core-checks-BlTF-b_S.js";
import { n as resolveDoctorContributionHealthChecks } from "./doctor-health-contributions-Bi_GdPuM.js";
import {
  i as parseHealthFindingSeverity,
  n as runDoctorLintChecks,
  r as healthFindingMeetsSeverity,
  t as exitCodeFromFindings,
} from "./doctor-lint-flow-CnFBP9JE.js";
import { i as listExtensionHealthChecksForDoctor } from "./health-check-registry-CBs_fO63.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
//#region src/commands/doctor-lint.ts
/** CLI entrypoint for non-mutating doctor lint health checks. */
function detectMode(opts) {
  if (opts.json === true) return "json";
  return process.stdout.isTTY ? "human" : "json";
}
/**
 * Runs registered doctor health checks in human or JSON mode and returns the lint exit code.
 *
 * Invalid config is reported before regular health checks because most checks need a parsed config
 * and workspace root.
 */
async function runDoctorLintCli(runtime, opts) {
  const sevMin =
    opts.severityMin === void 0 ? "warning" : parseHealthFindingSeverity(opts.severityMin);
  if (sevMin === null)
    throw new Error("Invalid --severity-min value. Expected one of: info, warning, error.");
  const snapshot = await readConfigFileSnapshot({ observe: false });
  if (snapshot.exists && !snapshot.valid) {
    const findings = configValidationIssuesToHealthFindings(snapshot.issues);
    const visible = findings.filter((finding) => healthFindingMeetsSeverity(finding, sevMin));
    if (detectMode(opts) === "json")
      writeJsonResult({
        ok: false,
        checksRun: 1,
        checksSkipped: 0,
        findings: visible,
      });
    else {
      runtime.error("doctor --lint: config file exists but does not parse cleanly.");
      for (const issue of snapshot.issues) {
        const path = issue.path || "<root>";
        runtime.error(`- ${path}: ${issue.message}`);
      }
    }
    return exitCodeFromFindings(findings, sevMin);
  }
  const ctx = {
    mode: "lint",
    runtime,
    cfg: snapshot.config,
    cwd: resolveAgentWorkspaceDir(snapshot.config, resolveDefaultAgentId(snapshot.config)),
    allowExecSecretRefs: opts.allowExec === true,
    ...(snapshot.path !== void 0 ? { configPath: snapshot.path } : {}),
  };
  registerBundledHealthChecks({
    cfg: snapshot.config,
    cwd: ctx.cwd,
  });
  const coreChecks = await resolveDoctorContributionHealthChecks();
  const extensionChecks = listExtensionHealthChecksForDoctor(coreChecks);
  const coreCtx = {
    ...ctx,
    deep: opts.deep === true,
  };
  const result = await runDoctorLintChecks(ctx, {
    checks: [...coreChecks.map((check) => withCoreLintContext(check, coreCtx)), ...extensionChecks],
    includeAllChecks: opts.includeAllChecks === true,
    ...(opts.skipIds && opts.skipIds.length > 0 ? { skipIds: opts.skipIds } : {}),
    ...(opts.onlyIds && opts.onlyIds.length > 0 ? { onlyIds: opts.onlyIds } : {}),
  });
  const visible = result.findings.filter((finding) => healthFindingMeetsSeverity(finding, sevMin));
  if (detectMode(opts) === "json")
    writeJsonResult({
      ok: exitCodeFromFindings(result.findings, sevMin) === 0,
      checksRun: result.checksRun,
      checksSkipped: result.checksSkipped,
      findings: visible,
    });
  else {
    process.stdout.write(
      `doctor --lint: ran ${result.checksRun} check(s), ${visible.length} finding(s)\n`,
    );
    if (visible.length === 0) process.stdout.write("  no findings\n");
    else
      for (const f of visible) {
        const where = f.path !== void 0 ? ` ${f.path}` : "";
        const line = f.line !== void 0 ? `:${f.line}` : "";
        process.stdout.write(`  [${f.severity}] ${f.checkId}${where}${line} - ${f.message}\n`);
        if (f.fixHint !== void 0) process.stdout.write(`    fix: ${f.fixHint}\n`);
      }
  }
  return exitCodeFromFindings(result.findings, sevMin);
}
function withCoreLintContext(check, ctx) {
  return {
    ...check,
    detect(_ctx, scope) {
      return check.detect(ctx, scope);
    },
  };
}
function writeJsonResult(result) {
  process.stdout.write(
    JSON.stringify({
      ok: result.ok,
      checksRun: result.checksRun,
      checksSkipped: result.checksSkipped,
      findings: result.findings.map(toJsonFinding),
    }) + "\n",
  );
}
function toJsonFinding(f) {
  return {
    checkId: f.checkId,
    severity: f.severity,
    message: f.message,
    ...(f.source !== void 0 ? { source: f.source } : {}),
    ...(f.path !== void 0 ? { path: f.path } : {}),
    ...(f.line !== void 0 ? { line: f.line } : {}),
    ...(f.column !== void 0 ? { column: f.column } : {}),
    ...(f.ocPath !== void 0 ? { ocPath: f.ocPath } : {}),
    ...(f.target !== void 0 ? { target: f.target } : {}),
    ...(f.requirement !== void 0 ? { requirement: f.requirement } : {}),
    ...(f.fixHint !== void 0 ? { fixHint: f.fixHint } : {}),
  };
}
//#endregion
export { runDoctorLintCli };
