import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./src-Bl7G9qvi.js";
import { t as isPlainObject } from "./plain-object-jVBUx3XB.js";
import "./utils-DtcDeqWS.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
//#region src/config/config-paths.ts
function setOwnConfigProperty(node, key, value) {
  if (Object.hasOwn(node, key)) {
    node[key] = value;
    return;
  }
  Object.defineProperty(node, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}
/** Parses CLI/config dot-notation paths and rejects unsafe object-key segments. */
function parseConfigPath(raw) {
  const trimmed = raw.trim();
  if (!trimmed)
    return {
      ok: false,
      error: "Invalid path. Use dot notation (e.g. foo.bar).",
    };
  const parts = trimmed.split(".").map((part) => part.trim());
  if (parts.some((part) => !part))
    return {
      ok: false,
      error: "Invalid path. Use dot notation (e.g. foo.bar).",
    };
  if (parts.some((part) => isBlockedObjectKey(part)))
    return {
      ok: false,
      error: "Invalid path segment.",
    };
  return {
    ok: true,
    path: parts,
  };
}
/** Sets a value at a validated config path, creating missing plain-object parents. */
function setConfigValueAtPath(root, path, value) {
  const leafKey = path.at(-1);
  if (leafKey === void 0) throw new Error("Config path must contain at least one segment");
  let cursor = root;
  for (const key of path.slice(0, -1)) {
    const existing = Object.hasOwn(cursor, key) ? cursor[key] : void 0;
    const next = isPlainObject(existing) ? existing : {};
    if (next !== existing) setOwnConfigProperty(cursor, key, next);
    cursor = next;
  }
  setOwnConfigProperty(cursor, leafKey, value);
}
/** Removes a value at a config path and prunes empty parent objects created by setters. */
function unsetConfigValueAtPath(root, path) {
  const leafKey = path.at(-1);
  if (leafKey === void 0) return false;
  const stack = [];
  let cursor = root;
  for (const key of path.slice(0, -1)) {
    if (!Object.hasOwn(cursor, key)) return false;
    const next = cursor[key];
    if (!isPlainObject(next)) return false;
    stack.push({
      node: cursor,
      key,
    });
    cursor = next;
  }
  if (!Object.hasOwn(cursor, leafKey)) return false;
  delete cursor[leafKey];
  for (let idx = stack.length - 1; idx >= 0; idx -= 1) {
    const { node, key } = expectDefined(stack[idx], "stack entry at idx");
    const child = node[key];
    if (isPlainObject(child) && Object.keys(child).length === 0) delete node[key];
    else break;
  }
  return true;
}
/** Reads a value from a config path, stopping at the first non-plain-object parent. */
function getConfigValueAtPath(root, path) {
  let cursor = root;
  for (const key of path) {
    if (!isPlainObject(cursor) || !Object.hasOwn(cursor, key)) return;
    cursor = cursor[key];
  }
  return cursor;
}
//#endregion
export {
  unsetConfigValueAtPath as i,
  parseConfigPath as n,
  setConfigValueAtPath as r,
  getConfigValueAtPath as t,
};
