import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { t as readConfiguredLogTail } from "./log-tail-DCUXlFWQ.js";
import { Vt as validateLogsTailParams } from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/logs.ts
/** Gateway handler for bounded reads from the configured gateway log. */
const logsHandlers = {
  "logs.tail": async ({ params, respond }) => {
    if (!validateLogsTailParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid logs.tail params: ${formatValidationErrors(validateLogsTailParams.errors)}`,
        ),
      );
      return;
    }
    const p = params;
    try {
      respond(
        true,
        await readConfiguredLogTail({
          cursor: p.cursor,
          limit: p.limit,
          maxBytes: p.maxBytes,
        }),
        void 0,
      );
    } catch (err) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `log read failed: ${String(err)}`));
    }
  },
};
//#endregion
export { logsHandlers };
