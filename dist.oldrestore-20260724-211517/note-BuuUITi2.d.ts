//#region packages/terminal-core/src/note.d.ts
declare function wrapNoteMessage(
  message: unknown,
  options?: {
    maxWidth?: number;
    columns?: number;
  },
): string;
declare function resolveNoteColumns(columns: number | undefined): number;
declare function resolveNoteOutputColumns(message: string, columns: number): number;
declare function note(message: unknown, title?: string): void;
declare function withSuppressedNotes<T>(callback: () => T): T;
//#endregion
export {
  wrapNoteMessage as a,
  withSuppressedNotes as i,
  resolveNoteColumns as n,
  resolveNoteOutputColumns as r,
  note as t,
};
