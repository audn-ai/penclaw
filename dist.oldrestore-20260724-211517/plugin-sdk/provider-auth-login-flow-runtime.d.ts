import { i as WizardPrompter } from "../prompts-CWXx5gsI.js";
import { n as RuntimeEnv } from "../runtime-Bxifh4bY.js";
import { Ot as ProviderAuthResult, an as ProviderPlugin } from "../types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";
declare namespace auth_d_exports {
  export {
    ModelsAuthLoginFlowOptions,
    ModelsAuthLoginFlowResult,
    modelsAuthAddCommand,
    modelsAuthLoginCommand,
    modelsAuthPasteApiKeyCommand,
    modelsAuthPasteTokenCommand,
    modelsAuthSetupTokenCommand,
    resolveLoginProfiles,
    resolveRequestedLoginProviderOrThrow,
    runModelsAuthLoginFlow$1 as runModelsAuthLoginFlow,
  };
}
/** Runs an interactive provider setup-token auth flow. */
declare function modelsAuthSetupTokenCommand(
  opts: {
    provider?: string;
    yes?: boolean;
    agent?: string;
  },
  runtime: RuntimeEnv,
): Promise<void>;
/** Reads a pasted bearer/setup token and stores it as an auth profile. */
declare function modelsAuthPasteTokenCommand(
  opts: {
    provider?: string;
    profileId?: string;
    expiresIn?: string;
    agent?: string;
  },
  runtime: RuntimeEnv,
): Promise<void>;
/** Reads a pasted API key and stores it as an auth profile. */
declare function modelsAuthPasteApiKeyCommand(
  opts: {
    provider?: string;
    profileId?: string;
    agent?: string;
  },
  runtime: RuntimeEnv,
): Promise<void>;
/** Interactive helper for adding token auth profiles, with provider/method prompts. */
declare function modelsAuthAddCommand(
  opts: {
    agent?: string;
  },
  runtime: RuntimeEnv,
): Promise<void>;
type LoginOptions = {
  provider?: string;
  method?: string;
  profileId?: string;
  setDefault?: boolean;
  yes?: boolean;
  agent?: string;
  /**
   * When true, remove any existing auth profiles for the resolved provider
   * before invoking the auth flow. This is the escape hatch for stuck
   * cached OAuth profiles where the standard `auth login` short-circuits
   * because credentials already exist on disk.
   */
  force?: boolean;
};
type ModelsAuthLoginFlowResult = {
  providerId: string;
  methodId: string;
  defaultModel?: string;
  profiles: Array<{
    profileId: string;
    provider: string;
    mode: "api_key" | "oauth" | "token";
  }>;
};
type ModelsAuthLoginFlowOptions = LoginOptions & {
  config?: OpenClawConfig;
  runtime: RuntimeEnv;
  prompter: WizardPrompter;
  env?: NodeJS.ProcessEnv;
  isRemote?: boolean;
  openUrl?: (url: string) => Promise<void>;
};
/** Resolves a requested login provider or throws with available provider details. */
declare function resolveRequestedLoginProviderOrThrow(
  providers: ProviderPlugin[],
  rawProvider?: string,
): ProviderPlugin | null;
/** Applies an optional profile-id override to a single returned login profile. */
declare function resolveLoginProfiles(params: {
  result: ProviderAuthResult;
  requestedProfileId?: string;
}): ProviderAuthResult["profiles"];
declare function runModelsAuthLoginFlow$1(
  opts: ModelsAuthLoginFlowOptions,
): Promise<ModelsAuthLoginFlowResult>;
declare function modelsAuthLoginCommand(opts: LoginOptions, runtime: RuntimeEnv): Promise<void>;
//#endregion
//#region src/plugin-sdk/provider-auth-login-flow-runtime.d.ts
type ProviderAuthLoginFlowRuntime = typeof auth_d_exports;
type RunModelsAuthLoginFlow = (opts: ModelsAuthLoginFlowOptions) => Promise<unknown>;
type CodexLoginFlowRecord = {
  expiresAt: number;
};
type CodexLoginFlowReservation =
  | {
      status: "active";
    }
  | {
      status: "reserved";
      record: CodexLoginFlowRecord;
    };
declare const runModelsAuthLoginFlow: ProviderAuthLoginFlowRuntime["runModelsAuthLoginFlow"];
declare function resolveCodexLoginProvider(rawProvider: string | undefined): string | null;
declare function hasConfiguredCommandOwnerAllowlist(cfg: OpenClawConfig): boolean;
declare function resolveProviderScopedProfileId(
  authProfileOverride: string | undefined,
  provider: string,
): string | undefined;
declare function reserveCodexLoginFlow(params: {
  flows: Map<string, CodexLoginFlowRecord>;
  flowKey: string;
  now?: number;
}): CodexLoginFlowReservation;
declare function releaseCodexLoginFlow(params: {
  flows: Map<string, CodexLoginFlowRecord>;
  flowKey: string;
  record: CodexLoginFlowRecord;
}): void;
declare function runCodexDeviceLoginFlow(params: {
  provider: string;
  agentId: string;
  profileId?: string;
  config: OpenClawConfig;
  runtime: RuntimeEnv;
  sendMessage: (message: string) => Promise<void>;
  unsupportedPromptMessage: string;
  runLoginFlow?: RunModelsAuthLoginFlow;
}): Promise<ModelsAuthLoginFlowResult>;
declare const codexChannelLoginRuntime: {
  resolveProvider: typeof resolveCodexLoginProvider;
  hasConfiguredCommandOwnerAllowlist: typeof hasConfiguredCommandOwnerAllowlist;
  resolveProviderScopedProfileId: typeof resolveProviderScopedProfileId;
  reserveFlow: typeof reserveCodexLoginFlow;
  releaseFlow: typeof releaseCodexLoginFlow;
  runDeviceLoginFlow: typeof runCodexDeviceLoginFlow;
};
//#endregion
export {
  type ModelsAuthLoginFlowOptions,
  type ModelsAuthLoginFlowResult,
  codexChannelLoginRuntime,
  runModelsAuthLoginFlow,
};
