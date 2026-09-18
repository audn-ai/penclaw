import { r as resolveHookConfig } from "../../config-CzBjCjbr.js";
import { a as isAgentBootstrapEvent } from "../../internal-hooks-CckLIOgu.js";
import { d as normalizeTrimmedStringList } from "../../string-normalization-CRyoFBPt.js";
import { t as createSubsystemLogger } from "../../subsystem-Nlw-XKx1.js";
import {
  f as filterBootstrapFilesForSession,
  h as loadExtraBootstrapFilesWithDiagnostics,
} from "../../workspace-DXzCbuC0.js";
//#region src/hooks/bundled/bootstrap-extra-files/handler.ts
const HOOK_KEY = "bootstrap-extra-files";
const log = createSubsystemLogger("bootstrap-extra-files");
/** Resolve legacy and current config keys for extra bootstrap file patterns. */
function resolveExtraBootstrapPatterns(hookConfig) {
  const fromPaths = normalizeTrimmedStringList(hookConfig.paths);
  if (fromPaths.length > 0) return fromPaths;
  const fromPatterns = normalizeTrimmedStringList(hookConfig.patterns);
  if (fromPatterns.length > 0) return fromPatterns;
  return normalizeTrimmedStringList(hookConfig.files);
}
/** Agent-bootstrap hook that appends configured extra files to the session bootstrap set. */
const bootstrapExtraFilesHook = async (event) => {
  if (!isAgentBootstrapEvent(event)) return;
  const context = event.context;
  const hookConfig = resolveHookConfig(context.cfg, HOOK_KEY);
  if (!hookConfig || hookConfig.enabled === false) return;
  const patterns = resolveExtraBootstrapPatterns(hookConfig);
  if (patterns.length === 0) return;
  try {
    const { files: extras, diagnostics } = await loadExtraBootstrapFilesWithDiagnostics(
      context.workspaceDir,
      patterns,
    );
    if (diagnostics.length > 0)
      log.debug("skipped extra bootstrap candidates", {
        skipped: diagnostics.length,
        reasons: diagnostics.reduce((counts, item) => {
          counts[item.reason] = (counts[item.reason] ?? 0) + 1;
          return counts;
        }, {}),
      });
    if (extras.length === 0) return;
    context.bootstrapFiles = filterBootstrapFilesForSession(
      [...context.bootstrapFiles, ...extras],
      context.sessionKey,
    );
  } catch (err) {
    log.warn(`failed: ${String(err)}`);
  }
};
//#endregion
export { bootstrapExtraFilesHook as default };
