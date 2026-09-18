import { t as SafeBinProfile } from "./exec-safe-bin-policy-profiles-CWCK911g.js";

//#region src/infra/command-analysis/explain.d.ts
/** Compact command explanation summary shown in approval UI. */
type CommandExplanationSummary = {
  commandCount: number;
  nestedCommandCount: number;
  riskKinds: string[];
  warningLines: string[];
};
//#endregion
//#region src/infra/exec-approval-policy-snapshot.d.ts
type ExecApprovalPolicyRule = {
  pattern: string;
  argPattern?: string;
  source?: "allow-always";
};
type ExecApprovalPolicySnapshot = {
  security: "deny" | "allowlist" | "full";
  ask: "off" | "on-miss" | "always";
  askFallback: "deny" | "allowlist" | "full";
  autoAllowSkills: boolean;
  allowlistRules: readonly ExecApprovalPolicyRule[];
};
//#endregion
//#region src/infra/exec-approvals.types.d.ts
type ExecAllowlistEntry = {
  id?: string;
  pattern: string;
  source?: "allow-always";
  commandText?: string;
  argPattern?: string;
  lastUsedAt?: number;
  lastUsedCommand?: string;
  lastResolvedPath?: string;
};
//#endregion
//#region src/infra/exec-command-resolution.d.ts
type ExecutableResolution = {
  rawExecutable: string;
  resolvedPath?: string;
  resolvedRealPath?: string;
  executableName: string;
};
type CommandResolution = {
  execution: ExecutableResolution;
  policy: ExecutableResolution;
  effectiveArgv?: string[];
  wrapperChain?: string[];
  policyBlocked?: boolean;
  blockedWrapper?: string;
};
declare function resolveCommandResolution(
  command: string,
  cwd?: string,
  env?: NodeJS.ProcessEnv,
): CommandResolution | null;
declare function resolveCommandResolutionFromArgv(
  argv: string[],
  cwd?: string,
  env?: NodeJS.ProcessEnv,
  platform?: NodeJS.Platform,
): CommandResolution | null;
declare function resolveExecutableTrustPath(
  resolution: ExecutableResolution | null | undefined,
  cwd?: string,
): string | undefined;
declare function resolveExecutionTargetResolution(
  resolution: CommandResolution | ExecutableResolution | null,
): ExecutableResolution | null;
declare function resolvePolicyTargetResolution(
  resolution: CommandResolution | ExecutableResolution | null,
): ExecutableResolution | null;
declare function resolveExecutionTargetCandidatePath(
  resolution: CommandResolution | ExecutableResolution | null,
  cwd?: string,
): string | undefined;
declare function resolveExecutionTargetTrustPath(
  resolution: CommandResolution | ExecutableResolution | null,
  cwd?: string,
): string | undefined;
declare function resolvePolicyTargetCandidatePath(
  resolution: CommandResolution | ExecutableResolution | null,
  cwd?: string,
): string | undefined;
declare function resolvePolicyTargetTrustPath(
  resolution: CommandResolution | ExecutableResolution | null,
  cwd?: string,
): string | undefined;
declare function resolveApprovalAuditCandidatePath(
  resolution: CommandResolution | null,
  cwd?: string,
): string | undefined;
declare function resolveApprovalAuditTrustPath(
  resolution: CommandResolution | null,
  cwd?: string,
): string | undefined;
/** @deprecated Use resolveExecutionTargetCandidatePath. */
declare function resolveAllowlistCandidatePath(
  resolution: CommandResolution | ExecutableResolution | null,
  cwd?: string,
): string | undefined;
declare function resolvePolicyAllowlistCandidatePath(
  resolution: CommandResolution | ExecutableResolution | null,
  cwd?: string,
): string | undefined;
declare function matchAllowlist(
  entries: ExecAllowlistEntry[],
  resolution: ExecutableResolution | null,
  argv?: string[],
  platform?: string | null,
): ExecAllowlistEntry | null;
type ExecArgvToken =
  | {
      kind: "empty";
      raw: string;
    }
  | {
      kind: "terminator";
      raw: string;
    }
  | {
      kind: "stdin";
      raw: string;
    }
  | {
      kind: "positional";
      raw: string;
    }
  | {
      kind: "option";
      raw: string;
      style: "long";
      flag: string;
      inlineValue?: string;
    }
  | {
      kind: "option";
      raw: string;
      style: "short-cluster";
      cluster: string;
      flags: string[];
    };
