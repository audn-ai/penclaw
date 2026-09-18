//#region src/infra/map-size.d.ts
/** Prunes a Map in insertion order until it fits the requested maximum size. */
declare function pruneMapToMaxSize<K, V>(map: Map<K, V>, maxSize: number): void;
//#endregion
export { pruneMapToMaxSize as t };
