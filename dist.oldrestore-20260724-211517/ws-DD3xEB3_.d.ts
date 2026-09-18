import WebSocket$1 from "ws";

//#region src/infra/ws.d.ts
declare function rawDataToString(data: WebSocket$1.RawData, encoding?: BufferEncoding): string;
declare function rawDataByteLength(data: WebSocket$1.RawData): number;
//#endregion
export { rawDataToString as n, rawDataByteLength as t };
