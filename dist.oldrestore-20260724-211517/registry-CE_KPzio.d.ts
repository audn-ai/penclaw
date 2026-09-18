import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";
//#region src/channels/plugins/registry.d.ts
/**
 * Normalizes user-facing channel aliases to canonical channel ids.
 */
declare function normalizeChannelId(raw?: string | null): ChannelId | null;
//#endregion
export { normalizeChannelId as t };
