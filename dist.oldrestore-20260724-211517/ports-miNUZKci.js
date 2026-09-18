import { o as isErrno } from "./errors-BoHeli7m.js";
import { a as shouldLogVerbose, n as info, s as warn, t as danger } from "./globals-CNUzHTcU.js";
import { t as logDebug } from "./logger-BegyOJlO.js";
import { i as formatPortDiagnostics, n as inspectPortUsage } from "./ports-inspect-DyOb8qZr.js";
import { n as tryListenOnPort } from "./ports-probe-B4qJEiCc.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
//#region src/infra/ports.ts
var PortInUseError = class extends Error {
  constructor(port, details) {
    super(`Port ${port} is already in use.`);
    this.name = "PortInUseError";
    this.port = port;
    this.details = details;
  }
};
async function describePortOwner(port) {
  const diagnostics = await inspectPortUsage(port);
  if (diagnostics.listeners.length === 0) return;
  return formatPortDiagnostics(diagnostics).join("\n");
}
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
async function ensurePortAvailable(port, host) {
  try {
    await tryListenOnPort(
      host
        ? {
            port,
            host,
          }
        : { port },
    );
  } catch (err) {
    if (isErrno(err) && err.code === "EADDRINUSE") throw new PortInUseError(port);
    throw err;
  }
}
async function handlePortError(err, port, context, runtime = defaultRuntime) {
  if (err instanceof PortInUseError || (isErrno(err) && err.code === "EADDRINUSE")) {
    const details =
      err instanceof PortInUseError
        ? (err.details ?? (await describePortOwner(port)))
        : await describePortOwner(port);
    runtime.error(danger(`${context} failed: port ${port} is already in use.`));
    if (details) {
      runtime.error(info("Port listener details:"));
      runtime.error(details);
      if (/openclaw|src\/index\.ts|dist\/index\.js/.test(details))
        runtime.error(
          warn(
            "It looks like another OpenClaw instance is already running. Stop it or pick a different port.",
          ),
        );
    }
    runtime.error(
      info("Resolve by stopping the process using the port or passing --port <free-port>."),
    );
    runtime.exit(1);
  }
  runtime.error(danger(`${context} failed: ${String(err)}`));
  if (shouldLogVerbose()) {
    const stdout = err?.stdout;
    const stderr = err?.stderr;
    if (stdout?.trim()) logDebug(`stdout: ${stdout.trim()}`);
    if (stderr?.trim()) logDebug(`stderr: ${stderr.trim()}`);
  }
  runtime.exit(1);
  throw new Error("unreachable");
}
//#endregion
export {
  handlePortError as i,
  describePortOwner as n,
  ensurePortAvailable as r,
  PortInUseError as t,
};
