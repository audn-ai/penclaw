import path from "node:path";
import { fileURLToPath } from "node:url";
import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import { r as resolveBrowserConfig } from "./config-CzdiqFrD.js";
import { n as info, t as danger } from "./globals-CNUzHTcU.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import "./cdp.helpers-ChuUODxP.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import { t as ensureExtensionRelayToken } from "./relay-auth-BQwTEFTY.js";
import "./core-api-CbAkgF5l.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region extensions/browser/src/cli/browser-cli-extension.ts
/**
 * `openclaw browser extension` CLI: locate the unpacked Chrome extension and
 * print the pairing string that connects it to this install's relay.
 */
/** Absolute path to the bundled unpacked Chrome extension directory. */
function resolveChromeExtensionDir(pluginRoot) {
  if (pluginRoot) return path.join(pluginRoot, "chrome-extension");
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "..", "..", "chrome-extension");
}
function firstExtensionProfile() {
  const cfg = getRuntimeConfig();
  const resolved = resolveBrowserConfig(cfg.browser, cfg);
  for (const [name, profile] of Object.entries(resolved.profiles))
    if (profile.driver === "extension")
      return {
        name,
        relayPort: profile.cdpPort ?? resolved.extensionRelayDefaultPort,
      };
  return null;
}
/** Gateway route path for the remote extension relay (see gateway-relay-route.ts). */
const GATEWAY_EXTENSION_RELAY_PATH = "/browser/extension";
/** Resolve a safe direct-Gateway relay URL, preserving an optional proxy base path. */
function buildRemoteGatewayRelayUrl(raw) {
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error("--gateway-url must be a valid ws:// or wss:// URL");
  }
  const secure = url.protocol === "wss:";
  const localPlaintext = url.protocol === "ws:" && isLoopbackHost(url.hostname);
  if (!secure && !localPlaintext)
    throw new Error("--gateway-url must use wss:// (ws:// is allowed only for loopback)");
  if (url.username || url.password || url.search || url.hash)
    throw new Error("--gateway-url must not include credentials, a query, or a fragment");
  const basePath = url.pathname.replace(/\/+$/, "");
  url.pathname = `${basePath}${GATEWAY_EXTENSION_RELAY_PATH}`;
  return url.toString();
}
function buildPairingString(gatewayUrl) {
  const cfg = getRuntimeConfig();
  const resolved = resolveBrowserConfig(cfg.browser, cfg);
  const token = ensureExtensionRelayToken();
  const relayPort = firstExtensionProfile()?.relayPort ?? resolved.extensionRelayDefaultPort;
  const gateway = gatewayUrl?.trim();
  if (gateway)
    return {
      pairing: `${buildRemoteGatewayRelayUrl(gateway)}#${token}`,
      relayPort,
      remote: true,
    };
  return {
    pairing: `ws://127.0.0.1:${relayPort}/extension#${token}`,
    relayPort,
    remote: false,
  };
}
/** Register `openclaw browser extension {path,pair}`. */
function registerBrowserExtensionCommands(browser, _parentOpts, pluginRoot) {
  const extension = browser
    .command("extension")
    .description("Chrome extension: print the load path and pairing string");
  extension
    .command("path")
    .description("Print the unpacked Chrome extension directory (Load unpacked)")
    .action(() => {
      defaultRuntime.log(resolveChromeExtensionDir(pluginRoot));
    });
  extension
    .command("pair")
    .description("Print the pairing string to paste into the OpenClaw extension popup")
    .option("--json", "Print the pairing string as JSON")
    .option(
      "--gateway-url <url>",
      "Print a remote pairing string for a Chrome on another machine (e.g. wss://gateway.example.com)",
    )
    .action(async (opts) => {
      await runCommandWithRuntime(
        defaultRuntime,
        async () => {
          const result = buildPairingString(opts.gatewayUrl);
          if (opts.json === true) {
            defaultRuntime.log(
              JSON.stringify({
                pairingString: result.pairing,
                relayPort: result.relayPort,
                remote: result.remote,
              }),
            );
            return;
          }
          const setupLine = result.remote
            ? info(
                "Remote pairing: load and pair the extension on the machine running Chrome; it connects to this gateway over wss://.",
              )
            : info(
                "Run this on the machine that hosts the browser (gateway host or browser node).",
              );
          defaultRuntime.log(
            [
              setupLine,
              info("1. Load the extension: chrome://extensions → Developer mode → Load unpacked →"),
              `   ${resolveChromeExtensionDir(pluginRoot)}`,
              info("2. Open the OpenClaw popup and paste this pairing string:"),
              "",
              theme.heading(result.pairing),
              "",
              info("The token is a host-local secret; keep it private."),
            ].join("\n"),
          );
        },
        (err) => {
          defaultRuntime.error(danger(String(err)));
          defaultRuntime.exit(1);
        },
      );
    });
}
//#endregion
export { registerBrowserExtensionCommands };
