import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/shared/gateway-bind-url.ts
/** Resolves the externally advertised gateway URL for non-loopback bind modes. */
function resolveGatewayBindUrl(params) {
  const bind = params.bind ?? "loopback";
  if (bind === "custom") {
    const host = normalizeOptionalString(params.customBindHost);
    if (host)
      return {
        url: `${params.scheme}://${host}:${params.port}`,
        source: "gateway.bind=custom",
      };
    return { error: "gateway.bind=custom requires gateway.customBindHost." };
  }
  if (bind === "tailnet") {
    const host = params.pickTailnetHost();
    if (host)
      return {
        url: `${params.scheme}://${host}:${params.port}`,
        source: "gateway.bind=tailnet",
      };
    return { error: "gateway.bind=tailnet set, but no tailnet IP was found." };
  }
  if (bind === "lan") {
    const host = params.pickLanHost();
    if (host)
      return {
        url: `${params.scheme}://${host}:${params.port}`,
        source: "gateway.bind=lan",
      };
    return { error: "gateway.bind=lan set, but no private LAN IP was found." };
  }
  return null;
}
//#endregion
export { resolveGatewayBindUrl as t };
