import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { n as validateSupportedA2UIJsonl } from "./a2ui-jsonl-DeIxQ_ge.js";
import {
  n as normalizeCanvasSnapshotFileExtension,
  r as parseCanvasSnapshotPayload,
} from "./cli-helpers-7qZO9VAY.js";
import "./temp-path-DYqJUh96.js";
import "./agent-harness-runtime-BjY9gsEs.js";
import "./channel-actions-C9vNf9jw.js";
import "./param-readers-8wnI_A3p.js";
import {
  c as imageResultFromFile,
  f as readFiniteNumberParam,
  h as readPositiveIntegerParam,
  y as readStringParam,
} from "./common-DyDSUect.js";
import { t as callGatewayTool } from "./gateway-Dyh1k_4Q.js";
import { i as resolveNodeIdFromList, t as listNodes } from "./nodes-utils-CLhkTx8I.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-uPgNO8da.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as CanvasToolSchema } from "./tool-schema-Cm4Rf8ES.js";
//#region extensions/canvas/src/tool.ts
/**
 * Agent-facing Canvas tool implementation for node canvas commands and
 * snapshots.
 */
function readGatewayCallOptions(params) {
  return {
    gatewayUrl: readStringParam(params, "gatewayUrl", { trim: false }),
    gatewayToken: readStringParam(params, "gatewayToken", { trim: false }),
    timeoutMs: readPositiveIntegerParam(params, "timeoutMs"),
  };
}
async function resolveNodeId(opts, query, allowDefault = false) {
  return resolveNodeIdFromList(await listNodes(opts), query, allowDefault);
}
async function writeBase64ToTempFile(params) {
  const dir = resolvePreferredOpenClawTmpDir();
  await fs.mkdir(dir, {
    recursive: true,
    mode: 448,
  });
  const ext = `.${normalizeCanvasSnapshotFileExtension(params.ext)}`;
  const filePath = path.join(dir, `openclaw-canvas-snapshot-${randomUUID()}${ext}`);
  await fs.writeFile(filePath, Buffer.from(params.base64, "base64"));
  return filePath;
}
function isPathInsideRoot(root, candidate) {
  const relative = path.relative(root, candidate);
  return (
    relative === "" || (relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative))
  );
}
async function readJsonlFromPath(jsonlPath, workspaceDir) {
  const trimmed = jsonlPath.trim();
  if (!trimmed) return "";
  const workspaceRoot = path.resolve(workspaceDir ?? process.cwd());
  const resolved = path.resolve(workspaceRoot, trimmed);
  const [workspaceReal, resolvedReal] = await Promise.all([
    fs.realpath(workspaceRoot),
    fs.realpath(resolved),
  ]);
  if (!isPathInsideRoot(workspaceReal, resolvedReal))
    throw new Error("jsonlPath outside workspace");
  return await fs.readFile(resolvedReal, "utf8");
}
function resolveCanvasImageSanitizationLimits(config) {
  const configured = config?.agents?.defaults?.imageMaxDimensionPx;
  if (typeof configured !== "number" || !Number.isFinite(configured)) return {};
  return { maxDimensionPx: Math.max(1, Math.floor(configured)) };
}
/** Creates the model-facing Canvas tool used to invoke paired node canvas commands. */
function createCanvasTool(options) {
  const imageSanitization = resolveCanvasImageSanitizationLimits(options?.config);
  return {
    label: "Canvas",
    name: "canvas",
    description:
      "Control node canvases (present/hide/navigate/eval/snapshot/A2UI). Use snapshot to capture the rendered UI.",
    parameters: CanvasToolSchema,
    execute: async (_toolCallId, args) => {
      const params = args;
      const action = readStringParam(params, "action", { required: true });
      const gatewayOpts = readGatewayCallOptions(params);
      const nodeQuery = readStringParam(params, "node", { trim: true });
      const invoke = async (command, invokeParams) => {
        const nodeId = await resolveNodeId(gatewayOpts, nodeQuery, true);
        return await callGatewayTool("node.invoke", gatewayOpts, {
          nodeId,
          command,
          params: invokeParams,
          idempotencyKey: randomUUID(),
        });
      };
      switch (action) {
        case "present": {
          const placement = {
            x: readFiniteNumberParam(params, "x"),
            y: readFiniteNumberParam(params, "y"),
            width: readFiniteNumberParam(params, "width"),
            height: readFiniteNumberParam(params, "height"),
          };
          const invokeParams = {};
          const presentTarget =
            readStringParam(params, "target", { trim: true }) ??
            readStringParam(params, "url", { trim: true });
          if (presentTarget) invokeParams.url = presentTarget;
          if (
            Number.isFinite(placement.x) ||
            Number.isFinite(placement.y) ||
            Number.isFinite(placement.width) ||
            Number.isFinite(placement.height)
          )
            invokeParams.placement = placement;
          await invoke("canvas.present", invokeParams);
          return jsonResult({ ok: true });
        }
        case "hide":
          await invoke("canvas.hide", void 0);
          return jsonResult({ ok: true });
        case "navigate":
          await invoke("canvas.navigate", {
            url:
              readStringParam(params, "url", { trim: true }) ??
              readStringParam(params, "target", {
                required: true,
                trim: true,
                label: "url",
              }),
          });
          return jsonResult({ ok: true });
        case "eval": {
          const result = (
            await invoke("canvas.eval", {
              javaScript: readStringParam(params, "javaScript", { required: true }),
            })
          )?.payload?.result;
          if (typeof result === "string")
            return {
              content: [
                {
                  type: "text",
                  text: result,
                },
              ],
              details: { result },
            };
          return jsonResult({ ok: true });
        }
        case "snapshot": {
          const formatRaw =
            typeof params.outputFormat === "string" && params.outputFormat.trim()
              ? params.outputFormat.trim().toLowerCase()
              : "png";
          const payload = parseCanvasSnapshotPayload(
            (
              await invoke("canvas.snapshot", {
                format: formatRaw === "jpg" || formatRaw === "jpeg" ? "jpeg" : "png",
                maxWidth: readPositiveIntegerParam(params, "maxWidth"),
                quality: readFiniteNumberParam(params, "quality", {
                  min: 0,
                  max: 1,
                }),
              })
            )?.payload,
          );
          return await imageResultFromFile({
            label: "canvas:snapshot",
            path: await writeBase64ToTempFile({
              base64: payload.base64,
              ext: payload.format === "jpeg" ? "jpg" : payload.format,
            }),
            details: { format: payload.format },
            imageSanitization,
          });
        }
        case "a2ui_push": {
          const jsonl =
            typeof params.jsonl === "string" && params.jsonl.trim()
              ? params.jsonl
              : typeof params.jsonlPath === "string" && params.jsonlPath.trim()
                ? await readJsonlFromPath(params.jsonlPath, options?.workspaceDir)
                : "";
          if (!jsonl.trim()) throw new Error("jsonl or jsonlPath required");
          validateSupportedA2UIJsonl(jsonl);
          await invoke("canvas.a2ui.pushJSONL", { jsonl });
          return jsonResult({ ok: true });
        }
        case "a2ui_reset":
          await invoke("canvas.a2ui.reset", void 0);
          return jsonResult({ ok: true });
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    },
  };
}
//#endregion
export { createCanvasTool };
