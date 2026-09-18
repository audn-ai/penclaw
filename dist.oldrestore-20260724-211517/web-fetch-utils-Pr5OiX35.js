import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region src/agents/tools/web-fetch-visibility.ts
/**
 * HTML visibility sanitizers for web_fetch.
 *
 * Removes hidden or invisible content before readable-text extraction.
 */
const HIDDEN_STYLE_PATTERNS = [
  ["display", /^\s*none\s*$/i],
  ["visibility", /^\s*hidden\s*$/i],
  ["opacity", /^\s*0\s*$/],
  ["font-size", /^\s*0(px|em|rem|pt|%)?\s*$/i],
  ["text-indent", /^\s*-\d{4,}px\s*$/],
  ["color", /^\s*transparent\s*$/i],
  ["color", /^\s*rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*0(?:\.0+)?\s*\)\s*$/i],
  ["color", /^\s*hsla\s*\(\s*[\d.]+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*0(?:\.0+)?\s*\)\s*$/i],
];
const HIDDEN_CLASS_NAMES = /* @__PURE__ */ new Set([
  "sr-only",
  "visually-hidden",
  "d-none",
  "hidden",
  "invisible",
  "screen-reader-only",
  "offscreen",
]);
const HTML_VOID_ELEMENTS = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
function hasHiddenClass(className) {
  return normalizeLowercaseStringOrEmpty(className)
    .split(/\s+/)
    .some((cls) => HIDDEN_CLASS_NAMES.has(cls));
}
function isStyleHidden(style) {
  for (const [prop, pattern] of HIDDEN_STYLE_PATTERNS) {
    const escapedProp = prop.replace(/-/g, "\\-");
    const value = style.match(new RegExp(`(?:^|;)\\s*${escapedProp}\\s*:\\s*([^;]+)`, "i"))?.at(1);
    if (value && pattern.test(value)) return true;
  }
  const clipPathValue = style.match(/(?:^|;)\s*clip-path\s*:\s*([^;]+)/i)?.at(1);
  if (clipPathValue && !/^\s*none\s*$/i.test(clipPathValue)) {
    if (/inset\s*\(\s*(?:0*\.\d+|[1-9]\d*(?:\.\d+)?)%/i.test(clipPathValue)) return true;
  }
  const transformValue = style.match(/(?:^|;)\s*transform\s*:\s*([^;]+)/i)?.at(1);
  if (transformValue) {
    if (/scale\s*\(\s*0\s*\)/i.test(transformValue)) return true;
    if (/translateX\s*\(\s*-\d{4,}px\s*\)/i.test(transformValue)) return true;
    if (/translateY\s*\(\s*-\d{4,}px\s*\)/i.test(transformValue)) return true;
  }
  const width = style.match(/(?:^|;)\s*width\s*:\s*([^;]+)/i);
  const height = style.match(/(?:^|;)\s*height\s*:\s*([^;]+)/i);
  const overflow = style.match(/(?:^|;)\s*overflow\s*:\s*([^;]+)/i);
  if (
    width &&
    /^\s*0(px)?\s*$/i.test(width.at(1) ?? "") &&
    height &&
    /^\s*0(px)?\s*$/i.test(height.at(1) ?? "") &&
    overflow &&
    /^\s*hidden\s*$/i.test(overflow.at(1) ?? "")
  )
    return true;
  const left = style.match(/(?:^|;)\s*left\s*:\s*([^;]+)/i);
  const top = style.match(/(?:^|;)\s*top\s*:\s*([^;]+)/i);
  if (left && /^\s*-\d{4,}px\s*$/i.test(left.at(1) ?? "")) return true;
  if (top && /^\s*-\d{4,}px\s*$/i.test(top.at(1) ?? "")) return true;
  return false;
}
function readAttribute(attrs, name) {
  const escapedName = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const match = attrs.match(
    new RegExp(
      `(?:^|\\s)${escapedName}(?:\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>\`]+)))?`,
      "i",
    ),
  );
  if (!match) return;
  return match[1] ?? match[2] ?? match[3] ?? "";
}
function hasAttribute(attrs, name) {
  return readAttribute(attrs, name) !== void 0;
}
function shouldRemoveElement(tagNameRaw, attrs) {
  const tagName = normalizeLowercaseStringOrEmpty(tagNameRaw);
  if (["meta", "template", "svg", "canvas", "iframe", "object", "embed"].includes(tagName))
    return true;
  if (
    tagName === "input" &&
    normalizeOptionalLowercaseString(readAttribute(attrs, "type")) === "hidden"
  )
    return true;
  if (normalizeOptionalLowercaseString(readAttribute(attrs, "aria-hidden")) === "true") return true;
  if (hasAttribute(attrs, "hidden")) return true;
  if (hasHiddenClass(readAttribute(attrs, "class") ?? "")) return true;
  const style = readAttribute(attrs, "style") ?? "";
  if (style && isStyleHidden(style)) return true;
  return false;
}
function findTagEnd$1(html, start) {
  let quote;
  for (let index = start + 1; index < html.length; index += 1) {
    const char = html[index];
    if (quote) {
      if (char === quote) quote = void 0;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === ">") return index;
  }
  return -1;
}
function readTagName(source, start) {
  let end = start;
  while (end < source.length) {
    const code = source.charCodeAt(end);
    if (
      !(
        (code >= 65 && code <= 90) ||
        (code >= 97 && code <= 122) ||
        (code >= 48 && code <= 57) ||
        source[end] === "-" ||
        source[end] === "_" ||
        source[end] === ":"
      )
    )
      break;
    end += 1;
  }
  if (end === start) return null;
  return {
    tagName: normalizeLowercaseStringOrEmpty(source.slice(start, end)),
    end,
  };
}
function parseHtmlTagToken(token) {
  let inner = token.slice(1, -1).trim();
  if (!inner || inner.startsWith("!") || inner.startsWith("?")) return null;
  const closing = inner.startsWith("/");
  if (closing) inner = inner.slice(1).trimStart();
  const name = readTagName(inner, 0);
  if (!name) return null;
  const attrs = closing ? "" : inner.slice(name.end);
  return {
    tagName: name.tagName,
    attrs,
    closing,
    selfClosing: !closing && attrs.trimEnd().endsWith("/"),
  };
}
function popDroppedElement(dropStack, tagName) {
  const index = dropStack.lastIndexOf(tagName);
  if (index >= 0) dropStack.length = index;
}
function removeMarkedElements(html) {
  let output = "";
  let cursor = 0;
  const dropStack = [];
  while (cursor < html.length) {
    const tagStart = html.indexOf("<", cursor);
    if (tagStart < 0) {
      if (dropStack.length === 0) output += html.slice(cursor);
      break;
    }
    if (dropStack.length === 0) output += html.slice(cursor, tagStart);
    if (html.startsWith("<!--", tagStart)) {
      const commentEnd = html.indexOf("-->", tagStart + 4);
      cursor = commentEnd < 0 ? html.length : commentEnd + 3;
      continue;
    }
    const tagEnd = findTagEnd$1(html, tagStart);
    if (tagEnd < 0) {
      if (dropStack.length === 0) output += html.slice(tagStart);
      break;
    }
    const token = html.slice(tagStart, tagEnd + 1);
    const parsed = parseHtmlTagToken(token);
    if (!parsed) {
      if (dropStack.length === 0) output += token;
      cursor = tagEnd + 1;
      continue;
    }
    if (dropStack.length > 0) {
      if (parsed.closing) popDroppedElement(dropStack, parsed.tagName);
      else if (!parsed.selfClosing && !HTML_VOID_ELEMENTS.has(parsed.tagName))
        dropStack.push(parsed.tagName);
      cursor = tagEnd + 1;
      continue;
    }
    if (parsed.closing) output += token;
    else if (shouldRemoveElement(parsed.tagName, parsed.attrs)) {
      if (!parsed.selfClosing && !HTML_VOID_ELEMENTS.has(parsed.tagName))
        dropStack.push(parsed.tagName);
    } else output += token;
    cursor = tagEnd + 1;
  }
  return output;
}
async function sanitizeHtml(html) {
  return removeMarkedElements(html);
}
const INVISIBLE_UNICODE_RE =
  /[\u200B-\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\uFEFF\u{E0000}-\u{E007F}]/gu;
function stripInvisibleUnicode(text) {
  return text.replace(INVISIBLE_UNICODE_RE, "");
}
//#endregion
//#region src/agents/tools/web-fetch-utils.ts
/**
 * web_fetch extraction utilities.
 *
 * Converts lightweight HTML into bounded markdown/text without pulling in a full renderer.
 */
const RAW_TEXT_TAGS = /* @__PURE__ */ new Set(["script", "style", "noscript"]);
const BLOCK_BREAK_TAGS = /* @__PURE__ */ new Set([
  "p",
  "div",
  "section",
  "article",
  "header",
  "footer",
  "table",
  "tr",
  "ul",
  "ol",
]);
const MAX_RENDER_CONTEXT_DEPTH = 32;
function decodeEntities(value) {
  return decodeHtmlEntities(value.replace(/&nbsp;/gi, "\xA0")).replaceAll("\xA0", " ");
}
function isAsciiWhitespace(value) {
  return value === " " || value === "\n" || value === "\r" || value === "	" || value === "\f";
}
function isTagNameChar(value) {
  const code = value.charCodeAt(0);
  return (
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    value === "." ||
    value === "-" ||
    value === "_" ||
    value === ":"
  );
}
function isTagNameStartChar(value) {
  const code = value.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}
function isTagBoundary(value) {
  return !value || isAsciiWhitespace(value) || value === ">" || value === "/";
}
function asciiLower(value) {
  const code = value.charCodeAt(0);
  return code >= 65 && code <= 90 ? String.fromCharCode(code + 32) : value;
}
function startsWithClosingTag(html, start, tagName) {
  if (html[start] !== "<" || html[start + 1] !== "/") return false;
  for (let offset = 0; offset < tagName.length; offset += 1)
    if (asciiLower(html[start + 2 + offset] ?? "") !== tagName[offset]) return false;
  return isTagBoundary(html[start + 2 + tagName.length]);
}
function readRawTextOpenTagName(html, start) {
  if (html[start] !== "<" || html[start + 1] === "/") return;
  for (const tagName of RAW_TEXT_TAGS) {
    let matches = true;
    for (let offset = 0; offset < tagName.length; offset += 1)
      if (asciiLower(html[start + 1 + offset] ?? "") !== tagName[offset]) {
        matches = false;
        break;
      }
    if (matches && isTagBoundary(html[start + 1 + tagName.length])) return tagName;
  }
}
function findRawTextOpenTagStart(html, start, end) {
  for (let i = start; i < end; i += 1) if (readRawTextOpenTagName(html, i)) return i;
  return -1;
}
function startsLikeHtmlTag(html, start) {
  const next = html[start + 1];
  return next === "!" || next === "?" || next === "/" || isTagNameStartChar(next ?? "");
}
function findTagEnd(html, start) {
  let quote = null;
  let afterEquals = false;
  let rawTextStartInQuote;
  for (let i = start + 1; i < html.length; i += 1) {
    const ch = html.charAt(i);
    if (quote) {
      if (rawTextStartInQuote === void 0 && readRawTextOpenTagName(html, i))
        rawTextStartInQuote = i;
      if (ch === quote) quote = null;
      continue;
    }
    if (afterEquals && isAsciiWhitespace(ch)) continue;
    if (afterEquals && (ch === '"' || ch === "'")) {
      quote = ch;
      afterEquals = false;
      continue;
    }
    afterEquals = false;
    if (readRawTextOpenTagName(html, i))
      return {
        end: -1,
        rawTextStart: i,
      };
    if (ch === ">") return { end: i };
    if (ch === "=") afterEquals = true;
  }
  return {
    end: -1,
    rawTextStart: rawTextStartInQuote,
  };
}
function isSelfClosingTagRaw(raw) {
  const trimmed = raw.trimEnd();
  if (!trimmed.endsWith("/")) return false;
  const beforeSlash = trimmed.charAt(trimmed.length - 2);
  const tagBody = trimmed.slice(0, -1);
  let hasAttributeSeparator = false;
  for (const ch of tagBody)
    if (isAsciiWhitespace(ch)) {
      hasAttributeSeparator = true;
      break;
    }
  return (
    !beforeSlash ||
    isAsciiWhitespace(beforeSlash) ||
    beforeSlash === '"' ||
    beforeSlash === "'" ||
    !hasAttributeSeparator
  );
}
function readTagToken(html, start) {
  if (html.startsWith("<!--", start)) {
    if (html[start + 4] === ">")
      return {
        token: null,
        next: start + 5,
      };
    if (html.startsWith("->", start + 4))
      return {
        token: null,
        next: start + 6,
      };
    const commentEnd = html.indexOf("-->", start + 4);
    return {
      token: null,
      next: commentEnd === -1 ? html.length : commentEnd + 3,
    };
  }
  const tagEnd = findTagEnd(html, start);
  const end = tagEnd.end;
  if (end === -1) {
    if (tagEnd.rawTextStart !== void 0)
      return {
        token: null,
        next: tagEnd.rawTextStart,
      };
    return null;
  }
  let pos = start + 1;
  while (pos < end && isAsciiWhitespace(html.charAt(pos))) pos += 1;
  const closing = html[pos] === "/";
  if (closing) {
    pos += 1;
    while (pos < end && isAsciiWhitespace(html.charAt(pos))) pos += 1;
  }
  if (pos >= end || html[pos] === "!" || html[pos] === "?")
    return {
      token: null,
      next: end + 1,
    };
  const nameStart = pos;
  while (pos < end && isTagNameChar(html.charAt(pos))) pos += 1;
  if (pos === nameStart || !isTagNameStartChar(html[nameStart] ?? "")) {
    const rawTextStart = findRawTextOpenTagStart(html, start + 1, end + 1);
    if (rawTextStart !== -1)
      return {
        token: null,
        next: rawTextStart,
      };
    return {
      token: null,
      next: end + 1,
    };
  }
  const raw = html.slice(start + 1, end);
  return {
    token: {
      closing,
      name: html.slice(nameStart, pos).toLowerCase(),
      raw,
      selfClosing: isSelfClosingTagRaw(raw),
    },
    next: end + 1,
  };
}
function readAttributeValue(rawTag, name) {
  const target = name.toLowerCase();
  let pos = 0;
  while (pos < rawTag.length && !isAsciiWhitespace(rawTag.charAt(pos))) pos += 1;
  while (pos < rawTag.length) {
    while (
      pos < rawTag.length &&
      (isAsciiWhitespace(rawTag.charAt(pos)) || rawTag.charAt(pos) === "/")
    )
      pos += 1;
    const attrStart = pos;
    while (pos < rawTag.length && isTagNameChar(rawTag.charAt(pos))) pos += 1;
    if (pos === attrStart) {
      pos = skipUnsupportedAttribute(rawTag, pos);
      continue;
    }
    const attrName = rawTag.slice(attrStart, pos).toLowerCase();
    while (pos < rawTag.length && isAsciiWhitespace(rawTag.charAt(pos))) pos += 1;
    let value = "";
    if (rawTag[pos] === "=") {
      pos += 1;
      while (pos < rawTag.length && isAsciiWhitespace(rawTag.charAt(pos))) pos += 1;
      const quote = rawTag[pos];
      if (quote === '"' || quote === "'") {
        const valueStart = pos + 1;
        const valueEnd = rawTag.indexOf(quote, valueStart);
        if (valueEnd === -1) {
          value = rawTag.slice(valueStart);
          pos = rawTag.length;
        } else {
          value = rawTag.slice(valueStart, valueEnd);
          pos = valueEnd + 1;
        }
      } else {
        const valueStart = pos;
        while (
          pos < rawTag.length &&
          !isAsciiWhitespace(rawTag.charAt(pos)) &&
          rawTag[pos] !== '"' &&
          rawTag[pos] !== "'" &&
          rawTag[pos] !== "=" &&
          rawTag[pos] !== "<" &&
          rawTag[pos] !== ">" &&
          rawTag[pos] !== "`"
        )
          pos += 1;
        value = rawTag.slice(valueStart, pos);
      }
    }
    if (attrName === target) return decodeEntities(value);
  }
}
function skipUnsupportedAttribute(rawTag, start) {
  let pos = start;
  while (pos < rawTag.length && !isAsciiWhitespace(rawTag.charAt(pos))) {
    const quote = rawTag.charAt(pos);
    if (quote === '"' || quote === "'") {
      const valueEnd = rawTag.indexOf(quote, pos + 1);
      pos = valueEnd === -1 ? rawTag.length : valueEnd + 1;
      continue;
    }
    pos += 1;
  }
  return pos;
}
function contextText(context) {
  return context.parts.join("");
}
function appendText(stack, value) {
  const context = stack[stack.length - 1];
  context?.parts.push(value);
  if (context?.kind === "anchor" && /\S/.test(value)) context.hasText = true;
}
function closeContext(context, parent, state) {
  const label = normalizeWhitespace(contextText(context));
  if (!label && context.kind !== "title" && !(context.kind === "anchor" && context.href)) return;
  switch (context.kind) {
    case "title":
      state.title ??= label || void 0;
      return;
    case "anchor":
      if (parent.kind === "title") parent.parts.push(label);
      else
        parent.parts.push(
          context.href && label ? `[${label}](${context.href})` : label || context.href || "",
        );
      return;
    case "heading":
      if (parent.kind === "title") parent.parts.push(label);
      else if (parent.kind === "anchor") {
        parent.parts.push(label);
        parent.hasText ||= Boolean(label);
      } else parent.parts.push(`\n${"#".repeat(context.level)} ${label}\n`);
      return;
    case "list-item":
      if (parent.kind === "title") parent.parts.push(label);
      else {
        if (parent.kind === "anchor") parent.hasText ||= Boolean(label);
        parent.parts.push(`\n- ${label}`);
      }
      return;
    case "root":
      parent.parts.push(label);
  }
}
function closeTopContext(stack, state) {
  if (stack.length < 2) return false;
  const context = stack.pop();
  const parent = stack[stack.length - 1];
  if (!context || !parent) return false;
  closeContext(context, parent, state);
  return true;
}
function closeThroughContext(stack, kind, state) {
  for (let i = stack.length - 1; i > 0; i -= 1)
    if (stack[i]?.kind === kind) {
      while (stack.length > i) closeTopContext(stack, state);
      return true;
    }
  return false;
}
function pushContext(stack, context, state) {
  while (stack.length >= MAX_RENDER_CONTEXT_DEPTH) closeTopContext(stack, state);
  stack.push(context);
}
function closeOpenAnchorWithText(stack, state) {
  for (let i = stack.length - 1; i > 0; i -= 1) {
    const context = stack[i];
    if (context?.kind === "anchor") {
      if (!context.hasText) return false;
      while (stack.length > i) closeTopContext(stack, state);
      return true;
    }
  }
  return false;
}
function closeRawTextTagEnd(html, tagName, contentStart) {
  let closeStart = html.indexOf("</", contentStart);
  while (closeStart !== -1) {
    if (startsWithClosingTag(html, closeStart, tagName)) {
      const closeEnd = findTagEnd(html, closeStart).end;
      return closeEnd === -1 ? html.length : closeEnd + 1;
    }
    closeStart = html.indexOf("</", closeStart + 2);
  }
  return html.length;
}
function skipRawTextElement(html, start, tagName) {
  const openerEnd = findTagEnd(html, start);
  return closeRawTextTagEnd(
    html,
    tagName,
    openerEnd.end === -1 ? start + tagName.length + 1 : openerEnd.end + 1,
  );
}
function htmlFragmentToMarkdown(html) {
  const root = {
    kind: "root",
    parts: [],
  };
  const stack = [root];
  const state = {};
  for (let i = 0; i < html.length;) {
    if (html[i] !== "<") {
      const nextTag = html.indexOf("<", i);
      const end = nextTag === -1 ? html.length : nextTag;
      appendText(stack, decodeEntities(html.slice(i, end)));
      i = end;
      continue;
    }
    const rawTextTagName = readRawTextOpenTagName(html, i);
    if (rawTextTagName) {
      i = skipRawTextElement(html, i, rawTextTagName);
      continue;
    }
    if (!startsLikeHtmlTag(html, i)) {
      appendText(stack, "<");
      i += 1;
      continue;
    }
    const read = readTagToken(html, i);
    if (!read) {
      const rawTextStart = findRawTextOpenTagStart(html, i + 1, html.length);
      if (rawTextStart !== -1) {
        i = rawTextStart;
        continue;
      }
      break;
    }
    const { token, next } = read;
    i = next;
    if (!token) continue;
    if (token.closing) {
      if (token.name === "title") closeThroughContext(stack, "title", state);
      else if (token.name === "a") closeThroughContext(stack, "anchor", state);
      else if (/^h[1-6]$/.test(token.name)) closeThroughContext(stack, "heading", state);
      else if (token.name === "li") closeThroughContext(stack, "list-item", state);
      else if (BLOCK_BREAK_TAGS.has(token.name)) appendText(stack, "\n");
      continue;
    }
    if (RAW_TEXT_TAGS.has(token.name)) {
      i = closeRawTextTagEnd(html, token.name, i);
      continue;
    }
    if (BLOCK_BREAK_TAGS.has(token.name)) {
      if (closeOpenAnchorWithText(stack, state)) appendText(stack, " ");
    }
    if (token.name === "br" || token.name === "hr") {
      appendText(stack, "\n");
      continue;
    }
    if (token.name === "title" && !token.selfClosing) {
      pushContext(
        stack,
        {
          kind: "title",
          parts: [],
        },
        state,
      );
      continue;
    }
    if (token.name === "a" && !token.selfClosing) {
      closeThroughContext(stack, "anchor", state);
      pushContext(
        stack,
        {
          kind: "anchor",
          href: readAttributeValue(token.raw, "href"),
          hasText: false,
          parts: [],
        },
        state,
      );
      continue;
    }
    if (/^h[1-6]$/.test(token.name) && !token.selfClosing) {
      closeOpenAnchorWithText(stack, state);
      pushContext(
        stack,
        {
          kind: "heading",
          level: Number.parseInt(token.name[1] ?? "1", 10),
          parts: [],
        },
        state,
      );
      continue;
    }
    if (token.name === "li" && !token.selfClosing) {
      closeOpenAnchorWithText(stack, state);
      pushContext(
        stack,
        {
          kind: "list-item",
          parts: [],
        },
        state,
      );
    }
  }
  while (stack.length > 1) closeTopContext(stack, state);
  return {
    text: normalizeWhitespace(contextText(root)),
    title: state.title,
  };
}
function stripTags(value) {
  return htmlFragmentToMarkdown(value).text;
}
/** Collapses display whitespace while preserving paragraph breaks. */
function normalizeWhitespace(value) {
  return value
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
/** Converts sanitized HTML into coarse markdown plus an optional title. */
function htmlToMarkdown(html) {
  return htmlFragmentToMarkdown(html);
}
/** Removes markdown decoration for plain text extraction. */
function markdownToText(markdown) {
  let text = markdown;
  text = text.replace(/!\[[^\]]*]\([^)]+\)/g, "");
  text = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
  let unfenced = "";
  let pos = 0;
  while (pos < text.length) {
    const open = text.indexOf("```", pos);
    if (open === -1) {
      unfenced += text.slice(pos);
      break;
    }
    unfenced += text.slice(pos, open);
    const afterOpen = open + 3;
    const close = text.indexOf("```", afterOpen);
    if (close === -1) {
      unfenced += text.slice(open);
      break;
    }
    const firstLineEnd = text.indexOf("\n", afterOpen);
    const contentStart = firstLineEnd === -1 || firstLineEnd > close ? afterOpen : firstLineEnd + 1;
    unfenced += text.slice(contentStart, close);
    pos = close + 3;
  }
  text = unfenced;
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");
  return normalizeWhitespace(text);
}
/** Truncates text by characters and reports whether truncation occurred. */
function truncateText(value, maxChars) {
  if (value.length <= maxChars)
    return {
      text: value,
      truncated: false,
    };
  return {
    text: truncateUtf16Safe(value, maxChars),
    truncated: true,
  };
}
/** Sanitizes HTML and extracts either markdown or plain text content. */
async function extractBasicHtmlContent(params) {
  const cleanHtml = await sanitizeHtml(params.html);
  const rendered = htmlToMarkdown(cleanHtml);
  if (params.extractMode === "text") {
    const text =
      stripInvisibleUnicode(markdownToText(rendered.text)) ||
      stripInvisibleUnicode(rendered.title ?? "") ||
      stripInvisibleUnicode(normalizeWhitespace(stripTags(cleanHtml)));
    return text
      ? {
          text,
          title: rendered.title,
        }
      : null;
  }
  const text = stripInvisibleUnicode(rendered.text) || stripInvisibleUnicode(rendered.title ?? "");
  return text
    ? {
        text,
        title: rendered.title,
      }
    : null;
}
//#endregion
export {
  truncateText as a,
  normalizeWhitespace as i,
  htmlToMarkdown as n,
  sanitizeHtml as o,
  markdownToText as r,
  stripInvisibleUnicode as s,
  extractBasicHtmlContent as t,
};
