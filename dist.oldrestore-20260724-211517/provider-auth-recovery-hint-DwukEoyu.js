import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { o as normalizeProviderId } from "./model-selection-normalize-BoKGJiBx.js";
import { n as resolveProviderAuthAliasMap } from "./provider-auth-aliases-RaEzqkSo.js";
import "./model-selection-DOlkTrQa.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-LxMRetjr.js";
//#region src/agents/provider-auth-recovery-hint.ts
/**
 * Provider authentication recovery hint builder.
 *
 * Prefers plugin manifest login commands, then falls back to configure/env-var guidance.
 */
function normalizeProviderIdForAuth(providerId, aliases) {
  const normalized = normalizeProviderId(providerId);
  return normalized ? (aliases[normalized] ?? normalized) : normalized;
}
function matchesProviderAuthChoice(choice, providerId, aliases) {
  const normalized = normalizeProviderIdForAuth(providerId, aliases);
  if (!normalized) return false;
  return normalizeProviderIdForAuth(choice.providerId, aliases) === normalized;
}
function resolveProviderAuthLoginCommand(params) {
  const aliases = resolveProviderAuthAliasMap(params);
  const choice = resolveManifestProviderAuthChoices(params).find((candidate) =>
    matchesProviderAuthChoice(candidate, params.provider, aliases),
  );
  if (!choice) return;
  return formatCliCommand(
    `openclaw models auth login --provider ${normalizeProviderIdForAuth(choice.providerId, aliases)}`,
  );
}
/** Build a concise user-facing hint for recovering provider authentication. */
function buildProviderAuthRecoveryHint(params) {
  const loginCommand = resolveProviderAuthLoginCommand(params);
  const parts = [];
  if (loginCommand) parts.push(`Run \`${loginCommand}\``);
  if (params.includeConfigure !== false)
    parts.push(`\`${formatCliCommand("openclaw configure")}\``);
  if (params.includeEnvVar) parts.push("set an API key env var");
  if (parts.length === 0) return `Run \`${formatCliCommand("openclaw configure")}\`.`;
  if (parts.length === 1) return `${parts[0]}.`;
  if (parts.length === 2) return `${parts[0]} or ${parts[1]}.`;
  return `${parts[0]}, ${parts[1]}, or ${parts[2]}.`;
}
//#endregion
export { buildProviderAuthRecoveryHint as t };
