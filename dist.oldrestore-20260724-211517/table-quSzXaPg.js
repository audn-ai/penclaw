import os from "node:os";
import path from "node:path";
import {
  c as splitAnsiSegments,
  n as splitGraphemes,
  o as truncateToVisibleWidth,
  s as visibleWidth,
} from "./ansi-D4OHEz5F.js";
//#region packages/terminal-core/src/display-string.ts
/** Normalize env/home values and reject shell placeholder strings. */
function normalize$1(value) {
  const trimmed = value?.trim();
  return trimmed && trimmed !== "undefined" && trimmed !== "null" ? trimmed : void 0;
}
/** Run a home resolver defensively because some runtimes throw for missing passwd data. */
function normalizeSafe(fn) {
  try {
    return normalize$1(fn());
  } catch {
    return;
  }
}
/** Resolve Termux home from its Android prefix layout. */
function resolveTermuxHome(env) {
  const prefix = normalize$1(env.PREFIX);
  if (!prefix || !normalize$1(env.ANDROID_DATA)) return;
  if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) return;
  return path.resolve(prefix, "..", "home");
}
/** Resolve the underlying OS home before applying OpenClaw overrides. */
function resolveRawOsHomeDir(env, homedir) {
  return (
    normalize$1(env.HOME) ??
    normalize$1(env.USERPROFILE) ??
    resolveTermuxHome(env) ??
    normalizeSafe(homedir)
  );
}
/** Resolve raw home with OPENCLAW_HOME tilde expansion. */
function resolveRawHomeDir(env = process.env, homedir = os.homedir) {
  const explicitHome = normalize$1(env.OPENCLAW_HOME);
  if (explicitHome) {
    const fallbackHome = resolveRawOsHomeDir(env, homedir);
    return fallbackHome ? explicitHome.replace(/^~(?=$|[\\/])/, fallbackHome) : explicitHome;
  }
  return resolveRawOsHomeDir(env, homedir);
}
/** Resolve the effective absolute home directory for display replacement. */
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir) {
  const raw = resolveRawHomeDir(env, homedir);
  return raw ? path.resolve(raw) : void 0;
}
/** Resolve the display prefix that should replace the effective home path. */
function resolveHomeDisplayPrefix() {
  const home = resolveEffectiveHomeDir();
  if (!home) return;
  return process.env.OPENCLAW_HOME?.trim()
    ? {
        home,
        prefix: "$OPENCLAW_HOME",
      }
    : {
        home,
        prefix: "~",
      };
}
/** Replace a whole-value home or child path without clipping sibling path prefixes. */
function replaceHomePath(input, display) {
  let output = "";
  let cursor = 0;
  while (cursor < input.length) {
    const index = input.indexOf(display.home, cursor);
    if (index < 0) return `${output}${input.slice(cursor)}`;
    const before = input[index - 1];
    const homeEnd = index + display.home.length;
    const after = input[homeEnd];
    const startsToken = before === void 0 || /[\s("'`:=[{,]/u.test(before);
    let punctuationEnd = homeEnd;
    while (punctuationEnd < input.length && /[)"'`:,;.\]}]/u.test(input.charAt(punctuationEnd)))
      punctuationEnd += 1;
    const punctuationEndsToken =
      punctuationEnd > homeEnd &&
      (punctuationEnd === input.length || /\s/u.test(input.charAt(punctuationEnd)));
    if (
      startsToken &&
      (after === void 0 || after === "/" || after === "\\" || punctuationEndsToken)
    )
      output += `${input.slice(cursor, index)}${display.prefix}`;
    else output += input.slice(cursor, index + display.home.length);
    cursor = index + display.home.length;
  }
  return output;
}
/** Replace the effective home path with "~" or "$OPENCLAW_HOME" for terminal display. */
function displayString(input) {
  if (!input) return input;
  const display = resolveHomeDisplayPrefix();
  return display ? replaceHomePath(input, display) : input;
}
//#endregion
//#region packages/terminal-core/src/table.ts
function resolveDefaultBorder(platform, env) {
  if (platform !== "win32") return "unicode";
  const term = env.TERM ?? "";
  const termProgram = env.TERM_PROGRAM ?? "";
  return Boolean(env.WT_SESSION) ||
    term.includes("xterm") ||
    term.includes("cygwin") ||
    term.includes("msys") ||
    termProgram === "vscode"
    ? "unicode"
    : "ascii";
}
function repeat(ch, n) {
  if (n <= 0) return "";
  return ch.repeat(n);
}
function padCell(text, width, align) {
  const content = visibleWidth(text) > width ? truncateToVisibleWidth(text, width) : text;
  const w = visibleWidth(content);
  if (w >= width) return content;
  const pad = width - w;
  if (align === "right") return `${repeat(" ", pad)}${content}`;
  if (align === "center") {
    const left = Math.floor(pad / 2);
    const right = pad - left;
    return `${repeat(" ", left)}${content}${repeat(" ", right)}`;
  }
  return `${content}${repeat(" ", pad)}`;
}
const ESC = "\x1B";
const C1_CSI = "";
const C1_OSC = "";
const C1_ST = "";
const BEL = "\x07";
const SGR_CATEGORY_ORDER = [
  "font",
  "intensity",
  "italic",
  "underline",
  "underlineColor",
  "blink",
  "inverse",
  "conceal",
  "strike",
  "proportional",
  "frame",
  "overline",
  "ideogram",
  "script",
  "foreground",
  "background",
];
const SGR_RESET_CATEGORIES = /* @__PURE__ */ new Map([
  [10, "font"],
  [22, "intensity"],
  [23, "italic"],
  [24, "underline"],
  [25, "blink"],
  [27, "inverse"],
  [28, "conceal"],
  [29, "strike"],
  [39, "foreground"],
  [49, "background"],
  [50, "proportional"],
  [54, "frame"],
  [55, "overline"],
  [59, "underlineColor"],
  [65, "ideogram"],
  [75, "script"],
]);
const SGR_CATEGORY_RESETS = /* @__PURE__ */ new Map([
  ["font", 10],
  ["intensity", 22],
  ["italic", 23],
  ["underline", 24],
  ["blink", 25],
  ["inverse", 27],
  ["conceal", 28],
  ["strike", 29],
  ["foreground", 39],
  ["background", 49],
  ["proportional", 50],
  ["frame", 54],
  ["overline", 55],
  ["underlineColor", 59],
  ["ideogram", 65],
  ["script", 75],
]);
function simpleSgrCategory(param) {
  if (param === 1 || param === 2) return "intensity";
  if (param >= 11 && param <= 19) return "font";
  if (param === 3 || param === 20) return "italic";
  if (param === 4 || param === 21) return "underline";
  if (param === 5 || param === 6) return "blink";
  if (param === 7) return "inverse";
  if (param === 8) return "conceal";
  if (param === 9) return "strike";
  if (param === 26) return "proportional";
  if ((param >= 30 && param <= 37) || (param >= 90 && param <= 97)) return "foreground";
  if ((param >= 40 && param <= 47) || (param >= 100 && param <= 107)) return "background";
  if (param === 51 || param === 52) return "frame";
  if (param === 53) return "overline";
  if (param >= 60 && param <= 64) return "ideogram";
  if (param === 73 || param === 74) return "script";
}
function extendedSgrCategory(param) {
  if (param === 38) return "foreground";
  if (param === 48) return "background";
  return param === 58 ? "underlineColor" : void 0;
}
function parseSgrSequence(value) {
  let introducer;
  if (value.startsWith(`${ESC}[`) && value.endsWith("m")) introducer = `${ESC}[`;
  else if (value.startsWith(C1_CSI) && value.endsWith("m")) introducer = C1_CSI;
  else return;
  const parameters = Array.from(value.slice(introducer.length, -1))
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join("");
  if (
    !Array.from(parameters).every(
      (character) =>
        (character >= "0" && character <= "9") || character === ";" || character === ":",
    )
  )
    return;
  return {
    introducer,
    parameters,
  };
}
function sgrSequence(introducer, parameters) {
  return `${introducer}${parameters}m`;
}
function applySgrSequence(active, value) {
  const sequence = parseSgrSequence(value);
  if (!sequence) return;
  const fields = sequence.parameters === "" ? ["0"] : sequence.parameters.split(";");
  for (let index = 0; index < fields.length; index += 1) {
    const field = fields[index] ?? "";
    if (field.includes(":")) {
      const param = Number(field.slice(0, field.indexOf(":")));
      const category = extendedSgrCategory(param) ?? simpleSgrCategory(param);
      if (category) active.set(category, sgrSequence(sequence.introducer, field));
      continue;
    }
    const param = field === "" ? 0 : Number(field);
    if (!Number.isInteger(param)) continue;
    if (param === 0) {
      active.clear();
      continue;
    }
    const resetCategory = SGR_RESET_CATEGORIES.get(param);
    if (resetCategory) {
      active.delete(resetCategory);
      continue;
    }
    const extendedCategory = extendedSgrCategory(param);
    if (extendedCategory) {
      const mode = Number(fields[index + 1]);
      const operandCount = mode === 2 ? 3 : mode === 5 ? 1 : void 0;
      const lastOperandIndex = operandCount === void 0 ? -1 : index + 1 + operandCount;
      if (lastOperandIndex < index || lastOperandIndex >= fields.length) break;
      const parameters = fields.slice(index, lastOperandIndex + 1).join(";");
      active.set(extendedCategory, sgrSequence(sequence.introducer, parameters));
      index = lastOperandIndex;
      continue;
    }
    const category = simpleSgrCategory(param);
    if (category) active.set(category, sgrSequence(sequence.introducer, String(param)));
  }
}
function activeSgrAfter(tokens) {
  const active = /* @__PURE__ */ new Map();
  for (const token of tokens) if (token.kind === "ansi") applySgrSequence(active, token.value);
  return SGR_CATEGORY_ORDER.flatMap((category) => {
    const open = active.get(category);
    const parsed = open ? parseSgrSequence(open) : void 0;
    const reset = SGR_CATEGORY_RESETS.get(category);
    return open && parsed && reset !== void 0
      ? [
          {
            close: sgrSequence(parsed.introducer, String(reset)),
            open,
          },
        ]
      : [];
  });
}
function parseOsc8Sequence(value) {
  let payloadStart;
  if (value.startsWith(`${ESC}]`)) payloadStart = 2;
  else if (value.startsWith(C1_OSC)) payloadStart = 1;
  else return;
  let terminatorLength;
  if (value.endsWith(`${ESC}\\`)) terminatorLength = 2;
  else if (value.endsWith(BEL) || value.endsWith(C1_ST)) terminatorLength = 1;
  else return;
  const payload = value.slice(payloadStart, -terminatorLength);
  if (!payload.startsWith("8;")) return;
  const uriSeparator = payload.indexOf(";", 2);
  if (uriSeparator < 0) return;
  return {
    params: payload.slice(2, uriSeparator),
    uri: payload.slice(uriSeparator + 1),
  };
}
function activeOsc8After(tokens) {
  let active;
  for (const token of tokens) {
    if (token.kind !== "ansi") continue;
    const link = parseOsc8Sequence(token.value);
    if (link) active = link.uri === "" ? void 0 : link;
  }
  return active;
}
function wrapLine(text, width) {
  if (width <= 0) return [text];
  const tokens = [];
  for (const segment of splitAnsiSegments(text)) {
    if (segment.kind === "ansi") {
      tokens.push({
        kind: "ansi",
        value: segment.value,
        width: visibleWidth(segment.controls.join("")),
      });
      continue;
    }
    for (const grapheme of splitGraphemes(segment.value))
      tokens.push({
        kind: "char",
        value: grapheme,
      });
  }
  if (!tokens.some((token) => token.kind === "char")) return [text];
  const lines = [];
  const isBreakChar = (ch) =>
    ch === " " || ch === "	" || ch === "/" || ch === "-" || ch === "_" || ch === ".";
  const isSpaceChar = (ch) => ch === " " || ch === "	";
  let skipNextLf = false;
  const buf = [];
  let bufVisible = 0;
  let lastBreakIndex = null;
  const bufToString = (slice) => (slice ?? buf).map((t) => t.value).join("");
  const bufVisibleWidth = (slice) =>
    slice.reduce(
      (acc, token) => acc + (token.kind === "char" ? visibleWidth(token.value) : token.width),
      0,
    );
  const pushLine = (value) => {
    const cleaned = value.replace(/\s+$/, "");
    if (visibleWidth(cleaned) === 0) return;
    lines.push(cleaned);
  };
  const trimLeadingSpaces = (tokensLocal) => {
    while (true) {
      const firstCharIndexLocal = tokensLocal.findIndex((token) => token.kind === "char");
      if (firstCharIndexLocal < 0) return;
      const firstChar = tokensLocal[firstCharIndexLocal];
      if (!firstChar || !isSpaceChar(firstChar.value)) return;
      tokensLocal.splice(firstCharIndexLocal, 1);
    }
  };
  const flushAt = (breakAt) => {
    if (buf.length === 0) return;
    const left = breakAt == null || breakAt <= 0 ? buf : buf.slice(0, breakAt);
    const activeSgr = activeSgrAfter(left);
    const activeOsc8 = activeOsc8After(left);
    const closeOsc8 = activeOsc8 ? `${ESC}]8;;${BEL}` : "";
    const openOsc8 = activeOsc8 ? `${ESC}]8;${activeOsc8.params};${activeOsc8.uri}${BEL}` : "";
    const closeSgr = activeSgr.map((state) => state.close).join("");
    if (breakAt == null || breakAt <= 0) {
      pushLine(`${bufToString()}${closeOsc8}${closeSgr}`);
      buf.length = 0;
      if (openOsc8)
        buf.push({
          kind: "ansi",
          value: openOsc8,
          width: 0,
        });
      for (const state of activeSgr)
        buf.push({
          kind: "ansi",
          value: state.open,
          width: 0,
        });
      bufVisible = 0;
      lastBreakIndex = null;
      return;
    }
    const rest = buf.slice(breakAt);
    pushLine(`${bufToString(left)}${closeOsc8}${closeSgr}`);
    trimLeadingSpaces(rest);
    if (openOsc8)
      rest.unshift({
        kind: "ansi",
        value: openOsc8,
        width: 0,
      });
    if (activeSgr.length > 0)
      rest.unshift(
        ...activeSgr.map((state) => ({
          kind: "ansi",
          value: state.open,
          width: 0,
        })),
      );
    buf.length = 0;
    buf.push(...rest);
    bufVisible = bufVisibleWidth(buf);
    lastBreakIndex = null;
  };
  const makeRoomFor = (tokenWidth) => {
    if (bufVisible + tokenWidth <= width || bufVisible === 0) return;
    flushAt(lastBreakIndex);
    if (bufVisible + tokenWidth > width && bufVisible > 0) flushAt(null);
  };
  for (const token of tokens) {
    if (token.kind === "ansi") {
      makeRoomFor(token.width);
      buf.push(token);
      bufVisible += token.width;
      continue;
    }
    const ch = token.value;
    if (skipNextLf) {
      skipNextLf = false;
      if (ch === "\n") continue;
    }
    if (ch === "\n" || ch === "\r") {
      flushAt(buf.length);
      if (ch === "\r") skipNextLf = true;
      continue;
    }
    const charWidth = visibleWidth(ch);
    makeRoomFor(charWidth);
    if (bufVisible === 0 && isSpaceChar(ch)) continue;
    buf.push(token);
    bufVisible += charWidth;
    if (isBreakChar(ch)) lastBreakIndex = buf.length;
  }
  flushAt(buf.length);
  return lines.length > 0 ? lines : [""];
}
function normalizeWidth(n) {
  if (n == null) return;
  if (!Number.isFinite(n) || n <= 0) return;
  return Math.floor(n);
}
function getTerminalTableWidth(minWidth = 60, fallbackWidth = 120) {
  return Math.max(minWidth, process.stdout.columns ?? fallbackWidth);
}
function renderTable(opts) {
  const rows = opts.rows.map((row) => {
    const next = {};
    for (const [key, value] of Object.entries(row)) next[key] = displayString(value);
    return next;
  });
  const border = opts.border ?? resolveDefaultBorder(process.platform, process.env);
  if (border === "none") {
    const columns = opts.columns;
    return `${[columns.map((c) => c.header).join(" | "), ...rows.map((r) => columns.map((c) => r[c.key] ?? "").join(" | "))].join("\n")}\n`;
  }
  const padding = Math.max(0, opts.padding ?? 1);
  const columns = opts.columns;
  const metrics = columns.map((c) => {
    return {
      headerW: visibleWidth(c.header),
      cellW: Math.max(0, ...rows.map((r) => visibleWidth(r[c.key] ?? ""))),
    };
  });
  const widths = columns.map((c, i) => {
    const m = metrics[i];
    const base = Math.max(m?.headerW ?? 0, m?.cellW ?? 0) + padding * 2;
    const capped = c.maxWidth ? Math.min(base, c.maxWidth) : base;
    return Math.max(c.minWidth ?? 3, capped);
  });
  const maxWidth = normalizeWidth(opts.width);
  const sepCount = columns.length + 1;
  const total = widths.reduce((a, b) => a + b, 0) + sepCount;
  const preferredMinWidths = columns.map((c, i) =>
    Math.max(c.minWidth ?? 3, (metrics[i]?.headerW ?? 0) + padding * 2, 3),
  );
  const absoluteMinWidths = columns.map((_c, i) =>
    Math.max((metrics[i]?.headerW ?? 0) + padding * 2, 3),
  );
  if (maxWidth && total > maxWidth) {
    let over = total - maxWidth;
    const flexOrder = columns
      .map((_c, i) => ({
        i,
        w: widths[i] ?? 0,
      }))
      .filter(({ i }) => Boolean(columns[i]?.flex))
      .toSorted((a, b) => b.w - a.w)
      .map((x) => x.i);
    const nonFlexOrder = columns
      .map((_c, i) => ({
        i,
        w: widths[i] ?? 0,
      }))
      .filter(({ i }) => !columns[i]?.flex)
      .toSorted((a, b) => b.w - a.w)
      .map((x) => x.i);
    const shrink = (order, minWidths) => {
      while (over > 0) {
        let progressed = false;
        for (const i of order) {
          if ((widths[i] ?? 0) <= (minWidths[i] ?? 0)) continue;
          widths[i] = (widths[i] ?? 0) - 1;
          over -= 1;
          progressed = true;
          if (over <= 0) break;
        }
        if (!progressed) break;
      }
    };
    shrink(flexOrder, preferredMinWidths);
    shrink(flexOrder, absoluteMinWidths);
    shrink(nonFlexOrder, preferredMinWidths);
    shrink(nonFlexOrder, absoluteMinWidths);
  }
  if (maxWidth) {
    const sepCountLocal = columns.length + 1;
    let extra = maxWidth - (widths.reduce((a, b) => a + b, 0) + sepCountLocal);
    if (extra > 0) {
      const flexCols = columns
        .map((c, i) => ({
          c,
          i,
        }))
        .filter(({ c }) => Boolean(c.flex))
        .map(({ i }) => i);
      if (flexCols.length > 0) {
        const caps = columns.map((c) =>
          typeof c.maxWidth === "number" && c.maxWidth > 0
            ? Math.floor(c.maxWidth)
            : Number.POSITIVE_INFINITY,
        );
        while (extra > 0) {
          let progressed = false;
          for (const i of flexCols) {
            if ((widths[i] ?? 0) >= (caps[i] ?? Number.POSITIVE_INFINITY)) continue;
            widths[i] = (widths[i] ?? 0) + 1;
            extra -= 1;
            progressed = true;
            if (extra <= 0) break;
          }
          if (!progressed) break;
        }
      }
    }
  }
  const box =
    border === "ascii"
      ? {
          tl: "+",
          tr: "+",
          bl: "+",
          br: "+",
          h: "-",
          v: "|",
          t: "+",
          ml: "+",
          m: "+",
          mr: "+",
          b: "+",
        }
      : {
          tl: "┌",
          tr: "┐",
          bl: "└",
          br: "┘",
          h: "─",
          v: "│",
          t: "┬",
          ml: "├",
          m: "┼",
          mr: "┤",
          b: "┴",
        };
  const hLine = (left, mid, right) =>
    `${left}${widths.map((w) => repeat(box.h, w)).join(mid)}${right}`;
  const contentWidthFor = (i) => {
    const width = widths.at(i);
    if (width === void 0) throw new Error(`expected table column width ${i} to be defined`);
    return Math.max(1, width - padding * 2);
  };
  const padStr = repeat(" ", padding);
  const renderRow = (record, isHeader = false) => {
    const wrapped = columns
      .map((c) => (isHeader ? c.header : (record[c.key] ?? "")))
      .map((cell, i) => wrapLine(cell, contentWidthFor(i)));
    const height = Math.max(...wrapped.map((w) => w.length));
    const out = [];
    for (let li = 0; li < height; li += 1) {
      const parts = wrapped.map((lines, i) => {
        const aligned = padCell(lines[li] ?? "", contentWidthFor(i), columns[i]?.align ?? "left");
        return `${padStr}${aligned}${padStr}`;
      });
      out.push(`${box.v}${parts.join(box.v)}${box.v}`);
    }
    return out;
  };
  const lines = [];
  lines.push(hLine(box.tl, box.t, box.tr));
  lines.push(...renderRow({}, true));
  lines.push(hLine(box.ml, box.m, box.mr));
  for (const row of rows) lines.push(...renderRow(row, false));
  lines.push(hLine(box.bl, box.b, box.br));
  return `${lines.join("\n")}\n`;
}
//#endregion
export { renderTable as n, getTerminalTableWidth as t };
