import {
  B as ZodLiteral,
  C as ZodEnum,
  Q as ZodOptional,
  Y as ZodNumber,
  Z as ZodObject,
  bt as ZodUnion,
  c as ZodBoolean,
  it as ZodRecord,
  na as $strict,
  r as ZodArray,
  st as ZodString,
  tt as ZodPreprocess,
  v as ZodDefault,
  xt as ZodUnknown,
  y as ZodDiscriminatedUnion,
} from "./schemas-CkRCGSfd.js";
//#region src/config/zod-schema.providers-googlechat.d.ts
declare const GoogleChatConfigSchema: ZodObject<
  {
    name: ZodOptional<ZodString>;
    capabilities: ZodOptional<ZodArray<ZodString>>;
    enabled: ZodOptional<ZodBoolean>;
    configWrites: ZodOptional<ZodBoolean>;
    allowBots: ZodOptional<ZodBoolean>;
    botLoopProtection: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          maxEventsPerWindow: ZodOptional<ZodNumber>;
          windowSeconds: ZodOptional<ZodNumber>;
          cooldownSeconds: ZodOptional<ZodNumber>;
        },
        $strict
      >
    >;
    dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
    requireMention: ZodOptional<ZodBoolean>;
    groupPolicy: ZodDefault<
      ZodOptional<
        ZodEnum<{
          disabled: "disabled";
          allowlist: "allowlist";
          open: "open";
        }>
      >
    >;
    groupAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
    groups: ZodOptional<
      ZodRecord<
        ZodString,
        ZodOptional<
          ZodObject<
            {
              enabled: ZodOptional<ZodBoolean>;
              requireMention: ZodOptional<ZodBoolean>;
              botLoopProtection: ZodOptional<
                ZodObject<
                  {
                    enabled: ZodOptional<ZodBoolean>;
                    maxEventsPerWindow: ZodOptional<ZodNumber>;
                    windowSeconds: ZodOptional<ZodNumber>;
                    cooldownSeconds: ZodOptional<ZodNumber>;
                  },
                  $strict
                >
              >;
              users: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
              systemPrompt: ZodOptional<ZodString>;
            },
            $strict
          >
        >
      >
    >;
    defaultTo: ZodOptional<ZodString>;
    serviceAccount: ZodOptional<
      ZodUnion<
        readonly [
          ZodString,
          ZodRecord<ZodString, ZodUnknown>,
          ZodDiscriminatedUnion<
            [
              ZodObject<
                {
                  source: ZodLiteral<"env">;
                  provider: ZodString;
                  id: ZodString;
                },
                $strict
              >,
              ZodObject<
                {
                  source: ZodLiteral<"file">;
                  provider: ZodString;
                  id: ZodString;
                },
                $strict
              >,
              ZodObject<
                {
                  source: ZodLiteral<"exec">;
                  provider: ZodString;
                  id: ZodString;
                },
                $strict
              >,
            ],
            "source"
          >,
        ]
      >
    >;
    serviceAccountRef: ZodOptional<
      ZodDiscriminatedUnion<
        [
          ZodObject<
            {
              source: ZodLiteral<"env">;
              provider: ZodString;
              id: ZodString;
            },
            $strict
          >,
          ZodObject<
            {
              source: ZodLiteral<"file">;
              provider: ZodString;
              id: ZodString;
            },
            $strict
          >,
          ZodObject<
            {
              source: ZodLiteral<"exec">;
              provider: ZodString;
              id: ZodString;
            },
            $strict
          >,
        ],
        "source"
      >
    >;
    serviceAccountFile: ZodOptional<ZodString>;
    audienceType: ZodOptional<
      ZodEnum<{
        "app-url": "app-url";
        "project-number": "project-number";
      }>
    >;
    audience: ZodOptional<ZodString>;
    appPrincipal: ZodOptional<ZodString>;
    webhookPath: ZodOptional<ZodString>;
    webhookUrl: ZodOptional<ZodString>;
    botUser: ZodOptional<ZodString>;
    historyLimit: ZodOptional<ZodNumber>;
    dmHistoryLimit: ZodOptional<ZodNumber>;
    dms: ZodOptional<
      ZodRecord<
        ZodString,
        ZodOptional<
          ZodObject<
            {
              historyLimit: ZodOptional<ZodNumber>;
            },
            $strict
          >
        >
      >
    >;
    textChunkLimit: ZodOptional<ZodNumber>;
    streaming: ZodOptional<
      ZodObject<
        {
          chunkMode: ZodOptional<
            ZodEnum<{
              length: "length";
              newline: "newline";
            }>
          >;
          block: ZodOptional<
            ZodObject<
              {
                enabled: ZodOptional<ZodBoolean>;
                coalesce: ZodOptional<
                  ZodObject<
                    {
                      minChars: ZodOptional<ZodNumber>;
                      maxChars: ZodOptional<ZodNumber>;
                      idleMs: ZodOptional<ZodNumber>;
                    },
                    $strict
                  >
                >;
              },
              $strict
            >
          >;
        },
        $strict
      >
    >;
    mediaMaxMb: ZodOptional<ZodNumber>;
    replyToMode: ZodOptional<
      ZodUnion<
        readonly [ZodLiteral<"off">, ZodLiteral<"first">, ZodLiteral<"all">, ZodLiteral<"batched">]
      >
    >;
    actions: ZodOptional<
      ZodObject<
        {
          reactions: ZodOptional<ZodBoolean>;
        },
        $strict
      >
    >;
    dm: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
          policy: ZodDefault<
            ZodOptional<
              ZodEnum<{
                disabled: "disabled";
                allowlist: "allowlist";
                pairing: "pairing";
                open: "open";
              }>
            >
          >;
          allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
        },
        $strict
      >
    >;
    healthMonitor: ZodOptional<
      ZodObject<
        {
          enabled: ZodOptional<ZodBoolean>;
        },
        $strict
      >
    >;
    typingIndicator: ZodOptional<
      ZodEnum<{
        message: "message";
        none: "none";
        reaction: "reaction";
      }>
    >;
    responsePrefix: ZodOptional<ZodString>;
    accounts: ZodOptional<
      ZodRecord<
        ZodString,
        ZodOptional<
          ZodObject<
            {
              name: ZodOptional<ZodString>;
              capabilities: ZodOptional<ZodArray<ZodString>>;
              enabled: ZodOptional<ZodBoolean>;
              configWrites: ZodOptional<ZodBoolean>;
              allowBots: ZodOptional<ZodBoolean>;
              botLoopProtection: ZodOptional<
                ZodObject<
                  {
                    enabled: ZodOptional<ZodBoolean>;
                    maxEventsPerWindow: ZodOptional<ZodNumber>;
                    windowSeconds: ZodOptional<ZodNumber>;
                    cooldownSeconds: ZodOptional<ZodNumber>;
                  },
                  $strict
                >
              >;
              dangerouslyAllowNameMatching: ZodOptional<ZodBoolean>;
              requireMention: ZodOptional<ZodBoolean>;
              groupPolicy: ZodDefault<
                ZodOptional<
                  ZodEnum<{
                    disabled: "disabled";
                    allowlist: "allowlist";
                    open: "open";
                  }>
                >
              >;
              groupAllowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
              groups: ZodOptional<
                ZodRecord<
                  ZodString,
                  ZodOptional<
                    ZodObject<
                      {
                        enabled: ZodOptional<ZodBoolean>;
                        requireMention: ZodOptional<ZodBoolean>;
                        botLoopProtection: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              maxEventsPerWindow: ZodOptional<ZodNumber>;
                              windowSeconds: ZodOptional<ZodNumber>;
                              cooldownSeconds: ZodOptional<ZodNumber>;
                            },
                            $strict
                          >
                        >;
                        users: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
                        systemPrompt: ZodOptional<ZodString>;
                      },
                      $strict
                    >
                  >
                >
              >;
              defaultTo: ZodOptional<ZodString>;
              serviceAccount: ZodOptional<
                ZodUnion<
                  readonly [
                    ZodString,
                    ZodRecord<ZodString, ZodUnknown>,
                    ZodDiscriminatedUnion<
                      [
                        ZodObject<
                          {
                            source: ZodLiteral<"env">;
                            provider: ZodString;
                            id: ZodString;
                          },
                          $strict
                        >,
                        ZodObject<
                          {
                            source: ZodLiteral<"file">;
                            provider: ZodString;
                            id: ZodString;
                          },
                          $strict
                        >,
                        ZodObject<
                          {
                            source: ZodLiteral<"exec">;
                            provider: ZodString;
                            id: ZodString;
                          },
                          $strict
                        >,
                      ],
                      "source"
                    >,
                  ]
                >
              >;
              serviceAccountRef: ZodOptional<
                ZodDiscriminatedUnion<
                  [
                    ZodObject<
                      {
                        source: ZodLiteral<"env">;
                        provider: ZodString;
                        id: ZodString;
                      },
                      $strict
                    >,
                    ZodObject<
                      {
                        source: ZodLiteral<"file">;
                        provider: ZodString;
                        id: ZodString;
                      },
                      $strict
                    >,
                    ZodObject<
                      {
                        source: ZodLiteral<"exec">;
                        provider: ZodString;
                        id: ZodString;
                      },
                      $strict
                    >,
                  ],
                  "source"
                >
              >;
              serviceAccountFile: ZodOptional<ZodString>;
              audienceType: ZodOptional<
                ZodEnum<{
                  "app-url": "app-url";
                  "project-number": "project-number";
                }>
              >;
              audience: ZodOptional<ZodString>;
              appPrincipal: ZodOptional<ZodString>;
              webhookPath: ZodOptional<ZodString>;
              webhookUrl: ZodOptional<ZodString>;
              botUser: ZodOptional<ZodString>;
              historyLimit: ZodOptional<ZodNumber>;
              dmHistoryLimit: ZodOptional<ZodNumber>;
              dms: ZodOptional<
                ZodRecord<
                  ZodString,
                  ZodOptional<
                    ZodObject<
                      {
                        historyLimit: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >
                >
              >;
              textChunkLimit: ZodOptional<ZodNumber>;
              streaming: ZodOptional<
                ZodObject<
                  {
                    chunkMode: ZodOptional<
                      ZodEnum<{
                        length: "length";
                        newline: "newline";
                      }>
                    >;
                    block: ZodOptional<
                      ZodObject<
                        {
                          enabled: ZodOptional<ZodBoolean>;
                          coalesce: ZodOptional<
                            ZodObject<
                              {
                                minChars: ZodOptional<ZodNumber>;
                                maxChars: ZodOptional<ZodNumber>;
                                idleMs: ZodOptional<ZodNumber>;
                              },
                              $strict
                            >
                          >;
                        },
                        $strict
                      >
                    >;
                  },
                  $strict
                >
              >;
              mediaMaxMb: ZodOptional<ZodNumber>;
              replyToMode: ZodOptional<
                ZodUnion<
                  readonly [
                    ZodLiteral<"off">,
                    ZodLiteral<"first">,
                    ZodLiteral<"all">,
                    ZodLiteral<"batched">,
                  ]
                >
              >;
              actions: ZodOptional<
                ZodObject<
                  {
                    reactions: ZodOptional<ZodBoolean>;
                  },
                  $strict
                >
              >;
              dm: ZodOptional<
                ZodObject<
                  {
                    enabled: ZodOptional<ZodBoolean>;
                    policy: ZodDefault<
                      ZodOptional<
                        ZodEnum<{
                          disabled: "disabled";
                          allowlist: "allowlist";
                          pairing: "pairing";
                          open: "open";
                        }>
                      >
                    >;
                    allowFrom: ZodOptional<ZodArray<ZodUnion<readonly [ZodString, ZodNumber]>>>;
                  },
                  $strict
                >
              >;
              healthMonitor: ZodOptional<
                ZodObject<
                  {
                    enabled: ZodOptional<ZodBoolean>;
                  },
                  $strict
                >
              >;
              typingIndicator: ZodOptional<
                ZodEnum<{
                  message: "message";
                  none: "none";
                  reaction: "reaction";
                }>
              >;
              responsePrefix: ZodOptional<ZodString>;
            },
            $strict
          >
        >
      >
    >;
    defaultAccount: ZodOptional<ZodString>;
  },
  $strict
