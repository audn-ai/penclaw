import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { normalizeToolParameterSchema } from "@openclaw/ai/internal/openai";
import "./fs-safe-RNq3oO57.js";
import { Type } from "typebox";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import "./boundary-file-read-CBe_wA_B.js";
import {
  d as rewrapToolWithBeforeToolCallHook,
  p as wrapToolWithBeforeToolCallHook,
} from "./agent-tools.before-tool-call-B7gv78c3.js";
import {
  n as describeProcessTool,
  t as describeExecTool,
} from "./bash-tools.descriptions-B9OIpG9q.js";
import "./path-alias-guards-CBe_wA_B.js";
import { r as processSchema } from "./bash-tools.schemas-DTbbXMLb.js";
import { s as shouldSuppressManagedWebSearchTool } from "./codex-native-web-search-core-DGXC1P49.js";
import "./message-channel-NQc9DJ6B.js";
import { _ as SANDBOX_AGENT_WORKSPACE_MOUNT } from "./constants-Bs8JiPHi.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BibJNI2C.js";
import { n as replaceWithEffectiveCronCreatorToolAllowlist } from "./cron-tool-nnu5h65s.js";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-EO69Px8j.js";
import { k as resolveReadOnlyWorkspaceSkillMounts } from "./docker-yvxsWR8P.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as resolveEventSessionRoutingPolicy } from "./event-session-routing-zOSuMGLJ.js";
import { t as applyExecPolicyLayer } from "./exec-policy-DDAbB8Ct.js";
import {
  D as isToolWrappedWithBeforeToolCallHook,
  E as copyBeforeToolCallHookMarker,
  b as copyChannelAgentToolMeta,
  d as copyToolTerminalPresentation,
  h as listChannelAgentTools,
  o as wrapToolWithGatewayCallerIdentity,
} from "./gateway-Dyh1k_4Q.js";
import { t as HEARTBEAT_RESPONSE_TOOL_NAME } from "./heartbeat-tool-response-B3cJVfMo.js";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-CxLP0YN-.js";
import {
  n as resolveExecToolConfig,
  r as filterToolsByMessageProvider,
  t as createLazyExecTool,
} from "./lazy-exec-tool-CYVnvL8K.js";
import { t as createLazyImportLoader } from "./lazy-promise-EhsWch5m.js";
import {
  T as resolveToolSearchConfig,
  b as createToolSearchTools,
  c as TOOL_SEARCH_CODE_MODE_TOOL_NAME,
  i as resolveLocalModelLeanPreserveToolNames,
  j as mergeAgentRingZeroTools,
  k as getActiveAgentRingZeroTools,
  l as TOOL_SEARCH_RAW_TOOL_NAME,
  n as filterLocalModelLeanTools,
  o as TOOL_CALL_RAW_TOOL_NAME,
  s as TOOL_DESCRIBE_RAW_TOOL_NAME,
} from "./local-model-lean-D3O2n_2v.js";
import { s as createToolFsPolicy, u as resolveToolFsConfig } from "./local-roots-CgMgS9r2.js";
import { a as logWarn } from "./logger-BegyOJlO.js";
import { a as resolveGatewayMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import {
  C as wrapToolMemoryFlushAppendOnlyWrite,
  S as wrapReadToolWithSkillContent,
  T as wrapToolWorkspaceRootGuardWithOptions,
  _ as createHostWorkspaceWriteTool,
  b as createSandboxedReadTool,
  g as createHostWorkspaceEditTool,
  h as resolveOpenClawPluginToolsForOptions,
  n as filterToolsByClientCaps,
  t as createOpenClawTools,
  v as createOpenClawReadTool,
  w as wrapToolWorkspaceRootGuard,
  x as createSandboxedWriteTool,
  y as createSandboxedEditTool,
} from "./openclaw-tools-DGecpaCF.js";
import { n as toRelativeSandboxPath, t as resolvePathFromInput } from "./path-policy-D_kcZMAl.js";
import { r as openRootFile } from "./root-file-9jkyxRTl.js";
import { n as assertSandboxPath } from "./sandbox-paths-DxDLkOQF.js";
import "./codex-native-web-search-BbdWKfjB.js";
import { a as root, o as PATH_ALIAS_POLICIES } from "./secure-temp-dir-DMUMnweR.js";
import { F as createCodingTools, H as createReadTool } from "./sessions-Duh5damM.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { u as PROCESS_TOOL_DISPLAY_SUMMARY } from "./tool-catalog-fgOwzAUV.js";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-vc04OURE.js";
import {
  c as mergeAlsoAllowPolicy,
  f as expandToolGroups,
  l as replaceWithEffectiveToolAllowlist,
  m as normalizeToolName,
  s as hasRestrictiveAllowPolicy,
} from "./tool-policy-1QHiwXPv.js";
import { t as isToolAllowedByPolicies } from "./tool-policy-match-Bq6mIgOa.js";
import {
  n as buildDefaultToolPolicyPipelineSteps,
  r as buildDeclaredToolAllowlistContext,
  t as applyToolPolicyPipeline,
} from "./tool-policy-pipeline-CwM_CrrQ.js";
import {
  i as getPluginToolMeta,
  n as copyPluginToolMeta,
  s as appendRuntimePluginToolGrant,
} from "./tools-K3NqAe9E.js";
//#region src/agents/agent-tools.abort.ts
/**
 * Abort-signal wrapping for agent tools.
 * Combines per-call cancellation with run-level aborts while preserving plugin,
 * channel, and before_tool_call metadata on wrapped tools.
 */
function throwAbortError() {
  throw createAbortError("Aborted");
}
/** Wrap a tool so every execute call observes the supplied run abort signal. */
function wrapToolWithAbortSignal(tool, abortSignal) {
  if (!abortSignal) return tool;
  const execute = tool.execute;
  if (!execute) return tool;
  const wrappedTool = {
    ...tool,
    execute: async (toolCallId, params, signal, onUpdate) => {
      const combinedSignal = signal ? AbortSignal.any([signal, abortSignal]) : abortSignal;
      if (combinedSignal.aborted) throwAbortError();
      return await execute(toolCallId, params, combinedSignal, onUpdate);
    },
  };
  copyPluginToolMeta(tool, wrappedTool);
  copyChannelAgentToolMeta(tool, wrappedTool);
  copyBeforeToolCallHookMarker(tool, wrappedTool);
  return wrappedTool;
}
//#endregion
//#region src/agents/agent-tools.deferred-followup.ts
function replaceDescription(tool, description) {
  const updated = {
    ...tool,
    description,
  };
  copyPluginToolMeta(tool, updated);
  copyChannelAgentToolMeta(tool, updated);
  copyBeforeToolCallHookMarker(tool, updated);
  copyToolTerminalPresentation(tool, updated);
  return updated;
}
/** Return tools with exec/process descriptions adjusted for cron availability. */
function applyDeferredFollowupToolDescriptions(tools, params) {
  const hasCronTool = tools.some((tool) => tool.name === "cron");
  return tools.map((tool) => {
    if (tool.name === "exec")
      return replaceDescription(
        tool,
        describeExecTool({
          agentId: params?.agentId,
          hasCronTool,
        }),
      );
    if (tool.name === "process")
      return replaceDescription(tool, describeProcessTool({ hasCronTool }));
    return tool;
  });
}
//#endregion
//#region src/agents/agent-tools.schema.ts
/**
 * Tool schema normalization wrappers.
 * Applies provider-compatible parameter schema cleanup while preserving plugin
 * and channel metadata on normalized tools.
 */
function isObjectSchemaWithNoRequiredParams(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) return false;
  const record = schema;
  const type = record.type;
  if (!(type === "object" || (Array.isArray(type) && type.some((entry) => entry === "object"))))
    return false;
  return !schemaHasRequiredParams(record);
}
function schemaHasRequiredParams(schema) {
  if (Array.isArray(schema.required) && schema.required.length > 0) return true;
  for (const key of ["allOf", "anyOf", "oneOf"]) {
    const variants = schema[key];
    if (!Array.isArray(variants)) continue;
    if (
      variants.some(
        (variant) =>
          variant !== null &&
          typeof variant === "object" &&
          !Array.isArray(variant) &&
          schemaHasRequiredParams(variant),
      )
    )
      return true;
  }
  return false;
}
function addEmptyObjectArgumentPreparation(tool, parameters) {
  if (!isObjectSchemaWithNoRequiredParams(parameters)) return tool;
  return {
    ...tool,
    prepareArguments: (args) => {
      const prepared = tool.prepareArguments ? tool.prepareArguments(args) : args;
      return prepared === null || prepared === void 0 ? {} : prepared;
    },
  };
}
/** Normalize a tool's parameter schema for the selected provider/model. */
function normalizeToolParameters(tool, options) {
  function preserveToolMeta(target) {
    copyPluginToolMeta(tool, target);
    copyChannelAgentToolMeta(tool, target);
    copyBeforeToolCallHookMarker(tool, target);
    copyToolTerminalPresentation(tool, target);
    return target;
  }
  const schema = tool.parameters && typeof tool.parameters === "object" ? tool.parameters : void 0;
  if (!schema) return tool;
  const parameters = normalizeToolParameterSchema(schema, options);
  return preserveToolMeta({
    ...tool,
    ...addEmptyObjectArgumentPreparation(tool, parameters),
    parameters,
  });
}
//#endregion
//#region src/agents/apply-patch-model-policy.ts
function isApplyPatchAllowedForModel(params) {
  const allowModels = Array.isArray(params.allowModels) ? params.allowModels : [];
  if (allowModels.length === 0) return true;
  const modelId = params.modelId?.trim();
  if (!modelId) return false;
  const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
  const provider = normalizeOptionalLowercaseString(params.modelProvider);
  const normalizedFull =
    provider && !normalizedModelId.includes("/")
      ? `${provider}/${normalizedModelId}`
      : normalizedModelId;
  return allowModels.some((entry) => {
    const normalized = normalizeOptionalLowercaseString(entry);
    return Boolean(
      normalized && (normalized === normalizedModelId || normalized === normalizedFull),
    );
  });
}
//#endregion
//#region src/agents/apply-patch-update.ts
/**
 * Update-hunk application for the apply_patch parser.
 * Locates expected old lines with tolerant matching, applies chunks in order,
 * and returns normalized file contents with a trailing newline.
 */
