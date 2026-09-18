//#region packages/terminal-core/src/table.d.ts
type Align = "left" | "right" | "center";
type TableColumn = {
  key: string;
  header: string;
  align?: Align;
  minWidth?: number;
  maxWidth?: number;
  flex?: boolean;
};
type RenderTableOptions = {
  columns: TableColumn[];
  rows: Array<Record<string, string>>;
  width?: number;
  padding?: number;
  border?: "unicode" | "ascii" | "none";
};
declare function getTerminalTableWidth(minWidth?: number, fallbackWidth?: number): number;
declare function renderTable(opts: RenderTableOptions): string;
//#endregion
export { renderTable as i, TableColumn as n, getTerminalTableWidth as r, RenderTableOptions as t };
