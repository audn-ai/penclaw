import { h as wrapPluginSystemContextSection } from "./attempt.prompt-helpers-CztYiE1m.js";
import {
  c as joinPresentTextSegments,
  t as getGlobalHookRunner,
} from "./hook-runner-global-CPEPIvCK.js";
import "./errors-BoHeli7m.js";
import "./utils-DtcDeqWS.js";
import "./version-CeFj_iGk.js";
import { s as buildAgentHookContext } from "./lifecycle-hook-helpers-qaFalH5z.js";
import "./agent-scope-y9xQv_q1.js";
import "./registry-ef8V3P8D.js";
import { l as redactToolDetail } from "./redact-CUe6Oey5.js";
import { n as listCodexAppServerExtensionFactories } from "./registry-B14M_H8G.js";
import "./registry-DXbEDAsr.js";
import "./session-accessor-PZVNxFCV.js";
import "./provider-request-config-DpW-uV6A.js";
import "./model-auth-BWFdcEzF.js";
import "./run-termination-BEbihwT8.js";
import "./diagnostic-DE-wbBb7.js";
import { v as queueEmbeddedAgentMessageWithOutcome } from "./runs-GL_-RIwi.js";
import "./tools-K3NqAe9E.js";
import "./agent-end-side-effects-PAHWJAYi.js";
import "./local-model-lean-D3O2n_2v.js";
import "./agent-tools.before-tool-call-B7gv78c3.js";
import "./gateway-Dyh1k_4Q.js";
import "./tool-result-error-1qgstja-.js";
import "./logger-C5RMMskO.js";
import "./heartbeat-tool-response-B3cJVfMo.js";
import "./embedded-agent-messaging-C_REpMqa.js";
import "./embedded-agent-subscribe.tools-Bv1-LBFe.js";
import "./embedded-agent-message-tool-source-reply-C7h4djeo.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import "./bootstrap-files-B9pwG25K.js";
import { r as resolveToolDisplay, t as formatToolDetail } from "./tool-display-D6v1e5bQ.js";
import "./session-write-lock-ByENUoH7.js";
import "./nodes-utils-CLhkTx8I.js";
import "./hook-helpers-jOYXwwnX.js";
import "./streaming-D_YE0SPS.js";
import "./context-CEFGZ0oc.js";
import "./sandbox-BbGZOuCz.js";
import "./execution-auth-binding-CmucNoqo.js";
import "./tools-M6Rtal9l.js";
import "./tool-schema-projection-ZrMdwk4s.js";
import "./attempt-tool-construction-plan-tLraujwv.js";
import "./attempt.thread-helpers-Di7wVu5W.js";
import "./attempt.tool-run-context-DzOtUuEC.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import "./result-fallback-classifier-DdIowatH.js";
import "./build-DkA06gaM.js";
import "./agent-dir-compat-d7bWcNLv.js";
import "./native-hook-relay-WEC9uRFL.js";
//#region src/agents/harness/user-input-bridge.ts
function emptyAgentHarnessUserInputAnswers() {
  return { answers: {} };
}
function formatAgentHarnessUserInputPrompt(questions, options = {}) {
  const formatText = options.formatText ?? ((text) => text);
  const lines = [options.intro ?? "Agent needs input:"];
  questions.forEach((question, index) => {
    if (questions.length > 1)
      lines.push("", `${index + 1}. ${formatText(question.header)}`, formatText(question.question));
    else lines.push("", formatText(question.header), formatText(question.question));
    if (question.isSecret)
      lines.push(
        options.secretWarning ?? "This channel may show your reply to other participants.",
      );
    question.options?.forEach((option, optionIndex) => {
      lines.push(
        `${optionIndex + 1}. ${formatText(option.label)}${option.description ? ` - ${formatText(option.description)}` : ""}`,
      );
    });
    if (question.isOther) lines.push(options.otherLabel ?? "Other: reply with your own answer.");
  });
  return lines.join("\n");
}
async function deliverAgentHarnessUserInputPrompt(params, questions, options = {}) {
  const text = formatAgentHarnessUserInputPrompt(questions, options);
  if (params.onBlockReply) {
    await params.onBlockReply({ text });
    return;
  }
  await params.onPartialReply?.({ text });
}
function buildAgentHarnessUserInputAnswers(questions, inputText) {
  const answers = {};
  if (questions.length === 1) {
    const question = questions[0];
    if (question) {
      const answer = normalizeAgentHarnessUserInputAnswer(inputText, question);
      answers[question.id] = { answers: answer ? [answer] : [] };
    }
    return { answers };
  }
  const keyed = parseKeyedAnswers(inputText);
  const fallbackLines = inputText.split(/\r?\n/).map((line) => line.trim());
  questions.forEach((question, index) => {
    const answer =
      keyed.get(question.id.toLowerCase()) ??
      keyed.get(question.header.toLowerCase()) ??
      keyed.get(question.question.toLowerCase()) ??
      keyed.get(String(index + 1)) ??
      fallbackLines[index] ??
      "";
    const normalized = answer ? normalizeAgentHarnessUserInputAnswer(answer, question) : void 0;
    answers[question.id] = { answers: normalized ? [normalized] : [] };
  });
  return { answers };
}
function normalizeAgentHarnessUserInputAnswer(answer, question) {
  const trimmed = answer.trim();
  const options = question.options ?? [];
  const optionIndex = /^\d+$/.test(trimmed) ? Number(trimmed) - 1 : -1;
  const indexed = optionIndex >= 0 ? options[optionIndex] : void 0;
  if (indexed) return indexed.label;
  const exact = options.find((option) => option.label.toLowerCase() === trimmed.toLowerCase());
  if (exact) return exact.label;
  if (options.length > 0 && !question.isOther) return;
  return trimmed || void 0;
}
function parseKeyedAnswers(inputText) {
  const answers = /* @__PURE__ */ new Map();
  for (const line of inputText.split(/\r?\n/)) {
    const match = line.match(/^\s*([^:=-]+?)\s*[:=-]\s*(.+?)\s*$/);
    if (!match) continue;
    const key = match[1]?.trim().toLowerCase();
    const value = match[2]?.trim();
    if (key && value) answers.set(key, value);
  }
  return answers;
}
//#endregion
//#region src/agents/harness/prompt-compaction-hook-helpers.ts
/**
 * Agent harness prompt and compaction hook helpers.
 *
 * Harness runtimes use this to run plugin hooks around prompt construction and
 * compaction while keeping hook failures non-fatal.
 */
