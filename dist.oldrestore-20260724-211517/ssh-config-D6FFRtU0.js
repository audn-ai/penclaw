import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
//#region src/infra/ssh-config.ts
const SSH_CONFIG_OUTPUT_MAX_CHARS = 64 * 1024;
function parsePort(value) {
  if (!value) return;
  const parsed = parseStrictPositiveInteger(value);
  if (parsed === void 0 || parsed > 65535) return;
  return parsed;
}
function parseSshConfigOutput(output) {
  const result = { identityFiles: [] };
  const lines = output.split("\n");
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const [key, ...rest] = line.split(/\s+/);
    const value = rest.join(" ").trim();
    if (!key || !value) continue;
    switch (key) {
      case "user":
        result.user = value;
        break;
      case "hostname":
        result.host = value;
        break;
      case "port":
        result.port = parsePort(value);
        break;
      case "identityfile":
        if (value !== "none") result.identityFiles.push(value);
        break;
      default:
        break;
    }
  }
  return result;
}
async function resolveSshConfig(target, opts = {}) {
  const sshPath = "/usr/bin/ssh";
  const args = ["-G"];
  if (target.port > 0 && target.port !== 22) args.push("-p", String(target.port));
  if (opts.identity?.trim()) args.push("-i", opts.identity.trim());
  const userHost = target.user ? `${target.user}@${target.host}` : target.host;
  args.push("--", userHost);
  try {
    const result = await runCommandWithTimeout([sshPath, ...args], {
      maxOutputBytes: SSH_CONFIG_OUTPUT_MAX_CHARS,
      outputCapture: "head",
      terminateOnOutputLimit: true,
      timeoutMs: Math.max(200, opts.timeoutMs ?? 800),
    });
    if (result.code !== 0 || result.termination !== "exit" || !result.stdout.trim()) return null;
    return parseSshConfigOutput(result.stdout);
  } catch {
    return null;
  }
}
//#endregion
export { SSH_CONFIG_OUTPUT_MAX_CHARS, parseSshConfigOutput, resolveSshConfig };
