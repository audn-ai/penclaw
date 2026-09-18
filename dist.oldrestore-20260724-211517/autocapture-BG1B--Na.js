import { t as resolveSkillWorkshopConfig } from "./config-XlfFMqhc.js";
import { a as sha256Hex } from "./crypto-digest-CNeb2i19.js";
import {
  F as normalizeSkillIndexName,
  k as readWorkspaceSkillFile,
  v as resolveSkillProposalTarget,
} from "./curator-BbVbrcMR.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { l as resolveStorePath } from "./paths-TfuVT-K8.js";
import {
  d as inspectSkillProposal,
  f as listSkillProposals,
  i as proposeUpdateSkill,
  l as reviseSkillProposal,
  m as stripProposalFrontmatterForSkill,
  n as listWritableWorkspaceSkillSummaries,
  r as proposeCreateSkill,
} from "./service-CFZizBrk.js";
import {
  a as recordSessionSkillSuggestion,
  i as recordSessionSkillCaptureSignals,
  o as releaseSessionSkillCaptureSignals,
  r as readSessionSkillCaptureSignalHashes,
  t as claimSessionSkillCaptureSignals,
} from "./skill-suggestions-CYnnlUC8.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
//#region src/skills/research/text.ts
const TEXT_BLOCK_TYPES = /* @__PURE__ */ new Set(["text", "input_text", "output_text"]);
function readTextValue(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && typeof value.value === "string") return value.value;
  return "";
}
function extractTextBlock(block) {
  if (!block || typeof block !== "object") return "";
  const type = block.type;
  if (typeof type !== "string" || !TEXT_BLOCK_TYPES.has(type)) return "";
  return readTextValue(block.text);
}
function extractMessageText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map(extractTextBlock).filter(Boolean).join("\n");
  return extractTextBlock(content);
}
/** Extracts role/text pairs from mixed transcript message shapes. */
function extractTranscriptText(messages) {
  const result = [];
  for (const message of messages) {
    if (!message || typeof message !== "object") continue;
    const role = message.role;
    const content = message.content;
    if (typeof role !== "string") continue;
    const text = extractMessageText(content).trim();
    if (text)
      result.push({
        role,
        text,
      });
  }
  return result;
}
function compactWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}
//#endregion
//#region src/skills/research/signals.ts
const PROSPECTIVE_PATTERNS = [
  /\bnext time\b/i,
  /\bfrom now on\b/i,
  /\bgoing forward\b/i,
  /\bremember to\b/i,
  /\bmake sure to\b/i,
  /\balways\b.{0,80}\b(use|check|verify|record|save|prefer)\b/i,
  /\bprefer\b.{0,120}\b(when|for|instead|use)\b/i,
  /\bwhen asked\b/i,
];
const REACTIVE_PATTERNS = [
  /\b(?:that|this|it)(?:'s| is| was)? (?:wrong|not what i (?:asked|meant|said|wanted))\b/i,
  /\bdon'?t\b.{0,60}\bagain\b/i,
  /\bstop (?:using|doing|making|building|adding)\b/i,
  /\bstill (?:using|doing|making|ignoring)\b/i,
  /\b(?:i|we) (?:told|asked) you\b/i,
  /\brepeat myself\b/i,
  /\bshould (?:not|never) (?:have|be)\b/i,
  /\bi thought (?:we|you) (?:were|was|would|agreed)\b/i,
];
const CORRECTION_PATTERNS = [...PROSPECTIVE_PATTERNS, ...REACTIVE_PATTERNS];
const DEFAULT_MAX_PROPOSALS = 3;
const SKILL_MATCH_MIN_SCORE = 2;
const SKILL_MATCH_STOPWORDS = /* @__PURE__ */ new Set([
  "and",
  "are",
  "before",
  "but",
  "for",
  "from",
  "have",
  "into",
  "not",
  "should",
  "that",
  "the",
  "them",
  "then",
  "they",
  "this",
  "was",
  "were",
  "what",
  "when",
  "with",
  "you",
  "your",
]);
function inferTopic(text) {
  const lower = text.toLowerCase();
  if (/\banimated\b|\bgifs?\b/.test(lower))
    return {
      skillName: "animated-gif-workflow",
      title: "Animated GIF Workflow",
      label: "animated GIF requests",
    };
  if (/\bscreenshot|screen capture|imageoptim|asset\b/.test(lower))
    return {
      skillName: "screenshot-asset-workflow",
      title: "Screenshot Asset Workflow",
      label: "screenshot asset updates",
    };
  if (/\bqa\b|\bscenario\b|\btest plan\b/.test(lower))
    return {
      skillName: "qa-scenario-workflow",
      title: "QA Scenario Workflow",
      label: "QA tasks",
    };
  if (/\bpr\b|\bpull requests?\b|\bgithub\b/.test(lower))
    return {
      skillName: "github-pr-workflow",
      title: "GitHub PR Workflow",
      label: "GitHub PR work",
    };
  return {
    skillName: "learned-workflows",
    title: "Learned Workflows",
    label: "repeatable tasks",
  };
}
function extractInstruction(text) {
  const trimmed = compactWhitespace(text);
  if (trimmed.length < 24 || trimmed.length > 1200) return;
  if (!CORRECTION_PATTERNS.some((pattern) => pattern.test(trimmed))) return;
  return trimmed.replace(/^ok[,. ]+/i, "");
}
function tokenizeForSkillMatch(value) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !SKILL_MATCH_STOPWORDS.has(token));
}
function skillTokensMatch(a, b) {
  if (a === b) return true;
  return a === `${b}s` || b === `${a}s` || a === `${b}es` || b === `${a}es`;
}
function matchExistingSkill(instruction, skills) {
  let best;
  let bestScore = 0;
  const instructionTokens = new Set(tokenizeForSkillMatch(instruction));
  for (const skill of skills) {
    const nameTokens = tokenizeForSkillMatch(skill.name.replace(/-/g, " "));
    const descriptionTokens = tokenizeForSkillMatch(skill.description ?? "");
    let score = 0;
    for (const token of instructionTokens)
      if (nameTokens.some((candidate) => skillTokensMatch(candidate, token))) score += 2;
      else if (descriptionTokens.some((candidate) => skillTokensMatch(candidate, token)))
        score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = skill;
    }
  }
  return bestScore >= SKILL_MATCH_MIN_SCORE ? best : void 0;
}
function titleFromSkillName(skillName) {
  return skillName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
function buildInstructionGroup(params) {
  const skillName = normalizeSkillIndexName(params.skillName);
  if (!skillName) return;
  return {
    skillName,
    description: `Reusable workflow notes for ${params.label}.`,
    goal: `Capture durable user corrections for ${params.label}.`,
    evidence: params.instructions.join("\n"),
    instructions: [...params.instructions],
    existingSkill: params.existingSkill,
    content: [
      `# ${params.title}`,
      "",
      "## Workflow",
      "",
      ...params.instructions.map((instruction) => `- ${instruction}`),
      "- Verify the result before final reply.",
      "- Record durable pitfalls as short bullets; avoid copying transcript noise.",
    ].join("\n"),
  };
}
/**
 * Cheaply extracts candidate durable instructions from transcript text, newest last.
 */
function extractDurableInstructions(messages) {
  const userTexts = extractTranscriptText(messages)
    .filter((entry) => entry.role === "user")
    .map((entry) => entry.text);
  const instructions = [];
  for (const text of userTexts) {
    const instruction = extractInstruction(text);
    if (instruction && !instructions.includes(instruction)) instructions.push(instruction);
  }
  return instructions.slice(-8);
}
/**
 * Routes and groups already-extracted instructions into one proposal per target skill.
 */
function groupDurableInstructionProposals(params) {
  if (params.instructions.length === 0) return [];
  const groups = /* @__PURE__ */ new Map();
  for (const instruction of params.instructions) {
    const inferred = inferTopic(instruction);
    const existingSkills = params.existingSkills ?? [];
    const existing =
      matchExistingSkill(instruction, existingSkills) ??
      existingSkills.find((skill) => normalizeSkillIndexName(skill.name) === inferred.skillName);
    const topic = existing
      ? {
          skillName: existing.name,
          title: titleFromSkillName(existing.name),
          label: `the ${existing.name} skill`,
        }
      : inferred;
    const group = groups.get(topic.skillName);
    if (group) {
      group.instructions.push(instruction);
      groups.delete(topic.skillName);
      groups.set(topic.skillName, group);
    } else
      groups.set(topic.skillName, {
        title: topic.title,
        label: topic.label,
        instructions: [instruction],
        existingSkill: Boolean(existing),
      });
  }
  const maxProposals = params.maxProposals ?? DEFAULT_MAX_PROPOSALS;
  const proposals = [];
  for (const [skillName, group] of [...groups.entries()].slice(-maxProposals)) {
    const proposal = buildInstructionGroup({
      skillName,
      title: group.title,
      label: group.label,
      instructions: group.instructions,
      existingSkill: group.existingSkill,
    });
    if (proposal) proposals.push(proposal);
  }
  return proposals;
}
//#endregion
//#region src/skills/research/autocapture.ts
const log = createSubsystemLogger("skills/research");
const AUTO_CAPTURE_BLOCKED_TRIGGERS = /* @__PURE__ */ new Set([
  "cron",
  "heartbeat",
  "memory",
  "overflow",
]);
const AUTO_CAPTURE_BLOCKED_SESSION_SEGMENTS = /* @__PURE__ */ new Set([
  "cron",
  "hook",
  "subagent",
  "skill-workshop-review",
]);
const TOOL_CALL_BLOCK_TYPES = /* @__PURE__ */ new Set(["toolCall", "tool_use", "function_call"]);
const SKILL_WORKSHOP_MUTATING_ACTIONS = /* @__PURE__ */ new Set(["create", "update", "revise"]);
const skillCaptureQueue = new KeyedAsyncQueue();
function buildAutoCaptureUpdateContent(existingSkill, capturedContent) {
  return [existingSkill.trimEnd(), "", "## Captured Update", "", capturedContent.trim(), ""].join(
    "\n",
  );
}
function isSkillResearchAutoCaptureEligible(ctx) {
  const trigger = ctx.trigger?.trim().toLowerCase();
  if (trigger && AUTO_CAPTURE_BLOCKED_TRIGGERS.has(trigger)) return false;
  const sessionKey = ctx.sessionKey?.trim().toLowerCase();
  if (!sessionKey) return true;
  if (sessionKey.includes("active-memory")) return false;
  return !sessionKey
    .split(":")
    .some((segment) => AUTO_CAPTURE_BLOCKED_SESSION_SEGMENTS.has(segment));
}
function readToolCallAction(value) {
  let input = value;
  if (typeof input === "string")
    try {
      input = JSON.parse(input);
    } catch {
      return;
    }
  if (!input || typeof input !== "object" || Array.isArray(input)) return;
  const action = input.action;
  return typeof action === "string" ? action.trim().toLowerCase() : void 0;
}
function isSkillWorkshopMutationBlock(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const block = value;
  if (!TOOL_CALL_BLOCK_TYPES.has(String(block.type))) return false;
  if (typeof block.name !== "string" || block.name.trim().toLowerCase() !== "skill_workshop")
    return false;
  const action = readToolCallAction(block.arguments ?? block.input ?? block.args);
  return action ? SKILL_WORKSHOP_MUTATING_ACTIONS.has(action) : false;
}
function hasUnfailedSkillWorkshopMutationCall(messages) {
  const callIds = /* @__PURE__ */ new Set();
  let hasUnidentifiedCall = false;
  for (const message of messages) {
    if (!message || typeof message !== "object" || Array.isArray(message)) continue;
    const content = message.content;
    const blocks = Array.isArray(content) ? content : [content];
    for (const block of blocks) {
      if (!isSkillWorkshopMutationBlock(block)) continue;
      const id = block && typeof block === "object" && !Array.isArray(block) ? block.id : void 0;
      if (typeof id === "string" && id) callIds.add(id);
      else hasUnidentifiedCall = true;
    }
  }
  if (hasUnidentifiedCall) return true;
  for (const message of messages) {
    if (!message || typeof message !== "object" || Array.isArray(message)) continue;
    const result = message;
    if (
      result.role === "toolResult" &&
      result.isError === true &&
      typeof result.toolCallId === "string"
    )
      callIds.delete(result.toolCallId);
  }
  return callIds.size > 0;
}
function currentTurnMessages(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (
      message &&
      typeof message === "object" &&
      !Array.isArray(message) &&
      message.role === "user"
    )
      return messages.slice(index);
  }
  return messages;
}
function fingerprintInstructions(instructions) {
  return sha256Hex(
    instructions.map((instruction) => compactWhitespace(instruction).toLowerCase()).join("\n"),
  );
}
function proposalSignalHashes(proposal) {
  return [
    .../* @__PURE__ */ new Set([
      ...proposal.instructions.map((instruction) => fingerprintInstructions([instruction])),
      fingerprintInstructions(proposal.instructions),
    ]),
  ];
}
function instructionSignalHashes(instructions) {
  return [...new Set(instructions.map((instruction) => fingerprintInstructions([instruction])))];
}
function buildProposalOrigin(ctx) {
  return {
    ...(ctx.agentId ? { agentId: ctx.agentId } : {}),
    ...(ctx.sessionKey ? { sessionKey: ctx.sessionKey } : {}),
    ...(ctx.runId ? { runId: ctx.runId } : {}),
  };
}
/**
 * Captures or suggests durable skill research signals from a completed session turn.
 *
 * Runs regardless of the turn's success flag: the extracted signals are the user's own words,
 * which stay valid when a run fails — corrections given in a failed or timed-out turn are the
 * ones most worth keeping.
 */
