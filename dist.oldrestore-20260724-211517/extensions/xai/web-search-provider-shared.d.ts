import { pu as WebSearchProviderPlugin } from "../../types-Ga3mNO_F.js";
//#region extensions/xai/web-search-provider-shared.d.ts
declare function buildXaiWebSearchProviderBase(): Omit<
  WebSearchProviderPlugin,
  "createTool" | "runSetup"
>;
//#endregion
export { buildXaiWebSearchProviderBase };
