//#region packages/normalization-core/src/error-coercion.d.ts
type FormatErrorMessageOptions = {
  redact: (text: string) => string;
};
/** Formats unknown errors with cause details, structured codes, and secret redaction. */
declare function formatErrorMessage(value: unknown, options: FormatErrorMessageOptions): string;
/**
 * Normalizes an unknown thrown value into an Error. Non-Error objects become
 * the `cause` and have their enumerable fields copied so structured details
 * (codes, statuses) survive the coercion.
 */
declare function toErrorObject(value: unknown, fallbackMessage: string): Error;
/** Renders a non-Error cause as useful text without throwing. */
declare function stringifyNonErrorCause(value: unknown): string;
//#endregion
export {
  toErrorObject as i,
  formatErrorMessage as n,
  stringifyNonErrorCause as r,
  FormatErrorMessageOptions as t,
};
