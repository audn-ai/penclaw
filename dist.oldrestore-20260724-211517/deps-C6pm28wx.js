import fs from "node:fs";
import { createRequire } from "node:module";
import "./error-runtime-BIAwr399.js";
import "./process-runtime-BKNTr1ic.js";
import path from "node:path";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
//#region extensions/matrix/src/matrix/deps.ts
const REQUIRED_MATRIX_PACKAGES = [
  "matrix-js-sdk",
  "@matrix-org/matrix-sdk-crypto-nodejs",
  "@matrix-org/matrix-sdk-crypto-wasm",
];
const MIN_MATRIX_CRYPTO_NATIVE_BINDING_BYTES = 1e6;
const MATRIX_COMMAND_OUTPUT_TAIL_BYTES = 64 * 1024;
function resolveMissingMatrixPackages(resolveFn) {
  const resolve = resolveFn ?? defaultResolveFn;
  return REQUIRED_MATRIX_PACKAGES.filter((pkg) => {
    try {
      resolve(pkg);
      return false;
    } catch {
      return true;
    }
  });
}
function isMatrixSdkAvailable() {
  return resolveMissingMatrixPackages().length === 0;
}
function buildMatrixDepsMissingMessage(missing) {
  return [
    `Matrix plugin dependencies are missing: ${missing.join(", ")}.`,
    "Repair this plugin with `openclaw plugins update matrix` or run `openclaw doctor --fix`.",
  ].join(" ");
}
let defaultMatrixCryptoRuntimeEnsurePromise = null;
async function runFixedCommandWithTimeout(params) {
  if (!params.argv[0])
    return {
      code: 1,
      stdout: "",
      stderr: "command is required",
    };
  try {
    const result = await runCommandWithTimeout(params.argv, {
      cwd: params.cwd,
      env: params.env,
      killProcessTree: true,
      maxOutputBytes: MATRIX_COMMAND_OUTPUT_TAIL_BYTES,
      outputCapture: "tail",
      timeoutMs: params.timeoutMs,
    });
    return {
      code: result.termination === "timeout" ? 124 : (result.code ?? 1),
      stdout: result.stdout,
      stderr:
        result.stderr ||
        (result.termination === "timeout" ? `command timed out after ${params.timeoutMs}ms` : ""),
    };
  } catch (error) {
    return {
      code: 1,
      stdout: "",
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
}
function defaultRequireFn(id) {
  return createRequire(import.meta.url)(id);
}
function defaultResolveFn(id) {
  return createRequire(import.meta.url).resolve(id);
}
function isMissingMatrixCryptoRuntimeError(error) {
  const message = formatErrorMessage(error);
  return (
    message.includes("@matrix-org/matrix-sdk-crypto-nodejs-") ||
    message.includes("matrix-sdk-crypto-nodejs") ||
    message.includes("download-lib.js")
  );
}
function isMuslRuntime() {
  try {
    return !process.report?.getReport?.()?.header?.glibcVersionRuntime;
  } catch {
    return true;
  }
}
function resolveMatrixCryptoNativeBindingFilename() {
  switch (process.platform) {
    case "darwin":
      return process.arch === "arm64"
        ? "matrix-sdk-crypto.darwin-arm64.node"
        : process.arch === "x64"
          ? "matrix-sdk-crypto.darwin-x64.node"
          : null;
    case "linux":
      if (process.arch === "x64")
        return isMuslRuntime()
          ? "matrix-sdk-crypto.linux-x64-musl.node"
          : "matrix-sdk-crypto.linux-x64-gnu.node";
      if (process.arch === "arm64" && !isMuslRuntime())
        return "matrix-sdk-crypto.linux-arm64-gnu.node";
      if (process.arch === "arm") return "matrix-sdk-crypto.linux-arm-gnueabihf.node";
      if (process.arch === "s390x") return "matrix-sdk-crypto.linux-s390x-gnu.node";
      return null;
    case "win32":
      return process.arch === "x64"
        ? "matrix-sdk-crypto.win32-x64-msvc.node"
        : process.arch === "ia32"
          ? "matrix-sdk-crypto.win32-ia32-msvc.node"
          : process.arch === "arm64"
            ? "matrix-sdk-crypto.win32-arm64-msvc.node"
            : null;
    default:
      return null;
  }
}
function resolveMatrixCryptoNativeBindingPath(resolveFn) {
  const filename = resolveMatrixCryptoNativeBindingFilename();
  if (!filename) return null;
  try {
    return path.join(
      path.dirname(resolveFn("@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js")),
      filename,
    );
  } catch {
    return null;
  }
}
function removeIncompleteMatrixCryptoNativeBinding(params) {
  const bindingPath = params.bindingPath;
  if (!bindingPath) return;
  try {
    const stat = fs.statSync(bindingPath);
    if (!stat.isFile() || stat.size >= MIN_MATRIX_CRYPTO_NATIVE_BINDING_BYTES) return;
    fs.unlinkSync(bindingPath);
    params.log?.(
      `matrix: removed incomplete native crypto runtime (${stat.size} bytes); it will be downloaded again`,
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
async function ensureMatrixCryptoRuntime(params = {}) {
  const usesDefaultRuntime = !params.requireFn && !params.resolveFn;
  if (usesDefaultRuntime && defaultMatrixCryptoRuntimeEnsurePromise) {
    await defaultMatrixCryptoRuntimeEnsurePromise;
    return;
  }
  const ensurePromise = ensureMatrixCryptoRuntimeOnce(params);
  if (!usesDefaultRuntime) {
    await ensurePromise;
    return;
  }
  defaultMatrixCryptoRuntimeEnsurePromise = ensurePromise.catch((error) => {
    defaultMatrixCryptoRuntimeEnsurePromise = null;
    throw error;
  });
  await defaultMatrixCryptoRuntimeEnsurePromise;
}
async function ensureMatrixCryptoRuntimeOnce(params) {
  const resolveFn = params.resolveFn ?? defaultResolveFn;
  const nativeBindingPath = resolveMatrixCryptoNativeBindingPath(resolveFn);
  removeIncompleteMatrixCryptoNativeBinding({
    bindingPath: nativeBindingPath,
    log: params.log,
  });
  const requireFn = params.requireFn ?? defaultRequireFn;
  try {
    requireFn("@matrix-org/matrix-sdk-crypto-nodejs");
    return;
  } catch (err) {
    if (!isMissingMatrixCryptoRuntimeError(err)) throw err;
  }
  const scriptPath = resolveFn("@matrix-org/matrix-sdk-crypto-nodejs/download-lib.js");
  params.log?.("matrix: bootstrapping native crypto runtime");
  const result = await runFixedCommandWithTimeout({
    argv: [process.execPath, scriptPath],
    cwd: path.dirname(scriptPath),
    timeoutMs: 3e5,
    env: { COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
  });
  if (result.code !== 0) {
    removeIncompleteMatrixCryptoNativeBinding({
      bindingPath: nativeBindingPath,
      log: params.log,
    });
    throw new Error(
      result.stderr.trim() || result.stdout.trim() || "Matrix crypto runtime bootstrap failed.",
    );
  }
  removeIncompleteMatrixCryptoNativeBinding({
    bindingPath: nativeBindingPath,
    log: params.log,
  });
  requireFn("@matrix-org/matrix-sdk-crypto-nodejs");
}
async function ensureMatrixSdkInstalled(params) {
  const missing = resolveMissingMatrixPackages(params?.resolveFn);
  if (missing.length === 0) return;
  throw new Error(buildMatrixDepsMissingMessage(missing));
}
//#endregion
export { ensureMatrixSdkInstalled as n, isMatrixSdkAvailable as r, ensureMatrixCryptoRuntime as t };
