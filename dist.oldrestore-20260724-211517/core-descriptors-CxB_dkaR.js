//#region src/gateway/methods/descriptor.ts
/** Scope marker for methods that only authenticated node clients may call. */
const NODE_GATEWAY_METHOD_SCOPE = "node";
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
const DYNAMIC_GATEWAY_METHOD_SCOPE = "dynamic";
//#endregion
//#region src/gateway/methods/core-descriptors.ts
const CORE_GATEWAY_METHOD_SPECS = [
  {
    name: "health",
    scope: "operator.read",
  },
  {
    name: "diagnostics.stability",
    scope: "operator.read",
  },
  {
    name: "doctor.memory.status",
    scope: "operator.read",
  },
  {
    name: "doctor.memory.dreamDiary",
    scope: "operator.read",
  },
  {
    name: "doctor.memory.backfillDreamDiary",
    scope: "operator.write",
  },
  {
    name: "doctor.memory.resetDreamDiary",
    scope: "operator.write",
  },
  {
    name: "doctor.memory.resetGroundedShortTerm",
    scope: "operator.write",
  },
  {
    name: "doctor.memory.repairDreamingArtifacts",
    scope: "operator.write",
  },
  {
    name: "doctor.memory.dedupeDreamDiary",
    scope: "operator.write",
  },
  {
    name: "doctor.memory.remHarness",
    scope: "operator.read",
  },
  {
    name: "logs.tail",
    scope: "operator.read",
  },
  {
    name: "channels.status",
    scope: "operator.read",
  },
  {
    name: "channels.start",
    scope: "operator.admin",
  },
  {
    name: "channels.stop",
    scope: "operator.admin",
  },
  {
    name: "channels.logout",
    scope: "operator.admin",
  },
  {
    name: "status",
    scope: "operator.read",
  },
  {
    name: "usage.status",
    scope: "operator.read",
  },
  {
    name: "usage.cost",
    scope: "operator.read",
  },
  {
    name: "tts.status",
    scope: "operator.read",
  },
  {
    name: "tts.providers",
    scope: "operator.read",
  },
  {
    name: "tts.personas",
    scope: "operator.read",
  },
  {
    name: "tts.enable",
    scope: "operator.write",
  },
  {
    name: "tts.disable",
    scope: "operator.write",
  },
  {
    name: "tts.convert",
    scope: "operator.write",
  },
  {
    name: "tts.setProvider",
    scope: "operator.write",
  },
  {
    name: "tts.setPersona",
    scope: "operator.write",
  },
  {
    name: "config.get",
    scope: "operator.read",
  },
  {
    name: "config.set",
    scope: "operator.admin",
  },
  {
    name: "config.apply",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "config.patch",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "config.schema",
    scope: "operator.admin",
  },
  {
    name: "config.schema.lookup",
    scope: "operator.read",
  },
  {
    name: "exec.approvals.get",
    scope: "operator.admin",
  },
  {
    name: "exec.approvals.set",
    scope: "operator.admin",
  },
  {
    name: "exec.approvals.node.get",
    scope: "operator.admin",
  },
  {
    name: "exec.approvals.node.set",
    scope: "operator.admin",
  },
  {
    name: "exec.approval.get",
    scope: "operator.approvals",
  },
  {
    name: "exec.approval.list",
    scope: "operator.approvals",
  },
  {
    name: "exec.approval.request",
    scope: "operator.approvals",
  },
  {
    name: "exec.approval.waitDecision",
    scope: "operator.approvals",
  },
  {
    name: "exec.approval.resolve",
    scope: "operator.approvals",
  },
  {
    name: "plugin.approval.list",
    scope: "operator.approvals",
  },
  {
    name: "plugin.approval.request",
    scope: "operator.approvals",
  },
  {
    name: "plugin.approval.waitDecision",
    scope: "operator.approvals",
  },
  {
    name: "plugin.approval.resolve",
    scope: "operator.approvals",
  },
  {
    name: "plugins.uiDescriptors",
    scope: "operator.read",
  },
  {
    name: "plugins.sessionAction",
    scope: "dynamic",
  },
  {
    name: "crestodian.chat",
    scope: "operator.admin",
  },
  {
    name: "crestodian.setup.detect",
    scope: "operator.admin",
  },
  {
    name: "crestodian.setup.activate",
    scope: "operator.admin",
  },
  {
    name: "crestodian.setup.auth.start",
    scope: "operator.admin",
  },
  {
    name: "wizard.start",
    scope: "operator.admin",
  },
  {
    name: "wizard.next",
    scope: "operator.admin",
  },
  {
    name: "wizard.cancel",
    scope: "operator.admin",
  },
  {
    name: "wizard.status",
    scope: "operator.admin",
  },
  {
    name: "talk.catalog",
    scope: "operator.read",
  },
  {
    name: "talk.config",
    scope: "operator.read",
  },
  {
    name: "talk.client.create",
    scope: "operator.write",
  },
  {
    name: "talk.client.toolCall",
    scope: "operator.write",
  },
  {
    name: "talk.client.steer",
    scope: "operator.write",
  },
  {
    name: "talk.session.create",
    scope: "operator.write",
  },
  {
    name: "talk.session.join",
    scope: "operator.write",
  },
  {
    name: "talk.session.appendAudio",
    scope: "operator.write",
  },
  {
    name: "talk.session.startTurn",
    scope: "operator.write",
  },
  {
    name: "talk.session.endTurn",
    scope: "operator.write",
  },
  {
    name: "talk.session.cancelTurn",
    scope: "operator.write",
  },
  {
    name: "talk.session.cancelOutput",
    scope: "operator.write",
  },
  {
    name: "talk.session.acknowledgeMark",
    scope: "operator.write",
  },
  {
    name: "talk.session.submitToolResult",
    scope: "operator.write",
  },
  {
    name: "talk.session.steer",
    scope: "operator.write",
  },
  {
    name: "talk.session.close",
    scope: "operator.write",
  },
  {
    name: "talk.speak",
    scope: "operator.write",
  },
  {
    name: "talk.mode",
    scope: "operator.write",
  },
  {
    name: "commands.list",
    scope: "operator.read",
  },
  {
    name: "models.list",
    scope: "operator.read",
    startup: true,
  },
  {
    name: "models.authStatus",
    scope: "operator.read",
  },
  {
    name: "models.authLogout",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "tools.catalog",
    scope: "operator.read",
  },
  {
    name: "tools.effective",
    scope: "operator.read",
    startup: true,
  },
  {
    name: "tools.invoke",
    scope: "operator.write",
  },
  {
    name: "mcp.app.view",
    scope: "operator.read",
  },
  {
    name: "mcp.app.listTools",
    scope: "operator.read",
  },
  {
    name: "mcp.app.listResources",
    scope: "operator.read",
  },
  {
    name: "mcp.app.listResourceTemplates",
    scope: "operator.read",
  },
  {
    name: "mcp.app.readResource",
    scope: "operator.read",
  },
  {
    name: "mcp.app.callTool",
    scope: "operator.write",
  },
  {
    name: "audit.list",
    scope: "operator.read",
  },
  {
    name: "audit.activity.list",
    scope: "operator.read",
  },
  {
    name: "tasks.list",
    scope: "operator.read",
  },
  {
    name: "tasks.get",
    scope: "operator.read",
  },
  {
    name: "tasks.cancel",
    scope: "operator.write",
  },
  {
    name: "taskSuggestions.list",
    scope: "operator.read",
  },
  {
    name: "taskSuggestions.create",
    scope: "operator.write",
  },
  {
    name: "taskSuggestions.accept",
    scope: "operator.admin",
  },
  {
    name: "taskSuggestions.dismiss",
    scope: "operator.write",
  },
  {
    name: "environments.list",
    scope: "operator.read",
  },
  {
    name: "environments.status",
    scope: "operator.read",
  },
  {
    name: "worktrees.list",
    scope: "operator.read",
  },
  {
    name: "worktrees.branches",
    scope: "operator.write",
  },
  {
    name: "fs.listDir",
    scope: "operator.admin",
  },
  {
    name: "worktrees.create",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "worktrees.remove",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "worktrees.restore",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "worktrees.gc",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "agents.list",
    scope: "operator.read",
  },
  {
    name: "agents.create",
    scope: "operator.admin",
  },
  {
    name: "agents.update",
    scope: "operator.admin",
  },
  {
    name: "agents.delete",
    scope: "operator.admin",
  },
  {
    name: "agents.files.list",
    scope: "operator.read",
  },
  {
    name: "agents.files.get",
    scope: "operator.read",
  },
  {
    name: "agents.files.set",
    scope: "operator.admin",
  },
  {
    name: "sessions.files.list",
    scope: "operator.read",
  },
  {
    name: "sessions.files.get",
    scope: "operator.read",
  },
  {
    name: "sessions.files.set",
    scope: "operator.admin",
  },
  {
    name: "artifacts.list",
    scope: "operator.read",
  },
  {
    name: "artifacts.get",
    scope: "operator.read",
  },
  {
    name: "artifacts.download",
    scope: "operator.read",
  },
  {
    name: "skills.status",
    scope: "operator.read",
  },
  {
    name: "skills.search",
    scope: "operator.read",
  },
  {
    name: "skills.detail",
    scope: "operator.read",
  },
  {
    name: "skills.securityVerdicts",
    scope: "operator.read",
  },
  {
    name: "skills.skillCard",
    scope: "operator.read",
  },
  {
    name: "skills.bins",
    scope: "node",
  },
  {
    name: "skills.upload.begin",
    scope: "operator.admin",
  },
  {
    name: "skills.upload.chunk",
    scope: "operator.admin",
  },
  {
    name: "skills.upload.commit",
    scope: "operator.admin",
  },
  {
    name: "skills.install",
    scope: "operator.admin",
  },
  {
    name: "skills.update",
    scope: "operator.admin",
  },
  {
    name: "skills.curator.status",
    scope: "operator.read",
  },
  {
    name: "skills.curator.pin",
    scope: "operator.admin",
  },
  {
    name: "skills.curator.unpin",
    scope: "operator.admin",
  },
  {
    name: "skills.curator.restore",
    scope: "operator.admin",
  },
  {
    name: "skills.proposals.list",
    scope: "operator.read",
  },
  {
    name: "skills.proposals.inspect",
    scope: "operator.read",
  },
  {
    name: "skills.proposals.historyStatus",
    scope: "operator.read",
  },
  {
    name: "skills.proposals.historyScan",
    scope: "operator.admin",
  },
  {
    name: "skills.proposals.create",
    scope: "operator.admin",
  },
  {
    name: "skills.proposals.update",
    scope: "operator.admin",
  },
  {
    name: "skills.proposals.revise",
    scope: "operator.admin",
  },
  {
    name: "skills.proposals.requestRevision",
    scope: "operator.admin",
  },
  {
    name: "skills.proposals.apply",
    scope: "operator.admin",
  },
  {
    name: "skills.proposals.reject",
    scope: "operator.admin",
  },
  {
    name: "skills.proposals.quarantine",
    scope: "operator.admin",
  },
  {
    name: "update.status",
    scope: "operator.admin",
  },
  {
    name: "update.run",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "voicewake.get",
    scope: "operator.read",
  },
  {
    name: "voicewake.set",
    scope: "operator.write",
  },
  {
    name: "secrets.reload",
    scope: "operator.admin",
  },
  {
    name: "secrets.resolve",
    scope: "operator.admin",
  },
  {
    name: "voicewake.routing.get",
    scope: "operator.read",
  },
  {
    name: "voicewake.routing.set",
    scope: "operator.write",
  },
  {
    name: "sessions.list",
    scope: "operator.read",
    startup: true,
  },
  {
    name: "sessions.subscribe",
    scope: "operator.read",
  },
  {
    name: "sessions.unsubscribe",
    scope: "operator.read",
  },
  {
    name: "sessions.messages.subscribe",
    scope: "operator.read",
  },
  {
    name: "sessions.messages.unsubscribe",
    scope: "operator.read",
  },
  {
    name: "sessions.preview",
    scope: "operator.read",
  },
  {
    name: "sessions.describe",
    scope: "operator.read",
  },
  {
    name: "sessions.compaction.list",
    scope: "operator.read",
  },
  {
    name: "sessions.compaction.get",
    scope: "operator.read",
  },
  {
    name: "sessions.compaction.branch",
    scope: "operator.write",
  },
  {
    name: "sessions.compaction.restore",
    scope: "operator.admin",
  },
  {
    name: "sessions.create",
    scope: "dynamic",
    startup: true,
  },
  {
    name: "sessions.send",
    scope: "operator.write",
    startup: true,
  },
  {
    name: "sessions.abort",
    scope: "operator.write",
    startup: true,
  },
  {
    name: "sessions.patch",
    scope: "dynamic",
  },
  {
    name: "sessions.pluginPatch",
    scope: "operator.admin",
  },
  {
    name: "sessions.cleanup",
    scope: "operator.admin",
  },
  {
    name: "sessions.reset",
    scope: "operator.admin",
  },
  {
    name: "sessions.delete",
    scope: "dynamic",
  },
  {
    name: "sessions.compact",
    scope: "operator.admin",
  },
  {
    name: "sessions.groups.list",
    scope: "operator.read",
  },
  {
    name: "sessions.groups.put",
    scope: "operator.write",
  },
  {
    name: "sessions.groups.rename",
    scope: "operator.write",
  },
  {
    name: "sessions.groups.delete",
    scope: "operator.write",
  },
  {
    name: "last-heartbeat",
    scope: "operator.read",
  },
  {
    name: "set-heartbeats",
    scope: "operator.admin",
  },
  {
    name: "wake",
    scope: "operator.write",
  },
  {
    name: "node.pair.list",
    scope: "operator.pairing",
  },
  {
    name: "node.pair.approve",
    scope: "operator.pairing",
  },
  {
    name: "node.pair.reject",
    scope: "operator.pairing",
  },
  {
    name: "node.pair.remove",
    scope: "operator.pairing",
  },
  {
    name: "device.pair.list",
    scope: "operator.pairing",
  },
  {
    name: "device.pair.approve",
    scope: "operator.pairing",
  },
  {
    name: "device.pair.reject",
    scope: "operator.pairing",
  },
  {
    name: "device.pair.remove",
    scope: "operator.pairing",
  },
  {
    name: "device.pair.rename",
    scope: "operator.pairing",
  },
  {
    name: "device.token.rotate",
    scope: "operator.pairing",
  },
  {
    name: "device.token.revoke",
    scope: "operator.pairing",
  },
  {
    name: "device.pair.setupCode",
    scope: "operator.admin",
    advertise: false,
  },
  {
    name: "node.rename",
    scope: "operator.pairing",
  },
  {
    name: "node.list",
    scope: "operator.read",
  },
  {
    name: "node.describe",
    scope: "operator.read",
  },
  {
    name: "node.pluginSurface.refresh",
    scope: "node",
  },
  {
    name: "node.pluginTools.update",
    scope: "node",
  },
  {
    name: "node.skills.update",
    scope: "node",
  },
  {
    name: "node.pending.drain",
    scope: "node",
  },
  {
    name: "node.pending.enqueue",
    scope: "operator.write",
  },
  {
    name: "node.invoke",
    scope: "operator.write",
  },
  {
    name: "node.pending.pull",
    scope: "node",
  },
  {
    name: "node.pending.ack",
    scope: "node",
  },
  {
    name: "node.invoke.progress",
    scope: "node",
  },
  {
    name: "node.invoke.result",
    scope: "node",
  },
  {
    name: "node.event",
    scope: "node",
  },
  {
    name: "cron.get",
    scope: "operator.read",
  },
  {
    name: "cron.list",
    scope: "operator.read",
  },
  {
    name: "cron.status",
    scope: "operator.read",
  },
  {
    name: "cron.add",
    scope: "operator.admin",
  },
  {
    name: "cron.update",
    scope: "operator.admin",
  },
  {
    name: "cron.remove",
    scope: "operator.admin",
  },
  {
    name: "cron.run",
    scope: "operator.admin",
  },
  {
    name: "cron.runs",
    scope: "operator.read",
  },
  {
    name: "gateway.identity.get",
    scope: "operator.read",
  },
  {
    name: "gateway.restart.preflight",
    scope: "operator.read",
  },
  {
    name: "gateway.restart.request",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "system-presence",
    scope: "operator.read",
  },
  {
    name: "system-event",
    scope: "operator.admin",
  },
  {
    name: "message.action",
    scope: "operator.write",
  },
  {
    name: "send",
    scope: "operator.write",
  },
  {
    name: "agent",
    scope: "operator.write",
  },
  {
    name: "agent.identity.get",
    scope: "operator.read",
  },
  {
    name: "agent.wait",
    scope: "operator.write",
    startup: true,
  },
  {
    name: "chat.history",
    scope: "operator.read",
    startup: true,
  },
  {
    name: "chat.startup",
    scope: "operator.read",
    startup: true,
  },
  {
    name: "chat.metadata",
    scope: "operator.read",
    startup: true,
  },
  {
    name: "chat.message.get",
    scope: "operator.read",
    startup: true,
  },
  {
    name: "chat.abort",
    scope: "operator.write",
  },
  {
    name: "chat.send",
    scope: "operator.write",
  },
  {
    name: "terminal.open",
    scope: "operator.admin",
  },
  {
    name: "terminal.input",
    scope: "operator.admin",
  },
  {
    name: "terminal.resize",
    scope: "operator.admin",
  },
  {
    name: "terminal.close",
    scope: "operator.admin",
  },
  {
    name: "assistant.media.get",
    scope: "operator.read",
    advertise: false,
  },
  {
    name: "sessions.get",
    scope: "operator.read",
    advertise: false,
  },
  {
    name: "sessions.resolve",
    scope: "operator.read",
    advertise: false,
  },
  {
    name: "sessions.usage",
    scope: "operator.read",
    advertise: false,
  },
  {
    name: "sessions.usage.timeseries",
    scope: "operator.read",
    advertise: false,
  },
  {
    name: "sessions.usage.logs",
    scope: "operator.read",
    advertise: false,
  },
  {
    name: "poll",
    scope: "operator.write",
    advertise: false,
  },
  {
    name: "sessions.steer",
    scope: "operator.write",
    advertise: false,
  },
  {
    name: "push.test",
    scope: "operator.write",
    advertise: false,
  },
  {
    name: "attach.grant",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "attach.revoke",
    scope: "operator.admin",
  },
  {
    name: "push.web.vapidPublicKey",
    scope: "operator.write",
    advertise: false,
  },
  {
    name: "push.web.subscribe",
    scope: "operator.write",
    advertise: false,
  },
  {
    name: "push.web.unsubscribe",
    scope: "operator.write",
    advertise: false,
  },
  {
    name: "push.web.test",
    scope: "operator.write",
    advertise: false,
  },
  {
    name: "config.openFile",
    scope: "operator.admin",
    advertise: false,
  },
  {
    name: "connect",
    scope: "operator.admin",
    advertise: false,
  },
  {
    name: "chat.inject",
    scope: "operator.admin",
    advertise: false,
  },
  {
    name: "nativeHook.invoke",
    scope: "operator.admin",
    advertise: false,
  },
  {
    name: "web.login.start",
    scope: "operator.admin",
    advertise: false,
  },
  {
    name: "web.login.wait",
    scope: "operator.admin",
    advertise: false,
  },
  {
    name: "terminal.attach",
    scope: "operator.admin",
  },
  {
    name: "terminal.list",
    scope: "operator.admin",
  },
  {
    name: "terminal.text",
    scope: "operator.admin",
  },
  {
    name: "controlUi.githubPreview",
    scope: "operator.read",
  },
  {
    name: "system.info",
    scope: "operator.read",
  },
  {
    name: "agents.workspace.list",
    scope: "operator.read",
  },
  {
    name: "agents.workspace.get",
    scope: "operator.read",
  },
  {
    name: "tts.speak",
    scope: "operator.write",
  },
  {
    name: "plugins.list",
    scope: "operator.read",
  },
  {
    name: "plugins.search",
    scope: "operator.read",
  },
  {
    name: "plugins.install",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "plugins.setEnabled",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "plugins.uninstall",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
  {
    name: "controlUi.sessionPullRequests",
    scope: "operator.read",
  },
  {
    name: "gateway.suspend.prepare",
    scope: "operator.admin",
    startup: true,
    controlPlaneWrite: true,
  },
  {
    name: "gateway.suspend.status",
    scope: "operator.read",
  },
  {
    name: "gateway.suspend.resume",
    scope: "operator.admin",
  },
  {
    name: "chat.toolTitles",
    scope: "operator.write",
  },
  {
    name: "sessions.diff",
    scope: "operator.read",
  },
  {
    name: "crestodian.setup.verify",
    scope: "operator.admin",
  },
  {
    name: "environments.create",
    scope: "operator.admin",
    startup: true,
    controlPlaneWrite: true,
  },
  {
    name: "environments.destroy",
    scope: "operator.admin",
    startup: true,
    controlPlaneWrite: true,
  },
  {
    name: "sessions.catalog.list",
    scope: "operator.read",
  },
  {
    name: "sessions.catalog.read",
    scope: "operator.read",
  },
  {
    name: "sessions.catalog.continue",
    scope: "operator.write",
  },
  {
    name: "sessions.catalog.archive",
    scope: "operator.write",
  },
  {
    name: "approval.get",
    scope: "operator.approvals",
  },
  {
    name: "approval.resolve",
    scope: "operator.approvals",
  },
  {
    name: "sessions.search",
    scope: "operator.read",
  },
  {
    name: "sessions.dispatch",
    scope: "operator.admin",
    startup: true,
    controlPlaneWrite: true,
  },
  {
    name: "models.probe",
    scope: "operator.admin",
  },
  {
    name: "migrations.memory.plan",
    scope: "operator.admin",
  },
  {
    name: "migrations.memory.apply",
    scope: "operator.admin",
    controlPlaneWrite: true,
  },
];
const CORE_GATEWAY_METHOD_SPEC_BY_NAME = new Map(
  CORE_GATEWAY_METHOD_SPECS.map((spec) => [spec.name, spec]),
);
/** Core methods that are listed early but return retryable unavailable until sidecars are ready. */
const STARTUP_UNAVAILABLE_GATEWAY_METHODS = CORE_GATEWAY_METHOD_SPECS.filter(
  (spec) => spec.startup === true,
).map((spec) => spec.name);
/** Returns the core methods that should be advertised to external gateway clients. */
function listCoreAdvertisedGatewayMethodNames() {
  return CORE_GATEWAY_METHOD_SPECS.filter((spec) => spec.advertise !== false).map(
    (spec) => spec.name,
  );
}
/** Returns all registered core method names, including hidden/internal compatibility methods. */
function listCoreGatewayMethodNames() {
  return CORE_GATEWAY_METHOD_SPECS.map((spec) => spec.name);
}
/** Looks up the raw core method scope, including node and dynamic sentinel scopes. */
function resolveCoreGatewayMethodScope(method) {
  return CORE_GATEWAY_METHOD_SPEC_BY_NAME.get(method)?.scope;
}
/** Looks up an operator-only core method scope, excluding node and dynamic methods. */
function resolveCoreOperatorGatewayMethodScope(method) {
  const scope = resolveCoreGatewayMethodScope(method);
  return scope === "node" || scope === "dynamic" ? void 0 : scope;
}
/** Returns true for core methods reserved for authenticated node clients. */
function isCoreNodeGatewayMethod(method) {
  return resolveCoreGatewayMethodScope(method) === NODE_GATEWAY_METHOD_SCOPE;
}
/** Returns true for core methods whose required operator scope is resolved by the handler. */
function isDynamicOperatorGatewayMethod(method) {
  return resolveCoreGatewayMethodScope(method) === DYNAMIC_GATEWAY_METHOD_SCOPE;
}
/** Returns true when a method name has an explicit core policy entry. */
function isCoreGatewayMethodClassified(method) {
  return CORE_GATEWAY_METHOD_SPEC_BY_NAME.has(method);
}
/** Creates dispatch descriptors for core handlers and fails if any handler lacks policy. */
function createCoreGatewayMethodDescriptors(handlers) {
  const descriptors = [];
  const specNames = /* @__PURE__ */ new Set();
  for (const spec of CORE_GATEWAY_METHOD_SPECS) {
    specNames.add(spec.name);
    const handler = handlers[spec.name];
    if (!handler) continue;
    descriptors.push({
      name: spec.name,
      handler,
      owner: {
        kind: "core",
        area: "gateway",
      },
      scope: spec.scope,
      ...(spec.advertise === false ? { advertise: false } : {}),
      ...(spec.startup === true ? { startup: "unavailable-until-sidecars" } : {}),
      ...(spec.controlPlaneWrite === true ? { controlPlaneWrite: true } : {}),
    });
  }
  for (const name of Object.keys(handlers))
    if (!specNames.has(name))
      throw new Error(`gateway method handler is missing a descriptor: ${name}`);
  return descriptors;
}
//#endregion
export {
  isDynamicOperatorGatewayMethod as a,
  resolveCoreOperatorGatewayMethodScope as c,
  isCoreNodeGatewayMethod as i,
  DYNAMIC_GATEWAY_METHOD_SCOPE as l,
  createCoreGatewayMethodDescriptors as n,
  listCoreAdvertisedGatewayMethodNames as o,
  isCoreGatewayMethodClassified as r,
  listCoreGatewayMethodNames as s,
  STARTUP_UNAVAILABLE_GATEWAY_METHODS as t,
  NODE_GATEWAY_METHOD_SCOPE as u,
};