const DASH_PUNCTUATION = /[\u2010-\u2015\u2212]/g;
const SINGLE_QUOTE_PUNCTUATION = /[\u2018-\u201B]/g;
const DOUBLE_QUOTE_PUNCTUATION = /[\u201C-\u201F]/g;
const SPACE_PUNCTUATION = /[\u00A0\u2002-\u200A\u202F\u205F\u3000]/g;
async function defaultReadFile(filePath) {
  return fs$1.readFile(filePath, "utf8");
}
/** Apply parsed update chunks to one file and return the new file contents. */
async function applyUpdateHunk(filePath, chunks, options) {
  const originalLines = (
    await (options?.readFile ?? defaultReadFile)(filePath).catch((err) => {
      throw new Error(`Failed to read file to update ${filePath}: ${formatErrorMessage(err)}`);
    })
  ).split("\n");
  if (originalLines.length > 0 && originalLines[originalLines.length - 1] === "")
    originalLines.pop();
  let newLines = applyReplacements(
    originalLines,
    computeReplacements(originalLines, filePath, chunks),
  );
  if (newLines.length === 0 || newLines[newLines.length - 1] !== "") newLines = [...newLines, ""];
  return newLines.join("\n");
}
function computeReplacements(originalLines, filePath, chunks) {
  const replacements = [];
  let lineIndex = 0;
  for (const chunk of chunks) {
    if (chunk.changeContext) {
      const ctxIndex = seekSequence(originalLines, [chunk.changeContext], lineIndex, false);
      if (ctxIndex === null)
        throw new Error(`Failed to find context '${chunk.changeContext}' in ${filePath}`);
      lineIndex = ctxIndex + 1;
    }
    if (chunk.oldLines.length === 0) {
      const insertionIndex =
        chunk.changeContext && !chunk.isEndOfFile
          ? lineIndex
          : originalLines.length > 0 && originalLines[originalLines.length - 1] === ""
            ? originalLines.length - 1
            : originalLines.length;
      replacements.push([insertionIndex, 0, chunk.newLines]);
      lineIndex = insertionIndex;
      continue;
    }
    let pattern = chunk.oldLines;
    let newSlice = chunk.newLines;
    let found = seekSequence(originalLines, pattern, lineIndex, chunk.isEndOfFile);
    if (found === null && pattern[pattern.length - 1] === "") {
      pattern = pattern.slice(0, -1);
      if (newSlice.length > 0 && newSlice[newSlice.length - 1] === "")
        newSlice = newSlice.slice(0, -1);
      found = seekSequence(originalLines, pattern, lineIndex, chunk.isEndOfFile);
    }
    if (found === null)
      throw new Error(
        `Failed to find expected lines in ${filePath}:\n${chunk.oldLines.join("\n")}`,
      );
    replacements.push([found, pattern.length, newSlice]);
    lineIndex = found + pattern.length;
  }
  replacements.sort((a, b) => a[0] - b[0]);
  return replacements;
}
function applyReplacements(lines, replacements) {
  const result = [...lines];
  for (const [startIndex, oldLen, newLines] of [...replacements].toReversed()) {
    for (let i = 0; i < oldLen; i += 1)
      if (startIndex < result.length) result.splice(startIndex, 1);
    for (const [i, line] of newLines.entries()) result.splice(startIndex + i, 0, line);
  }
  return result;
}
function seekSequence(lines, pattern, start, eof) {
  if (pattern.length === 0) return start;
  if (pattern.length > lines.length) return null;
  const maxStart = lines.length - pattern.length;
  const searchStart = eof && lines.length >= pattern.length ? maxStart : start;
  if (searchStart > maxStart) return null;
  const normalizers = [
    (value) => value,
    (value) => value.trimEnd(),
    (value) => value.trim(),
    (value) => normalizePunctuation(value.trim()),
  ];
  for (const normalize of normalizers)
    for (let i = searchStart; i <= maxStart; i += 1)
      if (linesMatch(lines, pattern, i, normalize)) return i;
  return null;
}
function linesMatch(lines, pattern, start, normalize) {
  for (let idx = 0; idx < pattern.length; idx += 1) {
    const line = lines.at(start + idx);
    const expected = pattern.at(idx);
    if (line === void 0 || expected === void 0 || normalize(line) !== normalize(expected))
      return false;
  }
  return true;
}
function normalizePunctuation(value) {
  return value
    .replace(DASH_PUNCTUATION, "-")
    .replace(SINGLE_QUOTE_PUNCTUATION, "'")
    .replace(DOUBLE_QUOTE_PUNCTUATION, '"')
    .replace(SPACE_PUNCTUATION, " ");
}
//#endregion
//#region src/agents/apply-patch.ts
/**
 * Runtime apply_patch tool and parser.
 * Parses OpenAI-style patch envelopes and applies add/update/delete/move hunks
 * through guarded host or sandbox filesystem operations.
 */
