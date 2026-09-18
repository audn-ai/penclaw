import { Buffer } from "node:buffer";
//#region src/infra/ws.ts
function rawDataToString(data, encoding = "utf8") {
  if (Array.isArray(data)) return Buffer.concat(data).toString(encoding);
  return data instanceof ArrayBuffer
    ? Buffer.from(data).toString(encoding)
    : data.toString(encoding);
}
function rawDataByteLength(data) {
  return Array.isArray(data)
    ? data.reduce((total, chunk) => total + chunk.byteLength, 0)
    : data.byteLength;
}
//#endregion
export { rawDataToString as n, rawDataByteLength as t };
