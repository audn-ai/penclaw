//#region packages/terminal-core/src/theme.d.ts
/** Shared terminal theme color functions. */
declare const theme: {
  readonly accent: import("chalk").ChalkInstance;
  readonly accentBright: import("chalk").ChalkInstance;
  readonly accentDim: import("chalk").ChalkInstance;
  readonly info: import("chalk").ChalkInstance;
  readonly success: import("chalk").ChalkInstance;
  readonly warn: import("chalk").ChalkInstance;
  readonly error: import("chalk").ChalkInstance;
  readonly muted: import("chalk").ChalkInstance;
  readonly heading: import("chalk").ChalkInstance;
  readonly command: import("chalk").ChalkInstance;
  readonly option: import("chalk").ChalkInstance;
};
/** Return true when color styling is active. */
declare const isRich: () => boolean;
/** Conditionally apply a color function based on caller rich-output state. */
declare const colorize: (rich: boolean, color: (value: string) => string, value: string) => string;
//#endregion
export { isRich as n, theme as r, colorize as t };
