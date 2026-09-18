import JSON5 from "json5";
import { n as parseBooleanValue } from "./boolean-CrriykWV.js";
import { n as MANIFEST_KEY, t as LEGACY_MANIFEST_KEYS } from "./legacy-names-NIXaj2oi.js";
import {
  p as readStringValue,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { r as normalizeCsvOrLooseStringList } from "./string-normalization-CRyoFBPt.js";
//#region src/shared/frontmatter.ts
/** Normalizes comma-delimited or loose array metadata fields into string lists. */
function normalizeStringList(input) {
  return normalizeCsvOrLooseStringList(input);
}
/** Reads a frontmatter field only when it is represented as a string value. */
function getFrontmatterString(frontmatter, key) {
  return readStringValue(frontmatter[key]);
}
/** Parses boolean frontmatter strings while preserving the caller's default for missing values. */
function parseFrontmatterBool(value, fallback) {
  const parsed = parseBooleanValue(value);
  return parsed === void 0 ? fallback : parsed;
}
/** Parses the JSON5 OpenClaw manifest block embedded inside a string frontmatter field. */
function resolveOpenClawManifestBlock(params) {
  const raw = getFrontmatterString(params.frontmatter, params.key ?? "metadata");
  if (!raw) return;
  try {
    const parsed = JSON5.parse(raw);
    if (!parsed || typeof parsed !== "object") return;
    const manifestKeys = [MANIFEST_KEY, ...LEGACY_MANIFEST_KEYS];
    for (const key of manifestKeys) {
      const candidate = parsed[key];
      if (candidate && typeof candidate === "object") return candidate;
    }
    return;
  } catch {
    return;
  }
}
/** Extracts normalized runtime requirement lists from an OpenClaw manifest block. */
function resolveOpenClawManifestRequires(metadataObj) {
  const requiresRaw =
    typeof metadataObj.requires === "object" && metadataObj.requires !== null
      ? metadataObj.requires
      : void 0;
  if (!requiresRaw) return;
  return {
    bins: normalizeStringList(requiresRaw.bins),
    anyBins: normalizeStringList(requiresRaw.anyBins),
    env: normalizeStringList(requiresRaw.env),
    config: normalizeStringList(requiresRaw.config),
  };
}
/** Parses manifest install entries with a caller-owned parser and drops unsupported specs. */
function resolveOpenClawManifestInstall(metadataObj, parseInstallSpec) {
  return (Array.isArray(metadataObj.install) ? metadataObj.install : [])
    .map((entry) => parseInstallSpec(entry))
    .filter((entry) => Boolean(entry));
}
/** Extracts normalized OS allowlist entries from an OpenClaw manifest block. */
function resolveOpenClawManifestOs(metadataObj) {
  return normalizeStringList(metadataObj.os);
}
/** Parses kind/type plus common install fields shared by package-manager install specs. */
function parseOpenClawManifestInstallBase(input, allowedKinds) {
  if (!input || typeof input !== "object") return;
  const raw = input;
  const kind =
    normalizeOptionalLowercaseString(
      typeof raw.kind === "string" ? raw.kind : typeof raw.type === "string" ? raw.type : "",
    ) ?? "";
  if (!allowedKinds.includes(kind)) return;
  const spec = {
    raw,
    kind,
  };
  if (typeof raw.id === "string") spec.id = raw.id;
  if (typeof raw.label === "string") spec.label = raw.label;
  const bins = normalizeStringList(raw.bins);
  if (bins.length > 0) spec.bins = bins;
  return spec;
}
/** Copies optional common install fields onto a caller-specific install spec object. */
function applyOpenClawManifestInstallCommonFields(spec, parsed) {
  if (parsed.id) spec.id = parsed.id;
  if (parsed.label) spec.label = parsed.label;
  if (parsed.bins) spec.bins = parsed.bins;
  return spec;
}
//#endregion
export {
  parseOpenClawManifestInstallBase as a,
  resolveOpenClawManifestOs as c,
  parseFrontmatterBool as i,
  resolveOpenClawManifestRequires as l,
  getFrontmatterString as n,
  resolveOpenClawManifestBlock as o,
  normalizeStringList as r,
  resolveOpenClawManifestInstall as s,
  applyOpenClawManifestInstallCommonFields as t,
};
