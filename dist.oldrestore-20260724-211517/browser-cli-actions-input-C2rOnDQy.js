import fs from "node:fs/promises";
import {
  c as resolveBrowserActExecutionBudgetMs,
  n as ACT_MAX_VIEWPORT_DIMENSION,
} from "./act-policy-DJo1OgjZ.js";
import { t as runBrowserResizeWithOutput } from "./browser-cli-resize-VroDK2Xe.js";
import {
  i as parseBrowserNonNegativeIntegerOption,
  n as callBrowserRequest,
  o as parseBrowserPositiveIntegerOption,
  s as parseBrowserPositiveIntegerValue,
  t as BROWSER_TAB_REFERENCE_HELP,
} from "./browser-cli-shared-BrMf6NKr.js";
import { l as resolveExistingUploadPaths } from "./config-CzdiqFrD.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { t as danger } from "./globals-CNUzHTcU.js";
import { a as addTimerTimeoutGraceMs } from "./number-coercion-CJQ8TR--.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import "./core-api-CbAkgF5l.js";
import {
  c as normalizeBrowserFormFieldValue,
  s as normalizeBrowserFormField,
} from "./snapshot-urls-UoxUrSeb.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region extensions/browser/src/cli/browser-cli-actions-input/shared.ts
/**
 * Shared helpers for Browser CLI action subcommands.
 */
