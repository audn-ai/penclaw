import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import "./parse-finite-number-Z7n6tXLk.js";
import path from "node:path";
import "./errors-BoHeli7m.js";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { t as buildDockerExecArgs } from "./bash-tools.shared-BjYufFPv.js";
import { i as resolveSandboxConfigForAgent } from "./config-l1rpbjvM.js";
import { S as SANDBOX_COMMAND_MAX_BUFFER_BYTES } from "./constants-Bs8JiPHi.js";
import "./number-coercion-EqFmHmOw.js";
import "./utils-DtcDeqWS.js";
import {
  D as isExistingWorkspaceSkillMountSource,
  O as resolveMaterializedSandboxSkillsWorkspaceDir,
  a as execDocker,
  i as ensureSandboxContainer,
  n as dockerContainerState,
  o as execDockerRaw,
} from "./docker-yvxsWR8P.js";
import "./path-guards-CBe_wA_B.js";
import "./boundary-path-CBe_wA_B.js";
import { r as toErrorObject } from "./error-coercion-CrJRoLe1.js";
import "./path-alias-guards-CBe_wA_B.js";
import { o as spawnCommand, s as isPlainCommandExitFailure } from "./exec-CXKmx4dL.js";
import { r as loadActivatedBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-D2RPlnfc.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import {
  o as asDateTimestampMs,
  y as parseStrictNonNegativeInteger,
} from "./number-coercion-CJQ8TR--.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import {
  n as normalizeContainerPath$1,
  r as relativePathEscapesContainerRoot,
  t as isPathInsideContainerRoot,
} from "./path-utils-Dj-M9hwE.js";
import { r as resolveRootPath } from "./root-path-D-mKQHrm.js";
import { t as sanitizeEnvVars } from "./sanitize-env-vars-JDpL4YLs.js";
import { o as PATH_ALIAS_POLICIES } from "./secure-temp-dir-DMUMnweR.js";
import { t as parseSshTarget } from "./ssh-tunnel-CTKhXYra.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region src/agents/sandbox/docker-backend.ts
/**
 * Docker sandbox backend implementation.
 *
 * Creates/reuses Docker containers and exposes backend-neutral exec and shell-command handles.
 */
function resolveConfiguredDockerRuntimeImage(params) {
  const sandboxCfg = resolveSandboxConfigForAgent(params.config, params.agentId);
  switch (params.configLabelKind) {
    case "BrowserImage":
      return sandboxCfg.browser.image;
    default:
      return sandboxCfg.docker.image;
  }
}
async function createDockerSandboxBackend(params) {
  return createDockerSandboxBackendHandle({
    containerName: await ensureSandboxContainer({
      sessionKey: params.sessionKey,
      workspaceDir: params.workspaceDir,
      agentWorkspaceDir: params.agentWorkspaceDir,
      skillsWorkspaceDir: params.skillsWorkspaceDir,
      cfg: params.cfg,
      ...(params.requireCurrentConfig !== void 0
        ? { requireCurrentConfig: params.requireCurrentConfig }
        : {}),
    }),
    workdir: params.cfg.docker.workdir,
    env: params.cfg.docker.env,
    image: params.cfg.docker.image,
  });
}
function createDockerSandboxBackendHandle(params) {
  return {
    id: "docker",
    runtimeId: params.containerName,
    runtimeLabel: params.containerName,
    workdir: params.workdir,
    env: params.env,
    configLabel: params.image,
    configLabelKind: "Image",
    capabilities: { browser: true },
    async buildExecSpec({ command, workdir, env, usePty }) {
      return {
        argv: [
          "docker",
          ...buildDockerExecArgs({
            containerName: params.containerName,
            command,
            workdir: workdir ?? params.workdir,
            env,
            tty: usePty,
          }),
        ],
        env: process.env,
        stdinMode: usePty ? "pipe-open" : "pipe-closed",
      };
    },
    runShellCommand(command) {
      return runDockerSandboxShellCommand({
        containerName: params.containerName,
        ...command,
      });
    },
  };
}
function runDockerSandboxShellCommand(params) {
  const dockerArgs = [
    "exec",
    "-i",
    params.containerName,
    "sh",
    "-c",
    params.script,
    "openclaw-sandbox-fs",
  ];
  if (params.args?.length) dockerArgs.push(...params.args);
  return execDockerRaw(dockerArgs, {
    input: params.stdin,
    allowFailure: params.allowFailure,
    signal: params.signal,
  });
}
const dockerSandboxBackendManager = {
  async describeRuntime({ entry, config, agentId }) {
    const state = await dockerContainerState(entry.containerName);
    let actualConfigLabel = entry.image;
    if (state.exists)
      try {
        const result = await execDocker(
          ["inspect", "-f", "{{.Config.Image}}", entry.containerName],
          { allowFailure: true },
        );
        if (result.code === 0) actualConfigLabel = result.stdout.trim() || actualConfigLabel;
      } catch {}
    const configuredImage = resolveConfiguredDockerRuntimeImage({
      config,
      agentId,
      configLabelKind: entry.configLabelKind,
    });
    return {
      running: state.running,
      actualConfigLabel,
      configLabelMatch: actualConfigLabel === configuredImage,
    };
  },
  async removeRuntime({ entry }) {
    const result = await execDocker(["rm", "-f", entry.containerName], { allowFailure: true });
    if (result.code !== 0) {
      const detail = result.stderr.trim() || result.stdout.trim() || `exit ${result.code}`;
      if (/No such (container|object)/iu.test(detail)) return;
      throw new Error(`Failed to remove Docker sandbox runtime ${entry.containerName}: ${detail}`);
    }
  },
};
//#endregion
//#region src/agents/sandbox/fs-bridge-mutation-helper.ts
/**
 * Pinned Python mutation helper for sandbox filesystem writes.
 *
 * Performs symlink-resistant create/replace/delete operations inside a previously validated sandbox boundary.
 */
