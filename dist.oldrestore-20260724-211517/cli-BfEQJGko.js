import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { n as validateSupportedA2UIJsonl, t as buildA2UITextJsonl } from "./a2ui-jsonl-DeIxQ_ge.js";
import {
  r as parseCanvasSnapshotPayload,
  t as canvasSnapshotTempPath,
} from "./cli-helpers-7qZO9VAY.js";
import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { n as callGatewayFromCli } from "./gateway-rpc-DpocbsVi.js";
import "./error-runtime-BIAwr399.js";
import "./number-runtime-B-n-wjMn.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as resolveNodeFromNodeList } from "./node-resolve-CFpfmgWj.js";
import "./runtime-B8Mnd0UO.js";
import "./gateway-runtime-IrTdjV5_.js";
import {
  _ as parseStrictFiniteNumber,
  b as parseStrictPositiveInteger,
} from "./number-coercion-CJQ8TR--.js";
import "./cli-runtime-B2OG9Kfj.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { h as shortenHomePath } from "./utils-DtcDeqWS.js";
//#region extensions/canvas/src/cli.ts
/**
 * Canvas node CLI command registration and runtime dependency wiring.
 */
function parseCanvasSnapshotRequestFormat(raw) {
  switch (normalizeLowercaseStringOrEmpty(normalizeOptionalString(raw) ?? "jpg")) {
    case "png":
      return "png";
    case "jpg":
    case "jpeg":
      return "jpeg";
    default:
      throw new Error(`invalid format: ${String(raw)} (expected png|jpg|jpeg)`);
  }
}
function parseTimeoutMs(raw) {
  if (raw === void 0 || raw === null) return;
  const parsed = parseStrictPositiveInteger(raw);
  if (parsed === void 0) throw new Error("--invoke-timeout must be a positive integer.");
  return parsed;
}
function parseCanvasPositiveIntOption(raw, flag) {
  if (!raw) return;
  const parsed = parseStrictPositiveInteger(raw);
  if (parsed === void 0) throw new Error(`${flag} must be a positive integer.`);
  return parsed;
}
function parseCanvasFiniteNumberOption(raw, flag) {
  if (!raw) return;
  const parsed = parseStrictFiniteNumber(raw);
  if (parsed === void 0) throw new Error(`${flag} must be a number.`);
  return parsed;
}
function parseCanvasSnapshotQualityOption(raw) {
  const parsed = parseCanvasFiniteNumberOption(raw, "--quality");
  if (parsed !== void 0 && (parsed < 0 || parsed > 1))
    throw new Error("--quality must be between 0 and 1.");
  return parsed;
}
function parseNodeCandidates(raw) {
  const payload = raw && typeof raw === "object" ? raw : {};
  return (
    Array.isArray(payload.nodes)
      ? payload.nodes
      : Array.isArray(payload.paired)
        ? payload.paired
        : []
  )
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const node = entry;
      if (typeof node.nodeId !== "string") return null;
      const candidate = { nodeId: node.nodeId };
      if (typeof node.displayName === "string") candidate.displayName = node.displayName;
      if (typeof node.remoteIp === "string") candidate.remoteIp = node.remoteIp;
      if (typeof node.connected === "boolean") candidate.connected = node.connected;
      if (typeof node.clientId === "string") candidate.clientId = node.clientId;
      return candidate;
    })
    .filter((entry) => entry !== null);
}
function unauthorizedHintForMessage(message) {
  const haystack = normalizeLowercaseStringOrEmpty(message);
  if (
    haystack.includes("unauthorizedclient") ||
    haystack.includes("bridge client is not authorized") ||
    haystack.includes("unsigned bridge clients are not allowed")
  )
    return [
      "peekaboo bridge rejected the client.",
      "sign the peekaboo CLI (TeamID Y5PE65HELJ) or launch the host with",
      "PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS=1 for local dev.",
    ].join(" ");
  return null;
}
/** Creates the default Canvas CLI dependency bundle backed by the OpenClaw gateway CLI. */
function createDefaultCanvasCliDependencies() {
  const nodesCallOpts = (cmd, defaults) =>
    cmd
      .option(
        "--url <url>",
        "Gateway WebSocket URL (defaults to gateway.remote.url when configured)",
      )
      .option("--token <token>", "Gateway token (if required)")
      .option("--timeout <ms>", "Timeout in ms", String(defaults?.timeoutMs ?? 1e4))
      .option("--json", "Output JSON", false);
  const callGatewayCli = async (method, opts, params, callOpts) => {
    const timeout = String(callOpts?.transportTimeoutMs ?? opts.timeout ?? 1e4);
    return await callGatewayFromCli(
      method,
      {
        ...opts,
        timeout,
      },
      params,
      { progress: opts.json !== true },
    );
  };
  return {
    defaultRuntime,
    nodesCallOpts,
    runNodesCommand: (label, action) =>
      runCommandWithRuntime(defaultRuntime, action, (err) => {
        const message = formatErrorMessage(err);
        defaultRuntime.error(theme.error(`nodes ${label} failed: ${message}`));
        const hint = unauthorizedHintForMessage(message);
        if (hint) defaultRuntime.error(theme.warn(hint));
        defaultRuntime.exit(1);
      }),
    getNodesTheme: () => ({ ok: theme.success }),
    parseTimeoutMs,
    resolveNodeId: async (opts, query) => {
      let raw;
      try {
        raw = await callGatewayCli("node.list", opts, {});
      } catch {
        raw = await callGatewayCli("node.pair.list", opts, {});
      }
      return resolveNodeFromNodeList(parseNodeCandidates(raw), query).nodeId;
    },
    buildNodeInvokeParams: ({ nodeId, command, params, timeoutMs }) => ({
      nodeId,
      command,
      params,
      idempotencyKey: randomUUID(),
      ...(typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? { timeoutMs } : {}),
    }),
    callGatewayCli,
    writeBase64ToFile: async (filePath, base64) =>
      await fs.writeFile(filePath, Buffer.from(base64, "base64")),
    shortenHomePath,
  };
}
async function invokeCanvas(deps, opts, command, params) {
  const timeoutMs = deps.parseTimeoutMs(opts.invokeTimeout);
  const nodeId = await deps.resolveNodeId(opts, normalizeOptionalString(opts.node) ?? "");
  return await deps.callGatewayCli(
    "node.invoke",
    opts,
    deps.buildNodeInvokeParams({
      nodeId,
      command,
      params,
      timeoutMs: typeof timeoutMs === "number" ? timeoutMs : void 0,
    }),
  );
}
/** Registers Canvas subcommands under the nodes CLI command group. */
function registerNodesCanvasCommands(nodes, deps) {
  const canvas = nodes
    .command("canvas")
    .description("Capture or render canvas content from a paired node");
  deps.nodesCallOpts(
    canvas
      .command("snapshot")
      .description("Capture a canvas snapshot (prints the saved path)")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--format <png|jpg|jpeg>", "Image format", "jpg")
      .option("--max-width <px>", "Max width in px (optional)")
      .option("--quality <0-1>", "JPEG quality (optional)")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms (default 20000)", "20000")
      .action(async (opts) => {
        await deps.runNodesCommand("canvas snapshot", async () => {
          const format = parseCanvasSnapshotRequestFormat(opts.format);
          const maxWidth = parseCanvasPositiveIntOption(opts.maxWidth, "--max-width");
          const quality = parseCanvasSnapshotQualityOption(opts.quality);
          const raw = await invokeCanvas(deps, opts, "canvas.snapshot", {
            format,
            maxWidth: Number.isFinite(maxWidth) ? maxWidth : void 0,
            quality: Number.isFinite(quality) ? quality : void 0,
          });
          const payload = parseCanvasSnapshotPayload(
            (typeof raw === "object" && raw !== null ? raw : {}).payload,
          );
          const filePath = canvasSnapshotTempPath({
            ext: payload.format === "jpeg" ? "jpg" : payload.format,
          });
          await deps.writeBase64ToFile(filePath, payload.base64);
          if (opts.json) {
            deps.defaultRuntime.writeJson({
              file: {
                path: filePath,
                format: payload.format,
              },
            });
            return;
          }
          deps.defaultRuntime.log(deps.shortenHomePath(filePath));
        });
      }),
    { timeoutMs: 6e4 },
  );
  deps.nodesCallOpts(
    canvas
      .command("present")
      .description("Show the canvas (optionally with a target URL/path)")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--target <urlOrPath>", "Target URL/path (optional)")
      .option("--x <px>", "Placement x coordinate")
      .option("--y <px>", "Placement y coordinate")
      .option("--width <px>", "Placement width")
      .option("--height <px>", "Placement height")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
      .action(async (opts) => {
        await deps.runNodesCommand("canvas present", async () => {
          const placement = {
            x: parseCanvasFiniteNumberOption(opts.x, "--x"),
            y: parseCanvasFiniteNumberOption(opts.y, "--y"),
            width: parseCanvasFiniteNumberOption(opts.width, "--width"),
            height: parseCanvasFiniteNumberOption(opts.height, "--height"),
          };
          const params = {};
          if (opts.target) params.url = opts.target;
          if (
            Number.isFinite(placement.x) ||
            Number.isFinite(placement.y) ||
            Number.isFinite(placement.width) ||
            Number.isFinite(placement.height)
          )
            params.placement = placement;
          await invokeCanvas(deps, opts, "canvas.present", params);
          if (!opts.json) {
            const { ok } = deps.getNodesTheme();
            deps.defaultRuntime.log(ok("canvas present ok"));
          }
        });
      }),
  );
  deps.nodesCallOpts(
    canvas
      .command("hide")
      .description("Hide the canvas")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
      .action(async (opts) => {
        await deps.runNodesCommand("canvas hide", async () => {
          await invokeCanvas(deps, opts, "canvas.hide", void 0);
          if (!opts.json) {
            const { ok } = deps.getNodesTheme();
            deps.defaultRuntime.log(ok("canvas hide ok"));
          }
        });
      }),
  );
  deps.nodesCallOpts(
    canvas
      .command("navigate")
      .description("Navigate the canvas to a URL")
      .argument("<url>", "Target URL/path")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
      .action(async (url, opts) => {
        await deps.runNodesCommand("canvas navigate", async () => {
          await invokeCanvas(deps, opts, "canvas.navigate", { url });
          if (!opts.json) {
            const { ok } = deps.getNodesTheme();
            deps.defaultRuntime.log(ok("canvas navigate ok"));
          }
        });
      }),
  );
  deps.nodesCallOpts(
    canvas
      .command("eval")
      .description("Evaluate JavaScript in the canvas")
      .argument("[js]", "JavaScript to evaluate")
      .option("--js <code>", "JavaScript to evaluate")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
      .action(async (jsArg, opts) => {
        await deps.runNodesCommand("canvas eval", async () => {
          const js = opts.js ?? jsArg;
          if (!js) throw new Error("missing --js or <js>");
          const raw = await invokeCanvas(deps, opts, "canvas.eval", { javaScript: js });
          if (opts.json) {
            deps.defaultRuntime.writeJson(raw);
            return;
          }
          const payload = typeof raw === "object" && raw !== null ? raw.payload : void 0;
          if (typeof payload?.result === "string") deps.defaultRuntime.log(payload.result);
          else {
            const { ok } = deps.getNodesTheme();
            deps.defaultRuntime.log(ok("canvas eval ok"));
          }
        });
      }),
  );
  const a2ui = canvas.command("a2ui").description("Render A2UI content on the canvas");
  deps.nodesCallOpts(
    a2ui
      .command("push")
      .description("Push A2UI JSONL to the canvas")
      .option("--jsonl <path>", "Path to JSONL payload")
      .option("--text <text>", "Render a quick A2UI text payload")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
      .action(async (opts) => {
        await deps.runNodesCommand("canvas a2ui push", async () => {
          const hasJsonl = Boolean(opts.jsonl);
          const hasText = typeof opts.text === "string";
          if (hasJsonl === hasText) throw new Error("provide exactly one of --jsonl or --text");
          const jsonl = hasText
            ? buildA2UITextJsonl(opts.text ?? "")
            : await fs.readFile(String(opts.jsonl), "utf8");
          const { messageCount } = validateSupportedA2UIJsonl(jsonl);
          await invokeCanvas(deps, opts, "canvas.a2ui.pushJSONL", { jsonl });
          if (!opts.json) {
            const { ok } = deps.getNodesTheme();
            deps.defaultRuntime.log(
              ok(
                `canvas a2ui push ok (v0.8, ${messageCount} message${messageCount === 1 ? "" : "s"})`,
              ),
            );
          }
        });
      }),
  );
  deps.nodesCallOpts(
    a2ui
      .command("reset")
      .description("Reset A2UI renderer state")
      .requiredOption("--node <idOrNameOrIp>", "Node id, name, or IP")
      .option("--invoke-timeout <ms>", "Node invoke timeout in ms")
      .action(async (opts) => {
        await deps.runNodesCommand("canvas a2ui reset", async () => {
          await invokeCanvas(deps, opts, "canvas.a2ui.reset", void 0);
          if (!opts.json) {
            const { ok } = deps.getNodesTheme();
            deps.defaultRuntime.log(ok("canvas a2ui reset ok"));
          }
        });
      }),
  );
}
//#endregion
export { registerNodesCanvasCommands as n, createDefaultCanvasCliDependencies as t };
