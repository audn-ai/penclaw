import {
  n as mapMcpServer,
  r as mcpManualItems,
  t as importsMcpSensitiveValues,
} from "./config-mcp-BnBsez3q.js";
import { r as providerConfig } from "./config-provider-contract-g5C6wKyT.js";
import {
  i as providerManualItems,
  r as collectHermesProviders,
  t as addSelectedModelToProvider,
} from "./config-providers-pyA5lDnw.js";
import {
  a as isRecord,
  c as readString,
  f as sanitizeName,
  n as childRecord,
} from "./helpers-DtCn6Wrs.js";
import {
  a as createMigrationConfigPatchItem,
  c as hasMigrationConfigPatchConflict,
  i as applyMigrationManualItem,
  r as applyMigrationConfigPatchItem,
  s as createMigrationManualItem,
} from "./migration-nGWjmzKy.js";
//#region extensions/migrate-hermes/config.ts
function mapSkillEntries(config) {
  const entries = {};
  for (const [skillKey, value] of Object.entries(
    childRecord(childRecord(config, "skills"), "config"),
  ))
    if (isRecord(value)) entries[skillKey] = { config: value };
  return Object.keys(entries).length > 0 ? entries : void 0;
}
function buildConfigItems(params) {
  const items = [];
  const memory = childRecord(params.config, "memory");
  const memoryProvider = readString(memory.provider);
  if (params.hasMemoryFiles || memoryProvider) {
    items.push(
      createMigrationConfigPatchItem({
        id: "config:memory",
        target: "memory",
        path: ["memory"],
        value: { backend: "builtin" },
        message: "Use OpenClaw built-in file memory for imported Hermes memory files.",
        conflict:
          !params.ctx.overwrite &&
          hasMigrationConfigPatchConflict(params.ctx.config, ["memory"], { backend: true }),
      }),
    );
    items.push(
      createMigrationConfigPatchItem({
        id: "config:memory-plugin-slot",
        target: "plugins.slots",
        path: ["plugins", "slots"],
        value: { memory: "memory-core" },
        message: "Select the default OpenClaw memory plugin for imported file memory.",
        conflict:
          !params.ctx.overwrite &&
          hasMigrationConfigPatchConflict(params.ctx.config, ["plugins", "slots"], {
            memory: true,
          }),
      }),
    );
  }
  if (memoryProvider === "honcho") {
    const value = {
      honcho: {
        enabled: true,
        config: childRecord(memory, "honcho"),
      },
    };
    items.push(
      createMigrationConfigPatchItem({
        id: "config:memory-plugin:honcho",
        target: "plugins.entries.honcho",
        path: ["plugins", "entries"],
        value,
        message: "Preserve Hermes Honcho memory settings as a plugin entry for manual activation.",
        conflict:
          !params.ctx.overwrite &&
          hasMigrationConfigPatchConflict(params.ctx.config, ["plugins", "entries"], value),
      }),
    );
    items.push(
      createMigrationManualItem({
        id: "manual:memory-provider:honcho",
        source: "config.yaml:memory.provider",
        message:
          "Hermes used Honcho memory. OpenClaw keeps built-in memory selected until the matching plugin is installed and reviewed.",
        recommendation:
          "Install or review the Honcho memory plugin before selecting it for plugins.slots.memory.",
      }),
    );
  } else if (memoryProvider && !["builtin", "file", "files"].includes(memoryProvider))
    items.push(
      createMigrationManualItem({
        id: `manual:memory-provider:${memoryProvider}`,
        source: "config.yaml:memory.provider",
        message: `Hermes memory provider "${memoryProvider}" does not have a known OpenClaw mapping.`,
        recommendation: "Install or configure an equivalent OpenClaw memory plugin manually.",
      }),
    );
  const providers = collectHermesProviders(
    params.config,
    params.env,
    Boolean(params.ctx.includeSecrets),
  );
  addSelectedModelToProvider(providers, params.modelRef);
  for (const provider of providers) {
    const value = { [provider.id]: providerConfig(provider) };
    items.push(
      createMigrationConfigPatchItem({
        id: `config:model-provider:${sanitizeName(provider.id)}`,
        target: `models.providers.${provider.id}`,
        path: ["models", "providers"],
        value,
        message: `Import Hermes provider and custom endpoint config for "${provider.id}".`,
        sensitive: provider.sensitive,
        conflict:
          !params.ctx.overwrite &&
          hasMigrationConfigPatchConflict(params.ctx.config, ["models", "providers"], value),
      }),
    );
  }
  items.push(
    ...providerManualItems(params.config, params.env ?? {}, Boolean(params.ctx.includeSecrets)),
  );
  const mcpConfig = params.config.mcp;
  const rawMcpServers =
    params.config.mcp_servers ??
    (isRecord(mcpConfig) && isRecord(mcpConfig.servers) ? mcpConfig.servers : mcpConfig);
  const rawMcpSource =
    params.config.mcp_servers !== void 0
      ? "config.yaml:mcp_servers"
      : isRecord(mcpConfig) && isRecord(mcpConfig.servers)
        ? "config.yaml:mcp.servers"
        : "config.yaml:mcp";
  if (isRecord(rawMcpServers)) {
    const mcpEnv = {
      ...params.runtimeEnv,
      ...params.env,
    };
    for (const [name, rawServer] of Object.entries(rawMcpServers)) {
      if (!isRecord(rawServer)) continue;
      const server = mapMcpServer(rawServer, Boolean(params.ctx.includeSecrets), mcpEnv);
      if (Object.keys(server).length > 0) {
        const value = { [name]: server };
        items.push(
          createMigrationConfigPatchItem({
            id: `config:mcp-server:${sanitizeName(name)}`,
            target: `mcp.servers.${name}`,
            path: ["mcp", "servers"],
            value,
            message: `Import Hermes MCP server definition "${name}".`,
            sensitive: importsMcpSensitiveValues(rawServer, Boolean(params.ctx.includeSecrets)),
            conflict:
              !params.ctx.overwrite &&
              hasMigrationConfigPatchConflict(params.ctx.config, ["mcp", "servers"], value),
          }),
        );
      }
      items.push(
        ...mcpManualItems({
          name,
          raw: rawServer,
          includeSecrets: Boolean(params.ctx.includeSecrets),
          env: mcpEnv,
          source: `${rawMcpSource}.${name}`,
        }),
      );
    }
  }
  const skillEntries = mapSkillEntries(params.config);
  if (skillEntries)
    items.push(
      createMigrationConfigPatchItem({
        id: "config:skill-entries",
        target: "skills.entries",
        path: ["skills", "entries"],
        value: skillEntries,
        message: "Import Hermes skill config values.",
        conflict:
          !params.ctx.overwrite &&
          hasMigrationConfigPatchConflict(params.ctx.config, ["skills", "entries"], skillEntries),
      }),
    );
  return items;
}
async function applyConfigItem(ctx, item) {
  return applyMigrationConfigPatchItem(ctx, item);
}
function applyManualItem(item) {
  return applyMigrationManualItem(item);
}
//#endregion
export { applyManualItem as n, buildConfigItems as r, applyConfigItem as t };
