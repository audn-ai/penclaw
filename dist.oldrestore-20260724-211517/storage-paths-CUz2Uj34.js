import crypto from "node:crypto";
import path from "node:path";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region extensions/matrix/src/storage-paths.ts
function sanitizeMatrixPathSegment(value) {
  return (
    normalizeLowercaseStringOrEmpty(value)
      .replace(/[^a-z0-9._-]+/g, "_")
      .replace(/^_+|_+$/g, "") || "unknown"
  );
}
function resolveMatrixHomeserverKey(homeserver) {
  try {
    const url = new URL(homeserver);
    if (url.host) return sanitizeMatrixPathSegment(url.host);
  } catch {}
  return sanitizeMatrixPathSegment(homeserver);
}
function hashMatrixAccessToken(accessToken) {
  return crypto.createHash("sha256").update(accessToken).digest("hex").slice(0, 16);
}
function resolveMatrixCredentialsFilename(accountId) {
  const normalized = normalizeAccountId(accountId);
  return normalized === "default" ? "credentials.json" : `credentials-${normalized}.json`;
}
function resolveMatrixCredentialsDir(stateDir) {
  return path.join(stateDir, "credentials", "matrix");
}
function resolveMatrixCredentialsPath(params) {
  return path.join(
    resolveMatrixCredentialsDir(params.stateDir),
    resolveMatrixCredentialsFilename(params.accountId),
  );
}
function resolveMatrixAccountStorageRoot(params) {
  const accountKey = sanitizeMatrixPathSegment(params.accountId ?? "default");
  const userKey = sanitizeMatrixPathSegment(params.userId);
  const serverKey = resolveMatrixHomeserverKey(params.homeserver);
  const tokenHash = hashMatrixAccessToken(params.accessToken);
  return {
    rootDir: path.join(
      params.stateDir,
      "matrix",
      "accounts",
      accountKey,
      `${serverKey}__${userKey}`,
      tokenHash,
    ),
    accountKey,
    tokenHash,
  };
}
//#endregion
export {
  resolveMatrixCredentialsPath as a,
  resolveMatrixCredentialsFilename as i,
  resolveMatrixAccountStorageRoot as n,
  resolveMatrixHomeserverKey as o,
  resolveMatrixCredentialsDir as r,
  sanitizeMatrixPathSegment as s,
  hashMatrixAccessToken as t,
};
