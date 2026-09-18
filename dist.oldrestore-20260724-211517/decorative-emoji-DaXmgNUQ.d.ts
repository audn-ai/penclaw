//#region packages/terminal-core/src/decorative-emoji.d.ts
/** Environment and terminal facts used to decide decorative emoji support. */
type DecorativeEmojiOptions = {
  env?: NodeJS.ProcessEnv;
  isTty?: boolean;
  platform?: NodeJS.Platform;
  stream?: {
    isTTY?: boolean;
  };
};
/** Return true when decorative emoji should be emitted for the target terminal. */
declare function supportsDecorativeEmoji(options?: DecorativeEmojiOptions): boolean;
/** Return the emoji only when decorative emoji output is supported. */
declare function decorativeEmoji(emoji: string, options?: DecorativeEmojiOptions): string;
/** Prefix text with a decorative emoji when supported. */
declare function decorativePrefix(
  emoji: string,
  text: string,
  options?: DecorativeEmojiOptions,
): string;
/** Strip decorative emoji for terminals that should not receive them. */
declare function stripDecorativeEmojiForTerminal(
  text: string,
  options?: DecorativeEmojiOptions,
): string;
//#endregion
export {
  supportsDecorativeEmoji as a,
  stripDecorativeEmojiForTerminal as i,
  decorativeEmoji as n,
  decorativePrefix as r,
  DecorativeEmojiOptions as t,
};
