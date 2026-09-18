import fs from "node:fs/promises";
import path from "node:path";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-Co0q1IYy.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  a as resolveAgentDir,
  n as listAgentIds,
  o as resolveAgentWorkspaceDir,
  t as listAgentEntries,
} from "./agent-scope-config-DVIR1nBa.js";
import "./utils-DtcDeqWS.js";
import "./agent-scope-y9xQv_q1.js";
import {
  a as pruneAgentConfig,
  r as findAgentEntryIndex,
  t as applyAgentConfig,
} from "./agents.config-ClyzacE8.js";
import { n as mutateConfigFileWithRetry } from "./config-BDv-QbJ6.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { l as movePathToTrash } from "./fs-safe-RNq3oO57.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { n as resolveAgentIdentity } from "./identity-CceraXdn.js";
import { r as mergeIdentityMarkdownContent } from "./identity-file-DXr4SX5Y.js";
import { t as loadOptionalServerMethodModelCatalog } from "./optional-model-catalog-CB9dD03E.js";
import { C as FsSafeError } from "./path-DILYn_gk.js";
import { c as resolveSessionTranscriptsDirForAgent } from "./paths-TfuVT-K8.js";
import { a as root } from "./secure-temp-dir-DMUMnweR.js";
import { t as DEFAULT_AGENT_ID } from "./session-key-druuY-GG.js";
import "./browser-maintenance-DirtFoi0.js";
import { o as listAgentsForGateway } from "./session-utils-DjTWBI0J.js";
import { t as purgeAgentSessionStoreEntries } from "./sessions-CEG7v41b.js";
import {
  a as validateAgentsDeleteParams,
  c as validateAgentsFilesSetParams,
  i as validateAgentsCreateParams,
  l as validateAgentsListParams,
  o as validateAgentsFilesGetParams,
  s as validateAgentsFilesListParams,
  u as validateAgentsUpdateParams,
} from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as formatValidationErrors } from "./validation-errors-B9K6VbD7.js";
import {
  _ as resolveWorkspaceAttestationPaths,
  a as DEFAULT_MEMORY_FILENAME,
  c as DEFAULT_USER_FILENAME,
  d as ensureAgentWorkspace,
  i as DEFAULT_IDENTITY_FILENAME,
  m as isWorkspaceSetupCompleted,
  n as DEFAULT_BOOTSTRAP_FILENAME,
  o as DEFAULT_SOUL_FILENAME,
  r as DEFAULT_HEARTBEAT_FILENAME,
  s as DEFAULT_TOOLS_FILENAME,
  t as DEFAULT_AGENTS_FILENAME,
  y as shouldRemoveWorkspaceAttestation,
} from "./workspace-DXzCbuC0.js";
//#region src/gateway/server-methods/agents-config-mutations.ts
/** Typed precondition failure surfaced by agent mutation handlers as gateway errors. */
var AgentConfigPreconditionError = class extends Error {
  constructor(kind, agentId) {
    super(
      kind === "already-exists"
        ? `agent "${agentId}" already exists`
        : `agent "${agentId}" not found`,
    );
    this.kind = kind;
    this.agentId = agentId;
    this.name = "AgentConfigPreconditionError";
  }
};
/** Checks the current config snapshot for a concrete agent entry. */
function isConfiguredAgent(cfg, agentId) {
  return findAgentEntryIndex(listAgentEntries(cfg), agentId) >= 0;
}
/** Adds a new agent entry through the retrying config mutation path. */
async function createAgentConfigEntry(params) {
  await mutateConfigFileWithRetry({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      if (isConfiguredAgent(draft, params.agentId))
        throw new AgentConfigPreconditionError("already-exists", params.agentId);
      const latestNextConfig = applyAgentConfig(draft, {
        agentId: params.agentId,
        name: params.name,
        workspace: params.workspace,
        model: params.model,
        identity: params.identity,
        agentDir: params.agentDir,
      });
      Object.assign(draft, latestNextConfig);
    },
  });
}
/** Updates an existing agent entry while preserving omitted fields. */
async function updateAgentConfigEntry(params) {
  await mutateConfigFileWithRetry({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      if (!isConfiguredAgent(draft, params.agentId))
        throw new AgentConfigPreconditionError("not-found", params.agentId);
      const latestNextConfig = applyAgentConfig(draft, {
        agentId: params.agentId,
        ...(params.name ? { name: params.name } : {}),
        ...(params.workspace ? { workspace: params.workspace } : {}),
        ...(params.model ? { model: params.model } : {}),
        ...(params.identity ? { identity: params.identity } : {}),
      });
      Object.assign(draft, latestNextConfig);
    },
  });
}
/** Removes an agent entry and returns filesystem roots the caller should clean up. */
async function deleteAgentConfigEntry(params) {
  const committed = await mutateConfigFileWithRetry({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      if (!isConfiguredAgent(draft, params.agentId))
        throw new AgentConfigPreconditionError("not-found", params.agentId);
      const workspaceDir = resolveAgentWorkspaceDir(draft, params.agentId);
      const agentDir = resolveAgentDir(draft, params.agentId);
      const sessionsDir = resolveSessionTranscriptsDirForAgent(params.agentId);
      const result = pruneAgentConfig(draft, params.agentId);
      Object.assign(draft, result.config);
      return {
        workspaceDir,
        agentDir,
        sessionsDir,
        removedBindings: result.removedBindings,
      };
    },
  });
  return {
    nextConfig: committed.nextConfig,
    result: committed.result,
  };
}
//#endregion
//#region src/gateway/server-methods/agents.ts
const BOOTSTRAP_FILE_NAMES = [
  DEFAULT_AGENTS_FILENAME,
  DEFAULT_SOUL_FILENAME,
  DEFAULT_TOOLS_FILENAME,
  DEFAULT_IDENTITY_FILENAME,
  DEFAULT_USER_FILENAME,
  DEFAULT_HEARTBEAT_FILENAME,
  DEFAULT_BOOTSTRAP_FILENAME,
];
const BOOTSTRAP_FILE_NAMES_POST_ONBOARDING = BOOTSTRAP_FILE_NAMES.filter(
  (name) => name !== DEFAULT_BOOTSTRAP_FILENAME,
);
const agentsHandlerDeps = {
  root,
  isWorkspaceSetupCompleted,
};
const testing = {
  setDepsForTests(overrides) {
    if (overrides.isWorkspaceSetupCompleted)
      agentsHandlerDeps.isWorkspaceSetupCompleted = overrides.isWorkspaceSetupCompleted;
    if (overrides.root) agentsHandlerDeps.root = overrides.root;
  },
  resetDepsForTests() {
    agentsHandlerDeps.root = root;
    agentsHandlerDeps.isWorkspaceSetupCompleted = isWorkspaceSetupCompleted;
  },
};
const MEMORY_FILE_NAMES = [DEFAULT_MEMORY_FILENAME];
const ALLOWED_FILE_NAMES = /* @__PURE__ */ new Set([...BOOTSTRAP_FILE_NAMES, ...MEMORY_FILE_NAMES]);
function resolveAgentWorkspaceFileOrRespondError(params, respond, cfg) {
  const rawAgentId = params.agentId;
  const agentId = resolveAgentIdOrError(
    typeof rawAgentId === "string" || typeof rawAgentId === "number" ? String(rawAgentId) : "",
    cfg,
  );
  if (!agentId) {
    respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agent id"));
    return null;
  }
  const rawName = params.name;
  const name = (
    typeof rawName === "string" || typeof rawName === "number" ? String(rawName) : ""
  ).trim();
  if (!ALLOWED_FILE_NAMES.has(name)) {
    respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsupported file "${name}"`));
    return null;
  }
  return {
    cfg,
    agentId,
    workspaceDir: resolveAgentWorkspaceDir(cfg, agentId),
    name,
  };
}
function isRegularWorkspaceFileStat(stat) {
  const isFile = typeof stat.isFile === "function" ? stat.isFile() : stat.isFile;
  const isSymbolicLink =
    typeof stat.isSymbolicLink === "function" ? stat.isSymbolicLink() : stat.isSymbolicLink;
  return isFile && !isSymbolicLink && stat.nlink <= 1;
}
function toWorkspaceFileMeta(stat) {
  if (!isRegularWorkspaceFileStat(stat)) return null;
  return {
    size: stat.size,
    updatedAtMs: Math.floor(stat.mtimeMs),
  };
}
async function statWorkspaceFileSafely(workspaceRoot, workspaceDir, name) {
  try {
    return toWorkspaceFileMeta(
      workspaceRoot
        ? await workspaceRoot.stat(name)
        : await fs.lstat(path.join(workspaceDir, name)),
    );
  } catch {
    if (!workspaceRoot) return null;
    try {
      return toWorkspaceFileMeta(await fs.lstat(path.join(workspaceDir, name)));
    } catch {
      return null;
    }
  }
}
async function openWorkspaceRootSafely(workspaceDir) {
  try {
    return await agentsHandlerDeps.root(workspaceDir);
  } catch {
    return null;
  }
}
async function listAgentFiles(workspaceDir, options) {
  const files = [];
  const workspaceRoot = await openWorkspaceRootSafely(workspaceDir);
  if (!workspaceRoot)
    return [
      ...(options?.hideBootstrap ? BOOTSTRAP_FILE_NAMES_POST_ONBOARDING : BOOTSTRAP_FILE_NAMES),
      DEFAULT_MEMORY_FILENAME,
    ].map((name) => ({
      name,
      path: path.join(workspaceDir, name),
      missing: true,
    }));
  const bootstrapFileNames = options?.hideBootstrap
    ? BOOTSTRAP_FILE_NAMES_POST_ONBOARDING
    : BOOTSTRAP_FILE_NAMES;
  for (const name of bootstrapFileNames) {
    const filePath = path.join(workspaceDir, name);
    const meta = await statWorkspaceFileSafely(workspaceRoot, workspaceDir, name);
    if (meta)
      files.push({
        name,
        path: filePath,
        missing: false,
        size: meta.size,
        updatedAtMs: meta.updatedAtMs,
      });
    else
      files.push({
        name,
        path: filePath,
        missing: true,
      });
  }
  const primaryMeta = await statWorkspaceFileSafely(
    workspaceRoot,
    workspaceDir,
    DEFAULT_MEMORY_FILENAME,
  );
  if (primaryMeta)
    files.push({
      name: DEFAULT_MEMORY_FILENAME,
      path: path.join(workspaceDir, DEFAULT_MEMORY_FILENAME),
      missing: false,
      size: primaryMeta.size,
      updatedAtMs: primaryMeta.updatedAtMs,
    });
  else
    files.push({
      name: DEFAULT_MEMORY_FILENAME,
      path: path.join(workspaceDir, DEFAULT_MEMORY_FILENAME),
      missing: true,
    });
  return files;
}
function resolveAgentIdOrError(agentIdRaw, cfg) {
  const agentId = normalizeAgentId(agentIdRaw);
  if (!new Set(listAgentIds(cfg)).has(agentId)) return null;
  return agentId;
}
function sanitizeIdentityLine(value) {
  return value.replace(/\s+/g, " ").trim();
}
function respondInvalidMethodParams(respond, method, errors) {
  respond(
    false,
    void 0,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      `invalid ${method} params: ${formatValidationErrors(errors)}`,
    ),
  );
}
function respondAgentNotFound(respond, agentId) {
  respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${agentId}" not found`));
}
function respondAgentConfigPreconditionError(respond, error) {
  if (error.kind === "not-found") {
    respondAgentNotFound(respond, error.agentId);
    return;
  }
  respond(
    false,
    void 0,
    errorShape(ErrorCodes.INVALID_REQUEST, `agent "${error.agentId}" already exists`),
  );
}
async function moveToTrashBestEffort(pathname) {
  if (!pathname) return;
  try {
    await fs.access(pathname);
  } catch {
    return;
  }
  try {
    await movePathToTrash(pathname);
  } catch {}
}
function respondWorkspaceFileUnsafe(respond, name) {
  respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unsafe workspace file "${name}"`));
}
function respondWorkspaceFileMissing(params) {
  params.respond(
    true,
    {
      agentId: params.agentId,
      workspace: params.workspaceDir,
      file: {
        name: params.name,
        path: params.filePath,
        missing: true,
      },
    },
    void 0,
  );
}
async function writeWorkspaceFileOrRespond(params) {
  await fs.mkdir(params.workspaceDir, { recursive: true });
  try {
    await (
      await agentsHandlerDeps.root(params.workspaceDir)
    ).write(params.name, params.content, { encoding: "utf8" });
  } catch (err) {
    if (err instanceof FsSafeError) {
      respondWorkspaceFileUnsafe(params.respond, params.name);
      return false;
    }
    throw err;
  }
  return true;
}
function normalizeIdentityForFile(identity) {
  if (!identity) return;
  const resolved = {
    name: identity.name?.trim() || void 0,
    theme: identity.theme?.trim() || void 0,
    emoji: identity.emoji?.trim() || void 0,
    avatar: identity.avatar?.trim() || void 0,
  };
  if (!resolved.name && !resolved.theme && !resolved.emoji && !resolved.avatar) return;
  return resolved;
}
function createAgentIdentityConfig(params) {
  const emoji = normalizeOptionalString(params.emoji);
  const avatar = normalizeOptionalString(params.avatar);
  const identity = {
    ...(params.safeName ? { name: params.safeName } : {}),
    ...(emoji ? { emoji: sanitizeIdentityLine(emoji) } : {}),
    ...(avatar ? { avatar: sanitizeIdentityLine(avatar) } : {}),
  };
  return identity.name || identity.emoji || identity.avatar ? identity : void 0;
}
function buildAgentConfigUpdate(params) {
  return {
    agentId: params.agentId,
    ...(params.safeName ? { name: params.safeName } : {}),
    ...(params.workspaceDir ? { workspace: params.workspaceDir } : {}),
    ...(params.model ? { model: params.model } : {}),
    ...(params.identity ? { identity: params.identity } : {}),
  };
}
async function readWorkspaceFileContent(workspaceDir, name) {
  try {
    return (
      await (
        await agentsHandlerDeps.root(workspaceDir)
      ).read(name, {
        hardlinks: "reject",
        nonBlockingRead: true,
      })
    ).buffer.toString("utf-8");
  } catch (err) {
    if (err instanceof FsSafeError && err.code === "not-found") return;
    throw err;
  }
}
async function buildIdentityMarkdownForWrite(params) {
  let baseContent;
  if (params.preferFallbackWorkspaceContent && params.fallbackWorkspaceDir) {
    baseContent = await readWorkspaceFileContent(
      params.fallbackWorkspaceDir,
      DEFAULT_IDENTITY_FILENAME,
    );
    if (baseContent === void 0)
      baseContent = await readWorkspaceFileContent(params.workspaceDir, DEFAULT_IDENTITY_FILENAME);
  } else {
    baseContent = await readWorkspaceFileContent(params.workspaceDir, DEFAULT_IDENTITY_FILENAME);
    if (baseContent === void 0 && params.fallbackWorkspaceDir)
      baseContent = await readWorkspaceFileContent(
        params.fallbackWorkspaceDir,
        DEFAULT_IDENTITY_FILENAME,
      );
  }
  return mergeIdentityMarkdownContent(baseContent, params.identity);
}
async function buildIdentityMarkdownOrRespondUnsafe(params) {
  try {
    return await buildIdentityMarkdownForWrite(params);
  } catch (err) {
    if (err instanceof FsSafeError) {
      respondWorkspaceFileUnsafe(params.respond, DEFAULT_IDENTITY_FILENAME);
      return null;
    }
    throw err;
  }
}
const agentsHandlers = {
  "agents.list": async ({ params, respond, context }) => {
    if (!validateAgentsListParams(params)) {
      respondInvalidMethodParams(respond, "agents.list", validateAgentsListParams.errors);
      return;
    }
    respond(
      true,
      listAgentsForGateway(
        context.getRuntimeConfig(),
        await loadOptionalServerMethodModelCatalog(context, "agents.list", {
          logOnceKey: "agents.list",
        }),
      ),
      void 0,
    );
  },
  "agents.create": async ({ params, respond, context }) => {
    if (!validateAgentsCreateParams(params)) {
      respondInvalidMethodParams(respond, "agents.create", validateAgentsCreateParams.errors);
      return;
    }
    const cfg = context.getRuntimeConfig();
    const rawName = params.name.trim();
    const agentId = normalizeAgentId(rawName);
    if (agentId === "main") {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `"${DEFAULT_AGENT_ID}" is reserved`),
      );
      return;
    }
    if (isConfiguredAgent(cfg, agentId)) {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `agent "${agentId}" already exists`),
      );
      return;
    }
    const workspaceDir = resolveUserPath(params.workspace.trim());
    const safeName = sanitizeIdentityLine(rawName);
    const model = normalizeOptionalString(params.model);
    const identity = createAgentIdentityConfig({
      safeName,
      emoji: params.emoji,
      avatar: params.avatar,
    }) ?? { name: safeName };
    let nextConfig = applyAgentConfig(cfg, {
      agentId,
      name: safeName,
      workspace: workspaceDir,
      model,
      identity,
    });
    const agentDir = resolveAgentDir(nextConfig, agentId);
    nextConfig = applyAgentConfig(nextConfig, {
      agentId,
      agentDir,
    });
    await ensureAgentWorkspace({
      dir: workspaceDir,
      ensureBootstrapFiles: !Boolean(nextConfig.agents?.defaults?.skipBootstrap),
      skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles,
    });
    await fs.mkdir(resolveSessionTranscriptsDirForAgent(agentId), { recursive: true });
    const persistedIdentity = normalizeIdentityForFile(resolveAgentIdentity(nextConfig, agentId));
    if (persistedIdentity) {
      const identityContent = await buildIdentityMarkdownOrRespondUnsafe({
        respond,
        workspaceDir,
        identity: persistedIdentity,
      });
      if (identityContent === null) return;
      if (
        !(await writeWorkspaceFileOrRespond({
          respond,
          workspaceDir,
          name: "IDENTITY.md",
          content: identityContent,
        }))
      )
        return;
    }
    try {
      await createAgentConfigEntry({
        agentId,
        name: safeName,
        workspace: workspaceDir,
        model,
        identity,
        agentDir,
      });
    } catch (error) {
      if (error instanceof AgentConfigPreconditionError) {
        respondAgentConfigPreconditionError(respond, error);
        return;
      }
      throw error;
    }
    respond(
      true,
      {
        ok: true,
        agentId,
        name: safeName,
        workspace: workspaceDir,
        model,
      },
      void 0,
    );
  },
  "agents.update": async ({ params, respond, context }) => {
    if (!validateAgentsUpdateParams(params)) {
      respondInvalidMethodParams(respond, "agents.update", validateAgentsUpdateParams.errors);
      return;
    }
    const cfg = context.getRuntimeConfig();
    const agentId = normalizeAgentId(params.agentId);
    if (!isConfiguredAgent(cfg, agentId)) {
      respondAgentNotFound(respond, agentId);
      return;
    }
    const workspaceDir =
      typeof params.workspace === "string" && params.workspace.trim()
        ? resolveUserPath(params.workspace.trim())
        : void 0;
    const model = normalizeOptionalString(params.model);
    const safeName =
      typeof params.name === "string" && params.name.trim()
        ? sanitizeIdentityLine(params.name.trim())
        : void 0;
    const identity = createAgentIdentityConfig({
      safeName,
      emoji: params.emoji,
      avatar: params.avatar,
    });
    const hasIdentityFields = Boolean(identity);
    const agentConfigUpdate = buildAgentConfigUpdate({
      agentId,
      safeName,
      workspaceDir,
      model,
      identity,
    });
    const nextConfig = applyAgentConfig(cfg, agentConfigUpdate);
    let ensuredWorkspace;
    if (workspaceDir)
      ensuredWorkspace = await ensureAgentWorkspace({
        dir: workspaceDir,
        ensureBootstrapFiles: !Boolean(nextConfig.agents?.defaults?.skipBootstrap),
        skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles,
      });
    const persistedIdentity = normalizeIdentityForFile(resolveAgentIdentity(nextConfig, agentId));
    if (persistedIdentity && (workspaceDir || hasIdentityFields)) {
      const identityWorkspaceDir = resolveAgentWorkspaceDir(nextConfig, agentId);
      const previousWorkspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
      const fallbackWorkspaceDir =
        workspaceDir && identityWorkspaceDir !== previousWorkspaceDir
          ? previousWorkspaceDir
          : void 0;
      const identityContent = await buildIdentityMarkdownOrRespondUnsafe({
        respond,
        workspaceDir: identityWorkspaceDir,
        identity: persistedIdentity,
        fallbackWorkspaceDir,
        preferFallbackWorkspaceContent:
          Boolean(fallbackWorkspaceDir) && ensuredWorkspace?.identityPathCreated === true,
      });
      if (identityContent === null) return;
      if (
        !(await writeWorkspaceFileOrRespond({
          respond,
          workspaceDir: identityWorkspaceDir,
          name: "IDENTITY.md",
          content: identityContent,
        }))
      )
        return;
    }
    try {
      await updateAgentConfigEntry(agentConfigUpdate);
    } catch (error) {
      if (error instanceof AgentConfigPreconditionError) {
        respondAgentConfigPreconditionError(respond, error);
        return;
      }
      throw error;
    }
    respond(
      true,
      {
        ok: true,
        agentId,
      },
      void 0,
    );
  },
  "agents.delete": async ({ params, respond, context }) => {
    if (!validateAgentsDeleteParams(params)) {
      respondInvalidMethodParams(respond, "agents.delete", validateAgentsDeleteParams.errors);
      return;
    }
    const cfg = context.getRuntimeConfig();
    const agentId = normalizeAgentId(params.agentId);
    if (agentId === "main") {
      respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, `"${DEFAULT_AGENT_ID}" cannot be deleted`),
      );
      return;
    }
    if (!isConfiguredAgent(cfg, agentId)) {
      respondAgentNotFound(respond, agentId);
      return;
    }
    const deleteFiles = typeof params.deleteFiles === "boolean" ? params.deleteFiles : true;
    let committed;
    try {
      committed = await deleteAgentConfigEntry({ agentId });
    } catch (error) {
      if (error instanceof AgentConfigPreconditionError) {
        respondAgentConfigPreconditionError(respond, error);
        return;
      }
      throw error;
    }
    const deleteResult = committed.result;
    if (!deleteResult) {
      respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "agent delete did not commit"));
      return;
    }
    await purgeAgentSessionStoreEntries(cfg, agentId);
    if (deleteFiles) {
      const deleteWorkspace =
        findOverlappingWorkspaceAgentIds(committed.nextConfig, agentId, deleteResult.workspaceDir)
          .length === 0;
      const pathsToTrash = [deleteResult.agentDir, deleteResult.sessionsDir];
      if (deleteWorkspace) {
        pathsToTrash.unshift(deleteResult.workspaceDir);
        for (const [index, attestationPath] of resolveWorkspaceAttestationPaths(
          deleteResult.workspaceDir,
        ).entries())
          if (
            await shouldRemoveWorkspaceAttestation(attestationPath, { trustUnknown: index === 0 })
          )
            pathsToTrash.push(attestationPath);
      }
      await Promise.all(pathsToTrash.map((pathname) => moveToTrashBestEffort(pathname)));
    }
    respond(
      true,
      {
        ok: true,
        agentId,
        removedBindings: deleteResult.removedBindings,
      },
      void 0,
    );
  },
  "agents.files.list": async ({ params, respond, context }) => {
    if (!validateAgentsFilesListParams(params)) {
      respondInvalidMethodParams(
        respond,
        "agents.files.list",
        validateAgentsFilesListParams.errors,
      );
      return;
    }
    const cfg = context.getRuntimeConfig();
    const agentId = resolveAgentIdOrError(params.agentId, cfg);
    if (!agentId) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown agent id"));
      return;
    }
    const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
    let hideBootstrap = false;
    try {
      hideBootstrap = await agentsHandlerDeps.isWorkspaceSetupCompleted(workspaceDir);
    } catch {}
    respond(
      true,
      {
        agentId,
        workspace: workspaceDir,
        files: await listAgentFiles(workspaceDir, { hideBootstrap }),
      },
      void 0,
    );
  },
  "agents.files.get": async ({ params, respond, context }) => {
    if (!validateAgentsFilesGetParams(params)) {
      respondInvalidMethodParams(respond, "agents.files.get", validateAgentsFilesGetParams.errors);
      return;
    }
    const resolved = resolveAgentWorkspaceFileOrRespondError(
      params,
      respond,
      context.getRuntimeConfig(),
    );
    if (!resolved) return;
    const { agentId, workspaceDir, name } = resolved;
    const filePath = path.join(workspaceDir, name);
    let safeRead;
    try {
      safeRead = await (
        await agentsHandlerDeps.root(workspaceDir)
      ).read(name, {
        hardlinks: "reject",
        nonBlockingRead: true,
      });
    } catch (err) {
      if (err instanceof FsSafeError && err.code === "not-found") {
        respondWorkspaceFileMissing({
          respond,
          agentId,
          workspaceDir,
          name,
          filePath,
        });
        return;
      }
      if (err instanceof FsSafeError) {
        respondWorkspaceFileUnsafe(respond, name);
        return;
      }
      throw err;
    }
    respond(
      true,
      {
        agentId,
        workspace: workspaceDir,
        file: {
          name,
          path: filePath,
          missing: false,
          size: safeRead.stat.size,
          updatedAtMs: Math.floor(safeRead.stat.mtimeMs),
          content: safeRead.buffer.toString("utf-8"),
        },
      },
      void 0,
    );
  },
  "agents.files.set": async ({ params, respond, context }) => {
    if (!validateAgentsFilesSetParams(params)) {
      respondInvalidMethodParams(respond, "agents.files.set", validateAgentsFilesSetParams.errors);
      return;
    }
    const resolved = resolveAgentWorkspaceFileOrRespondError(
      params,
      respond,
      context.getRuntimeConfig(),
    );
    if (!resolved) return;
    const { agentId, workspaceDir, name } = resolved;
    await fs.mkdir(workspaceDir, { recursive: true });
    const filePath = path.join(workspaceDir, name);
    const content = params.content;
    let workspaceRoot;
    try {
      workspaceRoot = await agentsHandlerDeps.root(workspaceDir);
      await workspaceRoot.write(name, content, { encoding: "utf8" });
    } catch (err) {
      if (!(err instanceof FsSafeError)) throw err;
      respondWorkspaceFileUnsafe(respond, name);
      return;
    }
    const meta = await statWorkspaceFileSafely(workspaceRoot, workspaceDir, name);
    respond(
      true,
      {
        ok: true,
        agentId,
        workspace: workspaceDir,
        file: {
          name,
          path: filePath,
          missing: false,
          size: meta?.size,
          updatedAtMs: meta?.updatedAtMs,
          content,
        },
      },
      void 0,
    );
  },
};
//#endregion
export { testing as __testing, testing, agentsHandlers };
