import fs from "node:fs";
import path from "node:path";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
//#region src/agents/docs-path.ts
/**
 * Locates local OpenClaw docs/source roots for references shown to agents.
 */
const OPENCLAW_DOCS_URL = "https://docs.openclaw.ai";
const OPENCLAW_SOURCE_URL = "https://github.com/openclaw/openclaw";
function isUsableDocsDir(docsDir) {
  return fs.existsSync(path.join(docsDir, "docs.json"));
}
function isGitCheckout(rootDir) {
  return fs.existsSync(path.join(rootDir, ".git"));
}
/** Resolve a usable local docs directory, preferring the active workspace. */
async function resolveOpenClawDocsPath(params) {
  const workspaceDir = params.workspaceDir?.trim();
  if (workspaceDir) {
    const workspaceDocs = path.join(workspaceDir, "docs");
    if (isUsableDocsDir(workspaceDocs)) return workspaceDocs;
  }
  const packageRoot = await resolveOpenClawPackageRoot({
    cwd: params.cwd,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
  });
  if (!packageRoot) return null;
  const packageDocs = path.join(packageRoot, "docs");
  return isUsableDocsDir(packageDocs) ? packageDocs : null;
}
/** Resolve the package root only when it is a Git checkout. */
async function resolveOpenClawSourcePath(params) {
  const packageRoot = await resolveOpenClawPackageRoot({
    cwd: params.cwd,
    argv1: params.argv1,
    moduleUrl: params.moduleUrl,
  });
  if (!packageRoot || !isGitCheckout(packageRoot)) return null;
  return packageRoot;
}
/** Resolve docs and source roots concurrently for prompt/reference injection. */
async function resolveOpenClawReferencePaths(params) {
  const [docsPath, sourcePath] = await Promise.all([
    resolveOpenClawDocsPath(params),
    resolveOpenClawSourcePath(params),
  ]);
  return {
    docsPath,
    sourcePath,
  };
}
//#endregion
export { OPENCLAW_SOURCE_URL as n, resolveOpenClawReferencePaths as r, OPENCLAW_DOCS_URL as t };
