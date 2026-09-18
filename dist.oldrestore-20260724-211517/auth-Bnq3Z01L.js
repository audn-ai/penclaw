import { createHash } from "node:crypto";
import {
  n as hasAuthProfileConfigConflict,
  r as hasCurrentAuthProfileConfigConflict,
  t as applyAuthProfileConfigWithConflictCheck,
} from "./auth-config-DKRCa_qN.js";
import {
  n as readHermesCodexAuthCandidates,
  t as buildReauthenticationItems,
} from "./auth-source-ByvRFXgv.js";
import { a as isRecord, c as readString, u as readText } from "./helpers-DtCn6Wrs.js";
import {
  i as HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE,
  l as HERMES_REASON_SECRET_NO_LONGER_PRESENT,
  n as HERMES_REASON_AUTH_PROFILE_EXISTS,
  o as HERMES_REASON_INCLUDE_SECRETS,
  r as HERMES_REASON_AUTH_PROFILE_WRITE_FAILED,
  s as HERMES_REASON_MISSING_SECRET_METADATA,
} from "./items-BLOMW86Q.js";
import {
  d as markMigrationItemSkipped,
  l as markMigrationItemConflict,
  o as createMigrationItem,
  u as markMigrationItemError,
} from "./migration-nGWjmzKy.js";
import "./agent-runtime-BiQiwmwD.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-B7OGjVYg.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import {
  f as buildOpenAICodexCredentialExtra,
  g as resolveOpenAICodexImportProfileName,
  h as resolveOpenAICodexAuthIdentity,
  m as resolveOpenAICodexAccessTokenExpiry,
} from "./provider-auth-mypr64nh.js";
import { t as buildOauthProviderAuthResult } from "./provider-auth-result-C3SBJpUX.js";
import { n as applyAgentDefaultModelPrimary } from "./provider-onboard-CvQgbxgZ.js";
import {
  f as loadAuthProfileStoreWithoutExternalProfiles,
  y as updateAuthProfileStoreWithLock,
} from "./store-B7DoDdVM.js";
//#region extensions/migrate-hermes/auth.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_DEFAULT_MODEL = "openai/gpt-5.6-sol";
const HERMES_AUTH_DISPLAY_NAME = "Hermes import";
function authProfileTarget(agentDir, profileId) {
  return `${resolveAuthStorePathForDisplay(agentDir)}#${profileId}`;
}
function sourceCredentialFingerprint(candidate) {
  const hash = createHash("sha256");
  for (const part of [
    candidate.sourceKind,
    candidate.accountId ?? "",
    candidate.access,
    candidate.refresh,
  ]) {
    hash.update(part);
    hash.update("\0");
  }
  return hash.digest("hex");
}
async function readOpenCodeOpenAICandidates(authPath) {
  const raw = await readText(authPath);
  if (!raw || !authPath) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!isRecord(parsed)) return [];
  const openai = isRecord(parsed.openai) ? parsed.openai : void 0;
  const access = readString(openai?.access);
  const accountId = readString(openai?.accountId);
  const refresh = readString(openai?.refresh);
  if (!access || !refresh) return [];
  return [
    {
      access,
      ...(accountId ? { accountId } : {}),
      refresh,
      sourceKind: "opencode-auth-json",
      sourceSlot: "opencode",
      sourceCredentialIndex: 0,
      sourceLabel: "OpenCode OpenAI OAuth credential",
      sourcePath: authPath,
    },
  ];
}
function buildAuthResult(candidate, fallbackProfileName = "hermes-import") {
  const identity = resolveOpenAICodexAuthIdentity({
    access: candidate.access,
    accountId: candidate.accountId,
  });
  return buildOauthProviderAuthResult({
    providerId: OPENAI_PROVIDER_ID,
    defaultModel: OPENAI_CODEX_DEFAULT_MODEL,
    access: candidate.access,
    refresh: candidate.refresh,
    expires: resolveOpenAICodexAccessTokenExpiry(candidate.access),
    email: identity.email,
    profileName: resolveOpenAICodexImportProfileName(identity, fallbackProfileName),
    displayName: HERMES_AUTH_DISPLAY_NAME,
    credentialExtra: buildOpenAICodexCredentialExtra(identity),
  });
}
function readProviderAuthModelConfigs(result) {
  const models = result.configPatch?.agents?.defaults?.models;
  if (isRecord(models)) return { ...models };
  return { [readString(result.defaultModel) ?? OPENAI_CODEX_DEFAULT_MODEL]: {} };
}
function mergeModelConfigEntry(existing, patch) {
  if (existing && isRecord(existing) && isRecord(patch))
    return {
      ...existing,
      ...patch,
    };
  return existing ?? patch;
}
function applyOAuthModelConfigsToConfig(cfg, result) {
  const patchModels = readProviderAuthModelConfigs(result);
  const existingModels = cfg.agents?.defaults?.models ?? {};
  const models = result.replaceDefaultModels ? { ...patchModels } : { ...existingModels };
  if (!result.replaceDefaultModels)
    for (const [modelRef, modelConfig] of Object.entries(patchModels))
      models[modelRef] = mergeModelConfigEntry(models[modelRef], modelConfig);
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        models,
      },
    },
  };
}
function authProfileDedupeKey(profile) {
  if (profile.credential.accountId)
    return `${profile.credential.provider}:account:${profile.credential.accountId}`;
  if (profile.credential.email)
    return `${profile.credential.provider}:email:${profile.credential.email}`;
  return `${profile.credential.provider}:profile:${profile.sourceProfileId}`;
}
async function readCodexAuthProfilesFromSource(source) {
  const profileHermesCandidates = await readHermesCodexAuthCandidates(source.authPath);
  const globalHermesCandidates = await readHermesCodexAuthCandidates(source.globalAuthPath);
  const profileProvider = profileHermesCandidates.find(
    (candidate) => candidate.sourceSlot === "provider",
  );
  const profilePool = profileHermesCandidates.filter(
    (candidate) => candidate.sourceSlot === "pool",
  );
  const globalProvider = globalHermesCandidates.find(
    (candidate) => candidate.sourceSlot === "provider",
  );
  const globalPool = globalHermesCandidates.filter((candidate) => candidate.sourceSlot === "pool");
  const candidates = [
    ...(profileProvider ? [profileProvider] : globalProvider ? [globalProvider] : []),
    ...(profilePool.length > 0 ? profilePool : globalPool),
    ...(await readOpenCodeOpenAICandidates(source.opencodeAuthPath)),
  ].toSorted((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0));
  const profiles = [];
  const seen = /* @__PURE__ */ new Set();
  for (const [index, candidate] of candidates.entries()) {
    const result = buildAuthResult(
      candidate,
      candidates.length === 1 ? "hermes-import" : `hermes-import-${index + 1}`,
    );
    const profile = result.profiles[0];
    if (!profile || profile.credential.type !== "oauth") continue;
    const entry = {
      candidate,
      credential: profile.credential,
      result,
      sourceProfileId: profile.profileId,
    };
    const dedupeKey = authProfileDedupeKey(entry);
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    profiles.push(entry);
  }
  return profiles;
}
async function readCodexAuthProfilesFromPath(params) {
  if (params.sourceKind === "opencode-auth-json")
    return await readCodexAuthProfilesFromSource({
      root: "",
      archivePaths: [],
      ...(params.sourcePath ? { opencodeAuthPath: params.sourcePath } : {}),
    });
  return await readCodexAuthProfilesFromSource({
    root: "",
    archivePaths: [],
    ...(params.sourcePath ? { authPath: params.sourcePath } : {}),
  });
}
function findMatchingProfile(store, credential) {
  for (const [profileId, existing] of Object.entries(store.profiles)) {
    if (existing.type !== "oauth" || existing.provider !== credential.provider) continue;
    if (credential.accountId && existing.accountId === credential.accountId) return profileId;
    if (
      (!credential.accountId || !existing.accountId) &&
      credential.email &&
      existing.email === credential.email
    )
      return profileId;
  }
}
function oauthAuthProfileConfig(profileId, credential) {
  return {
    profileId,
    provider: credential.provider,
    mode: "oauth",
    ...(credential.email ? { email: credential.email } : {}),
    ...(credential.displayName ? { displayName: credential.displayName } : {}),
  };
}
function matchesSourceCredentialFingerprint(profile, fingerprint) {
  return sourceCredentialFingerprint(profile.candidate) === fingerprint;
}
function findPlannedAuthProfile(params) {
  const bySourceProfileId = params.profiles.find(
    (entry) => entry.sourceProfileId === params.sourceProfileId,
  );
  const fingerprint = params.sourceCredentialFingerprint;
  if (!fingerprint) return bySourceProfileId;
  if (bySourceProfileId && matchesSourceCredentialFingerprint(bySourceProfileId, fingerprint))
    return bySourceProfileId;
  const byIndex =
    params.sourceCredentialIndex === void 0
      ? void 0
      : params.profiles.find(
          (entry) => entry.candidate.sourceCredentialIndex === params.sourceCredentialIndex,
        );
  if (byIndex && matchesSourceCredentialFingerprint(byIndex, fingerprint)) return byIndex;
  return params.profiles.find((entry) => matchesSourceCredentialFingerprint(entry, fingerprint));
}
async function buildAuthItems(params) {
  const items = [];
  items.push(...(await buildReauthenticationItems(params.source)));
  const profiles = await readCodexAuthProfilesFromSource(params.source);
  if (profiles.length === 0) return items;
  const store = loadAuthProfileStoreWithoutExternalProfiles(params.targets.agentDir);
  items.push(
    ...profiles.map((profile) => {
      const matchedProfileId = findMatchingProfile(store, profile.credential);
      const profileId = matchedProfileId ?? profile.sourceProfileId;
      const targetExists = Boolean(store.profiles[profileId]);
      const skipped = !params.ctx.includeSecrets;
      const configConflict = hasAuthProfileConfigConflict(
        params.ctx.config,
        oauthAuthProfileConfig(profileId, profile.credential),
        Boolean(params.ctx.overwrite),
      );
      const conflict =
        ((targetExists && !matchedProfileId && !params.ctx.overwrite) || configConflict) &&
        !skipped;
      return createMigrationItem({
        id:
          profiles.length === 1
            ? `auth:${OPENAI_PROVIDER_ID}`
            : `auth:${OPENAI_PROVIDER_ID}:${profile.sourceProfileId}`,
        kind: "auth",
        action: skipped ? "skip" : "create",
        source: profile.candidate.sourcePath,
        target: authProfileTarget(params.targets.agentDir, profileId),
        status: skipped ? "skipped" : conflict ? "conflict" : "planned",
        sensitive: true,
        reason: skipped
          ? HERMES_REASON_INCLUDE_SECRETS
          : conflict
            ? HERMES_REASON_AUTH_PROFILE_EXISTS
            : void 0,
        message: skipped
          ? `OpenAI OAuth credentials detected in ${profile.candidate.sourceKind === "hermes-auth-json" ? "Hermes" : "OpenCode"}.`
          : "Import OpenAI OAuth credentials and configure OpenAI models.",
        details: {
          provider: OPENAI_PROVIDER_ID,
          profileId,
          ...(typeof profile.candidate.sourceCredentialIndex === "number"
            ? { sourceCredentialIndex: profile.candidate.sourceCredentialIndex }
            : {}),
          sourceCredentialFingerprint: sourceCredentialFingerprint(profile.candidate),
          sourceProfileId: profile.sourceProfileId,
          sourceKind: profile.candidate.sourceKind,
          sourceLabel: profile.candidate.sourceLabel,
        },
      });
    }),
  );
  return items;
}
async function applyAuthItem(ctx, item, targets) {
  if (item.status !== "planned") return item;
  const source = item.source;
  const profileId = typeof item.details?.profileId === "string" ? item.details.profileId : "";
  const sourceProfileId =
    typeof item.details?.sourceProfileId === "string" ? item.details.sourceProfileId : profileId;
  const sourceCredentialIndex =
    typeof item.details?.sourceCredentialIndex === "number"
      ? item.details.sourceCredentialIndex
      : void 0;
  const sourceCredentialFingerprintLocal =
    typeof item.details?.sourceCredentialFingerprint === "string"
      ? item.details.sourceCredentialFingerprint
      : void 0;
  if (!source || !profileId)
    return markMigrationItemError(item, HERMES_REASON_MISSING_SECRET_METADATA);
  const profile = findPlannedAuthProfile({
    profiles: await readCodexAuthProfilesFromPath({
      sourcePath: source,
      sourceKind: item.details?.sourceKind,
    }),
    sourceProfileId,
    ...(sourceCredentialIndex === void 0 ? {} : { sourceCredentialIndex }),
    ...(sourceCredentialFingerprintLocal
      ? { sourceCredentialFingerprint: sourceCredentialFingerprintLocal }
      : {}),
  });
  if (!profile) return markMigrationItemSkipped(item, HERMES_REASON_SECRET_NO_LONGER_PRESENT);
  let conflicted = false;
  let wrote = false;
  const credential = {
    ...profile.credential,
    displayName:
      "displayName" in profile.credential && profile.credential.displayName
        ? profile.credential.displayName
        : HERMES_AUTH_DISPLAY_NAME,
  };
  const configProfile = oauthAuthProfileConfig(profileId, credential);
  if (hasCurrentAuthProfileConfigConflict(ctx, configProfile))
    return markMigrationItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
  const store = await updateAuthProfileStoreWithLock({
    agentDir: targets.agentDir,
    updater: (freshStore) => {
      const existing = freshStore.profiles[profileId];
      if (!ctx.overwrite && existing) {
        if (findMatchingProfile(freshStore, credential) !== profileId) {
          conflicted = true;
          return false;
        }
        return false;
      }
      freshStore.profiles[profileId] = credential;
      wrote = true;
      return true;
    },
  });
  if (conflicted) return markMigrationItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
  if (!store?.profiles[profileId])
    return markMigrationItemError(item, HERMES_REASON_AUTH_PROFILE_WRITE_FAILED);
  const configResult = await applyAuthProfileConfigWithConflictCheck({
    ctx,
    profile: configProfile,
    applyConfigPatch(config) {
      const next = applyOAuthModelConfigsToConfig(config, profile.result);
      return resolveAgentModelPrimaryValue(next.agents?.defaults?.model) === void 0
        ? applyAgentDefaultModelPrimary(next, OPENAI_CODEX_DEFAULT_MODEL)
        : next;
    },
  });
  if (configResult === "conflict")
    return markMigrationItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
  return {
    ...item,
    status: "migrated",
    message:
      configResult === "configured"
        ? item.message
        : `${item.message ?? "Imported auth profile."} ${HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE}.`,
    details: {
      ...item.details,
      wroteAuthProfile: wrote,
      configUpdated: configResult === "configured",
    },
  };
}
//#endregion
export { buildAuthItems as n, applyAuthItem as t };
