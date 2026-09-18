import { t as OutboundDeliveryResult } from "../../deliver-types-Df1s0J7e.js";
import {
  i as ChannelOutboundContext,
  n as ChannelOutboundAdapter,
} from "../../outbound.types-Bu7WWq9f.js";
import { t as twitchPlugin } from "../../plugin-Bq0F3Pgu.js";
import { i as WizardPrompter } from "../../prompts-CWXx5gsI.js";
import { n as RuntimeEnv } from "../../runtime-Bxifh4bY.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";
import {
  L as ChannelResolveKind,
  R as ChannelResolveResult,
  U as ChannelStatusAdapter,
  k as ChannelGatewayContext,
} from "../../types.adapters-BND_5Qr-.js";
import {
  T as ChannelMeta,
  c as ChannelCapabilities,
  g as ChannelLogSink,
  r as ChannelAccountSnapshot,
  v as ChannelMessageActionAdapter,
  y as ChannelMessageActionContext,
} from "../../types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "../../types.plugin-BGk2f9vp.js";

//#region extensions/twitch/src/runtime.d.ts
declare const setTwitchRuntime: (next: PluginRuntime) => void,
  getTwitchRuntime: () => PluginRuntime;
//#endregion
export {
  type ChannelAccountSnapshot,
  type ChannelCapabilities,
  type ChannelGatewayContext,
  type ChannelLogSink,
  type ChannelMessageActionAdapter,
  type ChannelMessageActionContext,
  type ChannelMeta,
  type ChannelOutboundAdapter,
  type ChannelOutboundContext,
  type ChannelPlugin,
  type ChannelResolveKind,
  type ChannelResolveResult,
  type ChannelStatusAdapter,
  type OpenClawConfig,
  type OutboundDeliveryResult,
  type RuntimeEnv,
  type WizardPrompter,
  setTwitchRuntime,
  twitchPlugin,
};
