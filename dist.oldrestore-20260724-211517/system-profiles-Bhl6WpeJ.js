import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import "./process-runtime-BKNTr1ic.js";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { C as BrowserProfileUnavailableError } from "./cdp.helpers-ChuUODxP.js";
import "./tmp-openclaw-dir-BmzZqWyg.js";
import "./config-B4sqH_Om.js";
import {
  s as resolveOpenClawUserDataDir,
  u as usesOpenClawMockKeychain,
} from "./chrome-C-Qf8Isl.js";
import { t as runCommandBuffered } from "./exec-CXKmx4dL.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { n as runProfileContextOperation } from "./server-context-CkNNtaOz.js";
import {
  h as getPwAiModule,
  l as isProfileRestartRequiredError,
} from "./server-context.lifecycle-CPismpkV.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/browser/src/browser/system-chrome-cookies.ts
/** macOS Chrome-family cookie database decryption and Playwright mapping. */
const KEYCHAIN_ENTRIES = {
  chrome: {
    service: "Chrome Safe Storage",
    account: "Chrome",
  },
  brave: {
    service: "Brave Safe Storage",
    account: "Brave",
  },
  edge: {
    service: "Microsoft Edge Safe Storage",
    account: "Microsoft Edge",
  },
  chromium: {
    service: "Chromium Safe Storage",
    account: "Chromium",
  },
};
const CHROME_EPOCH_OFFSET_SECONDS = 11644473600;
const V10_PREFIX = Buffer.from("v10", "ascii");
const COOKIE_QUERY = `
  SELECT host_key, top_frame_site_key, name, value, encrypted_value, path, expires_utc,
         is_secure, is_httponly, has_expires, samesite
  FROM cookies
`;
function isAsciiWhitespace(value) {
  return (
    value === 9 || value === 10 || value === 11 || value === 12 || value === 13 || value === 32
  );
}
/** Read the browser Safe Storage secret. The OS consent prompt is intentional. */
async function readKeychainSecret(entry, signal) {
  signal?.throwIfAborted();
  let stdout;
  try {
    const result = await runCommandBuffered(
      ["security", "find-generic-password", "-w", "-s", entry.service, "-a", entry.account],
      {
        signal,
        maxOutputBytes: 1024 * 1024,
      },
    );
    if (result.termination !== "exit" || result.code !== 0)
      throw (
        result.error ??
        /* @__PURE__ */ new Error(`security exited with code ${result.code ?? "unknown"}`)
      );
    stdout = result.stdout;
  } catch (error) {
    if (signal?.aborted)
      throw signal.reason instanceof Error
        ? signal.reason
        : new Error("Browser cookie import aborted.", { cause: signal.reason ?? error });
    throw new Error(
      `could not read ${entry.service} from macOS Keychain; approve the prompt and retry`,
      { cause: error },
    );
  }
  const raw = stdout;
  let start = 0;
  let end = raw.length;
  while (start < end && isAsciiWhitespace(raw.readUInt8(start))) start += 1;
  while (end > start && isAsciiWhitespace(raw.readUInt8(end - 1))) end -= 1;
  const secret = Buffer.from(raw.subarray(start, end));
  raw.fill(0);
  if (secret.length === 0)
    throw new Error(`macOS Keychain returned an empty ${entry.service} secret`);
  return secret;
}
/** Convert Chromium's Windows-epoch microseconds to Unix seconds. */
function chromeFiletimeToUnixSeconds(value) {
  if (typeof value === "bigint") {
    const seconds = value / 1000000n - BigInt(CHROME_EPOCH_OFFSET_SECONDS);
    return seconds > 0n && seconds <= 9999999999n ? Number(seconds) : void 0;
  }
  if (!Number.isFinite(value) || value === 0) return;
  const seconds = Math.floor(value / 1e6) - CHROME_EPOCH_OFFSET_SECONDS;
  return seconds > 0 && seconds <= 9999999999 ? seconds : void 0;
}
/** Map Chrome SameSite storage values to Playwright's cookie contract. */
function mapChromeSameSite(value, secure) {
  const numericValue = Number(value);
  if (numericValue === 2) return "Strict";
  if (numericValue === 1) return "Lax";
  if (numericValue === 0 && secure) return "None";
}
function decryptCookieValue(row, key) {
  const encrypted = Buffer.from(row.encrypted_value);
  if (encrypted.length === 0) return row.value;
  if (!encrypted.subarray(0, V10_PREFIX.length).equals(V10_PREFIX)) return;
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, Buffer.alloc(16, 32));
  decipher.setAutoPadding(true);
  let plain = Buffer.concat([
    decipher.update(encrypted.subarray(V10_PREFIX.length)),
    decipher.final(),
  ]);
  const hostPrefix = crypto.createHash("sha256").update(row.host_key).digest();
  if (plain.length >= hostPrefix.length && plain.subarray(0, hostPrefix.length).equals(hostPrefix))
    plain = plain.subarray(hostPrefix.length);
  return plain.toString("utf8");
}
function mapCookie(row, value) {
  const secure = row.is_secure !== 0 && row.is_secure !== 0n;
  const expires =
    row.has_expires === 0 || row.has_expires === 0n
      ? void 0
      : chromeFiletimeToUnixSeconds(row.expires_utc);
  const sameSite = mapChromeSameSite(row.samesite, secure);
  return {
    name: row.name,
    value,
    domain: row.host_key,
    path: row.path,
    httpOnly: row.is_httponly !== 0 && row.is_httponly !== 0n,
    secure,
    ...(expires === void 0 ? {} : { expires }),
    ...(sameSite === void 0 ? {} : { sameSite }),
  };
}
function matchesDomain(hostKey, domains) {
  if (!domains?.length) return true;
  const host = hostKey.replace(/^\./, "").toLowerCase();
  return domains.some((candidate) => {
    const domain = candidate.trim().replace(/^\./, "").toLowerCase();
    return domain.length > 0 && (host === domain || host.endsWith(`.${domain}`));
  });
}
/** Decrypt and map cookie rows without exposing any cookie values in the result metadata. */
async function decryptChromeCookieRows(params) {
  const counts = {
    total: params.rows.length,
    imported: 0,
    failed: 0,
    skipped: 0,
  };
  const selected = params.rows.filter((row) => {
    if (!matchesDomain(row.host_key, params.domains)) {
      counts.skipped += 1;
      return false;
    }
    if (row.top_frame_site_key.trim().length > 0) {
      counts.skipped += 1;
      return false;
    }
    return true;
  });
  if (selected.length === 0)
    return {
      cookies: [],
      counts,
      domains: [],
    };
  const secret = await (params.readSecret ?? readKeychainSecret)(
    KEYCHAIN_ENTRIES[params.browser],
    params.signal,
  );
  let key;
  const cookies = [];
  try {
    const decryptionKey = crypto.pbkdf2Sync(secret, "saltysalt", 1003, 16, "sha1");
    key = decryptionKey;
    for (const row of selected) {
      params.signal?.throwIfAborted();
      const encrypted = Buffer.from(row.encrypted_value);
      if (encrypted.length > 0 && !encrypted.subarray(0, 3).equals(V10_PREFIX)) {
        counts.skipped += 1;
        continue;
      }
      try {
        const value = decryptCookieValue(row, decryptionKey);
        if (value === void 0) {
          counts.skipped += 1;
          continue;
        }
        cookies.push(mapCookie(row, value));
      } catch {
        counts.failed += 1;
      }
    }
  } finally {
    secret.fill(0);
    key?.fill(0);
  }
  counts.imported = cookies.length;
  return {
    cookies,
    counts,
    domains: [...new Set(cookies.map((cookie) => cookie.domain))].toSorted(),
  };
}
/** Read cookies from a copied Chromium SQLite database and decrypt them. */
async function readChromeCookiesDatabase(params) {
  const database = new DatabaseSync(params.databasePath, { readOnly: true });
  try {
    const statement = database.prepare(COOKIE_QUERY);
    statement.setReadBigInts(true);
    const rows = statement.all();
    return await decryptChromeCookieRows({
      browser: params.browser,
      rows,
      domains: params.domains,
      readSecret: params.readSecret,
      signal: params.signal,
    });
  } finally {
    database.close();
  }
}
//#endregion
//#region extensions/browser/src/browser/system-profiles.ts
/** Discovery and cookie import for macOS Chrome-family system profiles. */
const SYSTEM_BROWSER_DIRS = {
  chrome: ["Google", "Chrome"],
  brave: ["BraveSoftware", "Brave-Browser"],
  edge: ["Microsoft Edge"],
  chromium: ["Chromium"],
};
function resolveSystemBrowser(value) {
  const browser = value?.trim().toLowerCase() || "chrome";
  if (browser === "chrome" || browser === "brave" || browser === "edge" || browser === "chromium")
    return browser;
  throw new Error(`unsupported system browser "${value}"; use chrome, brave, edge, or chromium`);
}
function resolveSystemBrowserRoot(browser, homeDir = os.homedir()) {
  return path.join(homeDir, "Library", "Application Support", ...SYSTEM_BROWSER_DIRS[browser]);
}
/** Prefer Chrome's current Network/Cookies location, then its legacy location. */
function resolveSystemCookiesFile(root, profileId) {
  return [
    path.join(root, profileId, "Network", "Cookies"),
    path.join(root, profileId, "Cookies"),
  ].find((candidate) => fs.existsSync(candidate));
}
function readProfileNames(root) {
  try {
    const localState = JSON.parse(fs.readFileSync(path.join(root, "Local State"), "utf8"));
    const names = /* @__PURE__ */ new Map();
    for (const [id, info] of Object.entries(localState.profile?.info_cache ?? {})) {
      const displayName = [info.name, info.gaia_name, info.user_name].find(
        (value) => typeof value === "string" && value.trim().length > 0,
      );
      names.set(id, displayName?.trim() || id);
    }
    return names;
  } catch {
    return /* @__PURE__ */ new Map();
  }
}
const SUPPORTED_SYSTEM_BROWSERS = ["chrome", "brave", "edge", "chromium"];
function listOneBrowserProfiles(browser, homeDir) {
  const root = resolveSystemBrowserRoot(browser, homeDir);
  const names = readProfileNames(root);
  if (names.size === 0 && fs.existsSync(path.join(root, "Default")))
    names.set("Default", "Default");
  return [...names.entries()]
    .filter(([id]) => id === "Default" || /^Profile \d+$/.test(id))
    .map(([id, name]) => ({
      browser,
      id,
      name,
      hasCookies: resolveSystemCookiesFile(root, id) !== void 0,
    }))
    .toSorted((a, b) => a.id.localeCompare(b.id, void 0, { numeric: true }));
}
/**
 * Enumerate importable Chrome-family profiles without reading the Keychain. With
 * no browser specified, list every supported browser so discovery matches the
 * Chrome-family import support instead of assuming Chrome.
 */
