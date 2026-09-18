import { createHash } from "node:crypto";
import "../../number-runtime-B-n-wjMn.js";
import fs from "node:fs";
import path from "node:path";
import { P as timestampMsToIsoString } from "../../number-coercion-CJQ8TR--.js";
import { u as normalizeProviderId } from "../../provider-model-shared-CYlCpWlu.js";
import {
  a as THREAD_BINDINGS_MAX_ENTRIES,
  f as normalizePersistedBinding,
  j as toBindingRecordKey,
  o as THREAD_BINDINGS_NAMESPACE,
} from "../../thread-bindings.state-Da_kQ-2B.js";
//#region extensions/discord/src/monitor/model-picker-preferences-migrations.ts
const PREFERENCE_MAX_ENTRIES = 2e3;
const MAX_PLUGIN_STATE_KEY_BYTES = 512;
const textEncoder = new TextEncoder();
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}
function readLegacyStore(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
function readLegacyThreadBindingsStore(filePath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!parsed || typeof parsed !== "object")
    throw new Error("legacy Discord thread bindings store must be an object");
  return parsed;
}
function normalizeLegacyPreferenceKey(key) {
  const trimmed = key.trim();
  if (!trimmed || textEncoder.encode(trimmed).length > MAX_PLUGIN_STATE_KEY_BYTES) return;
  return trimmed;
}
function normalizeModelRef(raw) {
  const value = raw?.trim();
  if (!value) return null;
  const slashIndex = value.indexOf("/");
  if (slashIndex <= 0 || slashIndex >= value.length - 1) return null;
  const provider = normalizeProviderId(value.slice(0, slashIndex));
  const model = value.slice(slashIndex + 1).trim();
  return provider && model ? `${provider}/${model}` : null;
}
function sanitizeRecentModels(models, limit) {
  const deduped = [];
  const seen = /* @__PURE__ */ new Set();
  if (!Array.isArray(models)) return deduped;
  for (const item of models) {
    const normalized = normalizeModelRef(typeof item === "string" ? item : void 0);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    deduped.push(normalized);
    if (deduped.length >= limit) break;
  }
  return deduped;
}
function hashSegment(value, length) {
  return createHash("sha256").update(value, "utf8").digest("hex").slice(0, length);
}
function buildPreferenceModelKey(scopeKey, modelRef) {
  return `v1:${hashSegment(scopeKey, 32)}:${hashSegment(modelRef, 24)}`;
}
function timestampMs(value) {
  const parsed = typeof value === "string" ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}
function legacyUpdatedAtForIndex(updatedAt, index, total) {
  const baseMs = timestampMs(updatedAt);
  return (
    timestampMsToIsoString(Math.min(baseMs + Math.max(0, total), 864e13) - Math.max(0, index)) ??
    timestampMsToIsoString(baseMs) ??
    timestampMsToIsoString(Math.max(0, total - index)) ??
    "1970-01-01T00:00:00.000Z"
  );
}
function readFiniteNumberField(entry, key) {
  const value = entry[key];
  return typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : void 0;
}
function upgradeLegacyThreadBindingShape(rawEntry) {
  if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) return rawEntry;
  const entry = { ...rawEntry };
  if (entry.targetSessionKey === void 0 && typeof entry.sessionKey === "string")
    entry.targetSessionKey = entry.sessionKey;
  delete entry.sessionKey;
  const expiresAt = readFiniteNumberField(entry, "expiresAt");
  delete entry.expiresAt;
  if (entry.idleTimeoutMs === void 0 && entry.maxAgeMs === void 0 && expiresAt !== void 0) {
    entry.idleTimeoutMs = 0;
    if (expiresAt <= 0) entry.maxAgeMs = 0;
    else {
      const boundAt = readFiniteNumberField(entry, "boundAt") ?? 0;
      const lastActivityAt = readFiniteNumberField(entry, "lastActivityAt") ?? 0;
      entry.maxAgeMs = Math.max(1, expiresAt - Math.max(0, boundAt > 0 ? boundAt : lastActivityAt));
    }
  }
  return entry;
}
const detectDiscordLegacyStateMigrations = ({ stateDir }) => {
  const plans = [];
  const modelPickerSourcePath = path.join(stateDir, "discord", "model-picker-preferences.json");
  if (fileExists(modelPickerSourcePath))
    plans.push({
      kind: "plugin-state-import",
      label: "Discord model picker preferences",
      sourcePath: modelPickerSourcePath,
      targetPath: "plugin state:model-picker-preferences",
      pluginId: "discord",
      namespace: "model-picker-preferences",
      maxEntries: PREFERENCE_MAX_ENTRIES,
      scopeKey: "",
      cleanupSource: "rename",
      readEntries: () => {
        const store = readLegacyStore(modelPickerSourcePath);
        if (!store || !store.entries || typeof store.entries !== "object") return [];
        const out = [];
        for (const [rawKey, rawEntry] of Object.entries(store.entries)) {
          const scopeKey = normalizeLegacyPreferenceKey(rawKey);
          if (!scopeKey || !rawEntry || typeof rawEntry !== "object") continue;
          const recent = sanitizeRecentModels(rawEntry.recent, 10);
          for (const [index, modelRef] of recent.entries())
            out.push({
              key: buildPreferenceModelKey(scopeKey, modelRef),
              value: {
                scopeKey,
                modelRef,
                updatedAt: legacyUpdatedAtForIndex(rawEntry.updatedAt, index, recent.length),
              },
            });
        }
        return out;
      },
    });
  const threadBindingsSourcePath = path.join(stateDir, "discord", "thread-bindings.json");
  if (fileExists(threadBindingsSourcePath))
    plans.push({
      kind: "plugin-state-import",
      label: "Discord thread bindings",
      sourcePath: threadBindingsSourcePath,
      targetPath: `plugin state:${THREAD_BINDINGS_NAMESPACE}`,
      pluginId: "discord",
      namespace: THREAD_BINDINGS_NAMESPACE,
      maxEntries: THREAD_BINDINGS_MAX_ENTRIES,
      scopeKey: "",
      cleanupSource: "rename",
      cleanupWhenEmpty: true,
      readEntries: () => {
        const store = readLegacyThreadBindingsStore(threadBindingsSourcePath);
        if (store?.version !== 1 || !store.bindings || typeof store.bindings !== "object")
          throw new Error("legacy Discord thread bindings store must have version 1 bindings");
        const out = [];
        for (const [rawKey, rawEntry] of Object.entries(store.bindings)) {
          const normalized = normalizePersistedBinding(
            rawKey,
            upgradeLegacyThreadBindingShape(rawEntry),
          );
          if (normalized)
            out.push({
              key: toBindingRecordKey(normalized),
              value: normalized,
            });
        }
        return out;
      },
    });
  return plans;
};
//#endregion
export { detectDiscordLegacyStateMigrations };
