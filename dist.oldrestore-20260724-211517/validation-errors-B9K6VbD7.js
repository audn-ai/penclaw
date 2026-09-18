//#region packages/gateway-protocol/src/validation-errors.ts
function firstStringParam(value) {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value))
    return value.find((entry) => typeof entry === "string" && entry.trim().length > 0);
}
/** Convert validator errors into compact operator-facing failure text. */
function formatValidationErrors(errors) {
  if (!errors?.length) return "unknown validation error";
  const parts = [];
  for (const err of errors) {
    const keyword = typeof err?.keyword === "string" ? err.keyword : "";
    const instancePath = typeof err?.instancePath === "string" ? err.instancePath : "";
    if (keyword === "additionalProperties") {
      const additionalProperty =
        firstStringParam(err?.params?.additionalProperty) ??
        firstStringParam(err?.params?.additionalProperties);
      if (additionalProperty) {
        const where = instancePath ? `at ${instancePath}` : "at root";
        parts.push(`${where}: unexpected property '${additionalProperty}'`);
        continue;
      }
    }
    if (keyword === "required") {
      const missingProperty =
        firstStringParam(err?.params?.missingProperty) ??
        firstStringParam(err?.params?.requiredProperties);
      if (missingProperty) {
        const where = instancePath ? `at ${instancePath}: ` : "";
        parts.push(`${where}must have required property '${missingProperty}'`);
        continue;
      }
    }
    const failingKeyword =
      typeof err?.params?.failingKeyword === "string" ? err.params.failingKeyword : "";
    const message =
      keyword === "then" || (keyword === "if" && failingKeyword === "then")
        ? "must have required conditional properties"
        : typeof err?.message === "string" && err.message.trim()
          ? err.message
          : "validation error";
    const where = instancePath ? `at ${instancePath}: ` : "";
    parts.push(`${where}${message}`);
  }
  const unique = [...new Set(parts.filter((part) => part.trim()))];
  return unique.length > 0 ? unique.join("; ") : "unknown validation error";
}
//#endregion
export { formatValidationErrors as t };
