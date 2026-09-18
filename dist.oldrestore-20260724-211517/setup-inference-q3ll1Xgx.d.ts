import {
  T as TransformConfigFileWithRetryParams,
  x as ConfigMutationResult,
} from "./config-COuhEATv.js";
import { t as runEmbeddedAgent } from "./embedded-agent-runner-D4hSqTOJ.js";
import { t as enablePluginInConfig } from "./enable-Br5DjqR6.js";
import {
  n as OpaqueRuntimeOwnerKind,
  t as AgentExecutionAuthBinding,
} from "./execution-auth-binding-C-IDfQYX.js";
import { n as InstalledPluginIndexStoreOptions } from "./installed-plugin-index-store-D_3S5d0v.js";
import { n as InstalledPluginIndexRefreshReason } from "./installed-plugin-index-types-75ZYFT43.js";
import { g as readConfigFileSnapshot } from "./io-BbgXkYnD.js";
import { o as OpenClawPackageBuild } from "./manifest-registry-CHEq75Tu.js";
import { g as resolveApiKeyForProvider, w as ResolvedProviderAuth } from "./model-auth-DQnRyl6R.js";
import {
  n as disposeOpenClawAgentDatabaseByPath,
  t as OpenClawAgentDatabase,
} from "./openclaw-agent-db-B6Jg3nEa.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
import { i as WizardPrompter } from "./prompts-CWXx5gsI.js";
import { c as ProviderRouteOverridePresence } from "./provider-model-types-BoDUnm4e.js";
import { n as resolvePluginProviders } from "./providers.runtime-BO7CjzRB.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import {
  n as ensureAuthProfileStore,
  p as updateAuthProfileStoreWithLock,
  s as loadAuthProfileStoreForRuntime,
} from "./store-TQsl5_Yq.js";
import { s as AuthProfileStore } from "./types-Dzb4Vh4b.js";
import {
  Du as AgentHarnessRuntimeArtifactBinding,
  Ya as AgentHarnessAuthBindingFingerprintParams,
  md as EmbeddedAgentRunResult,
  mi as RunCliAgentParams,
} from "./types-Ga3mNO_F.js";
import { i as OpenClawConfig, m as PluginInstallRecord } from "./types.openclaw-DDo8sH3F.js";

//#region src/agents/cli-runner.d.ts
/** Prepares and runs one CLI-backed agent turn. */
declare function runCliAgent(paramsInput: RunCliAgentParams): Promise<EmbeddedAgentRunResult>;
//#endregion
//#region src/crestodian/probes.d.ts
/**
 * Local environment probes used by Crestodian overview loading.
 *
 * Probes are bounded by output and timeout limits so setup/status commands do
 * not hang or retain unbounded child output.
 */
/** Result from probing a local command binary. */
type LocalCommandProbe = {
  command: string;
  found: boolean;
  version?: string;
  error?: string;
};
/** Probe a command by running a small version command with bounded output and timeout. */
declare function probeLocalCommand(
  command: string,
  args?: string[],
  opts?: {
    outputLimit?: number;
    timeoutMs?: number;
  },
): Promise<LocalCommandProbe>;
/** Probe a Gateway URL by translating it to its HTTP /healthz endpoint. */
declare function probeGatewayUrl(
  url: string,
  opts?: {
    timeoutMs?: number;
  },
): Promise<{
  reachable: boolean;
  url: string;
  error?: string;
}>;
//#endregion
//#region src/agents/cli-executable-identity.d.ts
type CliExecutableFileIdentity = Readonly<{
  path: string;
  device: string;
  inode: string;
  mode: string;
  size: string;
  modifiedNs: string;
  changedNs: string;
  contentSha256: string;
}>;
/** Immutable executable projection bound to one successful CLI process. */
type CliExecutableIdentity = Readonly<{
  command: string;
  resolvedPath: string;
  invocation: Readonly<{
    command: string;
    leadingArgv: readonly string[];
    resolution: "direct" | "node-entrypoint" | "exe-entrypoint";
  }>;
  files: readonly CliExecutableFileIdentity[];
  runtimeArtifact:
    | Readonly<{
        kind: "self-contained-executable";
      }>
    | Readonly<{
        kind: "package-tree";
        packageName: string;
        rootPath: string;
        fileCount: number;
        totalBytes: string;
        treeSha256: string;
      }>;
}>;
//#endregion
//#region src/agents/cli-auth-epoch.d.ts
/**
 * Strict credential-owner proof for a verified inference turn. Unlike the
 * reusable-session epoch, identity-less OAuth tokens intentionally invalidate
 * on rotation because accepting an unknown replacement could cross accounts.
 */
