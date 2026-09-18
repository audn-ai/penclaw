import net from "node:net";
import os from "node:os";
import "./src-Bl7G9qvi.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { t as resolveLsofCommand } from "./ports-lsof-BmdLddJi.js";
import {
  n as parseWindowsNetstatListeners,
  t as parseTcpEndpoint,
} from "./ports-netstat-CscdLGyq.js";
import { t as probePortUsage } from "./ports-probe-B4qJEiCc.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import {
  a as getWindowsSystem32ExePath,
  o as getWindowsWmicExePath,
  r as getWindowsPowerShellExePath,
} from "./windows-install-roots-Cnzi1kc9.js";
//#region src/infra/ports-format.ts
/** Classifies a listener as OpenClaw Gateway, SSH tunnel, known non-gateway, or unknown. */
function classifyPortListener(listener, _port) {
  if (
    normalizeLowercaseStringOrEmpty(
      `${listener.commandLine ?? ""} ${listener.command ?? ""}`,
    ).includes("openclaw")
  )
    return "gateway";
  const command = normalizeLowercaseStringOrEmpty(listener.command ?? "");
  const commandLine = normalizeLowercaseStringOrEmpty(listener.commandLine ?? "");
  const hasSshCommand = /(?:^|[/\\])ssh(?:\.exe)?$/.test(command);
  const hasSshExecutable =
    hasSshCommand ||
    /(?:^|[\s"'])(?:(?:"[^"]*[/\\])|(?:'[^']*[/\\])|(?:\S*[/\\]))?ssh(?:\.exe)?(?:[\s"']|$)/.test(
      commandLine,
    );
  if (hasSshCommand) return "ssh";
  if (hasSshExecutable) return "ssh";
  if (
    command === "sshd" ||
    /(?:^|[/\\])sshd(?:\.exe)?$/.test(command) ||
    /(?:^|[/\\])[^/\\\s]*ssh[^/\\\s]*(?:\.exe)?$/.test(command)
  )
    return "non_gateway";
  if (/(?:^|[/\\\s])[^/\\\s]*ssh[^/\\\s]*(?:\.exe)?(?:[/\\\s"']|$)/.test(commandLine))
    return "non_gateway";
  return "unknown";
}
function parseListenerAddress(address) {
  const trimmed = address.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/^tcp6?\s+/i, "").replace(/\s*\(listen\)\s*$/i, "");
  const bracketMatch = normalized.match(/^\[([^\]]+)\]:(\d+)$/);
  if (bracketMatch) {
    const port = Number.parseInt(
      expectDefined(bracketMatch[2], "bracket match capture group 2"),
      10,
    );
    return Number.isFinite(port)
      ? {
          host: normalizeLowercaseStringOrEmpty(bracketMatch[1]),
          port,
        }
      : null;
  }
  const lastColon = normalized.lastIndexOf(":");
  if (lastColon <= 0 || lastColon >= normalized.length - 1) return null;
  const host = normalizeLowercaseStringOrEmpty(normalized.slice(0, lastColon));
  const portToken = normalized.slice(lastColon + 1).trim();
  if (!/^\d+$/.test(portToken)) return null;
  const port = Number.parseInt(portToken, 10);
  return Number.isFinite(port)
    ? {
        host,
        port,
      }
    : null;
}
function classifyLoopbackAddressFamily(host) {
  if (host === "127.0.0.1" || host === "localhost") return "ipv4";
  if (host === "::1") return "ipv6";
  if (host.startsWith("::ffff:")) return host.slice(7) === "127.0.0.1" ? "ipv6" : null;
  return null;
}
function isWildcardAddress(host) {
  return host === "0.0.0.0" || host === "::" || host === "*";
}
function isExpectedGatewayBindAddress(host) {
  return classifyLoopbackAddressFamily(host) !== null || isWildcardAddress(host);
}
function parsePortListeners(listeners, port) {
  const parsedListeners = [];
  for (const listener of listeners) {
    const pid = listener.pid;
    if (typeof pid !== "number" || !Number.isFinite(pid) || typeof listener.address !== "string")
      return null;
    const address = parseListenerAddress(listener.address);
    if (!address || address.port !== port) return null;
    parsedListeners.push({
      pid,
      host: address.host,
    });
  }
  return parsedListeners;
}
function parseGatewayListeners(listeners, port) {
  if (listeners.some((listener) => classifyPortListener(listener, port) !== "gateway")) return null;
  return parsePortListeners(listeners, port);
}
/** Returns true for one Gateway listener bound to an expected loopback or wildcard address. */
function isSingleExpectedGatewayListener(listeners, port) {
  if (listeners.length !== 1) return false;
  const parsed = parseGatewayListeners(listeners, port);
  return Boolean(parsed?.[0] && isExpectedGatewayBindAddress(parsed[0].host));
}
/** Returns true for one Gateway process represented by separate IPv4 and IPv6 loopback rows. */
function isDualStackLoopbackGatewayListeners(listeners, port) {
  if (listeners.length < 2) return false;
  const parsed = parseGatewayListeners(listeners, port);
  if (!parsed) return false;
  const pids = new Set(parsed.map(({ pid }) => pid));
  const families = new Set(parsed.map(({ host }) => classifyLoopbackAddressFamily(host)));
  return pids.size === 1 && !families.has(null) && families.has("ipv4") && families.has("ipv6");
}
function parsedListenersOwnSpecificIpv4WithLoopback(parsed) {
  if (new Set(parsed.map(({ pid }) => pid)).size !== 1) return false;
  const hosts = new Set(parsed.map(({ host }) => host));
  const specificHosts = [...hosts].filter(
    (host) => host !== "127.0.0.1" && net.isIP(host) === 4 && !isWildcardAddress(host),
  );
  return hosts.has("127.0.0.1") && specificHosts.length > 0;
}
/** Checks one Gateway PID owns both an exact IPv4 interface and canonical loopback. */
function isSpecificIpv4WithLoopbackGatewayListeners(listeners, port) {
  if (listeners.length !== 2) return false;
  const parsed = parseGatewayListeners(listeners, port);
  return Boolean(parsed && parsedListenersOwnSpecificIpv4WithLoopback(parsed));
}
/** Checks one PID owns an expected IPv4 interface and canonical loopback. */
function isSameProcessSpecificIpv4WithLoopbackListeners(listeners, port, expectedSpecificHost) {
  if (listeners.length !== 2) return false;
  const parsed = parsePortListeners(listeners, port);
  return Boolean(
    parsed &&
    parsedListenersOwnSpecificIpv4WithLoopback(parsed) &&
    parsed.some(({ host }) => host === expectedSpecificHost),
  );
}
/** Returns true when listener rows describe a benign Gateway bind pattern. */
function isExpectedGatewayListeners(listeners, port) {
  return (
    isSingleExpectedGatewayListener(listeners, port) ||
    isDualStackLoopbackGatewayListeners(listeners, port) ||
    isSpecificIpv4WithLoopbackGatewayListeners(listeners, port)
  );
}
/** Builds user-facing remediation hints for processes occupying a port. */
function buildPortHints(listeners, port) {
  if (listeners.length === 0) return [];
  const kinds = new Set(listeners.map((listener) => classifyPortListener(listener, port)));
  const hints = [];
  const expectedGatewayListeners = isExpectedGatewayListeners(listeners, port);
  if (kinds.has("gateway") && !expectedGatewayListeners)
    hints.push(
      `Gateway already running locally. Stop it (${formatCliCommand("openclaw gateway stop")}) or use a different port.`,
    );
  if (kinds.has("ssh"))
    hints.push(
      "SSH tunnel already bound to this port. Close the tunnel or use a different local port in -L.",
    );
  if (kinds.has("unknown") || kinds.has("non_gateway"))
    hints.push("Another process is listening on this port.");
  if (listeners.length > 1 && !expectedGatewayListeners)
    hints.push(
      "Multiple listeners detected; ensure only one gateway/tunnel per port unless intentionally running isolated profiles.",
    );
  return hints;
}
/** Formats one listener row for CLI diagnostics. */
function formatPortListener(listener) {
  return `${listener.pid ? `pid ${listener.pid}` : "pid ?"}${listener.user ? ` ${listener.user}` : ""}: ${listener.commandLine || listener.command || "unknown"}${listener.address ? ` (${listener.address})` : ""}`;
}
/** Formats free/busy port diagnostics into CLI output lines. */
function formatPortDiagnostics(diagnostics) {
  if (diagnostics.status !== "busy") return [`Port ${diagnostics.port} is free.`];
  const lines = [`Port ${diagnostics.port} is already in use.`];
  for (const listener of diagnostics.listeners) lines.push(`- ${formatPortListener(listener)}`);
  for (const hint of diagnostics.hints) lines.push(`- ${hint}`);
  return lines;
}
//#endregion
//#region src/infra/ports-inspect.ts
async function runCommandSafe(argv, timeoutMs = 5e3) {
  try {
    const res = await runCommandWithTimeout(argv, { timeoutMs });
    return {
      stdout: res.stdout,
      stderr: res.stderr,
      code: res.code ?? 1,
    };
  } catch (err) {
    return {
      stdout: "",
      stderr: "",
      code: 1,
      error: String(err),
    };
  }
}
function parseLsofFieldOutput(output) {
  const lines = output.split(/\r?\n/).filter(Boolean);
  const listeners = [];
  let processFields = {};
  for (const line of lines)
    if (line.startsWith("p")) {
      const pid = parseStrictPositiveInteger(line.slice(1));
      processFields = pid !== void 0 ? { pid } : {};
    } else if (line.startsWith("c")) processFields.command = line.slice(1);
    else if (line.startsWith("n"))
      listeners.push({
        ...processFields,
        address: line.slice(1),
      });
  return listeners;
}
function dedupePortListeners(listeners) {
  const seen = /* @__PURE__ */ new Set();
  return listeners.filter((listener) => {
    const key = `${listener.pid ?? ""}\0${listener.command ?? ""}\0${listener.address ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function parseLsofTcpConnectionAddress(address) {
  const normalized = address
    ?.replace(/^tcp\s+/i, "")
    .replace(/\s*\([^)]*\)\s*$/i, "")
    .trim();
  if (!normalized?.includes("->")) return null;
  const [localRaw, remoteRaw] = normalized.split("->", 2);
  const local = parseTcpEndpoint(localRaw ?? "");
  const remote = parseTcpEndpoint(remoteRaw ?? "");
  return local && remote
    ? {
        local,
        remote,
      }
    : null;
}
function resolveLocalNetworkAddresses() {
  const addresses = /* @__PURE__ */ new Set(["127.0.0.1", "::1", "localhost", "0.0.0.0", "::"]);
  for (const entries of Object.values(os.networkInterfaces()))
    for (const entry of entries ?? []) addresses.add(entry.address.toLowerCase());
  return addresses;
}
function isGatewayConnectionAddress(address, port, localAddresses) {
  const parsed = parseLsofTcpConnectionAddress(address);
  if (!parsed) return false;
  if (parsed.local.port === port) return true;
  return parsed.remote.port === port && localAddresses.has(parsed.remote.host);
}
function resolveLsofTcpDirection(address, port) {
  const parsed = parseLsofTcpConnectionAddress(address);
  if (!parsed) return "unknown";
  if (parsed.local.port === port) return "server";
  return parsed.remote.port === port ? "client" : "unknown";
}
function parseLsofConnectionFieldOutput(output, port) {
  const connections = [];
  const localAddresses = resolveLocalNetworkAddresses();
  for (const entry of parseLsofFieldOutput(output)) {
    if (!isGatewayConnectionAddress(entry.address, port, localAddresses)) continue;
    const connection = entry;
    connection.direction = resolveLsofTcpDirection(entry.address, port);
    connections.push(connection);
  }
  return connections;
}
function parseSsConnectionEndpoint(raw) {
  if (raw.startsWith("users:")) return null;
  if (raw.includes(":")) return raw;
  return null;
}
function parseSsConnections(output, port) {
  const connections = [];
  const localAddresses = resolveLocalNetworkAddresses();
  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const endpoints = line
      .split(/\s+/)
      .map(parseSsConnectionEndpoint)
      .filter((endpoint) => Boolean(endpoint));
    if (endpoints.length < 2) continue;
    const [local, remote] = endpoints.slice(-2);
    const address = `TCP ${local}->${remote} (ESTABLISHED)`;
    if (!isGatewayConnectionAddress(address, port, localAddresses)) continue;
    const connection = {
      address,
      direction: resolveLsofTcpDirection(address, port),
    };
    const pidMatch = line.match(/pid=(\d+)/);
    if (pidMatch) {
      const pid = Number.parseInt(expectDefined(pidMatch[1], "pid match capture group 1"), 10);
      if (Number.isFinite(pid)) connection.pid = pid;
    }
    const commandMatch = line.match(/users:\(\("([^"]+)"/);
    if (commandMatch?.[1]) connection.command = commandMatch[1];
    connections.push(connection);
  }
  return connections;
}
async function enrichUnixListenerProcessInfo(listeners) {
  await Promise.all(
    listeners.map(async (listener) => {
      if (!listener.pid) return;
      const [commandLine, user, parentPid] = await Promise.all([
        resolveUnixCommandLine(listener.pid),
        resolveUnixUser(listener.pid),
        resolveUnixParentPid(listener.pid),
      ]);
      if (commandLine) listener.commandLine = commandLine;
      if (user) listener.user = user;
      if (parentPid !== void 0) listener.ppid = parentPid;
    }),
  );
}
async function readUnixEstablishedConnectionsFromSs(port) {
  const errors = [];
  const res = await runCommandSafe([
    "ss",
    "-H",
    "-tnp",
    "state",
    "established",
    `( sport = :${port} or dport = :${port} )`,
  ]);
  if (res.code === 0) {
    const connections = parseSsConnections(res.stdout, port);
    await enrichUnixListenerProcessInfo(connections);
    return {
      connections,
      detail: res.stdout.trim() || void 0,
      errors,
    };
  }
  const stderr = res.stderr.trim();
  if (res.code === 1 && !res.error && !stderr)
    return {
      connections: [],
      detail: void 0,
      errors,
    };
  if (res.error) errors.push(res.error);
  const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
  if (detail) errors.push(detail);
  return {
    connections: [],
    detail: void 0,
    errors,
  };
}
async function readUnixEstablishedConnections(port) {
  const res = await runCommandSafe([
    await resolveLsofCommand(),
    "-nP",
    `-iTCP:${port}`,
    "-sTCP:ESTABLISHED",
    "-FpFcn",
  ]);
  if (res.code === 0) {
    const connections = parseLsofConnectionFieldOutput(res.stdout, port);
    await enrichUnixListenerProcessInfo(connections);
    return {
      connections,
      detail: res.stdout.trim() || void 0,
      errors: [],
    };
  }
  const stderr = res.stderr.trim();
  if (res.code === 1 && !res.error && !stderr)
    return {
      connections: [],
      detail: void 0,
      errors: [],
    };
  const errors = [];
  if (res.error) errors.push(res.error);
  const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
  if (detail) errors.push(detail);
  const ssFallback = await readUnixEstablishedConnectionsFromSs(port);
  if (ssFallback.connections.length > 0) return ssFallback;
  return {
    connections: [],
    detail: void 0,
    errors: [...errors, ...ssFallback.errors],
  };
}
async function resolveUnixCommandLine(pid) {
  const res = await runCommandSafe(["ps", "-p", String(pid), "-o", "command="]);
  if (res.code !== 0) return;
  return res.stdout.trim() || void 0;
}
async function resolveUnixUser(pid) {
  const res = await runCommandSafe(["ps", "-p", String(pid), "-o", "user="]);
  if (res.code !== 0) return;
  return res.stdout.trim() || void 0;
}
async function resolveUnixParentPid(pid) {
  const res = await runCommandSafe(["ps", "-p", String(pid), "-o", "ppid="]);
  if (res.code !== 0) return;
  const line = res.stdout.trim();
  const parentPid = Number.parseInt(line, 10);
  return Number.isFinite(parentPid) && parentPid > 0 ? parentPid : void 0;
}
function parseSsListeners(output, port) {
  const lines = output.split(/\r?\n/).map((line) => line.trim());
  const listeners = [];
  for (const line of lines) {
    if (!line || !line.includes("LISTEN")) continue;
    const localAddress = line.split(/\s+/).find((part) => parseTcpEndpoint(part)?.port === port);
    if (!localAddress) continue;
    const listener = { address: localAddress };
    const pidMatch = line.match(/pid=(\d+)/);
    if (pidMatch) {
      const pid = Number.parseInt(expectDefined(pidMatch[1], "pid match capture group 1"), 10);
      if (Number.isFinite(pid)) listener.pid = pid;
    }
    const commandMatch = line.match(/users:\(\("([^"]+)"/);
    if (commandMatch?.[1]) listener.command = commandMatch[1];
    listeners.push(listener);
  }
  return listeners;
}
async function readUnixListenersFromSs(port) {
  const errors = [];
  const res = await runCommandSafe(["ss", "-H", "-ltnp", `sport = :${port}`]);
  if (res.code === 0) {
    const listeners = parseSsListeners(res.stdout, port);
    await enrichUnixListenerProcessInfo(listeners);
    return {
      listeners,
      detail: res.stdout.trim() || void 0,
      errors,
    };
  }
  const stderr = res.stderr.trim();
  if (res.code === 1 && !res.error && !stderr)
    return {
      listeners: [],
      detail: void 0,
      errors,
    };
  if (res.error) errors.push(res.error);
  const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
  if (detail) errors.push(detail);
  return {
    listeners: [],
    detail: void 0,
    errors,
  };
}
async function readUnixListeners(port) {
  const res = await runCommandSafe([
    await resolveLsofCommand(),
    "-nP",
    `-iTCP:${port}`,
    "-sTCP:LISTEN",
    "-FpFcn",
  ]);
  if (res.code === 0) {
    const listeners = dedupePortListeners(parseLsofFieldOutput(res.stdout));
    await enrichUnixListenerProcessInfo(listeners);
    return {
      listeners,
      detail: res.stdout.trim() || void 0,
      errors: [],
    };
  }
  const lsofErrors = [];
  const stderr = res.stderr.trim();
  if (res.code === 1 && !res.error && !stderr)
    return {
      listeners: [],
      detail: void 0,
      errors: [],
    };
  if (res.error) lsofErrors.push(res.error);
  const detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
  if (detail) lsofErrors.push(detail);
  const ssFallback = await readUnixListenersFromSs(port);
  if (ssFallback.listeners.length > 0) return ssFallback;
  return {
    listeners: [],
    detail: void 0,
    errors: [...lsofErrors, ...ssFallback.errors],
  };
}
function parseNetstatListeners(output, port) {
  return parseWindowsNetstatListeners(output, port);
}
function parseNetstatConnections(output, port) {
  const connections = [];
  const localAddresses = resolveLocalNetworkAddresses();
  for (const rawLine of output.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || !normalizeLowercaseStringOrEmpty(line).includes("established")) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 5) continue;
    const local = parts[1];
    const remote = parts[2];
    const pidRaw = parts.at(-1);
    if (!local || !remote || !pidRaw) continue;
    const address = `TCP ${local}->${remote} (ESTABLISHED)`;
    if (!isGatewayConnectionAddress(address, port, localAddresses)) continue;
    const connection = {
      address,
      direction: resolveLsofTcpDirection(address, port),
    };
    const pid = parseStrictPositiveInteger(pidRaw);
    if (pid !== void 0) connection.pid = pid;
    connections.push(connection);
  }
  return connections;
}
async function resolveWindowsImageName(pid) {
  const res = await runCommandSafe([
    getWindowsSystem32ExePath("tasklist.exe"),
    "/FI",
    `PID eq ${pid}`,
    "/FO",
    "LIST",
  ]);
  if (res.code !== 0) return;
  for (const rawLine of res.stdout.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!normalizeLowercaseStringOrEmpty(line).startsWith("image name:")) continue;
    return line.slice(11).trim() || void 0;
  }
}
async function resolveWindowsCommandLine(pid) {
  const powershell = await runCommandSafe([
    getWindowsPowerShellExePath(),
    "-NoProfile",
    "-Command",
    `(Get-CimInstance Win32_Process -Filter "ProcessId = ${pid}" | Select-Object -ExpandProperty CommandLine)`,
  ]);
  if (powershell.code === 0) {
    const value = powershell.stdout.trim();
    if (value) return value;
  }
  const wmic = await runCommandSafe([
    getWindowsWmicExePath(),
    "process",
    "where",
    `ProcessId=${pid}`,
    "get",
    "CommandLine",
    "/value",
  ]);
  if (wmic.code !== 0) return;
  for (const rawLine of wmic.stdout.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!normalizeLowercaseStringOrEmpty(line).startsWith("commandline=")) continue;
    return line.slice(12).trim() || void 0;
  }
}
async function readWindowsNetstatEntries(port, parse) {
  const errors = [];
  const res = await runCommandSafe([getWindowsSystem32ExePath("netstat.exe"), "-ano"]);
  if (res.code !== 0) {
    if (res.error) errors.push(res.error);
    const detail = [res.stderr.trim(), res.stdout.trim()].filter(Boolean).join("\n");
    if (detail) errors.push(detail);
    return {
      entries: [],
      errors,
    };
  }
  const entries = parse(res.stdout, port);
  await Promise.all(
    entries.map(async (entry) => {
      if (!entry.pid) return;
      const [imageName, commandLine] = await Promise.all([
        resolveWindowsImageName(entry.pid),
        resolveWindowsCommandLine(entry.pid),
      ]);
      if (imageName) entry.command = imageName;
      if (commandLine) entry.commandLine = commandLine;
    }),
  );
  return {
    entries,
    detail: res.stdout.trim() || void 0,
    errors,
  };
}
async function readWindowsListeners(port) {
  const result = await readWindowsNetstatEntries(port, parseNetstatListeners);
  return {
    listeners: result.entries,
    detail: result.detail,
    errors: result.errors,
  };
}
async function readWindowsEstablishedConnections(port) {
  const result = await readWindowsNetstatEntries(port, parseNetstatConnections);
  return {
    connections: result.entries,
    detail: result.detail,
    errors: result.errors,
  };
}
async function inspectPortUsage(port) {
  const errors = [];
  const result =
    process.platform === "win32" ? await readWindowsListeners(port) : await readUnixListeners(port);
  errors.push(...result.errors);
  let listeners = result.listeners;
  let status = listeners.length > 0 ? "busy" : "unknown";
  if (listeners.length === 0) status = await probePortUsage(port);
  if (status !== "busy") listeners = [];
  const hints = buildPortHints(listeners, port);
  if (status === "busy" && listeners.length === 0)
    hints.push(
      "Port is in use but process details are unavailable (install lsof or run as an admin user).",
    );
  return {
    port,
    status,
    listeners,
    hints,
    detail: result.detail,
    errors: errors.length > 0 ? errors : void 0,
  };
}
async function inspectPortConnections(port) {
  const result =
    process.platform === "win32"
      ? await readWindowsEstablishedConnections(port)
      : await readUnixEstablishedConnections(port);
  return {
    port,
    connections: result.connections,
    detail: result.detail,
    errors: result.errors.length > 0 ? result.errors : void 0,
  };
}
//#endregion
export {
  isDualStackLoopbackGatewayListeners as a,
  formatPortDiagnostics as i,
  inspectPortUsage as n,
  isExpectedGatewayListeners as o,
  classifyPortListener as r,
  isSameProcessSpecificIpv4WithLoopbackListeners as s,
  inspectPortConnections as t,
};
