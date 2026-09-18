//#region packages/normalization-core/src/record-coerce.d.ts
/** Type guard for non-array object records at browser-safe boundaries. */
declare function isRecord(value: unknown): value is Record<string, unknown>;
/** Coerces object-like values to records, falling back to an empty record. */
declare function asRecord(value: unknown): Record<string, unknown>;
/** Reads a field only when it exists as a string. */
declare function readStringField(
  record: Record<string, unknown> | null | undefined,
  key: string,
): string | undefined;
/** Returns a non-array record or undefined. */
declare function asOptionalRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns a non-array record or null. */
declare function asNullableRecord(value: unknown): Record<string, unknown> | null;
/** Returns any object-backed record, including arrays, or undefined. */
declare function asOptionalObjectRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns any object-backed record, including arrays, or null. */
declare function asNullableObjectRecord(value: unknown): Record<string, unknown> | null;
//#endregion
export {
  asRecord as a,
  asOptionalRecord as i,
  asNullableRecord as n,
  isRecord as o,
  asOptionalObjectRecord as r,
  readStringField as s,
  asNullableObjectRecord as t,
};
