//#region src/plugins/api-facades.ts
/** Attaches nested facade namespaces to the flat plugin API implementation. */
function attachPluginApiFacades(api) {
  api.session = {
    state: { registerSessionExtension: (...args) => api.registerSessionExtension(...args) },
    workflow: {
      enqueueNextTurnInjection: (...args) => api.enqueueNextTurnInjection(...args),
      registerSessionSchedulerJob: (...args) => api.registerSessionSchedulerJob(...args),
      sendSessionAttachment: (...args) => api.sendSessionAttachment(...args),
      scheduleSessionTurn: (...args) => api.scheduleSessionTurn(...args),
      unscheduleSessionTurnsByTag: (...args) => api.unscheduleSessionTurnsByTag(...args),
    },
    controls: {
      registerSessionAction: (...args) => api.registerSessionAction(...args),
      registerControlUiDescriptor: (...args) => api.registerControlUiDescriptor(...args),
    },
  };
  api.agent = {
    events: {
      registerAgentEventSubscription: (...args) => api.registerAgentEventSubscription(...args),
      emitAgentEvent: (...args) => api.emitAgentEvent(...args),
    },
  };
  api.runContext = {
    setRunContext: (...args) => api.setRunContext(...args),
    getRunContext: (...args) => api.getRunContext(...args),
    clearRunContext: (...args) => api.clearRunContext(...args),
  };
  api.lifecycle = { registerRuntimeLifecycle: (...args) => api.registerRuntimeLifecycle(...args) };
  return api;
}
//#endregion
//#region src/plugins/api-builder.ts
const noopRegisterTool = () => {};
const noopRegisterHook = () => {};
const noopRegisterHttpRoute = () => {};
const noopRegisterHostedMediaResolver = () => {};
const noopRegisterChannel = () => {};
const noopRegisterGatewayMethod = () => {};
const noopRegisterSessionCatalog = () => {};
const noopRegisterCli = () => {};
const noopRegisterReload = () => {};
const noopRegisterNodeHostCommand = () => {};
const noopRegisterNodeInvokePolicy = () => {};
const noopRegisterSecurityAuditCollector = () => {};
const noopRegisterService = () => {};
const noopRegisterGatewayDiscoveryService = () => {};
const noopRegisterCliBackend = () => {};
const noopRegisterTextTransforms = () => {};
const noopRegisterConfigMigration = () => {};
const noopRegisterMigrationProvider = () => {};
const noopRegisterAutoEnableProbe = () => {};
const noopRegisterProvider = () => {};
const noopRegisterWorkerProvider = () => {};
const noopRegisterModelCatalogProvider = () => {};
const noopRegisterEmbeddingProvider = () => {};
const noopRegisterSpeechProvider = () => {};
const noopRegisterRealtimeTranscriptionProvider = () => {};
const noopRegisterRealtimeVoiceProvider = () => {};
const noopRegisterMediaUnderstandingProvider = () => {};
const noopRegisterTranscriptsSourceProvider = () => {};
const noopRegisterImageGenerationProvider = () => {};
const noopRegisterVideoGenerationProvider = () => {};
const noopRegisterMusicGenerationProvider = () => {};
const noopRegisterWebFetchProvider = () => {};
const noopRegisterWebSearchProvider = () => {};
const noopRegisterInteractiveHandler = () => {};
const noopOnConversationBindingResolved = () => {};
const noopRegisterCommand = () => {};
const noopRegisterContextEngine = () => {};
const noopRegisterCompactionProvider = () => {};
const noopRegisterAgentHarness = () => {};
const noopRegisterCodexAppServerExtensionFactory = () => {};
const noopRegisterAgentToolResultMiddleware = () => {};
const noopRegisterSessionExtension = () => {};
const noopEnqueueNextTurnInjection = async (injection) => ({
  enqueued: false,
  id: "",
  sessionKey: injection.sessionKey,
});
const noopRegisterTrustedToolPolicy = () => {};
const noopRegisterToolMetadata = () => {};
const noopRegisterControlUiDescriptor = () => {};
const noopRegisterRuntimeLifecycle = () => {};
const noopRegisterAgentEventSubscription = () => {};
const noopEmitAgentEvent = () => ({
  emitted: false,
  reason: "not wired",
});
const noopSetRunContext = () => false;
const noopGetRunContext = () => void 0;
const noopClearRunContext = () => {};
const noopRegisterSessionSchedulerJob = () => void 0;
const noopRegisterSessionAction = () => {};
const noopSendSessionAttachment = async () => ({
  ok: false,
  error: "not wired",
});
const noopScheduleSessionTurn = async () => void 0;
const noopUnscheduleSessionTurnsByTag = async () => ({
  removed: 0,
  failed: 0,
});
const noopRegisterDetachedTaskRuntime = () => {};
const noopRegisterMemoryCapability = () => {};
const noopRegisterMemoryPromptSection = () => {};
const noopRegisterMemoryPromptSupplement = () => {};
const noopRegisterMemoryCorpusSupplement = () => {};
const noopRegisterMemoryFlushPlan = () => {};
const noopRegisterMemoryRuntime = () => {};
const noopRegisterMemoryEmbeddingProvider = () => {};
const noopOn = () => {};
function buildPluginApi(params) {
  const handlers = params.handlers ?? {};
  const registerCli = handlers.registerCli ?? noopRegisterCli;
  return attachPluginApiFacades({
    id: params.id,
    name: params.name,
    version: params.version,
    description: params.description,
    source: params.source,
    rootDir: params.rootDir,
    registrationMode: params.registrationMode,
    config: params.config,
    pluginConfig: params.pluginConfig,
    runtime: params.runtime,
    logger: params.logger,
    registerTool: handlers.registerTool ?? noopRegisterTool,
    registerHook: handlers.registerHook ?? noopRegisterHook,
    registerHttpRoute: handlers.registerHttpRoute ?? noopRegisterHttpRoute,
    registerHostedMediaResolver:
      handlers.registerHostedMediaResolver ?? noopRegisterHostedMediaResolver,
    registerChannel: handlers.registerChannel ?? noopRegisterChannel,
    registerGatewayMethod: handlers.registerGatewayMethod ?? noopRegisterGatewayMethod,
    registerSessionCatalog: handlers.registerSessionCatalog ?? noopRegisterSessionCatalog,
    registerCli,
    registerNodeCliFeature: (registrar, opts) =>
      registerCli(registrar, {
        ...opts,
        parentPath: ["nodes"],
      }),
    registerReload: handlers.registerReload ?? noopRegisterReload,
    registerNodeHostCommand: handlers.registerNodeHostCommand ?? noopRegisterNodeHostCommand,
    registerNodeInvokePolicy: handlers.registerNodeInvokePolicy ?? noopRegisterNodeInvokePolicy,
    registerSecurityAuditCollector:
      handlers.registerSecurityAuditCollector ?? noopRegisterSecurityAuditCollector,
    registerService: handlers.registerService ?? noopRegisterService,
    registerGatewayDiscoveryService:
      handlers.registerGatewayDiscoveryService ?? noopRegisterGatewayDiscoveryService,
    registerCliBackend: handlers.registerCliBackend ?? noopRegisterCliBackend,
    registerTextTransforms: handlers.registerTextTransforms ?? noopRegisterTextTransforms,
    registerConfigMigration: handlers.registerConfigMigration ?? noopRegisterConfigMigration,
    registerMigrationProvider: handlers.registerMigrationProvider ?? noopRegisterMigrationProvider,
    registerAutoEnableProbe: handlers.registerAutoEnableProbe ?? noopRegisterAutoEnableProbe,
    registerProvider: handlers.registerProvider ?? noopRegisterProvider,
    registerWorkerProvider: handlers.registerWorkerProvider ?? noopRegisterWorkerProvider,
    registerModelCatalogProvider:
      handlers.registerModelCatalogProvider ?? noopRegisterModelCatalogProvider,
    registerEmbeddingProvider: handlers.registerEmbeddingProvider ?? noopRegisterEmbeddingProvider,
    registerSpeechProvider: handlers.registerSpeechProvider ?? noopRegisterSpeechProvider,
    registerRealtimeTranscriptionProvider:
      handlers.registerRealtimeTranscriptionProvider ?? noopRegisterRealtimeTranscriptionProvider,
    registerRealtimeVoiceProvider:
      handlers.registerRealtimeVoiceProvider ?? noopRegisterRealtimeVoiceProvider,
    registerMediaUnderstandingProvider:
      handlers.registerMediaUnderstandingProvider ?? noopRegisterMediaUnderstandingProvider,
    registerTranscriptSourceProvider:
      handlers.registerTranscriptSourceProvider ?? noopRegisterTranscriptsSourceProvider,
    registerImageGenerationProvider:
      handlers.registerImageGenerationProvider ?? noopRegisterImageGenerationProvider,
    registerVideoGenerationProvider:
      handlers.registerVideoGenerationProvider ?? noopRegisterVideoGenerationProvider,
    registerMusicGenerationProvider:
      handlers.registerMusicGenerationProvider ?? noopRegisterMusicGenerationProvider,
    registerWebFetchProvider: handlers.registerWebFetchProvider ?? noopRegisterWebFetchProvider,
    registerWebSearchProvider: handlers.registerWebSearchProvider ?? noopRegisterWebSearchProvider,
    registerInteractiveHandler:
      handlers.registerInteractiveHandler ?? noopRegisterInteractiveHandler,
    onConversationBindingResolved:
      handlers.onConversationBindingResolved ?? noopOnConversationBindingResolved,
    registerCommand: handlers.registerCommand ?? noopRegisterCommand,
    registerContextEngine: handlers.registerContextEngine ?? noopRegisterContextEngine,
    registerCompactionProvider:
      handlers.registerCompactionProvider ?? noopRegisterCompactionProvider,
    registerAgentHarness: handlers.registerAgentHarness ?? noopRegisterAgentHarness,
    registerCodexAppServerExtensionFactory:
      handlers.registerCodexAppServerExtensionFactory ?? noopRegisterCodexAppServerExtensionFactory,
    registerAgentToolResultMiddleware:
      handlers.registerAgentToolResultMiddleware ?? noopRegisterAgentToolResultMiddleware,
    registerSessionExtension: handlers.registerSessionExtension ?? noopRegisterSessionExtension,
    enqueueNextTurnInjection: handlers.enqueueNextTurnInjection ?? noopEnqueueNextTurnInjection,
    registerTrustedToolPolicy: handlers.registerTrustedToolPolicy ?? noopRegisterTrustedToolPolicy,
    registerToolMetadata: handlers.registerToolMetadata ?? noopRegisterToolMetadata,
    registerControlUiDescriptor:
      handlers.registerControlUiDescriptor ?? noopRegisterControlUiDescriptor,
    registerRuntimeLifecycle: handlers.registerRuntimeLifecycle ?? noopRegisterRuntimeLifecycle,
    registerAgentEventSubscription:
      handlers.registerAgentEventSubscription ?? noopRegisterAgentEventSubscription,
    emitAgentEvent: handlers.emitAgentEvent ?? noopEmitAgentEvent,
    setRunContext: handlers.setRunContext ?? noopSetRunContext,
    getRunContext: handlers.getRunContext ?? noopGetRunContext,
    clearRunContext: handlers.clearRunContext ?? noopClearRunContext,
    registerSessionSchedulerJob:
      handlers.registerSessionSchedulerJob ?? noopRegisterSessionSchedulerJob,
    registerSessionAction: handlers.registerSessionAction ?? noopRegisterSessionAction,
    sendSessionAttachment: handlers.sendSessionAttachment ?? noopSendSessionAttachment,
    scheduleSessionTurn: handlers.scheduleSessionTurn ?? noopScheduleSessionTurn,
    unscheduleSessionTurnsByTag:
      handlers.unscheduleSessionTurnsByTag ?? noopUnscheduleSessionTurnsByTag,
    registerDetachedTaskRuntime:
      handlers.registerDetachedTaskRuntime ?? noopRegisterDetachedTaskRuntime,
    registerMemoryCapability: handlers.registerMemoryCapability ?? noopRegisterMemoryCapability,
    registerMemoryPromptSection:
      handlers.registerMemoryPromptSection ?? noopRegisterMemoryPromptSection,
    registerMemoryPromptSupplement:
      handlers.registerMemoryPromptSupplement ?? noopRegisterMemoryPromptSupplement,
    registerMemoryCorpusSupplement:
      handlers.registerMemoryCorpusSupplement ?? noopRegisterMemoryCorpusSupplement,
    registerMemoryFlushPlan: handlers.registerMemoryFlushPlan ?? noopRegisterMemoryFlushPlan,
    registerMemoryRuntime: handlers.registerMemoryRuntime ?? noopRegisterMemoryRuntime,
    registerMemoryEmbeddingProvider:
      handlers.registerMemoryEmbeddingProvider ?? noopRegisterMemoryEmbeddingProvider,
    resolvePath: params.resolvePath,
    on: handlers.on ?? noopOn,
  });
}
//#endregion
export { attachPluginApiFacades as n, buildPluginApi as t };
