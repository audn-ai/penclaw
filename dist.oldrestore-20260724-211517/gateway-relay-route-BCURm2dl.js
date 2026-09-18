import { WebSocketServer } from "ws";
import { a as resolveProfile } from "./config-CzdiqFrD.js";
import "./security-runtime-CraX8Pqe.js";
import "./bounded-utf8-tail-zGgVhmwV.js";
import { t as startBrowserControlServiceFromConfig } from "./control-service-B9nZG5m4.js";
import { i as getBrowserControlState } from "./plugin-enabled-C1NU0TDI.js";
import { n as readExtensionRelayToken } from "./relay-auth-BQwTEFTY.js";
import {
  a as EXTENSION_RELAY_MAX_PAYLOAD_BYTES,
  c as requestExtensionProtocolToken,
  n as ensureExtensionRelayForProfile,
  o as attachExtensionWebSocket,
  s as isAllowedExtensionOrigin,
} from "./relay-lifecycle-CUpLzaQH.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region extensions/browser/src/browser/extension-relay/gateway-relay-route.ts
const log = createSubsystemLogger("browser").child("extension-relay-gateway");
/** Path the browser plugin registers on the gateway (ends in /extension so the pairing parser accepts it). */
const GATEWAY_EXTENSION_RELAY_PATH = "/browser/extension";
let wss = null;
function getWss() {
  wss ??= new WebSocketServer({
    noServer: true,
    maxPayload: EXTENSION_RELAY_MAX_PAYLOAD_BYTES,
  });
  return wss;
}
function destroy(socket, statusLine) {
  try {
    socket.write(`HTTP/1.1 ${statusLine}\r\nConnection: close\r\n\r\n`);
    socket.destroy();
  } catch {}
}
function requestedProfileName(req, fallback) {
  try {
    return (
      new URL(req.url ?? "/", "http://127.0.0.1").searchParams.get("profile")?.trim() || fallback
    );
  } catch {
    return fallback;
  }
}
/** First extension-driver profile name, defaulting to the built-in `chrome`. */
function defaultExtensionProfileName(profiles) {
  for (const [name, profile] of Object.entries(profiles))
    if (profile.driver === "extension") return name;
  return "chrome";
}
/**
 * Handle a gateway upgrade for the extension relay path. Returns true when the
 * request was claimed (handled or rejected), false to let the gateway continue.
 */
async function handleGatewayExtensionUpgrade(req, socket, head) {
  if ((req.url ?? "/").split("?")[0] !== GATEWAY_EXTENSION_RELAY_PATH) return false;
  if (!isAllowedExtensionOrigin(req)) {
    destroy(socket, "403 Forbidden");
    return true;
  }
  let state = getBrowserControlState();
  const expectedToken = readExtensionRelayToken();
  const candidate = requestExtensionProtocolToken(req);
  if (!expectedToken || candidate.length === 0 || !safeEqualSecret(expectedToken, candidate)) {
    destroy(socket, "401 Unauthorized");
    return true;
  }
  if (!state) {
    try {
      state = await startBrowserControlServiceFromConfig();
    } catch (err) {
      log.warn(`failed to start Browser control for extension relay: ${String(err)}`);
    }
    if (!state) {
      destroy(socket, "503 Service Unavailable");
      return true;
    }
  }
  const profileName = requestedProfileName(
    req,
    defaultExtensionProfileName(state.resolved.profiles),
  );
  const resolved = resolveProfile(state.resolved, profileName);
  if (!resolved || resolved.driver !== "extension") {
    destroy(socket, "404 Not Found");
    return true;
  }
  let bridge;
  try {
    bridge = (await ensureExtensionRelayForProfile(state, resolved)).bridge;
  } catch (err) {
    log.warn(`failed to start relay for profile "${profileName}": ${String(err)}`);
    destroy(socket, "503 Service Unavailable");
    return true;
  }
  getWss().handleUpgrade(req, socket, head, (ws) => {
    attachExtensionWebSocket(bridge, ws);
    log.info(`extension connected over gateway for profile "${profileName}"`);
  });
  return true;
}
/** Release the shared WebSocketServer (runtime shutdown / tests). */
function disposeGatewayExtensionRelay() {
  wss?.close();
  wss = null;
}
//#endregion
export { disposeGatewayExtensionRelay, handleGatewayExtensionUpgrade };
