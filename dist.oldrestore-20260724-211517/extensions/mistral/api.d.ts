import {
  i as buildMistralModelDefinition,
  n as MISTRAL_DEFAULT_MODEL_ID,
  t as MISTRAL_BASE_URL,
} from "../../model-definitions-DbydBHPr.js";
import {
  n as applyMistralConfig,
  r as applyMistralProviderConfig,
  t as MISTRAL_DEFAULT_MODEL_REF,
} from "../../onboard-BlkZ0oGr.js";
import { t as buildMistralProvider } from "../../provider-catalog-CXHqMt9I.js";

//#region extensions/mistral/api.d.ts
declare const MISTRAL_MODEL_TRANSPORT_PATCH: {
  readonly supportsStore: false;
  readonly supportsPromptCacheKey: true;
  readonly supportsLongCacheRetention: false;
  readonly maxTokensField: "max_tokens";
};
declare const MISTRAL_SMALL_LATEST_ID = "mistral-small-latest";
declare const MISTRAL_SMALL_4_ID = "mistral-small-2603";
declare const MISTRAL_MEDIUM_3_5_ID = "mistral-medium-3-5";
declare function resolveMistralCompatPatch(model: { id?: string }): {
  supportsStore: boolean;
  supportsPromptCacheKey: boolean;
  supportsLongCacheRetention: boolean;
  supportsReasoningEffort: boolean;
  maxTokensField: "max_tokens";
  reasoningEffortMap?: Record<string, string>;
};
declare function applyMistralModelCompat<
  T extends {
    compat?: unknown;
    id?: string;
  },
>(model: T): T;
//#endregion
export {
  MISTRAL_BASE_URL,
  MISTRAL_DEFAULT_MODEL_ID,
  MISTRAL_DEFAULT_MODEL_REF,
  MISTRAL_MEDIUM_3_5_ID,
  MISTRAL_MODEL_TRANSPORT_PATCH,
  MISTRAL_SMALL_4_ID,
  MISTRAL_SMALL_LATEST_ID,
  applyMistralConfig,
  applyMistralModelCompat,
  applyMistralProviderConfig,
  buildMistralModelDefinition,
  buildMistralProvider,
  resolveMistralCompatPatch,
};
