//#region src/channels/plugins/channel-runtime-surface.types.d.ts
/**
 * Channel runtime context registry types.
 *
 * Defines the public plugin SDK surface for channel runtime context registration and watches.
 */
type ChannelRuntimeContextKey = {
  channelId: string;
  accountId?: string | null;
  capability: string;
};
type ChannelRuntimeContextEvent = {
  type: "registered" | "unregistered";
  key: {
    channelId: string;
    accountId?: string;
    capability: string;
  };
  context?: unknown;
};
type ChannelRuntimeContextRegistry = {
  register: (
    params: ChannelRuntimeContextKey & {
      context: unknown;
      abortSignal?: AbortSignal;
    },
  ) => {
    dispose: () => void;
  };
  get: <T = unknown>(params: ChannelRuntimeContextKey) => T | undefined;
  watch: (params: {
    channelId?: string;
    accountId?: string | null;
    capability?: string;
    onEvent: (event: ChannelRuntimeContextEvent) => void;
  }) => () => void;
};
/**
 * Minimal channel-runtime surface exported through the public plugin SDK.
 *
 * Gateway startup supplies the full plugin channel runtime, but external callers
 * may still type context-only helpers against this compatibility surface.
 */
type ChannelRuntimeSurface = {
  runtimeContexts: ChannelRuntimeContextRegistry;
  [key: string]: unknown;
};
//#endregion
export { ChannelRuntimeSurface as n, ChannelRuntimeContextKey as t };
