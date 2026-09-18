import { t as runBoundedCodexAppServerTurn } from "./bounded-turn-bE7rbTmh.js";
import "./json-schema-runtime-CKc9WDah.js";
import { i as FALLBACK_CODEX_MODELS, r as CODEX_PROVIDER_ID } from "./provider-catalog-DRyb6wGF.js";
import { t as validateJsonSchemaValue } from "./schema-validator-BAYKPBuJ.js";
//#region extensions/codex/media-understanding-provider.ts
/**
 * Codex-backed media understanding provider for bounded image description and
 * structured extraction turns.
 */
const DEFAULT_CODEX_IMAGE_MODEL =
  FALLBACK_CODEX_MODELS.find((model) => model.inputModalities.includes("image"))?.id ??
  FALLBACK_CODEX_MODELS[0]?.id;
const DEFAULT_CODEX_IMAGE_PROMPT = "Describe the image.";
/**
 * Builds the media-understanding provider that delegates image tasks to an
 * isolated Codex app-server session.
 */
function buildCodexMediaUnderstandingProvider(options = {}) {
  return {
    id: CODEX_PROVIDER_ID,
    capabilities: ["image"],
    ...(DEFAULT_CODEX_IMAGE_MODEL ? { defaultModels: { image: DEFAULT_CODEX_IMAGE_MODEL } } : {}),
    describeImage: async (req) =>
      describeCodexImages(
        {
          images: [
            {
              buffer: req.buffer,
              fileName: req.fileName,
              mime: req.mime,
            },
          ],
          provider: req.provider,
          model: req.model,
          prompt: req.prompt,
          maxTokens: req.maxTokens,
          timeoutMs: req.timeoutMs,
          profile: req.profile,
          preferredProfile: req.preferredProfile,
          authStore: req.authStore,
          agentDir: req.agentDir,
          cfg: req.cfg,
        },
        options,
      ),
    describeImages: async (req) => describeCodexImages(req, options),
    extractStructured: async (req) => extractCodexStructured(req, options),
  };
}
async function describeCodexImages(req, options) {
  const model = req.model.trim();
  if (!model) throw new Error("Codex image understanding requires model id.");
  const { text } = await runBoundedCodexAppServerTurn({
    config: req.cfg,
    model: {
      mode: "required",
      id: model,
    },
    profile: req.profile,
    timeoutMs: req.timeoutMs,
    agentDir: req.agentDir,
    authProfileStore: req.authStore,
    options,
    taskLabel: "image understanding",
    developerInstructions:
      "You are OpenClaw's bounded image-understanding worker. Describe only the provided image content. Do not call tools, edit files, or ask follow-up questions.",
    input: [
      {
        type: "text",
        text: buildCodexImagePrompt(req),
        text_elements: [],
      },
      ...req.images.map((image) => ({
        type: "image",
        url: `data:${image.mime ?? "image/png"};base64,${image.buffer.toString("base64")}`,
      })),
    ],
    requiredModalities: ["text", "image"],
    isolation: "configured-transport",
  });
  return {
    text,
    model,
  };
}
async function extractCodexStructured(req, options) {
  const model = req.model.trim();
  if (!model) throw new Error("Codex structured extraction requires model id.");
  if (!req.instructions.trim())
    throw new Error("Codex structured extraction requires instructions.");
  if (req.input.length === 0)
    throw new Error("Codex structured extraction requires at least one input.");
  if (!req.input.some((entry) => entry.type === "image"))
    throw new Error("Codex structured extraction requires at least one image input.");
  const { text } = await runBoundedCodexAppServerTurn({
    config: req.cfg,
    model: {
      mode: "required",
      id: model,
    },
    profile: req.profile,
    timeoutMs: req.timeoutMs,
    agentDir: req.agentDir,
    authProfileStore: req.authStore,
    options,
    taskLabel: "structured extraction",
    developerInstructions:
      "You are OpenClaw's bounded structured-extraction worker. Return only the requested extraction. Do not call tools, edit files, ask follow-up questions, or include secrets.",
    input: buildCodexStructuredInput(req),
    requiredModalities: requiredStructuredModalities(),
    isolation: "configured-transport",
  });
  return normalizeStructuredExtractionResult({
    text,
    model,
    provider: req.provider,
    req,
  });
}
function buildCodexImagePrompt(req) {
  const prompt = req.prompt?.trim() || DEFAULT_CODEX_IMAGE_PROMPT;
  if (req.images.length <= 1) return prompt;
  return `${prompt}\n\nAnalyze all ${req.images.length} images together.`;
}
function requiredStructuredModalities() {
  return ["text", "image"];
}
function buildCodexStructuredInput(req) {
  return [
    {
      type: "text",
      text: buildStructuredExtractionPrompt(req),
      text_elements: [],
    },
    ...req.input.map((entry) => {
      if (entry.type === "text")
        return {
          type: "text",
          text: entry.text,
          text_elements: [],
        };
      return {
        type: "image",
        url: `data:${entry.mime ?? "image/png"};base64,${entry.buffer.toString("base64")}`,
      };
    }),
  ];
}
function buildStructuredExtractionPrompt(req) {
  return [
    req.instructions.trim(),
    req.schemaName ? `Schema name: ${req.schemaName}` : void 0,
    req.jsonSchema ? `JSON schema:\n${JSON.stringify(req.jsonSchema)}` : void 0,
    req.jsonMode === false
      ? "Return the extraction as concise text."
      : "Return valid JSON only. Do not wrap the JSON in Markdown fences.",
  ]
    .filter((part) => Boolean(part))
    .join("\n\n");
}
function isJsonSchemaObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function normalizeStructuredExtractionResult(params) {
  const result = {
    text: params.text,
    model: params.model,
    provider: params.provider,
    contentType: params.req.jsonMode === false ? "text" : "json",
  };
  if (params.req.jsonMode !== false) {
    try {
      result.parsed = JSON.parse(params.text);
    } catch {
      throw new Error("Codex structured extraction returned invalid JSON.");
    }
    if (isJsonSchemaObject(params.req.jsonSchema)) {
      const validation = validateJsonSchemaValue({
        schema: params.req.jsonSchema,
        cacheKey: "codex.media-understanding.extractStructured",
        value: result.parsed,
        cache: false,
      });
      if (!validation.ok) {
        const message = validation.errors.map((error) => error.text).join("; ") || "invalid";
        throw new Error(`Codex structured extraction JSON did not match schema: ${message}`);
      }
      result.parsed = validation.value;
    }
  }
  return result;
}
//#endregion
export { buildCodexMediaUnderstandingProvider as t };
