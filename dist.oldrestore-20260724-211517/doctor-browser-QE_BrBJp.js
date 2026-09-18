import fs from "node:fs";
import path from "node:path";
import { r as loadBundledPluginPublicSurfaceModuleSync } from "./facade-loader-KNgtRNDP.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { d as resolveConfigDir } from "./utils-DtcDeqWS.js";
//#region src/commands/doctor-browser.ts
/** Facade-backed doctor checks and cleanup for bundled browser plugin state. */
function loadBrowserDoctorSurface() {
  return loadBundledPluginPublicSurfaceModuleSync({
    dirName: "browser",
    artifactBasename: "browser-doctor.js",
  });
}
function mayHaveLegacyClawdBrowserProfileResidue(deps) {
  const configDir = deps?.configDir ?? resolveConfigDir(deps?.env ?? process.env);
  const legacyProfileDir = path.join(configDir, "browser", "clawd");
  const legacyUserDataDir = path.join(legacyProfileDir, "user-data");
  const pathExists = deps?.pathExists ?? fs.existsSync;
  try {
    return pathExists(legacyProfileDir) || pathExists(legacyUserDataDir);
  } catch {
    return true;
  }
}
/** Emits browser readiness notes through the bundled browser plugin doctor surface. */
async function noteChromeMcpBrowserReadiness(cfg, deps) {
  try {
    await loadBrowserDoctorSurface().noteChromeMcpBrowserReadiness(cfg, deps);
  } catch (error) {
    (deps?.noteFn ?? note)(
      `- Browser health check is unavailable: ${error instanceof Error ? error.message : String(error)}`,
      "Browser",
    );
  }
}
/** Detects old clawd browser profile residue without loading plugin cleanup when paths are absent. */
async function detectLegacyClawdBrowserProfileResidue(cfg, deps) {
  if (!mayHaveLegacyClawdBrowserProfileResidue(deps)) return null;
  const detect = loadBrowserDoctorSurface().detectLegacyClawdBrowserProfileResidue;
  if (!detect) return null;
  return detect(cfg, deps);
}
/** Archives legacy clawd browser profile residue through the browser plugin repair hook. */
async function maybeArchiveLegacyClawdBrowserProfileResidue(cfg, deps) {
  if (!mayHaveLegacyClawdBrowserProfileResidue(deps))
    return {
      changes: [],
      warnings: [],
    };
  try {
    const repair = loadBrowserDoctorSurface().maybeArchiveLegacyClawdBrowserProfileResidue;
    if (!repair)
      return {
        changes: [],
        warnings: [],
      };
    return await repair(cfg, deps);
  } catch (error) {
    return {
      changes: [],
      warnings: [
        `Browser profile cleanup is unavailable: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}
//#endregion
export {
  maybeArchiveLegacyClawdBrowserProfileResidue as n,
  noteChromeMcpBrowserReadiness as r,
  detectLegacyClawdBrowserProfileResidue as t,
};
