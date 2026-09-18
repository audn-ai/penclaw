import { isDeepStrictEqual } from "node:util";
import { t as parseBrowserHttpUrl } from "./browser-config-BYZ1IWa3.js";
import {
  O as BrowserValidationError,
  T as BrowserResourceExhaustedError,
  b as BrowserConflictError,
  n as assertCdpEndpointAllowed,
} from "./cdp.helpers-ChuUODxP.js";
import { t as mutateConfigFile } from "./config-BDv-QbJ6.js";
import {
  d as deriveDefaultBrowserCdpPortRange,
  n as getOwnBrowserProfile,
  r as resolveBrowserConfig,
} from "./config-CzdiqFrD.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import "./errors-CZhWrgPb.js";
import "./config-B4sqH_Om.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
//#region extensions/browser/src/browser/profiles.ts
/**
 * Browser profile allocation helpers.
 *
 * Validates profile names and allocates CDP ports/colors for newly persisted
 * browser profiles.
 */
/**
 * CDP port allocation for browser profiles.
 *
 * Default port range: 18800-18899 (100 profiles max)
 * Ports are allocated once at profile creation and persisted in config.
 * Multi-instance: callers may pass an explicit range to avoid collisions.
 *
 * Reserved ports (do not use for CDP):
 *   18789 - Gateway WebSocket
 *   18790 - Bridge
 *   18791 - Browser control server
 *   18792-18799 - Reserved for future one-off services (canvas at 18793)
 */
/** Default first CDP port for browser profiles. */
const CDP_PORT_RANGE_START = 18800;
/** Default last CDP port for browser profiles. */
const CDP_PORT_RANGE_END = 18899;
const MAX_TCP_PORT = 65535;
const PROFILE_NAME_REGEX = /^[a-z0-9][a-z0-9-]*$/;
/** Return true when a profile name matches the supported config key format. */
function isValidProfileName(name) {
  if (!name || name.length > 64) return false;
  return PROFILE_NAME_REGEX.test(name);
}
/** Allocate the first unused CDP port in the configured range. */
function allocateCdpPort(usedPorts, range) {
  const start = range?.start ?? CDP_PORT_RANGE_START;
  const end = range?.end ?? CDP_PORT_RANGE_END;
  if (!isValidTcpPort(start) || !isValidTcpPort(end)) return null;
  if (start > end) return null;
  for (let port = start; port <= end; port++) if (!usedPorts.has(port)) return port;
  return null;
}
function isValidTcpPort(port) {
  return Number.isSafeInteger(port) && port > 0 && port <= MAX_TCP_PORT;
}
/** Extract currently used CDP ports from profile config. */
function getUsedPorts(profiles) {
  if (!profiles) return /* @__PURE__ */ new Set();
  const used = /* @__PURE__ */ new Set();
  for (const profile of Object.values(profiles)) {
    if (typeof profile.cdpPort === "number" && isValidTcpPort(profile.cdpPort)) {
      used.add(profile.cdpPort);
      continue;
    }
    const rawUrl = profile.cdpUrl?.trim();
    if (!rawUrl) continue;
    try {
      used.add(parseBrowserHttpUrl(rawUrl, "browser.profiles.*.cdpUrl").port);
    } catch {}
  }
  return used;
}
/** Default browser profile color palette. */
const PROFILE_COLORS = [
  "#FF4500",
  "#0066CC",
  "#00AA00",
  "#9933FF",
  "#FF6699",
  "#00CCCC",
  "#FF9900",
  "#6666FF",
  "#CC3366",
  "#339966",
];
/** Allocate the first unused profile color, cycling when all are used. */
function allocateColor(usedColors) {
  for (const color of PROFILE_COLORS) if (!usedColors.has(color.toUpperCase())) return color;
  const index = usedColors.size % PROFILE_COLORS.length;
  return expectDefined(PROFILE_COLORS[index], "cycled browser color palette index");
}
/** Extract currently used profile colors from profile config. */
function getUsedColors(profiles) {
  if (!profiles) return /* @__PURE__ */ new Set();
  return new Set(Object.values(profiles).map((p) => p.color.toUpperCase()));
}
//#endregion
//#region extensions/browser/src/browser/config-mutations.ts
/**
 * Browser config mutation helpers.
 *
 * Persists browser-control credentials and profile config changes through the
 * canonical config writer while preserving port/color allocation rules.
 */
