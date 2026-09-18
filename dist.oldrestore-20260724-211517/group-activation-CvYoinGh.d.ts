//#region src/auto-reply/group-activation.d.ts
/** Supported group activation modes. */
type GroupActivationMode = "mention" | "always";
/** Normalize a raw group activation mode string. */
declare function normalizeGroupActivation(raw?: string | null): GroupActivationMode | undefined;
/** Parse `/activation` commands from inbound message text. */
declare function parseActivationCommand(raw?: string): {
  hasCommand: boolean;
  mode?: GroupActivationMode;
};
//#endregion
export { normalizeGroupActivation as n, parseActivationCommand as r, GroupActivationMode as t };