async function runSkillResearchAutoCapture(params) {
  const workshopConfig = resolveSkillWorkshopConfig(params.config);
  const workspaceDir = params.ctx.workspaceDir;
  if (!workspaceDir) return;
  if (!isSkillResearchAutoCaptureEligible(params.ctx)) return;
  const sessionKey = params.ctx.sessionKey?.trim();
  if (!sessionKey) return;
  const sessionScope = {
    agentId: params.ctx.agentId,
    sessionKey,
    storePath: resolveStorePath(params.config?.session?.store, { agentId: params.ctx.agentId }),
  };
  await skillCaptureQueue.enqueue(workspaceDir, async () => {
    const turnMessages = currentTurnMessages(params.event.messages);
    if (hasUnfailedSkillWorkshopMutationCall(turnMessages)) {
      const signalHashes = extractDurableInstructions([...turnMessages]).map((instruction) =>
        fingerprintInstructions([instruction]),
      );
      await recordSessionSkillCaptureSignals({
        ...sessionScope,
        signalHashes,
      });
      return;
    }
    const capturedSignalHashes = readSessionSkillCaptureSignalHashes(sessionScope);
    if (!capturedSignalHashes) return;
    const capturedSignals = new Set(capturedSignalHashes);
    const instructions = extractDurableInstructions(params.event.messages).filter(
      (instruction) => !capturedSignals.has(fingerprintInstructions([instruction])),
    );
    if (instructions.length === 0) return;
    const existingSkills = listWritableWorkspaceSkillSummaries(workspaceDir, {
      config: params.config,
      agentId: params.ctx.agentId,
    });
    const proposals = groupDurableInstructionProposals({
      instructions,
      existingSkills,
    });
    if (proposals.length === 0) return;
    const manifest = await listSkillProposals({ workspaceDir });
    const allInstructionSignalHashes = instructionSignalHashes(instructions);
    if (!workshopConfig.autonomous.enabled) {
      const proposal = proposals.at(-1);
      if (!proposal) return;
      const signalHashes = proposalSignalHashes(proposal);
      const signalHash = signalHashes.at(-1);
      if (!signalHash || capturedSignals.has(signalHash)) return;
      if (
        manifest.proposals.some(
          (entry) =>
            (entry.status === "pending" || entry.status === "quarantined") &&
            entry.skillKey === proposal.skillName,
        )
      ) {
        await recordSessionSkillCaptureSignals({
          ...sessionScope,
          signalHashes: [...allInstructionSignalHashes, ...signalHashes],
        });
        return;
      }
      try {
        if (!proposal.existingSkill) {
          if (
            (await readWorkspaceSkillFile(
              resolveSkillProposalTarget({
                workspaceDir,
                skillName: proposal.skillName,
              }).skillFile,
            )) !== null
          ) {
            await recordSessionSkillCaptureSignals({
              ...sessionScope,
              signalHashes: [...allInstructionSignalHashes, ...signalHashes],
            });
            return;
          }
        }
        if (
          await recordSessionSkillSuggestion({
            ...sessionScope,
            skillName: proposal.skillName,
            signalHash,
            relatedSignalHashes: [...allInstructionSignalHashes, ...signalHashes.slice(0, -1)],
          })
        )
          log.info(`skill research queued suggestion ${proposal.skillName}`);
      } catch (error) {
        log.warn(`skill research suggestion skipped: ${String(error)}`);
      }
      return;
    }
    const selectedInstructionHashes = new Set(
      proposals.flatMap((proposal) => instructionSignalHashes(proposal.instructions)),
    );
    await recordSessionSkillCaptureSignals({
      ...sessionScope,
      signalHashes: allInstructionSignalHashes.filter(
        (hash) => !selectedInstructionHashes.has(hash),
      ),
    });
    for (const proposal of proposals) {
      const signalHashes = proposalSignalHashes(proposal);
      const signalHash = signalHashes.at(-1);
      if (!signalHash || capturedSignals.has(signalHash)) continue;
      const claimedSignalHashes = await claimSessionSkillCaptureSignals({
        ...sessionScope,
        signalHash,
        signalHashes,
      });
      if (!claimedSignalHashes) continue;
      for (const hash of claimedSignalHashes) capturedSignals.add(hash);
      try {
        const sameSkillEntries = manifest.proposals.filter(
          (entry) => entry.skillKey === proposal.skillName,
        );
        if (sameSkillEntries.some((entry) => entry.status === "quarantined")) {
          await recordSessionSkillCaptureSignals({
            ...sessionScope,
            signalHashes,
          });
          continue;
        }
        const pendingEntries = sameSkillEntries.filter((entry) => entry.status === "pending");
        let autocapturePending;
        for (const entry of pendingEntries) {
          const inspected = await inspectSkillProposal(entry.id, { workspaceDir });
          if (inspected?.record.createdBy === "skill-workshop") {
            autocapturePending = inspected;
            break;
          }
        }
        if (pendingEntries.length > 0 && !autocapturePending) {
          await recordSessionSkillCaptureSignals({
            ...sessionScope,
            signalHashes,
          });
          continue;
        }
        const existingSkill = await readWorkspaceSkillFile(
          existingSkills.find((entry) => entry.name === proposal.skillName)?.filePath ??
            resolveSkillProposalTarget({
              workspaceDir,
              skillName: proposal.skillName,
            }).skillFile,
        );
        const result = autocapturePending
          ? await reviseSkillProposal({
              workspaceDir,
              config: params.config,
              proposalId: autocapturePending.record.id,
              content: buildAutoCaptureUpdateContent(
                stripProposalFrontmatterForSkill(autocapturePending.content),
                proposal.content,
              ),
              evidence: [autocapturePending.record.evidence, proposal.evidence]
                .filter((value) => Boolean(value))
                .join("\n"),
            })
          : existingSkill === null
            ? await proposeCreateSkill({
                workspaceDir,
                config: params.config,
                name: proposal.skillName,
                description: proposal.description,
                content: proposal.content,
                createdBy: "skill-workshop",
                origin: buildProposalOrigin(params.ctx),
                goal: proposal.goal,
                evidence: proposal.evidence,
              })
            : await proposeUpdateSkill({
                workspaceDir,
                config: params.config,
                agentId: params.ctx.agentId,
                skillName: proposal.skillName,
                description: proposal.description,
                content: buildAutoCaptureUpdateContent(existingSkill, proposal.content),
                createdBy: "skill-workshop",
                origin: buildProposalOrigin(params.ctx),
                goal: proposal.goal,
                evidence: proposal.evidence,
              });
        log.info(
          `skill research auto-capture queued workshop proposal ${result.record.target.skillKey}`,
        );
      } catch (error) {
        await releaseSessionSkillCaptureSignals({
          ...sessionScope,
          signalHashes: claimedSignalHashes,
        });
        for (const hash of claimedSignalHashes) capturedSignals.delete(hash);
        log.warn(`skill research auto-capture skipped ${proposal.skillName}: ${String(error)}`);
      }
    }
  });
}
//#endregion
export { runSkillResearchAutoCapture };