declare function resolveCliAuthBindingFingerprint(params: {
  provider: string;
  config: OpenClawConfig;
  agentDir?: string;
  authProfileId?: string /** Exact selected profile material actually forwarded to this execution. */;
  resolvedAuth?: ResolvedProviderAuth;
  skipLocalCredential?: boolean;
}): string | undefined;
type CliRuntimeArtifactFingerprintParams = {
  provider: string;
  config: OpenClawConfig;
  agentId?: string;
  runtimeArtifactId?: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  executableIdentity?: CliExecutableIdentity;
};
/** Hash the exact executable plus backend-owned package implementation tree. */
/** Re-resolve a CLI backend's complete executable/package artifact boundary. */
declare function resolveCliRuntimeArtifactFingerprint(
  params: CliRuntimeArtifactFingerprintParams,
): Promise<string | undefined>;
/**
 * Resolve a CLI runtime's non-secret owner shape. The trusted runner emits
 * this projection only after a real successful turn; callers must not treat
 * this pre-run value as proof by itself.
 */
declare function resolveCliRuntimeOwnerFingerprint(params: {
  provider: string;
  config: OpenClawConfig;
  agentDir?: string;
  agentId?: string;
  runtimeOwnerId?: string;
  authProfileId?: string;
  skipLocalCredential?: boolean;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  executableIdentity?: CliExecutableIdentity;
  runtimeArtifactFingerprint?: string;
}): Promise<string | undefined>;
//#endregion
//#region src/plugins/plugin-runtime-artifact-identity.d.ts
type PluginRuntimeArtifactIdentitySource = Readonly<{
  pluginId: string;
  origin: PluginOrigin;
  rootDir: string;
  source?: string;
  packageBuild?: OpenClawPackageBuild;
}>;
//#endregion
//#region src/crestodian/inference-route.d.ts
type CrestodianConfiguredRoute = {
  runConfig: OpenClawConfig;
  modelLabel: string;
  provider: string;
  model: string;
  agentDir: string;
  agentId: string;
  authProfileId?: string;
} & (
  | {
      runner: "cli";
    }
  | {
      runner: "embedded";
      agentHarnessRuntimeOverride: string;
    }
);
type CrestodianConfiguredRouteDeps = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
};
type DistributiveOmit$1<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type DefaultInferenceRouteProjection = {
  route: DistributiveOmit$1<CrestodianConfiguredRoute, "runConfig"> | null;
  defaultSelection: {
    explicitIds: string[];
    fallbackId?: string;
  };
  auth: unknown;
  models: unknown;
  defaults: unknown;
  agent?: unknown;
  executionAgent?: unknown;
  env: OpenClawConfig["env"];
  secrets: OpenClawConfig["secrets"];
  plugins: OpenClawConfig["plugins"];
  tools: OpenClawConfig["tools"];
};
//#endregion
//#region src/crestodian/verified-inference.d.ts
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type CrestodianConfiguredRouteIdentity = DistributiveOmit<
  CrestodianConfiguredRoute,
  "runConfig" | "authProfileId"
