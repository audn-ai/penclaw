import { TSchema } from "typebox";
import {
  d as AgentToolProgress,
  f as AgentToolResult,
  l as AgentTool,
  p as AgentToolUpdateCallback,
} from "./types-JQFrjdua.js";

//#region src/agents/image-sanitization.d.ts
type ImageSanitizationLimits = {
  maxDimensionPx?: number;
  maxBytes?: number;
};
//#endregion
//#region src/agents/tools/common.d.ts
type AgentToolWithMeta<TParameters extends TSchema, TResult> = AgentTool<TParameters, TResult> & {
  displaySummary?: string /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */;
  catalogMode?: "direct-only" /** Gateway client capabilities required before this tool can be assembled. */;
  requiredClientCaps?: string[];
  prepareBeforeToolCallParams?: (
    params: unknown,
    ctx: {
      toolCallId?: string;
      hookContext?: unknown;
      signal?: AbortSignal;
    },
  ) => unknown;
  finalizeBeforeToolCallParams?: (params: unknown, preparedParams: unknown) => unknown;
};
type ErasedAgentToolExecute = {
  execute(
    this: void,
    toolCallId: string,
    params: unknown,
    signal?: AbortSignal,
    onUpdate?: AgentToolUpdateCallback,
  ): Promise<AgentToolResult<unknown>>;
};
type AnyAgentTool = Omit<AgentTool, "execute"> &
  ErasedAgentToolExecute & {
    displaySummary?: string /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */;
    catalogMode?: "direct-only" /** Gateway client capabilities required before this tool can be assembled. */;
    requiredClientCaps?: string[];
    prepareBeforeToolCallParams?: AgentToolWithMeta<
      TSchema,
      unknown
    >["prepareBeforeToolCallParams"];
    finalizeBeforeToolCallParams?: AgentToolWithMeta<
      TSchema,
      unknown
    >["finalizeBeforeToolCallParams"];
  };
declare function asToolParamsRecord(params: unknown): Record<string, unknown>;
type StringParamOptions = {
  required?: boolean;
  trim?: boolean;
  label?: string;
  allowEmpty?: boolean;
};
type ActionGate<T extends Record<string, boolean | undefined>> = (
  key: keyof T,
  defaultValue?: boolean,
) => boolean;
declare class ToolInputError extends Error {
  readonly status: number;
  constructor(message: string);
}
declare class ToolAuthorizationError extends ToolInputError {
  readonly status = 403;
  constructor(message: string);
}
declare function createActionGate<T extends Record<string, boolean | undefined>>(
  actions: T | undefined,
): ActionGate<T>;
declare function readStringParam(
  params: Record<string, unknown>,
  key: string,
  options: StringParamOptions & {
    required: true;
  },
): string;
declare function readStringParam(
  params: Record<string, unknown>,
  key: string,
  options?: StringParamOptions,
): string | undefined;
/**
 * Normalize tool model override input.
 * - empty/whitespace => undefined
 * - "default" (case-insensitive) => undefined (sentinel: reset/fallback)
 * - otherwise returns trimmed explicit model string
 */
declare function normalizeToolModelOverride(value: string | undefined): string | undefined;
declare function readStringOrNumberParam(
  params: Record<string, unknown>,
  key: string,
  options?: {
    required?: boolean;
    label?: string;
  },
): string | undefined;
declare function readNumberParam(
  params: Record<string, unknown>,
  key: string,
  options?: {
    required?: boolean;
    label?: string;
    integer?: boolean;
    strict?: boolean;
    positiveInteger?: boolean;
    nonNegativeInteger?: boolean;
  },
): number | undefined;
declare function readPositiveIntegerParam(
  params: Record<string, unknown>,
  key: string,
  options?: {
    message?: string;
    max?: number;
  },
): number | undefined;
declare function readNonNegativeIntegerParam(
  params: Record<string, unknown>,
  key: string,
  options?: {
    message?: string;
    max?: number;
  },
): number | undefined;
declare function readFiniteNumberParam(
  params: Record<string, unknown>,
  key: string,
  options?: {
    message?: string;
    min?: number;
    max?: number;
    minExclusive?: boolean;
    maxExclusive?: boolean;
  },
): number | undefined;
declare function readStringArrayParam(
  params: Record<string, unknown>,
  key: string,
  options: StringParamOptions & {
    required: true;
  },
): string[];
declare function readStringArrayParam(
  params: Record<string, unknown>,
  key: string,
  options?: StringParamOptions,
): string[] | undefined;
type ReactionParams = {
  emoji: string;
  remove: boolean;
  isEmpty: boolean;
};
declare function readReactionParams(
  params: Record<string, unknown>,
  options: {
    emojiKey?: string;
    removeKey?: string;
    removeErrorMessage: string;
  },
): ReactionParams;
declare function stringifyToolPayload(payload: unknown): string;
declare function failedTextResult<
  TDetails extends {
    status: "failed";
  },
>(text: string, details: TDetails): AgentToolResult<TDetails>;
declare function payloadTextResult<TDetails>(payload: TDetails): AgentToolResult<TDetails>;
type PublicToolProgress = Pick<AgentToolProgress, "text" | "id">;
declare function toolProgressResult(progress: PublicToolProgress): AgentToolResult<undefined>;
declare function emitToolProgress(
  onUpdate: AgentToolUpdateCallback | undefined,
  progress: PublicToolProgress,
): void;
declare function scheduleToolProgress(
  onUpdate: AgentToolUpdateCallback | undefined,
  progress: PublicToolProgress,
  delayMs: number,
  options?: {
    signal?: AbortSignal;
  },
): () => void;
declare function imageResult(params: {
  label: string;
  path: string;
  base64: string;
  mimeType: string;
  extraText?: string;
  details?: Record<string, unknown>;
  imageSanitization?: ImageSanitizationLimits;
}): Promise<AgentToolResult<unknown>>;
declare function imageResultFromFile(params: {
  label: string;
  path: string;
  extraText?: string;
  details?: Record<string, unknown>;
  imageSanitization?: ImageSanitizationLimits;
}): Promise<AgentToolResult<unknown>>;
type AvailableTag = {
  id?: string;
  name: string;
  moderated?: boolean;
  emoji_id?: string | null;
  emoji_name?: string | null;
};
/**
 * Validate and parse an `availableTags` parameter from untrusted input.
 * Returns `undefined` when the value is missing or not an array.
 * Entries that lack a string `name` are silently dropped.
 */
declare function parseAvailableTags(raw: unknown): AvailableTag[] | undefined;
//#endregion
export {
  readReactionParams as C,
  scheduleToolProgress as D,
  readStringParam as E,
  stringifyToolPayload as O,
  readPositiveIntegerParam as S,
  readStringOrNumberParam as T,
  parseAvailableTags as _,
  PublicToolProgress as a,
  readNonNegativeIntegerParam as b,
  ToolAuthorizationError as c,
  createActionGate as d,
  emitToolProgress as f,
  normalizeToolModelOverride as g,
  imageResultFromFile as h,
  AvailableTag as i,
  toolProgressResult as k,
  ToolInputError as l,
  imageResult as m,
  AgentToolWithMeta as n,
  ReactionParams as o,
  failedTextResult as p,
  AnyAgentTool as r,
  StringParamOptions as s,
  ActionGate as t,
  asToolParamsRecord as u,
  payloadTextResult as v,
  readStringArrayParam as w,
  readNumberParam as x,
  readFiniteNumberParam as y,
};
