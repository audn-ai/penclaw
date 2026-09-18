//#region packages/terminal-core/src/prompt-style.d.ts
/** Style a prompt message when rich terminal output is active. */
declare const stylePromptMessage: (message: string) => string;
/** Style a prompt title when rich terminal output is active. */
declare const stylePromptTitle: (title?: string) => string | undefined;
/** Style a prompt hint when rich terminal output is active. */
declare const stylePromptHint: (hint?: string) => string | undefined;
//#endregion
export { stylePromptMessage as n, stylePromptTitle as r, stylePromptHint as t };
