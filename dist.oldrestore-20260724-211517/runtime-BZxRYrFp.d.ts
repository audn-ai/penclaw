import { f as AgentToolResult } from "./types-JQFrjdua.js";
import { y as ChannelMessageActionContext } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/discord/src/actions/runtime.d.ts
type ConversationReadInvocationOrigin = NonNullable<
  ChannelMessageActionContext["conversationReadOrigin"]
>;
declare function handleDiscordAction(
  params: Record<string, unknown>,
  cfg: OpenClawConfig,
  options?: {
    mediaAccess?: {
      localRoots?: readonly string[];
      readFile?: (filePath: string) => Promise<Buffer>;
      workspaceDir?: string;
    };
    mediaLocalRoots?: readonly string[];
    mediaReadFile?: (filePath: string) => Promise<Buffer>;
    conversationReadOrigin?: ConversationReadInvocationOrigin;
    readContext?: {
      requesterAccountId?: string | null;
      currentChannelProvider?: string | null;
      currentChannelId?: string | null;
    };
  },
): Promise<AgentToolResult<unknown>>;
//#endregion
export { handleDiscordAction as t };
