import {
  At as boolean,
  Et as array,
  Ht as email,
  Nn as record,
  Qn as url,
  Rn as string,
  Tn as object,
  dn as literal,
  wn as number,
  yt as _enum,
} from "./schemas-CBJjibl3.js";
//#region extensions/reef/src/config-schema.ts
const HandleSchema = string().regex(/^[a-z0-9][a-z0-9_-]{0,62}$/);
const PublicKeySchema = string()
  .length(43)
  .regex(/^[A-Za-z0-9_-]+$/);
const ReefFriendSchema = object({
  autonomy: _enum(["notify-only", "bounded", "extended"]).default("bounded"),
  ed25519PublicKey: PublicKeySchema,
  x25519PublicKey: PublicKeySchema,
  keyEpoch: number().int().positive(),
  safetyNumberChanged: boolean().default(false),
}).strict();
const ReefChannelConfigSchema = object({
  enabled: boolean().default(true),
  relayUrl: url().default("https://reefwire.ai"),
  handle: HandleSchema.optional(),
  email: email().optional(),
  guard: object({
    provider: _enum(["anthropic", "openai"]),
    pinnedModel: string().min(1),
    apiKeyEnv: string().regex(/^[A-Z_][A-Z0-9_]*$/),
    policyVersion: string().min(1),
    timeoutMs: number().int().min(100).max(12e4),
  })
    .strict()
    .optional(),
  stateDir: string().min(1).optional(),
  friends: record(HandleSchema, ReefFriendSchema).default({}),
  requestPolicy: _enum(["code-only", "friends-of-friends", "open"]).default("code-only"),
  dmPolicy: literal("pairing").default("pairing"),
  allowFrom: array(HandleSchema).default([]),
}).strict();
function resolveReefConfig(cfg) {
  return ReefChannelConfigSchema.parse(cfg.channels?.reef ?? {});
}
function normalizeReefTarget(raw) {
  const target = raw
    .trim()
    .replace(/^(reef:|@)/i, "")
    .toLowerCase();
  return HandleSchema.safeParse(target).success ? target : void 0;
}
function autonomyBudget(autonomy) {
  return {
    notifyOnly: autonomy === "notify-only",
    botLoopProtection: {
      enabled: true,
      maxEventsPerWindow: autonomy === "extended" ? 12 : autonomy === "bounded" ? 3 : 1,
      windowSeconds: autonomy === "extended" ? 3600 : 86400,
      cooldownSeconds: 86400,
    },
  };
}
//#endregion
export {
  resolveReefConfig as a,
  normalizeReefTarget as i,
  ReefFriendSchema as n,
  autonomyBudget as r,
  ReefChannelConfigSchema as t,
};
