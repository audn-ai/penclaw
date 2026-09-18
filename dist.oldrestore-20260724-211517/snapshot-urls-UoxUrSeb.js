import { Script } from "node:vm";
import "./string-coerce-runtime-BUe4iD0r.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
//#region extensions/browser/src/browser/evaluate-source.ts
const FUNCTION_SOURCE_PATTERN = /^(?:async\s+)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/;
const EXPRESSION_RESULT_NAME = "__openclawEvaluateExpressionResult";
function canParseAsExpression(source) {
  try {
    new Script(`"use strict";\n(${source});`);
    return true;
  } catch {
    return false;
  }
}
function normalizeBrowserEvaluateFunctionSource(source, params = {}) {
  const trimmed = source.trim();
  if (!trimmed) return "";
  if (FUNCTION_SOURCE_PATTERN.test(trimmed) && canParseAsExpression(trimmed)) return trimmed;
  const argumentName = params.argumentName;
  const args = argumentName ? `(${argumentName})` : "()";
  if (canParseAsExpression(trimmed)) {
    const invokeArgs = argumentName ? argumentName : "";
    return [
      `${args} => {`,
      `const ${EXPRESSION_RESULT_NAME} = (${trimmed});`,
      `return typeof ${EXPRESSION_RESULT_NAME} === "function" ? ${EXPRESSION_RESULT_NAME}(${invokeArgs}) : ${EXPRESSION_RESULT_NAME};`,
      "}",
    ].join("\n");
  }
  return `async ${args} => {\n${trimmed}\n}`;
}
//#endregion
//#region extensions/browser/src/browser/url-pattern.ts
/**
 * URL pattern matching for Browser response and wait tools.
 */
function wildcardPatternToRegExp(pattern) {
  let source = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index] ?? "";
    if (char === "*") {
      if (pattern[index + 1] === "*") {
        source += ".*";
        index += 1;
      } else source += "[^/]*";
      continue;
    }
    source += char.replace(/[\\^$+?.()|[\]{}]/gu, "\\$&");
  }
  source += "$";
  return new RegExp(source, "u");
}
/** Matches exact, wildcard, or substring URL patterns against a browser URL. */
function matchBrowserUrlPattern(pattern, url) {
  const trimmedPattern = pattern.trim();
  if (!trimmedPattern) return false;
  if (trimmedPattern === url) return true;
  if (trimmedPattern === "*") return true;
  if (trimmedPattern.includes("*")) return wildcardPatternToRegExp(trimmedPattern).test(url);
  return url.includes(trimmedPattern);
}
//#endregion
//#region extensions/browser/src/browser/form-fields.ts
/**
 * Browser form field normalization.
 *
 * Converts model/client fill field payloads into the compact field shape used
 * by Playwright and Chrome MCP fill actions.
 */
