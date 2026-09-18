import {
  m as ModelProviderDeclarationConfig,
  s as ModelDefinitionConfig,
} from "./types.models-BqJSiNyu.js";
//#region extensions/byteplus/provider-catalog.d.ts
/** Builds the standard BytePlus model provider config. */
declare function buildBytePlusProvider(): ModelProviderDeclarationConfig;
/** Builds the BytePlus Plan coding-provider config. */
declare function buildBytePlusCodingProvider(): ModelProviderDeclarationConfig;
declare const BYTEPLUS_PROVIDER_CATALOG_ENTRIES: readonly [
  {
    readonly id: "byteplus";
    readonly label: "BytePlus";
    readonly models: ModelDefinitionConfig[];
    readonly buildProvider: typeof buildBytePlusProvider;
  },
  {
    readonly id: "byteplus-plan";
    readonly label: "BytePlus Plan";
    readonly models: ModelDefinitionConfig[];
    readonly buildProvider: typeof buildBytePlusCodingProvider;
  },
];
//#endregion
export {
  buildBytePlusCodingProvider as n,
  buildBytePlusProvider as r,
  BYTEPLUS_PROVIDER_CATALOG_ENTRIES as t,
};
