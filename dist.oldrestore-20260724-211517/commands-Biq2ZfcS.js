import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DmSKVSKI.js";
import { t as buildCommandsListResult } from "./commands-list-result-DkRlFMQf.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { V as validateCommandsListParams } from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/commands.ts
/** Gateway handler for enumerating available chat/native commands. */
const commandsHandlers = {
  "commands.list": ({ params, respond, context }) => {
    if (!validateCommandsListParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid commands.list params: ${formatValidationErrors(validateCommandsListParams.errors)}`,
        ),
      );
      return;
    }
    const resolved = resolveAgentIdOrRespondError({
      rawAgentId: params.agentId,
      respond,
      cfg: context.getRuntimeConfig(),
      normalize: (rawAgentId) => (typeof rawAgentId === "string" ? rawAgentId.trim() : void 0),
    });
    if (!resolved) return;
    respond(
      true,
      buildCommandsListResult({
        cfg: resolved.cfg,
        agentId: resolved.agentId,
        provider: params.provider,
        scope: params.scope,
        includeArgs: params.includeArgs,
      }),
      void 0,
    );
  },
};
//#endregion
export { buildCommandsListResult, commandsHandlers };