const SANDBOX_PINNED_MUTATION_PYTHON_CANDIDATES = [
  "/usr/bin/python3",
  "/usr/local/bin/python3",
  "/opt/homebrew/bin/python3",
  "/bin/python3",
];
const SANDBOX_PINNED_MUTATION_PYTHON = [
  "import errno",
  "import os",
  "import secrets",
  "import stat",
  "import sys",
  "",
  "operation = sys.argv[1]",
  "",
  "DIR_FLAGS = os.O_RDONLY",
  "if hasattr(os, 'O_DIRECTORY'):",
  "    DIR_FLAGS |= os.O_DIRECTORY",
  "if hasattr(os, 'O_NOFOLLOW'):",
  "    DIR_FLAGS |= os.O_NOFOLLOW",
  "",
  "READ_FLAGS = os.O_RDONLY",
  "if hasattr(os, 'O_NOFOLLOW'):",
  "    READ_FLAGS |= os.O_NOFOLLOW",
  "",
  "WRITE_FLAGS = os.O_WRONLY | os.O_CREAT | os.O_EXCL",
  "if hasattr(os, 'O_NOFOLLOW'):",
  "    WRITE_FLAGS |= os.O_NOFOLLOW",
  "",
  "def split_relative(path_value):",
  "    segments = []",
  "    for segment in path_value.split('/'):",
  "        if not segment or segment == '.':",
  "            continue",
  "        if segment == '..':",
  "            raise OSError(errno.EPERM, 'path traversal is not allowed', segment)",
  "        segments.append(segment)",
  "    return segments",
  "",
  "def open_dir(path_value, dir_fd=None):",
  "    return os.open(path_value, DIR_FLAGS, dir_fd=dir_fd)",
  "",
  "def walk_dir(root_fd, rel_path, mkdir_enabled):",
  "    current_fd = os.dup(root_fd)",
  "    try:",
  "        for segment in split_relative(rel_path):",
  "            try:",
  "                next_fd = open_dir(segment, dir_fd=current_fd)",
  "            except FileNotFoundError:",
  "                if not mkdir_enabled:",
  "                    raise",
  "                os.mkdir(segment, 0o777, dir_fd=current_fd)",
  "                next_fd = open_dir(segment, dir_fd=current_fd)",
  "            os.close(current_fd)",
  "            current_fd = next_fd",
  "        return current_fd",
  "    except Exception:",
  "        os.close(current_fd)",
  "        raise",
  "",
  "def create_temp_file(parent_fd, basename):",
  "    prefix = '.openclaw-write-' + basename + '.'",
  "    for _ in range(128):",
  "        candidate = prefix + secrets.token_hex(6)",
  "        try:",
  "            fd = os.open(candidate, WRITE_FLAGS, 0o600, dir_fd=parent_fd)",
  "            return candidate, fd",
  "        except FileExistsError:",
  "            continue",
  "    raise RuntimeError('failed to allocate sandbox temp file')",
  "",
  "def create_temp_dir(parent_fd, basename, mode):",
  "    prefix = '.openclaw-move-' + basename + '.'",
  "    for _ in range(128):",
  "        candidate = prefix + secrets.token_hex(6)",
  "        try:",
  "            os.mkdir(candidate, mode, dir_fd=parent_fd)",
  "            return candidate",
  "        except FileExistsError:",
  "            continue",
  "    raise RuntimeError('failed to allocate sandbox temp directory')",
  "",
  "def existing_regular_file_mode(parent_fd, basename):",
  "    try:",
  "        target_stat = os.lstat(basename, dir_fd=parent_fd)",
  "    except FileNotFoundError:",
  "        return None",
  "    if stat.S_ISREG(target_stat.st_mode):",
  "        return stat.S_IMODE(target_stat.st_mode)",
  "    return None",
  "",
  "def write_atomic(parent_fd, basename, stdin_buffer):",
  "    target_mode = existing_regular_file_mode(parent_fd, basename)",
  "    temp_fd = None",
  "    temp_name = None",
  "    try:",
  "        temp_name, temp_fd = create_temp_file(parent_fd, basename)",
  "        while True:",
  "            chunk = stdin_buffer.read(65536)",
  "            if not chunk:",
  "                break",
  "            os.write(temp_fd, chunk)",
  "        if target_mode is not None:",
  "            try:",
  "                os.fchmod(temp_fd, target_mode)",
  "            except AttributeError:",
  "                pass",
  "        os.fsync(temp_fd)",
  "        os.close(temp_fd)",
  "        temp_fd = None",
  "        os.replace(temp_name, basename, src_dir_fd=parent_fd, dst_dir_fd=parent_fd)",
  "        temp_name = None",
  "        os.fsync(parent_fd)",
  "    finally:",
  "        if temp_fd is not None:",
  "            os.close(temp_fd)",
  "        if temp_name is not None:",
  "            try:",
  "                os.unlink(temp_name, dir_fd=parent_fd)",
  "            except FileNotFoundError:",
  "                pass",
  "",
  "def read_file(parent_fd, basename):",
  "    file_fd = os.open(basename, READ_FLAGS, dir_fd=parent_fd)",
  "    try:",
  "        file_stat = os.fstat(file_fd)",
  "        if not stat.S_ISREG(file_stat.st_mode):",
  "            raise OSError(errno.EPERM, 'only regular files are allowed', basename)",
  "        if file_stat.st_nlink > 1:",
  "            raise OSError(errno.EPERM, 'hardlinked file is not allowed', basename)",
  "        while True:",
  "            chunk = os.read(file_fd, 65536)",
  "            if not chunk:",
  "                break",
  "            os.write(1, chunk)",
  "    finally:",
  "        os.close(file_fd)",
  "",
  "def remove_tree(parent_fd, basename):",
  "    entry_stat = os.lstat(basename, dir_fd=parent_fd)",
  "    if not stat.S_ISDIR(entry_stat.st_mode) or stat.S_ISLNK(entry_stat.st_mode):",
  "        os.unlink(basename, dir_fd=parent_fd)",
  "        return",
  "    dir_fd = open_dir(basename, dir_fd=parent_fd)",
  "    try:",
  "        for child in os.listdir(dir_fd):",
  "            remove_tree(dir_fd, child)",
  "    finally:",
  "        os.close(dir_fd)",
  "    os.rmdir(basename, dir_fd=parent_fd)",
  "",
  "def entry_identity(entry_stat):",
  "    return (",
  "        entry_stat.st_dev,",
  "        entry_stat.st_ino,",
  "        entry_stat.st_mode,",
  "        entry_stat.st_size,",
  "        getattr(entry_stat, 'st_mtime_ns', int(entry_stat.st_mtime * 1000000000)),",
  "        getattr(entry_stat, 'st_ctime_ns', int(entry_stat.st_ctime * 1000000000)),",
  "    )",
  "",
  "def same_identity(expected, entry_stat):",
  "    return expected == entry_identity(entry_stat)",
  "",
  "def source_changed_error(basename):",
  "    return OSError(getattr(errno, 'ESTALE', errno.EIO), 'source changed during move fallback cleanup', basename)",
  "",
  "def copy_entry(src_parent_fd, src_basename, dst_parent_fd, dst_basename):",
  "    src_stat = os.lstat(src_basename, dir_fd=src_parent_fd)",
  "    if stat.S_ISDIR(src_stat.st_mode) and not stat.S_ISLNK(src_stat.st_mode):",
  "        os.mkdir(dst_basename, stat.S_IMODE(src_stat.st_mode) or 0o755, dir_fd=dst_parent_fd)",
  "        copied_children = []",
  "        src_dir_fd = None",
  "        dst_dir_fd = None",
  "        try:",
  "            src_dir_fd = open_dir(src_basename, dir_fd=src_parent_fd)",
  "            src_stat = os.fstat(src_dir_fd)",
  "            dst_dir_fd = open_dir(dst_basename, dir_fd=dst_parent_fd)",
  "            for child in os.listdir(src_dir_fd):",
  "                copied_children.append((child, copy_entry(src_dir_fd, child, dst_dir_fd, child)))",
  "        except Exception:",
  "            if dst_dir_fd is not None:",
  "                os.close(dst_dir_fd)",
  "                dst_dir_fd = None",
  "            try:",
  "                remove_tree(dst_parent_fd, dst_basename)",
  "            except FileNotFoundError:",
  "                pass",
  "            raise",
  "        finally:",
  "            if src_dir_fd is not None:",
  "                os.close(src_dir_fd)",
  "            if dst_dir_fd is not None:",
  "                os.close(dst_dir_fd)",
  "        return ('dir', entry_identity(src_stat), copied_children)",
  "    if stat.S_ISLNK(src_stat.st_mode):",
  "        link_target = os.readlink(src_basename, dir_fd=src_parent_fd)",
  "        os.symlink(link_target, dst_basename, dir_fd=dst_parent_fd)",
  "        return ('leaf', entry_identity(src_stat), None)",
  "    src_fd = os.open(src_basename, READ_FLAGS, dir_fd=src_parent_fd)",
  "    dst_fd = None",
  "    try:",
  "        src_file_stat = os.fstat(src_fd)",
  "        if not stat.S_ISREG(src_file_stat.st_mode):",
  "            raise OSError(errno.EPERM, 'only regular files are allowed', src_basename)",
  "        if src_file_stat.st_nlink > 1:",
  "            raise OSError(errno.EPERM, 'hardlinked file is not allowed', src_basename)",
  "        dst_fd = os.open(dst_basename, WRITE_FLAGS, stat.S_IMODE(src_stat.st_mode), dir_fd=dst_parent_fd)",
  "        while True:",
  "            chunk = os.read(src_fd, 65536)",
  "            if not chunk:",
  "                break",
  "            os.write(dst_fd, chunk)",
  "        try:",
  "            os.fchmod(dst_fd, stat.S_IMODE(src_stat.st_mode))",
  "        except AttributeError:",
  "            pass",
  "        os.fsync(dst_fd)",
  "    finally:",
  "        if dst_fd is not None:",
  "            os.close(dst_fd)",
  "        os.close(src_fd)",
  "    return ('leaf', entry_identity(src_file_stat), None)",
  "",
  "def remove_copied_entry(parent_fd, basename, manifest):",
  "    kind, expected_identity, children = manifest",
  "    current_stat = os.lstat(basename, dir_fd=parent_fd)",
  "    if not same_identity(expected_identity, current_stat):",
  "        raise source_changed_error(basename)",
  "    if kind != 'dir':",
  "        os.unlink(basename, dir_fd=parent_fd)",
  "        return",
  "    dir_fd = open_dir(basename, dir_fd=parent_fd)",
  "    try:",
  "        for child, child_manifest in children:",
  "            remove_copied_entry(dir_fd, child, child_manifest)",
  "    finally:",
  "        os.close(dir_fd)",
  "    os.rmdir(basename, dir_fd=parent_fd)",
  "",
  "def move_entry(src_parent_fd, src_basename, dst_parent_fd, dst_basename):",
  "    try:",
  "        os.rename(src_basename, dst_basename, src_dir_fd=src_parent_fd, dst_dir_fd=dst_parent_fd)",
  "        os.fsync(dst_parent_fd)",
  "        os.fsync(src_parent_fd)",
  "        return",
  "    except OSError as err:",
  "        if err.errno != errno.EXDEV:",
  "            raise",
  "    src_stat = os.lstat(src_basename, dir_fd=src_parent_fd)",
  "    if stat.S_ISDIR(src_stat.st_mode) and not stat.S_ISLNK(src_stat.st_mode):",
  "        temp_dir_name = create_temp_dir(dst_parent_fd, dst_basename, stat.S_IMODE(src_stat.st_mode) or 0o755)",
  "        copied_children = []",
  "        temp_dir_fd = None",
  "        src_dir_fd = None",
  "        try:",
  "            temp_dir_fd = open_dir(temp_dir_name, dir_fd=dst_parent_fd)",
  "            src_dir_fd = open_dir(src_basename, dir_fd=src_parent_fd)",
  "            src_stat = os.fstat(src_dir_fd)",
  "            for child in os.listdir(src_dir_fd):",
  "                copied_children.append((child, copy_entry(src_dir_fd, child, temp_dir_fd, child)))",
  "            os.close(src_dir_fd)",
  "            src_dir_fd = None",
  "            os.close(temp_dir_fd)",
  "            temp_dir_fd = None",
  "            os.rename(temp_dir_name, dst_basename, src_dir_fd=dst_parent_fd, dst_dir_fd=dst_parent_fd)",
  "        except Exception:",
  "            if src_dir_fd is not None:",
  "                os.close(src_dir_fd)",
  "            if temp_dir_fd is not None:",
  "                os.close(temp_dir_fd)",
  "            try:",
  "                remove_tree(dst_parent_fd, temp_dir_name)",
  "            except FileNotFoundError:",
  "                pass",
  "            raise",
  "        remove_copied_entry(src_parent_fd, src_basename, ('dir', entry_identity(src_stat), copied_children))",
  "        os.fsync(dst_parent_fd)",
  "        os.fsync(src_parent_fd)",
  "        return",
  "    if stat.S_ISLNK(src_stat.st_mode):",
  "        link_target = os.readlink(src_basename, dir_fd=src_parent_fd)",
  "        try:",
  "            os.unlink(dst_basename, dir_fd=dst_parent_fd)",
  "        except FileNotFoundError:",
  "            pass",
  "        os.symlink(link_target, dst_basename, dir_fd=dst_parent_fd)",
  "        os.unlink(src_basename, dir_fd=src_parent_fd)",
  "        os.fsync(dst_parent_fd)",
  "        os.fsync(src_parent_fd)",
  "        return",
  "    src_fd = os.open(src_basename, READ_FLAGS, dir_fd=src_parent_fd)",
  "    temp_fd = None",
  "    temp_name = None",
  "    try:",
  "        src_file_stat = os.fstat(src_fd)",
  "        if not stat.S_ISREG(src_file_stat.st_mode):",
  "            raise OSError(errno.EPERM, 'only regular files are allowed', src_basename)",
  "        if src_file_stat.st_nlink > 1:",
  "            raise OSError(errno.EPERM, 'hardlinked file is not allowed', src_basename)",
  "        temp_name, temp_fd = create_temp_file(dst_parent_fd, dst_basename)",
  "        while True:",
  "            chunk = os.read(src_fd, 65536)",
  "            if not chunk:",
  "                break",
  "            os.write(temp_fd, chunk)",
  "        try:",
  "            os.fchmod(temp_fd, stat.S_IMODE(src_stat.st_mode))",
  "        except AttributeError:",
  "            pass",
  "        os.fsync(temp_fd)",
  "        os.close(temp_fd)",
  "        temp_fd = None",
  "        os.replace(temp_name, dst_basename, src_dir_fd=dst_parent_fd, dst_dir_fd=dst_parent_fd)",
  "        temp_name = None",
  "        os.unlink(src_basename, dir_fd=src_parent_fd)",
  "        os.fsync(dst_parent_fd)",
  "        os.fsync(src_parent_fd)",
  "    finally:",
  "        if temp_fd is not None:",
  "            os.close(temp_fd)",
  "        if temp_name is not None:",
  "            try:",
  "                os.unlink(temp_name, dir_fd=dst_parent_fd)",
  "            except FileNotFoundError:",
  "                pass",
  "        os.close(src_fd)",
  "",
  "if operation == 'write':",
  "    root_fd = open_dir(sys.argv[2])",
  "    parent_fd = None",
  "    try:",
  "        parent_fd = walk_dir(root_fd, sys.argv[3], sys.argv[5] == '1')",
  "        write_atomic(parent_fd, sys.argv[4], sys.stdin.buffer)",
  "    finally:",
  "        if parent_fd is not None:",
  "            os.close(parent_fd)",
  "        os.close(root_fd)",
  "elif operation == 'read':",
  "    root_fd = open_dir(sys.argv[2])",
  "    parent_fd = None",
  "    try:",
  "        parent_fd = walk_dir(root_fd, sys.argv[3], False)",
  "        read_file(parent_fd, sys.argv[4])",
  "    finally:",
  "        if parent_fd is not None:",
  "            os.close(parent_fd)",
  "        os.close(root_fd)",
  "elif operation == 'mkdirp':",
  "    root_fd = open_dir(sys.argv[2])",
  "    target_fd = None",
  "    try:",
  "        target_fd = walk_dir(root_fd, sys.argv[3], True)",
  "        os.fsync(target_fd)",
  "    finally:",
  "        if target_fd is not None:",
  "            os.close(target_fd)",
  "        os.close(root_fd)",
  "elif operation == 'remove':",
  "    root_fd = open_dir(sys.argv[2])",
  "    parent_fd = None",
  "    try:",
  "        parent_fd = walk_dir(root_fd, sys.argv[3], False)",
  "        try:",
  "            if sys.argv[5] == '1':",
  "                remove_tree(parent_fd, sys.argv[4])",
  "            else:",
  "                entry_stat = os.lstat(sys.argv[4], dir_fd=parent_fd)",
  "                if stat.S_ISDIR(entry_stat.st_mode) and not stat.S_ISLNK(entry_stat.st_mode):",
  "                    os.rmdir(sys.argv[4], dir_fd=parent_fd)",
  "                else:",
  "                    os.unlink(sys.argv[4], dir_fd=parent_fd)",
  "            os.fsync(parent_fd)",
  "        except FileNotFoundError:",
  "            if sys.argv[6] != '1':",
  "                raise",
  "    finally:",
  "        if parent_fd is not None:",
  "            os.close(parent_fd)",
  "        os.close(root_fd)",
  "elif operation == 'rename':",
  "    src_root_fd = open_dir(sys.argv[2])",
  "    dst_root_fd = open_dir(sys.argv[5])",
  "    src_parent_fd = None",
  "    dst_parent_fd = None",
  "    try:",
  "        src_parent_fd = walk_dir(src_root_fd, sys.argv[3], False)",
  "        dst_parent_fd = walk_dir(dst_root_fd, sys.argv[6], sys.argv[8] == '1')",
  "        move_entry(src_parent_fd, sys.argv[4], dst_parent_fd, sys.argv[7])",
  "    finally:",
  "        if src_parent_fd is not None:",
  "            os.close(src_parent_fd)",
  "        if dst_parent_fd is not None:",
  "            os.close(dst_parent_fd)",
  "        os.close(src_root_fd)",
  "        os.close(dst_root_fd)",
  "else:",
  "    raise RuntimeError('unknown sandbox mutation operation: ' + operation)",
].join("\n");
const SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL = `'${SANDBOX_PINNED_MUTATION_PYTHON.replaceAll("'", `'\\''`)}'`;
function buildPinnedMutationPlan(params) {
  return {
    checks: params.checks,
    recheckBeforeCommand: true,
    script: [
      "set -eu",
      "python_cmd=''",
      ...SANDBOX_PINNED_MUTATION_PYTHON_CANDIDATES.map(
        (candidate) =>
          `if [ -z "$python_cmd" ] && [ -x '${candidate}' ]; then python_cmd='${candidate}'; fi`,
      ),
      'if [ -z "$python_cmd" ]; then python_cmd=$(command -v python3 2>/dev/null || command -v python 2>/dev/null || true); fi',
      'if [ -z "$python_cmd" ]; then',
      "  echo >&2 'sandbox pinned mutation helper requires python3 or python'",
      "  exit 127",
      "fi",
      `python_script=${SANDBOX_PINNED_MUTATION_PYTHON_SHELL_LITERAL}`,
      'exec "$python_cmd" -c "$python_script" "$@"',
    ].join("\n"),
    args: params.args,
  };
}
function buildPinnedWritePlan(params) {
  return buildPinnedMutationPlan({
    checks: [params.check],
    args: [
      "write",
      params.pinned.mountRootPath,
      params.pinned.relativeParentPath,
      params.pinned.basename,
      params.mkdir ? "1" : "0",
    ],
  });
}
function buildPinnedMkdirpPlan(params) {
  return buildPinnedMutationPlan({
    checks: [params.check],
    args: ["mkdirp", params.pinned.mountRootPath, params.pinned.relativePath],
  });
}
function buildPinnedRemovePlan(params) {
  return buildPinnedMutationPlan({
    checks: [
      {
        target: params.check.target,
        options: {
          ...params.check.options,
          aliasPolicy: PATH_ALIAS_POLICIES.unlinkTarget,
        },
      },
    ],
    args: [
      "remove",
      params.pinned.mountRootPath,
      params.pinned.relativeParentPath,
      params.pinned.basename,
      params.recursive ? "1" : "0",
      params.force === false ? "0" : "1",
    ],
  });
}
function buildPinnedRenamePlan(params) {
  return buildPinnedMutationPlan({
    checks: [
      {
        target: params.fromCheck.target,
        options: {
          ...params.fromCheck.options,
          aliasPolicy: PATH_ALIAS_POLICIES.unlinkTarget,
        },
      },
      params.toCheck,
    ],
    args: [
      "rename",
      params.from.mountRootPath,
      params.from.relativeParentPath,
      params.from.basename,
      params.to.mountRootPath,
      params.to.relativeParentPath,
      params.to.basename,
      "1",
    ],
  });
}
//#endregion
//#region src/agents/sandbox/fs-bridge-rename-targets.ts
/**
 * Shared writable-target resolution for sandbox fs bridge rename operations.
 */
/** Resolves both rename endpoints and verifies write access before command execution. */
function resolveWritableRenameTargets(params) {
  const action = params.action ?? "rename files";
  const from = params.resolveTarget({
    filePath: params.from,
    cwd: params.cwd,
  });
  const to = params.resolveTarget({
    filePath: params.to,
    cwd: params.cwd,
  });
  params.ensureWritable(from, action);
  params.ensureWritable(to, action);
  return {
    from,
    to,
  };
}
/** Adapter used by bridge implementations that pass resolver callbacks separately. */
function resolveWritableRenameTargetsForBridge(params, resolveTarget, ensureWritable) {
  return resolveWritableRenameTargets({
    ...params,
    resolveTarget,
    ensureWritable,
  });
}
/** Creates a reusable resolver bound to a bridge's target and permission helpers. */
function createWritableRenameTargetResolver(resolveTarget, ensureWritable) {
  return (params) => resolveWritableRenameTargetsForBridge(params, resolveTarget, ensureWritable);
}
//#endregion
//#region src/agents/sandbox/fs-bridge-stat-parse.ts
/**
 * Stat output parsers for sandbox filesystem bridges.
 *
 * Handles GNU/BSD size and mtime formats returned through backend shell commands.
 */
/** Parses file sizes, capping huge integer strings at the largest safe JS integer. */
function parseSandboxStatSize(value) {
  const raw = value ?? "0";
  const parsed = parseStrictNonNegativeInteger(raw);
  if (parsed !== void 0) return parsed;
  return /^\d+$/.test(raw) ? Number.MAX_SAFE_INTEGER : 0;
}
/** Parses stat mtimes from epoch seconds or date strings into millisecond timestamps. */
function parseSandboxStatMtimeMs(value) {
  const raw = value ?? "0";
  if (/^\d+(?:\.\d+)?$/.test(raw)) return asDateTimestampMs(Number(raw) * 1e3) ?? 0;
  return asDateTimestampMs(Date.parse(raw)) ?? 0;
}
//#endregion
//#region src/agents/sandbox/remote-fs-bridge.ts
/**
 * Remote shell-backed sandbox filesystem bridge.
 *
 * Resolves sandbox paths against uploaded remote mounts and performs guarded operations through backend shell commands.
 */
function hasMultipleHardlinks(raw) {
  const linkCount = parseStrictNonNegativeInteger(raw);
  if (linkCount !== void 0) return linkCount > 1;
  return /^\d+$/.test(raw);
}
/** Create the filesystem bridge for remote shell-backed sandbox runtimes. */
function createRemoteShellSandboxFsBridge(params) {
  return new RemoteShellSandboxFsBridge(params.sandbox, params.runtime);
}
var RemoteShellSandboxFsBridge = class {
  constructor(sandbox, runtime) {
    this.sandbox = sandbox;
    this.runtime = runtime;
    this.resolveRenameTargets = createWritableRenameTargetResolver(
      (target) => this.resolveTarget(target),
      (target, action) => this.ensureWritable(target, action),
    );
  }
  resolvePath(params) {
    const target = this.resolveTarget(params);
    return {
      relativePath: target.relativePath,
      containerPath: target.containerPath,
    };
  }
  async readFile(params) {
    const target = this.resolveTarget(params);
    const relativePath = path.posix.relative(target.mountRootPath, target.containerPath);
    if (
      relativePath === "" ||
      relativePath === "." ||
      relativePathEscapesContainerRoot(relativePath)
    )
      throw new Error(`Invalid sandbox entry target: ${target.containerPath}`);
    return (
      await this.runMutation({
        args: [
          "read",
          target.mountRootPath,
          path.posix.dirname(relativePath) === "." ? "" : path.posix.dirname(relativePath),
          path.posix.basename(relativePath),
        ],
        signal: params.signal,
      })
    ).stdout;
  }
  async writeFile(params) {
    const target = this.resolveTarget(params);
    await this.ensureRemoteWritable(target, "write files", params.signal);
    const pinned = await this.resolvePinnedParent({
      containerPath: target.containerPath,
      action: "write files",
      requireWritable: true,
      signal: params.signal,
    });
    await this.assertNoHardlinkedFile({
      containerPath: target.containerPath,
      action: "write files",
      signal: params.signal,
    });
    const buffer = Buffer.isBuffer(params.data)
      ? params.data
      : Buffer.from(params.data, params.encoding ?? "utf8");
    await this.runMutation({
      args: [
        "write",
        pinned.mountRootPath,
        pinned.relativeParentPath,
        pinned.basename,
        params.mkdir !== false ? "1" : "0",
      ],
      stdin: buffer,
      signal: params.signal,
    });
  }
  async mkdirp(params) {
    const target = this.resolveTarget(params);
    await this.ensureRemoteWritable(target, "create directories", params.signal);
    const relativePath = path.posix.relative(target.mountRootPath, target.containerPath);
    if (relativePathEscapesContainerRoot(relativePath))
      throw new Error(
        `Sandbox path escapes allowed mounts; cannot create directories: ${target.containerPath}`,
      );
    await this.runMutation({
      args: ["mkdirp", target.mountRootPath, relativePath === "." ? "" : relativePath],
      signal: params.signal,
    });
  }
  async remove(params) {
    const target = this.resolveTarget(params);
    await this.ensureRemoteWritable(target, "remove files", params.signal);
    if (!(await this.remotePathExists(target.containerPath, params.signal))) {
      if (params.force === false)
        throw new Error(`Sandbox path not found; cannot remove files: ${target.containerPath}`);
      return;
    }
    const pinned = await this.resolvePinnedParent({
      containerPath: target.containerPath,
      action: "remove files",
      requireWritable: true,
      allowFinalSymlinkForUnlink: true,
      signal: params.signal,
    });
    await this.runMutation({
      args: [
        "remove",
        pinned.mountRootPath,
        pinned.relativeParentPath,
        pinned.basename,
        params.recursive ? "1" : "0",
        params.force === false ? "0" : "1",
      ],
      signal: params.signal,
      allowFailure: params.force !== false,
    });
  }
  async rename(params) {
    const { from, to } = this.resolveRenameTargets(params);
    await this.ensureRemoteWritable(from, "rename files", params.signal);
    await this.ensureRemoteWritable(to, "rename files", params.signal);
    const fromPinned = await this.resolvePinnedParent({
      containerPath: from.containerPath,
      action: "rename files",
      requireWritable: true,
      allowFinalSymlinkForUnlink: true,
      signal: params.signal,
    });
    const toPinned = await this.resolvePinnedParent({
      containerPath: to.containerPath,
      action: "rename files",
      requireWritable: true,
      signal: params.signal,
    });
    await this.runMutation({
      args: [
        "rename",
        fromPinned.mountRootPath,
        fromPinned.relativeParentPath,
        fromPinned.basename,
        toPinned.mountRootPath,
        toPinned.relativeParentPath,
        toPinned.basename,
        "1",
      ],
      signal: params.signal,
    });
  }
  async stat(params) {
    const target = this.resolveTarget(params);
    if (!(await this.remotePathExists(target.containerPath, params.signal))) return null;
    const canonical = await this.resolveCanonicalPath({
      containerPath: target.containerPath,
      action: "stat files",
      signal: params.signal,
    });
    await this.assertNoHardlinkedFile({
      containerPath: canonical,
      action: "stat files",
      signal: params.signal,
    });
    const [kindRaw = "", sizeRaw = "0", mtimeRaw = "0"] = (
      await this.runRemoteScript({
        script: 'set -eu\nstat -c "%F|%s|%y" -- "$1"',
        args: [canonical],
        signal: params.signal,
      })
    ).stdout
      .toString("utf8")
      .trim()
      .split("|");
    return {
      type: kindRaw === "directory" ? "directory" : kindRaw === "regular file" ? "file" : "other",
      size: parseSandboxStatSize(sizeRaw),
      mtimeMs: parseSandboxStatMtimeMs(mtimeRaw),
    };
  }
  getMounts() {
    const workspaceRoot = path.resolve(this.sandbox.workspaceDir);
    const agentRoot = path.resolve(this.sandbox.agentWorkspaceDir);
    const workspaceContainerRoot = normalizeContainerPath(this.runtime.remoteWorkspaceDir);
    const agentContainerRoot = normalizeContainerPath(this.runtime.remoteAgentWorkspaceDir);
    const mounts = [
      {
        localRoot: workspaceRoot,
        containerRoot: workspaceContainerRoot,
        writable: this.sandbox.workspaceAccess === "rw",
        source: "workspace",
      },
    ];
    if (
      this.sandbox.workspaceAccess !== "none" &&
      path.resolve(this.sandbox.agentWorkspaceDir) !== path.resolve(this.sandbox.workspaceDir)
    )
      mounts.push({
        localRoot: agentRoot,
        containerRoot: agentContainerRoot,
        writable: this.sandbox.workspaceAccess === "rw",
        source: "agent",
      });
    if (this.sandbox.workspaceAccess === "rw")
      mounts.push(
        ...buildRemoteProtectedSkillMounts({
          localRoot: agentRoot,
          skillsWorkspaceDir: this.sandbox.skillsWorkspaceDir,
          workspaceContainerRoot,
          agentContainerRoot,
          includeAgentMount:
            path.resolve(this.sandbox.agentWorkspaceDir) !==
            path.resolve(this.sandbox.workspaceDir),
        }),
      );
    return mounts;
  }
  resolveTarget(params) {
    const workspaceRoot = path.resolve(this.sandbox.workspaceDir);
    const mounts = this.getMounts();
    const input = params.filePath.trim();
    const inputPosix = input.replace(/\\/g, "/");
    const maybeContainerMount = path.posix.isAbsolute(inputPosix)
      ? this.resolveMountByContainerPath(mounts, normalizeContainerPath(inputPosix))
      : null;
    if (maybeContainerMount)
      return this.toResolvedPath({
        mount: maybeContainerMount,
        containerPath: normalizeContainerPath(inputPosix),
      });
    const hostCwd = params.cwd ? path.resolve(params.cwd) : workspaceRoot;
    const hostCandidate = path.isAbsolute(input)
      ? path.resolve(input)
      : path.resolve(hostCwd, input);
    const hostMount = this.resolveMountByLocalPath(mounts, hostCandidate);
    if (hostMount) {
      const relative = toPosixRelative(hostMount.localRoot, hostCandidate);
      return this.toResolvedPath({
        mount: hostMount,
        containerPath: relative
          ? path.posix.join(hostMount.containerRoot, relative)
          : hostMount.containerRoot,
      });
    }
    if (params.cwd) {
      const cwdPosix = params.cwd.replace(/\\/g, "/");
      if (path.posix.isAbsolute(cwdPosix)) {
        const cwdContainer = normalizeContainerPath(cwdPosix);
        const cwdMount = this.resolveMountByContainerPath(mounts, cwdContainer);
        if (cwdMount) {
          const containerPath = normalizeContainerPath(
            path.posix.resolve(cwdContainer, inputPosix),
          );
          const targetMount = this.resolveMountByContainerPath(mounts, containerPath) ?? cwdMount;
          return this.toResolvedPath({
            mount: targetMount,
            containerPath,
          });
        }
      }
    }
    throw new Error(`Sandbox path escapes allowed mounts; cannot access: ${params.filePath}`);
  }
  toResolvedPath(params) {
    const relative = path.posix.relative(params.mount.containerRoot, params.containerPath);
    if (relativePathEscapesContainerRoot(relative))
      throw new Error(
        `Sandbox path escapes allowed mounts; cannot access: ${params.containerPath}`,
      );
    return {
      relativePath:
        params.mount.source === "workspace" || params.mount.source === "protectedSkill"
          ? relative === "."
            ? ""
            : path.posix.relative(this.runtime.remoteWorkspaceDir, params.containerPath)
          : relative === "."
            ? params.mount.containerRoot
            : `${params.mount.containerRoot}/${relative}`,
      containerPath: params.containerPath,
      writable: params.mount.writable,
      mountRootPath: params.mount.containerRoot,
      source: params.mount.source,
    };
  }
  resolveMountByContainerPath(mounts, containerPath) {
    const ordered = [...mounts].toSorted(compareRemoteMountsByContainerPath);
    for (const mount of ordered)
      if (isPathInsideContainerRoot(mount.containerRoot, containerPath)) return mount;
    return null;
  }
  resolveMountByLocalPath(mounts, localPath) {
    const ordered = [...mounts].toSorted(compareRemoteMountsByLocalPath);
    for (const mount of ordered) if (isPathInside(mount.localRoot, localPath)) return mount;
    return null;
  }
  ensureWritable(target, action) {
    if (this.sandbox.workspaceAccess !== "rw" || !target.writable)
      throw new Error(`Sandbox path is read-only; cannot ${action}: ${target.containerPath}`);
  }
  async ensureRemoteWritable(target, action, signal) {
    this.ensureWritable(target, action);
    await this.assertRemoteProtectedPathWritable({
      containerPath: target.containerPath,
      action,
      signal,
    });
  }
  async assertRemoteProtectedPathWritable(params) {
    const protectedRoot = this.findRemoteProtectedSkillRoot(params.containerPath);
    if (protectedRoot && (await this.remotePathExists(protectedRoot, params.signal)))
      throw new Error(
        `Sandbox path is read-only; cannot ${params.action}: ${params.displayPath ?? params.containerPath}`,
      );
  }
  findRemoteProtectedSkillRoot(containerPath) {
    const roots = this.getRemoteProtectedSkillRoots().toSorted((a, b) => b.length - a.length);
    for (const root of roots) if (isPathInsideContainerRoot(root, containerPath)) return root;
    return null;
  }
  getRemoteProtectedSkillRoots() {
    const workspaceContainerRoot = normalizeContainerPath(this.runtime.remoteWorkspaceDir);
    const agentContainerRoot = normalizeContainerPath(this.runtime.remoteAgentWorkspaceDir);
    const roots = [
      path.posix.join(workspaceContainerRoot, "skills"),
      path.posix.join(workspaceContainerRoot, ".agents", "skills"),
      path.posix.join(workspaceContainerRoot, ".openclaw", "sandbox-skills", "skills"),
    ];
    if (path.resolve(this.sandbox.agentWorkspaceDir) !== path.resolve(this.sandbox.workspaceDir))
      roots.push(
        path.posix.join(agentContainerRoot, "skills"),
        path.posix.join(agentContainerRoot, ".agents", "skills"),
        path.posix.join(agentContainerRoot, ".openclaw", "sandbox-skills", "skills"),
      );
    return roots;
  }
  async remotePathExists(containerPath, signal) {
    return (
      (
        await this.runRemoteScript({
          script: 'if [ -e "$1" ] || [ -L "$1" ]; then printf "1\\n"; else printf "0\\n"; fi',
          args: [containerPath],
          signal,
        })
      ).stdout
        .toString("utf8")
        .trim() === "1"
    );
  }
  async resolveCanonicalPath(params) {
    const script = [
      "set -eu",
      'target="$1"',
      'allow_final="$2"',
      'suffix=""',
      'probe="$target"',
      'if [ "$allow_final" = "1" ] && [ -L "$target" ]; then probe=$(dirname -- "$target"); fi',
      'cursor="$probe"',
      'while [ ! -e "$cursor" ] && [ ! -L "$cursor" ]; do',
      '  parent=$(dirname -- "$cursor")',
      '  if [ "$parent" = "$cursor" ]; then break; fi',
      '  base=$(basename -- "$cursor")',
      '  suffix="/$base$suffix"',
      '  cursor="$parent"',
      "done",
      'canonical=$(readlink -f -- "$cursor")',
      'printf "%s%s\\n" "$canonical" "$suffix"',
    ].join("\n");
    const canonical = normalizeContainerPath(
      (
        await this.runRemoteScript({
          script,
          args: [params.containerPath, params.allowFinalSymlinkForUnlink ? "1" : "0"],
          signal: params.signal,
        })
      ).stdout
        .toString("utf8")
        .trim(),
    );
    if (!this.resolveMountByContainerPath(this.getMounts(), canonical))
      throw new Error(
        `Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`,
      );
    return canonical;
  }
  async assertNoHardlinkedFile(params) {
    const output = (
      await this.runRemoteScript({
        script: [
          'if [ ! -e "$1" ] && [ ! -L "$1" ]; then exit 0; fi',
          'stats=$(stat -c "%F|%h" -- "$1")',
          'printf "%s\\n" "$stats"',
        ].join("\n"),
        args: [params.containerPath],
        signal: params.signal,
        allowFailure: true,
      })
    ).stdout
      .toString("utf8")
      .trim();
    if (!output) return;
    const [kind = "", linksRaw = "1"] = output.split("|");
    if (kind === "regular file" && hasMultipleHardlinks(linksRaw))
      throw new Error(
        `Hardlinked path is not allowed under sandbox mount root: ${params.containerPath}`,
      );
  }
  async resolvePinnedParent(params) {
    const basename = path.posix.basename(params.containerPath);
    if (!basename || basename === "." || basename === "/")
      throw new Error(`Invalid sandbox entry target: ${params.containerPath}`);
    const canonicalParent = await this.resolveCanonicalPath({
      containerPath: normalizeContainerPath(path.posix.dirname(params.containerPath)),
      action: params.action,
      allowFinalSymlinkForUnlink: params.allowFinalSymlinkForUnlink,
    });
    const mount = this.resolveMountByContainerPath(this.getMounts(), canonicalParent);
    if (!mount)
      throw new Error(
        `Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`,
      );
    if (params.requireWritable && !mount.writable)
      throw new Error(
        `Sandbox path is read-only; cannot ${params.action}: ${params.containerPath}`,
      );
    if (params.requireWritable)
      await this.assertRemoteProtectedPathWritable({
        containerPath: canonicalParent,
        action: params.action,
        displayPath: params.containerPath,
        signal: params.signal,
      });
    const relativeParentPath = path.posix.relative(mount.containerRoot, canonicalParent);
    if (relativePathEscapesContainerRoot(relativeParentPath))
      throw new Error(
        `Sandbox path escapes allowed mounts; cannot ${params.action}: ${params.containerPath}`,
      );
    return {
      mountRootPath: mount.containerRoot,
      relativeParentPath: relativeParentPath === "." ? "" : relativeParentPath,
      basename,
    };
  }
  async runMutation(params) {
    return await this.runRemoteScript({
      script: [
        "set -eu",
        "python3 /dev/fd/3 \"$@\" 3<<'PY'",
        SANDBOX_PINNED_MUTATION_PYTHON,
        "PY",
      ].join("\n"),
      args: params.args,
      stdin: params.stdin,
      signal: params.signal,
      allowFailure: params.allowFailure,
    });
  }
  async runRemoteScript(params) {
    return await this.runtime.runRemoteShellScript({
      script: params.script,
      args: params.args,
      stdin: params.stdin,
      signal: params.signal,
      allowFailure: params.allowFailure,
    });
  }
};
function buildRemoteProtectedSkillMounts(params) {
  const materializedSkillsWorkspaceDir = path.resolve(
    params.skillsWorkspaceDir ?? resolveMaterializedSandboxSkillsWorkspaceDir(params.localRoot),
  );
  const mounts = [
    {
      localRoot: path.join(params.localRoot, "skills"),
      containerRoot: path.posix.join(params.workspaceContainerRoot, "skills"),
      writable: false,
      source: "protectedSkill",
      allowedRoot: params.localRoot,
    },
    {
      localRoot: path.join(params.localRoot, ".agents", "skills"),
      containerRoot: path.posix.join(params.workspaceContainerRoot, ".agents", "skills"),
      writable: false,
      source: "protectedSkill",
      allowedRoot: params.localRoot,
    },
    {
      localRoot: path.join(materializedSkillsWorkspaceDir, "skills"),
      containerRoot: path.posix.join(
        params.workspaceContainerRoot,
        ".openclaw",
        "sandbox-skills",
        "skills",
      ),
      writable: false,
      source: "protectedSkill",
      allowedRoot: materializedSkillsWorkspaceDir,
    },
  ];
  if (params.includeAgentMount)
    mounts.push(
      {
        localRoot: path.join(params.localRoot, "skills"),
        containerRoot: path.posix.join(params.agentContainerRoot, "skills"),
        writable: false,
        source: "protectedSkill",
        allowedRoot: params.localRoot,
      },
      {
        localRoot: path.join(params.localRoot, ".agents", "skills"),
        containerRoot: path.posix.join(params.agentContainerRoot, ".agents", "skills"),
        writable: false,
        source: "protectedSkill",
        allowedRoot: params.localRoot,
      },
      {
        localRoot: path.join(materializedSkillsWorkspaceDir, "skills"),
        containerRoot: path.posix.join(
          params.agentContainerRoot,
          ".openclaw",
          "sandbox-skills",
          "skills",
        ),
        writable: false,
        source: "protectedSkill",
        allowedRoot: materializedSkillsWorkspaceDir,
      },
    );
  return mounts
    .filter((mount) =>
      isExistingWorkspaceSkillMountSource({
        rootDir: mount.allowedRoot,
        hostPath: mount.localRoot,
      }),
    )
    .map(({ allowedRoot: _allowedRoot, ...mount }) => mount);
}
function compareRemoteMountsByContainerPath(a, b) {
  return b.containerRoot.length - a.containerRoot.length || mountPriority(b) - mountPriority(a);
}
function compareRemoteMountsByLocalPath(a, b) {
  return b.localRoot.length - a.localRoot.length || mountPriority(b) - mountPriority(a);
}
function mountPriority(mount) {
  if (mount.source === "protectedSkill") return 2;
  if (mount.source === "agent") return 1;
  return 0;
}
function normalizeContainerPath(value) {
  const normalized = normalizeContainerPath$1(value.trim() || "/");
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
function toPosixRelative(root, candidate) {
  return path.relative(root, candidate).split(path.sep).filter(Boolean).join(path.posix.sep);
}
//#endregion
//#region src/agents/sandbox/ssh.ts
/**
 * SSH sandbox transport helpers.
 *
 * Materializes temporary SSH config, validates remote shell snippets, runs commands, and uploads workspace trees.
 */
function normalizeInlineSshMaterial(contents, filename) {
  const normalizedEscapedNewlines = contents
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\\r\\n/g, "\\n")
    .replace(/\\r/g, "\\n");
  const expanded =
    filename === "identity" || filename === "certificate.pub"
      ? normalizedEscapedNewlines.replace(/\\n/g, "\n")
      : normalizedEscapedNewlines;
  return expanded.endsWith("\n") ? expanded : `${expanded}\n`;
}
function buildSshFailureMessage(stderr, exitCode) {
  const trimmed = stderr.trim();
  if (
    trimmed.includes("error in libcrypto") &&
    (trimmed.includes('Load key "') || trimmed.includes("Permission denied (publickey)"))
  )
    return `${trimmed}\nSSH sandbox failed to load the configured identity. The private key contents may be malformed (for example CRLF or escaped newlines). Prefer identityFile when possible.`;
  return (
    trimmed ||
    (exitCode !== void 0 ? `ssh exited with code ${exitCode}` : "ssh exited with a non-zero status")
  );
}
/** Single-quote a value for POSIX shell argv construction. */
function shellEscape(value) {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}
/** Build a remote shell command from literal argv entries. */
function buildRemoteCommand(argv) {
  return argv.map((entry) => shellEscape(entry)).join(" ");
}
function assertValidExecRemoteCommand(command) {
  const frames = [
    {
      kind: "root",
      quote: "plain",
      escaping: false,
      parenDepth: 0,
    },
  ];
  const pendingHeredocs = [];
  for (let index = 0; index < command.length; index += 1) {
    const frame = frames.at(-1);
    if (!frame) throw new Error("Malformed SSH/OpenShell exec command: parser state underflow.");
    const char = command.charAt(index);
    if (frame.escaping) {
      frame.escaping = false;
      continue;
    }
    if (frame.quote === "single") {
      if (char === "'") frame.quote = "plain";
      continue;
    }
    if (char === "\\") {
      frame.escaping = true;
      continue;
    }
    if (frame.quote === "double") {
      if (char === '"') {
        frame.quote = "plain";
        continue;
      }
      if (char === "`") {
        frames.push(createExecCommandFrame("backtick"));
        continue;
      }
      if (char === "$" && command[index + 1] === "(" && command[index + 2] === "(") {
        frames.push(createExecCommandFrame("arithmetic", 2));
        index += 2;
        continue;
      }
      if (char === "$" && command[index + 1] === "(") {
        frames.push(createExecCommandFrame("command-substitution", 1));
        index += 1;
      }
      continue;
    }
    if (frame.kind === "arithmetic") {
      if (char === "(") {
        frame.parenDepth += 1;
        continue;
      }
      if (char === ")") {
        frame.parenDepth -= 1;
        if (frame.parenDepth === 0) frames.pop();
      }
      continue;
    }
    if (char === "\n") {
      const frameHeredocs = pendingHeredocs.filter(
        (pending) => pending.frameDepth === frames.length,
      );
      if (frameHeredocs.length > 0) {
        index = skipHeredocBodies(command, index + 1, frameHeredocs) - 1;
        for (const pending of frameHeredocs)
          pendingHeredocs.splice(pendingHeredocs.indexOf(pending), 1);
        continue;
      }
    }
    if (frame.kind === "backtick" && char === "`") {
      frames.pop();
      continue;
    }
    if (char === "'") {
      frame.quote = "single";
      continue;
    }
    if (char === '"') {
      frame.quote = "double";
      continue;
    }
    if (char === "`") {
      frames.push(createExecCommandFrame("backtick"));
      continue;
    }
    if (char === "$" && command[index + 1] === "(" && command[index + 2] === "(") {
      frames.push(createExecCommandFrame("arithmetic", 2));
      index += 2;
      continue;
    }
    if (char === "$" && command[index + 1] === "(") {
      frames.push(createExecCommandFrame("command-substitution", 1));
      index += 1;
      continue;
    }
    if (char === "#" && isShellCommentStart(command, index)) {
      index = skipShellComment(command, index) - 1;
      continue;
    }
    if (char === "<") {
      const heredoc = readHeredoc(command, index);
      if (heredoc) {
        pendingHeredocs.push({
          ...heredoc.pending,
          frameDepth: frames.length,
        });
        index = heredoc.endIndex - 1;
        continue;
      }
      const placeholder = readPlaceholderToken(command, index);
      if (placeholder)
        throw new Error(
          `Malformed SSH/OpenShell exec command: unresolved placeholder token ${placeholder}.`,
        );
    }
    if (frame.kind === "command-substitution") {
      if (char === "(") {
        frame.parenDepth += 1;
        continue;
      }
      if (char === ")") {
        frame.parenDepth -= 1;
        if (frame.parenDepth === 0) frames.pop();
      }
    }
  }
  if (frames.at(-1)?.escaping)
    throw new Error("Malformed SSH/OpenShell exec command: trailing backslash escape.");
  if (pendingHeredocs.length > 0) {
    const pending = pendingHeredocs.at(0);
    if (!pending) throw new Error("Malformed SSH/OpenShell exec command: parser state underflow.");
    throw new Error(
      `Malformed SSH/OpenShell exec command: unterminated here-doc ${pending.delimiter}.`,
    );
  }
  for (const frame of frames.toReversed()) {
    if (frame.quote === "single")
      throw new Error("Malformed SSH/OpenShell exec command: unclosed single quote.");
    if (frame.quote === "double")
      throw new Error("Malformed SSH/OpenShell exec command: unclosed double quote.");
    if (frame.kind === "backtick")
      throw new Error(
        "Malformed SSH/OpenShell exec command: unterminated backtick command substitution.",
      );
    if (frame.kind === "command-substitution")
      throw new Error("Malformed SSH/OpenShell exec command: unterminated command substitution.");
    if (frame.kind === "arithmetic")
      throw new Error("Malformed SSH/OpenShell exec command: unterminated arithmetic expansion.");
  }
}
/** Build the wrapped remote `/bin/sh -c` command for sandbox exec. */
function buildExecRemoteCommand(params) {
  const body = params.workdir
    ? `cd ${shellEscape(params.workdir)} && ${params.command}`
    : params.command;
  return buildRemoteCommand(
    Object.keys(params.env).length > 0
      ? [
          "env",
          ...Object.entries(params.env).map(([key, value]) => `${key}=${value}`),
          "/bin/sh",
          "-c",
          body,
        ]
      : ["/bin/sh", "-c", body],
  );
}
/** Validate and build a remote exec command for untrusted model input. */
function buildValidatedExecRemoteCommand(params) {
  assertValidExecRemoteCommand(params.command);
  return buildExecRemoteCommand(params);
}
const VALIDATE_REMOTE_WORKDIR_SCRIPT = [
  "set -e",
  'target="$1"',
  'root="$2"',
  'case "$target" in /*) ;; *) echo "remote directory must be absolute: $target" >&2; exit 1 ;; esac',
  'case "$root" in /*) ;; *) echo "remote root must be absolute: $root" >&2; exit 1 ;; esac',
  'target="${target%/}"',
  'root="${root%/}"',
  '[ -n "$target" ] || target="/"',
  '[ -n "$root" ] || root="/"',
  'if [ "$root" != "/" ]; then',
  '  case "$target/" in "$root"/*|"$root/") ;; *) echo "remote directory must stay under root: $target" >&2; exit 1 ;; esac',
  "fi",
  'for path_to_check in "$target" "$root"; do',
  '  relative="${path_to_check#/}"',
  '  while [ -n "$relative" ]; do',
  '    part="${relative%%/*}"',
  '    if [ "$part" = "$relative" ]; then relative=""; else relative="${relative#*/}"; fi',
  '    [ -n "$part" ] || continue',
  '    case "$part" in "."|"..") echo "unsafe remote directory component: $part" >&2; exit 1 ;; esac',
  "  done",
  "done",
  'if [ -L "$root" ]; then echo "unsafe remote root symlink: $root" >&2; exit 1; fi',
  'if [ ! -d "$root" ]; then echo "remote root not found: $root" >&2; exit 1; fi',
  'canonical_root="$(cd "$root" && pwd -P)"',
  'relative="${target#"$root"}"',
  'relative="${relative#/}"',
  'current="$canonical_root"',
  'while [ -n "$relative" ]; do',
  '  part="${relative%%/*}"',
  '  if [ "$part" = "$relative" ]; then relative=""; else relative="${relative#*/}"; fi',
  '  [ -n "$part" ] || continue',
  '  if [ "$current" = "/" ]; then next="/$part"; else next="$current/$part"; fi',
  '  if [ -L "$next" ]; then echo "unsafe remote directory symlink: $next" >&2; exit 1; fi',
  '  if [ ! -d "$next" ]; then echo "remote directory not found: $next" >&2; exit 1; fi',
  '  current="$next"',
  "done",
  'printf "%s\\n" "$current"',
].join("\n");
function buildRemoteWorkdirValidationCommand(params) {
  return buildRemoteCommand([
    "/bin/sh",
    "-c",
    VALIDATE_REMOTE_WORKDIR_SCRIPT,
    "openclaw-validate-workdir",
    params.workdir,
    params.root,
  ]);
}
function createExecCommandFrame(kind, parenDepth = 0) {
  return {
    kind,
    quote: "plain",
    escaping: false,
    parenDepth,
  };
}
function readPlaceholderToken(command, index) {
  const match = /^<[A-Za-z][A-Za-z0-9_-]*>/.exec(command.slice(index));
  if (!match) return null;
  if (command[index - 1] === "=") return match[0];
  if (isLikelyGeneratedWorkflowPlaceholder(command, index)) return match[0];
  const next = command[index + match[0].length];
  if (next === void 0 || /[\r\n;&|)]/.test(next)) return match[0];
  if (next === " " || next === "	")
    return hasRedirectionTargetAfter(command, index + match[0].length) ? null : match[0];
  return null;
}
function hasRedirectionTargetAfter(command, index) {
  let cursor = index;
  while (command.charAt(cursor) === " " || command.charAt(cursor) === "	") cursor += 1;
  const next = command.charAt(cursor);
  return next !== "" && !/[;&|()<>\r\n]/.test(next);
}
function isLikelyGeneratedWorkflowPlaceholder(command, index) {
  const prefix = command.slice(0, index);
  const segmentStart =
    Math.max(
      prefix.lastIndexOf("\n"),
      prefix.lastIndexOf(";"),
      prefix.lastIndexOf("&"),
      prefix.lastIndexOf("|"),
      prefix.lastIndexOf("("),
      prefix.lastIndexOf("`"),
    ) + 1;
  const currentCommand = prefix.slice(segmentStart).trim();
  return /^workflow(?:\s+[A-Za-z0-9._/-]+)*$/.test(currentCommand);
}
function readHeredoc(command, index) {
  if (command[index + 1] !== "<" || command[index + 2] === "<") return null;
  let cursor = index + 2;
  const stripLeadingTabs = command[cursor] === "-";
  if (stripLeadingTabs) cursor += 1;
  while (command[cursor] === " " || command[cursor] === "	") cursor += 1;
  const delimiter = readHeredocDelimiter(command, cursor);
  if (!delimiter)
    throw new Error("Malformed SSH/OpenShell exec command: missing here-doc delimiter.");
  return {
    pending: {
      delimiter: delimiter.value,
      stripLeadingTabs,
    },
    endIndex: delimiter.endIndex,
  };
}
function readHeredocDelimiter(command, index) {
  let cursor = index;
  let delimiter = "";
  let quote = "plain";
  let escaping = false;
  while (cursor < command.length) {
    const char = command[cursor];
    if (escaping) {
      delimiter += char;
      escaping = false;
      cursor += 1;
      continue;
    }
    if (quote === "single") {
      if (char === "'") quote = "plain";
      else delimiter += char;
      cursor += 1;
      continue;
    }
    if (quote === "double") {
      if (char === '"') quote = "plain";
      else if (char === "\\") escaping = true;
      else delimiter += char;
      cursor += 1;
      continue;
    }
    if (char === "\\") {
      escaping = true;
      cursor += 1;
      continue;
    }
    if (char === "'") {
      quote = "single";
      cursor += 1;
      continue;
    }
    if (char === '"') {
      quote = "double";
      cursor += 1;
      continue;
    }
    if (isHeredocDelimiterTerminator(char)) break;
    delimiter += char;
    cursor += 1;
  }
  if (quote !== "plain" || escaping)
    throw new Error("Malformed SSH/OpenShell exec command: unterminated here-doc delimiter.");
  return delimiter
    ? {
        value: delimiter,
        endIndex: cursor,
      }
    : null;
}
function isHeredocDelimiterTerminator(char) {
  return char === void 0 || /\s/.test(char) || [";", "&", "|", "(", ")", "<", ">"].includes(char);
}
function skipHeredocBodies(command, index, pendingHeredocs) {
  let cursor = index;
  for (const pending of pendingHeredocs) {
    let found = false;
    while (cursor <= command.length) {
      const lineEnd = command.indexOf("\n", cursor);
      const endIndex = lineEnd === -1 ? command.length : lineEnd;
      const rawLine = command.slice(cursor, endIndex);
      const normalizedLine = rawLine.endsWith("\r") ? rawLine.slice(0, -1) : rawLine;
      const line = pending.stripLeadingTabs ? normalizedLine.replace(/^\t+/, "") : normalizedLine;
      cursor = lineEnd === -1 ? command.length : lineEnd + 1;
      if (line === pending.delimiter) {
        found = true;
        break;
      }
      if (lineEnd === -1) break;
    }
    if (!found)
      throw new Error(
        `Malformed SSH/OpenShell exec command: unterminated here-doc ${pending.delimiter}.`,
      );
  }
  return cursor;
}
function isShellCommentStart(command, index) {
  const previous = command[index - 1];
  return previous === void 0 || /[\s;&|()]/.test(previous);
}
function skipShellComment(command, index) {
  const newlineIndex = command.indexOf("\n", index);
  return newlineIndex === -1 ? command.length : newlineIndex;
}
/** Build the local ssh argv for a prepared sandbox session. */
function buildSshSandboxArgv(params) {
  return [
    params.session.command,
    "-F",
    params.session.configPath,
    ...(params.tty
      ? ["-tt", "-o", "RequestTTY=force", "-o", "SetEnv=TERM=xterm-256color"]
      : ["-T", "-o", "RequestTTY=no"]),
    params.session.host,
    params.remoteCommand,
  ];
}
/** Create a temporary SSH session from already-rendered ssh config text. */
async function createSshSandboxSessionFromConfigText(params) {
  const host = params.host?.trim() || parseSshConfigHost(params.configText);
  if (!host) throw new Error("Failed to parse SSH config output.");
  const configDir = await fs.mkdtemp(path.join(resolveSshTmpRoot(), "openclaw-sandbox-ssh-"));
  const configPath = path.join(configDir, "config");
  await fs.writeFile(configPath, params.configText, {
    encoding: "utf8",
    mode: 384,
  });
  await fs.chmod(configPath, 384);
  return {
    command: params.command?.trim() || "ssh",
    configPath,
    host,
  };
}
/** Create a temporary SSH session from structured sandbox SSH settings. */
async function createSshSandboxSessionFromSettings(settings) {
  const parsed = parseSshTarget(settings.target);
  if (!parsed) throw new Error(`Invalid sandbox SSH target: ${settings.target}`);
  const configDir = await fs.mkdtemp(path.join(resolveSshTmpRoot(), "openclaw-sandbox-ssh-"));
  try {
    const materializedIdentity = settings.identityData
      ? await writeSecretMaterial(configDir, "identity", settings.identityData)
      : void 0;
    const materializedCertificate = settings.certificateData
      ? await writeSecretMaterial(configDir, "certificate.pub", settings.certificateData)
      : void 0;
    const materializedKnownHosts = settings.knownHostsData
      ? await writeSecretMaterial(configDir, "known_hosts", settings.knownHostsData)
      : void 0;
    const identityFile = materializedIdentity ?? resolveOptionalLocalPath(settings.identityFile);
    const certificateFile =
      materializedCertificate ?? resolveOptionalLocalPath(settings.certificateFile);
    const knownHostsFile =
      materializedKnownHosts ?? resolveOptionalLocalPath(settings.knownHostsFile);
    const hostAlias = "openclaw-sandbox";
    const configPath = path.join(configDir, "config");
    const lines = [
      `Host ${hostAlias}`,
      `  HostName ${parsed.host}`,
      `  Port ${parsed.port}`,
      "  BatchMode yes",
      "  ConnectTimeout 5",
      "  ServerAliveInterval 15",
      "  ServerAliveCountMax 3",
      `  StrictHostKeyChecking ${settings.strictHostKeyChecking ? "yes" : "no"}`,
      `  UpdateHostKeys ${settings.updateHostKeys ? "yes" : "no"}`,
    ];
    if (parsed.user) lines.push(`  User ${parsed.user}`);
    if (knownHostsFile) lines.push(`  UserKnownHostsFile ${knownHostsFile}`);
    else if (!settings.strictHostKeyChecking) lines.push("  UserKnownHostsFile /dev/null");
    if (identityFile) lines.push(`  IdentityFile ${identityFile}`);
    if (certificateFile) lines.push(`  CertificateFile ${certificateFile}`);
    if (identityFile || certificateFile) lines.push("  IdentitiesOnly yes");
    await fs.writeFile(configPath, `${lines.join("\n")}\n`, {
      encoding: "utf8",
      mode: 384,
    });
    await fs.chmod(configPath, 384);
    return {
      command: settings.command.trim() || "ssh",
      configPath,
      host: hostAlias,
    };
  } catch (error) {
    await fs.rm(configDir, {
      recursive: true,
      force: true,
    });
    throw error;
  }
}
/** Remove temporary SSH config and materialized secret files. */
async function disposeSshSandboxSession(session) {
  await fs.rm(path.dirname(session.configPath), {
    recursive: true,
    force: true,
  });
}
/** Run a remote command through ssh and return buffered stdout/stderr. */
async function runSshSandboxCommand(params) {
  const [executable, ...args] = buildSshSandboxArgv({
    session: params.session,
    remoteCommand: params.remoteCommand,
    tty: params.tty,
  });
  if (!executable) throw new Error("SSH command argv is empty");
  const sshEnv = sanitizeEnvVars(process.env).allowed;
  const result = await spawnCommand([executable, ...args], {
    baseEnv: sshEnv,
    cancelSignal: params.signal,
    encoding: "buffer",
    input: params.stdin ?? Buffer.alloc(0),
    maxBuffer: SANDBOX_COMMAND_MAX_BUFFER_BYTES,
    reject: false,
    stripFinalNewline: false,
  });
  if (params.signal?.aborted || result.isCanceled) throw createAbortError("Aborted");
  if (result.failed && !isPlainCommandExitFailure(result))
    throw toErrorObject(result, "SSH command execution failed");
  const stdout = Buffer.from(result.stdout);
  const stderr = Buffer.from(result.stderr);
  const exitCode = result.exitCode ?? (result.failed ? 1 : 0);
  if (exitCode !== 0 && !params.allowFailure)
    throw Object.assign(new Error(buildSshFailureMessage(stderr.toString("utf8"), exitCode)), {
      code: exitCode,
      stdout,
      stderr,
    });
  return {
    stdout,
    stderr,
    code: exitCode,
  };
}
const ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT = [
  "set -e",
  'target="$1"',
  'root="${2:-$1}"',
  'case "$target" in /*) ;; *) echo "remote directory must be absolute: $target" >&2; exit 1 ;; esac',
  'case "$root" in /*) ;; *) echo "remote root must be absolute: $root" >&2; exit 1 ;; esac',
  'target="${target%/}"',
  'root="${root%/}"',
  '[ -n "$target" ] || target="/"',
  '[ -n "$root" ] || root="/"',
  'case "$target/" in "$root"/*|"$root/") ;; *) echo "remote directory must stay under root: $target" >&2; exit 1 ;; esac',
  'for path_to_check in "$target" "$root"; do',
  '  relative="${path_to_check#/}"',
  '  while [ -n "$relative" ]; do',
  '    part="${relative%%/*}"',
  '    if [ "$part" = "$relative" ]; then relative=""; else relative="${relative#*/}"; fi',
  '    [ -n "$part" ] || continue',
  '    case "$part" in "."|"..") echo "unsafe remote directory component: $part" >&2; exit 1 ;; esac',
  "  done",
  "done",
  'if [ -L "$root" ]; then echo "unsafe remote root symlink: $root" >&2; exit 1; fi',
  'mkdir -p -- "$root"',
  'canonical_root="$(cd "$root" && pwd -P)"',
  'relative="${target#"$root"}"',
  'relative="${relative#/}"',
  'current="$canonical_root"',
  'while [ -n "$relative" ]; do',
  '  part="${relative%%/*}"',
  '  if [ "$part" = "$relative" ]; then relative=""; else relative="${relative#*/}"; fi',
  '  [ -n "$part" ] || continue',
  '  if [ "$current" = "/" ]; then next="/$part"; else next="$current/$part"; fi',
  '  if [ -L "$next" ]; then echo "unsafe remote directory symlink: $next" >&2; exit 1; fi',
  '  if [ -e "$next" ]; then',
  '    if [ ! -d "$next" ]; then echo "unsafe remote directory component: $next" >&2; exit 1; fi',
  "  else",
  '    mkdir -- "$next"',
  "  fi",
  '  current="$next"',
  "done",
].join("\n");
/** Stream a local directory to the remote sandbox with tar over ssh. */
async function uploadDirectoryToSshTarget(params) {
  await assertSafeUploadSymlinks(params.localDir);
  const remoteCommand = buildRemoteCommand([
    "/bin/sh",
    "-c",
    `${ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT}\ntar -xf - -C "$1"`,
    "openclaw-sandbox-upload",
    params.remoteDir,
    params.remoteRootDir ?? params.remoteDir,
  ]);
  const [sshExecutable, ...sshArgs] = buildSshSandboxArgv({
    session: params.session,
    remoteCommand,
  });
  if (!sshExecutable) throw new Error("SSH command argv is empty");
  const sshEnv = sanitizeEnvVars(process.env).allowed;
  await new Promise((resolve, reject) => {
    const tar = spawn("tar", ["-C", params.localDir, "-cf", "-", "."], {
      stdio: ["ignore", "pipe", "pipe"],
      signal: params.signal,
    });
    const ssh = spawn(sshExecutable, sshArgs, {
      stdio: ["pipe", "pipe", "pipe"],
      env: sshEnv,
      signal: params.signal,
    });
    const tarStderr = [];
    const sshStdout = [];
    const sshStderr = [];
    let tarClosed = false;
    let sshClosed = false;
    let tarCode = 0;
    let sshCode = 0;
    let settled = false;
    const fail = (error) => {
      if (settled) return;
      settled = true;
      for (const child of [tar, ssh])
        try {
          child.kill("SIGKILL");
        } catch {}
      reject(toErrorObject(error, "Non-Error rejection"));
    };
    tar.stderr.on("data", (chunk) => tarStderr.push(Buffer.from(chunk)));
    tar.stderr.on("error", fail);
    tar.stdout.on("error", fail);
    ssh.stdout.on("data", (chunk) => sshStdout.push(Buffer.from(chunk)));
    ssh.stdout.on("error", fail);
    ssh.stderr.on("data", (chunk) => sshStderr.push(Buffer.from(chunk)));
    ssh.stderr.on("error", fail);
    ssh.stdin?.on("error", fail);
    tar.on("error", fail);
    ssh.on("error", fail);
    tar.on("close", (code) => {
      tarClosed = true;
      tarCode = code ?? 0;
      maybeResolve();
    });
    ssh.on("close", (code) => {
      sshClosed = true;
      sshCode = code ?? 0;
      maybeResolve();
    });
    function maybeResolve() {
      if (settled || !tarClosed || !sshClosed) return;
      settled = true;
      if (tarCode !== 0) {
        reject(
          new Error(
            Buffer.concat(tarStderr).toString("utf8").trim() || `tar exited with code ${tarCode}`,
          ),
        );
        return;
      }
      if (sshCode !== 0) {
        reject(
          new Error(
            Buffer.concat(sshStderr).toString("utf8").trim() || `ssh exited with code ${sshCode}`,
          ),
        );
        return;
      }
      resolve();
    }
    try {
      tar.stdout.pipe(ssh.stdin);
    } catch (error) {
      fail(error);
    }
  });
}
async function assertSafeUploadSymlinks(localDir) {
  const rootDir = path.resolve(localDir);
  await walkDirectory(rootDir);
  async function walkDirectory(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isSymbolicLink()) {
        try {
          await resolveRootPath({
            absolutePath: entryPath,
            rootPath: rootDir,
            boundaryLabel: "SSH sandbox upload tree",
          });
        } catch (error) {
          const relativePath = path.relative(rootDir, entryPath).split(path.sep).join("/");
          throw new Error(
            `SSH sandbox upload refuses symlink escaping the workspace: ${relativePath}`,
            { cause: error },
          );
        }
        continue;
      }
      if (entry.isDirectory()) await walkDirectory(entryPath);
    }
  }
}
function parseSshConfigHost(configText) {
  return configText.match(/^\s*Host\s+(\S+)/m)?.[1]?.trim() || null;
}
function resolveSshTmpRoot() {
  return path.resolve(resolvePreferredOpenClawTmpDir() ?? os.tmpdir());
}
function resolveOptionalLocalPath(value) {
  const trimmed = value?.trim();
  return trimmed ? resolveUserPath(trimmed) : void 0;
}
async function writeSecretMaterial(dir, filename, contents) {
  const pathname = path.join(dir, filename);
  await fs.writeFile(pathname, normalizeInlineSshMaterial(contents, filename), {
    encoding: "utf8",
    mode: 384,
  });
  await fs.chmod(pathname, 384);
  return pathname;
}
//#endregion
//#region src/agents/sandbox/ssh-backend.ts
/**
 * SSH sandbox backend implementation.
 *
 * Creates remote workspace copies, builds remote exec specs, and exposes a backend-neutral filesystem bridge.
 */
