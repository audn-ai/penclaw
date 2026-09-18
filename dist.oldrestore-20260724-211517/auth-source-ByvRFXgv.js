import { a as isRecord, c as readString, u as readText } from "./helpers-DtCn6Wrs.js";
import { s as createMigrationManualItem } from "./migration-nGWjmzKy.js";
//#region extensions/migrate-hermes/auth-source.ts
const HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID = "openai-codex";
const HERMES_REAUTH_PROVIDER_MAPPINGS = [
  {
    sourceProvider: "anthropic",
    targetProvider: "anthropic",
  },
  {
    sourceProvider: "nous",
    targetProvider: "nous",
  },
  {
    sourceProvider: "qwen-oauth",
    targetProvider: "qwen-oauth",
  },
  {
    sourceProvider: "minimax-oauth",
    targetProvider: "minimax-portal",
  },
  {
    sourceProvider: "xai-oauth",
    targetProvider: "xai",
  },
];
const HERMES_REAUTH_SOURCE_PROVIDERS = new Set(
  HERMES_REAUTH_PROVIDER_MAPPINGS.map((entry) => entry.sourceProvider),
);
function readTimestamp(value) {
  if (typeof value !== "string" || !value.trim()) return;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function readHermesProviderCandidate(auth, sourcePath) {
  const providers = isRecord(auth.providers) ? auth.providers : {};
  const provider = isRecord(providers[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID])
    ? providers[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID]
    : void 0;
  const tokens = isRecord(provider?.tokens) ? provider.tokens : void 0;
  const access = readString(tokens?.access_token);
  const refresh = readString(tokens?.refresh_token);
  if (!access || !refresh) return;
  return {
    access,
    refresh,
    sourceKind: "hermes-auth-json",
    sourceSlot: "provider",
    sourceLabel: "Hermes active OpenAI Codex provider",
    sourcePath,
    updatedAt: readTimestamp(provider?.last_refresh),
  };
}
function readHermesPoolCandidates(auth, sourcePath) {
  const pool = isRecord(auth.credential_pool) ? auth.credential_pool : {};
  return (
    Array.isArray(pool[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID])
      ? pool[HERMES_OPENAI_CODEX_SOURCE_PROVIDER_ID]
      : []
  ).flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const access = readString(entry.access_token);
    const refresh = readString(entry.refresh_token);
    if (!access || !refresh) return [];
    return [
      {
        access,
        refresh,
        sourceKind: "hermes-auth-json",
        sourceSlot: "pool",
        sourceLabel: readString(entry.label) ?? "Hermes OpenAI Codex credential pool",
        sourcePath,
        updatedAt: readTimestamp(entry.last_refresh) ?? readTimestamp(entry.last_status_at),
      },
    ];
  });
}
async function readHermesCodexAuthCandidates(authPath) {
  const raw = await readText(authPath);
  if (!raw || !authPath) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!isRecord(parsed)) return [];
  const candidates = [
    readHermesProviderCandidate(parsed, authPath),
    ...readHermesPoolCandidates(parsed, authPath),
  ]
    .filter((candidate) => candidate !== void 0)
    .toSorted((left, right) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0));
  candidates.forEach((candidate, index) => {
    candidate.sourceCredentialIndex = index;
  });
  return candidates;
}
async function readHermesOAuthProviderIds(authPath) {
  const raw = await readText(authPath);
  if (!raw) return /* @__PURE__ */ new Set();
  try {
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) return /* @__PURE__ */ new Set();
    const providers = isRecord(parsed.providers)
      ? Object.keys(parsed.providers).filter((provider) =>
          HERMES_REAUTH_SOURCE_PROVIDERS.has(provider),
        )
      : [];
    const pool = isRecord(parsed.credential_pool)
      ? Object.entries(parsed.credential_pool).flatMap(([provider, entries]) =>
          Array.isArray(entries) &&
          entries.some(
            (entry) => isRecord(entry) && readString(entry.auth_type)?.toLowerCase() === "oauth",
          )
            ? [provider]
            : [],
        )
      : [];
    return /* @__PURE__ */ new Set([...providers, ...pool]);
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
async function buildReauthenticationItems(source) {
  const profileProviders = await readHermesOAuthProviderIds(source.authPath);
  const globalProviders = await readHermesOAuthProviderIds(source.globalAuthPath);
  return HERMES_REAUTH_PROVIDER_MAPPINGS.flatMap(({ sourceProvider, targetProvider }) => {
    const sourcePath = profileProviders.has(sourceProvider)
      ? source.authPath
      : globalProviders.has(sourceProvider)
        ? source.globalAuthPath
        : void 0;
    if (!sourcePath) return [];
    return [
      createMigrationManualItem({
        id: `manual:auth-reauthenticate:${targetProvider}`,
        source: sourcePath,
        message: `Hermes ${sourceProvider} credentials cannot be reused safely by OpenClaw.`,
        recommendation: `Authenticate ${targetProvider} in OpenClaw after migration.`,
      }),
    ];
  });
}
//#endregion
export { readHermesCodexAuthCandidates as n, buildReauthenticationItems as t };
