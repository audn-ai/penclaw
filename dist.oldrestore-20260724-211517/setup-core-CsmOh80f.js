import fs from "node:fs/promises";
import path from "node:path";
import {
  c as resolveMergedAccountConfig,
  t as createAccountListHelpers,
} from "./account-helpers-BAtt8fRD.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { t as createSetupTranslator } from "./i18n-BDUMKn0X.js";
import "./temp-path-DYqJUh96.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { i as createPatchedAccountSetupAdapter } from "./setup-helpers-Dl0hnWtQ.js";
import { a as createDelegatedSetupWizardProxy } from "./setup-wizard-proxy-DIVPLm_0.js";
import "./setup-runtime-ByFHbls2.js";
import "./account-resolution-DijsTQIy.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/zalouser/src/accounts.ts
const loadZalouserAccountsRuntime = createLazyRuntimeModule(() => import("./accounts.runtime.js"));
const {
  listAccountIds: listZalouserAccountIds,
  resolveDefaultAccountId: resolveDefaultZalouserAccountId,
} = createAccountListHelpers("zalouser", {
  implicitDefaultAccount: {
    channelKeys: ["profile"],
    envVars: ["ZALOUSER_PROFILE", "ZCA_PROFILE"],
  },
});
function mergeZalouserAccountConfig(cfg, accountId) {
  const merged = resolveMergedAccountConfig({
    channelConfig: cfg.channels?.zalouser,
    accounts: cfg.channels?.zalouser?.accounts,
    accountId,
    omitKeys: ["defaultAccount"],
  });
  return {
    ...merged,
    groupPolicy: merged.groupPolicy ?? "allowlist",
  };
}
function resolveProfile(config, accountId) {
  if (config.profile?.trim()) return config.profile.trim();
  if (process.env.ZALOUSER_PROFILE?.trim()) return process.env.ZALOUSER_PROFILE.trim();
  if (process.env.ZCA_PROFILE?.trim()) return process.env.ZCA_PROFILE.trim();
  if (accountId !== "default") return accountId;
  return "default";
}
function resolveZalouserAccountBase(params) {
  const accountId = normalizeAccountId(
    params.accountId ?? resolveDefaultZalouserAccountId(params.cfg),
  );
  const baseEnabled = params.cfg.channels?.zalouser?.enabled !== false;
  const merged = mergeZalouserAccountConfig(params.cfg, accountId);
  return {
    accountId,
    enabled: baseEnabled && merged.enabled !== false,
    merged,
    profile: resolveProfile(merged, accountId),
  };
}
function resolveZalouserAccountSync(params) {
  const { accountId, enabled, merged, profile } = resolveZalouserAccountBase(params);
  return {
    accountId,
    name: normalizeOptionalString(merged.name),
    enabled,
    profile,
    authenticated: false,
    config: merged,
  };
}
async function checkZcaAuthenticated(profile, options) {
  return await (await loadZalouserAccountsRuntime()).checkZaloAuthenticated(profile, options);
}
//#endregion
//#region extensions/zalouser/src/qr-temp-file.ts
async function writeQrDataUrlToTempFile(qrDataUrl, profile) {
  const base64 = (qrDataUrl.trim().match(/^data:image\/png;base64,(.+)$/i)?.[1] ?? "").trim();
  if (!base64) return null;
  const safeProfile = profile.replace(/[^a-zA-Z0-9_-]+/g, "-") || "default";
  const filePath = path.join(
    resolvePreferredOpenClawTmpDir(),
    `openclaw-zalouser-qr-${safeProfile}.png`,
  );
  await fs.writeFile(filePath, Buffer.from(base64, "base64"));
  return filePath;
}
//#endregion
//#region extensions/zalouser/src/setup-core.ts
const t = createSetupTranslator();
const channel = "zalouser";
const zalouserSetupAdapter = createPatchedAccountSetupAdapter({
  channelKey: channel,
  validateInput: () => null,
  buildPatch: () => ({}),
});
function createZalouserSetupWizardProxy(loadWizard) {
  return createDelegatedSetupWizardProxy({
    channel,
    loadWizard,
    status: {
      configuredLabel: t("wizard.channels.statusLoggedIn"),
      unconfiguredLabel: t("wizard.channels.statusNeedsQrLogin"),
      configuredHint: t("wizard.channels.statusRecommendedLoggedIn"),
      unconfiguredHint: t("wizard.channels.statusRecommendedQrLogin"),
      configuredScore: 1,
      unconfiguredScore: 15,
    },
    credentials: [],
    delegatePrepare: true,
    delegateFinalize: true,
  });
}
//#endregion
export {
  listZalouserAccountIds as a,
  checkZcaAuthenticated as i,
  zalouserSetupAdapter as n,
  resolveDefaultZalouserAccountId as o,
  writeQrDataUrlToTempFile as r,
  resolveZalouserAccountSync as s,
  createZalouserSetupWizardProxy as t,
};
