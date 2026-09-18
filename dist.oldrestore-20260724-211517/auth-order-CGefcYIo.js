import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-To6-j7MZ.js";
import { t as loadModelsConfig } from "./load-config--T40e-Wr.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import { n as resolveAuthStatePathForDisplay } from "./path-resolve-8wkj2l4Z.js";
import { o as setAuthProfileOrder } from "./profiles-DxTOoenK.js";
import { i as writeRuntimeJson } from "./runtime-Bz6o617W.js";
import "./auth-profiles-CX7JDmZ9.js";
import { u as resolveModelsTargetAgent } from "./shared-DFGOIlxJ.js";
import { i as ensureAuthProfileStore } from "./store-B7DoDdVM.js";
import "./model-selection-DOlkTrQa.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/models/auth-order.ts
/** Commands for viewing and editing per-agent provider auth profile order. */
function describeOrder(store, provider) {
  const providerKey = normalizeProviderId(provider);
  const order = store.order?.[providerKey];
  return Array.isArray(order) ? order : [];
}
async function resolveAuthOrderContext(opts, runtime) {
  const rawProvider = opts.provider?.trim();
  if (!rawProvider)
    throw new Error(
      `Missing --provider. Run ${formatCliCommand("openclaw models auth list")} to see saved provider profiles.`,
    );
  const provider = normalizeProviderId(rawProvider);
  const cfg = await loadModelsConfig({
    commandName: "models auth-order",
    runtime,
  });
  const { agentId, agentDir } = resolveModelsTargetAgent(cfg, opts.agent);
  return {
    cfg,
    agentId,
    agentDir,
    provider,
  };
}
/** Shows the configured auth profile priority order for a provider. */
async function modelsAuthOrderGetCommand(opts, runtime) {
  const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime);
  const order = describeOrder(
    ensureAuthProfileStore(agentDir, {
      externalCli: externalCliDiscoveryForProviderAuth({
        cfg,
        provider,
      }),
    }),
    provider,
  );
  if (opts.json) {
    writeRuntimeJson(runtime, {
      agentId,
      agentDir,
      provider,
      authStatePath: shortenHomePath(resolveAuthStatePathForDisplay(agentDir)),
      order: order.length > 0 ? order : null,
    });
    return;
  }
  runtime.log(`Agent: ${agentId}`);
  runtime.log(`Provider: ${provider}`);
  runtime.log(`Auth state store: ${shortenHomePath(resolveAuthStatePathForDisplay(agentDir))}`);
  runtime.log(order.length > 0 ? `Order override: ${order.join(", ")}` : "Order override: (none)");
}
/** Clears the configured auth profile priority order for a provider. */
async function modelsAuthOrderClearCommand(opts, runtime) {
  const { agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime);
  if (
    !(await setAuthProfileOrder({
      agentDir,
      provider,
      order: null,
    }))
  )
    throw new Error(
      `Failed to update auth state; the auth state lock may be busy. Wait a moment and rerun ${formatCliCommand("openclaw models auth order clear --provider " + provider)}.`,
    );
  runtime.log(`Agent: ${agentId}`);
  runtime.log(`Provider: ${provider}`);
  runtime.log("Cleared per-agent order override.");
}
/** Sets the provider auth profile priority order after validating each profile id. */
async function modelsAuthOrderSetCommand(opts, runtime) {
  const { cfg, agentId, agentDir, provider } = await resolveAuthOrderContext(opts, runtime);
  const store = ensureAuthProfileStore(agentDir, {
    externalCli: externalCliDiscoveryForProviderAuth({
      cfg,
      provider,
    }),
  });
  const providerKey = provider;
  const requested = normalizeStringEntries(opts.order ?? []);
  if (requested.length === 0)
    throw new Error(
      `Missing profile ids. Run ${formatCliCommand("openclaw models auth list --provider " + provider)} to choose one or more profile ids.`,
    );
  for (const profileId of requested) {
    const cred = store.profiles[profileId];
    if (!cred)
      throw new Error(
        `Auth profile "${profileId}" not found in ${shortenHomePath(agentDir)}. Run ${formatCliCommand("openclaw models auth list --provider " + provider)} to see saved profiles.`,
      );
    if (normalizeProviderId(cred.provider) !== providerKey)
      throw new Error(`Auth profile "${profileId}" is for ${cred.provider}, not ${provider}.`);
  }
  const updated = await setAuthProfileOrder({
    agentDir,
    provider,
    order: requested,
  });
  if (!updated)
    throw new Error(
      `Failed to update auth state; the auth state lock may be busy. Wait a moment and rerun ${formatCliCommand("openclaw models auth order set --provider " + provider + " <profileIds...>")}.`,
    );
  runtime.log(`Agent: ${agentId}`);
  runtime.log(`Provider: ${provider}`);
  runtime.log(`Order override: ${describeOrder(updated, provider).join(", ")}`);
}
//#endregion
export { modelsAuthOrderClearCommand, modelsAuthOrderGetCommand, modelsAuthOrderSetCommand };
