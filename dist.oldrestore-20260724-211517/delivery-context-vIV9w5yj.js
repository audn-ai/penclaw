import { o as normalizeDeliveryContext } from "./delivery-context.shared-WPZGmi9R.js";
import { t as extractDeliveryInfo } from "./delivery-info-Du3-Z2RS.js";
//#region src/cron/delivery-context.ts
/** Converts live or stored session routing into cron delivery config. */
/** Converts an active delivery context into cron announce delivery config. */
function cronDeliveryFromContext(context) {
  const normalized = normalizeDeliveryContext(context);
  if (!normalized?.to) return null;
  const delivery = {
    mode: "announce",
    to: normalized.to,
  };
  if (normalized.channel) delivery.channel = normalized.channel;
  if (normalized.accountId) delivery.accountId = normalized.accountId;
  if (normalized.threadId != null) delivery.threadId = normalized.threadId;
  return delivery;
}
/** Recovers delivery context from a stored session key captured when the cron job was created. */
function resolveCronStoredDeliveryContext(params) {
  const sessionKey = params.sessionKey?.trim();
  if (!sessionKey) return;
  const { deliveryContext, threadId } = extractDeliveryInfo(sessionKey, { cfg: params.cfg });
  if (deliveryContext && threadId)
    return {
      ...deliveryContext,
      threadId,
    };
  return deliveryContext;
}
/** Resolves initial cron delivery, preferring the live context before falling back to session storage. */
function resolveCronCreationDelivery(params) {
  return (
    cronDeliveryFromContext(params.currentDeliveryContext) ??
    cronDeliveryFromContext(
      resolveCronStoredDeliveryContext({
        cfg: params.cfg,
        sessionKey: params.agentSessionKey,
      }),
    )
  );
}
//#endregion
export { resolveCronStoredDeliveryContext as n, resolveCronCreationDelivery as t };
