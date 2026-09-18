//#region extensions/file-transfer/src/shared/base64.ts
function isBase64DataChar(code) {
  return (
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    (code >= 48 && code <= 57) ||
    code === 43 ||
    code === 47 ||
    code === 45 ||
    code === 95
  );
}
/** Validates base64 structure and returns its decoded size without allocating a decode buffer. */
function inspectStrictBase64(value) {
  let dataChars = 0;
  let padding = 0;
  let sawPadding = false;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code === 61) {
      padding += 1;
      if (padding > 2) return;
      sawPadding = true;
      continue;
    }
    if (sawPadding || !isBase64DataChar(code)) return;
    dataChars += 1;
  }
  if (dataChars === 0) return padding === 0 ? 0 : void 0;
  const remainder = dataChars % 4;
  if (padding === 0) return remainder === 1 ? void 0 : Math.floor((dataChars * 3) / 4);
  if (dataChars + padding < 4 || (dataChars + padding) % 4 !== 0) return;
  if ((padding === 1 && remainder !== 3) || (padding === 2 && remainder !== 2)) return;
  return Math.floor((dataChars * 3) / 4);
}
//#endregion
export { inspectStrictBase64 as t };
