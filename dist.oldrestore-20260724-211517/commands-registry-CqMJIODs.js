import {
  n as listChatCommands,
  r as listChatCommandsForConfig,
} from "./commands-registry-list-dryYO7Ry.js";
import { r as normalizeCommandBody } from "./commands-registry-normalize-C6c5CQe0.js";
import "./src-Bl7G9qvi.js";
import { t as getChatCommands } from "./commands-registry.data-uuI1tQ04.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./plugins-BKdf-5tW.js";
import "./model-selection-DOlkTrQa.js";
import {
  r as buildConfiguredModelCatalog,
  v as resolveConfiguredModelRef,
} from "./model-selection-shared-BliwFXJy.js";
import { n as getLoadedChannelPlugin, t as getChannelPlugin } from "./registry-mc8oBRx8.js";
import { s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import "./commands-text-routing-iDHdTNyq.js";
//#region src/auto-reply/commands-registry.ts
/** Command-registry facade for native specs, text aliases, argument parsing, and menus. */
/** Resolves provider-specific native command names while preserving registry defaults. */
function resolveNativeName(command, provider, options) {
  if (!command.nativeName) return;
  if (!provider) return command.nativeName;
  return (
    (options?.includeBundledChannelFallback === false
      ? getLoadedChannelPlugin(provider)
      : getChannelPlugin(provider)
    )?.commands?.resolveNativeCommandName?.({
      commandKey: command.key,
      defaultName: command.nativeName,
    }) ?? command.nativeName
  );
}
function toNativeCommandSpec(command, provider) {
  const spec = {
    name: resolveNativeName(command, provider) ?? command.key,
    description: command.description,
    acceptsArgs: Boolean(command.acceptsArgs),
    args: command.args,
  };
  if (command.descriptionLocalizations)
    spec.descriptionLocalizations = command.descriptionLocalizations;
  return spec;
}
function resolveNativeNames(command, provider) {
  return [resolveNativeName(command, provider), ...(command.nativeAliases ?? [])].filter((name) =>
    Boolean(name),
  );
}
function supportsNativeProvider(command, provider) {
  if (!command.nativeProviders?.length) return true;
  const normalizedProvider = normalizeOptionalLowercaseString(provider);
  if (!normalizedProvider) return false;
  return command.nativeProviders.some(
    (candidate) => normalizeOptionalLowercaseString(candidate) === normalizedProvider,
  );
}
function listNativeSpecsFromCommands(commands, provider) {
  return commands
    .filter(
      (command) =>
        command.scope !== "text" && command.nativeName && supportsNativeProvider(command, provider),
    )
    .flatMap((command) => {
      const spec = toNativeCommandSpec(command, provider);
      return resolveNativeNames(command, provider).map((name, index) => {
        const nativeSpec = {
          name,
          description: spec.description,
          acceptsArgs: spec.acceptsArgs,
        };
        if (index > 0) nativeSpec.isAlias = true;
        if (spec.args) nativeSpec.args = spec.args;
        if (spec.descriptionLocalizations)
          nativeSpec.descriptionLocalizations = spec.descriptionLocalizations;
        return nativeSpec;
      });
    });
}
/** Lists native command specs registered for a provider, including skill commands. */
function listNativeCommandSpecs(params) {
  return listNativeSpecsFromCommands(
    listChatCommands({ skillCommands: params?.skillCommands }),
    params?.provider,
  );
}
/** Lists native command specs that are enabled for the provided config. */
function listNativeCommandSpecsForConfig(cfg, params) {
  return listNativeSpecsFromCommands(listChatCommandsForConfig(cfg, params), params?.provider);
}
/** Finds a command definition by provider-native command name or native alias. */
function findCommandByNativeName(name, provider, options) {
  const normalized = normalizeOptionalLowercaseString(name);
  if (!normalized) return;
  return getChatCommands().find(
    (command) =>
      command.scope !== "text" &&
      supportsNativeProvider(command, provider) &&
      [resolveNativeName(command, provider, options), ...(command.nativeAliases ?? [])].some(
        (nameLocal) => normalizeOptionalLowercaseString(nameLocal) === normalized,
      ),
  );
}
/** Formats a command and optional raw argument string as slash-command text. */
function buildCommandText(commandName, args) {
  const trimmedArgs = args?.trim();
  return trimmedArgs ? `/${commandName} ${trimmedArgs}` : `/${commandName}`;
}
function parsePositionalArgs(definitions, raw) {
  const values = {};
  const trimmed = raw.trim();
  if (!trimmed) return values;
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  let index = 0;
  for (const definition of definitions) {
    if (index >= tokens.length) break;
    if (definition.captureRemaining) {
      values[definition.name] = tokens.slice(index).join(" ");
      break;
    }
    values[definition.name] = expectDefined(tokens[index], "command argument token");
    index += 1;
  }
  return values;
}
function formatPositionalArgs(definitions, values) {
  const parts = [];
  for (const definition of definitions) {
    const value = values[definition.name];
    if (value == null) continue;
    let rendered;
    if (typeof value === "string") rendered = value.trim();
    else rendered = String(value);
    if (!rendered) continue;
    parts.push(rendered);
    if (definition.captureRemaining) break;
  }
  return parts.length > 0 ? parts.join(" ") : void 0;
}
/** Parses raw command arguments according to the command definition. */
function parseCommandArgs(command, raw) {
  const trimmed = raw?.trim();
  if (!trimmed) return;
  if (!command.args || command.argsParsing === "none") return { raw: trimmed };
  return {
    raw: trimmed,
    values: parsePositionalArgs(command.args, trimmed),
  };
}
/** Serializes parsed command arguments back into a raw argument string. */
function serializeCommandArgs(command, args) {
  if (!args) return;
  const raw = args.raw?.trim();
  if (raw) return raw;
  if (!args.values || !command.args) return;
  if (command.formatArgs) return command.formatArgs(args.values);
  return formatPositionalArgs(command.args, args.values);
}
/** Builds slash-command text from a command definition and parsed args. */
function buildCommandTextFromArgs(command, args) {
  return buildCommandText(command.nativeName ?? command.key, serializeCommandArgs(command, args));
}
function resolveDefaultCommandContext(cfg) {
  const resolved = resolveConfiguredModelRef({
    cfg: cfg ?? {},
    defaultProvider: DEFAULT_PROVIDER,
    defaultModel: DEFAULT_MODEL,
  });
  return {
    provider: resolved.provider ?? "openai",
    model: resolved.model ?? "gpt-5.6-sol",
  };
}
/** Resolves static or context-aware choices for one command argument. */
function resolveCommandArgChoices(params) {
  const { command, arg, cfg } = params;
  if (!arg.choices) return [];
  const provided = arg.choices;
  return (
    Array.isArray(provided)
      ? provided
      : (() => {
          const defaults = resolveDefaultCommandContext(cfg);
          const context = {
            cfg,
            provider: params.provider ?? defaults.provider,
            model: params.model ?? defaults.model,
            agentRuntime: params.agentRuntime,
            catalog: params.catalog ?? (cfg ? buildConfiguredModelCatalog({ cfg }) : void 0),
            command,
            arg,
          };
          return provided(context);
        })()
  ).map((choice) =>
    typeof choice === "string"
      ? {
          value: choice,
          label: choice,
        }
      : choice,
  );
}
/** Resolves the next argument menu to show for commands with selectable choices. */
function resolveCommandArgMenu(params) {
  const { command, args, cfg, provider, model, agentRuntime, catalog } = params;
  if (!command.args || !command.argsMenu) return null;
  if (command.argsParsing === "none") return null;
  const resolvedCatalog = catalog ?? (cfg ? buildConfiguredModelCatalog({ cfg }) : void 0);
  const argSpec = command.argsMenu;
  const argName =
    argSpec === "auto"
      ? command.args.find(
          (arg) =>
            resolveCommandArgChoices({
              command,
              arg,
              cfg,
              provider,
              model,
              agentRuntime,
              catalog: resolvedCatalog,
            }).length > 0,
        )?.name
      : argSpec.arg;
  if (!argName) return null;
  if (args?.values && args.values[argName] != null) return null;
  if (args?.raw && !args.values) return null;
  const arg = command.args.find((entry) => entry.name === argName);
  if (!arg) return null;
  const choices = resolveCommandArgChoices({
    command,
    arg,
    cfg,
    provider,
    model,
    agentRuntime,
    catalog: resolvedCatalog,
  });
  if (choices.length === 0) return null;
  return {
    arg,
    choices,
    title: argSpec !== "auto" ? argSpec.title : void 0,
  };
}
/** Formats the prompt title shown before an argument-choice menu. */
function formatCommandArgMenuTitle(params) {
  const { command, menu } = params;
  if (menu.title) return menu.title;
  const commandLabel = command.nativeName ?? command.key;
  if (typeof menu.arg.choices === "function") {
    const options = menu.choices
      .map((choice) => choice.label.trim())
      .filter(Boolean)
      .join(", ");
    if (options.length > 0 && options.length <= 160)
      return `Choose ${menu.arg.name} for /${commandLabel}.\nOptions: ${options}.`;
    return `Choose ${menu.arg.name} for /${commandLabel}.`;
  }
  return `Choose ${menu.arg.description || menu.arg.name} for /${commandLabel}.`;
}
/** Returns true for normalized slash-command text. */
function isCommandMessage(raw) {
  return normalizeCommandBody(raw).startsWith("/");
}
//#endregion
export {
  isCommandMessage as a,
  parseCommandArgs as c,
  serializeCommandArgs as d,
  formatCommandArgMenuTitle as i,
  resolveCommandArgChoices as l,
  buildCommandTextFromArgs as n,
  listNativeCommandSpecs as o,
  findCommandByNativeName as r,
  listNativeCommandSpecsForConfig as s,
  buildCommandText as t,
  resolveCommandArgMenu as u,
};
