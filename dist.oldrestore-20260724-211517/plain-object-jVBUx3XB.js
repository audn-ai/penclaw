//#region src/infra/plain-object.ts
/**
 * Strict plain-object guard (excludes arrays and host objects).
 */
function isPlainObject(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}
//#endregion
export { isPlainObject as t };
