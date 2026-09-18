//#region src/cli/command-secret-targets.d.ts
/** All registered channel secret targets, regardless of current config. */
declare function getChannelsCommandSecretTargetIds(): Set<string>;
//#endregion
export { getChannelsCommandSecretTargetIds as t };
