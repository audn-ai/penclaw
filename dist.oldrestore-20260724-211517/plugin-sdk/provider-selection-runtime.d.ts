//#region src/plugin-sdk/provider-selection-runtime.d.ts
/** Provider descriptor fields needed for explicit or automatic selection. */
type AutoSelectableProvider = {
  /** Provider id used for explicit config lookup and selected result metadata. */ id: string /** Lower values win when no explicit provider is configured. */;
  autoSelectOrder?: number;
};
/** Provider selection result before capability-specific configuration checks run. */
type ProviderSelection<TProvider> = {
  /** Normalized explicit provider id, when the caller supplied one. */ configuredProviderId?: string /** True when an explicit provider id was configured but no provider was registered. */;
  missingConfiguredProvider: boolean /** Selected provider, either explicit or the first auto-selectable provider. */;
  provider: TProvider | undefined;
};
/** Final provider resolution result including capability-specific config. */
type ResolvedConfiguredProvider<TProvider, TConfig> =
  | {
      /** Provider exists and passed the capability-specific configuration check. */ ok: true /** Normalized explicit provider id, when the caller supplied one. */;
      configuredProviderId?: string /** Selected provider plugin/descriptor. */;
      provider: TProvider /** Capability-specific provider config resolved for the selected provider. */;
      providerConfig: TConfig;
    }
  | {
      /** Provider selection failed before a configured provider could be used. */ ok: false /** Stable failure code for setup/runtime callers. */;
      code:
        | "missing-configured-provider"
        | "no-registered-provider"
        | "provider-not-configured" /** Normalized explicit provider id, when the caller supplied one. */;
      configuredProviderId?: string /** Candidate provider that existed but failed configuration checks. */;
      provider?: TProvider;
    };
/** Select an explicit provider when configured, otherwise the lowest-order auto provider. */
declare function selectConfiguredOrAutoProvider<TProvider extends AutoSelectableProvider>(params: {
  /** Optional explicit provider id from config or user input. */ configuredProviderId?: string /** Lookup for an explicit provider id after normalization. */;
  getConfiguredProvider: (
    providerId: string | undefined,
  ) => TProvider | undefined /** Iterable of providers eligible for auto-selection. */;
  listProviders: () => Iterable<TProvider>;
}): ProviderSelection<TProvider>;
/** Merge canonical provider config with selected-provider override config. */
declare function resolveProviderRawConfig(params: {
  /** Canonical provider id whose default config should be read first. */ providerId: string /** Optional selected/alias provider id whose config overrides canonical values. */;
  configuredProviderId?: string /** Provider config map keyed by canonical and configured provider ids. */;
  providerConfigs?: Record<string, Record<string, unknown> | undefined>;
}): Record<string, unknown>;
/** Resolve a configured or auto-selected provider that passes capability config checks. */
declare function resolveConfiguredCapabilityProvider<
  TConfig,
  TFullConfig,
  TProvider extends AutoSelectableProvider,
>(params: {
  /** Optional explicit provider id from config or user input. */ configuredProviderId?: string /** Provider config map used to merge canonical and selected provider settings. */;
  providerConfigs?: Record<
    string,
    Record<string, unknown> | undefined
  > /** Current full config used only for configured-state checks. */;
  cfg: TFullConfig | undefined /** Full config passed to provider config resolution. */;
  cfgForResolve: TFullConfig /** Lookup for an explicit provider id after normalization. */;
  getConfiguredProvider: (
    providerId: string | undefined,
  ) => TProvider | undefined /** Iterable of providers eligible for auto-selection. */;
  listProviders: () => Iterable<TProvider>;
  resolveProviderConfig: (params: {
    /** Candidate provider being resolved. */ provider: TProvider /** Full config passed through for capability-specific config resolution. */;
    cfg: TFullConfig /** Merged raw provider config for canonical and selected provider ids. */;
    rawConfig: Record<string, unknown>;
  }) => TConfig;
  isProviderConfigured: (params: {
    /** Candidate provider being checked. */ provider: TProvider /** Current full config used by capability-specific configured checks. */;
    cfg: TFullConfig | undefined /** Resolved capability-specific provider config. */;
    providerConfig: TConfig;
  }) => boolean;
}): ResolvedConfiguredProvider<TProvider, TConfig>;
//#endregion
export {
  AutoSelectableProvider,
  ProviderSelection,
  ResolvedConfiguredProvider,
  resolveConfiguredCapabilityProvider,
  resolveProviderRawConfig,
  selectConfiguredOrAutoProvider,
};
