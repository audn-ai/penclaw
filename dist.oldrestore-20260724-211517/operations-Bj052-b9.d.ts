import { i as PluginInstallSourceInfo } from "./installed-plugin-index-types-75ZYFT43.js";
import { g as readConfigFileSnapshot } from "./io-BbgXkYnD.js";
import { d as PluginPackageInstall } from "./manifest-registry-CHEq75Tu.js";
import { g as resolveApiKeyForProvider } from "./model-auth-DQnRyl6R.js";
import { c as resolveConfigPath, f as resolveGatewayPort } from "./paths-CAFnjuPj.js";
import { t as PluginOrigin } from "./plugin-origin.types-DOQEvsWL.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import {
  D as probeGatewayUrl,
  E as LocalCommandProbe,
  O as probeLocalCommand,
  S as verifySetupInferenceConfig,
  T as resolveCliAuthBindingFingerprint,
  w as DefaultInferenceRouteProjection,
} from "./setup-inference-q3ll1Xgx.js";
import { n as ensureAuthProfileStore } from "./store-TQsl5_Yq.js";
import { S as ChannelChoice } from "./types-Dz3ohwUV.js";
import { T as ChannelMeta } from "./types.core-CcwzPNhX.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
import { t as ChannelPlugin } from "./types.plugin-BGk2f9vp.js";

//#region src/agents/docs-path.d.ts
type ResolveOpenClawReferencePathParams = {
  workspaceDir?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
};
/** Resolve docs and source roots concurrently for prompt/reference injection. */
declare function resolveOpenClawReferencePaths(
  params: ResolveOpenClawReferencePathParams,
): Promise<{
  docsPath: string | null;
  sourcePath: string | null;
}>;
//#endregion
//#region src/crestodian/overview.d.ts
type CrestodianAgentSummary = {
  id: string;
  name?: string;
  isDefault: boolean;
  model?: string;
  workspace?: string;
};
type CrestodianOverview = {
  config: {
    path: string;
    exists: boolean;
    valid: boolean;
    issues: string[];
    hash: string | null;
  };
  agents: CrestodianAgentSummary[];
  defaultAgentId: string;
  defaultModel?: string;
  tools: {
    codex: LocalCommandProbe;
    claude: LocalCommandProbe;
    gemini: LocalCommandProbe;
    apiKeys: {
      openai: boolean;
      anthropic: boolean;
    };
  };
  gateway: {
    url: string;
    source: string;
    reachable: boolean;
    error?: string;
  };
  references: {
    docsPath?: string;
    docsUrl: string;
    sourcePath?: string;
    sourceUrl: string;
  };
};
type GatewayConnectionDetails = {
  url: string;
  urlSource: string;
  remoteFallbackNote?: string;
};
type CrestodianOverviewDependencies = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
  resolveConfigPath?: typeof resolveConfigPath;
  resolveGatewayPort?: typeof resolveGatewayPort;
  buildGatewayConnectionDetails?: (input: {
    config: OpenClawConfig;
    configPath: string;
  }) => GatewayConnectionDetails;
  probeLocalCommand?: typeof probeLocalCommand;
  probeGatewayUrl?: typeof probeGatewayUrl;
  resolveOpenClawReferencePaths?: typeof resolveOpenClawReferencePaths;
};
declare function loadCrestodianOverview(opts?: {
  env?: NodeJS.ProcessEnv;
  deps?: CrestodianOverviewDependencies;
}): Promise<CrestodianOverview>;
//#endregion
//#region src/crestodian/setup-apply.d.ts
/**
 * The whole first-run setup as one approved operation: the user says "yes" in
 * the conversation and this applies model + workspace + quickstart gateway
 * defaults, seeds workspace bootstrap files, and (on the CLI surface) installs
 * and starts the gateway service. No interactive prompts may occur here —
 * everything uses quickstart defaults, so the conversation stays the only UI.
 */
