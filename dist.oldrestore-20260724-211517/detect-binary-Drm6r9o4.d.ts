//#region src/infra/detect-binary.d.ts
/** Return true when a safe executable name/path can be found on this host. */
declare function detectBinary(name: string): Promise<boolean>;
//#endregion
export { detectBinary as t };
