import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-Co0q1IYy.js";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import "./agent-scope-y9xQv_q1.js";
import {
  a as resolveAgentDir,
  o as resolveAgentWorkspaceDir,
  t as listAgentEntries,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  r as requireValidConfigFileSnapshot,
  t as createQuietRuntime,
} from "./agents.command-shared-DvQ8DcU3.js";
import { a as pruneAgentConfig, r as findAgentEntryIndex } from "./agents.config-ClyzacE8.js";
import {
  c as callGateway,
  g as isGatewayTransportError,
  m as isGatewayCredentialsRequiredError,
} from "./call-BVMO6az_.js";
import { t as createClackPrompter } from "./clack-prompter-Cu4E8Cn1.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import "./message-channel-NQc9DJ6B.js";
import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { r as logConfigUpdated } from "./logging-C64BTYfR.js";
import { s as moveToTrash } from "./onboard-helpers-CUS3BGDx.js";
import { c as resolveSessionTranscriptsDirForAgent } from "./paths-TfuVT-K8.js";
import { i as writeRuntimeJson, r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as DEFAULT_AGENT_ID } from "./session-key-druuY-GG.js";
import { t as purgeAgentSessionStoreEntries } from "./sessions-CEG7v41b.js";
import {
  _ as resolveWorkspaceAttestationPaths,
  y as shouldRemoveWorkspaceAttestation,
} from "./workspace-DXzCbuC0.js";
//#region src/commands/agents.commands.delete.ts
async function maybeDeleteAgentThroughGateway(params) {
  try {
    return await callGateway({
      method: "agents.delete",
      params: {
        agentId: params.agentId,
        deleteFiles: params.deleteFiles,
      },
      mode: GATEWAY_CLIENT_MODES.CLI,
      clientName: GATEWAY_CLIENT_NAMES.CLI,
      requiredMethods: ["agents.delete"],
    });
  } catch (error) {
    if (isGatewayTransportError(error) || isGatewayCredentialsRequiredError(error)) return null;
    throw error;
  }
}
/** Delete an agent, pruning config plus workspace/session state when it is safe to do so. */
async function agentsDeleteCommand(opts, runtime = defaultRuntime) {
  const configSnapshot = await requireValidConfigFileSnapshot(runtime);
  if (!configSnapshot) return;
  const cfg = configSnapshot.sourceConfig ?? configSnapshot.config;
  const baseHash = configSnapshot.hash;
  const input = opts.id?.trim();
  if (!input) {
    runtime.error(
      `Agent id is required. Run ${formatCliCommand("openclaw agents list")} to choose one.`,
    );
    runtime.exit(1);
    return;
  }
  const agentId = normalizeAgentId(input);
  if (agentId !== input) runtime.log(`Normalized agent id to "${agentId}".`);
  if (agentId === "main") {
    runtime.error(`"${DEFAULT_AGENT_ID}" cannot be deleted.`);
    runtime.exit(1);
    return;
  }
  if (findAgentEntryIndex(listAgentEntries(cfg), agentId) < 0) {
    runtime.error(
      `Agent "${agentId}" not found. Run ${formatCliCommand("openclaw agents list")} to see configured agents.`,
    );
    runtime.exit(1);
    return;
  }
  if (!opts.force) {
    if (!process.stdin.isTTY) {
      runtime.error("Non-interactive session. Re-run with --force.");
      runtime.exit(1);
      return;
    }
    if (
      !(await createClackPrompter().confirm({
        message: `Delete agent "${agentId}" and prune workspace/state?`,
        initialValue: false,
      }))
    ) {
      runtime.log("Cancelled.");
      return;
    }
  }
  const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
  const agentDir = resolveAgentDir(cfg, agentId);
  const sessionsDir = resolveSessionTranscriptsDirForAgent(agentId);
  const result = pruneAgentConfig(cfg, agentId);
  const gatewayResult = await maybeDeleteAgentThroughGateway({
    agentId,
    deleteFiles: true,
  });
  if (gatewayResult) {
    const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
    const workspaceRetained = workspaceSharedWith.length > 0;
    if (opts.json)
      writeRuntimeJson(runtime, {
        agentId,
        workspace: workspaceDir,
        workspaceRetained: workspaceRetained || void 0,
        workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
        workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
        agentDir,
        sessionsDir,
        removedBindings: gatewayResult.removedBindings,
        removedAllow: result.removedAllow,
        transport: "gateway",
      });
    else runtime.log(`Deleted agent: ${agentId}`);
    return;
  }
  await replaceConfigFile({
    nextConfig: result.config,
    ...(baseHash !== void 0 ? { baseHash } : {}),
    writeOptions: opts.json ? { skipOutputLogs: true } : void 0,
  });
  if (!opts.json) logConfigUpdated(runtime);
  await purgeAgentSessionStoreEntries(cfg, agentId);
  const quietRuntime = opts.json ? createQuietRuntime(runtime) : runtime;
  const workspaceSharedWith = findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir);
  const workspaceRetained = workspaceSharedWith.length > 0;
  if (workspaceRetained)
    quietRuntime.log(
      `Skipped workspace removal (shared with other agents: ${workspaceSharedWith.join(", ")}): ${workspaceDir}`,
    );
  else {
    await moveToTrash(workspaceDir, quietRuntime);
    for (const [index, attestationPath] of resolveWorkspaceAttestationPaths(workspaceDir).entries())
      if (await shouldRemoveWorkspaceAttestation(attestationPath, { trustUnknown: index === 0 }))
        await moveToTrash(attestationPath, quietRuntime);
  }
  await moveToTrash(agentDir, quietRuntime);
  await moveToTrash(sessionsDir, quietRuntime);
  if (opts.json)
    writeRuntimeJson(runtime, {
      agentId,
      workspace: workspaceDir,
      workspaceRetained: workspaceRetained || void 0,
      workspaceRetainedReason: workspaceRetained ? "shared" : void 0,
      workspaceSharedWith: workspaceRetained ? workspaceSharedWith : void 0,
      agentDir,
      sessionsDir,
      removedBindings: result.removedBindings,
      removedAllow: result.removedAllow,
    });
  else runtime.log(`Deleted agent: ${agentId}`);
}
//#endregion
export { agentsDeleteCommand };
