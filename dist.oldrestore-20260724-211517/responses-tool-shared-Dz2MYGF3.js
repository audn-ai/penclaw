import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/xai/src/responses-tool-shared.ts
function isRecord(value) {
  return value !== null && typeof value === "object";
}
function extractUrlCitations(annotations) {
  if (!Array.isArray(annotations)) return [];
  return annotations
    .filter(
      (annotation) =>
        isRecord(annotation) &&
        annotation.type === "url_citation" &&
        typeof annotation.url === "string",
    )
    .map((annotation) => annotation.url);
}
const XAI_RESPONSES_BASE_URL = "https://api.x.ai/v1";
const XAI_RESPONSES_ENDPOINT = `${XAI_RESPONSES_BASE_URL}/responses`;
function resolveXaiResponsesEndpoint(baseUrl) {
  return `${(normalizeOptionalString(baseUrl) ?? XAI_RESPONSES_BASE_URL).replace(/\/+$/, "")}/responses`;
}
function buildXaiResponsesToolBody(params) {
  return {
    model: params.model,
    input: [
      {
        role: "user",
        content: params.inputText,
      },
    ],
    tools: params.tools,
    store: false,
    ...(params.reasoningEffort ? { reasoning: { effort: params.reasoningEffort } } : {}),
    ...(params.maxTurns ? { max_turns: params.maxTurns } : {}),
  };
}
function extractXaiWebSearchContent(data) {
  for (const output of data.output ?? []) {
    if (!isRecord(output)) continue;
    if (output.type === "message") {
      const content = Array.isArray(output.content) ? output.content : [];
      for (const block of content) {
        if (!isRecord(block)) continue;
        if (block.type === "output_text" && typeof block.text === "string" && block.text) {
          const urls = extractUrlCitations(block.annotations);
          return {
            text: block.text,
            annotationCitations: uniqueStrings(urls),
          };
        }
      }
    }
    if (output.type === "output_text" && typeof output.text === "string" && output.text) {
      const urls = extractUrlCitations(output.annotations);
      return {
        text: output.text,
        annotationCitations: uniqueStrings(urls),
      };
    }
  }
  return {
    text: typeof data.output_text === "string" ? data.output_text : void 0,
    annotationCitations: [],
  };
}
function requireXaiResponseTextAndCitations(data, label) {
  const { text, annotationCitations } = extractXaiWebSearchContent(data);
  if (!text) throw new Error(`${label}: malformed JSON response`);
  return {
    content: text,
    citations:
      Array.isArray(data.citations) && data.citations.length > 0
        ? data.citations
        : annotationCitations,
  };
}
function requireXaiResponseTextCitationsAndInline(data, label, inlineCitationsEnabled) {
  const { content, citations } = requireXaiResponseTextAndCitations(data, label);
  return {
    content,
    citations,
    inlineCitations:
      inlineCitationsEnabled && Array.isArray(data.inline_citations)
        ? data.inline_citations
        : void 0,
  };
}
//#endregion
export {
  requireXaiResponseTextCitationsAndInline as a,
  requireXaiResponseTextAndCitations as i,
  buildXaiResponsesToolBody as n,
  resolveXaiResponsesEndpoint as o,
  extractXaiWebSearchContent as r,
  XAI_RESPONSES_ENDPOINT as t,
};
