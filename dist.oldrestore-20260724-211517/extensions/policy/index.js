import { promises } from "node:fs";
import { basename, isAbsolute, resolve } from "node:path";
import { setTimeout } from "node:timers/promises";
import JSON5 from "json5";
import "../../string-coerce-runtime-BUe4iD0r.js";
import { n as normalizeAgentId } from "../../agent-id-DDgUze4y.js";
import "../../routing-CwvmVRHd.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "../../agent-scope-config-DVIR1nBa.js";
import "../../health-CD6trVzN.js";
import {
  i as parseHealthFindingSeverity,
  r as healthFindingMeetsSeverity,
  t as exitCodeFromFindings,
} from "../../doctor-lint-flow-CnFBP9JE.js";
import { u as readConfigFileSnapshot } from "../../io-B3ne6NxF.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import { o as isRecord } from "../../record-coerce-DHZ4bFlT.js";
import {
  a as POLICY_RULE_METADATA$1,
  c as POLICY_CHECK_IDS,
  i as isPolicyValueAtLeastAsStrict,
  n as evaluatePolicy,
  o as createPolicyAttestation,
  r as policyContainerShapeFindings,
  s as POLICY_FIX_METADATA_BY_CHECK_ID,
  t as registerPolicyDoctorChecks,
} from "../../register-Db1qvHSN.js";
//#region extensions/policy/src/policy-conformance.ts
const POLICY_CONFORMANCE_CHECK_IDS = {
  missing: "policy/policy-conformance-missing",
  weaker: "policy/policy-conformance-weaker",
  invalid: "policy/policy-conformance-invalid",
};
const POLICY_RULE_METADATA = POLICY_RULE_METADATA$1;
async function buildPolicyConformanceReport(params) {
  const baselinePath = resolvePolicyPath(params.baselinePath, params.cwd);
  const policyPath = resolvePolicyPath(params.policyPath, params.cwd);
  const baselineResult = await readPolicyDocument(baselinePath);
  const policyResult = await readPolicyDocument(policyPath);
  if (!baselineResult.ok || !policyResult.ok) {
    const invalidFindings = [baselineResult, policyResult]
      .filter((result) => {
        return !result.ok;
      })
      .map((result) => invalidParseConformanceFinding(result));
    return {
      ok: false,
      baselinePath: baselineResult.displayName,
      policyPath: policyResult.displayName,
      rulesChecked: 0,
      findings: invalidFindings,
    };
  }
  const baseline = baselineResult.document;
  const policy = policyResult.document;
  const baselineClaims = collectPolicyRuleClaims(baseline);
  const candidateClaims = collectPolicyRuleClaims(policy);
  const invalidFindings = uniqueConformanceFindings([
    ...policyContainerShapeFindings(baseline.value, baseline.displayName, baseline.displayName).map(
      (finding) => invalidShapeConformanceFinding(finding, baseline.displayName),
    ),
    ...policyContainerShapeFindings(policy.value, policy.displayName, policy.displayName).map(
      (finding) => invalidShapeConformanceFinding(finding, policy.displayName),
    ),
    ...collectInvalidScopedPolicyFindings(baseline),
    ...collectInvalidScopedPolicyFindings(policy),
    ...baselineClaims
      .filter((claim) => !policyRuleValueIsValid(claim.metadata, claim.value))
      .map((claim) => invalidConformanceFinding(claim, baseline.displayName)),
    ...candidateClaims
      .filter((claim) => !policyRuleValueIsValid(claim.metadata, claim.value))
      .map((claim) => invalidConformanceFinding(claim, policy.displayName)),
  ]);
  const validBaselineClaims = baselineClaims.filter((claim) =>
    policyRuleValueIsValid(claim.metadata, claim.value),
  );
  const validCandidateClaims = candidateClaims.filter((claim) =>
    policyRuleValueIsValid(claim.metadata, claim.value),
  );
  if (invalidFindings.length > 0)
    return {
      ok: false,
      baselinePath: baseline.displayName,
      policyPath: policy.displayName,
      rulesChecked: 0,
      findings: invalidFindings,
    };
  const findings = validBaselineClaims
    .map((claim) => conformanceFinding(claim, validCandidateClaims, policy.displayName))
    .filter((finding) => finding !== void 0);
  return {
    ok: invalidFindings.length === 0 && findings.length === 0,
    baselinePath: baseline.displayName,
    policyPath: policy.displayName,
    rulesChecked: validBaselineClaims.length,
    findings: [...invalidFindings, ...findings],
  };
}
function uniqueConformanceFindings(findings) {
  const seen = /* @__PURE__ */ new Set();
  return findings.filter((finding) => {
    const key = `${finding.checkId}\n${finding.target}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function invalidParseConformanceFinding(result) {
  return {
    checkId: POLICY_CONFORMANCE_CHECK_IDS.invalid,
    severity: "error",
    message: result.message,
    source: "policy",
    path: result.displayName,
    target: result.target,
    requirement: result.target,
    fixHint: `Fix ${result.displayName} so it contains valid policy JSONC.`,
  };
}
function invalidShapeConformanceFinding(finding, displayName) {
  const target = finding.target ?? `oc://${displayName}`;
  return {
    checkId: POLICY_CONFORMANCE_CHECK_IDS.invalid,
    severity: "error",
    message: finding.message,
    source: "policy",
    path: displayName,
    target,
    requirement: target,
    fixHint: finding.fixHint ?? `Fix ${displayName} so it uses the documented policy syntax.`,
  };
}
function collectInvalidScopedPolicyFindings(document) {
  if (!isRecord(document.value) || document.value.scopes === void 0) return [];
  if (!isRecord(document.value.scopes))
    return [
      invalidConformancePathFinding({
        displayName: document.displayName,
        message: `${document.displayName} scopes must be an object.`,
        propertyPath: "scopes",
        target: `oc://${document.displayName}/scopes`,
      }),
    ];
  const findings = [];
  for (const [scopeName, overlay] of Object.entries(document.value.scopes)) {
    const scopePath = `scopes.${scopeName}`;
    const scopeTarget = `oc://${document.displayName}/scopes/${ocPathSegment(scopeName)}`;
    if (!isRecord(overlay)) {
      findings.push(
        invalidConformancePathFinding({
          displayName: document.displayName,
          message: `${document.displayName} ${scopePath} must be an object.`,
          propertyPath: scopePath,
          target: scopeTarget,
        }),
      );
      continue;
    }
    for (const metadata of POLICY_RULE_METADATA) {
      if (scopedPolicyValue(overlay, metadata.policyPath) === void 0) continue;
      if (
        (metadata.scopeSelectors ?? []).some(
          (selector) => normalizeSelectorValues(overlay[selector], selector).length > 0,
        )
      )
        continue;
      const propertyPath = `${scopePath}.${metadata.policyPath.join(".")}`;
      findings.push(
        invalidConformancePathFinding({
          displayName: document.displayName,
          message: `${document.displayName} ${propertyPath} needs a valid selector for policy conformance.`,
          propertyPath,
          target: `${scopeTarget}/${metadata.policyPath.map(ocPathSegment).join("/")}`,
        }),
      );
    }
  }
  return findings;
}
function invalidConformanceFinding(claim, displayName) {
  return invalidConformancePathFinding({
    displayName,
    message: `${displayName} ${claim.propertyPath} is not valid policy conformance syntax.`,
    propertyPath: claim.propertyPath,
    target: claim.target,
  });
}
function invalidConformancePathFinding(params) {
  return {
    checkId: POLICY_CONFORMANCE_CHECK_IDS.invalid,
    severity: "error",
    message: params.message,
    source: "policy",
    path: params.displayName,
    target: params.target,
    requirement: params.target,
    fixHint: `Fix ${params.propertyPath} so it uses the documented policy syntax.`,
  };
}
function conformanceFinding(baseline, candidateClaims, policyDisplayName) {
  if (baselineRuleIsNoOp(baseline.metadata, baseline.value)) return;
  if (baseline.selector === void 0) {
    const globalCandidates = candidateClaims.filter((candidate) => candidate.key === baseline.key);
    if (globalCandidates.length === 0)
      return missingConformanceFinding(baseline, policyDisplayName);
    const weakerGlobal = globalCandidates.find(
      (candidate) =>
        !isPolicyValueAtLeastAsStrict(baseline.metadata, candidate.value, baseline.value),
    );
    if (weakerGlobal !== void 0)
      return weakerConformanceFinding(baseline, policyDisplayName, weakerGlobal);
    const weakerScopedOverride = candidateClaims.find(
      (candidate) =>
        candidate.selector !== void 0 &&
        candidate.metadata.policyPath.join(".") === baseline.metadata.policyPath.join(".") &&
        !isPolicyValueAtLeastAsStrict(baseline.metadata, candidate.value, baseline.value),
    );
    if (weakerScopedOverride !== void 0)
      return weakerConformanceFinding(baseline, policyDisplayName, weakerScopedOverride);
    return;
  }
  const exactCandidates = candidateClaims.filter((candidate) => candidate.key === baseline.key);
  const candidates =
    exactCandidates.length > 0
      ? exactCandidates
      : candidateClaims.filter((candidate) => globallySatisfiesScopedClaim(candidate, baseline));
  const weakerCandidate = candidates.find(
    (candidate) =>
      !isPolicyValueAtLeastAsStrict(baseline.metadata, candidate.value, baseline.value),
  );
  if (
    candidates.some((candidate) =>
      isPolicyValueAtLeastAsStrict(baseline.metadata, candidate.value, baseline.value),
    ) &&
    (exactCandidates.length === 0 || weakerCandidate === void 0)
  )
    return;
  if (candidates.length === 0) return missingConformanceFinding(baseline, policyDisplayName);
  return weakerConformanceFinding(baseline, policyDisplayName, weakerCandidate ?? candidates[0]);
}
function baselineRuleIsNoOp(metadata, baseline) {
  switch (metadata.strictness) {
    case "allowlist-subset":
      return metadata.emptyList === "disabled" && policyRuleListIsEmpty(baseline, metadata);
    case "denylist-superset":
      return policyRuleListIsEmpty(baseline, metadata);
    case "requires-true":
      return baseline !== true;
    case "requires-false":
      return baseline !== false;
    case "exact-list":
    case "ordered-string":
      return false;
  }
  return false;
}
function policyRuleValueIsValid(metadata, value) {
  switch (metadata.valueType) {
    case "boolean":
      return typeof value === "boolean";
    case "channel-provider-deny-rules":
      return (
        Array.isArray(value) &&
        value.every((entry) => {
          if (!isRecord(entry)) return false;
          const when = entry.when;
          return isRecord(when) && typeof when.provider === "string" && when.provider.trim() !== "";
        })
      );
    case "string":
      return typeof value === "string" && policyStringIsAllowed(metadata, value);
    case "string-list":
      if (!Array.isArray(value)) return false;
      if (isExecApprovalAllowlistExpectedRule(metadata))
        return value.every(isExecApprovalAllowlistRequirement);
      return value.every(
        (entry) =>
          typeof entry === "string" &&
          entry.trim() !== "" &&
          policyStringIsAllowed(metadata, entry),
      );
  }
  return false;
}
function isExecApprovalAllowlistExpectedRule(metadata) {
  return metadata.policyPath.join(".") === "execApprovals.agents.allowlist.expected";
}
function unsupportedPolicyKey(value, supported) {
  return Object.keys(value).find((key) => !supported.includes(key));
}
function isExecApprovalAllowlistRequirement(value) {
  if (typeof value === "string") return value.trim() !== "";
  if (!isRecord(value)) return false;
  if (unsupportedPolicyKey(value, ["argPattern", "pattern"]) !== void 0) return false;
  if (typeof value.pattern !== "string" || value.pattern.trim() === "") return false;
  return value.argPattern === void 0 || typeof value.argPattern === "string";
}
function policyStringIsAllowed(metadata, value) {
  const normalized = metadata.caseSensitive === true ? value.trim() : value.trim().toLowerCase();
  if (normalized === "") return false;
  if (metadata.allowedValues !== void 0)
    return metadata.allowedValues
      .map((entry) => (metadata.caseSensitive === true ? entry : entry.toLowerCase()))
      .includes(normalized);
  if (metadata.orderedValues === void 0) return true;
  return metadata.orderedValues
    .map((entry) => (metadata.caseSensitive === true ? entry : entry.toLowerCase()))
    .includes(normalized);
}
function policyRuleListIsEmpty(value, metadata) {
  if (!Array.isArray(value)) return false;
  if (metadata.valueType === "channel-provider-deny-rules") return value.length === 0;
  return value.length === 0;
}
function missingConformanceFinding(baseline, policyDisplayName) {
  return {
    checkId: POLICY_CONFORMANCE_CHECK_IDS.missing,
    severity: "error",
    message: `${policyDisplayName} is missing ${baseline.propertyPath}.`,
    source: "policy",
    path: policyDisplayName,
    target: `oc://${policyDisplayName}/${baseline.propertyPath.replaceAll(".", "/")}`,
    requirement: baseline.target,
    fixHint: `Add an equally or more restrictive ${baseline.propertyPath} rule, or update the baseline policy after review.`,
  };
}
function weakerConformanceFinding(baseline, policyDisplayName, candidate) {
  return {
    checkId: POLICY_CONFORMANCE_CHECK_IDS.weaker,
    severity: "error",
    message: `${policyDisplayName} ${baseline.propertyPath} is weaker than the baseline policy.`,
    source: "policy",
    path: policyDisplayName,
    target: candidate?.target ?? `oc://${policyDisplayName}`,
    requirement: baseline.target,
    fixHint: `Use an equally or more restrictive ${baseline.propertyPath} value, or update the baseline policy after review.`,
  };
}
function globallySatisfiesScopedClaim(candidate, baseline) {
  return (
    baseline.selector !== void 0 &&
    candidate.selector === void 0 &&
    candidate.metadata.policyPath.join(".") === baseline.metadata.policyPath.join(".")
  );
}
function collectPolicyRuleClaims(document) {
  return [...collectTopLevelPolicyRuleClaims(document), ...collectScopedPolicyRuleClaims(document)];
}
function collectTopLevelPolicyRuleClaims(document) {
  const claims = [];
  for (const metadata of POLICY_RULE_METADATA) {
    const value = getPolicyPath(document.value, metadata.policyPath);
    if (value === void 0) continue;
    const propertyPath = metadata.policyPath.join(".");
    claims.push({
      key: `global:${propertyPath}`,
      metadata,
      value,
      target: `oc://${document.displayName}/${metadata.policyPath.map(ocPathSegment).join("/")}`,
      propertyPath,
    });
  }
  return claims;
}
function collectScopedPolicyRuleClaims(document) {
  if (!isRecord(document.value) || !isRecord(document.value.scopes)) return [];
  const claims = [];
  for (const [scopeName, overlay] of Object.entries(document.value.scopes)) {
    if (!isRecord(overlay)) continue;
    for (const selector of ["agentIds", "channelIds"]) {
      const selectorValues = normalizeSelectorValues(overlay[selector], selector);
      if (selectorValues.length === 0) continue;
      const rules = POLICY_RULE_METADATA.filter(
        (metadata) => metadata.scopeSelectors?.includes(selector) === true,
      );
      for (const metadata of rules) {
        const value = scopedPolicyValue(overlay, metadata.policyPath);
        if (value === void 0) continue;
        const propertyPath = metadata.policyPath.join(".");
        const targetPath = [
          "scopes",
          ocPathSegment(scopeName),
          ...metadata.policyPath.map(ocPathSegment),
        ].join("/");
        for (const selectorValue of selectorValues)
          claims.push({
            key: `${selector}:${selectorValue}:${propertyPath}`,
            metadata,
            value,
            target: `oc://${document.displayName}/${targetPath}`,
            propertyPath: `scopes.${scopeName}.${propertyPath}`,
            selector: {
              kind: selector,
              value: selectorValue,
            },
          });
      }
    }
  }
  return coalesceScopedPolicyRuleClaims(claims);
}
function coalesceScopedPolicyRuleClaims(claims) {
  const byKey = /* @__PURE__ */ new Map();
  for (const claim of claims) {
    const previous = byKey.get(claim.key);
    if (
      previous !== void 0 &&
      isPolicyValueAtLeastAsStrict(previous.metadata, claim.value, previous.value)
    ) {
      byKey.set(claim.key, claim);
      continue;
    }
    byKey.set(claim.key, previous ?? claim);
  }
  return [...byKey.values()];
}
function normalizeSelectorValues(value, selector) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => typeof entry === "string" && entry.trim() !== "")
    .map((entry) =>
      selector === "agentIds" ? normalizeAgentId(entry) : entry.trim().toLowerCase(),
    );
}
function scopedPolicyValue(overlay, path) {
  const [root, ...remainingPath] = path;
  if (!root) return;
  return getPolicyPath(root === "agents" ? overlay.agents : overlay[root], remainingPath);
}
function getPolicyPath(value, path) {
  let current = value;
  for (const part of path) {
    if (!isRecord(current)) return;
    current = current[part];
  }
  return current;
}
async function readPolicyDocument(path) {
  const displayName = basename(path);
  let raw;
  try {
    raw = await promises.readFile(path, "utf-8");
  } catch (err) {
    return {
      ok: false,
      displayName,
      message: `${displayName} could not be read: ${err instanceof Error ? err.message : String(err)}`,
      target: `oc://${displayName}`,
    };
  }
  try {
    return {
      ok: true,
      displayName,
      document: {
        displayName,
        value: JSON5.parse(raw),
      },
    };
  } catch (err) {
    return {
      ok: false,
      displayName,
      message: `${displayName} could not be parsed: ${err instanceof Error ? err.message : String(err)}`,
      target: `oc://${displayName}`,
    };
  }
}
function resolvePolicyPath(path, cwd) {
  return isAbsolute(path) ? path : resolve(cwd ?? process.cwd(), path);
}
function ocPathSegment(value) {
  if (/^(?:[A-Za-z0-9_-]+|#\d+)$/.test(value)) return value;
  return JSON.stringify(value);
}
//#endregion
//#region extensions/policy/src/cli.ts
const defaultRuntime = {
  writeStdout(value) {
    process.stdout.write(value);
  },
  error(value) {
    process.stderr.write(`${value}\n`);
  },
  sleep(ms) {
    return setTimeout(ms);
  },
};
function registerPolicyCli(program) {
  const policy = program.command("policy").description("Verify workspace policy conformance");
  policy
    .command("compare")
    .description("Compare policy.jsonc against an authored baseline policy file")
    .requiredOption("--baseline <path>", "Baseline policy file to compare against")
    .option("--policy <path>", "Policy file to check; defaults to configured policy path")
    .option("--json", "Emit JSON output")
    .action(async (options) => {
      process.exitCode = await policyCompareCommand(options);
    });
  policy
    .command("check")
    .description("Check policy requirements and emit an audit attestation")
    .option("--json", "Emit JSON output")
    .option("--severity-min <severity>", "Minimum severity: info, warning, or error")
    .action(async (options) => {
      process.exitCode = await policyCheckCommand(options);
    });
  policy
    .command("watch")
    .description("Watch policy evidence and report accepted-attestation drift")
    .option("--json", "Emit JSON output")
    .option("--severity-min <severity>", "Minimum severity: info, warning, or error")
    .option("--interval-ms <ms>", "Polling interval in milliseconds")
    .option("--once", "Run one watch evaluation and exit")
    .action(async (options) => {
      process.exitCode = await policyWatchCommand(options);
    });
}
async function policyCompareCommand(options, runtime = defaultRuntime) {
  try {
    if (options.baseline === void 0 || options.baseline.trim() === "")
      throw new Error("Missing required --baseline value.");
    const policyPath = await policyCompareCandidatePath(options);
    const report = await buildPolicyConformanceReport({
      baselinePath: options.baseline,
      policyPath,
      cwd: options.cwd,
    });
    writePolicyConformanceReport(report, options, runtime);
    return report.ok ? 0 : 1;
  } catch (err) {
    runtime.error(err instanceof Error ? err.message : String(err));
    return 2;
  }
}
async function policyCheckCommand(options, runtime = defaultRuntime) {
  try {
    const report = await buildPolicyCheckReport(options, runtime);
    writePolicyCheckReport(report, options, runtime);
    return report.exitCode;
  } catch (err) {
    runtime.error(err instanceof Error ? err.message : String(err));
    return 2;
  }
}
async function policyWatchCommand(options, runtime = defaultRuntime) {
  try {
    const intervalMs = normalizeWatchIntervalMs(options.intervalMs);
    let previousKey;
    for (;;) {
      const report = await buildPolicyCheckReport(options, runtime);
      const status = policyWatchStatus(report);
      const key = `${status}:${report.attestation?.attestationHash ?? ""}:${report.exitCode}`;
      if (previousKey === void 0 || previousKey !== key || options.once === true) {
        writePolicyWatchReport(report, status, options, runtime);
        previousKey = key;
      }
      if (options.once === true) return status === "stale" ? 1 : report.exitCode;
      if (runtime.sleep !== void 0) await runtime.sleep(intervalMs);
      else await setTimeout(intervalMs);
    }
  } catch (err) {
    runtime.error(err instanceof Error ? err.message : String(err));
    return 2;
  }
}
async function buildPolicyCheckReport(options, runtime) {
  const severityMin =
    options.severityMin === void 0 ? "info" : parseHealthFindingSeverity(options.severityMin);
  if (severityMin === null)
    throw new Error("Invalid --severity-min value. Expected one of: info, warning, error.");
  const snapshot = await readConfigFileSnapshot({ observe: false });
  if (!snapshot.valid) {
    const visibleFindings = snapshot.issues
      .map((issue) => ({
        checkId: "policy/config-invalid",
        severity: "error",
        message: issue.message,
        source: "policy",
        path: issue.path,
      }))
      .filter((finding) => healthFindingMeetsSeverity(finding, severityMin));
    return {
      ok: visibleFindings.length === 0,
      evidence: { channels: [] },
      checksRun: 1,
      checksSkipped: POLICY_CHECK_IDS.length,
      findings: visibleFindings.map(toJsonFinding),
      exitCode: visibleFindings.length === 0 ? 0 : 1,
    };
  }
  const cfg = snapshot.valid ? policyCommandConfig(snapshot.config) : {};
  const evaluation = await evaluatePolicy({
    mode: "lint",
    runtime: {
      log(value) {
        runtime.writeStdout(`${String(value)}\n`);
      },
      error(value) {
        runtime.error(String(value));
      },
      exit(code) {
        process.exitCode = code;
      },
    },
    cfg,
    cwd: options.cwd ?? resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg)),
    ...(snapshot.path !== void 0 ? { configPath: snapshot.path } : {}),
  });
  const jsonFindings = evaluation.findings
    .filter((finding) => healthFindingMeetsSeverity(finding, severityMin))
    .map(toJsonFinding);
  const attestedFindings = evaluation.attestedFindings.map(toAttestedJsonFinding);
  return {
    ok: exitCodeFromFindings(evaluation.findings, severityMin) === 0,
    attestation: createPolicyAttestation({
      ok: evaluation.attestedFindings.length === 0,
      checkedAt: /* @__PURE__ */ new Date().toISOString(),
      policyPath: evaluation.policyPath,
      policyHash: evaluation.policy?.hash,
      evidence: evaluation.evidence,
      findings: attestedFindings,
    }),
    evidence: evaluation.evidence,
    checksRun: POLICY_CHECK_IDS.length,
    checksSkipped: 0,
    findings: jsonFindings,
    expectedAttestationHash: evaluation.expectedAttestationHash,
    exitCode: exitCodeFromFindings(evaluation.findings, severityMin),
  };
}
function policyCommandConfig(cfg) {
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      entries: {
        ...cfg.plugins?.entries,
        policy: {
          ...cfg.plugins?.entries?.["policy"],
          enabled: true,
          config: {
            enabled: true,
            ...(typeof cfg.plugins?.entries?.["policy"]?.config === "object" &&
            cfg.plugins.entries["policy"].config !== null
              ? cfg.plugins.entries["policy"].config
              : {}),
          },
        },
      },
    },
  };
}
async function policyCompareCandidatePath(options) {
  if (options.policy !== void 0 && options.policy.trim() !== "") return options.policy.trim();
  const snapshot = await readConfigFileSnapshot({ observe: false });
  if (!snapshot.valid) return "policy.jsonc";
  const pluginConfig = snapshot.config.plugins?.entries?.["policy"]?.config;
  const configured =
    typeof pluginConfig === "object" && pluginConfig !== null && "path" in pluginConfig
      ? pluginConfig.path
      : void 0;
  const policyPath =
    typeof configured === "string" && configured.trim() !== "" ? configured.trim() : "policy.jsonc";
  if (isAbsolute(policyPath)) return policyPath;
  return resolve(
    options.cwd ??
      resolveAgentWorkspaceDir(snapshot.config, resolveDefaultAgentId(snapshot.config)),
    policyPath,
  );
}
function writePolicyCheckReport(report, options, runtime) {
  if (options.json === true || !process.stdout.isTTY)
    runtime.writeStdout(
      JSON.stringify({
        ok: report.ok,
        attestation: report.attestation,
        evidence: report.evidence,
        checksRun: report.checksRun,
        checksSkipped: report.checksSkipped,
        findings: report.findings,
      }) + "\n",
    );
  else if (report.findings.length === 0) {
    const policyHash = report.attestation?.policy?.hash ?? "missing";
    const evidenceHash = report.attestation?.workspace.hash ?? "unavailable";
    runtime.writeStdout(
      `policy check: no findings (policy ${policyHash}, evidence ${evidenceHash})\n`,
    );
  } else {
    runtime.writeStdout(`policy check: ${report.findings.length} finding(s)\n`);
    for (const finding of report.findings) {
      const where = typeof finding.path === "string" ? ` ${finding.path}` : "";
      const line = typeof finding.line === "number" ? `:${finding.line}` : "";
      const severity = typeof finding.severity === "string" ? finding.severity : "unknown";
      const checkId = typeof finding.checkId === "string" ? finding.checkId : "unknown";
      const message = typeof finding.message === "string" ? finding.message : "";
      runtime.writeStdout(`  [${severity}] ${checkId}${where}${line} - ${message}\n`);
    }
  }
}
function writePolicyConformanceReport(report, options, runtime) {
  if (options.json === true || !process.stdout.isTTY) {
    runtime.writeStdout(JSON.stringify(report) + "\n");
    return;
  }
  if (report.findings.length === 0) {
    runtime.writeStdout(
      `policy compare: no findings (${report.policyPath} is at least as strict as ${report.baselinePath}; ${report.rulesChecked} rule(s) checked)\n`,
    );
    return;
  }
  runtime.writeStdout(
    `policy compare: ${report.findings.length} finding(s) (${report.rulesChecked} rule(s) checked)\n`,
  );
  for (const finding of report.findings)
    runtime.writeStdout(`  [${finding.severity}] ${finding.checkId} - ${finding.message}\n`);
}
function writePolicyWatchReport(report, status, options, runtime) {
  if (options.json === true || !process.stdout.isTTY) {
    runtime.writeStdout(
      JSON.stringify({
        status,
        ok: report.ok,
        expectedAttestationHash: report.expectedAttestationHash,
        attestation: report.attestation,
        findings: report.findings,
      }) + "\n",
    );
    return;
  }
  if (status === "stale") {
    runtime.writeStdout(
      `policy watch: accepted attestation is stale (current ${report.attestation?.attestationHash}, expected ${report.expectedAttestationHash}). Review policy check output, then update the supervisor/gateway accepted attestation.\n`,
    );
    return;
  }
  if (status === "findings") {
    runtime.writeStdout(
      `policy watch: ${report.findings.length} finding(s); accepted attestation cannot be updated until policy check is clean.\n`,
    );
    return;
  }
  runtime.writeStdout(
    `policy watch: clean (attestation ${report.attestation?.attestationHash}, evidence ${report.attestation?.workspace.hash})\n`,
  );
}
function policyWatchStatus(report) {
  if (
    !report.ok &&
    report.findings.some((finding) => finding.checkId !== "policy/attestation-hash-mismatch")
  )
    return "findings";
  const expected = report.expectedAttestationHash?.trim();
  if (expected && report.attestation !== void 0 && report.attestation.attestationHash !== expected)
    return "stale";
  return report.ok ? "clean" : "findings";
}
function normalizeWatchIntervalMs(value) {
  if (value === void 0) return 2e3;
  const raw =
    typeof value === "number" ? value : /^\+?\d+$/.test(value.trim()) ? Number(value.trim()) : NaN;
  if (!Number.isSafeInteger(raw) || raw < 250)
    throw new Error("--interval-ms must be an integer >= 250.");
  return raw;
}
function toAttestedJsonFinding(finding) {
  return {
    checkId: finding.checkId,
    severity: finding.severity,
    message: finding.message,
    ...(finding.source !== void 0 ? { source: finding.source } : {}),
    ...(finding.path !== void 0 ? { path: finding.path } : {}),
    ...(finding.line !== void 0 ? { line: finding.line } : {}),
    ...(finding.ocPath !== void 0 ? { ocPath: finding.ocPath } : {}),
    ...(finding.target !== void 0 ? { target: finding.target } : {}),
    ...(finding.requirement !== void 0 ? { requirement: finding.requirement } : {}),
    ...(finding.fixHint !== void 0 ? { fixHint: finding.fixHint } : {}),
  };
}
function toJsonFinding(finding) {
  return {
    ...toAttestedJsonFinding(finding),
    ...policyFindingMetadata(finding),
  };
}
function policyFindingMetadata(finding) {
  const metadata = POLICY_FIX_METADATA_BY_CHECK_ID.get(finding.checkId);
  if (metadata === void 0) return {};
  return {
    policy: {
      fixRecommendation: {
        fixClass: metadata.fixClass,
        ...(metadata.policyPath !== void 0 ? { policyPath: metadata.policyPath } : {}),
        ...(metadata.configTargets !== void 0 ? { configTargets: metadata.configTargets } : {}),
        summary: metadata.summary,
      },
    },
  };
}
//#endregion
//#region extensions/policy/index.ts
var policy_default = definePluginEntry({
  id: "policy",
  name: "Policy",
  description: "Adds policy-backed doctor checks for workspace conformance.",
  register(api) {
    api.registerCli(
      async ({ program }) => {
        registerPolicyCli(program);
      },
      {
        descriptors: [
          {
            name: "policy",
            description: "Check policy requirements and emit audit evidence",
            hasSubcommands: true,
          },
        ],
      },
    );
    registerPolicyDoctorChecks();
  },
});
//#endregion
export { policy_default as default };
