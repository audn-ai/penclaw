//#region extensions/browser/src/browser/system-profile-import-state.ts
const IMPORT_STATE_KEY = "onboarding";
const IMPORT_PROFILE_BASENAME = "imported";
let importStateStore;
function configureSystemProfileImportStateStore(store) {
  importStateStore = store;
}
async function readSystemProfileImportState() {
  return await importStateStore?.lookup(IMPORT_STATE_KEY);
}
async function dismissSystemProfileImportPrompt(now = Date.now()) {
  await importStateStore?.register(IMPORT_STATE_KEY, {
    version: 1,
    status: "dismissed",
    updatedAt: now,
  });
}
async function recordSystemProfileImport(params, now = Date.now()) {
  await importStateStore?.register(IMPORT_STATE_KEY, {
    version: 1,
    status: "imported",
    browser: params.browser,
    systemProfile: params.systemProfile,
    targetProfile: params.targetProfile,
    updatedAt: now,
  });
}
function resolveSuggestedImportTarget(params) {
  const names = new Set(params.profileNames);
  if (params.state?.status === "imported" && names.has(params.state.targetProfile))
    return params.state.targetProfile;
  if (!names.has(IMPORT_PROFILE_BASENAME)) return IMPORT_PROFILE_BASENAME;
  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${IMPORT_PROFILE_BASENAME}-${suffix}`;
    if (!names.has(candidate)) return candidate;
  }
}
//#endregion
export {
  resolveSuggestedImportTarget as a,
  recordSystemProfileImport as i,
  dismissSystemProfileImportPrompt as n,
  readSystemProfileImportState as r,
  configureSystemProfileImportStateStore as t,
};
