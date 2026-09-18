import { t as readChannelIngressStoreAllowFromForDmPolicy } from "./store-allow-from-Cwd6erbH.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/channels/message-access/dm-allow-state.ts
/**
 * Direct-message allowlist audit state.
 *
 * Merges configured and persisted allowFrom entries for setup/status prompts.
 */
async function resolveDmAllowAuditState(params) {
  const configAllowFrom = normalizeStringEntries(
    Array.isArray(params.allowFrom) ? params.allowFrom : void 0,
  );
  const hasWildcard = configAllowFrom.includes("*");
  const storeAllowFrom = await readChannelIngressStoreAllowFromForDmPolicy({
    provider: params.provider,
    accountId: params.accountId,
    dmPolicy: params.dmPolicy,
    readStore: params.readStore,
  });
  const normalizeEntry = params.normalizeEntry ?? ((value) => value);
  const normalizedCfg = normalizeStringEntries(
    configAllowFrom.filter((value) => value !== "*").map((value) => normalizeEntry(value)),
  );
  const normalizedStore = normalizeStringEntries(
    storeAllowFrom.map((value) => normalizeEntry(value)),
  );
  const allowCount = /* @__PURE__ */ new Set([...normalizedCfg, ...normalizedStore]).size;
  return {
    configAllowFrom,
    hasWildcard,
    allowCount,
    isMultiUserDm: hasWildcard || allowCount > 1,
  };
}
//#endregion
export { resolveDmAllowAuditState as t };
