import { randomUUID } from "node:crypto";
import { chmod, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import "./temp-path-DYqJUh96.js";
import "./process-runtime-BKNTr1ic.js";
import path from "node:path";
import { n as runExec } from "./exec-CXKmx4dL.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/logbook/src/node-host.ts
function readParams(value) {
  if (!value || typeof value !== "object") return {};
  const record = value;
  const num = (key) => {
    const candidate = record[key];
    return typeof candidate === "number" && Number.isFinite(candidate) ? candidate : void 0;
  };
  return {
    screenIndex: num("screenIndex"),
    maxWidth: num("maxWidth"),
    quality: num("quality"),
  };
}
async function handleLogbookSnapshot(rawParams) {
  if (process.platform !== "darwin")
    return { error: `logbook.snapshot is not supported on ${process.platform}` };
  const params = readParams(rawParams);
  const screenIndex = Math.max(0, Math.round(params.screenIndex ?? 0));
  const maxWidth = params.maxWidth && params.maxWidth >= 480 ? Math.round(params.maxWidth) : 1440;
  const qualityPct = Math.min(
    100,
    Math.max(
      10,
      Math.round(
        (params.quality && params.quality > 0 && params.quality <= 1 ? params.quality : 0.6) * 100,
      ),
    ),
  );
  const captureDir = path.join(resolvePreferredOpenClawTmpDir(), "logbook");
  await mkdir(captureDir, {
    recursive: true,
    mode: 448,
  });
  await chmod(captureDir, 448);
  const filePath = path.join(captureDir, `logbook-snapshot-${randomUUID()}.jpg`);
  try {
    await writeFile(filePath, "", { mode: 384 });
    await runExec(
      "screencapture",
      ["-x", "-C", "-D", String(screenIndex + 1), "-t", "jpg", filePath],
      { logOutput: false },
    );
    await runExec(
      "sips",
      [
        "--resampleHeightWidthMax",
        String(maxWidth),
        "-s",
        "format",
        "jpeg",
        "-s",
        "formatOptions",
        String(qualityPct),
        filePath,
      ],
      { logOutput: false },
    );
    return {
      format: "jpeg",
      base64: (await readFile(filePath)).toString("base64"),
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  } finally {
    await rm(filePath, { force: true });
  }
}
//#endregion
export { handleLogbookSnapshot };
