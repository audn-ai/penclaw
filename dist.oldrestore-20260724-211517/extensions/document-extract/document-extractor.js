//#region extensions/document-extract/document-extractor.ts
const MAX_EXTRACTED_TEXT_CHARS = 2e5;
const MAX_RENDER_DIMENSION = 1e4;
let pdfEnginePromise = null;
async function loadPdfEngine() {
  if (!pdfEnginePromise)
    pdfEnginePromise = import("clawpdf")
      .then(({ createEngine }) => createEngine())
      .catch((err) => {
        pdfEnginePromise = null;
        throw new Error("Dependency clawpdf is required for PDF extraction", { cause: err });
      });
  return pdfEnginePromise;
}
function toDocumentImage(image) {
  return {
    type: "image",
    data: Buffer.from(image.bytes).toString("base64"),
    mimeType: image.mimeType,
  };
}
function isPdfPasswordError(err) {
  return Boolean(err && typeof err === "object" && err.code === "password");
}
async function openPdfDocument(params) {
  try {
    return params.password
      ? await params.engine.open(params.input, { password: params.password })
      : await params.engine.open(params.input);
  } catch (err) {
    if (isPdfPasswordError(err))
      throw new Error("PDF requires a password or password is incorrect.", { cause: err });
    throw err;
  }
}
async function extractPdfContent(request) {
  const pdf = await openPdfDocument({
    engine: await loadPdfEngine(),
    input: new Uint8Array(request.buffer),
    ...(request.password ? { password: request.password } : {}),
  });
  try {
    const pages = request.pageNumbers
      ? request.pageNumbers
          .filter((p) => Number.isInteger(p) && p >= 1 && p <= pdf.pageCount)
          .slice(0, request.maxPages)
      : void 0;
    const pageSelection = pages ? { pages } : { maxPages: request.maxPages };
    const text = (
      await pdf.extract({
        mode: "text",
        ...pageSelection,
        maxTextChars: MAX_EXTRACTED_TEXT_CHARS,
      })
    ).text;
    if (text.trim().length >= request.minTextChars)
      return {
        text,
        images: [],
      };
    const imagePages =
      pages ?? Array.from({ length: Math.min(pdf.pageCount, request.maxPages) }, (_, i) => i + 1);
    try {
      const images = [];
      let remainingPixels = request.maxPixels;
      for (const [index, pageNumber] of imagePages.entries()) {
        if (remainingPixels <= 0) break;
        const pagesRemaining = imagePages.length - index;
        const maxPixelsPerPage = Math.max(1, Math.ceil(remainingPixels / pagesRemaining));
        const imageResult = await pdf.extract({
          mode: "images",
          pages: [pageNumber],
          image: {
            maxDimension: MAX_RENDER_DIMENSION,
            maxPixels: maxPixelsPerPage,
            forms: true,
          },
        });
        for (const image of imageResult.images) {
          images.push(toDocumentImage(image));
          remainingPixels -= image.width * image.height;
        }
      }
      return {
        text,
        images,
      };
    } catch (err) {
      request.onImageExtractionError?.(err);
      return {
        text,
        images: [],
      };
    }
  } finally {
    pdf.destroy();
  }
}
function createPdfDocumentExtractor() {
  return {
    id: "pdf",
    label: "PDF",
    mimeTypes: ["application/pdf"],
    autoDetectOrder: 10,
    extract: extractPdfContent,
  };
}
//#endregion
export { createPdfDocumentExtractor };
