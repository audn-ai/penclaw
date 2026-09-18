import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CPEPIvCK.js";
import { t as buildPairingReply } from "./pairing-messages-DwLSgJ3x.js";
//#region src/pairing/pairing-challenge.ts
async function runPairingRequestedHook(params) {
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("channel_pairing_requested")) return;
  await hookRunner.runChannelPairingRequested(
    {
      channel: params.channel,
      accountId: params.accountId,
      senderId: params.senderId,
      code: params.code,
      metadata: params.meta,
    },
    {
      channelId: params.channel,
      accountId: params.accountId,
      senderId: params.senderId,
    },
  );
}
/**
 * Shared pairing challenge issuance for DM pairing policy pathways.
 * Ensures every channel follows the same create-if-missing + reply flow.
 */
async function issuePairingChallenge(params) {
  const { code, created } = await params.upsertPairingRequest({
    id: params.senderId,
    meta: params.meta,
  });
  if (!created) return { created: false };
  params.onCreated?.({ code });
  const accountId = params.accountId ? normalizeAccountId(params.accountId) : void 0;
  runPairingRequestedHook({
    channel: params.channel,
    accountId,
    senderId: params.senderId,
    code,
    meta: params.meta,
  }).catch(() => void 0);
  const replyText =
    params.buildReplyText?.({
      code,
      senderIdLine: params.senderIdLine,
    }) ??
    buildPairingReply({
      channel: params.channel,
      idLine: params.senderIdLine,
      code,
    });
  try {
    await params.sendPairingReply(replyText);
  } catch (err) {
    params.onReplyError?.(err);
  }
  return {
    created: true,
    code,
  };
}
//#endregion
export { issuePairingChallenge as t };
