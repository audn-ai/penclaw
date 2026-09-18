// src/agents/sessions/auto-continue.ts
//
// [autoproduct port 2026-07-16] Turn-loop AUTO-CONTINUE for openclaw gateway sessions.
//
// Direct port of the mechanism that is LIVE + verified in penclaw-platform/lib/ai-chat.js
// (Meta-Claw streamChat auto-continue). Same contract, same progress terminators, same
// planner/executor split — re-homed onto openclaw's own turn loop instead of the
// @openai/agents Runner.
//
// WHERE THIS PLUGS IN (see agent-session.ts `runAgentPrompt`): openclaw's inner turn loop
// (packages/agent-core agent-loop.ts `runLoop`) already re-drives itself while there are
// tool calls / queued follow-ups, and stops when the assistant ends a run on TEXT. The
// session driver loop `while (await this.handlePostAgentRun()) await this.agent.continue()`
// mirrors ai-chat.js's `while(true){ runner.run(...) }`. Auto-continue is the additional
// "should we re-drive?" check that runs AFTER retry/compaction decline to re-drive: on a
// text-ending run, ask the decider for a single boolean; unless it explicitly says
// shouldContinue:false, feed a FIXED "Continue" back as a synthetic USER turn
// (this.agent.prompt). Env-gated, DEFAULT OFF => byte-for-byte current behavior.
//
// BOUNDS (identical to ai-chat.js — an always-on loop with no progress terminator is a bug):
// UNBOUNDED by count (OPENCLAW_AUTOCONTINUE_MAX=0 default), bounded by PROGRESS:
//   * stall        — the run produced the same final text as the previous run
//   * no_progress  — 2 consecutive runs ended with no tool call
//   * decider      — the decider EXPLICITLY returned {"shouldContinue": false} (task done, blocked,
//                    or a question is owed to the user). No verdict at all => continue.
//   * max          — OPENCLAW_AUTOCONTINUE_MAX reached (only when > 0)
//   * aborted      — caller signals the run was aborted / errored
// The stall/no_progress pair is NOT tripped on the first offence: it escalates a forceful
// "do something different / say TASK COMPLETE" nudge once, and only stops if the very next
// run still repeats/stalls (escalation didn't break the loop). Real progress resets it.

/**
 * [2026-07-30] The decider answers exactly ONE question: keep going, or not.
 *
 * It used to return {status, reason, next_instruction} and the controller injected
 * `next_instruction` VERBATIM as the synthetic user turn — so the decider model's prose was
 * reflected straight into the user's conversation. Keeping this surface to a single boolean makes
 * that class of bug impossible: there is no text field to leak.
 */
export interface AutoContinueDecision {
  shouldContinue: boolean;
}

/** Input the controller inspects after each fully-completed run (agent_end on text). */
export interface AutoContinueTurn {
  /** The original task = first user message of the session/prompt (used by the planner). */
  task: string;
  /** The assistant's final text for the run that just ended. */
  lastText: string;
  /** Whether the run that just ended performed at least one tool call. */
  hadToolCall: boolean;
  /** The run ended aborted or in an unrecoverable error state — always stop. */
  aborted?: boolean;
  /**
   * The run ended by handing a tool call back to the caller (assistant stopReason "toolUse",
   * i.e. a terminate-flagged tool such as a /v1 client-tool handoff). This is a LEGITIMATE
   * terminal turn: the caller (e.g. LiteLLM / an agent loop over /v1/chat/completions) must
   * execute the tool and resume with a role:"tool" result. Auto-continuing here injects a
   * synthetic "Continue." user turn, which makes the agent re-emit the call and add commentary
   * on the placeholder "delegated to client" result — breaking the OpenAI tool-calling contract.
   */
  endedWithToolCall?: boolean;
}

/** Closed result shape so the driver never has to reconcile parallel booleans. */
export type AutoContinueNext =
  | { kind: "continue"; nudge: string; n: number; escalated: boolean }
  | { kind: "stop"; reason: string };

// ── Env gates (all default OFF; decider needs its OWN key — NOT the ambient OPENAI_API_KEY,
// which in a tenant gateway is pinned to the qwen36 vLLM endpoint, not real OpenAI). ────────

function envFlag(name: string): boolean {
  const v = process.env[name];
  return v === "1" || v === "true";
}

export function autoContinueEnabled(): boolean {
  return envFlag("OPENCLAW_AUTOCONTINUE");
}

