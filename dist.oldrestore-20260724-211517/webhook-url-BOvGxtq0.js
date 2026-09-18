import { n as isHttpUrl } from "./url-protocol-oWYinajA.js";
//#region src/cron/webhook-url.ts
/** Normalizes cron webhook URLs while rejecting empty, malformed, and non-HTTP(S) values. */
function normalizeHttpWebhookUrl(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!isHttpUrl(trimmed)) return null;
  return trimmed;
}
//#endregion
export { normalizeHttpWebhookUrl as t };
