import { a as createLazyRuntimeSurface } from "../../lazy-runtime-B-Fc-m0I.js";
import {
  i as normalizeWhitespace,
  n as htmlToMarkdown,
  o as sanitizeHtml,
  s as stripInvisibleUnicode,
} from "../../web-fetch-utils-Pr5OiX35.js";
import "../../web-content-extractor-B_2il_5d.js";
//#region extensions/web-readability/web-content-extractor.ts
const READABILITY_MAX_HTML_CHARS = 1e6;
const READABILITY_MAX_ESTIMATED_NESTING_DEPTH = 3e3;
const HTML_VOID_TAGS = /* @__PURE__ */ new Set([
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
const READABILITY_MODULE = "@mozilla/readability";
const LINKEDOM_MODULE = "linkedom";
const loadReadabilityDeps = createLazyRuntimeSurface(
  () => Promise.all([import(READABILITY_MODULE), import(LINKEDOM_MODULE)]),
  ([readability, linkedom]) => ({
    Readability: readability.Readability,
    parseHTML: linkedom.parseHTML,
  }),
);
function exceedsEstimatedHtmlNestingDepth(html, maxDepth) {
  let depth = 0;
  const len = html.length;
  for (let i = 0; i < len; i++) {
    if (html.charCodeAt(i) !== 60) continue;
    const next = html.charCodeAt(i + 1);
    if (next === 33 || next === 63) continue;
    let j = i + 1;
    let closing = false;
    if (html.charCodeAt(j) === 47) {
      closing = true;
      j += 1;
    }
    while (j < len && html.charCodeAt(j) <= 32) j += 1;
    const nameStart = j;
    while (j < len) {
      const c = html.charCodeAt(j);
      if (
        !(
          (c >= 65 && c <= 90) ||
          (c >= 97 && c <= 122) ||
          (c >= 48 && c <= 57) ||
          c === 58 ||
          c === 45
        )
      )
        break;
      j += 1;
    }
    if (j === nameStart) continue;
    if (closing) {
      if (depth > 0) depth -= 1;
      continue;
    }
    const tagName = html.slice(nameStart, j).toLowerCase();
    if (HTML_VOID_TAGS.has(tagName)) continue;
    let selfClosing = false;
    for (let k = j; k < len && k < j + 200; k++)
      if (html.charCodeAt(k) === 62) {
        selfClosing = html.charCodeAt(k - 1) === 47;
        break;
      }
    if (selfClosing) continue;
    depth += 1;
    if (depth > maxDepth) return true;
  }
  return false;
}
async function extractWithReadability(request) {
  const cleanHtml = await sanitizeHtml(request.html);
  if (
    cleanHtml.length > READABILITY_MAX_HTML_CHARS ||
    exceedsEstimatedHtmlNestingDepth(cleanHtml, READABILITY_MAX_ESTIMATED_NESTING_DEPTH)
  )
    return null;
  try {
    const { Readability, parseHTML } = await loadReadabilityDeps();
    const { document } = parseHTML(cleanHtml, { location: { href: request.url } });
    const parsed = new Readability(document, { charThreshold: 0 }).parse();
    if (!parsed?.content) return null;
    const title = parsed.title || void 0;
    if (request.extractMode === "text") {
      const text = stripInvisibleUnicode(normalizeWhitespace(parsed.textContent ?? ""));
      return text
        ? {
            text,
            title,
          }
        : null;
    }
    const rendered = htmlToMarkdown(parsed.content);
    const text = stripInvisibleUnicode(rendered.text);
    return text
      ? {
          text,
          title: title ?? rendered.title,
        }
      : null;
  } catch {
    return null;
  }
}
function createReadabilityWebContentExtractor() {
  return {
    id: "readability",
    label: "Readability",
    autoDetectOrder: 10,
    extract: extractWithReadability,
  };
}
//#endregion
export { createReadabilityWebContentExtractor };
