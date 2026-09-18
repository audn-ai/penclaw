import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  n as selectRefsForExecPolicy,
  t as getSkippedExecRefStaticError,
} from "./exec-resolution-policy-CT-fkHIP.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  d as isNonSecretApiKeyMarker,
  p as isSecretRefHeaderValueMarker,
} from "./model-auth-markers-CA2Xy59Z.js";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-CwM0ZwJ1.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { r as listKnownSecretEnvVarNames } from "./provider-env-vars-BZiQzob_.js";
import "./target-registry-Db69vEew.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { l as secretRefKey } from "./ref-contract-DVV0zYUk.js";
import {
  i as resolveSecretRefValues,
  r as resolveSecretRefValue,
  t as isProviderScopedSecretResolutionError,
} from "./resolve-Dvpn9c2h.js";
import "./config-BDv-QbJ6.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import {
  n as hasConfiguredPlaintextSecretValue,
  r as isExpectedResolvedSecretValue,
} from "./secret-value-BtpfhOEU.js";
import "./model-selection-DOlkTrQa.js";
import { n as isNonEmptyString } from "./shared-CrrsbqCi.js";
import {
  a as readPersistedAuthProfileStoreRaw,
  c as resolveAuthProfileDatabasePath,
} from "./sqlite-BXljtvPf.js";
import {
  a as readJsonObjectIfExists,
  i as parseEnvAssignmentValue,
  n as listAuthProfileStoreAgentDirs,
  o as createSecretsConfigIO,
  r as listLegacyAuthJsonPaths,
  s as iterateAuthProfileCredentials,
  t as listAgentModelsJsonPaths,
} from "./storage-scan-DmQrHGJt.js";
import { n as discoverConfigSecretTargets } from "./target-registry-query-CH3KJb3I.js";
import { g as resolveSecretInputRef, s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
import { d as resolveConfigDir } from "./utils-DtcDeqWS.js";
//#region src/secrets/audit.ts
/** Audits configured secrets and reports plaintext/ref migration status. */
const REF_RESOLVE_FALLBACK_CONCURRENCY = 8;
const MAX_AUDIT_MODELS_JSON_BYTES = 5 * 1024 * 1024;
function addFinding(collector, finding) {
  collector.findings.push(finding);
}
function collectProviderRefPath(collector, providerId, configPath) {
  const key = normalizeProviderId(providerId);
  const existing = collector.configProviderRefPaths.get(key);
  if (existing) {
    existing.push(configPath);
    return;
  }
  collector.configProviderRefPaths.set(key, [configPath]);
}
function trackAuthProviderState(collector, provider, mode) {
  const key = normalizeProviderId(provider);
  const existing = collector.authProviderState.get(key);
  if (existing) {
    existing.hasUsableStaticOrOAuth = true;
    existing.modes.add(mode);
    return;
  }
  collector.authProviderState.set(key, {
    hasUsableStaticOrOAuth: true,
    modes: /* @__PURE__ */ new Set([mode]),
  });
}
function collectEnvPlaintext(params) {
  if (!fs.existsSync(params.envPath)) return;
  params.collector.filesScanned.add(params.envPath);
  const knownKeys = new Set(listKnownSecretEnvVarNames());
  const lines = fs.readFileSync(params.envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const key = match[1] ?? "";
    if (!knownKeys.has(key)) continue;
    if (!parseEnvAssignmentValue(match[2] ?? "")) continue;
    addFinding(params.collector, {
      code: "PLAINTEXT_FOUND",
      severity: "warn",
      file: params.envPath,
      jsonPath: `$env.${key}`,
      message: `Potential secret found in .env (${key}).`,
    });
  }
}
function collectConfigSecrets(params) {
  const defaults = params.config.secrets?.defaults;
  for (const target of discoverConfigSecretTargets(params.config)) {
    if (!target.entry.includeInAudit) continue;
    const { ref } = resolveSecretInputRef({
      value: target.value,
      refValue: target.refValue,
      defaults,
    });
    if (ref) {
      params.collector.refAssignments.push({
        file: params.configPath,
        path: target.path,
        ref,
        expected: target.entry.expectedResolvedValue,
        provider: target.providerId,
      });
      if (target.entry.trackProviderShadowing && target.providerId)
        collectProviderRefPath(params.collector, target.providerId, target.path);
      continue;
    }
    const hasPlaintext = hasConfiguredPlaintextSecretValue(
      target.value,
      target.entry.expectedResolvedValue,
    );
    if (
      target.entry.id === "models.providers.*.headers.*" &&
      !isLikelySensitiveModelProviderHeaderName(target.pathSegments.at(-1) ?? "")
    )
      continue;
    if (
      target.entry.id === "models.providers.*.apiKey" &&
      typeof target.value === "string" &&
      isNonSecretApiKeyMarker(target.value)
    )
      continue;
    if (!hasPlaintext) continue;
    addFinding(params.collector, {
      code: "PLAINTEXT_FOUND",
      severity: "warn",
      file: params.configPath,
      jsonPath: target.path,
      message: `${target.path} is stored as plaintext.`,
      provider: target.providerId,
    });
  }
}
function collectAuthStoreSecrets(params) {
  const authStorePath = resolveAuthProfileDatabasePath(params.agentDir);
  if (!fs.existsSync(authStorePath)) return;
  const parsed = readPersistedAuthProfileStoreRaw(params.agentDir);
  if (!isRecord(parsed) || !isRecord(parsed.profiles)) return;
  params.collector.filesScanned.add(authStorePath);
  for (const entry of iterateAuthProfileCredentials(parsed.profiles)) {
    if (entry.kind === "api_key" || entry.kind === "token") {
      const { ref } = resolveSecretInputRef({
        value: entry.value,
        refValue: entry.refValue,
        defaults: params.defaults,
      });
      const authoredValueRef = coerceSecretRef(entry.value, params.defaults);
      if (ref) {
        params.collector.refAssignments.push({
          file: authStorePath,
          path: `profiles.${entry.profileId}.${entry.valueField}`,
          ref,
          expected: "string",
          provider: entry.provider,
        });
        trackAuthProviderState(params.collector, entry.provider, entry.kind);
      }
      if (authoredValueRef) continue;
      if (isNonEmptyString(entry.value)) {
        addFinding(params.collector, {
          code: "PLAINTEXT_FOUND",
          severity: "warn",
          file: authStorePath,
          jsonPath: `profiles.${entry.profileId}.${entry.valueField}`,
          message:
            entry.kind === "api_key"
              ? "Auth profile API key is stored as plaintext."
              : "Auth profile token is stored as plaintext.",
          provider: entry.provider,
          profileId: entry.profileId,
        });
        trackAuthProviderState(params.collector, entry.provider, entry.kind);
      }
      continue;
    }
    if (entry.hasAccess || entry.hasRefresh) {
      addFinding(params.collector, {
        code: "LEGACY_RESIDUE",
        severity: "info",
        file: authStorePath,
        jsonPath: `profiles.${entry.profileId}`,
        message: "OAuth credentials are present (out of scope for static SecretRef migration).",
        provider: entry.provider,
        profileId: entry.profileId,
      });
      trackAuthProviderState(params.collector, entry.provider, "oauth");
    }
  }
}
function collectAuthJsonResidue(params) {
  for (const authJsonPath of listLegacyAuthJsonPaths(params.stateDir)) {
    params.collector.filesScanned.add(authJsonPath);
    const parsedResult = readJsonObjectIfExists(authJsonPath);
    if (parsedResult.error) {
      addFinding(params.collector, {
        code: "REF_UNRESOLVED",
        severity: "error",
        file: authJsonPath,
        jsonPath: "<root>",
        message: `Invalid JSON in legacy auth.json: ${parsedResult.error}`,
      });
      continue;
    }
    const parsed = parsedResult.value;
    if (!parsed) continue;
    for (const [providerId, value] of Object.entries(parsed)) {
      if (!isRecord(value)) continue;
      if (value.type === "api_key" && isNonEmptyString(value.key))
        addFinding(params.collector, {
          code: "LEGACY_RESIDUE",
          severity: "warn",
          file: authJsonPath,
          jsonPath: providerId,
          message: "Legacy auth.json contains static api_key credentials.",
          provider: providerId,
        });
    }
  }
}
function collectModelsJsonSecrets(params) {
  if (!fs.existsSync(params.modelsJsonPath)) return;
  params.collector.filesScanned.add(params.modelsJsonPath);
  const parsedResult = readJsonObjectIfExists(params.modelsJsonPath, {
    requireRegularFile: true,
    maxBytes: MAX_AUDIT_MODELS_JSON_BYTES,
  });
  if (parsedResult.error) {
    addFinding(params.collector, {
      code: "REF_UNRESOLVED",
      severity: "error",
      file: params.modelsJsonPath,
      jsonPath: "<root>",
      message: `Invalid JSON in models.json: ${parsedResult.error}`,
    });
    return;
  }
  const parsed = parsedResult.value;
  if (!parsed || !isRecord(parsed.providers)) return;
  for (const [providerId, providerValue] of Object.entries(parsed.providers)) {
    if (!isRecord(providerValue)) continue;
    const apiKey = providerValue.apiKey;
    if (coerceSecretRef(apiKey))
      addFinding(params.collector, {
        code: "REF_UNRESOLVED",
        severity: "error",
        file: params.modelsJsonPath,
        jsonPath: `providers.${providerId}.apiKey`,
        message: "models.json contains an unresolved SecretRef object; regenerate models.json.",
        provider: providerId,
      });
    else if (isNonEmptyString(apiKey) && !isNonSecretApiKeyMarker(apiKey))
      addFinding(params.collector, {
        code: "PLAINTEXT_FOUND",
        severity: "warn",
        file: params.modelsJsonPath,
        jsonPath: `providers.${providerId}.apiKey`,
        message: "models.json provider apiKey is stored as plaintext.",
        provider: providerId,
      });
    const headers = isRecord(providerValue.headers) ? providerValue.headers : void 0;
    if (!headers) continue;
    for (const [headerKey, headerValue] of Object.entries(headers)) {
      const headerPath = `providers.${providerId}.headers.${headerKey}`;
      if (coerceSecretRef(headerValue)) {
        addFinding(params.collector, {
          code: "REF_UNRESOLVED",
          severity: "error",
          file: params.modelsJsonPath,
          jsonPath: headerPath,
          message:
            "models.json contains an unresolved SecretRef object for provider headers; regenerate models.json.",
          provider: providerId,
        });
        continue;
      }
      if (!isNonEmptyString(headerValue)) continue;
      if (isSecretRefHeaderValueMarker(headerValue)) continue;
      if (!isLikelySensitiveModelProviderHeaderName(headerKey)) continue;
      addFinding(params.collector, {
        code: "PLAINTEXT_FOUND",
        severity: "warn",
        file: params.modelsJsonPath,
        jsonPath: headerPath,
        message: "models.json provider header value is stored as plaintext.",
        provider: providerId,
      });
    }
  }
}
async function collectUnresolvedRefFindings(params) {
  const cache = {};
  const refsByProvider = /* @__PURE__ */ new Map();
  const skippedRefKeys = /* @__PURE__ */ new Set();
  let refsChecked = 0;
  let skippedExecRefs = 0;
  for (const assignment of params.collector.refAssignments) {
    const providerKey = `${assignment.ref.source}:${assignment.ref.provider}`;
    let refsForProvider = refsByProvider.get(providerKey);
    if (!refsForProvider) {
      refsForProvider = /* @__PURE__ */ new Map();
      refsByProvider.set(providerKey, refsForProvider);
    }
    refsForProvider.set(secretRefKey(assignment.ref), assignment.ref);
  }
  const resolvedByRefKey = /* @__PURE__ */ new Map();
  const errorsByRefKey = /* @__PURE__ */ new Map();
  for (const refsForProvider of refsByProvider.values()) {
    const refs = [...refsForProvider.values()];
    const selectedRefs = selectRefsForExecPolicy({
      refs,
      allowExec: params.allowExec,
    });
    if (selectedRefs.skippedExecRefs.length > 0) {
      skippedExecRefs += selectedRefs.skippedExecRefs.length;
      for (const ref of selectedRefs.skippedExecRefs) {
        skippedRefKeys.add(secretRefKey(ref));
        const staticError = getSkippedExecRefStaticError({
          ref,
          config: params.config,
        });
        if (staticError) errorsByRefKey.set(secretRefKey(ref), new Error(staticError));
      }
    }
    if (selectedRefs.refsToResolve.length === 0) continue;
    refsChecked += selectedRefs.refsToResolve.length;
    const provider = refs[0]?.provider;
    try {
      const resolved = await resolveSecretRefValues(selectedRefs.refsToResolve, {
        config: params.config,
        env: params.env,
        cache,
      });
      for (const [key, value] of resolved.entries()) resolvedByRefKey.set(key, value);
      continue;
    } catch (err) {
      if (provider && isProviderScopedSecretResolutionError(err)) {
        for (const ref of selectedRefs.refsToResolve) errorsByRefKey.set(secretRefKey(ref), err);
        continue;
      }
    }
    const fallback = await runTasksWithConcurrency({
      tasks: selectedRefs.refsToResolve.map((ref) => async () => ({
        key: secretRefKey(ref),
        resolved: await resolveSecretRefValue(ref, {
          config: params.config,
          env: params.env,
          cache,
        }),
      })),
      limit: Math.min(REF_RESOLVE_FALLBACK_CONCURRENCY, selectedRefs.refsToResolve.length),
      errorMode: "continue",
      onTaskError: (error, index) => {
        const ref = selectedRefs.refsToResolve[index];
        if (!ref) return;
        errorsByRefKey.set(secretRefKey(ref), error);
      },
    });
    for (const result of fallback.results) {
      if (!result) continue;
      resolvedByRefKey.set(result.key, result.resolved);
    }
  }
  for (const assignment of params.collector.refAssignments) {
    const key = secretRefKey(assignment.ref);
    if (skippedRefKeys.has(key) && !errorsByRefKey.has(key)) continue;
    const resolveErr = errorsByRefKey.get(key);
    if (resolveErr) {
      addFinding(params.collector, {
        code: "REF_UNRESOLVED",
        severity: "error",
        file: assignment.file,
        jsonPath: assignment.path,
        message: `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (${formatErrorMessage(resolveErr)}).`,
        provider: assignment.provider,
      });
      continue;
    }
    if (!resolvedByRefKey.has(key)) {
      addFinding(params.collector, {
        code: "REF_UNRESOLVED",
        severity: "error",
        file: assignment.file,
        jsonPath: assignment.path,
        message: `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (resolved value is missing).`,
        provider: assignment.provider,
      });
      continue;
    }
    if (!isExpectedResolvedSecretValue(resolvedByRefKey.get(key), assignment.expected))
      addFinding(params.collector, {
        code: "REF_UNRESOLVED",
        severity: "error",
        file: assignment.file,
        jsonPath: assignment.path,
        message:
          assignment.expected === "string"
            ? `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (resolved value is not a non-empty string).`
            : `Failed to resolve ${assignment.ref.source}:${assignment.ref.provider}:${assignment.ref.id} (resolved value is not a string/object).`,
        provider: assignment.provider,
      });
  }
  return {
    refsChecked,
    skippedExecRefs,
  };
}
function collectShadowingFindings(collector) {
  for (const [provider, paths] of collector.configProviderRefPaths.entries()) {
    const authState = collector.authProviderState.get(provider);
    if (!authState?.hasUsableStaticOrOAuth) continue;
    const modeText = [...authState.modes].join("/");
    for (const configPath of paths)
      addFinding(collector, {
        code: "REF_SHADOWED",
        severity: "warn",
        file: "openclaw.json",
        jsonPath: configPath,
        message: `Auth profile credentials (${modeText}) take precedence for provider "${provider}", so this config ref may never be used.`,
        provider,
      });
  }
}
function summarizeFindings(findings) {
  return {
    plaintextCount: findings.filter((entry) => entry.code === "PLAINTEXT_FOUND").length,
    unresolvedRefCount: findings.filter((entry) => entry.code === "REF_UNRESOLVED").length,
    shadowedRefCount: findings.filter((entry) => entry.code === "REF_SHADOWED").length,
    legacyResidueCount: findings.filter((entry) => entry.code === "LEGACY_RESIDUE").length,
  };
}
/** Runs local storage/config audit and returns a structured report. */
/** Runs a secrets audit over config/auth stores and returns structured findings. */
async function runSecretsAudit(params = {}) {
  const env = params.env ?? process.env;
  const allowExec = Boolean(params.allowExec);
  const snapshot = await createSecretsConfigIO({ env }).readConfigFileSnapshot();
  const configPath = resolveUserPath(snapshot.path);
  const defaults = snapshot.valid ? snapshot.config.secrets?.defaults : void 0;
  const collector = {
    findings: [],
    refAssignments: [],
    configProviderRefPaths: /* @__PURE__ */ new Map(),
    authProviderState: /* @__PURE__ */ new Map(),
    filesScanned: /* @__PURE__ */ new Set([configPath]),
  };
  const stateDir = resolveStateDir(env, os.homedir);
  const envPath = path.join(resolveConfigDir(env, os.homedir), ".env");
  const config = snapshot.valid ? snapshot.config : {};
  let resolution = {
    refsChecked: 0,
    skippedExecRefs: 0,
    resolvabilityComplete: true,
  };
  if (snapshot.valid) {
    collectConfigSecrets({
      config,
      configPath,
      collector,
    });
    for (const agentDir of listAuthProfileStoreAgentDirs(config, stateDir))
      collectAuthStoreSecrets({
        agentDir,
        collector,
        defaults,
      });
    for (const modelsJsonPath of listAgentModelsJsonPaths(config, stateDir, env))
      collectModelsJsonSecrets({
        modelsJsonPath,
        collector,
      });
    const unresolvedRefResult = await collectUnresolvedRefFindings({
      collector,
      config,
      env,
      allowExec,
    });
    resolution = {
      refsChecked: unresolvedRefResult.refsChecked,
      skippedExecRefs: unresolvedRefResult.skippedExecRefs,
      resolvabilityComplete: unresolvedRefResult.skippedExecRefs === 0,
    };
    collectShadowingFindings(collector);
  } else
    addFinding(collector, {
      code: "REF_UNRESOLVED",
      severity: "error",
      file: configPath,
      jsonPath: "<root>",
      message: "Config is invalid; cannot validate secret references reliably.",
    });
  collectEnvPlaintext({
    envPath,
    collector,
  });
  collectAuthJsonResidue({
    stateDir,
    collector,
  });
  const summary = summarizeFindings(collector.findings);
  return {
    version: 1,
    status:
      summary.unresolvedRefCount > 0
        ? "unresolved"
        : collector.findings.length > 0
          ? "findings"
          : "clean",
    resolution,
    filesScanned: [...collector.filesScanned].toSorted(),
    summary,
    findings: collector.findings,
  };
}
/** Maps audit results to CLI exit codes. */
function resolveSecretsAuditExitCode(report, check) {
  if (report.summary.unresolvedRefCount > 0) return 2;
  if (check && report.findings.length > 0) return 1;
  return 0;
}
//#endregion
export { resolveSecretsAuditExitCode, runSecretsAudit };
