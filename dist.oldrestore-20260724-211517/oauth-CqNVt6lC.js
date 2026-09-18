import { a as refreshChutesTokens } from "./chutes-oauth-D8-7RZkg.js";
import {
  a as resolveTokenExpiryState,
  n as evaluateStoredCredentialEligibility,
} from "./credential-state-DvOWxJSx.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { i as readExternalCliBootstrapCredential } from "./external-auth-aN0UYCd0.js";
import "./number-coercion-EqFmHmOw.js";
import { o as withFileLock } from "./file-lock-C2Kr7iLJ.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { r as getOAuthProviders, t as getOAuthApiKey } from "./oauth-C291iY27.js";
import { t as OAuthRefreshFailureError } from "./oauth-refresh-failure-CHdq_iT5.js";
import "./file-lock-CsC2zkbH.js";
import "./config-BDv-QbJ6.js";
import {
  o as resolveOAuthRefreshLockPath,
  r as resolveAuthStorePath,
} from "./path-resolve-8wkj2l4Z.js";
import {
  A as OAUTH_REFRESH_CALL_TIMEOUT_MS,
  C as shouldReplaceStoredOAuthCredential,
  N as log,
  T as shouldMirrorRefreshedOAuthCredential,
  _ as hasUsableOAuthCredential,
  g as hasMatchingOAuthIdentity,
  h as areOAuthCredentialsEquivalent,
  j as OAUTH_REFRESH_LOCK_OPTIONS,
  v as isSafeToAdoptBootstrapOAuthIdentity,
  x as shouldBootstrapFromExternalCliCredential,
  y as isSafeToAdoptMainStoreOAuthIdentity,
} from "./persisted-B2tK2f7d.js";
import { t as assertNoOAuthSecretRefPolicyViolations } from "./policy-DIsxN353.js";
import { t as clearLastGoodProfileWithLock } from "./profiles-DxTOoenK.js";
import { r as resolveProviderIdForAuth } from "./provider-auth-aliases-RaEzqkSo.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import {
  a as refreshProviderOAuthCredentialWithPlugin,
  n as buildProviderAuthDoctorHintWithPlugin,
  r as formatProviderAuthProfileApiKeyWithPlugin,
} from "./provider-runtime.runtime.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import { n as suggestOAuthProfileIdForLegacyDefault } from "./repair-bhv6VYT3.js";
import { n as resolveSecretRefString } from "./resolve-Dvpn9c2h.js";
import {
  m as setRuntimeAuthProfileStoreSnapshot,
  o as getRuntimeAuthProfileStoreSnapshot,
  u as hasRuntimeAuthProfileStoreSnapshot,
} from "./runtime-snapshots-BU3oOWrH.js";
import {
  d as loadAuthProfileStoreForSecretsRuntime,
  f as loadAuthProfileStoreWithoutExternalProfiles,
  m as resolvePersistedAuthProfileOwnerAgentDir,
  o as ensureAuthProfileStoreWithoutExternalProfiles,
  y as updateAuthProfileStoreWithLock,
} from "./store-B7DoDdVM.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { p as normalizeSecretInputString, s as coerceSecretRef } from "./types.secrets-BV0ywRAy.js";
//#region src/agents/auth-profiles/doctor.ts
/**
 * Provider-specific auth doctor hints.
 * Adds local migration guidance for known legacy profiles before falling back
 * to provider plugin doctor copy.
 */
const QWEN_PORTAL_OAUTH_MIGRATION_HINT =
  "Legacy Qwen Portal OAuth profiles are not refreshable. Re-authenticate with a current portal token: openclaw onboard --auth-choice qwen-oauth.";
function hasLegacyQwenPortalOAuthProfile(store, profileId) {
  return (profileId ? [store.profiles[profileId]] : Object.values(store.profiles)).some(
    (profile) =>
      profile?.type === "oauth" && normalizeProviderId(profile.provider) === "qwen-portal",
  );
}
async function formatAuthDoctorHintWithPluginBuilder(params, buildPluginHint) {
  const normalizedProvider = normalizeProviderId(params.provider);
  if (
    normalizedProvider === "qwen-portal" &&
    hasLegacyQwenPortalOAuthProfile(params.store, params.profileId)
  )
    return QWEN_PORTAL_OAUTH_MIGRATION_HINT;
  const pluginHint = await buildPluginHint({
    provider: normalizedProvider,
    context: {
      config: params.cfg,
      store: params.store,
      provider: normalizedProvider,
      profileId: params.profileId,
    },
  });
  if (typeof pluginHint === "string" && pluginHint.trim()) return pluginHint;
  return "";
}
/** Formats provider-specific auth doctor guidance for a profile/store. */
async function formatAuthDoctorHint(params) {
  return await formatAuthDoctorHintWithPluginBuilder(params, buildProviderAuthDoctorHintWithPlugin);
}
//#endregion
//#region src/agents/auth-profiles/oauth-refresh-lock-errors.ts
/**
 * OAuth refresh lock error helpers.
 * Distinguishes global refresh-lock contention from auth-store lock timeouts
 * and builds the user-facing contention error.
 */
