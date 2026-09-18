import { qt as ProviderResolveDynamicModelContext } from "./plugin-entry-DPCR66aO.js";
import { f as Model, n as Api } from "./types-CqrbBnUB.js";

//#region extensions/xai/provider-models.d.ts
declare function isModernXaiModel(modelId: string): boolean;
declare function resolveXaiForwardCompatModel(params: {
  providerId: string;
  ctx: ProviderResolveDynamicModelContext;
}):
  | (Model<Api> & {
      compat: Record<string, unknown>;
      thinkingLevelMap: Partial<
        Record<"off" | "minimal" | "low" | "medium" | "high" | "xhigh", string | null>
      >;
    })
  | undefined;
//#endregion
export { resolveXaiForwardCompatModel as n, isModernXaiModel as t };
