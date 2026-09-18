import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./src-CIJf1lT0.js";
import { r as invokeNativeHookRelay } from "./native-hook-relay-WEC9uRFL.js";
//#region src/gateway/server-methods/native-hook-relay.ts
/** Gateway request handlers for invoking registered native hook relays. */
const nativeHookRelayHandlers = {
  "nativeHook.invoke": async ({ params, respond }) => {
    try {
      respond(
        true,
        await invokeNativeHookRelay({
          provider: params.provider,
          relayId: params.relayId,
          generation: params.generation,
          event: params.event,
          rawPayload: params.rawPayload,
          requireGeneration: true,
        }),
      );
    } catch (error) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          error instanceof Error ? error.message : "native hook relay failed",
        ),
      );
    }
  },
};
//#endregion
export { nativeHookRelayHandlers };