/** Returns true when an error came from the global OAuth refresh lock. */
function isGlobalRefreshLockTimeoutError(error, lockPath) {
  const candidate = typeof error === "object" && error !== null ? error : void 0;
  return candidate?.code === "file_lock_timeout" && candidate.lockPath === `${lockPath}.lock`;
}
/** Builds the user-facing OAuth refresh contention error. */
function buildRefreshContentionError(params) {
  return Object.assign(
    new Error(
      `OAuth refresh failed (refresh_contention): another process is already refreshing ${params.provider} for ${params.profileId}. Please wait for the in-flight refresh to finish and retry.`,
      { cause: params.cause },
    ),
    {
      code: "refresh_contention",
      cause: params.cause,
    },
  );
}
//#endregion
//#region src/agents/auth-profiles/oauth-manager.ts
/** Refresh failure that preserves a redacted refreshed store and credential. */
var OAuthManagerRefreshError = class extends OAuthRefreshFailureError {
  #refreshedStore;
  #credential;
  constructor(params) {
    const structuredCause =
      typeof params.cause === "object" && params.cause !== null ? params.cause : void 0;
    const surfacedCause =
      structuredCause?.code === "refresh_contention" && params.cause instanceof Error
        ? new Error(params.cause.message)
        : params.cause;
    const storedCredential = params.refreshedStore.profiles[params.profileId];
    const secrets = collectOAuthCredentialSecrets(
      params.credential,
      ...(params.attemptedCredentials ?? []),
      storedCredential?.type === "oauth" ? storedCredential : void 0,
    );
    const causeMessage = formatRedactedOAuthRefreshError(surfacedCause, secrets);
    super({
      provider: params.credential.provider,
      profileId: params.profileId,
      message: `OAuth token refresh failed for ${params.credential.provider}: ${causeMessage}`,
      cause: createRedactedOAuthRefreshCause(surfacedCause, secrets),
    });
    this.name = "OAuthManagerRefreshError";
    this.#credential = params.credential;
    this.profileId = params.profileId;
    this.#refreshedStore = params.refreshedStore;
    if (structuredCause) {
      this.code = typeof structuredCause.code === "string" ? structuredCause.code : void 0;
      if (typeof structuredCause.lockPath === "string") this.lockPath = structuredCause.lockPath;
      else if (
        typeof structuredCause.cause === "object" &&
        structuredCause.cause !== null &&
        "lockPath" in structuredCause.cause &&
        typeof structuredCause.cause.lockPath === "string"
      )
        this.lockPath = structuredCause.cause.lockPath;
    }
  }
  getRefreshedStore() {
    return this.#refreshedStore;
  }
  getCredential() {
    return this.#credential;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      profileId: this.profileId,
      provider: this.provider,
    };
  }
};
function hasOAuthCredentialChanged(previous, current) {
  return (
    previous.access !== current.access ||
    previous.refresh !== current.refresh ||
    previous.expires !== current.expires
  );
}
function canReuseOAuthCredentialAfterRefreshFailure(params) {
  return !params.forceRefresh || hasOAuthCredentialChanged(params.attempted, params.candidate);
}
function collectOAuthCredentialSecrets(...credentials) {
  const secrets = /* @__PURE__ */ new Set();
  for (const credential of credentials)
    for (const secret of [credential?.access, credential?.refresh, credential?.idToken])
      if (secret) secrets.add(secret);
  return Array.from(secrets).toSorted((a, b) => b.length - a.length);
}
function redactOAuthCredentialSecrets(message, secrets) {
  let redacted = message;
  for (const secret of secrets) redacted = redacted.split(secret).join("[redacted]");
  return redacted;
}
function formatRawErrorMessage(error) {
  if (error instanceof Error) {
    let formatted = error.message || error.name || "Error";
    let cause = error.cause;
    const seen = /* @__PURE__ */ new Set([error]);
    while (cause && !seen.has(cause)) {
      seen.add(cause);
      if (cause instanceof Error) {
        if (cause.message) formatted += ` | ${cause.message}`;
        cause = cause.cause;
      } else if (typeof cause === "string") {
        formatted += ` | ${cause}`;
        break;
      } else break;
    }
    return formatted;
  }
  if (
    typeof error === "string" ||
    typeof error === "number" ||
    typeof error === "boolean" ||
    typeof error === "bigint"
  )
    return String(error);
  try {
    return JSON.stringify(error) ?? String(error);
  } catch {
    return Object.prototype.toString.call(error);
  }
}
function formatRedactedOAuthRefreshError(error, secrets) {
  return redactSensitiveText(redactOAuthCredentialSecrets(formatRawErrorMessage(error), secrets));
}
function createRedactedOAuthRefreshCause(cause, secrets) {
  const redacted = formatRedactedOAuthRefreshError(cause, secrets);
  const sanitized = new Error(redacted);
  if (cause instanceof Error && cause.name) sanitized.name = cause.name;
  return sanitized;
}
function loadStoredOAuthRefreshStore(agentDir) {
  return loadAuthProfileStoreWithoutExternalProfiles(agentDir, { allowKeychainPrompt: true });
}
async function loadFreshStoredOAuthCredential(params) {
  const reloaded = loadStoredOAuthRefreshStore(params.agentDir).profiles[params.profileId];
  if (
    reloaded?.type !== "oauth" ||
    reloaded.provider !== params.provider ||
    !hasUsableOAuthCredential(reloaded)
  )
    return null;
  if (
    params.requireChange &&
    params.previous &&
    !hasOAuthCredentialChanged(params.previous, reloaded)
  )
    return null;
  return reloaded;
}
/** Select local OAuth unless a safe external bootstrap credential should win. */
function resolveEffectiveOAuthCredential(params) {
  const imported = params.readBootstrapCredential({
    store: params.store,
    profileId: params.profileId,
    credential: params.credential,
  });
  if (!imported) return params.credential;
  if (hasUsableOAuthCredential(params.credential)) {
    log.debug("resolved oauth credential from canonical local store", {
      profileId: params.profileId,
      provider: params.credential.provider,
      localExpires: params.credential.expires,
      externalExpires: imported.expires,
    });
    return params.credential;
  }
  if (!isSafeToAdoptBootstrapOAuthIdentity(params.credential, imported)) {
    log.warn("refused external oauth bootstrap credential: identity mismatch or missing binding", {
      profileId: params.profileId,
      provider: params.credential.provider,
    });
    return params.credential;
  }
  if (
    shouldBootstrapFromExternalCliCredential({
      existing: params.credential,
      imported,
    })
  ) {
    log.debug("resolved oauth credential from external cli bootstrap", {
      profileId: params.profileId,
      provider: imported.provider,
      localExpires: params.credential.expires,
      externalExpires: imported.expires,
    });
    return imported;
  }
  return params.credential;
}
/** Create an OAuth manager bound to provider-specific build/refresh adapters. */
function createOAuthManager(adapter) {
  function adoptNewerMainOAuthCredential(params) {
    if (!params.agentDir) return null;
    try {
      const mainCred = ensureAuthProfileStoreWithoutExternalProfiles(void 0, {
        allowKeychainPrompt: false,
      }).profiles[params.profileId];
      if (mainCred?.type !== "oauth") return null;
      const mainExpires = asDateTimestampMs(mainCred.expires);
      const localExpires = asDateTimestampMs(params.credential.expires);
      if (
        mainCred.provider === params.credential.provider &&
        hasUsableOAuthCredential(mainCred) &&
        mainExpires !== void 0 &&
        (localExpires === void 0 || mainExpires > localExpires) &&
        isSafeToAdoptMainStoreOAuthIdentity(params.credential, mainCred)
      ) {
        params.store.profiles[params.profileId] = { ...mainCred };
        log.info("adopted newer OAuth credentials from main agent", {
          profileId: params.profileId,
          agentDir: params.agentDir,
          expires: new Date(mainCred.expires).toISOString(),
        });
        return mainCred;
      }
    } catch (err) {
      log.debug("adoptNewerMainOAuthCredential failed", {
        profileId: params.profileId,
        error: formatErrorMessage(err),
      });
    }
    return null;
  }
  let refreshQueue = new KeyedAsyncQueue();
  function refreshQueueKey(provider, profileId) {
    return `${provider}\u0000${profileId}`;
  }
  async function withRefreshCallTimeout(label, timeoutMs, fn) {
    let timeoutHandle;
    try {
      return await new Promise((resolve, reject) => {
        timeoutHandle = setTimeout(() => {
          reject(
            /* @__PURE__ */ new Error(
              `OAuth refresh call "${label}" exceeded hard timeout (${timeoutMs}ms)`,
            ),
          );
        }, timeoutMs);
        fn().then(resolve, reject);
      });
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }
  }
  async function mirrorRefreshedCredentialIntoMainStore(params) {
    try {
      await updateAuthProfileStoreWithLock({
        agentDir: void 0,
        updater: (store) => {
          const existing = store.profiles[params.profileId];
          const decision = shouldMirrorRefreshedOAuthCredential({
            existing,
            refreshed: params.refreshed,
          });
          if (!decision.shouldMirror) {
            if (decision.reason === "identity-mismatch-or-regression")
              log.warn("refused to mirror OAuth credential: identity mismatch or regression", {
                profileId: params.profileId,
              });
            return false;
          }
          store.profiles[params.profileId] = { ...params.refreshed };
          log.debug("mirrored refreshed OAuth credential to main agent store", {
            profileId: params.profileId,
            expires: Number.isFinite(params.refreshed.expires)
              ? new Date(params.refreshed.expires).toISOString()
              : void 0,
          });
          return true;
        },
      });
    } catch (err) {
      log.debug("mirrorRefreshedCredentialIntoMainStore failed", {
        profileId: params.profileId,
        error: formatErrorMessage(err),
      });
    }
  }
  async function saveOAuthCredentialWithStoreLock(params) {
    let saved = false;
    return (
      (await updateAuthProfileStoreWithLock({
        agentDir: params.agentDir,
        updater: (store) => {
          const existing = store.profiles[params.profileId];
          const expectedCredentials = Array.isArray(params.expected)
            ? params.expected
            : [params.expected];
          if (
            existing?.type !== "oauth" ||
            !expectedCredentials.some((expected) =>
              areOAuthCredentialsEquivalent(existing, expected),
            )
          ) {
            log.debug("skipped OAuth credential write because stored profile changed", {
              profileId: params.profileId,
            });
            return false;
          }
          if (
            !isSafeToAdoptBootstrapOAuthIdentity(existing, params.credential) ||
            !shouldReplaceStoredOAuthCredential(existing, params.credential)
          ) {
            log.debug("skipped OAuth credential write because stored profile changed", {
              profileId: params.profileId,
            });
            return false;
          }
          store.profiles[params.profileId] = { ...params.credential };
          saved = true;
          return true;
        },
      })) !== null && saved
    );
  }
  async function resolveOAuthCredentialAfterPersistMiss(params) {
    let adopted = null;
    return (await updateAuthProfileStoreWithLock({
      agentDir: params.agentDir,
      updater: (store) => {
        const existing = store.profiles[params.profileId];
        if (existing?.type !== "oauth" || existing.provider !== params.refreshed.provider)
          return false;
        if (hasMatchingOAuthIdentity(existing, params.refreshed)) {
          store.profiles[params.profileId] = { ...params.refreshed };
          adopted = params.refreshed;
          return true;
        }
        adopted = hasUsableOAuthCredential(existing) ? existing : null;
        return false;
      },
    })) === null
      ? null
      : adopted;
  }
  async function doRefreshOAuthTokenWithLock(params) {
    const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir(params);
    const authPath = resolveAuthStorePath(ownerAgentDir);
    const globalRefreshLockPath = resolveOAuthRefreshLockPath(params.provider, params.profileId);
    try {
      return await withFileLock(globalRefreshLockPath, OAUTH_REFRESH_LOCK_OPTIONS, async () => {
        const store = loadStoredOAuthRefreshStore(ownerAgentDir);
        const cred = store.profiles[params.profileId];
        if (!cred || cred.type !== "oauth") return null;
        let credentialToRefresh = cred;
        if (!params.forceRefresh && hasUsableOAuthCredential(cred))
          return {
            apiKey: await adapter.buildApiKey(cred.provider, cred, {
              cfg: params.cfg,
              agentDir: params.agentDir,
            }),
            credential: cred,
          };
        if (params.agentDir)
          try {
            const mainCred = loadStoredOAuthRefreshStore(void 0).profiles[params.profileId];
            if (
              mainCred?.type === "oauth" &&
              mainCred.provider === cred.provider &&
              hasUsableOAuthCredential(mainCred) &&
              !params.forceRefresh &&
              isSafeToAdoptMainStoreOAuthIdentity(cred, mainCred)
            ) {
              store.profiles[params.profileId] = { ...mainCred };
              log.info("adopted fresh OAuth credential from main store (under refresh lock)", {
                profileId: params.profileId,
                agentDir: params.agentDir,
                expires: new Date(mainCred.expires).toISOString(),
              });
              return {
                apiKey: await adapter.buildApiKey(mainCred.provider, mainCred, {
                  cfg: params.cfg,
                  agentDir: params.agentDir,
                }),
                credential: mainCred,
              };
            } else if (
              mainCred?.type === "oauth" &&
              mainCred.provider === cred.provider &&
              hasUsableOAuthCredential(mainCred) &&
              !isSafeToAdoptMainStoreOAuthIdentity(cred, mainCred)
            )
              log.warn("refused to adopt fresh main-store OAuth credential: identity mismatch", {
                profileId: params.profileId,
                agentDir: params.agentDir,
              });
          } catch (err) {
            log.debug("inside-lock main-store adoption failed; proceeding to refresh", {
              profileId: params.profileId,
              error: formatErrorMessage(err),
            });
          }
        const externallyManaged = adapter.readBootstrapCredential({
          store,
          profileId: params.profileId,
          credential: cred,
        });
        if (externallyManaged)
          if (externallyManaged.provider !== cred.provider)
            log.warn("refused external oauth bootstrap credential: provider mismatch", {
              profileId: params.profileId,
              provider: cred.provider,
            });
          else if (!isSafeToAdoptBootstrapOAuthIdentity(cred, externallyManaged))
            log.warn(
              "refused external oauth bootstrap credential: identity mismatch or missing binding",
              {
                profileId: params.profileId,
                provider: cred.provider,
              },
            );
          else {
            if (
              shouldReplaceStoredOAuthCredential(cred, externallyManaged) &&
              !areOAuthCredentialsEquivalent(cred, externallyManaged)
            ) {
              store.profiles[params.profileId] = { ...externallyManaged };
              await saveOAuthCredentialWithStoreLock({
                agentDir: ownerAgentDir,
                profileId: params.profileId,
                expected: cred,
                credential: externallyManaged,
              });
            }
            credentialToRefresh = externallyManaged;
            if (!params.forceRefresh && hasUsableOAuthCredential(externallyManaged))
              return {
                apiKey: await adapter.buildApiKey(externallyManaged.provider, externallyManaged, {
                  cfg: params.cfg,
                  agentDir: params.agentDir,
                }),
                credential: externallyManaged,
              };
          }
        if (normalizeSecretInputString(credentialToRefresh.refresh) === void 0) return null;
        const refreshedCredentials = await withRefreshCallTimeout(
          `refreshOAuthCredential(${cred.provider})`,
          OAUTH_REFRESH_CALL_TIMEOUT_MS,
          async () => {
            params.attemptedCredentials?.push(credentialToRefresh);
            const refreshed = await adapter.refreshCredential(credentialToRefresh);
            return refreshed
              ? {
                  ...credentialToRefresh,
                  ...refreshed,
                  type: "oauth",
                }
              : null;
          },
        );
        if (!refreshedCredentials) return null;
        store.profiles[params.profileId] = refreshedCredentials;
        if (
          !(await saveOAuthCredentialWithStoreLock({
            agentDir: ownerAgentDir,
            profileId: params.profileId,
            expected:
              credentialToRefresh === cred ||
              areOAuthCredentialsEquivalent(credentialToRefresh, cred)
                ? credentialToRefresh
                : [credentialToRefresh, cred],
            credential: refreshedCredentials,
          }))
        ) {
          const recovered = await resolveOAuthCredentialAfterPersistMiss({
            agentDir: ownerAgentDir,
            profileId: params.profileId,
            refreshed: refreshedCredentials,
          });
          if (!recovered) throw new Error("Failed to persist refreshed OAuth credential");
          if (recovered !== refreshedCredentials)
            return {
              apiKey: await adapter.buildApiKey(recovered.provider, recovered, {
                cfg: params.cfg,
                agentDir: params.agentDir,
              }),
              credential: recovered,
            };
        }
        if (ownerAgentDir) {
          if (resolveAuthStorePath(void 0) !== authPath)
            await mirrorRefreshedCredentialIntoMainStore({
              profileId: params.profileId,
              refreshed: refreshedCredentials,
            });
        }
        return {
          apiKey: await adapter.buildApiKey(cred.provider, refreshedCredentials, {
            cfg: params.cfg,
            agentDir: params.agentDir,
          }),
          credential: refreshedCredentials,
        };
      });
    } catch (error) {
      if (isGlobalRefreshLockTimeoutError(error, globalRefreshLockPath))
        throw buildRefreshContentionError({
          provider: params.provider,
          profileId: params.profileId,
          cause: error,
        });
      throw error;
    }
  }
  async function refreshOAuthTokenWithLock(params) {
    const key = refreshQueueKey(params.provider, params.profileId);
    return await refreshQueue.enqueue(key, () => doRefreshOAuthTokenWithLock(params));
  }
  async function resolveOAuthAccess(params) {
    const adoptedCredential =
      adoptNewerMainOAuthCredential({
        store: params.store,
        profileId: params.profileId,
        agentDir: params.agentDir,
        credential: params.credential,
      }) ?? params.credential;
    const effectiveCredential = resolveEffectiveOAuthCredential({
      store: params.store,
      profileId: params.profileId,
      credential: adoptedCredential,
      readBootstrapCredential: adapter.readBootstrapCredential,
    });
    const attemptedCredentials = [];
    if (!params.forceRefresh && hasUsableOAuthCredential(effectiveCredential))
      return {
        apiKey: await adapter.buildApiKey(effectiveCredential.provider, effectiveCredential, {
          cfg: params.cfg,
          agentDir: params.agentDir,
        }),
        credential: effectiveCredential,
      };
    try {
      return await refreshOAuthTokenWithLock({
        profileId: params.profileId,
        provider: params.credential.provider,
        agentDir: params.agentDir,
        cfg: params.cfg,
        forceRefresh: params.forceRefresh,
        attemptedCredentials,
      });
    } catch (error) {
      const refreshedStore = loadStoredOAuthRefreshStore(params.agentDir);
      const refreshed = refreshedStore.profiles[params.profileId];
      if (
        refreshed?.type === "oauth" &&
        hasUsableOAuthCredential(refreshed) &&
        canReuseOAuthCredentialAfterRefreshFailure({
          forceRefresh: params.forceRefresh,
          attempted: effectiveCredential,
          candidate: refreshed,
        })
      )
        return {
          apiKey: await adapter.buildApiKey(refreshed.provider, refreshed, {
            cfg: params.cfg,
            agentDir: params.agentDir,
          }),
          credential: refreshed,
        };
      if (
        adapter.isRefreshTokenReusedError(error) &&
        refreshed?.type === "oauth" &&
        refreshed.provider === params.credential.provider &&
        hasOAuthCredentialChanged(params.credential, refreshed)
      ) {
        const recovered = await loadFreshStoredOAuthCredential({
          profileId: params.profileId,
          agentDir: params.agentDir,
          provider: params.credential.provider,
          previous: effectiveCredential,
          requireChange: true,
        });
        if (recovered)
          return {
            apiKey: await adapter.buildApiKey(recovered.provider, recovered, {
              cfg: params.cfg,
              agentDir: params.agentDir,
            }),
            credential: recovered,
          };
        try {
          const retried = await refreshOAuthTokenWithLock({
            profileId: params.profileId,
            provider: params.credential.provider,
            agentDir: params.agentDir,
            cfg: params.cfg,
            forceRefresh: params.forceRefresh,
            attemptedCredentials,
          });
          if (retried) return retried;
        } catch {}
      }
      if (params.agentDir)
        try {
          const mainCred = ensureAuthProfileStoreWithoutExternalProfiles(void 0, {
            allowKeychainPrompt: false,
          }).profiles[params.profileId];
          if (
            mainCred?.type === "oauth" &&
            mainCred.provider === params.credential.provider &&
            hasUsableOAuthCredential(mainCred) &&
            canReuseOAuthCredentialAfterRefreshFailure({
              forceRefresh: params.forceRefresh,
              attempted: effectiveCredential,
              candidate: mainCred,
            }) &&
            isSafeToAdoptMainStoreOAuthIdentity(params.credential, mainCred)
          ) {
            refreshedStore.profiles[params.profileId] = { ...mainCred };
            log.info("inherited fresh OAuth credentials from main agent", {
              profileId: params.profileId,
              agentDir: params.agentDir,
              expires: new Date(mainCred.expires).toISOString(),
            });
            return {
              apiKey: await adapter.buildApiKey(mainCred.provider, mainCred, {
                cfg: params.cfg,
                agentDir: params.agentDir,
              }),
              credential: mainCred,
            };
          }
        } catch {}
      throw new OAuthManagerRefreshError({
        credential: params.credential,
        attemptedCredentials: [effectiveCredential, ...attemptedCredentials],
        profileId: params.profileId,
        refreshedStore,
        cause: error,
      });
    }
  }
  function resetRefreshQueuesForTest() {
    refreshQueue = new KeyedAsyncQueue();
  }
  return {
    resolveOAuthAccess,
    resetRefreshQueuesForTest,
  };
}
//#endregion
//#region src/agents/auth-profiles/oauth.ts
/**
 * Auth profile API-key/OAuth runtime resolver.
 * Converts selected auth profiles into provider API keys, refreshes OAuth
 * credentials, resolves SecretRefs, and maintains runtime store snapshots.
 */
