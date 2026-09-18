import { existsSync } from "node:fs";
import "./agent-scope-y9xQv_q1.js";
import { posix, win32 } from "node:path";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import {
  n as disableUnavailableSkillsInConfig,
  t as collectUnavailableAgentSkills,
} from "./doctor-skills-core-DZQVCoNO.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { t as buildWorkspaceSkillStatus } from "./status-D7X0puSr.js";
//#region src/skills/lifecycle/gh-config-discovery.ts
function pathFor(platform) {
  return platform === "win32" ? win32 : posix;
}
const HOSTS_FILE = "hosts.yml";
function resolveEffectiveGhConfigDir(input) {
  const env = input.env;
  if (env.GH_CONFIG_DIR && env.GH_CONFIG_DIR.trim()) return env.GH_CONFIG_DIR.trim();
  const xdg = env.XDG_CONFIG_HOME?.trim();
  if (xdg) return pathFor(input.platform).join(xdg, "gh");
  if (input.platform === "win32") {
    const appData = env.APPDATA?.trim();
    if (appData) return pathFor(input.platform).join(appData, "GitHub CLI");
    const profile = env.USERPROFILE?.trim();
    if (profile) return pathFor(input.platform).join(profile, "AppData", "Roaming", "GitHub CLI");
  }
  const home = env.HOME?.trim();
  if (!home) return;
  return pathFor(input.platform).join(home, ".config", "gh");
}
function defaultCandidateOperatorHomes(input) {
  const env = input.env;
  const homes = /* @__PURE__ */ new Set();
  if (input.platform !== "win32") homes.add("/root");
  if (env.SUDO_USER?.trim()) {
    const sudoUser = env.SUDO_USER.trim();
    homes.add(pathFor(input.platform).join("/home", sudoUser));
    if (input.platform === "darwin") homes.add(pathFor(input.platform).join("/Users", sudoUser));
  }
  if (env.USER?.trim()) {
    const user = env.USER.trim();
    if (user !== "root") {
      if (input.platform === "darwin") homes.add(pathFor(input.platform).join("/Users", user));
      else if (input.platform !== "win32") homes.add(pathFor(input.platform).join("/home", user));
    }
  }
  const processHome = env.HOME?.trim();
  if (processHome) homes.delete(processHome);
  return [...homes];
}
function ghConfigDirForHome(home, platform) {
  return pathFor(platform).join(home, ".config", "gh");
}
function detectGhConfigDirMismatch(input) {
  const env = input.env;
  if (env.GH_CONFIG_DIR && env.GH_CONFIG_DIR.trim())
    return {
      kind: "explicit-gh-config-dir-set",
      ghConfigDir: env.GH_CONFIG_DIR.trim(),
    };
  const effective = resolveEffectiveGhConfigDir(input);
  if (!effective) return { kind: "no-process-home" };
  const effectiveHosts = pathFor(input.platform).join(effective, HOSTS_FILE);
  if (input.fileExists(effectiveHosts))
    return {
      kind: "auth-discoverable",
      effectiveConfigDir: effective,
    };
  const candidates = input.candidateOperatorHomes ?? defaultCandidateOperatorHomes(input);
  for (const home of candidates) {
    const candidateDir = ghConfigDirForHome(home, input.platform);
    if (candidateDir === effective) continue;
    const candidateHosts = pathFor(input.platform).join(candidateDir, HOSTS_FILE);
    if (input.fileExists(candidateHosts))
      return {
        kind: "mismatch",
        effectiveConfigDir: effective,
        alternateConfigDir: candidateDir,
        alternateHostsFile: candidateHosts,
        alternateHomeHint: home,
        suggestedEnvValue: candidateDir,
      };
  }
  return {
    kind: "no-known-auth",
    effectiveConfigDir: effective,
  };
}
function formatGhConfigDirMismatchHint(mismatch) {
  const lines = [
    "GitHub CLI auth was found at a different HOME than the one this OpenClaw process uses.",
    `  Process gh config dir: ${mismatch.effectiveConfigDir}`,
    `  Authenticated config:  ${mismatch.alternateConfigDir} (contains ${HOSTS_FILE})`,
  ];
  if (mismatch.alternateHomeHint)
    lines.push(`  Authenticated HOME:    ${mismatch.alternateHomeHint}`);
  lines.push(
    `  Fix: set GH_CONFIG_DIR=${mismatch.suggestedEnvValue} on the OpenClaw service environment, then restart the gateway.`,
  );
  return lines;
}
//#endregion
//#region src/commands/doctor-skills.ts
/** Doctor checks and repair prompts for unavailable configured skills. */
function defaultGhConfigDiscoveryInput() {
  return {
    platform: process.platform,
    env: process.env,
    fileExists: (absolutePath) => existsSync(absolutePath),
  };
}
/** Builds a GitHub CLI config-dir hint for eligible GitHub skill setups. */
function describeGhConfigDirHint(skills) {
  return describeGhConfigDirHintFromDiscovery(skills, defaultGhConfigDiscoveryInput());
}
/** Builds a GitHub CLI config-dir hint from injected discovery inputs for tests. */
function describeGhConfigDirHintFromDiscovery(skills, discoveryInput) {
  const githubSkill = skills.find((skill) => skill.name === "github");
  if (!githubSkill) return [];
  if (
    !githubSkill.eligible ||
    githubSkill.blockedByAgentFilter ||
    githubSkill.disabled ||
    githubSkill.blockedByAllowlist
  )
    return [];
  const result = detectGhConfigDirMismatch(discoveryInput);
  if (result.kind !== "mismatch") return [];
  return formatGhConfigDirMismatchHint(result);
}
/** Formats doctor note lines for skills that are allowed but unavailable. */
function formatUnavailableSkillDoctorLines(skills) {
  const count = skills.length;
  const lines = [
    `${count} allowed skill${count === 1 ? " is" : "s are"} not usable in this environment (missing binaries, env vars, or config).`,
    `- ${skills
      .map((skill) => skill.name)
      .toSorted((a, b) => a.localeCompare(b))
      .join(", ")}`,
  ];
  lines.push(`Disable unused skills: ${formatCliCommand("openclaw doctor --fix")}`);
  lines.push(
    `Inspect details: ${formatCliCommand("openclaw skills check --agent <id>")} or ${formatCliCommand("openclaw skills info <name> --agent <id>")}`,
  );
  return lines;
}
/** Checks default-agent skill readiness and optionally disables unavailable skills in config. */
async function maybeRepairSkillReadiness(params) {
  const agentId = resolveDefaultAgentId(params.cfg);
  const report = buildWorkspaceSkillStatus(resolveAgentWorkspaceDir(params.cfg, agentId), {
    config: params.cfg,
    agentId,
  });
  const githubHint = describeGhConfigDirHint(report.skills);
  if (githubHint.length > 0) note(githubHint.join("\n"), "GitHub CLI");
  const unavailable = collectUnavailableAgentSkills(report);
  if (unavailable.length === 0) return params.cfg;
  note(formatUnavailableSkillDoctorLines(unavailable).join("\n"), "Skills");
  if (
    !(await params.prompter.confirmAutoFix({
      message: `Disable ${unavailable.length} unavailable skill${unavailable.length === 1 ? "" : "s"} in config?`,
      initialValue: false,
    }))
  )
    return params.cfg;
  const next = disableUnavailableSkillsInConfig(params.cfg, unavailable);
  note(unavailable.map((skill) => `- Disabled ${skill.name}`).join("\n"), "Doctor changes");
  return next;
}
//#endregion
export { maybeRepairSkillReadiness };
