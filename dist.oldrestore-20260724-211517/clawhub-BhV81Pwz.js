import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { s as visibleWidth } from "./ansi-D4OHEz5F.js";
import {
  d as DEFAULT_MAX_ARCHIVE_BYTES_ZIP,
  f as DEFAULT_MAX_ENTRIES,
  l as ARCHIVE_LIMIT_ERROR_CODE,
  m as DEFAULT_MAX_EXTRACTED_BYTES,
  n as loadZipArchiveWithPreflight,
  p as DEFAULT_MAX_ENTRY_BYTES,
  u as ArchiveLimitError,
} from "./archive-CR1500gV.js";
import {
  C as resolveClawHubBaseUrl,
  E as satisfiesPluginApiRange,
  T as satisfiesGatewayMinimum,
  b as normalizeClawHubSha256Integrity,
  l as fetchClawHubPackageVersion,
  o as fetchClawHubPackageArtifact,
  r as downloadClawHubPackageArchive,
  s as fetchClawHubPackageDetail,
  t as ClawHubRequestError,
  v as isDefaultClawHubBaseUrl,
  w as resolveLatestVersionFromPackage,
  y as normalizeClawHubSha256Hex,
} from "./clawhub-CgGOpxts.js";
import { t as CLAWHUB_INSTALL_ERROR_CODE } from "./clawhub-error-codes-OgrR1N6P.js";
import { n as ensureClawHubPackageTrustAcknowledged } from "./clawhub-install-trust-BIciJavS.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-CzLwxQg_.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./archive-CBe_wA_B.js";
import {
  n as installPluginFromArchive,
  t as PLUGIN_INSTALL_ERROR_CODE,
} from "./install-CjCRVnj8.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { t as formatTerminalLink } from "./terminal-link-GrnqEUaJ.js";
import { o as resolveCompatibilityHostVersion } from "./version-CeFj_iGk.js";
import "jszip";
//#region src/plugins/clawhub.ts
const CLAWHUB_GENERATED_ARCHIVE_METADATA_FILE = "_meta.json";
function normalizeClawHubClawPackInstallFields(clawpack) {
  const isNpmPackArtifact =
    clawpack && "kind" in clawpack && normalizeOptionalString(clawpack.kind) === "npm-pack";
  const isLegacyClawPack = clawpack && "available" in clawpack && clawpack.available;
  if (!isNpmPackArtifact && !isLegacyClawPack) return {};
  const clawpackSha256 =
    typeof clawpack.sha256 === "string" ? normalizeClawHubSha256Hex(clawpack.sha256) : null;
  const clawpackManifestSha256 =
    "manifestSha256" in clawpack && typeof clawpack.manifestSha256 === "string"
      ? normalizeClawHubSha256Hex(clawpack.manifestSha256)
      : null;
  const clawpackSpecVersion =
    "specVersion" in clawpack &&
    typeof clawpack.specVersion === "number" &&
    Number.isSafeInteger(clawpack.specVersion) &&
    clawpack.specVersion >= 0
      ? clawpack.specVersion
      : void 0;
  const clawpackSize =
    typeof clawpack.size === "number" && Number.isSafeInteger(clawpack.size) && clawpack.size >= 0
      ? clawpack.size
      : void 0;
  const npmIntegrity = normalizeOptionalString(clawpack.npmIntegrity);
  const npmShasum = normalizeOptionalString(clawpack.npmShasum);
  const npmTarballName = normalizeOptionalString(clawpack.npmTarballName);
  return {
    artifactKind: "npm-pack",
    artifactFormat: "tgz",
    ...(npmIntegrity ? { npmIntegrity } : {}),
    ...(npmShasum ? { npmShasum } : {}),
    ...(npmTarballName ? { npmTarballName } : {}),
    ...(clawpackSha256 ? { clawpackSha256 } : {}),
    ...(clawpackSpecVersion !== void 0 ? { clawpackSpecVersion } : {}),
    ...(clawpackManifestSha256 ? { clawpackManifestSha256 } : {}),
    ...(clawpackSize !== void 0 ? { clawpackSize } : {}),
  };
}
function isTrustedSourceLinkedOfficialPackage(pkg) {
  const sourceRepo = normalizeOptionalString(pkg.verification?.sourceRepo);
  return (
    pkg.channel === "official" &&
    pkg.isOfficial &&
    pkg.verification?.tier === "source-linked" &&
    (sourceRepo === "openclaw/openclaw" ||
      sourceRepo === "github.com/openclaw/openclaw" ||
      sourceRepo === "https://github.com/openclaw/openclaw")
  );
}
function isDefaultOfficialClawHubPackage(params) {
  return (
    isDefaultClawHubBaseUrl(params.baseUrl) &&
    (params.pkg.channel === "official" || params.pkg.isOfficial)
  );
}
function resolveClawHubClawPackArtifactSha256(clawpack) {
  const isNpmPackArtifact =
    clawpack && "kind" in clawpack && normalizeOptionalString(clawpack.kind) === "npm-pack";
  const isLegacyClawPack = clawpack && "available" in clawpack && clawpack.available;
  if ((!isNpmPackArtifact && !isLegacyClawPack) || typeof clawpack.sha256 !== "string") return null;
  return normalizeClawHubSha256Hex(clawpack.sha256);
}
function resolveClawHubNpmIntegrity(clawpack) {
  return normalizeOptionalString(clawpack?.npmIntegrity) ?? null;
}
function resolveClawHubNpmShasum(clawpack) {
  return normalizeOptionalString(clawpack?.npmShasum) ?? null;
}
function resolveClawHubNpmTarballName(clawpack) {
  return normalizeOptionalString(clawpack?.npmTarballName) ?? null;
}
function resolveClawHubNpmPackArtifact(version) {
  if (version.artifact?.kind === "npm-pack") return version.artifact;
  if (version.clawpack?.available === true) return version.clawpack;
  return null;
}
function readArtifactResolverVersion(response, requestedVersion) {
  if (response.version && typeof response.version === "object" && !Array.isArray(response.version))
    return response.version;
  if (typeof response.version === "string" && response.version.trim().length > 0)
    return { version: response.version.trim() };
  return { version: requestedVersion };
}
function isClawHubPackageFamily(value) {
  return value === "code-plugin" || value === "bundle-plugin" || value === "skill";
}
function normalizeArtifactResolverFiles(files) {
  if (!Array.isArray(files)) return;
  return files;
}
function resolveTopLevelNpmPackArtifact(artifact) {
  const wire = artifact;
  if ((wire?.artifactKind ?? wire?.kind) !== "npm-pack") return null;
  if (typeof wire?.npmIntegrity !== "string") return null;
  return {
    kind: "npm-pack",
    format: "tgz",
    sha256: wire.artifactSha256 ?? wire.sha256 ?? null,
    npmIntegrity: wire.npmIntegrity,
    npmShasum: wire.npmShasum ?? null,
    downloadUrl: wire.downloadUrl ?? null,
  };
}
function resolveTopLevelLegacyArchiveVerification(artifact) {
  const wire = artifact;
  const artifactKind = wire?.artifactKind ?? wire?.kind;
  const artifactSha256 = wire?.artifactSha256 ?? wire?.sha256;
  if (artifactKind !== "legacy-zip" || typeof artifactSha256 !== "string") return null;
  const integrity = normalizeClawHubSha256Integrity(artifactSha256);
  return integrity
    ? {
        kind: "archive-integrity",
        integrity,
      }
    : null;
}
function formatClawHubSpecifier(params) {
  return `clawhub:${params.name}${params.version ? `@${params.version}` : ""}`;
}
function buildClawHubInstallFailure(error, code, warning, version) {
  return {
    ok: false,
    error,
    ...(code ? { code } : {}),
    ...(warning ? { warning } : {}),
    ...(version ? { version } : {}),
  };
}
function isClawHubInstallFailure(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    "ok" in value &&
    Object.is(value.ok, false) &&
    "error" in value,
  );
}
function mapClawHubRequestError(error, context) {
  if (error instanceof ClawHubRequestError && error.status === 404) {
    if (context.stage === "package")
      return buildClawHubInstallFailure(
        "Package not found on ClawHub.",
        CLAWHUB_INSTALL_ERROR_CODE.PACKAGE_NOT_FOUND,
      );
    return buildClawHubInstallFailure(
      `Version not found on ClawHub: ${context.name}@${context.version ?? "unknown"}.`,
      CLAWHUB_INSTALL_ERROR_CODE.VERSION_NOT_FOUND,
    );
  }
  return buildClawHubInstallFailure(formatErrorMessage(error));
}
function encodeClawHubPackagePath(packageName) {
  return packageName
    .split("/")
    .map((part) => encodeURIComponent(part).replaceAll("%40", "@"))
    .join("/");
}
function resolveClawHubPluginUrl(params) {
  return `${resolveClawHubBaseUrl(params.baseUrl)}/plugins/${encodeClawHubPackagePath(params.packageName)}`;
}
function padRight(value, width) {
  return `${value}${" ".repeat(Math.max(0, width - visibleWidth(value)))}`;
}
function formatClawHubReleaseLabel(packageName, version) {
  return `${sanitizeTerminalText(packageName)}@${sanitizeTerminalText(version)}`;
}
function resolveClawHubExpectedRuntimeId(params) {
  const packageRuntimeId = normalizeOptionalString(params.detail.package?.runtimeId);
  const capabilitiesRuntimeId = normalizeOptionalString(
    params.detail.package?.capabilities?.runtimeId,
  );
  if (packageRuntimeId && capabilitiesRuntimeId && packageRuntimeId !== capabilitiesRuntimeId)
    return {
      ok: false,
      error: `ClawHub package runtime id mismatch: package advertises "${sanitizeTerminalText(packageRuntimeId)}" but capabilities advertise "${sanitizeTerminalText(capabilitiesRuntimeId)}".`,
      code: PLUGIN_INSTALL_ERROR_CODE.PLUGIN_ID_MISMATCH,
    };
  const advertisedRuntimeId = packageRuntimeId ?? capabilitiesRuntimeId;
  const expectedPluginId = normalizeOptionalString(params.expectedPluginId);
  if (expectedPluginId && advertisedRuntimeId && expectedPluginId !== advertisedRuntimeId)
    return {
      ok: false,
      error: `ClawHub package runtime id mismatch: expected "${sanitizeTerminalText(expectedPluginId)}", got "${sanitizeTerminalText(advertisedRuntimeId)}".`,
      code: PLUGIN_INSTALL_ERROR_CODE.PLUGIN_ID_MISMATCH,
    };
  const resolvedExpectedPluginId = expectedPluginId ?? advertisedRuntimeId;
  return {
    ok: true,
    ...(resolvedExpectedPluginId ? { expectedPluginId: resolvedExpectedPluginId } : {}),
  };
}
function isMissingArtifactResolverRoute(error) {
  return (
    error instanceof ClawHubRequestError &&
    error.status === 404 &&
    error.requestPath.endsWith("/artifact")
  );
}
function buildArtifactResolverResponseFromVersion(params) {
  const packageDetail = params.detail.package;
  const versionPackage = params.versionDetail.package;
  return {
    package: versionPackage
      ? {
          name: versionPackage.name,
          displayName: versionPackage.displayName,
          family: versionPackage.family,
        }
      : packageDetail
        ? {
            name: packageDetail.name,
            displayName: packageDetail.displayName,
            family: packageDetail.family,
          }
        : null,
    version: params.versionDetail.version,
  };
}
function formatClawHubClawPackDownloadError(params) {
  const message = formatErrorMessage(params.error);
  if (!(params.error instanceof ClawHubRequestError)) return message;
  return `ClawHub artifact download for "${params.packageName}@${params.version}" is not available yet (${message}). Use "npm:${params.packageName}@${params.version}" for launch installs while ClawHub artifact routing is being rolled out.`;
}
function isClawHubArtifactDownloadPolicyBlock(error) {
  if (!(error instanceof ClawHubRequestError)) return false;
  const body = normalizeLowercaseStringOrEmpty(error.responseBody);
  return (
    body.includes("blocked from download") ||
    body.includes("download disabled") ||
    body.includes("disabled download") ||
    body.includes("cannot be downloaded") ||
    body.includes("flagged as malicious") ||
    body.includes("malicious") ||
    body.includes("quarantined") ||
    body.includes("quarantine") ||
    body.includes("revoked")
  );
}
function formatClawHubArtifactDownloadPolicyBlock(params) {
  return `ClawHub blocked artifact download for "${params.packageName}@${params.version}"; install was not started. ${formatErrorMessage(params.error)}`;
}
function formatClawHubMissingArtifactMetadataError(params) {
  return `ClawHub package "${params.packageName}@${params.version}" does not expose a downloadable plugin artifact yet. Use "npm:${params.packageName}@${params.version}" for launch installs while ClawHub artifact routing is being rolled out.`;
}
function resolveRequestedVersion(params) {
  if (params.requestedVersion)
    return params.detail.package?.tags?.[params.requestedVersion] ?? params.requestedVersion;
  return resolveLatestVersionFromPackage(params.detail);
}
function readTrimmedString(value) {
  return normalizeOptionalString(value) ?? null;
}
function normalizeClawHubRelativePath(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  if (value.trim() !== value || value.includes("\\")) return null;
  if (value.startsWith("/")) return null;
  if (
    value.split("/").some((segment) => segment.length === 0 || segment === "." || segment === "..")
  )
    return null;
  return value;
}
function describeInvalidClawHubRelativePath(value) {
  if (typeof value !== "string") return `non-string value of type ${typeof value}`;
  if (value.length === 0) return "empty string";
  if (value.trim() !== value) return `path "${value}" has leading or trailing whitespace`;
  if (value.includes("\\")) return `path "${value}" contains backslashes`;
  if (value.startsWith("/")) return `path "${value}" is absolute`;
  const segments = value.split("/");
  if (segments.some((segment) => segment.length === 0))
    return `path "${value}" contains an empty segment`;
  if (segments.some((segment) => segment === "." || segment === ".."))
    return `path "${value}" contains dot segments`;
  return `path "${value}" failed validation for an unknown reason`;
}
function describeInvalidClawHubSha256(value) {
  if (typeof value !== "string") return `non-string value of type ${typeof value}`;
  if (value.length === 0) return "empty string";
  if (value.trim().length === 0) return "whitespace-only string";
  return `value "${value}" is not a 64-character hexadecimal SHA-256 digest`;
}
function resolveClawHubArchiveVerification(versionDetail, packageName, version) {
  const sha256hashValue = versionDetail.version?.sha256hash;
  const sha256hash = readTrimmedString(sha256hashValue);
  const integrity = sha256hash ? normalizeClawHubSha256Integrity(sha256hash) : null;
  if (integrity)
    return {
      ok: true,
      verification: {
        kind: "archive-integrity",
        integrity,
      },
    };
  if (sha256hashValue !== void 0 && sha256hashValue !== null)
    return buildClawHubInstallFailure(
      `ClawHub version metadata for "${packageName}@${version}" has an invalid sha256hash (${typeof sha256hashValue === "string" && sha256hashValue.trim().length === 0 ? "empty string" : typeof sha256hashValue === "string" ? `unrecognized value "${sha256hashValue.trim()}"` : `non-string value of type ${typeof sha256hashValue}`}).`,
      CLAWHUB_INSTALL_ERROR_CODE.MISSING_ARCHIVE_INTEGRITY,
    );
  const files = versionDetail.version?.files;
  if (!Array.isArray(files) || files.length === 0)
    return {
      ok: true,
      verification: null,
    };
  const normalizedFiles = [];
  const seenPaths = /* @__PURE__ */ new Set();
  for (const [index, file] of files.entries()) {
    if (!file || typeof file !== "object")
      return buildClawHubInstallFailure(
        `ClawHub version metadata for "${packageName}@${version}" has an invalid files[${index}] entry (expected an object, got ${file === null ? "null" : typeof file}).`,
        CLAWHUB_INSTALL_ERROR_CODE.MISSING_ARCHIVE_INTEGRITY,
      );
    const fileRecord = file;
    const filePath = normalizeClawHubRelativePath(fileRecord.path);
    const sha256Value = readTrimmedString(fileRecord.sha256);
    const sha256 = sha256Value ? normalizeClawHubSha256Hex(sha256Value) : null;
    if (!filePath)
      return buildClawHubInstallFailure(
        `ClawHub version metadata for "${packageName}@${version}" has an invalid files[${index}].path (${describeInvalidClawHubRelativePath(fileRecord.path)}).`,
        CLAWHUB_INSTALL_ERROR_CODE.MISSING_ARCHIVE_INTEGRITY,
      );
    if (filePath === CLAWHUB_GENERATED_ARCHIVE_METADATA_FILE)
      return buildClawHubInstallFailure(
        `ClawHub version metadata for "${packageName}@${version}" must not include generated file "${filePath}" in files[].`,
        CLAWHUB_INSTALL_ERROR_CODE.MISSING_ARCHIVE_INTEGRITY,
      );
    if (!sha256)
      return buildClawHubInstallFailure(
        `ClawHub version metadata for "${packageName}@${version}" has an invalid files[${index}].sha256 (${describeInvalidClawHubSha256(fileRecord.sha256)}).`,
        CLAWHUB_INSTALL_ERROR_CODE.MISSING_ARCHIVE_INTEGRITY,
      );
    if (seenPaths.has(filePath))
      return buildClawHubInstallFailure(
        `ClawHub version metadata for "${packageName}@${version}" has duplicate files[] path "${filePath}".`,
        CLAWHUB_INSTALL_ERROR_CODE.MISSING_ARCHIVE_INTEGRITY,
      );
    seenPaths.add(filePath);
    normalizedFiles.push({
      path: filePath,
      sha256,
    });
  }
  return {
    ok: true,
    verification: {
      kind: "file-list",
      files: normalizedFiles,
    },
  };
}
async function readLimitedClawHubArchiveEntry(entry, limits, handlers) {
  const hintedSize = entry["_data"]?.uncompressedSize;
  if (
    typeof hintedSize === "number" &&
    Number.isFinite(hintedSize) &&
    hintedSize > limits.maxEntryBytes
  )
    return buildClawHubInstallFailure(
      `ClawHub archive fallback verification rejected "${entry.name}" because it exceeds the per-file size limit.`,
      CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
    );
  let entryBytes = 0;
  return await new Promise((resolve) => {
    let settled = false;
    const stream = entry.nodeStream("nodebuffer");
    stream.on("data", (chunk) => {
      if (settled) return;
      const buffer = typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk);
      entryBytes += buffer.byteLength;
      if (entryBytes > limits.maxEntryBytes) {
        settled = true;
        stream.destroy?.();
        resolve(
          buildClawHubInstallFailure(
            `ClawHub archive fallback verification rejected "${entry.name}" because it exceeds the per-file size limit.`,
            CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
          ),
        );
        return;
      }
      if (!limits.addArchiveBytes(buffer.byteLength)) {
        settled = true;
        stream.destroy?.();
        resolve(
          buildClawHubInstallFailure(
            "ClawHub archive fallback verification exceeded the total extracted-size limit.",
            CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
          ),
        );
        return;
      }
      handlers.onChunk(buffer);
    });
    stream.once("end", () => {
      if (settled) return;
      settled = true;
      resolve(handlers.onEnd());
    });
    stream.once("error", (error) => {
      if (settled) return;
      settled = true;
      resolve(
        buildClawHubInstallFailure(
          error instanceof Error ? error.message : String(error),
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        ),
      );
    });
  });
}
async function readClawHubArchiveEntryBuffer(entry, limits) {
  const chunks = [];
  return await readLimitedClawHubArchiveEntry(entry, limits, {
    onChunk(buffer) {
      chunks.push(buffer);
    },
    onEnd() {
      return Buffer.concat(chunks);
    },
  });
}
async function hashClawHubArchiveEntry(entry, limits) {
  const digest = createHash("sha256");
  return await readLimitedClawHubArchiveEntry(entry, limits, {
    onChunk(buffer) {
      digest.update(buffer);
    },
    onEnd() {
      return digest.digest("hex");
    },
  });
}
function validateClawHubArchiveMetaJson(params) {
  let parsed;
  try {
    parsed = JSON.parse(params.bytes.toString("utf8"));
  } catch {
    return buildClawHubInstallFailure(
      `ClawHub archive contents do not match files[] metadata for "${params.packageName}@${params.version}": _meta.json is not valid JSON.`,
      CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
    );
  }
  if (!parsed || typeof parsed !== "object")
    return buildClawHubInstallFailure(
      `ClawHub archive contents do not match files[] metadata for "${params.packageName}@${params.version}": _meta.json is not a JSON object.`,
      CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
    );
  const record = parsed;
  if (record.slug !== params.packageName)
    return buildClawHubInstallFailure(
      `ClawHub archive contents do not match files[] metadata for "${params.packageName}@${params.version}": _meta.json slug does not match the package name.`,
      CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
    );
  if (record.version !== params.version)
    return buildClawHubInstallFailure(
      `ClawHub archive contents do not match files[] metadata for "${params.packageName}@${params.version}": _meta.json version does not match the package version.`,
      CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
    );
  return null;
}
function mapClawHubArchiveReadFailure(error) {
  if (error instanceof ArchiveLimitError) {
    if (error.code === ARCHIVE_LIMIT_ERROR_CODE.ENTRY_COUNT_EXCEEDS_LIMIT)
      return buildClawHubInstallFailure(
        "ClawHub archive fallback verification exceeded the archive entry limit.",
        CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
      );
    if (error.code === ARCHIVE_LIMIT_ERROR_CODE.ARCHIVE_SIZE_EXCEEDS_LIMIT)
      return buildClawHubInstallFailure(
        "ClawHub archive fallback verification rejected the downloaded archive because it exceeds the ZIP archive size limit.",
        CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
      );
  }
  return buildClawHubInstallFailure(
    "ClawHub archive fallback verification failed while reading the downloaded archive.",
    CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
  );
}
async function verifyClawHubArchiveFiles(params) {
  try {
    if ((await fs.stat(params.archivePath)).size > 268435456)
      return buildClawHubInstallFailure(
        "ClawHub archive fallback verification rejected the downloaded archive because it exceeds the ZIP archive size limit.",
        CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
      );
    const zip = await loadZipArchiveWithPreflight(await fs.readFile(params.archivePath), {
      maxArchiveBytes: DEFAULT_MAX_ARCHIVE_BYTES_ZIP,
      maxEntries: DEFAULT_MAX_ENTRIES,
      maxExtractedBytes: DEFAULT_MAX_EXTRACTED_BYTES,
      maxEntryBytes: DEFAULT_MAX_ENTRY_BYTES,
    });
    const actualFiles = /* @__PURE__ */ new Map();
    const validatedGeneratedPaths = /* @__PURE__ */ new Set();
    let entryCount = 0;
    let extractedBytes = 0;
    const addArchiveBytes = (bytes) => {
      extractedBytes += bytes;
      return extractedBytes <= DEFAULT_MAX_EXTRACTED_BYTES;
    };
    for (const entry of Object.values(zip.files)) {
      entryCount += 1;
      if (entryCount > 5e4)
        return buildClawHubInstallFailure(
          "ClawHub archive fallback verification exceeded the archive entry limit.",
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        );
      if (entry.dir) continue;
      const relativePath = normalizeClawHubRelativePath(entry.name);
      if (!relativePath)
        return buildClawHubInstallFailure(
          `ClawHub archive contents do not match files[] metadata for "${params.packageName}@${params.packageVersion}": invalid package file path "${entry.name}" (${describeInvalidClawHubRelativePath(entry.name)}).`,
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        );
      if (relativePath === CLAWHUB_GENERATED_ARCHIVE_METADATA_FILE) {
        const metaResult = await readClawHubArchiveEntryBuffer(entry, {
          maxEntryBytes: DEFAULT_MAX_ENTRY_BYTES,
          addArchiveBytes,
        });
        if (isClawHubInstallFailure(metaResult)) return metaResult;
        const metaFailure = validateClawHubArchiveMetaJson({
          packageName: params.packageName,
          version: params.packageVersion,
          bytes: metaResult,
        });
        if (metaFailure) return metaFailure;
        validatedGeneratedPaths.add(relativePath);
        continue;
      }
      const sha256 = await hashClawHubArchiveEntry(entry, {
        maxEntryBytes: DEFAULT_MAX_ENTRY_BYTES,
        addArchiveBytes,
      });
      if (typeof sha256 !== "string") return sha256;
      actualFiles.set(relativePath, sha256);
    }
    for (const file of params.files) {
      const actualSha256 = actualFiles.get(file.path);
      if (!actualSha256)
        return buildClawHubInstallFailure(
          `ClawHub archive contents do not match files[] metadata for "${params.packageName}@${params.packageVersion}": missing "${file.path}".`,
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        );
      if (actualSha256 !== file.sha256)
        return buildClawHubInstallFailure(
          `ClawHub archive contents do not match files[] metadata for "${params.packageName}@${params.packageVersion}": expected ${file.path} to hash to ${file.sha256}, got ${actualSha256}.`,
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        );
      actualFiles.delete(file.path);
    }
    let unexpectedFile;
    for (const file of actualFiles.keys())
      if (unexpectedFile === void 0 || file < unexpectedFile) unexpectedFile = file;
    if (unexpectedFile)
      return buildClawHubInstallFailure(
        `ClawHub archive contents do not match files[] metadata for "${params.packageName}@${params.packageVersion}": unexpected file "${unexpectedFile}".`,
        CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
      );
    return {
      ok: true,
      validatedGeneratedPaths: [...validatedGeneratedPaths].toSorted(),
    };
  } catch (error) {
    return mapClawHubArchiveReadFailure(error);
  }
}
async function resolveCompatiblePackageVersion(params) {
  const requestedVersion = resolveRequestedVersion(params);
  if (!requestedVersion)
    return buildClawHubInstallFailure(
      `ClawHub package "${params.detail.package?.name ?? "unknown"}" has no installable version.`,
      CLAWHUB_INSTALL_ERROR_CODE.NO_INSTALLABLE_VERSION,
    );
  let artifactResponse;
  try {
    artifactResponse = await fetchClawHubPackageArtifact({
      name: params.detail.package?.name ?? "",
      version: requestedVersion,
      baseUrl: params.baseUrl,
      token: params.token,
      timeoutMs: params.timeoutMs,
    });
  } catch (error) {
    if (isMissingArtifactResolverRoute(error))
      try {
        const versionDetail = await fetchClawHubPackageVersion({
          name: params.detail.package?.name ?? "",
          version: requestedVersion,
          baseUrl: params.baseUrl,
          token: params.token,
          timeoutMs: params.timeoutMs,
        });
        artifactResponse = buildArtifactResolverResponseFromVersion({
          detail: params.detail,
          versionDetail,
        });
      } catch (versionError) {
        return mapClawHubRequestError(versionError, {
          stage: "version",
          name: params.detail.package?.name ?? "unknown",
          version: requestedVersion,
        });
      }
    else
      return mapClawHubRequestError(error, {
        stage: "version",
        name: params.detail.package?.name ?? "unknown",
        version: requestedVersion,
      });
  }
  const artifactVersion = readArtifactResolverVersion(artifactResponse, requestedVersion);
  const resolvedVersion = normalizeOptionalString(artifactVersion.version) ?? requestedVersion;
  const latestVersion = resolveLatestVersionFromPackage(params.detail);
  const packageCompatibilityFallback =
    resolvedVersion === latestVersion ? (params.detail.package?.compatibility ?? null) : null;
  let versionEndpointCompatibility = null;
  if (!artifactVersion.compatibility && resolvedVersion !== latestVersion)
    try {
      versionEndpointCompatibility =
        (
          await fetchClawHubPackageVersion({
            name: params.detail.package?.name ?? "",
            version: resolvedVersion,
            baseUrl: params.baseUrl,
            token: params.token,
            timeoutMs: params.timeoutMs,
          })
        ).version?.compatibility ?? null;
    } catch (error) {
      return mapClawHubRequestError(error, {
        stage: "version",
        name: params.detail.package?.name ?? "unknown",
        version: resolvedVersion,
      });
    }
  if (params.detail.package?.family === "skill")
    return {
      ok: true,
      version: resolvedVersion,
      compatibility:
        artifactVersion.compatibility ??
        versionEndpointCompatibility ??
        packageCompatibilityFallback,
      verification: null,
      clawpack:
        artifactVersion.clawpack ?? resolveTopLevelNpmPackArtifact(artifactResponse.artifact),
    };
  const artifactFamily = artifactResponse.package?.family;
  const resolvedFamily = isClawHubPackageFamily(artifactFamily)
    ? artifactFamily
    : (params.detail.package?.family ?? "code-plugin");
  const versionRecord = {
    version: resolvedVersion,
    createdAt: typeof artifactVersion.createdAt === "number" ? artifactVersion.createdAt : 0,
    changelog: typeof artifactVersion.changelog === "string" ? artifactVersion.changelog : "",
    distTags: artifactVersion.distTags,
    files: normalizeArtifactResolverFiles(artifactVersion.files),
    sha256hash: artifactVersion.sha256hash,
    compatibility: artifactVersion.compatibility,
    artifact: artifactVersion.artifact,
    clawpack: artifactVersion.clawpack ?? void 0,
  };
  const versionDetail = {
    package: artifactResponse.package
      ? {
          name: artifactResponse.package.name ?? params.detail.package?.name ?? "",
          displayName:
            artifactResponse.package.displayName ?? params.detail.package?.displayName ?? "",
          family: resolvedFamily,
        }
      : null,
    version: versionRecord,
  };
  const clawpack =
    resolveClawHubNpmPackArtifact(versionRecord) ??
    resolveTopLevelNpmPackArtifact(artifactResponse.artifact);
  const verificationState = resolveClawHubArchiveVerification(
    versionDetail,
    params.detail.package?.name ?? "unknown",
    resolvedVersion,
  );
  if (!verificationState.ok) {
    if (!resolveClawHubClawPackArtifactSha256(clawpack)) return verificationState;
    return {
      ok: true,
      version: resolvedVersion,
      compatibility:
        versionDetail.version?.compatibility ??
        versionEndpointCompatibility ??
        packageCompatibilityFallback,
      verification: null,
      clawpack,
    };
  }
  const topLevelLegacyVerification = resolveTopLevelLegacyArchiveVerification(
    artifactResponse.artifact,
  );
  return {
    ok: true,
    version: resolvedVersion,
    compatibility:
      versionDetail.version?.compatibility ??
      versionEndpointCompatibility ??
      packageCompatibilityFallback,
    verification: verificationState.verification ?? topLevelLegacyVerification,
    clawpack,
  };
}
function validateClawHubPluginPackage(params) {
  const pkg = params.detail.package;
  if (!pkg)
    return buildClawHubInstallFailure(
      "Package not found on ClawHub.",
      CLAWHUB_INSTALL_ERROR_CODE.PACKAGE_NOT_FOUND,
    );
  if (pkg.family === "skill") {
    const installRef = pkg.ownerHandle ? `@${pkg.ownerHandle}/${pkg.name}` : pkg.name;
    return buildClawHubInstallFailure(
      `"${pkg.name}" is a skill. Use "openclaw skills install ${installRef}" instead.`,
      CLAWHUB_INSTALL_ERROR_CODE.SKILL_PACKAGE,
    );
  }
  if (pkg.family !== "code-plugin" && pkg.family !== "bundle-plugin")
    return buildClawHubInstallFailure(
      `Unsupported ClawHub package family: ${String(pkg.family)}`,
      CLAWHUB_INSTALL_ERROR_CODE.UNSUPPORTED_FAMILY,
    );
  if (pkg.channel === "private")
    return buildClawHubInstallFailure(
      `"${pkg.name}" is private on ClawHub and cannot be installed anonymously.`,
      CLAWHUB_INSTALL_ERROR_CODE.PRIVATE_PACKAGE,
    );
  const compatibility = params.compatibility;
  const runtimeVersion = params.runtimeVersion;
  if (
    compatibility?.pluginApiRange &&
    !satisfiesPluginApiRange(runtimeVersion, compatibility.pluginApiRange)
  )
    return buildClawHubInstallFailure(
      `Plugin "${pkg.name}" requires plugin API ${compatibility.pluginApiRange}, but this OpenClaw runtime exposes ${runtimeVersion}.`,
      CLAWHUB_INSTALL_ERROR_CODE.INCOMPATIBLE_PLUGIN_API,
    );
  if (
    compatibility?.minGatewayVersion &&
    !satisfiesGatewayMinimum(runtimeVersion, compatibility.minGatewayVersion)
  )
    return buildClawHubInstallFailure(
      `Plugin "${pkg.name}" requires OpenClaw >=${compatibility.minGatewayVersion}, but this host is ${runtimeVersion}.`,
      CLAWHUB_INSTALL_ERROR_CODE.INCOMPATIBLE_GATEWAY,
    );
  return null;
}
function logClawHubPackageSummary(params) {
  const pkg = params.detail.package;
  if (!pkg) return;
  const familyLabel = pkg.family === "code-plugin" ? "plugin" : pkg.family;
  const compatibilityParts = [
    params.compatibility?.pluginApiRange
      ? `pluginApi ${params.compatibility.pluginApiRange}`
      : null,
    params.compatibility?.minGatewayVersion
      ? `minGateway ${params.compatibility.minGatewayVersion}`
      : null,
  ].filter(Boolean);
  const pluginUrl = sanitizeTerminalText(
    resolveClawHubPluginUrl({
      baseUrl: params.baseUrl,
      packageName: pkg.name,
    }),
  );
  params.logger?.info?.(
    [
      `  ${padRight("Package", 9)} ${formatClawHubReleaseLabel(pkg.name, params.version)}`,
      `  ${padRight("Type", 9)} ${familyLabel}`,
      compatibilityParts.length > 0
        ? `  ${padRight("Requires", 9)} ${compatibilityParts.join(" · ")}`
        : null,
      `  ${padRight("ClawHub", 9)} ${formatTerminalLink("view plugin", pluginUrl, {
        fallback: pluginUrl,
        ...(params.logger?.terminalLinks !== void 0 ? { force: params.logger.terminalLinks } : {}),
      })}`,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  );
}
async function installPluginFromClawHub(params) {
  const parsed = parseClawHubPluginSpec(params.spec);
  if (!parsed?.name)
    return buildClawHubInstallFailure(
      `invalid ClawHub plugin spec: ${params.spec}`,
      CLAWHUB_INSTALL_ERROR_CODE.INVALID_SPEC,
    );
  const expectedIntegrity =
    params.expectedIntegrity === void 0
      ? void 0
      : normalizeClawHubSha256Integrity(params.expectedIntegrity);
  if (params.expectedIntegrity !== void 0 && !expectedIntegrity)
    return buildClawHubInstallFailure(
      `invalid expected ClawHub archive integrity: ${sanitizeTerminalText(params.expectedIntegrity)}`,
      CLAWHUB_INSTALL_ERROR_CODE.MISSING_ARCHIVE_INTEGRITY,
    );
  params.logger?.info?.(`Resolving ${formatClawHubSpecifier(parsed)}…`);
  let detail;
  try {
    detail = await fetchClawHubPackageDetail({
      name: parsed.name,
      baseUrl: params.baseUrl,
      token: params.token,
      timeoutMs: params.timeoutMs,
    });
  } catch (error) {
    return mapClawHubRequestError(error, {
      stage: "package",
      name: parsed.name,
    });
  }
  const versionState = await resolveCompatiblePackageVersion({
    detail,
    requestedVersion: parsed.version,
    baseUrl: params.baseUrl,
    token: params.token,
    timeoutMs: params.timeoutMs,
  });
  if (!versionState.ok) return versionState;
  const runtimeVersion = resolveCompatibilityHostVersion(params.env);
  const validationFailure = validateClawHubPluginPackage({
    detail,
    compatibility: versionState.compatibility,
    runtimeVersion,
  });
  if (validationFailure) return validationFailure;
  const runtimeIdResolution = resolveClawHubExpectedRuntimeId({
    detail,
    expectedPluginId: params.expectedPluginId,
  });
  if (!runtimeIdResolution.ok) return runtimeIdResolution;
  const expectedClawPackSha256 = resolveClawHubClawPackArtifactSha256(versionState.clawpack);
  const canonicalPackageName = detail.package?.name ?? parsed.name;
  const officialClawHubPackage = detail.package
    ? isDefaultOfficialClawHubPackage({
        baseUrl: params.baseUrl,
        pkg: detail.package,
      })
    : false;
  logClawHubPackageSummary({
    detail,
    version: versionState.version,
    compatibility: versionState.compatibility,
    baseUrl: params.baseUrl,
    logger: params.logger,
  });
  const trustResult = officialClawHubPackage
    ? null
    : await ensureClawHubPackageTrustAcknowledged({
        subject: {
          kind: "plugin",
          packageName: canonicalPackageName,
        },
        version: versionState.version,
        baseUrl: params.baseUrl,
        token: params.token,
        timeoutMs: params.timeoutMs,
        acknowledgeClawHubRisk: params.acknowledgeClawHubRisk,
        onClawHubRisk: params.onClawHubRisk,
        logger: params.logger,
        mode: params.mode,
      });
  if (trustResult && !trustResult.ok) return trustResult;
  if (!versionState.verification && !expectedClawPackSha256)
    return buildClawHubInstallFailure(
      formatClawHubMissingArtifactMetadataError({
        packageName: canonicalPackageName,
        version: versionState.version,
      }),
      CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE,
    );
  const releaseLabel = formatClawHubReleaseLabel(canonicalPackageName, versionState.version);
  let archive;
  try {
    archive = await downloadClawHubPackageArchive({
      name: canonicalPackageName,
      version: versionState.version,
      artifact: expectedClawPackSha256 ? "clawpack" : "archive",
      baseUrl: params.baseUrl,
      token: params.token,
      timeoutMs: params.timeoutMs,
    });
  } catch (error) {
    if (isClawHubArtifactDownloadPolicyBlock(error))
      return buildClawHubInstallFailure(
        formatClawHubArtifactDownloadPolicyBlock({
          error,
          packageName: canonicalPackageName,
          version: versionState.version,
        }),
        CLAWHUB_INSTALL_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED,
        void 0,
        versionState.version,
      );
    return buildClawHubInstallFailure(
      expectedClawPackSha256
        ? formatClawHubClawPackDownloadError({
            error,
            packageName: canonicalPackageName,
            version: versionState.version,
          })
        : formatErrorMessage(error),
      expectedClawPackSha256 &&
        error instanceof ClawHubRequestError &&
        error.status === 404 &&
        error.requestPath.endsWith("/artifact/download")
        ? CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_DOWNLOAD_UNAVAILABLE
        : error instanceof ClawHubRequestError
          ? CLAWHUB_INSTALL_ERROR_CODE.ARTIFACT_UNAVAILABLE
          : void 0,
    );
  }
  try {
    if (expectedIntegrity && archive.integrity !== expectedIntegrity)
      return buildClawHubInstallFailure(
        `ClawHub archive integrity mismatch for "${releaseLabel}": expected ${expectedIntegrity}, got ${archive.integrity}.`,
        CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
      );
    if (expectedClawPackSha256) {
      const expectedClawPackIntegrity = normalizeClawHubSha256Integrity(expectedClawPackSha256);
      const expectedNpmIntegrity = resolveClawHubNpmIntegrity(versionState.clawpack);
      if (
        archive.artifact !== "clawpack" ||
        archive.clawpackHeaderSha256 !== expectedClawPackSha256 ||
        archive.sha256Hex !== expectedClawPackSha256 ||
        archive.integrity !== expectedClawPackIntegrity
      )
        return buildClawHubInstallFailure(
          `ClawHub ClawPack integrity mismatch for "${releaseLabel}": expected ${expectedClawPackSha256}, got ${archive.sha256Hex}.`,
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        );
      if (expectedNpmIntegrity && archive.npmIntegrity !== expectedNpmIntegrity)
        return buildClawHubInstallFailure(
          `ClawHub ClawPack npm integrity mismatch for "${releaseLabel}": expected ${expectedNpmIntegrity}, got ${archive.npmIntegrity ?? "unknown"}.`,
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        );
      const expectedNpmShasum = resolveClawHubNpmShasum(versionState.clawpack);
      if (expectedNpmShasum && archive.npmShasum !== expectedNpmShasum)
        return buildClawHubInstallFailure(
          `ClawHub ClawPack npm shasum mismatch for "${releaseLabel}": expected ${expectedNpmShasum}, got ${archive.npmShasum ?? "unknown"}.`,
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        );
    } else if (versionState.verification?.kind === "archive-integrity") {
      if (archive.integrity !== versionState.verification.integrity)
        return buildClawHubInstallFailure(
          `ClawHub archive integrity mismatch for "${releaseLabel}": expected ${versionState.verification.integrity}, got ${archive.integrity}.`,
          CLAWHUB_INSTALL_ERROR_CODE.ARCHIVE_INTEGRITY_MISMATCH,
        );
    } else if (versionState.verification) {
      const validatedPaths = versionState.verification.files
        .map((file) => file.path)
        .toSorted()
        .join(", ");
      const fallbackVerification = await verifyClawHubArchiveFiles({
        archivePath: archive.archivePath,
        packageName: canonicalPackageName,
        packageVersion: versionState.version,
        files: versionState.verification.files,
      });
      if (!fallbackVerification.ok) return fallbackVerification;
      const validatedGeneratedPaths =
        fallbackVerification.validatedGeneratedPaths.length > 0
          ? ` Validated generated metadata files present in archive: ${fallbackVerification.validatedGeneratedPaths.join(", ")} (JSON parse plus slug/version match only).`
          : "";
      params.logger?.warn?.(
        `ClawHub package "${releaseLabel}" is missing sha256hash; falling back to files[] verification. Validated files: ${validatedPaths}.${validatedGeneratedPaths}`,
      );
    }
    const clawhubRegistry = resolveClawHubBaseUrl(params.baseUrl);
    const clawhubAuthority = isDefaultClawHubBaseUrl(params.baseUrl) ? "openclaw" : "third-party";
    params.logger?.info?.(
      `Downloading ${detail.package?.family === "bundle-plugin" ? "bundle" : "plugin"} ${releaseLabel} from ClawHub…`,
    );
    const installResult = await installPluginFromArchive({
      archivePath: archive.archivePath,
      dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
      trustedSourceLinkedOfficialInstall:
        officialClawHubPackage || isTrustedSourceLinkedOfficialPackage(detail.package),
      config: params.config,
      logger: params.logger,
      mode: params.mode,
      extensionsDir: params.extensionsDir,
      timeoutMs: params.timeoutMs,
      dryRun: params.dryRun,
      expectedPluginId: runtimeIdResolution.expectedPluginId,
      installPolicyRequest: {
        kind: "plugin-archive",
        requestedSpecifier: params.spec,
        source: {
          kind: "clawhub",
          authority: officialClawHubPackage ? "official" : clawhubAuthority,
          mutable: false,
          network: true,
        },
      },
    });
    if (!installResult.ok) return installResult;
    const pkg = detail.package;
    const clawpackFields = normalizeClawHubClawPackInstallFields(versionState.clawpack);
    const observedClawPackArtifactFields =
      archive.artifact === "clawpack"
        ? {
            artifactKind: "npm-pack",
            artifactFormat: "tgz",
            ...(archive.npmIntegrity ? { npmIntegrity: archive.npmIntegrity } : {}),
            ...(archive.npmShasum ? { npmShasum: archive.npmShasum } : {}),
            ...(archive.npmTarballName ? { npmTarballName: archive.npmTarballName } : {}),
          }
        : {
            artifactKind: "legacy-zip",
            artifactFormat: "zip",
          };
    const expectedTarballName = resolveClawHubNpmTarballName(versionState.clawpack);
    const clawhubFamily =
      pkg.family === "code-plugin" || pkg.family === "bundle-plugin" ? pkg.family : null;
    if (!clawhubFamily)
      return buildClawHubInstallFailure(
        `Unsupported ClawHub package family: ${pkg.family}`,
        CLAWHUB_INSTALL_ERROR_CODE.UNSUPPORTED_FAMILY,
      );
    return {
      ...installResult,
      packageName: canonicalPackageName,
      clawhub: {
        source: "clawhub",
        clawhubUrl: clawhubRegistry,
        clawhubPackage: canonicalPackageName,
        clawhubFamily,
        clawhubChannel: pkg.channel,
        version: installResult.version ?? versionState.version,
        integrity: archive.integrity,
        resolvedAt: /* @__PURE__ */ new Date().toISOString(),
        ...clawpackFields,
        ...observedClawPackArtifactFields,
        ...(trustResult ? trustResult.trustInstallRecordFields : {}),
        ...(expectedTarballName && !archive.npmTarballName
          ? { npmTarballName: expectedTarballName }
          : {}),
      },
    };
  } finally {
    await archive.cleanup().catch(() => void 0);
  }
}
//#endregion
export { installPluginFromClawHub as t };
