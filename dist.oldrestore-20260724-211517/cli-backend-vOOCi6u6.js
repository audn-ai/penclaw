import {
  n as CLI_RESUME_WATCHDOG_DEFAULTS,
  t as CLI_FRESH_WATCHDOG_DEFAULTS,
} from "./cli-watchdog-defaults-CzmnkdzO.js";
//#region extensions/google/cli-backend.ts
const GEMINI_MODEL_ALIASES = {
  pro: "gemini-3.1-pro-preview",
  flash: "gemini-3.1-flash-preview",
  "flash-lite": "gemini-3.1-flash-lite",
};
const GEMINI_CLI_DEFAULT_MODEL_REF = "google-gemini-cli/gemini-3-flash-preview";
function mapGeminiCliOutputFormat(value) {
  if (value === "stream-json") return "jsonl";
  if (value === "json" || value === "text") return value;
}
function readGeminiCliOutputFormat(args) {
  for (let index = 0; index < (args?.length ?? 0); index += 1) {
    const arg = args?.[index];
    if (arg === "--output-format" || arg === "-o")
      return mapGeminiCliOutputFormat(args?.[index + 1]) ?? "text";
    const mapped = mapGeminiCliOutputFormat(
      arg?.startsWith("--output-format=")
        ? arg.slice(16)
        : arg?.startsWith("-o=")
          ? arg.slice(3)
          : void 0,
    );
    if (mapped) return mapped;
  }
  return "text";
}
function normalizeGeminiCliBackendConfig(config) {
  const output = readGeminiCliOutputFormat(config.args);
  const resumeOutput = readGeminiCliOutputFormat(config.resumeArgs ?? config.args);
  const usesStreamJson = output === "jsonl" || resumeOutput === "jsonl";
  return {
    ...config,
    output,
    resumeOutput,
    jsonlDialect: usesStreamJson ? "gemini-stream-json" : void 0,
  };
}
function buildGoogleGeminiCliBackend() {
  return {
    id: "google-gemini-cli",
    modelProvider: "google",
    liveTest: {
      defaultModelRef: GEMINI_CLI_DEFAULT_MODEL_REF,
      defaultImageProbe: true,
      defaultMcpProbe: true,
      docker: {
        npmPackage: "@google/gemini-cli",
        binaryName: "gemini",
      },
    },
    runtimeArtifact: {
      kind: "bundled-package-tree",
      packageName: "@google/gemini-cli",
      entrypoint: "command",
    },
    bundleMcp: true,
    bundleMcpMode: "gemini-system-settings",
    nativeToolMode: "always-on",
    authEpochMode: "profile-only",
    normalizeConfig: normalizeGeminiCliBackendConfig,
    prepareExecution: async (ctx) => {
      const { prepareGeminiCliAuthHome } =
        await import("./extensions/google/cli-backend-auth.runtime.js");
      return await prepareGeminiCliAuthHome(
        {
          agentDir: ctx.agentDir,
          authProfileId: ctx.authProfileId,
          systemSettingsPath:
            ctx.env?.GEMINI_CLI_SYSTEM_SETTINGS_PATH ?? process.env.GEMINI_CLI_SYSTEM_SETTINGS_PATH,
        },
        ctx.authCredential,
      );
    },
    config: {
      command: "gemini",
      args: [
        "--skip-trust",
        "--approval-mode",
        "auto_edit",
        "--output-format",
        "stream-json",
        "--prompt",
        "{prompt}",
      ],
      resumeArgs: [
        "--skip-trust",
        "--approval-mode",
        "auto_edit",
        "--resume",
        "{sessionId}",
        "--output-format",
        "stream-json",
        "--prompt",
        "{prompt}",
      ],
      output: "jsonl",
      input: "arg",
      jsonlDialect: "gemini-stream-json",
      imageArg: "@",
      imagePathScope: "workspace",
      modelArg: "--model",
      modelAliases: GEMINI_MODEL_ALIASES,
      sessionMode: "existing",
      sessionIdFields: ["session_id", "sessionId"],
      reliability: {
        watchdog: {
          fresh: { ...CLI_FRESH_WATCHDOG_DEFAULTS },
          resume: { ...CLI_RESUME_WATCHDOG_DEFAULTS },
        },
      },
      serialize: true,
    },
  };
}
//#endregion
export { buildGoogleGeminiCliBackend as t };
