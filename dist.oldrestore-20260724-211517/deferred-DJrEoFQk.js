//#region src/shared/deferred.ts
const promiseWithResolvers = Promise;
function createDeferred() {
  return promiseWithResolvers.withResolvers();
}
//#endregion
export { createDeferred as t };
