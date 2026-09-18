import {
  n as callBrowserRequest,
  s as parseBrowserPositiveIntegerValue,
  t as BROWSER_TAB_REFERENCE_HELP,
} from "./browser-cli-shared-BrMf6NKr.js";
import { n as redactCdpUrl } from "./browser-config-BYZ1IWa3.js";
import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import { n as info, t as danger } from "./globals-CNUzHTcU.js";
import { n as formatBrowserGraphicsSummary } from "./routes-FohuCP_M.js";
import "./core-api-l2pOnPUn.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import "./core-api-CbAkgF5l.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region extensions/browser/src/cli/browser-cli-manage.ts
const BROWSER_MANAGE_REQUEST_TIMEOUT_MS = 45e3;
function resolveProfileQuery(profile, extra) {
  const query = {};
  if (profile) query.profile = profile;
  if (extra) Object.assign(query, extra);
  return Object.keys(query).length > 0 ? query : void 0;
}
function printJsonResult(parent, payload) {
  if (!parent?.json) return false;
  defaultRuntime.writeJson(payload);
  return true;
}
function sanitizeTableCell(value) {
  return value.replace(/\p{Cc}/gu, " ");
}
async function callTabAction(parent, profile, body) {
  return callBrowserRequest(
    parent,
    {
      method: "POST",
      path: "/tabs/action",
      query: resolveProfileQuery(profile),
      body,
    },
    { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
  );
}
async function fetchBrowserStatus(parent, profile) {
  return await callBrowserRequest(
    parent,
    {
      method: "GET",
      path: "/",
      query: resolveProfileQuery(profile),
    },
    { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
  );
}
async function runBrowserToggle(parent, params) {
  await callBrowserRequest(parent, {
    method: "POST",
    path: params.path,
    query: resolveProfileQuery(params.profile, params.query),
  });
  const status = await fetchBrowserStatus(parent, params.profile);
  if (printJsonResult(parent, status)) return;
  const name = status.profile ?? "openclaw";
  const headlessLabel = params.path === "/start" && status.headless ? " (headless)" : "";
  defaultRuntime.log(info(`🦞 browser [${name}] running: ${status.running}${headlessLabel}`));
}
function runBrowserCommand(action) {
  return runCommandWithRuntime(defaultRuntime, action, (err) => {
    defaultRuntime.error(danger(String(err)));
    defaultRuntime.exit(1);
  });
}
function parseTabIndex(value) {
  return parseBrowserPositiveIntegerValue(value) ?? NaN;
}
function logBrowserTabs(tabs, json) {
  if (json) {
    defaultRuntime.writeJson({ tabs });
    return;
  }
  if (tabs.length === 0) {
    defaultRuntime.log("No tabs (browser closed or no targets).");
    return;
  }
  defaultRuntime.log(
    tabs
      .map((t, i) => {
        const labelHandle = t.label ? `label:${t.label}` : void 0;
        const handles = [
          t.suggestedTargetId ? `use: ${t.suggestedTargetId}` : void 0,
          t.tabId ? `tab: ${t.tabId}` : void 0,
          labelHandle,
        ]
          .filter(Boolean)
          .join(" ");
        return `${i + 1}. ${t.title || "(untitled)"}${handles ? ` [${handles}]` : ""}\n   ${t.url}\n   id: ${t.targetId}`;
      })
      .join("\n"),
  );
}
function formatDoctorLine(check) {
  return `${check.warning ? "WARN" : check.ok ? "OK" : "FAIL"} ${check.name}${check.detail ? `: ${check.detail}` : ""}`;
}
function isGatewaySecretRefUnavailableErrorShape(error) {
  if (!(error instanceof Error)) return false;
  const errorRecord = error;
  return (
    errorRecord.name === "GatewaySecretRefUnavailableError" ||
    errorRecord.code === "GATEWAY_SECRET_REF_UNAVAILABLE"
  );
}
function formatBrowserDoctorGatewayError(error) {
  if (!isGatewaySecretRefUnavailableErrorShape(error)) return String(error);
  return "Gateway auth SecretRef is unavailable in this command path; browser doctor cannot reach the admin-scoped browser.request endpoint. Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD, then retry.";
}
async function runBrowserDoctor(parent, profile, deep) {
  const checks = [];
  let status;
  try {
    status = await fetchBrowserStatus(parent, profile);
    checks.push({
      name: "gateway",
      ok: true,
      detail: "browser control endpoint reachable",
    });
  } catch (err) {
    checks.push({
      name: "gateway",
      ok: false,
      detail: formatBrowserDoctorGatewayError(err),
    });
    return {
      ok: false,
      checks,
    };
  }
  checks.push({
    name: "plugin",
    ok: status.enabled,
    detail: status.enabled ? "enabled" : "disabled in config",
  });
  checks.push({
    name: "profile",
    ok: true,
    detail: `${status.profile ?? "openclaw"} (${usesChromeMcpTransport(status) ? "chrome-mcp" : (status.transport ?? "cdp")})`,
  });
  checks.push({
    name: "browser",
    ok: status.running,
    detail: status.running
      ? `running${status.cdpReady === false ? ", CDP not ready" : ""}`
      : "not running; run `openclaw browser start`",
  });
  if (status.graphics)
    checks.push({
      name: "graphics",
      ok: true,
      warning: status.graphics.status === "unavailable",
      detail: formatBrowserGraphicsSummary(status.graphics),
    });
  try {
    const profiles = await callBrowserRequest(
      parent,
      {
        method: "GET",
        path: "/profiles",
      },
      { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
    );
    checks.push({
      name: "profiles",
      ok: true,
      detail: `${profiles.profiles?.length ?? 0} configured`,
    });
  } catch (err) {
    checks.push({
      name: "profiles",
      ok: false,
      detail: String(err),
    });
  }
  if (status.running)
    try {
      const tabs =
        (
          await callBrowserRequest(
            parent,
            {
              method: "GET",
              path: "/tabs",
              query: resolveProfileQuery(profile),
            },
            { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
          )
        ).tabs ?? [];
      checks.push({
        name: "tabs",
        ok: true,
        detail: `${tabs.length} visible${tabs.length > 0 && tabs[0]?.suggestedTargetId ? `, use tab reference ${tabs[0].suggestedTargetId}` : ""}`,
      });
    } catch (err) {
      checks.push({
        name: "tabs",
        ok: false,
        detail: String(err),
      });
    }
  if (deep && status.running)
    try {
      const result = await callBrowserRequest(
        parent,
        {
          method: "GET",
          path: "/snapshot",
          query: resolveProfileQuery(profile, {
            format: "aria",
            limit: 25,
          }),
        },
        { timeoutMs: 1e4 },
      );
      const count =
        result.format === "aria"
          ? Array.isArray(result.nodes)
            ? result.nodes.length
            : 0
          : typeof result.snapshot === "string"
            ? result.snapshot.split("\n").length
            : 0;
      checks.push({
        name: "live-snapshot",
        ok: count > 0,
        detail: count > 0 ? `${count} nodes/lines` : "snapshot returned no content",
      });
    } catch (err) {
      checks.push({
        name: "live-snapshot",
        ok: false,
        detail: String(err),
      });
    }
  return {
    ok: checks.every((check) => check.ok),
    checks,
    status,
  };
}
function usesChromeMcpTransport(params) {
  return params.transport === "chrome-mcp" || params.driver === "existing-session";
}
function usesExtensionTransport(params) {
  return params.transport === "extension" || params.driver === "extension";
}
function formatBrowserConnectionSummary(params) {
  if (usesChromeMcpTransport(params)) {
    if (params.cdpUrl) return `transport: chrome-mcp, cdpUrl: ${redactCdpUrl(params.cdpUrl)}`;
    const userDataDir = params.userDataDir ? shortenHomePath(params.userDataDir) : null;
    return userDataDir
      ? `transport: chrome-mcp, userDataDir: ${userDataDir}`
      : "transport: chrome-mcp";
  }
  if (usesExtensionTransport(params))
    return `transport: extension, relayPort: ${params.cdpPort ?? "(unset)"}`;
  if (params.isRemote) return `cdpUrl: ${params.cdpUrl ? redactCdpUrl(params.cdpUrl) : "(unset)"}`;
  return `port: ${params.cdpPort ?? "(unset)"}`;
}
/** Registers Browser lifecycle, profile, tab, and doctor commands. */
function registerBrowserManageCommands(browser, parentOpts) {
  browser
    .command("status")
    .description("Show browser status")
    .action(async (_opts, cmd) => {
      const parent = parentOpts(cmd);
      await runBrowserCommand(async () => {
        const status = await fetchBrowserStatus(parent, parent?.browserProfile);
        if (printJsonResult(parent, status)) return;
        const detectedPath = status.detectedExecutablePath ?? status.executablePath;
        const detectedDisplay = detectedPath ? shortenHomePath(detectedPath) : "auto";
        defaultRuntime.log(
          [
            `profile: ${status.profile ?? "openclaw"}`,
            `enabled: ${status.enabled}`,
            `running: ${status.running}`,
            `transport: ${usesChromeMcpTransport(status) ? "chrome-mcp" : (status.transport ?? "cdp")}`,
            ...(!usesChromeMcpTransport(status)
              ? [
                  `cdpPort: ${status.cdpPort ?? "(unset)"}`,
                  `cdpUrl: ${redactCdpUrl(status.cdpUrl ?? `http://127.0.0.1:${status.cdpPort}`)}`,
                ]
              : status.cdpUrl
                ? [`cdpUrl: ${redactCdpUrl(status.cdpUrl)}`]
                : status.userDataDir
                  ? [`userDataDir: ${shortenHomePath(status.userDataDir)}`]
                  : []),
            `browser: ${status.chosenBrowser ?? "unknown"}`,
            `detectedBrowser: ${status.detectedBrowser ?? "unknown"}`,
            `detectedPath: ${detectedDisplay}`,
            `headless: ${status.headless}${status.headlessSource ? ` (${status.headlessSource})` : ""}`,
            `profileColor: ${status.color}`,
            ...(status.graphics
              ? [`graphics: ${formatBrowserGraphicsSummary(status.graphics)}`]
              : []),
            ...(status.detectError ? [`detectError: ${status.detectError}`] : []),
          ].join("\n"),
        );
      });
    });
  browser
    .command("doctor")
    .description("Check browser plugin readiness")
    .option("--deep", "Run a live snapshot probe")
    .action(async (opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        const result = await runBrowserDoctor(parent, profile, opts.deep === true);
        if (printJsonResult(parent, result)) return;
        defaultRuntime.log(result.checks.map(formatDoctorLine).join("\n"));
        if (!result.ok) defaultRuntime.exit(1);
      });
    });
  browser
    .command("start")
    .description("Start the browser (no-op if already running)")
    .option("--headless", "Launch a local managed browser headless for this start")
    .action(async (opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        await runBrowserToggle(parent, {
          profile,
          path: "/start",
          query: opts.headless ? { headless: true } : void 0,
        });
      });
    });
  browser
    .command("stop")
    .description("Stop the browser (best-effort)")
    .action(async (_opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        await runBrowserToggle(parent, {
          profile,
          path: "/stop",
        });
      });
    });
  browser
    .command("reset-profile")
    .description("Reset browser profile (moves it to Trash)")
    .action(async (_opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        const result = await callBrowserRequest(
          parent,
          {
            method: "POST",
            path: "/reset-profile",
            query: resolveProfileQuery(profile),
          },
          { timeoutMs: 2e4 },
        );
        if (printJsonResult(parent, result)) return;
        if (!result.moved) {
          defaultRuntime.log(info(`🦞 browser profile already missing.`));
          return;
        }
        const dest = result.to ?? result.from;
        defaultRuntime.log(info(`🦞 browser profile moved to Trash (${dest})`));
      });
    });
  browser
    .command("tabs")
    .description("List open tabs")
    .action(async (_opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        logBrowserTabs(
          (
            await callBrowserRequest(
              parent,
              {
                method: "GET",
                path: "/tabs",
                query: resolveProfileQuery(profile),
              },
              { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
            )
          ).tabs ?? [],
          parent?.json,
        );
      });
    });
  const tab = browser
    .command("tab")
    .description("Tab shortcuts (index-based)")
    .action(async (_opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        logBrowserTabs(
          (
            await callBrowserRequest(
              parent,
              {
                method: "POST",
                path: "/tabs/action",
                query: resolveProfileQuery(profile),
                body: { action: "list" },
              },
              { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
            )
          ).tabs ?? [],
          parent?.json,
        );
      });
    });
  tab
    .command("new")
    .description("Open a new tab (about:blank)")
    .option("--label <label>", "Assign a friendly tab label")
    .action(async (opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        const result = await callTabAction(parent, profile, {
          action: "new",
          label: opts.label,
        });
        if (printJsonResult(parent, result)) return;
        const opened = result.tab;
        defaultRuntime.log(
          opened?.tabId
            ? `opened new tab ${opened.tabId}${opened.label ? ` (${opened.label})` : ""}`
            : "opened new tab",
        );
      });
    });
  tab
    .command("label")
    .description("Assign a friendly label to a tab")
    .argument("<targetId>", BROWSER_TAB_REFERENCE_HELP)
    .argument("<label>", "Friendly label")
    .action(async (targetId, label, _opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        const result = await callTabAction(parent, profile, {
          action: "label",
          targetId,
          label,
        });
        if (printJsonResult(parent, result)) return;
        const tabValue = result.tab;
        defaultRuntime.log(
          `labeled tab ${tabValue?.tabId ?? targetId} as ${tabValue?.label ?? label}`,
        );
      });
    });
  tab
    .command("select")
    .description("Focus tab by index (1-based)")
    .argument("<index>", "Tab index (1-based)", parseTabIndex)
    .action(async (index, _opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      if (!Number.isSafeInteger(index) || index < 1) {
        defaultRuntime.error(danger("index must be a positive integer"));
        defaultRuntime.exit(1);
        return;
      }
      await runBrowserCommand(async () => {
        const result = await callTabAction(parent, profile, {
          action: "select",
          index: index - 1,
        });
        if (printJsonResult(parent, result)) return;
        defaultRuntime.log(`selected tab ${index}`);
      });
    });
  tab
    .command("close")
    .description("Close tab by index (1-based); default: first tab")
    .argument("[index]", "Tab index (1-based)", parseTabIndex)
    .action(async (index, _opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      if (typeof index === "number" && (!Number.isSafeInteger(index) || index < 1)) {
        defaultRuntime.error(danger("index must be a positive integer"));
        defaultRuntime.exit(1);
        return;
      }
      const idx = typeof index === "number" ? index - 1 : void 0;
      await runBrowserCommand(async () => {
        const result = await callTabAction(parent, profile, {
          action: "close",
          index: idx,
        });
        if (printJsonResult(parent, result)) return;
        defaultRuntime.log("closed tab");
      });
    });
  browser
    .command("open")
    .description("Open a URL in a new tab")
    .argument("<url>", "URL to open")
    .option("--label <label>", "Assign a friendly tab label")
    .action(async (url, opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        const tabLocal = await callBrowserRequest(
          parent,
          {
            method: "POST",
            path: "/tabs/open",
            query: resolveProfileQuery(profile),
            body: {
              url,
              ...(opts.label ? { label: opts.label } : {}),
            },
          },
          { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
        );
        if (printJsonResult(parent, tabLocal)) return;
        defaultRuntime.log(
          `opened: ${tabLocal.url}\n${tabLocal.tabId ? `tab: ${tabLocal.tabId}\n` : ""}${tabLocal.label ? `label: ${tabLocal.label}\n` : ""}id: ${tabLocal.targetId}`,
        );
      });
    });
  browser
    .command("focus")
    .description("Focus a tab by tab reference")
    .argument("<targetId>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (targetId, _opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        await callBrowserRequest(
          parent,
          {
            method: "POST",
            path: "/tabs/focus",
            query: resolveProfileQuery(profile),
            body: { targetId },
          },
          { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
        );
        if (printJsonResult(parent, { ok: true })) return;
        defaultRuntime.log(`focused tab ${targetId}`);
      });
    });
  browser
    .command("close")
    .description("Close a tab (tab reference optional)")
    .argument("[targetId]", `${BROWSER_TAB_REFERENCE_HELP} (optional)`)
    .action(async (targetId, _opts, cmd) => {
      const parent = parentOpts(cmd);
      const profile = parent?.browserProfile;
      await runBrowserCommand(async () => {
        if (targetId?.trim())
          await callBrowserRequest(
            parent,
            {
              method: "DELETE",
              path: `/tabs/${encodeURIComponent(targetId.trim())}`,
              query: resolveProfileQuery(profile),
            },
            { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
          );
        else
          await callBrowserRequest(
            parent,
            {
              method: "POST",
              path: "/act",
              query: resolveProfileQuery(profile),
              body: { kind: "close" },
            },
            { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
          );
        if (printJsonResult(parent, { ok: true })) return;
        defaultRuntime.log("closed tab");
      });
    });
  browser
    .command("profiles")
    .description("List all browser profiles")
    .action(async (_opts, cmd) => {
      const parent = parentOpts(cmd);
      await runBrowserCommand(async () => {
        const profiles =
          (
            await callBrowserRequest(
              parent,
              {
                method: "GET",
                path: "/profiles",
              },
              { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
            )
          ).profiles ?? [];
        if (printJsonResult(parent, { profiles })) return;
        if (profiles.length === 0) {
          defaultRuntime.log("No profiles configured.");
          return;
        }
        defaultRuntime.log(
          profiles
            .map((p) => {
              const status = p.running ? "running" : "stopped";
              const tabs = p.running ? ` (${p.tabCount} tabs)` : "";
              const def = p.isDefault ? " [default]" : "";
              const loc = formatBrowserConnectionSummary(p);
              const remote = p.isRemote ? " [remote]" : "";
              const driver = p.driver !== "openclaw" ? ` [${p.driver}]` : "";
              return `${p.name}: ${status}${tabs}${def}${remote}${driver}\n  ${loc}, color: ${p.color}`;
            })
            .join("\n"),
        );
      });
    });
  browser
    .command("system-profiles")
    .description("List Chrome-family profiles available for cookie import")
    .option("--browser <browser>", "System browser (chrome|brave|edge|chromium); omit to list all")
    .action(async (opts, cmd) => {
      const parent = parentOpts(cmd);
      await runBrowserCommand(async () => {
        const systemProfiles =
          (
            await callBrowserRequest(
              parent,
              {
                method: "GET",
                path: "/system-profiles",
                query: opts.browser ? { browser: opts.browser } : void 0,
              },
              { timeoutMs: BROWSER_MANAGE_REQUEST_TIMEOUT_MS },
            )
          ).systemProfiles ?? [];
        if (printJsonResult(parent, { systemProfiles })) return;
        if (systemProfiles.length === 0) {
          defaultRuntime.log("No system browser profiles found.");
          return;
        }
        defaultRuntime.log("browser	id	name	hasCookies");
        defaultRuntime.log(
          systemProfiles
            .map((profile) =>
              [profile.browser, profile.id, profile.name, profile.hasCookies ? "yes" : "no"]
                .map(sanitizeTableCell)
                .join("	"),
            )
            .join("\n"),
        );
      });
    });
  browser
    .command("import-profile")
    .description("Import cookies from a macOS Chrome-family profile")
    .option("--browser <browser>", "System browser (chrome|brave|edge|chromium)", "chrome")
    .option("--system <profile>", "System profile directory", "Default")
    .option("--into <profile>", "Managed target profile", "imported")
    .option("--domains <domains>", "Comma-separated domain filter")
    .action(async (opts, cmd) => {
      const parent = parentOpts(cmd);
      await runBrowserCommand(async () => {
        const domains = opts.domains
          ?.split(",")
          .map((domain) => domain.trim())
          .filter(Boolean);
        const result = await callBrowserRequest(
          parent,
          {
            method: "POST",
            path: "/profiles/import",
            body: {
              browser: opts.browser,
              systemProfile: opts.system,
              into: opts.into,
              domains,
            },
          },
          { timeoutMs: 12e4 },
        );
        if (printJsonResult(parent, result)) return;
        defaultRuntime.log(
          info(
            `Imported cookies into "${result.into}": ${result.cookies.imported}/${result.cookies.total} imported, ${result.cookies.failed} failed, ${result.cookies.skipped} skipped; ${result.domains.length} domains`,
          ),
        );
      });
    });
  browser
    .command("create-profile")
    .description("Create a new browser profile")
    .requiredOption("--name <name>", "Profile name (lowercase, numbers, hyphens)")
    .option("--color <hex>", "Profile color (hex format, e.g. #0066CC)")
    .option("--cdp-url <url>", "DevTools endpoint URL (http/https/ws/wss)")
    .option("--user-data-dir <path>", "User data dir for existing-session Chromium attach")
    .option("--driver <driver>", "Profile driver (openclaw|existing-session). Default: openclaw")
    .action(async (opts, cmd) => {
      const parent = parentOpts(cmd);
      await runBrowserCommand(async () => {
        const result = await callBrowserRequest(
          parent,
          {
            method: "POST",
            path: "/profiles/create",
            body: {
              name: opts.name,
              color: opts.color,
              cdpUrl: opts.cdpUrl,
              userDataDir: opts.userDataDir,
              driver: opts.driver === "existing-session" ? "existing-session" : void 0,
            },
          },
          { timeoutMs: 1e4 },
        );
        if (printJsonResult(parent, result)) return;
        const loc = `  ${formatBrowserConnectionSummary(result)}`;
        defaultRuntime.log(
          info(
            `🦞 Created profile "${result.profile}"\n${loc}\n  color: ${result.color}${result.userDataDir ? `\n  userDataDir: ${shortenHomePath(result.userDataDir)}` : ""}${opts.driver === "existing-session" ? "\n  driver: existing-session" : ""}`,
          ),
        );
      });
    });
  browser
    .command("delete-profile")
    .description("Delete a browser profile")
    .requiredOption("--name <name>", "Profile name to delete")
    .action(async (opts, cmd) => {
      const parent = parentOpts(cmd);
      await runBrowserCommand(async () => {
        const result = await callBrowserRequest(
          parent,
          {
            method: "DELETE",
            path: `/profiles/${encodeURIComponent(opts.name)}`,
          },
          { timeoutMs: 2e4 },
        );
        if (printJsonResult(parent, result)) return;
        const msg = result.deleted
          ? `🦞 Deleted profile "${result.profile}" (user data removed)`
          : `🦞 Deleted profile "${result.profile}" (no user data found)`;
        defaultRuntime.log(info(msg));
      });
    });
}
//#endregion
export { registerBrowserManageCommands };
