import {
  a as ModelApi,
  l as ModelMediaInputConfig,
  o as ModelCompatConfig,
} from "./types.models-BqJSiNyu.js";

//#region src/agents/model-catalog.types.d.ts
/** Input modalities a catalog entry can advertise. */
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
/** Normalized model metadata exposed by the agent model catalog. */
type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string;
  alias?: string;
  api?: ModelApi /** Private transport provenance for route matching; never project directly to clients. */;
  baseUrl?: string;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  input?: ModelInputType[];
  params?: Record<string, unknown>;
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
};
/** Logical catalog rows plus the physical variants used for route selection. */
type ModelCatalogSnapshot = {
  entries: ModelCatalogEntry[];
  routeVariants: ModelCatalogEntry[];
};
//#endregion
export { ModelCatalogSnapshot as n, ModelInputType as r, ModelCatalogEntry as t };
