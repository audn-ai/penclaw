//#region extensions/feishu/runtime-api.d.ts
type RuntimeEnv = {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  exit: (code: number) => void;
};
//#endregion
export { RuntimeEnv as t };
