import { n as BindingTargetKind } from "./session-binding.types-BbT2v6Ty.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";
//#region extensions/feishu/src/thread-bindings.d.ts
type FeishuBindingTargetKind = "subagent" | "acp";
type FeishuThreadBindingRecord = {
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  deliveryTo?: string;
  deliveryThreadId?: string;
  targetKind: FeishuBindingTargetKind;
  targetSessionKey: string;
  agentId?: string;
  label?: string;
  boundBy?: string;
  boundAt: number;
  lastActivityAt: number;
};
type FeishuThreadBindingManager = {
  accountId: string;
  getByConversationId: (conversationId: string) => FeishuThreadBindingRecord | undefined;
  listBySessionKey: (targetSessionKey: string) => FeishuThreadBindingRecord[];
  bindConversation: (params: {
    conversationId: string;
    parentConversationId?: string;
    targetKind: BindingTargetKind;
    targetSessionKey: string;
    metadata?: Record<string, unknown>;
  }) => FeishuThreadBindingRecord | null;
  touchConversation: (conversationId: string, at?: number) => FeishuThreadBindingRecord | null;
  unbindConversation: (conversationId: string) => FeishuThreadBindingRecord | null;
  unbindBySessionKey: (targetSessionKey: string) => FeishuThreadBindingRecord[];
  stop: () => void;
};
declare function createFeishuThreadBindingManager(params: {
  accountId?: string;
  cfg: OpenClawConfig;
}): FeishuThreadBindingManager;
declare function getFeishuThreadBindingManager(
  accountId?: string,
): FeishuThreadBindingManager | null;
declare const testing: {
  resetFeishuThreadBindingsForTests(): void;
};
//#endregion
export { getFeishuThreadBindingManager as n, testing as r, createFeishuThreadBindingManager as t };
