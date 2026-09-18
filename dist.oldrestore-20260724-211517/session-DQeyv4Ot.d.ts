import { r as AcpSession } from "./types-Bst3_XVW.js";

//#region packages/acp-core/src/session.d.ts
type AcpSessionStore = {
  /** Creates or refreshes an in-memory ACP session under the supplied session id. */ createSession: (params: {
    sessionKey: string;
    cwd: string;
    sessionId?: string;
    ledgerSessionId?: string;
  }) => AcpSession;
  hasSession: (sessionId: string) => boolean;
  getSession: (sessionId: string) => AcpSession | undefined;
  getSessionByRunId: (
    runId: string,
  ) =>
    | AcpSession
    | undefined /** Binds an active runtime run to a session so cancel/close can abort it later. */;
  setActiveRun: (sessionId: string, runId: string, abortController: AbortController) => void;
  clearActiveRun: (sessionId: string) => void;
  cancelActiveRun: (sessionId: string) => boolean;
  deleteSession: (sessionId: string) => boolean;
  clearAllSessionsForTest: () => void;
};
type AcpSessionStoreOptions = {
  maxSessions?: number;
  idleTtlMs?: number;
  now?: () => number;
};
/** Creates the bounded in-memory ACP session registry used by local ACP runtime clients. */
declare function createInMemorySessionStore(options?: AcpSessionStoreOptions): AcpSessionStore;
declare const defaultAcpSessionStore: AcpSessionStore;
//#endregion
export { createInMemorySessionStore as n, defaultAcpSessionStore as r, AcpSessionStore as t };
