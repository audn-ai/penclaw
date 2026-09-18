import crypto from "node:crypto";
//#region src/infra/ed25519-signature.ts
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");
const ED25519_PKCS8_PRIVATE_PREFIX = Buffer.from("302e020100300506032b657004220420", "hex");
function base64UrlEncode(buf) {
  return buf.toString("base64").replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}
const MAX_BASE64URL_DECODE_INPUT_LENGTH = 4096;
function base64UrlDecode(input) {
  if (input.length > MAX_BASE64URL_DECODE_INPUT_LENGTH)
    throw new Error("base64url input exceeds the maximum allowed length");
  const normalized = input.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64");
}
function pemEncode(label, der) {
  return `-----BEGIN ${label}-----\n${
    der
      .toString("base64")
      .match(/.{1,64}/g)
      ?.join("\n") ?? ""
  }\n-----END ${label}-----\n`;
}
function ed25519PublicKeyPemFromRaw(publicKeyRaw) {
  return pemEncode("PUBLIC KEY", Buffer.concat([ED25519_SPKI_PREFIX, publicKeyRaw]));
}
function ed25519PrivateKeyPemFromRaw(privateKeyRaw) {
  return pemEncode("PRIVATE KEY", Buffer.concat([ED25519_PKCS8_PRIVATE_PREFIX, privateKeyRaw]));
}
function deriveEd25519PublicKeyRaw(publicKeyPem) {
  const spki = crypto.createPublicKey(publicKeyPem).export({
    type: "spki",
    format: "der",
  });
  if (
    spki.length === ED25519_SPKI_PREFIX.length + 32 &&
    spki.subarray(0, ED25519_SPKI_PREFIX.length).equals(ED25519_SPKI_PREFIX)
  )
    return spki.subarray(ED25519_SPKI_PREFIX.length);
  return spki;
}
function publicKeyRawBase64UrlFromEd25519Pem(publicKeyPem) {
  return base64UrlEncode(deriveEd25519PublicKeyRaw(publicKeyPem));
}
function normalizeEd25519PublicKeyBase64Url(publicKey) {
  try {
    if (publicKey.includes("BEGIN")) return publicKeyRawBase64UrlFromEd25519Pem(publicKey);
    const raw = base64UrlDecode(publicKey);
    if (raw.length === 0) return null;
    return base64UrlEncode(raw);
  } catch {
    return null;
  }
}
function signEd25519Payload(privateKeyPem, payload) {
  const key = crypto.createPrivateKey(privateKeyPem);
  return base64UrlEncode(crypto.sign(null, Buffer.from(payload, "utf8"), key));
}
function createEd25519PublicKey(publicKey) {
  return publicKey.includes("BEGIN")
    ? crypto.createPublicKey(publicKey)
    : crypto.createPublicKey({
        key: Buffer.concat([ED25519_SPKI_PREFIX, base64UrlDecode(publicKey)]),
        type: "spki",
        format: "der",
      });
}
function verifyEd25519Signature(params) {
  return verifyEd25519SignatureBytes({
    publicKey: params.publicKey,
    payload: Buffer.from(params.payload, "utf8"),
    signatureBase64Url: params.signatureBase64Url,
  });
}
function verifyEd25519SignatureBytes(params) {
  try {
    const key = createEd25519PublicKey(params.publicKey);
    const sig = base64UrlDecode(params.signatureBase64Url);
    return crypto.verify(null, params.payload, key, sig);
  } catch {
    return false;
  }
}
//#endregion
export {
  normalizeEd25519PublicKeyBase64Url as a,
  verifyEd25519Signature as c,
  ed25519PublicKeyPemFromRaw as i,
  verifyEd25519SignatureBytes as l,
  deriveEd25519PublicKeyRaw as n,
  publicKeyRawBase64UrlFromEd25519Pem as o,
  ed25519PrivateKeyPemFromRaw as r,
  signEd25519Payload as s,
  base64UrlDecode as t,
};
