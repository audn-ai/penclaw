import path from "node:path";
import { o as resolveAgentWorkspaceDir } from "./agent-scope-config-DVIR1nBa.js";
import "./utils-DtcDeqWS.js";
import "./agent-scope-y9xQv_q1.js";
import { o as resolveBootstrapFilesForRun } from "./bootstrap-files-B9pwG25K.js";
import { f as buildBootstrapContextFiles } from "./embedded-agent-helpers-DH71Di6x.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  c as DEFAULT_USER_FILENAME,
  i as DEFAULT_IDENTITY_FILENAME,
  o as DEFAULT_SOUL_FILENAME,
} from "./workspace-DXzCbuC0.js";
//#region src/agents/realtime-bootstrap-context.ts
/**
 * Realtime bootstrap context loader.
 *
 * Voice/realtime sessions use this to inject selected profile files into model
 * instructions with deterministic ordering and a hard character budget.
 */
/** Default ordered profile files included in realtime bootstrap context. */
const REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES = [
  DEFAULT_IDENTITY_FILENAME,
  DEFAULT_USER_FILENAME,
  DEFAULT_SOUL_FILENAME,
];
const REALTIME_BOOTSTRAP_CONTEXT_FILE_NAME_SET = new Set(REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES);
const DEFAULT_REALTIME_BOOTSTRAP_CONTEXT_MAX_CHARS = 12e3;
const REALTIME_BOOTSTRAP_CONTEXT_TITLE = "OpenClaw realtime voice profile context:";
const REALTIME_BOOTSTRAP_CONTEXT_GUIDANCE =
  "Use these profile files for identity, persona, and user grounding; do not mention them unless asked.";
function isRealtimeBootstrapContextFileName(value) {
  return REALTIME_BOOTSTRAP_CONTEXT_FILE_NAME_SET.has(value);
}
function formatRealtimeBootstrapContextFileName(pathValue) {
  return path.basename(pathValue.trim().replace(/\\/g, "/"));
}
function resolveRealtimeBootstrapContextContentBudget(params) {
  const separatorChars = 2 * params.fileNames.length;
  const headingChars = params.fileNames.reduce(
    (total, fileName) => total + `### ${fileName}\n`.length,
    0,
  );
  return params.totalMaxChars - params.preamble.length - separatorChars - headingChars;
}
function normalizeRealtimeBootstrapContextFileNames(files, warn) {
  const normalized = [];
  for (const fileName of files) {
    if (isRealtimeBootstrapContextFileName(fileName)) {
      normalized.push(fileName);
      continue;
    }
    warn?.(`skipping unsupported realtime bootstrap context file "${fileName}"`);
  }
  return normalized;
}
/** Builds bounded realtime instructions from selected profile bootstrap files. */
async function resolveRealtimeBootstrapContextInstructions(params) {
  const requestedFiles = normalizeRealtimeBootstrapContextFileNames(
    params.files ?? REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES,
    params.warn,
  );
  if (requestedFiles.length === 0) return;
  const requestedOrder = new Map(requestedFiles.map((fileName, index) => [fileName, index]));
  const selectedFiles = (
    await resolveBootstrapFilesForRun({
      workspaceDir: resolveUserPath(resolveAgentWorkspaceDir(params.config, params.agentId)),
      config: params.config,
      sessionKey: params.sessionKey,
      agentId: params.agentId,
      warn: params.warn,
    })
  )
    .filter(
      (file) =>
        !file.missing &&
        isRealtimeBootstrapContextFileName(file.name) &&
        requestedOrder.has(file.name),
    )
    .toSorted((left, right) => {
      const leftOrder = isRealtimeBootstrapContextFileName(left.name)
        ? (requestedOrder.get(left.name) ?? 0)
        : 0;
      const rightOrder = isRealtimeBootstrapContextFileName(right.name)
        ? (requestedOrder.get(right.name) ?? 0)
        : 0;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.path.localeCompare(right.path);
    });
  if (selectedFiles.length === 0) return;
  const totalMaxChars = DEFAULT_REALTIME_BOOTSTRAP_CONTEXT_MAX_CHARS;
  const preamble = [REALTIME_BOOTSTRAP_CONTEXT_TITLE, REALTIME_BOOTSTRAP_CONTEXT_GUIDANCE].join(
    "\n",
  );
  const contentBudget = resolveRealtimeBootstrapContextContentBudget({
    preamble,
    fileNames: selectedFiles.map((file) => formatRealtimeBootstrapContextFileName(file.path)),
    totalMaxChars,
  });
  if (contentBudget <= 0) {
    params.warn?.(
      `realtime bootstrap context budget is too small to include selected profile files (limit ${totalMaxChars})`,
    );
    return;
  }
  const contextFiles = buildBootstrapContextFiles(selectedFiles, {
    maxChars: Math.max(1, Math.floor(contentBudget / selectedFiles.length)),
    totalMaxChars: contentBudget,
    warn: params.warn,
  });
  if (contextFiles.length === 0) return;
  const instructions = [
    preamble,
    ...contextFiles.map(
      (file) =>
        `### ${formatRealtimeBootstrapContextFileName(file.path)}\n${file.content.trimEnd()}`,
    ),
  ].join("\n\n");
  return instructions.length <= totalMaxChars
    ? instructions
    : truncateUtf16Safe(instructions, totalMaxChars);
}
//#endregion
export {
  resolveRealtimeBootstrapContextInstructions as n,
  REALTIME_BOOTSTRAP_CONTEXT_FILE_NAMES as t,
};
