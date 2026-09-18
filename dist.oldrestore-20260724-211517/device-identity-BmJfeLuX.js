import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  a as normalizeEd25519PublicKeyBase64Url,
  c as verifyEd25519Signature,
  i as ed25519PublicKeyPemFromRaw,
  n as deriveEd25519PublicKeyRaw,
  o as publicKeyRawBase64UrlFromEd25519Pem,
  r as ed25519PrivateKeyPemFromRaw,
  s as signEd25519Payload,
  t as base64UrlDecode,
} from "./ed25519-signature-puT_ou6K.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { n as privateFileStoreSync } from "./private-file-store-BSksaLX_.js";
//#region src/infra/device-identity.ts
function resolveDefaultIdentityPath() {
  return path.join(resolveStateDir(), "identity", "device.json");
}
const publicKeyPemFromRaw = ed25519PublicKeyPemFromRaw;
const privateKeyPemFromRaw = ed25519PrivateKeyPemFromRaw;
function fingerprintPublicKey(publicKeyPem) {
  const raw = deriveEd25519PublicKeyRaw(publicKeyPem);
  return crypto.createHash("sha256").update(raw).digest("hex");
}
function tryFingerprintPublicKey(publicKeyPem) {
  try {
    return fingerprintPublicKey(publicKeyPem);
  } catch {
    return null;
  }
}
function keyPairMatches(publicKeyPem, privateKeyPem) {
  try {
    const payload = Buffer.from("openclaw-device-identity-self-check", "utf8");
    const signature = crypto.sign(null, payload, crypto.createPrivateKey(privateKeyPem));
    return crypto.verify(null, payload, crypto.createPublicKey(publicKeyPem), signature);
  } catch {
    return false;
  }
}
function generateIdentity() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
  const publicKeyPem = publicKey.export({
    type: "spki",
    format: "pem",
  });
  const privateKeyPem = privateKey.export({
    type: "pkcs8",
    format: "pem",
  });
  return {
    deviceId: fingerprintPublicKey(publicKeyPem),
    publicKeyPem,
    privateKeyPem,
  };
}
function isRecord(value) {
  return Boolean(value) && typeof value === "object";
}
function hasRecognizedIdentityShape(parsed) {
  return (
    isRecord(parsed) &&
    ("publicKeyPem" in parsed ||
      "privateKeyPem" in parsed ||
      "publicKey" in parsed ||
      "privateKey" in parsed)
  );
}
function normalizeStoredIdentity(parsed) {
  if (
    isRecord(parsed) &&
    "version" in parsed &&
    parsed.version === 1 &&
    "deviceId" in parsed &&
    typeof parsed.deviceId === "string" &&
    "publicKeyPem" in parsed &&
    typeof parsed.publicKeyPem === "string" &&
    "privateKeyPem" in parsed &&
    typeof parsed.privateKeyPem === "string"
  ) {
    const stored = parsed;
    const derivedId = tryFingerprintPublicKey(stored.publicKeyPem);
    if (!derivedId || !keyPairMatches(stored.publicKeyPem, stored.privateKeyPem))
      return { kind: "recognized-invalid" };
    const identity = {
      deviceId: derivedId,
      publicKeyPem: stored.publicKeyPem,
      privateKeyPem: stored.privateKeyPem,
    };
    return derivedId === stored.deviceId
      ? {
          kind: "identity",
          identity,
          validForReadOnly: true,
        }
      : {
          kind: "identity",
          identity,
          validForReadOnly: false,
          stored: {
            ...stored,
            deviceId: derivedId,
          },
        };
  }
  if (
    isRecord(parsed) &&
    !("version" in parsed) &&
    "deviceId" in parsed &&
    typeof parsed.deviceId === "string" &&
    "publicKey" in parsed &&
    typeof parsed.publicKey === "string" &&
    "privateKey" in parsed &&
    typeof parsed.privateKey === "string"
  ) {
    const stored = parsed;
    const publicKeyRaw = base64UrlDecode(stored.publicKey);
    const privateKeyRaw = base64UrlDecode(stored.privateKey);
    if (publicKeyRaw.length !== 32 || privateKeyRaw.length !== 32)
      return { kind: "recognized-invalid" };
    const publicKeyPem = publicKeyPemFromRaw(publicKeyRaw);
    const privateKeyPem = privateKeyPemFromRaw(privateKeyRaw);
    if (!keyPairMatches(publicKeyPem, privateKeyPem)) return { kind: "recognized-invalid" };
    const derivedId = fingerprintPublicKey(publicKeyPem);
    const validForReadOnly = derivedId === stored.deviceId;
    const migrated = {
      version: 1,
      deviceId: derivedId,
      publicKeyPem,
      privateKeyPem,
      createdAtMs:
        typeof stored.createdAtMs === "number" && Number.isFinite(stored.createdAtMs)
          ? stored.createdAtMs
          : Date.now(),
    };
    return {
      kind: "identity",
      identity: {
        deviceId: derivedId,
        publicKeyPem,
        privateKeyPem,
      },
      validForReadOnly,
      stored: migrated,
    };
  }
  return hasRecognizedIdentityShape(parsed) ? { kind: "recognized-invalid" } : null;
}
function identityFileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
/** Load a valid persisted identity, repair/migrate when safe, or create a new one. */
function loadOrCreateDeviceIdentity(filePath = resolveDefaultIdentityPath()) {
  try {
    const store = privateFileStoreSync(path.dirname(filePath));
    const normalized = normalizeStoredIdentity(store.readJsonIfExists(path.basename(filePath)));
    if (normalized?.kind === "identity") {
      if (normalized.stored)
        try {
          store.writeJson(path.basename(filePath), normalized.stored, { trailingNewline: true });
        } catch {}
      return normalized.identity;
    }
    if (normalized?.kind === "recognized-invalid") return generateIdentity();
    if (identityFileExists(filePath)) return generateIdentity();
  } catch {
    if (identityFileExists(filePath)) return generateIdentity();
  }
  const identity = generateIdentity();
  const stored = {
    version: 1,
    deviceId: identity.deviceId,
    publicKeyPem: identity.publicKeyPem,
    privateKeyPem: identity.privateKeyPem,
    createdAtMs: Date.now(),
  };
  privateFileStoreSync(path.dirname(filePath)).writeJson(path.basename(filePath), stored, {
    trailingNewline: true,
  });
  return identity;
}
let processDeviceIdentity;
/**
 * Keep one identity stable for the lifetime of the active state-dir process.
 * Recognizable invalid stores yield transient keys, so independent reloads would split gateway ownership.
 */
