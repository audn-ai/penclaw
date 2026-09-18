import {
  a as normalizeEd25519PublicKeyBase64Url,
  l as verifyEd25519SignatureBytes,
} from "./ed25519-signature-puT_ou6K.js";
import "./utils-DtcDeqWS.js";
import { i as isOfficialExternalPluginCatalogFeed } from "./official-external-plugin-catalog-B2V9K3em.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/plugins/official-external-plugin-catalog-envelope.ts
const OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PAYLOAD_TYPE =
  "openclaw.official-external-plugin-catalog-feed.v1";
const OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_SIGNATURES = 16;
function createOfficialExternalPluginCatalogEnvelopeSigningInput(params) {
  return dssePreAuthenticationEncoding(params.payloadType, params.payloadBytes);
}
function verifyOfficialExternalPluginCatalogSignedEnvelope(raw, params) {
  const envelope = parseOfficialExternalPluginCatalogSignedEnvelope(raw);
  if (!envelope)
    return {
      ok: false,
      error: "invalid-envelope",
      message: "hosted catalog signed envelope is malformed",
    };
  if (envelope.payloadType !== OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PAYLOAD_TYPE)
    return {
      ok: false,
      error: "unsupported-payload",
      message: "hosted catalog signed envelope payload type is unsupported",
    };
  const payloadBytes = decodeOfficialExternalPluginCatalogEnvelopePayloadBytes(envelope.payload);
  if (!payloadBytes)
    return {
      ok: false,
      error: "invalid-payload",
      message: "hosted catalog signed envelope payload is invalid",
    };
  const signingInput = createOfficialExternalPluginCatalogEnvelopeSigningInput({
    payloadType: envelope.payloadType,
    payloadBytes,
  });
  const threshold = Math.max(1, Math.trunc(params.threshold ?? 1));
  const trustedSignatureKeyIds = [];
  const trustedSignaturePublicKeys = /* @__PURE__ */ new Set();
  for (const envelopeSignature of envelope.signatures) {
    const keyId = envelopeSignature.keyId;
    const trustedKey = params.trustedKeys.find((candidate) => candidate.keyId === keyId);
    if (!trustedKey || trustedSignatureKeyIds.includes(trustedKey.keyId)) continue;
    const normalizedPublicKey = normalizeEd25519PublicKeyBase64Url(trustedKey.publicKey);
    if (!normalizedPublicKey || trustedSignaturePublicKeys.has(normalizedPublicKey)) continue;
    if (
      verifyEd25519SignatureBytes({
        publicKey: trustedKey.publicKey,
        payload: signingInput,
        signatureBase64Url: envelopeSignature.signature,
      })
    ) {
      trustedSignatureKeyIds.push(trustedKey.keyId);
      trustedSignaturePublicKeys.add(normalizedPublicKey);
      if (trustedSignaturePublicKeys.size >= threshold) break;
    }
  }
  if (trustedSignaturePublicKeys.size >= threshold) {
    const feed = decodeOfficialExternalPluginCatalogEnvelopePayload(payloadBytes);
    if (!feed)
      return {
        ok: false,
        error: "invalid-payload",
        message: "hosted catalog signed envelope payload is invalid",
      };
    return {
      ok: true,
      feed,
      signedBy: trustedSignatureKeyIds[0] ?? "",
      ...(threshold > 1
        ? {
            signedByKeyIds: trustedSignatureKeyIds,
            signatureCount: trustedSignaturePublicKeys.size,
            threshold,
          }
        : {}),
    };
  }
  return envelope.signatures.some((signature) =>
    params.trustedKeys.some((key) => key.keyId === signature.keyId),
  )
    ? {
        ok: false,
        error: "invalid-signature",
        message:
          trustedSignatureKeyIds.length > 0
            ? "hosted catalog signed envelope did not meet the configured signature threshold"
            : "hosted catalog signed envelope signature is invalid",
      }
    : {
        ok: false,
        error: "missing-trust-key",
        message: "hosted catalog signed envelope was not signed by a trusted key",
      };
}
function parseOfficialExternalPluginCatalogSignedEnvelope(raw) {
  if (!isRecord(raw) || raw.schemaVersion !== 1) return null;
  const payloadType = raw.payloadType;
  const payload = raw.payload;
  const signatures = raw.signatures;
  if (typeof payloadType !== "string" || typeof payload !== "string") return null;
  if (!Array.isArray(signatures) || signatures.length === 0) return null;
  if (signatures.length > OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_SIGNATURES) return null;
  const parsedSignatures = signatures.filter(
    (signature) =>
      isRecord(signature) &&
      typeof signature.keyId === "string" &&
      signature.keyId.trim().length > 0 &&
      signature.algorithm === "ed25519" &&
      typeof signature.signature === "string" &&
      signature.signature.trim().length > 0,
  );
  if (parsedSignatures.length === 0) return null;
  if (parsedSignatures.length > OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_SIGNATURES) return null;
  const keyIds = /* @__PURE__ */ new Set();
  for (const signature of parsedSignatures) {
    if (keyIds.has(signature.keyId)) return null;
    keyIds.add(signature.keyId);
  }
  return {
    payloadType,
    payload,
    signatures: parsedSignatures,
  };
}
function dssePreAuthenticationEncoding(payloadType, payloadBytes) {
  const payloadTypeBytes = Buffer.from(payloadType, "utf8");
  const prefix = Buffer.from(
    `DSSEv1 ${payloadTypeBytes.length} ${payloadType} ${payloadBytes.length} `,
    "utf8",
  );
  return Buffer.concat([prefix, payloadBytes]);
}
function decodeOfficialExternalPluginCatalogEnvelopePayloadBytes(payload) {
  try {
    return Buffer.from(payload, "base64");
  } catch {
    return null;
  }
}
function decodeOfficialExternalPluginCatalogEnvelopePayload(payloadBytes) {
  try {
    const raw = JSON.parse(payloadBytes.toString("utf8"));
    return isOfficialExternalPluginCatalogFeed(raw) ? raw : null;
  } catch {
    return null;
  }
}
//#endregion
export { verifyOfficialExternalPluginCatalogSignedEnvelope };
