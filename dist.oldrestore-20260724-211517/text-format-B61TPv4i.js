//#region src/commands/text-format.ts
/** Shortens text to maxLen code points, appending an ellipsis when truncated. */
const shortenText = (value, maxLen) => {
  if (maxLen <= 0) return "";
  const chars = Array.from(value);
  if (chars.length <= maxLen) return value;
  return `${chars.slice(0, Math.max(0, maxLen - 1)).join("")}…`;
};
//#endregion
export { shortenText as t };
