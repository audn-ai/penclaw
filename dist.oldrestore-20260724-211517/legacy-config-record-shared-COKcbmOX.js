import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./utils-DtcDeqWS.js";
//#region src/commands/doctor/shared/legacy-config-record-shared.ts
/** Clone a record-like config section, treating undefined as an empty object. */
function cloneRecord(value) {
  return { ...value };
}
/** Ensure a nested config value is a mutable record and return it. */
function ensureRecord(target, key) {
  const current = target[key];
  if (isRecord(current)) return current;
  const next = {};
  target[key] = next;
  return next;
}
/** Own-property guard used by migrations that must preserve falsy values. */
function hasOwnKey(target, key) {
  return Object.hasOwn(target, key);
}
//#endregion
export { ensureRecord as n, hasOwnKey as r, cloneRecord as t };
