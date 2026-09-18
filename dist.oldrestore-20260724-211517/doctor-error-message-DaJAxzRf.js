import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/flows/doctor-error-message.ts
const ERR_MESSAGE_MAX_LEN = 256;
/** Removes control characters and caps error messages before doctor prints them. */
function scrubDoctorErrorMessage(err) {
  const raw = err instanceof Error ? err.message : String(err);
  let stripped = "";
  for (let index = 0; index < raw.length; index++) {
    const code = raw.charCodeAt(index);
    if (code > 31 && code !== 127) stripped += raw.charAt(index);
  }
  if (stripped.length <= ERR_MESSAGE_MAX_LEN) return stripped;
  return `${truncateUtf16Safe(stripped, ERR_MESSAGE_MAX_LEN - 3)}...`;
}
//#endregion
export { scrubDoctorErrorMessage as t };