>;
type CrestodianVerifiedExecutionFingerprint = {
  route: unknown;
  defaultSelection: unknown;
  auth: unknown;
  models: unknown;
  defaults: unknown;
  agent?: unknown;
  plugins: unknown;
  ownerPluginRuntimes: readonly CrestodianOwnerPluginRuntimeIdentity[];
};
type CrestodianOwnerPluginRuntimeIdentity = Readonly<{
  pluginId: string;
  origin: string;
  rootDir: string;
  manifestPath: string;
  manifestHash: string;
  source: string | null;
  packageName: string | null;
  packageVersion: string | null;
  installRecordHash: string | null;
  packageJson: Readonly<{
    path: string;
    hash: string;
  }> | null;
}>;
type CrestodianOwnerPluginArtifactIdentity = Readonly<{
  pluginId: string;
  fingerprint: string;
}>;
type CrestodianOwnerPluginArtifactSnapshot = Readonly<{
  ownerPluginIds: readonly string[];
  ownerPluginArtifacts: readonly CrestodianOwnerPluginArtifactIdentity[];
}>;
type CrestodianOwnerPluginRegistryRecord = {
  pluginId: string;
  origin: PluginOrigin;
  rootDir: string;
  manifestPath: string;
  manifestHash: string;
  source?: string;
  packageName?: string;
  packageVersion?: string;
  installRecordHash?: string;
  packageJson?: {
    path: string;
    hash: string;
  };
  packageBuild?: OpenClawPackageBuild;
};
type CrestodianOwnerPluginRegistryLoader = (params: {
  config: OpenClawConfig;
  workspaceDir: string;
  env: NodeJS.ProcessEnv;
}) => {
  plugins: readonly CrestodianOwnerPluginRegistryRecord[];
};
/** Server-local proof returned only after the exact route completes a live turn. */
type CrestodianVerifiedInferenceBinding = Readonly<{
  configuredRoute: CrestodianConfiguredRouteIdentity;
  execution: CrestodianConfiguredRoute;
  executionFingerprint: CrestodianVerifiedExecutionFingerprint;
  ownerPluginIds: readonly string[];
  ownerPluginArtifacts: readonly CrestodianOwnerPluginArtifactIdentity[];
  auth: Readonly<{
    authProfileId?: string;
    agentHarnessId?: string;
    authFingerprint: string;
    proofKind?: "runtime-owner";
    runtimeOwnerKind?: OpaqueRuntimeOwnerKind;
    runtimeOwnerId?: string;
    runtimeArtifactFingerprint?: string;
    runtimeArtifactId?: string;
    skipLocalCredential?: true;
  }>;
}>;
type CrestodianVerifiedInferenceDeps = CrestodianConfiguredRouteDeps & {
  ensureAuthProfileStore?: typeof ensureAuthProfileStore;
  resolveCliAuthBindingFingerprint?: typeof resolveCliAuthBindingFingerprint;
  resolveCliRuntimeOwnerFingerprint?: typeof resolveCliRuntimeOwnerFingerprint;
  resolveCliRuntimeArtifactFingerprint?: typeof resolveCliRuntimeArtifactFingerprint;
  resolveApiKeyForProvider?: typeof resolveApiKeyForProvider;
  validateAgentHarnessRuntimeArtifact?: (params: {
    harnessId: string;
    artifact: AgentHarnessRuntimeArtifactBinding;
  }) => Promise<boolean>;
  resolveAgentHarnessAuthBindingFingerprint?: (
    params: AgentHarnessAuthBindingFingerprintParams & {
      harnessId: string;
    },
  ) => Promise<string | undefined>;
  loadPluginRegistrySnapshot?: CrestodianOwnerPluginRegistryLoader;
  fingerprintPluginRuntimeArtifact?: (record: PluginRuntimeArtifactIdentitySource) => string;
};
/** Capture once immediately before a live setup turn. */
declare function captureCrestodianOwnerPluginArtifacts(params: {
  config: OpenClawConfig;
  executionRoute: CrestodianConfiguredRoute;
  deps?: CrestodianVerifiedInferenceDeps;
}): CrestodianOwnerPluginArtifactSnapshot;
declare function createCrestodianVerifiedInferenceBinding(params: {
  configuredRoute: CrestodianConfiguredRoute;
  executionRoute: CrestodianConfiguredRoute;
  auth: AgentExecutionAuthBinding;
  deps?: CrestodianVerifiedInferenceDeps;
}): Promise<CrestodianVerifiedInferenceBinding>;
/** Re-hash plugin-owned runtime files only at a persistent side-effect boundary. */
declare function hasCurrentCrestodianOwnerPluginArtifacts(
  binding: CrestodianVerifiedInferenceBinding,
  deps?: CrestodianVerifiedInferenceDeps,
): Promise<boolean>;
/**
 * Re-check authored route ownership, then return only the frozen verified run.
 * Workspace/channel changes are excluded; broad plugin/env/tool config cannot
 * switch this frozen run, while relevant runtime plugin membership and the
 * actual selected credential are checked explicitly.
 */
