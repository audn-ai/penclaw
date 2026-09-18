import { i as CompatMutationResult } from "./dm-access-BLdoaTNe.js";
import { t as LegacyConfigRule } from "./legacy.shared-CFJyEGh7.js";
import {
  r as PluginStateKeyedStore,
  t as OpenKeyedStoreOptions,
} from "./plugin-state-store.types-xAF7b0j2.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/config/channel-compat-normalization.d.ts
/** Resolved streaming values a channel doctor supplies while migrating legacy aliases. */
type LegacyStreamingAliasOptions = {
  resolvedMode: string;
  /**
   * Mode to persist when migration creates the `streaming` object from flat
   * delivery aliases alone (no streamMode/scalar/boolean mode source). Only
   * needed by channels whose "streaming absent" runtime default differs from
   * their object-without-mode default (Discord: progress vs off).
   */
  aliasOnlyMode?: string;
  includePreviewChunk?: boolean;
  resolvedNativeTransport?: unknown;
};
/** Account-level channel config passed to channel-specific doctor migrations. */
type NormalizeLegacyChannelAccountParams = {
  account: Record<string, unknown>;
  accountId: string;
  pathPrefix: string;
  changes: string[];
};
/** Narrows unknown config JSON values to mutable object records. */
declare function asObjectRecord(value: unknown): Record<string, unknown> | null;
/**
 * Doctor-only stream mode resolution across nested and legacy alias keys.
 *
 * Runtime helpers no longer read `streamMode`, so doctor contracts use this to
 * preserve legacy intent (nested mode > scalar string > streamMode > scalar
 * boolean) while migrating flat aliases into `streaming.mode`.
 */
declare function resolveLegacyAliasStreamingMode(
  entry: Record<string, unknown>,
  defaultMode: "off" | "partial" | "block" | "progress",
): "off" | "partial" | "block" | "progress";
/** Checks whether any account entry still carries a channel-specific legacy alias. */
declare function hasLegacyAccountStreamingAliases(
  value: unknown,
  match: (entry: unknown) => boolean,
): boolean;
/**
 * Moves legacy flat streaming aliases into the nested `streaming` config shape.
 *
 * Existing nested values win over legacy aliases, matching doctor migration rules
 * that preserve explicit modern config while removing stale compatibility keys.
 */
declare function normalizeLegacyStreamingAliases(
  params: {
    entry: Record<string, unknown>;
    pathPrefix: string;
    changes: string[];
  } & LegacyStreamingAliasOptions,
): CompatMutationResult;
/**
 * Runs generic channel doctor alias migration for the root entry and accounts.
 *
 * Channel plugins provide streaming resolution and optional account-specific
 * migrations so core can keep one compatibility path for all channel shapes.
 */
declare function normalizeLegacyChannelAliases(params: {
  entry: Record<string, unknown>;
  pathPrefix: string;
  changes: string[];
  normalizeDm?: boolean;
  rootDmPromoteAllowFrom?: boolean;
  normalizeAccountDm?: boolean;
  /**
   * Set for channels whose runtime account merge replaces the root `streaming`
   * object wholesale (`streaming` not deep-merged). Doctor then seeds account
   * objects it materializes with the inherited root settings. Channels that
   * deep-merge streaming (slack, imessage) must NOT seed: their runtime keeps
   * composing root+account, and seeded copies would freeze inheritance.
   */
  seedAccountStreamingFromRoot?: boolean;
  resolveStreamingOptions: (entry: Record<string, unknown>) => LegacyStreamingAliasOptions;
  normalizeAccountExtra?: (params: NormalizeLegacyChannelAccountParams) => CompatMutationResult;
}): CompatMutationResult;
/** Detects legacy streaming aliases on one channel or account config entry. */
declare function hasLegacyStreamingAliases(
  value: unknown,
  options?: {
    includePreviewChunk?: boolean;
    includeNativeTransport?: boolean;
  },
): boolean;
//#endregion
//#region src/config/channel-alias-migration.d.ts
type StreamingAliasMode = "off" | "partial" | "block" | "progress";
/**
 * Streaming half of a channel alias-migration spec.
 *
 * TMode widens the migrated `streaming.mode` value set for channels whose
 * nested schema keeps channel-local modes (Matrix adds "quiet"); the generic
 * default keeps the shared four-mode contract for everyone else.
 */
