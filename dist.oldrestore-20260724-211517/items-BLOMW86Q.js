import { a as isRecord, c as readString } from "./helpers-DtCn6Wrs.js";
import {
  d as markMigrationItemSkipped,
  l as markMigrationItemConflict,
  o as createMigrationItem,
  u as markMigrationItemError,
} from "./migration-nGWjmzKy.js";
//#region extensions/migrate-hermes/items.ts
const HERMES_REASON_ALREADY_CONFIGURED = "already configured";
const HERMES_REASON_DEFAULT_MODEL_CONFIGURED = "default model already configured";
const HERMES_REASON_MODEL_PROVIDER_CONFLICT = "model provider config conflict";
const HERMES_REASON_INCLUDE_SECRETS = "auth credential migration not selected";
const HERMES_REASON_AUTH_PROFILE_EXISTS = "auth profile exists";
const HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE = "config runtime unavailable";
const HERMES_REASON_MISSING_SECRET_METADATA = "missing secret metadata";
const HERMES_REASON_SECRET_NO_LONGER_PRESENT = "secret no longer present";
const HERMES_REASON_AUTH_PROFILE_WRITE_FAILED = "failed to write auth profile";
function createHermesModelItem(params) {
  const alreadyConfigured = params.currentModel === params.model;
  const conflict = Boolean(params.currentModel && !params.overwrite && !alreadyConfigured);
  return createMigrationItem({
    id: "config:default-model",
    kind: "config",
    action: alreadyConfigured ? "skip" : "update",
    target: "agents.defaults.model",
    status: alreadyConfigured ? "skipped" : conflict ? "conflict" : "planned",
    reason: alreadyConfigured
      ? HERMES_REASON_ALREADY_CONFIGURED
      : conflict
        ? HERMES_REASON_DEFAULT_MODEL_CONFIGURED
        : void 0,
    details: { model: params.model },
  });
}
function readHermesModelDetails(item) {
  const model = readString(item.details?.model);
  return model ? { model } : void 0;
}
function findHermesModelProviderDependency(items, model) {
  const separator = model.indexOf("/");
  const provider = separator > 0 ? model.slice(0, separator) : "";
  if (!provider) return;
  return items.find((item) => {
    const value = item.details?.value;
    return (
      item.id.startsWith("config:model-provider:") &&
      isRecord(value) &&
      Object.hasOwn(value, provider)
    );
  });
}
function createHermesSecretItem(params) {
  const skipped = !params.includeSecrets;
  const conflict = Boolean(params.existsAlready && !skipped);
  return createMigrationItem({
    id: params.id,
    kind: "secret",
    action: skipped ? "skip" : "create",
    source: params.source,
    target: params.target,
    status: skipped ? "skipped" : conflict ? "conflict" : "planned",
    sensitive: true,
    reason: skipped
      ? HERMES_REASON_INCLUDE_SECRETS
      : conflict
        ? HERMES_REASON_AUTH_PROFILE_EXISTS
        : void 0,
    details: params.details,
  });
}
function readHermesSecretDetails(item) {
  const envVar = readString(item.details?.envVar);
  const provider = readString(item.details?.provider);
  const profileId = readString(item.details?.profileId);
  if (!provider || !profileId) return;
  const mode = item.details?.mode === "token" ? "token" : void 0;
  const sourceKind = readString(item.details?.sourceKind);
  const sourceProvider = readString(item.details?.sourceProvider);
  const sourceCredentialId = readString(item.details?.sourceCredentialId);
  const secretField = readString(item.details?.secretField);
  return {
    ...(envVar ? { envVar } : {}),
    provider,
    profileId,
    ...(mode ? { mode } : {}),
    ...(sourceKind ? { sourceKind } : {}),
    ...(sourceProvider ? { sourceProvider } : {}),
    ...(sourceCredentialId ? { sourceCredentialId } : {}),
    ...(secretField ? { secretField } : {}),
  };
}
function hermesItemConflict(item, reason) {
  return markMigrationItemConflict(item, reason);
}
function hermesItemError(item, reason) {
  return markMigrationItemError(item, reason);
}
function hermesItemSkipped(item, reason) {
  return markMigrationItemSkipped(item, reason);
}
//#endregion
export {
  readHermesSecretDetails as _,
  HERMES_REASON_DEFAULT_MODEL_CONFIGURED as a,
  HERMES_REASON_MODEL_PROVIDER_CONFLICT as c,
  createHermesSecretItem as d,
  findHermesModelProviderDependency as f,
  readHermesModelDetails as g,
  hermesItemSkipped as h,
  HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE as i,
  HERMES_REASON_SECRET_NO_LONGER_PRESENT as l,
  hermesItemError as m,
  HERMES_REASON_AUTH_PROFILE_EXISTS as n,
  HERMES_REASON_INCLUDE_SECRETS as o,
  hermesItemConflict as p,
  HERMES_REASON_AUTH_PROFILE_WRITE_FAILED as r,
  HERMES_REASON_MISSING_SECRET_METADATA as s,
  HERMES_REASON_ALREADY_CONFIGURED as t,
  createHermesModelItem as u,
};
