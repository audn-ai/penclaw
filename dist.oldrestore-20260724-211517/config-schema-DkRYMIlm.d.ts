import {
  B as ZodLiteral,
  C as ZodEnum,
  Mi as output,
  Q as ZodOptional,
  Y as ZodNumber,
  Z as ZodObject,
  _t as ZodURL,
  c as ZodBoolean,
  it as ZodRecord,
  na as $strict,
  r as ZodArray,
  st as ZodString,
  v as ZodDefault,
  x as ZodEmail,
} from "./schemas-CkRCGSfd.js";

//#region extensions/reef/src/config-schema.d.ts
declare const ReefFriendSchema: ZodObject<
  {
    autonomy: ZodDefault<
      ZodEnum<{
        "notify-only": "notify-only";
        bounded: "bounded";
        extended: "extended";
      }>
    >;
    ed25519PublicKey: ZodString;
    x25519PublicKey: ZodString;
    keyEpoch: ZodNumber;
    safetyNumberChanged: ZodDefault<ZodBoolean>;
  },
  $strict
>;
declare const ReefChannelConfigSchema: ZodObject<
  {
    enabled: ZodDefault<ZodBoolean>;
    relayUrl: ZodDefault<ZodURL>;
    handle: ZodOptional<ZodString>;
    email: ZodOptional<ZodEmail>;
    guard: ZodOptional<
      ZodObject<
        {
          provider: ZodEnum<{
            openai: "openai";
            anthropic: "anthropic";
          }>;
          pinnedModel: ZodString;
          apiKeyEnv: ZodString;
          policyVersion: ZodString;
          timeoutMs: ZodNumber;
        },
        $strict
      >
    >;
    stateDir: ZodOptional<ZodString>;
    friends: ZodDefault<
      ZodRecord<
        ZodString,
        ZodObject<
          {
            autonomy: ZodDefault<
              ZodEnum<{
                "notify-only": "notify-only";
                bounded: "bounded";
                extended: "extended";
              }>
            >;
            ed25519PublicKey: ZodString;
            x25519PublicKey: ZodString;
            keyEpoch: ZodNumber;
            safetyNumberChanged: ZodDefault<ZodBoolean>;
          },
          $strict
        >
      >
    >;
    requestPolicy: ZodDefault<
      ZodEnum<{
        open: "open";
        "code-only": "code-only";
        "friends-of-friends": "friends-of-friends";
      }>
    >;
    dmPolicy: ZodDefault<ZodLiteral<"pairing">>;
    allowFrom: ZodDefault<ZodArray<ZodString>>;
  },
  $strict
>;
type ReefChannelConfig = output<typeof ReefChannelConfigSchema>;
type ReefFriendConfig = output<typeof ReefFriendSchema>;
type ReefCoreConfig = {
  channels?: {
    reef?: Partial<ReefChannelConfig>;
  };
  commands?: {
    useAccessGroups?: boolean;
  };
  session?: {
    store?: string;
  };
};
declare function resolveReefConfig(cfg: ReefCoreConfig): ReefChannelConfig;
declare function normalizeReefTarget(raw: string): string | undefined;
declare function autonomyBudget(autonomy: ReefFriendConfig["autonomy"]): {
  notifyOnly: boolean;
  botLoopProtection: {
    enabled: true;
    maxEventsPerWindow: number;
    windowSeconds: number;
    cooldownSeconds: number;
  };
};
//#endregion
export {
  ReefFriendSchema as a,
  resolveReefConfig as c,
  ReefFriendConfig as i,
  ReefChannelConfigSchema as n,
  autonomyBudget as o,
  ReefCoreConfig as r,
  normalizeReefTarget as s,
  ReefChannelConfig as t,
};
