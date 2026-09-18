import { n as describeAccountSnapshot } from "./account-helpers-BAtt8fRD.js";
import { t as formatAllowFromLowercase } from "./allow-from-BCaLdTTU.js";
import {
  s as createScopedChannelConfigAdapter,
  t as adaptScopedAccountAccessor,
} from "./channel-config-helpers-BFvX3ldW.js";
import { n as createDangerousNameMatchingMutableAllowlistWarningCollector } from "./channel-policy-DXOn_tKS.js";
import {
  n as buildCatchallMultiAccountChannelSchema,
  r as buildChannelConfigSchema,
  t as AllowFromListSchema,
} from "./config-schema-qmCQZl6j.js";
import {
  n as normalizeCompatibilityConfig,
  t as legacyConfigRules,
} from "./doctor-contract-mDJdHVKH.js";
import "./text-chunking-Dr19ggf-.js";
import "./core-V3U0lOIj.js";
import { At as boolean, Rn as string, Tn as object, wn as number } from "./schemas-CBJjibl3.js";
import "./channel-config-schema-C-vJvjtu.js";
import { n as isZalouserMutableGroupEntry } from "./security-audit-DC5CKVvi.js";
import "./dangerous-name-runtime-cJriWyuh.js";
import {
  a as listZalouserAccountIds,
  i as checkZcaAuthenticated,
  o as resolveDefaultZalouserAccountId,
  s as resolveZalouserAccountSync,
} from "./setup-core-CsmOh80f.js";
import { l as ToolPolicySchema } from "./zod-schema.agent-runtime-D8C103DW.js";
import {
  _ as MarkdownConfigSchema,
  c as DmPolicySchema,
  d as GroupPolicySchema,
} from "./zod-schema.core-CWTCY1ZZ.js";
//#region extensions/zalouser/src/config-schema.ts
const groupConfigSchema = object({
  enabled: boolean().optional(),
  requireMention: boolean().optional(),
  tools: ToolPolicySchema,
});
const ZalouserConfigSchema = buildCatchallMultiAccountChannelSchema(
  object({
    name: string().optional(),
    enabled: boolean().optional(),
    markdown: MarkdownConfigSchema,
    profile: string().optional(),
    dangerouslyAllowNameMatching: boolean().optional(),
    dmPolicy: DmPolicySchema.optional(),
    allowFrom: AllowFromListSchema,
    historyLimit: number().int().min(0).optional(),
    groupAllowFrom: AllowFromListSchema,
    groupPolicy: GroupPolicySchema.optional().default("allowlist"),
    groups: object({}).catchall(groupConfigSchema).optional(),
    messagePrefix: string().optional(),
    responsePrefix: string().optional(),
  }),
);
//#endregion
//#region extensions/zalouser/src/doctor.ts
function asObjectRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
const zalouserDoctor = {
  dmAllowFromMode: "topOnly",
  groupModel: "hybrid",
  groupAllowFromFallbackToAllowFrom: false,
  warnOnEmptyGroupSenderAllowlist: false,
  legacyConfigRules,
  normalizeCompatibilityConfig,
  collectMutableAllowlistWarnings: createDangerousNameMatchingMutableAllowlistWarningCollector({
    channel: "zalouser",
    detector: isZalouserMutableGroupEntry,
    collectLists: (scope) => {
      const groups = asObjectRecord(scope.account.groups);
      return groups
        ? [
            {
              pathLabel: `${scope.prefix}.groups`,
              list: Object.keys(groups),
            },
          ]
        : [];
    },
  }),
};
//#endregion
//#region extensions/zalouser/src/shared.ts
const zalouserMeta = {
  id: "zalouser",
  label: "Zalo Personal",
  selectionLabel: "Zalo (Personal Account)",
  docsPath: "/channels/zalouser",
  docsLabel: "zalouser",
  blurb: "Zalo personal account via QR code login.",
  aliases: ["zlu"],
  order: 85,
  quickstartAllowFrom: false,
};
const zalouserConfigAdapter = createScopedChannelConfigAdapter({
  sectionKey: "zalouser",
  listAccountIds: listZalouserAccountIds,
  resolveAccount: adaptScopedAccountAccessor(resolveZalouserAccountSync),
  defaultAccountId: resolveDefaultZalouserAccountId,
  clearBaseFields: [
    "profile",
    "name",
    "dmPolicy",
    "allowFrom",
    "historyLimit",
    "groupAllowFrom",
    "groupPolicy",
    "groups",
    "messagePrefix",
  ],
  resolveAllowFrom: (account) => account.config.allowFrom,
  formatAllowFrom: (allowFrom) =>
    formatAllowFromLowercase({
      allowFrom,
      stripPrefixRe: /^(zalouser|zlu):/i,
    }),
});
function createZalouserPluginBase(params) {
  return {
    id: "zalouser",
    meta: zalouserMeta,
    setupWizard: params.setupWizard,
    capabilities: {
      chatTypes: ["direct", "group"],
      media: true,
      reactions: true,
      threads: false,
      polls: false,
      nativeCommands: false,
      blockStreaming: true,
    },
    doctor: zalouserDoctor,
    reload: { configPrefixes: ["channels.zalouser"] },
    configSchema: buildChannelConfigSchema(ZalouserConfigSchema),
    config: {
      ...zalouserConfigAdapter,
      isConfigured: async (account) => await checkZcaAuthenticated(account.profile),
      describeAccount: (account) => describeAccountSnapshot({ account }),
    },
    setup: params.setup,
  };
}
//#endregion
export { createZalouserPluginBase as t };
