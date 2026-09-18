import path from "node:path";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  n as listAgentIds,
  s as resolveDefaultAgentDir,
} from "./agent-scope-config-DVIR1nBa.js";
import "./utils-DtcDeqWS.js";
import "./agent-scope-y9xQv_q1.js";
import {
  n as buildAuthHealthSummary,
  r as formatRemainingShort,
  t as DEFAULT_OAUTH_WARN_MS,
} from "./auth-health-DTCl3XuB.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { i as formatAuthDoctorHint, n as resolveApiKeyForProfile } from "./oauth-CqNVt6lC.js";
import "./auth-profiles-CX7JDmZ9.js";
import {
  n as buildOAuthRefreshFailureLoginCommand,
  o as formatOAuthRefreshFailureLoginCommandMarkdown,
  r as classifyOAuthRefreshFailure,
} from "./oauth-refresh-failure-CHdq_iT5.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import { t as buildProviderAuthRecoveryHint } from "./provider-auth-recovery-hint-DwukEoyu.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import {
  r as hasLocalAuthProfileStoreSource,
  t as hasAnyAuthProfileStoreSource,
} from "./source-check-yAijvhd5.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import { o as resolveProfileUnusableUntilForDisplay } from "./usage-BZgGbRoq.js";
//#region src/commands/doctor-auth.ts
/** Doctor notes for auth profile health, OAuth refresh failures, and legacy Codex config. */
const OPENAI_PROVIDER_ID = "openai";
const LEGACY_CODEX_PROVIDER_ID = "openai-codex";
const CODEX_OAUTH_WARNING_TITLE = "Codex OAuth";
const OPENAI_BASE_URL = "https://api.openai.com/v1";
const LEGACY_CODEX_APIS = /* @__PURE__ */ new Set(["openai-responses", "openai-completions"]);
const AUTH_PROFILES_CHECK_ID = "core/doctor/auth-profiles";
const DOCTOR_REAUTH_PROVIDER_ALIASES = { [LEGACY_CODEX_PROVIDER_ID]: OPENAI_PROVIDER_ID };
function hasConfiguredCodexOAuthProfile(cfg) {
  return Object.values(cfg.auth?.profiles ?? {}).some(
    (profile) =>
      (profile.provider === OPENAI_PROVIDER_ID || profile.provider === LEGACY_CODEX_PROVIDER_ID) &&
      profile.mode === "oauth",
  );
}
function hasStoredCodexOAuthProfile() {
  const store = ensureAuthProfileStore(void 0, {
    allowKeychainPrompt: false,
    readOnly: true,
  });
  return Object.values(store.profiles).some(
    (profile) =>
      (profile.provider === OPENAI_PROVIDER_ID || profile.provider === LEGACY_CODEX_PROVIDER_ID) &&
      profile.type === "oauth",
  );
}
function normalizeCodexOverrideBaseUrl(baseUrl) {
  if (typeof baseUrl !== "string") return;
  return baseUrl.trim().replace(/\/+$/, "");
}
function isLegacyCodexTransportShape(value, inheritedBaseUrl) {
  if (!isRecord(value)) return false;
  const api = typeof value.api === "string" ? value.api : void 0;
  if (!api || !LEGACY_CODEX_APIS.has(api)) return false;
  const baseUrl = normalizeCodexOverrideBaseUrl(value.baseUrl ?? inheritedBaseUrl);
  return !baseUrl || baseUrl === OPENAI_BASE_URL;
}
function hasLegacyCodexTransportOverride(providerOverride) {
  if (!isRecord(providerOverride)) return false;
  if (isLegacyCodexTransportShape(providerOverride)) return true;
  const models = providerOverride.models;
  if (!Array.isArray(models)) return false;
  return models.some((model) => isLegacyCodexTransportShape(model, providerOverride.baseUrl));
}
function buildCodexProviderOverrideWarning(providerOverride) {
  const lines = [
    `- models.providers.${LEGACY_CODEX_PROVIDER_ID} contains a legacy transport override while Codex OAuth is configured.`,
    "- Older OpenAI transport settings can shadow the built-in Codex OAuth provider path.",
  ];
  if (isRecord(providerOverride)) {
    const record = providerOverride;
    if (typeof record.api === "string")
      lines.push(`- models.providers.${LEGACY_CODEX_PROVIDER_ID}.api=${record.api}`);
    if (typeof record.baseUrl === "string")
      lines.push(`- models.providers.${LEGACY_CODEX_PROVIDER_ID}.baseUrl=${record.baseUrl}`);
  }
  lines.push(
    `- Remove or rewrite the legacy transport override to restore the built-in Codex OAuth provider path after recent fixes.`,
  );
  lines.push(
    "- Custom proxies and header-only overrides can stay; this warning only targets old OpenAI transport settings.",
  );
  return lines.join("\n");
}
function legacyCodexProviderOverrideToHealthFinding(providerOverride) {
  const message =
    "Legacy openai-codex transport override can shadow configured Codex OAuth credentials.";
  const details = buildCodexProviderOverrideWarning(providerOverride);
  return {
    checkId: AUTH_PROFILES_CHECK_ID,
    severity: "warning",
    message,
    path: `models.providers.${LEGACY_CODEX_PROVIDER_ID}`,
    target: LEGACY_CODEX_PROVIDER_ID,
    fixHint: details,
  };
}
/** Emits a warning when legacy Codex transport overrides can shadow configured Codex OAuth. */
function noteLegacyCodexProviderOverride(cfg) {
  const providerOverride = cfg.models?.providers?.[LEGACY_CODEX_PROVIDER_ID];
  if (!providerOverride) return;
  if (!hasLegacyCodexTransportOverride(providerOverride)) return;
  if (!hasConfiguredCodexOAuthProfile(cfg) && !hasStoredCodexOAuthProfile()) return;
  note(buildCodexProviderOverrideWarning(providerOverride), CODEX_OAUTH_WARNING_TITLE);
}
function formatAgentNoteTitle(title, agentId, labelAgents) {
  return labelAgents ? `${title} (agent: ${agentId})` : title;
}
function listAuthProfileHealthTargets(cfg) {
  const defaultAgentId = resolveDefaultAgentId(cfg);
  const targets = /* @__PURE__ */ new Map();
  const addTarget = (agentId, agentDir, isDefault) => {
    const key = path.resolve(agentDir);
    const existing = targets.get(key);
    if (!existing || isDefault)
      targets.set(key, {
        agentId,
        agentDir,
        isDefault: isDefault || existing?.isDefault === true,
      });
  };
  addTarget(defaultAgentId, resolveDefaultAgentDir(cfg), true);
  for (const agentId of listAgentIds(cfg)) {
    if (agentId === defaultAgentId) continue;
    const agentDir = resolveAgentDir(cfg, agentId);
    if (hasLocalAuthProfileStoreSource(agentDir)) addTarget(agentId, agentDir, false);
  }
  return [...targets.values()];
}
/** Returns the short doctor hint for disabled or cooldown auth profiles. */
function resolveUnusableProfileHint(params) {
  if (params.kind === "disabled") {
    if (params.reason === "billing") return "Top up credits (provider billing) or switch provider.";
    if (params.reason === "auth_permanent" || params.reason === "auth")
      return "Refresh or replace credentials, then retry.";
  }
  return "Wait for cooldown or switch provider.";
}
function formatOAuthRefreshFailureReason(reason) {
  switch (reason) {
    case "refresh_token_reused":
      return "refresh_token_reused";
    case "invalid_grant":
      return "invalid_grant";
    case "sign_in_again":
      return "sign in again";
    case "invalid_refresh_token":
      return "invalid refresh token";
    case "revoked":
      return "revoked";
    default:
      return "refresh failed";
  }
}
/** Formats provider OAuth refresh failures as actionable doctor note lines. */
function formatOAuthRefreshFailureDoctorLine(params) {
  const classified = classifyOAuthRefreshFailure(params.message);
  if (!classified) return null;
  const rawProvider = classified.provider ?? params.provider;
  const provider = rawProvider
    ? (DOCTOR_REAUTH_PROVIDER_ALIASES[rawProvider] ?? rawProvider)
    : null;
  const commandMarkdown = formatOAuthRefreshFailureLoginCommandMarkdown(
    buildOAuthRefreshFailureLoginCommand(provider, {
      profileId: provider === rawProvider ? params.profileId : void 0,
    }),
  );
  if (classified.reason)
    return `- ${params.profileId}: re-auth required [${formatOAuthRefreshFailureReason(classified.reason)}] — Run ${commandMarkdown}.`;
  return `- ${params.profileId}: OAuth refresh failed — Try again; if this persists, run ${commandMarkdown}.`;
}
async function resolveAuthIssueHint(issue, cfg, store) {
  if (issue.reasonCode === "invalid_expires")
    return "Invalid token expires metadata. Set a future Unix ms timestamp or remove expires.";
  if (issue.reasonCode === "malformed_api_key")
    return "Paste the API key value, not an OpenClaw onboarding command.";
  const providerHint = await formatAuthDoctorHint({
    cfg,
    store,
    provider: issue.provider,
    profileId: issue.profileId,
  });
  if (providerHint.trim()) return providerHint;
  return buildProviderAuthRecoveryHint({ provider: issue.provider }).replace(
    /^Run /,
    "Re-auth via ",
  );
}
async function formatAuthIssueLine(issue, cfg, store) {
  const remaining =
    issue.remainingMs !== void 0 ? ` (${formatRemainingShort(issue.remainingMs)})` : "";
  const hint = await resolveAuthIssueHint(issue, cfg, store);
  const reason = issue.reasonCode ? ` [${issue.reasonCode}]` : "";
  return `- ${issue.profileId}: ${issue.status}${reason}${remaining}${hint ? ` — ${hint}` : ""}`;
}
function resolveAuthProfileStorePath(target) {
  return resolveAuthStorePathForDisplay(target.agentDir);
}
function authProfileIssueToHealthFinding(params) {
  const remaining =
    params.issue.remainingMs !== void 0
      ? ` (${formatRemainingShort(params.issue.remainingMs)})`
      : "";
  const reason = params.issue.reasonCode ? ` [${params.issue.reasonCode}]` : "";
  const owner = params.labelAgents ? `Agent ${params.target.agentId} auth profile` : "Auth profile";
  return {
    checkId: AUTH_PROFILES_CHECK_ID,
    severity: "warning",
    message: `${owner} ${params.issue.profileId} is ${params.issue.status}${reason}${remaining}.`,
    path: resolveAuthProfileStorePath(params.target),
    target: params.issue.profileId,
    ...(params.issue.reasonCode ? { requirement: params.issue.reasonCode } : {}),
    fixHint:
      params.hint ??
      (params.issue.status === "expiring"
        ? "Run `openclaw doctor --fix` to refresh expiring OAuth profiles, or re-authenticate static tokens."
        : "Run `openclaw doctor --fix` to refresh OAuth profiles, or re-authenticate this provider."),
  };
}
function authProfileCooldownToHealthFinding(params) {
  return {
    checkId: AUTH_PROFILES_CHECK_ID,
    severity: "warning",
    message: params.labelAgents
      ? `Agent ${params.target.agentId} auth profile ${params.profileId} is ${params.kind} (${params.remaining}).`
      : `Auth profile ${params.profileId} is ${params.kind} (${params.remaining}).`,
    path: resolveAuthProfileStorePath(params.target),
    target: params.profileId,
    fixHint: params.hint,
  };
}
function isAuthProfileHealthIssue(profile) {
  if (profile.type === "api_key") return profile.status === "missing";
  return (
    (profile.type === "oauth" || profile.type === "token") &&
    (profile.status === "expired" || profile.status === "expiring" || profile.status === "missing")
  );
}
async function collectAuthProfileHealthFindingsForTarget(params) {
  const store = ensureAuthProfileStore(params.target.agentDir, {
    allowKeychainPrompt: params.allowKeychainPrompt,
    readOnly: true,
  });
  const findings = [];
  const now = Date.now();
  for (const profileId of Object.keys(store.usageStats ?? {})) {
    const until = resolveProfileUnusableUntilForDisplay(store, profileId);
    if (!until || now >= until) continue;
    const stats = store.usageStats?.[profileId];
    const remaining = formatRemainingShort(until - now);
    const disabledActive = typeof stats?.disabledUntil === "number" && now < stats.disabledUntil;
    const kind = disabledActive
      ? `disabled${stats.disabledReason ? `:${stats.disabledReason}` : ""}`
      : "cooldown";
    const hint = resolveUnusableProfileHint({
      kind: disabledActive ? "disabled" : "cooldown",
      reason: stats?.disabledReason,
    });
    findings.push(
      authProfileCooldownToHealthFinding({
        profileId,
        target: params.target,
        labelAgents: params.labelAgents,
        kind,
        remaining,
        hint,
      }),
    );
  }
  const issues = buildAuthHealthSummary({
    store,
    cfg: params.cfg,
    warnAfterMs: DEFAULT_OAUTH_WARN_MS,
    allowKeychainPrompt: params.allowKeychainPrompt,
  }).profiles.filter(isAuthProfileHealthIssue);
  for (const issue of issues) {
    const authIssue = {
      profileId: issue.profileId,
      provider: issue.provider,
      status: issue.status,
      reasonCode: issue.reasonCode,
      remainingMs: issue.remainingMs,
    };
    findings.push(
      authProfileIssueToHealthFinding({
        issue: authIssue,
        target: params.target,
        labelAgents: params.labelAgents,
        hint: await resolveAuthIssueHint(authIssue, params.cfg, store),
      }),
    );
  }
  return findings;
}
/** Collects read-only structured findings for auth profile health. */
async function collectAuthProfileHealthFindings(params) {
  const configuredProfiles = Object.keys(params.cfg.auth?.profiles ?? {}).length > 0;
  const activeTargets = listAuthProfileHealthTargets(params.cfg).filter((target) =>
    target.isDefault
      ? hasAnyAuthProfileStoreSource(target.agentDir) || configuredProfiles
      : hasLocalAuthProfileStoreSource(target.agentDir),
  );
  const findings = [];
  const labelAgents = activeTargets.length > 1;
  for (const target of activeTargets)
    findings.push(
      ...(await collectAuthProfileHealthFindingsForTarget({
        cfg: params.cfg,
        allowKeychainPrompt: params.allowKeychainPrompt ?? false,
        target,
        labelAgents,
      })),
    );
  const providerOverride = params.cfg.models?.providers?.[LEGACY_CODEX_PROVIDER_ID];
  if (
    providerOverride &&
    hasLegacyCodexTransportOverride(providerOverride) &&
    (hasConfiguredCodexOAuthProfile(params.cfg) || hasStoredCodexOAuthProfile())
  )
    findings.push(legacyCodexProviderOverrideToHealthFinding(providerOverride));
  return findings;
}
async function noteAuthProfileHealthForTarget(params) {
  const store = ensureAuthProfileStore(params.target.agentDir, {
    allowKeychainPrompt: params.allowKeychainPrompt,
  });
  const noteTitle = (title) =>
    formatAgentNoteTitle(title, params.target.agentId, params.labelAgents);
  const unusable = (() => {
    const now = Date.now();
    const out = [];
    for (const profileId of Object.keys(store.usageStats ?? {})) {
      const until = resolveProfileUnusableUntilForDisplay(store, profileId);
      if (!until || now >= until) continue;
      const stats = store.usageStats?.[profileId];
      const remaining = formatRemainingShort(until - now);
      const disabledActive = typeof stats?.disabledUntil === "number" && now < stats.disabledUntil;
      const kind = disabledActive
        ? `disabled${stats.disabledReason ? `:${stats.disabledReason}` : ""}`
        : "cooldown";
      const hint = resolveUnusableProfileHint({
        kind: disabledActive ? "disabled" : "cooldown",
        reason: stats?.disabledReason,
      });
      out.push(`- ${profileId}: ${kind} (${remaining})${hint ? ` — ${hint}` : ""}`);
    }
    return out;
  })();
  if (unusable.length > 0) note(unusable.join("\n"), noteTitle("Auth profile cooldowns"));
  let summary = buildAuthHealthSummary({
    store,
    cfg: params.cfg,
    warnAfterMs: DEFAULT_OAUTH_WARN_MS,
    allowKeychainPrompt: params.allowKeychainPrompt,
  });
  const findIssues = () => summary.profiles.filter(isAuthProfileHealthIssue);
  let issues = findIssues();
  if (issues.length === 0) return [];
  const refreshTargets = issues.filter(
    (issue) => issue.type === "oauth" && ["expired", "expiring", "missing"].includes(issue.status),
  );
  if (
    refreshTargets.length > 0 &&
    (await params.prompter.confirmAutoFix({
      message: "Refresh expiring OAuth tokens now? (static tokens need re-auth)",
      initialValue: true,
    }))
  ) {
    const errors = [];
    for (const profile of refreshTargets)
      try {
        await resolveApiKeyForProfile({
          cfg: params.cfg,
          store,
          profileId: profile.profileId,
          agentDir: params.target.agentDir,
        });
      } catch (err) {
        const message = formatErrorMessage(err);
        errors.push(
          formatOAuthRefreshFailureDoctorLine({
            profileId: profile.profileId,
            provider: profile.provider,
            message,
          }) ?? `- ${profile.profileId}: ${message}`,
        );
      }
    if (errors.length > 0) note(errors.join("\n"), noteTitle("OAuth refresh errors"));
    summary = buildAuthHealthSummary({
      store: ensureAuthProfileStore(params.target.agentDir, { allowKeychainPrompt: false }),
      cfg: params.cfg,
      warnAfterMs: DEFAULT_OAUTH_WARN_MS,
      allowKeychainPrompt: false,
    });
    issues = findIssues();
  }
  return Promise.all(issues.map((issue) => formatAuthIssueLine(issue, params.cfg, store)));
}
/** Checks configured agent auth stores and emits doctor notes for stale or unusable profiles. */
async function noteAuthProfileHealth(params) {
  const configuredProfiles = Object.keys(params.cfg.auth?.profiles ?? {}).length > 0;
  const activeTargets = listAuthProfileHealthTargets(params.cfg).filter((target) =>
    target.isDefault
      ? hasAnyAuthProfileStoreSource(target.agentDir) || configuredProfiles
      : hasLocalAuthProfileStoreSource(target.agentDir),
  );
  if (activeTargets.length === 0) return;
  const labelAgents = activeTargets.length > 1;
  const agentsByIssueLine = /* @__PURE__ */ new Map();
  for (const target of activeTargets)
    for (const line of await noteAuthProfileHealthForTarget({
      ...params,
      target,
      labelAgents,
    })) {
      const agentIds = agentsByIssueLine.get(line) ?? /* @__PURE__ */ new Set();
      agentsByIssueLine.set(line, agentIds.add(target.agentId));
    }
  if (agentsByIssueLine.size === 0) return;
  note(
    [...agentsByIssueLine.entries()]
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([line, agentIds]) =>
        agentIds.size === activeTargets.length
          ? line
          : `${line} (agents: ${[...agentIds].toSorted().join(", ")})`,
      )
      .join("\n"),
    "Model auth",
  );
}
//#endregion
export { collectAuthProfileHealthFindings, noteAuthProfileHealth, noteLegacyCodexProviderOverride };
