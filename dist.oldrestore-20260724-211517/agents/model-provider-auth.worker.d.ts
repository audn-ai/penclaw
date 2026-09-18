import { i as RuntimeProviderAuthLookup } from "../model-auth-DQnRyl6R.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";
//#region src/agents/model-provider-auth-state.d.ts
type ProviderAuthWarmSnapshot = {
  agents: Array<{
    agentId: string;
    configFingerprint: string;
    providers: Array<[string, boolean]>;
  }>;
};
//#endregion
//#region src/agents/model-provider-auth.d.ts
/** Builds a provider auth snapshot for every configured agent. */
declare function buildCurrentProviderAuthStateSnapshot(
  cfg: OpenClawConfig,
  options?: {
    isCancelled?: () => boolean;
    readOnlyAuthStore?: boolean;
    runtimeAuthLookups?: ReadonlyMap<string, RuntimeProviderAuthLookup>;
    omitFalseProviderAuth?: boolean;
  },
): Promise<ProviderAuthWarmSnapshot>;
//#endregion
//#region src/agents/model-provider-auth.worker.d.ts
type ProviderAuthWarmWorkerResult =
  | {
      status: "ok";
      snapshot: Awaited<ReturnType<typeof buildCurrentProviderAuthStateSnapshot>>;
    }
  | {
      status: "failed";
      error: string;
    };
/** Validates worker input and returns a provider auth snapshot or a serializable failure. */
declare function runProviderAuthWarmWorkerInput(
  input: unknown,
): Promise<ProviderAuthWarmWorkerResult>;
//#endregion
export { runProviderAuthWarmWorkerInput };