/**
 * Tokenizes a single argv entry into a normalized option/positional model.
 * Consumers can share this model to keep argv parsing behavior consistent.
 */
declare function parseExecArgvToken(raw: string): ExecArgvToken;
//#endregion
//#region src/infra/exec-command-analysis-types.d.ts
type ExecCommandSegment = {
  raw: string;
  argv: string[];
  sourceArgv?: string[];
  resolution: CommandResolution | null;
};
type ExecCommandAnalysis = {
  ok: boolean;
  reason?: string;
  segments: ExecCommandSegment[];
  chains?: ExecCommandSegment[][];
};
type ShellChainOperator = "&&" | "||" | ";" | "&";
//#endregion
//#region src/infra/exec-argv-analysis.d.ts
declare function analyzeArgvCommand(params: {
  argv: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
}): ExecCommandAnalysis;
//#endregion
//#region src/infra/windows-shell-command.d.ts
declare function tokenizeWindowsSegment(segment: string): string[] | null;
declare function analyzeWindowsShellCommand(params: {
  command: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
}): ExecCommandAnalysis;
declare function isWindowsPlatform(platform?: string | null): boolean;
declare function windowsEscapeArg(value: string):
  | {
      ok: true;
      escaped: string;
    }
  | {
      ok: false;
    };
//#endregion
//#region src/infra/exec-approvals-analysis.d.ts
declare function resolvePlannedSegmentArgv(segment: ExecCommandSegment): string[] | null;
declare function buildEnforcedShellCommand(params: {
  command: string;
  segments: ExecCommandSegment[];
  platform?: string | null;
}): {
  ok: boolean;
  command?: string;
  reason?: string;
};
//#endregion
//#region src/infra/command-explainer/types.d.ts
/** Where a parsed command step appeared in the shell source. */
type CommandContext =
  | "top-level"
  | "command-substitution"
  | "process-substitution"
  | "function-definition"
  | "wrapper-payload";
type SourceSpan = {
  startIndex: number;
  endIndex: number;
  startPosition: {
    row: number;
    column: number;
  };
  endPosition: {
    row: number;
    column: number;
  };
};
type CommandStep = {
  id?: string;
  parentCommandId?: string;
  context: CommandContext;
  executable: string;
  argv: string[];
  text: string;
  span: SourceSpan;
  executableSpan: SourceSpan;
};
type CommandOperatorKind =
  | "and"
  | "or"
  | "sequence"
  | "newline-sequence"
  | "pipe"
  | "stderr-pipe"
  | "background";
type CommandOperator = {
  id: string;
  kind: CommandOperatorKind;
  text: string;
  span: SourceSpan;
  fromCommandId: string;
  toCommandId: string;
  parentCommandId?: string;
};
//#endregion
//#region src/infra/exec-authorization-plan.d.ts
type ExecAuthorizationDialect = "argv" | "posix-shell" | "windows-cmd" | "powershell";
type ExecAuthorizationTransport =
  | {
      kind: "direct";
    }
  | {
      kind: "shell-wrapper";
      wrapperSegment: ExecCommandSegment;
      wrapperArgv: string[];
      wrapperPrefix: string;
      inlineCommand: string;
    };
type ExecAuthorizationTrustMode = "executable" | "exact-command" | "prompt-only";
type ExecAuthorizationCandidate = {
  sourceSegment: ExecCommandSegment;
  sourceStep: CommandStep;
  sourceStepId?: string;
  transport: ExecAuthorizationTransport;
  trustMode: ExecAuthorizationTrustMode;
  allowAlways: boolean;
  reasons: string[];
};
type ExecAuthorizationGroup = {
  opToNext?: ShellChainOperator | null;
  candidates: ExecAuthorizationCandidate[];
};
type ExecAuthorizationPlan =
  | {
      ok: true;
      dialect: ExecAuthorizationDialect;
      originalCommand: string;
      groups: ExecAuthorizationGroup[];
      operators: CommandOperator[];
    }
  | {
      ok: false;
      dialect: ExecAuthorizationDialect;
      originalCommand: string;
      reason: string;
      groups: [];
      operators: [];
    };
