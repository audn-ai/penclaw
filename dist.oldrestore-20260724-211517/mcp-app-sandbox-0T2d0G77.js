//#region src/agents/mcp-app-sandbox.ts
const MCP_APP_SANDBOX_PATH = "/mcp-app-sandbox";
const MCP_APP_SANDBOX_PORT_OFFSET = 1;
const MCP_APP_SANDBOX_CSP_QUERY = "csp";
const MCP_APP_SANDBOX_CSP_MAX_JSON_BYTES = 5 * 1024;
const MCP_APP_SANDBOX_CSP_MAX_HEADER_BYTES = 6 * 1024;
const MCP_APP_SANDBOX_CSP_MAX_ENCODED_BYTES =
  Math.ceil(MCP_APP_SANDBOX_CSP_MAX_JSON_BYTES / 3) * 4 + 4;
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function normalizeDomains(value, options) {
  if (!Array.isArray(value)) return;
  const protocols = options?.allowWebSocket ? "(?:https?|wss?)" : "https?";
  const pattern = new RegExp(`^${protocols}:\\/\\/(?:\\*\\.)?[A-Za-z0-9.-]+(?::[0-9]+)?$`);
  const entries = value.filter(
    (entry) => typeof entry === "string" && entry.length <= 2048 && pattern.test(entry),
  );
  return entries.length > 0 ? entries : void 0;
}
function normalizeMcpAppCsp(value) {
  const record = asRecord(value);
  if (!record) return;
  const csp = {
    connectDomains: normalizeDomains(record.connectDomains, { allowWebSocket: true }),
    resourceDomains: normalizeDomains(record.resourceDomains),
    frameDomains: normalizeDomains(record.frameDomains),
    baseUriDomains: normalizeDomains(record.baseUriDomains),
  };
  if (!Object.values(csp).some(Boolean)) return;
  const jsonBytes = Buffer.byteLength(JSON.stringify(csp), "utf8");
  const headerBytes = Buffer.byteLength(buildMcpAppContentSecurityPolicy(csp), "utf8");
  if (
    jsonBytes > MCP_APP_SANDBOX_CSP_MAX_JSON_BYTES ||
    headerBytes > MCP_APP_SANDBOX_CSP_MAX_HEADER_BYTES
  )
    throw new Error("MCP App CSP metadata exceeds safe HTTP limits");
  return csp;
}
function encodeCsp(csp) {
  const normalized = normalizeMcpAppCsp(csp);
  if (!normalized) return;
  return Buffer.from(JSON.stringify(normalized), "utf8").toString("base64url");
}
function buildMcpAppSandboxPath(csp) {
  const encoded = encodeCsp(csp);
  return encoded
    ? `${MCP_APP_SANDBOX_PATH}?${MCP_APP_SANDBOX_CSP_QUERY}=${encoded}`
    : MCP_APP_SANDBOX_PATH;
}
function resolveMcpAppSandboxPort(gatewayPort, configuredPort) {
  const sandboxPort = configuredPort ?? gatewayPort + MCP_APP_SANDBOX_PORT_OFFSET;
  if (
    !Number.isInteger(gatewayPort) ||
    gatewayPort < 1 ||
    gatewayPort > 65535 ||
    !Number.isInteger(sandboxPort) ||
    sandboxPort < 1 ||
    sandboxPort > 65535 ||
    sandboxPort === gatewayPort
  )
    throw new Error("MCP Apps require distinct valid Gateway and sandbox ports");
  return sandboxPort;
}
function decodeMcpAppSandboxCsp(value) {
  if (!value) return;
  if (value.length > MCP_APP_SANDBOX_CSP_MAX_ENCODED_BYTES)
    throw new Error("MCP App CSP metadata is too large");
  return normalizeMcpAppCsp(JSON.parse(Buffer.from(value, "base64url").toString("utf8")));
}
/** Trusted outer document. The untrusted app HTML is written only into its inner iframe. */
function buildMcpAppSandboxProxyHtml() {
  return `<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>MCP App sandbox</title>
<style>html,body{height:100%;margin:0;background:transparent}iframe{display:block;width:100%;height:100%;border:0;background:transparent}</style>
<body>
<script>
(() => {
  if (window.self === window.top) throw new Error("invalid MCP App sandbox host");
  let hostOrigin;
  try {
    const referrer = new URL(document.referrer);
    if (referrer.protocol !== "http:" && referrer.protocol !== "https:") throw new Error();
    hostOrigin = referrer.origin;
  } catch { throw new Error("invalid MCP App sandbox parent"); }
  try { void window.top.document; throw new Error("MCP App sandbox isolation failed"); } catch (error) {
    if (error instanceof Error && error.message === "MCP App sandbox isolation failed") throw error;
  }
  const inner = document.createElement("iframe");
  inner.setAttribute("sandbox", "allow-scripts allow-forms");
  document.body.appendChild(inner);
  window.addEventListener("message", (event) => {
    if (event.source === window.parent) {
      if (event.origin !== hostOrigin) return;
      if (event.data?.method === "ui/notifications/sandbox-resource-ready") {
        const params = event.data.params ?? {};
        if (typeof params.html === "string") {
          inner.srcdoc = params.html;
        }
        return;
      }
      if (typeof event.data?.method === "string" && event.data.method.startsWith("ui/notifications/sandbox-")) return;
      inner.contentWindow?.postMessage(event.data, "*");
      return;
    }
    if (event.source === inner.contentWindow) {
      if (typeof event.data?.method === "string" && event.data.method.startsWith("ui/notifications/sandbox-")) return;
      window.parent.postMessage(event.data, hostOrigin);
    }
  });
  window.parent.postMessage({ jsonrpc: "2.0", method: "ui/notifications/sandbox-proxy-ready", params: {} }, hostOrigin);
})();
<\/script>
</body>`;
}
/** HTTP response policy for the isolated proxy and its inner about:blank app. */
function buildMcpAppContentSecurityPolicy(csp) {
  const resources = csp?.resourceDomains ?? [];
  const connections = csp?.connectDomains ?? [];
  const frames = csp?.frameDomains ?? [];
  const bases = csp?.baseUriDomains ?? [];
  const sources = (values) => (values.length > 0 ? values.join(" ") : "'none'");
  const directives = [
    "default-src 'none'",
    `script-src 'self' 'unsafe-inline' ${resources.join(" ")}`.trim(),
    `style-src 'self' 'unsafe-inline' ${resources.join(" ")}`.trim(),
    `img-src 'self' data: ${resources.join(" ")}`.trim(),
    `media-src 'self' data: ${resources.join(" ")}`.trim(),
    `connect-src ${sources(connections)}`,
    `frame-src ${sources(frames)}`,
    `base-uri ${bases.length > 0 ? bases.join(" ") : "'self'"}`,
    "object-src 'none'",
    "form-action 'none'",
    "frame-ancestors http: https:",
  ];
  if (csp) directives.splice(5, 0, `font-src 'self' ${resources.join(" ")}`.trim());
  return directives.join("; ");
}
//#endregion
export {
  decodeMcpAppSandboxCsp as a,
  buildMcpAppSandboxProxyHtml as i,
  buildMcpAppContentSecurityPolicy as n,
  normalizeMcpAppCsp as o,
  buildMcpAppSandboxPath as r,
  resolveMcpAppSandboxPort as s,
  MCP_APP_SANDBOX_PATH as t,
};
