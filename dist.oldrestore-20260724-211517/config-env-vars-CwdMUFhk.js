import { parse } from "semver";
import {
  o as normalizeZaiEnv,
  s as resolveEnvNormalizationKeys,
  t as expandEnvNormalizationKeys,
} from "./env-Di-LcxqW.js";
import { n as containsEnvVarReference } from "./env-substitution-BDfwDlDU.js";
import {
  a as normalizeEnvVarKey,
  n as isDangerousHostEnvOverrideVarName,
  r as isDangerousHostEnvVarName,
} from "./host-env-security-pMY6K0Qy.js";
import {
  i as normalizeLegacyDotBetaVersion,
  r as isOpenClawCorrectionSemver,
  t as compareOpenClawSemver,
} from "./semver-aYpwYdrQ.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/config/version.ts
/** Parses stable, prerelease, and legacy dot-beta OpenClaw versions. */
function parseOpenClawVersion(raw) {
  if (!raw) return null;
  return parse(normalizeLegacyDotBetaVersion(raw.trim()));
}
function normalizeOpenClawVersionBase(raw) {
  const parsed = parseOpenClawVersion(raw);
  if (!parsed) return null;
  return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
}
function compareOpenClawVersions(a, b) {
  const parsedA = parseOpenClawVersion(a);
  const parsedB = parseOpenClawVersion(b);
  if (!parsedA || !parsedB) return null;
  return compareOpenClawSemver(parsedA, parsedB);
}
function shouldWarnOnTouchedVersion(current, touched) {
  const parsedCurrent = parseOpenClawVersion(current);
  const parsedTouched = parseOpenClawVersion(touched);
  if (parsedCurrent && parsedTouched && parsedCurrent.compareMain(parsedTouched) === 0) {
    if (parsedTouched.prerelease.length === 0 || isOpenClawCorrectionSemver(parsedTouched))
      return false;
  }
  return parsedCurrent !== null && parsedTouched !== null
    ? compareOpenClawSemver(parsedCurrent, parsedTouched) < 0
    : false;
}
//#endregion
//#region src/config/future-version-guard.ts
/** Override env var for intentional older-binary destructive config actions. */
const ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV =
  "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS";
