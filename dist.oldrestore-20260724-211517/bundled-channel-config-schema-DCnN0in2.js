import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import { n as ZodIssueCode } from "./compat-Ci0Yc9vr.js";
import {
  An as preprocess,
  At as boolean,
  Et as array,
  Nn as record,
  Rn as string,
  Tn as object,
  Xn as union,
  Zn as unknown,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { l as ToolPolicySchema } from "./zod-schema.agent-runtime-D8C103DW.js";
import {
  i as ChannelHeartbeatVisibilitySchema,
  r as ChannelHealthMonitorSchema,
  t as ChannelBotLoopProtectionSchema,
} from "./zod-schema.channels-config-TJLOUrM6.js";
import {
  H as requireAllowlistAllowFrom,
  O as SecretRefSchema,
  U as requireOpenAllowFrom,
  _ as MarkdownConfigSchema,
  c as DmPolicySchema,
  d as GroupPolicySchema,
  o as ContextVisibilityModeSchema,
  r as ChannelDeliveryStreamingConfigSchema,
  s as DmConfigSchema,
  v as MentionPatternsPolicySchema,
  w as ReplyToModeSchema,
} from "./zod-schema.core-CWTCY1ZZ.js";
import { t as sensitive } from "./zod-schema.sensitive-WMWbzq4S.js";
import "./channel-config-schema-C-vJvjtu.js";
import "./zod-schema.providers-core-BNKhRce5.js";
//#region src/config/zod-schema.providers-googlechat.ts
/** DM policy schema for Google Chat accounts. */
const GoogleChatDmSchema = object({
  enabled: boolean().optional(),
  policy: DmPolicySchema.optional().default("pairing"),
  allowFrom: array(union([string(), number()])).optional(),
})
  .strict()
  .superRefine((value, ctx) => {
    requireOpenAllowFrom({
      policy: value.policy,
      allowFrom: value.allowFrom,
      ctx,
      path: ["allowFrom"],
      message:
        'channels.googlechat.dm.policy="open" requires channels.googlechat.dm.allowFrom to include "*"',
    });
    requireAllowlistAllowFrom({
      policy: value.policy,
      allowFrom: value.allowFrom,
      ctx,
      path: ["allowFrom"],
      message:
        'channels.googlechat.dm.policy="allowlist" requires channels.googlechat.dm.allowFrom to contain at least one sender ID',
    });
  });
const GoogleChatGroupSchema = object({
  enabled: boolean().optional(),
  requireMention: boolean().optional(),
  botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
  users: array(union([string(), number()])).optional(),
  systemPrompt: string().optional(),
}).strict();
const GoogleChatAccountSchema = object({
  name: string().optional(),
  capabilities: array(string()).optional(),
  enabled: boolean().optional(),
  configWrites: boolean().optional(),
  allowBots: boolean().optional(),
  botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
  dangerouslyAllowNameMatching: boolean().optional(),
  requireMention: boolean().optional(),
  groupPolicy: GroupPolicySchema.optional().default("allowlist"),
  groupAllowFrom: array(union([string(), number()])).optional(),
  groups: record(string(), GoogleChatGroupSchema.optional()).optional(),
  defaultTo: string().optional(),
  serviceAccount: union([string(), record(string(), unknown()), SecretRefSchema])
    .optional()
    .register(sensitive),
  serviceAccountRef: SecretRefSchema.optional().register(sensitive),
  serviceAccountFile: string().optional(),
  audienceType: _enum(["app-url", "project-number"]).optional(),
  audience: string().optional(),
  appPrincipal: string().optional(),
  webhookPath: string().optional(),
  webhookUrl: string().optional(),
  botUser: string().optional(),
  historyLimit: number().int().min(0).optional(),
  dmHistoryLimit: number().int().min(0).optional(),
  dms: record(string(), DmConfigSchema.optional()).optional(),
  textChunkLimit: number().int().positive().optional(),
  streaming: ChannelDeliveryStreamingConfigSchema.optional(),
  mediaMaxMb: number().positive().optional(),
  replyToMode: ReplyToModeSchema.optional(),
  actions: object({ reactions: boolean().optional() }).strict().optional(),
  dm: GoogleChatDmSchema.optional(),
  healthMonitor: ChannelHealthMonitorSchema,
  typingIndicator: _enum(["none", "message", "reaction"]).optional(),
  responsePrefix: string().optional(),
}).strict();
const GoogleChatConfigSchema = GoogleChatAccountSchema.extend({
  accounts: record(string(), GoogleChatAccountSchema.optional()).optional(),
  defaultAccount: string().optional(),
});
//#endregion
//#region src/config/zod-schema.providers-whatsapp.ts
const ToolPolicyBySenderSchema = record(string(), ToolPolicySchema).optional();
const WhatsAppGroupEntrySchema = object({
  requireMention: boolean().optional(),
  tools: ToolPolicySchema,
  toolsBySender: ToolPolicyBySenderSchema,
  systemPrompt: string().optional(),
})
  .strict()
  .optional();
const WhatsAppGroupsSchema = record(string(), WhatsAppGroupEntrySchema).optional();
const WhatsAppDirectEntrySchema = object({ systemPrompt: string().optional() }).strict().optional();
const WhatsAppDirectSchema = record(string(), WhatsAppDirectEntrySchema).optional();
const WhatsAppAckReactionSchema = object({
  emoji: string().optional(),
  direct: boolean().optional().default(true),
  group: _enum(["always", "mentions", "never"]).optional().default("mentions"),
})
  .strict()
  .optional();
const WhatsAppPluginHooksSchema = object({ messageReceived: boolean().optional() })
  .strict()
  .optional();
function stripDeprecatedWhatsAppNoopKeys(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  if (!Object.hasOwn(value, "exposeErrorText")) return value;
  const next = { ...value };
  delete next.exposeErrorText;
  return next;
}
function buildWhatsAppCommonShape(params) {
  return {
    enabled: boolean().optional(),
    capabilities: array(string()).optional(),
    markdown: MarkdownConfigSchema,
    configWrites: boolean().optional(),
    sendReadReceipts: boolean().optional(),
    messagePrefix: string().optional(),
    responsePrefix: string().optional(),
    dmPolicy: params.useDefaults
      ? DmPolicySchema.optional().default("pairing")
      : DmPolicySchema.optional(),
    selfChatMode: boolean().optional(),
    allowFrom: array(string()).optional(),
    defaultTo: string().optional(),
    groupAllowFrom: array(string()).optional(),
    groupPolicy: params.useDefaults
      ? GroupPolicySchema.optional().default("allowlist")
      : GroupPolicySchema.optional(),
    mentionPatterns: MentionPatternsPolicySchema.optional(),
    contextVisibility: ContextVisibilityModeSchema.optional(),
    historyLimit: number().int().min(0).optional(),
    dmHistoryLimit: number().int().min(0).optional(),
    dms: record(string(), DmConfigSchema.optional()).optional(),
    textChunkLimit: number().int().positive().optional(),
    streaming: ChannelDeliveryStreamingConfigSchema.optional(),
    groups: WhatsAppGroupsSchema,
    direct: WhatsAppDirectSchema,
    ackReaction: WhatsAppAckReactionSchema,
    reactionLevel: _enum(["off", "ack", "minimal", "extensive"]).optional(),
    debounceMs: params.useDefaults
      ? number().int().nonnegative().optional().default(0)
      : number().int().nonnegative().optional(),
    replyToMode: ReplyToModeSchema.optional(),
    heartbeat: ChannelHeartbeatVisibilitySchema,
    healthMonitor: ChannelHealthMonitorSchema,
    pluginHooks: WhatsAppPluginHooksSchema,
  };
}
function enforceOpenDmPolicyAllowFromStar(params) {
  if (params.dmPolicy !== "open") return;
  if (normalizeStringEntries(Array.isArray(params.allowFrom) ? params.allowFrom : []).includes("*"))
    return;
  params.ctx.addIssue({
    code: ZodIssueCode.custom,
    path: params.path ?? ["allowFrom"],
    message: params.message,
  });
}
function enforceAllowlistDmPolicyAllowFrom(params) {
  if (params.dmPolicy !== "allowlist") return;
  if (normalizeStringEntries(Array.isArray(params.allowFrom) ? params.allowFrom : []).length > 0)
    return;
  params.ctx.addIssue({
    code: ZodIssueCode.custom,
    path: params.path ?? ["allowFrom"],
    message: params.message,
  });
}
const WhatsAppAccountSchema = preprocess(
  stripDeprecatedWhatsAppNoopKeys,
  object({
    ...buildWhatsAppCommonShape({ useDefaults: false }),
    name: string().optional(),
    enabled: boolean().optional(),
    /** Override auth directory for this WhatsApp account (Baileys multi-file auth state). */
    authDir: string().optional(),
    mediaMaxMb: number().int().positive().optional(),
  }).strict(),
);
const WhatsAppConfigSchema = preprocess(
  stripDeprecatedWhatsAppNoopKeys,
  object({
    ...buildWhatsAppCommonShape({ useDefaults: true }),
    accounts: record(string(), WhatsAppAccountSchema.optional()).optional(),
    defaultAccount: string().optional(),
    mediaMaxMb: number().int().positive().optional().default(50),
    actions: object({
      reactions: boolean().optional(),
      sendMessage: boolean().optional(),
      polls: boolean().optional(),
      calls: boolean().optional(),
    })
      .strict()
      .optional(),
  })
    .strict()
    .superRefine((value, ctx) => {
      const defaultAccount = resolveAccountEntry(value.accounts, "default");
      enforceOpenDmPolicyAllowFromStar({
        dmPolicy: value.dmPolicy,
        allowFrom: value.allowFrom,
        ctx,
        message:
          'channels.whatsapp.dmPolicy="open" requires channels.whatsapp.allowFrom to include "*"',
      });
      enforceAllowlistDmPolicyAllowFrom({
        dmPolicy: value.dmPolicy,
        allowFrom: value.allowFrom,
        ctx,
        message:
          'channels.whatsapp.dmPolicy="allowlist" requires channels.whatsapp.allowFrom to contain at least one sender ID',
      });
      if (!value.accounts) return;
      for (const [accountId, account] of Object.entries(value.accounts)) {
        if (!account) continue;
        const effectivePolicy =
          account.dmPolicy ??
          (accountId === "default" ? void 0 : defaultAccount?.dmPolicy) ??
          value.dmPolicy;
        const effectiveAllowFrom =
          account.allowFrom ??
          (accountId === "default" ? void 0 : defaultAccount?.allowFrom) ??
          value.allowFrom;
        enforceOpenDmPolicyAllowFromStar({
          dmPolicy: effectivePolicy,
          allowFrom: effectiveAllowFrom,
          ctx,
          path: ["accounts", accountId, "allowFrom"],
          message:
            'channels.whatsapp.accounts.*.dmPolicy="open" requires channels.whatsapp.accounts.*.allowFrom (or channels.whatsapp.allowFrom) to include "*"',
        });
        enforceAllowlistDmPolicyAllowFrom({
          dmPolicy: effectivePolicy,
          allowFrom: effectiveAllowFrom,
          ctx,
          path: ["accounts", accountId, "allowFrom"],
          message:
            'channels.whatsapp.accounts.*.dmPolicy="allowlist" requires channels.whatsapp.accounts.*.allowFrom (or channels.whatsapp.allowFrom) to contain at least one sender ID',
        });
      }
    }),
);
//#endregion
export { GoogleChatConfigSchema as n, WhatsAppConfigSchema as t };
