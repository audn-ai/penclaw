import fs from "node:fs/promises";
import "./temp-path-DYqJUh96.js";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { t as resolveSecretPlanTargetByPath } from "./secret-ref-runtime-BRCHynvV.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { t as parseVaultSecretId } from "./vault-secret-id-r3Pg3gBq.js";
//#region extensions/vault/src/cli.ts
const VAULT_PROVIDER_ALIAS = "vault";
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const MODEL_PROVIDER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const FORBIDDEN_PATH_SEGMENTS = /* @__PURE__ */ new Set(["__proto__", "prototype", "constructor"]);
function writeLine(message = "") {
  process.stdout.write(`${message}\n`);
}
function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function normalizeOptionalString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function parseDotPath(pathname) {
  return pathname
    .split(".")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);
}
function toDotPath(segments) {
  return segments.join(".");
}
function assertValidProviderAlias(value) {
  if (!SECRET_PROVIDER_ALIAS_PATTERN.test(value))
    throw new Error(
      `Invalid provider alias "${value}". Use lowercase letters, numbers, underscores, or hyphens.`,
    );
}
function assertValidModelProviderId(label, value) {
  if (!MODEL_PROVIDER_ID_PATTERN.test(value))
    throw new Error(`Invalid ${label} model provider id: ${value}`);
}
function assertValidVaultSecretId(label, value) {
  try {
    parseVaultSecretId(value);
  } catch {
    throw new Error(`Invalid ${label} Vault secret id: ${value}`);
  }
}
function readProviderStatus(config, providerAlias) {
  const provider = config.secrets?.providers?.[providerAlias];
  if (!isRecord(provider)) return { configured: false };
  const base = {
    configured: true,
    source: normalizeOptionalString(provider.source),
  };
  if (provider.source !== "exec") return base;
  if ("pluginIntegration" in provider)
    return {
      ...base,
      pluginIntegration: provider.pluginIntegration,
    };
  return {
    ...base,
    command: normalizeOptionalString(provider.command),
  };
}
function isVaultIntegrationProvider(value) {
  if (!isRecord(value) || value.source !== "exec" || !isRecord(value.pluginIntegration))
    return false;
  return (
    value.pluginIntegration.pluginId === "vault" &&
    value.pluginIntegration.integrationId === "vault"
  );
}
function resolveStatusProviderAlias(config, requestedAlias) {
  const explicitAlias = normalizeOptionalString(requestedAlias);
  if (explicitAlias) {
    assertValidProviderAlias(explicitAlias);
    return explicitAlias;
  }
  if (readProviderStatus(config, VAULT_PROVIDER_ALIAS).configured) return VAULT_PROVIDER_ALIAS;
  const configuredAliases = Object.entries(config.secrets?.providers ?? {})
    .filter(([, provider]) => isVaultIntegrationProvider(provider))
    .map(([alias]) => alias)
    .toSorted();
  if (configuredAliases.length > 1)
    throw new Error(
      `Multiple Vault provider aliases are configured (${configuredAliases.join(", ")}). Use --provider-alias <alias>.`,
    );
  return configuredAliases[0] ?? VAULT_PROVIDER_ALIAS;
}
async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
function resolverScriptPathCandidates(baseUrl) {
  return [
    fileURLToPath(new URL("../vault-secret-ref-resolver.js", baseUrl)),
    fileURLToPath(new URL("./extensions/vault/vault-secret-ref-resolver.js", baseUrl)),
  ];
}
async function resolveResolverScriptPath(baseUrl = import.meta.url, exists = pathExists) {
  const candidates = resolverScriptPathCandidates(baseUrl);
  for (const candidate of candidates) if (await exists(candidate)) return candidate;
  return candidates[0];
}
function buildProviderConfig() {
  return {
    source: "exec",
    pluginIntegration: {
      pluginId: "vault",
      integrationId: "vault",
    },
  };
}
function createModelApiKeyTarget(params) {
  assertValidModelProviderId("target", params.providerId);
  return {
    type: "models.providers.apiKey",
    path: `models.providers.${params.providerId}.apiKey`,
    pathSegments: ["models", "providers", params.providerId, "apiKey"],
    providerId: params.providerId,
    ref: {
      source: "exec",
      provider: params.providerAlias,
      id: params.secretId,
    },
  };
}
function parseTargetSpecifier(value) {
  if (value.startsWith("auth-profiles:")) {
    const remainder = value.slice(14);
    const separatorIndex = remainder.indexOf(":");
    const agentId = separatorIndex >= 0 ? remainder.slice(0, separatorIndex) : "";
    const targetPath = separatorIndex >= 0 ? remainder.slice(separatorIndex + 1) : "";
    if (!agentId || !targetPath) throw new Error(`Invalid --target auth-profiles target: ${value}`);
    return {
      agentId,
      path: targetPath,
    };
  }
  return { path: value.startsWith("openclaw:") ? value.slice(9) : value };
}
function createConfigSecretTarget(params) {
  const pathSegments = parseDotPath(params.path);
  const normalizedPath = toDotPath(pathSegments);
  if (
    pathSegments.length === 0 ||
    normalizedPath !== params.path ||
    pathSegments.some((segment) => FORBIDDEN_PATH_SEGMENTS.has(segment))
  )
    throw new Error(`Invalid --target config path: ${params.path}`);
  const resolved = resolveSecretPlanTargetByPath({
    configFile: params.agentId ? "auth-profiles.json" : "openclaw.json",
    pathSegments,
  });
  if (!resolved) throw new Error(`Unknown or unsupported Vault setup target path: ${params.path}`);
  return {
    type: resolved.targetType,
    path: normalizedPath,
    pathSegments,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    ...(resolved.providerId ? { providerId: resolved.providerId } : {}),
    ...(resolved.accountId ? { accountId: resolved.accountId } : {}),
    ref: {
      source: "exec",
      provider: params.providerAlias,
      id: params.secretId,
    },
  };
}
function parseProviderKeyMappings(values) {
  return (values ?? []).map((value) => {
    const separator = value.indexOf("=");
    if (separator <= 0 || separator === value.length - 1)
      throw new Error(
        `Invalid --provider-key value "${value}". Use <model-provider-id>=<vault-secret-id>.`,
      );
    const providerId = value.slice(0, separator).trim();
    const secretId = value.slice(separator + 1).trim();
    assertValidModelProviderId("--provider-key", providerId);
    assertValidVaultSecretId(`--provider-key ${providerId}`, secretId);
    return {
      providerId,
      secretId,
    };
  });
}
function parseConfigTargetMappings(values) {
  return (values ?? []).map((value) => {
    const separator = value.indexOf("=");
    if (separator <= 0 || separator === value.length - 1)
      throw new Error(
        `Invalid --target value "${value}". Use <openclaw-config-path>=<vault-secret-id>.`,
      );
    const target = parseTargetSpecifier(value.slice(0, separator).trim());
    const secretId = value.slice(separator + 1).trim();
    assertValidVaultSecretId(`--target ${target.path}`, secretId);
    return Object.assign(
      {
        path: target.path,
        secretId,
      },
      target.agentId ? { agentId: target.agentId } : {},
    );
  });
}
function collectProviderSecrets(options) {
  const providerSecrets = [];
  if (options.openaiId)
    providerSecrets.push({
      providerId: "openai",
      secretId: options.openaiId,
    });
  if (options.anthropicId)
    providerSecrets.push({
      providerId: "anthropic",
      secretId: options.anthropicId,
    });
  if (options.openrouterId)
    providerSecrets.push({
      providerId: "openrouter",
      secretId: options.openrouterId,
    });
  providerSecrets.push(...parseProviderKeyMappings(options.providerKey));
  const seen = /* @__PURE__ */ new Set();
  for (const entry of providerSecrets) {
    const normalized = entry.providerId.toLowerCase();
    if (seen.has(normalized))
      throw new Error(`Duplicate model provider id in Vault setup: ${entry.providerId}`);
    seen.add(normalized);
  }
  return providerSecrets;
}
function assertNoDuplicatePlanTargets(targets) {
  const seen = /* @__PURE__ */ new Set();
  for (const target of targets) {
    const key = target.agentId
      ? `auth-profiles:${target.agentId}:${target.path}`
      : `openclaw:${target.path}`;
    if (seen.has(key))
      throw new Error(`Duplicate secret target path in Vault setup: ${target.path}`);
    seen.add(key);
  }
}
function buildPlan(params) {
  const targets = [
    ...params.providerSecrets.map((entry) =>
      createModelApiKeyTarget({
        providerAlias: params.providerAlias,
        providerId: entry.providerId,
        secretId: entry.secretId,
      }),
    ),
    ...(params.configTargetSecrets ?? []).map((entry) =>
      createConfigSecretTarget({
        providerAlias: params.providerAlias,
        path: entry.path,
        ...(entry.agentId ? { agentId: entry.agentId } : {}),
        secretId: entry.secretId,
      }),
    ),
  ];
  assertNoDuplicatePlanTargets(targets);
  return {
    version: 1,
    protocolVersion: 1,
    generatedAt: /* @__PURE__ */ new Date().toISOString(),
    generatedBy: "manual",
    providerUpserts: { [params.providerAlias]: params.providerConfig },
    targets,
  };
}
async function promptOptionalSecretId(label) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return;
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    return normalizeOptionalString(await rl.question(`${label} Vault secret id (blank to skip): `));
  } finally {
    rl.close();
  }
}
async function promptProviderSecrets(options) {
  const openaiId =
    normalizeOptionalString(options.openaiId) ?? (await promptOptionalSecretId("OpenAI"));
  const anthropicId =
    normalizeOptionalString(options.anthropicId) ?? (await promptOptionalSecretId("Anthropic"));
  const openrouterId =
    normalizeOptionalString(options.openrouterId) ?? (await promptOptionalSecretId("OpenRouter"));
  if (openaiId) assertValidVaultSecretId("OpenAI", openaiId);
  if (anthropicId) assertValidVaultSecretId("Anthropic", anthropicId);
  if (openrouterId) assertValidVaultSecretId("OpenRouter", openrouterId);
  return collectProviderSecrets({
    ...(openaiId ? { openaiId } : {}),
    ...(anthropicId ? { anthropicId } : {}),
    ...(openrouterId ? { openrouterId } : {}),
    providerKey: options.providerKey,
  });
}
async function runStatus(config, options) {
  const providerAlias = resolveStatusProviderAlias(config, options.providerAlias);
  const provider = readProviderStatus(config, providerAlias);
  const authMethod = normalizeOptionalString(process.env.OPENCLAW_VAULT_AUTH_METHOD) ?? "token";
  const result = {
    providerAlias,
    provider,
    resolverScript: await resolveResolverScriptPath(),
    vaultAddr: normalizeOptionalString(process.env.VAULT_ADDR),
    authMethod,
    authMount:
      normalizeOptionalString(process.env.OPENCLAW_VAULT_AUTH_MOUNT) ??
      (authMethod === "kubernetes" ? "kubernetes" : "jwt"),
    authRole: normalizeOptionalString(process.env.OPENCLAW_VAULT_AUTH_ROLE),
    hasJwtFile: Boolean(normalizeOptionalString(process.env.OPENCLAW_VAULT_JWT_FILE)),
    hasVaultTokenFile: Boolean(normalizeOptionalString(process.env.VAULT_TOKEN_FILE)),
    kvMount: normalizeOptionalString(process.env.OPENCLAW_VAULT_KV_MOUNT) ?? "secret",
    kvVersion: normalizeOptionalString(process.env.OPENCLAW_VAULT_KV_VERSION) ?? "2",
    hasVaultToken: Boolean(normalizeOptionalString(process.env.VAULT_TOKEN)),
  };
  if (options.json) {
    writeJson(result);
    return;
  }
  writeLine(`Vault provider: ${provider.configured ? "configured" : "not configured"}`);
  if (provider.source) writeLine(`Source: ${provider.source}`);
  if (provider.command) writeLine(`Command: ${provider.command}`);
  if (provider.pluginIntegration)
    writeLine(
      `Plugin integration: ${provider.pluginIntegration.pluginId}:${provider.pluginIntegration.integrationId}`,
    );
  writeLine(`Resolver: ${result.resolverScript}`);
  writeLine(`VAULT_ADDR: ${result.vaultAddr ?? "not set"}`);
  writeLine(`Auth method: ${result.authMethod}`);
  writeLine(`VAULT_TOKEN: ${result.hasVaultToken ? "set" : "not set"}`);
  writeLine(`VAULT_TOKEN_FILE: ${result.hasVaultTokenFile ? "set" : "not set"}`);
  writeLine(`Auth mount: ${result.authMount}`);
  writeLine(`Auth role: ${result.authRole ?? "not set"}`);
  writeLine(`OPENCLAW_VAULT_JWT_FILE: ${result.hasJwtFile ? "set" : "not set"}`);
  writeLine(`KV mount: ${result.kvMount}`);
  writeLine(`KV version: ${result.kvVersion}`);
}
async function runSetup(options) {
  const providerAlias = normalizeOptionalString(options.providerAlias) ?? VAULT_PROVIDER_ALIAS;
  assertValidProviderAlias(providerAlias);
  const providerSecrets = await promptProviderSecrets(options);
  const plan = buildPlan({
    providerAlias,
    providerConfig: buildProviderConfig(),
    providerSecrets,
    configTargetSecrets: parseConfigTargetMappings(options.target),
  });
  const planPath =
    normalizeOptionalString(options.planOut) ??
    path.join(resolvePreferredOpenClawTmpDir(), `openclaw-vault-secrets-${process.pid}.json`);
  await fs.writeFile(planPath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
  writeLine(`Plan written to ${planPath}`);
  writeLine(`Targets: ${plan.targets.length}`);
  writeLine("");
  writeLine("Next steps:");
  writeLine(`  openclaw secrets apply --from ${planPath} --dry-run --allow-exec`);
  writeLine(`  openclaw secrets apply --from ${planPath} --allow-exec`);
  writeLine("  openclaw secrets audit --check --allow-exec");
  writeLine("  openclaw secrets reload");
}
function registerVaultCommands(params) {
  const vault = params.program.command("vault").description("Manage Vault SecretRefs");
  vault
    .command("status")
    .description("Show Vault SecretRef provider status")
    .option("--json", "Print JSON status")
    .option("--provider-alias <alias>", "Secret provider alias to inspect")
    .action((options) => runStatus(params.config, options));
  vault
    .command("setup")
    .description("Create a Vault SecretRef setup plan")
    .option("--plan-out <path>", "Write the generated secrets apply plan to a path")
    .option("--provider-alias <alias>", "Secret provider alias to configure", VAULT_PROVIDER_ALIAS)
    .option("--openai-id <id>", "Vault secret id for models.providers.openai.apiKey")
    .option("--anthropic-id <id>", "Vault secret id for models.providers.anthropic.apiKey")
    .option("--openrouter-id <id>", "Vault secret id for models.providers.openrouter.apiKey")
    .option(
      "--provider-key <provider=id>",
      "Vault secret id for any models.providers.<provider>.apiKey target",
      (value, previous = []) => [...previous, value],
      [],
    )
    .option(
      "--target <path=id>",
      "Vault secret id for any known SecretRef target path",
      (value, previous = []) => [...previous, value],
      [],
    )
    .action((options) => runSetup(options));
}
//#endregion
export { registerVaultCommands };
