import { t as ResolvedMatrixAccount } from "./accounts-MW9xkcNI.js";
import { t as BaseProbeResult } from "./types.core-CcwzPNhX.js";
import { t as ChannelPlugin } from "./types.plugin-BGk2f9vp.js";
//#region extensions/matrix/src/matrix/probe.d.ts
type MatrixProbe = BaseProbeResult & {
  status?: number | null;
  elapsedMs: number;
  userId?: string | null;
};
//#endregion
//#region extensions/matrix/src/channel.d.ts
declare const matrixPlugin: ChannelPlugin<ResolvedMatrixAccount, MatrixProbe>;
//#endregion
export { matrixPlugin as t };
