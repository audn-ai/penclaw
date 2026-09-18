//#region extensions/openai/thinking-policy.ts
const OPENAI_THINKING_BASE_LEVELS = [
  { id: "off" },
  { id: "minimal" },
  { id: "low" },
  { id: "medium" },
  { id: "high" },
];
const OPENAI_THINKING_LEVEL_ORDER = [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
  "ultra",
];
const OPENAI_CODEX_XHIGH_MODEL_IDS = [
  "gpt-5.6",
  "gpt-5.5",
  "gpt-5.5-pro",
  "gpt-5.4",
  "gpt-5.4-pro",
  "gpt-5.3-codex-spark",
];
const OPENAI_UNIFIED_XHIGH_MODEL_IDS = [
  ...OPENAI_CODEX_XHIGH_MODEL_IDS,
  "gpt-5.4-mini",
  "gpt-5.4-nano",
];
function normalizeModelId(value) {
  return value.trim().toLowerCase();
}
function matchesExactOrPrefix(id, values) {
  const normalizedId = normalizeModelId(id);
  return values.some((value) => {
    const normalizedValue = normalizeModelId(value);
    return normalizedId === normalizedValue || normalizedId.startsWith(normalizedValue);
  });
}
function normalizeCodexReasoningEffort(value) {
  const normalized = normalizeModelId(value);
  if (normalized === "none") return "off";
  return OPENAI_THINKING_LEVEL_ORDER.find((level) => level === normalized);
}
function buildAuthoritativeCodexLevels(efforts) {
  const supported = /* @__PURE__ */ new Set(["off"]);
  for (const effort of efforts) {
    const level = normalizeCodexReasoningEffort(effort);
    if (level) supported.add(level);
  }
  return OPENAI_THINKING_LEVEL_ORDER.filter((level) => supported.has(level)).map((id) => ({ id }));
}
function buildOpenAIThinkingProfile(params) {
  const modelId = normalizeModelId(params.modelId);
  const agentRuntime = normalizeModelId(params.agentRuntime ?? "");
  const isBare = modelId === "gpt-5.6";
  const isSol = modelId === "gpt-5.6-sol";
  const isTerra = modelId === "gpt-5.6-terra";
  const isLuna = modelId === "gpt-5.6-luna";
  const codexEfforts = params.compat?.supportedReasoningEfforts?.map(normalizeModelId);
  const authoritativeCodexEfforts = codexEfforts?.includes("none") === true ? void 0 : codexEfforts;
  const codexSupportsMax = authoritativeCodexEfforts
    ? authoritativeCodexEfforts.includes("max")
    : isSol || isTerra || isLuna;
  const supportsMax =
    modelId.startsWith("gpt-5.6") && (agentRuntime !== "codex" || codexSupportsMax);
  const codexSupportsUltra = authoritativeCodexEfforts
    ? authoritativeCodexEfforts.includes("ultra")
    : isSol || isTerra;
  const supportsUltra =
    (isBare || isSol || isTerra || isLuna) &&
    (agentRuntime === "openclaw" ||
      agentRuntime === "auto" ||
      (agentRuntime === "codex" && codexSupportsUltra));
  const defaultLevel = isSol ? "low" : isTerra || isLuna ? "medium" : void 0;
  const fallbackLevels = [
    ...OPENAI_THINKING_BASE_LEVELS,
    ...(matchesExactOrPrefix(params.modelId, params.xhighModelIds) ? [{ id: "xhigh" }] : []),
    ...(supportsMax ? [{ id: "max" }] : []),
    ...(supportsUltra ? [{ id: "ultra" }] : []),
  ];
  const levels =
    agentRuntime === "codex" && authoritativeCodexEfforts !== void 0
      ? buildAuthoritativeCodexLevels(authoritativeCodexEfforts)
      : fallbackLevels;
  return {
    levels,
    ...(defaultLevel && levels.some((level) => level.id === defaultLevel) ? { defaultLevel } : {}),
  };
}
function resolveOpenAICodexThinkingProfile(modelId, agentRuntime, compat) {
  return buildOpenAIThinkingProfile({
    modelId,
    xhighModelIds: OPENAI_CODEX_XHIGH_MODEL_IDS,
    agentRuntime,
    compat,
  });
}
function resolveUnifiedOpenAIThinkingProfile(modelId, agentRuntime, compat) {
  return buildOpenAIThinkingProfile({
    modelId,
    xhighModelIds: OPENAI_UNIFIED_XHIGH_MODEL_IDS,
    agentRuntime,
    compat,
  });
}
//#endregion
export { resolveUnifiedOpenAIThinkingProfile as n, resolveOpenAICodexThinkingProfile as t };
