//#region extensions/google/model-id.d.ts
declare function stripGoogleProviderPrefix(id: string): string;
declare function normalizeGoogleModelId(id: string): string;
declare function normalizeAntigravityModelId(id: string): string;
//#endregion
export {
  normalizeGoogleModelId as n,
  stripGoogleProviderPrefix as r,
  normalizeAntigravityModelId as t,
};
