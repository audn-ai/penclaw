//#region packages/normalization-core/src/result.d.ts
/** Result of a fallible operation. Expected failures use the `ok: false` arm. */
type Result<TValue, TError> =
  | {
      ok: true;
      value: TValue;
    }
  | {
      ok: false;
      error: TError;
    };
/** Create a successful {@link Result}. */
declare function ok<TValue, TError>(value: TValue): Result<TValue, TError>;
/** Create a failed {@link Result}. */
declare function err<TValue, TError>(error: TError): Result<TValue, TError>;
//#endregion
export { err as n, ok as r, Result as t };
