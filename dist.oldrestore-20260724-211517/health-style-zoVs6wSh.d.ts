//#region packages/terminal-core/src/health-style.d.ts
/** Highlight known health status prefixes in a "label: detail" line. */
declare function styleHealthChannelLine(line: string, rich: boolean): string;
//#endregion
export { styleHealthChannelLine as t };
