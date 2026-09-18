//#region src/infra/inline-option-token.ts
/** Splits one CLI-style option token into its flag name and optional inline value. */
function parseInlineOptionToken(token) {
  const separatorIndex = token.indexOf("=");
  if (separatorIndex < 0)
    return {
      name: token,
      hasInlineValue: false,
    };
  return {
    name: token.slice(0, separatorIndex),
    hasInlineValue: true,
    inlineValue: token.slice(separatorIndex + 1),
  };
}
//#endregion
export { parseInlineOptionToken as t };
