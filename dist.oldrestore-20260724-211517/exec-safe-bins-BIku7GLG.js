import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { s as resolveCommandResolutionFromArgv } from "./exec-command-resolution-CApTmCLK.js";
import {
  n as normalizeConfiguredTrustedSafeBinDirs,
  t as normalizeConfiguredSafeBins,
} from "./exec-safe-bin-config-CTuAV5mD.js";
import {
  i as resolveMergedSafeBinProfileFixtures,
  n as listInterpreterLikeSafeBins,
} from "./exec-safe-bin-runtime-policy-N0nkVI45.js";
import {
  n as isTrustedSafeBinPath,
  o as listRiskyConfiguredSafeBins,
  s as normalizeSafeBinName,
  t as getTrustedSafeBinDirs,
} from "./exec-safe-bin-trust-BJ49w6Hv.js";
import { t as asObjectRecord } from "./object-BsiS9JXh.js";
//#region src/commands/doctor/shared/exec-safe-bins.ts
function collectExecSafeBinScopes(cfg) {
  const scopes = [];
  const globalExec = asObjectRecord(cfg.tools?.exec);
  const globalTrustedDirs = normalizeConfiguredTrustedSafeBinDirs(globalExec?.safeBinTrustedDirs);
  if (globalExec) {
    const safeBins = normalizeConfiguredSafeBins(globalExec.safeBins);
    if (safeBins.length > 0)
      scopes.push({
        scopePath: "tools.exec",
        safeBins,
        exec: globalExec,
        mergedProfiles: resolveMergedSafeBinProfileFixtures({ global: globalExec }) ?? {},
        trustedSafeBinDirs: getTrustedSafeBinDirs({ extraDirs: globalTrustedDirs }),
      });
  }
  const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  for (const agent of agents) {
    if (!agent || typeof agent !== "object" || typeof agent.id !== "string") continue;
    const agentExec = asObjectRecord(agent.tools?.exec);
    if (!agentExec) continue;
    const safeBins = normalizeConfiguredSafeBins(agentExec.safeBins);
    if (safeBins.length === 0) continue;
    scopes.push({
      scopePath: `agents.list.${agent.id}.tools.exec`,
      safeBins,
      exec: agentExec,
      mergedProfiles:
        resolveMergedSafeBinProfileFixtures({
          global: globalExec,
          local: agentExec,
        }) ?? {},
      trustedSafeBinDirs: getTrustedSafeBinDirs({
        extraDirs: [
          ...globalTrustedDirs,
          ...normalizeConfiguredTrustedSafeBinDirs(agentExec.safeBinTrustedDirs),
        ],
      }),
    });
  }
  return scopes;
}
/** Scan configured safeBins for missing profiles and risky low-friction entries. */
function scanExecSafeBinCoverage(cfg) {
  const hits = [];
  for (const scope of collectExecSafeBinScopes(cfg)) {
    const interpreterBins = new Set(listInterpreterLikeSafeBins(scope.safeBins));
    const riskyHits = listRiskyConfiguredSafeBins(scope.safeBins);
    const riskyBins = new Set(riskyHits.map((hit) => hit.bin));
    for (const bin of scope.safeBins) {
      if (scope.mergedProfiles[bin]) continue;
      if (riskyBins.has(normalizeSafeBinName(bin))) continue;
      hits.push({
        scopePath: scope.scopePath,
        bin,
        kind: "missingProfile",
        isInterpreter: interpreterBins.has(bin),
      });
    }
    for (const hit of riskyHits)
      hits.push({
        scopePath: scope.scopePath,
        bin: hit.bin,
        kind: "riskySemantics",
        warning: hit.warning,
      });
  }
  return hits;
}
/** Scan configured safeBins that resolve outside trusted binary directories. */
function scanExecSafeBinTrustedDirHints(cfg) {
  const hits = [];
  for (const scope of collectExecSafeBinScopes(cfg))
    for (const bin of scope.safeBins) {
      const resolution = resolveCommandResolutionFromArgv([bin]);
      if (!resolution?.execution.resolvedPath) continue;
      if (
        isTrustedSafeBinPath({
          resolvedPath: resolution.execution.resolvedPath,
          trustedDirs: scope.trustedSafeBinDirs,
        })
      )
        continue;
      hits.push({
        scopePath: scope.scopePath,
        bin,
        resolvedPath: resolution.execution.resolvedPath,
      });
    }
  return hits;
}
/** Format doctor warnings for safeBins profile coverage and risky semantics. */
function collectExecSafeBinCoverageWarnings(params) {
  if (params.hits.length === 0) return [];
  const interpreterHits = params.hits.filter(
    (hit) => hit.kind === "missingProfile" && hit.isInterpreter,
  );
  const customHits = params.hits.filter(
    (hit) => hit.kind === "missingProfile" && !hit.isInterpreter,
  );
  const riskyHits = params.hits.filter((hit) => hit.kind === "riskySemantics");
  const lines = [];
  if (interpreterHits.length > 0) {
    for (const hit of interpreterHits.slice(0, 5))
      lines.push(
        `- ${sanitizeForLog(hit.scopePath)}.safeBins includes interpreter/runtime '${sanitizeForLog(hit.bin)}' without profile.`,
      );
    if (interpreterHits.length > 5)
      lines.push(
        `- ${interpreterHits.length - 5} more interpreter/runtime safeBins entries are missing profiles.`,
      );
  }
  if (customHits.length > 0) {
    for (const hit of customHits.slice(0, 5))
      lines.push(
        `- ${sanitizeForLog(hit.scopePath)}.safeBins entry '${sanitizeForLog(hit.bin)}' is missing safeBinProfiles.${sanitizeForLog(hit.bin)}.`,
      );
    if (customHits.length > 5)
      lines.push(`- ${customHits.length - 5} more custom safeBins entries are missing profiles.`);
  }
  if (riskyHits.length > 0) {
    for (const hit of riskyHits.slice(0, 5))
      lines.push(
        `- ${sanitizeForLog(hit.scopePath)}.safeBins includes '${sanitizeForLog(hit.bin)}': ${sanitizeForLog(hit.warning ?? "prefer explicit allowlist entries or approval-gated runs.")}`,
      );
    if (riskyHits.length > 5)
      lines.push(
        `- ${riskyHits.length - 5} more safeBins entries should not use the low-risk safeBins fast path.`,
      );
  }
  if (customHits.length > 0)
    lines.push(
      `- Run "${params.doctorFixCommand}" to scaffold missing custom safeBinProfiles entries.`,
    );
  return lines;
}
/** Format doctor warnings for safeBins resolved outside trusted directories. */
function collectExecSafeBinTrustedDirHintWarnings(hits) {
  if (hits.length === 0) return [];
  const lines = hits
    .slice(0, 5)
    .map(
      (hit) =>
        `- ${sanitizeForLog(hit.scopePath)}.safeBins entry '${sanitizeForLog(hit.bin)}' resolves to '${sanitizeForLog(hit.resolvedPath)}' outside trusted safe-bin dirs.`,
    );
  if (hits.length > 5)
    lines.push(`- ${hits.length - 5} more safeBins entries resolve outside trusted safe-bin dirs.`);
  lines.push(
    "- If intentional, add the binary directory to tools.exec.safeBinTrustedDirs (global or agent scope).",
  );
  return lines;
}
/** Scaffold missing custom safeBin profiles and warn on interpreter/risky entries. */
function maybeRepairExecSafeBinProfiles(cfg) {
  const next = structuredClone(cfg);
  const changes = [];
  const warnings = [];
  for (const scope of collectExecSafeBinScopes(next)) {
    const interpreterBins = new Set(listInterpreterLikeSafeBins(scope.safeBins));
    const riskyHits = listRiskyConfiguredSafeBins(scope.safeBins);
    const riskyBins = new Set(riskyHits.map((hit) => hit.bin));
    for (const hit of riskyHits)
      warnings.push(`- ${scope.scopePath}.safeBins includes '${hit.bin}': ${hit.warning}`);
    const missingBins = scope.safeBins.filter(
      (bin) => !scope.mergedProfiles[bin] && !riskyBins.has(normalizeSafeBinName(bin)),
    );
    if (missingBins.length === 0) continue;
    const profileHolder =
      asObjectRecord(scope.exec.safeBinProfiles) ?? (scope.exec.safeBinProfiles = {});
    for (const bin of missingBins) {
      if (interpreterBins.has(bin)) {
        warnings.push(
          `- ${scope.scopePath}.safeBins includes interpreter/runtime '${bin}' without profile; remove it from safeBins or use explicit allowlist entries.`,
        );
        continue;
      }
      if (profileHolder[bin] !== void 0) continue;
      profileHolder[bin] = {};
      changes.push(
        `- ${scope.scopePath}.safeBinProfiles.${bin}: added scaffold profile {} (review and tighten flags/positionals).`,
      );
    }
  }
  if (changes.length === 0 && warnings.length === 0)
    return {
      config: cfg,
      changes: [],
      warnings: [],
    };
  return {
    config: next,
    changes,
    warnings,
  };
}
//#endregion
export {
  scanExecSafeBinTrustedDirHints as a,
  scanExecSafeBinCoverage as i,
  collectExecSafeBinTrustedDirHintWarnings as n,
  maybeRepairExecSafeBinProfiles as r,
  collectExecSafeBinCoverageWarnings as t,
};
