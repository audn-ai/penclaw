import {
  i as resolveAutoLiveToolResultMaxChars,
  n as calculateMaxToolResultCharsWithCap,
} from "./tool-result-truncation-B3T_nFx6.js";
//#region src/flows/doctor-tool-result-cap-advice.ts
const TOOL_RESULT_CAP_CHECK_ID = "core/doctor/tool-result-cap";
function formatNumber(value) {
  return String(Math.max(0, Math.floor(value))).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatIssueMessage(issue) {
  const prefix = issue.scopeLabel ? `${issue.scopeLabel}: ` : "";
  if (issue.kind === "configured-above-runtime-ceiling")
    return `${prefix}configured toolResultMaxChars is ${formatNumber(issue.configuredCap)} chars, but this model can use at most ${formatNumber(issue.runtimeCeiling ?? 0)} chars per live tool result; lower it or unset it.`;
  return `${prefix}configured toolResultMaxChars is ${formatNumber(issue.configuredCap)} chars; unset it to use the ${formatNumber(issue.autoEffectiveCap ?? 0)} char auto cap for "${issue.modelKey}".`;
}
function collectToolResultCapDoctorIssues(params) {
  if (!Number.isFinite(params.contextWindowTokens) || params.contextWindowTokens <= 0) return [];
  const configuredCap =
    typeof params.configuredCap === "number" && Number.isFinite(params.configuredCap)
      ? Math.floor(params.configuredCap)
      : void 0;
  if (configuredCap === void 0) return [];
  const autoCap = resolveAutoLiveToolResultMaxChars(params.contextWindowTokens);
  const runtimeCeiling = calculateMaxToolResultCharsWithCap(
    params.contextWindowTokens,
    Number.MAX_SAFE_INTEGER,
  );
  const effectiveCap = calculateMaxToolResultCharsWithCap(
    params.contextWindowTokens,
    configuredCap,
  );
  const autoEffectiveCap = calculateMaxToolResultCharsWithCap(params.contextWindowTokens, autoCap);
  if (configuredCap > runtimeCeiling)
    return [
      {
        kind: "configured-above-runtime-ceiling",
        contextWindowTokens: params.contextWindowTokens,
        modelKey: params.modelKey,
        configuredCap,
        runtimeCeiling,
        path: params.path,
        scopeLabel: params.scopeLabel,
        target: params.target,
      },
    ];
  if (effectiveCap < autoEffectiveCap)
    return [
      {
        kind: "configured-below-auto-cap",
        contextWindowTokens: params.contextWindowTokens,
        modelKey: params.modelKey,
        configuredCap,
        autoEffectiveCap,
        path: params.path,
        scopeLabel: params.scopeLabel,
        target: params.target,
      },
    ];
  return [];
}
function toolResultCapDoctorIssueToHealthFinding(issue) {
  return {
    checkId: TOOL_RESULT_CAP_CHECK_ID,
    severity: "warning",
    message: formatIssueMessage(issue),
    ...(issue.path ? { path: issue.path } : {}),
    ...(issue.target ? { target: issue.target } : {}),
    requirement: issue.kind,
    fixHint: issue.path ? `Lower or unset ${issue.path}.` : "Lower or unset toolResultMaxChars.",
  };
}
/** Builds human-readable doctor lines for stale or ineffective toolResultMaxChars settings. */
function buildToolResultCapDoctorAdvice(params) {
  if (!Number.isFinite(params.contextWindowTokens) || params.contextWindowTokens <= 0) return [];
  const autoCap = resolveAutoLiveToolResultMaxChars(params.contextWindowTokens);
  const configuredCap =
    typeof params.configuredCap === "number" && Number.isFinite(params.configuredCap)
      ? Math.floor(params.configuredCap)
      : void 0;
  const configuredSource = configuredCap !== void 0;
  const requestedCap = configuredCap ?? autoCap;
  const effectiveCap = calculateMaxToolResultCharsWithCap(params.contextWindowTokens, requestedCap);
  const lines = [];
  const prefix = params.scopeLabel ? `${params.scopeLabel}: ` : "";
  if (params.deep)
    lines.push(
      `- ${prefix}primary model "${params.modelKey}" context window ${formatNumber(params.contextWindowTokens)} tokens; live tool-result cap ${formatNumber(effectiveCap)} chars (${configuredSource ? "explicit" : "auto"})`,
    );
  if (configuredCap === void 0) return lines;
  lines.push(
    ...collectToolResultCapDoctorIssues(params).map((issue) => `- ${formatIssueMessage(issue)}`),
  );
  return lines;
}
//#endregion
export {
  buildToolResultCapDoctorAdvice,
  collectToolResultCapDoctorIssues,
  toolResultCapDoctorIssueToHealthFinding,
};
