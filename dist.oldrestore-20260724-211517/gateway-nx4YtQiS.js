import { X509Certificate } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { t as normalizeFingerprint } from "./fingerprint-BRiEKKMN.js";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { t as resolveSystemBin } from "./resolve-system-bin-DHY7NQuY.js";
import { m as shortenHomeInString, s as ensureDir, t as CONFIG_DIR } from "./utils-DtcDeqWS.js";
import "node:tls";
//#region src/infra/tls/gateway.ts
async function generateSelfSignedCert(params) {
  const certDir = path.dirname(params.certPath);
  const keyDir = path.dirname(params.keyPath);
  await ensureDir(certDir);
  if (keyDir !== certDir) await ensureDir(keyDir);
  const opensslBin = resolveSystemBin("openssl");
  if (!opensslBin)
    throw new Error(
      "openssl not found in trusted system directories. Install it in an OS-managed location.",
    );
  await runExec(
    opensslBin,
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-sha256",
      "-days",
      "3650",
      "-nodes",
      "-keyout",
      params.keyPath,
      "-out",
      params.certPath,
      "-subj",
      "/CN=openclaw-gateway",
    ],
    { logOutput: false },
  );
  await fs.chmod(params.keyPath, 384).catch(() => {});
  await fs.chmod(params.certPath, 384).catch(() => {});
  params.log?.info?.(
    `gateway tls: generated self-signed cert at ${shortenHomeInString(params.certPath)}`,
  );
}
/** Load or generate gateway TLS material and return server-ready TLS options. */
async function loadGatewayTlsRuntime(cfg, log) {
  if (!cfg || cfg.enabled !== true)
    return {
      enabled: false,
      required: false,
    };
  const autoGenerate = cfg.autoGenerate !== false;
  const baseDir = path.join(CONFIG_DIR, "gateway", "tls");
  const certPath = resolveUserPath(
    typeof cfg.certPath === "string" && cfg.certPath.trim()
      ? cfg.certPath
      : path.join(baseDir, "gateway-cert.pem"),
  );
  const keyPath = resolveUserPath(
    typeof cfg.keyPath === "string" && cfg.keyPath.trim()
      ? cfg.keyPath
      : path.join(baseDir, "gateway-key.pem"),
  );
  const caPath = cfg.caPath ? resolveUserPath(cfg.caPath) : void 0;
  const hasCert = await pathExists(certPath);
  const hasKey = await pathExists(keyPath);
  if (!hasCert && !hasKey && autoGenerate)
    try {
      await generateSelfSignedCert({
        certPath,
        keyPath,
        log,
      });
    } catch (err) {
      return {
        enabled: false,
        required: true,
        certPath,
        keyPath,
        error: `gateway tls: failed to generate cert (${String(err)})`,
      };
    }
  if (!(await pathExists(certPath)) || !(await pathExists(keyPath)))
    return {
      enabled: false,
      required: true,
      certPath,
      keyPath,
      error: "gateway tls: cert/key missing",
    };
  try {
    const cert = await fs.readFile(certPath, "utf8");
    const key = await fs.readFile(keyPath, "utf8");
    const ca = caPath ? await fs.readFile(caPath, "utf8") : void 0;
    const fingerprintSha256 = normalizeFingerprint(new X509Certificate(cert).fingerprint256 ?? "");
    if (!fingerprintSha256)
      return {
        enabled: false,
        required: true,
        certPath,
        keyPath,
        caPath,
        error: "gateway tls: unable to compute certificate fingerprint",
      };
    return {
      enabled: true,
      required: true,
      certPath,
      keyPath,
      caPath,
      fingerprintSha256,
      tlsOptions: {
        cert,
        key,
        ca,
        minVersion: "TLSv1.3",
      },
    };
  } catch (err) {
    return {
      enabled: false,
      required: true,
      certPath,
      keyPath,
      caPath,
      error: `gateway tls: failed to load cert (${String(err)})`,
    };
  }
}
//#endregion
export { loadGatewayTlsRuntime as t };
