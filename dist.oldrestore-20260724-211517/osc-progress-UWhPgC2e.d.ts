//#region packages/terminal-core/src/osc-progress.d.ts
/** Controller for terminal progress state. */
type OscProgressController = {
  setIndeterminate: (label: string) => void;
  setPercent: (label: string, percent: number) => void;
  clear: () => void;
};
/** Return true when the terminal is known to support OSC progress messages. */
declare function supportsOscProgress(env: NodeJS.ProcessEnv, isTty: boolean): boolean;
/** Create a progress controller, returning no-op methods on unsupported terminals. */
declare function createOscProgressController(params: {
  env: NodeJS.ProcessEnv;
  isTty: boolean;
  write: (chunk: string) => void;
}): OscProgressController;
//#endregion
export { createOscProgressController as n, supportsOscProgress as r, OscProgressController as t };
