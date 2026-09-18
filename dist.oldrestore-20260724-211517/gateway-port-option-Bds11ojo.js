import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
//#region src/cli/gateway-port-option.ts
const MAX_TCP_PORT = 65535;
function parseGatewayPortOption(raw, flagName = "--port") {
  if (raw === void 0 || raw === null) return;
  const value =
    typeof raw === "string"
      ? raw.trim()
      : typeof raw === "number" || typeof raw === "bigint"
        ? String(raw)
        : "";
  if (!value) return;
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0 || parsed > MAX_TCP_PORT)
    throw new Error(`${flagName} must be an integer between 1 and ${MAX_TCP_PORT}.`);
  return parsed;
}
//#endregion
export { parseGatewayPortOption as t };
