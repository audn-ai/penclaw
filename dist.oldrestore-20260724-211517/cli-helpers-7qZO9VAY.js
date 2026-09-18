import { randomUUID } from "node:crypto";
import fs from "node:fs";
import * as path$1 from "node:path";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { a as asRecord } from "./record-coerce-DHZ4bFlT.js";
import { p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/canvas/src/cli-helpers.ts
/**
 * Shared Canvas CLI helpers for snapshot payload parsing and temp paths.
 */
function normalizeCanvasSnapshotFormat(value) {
  const format = value?.trim().toLowerCase() ?? "";
  if (format === "png" || format === "jpg" || format === "jpeg") return format;
  return null;
}
/** Normalizes Canvas snapshot output extensions, mapping jpeg to jpg. */
function normalizeCanvasSnapshotFileExtension(value) {
  const format = normalizeCanvasSnapshotFormat(value.startsWith(".") ? value.slice(1) : value);
  if (!format) throw new Error("invalid canvas.snapshot format");
  return format === "jpeg" ? "jpg" : format;
}
/** Parses the node.invoke canvas.snapshot payload shape. */
function parseCanvasSnapshotPayload(value) {
  const obj = asRecord(value);
  const format = normalizeCanvasSnapshotFormat(readStringValue(obj.format));
  const base64 = readStringValue(obj.base64);
  if (!format || !base64) throw new Error("invalid canvas.snapshot payload");
  return {
    format,
    base64,
  };
}
function resolveCliName() {
  return "openclaw";
}
function resolveCanvasSnapshotId(id) {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error("invalid canvas snapshot id");
  return id;
}
function resolveTempPathParts(opts) {
  const tmpDir = opts.tmpDir ?? resolvePreferredOpenClawTmpDir();
  if (!opts.tmpDir)
    fs.mkdirSync(tmpDir, {
      recursive: true,
      mode: 448,
    });
  return {
    tmpDir,
    id: resolveCanvasSnapshotId(opts.id ?? randomUUID()),
    ext: `.${normalizeCanvasSnapshotFileExtension(opts.ext)}`,
  };
}
/** Builds a safe temp path for a Canvas snapshot output file. */
function canvasSnapshotTempPath(opts) {
  const { tmpDir, id, ext } = resolveTempPathParts(opts);
  const cliName = resolveCliName();
  return path$1.join(tmpDir, `${cliName}-canvas-snapshot-${id}${ext}`);
}
//#endregion
export {
  normalizeCanvasSnapshotFileExtension as n,
  parseCanvasSnapshotPayload as r,
  canvasSnapshotTempPath as t,
};
