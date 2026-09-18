import { r as createLazyPromiseLoader } from "./lazy-promise-EhsWch5m.js";
//#region src/shared/lazy-runtime.ts
function createLazyRuntimeSurface(importer, select) {
  const loader = createLazyPromiseLoader(() => importer().then(select), { cacheRejections: true });
  const load = loader.load;
  load.peek = loader.peek;
  load.clear = loader.clear;
  return load;
}
/** Cache the raw dynamically imported runtime module behind a stable loader. */
function createLazyRuntimeModule(importer) {
  return createLazyRuntimeSurface(importer, (module) => module);
}
/** Cache a single named runtime export without repeating a custom selector closure per caller. */
function createLazyRuntimeNamedExport(importer, key) {
  return createLazyRuntimeSurface(importer, (module) => module[key]);
}
function createLazyRuntimeMethod(load, select) {
  const invoke = async (...args) => {
    return await select(await load())(...args);
  };
  return invoke;
}
function createLazyRuntimeMethodBinder(load) {
  return function (select) {
    return createLazyRuntimeMethod(load, select);
  };
}
//#endregion
export {
  createLazyRuntimeSurface as a,
  createLazyRuntimeNamedExport as i,
  createLazyRuntimeMethodBinder as n,
  createLazyRuntimeModule as r,
  createLazyRuntimeMethod as t,
};
