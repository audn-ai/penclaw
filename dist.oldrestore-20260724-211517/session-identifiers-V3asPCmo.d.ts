import { a as SessionAcpIdentity, c as SessionAcpMeta } from "./types-Bst3_XVW.js";

//#region packages/acp-core/src/runtime/session-identifiers.d.ts
declare const ACP_SESSION_IDENTITY_RENDERER_VERSION = "v1";
type AcpSessionIdentifierRenderMode = "status" | "thread";
/** Renders resolved ACP backend/agent ids, hiding pending ids from thread intros. */
declare function resolveAcpSessionIdentifierLinesFromIdentity(params: {
  backend: string;
  identity?: SessionAcpIdentity;
  mode?: AcpSessionIdentifierRenderMode;
}): string[];
/** Resolves the runtime cwd, preferring modern runtimeOptions over legacy metadata. */
declare function resolveAcpSessionCwd(meta?: SessionAcpMeta): string | undefined;
/** Renders thread-detail identifier lines plus a backend-specific resume hint when stable. */
declare function resolveAcpThreadSessionDetailLines(params: {
  sessionKey: string;
  meta?: SessionAcpMeta;
}): string[];
//#endregion
export {
  resolveAcpThreadSessionDetailLines as a,
  resolveAcpSessionIdentifierLinesFromIdentity as i,
  AcpSessionIdentifierRenderMode as n,
  resolveAcpSessionCwd as r,
  ACP_SESSION_IDENTITY_RENDERER_VERSION as t,
};
