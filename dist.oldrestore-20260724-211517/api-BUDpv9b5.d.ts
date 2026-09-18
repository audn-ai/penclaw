//#region extensions/xai/api.d.ts
declare function isXaiModelHint(modelId: string): boolean;
declare function resolveXaiTransport(params: {
  provider: string;
  api?: unknown;
  baseUrl?: unknown;
}):
  | {
      api: "openai-responses";
      baseUrl?: string;
    }
  | undefined;
//#endregion
export { resolveXaiTransport as n, isXaiModelHint as t };
