import { a as fingerprintResolvedAuthProfileCredential } from "./execution-auth-binding-CmucNoqo.js";
import { n as resolveApiKeyForProfile } from "./oauth-CqNVt6lC.js";
import "./agent-runtime-BiQiwmwD.js";
import "./agent-harness-runtime-BjY9gsEs.js";
//#region extensions/codex/src/app-server/auth-binding.ts
function withMaterializedCredential(params) {
  const store = structuredClone(params.store);
  if (params.credential.type === "api_key") {
    const { keyRef: _keyRef, ...credential } = params.credential;
    store.profiles[params.profileId] = {
      ...credential,
      key: params.value,
    };
  } else if (params.credential.type === "token") {
    const { tokenRef: _tokenRef, ...credential } = params.credential;
    store.profiles[params.profileId] = {
      ...credential,
      token: params.value,
    };
  }
  return store;
}
/** Resolves one forwarded profile once so attestation and execution share exact material. */
async function prepareCodexAppServerAuthBinding(params) {
  const credential = params.authProfileStore.profiles[params.authProfileId];
  if (!credential || credential.type === "oauth") return;
  const resolved = await resolveApiKeyForProfile({
    cfg: params.config,
    store: params.authProfileStore,
    profileId: params.authProfileId,
    agentDir: params.agentDir,
  });
  if (!resolved?.apiKey)
    throw new Error(`Codex could not resolve auth profile "${params.authProfileId}".`);
  const fingerprint = fingerprintResolvedAuthProfileCredential({
    profileId: params.authProfileId,
    credential,
    resolvedAuth: {
      apiKey: resolved.apiKey,
      profileId: params.authProfileId,
      source: `profile:${params.authProfileId}`,
      mode: credential.type === "api_key" ? "api-key" : "token",
    },
  });
  if (!fingerprint)
    throw new Error(`Codex could not attest auth profile "${params.authProfileId}".`);
  return {
    fingerprint,
    authProfileStore: withMaterializedCredential({
      store: params.authProfileStore,
      profileId: params.authProfileId,
      credential,
      value: resolved.apiKey,
    }),
  };
}
async function fingerprintCodexAppServerAuthBinding(params) {
  return (await prepareCodexAppServerAuthBinding(params))?.fingerprint;
}
//#endregion
export { prepareCodexAppServerAuthBinding as n, fingerprintCodexAppServerAuthBinding as t };
