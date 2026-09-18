import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./src-CIJf1lT0.js";
//#region src/gateway/server-methods/connect.ts
/**
 * Rejects `connect` after the WebSocket handshake already established identity.
 */
const connectHandlers = {
  connect: ({ respond }) => {
    respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, "connect is only valid as the first request"),
    );
  },
};
//#endregion
export { connectHandlers };
