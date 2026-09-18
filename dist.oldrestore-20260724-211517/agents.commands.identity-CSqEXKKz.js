import fs from "node:fs/promises";
import path from "node:path";
import "./src-Bl7G9qvi.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import {
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
  t as listAgentEntries,
} from "./agent-scope-config-DVIR1nBa.js";
import { r as requireValidConfigFileSnapshot } from "./agents.command-shared-DvQ8DcU3.js";
import "./agent-scope-y9xQv_q1.js";
import { i as loadAgentIdentity, r as findAgentEntryIndex } from "./agents.config-ClyzacE8.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import "./workspace-DXzCbuC0.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { i as parseIdentityMarkdown, t as identityHasValues } from "./identity-file-DXr4SX5Y.js";
import { r as logConfigUpdated } from "./logging-C64BTYfR.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region src/commands/agents.commands.identity.ts
const normalizeWorkspacePath = (input) => path.resolve(resolveUserPath(input));
async function loadIdentityFromFile(filePath) {
  try {
    const parsed = parseIdentityMarkdown(await fs.readFile(filePath, "utf-8"));
    if (!identityHasValues(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}
function resolveAgentIdByWorkspace(cfg, workspaceDir) {
  const list = listAgentEntries(cfg);
  const ids =
    list.length > 0
      ? list.map((entry) => normalizeAgentId(entry.id))
      : [resolveDefaultAgentId(cfg)];
  const normalizedTarget = normalizeWorkspacePath(workspaceDir);
  return ids.filter(
    (id) => normalizeWorkspacePath(resolveAgentWorkspaceDir(cfg, id)) === normalizedTarget,
  );
}
/** Update an agent identity from flags or workspace identity markdown. */
async function agentsSetIdentityCommand(opts, runtime = defaultRuntime) {
  const configSnapshot = await requireValidConfigFileSnapshot(runtime);
  if (!configSnapshot) return;
  const cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
  const baseHash = configSnapshot.hash;
  const agentRaw = normalizeOptionalString(opts.agent);
  const nameRaw = normalizeOptionalString(opts.name);
  const emojiRaw = normalizeOptionalString(opts.emoji);
  const themeRaw = normalizeOptionalString(opts.theme);
  const avatarRaw = normalizeOptionalString(opts.avatar);
  const hasExplicitIdentity = Boolean(nameRaw || emojiRaw || themeRaw || avatarRaw);
  const identityFileRaw = normalizeOptionalString(opts.identityFile);
  const workspaceRaw = normalizeOptionalString(opts.workspace);
  const wantsIdentityFile = Boolean(opts.fromIdentity || identityFileRaw || !hasExplicitIdentity);
  let agentId = agentRaw ? normalizeAgentId(agentRaw) : void 0;
  let identityFilePath;
  let workspaceDir;
  if (identityFileRaw) {
    identityFilePath = normalizeWorkspacePath(identityFileRaw);
    workspaceDir = path.dirname(identityFilePath);
  } else if (workspaceRaw) workspaceDir = normalizeWorkspacePath(workspaceRaw);
  else if (agentId && wantsIdentityFile) workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
  else if (wantsIdentityFile || !agentId) workspaceDir = path.resolve(process.cwd());
  if (!agentId) {
    if (!workspaceDir) {
      runtime.error("Select an agent with --agent or provide a workspace via --workspace.");
      runtime.exit(1);
      return;
    }
    const matches = resolveAgentIdByWorkspace(cfg, workspaceDir);
    if (matches.length === 0) {
      runtime.error(
        `No agent workspace matches ${shortenHomePath(workspaceDir)}. Pass --agent to target a specific agent.`,
      );
      runtime.exit(1);
      return;
    }
    if (matches.length > 1) {
      runtime.error(
        `Multiple agents match ${shortenHomePath(workspaceDir)}: ${matches.join(", ")}. Pass --agent to choose one.`,
      );
      runtime.exit(1);
      return;
    }
    agentId = matches[0];
  }
  let identityFromFile = null;
  if (wantsIdentityFile) {
    if (identityFilePath) identityFromFile = await loadIdentityFromFile(identityFilePath);
    else if (workspaceDir) identityFromFile = loadAgentIdentity(workspaceDir);
    if (!identityFromFile) {
      const targetPath =
        identityFilePath ?? (workspaceDir ? path.join(workspaceDir, "IDENTITY.md") : "IDENTITY.md");
      runtime.error(`No identity data found in ${shortenHomePath(targetPath)}.`);
      runtime.exit(1);
      return;
    }
  }
  const fileTheme =
    identityFromFile?.theme ?? identityFromFile?.creature ?? identityFromFile?.vibe ?? void 0;
  const incomingIdentity = {
    ...(nameRaw || identityFromFile?.name ? { name: nameRaw ?? identityFromFile?.name } : {}),
    ...(emojiRaw || identityFromFile?.emoji ? { emoji: emojiRaw ?? identityFromFile?.emoji } : {}),
    ...(themeRaw || fileTheme ? { theme: themeRaw ?? fileTheme } : {}),
    ...(avatarRaw || identityFromFile?.avatar
      ? { avatar: avatarRaw ?? identityFromFile?.avatar }
      : {}),
  };
  if (
    !incomingIdentity.name &&
    !incomingIdentity.emoji &&
    !incomingIdentity.theme &&
    !incomingIdentity.avatar
  ) {
    runtime.error(
      "No identity fields provided. Use --name/--emoji/--theme/--avatar or --from-identity.",
    );
    runtime.exit(1);
    return;
  }
  const resolvedAgentId = expectDefined(agentId, "agent id");
  const list = listAgentEntries(cfg);
  const index = findAgentEntryIndex(list, resolvedAgentId);
  const base = index >= 0 ? expectDefined(list[index], "agent config") : { id: resolvedAgentId };
  const nextIdentity = {
    ...base.identity,
    ...incomingIdentity,
  };
  const nextEntry = {
    ...base,
    identity: nextIdentity,
  };
  const nextList = [...list];
  if (index >= 0) nextList[index] = nextEntry;
  else {
    const defaultId = normalizeAgentId(resolveDefaultAgentId(cfg));
    if (nextList.length === 0 && resolvedAgentId !== defaultId) nextList.push({ id: defaultId });
    nextList.push(nextEntry);
  }
  await replaceConfigFile({
    nextConfig: {
      ...cfg,
      agents: {
        ...cfg.agents,
        list: nextList,
      },
    },
    ...(baseHash !== void 0 ? { baseHash } : {}),
  });
  if (opts.json) {
    writeRuntimeJson(runtime, {
      agentId,
      identity: nextIdentity,
      workspace: workspaceDir ?? null,
      identityFile: identityFilePath ?? null,
    });
    return;
  }
  logConfigUpdated(runtime);
  runtime.log(`Agent: ${agentId}`);
  if (nextIdentity.name) runtime.log(`Name: ${nextIdentity.name}`);
  if (nextIdentity.theme) runtime.log(`Theme: ${nextIdentity.theme}`);
  if (nextIdentity.emoji) runtime.log(`Emoji: ${nextIdentity.emoji}`);
  if (nextIdentity.avatar) runtime.log(`Avatar: ${nextIdentity.avatar}`);
  if (workspaceDir) runtime.log(`Workspace: ${shortenHomePath(workspaceDir)}`);
}
//#endregion
export { agentsSetIdentityCommand };
