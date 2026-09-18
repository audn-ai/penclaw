import fs from "node:fs";
import path from "node:path";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { s as resolveSandboxScope } from "./config-l1rpbjvM.js";
import {
  d as DEFAULT_SANDBOX_IMAGE,
  r as DEFAULT_SANDBOX_BROWSER_IMAGE,
} from "./constants-Bs8JiPHi.js";
import {
  c as isDockerDaemonUnavailable,
  m as migrateLegacySandboxRegistryFiles,
  p as inspectLegacySandboxRegistryFiles,
} from "./docker-yvxsWR8P.js";
import { n as runExec, r as runCommandWithTimeout } from "./exec-CXKmx4dL.js";
import "./sandbox-BbGZOuCz.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { r as resolveOpenClawPackageRootsSync } from "./openclaw-root-DSkQ6e_8.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/doctor-sandbox.ts
/** Doctor checks and repairs for Docker sandbox images, namespaces, and registry state. */
const SANDBOX_REGISTRY_FILES_CHECK_ID = "core/doctor/sandbox/registry-files";
function resolveSandboxScript(scriptRel, options = {}) {
  const roots = resolveOpenClawPackageRootsSync({
    cwd: options.cwd ?? process.cwd(),
    argv1: options.argv1 ?? process.argv[1],
  });
  for (const root of roots) {
    const scriptPath = path.join(root, scriptRel);
    if (fs.existsSync(scriptPath))
      return {
        scriptPath,
        cwd: root,
      };
  }
  return null;
}
async function runSandboxScript(scriptRel, runtime) {
  const script = resolveSandboxScript(scriptRel);
  if (!script) {
    note(`Unable to locate ${scriptRel}. Run it from the repo root.`, "Sandbox");
    return false;
  }
  runtime.log(`Running ${scriptRel}...`);
  const result = await runCommandWithTimeout(["bash", script.scriptPath], {
    timeoutMs: 1200 * 1e3,
    cwd: script.cwd,
  });
  if (result.code !== 0) {
    runtime.error(
      `Failed running ${scriptRel}: ${result.stderr.trim() || result.stdout.trim() || "unknown error"}`,
    );
    return false;
  }
  runtime.log(`Completed ${scriptRel}.`);
  return true;
}
async function isDockerAvailable() {
  try {
    await runExec("docker", ["version", "--format", "{{.Server.Version}}"], { timeoutMs: 5e3 });
    return true;
  } catch {
    return false;
  }
}
function formatNamespaceProbeCommand(args) {
  return ["unshare", ...args].join(" ");
}
async function runCodexBwrapNamespaceProbe(kind, args) {
  try {
    await runExec("unshare", args, { timeoutMs: 5e3 });
    return { ok: true };
  } catch (error) {
    const reason =
      error?.stderr?.trim() ||
      error?.stdout?.trim() ||
      (error instanceof Error ? error.message : String(error));
    return {
      ok: false,
      kind,
      command: formatNamespaceProbeCommand(args),
      reason,
    };
  }
}
function codexBwrapNeedsNetworkNamespaceProbe(cfg) {
  const network = cfg.agents?.defaults?.sandbox?.docker?.network?.trim().toLowerCase();
  return network === void 0 || network === "" || network === "none";
}
async function probeCodexBwrapNamespaces(cfg) {
  if (process.platform !== "linux") return { ok: true };
  const userProbe = await runCodexBwrapNamespaceProbe("user", [
    "--user",
    "--map-root-user",
    "true",
  ]);
  if (!userProbe.ok || !codexBwrapNeedsNetworkNamespaceProbe(cfg)) return userProbe;
  return await runCodexBwrapNamespaceProbe("network", [
    "--user",
    "--map-root-user",
    "--net",
    "true",
  ]);
}
async function noteCodexBwrapNamespaceWarning(cfg) {
  const probe = await probeCodexBwrapNamespaces(cfg);
  if (probe.ok) return;
  const symptom =
    probe.kind === "user"
      ? "  bwrap: setting up uid map: Permission denied"
      : "  bwrap: loopback: Failed RTM_NEWADDR: Operation not permitted";
  const networkSentence = codexBwrapNeedsNetworkNamespaceProbe(cfg)
    ? "With Docker sandbox network egress disabled, it also needs an unprivileged network namespace."
    : "Docker sandbox network egress is enabled, so doctor only checked the user namespace.";
  note(
    [
      `Codex bwrap ${probe.kind} namespace probe failed while Docker sandbox mode is enabled.`,
      `Codex app-server \`workspace-write\` shell execution needs unprivileged user namespaces. ${networkSentence}`,
      "On Ubuntu/AppArmor hosts this usually appears as:",
      symptom,
      `Probe command: ${probe.command}`,
      `Probe result: ${probe.reason}`,
      "",
      "Fix the host namespace policy for the OpenClaw service user, then restart the gateway.",
      "Prefer an AppArmor profile that grants the required namespaces to the OpenClaw service process.",
      "`kernel.apparmor_restrict_unprivileged_userns=0` is a host-wide fallback with security tradeoffs; use it only when that host posture is acceptable.",
      "Do not add broad Docker container privileges just to satisfy nested bwrap; that weakens the outer sandbox.",
    ].join("\n"),
    "Sandbox",
  );
}
async function dockerImageExists(image) {
  try {
    await runExec("docker", ["image", "inspect", image], { timeoutMs: 5e3 });
    return true;
  } catch (error) {
    const stderr = error?.stderr || error?.message || "";
    if (stderr.includes("No such image")) return false;
    if (isDockerDaemonUnavailable(stderr)) return false;
    throw error;
  }
}
function resolveSandboxDockerImage(cfg) {
  const image = cfg.agents?.defaults?.sandbox?.docker?.image?.trim();
  return image ? image : DEFAULT_SANDBOX_IMAGE;
}
function resolveSandboxBackend(cfg) {
  return cfg.agents?.defaults?.sandbox?.backend?.trim() || "docker";
}
function resolveSandboxBrowserImage(cfg) {
  const image = cfg.agents?.defaults?.sandbox?.browser?.image?.trim();
  return image ? image : DEFAULT_SANDBOX_BROWSER_IMAGE;
}
function updateSandboxDockerImage(cfg, image) {
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        sandbox: {
          ...cfg.agents?.defaults?.sandbox,
          docker: {
            ...cfg.agents?.defaults?.sandbox?.docker,
            image,
          },
        },
      },
    },
  };
}
function updateSandboxBrowserImage(cfg, image) {
  return {
    ...cfg,
    agents: {
      ...cfg.agents,
      defaults: {
        ...cfg.agents?.defaults,
        sandbox: {
          ...cfg.agents?.defaults?.sandbox,
          browser: {
            ...cfg.agents?.defaults?.sandbox?.browser,
            image,
          },
        },
      },
    },
  };
}
async function handleMissingSandboxImage(params, runtime, prompter) {
  if (await dockerImageExists(params.image)) return;
  const buildHint = params.buildScript
    ? `Build it with ${params.buildScript}.`
    : "Build or pull it first.";
  note(`Sandbox ${params.kind} image missing: ${params.image}. ${buildHint}`, "Sandbox");
  if (params.buildScript) {
    if (
      await prompter.confirmRuntimeRepair({
        message: `Build ${params.kind} sandbox image now?`,
        initialValue: true,
      })
    )
      await runSandboxScript(params.buildScript, runtime);
  }
}
/**
 * Checks configured sandbox images and optionally runs repo build scripts for missing defaults.
 *
 * Non-Docker backends skip Docker image checks; Docker mode also probes Codex bwrap namespace
 * support because nested app-server shells rely on host user/network namespace policy.
 */
