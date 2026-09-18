//#region src/utils/sleep.d.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
declare function sleep(ms: number): Promise<void>;
//#endregion
export { sleep as t };
