//#region packages/memory-host-sdk/src/host/secret-input.d.ts
/** Return true when a configured memory secret contains a literal value or reference. */
declare function hasConfiguredMemorySecretInput(value: unknown): boolean;
/** Resolve memory secret input, reading env refs directly when available. */
declare function resolveMemorySecretInputString(params: {
  value: unknown;
  path: string;
}): string | undefined;
//#endregion
export { resolveMemorySecretInputString as n, hasConfiguredMemorySecretInput as t };
