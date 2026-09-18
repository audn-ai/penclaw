import { j as Transport } from "./types-CqrbBnUB.js";

//#region src/agents/sessions/settings-manager.d.ts
interface CompactionSettings {
  enabled?: boolean;
  reserveTokens?: number;
  keepRecentTokens?: number;
}
interface BranchSummarySettings {
  reserveTokens?: number;
  skipPrompt?: boolean;
}
interface ProviderRetrySettings {
  timeoutMs?: number;
  maxRetries?: number;
  maxRetryDelayMs?: number;
}
interface RetrySettings {
  enabled?: boolean;
  maxRetries?: number;
  baseDelayMs?: number;
  provider?: ProviderRetrySettings;
}
interface TerminalSettings {
  showImages?: boolean;
  imageWidthCells?: number;
  clearOnShrink?: boolean;
  showTerminalProgress?: boolean;
}
interface ImageSettings {
  autoResize?: boolean;
  blockImages?: boolean;
}
interface ThinkingBudgetsSettings {
  minimal?: number;
  low?: number;
  medium?: number;
  high?: number;
  max?: number;
}
interface MarkdownSettings {
  codeBlockIndent?: string;
}
interface WarningSettings {
  anthropicExtraUsage?: boolean;
}
type TransportSetting = Transport;
/**
 * Package source for npm/git packages.
 * - String form: load all resources from the package
 * - Object form: filter which resources to load
 */
type PackageSource =
  | string
  | {
      source: string;
      extensions?: string[];
      skills?: string[];
      prompts?: string[];
      themes?: string[];
    };
