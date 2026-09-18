import {
  n as BundledChannelEntryContract,
  o as OpenClawPluginApi,
} from "../../channel-entry-contract-BVe6rI9J.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";

//#region extensions/matrix/index.d.ts
declare function registerMatrixFullRuntime(api: OpenClawPluginApi): void;
declare const _default: BundledChannelEntryContract<ChannelPlugin>;
//#endregion
export { _default as default, registerMatrixFullRuntime };
