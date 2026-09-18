//#region src/plugin-sdk/webhook-path.d.ts
/**
 * @deprecated Compatibility subpath. Import webhook path helpers from
 * `openclaw/plugin-sdk/webhook-ingress` instead.
 */
/**
 * Normalizes plugin webhook paths to an absolute path without a trailing slash.
 * Empty values resolve to `/` so route registration and request matching use the
 * same canonical key.
 *
 * @deprecated Import from `openclaw/plugin-sdk/webhook-ingress` instead.
 */
declare function normalizeWebhookPath(raw: string): string;
/**
 * Resolves a webhook path from explicit path config, then URL pathname, then
 * caller default. Invalid webhook URLs resolve to `null` instead of guessing.
 *
 * @deprecated Import from `openclaw/plugin-sdk/webhook-ingress` instead.
 */
declare function resolveWebhookPath(params: {
  webhookPath?: string;
  webhookUrl?: string;
  defaultPath?: string | null;
}): string | null;
//#endregion
export { resolveWebhookPath as n, normalizeWebhookPath as t };
