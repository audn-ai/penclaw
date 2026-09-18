import { r as ReplyPayload } from "./reply-payload-DPFdJynw.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
declare namespace command_status_runtime_d_exports {
  export {
    ResolveDirectStatusReplyForSessionParams,
    resolveDirectStatusReplyForSession$1 as resolveDirectStatusReplyForSession,
  };
}
/** Inputs for rendering direct-session status replies outside the active channel turn. */
type ResolveDirectStatusReplyForSessionParams = {
  /** Caller config used when the target session cannot load a config snapshot. */ cfg: OpenClawConfig /** Requested session key; whitespace-only keys produce no status reply. */;
  sessionKey: string /** Channel/surface name used when rendering the status command context. */;
  channel: string /** Optional sender id for command-context rendering and audit output. */;
  senderId?: string /** Whether the requester is an owner and may see owner-only session state. */;
  senderIsOwner: boolean /** Whether the requester passed channel allowlist/authorization checks. */;
  isAuthorizedSender: boolean /** Whether the status reply is being rendered for a group conversation. */;
  isGroup: boolean /** Channel default activation mode used by the status renderer for groups. */;
  defaultGroupActivation: () => "always" | "mention";
};
/**
 * Builds a direct `/status` reply for an arbitrary session key.
 * Unauthorized requesters may see the session exists, but configured reasoning
 * state is masked so private agent/session defaults are not leaked.
 */
declare function resolveDirectStatusReplyForSession$1(
  params: ResolveDirectStatusReplyForSessionParams,
): Promise<ReplyPayload | undefined>;
//#endregion
//#region src/plugin-sdk/command-status-runtime.d.ts
type CommandStatusRuntime = typeof command_status_runtime_d_exports;
/** Resolves the direct status reply text for a session without eagerly loading runtime code. */
declare const resolveDirectStatusReplyForSession: CommandStatusRuntime["resolveDirectStatusReplyForSession"];
//#endregion
export { ResolveDirectStatusReplyForSessionParams as n, resolveDirectStatusReplyForSession as t };
