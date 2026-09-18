import { f as matchesExactOrPrefix } from "./provider-model-shared-CYlCpWlu.js";
//#region extensions/minimax/provider-models.ts
const MINIMAX_DEFAULT_MODEL_ID = "MiniMax-M3";
const MINIMAX_DEFAULT_MODEL_REF = `minimax/${MINIMAX_DEFAULT_MODEL_ID}`;
const MINIMAX_TEXT_MODEL_ORDER = ["MiniMax-M3", "MiniMax-M2.7", "MiniMax-M2.7-highspeed"];
const MINIMAX_TEXT_MODEL_CATALOG = {
  "MiniMax-M3": {
    name: "MiniMax M3",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: 1e6,
  },
  "MiniMax-M2.7": {
    name: "MiniMax M2.7",
    reasoning: true,
    input: ["text"],
    contextWindow: 204800,
  },
  "MiniMax-M2.7-highspeed": {
    name: "MiniMax M2.7 Highspeed",
    reasoning: true,
    input: ["text"],
    contextWindow: 204800,
  },
};
const MINIMAX_TEXT_MODEL_REFS = MINIMAX_TEXT_MODEL_ORDER.map((modelId) => `minimax/${modelId}`);
const MINIMAX_MODERN_MODEL_MATCHERS = ["minimax-m3", "minimax-m2.7"];
function isMiniMaxModernModelId(modelId) {
  return matchesExactOrPrefix(modelId, MINIMAX_MODERN_MODEL_MATCHERS);
}
//#endregion
export {
  MINIMAX_TEXT_MODEL_REFS as a,
  MINIMAX_TEXT_MODEL_ORDER as i,
  MINIMAX_DEFAULT_MODEL_REF as n,
  isMiniMaxModernModelId as o,
  MINIMAX_TEXT_MODEL_CATALOG as r,
  MINIMAX_DEFAULT_MODEL_ID as t,
};
