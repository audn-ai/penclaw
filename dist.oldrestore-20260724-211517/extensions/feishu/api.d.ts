import { t as feishuPlugin } from "../../channel-w1WFEfJ_.js";
import {
  a as parseFeishuDirectConversationId,
  i as parseFeishuConversationId,
  n as buildFeishuConversationId,
  o as parseFeishuTargetId,
  r as buildFeishuModelOverrideParentCandidates,
  t as FeishuGroupSessionScope,
} from "../../conversation-id-CBFuWL3u.js";
import { g as OpenClawPluginApi } from "../../plugin-entry-DPCR66aO.js";
import { t as createClackPrompter } from "../../setup-runtime-CsUzv6OP.js";
import {
  i as setFeishuNamedAccountEnabled,
  n as runFeishuLogin,
  r as feishuSetupAdapter,
  t as feishuSetupWizard,
} from "../../setup-surface-Bjuxsa3d.js";
import {
  n as getFeishuThreadBindingManager,
  r as testing,
  t as createFeishuThreadBindingManager,
} from "../../thread-bindings-BFLIELAf.js";
//#region extensions/feishu/src/docx.d.ts
declare function registerFeishuDocTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/chat.d.ts
declare function registerFeishuChatTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/wiki.d.ts
declare function registerFeishuWikiTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/drive.d.ts
declare function registerFeishuDriveTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/perm.d.ts
declare function registerFeishuPermTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/bitable.d.ts
declare function registerFeishuBitableTools(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/feishu/src/subagent-hooks.d.ts
type FeishuSubagentContext = {
  requesterSessionKey?: string;
};
type FeishuSubagentSpawningEvent = {
  threadRequested?: boolean;
  requester?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  childSessionKey: string;
  agentId?: string;
  label?: string;
};
type FeishuSubagentDeliveryTargetEvent = {
  expectsCompletionMessage?: boolean;
  requesterOrigin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  childSessionKey: string;
  requesterSessionKey?: string;
};
type FeishuSubagentEndedEvent = {
  accountId?: string;
  targetSessionKey: string;
};
type FeishuSubagentSpawningResult =
  | {
      status: "ok";
      threadBindingReady?: boolean;
      deliveryOrigin?: {
        channel: "feishu";
        accountId?: string;
        to?: string;
        threadId?: string | number;
      };
    }
  | {
      status: "error";
      error: string;
    }
  | undefined;
type FeishuSubagentDeliveryTargetResult =
  | {
      origin: {
        channel: "feishu";
        accountId?: string;
        to?: string;
        threadId?: string | number;
      };
    }
  | undefined;
declare function handleFeishuSubagentSpawning(
  event: FeishuSubagentSpawningEvent,
  ctx: FeishuSubagentContext,
): Promise<FeishuSubagentSpawningResult>;
declare function handleFeishuSubagentDeliveryTarget(
  event: FeishuSubagentDeliveryTargetEvent,
): FeishuSubagentDeliveryTargetResult;
declare function handleFeishuSubagentEnded(event: FeishuSubagentEndedEvent): void;
//#endregion
//#region extensions/feishu/api.d.ts
declare const feishuSessionBindingAdapterChannels: readonly ["feishu"];
//#endregion
export {
  type FeishuGroupSessionScope,
  testing as __testing,
  testing as feishuThreadBindingTesting,
  testing,
  buildFeishuConversationId,
  buildFeishuModelOverrideParentCandidates,
  createClackPrompter,
  createFeishuThreadBindingManager,
  feishuPlugin,
  feishuSessionBindingAdapterChannels,
  feishuSetupAdapter,
  feishuSetupWizard,
  getFeishuThreadBindingManager,
  handleFeishuSubagentDeliveryTarget,
  handleFeishuSubagentEnded,
  handleFeishuSubagentSpawning,
  parseFeishuConversationId,
  parseFeishuDirectConversationId,
  parseFeishuTargetId,
  registerFeishuBitableTools,
  registerFeishuChatTools,
  registerFeishuDocTools,
  registerFeishuDriveTools,
  registerFeishuPermTools,
  registerFeishuWikiTools,
  runFeishuLogin,
  setFeishuNamedAccountEnabled,
};
