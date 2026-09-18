import {
  n as getDiagnosticStabilitySnapshot,
  r as normalizeDiagnosticStabilityQuery,
} from "./diagnostic-stability-CLWtpjoV.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./src-CIJf1lT0.js";
//#region src/gateway/server-methods/diagnostics.ts
/** Gateway handler for payload-free stability diagnostics. */
const diagnosticsHandlers = {
  "diagnostics.stability": async ({ params, respond }) => {
    try {
      respond(
        true,
        getDiagnosticStabilitySnapshot(normalizeDiagnosticStabilityQuery(params)),
        void 0,
      );
    } catch (err) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          err instanceof Error ? err.message : "invalid diagnostics.stability params",
        ),
      );
    }
  },
};
//#endregion
export { diagnosticsHandlers };
