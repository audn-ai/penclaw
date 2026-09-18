import crypto from "node:crypto";
//#region src/commands/random-token.ts
/**
 * Gateway token generation helper.
 *
 * Tokens are opaque random hex strings used by setup when no explicit gateway
 * token or secret reference exists.
 */
/** Generates a new 192-bit gateway token encoded as hex. */
function randomToken() {
  return crypto.randomBytes(24).toString("hex");
}
//#endregion
export { randomToken as t };
