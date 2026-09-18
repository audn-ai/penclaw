//#region packages/memory-host-sdk/src/host/multimodal.d.ts
declare const MEMORY_MULTIMODAL_SPECS: {
  readonly image: {
    readonly labelPrefix: "Image file";
    readonly extensions: readonly [".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"];
  };
  readonly audio: {
    readonly labelPrefix: "Audio file";
    readonly extensions: readonly [
      ".mp3",
      ".wav",
      ".ogg",
      ".opus",
      ".m4a",
      ".m2a",
      ".aac",
      ".flac",
    ];
  };
};
/** Supported multimodal memory modality. */
type MemoryMultimodalModality = keyof typeof MEMORY_MULTIMODAL_SPECS;
/** User selection for one modality or all modalities. */
type MemoryMultimodalSelection = MemoryMultimodalModality | "all";
/** Normalized multimodal memory ingestion settings. */
type MemoryMultimodalSettings = {
  enabled: boolean;
  modalities: MemoryMultimodalModality[];
  maxFileBytes: number;
};
/** Normalize user multimodal settings, including disabled-state empty modality list. */
declare function normalizeMemoryMultimodalSettings(raw: {
  enabled?: boolean;
  modalities?: MemoryMultimodalSelection[];
  maxFileBytes?: number;
}): MemoryMultimodalSettings;
/** Return true when multimodal memory ingestion has at least one enabled modality. */
declare function isMemoryMultimodalEnabled(settings: MemoryMultimodalSettings): boolean;
/** Return accepted file extensions for a modality. */
declare function getMemoryMultimodalExtensions(
  modality: MemoryMultimodalModality,
): readonly string[];
/** Build a glob that matches an extension case-insensitively for QMD sources. */
declare function buildCaseInsensitiveExtensionGlob(extension: string): string;
/** Classify a file path into a supported multimodal modality under current settings. */
declare function classifyMemoryMultimodalPath(
  filePath: string,
  settings: MemoryMultimodalSettings,
): MemoryMultimodalModality | null;
//#endregion
export {
  getMemoryMultimodalExtensions as a,
  classifyMemoryMultimodalPath as i,
  MemoryMultimodalSettings as n,
  isMemoryMultimodalEnabled as o,
  buildCaseInsensitiveExtensionGlob as r,
  normalizeMemoryMultimodalSettings as s,
  MemoryMultimodalModality as t,
};
