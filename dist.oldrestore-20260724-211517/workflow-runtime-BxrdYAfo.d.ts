import { a as fetchWithSsrFGuard } from "./fetch-guard-BKvfwdRa.js";
import { o as SsrFPolicy } from "./ssrf-skjEI_i5.js";
import { s as AuthProfileStore } from "./types-Dzb4Vh4b.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/comfy/workflow-runtime.d.ts
declare const DEFAULT_COMFY_MODEL = "workflow";
type ComfyCapability = "image" | "music" | "video";
type ComfyOutputKind = "audio" | "gifs" | "images" | "videos";
type ComfyProviderConfig = Record<string, unknown>;
type ComfyFetchGuardParams = Parameters<typeof fetchWithSsrFGuard>[0];
type ComfyDispatcherPolicy = ComfyFetchGuardParams["dispatcherPolicy"];
type ComfySourceImage = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
};
type ComfyGeneratedAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName: string;
  nodeId: string;
};
type ComfyWorkflowResult = {
  assets: ComfyGeneratedAsset[];
  model: string;
  promptId: string;
  outputNodeIds: string[];
};
declare function setComfyFetchGuardForTesting(impl: typeof fetchWithSsrFGuard | null): void;
declare function getComfyConfig(cfg?: OpenClawConfig): ComfyProviderConfig;
declare function readJsonResponse<T>(params: {
  url: string;
  init?: RequestInit;
  timeoutMs?: number;
  policy?: SsrFPolicy;
  dispatcherPolicy?: ComfyDispatcherPolicy;
  auditContext: string;
  errorPrefix: string;
}): Promise<T>;
/** @internal Test-only export. */
declare const readJsonResponseForTest: typeof readJsonResponse;
declare function isComfyCapabilityConfigured(params: {
  cfg?: OpenClawConfig;
  agentDir?: string;
  capability: ComfyCapability;
}): boolean;
declare function runComfyWorkflow(params: {
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  prompt: string;
  model?: string;
  timeoutMs?: number;
  capability: ComfyCapability;
  outputKinds: readonly ComfyOutputKind[];
  inputImage?: ComfySourceImage;
}): Promise<ComfyWorkflowResult>;
//#endregion
export {
  runComfyWorkflow as a,
  readJsonResponseForTest as i,
  getComfyConfig as n,
  setComfyFetchGuardForTesting as o,
  isComfyCapabilityConfigured as r,
  DEFAULT_COMFY_MODEL as t,
};
