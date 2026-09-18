import { i as resolveBrowserExecutableForPlatform } from "../../chrome.executables-BBruraW5.js";
import { t as note } from "../../note-BuuUITi2.js";
import { i as OpenClawConfig } from "../../types.openclaw-DDo8sH3F.js";
//#region extensions/browser/src/doctor-browser.d.ts
/** Legacy managed clawd profile paths that can be archived by doctor --fix. */
type LegacyClawdBrowserProfileResidue = {
  legacyProfileDir: string;
  legacyUserDataDir: string;
  canonicalUserDataDir: string;
};
type BrowserDoctorFilesystemDeps = {
  configDir?: string;
  pathExists?: (targetPath: string) => boolean;
  movePathToTrash?: (targetPath: string) => Promise<string>;
};
/** Detects unmanaged legacy clawd browser profile residue on disk. */
declare function detectLegacyClawdBrowserProfileResidue(
  cfg: OpenClawConfig,
  deps?: BrowserDoctorFilesystemDeps,
): LegacyClawdBrowserProfileResidue | null;
/** Emits Browser doctor notes for Chrome MCP, managed Chrome, and legacy residue readiness. */
declare function noteChromeMcpBrowserReadiness(
  cfg: OpenClawConfig,
  deps?: {
    platform?: NodeJS.Platform;
    noteFn?: typeof note;
    env?: NodeJS.ProcessEnv;
    getUid?: () => number;
    resolveManagedExecutable?: typeof resolveBrowserExecutableForPlatform;
    resolveChromeExecutable?: (platform: NodeJS.Platform) => {
      path: string;
    } | null;
    readVersion?: (executablePath: string) => string | null;
    configDir?: string;
    pathExists?: (targetPath: string) => boolean;
    homeDir?: string;
  },
): Promise<void>;
/** Archives legacy clawd browser profile residue when doctor --fix is requested. */
declare function maybeArchiveLegacyClawdBrowserProfileResidue(
  cfg: OpenClawConfig,
  deps?: BrowserDoctorFilesystemDeps,
): Promise<{
  changes: string[];
  warnings: string[];
}>;
//#endregion
export {
  type LegacyClawdBrowserProfileResidue,
  detectLegacyClawdBrowserProfileResidue,
  maybeArchiveLegacyClawdBrowserProfileResidue,
  noteChromeMcpBrowserReadiness,
};
