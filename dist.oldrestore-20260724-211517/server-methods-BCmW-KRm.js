import {
  n as resolveControlPlaneActor,
  t as formatControlPlaneActor,
} from "./control-plane-audit-CN8L3SYx.js";
import { t as consumeControlPlaneWriteBudget } from "./control-plane-rate-limit-Cqz4CBuw.js";
import {
  n as createCoreGatewayMethodDescriptors,
  r as isCoreGatewayMethodClassified,
} from "./core-descriptors-CxB_dkaR.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { n as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-CiIBNuZX.js";
import {
  a as getGatewaySuspendAdmissionPhase,
  m as tryBeginGatewayRootWorkAdmission,
  o as isGatewayRestartDraining,
} from "./gateway-work-admission-yGjmBAjy.js";
import {
  n as authorizeOperatorScopesForMethod,
  r as authorizeOperatorScopesForRequiredScope,
} from "./method-scopes-DrxGpKMT.js";
import { s as isOperatorScope, t as ADMIN_SCOPE } from "./operator-scopes-CpPJIv7P.js";
import {
  i as createPluginGatewayMethodDescriptors,
  n as createGatewayMethodRegistry,
  t as createGatewayMethodDescriptorsFromHandlers,
} from "./registry-Dv_VSoII.js";
import "./src-CIJf1lT0.js";
import { n as parseGatewayRole, t as isRoleAuthorizedForMethod } from "./role-policy-BXsMqVSN.js";
import { n as getPluginRegistryState } from "./runtime-state-Bd0YsvqM.js";
import { i as gatewayStartupUnavailableDetails } from "./startup-unavailable-CRTM-3cy.js";
//#region src/gateway/server-methods-node-methods.ts
const NODE_PAIR_GATEWAY_METHODS = ["node.pair.list", "node.pair.approve", "node.pair.reject"];
//#endregion
//#region src/gateway/server-methods/lazy-core-handlers.ts
function lazyHandlerModule(loadModule, selectHandlers) {
  let handlersPromise = null;
  return () => (handlersPromise ??= loadModule().then(selectHandlers));
}
function createLazyCoreHandlers(params) {
  return Object.fromEntries(
    params.methods.map((method) => [
      method,
      async (opts) => {
        const handler = (await params.loadHandlers())[method];
        if (!handler) throw new Error(`lazy gateway handler not found: ${method}`);
        await handler(opts);
      },
    ]),
  );
}
//#endregion
//#region src/gateway/server-methods/skills-method-names.ts
const SKILLS_GATEWAY_METHOD_NAMES = [
  "skills.upload.begin",
  "skills.upload.chunk",
  "skills.upload.commit",
  "skills.status",
  "skills.bins",
  "skills.search",
  "skills.detail",
  "skills.securityVerdicts",
  "skills.skillCard",
  "skills.install",
  "skills.update",
  "skills.curator.status",
  "skills.curator.pin",
  "skills.curator.unpin",
  "skills.curator.restore",
  "skills.proposals.list",
  "skills.proposals.inspect",
  "skills.proposals.historyStatus",
  "skills.proposals.historyScan",
  "skills.proposals.create",
  "skills.proposals.update",
  "skills.proposals.revise",
  "skills.proposals.requestRevision",
  "skills.proposals.apply",
  "skills.proposals.reject",
  "skills.proposals.quarantine",
];
//#endregion
//#region src/gateway/server-methods.ts
const loadAgentHandlers = lazyHandlerModule(
  () => import("./agent-joP0Zn3S.js"),
  (module) => module.agentHandlers,
);
const loadAgentsHandlers = lazyHandlerModule(
  () => import("./agents-B9HZQKxN.js"),
  (module) => module.agentsHandlers,
);
const loadAgentsWorkspaceHandlers = lazyHandlerModule(
  () => import("./agents-workspace-DTi5kRHt.js"),
  (module) => module.agentsWorkspaceHandlers,
);
const loadArtifactsHandlers = lazyHandlerModule(
  () => import("./artifacts-CHz5Q9No.js"),
  (module) => module.artifactsHandlers,
);
const loadAuditHandlers = lazyHandlerModule(
  () => import("./audit-CBZIKSJm.js"),
  (module) => module.auditHandlers,
);
const loadAttachHandlers = lazyHandlerModule(
  () => import("./attach-9AwxltGp.js"),
  (module) => module.attachHandlers,
);
const loadChannelsHandlers = lazyHandlerModule(
  () => import("./channels-CoEB52NM.js"),
  (module) => module.channelsHandlers,
);
const loadChatHandlers = lazyHandlerModule(
  () => import("./chat-Dhxbmff4.js"),
  (module) => module.chatHandlers,
);
const loadCommandsHandlers = lazyHandlerModule(
  () => import("./commands-Biq2ZfcS.js"),
  (module) => module.commandsHandlers,
);
const loadConfigHandlers = lazyHandlerModule(
  () => import("./config-DBWu1Vex.js"),
  (module) => module.configHandlers,
);
const loadConnectHandlers = lazyHandlerModule(
  () => import("./connect-BIEh_Tnx.js"),
  (module) => module.connectHandlers,
);
const loadControlUiHandlers = lazyHandlerModule(
  () => import("./control-ui-DYFaSVQN.js"),
  (module) => module.controlUiHandlers,
);
const loadCronHandlers = lazyHandlerModule(
  () => import("./cron-DPzJHoBG.js"),
  (module) => module.cronHandlers,
);
const loadDeviceHandlers = lazyHandlerModule(
  () => import("./devices-DvT5ntB-.js"),
  (module) => module.deviceHandlers,
);
const loadDevicePairSetupHandlers = lazyHandlerModule(
  () => import("./device-pair-setup-BWNhdkhW.js"),
  (module) => module.devicePairSetupHandlers,
);
const loadDiagnosticsHandlers = lazyHandlerModule(
  () => import("./diagnostics-CC1Pp5e5.js"),
  (module) => module.diagnosticsHandlers,
);
const loadDoctorHandlers = lazyHandlerModule(
  () => import("./doctor-CFBlVI9i.js"),
  (module) => module.doctorHandlers,
);
const loadEnvironmentsHandlers = lazyHandlerModule(
  () => import("./environments-C4MqBK9e.js"),
  (module) => module.environmentsHandlers,
);
const loadWorktreesHandlers = lazyHandlerModule(
  () => import("./worktrees-hNhCo3xP.js"),
  (module) => module.worktreesHandlers,
);
const loadExecApprovalsHandlers = lazyHandlerModule(
  () => import("./exec-approvals-NxBvKKLe.js"),
  (module) => module.execApprovalsHandlers,
);
const loadFsHandlers = lazyHandlerModule(
  () => import("./fs-L3uXoCyS.js"),
  (module) => module.fsHandlers,
);
const loadHealthHandlers = lazyHandlerModule(
  () => import("./health-C3Lg1vRv.js"),
  (module) => module.healthHandlers,
);
const loadLogsHandlers = lazyHandlerModule(
  () => import("./logs-d-AQIfMW.js"),
  (module) => module.logsHandlers,
);
const loadTerminalHandlers = lazyHandlerModule(
  () => import("./terminal-BOMVVtPa.js"),
  (module) => module.terminalHandlers,
);
const loadModelsAuthStatusHandlers = lazyHandlerModule(
  () => import("./models-auth-status-D_QiK9F9.js"),
  (module) => module.modelsAuthStatusHandlers,
);
const loadModelsHandlers = lazyHandlerModule(
  () => import("./models-2UjCqwey.js"),
  (module) => module.modelsHandlers,
);
const loadModelsProbeHandlers = lazyHandlerModule(
  () => import("./models-probe-BXCshu2w.js"),
  (module) => module.modelsProbeHandlers,
);
const loadNativeHookRelayHandlers = lazyHandlerModule(
  () => import("./native-hook-relay-BNF8OQM3.js"),
  (module) => module.nativeHookRelayHandlers,
);
const loadNodePendingHandlers = lazyHandlerModule(
  () => import("./nodes-pending-BZq6M-oF.js"),
  (module) => module.nodePendingHandlers,
);
const loadNodeHandlers = lazyHandlerModule(
  () => import("./nodes-cNpD79zd.js"),
  (module) => module.nodeHandlers,
);
const loadPluginHostHookHandlers = lazyHandlerModule(
  () => import("./plugin-host-hooks-tXOSZfZH.js"),
  (module) => module.pluginHostHookHandlers,
);
const loadPluginsHandlers = lazyHandlerModule(
  () => import("./plugins-Bwn49OSE.js"),
  (module) => module.pluginsHandlers,
);
const loadMigrationsHandlers = lazyHandlerModule(
  () => import("./migrations-xBsGwMtL.js"),
  (module) => module.migrationsHandlers,
);
const loadPushHandlers = lazyHandlerModule(
  () => import("./push-CVFEtFK8.js"),
  (module) => module.pushHandlers,
);
const loadRestartHandlers = lazyHandlerModule(
  () => import("./restart-WhSNxIPk.js"),
  (module) => module.restartHandlers,
);
const loadSuspendHandlers = lazyHandlerModule(
  () => import("./suspend-Be28dzLu.js"),
  (module) => module.suspendHandlers,
);
const loadSendHandlers = lazyHandlerModule(
  () => import("./send-D5vms5Zt.js"),
  (module) => module.sendHandlers,
);
const loadSessionsFilesHandlers = lazyHandlerModule(
  () => import("./sessions-files-Be4pSXYP.js"),
  (module) => module.sessionsFilesHandlers,
);
const loadSessionsDiffHandlers = lazyHandlerModule(
  () => import("./sessions-diff-DdZd2y_x.js"),
  (module) => module.sessionsDiffHandlers,
);
const loadSessionsHandlers = lazyHandlerModule(
  () => import("./sessions-DyzIrf3z.js"),
  (module) => module.sessionsHandlers,
);
const loadSessionCatalogHandlers = lazyHandlerModule(
  () => import("./session-catalog-CfadyYqd.js"),
  (module) => module.sessionCatalogHandlers,
);
const loadSkillsHandlers = lazyHandlerModule(
  () => import("./skills-D_pxPh_N.js"),
  (module) => module.skillsHandlers,
);
const loadSystemHandlers = lazyHandlerModule(
  () => import("./system-BjI47rHZ.js"),
  (module) => module.systemHandlers,
);
const loadTalkHandlers = lazyHandlerModule(
  () => import("./talk-B98L1Tpy.js"),
  (module) => module.talkHandlers,
);
const loadTasksHandlers = lazyHandlerModule(
  () => import("./tasks-Bwe34_FK.js"),
  (module) => module.tasksHandlers,
);
const loadTaskSuggestionsHandlers = lazyHandlerModule(
  () => import("./task-suggestions-CM59DR5T.js"),
  (module) => module.taskSuggestionsHandlers,
);
const loadToolsCatalogHandlers = lazyHandlerModule(
  () => import("./tools-catalog-FJX1U0-p.js"),
  (module) => module.toolsCatalogHandlers,
);
const loadToolsEffectiveHandlers = lazyHandlerModule(
  () => import("./tools-effective-9b5nNIwj.js"),
  (module) => module.toolsEffectiveHandlers,
);
const loadToolsInvokeHandlers = lazyHandlerModule(
  () => import("./tools-invoke-eXGFwKwx.js"),
  (module) => module.toolsInvokeHandlers,
);
const loadMcpAppHandlers = lazyHandlerModule(
  () => import("./mcp-app-BtSBGSvt.js"),
  (module) => module.mcpAppHandlers,
);
const loadTtsHandlers = lazyHandlerModule(
  () => import("./tts-BlOVJirp.js"),
  (module) => module.ttsHandlers,
);
const loadUpdateHandlers = lazyHandlerModule(
  () => import("./update-CAO7fixd.js"),
  (module) => module.updateHandlers,
);
const loadUsageHandlers = lazyHandlerModule(
  () => import("./usage-CRw3DYO1.js"),
  (module) => module.usageHandlers,
);
const loadVoicewakeRoutingHandlers = lazyHandlerModule(
  () => import("./voicewake-routing-BqCV7APn.js"),
  (module) => module.voicewakeRoutingHandlers,
);
const loadVoicewakeHandlers = lazyHandlerModule(
  () => import("./voicewake-Bsf69yma.js"),
  (module) => module.voicewakeHandlers,
);
const loadWebHandlers = lazyHandlerModule(
  () => import("./web-1B2dJCZI.js"),
  (module) => module.webHandlers,
);
const loadCrestodianHandlers = lazyHandlerModule(
  () => import("./crestodian-BJeSpHZE.js"),
  (module) => module.crestodianHandlers,
);
const loadWizardHandlers = lazyHandlerModule(
  () => import("./wizard-Jb4d4s-X.js"),
  (module) => module.wizardHandlers,
);
function authorizeGatewayMethod(method, client, params, methodRegistry) {
  if (!client?.connect) return null;
  if (method === "health") return null;
  const roleRaw = client.connect.role ?? "operator";
  const role = parseGatewayRole(roleRaw);
  if (!role) return errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${roleRaw}`);
  const scopes = client.connect.scopes ?? [];
  if (!isRoleAuthorizedForMethod(role, method))
    return errorShape(ErrorCodes.INVALID_REQUEST, `unauthorized role: ${role}`);
  if (role === "node") return null;
  if (scopes.includes("operator.admin")) return null;
  const registeredScope = methodRegistry.getScope(method);
  const scopeAuth = isOperatorScope(registeredScope)
    ? authorizeOperatorScopesForRequiredScope(registeredScope, scopes)
    : authorizeOperatorScopesForMethod(method, scopes, params);
  if (!scopeAuth.allowed)
    return errorShape(ErrorCodes.INVALID_REQUEST, `missing scope: ${scopeAuth.missingScope}`);
  return null;
}
const SUSPEND_CONTROL_METHODS = /* @__PURE__ */ new Set([
  "gateway.suspend.prepare",
  "gateway.suspend.status",
  "gateway.suspend.resume",
]);
function isGatewayMethodAllowedDuringSuspension(method) {
  return SUSPEND_CONTROL_METHODS.has(method);
}
const coreGatewayHandlers = {
  ...createLazyCoreHandlers({
    methods: ["connect"],
    loadHandlers: loadConnectHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["attach.grant", "attach.revoke"],
    loadHandlers: loadAttachHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["logs.tail"],
    loadHandlers: loadLogsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "terminal.open",
      "terminal.input",
      "terminal.resize",
      "terminal.close",
      "terminal.attach",
      "terminal.list",
      "terminal.text",
    ],
    loadHandlers: loadTerminalHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["voicewake.get", "voicewake.set"],
    loadHandlers: loadVoicewakeHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["voicewake.routing.get", "voicewake.routing.set"],
    loadHandlers: loadVoicewakeRoutingHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["health", "status"],
    loadHandlers: loadHealthHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["channels.status", "channels.start", "channels.stop", "channels.logout"],
    loadHandlers: loadChannelsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "chat.history",
      "chat.startup",
      "chat.metadata",
      "chat.message.get",
      "chat.toolTitles",
      "chat.abort",
      "chat.send",
      "chat.inject",
    ],
    loadHandlers: loadChatHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["commands.list"],
    loadHandlers: loadCommandsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "wake",
      "cron.list",
      "cron.status",
      "cron.get",
      "cron.add",
      "cron.update",
      "cron.remove",
      "cron.run",
      "cron.runs",
    ],
    loadHandlers: loadCronHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "device.pair.list",
      "device.pair.approve",
      "device.pair.reject",
      "device.pair.remove",
      "device.pair.rename",
      "device.token.rotate",
      "device.token.revoke",
    ],
    loadHandlers: loadDeviceHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["device.pair.setupCode"],
    loadHandlers: loadDevicePairSetupHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["diagnostics.stability"],
    loadHandlers: loadDiagnosticsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["controlUi.githubPreview", "controlUi.sessionPullRequests"],
    loadHandlers: loadControlUiHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "doctor.memory.status",
      "doctor.memory.dreamDiary",
      "doctor.memory.backfillDreamDiary",
      "doctor.memory.resetDreamDiary",
      "doctor.memory.resetGroundedShortTerm",
      "doctor.memory.repairDreamingArtifacts",
      "doctor.memory.dedupeDreamDiary",
      "doctor.memory.remHarness",
    ],
    loadHandlers: loadDoctorHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "environments.list",
      "environments.status",
      "environments.create",
      "environments.destroy",
    ],
    loadHandlers: loadEnvironmentsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "worktrees.list",
      "worktrees.branches",
      "worktrees.create",
      "worktrees.remove",
      "worktrees.restore",
      "worktrees.gc",
    ],
    loadHandlers: loadWorktreesHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "exec.approvals.get",
      "exec.approvals.set",
      "exec.approvals.node.get",
      "exec.approvals.node.set",
    ],
    loadHandlers: loadExecApprovalsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["fs.listDir"],
    loadHandlers: loadFsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["web.login.start", "web.login.wait"],
    loadHandlers: loadWebHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["models.list"],
    loadHandlers: loadModelsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["models.probe"],
    loadHandlers: loadModelsProbeHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["models.authLogout", "models.authStatus"],
    loadHandlers: loadModelsAuthStatusHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["nativeHook.invoke"],
    loadHandlers: loadNativeHookRelayHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["plugins.uiDescriptors", "plugins.sessionAction"],
    loadHandlers: loadPluginHostHookHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "plugins.list",
      "plugins.search",
      "plugins.install",
      "plugins.setEnabled",
      "plugins.uninstall",
    ],
    loadHandlers: loadPluginsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "config.get",
      "config.schema",
      "config.schema.lookup",
      "config.set",
      "config.patch",
      "config.apply",
      "config.openFile",
    ],
    loadHandlers: loadConfigHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["wizard.start", "wizard.next", "wizard.cancel", "wizard.status"],
    loadHandlers: loadWizardHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "crestodian.chat",
      "crestodian.setup.detect",
      "crestodian.setup.verify",
      "crestodian.setup.activate",
      "crestodian.setup.auth.start",
    ],
    loadHandlers: loadCrestodianHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "talk.session.create",
      "talk.session.join",
      "talk.session.appendAudio",
      "talk.session.startTurn",
      "talk.session.endTurn",
      "talk.session.cancelTurn",
      "talk.session.cancelOutput",
      "talk.session.acknowledgeMark",
      "talk.session.submitToolResult",
      "talk.session.steer",
      "talk.session.close",
      "talk.client.create",
      "talk.client.toolCall",
      "talk.client.steer",
      "talk.catalog",
      "talk.config",
      "talk.speak",
      "talk.mode",
    ],
    loadHandlers: loadTalkHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["audit.list", "audit.activity.list"],
    loadHandlers: loadAuditHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["tasks.list", "tasks.get", "tasks.cancel"],
    loadHandlers: loadTasksHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "taskSuggestions.list",
      "taskSuggestions.create",
      "taskSuggestions.accept",
      "taskSuggestions.dismiss",
    ],
    loadHandlers: loadTaskSuggestionsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["tools.catalog"],
    loadHandlers: loadToolsCatalogHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["tools.effective"],
    loadHandlers: loadToolsEffectiveHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["tools.invoke"],
    loadHandlers: loadToolsInvokeHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "mcp.app.view",
      "mcp.app.callTool",
      "mcp.app.listTools",
      "mcp.app.listResources",
      "mcp.app.listResourceTemplates",
      "mcp.app.readResource",
    ],
    loadHandlers: loadMcpAppHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "tts.status",
      "tts.enable",
      "tts.disable",
      "tts.convert",
      "tts.speak",
      "tts.setProvider",
      "tts.personas",
      "tts.setPersona",
      "tts.providers",
    ],
    loadHandlers: loadTtsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: SKILLS_GATEWAY_METHOD_NAMES,
    loadHandlers: loadSkillsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "sessions.catalog.list",
      "sessions.catalog.read",
      "sessions.catalog.continue",
      "sessions.catalog.archive",
    ],
    loadHandlers: loadSessionCatalogHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "sessions.list",
      "sessions.search",
      "sessions.cleanup",
      "sessions.subscribe",
      "sessions.unsubscribe",
      "sessions.messages.subscribe",
      "sessions.messages.unsubscribe",
      "sessions.preview",
      "sessions.describe",
      "sessions.resolve",
      "sessions.compaction.list",
      "sessions.compaction.get",
      "sessions.create",
      "sessions.compaction.branch",
      "sessions.compaction.restore",
      "sessions.send",
      "sessions.steer",
      "sessions.abort",
      "sessions.patch",
      "sessions.pluginPatch",
      "sessions.reset",
      "sessions.delete",
      "sessions.get",
      "sessions.compact",
      "sessions.groups.list",
      "sessions.groups.put",
      "sessions.groups.rename",
      "sessions.groups.delete",
      "sessions.dispatch",
    ],
    loadHandlers: loadSessionsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "gateway.identity.get",
      "last-heartbeat",
      "set-heartbeats",
      "system-presence",
      "system.info",
      "system-event",
    ],
    loadHandlers: loadSystemHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["update.status", "update.run"],
    loadHandlers: loadUpdateHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      ...NODE_PAIR_GATEWAY_METHODS,
      "node.pair.remove",
      "node.rename",
      "node.list",
      "node.describe",
      "node.pluginSurface.refresh",
      "node.pluginTools.update",
      "node.skills.update",
      "node.pending.pull",
      "node.pending.ack",
      "node.invoke",
      "node.invoke.progress",
      "node.invoke.result",
      "node.event",
    ],
    loadHandlers: loadNodeHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["node.pending.drain", "node.pending.enqueue"],
    loadHandlers: loadNodePendingHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "push.test",
      "push.web.vapidPublicKey",
      "push.web.subscribe",
      "push.web.unsubscribe",
      "push.web.test",
    ],
    loadHandlers: loadPushHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["gateway.restart.request", "gateway.restart.preflight"],
    loadHandlers: loadRestartHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["gateway.suspend.prepare", "gateway.suspend.status", "gateway.suspend.resume"],
    loadHandlers: loadSuspendHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["message.action", "send", "poll"],
    loadHandlers: loadSendHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "usage.status",
      "usage.cost",
      "sessions.usage",
      "sessions.usage.timeseries",
      "sessions.usage.logs",
    ],
    loadHandlers: loadUsageHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["agent", "agent.identity.get", "agent.wait"],
    loadHandlers: loadAgentHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: [
      "agents.list",
      "agents.create",
      "agents.update",
      "agents.delete",
      "agents.files.list",
      "agents.files.get",
      "agents.files.set",
    ],
    loadHandlers: loadAgentsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["agents.workspace.list", "agents.workspace.get"],
    loadHandlers: loadAgentsWorkspaceHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["artifacts.list", "artifacts.get", "artifacts.download"],
    loadHandlers: loadArtifactsHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["sessions.files.list", "sessions.files.get", "sessions.files.set"],
    loadHandlers: loadSessionsFilesHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["sessions.diff"],
    loadHandlers: loadSessionsDiffHandlers,
  }),
  ...createLazyCoreHandlers({
    methods: ["migrations.memory.plan", "migrations.memory.apply"],
    loadHandlers: loadMigrationsHandlers,
  }),
};
/** Builds the per-request method registry from core, plugin, and explicit extra handlers. */
function createRequestGatewayMethodRegistry(extraHandlers) {
  const activePluginRegistry = getPluginRegistryState()?.activeRegistry;
  const activePluginHandlers = activePluginRegistry?.gatewayHandlers ?? {};
  const extraHandlerEntries = Object.entries(extraHandlers ?? {});
  const pluginMethodNames = new Set(Object.keys(activePluginHandlers));
  const coreDescriptorHandlers = { ...coreGatewayHandlers };
  for (const [method, extraHandler] of extraHandlerEntries)
    if (!pluginMethodNames.has(method) && isCoreGatewayMethodClassified(method))
      coreDescriptorHandlers[method] = extraHandler;
  const coreDescriptors = createCoreGatewayMethodDescriptors(coreDescriptorHandlers);
  for (const descriptor of coreDescriptors) {
    const extraHandler = extraHandlers?.[descriptor.name];
    if (extraHandler && !pluginMethodNames.has(descriptor.name)) descriptor.handler = extraHandler;
  }
  const coreMethodNames = new Set(coreDescriptors.map((descriptor) => descriptor.name));
  const auxHandlers = Object.fromEntries(
    extraHandlerEntries.filter(
      ([method]) => !pluginMethodNames.has(method) && !coreMethodNames.has(method),
    ),
  );
  return createGatewayMethodRegistry([
    ...coreDescriptors,
    ...(activePluginRegistry ? createPluginGatewayMethodDescriptors(activePluginRegistry) : []),
    ...createGatewayMethodDescriptorsFromHandlers({
      handlers: auxHandlers,
      owner: {
        kind: "aux",
        area: "gateway-extra",
      },
      defaultScope: ADMIN_SCOPE,
    }),
  ]);
}
/** Authorizes and dispatches one gateway JSON-RPC-style request. */
async function handleGatewayRequest(opts) {
  const { req, respond, client, isWebchatConnect, context } = opts;
  const methodRegistry =
    opts.methodRegistry?.getHandler(req.method) !== void 0
      ? opts.methodRegistry
      : createRequestGatewayMethodRegistry(opts.extraHandlers);
  const authError = authorizeGatewayMethod(req.method, client, req.params, methodRegistry);
  if (authError) {
    respond(false, void 0, authError);
    return;
  }
  if (context.unavailableGatewayMethods?.has(req.method)) {
    respond(
      false,
      void 0,
      errorShape(ErrorCodes.UNAVAILABLE, `${req.method} unavailable during gateway startup`, {
        retryable: true,
        retryAfterMs: 500,
        details: {
          ...gatewayStartupUnavailableDetails(),
          method: req.method,
        },
      }),
    );
    return;
  }
  const rejectRateLimitedControlPlaneWrite = () => {
    if (!methodRegistry.isControlPlaneWrite(req.method)) return false;
    const budget = consumeControlPlaneWriteBudget({ client });
    if (budget.allowed) return false;
    const actor = resolveControlPlaneActor(client);
    context.logGateway.warn(
      `control-plane write rate-limited method=${req.method} ${formatControlPlaneActor(actor)} retryAfterMs=${budget.retryAfterMs} key=${budget.key}`,
    );
    respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.UNAVAILABLE,
        `rate limit exceeded for ${req.method}; retry after ${Math.ceil(budget.retryAfterMs / 1e3)}s`,
        {
          retryable: true,
          retryAfterMs: budget.retryAfterMs,
          details: {
            method: req.method,
            limit: "3 per 60s",
          },
        },
      ),
    );
    return true;
  };
  const isSuspendPrepare = req.method === "gateway.suspend.prepare";
  if (isSuspendPrepare && rejectRateLimitedControlPlaneWrite()) return;
  const handler = methodRegistry.getHandler(req.method);
  if (!handler) {
    respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown method: ${req.method}`));
    return;
  }
  const rootWorkAdmission = tryBeginGatewayRootWorkAdmission();
  if (
    req.method === "gateway.suspend.prepare" &&
    rootWorkAdmission &&
    !rootWorkAdmission.ownsRoot
  ) {
    respond(
      false,
      void 0,
      errorShape(ErrorCodes.UNAVAILABLE, "gateway suspension cannot begin from a nested request", {
        retryable: true,
        retryAfterMs: 1e3,
        details: {
          method: req.method,
          reason: "nested-gateway-request",
        },
      }),
    );
    return;
  }
  if (!rootWorkAdmission && !isGatewayMethodAllowedDuringSuspension(req.method)) {
    const restartDraining = isGatewayRestartDraining();
    respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.UNAVAILABLE,
        `${req.method} unavailable during gateway ${restartDraining ? "restart" : "suspension"}`,
        {
          retryable: true,
          retryAfterMs: 1e3,
          details: {
            method: req.method,
            reason: restartDraining ? "gateway-restarting" : "gateway-suspending",
            phase: getGatewaySuspendAdmissionPhase(),
          },
        },
      ),
    );
    return;
  }
  if (!isSuspendPrepare && rejectRateLimitedControlPlaneWrite()) {
    rootWorkAdmission?.release();
    return;
  }
  const invokeHandler = () =>
    handler({
      req,
      params: req.params ?? {},
      client,
      isWebchatConnect,
      respond,
      context,
    });
  const invokeWithRequestScope = async () =>
    await withPluginRuntimeGatewayRequestScope(
      {
        context,
        client,
        isWebchatConnect,
      },
      invokeHandler,
    );
  if (!rootWorkAdmission) {
    await invokeWithRequestScope();
    return;
  }
  try {
    await rootWorkAdmission.run(invokeWithRequestScope);
  } finally {
    rootWorkAdmission.release();
  }
}
//#endregion
export { coreGatewayHandlers, handleGatewayRequest };
