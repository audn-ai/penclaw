import {
  c as resolveMergedAccountConfig,
  t as createAccountListHelpers,
} from "./account-helpers-BAtt8fRD.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as resolveAccountEntry } from "./account-lookup-DgErwy8P.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import "./routing-CwvmVRHd.js";
import "./account-resolution-DijsTQIy.js";
//#region extensions/imessage/src/accounts.ts
const { listAccountIds, resolveDefaultAccountId } = createAccountListHelpers("imessage", {
  implicitDefaultAccount: { channelKeys: ["cliPath", "dbPath"] },
});
const listIMessageAccountIds = listAccountIds;
const resolveDefaultIMessageAccountId = resolveDefaultAccountId;
function resolveIMessageAccountConfig(cfg, accountId) {
  return resolveAccountEntry(cfg.channels?.imessage?.accounts, accountId);
}
function asStreamingConfigObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function mergeIMessageStreamingConfig(base, account) {
  const baseConfig = asStreamingConfigObject(base);
  const accountConfig = asStreamingConfigObject(account);
  if (!baseConfig || !accountConfig) return accountConfig ?? baseConfig;
  return {
    ...baseConfig,
    ...accountConfig,
    ...(baseConfig.block || accountConfig.block
      ? {
          block: {
            ...baseConfig.block,
            ...accountConfig.block,
            ...(baseConfig.block?.coalesce || accountConfig.block?.coalesce
              ? {
                  coalesce: {
                    ...baseConfig.block?.coalesce,
                    ...accountConfig.block?.coalesce,
                  },
                }
              : {}),
          },
        }
      : {}),
  };
}
function mergeIMessageAccountConfig(cfg, accountId) {
  const accountConfig = resolveIMessageAccountConfig(cfg, accountId);
  const merged = resolveMergedAccountConfig({
    channelConfig: cfg.channels?.imessage,
    accounts: cfg.channels?.imessage?.accounts,
    accountId,
  });
  const streaming = mergeIMessageStreamingConfig(
    cfg.channels?.imessage?.streaming,
    accountConfig?.streaming,
  );
  return streaming !== void 0
    ? {
        ...merged,
        streaming,
      }
    : merged;
}
function resolveIMessageAccount(params) {
  const accountId = normalizeAccountId(
    params.accountId ?? resolveDefaultIMessageAccountId(params.cfg),
  );
  const baseEnabled = params.cfg.channels?.imessage?.enabled !== false;
  const merged = mergeIMessageAccountConfig(params.cfg, accountId);
  const accountEnabled = merged.enabled !== false;
  const configured = Boolean(
    merged.cliPath?.trim() ||
    merged.dbPath?.trim() ||
    merged.service ||
    merged.sendTransport ||
    merged.region?.trim() ||
    (merged.allowFrom && merged.allowFrom.length > 0) ||
    (merged.groupAllowFrom && merged.groupAllowFrom.length > 0) ||
    merged.dmPolicy ||
    merged.groupPolicy ||
    typeof merged.includeAttachments === "boolean" ||
    (merged.attachmentRoots && merged.attachmentRoots.length > 0) ||
    (merged.remoteAttachmentRoots && merged.remoteAttachmentRoots.length > 0) ||
    typeof merged.mediaMaxMb === "number" ||
    typeof merged.textChunkLimit === "number" ||
    (merged.groups && Object.keys(merged.groups).length > 0),
  );
  return {
    accountId,
    enabled: baseEnabled && accountEnabled,
    name: normalizeOptionalString(merged.name),
    config: merged,
    configured,
  };
}
function normalizeIMessageCliPath(value) {
  return value?.trim() || "imsg";
}
function normalizeIMessageDbPath(value) {
  return value?.trim() ?? "";
}
function resolveIMessageAccountSourceSignature(account) {
  return JSON.stringify([
    normalizeIMessageCliPath(account.config.cliPath),
    normalizeIMessageDbPath(account.config.dbPath),
  ]);
}
function resolveIMessageAccountSourceOwner(params) {
  let defaultOwner;
  for (const candidateAccountId of listIMessageAccountIds(params.cfg)) {
    const candidate = resolveIMessageAccount({
      cfg: params.cfg,
      accountId: candidateAccountId,
    });
    if (!candidate.enabled) continue;
    if (resolveIMessageAccountSourceSignature(candidate) !== params.signature) continue;
    if (candidate.accountId === "default") {
      defaultOwner ??= candidate.accountId;
      continue;
    }
    return candidate.accountId;
  }
  return defaultOwner;
}
/**
 * Returns the owner account id when `account` is an enabled duplicate of
 * another enabled account that targets the same local Messages source. Used
 * by the iMessage gateway lifecycle to skip starting redundant `imsg rpc`
 * watchers (openclaw/openclaw#65141) without otherwise marking the duplicate
 * disabled — outbound selection, status surfaces, and capability listings
 * keep treating both accounts normally.
 */
