import { execFileSync } from "node:child_process";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { N as isNodeRuntime } from "./argv-zTv4_Dzq.js";
import {
  n as findFirstAccessibleGatewayEntrypoint,
  r as isGatewayDistEntrypointPath,
  t as buildGatewayDistEntrypointCandidates,
} from "./gateway-entrypoint-Cmek2XHM.js";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-Cnzi1kc9.js";
//#region src/daemon/program-args.ts
/** Builds runtime command arguments for gateway and node service installs. */
const OPENCLAW_WRAPPER_ENV_KEY = "OPENCLAW_WRAPPER";
async function resolveCliEntrypointPathForService() {
  const argv1 = process.argv[1];
  if (!argv1) throw new Error("Unable to resolve CLI entrypoint path");
  const normalized = path.resolve(argv1);
  const resolvedPath = await resolveRealpathSafe(normalized);
  if (isGatewayDistEntrypointPath(resolvedPath)) {
    const preferredDistEntrypoint = await findFirstAccessibleGatewayEntrypoint(
      buildGatewayDistEntrypointCandidates(normalized, resolvedPath),
      async (candidate) => {
        try {
          await fs$1.access(candidate);
          return true;
        } catch {
          return false;
        }
      },
    );
    if (preferredDistEntrypoint) return preferredDistEntrypoint;
    if (isGatewayDistEntrypointPath(normalized) && normalized !== resolvedPath)
      try {
        await fs$1.access(normalized);
        return normalized;
      } catch {}
    return resolvedPath;
  }
  const distCandidates = buildDistCandidates(resolvedPath, normalized);
  for (const candidate of distCandidates)
    try {
      await fs$1.access(candidate);
      return candidate;
    } catch {}
  throw new Error(
    `Cannot find built CLI at ${distCandidates.join(" or ")}. Run "pnpm build" first, or use dev mode.`,
  );
}
async function resolveRealpathSafe(inputPath) {
  try {
    return await fs$1.realpath(inputPath);
  } catch {
    return inputPath;
  }
}
function buildDistCandidates(...inputs) {
  const candidates = [];
  const seen = /* @__PURE__ */ new Set();
  for (const inputPath of inputs) {
    if (!inputPath) continue;
    const baseDir = path.dirname(inputPath);
    appendDistCandidates(candidates, seen, path.resolve(baseDir, ".."));
    appendDistCandidates(candidates, seen, baseDir);
    appendNodeModulesBinCandidates(candidates, seen, inputPath);
  }
  return candidates;
}
function appendDistCandidates(candidates, seen, baseDir) {
  const distDir = path.resolve(baseDir, "dist");
  const distEntries = [
    path.join(distDir, "index.js"),
    path.join(distDir, "index.mjs"),
    path.join(distDir, "entry.js"),
    path.join(distDir, "entry.mjs"),
  ];
  for (const entry of distEntries) {
    if (seen.has(entry)) continue;
    seen.add(entry);
    candidates.push(entry);
  }
}
function appendNodeModulesBinCandidates(candidates, seen, inputPath) {
  const parts = inputPath.split(path.sep);
  const binIndex = parts.lastIndexOf(".bin");
  if (binIndex <= 0) return;
  if (parts[binIndex - 1] !== "node_modules") return;
  const binName = path.basename(inputPath);
  const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
  appendDistCandidates(candidates, seen, path.join(nodeModulesDir, binName));
}
function resolveRepoRootForDev() {
  const argv1 = process.argv[1];
  if (!argv1) throw new Error("Unable to resolve repo root");
  const parts = path.resolve(argv1).split(path.sep);
  const srcIndex = parts.lastIndexOf("src");
  if (srcIndex === -1) throw new Error("Dev mode requires running from repo (src/entry.ts)");
  return parts.slice(0, srcIndex).join(path.sep);
}
async function resolveNodePath() {
  return await resolveBinaryPath("node");
}
async function resolveBinaryPath(binary) {
  const cmd = process.platform === "win32" ? getWindowsSystem32ExePath("where.exe") : "which";
  try {
    const resolved = execFileSync(cmd, [binary], { encoding: "utf8" })
      .trim()
      .split(/\r?\n/)[0]
      ?.trim();
    if (!resolved) throw new Error("empty");
    await fs$1.access(resolved);
    return resolved;
  } catch {
    throw new Error(
      "Node not found in PATH. Install Node 24.15+ (recommended) or Node 22 LTS (22.22.3+).",
    );
  }
}
async function resolveOpenClawWrapperPath(inputPath) {
  const trimmed = inputPath?.trim();
  if (!trimmed) return;
  const resolved = path.resolve(trimmed);
  try {
    if (!(await fs$1.stat(resolved)).isFile()) throw new Error("not a regular file");
    await fs$1.access(resolved, constants.X_OK);
  } catch (error) {
    const detail = error instanceof Error ? ` (${error.message})` : "";
    throw new Error(
      `${OPENCLAW_WRAPPER_ENV_KEY} must point to an executable file: ${resolved}${detail}`,
      { cause: error },
    );
  }
  return resolved;
}
async function resolveCliProgramArguments(params) {
  const wrapperPath = await resolveOpenClawWrapperPath(params.wrapperPath);
  if (wrapperPath) return { programArguments: [wrapperPath, ...params.args] };
  const execPath = process.execPath;
  const nodePath =
    params.nodePath ?? (isNodeRuntime(execPath) ? execPath : await resolveNodePath());
  if (params.dev) {
    const repoRoot = resolveRepoRootForDev();
    const devCliPath = path.join(repoRoot, "src", "entry.ts");
    await fs$1.access(devCliPath);
    return {
      programArguments: [nodePath, "--import", "tsx", devCliPath, ...params.args],
      workingDirectory: repoRoot,
    };
  }
  return {
    programArguments: [nodePath, await resolveCliEntrypointPathForService(), ...params.args],
  };
}
async function resolveGatewayProgramArguments(params) {
  return resolveCliProgramArguments({
    args: ["gateway", "--port", String(params.port)],
    dev: params.dev,
    runtime: params.runtime,
    nodePath: params.nodePath,
    wrapperPath: params.wrapperPath,
  });
}
async function resolveNodeProgramArguments(params) {
  const args = ["node", "run", "--host", params.host, "--port", String(params.port)];
  if (params.tls === false && !params.tlsFingerprint) args.push("--no-tls");
  else if (params.tls || params.tlsFingerprint) args.push("--tls");
  if (params.tlsFingerprint) args.push("--tls-fingerprint", params.tlsFingerprint);
  if (params.contextPath) args.push("--context-path", params.contextPath);
  if (params.nodeId) args.push("--node-id", params.nodeId);
  if (params.displayName) args.push("--display-name", params.displayName);
  return resolveCliProgramArguments({
    args,
    dev: params.dev,
    runtime: params.runtime,
    nodePath: params.nodePath,
  });
}
//#endregion
export {
  resolveOpenClawWrapperPath as i,
  resolveGatewayProgramArguments as n,
  resolveNodeProgramArguments as r,
  OPENCLAW_WRAPPER_ENV_KEY as t,
};
