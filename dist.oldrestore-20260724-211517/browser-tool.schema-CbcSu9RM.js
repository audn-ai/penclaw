import { Type } from "typebox";
import "./channel-actions-C9vNf9jw.js";
import { n as ACT_MAX_VIEWPORT_DIMENSION } from "./act-policy-DJo1OgjZ.js";
import {
  a as optionalPositiveIntegerSchema,
  i as optionalNonNegativeIntegerSchema,
  o as optionalStringEnum,
  r as optionalFiniteNumberSchema,
  s as stringEnum,
} from "./typebox-D411BFJf.js";
//#region extensions/browser/src/browser-tool-description.ts
/** Build the Browser tool guidance shared by lazy registration and runtime execution. */
function describeBrowserTool(opts) {
  return [
    "Control the browser via OpenClaw's browser control server (status/start/stop/profiles/tabs/open/snapshot/screenshot/download/actions).",
    "Browser choice: omit profile to use the configured default (normally the isolated OpenClaw-managed `openclaw` browser).",
    "When existing logins/cookies matter, use action=profiles to inspect available profiles, then select the appropriate profile by name. Do not assume a profile name. Use only when the task requires an existing session and the user has authorized it.",
    "Use action=importprofile on macOS to copy cookies from an authorized Chrome-family system profile into a fresh managed profile; this may show a Keychain consent prompt.",
    "For Chrome MCP existing-session profiles, omit timeoutMs on act:type, hover, scrollIntoView, drag, select, and fill; that driver rejects per-call timeout overrides for those actions. act:evaluate supports timeoutMs.",
    'When a node-hosted browser proxy is available, the tool may auto-route to it. Pin a node with node=<id|name> or target="node".',
    "When using refs from snapshot (e.g. e12), keep the same tab: prefer passing targetId from the snapshot response into subsequent actions (act/click/type/etc). For tab operations, targetId also accepts tabId handles (t1) and labels from action=tabs.",
    "For multi-step browser work, login checks, stale refs, duplicate tabs, or Google Meet flows, use the bundled browser-automation skill when it is available.",
    'For stable, self-resolving refs across calls, use snapshot with refs="aria" (Playwright aria-ref ids). Default refs="role" are role+name-based.',
    "Use snapshot+act for UI automation. Avoid act:wait by default; use only in exceptional cases when no reliable UI state exists.",
    "For file chooser uploads, pass the trigger ref with paths in the same upload call when available; use paths-only arming only when a later trigger is intentional. Use inputRef or element to set a file input directly.",
    `target selects browser location (sandbox|host|node). Default: ${opts.targetDefault}.`,
    opts.hostHint,
  ].join(" ");
}
//#endregion
//#region extensions/browser/src/browser-tool.schema.ts
/**
 * JSON schema for the Browser agent tool.
 *
 * The schema stays intentionally flat because provider function-tool validators
 * reject several nested union shapes that TypeBox can otherwise emit.
 */
const BROWSER_ACT_KINDS = [
  "batch",
  "click",
  "clickCoords",
  "type",
  "press",
  "hover",
  "scrollIntoView",
  "drag",
  "select",
  "fill",
  "resize",
  "wait",
  "evaluate",
  "close",
];
const BROWSER_TOOL_ACTIONS = [
  "doctor",
  "status",
  "start",
  "stop",
  "profiles",
  "importprofile",
  "tabs",
  "open",
  "focus",
  "close",
  "snapshot",
  "screenshot",
  "navigate",
  "console",
  "pdf",
  "download",
  "waitfordownload",
  "upload",
  "dialog",
  "act",
];
const BROWSER_TARGETS = ["sandbox", "host", "node"];
const BROWSER_SNAPSHOT_FORMATS = ["aria", "ai"];
const BROWSER_SNAPSHOT_MODES = ["efficient"];
const BROWSER_SNAPSHOT_REFS = ["role", "aria"];
const BROWSER_IMAGE_TYPES = ["png", "jpeg"];
const TAB_REFERENCE_DESCRIPTION =
  "Tab reference. Prefer suggestedTargetId, tabId, or label from tabs output; raw CDP targetId and unique raw prefixes remain supported for compatibility.";
