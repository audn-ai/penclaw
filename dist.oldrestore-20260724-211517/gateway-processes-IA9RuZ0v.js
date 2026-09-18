import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { n as findGatewayPidsOnPortSync } from "./restart-stale-pids-C3MK7Phb.js";
import { v as uniqueValues } from "./string-normalization-CRyoFBPt.js";
import {
  c as parseProcCmdline,
  i as readWindowsProcessArgsSync,
  o as isGatewayArgv,
  t as readWindowsListeningPidsOnPortSync,
} from "./windows-port-pids-ClQ99WdK.js";
//#region src/infra/gateway-processes.ts
/** Read command argv for a PID using the current platform's process APIs. */
function readGatewayProcessArgsSync(pid) {
  if (process.platform === "linux")
    try {
      return parseProcCmdline(fs.readFileSync(`/proc/${pid}/cmdline`, "utf8"));
    } catch {
      return null;
    }
  if (process.platform === "darwin") {
    const ps = spawnSync("ps", ["-o", "command=", "-p", String(pid)], {
      encoding: "utf8",
      timeout: 1e3,
    });
    if (ps.error || ps.status !== 0) return null;
    const command = ps.stdout.trim();
    return command ? command.split(/\s+/) : null;
  }
  if (process.platform === "win32") return readWindowsProcessArgsSync(pid);
  return null;
}
/** Signal a PID only after its argv matches a gateway process. */
function signalVerifiedGatewayPidSync(pid, signal) {
  const args = readGatewayProcessArgsSync(pid);
  if (!args || !isGatewayArgv(args, { allowGatewayBinary: true }))
    throw new Error(`refusing to signal non-gateway process pid ${pid}`);
  process.kill(pid, signal);
}
/** Find listener PIDs on `port` and keep only verified gateway processes. */
function findVerifiedGatewayListenerPidsOnPortSync(port) {
  return uniqueValues(
    process.platform === "win32"
      ? readWindowsListeningPidsOnPortSync(port)
      : findGatewayPidsOnPortSync(port),
  )
    .filter((pid) => Number.isFinite(pid) && pid > 0 && pid !== process.pid)
    .filter((pid) => {
      const args = readGatewayProcessArgsSync(pid);
      return args != null && isGatewayArgv(args, { allowGatewayBinary: true });
    });
}
/** Format gateway PIDs for human-facing diagnostics. */
function formatGatewayPidList(pids) {
  return pids.join(", ");
}
//#endregion
export {
  signalVerifiedGatewayPidSync as i,
  formatGatewayPidList as n,
  readGatewayProcessArgsSync as r,
  findVerifiedGatewayListenerPidsOnPortSync as t,
};
