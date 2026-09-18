import { createHash } from "node:crypto";
//#region node_modules/@openclaw/fs-safe/dist/file-identity.js
function isZero(value) {
  return value === 0 || value === 0n;
}
function sameStatValue(left, right) {
  return typeof left === typeof right ? left === right : BigInt(left) === BigInt(right);
}
function sha256Hex(data, encoding) {
  const buffer = typeof data === "string" ? Buffer.from(data, encoding ?? "utf8") : data;
  return createHash("sha256").update(buffer).digest("hex");
}
function sameFileIdentity(left, right, platform = process.platform) {
  if (!sameStatValue(left.ino, right.ino)) return false;
  if (sameStatValue(left.dev, right.dev)) return true;
  return platform === "win32" && (isZero(left.dev) || isZero(right.dev));
}
//#endregion
export { sha256Hex as n, sameFileIdentity as t };
