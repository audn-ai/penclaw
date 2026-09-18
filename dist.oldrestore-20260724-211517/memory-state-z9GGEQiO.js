import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/plugins/memory-state.ts
const log = createSubsystemLogger("plugins/memory-state");
const memoryPluginState = {
  corpusSupplements: [],
  promptSupplements: [],
};
function registerMemoryCorpusSupplement(pluginId, supplement) {
  const next = memoryPluginState.corpusSupplements.filter(
    (registration) => registration.pluginId !== pluginId,
  );
  next.push({
    pluginId,
    supplement,
  });
  memoryPluginState.corpusSupplements = next;
}
function registerMemoryCapability(pluginId, capability) {
  const existingCapability = memoryPluginState.capability?.capability;
  const shouldPreserveExisting =
    existingCapability &&
    Boolean(capability.publicArtifacts) &&
    !capability.promptBuilder &&
    !capability.flushPlanResolver &&
    !capability.runtime;
  memoryPluginState.capability = {
    pluginId,
    capability: {
      ...(shouldPreserveExisting ? existingCapability : {}),
      ...capability,
    },
  };
}
function patchMemoryCapability(pluginId, patch) {
  registerMemoryCapability(pluginId, {
    ...(memoryPluginState.capability?.pluginId === pluginId
      ? memoryPluginState.capability.capability
      : {}),
    ...patch,
  });
}
function getMemoryCapabilityRegistration() {
  return memoryPluginState.capability
    ? {
        pluginId: memoryPluginState.capability.pluginId,
        capability: { ...memoryPluginState.capability.capability },
      }
    : void 0;
}
function listMemoryCorpusSupplements() {
  return [...memoryPluginState.corpusSupplements];
}
function registerMemoryPromptSectionForPlugin(pluginId, builder) {
  patchMemoryCapability(pluginId, { promptBuilder: builder });
}
function registerMemoryPromptSupplement(pluginId, builder) {
  const next = memoryPluginState.promptSupplements.filter(
    (registration) => registration.pluginId !== pluginId,
  );
  next.push({
    pluginId,
    builder,
  });
  memoryPluginState.promptSupplements = next;
}
function buildMemoryPromptSection(params) {
  const primary = normalizeMemoryPromptLines(
    memoryPluginState.capability?.capability.promptBuilder?.(params) ?? [],
  );
  const supplements = memoryPluginState.promptSupplements
    .toSorted((left, right) => left.pluginId.localeCompare(right.pluginId))
    .flatMap((registration) => normalizeMemoryPromptLines(registration.builder(params)));
  return [...primary, ...supplements];
}
function normalizeMemoryPromptLines(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((line) => typeof line === "string");
}
function listMemoryPromptSupplements() {
  return [...memoryPluginState.promptSupplements];
}
function registerMemoryFlushPlanResolverForPlugin(pluginId, resolver) {
  patchMemoryCapability(pluginId, { flushPlanResolver: resolver });
}
function resolveMemoryFlushPlan(params) {
  return memoryPluginState.capability?.capability.flushPlanResolver?.(params) ?? null;
}
function registerMemoryRuntimeForPlugin(pluginId, runtime) {
  patchMemoryCapability(pluginId, { runtime });
}
function getMemoryRuntime() {
  return memoryPluginState.capability?.capability.runtime;
}
function hasMemoryRuntime() {
  return getMemoryRuntime() !== void 0;
}
function cloneMemoryPublicArtifact(artifact) {
  const agentIds = Array.isArray(artifact.agentIds) ? artifact.agentIds : [];
  return {
    ...artifact,
    agentIds: [...agentIds],
  };
}
function isValidMemoryPublicArtifact(artifact) {
  return (
    typeof artifact?.kind === "string" &&
    typeof artifact.workspaceDir === "string" &&
    typeof artifact.relativePath === "string" &&
    typeof artifact.absolutePath === "string" &&
    typeof artifact.contentType === "string"
  );
}
async function listActiveMemoryPublicArtifacts(params) {
  const pluginId = memoryPluginState.capability?.pluginId;
  const listed =
    (await memoryPluginState.capability?.capability.publicArtifacts?.listArtifacts(params)) ?? [];
  if (!Array.isArray(listed)) {
    log.warn(`ignoring public memory artifacts from plugin "${pluginId}": not an array`);
    return [];
  }
  const artifacts = listed.filter(isValidMemoryPublicArtifact);
  if (artifacts.length < listed.length)
    log.warn(
      `ignoring ${listed.length - artifacts.length} malformed public memory artifact(s) from plugin "${pluginId}": artifacts must include string kind, workspaceDir, relativePath, absolutePath, and contentType`,
    );
  return artifacts.map(cloneMemoryPublicArtifact).toSorted((left, right) => {
    const workspaceOrder = left.workspaceDir.localeCompare(right.workspaceDir);
    if (workspaceOrder !== 0) return workspaceOrder;
    const relativePathOrder = left.relativePath.localeCompare(right.relativePath);
    if (relativePathOrder !== 0) return relativePathOrder;
    const kindOrder = left.kind.localeCompare(right.kind);
    if (kindOrder !== 0) return kindOrder;
    const contentTypeOrder = left.contentType.localeCompare(right.contentType);
    if (contentTypeOrder !== 0) return contentTypeOrder;
    const agentOrder = left.agentIds.join("\0").localeCompare(right.agentIds.join("\0"));
    if (agentOrder !== 0) return agentOrder;
    return left.absolutePath.localeCompare(right.absolutePath);
  });
}
function restoreMemoryPluginState(state) {
  memoryPluginState.capability = state.capability
    ? {
        pluginId: state.capability.pluginId,
        capability: { ...state.capability.capability },
      }
    : void 0;
  memoryPluginState.corpusSupplements = [...state.corpusSupplements];
  memoryPluginState.promptSupplements = [...state.promptSupplements];
}
function clearMemoryPluginState() {
  memoryPluginState.capability = void 0;
  memoryPluginState.corpusSupplements = [];
  memoryPluginState.promptSupplements = [];
}
//#endregion
export {
  hasMemoryRuntime as a,
  listMemoryPromptSupplements as c,
  registerMemoryFlushPlanResolverForPlugin as d,
  registerMemoryPromptSectionForPlugin as f,
  restoreMemoryPluginState as g,
  resolveMemoryFlushPlan as h,
  getMemoryRuntime as i,
  registerMemoryCapability as l,
  registerMemoryRuntimeForPlugin as m,
  clearMemoryPluginState as n,
  listActiveMemoryPublicArtifacts as o,
  registerMemoryPromptSupplement as p,
  getMemoryCapabilityRegistration as r,
  listMemoryCorpusSupplements as s,
  buildMemoryPromptSection as t,
  registerMemoryCorpusSupplement as u,
};
