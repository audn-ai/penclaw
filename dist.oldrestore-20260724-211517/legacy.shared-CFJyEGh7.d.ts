//#region src/config/legacy.shared.d.ts
type LegacyConfigRule = {
  path: string[];
  message: string;
  match?: (value: unknown, root: Record<string, unknown>) => boolean;
  requireSourceLiteral?: boolean;
};
//#endregion
export { LegacyConfigRule as t };