const log$1 = createSubsystemLogger("agents/harness");
/** Runs before-prompt hooks and returns the adjusted prompt fields. */
async function resolveAgentHarnessBeforePromptBuildResult(params) {
  const hookRunner = getGlobalHookRunner();
  const hasPrecomputedBeforeAgentStartResult = "beforeAgentStartResult" in params;
  const hasHeartbeatContribution =
    params.ctx.trigger === "heartbeat" &&
    params.bootstrapContextRunKind !== "commitment-only" &&
    Boolean(hookRunner?.hasHooks("heartbeat_prompt_contribution"));
  if (
    !hasPrecomputedBeforeAgentStartResult &&
    !hasHeartbeatContribution &&
    !hookRunner?.hasHooks("before_prompt_build") &&
    !hookRunner?.hasHooks("before_agent_start")
  )
    return {
      prompt: params.prompt,
      developerInstructions: params.developerInstructions,
      promptInputRange: {
        start: 0,
        end: params.prompt.length,
      },
    };
  const hookCtx = buildAgentHookContext(params.ctx);
  const promptEvent = {
    prompt: params.prompt,
    messages: params.messages,
  };
  const heartbeatResult =
    hasHeartbeatContribution && hookRunner
      ? await hookRunner
          .runHeartbeatPromptContribution(
            {
              sessionKey: params.ctx.sessionKey,
              agentId: params.ctx.agentId,
              heartbeatName: "heartbeat",
            },
            hookCtx,
          )
          .catch((error) => {
            log$1.warn(`heartbeat_prompt_contribution hook failed: ${String(error)}`);
          })
      : void 0;
  const promptBuildResult = hookRunner?.hasHooks("before_prompt_build")
    ? await hookRunner.runBeforePromptBuild(promptEvent, hookCtx).catch((error) => {
        log$1.warn(`before_prompt_build hook failed: ${String(error)}`);
      })
    : void 0;
  const beforeAgentStartResult = hasPrecomputedBeforeAgentStartResult
    ? params.beforeAgentStartResult
    : hookRunner?.hasHooks("before_agent_start")
      ? await hookRunner.runBeforeAgentStart(promptEvent, hookCtx).catch((error) => {
          log$1.warn(
            `deprecated before_agent_start hook failed during prompt build: ${String(error)}`,
          );
        })
      : void 0;
  const systemPrompt = resolvePromptBuildSystemPrompt({
    developerInstructions: params.developerInstructions,
    promptBuildResult,
    beforeAgentStartResult,
  });
  const promptPrefix = joinPresentTextSegments([
    heartbeatResult?.prependContext,
    promptBuildResult?.prependContext,
    beforeAgentStartResult?.prependContext,
  ]);
  const promptSuffix = joinPresentTextSegments([
    heartbeatResult?.appendContext,
    promptBuildResult?.appendContext,
    beforeAgentStartResult?.appendContext,
  ]);
  const prompt =
    joinPresentTextSegments([promptPrefix, params.prompt, promptSuffix]) ?? params.prompt;
  const promptInputStart =
    params.prompt.length === 0
      ? (promptPrefix?.length ?? 0)
      : promptPrefix
        ? promptPrefix.length + 2
        : 0;
  return {
    prompt,
    developerInstructions:
      joinPresentTextSegments([
        wrapPluginSystemContextSection(promptBuildResult?.prependSystemContext),
        wrapPluginSystemContextSection(beforeAgentStartResult?.prependSystemContext),
        systemPrompt,
        wrapPluginSystemContextSection(promptBuildResult?.appendSystemContext),
        wrapPluginSystemContextSection(beforeAgentStartResult?.appendSystemContext),
      ]) ?? systemPrompt,
    promptInputRange: {
      start: promptInputStart,
      end: promptInputStart + params.prompt.length,
    },
  };
}
function resolvePromptBuildSystemPrompt(params) {
  if (typeof params.promptBuildResult?.systemPrompt === "string")
    return params.promptBuildResult.systemPrompt;
  if (typeof params.beforeAgentStartResult?.systemPrompt === "string")
    return params.beforeAgentStartResult.systemPrompt;
  return params.developerInstructions;
}
/** Runs best-effort before-compaction hooks for a harness session. */
async function runAgentHarnessBeforeCompactionHook(params) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("before_compaction")) return;
  try {
    await hookRunner.runBeforeCompaction(
      {
        messageCount: params.messages?.length ?? -1,
        ...(params.messages ? { messages: params.messages } : {}),
        sessionFile: params.sessionFile,
      },
      buildAgentHookContext(params.ctx),
    );
  } catch (error) {
    log$1.warn(`before_compaction hook failed: ${String(error)}`);
  }
}
/** Runs best-effort after-compaction hooks for a harness session. */
async function runAgentHarnessAfterCompactionHook(params) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("after_compaction")) return;
  try {
    await hookRunner.runAfterCompaction(
      {
        messageCount: params.messages?.length ?? -1,
        compactedCount: params.compactedCount,
        sessionFile: params.sessionFile,
      },
      buildAgentHookContext(params.ctx),
    );
  } catch (error) {
    log$1.warn(`after_compaction hook failed: ${String(error)}`);
  }
}
//#endregion
//#region src/agents/harness/codex-app-server-extensions.ts
/**
 * Codex app-server extension runner.
 *
 * Harness integration uses this to let registered extensions observe and adjust
 * tool results before they are returned to the agent runtime.
 */
