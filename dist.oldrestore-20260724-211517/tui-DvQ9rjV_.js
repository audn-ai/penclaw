import { execFileSync, spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import "./src-Bl7G9qvi.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Box,
  CombinedAutocompleteProvider,
  Container,
  Editor,
  Input,
  Key,
  Loader,
  Markdown,
  ProcessTerminal,
  SelectList,
  SettingsList,
  Spacer,
  TUI,
  Text,
  isKeyRelease,
  matchesKey,
  truncateToWidth,
} from "@earendil-works/pi-tui";
import chalk from "chalk";
import { n as normalizeAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId } from "./agent-scope-config-DVIR1nBa.js";
import { l as resolveAgentIdByWorkspacePath } from "./agent-scope-y9xQv_q1.js";
import { r as stripAnsi$1, s as visibleWidth } from "./ansi-D4OHEz5F.js";
import { n as isApprovalStaleError } from "./approval-errors-BEB18t3G.js";
import { r as formatRawAssistantErrorForUi } from "./assistant-error-format-G5Se-DL7.js";
import { o as isChatStopCommandText } from "./chat-abort-DGc7CDOP.js";
import { n as extractAssistantVisibleText } from "./chat-message-content-CeBHi_A4.js";
import {
  a as parseGoalCommand,
  n as formatGoalResumeContinuationPrompt,
  t as formatGoalContinuationPrompt,
} from "./commands-goal-8338SFRd.js";
import {
  n as listChatCommands,
  r as listChatCommandsForConfig,
} from "./commands-registry-list-dryYO7Ry.js";
import { i as resolveTextCommand } from "./commands-registry-normalize-C6c5CQe0.js";
import { n as shouldForwardModelCommandToServer } from "./commands-registry.data-uuI1tQ04.js";
import { s as setConsoleSubsystemFilter } from "./console-CspqtrUy.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { i as classifyFailoverReason } from "./errors-BwoE4095.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { n as formatTimeAgo, t as formatRelativeTimestamp } from "./format-relative-Bjc3l98W.js";
import { t as normalizeGroupActivation } from "./group-activation-MKTJBUwi.js";
import "./model-ref-shared-Bs7ONe2Q.js";
import "./config-BDv-QbJ6.js";
import { u as tryProcessCwd } from "./home-dir-DxrrpDft.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { t as resolveLocalRunShutdownGraceMs } from "./local-run-shutdown-BiT-iHb_.js";
import { t as modelKey } from "./model-key-BaNhQShd.js";
import { r as resolveSessionInfoModelSelection } from "./model-selection-display-C8q7c9oG.js";
import { i as isLoopbackHost } from "./net-BpMGIYrw.js";
import { o as asDateTimestampMs } from "./number-coercion-CJQ8TR--.js";
import { y as resolveStateDir } from "./paths-DEklnbzU.js";
import { t as privateFileStore } from "./private-file-store-BSksaLX_.js";
import "./usage-format-D2Sx-NyU.js";
import "./embedded-agent-helpers-DH71Di6x.js";
import { m as isAuthErrorMessage } from "./sanitize-user-facing-text-B_JqK9fo.js";
import {
  i as buildAgentMainSessionKey,
  l as normalizeMainKey,
  r as agentSessionKeysMatchByRequestKey,
} from "./session-key-druuY-GG.js";
import { c as parseAgentSessionKey } from "./session-key-utils-B8sNp9l4.js";
import { t as loggingState } from "./state-CZ7QadD1.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import "./commands-registry-CqMJIODs.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { i as stripLeadingInboundMetadata } from "./strip-inbound-meta-CbJ4Y6Dq.js";
import { t as chunkTextByBreakResolver } from "./text-chunking-B6X1chGx.js";
import { r as listThinkingLevelLabels, t as formatThinkingLevels } from "./thinking-CVcRbjTC.js";
import {
  f as resolveResponseUsageMode,
  i as isSessionDefaultDirectiveValue,
  l as normalizeUsageDisplay,
} from "./thinking.shared-BWnbgBUO.js";
import { t as formatTokenCount } from "./token-format-D942KbWN.js";
import { r as resolveToolDisplay, t as formatToolDetail } from "./tool-display-D6v1e5bQ.js";
import { c as registerUncaughtExceptionHandler } from "./unhandled-rejections-DwDskC0u.js";
import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
import {
  i as resolveTrustedWindowsCmdExe,
  n as isWindowsBatchCommand,
  t as buildWindowsCmdExeCommandLine,
} from "./windows-command-DMZlx6HX.js";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-Cnzi1kc9.js";
//#region src/tui/commands.ts
const VERBOSE_LEVELS = ["on", "off"];
const TRACE_LEVELS = ["on", "off"];
const FAST_LEVELS = ["status", "auto", "on", "off"];
const REASONING_LEVELS = ["on", "off"];
const ELEVATED_LEVELS = ["on", "off", "ask", "full"];
const ACTIVATION_LEVELS = ["mention", "always"];
const USAGE_FOOTER_LEVELS = ["off", "tokens", "full", "reset", "inherit", "clear", "default"];
const COMMAND_ALIASES = { gwstatus: "gateway-status" };
const LOCAL_TUI_ROUTED_SHARED_COMMANDS = /* @__PURE__ */ new Set(["btw", "goal", "stop"]);
function createLevelCompletion(levels) {
  return (prefix) =>
    levels
      .filter((value) => value.startsWith(normalizeLowercaseStringOrEmpty(prefix)))
      .map((value) => ({
        value,
        label: value,
      }));
}
function normalizeSlashCommandName(value) {
  return value.replace(/^\//, "").trim();
}
function appendSlashCommand(commands, seen, name, description) {
  const normalizedName = normalizeSlashCommandName(name);
  if (!normalizedName || seen.has(normalizedName)) return;
  seen.add(normalizedName);
  commands.push({
    name: normalizedName,
    description,
  });
}
function parseCommand(input) {
  const sharedCommand = resolveTextCommand(input);
  if (sharedCommand)
    return {
      name: sharedCommand.command.key,
      args: sharedCommand.args ?? "",
    };
  const trimmed = input.replace(/^\//, "").trim();
  if (!trimmed)
    return {
      name: "",
      args: "",
    };
  const [name, ...rest] = trimmed.split(/\s+/);
  const normalized = normalizeLowercaseStringOrEmpty(name);
  return {
    name: COMMAND_ALIASES[normalized] ?? normalized,
    args: rest.join(" ").trim(),
  };
}
/** Whether a slash input belongs to the shared Gateway command registry. */
function isSharedTextCommand(input) {
  return resolveTextCommand(input) !== null;
}
function getSlashCommands(options = {}) {
  const thinkLevels = options.thinkingLevels?.length
    ? options.thinkingLevels.map((level) => level.label)
    : listThinkingLevelLabels(options.provider, options.model, void 0, options.agentRuntime);
  const verboseCompletions = createLevelCompletion(VERBOSE_LEVELS);
  const traceCompletions = createLevelCompletion(TRACE_LEVELS);
  const fastCompletions = createLevelCompletion(FAST_LEVELS);
  const reasoningCompletions = createLevelCompletion(REASONING_LEVELS);
  const usageCompletions = createLevelCompletion(USAGE_FOOTER_LEVELS);
  const elevatedCompletions = createLevelCompletion(ELEVATED_LEVELS);
  const activationCompletions = createLevelCompletion(ACTIVATION_LEVELS);
  const commands = [
    {
      name: "help",
      description: "Show slash command help",
    },
    {
      name: "gateway-status",
      description: "Show gateway status summary",
    },
    {
      name: "gwstatus",
      description: "Alias for /gateway-status",
    },
    ...(options.local
      ? [
          {
            name: "auth",
            description: "Run provider auth/login flow",
          },
        ]
      : []),
    {
      name: "agent",
      description: "Switch agent (or open picker)",
    },
    {
      name: "agents",
      description: "Open agent picker",
    },
    {
      name: "crestodian",
      description: "Return to Crestodian",
    },
    {
      name: "session",
      description: "Switch session (or open picker)",
    },
    {
      name: "sessions",
      description: "Open session picker",
    },
    {
      name: "model",
      description: "Set model (or open picker)",
    },
    {
      name: "models",
      description: "Open model picker",
    },
    {
      name: "think",
      description: "Set thinking level",
      getArgumentCompletions: (prefix) =>
        thinkLevels
          .filter((v) => v.startsWith(normalizeLowercaseStringOrEmpty(prefix)))
          .map((value) => ({
            value,
            label: value,
          })),
    },
    {
      name: "fast",
      description: "Set fast mode auto/on/off",
      getArgumentCompletions: fastCompletions,
    },
    {
      name: "verbose",
      description: "Set verbose on/off",
      getArgumentCompletions: verboseCompletions,
    },
    {
      name: "trace",
      description: "Set trace on/off",
      getArgumentCompletions: traceCompletions,
    },
    {
      name: "reasoning",
      description: "Set reasoning on/off",
      getArgumentCompletions: reasoningCompletions,
    },
    {
      name: "usage",
      description: "Toggle per-response usage line",
      getArgumentCompletions: usageCompletions,
    },
    {
      name: "elevated",
      description: "Set elevated on/off/ask/full",
      getArgumentCompletions: elevatedCompletions,
    },
    {
      name: "elev",
      description: "Alias for /elevated",
      getArgumentCompletions: elevatedCompletions,
    },
    {
      name: "activation",
      description: "Set group activation",
      getArgumentCompletions: activationCompletions,
    },
    {
      name: "abort",
      description: "Abort active run",
    },
    {
      name: "new",
      description: "Spawn a new isolated session",
    },
    {
      name: "reset",
      description: "Reset the current session",
    },
    {
      name: "settings",
      description: "Open settings",
    },
    {
      name: "exit",
      description: "Exit the TUI",
    },
    {
      name: "quit",
      description: "Exit the TUI",
    },
  ];
  const seen = new Set(commands.map((command) => command.name));
  const gatewayCommands = options.cfg ? listChatCommandsForConfig(options.cfg) : listChatCommands();
  for (const command of gatewayCommands) {
    if (
      options.local &&
      !seen.has(command.key) &&
      !LOCAL_TUI_ROUTED_SHARED_COMMANDS.has(command.key)
    )
      continue;
    const aliases = command.textAliases.length > 0 ? command.textAliases : [`/${command.key}`];
    for (const alias of aliases) appendSlashCommand(commands, seen, alias, command.description);
  }
  for (const command of options.dynamicCommands ?? []) {
    const aliases = command.textAliases?.length ? command.textAliases : [command.name];
    for (const alias of aliases) appendSlashCommand(commands, seen, alias, command.description);
  }
  return commands;
}
function helpText(options = {}) {
  const thinkLevels = formatThinkingLevels(
    options.provider,
    options.model,
    "|",
    void 0,
    options.agentRuntime,
  );
  return [
    "Slash commands:",
    "/help",
    ...(options.local ? [] : ["/commands", "/status"]),
    "/gateway-status",
    "/gwstatus",
    ...(options.local ? ["/auth [provider]"] : []),
    "/agent <id> (or /agents)",
    "/crestodian [request]",
    "/session <key> (or /sessions)",
    "/model <provider/model> (or /models)",
    `/think <${thinkLevels}>`,
    "/fast <status|auto|on|off>",
    "/verbose <on|off>",
    "/trace <on|off>",
    "/reasoning <on|off>",
    "/usage <off|tokens|full|reset|inherit|clear|default>",
    "/elevated <on|off|ask|full>",
    "/elev <on|off|ask|full>",
    "/activation <mention|always>",
    "/new or /reset",
    "/abort",
    "/settings",
    "/exit",
  ].join("\n");
}
//#endregion
//#region src/tui/theme/theme.ts
const DARK_TEXT = "#E8E3D5";
const LIGHT_TEXT = "#1E1E1E";
const XTERM_LEVELS = [0, 95, 135, 175, 215, 255];
function channelToSrgb(value) {
  const normalized = value / 255;
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}
function relativeLuminanceRgb(r, g, b) {
  const red = channelToSrgb(r);
  const green = channelToSrgb(g);
  const blue = channelToSrgb(b);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}
function relativeLuminanceHex(hex) {
  return relativeLuminanceRgb(
    Number.parseInt(hex.slice(1, 3), 16),
    Number.parseInt(hex.slice(3, 5), 16),
    Number.parseInt(hex.slice(5, 7), 16),
  );
}
function contrastRatio(background, foregroundHex) {
  const foreground = relativeLuminanceHex(foregroundHex);
  const lighter = Math.max(background, foreground);
  const darker = Math.min(background, foreground);
  return (lighter + 0.05) / (darker + 0.05);
}
function pickHigherContrastText(r, g, b) {
  const background = relativeLuminanceRgb(r, g, b);
  return contrastRatio(background, LIGHT_TEXT) >= contrastRatio(background, DARK_TEXT);
}
function isLightBackground() {
  const explicit = normalizeOptionalLowercaseString(process.env.OPENCLAW_THEME);
  if (explicit === "light") return true;
  if (explicit === "dark") return false;
  const colorfgbg = process.env.COLORFGBG;
  if (colorfgbg && colorfgbg.length <= 64) {
    const sep = colorfgbg.lastIndexOf(";");
    const bg = Number.parseInt(sep >= 0 ? colorfgbg.slice(sep + 1) : colorfgbg, 10);
    if (bg >= 0 && bg <= 255) {
      if (bg <= 15) return bg === 7 || bg === 15;
      if (bg >= 232) return bg >= 244;
      const cubeIndex = bg - 16;
      const bVal = expectDefined(
        XTERM_LEVELS[cubeIndex % 6],
        "xterm levels entry at cube index % 6",
      );
      const gVal = expectDefined(
        XTERM_LEVELS[Math.floor(cubeIndex / 6) % 6],
        "xterm levels entry at math.floor(cube index / 6) % 6",
      );
      return pickHigherContrastText(
        expectDefined(
          XTERM_LEVELS[Math.floor(cubeIndex / 36)],
          "xterm levels entry at math.floor(cube index / 36)",
        ),
        gVal,
        bVal,
      );
    }
  }
  return false;
}
const palette = isLightBackground()
  ? {
      text: "#1E1E1E",
      dim: "#5B6472",
      accent: "#B45309",
      accentSoft: "#C2410C",
      border: "#5B6472",
      userBg: "#F3F0E8",
      userText: "#1E1E1E",
      systemText: "#4B5563",
      toolPendingBg: "#EFF6FF",
      toolSuccessBg: "#ECFDF5",
      toolErrorBg: "#FEF2F2",
      toolTitle: "#B45309",
      toolOutput: "#374151",
      quote: "#1D4ED8",
      quoteBorder: "#2563EB",
      code: "#92400E",
      codeBorder: "#92400E",
      link: "#047857",
      error: "#DC2626",
      success: "#047857",
    }
  : {
      text: "#E8E3D5",
      dim: "#7B7F87",
      accent: "#F6C453",
      accentSoft: "#F2A65A",
      border: "#3C414B",
      userBg: "#2B2F36",
      userText: "#F3EEE0",
      systemText: "#9BA3B2",
      toolPendingBg: "#1F2A2F",
      toolSuccessBg: "#1E2D23",
      toolErrorBg: "#2F1F1F",
      toolTitle: "#F6C453",
      toolOutput: "#E1DACB",
      quote: "#8CC8FF",
      quoteBorder: "#3B4D6B",
      code: "#F0C987",
      codeBorder: "#343A45",
      link: "#7DD3A5",
      error: "#F97066",
      success: "#7DD3A5",
    };
const fg = (hex) => (text) => chalk.hex(hex)(text);
const bg = (hex) => (text) => chalk.bgHex(hex)(text);
/**
 * Render code blocks with the theme code color without pulling a parser into the base TUI path.
 * Returns an array of lines with ANSI escape codes.
 */
function highlightCode(code) {
  return code.split("\n").map((line) => fg(palette.code)(line));
}
const theme = {
  fg: fg(palette.text),
  assistantText: (text) => text,
  dim: fg(palette.dim),
  accent: fg(palette.accent),
  accentSoft: fg(palette.accentSoft),
  success: fg(palette.success),
  error: fg(palette.error),
  header: (text) => chalk.bold(fg(palette.accent)(text)),
  system: fg(palette.systemText),
  userBg: bg(palette.userBg),
  userText: fg(palette.userText),
  toolTitle: fg(palette.toolTitle),
  toolOutput: fg(palette.toolOutput),
  toolPendingBg: bg(palette.toolPendingBg),
  toolSuccessBg: bg(palette.toolSuccessBg),
  toolErrorBg: bg(palette.toolErrorBg),
  border: fg(palette.border),
  bold: (text) => chalk.bold(text),
  italic: (text) => chalk.italic(text),
};
const markdownTheme = {
  heading: (text) => chalk.bold(fg(palette.accent)(text)),
  link: (text) => fg(palette.link)(text),
  linkUrl: (text) => chalk.dim(text),
  code: (text) => fg(palette.code)(text),
  codeBlock: (text) => fg(palette.code)(text),
  codeBlockBorder: (text) => fg(palette.codeBorder)(text),
  quote: (text) => fg(palette.quote)(text),
  quoteBorder: (text) => fg(palette.quoteBorder)(text),
  hr: (text) => fg(palette.border)(text),
  listBullet: (text) => fg(palette.accentSoft)(text),
  bold: (text) => chalk.bold(text),
  italic: (text) => chalk.italic(text),
  strikethrough: (text) => chalk.strikethrough(text),
  underline: (text) => chalk.underline(text),
  highlightCode,
};
const baseSelectListTheme = {
  selectedPrefix: (text) => fg(palette.accent)(text),
  selectedText: (text) => chalk.bold(fg(palette.accent)(text)),
  description: (text) => fg(palette.dim)(text),
  scrollInfo: (text) => fg(palette.dim)(text),
  noMatch: (text) => fg(palette.dim)(text),
};
const selectListTheme = baseSelectListTheme;
const filterableSelectListTheme = {
  ...baseSelectListTheme,
  filterLabel: (text) => fg(palette.dim)(text),
};
const settingsListTheme = {
  label: (text, selected) =>
    selected ? chalk.bold(fg(palette.accent)(text)) : fg(palette.text)(text),
  value: (text, selected) => (selected ? fg(palette.accentSoft)(text) : fg(palette.dim)(text)),
  description: (text) => fg(palette.systemText)(text),
  cursor: fg(palette.accent)("→ "),
  hint: (text) => fg(palette.dim)(text),
};
const editorTheme = {
  borderColor: (text) => fg(palette.border)(text),
  selectList: selectListTheme,
};
const searchableSelectListTheme = {
  ...baseSelectListTheme,
  searchPrompt: (text) => fg(palette.accentSoft)(text),
  searchInput: (text) => fg(palette.text)(text),
  matchHighlight: (text) => chalk.bold(fg(palette.accent)(text)),
};
//#endregion
//#region src/tui/osc8-hyperlinks.ts
const SGR_PATTERN = "\\x1b\\[[0-9;]*m";
const OSC8_PATTERN = "\\x1b\\]8;;.*?(?:\\x07|\\x1b\\\\)";
const ANSI_RE = new RegExp(`${SGR_PATTERN}|${OSC8_PATTERN}`, "g");
const SGR_START_RE = new RegExp(`^${SGR_PATTERN}`);
const OSC8_START_RE = new RegExp(`^${OSC8_PATTERN}`);
/** Allow one level of balanced parentheses inside a URL so markdown link
 *  targets like `https://en.wikipedia.org/wiki/URL_(disambiguation)` are
 *  fully captured instead of truncated at the first `)`. */
const URL_PATH_WITH_PARENS = /https?:\/\/[^()\s<>]+(?:\([^()\s<>]*\)[^()\s<>]*)*/g;
/** Strip the suffix starting at a `)` without a matching `(` in the URL.
 *  Bare URLs in prose can pick up a trailing `)` that belongs to surrounding
 *  punctuation, e.g. `(see https://example.com/path)` — the `)` after `path`
 *  and anything after it are sentence punctuation, not part of the URL. */
function trimUnbalancedTrailingParens(url) {
  let open = 0;
  for (let index = 0; index < url.length; index++) {
    const ch = url[index];
    if (ch === "(") open++;
    else if (ch === ")") {
      if (open === 0) return url.slice(0, index);
      open--;
    }
  }
  return url;
}
function hasUrlContent(url) {
  const authority = expectDefined(
    url.slice(url.indexOf("://") + 3).split(/[/?#]/, 1)[0],
    'url.slice(url.index of("://") + 3).split(/[/?#]/, 1) entry at 0',
  );
  return /[\p{L}\p{N}]/u.test(authority) || /^\[[0-9a-f:.]+\](?::\d+)?$/i.test(authority);
}
/**
 * Extract all unique URLs from raw markdown text.
 * Finds both bare URLs and markdown link hrefs [text](url).
 */
function extractUrls(markdown) {
  const urls = /* @__PURE__ */ new Set();
  const mdLinkRe = new RegExp(
    `\\[(?:[^\\]]*)\\]\\(\\s*<?(${URL_PATH_WITH_PARENS.source})>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
    "g",
  );
  let m;
  while ((m = mdLinkRe.exec(markdown)) !== null)
    if (hasUrlContent(expectDefined(m[1], "m capture group 1")))
      urls.add(expectDefined(m[1], "m capture group 1"));
  const stripped = markdown.replace(mdLinkRe, "");
  const bareRe = /https?:\/\/(?:\[[0-9a-f:.]+\](?::\d+)?[^\s\]>]*|[^\s[\]>]+)/gi;
  while ((m = bareRe.exec(stripped)) !== null) {
    const url = trimUnbalancedTrailingParens(m[0]);
    if (hasUrlContent(url)) urls.add(url);
  }
  return [...urls];
}
/** Strip ANSI SGR and OSC 8 sequences to get visible text. */
function stripAnsi(input) {
  return input.replace(ANSI_RE, "");
}
/**
 * Find URL ranges in a line's visible text, handling cross-line URL splits.
 */
function findUrlRanges(visibleText, knownUrls, pending, nextVisibleText) {
  const ranges = [];
  let newPending = null;
  let searchFrom = 0;
  if (pending) {
    const remaining = pending.url.slice(pending.consumed);
    const trimmed = visibleText.trimStart();
    const leadingSpaces = visibleText.length - trimmed.length;
    let matchLen = 0;
    for (let j = 0; j < remaining.length && j < trimmed.length; j++)
      if (remaining[j] === trimmed[j]) matchLen++;
      else break;
    if (matchLen > 0) {
      ranges.push({
        start: leadingSpaces,
        end: leadingSpaces + matchLen,
        url: pending.url,
      });
      searchFrom = leadingSpaces + matchLen;
      if (pending.consumed + matchLen < pending.url.length)
        newPending = {
          url: pending.url,
          consumed: pending.consumed + matchLen,
        };
    }
  }
  const urlRe = /https?:\/\/(?:\[[0-9a-f:.]+\](?::\d+)?[^\s\]>]*|[^\s[\]>]*)/gi;
  urlRe.lastIndex = searchFrom;
  let match;
  while ((match = urlRe.exec(visibleText)) !== null) {
    const fragment = trimUnbalancedTrailingParens(match[0]);
    const start = match.index;
    let resolvedUrl = fragment;
    let found = false;
    if (!hasUrlContent(fragment)) {
      if (
        !(fragment === match[0] && visibleText.slice(start + match[0].length).trim().length === 0)
      )
        continue;
      const nextFragment = trimUnbalancedTrailingParens(
        nextVisibleText?.trimStart().match(/^[^\s\]>]+/)?.[0] ?? "",
      );
      for (const known of knownUrls) {
        if (!known.startsWith(fragment)) continue;
        const remaining = known.slice(fragment.length);
        if (
          nextFragment.length > 0 &&
          remaining.startsWith(nextFragment) &&
          known.length > resolvedUrl.length
        ) {
          resolvedUrl = known;
          found = true;
        }
      }
      if (!found) continue;
    }
    if (!found) {
      for (const known of knownUrls)
        if (known === fragment) {
          resolvedUrl = known;
          found = true;
          break;
        }
    }
    if (!found) {
      let bestLen = 0;
      for (const known of knownUrls)
        if (known.startsWith(fragment) && known.length > bestLen) {
          resolvedUrl = known;
          bestLen = known.length;
          found = true;
        }
    }
    if (!found) {
      let bestLen = 0;
      for (const known of knownUrls)
        if (fragment.startsWith(known) && known.length > bestLen) {
          resolvedUrl = known;
          bestLen = known.length;
        }
    }
    ranges.push({
      start,
      end: start + fragment.length,
      url: resolvedUrl,
    });
    if (resolvedUrl.length > fragment.length && resolvedUrl.startsWith(fragment))
      newPending = {
        url: resolvedUrl,
        consumed: fragment.length,
      };
  }
  return {
    ranges,
    pending: newPending,
  };
}
/**
 * Apply OSC 8 hyperlink sequences to a line based on visible-text URL ranges.
 * Walks through the raw string character by character, inserting OSC 8
 * open/close sequences at URL range boundaries while preserving ANSI codes.
 */
function applyOsc8Ranges(line, ranges) {
  if (ranges.length === 0) return line;
  const urlAt = /* @__PURE__ */ new Map();
  for (const r of ranges) for (let p = r.start; p < r.end; p++) urlAt.set(p, r.url);
  let result = "";
  let visiblePos = 0;
  let activeUrl = null;
  let i = 0;
  while (i < line.length) {
    if (line.charCodeAt(i) === 27) {
      const sgr = line.slice(i).match(SGR_START_RE);
      if (sgr) {
        result += sgr[0];
        i += sgr[0].length;
        continue;
      }
      const osc = line.slice(i).match(OSC8_START_RE);
      if (osc) {
        result += osc[0];
        i += osc[0].length;
        continue;
      }
    }
    const targetUrl = urlAt.get(visiblePos) ?? null;
    if (targetUrl !== activeUrl) {
      if (activeUrl !== null) result += "\x1B]8;;\x07";
      if (targetUrl !== null) result += `\x1b]8;;${targetUrl}\x07`;
      activeUrl = targetUrl;
    }
    result += line[i];
    visiblePos++;
    i++;
  }
  if (activeUrl !== null) result += "\x1B]8;;\x07";
  return result;
}
/**
 * Add OSC 8 hyperlinks to rendered lines using a pre-extracted URL list.
 *
 * For each line, finds URL-like substrings in the visible text, matches them
 * against known URLs, and wraps each fragment with OSC 8 escape sequences.
 * Handles URLs broken across multiple lines by pi-tui's word wrapping.
 */
function addOsc8Hyperlinks(lines, urls) {
  if (urls.length === 0) return lines;
  let pending = null;
  const visibleLines = lines.map(stripAnsi);
  return lines.map((line, index) => {
    const result = findUrlRanges(
      expectDefined(visibleLines[index], "visible lines entry at index"),
      urls,
      pending,
      visibleLines[index + 1],
    );
    pending = result.pending;
    return applyOsc8Ranges(line, result.ranges);
  });
}
//#endregion
//#region src/tui/components/hyperlink-markdown.ts
/**
 * Wrapper around pi-tui's Markdown component that adds OSC 8 terminal
 * hyperlinks to rendered output, making URLs clickable even when broken
 * across multiple lines by word wrapping.
 */
var HyperlinkMarkdown = class {
  constructor(text, paddingX, paddingY, theme, options) {
    this.inner = new Markdown(text, paddingX, paddingY, theme, options);
    this.urls = extractUrls(text);
  }
  render(width) {
    return addOsc8Hyperlinks(this.inner.render(width), this.urls);
  }
  setText(text) {
    this.inner.setText(text);
    this.urls = extractUrls(text);
  }
  invalidate() {
    this.inner.invalidate();
  }
};
//#endregion
//#region src/tui/components/assistant-message.ts
var AssistantMessageComponent = class extends Container {
  constructor(text) {
    super();
    this.body = new HyperlinkMarkdown(text, 0, 0, markdownTheme, {
      color: (line) => theme.assistantText(line),
    });
    this.addChild(new Spacer(1));
    this.addChild(this.body);
  }
  setText(text) {
    this.body.setText(text);
  }
};
//#endregion
//#region src/tui/components/btw-inline-message.ts
/** Renders a dismissible BTW result, with error text or assistant markdown content. */
var BtwInlineMessage = class extends Container {
  constructor(params) {
    super();
    this.setResult(params);
  }
  /** Replaces the current BTW content without reallocating the host component. */
  setResult(params) {
    this.clear();
    this.addChild(new Spacer(1));
    this.addChild(new Text(theme.header(`BTW: ${params.question}`), 1, 0));
    if (params.isError) this.addChild(new Text(theme.error(params.text), 1, 0));
    else this.addChild(new AssistantMessageComponent(params.text));
    this.addChild(new Text(theme.dim("Press Enter or Esc to dismiss"), 1, 0));
  }
};
//#endregion
//#region src/tui/tui-formatters.ts
const REPLACEMENT_CHAR_RE = /\uFFFD/g;
const MAX_TOKEN_CHARS = 32;
const LONG_TOKEN_RE = /\S{33,}/g;
const LONG_TOKEN_TEST_RE = /\S{33,}/;
const BINARY_LINE_REPLACEMENT_THRESHOLD = 12;
const URL_PREFIX_RE = /^(https?:\/\/|file:\/\/)/i;
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const FILE_LIKE_RE = /^[a-zA-Z0-9._-]+$/;
const EDGE_PUNCTUATION_RE = /^[`"'([{<]+|[`"')\]}>.,:;!?]+$/g;
const ALPHANUMERIC_RE = /[A-Za-z0-9]/;
const TOKENISH_MIN_LENGTH = 24;
const RTL_SCRIPT_RE = /[\u0590-\u08ff\ufb1d-\ufdff\ufe70-\ufefc]/;
const CJK_SCRIPT_RE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const BIDI_CONTROL_RE = /[\u202a-\u202e\u2066-\u2069]/;
const RTL_ISOLATE_START = "⁧";
const RTL_ISOLATE_END = "⁩";
const FENCED_CODE_RE = /(```|~~~)[^\n]*\n[\s\S]*?\n\1[^\n]*/g;
const INLINE_CODE_RE = /(`+)(?:(?!\1).)+?\1/g;
function hasControlChars(text) {
  for (const char of text) {
    const code = char.charCodeAt(0);
    if ((code <= 31 && code !== 9 && code !== 10 && code !== 13) || (code >= 127 && code <= 159))
      return true;
  }
  return false;
}
function stripControlChars(text) {
  if (!hasControlChars(text)) return text;
  let sanitized = "";
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (!(code <= 31 && code !== 9 && code !== 10 && code !== 13) && !(code >= 127 && code <= 159))
      sanitized += char;
  }
  return sanitized;
}
function isCopySensitiveToken(token) {
  const candidate = token.replace(EDGE_PUNCTUATION_RE, "") || token;
  if (URL_PREFIX_RE.test(candidate)) return true;
  if (
    candidate.startsWith("/") ||
    candidate.startsWith("~/") ||
    candidate.startsWith("./") ||
    candidate.startsWith("../")
  )
    return true;
  if (WINDOWS_DRIVE_RE.test(candidate) || candidate.startsWith("\\\\")) return true;
  if (candidate.includes("/") || candidate.includes("\\")) return true;
  if (
    FILE_LIKE_RE.test(candidate) &&
    (candidate.includes("_") || candidate.includes("-") || candidate.includes("."))
  )
    return true;
  if (candidate.length >= TOKENISH_MIN_LENGTH && /[a-z]/i.test(candidate) && /\d/.test(candidate))
    return true;
  return false;
}
function normalizeLongTokenForDisplay(token) {
  if (isCopySensitiveToken(token)) return token;
  if (CJK_SCRIPT_RE.test(token)) return token;
  if (!ALPHANUMERIC_RE.test(token)) return token;
  return chunkTextByBreakResolver(token, MAX_TOKEN_CHARS, () => MAX_TOKEN_CHARS).join(" ");
}
function partitionByRegex(text, re) {
  const parts = [];
  let lastIndex = 0;
  for (const match of text.matchAll(re)) {
    const start = match.index ?? 0;
    if (start > lastIndex)
      parts.push({
        kind: "prose",
        text: text.slice(lastIndex, start),
      });
    parts.push({
      kind: "code",
      text: match[0],
    });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < text.length)
    parts.push({
      kind: "prose",
      text: text.slice(lastIndex),
    });
  return parts;
}
function transformOutsideCode(text, transform) {
  return partitionByRegex(text, FENCED_CODE_RE)
    .map((seg) => {
      if (seg.kind === "code") return seg.text;
      return partitionByRegex(seg.text, INLINE_CODE_RE)
        .map((s) => (s.kind === "code" ? s.text : transform(s.text)))
        .join("");
    })
    .join("");
}
function redactBinaryLikeLine(line) {
  const replacementCount = (line.match(REPLACEMENT_CHAR_RE) || []).length;
  if (replacementCount >= BINARY_LINE_REPLACEMENT_THRESHOLD && replacementCount * 2 >= line.length)
    return "[binary data omitted]";
  return line;
}
function isolateRtlLine(line) {
  if (!RTL_SCRIPT_RE.test(line) || BIDI_CONTROL_RE.test(line)) return line;
  return `${RTL_ISOLATE_START}${line}${RTL_ISOLATE_END}`;
}
function applyRtlIsolation(text) {
  if (!RTL_SCRIPT_RE.test(text)) return text;
  return text
    .split("\n")
    .map((line) => isolateRtlLine(line))
    .join("\n");
}
function sanitizeRenderableText(text) {
  if (!text) return text;
  const hasAnsi = text.includes("\x1B") || text.includes("") || text.includes("");
  const hasReplacementChars = text.includes("�");
  const hasLongTokens = LONG_TOKEN_TEST_RE.test(text);
  const hasControls = hasControlChars(text);
  if (!hasAnsi && !hasReplacementChars && !hasLongTokens && !hasControls)
    return applyRtlIsolation(text);
  const withoutAnsi = hasAnsi ? stripAnsi$1(text) : text;
  const withoutControlChars = hasControls ? stripControlChars(withoutAnsi) : withoutAnsi;
  const redacted = hasReplacementChars
    ? withoutControlChars
        .split("\n")
        .map((line) => redactBinaryLikeLine(line))
        .join("\n")
    : withoutControlChars;
  return applyRtlIsolation(
    LONG_TOKEN_TEST_RE.test(redacted)
      ? transformOutsideCode(redacted, (segment) =>
          LONG_TOKEN_TEST_RE.test(segment)
            ? segment.replace(LONG_TOKEN_RE, normalizeLongTokenForDisplay)
            : segment,
        )
      : redacted,
  );
}
function resolveFinalAssistantText(params) {
  const finalText = params.finalText ?? "";
  if (finalText.trim()) return finalText;
  const streamedText = params.streamedText ?? "";
  if (streamedText.trim()) return streamedText;
  const errorMessage = params.errorMessage ?? "";
  if (errorMessage.trim()) return formatRawAssistantErrorForUi(errorMessage);
  return "(no output)";
}
function composeThinkingAndContent(params) {
  const thinkingText = params.thinkingText?.trim() ?? "";
  const contentText = params.contentText?.trim() ?? "";
  const parts = [];
  if (params.showThinking && thinkingText) parts.push(`[thinking]\n${thinkingText}`);
  if (contentText) parts.push(contentText);
  return parts.join("\n\n").trim();
}
function asMessageRecord(message) {
  if (!message || typeof message !== "object") return;
  return message;
}
function resolveMessageRecord(message) {
  const record = asMessageRecord(message);
  if (!record) return;
  return {
    record,
    content: record.content,
  };
}
function formatAssistantErrorFromRecord(record) {
  if ((typeof record.stopReason === "string" ? record.stopReason : "") !== "error") return "";
  return formatRawAssistantErrorForUi(
    typeof record.errorMessage === "string" ? record.errorMessage : "",
  );
}
function collectSanitizedBlockStrings(params) {
  if (!Array.isArray(params.content)) return [];
  const parts = [];
  for (const block of params.content) {
    if (!block || typeof block !== "object") continue;
    const rec = block;
    if (rec.type === params.blockType && typeof rec[params.valueKey] === "string")
      parts.push(sanitizeRenderableText(rec[params.valueKey]));
  }
  return parts;
}
/**
 * Extract ONLY thinking blocks from message content.
 * Model-agnostic: returns empty string if no thinking blocks exist.
 */
function extractThinkingFromMessage(message) {
  const resolved = resolveMessageRecord(message);
  if (!resolved) return "";
  const { content } = resolved;
  if (typeof content === "string") return "";
  return collectSanitizedBlockStrings({
    content,
    blockType: "thinking",
    valueKey: "thinking",
  })
    .join("\n")
    .trim();
}
/**
 * Extract ONLY text content blocks from message (excludes thinking).
 * Model-agnostic: works for any model with text content blocks.
 */
function extractContentFromMessage(message) {
  const resolved = resolveMessageRecord(message);
  if (!resolved) return "";
  const { record, content } = resolved;
  if (record.role === "assistant") {
    if (typeof content === "string") return sanitizeRenderableText(content).trim();
    if (Array.isArray(content)) return extractAssistantRenderableContent(record);
  }
  if (typeof content === "string") return sanitizeRenderableText(content).trim();
  const parts = collectSanitizedBlockStrings({
    content,
    blockType: "text",
    valueKey: "text",
  });
  if (parts.length > 0) return parts.join("\n").trim();
  return formatAssistantErrorFromRecord(record);
}
function extractAssistantRenderableContent(record) {
  const content = [
    sanitizeRenderableText(extractAssistantVisibleText(record) ?? "").trim(),
    extractPairingQrTerminalText(record),
  ]
    .filter(Boolean)
    .join("\n\n")
    .trim();
  if (content) return content;
  return formatAssistantErrorFromRecord(record);
}
function extractPairingQrTerminalText(record) {
  const content = record.content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const blockRecord = block;
    if (
      blockRecord.type === "openclaw_pairing_qr" &&
      typeof blockRecord.terminalText === "string"
    ) {
      const text = sanitizeRenderableText(blockRecord.terminalText).trim();
      if (text) parts.push(text);
    }
  }
  return parts.join("\n\n").trim();
}
function extractTextBlocks(content, opts) {
  if (typeof content === "string") return sanitizeRenderableText(content).trim();
  if (!Array.isArray(content)) return "";
  const textParts = collectSanitizedBlockStrings({
    content,
    blockType: "text",
    valueKey: "text",
  });
  return composeThinkingAndContent({
    thinkingText: (opts?.includeThinking === true
      ? collectSanitizedBlockStrings({
          content,
          blockType: "thinking",
          valueKey: "thinking",
        })
      : []
    )
      .join("\n")
      .trim(),
    contentText: textParts.join("\n").trim(),
    showThinking: opts?.includeThinking ?? false,
  });
}
function extractTextFromMessage(message, opts) {
  const record = asMessageRecord(message);
  if (!record) return "";
  if (record.role === "assistant")
    return composeThinkingAndContent({
      thinkingText: extractThinkingFromMessage(record),
      contentText: extractAssistantRenderableContent(record),
      showThinking: opts?.includeThinking ?? false,
    });
  const text = extractTextBlocks(record.content, opts);
  if (text) {
    if (record.role === "user" || record.command === true) return stripLeadingInboundMetadata(text);
    return text;
  }
  const errorText = formatAssistantErrorFromRecord(record);
  if (!errorText) return "";
  return errorText;
}
function isCommandMessage(message) {
  if (!message || typeof message !== "object") return false;
  return message.command === true;
}
function formatTokens(total, context) {
  if (total == null && context == null) return "tokens ?";
  const totalLabel = total == null ? "?" : formatTokenCount(total);
  if (context == null) return `tokens ${totalLabel}`;
  const pct =
    typeof total === "number" && context > 0
      ? Math.min(999, Math.round((total / context) * 100))
      : null;
  return `tokens ${totalLabel}/${formatTokenCount(context)}${pct !== null ? ` (${pct}%)` : ""}`;
}
function formatRemoteConnectionHostFooter(connectionUrl) {
  try {
    const hostname = new URL(connectionUrl.trim()).hostname.trim();
    return hostname && !isLoopbackHost(hostname) ? `host ${hostname}` : null;
  } catch {
    return null;
  }
}
function formatGoalUsage(goal) {
  if (goal.tokenBudget === void 0)
    return goal.tokensUsed > 0 ? formatTokenCount(goal.tokensUsed) : null;
  return `${formatTokenCount(goal.tokensUsed)}/${formatTokenCount(goal.tokenBudget)}`;
}
function formatGoalFooter(goal) {
  if (!goal) return null;
  const usage = formatGoalUsage(goal);
  const suffix = usage ? ` (${usage})` : "";
  switch (goal.status) {
    case "active":
      return `Pursuing goal${suffix}`;
    case "paused":
      return "Goal paused (/goal resume)";
    case "blocked":
      return "Goal blocked (/goal resume)";
    case "usage_limited":
      return "Goal hit usage limits (/goal resume)";
    case "budget_limited":
      return `Goal unmet${suffix}`;
    case "complete":
      return `Goal achieved${suffix}`;
  }
  return null;
}
function formatContextUsageLine(params) {
  const totalLabel = typeof params.total === "number" ? formatTokenCount(params.total) : "?";
  const ctxLabel = typeof params.context === "number" ? formatTokenCount(params.context) : "?";
  const pct = typeof params.percent === "number" ? Math.min(999, Math.round(params.percent)) : null;
  const extra = [
    typeof params.remaining === "number" ? `${formatTokenCount(params.remaining)} left` : null,
    pct !== null ? `${pct}%` : null,
  ]
    .filter(Boolean)
    .join(", ");
  return `tokens ${totalLabel}/${ctxLabel}${extra ? ` (${extra})` : ""}`;
}
function asString(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}
//#endregion
//#region src/tui/components/tool-execution.ts
const PREVIEW_LINES = 12;
function formatArgs(toolName, args) {
  const detail = formatToolDetail(
    resolveToolDisplay({
      name: toolName,
      args,
    }),
  );
  if (detail) return sanitizeRenderableText(detail);
  if (!args || typeof args !== "object") return "";
  try {
    return sanitizeRenderableText(JSON.stringify(args));
  } catch {
    return "";
  }
}
function extractText(result) {
  if (!result?.content) return "";
  const lines = [];
  for (const entry of result.content)
    if (entry.type === "text" && entry.text) lines.push(sanitizeRenderableText(entry.text));
    else if (entry.type === "image") {
      const mime = entry.mimeType ?? "image";
      const size = entry.bytes ? ` ${Math.round(entry.bytes / 1024)}kb` : "";
      const omitted = entry.omitted ? " (omitted)" : "";
      lines.push(`[${mime}${size}${omitted}]`);
    }
  return lines.join("\n").trim();
}
/** Displays a running or completed tool call with optional expandable output. */
var ToolExecutionComponent = class extends Container {
  constructor(toolName, args) {
    super();
    this.expanded = false;
    this.isError = false;
    this.isPartial = true;
    this.toolName = toolName;
    this.args = args;
    this.box = new Box(1, 1, (line) => theme.toolPendingBg(line));
    this.header = new Text("", 0, 0);
    this.argsLine = new Text("", 0, 0);
    this.output = new Markdown("", 0, 0, markdownTheme, {
      color: (line) => theme.toolOutput(line),
    });
    this.addChild(new Spacer(1));
    this.addChild(this.box);
    this.box.addChild(this.header);
    this.box.addChild(this.argsLine);
    this.box.addChild(this.output);
    this.refresh();
  }
  /** Re-renders tool arguments when streaming tool call input changes. */
  setArgs(args) {
    this.args = args;
    this.refresh();
  }
  /** Toggles preview/full output rendering for long tool results. */
  setExpanded(expanded) {
    this.expanded = expanded;
    this.refresh();
  }
  /** Marks the tool call complete and renders final output. */
  setResult(result, opts) {
    this.result = result;
    this.isPartial = false;
    this.isError = Boolean(opts?.isError);
    this.refresh();
  }
  /** Renders partial output while the tool call is still running. */
  setPartialResult(result) {
    this.result = result;
    this.isPartial = true;
    this.refresh();
  }
  refresh() {
    const bg = this.isPartial
      ? theme.toolPendingBg
      : this.isError
        ? theme.toolErrorBg
        : theme.toolSuccessBg;
    this.box.setBgFn((line) => bg(line));
    const display = resolveToolDisplay({
      name: this.toolName,
      args: this.args,
    });
    const title = `${display.emoji} ${display.label}${this.isPartial ? " (running)" : ""}`;
    this.header.setText(theme.toolTitle(theme.bold(title)));
    const argLine = formatArgs(this.toolName, this.args);
    this.argsLine.setText(argLine ? theme.dim(argLine) : theme.dim(" "));
    const text = extractText(this.result) || (this.isPartial ? "…" : "");
    if (!this.expanded && text) {
      const lines = text.split("\n");
      const preview =
        lines.length > PREVIEW_LINES ? `${lines.slice(0, PREVIEW_LINES).join("\n")}\n…` : text;
      this.output.setText(preview);
    } else this.output.setText(text);
  }
};
//#endregion
//#region src/tui/components/markdown-message.ts
/** Container-backed markdown message that can update text in place. */
var MarkdownMessageComponent = class extends Container {
  constructor(text, y, options) {
    super();
    this.body = new HyperlinkMarkdown(text, 0, y, markdownTheme, options);
    this.addChild(new Spacer(1));
    this.addChild(this.body);
  }
  /** Updates the rendered markdown without replacing the component. */
  setText(text) {
    this.body.setText(text);
  }
};
//#endregion
//#region src/tui/components/user-message.ts
/** Markdown chat-log row styled as user input. */
var UserMessageComponent = class extends MarkdownMessageComponent {
  constructor(text) {
    super(text, 1, {
      bgColor: (line) => theme.userBg(line),
      color: (line) => theme.userText(line),
    });
  }
};
//#endregion
//#region src/tui/components/chat-log.ts
const PENDING_HISTORY_CLOCK_SKEW_TOLERANCE_MS = 6e4;
/** Scrollback container that tracks pending users, streaming assistant runs, tools, and notices. */
var ChatLog = class extends Container {
  constructor(maxComponents = 180) {
    super();
    this.toolById = /* @__PURE__ */ new Map();
    this.streamingRuns = /* @__PURE__ */ new Map();
    this.pendingUsers = /* @__PURE__ */ new Map();
    this.pendingSystemNotices = /* @__PURE__ */ new Map();
    this.btwMessage = null;
    this.toolsExpanded = false;
    this.repeatableSystemMessage = null;
    this.maxComponents = Math.max(20, Math.floor(maxComponents));
  }
  dropComponentReferences(component) {
    for (const [toolId, tool] of this.toolById.entries())
      if (tool === component) this.toolById.delete(toolId);
    for (const [runId, message] of this.streamingRuns.entries())
      if (message === component) this.streamingRuns.delete(runId);
    for (const [runId, entry] of this.pendingUsers.entries())
      if (entry.component === component) this.pendingUsers.delete(runId);
    for (const [runId, entry] of this.pendingSystemNotices.entries())
      if (entry === component) this.pendingSystemNotices.delete(runId);
    if (this.btwMessage === component) this.btwMessage = null;
    if (this.repeatableSystemMessage?.component === component) this.repeatableSystemMessage = null;
  }
  pruneOverflow() {
    while (this.children.length > this.maxComponents) {
      const oldest = this.children[0];
      if (!oldest) return;
      this.removeChild(oldest);
      this.dropComponentReferences(oldest);
    }
  }
  append(component) {
    this.addChild(component);
    this.pruneOverflow();
  }
  appendNonSystem(component) {
    this.repeatableSystemMessage = null;
    this.append(component);
  }
  clearAll(opts) {
    this.clear();
    this.toolById.clear();
    this.streamingRuns.clear();
    this.pendingSystemNotices.clear();
    this.btwMessage = null;
    this.repeatableSystemMessage = null;
    if (!opts?.preservePendingUsers) this.pendingUsers.clear();
  }
  clearTools() {
    for (const tool of this.toolById.values()) this.removeChild(tool);
    this.toolById.clear();
  }
  restorePendingUsers() {
    for (const entry of this.pendingUsers.values()) {
      if (this.children.includes(entry.component)) continue;
      this.appendNonSystem(entry.component);
    }
  }
  clearPendingUsers() {
    for (const entry of this.pendingUsers.values()) this.removeChild(entry.component);
    this.pendingUsers.clear();
  }
  formatRepeatedSystemText(text, count) {
    return count > 1 ? `${text} x${count}` : text;
  }
  createSystemMessage(text) {
    const entry = new Container();
    const textNode = new Text(theme.system(text), 1, 0);
    entry.addChild(new Spacer(1));
    entry.addChild(textNode);
    return {
      component: entry,
      textNode,
      baseText: text,
      count: 1,
    };
  }
  addSystem(text, opts) {
    if (
      opts?.coalesceConsecutive &&
      this.repeatableSystemMessage?.baseText === text &&
      this.children[this.children.length - 1] === this.repeatableSystemMessage.component
    ) {
      this.repeatableSystemMessage.count += 1;
      this.repeatableSystemMessage.textNode.setText(
        theme.system(this.formatRepeatedSystemText(text, this.repeatableSystemMessage.count)),
      );
      return;
    }
    const message = this.createSystemMessage(text);
    this.append(message.component);
    this.repeatableSystemMessage = opts?.coalesceConsecutive ? message : null;
  }
  addPendingSystem(runId, text) {
    const existing = this.pendingSystemNotices.get(runId);
    if (existing) this.removeChild(existing);
    const message = this.createSystemMessage(text);
    this.pendingSystemNotices.set(runId, message.component);
    this.append(message.component);
  }
  dismissPendingSystem(runId) {
    const existing = this.pendingSystemNotices.get(runId);
    if (!existing) return false;
    this.removeChild(existing);
    this.pendingSystemNotices.delete(runId);
    return true;
  }
  addUser(text) {
    this.appendNonSystem(new UserMessageComponent(text));
  }
  addPendingUser(runId, text, createdAt = Date.now()) {
    const existing = this.pendingUsers.get(runId);
    if (existing) {
      existing.text = text;
      existing.createdAt = createdAt;
      existing.component.setText(text);
      return existing.component;
    }
    const component = new UserMessageComponent(text);
    this.pendingUsers.set(runId, {
      component,
      text,
      createdAt,
    });
    this.appendNonSystem(component);
    return component;
  }
  dropPendingUser(runId) {
    const existing = this.pendingUsers.get(runId);
    if (!existing) return false;
    this.removeChild(existing.component);
    this.pendingUsers.delete(runId);
    return true;
  }
  rekeyPendingUser(fromRunId, toRunId) {
    if (fromRunId === toRunId) return false;
    const existing = this.pendingUsers.get(fromRunId);
    if (!existing) return false;
    this.pendingUsers.delete(fromRunId);
    this.pendingUsers.set(toRunId, existing);
    return true;
  }
  reconcilePendingUsers(historyUsers) {
    const normalizedHistory = historyUsers
      .map((entry) => ({
        text: entry.text.trim(),
        timestamp: typeof entry.timestamp === "number" ? entry.timestamp : null,
      }))
      .filter((entry) => entry.text.length > 0 && entry.timestamp !== null);
    const clearedRunIds = [];
    for (const [runId, entry] of this.pendingUsers.entries()) {
      const pendingText = entry.text.trim();
      if (!pendingText) continue;
      const matchIndex = normalizedHistory.findIndex(
        (historyEntry) =>
          historyEntry.text === pendingText &&
          (historyEntry.timestamp ?? 0) >=
            entry.createdAt - PENDING_HISTORY_CLOCK_SKEW_TOLERANCE_MS,
      );
      if (matchIndex === -1) continue;
      if (this.children.includes(entry.component)) this.removeChild(entry.component);
      this.pendingUsers.delete(runId);
      clearedRunIds.push(runId);
      normalizedHistory.splice(matchIndex, 1);
    }
    return clearedRunIds;
  }
  countPendingUsers() {
    return this.pendingUsers.size;
  }
  resolveRunId(runId) {
    return runId ?? "default";
  }
  startAssistant(text, runId) {
    const effectiveRunId = this.resolveRunId(runId);
    const existing = this.streamingRuns.get(effectiveRunId);
    if (existing) {
      existing.setText(text);
      return existing;
    }
    const component = new AssistantMessageComponent(text);
    this.streamingRuns.set(effectiveRunId, component);
    this.appendNonSystem(component);
    return component;
  }
  reserveAssistantSlot(runId) {
    const effectiveRunId = this.resolveRunId(runId);
    const existing = this.streamingRuns.get(effectiveRunId);
    if (existing) return existing;
    return this.startAssistant("", runId);
  }
  updateAssistant(text, runId) {
    const effectiveRunId = this.resolveRunId(runId);
    const existing = this.streamingRuns.get(effectiveRunId);
    if (!existing) {
      this.startAssistant(text, runId);
      return;
    }
    existing.setText(text);
  }
  finalizeAssistant(text, runId) {
    const effectiveRunId = this.resolveRunId(runId);
    const existing = this.streamingRuns.get(effectiveRunId);
    if (existing) {
      existing.setText(text);
      this.streamingRuns.delete(effectiveRunId);
      return;
    }
    this.appendNonSystem(new AssistantMessageComponent(text));
  }
  dropAssistant(runId) {
    const effectiveRunId = this.resolveRunId(runId);
    const existing = this.streamingRuns.get(effectiveRunId);
    if (!existing) return;
    this.removeChild(existing);
    this.streamingRuns.delete(effectiveRunId);
  }
  showBtw(params) {
    if (this.btwMessage) {
      this.btwMessage.setResult(params);
      if (this.children[this.children.length - 1] !== this.btwMessage) {
        this.removeChild(this.btwMessage);
        this.appendNonSystem(this.btwMessage);
      }
      return this.btwMessage;
    }
    const component = new BtwInlineMessage(params);
    this.btwMessage = component;
    this.appendNonSystem(component);
    return component;
  }
  dismissBtw() {
    if (!this.btwMessage) return;
    this.removeChild(this.btwMessage);
    this.btwMessage = null;
  }
  hasVisibleBtw() {
    return this.btwMessage !== null;
  }
  startTool(toolCallId, toolName, args) {
    const existing = this.toolById.get(toolCallId);
    if (existing) {
      existing.setArgs(args);
      return existing;
    }
    const component = new ToolExecutionComponent(toolName, args);
    component.setExpanded(this.toolsExpanded);
    this.toolById.set(toolCallId, component);
    this.appendNonSystem(component);
    return component;
  }
  updateToolResult(toolCallId, result, opts) {
    const existing = this.toolById.get(toolCallId);
    if (!existing) return;
    if (opts?.partial) {
      existing.setPartialResult(result);
      return;
    }
    existing.setResult(result, { isError: opts?.isError });
  }
  setToolsExpanded(expanded) {
    this.toolsExpanded = expanded;
    for (const tool of this.toolById.values()) tool.setExpanded(expanded);
  }
};
//#endregion
//#region src/tui/components/custom-editor.ts
const KITTY_CSI_U_SUFFIX_REGEX = /^(\d+)(?::(\d*))?(?::(\d+))?(?:;(\d+))?(?::(\d+))?u$/u;
const KITTY_MODIFIERS = {
  alt: 2,
  ctrl: 4,
};
function decodeAltGrPrintable(data) {
  if (!data.startsWith("\x1B[")) return;
  const match = data.slice(2).match(KITTY_CSI_U_SUFFIX_REGEX);
  if (!match) return;
  const codepoint = Number.parseInt(match[1] ?? "", 10);
  const baseLayoutKey = match[3] ? Number.parseInt(match[3], 10) : void 0;
  const modifierValue = match[4] ? Number.parseInt(match[4], 10) : 1;
  if (
    ((Number.isFinite(modifierValue) ? modifierValue - 1 : 0) & -193) !==
    (KITTY_MODIFIERS.alt | KITTY_MODIFIERS.ctrl)
  )
    return;
  if (typeof baseLayoutKey !== "number" || baseLayoutKey === codepoint) return;
  if (!Number.isFinite(codepoint) || codepoint < 32) return;
  try {
    return String.fromCodePoint(codepoint);
  } catch {
    return;
  }
}
/** Editor with OpenClaw TUI shortcuts layered on top of pi-tui text editing. */
var CustomEditor = class extends Editor {
  /** Dispatches TUI shortcuts before falling back to normal editor input handling. */
  handleInput(data) {
    if (isKeyRelease(data)) return;
    if (matchesKey(data, Key.alt("enter")) && this.onAltEnter) {
      this.onAltEnter();
      return;
    }
    if (matchesKey(data, Key.alt("up")) && this.onAltUp) {
      this.onAltUp();
      return;
    }
    if (matchesKey(data, Key.ctrl("l")) && this.onCtrlL) {
      this.onCtrlL();
      return;
    }
    if (matchesKey(data, Key.ctrl("o")) && this.onCtrlO) {
      this.onCtrlO();
      return;
    }
    if (matchesKey(data, Key.ctrl("p")) && this.onCtrlP) {
      this.onCtrlP();
      return;
    }
    if (matchesKey(data, Key.ctrl("g")) && this.onCtrlG) {
      this.onCtrlG();
      return;
    }
    if (matchesKey(data, Key.ctrl("t")) && this.onCtrlT) {
      this.onCtrlT();
      return;
    }
    if (matchesKey(data, Key.shift("tab")) && this.onShiftTab) {
      this.onShiftTab();
      return;
    }
    if (matchesKey(data, Key.escape) && this.onEscape && !this.isShowingAutocomplete()) {
      this.onEscape();
      return;
    }
    if (matchesKey(data, Key.ctrl("c")) && this.onCtrlC) {
      this.onCtrlC();
      return;
    }
    if (matchesKey(data, Key.ctrl("d"))) {
      if (this.getText().length === 0 && this.onCtrlD) this.onCtrlD();
      return;
    }
    const altGrPrintable = decodeAltGrPrintable(data);
    if (altGrPrintable !== void 0) {
      super.handleInput(altGrPrintable);
      return;
    }
    super.handleInput(data);
  }
};
//#endregion
//#region src/tui/tui-busy-notice.ts
const TUI_AGENT_BUSY_MESSAGE = "agent is busy — press Esc to abort before sending a new message";
function addBlockedChatSubmitNotice(chatLog) {
  chatLog.addSystem(TUI_AGENT_BUSY_MESSAGE, { coalesceConsecutive: true });
}
//#endregion
//#region src/tui/components/fuzzy-filter.ts
/**
 * Shared fuzzy filtering utilities for select list components.
 */
/**
 * Word boundary characters for matching.
 */
const WORD_BOUNDARY_CHARS = /[\s\-_./:#@]/;
/**
 * Check if position is at a word boundary.
 */
function isWordBoundary(text, index) {
  return index === 0 || WORD_BOUNDARY_CHARS.test(text[index - 1] ?? "");
}
/**
 * Find index where query matches at a word boundary in text.
 * Returns null if no match.
 */
function findWordBoundaryIndex(text, query) {
  if (!query) return null;
  const textLower = normalizeLowercaseStringOrEmpty(text);
  const queryLower = normalizeLowercaseStringOrEmpty(query);
  const maxIndex = textLower.length - queryLower.length;
  if (maxIndex < 0) return null;
  for (let i = 0; i <= maxIndex; i++)
    if (textLower.startsWith(queryLower, i) && isWordBoundary(textLower, i)) return i;
  return null;
}
/**
 * Fuzzy match with pre-lowercased inputs (avoids toLowerCase on every keystroke).
 * Returns score (lower = better) or null if no match.
 */
function fuzzyMatchLower(queryLower, textLower) {
  if (queryLower.length === 0) return 0;
  if (queryLower.length > textLower.length) return null;
  let queryIndex = 0;
  let score = 0;
  let lastMatchIndex = -1;
  let consecutiveMatches = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++)
    if (textLower[i] === queryLower[queryIndex]) {
      const isAtWordBoundary = isWordBoundary(textLower, i);
      if (lastMatchIndex === i - 1) {
        consecutiveMatches++;
        score -= consecutiveMatches * 5;
      } else {
        consecutiveMatches = 0;
        if (lastMatchIndex >= 0) score += (i - lastMatchIndex - 1) * 2;
      }
      if (isAtWordBoundary) score -= 10;
      score += i * 0.1;
      lastMatchIndex = i;
      queryIndex++;
    }
  return queryIndex < queryLower.length ? null : score;
}
/**
 * Filter items using pre-lowercased searchTextLower field.
 * Supports space-separated tokens (all must match).
 */
function fuzzyFilterLower(items, queryLower) {
  const trimmed = queryLower.trim();
  if (!trimmed) return items;
  const tokens = trimmed.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length === 0) return items;
  const results = [];
  for (const item of items) {
    const text = item.searchTextLower ?? "";
    let totalScore = 0;
    let allMatch = true;
    for (const token of tokens) {
      const score = fuzzyMatchLower(token, text);
      if (score !== null) totalScore += score;
      else {
        allMatch = false;
        break;
      }
    }
    if (allMatch)
      results.push({
        item,
        score: totalScore,
      });
  }
  results.sort((a, b) => a.score - b.score);
  return results.map((r) => r.item);
}
/**
 * Prepare items for fuzzy filtering by pre-computing lowercase search text.
 */
function prepareSearchItems(items) {
  return items.map((item) => {
    const parts = [];
    if (item.label) parts.push(item.label);
    if (item.description) parts.push(item.description);
    if (item.searchText) parts.push(item.searchText);
    return {
      ...item,
      searchTextLower: normalizeLowercaseStringOrEmpty(parts.join(" ")),
    };
  });
}
//#endregion
//#region src/tui/components/filterable-select-list.ts
/**
 * Combines text input filtering with a select list.
 * User types to filter, arrows/j/k to navigate, Enter to select, Escape to clear/cancel.
 */
var FilterableSelectList = class {
  constructor(items, maxVisible, theme) {
    this.filterText = "";
    this.allItems = prepareSearchItems(items);
    this.maxVisible = maxVisible;
    this.theme = theme;
    this.input = new Input();
    this.selectList = new SelectList(this.allItems, maxVisible, theme);
  }
  applyFilter() {
    const queryLower = normalizeLowercaseStringOrEmpty(this.filterText);
    if (!queryLower.trim()) {
      this.selectList = new SelectList(this.allItems, this.maxVisible, this.theme);
      return;
    }
    const filtered = fuzzyFilterLower(this.allItems, queryLower);
    this.selectList = new SelectList(filtered, this.maxVisible, this.theme);
  }
  invalidate() {
    this.input.invalidate();
    this.selectList.invalidate();
  }
  render(width) {
    const lines = [];
    const filterLabel = this.theme.filterLabel("Filter: ");
    const inputText = this.input.render(width - 8)[0] ?? "";
    lines.push(filterLabel + inputText);
    lines.push(chalk.dim("─".repeat(Math.max(0, width))));
    const listLines = this.selectList.render(width);
    lines.push(...listLines);
    return lines;
  }
  handleInput(keyData) {
    const allowVimNav = !this.filterText.trim();
    if (
      matchesKey(keyData, "up") ||
      matchesKey(keyData, "ctrl+p") ||
      (allowVimNav && keyData === "k")
    ) {
      this.selectList.handleInput("\x1B[A");
      return;
    }
    if (
      matchesKey(keyData, "down") ||
      matchesKey(keyData, "ctrl+n") ||
      (allowVimNav && keyData === "j")
    ) {
      this.selectList.handleInput("\x1B[B");
      return;
    }
    if (matchesKey(keyData, "enter")) {
      const selected = this.selectList.getSelectedItem();
      if (selected) this.onSelect?.(selected);
      return;
    }
    if (matchesKey(keyData, "escape") || keyData === "") {
      if (this.filterText) {
        this.filterText = "";
        this.input.setValue("");
        this.applyFilter();
      } else this.onCancel?.();
      return;
    }
    const prevValue = this.input.getValue();
    this.input.handleInput(keyData);
    const newValue = this.input.getValue();
    if (newValue !== prevValue) {
      this.filterText = newValue;
      this.applyFilter();
    }
  }
  getSelectedItem() {
    return this.selectList.getSelectedItem();
  }
  getFilterText() {
    return this.filterText;
  }
};
//#endregion
//#region src/tui/components/searchable-select-list.ts
const ANSI_SGR_REGEX = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
/**
 * A select list with a search input at the top for fuzzy filtering.
 */
var SearchableSelectList = class SearchableSelectList {
  static {
    this.DESCRIPTION_LAYOUT_MIN_WIDTH = 40;
  }
  static {
    this.DESCRIPTION_MIN_WIDTH = 12;
  }
  static {
    this.DESCRIPTION_SPACING_WIDTH = 2;
  }
  static {
    this.RIGHT_MARGIN_WIDTH = 2;
  }
  constructor(items, maxVisible, theme) {
    this.selectedIndex = 0;
    this.regexCache = /* @__PURE__ */ new Map();
    this.compareByScore = (a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      if (a.score !== b.score) return a.score - b.score;
      return this.getItemLabel(a.item).localeCompare(this.getItemLabel(b.item));
    };
    this.items = items;
    this.filteredItems = items;
    this.maxVisible = maxVisible;
    this.theme = theme;
    this.searchInput = new Input();
  }
  getCachedRegex(pattern) {
    let regex = this.regexCache.get(pattern);
    if (!regex) {
      regex = new RegExp(this.escapeRegex(pattern), "gi");
      this.regexCache.set(pattern, regex);
    }
    return regex;
  }
  updateFilter() {
    const query = this.searchInput.getValue().trim();
    if (!query) this.filteredItems = this.items;
    else this.filteredItems = this.smartFilter(query);
    this.selectedIndex = 0;
    this.notifySelectionChange();
  }
  /**
   * Smart filtering that prioritizes:
   * 1. Exact substring match in label (highest priority)
   * 2. Word-boundary prefix match in label
   * 3. Exact substring in description
   * 4. Fuzzy match (lowest priority)
   */
  smartFilter(query) {
    const q = normalizeLowercaseStringOrEmpty(query);
    const scoredItems = [];
    const fuzzyCandidates = [];
    for (const item of this.items) {
      const rawLabel = this.getItemLabel(item);
      const rawDesc = item.description ?? "";
      const label = normalizeLowercaseStringOrEmpty(stripAnsi$1(rawLabel));
      const desc = normalizeLowercaseStringOrEmpty(stripAnsi$1(rawDesc));
      const labelIndex = label.indexOf(q);
      if (labelIndex !== -1) {
        scoredItems.push({
          item,
          tier: 0,
          score: labelIndex,
        });
        continue;
      }
      const wordBoundaryIndex = findWordBoundaryIndex(label, q);
      if (wordBoundaryIndex !== null) {
        scoredItems.push({
          item,
          tier: 1,
          score: wordBoundaryIndex,
        });
        continue;
      }
      const descIndex = desc.indexOf(q);
      if (descIndex !== -1) {
        scoredItems.push({
          item,
          tier: 2,
          score: descIndex,
        });
        continue;
      }
      const searchText = item.searchText ?? "";
      fuzzyCandidates.push({
        item,
        searchTextLower: normalizeLowercaseStringOrEmpty(
          [rawLabel, rawDesc, searchText]
            .map((value) => stripAnsi$1(value))
            .filter(Boolean)
            .join(" "),
        ),
      });
    }
    scoredItems.sort(this.compareByScore);
    const fuzzyMatches = fuzzyFilterLower(fuzzyCandidates, q);
    return [...scoredItems.map((s) => s.item), ...fuzzyMatches.map((entry) => entry.item)];
  }
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  getItemLabel(item) {
    return item.label || item.value;
  }
  splitAnsiParts(text) {
    const parts = [];
    ANSI_SGR_REGEX.lastIndex = 0;
    let lastIndex = 0;
    let match;
    while ((match = ANSI_SGR_REGEX.exec(text)) !== null) {
      if (match.index > lastIndex)
        parts.push({
          text: text.slice(lastIndex, match.index),
          isAnsi: false,
        });
      parts.push({
        text: match[0],
        isAnsi: true,
      });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length)
      parts.push({
        text: text.slice(lastIndex),
        isAnsi: false,
      });
    return parts;
  }
  highlightMatch(text, query) {
    const tokens = query
      .trim()
      .split(/\s+/)
      .map((token) => normalizeLowercaseStringOrEmpty(token))
      .filter((token) => token.length > 0);
    if (tokens.length === 0) return text;
    const uniqueTokens = uniqueStrings(tokens).toSorted((a, b) => b.length - a.length);
    let parts = this.splitAnsiParts(text);
    for (const token of uniqueTokens) {
      const regex = this.getCachedRegex(token);
      const nextParts = [];
      for (const part of parts) {
        if (part.isAnsi) {
          nextParts.push(part);
          continue;
        }
        regex.lastIndex = 0;
        const replaced = part.text.replace(regex, (match) => this.theme.matchHighlight(match));
        if (replaced === part.text) {
          nextParts.push(part);
          continue;
        }
        nextParts.push(...this.splitAnsiParts(replaced));
      }
      parts = nextParts;
    }
    return parts.map((part) => part.text).join("");
  }
  setSelectedIndex(index) {
    this.selectedIndex = Math.max(0, Math.min(index, this.filteredItems.length - 1));
  }
  invalidate() {
    this.searchInput.invalidate();
  }
  render(width) {
    const lines = [];
    const prompt = this.theme.searchPrompt("search: ");
    const inputWidth = Math.max(1, width - visibleWidth(prompt));
    const inputText = this.searchInput.render(inputWidth)[0] ?? "";
    lines.push(`${prompt}${this.theme.searchInput(inputText)}`);
    lines.push("");
    const query = this.searchInput.getValue().trim();
    if (this.filteredItems.length === 0) {
      lines.push(this.theme.noMatch("  No matches"));
      return lines;
    }
    const startIndex = Math.max(
      0,
      Math.min(
        this.selectedIndex - Math.floor(this.maxVisible / 2),
        this.filteredItems.length - this.maxVisible,
      ),
    );
    const endIndex = Math.min(startIndex + this.maxVisible, this.filteredItems.length);
    for (let i = startIndex; i < endIndex; i++) {
      const item = this.filteredItems[i];
      if (!item) continue;
      const isSelected = i === this.selectedIndex;
      lines.push(this.renderItemLine(item, isSelected, width, query));
    }
    if (this.filteredItems.length > this.maxVisible) {
      const scrollInfo = `${this.selectedIndex + 1}/${this.filteredItems.length}`;
      lines.push(this.theme.scrollInfo(`  ${scrollInfo}`));
    }
    return lines;
  }
  renderItemLine(item, isSelected, width, query) {
    const prefix = isSelected ? "→ " : "  ";
    const prefixWidth = prefix.length;
    const displayValue = this.getItemLabel(item);
    const description = item.description;
    if (description) {
      const descriptionLayout = this.getDescriptionLayout(width, prefixWidth);
      if (descriptionLayout) {
        const truncatedValue = truncateToWidth(displayValue, descriptionLayout.maxValueWidth, "");
        const valueText = this.highlightMatch(truncatedValue, query);
        const usedByValue = visibleWidth(valueText);
        const descriptionWidth =
          descriptionLayout.availableWidth - usedByValue - descriptionLayout.spacingWidth;
        if (descriptionWidth >= SearchableSelectList.DESCRIPTION_MIN_WIDTH) {
          const spacing = " ".repeat(descriptionLayout.spacingWidth);
          const truncatedDesc = truncateToWidth(description, descriptionWidth, "");
          const highlightedDesc = this.highlightMatch(truncatedDesc, query);
          const line = `${prefix}${valueText}${spacing}${isSelected ? highlightedDesc : this.theme.description(highlightedDesc)}`;
          return isSelected ? this.theme.selectedText(line) : line;
        }
      }
    }
    const truncatedValue = truncateToWidth(displayValue, width - prefixWidth - 2, "");
    const line = `${prefix}${this.highlightMatch(truncatedValue, query)}`;
    return isSelected ? this.theme.selectedText(line) : line;
  }
  getDescriptionLayout(width, prefixWidth) {
    if (width <= SearchableSelectList.DESCRIPTION_LAYOUT_MIN_WIDTH) return null;
    const availableWidth = Math.max(
      1,
      width - prefixWidth - SearchableSelectList.RIGHT_MARGIN_WIDTH,
    );
    const maxValueWidth =
      availableWidth -
      SearchableSelectList.DESCRIPTION_MIN_WIDTH -
      SearchableSelectList.DESCRIPTION_SPACING_WIDTH;
    if (maxValueWidth < 1) return null;
    return {
      availableWidth,
      maxValueWidth,
      spacingWidth: SearchableSelectList.DESCRIPTION_SPACING_WIDTH,
    };
  }
  handleInput(keyData) {
    if (isKeyRelease(keyData)) return;
    if (matchesKey(keyData, "up") || matchesKey(keyData, "ctrl+p")) {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      this.notifySelectionChange();
      return;
    }
    if (matchesKey(keyData, "down") || matchesKey(keyData, "ctrl+n")) {
      this.selectedIndex = Math.min(this.filteredItems.length - 1, this.selectedIndex + 1);
      this.notifySelectionChange();
      return;
    }
    if (matchesKey(keyData, "enter")) {
      const item = this.filteredItems[this.selectedIndex];
      if (item && this.onSelect) this.onSelect(item);
      return;
    }
    if (matchesKey(keyData, "escape") || keyData === "") {
      if (this.onCancel) this.onCancel();
      return;
    }
    const prevValue = this.searchInput.getValue();
    this.searchInput.handleInput(keyData);
    if (prevValue !== this.searchInput.getValue()) this.updateFilter();
  }
  notifySelectionChange() {
    const item = this.filteredItems[this.selectedIndex];
    if (item && this.onSelectionChange) this.onSelectionChange(item);
  }
  getSelectedItem() {
    return this.filteredItems[this.selectedIndex] ?? null;
  }
};
//#endregion
//#region src/tui/components/selectors.ts
/** Creates a themed searchable select list for TUI overlays. */
function createSearchableSelectList(items, maxVisible = 7) {
  return new SearchableSelectList(items, maxVisible, searchableSelectListTheme);
}
/** Creates a themed filterable select list for TUI overlays. */
function createFilterableSelectList(items, maxVisible = 7) {
  return new FilterableSelectList(items, maxVisible, filterableSelectListTheme);
}
/** Creates a themed settings list with change and cancel callbacks. */
function createSettingsList(items, onChange, onCancel, maxVisible = 7) {
  return new SettingsList(items, maxVisible, settingsListTheme, onChange, onCancel);
}
//#endregion
//#region src/tui/tui-session-list-policy.ts
const TUI_RECENT_SESSIONS_ACTIVE_MINUTES = 10080;
//#endregion
//#region src/tui/tui-status-summary.ts
/** Formats Gateway/session health into compact status lines for the TUI. */
function formatStatusSummary(summary) {
  const lines = [];
  lines.push("Gateway status");
  if (summary.runtimeVersion) lines.push(`Version: ${summary.runtimeVersion}`);
  if (!summary.linkChannel) lines.push("Link channel: unknown");
  else {
    const linkLabel = summary.linkChannel.label ?? "Link channel";
    const linked = summary.linkChannel.linked === true;
    const authAge =
      linked && typeof summary.linkChannel.authAgeMs === "number"
        ? ` (last refreshed ${formatTimeAgo(summary.linkChannel.authAgeMs)})`
        : "";
    lines.push(`${linkLabel}: ${linked ? "linked" : "not linked"}${authAge}`);
  }
  const providerSummary = Array.isArray(summary.providerSummary) ? summary.providerSummary : [];
  if (providerSummary.length > 0) {
    lines.push("");
    lines.push("System:");
    for (const line of providerSummary) lines.push(`  ${line}`);
  }
  const heartbeatAgents = summary.heartbeat?.agents ?? [];
  if (heartbeatAgents.length > 0) {
    const heartbeatParts = heartbeatAgents.map((agent) => {
      const agentId = agent.agentId ?? "unknown";
      if (!agent.enabled || !agent.everyMs) return `disabled (${agentId})`;
      return `${agent.every ?? "unknown"} (${agentId})`;
    });
    lines.push("");
    lines.push(`Heartbeat: ${heartbeatParts.join(", ")}`);
  }
  const sessionPaths = summary.sessions?.paths ?? [];
  if (sessionPaths.length === 1) lines.push(`Session store: ${sessionPaths[0]}`);
  else if (sessionPaths.length > 1) lines.push(`Session stores: ${sessionPaths.length}`);
  const defaults = summary.sessions?.defaults;
  const defaultModel = defaults?.model ?? "unknown";
  const defaultCtx =
    typeof defaults?.contextTokens === "number"
      ? ` (${formatTokenCount(defaults.contextTokens)} ctx)`
      : "";
  lines.push(`Default model: ${defaultModel}${defaultCtx}`);
  const sessionCount = summary.sessions?.count ?? 0;
  lines.push(`Active sessions: ${sessionCount}`);
  const recent = Array.isArray(summary.sessions?.recent) ? summary.sessions?.recent : [];
  if (recent.length > 0) {
    lines.push("Recent sessions:");
    for (const entry of recent) {
      const ageLabel = typeof entry.age === "number" ? formatTimeAgo(entry.age) : "no activity";
      const model = entry.model ?? "unknown";
      const usage = formatContextUsageLine({
        total: entry.totalTokens ?? null,
        context: entry.contextTokens ?? null,
        remaining: entry.remainingTokens ?? null,
        percent: entry.percentUsed ?? null,
      });
      const flags = entry.flags?.length ? ` | flags: ${entry.flags.join(", ")}` : "";
      lines.push(
        `- ${entry.key}${entry.kind ? ` [${entry.kind}]` : ""} | ${ageLabel} | model ${model} | ${usage}${flags}`,
      );
    }
  }
  const queued = Array.isArray(summary.queuedSystemEvents) ? summary.queuedSystemEvents : [];
  if (queued.length > 0) {
    const preview = queued.slice(0, 3).join(" | ");
    lines.push(`Queued system events (${queued.length}): ${preview}`);
  }
  return lines;
}
//#endregion
//#region src/tui/tui-submit-state.ts
function beginPendingSubmit(state, runId, text) {
  state.pendingSubmit = {
    phase: "sending",
    runId,
    draftText: text,
  };
}
function acceptPendingSubmit(params) {
  const pending = params.state.pendingSubmit;
  if (!pending || pending.phase !== "sending" || pending.runId !== params.provisionalRunId)
    return false;
  params.state.pendingSubmit = {
    phase: "accepted",
    runId: params.acceptedRunId,
    draftText: params.preserveDraft ? pending.draftText : null,
  };
  return true;
}
function clearPendingSubmit(state, runId) {
  const pending = state.pendingSubmit;
  if (!pending || (runId !== void 0 && pending.runId !== runId)) return false;
  state.pendingSubmit = null;
  return true;
}
function clearPendingSubmitDraft(state, runId) {
  const pending = state.pendingSubmit;
  if (pending?.phase !== "accepted" || pending.runId !== runId || pending.draftText === null)
    return false;
  state.pendingSubmit = {
    ...pending,
    draftText: null,
  };
  return true;
}
function hasPendingSubmit(state) {
  return state.pendingSubmit !== null;
}
function getPendingSubmitAcceptedRunId(state) {
  return state.pendingSubmit?.phase === "accepted" ? state.pendingSubmit.runId : null;
}
function getPendingSubmitDraft(state) {
  const pending = state.pendingSubmit;
  if (!pending || pending.draftText === null) return null;
  return {
    runId: pending.runId,
    text: pending.draftText,
  };
}
function reconcilePendingSubmitHistory(state, reconciledRunIds) {
  const runId = state.pendingSubmit?.runId;
  if (!runId || !new Set(reconciledRunIds).has(runId)) return false;
  state.pendingSubmit = null;
  return true;
}
function resolveTuiChatSubmitAdmission(params) {
  if (!params.isConnected) return "disconnected";
  if (
    isChatStopCommandText(params.message) &&
    (params.activeChatRunId || params.pendingSubmit?.phase === "accepted")
  )
    return "allowed";
  return params.pendingSubmit ? "pending" : "allowed";
}
function disconnectedTuiChatSubmitMessage(local) {
  return local
    ? "local runtime not ready — message not sent"
    : "not connected to gateway — message not sent";
}
//#endregion
//#region src/tui/tui-command-handlers.ts
function formatTuiFastMode(mode) {
  return mode === "auto" ? "auto" : mode === true ? "on" : "off";
}
function isBtwCommand(text) {
  return /^\/(?:btw|side)(?::|\s|$)/i.test(text.trim());
}
function isSlashStopCommand(text) {
  const trimmed = text.trim();
  return trimmed.startsWith("/") && isChatStopCommandText(trimmed);
}
function normalizedChatSendAckStatus(status) {
  return typeof status === "string" ? status.trim().toLowerCase() : "";
}
function isTerminalChatSendAckFailure(status) {
  const normalized = normalizedChatSendAckStatus(status);
  return normalized === "timeout" || normalized === "error";
}
function isTerminalChatSendAckSuccess(status) {
  return normalizedChatSendAckStatus(status) === "ok";
}
const TERMINAL_CHAT_SEND_FAILURE_MESSAGE = "Chat failed before the run started; try again.";
function goalContinuationPrompt(text) {
  const parsed = parseGoalCommand(text);
  if (!parsed) return null;
  const action = parsed.action;
  if (action === "start" || action === "set" || action === "create")
    return formatGoalContinuationPrompt(parsed.text) || null;
  if (action === "resume") return formatGoalResumeContinuationPrompt(parsed.text);
  return null;
}
function createCommandHandlers(context) {
  const {
    client,
    chatLog,
    tui,
    opts,
    state,
    deliverDefault,
    openOverlay,
    closeOverlay,
    refreshSessionInfo,
    loadHistory,
    setSession,
    refreshAgents,
    abortActive,
    setActivityStatus,
    formatSessionKey,
    applySessionInfoFromPatch,
    applySessionMutationResult,
    noteLocalRunId,
    noteLocalBtwRunId,
    forgetLocalRunId,
    forgetLocalBtwRunId,
    consumeCompletedRunForPendingSend,
    isRunObserved,
    flushPendingHistoryRefreshIfIdle,
    runAuthFlow,
    requestExit,
  } = context;
  let sessionCreationInFlight = false;
  const addUnsupportedLocalCommand = (name) => {
    chatLog.addSystem(`/${name} is not available in local embedded mode; message not sent`);
  };
  const setAgent = async (id) => {
    state.currentAgentId = normalizeAgentId(id);
    await setSession("");
    chatLog.addSystem(`agent set to ${state.currentAgentId}; use /crestodian to return`);
  };
  const closeOverlayAndRender = (handle) => {
    closeOverlay(handle);
    tui.requestRender();
  };
  const hasTrackedAbortTarget = () => Boolean(state.activeChatRunId || hasPendingSubmit(state));
  const hasUnsafeSessionRollover = () =>
    hasTrackedAbortTarget() || state.activityStatus === "finishing context";
  const currentSessionPatchTarget = () => ({
    key: state.currentSessionKey,
    ...(state.currentSessionKey === "global" ? { agentId: state.currentAgentId } : {}),
  });
  const openSelector = (selector, onSelect) => {
    selector.onSelect = (item) => {
      (async () => {
        await onSelect(item.value);
        closeOverlayAndRender(overlayHandle);
      })();
    };
    selector.onCancel = () => closeOverlayAndRender(overlayHandle);
    const overlayHandle = openOverlay(selector);
    tui.requestRender();
  };
  const openModelSelector = async () => {
    try {
      chatLog.addSystem("loading models...");
      tui.requestRender();
      const models = await client.listModels();
      if (models.length === 0) {
        chatLog.addSystem("no models available");
        tui.requestRender();
        return;
      }
      const selector = createSearchableSelectList(
        models.map((model) => {
          const ref = modelKey(model.provider, model.id);
          return {
            value: ref,
            label: ref,
            description: model.name && model.name !== model.id ? model.name : "",
          };
        }),
        9,
      );
      openSelector(selector, async (value) => {
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            model: value,
          });
          chatLog.addSystem(`model set to ${value}`);
          applySessionInfoFromPatch(result);
          await refreshSessionInfo();
        } catch (err) {
          chatLog.addSystem(`model set failed: ${String(err)}`);
        }
      });
    } catch (err) {
      chatLog.addSystem(`model list failed: ${String(err)}`);
      tui.requestRender();
    }
  };
  const openAgentSelector = async () => {
    await refreshAgents();
    if (state.agents.length === 0) {
      chatLog.addSystem("no agents found");
      tui.requestRender();
      return;
    }
    const selector = createSearchableSelectList(
      state.agents.map((agent) => ({
        value: agent.id,
        label: agent.name ? `${agent.id} (${agent.name})` : agent.id,
        description: agent.id === state.agentDefaultId ? "default" : "",
      })),
      9,
    );
    openSelector(selector, async (value) => {
      await setAgent(value);
    });
  };
  const openContextModeSelector = () => {
    const selector = createSearchableSelectList(
      [
        {
          value: "list",
          label: "list",
          description: "Short context breakdown",
        },
        {
          value: "detail",
          label: "detail",
          description: "Per-file, per-tool, per-skill, and system prompt size",
        },
        {
          value: "json",
          label: "json",
          description: "Machine-readable context report",
        },
      ],
      9,
    );
    openSelector(selector, async (value) => {
      await sendMessage(`/context ${value}`);
    });
  };
  const openSessionSelector = async () => {
    try {
      const selector = createFilterableSelectList(
        (
          await client.listSessions({
            limit: 50,
            activeMinutes: TUI_RECENT_SESSIONS_ACTIVE_MINUTES,
            includeGlobal: false,
            includeUnknown: false,
            includeDerivedTitles: true,
            includeLastMessage: true,
            agentId: state.currentAgentId,
          })
        ).sessions.map((session) => {
          const title = session.derivedTitle ?? session.displayName;
          const formattedKey = formatSessionKey(session.key);
          const label =
            title && title !== formattedKey ? `${title} (${formattedKey})` : formattedKey;
          const timePart = session.updatedAt
            ? formatRelativeTimestamp(session.updatedAt, {
                dateFallback: true,
                fallback: "",
              })
            : "";
          const preview = session.lastMessagePreview?.replace(/\s+/g, " ").trim();
          const description =
            timePart && preview ? `${timePart} · ${preview}` : (preview ?? timePart);
          return {
            value: session.key,
            label,
            description,
            searchText: [
              session.displayName,
              session.label,
              session.subject,
              session.sessionId,
              session.key,
              session.lastMessagePreview,
            ]
              .filter(Boolean)
              .join(" "),
          };
        }),
        9,
      );
      openSelector(selector, async (value) => {
        await setSession(value);
      });
    } catch (err) {
      chatLog.addSystem(`sessions list failed: ${String(err)}`);
      tui.requestRender();
    }
  };
  const openSettings = () => {
    const settings = createSettingsList(
      [
        {
          id: "tools",
          label: "Tool output",
          currentValue: state.toolsExpanded ? "expanded" : "collapsed",
          values: ["collapsed", "expanded"],
        },
        {
          id: "thinking",
          label: "Show thinking",
          currentValue: state.showThinking ? "on" : "off",
          values: ["off", "on"],
        },
      ],
      (id, value) => {
        if (id === "tools") {
          state.toolsExpanded = value === "expanded";
          chatLog.setToolsExpanded(state.toolsExpanded);
        }
        if (id === "thinking") {
          state.showThinking = value === "on";
          loadHistory();
        }
        tui.requestRender();
      },
      () => {
        closeOverlay(overlayHandle);
        tui.requestRender();
      },
    );
    const overlayHandle = openOverlay(settings);
    tui.requestRender();
  };
  const handleCommand = async (raw) => {
    const { name, args } = parseCommand(raw);
    if (!name) return;
    if (sessionCreationInFlight && name !== "exit" && name !== "quit") {
      chatLog.addSystem("session change in progress; wait for /new to finish");
      tui.requestRender();
      return;
    }
    switch (name) {
      case "help":
        chatLog.addSystem(
          helpText({
            local: opts.local,
            provider: state.sessionInfo.modelProvider,
            model: state.sessionInfo.model,
            agentRuntime: state.sessionInfo.agentRuntime?.id,
          }),
        );
        break;
      case "auth": {
        if (!runAuthFlow) {
          chatLog.addSystem("auth login is only available in local embedded mode");
          break;
        }
        if (state.activeChatRunId || hasPendingSubmit(state)) {
          chatLog.addSystem("abort the current run before /auth");
          break;
        }
        const provider = args.trim() || state.sessionInfo.modelProvider || void 0;
        chatLog.addSystem(
          provider
            ? `opening auth flow for ${provider}; TUI will resume when it exits`
            : "opening auth flow; TUI will resume when it exits",
        );
        tui.requestRender();
        setActivityStatus("auth");
        try {
          const result = await runAuthFlow({ provider });
          await refreshSessionInfo();
          if (result.exitCode === 0 && !result.signal) {
            chatLog.addSystem(
              provider ? `auth flow finished for ${provider}` : "auth flow finished",
            );
            setActivityStatus("idle");
          } else {
            const failureSuffix = result.signal
              ? ` (signal ${result.signal})`
              : typeof result.exitCode === "number"
                ? ` (exit ${String(result.exitCode)})`
                : "";
            chatLog.addSystem(`auth flow failed${failureSuffix}`);
            setActivityStatus("error");
          }
        } catch (err) {
          chatLog.addSystem(`auth flow failed: ${sanitizeRenderableText(String(err))}`);
          setActivityStatus("error");
        }
        break;
      }
      case "gateway-status":
        try {
          const status = await client.getGatewayStatus();
          if (typeof status === "string") {
            chatLog.addSystem(status);
            break;
          }
          if (status && typeof status === "object") {
            const lines = formatStatusSummary(status);
            for (const line of lines) chatLog.addSystem(line);
            break;
          }
          chatLog.addSystem("status: unknown response");
        } catch (err) {
          chatLog.addSystem(`status failed: ${String(err)}`);
        }
        break;
      case "agent":
        if (!args) await openAgentSelector();
        else await setAgent(args);
        break;
      case "agents":
        await openAgentSelector();
        break;
      case "context":
        if (opts.local) addUnsupportedLocalCommand(name);
        else if (!args) openContextModeSelector();
        else await sendMessage(raw);
        break;
      case "goal":
        if (opts.local === true && client.runGoalCommand)
          try {
            const result = await client.runGoalCommand({
              sessionKey: state.currentSessionKey,
              agentId: state.currentAgentId,
              command: raw,
            });
            chatLog.addSystem(result.text);
            await refreshSessionInfo();
            const continuation = goalContinuationPrompt(raw);
            if (continuation) await sendMessage(continuation);
          } catch (err) {
            chatLog.addSystem(`goal failed: ${sanitizeRenderableText(String(err))}`);
          }
        else await sendMessage(raw);
        break;
      case "btw":
        if (args) await sendMessage(raw);
        else chatLog.addSystem("Usage: /btw [side question]");
        break;
      case "crestodian":
        chatLog.addSystem(
          args ? `returning to Crestodian with request: ${args}` : "returning to Crestodian",
        );
        requestExit({
          exitReason: "return-to-crestodian",
          ...(args ? { crestodianMessage: args } : {}),
        });
        break;
      case "session":
        if (!args) await openSessionSelector();
        else await setSession(args);
        break;
      case "sessions":
        await openSessionSelector();
        break;
      case "model":
        if (shouldForwardModelCommandToServer(args)) await sendMessage(raw);
        else if (!args) await openModelSelector();
        else
          try {
            const result = await client.patchSession({
              ...currentSessionPatchTarget(),
              model: args,
            });
            const resolvedModel = result.resolved?.model;
            const resolvedProvider = result.resolved?.modelProvider;
            const resolvedModelRef = resolvedModel
              ? resolvedProvider
                ? modelKey(resolvedProvider, resolvedModel)
                : resolvedModel
              : args;
            chatLog.addSystem(`model set to ${resolvedModelRef}`);
            applySessionInfoFromPatch(result);
            await refreshSessionInfo();
          } catch (err) {
            chatLog.addSystem(`model set failed: ${String(err)}`);
          }
        break;
      case "models":
        await openModelSelector();
        break;
      case "think":
        if (!args) {
          const levels =
            state.sessionInfo.thinkingLevels?.map((level) => level.label).join("|") ||
            formatThinkingLevels(
              state.sessionInfo.modelProvider,
              state.sessionInfo.model,
              "|",
              void 0,
              state.sessionInfo.agentRuntime?.id,
            );
          chatLog.addSystem(`usage: /think <${levels}>`);
          break;
        }
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            thinkingLevel: args,
          });
          chatLog.addSystem(`thinking set to ${args}`);
          applySessionInfoFromPatch(result);
          await refreshSessionInfo();
        } catch (err) {
          chatLog.addSystem(`think failed: ${String(err)}`);
        }
        break;
      case "verbose":
        if (!args) {
          chatLog.addSystem("usage: /verbose <on|off>");
          break;
        }
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            verboseLevel: args,
          });
          chatLog.addSystem(`verbose set to ${args}`);
          applySessionInfoFromPatch(result);
          if (args === "off") {
            chatLog.clearTools();
            await refreshSessionInfo();
          } else await loadHistory();
        } catch (err) {
          chatLog.addSystem(`verbose failed: ${String(err)}`);
        }
        break;
      case "trace":
        if (!args) {
          chatLog.addSystem("usage: /trace <on|off>");
          break;
        }
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            traceLevel: args,
          });
          chatLog.addSystem(`trace set to ${args}`);
          applySessionInfoFromPatch(result);
          await refreshSessionInfo();
        } catch (err) {
          chatLog.addSystem(`trace failed: ${String(err)}`);
        }
        break;
      case "fast":
        if (!args || args === "status") {
          chatLog.addSystem(`fast mode: ${formatTuiFastMode(state.sessionInfo.fastMode)}`);
          break;
        }
        if (args !== "auto" && args !== "on" && args !== "off") {
          chatLog.addSystem("usage: /fast <status|auto|on|off>");
          break;
        }
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            fastMode: args === "auto" ? "auto" : args === "on",
          });
          chatLog.addSystem(`fast mode set to ${args}`);
          applySessionInfoFromPatch(result);
          await refreshSessionInfo();
        } catch (err) {
          chatLog.addSystem(`fast failed: ${String(err)}`);
        }
        break;
      case "reasoning":
        if (!args) {
          chatLog.addSystem("usage: /reasoning <on|off>");
          break;
        }
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            reasoningLevel: args,
          });
          chatLog.addSystem(`reasoning set to ${args}`);
          applySessionInfoFromPatch(result);
          await refreshSessionInfo();
        } catch (err) {
          chatLog.addSystem(`reasoning failed: ${String(err)}`);
        }
        break;
      case "usage": {
        const isReset = args ? isSessionDefaultDirectiveValue(args) : false;
        const normalized = args && !isReset ? normalizeUsageDisplay(args) : void 0;
        if (args && !normalized && !isReset) {
          chatLog.addSystem("usage: /usage <off|tokens|full|reset>");
          break;
        }
        if (isReset) {
          try {
            const result = await client.patchSession({
              ...currentSessionPatchTarget(),
              responseUsage: null,
            });
            chatLog.addSystem("usage footer: reset to default");
            applySessionInfoFromPatch(result);
            delete state.sessionInfo.responseUsage;
            delete state.sessionInfo.effectiveResponseUsage;
            await refreshSessionInfo();
          } catch (err) {
            chatLog.addSystem(`usage failed: ${String(err)}`);
          }
          break;
        }
        const current =
          state.sessionInfo.effectiveResponseUsage ??
          resolveResponseUsageMode(state.sessionInfo.responseUsage);
        const next =
          normalized ?? (current === "off" ? "tokens" : current === "tokens" ? "full" : "off");
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            responseUsage: next,
          });
          chatLog.addSystem(`usage footer: ${next}`);
          applySessionInfoFromPatch(result);
          await refreshSessionInfo();
        } catch (err) {
          chatLog.addSystem(`usage failed: ${String(err)}`);
        }
        break;
      }
      case "elevated":
        if (!args) {
          chatLog.addSystem("usage: /elevated <on|off|ask|full>");
          break;
        }
        if (!["on", "off", "ask", "full"].includes(args)) {
          chatLog.addSystem("usage: /elevated <on|off|ask|full>");
          break;
        }
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            elevatedLevel: args,
          });
          chatLog.addSystem(`elevated set to ${args}`);
          applySessionInfoFromPatch(result);
          await refreshSessionInfo();
        } catch (err) {
          chatLog.addSystem(`elevated failed: ${String(err)}`);
        }
        break;
      case "activation": {
        if (!args) {
          chatLog.addSystem("usage: /activation <mention|always>");
          break;
        }
        const activation = normalizeGroupActivation(args);
        if (!activation) {
          chatLog.addSystem("usage: /activation <mention|always>");
          break;
        }
        try {
          const result = await client.patchSession({
            ...currentSessionPatchTarget(),
            groupActivation: activation,
          });
          chatLog.addSystem(`activation set to ${activation}`);
          applySessionInfoFromPatch(result);
          await refreshSessionInfo();
        } catch (err) {
          chatLog.addSystem(`activation failed: ${String(err)}`);
        }
        break;
      }
      case "new":
        if (hasUnsafeSessionRollover()) {
          chatLog.addSystem("abort the current run before /new");
          tui.requestRender();
          break;
        }
        sessionCreationInFlight = true;
        try {
          state.sessionInfo.inputTokens = null;
          state.sessionInfo.outputTokens = null;
          state.sessionInfo.totalTokens = null;
          tui.requestRender();
          const uniqueKey = `tui-${randomUUID()}`;
          const result = await client.createSession({
            key: uniqueKey,
            agentId: state.currentAgentId,
            ...(state.currentSessionId ? { parentSessionKey: state.currentSessionKey } : {}),
          });
          if (!result.key) throw new Error("sessions.create returned no session key");
          await setSession(result.key);
          chatLog.addSystem(`new session: ${result.key}`);
        } catch (err) {
          chatLog.addSystem(`new session failed: ${sanitizeRenderableText(String(err))}`);
        } finally {
          sessionCreationInFlight = false;
        }
        break;
      case "reset":
        try {
          state.sessionInfo.inputTokens = null;
          state.sessionInfo.outputTokens = null;
          state.sessionInfo.totalTokens = null;
          tui.requestRender();
          const result = await client.resetSession(
            state.currentSessionKey,
            name,
            state.currentSessionKey === "global" ? { agentId: state.currentAgentId } : void 0,
          );
          if (applySessionMutationResult(result)) await refreshSessionInfo();
          else await loadHistory();
          chatLog.addSystem(`session ${state.currentSessionKey} reset`);
        } catch (err) {
          chatLog.addSystem(`reset failed: ${sanitizeRenderableText(String(err))}`);
        }
        break;
      case "abort":
        await abortActive();
        break;
      case "stop":
        await abortActive({ preferActive: true });
        break;
      case "settings":
        openSettings();
        break;
      case "exit":
      case "quit":
        requestExit();
        break;
      default:
        if (opts.local && isSharedTextCommand(raw)) {
          addUnsupportedLocalCommand(name);
          break;
        }
        await sendMessage(raw);
        break;
    }
    tui.requestRender();
  };
  const sendMessage = async (text) => {
    if (!state.isConnected) {
      chatLog.addSystem(disconnectedTuiChatSubmitMessage(opts.local === true));
      setActivityStatus("disconnected");
      tui.requestRender();
      return;
    }
    if (sessionCreationInFlight) {
      chatLog.addSystem("session change in progress; message not sent");
      tui.requestRender();
      return;
    }
    const isBtw = isBtwCommand(text);
    const busy = Boolean(state.activeChatRunId || hasPendingSubmit(state));
    if (
      isSlashStopCommand(text) ||
      (hasTrackedAbortTarget() && busy && isChatStopCommandText(text))
    ) {
      await abortActive({ preferActive: true });
      return;
    }
    if (!isBtw && hasPendingSubmit(state)) {
      addBlockedChatSubmitNotice(chatLog);
      tui.requestRender();
      return;
    }
    const runId = randomUUID();
    try {
      if (!isBtw) {
        if (opts.local === true && state.activeChatRunId && !hasPendingSubmit(state))
          chatLog.reserveAssistantSlot(state.activeChatRunId);
        chatLog.addPendingUser(runId, text);
        beginPendingSubmit(state, runId, text);
        noteLocalRunId?.(runId);
        setActivityStatus("sending");
      } else noteLocalBtwRunId?.(runId);
      tui.requestRender();
      const sendResult = await client.sendChat({
        sessionKey: state.currentSessionKey,
        ...(state.currentSessionKey === "global" ? { agentId: state.currentAgentId } : {}),
        sessionId: state.currentSessionId,
        message: text,
        thinking: opts.thinking,
        deliver: deliverDefault,
        timeoutMs: opts.timeoutMs,
        runId,
      });
      const acceptedRunId = sendResult.runId || runId;
      const terminalAckFailure = isTerminalChatSendAckFailure(sendResult.status);
      const terminalAckSuccess = isTerminalChatSendAckSuccess(sendResult.status);
      const terminalAck = terminalAckFailure || terminalAckSuccess;
      if (isBtw && terminalAck) {
        forgetLocalBtwRunId?.(runId);
        if (acceptedRunId !== runId) forgetLocalBtwRunId?.(acceptedRunId);
        if (terminalAckFailure)
          chatLog.addSystem(`btw failed: ${TERMINAL_CHAT_SEND_FAILURE_MESSAGE}`);
        tui.requestRender();
        return;
      }
      if (isBtw) {
        if (acceptedRunId !== runId) {
          forgetLocalBtwRunId?.(runId);
          noteLocalBtwRunId?.(acceptedRunId);
        }
        return;
      }
      if (!isBtw) {
        const acceptedRunAlreadyCompleted =
          acceptedRunId !== runId &&
          !terminalAck &&
          (consumeCompletedRunForPendingSend?.(acceptedRunId) ?? false);
        acceptPendingSubmit({
          state,
          provisionalRunId: runId,
          acceptedRunId,
          preserveDraft: !(isRunObserved?.(acceptedRunId) || terminalAck),
        });
        if (acceptedRunId !== runId) {
          forgetLocalRunId?.(runId);
          if (!acceptedRunAlreadyCompleted && !terminalAck) noteLocalRunId?.(acceptedRunId);
          chatLog.rekeyPendingUser(runId, acceptedRunId);
        }
        if (terminalAck) {
          clearPendingSubmit(state, acceptedRunId);
          forgetLocalRunId?.(acceptedRunId);
          if (terminalAckFailure) chatLog.dropPendingUser(acceptedRunId);
          if (state.activeChatRunId === acceptedRunId) state.activeChatRunId = null;
          await loadHistory();
          if (terminalAckFailure) {
            chatLog.addSystem(`send failed: ${TERMINAL_CHAT_SEND_FAILURE_MESSAGE}`);
            setActivityStatus("error");
          } else setActivityStatus("idle");
          tui.requestRender();
          return;
        }
        if (hasPendingSubmit(state)) {
          if (acceptedRunAlreadyCompleted) {
            clearPendingSubmit(state, acceptedRunId);
            setActivityStatus("idle");
            flushPendingHistoryRefreshIfIdle?.();
          } else setActivityStatus("waiting");
          tui.requestRender();
        }
      }
    } catch (err) {
      if (isBtw) forgetLocalBtwRunId?.(runId);
      if (!isBtw && state.activeChatRunId && state.activeChatRunId === runId)
        forgetLocalRunId?.(state.activeChatRunId);
      if (!isBtw) forgetLocalRunId?.(runId);
      if (!isBtw) {
        if (state.activeChatRunId === runId) state.activeChatRunId = null;
        clearPendingSubmit(state, runId);
        chatLog.dropPendingUser(runId);
      }
      chatLog.addSystem(`${isBtw ? "btw failed" : "send failed"}: ${String(err)}`);
      if (!isBtw) setActivityStatus("error");
      tui.requestRender();
    }
  };
  return {
    handleCommand,
    sendMessage,
    openModelSelector,
    openAgentSelector,
    openSessionSelector,
    openSettings,
    setAgent,
  };
}
//#endregion
//#region src/tui/tui-stream-assembler.ts
function extractTextBlocksAndSignals(message) {
  if (!message || typeof message !== "object")
    return {
      textBlocks: [],
      sawNonTextContentBlocks: false,
    };
  const content = message.content;
  if (typeof content === "string") {
    const text = content.trim();
    return {
      textBlocks: text ? [text] : [],
      sawNonTextContentBlocks: false,
    };
  }
  if (!Array.isArray(content))
    return {
      textBlocks: [],
      sawNonTextContentBlocks: false,
    };
  const textBlocks = [];
  let sawNonTextContentBlocks = false;
  for (const block of content) {
    if (!block || typeof block !== "object") continue;
    const rec = block;
    if (rec.type === "text" && typeof rec.text === "string") {
      const text = rec.text.trim();
      if (text) textBlocks.push(text);
      continue;
    }
    if (typeof rec.type === "string" && rec.type !== "thinking") sawNonTextContentBlocks = true;
  }
  return {
    textBlocks,
    sawNonTextContentBlocks,
  };
}
function isDroppedBoundaryTextBlockSubset(params) {
  const { streamedTextBlocks, finalTextBlocks } = params;
  if (finalTextBlocks.length === 0 || finalTextBlocks.length >= streamedTextBlocks.length)
    return false;
  if (finalTextBlocks.every((block, index) => streamedTextBlocks[index] === block)) return true;
  const suffixStart = streamedTextBlocks.length - finalTextBlocks.length;
  return finalTextBlocks.every((block, index) => streamedTextBlocks[suffixStart + index] === block);
}
function shouldPreserveBoundaryDroppedText(params) {
  if (params.boundaryDropMode === "off") return false;
  if (
    !(params.boundaryDropMode === "streamed-or-incoming"
      ? params.streamedSawNonTextContentBlocks || params.incomingSawNonTextContentBlocks
      : params.streamedSawNonTextContentBlocks)
  )
    return false;
  return isDroppedBoundaryTextBlockSubset({
    streamedTextBlocks: params.streamedTextBlocks,
    finalTextBlocks: params.nextContentBlocks,
  });
}
/** Assembles assistant stream deltas and final messages into stable TUI display text. */
var TuiStreamAssembler = class {
  constructor() {
    this.runs = /* @__PURE__ */ new Map();
  }
  getOrCreateRun(runId) {
    let state = this.runs.get(runId);
    if (!state) {
      state = {
        thinkingText: "",
        contentText: "",
        contentBlocks: [],
        sawNonTextContentBlocks: false,
        displayText: "",
      };
      this.runs.set(runId, state);
    }
    return state;
  }
  updateRunState(state, message, showThinking, opts) {
    const thinkingText = extractThinkingFromMessage(message);
    const contentText = extractContentFromMessage(message);
    const { textBlocks, sawNonTextContentBlocks } = extractTextBlocksAndSignals(message);
    if (thinkingText) state.thinkingText = thinkingText;
    if (contentText) {
      const nextContentBlocks = textBlocks.length > 0 ? textBlocks : [contentText];
      if (
        !shouldPreserveBoundaryDroppedText({
          boundaryDropMode: opts?.boundaryDropMode ?? "off",
          streamedSawNonTextContentBlocks: state.sawNonTextContentBlocks,
          incomingSawNonTextContentBlocks: sawNonTextContentBlocks,
          streamedTextBlocks: state.contentBlocks,
          nextContentBlocks,
        })
      ) {
        state.contentText = contentText;
        state.contentBlocks = nextContentBlocks;
      }
    }
    if (sawNonTextContentBlocks) state.sawNonTextContentBlocks = true;
    state.displayText = composeThinkingAndContent({
      thinkingText: state.thinkingText,
      contentText: state.contentText,
      showThinking,
    });
  }
  /** Ingests a streaming delta and returns updated display text only when it changed. */
  ingestDelta(runId, message, showThinking) {
    const state = this.getOrCreateRun(runId);
    const previousDisplayText = state.displayText;
    this.updateRunState(state, message, showThinking, { boundaryDropMode: "streamed-or-incoming" });
    if (!state.displayText || state.displayText === previousDisplayText) return null;
    return state.displayText;
  }
  /** Finalizes a run, combines any error text, and drops stored stream state. */
  finalize(runId, message, showThinking, errorMessage) {
    const state = this.getOrCreateRun(runId);
    const streamedDisplayText = state.displayText;
    const streamedTextBlocks = [...state.contentBlocks];
    const streamedSawNonTextContentBlocks = state.sawNonTextContentBlocks;
    this.updateRunState(state, message, showThinking, { boundaryDropMode: "streamed-only" });
    const finalComposed = state.displayText;
    const finalText = resolveFinalAssistantText({
      finalText:
        streamedSawNonTextContentBlocks &&
        isDroppedBoundaryTextBlockSubset({
          streamedTextBlocks,
          finalTextBlocks: state.contentBlocks,
        })
          ? streamedDisplayText
          : finalComposed,
      streamedText: streamedDisplayText,
      errorMessage,
    });
    this.runs.delete(runId);
    return finalText;
  }
  /** Drops stored stream state for an aborted or discarded run. */
  drop(runId) {
    this.runs.delete(runId);
  }
};
//#endregion
//#region src/tui/tui-event-handlers.ts
const MAX_ABORT_DIAGNOSTIC_LENGTH = 160;
function formatAbortDiagnostic(value) {
  const diagnostic = sanitizeRenderableText(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!diagnostic) return;
  return diagnostic.length > MAX_ABORT_DIAGNOSTIC_LENGTH
    ? `${truncateUtf16Safe(diagnostic, MAX_ABORT_DIAGNOSTIC_LENGTH - 1)}…`
    : diagnostic;
}
const DEFAULT_STREAMING_WATCHDOG_MS = 3e4;
const LIFECYCLE_ERROR_RETRY_GRACE_MS = 15e3;
const STREAMING_WATCHDOG_USER_MESSAGE =
  "This response is taking longer than expected. Still waiting for the current run.";
