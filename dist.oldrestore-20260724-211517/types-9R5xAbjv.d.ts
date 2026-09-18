import { t as Skill } from "./skill-contract-Cj6jU-ff.js";

//#region src/skills/types.d.ts
type SkillCommandDispatchSpec = {
  kind: "tool" /** Name of the tool to invoke (AnyAgentTool.name). */;
  toolName: string;
  /**
   * How to forward user-provided args to the tool.
   * - raw: forward the raw args string (no core parsing).
   */
  argMode?: "raw";
};
type SkillTelemetrySource = "bundled" | "unknown" | "workspace";
type SkillUsagePath = {
  /** Path visible to the tool runtime when it reads SKILL.md. */ readPath: string /** Canonical source SKILL.md path used as the lifecycle identity. */;
  skillFile: string;
  skillName: string;
  skillSource: SkillTelemetrySource;
};
type SkillCommandSpec = {
  name: string /** Canonical SKILL.md path for file-scoped usage accounting. */;
  skillFile?: string;
  skillName: string;
  description: string /** Bounded source label used for diagnostics. */;
  skillSource?: SkillTelemetrySource /** Localized descriptions for native command surfaces that support them. */;
  descriptionLocalizations?: Record<
    string,
    string
  > /** Optional deterministic dispatch behavior for this command. */;
  dispatch?: SkillCommandDispatchSpec /** Native prompt template used by Claude-bundle command markdown files. */;
  promptTemplate?: string /** Source markdown path for bundle-backed commands. */;
  sourceFilePath?: string;
};
type SkillEligibilityContext = {
  nodeSkills?: {
    canExec: boolean;
    node?: string;
  };
  remote?: {
    platforms: string[];
    hasBin: (bin: string) => boolean;
    hasAnyBin: (bins: string[]) => boolean;
    note?: string;
  };
};
type SkillSnapshot = {
  prompt: string;
  skills: Array<{
    name: string;
    primaryEnv?: string;
    requiredEnv?: string[];
  }> /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */;
  skillFilter?: string[] /** Effective node-exec eligibility used to select connected node-hosted skills. */;
  nodeSkillsEligibility?: SkillEligibilityContext["nodeSkills"];
  resolvedSkills?: Skill[];
  version?: number;
  promptFormatVersion?: number;
};
//#endregion
export {
  SkillUsagePath as a,
  SkillTelemetrySource as i,
  SkillEligibilityContext as n,
  SkillSnapshot as r,
  SkillCommandSpec as t,
};
