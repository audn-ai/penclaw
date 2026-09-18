//#region src/utils/zod-parse.ts
/**
 * Null-returning Zod parse helpers for plugin and runtime boundaries.
 *
 * Callers use these where invalid external payloads should be ignored or
 * recovered from without constructing and catching validation errors.
 */
/** Safely validates an unknown value with a Zod schema, returning null on validation failure. */
function safeParseWithSchema(schema, value) {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
/** Parses JSON, then safely validates it with a Zod schema, returning null for parse or schema failures. */
function safeParseJsonWithSchema(schema, raw) {
  try {
    return safeParseWithSchema(schema, JSON.parse(raw));
  } catch {
    return null;
  }
}
//#endregion
export { safeParseWithSchema as n, safeParseJsonWithSchema as t };
