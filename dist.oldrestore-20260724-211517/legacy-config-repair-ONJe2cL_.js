import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import "./utils-DtcDeqWS.js";
import {
  D as validateConfigObjectWithPlugins,
  u as readConfigFileSnapshot,
} from "./io-B3ne6NxF.js";
import "./includes-C1dGj2Ja.js";
import { t as migrateLegacyConfig } from "./legacy-config-migrate-C7yKZF7d.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/commands/doctor/legacy-config-repair.ts
/** Return true when a config tree uses authored includes that doctor must not flatten. */
function containsAuthoredInclude(value) {
  if (!isRecord(value)) return false;
  if (Object.hasOwn(value, "$include")) return true;
  return Object.values(value).some((entry) => containsAuthoredInclude(entry));
}
/** Migrate a legacy config snapshot during update, unless includes or validation block it. */
async function repairLegacyConfigForUpdateChannel(params) {
  if (containsAuthoredInclude(params.configSnapshot.parsed))
    return {
      snapshot: params.configSnapshot,
      repaired: false,
    };
  const migrated = migrateLegacyConfig(params.configSnapshot.parsed);
  if (!migrated.config)
    return {
      snapshot: params.configSnapshot,
      repaired: false,
    };
  const validated = validateConfigObjectWithPlugins(migrated.config);
  if (!validated.ok)
    return {
      snapshot: params.configSnapshot,
      repaired: false,
    };
  await replaceConfigFile({
    nextConfig: validated.config,
    baseHash: params.configSnapshot.hash,
    writeOptions: {
      allowConfigSizeDrop: true,
      skipOutputLogs: params.jsonMode,
    },
  });
  const snapshot = await readConfigFileSnapshot();
  return {
    snapshot,
    repaired: snapshot.valid,
  };
}
//#endregion
export { repairLegacyConfigForUpdateChannel };