async function maybeRepairSandboxImages(cfg, runtime, prompter) {
  const sandbox = cfg.agents?.defaults?.sandbox;
  const mode = sandbox?.mode ?? "off";
  if (!sandbox || mode === "off") return cfg;
  const backend = resolveSandboxBackend(cfg);
  if (backend !== "docker") {
    if (sandbox.browser?.enabled)
      note(
        `Sandbox backend "${backend}" selected. Docker browser health checks are skipped; browser sandbox currently requires the docker backend.`,
        "Sandbox",
      );
    return cfg;
  }
  if (!(await isDockerAvailable())) {
    note(
      [
        `Sandbox mode is enabled (mode: "${mode}") but Docker is not available.`,
        "Docker is required for sandbox mode to function.",
        "Isolated sessions (cron jobs, sub-agents) will fail without Docker.",
        "",
        "Options:",
        "- Install Docker and restart the gateway",
        "- Disable sandbox mode: openclaw config set agents.defaults.sandbox.mode off",
      ].join("\n"),
      "Sandbox",
    );
    return cfg;
  }
  await noteCodexBwrapNamespaceWarning(cfg);
  let next = cfg;
  const changes = [];
  const dockerImage = resolveSandboxDockerImage(cfg);
  await handleMissingSandboxImage(
    {
      kind: "base",
      image: dockerImage,
      buildScript:
        dockerImage === "openclaw-sandbox-common:bookworm-slim"
          ? "scripts/sandbox-common-setup.sh"
          : dockerImage === "openclaw-sandbox:bookworm-slim"
            ? "scripts/sandbox-setup.sh"
            : void 0,
      updateConfig: (image) => {
        next = updateSandboxDockerImage(next, image);
        changes.push(`Updated agents.defaults.sandbox.docker.image → ${image}`);
      },
    },
    runtime,
    prompter,
  );
  if (sandbox.browser?.enabled)
    await handleMissingSandboxImage(
      {
        kind: "browser",
        image: resolveSandboxBrowserImage(cfg),
        buildScript: "scripts/sandbox-browser-setup.sh",
        updateConfig: (image) => {
          next = updateSandboxBrowserImage(next, image);
          changes.push(`Updated agents.defaults.sandbox.browser.image → ${image}`);
        },
      },
      runtime,
      prompter,
    );
  if (changes.length > 0) note(changes.join("\n"), "Doctor changes");
  return next;
}
function formatLegacyRegistryInspectionLine(file) {
  const status = file.valid ? `${file.entries} entr${file.entries === 1 ? "y" : "ies"}` : "invalid";
  const sourcePath = legacySandboxRegistryInspectionSourcePath(file);
  return `- ${file.kind} ${file.source}: ${shortenHomePath(sourcePath)} (${status})`;
}
function legacySandboxRegistryInspectionSourcePath(file) {
  return file.source === "sharded" ? file.shardedDir : file.registryPath;
}
function formatLegacyRegistryMigrationLine(result) {
  if (result.status === "migrated")
    return `- Migrated ${result.kind} registry into ${result.entries} SQLite row${result.entries === 1 ? "" : "s"}.`;
  if (result.status === "removed-empty")
    return `- Removed empty legacy ${result.kind} registry files.`;
  if (result.status === "quarantined-invalid") {
    const file = shortenHomePath(
      result.source === "sharded" ? result.shardedDir : result.registryPath,
    );
    const quarantine = result.quarantinePath ? ` to ${shortenHomePath(result.quarantinePath)}` : "";
    return `- Quarantined invalid legacy ${result.kind} registry ${file}${quarantine}.`;
  }
  return "";
}
async function detectLegacySandboxRegistryFileIssues() {
  return (await inspectLegacySandboxRegistryFiles()).filter((file) => file.exists);
}
function legacySandboxRegistryInspectionToHealthFinding(file) {
  return {
    checkId: SANDBOX_REGISTRY_FILES_CHECK_ID,
    severity: "warning",
    message: `Legacy sandbox registry file detected.
${formatLegacyRegistryInspectionLine(file)}`,
    path: legacySandboxRegistryInspectionSourcePath(file),
    fixHint: `Run ${formatCliCommand("openclaw doctor --fix")} to migrate valid entries to SQLite.`,
  };
}
function legacySandboxRegistryInspectionToRepairEffect(file) {
  return {
    kind: "state",
    action: !file.valid
      ? "would-quarantine-legacy-sandbox-registry"
      : file.entries === 0
        ? "would-remove-empty-legacy-sandbox-registry"
        : "would-migrate-legacy-sandbox-registry",
    target: legacySandboxRegistryInspectionSourcePath(file),
    dryRunSafe: false,
  };
}
/** Migrates legacy sandbox registry files and directories. */
async function maybeRepairSandboxRegistryFiles(prompter) {
  const legacyFiles = await detectLegacySandboxRegistryFileIssues();
  if (legacyFiles.length === 0) return;
  if (!prompter.shouldRepair) {
    note(
      [
        "Legacy sandbox registry files detected.",
        ...legacyFiles.map(formatLegacyRegistryInspectionLine),
        `Run ${formatCliCommand("openclaw doctor --fix")} to migrate them to SQLite.`,
      ].join("\n"),
      "Sandbox",
    );
    return;
  }
  const results = (await migrateLegacySandboxRegistryFiles())
    .filter((result) => result.status !== "missing")
    .map(formatLegacyRegistryMigrationLine)
    .filter((line) => line.length > 0);
  if (results.length > 0) note(results.join("\n"), "Doctor changes");
}
/** Warns when agent sandbox overrides are ignored because sandbox scope resolves to shared. */
function noteSandboxScopeWarnings(cfg) {
  const globalSandbox = cfg.agents?.defaults?.sandbox;
  const agents = Array.isArray(cfg.agents?.list) ? cfg.agents.list : [];
  const warnings = [];
  for (const agent of agents) {
    const agentId = agent.id;
    const agentSandbox = agent.sandbox;
    if (!agentSandbox) continue;
    if (resolveSandboxScope({ scope: agentSandbox.scope ?? globalSandbox?.scope }) !== "shared")
      continue;
    const overrides = [];
    if (agentSandbox.docker && Object.keys(agentSandbox.docker).length > 0)
      overrides.push("docker");
    if (agentSandbox.browser && Object.keys(agentSandbox.browser).length > 0)
      overrides.push("browser");
    if (agentSandbox.prune && Object.keys(agentSandbox.prune).length > 0) overrides.push("prune");
    if (overrides.length === 0) continue;
    warnings.push(
      [
        `- agents.list (id "${agentId}") sandbox ${overrides.join("/")} overrides ignored.`,
        `  scope resolves to "shared".`,
      ].join("\n"),
    );
  }
  if (warnings.length > 0) note(warnings.join("\n"), "Sandbox");
}
//#endregion
export {
  detectLegacySandboxRegistryFileIssues,
  legacySandboxRegistryInspectionToHealthFinding,
  legacySandboxRegistryInspectionToRepairEffect,
  maybeRepairSandboxImages,
  maybeRepairSandboxRegistryFiles,
  noteSandboxScopeWarnings,
};
