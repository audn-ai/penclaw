import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region packages/memory-host-sdk/src/host/multimodal.ts
const MEMORY_MULTIMODAL_SPECS = {
  image: {
    labelPrefix: "Image file",
    extensions: [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"],
  },
  audio: {
    labelPrefix: "Audio file",
    extensions: [".mp3", ".wav", ".ogg", ".opus", ".m4a", ".m2a", ".aac", ".flac"],
  },
};
/** All supported multimodal memory modalities in stable config order. */
const MEMORY_MULTIMODAL_MODALITIES = Object.keys(MEMORY_MULTIMODAL_SPECS);
/** Default max bytes for one multimodal memory file. */
const DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Normalize user modality selections to supported modalities. */
function normalizeMemoryMultimodalModalities(raw) {
  if (raw === void 0 || raw.includes("all")) return [...MEMORY_MULTIMODAL_MODALITIES];
  const normalized = /* @__PURE__ */ new Set();
  for (const value of raw) if (value === "image" || value === "audio") normalized.add(value);
  return Array.from(normalized);
}
/** Normalize user multimodal settings, including disabled-state empty modality list. */
function normalizeMemoryMultimodalSettings(raw) {
  const enabled = raw.enabled === true;
  const maxFileBytes =
    typeof raw.maxFileBytes === "number" && Number.isFinite(raw.maxFileBytes)
      ? Math.max(1, Math.floor(raw.maxFileBytes))
      : DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES;
  return {
    enabled,
    modalities: enabled ? normalizeMemoryMultimodalModalities(raw.modalities) : [],
    maxFileBytes,
  };
}
/** Return true when multimodal memory ingestion has at least one enabled modality. */
function isMemoryMultimodalEnabled(settings) {
  return settings.enabled && settings.modalities.length > 0;
}
/** Return accepted file extensions for a modality. */
function getMemoryMultimodalExtensions(modality) {
  return MEMORY_MULTIMODAL_SPECS[modality].extensions;
}
/** Build the text label that accompanies embedded multimodal file content. */
function buildMemoryMultimodalLabel(modality, normalizedPath) {
  return `${MEMORY_MULTIMODAL_SPECS[modality].labelPrefix}: ${normalizedPath}`;
}
/** Build a glob that matches an extension case-insensitively for QMD sources. */
function buildCaseInsensitiveExtensionGlob(extension) {
  const normalized = normalizeLowercaseStringOrEmpty(extension).replace(/^\./, "");
  if (!normalized) return "*";
  return `*.${Array.from(normalized, (char) => `[${char.toLowerCase()}${char.toUpperCase()}]`).join("")}`;
}
/** Classify a file path into a supported multimodal modality under current settings. */
function classifyMemoryMultimodalPath(filePath, settings) {
  if (!isMemoryMultimodalEnabled(settings)) return null;
  const lower = normalizeLowercaseStringOrEmpty(filePath);
  for (const modality of settings.modalities)
    for (const extension of getMemoryMultimodalExtensions(modality))
      if (lower.endsWith(extension)) return modality;
  return null;
}
//#endregion
export {
  isMemoryMultimodalEnabled as a,
  getMemoryMultimodalExtensions as i,
  buildMemoryMultimodalLabel as n,
  normalizeMemoryMultimodalSettings as o,
  classifyMemoryMultimodalPath as r,
  buildCaseInsensitiveExtensionGlob as t,
};
