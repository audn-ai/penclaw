//#region src/infra/warning-filter.d.ts
/** Normalized process warning fields used by the shared warning suppressor. */
type ProcessWarning = {
  code?: string;
  name?: string;
  message?: string;
};
/** Returns whether a process warning matches a known noisy runtime/dependency warning. */
declare function shouldIgnoreWarning(warning: ProcessWarning): boolean;
/** Installs the global process warning filter once for the current JS realm. */
declare function installProcessWarningFilter(): void;
//#endregion
export { installProcessWarningFilter as n, shouldIgnoreWarning as r, ProcessWarning as t };
