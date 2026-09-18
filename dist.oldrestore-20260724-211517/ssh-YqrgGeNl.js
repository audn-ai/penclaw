import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { g as registerSecretValueForRedaction } from "./redact-CUe6Oey5.js";
import { r as normalizeScpRemoteHost } from "./scp-host-BtrM4IVE.js";
//#region src/gateway/worker-environments/ssh.ts
const MAX_HOST_KEY_LENGTH = 16384;
const MAX_COMMAND_OUTPUT_BYTES = 64 * 1024;
const OPENSSH_HOST_KEY_TYPE_PATTERN =
  /^(?:ssh|ecdsa-sha2|sk-(?:ssh|ecdsa-sha2))-[A-Za-z0-9@._+-]+$/u;
const OPENSSH_HOST_KEY_DATA_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/u;
function normalizeIdentityMaterial(contents) {
  const normalized = contents
    .replace(/^\uFEFF/u, "")
    .replace(/\r\n?/gu, "\n")
    .replace(/\\r\\n|\\r/gu, "\\n")
    .replace(/\\n/gu, "\n");
  return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
}
function normalizeEndpoint(ssh) {
  const host = ssh.host.trim();
  const user = ssh.user.trim();
  if (!Number.isInteger(ssh.port) || ssh.port < 1 || ssh.port > 65535)
    throw new Error("Worker SSH port must be an integer between 1 and 65535");
  const bracketedHost = host.includes(":") && !host.startsWith("[") ? `[${host}]` : host;
  const scpTarget = normalizeScpRemoteHost(`${user}@${bracketedHost}`);
  if (!scpTarget) throw new Error("Worker SSH endpoint contains an invalid user or host");
  const normalizedHost = bracketedHost.startsWith("[") ? bracketedHost.slice(1, -1) : bracketedHost;
  return {
    sshTarget: `${user}@${normalizedHost}`,
    scpTarget,
    host: normalizedHost,
    port: ssh.port,
  };
}
function pinnedKnownHostsLine(params) {
  if (
    params.pinnedHostKey.length > MAX_HOST_KEY_LENGTH ||
    params.pinnedHostKey.includes("\n") ||
    params.pinnedHostKey.includes("\r")
  )
    throw new Error("Pinned worker SSH host key must contain exactly one public key");
  const tokens = params.pinnedHostKey.trim().split(/\s+/u);
  const [algorithm, encodedKey] = tokens;
  if (
    tokens.length !== 2 ||
    !algorithm ||
    !encodedKey ||
    !OPENSSH_HOST_KEY_TYPE_PATTERN.test(algorithm) ||
    !OPENSSH_HOST_KEY_DATA_PATTERN.test(encodedKey) ||
    encodedKey.length % 4 !== 0
  )
    throw new Error("Pinned worker SSH host key must use OpenSSH public-key format");
  return `${params.port === 22 ? params.host : `[${params.host}]:${params.port}`} ${algorithm} ${encodedKey}\n`;
}
/** Materializes one pinned identity/known-hosts context for a complete SSH ownership lifetime. */
async function prepareWorkerSsh(params) {
  if (params.pinnedHostKey === void 0)
    throw new Error(
      "Worker SSH setup is missing pinnedHostKey; WorkerProvider.provision() must return ssh.hostKey",
    );
  const endpoint = normalizeEndpoint(params.ssh);
  const knownHosts = pinnedKnownHostsLine({
    host: endpoint.host,
    port: endpoint.port,
    pinnedHostKey: params.pinnedHostKey,
  });
  const temporaryDir = await fs.mkdtemp(
    path.join(os.tmpdir(), params.temporaryDirectoryPrefix ?? "openclaw-worker-ssh-"),
  );
  try {
    const identity = await params.resolveIdentity(params.ssh.keyRef);
    let identityPath;
    if (identity.kind === "path") {
      const resolvedPath = identity.path.trim();
      if (!resolvedPath || !path.isAbsolute(resolvedPath))
        throw new Error("Worker SSH identity path must be absolute");
      identityPath = resolvedPath;
    } else {
      if (!identity.contents.trim())
        throw new Error("Worker SSH identity material must be non-empty");
      registerSecretValueForRedaction(identity.contents);
      const normalizedContents = normalizeIdentityMaterial(identity.contents);
      if (normalizedContents !== identity.contents)
        registerSecretValueForRedaction(normalizedContents);
      identityPath = path.join(temporaryDir, "identity");
      await fs.writeFile(identityPath, normalizedContents, { mode: 384 });
      await fs.chmod(identityPath, 384);
    }
    const knownHostsPath = path.join(temporaryDir, "known_hosts");
    await fs.writeFile(knownHostsPath, knownHosts, { mode: 384 });
    let disposed = false;
    return {
      ...endpoint,
      identityPath,
      knownHostsPath,
      async dispose() {
        if (disposed) return;
        disposed = true;
        await fs.rm(temporaryDir, {
          recursive: true,
          force: true,
        });
      },
    };
  } catch (error) {
    await fs.rm(temporaryDir, {
      recursive: true,
      force: true,
    });
    throw error;
  }
}
/** Pinned SSH options shared by bootstrap, tunnel control, and workspace transfer. */
function workerSshOptions(prepared, params) {
  return [
    "-F",
    "none",
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=10",
    "-o",
    "NumberOfPasswordPrompts=0",
    "-o",
    "PreferredAuthentications=publickey",
    "-o",
    "StrictHostKeyChecking=yes",
    "-o",
    `UserKnownHostsFile=${prepared.knownHostsPath}`,
    "-o",
    "GlobalKnownHostsFile=none",
    "-o",
    "UpdateHostKeys=no",
    "-o",
    "ForwardAgent=no",
    "-o",
    "ForwardX11=no",
    "-o",
    "ForwardX11Trusted=no",
    "-o",
    `ClearAllForwardings=${params.forwarding === "disabled" ? "yes" : "no"}`,
    "-o",
    "ExitOnForwardFailure=yes",
    "-o",
    "IdentityAgent=none",
    "-i",
    prepared.identityPath,
    "-o",
    "IdentitiesOnly=yes",
    "-o",
    "ControlMaster=no",
    "-o",
    "ControlPath=none",
  ];
}
function workerSshCommandOptions(params) {
  const baseEnv = Object.fromEntries(
    ["HOME", "PATH", "LANG", "LC_ALL", "TZ", "SystemRoot", "WINDIR"].flatMap((name) =>
      process.env[name] === void 0 ? [] : [[name, process.env[name]]],
    ),
  );
  return {
    timeoutMs: params.timeoutMs,
    input: params.input,
    signal: params.signal,
    baseEnv,
    maxOutputBytes: MAX_COMMAND_OUTPUT_BYTES,
    killProcessTree: true,
  };
}
function shellEscape(value) {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}
function workerSshRemoteCommand(argv) {
  return argv.map(shellEscape).join(" ");
}
//#endregion
export {
  workerSshRemoteCommand as i,
  workerSshCommandOptions as n,
  workerSshOptions as r,
  prepareWorkerSsh as t,
};
