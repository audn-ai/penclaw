import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import "./src-CIJf1lT0.js";
import {
  n as loadVoiceWakeConfig,
  r as setVoiceWakeTriggers,
  t as normalizeVoiceWakeTriggers,
} from "./server-utils-Dw9BG4RN.js";
import { t as formatForLog } from "./ws-log-BlD6I7mP.js";
//#region src/gateway/server-methods/voicewake.ts
/** Gateway request handlers for reading and updating voice wake triggers. */
const voicewakeHandlers = {
  "voicewake.get": async ({ respond }) => {
    try {
      respond(true, { triggers: (await loadVoiceWakeConfig()).triggers });
    } catch (err) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },
  "voicewake.set": async ({ params, respond, context }) => {
    if (!Array.isArray(params.triggers)) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "voicewake.set requires triggers: string[]"),
      );
      return;
    }
    try {
      const cfg = await setVoiceWakeTriggers(normalizeVoiceWakeTriggers(params.triggers));
      context.broadcastVoiceWakeChanged(cfg.triggers);
      respond(true, { triggers: cfg.triggers });
    } catch (err) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
    }
  },
};
//#endregion
export { voicewakeHandlers };
