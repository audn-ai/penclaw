import {
  Ct as ProviderCatalogContext,
  It as ProviderPrepareDynamicModelContext,
  qt as ProviderResolveDynamicModelContext,
  wt as ProviderCatalogResult,
} from "../../plugin-entry-DPCR66aO.js";
import { nd as ProviderRuntimeModel } from "../../types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/github-copilot/dynamic-models.d.ts
declare function createGithubCopilotDynamicModelHooks(params: {
  discoveryEnabled(config?: OpenClawConfig): boolean;
}): {
  prepareDynamicModel: (ctx: ProviderPrepareDynamicModelContext) => Promise<void>;
  resolveDynamicModel: (
    ctx: ProviderResolveDynamicModelContext,
  ) => ProviderRuntimeModel | undefined;
  runCatalog: (ctx: ProviderCatalogContext) => Promise<ProviderCatalogResult>;
  preferRuntimeResolvedModel: ({ config }: { config?: OpenClawConfig }) => boolean;
};
//#endregion
export { createGithubCopilotDynamicModelHooks };
