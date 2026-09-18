import { n as getBundledChannelPlugin } from "./bundled-CmD3EzUu.js";
import { t as findBundledPackageChannelMetadata } from "./bundled-package-channel-metadata-D_tgnrmf.js";
import "./registry-xXjI-8UE.js";
import { t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import "./plugins-BKdf-5tW.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-CWirNxxC.js";
//#region src/commands/doctor/channel-capabilities.ts
const DEFAULT_DOCTOR_CHANNEL_CAPABILITIES = {
  dmAllowFromMode: "topOnly",
  groupModel: "sender",
  groupAllowFromFallbackToAllowFrom: true,
  warnOnEmptyGroupSenderAllowlist: true,
};
function mergeDoctorChannelCapabilities(capabilities) {
  return {
    dmAllowFromMode:
      capabilities?.dmAllowFromMode ?? DEFAULT_DOCTOR_CHANNEL_CAPABILITIES.dmAllowFromMode,
    groupModel: capabilities?.groupModel ?? DEFAULT_DOCTOR_CHANNEL_CAPABILITIES.groupModel,
    groupAllowFromFallbackToAllowFrom:
      capabilities?.groupAllowFromFallbackToAllowFrom ??
      DEFAULT_DOCTOR_CHANNEL_CAPABILITIES.groupAllowFromFallbackToAllowFrom,
    warnOnEmptyGroupSenderAllowlist:
      capabilities?.warnOnEmptyGroupSenderAllowlist ??
      DEFAULT_DOCTOR_CHANNEL_CAPABILITIES.warnOnEmptyGroupSenderAllowlist,
  };
}
function getManifestDoctorCapabilities(channelId) {
  return findBundledPackageChannelMetadata(channelId)?.doctorCapabilities;
}
/** Resolve doctor behavior capabilities from channel metadata, plugin runtime, or defaults. */
function getDoctorChannelCapabilities(channelName) {
  if (!channelName) return DEFAULT_DOCTOR_CHANNEL_CAPABILITIES;
  const manifestCapabilities = getManifestDoctorCapabilities(channelName);
  if (manifestCapabilities) return mergeDoctorChannelCapabilities(manifestCapabilities);
  const channelId = normalizeAnyChannelId(channelName);
  if (!channelId) return DEFAULT_DOCTOR_CHANNEL_CAPABILITIES;
  const pluginDoctor =
    getChannelPlugin(channelId)?.doctor ?? getBundledChannelPlugin(channelId)?.doctor;
  if (pluginDoctor) return mergeDoctorChannelCapabilities(pluginDoctor);
  return mergeDoctorChannelCapabilities(getManifestDoctorCapabilities(channelId));
}
function readResolvedAccountId(account) {
  if (!account || typeof account !== "object") return;
  const accountId = account.accountId;
  return typeof accountId === "string" && accountId ? accountId : void 0;
}
/** Resolve configured and runtime account ids through the channel plugin's own semantics. */
function resolveDoctorChannelAccountIds(channelName, cfg, configuredAccountIds) {
  const channelId = normalizeAnyChannelId(channelName);
  if (!channelId) return;
  try {
    const plugin = getChannelPlugin(channelId) ?? getBundledChannelPlugin(channelId);
    if (!plugin) return;
    const resolveAccountIds = (accountIds) => {
      const resolved = accountIds.map((accountId) =>
        readResolvedAccountId(plugin.config.resolveAccount(cfg, accountId)),
      );
      return resolved.every((accountId) => accountId !== void 0) ? resolved : void 0;
    };
    const configured = resolveAccountIds(configuredAccountIds);
    const runtime = resolveAccountIds(plugin.config.listAccountIds(cfg));
    return configured && runtime
      ? {
          configured,
          runtime,
        }
      : void 0;
  } catch {
    return;
  }
}
//#endregion
export { resolveDoctorChannelAccountIds as n, getDoctorChannelCapabilities as t };
