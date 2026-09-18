import {
  n as hasAuthProfileConfigConflict,
  r as hasCurrentAuthProfileConfigConflict,
  t as applyAuthProfileConfigWithConflictCheck,
} from "./auth-config-DKRCa_qN.js";
import { n as collectHermesProviderSecretBindings } from "./config-providers-pyA5lDnw.js";
import "./provider-auth-mypr64nh.js";
import "./agent-runtime-BiQiwmwD.js";
import {
  a as isRecord,
  c as readString,
  f as sanitizeName,
  o as parseEnv,
  u as readText,
} from "./helpers-DtCn6Wrs.js";
import {
  _ as readHermesSecretDetails,
  d as createHermesSecretItem,
  h as hermesItemSkipped,
  l as HERMES_REASON_SECRET_NO_LONGER_PRESENT,
  m as hermesItemError,
  n as HERMES_REASON_AUTH_PROFILE_EXISTS,
  p as hermesItemConflict,
  r as HERMES_REASON_AUTH_PROFILE_WRITE_FAILED,
  s as HERMES_REASON_MISSING_SECRET_METADATA,
} from "./items-BLOMW86Q.js";
import { r as normalizeHermesProviderId } from "./model-CFxX3h6A.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import { t as SECRET_MAPPINGS } from "./secret-mappings-BQkMl4NU.js";
import {
  f as loadAuthProfileStoreWithoutExternalProfiles,
  y as updateAuthProfileStoreWithLock,
} from "./store-B7DoDdVM.js";
//#region extensions/migrate-hermes/secrets.ts
function authProfileTarget(agentDir, profileId) {
  return `${resolveAuthStorePathForDisplay(agentDir)}#${profileId}`;
}
function secretAuthProfileConfig(details) {
  return {
    profileId: details.profileId,
    provider: details.provider,
    mode: details.mode ?? "api_key",
    displayName: "Hermes import",
  };
}
function secretMode(mapping) {
  return mapping.mode ?? "api_key";
}
function buildEnvSecretCandidates(params) {
  const configuredBindings = collectHermesProviderSecretBindings(params.config, params.env);
  const claimedEnvVars = new Set(configuredBindings.map((binding) => binding.envVar));
  const configured = configuredBindings.flatMap((binding) => {
    if (!params.env[binding.envVar]?.trim()) return [];
    return [
      {
        id: `secret:${binding.provider}`,
        source: params.envPath,
        envVar: binding.envVar,
        provider: binding.provider,
        profileId: `${binding.provider}:hermes-import`,
        mode: "api_key",
      },
    ];
  });
  const standard = SECRET_MAPPINGS.flatMap((mapping) => {
    if (claimedEnvVars.has(mapping.envVar)) return [];
    const value = params.env[mapping.envVar]?.trim();
    if (!value) return [];
    const provider =
      mapping.envVar === "KIMI_API_KEY" || mapping.envVar === "KIMI_CODING_API_KEY"
        ? value.startsWith("sk-kimi-")
          ? "kimi"
          : "moonshot"
        : mapping.provider;
    return [
      {
        id: `secret:${provider}`,
        source: params.envPath,
        envVar: mapping.envVar,
        provider,
        profileId: provider === mapping.provider ? mapping.profileId : `${provider}:hermes-import`,
        mode: secretMode(mapping),
      },
    ];
  });
  return [...configured, ...standard];
}
async function readAuthJson(authPath) {
  const raw = await readText(authPath);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
async function buildOpenCodeSecretCandidates(authPath) {
  if (!authPath) return [];
  const auth = await readAuthJson(authPath);
  const opencode = isRecord(auth.opencode) ? auth.opencode : {};
  const opencodeGo = isRecord(auth["opencode-go"]) ? auth["opencode-go"] : {};
  const githubCopilot = isRecord(auth["github-copilot"]) ? auth["github-copilot"] : {};
  const githubCopilotEnterpriseUrl = readString(githubCopilot.enterpriseUrl);
  const candidates = [];
  if (readString(opencode.key))
    candidates.push({
      id: "secret:opencode:opencode-auth-json",
      source: authPath,
      provider: "opencode",
      profileId: "opencode:hermes-import",
      mode: "api_key",
      sourceKind: "opencode-auth-json",
      sourceProvider: "opencode",
      secretField: "key",
    });
  if (readString(opencodeGo.key))
    candidates.push({
      id: "secret:opencode-go:opencode-auth-json",
      source: authPath,
      provider: "opencode-go",
      profileId: "opencode-go:hermes-import",
      mode: "api_key",
      sourceKind: "opencode-auth-json",
      sourceProvider: "opencode-go",
      secretField: "key",
    });
  if (readString(githubCopilot.refresh) && !githubCopilotEnterpriseUrl)
    candidates.push({
      id: "secret:github-copilot:opencode-auth-json",
      source: authPath,
      provider: "github-copilot",
      profileId: "github-copilot:github",
      mode: "token",
      sourceKind: "opencode-auth-json",
      sourceProvider: "github-copilot",
      secretField: "refresh",
    });
  return candidates;
}
function normalizeHermesPoolProvider(provider) {
  return normalizeHermesProviderId(provider);
}
async function buildHermesPoolSecretCandidates(authPath, globalAuthPath) {
  if (!authPath && !globalAuthPath) return [];
  const auth = await readAuthJson(authPath);
  const globalAuth = await readAuthJson(globalAuthPath);
  const pool = isRecord(auth.credential_pool) ? auth.credential_pool : {};
  const globalPool = isRecord(globalAuth.credential_pool) ? globalAuth.credential_pool : {};
  const candidates = [];
  const sourceProviders = /* @__PURE__ */ new Set([
    ...Object.keys(pool),
    ...Object.keys(globalPool),
  ]);
  for (const sourceProvider of [...sourceProviders].toSorted()) {
    const profileEntries = Array.isArray(pool[sourceProvider]) ? pool[sourceProvider] : [];
    const globalEntries = Array.isArray(globalPool[sourceProvider])
      ? globalPool[sourceProvider]
      : [];
    const rawEntries = profileEntries.length > 0 ? profileEntries : globalEntries;
    const sourcePath = profileEntries.length > 0 ? authPath : globalAuthPath;
    if (sourceProvider === "openai-codex" || !sourcePath) continue;
    for (const rawEntry of rawEntries) {
      if (!isRecord(rawEntry)) continue;
      const sourceCredentialId = readString(rawEntry.id);
      const authType = readString(rawEntry.auth_type);
      const source = readString(rawEntry.source);
      if (
        !sourceCredentialId ||
        authType !== "api_key" ||
        source !== "manual" ||
        !readString(rawEntry.access_token)
      )
        continue;
      const provider = normalizeHermesPoolProvider(sourceProvider);
      const profileSuffix = sanitizeName(sourceCredentialId);
      if (!provider || !profileSuffix) continue;
      candidates.push({
        id: `secret:${provider}:hermes-auth-json:${profileSuffix}`,
        source: sourcePath,
        provider,
        profileId: `${provider}:hermes-${profileSuffix}`,
        mode: "api_key",
        sourceKind: "hermes-auth-json",
        sourceProvider,
        sourceCredentialId,
        secretField: "access_token",
      });
    }
  }
  return candidates;
}
async function readSecretCandidateValue(details, source) {
  if (details.sourceKind === "opencode-auth-json") {
    const auth = await readAuthJson(source);
    const sourceProvider = details.sourceProvider;
    const secretField = details.secretField;
    if (!sourceProvider || !secretField) return;
    return readString((isRecord(auth[sourceProvider]) ? auth[sourceProvider] : {})[secretField]);
  }
  if (details.sourceKind === "hermes-auth-json") {
    const auth = await readAuthJson(source);
    const pool = isRecord(auth.credential_pool) ? auth.credential_pool : {};
    const entries = details.sourceProvider ? pool[details.sourceProvider] : void 0;
    if (!Array.isArray(entries) || !details.sourceCredentialId) return;
    const entry = entries.find(
      (candidate) => isRecord(candidate) && candidate.id === details.sourceCredentialId,
    );
    return isRecord(entry) ? readString(entry.access_token) : void 0;
  }
  if (!details.envVar) return;
  return parseEnv(await readText(source))[details.envVar]?.trim() || void 0;
}
async function buildSecretItems(params) {
  const env = parseEnv(await readText(params.source.envPath));
  const store = loadAuthProfileStoreWithoutExternalProfiles(params.targets.agentDir);
  const seenProfiles = /* @__PURE__ */ new Set();
  const items = [];
  const candidates = [
    ...buildEnvSecretCandidates({
      config: params.config,
      env,
      envPath: params.source.envPath,
    }),
    ...(await buildHermesPoolSecretCandidates(
      params.source.authPath,
      params.source.globalAuthPath,
    )),
    ...(await buildOpenCodeSecretCandidates(params.source.opencodeAuthPath)),
  ];
  for (const candidate of candidates) {
    if (seenProfiles.has(candidate.profileId)) continue;
    seenProfiles.add(candidate.profileId);
    const existsAlready = Boolean(store.profiles[candidate.profileId]);
    const configConflict = hasAuthProfileConfigConflict(
      params.ctx.config,
      secretAuthProfileConfig(candidate),
      Boolean(params.ctx.overwrite),
    );
    items.push(
      createHermesSecretItem({
        id: candidate.id,
        source: candidate.source,
        target: authProfileTarget(params.targets.agentDir, candidate.profileId),
        includeSecrets: params.ctx.includeSecrets,
        existsAlready: (existsAlready && !params.ctx.overwrite) || configConflict,
        details: {
          ...(candidate.envVar ? { envVar: candidate.envVar } : {}),
          provider: candidate.provider,
          profileId: candidate.profileId,
          ...(candidate.mode === "token" ? { mode: candidate.mode } : {}),
          ...(candidate.sourceKind ? { sourceKind: candidate.sourceKind } : {}),
          ...(candidate.sourceProvider ? { sourceProvider: candidate.sourceProvider } : {}),
          ...(candidate.sourceCredentialId
            ? { sourceCredentialId: candidate.sourceCredentialId }
            : {}),
          ...(candidate.secretField ? { secretField: candidate.secretField } : {}),
        },
      }),
    );
  }
  return items;
}
async function applySecretItem(ctx, item, targets) {
  if (item.status !== "planned") return item;
  const details = readHermesSecretDetails(item);
  const source = item.source;
  if (!details || !source) return hermesItemError(item, HERMES_REASON_MISSING_SECRET_METADATA);
  const key = await readSecretCandidateValue(details, source);
  if (!key) return hermesItemSkipped(item, HERMES_REASON_SECRET_NO_LONGER_PRESENT);
  const configProfile = secretAuthProfileConfig(details);
  if (hasCurrentAuthProfileConfigConflict(ctx, configProfile))
    return hermesItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
  let conflicted = false;
  let wrote = false;
  const store = await updateAuthProfileStoreWithLock({
    agentDir: targets.agentDir,
    updater: (freshStore) => {
      if (!ctx.overwrite && freshStore.profiles[details.profileId]) {
        conflicted = true;
        return false;
      }
      freshStore.profiles[details.profileId] =
        details.mode === "token"
          ? {
              type: "token",
              provider: details.provider,
              token: key,
              displayName: "Hermes import",
            }
          : {
              type: "api_key",
              provider: details.provider,
              key,
              displayName: "Hermes import",
            };
      wrote = true;
      return true;
    },
  });
  if (conflicted) return hermesItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
  if (!store?.profiles[details.profileId])
    return hermesItemError(item, HERMES_REASON_AUTH_PROFILE_WRITE_FAILED);
  if (!wrote && !ctx.overwrite) return hermesItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
  const configResult = await applyAuthProfileConfigWithConflictCheck({
    ctx,
    profile: configProfile,
  });
  if (configResult === "conflict")
    return hermesItemConflict(item, HERMES_REASON_AUTH_PROFILE_EXISTS);
  return {
    ...item,
    status: "migrated",
    details: {
      ...item.details,
      configUpdated: configResult === "configured",
    },
  };
}
//#endregion
export { buildSecretItems as n, applySecretItem as t };
