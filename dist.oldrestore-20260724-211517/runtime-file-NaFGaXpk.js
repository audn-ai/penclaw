import fs from "node:fs/promises";
import path from "node:path";
import {
  a as resolveTrajectoryPointerFilePath,
  i as resolveTrajectoryFilePath,
  o as safeTrajectorySessionFileName,
} from "./paths-Bo64bnX2.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
//#region src/trajectory/runtime-file.ts
async function isRegularNonSymlinkFile(filePath) {
  try {
    const linkStat = await fs.lstat(filePath);
    if (linkStat.isSymbolicLink() || !linkStat.isFile()) return false;
    const stat = await fs.stat(filePath);
    return stat.isFile() && stat.dev === linkStat.dev && stat.ino === linkStat.ino;
  } catch {
    return false;
  }
}
async function readRuntimePointerFile(sessionFile, sessionId) {
  const pointerPath = resolveTrajectoryPointerFilePath(sessionFile);
  if (!(await isRegularNonSymlinkFile(pointerPath))) return;
  try {
    const parsed = JSON.parse(await fs.readFile(pointerPath, "utf8"));
    if (!isRecord(parsed)) return;
    if (parsed.sessionId !== sessionId || typeof parsed.runtimeFile !== "string") return;
    const runtimeFile = path.resolve(parsed.runtimeFile);
    const safeRuntimeFileName = `${safeTrajectorySessionFileName(sessionId)}.jsonl`;
    if (
      runtimeFile !==
        path.resolve(
          resolveTrajectoryFilePath({
            env: {},
            sessionFile,
            sessionId,
          }),
        ) &&
      path.basename(runtimeFile) !== safeRuntimeFileName
    )
      return;
    return runtimeFile;
  } catch {
    return;
  }
}
async function resolveTrajectoryRuntimeFile(params) {
  if (params.runtimeFile) return params.runtimeFile;
  const candidates = [
    await readRuntimePointerFile(params.sessionFile, params.sessionId),
    resolveTrajectoryFilePath({
      env: {},
      sessionFile: params.sessionFile,
      sessionId: params.sessionId,
    }),
    resolveTrajectoryFilePath({
      sessionFile: params.sessionFile,
      sessionId: params.sessionId,
    }),
  ].filter((candidate) => Boolean(candidate));
  for (const candidate of candidates)
    if (await isRegularNonSymlinkFile(candidate)) return candidate;
}
//#endregion
export { resolveTrajectoryRuntimeFile as n, isRegularNonSymlinkFile as t };