//#endregion
//#region src/infra/exec-safe-bin-trust.d.ts
type TrustedSafeBinPathParams = {
  resolvedPath: string;
  trustedDirs?: ReadonlySet<string>;
};
declare function isTrustedSafeBinPath(params: TrustedSafeBinPathParams): boolean;
//#endregion
//#region src/infra/exec-approvals-allowlist.d.ts
declare function normalizeSafeBins(entries?: readonly string[]): Set<string>;
declare function resolveSafeBins(entries?: readonly string[] | null): Set<string>;
declare function isSafeBinUsage(params: {
  argv: string[];
  resolution: ExecutableResolution | null;
  safeBins: Set<string>;
  platform?: string | null;
  trustedSafeBinDirs?: ReadonlySet<string>;
  safeBinProfiles?: Readonly<Record<string, SafeBinProfile>>;
  isTrustedSafeBinPathFn?: typeof isTrustedSafeBinPath;
}): boolean;
type ExecAllowlistEvaluation = {
  allowlistSatisfied: boolean;
  allowlistMatches: ExecAllowlistEntry[];
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  segmentSatisfiedBy: ExecSegmentSatisfiedBy[];
};
type ExecSegmentSatisfiedBy =
  | "allowlist"
  | "safeBins"
  | "inlineChain"
  | "safeBuiltins"
  | "skills"
  | null;
type SkillBinTrustEntry = {
  name: string;
  resolvedPath: string;
};
type ExecAllowlistContext = {
  allowlist: ExecAllowlistEntry[];
  safeBins: Set<string>;
  safeBinProfiles?: Readonly<Record<string, SafeBinProfile>>;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  trustedSafeBinDirs?: ReadonlySet<string>;
  skillBins?: readonly SkillBinTrustEntry[];
  autoAllowSkills?: boolean;
  allowShellBuiltins?: boolean;
};
declare function evaluateExecAllowlist(
  params: {
    analysis: ExecCommandAnalysis;
  } & ExecAllowlistContext,
): ExecAllowlistEvaluation;
type ExecAllowlistAnalysis = {
  analysisOk: boolean;
  allowlistSatisfied: boolean;
  allowlistMatches: ExecAllowlistEntry[];
  segments: ExecCommandSegment[];
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  segmentSatisfiedBy: ExecSegmentSatisfiedBy[];
  authorizationPlan?: ExecAuthorizationPlan;
};
type AllowAlwaysPattern = {
  pattern: string;
  argPattern?: string;
};
/**
 * Derive persisted allowlist patterns for an "allow always" decision.
 * When a command is wrapped in a shell (for example `zsh -lc "<cmd>"`),
 * persist the inner executable(s) rather than the shell binary.
 */
declare function resolveAllowAlwaysPatternEntries(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): AllowAlwaysPattern[];
declare function resolveAllowAlwaysPatterns(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): string[];
/**
 * Evaluates allowlist for shell commands (including &&, ||, ;) and returns analysis metadata.
 */
declare function evaluateShellAllowlist(
  params: {
    command: string;
    env?: NodeJS.ProcessEnv;
  } & ExecAllowlistContext,
): ExecAllowlistAnalysis;
declare function evaluateShellAllowlistWithAuthorization(
  params: {
    command: string;
    env?: NodeJS.ProcessEnv;
  } & ExecAllowlistContext,
): Promise<ExecAllowlistAnalysis>;
declare function evaluateExecAllowlistWithAuthorization(
  params: {
    analysis: ExecCommandAnalysis;
    command?: string;
  } & ExecAllowlistContext,
): Promise<
  ExecAllowlistEvaluation & {
    segments?: ExecCommandSegment[];
    authorizationPlan?: ExecAuthorizationPlan;
  }
