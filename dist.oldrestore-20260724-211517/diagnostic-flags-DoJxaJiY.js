import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { m as normalizeUniqueStringEntriesLower } from "./string-normalization-CRyoFBPt.js";
//#region src/infra/diagnostic-flags.ts
const DIAGNOSTICS_ENV = "OPENCLAW_DIAGNOSTICS";
function parseEnvFlags(raw) {
  if (!raw)
    return {
      flags: [],
      disablesAll: false,
    };
  const trimmed = raw.trim();
  const lowered = normalizeLowercaseStringOrEmpty(trimmed);
  if (!lowered)
    return {
      flags: [],
      disablesAll: false,
    };
  if (["0", "false", "off", "none"].includes(lowered))
    return {
      flags: [],
      disablesAll: true,
    };
  if (["1", "true", "all", "*"].includes(lowered))
    return {
      flags: ["*"],
      disablesAll: false,
    };
  return {
    flags: trimmed
      .split(/[,\s]+/)
      .map((value) => normalizeLowercaseStringOrEmpty(value))
      .filter(Boolean),
    disablesAll: false,
  };
}
/** Resolves enabled diagnostic flags from config plus `OPENCLAW_DIAGNOSTICS` overrides. */
function resolveDiagnosticFlags(cfg, env = process.env) {
  const configFlags = Array.isArray(cfg?.diagnostics?.flags) ? cfg?.diagnostics?.flags : [];
  const envFlags = parseEnvFlags(env[DIAGNOSTICS_ENV]);
  if (envFlags.disablesAll) return [];
  return normalizeUniqueStringEntriesLower([...configFlags, ...envFlags.flags]);
}
/** Matches one diagnostic flag against exact, wildcard, and namespace-enabled flags. */
function matchesDiagnosticFlag(flag, enabledFlags) {
  const target = normalizeLowercaseStringOrEmpty(flag);
  if (!target) return false;
  for (const raw of enabledFlags) {
    const enabled = normalizeLowercaseStringOrEmpty(raw);
    if (!enabled) continue;
    if (enabled === "*" || enabled === "all") return true;
    if (enabled.endsWith(".*")) {
      const prefix = enabled.slice(0, -2);
      if (target === prefix || target.startsWith(`${prefix}.`)) return true;
    }
    if (enabled.endsWith("*")) {
      const prefix = enabled.slice(0, -1);
      if (target.startsWith(prefix)) return true;
    }
    if (enabled === target) return true;
  }
  return false;
}
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
function isDiagnosticFlagEnabled(flag, cfg, env = process.env) {
  return matchesDiagnosticFlag(flag, resolveDiagnosticFlags(cfg, env));
}
//#endregion
export { matchesDiagnosticFlag as n, resolveDiagnosticFlags as r, isDiagnosticFlagEnabled as t };