const DEFAULT_BROWSER_ACTION_TIMEOUT_MS = 2e4;
/** Adds gateway slack to a Browser action timeout so route work can finish cleanly. */
function withBrowserActionTimeoutSlack(timeoutMs) {
  return addTimerTimeoutGraceMs(timeoutMs ?? DEFAULT_BROWSER_ACTION_TIMEOUT_MS, 5e3) ?? 1;
}
/** Resolves inherited Browser action context from a commander command. */
function resolveBrowserActionContext(cmd, parentOpts) {
  const parent = parentOpts(cmd);
  return {
    parent,
    profile: parent?.browserProfile,
  };
}
/** Calls the Browser /act route for one CLI action body. */
async function callBrowserAct(params) {
  return await callBrowserRequest(
    params.parent,
    {
      method: "POST",
      path: "/act",
      query: params.profile ? { profile: params.profile } : void 0,
      body: params.body,
    },
    { timeoutMs: withBrowserActionTimeoutSlack(params.timeoutMs) },
  );
}
/** Writes Browser action output as JSON or a terse success message. */
function logBrowserActionResult(parent, result, successMessage) {
  if (parent?.json) {
    defaultRuntime.writeJson(result);
    return;
  }
  defaultRuntime.log(successMessage);
}
/** Requires and trims an element ref, exiting through the CLI runtime on failure. */
function requireRef(ref) {
  const refValue = typeof ref === "string" ? ref.trim() : "";
  if (!refValue) {
    defaultRuntime.error(danger("ref is required"));
    defaultRuntime.exit(1);
    return null;
  }
  return refValue;
}
async function readFile$1(path) {
  return await fs.readFile(path, "utf8");
}
/** Reads and validates JSON form-field descriptors from inline text or a file. */
async function readFields(opts) {
  const payload = opts.fieldsFile ? await readFile$1(opts.fieldsFile) : (opts.fields ?? "");
  if (!payload.trim()) throw new Error("fields are required");
  let parsed;
  try {
    parsed = JSON.parse(payload);
  } catch (cause) {
    throw new Error("fields must be valid JSON.", { cause });
  }
  if (!Array.isArray(parsed)) throw new Error("fields must be an array");
  return parsed.map((entry, index) => {
    if (!entry || typeof entry !== "object") throw new Error(`fields[${index}] must be an object`);
    const rec = entry;
    const parsedField = normalizeBrowserFormField(rec);
    if (!parsedField) throw new Error(`fields[${index}] must include ref`);
    if (
      rec.value === void 0 ||
      rec.value === null ||
      normalizeBrowserFormFieldValue(rec.value) !== void 0
    )
      return parsedField;
    throw new Error(`fields[${index}].value must be string, number, boolean, or null`);
  });
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.element.ts
/** Registers element-centric Browser action commands. */
function registerBrowserElementCommands(browser, parentOpts) {
  const parseDecimalNumber = (value) => {
    const trimmed = value.trim();
    if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed)) return;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : void 0;
  };
  const parseRequiredNumber = (value, label) => {
    const parsed = parseDecimalNumber(value);
    if (parsed === void 0) {
      defaultRuntime.error(danger(`Invalid ${label}: must be a finite number`));
      defaultRuntime.exit(1);
      return;
    }
    return parsed;
  };
  const runElementAction = async (params) => {
    const { parent, profile } = resolveBrowserActionContext(params.cmd, parentOpts);
    try {
      const result = await callBrowserAct({
        parent,
        profile,
        body: params.body,
        timeoutMs: params.timeoutMs,
      });
      logBrowserActionResult(
        parent,
        result,
        typeof params.successMessage === "function"
          ? params.successMessage(result)
          : params.successMessage,
      );
    } catch (err) {
      defaultRuntime.error(danger(String(err)));
      defaultRuntime.exit(1);
    }
  };
  browser
    .command("click")
    .description("Click an element by ref from snapshot")
    .argument("<ref>", "Ref id from snapshot")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .option("--double", "Double click", false)
    .option("--button <left|right|middle>", "Mouse button to use")
    .option("--modifiers <list>", "Comma-separated modifiers (Shift,Alt,Meta)")
    .action(async (ref, opts, cmd) => {
      const refValue = requireRef(ref);
      if (!refValue) return;
      const modifiers = opts.modifiers
        ? String(opts.modifiers)
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : void 0;
      await runElementAction({
        cmd,
        body: {
          kind: "click",
          ref: refValue,
          targetId: normalizeOptionalString(opts.targetId),
          doubleClick: Boolean(opts.double),
          button: normalizeOptionalString(opts.button),
          modifiers,
        },
        successMessage: (result) => {
          const url = result.url;
          const suffix = typeof url === "string" && url ? ` on ${url}` : "";
          return `clicked ref ${refValue}${suffix}`;
        },
      });
    });
  browser
    .command("click-coords")
    .description("Click viewport coordinates")
    .argument("<x>", "Viewport x coordinate")
    .argument("<y>", "Viewport y coordinate")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .option("--double", "Double click", false)
    .option("--button <left|right|middle>", "Mouse button to use")
    .option("--delay-ms <ms>", "Delay between mouse down/up", (v) =>
      parseBrowserNonNegativeIntegerOption(v, "--delay-ms"),
    )
    .action(async (xRaw, yRaw, opts, cmd) => {
      const x = parseRequiredNumber(xRaw, "x");
      const y = parseRequiredNumber(yRaw, "y");
      if (x === void 0 || y === void 0) return;
      await runElementAction({
        cmd,
        body: {
          kind: "clickCoords",
          x,
          y,
          targetId: normalizeOptionalString(opts.targetId),
          doubleClick: Boolean(opts.double),
          button: normalizeOptionalString(opts.button),
          delayMs: Number.isFinite(opts.delayMs) ? opts.delayMs : void 0,
        },
        successMessage: (result) => {
          const url = result.url;
          const suffix = typeof url === "string" && url ? ` on ${url}` : "";
          return `clicked ${x},${y}${suffix}`;
        },
      });
    });
  browser
    .command("type")
    .description("Type into an element by ref from snapshot")
    .argument("<ref>", "Ref id from snapshot")
    .argument("<text>", "Text to type")
    .option("--submit", "Press Enter after typing", false)
    .option("--slowly", "Type slowly (human-like)", false)
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (ref, text, opts, cmd) => {
      const refValue = requireRef(ref);
      if (!refValue) return;
      await runElementAction({
        cmd,
        body: {
          kind: "type",
          ref: refValue,
          text,
          submit: Boolean(opts.submit),
          slowly: Boolean(opts.slowly),
          targetId: normalizeOptionalString(opts.targetId),
        },
        successMessage: `typed into ref ${refValue}`,
      });
    });
  browser
    .command("press")
    .description("Press a key")
    .argument("<key>", "Key to press (e.g. Enter)")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (key, opts, cmd) => {
      await runElementAction({
        cmd,
        body: {
          kind: "press",
          key,
          targetId: normalizeOptionalString(opts.targetId),
        },
        successMessage: `pressed ${key}`,
      });
    });
  browser
    .command("hover")
    .description("Hover an element by ai ref")
    .argument("<ref>", "Ref id from snapshot")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (ref, opts, cmd) => {
      await runElementAction({
        cmd,
        body: {
          kind: "hover",
          ref,
          targetId: normalizeOptionalString(opts.targetId),
        },
        successMessage: `hovered ref ${ref}`,
      });
    });
  browser
    .command("scrollintoview")
    .description("Scroll an element into view by ref from snapshot")
    .argument("<ref>", "Ref id from snapshot")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .option("--timeout-ms <ms>", "How long to wait for scroll (default: 20000)", (v) =>
      parseBrowserPositiveIntegerOption(v, "--timeout-ms"),
    )
    .action(async (ref, opts, cmd) => {
      const refValue = requireRef(ref);
      if (!refValue) return;
      const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : void 0;
      await runElementAction({
        cmd,
        body: {
          kind: "scrollIntoView",
          ref: refValue,
          targetId: normalizeOptionalString(opts.targetId),
          timeoutMs,
        },
        timeoutMs,
        successMessage: `scrolled into view: ${refValue}`,
      });
    });
  browser
    .command("drag")
    .description("Drag from one ref to another")
    .argument("<startRef>", "Start ref id")
    .argument("<endRef>", "End ref id")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (startRef, endRef, opts, cmd) => {
      await runElementAction({
        cmd,
        body: {
          kind: "drag",
          startRef,
          endRef,
          targetId: normalizeOptionalString(opts.targetId),
        },
        successMessage: `dragged ${startRef} → ${endRef}`,
      });
    });
  browser
    .command("select")
    .description("Select option(s) in a select element")
    .argument("<ref>", "Ref id from snapshot")
    .argument("<values...>", "Option values to select")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (ref, values, opts, cmd) => {
      await runElementAction({
        cmd,
        body: {
          kind: "select",
          ref,
          values,
          targetId: normalizeOptionalString(opts.targetId),
        },
        successMessage: `selected ${values.join(", ")}`,
      });
    });
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.files-downloads.ts
const DEFAULT_BROWSER_HOOK_TIMEOUT_MS = 12e4;
async function normalizeUploadPaths(paths) {
  const result = await resolveExistingUploadPaths({ requestedPaths: paths });
  if (!result.ok) throw new Error(result.error);
  return result.paths;
}
async function runBrowserPostAction(params) {
  try {
    const result = await callBrowserRequest(
      params.parent,
      {
        method: "POST",
        path: params.path,
        query: params.profile ? { profile: params.profile } : void 0,
        body: params.body,
      },
      { timeoutMs: withBrowserActionTimeoutSlack(params.timeoutMs) },
    );
    if (params.parent?.json) {
      defaultRuntime.writeJson(result);
      return;
    }
    defaultRuntime.log(params.describeSuccess(result));
  } catch (err) {
    defaultRuntime.error(danger(String(err)));
    defaultRuntime.exit(1);
  }
}
/** Registers Browser file chooser, dialog, and download commands. */
function registerBrowserFilesAndDownloadsCommands(browser, parentOpts) {
  const resolveTimeoutAndTarget = (opts) => {
    return {
      timeoutMs: Number.isFinite(opts.timeoutMs) ? Number(opts.timeoutMs) : void 0,
      targetId: normalizeOptionalString(opts.targetId),
    };
  };
  const runDownloadCommand = async (cmd, opts, request) => {
    const { parent, profile } = resolveBrowserActionContext(cmd, parentOpts);
    const { timeoutMs, targetId } = resolveTimeoutAndTarget(opts);
    await runBrowserPostAction({
      parent,
      profile,
      path: request.path,
      body: {
        ...request.body,
        targetId,
        timeoutMs,
      },
      timeoutMs: timeoutMs ?? DEFAULT_BROWSER_HOOK_TIMEOUT_MS,
      describeSuccess: (result) => `downloaded: ${shortenHomePath(result.download.path)}`,
    });
  };
  browser
    .command("upload")
    .description("Arm file upload for the next file chooser")
    .argument(
      "<paths...>",
      "File paths to upload from OpenClaw temp uploads or managed inbound media (e.g. /tmp/openclaw/uploads/file.pdf or media://inbound/<id>)",
    )
    .option("--ref <ref>", "Ref id from snapshot to click after arming")
    .option("--input-ref <ref>", "Ref id for <input type=file> to set directly")
    .option("--element <selector>", "CSS selector for <input type=file>")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .option(
      "--timeout-ms <ms>",
      "How long to wait for the next file chooser (default: 120000)",
      (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms"),
    )
    .action(async (paths, opts, cmd) => {
      try {
        const { parent, profile } = resolveBrowserActionContext(cmd, parentOpts);
        const normalizedPaths = await normalizeUploadPaths(paths);
        const { timeoutMs, targetId } = resolveTimeoutAndTarget(opts);
        await runBrowserPostAction({
          parent,
          profile,
          path: "/hooks/file-chooser",
          body: {
            paths: normalizedPaths,
            ref: normalizeOptionalString(opts.ref),
            inputRef: normalizeOptionalString(opts.inputRef),
            element: normalizeOptionalString(opts.element),
            targetId,
            timeoutMs,
          },
          timeoutMs: timeoutMs ?? DEFAULT_BROWSER_HOOK_TIMEOUT_MS,
          describeSuccess: () => `upload armed for ${paths.length} file(s)`,
        });
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });
  browser
    .command("waitfordownload")
    .description("Wait for the next download (and save it)")
    .argument(
      "[path]",
      "Save path within openclaw temp downloads dir (default: /tmp/openclaw/downloads/...; fallback: os.tmpdir()/openclaw/downloads/...)",
    )
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .option("--timeout-ms <ms>", "How long to wait for the next download (default: 120000)", (v) =>
      parseBrowserPositiveIntegerOption(v, "--timeout-ms"),
    )
    .action(async (outPath, opts, cmd) => {
      await runDownloadCommand(cmd, opts, {
        path: "/wait/download",
        body: { path: normalizeOptionalString(outPath) },
      });
    });
  browser
    .command("download")
    .description("Click a ref and save the resulting download")
    .argument("<ref>", "Ref id from snapshot to click")
    .argument(
      "<path>",
      "Save path within openclaw temp downloads dir (e.g. report.pdf or /tmp/openclaw/downloads/report.pdf)",
    )
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .option(
      "--timeout-ms <ms>",
      "How long to wait for the download to start (default: 120000)",
      (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms"),
    )
    .action(async (ref, outPath, opts, cmd) => {
      await runDownloadCommand(cmd, opts, {
        path: "/download",
        body: {
          ref,
          path: outPath,
        },
      });
    });
  browser
    .command("dialog")
    .description("Arm the next modal dialog (alert/confirm/prompt)")
    .option("--accept", "Accept the dialog", false)
    .option("--dismiss", "Dismiss the dialog", false)
    .option("--prompt <text>", "Prompt response text")
    .option("--dialog-id <id>", "Pending dialog id from snapshot/browser state")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .option("--timeout-ms <ms>", "How long to wait for the next dialog (default: 120000)", (v) =>
      parseBrowserPositiveIntegerOption(v, "--timeout-ms"),
    )
    .action(async (opts, cmd) => {
      const { parent, profile } = resolveBrowserActionContext(cmd, parentOpts);
      if (opts.accept && opts.dismiss) {
        defaultRuntime.error(danger("Specify only one of --accept or --dismiss"));
        defaultRuntime.exit(1);
        return;
      }
      const accept = opts.accept ? true : opts.dismiss ? false : void 0;
      if (accept === void 0) {
        defaultRuntime.error(danger("Specify --accept or --dismiss"));
        defaultRuntime.exit(1);
        return;
      }
      const { timeoutMs, targetId } = resolveTimeoutAndTarget(opts);
      await runBrowserPostAction({
        parent,
        profile,
        path: "/hooks/dialog",
        body: {
          accept,
          promptText: normalizeOptionalString(opts.prompt),
          dialogId: normalizeOptionalString(opts.dialogId),
          targetId,
          timeoutMs,
        },
        timeoutMs: timeoutMs ?? DEFAULT_BROWSER_HOOK_TIMEOUT_MS,
        describeSuccess: () => "dialog armed",
      });
    });
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.form-wait-eval.ts
function parseBrowserWaitLoadState(value) {
  const load = normalizeOptionalString(value);
  switch (load) {
    case void 0:
      return;
    case "load":
    case "domcontentloaded":
    case "networkidle":
      return load;
    default:
      throw new Error(`Invalid --load value: ${load}`);
  }
}
/** Registers Browser fill, wait, and evaluate commands. */
function registerBrowserFormWaitEvalCommands(browser, parentOpts) {
  browser
    .command("fill")
    .description("Fill a form with JSON field descriptors")
    .option("--fields <json>", "JSON array of field objects")
    .option("--fields-file <path>", "Read JSON array from a file")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (opts, cmd) => {
      const { parent, profile } = resolveBrowserActionContext(cmd, parentOpts);
      try {
        const fields = await readFields({
          fields: opts.fields,
          fieldsFile: opts.fieldsFile,
        });
        logBrowserActionResult(
          parent,
          await callBrowserAct({
            parent,
            profile,
            body: {
              kind: "fill",
              fields,
              targetId: normalizeOptionalString(opts.targetId),
            },
          }),
          `filled ${fields.length} field(s)`,
        );
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });
  browser
    .command("wait")
    .description("Wait for time, selector, URL, load state, or JS conditions")
    .argument("[selector]", "CSS selector to wait for (visible)")
    .option("--time <ms>", "Wait for N milliseconds", (v) =>
      parseBrowserNonNegativeIntegerOption(v, "--time"),
    )
    .option("--text <value>", "Wait for text to appear")
    .option("--text-gone <value>", "Wait for text to disappear")
    .option("--url <pattern>", "Wait for URL (supports globs like **/dash)")
    .option("--load <load|domcontentloaded|networkidle>", "Wait for load state")
    .option("--fn <js>", "Wait for JS condition (passed to waitForFunction)")
    .option("--timeout-ms <ms>", "How long to wait for each condition (default: 20000)", (v) =>
      parseBrowserPositiveIntegerOption(v, "--timeout-ms"),
    )
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (selector, opts, cmd) => {
      const { parent, profile } = resolveBrowserActionContext(cmd, parentOpts);
      try {
        const sel = normalizeOptionalString(selector);
        const load = parseBrowserWaitLoadState(opts.load);
        const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : void 0;
        const request = {
          kind: "wait",
          timeMs: Number.isFinite(opts.time) ? opts.time : void 0,
          text: normalizeOptionalString(opts.text),
          textGone: normalizeOptionalString(opts.textGone),
          selector: sel,
          url: normalizeOptionalString(opts.url),
          loadState: load,
          fn: normalizeOptionalString(opts.fn),
          targetId: normalizeOptionalString(opts.targetId),
          timeoutMs,
        };
        logBrowserActionResult(
          parent,
          await callBrowserAct({
            parent,
            profile,
            body: request,
            timeoutMs: resolveBrowserActExecutionBudgetMs(request),
          }),
          "wait complete",
        );
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });
  browser
    .command("evaluate")
    .description("Evaluate JavaScript against the page or a ref")
    .option(
      "--fn <code>",
      "Function source, expression, or statement body, e.g. const text = el.textContent; return text;",
    )
    .option("--ref <id>", "Ref from snapshot")
    .option(
      "--timeout-ms <ms>",
      "How long to allow the evaluate function to run (default: 20000)",
      (v) => parseBrowserPositiveIntegerOption(v, "--timeout-ms"),
    )
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (opts, cmd) => {
      const { parent, profile } = resolveBrowserActionContext(cmd, parentOpts);
      if (!opts.fn) {
        defaultRuntime.error(danger("Missing --fn"));
        defaultRuntime.exit(1);
        return;
      }
      try {
        const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : void 0;
        const result = await callBrowserAct({
          parent,
          profile,
          body: {
            kind: "evaluate",
            fn: opts.fn,
            ref: normalizeOptionalString(opts.ref),
            targetId: normalizeOptionalString(opts.targetId),
            timeoutMs,
          },
          timeoutMs,
        });
        if (parent?.json) {
          defaultRuntime.writeJson(result);
          return;
        }
        defaultRuntime.writeJson(result.result ?? null);
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.navigation.ts
/** Registers Browser navigate and resize commands. */
function registerBrowserNavigationCommands(browser, parentOpts) {
  const parsePositiveInteger = (value, label) => {
    const parsed = parseBrowserPositiveIntegerValue(value);
    if (parsed === void 0) {
      defaultRuntime.error(danger(`Invalid ${label}: must be a positive integer`));
      defaultRuntime.exit(1);
      return;
    }
    if (parsed > 8192) {
      defaultRuntime.error(danger(`Invalid ${label}: maximum is ${ACT_MAX_VIEWPORT_DIMENSION}`));
      defaultRuntime.exit(1);
      return;
    }
    return parsed;
  };
  browser
    .command("navigate")
    .description("Navigate the current tab to a URL")
    .argument("<url>", "URL to navigate to")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (url, opts, cmd) => {
      const { parent, profile } = resolveBrowserActionContext(cmd, parentOpts);
      try {
        const result = await callBrowserRequest(
          parent,
          {
            method: "POST",
            path: "/navigate",
            query: profile ? { profile } : void 0,
            body: {
              url,
              targetId: normalizeOptionalString(opts.targetId),
            },
          },
          { timeoutMs: 2e4 },
        );
        if (parent?.json) {
          defaultRuntime.writeJson(result);
          return;
        }
        defaultRuntime.log(`navigated to ${result.url ?? url}`);
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });
  browser
    .command("resize")
    .description("Resize the viewport")
    .argument("<width>", "Viewport width")
    .argument("<height>", "Viewport height")
    .option("--target-id <id>", BROWSER_TAB_REFERENCE_HELP)
    .action(async (width, height, opts, cmd) => {
      const normalizedWidth = parsePositiveInteger(width, "width");
      const normalizedHeight = parsePositiveInteger(height, "height");
      if (normalizedWidth === void 0 || normalizedHeight === void 0) return;
      const { parent, profile } = resolveBrowserActionContext(cmd, parentOpts);
      try {
        await runBrowserResizeWithOutput({
          parent,
          profile,
          width: normalizedWidth,
          height: normalizedHeight,
          targetId: opts.targetId,
          timeoutMs: 2e4,
          successMessage: `resized to ${normalizedWidth}x${normalizedHeight}`,
        });
      } catch (err) {
        defaultRuntime.error(danger(String(err)));
        defaultRuntime.exit(1);
      }
    });
}
//#endregion
//#region extensions/browser/src/cli/browser-cli-actions-input/register.ts
/** Registers navigation, element, file/download, form, wait, and evaluate commands. */
function registerBrowserActionInputCommands(browser, parentOpts) {
  registerBrowserNavigationCommands(browser, parentOpts);
  registerBrowserElementCommands(browser, parentOpts);
  registerBrowserFilesAndDownloadsCommands(browser, parentOpts);
  registerBrowserFormWaitEvalCommands(browser, parentOpts);
}
//#endregion
export { registerBrowserActionInputCommands };
