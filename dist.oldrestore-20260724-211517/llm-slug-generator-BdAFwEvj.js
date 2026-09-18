import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import "./agent-scope-y9xQv_q1.js";
import {
  a as resolveAgentDir,
  c as resolveDefaultAgentId,
  o as resolveAgentWorkspaceDir,
} from "./agent-scope-config-DVIR1nBa.js";
import {
  n as extractLeadingHttpStatus,
  s as parseApiErrorPayload,
} from "./assistant-error-format-G5Se-DL7.js";
import { t as runEmbeddedAgent } from "./embedded-agent-T_kAEk06.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { n as resolveAgentTimeoutMs } from "./timeout-CjPlNzdm.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/hooks/llm-slug-generator.ts
/**
 * LLM-based slug generator for session memory filenames
 */
const log = createSubsystemLogger("llm-slug-generator");
const DEFAULT_SLUG_GENERATOR_TIMEOUT_MS = 15e3;
const PROVIDER_ERROR_PREFIX_RE =
  /^(?:provider\s+)?(?:api|llm|model|openai|anthropic|codex|gateway)\s+(?:request\s+)?(?:error|failed|failure)\b/i;
const PROVIDER_ERROR_DETAIL_RE =
  /\b(?:insufficient[_ -]?quota|quota (?:exceeded|exhausted)|exceeded your current quota|payment required|insufficient credits|credit balance|insufficient[_ -]?(?:balance|funds)|rate[_ -]?limit(?:ed)?|too many requests|invalid[_ -]?api[_ -]?key|incorrect api key|authentication failed|oauth token refresh failed|missing (?:token|projectid|credentials)|google cloud credentials|re-?authenticate|unauthorized|forbidden|permission_error|billing hard limit|spend(?:ing)? limit)\b/i;
function resolveSlugGeneratorTimeoutMs(cfg) {
  const configuredTimeoutSeconds = cfg.agents?.defaults?.timeoutSeconds;
  if (typeof configuredTimeoutSeconds !== "number" || !Number.isFinite(configuredTimeoutSeconds))
    return DEFAULT_SLUG_GENERATOR_TIMEOUT_MS;
  return resolveAgentTimeoutMs({ cfg });
}
function isErrorSlugPayload(payload) {
  if (!payload) return false;
  if (payload.isError === true) return true;
  const text = payload.text?.trim();
  if (!text) return false;
  if (parseApiErrorPayload(text)) return true;
  const leadingStatus = extractLeadingHttpStatus(text);
  if (leadingStatus) {
    if ([401, 402, 403, 429].includes(leadingStatus.code)) return true;
    if (
      leadingStatus.code === 400 &&
      (parseApiErrorPayload(leadingStatus.rest) ||
        PROVIDER_ERROR_PREFIX_RE.test(leadingStatus.rest) ||
        PROVIDER_ERROR_DETAIL_RE.test(leadingStatus.rest))
    )
      return true;
  }
  return PROVIDER_ERROR_PREFIX_RE.test(text) || PROVIDER_ERROR_DETAIL_RE.test(text);
}
/**
 * Generate a short 1-2 word filename slug from session content using LLM
 */
async function generateSlugViaLLM(params) {
  let tempSessionFile = null;
  try {
    const agentId = resolveDefaultAgentId(params.cfg);
    const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId);
    const agentDir = resolveAgentDir(params.cfg, agentId);
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-slug-"));
    tempSessionFile = path.join(tempDir, "session.jsonl");
    const prompt = `Based on this conversation, generate a short 1-2 word filename slug (lowercase, hyphen-separated, no file extension).

Conversation summary:
${truncateUtf16Safe(params.sessionContent, 2e3)}

Reply with ONLY the slug, nothing else. Examples: "vendor-pitch", "api-design", "bug-fix"`;
    const timeoutMs = resolveSlugGeneratorTimeoutMs(params.cfg);
    const result = await runEmbeddedAgent({
      sessionId: `slug-generator-${Date.now()}`,
      sessionKey: "temp:slug-generator",
      agentId,
      sessionFile: tempSessionFile,
      workspaceDir,
      agentDir,
      config: params.cfg,
      prompt,
      model: params.model,
      timeoutMs,
      runId: `slug-gen-${Date.now()}`,
      cleanupBundleMcpOnRunEnd: true,
      authProfileFailurePolicy: "local",
    });
    if (result.payloads && result.payloads.length > 0) {
      const payload = result.payloads[0];
      const text = payload?.text;
      if (text) {
        if (isErrorSlugPayload(payload)) return null;
        return (
          normalizeLowercaseStringOrEmpty(text)
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 30)
            .replace(/^-+|-+$/g, "") || null
        );
      }
    }
    return null;
  } catch (err) {
    const message = err instanceof Error ? (err.stack ?? err.message) : String(err);
    log.error(`Failed to generate slug: ${message}`);
    return null;
  } finally {
    if (tempSessionFile)
      try {
        await fs.rm(path.dirname(tempSessionFile), {
          recursive: true,
          force: true,
        });
      } catch {}
  }
}
//#endregion
export { generateSlugViaLLM as t };
