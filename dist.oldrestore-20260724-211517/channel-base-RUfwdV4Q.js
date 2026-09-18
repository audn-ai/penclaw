import { n as describeAccountSnapshot } from "./account-helpers-BAtt8fRD.js";
import {
  a as resolveGoogleChatConfigAccessorAccount,
  i as resolveGoogleChatAccount,
  n as listGoogleChatAccountIds,
  r as resolveDefaultGoogleChatAccountId,
} from "./accounts-MI4x6Lvk.js";
import "./account-id-C7N4Rwku.js";
import { n as formatNormalizedAllowFromEntries } from "./allow-from-BCaLdTTU.js";
import {
  s as createScopedChannelConfigAdapter,
  t as adaptScopedAccountAccessor,
} from "./channel-config-helpers-BFvX3ldW.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { t as createSetupTranslator } from "./i18n-BDUMKn0X.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import {
  a as createSetupInputPresenceValidator,
  i as createPatchedAccountSetupAdapter,
  n as applySetupAccountConfigPatch,
  s as migrateBaseNameToDefaultAccount,
} from "./setup-helpers-Dl0hnWtQ.js";
import {
  Q as splitSetupEntries,
  d as createPromptParsedAllowFromForAccount,
  f as createStandardChannelSetupStatus,
  t as addWildcardAllowFrom,
  v as mergeAllowFromEntries,
} from "./setup-wizard-helpers-Kz9xlQ7e.js";
import "./setup-CM3hyaUe.js";
import "./setup-runtime-ByFHbls2.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  f as normalizeStringifiedOptionalString,
} from "./string-coerce-DW4mBlAt.js";
const googlechatSetupAdapter = createPatchedAccountSetupAdapter({
  channelKey: "googlechat",
  validateInput: createSetupInputPresenceValidator({
    defaultAccountOnlyEnvError:
      "GOOGLE_CHAT_SERVICE_ACCOUNT env vars can only be used for the default account.",
    whenNotUseEnv: [
      {
        someOf: ["token", "tokenFile"],
        message: "Google Chat requires --token (service account JSON) or --token-file.",
      },
    ],
  }),
  buildPatch: (input) => {
    const patch = input.useEnv
      ? {}
      : input.tokenFile
        ? { serviceAccountFile: input.tokenFile }
        : input.token
          ? { serviceAccount: input.token }
          : {};
    const audienceType = input.audienceType?.trim();
    const audience = input.audience?.trim();
    const webhookPath = input.webhookPath?.trim();
    const webhookUrl = input.webhookUrl?.trim();
    return {
      ...patch,
      ...(audienceType ? { audienceType } : {}),
      ...(audience ? { audience } : {}),
      ...(webhookPath ? { webhookPath } : {}),
      ...(webhookUrl ? { webhookUrl } : {}),
    };
  },
});
//#endregion
//#region extensions/googlechat/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "googlechat";
const ENV_SERVICE_ACCOUNT = "GOOGLE_CHAT_SERVICE_ACCOUNT";
const ENV_SERVICE_ACCOUNT_FILE = "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE";
const USE_ENV_FLAG = "__googlechatUseEnv";
const AUTH_METHOD_FLAG = "__googlechatAuthMethod";
const googlechatDmPolicy = {
  label: "Google Chat",
  channel,
  policyKey: "channels.googlechat.dm.policy",
  allowFromKey: "channels.googlechat.dm.allowFrom",
  resolveConfigKeys: (cfg, accountId) =>
    (accountId ?? resolveDefaultGoogleChatAccountId(cfg)) !== "default"
      ? {
          policyKey: `channels.googlechat.accounts.${accountId ?? resolveDefaultGoogleChatAccountId(cfg)}.dm.policy`,
          allowFromKey: `channels.googlechat.accounts.${accountId ?? resolveDefaultGoogleChatAccountId(cfg)}.dm.allowFrom`,
        }
      : {
          policyKey: "channels.googlechat.dm.policy",
          allowFromKey: "channels.googlechat.dm.allowFrom",
        },
  getCurrent: (cfg, accountId) =>
    resolveGoogleChatAccount({
      cfg,
      accountId: accountId ?? resolveDefaultGoogleChatAccountId(cfg),
    }).config.dm?.policy ?? "pairing",
  setPolicy: (cfg, policy, accountId) => {
    const resolvedAccountId = accountId ?? resolveDefaultGoogleChatAccountId(cfg);
    const currentDm = resolveGoogleChatAccount({
      cfg,
      accountId: resolvedAccountId,
    }).config.dm;
    return applySetupAccountConfigPatch({
      cfg,
      channelKey: channel,
      accountId: resolvedAccountId,
      patch: {
        dm: {
          ...currentDm,
          policy,
          ...(policy === "open" ? { allowFrom: addWildcardAllowFrom(currentDm?.allowFrom) } : {}),
        },
      },
    });
  },
  promptAllowFrom: createPromptParsedAllowFromForAccount({
    defaultAccountId: resolveDefaultGoogleChatAccountId,
    message: t("wizard.googlechat.allowFromPrompt"),
    placeholder: "users/123456789, name@example.com",
    parseEntries: (raw) => ({ entries: mergeAllowFromEntries(void 0, splitSetupEntries(raw)) }),
    getExistingAllowFrom: ({ cfg, accountId }) =>
      resolveGoogleChatAccount({
        cfg,
        accountId,
      }).config.dm?.allowFrom ?? [],
    applyAllowFrom: ({ cfg, accountId, allowFrom }) =>
      applySetupAccountConfigPatch({
        cfg,
        channelKey: channel,
        accountId,
        patch: {
          dm: {
            ...resolveGoogleChatAccount({
              cfg,
              accountId,
            }).config.dm,
            allowFrom,
          },
        },
      }),
  }),
};
function createServiceAccountTextInput(params) {
  return {
    inputKey: params.inputKey,
    message: params.message,
    placeholder: params.placeholder,
    shouldPrompt: ({ credentialValues }) =>
      credentialValues[USE_ENV_FLAG] !== "1" &&
      credentialValues[AUTH_METHOD_FLAG] === params.authMethod,
    validate: ({ value }) => (normalizeStringifiedOptionalString(value) ? void 0 : "Required"),
    normalizeValue: ({ value }) => normalizeStringifiedOptionalString(value) ?? "",
    applySet: async ({ cfg, accountId, value }) =>
      applySetupAccountConfigPatch({
        cfg,
        channelKey: channel,
        accountId,
        patch: { [params.patchKey]: value },
      }),
  };
}
const googlechatSetupWizard = {
  channel,
  status: createStandardChannelSetupStatus({
    channelLabel: "Google Chat",
    configuredLabel: t("wizard.channels.statusConfigured"),
    unconfiguredLabel: t("wizard.channels.statusNeedsServiceAccount"),
    configuredHint: t("wizard.channels.statusConfigured"),
    unconfiguredHint: t("wizard.channels.statusNeedsAuth"),
    includeStatusLine: true,
    resolveConfigured: ({ cfg, accountId }) =>
      resolveGoogleChatAccount({
        cfg,
        accountId,
      }).credentialSource !== "none",
  }),
  introNote: {
    title: t("wizard.googlechat.setupTitle"),
    lines: [
      t("wizard.googlechat.setupServiceAccount"),
      t("wizard.googlechat.setupScopes"),
      t("wizard.googlechat.setupAudience"),
      t("wizard.channels.docs", { link: formatDocsLink("/channels/googlechat", "googlechat") }),
    ],
  },
  prepare: async ({ cfg, accountId, credentialValues, prompter }) => {
    if (
      accountId === "default" &&
      (Boolean(process.env[ENV_SERVICE_ACCOUNT]) || Boolean(process.env[ENV_SERVICE_ACCOUNT_FILE]))
    ) {
      if (
        await prompter.confirm({
          message: t("wizard.googlechat.useEnvPrompt"),
          initialValue: true,
        })
      )
        return {
          cfg: applySetupAccountConfigPatch({
            cfg,
            channelKey: channel,
            accountId,
            patch: {},
          }),
          credentialValues: {
            ...credentialValues,
            [USE_ENV_FLAG]: "1",
          },
        };
    }
    const method = await prompter.select({
      message: t("wizard.googlechat.authMethod"),
      options: [
        {
          value: "file",
          label: t("wizard.googlechat.serviceAccountFile"),
        },
        {
          value: "inline",
          label: t("wizard.googlechat.serviceAccountInline"),
        },
      ],
      initialValue: "file",
    });
    return {
      credentialValues: {
        ...credentialValues,
        [USE_ENV_FLAG]: "0",
        [AUTH_METHOD_FLAG]: method,
      },
    };
  },
  credentials: [],
  textInputs: [
    createServiceAccountTextInput({
      inputKey: "tokenFile",
      message: t("wizard.googlechat.serviceAccountPath"),
      placeholder: "/path/to/service-account.json",
      authMethod: "file",
      patchKey: "serviceAccountFile",
    }),
    createServiceAccountTextInput({
      inputKey: "token",
      message: t("wizard.googlechat.serviceAccountJson"),
      placeholder: '{"type":"service_account", ... }',
      authMethod: "inline",
      patchKey: "serviceAccount",
    }),
  ],
  finalize: async ({ cfg, accountId, prompter }) => {
    const account = resolveGoogleChatAccount({
      cfg,
      accountId,
    });
    const audienceType = await prompter.select({
      message: t("wizard.googlechat.webhookAudienceType"),
      options: [
        {
          value: "app-url",
          label: t("wizard.googlechat.appUrlRecommended"),
        },
        {
          value: "project-number",
          label: t("wizard.googlechat.projectNumber"),
        },
      ],
      initialValue: account.config.audienceType === "project-number" ? "project-number" : "app-url",
    });
    const audience = await prompter.text({
      message:
        audienceType === "project-number"
          ? t("wizard.googlechat.projectNumber")
          : t("wizard.googlechat.appUrl"),
      placeholder:
        audienceType === "project-number" ? "1234567890" : "https://your.host/googlechat",
      initialValue: account.config.audience || void 0,
      validate: (value) =>
        normalizeStringifiedOptionalString(value) ? void 0 : t("common.required"),
    });
    return {
      cfg: migrateBaseNameToDefaultAccount({
        cfg: applySetupAccountConfigPatch({
          cfg,
          channelKey: channel,
          accountId,
          patch: {
            audienceType,
            audience: normalizeOptionalString(audience) ?? "",
          },
        }),
        channelKey: channel,
      }),
    };
  },
  dmPolicy: googlechatDmPolicy,
};
//#endregion
//#region extensions/googlechat/src/channel-base.ts
const GOOGLECHAT_CHANNEL_ID = "googlechat";
const googlechatMeta = {
  id: GOOGLECHAT_CHANNEL_ID,
  label: "Google Chat",
  selectionLabel: "Google Chat (Chat API)",
  docsPath: "/channels/googlechat",
  docsLabel: "googlechat",
  blurb: "Google Workspace Chat app with HTTP webhook.",
  aliases: ["gchat", "google-chat"],
  order: 55,
  detailLabel: "Google Chat",
  systemImage: "message.badge",
  markdownCapable: true,
};
const formatGoogleChatAllowFromEntry = (entry) =>
  normalizeLowercaseStringOrEmpty(
    entry
      .trim()
      .replace(/^(googlechat|google-chat|gchat):/i, "")
      .replace(/^user:/i, "")
      .replace(/^users\//i, ""),
  );
const googleChatConfigAdapter = createScopedChannelConfigAdapter({
  sectionKey: GOOGLECHAT_CHANNEL_ID,
  listAccountIds: listGoogleChatAccountIds,
  resolveAccount: adaptScopedAccountAccessor(resolveGoogleChatAccount),
  resolveAccessorAccount: resolveGoogleChatConfigAccessorAccount,
  defaultAccountId: resolveDefaultGoogleChatAccountId,
  clearBaseFields: [
    "serviceAccount",
    "serviceAccountFile",
    "audienceType",
    "audience",
    "webhookPath",
    "webhookUrl",
    "botUser",
    "name",
  ],
  resolveAllowFrom: (account) => account.config.dm?.allowFrom,
  formatAllowFrom: (allowFrom) =>
    formatNormalizedAllowFromEntries({
      allowFrom,
      normalizeEntry: formatGoogleChatAllowFromEntry,
    }),
  resolveDefaultTo: (account) => account.config.defaultTo,
});
function createGoogleChatPluginBase(params = {}) {
  return {
    id: GOOGLECHAT_CHANNEL_ID,
    meta: { ...googlechatMeta },
    setup: googlechatSetupAdapter,
    setupWizard: googlechatSetupWizard,
    capabilities: {
      chatTypes: ["direct", "group", "thread"],
      threads: true,
      media: true,
      nativeCommands: false,
      blockStreaming: true,
    },
    streaming: {
      blockStreamingCoalesceDefaults: {
        minChars: 1500,
        idleMs: 1e3,
      },
    },
    reload: { configPrefixes: ["channels.googlechat"] },
    ...(params.configSchema ? { configSchema: params.configSchema } : {}),
    config: {
      ...googleChatConfigAdapter,
      isConfigured: (account) => account.credentialSource !== "none",
      describeAccount: (account) =>
        describeAccountSnapshot({
          account,
          configured: account.credentialSource !== "none",
          extra: { credentialSource: account.credentialSource },
        }),
    },
  };
}
//#endregion
export {
  googlechatSetupAdapter as a,
  googlechatSetupWizard as i,
  createGoogleChatPluginBase as n,
  formatGoogleChatAllowFromEntry as r,
  GOOGLECHAT_CHANNEL_ID as t,
};
