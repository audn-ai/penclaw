import {
  At as boolean,
  Et as array,
  Nn as record,
  Rn as string,
  Tn as object,
} from "./schemas-CBJjibl3.js";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.js";
//#region src/shared/tailscale-status.ts
const TAILSCALE_STATUS_COMMAND_CANDIDATES = [
  "tailscale",
  "/Applications/Tailscale.app/Contents/MacOS/Tailscale",
];
const TailscaleStatusSchema = object({
  Self: object({
    DNSName: string().optional(),
    TailscaleIPs: array(string()).optional(),
  }).optional(),
});
const TailscaleServeTcpHandlerSchema = object({ HTTPS: boolean().optional() });
const TailscaleServeWebServerSchema = object({
  Handlers: record(string(), object({ Proxy: string().optional() })),
});
const TailscaleServeConfigSchema = object({
  TCP: record(string(), TailscaleServeTcpHandlerSchema).optional(),
  Web: record(string(), TailscaleServeWebServerSchema).optional(),
}).extend({ AllowFunnel: record(string(), boolean()).optional() });
function parsePossiblyNoisyStatus(raw) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return safeParseJsonWithSchema(TailscaleStatusSchema, raw.slice(start, end + 1));
}
function extractTailnetHostFromStatusJson(raw) {
  const parsed = parsePossiblyNoisyStatus(raw);
  const dns = parsed?.Self?.DNSName;
  if (dns && dns.length > 0) return dns.replace(/\.$/, "");
  const ips = parsed?.Self?.TailscaleIPs ?? [];
  return ips.length > 0 ? (ips[0] ?? null) : null;
}
function parseLoopbackProxyPort(proxy) {
  const trimmed = proxy.trim();
  if (/^\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);
  const normalized = trimmed.includes("://") ? trimmed : `http://${trimmed}`;
  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
    if (!(host === "localhost" || host === "::1" || /^127(?:\.\d{1,3}){3}$/.test(host)))
      return null;
    const port = Number.parseInt(parsed.port, 10);
    return Number.isInteger(port) && port >= 1 && port <= 65535 ? port : null;
  } catch {
    return null;
  }
}
function collectServeGatewayUrls(config, gatewayPort, allowFunnel) {
  const urls = [];
  for (const [hostPort, webServer] of Object.entries(config.Web ?? {})) {
    const handler = webServer.Handlers["/"];
    if (
      allowFunnel[hostPort] ||
      !handler?.Proxy ||
      parseLoopbackProxyPort(handler.Proxy) !== gatewayPort
    )
      continue;
    try {
      const endpoint = new URL(`https://${hostPort}`);
      const port = endpoint.port || "443";
      if (config.TCP?.[port]?.HTTPS !== true) continue;
      urls.push(`wss://${endpoint.host}`);
    } catch {
      continue;
    }
  }
  return urls;
}
function extractServeGatewayUrls(raw, gatewayPort) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) return [];
  const parsed = safeParseJsonWithSchema(TailscaleServeConfigSchema, raw.slice(start, end + 1));
  if (!parsed) return [];
  return [
    ...new Set(collectServeGatewayUrls(parsed, gatewayPort, parsed.AllowFunnel ?? {})),
  ].toSorted();
}
/** Resolves the host published to clients for tailnet or Tailscale Serve gateway modes. */
function resolveTailscalePublishedHost(params) {
  const tailnetHost = params.tailnetHost?.trim();
  if (!tailnetHost) return null;
  const serviceName =
    params.tailscaleMode === "serve" ? params.serviceName?.trim() || void 0 : void 0;
  if (!serviceName) return tailnetHost;
  if (/^[\d.:]+$/.test(tailnetHost)) return null;
  const bareServiceName = serviceName.replace(/^svc:/, "");
  const tailnetSuffix = tailnetHost.split(".").slice(1).join(".");
  return tailnetSuffix ? `${bareServiceName}.${tailnetSuffix}` : null;
}
/** Runs known Tailscale status commands and returns the first DNS name or tailnet IP found. */
async function resolveTailnetHostWithRunner(runCommandWithTimeout) {
  if (!runCommandWithTimeout) return null;
  for (const candidate of TAILSCALE_STATUS_COMMAND_CANDIDATES)
    try {
      const result = await runCommandWithTimeout([candidate, "status", "--json"], {
        timeoutMs: 5e3,
      });
      if (result.code !== 0) continue;
      const raw = result.stdout.trim();
      if (!raw) continue;
      const host = extractTailnetHostFromStatusJson(raw);
      if (host) return host;
    } catch {
      continue;
    }
  return null;
}
/** Finds persistent HTTPS Serve routes whose root proxy targets this gateway port. */
async function resolveTailscaleServeGatewayUrlsWithRunner(gatewayPort, runCommandWithTimeout) {
  if (!runCommandWithTimeout) return [];
  for (const candidate of TAILSCALE_STATUS_COMMAND_CANDIDATES)
    try {
      const result = await runCommandWithTimeout([candidate, "serve", "status", "--json"], {
        timeoutMs: 5e3,
      });
      if (result.code !== 0 || !result.stdout.trim()) continue;
      const urls = extractServeGatewayUrls(result.stdout, gatewayPort);
      if (urls.length > 0) return urls;
    } catch {
      continue;
    }
  return [];
}
//#endregion
export {
  resolveTailscalePublishedHost as n,
  resolveTailscaleServeGatewayUrlsWithRunner as r,
  resolveTailnetHostWithRunner as t,
};
