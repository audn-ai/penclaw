import { cancel, confirm, isCancel } from "@clack/prompts";
import { t as resolveCleanupPlanFromDisk } from "./cleanup-plan-Y3Z1jAlI.js";
import "./config-BDv-QbJ6.js";
import {
  a as removeStateAndLinkedPaths,
  i as removePath,
  o as removeWorkspaceAttestationPaths,
  r as listAgentSessionDirs,
  s as removeWorkspaceDirs,
} from "./cleanup-utils-eg9gtrvN.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { a as isNixMode } from "./paths-DEklnbzU.js";
import { t as selectStyled } from "./prompt-select-styled-w98xOWqw.js";
import { n as stylePromptMessage, r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import { a as resolveGatewayService } from "./service-Dw37Ek79.js";
//#region src/commands/reset.ts
/**
 * Reset command implementation.
 *
 * It removes selected config/state/workspace surfaces after confirmation and
 * stops managed gateway services before deleting broader state.
 */
async function stopGatewayIfRunning(runtime) {
  if (isNixMode) return;
  const service = resolveGatewayService();
  let loaded;
  try {
    loaded = await service.isLoaded({ env: process.env });
  } catch (err) {
    runtime.error(`Gateway service check failed: ${String(err)}`);
    return;
  }
  if (!loaded) return;
  try {
    await service.stop({
      env: process.env,
      stdout: process.stdout,
    });
  } catch (err) {
    runtime.error(`Gateway stop failed: ${String(err)}`);
  }
}
function logBackupRecommendation(runtime) {
  runtime.log(`Recommended first: ${formatCliCommand("openclaw backup create")}`);
}
/** Runs the reset command for config, credential/session, or full state scopes. */
async function resetCommand(runtime, opts) {
  const interactive = !opts.nonInteractive;
  if (!interactive && !opts.yes) {
    runtime.error("Non-interactive mode requires --yes.");
    runtime.exit(1);
    return;
  }
  let scope = opts.scope;
  if (!scope) {
    if (!interactive) {
      runtime.error("Non-interactive mode requires --scope.");
      runtime.exit(1);
      return;
    }
    const selection = await selectStyled({
      message: "Reset scope",
      options: [
        {
          value: "config",
          label: "Config only",
          hint: "openclaw.json",
        },
        {
          value: "config+creds+sessions",
          label: "Config + credentials + sessions",
          hint: "keeps workspace + auth profiles",
        },
        {
          value: "full",
          label: "Full reset",
          hint: "state dir + workspace",
        },
      ],
      initialValue: "config+creds+sessions",
    });
    if (isCancel(selection)) {
      cancel(stylePromptTitle("Reset cancelled.") ?? "Reset cancelled.");
      runtime.exit(0);
      return;
    }
    scope = selection;
  }
  if (!["config", "config+creds+sessions", "full"].includes(scope)) {
    runtime.error('Invalid --scope. Expected "config", "config+creds+sessions", or "full".');
    runtime.exit(1);
    return;
  }
  if (interactive && !opts.yes) {
    const ok = await confirm({ message: stylePromptMessage(`Proceed with ${scope} reset?`) });
    if (isCancel(ok) || !ok) {
      cancel(stylePromptTitle("Reset cancelled.") ?? "Reset cancelled.");
      runtime.exit(0);
      return;
    }
  }
  const dryRun = Boolean(opts.dryRun);
  const { stateDir, configPath, oauthDir, configInsideState, oauthInsideState, workspaceDirs } =
    resolveCleanupPlanFromDisk();
  if (scope !== "config") {
    logBackupRecommendation(runtime);
    if (dryRun) runtime.log("[dry-run] stop gateway service");
    else await stopGatewayIfRunning(runtime);
  }
  if (scope === "config") {
    await removePath(configPath, runtime, {
      dryRun,
      label: configPath,
    });
    return;
  }
  if (scope === "config+creds+sessions") {
    await removePath(configPath, runtime, {
      dryRun,
      label: configPath,
    });
    await removePath(oauthDir, runtime, {
      dryRun,
      label: oauthDir,
    });
    const sessionDirs = await listAgentSessionDirs(stateDir);
    for (const dir of sessionDirs)
      await removePath(dir, runtime, {
        dryRun,
        label: dir,
      });
    runtime.log(`Next: ${formatCliCommand("openclaw onboard --install-daemon")}`);
    return;
  }
  if (scope === "full") {
    await removeStateAndLinkedPaths(
      {
        stateDir,
        configPath,
        oauthDir,
        configInsideState,
        oauthInsideState,
      },
      runtime,
      { dryRun },
    );
    await removeWorkspaceDirs(workspaceDirs, runtime, { dryRun });
    await removeWorkspaceAttestationPaths(workspaceDirs, runtime, { dryRun });
    runtime.log(`Next: ${formatCliCommand("openclaw onboard --install-daemon")}`);
  }
}
//#endregion
export { resetCommand };
