import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import fs$1 from "node:fs/promises";
import os from "node:os";
import "./backoff-Z63_cX9p.js";
import path from "node:path";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as killProcessTree } from "./kill-tree-Cr15jS_s.js";
import { c as redactSensitiveText } from "./redact-CUe6Oey5.js";
import { s as sleepWithAbort, t as RetrySupervisor } from "./src-Dqmh2693.js";
import {
  i as workerSshRemoteCommand,
  n as workerSshCommandOptions,
  r as workerSshOptions,
  t as prepareWorkerSsh,
} from "./ssh-YqrgGeNl.js";
import { n as sliceUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/gateway/worker-environments/tunnel-ssh-runner.ts
const WORKER_TUNNEL_READY_MARKER = "OPENCLAW_WORKER_TUNNEL_READY";
const STOP_GRACE_MS = 1500;
function workerSshProcessError(stderr) {
  const detail = redactSensitiveText(stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim();
  return /* @__PURE__ */ new Error(
    detail ? `Worker SSH tunnel failed: ${detail}` : "Worker SSH tunnel failed",
  );
}
/** Production runner that treats the remote post-forward marker as connection readiness. */
function createWorkerSshRunner() {
  return {
    run: runCommandWithTimeout,
    start(argv, options) {
      const [command, ...args] = argv;
      if (!command) throw new Error("Worker SSH runner requires a command");
      const child = spawn(command, args, {
        env: options.baseEnv,
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
      });
      let closed = false;
      let readySettled = false;
      let resolveReady;
      let rejectReady;
      let resolveExited;
      const ready = new Promise((resolve, reject) => {
        resolveReady = resolve;
        rejectReady = reject;
      });
      const exited = new Promise((resolve) => {
        resolveExited = resolve;
      });
      let stdout = "";
      let stderr = "";
      const settleReadyError = () => {
        if (readySettled) return;
        readySettled = true;
        rejectReady(workerSshProcessError(stderr));
      };
      child.stdout.setEncoding("utf8");
      child.stdout.on("error", () => {});
      child.stdout.on("data", (chunk) => {
        if (readySettled) return;
        stdout = sliceUtf16Safe(`${stdout}${chunk}`, -4096);
        if (stdout.split(/\r?\n/u).includes("OPENCLAW_WORKER_TUNNEL_READY")) {
          readySettled = true;
          resolveReady();
        }
      });
      child.stderr.setEncoding("utf8");
      child.stderr.on("error", () => {});
      child.stderr.on("data", (chunk) => {
        stderr = sliceUtf16Safe(`${stderr}${chunk}`, -4096);
      });
      child.once("error", settleReadyError);
      child.once("close", (code, signal) => {
        closed = true;
        settleReadyError();
        resolveExited({
          code,
          signal,
        });
      });
      child.stdin.on("error", () => {});
      if (options.input !== void 0) child.stdin.end(options.input);
      else child.stdin.end();
      let stopPromise;
      return {
        ready,
        exited,
        stop() {
          return (stopPromise ??= (async () => {
            if (closed) return;
            child.kill("SIGTERM");
            let timer;
            await Promise.race([
              exited,
              new Promise((resolve) => {
                timer = setTimeout(resolve, STOP_GRACE_MS);
                timer.unref?.();
              }),
            ]);
            clearTimeout(timer);
            if (!closed) {
              child.kill("SIGKILL");
              await exited;
            }
          })());
        },
      };
    },
  };
}
//#endregion
//#region src/gateway/worker-environments/workspace-sync-local.ts
const COMMAND_KILL_GRACE_MS = 300;
function validateGitRelativePath(file) {
  if (
    !file ||
    path.posix.isAbsolute(file) ||
    path.posix.normalize(file) !== file ||
    file === ".." ||
    file.startsWith("../")
  )
    throw new Error("Worker workspace git file list contains an unsafe path");
  return file;
}
async function* readNulFile(filePath) {
  let pending = Buffer.alloc(0);
  for await (const value of createReadStream(filePath)) {
    const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
    const buffer = pending.length === 0 ? chunk : Buffer.concat([pending, chunk]);
    let offset = 0;
    for (;;) {
      const separator = buffer.indexOf(0, offset);
      if (separator < 0) break;
      yield validateGitRelativePath(buffer.subarray(offset, separator).toString("utf8"));
      offset = separator + 1;
    }
    pending = Buffer.from(buffer.subarray(offset));
  }
  if (pending.length > 0) throw new Error("Worker workspace git file list is not NUL terminated");
}
async function runLocalCommandToFile(params) {
  const [command, ...args] = params.argv;
  if (!command) throw new Error("Worker workspace command requires an executable");
  const output = await fs$1.open(params.outputPath, "wx", 384);
  const input = params.inputPath ? await fs$1.open(params.inputPath, "r") : void 0;
  let stderr = "";
  let timer;
  let terminationTimer;
  let abort;
  try {
    if (params.signal.aborted) throw new Error("Worker workspace file enumeration was aborted");
    const child = spawn(command, args, {
      env: workerSshCommandOptions({ timeoutMs: params.timeoutMs }).baseEnv,
      stdio: [input?.fd ?? "ignore", output.fd, "pipe"],
      ...(process.platform !== "win32" ? { detached: true } : {}),
      windowsHide: true,
    });
    const childStderr = child.stderr;
    if (!childStderr) throw new Error("Worker workspace command has no stderr pipe");
    childStderr.setEncoding("utf8");
    childStderr.on("data", (chunk) => {
      stderr = sliceUtf16Safe(`${stderr}${chunk}`, -4096);
    });
    const result = await new Promise((resolve) => {
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };
      let terminationStarted = false;
      const terminate = () => {
        if (settled || terminationStarted) return;
        terminationStarted = true;
        const pid = child.pid;
        if (typeof pid === "number" && pid > 0)
          killProcessTree(pid, { graceMs: COMMAND_KILL_GRACE_MS });
        else child.kill("SIGTERM");
        terminationTimer = setTimeout(() => {
          if (typeof pid === "number" && pid > 0) killProcessTree(pid, { force: true });
          else child.kill("SIGKILL");
          childStderr.destroy();
          finish({ code: null });
        }, 1300);
        terminationTimer.unref?.();
      };
      child.once("error", (error) =>
        finish({
          code: null,
          error,
        }),
      );
      child.once("close", (code) => finish({ code }));
      abort = terminate;
      params.signal.addEventListener("abort", abort, { once: true });
      timer = setTimeout(terminate, params.timeoutMs);
      timer.unref?.();
      if (params.signal.aborted) terminate();
    });
    if (result.error) throw result.error;
    if (params.signal.aborted) throw new Error("Worker workspace file enumeration was aborted");
    if (result.code !== 0)
      throw new Error(
        stderr.trim()
          ? `Worker workspace file enumeration failed: ${stderr.trim()}`
          : "Worker workspace file enumeration failed",
      );
  } finally {
    clearTimeout(timer);
    clearTimeout(terminationTimer);
    if (abort) params.signal.removeEventListener("abort", abort);
    await output.close();
    await input?.close();
  }
}
function hasErrorCode(error, code) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    error.code === code
  );
}
async function writeEligibleGitFiles(params) {
  const output = await fs$1.open(params.outputPath, "wx", 384);
  const canonicalRoot = await fs$1.realpath(params.gitRoot);
  let buffered = [];
  let bufferedBytes = 0;
  const flush = async () => {
    if (buffered.length === 0) return;
    await output.write(buffered.join(""));
    buffered = [];
    bufferedBytes = 0;
  };
  const appendIfTransferable = async (file) => {
    const absolute = path.join(canonicalRoot, file);
    const stats = await fs$1.lstat(absolute).catch((error) => {
      if (hasErrorCode(error, "ENOENT")) return;
      throw error;
    });
    if (!stats || (!stats.isFile() && !stats.isSymbolicLink())) return;
    if (stats.isSymbolicLink()) {
      const target = await fs$1.readlink(absolute);
      const resolvedTarget = path.resolve(path.dirname(absolute), target);
      if (resolvedTarget !== canonicalRoot && !resolvedTarget.startsWith(canonicalRoot + path.sep))
        throw new Error(`worker workspace symlink escapes the sync root: ${file}`);
    }
    const record = `${file}\0`;
    buffered.push(record);
    bufferedBytes += Buffer.byteLength(record);
    if (bufferedBytes >= 64 * 1024) await flush();
  };
  try {
    for await (const file of readNulFile(params.eligiblePath)) await appendIfTransferable(file);
    const ignored = readNulFile(params.ignoredPath)[Symbol.asyncIterator]();
    const selected = readNulFile(params.selectedPath)[Symbol.asyncIterator]();
    let ignoredItem = await ignored.next();
    let selectedItem = await selected.next();
    while (!ignoredItem.done && !selectedItem.done) {
      const order = Buffer.compare(Buffer.from(ignoredItem.value), Buffer.from(selectedItem.value));
      if (order === 0) {
        await appendIfTransferable(ignoredItem.value);
        ignoredItem = await ignored.next();
        selectedItem = await selected.next();
      } else if (order < 0) ignoredItem = await ignored.next();
      else selectedItem = await selected.next();
    }
    await flush();
  } finally {
    await output.close();
  }
}
//#endregion
//#region src/gateway/worker-environments/workspace-sync-scripts.ts
const REMOTE_WORKSPACE_SETUP_SCRIPT = String.raw`set -eu
relative=$1
root=$HOME/.openclaw-worker

ensure_private_directory() {
  directory=$1
  if [ -e "$directory" ] || [ -L "$directory" ]; then
    if [ ! -d "$directory" ] || [ -L "$directory" ]; then
      printf '%s\n' 'unsafe worker workspace directory' >&2
      exit 2
    fi
  else
    mkdir "$directory"
  fi
  chmod 700 "$directory"
}

ensure_private_directory "$root"
current=$root
old_ifs=$IFS
IFS=/
set -- $relative
IFS=$old_ifs
for segment in "$@"; do
  current=$current/$segment
  ensure_private_directory "$current"
done
cd "$current"
find . -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
pwd -P
`;
const REMOTE_GIT_WORKSPACE_SETUP_SCRIPT = String.raw`set -eu
workspace=$1
pack=$2
base=$3
author_name=$4
author_email=$5
cd "$workspace"
if ! command -v git >/dev/null 2>&1; then
  printf '%s\n' 'git is required for a git worker workspace' >&2
  exit 2
fi
case ${"${"}#base} in
  40) git init -q . ;;
  64) git init -q --object-format=sha256 . ;;
  *) printf '%s\n' 'invalid worker git base object id' >&2; exit 2 ;;
esac
git index-pack --stdin < "$pack" >/dev/null
printf '%s\n' "$base" > .git/shallow
actual=$(git rev-parse --verify "$base^{commit}")
if [ "$actual" != "$base" ]; then
  printf '%s\n' 'worker git base does not match the synced pack' >&2
  exit 2
fi
git update-ref refs/heads/openclaw-worker "$base"
git symbolic-ref HEAD refs/heads/openclaw-worker
git read-tree "$base"
git ls-files --stage -z | node -e '
const childProcess = require("node:child_process");
const chunks = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const paths = Buffer.concat(chunks)
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .flatMap((record) => {
      const separator = record.indexOf("\t");
      return separator >= 0 && record.startsWith("160000 ") ? [record.slice(separator + 1)] : [];
    });
  if (paths.length > 0) {
    childProcess.execFileSync("git", ["update-index", "--skip-worktree", "--", ...paths]);
  }
});'
rm -f -- "$pack"
if [ -n "$author_name" ]; then git config user.name "$author_name"; fi
if [ -n "$author_email" ]; then git config user.email "$author_email"; fi
`;
const REMOTE_WORKSPACE_MANIFEST_JS = String.raw`const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const root = fs.realpathSync(process.argv[1]);
const baseCommit = process.argv[2] || null;
const entries = [];
function fail(message) {
  throw new Error(message);
}
function walk(relativeDirectory) {
  const absoluteDirectory = relativeDirectory ? path.join(root, relativeDirectory) : root;
  for (const name of fs.readdirSync(absoluteDirectory).sort()) {
    if (!relativeDirectory && name === ".git") {
      continue;
    }
    const relative = relativeDirectory ? relativeDirectory + "/" + name : name;
    const absolute = path.join(root, relative);
    const stats = fs.lstatSync(absolute);
    const mode = stats.mode & 0o777;
    if (stats.isDirectory()) {
      entries.push({ path: relative, type: "directory", mode });
      walk(relative);
    } else if (stats.isFile()) {
      entries.push({
        path: relative,
        type: "file",
        mode,
        size: stats.size,
        sha256: null,
      });
    } else if (stats.isSymbolicLink()) {
      const target = fs.readlinkSync(absolute);
      const resolvedTarget = path.resolve(path.dirname(absolute), target);
      if (resolvedTarget !== root && !resolvedTarget.startsWith(root + path.sep)) {
        fail("worker workspace symlink escapes the sync root: " + relative);
      }
      entries.push({ path: relative, type: "symlink", mode, target });
    } else {
      fail("unsupported worker workspace entry: " + relative);
    }
  }
}
async function hashFiles() {
  for (const entry of entries) {
    if (entry.type !== "file") {
      continue;
    }
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(path.join(root, entry.path));
    for await (const chunk of stream) {
      hash.update(chunk);
    }
    entry.sha256 = hash.digest("hex");
  }
}
function ensurePrivateDirectory(directory) {
  try {
    const stats = fs.lstatSync(directory);
    if (stats.isSymbolicLink() || !stats.isDirectory()) {
      fail("unsafe worker manifest directory");
    }
  } catch (error) {
    if (error && error.code === "ENOENT") {
      fs.mkdirSync(directory, { mode: 0o700 });
    } else {
      throw error;
    }
  }
  fs.chmodSync(directory, 0o700);
}
async function main() {
  walk("");
  await hashFiles();
  const manifest = JSON.stringify({ version: 1, baseCommit, entries });
  const digest = crypto.createHash("sha256").update(manifest).digest("hex");
  const workerRoot = path.join(process.env.HOME, ".openclaw-worker");
  const manifestRoot = path.join(workerRoot, "manifests");
  ensurePrivateDirectory(workerRoot);
  ensurePrivateDirectory(manifestRoot);
  const manifestPath = path.join(manifestRoot, digest + ".json");
  const temporaryPath = manifestPath + "." + process.pid + "." + crypto.randomBytes(4).toString("hex");
  fs.writeFileSync(temporaryPath, manifest, { encoding: "utf8", flag: "wx", mode: 0o600 });
  try {
    try {
      fs.linkSync(temporaryPath, manifestPath);
    } catch (error) {
      const existing = error && error.code === "EEXIST" ? fs.lstatSync(manifestPath) : null;
      if (
        !existing ||
        existing.isSymbolicLink() ||
        !existing.isFile() ||
        fs.readFileSync(manifestPath, "utf8") !== manifest
      ) {
        throw error;
      }
    }
  } finally {
    fs.rmSync(temporaryPath, { force: true });
  }
  process.stdout.write("sha256:" + digest + "\n");
}
main().catch((error) => {
  process.stderr.write(String(error && error.stack ? error.stack : error) + "\n");
  process.exitCode = 1;
});`;
//#endregion
//#region src/gateway/worker-environments/workspace-sync.ts
const REMOTE_SETUP_TIMEOUT_MS$1 = 2e4;
const WORKSPACE_TIMEOUT_MS = 10 * 6e4;
const REMOTE_WORKSPACE_ROOT = "workspaces";
const REMOTE_GIT_PACK_NAME = ".openclaw-base.pack";
const GIT_COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
const MANIFEST_REF_PATTERN = /^sha256:[a-f0-9]{64}$/u;
function success$1(result) {
  return result.termination === "exit" && result.code === 0;
}
function workspaceSyncError(result) {
  const detail = redactSensitiveText(result.stderr || result.stdout, { mode: "tools" })
    .replace(/\s+/gu, " ")
    .trim();
  return /* @__PURE__ */ new Error(
    detail ? `Worker workspace sync failed: ${detail}` : "Worker workspace sync failed",
  );
}
function stableWorkerPathComponent(value, length) {
  return createHash("sha256").update(value).digest("hex").slice(0, length);
}
function validateWorkspaceSyncRequest(request) {
  if (!request.sessionId.trim()) throw new Error("Worker workspace session id must be non-empty");
  if (!path.isAbsolute(request.localPath))
    throw new Error("Worker workspace local path must be absolute");
  if (!Number.isSafeInteger(request.generation) || request.generation < 0)
    throw new Error("Worker workspace generation must be a non-negative safe integer");
}
function parseRemoteWorkspaceDirectory(stdout) {
  const lines = stdout.split(/\r?\n/u).filter(Boolean);
  const directory = lines.length === 1 ? lines[0] : void 0;
  if (
    !directory ||
    !path.posix.isAbsolute(directory) ||
    path.posix.normalize(directory) !== directory ||
    directory === "/"
  )
    throw new Error("Worker workspace setup returned an invalid remote directory");
  return directory;
}
function parseManifestRef(stdout) {
  const lines = stdout.split(/\r?\n/u).filter(Boolean);
  const manifestRef = lines.length === 1 ? lines[0] : void 0;
  if (!manifestRef || !MANIFEST_REF_PATTERN.test(manifestRef))
    throw new Error("Worker workspace sync returned an invalid manifest reference");
  return manifestRef;
}
/** Binds workspace commands and synchronization to one connected tunnel owner. */
function createWorkerWorkspaceActions(options) {
  const track = (task) => {
    options.tasks.add(task);
    task.then(
      () => options.tasks.delete(task),
      () => options.tasks.delete(task),
    );
    return task;
  };
  const requirePrepared = () => {
    const prepared = options.getPrepared();
    if (!options.isConnected() || !prepared)
      throw new Error("Worker tunnel owner is no longer connected");
    return prepared;
  };
  const runTask = (argv, commandOptions) => track(options.runner.run(argv, commandOptions));
  const runWorkspaceCommand = async (command) => {
    const prepared = requirePrepared();
    return await runTask(
      [
        "ssh",
        ...workerSshOptions(prepared, { forwarding: "disabled" }),
        "-a",
        "-x",
        "-T",
        "-p",
        String(prepared.port),
        "--",
        prepared.sshTarget,
        workerSshRemoteCommand(command.argv),
      ],
      workerSshCommandOptions({
        input: command.input,
        timeoutMs: command.timeoutMs ?? WORKSPACE_TIMEOUT_MS,
        signal: command.signal
          ? AbortSignal.any([options.ownerSignal, command.signal])
          : options.ownerSignal,
      }),
    );
  };
  const syncWorkspaceImpl = async (request) => {
    validateWorkspaceSyncRequest(request);
    const prepared = requirePrepared();
    const environmentKey = stableWorkerPathComponent(options.environmentId, 16);
    const sessionKey = stableWorkerPathComponent(request.sessionId, 32);
    const remoteRelative = [
      REMOTE_WORKSPACE_ROOT,
      environmentKey,
      sessionKey,
      String(request.generation),
    ].join("/");
    const setup = await runWorkspaceCommand({
      argv: ["sh", "-s", "--", remoteRelative],
      input: REMOTE_WORKSPACE_SETUP_SCRIPT,
    });
    if (!success$1(setup)) throw workspaceSyncError(setup);
    const remoteWorkspaceDir = parseRemoteWorkspaceDirectory(setup.stdout.trim());
    const gitRootResult = await runTask(
      ["git", "-C", request.localPath, "rev-parse", "--show-toplevel"],
      workerSshCommandOptions({
        timeoutMs: REMOTE_SETUP_TIMEOUT_MS$1,
        signal: options.ownerSignal,
      }),
    );
    const mode = success$1(gitRootResult) ? "git" : "plain";
    let baseCommit = "";
    let gitRoot = request.localPath;
    const temporaryDirectory = await fs$1.mkdtemp(
      path.join(os.tmpdir(), "openclaw-worker-workspace-sync-"),
    );
    const rsyncSsh = workerSshRemoteCommand([
      "ssh",
      ...workerSshOptions(prepared, { forwarding: "disabled" }),
      "-a",
      "-x",
      "-T",
      "-p",
      String(prepared.port),
    ]);
    try {
      let fileListPath;
      if (mode === "git") {
        gitRoot = gitRootResult.stdout.trim();
        const [canonicalRequestPath, canonicalGitRoot] = await Promise.all([
          fs$1.realpath(request.localPath),
          fs$1.realpath(gitRoot),
        ]);
        if (canonicalRequestPath !== canonicalGitRoot)
          throw new Error("Worker git workspace sync requires the managed worktree root");
        const gitBase = await runTask(
          ["git", "-C", gitRoot, "rev-parse", "--verify", "HEAD"],
          workerSshCommandOptions({
            timeoutMs: REMOTE_SETUP_TIMEOUT_MS$1,
            signal: options.ownerSignal,
          }),
        );
        if (!success$1(gitBase)) throw new Error("Worker git workspace has no base commit");
        baseCommit = gitBase.stdout.trim();
        if (!GIT_COMMIT_PATTERN.test(baseCommit))
          throw new Error("Worker workspace git base is not a commit id");
        const eligiblePath = path.join(temporaryDirectory, "eligible");
        const ignoredPath = path.join(temporaryDirectory, "ignored");
        const selectedPath = path.join(temporaryDirectory, "selected");
        fileListPath = path.join(temporaryDirectory, "transfer-list");
        await runLocalCommandToFile({
          argv: [
            "git",
            "-C",
            gitRoot,
            "ls-files",
            "--full-name",
            "--cached",
            "--others",
            "--exclude-standard",
            "-z",
          ],
          outputPath: eligiblePath,
          signal: options.ownerSignal,
          timeoutMs: WORKSPACE_TIMEOUT_MS,
        });
        const worktreeIncludePath = path.join(gitRoot, ".worktreeinclude");
        if ((await fs$1.lstat(worktreeIncludePath).catch(() => void 0))?.isFile()) {
          await runLocalCommandToFile({
            argv: [
              "git",
              "-C",
              gitRoot,
              "ls-files",
              "--full-name",
              "--others",
              "--ignored",
              "--exclude-standard",
              "-z",
            ],
            outputPath: ignoredPath,
            signal: options.ownerSignal,
            timeoutMs: WORKSPACE_TIMEOUT_MS,
          });
          await runLocalCommandToFile({
            argv: [
              "git",
              "-C",
              gitRoot,
              "ls-files",
              "--full-name",
              "--others",
              "--ignored",
              `--exclude-from=${worktreeIncludePath}`,
              "-z",
            ],
            outputPath: selectedPath,
            signal: options.ownerSignal,
            timeoutMs: WORKSPACE_TIMEOUT_MS,
          });
        } else
          await Promise.all([
            fs$1.writeFile(ignoredPath, "", { mode: 384 }),
            fs$1.writeFile(selectedPath, "", { mode: 384 }),
          ]);
        await writeEligibleGitFiles({
          gitRoot,
          eligiblePath,
          ignoredPath,
          selectedPath,
          outputPath: fileListPath,
        });
        const objectListPath = path.join(temporaryDirectory, "base-objects");
        const packPath = path.join(temporaryDirectory, "base.pack");
        await runLocalCommandToFile({
          argv: [
            "git",
            "-C",
            gitRoot,
            "rev-list",
            "--objects",
            "--no-object-names",
            `${baseCommit}^{tree}`,
          ],
          outputPath: objectListPath,
          signal: options.ownerSignal,
          timeoutMs: WORKSPACE_TIMEOUT_MS,
        });
        await fs$1.appendFile(objectListPath, `${baseCommit}\n`);
        await runLocalCommandToFile({
          argv: ["git", "-C", gitRoot, "pack-objects", "--stdout"],
          inputPath: objectListPath,
          outputPath: packPath,
          signal: options.ownerSignal,
          timeoutMs: WORKSPACE_TIMEOUT_MS,
        });
        const packTransfer = await runTask(
          [
            "rsync",
            "--archive",
            "--checksum",
            "-e",
            rsyncSsh,
            "--",
            packPath,
            `${prepared.scpTarget}:${remoteWorkspaceDir}/${REMOTE_GIT_PACK_NAME}`,
          ],
          workerSshCommandOptions({
            timeoutMs: WORKSPACE_TIMEOUT_MS,
            signal: options.ownerSignal,
          }),
        );
        if (!success$1(packTransfer)) throw workspaceSyncError(packTransfer);
        const [authorName, authorEmail] = await Promise.all(
          ["user.name", "user.email"].map(async (key) => {
            const result = await runTask(
              ["git", "-C", gitRoot, "config", "--get", key],
              workerSshCommandOptions({
                timeoutMs: REMOTE_SETUP_TIMEOUT_MS$1,
                signal: options.ownerSignal,
              }),
            );
            return success$1(result) ? result.stdout.trim() : "";
          }),
        );
        const seeded = await runWorkspaceCommand({
          argv: [
            "sh",
            "-s",
            "--",
            remoteWorkspaceDir,
            path.posix.join(remoteWorkspaceDir, REMOTE_GIT_PACK_NAME),
            baseCommit,
            authorName ?? "",
            authorEmail ?? "",
          ],
          input: REMOTE_GIT_WORKSPACE_SETUP_SCRIPT,
        });
        if (!success$1(seeded)) throw workspaceSyncError(seeded);
      }
      const localSource = gitRoot.endsWith(path.sep) ? gitRoot : `${gitRoot}${path.sep}`;
      const transfer = await runTask(
        [
          "rsync",
          "--archive",
          "--checksum",
          "--exclude=.git",
          ...(fileListPath ? ["--recursive", "--from0", `--files-from=${fileListPath}`] : []),
          "-e",
          rsyncSsh,
          "--",
          localSource,
          `${prepared.scpTarget}:${remoteWorkspaceDir}/`,
        ],
        workerSshCommandOptions({
          timeoutMs: WORKSPACE_TIMEOUT_MS,
          signal: options.ownerSignal,
        }),
      );
      if (!success$1(transfer)) throw workspaceSyncError(transfer);
      const manifest = await runWorkspaceCommand({
        argv: ["node", "-e", REMOTE_WORKSPACE_MANIFEST_JS, remoteWorkspaceDir, baseCommit],
      });
      if (!success$1(manifest)) throw workspaceSyncError(manifest);
      return {
        mode,
        remoteWorkspaceDir,
        manifestRef: parseManifestRef(manifest.stdout.trim()),
      };
    } finally {
      await fs$1.rm(temporaryDirectory, {
        recursive: true,
        force: true,
      });
    }
  };
  return {
    runWorkspaceCommand,
    syncWorkspace(request) {
      return track(syncWorkspaceImpl(request));
    },
  };
}
//#endregion
//#region src/gateway/worker-environments/tunnel.ts
const REMOTE_SOCKET_NAME = "gateway.sock";
const REMOTE_SETUP_TIMEOUT_MS = 2e4;
const DEFAULT_STABLE_CONNECTION_MS = 3e4;
const DEFAULT_BACKOFF = {
  initialMs: 250,
  maxMs: 3e4,
  factor: 2,
  jitter: 0,
};
const REMOTE_SOCKET_SETUP_SCRIPT = String.raw`set -eu
directory=$1
socket=$2
umask 077
if [ -e "$directory" ] || [ -L "$directory" ]; then
  if [ ! -d "$directory" ] || [ -L "$directory" ]; then
    printf '%s\n' 'unsafe worker tunnel directory' >&2
    exit 2
  fi
else
  mkdir -- "$directory"
fi
chmod 700 -- "$directory"
rm -f -- "$socket"
`;
const REMOTE_TUNNEL_READY_SCRIPT = String.raw`set -eu
socket=$1
test -S "$socket"
printf '%s\n' '${WORKER_TUNNEL_READY_MARKER}'
trap 'exit 0' HUP INT TERM
while :; do sleep 3600; done
`;
const REMOTE_SOCKET_CLEANUP_SCRIPT = String.raw`set -eu
socket=$1
directory=$2
rm -f -- "$socket"
rmdir -- "$directory" 2>/dev/null || true
`;
function success(result) {
  return result.termination === "exit" && result.code === 0;
}
function validateStartRequest(request) {
  if (!request.environmentId.trim())
    throw new Error("Worker tunnel environment id must be non-empty");
  if (!Number.isSafeInteger(request.ownerEpoch) || request.ownerEpoch < 0)
    throw new Error("Worker tunnel owner epoch must be a non-negative safe integer");
  if (
    !Number.isInteger(request.gateway.port) ||
    request.gateway.port < 1 ||
    request.gateway.port > 65535
  )
    throw new Error("Worker tunnel gateway port must be an integer between 1 and 65535");
}
function remoteTargetHost(host) {
  return host === "::1" ? `[${host}]` : host;
}
/** Owns process-local reverse tunnels and fences all delayed work on stop or owner replacement. */
function createWorkerTunnelManager(options = {}) {
  const runner = options.runner ?? createWorkerSshRunner();
  const sleep = options.sleep ?? sleepWithAbort;
  const backoff = options.backoff ?? DEFAULT_BACKOFF;
  const now = options.now ?? Date.now;
  const stableConnectionMs = options.stableConnectionMs ?? DEFAULT_STABLE_CONNECTION_MS;
  const entries = /* @__PURE__ */ new Map();
  const claimedOwnerEpochs = /* @__PURE__ */ new Map();
  const isCurrent = (entry) =>
    entries.get(entry.environmentId) === entry && !entry.abortController.signal.aborted;
  const sshCommand = (prepared, params) => ({
    argv: [
      "ssh",
      ...workerSshOptions(prepared, { forwarding: "disabled" }),
      "-a",
      "-x",
      "-T",
      "-p",
      String(prepared.port),
      "--",
      prepared.sshTarget,
      workerSshRemoteCommand(["sh", "-s", "--", ...params.remoteArgs]),
    ],
    options: workerSshCommandOptions({
      input: params.input,
      timeoutMs: REMOTE_SETUP_TIMEOUT_MS,
      signal: params.signal,
    }),
  });
  const prepareRemoteSocket = async (entry) => {
    const prepared = entry.prepared;
    if (!prepared) throw new Error("Worker tunnel SSH context is unavailable");
    const command = sshCommand(prepared, {
      input: REMOTE_SOCKET_SETUP_SCRIPT,
      remoteArgs: [entry.remoteDirectory, entry.remoteSocketPath],
      signal: entry.abortController.signal,
    });
    const result = await runner.run(command.argv, command.options);
    if (!success(result)) throw workerSshProcessError(result.stderr || result.stdout);
  };
  const cleanupRemoteSocket = async (entry) => {
    if (!entry.prepared) return;
    const command = sshCommand(entry.prepared, {
      input: REMOTE_SOCKET_CLEANUP_SCRIPT,
      remoteArgs: [entry.remoteSocketPath, entry.remoteDirectory],
    });
    await runner.run(command.argv, command.options).catch(() => void 0);
  };
  const createHandle = (entry) => ({
    environmentId: entry.environmentId,
    ownerEpoch: entry.ownerEpoch,
    remoteSocketPath: entry.remoteSocketPath,
    ...createWorkerWorkspaceActions({
      environmentId: entry.environmentId,
      ownerSignal: entry.abortController.signal,
      isConnected: () => isCurrent(entry) && entry.status === "connected",
      getPrepared: () => entry.prepared,
      runner,
      tasks: entry.workspaceTasks,
    }),
    stop: () => stop(entry.environmentId, entry.ownerEpoch),
  });
  const connect = async (entry) => {
    const prepared = entry.prepared;
    if (!prepared) throw new Error("Worker tunnel SSH context is unavailable");
    await prepareRemoteSocket(entry);
    if (!isCurrent(entry)) throw new Error("Worker tunnel owner changed during connection");
    const target = `${remoteTargetHost(entry.gateway.host)}:${entry.gateway.port}`;
    return runner.start(
      [
        "ssh",
        ...workerSshOptions(prepared, { forwarding: "explicit" }),
        "-a",
        "-x",
        "-T",
        "-o",
        "ServerAliveInterval=15",
        "-o",
        "ServerAliveCountMax=3",
        "-o",
        "StreamLocalBindMask=0177",
        "-o",
        "StreamLocalBindUnlink=yes",
        "-R",
        `${entry.remoteSocketPath}:${target}`,
        "-p",
        String(prepared.port),
        "--",
        prepared.sshTarget,
        workerSshRemoteCommand(["sh", "-s", "--", entry.remoteSocketPath]),
      ],
      workerSshCommandOptions({
        input: REMOTE_TUNNEL_READY_SCRIPT,
        timeoutMs: Number.MAX_SAFE_INTEGER,
        signal: entry.abortController.signal,
      }),
    );
  };
  const reconnectLoop = async (entry) => {
    const reconnectSupervisor = new RetrySupervisor(backoff);
    while (isCurrent(entry)) {
      entry.status = reconnectSupervisor.attempts === 0 ? "connecting" : "reconnecting";
      let child;
      try {
        child = await connect(entry);
        entry.process = child;
        await child.ready;
        if (!isCurrent(entry)) {
          await child.stop();
          return;
        }
        entry.status = "connected";
        if (!entry.readySettled) {
          entry.readySettled = true;
          entry.resolveReady(createHandle(entry));
        }
        const connectedAtMs = now();
        await child.exited;
        if (now() - connectedAtMs >= stableConnectionMs) reconnectSupervisor.reset();
      } catch {
        await child?.stop().catch(() => void 0);
      } finally {
        if (entry.process === child) entry.process = void 0;
      }
      if (!isCurrent(entry)) return;
      entry.status = "reconnecting";
      try {
        const retry = reconnectSupervisor.next(entry.abortController.signal);
        await sleep(retry.delayMs, retry.signal);
      } catch {
        return;
      }
    }
  };
  const stopEntry = (entry) => {
    if (entry.stopPromise) return entry.stopPromise;
    entry.stopPromise = (async () => {
      if (entries.get(entry.environmentId) === entry) entries.delete(entry.environmentId);
      entry.abortController.abort(/* @__PURE__ */ new Error("Worker tunnel owner stopped"));
      if (!entry.readySettled) {
        entry.readySettled = true;
        entry.rejectReady(/* @__PURE__ */ new Error("Worker tunnel stopped before connecting"));
      }
      await entry.process?.stop().catch(() => void 0);
      await entry.initialization?.catch(() => void 0);
      await entry.process?.stop().catch(() => void 0);
      await Promise.allSettled(entry.workspaceTasks);
      await entry.loop?.catch(() => void 0);
      await cleanupRemoteSocket(entry);
      await entry.prepared?.dispose().catch(() => void 0);
    })();
    return entry.stopPromise;
  };
  async function start(request) {
    validateStartRequest(request);
    const claimedEpoch = claimedOwnerEpochs.get(request.environmentId);
    if (claimedEpoch !== void 0 && request.ownerEpoch < claimedEpoch)
      throw new Error("Worker tunnel owner epoch is stale");
    claimedOwnerEpochs.set(request.environmentId, request.ownerEpoch);
    const current = entries.get(request.environmentId);
    if (current) {
      if (request.ownerEpoch < current.ownerEpoch)
        throw new Error("Worker tunnel owner epoch is stale");
      if (request.ownerEpoch === current.ownerEpoch) return await current.ready;
    }
    let resolveReady;
    let rejectReady;
    const ready = new Promise((resolve, reject) => {
      resolveReady = resolve;
      rejectReady = reject;
    });
    ready.catch(() => void 0);
    const remoteDirectory = `/tmp/ocw-${stableWorkerPathComponent(request.environmentId, 16)}-${request.ownerEpoch}`;
    const entry = {
      environmentId: request.environmentId,
      ownerEpoch: request.ownerEpoch,
      gateway: request.gateway,
      remoteDirectory,
      remoteSocketPath: `${remoteDirectory}/${REMOTE_SOCKET_NAME}`,
      abortController: new AbortController(),
      status: "connecting",
      ready,
      resolveReady,
      rejectReady,
      readySettled: false,
      workspaceTasks: /* @__PURE__ */ new Set(),
    };
    entries.set(request.environmentId, entry);
    entry.initialization = (async () => {
      if (current) await stopEntry(current);
      if (!isCurrent(entry)) return;
      entry.prepared = await prepareWorkerSsh({
        ssh: request.ssh,
        pinnedHostKey: request.ssh.hostKey,
        resolveIdentity: request.resolveIdentity,
        temporaryDirectoryPrefix: "openclaw-worker-tunnel-",
      });
      if (!isCurrent(entry)) {
        await entry.prepared.dispose();
        entry.prepared = void 0;
        return;
      }
      entry.loop = reconnectLoop(entry);
      entry.loop.catch((error) => {
        if (!entry.readySettled) {
          entry.readySettled = true;
          entry.rejectReady(
            error instanceof Error ? error : /* @__PURE__ */ new Error("Worker tunnel failed"),
          );
        }
      });
    })();
    entry.initialization.catch((error) => {
      if (!entry.readySettled) {
        entry.readySettled = true;
        entry.rejectReady(
          error instanceof Error ? error : /* @__PURE__ */ new Error("Worker tunnel failed"),
        );
      }
      stopEntry(entry);
    });
    return await entry.ready;
  }
  async function stop(environmentId, ownerEpoch) {
    const entry = entries.get(environmentId);
    if (!entry || (ownerEpoch !== void 0 && ownerEpoch !== entry.ownerEpoch)) return;
    await stopEntry(entry);
  }
  async function stopAll() {
    const current = [...entries.values()];
    for (const entry of current) {
      entries.delete(entry.environmentId);
      entry.abortController.abort(/* @__PURE__ */ new Error("Worker tunnel manager stopped"));
    }
    await Promise.all(current.map(stopEntry));
  }
  return {
    start,
    stop,
    stopAll,
    status(environmentId) {
      return entries.get(environmentId)?.status ?? "stopped";
    },
  };
}
//#endregion
export { createWorkerTunnelManager };