const log = createSubsystemLogger("agents/harness");
/** Creates a runner that applies registered Codex app-server tool-result extensions. */
function createCodexAppServerToolResultExtensionRunner(
  ctx,
  factories = listCodexAppServerExtensionFactories(),
) {
  const handlers = [];
  const runtime = {
    on(event, handler) {
      if (event === "tool_result") handlers.push(handler);
    },
  };
  const initPromise = (async () => {
    for (const factory of factories) await factory(runtime);
  })();
  return {
    async applyToolResultExtensions(event) {
      await initPromise;
      let current = event.result;
      for (const handler of handlers)
        try {
          const next = await handler(
            {
              ...event,
              result: current,
            },
            ctx,
          );
          if (next?.result) current = next.result;
        } catch (error) {
          const detail = error instanceof Error ? error.message : String(error);
          log.warn(`[codex] tool_result extension failed for ${event.toolName}: ${detail}`);
        }
      return current;
    },
  };
}
//#endregion
//#region src/plugin-sdk/agent-harness-runtime.ts
/** Default truncation limit for user-facing tool progress output. */
const TOOL_PROGRESS_OUTPUT_MAX_CHARS = 8e3;
/**
 * @deprecated Active-run queueing is an internal runtime concern. This legacy
 * boolean API only reports immediate queue eligibility and cannot observe async
 * runtime rejection; runtime-owned delivery paths should use acceptance-aware
 * steering instead of public SDK queueing.
 */
