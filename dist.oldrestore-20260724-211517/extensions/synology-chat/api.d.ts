import { t as synologyChatPlugin } from "../../channel-B9tDG1Mb.js";
import { t as collectSynologyChatSecurityAuditFindings } from "../../security-audit-9EGcNasg.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";

//#region extensions/synology-chat/src/runtime.d.ts
declare const setSynologyRuntime: (next: PluginRuntime) => void,
  getSynologyRuntime: () => PluginRuntime;
//#endregion
export { collectSynologyChatSecurityAuditFindings, setSynologyRuntime, synologyChatPlugin };
