//#region src/plugin-sdk/expect-runtime.d.ts
declare function expectDefined<T>(value: T | null | undefined, context: string): T;
//#endregion
export { expectDefined };
