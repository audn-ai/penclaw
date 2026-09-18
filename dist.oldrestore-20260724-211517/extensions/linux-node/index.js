import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { n as buildPluginConfigSchema } from "../../config-schema-D48VtTjI.js";
import "../../temp-path-DYqJUh96.js";
import { r as runCommandWithTimeout } from "../../exec-CXKmx4dL.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import "../../process-runtime-BKNTr1ic.js";
import { r as withTempWorkspace } from "../../private-temp-workspace-BrSGWjaU.js";
import { At as boolean, Ln as strictObject } from "../../schemas-CBJjibl3.js";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/linux-node/src/config.ts
const CapabilityConfigSchema = strictObject({ enabled: boolean().optional() });
const LinuxNodePluginConfigSchema = strictObject({
  notify: CapabilityConfigSchema.optional(),
  camera: CapabilityConfigSchema.optional(),
  location: CapabilityConfigSchema.optional(),
});
function createLinuxNodePluginConfigSchema() {
  return buildPluginConfigSchema(LinuxNodePluginConfigSchema, {
    uiHints: {
      "notify.enabled": {
        label: "Desktop Notifications",
        help: "Expose system.notify when notify-send is installed. Enabled by default.",
      },
      "camera.enabled": {
        label: "Camera",
        help: "Expose camera commands when FFmpeg is installed. Requires a node service restart.",
      },
      "location.enabled": {
        label: "Location",
        help: "Expose location.get when the GeoClue where-am-i demo is installed. Requires a node service restart.",
      },
    },
  });
}
function resolveLinuxNodePluginConfig(value) {
  const parsed = LinuxNodePluginConfigSchema.safeParse(value ?? {});
  if (!parsed.success)
    throw new Error(
      `Invalid linux-node plugin config: ${parsed.error.issues[0]?.message ?? "invalid config"}`,
    );
  return {
    notify: { enabled: parsed.data.notify?.enabled ?? true },
    camera: { enabled: parsed.data.camera?.enabled ?? false },
    location: { enabled: parsed.data.location?.enabled ?? false },
  };
}
function resolveLinuxNodePluginConfigFromHost(config) {
  try {
    return resolveLinuxNodePluginConfig(config.plugins?.entries?.["linux-node"]?.config);
  } catch {
    return null;
  }
}
//#endregion
//#region extensions/linux-node/src/command-utils.ts
function parseParams(paramsJSON) {
  if (!paramsJSON) return {};
  try {
    const parsed = JSON.parse(paramsJSON);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}
function readFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}
function formatToolError(result) {
  const detail = result.stderr.trim() || result.stdout.trim();
  return detail
    ? detail.replaceAll(/\s+/gu, " ").slice(0, 300)
    : `exit ${result.code ?? "unknown"}`;
}
function assertToolResult(result, code) {
  if (result.termination === "timeout" || result.termination === "no-output-timeout")
    throw new Error(`${code}: command timed out`);
  if (result.code !== 0) throw new Error(`${code}: ${formatToolError(result)}`);
}
function isCapabilityEnabledForHost(context, capability) {
  return resolveLinuxNodePluginConfigFromHost(context.config)?.[capability].enabled === true;
}
//#endregion
//#region extensions/linux-node/src/executables.ts
function createCachedExecutableResolver(
  isExecutable = (candidate) => {
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      return true;
    } catch {
      return false;
    }
  },
) {
  const cache = /* @__PURE__ */ new Map();
  return (command, env, extraCandidates = []) => {
    const pathValue = env.PATH ?? "";
    const key = `${command}\0${pathValue}\0${extraCandidates.join("\0")}`;
    if (cache.has(key)) return cache.get(key) ?? null;
    const pathCandidates = pathValue
      .split(path.delimiter)
      .filter(Boolean)
      .map((dir) => path.join(dir, command));
    const found =
      (path.isAbsolute(command) ? [command] : [...pathCandidates, ...extraCandidates]).find(
        isExecutable,
      ) ?? null;
    cache.set(key, found);
    return found;
  };
}
const resolveExecutable = createCachedExecutableResolver();
//#endregion
//#region extensions/linux-node/src/location.ts
const GEOCLUE_DEMO_PATHS = [
  "/usr/libexec/geoclue-2.0/demos/where-am-i",
  "/usr/lib/geoclue-2.0/demos/where-am-i",
];
const GEOCLUE_TIMESTAMP_RESOLUTION_MS = 1e3;
function isLocationDisabledOutput(output) {
  return /Geolocation disabled|disallowed, no agent|AccessDenied|not authorized/iu.test(output);
}
function parseLocationOutput(output, now, maxAgeMs) {
  const blocks = output.split(/\nNew location:\s*\n/gu);
  for (const block of blocks.toReversed()) {
    const latitude = /Latitude:\s*([-+\d.]+)/u.exec(block)?.[1];
    const longitude = /Longitude:\s*([-+\d.]+)/u.exec(block)?.[1];
    const accuracy = /Accuracy:\s*([-+\d.]+)/u.exec(block)?.[1];
    if (latitude === void 0 || longitude === void 0 || accuracy === void 0) continue;
    const lat = Number(latitude);
    const lon = Number(longitude);
    const accuracyMeters = Number(accuracy);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      !Number.isFinite(accuracyMeters) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180 ||
      accuracyMeters < 0
    )
      continue;
    const epochSeconds = /\((\d+)\s+seconds since the Epoch\)/u.exec(block)?.[1];
    const altitude = /Altitude:\s*([-+\d.]+)/u.exec(block)?.[1];
    const speed = /Speed:\s*([-+\d.]+)/u.exec(block)?.[1];
    const heading = /Heading:\s*([-+\d.]+)/u.exec(block)?.[1];
    const timestamp = epochSeconds
      ? /* @__PURE__ */ new Date(Number(epochSeconds) * 1e3).toISOString()
      : now().toISOString();
    if (
      maxAgeMs !== void 0 &&
      now().getTime() - Date.parse(timestamp) >= maxAgeMs + GEOCLUE_TIMESTAMP_RESOLUTION_MS
    )
      continue;
    return {
      lat,
      lon,
      accuracyMeters,
      ...(altitude !== void 0 ? { altitudeMeters: Number(altitude) } : {}),
      ...(speed !== void 0 ? { speedMps: Number(speed) } : {}),
      ...(heading !== void 0 ? { headingDeg: Number(heading) } : {}),
      timestamp,
    };
  }
  return null;
}
function createLinuxLocationCommand(deps) {
  const findWhereAmI = (env = deps.env) =>
    deps.resolveExecutable("where-am-i", env, GEOCLUE_DEMO_PATHS);
  return {
    command: "location.get",
    cap: "location",
    isAvailable: (context) =>
      deps.platform === "linux" &&
      isCapabilityEnabledForHost(context, "location") &&
      findWhereAmI(context.env) !== null,
    handle: async (paramsJSON) => {
      if (deps.platform !== "linux") throw new Error("LOCATION_DISABLED: Linux node host required");
      if (!deps.config.location.enabled)
        throw new Error(
          "LOCATION_DISABLED: enable plugins.entries.linux-node.config.location.enabled and restart the node service",
        );
      const whereAmI = findWhereAmI();
      if (!whereAmI) throw new Error("LOCATION_UNAVAILABLE: where-am-i not found");
      const params = parseParams(paramsJSON);
      const timeoutMs = clamp(Math.floor(readFiniteNumber(params.timeoutMs) ?? 1e4), 1e3, 6e4);
      const maxAgeMsRaw = readFiniteNumber(params.maxAgeMs);
      const maxAgeMs = maxAgeMsRaw !== void 0 && maxAgeMsRaw >= 0 ? maxAgeMsRaw : void 0;
      const desiredAccuracy =
        params.desiredAccuracy === "coarse" ? 4 : params.desiredAccuracy === "precise" ? 8 : 6;
      let streamedOutput = "";
      let observedTimestamps = 0;
      const result = await deps.runCommand(
        [whereAmI, "-t", String(Math.ceil(timeoutMs / 1e3)), "-a", String(desiredAccuracy)],
        {
          timeoutMs: timeoutMs + 3e3,
          maxOutputBytes: {
            stdout: 64 * 1024,
            stderr: 16 * 1024,
          },
          outputCapture: "tail",
          env: {
            LC_ALL: "C",
            LANG: "C",
          },
          onOutputChunk: (chunk, stream) => {
            if (stream !== "stdout") return true;
            streamedOutput = `${streamedOutput}${chunk.toString("utf8")}`.slice(-64 * 1024);
            if (isLocationDisabledOutput(streamedOutput)) return false;
            const timestampCount = [
              ...streamedOutput.matchAll(/Timestamp:\s*.*seconds since the Epoch\)/gu),
            ].length;
            if (timestampCount === observedTimestamps) return true;
            observedTimestamps = timestampCount;
            return parseLocationOutput(streamedOutput, deps.now, maxAgeMs) === null;
          },
        },
      );
      if (isLocationDisabledOutput(`${result.stdout}\n${result.stderr}\n${streamedOutput}`))
        throw new Error("LOCATION_DISABLED: GeoClue location services are disabled");
      const location = parseLocationOutput(
        `${result.stdout}\n${streamedOutput}`,
        deps.now,
        maxAgeMs,
      );
      if (!location) {
        if (result.termination === "timeout" || result.code === 0)
          throw new Error("LOCATION_TIMEOUT: no fix in time");
        throw new Error(`LOCATION_UNAVAILABLE: ${formatToolError(result)}`);
      }
      return JSON.stringify({
        ...location,
        isPrecise: location.accuracyMeters <= 100,
        source: "unknown",
      });
    },
  };
}
//#endregion
//#region extensions/linux-node/src/commands.ts
const MAX_BASE64_BYTES = 25 * 1024 * 1024 - 64 * 1024;
const MAX_MEDIA_RAW_BYTES = Math.floor(MAX_BASE64_BYTES / 4) * 3;
function encodeMedia(buffer) {
  if (buffer.byteLength > MAX_MEDIA_RAW_BYTES)
    throw new Error("PAYLOAD_TOO_LARGE: camera payload exceeds the 25 MB base64 limit");
  const base64 = buffer.toString("base64");
  if (Buffer.byteLength(base64, "ascii") > MAX_BASE64_BYTES)
    throw new Error("PAYLOAD_TOO_LARGE: camera payload exceeds the 25 MB base64 limit");
  return base64;
}
function readJpegDimensions(buffer) {
  if (buffer.byteLength < 4 || buffer[0] !== 255 || buffer[1] !== 216) return null;
  let offset = 2;
  while (offset + 9 < buffer.byteLength) {
    if (buffer[offset] !== 255) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    if (marker === void 0) return null;
    if (marker === 255) {
      offset += 1;
      continue;
    }
    if (marker === 217 || marker === 218) return null;
    const segmentLength = buffer.readUInt16BE(offset + 2);
    if (
      ((marker >= 192 && marker <= 195) ||
        (marker >= 197 && marker <= 199) ||
        (marker >= 201 && marker <= 203) ||
        (marker >= 205 && marker <= 207)) &&
      segmentLength >= 7
    )
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    if (segmentLength < 2) return null;
    offset += segmentLength + 2;
  }
  return null;
}
async function listLinuxVideoDevices(params) {
  const deviceNames = (await (params.listEntries ?? (() => fs$1.readdir("/dev")))().catch(() => []))
    .filter((entry) => /^video\d+$/u.test(entry))
    .toSorted((left, right) => left.localeCompare(right, "en", { numeric: true }));
  const devices = [];
  for (const entry of deviceNames) {
    const id = path.join("/dev", entry);
    const probe = await params.runCommand(
      [params.ffmpeg, "-hide_banner", "-f", "v4l2", "-list_formats", "all", "-i", id],
      {
        timeoutMs: 5e3,
        maxOutputBytes: {
          stdout: 4096,
          stderr: 64 * 1024,
        },
        outputCapture: "tail",
      },
    );
    if (!/\b(?:Raw|Compressed)\s*:/u.test(`${probe.stdout}\n${probe.stderr}`)) continue;
    const name = await (
      params.readDeviceName ??
      (async (deviceEntry) =>
        await fs$1.readFile(path.join("/sys/class/video4linux", deviceEntry, "name"), "utf8"))
    )(entry)
      .then((value) => value.trim())
      .catch(() => entry);
    devices.push({
      id,
      name,
      position: "unknown",
      deviceType: "v4l2",
    });
  }
  return devices;
}
async function defaultWithTempFile(suffix, run) {
  return await withTempWorkspace(
    {
      rootDir: resolvePreferredOpenClawTmpDir(),
      prefix: "openclaw-linux-node-",
    },
    async ({ dir }) => await run(path.join(dir, `capture${suffix}`)),
  );
}
function createLinuxNodeCommands(deps) {
  const platform = deps.platform ?? process.platform;
  const env = deps.env ?? process.env;
  const findExecutable = deps.resolveExecutable ?? resolveExecutable;
  const runCommand = deps.runCommand ?? runCommandWithTimeout;
  const readFile = deps.readFile ?? fs$1.readFile;
  const statFile = deps.statFile ?? fs$1.stat;
  const withTempFile = deps.withTempFile ?? defaultWithTempFile;
  const now = deps.now ?? (() => /* @__PURE__ */ new Date());
  const findTool = (name, candidateEnv = env) => findExecutable(name, candidateEnv);
  const listVideoDevices =
    deps.listVideoDevices ??
    (async () => {
      const ffmpeg = findTool("ffmpeg");
      return ffmpeg
        ? await listLinuxVideoDevices({
            ffmpeg,
            runCommand,
          })
        : [];
    });
  const readMedia = async (filePath) => {
    if ((await statFile(filePath)).size > MAX_MEDIA_RAW_BYTES)
      throw new Error("PAYLOAD_TOO_LARGE: camera payload exceeds the 25 MB base64 limit");
    return await readFile(filePath);
  };
  const assertLinuxCapability = (capability, code) => {
    if (platform !== "linux") throw new Error(`${code}: Linux node host required`);
    if (!deps.config[capability].enabled)
      throw new Error(
        `${code}: enable plugins.entries.linux-node.config.${capability}.enabled and restart the node service`,
      );
  };
  const isAvailable = (capability, tool) => (context) =>
    platform === "linux" &&
    isCapabilityEnabledForHost(context, capability) &&
    findTool(tool, context.env) !== null;
  const resolveTool = (capability, tool, disabledCode, unavailableCode) => {
    assertLinuxCapability(capability, disabledCode);
    const executable = findTool(tool);
    if (!executable) throw new Error(`${unavailableCode}: ${tool} not found`);
    return executable;
  };
  const selectVideoDevice = async (deviceId) => {
    const devices = await listVideoDevices();
    if (typeof deviceId === "string" && deviceId.trim()) {
      const match = devices.find((device) => device.id === deviceId.trim());
      if (!match) throw new Error(`INVALID_REQUEST: camera device not found: ${deviceId.trim()}`);
      return match;
    }
    const device = devices[0];
    if (!device) throw new Error("CAMERA_UNAVAILABLE: no V4L2 camera devices found");
    return device;
  };
  return [
    {
      command: "system.notify",
      isAvailable: isAvailable("notify", "notify-send"),
      handle: async (paramsJSON) => {
        const notifySend = resolveTool(
          "notify",
          "notify-send",
          "NOTIFICATIONS_DISABLED",
          "NOTIFICATIONS_UNAVAILABLE",
        );
        const params = parseParams(paramsJSON);
        const title = typeof params.title === "string" ? params.title.trim() : "";
        const body = typeof params.body === "string" ? params.body.trim() : "";
        if (!title && !body) throw new Error("INVALID_REQUEST: empty notification");
        const urgency =
          params.priority === "passive"
            ? "low"
            : params.priority === "timeSensitive"
              ? "critical"
              : "normal";
        assertToolResult(
          await runCommand([notifySend, "--urgency", urgency, "--", title, body], {
            timeoutMs: 1e4,
          }),
          "NOTIFICATIONS_UNAVAILABLE",
        );
        return JSON.stringify({ ok: true });
      },
    },
    {
      command: "camera.list",
      cap: "camera",
      isAvailable: isAvailable("camera", "ffmpeg"),
      handle: async () => {
        resolveTool("camera", "ffmpeg", "CAMERA_DISABLED", "CAMERA_UNAVAILABLE");
        return JSON.stringify({ devices: await listVideoDevices() });
      },
    },
    {
      command: "camera.snap",
      cap: "camera",
      dangerous: true,
      isAvailable: isAvailable("camera", "ffmpeg"),
      handle: async (paramsJSON) => {
        const ffmpeg = resolveTool("camera", "ffmpeg", "CAMERA_DISABLED", "CAMERA_UNAVAILABLE");
        const params = parseParams(paramsJSON);
        const format = typeof params.format === "string" ? params.format.toLowerCase() : "jpg";
        if (format !== "jpg" && format !== "jpeg")
          throw new Error(`INVALID_REQUEST: unsupported camera image format: ${format}`);
        const device = await selectVideoDevice(params.deviceId);
        const maxWidthRaw = readFiniteNumber(params.maxWidth);
        const maxWidth =
          maxWidthRaw && maxWidthRaw > 0 ? Math.max(2, Math.floor(maxWidthRaw)) : 1600;
        const quality = clamp(readFiniteNumber(params.quality) ?? 0.9, 0.05, 1);
        const delayMs = clamp(Math.floor(readFiniteNumber(params.delayMs) ?? 2e3), 0, 1e4);
        const ffmpegQuality = Math.round(31 - quality * 29);
        return await withTempFile(".jpg", async (outputPath) => {
          assertToolResult(
            await runCommand(
              [
                ffmpeg,
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-f",
                "v4l2",
                "-i",
                device.id,
                "-ss",
                (delayMs / 1e3).toFixed(3),
                "-frames:v",
                "1",
                "-vf",
                `scale=min(iw\\,${maxWidth}):-2`,
                "-q:v",
                String(ffmpegQuality),
                outputPath,
              ],
              { timeoutMs: delayMs + 2e4 },
            ),
            "CAMERA_UNAVAILABLE",
          );
          const image = await readMedia(outputPath);
          const dimensions = readJpegDimensions(image);
          if (!dimensions) throw new Error("CAMERA_UNAVAILABLE: FFmpeg returned an invalid JPEG");
          return JSON.stringify({
            format,
            base64: encodeMedia(image),
            width: dimensions.width,
            height: dimensions.height,
          });
        });
      },
    },
    {
      command: "camera.clip",
      cap: "camera",
      dangerous: true,
      isAvailable: isAvailable("camera", "ffmpeg"),
      handle: async (paramsJSON) => {
        const ffmpeg = resolveTool("camera", "ffmpeg", "CAMERA_DISABLED", "CAMERA_UNAVAILABLE");
        const params = parseParams(paramsJSON);
        const format = typeof params.format === "string" ? params.format.toLowerCase() : "mp4";
        if (format !== "mp4")
          throw new Error(`INVALID_REQUEST: unsupported camera clip format: ${format}`);
        const device = await selectVideoDevice(params.deviceId);
        const durationMs = clamp(Math.floor(readFiniteNumber(params.durationMs) ?? 3e3), 250, 6e4);
        const includeAudio = typeof params.includeAudio === "boolean" ? params.includeAudio : true;
        return await withTempFile(".mp4", async (outputPath) => {
          const inputs = ["-f", "v4l2", "-i", device.id];
          if (includeAudio) inputs.push("-f", "pulse", "-i", "default");
          const audioArgs = includeAudio
            ? ["-map", "0:v:0", "-map", "1:a:0", "-c:a", "aac", "-b:a", "128k", "-shortest"]
            : ["-an"];
          assertToolResult(
            await runCommand(
              [
                ffmpeg,
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                ...inputs,
                "-t",
                (durationMs / 1e3).toFixed(3),
                "-c:v",
                "libx264",
                "-preset",
                "veryfast",
                "-pix_fmt",
                "yuv420p",
                ...audioArgs,
                "-movflags",
                "+faststart",
                outputPath,
              ],
              { timeoutMs: durationMs + 3e4 },
            ),
            "CAMERA_UNAVAILABLE",
          );
          const clip = await readMedia(outputPath);
          return JSON.stringify({
            format: "mp4",
            base64: encodeMedia(clip),
            durationMs,
            hasAudio: includeAudio,
          });
        });
      },
    },
    createLinuxLocationCommand({
      config: deps.config,
      platform,
      env,
      resolveExecutable: findExecutable,
      runCommand,
      now,
    }),
  ];
}
//#endregion
//#region extensions/linux-node/index.ts
var linux_node_default = definePluginEntry({
  id: "linux-node",
  name: "Linux Node",
  description: "Desktop notifications, camera capture, and location for Linux node hosts.",
  configSchema: createLinuxNodePluginConfigSchema,
  register(api) {
    const config = resolveLinuxNodePluginConfig(api.pluginConfig);
    for (const command of createLinuxNodeCommands({ config })) api.registerNodeHostCommand(command);
    api.registerNodeInvokePolicy({
      commands: ["camera.list", "location.get"],
      defaultPlatforms: ["linux"],
      handle: async (ctx) => await ctx.invokeNode(),
    });
    api.registerNodeInvokePolicy({
      commands: ["camera.snap", "camera.clip"],
      dangerous: true,
      handle: async (ctx) => await ctx.invokeNode(),
    });
  },
});
//#endregion
export { linux_node_default as default };
