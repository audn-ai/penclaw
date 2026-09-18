import {
  g as OpenClawPluginApi,
  v as OpenClawPluginConfigSchema,
  y as OpenClawPluginDefinition$1,
} from "../plugin-entry-DPCR66aO.js";
import { t as createProviderApiKeyAuthMethod } from "../provider-api-key-auth-m_ndkcmp.js";
import { l as buildSingleProviderApiKeyCatalog } from "../provider-catalog-shared-CKAsbLP-.js";
import {
  A as OpenClawPluginDefinition,
  Et as ProviderAuthMethod,
  an as ProviderPlugin,
  on as ProviderPluginCatalog,
  un as ProviderPluginWizardSetup,
} from "../types-Ga3mNO_F.js";

//#region src/plugin-sdk/provider-entry.d.ts
type ApiKeyAuthMethodOptions = Parameters<typeof createProviderApiKeyAuthMethod>[0];
/**
 * API-key auth options for single-provider plugins, with provider id filled in by the entry helper.
 */
type SingleProviderPluginApiKeyAuthOptions = Omit<
  ApiKeyAuthMethodOptions,
  "providerId" | "expectedProviders" | "wizard"
> & {
  /**
   * Provider ids this auth method is allowed to satisfy; defaults to the single
   * provider id declared by the plugin entry.
   */
  expectedProviders?: string[];
  /**
   * Wizard metadata for setup flows, or `false` when the method should be
   * registered without an onboarding choice.
   */
  wizard?: false | ProviderPluginWizardSetup;
};
/**
 * Catalog configuration accepted by the single-provider entry helper.
 */
type SingleProviderPluginCatalogOptions =
  | {
      /**
       * Builds the live provider catalog through the shared API-key catalog path.
       */
      buildProvider: Parameters<typeof buildSingleProviderApiKeyCatalog>[0]["buildProvider"];
      /**
       * Builds a static catalog for cheap model discovery before credentials are resolved.
       */
      buildStaticProvider?: Parameters<typeof buildSingleProviderApiKeyCatalog>[0]["buildProvider"];
      /**
       * Allows operator-configured base URLs to override the provider catalog base URL.
       */
      allowExplicitBaseUrl?: boolean;
      run?: never;
      order?: never;
      staticRun?: never;
    }
  | {
      /**
       * Runs a fully custom provider catalog implementation.
       */
      run: ProviderPluginCatalog["run"];
      /**
       * Optional static variant for custom catalog implementations.
       */
      staticRun?: ProviderPluginCatalog["run"];
      /**
       * Catalog ordering contract forwarded to the core provider registry.
       */
      order?: ProviderPluginCatalog["order"];
      buildProvider?: never;
      buildStaticProvider?: never;
      allowExplicitBaseUrl?: never;
    };
/**
 * Defines one provider plugin plus optional extra registration hooks.
 */
type SingleProviderPluginOptions = {
  /**
   * Plugin id and default provider id when `provider.id` is omitted.
   */
  id: string;
  /**
   * Display name registered for the plugin entry.
   */
  name: string;
  /**
   * Short plugin description surfaced by plugin registries and setup flows.
   */
  description: string;
  /**
   * @deprecated Declare exclusive plugin kind in `openclaw.plugin.json` via
   * manifest `kind`. Runtime-entry `kind` remains only as a compatibility
   * fallback for older plugins.
   */
  kind?: OpenClawPluginDefinition$1["kind"];
  /**
   * Optional plugin configuration schema or lazy schema factory.
   */
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  /**
   * Primary provider registration. Extra provider fields are forwarded after
   * the helper-owned id/auth/catalog fields are normalized.
   */
  provider?: {
    /**
     * Provider id override when the runtime provider id differs from the plugin id.
     */
    id?: string;
    /**
     * Human-readable provider label.
     */
    label: string;
    /**
     * Documentation route used by provider setup and diagnostics.
     */
    docsPath: string;
    /**
     * Alternate provider ids accepted by routing and configuration lookups.
     */
    aliases?: string[];
    /**
     * Explicit environment variables advertised for credentials.
     */
    envVars?: string[];
    /**
     * API-key auth methods converted through the shared provider auth helper.
     */
    auth?: SingleProviderPluginApiKeyAuthOptions[];
    /**
     * Non-API-key auth methods appended after generated API-key methods.
     */
    extraAuth?: ProviderAuthMethod[];
    /**
     * Live/static catalog implementation for this provider.
     */
    catalog: SingleProviderPluginCatalogOptions;
  } & Omit<
    ProviderPlugin,
    "id" | "label" | "docsPath" | "aliases" | "envVars" | "auth" | "catalog" | "staticCatalog"
  >;
  /**
   * Optional hook for registering companion capabilities with the same plugin entry.
   */
  register?: (api: OpenClawPluginApi) => void;
};
/**
 * Builds a plugin entry for providers whose runtime exports exactly one primary model provider.
 */
declare function defineSingleProviderPluginEntry(options: SingleProviderPluginOptions): {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<
  OpenClawPluginDefinition,
  "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors"
>;
//#endregion
export {
  SingleProviderPluginApiKeyAuthOptions,
  SingleProviderPluginCatalogOptions,
  SingleProviderPluginOptions,
  defineSingleProviderPluginEntry,
};
