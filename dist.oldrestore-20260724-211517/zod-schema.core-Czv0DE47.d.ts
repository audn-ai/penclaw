import {
  B as ZodLiteral,
  C as ZodEnum,
  Q as ZodOptional,
  Y as ZodNumber,
  Z as ZodObject,
  bt as ZodUnion,
  c as ZodBoolean,
  ea as $catchall,
  it as ZodRecord,
  na as $strict,
  q as ZodNull,
  r as ZodArray,
  st as ZodString,
  xt as ZodUnknown,
  y as ZodDiscriminatedUnion,
  zr as $RefinementCtx,
} from "./schemas-CkRCGSfd.js";

//#region src/config/zod-schema.core.d.ts
declare const MentionPatternsPolicySchema: ZodObject<
  {
    mode: ZodOptional<ZodUnion<readonly [ZodLiteral<"allow">, ZodLiteral<"deny">]>>;
    allowIn: ZodOptional<ZodArray<ZodString>>;
    denyIn: ZodOptional<ZodArray<ZodString>>;
  },
  $strict
>;
declare const DmConfigSchema: ZodObject<
  {
    historyLimit: ZodOptional<ZodNumber>;
  },
  $strict
>;
declare const GroupPolicySchema: ZodEnum<{
  disabled: "disabled";
  allowlist: "allowlist";
  open: "open";
}>;
declare const DmPolicySchema: ZodEnum<{
  disabled: "disabled";
  allowlist: "allowlist";
  pairing: "pairing";
  open: "open";
}>;
declare const ContextVisibilityModeSchema: ZodEnum<{
  all: "all";
  allowlist: "allowlist";
  allowlist_quote: "allowlist_quote";
}>;
declare const BlockStreamingCoalesceSchema: ZodObject<
  {
    minChars: ZodOptional<ZodNumber>;
    maxChars: ZodOptional<ZodNumber>;
    idleMs: ZodOptional<ZodNumber>;
  },
  $strict
>;
declare const ReplyRuntimeConfigSchemaShape: {
  historyLimit: ZodOptional<ZodNumber>;
  dmHistoryLimit: ZodOptional<ZodNumber>;
  contextVisibility: ZodOptional<
    ZodEnum<{
      all: "all";
      allowlist: "allowlist";
      allowlist_quote: "allowlist_quote";
    }>
  >;
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
  responsePrefix: ZodOptional<ZodString>;
  mediaMaxMb: ZodOptional<ZodNumber>;
};
declare const MarkdownConfigSchema: ZodOptional<
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
declare const TtsProviderSchema: ZodString;
declare const TtsModeSchema: ZodEnum<{
  all: "all";
  final: "final";
}>;
declare const TtsAutoSchema: ZodEnum<{
  off: "off";
  always: "always";
  tagged: "tagged";
  inbound: "inbound";
}>;
declare const TtsConfigSchema: ZodOptional<
  ZodObject<
    {
      auto: ZodOptional<
        ZodEnum<{
          off: "off";
          always: "always";
          tagged: "tagged";
          inbound: "inbound";
        }>
      >;
      enabled: ZodOptional<ZodBoolean>;
      mode: ZodOptional<
        ZodEnum<{
          all: "all";
          final: "final";
        }>
      >;
      provider: ZodOptional<ZodString>;
      persona: ZodOptional<ZodString>;
      personas: ZodOptional<
        ZodRecord<
          ZodString,
          ZodObject<
            {
              label: ZodOptional<ZodString>;
              description: ZodOptional<ZodString>;
              provider: ZodOptional<ZodString>;
              fallbackPolicy: ZodOptional<
                ZodUnion<
                  readonly [
                    ZodLiteral<"preserve-persona">,
                    ZodLiteral<"provider-defaults">,
                    ZodLiteral<"fail">,
                  ]
                >
              >;
              prompt: ZodOptional<
                ZodObject<
                  {
                    profile: ZodOptional<ZodString>;
                    scene: ZodOptional<ZodString>;
                    sampleContext: ZodOptional<ZodString>;
                    style: ZodOptional<ZodString>;
                    accent: ZodOptional<ZodString>;
                    pacing: ZodOptional<ZodString>;
                    constraints: ZodOptional<ZodArray<ZodString>>;
                  },
                  $strict
                >
              >;
              providers: ZodOptional<
                ZodRecord<
                  ZodString,
                  ZodObject<
                    {
                      apiKey: ZodOptional<
                        ZodUnion<
                          readonly [
                            ZodString,
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
                    },
                    $catchall<
                      ZodUnion<
                        readonly [
                          ZodString,
                          ZodNumber,
                          ZodBoolean,
                          ZodNull,
                          ZodArray<ZodUnknown>,
                          ZodRecord<ZodString, ZodUnknown>,
                        ]
                      >
                    >
                  >
                >
              >;
            },
            $strict
          >
        >
      >;
      summaryModel: ZodOptional<ZodString>;
      modelOverrides: ZodOptional<
        ZodObject<
          {
            enabled: ZodOptional<ZodBoolean>;
            allowText: ZodOptional<ZodBoolean>;
            allowProvider: ZodOptional<ZodBoolean>;
            allowVoice: ZodOptional<ZodBoolean>;
            allowModelId: ZodOptional<ZodBoolean>;
            allowVoiceSettings: ZodOptional<ZodBoolean>;
            allowNormalization: ZodOptional<ZodBoolean>;
            allowSeed: ZodOptional<ZodBoolean>;
          },
          $strict
        >
      >;
      providers: ZodOptional<
        ZodRecord<
          ZodString,
          ZodObject<
            {
              apiKey: ZodOptional<
                ZodUnion<
                  readonly [
                    ZodString,
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
            },
            $catchall<
              ZodUnion<
                readonly [
                  ZodString,
                  ZodNumber,
                  ZodBoolean,
                  ZodNull,
                  ZodArray<ZodUnknown>,
                  ZodRecord<ZodString, ZodUnknown>,
                ]
              >
            >
          >
        >
      >;
      prefsPath: ZodOptional<ZodString>;
      maxTextLength: ZodOptional<ZodNumber>;
      timeoutMs: ZodOptional<ZodNumber>;
    },
    $strict
  >
>;
declare const requireOpenAllowFrom: (params: {
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: $RefinementCtx;
  path: Array<string | number>;
  message: string;
}) => void;
/**
 * Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
 * Without this, all DMs are silently dropped because the allowlist is empty
 * and no senders can match.
 */
declare const requireAllowlistAllowFrom: (params: {
  policy?: string;
  allowFrom?: Array<string | number>;
  ctx: $RefinementCtx;
  path: Array<string | number>;
  message: string;
}) => void;
//#endregion
export {
  GroupPolicySchema as a,
  ReplyRuntimeConfigSchemaShape as c,
  TtsModeSchema as d,
  TtsProviderSchema as f,
  DmPolicySchema as i,
  TtsAutoSchema as l,
  requireOpenAllowFrom as m,
  ContextVisibilityModeSchema as n,
  MarkdownConfigSchema as o,
  requireAllowlistAllowFrom as p,
  DmConfigSchema as r,
  MentionPatternsPolicySchema as s,
  BlockStreamingCoalesceSchema as t,
  TtsConfigSchema as u,
};
