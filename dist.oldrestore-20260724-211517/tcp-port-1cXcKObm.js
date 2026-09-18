import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
//#region src/infra/tcp-port.ts
const MAX_TCP_PORT = 65535;
/** Parse a positive TCP port or return null for absent/invalid input. */
function parseTcpPort(raw) {
  if (raw === void 0 || raw === null) return null;
  const parsed = parseStrictPositiveInteger(raw);
  if (parsed === void 0 || parsed > 65535) return null;
  return parsed;
}
/** Extract the effective `--port` value from command arguments. */
function parseTcpPortFromArgs(programArguments) {
  if (!programArguments?.length) return null;
  for (let index = 0; index < programArguments.length; index += 1) {
    const argument = programArguments[index];
    if (argument === "--port") {
      const parsed = parseTcpPort(programArguments[index + 1]);
      if (parsed !== null) return parsed;
    }
    if (argument?.startsWith("--port=")) {
      const parsed = parseTcpPort(argument.slice(7));
      if (parsed !== null) return parsed;
    }
  }
  return null;
}
//#endregion
export { parseTcpPort as n, parseTcpPortFromArgs as r, MAX_TCP_PORT as t };
