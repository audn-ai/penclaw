import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { o as runAuthProbes } from "./list.probe-D5koptmI.js";
import { r as normalizeProviderId } from "./provider-id-BIcU_2-A.js";
import { Wt as validateModelsProbeParams } from "./src-CIJf1lT0.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
//#region src/gateway/server-methods/models-probe.ts
const DEFAULT_TIMEOUT_MS = 2e4;
const MIN_TIMEOUT_MS = 5e3;
const MAX_TIMEOUT_MS = 6e4;
const PROBE_CONCURRENCY = 2;
const PROBE_MAX_TOKENS = 8;
const FAILURE_PRIORITY = [
  "auth",
  "billing",
  "rate_limit",
  "timeout",
  "format",
  "no_model",
  "unknown",
];
const PROBE_ERROR_MESSAGES = {
  auth: "Authentication failed.",
  rate_limit: "The provider rate limit was reached.",
  billing: "The provider reported a billing problem.",
  timeout: "The connection timed out.",
  format: "The provider rejected the model or request format.",
  unknown: "The connection probe failed.",
  no_model: "No model is available for this provider.",
};
function safeProbeError(status) {
  return status === "ok" ? void 0 : PROBE_ERROR_MESSAGES[status];
}
function modelCandidatesFromConfig(cfg) {
  const configured = cfg.agents?.defaults?.model;
  return [
    typeof configured === "string" ? configured : configured?.primary,
    ...(typeof configured === "string" ? [] : (configured?.fallbacks ?? [])),
    cfg.agents?.defaults?.utilityModel,
  ]
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}
function selectRollupStatus(results) {
  if (results.some((result) => result.status === "ok")) return "ok";
  return (
    FAILURE_PRIORITY.find((status) => results.some((result) => result.status === status)) ??
    "unknown"
  );
}
function mapProbeResult(provider, results) {
  const status = selectRollupStatus(results);
  const latencyMs = results
    .filter((result) => result.status === status)
    .map((result) => result.latencyMs)
    .filter((value) => typeof value === "number")
    .toSorted((left, right) => left - right)[0];
  const error = safeProbeError(status);
  return {
    provider,
    status,
    ...(latencyMs !== void 0 ? { latencyMs } : {}),
    ...(error ? { error } : {}),
    results: results.map((result) => ({
      ...(result.profileId ? { profileId: result.profileId } : {}),
      label: result.label,
      status: result.status,
      ...(result.latencyMs !== void 0 ? { latencyMs: result.latencyMs } : {}),
      ...(result.error ? { error: safeProbeError(result.status) } : {}),
    })),
  };
}
const modelsProbeHandlers = {
  "models.probe": async ({ params, respond, context }) => {
    if (!validateModelsProbeParams(params)) {
      respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid models.probe params: ${formatValidationErrors(validateModelsProbeParams.errors)}`,
        ),
      );
      return;
    }
    const request = params;
    const provider = normalizeProviderId(request.provider);
    const profileId = request.profileId?.trim();
    if (!provider || (request.profileId !== void 0 && !profileId)) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "provider and profileId must not be blank"),
      );
      return;
    }
    const timeoutMs = Math.min(
      MAX_TIMEOUT_MS,
      Math.max(MIN_TIMEOUT_MS, request.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    );
    try {
      const cfg = context.getRuntimeConfig();
      const result = mapProbeResult(
        provider,
        (
          await runAuthProbes({
            cfg,
            providers: [provider],
            modelCandidates: modelCandidatesFromConfig(cfg),
            options: {
              provider,
              ...(profileId ? { profileIds: [profileId] } : {}),
              ...(!profileId ? { includeDirectKeys: true } : {}),
              timeoutMs,
              concurrency: PROBE_CONCURRENCY,
              maxTokens: PROBE_MAX_TOKENS,
            },
          })
        ).results,
      );
      if (result.results.length === 0)
        result.error = "No probe targets are available for this provider.";
      respond(true, result, void 0);
    } catch {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Connection probe failed."));
    }
  },
};
//#endregion
export { modelsProbeHandlers };
