import {
  a as getChannelRecord,
  i as createChannelSecretTargetRegistryEntries,
} from "../../channel-secret-basic-runtime-Dhe08HLa.js";
import { n as collectSecretInputAssignment } from "../../runtime-shared-CE1Ki5Mc.js";
import "../../channel-secret-basic-runtime-Cbnfa60V.js";
//#region extensions/msteams/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
  channelKey: "msteams",
  channel: ["appPassword"],
});
function collectRuntimeConfigAssignments(params) {
  const msteams = getChannelRecord(params.config, "msteams");
  if (!msteams) return;
  collectSecretInputAssignment({
    value: msteams.appPassword,
    path: "channels.msteams.appPassword",
    expected: "string",
    defaults: params.defaults,
    context: params.context,
    active: msteams.enabled !== false,
    inactiveReason: "Microsoft Teams channel is disabled.",
    apply: (value) => {
      msteams.appPassword = value;
    },
  });
}
const channelSecrets = {
  secretTargetRegistryEntries,
  collectRuntimeConfigAssignments,
};
//#endregion
export { channelSecrets, collectRuntimeConfigAssignments, secretTargetRegistryEntries };