/** SSH backend lifecycle hooks for probing and removing remote sandbox copies. */
const sshSandboxBackendManager = {
  async describeRuntime({ entry, config, agentId }) {
    const cfg = resolveSandboxConfigForAgent(config, agentId);
    if (cfg.backend !== "ssh" || !cfg.ssh.target)
      return {
        running: false,
        actualConfigLabel: cfg.ssh.target,
        configLabelMatch: false,
      };
    const runtimePaths = resolveSshRuntimePaths(cfg.ssh.workspaceRoot, entry.sessionKey);
    const session = await createSshSandboxSessionFromSettings({
      ...cfg.ssh,
      target: cfg.ssh.target,
    });
    try {
      return {
        running:
          (
            await runSshSandboxCommand({
              session,
              remoteCommand: buildRemoteCommand([
                "/bin/sh",
                "-c",
                'if [ -d "$1" ]; then printf "1\\n"; else printf "0\\n"; fi',
                "openclaw-sandbox-check",
                runtimePaths.runtimeRootDir,
              ]),
            })
          ).stdout
            .toString("utf8")
            .trim() === "1",
        actualConfigLabel: cfg.ssh.target,
        configLabelMatch: entry.image === cfg.ssh.target,
      };
    } finally {
      await disposeSshSandboxSession(session);
    }
  },
  async removeRuntime({ entry, config, agentId }) {
    const cfg = resolveSandboxConfigForAgent(config, agentId);
    if (cfg.backend !== "ssh" || !cfg.ssh.target) return;
    const runtimePaths = resolveSshRuntimePaths(cfg.ssh.workspaceRoot, entry.sessionKey);
    const session = await createSshSandboxSessionFromSettings({
      ...cfg.ssh,
      target: cfg.ssh.target,
    });
    try {
      await runSshSandboxCommand({
        session,
        remoteCommand: buildRemoteCommand([
          "/bin/sh",
          "-c",
          'rm -rf -- "$1"',
          "openclaw-sandbox-remove",
          runtimePaths.runtimeRootDir,
        ]),
        allowFailure: true,
      });
    } finally {
      await disposeSshSandboxSession(session);
    }
  },
};
/** Create an SSH sandbox backend that mirrors the workspace to a remote target. */
async function createSshSandboxBackend(params) {
  if ((params.cfg.docker.binds?.length ?? 0) > 0)
    throw new Error("SSH sandbox backend does not support sandbox.docker.binds.");
  const target = params.cfg.ssh.target;
  if (!target)
    throw new Error('Sandbox backend "ssh" requires agents.defaults.sandbox.ssh.target.');
  return new SshSandboxBackendImpl({
    createParams: params,
    target,
    runtimePaths: resolveSshRuntimePaths(params.cfg.ssh.workspaceRoot, params.scopeKey),
  }).asHandle();
}
var SshSandboxBackendImpl = class {
  constructor(params) {
    this.params = params;
    this.ensurePromise = null;
    this.refreshedSkillsForNextExecWorkdir = null;
  }
  asHandle() {
    return {
      id: "ssh",
      runtimeId: this.params.runtimePaths.runtimeId,
      runtimeLabel: this.params.runtimePaths.runtimeId,
      workdir: this.params.runtimePaths.remoteWorkspaceDir,
      env: this.params.createParams.cfg.docker.env,
      configLabel: this.params.target,
      configLabelKind: "Target",
      workdirValidation: "backend",
      validateWorkdir: async (workdir) => await this.validateWorkdir(workdir),
      discardPreparedWorkdir: (workdir) => this.discardPreparedWorkdir(workdir),
      workdirRoots: [
        this.params.runtimePaths.remoteWorkspaceDir,
        this.params.runtimePaths.remoteAgentWorkspaceDir,
      ],
      remoteWorkspaceDir: this.params.runtimePaths.remoteWorkspaceDir,
      remoteAgentWorkspaceDir: this.params.runtimePaths.remoteAgentWorkspaceDir,
      buildExecSpec: async ({ command, workdir, env, usePty }) => {
        const remoteWorkdir = workdir ?? this.params.runtimePaths.remoteWorkspaceDir;
        const remoteCommand = buildValidatedExecRemoteCommand({
          command,
          workdir: remoteWorkdir,
          env,
        });
        await this.ensureRuntime();
        const sshSession = await this.createSession();
        try {
          if (!this.consumeRefreshedSkillsForNextExec(remoteWorkdir))
            await this.refreshRemoteSkillsWorkspace(sshSession);
          return {
            argv: buildSshSandboxArgv({
              session: sshSession,
              remoteCommand,
              tty: usePty,
            }),
            env: sanitizeEnvVars(process.env).allowed,
            stdinMode: "pipe-open",
            finalizeToken: { sshSession },
          };
        } catch (error) {
          await disposeSshSandboxSession(sshSession);
          throw error;
        }
      },
      finalizeExec: async ({ token }) => {
        const sshSession = token?.sshSession;
        if (sshSession) await disposeSshSandboxSession(sshSession);
      },
      runShellCommand: async (command) => await this.runRemoteShellScript(command),
      createFsBridge: ({ sandbox }) =>
        createRemoteShellSandboxFsBridge({
          sandbox,
          runtime: this.asHandle(),
        }),
      runRemoteShellScript: async (command) => await this.runRemoteShellScript(command),
    };
  }
  async createSession() {
    return await createSshSandboxSessionFromSettings({
      ...this.params.createParams.cfg.ssh,
      target: this.params.target,
    });
  }
  async ensureRuntime() {
    if (this.ensurePromise) return await this.ensurePromise;
    this.ensurePromise = this.ensureRuntimeInner();
    try {
      await this.ensurePromise;
    } catch (error) {
      this.ensurePromise = null;
      throw error;
    }
  }
  async ensureRuntimeInner() {
    const session = await this.createSession();
    try {
      if (
        (
          await runSshSandboxCommand({
            session,
            remoteCommand: buildRemoteCommand([
              "/bin/sh",
              "-c",
              'if [ -d "$1" ]; then printf "1\\n"; else printf "0\\n"; fi',
              "openclaw-sandbox-check",
              this.params.runtimePaths.runtimeRootDir,
            ]),
          })
        ).stdout
          .toString("utf8")
          .trim() === "1"
      )
        return;
      await this.replaceRemoteDirectoryFromLocal(
        session,
        this.params.createParams.workspaceDir,
        this.params.runtimePaths.remoteWorkspaceDir,
      );
      if (
        this.params.createParams.cfg.workspaceAccess !== "none" &&
        path.resolve(this.params.createParams.agentWorkspaceDir) !==
          path.resolve(this.params.createParams.workspaceDir)
      )
        await this.replaceRemoteDirectoryFromLocal(
          session,
          this.params.createParams.agentWorkspaceDir,
          this.params.runtimePaths.remoteAgentWorkspaceDir,
        );
    } finally {
      await disposeSshSandboxSession(session);
    }
  }
  async validateWorkdir(workdir) {
    await this.ensureRuntime();
    const session = await this.createSession();
    let refreshedSkillsForWorkdir = null;
    try {
      if (isRemotePathInsideRoot(this.params.runtimePaths.remoteSkillsWorkspaceDir, workdir)) {
        await this.refreshRemoteSkillsWorkspace(session);
        refreshedSkillsForWorkdir = workdir;
        this.refreshedSkillsForNextExecWorkdir = workdir;
      }
      const result = await runSshSandboxCommand({
        session,
        remoteCommand: buildRemoteWorkdirValidationCommand({
          workdir,
          root: this.resolveWorkdirValidationRoot(workdir),
        }),
        allowFailure: true,
      });
      const resolvedWorkdir = result.code === 0 ? result.stdout.toString("utf8").trim() : "";
      if (refreshedSkillsForWorkdir)
        this.refreshedSkillsForNextExecWorkdir = resolvedWorkdir || null;
      return resolvedWorkdir || null;
    } catch (error) {
      if (
        refreshedSkillsForWorkdir &&
        this.refreshedSkillsForNextExecWorkdir === refreshedSkillsForWorkdir
      )
        this.refreshedSkillsForNextExecWorkdir = null;
      throw error;
    } finally {
      await disposeSshSandboxSession(session);
    }
  }
  discardPreparedWorkdir(workdir) {
    if (this.refreshedSkillsForNextExecWorkdir === workdir)
      this.refreshedSkillsForNextExecWorkdir = null;
  }
  consumeRefreshedSkillsForNextExec(workdir) {
    if (this.refreshedSkillsForNextExecWorkdir !== workdir) {
      this.refreshedSkillsForNextExecWorkdir = null;
      return false;
    }
    this.refreshedSkillsForNextExecWorkdir = null;
    return true;
  }
  resolveWorkdirValidationRoot(workdir) {
    return (
      [
        this.params.runtimePaths.remoteAgentWorkspaceDir,
        this.params.runtimePaths.remoteWorkspaceDir,
      ].find((root) => isRemotePathInsideRoot(root, workdir)) ??
      this.params.runtimePaths.remoteWorkspaceDir
    );
  }
  async refreshRemoteSkillsWorkspace(session) {
    if (
      this.params.createParams.cfg.workspaceAccess !== "rw" ||
      !this.params.createParams.skillsWorkspaceDir
    )
      return;
    await this.clearRemoteDirectory(session, this.params.runtimePaths.remoteSkillsWorkspaceDir);
    if (!(await isExistingDirectory(this.params.createParams.skillsWorkspaceDir))) return;
    await uploadDirectoryToSshTarget({
      session,
      localDir: this.params.createParams.skillsWorkspaceDir,
      remoteDir: this.params.runtimePaths.remoteSkillsWorkspaceDir,
      remoteRootDir: this.params.runtimePaths.runtimeRootDir,
    });
  }
  async clearRemoteDirectory(session, remoteDir) {
    await runSshSandboxCommand({
      session,
      remoteCommand: buildRemoteCommand([
        "/bin/sh",
        "-c",
        `${ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT}\nfind "$1" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +`,
        "openclaw-sandbox-clear",
        remoteDir,
        this.params.runtimePaths.runtimeRootDir,
      ]),
    });
  }
  async replaceRemoteDirectoryFromLocal(session, localDir, remoteDir) {
    await this.clearRemoteDirectory(session, remoteDir);
    await uploadDirectoryToSshTarget({
      session,
      localDir,
      remoteDir,
      remoteRootDir: this.params.runtimePaths.runtimeRootDir,
    });
  }
  async runRemoteShellScript(params) {
    await this.ensureRuntime();
    const session = await this.createSession();
    try {
      await this.refreshRemoteSkillsWorkspace(session);
      return await runSshSandboxCommand({
        session,
        remoteCommand: buildRemoteCommand([
          "/bin/sh",
          "-c",
          params.script,
          "openclaw-sandbox-fs",
          ...(params.args ?? []),
        ]),
        stdin: params.stdin,
        allowFailure: params.allowFailure,
        signal: params.signal,
      });
    } finally {
      await disposeSshSandboxSession(session);
    }
  }
};
async function isExistingDirectory(dir) {
  try {
    return (await fs.stat(dir)).isDirectory();
  } catch {
    return false;
  }
}
function normalizeRemotePath(input) {
  const normalized = path.posix.normalize(input.replace(/\\/g, "/"));
  return normalized === "/" ? normalized : normalized.replace(/\/+$/g, "");
}
function isRemotePathInsideRoot(root, candidate) {
  const normalizedRoot = normalizeRemotePath(root);
  const normalizedCandidate = normalizeRemotePath(candidate);
  return (
    normalizedCandidate === normalizedRoot ||
    (normalizedRoot === "/"
      ? normalizedCandidate.startsWith("/")
      : normalizedCandidate.startsWith(`${normalizedRoot}/`))
  );
}
function resolveSshRuntimePaths(workspaceRoot, scopeKey) {
  const runtimeId = buildSshSandboxRuntimeId(scopeKey);
  const runtimeRootDir = path.posix.join(workspaceRoot, runtimeId);
  return {
    runtimeId,
    runtimeRootDir,
    remoteWorkspaceDir: path.posix.join(runtimeRootDir, "workspace"),
    remoteAgentWorkspaceDir: path.posix.join(runtimeRootDir, "agent"),
    remoteSkillsWorkspaceDir: path.posix.join(
      runtimeRootDir,
      "workspace",
      ".openclaw",
      "sandbox-skills",
    ),
  };
}
function buildSshSandboxRuntimeId(scopeKey) {
  const trimmed = scopeKey.trim() || "session";
  const safe = normalizeLowercaseStringOrEmpty(trimmed)
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  const hash = Array.from(trimmed).reduce(
    (acc, char) => ((acc * 33) ^ char.charCodeAt(0)) >>> 0,
    5381,
  );
  return `openclaw-ssh-${safe || "session"}-${hash.toString(16).slice(0, 8)}`;
}
//#endregion
//#region src/agents/sandbox/backend.ts
/**
 * Sandbox backend registry.
 *
 * Stores process-wide backend factories so core and plugins can register Docker, SSH, or custom sandbox providers.
 */
