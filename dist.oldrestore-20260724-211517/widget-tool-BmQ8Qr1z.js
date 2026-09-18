import { createHash } from "node:crypto";
import { y as readStringParam } from "./common-DyDSUect.js";
import { a as resolveCanvasHostConfig } from "./config-BADy1gAK.js";
import "./channel-actions-C9vNf9jw.js";
import { n as createCanvasDocument } from "./documents-Ci9QsLkh.js";
import { t as escapeHtml } from "./text-utility-runtime-CJESZCN5.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import {
  n as SHOW_WIDGET_REQUIRED_CLIENT_CAPS,
  r as ShowWidgetToolSchema,
} from "./tool-schema-Cm4Rf8ES.js";
//#region extensions/canvas/src/widget-tool.ts
/** Agent-facing inline web chat widget tool. */
const WIDGET_CODE_MAX_CHARS = 262144;
var WidgetToolInputError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ToolInputError";
  }
};
function buildWidgetDocument(title, widgetCode) {
  const bodyClass = /^<svg/i.test(widgetCode) ? ' class="svg-widget"' : "";
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data:;"><title>${escapeHtml(title)}</title><style>:root{color-scheme:light dark}*{box-sizing:border-box}html,body{margin:0}body{font:14px system-ui,sans-serif}.svg-widget{display:grid;place-items:center}.svg-widget>svg{max-width:100%}</style></head><body${bodyClass}>${widgetCode}<script>(()=>{if(!window.parent||window.parent===window)return;let last=0;const report=()=>{const b=document.body;if(!b)return;const h=Math.ceil(Math.max(b.scrollHeight,b.offsetHeight,b.getBoundingClientRect().height));if(h&&h!==last){last=h;window.parent.postMessage({type:"openclaw:widget-size",height:h},"*");}};addEventListener('load',report);new ResizeObserver(report).observe(document.body);setTimeout(report,50);setTimeout(report,500);})();<\/script></body></html>`;
}
function resolveRetentionScope(options) {
  const scope = options.sessionId
    ? `session:${options.sessionId}`
    : `agent:${options.agentId ?? "default"}`;
  return createHash("sha256").update(scope).digest("hex");
}
/** Creates a self-contained widget hosted by the Canvas plugin. */
function createShowWidgetTool(options = {}) {
  return {
    label: "Show Widget",
    name: "show_widget",
    description:
      "Render self-contained SVG or HTML inline in web chat. Use for visual or interactive results; external resources are blocked, so inline all required code and data.",
    parameters: ShowWidgetToolSchema,
    requiredClientCaps: SHOW_WIDGET_REQUIRED_CLIENT_CAPS,
    execute: async (_toolCallId, args) => {
      const params = args;
      const title = readStringParam(params, "title", { required: true });
      const rawWidgetCode = readStringParam(params, "widget_code", {
        required: true,
        trim: false,
      });
      if (!rawWidgetCode.trim()) throw new WidgetToolInputError("widget_code required");
      if (rawWidgetCode.length > 262144)
        throw new WidgetToolInputError(
          `widget_code exceeds maximum size (${WIDGET_CODE_MAX_CHARS} characters)`,
        );
      const widgetCode = rawWidgetCode.trim();
      const canvasRootDir = resolveCanvasHostConfig({ config: options.config }).root;
      const document = await createCanvasDocument(
        {
          kind: "html_bundle",
          title,
          entrypoint: {
            type: "html",
            value: buildWidgetDocument(title, widgetCode),
          },
          surface: "assistant_message",
          retentionScope: resolveRetentionScope(options),
          cspSandbox: "scripts",
        },
        {
          stateDir: options.stateDir,
          canvasRootDir,
          maxDocumentsPerScope: 32,
        },
      );
      return jsonResult({
        kind: "canvas",
        presentation: {
          target: "assistant_message",
          title,
          sandbox: "scripts",
        },
        view: {
          id: document.id,
          url: document.entryUrl,
        },
        text: `Widget hosted at ${document.entryUrl}`,
      });
    },
  };
}
//#endregion
export { createShowWidgetTool };
