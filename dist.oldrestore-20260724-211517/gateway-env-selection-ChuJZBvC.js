import { i as collectConfigRuntimeEnvVars } from "./config-env-vars-CwdMUFhk.js";
import "./env-vars-D5-q5cD2.js";
//#region src/config/gateway-env-selection.ts
const GATEWAY_CONFIG_SELECTION_ENV_KEYS = /* @__PURE__ */ new Set([
  "ANDROID_DATA",
  "HOME",
  "HOMEDRIVE",
  "HOMEPATH",
  "OPENCLAW_AGENT_DIR",
  "OPENCLAW_CONFIG_PATH",
  "OPENCLAW_HOME",
  "OPENCLAW_INCLUDE_ROOTS",
  "OPENCLAW_NIX_MODE",
  "OPENCLAW_OAUTH_DIR",
  "OPENCLAW_PACKAGE_DIR",
  "OPENCLAW_PROFILE",
  "OPENCLAW_STATE_DIR",
  "OPENCLAW_TEST_FAST",
  "OPENCLAW_WORKSPACE_DIR",
  "PI_CODING_AGENT_DIR",
  "PREFIX",
  "USERPROFILE",
]);
/** Rejects config.env changes that would retarget a running Gateway process. */
function assertGatewayConfigEnvSelectionUnchanged(previousConfig, nextConfig) {
  const normalize = (config) =>
    new Map(
      Object.entries(collectConfigRuntimeEnvVars(config)).map(([key, value]) => [
        key.toUpperCase(),
        value,
      ]),
    );
  const previous = normalize(previousConfig);
  const next = normalize(nextConfig);
  for (const key of GATEWAY_CONFIG_SELECTION_ENV_KEYS)
    if (previous.get(key) !== next.get(key))
      throw new Error(
        `Config env cannot change process-stable Gateway selector ${key} during reload. Restart with the target environment instead.`,
      );
}
//#endregion
export { assertGatewayConfigEnvSelectionUnchanged as n, GATEWAY_CONFIG_SELECTION_ENV_KEYS as t };
