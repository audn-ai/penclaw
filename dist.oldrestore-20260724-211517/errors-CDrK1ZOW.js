import { s as configureAcpErrorRedactor } from "./errors-BTjUwYsc.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import "./src-D7UaqqXI.js";
//#region src/acp/runtime/errors.ts
/** ACP runtime error exports wired to OpenClaw secret redaction. */
configureAcpErrorRedactor(redactSensitiveText);
//#endregion
export {};
