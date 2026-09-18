//#region src/agents/console-sanitize.ts
/** Sanitize optional text for compact console output. */
function sanitizeForConsole(text, maxChars = 200) {
  const trimmed = text?.trim();
  if (!trimmed) return;
  const sanitized = Array.from(trimmed)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return !(
        code <= 8 ||
        code === 11 ||
        code === 12 ||
        (code >= 14 && code <= 31) ||
        code === 127
      );
    })
    .join("")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const codePoints = Array.from(sanitized);
  if (codePoints.length <= maxChars) return sanitized;
  return `${codePoints.slice(0, maxChars).join("")}…`;
}
//#endregion
export { sanitizeForConsole as t };
