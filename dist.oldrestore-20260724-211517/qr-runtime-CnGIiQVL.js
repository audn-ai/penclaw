import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
//#region src/media/qr-runtime.ts
const qrCodeRuntimeLoader = createLazyImportLoader(() =>
  import("qrcode").then((mod) => mod.default ?? mod),
);
/** Loads the qrcode package lazily so QR support does not affect media startup paths. */
async function loadQrCodeRuntime() {
  return await qrCodeRuntimeLoader.load();
}
//#endregion
export { loadQrCodeRuntime as t };
