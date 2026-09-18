import { u as findCatalogTemplate } from "../../provider-catalog-shared-CKAsbLP-.js";
import {
  h as matchesExactOrPrefix,
  m as cloneFirstTemplateModel,
} from "../../provider-model-shared-BImyLrKQ.js";
import { an as ProviderPlugin } from "../../types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";

//#region extensions/openai/shared.d.ts
type SyntheticOpenAIModelCatalogCost = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
type SyntheticOpenAIModelCatalogEntry = {
  provider: string;
  id: string;
  name: string;
  reasoning?: boolean;
  input?: ("text" | "image")[];
  contextWindow?: number;
  contextTokens?: number;
  cost?: SyntheticOpenAIModelCatalogCost;
};
declare function resolveConfiguredOpenAIBaseUrl(cfg: OpenClawConfig | undefined): string;
type OpenAIResponsesProviderHooks = Pick<
  ProviderPlugin,
  | "buildReplayPolicy"
  | "prepareExtraParams"
  | "wrapStreamFn"
  | "resolveTransportTurnState"
  | "resolveWebSocketSessionPolicy"
>;
declare function buildOpenAIResponsesProviderHooks(options?: {
  transport?: "auto" | "sse" | "websocket";
}): OpenAIResponsesProviderHooks;
declare function buildOpenAISyntheticCatalogEntry(
  template: ReturnType<typeof findCatalogTemplate>,
  entry: {
    id: string;
    reasoning: boolean;
    input: readonly ("text" | "image")[];
    contextWindow: number;
    contextTokens?: number;
    cost?: SyntheticOpenAIModelCatalogCost;
  },
): SyntheticOpenAIModelCatalogEntry | undefined;
//#endregion
export {
  buildOpenAIResponsesProviderHooks,
  buildOpenAISyntheticCatalogEntry,
  cloneFirstTemplateModel,
  findCatalogTemplate,
  matchesExactOrPrefix,
  resolveConfiguredOpenAIBaseUrl,
};
