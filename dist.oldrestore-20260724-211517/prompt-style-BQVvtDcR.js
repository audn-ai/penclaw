import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
//#region packages/terminal-core/src/prompt-style.ts
/** Style a prompt message when rich terminal output is active. */
const stylePromptMessage = (message) => (isRich() ? theme.accent(message) : message);
/** Style a prompt title when rich terminal output is active. */
const stylePromptTitle = (title) => (title && isRich() ? theme.heading(title) : title);
/** Style a prompt hint when rich terminal output is active. */
const stylePromptHint = (hint) => (hint && isRich() ? theme.muted(hint) : hint);
//#endregion
export { stylePromptMessage as n, stylePromptTitle as r, stylePromptHint as t };
