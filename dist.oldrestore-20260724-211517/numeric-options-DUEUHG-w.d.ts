//#region packages/acp-core/src/numeric-options.d.ts
/** Resolves ACP integer options through the shared normalization contract. */
declare function resolveIntegerOption(
  value: number | undefined,
  fallback: number,
  params: {
    min: number;
  },
): number;
//#endregion
export { resolveIntegerOption as t };
