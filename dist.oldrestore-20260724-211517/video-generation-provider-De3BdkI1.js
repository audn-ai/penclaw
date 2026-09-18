import { r as isProviderApiKeyConfigured } from "./provider-auth-mypr64nh.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DpUprUn3.js";
import { u as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DpW-uV6A.js";
import { p as resolveProviderHttpRequestConfig } from "./shared-CfGzzOqJ.js";
import "./provider-http-BDIltggC.js";
import {
  a as DEFAULT_VIDEO_GENERATION_TIMEOUT_MS,
  n as DASHSCOPE_WAN_VIDEO_MODELS,
  p as runDashscopeVideoGenerationTask,
  r as DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL,
  t as DASHSCOPE_WAN_VIDEO_CAPABILITIES,
} from "./video-generation-CnvfHUtz.js";
//#region extensions/alibaba/video-generation-provider.ts
/**
 * Alibaba Model Studio video provider adapter. It resolves DashScope auth and
 * HTTP policy before delegating task polling to the shared video helper.
 */
const DEFAULT_ALIBABA_VIDEO_BASE_URL = "https://dashscope-intl.aliyuncs.com";
const DEFAULT_ALIBABA_VIDEO_MODEL = DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL;
function resolveAlibabaVideoBaseUrl(req) {
  return req.cfg?.models?.providers?.alibaba?.baseUrl?.trim() || DEFAULT_ALIBABA_VIDEO_BASE_URL;
}
function resolveDashscopeAigcApiBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/u, "");
}
/** Build the Alibaba/DashScope video generation provider descriptor. */
function buildAlibabaVideoGenerationProvider() {
  return {
    id: "alibaba",
    label: "Alibaba Model Studio",
    defaultModel: DEFAULT_ALIBABA_VIDEO_MODEL,
    models: [...DASHSCOPE_WAN_VIDEO_MODELS],
    isConfigured: ({ agentDir }) =>
      isProviderApiKeyConfigured({
        provider: "alibaba",
        agentDir,
      }),
    capabilities: DASHSCOPE_WAN_VIDEO_CAPABILITIES,
    async generateVideo(req) {
      const fetchFn = fetch;
      const auth = await resolveApiKeyForProvider({
        provider: "alibaba",
        cfg: req.cfg,
        agentDir: req.agentDir,
        store: req.authStore,
      });
      if (!auth.apiKey) throw new Error("Alibaba Model Studio API key missing");
      const providerConfig = req.cfg?.models?.providers?.alibaba;
      const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy } =
        resolveProviderHttpRequestConfig({
          baseUrl: resolveAlibabaVideoBaseUrl(req),
          defaultBaseUrl: DEFAULT_ALIBABA_VIDEO_BASE_URL,
          defaultHeaders: {
            Authorization: `Bearer ${auth.apiKey}`,
            "Content-Type": "application/json",
            "X-DashScope-Async": "enable",
          },
          provider: "alibaba",
          capability: "video",
          transport: "http",
          request: sanitizeConfiguredModelProviderRequest(providerConfig?.request),
        });
      return await runDashscopeVideoGenerationTask({
        providerLabel: "Alibaba Wan",
        model: req.model?.trim() || DEFAULT_ALIBABA_VIDEO_MODEL,
        req,
        url: `${resolveDashscopeAigcApiBaseUrl(baseUrl)}/api/v1/services/aigc/video-generation/video-synthesis`,
        headers,
        baseUrl: resolveDashscopeAigcApiBaseUrl(baseUrl),
        timeoutMs: req.timeoutMs,
        fetchFn,
        allowPrivateNetwork,
        dispatcherPolicy,
        defaultTimeoutMs: DEFAULT_VIDEO_GENERATION_TIMEOUT_MS,
      });
    },
  };
}
//#endregion
export { buildAlibabaVideoGenerationProvider as t };
