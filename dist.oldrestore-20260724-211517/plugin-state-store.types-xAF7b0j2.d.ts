//#region src/plugin-state/plugin-state-store.types.d.ts
type PluginStateEntry<T> = {
  key: string;
  value: T;
  createdAt: number;
  expiresAt?: number;
};
/** Async plugin state API exposed to plugin runtimes. */
type PluginStateKeyedStore<T> = {
  register(
    key: string,
    value: T,
    opts?: {
      ttlMs?: number;
    },
  ): Promise<void>;
  registerIfAbsent(
    key: string,
    value: T,
    opts?: {
      ttlMs?: number;
    },
  ): Promise<boolean>;
  update?: (
    key: string,
    updateValue: (current: T | undefined) => T | undefined,
    opts?: {
      ttlMs?: number;
    },
  ) => Promise<boolean>;
  lookup(key: string): Promise<T | undefined>;
  consume(key: string): Promise<T | undefined>;
  delete(key: string): Promise<boolean>;
  entries(): Promise<PluginStateEntry<T>[]>;
  clear(): Promise<void>;
};
/** Sync plugin state API used by trusted core/plugin bootstrap paths. */
type PluginStateSyncKeyedStore<T> = {
  register(
    key: string,
    value: T,
    opts?: {
      ttlMs?: number;
    },
  ): void;
  registerIfAbsent(
    key: string,
    value: T,
    opts?: {
      ttlMs?: number;
    },
  ): boolean;
  update?: (
    key: string,
    updateValue: (current: T | undefined) => T | undefined,
    opts?: {
      ttlMs?: number;
    },
  ) => boolean;
  lookup(key: string): T | undefined;
  consume(key: string): T | undefined;
  delete(key: string): boolean;
  entries(): PluginStateEntry<T>[];
  clear(): void;
};
/** Options for opening a keyed plugin-state namespace. */
type PluginStateOverflowPolicy = "evict-oldest" | "reject-new";
type OpenKeyedStoreOptions = {
  namespace: string;
  maxEntries: number;
  overflowPolicy?: PluginStateOverflowPolicy;
  defaultTtlMs?: number;
  env?: NodeJS.ProcessEnv;
};
//#endregion
export {
  PluginStateSyncKeyedStore as i,
  PluginStateEntry as n,
  PluginStateKeyedStore as r,
  OpenKeyedStoreOptions as t,
};