function queueAgentHarnessMessage(sessionId, text, options) {
  return queueEmbeddedAgentMessageWithOutcome(sessionId, text, options).queued;
}
/** Detect prompt image references and load them through the same limits used by embedded runs. */
async function detectAndLoadAgentHarnessPromptImages(params) {
  const [{ resolveImageSanitizationLimits }, { detectAndLoadPromptImages }, { MAX_IMAGE_BYTES }] =
    await Promise.all([
      import("./image-sanitization-BghTEphW.js"),
      import("./images-Dd1krRQa.js"),
      import("./media-core/constants.js"),
    ]);
  return detectAndLoadPromptImages({
    prompt: params.prompt,
    workspaceDir: params.workspaceDir,
    model: params.model,
    existingImages: params.existingImages,
    imageOrder: params.imageOrder,
    maxBytes: MAX_IMAGE_BYTES,
    maxDimensionPx: resolveImageSanitizationLimits(params.config).maxDimensionPx,
    workspaceOnly: params.workspaceOnly,
    localRoots: params.localRoots,
    sandbox: params.sandbox,
  });
}
/** Load Codex bundle MCP thread config without forcing the heavy config module into SDK imports. */
async function loadCodexBundleMcpThreadConfig(params) {
  const { loadCodexBundleMcpThreadConfig: load } = await import("./codex-mcp-config-BzESE-Y-.js");
  return load(params);
}
/** Infer compact display metadata for one tool invocation from its name and arguments. */
function inferToolMetaFromArgs(toolName, args, options) {
  return formatToolDetail(
    resolveToolDisplay({
      name: toolName,
      args,
      detailMode: options?.detailMode,
    }),
  );
}
/**
 * Prepare verbose tool output for user-facing progress messages.
 */
function formatToolProgressOutput(output, options) {
  const trimmed = output.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!trimmed) return;
  const redacted = redactToolDetail(trimmed);
  const maxChars = options?.maxChars ?? 8e3;
  if (redacted.length <= maxChars) return redacted;
  return `${truncateUtf16Safe(redacted, maxChars)}\n...(truncated)...`;
}
/**
 * Classify terminal harness turns that completed without assistant output that
 * should advance fallback. Deliberate silent replies such as NO_REPLY count as
 * intentional output, while whitespace-only text remains fallback-eligible.
 * This is intentionally SDK-level so plugin harness adapters such as Codex
 * preserve the same OpenClaw-owned fallback signals as the built-in OpenClaw path
 * without re-implementing terminal-result policy.
 */
function classifyAgentHarnessTerminalOutcome(params) {
  if (
    !params.turnCompleted ||
    (params.promptError !== void 0 && params.promptError !== null) ||
    hasVisibleAssistantText(params.assistantTexts)
  )
    return;
  if (params.planText?.trim()) return "planning-only";
  if (params.reasoningText?.trim()) return "reasoning-only";
  return "empty";
}
function hasVisibleAssistantText(assistantTexts) {
  return assistantTexts.some((text) => text.trim().length > 0);
}
//#endregion
export {
  inferToolMetaFromArgs as a,
  createCodexAppServerToolResultExtensionRunner as c,
  runAgentHarnessBeforeCompactionHook as d,
  buildAgentHarnessUserInputAnswers as f,
  normalizeAgentHarnessUserInputAnswer as g,
  formatAgentHarnessUserInputPrompt as h,
  formatToolProgressOutput as i,
  resolveAgentHarnessBeforePromptBuildResult as l,
  emptyAgentHarnessUserInputAnswers as m,
  classifyAgentHarnessTerminalOutcome as n,
  loadCodexBundleMcpThreadConfig as o,
  deliverAgentHarnessUserInputPrompt as p,
  detectAndLoadAgentHarnessPromptImages as r,
  queueAgentHarnessMessage as s,
  TOOL_PROGRESS_OUTPUT_MAX_CHARS as t,
  runAgentHarnessAfterCompactionHook as u,
};
