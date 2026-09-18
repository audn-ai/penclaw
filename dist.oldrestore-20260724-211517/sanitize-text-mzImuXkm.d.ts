//#region src/infra/outbound/protocol-scaffolding.d.ts
declare function stripInternalRuntimeScaffolding(text: string): string;
//#endregion
//#region src/infra/outbound/sanitize-text.d.ts
/**
 * Convert common HTML tags to their plain-text/lightweight-markup equivalents
 * and strip anything that remains.
 *
 * The function is intentionally conservative — it only targets tags that models
 * are known to produce and avoids false positives on angle brackets in normal
 * prose (e.g. `a < b`).
 */
declare function sanitizeForPlainText(
  text: string,
  options?: {
    style?: "markdown";
  },
): string;
//#endregion
export { stripInternalRuntimeScaffolding as n, sanitizeForPlainText as t };
