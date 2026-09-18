import crypto from "node:crypto";
//#region src/agents/execution-auth-binding.ts
const authBindingFingerprintKey = crypto.randomBytes(32);
function hashAuthBinding(value) {
  return crypto
    .createHmac("sha256", authBindingFingerprintKey)
    .update(JSON.stringify(value))
    .digest("hex");
}
function normalizeIdentity(value, lowercase = false) {
  const normalized = value?.trim();
  return normalized ? (lowercase ? normalized.toLowerCase() : normalized) : void 0;
}
/**
 * Project non-secret profile ownership for runtimes that keep rotating tokens
 * behind their own process boundary. An explicitly selected missing profile
 * has no owner shape and must never collapse to ambient runtime authority.
 */
function fingerprintAuthProfileOwnerShape(params) {
  const credential = params.credential;
  if (!credential) return;
  switch (credential.type) {
    case "api_key":
      return hashAuthBinding([
        "profile-owner-v1",
        params.profileId,
        credential.type,
        credential.provider,
        credential.keyRef ?? null,
        normalizeIdentity(credential.email, true) ?? null,
        normalizeIdentity(credential.displayName) ?? null,
        credential.metadata ?? null,
      ]);
    case "token":
      return hashAuthBinding([
        "profile-owner-v1",
        params.profileId,
        credential.type,
        credential.provider,
        credential.tokenRef ?? null,
        normalizeIdentity(credential.email, true) ?? null,
        normalizeIdentity(credential.displayName) ?? null,
      ]);
    case "oauth": {
      const jwtIdentity = decodeJwtIdentity(credential.idToken);
      return hashAuthBinding([
        "profile-owner-v1",
        params.profileId,
        credential.type,
        credential.provider,
        normalizeIdentity(credential.accountId) ?? jwtIdentity.subject ?? null,
        normalizeIdentity(credential.email, true) ?? jwtIdentity.email ?? null,
        credential.clientId ?? null,
        credential.enterpriseUrl ?? null,
        credential.projectId ?? null,
      ]);
    }
  }
}
/** Fingerprint the stable owner boundary of a successful opaque runtime turn. */
function fingerprintOpaqueRuntimeOwner(params) {
  const runtimeArtifactFingerprint = params.runtimeArtifactFingerprint;
  const authProfileId = normalizeIdentity(params.authProfileId);
  if (authProfileId && !params.authProfileOwnerFingerprint) return;
  if (!authProfileId && params.skipLocalCredential) return;
  if (
    (params.kind === "cli-runtime" || params.kind === "plugin-harness") &&
    !runtimeArtifactFingerprint
  )
    return;
  return hashAuthBinding([
    params.kind === "aws-sdk" ? "opaque-runtime-owner-v1" : "opaque-runtime-owner-v2",
    params.kind,
    params.runner,
    params.provider.trim(),
    params.backendId,
    params.backendConfig ?? null,
    authProfileId ?? null,
    params.authProfileOwnerFingerprint ?? null,
    params.authSource ?? null,
    params.skipLocalCredential === true,
    runtimeArtifactFingerprint ?? null,
  ]);
}
/** Fingerprint only AWS SDK owners whose exact credential is observable here. */
function fingerprintAwsSdkRuntimeOwner(params) {
  if (params.auth?.mode !== "aws-sdk" || params.auth.apiKey) return;
  const env = params.env ?? process.env;
  let owner;
  if (env.AWS_BEARER_TOKEN_BEDROCK?.trim())
    owner = ["bearer", hashAuthBinding(env.AWS_BEARER_TOKEN_BEDROCK.trim())];
  else if (env.AWS_PROFILE?.trim()) return;
  else if (env.AWS_ACCESS_KEY_ID?.trim() && env.AWS_SECRET_ACCESS_KEY?.trim())
    owner = [
      "access-key",
      env.AWS_ACCESS_KEY_ID.trim(),
      hashAuthBinding([env.AWS_SECRET_ACCESS_KEY.trim(), env.AWS_SESSION_TOKEN?.trim() ?? null]),
    ];
  else return;
  return fingerprintOpaqueRuntimeOwner({
    kind: "aws-sdk",
    runner: "embedded",
    provider: params.provider,
    backendId: params.backendId,
    authSource: hashAuthBinding([params.auth.source, owner]),
  });
}
function decodeJwtIdentity(token) {
  const payload = token?.split(".")[1];
  if (!payload) return {};
  try {
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return {
      ...(typeof claims.sub === "string" && normalizeIdentity(claims.sub)
        ? { subject: normalizeIdentity(claims.sub) }
        : {}),
      ...(typeof claims.email === "string" && normalizeIdentity(claims.email, true)
        ? { email: normalizeIdentity(claims.email, true) }
        : {}),
    };
  } catch {
    return {};
  }
}
/** Fingerprint the exact active credential owner used by one execution. */
function fingerprintAuthProfileCredential(params) {
  const credential = params.credential;
  switch (credential.type) {
    case "api_key":
      if (!credential.key) return;
      return hashAuthBinding([
        "api_key",
        params.profileId,
        credential.provider,
        credential.key,
        credential.keyRef ?? null,
        credential.email ?? null,
        credential.displayName ?? null,
        credential.metadata ?? null,
      ]);
    case "token":
      if (!credential.token) return;
      return hashAuthBinding([
        "token",
        params.profileId,
        credential.provider,
        credential.token,
        credential.tokenRef ?? null,
        credential.email ?? null,
        credential.displayName ?? null,
      ]);
    case "oauth": {
      const jwtIdentity = decodeJwtIdentity(credential.idToken);
      const accountId = normalizeIdentity(credential.accountId) ?? jwtIdentity.subject;
      const email = normalizeIdentity(credential.email, true) ?? jwtIdentity.email;
      const stableIdentity = accountId ?? email;
      const opaqueIdentity = stableIdentity
        ? null
        : [credential.access, credential.refresh, credential.idToken ?? null];
      if (!stableIdentity && !credential.access && !credential.refresh && !credential.idToken)
        return;
      return hashAuthBinding([
        "oauth",
        params.profileId,
        credential.provider,
        credential.clientId ?? null,
        accountId ?? null,
        email ?? null,
        credential.enterpriseUrl ?? null,
        credential.projectId ?? null,
        opaqueIdentity,
      ]);
    }
  }
}
/** Fingerprint a profile after materializing its selected SecretRef value. */
function fingerprintResolvedAuthProfileCredential(params) {
  const credential = params.credential;
  if (credential.type === "oauth")
    return fingerprintAuthProfileCredential({
      profileId: params.profileId,
      credential,
    });
  if (params.resolvedAuth && params.resolvedAuth.profileId !== params.profileId) return;
  const inlineValue = credential.type === "api_key" ? credential.key : credential.token;
  const resolvedValue = params.resolvedAuth?.apiKey ?? inlineValue;
  if (!resolvedValue) return;
  return fingerprintAuthProfileCredential({
    profileId: params.profileId,
    credential:
      credential.type === "api_key"
        ? {
            ...credential,
            key: resolvedValue,
          }
        : {
            ...credential,
            token: resolvedValue,
          },
  });
}
/** Fingerprint an ambient/config/env credential that was actually selected. */
function fingerprintResolvedProviderAuth(auth) {
  if (!auth?.apiKey) return;
  return hashAuthBinding(["resolved", auth.profileId ?? null, auth.source, auth.mode, auth.apiKey]);
}
//#endregion
export {
  fingerprintResolvedAuthProfileCredential as a,
  fingerprintOpaqueRuntimeOwner as i,
  fingerprintAuthProfileOwnerShape as n,
  fingerprintResolvedProviderAuth as o,
  fingerprintAwsSdkRuntimeOwner as r,
  fingerprintAuthProfileCredential as t,
};