declare function resolveCrestodianVerifiedInferenceRoute(
  binding: CrestodianVerifiedInferenceBinding,
  deps?: CrestodianVerifiedInferenceDeps,
): Promise<CrestodianConfiguredRoute | null>;
//#endregion
//#region src/commands/codex-runtime-plugin-install.d.ts
declare const ensureCodexRuntimePluginForModelSelection: (params: {
  cfg: OpenClawConfig;
  model?: string;
  agentId?: string;
  prompter: WizardPrompter;
  runtime: RuntimeEnv;
  workspaceDir?: string;
}) => Promise<{
  cfg: OpenClawConfig;
  required: boolean;
  installed: boolean;
  status?: "installed" | "skipped" | "failed" | "timed_out";
  reason?: string;
}>;
//#endregion
//#region src/agents/harness/runtime-plugin.d.ts
/** Ensures the plugin that owns the selected harness runtime is loaded before harness selection. */
declare function ensureSelectedAgentHarnessPlugin(params: {
  provider: string;
  modelId: string;
  config?: OpenClawConfig;
  agentId?: string;
  sessionKey?: string;
  agentHarnessId?: string;
  agentHarnessRuntimeOverride?: string;
  requestTransportOverrides?: ProviderRouteOverridePresence;
  workspaceDir: string;
}): Promise<void>;
//#endregion
//#region src/plugins/install-record-commit.d.ts
/** Transform config with retry support while preserving plugin install index consistency. */
declare function transformConfigWithPendingPluginInstalls<T = void>(
  params: Omit<TransformConfigFileWithRetryParams<T>, "commit">,
): Promise<ConfigMutationResult<T>>;
//#endregion
//#region src/plugins/installed-plugin-index-record-cache.d.ts
/** Clears cached installed plugin records and advances the cache generation. */
declare function clearLoadInstalledPluginIndexInstallRecordsCache(): void;
//#endregion
//#region src/plugins/installed-plugin-index-record-reader.d.ts
/** Reads install records from the persisted installed plugin index. */
declare function readPersistedInstalledPluginIndexInstallRecords(
  options?: InstalledPluginIndexStoreOptions,
): Promise<Record<string, PluginInstallRecord> | null>;
/** Loads installed plugin records, recovering managed npm installs and caching the result. */
declare function loadInstalledPluginIndexInstallRecords(
  params?: InstalledPluginIndexStoreOptions,
): Promise<Record<string, PluginInstallRecord>>;
//#endregion
//#region src/plugins/registry-refresh.d.ts
/** Optional warning sink for best-effort registry/cache refresh failures. */
type PluginRegistryRefreshLogger = {
  warn?: (message: string) => void;
};
/** Refresh persisted plugin registry and clear runtime discovery after a config mutation. */
declare function refreshPluginRegistryAfterConfigMutation(params: {
  config: OpenClawConfig;
  reason: InstalledPluginIndexRefreshReason;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  installRecords?: Awaited<ReturnType<typeof loadInstalledPluginIndexInstallRecords>>;
  invalidateRuntimeCache?: boolean;
  policyPluginIds?: readonly string[];
  traceCommand?: string;
  logger?: PluginRegistryRefreshLogger;
}): Promise<void>;
declare function invalidatePluginRuntimeDiscoveryAfterConfigMutation(params: {
  logger?: PluginRegistryRefreshLogger;
}): Promise<void>;
//#endregion
//#region src/plugins/runtime/runtime-registry-loader.d.ts
type PluginRegistryScope = "configured-channels" | "channels" | "all";
declare function ensurePluginRegistryLoaded(options?: {
  scope?: PluginRegistryScope;
  config?: OpenClawConfig;
  activationSourceConfig?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  workspaceDir?: string;
  onlyPluginIds?: string[];
  onlyChannelIds?: string[];
}): void;
//#endregion
//#region src/plugins/managed-npm-retention.d.ts
declare function markRetainedManagedNpmInstall(params: {
  packageDir: string;
  pluginId: string;
  retainedAt?: string;
  reason: string;
}): Promise<boolean>;
//#endregion
//#region src/plugins/plugin-metadata-lifecycle.d.ts
/** Clears plugin metadata snapshots and registered process memo caches. */
declare function clearPluginMetadataLifecycleCaches(): void;
//#endregion
//#region src/agents/auth-profiles/persisted.d.ts
type LoadPersistedAuthProfileStoreOptions = {
  allowKeychainPrompt?: boolean;
  database?: OpenClawAgentDatabase;
};
/** Loads the persisted auth profile store and merges runtime state. */
declare function loadPersistedAuthProfileStore(
  agentDir?: string,
  options?: LoadPersistedAuthProfileStoreOptions,
): AuthProfileStore | null;
//#endregion
//#region src/commands/onboard-inference.d.ts
type InferenceBackendKind =
  | "existing-model"
  | "openai-api-key"
  | "anthropic-api-key"
  | "claude-cli"
  | "codex-cli"
  | "gemini-cli";
