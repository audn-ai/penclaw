import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { t as buildModelsListResult } from "./models-list-result-CSqAuI9Y.js";
import { Ut as validateModelsListParams } from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/models.ts
const modelsHandlers = {
  "models.list": async ({ params, respond, context }) => {
    if (!validateModelsListParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid models.list params: ${formatValidationErrors(validateModelsListParams.errors)}`,
        ),
      );
      return;
    }
    try {
      respond(
        true,
        await buildModelsListResult({
          context,
          params,
        }),
        void 0,
      );
    } catch (err) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, String(err)));
    }
  },
};
//#endregion
export { buildModelsListResult, modelsHandlers };
