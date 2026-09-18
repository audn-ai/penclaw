import { r as collectConfiguredModelRefs } from "./configured-model-refs-wBBEGQ5a.js";
import { t as asObjectRecord } from "./object-BsiS9JXh.js";
import { o as normalizeNullableString } from "./string-coerce-DW4mBlAt.js";
//#region src/commands/doctor/shared/configured-provider-selection-ids.ts
function collectConfiguredProviderIds(cfg) {
  const ids = /* @__PURE__ */ new Set();
  const add = (value) => {
    const id = normalizeNullableString(value);
    if (id) ids.add(id.toLowerCase());
  };
  for (const profile of Object.values(asObjectRecord(cfg.auth?.profiles) ?? {}))
    add(asObjectRecord(profile)?.provider);
  for (const providerId of Object.keys(asObjectRecord(cfg.models?.providers) ?? {}))
    add(providerId);
  const modelByChannel = asObjectRecord(cfg.channels?.modelByChannel);
  for (const [providerId, channelMap] of Object.entries(modelByChannel ?? {})) {
    add(providerId);
    for (const modelRef of Object.values(asObjectRecord(channelMap) ?? {})) {
      if (typeof modelRef !== "string") continue;
      const slash = modelRef.indexOf("/");
      if (slash > 0) add(modelRef.slice(0, slash));
    }
  }
  for (const { value } of collectConfiguredModelRefs(cfg, {
    includeChannelModelOverrides: false,
  })) {
    const slash = value.indexOf("/");
    if (slash > 0) add(value.slice(0, slash));
  }
  return ids;
}
function collectConfiguredMediaProviderIds(cfg) {
  const ids = /* @__PURE__ */ new Set();
  const add = (value) => {
    const id = normalizeNullableString(value);
    if (id) ids.add(id.toLowerCase());
  };
  const addModels = (value) => {
    if (!Array.isArray(value)) return;
    for (const model of value) add(asObjectRecord(model)?.provider);
  };
  const media = cfg.tools?.media;
  addModels(media?.models);
  addModels(media?.image?.models);
  addModels(media?.audio?.models);
  addModels(media?.video?.models);
  return ids;
}
/** Provider ids used by static and installed-registry plugin matching. */
function collectConfiguredProviderSelectionIds(cfg) {
  return /* @__PURE__ */ new Set([
    ...collectConfiguredProviderIds(cfg),
    ...collectConfiguredMediaProviderIds(cfg),
  ]);
}
function collectConfiguredMediaProviderSelectionIds(cfg) {
  return collectConfiguredMediaProviderIds(cfg);
}
function collectConfiguredModelProviderSelectionIds(cfg) {
  return collectConfiguredProviderIds(cfg);
}
//#endregion
export {
  collectConfiguredModelProviderSelectionIds as n,
  collectConfiguredProviderSelectionIds as r,
  collectConfiguredMediaProviderSelectionIds as t,
};
