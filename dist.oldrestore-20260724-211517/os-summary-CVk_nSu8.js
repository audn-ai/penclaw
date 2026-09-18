import { spawnSync } from "node:child_process";
import os from "node:os";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region src/infra/os-summary.ts
const cachedOsSummaryByKey = /* @__PURE__ */ new Map();
const cachedRuntimeOsLabelByKey = /* @__PURE__ */ new Map();
/**
 * Resolve Darwin product version via sw_vers.
 *
 * Darwin kernel version and macOS product version are no longer in sync starting
 * with macOS 26 (Tahoe), where Darwin 25.x maps to macOS 26.x instead of the
 * historical Darwin N → macOS N+9 formula. Prefer sw_vers over os.release() on
 * macOS to avoid stale mappings.
 */
function resolveDarwinProductVersion() {
  return (
    (normalizeOptionalString(
      spawnSync("sw_vers", ["-productVersion"], { encoding: "utf-8" }).stdout,
    ) ??
      "") ||
    os.release()
  );
}
/**
 * Resolves the OS string used in agent runtime prompt metadata, without the
 * architecture suffix. The prompt renderer appends `arch` separately. Off
 * Darwin this preserves the historical `${os.type()} ${os.release()}` shape.
 */
function resolveRuntimeOsLabel() {
  const platform = os.platform();
  const release = os.release();
  const cacheKey = `${platform}\0${release}\0${os.arch()}`;
  const cached = cachedRuntimeOsLabelByKey.get(cacheKey);
  if (cached !== void 0) return cached;
  const label =
    platform === "darwin" ? `macOS ${resolveDarwinProductVersion()}` : `${os.type()} ${release}`;
  cachedRuntimeOsLabelByKey.set(cacheKey, label);
  return label;
}
/** Resolves a compact OS label for diagnostics, logs, and environment summaries. */
function resolveOsSummary() {
  const platform = os.platform();
  const rawRelease = os.release();
  const arch = os.arch();
  const cacheKey = `${platform}\0${rawRelease}\0${arch}`;
  const cached = cachedOsSummaryByKey.get(cacheKey);
  if (cached) return cached;
  const release = rawRelease;
  const summary = {
    platform,
    arch,
    release,
    label: (() => {
      if (platform === "darwin") return `macos ${resolveDarwinProductVersion()} (${arch})`;
      if (platform === "win32") return `windows ${release} (${arch})`;
      return `${platform} ${release} (${arch})`;
    })(),
  };
  cachedOsSummaryByKey.set(cacheKey, summary);
  return summary;
}
//#endregion
export { resolveRuntimeOsLabel as n, resolveOsSummary as t };
