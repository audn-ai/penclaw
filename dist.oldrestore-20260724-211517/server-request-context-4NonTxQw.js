import { r as disconnectAllSharedGatewayAuthClients } from "./server-shared-auth-generation-CWSg34uM.js";
//#region src/gateway/server-request-context.ts
function createGatewayRequestContext(params) {
  const hasApprovalScope = (gatewayClient) => {
    const scopes = Array.isArray(gatewayClient.connect.scopes) ? gatewayClient.connect.scopes : [];
    return scopes.includes("operator.admin") || scopes.includes("operator.approvals");
  };
  return {
    deps: params.deps,
    get cron() {
      return params.runtimeState.cronState.cron;
    },
    get cronStorePath() {
      return params.runtimeState.cronState.storePath;
    },
    getRuntimeConfig: params.getRuntimeConfig,
    getMcpAppSandboxPort: params.getMcpAppSandboxPort,
    resolveTerminalLaunchPolicy: params.resolveTerminalLaunchPolicy,
    isTerminalEnabled: params.isTerminalEnabled,
    execApprovalManager: params.execApprovalManager,
    forwardPluginApprovalRequest: params.forwardPluginApprovalRequest,
    pluginApprovalManager: params.pluginApprovalManager,
    listSessionPendingApprovals: params.listSessionPendingApprovals,
    loadGatewayModelCatalog: params.loadGatewayModelCatalog,
    loadGatewayModelCatalogSnapshot: params.loadGatewayModelCatalogSnapshot,
    getHealthCache: params.getHealthCache,
    refreshHealthSnapshot: params.refreshHealthSnapshot,
    logHealth: params.logHealth,
    logGateway: params.logGateway,
    incrementPresenceVersion: params.incrementPresenceVersion,
    getHealthVersion: params.getHealthVersion,
    broadcast: params.broadcast,
    broadcastToConnIds: params.broadcastToConnIds,
    nodeSendToSession: params.nodeSendToSession,
    nodeSendToAllSubscribed: params.nodeSendToAllSubscribed,
    nodeSubscribe: params.nodeSubscribe,
    nodeUnsubscribe: params.nodeUnsubscribe,
    nodeUnsubscribeAll: params.nodeUnsubscribeAll,
    hasConnectedTalkNode: params.hasConnectedTalkNode,
    isConnectionActive: (connId) =>
      [...params.clients].some((client) => client.connId === connId && !client.invalidated),
    hasExecApprovalClients: (excludeConnId) => {
      for (const gatewayClient of params.clients) {
        if (excludeConnId && gatewayClient.connId === excludeConnId) continue;
        if (hasApprovalScope(gatewayClient)) return true;
      }
      return false;
    },
    getApprovalClientConnIds: (opts = {}) => {
      const connIds = /* @__PURE__ */ new Set();
      for (const gatewayClient of params.clients) {
        if (!gatewayClient.connId) continue;
        if (opts.excludeConnId && gatewayClient.connId === opts.excludeConnId) continue;
        if (!hasApprovalScope(gatewayClient)) continue;
        if (opts.filter && !opts.filter(gatewayClient, opts.record)) continue;
        connIds.add(gatewayClient.connId);
      }
      return connIds;
    },
    hasConnectedClientsForDevice: (deviceId) => {
      for (const gatewayClient of params.clients)
        if (gatewayClient.connect.device?.id === deviceId && !gatewayClient.invalidated)
          return true;
      return false;
    },
    invalidateClientsForDevice: (deviceId, opts) => {
      const reason = opts?.reason ?? "device-invalidated";
      for (const gatewayClient of params.clients) {
        if (gatewayClient.connect.device?.id !== deviceId) continue;
        if (opts?.role && gatewayClient.connect.role !== opts.role) continue;
        gatewayClient.invalidated = true;
        gatewayClient.invalidatedReason = reason;
      }
      params.invalidateDeviceTransports?.(deviceId, opts);
    },
    disconnectClientsForDevice: (deviceId, opts) => {
      for (const gatewayClient of params.clients) {
        if (gatewayClient.connect.device?.id !== deviceId) continue;
        if (opts?.role && gatewayClient.connect.role !== opts.role) continue;
        gatewayClient.invalidated = true;
        gatewayClient.invalidatedReason ??= "device-removed";
        try {
          gatewayClient.socket.close(4001, "device removed");
        } catch {}
      }
      params.disconnectDeviceTransports?.(deviceId, opts);
    },
    disconnectClientsUsingSharedGatewayAuth: () => {
      disconnectAllSharedGatewayAuthClients(params.clients);
    },
    enforceSharedGatewayAuthGenerationForConfigWrite:
      params.enforceSharedGatewayAuthGenerationForConfigWrite,
    nodeRegistry: params.nodeRegistry,
    ...(params.workerEnvironmentService
      ? { workerEnvironmentService: params.workerEnvironmentService }
      : {}),
    ...(params.workerSessionPlacementService
      ? { workerSessionPlacementService: params.workerSessionPlacementService }
      : {}),
    ...(params.workerPlacementDispatchService
      ? { workerPlacementDispatchService: params.workerPlacementDispatchService }
      : {}),
    terminalSessions: params.terminalSessions,
    agentRunSeq: params.agentRunSeq,
    chatAbortControllers: params.chatAbortControllers,
    chatQueuedTurns: params.chatQueuedTurns,
    chatAbortedRuns: params.chatAbortedRuns,
    chatRunBuffers: params.chatRunBuffers,
    chatDeltaSentAt: params.chatDeltaSentAt,
    chatDeltaLastBroadcastLen: params.chatDeltaLastBroadcastLen,
    chatDeltaLastBroadcastText: params.chatDeltaLastBroadcastText,
    agentDeltaSentAt: params.agentDeltaSentAt,
    bufferedAgentEvents: params.bufferedAgentEvents,
    clearChatRunState: params.clearChatRunState,
    addChatRun: params.addChatRun,
    removeChatRun: params.removeChatRun,
    subscribeSessionEvents: params.subscribeSessionEvents,
    unsubscribeSessionEvents: params.unsubscribeSessionEvents,
    subscribeSessionMessageEvents: params.subscribeSessionMessageEvents,
    unsubscribeSessionMessageEvents: params.unsubscribeSessionMessageEvents,
    unsubscribeAllSessionEvents: params.unsubscribeAllSessionEvents,
    getSessionEventSubscriberConnIds: params.getSessionEventSubscriberConnIds,
    registerToolEventRecipient: params.registerToolEventRecipient,
    dedupe: params.dedupe,
    wizardSessions: params.wizardSessions,
    crestodianSessions: params.crestodianSessions,
    findRunningWizard: params.findRunningWizard,
    purgeWizardSession: params.purgeWizardSession,
    getRuntimeSnapshot: params.getRuntimeSnapshot,
    getEventLoopHealth: params.getEventLoopHealth,
    getConfigReloaderHotReloadStatus: () => params.runtimeState.configReloader.hotReloadStatus?.(),
    startChannel: params.startChannel,
    stopChannel: params.stopChannel,
    markChannelLoggedOut: params.markChannelLoggedOut,
    wizardRunner: params.wizardRunner,
    channelWizardRunner: params.channelWizardRunner,
    broadcastVoiceWakeChanged: params.broadcastVoiceWakeChanged,
    broadcastVoiceWakeRoutingChanged: params.broadcastVoiceWakeRoutingChanged,
    unavailableGatewayMethods: params.unavailableGatewayMethods,
  };
}
//#endregion
export { createGatewayRequestContext };
