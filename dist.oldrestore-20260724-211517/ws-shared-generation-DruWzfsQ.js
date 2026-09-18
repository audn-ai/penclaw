import { n as sha256Base64Url } from "./crypto-digest-CNeb2i19.js";
//#region src/gateway/server/ws-shared-generation.ts
function resolveSharedSecret(auth) {
  if (auth.mode === "token" && typeof auth.token === "string" && auth.token.trim().length > 0)
    return {
      mode: "token",
      secret: auth.token,
    };
  if (
    auth.mode === "password" &&
    typeof auth.password === "string" &&
    auth.password.trim().length > 0
  )
    return {
      mode: "password",
      secret: auth.password,
    };
  return null;
}
function normalizeTrustedProxyConfig(trustedProxy) {
  return {
    userHeader: trustedProxy?.userHeader,
    requiredHeaders: [...(trustedProxy?.requiredHeaders ?? [])].toSorted(),
    allowUsers: [...(trustedProxy?.allowUsers ?? [])].toSorted(),
    allowLoopback: trustedProxy?.allowLoopback,
  };
}
function resolveSharedGatewaySessionGeneration(auth, trustedProxies) {
  const shared = resolveSharedSecret(auth);
  if (shared) return sha256Base64Url(`${shared.mode}\u0000${shared.secret}`);
  if (auth.mode === "trusted-proxy")
    return sha256Base64Url(
      JSON.stringify({
        mode: auth.mode,
        trustedProxy: normalizeTrustedProxyConfig(auth.trustedProxy),
        trustedProxies: [...(trustedProxies ?? [])].toSorted(),
      }),
    );
}
//#endregion
export { resolveSharedGatewaySessionGeneration as t };