function listSystemProfiles(browserInput, deps = {}) {
  return (
    browserInput?.trim() ? [resolveSystemBrowser(browserInput)] : SUPPORTED_SYSTEM_BROWSERS
  ).flatMap((browser) => listOneBrowserProfiles(browser, deps.homeDir));
}
/** Create a transactionally coherent snapshot while Chrome may be writing its WAL. */
function snapshotCookieDatabase(source) {
  const tmpRoot = resolvePreferredOpenClawTmpDir();
  fs.mkdirSync(tmpRoot, { recursive: true });
  const tempDir = fs.mkdtempSync(path.join(tmpRoot, "openclaw-system-cookies-"));
  const databasePath = path.join(tempDir, "Cookies");
  const sourceDatabase = new DatabaseSync(source, { readOnly: true });
  try {
    sourceDatabase.exec("PRAGMA busy_timeout = 5000");
    sourceDatabase.prepare("VACUUM INTO ?").run(databasePath);
  } catch (error) {
    fs.rmSync(tempDir, {
      recursive: true,
      force: true,
    });
    throw error;
  } finally {
    sourceDatabase.close();
  }
  return {
    databasePath,
    cleanup: () =>
      fs.rmSync(tempDir, {
        recursive: true,
        force: true,
      }),
  };
}
/** Import decrypted system-profile cookies into one managed OpenClaw profile. */
async function importSystemProfileCookies(params, runtime, deps = {}) {
  if ((deps.platform ?? process.platform) !== "darwin")
    throw new Error("system profile import is only supported on macOS in this release");
  if ((deps.cfg ?? getRuntimeConfig()).browser?.allowSystemProfileImport === false)
    throw new Error("system profile import is disabled (browser.allowSystemProfileImport=false)");
  const browser = resolveSystemBrowser(params.browser);
  const systemProfile = params.systemProfile?.trim() || "Default";
  const into = params.into?.trim() || "imported";
  const sourceProfile = listSystemProfiles(browser, { homeDir: deps.homeDir }).find(
    (profile) => profile.id === systemProfile,
  );
  if (!sourceProfile)
    throw new Error(`system browser profile "${systemProfile}" was not found for ${browser}`);
  const cookiesFile = resolveSystemCookiesFile(
    resolveSystemBrowserRoot(browser, deps.homeDir),
    sourceProfile.id,
  );
  if (!cookiesFile)
    throw new Error(`cookies database not found for ${browser} profile "${systemProfile}"`);
  if (!(into in runtime.ctx.state().resolved.profiles))
    await runtime.createProfile({
      name: into,
      driver: "openclaw",
    });
  const profileCtx = runtime.ctx.forProfile(into);
  if (
    profileCtx.profile.driver !== "openclaw" ||
    !profileCtx.profile.cdpIsLoopback ||
    profileCtx.profile.attachOnly
  )
    throw new Error(
      `profile "${into}" is not a locally managed OpenClaw profile; import into a fresh profile name`,
    );
  for (let attempt = 0; attempt < 2; attempt += 1)
    try {
      return await runProfileContextOperation(
        profileCtx,
        runtime.signal,
        async (signal, profileRuntime) => {
          await profileCtx.ensureBrowserAvailable({
            headless: true,
            signal,
          });
          const userDataDir = resolveOpenClawUserDataDir(into);
          const runningUserDataDir = profileRuntime.running?.userDataDir;
          if (!runningUserDataDir || path.resolve(runningUserDataDir) !== path.resolve(userDataDir))
            throw new Error(
              `managed profile "${into}" is not owned by this OpenClaw browser runtime; stop it and import into a fresh profile name`,
            );
          if (!usesOpenClawMockKeychain(userDataDir))
            throw new Error(
              `managed profile "${into}" does not use the OpenClaw mock keychain; import into a fresh profile name`,
            );
          const copied = snapshotCookieDatabase(cookiesFile);
          try {
            const decrypted = await readChromeCookiesDatabase({
              browser,
              databasePath: copied.databasePath,
              domains: params.domains,
              readSecret: deps.readSecret,
              signal,
            });
            signal.throwIfAborted();
            const pw = await getPwAiModule({ mode: "strict" });
            if (!pw) throw new Error("Playwright is required to import system profile cookies");
            let injected = 0;
            if (decrypted.cookies.length > 0) {
              const tab = await profileCtx.ensureTabAvailable(void 0, {
                allowPlaywrightFallback: true,
                signal,
              });
              try {
                const result = await pw.cookiesSetManyViaPlaywright({
                  cdpUrl: profileCtx.profile.cdpUrl,
                  targetId: tab.targetId,
                  cookies: decrypted.cookies,
                  signal,
                });
                signal.throwIfAborted();
                injected = result.added;
              } catch {
                throw new Error(`failed to inject imported cookies into managed profile "${into}"`);
              }
            }
            const rejected = decrypted.cookies.length - injected;
            return {
              ok: true,
              systemProfile,
              into,
              browser,
              cookies: {
                total: decrypted.counts.total,
                imported: injected,
                failed: decrypted.counts.failed + rejected,
                skipped: decrypted.counts.skipped,
              },
              domains: decrypted.domains,
            };
          } finally {
            copied.cleanup();
          }
        },
        { commit: async (result) => await runtime.finalize?.(result) },
      );
    } catch (err) {
      if (isProfileRestartRequiredError(err)) {
        if (attempt === 0) {
          await profileCtx.ensureBrowserAvailable({
            headless: true,
            signal: runtime.signal,
          });
          continue;
        }
        throw new BrowserProfileUnavailableError(
          `Managed profile "${into}" could not stabilize for cookie import.`,
        );
      }
      throw err;
    }
  throw new Error(`managed profile "${into}" could not stabilize for cookie import`);
}
//#endregion
export { listSystemProfiles as n, importSystemProfileCookies as t };
