import { t as normalizeAlias } from "./alias-name-Bwsh7Ooz.js";
import { t as createClackPrompter } from "./clack-prompter-Cu4E8Cn1.js";
import { t as ClawHubRequestError, u as fetchClawHubPromotion } from "./clawhub-CgGOpxts.js";
import { r as repairCodexRuntimePluginInstallForModelSelection } from "./codex-runtime-plugin-install-Db4E_THw.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { n as repairCopilotRuntimePluginInstallForModelSelection } from "./copilot-runtime-plugin-install-CLh9D0hH.js";
import { n as enablePluginInConfig } from "./enable-DK_lFguo.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { n as formatConfigIssueLines } from "./issue-format-IJKFr2SL.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import { c as hasAvailableAuthForProvider } from "./model-auth-BWFdcEzF.js";
import {
  a as recordPromotionClaim,
  n as markPromotionSlugsNotified,
} from "./promotions-feed-D5HxW60S.js";
import { r as promptYesNo } from "./prompt-DMGJRcz7.js";
import { t as applyAuthChoiceLoadedPluginProvider } from "./provider-auth-choice-B9o6YJ0E.js";
import { n as resolveManifestProviderAuthChoice } from "./provider-auth-choices-LxMRetjr.js";
import { r as resolveProviderInstallCatalogEntry } from "./provider-install-catalog-BrWdgyBm.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import {
  d as updateConfig,
  f as upsertCanonicalModelConfigEntry,
  t as applyDefaultModelPrimaryUpdate,
} from "./shared-DFGOIlxJ.js";
//#region src/commands/promos/claim.ts
/** Claims a ClawHub promotion: configures provider auth and registers its models. */
function resolvePromotionModelTarget(promotion, modelRef) {
  const provider = promotion.provider ?? "";
  const prefix = `${provider}/`;
  if (!modelRef.startsWith(prefix) || modelRef.length <= prefix.length)
    throw new Error(
      `Promotion "${promotion.slug}" lists model "${modelRef}" outside its provider "${provider}"; refusing to configure it.`,
    );
  return {
    provider,
    model: modelRef.slice(prefix.length),
  };
}
async function fetchLivePromotion(slug) {
  try {
    return await fetchClawHubPromotion({ slug });
  } catch (error) {
    if (error instanceof ClawHubRequestError && error.status === 404)
      throw new Error(
        `Promotion "${slug}" was not found or is not live. See ${formatCliCommand("openclaw promos list")}.`,
        { cause: error },
      );
    throw error;
  }
}
function requireLiveWindow(promotion) {
  const now = Date.now();
  if (now > promotion.endsAt)
    throw new Error(
      `Promotion "${promotion.slug}" ended on ${new Date(promotion.endsAt).toLocaleDateString()}.`,
    );
  if (now < promotion.startsAt || !promotion.active)
    throw new Error(`Promotion "${promotion.slug}" is not live yet.`);
}
function promotionClaimContract(promotion) {
  return JSON.stringify({
    slug: promotion.slug,
    startsAt: promotion.startsAt,
    endsAt: promotion.endsAt,
    provider: promotion.provider ?? null,
    authChoiceId: promotion.authChoiceId ?? null,
    pluginNames: [...(promotion.pluginNames ?? [])].toSorted(),
    models: promotion.models.map((model) => ({
      modelRef: model.modelRef,
      alias: model.alias ?? null,
      suggestedDefault: Boolean(model.suggestedDefault),
    })),
  });
}
function requireUnchangedClaimContract(initial, revalidated) {
  if (promotionClaimContract(initial) === promotionClaimContract(revalidated)) return;
  throw new Error(
    `Promotion "${initial.slug}" changed while the claim was in progress; no promotional models were added. Any provider credentials you just configured were kept. Run ${formatCliCommand("openclaw promos list")} and retry.`,
  );
}
function resolveManifestPluginPackageNames(pluginId, cfg) {
  const snapshot = loadManifestMetadataSnapshot({ config: cfg });
  return [
    ...new Set(
      snapshot.manifestRegistry.plugins
        .filter((plugin) => plugin.id === pluginId)
        .map((plugin) => plugin.packageName?.trim())
        .filter((name) => Boolean(name)),
    ),
  ];
}
function resolveCatalogPluginPackageNames(entry) {
  const npmPackage =
    entry.installSource?.npm?.expectedPackageName ?? entry.installSource?.npm?.packageName;
  return [
    ...new Set(
      [npmPackage, entry.installSource?.clawhub?.packageName].filter((name) => Boolean(name)),
    ),
  ];
}
function resolveAuthChoice(promotion, provider, cfg) {
  const authChoiceId = promotion.authChoiceId?.trim();
  if (!authChoiceId) return;
  const manifestEntry = resolveManifestProviderAuthChoice(authChoiceId, {
    config: cfg,
    includeUntrustedWorkspacePlugins: false,
  });
  const catalogEntry = manifestEntry
    ? void 0
    : resolveProviderInstallCatalogEntry(authChoiceId, {
        config: cfg,
        includeUntrustedWorkspacePlugins: false,
      });
  const entry = manifestEntry ?? catalogEntry;
  if (!entry)
    throw new Error(
      `Promotion "${promotion.slug}" requires auth choice "${authChoiceId}", which this OpenClaw version does not know. Update OpenClaw and retry.`,
    );
  if (entry.providerId !== provider)
    throw new Error(
      `Promotion "${promotion.slug}" declares provider "${provider}" but its auth choice belongs to "${entry.providerId}"; refusing to configure it.`,
    );
  const packageNames = manifestEntry
    ? resolveManifestPluginPackageNames(manifestEntry.pluginId, cfg)
    : catalogEntry
      ? resolveCatalogPluginPackageNames(catalogEntry)
      : [];
  return {
    entry,
    installed: Boolean(manifestEntry),
    packageNames,
  };
}
function requirePromotionPlugins(promotion, authChoice) {
  const declared = promotion.pluginNames ?? [];
  if (declared.length === 0) return;
  const knownPackages = new Set(authChoice?.packageNames ?? []);
  const unsupported = declared.filter((name) => !knownPackages.has(name));
  if (unsupported.length === 0) return;
  const authChoiceLabel = authChoice
    ? `auth choice "${authChoice.entry.choiceId}"`
    : "a missing auth choice";
  throw new Error(
    `Promotion "${promotion.slug}" requires plugin package "${unsupported[0]}", but ${authChoiceLabel} does not provide it in this OpenClaw version. Update OpenClaw and retry.`,
  );
}
async function readValidConfigSnapshot() {
  const snapshot = await readConfigFileSnapshot();
  if (!snapshot.valid) {
    const issues = formatConfigIssueLines(snapshot.issues, "-").join("\n");
    throw new Error(`Invalid config at ${snapshot.path}\n${issues}`);
  }
  return snapshot;
}
async function ensureProviderAuth(params) {
  const { promotion, provider, authChoice, snapshot, opts, runtime } = params;
  const catalogEntry = authChoice?.entry;
  const runtimeConfig = snapshot.runtimeConfig ?? snapshot.config;
  const apiKey = opts.apiKey?.trim();
  if (
    !apiKey &&
    (authChoice?.installed ?? true) &&
    (await hasAvailableAuthForProvider({
      provider,
      cfg: runtimeConfig,
    }))
  ) {
    runtime.log(`Using your existing ${provider} credentials.`);
    return;
  }
  if (!catalogEntry)
    throw new Error(
      `No credentials configured for provider "${provider}". Add one with ${formatCliCommand("openclaw models auth add")} and retry.`,
    );
  if (promotion.signupUrl)
    runtime.log(`Get a free key for this promotion: ${sanitizeTerminalText(promotion.signupUrl)}`);
  if (apiKey && !catalogEntry.optionKey)
    throw new Error(
      `Auth choice "${catalogEntry.choiceId}" does not accept --api-key; run without it to authenticate interactively.`,
    );
  const applied = await applyAuthChoiceLoadedPluginProvider({
    authChoice: catalogEntry.choiceId,
    config: structuredClone(snapshot.sourceConfig ?? snapshot.config),
    prompter: createClackPrompter(),
    runtime,
    setDefaultModel: false,
    opts: apiKey && catalogEntry.optionKey ? { [catalogEntry.optionKey]: apiKey } : void 0,
  });
  const authCompleted =
    applied &&
    !applied.retrySelection &&
    (await hasAvailableAuthForProvider({
      provider,
      cfg: applied.config,
    }));
  if (!applied || !authCompleted)
    throw new Error(`Authentication for "${provider}" was not completed; nothing was changed.`);
  await replaceConfigFile({
    nextConfig: applied.config,
    baseHash: snapshot.hash,
  });
}
function aliasTaken(models, alias) {
  const lowered = alias.toLowerCase();
  return Object.values(models).some((entry) => entry.alias?.toLowerCase() === lowered);
}
async function promosClaimCommand(slugRaw, opts, runtime) {
  const slug = slugRaw.trim().toLowerCase();
  if (!slug) throw new Error("Promotion slug required.");
  let promotion = await fetchLivePromotion(slug);
  requireLiveWindow(promotion);
  const provider = promotion.provider?.trim();
  if (!provider)
    throw new Error(
      `Promotion "${slug}" does not declare a provider; it cannot be claimed from the CLI.`,
    );
  for (const model of promotion.models) resolvePromotionModelTarget(promotion, model.modelRef);
  const snapshot = await readValidConfigSnapshot();
  const authChoice = resolveAuthChoice(
    promotion,
    provider,
    snapshot.runtimeConfig ?? snapshot.config,
  );
  requirePromotionPlugins(promotion, authChoice);
  await ensureProviderAuth({
    promotion,
    provider,
    authChoice,
    snapshot,
    opts,
    runtime,
  });
  const suggested = promotion.models.find((model) => model.suggestedDefault) ?? promotion.models[0];
  let makeDefault = Boolean(opts.setDefault && suggested);
  if (!makeDefault && suggested && process.stdin.isTTY)
    makeDefault = await promptYesNo(`Set ${suggested.modelRef} as your default model?`, false);
  const revalidatedPromotion = await fetchLivePromotion(slug);
  requireLiveWindow(revalidatedPromotion);
  requireUnchangedClaimContract(promotion, revalidatedPromotion);
  promotion = revalidatedPromotion;
  const registered = [];
  const skippedAliases = [];
  const invalidAliases = [];
  const updated = await updateConfig((cfg, context) => {
    let base = cfg;
    if (authChoice) {
      const enabled = enablePluginInConfig(base, authChoice.entry.pluginId);
      if (!enabled.enabled)
        throw new Error(
          `The "${authChoice.entry.pluginId}" plugin is blocked by your plugin policy (${enabled.reason ?? "disabled"}); cannot claim this promotion.`,
        );
      base = enabled.config;
    }
    const models = { ...base.agents?.defaults?.models };
    for (const model of promotion.models) {
      const key = upsertCanonicalModelConfigEntry(
        models,
        resolvePromotionModelTarget(promotion, model.modelRef),
      );
      let alias;
      try {
        alias = model.alias ? normalizeAlias(model.alias) : void 0;
      } catch {
        invalidAliases.push(model.alias ?? "");
      }
      if (alias && !models[key]?.alias)
        if (aliasTaken(models, alias)) skippedAliases.push(alias);
        else
          models[key] = {
            ...models[key],
            alias,
          };
      registered.push(key);
    }
    let next = {
      ...base,
      agents: {
        ...base.agents,
        defaults: {
          ...base.agents?.defaults,
          models,
        },
      },
    };
    if (makeDefault && suggested)
      next = applyDefaultModelPrimaryUpdate({
        cfg: next,
        resolveCfg: context.runtimeConfig,
        modelRaw: suggested.modelRef,
        field: "model",
      });
    return next;
  });
  recordPromotionClaim({
    slug: promotion.slug,
    provider,
    modelKeys: [...new Set(registered)],
    endsAtMs: promotion.endsAt,
    claimedAtMs: Date.now(),
  });
  markPromotionSlugsNotified([promotion.slug]);
  if (makeDefault && suggested) {
    const repaired = await repairCodexRuntimePluginInstallForModelSelection({
      cfg: updated,
      model: suggested.modelRef,
    });
    const copilotRepaired = await repairCopilotRuntimePluginInstallForModelSelection({
      cfg: updated,
      model: suggested.modelRef,
    });
    for (const warning of [...repaired.warnings, ...copilotRepaired.warnings])
      runtime.error?.(warning);
  }
  runtime.log(`Claimed "${sanitizeTerminalText(promotion.title)}".`);
  for (const key of registered) runtime.log(`  Added model: ${sanitizeTerminalText(key)}`);
  for (const alias of skippedAliases)
    runtime.log(
      `  Alias "${sanitizeTerminalText(alias)}" is already in use; kept your existing alias.`,
    );
  for (const alias of invalidAliases)
    runtime.log(`  Alias "${sanitizeTerminalText(alias)}" is not a valid model alias; skipped it.`);
  if (makeDefault && suggested) {
    runtime.log(`  Default model set to ${sanitizeTerminalText(suggested.modelRef)}.`);
    runtime.log(
      `  Revert anytime with ${formatCliCommand("openclaw models set <previous-model>")}.`,
    );
  } else if (suggested)
    runtime.log(
      `  Try it: ${formatCliCommand(`openclaw models set ${suggested.modelRef}`)} (promotion ends ${new Date(promotion.endsAt).toLocaleDateString()}).`,
    );
}
//#endregion
export { promosClaimCommand };
