import fs from "node:fs/promises";
import path from "node:path";
import "./src-Bl7G9qvi.js";
import { t as backupCreateCommand } from "./backup-BYiKBXxC.js";
import { n as buildMigrationReportDir, t as buildMigrationContext } from "./context-BGEpgE3X.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./config-BDv-QbJ6.js";
import {
  d as markMigrationItemSkipped,
  v as summarizeMigrationItems,
} from "./migration-nGWjmzKy.js";
import {
  n as resolvePluginMigrationProvider,
  r as resolvePluginMigrationProviders,
  t as ensureStandaloneMigrationProviderRegistryLoaded,
} from "./migration-provider-runtime-DDSe3_1R.js";
import {
  n as assertApplySucceeded,
  o as writeApplyResult,
  r as assertConflictFreePlan,
  t as MIGRATION_CONFLICT_REASON_PHRASES,
} from "./output-DimZw5en.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { r as withProgress } from "./progress-DXZjrYcT.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
//#region src/commands/migrate/item-selection.ts
/** Exact migration item selection for embedded and non-interactive callers. */
const MIGRATION_NOT_SELECTED_REASON$1 = "not selected for migration";
function formatSelectionRefList$1(values) {
  return values.length === 0 ? "none" : values.map((value) => `"${value}"`).join(", ");
}
/** Applies an exact item-id selection to planned/conflicting migration items. */
function applyMigrationItemSelection(plan, selectedItemIds) {
  if (selectedItemIds === void 0) return plan;
  const selectable = plan.items.filter(
    (item) => item.status === "planned" || item.status === "conflict",
  );
  const selectableIds = new Set(selectable.map((item) => item.id));
  const unknown = uniqueStrings(selectedItemIds).filter((id) => !selectableIds.has(id));
  if (unknown.length > 0)
    throw new Error(
      `Unknown or unavailable migration item ids: ${formatSelectionRefList$1(unknown)}.`,
    );
  const selected = new Set(selectedItemIds);
  const items = plan.items.map((item) =>
    selectableIds.has(item.id) && !selected.has(item.id)
      ? markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON$1)
      : item,
  );
  return {
    ...plan,
    items,
    summary: summarizeMigrationItems(items),
  };
}
//#endregion
//#region src/commands/migrate/providers.ts
/** Migration provider lookup, option shaping, and plan creation helpers. */
/** Resolves a migration provider from the loaded plugin migration registry. */
function resolveMigrationProvider(providerId, config = getRuntimeConfig()) {
  ensureStandaloneMigrationProviderRegistryLoaded({
    cfg: config,
    providerId,
  });
  const provider = resolvePluginMigrationProvider({
    providerId,
    cfg: config,
  });
  if (!provider) {
    const available = resolvePluginMigrationProviders({ cfg: config }).map((entry) => entry.id);
    const suffix =
      available.length > 0
        ? ` Available providers: ${available.join(", ")}.`
        : " No providers found.";
    throw new Error(`Unknown migration provider "${providerId}".${suffix}`);
  }
  return provider;
}
/** Builds provider-specific options from shared migrate CLI flags. */
function buildMigrationProviderOptions(opts, providerId = opts.provider) {
  const options = {};
  if (providerId === "codex" && opts.verifyPluginApps === true) options.verifyPluginApps = true;
  if (providerId === "codex" && opts.configPatchMode)
    options.configPatchMode = opts.configPatchMode;
  return Object.keys(options).length > 0 ? options : void 0;
}
/** Creates a migration plan after validating provider-specific flag support. */
async function createMigrationPlan(runtime, opts) {
  if (opts.verifyPluginApps && opts.provider !== "codex")
    throw new Error("--verify-plugin-apps is only supported for Codex migrations.");
  const provider = resolveMigrationProvider(opts.provider, opts.configOverride);
  const ctx = buildMigrationContext({
    source: opts.source,
    targetAgentId: opts.targetAgentId,
    itemKinds: opts.itemKinds,
    includeSecrets: opts.includeSecrets,
    overwrite: opts.overwrite,
    configOverride: opts.configOverride,
    providerOptions: buildMigrationProviderOptions(opts),
    runtime,
    json: opts.json,
  });
  return await provider.plan(ctx);
}
//#endregion
//#region src/commands/migrate/selection.ts
/** Selection helpers for filtering migration plan items before apply. */
const MIGRATION_NOT_SELECTED_REASON = "not selected for migration";
const MIGRATION_SELECTION_ACCEPT = "__openclaw_migrate_accept_recommended__";
const MIGRATION_SELECTION_TOGGLE_ALL_ON = "__openclaw_migrate_toggle_all_on__";
const MIGRATION_SELECTION_TOGGLE_ALL_OFF = "__openclaw_migrate_toggle_all_off__";
function normalizeSelectionRef(value) {
  return value.trim().toLowerCase();
}
function readMigrationSkillName(item) {
  return normalizeOptionalString(item.details?.skillName);
}
function readMigrationSkillSourceLabel(item) {
  return normalizeOptionalString(item.details?.sourceLabel);
}
function readMigrationPluginName(item) {
  return normalizeOptionalString(item.details?.pluginName);
}
function readMigrationPluginConfigKey(item) {
  return normalizeOptionalString(item.details?.configKey);
}
function readMigrationPluginMarketplaceName(item) {
  return normalizeOptionalString(item.details?.marketplaceName);
}
function migrationSkillRefs(item) {
  const skillName = readMigrationSkillName(item);
  const idSuffix = item.id.startsWith("skill:") ? item.id.slice(6) : void 0;
  const sourceBase = item.source ? path.basename(item.source) : void 0;
  const targetBase = item.target ? path.basename(item.target) : void 0;
  return [item.id, idSuffix, skillName, sourceBase, targetBase].filter(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
}
function migrationPluginRefs(item) {
  const pluginName = readMigrationPluginName(item);
  const configKey = readMigrationPluginConfigKey(item);
  const idSuffix = item.id.startsWith("plugin:") ? item.id.slice(7) : void 0;
  const sourceBase = item.source ? path.basename(item.source) : void 0;
  const targetBase = item.target ? path.basename(item.target) : void 0;
  return [item.id, idSuffix, pluginName, configKey, sourceBase, targetBase].filter(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
}
function formatSelectionRefList(values) {
  if (values.length === 0) return "none";
  return values.map((value) => `"${value}"`).join(", ");
}
function buildSelectionIndex(items, refsForItem) {
  const index = /* @__PURE__ */ new Map();
  for (const item of items)
    for (const ref of refsForItem(item)) {
      const normalized = normalizeSelectionRef(ref);
      if (!normalized) continue;
      const existing = index.get(normalized) ?? /* @__PURE__ */ new Set();
      existing.add(item.id);
      index.set(normalized, existing);
    }
  return index;
}
function resolveSelectedMigrationItemIds(params) {
  const index = buildSelectionIndex(params.items, params.refsForItem);
  const selectedIds = /* @__PURE__ */ new Set();
  const unknownRefs = [];
  const ambiguousRefs = [];
  for (const ref of params.selectedRefs) {
    const normalized = normalizeSelectionRef(ref);
    if (!normalized) continue;
    const matches = index.get(normalized);
    if (!matches) {
      unknownRefs.push(ref);
      continue;
    }
    if (matches.size > 1) {
      ambiguousRefs.push(ref);
      continue;
    }
    const [id] = matches;
    if (id) selectedIds.add(id);
  }
  if (unknownRefs.length > 0 || ambiguousRefs.length > 0) {
    const available = params.items
      .map(params.formatSelectionLabel)
      .toSorted((a, b) => a.localeCompare(b));
    const titleKind =
      expectDefined(params.kindLabel[0], "kind label entry at 0").toUpperCase() +
      params.kindLabel.slice(1);
    const parts = [];
    if (unknownRefs.length > 0)
      parts.push(
        `No migratable ${params.kindLabel} matched ${formatSelectionRefList(unknownRefs)}.`,
      );
    if (ambiguousRefs.length > 0)
      parts.push(`${titleKind} selection ${formatSelectionRefList(ambiguousRefs)} was ambiguous.`);
    parts.push(
      `Available ${params.availableLabel}: ${available.length > 0 ? available.join(", ") : "none"}.`,
    );
    throw new Error(parts.join(" "));
  }
  return selectedIds;
}
function resolveSelectedSkillItemIds(items, selectedRefs) {
  return resolveSelectedMigrationItemIds({
    items,
    selectedRefs,
    refsForItem: migrationSkillRefs,
    formatSelectionLabel: formatMigrationSkillSelectionLabel,
    kindLabel: "skill",
    availableLabel: "skills",
  });
}
function resolveSelectedPluginItemIds(items, selectedRefs) {
  return resolveSelectedMigrationItemIds({
    items,
    selectedRefs,
    refsForItem: migrationPluginRefs,
    formatSelectionLabel: formatMigrationPluginSelectionLabel,
    kindLabel: "plugin",
    availableLabel: "plugins",
  });
}
/** Returns skill copy items that can still be selected or deselected. */
function getSelectableMigrationSkillItems(plan) {
  return plan.items.filter(
    (item) =>
      item.kind === "skill" &&
      item.action === "copy" &&
      (item.status === "planned" || item.status === "conflict"),
  );
}
/** Returns plugin install items that can still be selected or deselected. */
function getSelectableMigrationPluginItems(plan) {
  return plan.items.filter(
    (item) =>
      item.kind === "plugin" &&
      item.action === "install" &&
      (item.status === "planned" || item.status === "conflict"),
  );
}
/** Returns the stable checkbox value for a skill migration item. */
function getMigrationSkillSelectionValue(item) {
  return item.id;
}
/** Returns the stable checkbox value for a plugin migration item. */
function getMigrationPluginSelectionValue(item) {
  return item.id;
}
/** Formats the visible label for a plugin migration checkbox. */
function formatMigrationPluginSelectionLabel(item) {
  return readMigrationPluginName(item) ?? item.id.replace(/^plugin:/u, "");
}
/** Defaults skill selection to planned items only. */
function getDefaultMigrationSkillSelectionValues(items) {
  return items.filter((item) => item.status === "planned").map(getMigrationSkillSelectionValue);
}
/** Defaults plugin selection to planned items only. */
function getDefaultMigrationPluginSelectionValues(items) {
  return items.filter((item) => item.status === "planned").map(getMigrationPluginSelectionValue);
}
/** Formats the visible label for a skill migration checkbox. */
function formatMigrationSkillSelectionLabel(item) {
  return readMigrationSkillName(item) ?? item.id.replace(/^skill:/u, "");
}
function humanizeMigrationConflictReason(reason) {
  if (!reason) return "conflict";
  return MIGRATION_CONFLICT_REASON_PHRASES[reason] ?? reason;
}
/** Formats conflict helper text for a skill migration checkbox. */
function formatMigrationSkillSelectionHint(item) {
  if (item.status !== "conflict") return;
  const sourceLabel = readMigrationSkillSourceLabel(item);
  const reason = humanizeMigrationConflictReason(item.reason);
  return sourceLabel ? `${sourceLabel} ${reason}` : reason;
}
/** Formats conflict helper text for a plugin migration checkbox. */
function formatMigrationPluginSelectionHint(item) {
  if (item.status !== "conflict") return;
  const marketplace = readMigrationPluginMarketplaceName(item);
  const reason = humanizeMigrationConflictReason(item.reason);
  return marketplace ? `${marketplace} plugin ${reason}` : reason;
}
/** Marks unselected selectable skill items as skipped and recomputes plan summary. */
function applyMigrationSelectedSkillItemIds(plan, selectedItemIds) {
  const selectableIds = new Set(getSelectableMigrationSkillItems(plan).map((item) => item.id));
  const items = plan.items.map((item) => {
    if (!selectableIds.has(item.id) || selectedItemIds.has(item.id)) return item;
    return markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON);
  });
  return {
    ...plan,
    items,
    summary: summarizeMigrationItems(items),
  };
}
/** Applies skill refs passed by CLI flags to a migration plan. */
function applyMigrationSkillSelection(plan, selectedSkillRefs) {
  if (selectedSkillRefs === void 0) return plan;
  return applyMigrationSelectedSkillItemIds(
    plan,
    resolveSelectedSkillItemIds(getSelectableMigrationSkillItems(plan), selectedSkillRefs),
  );
}
/** Applies plugin refs passed by CLI flags to a migration plan. */
function applyMigrationPluginSelection(plan, selectedPluginRefs) {
  if (selectedPluginRefs === void 0) return plan;
  return applyMigrationSelectedPluginItemIds(
    plan,
    resolveSelectedPluginItemIds(getSelectableMigrationPluginItems(plan), selectedPluginRefs),
  );
}
/** Marks unselected plugin items skipped and filters matching Codex plugin config writes. */
function applyMigrationSelectedPluginItemIds(plan, selectedItemIds) {
  const selectable = getSelectableMigrationPluginItems(plan);
  const selectableIds = new Set(selectable.map((item) => item.id));
  const selectedConfigKeys = new Set(
    selectable
      .filter((item) => selectedItemIds.has(item.id))
      .map(readMigrationPluginConfigKey)
      .filter((value) => value !== void 0),
  );
  const items = plan.items.map((item) => {
    if (isCodexPluginConfigItem(item))
      return applyCodexPluginConfigSelection(item, selectedConfigKeys);
    if (!selectableIds.has(item.id) || selectedItemIds.has(item.id)) return item;
    return markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON);
  });
  return {
    ...plan,
    items,
    summary: summarizeMigrationItems(items),
  };
}
function isCodexPluginConfigItem(item) {
  if (item.kind !== "config" || item.action !== "merge") return false;
  const value = item.details?.value;
  if (!isRecord(value)) return false;
  const config = value.config;
  if (!isRecord(config)) return false;
  const codexPlugins = config.codexPlugins;
  if (!isRecord(codexPlugins)) return false;
  return isRecord(codexPlugins.plugins);
}
function applyCodexPluginConfigSelection(item, selectedConfigKeys) {
  const value = item.details?.value;
  if (!isRecord(value)) return item;
  const config = value.config;
  if (!isRecord(config)) return item;
  const codexPlugins = config.codexPlugins;
  if (!isRecord(codexPlugins) || !isRecord(codexPlugins.plugins)) return item;
  const plugins = Object.fromEntries(
    Object.entries(codexPlugins.plugins).filter(([configKey]) => selectedConfigKeys.has(configKey)),
  );
  if (Object.keys(plugins).length === 0)
    return markMigrationItemSkipped(item, MIGRATION_NOT_SELECTED_REASON);
  return {
    ...item,
    details: {
      ...item.details,
      value: {
        ...value,
        config: {
          ...config,
          codexPlugins: {
            ...codexPlugins,
            plugins,
          },
        },
      },
    },
  };
}
function resolveInteractiveMigrationSelection(items, selectedValues, getSelectionValue) {
  const selectableIds = new Set(items.map(getSelectionValue));
  const selectedItemIds = new Set(selectedValues.filter((value) => selectableIds.has(value)));
  if (selectedItemIds.size > 0)
    return {
      action: "select",
      selectedItemIds,
    };
  const selectedValueSet = new Set(selectedValues);
  if (selectedValueSet.has("__openclaw_migrate_toggle_all_off__"))
    return {
      action: "select",
      selectedItemIds: /* @__PURE__ */ new Set(),
    };
  if (selectedValueSet.has("__openclaw_migrate_toggle_all_on__"))
    return {
      action: "select",
      selectedItemIds: selectableIds,
    };
  return {
    action: "select",
    selectedItemIds,
  };
}
function isMigrationSelectionToggleValue(value) {
  return (
    value === "__openclaw_migrate_toggle_all_on__" ||
    value === "__openclaw_migrate_toggle_all_off__"
  );
}
function selectedMigrationItemValues(selectedValues) {
  return selectedValues.filter((value) => !isMigrationSelectionToggleValue(value));
}
function resolveMigrationSelectionBulkToggleValues(activatedValue, selectableValues) {
  if (activatedValue === "__openclaw_migrate_toggle_all_on__")
    return [MIGRATION_SELECTION_TOGGLE_ALL_ON, ...selectableValues];
  if (activatedValue === "__openclaw_migrate_toggle_all_off__")
    return [MIGRATION_SELECTION_TOGGLE_ALL_OFF];
}
/** Resolves checkbox values into selected skill migration item ids. */
function resolveInteractiveMigrationSkillSelection(items, selectedValues) {
  return resolveInteractiveMigrationSelection(
    items,
    selectedValues,
    getMigrationSkillSelectionValue,
  );
}
/** Resolves checkbox values into selected plugin migration item ids. */
function resolveInteractiveMigrationPluginSelection(items, selectedValues) {
  return resolveInteractiveMigrationSelection(
    items,
    selectedValues,
    getMigrationPluginSelectionValue,
  );
}
/** Reconciles all/none checkbox toggles for the skill-selection prompt. */
function reconcileInteractiveMigrationSkillToggleValues(
  selectedValues,
  activatedValue,
  selectableValues,
) {
  const bulkValues = resolveMigrationSelectionBulkToggleValues(activatedValue, selectableValues);
  if (bulkValues !== void 0) return bulkValues;
  if (activatedValue !== void 0 && selectableValues.includes(activatedValue))
    return selectedMigrationItemValues(selectedValues);
  return selectedValues.filter(
    (value) =>
      value !== "__openclaw_migrate_toggle_all_on__" ||
      !selectedValues.includes("__openclaw_migrate_toggle_all_off__"),
  );
}
/** Reconciles Enter-key selection behavior for interactive migration prompts. */
function reconcileInteractiveMigrationEnterValues(
  selectedValues,
  activatedValue,
  selectableValues,
  opts = {},
) {
  const bulkValues = resolveMigrationSelectionBulkToggleValues(activatedValue, selectableValues);
  if (bulkValues !== void 0) return bulkValues;
  if (activatedValue !== void 0 && selectableValues.includes(activatedValue)) {
    const selectedSelectableValues = selectedMigrationItemValues(selectedValues);
    if (opts.preserveDeselectedActivatedValue && !selectedValues.includes(activatedValue))
      return selectedSelectableValues;
    return uniqueStrings([...selectedSelectableValues, activatedValue]);
  }
  return [...selectedValues];
}
/** Reconciles keyboard shortcuts for all/none migration prompt selections. */
function reconcileInteractiveMigrationShortcutValues(
  previousValues,
  selectedValues,
  selectableValues,
  key,
) {
  const previousSelectable = previousValues.filter((value) => selectableValues.includes(value));
  if (key === "a" && previousSelectable.length === selectableValues.length)
    return [MIGRATION_SELECTION_TOGGLE_ALL_OFF];
  const selectedSelectable = selectedValues.filter((value) => selectableValues.includes(value));
  if (selectedSelectable.length === selectableValues.length)
    return [MIGRATION_SELECTION_TOGGLE_ALL_ON, ...selectableValues];
  if (selectedSelectable.length === 0) return [MIGRATION_SELECTION_TOGGLE_ALL_OFF];
  return selectedSelectable;
}
//#endregion
//#region src/commands/migrate/apply.ts
/** Applies migration plans with backup, filtering, reporting, and progress output. */
function shouldTreatMissingBackupAsEmptyState(error) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("No local OpenClaw state was found to back up") ||
    message.includes("No OpenClaw config file was found to back up")
  );
}
/** Creates a verified pre-migration backup, treating absent local state as empty. */
async function createPreMigrationBackup(opts) {
  try {
    return (
      await backupCreateCommand(
        {
          log() {},
          error() {},
          exit(code) {
            throw new Error(`backup exited with ${code}`);
          },
        },
        {
          output: opts.output,
          verify: true,
        },
      )
    ).archivePath;
  } catch (err) {
    if (shouldTreatMissingBackupAsEmptyState(err)) return;
    throw err;
  }
}
/** Applies the selected migration provider plan and writes the final result. */
async function runMigrationApply(params) {
  const applyMigration = async (progress) => {
    const total = (params.opts.preflightPlan ? 0 : 1) + (params.opts.noBackup ? 0 : 1) + 1;
    let completed = 0;
    const tick = () => {
      completed += 1;
      progress?.setPercent((completed / total) * 100);
    };
    if (!params.opts.preflightPlan) progress?.setLabel("Preparing migration plan…");
    const preflightPlan =
      params.opts.preflightPlan ??
      (await params.provider.plan(
        buildMigrationContext({
          source: params.opts.source,
          targetAgentId: params.opts.targetAgentId,
          itemKinds: params.opts.itemKinds,
          includeSecrets: params.opts.includeSecrets,
          overwrite: params.opts.overwrite,
          configOverride: params.opts.configOverride,
          providerOptions: buildMigrationProviderOptions(params.opts, params.providerId),
          runtime: params.runtime,
          json: params.opts.json,
        }),
      ));
    if (!params.opts.preflightPlan) tick();
    const selectedPlan = applyMigrationItemSelection(
      applyMigrationPluginSelection(
        applyMigrationSkillSelection(preflightPlan, params.opts.skills),
        params.opts.plugins,
      ),
      params.opts.itemIds,
    );
    assertConflictFreePlan(selectedPlan, params.providerId);
    const stateDir = resolveStateDir();
    const reportDir = buildMigrationReportDir(params.providerId, stateDir);
    if (!params.opts.noBackup) progress?.setLabel("Preparing migration backup…");
    const backupPath = params.opts.noBackup
      ? void 0
      : await createPreMigrationBackup({ output: params.opts.backupOutput });
    if (!params.opts.noBackup) tick();
    await fs.mkdir(reportDir, { recursive: true });
    const ctx = buildMigrationContext({
      source: params.opts.source,
      targetAgentId: params.opts.targetAgentId,
      itemKinds: params.opts.itemKinds,
      includeSecrets: params.opts.includeSecrets,
      overwrite: params.opts.overwrite,
      configOverride: params.opts.configOverride,
      providerOptions: buildMigrationProviderOptions(params.opts, params.providerId),
      runtime: params.runtime,
      backupPath,
      reportDir,
      json: params.opts.json,
    });
    progress?.setLabel("Applying migration…");
    const result = await params.provider.apply(ctx, selectedPlan);
    tick();
    return {
      ...result,
      backupPath: result.backupPath ?? backupPath,
      reportDir: result.reportDir ?? reportDir,
    };
  };
  const withBackup = params.opts.json
    ? await applyMigration()
    : await withProgress(
        { label: `Applying ${params.providerId} migration…` },
        async (progress) => await applyMigration(progress),
      );
  writeApplyResult(params.runtime, params.opts, withBackup);
  if (!params.opts.allowPartialResult) assertApplySucceeded(withBackup);
  return withBackup;
}
//#endregion
export {
  resolveInteractiveMigrationPluginSelection as C,
  resolveMigrationProvider as E,
  reconcileInteractiveMigrationSkillToggleValues as S,
  createMigrationPlan as T,
  getMigrationSkillSelectionValue as _,
  MIGRATION_SELECTION_TOGGLE_ALL_ON as a,
  reconcileInteractiveMigrationEnterValues as b,
  applyMigrationSelectedSkillItemIds as c,
  formatMigrationPluginSelectionLabel as d,
  formatMigrationSkillSelectionHint as f,
  getMigrationPluginSelectionValue as g,
  getDefaultMigrationSkillSelectionValues as h,
  MIGRATION_SELECTION_TOGGLE_ALL_OFF as i,
  applyMigrationSkillSelection as l,
  getDefaultMigrationPluginSelectionValues as m,
  runMigrationApply as n,
  applyMigrationPluginSelection as o,
  formatMigrationSkillSelectionLabel as p,
  MIGRATION_SELECTION_ACCEPT as r,
  applyMigrationSelectedPluginItemIds as s,
  createPreMigrationBackup as t,
  formatMigrationPluginSelectionHint as u,
  getSelectableMigrationPluginItems as v,
  resolveInteractiveMigrationSkillSelection as w,
  reconcileInteractiveMigrationShortcutValues as x,
  getSelectableMigrationSkillItems as y,
};
