import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "dotenv";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { parse as parse$1 } from "yaml";
import { v as pathExists } from "./fs-safe-RNq3oO57.js";
import {
  d as markMigrationItemSkipped,
  t as MIGRATION_REASON_MISSING_SOURCE_OR_TARGET,
  u as markMigrationItemError,
} from "./migration-nGWjmzKy.js";
import { o as isRecord$1 } from "./record-coerce-DHZ4bFlT.js";
import { t as appendRegularFile } from "./regular-file-CuvhUtZS.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/migrate-hermes/helpers.ts
const HOME_SHORTHAND_RE = /^~(?=$|[\\/])/u;
const UNSAFE_NAME_CHARS_RE = /[^a-z0-9._-]+/g;
const EDGE_DASHES_RE = /^-+|-+$/g;
function resolveHomePath(input) {
  const value = input.trim();
  return value ? path.resolve(value.replace(HOME_SHORTHAND_RE, os.homedir())) : value;
}
async function exists(filePath) {
  return await pathExists(filePath);
}
async function isDirectory(dirPath) {
  return (await fs.stat(dirPath).catch(() => void 0))?.isDirectory() === true;
}
function sanitizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replaceAll(UNSAFE_NAME_CHARS_RE, "-")
    .replaceAll(EDGE_DASHES_RE, "");
}
async function readText(filePath) {
  return filePath ? await fs.readFile(filePath, "utf8").catch(() => void 0) : void 0;
}
function parseEnv(content) {
  return content ? parse(content) : {};
}
function parseHermesConfig(content) {
  if (!content) return {};
  const parsed = parse$1(content);
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}
const isRecord = isRecord$1;
function childRecord(root, key) {
  const value = root?.[key];
  return isRecord(value) ? value : {};
}
const readString = normalizeOptionalString;
function readStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((entry) => typeof entry === "string" && entry.trim() !== "");
}
async function appendItem(item) {
  if (!item.source || !item.target)
    return markMigrationItemError(item, MIGRATION_REASON_MISSING_SOURCE_OR_TARGET);
  try {
    const content = await fs.readFile(item.source, "utf8");
    const header = `\n\n<!-- Imported from Hermes: ${path.basename(item.source)} -->\n\n`;
    const body = content.trimEnd();
    if (!body) return markMigrationItemSkipped(item, "source file is empty");
    const importBlock = `${header}${body}\n`;
    if ((await fs.readFile(item.target, "utf8").catch(() => "")).includes(importBlock))
      return markMigrationItemSkipped(item, "already imported from Hermes");
    await fs.mkdir(path.dirname(item.target), { recursive: true });
    await appendRegularFile({
      filePath: item.target,
      content: importBlock,
      rejectSymlinkParents: true,
    });
    return {
      ...item,
      status: "migrated",
    };
  } catch (err) {
    return markMigrationItemError(item, err instanceof Error ? err.message : String(err));
  }
}
//#endregion
export {
  isRecord as a,
  readString as c,
  resolveHomePath as d,
  sanitizeName as f,
  isDirectory as i,
  readStringArray as l,
  childRecord as n,
  parseEnv as o,
  exists as r,
  parseHermesConfig as s,
  appendItem as t,
  readText as u,
};