type CrestodianSetupApplyParams = {
  workspace: string;
  model?: string;
  agentRuntimeId?: string /** Pin the selected model to the exact credential that passed inference. */;
  authProfileId?: string /** Exact default-agent route whose inference passed the setup gate. */;
  expectedInferenceRoute?: DefaultInferenceRouteProjection /** Live-probe target; setup aborts if another process switches the default agent. */;
  expectedAgentId?: string /** Manual-auth target; setup aborts if the selected agent's credential directory moves. */;
  expectedAgentDir?: string /** Existing-model probe target; setup aborts if that model changes before persistence. */;
  expectedModelRef?: string /** Full config revision used by the live probe; null means the file was absent. */;
  expectedConfigHash?:
    | string
    | null /** Provider-auth config produced in the isolated manual-key flow. */;
  configPatch?: unknown /** Success-gated final normalization against the config held by the write lock. */;
  finalizeConfig?: (
    config: OpenClawConfig,
    sourceConfig: OpenClawConfig,
  ) => OpenClawConfig /** Plugin whose enablement belongs to the successful setup transaction. */;
  enablePluginId?: string /** Refresh an installed plugin after its success-gated enablement commits. */;
  refreshPluginRegistry?: boolean /** Synchronous cross-store guard checked under the final config write lock. */;
  assertCommitPreconditions?: () => void;
  surface: "cli" | "gateway";
  runtime: RuntimeEnv;
};
type CrestodianSetupApplyResult = {
  configPath: string;
  configHashBefore: string | null;
  configHashAfter: string | null;
  lines: string[];
};
type CrestodianSetupApplyHooks = {
  /** Host-owned authority seam; called at every persistent setup boundary. */ commit<T>(
    effect: () => Promise<T> | T,
  ): Promise<T>;
};
/** Prompter for quickstart-only flows: notes go to the log, prompts fail loud. */
declare function applyCrestodianSetup(
  params: CrestodianSetupApplyParams,
  hooks?: CrestodianSetupApplyHooks,
): Promise<CrestodianSetupApplyResult>;
//#endregion
//#region src/channels/plugins/setup-registry.d.ts
/**
 * Lists setup-capable channel plugins, falling back to bundled setup metadata.
 */
declare function listChannelSetupPlugins(): ChannelPlugin[];
//#endregion
//#region src/channels/plugins/catalog.d.ts
type ChannelPluginCatalogInstall = PluginPackageInstall &
  (
    | {
        clawhubSpec: string;
      }
    | {
        npmSpec: string;
      }
  );
type ChannelPluginCatalogEntry = {
  id: string;
  pluginId?: string;
  origin?: PluginOrigin;
  trustedSourceLinkedOfficialInstall?: boolean;
  meta: ChannelMeta;
  install: ChannelPluginCatalogInstall;
  installSource?: PluginInstallSourceInfo;
};
//#endregion
//#region src/commands/channel-setup/discovery.d.ts
type ChannelCatalogEntry = {
  id: ChannelChoice;
  meta: ChannelMeta;
};
/** Return true when channel metadata should appear in setup/onboarding choices. */
type ResolvedChannelSetupEntries = {
  entries: ChannelCatalogEntry[];
  installedCatalogEntries: ChannelPluginCatalogEntry[];
  installableCatalogEntries: ChannelPluginCatalogEntry[];
  installedCatalogById: Map<ChannelChoice, ChannelPluginCatalogEntry>;
  installableCatalogById: Map<ChannelChoice, ChannelPluginCatalogEntry>;
};
/** List channel ids contributed by currently installed manifest-backed plugins. */
/** Merge configured channels and installable catalog channels into setup display buckets. */
declare function resolveChannelSetupEntries(params: {
  cfg: OpenClawConfig;
  installedPlugins: ChannelPlugin[];
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
}): ResolvedChannelSetupEntries;
//#endregion
//#region src/config/channel-configured-shared.d.ts
/** Detects static channel configuration from known env vars or `channels.<id>` config. */
declare function isStaticallyChannelConfigured(
  cfg: OpenClawConfig,
  channelId: string,
  env?: NodeJS.ProcessEnv,
): boolean;
//#endregion
//#region src/cli/config-set-input.d.ts
type ConfigSetOptions = {
  strictJson?: boolean /** @deprecated Use strictJson. */;
  json?: boolean;
  dryRun?: boolean;
  allowExec?: boolean;
  merge?: boolean;
  replace?: boolean;
  refProvider?: string;
  refSource?: string;
  refId?: string;
  providerSource?: string;
  providerAllowlist?: string[];
  providerPath?: string;
  providerMode?: string;
  providerTimeoutMs?: string;
  providerMaxBytes?: string;
  providerCommand?: string;
  providerArg?: string[];
  providerNoOutputTimeoutMs?: string;
  providerMaxOutputBytes?: string;
  providerJsonOnly?: boolean;
  providerEnv?: string[];
  providerPassEnv?: string[];
  providerTrustedDir?: string[];
  providerAllowInsecurePath?: boolean;
  providerAllowSymlinkCommand?: boolean;
  batchJson?: string;
  batchFile?: string;
};
//#endregion
//#region src/commands/doctor.types.d.ts
/** CLI option shape shared by doctor command entrypoints and prompt helpers. */
type DoctorOptions = {
  workspaceSuggestions?: boolean;
  yes?: boolean;
  nonInteractive?: boolean;
  deep?: boolean;
  repair?: boolean;
  force?: boolean;
  generateGatewayToken?: boolean;
  allowExec?: boolean;
  postUpgrade?: boolean;
  stateSqlite?: "compact";
  sessionSqlite?: "dry-run" | "import" | "validate" | "inspect" | "compact" | "restore" | "recover";
  sessionSqliteStore?: string;
  sessionSqliteAgent?: string;
  sessionSqliteAllAgents?: boolean;
  sessionSqliteGithubIssue?: boolean;
  json?: boolean /** Internal capability granted only to direct operator-owned doctor invocations. */;
  crossStateDirImports?: boolean;
};
//#endregion
//#region src/tui/tui-types.d.ts
type TuiExitReason = "exit" | "return-to-crestodian";
type TuiResult = {
  exitReason: TuiExitReason;
  crestodianMessage?: string;
};
//#endregion
//#region src/crestodian/operations.d.ts
type CrestodianOverviewLoader = () => Promise<CrestodianOverview>;
type CrestodianOverviewFormatter = (overview: CrestodianOverview) => string;
/** Parsed Crestodian operation before approval/execution. */
type CrestodianOperation =
  | {
      kind: "none";
      message: string;
    }
  | {
      kind: "overview";
    }
  | {
      kind: "doctor";
    }
  | {
      kind: "doctor-fix";
    }
  | {
      kind: "status";
    }
  | {
      kind: "health";
    }
  | {
      kind: "config-validate";
    }
  | {
      kind: "config-get";
      path: string;
    }
  | {
      kind: "config-schema";
      path?: string;
    }
  | {
      kind: "config-set";
      path: string;
      value: string;
    }
  | {
      kind: "config-set-ref";
      path: string;
      source: "env" | "file" | "exec";
      id: string;
      provider?: string;
    }
  | {
      kind: "setup";
      workspace?: string;
      model?: string;
    }
  | {
      kind: "model-setup";
      workspace?: string;
    }
  | {
      kind: "channel-list";
    }
  | {
      kind: "channel-info";
      channel: string;
    }
  | {
      kind: "channel-setup";
      channel: string;
    }
  | {
      kind: "open-setup";
      target: "guided" | "classic" | "channels";
      channel?: string;
    }
  | {
      kind: "gateway-status";
    }
  | {
      kind: "gateway-start";
    }
  | {
      kind: "gateway-stop";
    }
  | {
      kind: "gateway-restart";
    }
  | {
      kind: "agents";
    }
  | {
      kind: "models";
    }
  | {
      kind: "plugin-list";
    }
  | {
      kind: "plugin-search";
      query: string;
    }
  | {
      kind: "plugin-install";
      spec: string;
    }
  | {
      kind: "plugin-uninstall";
      pluginId: string;
    }
  | {
      kind: "audit";
    }
  | {
      kind: "create-agent";
      agentId: string;
      workspace?: string;
      model?: string;
    }
  | {
      kind: "open-tui";
      agentId?: string;
      workspace?: string;
    }
  | {
      kind: "set-default-model";
      model: string;
    };
