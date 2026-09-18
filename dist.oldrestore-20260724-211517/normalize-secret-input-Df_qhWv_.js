//#region src/utils/normalize-secret-input.ts
/**
 * Secret normalization for copy/pasted credentials.
 *
 * Common footgun: line breaks (especially `\r`) embedded in API keys/tokens.
 * We strip line breaks anywhere, then trim whitespace at the ends.
 *
 * Another frequent source of runtime failures is rich-text/Unicode artifacts
 * (smart punctuation, box-drawing chars, etc.) pasted into API keys. These can
 * break HTTP header construction (`ByteString` violations). Drop non-Latin1
 * code points so malformed keys fail as auth errors instead of crashing request
 * setup.
 *
 * Intentionally does NOT remove ordinary spaces inside the string to avoid
 * silently altering "Bearer <token>" style values.
 */
/**
 * Normalizes a raw secret value from config, env, setup prompts, or plugin SDK callers.
 * Returns an empty string for absent/invalid input so callers can keep boolean presence checks simple.
 */
function normalizeSecretInput(value) {
  if (typeof value !== "string") return "";
  const collapsed = value.replace(/[\r\n\u2028\u2029]+/g, "");
  const chars = [];
  for (const char of collapsed) {
    const codePoint = char.codePointAt(0);
    if (
      typeof codePoint === "number" &&
      codePoint <= 255 &&
      !(
        typeof codePoint === "number" &&
        ((codePoint >= 0 && codePoint <= 31) ||
          codePoint === 127 ||
          (codePoint >= 128 && codePoint <= 159))
      )
    )
      chars.push(char);
  }
  return chars.join("").trim();
}
/**
 * Normalizes a raw secret value and converts empty normalized output to `undefined`.
 * Use this at optional config boundaries where "not configured" is clearer than an empty string.
 */
function normalizeOptionalSecretInput(value) {
  return normalizeSecretInput(value) || void 0;
}
//#endregion
export { normalizeSecretInput as n, normalizeOptionalSecretInput as t };
