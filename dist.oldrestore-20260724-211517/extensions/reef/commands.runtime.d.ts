//#region extensions/reef/src/commands.d.ts
declare function handleReefCommand({ args }: { args?: string }): Promise<{
  text: string;
}>;
//#endregion
export { handleReefCommand };
