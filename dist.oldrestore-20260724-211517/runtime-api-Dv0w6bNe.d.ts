import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
//#region extensions/matrix/src/auth-precedence.d.ts
type MatrixResolvedStringField =
  | "homeserver"
  | "userId"
  | "accessToken"
  | "password"
  | "deviceId"
  | "deviceName";
type MatrixResolvedStringValues = Record<MatrixResolvedStringField, string>;
type MatrixStringSourceMap = Partial<Record<MatrixResolvedStringField, string>>;
declare function resolveMatrixAccountStringValues(params: {
  accountId: string;
  account?: MatrixStringSourceMap;
  scopedEnv?: MatrixStringSourceMap;
  channel?: MatrixStringSourceMap;
  globalEnv?: MatrixStringSourceMap;
}): MatrixResolvedStringValues;
//#endregion
//#region extensions/matrix/src/matrix/deps.d.ts
declare function isMatrixSdkAvailable(): boolean;
declare function ensureMatrixSdkInstalled(params?: {
  runtime?: RuntimeEnv;
  confirm?: (message: string) => Promise<boolean>;
  resolveFn?: (id: string) => string;
}): Promise<void>;
//#endregion
//#region extensions/matrix/runtime-api.d.ts
declare function chunkTextForOutbound(text: string, limit: number): string[];
//#endregion
export {
  MatrixResolvedStringValues as a,
  MatrixResolvedStringField as i,
  ensureMatrixSdkInstalled as n,
  resolveMatrixAccountStringValues as o,
  isMatrixSdkAvailable as r,
  chunkTextForOutbound as t,
};
