import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { i as modelKey } from "./model-selection-normalize-BoKGJiBx.js";
import {
  i as readPromotionClaims,
  n as markPromotionSlugsNotified,
  r as maybeRefreshPromotionsFeed,
  t as listLivePromotionEntries,
} from "./promotions-feed-D5HxW60S.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
//#region src/commands/models/list.promotions.ts
/** Promotion decorations for `models list`: claim tags + passive discovery. */
const PROMOTIONS_SECTION_MAX_ENTRIES = 3;
/**
 * Tag configured rows that were registered by `promos claim`, flipping to
 * "promo ended" once the window passes so users learn why a model stopped
 * serving. Reads only local provenance; never the network.
 */
function applyPromotionClaimTags(rows, nowMs = Date.now()) {
  const claims = readPromotionClaims();
  if (claims.length === 0) return;
  const endsByKey = /* @__PURE__ */ new Map();
  for (const claim of claims)
    for (const key of claim.modelKeys) {
      const prev = endsByKey.get(key);
      if (prev === void 0 || claim.endsAtMs > prev) endsByKey.set(key, claim.endsAtMs);
    }
  for (const row of rows) {
    const endsAtMs = endsByKey.get(row.key);
    if (endsAtMs === void 0) continue;
    row.tags.push(endsAtMs < nowMs ? "promo ended" : "promo");
  }
}
function canonicalPromotionModelKey(entry, modelRef) {
  const provider = entry.provider?.trim();
  const prefix = provider ? `${provider}/` : "";
  if (!provider || !modelRef.startsWith(prefix) || modelRef.length <= prefix.length) return;
  return modelKey(provider, modelRef.slice(prefix.length));
}
/**
 * Passive discovery: cadence-gated feed refresh (fail-silent), an
 * "Available via promotion" group for live offers whose models are not
 * configured yet, and a one-time notice per newly seen offer. Callers gate
 * machine outputs (`--json`/`--plain`) — this only ever writes human text.
 * `configuredKeys` must be the user's configured model set, not the
 * rendered rows — filtered or `--all` listings show a different set.
 */
async function printAvailablePromotionsSection(params) {
  const nowMs = params.nowMs ?? Date.now();
  const state = await maybeRefreshPromotionsFeed({ nowMs });
  const live = listLivePromotionEntries(state, nowMs);
  if (live.length === 0) return;
  const unclaimed = live.filter((entry) =>
    entry.models.some((model) => {
      const key = canonicalPromotionModelKey(entry, model.modelRef);
      return key !== void 0 && !params.configuredKeys.has(key);
    }),
  );
  const { runtime } = params;
  const safe = sanitizeTerminalText;
  if (unclaimed.length > 0) {
    runtime.log("");
    runtime.log("Available via promotion:");
    for (const entry of unclaimed.slice(0, PROMOTIONS_SECTION_MAX_ENTRIES)) {
      const sponsor = entry.sponsor ? ` — ${safe(entry.sponsor)}` : "";
      runtime.log(
        `  ${safe(entry.title)}${sponsor} (ends ${new Date(entry.endsAt).toLocaleDateString()})`,
      );
      for (const model of entry.models) {
        const alias = model.alias ? ` (${safe(model.alias)})` : "";
        runtime.log(`    · ${safe(model.modelRef)}${alias}`);
      }
      runtime.log(`    Claim: ${formatCliCommand(`openclaw promos claim ${safe(entry.slug)}`)}`);
    }
    if (unclaimed.length > PROMOTIONS_SECTION_MAX_ENTRIES) {
      const more = unclaimed.length - PROMOTIONS_SECTION_MAX_ENTRIES;
      runtime.log(`  …and ${more} more: ${formatCliCommand("openclaw promos list")}`);
    }
  }
  const unseen = live.filter((entry) => !state.notifiedSlugs.has(entry.slug));
  if (unseen.length > 0) {
    runtime.log("");
    runtime.log(
      `🎁 New promotional model offers available — ${formatCliCommand("openclaw promos list")} for details.`,
    );
    markPromotionSlugsNotified(unseen.map((entry) => entry.slug));
  }
}
//#endregion
export { applyPromotionClaimTags, printAvailablePromotionsSection };