//#endregion
//#region src/plugins/provider-auth-choices.d.ts
type ProviderAuthChoiceMetadata = {
  pluginId: string;
  providerId: string;
  methodId: string;
  choiceId: string;
  choiceLabel: string;
  choiceHint?: string;
  assistantPriority?: number;
  assistantVisibility?: "visible" | "manual-only";
  deprecatedChoiceIds?: string[];
  groupId?: string;
  groupLabel?: string;
  groupHint?: string;
  onboardingFeatured?: boolean;
  optionKey?: string;
  cliFlag?: string;
  cliOption?: string;
  cliDescription?: string;
  appGuidedSecret?: boolean;
  appGuidedAuth?: "oauth" | "device-code";
  onboardingScopes?: ("text-inference" | "image-generation" | "music-generation")[];
};
type ManifestProviderAuthChoiceParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  includeUntrustedWorkspacePlugins?: boolean;
  includeWorkspacePlugins?: boolean;
};
declare function resolveManifestProviderAuthChoices(
  params?: ManifestProviderAuthChoiceParams,
): ProviderAuthChoiceMetadata[];
declare function resolveManifestProviderAuthChoice(
  choiceId: string,
  params?: ManifestProviderAuthChoiceParams,
): ProviderAuthChoiceMetadata | undefined;
//#endregion
//#region src/crestodian/setup-inference.d.ts
/**
 * Inference is the one required onboarding step (docs/cli/crestodian.md
 * "Setup bootstrap"). This module gives structured clients (macOS app) the
 * same ladder the conversation uses, with one hard guarantee: a candidate is
 * persisted as the default model only after a real completion round-trips.
 * A failing candidate must never leave config pointing at a broken model.
 */