/** Default field type for fill actions when no type is provided. */
const DEFAULT_FILL_FIELD_TYPE = "text";
function normalizeBrowserFormFieldRef(value) {
  return normalizeOptionalString(value) ?? "";
}
function normalizeBrowserFormFieldType(value) {
  return (normalizeOptionalString(value) ?? "") || "text";
}
/** Normalize a form field value to the types accepted by fill actions. */
function normalizeBrowserFormFieldValue(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    ? value
    : void 0;
}
/** Normalize one form field descriptor from untrusted route/tool input. */
function normalizeBrowserFormField(record) {
  const ref = normalizeBrowserFormFieldRef(record.ref);
  if (!ref) return null;
  const type = normalizeBrowserFormFieldType(record.type);
  const value = normalizeBrowserFormFieldValue(record.value);
  return value === void 0
    ? {
        ref,
        type,
      }
    : {
        ref,
        type,
        value,
      };
}
//#endregion
//#region extensions/browser/src/browser/screenshot-annotate.ts
const ANNOTATION_OVERLAY_ATTR = "data-openclaw-labels";
const ANNOTATION_OVERLAY_ROOT_ID = "__openclaw-annotations__";
function refToNumber(ref) {
  const match = ref.match(/(\d+)/);
  if (!match) return 0;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : 0;
}
function planAnnotations(params) {
  const maxLabels = params.maxLabels ?? 150;
  if (params.space === "viewport" && !params.scroll)
    throw new Error("planAnnotations: scroll is required when space is 'viewport'");
  if (params.space === "element" && !params.elementRect)
    throw new Error("planAnnotations: elementRect is required when space is 'element'");
  let kept = params.inputs;
  if (params.space === "element" && params.elementRect) {
    const er = params.elementRect;
    kept = params.inputs.filter((input) => rectsOverlap(input.doc, er));
  }
  const viewportRect =
    params.space === "viewport" && params.scroll && params.viewport
      ? {
          x: params.scroll.x,
          y: params.scroll.y,
          width: params.viewport.width,
          height: params.viewport.height,
        }
      : void 0;
  const overlayItems = [];
  const annotations = [];
  let skipped = 0;
  for (const input of kept) {
    if (viewportRect && !rectsOverlap(input.doc, viewportRect)) {
      skipped += 1;
      annotations.push(toAnnotation(input, params));
      continue;
    }
    if (overlayItems.length >= maxLabels) {
      skipped += 1;
      continue;
    }
    overlayItems.push({
      ref: input.ref,
      x: input.doc.x,
      y: input.doc.y,
      w: input.doc.width,
      h: input.doc.height,
    });
    annotations.push(toAnnotation(input, params));
  }
  return {
    overlayItems,
    annotations,
    skipped,
  };
}
function toAnnotation(input, params) {
  return {
    ref: input.ref,
    number: refToNumber(input.ref),
    role: input.role,
    ...(input.name ? { name: input.name } : {}),
    box: projectBox(input.doc, params),
  };
}
function projectBox(doc, params) {
  if (params.space === "viewport") {
    const scroll = params.scroll;
    return {
      x: doc.x - scroll.x,
      y: doc.y - scroll.y,
      width: doc.width,
      height: doc.height,
    };
  }
  if (params.space === "element") {
    const er = params.elementRect;
    return {
      x: doc.x - er.x,
      y: doc.y - er.y,
      width: doc.width,
      height: doc.height,
    };
  }
  return {
    x: doc.x,
    y: doc.y,
    width: doc.width,
    height: doc.height,
  };
}
function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
function buildOverlayInjectionScript(params) {
  const itemsJson = JSON.stringify(
    params.items.map((it) => ({
      ref: it.ref,
      x: round(it.x),
      y: round(it.y),
      w: Math.max(1, round(it.w)),
      h: Math.max(1, round(it.h)),
    })),
  );
  const attr = ANNOTATION_OVERLAY_ATTR;
  const rootId = ANNOTATION_OVERLAY_ROOT_ID;
  return `(() => {
  var items = ${itemsJson};
  var captureY = ${Number.isFinite(params.captureY) ? round(params.captureY ?? 0) : 0};
  var existing = document.querySelectorAll("[${attr}]");
  for (var k = 0; k < existing.length; k++) existing[k].remove();
  var root = document.createElement("div");
  root.id = ${JSON.stringify(rootId)};
  root.setAttribute("${attr}", "1");
  root.style.cssText = "position:absolute;top:0;left:0;width:0;height:0;pointer-events:none;z-index:2147483647;font-family:'SF Mono','SFMono-Regular',Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;";
  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var box = document.createElement("div");
    box.setAttribute("${attr}", "1");
    box.style.cssText = "position:absolute;left:" + it.x + "px;top:" + it.y + "px;width:" + it.w + "px;height:" + it.h + "px;border:2px solid #ffb020;box-sizing:border-box;pointer-events:none;";
    var tag = document.createElement("div");
    tag.setAttribute("${attr}", "1");
    tag.textContent = String(it.ref);
    var relativeY = it.y - captureY;
    var labelTop = relativeY < 14 ? (it.y + 2) : (it.y - 14);
    tag.style.cssText = "position:absolute;left:" + it.x + "px;top:" + labelTop + "px;background:#ffb020;color:#1a1a1a;font:bold 11px/14px monospace;padding:0 4px;border-radius:2px;white-space:nowrap;pointer-events:none;";
    root.appendChild(box);
    root.appendChild(tag);
  }
  document.documentElement.appendChild(root);
  return true;
})();`;
}
function buildOverlayClearScript() {
  return `(() => {
  var existing = document.querySelectorAll("[${ANNOTATION_OVERLAY_ATTR}]");
  for (var k = 0; k < existing.length; k++) existing[k].remove();
  return true;
})();`;
}
/**
 * Scale annotation boxes by independent x/y factors. Used to keep annotation
 * coordinates aligned with the saved image after the response pipeline
 * resizes the screenshot (e.g. via normalizeBrowserScreenshot capping the
 * longest side or the byte budget). Returns a new array; inputs are not
 * mutated. When both factors are 1 the boxes are returned unchanged (modulo
 * structural copy) so callers can share the same code path for resized and
 * non-resized captures.
 */
function scaleAnnotations(items, scaleX, scaleY) {
  if (!Number.isFinite(scaleX) || !Number.isFinite(scaleY) || scaleX <= 0 || scaleY <= 0)
    return items.map((it) => ({
      ...it,
      box: { ...it.box },
    }));
  if (scaleX === 1 && scaleY === 1)
    return items.map((it) => ({
      ...it,
      box: { ...it.box },
    }));
  return items.map((it) => ({
    ...it,
    box: {
      x: round(it.box.x * scaleX),
      y: round(it.box.y * scaleY),
      width: Math.max(1, round(it.box.width * scaleX)),
      height: Math.max(1, round(it.box.height * scaleY)),
    },
  }));
}
function round(v) {
  return Math.round(v);
}
//#endregion
//#region extensions/browser/src/browser/snapshot-urls.ts
/** Appends a compact numbered link list to a snapshot string. */
function appendSnapshotUrls(snapshot, urls) {
  if (urls.length === 0) return snapshot;
  return `${snapshot}\n\nLinks:\n${urls.map((entry, index) => `${index + 1}. ${entry.text} -> ${entry.url}`).join("\n")}`;
}
//#endregion
export {
  scaleAnnotations as a,
  normalizeBrowserFormFieldValue as c,
  planAnnotations as i,
  matchBrowserUrlPattern as l,
  buildOverlayClearScript as n,
  DEFAULT_FILL_FIELD_TYPE as o,
  buildOverlayInjectionScript as r,
  normalizeBrowserFormField as s,
  appendSnapshotUrls as t,
  normalizeBrowserEvaluateFunctionSource as u,
};
