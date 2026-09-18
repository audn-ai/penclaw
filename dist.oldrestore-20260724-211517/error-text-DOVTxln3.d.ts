import { n as AcpRuntimeError, r as AcpRuntimeErrorCode } from "./errors-Buu3ylDF.js";

//#region packages/acp-core/src/runtime/error-text.d.ts
/** Formats ACP runtime errors with the operator next-step hint attached when known. */
declare function formatAcpRuntimeErrorText(error: AcpRuntimeError): string;
/** Normalizes unknown failures into ACP runtime error text for user-facing surfaces. */
declare function toAcpRuntimeErrorText(params: {
  error: unknown;
  fallbackCode: AcpRuntimeErrorCode;
  fallbackMessage: string;
}): string;
//#endregion
export { toAcpRuntimeErrorText as n, formatAcpRuntimeErrorText as t };
