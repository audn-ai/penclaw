import { t as DeliveryContext } from "./delivery-context.types-DyNhFIjW.js";

//#region src/infra/system-events.d.ts
type SystemEvent = {
  text: string;
  ts: number;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext;
};
type SystemEventOptions = {
  sessionKey: string;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext /** Replace the pending event for this context and delivery route. Requires contextKey. */;
  replace?: boolean;
};
declare function isSystemEventContextChanged(
  sessionKey: string,
  contextKey?: string | null,
): boolean;
declare function enqueueSystemEventEntry(
  text: string,
  options: SystemEventOptions,
): SystemEvent | null;
declare function enqueueSystemEvent(text: string, options: SystemEventOptions): boolean;
declare function drainSystemEventEntries(sessionKey: string): SystemEvent[];
declare function consumeSystemEventEntries(
  sessionKey: string,
  consumedEntries: readonly SystemEvent[],
): SystemEvent[];
declare function consumeSelectedSystemEventEntries(
  sessionKey: string,
  consumedEntries: readonly SystemEvent[],
): SystemEvent[];
declare function drainSystemEvents(sessionKey: string): string[];
declare function peekSystemEventEntries(sessionKey: string): SystemEvent[];
declare function peekSystemEvents(sessionKey: string): string[];
declare function hasSystemEvents(sessionKey: string): boolean;
declare function resolveSystemEventDeliveryContext(
  events: readonly SystemEvent[],
): DeliveryContext | undefined;
declare function resetSystemEventsForTest(): void;
//#endregion
export {
  drainSystemEvents as a,
  hasSystemEvents as c,
  peekSystemEvents as d,
  resetSystemEventsForTest as f,
  drainSystemEventEntries as i,
  isSystemEventContextChanged as l,
  consumeSelectedSystemEventEntries as n,
  enqueueSystemEvent as o,
  resolveSystemEventDeliveryContext as p,
  consumeSystemEventEntries as r,
  enqueueSystemEventEntry as s,
  SystemEvent as t,
  peekSystemEventEntries as u,
};
