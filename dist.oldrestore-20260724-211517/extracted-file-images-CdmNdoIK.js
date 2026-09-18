//#region src/media-understanding/extracted-file-images.ts
function stripExtractedFileImageMetadata(image) {
  return {
    type: "image",
    data: image.data,
    mimeType: image.mimeType,
  };
}
//#endregion
export { stripExtractedFileImageMetadata as t };
