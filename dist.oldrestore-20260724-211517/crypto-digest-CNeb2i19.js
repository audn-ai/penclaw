import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
//#region src/infra/crypto-digest.ts
function sha256Hex(input) {
  return createHash("sha256").update(input).digest("hex");
}
function sha256Base64(input) {
  return createHash("sha256").update(input).digest("base64");
}
function sha256Base64Url(input) {
  return createHash("sha256").update(input).digest("base64url");
}
function sha256Base64UrlPrefix(input, length) {
  return sha256Base64Url(input).slice(0, length);
}
function sha256HexPrefix(input, length) {
  return sha256Hex(input).slice(0, length);
}
async function sha256File(filePath) {
  const digest = createHash("sha256");
  try {
    for await (const chunk of createReadStream(filePath)) digest.update(chunk);
  } catch (err) {
    throw new Error(
      `Failed to hash file ${filePath}: ${err instanceof Error ? err.message : String(err)}`,
      { cause: err },
    );
  }
  return digest.digest("hex");
}
//#endregion
export {
  sha256Hex as a,
  sha256File as i,
  sha256Base64Url as n,
  sha256HexPrefix as o,
  sha256Base64UrlPrefix as r,
  sha256Base64 as t,
};