const SANDBOX_BACKEND_FACTORIES_STATE_KEY = Symbol.for("openclaw.sandboxBackendFactories");
function getSandboxBackendFactories() {
  const globalStore = globalThis;
  globalStore[SANDBOX_BACKEND_FACTORIES_STATE_KEY] ??= /* @__PURE__ */ new Map();
  return globalStore[SANDBOX_BACKEND_FACTORIES_STATE_KEY];
}
function normalizeSandboxBackendId(id) {
  const normalized = normalizeOptionalLowercaseString(id);
  if (!normalized) throw new Error("Sandbox backend id must not be empty.");
  return normalized;
}
/** Register or replace a sandbox backend and return a restore callback. */
function registerSandboxBackend(id, registration) {
  const normalizedId = normalizeSandboxBackendId(id);
  const resolved = typeof registration === "function" ? { factory: registration } : registration;
  const factories = getSandboxBackendFactories();
  const previous = factories.get(normalizedId);
  factories.set(normalizedId, resolved);
  return () => {
    const currentFactories = getSandboxBackendFactories();
    if (previous) {
      currentFactories.set(normalizedId, previous);
      return;
    }
    currentFactories.delete(normalizedId);
  };
}
/** Look up a sandbox backend factory by normalized backend id. */
function getSandboxBackendFactory(id) {
  return getSandboxBackendFactories().get(normalizeSandboxBackendId(id))?.factory ?? null;
}
/** Look up optional lifecycle management hooks for a registered backend. */
function getSandboxBackendManager(id) {
  return getSandboxBackendFactories().get(normalizeSandboxBackendId(id))?.manager ?? null;
}
/** Look up optional backend workdir resolution that does not start the runtime. */
function getSandboxBackendWorkdirResolver(id) {
  return getSandboxBackendFactories().get(normalizeSandboxBackendId(id))?.resolveWorkdir ?? null;
}
/** Resolve a backend factory or throw the user-facing configuration error. */
function requireSandboxBackendFactory(id) {
  const factory = getSandboxBackendFactory(id);
  if (factory) return factory;
  throw new Error(
    [
      `Sandbox backend "${id}" is not registered.`,
      "Load the plugin that provides it, or set agents.defaults.sandbox.backend=docker.",
    ].join("\n"),
  );
}
registerSandboxBackend("docker", {
  factory: createDockerSandboxBackend,
  manager: dockerSandboxBackendManager,
  resolveWorkdir: ({ cfg }) => cfg.docker.workdir,
});
registerSandboxBackend("ssh", {
  factory: createSshSandboxBackend,
  manager: sshSandboxBackendManager,
  resolveWorkdir: ({ cfg, scopeKey }) =>
    resolveSshRuntimePaths(cfg.ssh.workspaceRoot, scopeKey).remoteWorkspaceDir,
});
//#endregion
//#region src/plugin-sdk/browser-bridge.ts
function loadFacadeModule() {
  return loadActivatedBundledPluginPublicSurfaceModuleSync({
    dirName: "browser",
    artifactBasename: "runtime-api.js",
  });
}
/** Starts the browser bridge runtime from the activated browser plugin facade. */
async function startBrowserBridgeServer(params) {
  return await loadFacadeModule().startBrowserBridgeServer(params);
}
/** Stops a browser bridge server previously returned by startBrowserBridgeServer. */
async function stopBrowserBridgeServer(server) {
  await loadFacadeModule().stopBrowserBridgeServer(server);
}
//#endregion
//#region src/agents/sandbox/browser-bridges.ts
/**
 * In-process browser bridge registry keyed by sandbox session.
 *
 * The prune path uses this table to stop bridge servers when backing containers expire.
 */