type StreamingAliasSpec<TMode extends string = StreamingAliasMode> = {
  /** Default passed to resolveLegacyAliasStreamingMode for mode-source migration. */ defaultMode: StreamingAliasMode /** Channel-specific mode resolver override (Slack maps legacy draft stream modes). */;
  resolveMode?: (entry: Record<string, unknown>) => TMode;
  /**
   * The channel's runtime default when `streaming` is entirely absent, if it
   * differs from the object-without-mode default (Discord: progress vs off).
   * Pinned when delivery-only aliases materialize the object and no root
   * streaming object exists to seed inherited settings from.
   */
  absentObjectDefault?: StreamingAliasMode /** Channel accepts flat `draftChunk` (Discord, Telegram). */;
  includePreviewChunk?: boolean /** Channel accepts flat `nativeStreaming`; returns the resolved nativeTransport (Slack). */;
  resolveNativeTransport?: (entry: Record<string, unknown>) => unknown;
  /**
   * Channel has no streaming mode: only delivery flat aliases migrate, and
   * scalar `streaming` values are plain validation errors (iMessage). The
   * detection matcher excludes streamMode/scalar streaming, and the migration
   * only runs when a delivery flat alias exists somewhere in the entry.
   */
  deliveryOnly?: boolean;
};
type ChannelAliasMigrationSpec<TMode extends string = StreamingAliasMode> = {
  /** Channel id under `channels.<id>`; also the doctor message path prefix. */ channelId: string;
  streaming: StreamingAliasSpec<TMode>;
  /**
   * Set when the channel's runtime account merge replaces the root `streaming`
   * object wholesale (Discord). Migration then seeds account objects it
   * materializes with the inherited root settings. Leave unset for channels
   * that deep-merge streaming at runtime (Slack, iMessage) — seeding there
   * would freeze inheritance into the account config.
   */
  accountStreamingReplacesRoot?: boolean;
  dm?: {
    root?: boolean;
    accounts?: boolean;
    rootPromoteAllowFrom?: boolean;
  } /** Escape hatch for channel-specific per-account migrations (Discord voice.tts). */;
  normalizeAccountExtra?: (params: NormalizeLegacyChannelAccountParams) => CompatMutationResult;
};
/**
 * Builds the standard channel doctor alias-migration surface from a small spec:
 * detection rules (root + accounts), the per-entry matcher, and the config
 * normalizer. Channels with additional migrations compose around these pieces.
 */
declare function defineChannelAliasMigration<TMode extends string = StreamingAliasMode>(
  spec: ChannelAliasMigrationSpec<TMode>,
): {
  legacyConfigRules: LegacyConfigRule[];
  hasLegacyAliases: (value: unknown) => boolean;
  normalizeChannelConfig: (params: { cfg: OpenClawConfig; changes?: string[] }) => {
    config: OpenClawConfig;
    changes: string[];
  };
};
//#endregion
//#region src/plugins/doctor-session-route-state-owner-types.d.ts
type DoctorSessionRouteStateOwner = {
  id: string;
  label: string;
  providerIds?: readonly string[];
  runtimeIds?: readonly string[];
  cliSessionKeys?: readonly string[];
  authProfilePrefixes?: readonly string[];
};
//#endregion
//#region src/plugins/doctor-contract-registry.d.ts
type PluginDoctorStateMigrationDetection = {
  preview: string[];
};
type PluginDoctorStateMigrationContext = {
  openPluginStateKeyedStore: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
};
type PluginDoctorStateMigration = {
  id: string;
  label: string;
  detectLegacyState: (params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
    context: PluginDoctorStateMigrationContext;
  }) =>
    | Promise<PluginDoctorStateMigrationDetection | null>
    | PluginDoctorStateMigrationDetection
    | null;
  migrateLegacyState: (params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
    context: PluginDoctorStateMigrationContext;
  }) =>
    | Promise<{
        changes: string[];
        warnings: string[];
        notices?: string[];
      }>
    | {
        changes: string[];
        warnings: string[];
        notices?: string[];
      };
};
//#endregion
//#region src/plugins/doctor-state-migration-fs.d.ts
/** True when the legacy-state path exists and is a regular file. */
declare function legacyStateFileExists(filePath: string): Promise<boolean>;
/**
 * Renames a migrated legacy source to `<path>.migrated`, recording the outcome in the
 * doctor changes/warnings lists. Never throws: a failed archive leaves the source in
 * place so a later doctor run can retry without losing migrated data.
 */
declare function archiveLegacyStateSource(params: {
  filePath: string;
  label: string;
  changes: string[];
  warnings: string[];
}): Promise<void>;
//#endregion
export {
  DoctorSessionRouteStateOwner as a,
  defineChannelAliasMigration as c,
  asObjectRecord as d,
  hasLegacyAccountStreamingAliases as f,
  resolveLegacyAliasStreamingMode as g,
  normalizeLegacyStreamingAliases as h,
  PluginDoctorStateMigrationContext as i,
  LegacyStreamingAliasOptions as l,
  normalizeLegacyChannelAliases as m,
  legacyStateFileExists as n,
  ChannelAliasMigrationSpec as o,
  hasLegacyStreamingAliases as p,
  PluginDoctorStateMigration as r,
  StreamingAliasMode as s,
  archiveLegacyStateSource as t,
  NormalizeLegacyChannelAccountParams as u,
};