function loadOrCreateProcessDeviceIdentity(filePath = resolveDefaultIdentityPath()) {
  if (processDeviceIdentity?.filePath === filePath) return processDeviceIdentity.identity;
  const identity = loadOrCreateDeviceIdentity(filePath);
  processDeviceIdentity = {
    filePath,
    identity,
  };
  return identity;
}
/** Load a valid persisted device identity without creating, repairing, or migrating files. */
function loadDeviceIdentityIfPresent(filePath = resolveDefaultIdentityPath()) {
  try {
    const normalized = normalizeStoredIdentity(
      privateFileStoreSync(path.dirname(filePath)).readJsonIfExists(path.basename(filePath)),
    );
    if (normalized?.kind !== "identity" || !normalized.validForReadOnly) return null;
    return normalized.identity;
  } catch {
    return null;
  }
}
/** Sign a UTF-8 payload with a PEM Ed25519 private key and return base64url bytes. */
function signDevicePayload(privateKeyPem, payload) {
  return signEd25519Payload(privateKeyPem, payload);
}
/** Normalize PEM or raw base64/base64url public keys to canonical raw base64url bytes. */
function normalizeDevicePublicKeyBase64Url(publicKey) {
  return normalizeEd25519PublicKeyBase64Url(publicKey);
}
/** Derive the stable device id from PEM or raw base64/base64url public key material. */
function deriveDeviceIdFromPublicKey(publicKey) {
  try {
    const raw = publicKey.includes("BEGIN")
      ? deriveEd25519PublicKeyRaw(publicKey)
      : base64UrlDecode(publicKey);
    if (raw.length === 0) return null;
    return crypto.createHash("sha256").update(raw).digest("hex");
  } catch {
    return null;
  }
}
/** Export a PEM Ed25519 public key as canonical raw base64url bytes. */
function publicKeyRawBase64UrlFromPem(publicKeyPem) {
  return publicKeyRawBase64UrlFromEd25519Pem(publicKeyPem);
}
/** Verify a UTF-8 payload signature against PEM or raw base64/base64url public key material. */
function verifyDeviceSignature(publicKey, payload, signatureBase64Url) {
  return verifyEd25519Signature({
    publicKey,
    payload,
    signatureBase64Url,
  });
}
//#endregion
export {
  normalizeDevicePublicKeyBase64Url as a,
  verifyDeviceSignature as c,
  loadOrCreateProcessDeviceIdentity as i,
  loadDeviceIdentityIfPresent as n,
  publicKeyRawBase64UrlFromPem as o,
  loadOrCreateDeviceIdentity as r,
  signDevicePayload as s,
  deriveDeviceIdFromPublicKey as t,
};
