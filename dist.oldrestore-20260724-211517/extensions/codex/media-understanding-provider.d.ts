import {
  i as CodexAppServerStartOptions,
  n as resolveCodexAppServerAuthProfileIdForAgent,
  r as CodexAppServerClient,
  t as CodexAppServerPreparedAuth,
} from "../../auth-bridge-C7wLdHtu.js";
import { f as MediaUnderstandingProvider } from "../../types-Bp5h7fLi.js";
import { s as AuthProfileStore } from "../../types-Dzb4Vh4b.js";
import { Du as AgentHarnessRuntimeArtifactBinding } from "../../types-Ga3mNO_F.js";

//#region extensions/codex/src/app-server/shared-client.d.ts
type CodexAppServerClientOptions = {
  startOptions?: CodexAppServerStartOptions;
  pluginConfig?: unknown;
  timeoutMs?: number;
  authProfileId?: string | null;
  authProfileStore?: AuthProfileStore;
  authBindingFingerprint?: string /** Setup-only generation whose exact local runtime bytes are captured. */;
  runtimeArtifactMode?: "capture" /** Previously minted exact runtime required before the process may start. */;
  expectedRuntimeArtifact?: AgentHarnessRuntimeArtifactBinding;
  preparedAuth?: CodexAppServerPreparedAuth;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  onStartedClient?: (client: CodexAppServerClient) => void;
  abandonSignal?: AbortSignal;
};
/** Factory used by attempt startup and side turns to acquire a leased client. */
type CodexAppServerClientFactory = (
  options?: CodexAppServerClientOptions,
) => Promise<CodexAppServerClient>;
//#endregion
//#region extensions/codex/src/app-server/bounded-turn.d.ts
type CodexBoundedTurnOptions = {
  pluginConfig?: unknown;
  clientFactory?: CodexAppServerClientFactory;
};
//#endregion
//#region extensions/codex/media-understanding-provider.d.ts
type CodexMediaUnderstandingProviderOptions = CodexBoundedTurnOptions;
/**
 * Builds the media-understanding provider that delegates image tasks to an
 * isolated Codex app-server session.
 */
declare function buildCodexMediaUnderstandingProvider(
  options?: CodexMediaUnderstandingProviderOptions,
): MediaUnderstandingProvider;
//#endregion
export { CodexMediaUnderstandingProviderOptions, buildCodexMediaUnderstandingProvider };