declare const SETUP_INFERENCE_TEST_TIMEOUT_MS = 90000;
type SetupInferenceCandidate = {
  kind: InferenceBackendKind;
  label: string;
  detail: string;
  modelRef: string /** @deprecated Gateway wire compatibility for older macOS clients. Always false. */;
  recommended: false;
  credentials?: boolean;
};
type SetupInferenceManualProvider = {
  /** Provider-auth choice id sent back to `crestodian.setup.activate`. */ id: string;
  label: string;
  hint?: string;
};
type SetupInferenceAuthOption = {
  /** Provider-auth choice id sent to `crestodian.setup.auth.start`. */ id: string;
  label: string;
  hint?: string;
  groupLabel?: string;
  kind: "oauth" | "device-code";
  featured: boolean;
};
type SetupInferenceDetection = {
  candidates: SetupInferenceCandidate[] /** Text-inference key/token methods exposed by installed provider manifests. */;
  manualProviders: SetupInferenceManualProvider[] /** Interactive provider-owned browser and device-code sign-in methods. */;
  authOptions: SetupInferenceAuthOption[] /** Resolved workspace the setup apply would use (display + default). */;
  workspace: string;
  configuredModel?: string /** The connected Gateway already has a configured default-agent model. */;
  setupComplete: boolean;
};
type SetupInferenceStatus =
  | "ok"
  | "auth"
  | "rate_limit"
  | "billing"
  | "timeout"
  | "format"
  | "unavailable"
  | "unknown";
type SetupInferenceFailureStatus = Exclude<SetupInferenceStatus, "ok">;
type ActivateSetupInferenceResult =
  | {
      ok: true;
      modelRef: string;
      latencyMs: number;
      lines: string[];
    }
  | {
      ok: false;
      status: SetupInferenceFailureStatus;
      error: string;
    };
/**
 * The config commit may have happened, so callers must verify current setup
 * instead of treating this like a definitive candidate failure and retrying.
 */
declare class SetupInferenceActivationIndeterminateError extends Error {
  name: string;
}
type VerifySetupInferenceResult =
  | {
      ok: true;
      modelRef: string;
      latencyMs: number;
    }
  | {
      ok: false;
      status: SetupInferenceFailureStatus;
      error: string;
    };
type BoundVerifySetupInferenceResult =
  | {
      ok: true;
      modelRef: string;
      latencyMs: number;
      binding: CrestodianVerifiedInferenceBinding;
    }
  | {
      ok: false;
      status: SetupInferenceFailureStatus;
      error: string;
    };
