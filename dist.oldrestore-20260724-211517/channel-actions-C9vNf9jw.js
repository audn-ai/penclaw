import "./sandbox-paths-DxDLkOQF.js";
import { Type } from "typebox";
import { v as readStringOrNumberParam } from "./common-DyDSUect.js";
import "./date-time-CcWivhrg.js";
import { s as stringEnum } from "./typebox-D411BFJf.js";
//#region src/channels/plugins/actions/shared.ts
/**
 * Filters out accounts explicitly marked as tokenless.
 */
function listTokenSourcedAccounts(accounts) {
  return accounts.filter((account) => account.tokenSource !== "none");
}
/**
 * Creates an action gate that is enabled when any account-level gate enables the action.
 */
function createUnionActionGate(accounts, createGate) {
  const gates = accounts.map((account) => createGate(account));
  return (key, defaultValue = true) => gates.some((gate) => gate(key, defaultValue));
}
//#endregion
//#region src/channels/plugins/actions/reaction-message-id.ts
/**
 * Reaction action message-id resolver.
 *
 * Reads explicit reaction targets or falls back to the current tool message context.
 */
/**
 * Resolves the message id for reaction tools from explicit args or current tool context.
 */
function resolveReactionMessageId(params) {
  return readStringOrNumberParam(params.args, "messageId") ?? params.toolContext?.currentMessageId;
}
//#endregion
//#region src/plugin-sdk/channel-actions.ts
/**
 * @deprecated Use semantic `presentation` capabilities instead of exposing
 * provider-native button schemas through the shared message tool.
 */
function createMessageToolButtonsSchema() {
  return Type.Optional(
    Type.Array(
      Type.Array(
        Type.Object({
          text: Type.String(),
          callback_data: Type.String(),
          style: Type.Optional(stringEnum(["danger", "success", "primary"])),
        }),
      ),
      { description: "Button rows for channels that support button-style actions." },
    ),
  );
}
/**
 * @deprecated Use semantic `presentation` capabilities instead of exposing
 * provider-native card schemas through the shared message tool.
 */
function createMessageToolCardSchema() {
  return Type.Optional(
    Type.Object(
      {},
      {
        additionalProperties: true,
        description: "Structured card payload for channels that support card-style messages.",
      },
    ),
  );
}
//#endregion
export {
  listTokenSourcedAccounts as a,
  createUnionActionGate as i,
  createMessageToolCardSchema as n,
  resolveReactionMessageId as r,
  createMessageToolButtonsSchema as t,
};
