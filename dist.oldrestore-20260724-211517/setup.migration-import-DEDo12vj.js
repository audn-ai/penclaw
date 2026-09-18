import crypto from "node:crypto";
import { createReadStream } from "node:fs";
import fs$1 from "node:fs/promises";
import "./utils-DtcDeqWS.js";
import path from "node:path";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { o as withFileLock } from "./file-lock-C2Kr7iLJ.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { n as t } from "./i18n-BDUMKn0X.js";
import "./file-lock-CsC2zkbH.js";
import { l as writeJson } from "./json-7OTJmMaB.js";
import { t as readDurableJsonFile } from "./json-files-CTWRDHag.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  a as loadManifestContractSnapshot,
  r as listAvailableManifestContractPlugins,
} from "./manifest-contract-eligibility-3WxfNDRv.js";
import { v as summarizeMigrationItems } from "./migration-nGWjmzKy.js";
import {
  d as resolveOfficialExternalPluginInstall,
  f as resolveOfficialExternalPluginLabel,
  r as getOfficialExternalPluginCatalogManifest,
  s as listOfficialExternalPluginCatalogEntries,
  u as resolveOfficialExternalPluginId,
} from "./official-external-plugin-catalog-B2V9K3em.js";
import { t as ensureOnboardingPluginInstalled } from "./onboarding-plugin-install-CWpxxH4E.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
//#region src/wizard/setup.migration-recovery.ts
const SETUP_MIGRATION_ATTEMPT_FILE = "onboarding-attempt.json";
const SETUP_MIGRATION_ATTEMPT_VERSION = 1;
/** Hermes enumerates its replay inputs and has idempotent or conflict-checked item writes. */
function setupMigrationProviderSupportsRecovery(providerId) {
  return providerId === "hermes";
}
function buildPathHash(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
function buildSourceHash(source) {
  return buildPathHash(path.resolve(resolveUserPath(source.trim())));
}
function buildWorkspaceHash(workspaceDir) {
  return buildPathHash(path.resolve(workspaceDir));
}
function canonicalizeJsonValue$1(value) {
  if (Array.isArray(value)) return value.map(canonicalizeJsonValue$1);
  if (!value || typeof value !== "object") return value;
  const record = value;
  return Object.fromEntries(
    Object.keys(record)
      .toSorted()
      .filter((key) => record[key] !== void 0)
      .map((key) => [key, canonicalizeJsonValue$1(record[key])]),
  );
}
function buildMigrationItemFingerprint(item) {
  const { status: _status, reason: _reason, ...identity } = item;
  return buildPathHash(JSON.stringify(canonicalizeJsonValue$1(identity)));
}
function buildMigrationPlanFingerprint(plan) {
  return buildPathHash(
    JSON.stringify(
      canonicalizeJsonValue$1({
        providerId: plan.providerId,
        source: plan.source,
        target: plan.target,
        metadata: plan.metadata,
      }),
    ),
  );
}
function isMigrationItemStatus(value) {
  return (
    value === "planned" ||
    value === "migrated" ||
    value === "skipped" ||
    value === "warning" ||
    value === "conflict" ||
    value === "error"
  );
}
function isSetupMigrationAttemptItem(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value;
  return (
    typeof item.id === "string" &&
    typeof item.fingerprint === "string" &&
    /^[a-f0-9]{64}$/.test(item.fingerprint) &&
    (item.resultStatus === void 0 || isMigrationItemStatus(item.resultStatus))
  );
}
function isSetupMigrationAttempt(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const record = value;
  return (
    record.version === SETUP_MIGRATION_ATTEMPT_VERSION &&
    typeof record.providerId === "string" &&
    typeof record.sourceHash === "string" &&
    /^[a-f0-9]{64}$/.test(record.sourceHash) &&
    typeof record.sourceSnapshotHash === "string" &&
    /^[a-f0-9]{64}$/.test(record.sourceSnapshotHash) &&
    typeof record.workspaceHash === "string" &&
    /^[a-f0-9]{64}$/.test(record.workspaceHash) &&
    typeof record.planFingerprint === "string" &&
    /^[a-f0-9]{64}$/.test(record.planFingerprint) &&
    Array.isArray(record.items) &&
    record.items.every(isSetupMigrationAttemptItem) &&
    typeof record.itemStatusesCaptured === "boolean" &&
    typeof record.targetSnapshotHashPrepared === "string" &&
    /^[a-f0-9]{64}$/.test(record.targetSnapshotHashPrepared) &&
    typeof record.targetSnapshotHashBefore === "string" &&
    /^[a-f0-9]{64}$/.test(record.targetSnapshotHashBefore) &&
    (record.targetSnapshotHashAfter === void 0 ||
      (typeof record.targetSnapshotHashAfter === "string" &&
        /^[a-f0-9]{64}$/.test(record.targetSnapshotHashAfter))) &&
    (record.status === "applying" || record.status === "failed" || record.status === "succeeded") &&
    (record.status !== "failed" || record.targetSnapshotHashAfter !== void 0) &&
    typeof record.startedAt === "string" &&
    typeof record.updatedAt === "string"
  );
}
function isMissingPathError$1(error) {
  return error?.code === "ENOENT";
}
function createSetupMigrationAttempt(params, now = /* @__PURE__ */ new Date()) {
  const timestamp = now.toISOString();
  const previousItems = params.previousAttempt?.items;
  return {
    version: SETUP_MIGRATION_ATTEMPT_VERSION,
    providerId: params.providerId,
    sourceHash: buildSourceHash(params.source),
    sourceSnapshotHash: params.sourceSnapshotHash,
    workspaceHash: buildWorkspaceHash(params.workspaceDir),
    planFingerprint: buildMigrationPlanFingerprint(params.plan),
    items: params.plan.items.map((item, index) => {
      const fingerprint = buildMigrationItemFingerprint(item);
      const previous = previousItems?.[index];
      return {
        id: item.id,
        fingerprint,
        ...(previous?.id === item.id && previous.fingerprint === fingerprint
          ? { resultStatus: previous.resultStatus }
          : {}),
      };
    }),
    itemStatusesCaptured: false,
    targetSnapshotHashPrepared: params.preparedTargetSnapshotHash ?? params.targetSnapshotHash,
    targetSnapshotHashBefore: params.targetSnapshotHash,
    status: "applying",
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}
async function writeSetupMigrationAttempt(params) {
  const resultItems = params.result?.items;
  const itemStatusesCaptured =
    resultItems?.length === params.attempt.items.length &&
    resultItems.every((item, index) => item.id === params.attempt.items[index]?.id);
  const items = itemStatusesCaptured
    ? params.attempt.items.map((item, index) => ({
        ...item,
        resultStatus:
          item.resultStatus === "migrated" && resultItems?.[index]?.status === "skipped"
            ? "migrated"
            : resultItems?.[index]?.status,
      }))
    : params.attempt.items;
  await writeJson(
    path.join(params.reportDir, SETUP_MIGRATION_ATTEMPT_FILE),
    {
      ...params.attempt,
      items,
      itemStatusesCaptured,
      ...(params.targetSnapshotHash ? { targetSnapshotHashAfter: params.targetSnapshotHash } : {}),
      status: params.status,
      updatedAt: /* @__PURE__ */ new Date().toISOString(),
    },
    {
      mode: 384,
      dirMode: 448,
      trailingNewline: true,
    },
  );
}
/** Runs provider apply while durably recording completion or a safe retry boundary. */
async function runSetupMigrationAttempt(params) {
  await writeSetupMigrationAttempt({
    reportDir: params.reportDir,
    attempt: params.attempt,
    status: "applying",
  });
  let result;
  try {
    result = await params.apply();
    params.assertSucceeded(result);
  } catch (error) {
    try {
      await writeSetupMigrationAttempt({
        reportDir: params.reportDir,
        attempt: params.attempt,
        status: "failed",
        result,
        targetSnapshotHash: await params.readTargetSnapshot(),
      });
    } catch (recoveryError) {
      throw new AggregateError(
        [error, recoveryError],
        "Migration import failed and its retry record could not be updated.",
        { cause: recoveryError },
      );
    }
    throw error;
  }
  await writeSetupMigrationAttempt({
    reportDir: params.reportDir,
    attempt: params.attempt,
    status: "succeeded",
    result,
  });
  return result;
}
async function findLatestSetupMigrationAttempt(params) {
  const providerReportRoot = path.join(params.stateDir, "migration", params.providerId);
  let entries;
  try {
    entries = await fs$1.readdir(providerReportRoot, { withFileTypes: true });
  } catch (error) {
    if (isMissingPathError$1(error)) return;
    throw error;
  }
  for (const entry of entries
    .filter((candidate) => candidate.isDirectory())
    .toSorted((left, right) => (left.name < right.name ? 1 : left.name > right.name ? -1 : 0))) {
    const recordPath = path.join(providerReportRoot, entry.name, SETUP_MIGRATION_ATTEMPT_FILE);
    let value;
    try {
      value = await readDurableJsonFile(recordPath);
    } catch (error) {
      throw new Error(`Invalid onboarding migration recovery record: ${recordPath}`, {
        cause: error,
      });
    }
    if (value === null) continue;
    if (!isSetupMigrationAttempt(value))
      throw new Error(`Invalid onboarding migration recovery record: ${recordPath}`);
    if (value.providerId === params.providerId && params.matches(value)) return value;
  }
}
/** Allows retry only while the target still matches the recorded attempt boundary. */
async function resolveSetupMigrationRecovery(params) {
  const workspaceHash = buildWorkspaceHash(params.workspaceDir);
  const attempt = await findLatestSetupMigrationAttempt({
    stateDir: params.stateDir,
    providerId: params.providerId,
    matches: (candidate) => candidate.workspaceHash === workspaceHash,
  });
  if (!attempt || attempt.status === "succeeded") return { kind: "none" };
  if (attempt.status === "applying")
    return attempt.targetSnapshotHashPrepared === params.targetSnapshotHash ||
      attempt.targetSnapshotHashBefore === params.targetSnapshotHash
      ? {
          kind: "recoverable",
          attempt,
        }
      : { kind: "none" };
  if (attempt.targetSnapshotHashAfter !== params.targetSnapshotHash) return { kind: "none" };
  return attempt.itemStatusesCaptured ||
    attempt.targetSnapshotHashPrepared === params.targetSnapshotHash ||
    attempt.targetSnapshotHashBefore === params.targetSnapshotHash
    ? {
        kind: "recoverable",
        attempt,
      }
    : { kind: "none" };
}
function setupMigrationAttemptMatchesSource(attempt, source) {
  return attempt.sourceHash === buildSourceHash(source);
}
/** Reuses an unchanged plan while suppressing items already completed by the failed run. */
function prepareSetupMigrationRetryPlan(plan, attempt, sourceSnapshotHash) {
  if (attempt.sourceSnapshotHash !== sourceSnapshotHash)
    throw new Error(
      "Migration source changed since the failed attempt. Review it before starting a new import.",
    );
  if (attempt.planFingerprint !== buildMigrationPlanFingerprint(plan))
    throw new Error(
      "Migration retry plan context changed since the failed attempt. Review it before retrying.",
    );
  if (
    plan.items.length !== attempt.items.length ||
    plan.items.some((item, index) => {
      const previous = attempt.items[index];
      return (
        !previous ||
        previous.id !== item.id ||
        previous.fingerprint !== buildMigrationItemFingerprint(item)
      );
    })
  )
    throw new Error(
      "Migration retry plan changed since the failed attempt. Review the source and target before retrying.",
    );
  const items = plan.items.map((item, index) => {
    if (attempt.items[index]?.resultStatus !== "migrated" || item.action === "archive") return item;
    return {
      ...item,
      status: "skipped",
      reason: "already completed by the previous onboarding import attempt",
    };
  });
  return {
    ...plan,
    items,
    summary: summarizeMigrationItems(items),
  };
}
//#endregion
//#region src/wizard/setup.migration-snapshot.ts
const SETUP_MIGRATION_LOCK_OPTIONS = {
  retries: {
    retries: 60,
    factor: 1,
    minTimeout: 500,
    maxTimeout: 500,
  },
  stale: 1800 * 1e3,
  staleRecovery: "remove-if-unchanged",
};
const MEANINGFUL_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set(["$schema", "meta"]);
const MEANINGFUL_WIZARD_CONFIG_IGNORED_KEYS = /* @__PURE__ */ new Set(["securityAcknowledgedAt"]);
const MEANINGFUL_WORKSPACE_ENTRIES = [
  "AGENTS.md",
  "SOUL.md",
  "USER.md",
  "IDENTITY.md",
  "MEMORY.md",
  "skills",
];
const MEANINGFUL_STATE_ENTRIES = ["credentials", "sessions", "agents"];
function isMissingPathError(error) {
  return error?.code === "ENOENT";
}
function canonicalizeJsonValue(value) {
  if (Array.isArray(value)) return value.map(canonicalizeJsonValue);
  if (!value || typeof value !== "object") return value;
  const record = value;
  return Object.fromEntries(
    Object.keys(record)
      .toSorted()
      .filter((key) => record[key] !== void 0)
      .map((key) => [key, canonicalizeJsonValue(record[key])]),
  );
}
async function exists(candidate) {
  try {
    await fs$1.access(candidate);
    return true;
  } catch {
    return false;
  }
}
async function hasDirectoryEntries(candidate) {
  try {
    return (await fs$1.readdir(candidate)).length > 0;
  } catch {
    return false;
  }
}
function hasMeaningfulWizardConfig(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return true;
  return Object.keys(value).some((key) => !MEANINGFUL_WIZARD_CONFIG_IGNORED_KEYS.has(key));
}
function hasMeaningfulConfig(config) {
  return Object.entries(config).some(([key, value]) => {
    if (MEANINGFUL_CONFIG_IGNORED_KEYS.has(key)) return false;
    return key === "wizard" ? hasMeaningfulWizardConfig(value) : true;
  });
}
function buildSetupMigrationSnapshotConfig(config) {
  const snapshot = {};
  for (const [key, value] of Object.entries(config)) {
    if (MEANINGFUL_CONFIG_IGNORED_KEYS.has(key)) continue;
    if (key !== "wizard" || !value || typeof value !== "object" || Array.isArray(value)) {
      snapshot[key] = value;
      continue;
    }
    const wizard = Object.fromEntries(
      Object.entries(value).filter(
        ([wizardKey]) => !MEANINGFUL_WIZARD_CONFIG_IGNORED_KEYS.has(wizardKey),
      ),
    );
    if (Object.keys(wizard).length > 0) snapshot[key] = wizard;
  }
  return snapshot;
}
async function inspectSetupMigrationFreshness(params) {
  const reasons = [];
  if (hasMeaningfulConfig(params.baseConfig)) reasons.push("existing config values are loaded");
  for (const entry of MEANINGFUL_WORKSPACE_ENTRIES)
    if (await exists(path.join(params.workspaceDir, entry)))
      reasons.push(`workspace ${entry} exists`);
  for (const entry of MEANINGFUL_STATE_ENTRIES)
    if (await hasDirectoryEntries(path.join(params.stateDir, entry)))
      reasons.push(`state ${entry}/ exists`);
  return {
    fresh: reasons.length === 0,
    reasons,
  };
}
/** Preserves the acknowledgement accepted in-memory before the import lock is acquired. */
function preserveSetupMigrationSecurityAcknowledgement(config, inMemoryConfig) {
  const securityAcknowledgedAt = inMemoryConfig.wizard?.securityAcknowledgedAt;
  if (!securityAcknowledgedAt || config.wizard?.securityAcknowledgedAt) return config;
  return {
    ...config,
    wizard: {
      ...config.wizard,
      securityAcknowledgedAt,
    },
  };
}
async function hashTargetPath(hash, candidate, snapshotPath) {
  let stat;
  try {
    stat = await fs$1.lstat(candidate);
  } catch (error) {
    if (isMissingPathError(error)) {
      hash.update(`missing:${snapshotPath}\0`);
      return;
    }
    throw error;
  }
  if (stat.isSymbolicLink()) {
    hash.update(`symlink:${snapshotPath}\0${await fs$1.readlink(candidate)}\0`);
    return;
  }
  if (stat.isDirectory()) {
    hash.update(`directory:${snapshotPath}\0`);
    for (const entry of (await fs$1.readdir(candidate)).toSorted())
      await hashTargetPath(hash, path.join(candidate, entry), `${snapshotPath}/${entry}`);
    return;
  }
  if (stat.isFile()) {
    hash.update(`file:${snapshotPath}\0${stat.size}\0`);
    for await (const chunk of createReadStream(candidate)) hash.update(chunk);
    hash.update("\0");
    return;
  }
  hash.update(`other:${snapshotPath}\0`);
}
async function hashSourcePath(
  hash,
  candidate,
  snapshotPath,
  followedRealPaths = /* @__PURE__ */ new Set(),
) {
  let stat;
  try {
    stat = await fs$1.lstat(candidate);
  } catch (error) {
    if (isMissingPathError(error)) {
      hash.update(`missing:${snapshotPath}\0`);
      return;
    }
    throw error;
  }
  if (stat.isSymbolicLink()) {
    hash.update(`symlink:${snapshotPath}\0${await fs$1.readlink(candidate)}\0`);
    let realPath;
    try {
      realPath = await fs$1.realpath(candidate);
    } catch (error) {
      hash.update(`unresolved:${error.code ?? "unknown"}\0`);
      return;
    }
    if (followedRealPaths.has(realPath)) {
      hash.update(`cycle:${snapshotPath}\0`);
      return;
    }
    followedRealPaths.add(realPath);
    await hashSourcePath(hash, realPath, `${snapshotPath}/referent`, followedRealPaths);
    followedRealPaths.delete(realPath);
    return;
  }
  if (stat.isDirectory()) {
    hash.update(`directory:${snapshotPath}\0`);
    for (const entry of (await fs$1.readdir(candidate)).toSorted())
      await hashSourcePath(
        hash,
        path.join(candidate, entry),
        `${snapshotPath}/${entry}`,
        followedRealPaths,
      );
    return;
  }
  if (stat.isFile()) {
    hash.update(`file:${snapshotPath}\0${stat.size}\0`);
    for await (const chunk of createReadStream(candidate)) hash.update(chunk);
    hash.update("\0");
    return;
  }
  hash.update(`other:${snapshotPath}\0`);
}
/** Hashes migration-owned target state without persisting raw paths or values. */
async function buildSetupMigrationTargetSnapshot(params) {
  const hash = crypto.createHash("sha256");
  const targetConfig = buildSetupMigrationSnapshotConfig(params.config);
  hash.update(`config:${JSON.stringify(canonicalizeJsonValue(targetConfig))}\0`);
  for (const entry of MEANINGFUL_WORKSPACE_ENTRIES)
    await hashTargetPath(hash, path.join(params.workspaceDir, entry), `workspace/${entry}`);
  for (const entry of MEANINGFUL_STATE_ENTRIES)
    await hashTargetPath(hash, path.join(params.stateDir, entry), `state/${entry}`);
  return hash.digest("hex");
}
/** Hashes only source paths represented by the provider's concrete migration plan. */
async function buildSetupMigrationPlanSourceSnapshot(plan) {
  const hash = crypto.createHash("sha256");
  const itemSources = [
    ...new Set(
      plan.items
        .map((item) => item.source?.trim())
        .filter((source) => Boolean(source))
        .map((source) => path.resolve(resolveUserPath(source))),
    ),
  ].toSorted();
  const sources = [
    ...new Set(
      itemSources.flatMap((source) =>
        path.extname(source) === ".db"
          ? [source, `${source}-wal`, `${source}-shm`, `${source}-journal`]
          : [source],
      ),
    ),
  ].toSorted();
  for (const [index, source] of sources.entries())
    await hashSourcePath(hash, source, `source/${index}`);
  return hash.digest("hex");
}
/** Verifies planning inputs and builds the exact provider-side-effect retry boundary. */
async function prepareSetupMigrationAttemptBoundary(params) {
  const currentTargetSnapshotHash = await buildSetupMigrationTargetSnapshot({
    config: params.currentConfig,
    stateDir: params.stateDir,
    workspaceDir: params.workspaceDir,
  });
  if (currentTargetSnapshotHash !== params.expectedTargetSnapshotHash)
    throw new Error("Migration target changed while preparing the import. Review it and retry.");
  const sourceSnapshotHash = await buildSetupMigrationPlanSourceSnapshot(params.plan);
  if (sourceSnapshotHash !== params.expectedSourceSnapshotHash)
    throw new Error("Migration source changed while preparing the import. Review it and retry.");
  return {
    sourceSnapshotHash,
    preparedTargetSnapshotHash: currentTargetSnapshotHash,
    targetSnapshotHash: await buildSetupMigrationTargetSnapshot({
      config: params.targetConfig,
      stateDir: params.stateDir,
      workspaceDir: params.workspaceDir,
    }),
  };
}
/** Serializes all onboarding migration writes that share one OpenClaw state target. */
async function withSetupMigrationTargetLock(stateDir, fn) {
  const migrationDir = path.join(stateDir, "migration");
  await fs$1.mkdir(migrationDir, {
    recursive: true,
    mode: 448,
  });
  return await withFileLock(
    path.join(migrationDir, "onboarding.lock-target"),
    SETUP_MIGRATION_LOCK_OPTIONS,
    fn,
  );
}
function assertFreshSetupMigrationTarget(freshness) {
  if (freshness.fresh || process.env.OPENCLAW_MIGRATION_EXISTING_IMPORT === "1") return;
  throw new Error(
    [
      "Migration import during onboarding requires a fresh OpenClaw setup.",
      "Create a fresh setup or reset config, credentials, sessions, and workspace before importing.",
      "Backup plus overwrite/merge imports are feature-gated for now.",
      "Existing setup:",
      ...freshness.reasons.map((reason) => `- ${reason}`),
    ].join("\n"),
  );
}
//#endregion
//#region src/wizard/setup.migration-import.ts
const loadMigrationProviderRuntimeModule = createLazyRuntimeModule(
  () => import("./migration-provider-runtime-bKQUzE4z.js"),
);
const loadMigrationContextModule = createLazyRuntimeModule(() => import("./context-CWltPO58.js"));
const loadConfigPathsModule = createLazyRuntimeModule(() => import("./paths-DKrK1elB.js"));
async function detectSetupMigrationSources(params) {
  const [
    { ensureStandaloneMigrationProviderRegistryLoaded, resolvePluginMigrationProviders },
    { createMigrationLogger },
    { resolveStateDir },
  ] = await Promise.all([
    loadMigrationProviderRuntimeModule(),
    loadMigrationContextModule(),
    loadConfigPathsModule(),
  ]);
  ensureStandaloneMigrationProviderRegistryLoaded({ cfg: params.config });
  const stateDir = resolveStateDir();
  const logger = createMigrationLogger(params.runtime);
  const detections = [];
  for (const provider of resolvePluginMigrationProviders({ cfg: params.config })) {
    if (!provider.detect) continue;
    try {
      const detection = await provider.detect({
        config: params.config,
        stateDir,
        logger,
      });
      if (detection.found)
        detections.push({
          providerId: provider.id,
          label: detection.label ?? provider.label,
          ...(detection.source ? { source: detection.source } : {}),
          ...(detection.message ? { message: detection.message } : {}),
        });
    } catch (error) {
      logger.debug?.(
        `Migration provider ${provider.id} detection failed: ${formatErrorMessage(error)}`,
      );
    }
  }
  return detections;
}
function resolveImportSourceDefault(params) {
  const detected = params.detections.find(
    (detection) => detection.providerId === params.providerId,
  );
  if (detected?.source) return detected.source;
  return params.providerId === "hermes" ? "~/.hermes" : "";
}
function resolveInstallableSetupMigrationProviders() {
  const providers = [];
  for (const catalogEntry of listOfficialExternalPluginCatalogEntries()) {
    const manifest = getOfficialExternalPluginCatalogManifest(catalogEntry);
    const pluginId = resolveOfficialExternalPluginId(catalogEntry);
    const install = resolveOfficialExternalPluginInstall(catalogEntry);
    if (!pluginId || !install) continue;
    for (const providerId of manifest?.contracts?.migrationProviders ?? [])
      providers.push({
        providerId,
        entry: {
          pluginId,
          label: resolveOfficialExternalPluginLabel(catalogEntry),
          install,
          trustedSourceLinkedOfficialInstall: true,
        },
        ...(catalogEntry.description ? { description: catalogEntry.description } : {}),
      });
  }
  return providers;
}
function formatMigrationProviderId(providerId) {
  return providerId
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
function resolveManifestMigrationProviderLabel(params) {
  return (
    params.pluginName?.trim().replace(/\s+Migration$/i, "") ||
    formatMigrationProviderId(params.providerId) ||
    params.providerId
  );
}
function resolveManifestSetupMigrationProviders(baseConfig) {
  return listAvailableManifestContractPlugins({
    snapshot: loadManifestContractSnapshot({ config: baseConfig }),
    contract: "migrationProviders",
    config: baseConfig,
  }).flatMap((plugin) =>
    (plugin.contracts?.migrationProviders ?? []).map((providerId) => {
      const provider = {
        providerId,
        label: resolveManifestMigrationProviderLabel({
          providerId,
          pluginName: plugin.name,
        }),
      };
      if (plugin.description) provider.description = plugin.description;
      return provider;
    }),
  );
}
async function listSetupMigrationOptions(params) {
  const { resolvePluginMigrationProviders } = await loadMigrationProviderRuntimeModule();
  const providers = resolvePluginMigrationProviders({ cfg: params.baseConfig });
  const options = [];
  const providerIds = /* @__PURE__ */ new Set();
  const addOption = (option) => {
    if (providerIds.has(option.providerId)) return;
    providerIds.add(option.providerId);
    options.push(option);
  };
  for (const detection of params.detections)
    addOption({
      providerId: detection.providerId,
      label: detection.label,
      ...(detection.source || detection.message
        ? { hint: detection.source ?? detection.message }
        : {}),
    });
  for (const provider of providers)
    addOption({
      providerId: provider.id,
      label: provider.label,
      hint: provider.description ?? t("wizard.migration.sourcePathHint"),
    });
  for (const provider of resolveManifestSetupMigrationProviders(params.baseConfig))
    addOption({
      providerId: provider.providerId,
      label: provider.label,
      hint: provider.description ?? t("wizard.migration.sourcePathHint"),
    });
  for (const provider of resolveInstallableSetupMigrationProviders())
    addOption({
      providerId: provider.providerId,
      label: provider.entry.label,
      hint: provider.description ?? t("wizard.migration.sourcePathHint"),
    });
  return options;
}
async function selectSetupMigrationProvider(params) {
  const options = await listSetupMigrationOptions({
    baseConfig: params.baseConfig,
    detections: params.detections,
  });
  if (options.length === 0) throw new Error("No migration providers found.");
  const providerId =
    params.opts.importFrom?.trim() ||
    (await params.prompter.select({
      message: t("wizard.migration.source"),
      options: options.map((option) => ({
        value: option.providerId,
        label: option.label,
        ...(option.hint ? { hint: option.hint } : {}),
      })),
      initialValue: params.detections[0]?.providerId ?? options[0]?.providerId,
    }));
  if (!options.some((option) => option.providerId === providerId))
    throw new Error(`Unknown migration provider "${providerId}".`);
  return providerId;
}
async function resolveSetupMigrationProvider(params) {
  const { ensureStandaloneMigrationProviderRegistryLoaded, resolvePluginMigrationProvider } =
    await loadMigrationProviderRuntimeModule();
  ensureStandaloneMigrationProviderRegistryLoaded({
    cfg: params.baseConfig,
    providerId: params.providerId,
  });
  const existing = resolvePluginMigrationProvider({
    providerId: params.providerId,
    cfg: params.baseConfig,
  });
  if (existing)
    return {
      provider: existing,
      baseConfig: params.baseConfig,
    };
  const installable = resolveInstallableSetupMigrationProviders().find(
    (provider) => provider.providerId === params.providerId,
  );
  if (!installable) throw new Error(`Unknown migration provider "${params.providerId}".`);
  const result = await ensureOnboardingPluginInstalled({
    cfg: params.baseConfig,
    entry: installable.entry,
    prompter: params.prompter,
    runtime: params.runtime,
    workspaceDir: params.workspaceDir,
    promptInstall: false,
  });
  if (!result.installed)
    throw new Error(`Could not install migration provider "${params.providerId}".`);
  ensureStandaloneMigrationProviderRegistryLoaded({
    cfg: result.cfg,
    providerId: params.providerId,
  });
  const provider = resolvePluginMigrationProvider({
    providerId: params.providerId,
    cfg: result.cfg,
  });
  if (!provider)
    throw new Error(`Installed plugin did not register migration provider "${params.providerId}".`);
  return {
    provider,
    baseConfig: result.cfg,
  };
}
function hasCredentialCandidate(plan) {
  return plan.items.some(
    (item) => item.kind === "auth" || item.kind === "secret" || item.sensitive === true,
  );
}
async function createSetupMigrationPlan(params) {
  let ctx = {
    ...params.ctx,
    includeSecrets: params.importSecrets,
  };
  let plan = await params.provider.plan(ctx);
  if (params.nonInteractive || params.importSecrets || !hasCredentialCandidate(plan))
    return {
      ctx,
      plan,
    };
  if (
    !(await params.prompter.confirm({
      message: t("wizard.migration.includeCredentials"),
      initialValue: true,
    }))
  )
    return {
      ctx,
      plan,
    };
  ctx = {
    ...ctx,
    includeSecrets: true,
  };
  plan = await params.provider.plan(ctx);
  return {
    ctx,
    plan,
  };
}
async function runSetupMigrationImport(params) {
  const [
    { applyLocalSetupWorkspaceConfig, applySkipBootstrapConfig },
    { createMigrationLogger, buildMigrationReportDir },
    { createPreMigrationBackup },
    { assertApplySucceeded, assertConflictFreePlan, formatMigrationPreview, formatMigrationResult },
    { resolveStateDir },
    onboardHelpers,
  ] = await Promise.all([
    import("./onboard-config-ClIyTyiX.js"),
    loadMigrationContextModule(),
    import("./apply-XudpUXEA.js"),
    import("./output-SWmp2r59.js"),
    loadConfigPathsModule(),
    import("./onboard-helpers-LaeM9LZm.js"),
  ]);
  const providerId = await selectSetupMigrationProvider({
    opts: params.opts,
    baseConfig: params.baseConfig,
    detections: params.detections,
    prompter: params.prompter,
  });
  const workspaceDir = resolveUserPath(
    (
      params.opts.workspace ??
      (params.opts.nonInteractive
        ? (params.baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE)
        : await params.prompter.text({
            message: t("wizard.migration.targetWorkspace"),
            initialValue:
              params.baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE,
          }))
    ).trim() || onboardHelpers.DEFAULT_WORKSPACE,
  );
  const stateDir = resolveStateDir();
  await withSetupMigrationTargetLock(stateDir, async () => {
    const lockedBaseConfig = preserveSetupMigrationSecurityAcknowledgement(
      await params.readConfigFile(),
      params.baseConfig,
    );
    const initialTargetSnapshotHash = await buildSetupMigrationTargetSnapshot({
      config: lockedBaseConfig,
      stateDir,
      workspaceDir,
    });
    const freshness = await inspectSetupMigrationFreshness({
      baseConfig: lockedBaseConfig,
      stateDir,
      workspaceDir,
    });
    const recoveryState =
      !setupMigrationProviderSupportsRecovery(providerId) ||
      process.env.OPENCLAW_MIGRATION_EXISTING_IMPORT === "1"
        ? { kind: "none" }
        : await resolveSetupMigrationRecovery({
            stateDir,
            providerId,
            workspaceDir,
            targetSnapshotHash: initialTargetSnapshotHash,
          });
    const recoveryAttempt =
      !freshness.fresh && recoveryState.kind === "recoverable" ? recoveryState.attempt : void 0;
    if (!recoveryAttempt) assertFreshSetupMigrationTarget(freshness);
    const resolvedProvider = await resolveSetupMigrationProvider({
      providerId,
      baseConfig: lockedBaseConfig,
      prompter: params.prompter,
      runtime: params.runtime,
      workspaceDir,
    });
    const planningTargetSnapshotHash = await buildSetupMigrationTargetSnapshot({
      config: await params.readConfigFile(),
      stateDir,
      workspaceDir,
    });
    const migrationLogger = createMigrationLogger(params.runtime);
    const selectedDetections = [...params.detections];
    if (
      resolvedProvider.provider.detect &&
      !selectedDetections.some((detection) => detection.providerId === providerId)
    )
      try {
        const detection = await resolvedProvider.provider.detect({
          config: resolvedProvider.baseConfig,
          stateDir,
          logger: migrationLogger,
        });
        if (detection.found)
          selectedDetections.push({
            providerId,
            label: detection.label ?? resolvedProvider.provider.label,
            ...(detection.source ? { source: detection.source } : {}),
            ...(detection.message ? { message: detection.message } : {}),
          });
      } catch (error) {
        migrationLogger.debug?.(
          `Migration provider ${providerId} detection failed: ${formatErrorMessage(error)}`,
        );
      }
    const sourceDefault = resolveImportSourceDefault({
      providerId,
      detections: selectedDetections,
    });
    const sourceDir =
      params.opts.importSource?.trim() ||
      sourceDefault ||
      (params.opts.nonInteractive
        ? (() => {
            throw new Error("--import-source is required for non-interactive migration import.");
          })()
        : await params.prompter.text({
            message: t("wizard.migration.sourceAgentHome"),
            initialValue: providerId === "hermes" ? "~/.hermes" : void 0,
          }));
    const retryingFailedAttempt =
      recoveryAttempt !== void 0 && setupMigrationAttemptMatchesSource(recoveryAttempt, sourceDir);
    if (!retryingFailedAttempt) assertFreshSetupMigrationTarget(freshness);
    else if (planningTargetSnapshotHash !== initialTargetSnapshotHash)
      throw new Error("Migration target changed while preparing the retry. Review it and retry.");
    let targetConfig = applyLocalSetupWorkspaceConfig(resolvedProvider.baseConfig, workspaceDir);
    if (params.opts.skipBootstrap) targetConfig = applySkipBootstrapConfig(targetConfig);
    const initialCtx = {
      config: targetConfig,
      stateDir,
      source: sourceDir,
      overwrite: false,
      logger: migrationLogger,
    };
    const planned = await createSetupMigrationPlan({
      provider: resolvedProvider.provider,
      ctx: initialCtx,
      importSecrets: Boolean(params.opts.importSecrets),
      nonInteractive: Boolean(params.opts.nonInteractive),
      prompter: params.prompter,
    });
    const plannedSourceSnapshotHash = await buildSetupMigrationPlanSourceSnapshot(planned.plan);
    const ctx = planned.ctx;
    const plan =
      retryingFailedAttempt && recoveryAttempt
        ? prepareSetupMigrationRetryPlan(planned.plan, recoveryAttempt, plannedSourceSnapshotHash)
        : planned.plan;
    await params.prompter.note(
      formatMigrationPreview(plan).join("\n"),
      t("wizard.migration.previewTitle"),
    );
    assertConflictFreePlan(plan, providerId);
    if (
      !(params.opts.nonInteractive === true
        ? true
        : await params.prompter.confirm({
            message: t("wizard.migration.apply"),
            initialValue: true,
          }))
    )
      throw new WizardCancelledError(t("wizard.migration.cancelled"));
    const reportDir = buildMigrationReportDir(providerId, stateDir);
    const backupPath = await createPreMigrationBackup({});
    targetConfig = onboardHelpers.applyWizardMetadata(targetConfig, {
      command: "onboard",
      mode: "local",
    });
    const boundary = await prepareSetupMigrationAttemptBoundary({
      currentConfig: await params.readConfigFile(),
      targetConfig,
      stateDir,
      workspaceDir,
      plan: planned.plan,
      expectedTargetSnapshotHash: planningTargetSnapshotHash,
      expectedSourceSnapshotHash: plannedSourceSnapshotHash,
    });
    const withReport = await runSetupMigrationAttempt({
      reportDir,
      attempt: createSetupMigrationAttempt({
        providerId,
        source: sourceDir,
        workspaceDir,
        plan,
        sourceSnapshotHash: boundary.sourceSnapshotHash,
        preparedTargetSnapshotHash: boundary.preparedTargetSnapshotHash,
        targetSnapshotHash: boundary.targetSnapshotHash,
        ...(recoveryAttempt ? { previousAttempt: recoveryAttempt } : {}),
      }),
      assertSucceeded: assertApplySucceeded,
      async readTargetSnapshot() {
        return await buildSetupMigrationTargetSnapshot({
          config: await params.readConfigFile(),
          stateDir,
          workspaceDir,
        });
      },
      async apply() {
        targetConfig = await params.commitConfigFile(targetConfig);
        const result = await resolvedProvider.provider.apply(
          {
            ...ctx,
            config: targetConfig,
            ...(backupPath ? { backupPath } : {}),
            reportDir,
          },
          plan,
        );
        return {
          ...result,
          ...((result.backupPath ?? backupPath)
            ? { backupPath: result.backupPath ?? backupPath }
            : {}),
          reportDir: result.reportDir ?? reportDir,
        };
      },
    });
    await params.prompter.note(
      formatMigrationResult(withReport).join("\n"),
      t("wizard.migration.appliedTitle"),
    );
    if (params.continueOnboarding)
      await params.prompter.note(
        t("wizard.migration.continuing"),
        t("wizard.migration.appliedTitle"),
      );
    else await params.prompter.outro(t("wizard.migration.complete"));
  });
}
//#endregion
export {
  listSetupMigrationOptions as n,
  runSetupMigrationImport as r,
  detectSetupMigrationSources as t,
};
