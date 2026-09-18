import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { m as isRfc1918Ipv4Address } from "./ip-CyyRxPli.js";
import {
  i as safeNetworkInterfaces,
  t as listExternalInterfaceAddresses,
} from "./network-interfaces-S5y8vKUw.js";
//#region src/infra/advertised-lan-host.ts
const DEFAULT_ROUTE_HINT_TIMEOUT_MS = 3e3;
const DEFAULT_ROUTE_HINT_OUTPUT_BYTES = 16 * 1024;
const WINDOWS_DEFAULT_ROUTE_COMMAND =
  "Get-NetRoute -AddressFamily IPv4 -DestinationPrefix '0.0.0.0/0' | Select-Object -Property InterfaceAlias,InterfaceIndex,NextHop,RouteMetric,InterfaceMetric,DestinationPrefix | ConvertTo-Json -Compress";
function normalizeInterfaceName(name) {
  return typeof name === "string" ? name.trim().toLowerCase() : "";
}
function normalizeMetric(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}
function listAdvertisedLanHostCandidates(snapshot) {
  return listExternalInterfaceAddresses(snapshot, "IPv4")
    .filter((entry) => isRfc1918Ipv4Address(entry.address))
    .map((entry, order) => ({
      interfaceName: entry.name,
      address: entry.address,
      order,
    }));
}
function selectAdvertisedLanHost(candidates, routeHints = []) {
  if (candidates.length === 0) return null;
  for (const hint of routeHints) {
    const hintedName = normalizeInterfaceName(hint.interfaceName);
    if (!hintedName) continue;
    const routed = candidates.find(
      (candidate) => normalizeInterfaceName(candidate.interfaceName) === hintedName,
    );
    if (routed) return routed.address;
  }
  return candidates[0]?.address ?? null;
}
function parseWindowsDefaultRouteHints(stdout) {
  const trimmed = stdout.trim();
  if (!trimmed) return [];
  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return [];
  }
  const rankedRows = [];
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  for (const [order, row] of rows.entries()) {
    if (!row || typeof row !== "object") continue;
    const route = row;
    const interfaceName = normalizeInterfaceName(route.InterfaceAlias);
    if (interfaceName) {
      const routeMetric = normalizeMetric(route.RouteMetric);
      const interfaceMetric = normalizeMetric(route.InterfaceMetric);
      rankedRows.push({
        interfaceName,
        effectiveMetric: routeMetric + interfaceMetric,
        routeMetric,
        interfaceMetric,
        order,
      });
    }
  }
  rankedRows.sort(
    (a, b) =>
      a.effectiveMetric - b.effectiveMetric ||
      a.routeMetric - b.routeMetric ||
      a.interfaceMetric - b.interfaceMetric ||
      a.order - b.order,
  );
  return rankedRows.map((row) => ({ interfaceName: row.interfaceName }));
}
function parseMacOsDefaultRouteHints(stdout) {
  const match = /^\s*interface:\s*(\S+)/m.exec(stdout);
  return match?.[1] ? [{ interfaceName: match[1] }] : [];
}
function parseLinuxDefaultRouteHints(stdout) {
  const hints = [];
  for (const line of stdout.split(/\r?\n/)) {
    if (!line.startsWith("default ")) continue;
    const match = /\bdev\s+(\S+)/.exec(line);
    if (match?.[1]) hints.push({ interfaceName: match[1] });
  }
  return hints;
}
async function runRouteHintCommand(runCommandWithTimeout, argv, timeoutMs) {
  try {
    const result = await runCommandWithTimeout(argv, {
      timeoutMs,
      maxOutputBytes: DEFAULT_ROUTE_HINT_OUTPUT_BYTES,
    });
    return result.code === 0 ? result.stdout : null;
  } catch {
    return null;
  }
}
async function resolveDefaultRouteHints(params) {
  if (params.platform === "win32") {
    const stdout = await runRouteHintCommand(
      params.runCommandWithTimeout,
      [
        "powershell.exe",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        WINDOWS_DEFAULT_ROUTE_COMMAND,
      ],
      params.timeoutMs,
    );
    return stdout ? parseWindowsDefaultRouteHints(stdout) : [];
  }
  if (params.platform === "darwin") {
    const stdout = await runRouteHintCommand(
      params.runCommandWithTimeout,
      ["route", "-n", "get", "default"],
      params.timeoutMs,
    );
    return stdout ? parseMacOsDefaultRouteHints(stdout) : [];
  }
  if (params.platform === "linux") {
    const stdout = await runRouteHintCommand(
      params.runCommandWithTimeout,
      ["ip", "-4", "route", "show", "default"],
      params.timeoutMs,
    );
    return stdout ? parseLinuxDefaultRouteHints(stdout) : [];
  }
  return [];
}
async function resolveAdvertisedLanHost(options = {}) {
  const candidates = listAdvertisedLanHostCandidates(
    safeNetworkInterfaces(options.networkInterfaces),
  );
  if (candidates.length === 0) return null;
  return selectAdvertisedLanHost(
    candidates,
    await resolveDefaultRouteHints({
      platform: options.platform ?? process.platform,
      runCommandWithTimeout: options.runCommandWithTimeout ?? runCommandWithTimeout,
      timeoutMs: options.timeoutMs ?? DEFAULT_ROUTE_HINT_TIMEOUT_MS,
    }),
  );
}
//#endregion
export { resolveAdvertisedLanHost as t };
