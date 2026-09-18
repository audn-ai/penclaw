import { s as AuthProfileStore } from "./types-Dzb4Vh4b.js";
import { f as ModelProviderConfig } from "./types.models-BqJSiNyu.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/media-understanding/types.d.ts
type MediaUnderstandingKind = "audio.transcription" | "video.description" | "image.description";
type MediaUnderstandingCapability = "image" | "audio" | "video";
type MediaAttachment = {
  path?: string;
  url?: string;
  mime?: string;
  index: number;
  alreadyTranscribed?: boolean;
};
type MediaUnderstandingOutput = {
  kind: MediaUnderstandingKind;
  attachmentIndex: number;
  text: string;
  provider: string;
  model?: string;
  requestedBackend?: string;
  observedBackend?: string;
};
type MediaUnderstandingDecisionOutcome =
  | "success"
  | "failed"
  | "skipped"
  | "disabled"
  | "no-attachment"
  | "scope-deny";
type MediaUnderstandingModelDecision = {
  provider?: string;
  model?: string;
  requestedBackend?: string;
  observedBackend?: string;
  type: "provider" | "cli";
  outcome: "success" | "skipped" | "failed";
  reason?: string;
};
type MediaUnderstandingAttachmentDecision = {
  attachmentIndex: number;
  attempts: MediaUnderstandingModelDecision[];
  chosen?: MediaUnderstandingModelDecision;
};
type MediaUnderstandingDecision = {
  capability: MediaUnderstandingCapability;
  outcome: MediaUnderstandingDecisionOutcome;
  attachments: MediaUnderstandingAttachmentDecision[];
};
type MediaUnderstandingProviderRequestAuthOverride =
  | {
      mode: "provider-default";
    }
  | {
      mode: "authorization-bearer";
      token: string;
    }
  | {
      mode: "header";
      headerName: string;
      value: string;
      prefix?: string;
    };
type MediaUnderstandingProviderRequestTlsOverride = {
  ca?: string;
  cert?: string;
  key?: string;
  passphrase?: string;
  serverName?: string;
  insecureSkipVerify?: boolean;
};
type MediaUnderstandingProviderRequestProxyOverride =
  | {
      mode: "env-proxy";
      tls?: MediaUnderstandingProviderRequestTlsOverride;
    }
  | {
      mode: "explicit-proxy";
      url: string;
      tls?: MediaUnderstandingProviderRequestTlsOverride;
    };
type MediaUnderstandingProviderRequestTransportOverrides = {
  headers?: Record<string, string>;
  auth?: MediaUnderstandingProviderRequestAuthOverride;
  proxy?: MediaUnderstandingProviderRequestProxyOverride;
  tls?: MediaUnderstandingProviderRequestTlsOverride /** Runtime-only flag from trusted model-provider config; media config rejects it. */;
  allowPrivateNetwork?: boolean;
};
type MediaUnderstandingProviderRequestAuth =
  | {
      kind: "api-key";
      apiKey: string;
      source?: string;
    }
  | {
      kind: "none";
      source: string;
    };
type AudioTranscriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string /** Compatibility field for existing providers; prefer auth.kind/apiKey. */;
  apiKey: string;
  auth?: MediaUnderstandingProviderRequestAuth;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: MediaUnderstandingProviderRequestTransportOverrides;
  model?: string;
  language?: string;
  prompt?: string;
  query?: Record<string, string | number | boolean>;
  timeoutMs: number;
  fetchFn?: typeof fetch;
};
type AudioTranscriptionResult = {
  text: string;
  model?: string;
};
type VideoDescriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string /** Compatibility field for existing providers; prefer auth.kind/apiKey. */;
  apiKey: string;
  auth?: MediaUnderstandingProviderRequestAuth;
  baseUrl?: string;
  headers?: Record<string, string>;
  request?: MediaUnderstandingProviderRequestTransportOverrides;
  model?: string;
  prompt?: string;
  timeoutMs: number;
  fetchFn?: typeof fetch;
};
type VideoDescriptionResult = {
  text: string;
  model?: string;
};
type ImageDescriptionRequest = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
  prompt?: string;
  maxTokens?: number;
  timeoutMs: number;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentDir: string;
  workspaceDir?: string;
  cfg: OpenClawConfig;
  model: string;
  provider: string;
};
type ImagesDescriptionInput = {
  buffer: Buffer;
  fileName: string;
  mime?: string;
};
type ImagesDescriptionRequest = {
  images: ImagesDescriptionInput[];
  model: string;
  provider: string;
  prompt?: string;
  maxTokens?: number;
  timeoutMs: number;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentDir: string;
  workspaceDir?: string;
  cfg: OpenClawConfig;
};
type ImageDescriptionResult = {
  text: string;
  model?: string;
};
type ImagesDescriptionResult = {
  text: string;
  model?: string;
};
type StructuredExtractionTextInput = {
  type: "text";
  text: string;
};
type StructuredExtractionImageInput = {
  type: "image";
  buffer: Buffer;
  fileName: string;
  mime?: string;
};
type StructuredExtractionInput = StructuredExtractionTextInput | StructuredExtractionImageInput;
type StructuredExtractionRequest = {
  /** Image-first extraction input; callers must include at least one image. */ input: StructuredExtractionInput[];
  instructions: string;
  schemaName?: string;
  jsonSchema?: unknown;
  jsonMode?: boolean;
  timeoutMs: number;
  profile?: string;
  preferredProfile?: string;
  authStore?: AuthProfileStore;
  agentDir: string;
  cfg: OpenClawConfig;
  model: string;
  provider: string;
};
type StructuredExtractionResult = {
  text: string;
  parsed?: unknown;
  model?: string;
  provider?: string;
  contentType?: "json" | "text";
};
type MediaUnderstandingDocumentModelDefaults = {
  textExtraction?: string;
  image?: string | false;
};
type MediaUnderstandingProviderAuthContext = {
  config?: OpenClawConfig;
  provider: string;
  providerConfig?: ModelProviderConfig;
};
type MediaUnderstandingProviderAuthResult =
  | {
      kind: "none";
      source: string;
    }
  | {
      kind: "api-key";
      apiKey: string;
      source: string;
      mode?: "api-key";
    };
type MediaUnderstandingProviderSyntheticAuthResult = {
  apiKey: string;
  source: string;
  mode: "api-key";
};
type MediaUnderstandingProvider = {
  id: string;
  capabilities?: MediaUnderstandingCapability[];
  defaultModels?: Partial<Record<MediaUnderstandingCapability, string>>;
  autoPriority?: Partial<Record<MediaUnderstandingCapability, number>>;
  nativeDocumentInputs?: Array<"pdf">;
  documentModels?: Partial<Record<"pdf", MediaUnderstandingDocumentModelDefaults>>;
  resolveAuth?: (
    ctx: MediaUnderstandingProviderAuthContext,
  ) => MediaUnderstandingProviderAuthResult | null | undefined /** @deprecated Use resolveAuth. */;
  resolveSyntheticAuth?: (
    ctx: MediaUnderstandingProviderAuthContext,
  ) => MediaUnderstandingProviderSyntheticAuthResult | null | undefined;
  transcribeAudio?: (req: AudioTranscriptionRequest) => Promise<AudioTranscriptionResult>;
  describeVideo?: (req: VideoDescriptionRequest) => Promise<VideoDescriptionResult>;
  describeImage?: (req: ImageDescriptionRequest) => Promise<ImageDescriptionResult>;
  describeImages?: (req: ImagesDescriptionRequest) => Promise<ImagesDescriptionResult>;
  extractStructured?: (req: StructuredExtractionRequest) => Promise<StructuredExtractionResult>;
};
//#endregion
export {
  VideoDescriptionResult as C,
  VideoDescriptionRequest as S,
  StructuredExtractionImageInput as _,
  ImagesDescriptionInput as a,
  StructuredExtractionResult as b,
  MediaAttachment as c,
  MediaUnderstandingOutput as d,
  MediaUnderstandingProvider as f,
  MediaUnderstandingProviderSyntheticAuthResult as g,
  MediaUnderstandingProviderRequestAuth as h,
  ImageDescriptionResult as i,
  MediaUnderstandingCapability as l,
  MediaUnderstandingProviderAuthResult as m,
  AudioTranscriptionResult as n,
  ImagesDescriptionRequest as o,
  MediaUnderstandingProviderAuthContext as p,
  ImageDescriptionRequest as r,
  ImagesDescriptionResult as s,
  AudioTranscriptionRequest as t,
  MediaUnderstandingDecision as u,
  StructuredExtractionInput as v,
  StructuredExtractionTextInput as x,
  StructuredExtractionRequest as y,
};
