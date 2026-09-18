import { d as ResolvedLineAccount } from "../../accounts-BVYvjU3t.js";
import { t as linePlugin } from "../../channel-CcZH06i1.js";
import { g as OpenClawPluginApi } from "../../plugin-entry-DPCR66aO.js";
import { r as ReplyPayload } from "../../reply-payload-D9hNZyN3.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";
import { r as ChannelAccountSnapshot } from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";

//#region extensions/line/src/channel.setup.d.ts
declare const lineSetupPlugin: ChannelPlugin<ResolvedLineAccount>;
//#endregion
export {
  type ChannelAccountSnapshot,
  type ChannelPlugin,
  type OpenClawConfig,
  type OpenClawPluginApi,
  type PluginRuntime,
  type ReplyPayload,
  type ResolvedLineAccount,
  linePlugin,
  lineSetupPlugin,
};
