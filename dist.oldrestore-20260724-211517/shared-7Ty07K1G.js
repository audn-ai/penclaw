import { t as createOpenAINativeWebSearchWrapper } from "./native-web-search-BXwiNz-k.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-model-shared-CYlCpWlu.js";
import "./provider-catalog-shared-CQScmZZs.js";
import { a as OPENAI_RESPONSES_STREAM_HOOKS } from "./provider-stream-bgGhD_p0.js";
import "./provider-stream-family-BwwxQAAq.js";
import { t as buildOpenAIReplayPolicy } from "./replay-policy-JEpwmvIo.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  n as resolveOpenAIWebSocketSessionPolicy,
  t as resolveOpenAITransportTurnState,
} from "./transport-policy-Bnhw5T_9.js";
//#region extensions/openai/shared.ts
const OPENAI_API_BASE_URL = "https://api.openai.com/v1";
function resolveConfiguredOpenAIBaseUrl(cfg) {
  return normalizeOptionalString(cfg?.models?.providers?.openai?.baseUrl) ?? OPENAI_API_BASE_URL;
}
function hasSupportedOpenAIResponsesTransport(transport) {
  return transport === "auto" || transport === "sse" || transport === "websocket";
}
function defaultOpenAIResponsesExtraParams(extraParams, options) {
  const hasSupportedTransport = hasSupportedOpenAIResponsesTransport(extraParams?.transport);
  const defaultTransport = options?.transport ?? "auto";
  if (hasSupportedTransport) return extraParams;
  return {
    ...extraParams,
    transport: defaultTransport,
  };
}
const resolveOpenAIResponsesTransportTurnState = (ctx) => resolveOpenAITransportTurnState(ctx);
const resolveOpenAIResponsesWebSocketSessionPolicy = (ctx) =>
  resolveOpenAIWebSocketSessionPolicy(ctx);
const wrapOpenAIResponsesStreamFn = OPENAI_RESPONSES_STREAM_HOOKS.wrapStreamFn;
const wrapOpenAIResponsesProviderStreamFn = (ctx) =>
  createOpenAINativeWebSearchWrapper(wrapOpenAIResponsesStreamFn?.(ctx) ?? ctx.streamFn, {
    config: ctx.config,
    agentId: ctx.agentId,
    nativeWebSearchAllowedByToolPolicy: ctx.nativeWebSearchAllowedByToolPolicy,
  });
function buildOpenAIResponsesProviderHooks(options) {
  return {
    buildReplayPolicy: buildOpenAIReplayPolicy,
    prepareExtraParams: (ctx) => defaultOpenAIResponsesExtraParams(ctx.extraParams, options),
    ...OPENAI_RESPONSES_STREAM_HOOKS,
    wrapStreamFn: wrapOpenAIResponsesProviderStreamFn,
    resolveTransportTurnState: resolveOpenAIResponsesTransportTurnState,
    resolveWebSocketSessionPolicy: resolveOpenAIResponsesWebSocketSessionPolicy,
  };
}
function buildOpenAISyntheticCatalogEntry(template, entry) {
  if (!template) return;
  return {
    ...template,
    id: entry.id,
    name: entry.id,
    reasoning: entry.reasoning,
    input: [...entry.input],
    contextWindow: entry.contextWindow,
    ...(entry.contextTokens === void 0 ? {} : { contextTokens: entry.contextTokens }),
    ...(entry.cost === void 0 ? {} : { cost: entry.cost }),
  };
}
//#endregion
export {
  buildOpenAISyntheticCatalogEntry as n,
  resolveConfiguredOpenAIBaseUrl as r,
  buildOpenAIResponsesProviderHooks as t,
};