const DECIDER_MODEL = process.env.OPENCLAW_AUTOCONTINUE_DECIDER_MODEL || "gpt-5.6-sol";
const DECIDER_BASE_URL = (
  process.env.OPENCLAW_AUTOCONTINUE_DECIDER_BASE_URL || "https://api.openai.com/v1"
).replace(/\/+$/, "");
const DECIDER_KEY = process.env.OPENCLAW_AUTOCONTINUE_DECIDER_API_KEY || "";

// [2026-07-18] qwen36 strict-JSON decider FALLBACK config. Reuses the gateway's OWN worker
// endpoint/key (OPENAI_*), which in a tenant gateway IS the qwen36 vLLM — self-hosted, no OpenAI quota.
const FALLBACK_BASE_URL = (
  process.env.OPENCLAW_AUTOCONTINUE_FALLBACK_BASE_URL ||
  process.env.OPENAI_BASE_URL ||
  ""
).replace(/\/+$/, "");
const FALLBACK_KEY =
  process.env.OPENCLAW_AUTOCONTINUE_FALLBACK_API_KEY || process.env.OPENAI_API_KEY || "";
const FALLBACK_MODEL =
  process.env.OPENCLAW_AUTOCONTINUE_FALLBACK_MODEL ||
  process.env.OPENAI_MODEL ||
  "pingu-unchained-10";

const DECIDER_SYSTEM =
  "You decide whether an autonomous coding/ops agent should KEEP WORKING on the user's task. " +
  "Answer false ONLY if the task is already finished, or the agent is blocked, or a question or " +
  "decision is genuinely owed to the user. Otherwise answer true. " +
  'Reply with ONLY this JSON object and nothing else: {"shouldContinue": true} or {"shouldContinue": false}';

function deciderUser(turn: AutoContinueTurn): string {
  return (
    "TASK:\n" +
    (turn.task || "(unspecified)") +
    "\n\nWORKER'S LATEST OUTPUT:\n" +
    String(turn.lastText || "").slice(0, 4000) +
    "\n\nWorker took a tool action this turn: " +
    (turn.hadToolCall ? "yes" : "no") +
    "."
  );
}

/**
 * Parse a decider reply into the boolean, and NOTHING else. Any prose the model emitted is
 * discarded here — this is the choke point that keeps decider output out of the conversation.
 * Accepts a raw string (extracts the first {...}) or an already-parsed object, and tolerates the
 * LEGACY {"status":"continue|complete|..."} shape so a mixed fleet still yields a usable verdict.
 * Returns null when nothing usable was found; callers then DEFAULT TO CONTINUE.
 */
export function parseShouldContinue(raw: unknown): boolean | null {
  let obj: unknown = raw;
  if (typeof raw === "string") {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      obj = JSON.parse(m[0]);
    } catch {
      return null;
    }
  }
  if (!obj || typeof obj !== "object") return null;
  const o = obj as Record<string, unknown>;
  if (typeof o.shouldContinue === "boolean") return o.shouldContinue;
  if (o.shouldContinue === "true") return true;
  if (o.shouldContinue === "false") return false;
  if (typeof o.status === "string") return o.status === "continue"; // legacy shape
  return null;
}

const DECISION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: { shouldContinue: { type: "boolean" } },
  required: ["shouldContinue"],
} as const;

/**
 * qwen36 strict-JSON FALLBACK (self-hosted, no OpenAI quota). Returns the boolean, or null when it
 * cannot be determined — null means "no opinion", which the caller treats as CONTINUE.
 */
