//#region src/plugin-sdk/provider-zai-endpoint.d.ts
/**
 * @deprecated Z.AI provider-owned endpoint detection helper. Use the bundled
 * Z.AI plugin public API instead, or keep endpoint probing local to your
 * provider plugin.
 */
/** Supported Z.AI endpoint families handled by the deprecated endpoint probe. */
type ZaiEndpointId = "global" | "cn" | "coding-global" | "coding-cn";
/** Result of probing a Z.AI API key against one endpoint family. */
type ZaiDetectedEndpoint = {
  endpoint: ZaiEndpointId;
  baseUrl: string;
  modelId: string;
  note: string;
};
type DetectZaiEndpoint = (params: {
  apiKey: string;
  endpoint?: ZaiEndpointId;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}) => Promise<ZaiDetectedEndpoint | null>;
/** @deprecated Z.AI provider-owned endpoint detection helper. */
declare const detectZaiEndpoint: DetectZaiEndpoint;
//#endregion
export { ZaiDetectedEndpoint, ZaiEndpointId, detectZaiEndpoint };