type ActivateSetupInferenceParams = {
  kind:
    | InferenceBackendKind
    | "api-key"
    | "provider-auth" /** Exact explicit model to probe and persist instead of the route's starter model. */;
  modelRef?: string /** Manual step only: provider-auth choice returned by detection. */;
  authChoice?: string /** Manual step only: the pasted API key or token. Never logged. */;
  apiKey?: string;
  workspace?: string;
  surface:
    | "cli"
    | "gateway" /** False when an enclosing persistent-operation boundary owns the setup audit. */;
  recordSetupAudit?: boolean;
  runtime: RuntimeEnv /** Interactive provider login transport, required for `provider-auth`. */;
  prompter?: WizardPrompter /** Cancels provider-owned browser callbacks and device-code polling. */;
  signal?: AbortSignal /** Session cancellation gate; interactive credentials must never persist after cancel. */;
  isCancelled?: () => boolean;
  onCommitStarted?: () => void;
  deps?: ActivateSetupInferenceDeps;
};
type SetupInferenceRunEmbeddedAgent = (
  params: Parameters<typeof runEmbeddedAgent>[0] & {
    onSuccessfulAuthBinding?: (binding: AgentExecutionAuthBinding) => void;
    authProfileStateMode?: "read-write" | "read-only";
  },
) => ReturnType<typeof runEmbeddedAgent>;
type ActivateSetupInferenceDeps = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
  runEmbeddedAgent?: SetupInferenceRunEmbeddedAgent;
  runCliAgent?: typeof runCliAgent;
  ensureCodexRuntimePlugin?: typeof ensureCodexRuntimePluginForModelSelection;
  ensureSelectedAgentHarnessPlugin?: typeof ensureSelectedAgentHarnessPlugin;
  transformConfigWithPendingPluginInstalls?: typeof transformConfigWithPendingPluginInstalls;
  refreshPluginRegistryAfterConfigMutation?: typeof refreshPluginRegistryAfterConfigMutation;
  ensurePluginRegistryLoaded?: typeof ensurePluginRegistryLoaded;
  resolvePluginProviders?: typeof resolvePluginProviders;
  resolveManifestProviderAuthChoice?: typeof resolveManifestProviderAuthChoice;
  enablePluginInConfig?: typeof enablePluginInConfig;
  updateAuthProfileStoreWithLock?: typeof updateAuthProfileStoreWithLock;
  loadPersistedAuthProfileStore?: typeof loadPersistedAuthProfileStore;
  loadAuthProfileStoreForRuntime?: typeof loadAuthProfileStoreForRuntime;
  ensureAuthProfileStore?: typeof ensureAuthProfileStore;
  resolveCliAuthBindingFingerprint?: typeof resolveCliAuthBindingFingerprint;
  resolveCliRuntimeArtifactFingerprint?: typeof resolveCliRuntimeArtifactFingerprint;
  resolveCliRuntimeOwnerFingerprint?: typeof resolveCliRuntimeOwnerFingerprint;
  resolveApiKeyForProvider?: typeof resolveApiKeyForProvider;
  loadPluginRegistrySnapshot?: CrestodianVerifiedInferenceDeps["loadPluginRegistrySnapshot"];
  fingerprintPluginRuntimeArtifact?: CrestodianVerifiedInferenceDeps["fingerprintPluginRuntimeArtifact"];
  captureCrestodianOwnerPluginArtifacts?: typeof captureCrestodianOwnerPluginArtifacts;
  createCrestodianVerifiedInferenceBinding?: typeof createCrestodianVerifiedInferenceBinding;
  readPersistedInstalledPluginIndexInstallRecords?: typeof readPersistedInstalledPluginIndexInstallRecords;
  markRetainedManagedNpmInstall?: typeof markRetainedManagedNpmInstall;
  clearLoadInstalledPluginIndexInstallRecordsCache?: typeof clearLoadInstalledPluginIndexInstallRecordsCache;
  clearPluginMetadataLifecycleCaches?: typeof clearPluginMetadataLifecycleCaches;
  invalidatePluginRuntimeDiscoveryAfterConfigMutation?: typeof invalidatePluginRuntimeDiscoveryAfterConfigMutation;
  disposeOpenClawAgentDatabaseByPath?: typeof disposeOpenClawAgentDatabaseByPath;
  createTempDir?: () => Promise<string>;
  removeTempDir?: (dir: string) => Promise<void>;
  timeoutMs?: number;
};
type DetectSetupInferenceDeps = {
  resolveManifestProviderAuthChoices?: typeof resolveManifestProviderAuthChoices;
};
declare function listSetupInferenceManualProviders(
  authChoices: readonly ProviderAuthChoiceMetadata[],
): SetupInferenceManualProvider[];
declare function listSetupInferenceAuthOptions(
  authChoices: readonly ProviderAuthChoiceMetadata[],
): SetupInferenceAuthOption[];
declare function detectSetupInference(
  deps?: DetectSetupInferenceDeps,
): Promise<SetupInferenceDetection>;
/**
 * Test one candidate with a real completion, then persist it as the setup
 * default. Manual credentials are tested from a temporary auth store and
 * copied into the real agent store only after success. A managed Codex install
 * record may remain after a failed probe because the installed package already exists.
 */
