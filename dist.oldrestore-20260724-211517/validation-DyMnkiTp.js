import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/validation.ts
/** Validate params and emit the standard INVALID_REQUEST response on failure. */
function assertValidParams(params, validate, method, respond) {
  if (validate(params)) return true;
  respond(
    false,
    void 0,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `invalid ${method} params: ${formatValidationErrors(validate.errors)}`,
    ),
  );
  return false;
}
//#endregion
export { assertValidParams as t };
