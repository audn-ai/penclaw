import {
  a as OLLAMA_DEFAULT_CONTEXT_WINDOW,
  c as OLLAMA_DEFAULT_MODEL,
  i as OLLAMA_DEFAULT_BASE_URL,
  o as OLLAMA_DEFAULT_COST,
  s as OLLAMA_DEFAULT_MAX_TOKENS,
} from "../../defaults-W8ZJNfBr.js";
import {
  a as enrichOllamaModelsWithContext,
  c as queryOllamaContextWindow,
  i as buildOllamaProvider,
  l as queryOllamaModelShowInfo,
  o as fetchOllamaModels,
  r as buildOllamaModelDefinition,
  s as isReasoningModelHeuristic,
  u as resolveOllamaApiBase,
} from "../../provider-base-url-BOHQJG0k.js";
import {
  i as promptAndConfigureOllama,
  n as configureOllamaNonInteractive,
  r as ensureOllamaModelPulled,
} from "../../setup-CUN91yFU.js";
import {
  h as wrapOllamaCompatNumCtx,
  i as buildOllamaChatRequest,
  l as isOllamaCompatProvider,
  m as shouldInjectOllamaCompatNumCtx,
  o as createConfiguredOllamaCompatStreamWrapper,
  p as resolveOllamaCompatNumCtxEnabled,
} from "../../stream-D0hvAkbV.js";
import "../../api-B7auiD5x.js";
export {
  OLLAMA_DEFAULT_BASE_URL,
  OLLAMA_DEFAULT_CONTEXT_WINDOW,
  OLLAMA_DEFAULT_COST,
  OLLAMA_DEFAULT_MAX_TOKENS,
  OLLAMA_DEFAULT_MODEL,
  buildOllamaChatRequest,
  buildOllamaModelDefinition,
  buildOllamaProvider,
  configureOllamaNonInteractive,
  createConfiguredOllamaCompatStreamWrapper,
  enrichOllamaModelsWithContext,
  ensureOllamaModelPulled,
  fetchOllamaModels,
  isOllamaCompatProvider,
  isReasoningModelHeuristic,
  promptAndConfigureOllama,
  queryOllamaContextWindow,
  queryOllamaModelShowInfo,
  resolveOllamaApiBase,
  resolveOllamaCompatNumCtxEnabled,
  shouldInjectOllamaCompatNumCtx,
  wrapOllamaCompatNumCtx,
};
