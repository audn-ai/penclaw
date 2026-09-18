import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
//#region src/infra/deep-merge.ts
function sanitizePlainObject(value) {
  const sanitized = {};
  for (const [key, entry] of Object.entries(value)) {
    if (isBlockedObjectKey(key)) continue;
    sanitized[key] = isPlainObject(entry) ? sanitizePlainObject(entry) : entry;
  }
  return sanitized;
}
/** Merge plain objects while preserving OpenClaw's null, undefined, and array policies. */
function mergeDeep(base, override, options = {}) {
  const arrays = options.arrays ?? "replace";
  const undefinedValues = options.undefinedValues ?? "skip";
  if (Array.isArray(base) && Array.isArray(override))
    return arrays === "concat" ? [...base, ...override] : override;
  if (!isPlainObject(base) || !isPlainObject(override))
    return override === void 0 && undefinedValues === "skip" ? base : override;
  const merged = sanitizePlainObject(base);
  for (const [key, value] of Object.entries(override)) {
    if (isBlockedObjectKey(key) || (value === void 0 && undefinedValues === "skip")) continue;
    const current = merged[key];
    if (isPlainObject(value))
      merged[key] = isPlainObject(current)
        ? mergeDeep(current, value, options)
        : sanitizePlainObject(value);
    else if (arrays === "concat" && Array.isArray(current) && Array.isArray(value))
      merged[key] = [...current, ...value];
    else merged[key] = value;
  }
  return merged;
}
//#endregion
export { mergeDeep as t };
