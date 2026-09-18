import { t as SourceInfo } from "./source-info-xH8Q5yuU.js";

//#region src/skills/loading/skill-contract.d.ts
interface Skill {
  name: string;
  description: string;
  /** Additional loading guidance rendered with the location in full and compact catalogs. */
  locationNote?: string;
  /** Runtime-only content for non-filesystem skill locators such as node://. */
  readContent?: string;
  filePath: string;
  baseDir: string;
  /** Deterministic marker for the SKILL.md content rendered as <version>. */
  promptVersion?: string;
  sourceInfo: SourceInfo;
  disableModelInvocation: boolean;
  source: string;
}
//#endregion
export { Skill as t };