/** Injectable command dependencies used by tests and alternate runners. */
type CrestodianCommandDeps = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
  ensureAuthProfileStore?: typeof ensureAuthProfileStore;
  resolveCliAuthBindingFingerprint?: typeof resolveCliAuthBindingFingerprint;
  resolveApiKeyForProvider?: typeof resolveApiKeyForProvider;
  formatOverview?: CrestodianOverviewFormatter;
  loadOverview?: CrestodianOverviewLoader;
  runAgentsAdd?: (
    opts: {
      name?: string;
      workspace?: string;
      model?: string;
      nonInteractive?: boolean;
      json?: boolean;
    },
    runtime: RuntimeEnv,
    params?: {
      hasFlags?: boolean;
    },
  ) => Promise<void>;
  runConfigSet?: (opts: {
    path?: string;
    value?: string;
    cliOptions: ConfigSetOptions;
  }) => Promise<void>;
  runDoctor?: (runtime: RuntimeEnv, options: DoctorOptions) => Promise<void>;
  runGatewayRestart?: () => Promise<void | boolean>;
  runGatewayStart?: () => Promise<void>;
  runGatewayStop?: () => Promise<void>;
  runPluginInstall?: (spec: string, runtime: RuntimeEnv) => Promise<void>;
  runPluginUninstall?: (pluginId: string, runtime: RuntimeEnv) => Promise<void>;
  runPluginsList?: (runtime: RuntimeEnv) => Promise<void>;
  runPluginsSearch?: (query: string, runtime: RuntimeEnv) => Promise<void>;
  runTui?: (opts: {
    local: boolean;
    session?: string;
    deliver?: boolean;
    historyLimit?: number;
  }) => Promise<TuiResult | void> /** Where setup side effects run; the gateway surface never manages its own daemon. */;
  setupSurface?: "cli" | "gateway";
  applySetup?: typeof applyCrestodianSetup;
  verifyInferenceConfig?: typeof verifySetupInferenceConfig;
  listChannelSetupPlugins?: typeof listChannelSetupPlugins;
  resolveChannelSetupEntries?: typeof resolveChannelSetupEntries;
  isChannelConfigured?: typeof isStaticallyChannelConfigured;
};
//#endregion
export {
  loadCrestodianOverview as i,
  CrestodianOperation as n,
  CrestodianOverview as r,
  CrestodianCommandDeps as t,
};
