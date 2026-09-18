import { i as MemoryCategory } from "../../config-Bcaj9yPO.js";
import {
  v as OpenClawPluginConfigSchema,
  y as OpenClawPluginDefinition$1,
} from "../../plugin-entry-DPCR66aO.js";
import { A as OpenClawPluginDefinition } from "../../types-Ga3mNO_F.js";

//#region extensions/memory-lancedb/index.d.ts
declare function normalizeRecallQuery(text: string, maxChars?: number): string;
declare function runWithTimeout<T>(params: { timeoutMs: number; task: () => Promise<T> }): Promise<
  | {
      status: "ok";
      value: T;
    }
  | {
      status: "timeout";
    }
>;
declare const testing: {
  readonly runWithTimeout: typeof runWithTimeout;
};
declare function normalizeEmbeddingVector(value: unknown): number[];
declare function looksLikePromptInjection(text: string): boolean;
declare function escapeMemoryForPrompt(text: string): string;
/**
 * Returns true if `text` looks like it contains OpenClaw-injected envelope or
 * transport metadata that should never be persisted as a long-term memory.
 */
declare function looksLikeEnvelopeSludge(text: string): boolean;
/**
 * Strips OpenClaw-injected envelope metadata from a user message so that only
 * the user's actual intent text remains. Returns empty string if nothing
 * meaningful survives.
 */
declare function sanitizeForMemoryCapture(text: string): string;
declare function formatRelevantMemoriesContext(
  memories: Array<{
    category: MemoryCategory;
    text: string;
  }>,
): string;
declare function shouldCapture(
  text: string,
  options?: {
    customTriggers?: string[];
    maxChars?: number;
  },
): boolean;
declare function detectCategory(text: string): MemoryCategory;
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<
  OpenClawPluginDefinition,
  "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors"
>;
//#endregion
export {
  _default as default,
  detectCategory,
  escapeMemoryForPrompt,
  formatRelevantMemoriesContext,
  looksLikeEnvelopeSludge,
  looksLikePromptInjection,
  normalizeEmbeddingVector,
  normalizeRecallQuery,
  sanitizeForMemoryCapture,
  shouldCapture,
  testing,
};
