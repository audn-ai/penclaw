import { n as ZcaUserInfo, t as ResolvedZalouserAccount } from "./accounts-DZLwPqsN.js";
import { t as BaseProbeResult } from "./types.core-CcwzPNhX.js";
import { t as ChannelPlugin } from "./types.plugin-BGk2f9vp.js";
//#region extensions/zalouser/src/probe.d.ts
type ZalouserProbeResult = BaseProbeResult<string> & {
  user?: ZcaUserInfo;
};
//#endregion
//#region extensions/zalouser/src/channel.d.ts
declare const zalouserPlugin: ChannelPlugin<ResolvedZalouserAccount, ZalouserProbeResult>;
//#endregion
export { zalouserPlugin as t };
