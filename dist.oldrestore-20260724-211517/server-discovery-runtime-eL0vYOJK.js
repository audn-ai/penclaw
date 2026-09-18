import fs from "node:fs";
import path from "node:path";
import "./parse-finite-number-Z7n6tXLk.js";
import { n as isTruthyEnvValue } from "./env-Di-LcxqW.js";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { n as pickPrimaryTailnetIPv4, r as pickPrimaryTailnetIPv6 } from "./tailnet-k93TkOdF.js";
import { o as getTailnetHostname } from "./tailscale-DdW1pRs5.js";
import { n as parseTcpPort } from "./tcp-port-1cXcKObm.js";
import {
  a as writeWideAreaGatewayZone,
  i as resolveWideAreaDiscoveryDomain,
} from "./widearea-dns-COr-iuR9.js";
//#region src/gateway/server-discovery.ts
/** Formats the Bonjour instance name while preserving user-provided OpenClaw names. */
function formatBonjourInstanceName(displayName) {
  const trimmed = displayName.trim();
  if (!trimmed) return "OpenClaw";
  if (/openclaw/i.test(trimmed)) return trimmed;
  return `${trimmed} (OpenClaw)`;
}
/** Resolves the CLI path advertised to Bonjour clients, preferring explicit env config. */
function resolveBonjourCliPath(opts = {}) {
  const envPath = (opts.env ?? process.env).OPENCLAW_CLI_PATH?.trim();
  if (envPath) return envPath;
  const statSync = opts.statSync ?? fs.statSync;
  const isFile = (candidate) => {
    try {
      return statSync(candidate).isFile();
    } catch {
      return false;
    }
  };
  const execPath = opts.execPath ?? process.execPath;
  const execDir = path.dirname(execPath);
  const siblingCli = path.join(execDir, "openclaw");
  if (isFile(siblingCli)) return siblingCli;
  const argvPath = (opts.argv ?? process.argv)[1];
  if (argvPath && isFile(argvPath)) return argvPath;
  const cwd = opts.cwd ?? process.cwd();
  const distCli = path.join(cwd, "dist", "index.js");
  if (isFile(distCli)) return distCli;
  const binCli = path.join(cwd, "bin", "openclaw");
  if (isFile(binCli)) return binCli;
}
/** Resolves a Tailnet DNS hint from env or the local tailscale CLI when enabled. */
async function resolveTailnetDnsHint(opts) {
  const envRaw = (opts?.env ?? process.env).OPENCLAW_TAILNET_DNS?.trim();
  const envValue = envRaw && envRaw.length > 0 ? envRaw.replace(/\.$/, "") : "";
  if (envValue) return envValue;
  if (opts?.enabled === false) return;
  const exec =
    opts?.exec ??
    ((command, args) =>
      runExec(command, args, {
        timeoutMs: 1500,
        maxBuffer: 2e5,
      }));
  try {
    return await getTailnetHostname(exec);
  } catch {
    return;
  }
}
//#endregion
//#region src/gateway/server-discovery-runtime.ts
const DEFAULT_DISCOVERY_ADVERTISE_TIMEOUT_MS = 5e3;
function resolveDiscoveryAdvertiseTimeoutMs(env) {
  const raw = env.OPENCLAW_GATEWAY_DISCOVERY_ADVERTISE_TIMEOUT_MS?.trim();
  if (!raw) return DEFAULT_DISCOVERY_ADVERTISE_TIMEOUT_MS;
  const parsed = parseStrictPositiveInteger(raw);
  if (parsed === void 0) return DEFAULT_DISCOVERY_ADVERTISE_TIMEOUT_MS;
  return parsed;
}
/** Start configured Gateway discovery publishers and return their shutdown hook. */
async function startGatewayDiscovery(params) {
  let bonjourStop = null;
  const mdnsMode = params.mdnsMode ?? "minimal";
  const localDiscoveryEnabled =
    mdnsMode !== "off" &&
    !isTruthyEnvValue(process.env.OPENCLAW_DISABLE_BONJOUR) &&
    !process.env.VITEST;
  const mdnsMinimal = mdnsMode !== "full";
  const tailscaleEnabled = params.tailscaleMode !== "off";
  const needsTailnetDns = localDiscoveryEnabled || params.wideAreaDiscoveryEnabled;
  const advertiseTimeoutMs = resolveDiscoveryAdvertiseTimeoutMs(process.env);
  const tailnetDns = needsTailnetDns
    ? await resolveTailnetDnsHint({ enabled: tailscaleEnabled })
    : void 0;
  const sshPort = mdnsMinimal ? void 0 : (parseTcpPort(process.env.OPENCLAW_SSH_PORT) ?? void 0);
  const cliPath = mdnsMinimal ? void 0 : resolveBonjourCliPath();
  if (localDiscoveryEnabled) {
    const stops = [];
    let attemptedLocalDiscovery = false;
    let stoppedLocalDiscovery = false;
    for (const entry of params.gatewayDiscoveryServices ?? []) {
      attemptedLocalDiscovery = true;
      try {
        let timer;
        let timedOut = false;
        const context = {
          machineDisplayName: params.machineDisplayName,
          gatewayPort: params.port,
          gatewayTlsEnabled: params.gatewayTls?.enabled ?? false,
          gatewayTlsFingerprintSha256: params.gatewayTls?.fingerprintSha256,
          gatewayDirectReachable: params.gatewayDirectReachable === true,
          canvasPort: params.canvasPort,
          sshPort,
          tailnetDns,
          cliPath,
          minimal: mdnsMinimal,
        };
        const advertisePromise = Promise.resolve()
          .then(() => entry.service.advertise(context))
          .then(
            async (started) => {
              if (timedOut) {
                if (started?.stop)
                  if (stoppedLocalDiscovery)
                    try {
                      await started.stop();
                    } catch (err) {
                      params.logDiscovery.warn(`gateway discovery stop failed: ${String(err)}`);
                    }
                  else stops.push(started.stop);
                params.logDiscovery.warn(
                  `gateway discovery service completed after startup timeout (${entry.service.id}, plugin=${entry.pluginId})`,
                );
              }
              return started;
            },
            (err) => {
              params.logDiscovery.warn(
                `gateway discovery service failed${timedOut ? " after startup timeout" : ""} (${entry.service.id}, plugin=${entry.pluginId}): ${String(err)}`,
              );
            },
          );
        const timeoutPromise = new Promise((resolve) => {
          timer = setTimeout(() => {
            timedOut = true;
            params.logDiscovery.warn(
              `gateway discovery service timed out after ${advertiseTimeoutMs}ms (${entry.service.id}, plugin=${entry.pluginId}); continuing startup`,
            );
            resolve(void 0);
          }, advertiseTimeoutMs);
          timer.unref?.();
        });
        const started = await Promise.race([advertisePromise, timeoutPromise]);
        if (timer) clearTimeout(timer);
        if (started?.stop) stops.push(started.stop);
      } catch (err) {
        params.logDiscovery.warn(
          `gateway discovery service failed (${entry.service.id}, plugin=${entry.pluginId}): ${String(err)}`,
        );
      }
    }
    if (attemptedLocalDiscovery)
      bonjourStop = async () => {
        stoppedLocalDiscovery = true;
        for (const stop of stops.toReversed())
          try {
            await stop();
          } catch (err) {
            params.logDiscovery.warn(`gateway discovery stop failed: ${String(err)}`);
          }
      };
  }
  if (params.wideAreaDiscoveryEnabled) {
    const wideAreaDomain = resolveWideAreaDiscoveryDomain({
      configDomain: params.wideAreaDiscoveryDomain ?? void 0,
    });
    if (!wideAreaDomain) {
      params.logDiscovery.warn(
        "discovery.wideArea.enabled is true, but no domain was configured; set discovery.wideArea.domain to enable unicast DNS-SD",
      );
      return { bonjourStop };
    }
    const tailnetIPv4 = pickPrimaryTailnetIPv4();
    if (!tailnetIPv4)
      params.logDiscovery.warn(
        "discovery.wideArea.enabled is true, but no Tailscale IPv4 address was found; skipping unicast DNS-SD zone update",
      );
    else
      try {
        const tailnetIPv6 = pickPrimaryTailnetIPv6();
        const result = await writeWideAreaGatewayZone({
          domain: wideAreaDomain,
          gatewayPort: params.port,
          displayName: formatBonjourInstanceName(params.machineDisplayName),
          tailnetIPv4,
          tailnetIPv6: tailnetIPv6 ?? void 0,
          gatewayTlsEnabled: params.gatewayTls?.enabled ?? false,
          gatewayTlsFingerprintSha256: params.gatewayTls?.fingerprintSha256,
          gatewayDirectReachable: params.gatewayDirectReachable === true,
          tailnetDns,
          sshPort,
          cliPath,
        });
        params.logDiscovery.info(
          `wide-area DNS-SD ${result.changed ? "updated" : "unchanged"} (${wideAreaDomain} → ${result.zonePath})`,
        );
      } catch (err) {
        params.logDiscovery.warn(`wide-area discovery update failed: ${String(err)}`);
      }
  }
  return { bonjourStop };
}
//#endregion
export { startGatewayDiscovery };
