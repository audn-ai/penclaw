import "./proxy-env-5nRGQyQD.js";
import "./managed-proxy-undici-BZ0Vz-Ui.js";
import "./undici-runtime-Bm6J6FAw.js";
import "./ssrf-keFRGQLq.js";
import "./node-proxy-agent-CGkxlNj2.js";
import "./proxy-fetch-BNm7PiNO.js";
import "./fetch-B_uBy4WI.js";
//#region src/plugin-sdk/fetch-runtime.ts
/** Apply the trusted-env-proxy guarded fetch preset without exposing raw mode strings to plugins. */
function withTrustedEnvProxyGuardedFetchMode(params) {
  return {
    ...params,
    mode: "trusted_env_proxy",
  };
}
//#endregion
export { withTrustedEnvProxyGuardedFetchMode as t };
