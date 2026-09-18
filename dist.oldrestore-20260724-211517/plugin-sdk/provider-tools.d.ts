import {
  GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS,
  cleanSchemaForGemini,
  stripUnsupportedSchemaKeywords,
} from "@openclaw/ai/internal/openai";
import {
  Pt as ProviderNormalizeToolSchemasContext,
  a as AnyAgentTool,
  tn as ProviderToolSchemaDiagnostic,
} from "../plugin-entry-DPCR66aO.js";

//#region src/plugin-sdk/provider-tools.d.ts
/**
 * Finds unsupported JSON-schema keywords and reports their nested schema paths.
 */
declare function findUnsupportedSchemaKeywords(
  /** JSON schema node to inspect recursively. */
  schema: unknown,
  /** Dot/bracket path prefix used in returned diagnostics. */ path: string,
  /** Schema keywords unsupported by the target provider family. */ unsupportedKeywords: ReadonlySet<string>,
): string[];
/**
 * Rewrites tool schemas into Gemini-compatible JSON schema before provider dispatch.
 */
declare function normalizeGeminiToolSchemas(
  /** Provider tool-schema normalization context containing the active tool list. */

  ctx: ProviderNormalizeToolSchemasContext,
): AnyAgentTool[];
/**
 * Reports Gemini-incompatible schema keywords without mutating tool definitions.
 */
declare function inspectGeminiToolSchemas(
  /** Provider tool-schema inspection context containing the active tool list. */

  ctx: ProviderNormalizeToolSchemasContext,
): ProviderToolSchemaDiagnostic[];
/**
 * Rewrites OpenAI-native tool schemas to satisfy strict object-schema requirements.
 */
declare function normalizeOpenAIToolSchemas(
  /** Provider tool-schema normalization context used to detect native OpenAI strict routes. */

  ctx: ProviderNormalizeToolSchemasContext,
): AnyAgentTool[];
/**
 * Finds schema paths that violate OpenAI strict tool-schema requirements.
 */
declare function findOpenAIStrictSchemaViolations(
  /** JSON schema node to inspect recursively. */

  schema: unknown /** Dot/bracket path prefix used in returned diagnostics. */,

  path: string /** Strictness controls for the current schema position. */,

  options?: {
    requireObjectRoot?: boolean;
  },
): string[];
/**
 * Reports OpenAI strict-schema diagnostics for transports that enforce them before dispatch.
 */
declare function inspectOpenAIToolSchemas(
  /** Provider tool-schema inspection context used to detect native OpenAI strict routes. */

  ctx: ProviderNormalizeToolSchemasContext,
): ProviderToolSchemaDiagnostic[];
/**
 * DeepSeek rejects union keywords in tool schemas.
 */
declare const DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS: Set<string>;
/**
 * Rewrites DeepSeek-incompatible union schemas into the closest accepted shape.
 */
declare function normalizeDeepSeekToolSchemas(
  /** Provider tool-schema normalization context containing the active tool list. */

  ctx: ProviderNormalizeToolSchemasContext,
): AnyAgentTool[];
/**
 * Reports DeepSeek-incompatible union schema paths without mutating tool definitions.
 */
declare function inspectDeepSeekToolSchemas(
  /** Provider tool-schema inspection context containing the active tool list. */

  ctx: ProviderNormalizeToolSchemasContext,
): ProviderToolSchemaDiagnostic[];
/**
 * Supported provider tool-schema compatibility families.
 */
type ProviderToolCompatFamily = "deepseek" | "gemini" | "openai";
/**
 * Returns the normalizer and inspector pair for a provider tool-schema compatibility family.
 */
declare function buildProviderToolCompatFamilyHooks(
  /** Provider tool-schema compatibility family to route to normalizer/inspector hooks. */

  family: ProviderToolCompatFamily,
): {
  /** Mutating-compatible hook that returns tool definitions accepted by the provider family. */ normalizeToolSchemas: (
    ctx: ProviderNormalizeToolSchemasContext,
  ) => AnyAgentTool[] /** Non-mutating hook that reports provider-family schema incompatibilities. */;
  inspectToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[];
};
//#endregion
export {
  DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS,
  GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS,
  ProviderToolCompatFamily,
  buildProviderToolCompatFamilyHooks,
  cleanSchemaForGemini,
  findOpenAIStrictSchemaViolations,
  findUnsupportedSchemaKeywords,
  inspectDeepSeekToolSchemas,
  inspectGeminiToolSchemas,
  inspectOpenAIToolSchemas,
  normalizeDeepSeekToolSchemas,
  normalizeGeminiToolSchemas,
  normalizeOpenAIToolSchemas,
  stripUnsupportedSchemaKeywords,
};
