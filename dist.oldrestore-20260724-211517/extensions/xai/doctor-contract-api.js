import { l as isLegacyXaiBuiltinModel } from "../../model-definitions-BoOPeWPv.js";
//#region extensions/xai/doctor-contract-api.ts
const RETIRED_REASONING_MODELS = /* @__PURE__ */ new Set([
  "grok-4-1-fast",
  "grok-4-1-fast-reasoning",
  "grok-4-fast",
  "grok-4-fast-reasoning",
  "grok-4-0709",
]);
const RETIRED_NON_REASONING_MODELS = /* @__PURE__ */ new Set([
  "grok-4-1-fast-non-reasoning",
  "grok-4-fast-non-reasoning",
  "grok-3",
]);
const RETIRED_CODE_MODELS = /* @__PURE__ */ new Set([
  "grok-code-fast-1",
  "grok-code-fast",
  "grok-code-fast-1-0825",
]);
const PLUGIN_MODEL_MIGRATIONS = [
  {
    path: ["plugins", "entries", "xai", "config", "webSearch"],
    retiredModels: RETIRED_REASONING_MODELS,
    targetModel: "grok-4.3",
  },
  {
    path: ["plugins", "entries", "xai", "config", "codeExecution"],
    retiredModels: RETIRED_REASONING_MODELS,
    targetModel: "grok-4.3",
  },
  {
    path: ["plugins", "entries", "xai", "config", "xSearch"],
    retiredModels: RETIRED_NON_REASONING_MODELS,
    targetModel: "grok-4.3",
  },
  ...[
    ["plugins", "entries", "xai", "config", "webSearch"],
    ["plugins", "entries", "xai", "config", "codeExecution"],
    ["plugins", "entries", "xai", "config", "xSearch"],
  ].map((path) => ({
    path,
    retiredModels: RETIRED_CODE_MODELS,
    targetModel: "grok-build-0.1",
  })),
];
const XAI_STT_MODEL_LIST_PATHS = [
  ["tools", "media", "models"],
  ["tools", "media", "audio", "models"],
];
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readPath(root, path) {
  let current = root;
  for (const segment of path) {
    current = asRecord(current)?.[segment];
    if (current === void 0) return;
  }
  return current;
}
function isRetiredToolModel(value, retiredModels) {
  const model = asRecord(value)?.model;
  return typeof model === "string" && retiredModels.has(model.trim().toLowerCase());
}
function hasLegacyBuiltinCatalogRows(value) {
  return Array.isArray(value) && value.some((model) => isLegacyXaiBuiltinModel(model));
}
function isLegacyXaiSttEntry(value) {
  const entry = asRecord(value);
  if (!entry || (entry.type !== void 0 && entry.type !== "provider")) return false;
  return (
    typeof entry.provider === "string" &&
    entry.provider.trim().toLowerCase() === "xai" &&
    typeof entry.model === "string" &&
    entry.model.trim().toLowerCase() === "grok-stt"
  );
}
function hasLegacyXaiSttEntries(value) {
  return Array.isArray(value) && value.some(isLegacyXaiSttEntry);
}
const legacyConfigRules = [
  ...PLUGIN_MODEL_MIGRATIONS.map((migration) => ({
    path: migration.path,
    message: `${migration.path.join(".")}.model uses a retired xAI model; run "openclaw doctor --fix" to use ${migration.targetModel}.`,
    match: (value) => isRetiredToolModel(value, migration.retiredModels),
  })),
  ...XAI_STT_MODEL_LIST_PATHS.map((path) => ({
    path: [...path],
    message: `${path.join(".")} contains the obsolete xAI grok-stt model selector; run "openclaw doctor --fix" to remove it.`,
    match: hasLegacyXaiSttEntries,
  })),
  {
    path: ["models", "providers", "xai", "models"],
    message:
      'models.providers.xai.models contains stale generated xAI catalog rows; run "openclaw doctor --fix" to remove them.',
    match: hasLegacyBuiltinCatalogRows,
  },
];
function normalizeCompatibilityConfig({ cfg }) {
  let next = cfg;
  const changes = [];
  for (const migration of PLUGIN_MODEL_MIGRATIONS) {
    if (!isRetiredToolModel(readPath(next, migration.path), migration.retiredModels)) continue;
    if (next === cfg) next = structuredClone(cfg);
    const target = asRecord(readPath(next, migration.path));
    if (!target) continue;
    const previous = target.model;
    target.model = migration.targetModel;
    changes.push(
      `Updated ${migration.path.join(".")}.model from ${JSON.stringify(previous)} to ${JSON.stringify(migration.targetModel)}.`,
    );
  }
  for (const path of XAI_STT_MODEL_LIST_PATHS) {
    if (!hasLegacyXaiSttEntries(readPath(next, path))) continue;
    if (next === cfg) next = structuredClone(cfg);
    const entries = readPath(next, path);
    if (!Array.isArray(entries)) continue;
    let removed = 0;
    for (const entry of entries) {
      if (!isLegacyXaiSttEntry(entry)) continue;
      delete asRecord(entry)?.model;
      removed += 1;
    }
    changes.push(
      `Removed the obsolete xAI grok-stt model selector from ${removed} ${path.join(".")} entr${removed === 1 ? "y" : "ies"}.`,
    );
  }
  if (hasLegacyBuiltinCatalogRows(readPath(next, ["models", "providers", "xai", "models"]))) {
    if (next === cfg) next = structuredClone(cfg);
    const provider = asRecord(readPath(next, ["models", "providers", "xai"]));
    const models = provider?.models;
    if (provider && Array.isArray(models)) {
      const retained = models.filter((model) => !isLegacyXaiBuiltinModel(model));
      const removed = models.length - retained.length;
      provider.models = retained;
      changes.push(`Removed ${removed} stale generated xAI model catalog row(s).`);
    }
  }
  return {
    config: next,
    changes,
  };
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
