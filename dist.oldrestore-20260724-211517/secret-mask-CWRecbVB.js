import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/security/secret-mask.ts
/** Masks credential-like values without splitting UTF-16 surrogate pairs at the edges. */
function maskApiKey(value) {
  const trimmed = stripControlCharacters(value).trim();
  if (!trimmed) return "missing";
  if (trimmed.length <= 6)
    return `${sliceUtf16Safe(trimmed, 0, 1)}...${sliceUtf16Safe(trimmed, -1)}`;
  if (trimmed.length <= 16)
    return `${sliceUtf16Safe(trimmed, 0, 2)}...${sliceUtf16Safe(trimmed, -2)}`;
  return `${sliceUtf16Safe(trimmed, 0, 8)}...${sliceUtf16Safe(trimmed, -8)}`;
}
function stripControlCharacters(value) {
  let result = "";
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (!((code >= 0 && code <= 31) || (code >= 127 && code <= 159))) result += character;
  }
  return result;
}
//#endregion
export { maskApiKey as t };
