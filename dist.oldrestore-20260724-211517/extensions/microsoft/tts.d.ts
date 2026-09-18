//#region extensions/microsoft/tts.d.ts
type EdgeTTSClient = Pick<import("node-edge-tts").EdgeTTS, "ttsPromise">;
declare function inferEdgeExtension(outputFormat: string): string;
declare function edgeTTS(
  params: {
    text: string;
    outputPath: string;
    config: {
      voice: string;
      lang: string;
      outputFormat: string;
      saveSubtitles: boolean;
      proxy?: string;
      rate?: string;
      pitch?: string;
      volume?: string;
      timeoutMs?: number;
    };
    timeoutMs: number;
  },
  ttsOverride?: EdgeTTSClient,
): Promise<void>;
//#endregion
export { edgeTTS, inferEdgeExtension };
