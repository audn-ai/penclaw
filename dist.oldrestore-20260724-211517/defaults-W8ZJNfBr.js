//#region extensions/ollama/src/defaults.ts
const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const OLLAMA_DOCKER_HOST_BASE_URL = "http://host.docker.internal:11434";
const OLLAMA_CLOUD_BASE_URL = "https://ollama.com";
const OLLAMA_CLOUD_PROVIDER_ID = "ollama-cloud";
const OLLAMA_GLM52_CLOUD_MODEL_ID = "glm-5.2:cloud";
const OLLAMA_GLM52_CONTEXT_WINDOW = 1e6;
const OLLAMA_CLOUD_DEFAULT_MODELS = [
  "kimi-k2.5:cloud",
  "minimax-m2.7:cloud",
  "glm-5.1:cloud",
  OLLAMA_GLM52_CLOUD_MODEL_ID,
];
const OLLAMA_DEFAULT_CONTEXT_WINDOW = 128e3;
const OLLAMA_DEFAULT_MAX_TOKENS = 8192;
const OLLAMA_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};
const OLLAMA_DEFAULT_MODEL = "gemma4";
//#endregion
export {
  OLLAMA_DEFAULT_CONTEXT_WINDOW as a,
  OLLAMA_DEFAULT_MODEL as c,
  OLLAMA_GLM52_CONTEXT_WINDOW as d,
  OLLAMA_DEFAULT_BASE_URL as i,
  OLLAMA_DOCKER_HOST_BASE_URL as l,
  OLLAMA_CLOUD_DEFAULT_MODELS as n,
  OLLAMA_DEFAULT_COST as o,
  OLLAMA_CLOUD_PROVIDER_ID as r,
  OLLAMA_DEFAULT_MAX_TOKENS as s,
  OLLAMA_CLOUD_BASE_URL as t,
  OLLAMA_GLM52_CLOUD_MODEL_ID as u,
};
