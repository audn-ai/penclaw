import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/github-copilot/domain.d.ts
/** Public GitHub Copilot host used when no data-residency domain is configured. */
declare const PUBLIC_GITHUB_COPILOT_DOMAIN = "github.com";
/**
 * Resolve the GitHub Copilot host for this provider from (in priority order) the
 * `COPILOT_GITHUB_DOMAIN` env override, the persisted
 * `models.providers.github-copilot.params.githubDomain` config, then public
 * `github.com`. The result always passes through the SDK allowlist
 * (`normalizeGithubCopilotDomain`) so an unsafe value fails closed.
 */
declare function resolveGithubCopilotDomain(params?: {
  env?: NodeJS.ProcessEnv;
  config?: OpenClawConfig;
}): string;
//#endregion
export { PUBLIC_GITHUB_COPILOT_DOMAIN, resolveGithubCopilotDomain };
