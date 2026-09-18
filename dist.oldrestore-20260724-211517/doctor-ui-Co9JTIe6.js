import fs from "node:fs/promises";
import path from "node:path";
import {
  i as resolveControlUiDistIndexPathForRoot,
  r as resolveControlUiDistIndexHealth,
} from "./control-ui-assets-Bfrq0NUW.js";
import { r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
//#region src/commands/doctor-ui.ts
/** Doctor checks and repairs for Control UI assets after gateway protocol changes. */
/** Detects missing or stale Control UI build artifacts relative to protocol schema changes. */
async function detectUiProtocolFreshnessIssues(opts = {}) {
  const root =
    opts.root ??
    (await resolveOpenClawPackageRoot({
      moduleUrl: import.meta.url,
      argv1: opts.argv1 ?? process.argv[1],
      cwd: opts.cwd ?? process.cwd(),
    }));
  if (!root) return [];
  const schemaPath = path.join(root, "packages/gateway-protocol/src/schema.ts");
  const uiIndexPath =
    (
      await resolveControlUiDistIndexHealth({
        root,
        argv1: opts.argv1 ?? process.argv[1],
      })
    ).indexPath ?? resolveControlUiDistIndexPathForRoot(root);
  const uiSourcesPath = path.join(root, "ui/package.json");
  try {
    const [schemaStats, uiStats, uiSourcesStats] = await Promise.all([
      fs.stat(schemaPath).catch(() => null),
      fs.stat(uiIndexPath).catch(() => null),
      fs.stat(uiSourcesPath).catch(() => null),
    ]);
    if (!schemaStats) return [];
    const canBuild = uiSourcesStats !== null;
    if (!uiStats)
      return [
        {
          kind: "missing-assets",
          root,
          uiIndexPath,
          canBuild,
        },
      ];
    if (schemaStats.mtime <= uiStats.mtime) return [];
    const changesSinceBuild = await (
      opts.collectChangesSinceBuild ?? collectProtocolSchemaChangesSince
    )(root, uiStats.mtime);
    if (changesSinceBuild === null || changesSinceBuild.length === 0) return [];
    return [
      {
        kind: "stale-assets",
        root,
        uiIndexPath,
        changesSinceBuild,
        canBuild,
      },
    ];
  } catch {
    return [];
  }
}
async function collectProtocolSchemaChangesSince(root, uiMtime) {
  const gitLog = await runCommandWithTimeout(
    [
      "git",
      "-C",
      root,
      "log",
      `--since=${uiMtime.toISOString()}`,
      "--format=%h %s",
      "packages/gateway-protocol/src/schema.ts",
    ],
    { timeoutMs: 5e3 },
  ).catch(() => null);
  if (!gitLog || gitLog.code !== 0) return null;
  if (!gitLog.stdout.trim()) return [];
  return gitLog.stdout.trim().split("\n");
}
/** Converts a UI protocol freshness issue into a doctor lint health finding. */
function uiProtocolFreshnessIssueToHealthFinding(issue) {
  return {
    checkId: "core/doctor/ui-protocol-freshness",
    severity: "warning",
    message: formatUiProtocolFreshnessIssue(issue),
    path: issue.uiIndexPath,
    fixHint: issue.canBuild
      ? issue.kind === "missing-assets"
        ? "Run `openclaw doctor --fix` to build Control UI assets."
        : "Run `openclaw doctor --fix --force` to rebuild Control UI assets, or run `pnpm ui:build`."
      : "Install from a source checkout with ui/ sources, then run `pnpm ui:build`.",
  };
}
/** Converts a UI freshness issue into the process repair effect used by lint dry runs. */
function uiProtocolFreshnessIssueToRepairEffects(issue) {
  if (!issue.canBuild) return [];
  return [
    {
      kind: "process",
      action:
        issue.kind === "missing-assets" ? "would-build-control-ui" : "would-rebuild-control-ui",
      target: issue.root,
      dryRunSafe: false,
    },
  ];
}
function formatUiProtocolFreshnessIssue(issue) {
  if (issue.kind === "missing-assets")
    return ["- Control UI assets are missing.", "- Run: pnpm ui:build"].join("\n");
  if (issue.changesSinceBuild.length === 0) return "UI assets are older than the protocol schema.";
  return `UI assets are older than the protocol schema.\nFunctional changes since last build:\n${issue.changesSinceBuild.map((line) => `- ${line}`).join("\n")}`;
}
/** Prompts to build or rebuild Control UI assets when doctor detects missing or stale output. */
async function maybeRepairUiProtocolFreshness(_runtime, prompter) {
  for (const issue of await detectUiProtocolFreshnessIssues()) {
    if (issue.kind === "missing-assets") {
      note(formatUiProtocolFreshnessIssue(issue), "UI");
      if (!issue.canBuild) {
        note("Skipping UI build: ui/ sources not present.", "UI");
        continue;
      }
      if (
        await prompter.confirmAutoFix({
          message: "Build Control UI assets now?",
          initialValue: true,
        })
      ) {
        note("Building Control UI assets... (this may take a moment)", "UI");
        const uiScriptPath = path.join(issue.root, "scripts/ui.js");
        const buildResult = await runCommandWithTimeout([process.execPath, uiScriptPath, "build"], {
          cwd: issue.root,
          timeoutMs: 12e4,
          env: {
            ...process.env,
            FORCE_COLOR: "1",
          },
        });
        if (buildResult.code === 0) note("UI build complete.", "UI");
        else
          note(
            [
              `UI build failed (exit ${buildResult.code ?? "unknown"}).`,
              buildResult.stderr.trim() ? buildResult.stderr.trim() : null,
            ]
              .filter(Boolean)
              .join("\n"),
            "UI",
          );
      }
      continue;
    }
    note(formatUiProtocolFreshnessIssue(issue), "UI Freshness");
    if (!issue.canBuild) {
      note("Skipping UI rebuild: ui/ sources not present.", "UI");
      continue;
    }
    if (
      await prompter.confirmAggressiveAutoFix({
        message: "Rebuild UI now? (Detected protocol mismatch requiring update)",
        initialValue: true,
      })
    ) {
      note("Rebuilding stale UI assets... (this may take a moment)", "UI");
      const uiScriptPath = path.join(issue.root, "scripts/ui.js");
      const buildResult = await runCommandWithTimeout([process.execPath, uiScriptPath, "build"], {
        cwd: issue.root,
        timeoutMs: 12e4,
        env: {
          ...process.env,
          FORCE_COLOR: "1",
        },
      });
      if (buildResult.code === 0) note("UI rebuild complete.", "UI");
      else
        note(
          [
            `UI rebuild failed (exit ${buildResult.code ?? "unknown"}).`,
            buildResult.stderr.trim() ? buildResult.stderr.trim() : null,
          ]
            .filter(Boolean)
            .join("\n"),
          "UI",
        );
    }
  }
}
//#endregion
export {
  uiProtocolFreshnessIssueToRepairEffects as i,
  maybeRepairUiProtocolFreshness as n,
  uiProtocolFreshnessIssueToHealthFinding as r,
  detectUiProtocolFreshnessIssues as t,
};
