//#region src/infra/channel-runtime-context.ts
const NOOP_DISPOSE = () => {};
function resolveScopedRuntimeContextRegistry(params) {
  const runtimeContexts = resolveRuntimeContextRegistry(params);
  if (
    runtimeContexts &&
    typeof runtimeContexts.register === "function" &&
    typeof runtimeContexts.get === "function" &&
    typeof runtimeContexts.watch === "function"
  )
    return runtimeContexts;
  throw new Error(
    "channelRuntime must provide runtimeContexts.register/get/watch; pass createPluginRuntime().channel or omit channelRuntime.",
  );
}
function resolveRuntimeContextRegistry(params) {
  return params.channelRuntime?.runtimeContexts ?? null;
}
/** Registers a channel-scoped runtime context, returning null when no runtime registry exists. */
function registerChannelRuntimeContext(params) {
  const runtimeContexts = resolveRuntimeContextRegistry(params);
  if (!runtimeContexts) return null;
  return runtimeContexts.register({
    channelId: params.channelId,
    accountId: params.accountId,
    capability: params.capability,
    context: params.context,
    abortSignal: params.abortSignal,
  });
}
/** Reads a channel-scoped runtime context from the current runtime registry. */
function getChannelRuntimeContext(params) {
  const runtimeContexts = resolveRuntimeContextRegistry(params);
  if (!runtimeContexts) return;
  return runtimeContexts.get({
    channelId: params.channelId,
    accountId: params.accountId,
    capability: params.capability,
  });
}
/** Watches context registration changes for one channel/account/capability key. */
function watchChannelRuntimeContexts(params) {
  const runtimeContexts = resolveRuntimeContextRegistry(params);
  if (!runtimeContexts) return null;
  return runtimeContexts.watch({
    channelId: params.channelId,
    accountId: params.accountId,
    capability: params.capability,
    onEvent: params.onEvent,
  });
}
/** Wraps a channel runtime so contexts registered during a task are disposed together. */
function createTaskScopedChannelRuntime(params) {
  const baseRuntime = params.channelRuntime;
  if (!baseRuntime)
    return {
      channelRuntime: void 0,
      dispose: NOOP_DISPOSE,
    };
  const runtimeContexts = resolveScopedRuntimeContextRegistry({ channelRuntime: baseRuntime });
  const trackedLeases = /* @__PURE__ */ new Set();
  const trackLease = (lease) => {
    trackedLeases.add(lease);
    let disposed = false;
    return {
      dispose: () => {
        if (disposed) return;
        disposed = true;
        trackedLeases.delete(lease);
        lease.dispose();
      },
    };
  };
  return {
    channelRuntime: {
      ...baseRuntime,
      runtimeContexts: {
        ...runtimeContexts,
        register: (registerParams) => {
          const lease = runtimeContexts.register(registerParams);
          return trackLease(lease);
        },
      },
    },
    dispose: () => {
      for (const lease of Array.from(trackedLeases)) lease.dispose();
    },
  };
}
//#endregion
export {
  watchChannelRuntimeContexts as i,
  getChannelRuntimeContext as n,
  registerChannelRuntimeContext as r,
  createTaskScopedChannelRuntime as t,
};
