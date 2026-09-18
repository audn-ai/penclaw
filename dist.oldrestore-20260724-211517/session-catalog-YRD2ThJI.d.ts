import {
  D as SessionsCatalogReadResult,
  l as SessionCatalogSession,
} from "./sessions-catalog-DPwzj-x7.js";
//#region extensions/opencode/session-catalog.d.ts
type OpenCodeSessionPage = {
  sessions: SessionCatalogSession[];
  nextCursor?: string;
};
declare function optionalOpenCodeString(value: unknown, maxLength: number): string | undefined;
declare function listLocalOpenCodeSessionPage(value?: unknown): Promise<OpenCodeSessionPage>;
declare function readLocalOpenCodeTranscriptPage(
  value: unknown,
): Promise<SessionsCatalogReadResult>;
//#endregion
export {
  readLocalOpenCodeTranscriptPage as i,
  listLocalOpenCodeSessionPage as n,
  optionalOpenCodeString as r,
  OpenCodeSessionPage as t,
};