function listOAuthProviderIds() {
  if (typeof getOAuthProviders !== "function") return [];
  const providers = getOAuthProviders();
  if (!Array.isArray(providers)) return [];
  return providers
    .map((provider) =>
      provider &&
      typeof provider === "object" &&
      "id" in provider &&
      typeof provider.id === "string"
        ? provider.id
        : void 0,
    )
    .filter((providerId) => typeof providerId === "string");
}
const OAUTH_PROVIDER_IDS = new Set(listOAuthProviderIds());
const isOAuthProvider = (provider) => OAUTH_PROVIDER_IDS.has(provider);
const resolveOAuthProvider = (provider) => (isOAuthProvider(provider) ? provider : null);
/** Bearer-token auth modes that are interchangeable (oauth tokens and raw tokens). */
const BEARER_AUTH_MODES = /* @__PURE__ */ new Set(["oauth", "token"]);
const isCompatibleModeType = (mode, type) => {
  if (!mode || !type) return false;
  if (mode === type) return true;
  return BEARER_AUTH_MODES.has(mode) && BEARER_AUTH_MODES.has(type);
};
function isProfileConfigCompatible(params) {
  const profileConfig = params.cfg?.auth?.profiles?.[params.profileId];
  if (profileConfig && profileConfig.provider !== params.provider) return false;
  if (profileConfig && !isCompatibleModeType(profileConfig.mode, params.mode)) return false;
  return true;
}
async function buildOAuthApiKey(provider, credentials, context) {
  const formatted = await formatProviderAuthProfileApiKeyWithPlugin({
    provider,
    config: context.cfg,
    context: credentials,
  });
  return typeof formatted === "string" && formatted.length > 0 ? formatted : credentials.access;
}
function buildApiKeyProfileResult(params) {
  const result = {
    apiKey: params.apiKey,
    provider: params.provider,
    email: params.email,
  };
  Object.defineProperties(result, {
    profileId: {
      value: params.profileId,
      enumerable: false,
    },
    profileType: {
      value: params.profileType,
      enumerable: false,
    },
    credential: {
      value: params.credential,
      enumerable: false,
    },
  });
  return result;
}
function extractErrorMessage(error) {
  return formatErrorMessage(error);
}
/** Detect provider errors caused by single-use OAuth refresh token races. */
function isRefreshTokenReusedError(error) {
  const message = normalizeLowercaseStringOrEmpty(extractErrorMessage(error));
  return (
    message.includes("refresh_token_reused") ||
    message.includes("refresh token has already been used") ||
    message.includes("already been used to generate a new access token")
  );
}
async function refreshOAuthCredential(credential) {
  const pluginRefreshed = await refreshProviderOAuthCredentialWithPlugin({
    provider: credential.provider,
    context: credential,
  });
  if (pluginRefreshed) return pluginRefreshed;
  if (credential.provider === "chutes") return await refreshChutesTokens({ credential });
  const oauthProvider = resolveOAuthProvider(credential.provider);
  if (!oauthProvider || typeof getOAuthApiKey !== "function") return null;
  return (
    (await getOAuthApiKey(oauthProvider, { [credential.provider]: credential }))?.newCredentials ??
    null
  );
}
/** Refresh one OAuth credential and merge provider-returned token fields. */
async function refreshOAuthCredentialForRuntime(params) {
  const refreshed = await refreshOAuthCredential(params.credential);
  return refreshed
    ? {
        ...params.credential,
        ...refreshed,
        type: "oauth",
      }
    : null;
}
const oauthManager = createOAuthManager({
  buildApiKey: buildOAuthApiKey,
  refreshCredential: refreshOAuthCredential,
  readBootstrapCredential: ({ store, profileId, credential }) =>
    readExternalCliBootstrapCredential({
      store,
      profileId,
      credential,
    }),
  isRefreshTokenReusedError,
});
async function tryResolveOAuthProfile(params) {
  const { cfg, store, profileId } = params;
  const cred = store.profiles[profileId];
  if (!cred || cred.type !== "oauth") return null;
  if (
    !isProfileConfigCompatible({
      cfg,
      profileId,
      provider: cred.provider,
      mode: cred.type,
    })
  )
    return null;
  const resolved = await oauthManager.resolveOAuthAccess({
    store,
    profileId,
    credential: cred,
    agentDir: params.agentDir,
    cfg,
    forceRefresh: params.forceRefresh,
  });
  if (!resolved) return null;
  return buildApiKeyProfileResult({
    apiKey: resolved.apiKey,
    provider: resolved.credential.provider,
    email: resolved.credential.email ?? cred.email,
    profileId,
    profileType: cred.type,
    credential: resolved.credential,
  });
}
async function resolveProfileSecretString(params) {
  let resolvedValue = params.value?.trim();
  if (resolvedValue) {
    const inlineRef = coerceSecretRef(resolvedValue, params.refDefaults);
    if (inlineRef)
      try {
        resolvedValue = await resolveSecretRefString(inlineRef, {
          config: params.configForRefResolution,
          env: process.env,
          cache: params.cache,
        });
      } catch (err) {
        log.debug(params.inlineFailureMessage, {
          profileId: params.profileId,
          provider: params.provider,
          error: formatErrorMessage(err),
        });
      }
  }
  const explicitRef = coerceSecretRef(params.valueRef, params.refDefaults);
  if (!resolvedValue && explicitRef)
    try {
      resolvedValue = await resolveSecretRefString(explicitRef, {
        config: params.configForRefResolution,
        env: process.env,
        cache: params.cache,
      });
    } catch (err) {
      log.debug(params.refFailureMessage, {
        profileId: params.profileId,
        provider: params.provider,
        error: formatErrorMessage(err),
      });
    }
  return normalizeOptionalSecretInput(resolvedValue);
}
/** Resolve a selected auth profile into the provider API key string. */
async function resolveApiKeyForProfile(params) {
  const { cfg, store, profileId } = params;
  const cred = store.profiles[profileId];
  if (!cred) return null;
  if (
    !isProfileConfigCompatible({
      cfg,
      profileId,
      provider: cred.provider,
      mode: cred.type,
      allowOAuthTokenCompatibility: true,
    })
  )
    return null;
  const refResolveCache = {};
  const configForRefResolution = cfg ?? getRuntimeConfig();
  const refDefaults = configForRefResolution.secrets?.defaults;
  assertNoOAuthSecretRefPolicyViolations({
    store,
    cfg: configForRefResolution,
    profileIds: [profileId],
    context: `auth profile ${profileId}`,
  });
  if (cred.type === "api_key") {
    if (!evaluateStoredCredentialEligibility({ credential: cred }).eligible) return null;
    const key = await resolveProfileSecretString({
      profileId,
      provider: cred.provider,
      value: cred.key,
      valueRef: cred.keyRef,
      refDefaults,
      configForRefResolution,
      cache: refResolveCache,
      inlineFailureMessage: "failed to resolve inline auth profile api_key ref",
      refFailureMessage: "failed to resolve auth profile api_key ref",
    });
    if (!key) return null;
    return buildApiKeyProfileResult({
      apiKey: key,
      provider: cred.provider,
      email: cred.email,
      profileId,
      profileType: cred.type,
    });
  }
  if (cred.type === "token") {
    const expiryState = resolveTokenExpiryState(cred.expires);
    if (expiryState === "expired" || expiryState === "invalid_expires") return null;
    const token = await resolveProfileSecretString({
      profileId,
      provider: cred.provider,
      value: cred.token,
      valueRef: cred.tokenRef,
      refDefaults,
      configForRefResolution,
      cache: refResolveCache,
      inlineFailureMessage: "failed to resolve inline auth profile token ref",
      refFailureMessage: "failed to resolve auth profile token ref",
    });
    if (!token) return null;
    return buildApiKeyProfileResult({
      apiKey: token,
      provider: cred.provider,
      email: cred.email,
      profileId,
      profileType: cred.type,
    });
  }
  try {
    const resolved = await oauthManager.resolveOAuthAccess({
      store,
      agentDir: params.agentDir,
      profileId,
      credential: cred,
      cfg,
      forceRefresh: params.forceRefresh,
    });
    if (!resolved) return null;
    return buildApiKeyProfileResult({
      apiKey: resolved.apiKey,
      provider: resolved.credential.provider,
      email: resolved.credential.email ?? cred.email,
      profileId,
      profileType: cred.type,
      credential: resolved.credential,
    });
  } catch (error) {
    let refreshedStore =
      error instanceof OAuthManagerRefreshError
        ? error.getRefreshedStore()
        : loadAuthProfileStoreForSecretsRuntime(params.agentDir);
    const surfacedCause =
      error instanceof OAuthManagerRefreshError && error.cause ? error.cause : error;
    if (isRefreshTokenReusedError(surfacedCause)) {
      const ownerAgentDir = resolvePersistedAuthProfileOwnerAgentDir({
        agentDir: params.agentDir,
        profileId,
      });
      await clearLastGoodProfileWithLock({
        provider: cred.provider,
        profileId,
        agentDir: ownerAgentDir,
      });
      if (
        params.agentDir !== ownerAgentDir &&
        hasRuntimeAuthProfileStoreSnapshot(params.agentDir)
      ) {
        const snapshot = getRuntimeAuthProfileStoreSnapshot(params.agentDir);
        const providerKey = resolveProviderIdForAuth(cred.provider);
        if (snapshot?.lastGood?.[providerKey] === profileId) {
          delete snapshot.lastGood[providerKey];
          if (Object.keys(snapshot.lastGood).length === 0) snapshot.lastGood = void 0;
          setRuntimeAuthProfileStoreSnapshot(snapshot, params.agentDir);
        }
      }
      refreshedStore = loadAuthProfileStoreForSecretsRuntime(params.agentDir);
    }
    const fallbackProfileId = suggestOAuthProfileIdForLegacyDefault({
      cfg,
      store: refreshedStore,
      provider: cred.provider,
      legacyProfileId: profileId,
    });
    if (fallbackProfileId && fallbackProfileId !== profileId)
      try {
        const fallbackResolved = await tryResolveOAuthProfile({
          cfg,
          store: refreshedStore,
          profileId: fallbackProfileId,
          agentDir: params.agentDir,
          forceRefresh: params.forceRefresh,
        });
        if (fallbackResolved) return fallbackResolved;
      } catch {}
    const message = extractErrorMessage(surfacedCause);
    const hint = await formatAuthDoctorHint({
      cfg,
      store: refreshedStore,
      provider: cred.provider,
      profileId,
    });
    throw new OAuthRefreshFailureError({
      provider: cred.provider,
      profileId,
      message:
        `OAuth token refresh failed for ${cred.provider}: ${message}. Please try again or re-authenticate.` +
        (hint ? `\n\n${hint}` : ""),
      cause: error,
    });
  }
}
//#endregion
export {
  formatAuthDoctorHint as i,
  resolveApiKeyForProfile as n,
  resolveEffectiveOAuthCredential as r,
  refreshOAuthCredentialForRuntime as t,
};
