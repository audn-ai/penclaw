import { createHash } from "node:crypto";
import { constants } from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { n as resolveCodexAppServerSpawnEnv } from "./transport-stdio-IG5YT2Gz.js";
import {
  a as resolveWindowsSpawnProgram,
  i as resolveWindowsExecutablePath,
} from "./windows-spawn-C5RDaB22.js";
//#region extensions/codex/src/app-server/runtime-artifact.ts
/** Exact local runtime artifact identity for verified Codex setup turns. */
const ARTIFACT_ID_PREFIX = "codex-app-server:v1:";
const ARTIFACT_HASH_DOMAIN = "openclaw-codex-app-server-runtime-artifact-v1\0";
const MAX_ARTIFACT_ID_BYTES = 32 * 1024;
const MAX_ARTIFACT_PATH_BYTES = 4096;
const MAX_ARTIFACT_INVOCATION_PATHS = 8;
const MAX_ARTIFACT_DEPTH = 64;
const MAX_ARTIFACT_ENTRIES = 32768;
const MAX_ARTIFACT_FILES = 8192;
const MAX_ARTIFACT_TOTAL_BYTES = 1024n * 1024n * 1024n;
const READ_CHUNK_BYTES = 64 * 1024;
const CODE_MODE_HOST_PATH_ENV = "CODEX_CODE_MODE_HOST_PATH";
const RUNTIME_INJECTION_ENV_KEYS = /* @__PURE__ */ new Set([
  "NODE_PATH",
  "LD_AUDIT",
  "LD_LIBRARY_PATH",
  "LD_PRELOAD",
  "DYLD_FALLBACK_FRAMEWORK_PATH",
  "DYLD_FALLBACK_LIBRARY_PATH",
  "DYLD_FRAMEWORK_PATH",
  "DYLD_INSERT_LIBRARIES",
  "DYLD_LIBRARY_PATH",
]);
const ARTIFACT_BINDINGS_SYMBOL = Symbol.for("openclaw.codexAppServerRuntimeArtifactBindings");
function getRuntimeArtifactBindings() {
  const globalState = globalThis;
  globalState[ARTIFACT_BINDINGS_SYMBOL] ??= /* @__PURE__ */ new WeakMap();
  return globalState[ARTIFACT_BINDINGS_SYMBOL];
}
function throwIfAborted(signal) {
  if (!signal?.aborted) return;
  throw signal.reason instanceof Error
    ? signal.reason
    : /* @__PURE__ */ new Error("Codex runtime artifact capture aborted");
}
function compareArtifactNames(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
function normalizeRelativePath(filePath) {
  return filePath.split(path.sep).join("/");
}
function sameOpenedFile(left, right) {
  return (
    left.dev === right.dev &&
    left.ino === right.ino &&
    left.mode === right.mode &&
    left.size === right.size &&
    left.mtimeNs === right.mtimeNs &&
    left.ctimeNs === right.ctimeNs
  );
}
async function readRegularFileFingerprint(params) {
  throwIfAborted(params.signal);
  if (!(await fs$1.lstat(params.filePath, { bigint: true })).isFile())
    throw new Error(`Codex runtime artifact contains a non-regular file: ${params.filePath}`);
  const flags = constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0);
  const handle = await fs$1.open(params.filePath, flags);
  try {
    const before = await handle.stat({ bigint: true });
    if (!before.isFile())
      throw new Error(`Codex runtime artifact contains a non-regular file: ${params.filePath}`);
    if (params.budget.fileCount + 1 > MAX_ARTIFACT_FILES)
      throw new Error("Codex runtime artifact exceeds the bounded file count");
    if (params.budget.totalBytes + before.size > MAX_ARTIFACT_TOTAL_BYTES)
      throw new Error("Codex runtime artifact exceeds the bounded content size");
    const hash = createHash("sha256");
    const buffer = Buffer.allocUnsafe(READ_CHUNK_BYTES);
    let offset = 0n;
    while (offset < before.size) {
      throwIfAborted(params.signal);
      const length = Number(
        before.size - offset < BigInt(buffer.length) ? before.size - offset : BigInt(buffer.length),
      );
      const { bytesRead } = await handle.read(buffer, 0, length, Number(offset));
      if (bytesRead === 0)
        throw new Error(`Codex runtime artifact changed while reading: ${params.filePath}`);
      hash.update(buffer.subarray(0, bytesRead));
      offset += BigInt(bytesRead);
    }
    const after = await handle.stat({ bigint: true });
    const current = await fs$1.stat(params.filePath, { bigint: true });
    if (!sameOpenedFile(before, after) || !sameOpenedFile(after, current))
      throw new Error(`Codex runtime artifact changed while reading: ${params.filePath}`);
    params.budget.fileCount += 1;
    params.budget.totalBytes += after.size;
    return {
      contentHash: hash.digest("hex"),
      mode: String(after.mode),
      size: String(after.size),
    };
  } finally {
    await handle.close();
  }
}
async function listPackageFiles(params) {
  const files = [];
  let entryCount = 0;
  const visit = async (directory, depth) => {
    throwIfAborted(params.signal);
    if (depth > MAX_ARTIFACT_DEPTH)
      throw new Error("Codex runtime artifact exceeds the bounded directory depth");
    const entries = await fs$1.readdir(directory, {
      withFileTypes: true,
      encoding: "utf8",
    });
    for (const entry of entries.toSorted((left, right) =>
      compareArtifactNames(left.name, right.name),
    )) {
      throwIfAborted(params.signal);
      entryCount += 1;
      if (entryCount > MAX_ARTIFACT_ENTRIES)
        throw new Error("Codex runtime artifact exceeds the bounded entry count");
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath, depth + 1);
        continue;
      }
      if (!entry.isFile())
        throw new Error(`Codex runtime artifact contains an unsupported entry: ${entryPath}`);
      files.push(normalizeRelativePath(path.relative(params.rootPath, entryPath)));
    }
  };
  await visit(params.rootPath, 0);
  return files;
}
function pathIsWithin(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return (
    relative === "" ||
    (!path.isAbsolute(relative) && !relative.startsWith(`..${path.sep}`) && relative !== "..")
  );
}
function assertNoRuntimeInjectionEnvironment(env) {
  for (const [rawKey, value] of Object.entries(env)) {
    const key = rawKey.toUpperCase();
    if (!value?.trim()) continue;
    if (key === "NODE_OPTIONS" && isSafeNodeOptions(value)) continue;
    if (key === "NODE_OPTIONS")
      throw new Error(`Codex runtime artifact cannot attest injected runtime environment: ${key}`);
    if (RUNTIME_INJECTION_ENV_KEYS.has(key) || key.startsWith("DYLD_"))
      throw new Error(`Codex runtime artifact cannot attest injected runtime environment: ${key}`);
  }
}
function isSafeNodeOptions(value) {
  const tokens = value.trim().split(/\s+/u);
  const valueFlags = /* @__PURE__ */ new Set([
    "--max-old-space-size",
    "--max_old_space_size",
    "--max-semi-space-size",
    "--max_semi_space_size",
    "--stack-trace-limit",
  ]);
  const booleanFlags = /* @__PURE__ */ new Set([
    "--no-deprecation",
    "--no-warnings",
    "--pending-deprecation",
    "--throw-deprecation",
    "--trace-deprecation",
    "--trace-warnings",
  ]);
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (booleanFlags.has(token)) continue;
    const equalsIndex = token.indexOf("=");
    const flag = equalsIndex === -1 ? token : token.slice(0, equalsIndex);
    const inlineValue = equalsIndex === -1 ? void 0 : token.slice(equalsIndex + 1);
    if (
      flag === "--disable-warning" &&
      inlineValue &&
      /^[A-Za-z][A-Za-z0-9_.:-]{0,63}$/u.test(inlineValue)
    )
      continue;
    if (!valueFlags.has(flag)) return false;
    const numericValue = inlineValue ?? tokens[++index];
    if (!numericValue || !/^\d+$/u.test(numericValue)) return false;
  }
  return tokens.length > 0;
}
async function hashSelectedArtifactFiles(descriptor, signal) {
  throwIfAborted(signal);
  if ((await fs$1.realpath(descriptor.commandPath)) !== descriptor.commandRealPath)
    throw new Error("Codex runtime launcher selection changed");
  const packageRoot = descriptor.packageRoot;
  if ((await resolvePackageRoot(descriptor.nativePath)) !== packageRoot)
    throw new Error("Codex runtime package selection changed");
  if (packageRoot && (await fs$1.realpath(packageRoot)) !== packageRoot)
    throw new Error("Codex runtime package root changed");
  const allFiles = [
    descriptor.commandRealPath,
    ...descriptor.invocationPaths,
    descriptor.nativePath,
    ...(descriptor.codeModeHostPath ? [descriptor.codeModeHostPath] : []),
  ];
  for (const filePath of allFiles)
    if ((await fs$1.realpath(filePath)) !== filePath)
      throw new Error(`Codex runtime artifact file selection changed: ${filePath}`);
  if (descriptor.codeModeHostPath) {
    if ((await fs$1.realpath(descriptor.codeModeHostCandidatePath)) !== descriptor.codeModeHostPath)
      throw new Error("Codex code-mode host selection changed");
  } else
    try {
      await fs$1.lstat(descriptor.codeModeHostCandidatePath);
      throw new Error("Codex code-mode host selection changed");
    } catch (error) {
      if (!isMissingPathError(error)) throw error;
    }
  const externalFiles = [...new Set(allFiles)]
    .filter((filePath) => !packageRoot || !pathIsWithin(packageRoot, filePath))
    .toSorted(compareArtifactNames);
  const budget = {
    fileCount: 0,
    totalBytes: 0n,
  };
  const hash = createHash("sha256");
  hash.update("codex-runtime-files-v1\0");
  for (const filePath of externalFiles) {
    const file = await readRegularFileFingerprint({
      filePath,
      budget,
      signal,
    });
    hash.update(JSON.stringify(["file", filePath, file.mode, file.size, file.contentHash]));
    hash.update("\n");
  }
  if (packageRoot) {
    const beforeFiles = await listPackageFiles({
      rootPath: packageRoot,
      signal,
    });
    for (const relativePath of beforeFiles) {
      const file = await readRegularFileFingerprint({
        filePath: path.join(packageRoot, ...relativePath.split("/")),
        budget,
        signal,
      });
      hash.update(
        JSON.stringify(["package", relativePath, file.mode, file.size, file.contentHash]),
      );
      hash.update("\n");
    }
    const afterFiles = await listPackageFiles({
      rootPath: packageRoot,
      signal,
    });
    if (
      beforeFiles.length !== afterFiles.length ||
      beforeFiles.some((filePath, index) => filePath !== afterFiles[index])
    )
      throw new Error("Codex runtime package changed while reading");
  }
  if (budget.fileCount === 0) throw new Error("Codex runtime artifact contains no regular files");
  return hash.digest("hex");
}
async function resolveCommandPath(command, env, cwd) {
  let candidate;
  if (process.platform === "win32") candidate = resolveWindowsExecutablePath(command, env);
  else if (path.isAbsolute(command) || command.includes("/") || command.includes("\\"))
    candidate = path.resolve(cwd, command);
  else {
    const pathValue = env.PATH;
    if (pathValue === void 0)
      throw new Error("Codex runtime PATH is unavailable for a bare launcher");
    for (const entry of pathValue.split(path.delimiter)) {
      const entryPath =
        entry === "" ? cwd : path.isAbsolute(entry) ? entry : path.resolve(cwd, entry);
      const possible = path.join(entryPath, command);
      try {
        await fs$1.access(possible, constants.X_OK);
        candidate = possible;
        break;
      } catch {}
    }
  }
  if (!candidate) throw new Error(`Codex runtime launcher is unavailable: ${command}`);
  const absolute = path.resolve(candidate);
  if (!(await fs$1.stat(absolute)).isFile())
    throw new Error(`Codex runtime launcher is not a regular file: ${absolute}`);
  return absolute;
}
async function readShebang(filePath) {
  const handle = await fs$1.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(4096);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const firstLine = buffer.subarray(0, bytesRead).toString("utf8").split(/\r?\n/u, 1)[0] ?? "";
    if (!firstLine.startsWith("#!")) return;
    const tokens = firstLine.slice(2).trim().split(/\s+/u).filter(Boolean);
    if (tokens.length === 0) throw new Error("Codex runtime launcher has an invalid shebang");
    return tokens;
  } finally {
    await handle.close();
  }
}
async function resolvePosixInvocationPaths(params) {
  const paths = [params.commandRealPath];
  const shebang = await readShebang(params.commandRealPath);
  if (!shebang) return paths;
  if (!params.nativeCommand)
    throw new Error(
      "Codex runtime cannot attest a custom script launcher without its native target",
    );
  const interpreter = await resolveCommandPath(shebang[0], params.env, params.cwd);
  paths.push(await fs$1.realpath(interpreter));
  if (path.basename(interpreter) !== "env") {
    if (shebang.length !== 1)
      throw new Error("Codex runtime launcher uses unsupported interpreter arguments");
    return paths;
  }
  const envArgs = shebang.slice(1);
  const commandIndex = envArgs[0] === "-S" ? 1 : 0;
  const target = envArgs[commandIndex];
  if (!target || target.startsWith("-") || envArgs.length !== commandIndex + 1)
    throw new Error("Codex runtime launcher uses unsupported env arguments");
  const targetPath = await resolveCommandPath(target, params.env, params.cwd);
  paths.push(await fs$1.realpath(targetPath));
  return paths;
}
async function resolvePackageRoot(nativePath) {
  const binDir = path.dirname(nativePath);
  if (path.basename(binDir) !== "bin") return;
  const candidate = path.dirname(binDir);
  const metadataPath = path.join(candidate, "codex-package.json");
  try {
    if (!(await fs$1.lstat(metadataPath)).isFile()) return;
    const root = await fs$1.realpath(candidate);
    return pathIsWithin(root, nativePath) ? root : void 0;
  } catch {
    return;
  }
}
async function resolveOptionalRegularFile(filePath) {
  try {
    const canonical = await fs$1.realpath(filePath);
    return (await fs$1.stat(canonical)).isFile() ? canonical : void 0;
  } catch {
    return;
  }
}
function isMissingPathError(error) {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
function readEffectiveSpawnEnvironmentValue(env, name) {
  if (process.platform !== "win32") return env[name];
  const effectiveKey = Object.keys(env)
    .toSorted(compareArtifactNames)
    .find((key) => key.toUpperCase() === name.toUpperCase());
  return effectiveKey ? env[effectiveKey] : void 0;
}
async function captureFilesystemDescriptor(params) {
  throwIfAborted(params.signal);
  if (params.startOptions.transport !== "stdio")
    throw new Error(
      "Verified Codex inference requires a local stdio runtime artifact; WebSocket attestation is unsupported",
    );
  const env = resolveCodexAppServerSpawnEnv(params.startOptions);
  assertNoRuntimeInjectionEnvironment(env);
  const spawnCwd = path.resolve(params.startOptions.cwd ?? process.cwd());
  const commandPath = await resolveCommandPath(params.startOptions.command, env, spawnCwd);
  const commandRealPath = await fs$1.realpath(commandPath);
  let invocationPaths;
  if (process.platform === "win32") {
    const program = resolveWindowsSpawnProgram({
      command: params.startOptions.command,
      platform: process.platform,
      env,
      execPath: process.execPath,
      packageName: "@openai/codex",
    });
    if (program.resolution === "node-entrypoint" && !params.spawnIdentity.nativeCommand)
      throw new Error(
        "Codex runtime cannot attest a custom Node launcher without its native target",
      );
    const invocationCandidates = [commandRealPath, program.command, ...program.leadingArgv];
    invocationPaths = [];
    for (const candidate of invocationCandidates) {
      const resolved = await resolveCommandPath(candidate, env, spawnCwd);
      invocationPaths.push(await fs$1.realpath(resolved));
    }
  } else
    invocationPaths = await resolvePosixInvocationPaths({
      commandRealPath,
      env,
      cwd: spawnCwd,
      nativeCommand: params.spawnIdentity.nativeCommand,
    });
  invocationPaths = [...new Set(invocationPaths)].toSorted(compareArtifactNames);
  if (invocationPaths.length > MAX_ARTIFACT_INVOCATION_PATHS)
    throw new Error("Codex runtime launcher exceeds the bounded invocation file count");
  const nativeCandidate = params.spawnIdentity.nativeCommand ?? invocationPaths[0];
  if (!nativeCandidate) throw new Error("Codex runtime did not resolve a native executable");
  const nativePath = await fs$1.realpath(await resolveCommandPath(nativeCandidate, env, spawnCwd));
  const packageRoot = await resolvePackageRoot(nativePath);
  const configuredCodeModeHost = readEffectiveSpawnEnvironmentValue(
    env,
    CODE_MODE_HOST_PATH_ENV,
  )?.trim();
  const adjacentCodeModeHost = path.join(
    path.dirname(nativePath),
    process.platform === "win32" ? "codex-code-mode-host.exe" : "codex-code-mode-host",
  );
  const codeModeHostCandidatePath = configuredCodeModeHost
    ? path.isAbsolute(configuredCodeModeHost)
      ? configuredCodeModeHost
      : path.resolve(spawnCwd, configuredCodeModeHost)
    : adjacentCodeModeHost;
  const codeModeHostPath = await resolveOptionalRegularFile(codeModeHostCandidatePath);
  if (configuredCodeModeHost && !codeModeHostPath)
    throw new Error("Configured Codex code-mode host runtime artifact is unavailable");
  const descriptor = {
    version: 1,
    commandPath,
    commandRealPath,
    invocationPaths,
    nativePath,
    argsFingerprint: params.spawnIdentity.argsFingerprint,
    ...(packageRoot ? { packageRoot } : {}),
    codeModeHostCandidatePath,
    ...(codeModeHostPath ? { codeModeHostPath } : {}),
    ...(params.spawnIdentity.commandSource
      ? { commandSource: params.spawnIdentity.commandSource }
      : {}),
    ...(params.spawnIdentity.managedCommandOrder
      ? { managedCommandOrder: params.spawnIdentity.managedCommandOrder }
      : {}),
  };
  validateFilesystemDescriptorShape(descriptor);
  return descriptor;
}
function isBoundedPath(value) {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    Buffer.byteLength(value, "utf8") <= MAX_ARTIFACT_PATH_BYTES &&
    path.isAbsolute(value)
  );
}
function validateFilesystemDescriptorShape(descriptor) {
  if (
    descriptor.version !== 1 ||
    !isBoundedPath(descriptor.commandPath) ||
    !isBoundedPath(descriptor.commandRealPath) ||
    !isBoundedPath(descriptor.nativePath) ||
    !isBoundedPath(descriptor.codeModeHostCandidatePath) ||
    !Array.isArray(descriptor.invocationPaths) ||
    descriptor.invocationPaths.length === 0 ||
    descriptor.invocationPaths.length > MAX_ARTIFACT_INVOCATION_PATHS ||
    descriptor.invocationPaths.some((entry) => !isBoundedPath(entry)) ||
    !descriptor.invocationPaths.includes(descriptor.commandRealPath) ||
    !/^[a-f0-9]{64}$/u.test(descriptor.argsFingerprint)
  )
    throw new Error("Invalid Codex runtime artifact descriptor");
  if (descriptor.packageRoot) {
    if (
      !isBoundedPath(descriptor.packageRoot) ||
      path.dirname(path.dirname(descriptor.nativePath)) !== descriptor.packageRoot ||
      path.basename(path.dirname(descriptor.nativePath)) !== "bin"
    )
      throw new Error("Invalid Codex runtime package descriptor");
  }
  if (descriptor.codeModeHostPath && !isBoundedPath(descriptor.codeModeHostPath))
    throw new Error("Invalid Codex code-mode host artifact descriptor");
  if (
    descriptor.commandSource !== void 0 &&
    !["managed", "resolved-managed", "config", "env"].includes(descriptor.commandSource)
  )
    throw new Error("Invalid Codex runtime command source");
  if (
    descriptor.managedCommandOrder !== void 0 &&
    descriptor.managedCommandOrder !== "package-first" &&
    descriptor.managedCommandOrder !== "desktop-first"
  )
    throw new Error("Invalid Codex managed command order");
  if (descriptor.managedCommandOrder !== void 0 && descriptor.commandSource !== "resolved-managed")
    throw new Error("Invalid Codex managed runtime descriptor");
  const canonicalInvocationPaths = [...new Set(descriptor.invocationPaths)].toSorted(
    compareArtifactNames,
  );
  if (
    canonicalInvocationPaths.length !== descriptor.invocationPaths.length ||
    canonicalInvocationPaths.some((entry, index) => entry !== descriptor.invocationPaths[index])
  )
    throw new Error("Invalid Codex runtime invocation descriptor");
}
function validateArtifactDescriptorShape(descriptor) {
  validateFilesystemDescriptorShape(descriptor);
  if (
    typeof descriptor.serverVersion !== "string" ||
    descriptor.serverVersion.length === 0 ||
    descriptor.serverVersion.length > 128 ||
    descriptor.serverVersion !== descriptor.serverVersion.trim()
  )
    throw new Error("Invalid Codex runtime server version");
  if (
    descriptor.userAgentFingerprint !== void 0 &&
    !/^[a-f0-9]{64}$/u.test(descriptor.userAgentFingerprint)
  )
    throw new Error("Invalid Codex runtime user-agent fingerprint");
}
function encodeArtifactId(descriptor) {
  return `${ARTIFACT_ID_PREFIX}${Buffer.from(JSON.stringify(descriptor), "utf8").toString("base64url")}`;
}
function decodeArtifactId(id) {
  if (!id.startsWith(ARTIFACT_ID_PREFIX) || Buffer.byteLength(id, "utf8") > MAX_ARTIFACT_ID_BYTES)
    throw new Error("Invalid Codex runtime artifact id");
  const encoded = id.slice(20);
  if (!/^[A-Za-z0-9_-]+$/u.test(encoded))
    throw new Error("Invalid Codex runtime artifact encoding");
  const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
    throw new Error("Invalid Codex runtime artifact descriptor");
  const descriptor = parsed;
  const allowedKeys = /* @__PURE__ */ new Set([
    "version",
    "commandPath",
    "commandRealPath",
    "invocationPaths",
    "nativePath",
    "packageRoot",
    "codeModeHostCandidatePath",
    "codeModeHostPath",
    "argsFingerprint",
    "commandSource",
    "managedCommandOrder",
    "serverVersion",
    "userAgentFingerprint",
  ]);
  if (Object.keys(descriptor).some((key) => !allowedKeys.has(key)))
    throw new Error("Invalid Codex runtime artifact descriptor fields");
  validateArtifactDescriptorShape(descriptor);
  if (encodeArtifactId(descriptor) !== id)
    throw new Error("Invalid noncanonical Codex runtime artifact id");
  return descriptor;
}
function fingerprintBinding(descriptor, contentFingerprint) {
  return createHash("sha256")
    .update(ARTIFACT_HASH_DOMAIN)
    .update(JSON.stringify(descriptor))
    .update("\0")
    .update(contentFingerprint)
    .digest("hex");
}
/** Captures exact candidate bytes immediately before app-server startup. */
async function captureCodexAppServerRuntimeArtifactBeforeStart(params) {
  const descriptor = await captureFilesystemDescriptor(params);
  return {
    descriptor,
    contentFingerprint: await hashSelectedArtifactFiles(descriptor, params.signal),
  };
}
/** Rechecks startup bytes and adds initialized handshake identity. */
async function finalizeCodexAppServerRuntimeArtifact(params) {
  const afterDescriptor = await captureFilesystemDescriptor(params);
  const afterContentFingerprint = await hashSelectedArtifactFiles(afterDescriptor, params.signal);
  if (
    JSON.stringify(afterDescriptor) !== JSON.stringify(params.before.descriptor) ||
    afterContentFingerprint !== params.before.contentFingerprint
  )
    throw new Error("Codex app-server runtime artifact changed during startup");
  const serverVersion = params.runtimeIdentity?.serverVersion?.trim();
  if (!serverVersion)
    throw new Error("Codex app-server did not report an initialized runtime identity");
  const userAgent = params.runtimeIdentity?.userAgent;
  const descriptor = {
    ...afterDescriptor,
    serverVersion,
    ...(userAgent
      ? { userAgentFingerprint: createHash("sha256").update(userAgent).digest("hex") }
      : {}),
  };
  validateArtifactDescriptorShape(descriptor);
  return Object.freeze({
    id: encodeArtifactId(descriptor),
    fingerprint: fingerprintBinding(descriptor, afterContentFingerprint),
  });
}
/** Checks current pre-spawn bytes and selection against a previously minted binding. */
function validateCodexAppServerRuntimeArtifactCapture(binding, capture) {
  try {
    const expectedDescriptor = decodeArtifactId(binding.id);
    const {
      serverVersion: _serverVersion,
      userAgentFingerprint: _userAgentFingerprint,
      ...expectedFilesystemDescriptor
    } = expectedDescriptor;
    return (
      JSON.stringify(expectedFilesystemDescriptor) === JSON.stringify(capture.descriptor) &&
      binding.fingerprint === fingerprintBinding(expectedDescriptor, capture.contentFingerprint)
    );
  } catch {
    return false;
  }
}
/** Commits a verified binding only after the client has completed auth setup. */
function bindCodexAppServerRuntimeArtifact(client, binding) {
  const bindings = getRuntimeArtifactBindings();
  const existing = bindings.get(client);
  if (existing && (existing.id !== binding.id || existing.fingerprint !== binding.fingerprint))
    throw new Error("Codex app-server client already has a different runtime artifact");
  bindings.set(client, Object.freeze({ ...binding }));
}
/** Reads the immutable artifact attached to one successfully initialized client. */
function readCodexAppServerClientRuntimeArtifact(client) {
  return getRuntimeArtifactBindings().get(client);
}
/** Re-hashes only the exact Codex files named by a server-minted artifact binding. */
async function validateCodexAppServerRuntimeArtifact(binding, signal) {
  try {
    const descriptor = decodeArtifactId(binding.id);
    const contentFingerprint = await hashSelectedArtifactFiles(descriptor, signal);
    return binding.fingerprint === fingerprintBinding(descriptor, contentFingerprint);
  } catch {
    return false;
  }
}
//#endregion
export {
  bindCodexAppServerRuntimeArtifact,
  captureCodexAppServerRuntimeArtifactBeforeStart,
  finalizeCodexAppServerRuntimeArtifact,
  readCodexAppServerClientRuntimeArtifact,
  validateCodexAppServerRuntimeArtifact,
  validateCodexAppServerRuntimeArtifactCapture,
};