function createEventHandlers(context) {
  const {
    chatLog,
    btw,
    tui,
    state,
    setActivityStatus,
    refreshSessionInfo,
    loadHistory,
    noteLocalRunId,
    isLocalRunId,
    forgetLocalRunId,
    clearLocalRunIds,
    isLocalBtwRunId,
    forgetLocalBtwRunId,
    clearLocalBtwRunIds,
    localMode,
  } = context;
  const sessionRuns = /* @__PURE__ */ new Map();
  const finalizedRuns = /* @__PURE__ */ new Map();
  const finalizedRunsWithDisplay = /* @__PURE__ */ new Map();
  const pendingNewSessionRunIds = /* @__PURE__ */ new Set();
  const persistedTerminalRunIds = /* @__PURE__ */ new Map();
  const historyReloadRunIds = /* @__PURE__ */ new Set();
  const historyOwnedReloadRunIds = /* @__PURE__ */ new Set();
  const historyDisplayedReloadRunIds = /* @__PURE__ */ new Set();
  const liveTerminalErrorMessages = /* @__PURE__ */ new Map();
  const queuedHistoryReloadRunIds = /* @__PURE__ */ new Set();
  const deferredHistoryRunEvents = /* @__PURE__ */ new Map();
  let historyReloadInFlight = false;
  let historyReloadGeneration = 0;
  const completedRuns = /* @__PURE__ */ new Map();
  const postFinalizingRuns = /* @__PURE__ */ new Map();
  let streamAssembler = new TuiStreamAssembler();
  let lastSessionKey = state.currentSessionKey;
  let pendingHistoryRefresh = false;
  let reconnectPendingRunId = null;
  const pendingTerminalLifecycleErrors = /* @__PURE__ */ new Map();
  const streamingWatchdogMs =
    typeof context.streamingWatchdogMs === "number" &&
    Number.isFinite(context.streamingWatchdogMs) &&
    context.streamingWatchdogMs >= 0
      ? Math.floor(context.streamingWatchdogMs)
      : DEFAULT_STREAMING_WATCHDOG_MS;
  let streamingWatchdogTimer = null;
  let streamingWatchdogRunId = null;
  const reloadHistoryPreservingTerminalErrors = async () => {
    if (!loadHistory) return { loaded: false };
    const reloadGeneration = historyReloadGeneration;
    const result = (await loadHistory()) ?? { loaded: false };
    if (!result.loaded || reloadGeneration !== historyReloadGeneration) return result;
    let restored = false;
    for (const [runId, message] of liveTerminalErrorMessages) {
      if (!finalizedRunsWithDisplay.has(runId)) continue;
      chatLog.addSystem(message);
      restored = true;
    }
    if (restored) tui.requestRender(true);
    return result;
  };
  const flushPendingHistoryRefreshIfIdle = () => {
    if (!pendingHistoryRefresh || state.activeChatRunId || hasPendingSubmit(state)) return;
    pendingHistoryRefresh = false;
    reloadHistoryPreservingTerminalErrors();
  };
  const clearStreamingWatchdog = () => {
    if (streamingWatchdogTimer) {
      clearTimeout(streamingWatchdogTimer);
      streamingWatchdogTimer = null;
    }
    streamingWatchdogRunId = null;
  };
  const clearPendingTerminalLifecycleError = (runId) => {
    const pending = pendingTerminalLifecycleErrors.get(runId);
    if (!pending) return;
    clearTimeout(pending.timer);
    pendingTerminalLifecycleErrors.delete(runId);
  };
  const clearPendingTerminalLifecycleErrors = () => {
    for (const pending of pendingTerminalLifecycleErrors.values()) clearTimeout(pending.timer);
    pendingTerminalLifecycleErrors.clear();
  };
  const pauseStreamingWatchdog = () => {
    clearStreamingWatchdog();
  };
  const clearTrackedRunState = () => {
    historyReloadGeneration += 1;
    pendingNewSessionRunIds.clear();
    persistedTerminalRunIds.clear();
    historyReloadRunIds.clear();
    historyOwnedReloadRunIds.clear();
    historyDisplayedReloadRunIds.clear();
    liveTerminalErrorMessages.clear();
    queuedHistoryReloadRunIds.clear();
    deferredHistoryRunEvents.clear();
    finalizedRuns.clear();
    finalizedRunsWithDisplay.clear();
    completedRuns.clear();
    sessionRuns.clear();
    postFinalizingRuns.clear();
    streamAssembler = new TuiStreamAssembler();
    pendingHistoryRefresh = false;
    clearPendingSubmit(state);
    reconnectPendingRunId = null;
    clearLocalRunIds?.();
    clearLocalBtwRunIds?.();
    clearPendingTerminalLifecycleErrors();
    btw.clear();
    clearStreamingWatchdog();
  };
  const armStreamingWatchdog = (runId) => {
    if (streamingWatchdogMs <= 0) return;
    if (streamingWatchdogTimer) clearTimeout(streamingWatchdogTimer);
    streamingWatchdogRunId = runId;
    streamingWatchdogTimer = setTimeout(() => {
      streamingWatchdogTimer = null;
      if (streamingWatchdogRunId !== runId || state.activeChatRunId !== runId) return;
      streamingWatchdogRunId = null;
      if (reconnectPendingRunId === runId) {
        reconnectPendingRunId = null;
        state.activeChatRunId = null;
        state.activityStatus = "idle";
        setActivityStatus("idle");
        pendingHistoryRefresh = false;
        reloadHistoryPreservingTerminalErrors();
        tui.requestRender();
        return;
      }
      chatLog.addPendingSystem(runId, STREAMING_WATCHDOG_USER_MESSAGE);
      tui.requestRender();
    }, streamingWatchdogMs);
    const maybeUnref = streamingWatchdogTimer.unref;
    if (typeof maybeUnref === "function") maybeUnref.call(streamingWatchdogTimer);
  };
  const pruneRunMap = (runs) => {
    if (runs.size <= 200) return;
    const keepUntil = Date.now() - 600 * 1e3;
    for (const [key, ts] of runs) {
      if (runs.size <= 150) break;
      if (ts < keepUntil) runs.delete(key);
    }
    if (runs.size > 200)
      for (const key of runs.keys()) {
        runs.delete(key);
        if (runs.size <= 150) break;
      }
  };
  const syncSessionKey = () => {
    if (state.currentSessionKey === lastSessionKey) return;
    lastSessionKey = state.currentSessionKey;
    if (state.activeChatRunId || hasPendingSubmit(state)) return;
    clearTrackedRunState();
  };
  const resolveAuthErrorHint = (errorMessage) => {
    if (!localMode) return;
    const provider = state.sessionInfo.modelProvider?.trim();
    const failoverReason = classifyFailoverReason(errorMessage, { provider });
    if (failoverReason === "billing" || failoverReason === "rate_limit") return;
    if (!isAuthErrorMessage(errorMessage)) return;
    return provider
      ? `auth or provider access failed for ${provider}. Run /auth ${provider} to refresh credentials; if you already re-authed, switch models/providers because this account may still be blocked for inference.`
      : "auth or provider access failed for the current provider. Run /auth to refresh credentials; if you already re-authed, switch models/providers because this account may still be blocked for inference.";
  };
  const parseProviderModelRef = (modelRef) => {
    if (typeof modelRef !== "string") return;
    const trimmed = modelRef.trim();
    const separator = trimmed.indexOf("/");
    if (separator <= 0 || separator >= trimmed.length - 1) return;
    const provider = trimmed.slice(0, separator).trim();
    const model = trimmed.slice(separator + 1).trim();
    return provider && model
      ? {
          provider,
          model,
        }
      : void 0;
  };
  const applyFallbackStepModelUpdate = (evt) => {
    const data = evt.data ?? {};
    if (evt.stream !== "lifecycle" || asString(data.phase, "") !== "fallback_step") return false;
    const target = parseProviderModelRef(data.fallbackStepToModel);
    if (!target) return false;
    state.sessionInfo.modelProvider = target.provider;
    state.sessionInfo.model = target.model;
    return true;
  };
  const noteSessionRun = (runId) => {
    sessionRuns.set(runId, Date.now());
    pruneRunMap(sessionRuns);
  };
  const markSubmittedRunRegistered = (runId) => {
    clearPendingSubmitDraft(state, runId);
  };
  const noteFinalizedRun = (runId, opts) => {
    finalizedRuns.set(runId, Date.now());
    completedRuns.set(runId, Date.now());
    if (opts?.displayedFinal === true) finalizedRunsWithDisplay.set(runId, Date.now());
    sessionRuns.delete(runId);
    streamAssembler.drop(runId);
    pruneRunMap(finalizedRuns);
    pruneRunMap(finalizedRunsWithDisplay);
    pruneRunMap(completedRuns);
    for (const retainedRunId of liveTerminalErrorMessages.keys())
      if (!finalizedRunsWithDisplay.has(retainedRunId))
        liveTerminalErrorMessages.delete(retainedRunId);
  };
  const notePostFinalizingRun = (runId) => {
    postFinalizingRuns.set(runId, Date.now());
    pruneRunMap(postFinalizingRuns);
  };
  const clearActiveRunIfMatch = (runId) => {
    if (state.activeChatRunId === runId) state.activeChatRunId = null;
  };
  const promoteMostRecentSessionRun = () => {
    if (state.activeChatRunId || sessionRuns.size === 0) return false;
    let nextRunId;
    let nextSeenAt = -1;
    for (const [runId, seenAt] of sessionRuns)
      if (seenAt > nextSeenAt) {
        nextRunId = runId;
        nextSeenAt = seenAt;
      }
    if (!nextRunId) return false;
    state.activeChatRunId = nextRunId;
    clearStreamingWatchdog();
    setActivityStatus("running");
    armStreamingWatchdog(nextRunId);
    return true;
  };
  const clearStaleStreamingIfNoTrackedRunRemains = () => {
    const activeRunId = state.activeChatRunId;
    const activeRunIsStillTracked = activeRunId ? sessionRuns.has(activeRunId) : false;
    if (state.activityStatus !== "streaming" || activeRunIsStillTracked || sessionRuns.size > 0)
      return;
    state.activeChatRunId = null;
    state.activityStatus = "idle";
    setActivityStatus("idle");
    clearStreamingWatchdog();
    flushPendingHistoryRefreshIfIdle();
  };
  const reconnectStreamingWatchdog = () => {
    clearStreamingWatchdog();
    const activeRunId = state.activeChatRunId;
    if (!activeRunId) {
      reconnectPendingRunId = null;
      clearStaleStreamingIfNoTrackedRunRemains();
      return;
    }
    if (!sessionRuns.has(activeRunId)) {
      reconnectPendingRunId = null;
      state.activeChatRunId = null;
      state.activityStatus = "idle";
      setActivityStatus("idle");
      flushPendingHistoryRefreshIfIdle();
      return;
    }
    reconnectPendingRunId = activeRunId;
    setActivityStatus("streaming");
    armStreamingWatchdog(activeRunId);
  };
  const finalizeRun = (params) => {
    noteFinalizedRun(params.runId, { displayedFinal: params.displayedFinal });
    clearActiveRunIfMatch(params.runId);
    const promotedRemainingRun = promoteMostRecentSessionRun();
    flushPendingHistoryRefreshIfIdle();
    if (!promotedRemainingRun)
      if (params.wasActiveRun) {
        setActivityStatus(params.status);
        clearStreamingWatchdog();
      } else {
        if (streamingWatchdogRunId === params.runId) clearStreamingWatchdog();
        clearStaleStreamingIfNoTrackedRunRemains();
      }
    refreshSessionInfo?.();
  };
  const terminateRun = (params) => {
    completedRuns.set(params.runId, Date.now());
    pruneRunMap(completedRuns);
    streamAssembler.drop(params.runId);
    sessionRuns.delete(params.runId);
    clearActiveRunIfMatch(params.runId);
    const promotedRemainingRun = promoteMostRecentSessionRun();
    flushPendingHistoryRefreshIfIdle();
    if (!promotedRemainingRun) {
      if (params.wasActiveRun) {
        setActivityStatus(params.status);
        clearStreamingWatchdog();
      } else if (streamingWatchdogRunId === params.runId) clearStreamingWatchdog();
    }
    refreshSessionInfo?.();
  };
  const renderTerminalRunError = (params) => {
    const { runId, errorMessage } = params;
    const wasActiveRun = state.activeChatRunId === runId;
    if (
      params.requireActiveOrPending === true &&
      !wasActiveRun &&
      getPendingSubmitAcceptedRunId(state) !== runId
    )
      return false;
    const renderedError = formatRawAssistantErrorForUi(errorMessage);
    chatLog.dismissPendingSystem(runId);
    const displayMessage = resolveAuthErrorHint(errorMessage) ?? `run error: ${renderedError}`;
    liveTerminalErrorMessages.set(runId, displayMessage);
    chatLog.addSystem(displayMessage);
    noteFinalizedRun(runId, { displayedFinal: true });
    terminateRun({
      runId,
      wasActiveRun,
      status: "error",
    });
    maybeRefreshHistoryForRun(runId, { hasDisplayableFinal: true });
    return true;
  };
  const renderTerminalLifecycleError = (runId, errorMessage) => {
    if (
      !renderTerminalRunError({
        runId,
        errorMessage,
        requireActiveOrPending: true,
      })
    )
      return;
    tui.requestRender(true);
  };
  const scheduleTerminalLifecycleError = (runId, errorMessage) => {
    clearPendingTerminalLifecycleError(runId);
    const timer = setTimeout(() => {
      pendingTerminalLifecycleErrors.delete(runId);
      renderTerminalLifecycleError(runId, errorMessage);
    }, LIFECYCLE_ERROR_RETRY_GRACE_MS);
    timer.unref?.();
    pendingTerminalLifecycleErrors.set(runId, {
      errorMessage,
      timer,
    });
  };
  const hasConcurrentActiveRun = (runId) => {
    const activeRunId = state.activeChatRunId;
    return Boolean(activeRunId && activeRunId !== runId);
  };
  const maybeRefreshHistoryForRun = (runId, opts) => {
    const isPendingChatRun =
      opts?.wasPendingChatRun === true || getPendingSubmitAcceptedRunId(state) === runId;
    if (isLocalRunId?.(runId) ?? false) {
      forgetLocalRunId?.(runId);
      if (!opts?.allowLocalWithoutDisplayableFinal) return;
      if (state.activeChatRunId && state.activeChatRunId !== runId) {
        pendingHistoryRefresh = true;
        return;
      }
    }
    if (!isPendingChatRun && hasPendingSubmit(state)) {
      pendingHistoryRefresh = true;
      return;
    }
    if (opts?.hasDisplayableFinal) return;
    if (hasConcurrentActiveRun(runId)) return;
    pendingHistoryRefresh = false;
    reloadHistoryPreservingTerminalErrors();
  };
  const messageHasDisplayableNonTextContent = (message) => {
    if (!message || typeof message !== "object") return false;
    const record = message;
    if (typeof record.mediaUrl === "string" && record.mediaUrl.trim()) return true;
    if (
      Array.isArray(record.mediaUrls) &&
      record.mediaUrls.some((media) => typeof media === "string" && media.trim())
    )
      return true;
    if (!Array.isArray(record.content)) return false;
    return record.content.some((block) => {
      if (!block || typeof block !== "object") return false;
      const type = block.type;
      return typeof type === "string" && type !== "text" && type !== "thinking";
    });
  };
  const hasDisplayableFinalEvent = (evt) => {
    if (typeof evt.errorMessage === "string" && evt.errorMessage.trim()) return true;
    if (!evt.message) return false;
    if (extractTextFromMessage(evt.message, { includeThinking: state.showThinking }).trim())
      return true;
    return messageHasDisplayableNonTextContent(evt.message);
  };
  const isSameSessionKey = (left, right) => {
    const normalizedLeft = normalizeLowercaseStringOrEmpty(left);
    const normalizedRight = normalizeLowercaseStringOrEmpty(right);
    if (!normalizedLeft || !normalizedRight) return false;
    if (normalizedLeft === normalizedRight) return true;
    const parsedLeft = parseAgentSessionKey(normalizedLeft);
    const parsedRight = parseAgentSessionKey(normalizedRight);
    if (parsedLeft && parsedRight)
      return parsedLeft.agentId === parsedRight.agentId && parsedLeft.rest === parsedRight.rest;
    if (parsedLeft) return parsedLeft.rest === normalizedRight;
    if (parsedRight) return normalizedLeft === parsedRight.rest;
    return false;
  };
  const isMatchingGlobalAgentEvent = (sessionKey, agentId) => {
    if (normalizeLowercaseStringOrEmpty(sessionKey) !== "global") return true;
    const selectedAgentId = normalizeLowercaseStringOrEmpty(state.currentAgentId);
    const defaultAgentId = normalizeLowercaseStringOrEmpty(state.agentDefaultId);
    const eventAgentId = normalizeLowercaseStringOrEmpty(agentId);
    if (eventAgentId) return eventAgentId === selectedAgentId;
    return selectedAgentId === defaultAgentId;
  };
  const handleChatEvent = (payload) => {
    if (!payload || typeof payload !== "object") return;
    const evt = payload;
    syncSessionKey();
    if (!isSameSessionKey(evt.sessionKey, state.currentSessionKey)) return;
    if (!isMatchingGlobalAgentEvent(evt.sessionKey, evt.agentId)) return;
    if (historyReloadRunIds.has(evt.runId)) {
      const previous = deferredHistoryRunEvents.get(evt.runId);
      if (!previous || previous.state === "delta" || evt.state !== "delta")
        deferredHistoryRunEvents.set(evt.runId, evt);
      return;
    }
    if (finalizedRuns.has(evt.runId)) {
      if (evt.state === "delta") return;
      if (evt.state === "error" && finalizedRunsWithDisplay.has(evt.runId)) {
        clearStaleStreamingIfNoTrackedRunRemains();
        return;
      }
      if (evt.state === "final") {
        if (!(hasDisplayableFinalEvent(evt) && !finalizedRunsWithDisplay.has(evt.runId))) {
          clearStaleStreamingIfNoTrackedRunRemains();
          return;
        }
      }
    }
    if (reconnectPendingRunId === evt.runId) reconnectPendingRunId = null;
    clearPendingTerminalLifecycleError(evt.runId);
    chatLog.dismissPendingSystem(evt.runId);
    noteSessionRun(evt.runId);
    markSubmittedRunRegistered(evt.runId);
    const isPendingChatRun = getPendingSubmitAcceptedRunId(state) === evt.runId;
    const isLocalChatRun = isLocalRunId?.(evt.runId) ?? false;
    const isLocalBtwRun = isLocalBtwRunId?.(evt.runId) ?? false;
    if (
      hasPendingSubmit(state) &&
      !isLocalBtwRun &&
      (isPendingChatRun || (isLocalChatRun && evt.runId !== state.activeChatRunId))
    ) {
      noteLocalRunId?.(evt.runId);
      clearPendingSubmit(state, evt.runId);
    }
    if (!state.activeChatRunId && !isLocalBtwRun) state.activeChatRunId = evt.runId;
    if (isPendingChatRun) clearPendingSubmit(state, evt.runId);
    if (evt.state === "delta") {
      setActivityStatus("streaming");
      if (state.activeChatRunId === evt.runId) armStreamingWatchdog(evt.runId);
      const displayText = streamAssembler.ingestDelta(evt.runId, evt.message, state.showThinking);
      if (!displayText) return;
      chatLog.updateAssistant(displayText, evt.runId);
    }
    if (evt.state === "final") {
      const isLocalBtwRunLocal = isLocalBtwRunId?.(evt.runId) ?? false;
      const wasActiveRun = state.activeChatRunId === evt.runId;
      if (!evt.message && isLocalBtwRunLocal) {
        forgetLocalBtwRunId?.(evt.runId);
        noteFinalizedRun(evt.runId);
        clearStaleStreamingIfNoTrackedRunRemains();
        tui.requestRender(true);
        return;
      }
      if (!evt.message) {
        maybeRefreshHistoryForRun(evt.runId, {
          allowLocalWithoutDisplayableFinal: true,
          wasPendingChatRun: isPendingChatRun,
        });
        chatLog.dropAssistant(evt.runId);
        finalizeRun({
          runId: evt.runId,
          wasActiveRun,
          status: "idle",
        });
        tui.requestRender(true);
        return;
      }
      if (isCommandMessage(evt.message)) {
        maybeRefreshHistoryForRun(evt.runId, { wasPendingChatRun: isPendingChatRun });
        const text = extractTextFromMessage(evt.message);
        if (text) chatLog.addSystem(text);
        finalizeRun({
          runId: evt.runId,
          wasActiveRun,
          status: "idle",
          displayedFinal: true,
        });
        tui.requestRender(true);
        return;
      }
      const stopReason =
        evt.message && typeof evt.message === "object" && !Array.isArray(evt.message)
          ? typeof evt.message.stopReason === "string"
            ? evt.message.stopReason
            : ""
          : "";
      const finalText = streamAssembler.finalize(
        evt.runId,
        evt.message,
        state.showThinking,
        evt.errorMessage,
      );
      const suppressEmptyExternalPlaceholder =
        finalText === "(no output)" && !isLocalRunId?.(evt.runId);
      maybeRefreshHistoryForRun(evt.runId, {
        hasDisplayableFinal: !suppressEmptyExternalPlaceholder,
        wasPendingChatRun: isPendingChatRun,
      });
      if (suppressEmptyExternalPlaceholder) chatLog.dropAssistant(evt.runId);
      else chatLog.finalizeAssistant(finalText, evt.runId);
      finalizeRun({
        runId: evt.runId,
        wasActiveRun,
        status: stopReason === "error" ? "error" : "idle",
        displayedFinal: !suppressEmptyExternalPlaceholder,
      });
    }
    if (evt.state === "aborted") {
      forgetLocalBtwRunId?.(evt.runId);
      const wasActiveRun = state.activeChatRunId === evt.runId;
      const diagnostic = formatAbortDiagnostic(evt.errorMessage);
      chatLog.addSystem(diagnostic ? `run aborted: ${diagnostic}` : "run aborted");
      terminateRun({
        runId: evt.runId,
        wasActiveRun,
        status: "aborted",
      });
      maybeRefreshHistoryForRun(evt.runId);
    }
    if (evt.state === "error") {
      forgetLocalBtwRunId?.(evt.runId);
      renderTerminalRunError({
        runId: evt.runId,
        errorMessage: evt.errorMessage ?? "unknown",
      });
    }
    tui.requestRender();
  };
  const drainHistoryReloadQueue = () => {
    if (historyReloadInFlight || queuedHistoryReloadRunIds.size === 0 || !loadHistory) return;
    const reloadGeneration = historyReloadGeneration;
    const runIds = Array.from(queuedHistoryReloadRunIds);
    queuedHistoryReloadRunIds.clear();
    historyReloadInFlight = true;
    const finishReload = (result) => {
      if (reloadGeneration !== historyReloadGeneration) return;
      for (const runId of runIds) {
        historyReloadRunIds.delete(runId);
        const deferred = deferredHistoryRunEvents.get(runId);
        deferredHistoryRunEvents.delete(runId);
        const historyOwned = historyOwnedReloadRunIds.delete(runId);
        const previouslyDisplayed = historyDisplayedReloadRunIds.delete(runId);
        const restoredInFlight = result.loaded && result.inFlightRunId === runId;
        if (historyOwned && !restoredInFlight)
          finalizeRun({
            runId,
            wasActiveRun: state.activeChatRunId === runId,
            status: "idle",
            displayedFinal: result.loaded || previouslyDisplayed,
          });
        if (deferred && (!result.loaded || historyOwned || restoredInFlight))
          handleChatEvent(deferred);
      }
    };
    reloadHistoryPreservingTerminalErrors()
      .then(finishReload, () => finishReload({ loaded: false }))
      .finally(() => {
        historyReloadInFlight = false;
        drainHistoryReloadQueue();
      });
  };
  const queueHistoryReload = (runIds, historyOwnedRunIds, displayedRunIds = []) => {
    const historyOwned = new Set(historyOwnedRunIds);
    const displayed = new Set(displayedRunIds);
    if (!loadHistory) {
      for (const runId of runIds)
        if (historyOwned.has(runId)) noteFinalizedRun(runId, { displayedFinal: true });
      refreshSessionInfo?.();
      return;
    }
    for (const runId of runIds) {
      historyReloadRunIds.add(runId);
      queuedHistoryReloadRunIds.add(runId);
      if (historyOwned.has(runId)) historyOwnedReloadRunIds.add(runId);
      if (displayed.has(runId)) historyDisplayedReloadRunIds.add(runId);
    }
    drainHistoryReloadQueue();
  };
  const collectTrackedSessionRunIds = () => {
    const runIds = new Set(sessionRuns.keys());
    if (state.activeChatRunId) runIds.add(state.activeChatRunId);
    const pendingRunId = getPendingSubmitAcceptedRunId(state);
    if (pendingRunId) runIds.add(pendingRunId);
    const finalizedRunIds = new Set(finalizedRuns.keys());
    const displayedRunIds = new Set(finalizedRunsWithDisplay.keys());
    for (const runId of finalizedRunIds) runIds.add(runId);
    return {
      runIds,
      finalizedRunIds,
      displayedRunIds,
    };
  };
  const handleSessionsChangedEvent = (payload) => {
    if (!payload || typeof payload !== "object") return;
    const evt = payload;
    syncSessionKey();
    if (!isSameSessionKey(evt.sessionKey, state.currentSessionKey)) return;
    if (!isMatchingGlobalAgentEvent(evt.sessionKey, evt.agentId)) return;
    if (evt.runId && (evt.phase === "end" || evt.phase === "error")) {
      persistedTerminalRunIds.set(evt.runId, Date.now());
      pruneRunMap(persistedTerminalRunIds);
      if (pendingNewSessionRunIds.delete(evt.runId))
        if (evt.phase === "end") {
          const displayedRunIds = finalizedRunsWithDisplay.has(evt.runId) ? [evt.runId] : [];
          queueHistoryReload([evt.runId], [evt.runId], displayedRunIds);
        } else refreshSessionInfo?.();
      return;
    }
    if (evt.reason !== "new" && evt.reason !== "reset") return;
    const nextSessionId = typeof evt.sessionId === "string" ? evt.sessionId : null;
    const replacesKnownSession =
      state.currentSessionId !== null &&
      nextSessionId !== null &&
      state.currentSessionId !== nextSessionId;
    if (evt.reason === "new" && !replacesKnownSession) {
      const { runIds, displayedRunIds } = collectTrackedSessionRunIds();
      if (runIds.size > 0) {
        if (nextSessionId) state.currentSessionId = nextSessionId;
        if (typeof evt.updatedAt === "number" || evt.updatedAt === null)
          state.sessionInfo.updatedAt = evt.updatedAt;
        const persistedRunIds = [];
        for (const runId of runIds)
          if (persistedTerminalRunIds.has(runId)) persistedRunIds.push(runId);
          else pendingNewSessionRunIds.add(runId);
        queueHistoryReload(persistedRunIds, persistedRunIds, displayedRunIds);
        tui.requestRender();
        return;
      }
    }
    const {
      runIds: reloadingRunIds,
      finalizedRunIds,
      displayedRunIds,
    } = collectTrackedSessionRunIds();
    clearTrackedRunState();
    state.activeChatRunId = null;
    state.activityStatus = "idle";
    setActivityStatus("idle");
    if (nextSessionId) state.currentSessionId = nextSessionId;
    if (typeof evt.updatedAt === "number" || evt.updatedAt === null)
      state.sessionInfo.updatedAt = evt.updatedAt;
    if (reloadingRunIds.size > 0)
      queueHistoryReload(reloadingRunIds, finalizedRunIds, displayedRunIds);
    else if (loadHistory) reloadHistoryPreservingTerminalErrors();
    else refreshSessionInfo?.();
    tui.requestRender();
  };
  const handleAgentEvent = (payload) => {
    if (!payload || typeof payload !== "object") return;
    const evt = payload;
    syncSessionKey();
    if (
      evt.runId !== state.activeChatRunId &&
      evt.runId !== getPendingSubmitAcceptedRunId(state) &&
      !sessionRuns.has(evt.runId) &&
      !finalizedRuns.has(evt.runId) &&
      evt.stream === "lifecycle" &&
      asString(evt.data?.phase, "") === "start" &&
      !(isLocalBtwRunId?.(evt.runId) ?? false) &&
      isSameSessionKey(evt.sessionKey, state.currentSessionKey) &&
      isMatchingGlobalAgentEvent(evt.sessionKey, evt.agentId)
    ) {
      noteSessionRun(evt.runId);
      if (!state.activeChatRunId) state.activeChatRunId = evt.runId;
    }
    const isActiveRun = evt.runId === state.activeChatRunId;
    const isPendingRun = evt.runId === getPendingSubmitAcceptedRunId(state);
    const isSessionRun = sessionRuns.has(evt.runId);
    if ((isActiveRun || isPendingRun || isSessionRun) && applyFallbackStepModelUpdate(evt)) {
      if (isActiveRun) armStreamingWatchdog(evt.runId);
      tui.requestRender();
      return;
    }
    if (!(isActiveRun || isPendingRun || isSessionRun || finalizedRuns.has(evt.runId))) return;
    if (evt.stream === "tool") {
      if (isActiveRun) armStreamingWatchdog(evt.runId);
      const verbose = state.sessionInfo.verboseLevel ?? "off";
      const allowToolEvents = verbose !== "off";
      const allowToolOutput = verbose === "full";
      if (!allowToolEvents) return;
      const data = evt.data ?? {};
      const phase = asString(data.phase, "");
      const toolCallId = asString(data.toolCallId, "");
      const toolName = asString(data.name, "tool");
      if (!toolCallId) return;
      if (phase === "start") chatLog.startTool(toolCallId, toolName, data.args);
      else if (phase === "update") {
        if (!allowToolOutput) return;
        chatLog.updateToolResult(toolCallId, data.partialResult, { partial: true });
      } else if (phase === "result")
        if (allowToolOutput)
          chatLog.updateToolResult(toolCallId, data.result, { isError: Boolean(data.isError) });
        else
          chatLog.updateToolResult(toolCallId, { content: [] }, { isError: Boolean(data.isError) });
      tui.requestRender();
      return;
    }
    if (evt.stream === "lifecycle") {
      if (isPendingRun) {
        noteSessionRun(evt.runId);
        markSubmittedRunRegistered(evt.runId);
        state.activeChatRunId = evt.runId;
        noteLocalRunId?.(evt.runId);
        clearPendingSubmit(state, evt.runId);
      }
      const phase = typeof evt.data?.phase === "string" ? evt.data.phase : "";
      if (phase && phase !== "error") clearPendingTerminalLifecycleError(evt.runId);
      const isPostFinalTerminalPhase =
        postFinalizingRuns.has(evt.runId) && (phase === "end" || phase === "error");
      if (!isActiveRun && !isPendingRun && phase !== "finishing" && !isPostFinalTerminalPhase)
        return;
      const canUpdateActivityStatus = !hasConcurrentActiveRun(evt.runId);
      if (phase && phase !== "end" && phase !== "error" && phase !== "finishing")
        armStreamingWatchdog(evt.runId);
      if (phase === "start") {
        if (!canUpdateActivityStatus) return;
        setActivityStatus("running");
      }
      if (phase === "finishing") {
        notePostFinalizingRun(evt.runId);
        if (!canUpdateActivityStatus) return;
        clearStreamingWatchdog();
        setActivityStatus("finishing context");
      }
      let forceRender = false;
      if (phase === "end") {
        postFinalizingRuns.delete(evt.runId);
        if (!canUpdateActivityStatus) return;
        setActivityStatus("idle");
        forceRender = true;
      }
      if (phase === "error") {
        postFinalizingRuns.delete(evt.runId);
        if (!canUpdateActivityStatus) return;
        if (typeof evt.data?.endedAt === "number" && (isActiveRun || isPendingRun)) {
          const errorMessage =
            typeof evt.data?.error === "string"
              ? evt.data.error
              : typeof evt.data?.errorMessage === "string"
                ? evt.data.errorMessage
                : "unknown";
          scheduleTerminalLifecycleError(evt.runId, errorMessage);
          setActivityStatus("error");
        } else setActivityStatus("error");
        forceRender = true;
      }
      tui.requestRender(forceRender);
    }
  };
  const handleBtwEvent = (payload) => {
    if (!payload || typeof payload !== "object") return;
    const evt = payload;
    syncSessionKey();
    if (!isSameSessionKey(evt.sessionKey, state.currentSessionKey)) return;
    if (!isMatchingGlobalAgentEvent(evt.sessionKey, evt.agentId)) return;
    if (evt.kind !== "btw") return;
    const question = evt.question.trim();
    const text = evt.text.trim();
    if (!question || !text) return;
    btw.showResult({
      question,
      text,
      isError: evt.isError,
    });
    tui.requestRender();
  };
  const dispose = () => {
    historyReloadGeneration += 1;
    pendingNewSessionRunIds.clear();
    persistedTerminalRunIds.clear();
    historyReloadRunIds.clear();
    historyOwnedReloadRunIds.clear();
    historyDisplayedReloadRunIds.clear();
    liveTerminalErrorMessages.clear();
    queuedHistoryReloadRunIds.clear();
    deferredHistoryRunEvents.clear();
    clearStreamingWatchdog();
    clearPendingTerminalLifecycleErrors();
  };
  const consumeCompletedRunForPendingSend = (runId) => {
    if (!completedRuns.has(runId)) return false;
    completedRuns.delete(runId);
    return true;
  };
  const isRunObserved = (runId) => sessionRuns.has(runId);
  return {
    handleChatEvent,
    handleAgentEvent,
    handleBtwEvent,
    handleSessionsChangedEvent,
    pauseStreamingWatchdog,
    reconnectStreamingWatchdog,
    consumeCompletedRunForPendingSend,
    isRunObserved,
    flushPendingHistoryRefreshIfIdle,
    dispose,
  };
}
//#endregion
//#region src/tui/tui-last-session.ts
/** Resolves the private state file for remembered TUI sessions. */
function resolveTuiLastSessionStatePath(stateDir = resolveStateDir()) {
  return path.join(stateDir, "tui", "last-session.json");
}
/** Builds a stable private-store key for the current TUI connection, agent, and session scope. */
function buildTuiLastSessionScopeKey(params) {
  const agentId = normalizeAgentId(params.agentId);
  const connectionUrl = params.connectionUrl.trim() || "local";
  return createHash("sha256")
    .update(`${params.sessionScope}\n${agentId}\n${connectionUrl}`)
    .digest("hex")
    .slice(0, 32);
}
async function readStore(filePath) {
  try {
    const parsed = await privateFileStore(path.dirname(filePath)).readJsonIfExists(
      path.basename(filePath),
    );
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
function normalizeMarker(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function isHeartbeatSessionKey(sessionKey) {
  return normalizeMarker(sessionKey).endsWith(":heartbeat");
}
/** Detects heartbeat/system sessions that should not become the remembered human session. */
function isHeartbeatLikeTuiSession(session) {
  if (isHeartbeatSessionKey(session.key)) return true;
  return [
    session.provider,
    session.lastProvider,
    session.lastChannel,
    session.lastTo,
    session.origin?.provider,
    session.origin?.surface,
    session.origin?.label,
  ].some((marker) => normalizeMarker(marker) === "heartbeat");
}
/** Reads the remembered session key for a scope, ignoring missing or malformed stores. */
async function readTuiLastSessionKey(params) {
  const value = (await readStore(resolveTuiLastSessionStatePath(params.stateDir)))[params.scopeKey]
    ?.sessionKey;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
/** Writes the remembered session key unless it is empty, unknown, or heartbeat-owned. */
async function writeTuiLastSessionKey(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey || sessionKey === "unknown" || isHeartbeatSessionKey(sessionKey)) return;
  const filePath = resolveTuiLastSessionStatePath(params.stateDir);
  const store = await readStore(filePath);
  store[params.scopeKey] = {
    sessionKey,
    updatedAt: Date.now(),
  };
  await privateFileStore(path.dirname(filePath)).writeJson(path.basename(filePath), store, {
    trailingNewline: true,
  });
}
/** Resolves a remembered key to a currently listed session for the active agent. */
function resolveRememberedTuiSessionKey(params) {
  const rememberedKey = params.rememberedKey?.trim();
  if (!rememberedKey) return null;
  if (isHeartbeatSessionKey(rememberedKey)) return null;
  const currentAgentId = normalizeAgentId(params.currentAgentId);
  const parsed = parseAgentSessionKey(rememberedKey);
  if (parsed && normalizeAgentId(parsed.agentId) !== currentAgentId) return null;
  const rememberedRest = parsed?.rest ?? rememberedKey;
  return (
    params.sessions.find((session) => {
      if (isHeartbeatLikeTuiSession(session)) return false;
      if (session.key === rememberedKey) return true;
      return parseAgentSessionKey(session.key)?.rest === rememberedRest;
    })?.key ?? null
  );
}
//#endregion
//#region src/tui/tui-local-shell.ts
function createLocalShellRunner(deps) {
  let localExecAsked = false;
  let localExecAllowed = false;
  const createSelector = deps.createSelector ?? createSearchableSelectList;
  const spawnCommand = deps.spawnCommand ?? spawn;
  const getCwd = deps.getCwd ?? tryProcessCwd;
  const env = deps.env ?? process.env;
  const maxChars = deps.maxOutputChars ?? 4e4;
  const ensureLocalExecAllowed = async () => {
    if (localExecAllowed) return true;
    if (localExecAsked) return false;
    localExecAsked = true;
    return await new Promise((resolve) => {
      deps.chatLog.addSystem("Allow local shell commands for this session?");
      deps.chatLog.addSystem(
        "This runs commands on YOUR machine (not the gateway) and may delete files or reveal secrets.",
      );
      deps.chatLog.addSystem("Select Yes/No (arrows + Enter), Esc to cancel.");
      const selector = createSelector(
        [
          {
            value: "no",
            label: "No",
          },
          {
            value: "yes",
            label: "Yes",
          },
        ],
        2,
      );
      selector.onSelect = (item) => {
        deps.closeOverlay(overlayHandle);
        if (item.value === "yes") {
          localExecAllowed = true;
          deps.chatLog.addSystem("local shell: enabled for this session");
          resolve(true);
        } else {
          deps.chatLog.addSystem("local shell: not enabled");
          resolve(false);
        }
        deps.tui.requestRender();
      };
      selector.onCancel = () => {
        deps.closeOverlay(overlayHandle);
        deps.chatLog.addSystem("local shell: cancelled");
        deps.tui.requestRender();
        resolve(false);
      };
      const overlayHandle = deps.openOverlay(selector);
      deps.tui.requestRender();
    });
  };
  const runLocalShellLine = async (line) => {
    const cmd = line.slice(1);
    if (cmd === "") return;
    if (localExecAsked && !localExecAllowed) {
      deps.chatLog.addSystem("local shell: not enabled for this session");
      deps.tui.requestRender();
      return;
    }
    if (!(await ensureLocalExecAllowed())) return;
    const cwd = getCwd();
    if (!cwd) {
      deps.chatLog.addSystem(
        "local shell: working directory was deleted; cd to an existing directory first",
      );
      deps.tui.requestRender();
      return;
    }
    deps.chatLog.addSystem(`[local] $ ${cmd}`);
    deps.tui.requestRender();
    const appendWithCap = (text, chunk) => {
      const combined = text + chunk;
      return combined.length > maxChars ? sliceUtf16Safe(combined, -maxChars) : combined;
    };
    await new Promise((resolve) => {
      const child = spawnCommand(cmd, {
        shell: true,
        cwd,
        env: {
          ...env,
          OPENCLAW_SHELL: "tui-local",
        },
      });
      let stdout = "";
      let stderr = "";
      const ignoreOutputStreamError = () => {};
      child.stdout.on("error", ignoreOutputStreamError);
      child.stderr.on("error", ignoreOutputStreamError);
      child.stdout.on("data", (buf) => {
        stdout = appendWithCap(stdout, buf.toString("utf8"));
      });
      child.stderr.on("data", (buf) => {
        stderr = appendWithCap(stderr, buf.toString("utf8"));
      });
      child.on("close", (code, signal) => {
        const combined = sliceUtf16Safe(
          stdout + (stderr ? (stdout ? "\n" : "") + stderr : ""),
          -maxChars,
        ).trimEnd();
        if (combined)
          for (const lineLocal of combined.split("\n"))
            deps.chatLog.addSystem(`[local] ${lineLocal}`);
        deps.chatLog.addSystem(`[local] exit ${code ?? "?"}${signal ? ` (signal ${signal})` : ""}`);
        deps.tui.requestRender();
        resolve();
      });
      child.on("error", (err) => {
        deps.chatLog.addSystem(`[local] error: ${String(err)}`);
        deps.tui.requestRender();
        resolve();
      });
    });
  };
  return { runLocalShellLine };
}
//#endregion
//#region src/tui/tui-overlays.ts
/** Creates open/close handlers that restore focus when no overlay is active. */
function createOverlayHandlers(host, fallbackFocus) {
  const openOverlay = (component) => {
    return host.showOverlay(component);
  };
  const closeOverlay = (handle) => {
    if (handle) {
      handle.hide();
      if (!host.hasOverlay()) host.setFocus(fallbackFocus);
      return;
    }
    if (host.hasOverlay()) {
      host.hideOverlay();
      return;
    }
    host.setFocus(fallbackFocus);
  };
  return {
    openOverlay,
    closeOverlay,
  };
}
//#endregion
//#region src/tui/tui-plugin-approvals.ts
const APPROVAL_BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;
function sanitizeApprovalText(text) {
  return sanitizeRenderableText(
    text.replace(APPROVAL_BIDI_CONTROL_RE, "").replace(/\s+/g, " ").trim(),
  );
}
var PluginApprovalPrompt = class {
  constructor(surfaceLabel, approval, selector) {
    this.selector = selector;
    this.confirmation = new Text();
    const title = sanitizeApprovalText(approval.request.title);
    const description = sanitizeApprovalText(approval.request.description ?? "");
    const severity = approval.request.severity ?? "warning";
    const metadata = [
      `Severity: ${severity === "critical" ? "Critical" : severity === "info" ? "Info" : "Warning"}`,
      ...(approval.request.toolName
        ? [`Tool: ${sanitizeApprovalText(approval.request.toolName)}`]
        : []),
      ...(approval.request.pluginId
        ? [`Plugin: ${sanitizeApprovalText(approval.request.pluginId)}`]
        : []),
    ];
    this.title = new Text(theme.header(`${surfaceLabel}: ${title}`));
    this.metadata = new Text(theme.dim(metadata.join("\n")));
    this.description = new Text(theme.system(description ? `Request: ${description}` : ""));
  }
  setConfirmation(text) {
    this.confirmation.setText(theme.accent(text));
  }
  invalidate() {
    this.title.invalidate();
    this.metadata.invalidate();
    this.description.invalidate();
    this.confirmation.invalidate();
    this.selector.invalidate();
  }
  render(width) {
    const description = this.description.render(width);
    const confirmation = this.confirmation.render(width);
    return [
      ...this.title.render(width),
      ...this.metadata.render(width),
      ...(description.some((line) => line.trim()) ? description : []),
      ...(confirmation.some((line) => line.trim()) ? ["", ...confirmation] : []),
      "",
      ...this.selector.render(width),
    ];
  }
  handleInput(data) {
    this.selector.handleInput?.(data);
  }
};
const DEFAULT_DECISIONS = ["allow-once", "allow-always", "deny"];
const DECISION_ITEMS = {
  "allow-once": {
    value: "allow-once",
    label: "Allow once",
    description: "Approve this change",
  },
  "allow-always": {
    value: "allow-always",
    label: "Always allow",
    description: "Approve matching future changes",
  },
  deny: {
    value: "deny",
    label: "Deny",
    description: "Do not apply this change",
  },
};
function isRecord$1(value) {
  return typeof value === "object" && value !== null;
}
function parseDecision(value) {
  return value === "allow-once" || value === "allow-always" || value === "deny" ? value : null;
}
function parseAllowedDecisions(value) {
  if (!Array.isArray(value)) return;
  const decisions = [];
  for (const candidate of value) {
    const decision = parseDecision(candidate);
    if (decision && !decisions.includes(decision)) decisions.push(decision);
  }
  return decisions.length > 0 ? decisions : void 0;
}
function parseSeverity(value) {
  return value === "info" || value === "warning" || value === "critical" ? value : null;
}
/** Parses the gateway event/list shape used for pending plugin approvals. */
function parseTuiPluginApproval(payload) {
  if (!isRecord$1(payload) || !isRecord$1(payload.request)) return null;
  const id = typeof payload.id === "string" ? payload.id.trim() : "";
  const title = typeof payload.request.title === "string" ? payload.request.title.trim() : "";
  const createdAtMs = typeof payload.createdAtMs === "number" ? payload.createdAtMs : 0;
  const expiresAtMs = typeof payload.expiresAtMs === "number" ? payload.expiresAtMs : 0;
  if (!id || !title || !createdAtMs || !expiresAtMs) return null;
  return {
    id,
    request: {
      title,
      description:
        typeof payload.request.description === "string" ? payload.request.description : null,
      pluginId: typeof payload.request.pluginId === "string" ? payload.request.pluginId : null,
      severity: parseSeverity(payload.request.severity),
      toolName: typeof payload.request.toolName === "string" ? payload.request.toolName : null,
      allowedDecisions: parseAllowedDecisions(payload.request.allowedDecisions),
      agentId: typeof payload.request.agentId === "string" ? payload.request.agentId : null,
      sessionKey:
        typeof payload.request.sessionKey === "string" ? payload.request.sessionKey : null,
    },
    createdAtMs,
    expiresAtMs,
  };
}
function parseResolvedApprovalId(payload) {
  if (!isRecord$1(payload) || typeof payload.id !== "string") return null;
  return payload.id.trim() || null;
}
function decisionLabel(decision) {
  if (decision === "allow-once") return "allowed once";
  if (decision === "allow-always") return "always allowed";
  return "denied";
}
function approvalSurfaceLabel(approval) {
  return approval.request.toolName === "skill_workshop"
    ? "workspace skill approval"
    : "plugin approval";
}
/** Coordinates pending plugin approval events with the active TUI overlay. */
function createTuiPluginApprovalController(deps) {
  const createSelector =
    deps.createSelector ?? ((items) => new SelectList(items, items.length, selectListTheme));
  const nowMs = deps.nowMs ?? Date.now;
  const setTimeoutFn = deps.setTimeoutFn ?? setTimeout;
  const clearTimeoutFn = deps.clearTimeoutFn ?? clearTimeout;
  let queue = [];
  let activeId = null;
  let activeOverlay = null;
  let expiryTimer = null;
  let disposed = false;
  let mutationVersion = 0;
  let refreshAgain = false;
  let refreshInFlight = null;
  const mutations = /* @__PURE__ */ new Map();
  const resolvingIds = /* @__PURE__ */ new Set();
  const dismissedIds = /* @__PURE__ */ new Set();
  const clearExpiryTimer = () => {
    if (expiryTimer !== null) {
      clearTimeoutFn(expiryTimer);
      expiryTimer = null;
    }
  };
  const closeActiveOverlay = () => {
    const handle = activeOverlay;
    activeOverlay = null;
    if (handle) deps.closeOverlay(handle);
  };
  const recordMutation = (id, approval) => {
    if (!refreshInFlight) return;
    mutationVersion += 1;
    mutations.set(id, {
      version: mutationVersion,
      approval,
    });
  };
  const remove = (id, record = true) => {
    queue = queue.filter((approval) => approval.id !== id);
    dismissedIds.delete(id);
    if (record) recordMutation(id, null);
  };
  const add = (approval, record = true) => {
    queue = queue.filter((entry) => entry.id !== approval.id);
    queue.push(approval);
    queue.sort((left, right) => left.createdAtMs - right.createdAtMs);
    if (record) recordMutation(approval.id, approval);
  };
  const matchesActiveSession = (approval) => {
    const sessionKey = approval.request.sessionKey?.trim();
    if (!sessionKey || sessionKey !== deps.getSessionKey()) return false;
    if (sessionKey !== "global") return true;
    const agentId = approval.request.agentId?.trim();
    return Boolean(agentId && agentId === deps.getAgentId());
  };
  const prune = () => {
    const now = nowMs();
    for (const approval of queue.filter((entry) => entry.expiresAtMs <= now)) remove(approval.id);
  };
  const presentNext = () => {
    if (disposed || activeId) return;
    prune();
    const approval = queue.find(
      (candidate) =>
        !resolvingIds.has(candidate.id) &&
        !dismissedIds.has(candidate.id) &&
        matchesActiveSession(candidate),
    );
    if (!approval) return;
    activeId = approval.id;
    const surfaceLabel = approvalSurfaceLabel(approval);
    const decisions = approval.request.allowedDecisions ?? DEFAULT_DECISIONS;
    const selector = createSelector(decisions.map((decision) => DECISION_ITEMS[decision]));
    let allowDecisionArmed = false;
    let prompt = null;
    const denyIndex = decisions.indexOf("deny");
    let selectedDecision = denyIndex >= 0 ? decisions[denyIndex] : decisions[0];
    if (denyIndex >= 0) selector.setSelectedIndex?.(denyIndex);
    selector.onSelectionChange = (item) => {
      const decision = parseDecision(item.value);
      if (!decision || decision === selectedDecision) return;
      selectedDecision = decision;
      allowDecisionArmed = decision !== "deny";
      prompt?.setConfirmation("");
    };
    const resolve = async (decision) => {
      if (activeId !== approval.id) return;
      clearExpiryTimer();
      activeId = null;
      resolvingIds.add(approval.id);
      closeActiveOverlay();
      deps.requestRender();
      let stale = false;
      try {
        if (!deps.client.resolvePluginApproval)
          throw new Error("plugin approval resolution is unavailable");
        if ((await deps.client.resolvePluginApproval(approval.id, decision))?.ok === false)
          stale = true;
        else {
          remove(approval.id);
          deps.chatLog.addSystem(`${surfaceLabel}: ${decisionLabel(decision)}`);
        }
      } catch (error) {
        if (isApprovalStaleError(error)) stale = true;
        else deps.chatLog.addSystem(`${surfaceLabel} failed: ${formatErrorMessage(error)}`);
      }
      if (stale) {
        remove(approval.id);
        deps.chatLog.addSystem(`${surfaceLabel}: no longer pending`);
        try {
          await refreshApprovals();
        } catch (error) {
          deps.chatLog.addSystem(`${surfaceLabel} refresh failed: ${formatErrorMessage(error)}`);
        }
      }
      resolvingIds.delete(approval.id);
      presentNext();
      if (!disposed) deps.requestRender();
    };
    selector.onSelect = (item) => {
      const decision = parseDecision(item.value);
      if (!decision) return;
      if (decision !== "deny" && !allowDecisionArmed) {
        allowDecisionArmed = true;
        prompt?.setConfirmation(`Press Enter again to confirm ${item.label}.`);
        deps.requestRender();
        return;
      }
      resolve(decision);
    };
    selector.onCancel = () => {
      const deny = decisions.includes("deny") ? "deny" : null;
      if (deny) {
        resolve(deny);
        return;
      }
      clearExpiryTimer();
      dismissedIds.add(approval.id);
      activeId = null;
      closeActiveOverlay();
      deps.chatLog.addSystem(`${surfaceLabel}: dismissed; request remains pending`);
      presentNext();
      deps.requestRender();
    };
    const timer = setTimeoutFn(
      () => {
        if (activeId !== approval.id) return;
        expiryTimer = null;
        activeId = null;
        remove(approval.id);
        closeActiveOverlay();
        deps.chatLog.addSystem(`${surfaceLabel}: expired`);
        presentNext();
        deps.requestRender();
      },
      Math.max(1, approval.expiresAtMs - nowMs()),
    );
    expiryTimer = timer;
    if (typeof timer !== "number") timer.unref?.();
    prompt = new PluginApprovalPrompt(surfaceLabel, approval, selector);
    activeOverlay = deps.openOverlay(prompt);
    deps.requestRender();
  };
  const applySnapshot = (approvals, startedAtVersion) => {
    const next = new Map(approvals.map((approval) => [approval.id, approval]));
    for (const [id, mutation] of mutations) {
      if (mutation.version <= startedAtVersion) {
        mutations.delete(id);
        continue;
      }
      if (mutation.approval) next.set(id, mutation.approval);
      else next.delete(id);
    }
    for (const id of dismissedIds) if (!next.has(id)) dismissedIds.delete(id);
    queue = [...next.values()].toSorted((left, right) => left.createdAtMs - right.createdAtMs);
  };
  const refreshOnce = async () => {
    if (disposed || !deps.client.listPluginApprovals) return;
    const startedAtVersion = mutationVersion;
    const payload = await deps.client.listPluginApprovals();
    if (disposed || !Array.isArray(payload)) return;
    const approvals = [];
    for (const entry of payload) {
      const approval = parseTuiPluginApproval(entry);
      if (approval) approvals.push(approval);
    }
    applySnapshot(approvals, startedAtVersion);
    if (activeId && !queue.some((approval) => approval.id === activeId)) {
      clearExpiryTimer();
      activeId = null;
      closeActiveOverlay();
    }
    presentNext();
    deps.requestRender();
  };
  const refreshApprovals = async () => {
    if (disposed || !deps.client.listPluginApprovals) return;
    if (refreshInFlight) {
      refreshAgain = true;
      return await refreshInFlight;
    }
    refreshInFlight = (async () => {
      do {
        refreshAgain = false;
        await refreshOnce();
      } while (refreshAgain);
    })();
    try {
      await refreshInFlight;
    } finally {
      refreshInFlight = null;
    }
  };
  return {
    handleEvent(event, payload) {
      if (disposed) return;
      if (event === "plugin.approval.requested") {
        const approval = parseTuiPluginApproval(payload);
        if (approval) {
          add(approval);
          presentNext();
        }
        return;
      }
      if (event !== "plugin.approval.resolved" && event !== "plugin.approval.removed") return;
      const id = parseResolvedApprovalId(payload);
      if (!id) return;
      remove(id);
      resolvingIds.delete(id);
      if (activeId === id) {
        clearExpiryTimer();
        activeId = null;
        closeActiveOverlay();
      }
      presentNext();
      deps.requestRender();
    },
    refresh: refreshApprovals,
    sessionChanged() {
      if (disposed) return;
      const activeApproval = activeId ? queue.find((approval) => approval.id === activeId) : void 0;
      if (activeApproval && !matchesActiveSession(activeApproval)) {
        clearExpiryTimer();
        activeId = null;
        closeActiveOverlay();
        deps.requestRender();
      }
      presentNext();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      clearExpiryTimer();
      queue = [];
      dismissedIds.clear();
      mutations.clear();
      resolvingIds.clear();
      if (activeId) {
        activeId = null;
        closeActiveOverlay();
        deps.requestRender();
      }
    },
  };
}
//#endregion
//#region src/tui/tui-session-actions.ts
function thinkingLevelsEqual(left, right) {
  if (left === right) return true;
  if (!left || !right || left.length !== right.length) return false;
  return left.every((level, index) => {
    const other = right[index];
    return other?.id === level.id && other.label === level.label;
  });
}
function goalEquals(left, right) {
  return left === right || JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}
function agentRuntimeEquals(left, right) {
  return (
    left === right ||
    (left?.id === right?.id && left?.source === right?.source && left?.fallback === right?.fallback)
  );
}
function sessionInfoUiEquals(left, right) {
  return (
    left.thinkingLevel === right.thinkingLevel &&
    thinkingLevelsEqual(left.thinkingLevels, right.thinkingLevels) &&
    left.fastMode === right.fastMode &&
    left.verboseLevel === right.verboseLevel &&
    left.traceLevel === right.traceLevel &&
    left.reasoningLevel === right.reasoningLevel &&
    left.model === right.model &&
    left.modelProvider === right.modelProvider &&
    agentRuntimeEquals(left.agentRuntime, right.agentRuntime) &&
    left.contextTokens === right.contextTokens &&
    left.inputTokens === right.inputTokens &&
    left.outputTokens === right.outputTokens &&
    left.totalTokens === right.totalTokens &&
    left.responseUsage === right.responseUsage &&
    left.effectiveResponseUsage === right.effectiveResponseUsage &&
    left.displayName === right.displayName &&
    goalEquals(left.goal, right.goal)
  );
}
function extractMessageTimestamp(message) {
  const raw = message.timestamp;
  return asDateTimestampMs(typeof raw === "string" ? Date.parse(raw) : raw) ?? null;
}
function createSessionActions(context) {
  const {
    client,
    chatLog,
    btw,
    tui,
    opts,
    state,
    agentNames,
    initialSessionInput,
    initialSessionAgentId,
    resolveSessionKey,
    updateHeader,
    updateFooter,
    updateAutocompleteProvider,
    setActivityStatus,
    clearLocalRunIds,
    rememberSessionKey,
  } = context;
  let refreshSessionInfoInFlight = null;
  let refreshSessionInfoQueued = false;
  let lastSessionDefaults = null;
  const applyAgentsResult = (result) => {
    state.agentDefaultId = normalizeAgentId(result.defaultId);
    state.sessionMainKey = normalizeMainKey(result.mainKey);
    state.sessionScope = result.scope ?? state.sessionScope;
    state.agents = result.agents.map((agent) => ({
      id: normalizeAgentId(agent.id),
      name: normalizeOptionalString(agent.name),
    }));
    agentNames.clear();
    for (const agent of state.agents) if (agent.name) agentNames.set(agent.id, agent.name);
    if (!state.initialSessionApplied) {
      if (initialSessionAgentId) {
        if (state.agents.some((agent) => agent.id === initialSessionAgentId))
          state.currentAgentId = initialSessionAgentId;
      } else if (!state.agents.some((agent) => agent.id === state.currentAgentId))
        state.currentAgentId =
          state.agents[0]?.id ?? normalizeAgentId(result.defaultId ?? state.currentAgentId);
      const nextSessionKey = resolveSessionKey(initialSessionInput);
      if (nextSessionKey !== state.currentSessionKey) state.currentSessionKey = nextSessionKey;
      state.initialSessionApplied = true;
    } else if (!state.agents.some((agent) => agent.id === state.currentAgentId))
      state.currentAgentId =
        state.agents[0]?.id ?? normalizeAgentId(result.defaultId ?? state.currentAgentId);
    updateHeader();
    updateFooter();
  };
  const refreshAgents = async () => {
    try {
      const result = await client.listAgents();
      applyAgentsResult(result);
    } catch (err) {
      chatLog.addSystem(`agents list failed: ${String(err)}`);
    }
  };
  const updateAgentFromSessionKey = (key) => {
    const parsed = parseAgentSessionKey(key);
    if (!parsed) return;
    const next = normalizeAgentId(parsed.agentId);
    if (next !== state.currentAgentId) state.currentAgentId = next;
  };
  const resolveModelSelection = (entry) => {
    return resolveSessionInfoModelSelection({
      currentProvider: state.sessionInfo.modelProvider,
      currentModel: state.sessionInfo.model,
      defaultProvider: lastSessionDefaults?.modelProvider,
      defaultModel: lastSessionDefaults?.model,
      entryProvider: entry?.modelProvider,
      entryModel: entry?.model,
      overrideProvider: entry?.providerOverride,
      overrideModel: entry?.modelOverride,
    });
  };
  const applySessionInfo = (params) => {
    const hasEntryUpdate = "entry" in params;
    const entry = params.entry ?? void 0;
    const defaults = params.defaults ?? lastSessionDefaults ?? void 0;
    const previousDefaults = lastSessionDefaults;
    const defaultsChanged = params.defaults
      ? previousDefaults?.model !== params.defaults.model ||
        previousDefaults?.modelProvider !== params.defaults.modelProvider ||
        previousDefaults?.contextTokens !== params.defaults.contextTokens
      : false;
    if (params.defaults) lastSessionDefaults = params.defaults;
    const entryUpdatedAt = entry?.updatedAt ?? null;
    const currentUpdatedAt = state.sessionInfo.updatedAt ?? null;
    if (
      !params.force &&
      entryUpdatedAt !== null &&
      currentUpdatedAt !== null &&
      entryUpdatedAt < currentUpdatedAt &&
      !defaultsChanged
    )
      return;
    const next = { ...state.sessionInfo };
    if (entry?.thinkingLevel !== void 0) next.thinkingLevel = entry.thinkingLevel;
    if (entry?.thinkingLevels !== void 0 || defaults?.thinkingLevels !== void 0)
      next.thinkingLevels = entry?.thinkingLevels ?? defaults?.thinkingLevels;
    if (entry?.agentRuntime !== void 0) next.agentRuntime = entry.agentRuntime;
    if (entry?.fastMode !== void 0) next.fastMode = entry.fastMode;
    if (entry?.verboseLevel !== void 0) next.verboseLevel = entry.verboseLevel;
    if (entry?.traceLevel !== void 0) next.traceLevel = entry.traceLevel;
    if (entry?.reasoningLevel !== void 0) next.reasoningLevel = entry.reasoningLevel;
    if (entry?.responseUsage !== void 0) next.responseUsage = entry.responseUsage;
    if (entry?.effectiveResponseUsage !== void 0)
      next.effectiveResponseUsage = entry.effectiveResponseUsage;
    if (entry?.inputTokens !== void 0) next.inputTokens = entry.inputTokens;
    if (entry?.outputTokens !== void 0) next.outputTokens = entry.outputTokens;
    if (entry?.totalTokens !== void 0) {
      next.totalTokens = entry.totalTokens;
      next.totalTokensFresh = entry.totalTokensFresh === true;
    } else if (entry?.totalTokensFresh === true) {
      next.totalTokens = 0;
      next.totalTokensFresh = true;
    }
    if (params.clearMissingUsage) {
      if (entry?.inputTokens === void 0) next.inputTokens = null;
      if (entry?.outputTokens === void 0) next.outputTokens = null;
      if (entry?.totalTokens === void 0 && entry?.totalTokensFresh !== true) {
        next.totalTokens = null;
        next.totalTokensFresh = void 0;
      }
    }
    if (hasEntryUpdate) next.goal = entry?.goal;
    if (entry?.contextTokens !== void 0 || defaults?.contextTokens !== void 0)
      next.contextTokens =
        entry?.contextTokens ?? defaults?.contextTokens ?? state.sessionInfo.contextTokens;
    if (entry?.displayName !== void 0) next.displayName = entry.displayName;
    if (entry?.updatedAt !== void 0) next.updatedAt = entry.updatedAt;
    const selection = resolveModelSelection(entry);
    if (selection.modelProvider !== void 0) next.modelProvider = selection.modelProvider;
    if (selection.model !== void 0) next.model = selection.model;
    const previous = state.sessionInfo;
    const uiChanged = !sessionInfoUiEquals(previous, next);
    if (!uiChanged && previous.updatedAt === next.updatedAt) return;
    state.sessionInfo = next;
    if (uiChanged) {
      updateAutocompleteProvider();
      updateFooter();
      tui.requestRender();
    }
  };
  const runRefreshSessionInfo = async () => {
    try {
      const resolveListAgentId = () => {
        if (state.currentSessionKey === "global") return state.currentAgentId;
        if (state.currentSessionKey === "unknown") return;
        const parsed = parseAgentSessionKey(state.currentSessionKey);
        return parsed?.agentId ? normalizeAgentId(parsed.agentId) : state.currentAgentId;
      };
      const listAgentId = resolveListAgentId();
      const result = await client.listSessions({
        limit: 5,
        search: state.currentSessionKey,
        includeGlobal: state.currentSessionKey === "global",
        includeUnknown: state.currentSessionKey === "unknown",
        agentId: listAgentId,
      });
      const entry = result.sessions.find((row) => {
        return agentSessionKeysMatchByRequestKey(row.key, state.currentSessionKey);
      });
      if (entry?.key && entry.key !== state.currentSessionKey) {
        updateAgentFromSessionKey(entry.key);
        state.currentSessionKey = entry.key;
        updateHeader();
      }
      state.currentSessionId = typeof entry?.sessionId === "string" ? entry.sessionId : null;
      applySessionInfo({
        entry,
        defaults: result.defaults,
      });
    } catch (err) {
      chatLog.addSystem(`sessions list failed: ${String(err)}`);
    }
  };
  const drainRefreshSessionInfo = async () => {
    do {
      refreshSessionInfoQueued = false;
      await runRefreshSessionInfo();
    } while (refreshSessionInfoQueued);
  };
  const refreshSessionInfo = async () => {
    if (refreshSessionInfoInFlight) {
      refreshSessionInfoQueued = true;
      await refreshSessionInfoInFlight;
      return;
    }
    refreshSessionInfoInFlight = drainRefreshSessionInfo().finally(() => {
      refreshSessionInfoInFlight = null;
    });
    await refreshSessionInfoInFlight;
  };
  const applySessionInfoFromPatch = (result) => {
    if (!result?.entry) return;
    if (result.key && result.key !== state.currentSessionKey) {
      updateAgentFromSessionKey(result.key);
      state.currentSessionKey = result.key;
      updateHeader();
    }
    const resolved = result.resolved;
    const entry = resolved
      ? {
          ...result.entry,
          modelProvider: resolved.modelProvider ?? result.entry.modelProvider,
          model: resolved.model ?? result.entry.model,
          ...(resolved.agentRuntime ? { agentRuntime: resolved.agentRuntime } : {}),
          ...(resolved.thinkingLevel ? { thinkingLevel: resolved.thinkingLevel } : {}),
          ...(resolved.thinkingLevels ? { thinkingLevels: resolved.thinkingLevels } : {}),
        }
      : result.entry;
    applySessionInfo({
      entry,
      force: true,
    });
  };
  const clearDisplayedSession = (key = state.currentSessionKey) => {
    chatLog.clearAll();
    btw.clear();
    chatLog.addSystem(`session ${key}`);
    state.historyLoaded = true;
    rememberSessionKey?.(key);
    tui.requestRender(true);
  };
  const applySessionMutationResult = (result) => {
    if (!result?.entry) return false;
    if (result.key && result.key !== state.currentSessionKey) {
      updateAgentFromSessionKey(result.key);
      state.currentSessionKey = result.key;
      updateHeader();
    }
    const sessionId = result.entry.sessionId;
    state.currentSessionId = typeof sessionId === "string" ? sessionId : null;
    applySessionInfoFromPatch(result);
    clearDisplayedSession();
    return true;
  };
  const loadHistory = async () => {
    try {
      const record = await client.loadHistory({
        sessionKey: state.currentSessionKey,
        ...(state.currentSessionKey === "global" ? { agentId: state.currentAgentId } : {}),
        limit: opts.historyLimit ?? 200,
      });
      const sessionInfo = record.sessionInfo;
      if (sessionInfo?.key && sessionInfo.key !== state.currentSessionKey) {
        updateAgentFromSessionKey(sessionInfo.key);
        state.currentSessionKey = sessionInfo.key;
        updateHeader();
      }
      const historySessionInfo =
        sessionInfo && sessionInfo.thinkingLevel === void 0 && record.thinkingLevel !== void 0
          ? {
              ...sessionInfo,
              thinkingLevel: record.thinkingLevel,
            }
          : sessionInfo;
      state.currentSessionId =
        typeof sessionInfo?.sessionId === "string"
          ? sessionInfo.sessionId
          : typeof record.sessionId === "string"
            ? record.sessionId
            : null;
      applySessionInfo({
        entry: historySessionInfo ?? {
          sessionId: record.sessionId,
          thinkingLevel: record.thinkingLevel,
          fastMode: record.fastMode,
          verboseLevel: record.verboseLevel,
          traceLevel: record.traceLevel,
        },
        defaults: record.defaults,
        clearMissingUsage: Boolean(historySessionInfo),
      });
      if (!sessionInfo) await refreshSessionInfo();
      const showTools = (state.sessionInfo.verboseLevel ?? "off") !== "off";
      const historyUsers = [];
      chatLog.clearAll({ preservePendingUsers: true });
      btw.clear();
      chatLog.addSystem(`session ${state.currentSessionKey}`);
      for (const entry of record.messages ?? []) {
        if (!entry || typeof entry !== "object") continue;
        const message = entry;
        if (isCommandMessage(message)) {
          const text = extractTextFromMessage(message);
          if (text) chatLog.addSystem(text);
          continue;
        }
        if (message.role === "user") {
          const text = extractTextFromMessage(message);
          if (text) {
            historyUsers.push({
              text,
              timestamp: extractMessageTimestamp(message),
            });
            chatLog.addUser(text);
          }
          continue;
        }
        if (message.role === "assistant") {
          const text = extractTextFromMessage(message, { includeThinking: state.showThinking });
          if (text) chatLog.finalizeAssistant(text);
          continue;
        }
        if (message.role === "toolResult") {
          if (!showTools) continue;
          const toolCallId = asString(message.toolCallId, "");
          const toolName = asString(message.toolName, "tool");
          chatLog.startTool(toolCallId, toolName, {}).setResult(
            {
              content: Array.isArray(message.content) ? message.content : [],
              details:
                typeof message.details === "object" && message.details ? message.details : void 0,
            },
            { isError: Boolean(message.isError) },
          );
        }
      }
      reconcilePendingSubmitHistory(state, chatLog.reconcilePendingUsers(historyUsers));
      chatLog.restorePendingUsers();
      const inFlight = record.inFlightRun;
      const inFlightRunId = asString(inFlight?.runId, "");
      const inFlightText = asString(inFlight?.text, "");
      if (inFlightRunId) {
        if (inFlightText) chatLog.updateAssistant(inFlightText, inFlightRunId);
        state.activeChatRunId = inFlightRunId;
        setActivityStatus("streaming");
      }
      state.historyLoaded = true;
      if (record.runtimePluginsPrewarm?.status === "failed")
        chatLog.addSystem(
          `runtime prewarm failed: ${record.runtimePluginsPrewarm.error ?? "unknown"}`,
        );
      rememberSessionKey?.(state.currentSessionKey);
      tui.requestRender(true);
      return {
        loaded: true,
        inFlightRunId: inFlightRunId || null,
      };
    } catch (err) {
      chatLog.addSystem(`history failed: ${String(err)}`);
      tui.requestRender(true);
      return { loaded: false };
    }
  };
  const setSession = async (rawKey) => {
    const nextKey = resolveSessionKey(rawKey);
    updateAgentFromSessionKey(nextKey);
    state.currentSessionKey = nextKey;
    state.activeChatRunId = null;
    clearPendingSubmit(state);
    setActivityStatus("idle");
    state.currentSessionId = null;
    state.sessionInfo.updatedAt = null;
    state.historyLoaded = false;
    chatLog.clearPendingUsers();
    clearLocalRunIds?.();
    btw.clear();
    updateHeader();
    updateFooter();
    await loadHistory();
  };
  const abortActive = async (params) => {
    if (
      opts.local === true &&
      state.activityStatus === "finishing context" &&
      !params?.preferActive &&
      !getPendingSubmitAcceptedRunId(state)
    ) {
      chatLog.addSystem("agent is finishing context; wait for it to finish before aborting");
      tui.requestRender();
      return;
    }
    const pendingRunId = getPendingSubmitAcceptedRunId(state);
    const abortsPendingRun = Boolean(pendingRunId);
    const activeRunId = state.activeChatRunId;
    const sessionAbortParams = {
      sessionKey: state.currentSessionKey,
      ...(state.currentSessionKey === "global" ? { agentId: state.currentAgentId } : {}),
    };
    try {
      const result = await client.abortChat(sessionAbortParams);
      if (!result.aborted) {
        chatLog.addSystem("no active run", { coalesceConsecutive: true });
        tui.requestRender();
        return;
      }
      for (const runId of result.runIds ?? []) {
        const stillTracked =
          state.activeChatRunId === runId || getPendingSubmitAcceptedRunId(state) === runId;
        if (runId !== activeRunId && !stillTracked) chatLog.dropPendingUser(runId);
      }
      if (abortsPendingRun) {
        const pendingDraft = getPendingSubmitDraft(state);
        clearPendingSubmit(state, pendingRunId ?? void 0);
        if (pendingRunId && pendingDraft?.runId === pendingRunId)
          chatLog.dropPendingUser(pendingRunId);
      }
      setActivityStatus("aborted");
    } catch (err) {
      chatLog.addSystem(`abort failed: ${String(err)}`);
      setActivityStatus("abort failed");
    }
    tui.requestRender();
  };
  return {
    applyAgentsResult,
    refreshAgents,
    refreshSessionInfo,
    applySessionInfoFromPatch,
    applySessionMutationResult,
    loadHistory,
    setSession,
    abortActive,
  };
}
//#endregion
//#region src/tui/tui-submit.ts
function runSubmitAction(action, run, onError) {
  try {
    Promise.resolve(run()).catch((error) => {
      onError(action, error);
    });
  } catch (error) {
    onError(action, error);
  }
}
function createEditorSubmitHandler(params) {
  return (text) => {
    const raw = text;
    const value = raw.trim();
    if (!value) {
      params.editor.setText("");
      return;
    }
    if (raw.startsWith("!") && raw !== "!") {
      params.editor.setText("");
      params.editor.addToHistory(raw);
      runSubmitAction("local shell", () => params.handleBangLine(raw), params.onSubmitError);
      return;
    }
    if (value.startsWith("/")) {
      params.editor.setText("");
      params.editor.addToHistory(value);
      runSubmitAction("command", () => params.handleCommand(value), params.onSubmitError);
      return;
    }
    const admission = params.admitMessage?.(value) ?? "allowed";
    if (admission !== "allowed") {
      params.editor.setText(value);
      params.onBlockedMessageSubmit?.(value, admission);
      return;
    }
    params.editor.setText("");
    params.editor.addToHistory(value);
    runSubmitAction("message", () => params.sendMessage(value), params.onSubmitError);
  };
}
function shouldEnableWindowsGitBashPasteFallback(params) {
  const platform = params?.platform ?? process.platform;
  const env = params?.env ?? process.env;
  const termProgram = normalizeLowercaseStringOrEmpty(env.TERM_PROGRAM);
  if (platform === "darwin") {
    if (termProgram.includes("iterm") || termProgram.includes("apple_terminal")) return true;
    return false;
  }
  if (platform !== "win32") return false;
  const msystem = (env.MSYSTEM ?? "").toUpperCase();
  const shell = env.SHELL ?? "";
  if (msystem.startsWith("MINGW") || msystem.startsWith("MSYS")) return true;
  if (normalizeLowercaseStringOrEmpty(shell).includes("bash")) return true;
  return termProgram.includes("mintty");
}
function createSubmitBurstCoalescer(params) {
  const windowMs = Math.max(1, params.burstWindowMs ?? 50);
  const now = params.now ?? (() => Date.now());
  const setTimer = params.setTimer ?? setTimeout;
  const clearTimer = params.clearTimer ?? clearTimeout;
  let pending = null;
  let pendingAt = 0;
  let flushTimer = null;
  const clearFlushTimer = () => {
    if (!flushTimer) return;
    clearTimer(flushTimer);
    flushTimer = null;
  };
  const flushPending = () => {
    if (pending === null) return;
    const value = pending;
    pending = null;
    pendingAt = 0;
    clearFlushTimer();
    params.submit(value);
  };
  const scheduleFlush = () => {
    clearFlushTimer();
    flushTimer = setTimer(() => {
      flushPending();
    }, windowMs);
  };
  return (value) => {
    if (!params.enabled) {
      params.submit(value);
      return;
    }
    if (value.includes("\n")) {
      flushPending();
      params.submit(value);
      return;
    }
    const ts = now();
    if (pending === null) {
      pending = value;
      pendingAt = ts;
      scheduleFlush();
      return;
    }
    if (ts - pendingAt <= windowMs) {
      pending = `${pending}\n${value}`;
      pendingAt = ts;
      scheduleFlush();
      return;
    }
    flushPending();
    pending = value;
    pendingAt = ts;
    scheduleFlush();
  };
}
//#endregion
//#region src/tui/tui-task-suggestions.ts
const TASK_BIDI_CONTROL_RE = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g;
const TASK_DETAIL_VIEWPORT_LINES = 12;
const TASK_DETAIL_PAGE_LINES = TASK_DETAIL_VIEWPORT_LINES - 1;
const PAGE_UP_INPUT = "\x1B[5~";
const PAGE_DOWN_INPUT = "\x1B[6~";
const TASK_ACTIONS = [
  {
    value: "accept",
    label: "Start in worktree",
    description: "Create an isolated session and begin this task",
  },
  {
    value: "dismiss",
    label: "Dismiss",
    description: "Leave the repository untouched",
  },
];
function clean(text) {
  return sanitizeTaskText(text.replace(/\s+/g, " ").trim());
}
function sanitizeTaskText(text) {
  return sanitizeRenderableText(text.replace(TASK_BIDI_CONTROL_RE, ""));
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
/** Parses the task suggestion shape carried by Gateway list and event payloads. */
function parseTuiTaskSuggestion(value) {
  if (!isRecord(value)) return null;
  if (
    ["id", "title", "prompt", "tldr", "cwd", "sessionKey"].some(
      (field) => typeof value[field] !== "string" || !value[field].trim(),
    )
  )
    return null;
  if (typeof value.createdAt !== "number" || value.createdAt < 0) return null;
  return {
    id: value.id.trim(),
    title: value.title.trim(),
    prompt: value.prompt.trim(),
    tldr: value.tldr.trim(),
    cwd: value.cwd.trim(),
    sessionKey: value.sessionKey.trim(),
    ...(typeof value.agentId === "string" && value.agentId.trim()
      ? { agentId: value.agentId.trim() }
      : {}),
    createdAt: value.createdAt,
  };
}
var TaskPrompt = class {
  constructor(suggestion, selector, requestRender) {
    this.selector = selector;
    this.requestRender = requestRender;
    this.instructionLabel = new Text(theme.system("Instructions:"));
    this.detailPosition = new Text();
    this.confirmation = new Text();
    this.detailOffset = 0;
    this.detailLineCount = 0;
    this.title = new Text(theme.header(`Suggested follow-up: ${clean(suggestion.title)}`));
    this.metadata = new Text(theme.dim(`Project: ${clean(suggestion.cwd)}`));
    this.summary = new Text(theme.system(`Why: ${clean(suggestion.tldr)}`));
    this.instructions = new Text(theme.system(sanitizeTaskText(suggestion.prompt.trim())));
  }
  setConfirmation(text) {
    this.confirmation.setText(theme.accent(text));
  }
  invalidate() {
    for (const component of [
      this.title,
      this.metadata,
      this.summary,
      this.instructionLabel,
      this.instructions,
      this.detailPosition,
      this.confirmation,
      this.selector,
    ])
      component.invalidate();
  }
  render(width) {
    const detailLines = [
      ...this.metadata.render(width),
      ...this.summary.render(width),
      ...this.instructionLabel.render(width),
      ...this.instructions.render(width),
    ];
    this.detailLineCount = detailLines.length;
    const maxDetailOffset = Math.max(0, detailLines.length - TASK_DETAIL_VIEWPORT_LINES);
    this.detailOffset = Math.min(this.detailOffset, maxDetailOffset);
    const visibleDetails = detailLines.slice(
      this.detailOffset,
      this.detailOffset + TASK_DETAIL_VIEWPORT_LINES,
    );
    if (detailLines.length > TASK_DETAIL_VIEWPORT_LINES) {
      const visibleEnd = this.detailOffset + visibleDetails.length;
      this.detailPosition.setText(
        theme.dim(
          `Details ${this.detailOffset + 1}-${visibleEnd} of ${detailLines.length} · PgUp/PgDn to inspect`,
        ),
      );
    } else this.detailPosition.setText("");
    const detailPosition = this.detailPosition.render(width);
    const confirmation = this.confirmation.render(width);
    return [
      ...this.title.render(width).slice(0, 2),
      ...visibleDetails,
      ...(detailPosition.some((line) => line.trim()) ? detailPosition : []),
      ...(confirmation.some((line) => line.trim()) ? ["", ...confirmation] : []),
      "",
      ...this.selector.render(width),
    ];
  }
  handleInput(data) {
    if (data === PAGE_UP_INPUT || data === PAGE_DOWN_INPUT) {
      const maxOffset = Math.max(0, this.detailLineCount - TASK_DETAIL_VIEWPORT_LINES);
      const delta = data === PAGE_UP_INPUT ? -11 : TASK_DETAIL_PAGE_LINES;
      const nextOffset = Math.min(maxOffset, Math.max(0, this.detailOffset + delta));
      if (nextOffset !== this.detailOffset) {
        this.detailOffset = nextOffset;
        this.metadata.invalidate();
        this.summary.invalidate();
        this.instructionLabel.invalidate();
        this.instructions.invalidate();
        this.requestRender();
      }
      return;
    }
    this.selector.handleInput?.(data);
  }
};
/** Coordinates Gateway task-suggestion events with the active TUI overlay. */
function createTuiTaskSuggestionController(deps) {
  const createSelector =
    deps.createSelector ?? ((items) => new SelectList(items, items.length, selectListTheme));
  const suggestions = /* @__PURE__ */ new Map();
  const hiddenIds = /* @__PURE__ */ new Set();
  let activeId = null;
  let activeOverlay = null;
  let activeSelector = null;
  let activeActionKey = null;
  let revision = 0;
  let disposed = false;
  let refreshInFlight = null;
  let refreshAgain = false;
  const closeActive = () => {
    if (activeOverlay) {
      deps.closeOverlay(activeOverlay);
      activeOverlay = null;
    }
    activeId = null;
    activeSelector = null;
    activeActionKey = null;
  };
  const remove = (id) => {
    revision += 1;
    suggestions.delete(id);
    hiddenIds.delete(id);
    if (activeId === id) closeActive();
  };
  const matchesSession = (suggestion) =>
    suggestion.sessionKey === deps.getSessionKey() &&
    (suggestion.sessionKey !== "global" || suggestion.agentId === deps.getAgentId());
  const availableActions = () => {
    const capabilities = deps.client.getTaskSuggestionActionCapabilities?.() ?? {
      canAccept: Boolean(deps.client.acceptTaskSuggestion),
      canDismiss: Boolean(deps.client.dismissTaskSuggestion),
    };
    return TASK_ACTIONS.filter((action) =>
      action.value === "accept" ? capabilities.canAccept : capabilities.canDismiss,
    );
  };
  const presentNext = () => {
    if (disposed) return;
    const actions = availableActions();
    const actionKey = actions.map((action) => action.value).join(",");
    if (activeId) {
      if (activeActionKey === actionKey) return;
      closeActive();
    }
    const suggestion = [...suggestions.values()]
      .toSorted((left, right) => left.createdAt - right.createdAt)
      .find((entry) => !hiddenIds.has(entry.id) && matchesSession(entry));
    if (!suggestion) return;
    if (actions.length === 0) return;
    activeId = suggestion.id;
    const selector = createSelector(actions);
    activeSelector = selector;
    activeActionKey = actionKey;
    const dismissIndex = actions.findIndex((action) => action.value === "dismiss");
    selector.setSelectedIndex?.(Math.max(dismissIndex, 0));
    let acceptArmed = false;
    let prompt = null;
    const resolve = async (action) => {
      if (activeId !== suggestion.id || activeSelector !== selector) return;
      closeActive();
      hiddenIds.add(suggestion.id);
      deps.requestRender();
      try {
        if (action === "accept") {
          if (!deps.client.acceptTaskSuggestion)
            throw new Error("task suggestion acceptance is unavailable");
          const result = await deps.client.acceptTaskSuggestion(suggestion.id);
          remove(suggestion.id);
          deps.chatLog.addSystem(`follow-up task started in ${result.key}`);
          if (matchesSession(suggestion)) await deps.onAccepted(result.key);
        } else {
          if (!deps.client.dismissTaskSuggestion)
            throw new Error("task suggestion dismissal is unavailable");
          if (!(await deps.client.dismissTaskSuggestion(suggestion.id)).dismissed)
            throw new Error("task suggestion is no longer pending");
          remove(suggestion.id);
          deps.chatLog.addSystem("follow-up task dismissed");
        }
      } catch (error) {
        hiddenIds.delete(suggestion.id);
        deps.chatLog.addSystem(`follow-up task failed: ${formatErrorMessage(error)}`);
        refresh().catch((refreshError) => {
          deps.chatLog.addSystem(
            `task suggestion refresh failed: ${formatErrorMessage(refreshError)}`,
          );
        });
      }
      presentNext();
      if (!disposed) deps.requestRender();
    };
    selector.onSelectionChange = () => {
      acceptArmed = false;
      prompt?.setConfirmation("");
    };
    selector.onSelect = (item) => {
      if (activeSelector !== selector) return;
      if (!availableActions().some((action) => action.value === item.value)) {
        closeActive();
        presentNext();
        deps.requestRender();
        return;
      }
      if (item.value === "dismiss") {
        resolve("dismiss");
        return;
      }
      if (item.value !== "accept") return;
      if (acceptArmed) {
        resolve("accept");
        return;
      }
      acceptArmed = true;
      prompt?.setConfirmation("Press Enter again to start this task in a worktree.");
      deps.requestRender();
    };
    selector.onCancel = () => {
      if (activeSelector !== selector) return;
      hiddenIds.add(suggestion.id);
      closeActive();
      deps.chatLog.addSystem("follow-up task hidden; suggestion remains pending");
      presentNext();
      deps.requestRender();
    };
    prompt = new TaskPrompt(suggestion, selector, deps.requestRender);
    activeOverlay = deps.openOverlay(prompt);
    deps.requestRender();
  };
  const refresh = async () => {
    if (disposed || !deps.client.listTaskSuggestions) return;
    if (refreshInFlight) {
      refreshAgain = true;
      return await refreshInFlight;
    }
    refreshInFlight = (async () => {
      do {
        refreshAgain = false;
        const startRevision = revision;
        const listed = await deps.client.listTaskSuggestions?.();
        if (disposed || !listed) return;
        if (revision !== startRevision) {
          refreshAgain = true;
          continue;
        }
        suggestions.clear();
        for (const value of listed) {
          const suggestion = parseTuiTaskSuggestion(value);
          if (suggestion) suggestions.set(suggestion.id, suggestion);
        }
        for (const id of hiddenIds) if (!suggestions.has(id)) hiddenIds.delete(id);
      } while (refreshAgain);
      if (activeId && !suggestions.has(activeId)) closeActive();
      presentNext();
      deps.requestRender();
    })();
    try {
      await refreshInFlight;
    } finally {
      refreshInFlight = null;
    }
  };
  return {
    handleEvent(event, payload) {
      if (disposed || event !== "task.suggestion" || !isRecord(payload)) return;
      if (payload.action === "created") {
        const suggestion = parseTuiTaskSuggestion(payload.suggestion);
        if (suggestion) {
          revision += 1;
          hiddenIds.delete(suggestion.id);
          suggestions.set(suggestion.id, suggestion);
          presentNext();
        }
        return;
      }
      if (payload.action === "resolved" && typeof payload.taskId === "string") {
        remove(payload.taskId);
        presentNext();
        deps.requestRender();
      }
    },
    refresh,
    sessionChanged() {
      if (disposed) return;
      hiddenIds.clear();
      const active = activeId ? suggestions.get(activeId) : void 0;
      if (active && !matchesSession(active)) closeActive();
      presentNext();
      deps.requestRender();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      suggestions.clear();
      hiddenIds.clear();
      closeActive();
      deps.requestRender();
    },
  };
}
//#endregion
//#region src/tui/tui-waiting.ts
/** Default phrase cycle for animated waiting status. */
const defaultWaitingPhrases = [
  "flibbertigibbeting",
  "kerfuffling",
  "dillydallying",
  "twiddling thumbs",
  "noodling",
  "bamboozling",
  "moseying",
  "hobnobbing",
  "pondering",
  "conjuring",
];
/** Picks a stable phrase for a timer tick. */
function pickWaitingPhrase(tick, phrases = defaultWaitingPhrases) {
  return phrases[Math.floor(tick / 10) % phrases.length] ?? phrases[0] ?? "waiting";
}
/** Applies a moving highlight window to status text. */
function shimmerText(theme, text, tick) {
  const width = 6;
  const hi = (ch) => theme.bold(theme.accentSoft(ch));
  const pos = tick % (text.length + width);
  const start = Math.max(0, pos - width);
  const end = Math.min(text.length - 1, pos);
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    out += i >= start && i <= end ? hi(ch) : theme.dim(ch);
  }
  return out;
}
/** Builds the single-line waiting status shown while a TUI run is active. */
function buildWaitingStatusMessage(params) {
  const phrase = pickWaitingPhrase(params.tick, params.phrases);
  return `${shimmerText(params.theme, `${phrase}…`, params.tick)} • ${params.elapsed} | ${params.connectionStatus}`;
}
//#endregion
//#region src/tui/tui.ts
const OPENCLAW_CLI_WRAPPER_PATH = fileURLToPath(new URL("../../openclaw.mjs", import.meta.url));
const OPENCLAW_RUN_NODE_SCRIPT_PATH = fileURLToPath(
  new URL("../../scripts/run-node.mjs", import.meta.url),
);
const OPENCLAW_DIST_ENTRY_JS_PATH = fileURLToPath(new URL("../../dist/entry.js", import.meta.url));
const OPENCLAW_DIST_ENTRY_MJS_PATH = fileURLToPath(
  new URL("../../dist/entry.mjs", import.meta.url),
);
const OPENAI_CODEX_PROVIDER = "openai";
/** Resolve the absolute path to the `codex` CLI binary, or `null` if not installed. */
function resolveCodexCliBin() {
  try {
    return (
      execFileSync(
        process.platform === "win32" ? getWindowsSystem32ExePath("where.exe") : "which",
        ["codex"],
        { encoding: "utf8" },
      )
        .trim()
        .split(/\r?\n/)[0] || null
    );
  } catch {
    return null;
  }
}
function resolveLocalAuthCliInvocation(params) {
  const hasDistEntry =
    params?.hasDistEntry ??
    (existsSync(OPENCLAW_DIST_ENTRY_JS_PATH) || existsSync(OPENCLAW_DIST_ENTRY_MJS_PATH));
  const hasRunNodeScript = params?.hasRunNodeScript ?? existsSync(OPENCLAW_RUN_NODE_SCRIPT_PATH);
  const command = params?.execPath ?? process.execPath;
  const wrapperPath = params?.wrapperPath ?? OPENCLAW_CLI_WRAPPER_PATH;
  const runNodePath = params?.runNodePath ?? OPENCLAW_RUN_NODE_SCRIPT_PATH;
  return hasDistEntry || !hasRunNodeScript
    ? {
        command,
        args: [wrapperPath, "models", "auth", "login"],
      }
    : {
        command,
        args: [runNodePath, "models", "auth", "login"],
      };
}
function resolveLocalAuthSpawnInvocation(params) {
  const platform = params.platform ?? process.platform;
  if (!isWindowsBatchCommand(params.command.trim(), platform))
    return {
      command: params.command,
      args: params.args,
      options: {},
    };
  return {
    command: resolveTrustedWindowsCmdExe(platform),
    args: ["/d", "/s", "/c", buildWindowsCmdExeCommandLine(params.command, params.args)],
    options: {
      windowsHide: true,
      windowsVerbatimArguments: true,
    },
  };
}
function resolveLocalAuthSpawnCwd(params) {
  const defaultCwd =
    params.defaultCwd ?? tryProcessCwd() ?? path.dirname(OPENCLAW_CLI_WRAPPER_PATH);
  const entryArg = params.args[0]?.trim();
  if (!entryArg) return defaultCwd;
  const entryBase = path.basename(entryArg).toLowerCase();
  if (entryBase === "openclaw.mjs") return path.dirname(entryArg);
  if (entryBase === "run-node.mjs") return path.dirname(path.dirname(entryArg));
  return defaultCwd;
}
function resolveTuiSessionKey(params) {
  const trimmed = (params.raw ?? "").trim();
  if (!trimmed) {
    if (params.sessionScope === "global") return "global";
    return buildAgentMainSessionKey({
      agentId: params.currentAgentId,
      mainKey: params.sessionMainKey,
    });
  }
  if (trimmed === "global" || trimmed === "unknown") return trimmed;
  if (trimmed.startsWith("agent:")) return normalizeLowercaseStringOrEmpty(trimmed);
  return `agent:${params.currentAgentId}:${normalizeLowercaseStringOrEmpty(trimmed)}`;
}
function resolveTuiFooterHostLabel(params) {
  if (params.config.tui?.footer?.showRemoteHost !== true) return null;
  return formatRemoteConnectionHostFooter(params.connectionUrl);
}
function resolveInitialTuiAgentId(params) {
  const parsed = parseAgentSessionKey((params.initialSessionInput ?? "").trim());
  if (parsed?.agentId) return normalizeAgentId(parsed.agentId);
  const cwd = params.cwd ?? tryProcessCwd();
  const inferredFromWorkspace = cwd ? resolveAgentIdByWorkspacePath(params.cfg, cwd) : null;
  if (inferredFromWorkspace) return inferredFromWorkspace;
  return normalizeAgentId(params.fallbackAgentId);
}
function resolveGatewayDisconnectState(reason) {
  const reasonLabel = reason?.trim() ? reason.trim() : "closed";
  if (/pairing required|scope upgrade/i.test(reasonLabel))
    return {
      connectionStatus: `gateway disconnected: ${reasonLabel}`,
      activityStatus: "device approval needed: preview latest request",
      pairingHint:
        "Device approval needed. Run `openclaw devices approve --latest` to preview the pending request, then rerun the printed `openclaw devices approve <requestId>` command (reuse `--token` or other auth flags if needed), then reconnect.",
    };
  return {
    connectionStatus: `gateway disconnected: ${reasonLabel}`,
    activityStatus: "idle",
  };
}
function createBackspaceDeduper(params) {
  const dedupeWindowMs = Math.max(0, Math.floor(params?.dedupeWindowMs ?? 8));
  const now = params?.now ?? (() => Date.now());
  let lastBackspaceAt = -1;
  return (data) => {
    if (data !== "\b" && !matchesKey(data, Key.backspace)) return data;
    const ts = now();
    if (lastBackspaceAt >= 0 && ts - lastBackspaceAt <= dedupeWindowMs) return "";
    lastBackspaceAt = ts;
    return data;
  };
}
function isIgnorableTuiStopError(error) {
  if (!error || typeof error !== "object") return false;
  const err = error;
  const code = typeof err.code === "string" ? err.code : "";
  const syscall = typeof err.syscall === "string" ? err.syscall : "";
  const message = typeof err.message === "string" ? err.message : "";
  if (code === "EBADF" && syscall === "setRawMode") return true;
  return /setRawMode/i.test(message) && /EBADF/i.test(message);
}
function stopTuiSafely(stop) {
  try {
    stop();
  } catch (error) {
    if (!isIgnorableTuiStopError(error)) throw error;
  }
}
function isTuiTerminalLossError(error) {
  if (!error || typeof error !== "object") return false;
  const err = error;
  const code = typeof err.code === "string" ? err.code : "";
  const message = typeof err.message === "string" ? err.message : "";
  const syscall = typeof err.syscall === "string" ? err.syscall : "";
  if (code === "EIO" || code === "EPIPE") return true;
  return (
    /\b(EIO|EPIPE)\b/i.test(message) && /\b(read|write|TTY|stdin|stdout)\b/i.test(message + syscall)
  );
}
function installTuiTerminalLossExitHandler(
  requestExit,
  targets = {
    stdin: process.stdin,
    stdout: process.stdout,
  },
) {
  let requested = false;
  const requestOnce = () => {
    if (requested) return;
    requested = true;
    requestExit();
  };
  const removeUncaughtExceptionHandler = registerUncaughtExceptionHandler((error) => {
    if (!isTuiTerminalLossError(error)) return false;
    requestOnce();
    return true;
  });
  const onClose = () => requestOnce();
  targets.stdin?.on("end", onClose);
  targets.stdin?.on("close", onClose);
  targets.stdout?.on("close", onClose);
  return () => {
    removeUncaughtExceptionHandler();
    targets.stdin?.off("end", onClose);
    targets.stdin?.off("close", onClose);
    targets.stdout?.off("close", onClose);
  };
}
function createDeferredTuiFinish() {
  let finishTui = null;
  let finishRequested = false;
  return {
    requestFinish: () => {
      const finish = finishTui;
      if (finish) {
        finish();
        return;
      }
      finishRequested = true;
    },
    setFinish: (finish) => {
      finishTui = finish;
      if (finishRequested) finish();
    },
    clearFinish: () => {
      finishTui = null;
    },
  };
}
const TUI_SHUTDOWN_DRAIN_MAX_MS = 500;
const TUI_SHUTDOWN_DRAIN_IDLE_MS = 100;
const TUI_SHUTDOWN_HARD_EXIT_MS = 2e3;
const TUI_PROCESS_EXIT_AFTER_RETURN_MS = 2e3;
async function drainAndStopTuiSafely(tui) {
  if (typeof tui.terminal?.drainInput === "function")
    try {
      await tui.terminal.drainInput(TUI_SHUTDOWN_DRAIN_MAX_MS, TUI_SHUTDOWN_DRAIN_IDLE_MS);
    } catch {}
  stopTuiSafely(() => tui.stop());
}
const TUI_BUSY_ACTIVITY_STATUSES = /* @__PURE__ */ new Set([
  "sending",
  "waiting",
  "streaming",
  "running",
  "finishing context",
  "starting up",
]);
function isTuiBusyActivityStatus(status) {
  return TUI_BUSY_ACTIVITY_STATUSES.has(status);
}
function resolveTuiToolsToggleActivityStatus(params) {
  const toolsStatus = params.toolsExpanded ? "tools expanded" : "tools collapsed";
  if (isTuiBusyActivityStatus(params.currentStatus)) return params.currentStatus;
  return toolsStatus;
}
function resolveTuiShutdownHardExitMs(params = {}) {
  return TUI_SHUTDOWN_HARD_EXIT_MS + (params.localMode ? resolveLocalRunShutdownGraceMs() : 0);
}
function scheduleProcessExitAfterTuiReturn(params = {}) {
  const delayMs = Math.max(0, Math.floor(params.delayMs ?? TUI_PROCESS_EXIT_AFTER_RETURN_MS));
  const setTimeoutFn =
    params.setTimeoutFn ?? ((callback, timeoutMs) => setTimeout(callback, timeoutMs));
  const exit = params.exit ?? ((code) => process.exit(code));
  const writeStderr =
    params.writeStderr ??
    ((text) => {
      process.stderr.write(text);
    });
  const timer = setTimeoutFn(() => {
    try {
      writeStderr("openclaw tui forcing process exit after return\n");
    } catch {}
    exit(0);
  }, delayMs);
  timer.unref?.();
  return timer;
}
function resolveCtrlCAction(params) {
  const exitWindowMs = Math.max(1, Math.floor(params.exitWindowMs ?? 1e3));
  if (params.hasInput)
    return {
      action: "clear",
      nextLastCtrlCAt: params.now,
    };
  if (params.now - params.lastCtrlCAt <= exitWindowMs)
    return {
      action: "exit",
      nextLastCtrlCAt: params.lastCtrlCAt,
    };
  return {
    action: "warn",
    nextLastCtrlCAt: params.now,
  };
}
function resolveTuiCtrlCAction(params) {
  if (params.exitRequested === true)
    return {
      action: "force-exit",
      nextLastCtrlCAt: params.lastCtrlCAt,
    };
  if (params.wasDisconnected === true)
    return {
      action: "exit",
      nextLastCtrlCAt: params.lastCtrlCAt,
    };
  return resolveCtrlCAction(params);
}
function resolveEmptySessionInfoDefaults(config) {
  return { verboseLevel: config.agents?.defaults?.verboseDefault };
}
async function runTui(opts) {
  const isLocalMode = opts.local === true || opts.backend !== void 0;
  const config = opts.config ?? getRuntimeConfig({ skipPluginValidation: !isLocalMode });
  const fallbackCwd = path.dirname(OPENCLAW_CLI_WRAPPER_PATH);
  const resolveUsableCwd = () => tryProcessCwd() ?? fallbackCwd;
  const emptySessionInfoDefaults = resolveEmptySessionInfoDefaults(config);
  const initialSessionInput = (opts.session ?? "").trim();
  let sessionScope = config.session?.scope ?? "per-sender";
  let sessionMainKey = normalizeMainKey(config.session?.mainKey);
  let agentDefaultId = resolveDefaultAgentId(config);
  let currentAgentId = resolveInitialTuiAgentId({
    cfg: config,
    fallbackAgentId: agentDefaultId,
    initialSessionInput,
  });
  let agents = [];
  const agentNames = /* @__PURE__ */ new Map();
  let currentSessionKey = "";
  let initialSessionApplied = false;
  let rememberedSessionApplied = false;
  let currentSessionId = null;
  let activeChatRunId = null;
  let pendingSubmit = null;
  let historyLoaded = false;
  let isConnected = false;
  let wasDisconnected = false;
  let toolsExpanded = false;
  let showThinking = false;
  let pairingHintShown = false;
  const localRunIds = /* @__PURE__ */ new Set();
  const localBtwRunIds = /* @__PURE__ */ new Set();
  const deliverDefault = opts.deliver ?? false;
  const autoMessage = opts.message?.trim();
  let autoMessageSent = false;
  let sessionInfo = { ...emptySessionInfoDefaults };
  let dynamicSlashCommands = [];
  let dynamicSlashCommandsKey = null;
  let dynamicSlashCommandsInFlightKey = null;
  let dynamicSlashCommandsRequestId = 0;
  let dynamicSlashCommandsReady = false;
  let dynamicSlashCommandsRefreshTimer = null;
  let lastCtrlCAt = 0;
  let exitRequested = false;
  let exitResult = { exitReason: "exit" };
  let activityStatus = "idle";
  let connectionStatus = isLocalMode ? "starting local runtime" : "connecting";
  let statusTimeout = null;
  let statusTimer = null;
  let statusStartedAt = null;
  let lastActivityStatus = activityStatus;
  const state = {
    get agentDefaultId() {
      return agentDefaultId;
    },
    set agentDefaultId(value) {
      agentDefaultId = value;
    },
    get sessionMainKey() {
      return sessionMainKey;
    },
    set sessionMainKey(value) {
      sessionMainKey = value;
    },
    get sessionScope() {
      return sessionScope;
    },
    set sessionScope(value) {
      sessionScope = value;
    },
    get agents() {
      return agents;
    },
    set agents(value) {
      agents = value;
    },
    get currentAgentId() {
      return currentAgentId;
    },
    set currentAgentId(value) {
      currentAgentId = value;
      pluginApprovals?.sessionChanged();
      taskSuggestions?.sessionChanged();
    },
    get currentSessionKey() {
      return currentSessionKey;
    },
    set currentSessionKey(value) {
      currentSessionKey = value;
      pluginApprovals?.sessionChanged();
      taskSuggestions?.sessionChanged();
    },
    get currentSessionId() {
      return currentSessionId;
    },
    set currentSessionId(value) {
      currentSessionId = value;
    },
    get activeChatRunId() {
      return activeChatRunId;
    },
    set activeChatRunId(value) {
      activeChatRunId = value;
    },
    get pendingSubmit() {
      return pendingSubmit;
    },
    set pendingSubmit(value) {
      pendingSubmit = value;
    },
    get historyLoaded() {
      return historyLoaded;
    },
    set historyLoaded(value) {
      historyLoaded = value;
    },
    get sessionInfo() {
      return sessionInfo;
    },
    set sessionInfo(value) {
      sessionInfo = value;
    },
    get initialSessionApplied() {
      return initialSessionApplied;
    },
    set initialSessionApplied(value) {
      initialSessionApplied = value;
    },
    get isConnected() {
      return isConnected;
    },
    set isConnected(value) {
      isConnected = value;
    },
    get autoMessageSent() {
      return autoMessageSent;
    },
    set autoMessageSent(value) {
      autoMessageSent = value;
    },
    get toolsExpanded() {
      return toolsExpanded;
    },
    set toolsExpanded(value) {
      toolsExpanded = value;
    },
    get showThinking() {
      return showThinking;
    },
    set showThinking(value) {
      showThinking = value;
    },
    get connectionStatus() {
      return connectionStatus;
    },
    set connectionStatus(value) {
      connectionStatus = value;
    },
    get activityStatus() {
      return activityStatus;
    },
    set activityStatus(value) {
      activityStatus = value;
    },
    get statusTimeout() {
      return statusTimeout;
    },
    set statusTimeout(value) {
      statusTimeout = value;
    },
    get lastCtrlCAt() {
      return lastCtrlCAt;
    },
    set lastCtrlCAt(value) {
      lastCtrlCAt = value;
    },
  };
  const noteLocalRunId = (runId) => {
    if (!runId) return;
    localRunIds.add(runId);
    if (localRunIds.size > 200) {
      const [first] = localRunIds;
      if (first) localRunIds.delete(first);
    }
  };
  const forgetLocalRunId = (runId) => {
    localRunIds.delete(runId);
  };
  const isLocalRunId = (runId) => localRunIds.has(runId);
  const clearLocalRunIds = () => {
    localRunIds.clear();
  };
  const noteLocalBtwRunId = (runId) => {
    if (!runId) return;
    localBtwRunIds.add(runId);
    if (localBtwRunIds.size > 200) {
      const [first] = localBtwRunIds;
      if (first) localBtwRunIds.delete(first);
    }
  };
  const forgetLocalBtwRunId = (runId) => {
    localBtwRunIds.delete(runId);
  };
  const isLocalBtwRunId = (runId) => localBtwRunIds.has(runId);
  const clearLocalBtwRunIds = () => {
    localBtwRunIds.clear();
  };
  let client;
  if (opts.backend) client = opts.backend;
  else if (opts.local) {
    const { EmbeddedTuiBackend } = await import("./embedded-backend-In4vMt9z.js");
    client = new EmbeddedTuiBackend();
  } else {
    const { GatewayChatClient } = await import("./gateway-chat-vwto7Ue_.js");
    client = opts.boundGateway
      ? GatewayChatClient.connectBound({
          config,
          ...opts.boundGateway,
        })
      : await GatewayChatClient.connect({
          url: opts.url,
          token: opts.token,
          password: opts.password,
          tlsFingerprint: opts.tlsFingerprint,
        });
  }
  const previousConsoleSubsystemFilter = isLocalMode
    ? loggingState.consoleSubsystemFilter
      ? [...loggingState.consoleSubsystemFilter]
      : null
    : null;
  if (isLocalMode) setConsoleSubsystemFilter(["__openclaw_tui_quiet__"]);
  const tui = new TUI(new ProcessTerminal());
  const dedupeBackspace = createBackspaceDeduper();
  tui.addInputListener((data) => {
    const next = dedupeBackspace(data);
    if (next.length === 0) return { consume: true };
    return { data: next };
  });
  const header = new Text("", 1, 0);
  const statusContainer = new Container();
  const footer = new Text("", 1, 0);
  const chatLog = new ChatLog();
  const editor = new CustomEditor(tui, editorTheme);
  const root = new Container();
  root.addChild(header);
  root.addChild(chatLog);
  root.addChild(statusContainer);
  root.addChild(footer);
  root.addChild(editor);
  const resolveDynamicSlashCommandsKey = () => currentAgentId;
  const applyAutocompleteProvider = () => {
    const dynamicKey = resolveDynamicSlashCommandsKey();
    editor.setAutocompleteProvider(
      new CombinedAutocompleteProvider(
        getSlashCommands({
          cfg: config,
          local: isLocalMode,
          provider: sessionInfo.modelProvider,
          model: sessionInfo.model,
          agentRuntime: sessionInfo.agentRuntime?.id,
          thinkingLevels: sessionInfo.thinkingLevels,
          dynamicCommands: dynamicSlashCommandsKey === dynamicKey ? dynamicSlashCommands : [],
        }),
        resolveUsableCwd(),
      ),
    );
  };
  const clearDynamicSlashCommandsRefreshTimer = () => {
    if (!dynamicSlashCommandsRefreshTimer) return;
    clearTimeout(dynamicSlashCommandsRefreshTimer);
    dynamicSlashCommandsRefreshTimer = null;
  };
  const refreshDynamicSlashCommands = () => {
    clearDynamicSlashCommandsRefreshTimer();
    const key = resolveDynamicSlashCommandsKey();
    if (
      !dynamicSlashCommandsReady ||
      !isConnected ||
      !client.listCommands ||
      dynamicSlashCommandsKey === key ||
      dynamicSlashCommandsInFlightKey === key
    )
      return;
    dynamicSlashCommandsInFlightKey = key;
    const requestId = ++dynamicSlashCommandsRequestId;
    const agentId = currentAgentId;
    client
      .listCommands({
        agentId,
        scope: "text",
        includeArgs: false,
      })
      .then((commands) => {
        if (requestId !== dynamicSlashCommandsRequestId || key !== resolveDynamicSlashCommandsKey())
          return;
        dynamicSlashCommands = commands;
        dynamicSlashCommandsKey = key;
        applyAutocompleteProvider();
      })
      .catch(() => void 0)
      .finally(() => {
        if (dynamicSlashCommandsInFlightKey === key) dynamicSlashCommandsInFlightKey = null;
      });
  };
  const scheduleDynamicSlashCommandsRefresh = () => {
    if (
      !dynamicSlashCommandsReady ||
      dynamicSlashCommandsRefreshTimer ||
      dynamicSlashCommandsKey === resolveDynamicSlashCommandsKey()
    )
      return;
    dynamicSlashCommandsRefreshTimer = setTimeout(refreshDynamicSlashCommands, 0);
    dynamicSlashCommandsRefreshTimer.unref?.();
  };
  const updateAutocompleteProvider = () => {
    applyAutocompleteProvider();
    scheduleDynamicSlashCommandsRefresh();
  };
  tui.addChild(root);
  tui.setFocus(editor);
  const formatSessionKey = (key) => {
    if (key === "global" || key === "unknown") return key;
    return parseAgentSessionKey(key)?.rest ?? key;
  };
  const formatAgentLabel = (id) => {
    const name = agentNames.get(id);
    return name ? `${id} (${name})` : id;
  };
  const resolveSessionKey = (raw) => {
    return resolveTuiSessionKey({
      raw,
      sessionScope,
      currentAgentId,
      sessionMainKey,
    });
  };
  currentSessionKey = resolveSessionKey(initialSessionInput);
  const buildLastSessionScopeKeyFor = (sessionKey = currentSessionKey) => {
    const parsed = parseAgentSessionKey(sessionKey);
    return buildTuiLastSessionScopeKey({
      connectionUrl: client.connection.url,
      agentId: parsed?.agentId ?? currentAgentId,
      sessionScope,
    });
  };
  const rememberCurrentSessionKey = (sessionKey) => {
    const trimmed = sessionKey.trim();
    if (!trimmed || trimmed === "unknown") return;
    writeTuiLastSessionKey({
      scopeKey: buildLastSessionScopeKeyFor(trimmed),
      sessionKey: trimmed,
    }).catch(() => void 0);
  };
  const restoreRememberedSession = async () => {
    if (initialSessionInput || rememberedSessionApplied) return;
    rememberedSessionApplied = true;
    const remembered = await readTuiLastSessionKey({ scopeKey: buildLastSessionScopeKeyFor() });
    const rememberedKey = remembered ? resolveSessionKey(remembered) : null;
    if (!rememberedKey || rememberedKey === currentSessionKey) return;
    const rememberedAgent = parseAgentSessionKey(rememberedKey)?.agentId;
    if (rememberedAgent && normalizeAgentId(rememberedAgent) !== currentAgentId) return;
    const sessions = await client
      .listSessions({
        limit: 5,
        search: rememberedKey,
        includeGlobal: false,
        includeUnknown: false,
        agentId: currentAgentId,
      })
      .catch(() => null);
    if (!sessions) return;
    const restored = resolveRememberedTuiSessionKey({
      rememberedKey,
      currentAgentId,
      sessions: sessions.sessions,
    });
    if (!restored || restored === currentSessionKey) return;
    currentSessionKey = restored;
    updateHeader();
    updateFooter();
  };
  const updateHeader = () => {
    const sessionLabel = formatSessionKey(currentSessionKey);
    const agentLabel = formatAgentLabel(currentAgentId);
    const title = opts.title ?? "openclaw tui";
    header.setText(
      theme.header(
        `${title} - ${client.connection.url} - agent ${agentLabel} - session ${sessionLabel}`,
      ),
    );
  };
  let statusText = null;
  let statusLoader = null;
  const formatElapsed = (startMs) => {
    const totalSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1e3));
    if (totalSeconds < 60) return `${totalSeconds}s`;
    return `${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`;
  };
  const ensureStatusText = () => {
    if (statusText) return;
    statusContainer.clear();
    statusLoader?.stop();
    statusLoader = null;
    statusText = new Text("", 1, 0);
    statusContainer.addChild(statusText);
  };
  const ensureStatusLoader = () => {
    if (statusLoader) return;
    statusContainer.clear();
    statusText = null;
    statusLoader = new Loader(
      tui,
      (spinner) => theme.accent(spinner),
      (text) => theme.bold(theme.accentSoft(text)),
      "",
    );
    statusContainer.addChild(statusLoader);
  };
  let waitingTick = 0;
  let waitingTimer = null;
  let waitingPhrase = null;
  const updateBusyStatusMessage = () => {
    if (!statusLoader || !statusStartedAt) return;
    const elapsed = formatElapsed(statusStartedAt);
    if (activityStatus === "waiting") {
      waitingTick++;
      statusLoader.setMessage(
        buildWaitingStatusMessage({
          theme,
          tick: waitingTick,
          elapsed,
          connectionStatus,
          phrases: waitingPhrase ? [waitingPhrase] : void 0,
        }),
      );
      return;
    }
    statusLoader.setMessage(`${activityStatus} • ${elapsed} | ${connectionStatus}`);
  };
  const startStatusTimer = () => {
    if (statusTimer) return;
    statusTimer = setInterval(() => {
      if (!isTuiBusyActivityStatus(activityStatus)) return;
      updateBusyStatusMessage();
    }, 1e3);
  };
  const stopStatusTimer = () => {
    if (!statusTimer) return;
    clearInterval(statusTimer);
    statusTimer = null;
  };
  const stopStatusTimeout = () => {
    if (!statusTimeout) return;
    clearTimeout(statusTimeout);
    statusTimeout = null;
  };
  const startWaitingTimer = () => {
    if (waitingTimer) return;
    if (!waitingPhrase)
      waitingPhrase =
        defaultWaitingPhrases[Math.floor(Math.random() * defaultWaitingPhrases.length)] ??
        defaultWaitingPhrases[0] ??
        "waiting";
    waitingTick = 0;
    waitingTimer = setInterval(() => {
      if (activityStatus !== "waiting") return;
      updateBusyStatusMessage();
    }, 120);
  };
  const stopWaitingTimer = () => {
    if (!waitingTimer) return;
    clearInterval(waitingTimer);
    waitingTimer = null;
    waitingPhrase = null;
  };
  const renderStatus = () => {
    if (isTuiBusyActivityStatus(activityStatus)) {
      if (!statusStartedAt || lastActivityStatus !== activityStatus) statusStartedAt = Date.now();
      ensureStatusLoader();
      if (activityStatus === "waiting") {
        stopStatusTimer();
        startWaitingTimer();
      } else {
        stopWaitingTimer();
        startStatusTimer();
      }
      updateBusyStatusMessage();
    } else {
      statusStartedAt = null;
      stopStatusTimer();
      stopWaitingTimer();
      statusLoader?.stop();
      statusLoader = null;
      ensureStatusText();
      const text = activityStatus ? `${connectionStatus} | ${activityStatus}` : connectionStatus;
      statusText?.setText(theme.dim(text));
    }
    lastActivityStatus = activityStatus;
  };
  const setConnectionStatus = (text, ttlMs) => {
    connectionStatus = text;
    renderStatus();
    if (statusTimeout) stopStatusTimeout();
    if (ttlMs && ttlMs > 0)
      statusTimeout = setTimeout(() => {
        connectionStatus = isConnected
          ? isLocalMode
            ? "local ready"
            : "connected"
          : isLocalMode
            ? "local stopped"
            : "disconnected";
        renderStatus();
      }, ttlMs);
  };
  const setActivityStatus = (text) => {
    activityStatus = text;
    renderStatus();
  };
  const withTuiSuspended = async (work) => {
    await drainAndStopTuiSafely(tui);
    if (isLocalMode) setConsoleSubsystemFilter(previousConsoleSubsystemFilter);
    try {
      return await work();
    } finally {
      if (isLocalMode) setConsoleSubsystemFilter(["__openclaw_tui_quiet__"]);
      tui.start();
      tui.setFocus(editor);
      updateHeader();
      updateFooter();
      tui.requestRender(true);
    }
  };
  const runAuthFlow = isLocalMode
    ? async (params) =>
        await withTuiSuspended(
          async () =>
            await new Promise((resolve, reject) => {
              const provider = params.provider?.trim() || void 0;
              const codexBin =
                provider === OPENAI_CODEX_PROVIDER ||
                (!provider && sessionInfo.modelProvider === OPENAI_CODEX_PROVIDER)
                  ? resolveCodexCliBin()
                  : null;
              let command;
              let args;
              if (codexBin) {
                command = codexBin;
                args = ["login"];
              } else {
                ({ command, args } = resolveLocalAuthCliInvocation());
                if (provider) args.push("--provider", provider);
              }
              const invocation = resolveLocalAuthSpawnInvocation({
                command,
                args,
              });
              const child = spawn(invocation.command, invocation.args, {
                cwd: resolveLocalAuthSpawnCwd({
                  args,
                  defaultCwd: resolveUsableCwd(),
                }),
                env: process.env,
                stdio: "inherit",
                ...invocation.options,
              });
              child.once("error", reject);
              child.once("exit", (exitCode, signal) => {
                resolve({
                  exitCode,
                  signal,
                });
              });
            }),
        )
    : void 0;
  const updateFooter = () => {
    const sessionKeyLabel = formatSessionKey(currentSessionKey);
    const sessionLabel = sessionInfo.displayName
      ? `${sessionKeyLabel} (${sessionInfo.displayName})`
      : sessionKeyLabel;
    const agentLabel = formatAgentLabel(currentAgentId);
    const modelLabel = sessionInfo.model
      ? sessionInfo.modelProvider
        ? `${sessionInfo.modelProvider}/${sessionInfo.model}`
        : sessionInfo.model
      : "unknown";
    const tokens = formatTokens(sessionInfo.totalTokens ?? null, sessionInfo.contextTokens ?? null);
    const think = sessionInfo.thinkingLevel ?? "off";
    const fastLabel =
      sessionInfo.fastMode === "auto" ? "fast:auto" : sessionInfo.fastMode === true ? "fast" : null;
    const verbose = sessionInfo.verboseLevel ?? "off";
    const reasoning = sessionInfo.reasoningLevel ?? "off";
    const reasoningLabel =
      reasoning === "on" ? "reasoning" : reasoning === "stream" ? "reasoning:stream" : null;
    const footerParts = [
      resolveTuiFooterHostLabel({
        config,
        connectionUrl: client.connection.url,
      }),
      `agent ${agentLabel}`,
      `session ${sessionLabel}`,
      modelLabel,
      formatGoalFooter(sessionInfo.goal),
      think !== "off" ? `think ${think}` : null,
      fastLabel,
      verbose !== "off" ? `verbose ${verbose}` : null,
      reasoningLabel,
      tokens,
    ].filter(Boolean);
    footer.setText(theme.dim(footerParts.join(" | ")));
  };
  const { openOverlay, closeOverlay } = createOverlayHandlers(tui, editor);
  const pluginApprovals = createTuiPluginApprovalController({
    client,
    chatLog,
    getAgentId: () => currentAgentId,
    getSessionKey: () => currentSessionKey,
    openOverlay,
    closeOverlay,
    requestRender: () => tui.requestRender(),
  });
  const btw = {
    showResult: (params) => {
      chatLog.showBtw(params);
    },
    clear: () => {
      chatLog.dismissBtw();
    },
  };
  const initialSessionAgentId = (() => {
    if (!initialSessionInput) return null;
    const parsed = parseAgentSessionKey(initialSessionInput);
    return parsed ? normalizeAgentId(parsed.agentId) : null;
  })();
  const {
    refreshAgents,
    refreshSessionInfo,
    applySessionInfoFromPatch,
    applySessionMutationResult,
    loadHistory,
    setSession,
    abortActive,
  } = createSessionActions({
    client,
    chatLog,
    btw,
    tui,
    opts,
    state,
    agentNames,
    initialSessionInput,
    initialSessionAgentId,
    resolveSessionKey,
    updateHeader,
    updateFooter,
    updateAutocompleteProvider,
    setActivityStatus,
    clearLocalRunIds,
    rememberSessionKey: rememberCurrentSessionKey,
  });
  const taskSuggestions = createTuiTaskSuggestionController({
    client,
    chatLog,
    getAgentId: () => currentAgentId,
    getSessionKey: () => currentSessionKey,
    openOverlay,
    closeOverlay,
    requestRender: () => tui.requestRender(),
    onAccepted: setSession,
  });
  const {
    handleChatEvent,
    handleAgentEvent,
    handleBtwEvent,
    handleSessionsChangedEvent,
    pauseStreamingWatchdog,
    reconnectStreamingWatchdog,
    consumeCompletedRunForPendingSend,
    isRunObserved,
    flushPendingHistoryRefreshIfIdle,
  } = createEventHandlers({
    chatLog,
    btw,
    tui,
    state,
    localMode: isLocalMode,
    setActivityStatus,
    refreshSessionInfo,
    loadHistory,
    noteLocalRunId,
    isLocalRunId,
    forgetLocalRunId,
    clearLocalRunIds,
    isLocalBtwRunId,
    forgetLocalBtwRunId,
    clearLocalBtwRunIds,
  });
  const deferredFinish = createDeferredTuiFinish();
  const forceExit = () => {
    try {
      process.stderr.write("openclaw tui forcing exit\n");
    } catch {}
    process.exit(130);
  };
  const requestExit = (result) => {
    if (exitRequested) {
      forceExit();
      return;
    }
    exitRequested = true;
    exitResult = {
      exitReason: result?.exitReason ?? "exit",
      ...(result?.crestodianMessage ? { crestodianMessage: result.crestodianMessage } : {}),
    };
    pluginApprovals?.dispose();
    taskSuggestions?.dispose();
    const hardExitTimer = setTimeout(
      forceExit,
      resolveTuiShutdownHardExitMs({ localMode: isLocalMode }),
    );
    hardExitTimer.unref?.();
    Promise.resolve()
      .then(() => client.stop())
      .then(() => drainAndStopTuiSafely(tui))
      .finally(() => {
        clearTimeout(hardExitTimer);
        stopStatusTimeout();
      })
      .catch((err) => {
        if (!isTuiTerminalLossError(err))
          try {
            process.stderr.write(`openclaw tui shutdown failed: ${String(err)}\n`);
          } catch {}
      })
      .finally(() => {
        deferredFinish.requestFinish();
      });
  };
  client.setRequestExitHandler?.(() => requestExit());
  const { handleCommand, sendMessage, openModelSelector, openAgentSelector, openSessionSelector } =
    createCommandHandlers({
      client,
      chatLog,
      tui,
      opts: {
        ...opts,
        local: isLocalMode,
      },
      state,
      deliverDefault,
      openOverlay,
      closeOverlay,
      refreshSessionInfo,
      applySessionInfoFromPatch,
      applySessionMutationResult,
      loadHistory,
      setSession,
      refreshAgents,
      abortActive,
      setActivityStatus,
      formatSessionKey,
      noteLocalRunId,
      noteLocalBtwRunId,
      forgetLocalRunId,
      forgetLocalBtwRunId,
      consumeCompletedRunForPendingSend,
      isRunObserved,
      flushPendingHistoryRefreshIfIdle,
      runAuthFlow,
      requestExit,
    });
  const { runLocalShellLine } = createLocalShellRunner({
    chatLog,
    tui,
    openOverlay,
    closeOverlay,
  });
  updateAutocompleteProvider();
  const admitChatMessage = (message) =>
    resolveTuiChatSubmitAdmission({
      isConnected: state.isConnected,
      activeChatRunId: state.activeChatRunId,
      pendingSubmit: state.pendingSubmit,
      message,
    });
  const notifyBlockedChatSubmit = (_message, reason) => {
    if (reason === "pending") addBlockedChatSubmitNotice(chatLog);
    else {
      chatLog.addSystem(disconnectedTuiChatSubmitMessage(isLocalMode));
      setActivityStatus("disconnected");
    }
    tui.requestRender();
  };
  const notifySubmitError = (action, error) => {
    const message = sanitizeRenderableText(formatErrorMessage(error));
    chatLog.addSystem(`${action} submit failed: ${message}`);
    tui.requestRender();
  };
  editor.onSubmit = createSubmitBurstCoalescer({
    submit: createEditorSubmitHandler({
      editor,
      handleCommand,
      sendMessage,
      handleBangLine: runLocalShellLine,
      onSubmitError: notifySubmitError,
      admitMessage: admitChatMessage,
      onBlockedMessageSubmit: notifyBlockedChatSubmit,
    }),
    enabled: shouldEnableWindowsGitBashPasteFallback(),
  });
  editor.onEscape = () => {
    if (chatLog.hasVisibleBtw()) {
      chatLog.dismissBtw();
      tui.requestRender();
      return;
    }
    abortActive();
  };
  const handleCtrlC = () => {
    const now = Date.now();
    const decision = resolveTuiCtrlCAction({
      hasInput: editor.getText().trim().length > 0,
      now,
      lastCtrlCAt,
      exitRequested,
      wasDisconnected,
    });
    if (decision.action === "force-exit") {
      forceExit();
      return;
    }
    lastCtrlCAt = decision.nextLastCtrlCAt;
    if (decision.action === "clear") {
      editor.setText("");
      setActivityStatus("cleared input; press ctrl+c again to exit");
      tui.requestRender();
      return;
    }
    if (decision.action === "exit") {
      requestExit();
      return;
    }
    setActivityStatus("press ctrl+c again to exit");
    tui.requestRender();
  };
  editor.onCtrlC = () => {
    handleCtrlC();
  };
  editor.onCtrlD = () => {
    requestExit();
  };
  editor.onCtrlO = () => {
    toolsExpanded = !toolsExpanded;
    chatLog.setToolsExpanded(toolsExpanded);
    setActivityStatus(
      resolveTuiToolsToggleActivityStatus({
        currentStatus: activityStatus,
        toolsExpanded,
      }),
    );
    tui.requestRender();
  };
  editor.onCtrlL = () => {
    openModelSelector();
  };
  editor.onCtrlG = () => {
    openAgentSelector();
  };
  editor.onCtrlP = () => {
    openSessionSelector();
  };
  editor.onCtrlT = () => {
    showThinking = !showThinking;
    loadHistory();
  };
  tui.addInputListener((data) => {
    if (!chatLog.hasVisibleBtw()) return;
    if (editor.getText().length > 0) return;
    if (matchesKey(data, "enter")) {
      chatLog.dismissBtw();
      tui.requestRender();
      return { consume: true };
    }
  });
  client.onEvent = (evt) => {
    pluginApprovals?.handleEvent(evt.event, evt.payload);
    taskSuggestions?.handleEvent(evt.event, evt.payload);
    if (evt.event === "chat") handleChatEvent(evt.payload);
    if (evt.event === "chat.side_result") handleBtwEvent(evt.payload);
    if (evt.event === "agent") handleAgentEvent(evt.payload);
    if (evt.event === "sessions.changed") handleSessionsChangedEvent(evt.payload);
  };
  client.onConnected = () => {
    isConnected = true;
    pairingHintShown = false;
    const reconnected = wasDisconnected;
    wasDisconnected = false;
    if (reconnected) reconnectStreamingWatchdog();
    setConnectionStatus(isLocalMode ? "local ready" : "connected");
    if (!isTuiBusyActivityStatus(activityStatus)) setActivityStatus("starting up");
    (async () => {
      try {
        await client.subscribeSessionEvents?.();
      } catch (err) {
        chatLog.addSystem(`session event subscribe failed: ${String(err)}`);
      }
      await refreshAgents();
      await restoreRememberedSession();
      updateHeader();
      updateAutocompleteProvider();
      try {
        await pluginApprovals?.refresh();
      } catch (err) {
        chatLog.addSystem(`plugin approval refresh failed: ${String(err)}`);
      }
      try {
        await taskSuggestions?.refresh();
      } catch (err) {
        chatLog.addSystem(`task suggestion refresh failed: ${String(err)}`);
      }
      await loadHistory();
      if (activityStatus === "starting up") setActivityStatus("idle");
      setConnectionStatus(
        isLocalMode ? "local ready" : reconnected ? "gateway reconnected" : "gateway connected",
        4e3,
      );
      tui.requestRender();
      dynamicSlashCommandsReady = true;
      scheduleDynamicSlashCommandsRefresh();
      if (!autoMessageSent && autoMessage) {
        autoMessageSent = true;
        await sendMessage(autoMessage);
      }
      updateFooter();
      tui.requestRender();
    })().catch((err) => {
      chatLog.addSystem(`startup failed: ${String(err)}`);
      if (activityStatus === "starting up") setActivityStatus("idle");
      setConnectionStatus("startup failed", 5e3);
      tui.requestRender();
    });
  };
  client.onDisconnected = (reason) => {
    isConnected = false;
    wasDisconnected = true;
    historyLoaded = false;
    dynamicSlashCommands = [];
    dynamicSlashCommandsKey = null;
    dynamicSlashCommandsInFlightKey = null;
    dynamicSlashCommandsReady = false;
    clearDynamicSlashCommandsRefreshTimer();
    dynamicSlashCommandsRequestId += 1;
    updateAutocompleteProvider();
    pauseStreamingWatchdog();
    const disconnectState = isLocalMode
      ? {
          connectionStatus: `local runtime stopped${reason ? `: ${reason}` : ""}`,
          activityStatus: "idle",
          pairingHint: void 0,
        }
      : resolveGatewayDisconnectState(reason);
    setConnectionStatus(disconnectState.connectionStatus, 5e3);
    setActivityStatus(disconnectState.activityStatus);
    if (disconnectState.pairingHint && !pairingHintShown) {
      pairingHintShown = true;
      chatLog.addSystem(disconnectState.pairingHint);
    }
    updateFooter();
    tui.requestRender();
  };
  client.onGap = (info) => {
    setConnectionStatus(`event gap: expected ${info.expected}, got ${info.received}`, 5e3);
    (async () => {
      try {
        await pluginApprovals?.refresh();
      } catch (err) {
        chatLog.addSystem(`plugin approval refresh failed: ${String(err)}`);
      }
      try {
        await taskSuggestions?.refresh();
      } catch (err) {
        chatLog.addSystem(`task suggestion refresh failed: ${String(err)}`);
      }
    })();
    tui.requestRender();
  };
  updateHeader();
  setConnectionStatus(isLocalMode ? "starting local runtime" : "connecting");
  updateFooter();
  const sigintHandler = () => {
    handleCtrlC();
  };
  const sigtermHandler = () => {
    requestExit();
  };
  const sighupHandler = () => {
    requestExit();
  };
  process.on("SIGINT", sigintHandler);
  process.on("SIGTERM", sigtermHandler);
  process.on("SIGHUP", sighupHandler);
  let cleanupTerminalLossHandler = installTuiTerminalLossExitHandler(() => requestExit());
  tui.start();
  client.start();
  await new Promise((resolve) => {
    const finish = () => {
      pluginApprovals?.dispose();
      taskSuggestions?.dispose();
      if (isLocalMode) setConsoleSubsystemFilter(previousConsoleSubsystemFilter);
      cleanupTerminalLossHandler?.();
      cleanupTerminalLossHandler = null;
      process.removeListener("SIGINT", sigintHandler);
      process.removeListener("SIGTERM", sigtermHandler);
      process.removeListener("SIGHUP", sighupHandler);
      process.removeListener("exit", finish);
      deferredFinish.clearFinish();
      resolve();
    };
    process.once("exit", finish);
    deferredFinish.setFinish(finish);
  });
  if (opts.forceProcessExitOnReturn === true) scheduleProcessExitAfterTuiReturn();
  return exitResult;
}
//#endregion
export {
  createEditorSubmitHandler as C,
  resolveFinalAssistantText as E,
  stopTuiSafely as S,
  shouldEnableWindowsGitBashPasteFallback as T,
  resolveTuiSessionKey as _,
  isIgnorableTuiStopError as a,
  runTui as b,
  resolveCodexCliBin as c,
  resolveInitialTuiAgentId as d,
  resolveLocalAuthCliInvocation as f,
  resolveTuiFooterHostLabel as g,
  resolveTuiCtrlCAction as h,
  installTuiTerminalLossExitHandler as i,
  resolveCtrlCAction as l,
  resolveLocalAuthSpawnInvocation as m,
  createDeferredTuiFinish as n,
  isTuiBusyActivityStatus as o,
  resolveLocalAuthSpawnCwd as p,
  drainAndStopTuiSafely as r,
  isTuiTerminalLossError as s,
  createBackspaceDeduper as t,
  resolveGatewayDisconnectState as u,
  resolveTuiShutdownHardExitMs as v,
  createSubmitBurstCoalescer as w,
  scheduleProcessExitAfterTuiReturn as x,
  resolveTuiToolsToggleActivityStatus as y,
};