declare function activateSetupInference(
  params: ActivateSetupInferenceParams,
): Promise<ActivateSetupInferenceResult>;
type VerifySetupInferenceParams = {
  kind?: "existing-model";
  runtime: RuntimeEnv;
  timeoutMs?: number;
  deps?: ActivateSetupInferenceDeps;
};
/** Live-test the configured default model without changing config or auth state. */
declare function verifySetupInference(
  params: VerifySetupInferenceParams & {
    bindSession: true;
  },
): Promise<BoundVerifySetupInferenceResult>;
declare function verifySetupInference(
  params: VerifySetupInferenceParams & {
    bindSession?: false;
  },
): Promise<VerifySetupInferenceResult>;
type BoundSetupInferenceVerifier = (params: {
  runtime: RuntimeEnv;
  bindSession: true;
  deps?: ActivateSetupInferenceDeps;
}) => Promise<BoundVerifySetupInferenceResult>;
type ResolveCrestodianInferenceForPersistentApplyDeps = CrestodianVerifiedInferenceDeps & {
  resolveVerifiedInferenceRoute?: typeof resolveCrestodianVerifiedInferenceRoute;
  hasCurrentOwnerPluginArtifacts?: typeof hasCurrentCrestodianOwnerPluginArtifacts;
  verifyBoundInference?: BoundSetupInferenceVerifier;
};
/**
 * Strict credentials need only the static owner check. Opaque runtimes can
 * prove liveness only by completing another exact turn at the side-effect
 * boundary; the result must still be the original frozen route.
 */
declare function resolveCrestodianInferenceForPersistentApply(params: {
  binding: CrestodianVerifiedInferenceBinding;
  runtime: RuntimeEnv;
  deps?: ResolveCrestodianInferenceForPersistentApplyDeps;
}): Promise<CrestodianConfiguredRoute | null>;
/** Live-test a staged default-agent route before any caller persists it. */
declare function verifySetupInferenceConfig(params: {
  config: OpenClawConfig;
  runtime: RuntimeEnv;
  timeoutMs?: number;
  deps?: ActivateSetupInferenceDeps /** Internal session gate: capture only the final exact successful credential. */;
  onVerifiedExecution?: (
    auth: AgentExecutionAuthBinding,
    binding: CrestodianVerifiedInferenceBinding,
  ) => void /** Reject a successful turn unless its runner reports the exact execution owner. */;
  requireExecutionOwner?: boolean;
}): Promise<VerifySetupInferenceResult>;
//#endregion
export {
  CrestodianVerifiedInferenceBinding as C,
  probeGatewayUrl as D,
  LocalCommandProbe as E,
  probeLocalCommand as O,
  verifySetupInferenceConfig as S,
  resolveCliAuthBindingFingerprint as T,
  detectSetupInference as _,
  DetectSetupInferenceDeps as a,
  resolveCrestodianInferenceForPersistentApply as b,
  SetupInferenceActivationIndeterminateError as c,
  SetupInferenceDetection as d,
  SetupInferenceFailureStatus as f,
  activateSetupInference as g,
  VerifySetupInferenceResult as h,
  BoundVerifySetupInferenceResult as i,
  SetupInferenceAuthOption as l,
  SetupInferenceStatus as m,
  ActivateSetupInferenceParams as n,
  ResolveCrestodianInferenceForPersistentApplyDeps as o,
  SetupInferenceManualProvider as p,
  ActivateSetupInferenceResult as r,
  SETUP_INFERENCE_TEST_TIMEOUT_MS as s,
  ActivateSetupInferenceDeps as t,
  SetupInferenceCandidate as u,
  listSetupInferenceAuthOptions as v,
  DefaultInferenceRouteProjection as w,
  verifySetupInference as x,
  listSetupInferenceManualProviders as y,
};