const BEGIN_PATCH_MARKER = "*** Begin Patch";
const END_PATCH_MARKER = "*** End Patch";
const ADD_FILE_MARKER = "*** Add File: ";
const DELETE_FILE_MARKER = "*** Delete File: ";
const UPDATE_FILE_MARKER = "*** Update File: ";
const MOVE_TO_MARKER = "*** Move to: ";
const EOF_MARKER = "*** End of File";
const CHANGE_CONTEXT_MARKER = "@@ ";
const EMPTY_CHANGE_CONTEXT_MARKER = "@@";
function normalizeUpdateComparison(content) {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (normalized.length === 0 || normalized.endsWith("\n")) return normalized;
  return `${normalized}\n`;
}
const applyPatchSchema = Type.Object({
  input: Type.String({ description: "Patch content using the *** Begin Patch/End Patch format." }),
});
/** Create the agent tool wrapper for applying patch-envelope input. */
function createApplyPatchTool(options = {}) {
  const cwd = options.cwd ?? process.cwd();
  const sandbox = options.sandbox;
  const workspaceOnly = options.workspaceOnly !== false;
  return {
    name: "apply_patch",
    label: "apply_patch",
    description: "Patch one/many files. Input requires *** Begin Patch and *** End Patch.",
    parameters: applyPatchSchema,
    execute: async (_toolCallId, args, signal) => {
      const params = args;
      const input = typeof params.input === "string" ? params.input : "";
      if (!input.trim()) throw new Error("Provide a patch input.");
      if (signal?.aborted) throw createAbortError("Aborted");
      const result = await applyPatch(input, {
        cwd,
        sandbox,
        workspaceOnly,
        signal,
      });
      return {
        content: [
          {
            type: "text",
            text: result.text,
          },
        ],
        details: { summary: result.summary },
        ...(result.noOp ? { terminate: true } : {}),
      };
    },
  };
}
/** Parse and apply a patch envelope to the configured filesystem target. */
async function applyPatch(input, options) {
  const parsed = parsePatchText(input);
  if (parsed.hunks.length === 0) throw new Error("No files were modified.");
  const summary = {
    added: [],
    modified: [],
    deleted: [],
  };
  const seen = {
    added: /* @__PURE__ */ new Set(),
    modified: /* @__PURE__ */ new Set(),
    deleted: /* @__PURE__ */ new Set(),
  };
  const noOpPaths = /* @__PURE__ */ new Set();
  const fileOps = resolvePatchFileOps(options);
  for (const hunk of parsed.hunks) {
    if (options.signal?.aborted) throw createAbortError("Aborted");
    if (hunk.kind === "add") {
      const target = await resolvePatchPath(hunk.path, options);
      await assertPatchParentPath(hunk.path, options);
      await ensureDir(target.resolved, fileOps);
      await fileOps.writeFile(target.resolved, hunk.contents);
      recordSummary(summary, seen, "added", target.display);
      continue;
    }
    if (hunk.kind === "delete") {
      const target = await resolvePatchPath(hunk.path, options, PATH_ALIAS_POLICIES.unlinkTarget);
      await fileOps.remove(target.resolved);
      recordSummary(summary, seen, "deleted", target.display);
      continue;
    }
    const target = await resolvePatchPath(hunk.path, options);
    const applied = await applyUpdateHunk(target.resolved, hunk.chunks, {
      readFile: (pathLocal) => fileOps.readFile(pathLocal),
    });
    if (hunk.movePath) {
      const moveTarget = await resolvePatchPath(hunk.movePath, options);
      await assertPatchParentPath(hunk.movePath, options);
      await ensureDir(moveTarget.resolved, fileOps);
      const moveResolvesToSource =
        path.resolve(moveTarget.resolved) === path.resolve(target.resolved);
      const destination = moveResolvesToSource ? target.resolved : moveTarget.resolved;
      if (moveResolvesToSource)
        if (
          normalizeUpdateComparison(await fileOps.readFile(target.resolved)) ===
          normalizeUpdateComparison(applied)
        )
          noOpPaths.add(target.display);
        else {
          noOpPaths.delete(target.display);
          await fileOps.writeFile(destination, applied);
        }
      else {
        noOpPaths.delete(target.display);
        await fileOps.writeFile(destination, applied);
      }
      if (!moveResolvesToSource) await fileOps.remove(target.resolved);
      if (!noOpPaths.has(target.display))
        recordSummary(
          summary,
          seen,
          "modified",
          moveResolvesToSource ? target.display : moveTarget.display,
        );
    } else if (
      normalizeUpdateComparison(await fileOps.readFile(target.resolved)) ===
      normalizeUpdateComparison(applied)
    )
      noOpPaths.add(target.display);
    else {
      noOpPaths.delete(target.display);
      await fileOps.writeFile(target.resolved, applied);
      recordSummary(summary, seen, "modified", target.display);
    }
  }
  const noOp = noOpPaths.size > 0 && Object.values(summary).every((paths) => paths.length === 0);
  return {
    summary,
    text: noOp ? `No changes made to ${Array.from(noOpPaths).join(", ")}.` : formatSummary(summary),
    ...(noOp ? { noOp: true } : {}),
  };
}
function recordSummary(summary, seen, bucket, value) {
  if (seen[bucket].has(value)) return;
  seen[bucket].add(value);
  summary[bucket].push(value);
}
function formatSummary(summary) {
  const lines = ["Success. Updated the following files:"];
  for (const file of summary.added) lines.push(`A ${file}`);
  for (const file of summary.modified) lines.push(`M ${file}`);
  for (const file of summary.deleted) lines.push(`D ${file}`);
  return lines.join("\n");
}
function resolvePatchFileOps(options) {
  if (options.sandbox) {
    const { root, bridge } = options.sandbox;
    return {
      readFile: async (filePath) => {
        return (
          await bridge.readFile({
            filePath,
            cwd: root,
          })
        ).toString("utf8");
      },
      writeFile: (filePath, content) =>
        bridge.writeFile({
          filePath,
          cwd: root,
          data: content,
        }),
      remove: (filePath) =>
        bridge.remove({
          filePath,
          cwd: root,
          force: false,
        }),
      mkdirp: (dir) =>
        bridge.mkdirp({
          filePath: dir,
          cwd: root,
        }),
    };
  }
  const workspaceOnly = options.workspaceOnly !== false;
  const rootPromise = workspaceOnly ? root(options.cwd) : void 0;
  return {
    readFile: async (filePath) => {
      if (!workspaceOnly) return await fs$1.readFile(filePath, "utf8");
      const opened = await openRootFile({
        absolutePath: filePath,
        rootPath: options.cwd,
        boundaryLabel: "workspace root",
      });
      assertBoundaryRead(opened, filePath);
      try {
        return fs.readFileSync(opened.fd, "utf8");
      } finally {
        fs.closeSync(opened.fd);
      }
    },
    writeFile: async (filePath, content) => {
      if (!workspaceOnly) {
        await fs$1.writeFile(filePath, content, "utf8");
        return;
      }
      const relative = toRelativeSandboxPath(options.cwd, filePath);
      await (await rootPromise)?.write(relative, content, { encoding: "utf8" });
    },
    remove: async (filePath) => {
      if (!workspaceOnly) {
        await fs$1.rm(filePath);
        return;
      }
      const relative = toRelativeSandboxPath(options.cwd, filePath);
      await (await rootPromise)?.remove(relative);
    },
    mkdirp: async (dir) => {
      if (!workspaceOnly) {
        await fs$1.mkdir(dir, { recursive: true });
        return;
      }
      const relative = toRelativeSandboxPath(options.cwd, dir, { allowRoot: true });
      const root = await rootPromise;
      if (!root) return;
      if (relative === "" || relative === ".") {
        await root.ensureRoot();
        return;
      }
      await root.mkdir(relative);
    },
  };
}
async function ensureDir(filePath, ops) {
  const parent = path.dirname(filePath);
  if (!parent || parent === ".") return;
  await ops.mkdirp(parent);
}
async function assertPatchParentPath(filePath, options) {
  if (options.workspaceOnly === false || options.sandbox) return;
  const parent = path.dirname(filePath);
  if (!parent || parent === ".") return;
  await assertSandboxPath({
    filePath: parent,
    cwd: options.cwd,
    root: options.cwd,
  });
  await assertNoExistingParentAliases({
    parentPath: resolvePathFromInput(parent, options.cwd),
    rootPath: options.cwd,
  });
}
async function assertNoExistingParentAliases(params) {
  const rootPath = path.resolve(params.rootPath);
  const parentPath = path.resolve(params.parentPath);
  const relative = path.relative(rootPath, parentPath);
  if (!relative || relative === "" || relativePathEscapesRoot(relative)) return;
  let current = rootPath;
  for (const segment of relative.split(path.sep)) {
    if (!segment) continue;
    current = path.join(current, segment);
    const stat = await fs$1.lstat(current).catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
    if (!stat) return;
    if (stat.isSymbolicLink())
      throw new Error(`Path alias under sandbox root: ${path.relative(rootPath, current)}`);
  }
}
async function resolvePatchPath(filePath, options, aliasPolicy = PATH_ALIAS_POLICIES.strict) {
  if (options.sandbox) {
    const resolved = options.sandbox.bridge.resolvePath({
      filePath,
      cwd: options.cwd,
    });
    if (options.workspaceOnly !== false && resolved.hostPath)
      await assertSandboxPath({
        filePath: resolved.hostPath,
        cwd: options.cwd,
        root: options.cwd,
        allowFinalSymlinkForUnlink: aliasPolicy.allowFinalSymlinkForUnlink,
        allowFinalHardlinkForUnlink: aliasPolicy.allowFinalHardlinkForUnlink,
      });
    return {
      resolved: resolved.hostPath ?? resolved.containerPath,
      display: resolved.relativePath || resolved.containerPath,
    };
  }
  const resolved =
    options.workspaceOnly !== false
      ? (
          await assertSandboxPath({
            filePath,
            cwd: options.cwd,
            root: options.cwd,
            allowFinalSymlinkForUnlink: aliasPolicy.allowFinalSymlinkForUnlink,
            allowFinalHardlinkForUnlink: aliasPolicy.allowFinalHardlinkForUnlink,
          })
        ).resolved
      : resolvePathFromInput(filePath, options.cwd);
  return {
    resolved,
    display: toDisplayPath(resolved, options.cwd),
  };
}
function assertBoundaryRead(opened, targetPath) {
  if (opened.ok) return;
  const reason = opened.reason === "validation" ? "unsafe path" : "path not found";
  throw new Error(`Failed boundary read for ${targetPath} (${reason})`);
}
function toDisplayPath(resolved, cwd) {
  const relative = path.relative(cwd, resolved);
  if (!relative || relative === "") return path.basename(resolved);
  if (relativePathEscapesRoot(relative)) return resolved;
  return relative;
}
function relativePathEscapesRoot(relativePath) {
  return (
    relativePath === ".." ||
    relativePath.startsWith("../") ||
    relativePath.startsWith("..\\") ||
    path.isAbsolute(relativePath)
  );
}
function parsePatchText(input) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Invalid patch: input is empty.");
  const validated = checkPatchBoundariesLenient(trimmed.split(/\r?\n/));
  const hunks = [];
  const lastLineIndex = validated.length - 1;
  let remaining = validated.slice(1, lastLineIndex);
  let lineNumber = 2;
  while (remaining.length > 0) {
    const { hunk, consumed } = parseOneHunk(remaining, lineNumber);
    hunks.push(hunk);
    lineNumber += consumed;
    remaining = remaining.slice(consumed);
  }
  return {
    hunks,
    patch: validated.join("\n"),
  };
}
function checkPatchBoundariesLenient(lines) {
  const strictError = checkPatchBoundariesStrict(lines);
  if (!strictError) return lines;
  if (lines.length < 4) throw new Error(strictError);
  const first = lines[0];
  const last = lines.at(-1);
  if (
    last &&
    (first === "<<EOF" || first === "<<'EOF'" || first === '<<"EOF"') &&
    last.endsWith("EOF")
  ) {
    const inner = lines.slice(1, -1);
    const innerError = checkPatchBoundariesStrict(inner);
    if (!innerError) return inner;
    throw new Error(innerError);
  }
  throw new Error(strictError);
}
function checkPatchBoundariesStrict(lines) {
  const firstLine = lines[0]?.trim();
  const lastLine = lines[lines.length - 1]?.trim();
  if (firstLine === BEGIN_PATCH_MARKER && lastLine === END_PATCH_MARKER) return null;
  if (firstLine !== BEGIN_PATCH_MARKER)
    return "The first line of the patch must be '*** Begin Patch'";
  return "The last line of the patch must be '*** End Patch'";
}
function parseOneHunk(lines, lineNumber) {
  if (lines.length === 0) throw new Error(`Invalid patch hunk at line ${lineNumber}: empty hunk`);
  const firstLine = lines.at(0)?.trim();
  if (firstLine === void 0) throw new Error(`Invalid patch hunk at line ${lineNumber}: empty hunk`);
  if (firstLine.startsWith(ADD_FILE_MARKER)) {
    const targetPath = firstLine.slice(14);
    let contents = "";
    let consumed = 1;
    for (const addLine of lines.slice(1))
      if (addLine.startsWith("+")) {
        contents += `${addLine.slice(1)}\n`;
        consumed += 1;
      } else break;
    return {
      hunk: {
        kind: "add",
        path: targetPath,
        contents,
      },
      consumed,
    };
  }
  if (firstLine.startsWith(DELETE_FILE_MARKER))
    return {
      hunk: {
        kind: "delete",
        path: firstLine.slice(17),
      },
      consumed: 1,
    };
  if (firstLine.startsWith(UPDATE_FILE_MARKER)) {
    const targetPath = firstLine.slice(17);
    let remaining = lines.slice(1);
    let consumed = 1;
    let movePath;
    const moveCandidate = remaining[0]?.trim();
    if (moveCandidate?.startsWith(MOVE_TO_MARKER)) {
      movePath = moveCandidate.slice(13);
      remaining = remaining.slice(1);
      consumed += 1;
    }
    const chunks = [];
    while (remaining.length > 0) {
      const firstRemaining = remaining.at(0);
      if (firstRemaining === void 0) break;
      if (firstRemaining.trim() === "") {
        remaining = remaining.slice(1);
        consumed += 1;
        continue;
      }
      if (firstRemaining.startsWith("***")) break;
      const { chunk, consumed: chunkLines } = parseUpdateFileChunk(
        remaining,
        lineNumber + consumed,
        chunks.length === 0,
      );
      chunks.push(chunk);
      remaining = remaining.slice(chunkLines);
      consumed += chunkLines;
    }
    if (chunks.length === 0)
      throw new Error(
        `Invalid patch hunk at line ${lineNumber}: Update file hunk for path '${targetPath}' is empty`,
      );
    return {
      hunk: {
        kind: "update",
        path: targetPath,
        movePath,
        chunks,
      },
      consumed,
    };
  }
  throw new Error(
    `Invalid patch hunk at line ${lineNumber}: '${lines[0]}' is not a valid hunk header. Valid hunk headers: '*** Add File: {path}', '*** Delete File: {path}', '*** Update File: {path}'`,
  );
}
function parseUpdateFileChunk(lines, lineNumber, allowMissingContext) {
  if (lines.length === 0)
    throw new Error(
      `Invalid patch hunk at line ${lineNumber}: Update hunk does not contain any lines`,
    );
  let changeContext;
  let startIndex = 0;
  const firstLine = lines.at(0);
  if (firstLine === EMPTY_CHANGE_CONTEXT_MARKER) startIndex = 1;
  else if (firstLine?.startsWith(CHANGE_CONTEXT_MARKER)) {
    changeContext = firstLine.slice(3);
    startIndex = 1;
  } else if (!allowMissingContext)
    throw new Error(
      `Invalid patch hunk at line ${lineNumber}: Expected update hunk to start with a @@ context marker, got: '${firstLine}'`,
    );
  if (startIndex >= lines.length)
    throw new Error(
      `Invalid patch hunk at line ${lineNumber + 1}: Update hunk does not contain any lines`,
    );
  const chunk = {
    changeContext,
    oldLines: [],
    newLines: [],
    isEndOfFile: false,
  };
  let parsedLines = 0;
  for (const line of lines.slice(startIndex)) {
    if (line === EOF_MARKER) {
      if (parsedLines === 0)
        throw new Error(
          `Invalid patch hunk at line ${lineNumber + 1}: Update hunk does not contain any lines`,
        );
      chunk.isEndOfFile = true;
      parsedLines += 1;
      break;
    }
    const marker = line[0];
    if (!marker) {
      chunk.oldLines.push("");
      chunk.newLines.push("");
      parsedLines += 1;
      continue;
    }
    if (marker === " ") {
      const content = line.slice(1);
      chunk.oldLines.push(content);
      chunk.newLines.push(content);
      parsedLines += 1;
      continue;
    }
    if (marker === "+") {
      chunk.newLines.push(line.slice(1));
      parsedLines += 1;
      continue;
    }
    if (marker === "-") {
      chunk.oldLines.push(line.slice(1));
      parsedLines += 1;
      continue;
    }
    if (parsedLines === 0)
      throw new Error(
        `Invalid patch hunk at line ${lineNumber + 1}: Unexpected line found in update hunk: '${line}'. Every line should start with ' ' (context line), '+' (added line), or '-' (removed line)`,
      );
    break;
  }
  return {
    chunk,
    consumed: parsedLines + startIndex,
  };
}
//#endregion
//#region src/agents/agent-tools.ts
/**
 * Builds the effective OpenClaw agent tool surface.
 * Assembles core, shell, channel, OpenClaw, plugin, and Tool Search tools, then
 * applies sandbox, profile, provider, sender, group, and sub-agent policy.
 */
