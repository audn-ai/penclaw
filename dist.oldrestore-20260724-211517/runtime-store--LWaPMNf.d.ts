//#region src/plugin-sdk/runtime-store.d.ts
type PluginRuntimeStoreKeyOptions = {
  /** Explicit global registry key for shared runtime slots. */ key: string /** Error thrown by getRuntime before setRuntime initializes this slot. */;
  errorMessage: string;
};
type PluginRuntimeStorePluginOptions = {
  /** Plugin id used to derive a stable cross-module runtime slot key. */ pluginId: string /** Error thrown by getRuntime before setRuntime initializes this slot. */;
  errorMessage: string;
};
type PluginRuntimeStoreOptions = PluginRuntimeStoreKeyOptions | PluginRuntimeStorePluginOptions;
/**
 * Create a process-local runtime slot that throws when accessed before initialization.
 *
 * String keys create isolated module-local stores; option objects create global
 * named slots so duplicate SDK module instances share the same plugin runtime.
 */
declare function createPluginRuntimeStore<T>(errorMessage: string): {
  setRuntime: (next: T) => void;
  clearRuntime: () => void;
  tryGetRuntime: () => T | null;
  getRuntime: () => T;
};
/** Create a globally shared runtime slot keyed by plugin id or explicit registry key. */
declare function createPluginRuntimeStore<T>(options: PluginRuntimeStoreOptions): {
  setRuntime: (next: T) => void;
  clearRuntime: () => void;
  tryGetRuntime: () => T | null;
  getRuntime: () => T;
};
//#endregion
export { createPluginRuntimeStore as t };
