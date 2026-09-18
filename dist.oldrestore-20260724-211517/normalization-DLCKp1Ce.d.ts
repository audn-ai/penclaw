//#region packages/media-generation-core/src/normalization.d.ts
/** Primitive value types reported in media generation normalization metadata. */
type MediaNormalizationValue = string | number | boolean;
/** Requested/applied value pair plus provenance for a normalized media option. */
type MediaNormalizationEntry<TValue extends MediaNormalizationValue> = {
  requested?: TValue;
  applied?: TValue;
  derivedFrom?: string;
  supportedValues?: readonly TValue[];
};
/** Normalization metadata shared by media generation responses. */
type MediaGenerationNormalizationMetadataInput = {
  size?: MediaNormalizationEntry<string>;
  aspectRatio?: MediaNormalizationEntry<string>;
  resolution?: MediaNormalizationEntry<string>;
  durationSeconds?: MediaNormalizationEntry<number>;
};
/** True when a normalization entry contains any user-visible normalization metadata. */
declare function hasMediaNormalizationEntry<TValue extends MediaNormalizationValue>(
  entry: MediaNormalizationEntry<TValue> | undefined,
): entry is MediaNormalizationEntry<TValue>;
//#endregion
export {
  hasMediaNormalizationEntry as i,
  MediaNormalizationEntry as n,
  MediaNormalizationValue as r,
  MediaGenerationNormalizationMetadataInput as t,
};