const MEMORY_FLUSH_ALLOWED_TOOL_NAMES = /* @__PURE__ */ new Set(["read", "write"]);
function hasExplicitDenyPolicy(policy) {
  return (
    Array.isArray(policy?.deny) &&
    policy.deny.some((entry) => typeof entry === "string" && entry.trim())
  );
}
function readOnlySandboxReadMounts(sandbox) {
  if (!sandbox) return;
  const mounts = [];
  if (sandbox.workspaceAccess === "ro" && sandbox.agentWorkspaceDir !== sandbox.workspaceDir)
    mounts.push({
      containerRoot: SANDBOX_AGENT_WORKSPACE_MOUNT,
      hostRoot: sandbox.agentWorkspaceDir,
    });
  if (sandbox.workspaceAccess === "rw")
    mounts.push(
      ...resolveReadOnlyWorkspaceSkillMounts({
        workspaceDir: sandbox.workspaceDir,
        agentWorkspaceDir: sandbox.agentWorkspaceDir,
        skillsWorkspaceDir: sandbox.skillsWorkspaceDir,
        workdir: sandbox.containerWorkdir,
        workspaceAccess: sandbox.workspaceAccess,
      }).map((mount) => ({
        containerRoot: mount.containerPath,
        hostRoot: mount.hostPath,
      })),
    );
  return mounts.length > 0 ? mounts : void 0;
}
function resolveSkillReadRoots(skillsSnapshot) {
  const roots = /* @__PURE__ */ new Set();
  for (const skill of skillsSnapshot?.resolvedSkills ?? []) {
    const baseDir = typeof skill.baseDir === "string" ? skill.baseDir.trim() : "";
    const filePath = typeof skill.filePath === "string" ? skill.filePath.trim() : "";
    const root = baseDir || (filePath ? path.dirname(filePath) : "");
    if (!root || !path.isAbsolute(root)) continue;
    roots.add(path.resolve(root));
  }
  if (roots.size === 0) return;
  return Array.from(roots);
}
const bashToolsModuleLoader = createLazyImportLoader(() => import("./bash-tools-DVGiUk7W.js"));
function loadBashToolsModule() {
  return bashToolsModuleLoader.load();
}
function createLazyProcessTool(defaults) {
  let loadedTool;
  const loadTool = async () => {
    if (!loadedTool) {
      const { createProcessTool } = await loadBashToolsModule();
      loadedTool = createProcessTool(defaults);
    }
    return loadedTool;
  };
  return {
    name: "process",
    label: "process",
    displaySummary: PROCESS_TOOL_DISPLAY_SUMMARY,
    description: describeProcessTool({ hasCronTool: defaults?.hasCronTool === true }),
    parameters: processSchema,
    execute: async (...args) => (await loadTool()).execute(...args),
  };
}
/** Resolve the process-tool isolation key for exec/process session state. */
function resolveProcessToolScopeKey(params) {
  const explicitScopeKey = params.scopeKey?.trim();
  if (explicitScopeKey) return explicitScopeKey;
  const sessionKey = params.sessionKey?.trim();
  if (sessionKey) return sessionKey;
  const sessionId = params.sessionId?.trim();
  if (sessionId) return sessionId;
  const agentId = params.agentId?.trim();
  return agentId ? `agent:${agentId}` : void 0;
}
function applyModelProviderToolPolicy(toolsInput, params) {
  let tools = toolsInput;
  tools = filterLocalModelLeanTools({
    tools,
    config: params?.config,
    agentId: params?.agentId,
    sessionKey: params?.sessionKey,
    preserveToolNames: params?.localModelLeanPreserveToolNames ?? params?.runtimeToolAllowlist,
  });
  if (
    params?.suppressManagedWebSearch !== false &&
    shouldSuppressManagedWebSearchTool({
      config: params?.config,
      modelProvider: params?.modelProvider,
      modelApi: params?.modelApi,
      modelId: params?.modelId,
      agentId: params?.agentId,
      sessionKey: params?.sessionKey,
      agentDir: params?.agentDir,
    })
  )
    return tools.filter((tool) => tool.name !== "web_search");
  return tools;
}
function createOpenClawCodingToolsInternal(options) {
  const execToolName = "exec";
  const sandbox = options?.sandbox?.enabled ? options.sandbox : void 0;
  const isMemoryFlushRun = options?.trigger === "memory";
  if (isMemoryFlushRun && !options?.memoryFlushWritePath)
    throw new Error("memoryFlushWritePath required for memory-triggered tool runs");
  const memoryFlushWritePath = isMemoryFlushRun ? options.memoryFlushWritePath : void 0;
  const cronSelfRemoveOnlyJobId =
    options?.trigger === "cron" && options.jobId?.trim() ? options.jobId.trim() : void 0;
  const sandboxToolPolicy = sandbox?.tools;
  const capabilityProfile =
    options?.conversationCapabilityProfile ??
    resolveConversationCapabilityProfile({
      config: options?.config,
      sessionKey: options?.sessionKey,
      runSessionKey: options?.runSessionKey,
      sessionId: options?.sessionId,
      runId: options?.runId,
      agentId: options?.agentId,
      agentDir: options?.agentDir,
      agentAccountId: options?.agentAccountId,
      messageProvider: options?.messageProvider,
      messageChannel: options?.messageChannel,
      chatType: options?.chatType,
      messageTo: options?.messageTo,
      messageThreadId: options?.messageThreadId,
      currentChannelId: options?.currentChannelId,
      currentMessagingTarget: options?.currentMessagingTarget,
      currentThreadTs: options?.currentThreadTs,
      currentMessageId: options?.currentMessageId,
      groupId: options?.groupId,
      groupChannel: options?.groupChannel,
      groupSpace: options?.groupSpace,
      memberRoleIds: options?.memberRoleIds,
      spawnedBy: options?.spawnedBy,
      senderId: options?.senderId,
      senderName: options?.senderName,
      senderUsername: options?.senderUsername,
      senderE164: options?.senderE164,
      senderIsOwner: options?.senderIsOwner,
      modelProvider: options?.modelProvider,
      modelId: options?.modelId,
      modelApi: options?.modelApi,
      modelContextWindowTokens: options?.modelContextWindowTokens,
      modelHasVision: options?.modelHasVision,
      workspaceDir: options?.workspaceDir,
      cwd: options?.cwd,
      spawnWorkspaceDir: options?.spawnWorkspaceDir,
      skillsSnapshot: options?.skillsSnapshot,
      sandboxToolPolicy,
      runtimeToolAllowlist: options?.runtimeToolAllowlist,
    });
  const {
    agentId,
    globalPolicy,
    globalProviderPolicy,
    agentPolicy,
    agentProviderPolicy,
    profile,
    providerProfile,
    profilePolicy,
    providerProfilePolicy,
    profileAlsoAllow,
    providerProfileAlsoAllow,
    groupPolicy,
    senderPolicy,
    subagentPolicy,
    inheritedToolPolicy,
    runtimePluginToolGrant,
  } = capabilityProfile.policy;
  const enableHeartbeatTool =
    options?.enableHeartbeatTool === true ||
    (options?.trigger === "heartbeat" &&
      options?.config?.messages?.visibleReplies === "message_tool");
  const forceHeartbeatTool = options?.forceHeartbeatTool === true || enableHeartbeatTool;
  const toolSearchConfig = resolveToolSearchConfig(options?.config);
  const toolSearchControlsEnabled =
    options?.includeToolSearchControls === true && toolSearchConfig.enabled;
  const toolSearchControlAllowlist = toolSearchControlsEnabled
    ? [
        TOOL_SEARCH_CODE_MODE_TOOL_NAME,
        TOOL_SEARCH_RAW_TOOL_NAME,
        TOOL_DESCRIBE_RAW_TOOL_NAME,
        TOOL_CALL_RAW_TOOL_NAME,
      ]
    : [];
  const mergeToolSearchControlAllowlist = (policy) =>
    mergeAlsoAllowPolicy(policy, toolSearchControlAllowlist);
  const runtimeToolAllowlistIncludesMessage = expandToolGroups(
    options?.runtimeToolAllowlist ?? [],
  ).some((toolName) => {
    const normalized = normalizeToolName(toolName);
    return normalized === "*" || normalized === "message";
  });
  const localModelLeanPreserveToolNames = resolveLocalModelLeanPreserveToolNames({
    toolNames: capabilityProfile.policy.explicitToolOverrideAllowlist,
    forceMessageTool: options?.forceMessageTool,
    sourceReplyDeliveryMode: options?.sourceReplyDeliveryMode,
  });
  const runtimeProfileAlsoAllow = [
    ...(options?.forceMessageTool || options?.sourceReplyDeliveryMode === "message_tool_only"
      ? ["message"]
      : []),
    ...(runtimeToolAllowlistIncludesMessage ? ["message"] : []),
    ...(forceHeartbeatTool ? [HEARTBEAT_RESPONSE_TOOL_NAME] : []),
    ...toolSearchControlAllowlist,
  ];
  const profilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(profilePolicy, [
    ...(profileAlsoAllow ?? []),
    ...runtimeProfileAlsoAllow,
  ]);
  const providerProfilePolicyWithAlsoAllow = mergeAlsoAllowPolicy(providerProfilePolicy, [
    ...(providerProfileAlsoAllow ?? []),
    ...runtimeProfileAlsoAllow,
  ]);
  const scopeKey = resolveProcessToolScopeKey({
    scopeKey: options?.exec?.scopeKey,
    sessionKey: options?.sessionKey,
    sessionId: options?.sessionId,
    agentId,
  });
  const globalPolicyWithToolSearchControls = mergeToolSearchControlAllowlist(globalPolicy);
  const globalProviderPolicyWithToolSearchControls =
    mergeToolSearchControlAllowlist(globalProviderPolicy);
  const agentPolicyWithToolSearchControls = mergeToolSearchControlAllowlist(agentPolicy);
  const agentProviderPolicyWithToolSearchControls =
    mergeToolSearchControlAllowlist(agentProviderPolicy);
  const groupPolicyWithToolSearchControls = mergeToolSearchControlAllowlist(groupPolicy);
  const senderPolicyWithToolSearchControls = mergeToolSearchControlAllowlist(senderPolicy);
  const sandboxToolPolicyWithToolSearchControls =
    mergeToolSearchControlAllowlist(sandboxToolPolicy);
  const subagentPolicyWithToolSearchControls = mergeToolSearchControlAllowlist(subagentPolicy);
  const allowBackground = isToolAllowedByPolicies("process", [
    profilePolicyWithAlsoAllow,
    providerProfilePolicyWithAlsoAllow,
    globalPolicyWithToolSearchControls,
    globalProviderPolicyWithToolSearchControls,
    agentPolicyWithToolSearchControls,
    agentProviderPolicyWithToolSearchControls,
    groupPolicyWithToolSearchControls,
    senderPolicyWithToolSearchControls,
    sandboxToolPolicyWithToolSearchControls,
    subagentPolicyWithToolSearchControls,
    inheritedToolPolicy,
  ]);
  options?.recordToolPrepStage?.("tool-policy");
  const execConfig = resolveExecToolConfig({
    cfg: options?.config,
    agentId,
  });
  const fsConfig = resolveToolFsConfig({
    cfg: options?.config,
    agentId,
  });
  const fsPolicy = createToolFsPolicy({
    workspaceOnly: isMemoryFlushRun || fsConfig.workspaceOnly,
  });
  const sandboxRoot = sandbox?.workspaceDir;
  const sandboxFsBridge = sandbox?.fsBridge;
  const allowWorkspaceWrites = sandbox?.workspaceAccess !== "ro";
  const workspaceRoot = capabilityProfile.workspace.workspaceRoot;
  const runtimeRoot = capabilityProfile.workspace.runtimeRoot;
  const codingRoot = sandboxRoot ?? runtimeRoot;
  const memoryFlushWriteRoot = sandboxRoot ?? workspaceRoot;
  const includeCoreTools = options?.includeCoreTools !== false;
  const toolConstructionPlan = options?.toolConstructionPlan ?? {
    includeBaseCodingTools: includeCoreTools,
    includeShellTools: includeCoreTools,
    includeChannelTools: includeCoreTools,
    includeOpenClawTools: includeCoreTools,
    includePluginTools: true,
  };
  const includeBaseCodingTools = includeCoreTools && toolConstructionPlan.includeBaseCodingTools;
  const includeShellTools = includeCoreTools && toolConstructionPlan.includeShellTools;
  const includeOpenClawTools = includeCoreTools && toolConstructionPlan.includeOpenClawTools;
  const includeChannelTools = toolConstructionPlan.includeChannelTools;
  const includePluginTools = toolConstructionPlan.includePluginTools;
  const workspaceOnly = fsPolicy.workspaceOnly;
  const skillReadRoots = sandboxRoot ? void 0 : resolveSkillReadRoots(options?.skillsSnapshot);
  const applyPatchConfig = execConfig.applyPatch;
  const applyPatchWorkspaceOnly = workspaceOnly || applyPatchConfig?.workspaceOnly !== false;
  const applyPatchEnabled =
    applyPatchConfig?.enabled !== false &&
    isApplyPatchAllowedForModel({
      modelProvider: options?.modelProvider,
      modelId: options?.modelId,
      allowModels: applyPatchConfig?.allowModels,
    });
  if (sandboxRoot && !sandboxFsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
  const imageSanitization = resolveImageSanitizationLimits(options?.config);
  options?.recordToolPrepStage?.("workspace-policy");
  const base = [];
  if (includeBaseCodingTools)
    for (const tool of createCodingTools(codingRoot)) {
      if (tool.name === "read") {
        if (sandboxRoot) {
          const sandboxed = createSandboxedReadTool({
            root: sandboxRoot,
            bridge: sandboxFsBridge,
            modelContextWindowTokens: options?.modelContextWindowTokens,
            imageSanitization,
          });
          const guarded = workspaceOnly
            ? wrapToolWorkspaceRootGuardWithOptions(sandboxed, sandboxRoot, {
                additionalContainerMounts: readOnlySandboxReadMounts(sandbox),
                containerWorkdir: sandbox.containerWorkdir,
              })
            : sandboxed;
          base.push(
            wrapReadToolWithSkillContent(guarded, options?.skillsSnapshot?.resolvedSkills, {
              modelContextWindowTokens: options?.modelContextWindowTokens,
              imageSanitization,
            }),
          );
          continue;
        }
        const wrapped = createOpenClawReadTool(createReadTool(codingRoot), {
          modelContextWindowTokens: options?.modelContextWindowTokens,
          imageSanitization,
        });
        const guarded = workspaceOnly
          ? wrapToolWorkspaceRootGuardWithOptions(wrapped, codingRoot, {
              additionalRoots: skillReadRoots,
            })
          : wrapped;
        base.push(
          wrapReadToolWithSkillContent(guarded, options?.skillsSnapshot?.resolvedSkills, {
            modelContextWindowTokens: options?.modelContextWindowTokens,
            imageSanitization,
          }),
        );
        continue;
      }
      if (tool.name === "bash" || tool.name === execToolName) continue;
      if (tool.name === "write") {
        if (sandboxRoot) continue;
        const wrapped = createHostWorkspaceWriteTool(codingRoot, { workspaceOnly });
        base.push(workspaceOnly ? wrapToolWorkspaceRootGuard(wrapped, codingRoot) : wrapped);
        continue;
      }
      if (tool.name === "edit") {
        if (sandboxRoot) continue;
        const wrapped = createHostWorkspaceEditTool(codingRoot, { workspaceOnly });
        base.push(workspaceOnly ? wrapToolWorkspaceRootGuard(wrapped, codingRoot) : wrapped);
        continue;
      }
      base.push(tool);
    }
  options?.recordToolPrepStage?.("base-coding-tools");
  const { cleanupMs: cleanupMsOverride, ...execDefaults } = options?.exec ?? {};
  const effectiveExecPolicy = applyExecPolicyLayer(execConfig, options?.exec);
  const execTool = includeShellTools
    ? createLazyExecTool({
        ...execDefaults,
        host: options?.exec?.host ?? execConfig.host,
        mode: effectiveExecPolicy.mode,
        security: effectiveExecPolicy.security,
        ask: effectiveExecPolicy.ask,
        config: options?.exec?.config ?? options?.config,
        reviewer: options?.exec?.reviewer ?? execConfig.reviewer,
        trigger: options?.trigger,
        node: options?.exec?.node ?? execConfig.node,
        pathPrepend: options?.exec?.pathPrepend ?? execConfig.pathPrepend,
        safeBins: options?.exec?.safeBins ?? execConfig.safeBins,
        strictInlineEval: options?.exec?.strictInlineEval ?? execConfig.strictInlineEval,
        commandHighlighting: options?.exec?.commandHighlighting ?? execConfig.commandHighlighting,
        safeBinTrustedDirs: options?.exec?.safeBinTrustedDirs ?? execConfig.safeBinTrustedDirs,
        safeBinProfiles: options?.exec?.safeBinProfiles ?? execConfig.safeBinProfiles,
        agentId,
        cwd: codingRoot,
        allowBackground,
        scopeKey,
        sessionKey: options?.sessionKey,
        sessionId: options?.sessionId,
        sessionStore: options?.config?.session?.store,
        mainKey: options?.config?.session?.mainKey,
        sessionScope: options?.config?.session?.scope,
        eventRouting: resolveEventSessionRoutingPolicy({
          cfg: options?.config,
          sessionKey: options?.sessionKey,
          channel: options?.messageProvider,
          accountId: options?.agentAccountId,
        }),
        messageProvider: options?.messageProvider,
        currentChannelId: options?.currentChannelId,
        currentThreadTs: options?.currentThreadTs,
        channelContext: options?.channelContext,
        accountId: options?.agentAccountId,
        approvalReviewerDeviceId: options?.approvalReviewerDeviceId,
        backgroundMs: options?.exec?.backgroundMs ?? execConfig.backgroundMs,
        timeoutSec: options?.exec?.timeoutSec ?? execConfig.timeoutSec,
        approvalRunningNoticeMs:
          options?.exec?.approvalRunningNoticeMs ?? execConfig.approvalRunningNoticeMs,
        notifyOnExit: options?.exec?.notifyOnExit ?? execConfig.notifyOnExit,
        notifyOnExitEmptySuccess:
          options?.exec?.notifyOnExitEmptySuccess ?? execConfig.notifyOnExitEmptySuccess,
        sandbox: sandbox
          ? {
              containerName: sandbox.containerName,
              workspaceDir: sandbox.workspaceDir,
              containerWorkdir: sandbox.containerWorkdir,
              workdirValidation: sandbox.backend?.workdirValidation,
              validateWorkdir: sandbox.backend?.validateWorkdir?.bind(sandbox.backend),
              discardPreparedWorkdir: sandbox.backend?.discardPreparedWorkdir?.bind(
                sandbox.backend,
              ),
              workdirRoots: sandbox.backend?.workdirRoots,
              env: sandbox.backend?.env ?? sandbox.docker.env,
              buildExecSpec: sandbox.backend?.buildExecSpec.bind(sandbox.backend),
              finalizeExec: sandbox.backend?.finalizeExec?.bind(sandbox.backend),
            }
          : void 0,
      })
    : null;
  const processTool = includeShellTools
    ? createLazyProcessTool({
        cleanupMs: cleanupMsOverride ?? execConfig.cleanupMs,
        scopeKey,
      })
    : null;
  const applyPatchTool =
    !includeShellTools || !applyPatchEnabled || (sandboxRoot && !allowWorkspaceWrites)
      ? null
      : createApplyPatchTool({
          cwd: codingRoot,
          sandbox:
            sandboxRoot && allowWorkspaceWrites
              ? {
                  root: sandboxRoot,
                  bridge: sandboxFsBridge,
                }
              : void 0,
          workspaceOnly: applyPatchWorkspaceOnly,
        });
  options?.recordToolPrepStage?.("shell-tools");
  const ownerOnlyCoreToolDenylist =
    options?.senderIsOwner === false ? [...GATEWAY_OWNER_ONLY_CORE_TOOLS] : [];
  const ownerOnlyCoreToolPolicy =
    ownerOnlyCoreToolDenylist.length > 0 ? { deny: ownerOnlyCoreToolDenylist } : void 0;
  const pluginToolAllowlist = appendRuntimePluginToolGrant(
    capabilityProfile.policy.explicitToolAllowlist,
    runtimePluginToolGrant,
  );
  const pluginToolDenylist = [
    ...capabilityProfile.policy.explicitToolDenylist,
    ...ownerOnlyCoreToolDenylist,
  ];
  const inheritedToolDenylist = [...pluginToolDenylist];
  const inheritedToolAllowlist = [];
  const toolPolicyInheritanceSources = capabilityProfile.policy.inheritancePolicies;
  const shouldInheritEffectiveToolAllowlist =
    toolPolicyInheritanceSources.some(hasRestrictiveAllowPolicy);
  const cronCreatorToolAllowlist = options?.cronCreatorToolAllowlistRef ?? [];
  const shouldCaptureCronCreatorToolAllowlist = toolPolicyInheritanceSources.some(
    (policy) => hasRestrictiveAllowPolicy(policy) || hasExplicitDenyPolicy(policy),
  );
  const pluginToolCallerIdentity =
    agentId && options?.sessionKey?.trim()
      ? {
          agentId,
          sessionKey: options.sessionKey.trim(),
          turnSourceChannel: resolveGatewayMessageChannel(
            options.messageChannel ?? options.messageProvider,
          ),
          turnSourceTo:
            options.currentMessagingTarget ?? options.currentChannelId ?? options.messageTo,
          turnSourceAccountId: options.agentAccountId,
          turnSourceThreadId: options.currentThreadTs ?? options.messageThreadId,
        }
      : void 0;
  const pluginToolsOnly = filterToolsByClientCaps(
    includeOpenClawTools || !includePluginTools
      ? []
      : resolveOpenClawPluginToolsForOptions({
          options: {
            agentSessionKey: options?.sessionKey,
            agentChannel: resolveGatewayMessageChannel(
              options?.messageChannel ?? options?.messageProvider,
            ),
            agentAccountId: options?.agentAccountId,
            agentTo: options?.messageTo,
            agentThreadId: options?.messageThreadId,
            nativeChannelId: options?.nativeChannelId,
            agentDir: options?.agentDir,
            workspaceDir: workspaceRoot,
            config: options?.config,
            fsPolicy,
            requesterSenderId: options?.senderId,
            senderIsOwner: options?.senderIsOwner,
            sessionId: options?.sessionId,
            oneShotCliRun: options?.oneShotCliRun,
            sandboxBrowserBridgeUrl: sandbox?.browser?.bridgeUrl,
            allowHostBrowserControl: sandbox ? sandbox.browserAllowHostControl : true,
            sandboxed: Boolean(sandbox),
            pluginToolAllowlist,
            pluginToolDenylist,
            currentChannelId: options?.currentChannelId,
            currentMessagingTarget: options?.currentMessagingTarget,
            currentThreadTs: options?.currentThreadTs,
            currentMessageId: options?.currentMessageId,
            modelProvider: options?.modelProvider,
            modelId: options?.modelId,
            modelHasVision: options?.modelHasVision,
            requireExplicitMessageTarget: options?.requireExplicitMessageTarget,
            disableMessageTool: options?.disableMessageTool,
            requesterAgentIdOverride: agentId,
            allowGatewaySubagentBinding: options?.allowGatewaySubagentBinding,
            authProfileStore: options?.authProfileStore,
          },
          resolvedConfig: options?.config,
        }),
    options?.clientCaps,
  ).map((tool) => wrapToolWithGatewayCallerIdentity(tool, pluginToolCallerIdentity));
  const ringZeroTools = includeOpenClawTools ? getActiveAgentRingZeroTools() : [];
  const toolSearchTools =
    toolSearchControlsEnabled && ringZeroTools.length === 0
      ? createToolSearchTools({
          config: options?.config,
          runtimeConfig: options?.config,
          agentId,
          sessionKey: options?.sessionKey,
          sessionId: options?.sessionId,
          runId: options?.runId,
          catalogRef: options?.toolSearchCatalogRef,
          abortSignal: options?.abortSignal,
          executeTool: options?.toolSearchCatalogExecutor,
        })
      : [];
  const tools = [
    ...base,
    ...(includeBaseCodingTools && sandboxRoot
      ? allowWorkspaceWrites
        ? [
            workspaceOnly
              ? wrapToolWorkspaceRootGuardWithOptions(
                  createSandboxedEditTool({
                    root: sandboxRoot,
                    bridge: sandboxFsBridge,
                  }),
                  sandboxRoot,
                  { containerWorkdir: sandbox.containerWorkdir },
                )
              : createSandboxedEditTool({
                  root: sandboxRoot,
                  bridge: sandboxFsBridge,
                }),
            workspaceOnly
              ? wrapToolWorkspaceRootGuardWithOptions(
                  createSandboxedWriteTool({
                    root: sandboxRoot,
                    bridge: sandboxFsBridge,
                  }),
                  sandboxRoot,
                  { containerWorkdir: sandbox.containerWorkdir },
                )
              : createSandboxedWriteTool({
                  root: sandboxRoot,
                  bridge: sandboxFsBridge,
                }),
          ]
        : []
      : []),
    ...(includeShellTools && applyPatchTool ? [applyPatchTool] : []),
    ...(execTool ? [execTool] : []),
    ...(processTool ? [processTool] : []),
    ...(includeChannelTools ? listChannelAgentTools({ cfg: options?.config }) : []),
    ...(includeOpenClawTools
      ? mergeAgentRingZeroTools(
          ringZeroTools,
          createOpenClawTools({
            ...(options?.crestodianTool ? { crestodianTool: options.crestodianTool } : {}),
            sandboxBrowserBridgeUrl: sandbox?.browser?.bridgeUrl,
            allowHostBrowserControl: sandbox ? sandbox.browserAllowHostControl : true,
            agentSessionKey: options?.sessionKey,
            runId: options?.runId,
            runSessionKey: options?.runSessionKey,
            agentChannel: resolveGatewayMessageChannel(
              options?.messageChannel ?? options?.messageProvider,
            ),
            agentAccountId: options?.agentAccountId,
            agentTo: options?.messageTo,
            agentThreadId: options?.messageThreadId,
            nativeChannelId: options?.nativeChannelId,
            messageActionTurnCapability: options?.messageActionTurnCapability,
            agentGroupId: options?.groupId ?? null,
            agentGroupChannel: options?.groupChannel ?? null,
            agentGroupSpace: options?.groupSpace ?? null,
            agentMemberRoleIds: options?.memberRoleIds,
            agentDir: options?.agentDir,
            sandboxRoot,
            sandboxContainerWorkdir: sandbox?.containerWorkdir,
            sandboxFsBridge,
            fsPolicy,
            workspaceDir: workspaceRoot,
            spawnWorkspaceDir: capabilityProfile.workspace.spawnWorkspaceRoot,
            cwd: sandbox
              ? (capabilityProfile.workspace.spawnWorkspaceRoot ?? runtimeRoot)
              : runtimeRoot,
            sandboxed: Boolean(sandbox),
            config: options?.config,
            clientCaps: options?.clientCaps,
            pluginToolAllowlist,
            pluginToolDenylist,
            cronCreatorToolAllowlist: shouldCaptureCronCreatorToolAllowlist
              ? cronCreatorToolAllowlist
              : void 0,
            currentChannelId: options?.currentChannelId,
            currentChatType: options?.chatType,
            currentMessagingTarget: options?.currentMessagingTarget,
            currentThreadTs: options?.currentThreadTs,
            currentMessageId: options?.currentMessageId,
            currentInboundAudio: options?.currentInboundAudio,
            hasCurrentInboundAudio: options?.hasCurrentInboundAudio,
            modelProvider: options?.modelProvider,
            modelId: options?.modelId,
            skillWorkshop: options?.skillWorkshop,
            replyToMode: options?.replyToMode,
            hasRepliedRef: options?.hasRepliedRef,
            modelHasVision: options?.modelHasVision,
            computerContextEpoch: options?.computerContextEpoch,
            requireExplicitMessageTarget: options?.requireExplicitMessageTarget,
            sourceReplyDeliveryMode: options?.sourceReplyDeliveryMode,
            taskSuggestionDeliveryMode: options?.taskSuggestionDeliveryMode,
            inboundEventKind: options?.inboundEventKind,
            disableMessageTool: options?.disableMessageTool,
            enableHeartbeatTool,
            disablePluginTools: !includePluginTools,
            wrapBeforeToolCallHook: false,
            ...(cronSelfRemoveOnlyJobId ? { cronSelfRemoveOnlyJobId } : {}),
            requesterAgentIdOverride: agentId,
            requesterSenderId: options?.senderId,
            senderIsOwner: options?.senderIsOwner,
            authProfileStore: options?.authProfileStore,
            sessionId: options?.sessionId,
            oneShotCliRun: options?.oneShotCliRun,
            inheritedToolAllowlist,
            inheritedToolDenylist,
            onYield: options?.onYield,
            allowGatewaySubagentBinding: options?.allowGatewaySubagentBinding,
            recordToolPrepStage: options?.recordToolPrepStage,
          }),
        )
      : pluginToolsOnly),
    ...toolSearchTools,
  ];
  options?.recordToolPrepStage?.("openclaw-tools");
  const toolsForMemoryFlush = isMemoryFlushRun && memoryFlushWritePath ? [] : tools;
  if (isMemoryFlushRun && memoryFlushWritePath)
    for (const tool of tools) {
      if (!MEMORY_FLUSH_ALLOWED_TOOL_NAMES.has(tool.name)) continue;
      if (tool.name === "write") {
        toolsForMemoryFlush.push(
          wrapToolMemoryFlushAppendOnlyWrite(tool, {
            root: memoryFlushWriteRoot,
            relativePath: memoryFlushWritePath,
            containerWorkdir: sandbox?.containerWorkdir,
            sandbox:
              sandboxRoot && sandboxFsBridge
                ? {
                    root: sandboxRoot,
                    bridge: sandboxFsBridge,
                  }
                : void 0,
          }),
        );
        continue;
      }
      toolsForMemoryFlush.push(tool);
    }
  const unavailableCoreToolReason =
    isMemoryFlushRun && memoryFlushWritePath
      ? "memory-triggered compaction runs expose only read and append-only write"
      : void 0;
  const toolsForMessageProvider = filterToolsByMessageProvider(
    toolsForMemoryFlush,
    options?.toolPolicyMessageProvider ?? options?.messageProvider,
  );
  options?.recordToolPrepStage?.("message-provider-policy");
  const toolsForModelProvider = applyModelProviderToolPolicy(toolsForMessageProvider, {
    config: options?.config,
    modelProvider: options?.modelProvider,
    modelApi: options?.modelApi,
    modelId: options?.modelId,
    agentId: options?.agentId,
    sessionKey: options?.sessionKey,
    agentDir: options?.agentDir,
    modelCompat: options?.modelCompat,
    suppressManagedWebSearch: options?.suppressManagedWebSearch,
    runtimeToolAllowlist: options?.runtimeToolAllowlist,
    localModelLeanPreserveToolNames,
  });
  options?.recordToolPrepStage?.("model-provider-policy");
  const authorizedTools = mergeAgentRingZeroTools(
    ringZeroTools,
    applyToolPolicyPipeline({
      tools: toolsForModelProvider,
      toolMeta: (tool) => getPluginToolMeta(tool),
      warn: logWarn,
      steps: [
        ...buildDefaultToolPolicyPipelineSteps({
          profilePolicy: profilePolicyWithAlsoAllow,
          profile,
          profileUnavailableCoreWarningAllowlist: profilePolicy?.allow,
          providerProfilePolicy: providerProfilePolicyWithAlsoAllow,
          providerProfile,
          providerProfileUnavailableCoreWarningAllowlist: providerProfilePolicy?.allow,
          globalPolicy: globalPolicyWithToolSearchControls,
          globalProviderPolicy: globalProviderPolicyWithToolSearchControls,
          agentPolicy: agentPolicyWithToolSearchControls,
          agentProviderPolicy: agentProviderPolicyWithToolSearchControls,
          groupPolicy: groupPolicyWithToolSearchControls,
          senderPolicy: senderPolicyWithToolSearchControls,
          agentId,
          unavailableCoreToolReason,
        }),
        {
          policy: sandboxToolPolicyWithToolSearchControls,
          label: "sandbox tools.allow",
          unavailableCoreToolReason,
        },
        {
          policy: ownerOnlyCoreToolPolicy,
          label: "gateway sender owner-only tools",
          unavailableCoreToolReason,
        },
        {
          policy: subagentPolicyWithToolSearchControls,
          label: "subagent tools.allow",
          unavailableCoreToolReason,
        },
        {
          policy: inheritedToolPolicy,
          label: "inherited tools",
          unavailableCoreToolReason,
        },
      ],
      auditLogLevel: options?.toolPolicyAuditLogLevel,
      declaredToolAllowlist: buildDeclaredToolAllowlistContext({
        config: options?.config,
        workspaceDir: workspaceRoot,
        toolDenylist: pluginToolDenylist,
      }),
    }),
  );
  if (shouldInheritEffectiveToolAllowlist)
    replaceWithEffectiveToolAllowlist(inheritedToolAllowlist, authorizedTools);
  if (shouldCaptureCronCreatorToolAllowlist)
    replaceWithEffectiveCronCreatorToolAllowlist(
      cronCreatorToolAllowlist,
      authorizedTools,
      (tool) => getPluginToolMeta(tool),
    );
  options?.recordToolPrepStage?.("authorization-policy");
  const normalized = authorizedTools.map((tool) =>
    normalizeToolParameters(tool, {
      modelProvider: options?.modelProvider,
      modelId: options?.modelId,
      modelCompat: options?.modelCompat,
    }),
  );
  options?.recordToolPrepStage?.("schema-normalization");
  const turnSourceChannel = options?.messageChannel ?? options?.messageProvider;
  const turnSourceTo = options?.currentMessagingTarget ?? options?.currentChannelId;
  const hookContext = {
    agentId,
    ...(options?.config ? { config: options.config } : {}),
    cwd: codingRoot,
    workspaceDir: workspaceRoot,
    ...(options?.skillsSnapshot ? { skillsSnapshot: options.skillsSnapshot } : {}),
    ...(options?.skillUsagePaths ? { skillUsagePaths: options.skillUsagePaths } : {}),
    ...(sandboxRoot && allowWorkspaceWrites
      ? {
          sandbox: {
            root: sandboxRoot,
            bridge: sandboxFsBridge,
          },
        }
      : {}),
    sessionKey: options?.sessionKey,
    sessionId: options?.sessionId,
    runId: options?.runId,
    approvalReviewerDeviceId: options?.approvalReviewerDeviceId,
    channelId: options?.hookChannelId ?? options?.currentChannelId,
    ...(turnSourceChannel ? { turnSourceChannel } : {}),
    ...(turnSourceTo ? { turnSourceTo } : {}),
    ...(options?.agentAccountId ? { turnSourceAccountId: options.agentAccountId } : {}),
    ...(options?.currentThreadTs ? { turnSourceThreadId: options.currentThreadTs } : {}),
    ...(options?.trace ? { trace: options.trace } : {}),
    loopDetection: resolveToolLoopDetectionConfig({
      cfg: options?.config,
      agentId,
    }),
    onToolOutcome: options?.onToolOutcome,
    allocateToolOutcomeOrdinal: options?.allocateToolOutcomeOrdinal,
  };
  const hookOptions = { emitDiagnostics: options?.emitBeforeToolCallDiagnostics };
  const withHooks = normalized.map((tool) =>
    isToolWrappedWithBeforeToolCallHook(tool)
      ? rewrapToolWithBeforeToolCallHook(tool, hookContext, hookOptions)
      : wrapToolWithBeforeToolCallHook(tool, hookContext, hookOptions),
  );
  options?.recordToolPrepStage?.("tool-hooks");
  const withAbort = options?.abortSignal
    ? withHooks.map((tool) => wrapToolWithAbortSignal(tool, options.abortSignal))
    : withHooks;
  options?.recordToolPrepStage?.("abort-wrappers");
  const withDeferredFollowupDescriptions = applyDeferredFollowupToolDescriptions(withAbort, {
    agentId,
  });
  options?.recordToolPrepStage?.("deferred-followup-descriptions");
  return withDeferredFollowupDescriptions;
}
/** Build the runtime tool list exposed through the public agent harness SDK. */
function createOpenClawCodingTools(options) {
  return createOpenClawCodingToolsInternal(options);
}
//#endregion
export { resolveProcessToolScopeKey as n, createOpenClawCodingTools as t };
