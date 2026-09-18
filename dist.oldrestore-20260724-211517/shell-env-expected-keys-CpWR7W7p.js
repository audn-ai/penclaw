import { n as listKnownChannelEnvVarNames } from "./channel-env-vars-PtvWafrN.js";
import { n as listKnownProviderAuthEnvVarNames } from "./provider-env-vars-BZiQzob_.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/config/shell-env-expected-keys.ts
const CORE_SHELL_ENV_EXPECTED_KEYS = ["OPENCLAW_GATEWAY_TOKEN", "OPENCLAW_GATEWAY_PASSWORD"];
/**
 * Lists env vars worth importing from login-shell fallback for this config load.
 *
 * Provider/channel helpers inspect the current environment so optional plugin
 * and auth aliases only trigger shell probing when their configured keys matter.
 */
function resolveShellEnvExpectedKeys(env) {
  return uniqueStrings([
    ...listKnownProviderAuthEnvVarNames({ env }),
    ...listKnownChannelEnvVarNames({ env }),
    ...CORE_SHELL_ENV_EXPECTED_KEYS,
  ]);
}
//#endregion
export { resolveShellEnvExpectedKeys as t };
