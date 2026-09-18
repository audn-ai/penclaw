//#region extensions/device-pair/notify-state.d.ts
declare const DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE = "device-pair-notify.json";
declare const DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE = "notify-subscribers";
declare const DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE = "notify-seen-requests";
declare const DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES = 1024;
declare const DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES = 4096;
declare const DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS: number;
type NotifySubscription = {
  to: string;
  accountId?: string;
  messageThreadId?: string | number;
  mode: "persistent" | "once";
  addedAtMs: number;
};
type NotifySeenRequest = {
  requestId: string;
  notifiedAtMs: number;
};
type LegacyNotifyStateFile = {
  subscribers: NotifySubscription[];
  notifiedRequestIds: Record<string, number>;
};
declare function normalizeLegacyNotifyState(raw: unknown): LegacyNotifyStateFile;
declare function notifySubscriberKey(subscriber: {
  to: string;
  accountId?: string;
  messageThreadId?: string | number;
}): string;
declare function notifySubscriberStoreKey(subscriber: {
  to: string;
  accountId?: string;
  messageThreadId?: string | number;
}): string;
declare function notifyRequestStoreKey(requestId: string): string;
//#endregion
export {
  DEVICE_PAIR_NOTIFY_LEGACY_STATE_FILE,
  DEVICE_PAIR_NOTIFY_MAX_SEEN_AGE_MS,
  DEVICE_PAIR_NOTIFY_SEEN_REQUEST_MAX_ENTRIES,
  DEVICE_PAIR_NOTIFY_SEEN_REQUEST_NAMESPACE,
  DEVICE_PAIR_NOTIFY_SUBSCRIBER_MAX_ENTRIES,
  DEVICE_PAIR_NOTIFY_SUBSCRIBER_NAMESPACE,
  LegacyNotifyStateFile,
  NotifySeenRequest,
  NotifySubscription,
  normalizeLegacyNotifyState,
  notifyRequestStoreKey,
  notifySubscriberKey,
  notifySubscriberStoreKey,
};
