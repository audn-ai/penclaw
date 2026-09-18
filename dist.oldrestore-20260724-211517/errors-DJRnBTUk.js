import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./error-runtime-BIAwr399.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/matrix/src/matrix/errors.ts
function formatMatrixErrorMessage(err) {
  return formatErrorMessage(err);
}
function formatMatrixErrorReason(err) {
  return normalizeLowercaseStringOrEmpty(formatMatrixErrorMessage(err));
}
function isMatrixNotFoundError(err) {
  const errObj = err;
  if (errObj?.statusCode === 404 || errObj?.body?.errcode === "M_NOT_FOUND") return true;
  const message = formatMatrixErrorReason(err);
  return (
    message.includes("m_not_found") || message.includes("[404]") || message.includes("not found")
  );
}
//#endregion
export { formatMatrixErrorReason as n, isMatrixNotFoundError as r, formatMatrixErrorMessage as t };
