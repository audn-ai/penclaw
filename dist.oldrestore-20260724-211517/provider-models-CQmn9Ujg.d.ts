//#region extensions/minimax/provider-models.d.ts
declare const MINIMAX_DEFAULT_MODEL_ID = "MiniMax-M3";
declare const MINIMAX_DEFAULT_MODEL_REF = "minimax/MiniMax-M3";
declare const MINIMAX_TEXT_MODEL_ORDER: readonly [
  "MiniMax-M3",
  "MiniMax-M2.7",
  "MiniMax-M2.7-highspeed",
];
declare const MINIMAX_TEXT_MODEL_CATALOG: {
  readonly "MiniMax-M3": {
    readonly name: "MiniMax M3";
    readonly reasoning: true;
    readonly input: readonly ["text", "image"];
    readonly contextWindow: 1000000;
  };
  readonly "MiniMax-M2.7": {
    readonly name: "MiniMax M2.7";
    readonly reasoning: true;
    readonly input: readonly ["text"];
    readonly contextWindow: 204800;
  };
  readonly "MiniMax-M2.7-highspeed": {
    readonly name: "MiniMax M2.7 Highspeed";
    readonly reasoning: true;
    readonly input: readonly ["text"];
    readonly contextWindow: 204800;
  };
};
declare const MINIMAX_TEXT_MODEL_REFS: string[];
declare function isMiniMaxModernModelId(modelId: string): boolean;
//#endregion
export {
  MINIMAX_TEXT_MODEL_REFS as a,
  MINIMAX_TEXT_MODEL_ORDER as i,
  MINIMAX_DEFAULT_MODEL_REF as n,
  isMiniMaxModernModelId as o,
  MINIMAX_TEXT_MODEL_CATALOG as r,
  MINIMAX_DEFAULT_MODEL_ID as t,
};
