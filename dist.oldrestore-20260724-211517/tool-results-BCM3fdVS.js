//#region src/agents/tools/tool-results.ts
function textResult(text, details) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
    details,
  };
}
function jsonResult(payload) {
  return textResult(JSON.stringify(payload, null, 2), payload);
}
//#endregion
export { textResult as n, jsonResult as t };
