import { a as OpenClawConfig } from "./backend-config-BRooFqzp.js";
import { A as MemoryReadResult } from "./memory-state-wPutFXhr.js";

//#region packages/memory-host-sdk/src/host/read-file-shared.d.ts
/** Default number of lines returned by memory read helpers. */
declare const DEFAULT_MEMORY_READ_LINES = 120;
/** Default max character budget for memory read helper output. */
declare const DEFAULT_MEMORY_READ_MAX_CHARS = 12000;
/** Build a memory read result from an already-selected line slice. */
declare function buildMemoryReadResultFromSlice(params: {
  selectedLines: string[];
  relPath: string;
  startLine: number;
  moreSourceLinesRemain?: boolean;
  maxChars?: number;
  suggestReadFallback?: boolean;
}): MemoryReadResult;
/** Build a memory read result from raw file content and caller range options. */
declare function buildMemoryReadResult(params: {
  content: string;
  relPath: string;
  from?: number;
  lines?: number;
  defaultLines?: number;
  maxChars?: number;
  suggestReadFallback?: boolean;
}): MemoryReadResult;
//#endregion
//#region packages/memory-host-sdk/src/host/read-file.d.ts
/** Read a validated memory markdown file from workspace or configured extra paths. */
declare function readMemoryFile(params: {
  workspaceDir: string;
  extraPaths?: string[];
  relPath: string;
  from?: number;
  lines?: number;
  defaultLines?: number;
  maxChars?: number;
}): Promise<MemoryReadResult>;
/** Resolve agent memory config and read one memory file for that agent. */
declare function readAgentMemoryFile(params: {
  cfg: OpenClawConfig;
  agentId: string;
  relPath: string;
  from?: number;
  lines?: number;
}): Promise<MemoryReadResult>;
//#endregion
export {
  buildMemoryReadResult as a,
  DEFAULT_MEMORY_READ_MAX_CHARS as i,
  readMemoryFile as n,
  buildMemoryReadResultFromSlice as o,
  DEFAULT_MEMORY_READ_LINES as r,
  readAgentMemoryFile as t,
};
