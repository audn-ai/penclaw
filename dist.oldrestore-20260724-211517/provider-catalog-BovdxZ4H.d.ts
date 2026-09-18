import {
  m as ModelProviderDeclarationConfig,
  s as ModelDefinitionConfig,
} from "./types.models-BqJSiNyu.js";
//#region extensions/volcengine/provider-catalog.d.ts
declare function buildDoubaoProvider(): ModelProviderDeclarationConfig;
declare function buildDoubaoCodingProvider(): ModelProviderDeclarationConfig;
declare const VOLCENGINE_PROVIDER_CATALOG_ENTRIES: readonly [
  {
    readonly id: "volcengine";
    readonly label: "Volcengine";
    readonly models: ModelDefinitionConfig[];
    readonly buildProvider: typeof buildDoubaoProvider;
  },
  {
    readonly id: "volcengine-plan";
    readonly label: "Volcengine Plan";
    readonly models: ModelDefinitionConfig[];
    readonly buildProvider: typeof buildDoubaoCodingProvider;
  },
];
//#endregion
export {
  buildDoubaoCodingProvider as n,
  buildDoubaoProvider as r,
  VOLCENGINE_PROVIDER_CATALOG_ENTRIES as t,
};
