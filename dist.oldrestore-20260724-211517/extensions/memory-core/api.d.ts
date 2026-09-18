import {
  ct as resolveMemoryDeepDreamingConfig,
  mt as resolveMemoryRemDreamingConfig,
} from "../../dreaming-CXsB3hVv.js";
import {
  n as PromotionCandidate,
  s as ShortTermRecallEntry,
  t as configureMemoryCoreDreamingState,
} from "../../dreaming-state-DXvELzZ0.js";
import { t as MemoryEmbeddingProbeResult } from "../../memory-core-host-engine-storage-DWA5F9Hz.js";
import {
  I as MemorySyncProgressUpdate,
  k as MemoryProviderStatus,
} from "../../memory-state-wPutFXhr.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";

//#region extensions/memory-core/src/dreaming-narrative.d.ts
declare function writeBackfillDiaryEntries(params: {
  workspaceDir: string;
  entries: Array<{
    isoDay: string;
    bodyLines: string[];
    sourcePath?: string;
  }>;
  timezone?: string;
}): Promise<{
  dreamsPath: string;
  written: number;
  replaced: number;
}>;
declare function removeBackfillDiaryEntries(params: { workspaceDir: string }): Promise<{
  dreamsPath: string;
  removed: number;
}>;
declare function dedupeDreamDiaryEntries(params: { workspaceDir: string }): Promise<{
  dreamsPath: string;
  removed: number;
  kept: number;
}>;
//#endregion
//#region extensions/memory-core/src/rem-evidence.d.ts
type GroundedRemPreviewItem = {
  text: string;
  refs: string[];
};
type GroundedRemCandidate = GroundedRemPreviewItem & {
  lean: "likely_durable" | "unclear" | "likely_situational";
};
type GroundedRemFilePreview = {
  path: string;
  facts: GroundedRemPreviewItem[];
  reflections: GroundedRemPreviewItem[];
  memoryImplications: GroundedRemPreviewItem[];
  candidates: GroundedRemCandidate[];
  renderedMarkdown: string;
};
type GroundedRemPreviewResult = {
  workspaceDir: string;
  scannedFiles: number;
  files: GroundedRemFilePreview[];
};
declare function previewGroundedRemMarkdown(params: {
  workspaceDir: string;
  inputPaths: string[];
}): Promise<GroundedRemPreviewResult>;
//#endregion
//#region extensions/memory-core/src/dreaming-phases.d.ts
declare function filterRecallEntriesWithinLookback(params: {
  entries: readonly ShortTermRecallEntry[];
  nowMs: number;
  lookbackDays: number;
}): ShortTermRecallEntry[];
type RemTruthSelection = {
  key: string;
  snippet: string;
  confidence: number;
  evidence: string;
};
type RemTruthCandidate = Omit<RemTruthSelection, "key">;
type RemDreamingPreview = {
  sourceEntryCount: number;
  reflections: string[];
  candidateTruths: RemTruthCandidate[];
  candidateKeys: string[];
  bodyLines: string[];
};
//#endregion
//#region extensions/memory-core/src/rem-harness.d.ts
type MemoryRemHarnessRemConfig = ReturnType<typeof resolveMemoryRemDreamingConfig>;
type MemoryRemHarnessDeepConfig = ReturnType<typeof resolveMemoryDeepDreamingConfig>;
type PreviewRemHarnessOptions = {
  workspaceDir: string;
  cfg?: OpenClawConfig;
  pluginConfig?: Record<string, unknown>;
  grounded?: boolean;
  groundedInputPaths?: string[];
  groundedFileLimit?: number;
  includePromoted?: boolean;
  candidateLimit?: number;
  remPreviewLimit?: number;
  nowMs?: number;
};
type PreviewRemHarnessResult = {
  workspaceDir: string;
  nowMs: number;
  remConfig: MemoryRemHarnessRemConfig;
  deepConfig: MemoryRemHarnessDeepConfig;
  recallEntryCount: number;
  remSkipped: boolean;
  rem: RemDreamingPreview;
  groundedInputPaths: string[];
  grounded: GroundedRemPreviewResult | null;
  deep: {
    candidateLimit?: number;
    candidateCount: number;
    truncated: boolean;
    candidates: PromotionCandidate[];
  };
};
declare function previewRemHarness(
  params: PreviewRemHarnessOptions,
): Promise<PreviewRemHarnessResult>;
//#endregion
//#region extensions/memory-core/src/dreaming-shadow-trial.d.ts
type DreamingShadowTrialVerdict = "helpful" | "neutral" | "harmful";
type DreamingShadowTrialRecommendation = "promote" | "defer" | "reject";
type DreamingShadowTrialInput = {
  candidate: string;
  trialPrompt: string;
  baselineOutcome: string;
  candidateOutcome: string;
  verdict: DreamingShadowTrialVerdict;
  reason: string;
  riskFlags?: string[];
  evidenceRefs?: string[];
  workspaceDir?: string;
  reportPath?: string;
  nowMs?: number;
  timezone?: string;
};
type DreamingShadowTrialReport = {
  candidate: string;
  trialPrompt: string;
  baselineOutcome: string;
  candidateOutcome: string;
  verdict: DreamingShadowTrialVerdict;
  recommendation: DreamingShadowTrialRecommendation;
  reason: string;
  riskFlags: string[];
  evidenceRefs: string[];
  promotionAction: "report-only";
  reportPath?: string;
  markdown: string;
};
declare function resolveDreamingShadowTrialRecommendation(
  verdict: DreamingShadowTrialVerdict,
): DreamingShadowTrialRecommendation;
declare function defaultDreamingShadowTrialReportPath(params: {
  workspaceDir: string;
  candidate: string;
  trialPrompt: string;
  baselineOutcome: string;
  candidateOutcome: string;
  verdict: DreamingShadowTrialVerdict;
  reason: string;
  riskFlags?: string[];
  evidenceRefs?: string[];
  nowMs?: number;
  timezone?: string;
}): string;
declare function buildDreamingShadowTrialReport(
  input: DreamingShadowTrialInput,
): DreamingShadowTrialReport;
declare function writeDreamingShadowTrialReport(
  input: DreamingShadowTrialInput & {
    workspaceDir: string;
  },
): Promise<DreamingShadowTrialReport>;
//#endregion
export {
  type DreamingShadowTrialInput,
  type DreamingShadowTrialRecommendation,
  type DreamingShadowTrialReport,
  type DreamingShadowTrialVerdict,
  type MemoryEmbeddingProbeResult,
  type MemoryProviderStatus,
  type MemorySyncProgressUpdate,
  type OpenClawConfig,
  type PreviewRemHarnessOptions,
  type PreviewRemHarnessResult,
  buildDreamingShadowTrialReport,
  configureMemoryCoreDreamingState,
  dedupeDreamDiaryEntries,
  defaultDreamingShadowTrialReportPath,
  filterRecallEntriesWithinLookback,
  previewGroundedRemMarkdown,
  previewRemHarness,
  removeBackfillDiaryEntries,
  resolveDreamingShadowTrialRecommendation,
  writeBackfillDiaryEntries,
  writeDreamingShadowTrialReport,
};