>;
//#endregion
//#region src/infra/exec-approvals.d.ts
type ExecHost = "sandbox" | "gateway" | "node";
type ExecTarget = "auto" | ExecHost;
type ExecSecurity = "deny" | "allowlist" | "full";
type ExecAsk = "off" | "on-miss" | "always";
type ExecMode = "deny" | "allowlist" | "ask" | "auto" | "full";
declare const EXEC_TARGET_VALUES: readonly ExecTarget[];
declare function normalizeExecHost(value?: string | null): ExecHost | null;
declare function normalizeExecTarget(value?: string | null): ExecTarget | null;
declare function requireValidExecTarget(value?: unknown): ExecTarget | null;
declare function normalizeExecSecurity(value?: string | null): ExecSecurity | null;
declare function normalizeExecAsk(value?: string | null): ExecAsk | null;
declare function normalizeExecMode(value?: string | null): ExecMode | null;
declare function resolveExecModeFromPolicy(params: {
  security: ExecSecurity;
  ask: ExecAsk;
}): ExecMode;
declare function resolveExecPolicyForMode(mode: ExecMode): {
  security: ExecSecurity;
  ask: ExecAsk;
  autoReview: boolean;
};
declare function resolveExecModePolicy(params: {
  mode?: ExecMode | null;
  security: ExecSecurity;
  ask: ExecAsk;
}): {
  mode: ExecMode;
  security: ExecSecurity;
  ask: ExecAsk;
  autoReview: boolean;
};
type SystemRunApprovalBinding = {
  argv: string[];
  cwd: string | null;
  agentId: string | null;
  sessionKey: string | null;
  envHash: string | null;
};
type SystemRunApprovalFileOperand = {
  argvIndex: number;
  path: string;
  sha256: string;
};
type SystemRunApprovalPlan = {
  argv: string[];
  cwd: string | null;
  commandText: string;
  commandPreview?: string | null;
  agentId: string | null;
  sessionKey: string | null;
  policySnapshot?: ExecApprovalPolicySnapshot;
  mutableFileOperand?: SystemRunApprovalFileOperand | null;
};
type ExecApprovalCommandSpan = {
  startIndex: number;
  endIndex: number;
};
type ExecApprovalRequestPayload = {
  command: string;
  commandPreview?: string | null;
  commandArgv?: string[];
  envKeys?: string[];
  systemRunBinding?: SystemRunApprovalBinding | null;
  systemRunPlan?: SystemRunApprovalPlan | null;
  cwd?: string | null;
  nodeId?: string | null;
  host?: string | null;
  security?: string | null;
  ask?: string | null;
  warningText?: string | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandSpans?: ExecApprovalCommandSpan[];
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[];
  allowedDecisions?: readonly ExecApprovalDecision[];
  agentId?: string | null;
  resolvedPath?: string | null;
  sessionKey?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
type ExecApprovalRequest = {
  id: string;
  request: ExecApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type ExecApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: ExecApprovalRequest["request"];
};
type ExecApprovalsDefaults = {
  security?: ExecSecurity;
  ask?: ExecAsk;
  askFallback?: ExecSecurity;
  autoAllowSkills?: boolean;
};
type ExecApprovalsAgent = ExecApprovalsDefaults & {
  allowlist?: ExecAllowlistEntry[];
};
type ExecApprovalsFile = {
  version: 1;
  socket?: {
    path?: string;
    token?: string;
  };
  defaults?: ExecApprovalsDefaults;
  agents?: Record<string, ExecApprovalsAgent>;
};
type ExecApprovalsSnapshot = {
  path: string;
  exists: boolean;
  raw: string | null;
  file: ExecApprovalsFile;
  hash: string;
};
type ExecApprovalsResolved = {
  path: string;
  socketPath: string;
  token: string;
  defaults: Required<ExecApprovalsDefaults>;
  agent: Required<ExecApprovalsDefaults>;
  agentSources: {
    security: string | null;
    ask: string | null;
    askFallback: string | null;
  };
  allowlist: ExecAllowlistEntry[];
  file: ExecApprovalsFile;
};
declare const DEFAULT_EXEC_APPROVAL_TIMEOUT_MS = 1800000;
declare const DEFAULT_EXEC_APPROVAL_ASK_FALLBACK: ExecSecurity;
declare function resolveExecApprovalsPath(): string;
declare function resolveExecApprovalsSocketPath(): string;
declare function resolveExecApprovalsDisplayPath(): string;
declare function resolveExecApprovalsTranscriptPath(): string;
declare function normalizeExecApprovals(file: ExecApprovalsFile): ExecApprovalsFile;
declare function mergeExecApprovalsSocketDefaults(params: {
  normalized: ExecApprovalsFile;
  current?: ExecApprovalsFile;
}): ExecApprovalsFile;
declare function readExecApprovalsSnapshot(): ExecApprovalsSnapshot;
declare function loadExecApprovals(): ExecApprovalsFile;
declare function saveExecApprovals(file: ExecApprovalsFile): void;
declare function restoreExecApprovalsSnapshot(snapshot: ExecApprovalsSnapshot): void;
declare function ensureExecApprovals(): ExecApprovalsFile;
type ExecApprovalsDefaultOverrides = {
  security?: ExecSecurity;
  ask?: ExecAsk;
  askFallback?: ExecSecurity;
  autoAllowSkills?: boolean;
  requireSocket?: boolean;
};
declare function resolveExecApprovals(
  agentId?: string,
  overrides?: ExecApprovalsDefaultOverrides,
): ExecApprovalsResolved;
declare function resolveExecApprovalsFromFile(params: {
  file: ExecApprovalsFile;
  agentId?: string;
  overrides?: ExecApprovalsDefaultOverrides;
  path?: string;
  socketPath?: string;
  token?: string;
}): ExecApprovalsResolved;
declare function requiresExecApproval(params: {
  ask: ExecAsk;
  security: ExecSecurity;
  analysisOk: boolean;
  allowlistSatisfied: boolean;
  durableApprovalSatisfied?: boolean;
}): boolean;
declare function commandRequiresSecurityAuditSuppressionApproval(params: {
  command: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  segments: Array<{
    argv: string[];
    raw?: string;
  }>;
}): boolean;
declare function hasDurableExecApproval(params: {
  analysisOk: boolean;
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function hasNodeCommandAllowAlwaysMarker(params: {
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function hasExactCommandDurableExecApproval(params: {
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
type ExecApprovalUsageAuthorization = {
  source: "current-policy" | "ask-fallback" | "explicit-approval" | "auto-review";
  security: ExecSecurity;
  ask: ExecAsk;
  allowlistSatisfied: boolean;
  policySnapshot?: ExecApprovalPolicySnapshot;
  requireAutoAllowSkills?: boolean;
  requireExactCommandApproval?: boolean;
  requireDurableAllowlistApproval?: boolean;
};
declare function recordAllowlistUse(
  approvals: ExecApprovalsFile,
  agentId: string | undefined,
  entry: ExecAllowlistEntry,
  command: string,
  resolvedPath?: string,
): void;
declare function recordAllowlistMatchesUse(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  matches: readonly ExecAllowlistEntry[];
  command: string;
  resolvedPath?: string;
  authorization?: ExecApprovalUsageAuthorization;
}): void;
declare function addAllowlistEntry(
  approvals: ExecApprovalsFile,
  agentId: string | undefined,
  pattern: string,
  options?: {
    argPattern?: string;
    source?: ExecAllowlistEntry["source"];
  },
): void;
declare function addDurableCommandApproval(
  approvals: ExecApprovalsFile,
  agentId: string | undefined,
  commandText: string,
): void;
declare function resolveAllowAlwaysPatternCoverage(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): {
  complete: boolean;
  patterns: ReturnType<typeof resolveAllowAlwaysPatternEntries>;
};
declare function persistAllowAlwaysPatterns(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  commandText?: string;
  strictInlineEval?: boolean;
}): ReturnType<typeof resolveAllowAlwaysPatternEntries>;
type AllowAlwaysPersistenceReason =
  | "no-reusable-pattern"
  | "prompt-only"
  | "runtime-payload"
  | "unplanned";
type AllowAlwaysPersistenceDecision =
  | {
      kind: "patterns";
      patterns: readonly AllowAlwaysPattern[];
      commandText?: string;
    }
  | {
      kind: "exact-command";
      commandText: string;
    }
  | {
      kind: "one-shot";
      reasons: AllowAlwaysPersistenceReason[];
    };
declare function resolveAllowAlwaysPersistenceDecision(params: {
  segments: ExecCommandSegment[];
  commandText?: string | null;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
  authorizationPlan?: ExecAuthorizationPlan;
  runtimePayload?: boolean;
  preparedCoverage?: ReturnType<typeof resolveAllowAlwaysPatternCoverage> | null;
}): AllowAlwaysPersistenceDecision;
declare function persistAllowAlwaysDecision(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  decision: AllowAlwaysPersistenceDecision;
}): void;
declare function minSecurity(a: ExecSecurity, b: ExecSecurity): ExecSecurity;
declare function maxAsk(a: ExecAsk, b: ExecAsk): ExecAsk;
type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";
declare const DEFAULT_EXEC_APPROVAL_DECISIONS: readonly ["allow-once", "allow-always", "deny"];
declare const OPTIONAL_EXEC_APPROVAL_DECISIONS: readonly ["allow-always"];
type ExecApprovalUnavailableDecision = (typeof OPTIONAL_EXEC_APPROVAL_DECISIONS)[number];
declare function normalizeExecApprovalUnavailableDecisions(
  decisions?: readonly string[] | readonly ExecApprovalUnavailableDecision[] | null,
): readonly ExecApprovalUnavailableDecision[];
declare function resolveExecApprovalAllowedDecisions(params?: {
  ask?: string | null;
  allowAlwaysPersistence?: AllowAlwaysPersistenceDecision | null;
}): readonly ExecApprovalDecision[];
declare function resolveExecApprovalUnavailableDecisions(params?: {
  ask?: string | null;
  allowAlwaysPersistence?: AllowAlwaysPersistenceDecision | null;
}): readonly ExecApprovalUnavailableDecision[];
declare function resolveExecApprovalRequestAllowedDecisions(params?: {
  ask?: string | null;
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[] | readonly string[] | null;
}): readonly ExecApprovalDecision[];
declare function isExecApprovalDecisionAllowed(params: {
  decision: ExecApprovalDecision;
  ask?: string | null;
}): boolean;
declare function requestExecApprovalViaSocket(params: {
  socketPath: string;
  token: string;
  request: Record<string, unknown>;
  timeoutMs?: number;
}): Promise<ExecApprovalDecision | null>;
//#endregion
export {
  requireValidExecTarget as $,
  resolveExecutionTargetResolution as $t,
  commandRequiresSecurityAuditSuppressionApproval as A,
  resolveSafeBins as At,
  normalizeExecApprovalUnavailableDecisions as B,
  ShellChainOperator as Bt,
  ExecTarget as C,
  evaluateExecAllowlistWithAuthorization as Ct,
  SystemRunApprovalPlan as D,
  normalizeSafeBins as Dt,
  SystemRunApprovalFileOperand as E,
  isSafeBinUsage as Et,
  isExecApprovalDecisionAllowed as F,
  tokenizeWindowsSegment as Ft,
  normalizeExecSecurity as G,
  parseExecArgvToken as Gt,
  normalizeExecAsk as H,
  ExecArgvToken as Ht,
  loadExecApprovals as I,
  windowsEscapeArg as It,
  persistAllowAlwaysPatterns as J,
  resolveApprovalAuditTrustPath as Jt,
  normalizeExecTarget as K,
  resolveAllowlistCandidatePath as Kt,
  maxAsk as L,
  analyzeArgvCommand as Lt,
  hasDurableExecApproval as M,
  resolvePlannedSegmentArgv as Mt,
  hasExactCommandDurableExecApproval as N,
  analyzeWindowsShellCommand as Nt,
  addAllowlistEntry as O,
  resolveAllowAlwaysPatternEntries as Ot,
  hasNodeCommandAllowAlwaysMarker as P,
  isWindowsPlatform as Pt,
  requestExecApprovalViaSocket as Q,
  resolveExecutionTargetCandidatePath as Qt,
  mergeExecApprovalsSocketDefaults as R,
  ExecCommandAnalysis as Rt,
  ExecSecurity as S,
  evaluateExecAllowlist as St,
  SystemRunApprovalBinding as T,
  evaluateShellAllowlistWithAuthorization as Tt,
  normalizeExecHost as U,
  ExecutableResolution as Ut,
  normalizeExecApprovals as V,
  CommandResolution as Vt,
  normalizeExecMode as W,
  matchAllowlist as Wt,
  recordAllowlistMatchesUse as X,
  resolveCommandResolutionFromArgv as Xt,
  readExecApprovalsSnapshot as Y,
  resolveCommandResolution as Yt,
  recordAllowlistUse as Z,
  resolveExecutableTrustPath as Zt,
  ExecApprovalsResolved as _,
  AllowAlwaysPattern as _t,
  DEFAULT_EXEC_APPROVAL_TIMEOUT_MS as a,
  ExecAllowlistEntry as an,
  resolveExecApprovalUnavailableDecisions as at,
  ExecHost as b,
  ExecSegmentSatisfiedBy as bt,
  ExecApprovalDecision as c,
  resolveExecApprovalsFromFile as ct,
  ExecApprovalResolved as d,
  resolveExecApprovalsTranscriptPath as dt,
  resolveExecutionTargetTrustPath as en,
  requiresExecApproval as et,
  ExecApprovalUnavailableDecision as f,
  resolveExecModeFromPolicy as ft,
  ExecApprovalsFile as g,
  saveExecApprovals as gt,
  ExecApprovalsDefaults as h,
  restoreExecApprovalsSnapshot as ht,
  DEFAULT_EXEC_APPROVAL_DECISIONS as i,
  resolvePolicyTargetTrustPath as in,
  resolveExecApprovalRequestAllowedDecisions as it,
  ensureExecApprovals as j,
  buildEnforcedShellCommand as jt,
  addDurableCommandApproval as k,
  resolveAllowAlwaysPatterns as kt,
  ExecApprovalRequest as l,
  resolveExecApprovalsPath as lt,
  ExecApprovalsDefaultOverrides as m,
  resolveExecPolicyForMode as mt,
  AllowAlwaysPersistenceReason as n,
  resolvePolicyTargetCandidatePath as nn,
  resolveAllowAlwaysPersistenceDecision as nt,
  EXEC_TARGET_VALUES as o,
  CommandExplanationSummary as on,
  resolveExecApprovals as ot,
  ExecApprovalsAgent as p,
  resolveExecModePolicy as pt,
  persistAllowAlwaysDecision as q,
  resolveApprovalAuditCandidatePath as qt,
  DEFAULT_EXEC_APPROVAL_ASK_FALLBACK as r,
  resolvePolicyTargetResolution as rn,
  resolveExecApprovalAllowedDecisions as rt,
  ExecApprovalCommandSpan as s,
  resolveExecApprovalsDisplayPath as st,
  AllowAlwaysPersistenceDecision as t,
  resolvePolicyAllowlistCandidatePath as tn,
  resolveAllowAlwaysPatternCoverage as tt,
  ExecApprovalRequestPayload as u,
  resolveExecApprovalsSocketPath as ut,
  ExecApprovalsSnapshot as v,
  ExecAllowlistAnalysis as vt,
  OPTIONAL_EXEC_APPROVAL_DECISIONS as w,
  evaluateShellAllowlist as wt,
  ExecMode as x,
  SkillBinTrustEntry as xt,
  ExecAsk as y,
  ExecAllowlistEvaluation as yt,
  minSecurity as z,
  ExecCommandSegment as zt,
};
