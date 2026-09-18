//#region src/agents/json-unsafe-integers.ts
/**
 * JSON parsing helpers that preserve integer literals larger than
 * Number.MAX_SAFE_INTEGER as strings before JSON.parse can round them.
 */
const MAX_SAFE_INTEGER_ABS_STR = String(Number.MAX_SAFE_INTEGER);
function isAsciiDigit(ch) {
  return ch !== void 0 && ch >= "0" && ch <= "9";
}
function parseJsonNumberToken(input, start) {
  let idx = start;
  if (input[idx] === "-") idx += 1;
  if (idx >= input.length) return null;
  if (input[idx] === "0") idx += 1;
  else if (isAsciiDigit(input[idx]) && input[idx] !== "0")
    while (isAsciiDigit(input[idx])) idx += 1;
  else return null;
  let isInteger = true;
  if (input[idx] === ".") {
    isInteger = false;
    idx += 1;
    if (!isAsciiDigit(input[idx])) return null;
    while (isAsciiDigit(input[idx])) idx += 1;
  }
  if (input[idx] === "e" || input[idx] === "E") {
    isInteger = false;
    idx += 1;
    if (input[idx] === "+" || input[idx] === "-") idx += 1;
    if (!isAsciiDigit(input[idx])) return null;
    while (isAsciiDigit(input[idx])) idx += 1;
  }
  return {
    token: input.slice(start, idx),
    end: idx,
    isInteger,
  };
}
function isUnsafeIntegerLiteral(token) {
  const digits = token[0] === "-" ? token.slice(1) : token;
  if (digits.length < MAX_SAFE_INTEGER_ABS_STR.length) return false;
  if (digits.length > MAX_SAFE_INTEGER_ABS_STR.length) return true;
  return digits > MAX_SAFE_INTEGER_ABS_STR;
}
/** Quotes integer literals above Number.MAX_SAFE_INTEGER before JSON.parse. */
function quoteUnsafeIntegerLiterals(input) {
  let out = "";
  let inString = false;
  let escaped = false;
  let idx = 0;
  while (idx < input.length) {
    const ch = input[idx] ?? "";
    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      idx += 1;
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      idx += 1;
      continue;
    }
    if (ch === "-" || isAsciiDigit(ch)) {
      const parsed = parseJsonNumberToken(input, idx);
      if (parsed) {
        if (parsed.isInteger && isUnsafeIntegerLiteral(parsed.token)) out += `"${parsed.token}"`;
        else out += parsed.token;
        idx = parsed.end;
        continue;
      }
    }
    out += ch;
    idx += 1;
  }
  return out;
}
/** Parses JSON while preserving unsafe integer literals as strings. */
function parseJsonPreservingUnsafeIntegers(input) {
  return JSON.parse(quoteUnsafeIntegerLiterals(input));
}
/** Parses or accepts an object while preserving unsafe integer literals in string input. */
function parseJsonObjectPreservingUnsafeIntegers(value) {
  if (typeof value === "string") {
    try {
      const parsed = parseJsonPreservingUnsafeIntegers(value);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch {
      return null;
    }
    return null;
  }
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return null;
}
//#endregion
export {
  parseJsonPreservingUnsafeIntegers as n,
  quoteUnsafeIntegerLiterals as r,
  parseJsonObjectPreservingUnsafeIntegers as t,
};
