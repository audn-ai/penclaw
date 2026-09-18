import { n as redactCdpUrl } from "../../browser-config-BYZ1IWa3.js";
import { t as formatCliCommand } from "../../command-format-H_Arqann.js";
import { a as resolveProfile, r as resolveBrowserConfig } from "../../config-CzdiqFrD.js";
import { n as resolveBrowserControlAuth } from "../../control-auth-BvDcTJb9.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import "../../secret-input-D1aG0n6v.js";
import "../../setup-tools-DI8M-Tdb.js";
import { t as runBrowserProxyCommand } from "../../core-api-l2pOnPUn.js";
import {
  i as createBrowserTool,
  r as handleBrowserGatewayRequest,
  t as createBrowserPluginService,
} from "../../plugin-service-qhBQDK9i.js";
import { t as hasNonEmptyString } from "../../record-shared-BNyRYPIG.js";
import { u as isPrivateIpAddress } from "../../ssrf-keFRGQLq.js";
import { o as isPrivateNetworkOptInEnabled } from "../../ssrf-policy-zxv5oRW2.js";
import { a as normalizeLowercaseStringOrEmpty } from "../../string-coerce-DW4mBlAt.js";
import { c as hasConfiguredSecretInput } from "../../types.secrets-BV0ywRAy.js";
//#region extensions/browser/src/security-audit.ts
const BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
]);
function isTrustedPrivateHostname(hostname) {
  const normalized = normalizeLowercaseStringOrEmpty(hostname);
  return normalized.length > 0 && BLOCKED_HOSTNAMES.has(normalized);
}
/** Collects Browser plugin security audit findings for the current config/env. */
function collectBrowserSecurityAuditFindings(ctx) {
  const findings = [];
  let resolved;
  try {
    resolved = resolveBrowserConfig(ctx.config.browser, ctx.config);
  } catch (err) {
    findings.push({
      checkId: "browser.control_invalid_config",
      severity: "warn",
      title: "Browser control config looks invalid",
      detail: String(err),
      remediation: `Fix browser.cdpUrl in ${ctx.configPath} and re-run "${formatCliCommand("openclaw security audit --deep")}".`,
    });
    return findings;
  }
  if (!resolved.enabled) return findings;
  const browserAuth = resolveBrowserControlAuth(ctx.config, ctx.env);
  const explicitAuthMode = ctx.config.gateway?.auth?.mode;
  const tokenConfigured =
    Boolean(browserAuth.token) ||
    hasNonEmptyString(ctx.env.OPENCLAW_GATEWAY_TOKEN) ||
    hasConfiguredSecretInput(ctx.config.gateway?.auth?.token, ctx.config.secrets?.defaults);
  const passwordCanWin =
    explicitAuthMode === "password" ||
    (explicitAuthMode !== "token" &&
      explicitAuthMode !== "none" &&
      explicitAuthMode !== "trusted-proxy" &&
      !tokenConfigured);
  const passwordConfigured =
    Boolean(browserAuth.password) ||
    (passwordCanWin &&
      (hasNonEmptyString(ctx.env.OPENCLAW_GATEWAY_PASSWORD) ||
        hasConfiguredSecretInput(
          ctx.config.gateway?.auth?.password,
          ctx.config.secrets?.defaults,
        )));
  if (!tokenConfigured && !passwordConfigured)
    findings.push({
      checkId: "browser.control_no_auth",
      severity: "critical",
      title: "Browser control has no auth",
      detail:
        "Browser control HTTP routes are enabled but no gateway.auth token/password is configured. Any local process (or SSRF to loopback) can call browser control endpoints.",
      remediation:
        "Set gateway.auth.token (recommended) or gateway.auth.password so browser control HTTP routes require authentication. Restarting the gateway will auto-generate gateway.auth.token when browser control is enabled.",
    });
  for (const name of Object.keys(resolved.profiles)) {
    const profile = resolveProfile(resolved, name);
    if (!profile || profile.cdpIsLoopback) continue;
    let url;
    try {
      url = new URL(profile.cdpUrl);
    } catch {
      continue;
    }
    const redactedCdpUrl = redactCdpUrl(profile.cdpUrl) ?? profile.cdpUrl;
    if (url.protocol === "http:")
      findings.push({
        checkId: "browser.remote_cdp_http",
        severity: "warn",
        title: "Remote CDP uses HTTP",
        detail: `browser profile "${name}" uses http CDP (${redactedCdpUrl}); this is OK only if it's tailnet-only or behind an encrypted tunnel.`,
        remediation: "Prefer HTTPS/TLS or a tailnet-only endpoint for remote CDP.",
      });
    if (
      isPrivateNetworkOptInEnabled(resolved.ssrfPolicy) &&
      (isTrustedPrivateHostname(url.hostname) || isPrivateIpAddress(url.hostname))
    )
      findings.push({
        checkId: "browser.remote_cdp_private_host",
        severity: "warn",
        title: "Remote CDP targets a private/internal host",
        detail: `browser profile "${name}" points at a private/internal CDP host (${redactedCdpUrl}). This is expected for LAN/tailnet/WSL-style setups, but treat it as a trusted-network endpoint.`,
        remediation:
          "Prefer a tailnet or tunnel for remote CDP. If you want strict blocking, set browser.ssrfPolicy.dangerouslyAllowPrivateNetwork=false and allow only explicit hosts.",
      });
  }
  return findings;
}
//#endregion
export {
  collectBrowserSecurityAuditFindings,
  createBrowserPluginService,
  createBrowserTool,
  handleBrowserGatewayRequest,
  runBrowserProxyCommand,
};