const BrowserActSchema = Type.Object({
  kind: stringEnum(BROWSER_ACT_KINDS),
  targetId: Type.Optional(Type.String({ description: TAB_REFERENCE_DESCRIPTION })),
  ref: Type.Optional(Type.String()),
  actions: Type.Optional(Type.Array(Type.Object({}, { additionalProperties: true }))),
  stopOnError: Type.Optional(Type.Boolean()),
  doubleClick: Type.Optional(Type.Boolean()),
  button: Type.Optional(Type.String()),
  modifiers: Type.Optional(Type.Array(Type.String())),
  x: optionalFiniteNumberSchema(),
  y: optionalFiniteNumberSchema(),
  text: Type.Optional(Type.String()),
  submit: Type.Optional(Type.Boolean()),
  slowly: Type.Optional(Type.Boolean()),
  key: Type.Optional(Type.String()),
  delayMs: optionalNonNegativeIntegerSchema(),
  startRef: Type.Optional(Type.String()),
  endRef: Type.Optional(Type.String()),
  values: Type.Optional(Type.Array(Type.String())),
  fields: Type.Optional(Type.Array(Type.Object({}, { additionalProperties: true }))),
  width: optionalPositiveIntegerSchema({ maximum: ACT_MAX_VIEWPORT_DIMENSION }),
  height: optionalPositiveIntegerSchema({ maximum: ACT_MAX_VIEWPORT_DIMENSION }),
  timeMs: optionalNonNegativeIntegerSchema(),
  selector: Type.Optional(Type.String()),
  url: Type.Optional(Type.String()),
  loadState: Type.Optional(Type.String()),
  textGone: Type.Optional(Type.String()),
  timeoutMs: optionalPositiveIntegerSchema(),
  fn: Type.Optional(Type.String()),
});
/** Provider-compatible Browser tool argument schema. */
const BrowserToolSchema = Type.Object({
  action: stringEnum(BROWSER_TOOL_ACTIONS),
  target: optionalStringEnum(BROWSER_TARGETS),
  node: Type.Optional(Type.String()),
  profile: Type.Optional(Type.String()),
  browser: Type.Optional(Type.String()),
  systemProfile: Type.Optional(Type.String()),
  into: Type.Optional(Type.String()),
  domains: Type.Optional(Type.Array(Type.String())),
  targetUrl: Type.Optional(Type.String()),
  url: Type.Optional(Type.String()),
  targetId: Type.Optional(Type.String({ description: TAB_REFERENCE_DESCRIPTION })),
  label: Type.Optional(Type.String()),
  limit: optionalPositiveIntegerSchema(),
  maxChars: optionalNonNegativeIntegerSchema(),
  mode: optionalStringEnum(BROWSER_SNAPSHOT_MODES),
  snapshotFormat: optionalStringEnum(BROWSER_SNAPSHOT_FORMATS),
  refs: optionalStringEnum(BROWSER_SNAPSHOT_REFS),
  interactive: Type.Optional(Type.Boolean()),
  compact: Type.Optional(Type.Boolean()),
  depth: optionalNonNegativeIntegerSchema(),
  selector: Type.Optional(Type.String()),
  frame: Type.Optional(Type.String()),
  labels: Type.Optional(Type.Boolean()),
  urls: Type.Optional(Type.Boolean()),
  fullPage: Type.Optional(Type.Boolean()),
  ref: Type.Optional(Type.String()),
  path: Type.Optional(Type.String()),
  element: Type.Optional(Type.String()),
  type: optionalStringEnum(BROWSER_IMAGE_TYPES),
  level: Type.Optional(Type.String()),
  paths: Type.Optional(Type.Array(Type.String())),
  inputRef: Type.Optional(Type.String()),
  timeoutMs: optionalPositiveIntegerSchema(),
  dialogId: Type.Optional(Type.String()),
  accept: Type.Optional(Type.Boolean()),
  promptText: Type.Optional(Type.String()),
  kind: Type.Optional(stringEnum(BROWSER_ACT_KINDS)),
  actions: Type.Optional(Type.Array(Type.Object({}, { additionalProperties: true }))),
  stopOnError: Type.Optional(Type.Boolean()),
  doubleClick: Type.Optional(Type.Boolean()),
  button: Type.Optional(Type.String()),
  modifiers: Type.Optional(Type.Array(Type.String())),
  x: optionalFiniteNumberSchema(),
  y: optionalFiniteNumberSchema(),
  text: Type.Optional(Type.String()),
  submit: Type.Optional(Type.Boolean()),
  slowly: Type.Optional(Type.Boolean()),
  key: Type.Optional(Type.String()),
  delayMs: optionalNonNegativeIntegerSchema(),
  startRef: Type.Optional(Type.String()),
  endRef: Type.Optional(Type.String()),
  values: Type.Optional(Type.Array(Type.String())),
  fields: Type.Optional(Type.Array(Type.Object({}, { additionalProperties: true }))),
  width: optionalPositiveIntegerSchema({ maximum: ACT_MAX_VIEWPORT_DIMENSION }),
  height: optionalPositiveIntegerSchema({ maximum: ACT_MAX_VIEWPORT_DIMENSION }),
  timeMs: optionalNonNegativeIntegerSchema(),
  textGone: Type.Optional(Type.String()),
  loadState: Type.Optional(Type.String()),
  fn: Type.Optional(Type.String()),
  request: Type.Optional(BrowserActSchema),
});
//#endregion
export { describeBrowserTool as n, BrowserToolSchema as t };
