import { d as fetchClawHubPromotions, t as ClawHubRequestError } from "./clawhub-CgGOpxts.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as markPromotionSlugsNotified } from "./promotions-feed-D5HxW60S.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
//#region src/commands/promos/list.ts
/** Lists active ClawHub promotional model offers. */
function formatWindowEnd(promotion) {
  const daysLeft = Math.max(0, Math.ceil((promotion.endsAt - Date.now()) / 864e5));
  if (daysLeft === 0) return "ends today";
  return daysLeft === 1 ? "1 day left" : `${daysLeft} days left`;
}
async function promosListCommand(opts, runtime) {
  let promotions;
  try {
    promotions = await fetchClawHubPromotions();
  } catch (error) {
    if (!(error instanceof ClawHubRequestError) || error.status !== 404) throw error;
    runtime.log(
      opts.json
        ? JSON.stringify({ promotions: [] }, null, 2)
        : "Promotions are not available from ClawHub yet.",
    );
    return;
  }
  markPromotionSlugsNotified(promotions.map((promotion) => promotion.slug));
  if (opts.json) {
    runtime.log(JSON.stringify({ promotions }, null, 2));
    return;
  }
  if (promotions.length === 0) {
    runtime.log("No active promotions right now.");
    return;
  }
  const safe = sanitizeTerminalText;
  for (const promotion of promotions) {
    const sponsor = promotion.sponsor ? ` — ${safe(promotion.sponsor)}` : "";
    runtime.log(`${safe(promotion.title)}${sponsor} (${formatWindowEnd(promotion)})`);
    runtime.log(`  ${safe(promotion.blurb)}`);
    for (const model of promotion.models) {
      const alias = model.alias ? ` (${safe(model.alias)})` : "";
      const suggested = model.suggestedDefault ? " — suggested default" : "";
      runtime.log(`  · ${safe(model.modelRef)}${alias}${suggested}`);
    }
    runtime.log(`  Claim: ${formatCliCommand(`openclaw promos claim ${safe(promotion.slug)}`)}`);
  }
}
//#endregion
export { promosListCommand };