async function qwenDecide(turn: AutoContinueTurn): Promise<AutoContinueDecision | null> {
  if (!FALLBACK_BASE_URL || !FALLBACK_KEY) return null;
  try {
    const res = await fetch(`${FALLBACK_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${FALLBACK_KEY}` },
      body: JSON.stringify({
        model: FALLBACK_MODEL,
        temperature: 0,
        max_tokens: 60,
        response_format: { type: "json_object" },
        chat_template_kwargs: { enable_thinking: false },
        messages: [
          { role: "system", content: DECIDER_SYSTEM },
          { role: "user", content: deciderUser(turn) },
        ],
      }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const v = parseShouldContinue(body.choices?.[0]?.message?.content || "");
    return v === null ? null : { shouldContinue: v };
  } catch {
    return null;
  }
}

/**
 * DECISION-MAKER: gpt-5.6-sol on the real OpenAI Responses API, strict JSON boolean. Falls back to
 * the self-hosted qwen36 decider. Returns null when no verdict could be obtained at all — the
 * caller then DEFAULTS TO CONTINUE.
 */
export async function metaDecide(turn: AutoContinueTurn): Promise<AutoContinueDecision | null> {
  if (!envFlag("OPENCLAW_AUTOCONTINUE_DECIDER")) {
    return null;
  }
  if (!DECIDER_KEY) {
    return await qwenDecide(turn);
  }
  try {
    const res = await fetch(`${DECIDER_BASE_URL}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${DECIDER_KEY}` },
      body: JSON.stringify({
        model: DECIDER_MODEL,
        reasoning: { effort: "low" },
        max_output_tokens: 200,
        text: {
          format: {
            type: "json_schema",
            name: "next_step_decision",
            strict: true,
            schema: DECISION_SCHEMA,
          },
        },
        input: [
          { role: "system", content: DECIDER_SYSTEM },
          { role: "user", content: deciderUser(turn) },
        ],
      }),
    });
    if (!res.ok) {
      return await qwenDecide(turn);
    }
    const body = (await res.json()) as {
      output_text?: string;
      output?: { content?: { type?: string; text?: string }[] }[];
    };
    let outputText = body.output_text;
    if (!outputText) {
      const parts: string[] = [];
      for (const item of body.output || []) {
        for (const c of item.content || []) {
          if (c.type === "output_text" || c.type === "text") {
            parts.push(c.text || "");
          }
        }
      }
      outputText = parts.join("");
    }
    const v = parseShouldContinue(outputText || "");
    if (v === null) {
      return await qwenDecide(turn);
    }
    return { shouldContinue: v };
  } catch {
    return await qwenDecide(turn);
  }
}

// [2026-07-30] The synthetic turn is a FIXED "Continue" — per the owner's contract. The previous
// rotating NUDGES list and the long "you repeated yourself..." escalation paragraph were both
// model-facing prose invented here and injected as if the user had typed it; a stall is now handled
// purely by STOPPING (see the escalate-once-then-stop logic in decideNext), not by lecturing the
// model. pickNudge is kept as a thin shim so any other caller/import keeps compiling.
export const CONTINUE_MESSAGE = "Continue";

export function pickNudge(_n?: number, _escalated?: boolean): string {
  return CONTINUE_MESSAGE;
}

/**
 * Per-run stateful controller. One instance per top-level user prompt; it survives across the
 * synthetic "Continue." runs it drives. `decideNext` is called once per fully-completed run.
 */
export class AutoContinueController {
  private readonly max: number;
  private n = 0;
  private lastFinal: string | null = null;
  private noToolStreak = 0;
  private escalated = false;

  constructor() {
    this.max = Number.parseInt(process.env.OPENCLAW_AUTOCONTINUE_MAX || "0", 10) || 0;
  }

  get count(): number {
    return this.n;
  }

  async decideNext(turn: AutoContinueTurn): Promise<AutoContinueNext> {
    if (turn.aborted) {
      return { kind: "stop", reason: "aborted" };
    }
    // A tool-call handoff is a terminal turn: the /v1 caller (LiteLLM / an agent loop) must run
    // the tool and resume. Checked BEFORE the decider so a nondeterministic "continue" verdict
    // can never re-drive it — re-driving duplicates the call and emits placeholder commentary,
    // which surfaces to the client as a broken/empty tool response.
    if (turn.endedWithToolCall) {
      return { kind: "stop", reason: "tool_calls" };
    }
    const finalText = String(turn.lastText || "");

    if (turn.hadToolCall) {
      this.noToolStreak = 0;
    } else {
      this.noToolStreak += 1;
    }

    // Repeat / no-action: escalate once before stopping (mirrors ai-chat.js).
    const repeated =
      (this.lastFinal !== null && finalText.trim() === this.lastFinal.trim()) ||
      this.noToolStreak >= 2;
    if (repeated) {
      if (this.escalated) {
        return { kind: "stop", reason: this.noToolStreak >= 2 ? "no_progress" : "stall" };
      }
      this.escalated = true;
    } else {
      this.escalated = false;
    }

    if (this.max > 0 && this.n >= this.max) {
      return { kind: "stop", reason: "max" };
    }

    // Ask the decider. Contract: it may only say "stop" by explicitly returning
    // shouldContinue:false. Anything else — decider disabled, HTTP error, unparseable body, no
    // JSON at all — is NO OPINION and DEFAULTS TO CONTINUE (owner's spec). The loop stays bounded
    // by the progress terminators above (stall / no_progress / max / aborted), not by this call.
    const decision = await metaDecide(turn);
    if (decision && decision.shouldContinue === false) {
      return { kind: "stop", reason: "decider" };
    }

    this.n += 1;
    this.lastFinal = finalText;
    return { kind: "continue", nudge: CONTINUE_MESSAGE, n: this.n, escalated: this.escalated };
  }
}
