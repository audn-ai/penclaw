import crypto from "node:crypto";
import path from "node:path";
//#region src/fleet/cell-profile.ts
const DEFAULT_FLEET_IMAGE = "ghcr.io/openclaw/openclaw:latest";
const FLEET_BASE_PORT = 19100;
const FLEET_GATEWAY_PORT = 18789;
const FLEET_CONTAINER_HOME = "/home/node";
const FLEET_CONTAINER_STATE_DIR = "/home/node/.openclaw";
const FLEET_CONTAINER_AUTH_SECRET_DIR = "/home/node/.config/openclaw";
const FLEET_TENANT_LABEL = "openclaw.fleet.tenant";
const FLEET_OWNER_LABEL = "openclaw.fleet.owner";
const FLEET_ATTEMPT_LABEL = "openclaw.fleet.attempt";
const FLEET_ENV_KEYS_LABEL = "openclaw.fleet.env-keys";
const FLEET_DISK_LIMIT_LABEL = "openclaw.fleet.disk-limit";
const FLEET_MANAGED_ENV_KEYS = [
  "HOME",
  "OPENCLAW_HOME",
  "OPENCLAW_STATE_DIR",
  "OPENCLAW_CONFIG_PATH",
  "OPENCLAW_WORKSPACE_DIR",
  "OPENCLAW_GATEWAY_TOKEN",
];
const FLEET_TENANT_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;
const ENV_KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
const MAX_TCP_PORT = 65535;
const RESERVED_ENV_KEYS = new Set(FLEET_MANAGED_ENV_KEYS);
function hasInvalidEnvironmentFileValue(value) {
  return value.includes("\n") || value.includes("\r") || value.includes("\0");
}
function validateTenantId(tenantId) {
  if (!FLEET_TENANT_PATTERN.test(tenantId))
    throw new Error(
      "Invalid tenant id. Use 1-40 lowercase letters, digits, or hyphens; start and end with a letter or digit.",
    );
  return tenantId;
}
function validateFleetImage(image) {
  const normalized = image.trim();
  if (!normalized) throw new Error("Fleet container image must not be empty.");
  if (normalized.startsWith("-")) throw new Error("Fleet container image must not begin with '-'.");
  return normalized;
}
function validateDiskSize(value) {
  const normalized = value.trim();
  const numeric = Number.parseFloat(normalized);
  if (
    !/^[0-9]+(?:\.[0-9]+)?(?:b|k|kb|m|mb|g|gb|t|tb)?$/iu.test(normalized) ||
    !Number.isFinite(numeric) ||
    numeric <= 0
  )
    throw new Error("--disk must be a positive size such as 10g, 512m, or 1024.");
  return normalized;
}
function validateHostPort(port) {
  if (!Number.isInteger(port) || port < 1 || port > MAX_TCP_PORT)
    throw new Error("Host port must be an integer from 1 to 65535.");
  return port;
}
function allocateHostPort(usedPorts, requestedPort) {
  const used = new Set(usedPorts);
  if (requestedPort !== void 0) {
    const port = validateHostPort(requestedPort);
    if (used.has(port))
      throw new Error(`Host port ${port} is already allocated to another fleet cell.`);
    return port;
  }
  for (let port = FLEET_BASE_PORT; port <= MAX_TCP_PORT; port += 1)
    if (!used.has(port)) return port;
  throw new Error(`No free fleet host ports remain from ${FLEET_BASE_PORT} to ${MAX_TCP_PORT}.`);
}
function parseEnvAssignments(values) {
  const environment = {};
  for (const assignment of values) {
    const separator = assignment.indexOf("=");
    if (separator <= 0) throw new Error("Invalid --env value; expected KEY=VAL.");
    const key = assignment.slice(0, separator);
    if (!ENV_KEY_PATTERN.test(key))
      throw new Error("Invalid --env key; use letters, digits, and underscores.");
    if (RESERVED_ENV_KEYS.has(key))
      throw new Error(`--env cannot override fleet-managed variable ${key}.`);
    environment[key] = assignment.slice(separator + 1);
  }
  return environment;
}
function buildCellEnvironment(token, userEnv) {
  if (hasInvalidEnvironmentFileValue(token))
    throw new Error("Gateway token must not contain line breaks or null bytes.");
  for (const key of Object.keys(userEnv)) {
    if (!ENV_KEY_PATTERN.test(key)) throw new Error(`Invalid cell environment key: ${key}`);
    if (RESERVED_ENV_KEYS.has(key))
      throw new Error(`Cell environment cannot override fleet-managed variable ${key}.`);
    if (hasInvalidEnvironmentFileValue(userEnv[key] ?? ""))
      throw new Error(`Cell environment value for ${key} must be one line.`);
  }
  return {
    HOME: FLEET_CONTAINER_HOME,
    OPENCLAW_HOME: FLEET_CONTAINER_HOME,
    OPENCLAW_STATE_DIR: FLEET_CONTAINER_STATE_DIR,
    OPENCLAW_CONFIG_PATH: `${FLEET_CONTAINER_STATE_DIR}/openclaw.json`,
    OPENCLAW_WORKSPACE_DIR: `${FLEET_CONTAINER_STATE_DIR}/workspace`,
    OPENCLAW_GATEWAY_TOKEN: token,
    ...userEnv,
  };
}
function cellContainerName(tenantId) {
  return `openclaw-cell-${validateTenantId(tenantId)}`;
}
function cellNetworkName(tenantId) {
  return `${cellContainerName(tenantId)}-net`;
}
function cellDataDir(stateDir, tenantId) {
  return path.join(stateDir, "fleet", "cells", validateTenantId(tenantId));
}
function cellAuthSecretDir(stateDir, tenantId) {
  return path.join(stateDir, "fleet", "auth-profile-secrets", validateTenantId(tenantId));
}
function cellOwnerId(dataDir) {
  return crypto.createHash("sha256").update(path.resolve(dataDir)).digest("hex").slice(0, 32);
}
function validateCellContainerProfile(profile) {
  validateTenantId(profile.tenantId);
  validateHostPort(profile.hostPort);
  if (profile.containerName !== cellContainerName(profile.tenantId))
    throw new Error(`Fleet container name must be ${cellContainerName(profile.tenantId)}.`);
  if (profile.networkName !== cellNetworkName(profile.tenantId))
    throw new Error(`Fleet network name must be ${cellNetworkName(profile.tenantId)}.`);
  if (validateFleetImage(profile.image) !== profile.image)
    throw new Error("Fleet container image must not have surrounding whitespace.");
  if (!profile.dataDir.trim()) throw new Error("Fleet cell data directory must not be empty.");
  if (!profile.authSecretDir.trim())
    throw new Error("Fleet cell auth-secret directory must not be empty.");
  if (profile.ownerId !== cellOwnerId(profile.dataDir))
    throw new Error("Fleet cell owner id does not match its data directory.");
  if (!/^[a-f0-9]{32}$/u.test(profile.attemptId))
    throw new Error("Fleet cell attempt id must be 32 lowercase hexadecimal characters.");
  if (!profile.memory.trim()) throw new Error("Fleet cell memory limit must not be empty.");
  if (!profile.cpus.trim()) throw new Error("Fleet cell CPU limit must not be empty.");
  if (profile.diskSize !== void 0 && validateDiskSize(profile.diskSize) !== profile.diskSize)
    throw new Error("Fleet cell --disk limit must not have surrounding whitespace.");
  const cpus = Number(profile.cpus);
  if (!Number.isFinite(cpus) || cpus <= 0)
    throw new Error("Fleet cell CPU limit must be a positive number.");
  if (!Number.isInteger(profile.pidsLimit) || profile.pidsLimit < 1)
    throw new Error("Fleet cell PID limit must be a positive integer.");
  if (profile.containerUser) {
    if (
      !Number.isInteger(profile.containerUser.uid) ||
      profile.containerUser.uid < 0 ||
      !Number.isInteger(profile.containerUser.gid) ||
      profile.containerUser.gid < 0
    )
      throw new Error("Container uid and gid must be non-negative integers.");
    if (profile.containerUser.mode === "podman-keep-id" && profile.runtime !== "podman")
      throw new Error("keep-id user mapping requires Podman.");
  }
  for (const [key, value] of Object.entries(profile.environment))
    if (!ENV_KEY_PATTERN.test(key) || hasInvalidEnvironmentFileValue(value))
      throw new Error(`Invalid fleet cell environment entry: ${key}`);
}
function buildCellContainerArgs(profile, operation, options) {
  validateCellContainerProfile(profile);
  if (!options.environmentFile.trim())
    throw new Error("Fleet cell environment file path must not be empty.");
  const containerUserArgs = profile.containerUser
    ? [
        ...(profile.containerUser.mode === "podman-keep-id" ? ["--userns=keep-id"] : []),
        "--user",
        `${profile.containerUser.uid}:${profile.containerUser.gid}`,
      ]
    : [];
  const userEnvironmentKeys = Object.keys(profile.environment)
    .filter((key) => !RESERVED_ENV_KEYS.has(key))
    .toSorted();
  const mountSuffix = profile.selinuxRelabel ? ":Z" : "";
  return [
    operation,
    ...(operation === "run" ? ["-d"] : []),
    "--name",
    profile.containerName,
    "--label",
    `${FLEET_TENANT_LABEL}=${profile.tenantId}`,
    "--label",
    `${FLEET_OWNER_LABEL}=${profile.ownerId}`,
    "--label",
    `${FLEET_ATTEMPT_LABEL}=${profile.attemptId}`,
    "--label",
    `${FLEET_ENV_KEYS_LABEL}=${userEnvironmentKeys.join(",")}`,
    ...(profile.diskSize ? ["--label", `${FLEET_DISK_LIMIT_LABEL}=${profile.diskSize}`] : []),
    "--init",
    ...containerUserArgs,
    "--cap-drop=ALL",
    "--security-opt",
    "no-new-privileges",
    "--pids-limit",
    String(profile.pidsLimit),
    "--memory",
    profile.memory,
    "--cpus",
    profile.cpus,
    ...(profile.diskSize ? ["--storage-opt", `size=${profile.diskSize}`] : []),
    "--restart",
    "unless-stopped",
    "--network",
    profile.networkName,
    "-p",
    `127.0.0.1:${profile.hostPort}:${FLEET_GATEWAY_PORT}`,
    "--volume",
    `${profile.dataDir}:${FLEET_CONTAINER_STATE_DIR}${mountSuffix}`,
    "--volume",
    `${profile.authSecretDir}:${FLEET_CONTAINER_AUTH_SECRET_DIR}${mountSuffix}`,
    "--env-file",
    options.environmentFile,
    profile.image,
    "node",
    "dist/index.js",
    "gateway",
    "--bind",
    "lan",
    "--port",
    String(FLEET_GATEWAY_PORT),
  ];
}
function buildCellRunArgs(profile, options) {
  return buildCellContainerArgs(profile, "run", options);
}
function buildCellCreateArgs(profile, options) {
  return buildCellContainerArgs(profile, "create", options);
}
//#endregion
export {
  parseEnvAssignments as _,
  FLEET_GATEWAY_PORT as a,
  validateFleetImage as b,
  allocateHostPort as c,
  buildCellRunArgs as d,
  cellAuthSecretDir as f,
  cellOwnerId as g,
  cellNetworkName as h,
  FLEET_ENV_KEYS_LABEL as i,
  buildCellCreateArgs as l,
  cellDataDir as m,
  FLEET_ATTEMPT_LABEL as n,
  FLEET_OWNER_LABEL as o,
  cellContainerName as p,
  FLEET_DISK_LIMIT_LABEL as r,
  FLEET_TENANT_LABEL as s,
  DEFAULT_FLEET_IMAGE as t,
  buildCellEnvironment as u,
  validateCellContainerProfile as v,
  validateTenantId as x,
  validateDiskSize as y,
};
