//#region extensions/browser/src/browser-gateway-contract.ts
/**
 * Gateway method and scope constants for browser proxy requests.
 *
 * Node-hosted browser control uses these values on both sides of the gateway
 * contract, so keep them as literal exports instead of duplicated strings.
 */
const BROWSER_REQUEST_GATEWAY_METHOD = "browser.request";
/** Admin scope required to proxy browser-control requests through Gateway. */
const BROWSER_REQUEST_GATEWAY_SCOPE = "operator.admin";
/** Scope tuple shape consumed by Gateway tool registration. */
const BROWSER_REQUEST_GATEWAY_SCOPES = [BROWSER_REQUEST_GATEWAY_SCOPE];
//#endregion
export {
  BROWSER_REQUEST_GATEWAY_SCOPE as n,
  BROWSER_REQUEST_GATEWAY_SCOPES as r,
  BROWSER_REQUEST_GATEWAY_METHOD as t,
};
