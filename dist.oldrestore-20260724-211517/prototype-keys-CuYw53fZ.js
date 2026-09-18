//#region src/infra/prototype-keys.ts
const BLOCKED_OBJECT_KEYS = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
/** Return true when assigning `key` could mutate an object prototype. */
function isBlockedObjectKey(key) {
  return BLOCKED_OBJECT_KEYS.has(key);
}
//#endregion
export { isBlockedObjectKey as t };
