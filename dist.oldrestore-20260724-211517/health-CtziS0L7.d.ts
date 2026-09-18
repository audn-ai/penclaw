import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
import { i as OpenClawConfig, n as ConfigValidationIssue } from "./types.openclaw-DDo8sH3F.js";
//#region src/flows/health-checks.d.ts
type HealthFindingSeverity = "info" | "warning" | "error";
/** Parses CLI/config severity input into the closed health-finding severity set. */
declare function parseHealthFindingSeverity(
  input: string | undefined,
): HealthFindingSeverity | null;
/** Returns whether a finding meets the configured reporting threshold. */
declare function healthFindingMeetsSeverity(
  finding: Pick<HealthFinding, "severity">,
  severityMin: HealthFindingSeverity,
): boolean;
/** Structured finding emitted by doctor health checks. */
interface HealthFinding {
  readonly checkId: string;
  readonly severity: HealthFindingSeverity;
  readonly message: string;
  readonly source?: string;
  readonly path?: string;
  readonly line?: number;
  readonly column?: number;
  readonly ocPath?: string;
  readonly target?: string;
  readonly requirement?: string;
  readonly fixHint?: string;
}
type HealthCheckMode = "doctor" | "lint" | "fix";
/** Immutable runtime/config context passed to health check detection. */
interface HealthCheckContext {
  readonly mode: HealthCheckMode;
  readonly runtime: RuntimeEnv;
  readonly cfg: OpenClawConfig;
  readonly cwd?: string;
  readonly configPath?: string;
  readonly allowExecSecretRefs?: boolean;
}
/** Repair-capable health-check context; fixes may emit diffs or dry-run previews. */
interface HealthRepairContext extends Omit<HealthCheckContext, "mode"> {
  readonly mode: "fix";
  readonly dryRun?: boolean;
  readonly diff?: boolean;
}
/** Optional before/after detail for config or file repair output. */
interface HealthRepairDiff {
  readonly kind: "config" | "file";
  readonly path: string;
  readonly before?: string;
  readonly after?: string;
  readonly unifiedDiff?: string;
}
/** Side effect descriptor for repairs that touch services, processes, packages, or state. */
interface HealthRepairEffect {
  readonly kind: "config" | "file" | "service" | "process" | "package" | "state" | "other";
  readonly action: string;
  readonly target?: string;
  readonly dryRunSafe?: boolean;
}
/** Repair result returned by split health-check repair functions. */
interface HealthRepairResult {
  readonly status?: "repaired" | "skipped" | "failed";
  readonly reason?: string;
  readonly config?: OpenClawConfig;
  readonly changes: readonly string[];
  readonly warnings?: readonly string[];
  readonly diffs?: readonly HealthRepairDiff[];
  readonly effects?: readonly HealthRepairEffect[];
}
/** Narrow validation scope built from previous findings after a repair runs. */
interface HealthCheckScope {
  readonly findings?: readonly HealthFinding[];
  readonly paths?: readonly string[];
  readonly ocPaths?: readonly string[];
}
/** Split detect/repair health-check contract registered by core or plugins. */
interface HealthCheck {
  readonly id: string;
  readonly kind: "core" | "plugin";
  readonly description: string;
  readonly source?: string;
  detect(ctx: HealthCheckContext, scope?: HealthCheckScope): Promise<readonly HealthFinding[]>;
  repair?(
    ctx: HealthRepairContext,
    findings: readonly HealthFinding[],
  ): Promise<HealthRepairResult>;
}
//#endregion
//#region src/flows/doctor-core-checks.d.ts
declare function configValidationIssuesToHealthFindings(
  issues: readonly ConfigValidationIssue[],
): readonly HealthFinding[];
/** @deprecated Core doctor flows use ordered doctor contributions; keep this only for SDK compatibility. */
declare function registerCoreHealthChecks(): void;
//#endregion
//#region src/flows/doctor-lint-flow.d.ts
interface DoctorLintRunOptions {
  readonly checks?: readonly HealthCheck[];
  readonly skipIds?: ReadonlySet<string> | readonly string[];
  readonly onlyIds?: ReadonlySet<string> | readonly string[];
  readonly includeAllChecks?: boolean;
}
interface DoctorLintRunResult {
  readonly findings: readonly HealthFinding[];
  readonly checksRun: number;
  readonly checksSkipped: number;
}
/** Runs selected health checks in lint mode and returns sorted findings. */
declare function runDoctorLintChecks(
  ctx: HealthCheckContext,
  opts?: DoctorLintRunOptions,
): Promise<DoctorLintRunResult>;
/** Converts findings to a process exit code using the requested minimum severity. */
declare function exitCodeFromFindings(
  findings: readonly HealthFinding[],
  severityMin?: HealthFindingSeverity,
): 0 | 1;
//#endregion
//#region src/flows/health-check-registry.d.ts
/** Registers one health check for doctor lint/fix execution. */
declare function registerHealthCheck(check: HealthCheck): void;
/** Returns registered checks in insertion order for deterministic doctor output. */
declare function listHealthChecks(): readonly HealthCheck[];
/** Looks up a registered health check by its stable id. */
declare function getHealthCheck(id: string): HealthCheck | undefined;
//#endregion
export {
  HealthRepairResult as _,
  exitCodeFromFindings as a,
  registerCoreHealthChecks as c,
  HealthCheckScope as d,
  HealthFinding as f,
  HealthRepairEffect as g,
  HealthRepairDiff as h,
  DoctorLintRunOptions as i,
  HealthCheck as l,
  HealthRepairContext as m,
  listHealthChecks as n,
  runDoctorLintChecks as o,
  HealthFindingSeverity as p,
  registerHealthCheck as r,
  configValidationIssuesToHealthFindings as s,
  getHealthCheck as t,
  HealthCheckContext as u,
  healthFindingMeetsSeverity as v,
  parseHealthFindingSeverity as y,
};
