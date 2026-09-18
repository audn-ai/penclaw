//#region src/plugins/document-extractor-types.d.ts
/** Image extracted from a document page. */
type DocumentExtractedImage = {
  type: "image";
  data: string;
  mimeType: string;
};
/** Request passed to plugin document extractors. */
type DocumentExtractionRequest = {
  buffer: Buffer;
  mimeType: string;
  maxPages: number;
  maxPixels: number;
  minTextChars: number;
  password?: string;
  pageNumbers?: number[];
  onImageExtractionError?: (error: unknown) => void;
};
/** Text and image result returned by a document extractor. */
type DocumentExtractionResult = {
  text: string;
  images: DocumentExtractedImage[];
};
/** Plugin document extractor capability contract. */
type DocumentExtractorPlugin = {
  id: string;
  label: string;
  mimeTypes: readonly string[];
  autoDetectOrder?: number;
  extract: (request: DocumentExtractionRequest) => Promise<DocumentExtractionResult | null>;
};
//#endregion
export {
  DocumentExtractorPlugin as i,
  DocumentExtractionRequest as n,
  DocumentExtractionResult as r,
  DocumentExtractedImage as t,
};