const cdpPortRange = (resolved) => {
  const start = resolved.cdpPortRangeStart;
  const end = resolved.cdpPortRangeEnd;
  if (
    typeof start === "number" &&
    Number.isFinite(start) &&
    Number.isInteger(start) &&
    typeof end === "number" &&
    Number.isFinite(end) &&
    Number.isInteger(end) &&
    start > 0 &&
    end >= start &&
    end <= 65535
  )
    return {
      start,
      end,
    };
  return deriveDefaultBrowserCdpPortRange(resolved.controlPort);
};
/** Persist the generated browser-control token or password in gateway auth config. */
async function persistBrowserControlCredential(credential) {
  await mutateConfigFile({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      draft.gateway = {
        ...draft.gateway,
        auth: {
          ...draft.gateway?.auth,
          [credential.kind]: credential.value,
        },
      };
    },
  });
}
/** Create and persist a browser profile config with allocated color and CDP port. */
async function createBrowserProfileConfig(params) {
  return (
    await mutateConfigFile({
      afterWrite: { mode: "auto" },
      mutate: async (draft) => {
        const rawDraftBrowser = draft.browser;
        const draftCdpPortRangeEnd =
          typeof rawDraftBrowser?.cdpPortRangeEnd === "number"
            ? rawDraftBrowser.cdpPortRangeEnd
            : void 0;
        const useRebasedPortRange =
          draft.gateway?.port !== void 0 ||
          draft.browser?.cdpPortRangeStart !== void 0 ||
          draftCdpPortRangeEnd !== void 0;
        const latestResolved = resolveBrowserConfig(
          {
            ...params.resolved,
            ...draft.browser,
            profiles: draft.browser?.profiles ?? params.resolved.profiles,
          },
          draft,
        );
        const latestRootResolved = resolveBrowserConfig(draft.browser, draft);
        const latestProfileSource = useRebasedPortRange ? latestRootResolved : latestResolved;
        if (
          getOwnBrowserProfile(draft.browser?.profiles ?? {}, params.name) ||
          getOwnBrowserProfile(latestProfileSource.profiles, params.name)
        )
          throw new BrowserConflictError(`profile "${params.name}" already exists`);
        const profileColor =
          params.color ?? allocateColor(getUsedColors(latestProfileSource.profiles));
        let nextProfileConfig;
        if (params.parsedCdpUrl) {
          try {
            await assertCdpEndpointAllowed(params.parsedCdpUrl, latestResolved.ssrfPolicy);
          } catch (err) {
            throw new BrowserValidationError(formatErrorMessage(err));
          }
          nextProfileConfig = {
            cdpUrl: params.parsedCdpUrl,
            ...(params.driver ? { driver: params.driver } : {}),
            ...(params.driver === "existing-session" ? { attachOnly: true } : {}),
            color: profileColor,
          };
        } else if (params.driver === "existing-session")
          nextProfileConfig = {
            driver: params.driver,
            attachOnly: true,
            ...(params.userDataDir ? { userDataDir: params.userDataDir } : {}),
            color: profileColor,
          };
        else {
          const usedPorts = getUsedPorts(latestProfileSource.profiles);
          const rangeSource = useRebasedPortRange ? latestRootResolved : params.resolved;
          const cdpPort = allocateCdpPort(
            usedPorts,
            cdpPortRange({
              controlPort: rangeSource.controlPort,
              cdpPortRangeStart: rangeSource.cdpPortRangeStart,
              cdpPortRangeEnd: draftCdpPortRangeEnd ?? rangeSource.cdpPortRangeEnd,
            }),
          );
          if (cdpPort === null)
            throw new BrowserResourceExhaustedError("no available CDP ports in range");
          nextProfileConfig = {
            cdpPort,
            ...(params.driver ? { driver: params.driver } : {}),
            color: profileColor,
          };
        }
        draft.browser = {
          ...draft.browser,
          profiles: {
            ...draft.browser?.profiles,
            [params.name]: nextProfileConfig,
          },
        };
        return nextProfileConfig;
      },
    })
  ).result;
}
/** Delete the exact persisted browser profile definition captured by the caller. */
async function deleteBrowserProfileConfig(params) {
  await mutateConfigFile({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      if (draft.browser?.defaultProfile === params.name)
        throw new BrowserValidationError(
          `cannot delete the default profile "${params.name}"; change browser.defaultProfile first`,
        );
      if (
        !isDeepStrictEqual(
          getOwnBrowserProfile(draft.browser?.profiles, params.name),
          params.expected,
        )
      )
        throw new BrowserConflictError(
          `profile "${params.name}" changed while deletion was pending; retry the delete request`,
        );
      const { [params.name]: _removed, ...remainingProfiles } = draft.browser?.profiles ?? {};
      draft.browser = {
        ...draft.browser,
        profiles: remainingProfiles,
      };
    },
  });
}
/** Make one persisted managed profile the default for future browser calls. */
async function setDefaultBrowserProfile(name) {
  await mutateConfigFile({
    afterWrite: { mode: "auto" },
    mutate: (draft) => {
      if (!getOwnBrowserProfile(draft.browser?.profiles, name))
        throw new BrowserValidationError(`profile "${name}" does not exist`);
      draft.browser = {
        ...draft.browser,
        defaultProfile: name,
      };
    },
  });
}
//#endregion
export {
  isValidProfileName as a,
  setDefaultBrowserProfile as i,
  deleteBrowserProfileConfig as n,
  persistBrowserControlCredential as r,
  createBrowserProfileConfig as t,
};
