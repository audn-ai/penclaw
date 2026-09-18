import {
  n as ChannelRuntimeSurface,
  t as ChannelRuntimeContextKey,
} from "../channel-runtime-surface.types-CouuvmKm.js";

//#region src/infra/channel-runtime-context.d.ts
/** Registers a channel-scoped runtime context, returning null when no runtime registry exists. */
declare function registerChannelRuntimeContext(
  params: ChannelRuntimeContextKey & {
    channelRuntime?: ChannelRuntimeSurface;
    context: unknown;
    abortSignal?: AbortSignal;
  },
): {
  dispose: () => void;
} | null;
/** Reads a channel-scoped runtime context from the current runtime registry. */
declare function getChannelRuntimeContext(
  params: ChannelRuntimeContextKey & {
    channelRuntime?: ChannelRuntimeSurface;
  },
): unknown;
/** Watches context registration changes for one channel/account/capability key. */
declare function watchChannelRuntimeContexts(
  params: ChannelRuntimeContextKey & {
    channelRuntime?: ChannelRuntimeSurface;
    onEvent: Parameters<ChannelRuntimeSurface["runtimeContexts"]["watch"]>[0]["onEvent"];
  },
): (() => void) | null;
//#endregion
export {
  type ChannelRuntimeContextKey,
  getChannelRuntimeContext,
  registerChannelRuntimeContext,
  watchChannelRuntimeContexts,
};
