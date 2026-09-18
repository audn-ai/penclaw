//#region src/shared/lazy-runtime.d.ts
type LazyRuntimeLoader<T> = (() => Promise<T>) & {
  peek: () => Promise<T> | undefined;
  clear: () => void;
};
declare function createLazyRuntimeSurface<TModule, TSurface>(
  importer: () => Promise<TModule>,
  select: (module: TModule) => TSurface,
): LazyRuntimeLoader<TSurface>;
/** Cache the raw dynamically imported runtime module behind a stable loader. */
declare function createLazyRuntimeModule<TModule>(
  importer: () => Promise<TModule>,
): LazyRuntimeLoader<TModule>;
/** Cache a single named runtime export without repeating a custom selector closure per caller. */
declare function createLazyRuntimeNamedExport<TModule, const TKey extends keyof TModule>(
  importer: () => Promise<TModule>,
  key: TKey,
): () => Promise<TModule[TKey]>;
declare function createLazyRuntimeMethod<TSurface, TArgs extends unknown[], TResult>(
  load: () => Promise<TSurface>,
  select: (surface: TSurface) => (...args: TArgs) => TResult,
): (...args: TArgs) => Promise<Awaited<TResult>>;
declare function createLazyRuntimeMethodBinder<TSurface>(
  load: () => Promise<TSurface>,
): <TArgs extends unknown[], TResult>(
  select: (surface: TSurface) => (...args: TArgs) => TResult,
) => (...args: TArgs) => Promise<Awaited<TResult>>;
//#endregion
export {
  createLazyRuntimeMethod,
  createLazyRuntimeMethodBinder,
  createLazyRuntimeModule,
  createLazyRuntimeNamedExport,
  createLazyRuntimeSurface,
};
