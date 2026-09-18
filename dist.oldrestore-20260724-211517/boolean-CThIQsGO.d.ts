//#region src/utils/boolean.d.ts
/**
 * Shared boolean coercion helpers for config, env, and plugin SDK runtime inputs.
 *
 * `asBoolean` is intentionally strict; string parsing is opt-in through
 * `parseBooleanValue` so schema callers do not silently accept ambiguous text.
 */
/** Accepted string literals for boolean parsing beyond actual booleans. */
type BooleanParseOptions = {
  /** Lowercase string values that should parse as true. */ truthy?: string[] /** Lowercase string values that should parse as false. */;
  falsy?: string[];
};
/** Returns only real boolean values and leaves boolean-like strings for explicit parsing. */
declare function asBoolean(value: unknown): boolean | undefined;
/** Parses booleans and configured string literals, returning undefined for ambiguous input. */
declare function parseBooleanValue(
  value: unknown,
  options?: BooleanParseOptions,
): boolean | undefined;
//#endregion
export { parseBooleanValue as n, asBoolean as t };