const BROWSER_BRIDGES = /* @__PURE__ */ new Map();
/** Stop and remove only the cached bridge instance the caller inspected. */
async function stopCachedBrowserBridge(sessionKey, expected) {
  if (BROWSER_BRIDGES.get(sessionKey) !== expected) return;
  await stopBrowserBridgeServer(expected.bridge.server);
  if (BROWSER_BRIDGES.get(sessionKey) === expected) BROWSER_BRIDGES.delete(sessionKey);
}
/** Drain every cached bridge that still owns one sandbox container. */
async function stopCachedBrowserBridgesForContainer(containerName) {
  for (;;) {
    const match = [...BROWSER_BRIDGES].find(([, cached]) => cached.containerName === containerName);
    if (!match) return;
    await stopCachedBrowserBridge(match[0], match[1]);
  }
}
//#endregion
export {
  buildPinnedWritePlan as A,
  parseSandboxStatSize as C,
  buildPinnedMkdirpPlan as D,
  resolveWritableRenameTargetsForBridge as E,
  runDockerSandboxShellCommand as M,
  buildPinnedRemovePlan as O,
  parseSandboxStatMtimeMs as S,
  resolveWritableRenameTargets as T,
  disposeSshSandboxSession as _,
  getSandboxBackendFactory as a,
  uploadDirectoryToSshTarget as b,
  registerSandboxBackend as c,
  buildRemoteCommand as d,
  buildRemoteWorkdirValidationCommand as f,
  createSshSandboxSessionFromSettings as g,
  createSshSandboxSessionFromConfigText as h,
  startBrowserBridgeServer as i,
  dockerSandboxBackendManager as j,
  buildPinnedRenamePlan as k,
  requireSandboxBackendFactory as l,
  buildValidatedExecRemoteCommand as m,
  stopCachedBrowserBridge as n,
  getSandboxBackendManager as o,
  buildSshSandboxArgv as p,
  stopCachedBrowserBridgesForContainer as r,
  getSandboxBackendWorkdirResolver as s,
  BROWSER_BRIDGES as t,
  buildExecRemoteCommand as u,
  runSshSandboxCommand as v,
  createWritableRenameTargetResolver as w,
  createRemoteShellSandboxFsBridge as x,
  shellEscape as y,
};
