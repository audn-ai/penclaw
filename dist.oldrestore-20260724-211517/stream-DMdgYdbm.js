import { l as createPayloadPatchStreamWrapper } from "./provider-stream-shared-CMy-5I0G.js";
//#region extensions/cohere/stream.ts
function patchCoherePayload(payload) {
  if (Array.isArray(payload.messages))
    payload.messages = payload.messages.map((message) =>
      message && typeof message === "object" && message.role === "system"
        ? {
            ...message,
            role: "developer",
          }
        : message,
    );
  delete payload.tool_choice;
}
function createCohereCompletionsWrapper(baseStreamFn) {
  return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) =>
    patchCoherePayload(payload),
  );
}
//#endregion
export { createCohereCompletionsWrapper as t };
