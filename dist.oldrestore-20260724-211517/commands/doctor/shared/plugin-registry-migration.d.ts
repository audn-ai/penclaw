import {
  n as InstalledPluginIndexStoreOptions,
  t as InstalledPluginIndexStoreInspection,
} from "../../../installed-plugin-index-store-D_3S5d0v.js";
import {
  r as LoadInstalledPluginIndexParams,
  t as InstalledPluginIndex,
} from "../../../installed-plugin-index-types-75ZYFT43.js";
import { i as OpenClawConfig } from "../../../types.openclaw-DDo8sH3F.js";

//#region src/commands/doctor/shared/plugin-registry-migration.d.ts
declare const DISABLE_PLUGIN_REGISTRY_MIGRATION_ENV = "OPENCLAW_DISABLE_PLUGIN_REGISTRY_MIGRATION";
declare const FORCE_PLUGIN_REGISTRY_MIGRATION_ENV = "OPENCLAW_FORCE_PLUGIN_REGISTRY_MIGRATION";
type PluginRegistryInstallMigrationPreflightAction = "disabled" | "skip-existing" | "migrate";
type PluginRegistryInstallMigrationPreflight = {
  /** Migration action selected before reading or writing registry state. */ action: PluginRegistryInstallMigrationPreflightAction /** Persisted plugin index path that migration will inspect or write. */;
  filePath: string /** True when deprecated force env requested migration despite existing registry. */;
  force: boolean /** Deprecation warnings for env toggles that should be shown to users. */;
  deprecationWarnings: readonly string[];
};
type PluginRegistryInstallMigrationResult =
  | {
      status: "disabled" | "skip-existing" | "dry-run";
      migrated: false;
      preflight: PluginRegistryInstallMigrationPreflight;
    }
  | {
      status: "migrated";
      migrated: true;
      preflight: PluginRegistryInstallMigrationPreflight;
      inspection: InstalledPluginIndexStoreInspection;
      current: InstalledPluginIndex;
    };
type PluginRegistryInstallMigrationParams = LoadInstalledPluginIndexParams &
  InstalledPluginIndexStoreOptions & {
    dryRun?: boolean;
    existsSync?: (path: string) => boolean;
    readConfig?: () => Promise<OpenClawConfig> | OpenClawConfig;
  };
/** Decide whether plugin install registry migration should run for this environment. */
declare function preflightPluginRegistryInstallMigration(
  params?: PluginRegistryInstallMigrationParams,
): PluginRegistryInstallMigrationPreflight;
/** Persist a migrated plugin install registry from legacy config/install records when needed. */
declare function migratePluginRegistryForInstall(
  params?: PluginRegistryInstallMigrationParams,
): Promise<PluginRegistryInstallMigrationResult>;
//#endregion
export {
  DISABLE_PLUGIN_REGISTRY_MIGRATION_ENV,
  FORCE_PLUGIN_REGISTRY_MIGRATION_ENV,
  PluginRegistryInstallMigrationParams,
  migratePluginRegistryForInstall,
  preflightPluginRegistryInstallMigration,
};
