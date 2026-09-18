import { randomUUID } from "node:crypto";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as WizardSession } from "./session-BDeUy4HN.js";
import {
  Gi as validateWizardNextParams,
  Ki as validateWizardStartParams,
  Wi as validateWizardCancelParams,
  qi as validateWizardStatusParams,
} from "./src-CIJf1lT0.js";
import { p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
import { t as formatForLog } from "./ws-log-BlD6I7mP.js";
//#region src/gateway/server-methods/wizard.ts
const runDefaultSetupWizard = async (...args) => {
  const { runSetupWizard } = await import("./setup-D7KbhEdl.js");
  return runSetupWizard(...args);
};
const runDefaultChannelSetupWizard = async (...args) => {
  const { runChannelsSetupWizard } = await import("./add-wizard-uAg489y7.js");
  return runChannelsSetupWizard(...args);
};
function readWizardStatus(session) {
  return {
    status: session.getStatus(),
    error: session.getError(),
  };
}
/** Resolves a live wizard session or sends the public not-found error. */
function findWizardSessionOrRespond(params) {
  const session = params.context.wizardSessions.get(params.sessionId);
  if (!session) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard not found"));
    return null;
  }
  return session;
}
/** Gateway handlers for the interactive setup wizard session lifecycle. */
const wizardHandlers = {
  "wizard.start": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateWizardStartParams, "wizard.start", respond)) return;
    if (context.findRunningWizard()) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "wizard already running"));
      return;
    }
    const sessionId = randomUUID();
    const session =
      (params.flow ?? "setup") === "channels"
        ? new WizardSession((prompter, _signal, wizardSession) =>
            context.channelWizardRunner(
              {
                channel: readStringValue(params.channel),
                onConfigured: (accounts) => wizardSession.setConfiguredAccounts(accounts),
                beforePersistentEffect: async () => wizardSession.lockCancellation(),
              },
              defaultRuntime,
              prompter,
            ),
          )
        : new WizardSession((prompter) =>
            context.wizardRunner(
              {
                mode: params.mode,
                workspace: readStringValue(params.workspace),
              },
              defaultRuntime,
              prompter,
            ),
          );
    context.wizardSessions.set(sessionId, session);
    const result = await session.next();
    if (result.done) context.purgeWizardSession(sessionId);
    respond(
      true,
      {
        sessionId,
        ...result,
      },
      void 0,
    );
  },
  "wizard.next": async ({ params, respond, context }) => {
    if (!assertValidParams(params, validateWizardNextParams, "wizard.next", respond)) return;
    const sessionId = params.sessionId;
    const session = findWizardSessionOrRespond({
      context,
      respond,
      sessionId,
    });
    if (!session) return;
    const answer = params.answer;
    if (answer) {
      if (session.getStatus() !== "running") {
        respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "wizard not running"));
        return;
      }
      try {
        const validationError = await session.answer(answer.stepId ?? "", answer.value);
        if (validationError) {
          respond(
            true,
            {
              ...(await session.next()),
              error: validationError,
            },
            void 0,
          );
          return;
        }
      } catch (err) {
        respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, formatForLog(err)));
        return;
      }
    }
    const result = await session.next();
    if (result.done) context.purgeWizardSession(sessionId);
    respond(true, result, void 0);
  },
  "wizard.cancel": ({ params, respond, context }) => {
    if (!assertValidParams(params, validateWizardCancelParams, "wizard.cancel", respond)) return;
    const sessionId = params.sessionId;
    const session = findWizardSessionOrRespond({
      context,
      respond,
      sessionId,
    });
    if (!session) return;
    const cancelled = session.cancel();
    const status = readWizardStatus(session);
    if (cancelled || status.status !== "running") context.wizardSessions.delete(sessionId);
    respond(true, status, void 0);
  },
  "wizard.status": ({ params, respond, context }) => {
    if (!assertValidParams(params, validateWizardStatusParams, "wizard.status", respond)) return;
    const sessionId = params.sessionId;
    const session = findWizardSessionOrRespond({
      context,
      respond,
      sessionId,
    });
    if (!session) return;
    const status = readWizardStatus(session);
    if (status.status !== "running") context.wizardSessions.delete(sessionId);
    respond(true, status, void 0);
  },
};
//#endregion
export { runDefaultChannelSetupWizard, runDefaultSetupWizard, wizardHandlers };
