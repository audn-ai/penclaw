import { i as GoogleThinkingLevel } from "./provider-stream-shared-DPWBD8Dp.js";
import { c as Context, f as Model, v as SimpleStreamOptions } from "./types-CqrbBnUB.js";
import { T as StreamFn } from "./types-JQFrjdua.js";
//#region extensions/google/transport-stream.d.ts
type CanonicalGoogleTransportApi = "google-generative-ai" | "google-vertex";
type GoogleTransportApi = CanonicalGoogleTransportApi | "openclaw-google-generative-ai-transport";
type GoogleTransportModel = Model<GoogleTransportApi> & {
  headers?: Record<string, string>;
  provider: string;
};
type GoogleTransportOptions = SimpleStreamOptions & {
  cachedContent?: string;
  toolChoice?:
    | "auto"
    | "none"
    | "any"
    | "required"
    | {
        type: "function";
        function: {
          name: string;
        };
      };
  thinking?: {
    enabled: boolean;
    budgetTokens?: number;
    level?: GoogleThinkingLevel;
  };
};
type GoogleGenerateContentRequest = {
  cachedContent?: string;
  contents: Array<Record<string, unknown>>;
  generationConfig?: Record<string, unknown>;
  systemInstruction?: Record<string, unknown>;
  tools?: Array<Record<string, unknown>>;
  toolConfig?: Record<string, unknown>;
};
declare function resolveGoogleVertexBaseOrigin(
  model: GoogleTransportModel,
  location: string,
): string;
declare function buildGoogleGenerativeAiParams(
  model: GoogleTransportModel,
  context: Context,
  options?: GoogleTransportOptions,
): GoogleGenerateContentRequest;
declare function resolveGoogleGemini3FirstResponseRetryMs(env?: NodeJS.ProcessEnv): number;
declare function buildGoogleGemini3FirstResponseRetryParams(params: {
  model: GoogleTransportModel;
  request: GoogleGenerateContentRequest;
}): GoogleGenerateContentRequest | undefined;
declare function createGoogleGenerativeAiTransportStreamFn(): StreamFn;
declare function createGoogleVertexTransportStreamFn(): StreamFn;
//#endregion
export {
  resolveGoogleGemini3FirstResponseRetryMs as a,
  createGoogleVertexTransportStreamFn as i,
  buildGoogleGenerativeAiParams as n,
  resolveGoogleVertexBaseOrigin as o,
  createGoogleGenerativeAiTransportStreamFn as r,
  buildGoogleGemini3FirstResponseRetryParams as t,
};
