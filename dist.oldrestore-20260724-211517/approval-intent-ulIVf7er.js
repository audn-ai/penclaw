import { r as extractAssistantText } from "./embedded-agent-utils-Coji3F8W.js";
import {
  r as prepareSimpleCompletionModelForAgent,
  t as completeWithPreparedSimpleCompletionModel,
} from "./simple-completion-runtime-DThW6g7z.js";
import { a as resolveCrestodianVerifiedInferenceRoute } from "./verified-inference-CEqscfYA.js";
//#region src/crestodian/approval-intent.ts
const APPROVAL_INTENT_TIMEOUT_MS = 1e4;
const APPROVAL_INTENT_MAX_TOKENS = 8;
const APPROVE_RE =
  /^(?:y|yes|yeah|yep|yup|sure|ok|okay|approve|approved|apply|confirm|confirmed|do it|go ahead|sounds good|yes please|please do)$/i;
const DECLINE_RE = /^(?:n|no|nope|nah|skip|not now|cancel|stop|abort|later|decline|don'?t)\b/i;
function normalizeApprovalText(message) {
  return message
    .trim()
    .replace(/[.!?,\s]+$/u, "")
    .toLowerCase();
}
/** Closed-list classification: exact affirmatives, prefix declines. */
function classifyCrestodianApprovalText(message) {
  const normalized = normalizeApprovalText(message);
  if (!normalized) return "other";
  if (APPROVE_RE.test(normalized)) return "approve";
  if (DECLINE_RE.test(normalized)) return "decline";
  return "other";
}
const APPROVAL_INTENT_SYSTEM_PROMPT = [
  "You classify one chat message from a user who was just asked to approve a pending configuration change.",
  "Reply with exactly one word:",
  "approve — the message clearly consents to applying the pending change now.",
  "decline — the message clearly rejects or postpones the pending change.",
  "other — anything else: questions, new requests, partial or conditional agreement, or unclear intent.",
  "Only classify consent for the pending change itself. A message asking to change the proposal is not approval.",
].join("\n");
/**
 * Judge whether a message approves the pending proposal. Closed-list answers
 * short-circuit so a literal "yes" cannot be reinterpreted by the conversation
 * model; ambiguous messages go to a separate configured completion call.
 * CLI-harness routes do not spawn a second harness for that check, so their
 * ambiguous replies stay "other" and the conversation asks for a clear yes.
 */
async function classifyCrestodianApprovalIntent(params, deps = {}) {
  const textIntent = classifyCrestodianApprovalText(params.message);
  if (textIntent !== "other") return textIntent;
  try {
    const resolveVerifiedRoute =
      deps.resolveVerifiedInferenceRoute ?? resolveCrestodianVerifiedInferenceRoute;
    const route = await resolveVerifiedRoute(params.verifiedInference);
    if (!route || route.runner !== "embedded" || route.agentHarnessRuntimeOverride !== "openclaw")
      return "other";
    const modelRef = route.authProfileId
      ? `${route.modelLabel}@${route.authProfileId}`
      : route.modelLabel;
    const prepared = await (
      deps.prepareSimpleCompletionModelForAgent ?? prepareSimpleCompletionModelForAgent
    )({
      cfg: route.runConfig,
      agentId: route.agentId,
      agentDir: route.agentDir,
      modelRef,
      ...(route.authProfileId ? { preferredProfile: route.authProfileId } : {}),
      allowMissingApiKeyModes: ["aws-sdk"],
      bindAuthOwner: true,
    });
    if ("error" in prepared) return "other";
    if (
      (prepared.selection.runtimeProvider ?? prepared.selection.provider) !== route.provider ||
      prepared.selection.modelId !== route.model ||
      prepared.selection.agentDir !== route.agentDir ||
      prepared.selection.profileId !== route.authProfileId ||
      prepared.auth.profileId !== route.authProfileId ||
      !params.verifiedInference.auth.authFingerprint ||
      prepared.sourceAuthFingerprint !== params.verifiedInference.auth.authFingerprint
    )
      return "other";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), APPROVAL_INTENT_TIMEOUT_MS);
    try {
      const response = await (
        deps.completeWithPreparedSimpleCompletionModel ?? completeWithPreparedSimpleCompletionModel
      )({
        model: prepared.model,
        auth: prepared.auth,
        cfg: route.runConfig,
        context: {
          systemPrompt: APPROVAL_INTENT_SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: [
                `Pending change: ${params.proposal ?? "a configuration change proposed in this conversation"}`,
                `User message: ${params.message}`,
              ].join("\n"),
              timestamp: Date.now(),
            },
          ],
        },
        options: {
          maxTokens: APPROVAL_INTENT_MAX_TOKENS,
          signal: controller.signal,
        },
      });
      if (!(await resolveVerifiedRoute(params.verifiedInference))) return "other";
      const verdict = extractAssistantText(response)?.trim().toLowerCase().split(/\s+/)[0];
      if (verdict === "approve" || verdict === "decline") return verdict;
      return "other";
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return "other";
  }
}
//#endregion
export { classifyCrestodianApprovalText as n, classifyCrestodianApprovalIntent as t };
