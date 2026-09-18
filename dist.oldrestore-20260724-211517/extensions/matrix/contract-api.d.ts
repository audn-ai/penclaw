import {
  r as matrixSetupAdapter,
  t as matrixOnboardingAdapter,
} from "../../setup-surface-B-N9RBlG.js";

//#region extensions/matrix/src/setup-contract.d.ts
declare const singleAccountKeysToMove: (
  | "replyToMode"
  | "deviceId"
  | "dm"
  | "responsePrefix"
  | "groups"
  | "textChunkLimit"
  | "streaming"
  | "mediaMaxMb"
  | "actions"
  | "threadBindings"
  | "reactionNotifications"
  | "ackReaction"
  | "allowBots"
  | "dangerouslyAllowNameMatching"
  | "autoJoin"
  | "ackReactionScope"
  | "avatarUrl"
  | "initialSyncLimit"
  | "encryption"
  | "allowlistOnly"
  | "threadReplies"
  | "startupVerification"
  | "startupVerificationCooldownHours"
  | "autoJoinAllowlist"
  | "rooms"
)[];
declare const namedAccountPromotionKeys: (
  | "password"
  | "name"
  | "deviceId"
  | "avatarUrl"
  | "initialSyncLimit"
  | "encryption"
  | "homeserver"
  | "userId"
  | "accessToken"
  | "deviceName"
)[];
declare function resolveSingleAccountPromotionTarget(params: {
  channel: Record<string, unknown>;
}): string;
//#endregion
export {
  matrixSetupAdapter,
  matrixOnboardingAdapter as matrixSetupWizard,
  namedAccountPromotionKeys,
  resolveSingleAccountPromotionTarget,
  singleAccountKeysToMove,
};
