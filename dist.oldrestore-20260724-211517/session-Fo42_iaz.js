import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { o as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-utils-B8sNp9l4.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/channels/session.ts
const loadInboundSessionRuntime = createLazyRuntimeModule(() => import("./inbound.runtime.js"));
function shouldSkipPinnedMainDmRouteUpdate(pin) {
  if (!pin) return false;
  const owner = normalizeLowercaseStringOrEmpty(pin.ownerRecipient);
  const sender = normalizeLowercaseStringOrEmpty(pin.senderRecipient);
  if (!owner || !sender || owner === sender) return false;
  pin.onSkip?.({
    ownerRecipient: pin.ownerRecipient,
    senderRecipient: pin.senderRecipient,
  });
  return true;
}
async function recordInboundSession(params) {
  const { storePath, sessionKey, ctx, groupResolution, createIfMissing } = params;
  const canonicalSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
  const runtime = await loadInboundSessionRuntime();
  const metaTask = runtime
    .recordInboundSessionMeta({
      storePath,
      sessionKey: canonicalSessionKey,
      ctx,
      groupResolution,
      createIfMissing,
    })
    .catch(async (err) => {
      try {
        await Promise.resolve(params.onRecordError(err));
      } catch {}
    });
  params.trackSessionMetaTask?.(metaTask);
  const update = params.updateLastRoute;
  if (!update) return;
  if (shouldSkipPinnedMainDmRouteUpdate(update.mainDmOwnerPin)) return;
  const targetSessionKey = normalizeSessionKeyPreservingOpaquePeerIds(update.sessionKey);
  await runtime.updateSessionLastRoute({
    storePath,
    sessionKey: targetSessionKey,
    route: update.route,
    deliveryContext: {
      channel: update.channel,
      to: update.to,
      accountId: update.accountId,
      threadId: update.threadId,
    },
    ctx: targetSessionKey === canonicalSessionKey ? ctx : void 0,
    groupResolution,
    createIfMissing,
  });
}
//#endregion
export { recordInboundSession as t };
