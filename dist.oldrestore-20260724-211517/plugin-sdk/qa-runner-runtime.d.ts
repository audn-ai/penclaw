import { Command } from "commander";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/plugin-sdk/qa-channel-protocol.d.ts
/** Conversation shape supported by the synthetic QA channel bus. */
type QaBusConversationKind = "direct" | "channel" | "group";
/** Addressable conversation used by QA bus messages and thread state. */
type QaBusConversation = {
  id: string;
  kind: QaBusConversationKind;
  title?: string;
};
/** Media/file attachment fixture accepted by QA bus message APIs. */
type QaBusAttachment = {
  id: string;
  kind: "image" | "video" | "audio" | "file";
  mimeType: string;
  fileName?: string;
  inline?: boolean;
  url?: string;
  contentBase64?: string;
  width?: number;
  height?: number;
  durationMs?: number;
  altText?: string;
  transcript?: string;
};
/** Tool-call fixture attached to QA messages for agent-runtime tests. */
type QaBusToolCall = {
  name: string;
  arguments?: Record<string, unknown>;
};
/** Channel-native command metadata attached to a synthetic inbound message. */
type QaBusNativeCommand = {
  name: string;
};
/** Stored QA bus message after defaults, reactions, and account ids are normalized. */
type QaBusMessage = {
  id: string;
  accountId: string;
  direction: "inbound" | "outbound";
  conversation: QaBusConversation;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: number;
  threadId?: string;
  threadTitle?: string;
  replyToId?: string;
  deleted?: boolean;
  editedAt?: number;
  attachments?: QaBusAttachment[];
  nativeCommand?: QaBusNativeCommand;
  toolCalls?: QaBusToolCall[];
  reactions: Array<{
    emoji: string;
    senderId: string;
    timestamp: number;
  }>;
};
/** Input for injecting an inbound message from a synthetic user/channel. */
type QaBusInboundMessageInput = {
  accountId?: string;
  conversation: QaBusConversation;
  senderId: string;
  senderName?: string;
  text: string;
  timestamp?: number;
  threadId?: string;
  threadTitle?: string;
  replyToId?: string;
  attachments?: QaBusAttachment[];
  nativeCommand?: QaBusNativeCommand;
  toolCalls?: QaBusToolCall[];
};
/** Input for recording an outbound message sent by an OpenClaw runtime. */
type QaBusOutboundMessageInput = {
  accountId?: string;
  to: string;
  senderId?: string;
  senderName?: string;
  text: string;
  timestamp?: number;
  threadId?: string;
  replyToId?: string;
  attachments?: QaBusAttachment[];
  toolCalls?: QaBusToolCall[];
};
/** Input for editing an existing QA bus message. */
type QaBusEditMessageInput = {
  accountId?: string;
  messageId: string;
  text: string;
  timestamp?: number;
};
//#endregion
//#region src/plugin-sdk/qa-runner-runtime.d.ts
type QaRunnerTransportPolicy = {
  requireGroupMention?: true;
  senderAllowlist?: readonly string[];
  topLevelReplies?: true;
};
type QaRunnerAdapterOptions = {
  repoRoot?: string;
  sutAccountId?: string;
  credentialSource?: string;
  credentialRole?: string;
  transportPolicy?: QaRunnerTransportPolicy;
};
type QaRunnerMessageRecorder = {
  addInboundMessage: (input: QaBusInboundMessageInput) => QaBusMessage | Promise<QaBusMessage>;
  addOutboundMessage: (input: QaBusOutboundMessageInput) => QaBusMessage | Promise<QaBusMessage>;
  editMessage: (input: QaBusEditMessageInput) => QaBusMessage | Promise<QaBusMessage>;
};
type QaRunnerTransportAdapterDefinition = {
  id: string;
  label: string;
  accountId: string;
  requiredPluginIds: readonly string[];
  supportedActions: readonly ("delete" | "edit" | "react" | "thread-create")[];
  assertTransportHealthy?: () => void;
  resetTransport?: () => void | Promise<void>;
  sendInbound: (input: QaBusInboundMessageInput) => Promise<QaBusMessage>;
  sendNativeCommand?: (
    input: Omit<QaBusInboundMessageInput, "nativeCommand" | "text"> & {
      command: string;
    },
  ) => Promise<void>;
  waitForOutboundSequence?: (input: {
    conversationId?: string;
    finalSettleMs?: number;
    finalTextIncludes: string;
    minimumPreviewEvents?: number;
    sinceCursor?: number;
    threadId?: string;
    timeoutMs?: number;
  }) => Promise<{
    events: Array<{
      cursor: number;
      kind: "sent" | "edited" | "deleted";
      message: QaBusMessage;
    }>;
    final: QaBusMessage;
  }>;
  createGatewayConfig: (params: {
    baseUrl: string;
  }) => Pick<OpenClawConfig, "channels" | "messages">;
  waitReady: (params: {
    gateway: {
      call: (
        method: string,
        params?: unknown,
        options?: {
          timeoutMs?: number;
        },
      ) => Promise<unknown>;
    };
    timeoutMs?: number;
    pollIntervalMs?: number;
  }) => Promise<void>;
  buildAgentDelivery: (params: { target: string }) => {
    channel: string;
    to?: string;
    replyChannel: string;
    replyTo: string;
  };
  createRuntimeEnvPatch?: () => NodeJS.ProcessEnv;
  handleAction: (params: {
    action: "delete" | "edit" | "react" | "thread-create";
    args: Record<string, unknown>;
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => Promise<unknown>;
  createReportNotes: (params: {
    providerMode: "mock-openai" | "aimock" | "live-frontier";
    primaryModel: string;
    alternateModel: string;
    fastMode: boolean;
    concurrency: number;
    isolatedWorkers?: boolean;
  }) => string[];
  cleanup?: () => Promise<void>;
};
type QaRunnerTransportFactory = {
  id: string;
  scenarioIds?: readonly string[];
  matches: (context: { channelId: string; driver: string }) => boolean;
  create: (context: {
    adapterOptions?: QaRunnerAdapterOptions;
    channelId: string;
    driver: string;
    messages: QaRunnerMessageRecorder;
    outputDir: string;
  }) => Promise<QaRunnerTransportAdapterDefinition>;
};
/** CLI registration and optional transport adapter factory exported by a QA runner plugin. */
type QaRunnerCliRegistration = {
  commandName: string;
  adapterFactory?: QaRunnerTransportFactory;
  register(qa: Command): void;
};
type QaRuntimeSurface = {
  defaultQaRuntimeModelForMode: (
    mode: string,
    options?: {
      alternate?: boolean;
      preferredLiveModel?: string;
    },
  ) => string;
  startQaLiveLaneGateway: (...args: unknown[]) => Promise<unknown>;
};
/** Resolved QA runner CLI contribution declared by plugin manifest metadata. */
type QaRunnerCliContribution =
  | {
      pluginId: string;
      commandName: string;
      description?: string;
      status: "available";
      registration: QaRunnerCliRegistration;
    }
  | {
      pluginId: string;
      commandName: string;
      description?: string;
      status: "blocked";
    };
/** Load the private QA Lab runtime facade used by QA runner commands. */
declare function loadQaRuntimeModule(): QaRuntimeSurface;
/** Load a bundled QA runner plugin test API facade by plugin id. */
declare function loadQaRunnerBundledPluginTestApi<T extends object>(pluginId: string): T;
/** Returns whether the private QA Lab runtime facade is available in this build. */
declare function isQaRuntimeAvailable(): boolean;
/** List QA runner CLI contributions declared by manifests and backed by runtime registrations. */
declare function listQaRunnerCliContributions(): readonly QaRunnerCliContribution[];
//#endregion
export {
  QaRunnerCliContribution,
  QaRunnerCliRegistration,
  isQaRuntimeAvailable,
  listQaRunnerCliContributions,
  loadQaRunnerBundledPluginTestApi,
  loadQaRuntimeModule,
};
