//#region src/shared/balanced-json.ts
const CLOSING_DELIMITER = {
  "{": "}",
  "[": "]",
};
function isJsonOpeningDelimiter(char, openers) {
  return char === "{" ? openers.includes("{") : char === "[" && openers.includes("[");
}
/** Extract the first balanced JSON object/array prefix found in text. */
function extractBalancedJsonPrefix(raw, opts = {}) {
  const openers = opts.openers ?? ["{", "["];
  let start = 0;
  while (start < raw.length && !isJsonOpeningDelimiter(raw[start], openers)) start += 1;
  if (start >= raw.length) return null;
  const stack = [];
  let inString = false;
  let escaped = false;
  for (let i = start; i < raw.length; i += 1) {
    const char = raw[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') {
      inString = true;
      continue;
    }
    if (isJsonOpeningDelimiter(char, openers)) {
      stack.push(char);
      continue;
    }
    const opener = stack.at(-1);
    if (opener && char === CLOSING_DELIMITER[opener]) {
      stack.pop();
      if (stack.length === 0)
        return {
          json: raw.slice(start, i + 1),
          startIndex: start,
          endIndex: i,
        };
    }
  }
  return null;
}
/** Extract every balanced JSON object/array fragment from arbitrary text. */
function extractBalancedJsonFragments(raw, opts = {}) {
  const fragments = [];
  let offset = 0;
  while (offset < raw.length) {
    const fragment = extractBalancedJsonPrefix(raw.slice(offset), opts);
    if (!fragment) break;
    fragments.push({
      json: fragment.json,
      startIndex: offset + fragment.startIndex,
      endIndex: offset + fragment.endIndex,
    });
    offset += fragment.endIndex + 1;
  }
  return fragments;
}
//#endregion
export { extractBalancedJsonPrefix as n, extractBalancedJsonFragments as t };
