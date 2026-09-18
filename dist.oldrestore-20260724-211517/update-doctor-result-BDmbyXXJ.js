import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region src/infra/update-doctor-result.ts
const UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV =
  "OPENCLAW_UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH";
const UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE = 86;
const UPDATE_POST_INSTALL_DOCTOR_RESULT_FILENAME_RE =
  /^openclaw-update-doctor-\d+-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.json$/iu;
const PACKAGE_POST_INSTALL_DOCTOR_ADVISORY = {
  kind: "package-post-install-doctor",
  message:
    "Post-install doctor reported a recoverable update-time repair warning after the package install was verified; continuing with post-core plugin convergence.",
};
function createUpdatePostInstallDoctorResultPath() {
  return path.join(
    resolvePreferredOpenClawTmpDir(),
    `openclaw-update-doctor-${process.pid}-${randomUUID()}.json`,
  );
}
function resolveSafeUpdatePostInstallDoctorResultPath(resultPath) {
  const tempRoot = path.resolve(resolvePreferredOpenClawTmpDir());
  const resolvedPath = path.resolve(resultPath);
  if (
    path.dirname(resolvedPath) !== tempRoot ||
    !UPDATE_POST_INSTALL_DOCTOR_RESULT_FILENAME_RE.test(path.basename(resolvedPath))
  )
    throw new Error("Unsafe post-install doctor result path");
  return resolvedPath;
}
function createDeferredConfiguredPluginRepairDoctorResult(details) {
  return {
    status: "advisory",
    advisory: {
      ...PACKAGE_POST_INSTALL_DOCTOR_ADVISORY,
      reason: "deferred-configured-plugin-repair",
      details: details.filter((line) => line.trim()),
    },
  };
}
async function writeUpdatePostInstallDoctorResult(params) {
  const resultPath = resolveSafeUpdatePostInstallDoctorResultPath(params.resultPath);
  await fs.writeFile(resultPath, `${JSON.stringify(params.result)}\n`, {
    encoding: "utf8",
    mode: 384,
    flag: "wx",
  });
}
async function consumeUpdatePostInstallDoctorResult(resultPath) {
  let safeResultPath;
  try {
    safeResultPath = resolveSafeUpdatePostInstallDoctorResultPath(resultPath);
  } catch {
    return null;
  }
  try {
    const raw = await fs.readFile(safeResultPath, "utf8");
    return parseUpdatePostInstallDoctorResult(JSON.parse(raw));
  } catch {
    return null;
  } finally {
    await fs.rm(safeResultPath, { force: true }).catch(() => {});
  }
}
function parseUpdatePostInstallDoctorResult(value) {
  if (!value || typeof value !== "object") return null;
  const record = value;
  if (record.status !== "advisory") return null;
  const advisory = record.advisory;
  if (!advisory || typeof advisory !== "object") return null;
  const advisoryRecord = advisory;
  const details = advisoryRecord.details;
  if (
    advisoryRecord.kind !== "package-post-install-doctor" ||
    advisoryRecord.reason !== "deferred-configured-plugin-repair" ||
    typeof advisoryRecord.message !== "string" ||
    !Array.isArray(details) ||
    details.length === 0 ||
    !details.every((entry) => typeof entry === "string" && entry.trim().length > 0)
  )
    return null;
  return {
    status: "advisory",
    advisory: {
      kind: "package-post-install-doctor",
      reason: "deferred-configured-plugin-repair",
      message: PACKAGE_POST_INSTALL_DOCTOR_ADVISORY.message,
      details,
    },
  };
}
//#endregion
export {
  createDeferredConfiguredPluginRepairDoctorResult as a,
  consumeUpdatePostInstallDoctorResult as i,
  UPDATE_POST_INSTALL_DOCTOR_ADVISORY_EXIT_CODE as n,
  createUpdatePostInstallDoctorResultPath as o,
  UPDATE_POST_INSTALL_DOCTOR_RESULT_PATH_ENV as r,
  writeUpdatePostInstallDoctorResult as s,
  PACKAGE_POST_INSTALL_DOCTOR_ADVISORY as t,
};
