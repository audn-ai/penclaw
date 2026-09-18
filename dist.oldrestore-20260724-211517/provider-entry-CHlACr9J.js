import { t as definePluginEntry } from "./plugin-entry-DzBhXPVE.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-CXfFv7q7.js";
import { c as buildSingleProviderApiKeyCatalog } from "./provider-catalog-shared-CQScmZZs.js";
import { r as projectProviderCatalogResultToUnifiedTextRows } from "./registry-B14M_H8G.js";
import {
  i as readRecordValue,
  r as isRecordWithoutThrowing,
  t as copyArrayEntries,
} from "./safe-record-Cx9ufCqd.js";
import {
  _ as uniqueStrings,
  l as normalizeStringEntries,
} from "./string-normalization-CRyoFBPt.js";
//#region src/plugin-sdk/provider-entry.ts
function resolveWizardSetup(params) {
  if (params.auth.wizard === false) return;
  const wizard = params.auth.wizard ?? {};
  const methodId = params.auth.methodId.trim();
  return {
    choiceId: wizard.choiceId ?? `${params.providerId}-${methodId}`,
    choiceLabel: wizard.choiceLabel ?? params.auth.label,
    ...(wizard.choiceHint ? { choiceHint: wizard.choiceHint } : {}),
    groupId: wizard.groupId ?? params.providerId,
    groupLabel: wizard.groupLabel ?? params.providerLabel,
    ...((wizard.groupHint ?? params.auth.hint)
      ? { groupHint: wizard.groupHint ?? params.auth.hint }
      : {}),
    methodId,
    ...(wizard.onboardingScopes ? { onboardingScopes: wizard.onboardingScopes } : {}),
    ...(wizard.modelAllowlist ? { modelAllowlist: wizard.modelAllowlist } : {}),
  };
}
function copyProviderAuthOptions(value) {
  return copyArrayEntries(value).filter(isRecordWithoutThrowing);
}
function copyProviderAuthMethods(value) {
  return copyArrayEntries(value).filter(isRecordWithoutThrowing);
}
function resolveEnvVars(params) {
  const combined = normalizeStringEntries([
    ...copyArrayEntries(params.envVars),
    ...(params.auth ?? []).map((entry) => readRecordValue(entry, "envVar")).filter(Boolean),
  ]);
  return combined.length > 0 ? uniqueStrings(combined) : void 0;
}
async function runUnifiedTextCatalog(params) {
  const result = await params.catalog.run(params.ctx);
  return projectProviderCatalogResultToUnifiedTextRows({
    providerId: params.providerId,
    result,
    source: params.source,
  });
}
/**
 * Builds a plugin entry for providers whose runtime exports exactly one primary model provider.
 */
function defineSingleProviderPluginEntry(options) {
  return definePluginEntry({
    id: options.id,
    name: options.name,
    description: options.description,
    ...(options.kind ? { kind: options.kind } : {}),
    ...(options.configSchema ? { configSchema: options.configSchema } : {}),
    register(api) {
      const provider = options.provider;
      if (provider) {
        const providerId = provider.id ?? options.id;
        const providerAuth = copyProviderAuthOptions(provider.auth);
        const acceptedProviderAuth = [];
        const auth = providerAuth.flatMap((entry) => {
          try {
            const { wizard: _wizard, ...authParams } = entry;
            const wizard = resolveWizardSetup({
              providerId,
              providerLabel: provider.label,
              auth: entry,
            });
            const method = createProviderApiKeyAuthMethod({
              ...authParams,
              providerId,
              expectedProviders: entry.expectedProviders ?? [providerId],
              ...(wizard ? { wizard } : {}),
            });
            acceptedProviderAuth.push(entry);
            return [method];
          } catch {
            return [];
          }
        });
        const envVars = resolveEnvVars({
          envVars: provider.envVars,
          auth: acceptedProviderAuth,
        });
        auth.push(...copyProviderAuthMethods(provider.extraAuth));
        let catalog;
        if ("run" in provider.catalog) {
          const catalogRun = provider.catalog.run;
          catalog = {
            order: provider.catalog.order ?? "simple",
            run: catalogRun,
          };
        } else {
          const buildProvider = provider.catalog.buildProvider;
          catalog = {
            order: "simple",
            run: (ctx) =>
              buildSingleProviderApiKeyCatalog({
                ctx,
                providerId,
                buildProvider,
                ...(provider.catalog.allowExplicitBaseUrl ? { allowExplicitBaseUrl: true } : {}),
              }),
          };
        }
        const staticCatalog =
          "run" in provider.catalog
            ? provider.catalog.staticRun
              ? {
                  order: provider.catalog.order ?? "simple",
                  run: provider.catalog.staticRun,
                }
              : void 0
            : provider.catalog.buildStaticProvider
              ? {
                  order: "simple",
                  run: async () => ({ provider: await provider.catalog.buildStaticProvider() }),
                }
              : void 0;
        api.registerProvider({
          id: providerId,
          label: provider.label,
          docsPath: provider.docsPath,
          ...(provider.aliases ? { aliases: provider.aliases } : {}),
          ...(envVars ? { envVars } : {}),
          auth,
          catalog,
          ...(staticCatalog ? { staticCatalog } : {}),
          ...Object.fromEntries(
            Object.entries(provider).filter(
              ([key]) =>
                ![
                  "id",
                  "label",
                  "docsPath",
                  "aliases",
                  "envVars",
                  "auth",
                  "extraAuth",
                  "catalog",
                  "staticCatalog",
                ].includes(key),
            ),
          ),
        });
        api.registerModelCatalogProvider({
          provider: providerId,
          kinds: ["text"],
          ...(staticCatalog
            ? {
                staticCatalog: (ctx) =>
                  runUnifiedTextCatalog({
                    providerId,
                    catalog: staticCatalog,
                    ctx,
                    source: "static",
                  }),
              }
            : {}),
          liveCatalog: (ctx) =>
            runUnifiedTextCatalog({
              providerId,
              catalog,
              ctx,
              source: "live",
            }),
        });
      }
      options.register?.(api);
    },
  });
}
//#endregion
export { defineSingleProviderPluginEntry as t };