function allowOlderBinaryDestructiveActions(env) {
  const raw = env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV]?.trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes";
}
function resolveTouchedVersion(params) {
  return (
    params.snapshot?.sourceConfig?.meta?.lastTouchedVersion?.trim() ||
    params.snapshot?.config?.meta?.lastTouchedVersion?.trim() ||
    params.config?.meta?.lastTouchedVersion?.trim() ||
    null
  );
}
/** Resolves whether a destructive action should be blocked by future config metadata. */
function resolveFutureConfigActionBlock(params) {
  if (allowOlderBinaryDestructiveActions(params.env ?? process.env)) return null;
  const currentVersion = params.currentVersion ?? VERSION;
  const touchedVersion = resolveTouchedVersion(params);
  if (!touchedVersion || !shouldWarnOnTouchedVersion(currentVersion, touchedVersion)) return null;
  return {
    action: params.action,
    currentVersion,
    touchedVersion,
    message: `Refusing to ${params.action} because this OpenClaw binary (${currentVersion}) is older than the config last written by OpenClaw ${touchedVersion}.`,
    hints: [
      "Run the newer openclaw binary on PATH, or reinstall the intended gateway service from the newer install.",
      `Set ${ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV}=1 only for an intentional downgrade or recovery action.`,
    ],
  };
}
/** Formats a future-config action block for CLI/service error output. */
function formatFutureConfigActionBlock(block) {
  return [block.message, ...block.hints].join("\n");
}
//#endregion
//#region src/config/config-env-vars.ts
function isBlockedConfigEnvVar(key) {
  return (
    key.toUpperCase() === "OPENCLAW_ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS" ||
    key.toUpperCase() === "OPENCLAW_INCLUDE_ROOTS" ||
    isDangerousHostEnvVarName(key) ||
    isDangerousHostEnvOverrideVarName(key)
  );
}
/** Returns whether a config-controlled environment entry is safe to apply at runtime. */
function isConfigRuntimeEnvVarAllowed(key, value) {
  return Boolean(value.trim()) && !isBlockedConfigEnvVar(key) && !containsEnvVarReference(value);
}
function collectConfigEnvVarsByTarget(cfg) {
  const envConfig = cfg?.env;
  if (!envConfig) return {};
  const entries = {};
  if (envConfig.vars)
    for (const [rawKey, value] of Object.entries(envConfig.vars)) {
      if (typeof value !== "string" || !value.trim()) continue;
      const key = normalizeEnvVarKey(rawKey, { portable: true });
      if (!key) continue;
      if (!isConfigRuntimeEnvVarAllowed(key, value)) continue;
      entries[key] = value;
    }
  for (const [rawKey, value] of Object.entries(envConfig)) {
    if (rawKey === "shellEnv" || rawKey === "vars") continue;
    if (typeof value !== "string" || !value.trim()) continue;
    const key = normalizeEnvVarKey(rawKey, { portable: true });
    if (!key) continue;
    if (!isConfigRuntimeEnvVarAllowed(key, value)) continue;
    entries[key] = value;
  }
  return entries;
}
function findCaseInsensitiveEnvKey(env, key) {
  if (Object.hasOwn(env, key)) return key;
  const upperKey = key.toUpperCase();
  return Object.keys(env).find((candidate) => candidate.toUpperCase() === upperKey);
}
function envSnapshotKey(key) {
  return process.platform === "win32" ? key.toUpperCase() : key;
}
function snapshotEnvByPlatformKey(env) {
  const snapshot = /* @__PURE__ */ new Map();
  for (const [key, value] of Object.entries(env)) {
    const platformKey = envSnapshotKey(key);
    if (!snapshot.has(platformKey))
      snapshot.set(platformKey, {
        key,
        value,
      });
  }
  return snapshot;
}
function envSnapshotEntriesEqual(left, right) {
  return left?.key === right?.key && left?.value === right?.value;
}
function replaceEnvSnapshotEntry(env, current, next) {
  if (current) delete env[current.key];
  if (next?.value !== void 0) env[next.key] = next.value;
}
function cloneEnvWithPlatformSemantics(env) {
  const cloned = { ...env };
  if (process.platform !== "win32") return cloned;
  return new Proxy(cloned, {
    deleteProperty(target, property) {
      if (typeof property !== "string") return Reflect.deleteProperty(target, property);
      const key = findCaseInsensitiveEnvKey(target, property);
      return key ? Reflect.deleteProperty(target, key) : true;
    },
    get(target, property, receiver) {
      if (typeof property !== "string") return Reflect.get(target, property, receiver);
      const key = findCaseInsensitiveEnvKey(target, property);
      return key ? target[key] : Reflect.get(target, property, receiver);
    },
    getOwnPropertyDescriptor(target, property) {
      if (typeof property !== "string") return Reflect.getOwnPropertyDescriptor(target, property);
      const key = findCaseInsensitiveEnvKey(target, property);
      if (!key) return;
      return {
        configurable: true,
        enumerable: true,
        value: target[key],
        writable: true,
      };
    },
    has(target, property) {
      return typeof property === "string"
        ? findCaseInsensitiveEnvKey(target, property) !== void 0
        : Reflect.has(target, property);
    },
    set(target, property, value) {
      if (typeof property !== "string") return Reflect.set(target, property, value);
      target[findCaseInsensitiveEnvKey(target, property) ?? property] = value;
      return true;
    },
  });
}
/** Collects config env vars safe to inject into runtime process environments. */
function collectConfigRuntimeEnvVars(cfg) {
  return collectConfigEnvVarsByTarget(cfg);
}
/** Collects config env vars safe to persist into managed service environments. */
function collectConfigServiceEnvVars(cfg) {
  return collectConfigEnvVarsByTarget(cfg);
}
/** Builds a cloned environment with config env vars applied without mutating the base env. */
function createConfigRuntimeEnv(cfg, baseEnv = process.env) {
  const env = cloneEnvWithPlatformSemantics(baseEnv);
  applyConfigEnvVars(cfg, env);
  return env;
}
let publishedConfigRuntimeEnvState = {
  generation: 0,
  ownedEnv: {},
  sourceConfig: null,
};
let publishedConfigRuntimeEnvEpoch = 0;
let pendingConfigRuntimeEnvPublication = null;
function applyPublishedConfigRuntimeEnvRollback(publication) {
  for (const [key, change] of publication.changes) {
    const currentEntry = snapshotEnvByPlatformKey(process.env).get(key);
    if (!envSnapshotEntriesEqual(currentEntry, change.after)) continue;
    replaceEnvSnapshotEntry(process.env, currentEntry, change.before);
  }
  publishedConfigRuntimeEnvState = {
    generation: publishedConfigRuntimeEnvState.generation + 1,
    ownedEnv: publication.previousState.ownedEnv,
    sourceConfig: publication.previousState.sourceConfig,
  };
}
function isPendingConfigRuntimeEnvPublication(publication) {
  let current = pendingConfigRuntimeEnvPublication;
  while (current) {
    if (current === publication) return true;
    current = current.previous;
  }
  return false;
}
function unwindRequestedConfigRuntimeEnvPublications() {
  while (pendingConfigRuntimeEnvPublication?.rollbackRequested) {
    const publication = pendingConfigRuntimeEnvPublication;
    applyPublishedConfigRuntimeEnvRollback(publication);
    const previous = publication.previous;
    if (!previous || previous.committed) {
      pendingConfigRuntimeEnvPublication = null;
      return;
    }
    pendingConfigRuntimeEnvPublication = previous;
  }
}
function getPublishedConfigRuntimeEnvState() {
  return publishedConfigRuntimeEnvState;
}
function collectConfigRuntimeEnvOwnership(sourceConfig, before, after, options = {}) {
  const ownedEnv = {};
  const replacedLowerPrecedenceKeys = new Set(
    (options.replacedLowerPrecedenceKeys ?? []).map(envSnapshotKey),
  );
  for (const [key, value] of Object.entries(collectConfigRuntimeEnvVars(sourceConfig)))
    for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
      const afterKey = findCaseInsensitiveEnvKey(after, normalizedKey);
      if (!afterKey || after[afterKey] !== value) continue;
      const beforeKey = findCaseInsensitiveEnvKey(before, normalizedKey);
      if (
        beforeKey &&
        before[beforeKey] === value &&
        !replacedLowerPrecedenceKeys.has(envSnapshotKey(afterKey))
      )
        continue;
      ownedEnv[afterKey] = value;
    }
  return ownedEnv;
}
function filterConfigRuntimeEnvOwnership(sourceConfig, env, ownedEnv) {
  const allowedValues = /* @__PURE__ */ new Map();
  for (const [key, value] of Object.entries(collectConfigRuntimeEnvVars(sourceConfig)))
    for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
      const values = allowedValues.get(normalizedKey) ?? /* @__PURE__ */ new Set();
      values.add(value);
      allowedValues.set(normalizedKey, values);
    }
  const filtered = {};
  for (const [key, value] of Object.entries(ownedEnv)) {
    const normalizedKey = resolveEnvNormalizationKeys(key)[0] ?? key;
    const actualKey = findCaseInsensitiveEnvKey(env, key);
    if (actualKey && env[actualKey] === value && allowedValues.get(normalizedKey)?.has(value))
      filtered[actualKey] = value;
  }
  return filtered;
}
function initializePublishedConfigRuntimeEnv(sourceConfig, options = {}) {
  const ownedEnv = filterConfigRuntimeEnvOwnership(
    sourceConfig,
    process.env,
    options.preserveExistingOwnership
      ? {
          ...publishedConfigRuntimeEnvState.ownedEnv,
          ...options.ownedEnv,
        }
      : (options.ownedEnv ?? {}),
  );
  publishedConfigRuntimeEnvState = {
    generation: publishedConfigRuntimeEnvState.generation + 1,
    ownedEnv,
    sourceConfig,
  };
  publishedConfigRuntimeEnvEpoch += 1;
  pendingConfigRuntimeEnvPublication = null;
}
function resetPublishedConfigRuntimeEnv() {
  publishedConfigRuntimeEnvState = {
    generation: 0,
    ownedEnv: {},
    sourceConfig: null,
  };
  publishedConfigRuntimeEnvEpoch += 1;
  pendingConfigRuntimeEnvPublication = null;
}
/** Removes the active config-owned layer from an isolated read environment. */
function createConfigRuntimeEnvBase(activeConfig, env = process.env, options = {}) {
  const isolated = cloneEnvWithPlatformSemantics(env);
  const ownedEnv = filterConfigRuntimeEnvOwnership(
    activeConfig,
    env,
    options.ownedEnv ?? (env === process.env ? publishedConfigRuntimeEnvState.ownedEnv : {}),
  );
  for (const [key, ownedValue] of Object.entries(ownedEnv)) {
    if (options.preservedKeys?.has(key.toUpperCase())) continue;
    if (isolated[key] === ownedValue) delete isolated[key];
  }
  return isolated;
}
/** Prepares a config-owned env layer without mutating the live process. */
function prepareConfigRuntimeEnv(params) {
  const targetEnv = params.env ?? process.env;
  const before = snapshotEnvByPlatformKey(targetEnv);
  const preparedEnv = createConfigRuntimeEnvBase(
    params.previousConfig,
    targetEnv,
    params.previousOwnedEnv ? { ownedEnv: params.previousOwnedEnv } : {},
  );
  const base = { ...preparedEnv };
  applyConfigEnvVars(params.nextConfig, preparedEnv);
  const after = { ...preparedEnv };
  const afterByPlatformKey = snapshotEnvByPlatformKey(after);
  const preparedOwnedEnv = collectConfigRuntimeEnvOwnership(params.nextConfig, base, after);
  return {
    env: preparedEnv,
    publish: () => {
      const processPublication = targetEnv === process.env;
      const previousPublishedState = publishedConfigRuntimeEnvState;
      const previousPublication = processPublication ? pendingConfigRuntimeEnvPublication : null;
      const published = /* @__PURE__ */ new Map();
      const keys = /* @__PURE__ */ new Set([
        ...before.keys(),
        ...afterByPlatformKey.keys(),
        ...(previousPublication?.changes.keys() ?? []),
      ]);
      for (const key of keys) {
        const beforeEntry = before.get(key);
        const afterEntry = afterByPlatformKey.get(key);
        const currentEntry = snapshotEnvByPlatformKey(targetEnv).get(key);
        const previousChange = previousPublication?.changes.get(key);
        const continuesPreviousPublication =
          previousChange !== void 0 &&
          envSnapshotEntriesEqual(currentEntry, previousChange.after) &&
          envSnapshotEntriesEqual(beforeEntry, previousChange.preparedBefore);
        const appliesToPreparedSnapshot =
          !envSnapshotEntriesEqual(beforeEntry, afterEntry) &&
          envSnapshotEntriesEqual(currentEntry, beforeEntry);
        if (!continuesPreviousPublication && !appliesToPreparedSnapshot) continue;
        published.set(key, {
          before: currentEntry,
          after: afterEntry,
          preparedBefore: beforeEntry,
        });
        if (!envSnapshotEntriesEqual(currentEntry, afterEntry))
          replaceEnvSnapshotEntry(targetEnv, currentEntry, afterEntry);
      }
      const publicationGeneration = processPublication
        ? publishedConfigRuntimeEnvState.generation + 1
        : null;
      const publicationEpoch = publishedConfigRuntimeEnvEpoch;
      let processPublicationState = null;
      if (publicationGeneration !== null) {
        const ownedEnv = {};
        for (const [key, value] of Object.entries(preparedOwnedEnv)) {
          const platformKey = envSnapshotKey(key);
          const currentEntry = snapshotEnvByPlatformKey(targetEnv).get(platformKey);
          const preparedEntry = afterByPlatformKey.get(platformKey);
          const previousOwnedKey = findCaseInsensitiveEnvKey(previousPublishedState.ownedEnv, key);
          if (
            currentEntry?.value === value &&
            envSnapshotEntriesEqual(currentEntry, preparedEntry) &&
            (published.has(platformKey) ||
              (previousOwnedKey !== void 0 &&
                previousPublishedState.ownedEnv[previousOwnedKey] === value))
          )
            ownedEnv[currentEntry.key] = value;
        }
        publishedConfigRuntimeEnvState = {
          generation: publicationGeneration,
          ownedEnv,
          sourceConfig: params.nextConfig,
        };
        processPublicationState = {
          epoch: publicationEpoch,
          previous: previousPublication,
          previousState: previousPublishedState,
          changes: published,
          committed: false,
          rollbackRequested: false,
        };
        pendingConfigRuntimeEnvPublication = processPublicationState;
      }
      let active = true;
      const rollback = () => {
        if (!active) return;
        active = false;
        if (processPublicationState) {
          if (processPublicationState.epoch !== publishedConfigRuntimeEnvEpoch) return;
          processPublicationState.rollbackRequested = true;
          if (!isPendingConfigRuntimeEnvPublication(processPublicationState)) return;
          unwindRequestedConfigRuntimeEnvPublications();
          return;
        }
        for (const [key, publication] of published) {
          const currentEntry = snapshotEnvByPlatformKey(targetEnv).get(key);
          if (!envSnapshotEntriesEqual(currentEntry, publication.after)) continue;
          replaceEnvSnapshotEntry(targetEnv, currentEntry, publication.before);
        }
      };
      rollback.commit = () => {
        if (!active) return;
        active = false;
        if (!processPublicationState) return;
        processPublicationState.committed = true;
        processPublicationState.rollbackRequested = false;
        processPublicationState.previous = null;
        if (pendingConfigRuntimeEnvPublication === processPublicationState)
          pendingConfigRuntimeEnvPublication = null;
      };
      return rollback;
    },
  };
}
/** Applies config env vars to an environment without overwriting existing non-empty values. */
function applyConfigEnvVars(cfg, env = process.env, options = {}) {
  const entries = collectConfigRuntimeEnvVars(cfg);
  const lowerPrecedenceEntries = Object.entries(options.lowerPrecedenceEnv ?? {});
  const normalizeKey = (key) => (process.platform === "win32" ? key.toUpperCase() : key);
  const lowerPrecedenceEnv = new Map(
    lowerPrecedenceEntries.map(([key, value]) => [normalizeKey(key), value]),
  );
  const configEnvKeys = expandEnvNormalizationKeys(Object.keys(entries));
  const configValuesByKey = /* @__PURE__ */ new Map();
  for (const [key, value] of Object.entries(entries))
    for (const normalizedKey of resolveEnvNormalizationKeys(key)) {
      const values = configValuesByKey.get(normalizedKey) ?? /* @__PURE__ */ new Set();
      values.add(value);
      configValuesByKey.set(normalizedKey, values);
    }
  const higherPrecedenceValues = /* @__PURE__ */ new Map();
  for (const key of Object.keys(entries)) {
    const normalizedKeys = resolveEnvNormalizationKeys(key);
    const winningValue = normalizedKeys
      .map((normalizedKey) => [normalizedKey, env[normalizedKey]])
      .find(
        ([normalizedKey, currentValue]) =>
          currentValue?.trim() &&
          lowerPrecedenceEnv.get(normalizedKey) !== currentValue &&
          !configValuesByKey.get(normalizedKey)?.has(currentValue),
      )?.[1];
    if (winningValue !== void 0)
      for (const normalizedKey of normalizedKeys)
        higherPrecedenceValues.set(normalizedKey, winningValue);
  }
  const replacedLowerPrecedenceKeys = [];
  for (const [key, value] of lowerPrecedenceEntries)
    if (configEnvKeys.has(normalizeKey(key)) && env[key] === value) {
      delete env[key];
      replacedLowerPrecedenceKeys.push(key);
    }
  if (replacedLowerPrecedenceKeys.length > 0)
    options.onLowerPrecedenceKeysReplaced?.(replacedLowerPrecedenceKeys);
  for (const [key, value] of Object.entries(entries)) {
    const higherPrecedenceValue = higherPrecedenceValues.get(normalizeKey(key));
    if (higherPrecedenceValue !== void 0) {
      env[key] = higherPrecedenceValue;
      continue;
    }
    const currentValue = env[key];
    if (currentValue?.trim() && lowerPrecedenceEnv.get(normalizeKey(key)) !== currentValue)
      continue;
    if (containsEnvVarReference(value)) continue;
    env[key] = value;
  }
  normalizeZaiEnv(env);
}
//#endregion
export {
  normalizeOpenClawVersionBase as _,
  collectConfigServiceEnvVars as a,
  getPublishedConfigRuntimeEnvState as c,
  prepareConfigRuntimeEnv as d,
  resetPublishedConfigRuntimeEnv as f,
  compareOpenClawVersions as g,
  resolveFutureConfigActionBlock as h,
  collectConfigRuntimeEnvVars as i,
  initializePublishedConfigRuntimeEnv as l,
  formatFutureConfigActionBlock as m,
  cloneEnvWithPlatformSemantics as n,
  createConfigRuntimeEnv as o,
  ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV as p,
  collectConfigRuntimeEnvOwnership as r,
  createConfigRuntimeEnvBase as s,
  applyConfigEnvVars as t,
  isConfigRuntimeEnvVarAllowed as u,
  shouldWarnOnTouchedVersion as v,
};