interface Settings {
  lastChangelogVersion?: string;
  defaultProvider?: string;
  defaultModel?: string;
  defaultThinkingLevel?: "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
  transport?: TransportSetting;
  steeringMode?: "all" | "one-at-a-time";
  followUpMode?: "all" | "one-at-a-time";
  theme?: string;
  compaction?: CompactionSettings;
  branchSummary?: BranchSummarySettings;
  retry?: RetrySettings;
  hideThinkingBlock?: boolean;
  shellPath?: string;
  quietStartup?: boolean;
  shellCommandPrefix?: string;
  npmCommand?: string[];
  collapseChangelog?: boolean;
  enableInstallTelemetry?: boolean;
  packages?: PackageSource[];
  extensions?: string[];
  skills?: string[];
  prompts?: string[];
  themes?: string[];
  enableSkillCommands?: boolean;
  terminal?: TerminalSettings;
  images?: ImageSettings;
  enabledModels?: string[];
  doubleEscapeAction?: "fork" | "tree" | "none";
  treeFilterMode?: "default" | "no-tools" | "user-only" | "labeled-only" | "all";
  thinkingBudgets?: ThinkingBudgetsSettings;
  editorPaddingX?: number;
  autocompleteMaxVisible?: number;
  showHardwareCursor?: boolean;
  markdown?: MarkdownSettings;
  warnings?: WarningSettings;
  sessionDir?: string;
  httpIdleTimeoutMs?: number;
}
type SettingsScope = "global" | "project";
interface SettingsStorage {
  withLock(scope: SettingsScope, fn: (current: string | undefined) => string | undefined): void;
}
interface SettingsError {
  scope: SettingsScope;
  error: Error;
}
declare class FileSettingsStorage implements SettingsStorage {
  private globalSettingsPath;
  private projectSettingsPath;
  constructor(cwd: string, agentDir: string);
  withLock(scope: SettingsScope, fn: (current: string | undefined) => string | undefined): void;
}
declare class InMemorySettingsStorage implements SettingsStorage {
  private global;
  private project;
  withLock(scope: SettingsScope, fn: (current: string | undefined) => string | undefined): void;
}
declare class SettingsManager {
  private storage;
  private globalSettings;
  private projectSettings;
  private settings;
  private runtimeOverrides;
  private modifiedFields;
  private modifiedNestedFields;
  private modifiedProjectFields;
  private modifiedProjectNestedFields;
  private globalSettingsLoadError;
  private projectSettingsLoadError;
  private writeQueue;
  private errors;
  private constructor();
  /** Create a SettingsManager that loads from files */
  static create(cwd: string, agentDir?: string): SettingsManager;
  /** Create a SettingsManager from an arbitrary storage backend */
  static fromStorage(storage: SettingsStorage): SettingsManager;
  /** Create an in-memory SettingsManager (no file I/O) */
  static inMemory(settings?: Partial<Settings>): SettingsManager;
  private static loadFromStorage;
  private static tryLoadFromStorage;
  /** Migrate old settings format to new format */
  private static migrateSettings;
  getGlobalSettings(): Settings;
  getProjectSettings(): Settings;
  private recomputeSettings;
  reload(): Promise<void>;
  /** Apply non-persisted overrides on top of global/project settings. */
  applyOverrides(overrides: Partial<Settings>): void;
  /** Mark a global field as modified during this session */
  private markModified;
  /** Mark a project field as modified during this session */
  private markProjectModified;
  private recordError;
  private clearModifiedScope;
  private enqueueWrite;
  private cloneModifiedNestedFields;
  private persistScopedSettings;
  private save;
  private saveProjectSettings;
  flush(): Promise<void>;
  drainErrors(): SettingsError[];
  getLastChangelogVersion(): string | undefined;
  setLastChangelogVersion(version: string): void;
  getSessionDir(): string | undefined;
  getDefaultProvider(): string | undefined;
  getDefaultModel(): string | undefined;
  setDefaultProvider(provider: string): void;
  setDefaultModel(modelId: string): void;
  setDefaultModelAndProvider(provider: string, modelId: string): void;
  getSteeringMode(): "all" | "one-at-a-time";
  setSteeringMode(mode: "all" | "one-at-a-time"): void;
  getFollowUpMode(): "all" | "one-at-a-time";
  setFollowUpMode(mode: "all" | "one-at-a-time"): void;
  getTheme(): string | undefined;
  setTheme(theme: string): void;
  getDefaultThinkingLevel():
    | "off"
    | "minimal"
    | "low"
    | "medium"
    | "high"
    | "xhigh"
    | "max"
    | undefined;
  setDefaultThinkingLevel(
    level: "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max",
  ): void;
  getTransport(): TransportSetting;
  setTransport(transport: TransportSetting): void;
  getCompactionEnabled(): boolean;
  setCompactionEnabled(enabled: boolean): void;
  getCompactionReserveTokens(): number;
  getCompactionKeepRecentTokens(): number;
  getCompactionSettings(): {
    enabled: boolean;
    reserveTokens: number;
    keepRecentTokens: number;
  };
  getBranchSummarySettings(): {
    reserveTokens: number;
    skipPrompt: boolean;
  };
  getBranchSummarySkipPrompt(): boolean;
  getRetryEnabled(): boolean;
  setRetryEnabled(enabled: boolean): void;
  getRetrySettings(): {
    enabled: boolean;
    maxRetries: number;
    baseDelayMs: number;
  };
  getHttpIdleTimeoutMs(): number;
  setHttpIdleTimeoutMs(timeoutMs: number): void;
  getProviderRetrySettings(): {
    timeoutMs?: number;
    maxRetries?: number;
    maxRetryDelayMs: number;
  };
  getHideThinkingBlock(): boolean;
  setHideThinkingBlock(hide: boolean): void;
  getShellPath(): string | undefined;
  setShellPath(path: string | undefined): void;
  getQuietStartup(): boolean;
  setQuietStartup(quiet: boolean): void;
  getShellCommandPrefix(): string | undefined;
  setShellCommandPrefix(prefix: string | undefined): void;
  getNpmCommand(): string[] | undefined;
  setNpmCommand(command: string[] | undefined): void;
  getCollapseChangelog(): boolean;
  setCollapseChangelog(collapse: boolean): void;
  getEnableInstallTelemetry(): boolean;
  setEnableInstallTelemetry(enabled: boolean): void;
  getPackages(): PackageSource[];
  setPackages(packages: PackageSource[]): void;
  setProjectPackages(packages: PackageSource[]): void;
  getExtensionPaths(): string[];
  setExtensionPaths(paths: string[]): void;
  setProjectExtensionPaths(paths: string[]): void;
  getSkillPaths(): string[];
  setSkillPaths(paths: string[]): void;
  setProjectSkillPaths(paths: string[]): void;
  getPromptTemplatePaths(): string[];
  setPromptTemplatePaths(paths: string[]): void;
  setProjectPromptTemplatePaths(paths: string[]): void;
  getThemePaths(): string[];
  setThemePaths(paths: string[]): void;
  setProjectThemePaths(paths: string[]): void;
  getEnableSkillCommands(): boolean;
  setEnableSkillCommands(enabled: boolean): void;
  getThinkingBudgets(): ThinkingBudgetsSettings | undefined;
  getShowImages(): boolean;
  setShowImages(show: boolean): void;
  getImageWidthCells(): number;
  setImageWidthCells(width: number): void;
  getClearOnShrink(): boolean;
  setClearOnShrink(enabled: boolean): void;
  getShowTerminalProgress(): boolean;
  setShowTerminalProgress(enabled: boolean): void;
  getImageAutoResize(): boolean;
  setImageAutoResize(enabled: boolean): void;
  getBlockImages(): boolean;
  setBlockImages(blocked: boolean): void;
  getEnabledModels(): string[] | undefined;
  setEnabledModels(patterns: string[] | undefined): void;
  getDoubleEscapeAction(): "fork" | "tree" | "none";
  setDoubleEscapeAction(action: "fork" | "tree" | "none"): void;
  getTreeFilterMode(): "default" | "no-tools" | "user-only" | "labeled-only" | "all";
  setTreeFilterMode(mode: "default" | "no-tools" | "user-only" | "labeled-only" | "all"): void;
  getShowHardwareCursor(): boolean;
  setShowHardwareCursor(enabled: boolean): void;
  getEditorPaddingX(): number;
  setEditorPaddingX(padding: number): void;
  getAutocompleteMaxVisible(): number;
  setAutocompleteMaxVisible(maxVisible: number): void;
  getCodeBlockIndent(): string;
  getWarnings(): WarningSettings;
  setWarnings(warnings: WarningSettings): void;
}
//#endregion
//#region src/agents/sessions/package-manager.d.ts
interface PathMetadata {
  source: string;
  scope: SourceScope$1;
  origin: "package" | "top-level";
  baseDir?: string;
}
interface ResolvedResource {
  path: string;
  enabled: boolean;
  metadata: PathMetadata;
}
interface ResolvedPaths {
  extensions: ResolvedResource[];
  skills: ResolvedResource[];
  prompts: ResolvedResource[];
  themes: ResolvedResource[];
}
type MissingSourceAction = "skip" | "error";
interface PackageManager {
  resolve(onMissing?: (source: string) => Promise<MissingSourceAction>): Promise<ResolvedPaths>;
  resolveExtensionSources(
    sources: string[],
    options?: {
      local?: boolean;
      temporary?: boolean;
    },
  ): Promise<ResolvedPaths>;
}
interface PackageManagerOptions {
  cwd: string;
  agentDir: string;
  settingsManager: SettingsManager;
}
type SourceScope$1 = "user" | "project" | "temporary";
declare class DefaultPackageManager implements PackageManager {
  private cwd;
  private agentDir;
  private settingsManager;
  constructor(options: PackageManagerOptions);
  resolve(onMissing?: (source: string) => Promise<MissingSourceAction>): Promise<ResolvedPaths>;
  resolveExtensionSources(
    sources: string[],
    options?: {
      local?: boolean;
      temporary?: boolean;
    },
  ): Promise<ResolvedPaths>;
  private resolvePackageSources;
  private resolveLocalExtensionSource;
  private parseSource;
  private installedNpmMatchesPinnedVersion;
  private getInstalledNpmVersion;
  /**
   * Get a unique identity for a package, ignoring version/ref.
   * Used to detect when the same package is in both global and project settings.
   * For git packages, uses normalized host/path to ensure SSH and HTTPS URLs
   * for the same repository are treated as identical.
   */
  private getPackageIdentity;
  /**
   * Dedupe packages: if same package identity appears in both global and project,
   * keep only the project one (project wins).
   */
  private dedupePackages;
  private parseNpmSpec;
  private getNpmInstallPath;
  private getGitInstallPath;
  private getTemporaryDir;
  private getBaseDirForScope;
  private resolvePath;
  private resolvePathFromBase;
  private collectPackageResources;
  private collectDefaultResources;
  private applyPackageFilter;
  /**
   * Collect all files from a package for a resource type, applying manifest patterns.
   * Returns { allFiles, enabledByManifest } where enabledByManifest is the set of files
   * that pass the manifest's own patterns.
   */
  private collectManifestFiles;
  private collectConventionResourceFiles;
  private readResourceManifest;
  private addManifestEntries;
  private collectFilesFromManifestEntries;
  private filterManifestResourcePaths;
  private resolveLocalEntries;
  private addAutoDiscoveredResources;
  private collectFilesFromPaths;
  private getTargetMap;
  private addResource;
  private createAccumulator;
  private toResolvedPaths;
}
//#endregion
//#region src/agents/sessions/source-info.d.ts
type SourceScope = "user" | "project" | "temporary";
type SourceOrigin = "package" | "top-level";
interface SourceInfo {
  path: string;
  source: string;
  scope: SourceScope;
  origin: SourceOrigin;
  baseDir?: string;
}
/** Converts package-manager path metadata into the session source-info shape. */
declare function createSourceInfo(path: string, metadata: PathMetadata): SourceInfo;
/** Builds source metadata for generated or synthetic session entries. */
declare function createSyntheticSourceInfo(
  path: string,
  options: {
    source: string;
    scope?: SourceScope;
    origin?: SourceOrigin;
    baseDir?: string;
  },
): SourceInfo;
//#endregion
export {
  SettingsScope as C,
  TransportSetting as D,
  ThinkingBudgetsSettings as E,
  WarningSettings as O,
  SettingsManager as S,
  TerminalSettings as T,
  PackageSource as _,
  createSyntheticSourceInfo as a,
  Settings as b,
  PackageManager as c,
  ResolvedResource as d,
  BranchSummarySettings as f,
  MarkdownSettings as g,
  InMemorySettingsStorage as h,
  createSourceInfo as i,
  PathMetadata as l,
  ImageSettings as m,
  SourceOrigin as n,
  DefaultPackageManager as o,
  FileSettingsStorage as p,
  SourceScope as r,
  MissingSourceAction as s,
  SourceInfo as t,
  ResolvedPaths as u,
  ProviderRetrySettings as v,
  SettingsStorage as w,
  SettingsError as x,
  RetrySettings as y,
};
