import { t as resolveCliArgvInvocation } from "./argv-invocation-BjvIqM-C.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { n as shouldEagerRegisterSubcommands } from "./command-registration-policy-BG3v7CNP.js";
import { t as addGatewayClientOptions } from "./gateway-rpc-DpocbsVi.js";
import { t as danger } from "./globals-CNUzHTcU.js";
import { t as formatHelpExamples } from "./help-format-CAcwboTs.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { i as registerCommandGroups } from "./register-command-groups-W3gMYG31.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { r as theme } from "./theme-vjDs9tao.js";
import "./cli-runtime-B2OG9Kfj.js";
import "./core-api-CbAkgF5l.js";
//#region extensions/browser/src/cli/browser-cli-examples.ts
/**
 * Help examples shown by the Browser CLI root command.
 */
/** Core Browser CLI examples for lifecycle and inspection commands. */
const browserCoreExamples = [
  "openclaw browser status",
  "openclaw browser start",
  "openclaw browser start --headless",
  "openclaw browser stop",
  "openclaw browser tabs",
  "openclaw browser open https://example.com",
  "openclaw browser focus abcd1234",
  "openclaw browser close abcd1234",
  "openclaw browser screenshot",
  "openclaw browser screenshot --full-page",
  "openclaw browser screenshot --ref 12",
  "openclaw browser snapshot",
  "openclaw browser snapshot --format aria --limit 200",
  "openclaw browser snapshot --efficient",
  "openclaw browser snapshot --labels",
];
/** Browser CLI examples for interaction/action commands. */
const browserActionExamples = [
  "openclaw browser navigate https://example.com",
  "openclaw browser resize 1280 720",
  "openclaw browser click 12 --double",
  "openclaw browser click-coords 120 340",
  'openclaw browser type 23 "hello" --submit',
  "openclaw browser press Enter",
  "openclaw browser hover 44",
  "openclaw browser drag 10 11",
  "openclaw browser select 9 OptionA OptionB",
  "openclaw browser upload /tmp/openclaw/uploads/file.pdf",
  "openclaw browser upload media://inbound/file.pdf",
  'openclaw browser fill --fields \'[{"ref":"1","value":"Ada"}]\'',
  "openclaw browser dialog --accept",
  'openclaw browser wait --text "Done"',
  "openclaw browser evaluate --fn '(el) => el.textContent' --ref 7",
  "openclaw browser evaluate --fn 'const title = document.title; return title;'",
  "openclaw browser console --level error",
  "openclaw browser pdf",
];
//#endregion
//#region extensions/browser/src/cli/browser-cli.ts
const ROOT_BOOLEAN_OPTIONS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
const ROOT_VALUE_OPTIONS = /* @__PURE__ */ new Set(["--profile", "--log-level", "--container"]);
const BROWSER_BOOLEAN_OPTIONS = /* @__PURE__ */ new Set(["--json", "--expect-final"]);
const BROWSER_VALUE_OPTIONS = /* @__PURE__ */ new Set([
  "--browser-profile",
  "--url",
  "--token",
  "--timeout",
  "--gateway-url",
]);
const command = (name, description, options) => ({
  name,
  description,
  ...(options ? { options } : {}),
});
const browserCommandGroupDefinitions = [
  {
    placeholders: [
      command("status", "Show browser status"),
      command("start", "Start the browser (no-op if already running)"),
      command("stop", "Stop the browser (best-effort)"),
      command("reset-profile", "Reset browser profile (moves it to Trash)"),
      command("tabs", "List open tabs"),
      command("tab", "Tab shortcuts (index-based)"),
      command("open", "Open a URL in a new tab"),
      command("focus", "Focus a tab by tab reference"),
      command("close", "Close a tab (tab reference optional)"),
      command("profiles", "List all browser profiles"),
      command("system-profiles", "List Chrome-family profiles available for cookie import"),
      command("import-profile", "Import cookies from a macOS Chrome-family profile"),
      command("create-profile", "Create a new browser profile"),
      command("delete-profile", "Delete a browser profile"),
      command("doctor", "Check browser plugin readiness", [
        {
          flags: "--deep",
          description: "Run a live snapshot probe",
        },
      ]),
    ],
    register: async (args) => {
      (await import("./browser-cli-manage-BpEfZCkS.js")).registerBrowserManageCommands(
        args.browser,
        args.parentOpts,
      );
    },
  },
  {
    placeholders: [
      command("screenshot", "Capture a screenshot (prints the saved path)"),
      command("snapshot", "Capture a snapshot (default: ai; aria is the accessibility tree)"),
    ],
    register: async (args) => {
      (await import("./browser-cli-inspect-CtK6t5ms.js")).registerBrowserInspectCommands(
        args.browser,
        args.parentOpts,
      );
    },
  },
  {
    placeholders: [
      command("navigate", "Navigate the current tab to a URL"),
      command("resize", "Resize the viewport"),
      command("click", "Click an element by ref from snapshot"),
      command("click-coords", "Click viewport coordinates"),
      command("type", "Type into an element by ref from snapshot"),
      command("press", "Press a key"),
      command("hover", "Hover an element by ai ref"),
      command("scrollintoview", "Scroll an element into view by ref from snapshot"),
      command("drag", "Drag from one ref to another"),
      command("select", "Select option(s) in a select element"),
      command("upload", "Arm file upload for the next file chooser"),
      command("waitfordownload", "Wait for the next download (and save it)"),
      command("download", "Click a ref and save the resulting download"),
      command("dialog", "Arm the next modal dialog (alert/confirm/prompt)"),
      command("fill", "Fill a form with JSON field descriptors"),
      command("wait", "Wait for time, selector, URL, load state, or JS conditions"),
      command("evaluate", "Evaluate a function against the page or a ref"),
    ],
    register: async (args) => {
      (await import("./browser-cli-actions-input-C2rOnDQy.js")).registerBrowserActionInputCommands(
        args.browser,
        args.parentOpts,
      );
    },
  },
  {
    placeholders: [
      command("console", "Get recent console messages"),
      command("pdf", "Save page as PDF"),
      command("responsebody", "Wait for a network response and return its body"),
    ],
    register: async (args) => {
      (
        await import("./browser-cli-actions-observe-B_Cy9Ge8.js")
      ).registerBrowserActionObserveCommands(args.browser, args.parentOpts);
    },
  },
  {
    placeholders: [
      command("highlight", "Highlight an element by ref"),
      command("errors", "Get recent page errors"),
      command("requests", "Get recent network requests (best-effort)"),
      command("trace", "Record a Playwright trace"),
    ],
    register: async (args) => {
      (await import("./browser-cli-debug-cdZsE94z.js")).registerBrowserDebugCommands(
        args.browser,
        args.parentOpts,
      );
    },
  },
  {
    placeholders: [
      command("cookies", "Read/write cookies"),
      command("storage", "Read/write localStorage/sessionStorage"),
      command("set", "Browser environment settings"),
    ],
    register: async (args) => {
      (await import("./browser-cli-state-DOw9fgAV.js")).registerBrowserStateCommands(
        args.browser,
        args.parentOpts,
      );
    },
  },
  {
    placeholders: [command("extension", "Chrome extension load path and pairing")],
    register: async (args) => {
      (await import("./browser-cli-extension-CKja_nPF.js")).registerBrowserExtensionCommands(
        args.browser,
        args.parentOpts,
        args.pluginRoot,
      );
    },
  },
];
function buildBrowserCommandGroups(params) {
  return browserCommandGroupDefinitions.map((entry) => ({
    placeholders: entry.placeholders,
    register: async () => await entry.register(params),
  }));
}
function isValueToken(arg) {
  return Boolean(arg && arg !== "--" && (!arg.startsWith("-") || /^-\d+(?:\.\d+)?$/.test(arg)));
}
function consumeOption(args, index, booleanOptions, valueOptions) {
  const arg = args[index];
  if (!arg || arg === "--" || !arg.startsWith("-")) return 0;
  const equalsIndex = arg.indexOf("=");
  const flag = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
  if (booleanOptions.has(flag)) return equalsIndex === -1 ? 1 : 0;
  if (!valueOptions.has(flag)) return 0;
  if (equalsIndex !== -1) return arg.slice(equalsIndex + 1).trim() ? 1 : 0;
  return isValueToken(args[index + 1]) ? 2 : 1;
}
function resolveBrowserLazySubcommand(argv) {
  const { primary } = resolveCliArgvInvocation(argv);
  if (primary !== "browser") return null;
  const args = argv.slice(2);
  let sawBrowser = false;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg || arg === "--") break;
    if (!sawBrowser) {
      const consumed = consumeOption(args, i, ROOT_BOOLEAN_OPTIONS, ROOT_VALUE_OPTIONS);
      if (consumed > 0) {
        i += consumed - 1;
        continue;
      }
      if (arg.startsWith("-")) continue;
      if (arg === "browser") {
        sawBrowser = true;
        continue;
      }
      return null;
    }
    const consumed = consumeOption(args, i, BROWSER_BOOLEAN_OPTIONS, BROWSER_VALUE_OPTIONS);
    if (consumed > 0) {
      i += consumed - 1;
      continue;
    }
    if (arg.startsWith("-")) continue;
    return arg;
  }
  return null;
}
function resolveBrowserParentOpts(cmd) {
  return cmd.optsWithGlobals();
}
function registerLazyBrowserCommands(browser, parentOpts, argv, pluginRoot) {
  const subcommand = resolveBrowserLazySubcommand(argv);
  registerCommandGroups(
    browser,
    buildBrowserCommandGroups({
      browser,
      parentOpts,
      pluginRoot,
    }),
    {
      eager: shouldEagerRegisterSubcommands(),
      primary: subcommand,
      registerPrimaryOnly: subcommand !== null,
    },
  );
}
/** Registers the Browser CLI command and its lazy-loaded subcommand groups. */
function registerBrowserCli(program, argv = process.argv, pluginRoot) {
  const browser = program
    .command("browser")
    .description("Manage OpenClaw's dedicated browser (Chrome/Chromium)")
    .option("--browser-profile <name>", "Browser profile name (default from config)")
    .option("--json", "Output machine-readable JSON", false)
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n${formatHelpExamples(
          [...browserCoreExamples, ...browserActionExamples].map((cmd) => [cmd, ""]),
          true,
        )}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/browser", "docs.openclaw.ai/cli/browser")}\n`,
    )
    .action(() => {
      browser.outputHelp();
      defaultRuntime.error(
        danger(`Missing subcommand. Try: "${formatCliCommand("openclaw browser status")}"`),
      );
      defaultRuntime.exit(1);
    });
  addGatewayClientOptions(browser);
  registerLazyBrowserCommands(browser, resolveBrowserParentOpts, argv, pluginRoot);
}
//#endregion
export { registerBrowserCli as t };
