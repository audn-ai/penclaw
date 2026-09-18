import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import {
  i as resolveAuthProfileOrder,
  n as isStoredCredentialCompatibleWithAuthProvider,
  t as isConfiguredAwsSdkAuthProfileForProvider,
} from "./order-BNCpk81x.js";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-yAijvhd5.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import { o as isProfileInCooldown } from "./usage-state-BQLO_Yob.js";
import "./usage-BZgGbRoq.js";
//#region src/agents/auth-profiles/session-override.ts
const sessionAccessorLoader = createLazyImportLoader(
  () => import("./session-accessor-C5VSDwSW.js"),
);
function loadSessionAccessor() {
  return sessionAccessorLoader.load();
}
function applySessionAuthProfileOverrideState(entry, state, updatedAt) {
  if (state.authProfileOverride === void 0) delete entry.authProfileOverride;
  else entry.authProfileOverride = state.authProfileOverride;
  if (state.authProfileOverrideSource === void 0) delete entry.authProfileOverrideSource;
  else entry.authProfileOverrideSource = state.authProfileOverrideSource;
  if (state.authProfileOverrideCompactionCount === void 0)
    delete entry.authProfileOverrideCompactionCount;
  else entry.authProfileOverrideCompactionCount = state.authProfileOverrideCompactionCount;
  entry.updatedAt = Math.max(entry.updatedAt ?? 0, updatedAt);
}
async function persistSessionAuthProfileOverrideState(params) {
  const { sessionEntry, sessionStore, sessionKey, state, storePath } = params;
  const updatedAt = Date.now();
  applySessionAuthProfileOverrideState(sessionEntry, state, updatedAt);
  sessionStore[sessionKey] = sessionEntry;
  if (!storePath) return;
  const persisted = await (
    await loadSessionAccessor()
  ).patchSessionEntry(
    {
      storePath,
      sessionKey,
    },
    (current) => ({
      ...state,
      updatedAt: Math.max(current.updatedAt ?? 0, updatedAt),
    }),
    { fallbackEntry: sessionEntry },
  );
  if (persisted) sessionStore[sessionKey] = persisted;
}
function isProfileForProvider(params) {
  const entry = params.store.profiles[params.profileId];
  if (entry) {
    if (!entry.provider) return false;
    return params.providers.some((provider) =>
      isStoredCredentialCompatibleWithAuthProvider({
        cfg: params.cfg,
        provider,
        credential: entry,
      }),
    );
  }
  return params.providers.some((provider) =>
    isConfiguredAwsSdkAuthProfileForProvider({
      cfg: params.cfg,
      provider,
      profileId: params.profileId,
    }),
  );
}
function uniqueProviders(provider, acceptedProviderIds) {
  const providers = /* @__PURE__ */ new Set();
  const push = (value) => {
    const normalized = value?.trim();
    if (normalized) providers.add(normalized);
  };
  (acceptedProviderIds && acceptedProviderIds.length > 0
    ? acceptedProviderIds
    : [provider]
  ).forEach(push);
  return [...providers];
}
/** Clears an auth-profile override from a session and persists it when possible. */
async function clearSessionAuthProfileOverride(params) {
  const { sessionEntry, sessionStore, sessionKey, storePath } = params;
  await persistSessionAuthProfileOverrideState({
    sessionEntry,
    sessionStore,
    sessionKey,
    state: {
      authProfileOverride: void 0,
      authProfileOverrideSource: void 0,
      authProfileOverrideCompactionCount: void 0,
    },
    storePath,
  });
}
/** Resolves and optionally rotates the session auth-profile override. */
async function resolveSessionAuthProfileOverride(params) {
  const {
    cfg,
    provider,
    agentDir,
    sessionEntry,
    sessionStore,
    sessionKey,
    storePath,
    isNewSession,
  } = params;
  if (!sessionEntry || !sessionStore || !sessionKey) return sessionEntry?.authProfileOverride;
  const hasConfiguredAuthProfiles =
    Boolean(params.cfg.auth?.profiles && Object.keys(params.cfg.auth.profiles).length > 0) ||
    Boolean(params.cfg.auth?.order && Object.keys(params.cfg.auth.order).length > 0);
  if (
    !sessionEntry.authProfileOverride?.trim() &&
    !hasConfiguredAuthProfiles &&
    !hasAnyAuthProfileStoreSource(agentDir)
  )
    return;
  const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
  const providers = uniqueProviders(provider, params.acceptedProviderIds);
  const order = [
    ...new Set(
      providers.flatMap((candidateProvider) =>
        resolveAuthProfileOrder({
          cfg,
          store,
          provider: candidateProvider,
        }),
      ),
    ),
  ];
  let current = sessionEntry.authProfileOverride?.trim();
  const source =
    sessionEntry.authProfileOverrideSource ??
    (typeof sessionEntry.authProfileOverrideCompactionCount === "number"
      ? "auto"
      : current
        ? "user"
        : void 0);
  const currentProfileId = current;
  if (
    currentProfileId &&
    !store.profiles[currentProfileId] &&
    !providers.some((candidateProvider) =>
      isConfiguredAwsSdkAuthProfileForProvider({
        cfg,
        provider: candidateProvider,
        profileId: currentProfileId,
      }),
    )
  ) {
    await clearSessionAuthProfileOverride({
      sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
    });
    current = void 0;
  }
  if (
    current &&
    !isProfileForProvider({
      cfg,
      providers,
      profileId: current,
      store,
    })
  ) {
    await clearSessionAuthProfileOverride({
      sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
    });
    current = void 0;
  }
  if (current && order.length > 0 && !order.includes(current) && source !== "user") {
    await clearSessionAuthProfileOverride({
      sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
    });
    current = void 0;
  }
  if (order.length === 0) return;
  const pickFirstAvailable = () =>
    order.find((profileId) => !isProfileInCooldown(store, profileId)) ?? order[0];
  const pickNextAvailable = (active) => {
    const startIndex = order.indexOf(active);
    if (startIndex < 0) return pickFirstAvailable();
    for (let offset = 1; offset <= order.length; offset += 1) {
      const candidate = order[(startIndex + offset) % order.length];
      if (candidate && !isProfileInCooldown(store, candidate)) return candidate;
    }
    return order[startIndex] ?? order[0];
  };
  const compactionCount = sessionEntry.compactionCount ?? 0;
  const storedCompaction =
    typeof sessionEntry.authProfileOverrideCompactionCount === "number"
      ? sessionEntry.authProfileOverrideCompactionCount
      : compactionCount;
  const replacementForUnusableCurrent =
    current && isProfileInCooldown(store, current)
      ? order.find((profileId) => profileId !== current && !isProfileInCooldown(store, profileId))
      : void 0;
  if (replacementForUnusableCurrent) current = void 0;
  if (source === "user" && current && !isNewSession) return current;
  let next = current;
  if (replacementForUnusableCurrent) next = replacementForUnusableCurrent;
  else if (isNewSession) next = current ? pickNextAvailable(current) : pickFirstAvailable();
  else if (current && compactionCount > storedCompaction) next = pickNextAvailable(current);
  else if (!current || isProfileInCooldown(store, current)) next = pickFirstAvailable();
  if (!next) return current;
  if (
    next !== sessionEntry.authProfileOverride ||
    sessionEntry.authProfileOverrideSource !== "auto" ||
    sessionEntry.authProfileOverrideCompactionCount !== compactionCount
  )
    await persistSessionAuthProfileOverrideState({
      sessionEntry,
      sessionStore,
      sessionKey,
      state: {
        authProfileOverride: next,
        authProfileOverrideSource: "auto",
        authProfileOverrideCompactionCount: compactionCount,
      },
      storePath,
    });
  return next;
}
//#endregion
export { resolveSessionAuthProfileOverride as n, clearSessionAuthProfileOverride as t };
