import {
  p as pluginCommands,
  r as pluginCommandSupportsChannel,
} from "./command-registration-CTCK5hi-.js";
import { i as resolveReadOnlyChannelCommandDefaults } from "./read-only-command-defaults-BmUAoxHz.js";
import { n as getLoadedChannelPlugin } from "./registry-mc8oBRx8.js";
import "./plugins-BKdf-5tW.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
//#region src/plugins/command-specs.ts
function resolvePluginNativeName(command, provider) {
  const providerName = normalizeOptionalLowercaseString(provider);
  const providerOverride = providerName ? command.nativeNames?.[providerName] : void 0;
  if (typeof providerOverride === "string" && providerOverride.trim())
    return providerOverride.trim();
  const defaultOverride = command.nativeNames?.default;
  if (typeof defaultOverride === "string" && defaultOverride.trim()) return defaultOverride.trim();
  return command.name.trim() || command.name;
}
function resolvePluginTextName(command) {
  return command.name.trim() || command.name;
}
function pluginNativeCommandsEnabled(providerName, options) {
  if (!providerName) return true;
  const commandDefaults = options.config
    ? resolveReadOnlyChannelCommandDefaults(providerName, {
        ...options,
        config: options.config,
      })
    : void 0;
  return (
    (getLoadedChannelPlugin(providerName)?.commands ?? commandDefaults)
      ?.nativeCommandsAutoEnabled === true
  );
}
function getPluginCommandSpecs(provider, options = {}) {
  const providerName = normalizeOptionalLowercaseString(provider);
  if (!pluginNativeCommandsEnabled(providerName, options)) return [];
  return listProviderPluginCommandSpecs(providerName);
}
function getPluginCommandEntrySpecs(provider, options = {}) {
  const providerName = normalizeOptionalLowercaseString(provider);
  const nativeCommandsEnabled = pluginNativeCommandsEnabled(providerName, options);
  return Array.from(pluginCommands.values())
    .map((cmd) => serializePluginCommandEntrySpec(cmd, providerName, nativeCommandsEnabled))
    .filter((spec) => spec !== null);
}
function getPluginCommandEntrySpecsFromRegistrations(commands, provider, options = {}) {
  const providerName = normalizeOptionalLowercaseString(provider);
  const nativeCommandsEnabled = pluginNativeCommandsEnabled(providerName, options);
  return commands
    .map((entry) =>
      serializePluginCommandEntrySpec(entry.command, providerName, nativeCommandsEnabled),
    )
    .filter((spec) => spec !== null);
}
/** Resolve plugin command specs for a provider's native naming surface without support gating. */
function listProviderPluginCommandSpecs(provider) {
  return Array.from(pluginCommands.values())
    .filter((cmd) => pluginCommandSupportsChannel(cmd, provider))
    .map((cmd) => serializePluginCommandSpec(cmd, provider));
}
function serializePluginCommandSpec(cmd, provider) {
  const spec = {
    name: resolvePluginNativeName(cmd, provider),
    description: cmd.description.trim(),
    acceptsArgs: cmd.acceptsArgs ?? false,
  };
  if (cmd.descriptionLocalizations) spec.descriptionLocalizations = cmd.descriptionLocalizations;
  return spec;
}
function serializePluginCommandEntrySpec(cmd, provider, nativeCommandsEnabled) {
  if (!pluginCommandSupportsChannel(cmd, provider)) return null;
  const nativeName = nativeCommandsEnabled ? resolvePluginNativeName(cmd, provider) : void 0;
  return {
    name: resolvePluginTextName(cmd),
    description: cmd.description.trim(),
    acceptsArgs: cmd.acceptsArgs ?? false,
    ...(nativeName ? { nativeName } : {}),
  };
}
//#endregion
export {
  listProviderPluginCommandSpecs as i,
  getPluginCommandEntrySpecsFromRegistrations as n,
  getPluginCommandSpecs as r,
  getPluginCommandEntrySpecs as t,
};
