import { t as resolveGatewayConnectionAuth } from "./connection-auth-DnCi7hut.js";
import { t as buildGatewayConnectionDetailsWithResolvers } from "./connection-details-ByYgagYn.js";
//#region src/gateway/client-bootstrap.ts
/**
 * Maps connection-detail source labels to the override kinds that affect auth fallback.
 */
function resolveGatewayUrlOverrideSource(urlSource) {
  if (urlSource === "cli --url") return "cli";
  if (urlSource === "env OPENCLAW_GATEWAY_URL") return "env";
}
/**
 * Resolves the URL, auth material, and handshake tuning needed to start a GatewayClient.
 */
async function resolveGatewayClientBootstrap(params) {
  const connection = buildGatewayConnectionDetailsWithResolvers({
    config: params.config,
    url: params.gatewayUrl,
  });
  const urlOverrideSource = resolveGatewayUrlOverrideSource(connection.urlSource);
  const auth = await resolveGatewayConnectionAuth({
    config: params.config,
    explicitAuth: params.explicitAuth,
    env: params.env ?? process.env,
    urlOverride: urlOverrideSource ? connection.url : void 0,
    urlOverrideSource,
  });
  return {
    url: connection.url,
    urlSource: connection.urlSource,
    preauthHandshakeTimeoutMs: params.config.gateway?.handshakeTimeoutMs,
    auth,
  };
}
//#endregion
export { resolveGatewayClientBootstrap as t };
