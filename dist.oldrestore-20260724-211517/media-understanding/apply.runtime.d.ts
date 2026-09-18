import { t as ActiveMediaModel } from "../active-model-Cxn6sQSw.js";
import { i as MsgContext } from "../templating-h3OQefFR.js";
import {
  d as MediaUnderstandingOutput,
  f as MediaUnderstandingProvider,
  u as MediaUnderstandingDecision,
} from "../types-Bp5h7fLi.js";
import { l as ImageContent } from "../types-CqrbBnUB.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/media-understanding/extracted-file-images.d.ts
type ExtractedFileImage = ImageContent & {
  attachmentIndex: number;
};
//#endregion
//#region src/media-understanding/apply.d.ts
type ApplyMediaUnderstandingResult = {
  outputs: MediaUnderstandingOutput[];
  decisions: MediaUnderstandingDecision[];
  extractedFileImages: ExtractedFileImage[];
  appliedImage: boolean;
  appliedAudio: boolean;
  appliedVideo: boolean;
  appliedFile: boolean;
};
declare function applyMediaUnderstanding(params: {
  ctx: MsgContext;
  cfg: OpenClawConfig;
  agentId?: string;
  agentDir?: string;
  workspaceDir?: string;
  providers?: Record<string, MediaUnderstandingProvider>;
  activeModel?: ActiveMediaModel;
}): Promise<ApplyMediaUnderstandingResult>;
//#endregion
export { applyMediaUnderstanding };
