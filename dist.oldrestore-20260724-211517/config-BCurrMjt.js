import crypto from "node:crypto";
import fs from "node:fs/promises";
import "./json-files-CTWRDHag.js";
import path from "node:path";
import { l as writeJson } from "./json-7OTJmMaB.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
//#region src/node-host/config.ts
/** Configuration defaults and env parsing for the node-host runner. */
const NODE_HOST_FILE = "node.json";
function resolveNodeHostConfigPath() {
  return path.join(resolveStateDir(), NODE_HOST_FILE);
}
function normalizeConfig(config) {
  const base = {
    version: 1,
    nodeId: "",
    displayName: config?.displayName,
    gateway: config?.gateway,
  };
  if (config?.version === 1 && typeof config.nodeId === "string")
    base.nodeId = config.nodeId.trim();
  if (!base.nodeId) base.nodeId = crypto.randomUUID();
  return base;
}
/** Load and normalize the node-host config, or null when no readable config exists. */
async function loadNodeHostConfig() {
  const filePath = resolveNodeHostConfigPath();
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return normalizeConfig(JSON.parse(raw));
  } catch {
    return null;
  }
}
/** Save node-host config with private file permissions. */
async function saveNodeHostConfig(config) {
  await writeJson(resolveNodeHostConfigPath(), config, { mode: 384 });
}
/** Load or create a node-host config with a stable generated node id. */
async function ensureNodeHostConfig() {
  const normalized = normalizeConfig(await loadNodeHostConfig());
  await saveNodeHostConfig(normalized);
  return normalized;
}
//#endregion
export { loadNodeHostConfig as n, saveNodeHostConfig as r, ensureNodeHostConfig as t };
