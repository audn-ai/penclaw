import { Type } from "typebox";

//#region src/agents/schema/string-enum.d.ts
type StringEnumOptions<T extends readonly string[]> = {
  description?: string;
  title?: string;
  default?: T[number];
  deprecated?: boolean;
};
declare function stringEnum<T extends readonly string[]>(
  values: T,
  options?: StringEnumOptions<T>,
): Type.TUnsafe<T[number]>;
declare function optionalStringEnum<T extends readonly string[]>(
  values: T,
  options?: StringEnumOptions<T>,
): Type.TOptional<Type.TUnsafe<T[number]>>;
//#endregion
//#region src/agents/schema/typebox.d.ts
/** Builds a schema for one outbound channel target. */
declare function channelTargetSchema(options?: { description?: string }): Type.TString;
/** Builds a schema for multiple outbound channel targets. */
declare function channelTargetsSchema(options?: {
  description?: string;
}): Type.TArray<Type.TString>;
type IntegerSchemaOptions = {
  description?: string;
  maximum?: number;
};
type NumberSchemaOptions = {
  description?: string;
  deprecated?: boolean;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;
};
/** Builds an optional finite number schema with caller-provided metadata. */
declare function optionalFiniteNumberSchema(
  options?: NumberSchemaOptions,
): Type.TOptional<Type.TNumber>;
/** Builds an optional positive integer schema. */
declare function optionalPositiveIntegerSchema(
  options?: IntegerSchemaOptions,
): Type.TOptional<Type.TInteger>;
/** Builds an optional non-negative integer schema. */
declare function optionalNonNegativeIntegerSchema(
  options?: IntegerSchemaOptions,
): Type.TOptional<Type.TInteger>;
//#endregion
export {
  optionalPositiveIntegerSchema as a,
  optionalNonNegativeIntegerSchema as i,
  channelTargetsSchema as n,
  optionalStringEnum as o,
  optionalFiniteNumberSchema as r,
  stringEnum as s,
  channelTargetSchema as t,
};
