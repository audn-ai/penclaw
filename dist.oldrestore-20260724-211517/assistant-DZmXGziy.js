import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  a as parseCrestodianAssistantPlanText,
  i as buildCrestodianAssistantUserPrompt,
  n as CRESTODIAN_ASSISTANT_SYSTEM_PROMPT,
  r as CRESTODIAN_ASSISTANT_TIMEOUT_MS,
} from "./assistant-prompts-BlIZwZ7N.js";
import { t as CrestodianInferenceUnavailableError } from "./inference-error-FHRbX8O-.js";
import {
  a as resolveCrestodianVerifiedInferenceRoute,
  i as resolveCrestodianExpectedAgentHarnessRuntimeArtifact,
} from "./verified-inference-CEqscfYA.js";
//#region src/crestodian/assistant.ts
async function planCrestodianCommand(params) {
  return await planCrestodianCommandWithConfiguredModel(params);
}
/** Plan only through the configured default agent's verified route. */
async function planCrestodianCommandWithConfiguredModel(params) {
  const route = await requireVerifiedPlannerRoute(params.verifiedInference, params.deps);
  const input = params.input.trim();
  if (!input) return null;
  let expectedAgentHarnessRuntimeArtifact;
  try {
    expectedAgentHarnessRuntimeArtifact = resolveCrestodianExpectedAgentHarnessRuntimeArtifact(
      params.verifiedInference,
    );
  } catch (error) {
    throw new CrestodianInferenceUnavailableError("planner", [error]);
  }
  const prompt = buildCrestodianAssistantUserPrompt({
    input,
    overview: params.overview,
    ...(params.history ? { history: params.history } : {}),
    ...(params.pendingOperation ? { pendingOperation: params.pendingOperation } : {}),
  });
  const tempDir = await (params.deps?.createTempDir ?? createTempPlannerDir)();
  let plan;
  try {
    const runId = `crestodian-planner-${randomUUID()}`;
    const shared = {
      sessionId: `${runId}-session`,
      agentId: "crestodian",
      trigger: "manual",
      sessionFile: path.join(tempDir, "session.jsonl"),
      workspaceDir: tempDir,
      cwd: tempDir,
      agentDir: route.agentDir,
      config: route.runConfig,
      prompt,
      provider: route.provider,
      model: route.model,
      timeoutMs: CRESTODIAN_ASSISTANT_TIMEOUT_MS,
      runId,
      extraSystemPrompt: CRESTODIAN_ASSISTANT_SYSTEM_PROMPT,
      extraSystemPromptStatic: CRESTODIAN_ASSISTANT_SYSTEM_PROMPT,
      messageChannel: "crestodian",
      messageProvider: "crestodian",
      disableTools: true,
      disableTrajectory: true,
      ...(route.authProfileId ? { authProfileId: route.authProfileId } : {}),
    };
    const parsed = parseCrestodianAssistantPlanText(
      extractPlannerResultText(
        route.runner === "cli"
          ? await (
              params.deps?.runCliAgent ?? (await import("./cli-runner-5cAK0_UH.js")).runCliAgent
            )({
              ...shared,
              executionMode: "side-question",
              cleanupCliLiveSessionOnRunEnd: true,
            })
          : await (
              params.deps?.runEmbeddedAgent ??
              (await import("./embedded-agent-Co8ck_EF.js")).runEmbeddedAgent
            )({
              ...shared,
              toolsAllow: [],
              agentHarnessRuntimeOverride: route.agentHarnessRuntimeOverride,
              ...(expectedAgentHarnessRuntimeArtifact
                ? { expectedAgentHarnessRuntimeArtifact }
                : {}),
              cleanupBundleMcpOnRunEnd: true,
              ...(route.authProfileId ? { authProfileIdSource: "user" } : {}),
            }),
      ),
    );
    plan = parsed
      ? {
          ...parsed,
          modelLabel: route.modelLabel,
        }
      : null;
  } catch (error) {
    if (error instanceof CrestodianInferenceUnavailableError) throw error;
    plan = null;
  } finally {
    await (params.deps?.removeTempDir ?? removeTempPlannerDir)(tempDir);
  }
  if (plan) await requireVerifiedPlannerRoute(params.verifiedInference, params.deps);
  return plan;
}
async function requireVerifiedPlannerRoute(binding, deps) {
  if (!binding) throw new CrestodianInferenceUnavailableError("planner");
  try {
    const route = await resolveCrestodianVerifiedInferenceRoute(binding, deps);
    if (route) return route;
  } catch (error) {
    throw new CrestodianInferenceUnavailableError("planner", [error]);
  }
  throw new CrestodianInferenceUnavailableError("planner");
}
async function createTempPlannerDir() {
  return await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-crestodian-planner-"));
}
async function removeTempPlannerDir(dir) {
  await fs.rm(dir, {
    recursive: true,
    force: true,
  });
}
function extractPlannerResultText(result) {
  return (
    result.meta?.finalAssistantVisibleText ??
    result.meta?.finalAssistantRawText ??
    result.payloads
      ?.map((payload) => payload.text?.trim())
      .filter(Boolean)
      .join("\n")
  );
}
//#endregion
export { planCrestodianCommand };