>;
//#endregion
//#region src/config/zod-schema.providers-whatsapp.d.ts
declare const WhatsAppConfigSchema: ZodPreprocess<
  ZodObject<
    {
      accounts: ZodOptional<
        ZodRecord<
          ZodString,
          ZodOptional<
            ZodPreprocess<
              ZodObject<
                {
                  name: ZodOptional<ZodString>;
                  enabled: ZodOptional<ZodBoolean>;
                  authDir: ZodOptional<ZodString>;
                  mediaMaxMb: ZodOptional<ZodNumber>;
                  capabilities: ZodOptional<ZodArray<ZodString>>;
                  markdown: ZodOptional<
                    ZodObject<
                      {
                        tables: ZodOptional<
                          ZodEnum<{
                            code: "code";
                            off: "off";
                            block: "block";
                            bullets: "bullets";
                          }>
                        >;
                      },
                      $strict
                    >
                  >;
                  configWrites: ZodOptional<ZodBoolean>;
                  sendReadReceipts: ZodOptional<ZodBoolean>;
                  messagePrefix: ZodOptional<ZodString>;
                  responsePrefix: ZodOptional<ZodString>;
                  dmPolicy:
                    | ZodOptional<
                        ZodEnum<{
                          disabled: "disabled";
                          allowlist: "allowlist";
                          pairing: "pairing";
                          open: "open";
                        }>
                      >
                    | ZodDefault<
                        ZodOptional<
                          ZodEnum<{
                            disabled: "disabled";
                            allowlist: "allowlist";
                            pairing: "pairing";
                            open: "open";
                          }>
                        >
                      >;
                  selfChatMode: ZodOptional<ZodBoolean>;
                  allowFrom: ZodOptional<ZodArray<ZodString>>;
                  defaultTo: ZodOptional<ZodString>;
                  groupAllowFrom: ZodOptional<ZodArray<ZodString>>;
                  groupPolicy:
                    | ZodOptional<
                        ZodEnum<{
                          disabled: "disabled";
                          allowlist: "allowlist";
                          open: "open";
                        }>
                      >
                    | ZodDefault<
                        ZodOptional<
                          ZodEnum<{
                            disabled: "disabled";
                            allowlist: "allowlist";
                            open: "open";
                          }>
                        >
                      >;
                  mentionPatterns: ZodOptional<
                    ZodObject<
                      {
                        mode: ZodOptional<
                          ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>
                        >;
                        allowIn: ZodOptional<ZodArray<ZodString>>;
                        denyIn: ZodOptional<ZodArray<ZodString>>;
                      },
                      $strict
                    >
                  >;
                  contextVisibility: ZodOptional<
                    ZodEnum<{
                      all: "all";
                      allowlist: "allowlist";
                      allowlist_quote: "allowlist_quote";
                    }>
                  >;
                  historyLimit: ZodOptional<ZodNumber>;
                  dmHistoryLimit: ZodOptional<ZodNumber>;
                  dms: ZodOptional<
                    ZodRecord<
                      ZodString,
                      ZodOptional<
                        ZodObject<
                          {
                            historyLimit: ZodOptional<ZodNumber>;
                          },
                          $strict
                        >
                      >
                    >
                  >;
                  textChunkLimit: ZodOptional<ZodNumber>;
                  streaming: ZodOptional<
                    ZodObject<
                      {
                        chunkMode: ZodOptional<
                          ZodEnum<{
                            length: "length";
                            newline: "newline";
                          }>
                        >;
                        block: ZodOptional<
                          ZodObject<
                            {
                              enabled: ZodOptional<ZodBoolean>;
                              coalesce: ZodOptional<
                                ZodObject<
                                  {
                                    minChars: ZodOptional<ZodNumber>;
                                    maxChars: ZodOptional<ZodNumber>;
                                    idleMs: ZodOptional<ZodNumber>;
                                  },
                                  $strict
                                >
                              >;
                            },
                            $strict
                          >
                        >;
                      },
                      $strict
                    >
                  >;
                  groups: ZodOptional<
                    ZodRecord<
                      ZodString,
                      ZodOptional<
                        ZodObject<
                          {
                            requireMention: ZodOptional<ZodBoolean>;
                            tools: ZodOptional<
                              ZodObject<
                                {
                                  allow: ZodOptional<ZodArray<ZodString>>;
                                  alsoAllow: ZodOptional<ZodArray<ZodString>>;
                                  deny: ZodOptional<ZodArray<ZodString>>;
                                },
                                $strict
                              >
                            >;
                            toolsBySender: ZodOptional<
                              ZodRecord<
                                ZodString,
                                ZodOptional<
                                  ZodObject<
                                    {
                                      allow: ZodOptional<ZodArray<ZodString>>;
                                      alsoAllow: ZodOptional<ZodArray<ZodString>>;
                                      deny: ZodOptional<ZodArray<ZodString>>;
                                    },
                                    $strict
                                  >
                                >
                              >
                            >;
                            systemPrompt: ZodOptional<ZodString>;
                          },
                          $strict
                        >
                      >
                    >
                  >;
                  direct: ZodOptional<
                    ZodRecord<
                      ZodString,
                      ZodOptional<
                        ZodObject<
                          {
                            systemPrompt: ZodOptional<ZodString>;
                          },
                          $strict
                        >
                      >
                    >
                  >;
                  ackReaction: ZodOptional<
                    ZodObject<
                      {
                        emoji: ZodOptional<ZodString>;
                        direct: ZodDefault<ZodOptional<ZodBoolean>>;
                        group: ZodDefault<
                          ZodOptional<
                            ZodEnum<{
                              always: "always";
                              never: "never";
                              mentions: "mentions";
                            }>
                          >
                        >;
                      },
                      $strict
                    >
                  >;
                  reactionLevel: ZodOptional<
                    ZodEnum<{
                      off: "off";
                      minimal: "minimal";
                      ack: "ack";
                      extensive: "extensive";
                    }>
                  >;
                  debounceMs: ZodOptional<ZodNumber> | ZodDefault<ZodOptional<ZodNumber>>;
                  replyToMode: ZodOptional<
                    ZodUnion<
                      readonly [
                        ZodLiteral<"off">,
                        ZodLiteral<"first">,
                        ZodLiteral<"all">,
                        ZodLiteral<"batched">,
                      ]
                    >
                  >;
                  heartbeat: ZodOptional<
                    ZodObject<
                      {
                        showOk: ZodOptional<ZodBoolean>;
                        showAlerts: ZodOptional<ZodBoolean>;
                        useIndicator: ZodOptional<ZodBoolean>;
                      },
                      $strict
                    >
                  >;
                  healthMonitor: ZodOptional<
                    ZodObject<
                      {
                        enabled: ZodOptional<ZodBoolean>;
                      },
                      $strict
                    >
                  >;
                  pluginHooks: ZodOptional<
                    ZodObject<
                      {
                        messageReceived: ZodOptional<ZodBoolean>;
                      },
                      $strict
                    >
                  >;
                },
                $strict
              >
            >
          >
        >
      >;
      defaultAccount: ZodOptional<ZodString>;
      mediaMaxMb: ZodDefault<ZodOptional<ZodNumber>>;
      actions: ZodOptional<
        ZodObject<
          {
            reactions: ZodOptional<ZodBoolean>;
            sendMessage: ZodOptional<ZodBoolean>;
            polls: ZodOptional<ZodBoolean>;
            calls: ZodOptional<ZodBoolean>;
          },
          $strict
        >
      >;
      enabled: ZodOptional<ZodBoolean>;
      capabilities: ZodOptional<ZodArray<ZodString>>;
      markdown: ZodOptional<
        ZodObject<
          {
            tables: ZodOptional<
              ZodEnum<{
                code: "code";
                off: "off";
                block: "block";
                bullets: "bullets";
              }>
            >;
          },
          $strict
        >
      >;
      configWrites: ZodOptional<ZodBoolean>;
      sendReadReceipts: ZodOptional<ZodBoolean>;
      messagePrefix: ZodOptional<ZodString>;
      responsePrefix: ZodOptional<ZodString>;
      dmPolicy:
        | ZodOptional<
            ZodEnum<{
              disabled: "disabled";
              allowlist: "allowlist";
              pairing: "pairing";
              open: "open";
            }>
          >
        | ZodDefault<
            ZodOptional<
              ZodEnum<{
                disabled: "disabled";
                allowlist: "allowlist";
                pairing: "pairing";
                open: "open";
              }>
            >
          >;
      selfChatMode: ZodOptional<ZodBoolean>;
      allowFrom: ZodOptional<ZodArray<ZodString>>;
      defaultTo: ZodOptional<ZodString>;
      groupAllowFrom: ZodOptional<ZodArray<ZodString>>;
      groupPolicy:
        | ZodOptional<
            ZodEnum<{
              disabled: "disabled";
              allowlist: "allowlist";
              open: "open";
            }>
          >
        | ZodDefault<
            ZodOptional<
              ZodEnum<{
                disabled: "disabled";
                allowlist: "allowlist";
                open: "open";
              }>
            >
          >;
      mentionPatterns: ZodOptional<
        ZodObject<
          {
            mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>>;
            allowIn: ZodOptional<ZodArray<ZodString>>;
            denyIn: ZodOptional<ZodArray<ZodString>>;
          },
          $strict
        >
      >;
      contextVisibility: ZodOptional<
        ZodEnum<{
          all: "all";
          allowlist: "allowlist";
          allowlist_quote: "allowlist_quote";
        }>
      >;
      historyLimit: ZodOptional<ZodNumber>;
      dmHistoryLimit: ZodOptional<ZodNumber>;
      dms: ZodOptional<
        ZodRecord<
          ZodString,
          ZodOptional<
            ZodObject<
              {
                historyLimit: ZodOptional<ZodNumber>;
              },
              $strict
            >
          >
        >
      >;
      textChunkLimit: ZodOptional<ZodNumber>;
      streaming: ZodOptional<
        ZodObject<
          {
            chunkMode: ZodOptional<
              ZodEnum<{
                length: "length";
                newline: "newline";
              }>
            >;
            block: ZodOptional<
              ZodObject<
                {
                  enabled: ZodOptional<ZodBoolean>;
                  coalesce: ZodOptional<
                    ZodObject<
                      {
                        minChars: ZodOptional<ZodNumber>;
                        maxChars: ZodOptional<ZodNumber>;
                        idleMs: ZodOptional<ZodNumber>;
                      },
                      $strict
                    >
                  >;
                },
                $strict
              >
            >;
          },
          $strict
        >
      >;
      groups: ZodOptional<
        ZodRecord<
          ZodString,
          ZodOptional<
            ZodObject<
              {
                requireMention: ZodOptional<ZodBoolean>;
                tools: ZodOptional<
                  ZodObject<
                    {
                      allow: ZodOptional<ZodArray<ZodString>>;
                      alsoAllow: ZodOptional<ZodArray<ZodString>>;
                      deny: ZodOptional<ZodArray<ZodString>>;
                    },
                    $strict
                  >
                >;
                toolsBySender: ZodOptional<
                  ZodRecord<
                    ZodString,
                    ZodOptional<
                      ZodObject<
                        {
                          allow: ZodOptional<ZodArray<ZodString>>;
                          alsoAllow: ZodOptional<ZodArray<ZodString>>;
                          deny: ZodOptional<ZodArray<ZodString>>;
                        },
                        $strict
                      >
                    >
                  >
                >;
                systemPrompt: ZodOptional<ZodString>;
              },
              $strict
            >
          >
        >
      >;
      direct: ZodOptional<
        ZodRecord<
          ZodString,
          ZodOptional<
            ZodObject<
              {
                systemPrompt: ZodOptional<ZodString>;
              },
              $strict
            >
          >
        >
      >;
      ackReaction: ZodOptional<
        ZodObject<
          {
            emoji: ZodOptional<ZodString>;
            direct: ZodDefault<ZodOptional<ZodBoolean>>;
            group: ZodDefault<
              ZodOptional<
                ZodEnum<{
                  always: "always";
                  never: "never";
                  mentions: "mentions";
                }>
              >
            >;
          },
          $strict
        >
      >;
      reactionLevel: ZodOptional<
        ZodEnum<{
          off: "off";
          minimal: "minimal";
          ack: "ack";
          extensive: "extensive";
        }>
      >;
      debounceMs: ZodOptional<ZodNumber> | ZodDefault<ZodOptional<ZodNumber>>;
      replyToMode: ZodOptional<
        ZodUnion<
          readonly [
            ZodLiteral<"off">,
            ZodLiteral<"first">,
            ZodLiteral<"all">,
            ZodLiteral<"batched">,
          ]
        >
      >;
      heartbeat: ZodOptional<
        ZodObject<
          {
            showOk: ZodOptional<ZodBoolean>;
            showAlerts: ZodOptional<ZodBoolean>;
            useIndicator: ZodOptional<ZodBoolean>;
          },
          $strict
        >
      >;
      healthMonitor: ZodOptional<
        ZodObject<
          {
            enabled: ZodOptional<ZodBoolean>;
          },
          $strict
        >
      >;
      pluginHooks: ZodOptional<
        ZodObject<
          {
            messageReceived: ZodOptional<ZodBoolean>;
          },
          $strict
        >
      >;
    },
    $strict
  >
>;
//#endregion
export { GoogleChatConfigSchema as n, WhatsAppConfigSchema as t };