function resolveIMessageDuplicateSourceOwner(params) {
  if (!params.account.enabled) return;
  const owner = resolveIMessageAccountSourceOwner({
    cfg: params.cfg,
    signature: resolveIMessageAccountSourceSignature(params.account),
  });
  return owner && owner !== params.account.accountId ? owner : void 0;
}
function listEnabledIMessageAccounts(cfg) {
  return listIMessageAccountIds(cfg)
    .map((accountId) =>
      resolveIMessageAccount({
        cfg,
        accountId,
      }),
    )
    .filter((account) => account.enabled);
}
function collectIMessageDuplicateAccountSourceWarnings(params) {
  const groups = /* @__PURE__ */ new Map();
  for (const accountId of listIMessageAccountIds(params.cfg)) {
    const account = resolveIMessageAccount({
      cfg: params.cfg,
      accountId,
    });
    if (!account.enabled) continue;
    const signature = resolveIMessageAccountSourceSignature(account);
    const existing = groups.get(signature);
    if (existing) existing.push(account);
    else groups.set(signature, [account]);
  }
  const warnings = [];
  for (const collisions of groups.values()) {
    if (collisions.length < 2) continue;
    const firstCollision = expectDefined(collisions[0], "duplicate iMessage account source");
    const ownerId = resolveIMessageAccountSourceOwner({
      cfg: params.cfg,
      signature: resolveIMessageAccountSourceSignature(firstCollision),
    });
    const owner = collisions.find((a) => a.accountId === ownerId) ?? firstCollision;
    const dupIds = collisions
      .filter((a) => a.accountId !== owner.accountId)
      .map((a) => `"${a.accountId}"`)
      .join(", ");
    const cliPath = normalizeIMessageCliPath(owner.config.cliPath);
    const dbPath = normalizeIMessageDbPath(owner.config.dbPath);
    const where = dbPath ? `cliPath=${cliPath}, dbPath=${dbPath}` : `cliPath=${cliPath}`;
    warnings.push(
      `- channels.imessage: accounts "${owner.accountId}" and ${dupIds} watch the same local Messages source (${where}). OpenClaw runs one watcher (owner: "${owner.accountId}") and idles the duplicate; the other accounts stay enabled for outbound sends and status. Inbound messages arrive tagged with accountId="${owner.accountId}", so bindings pinned to ${dupIds} should be re-pointed at "${owner.accountId}" (or set "enabled": false on "${owner.accountId}" to flip ownership). Set "enabled": false on the unused duplicates to silence this warning.`,
    );
  }
  return warnings;
}
//#endregion
export {
  resolveIMessageAccount as a,
  resolveDefaultIMessageAccountId as i,
  listEnabledIMessageAccounts as n,
  resolveIMessageDuplicateSourceOwner as o,
  listIMessageAccountIds as r,
  collectIMessageDuplicateAccountSourceWarnings as t,
};
