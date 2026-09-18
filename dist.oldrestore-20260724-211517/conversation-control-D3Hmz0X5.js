import { n as resolveCodexBindingAppServerConnection } from "./binding-connection-D_wKlTHe.js";
import "./model-session-runtime-C8Tj7-5X.js";
import { t as CODEX_CONTROL_METHODS } from "./capabilities-BTxju7z9.js";
import { r as formatCodexDisplayText } from "./command-formatters-BGtw1ew1.js";
import {
  c as isCodexFastServiceTier,
  f as resolveCodexAppServerRuntimeOptions,
  g as resolveCodexModelBackedReviewerPolicyContext,
} from "./config-C1imjxk6.js";
import { r as ModelSelectionLockedError } from "./model-overrides-BlzAR7Nc.js";
import {
  c as isCodexAppServerNativeAuthProfile,
  i as bindingStoreKey,
  l as normalizeCodexAppServerBindingModelProvider,
} from "./session-binding-CxW6VTON.js";
import {
  c as getLeasedSharedCodexAppServerClient,
  d as releaseLeasedSharedCodexAppServerClient,
  g as withLeasedCodexAppServerClientStartSelectionRetry,
  u as releaseCodexAppServerClientLease,
} from "./shared-client-a36Mluj-.js";
import {
  f as resolveCodexAppServerRequestModelSelection,
  m as resolveCodexBindingModelProviderFallback,
} from "./thread-lifecycle-BI8tSeEg.js";
//#region extensions/codex/src/command-authorization.ts
const CODEX_NATIVE_EXECUTION_AUTH_ERROR =
  "Only an owner or operator.admin can control Codex native execution.";
function canMutateCodexHost(ctx) {
  return ctx.senderIsOwner === true || ctx.gatewayClientScopes?.includes("operator.admin") === true;
}
//#endregion
//#region extensions/codex/src/conversation-control.ts
const CODEX_CONVERSATION_CONTROL_STATE = Symbol.for("openclaw.codex.conversationControl");
function getActiveTurns() {
  const globalState = globalThis;
  globalState[CODEX_CONVERSATION_CONTROL_STATE] ??= /* @__PURE__ */ new Map();
  return globalState[CODEX_CONVERSATION_CONTROL_STATE];
}
function trackCodexConversationActiveTurn(active) {
  const activeTurns = getActiveTurns();
  const key = bindingStoreKey(active.identity);
  activeTurns.set(key, active);
  return () => {
    if (activeTurns.get(key)?.turnId === active.turnId) activeTurns.delete(key);
  };
}
function readCodexConversationActiveTurn(identity) {
  return getActiveTurns().get(bindingStoreKey(identity));
}
async function stopCodexConversationTurn(params) {
  const active = readCodexConversationActiveTurn(params.identity);
  if (!active)
    return {
      stopped: false,
      message: "No active Codex run to stop.",
    };
  const lookup = buildBindingLookup(params);
  const binding = await params.bindingStore.read(params.identity);
  if (binding?.threadId !== active.threadId)
    return {
      stopped: false,
      message: "The active Codex run no longer matches this session binding.",
    };
  const connection = resolveCodexBindingAppServerConnection({
    binding,
    authProfileId: binding?.authProfileId,
    pluginConfig: params.pluginConfig,
  });
  const runtime = connection.appServer;
  const client =
    active.client ??
    (await getLeasedSharedCodexAppServerClient({
      startOptions: runtime.start,
      timeoutMs: runtime.requestTimeoutMs,
      authProfileId: connection.clientAuthProfileId,
      ...lookup,
    }));
  try {
    await client.request(
      "turn/interrupt",
      {
        threadId: active.threadId,
        turnId: active.turnId,
      },
      { timeoutMs: runtime.requestTimeoutMs },
    );
  } finally {
    if (!active.client) releaseLeasedSharedCodexAppServerClient(client);
  }
  return {
    stopped: true,
    message: "Codex stop requested.",
  };
}
async function steerCodexConversationTurn(params) {
  const active = readCodexConversationActiveTurn(params.identity);
  const text = params.message.trim();
  if (!text)
    return {
      steered: false,
      message: "Usage: /codex steer <message>",
    };
  if (!active)
    return {
      steered: false,
      message: "No active Codex run to steer.",
    };
  const lookup = buildBindingLookup(params);
  const binding = await params.bindingStore.read(params.identity);
  if (binding?.threadId !== active.threadId)
    return {
      steered: false,
      message: "The active Codex run no longer matches this session binding.",
    };
  const connection = resolveCodexBindingAppServerConnection({
    binding,
    authProfileId: binding?.authProfileId,
    pluginConfig: params.pluginConfig,
  });
  const runtime = connection.appServer;
  const client =
    active.client ??
    (await getLeasedSharedCodexAppServerClient({
      startOptions: runtime.start,
      timeoutMs: runtime.requestTimeoutMs,
      authProfileId: connection.clientAuthProfileId,
      ...lookup,
    }));
  try {
    await client.request(
      "turn/steer",
      {
        threadId: active.threadId,
        expectedTurnId: active.turnId,
        input: [
          {
            type: "text",
            text,
            text_elements: [],
          },
        ],
      },
      { timeoutMs: runtime.requestTimeoutMs },
    );
  } finally {
    if (!active.client) releaseLeasedSharedCodexAppServerClient(client);
  }
  return {
    steered: true,
    message: "Sent steer message to Codex.",
  };
}
async function setCodexConversationModel(params) {
  const model = params.model.trim();
  if (!model) return "Usage: /codex model <model>";
  const lookup = buildBindingLookup(params);
  const binding = await requireThreadBinding(params.bindingStore, params.identity);
  if (binding.connectionScope === "supervision") throw new ModelSelectionLockedError();
  const reviewerPolicyContext = resolveCodexModelBackedReviewerPolicyContext({
    provider: "codex",
    model,
    bindingModelProvider: binding.modelProvider,
    bindingModel: binding.model,
    nativeAuthProfile: isCodexAppServerNativeAuthProfile({
      authProfileId: binding.authProfileId,
      ...lookup,
    }),
  });
  const runtime = resolveCodexAppServerRuntimeOptions({
    pluginConfig: params.pluginConfig,
    modelProvider: reviewerPolicyContext.modelProvider,
    model: reviewerPolicyContext.model,
    config: params.config,
    agentDir: params.agentDir,
  });
  const modelSelection = resolveCodexAppServerRequestModelSelection({
    model,
    modelProvider: resolveConversationControlModelProvider({
      authProfileId: binding.authProfileId,
      bindingModel: binding.model,
      bindingModelProvider: binding.modelProvider,
      currentModel: model,
      ...lookup,
    }),
    authProfileId: binding.authProfileId,
    ...lookup,
  });
  const resumed = await resumeThreadWithOverrides({
    runtime,
    threadId: binding.threadId,
    authProfileId: binding.authProfileId,
    ...lookup,
    model: modelSelection.model,
    modelProvider: modelSelection.modelProvider,
  });
  const response = resumed.response;
  const nextModel = response.model ?? modelSelection.model;
  const nextModelProvider = normalizeCodexAppServerBindingModelProvider({
    authProfileId: binding.authProfileId,
    modelProvider: response.modelProvider ?? modelSelection.modelProvider,
    ...lookup,
  });
  const modelChanged = nextModel !== binding.model || nextModelProvider !== binding.modelProvider;
  await patchThreadBinding(params.bindingStore, params.identity, binding.threadId, {
    clientId: resumed.clientId,
    cwd: response.thread.cwd ?? binding.cwd,
    model: nextModel,
    modelProvider: nextModelProvider,
    ...(modelChanged && binding.contextEngine?.projection
      ? {
          contextEngine: {
            ...binding.contextEngine,
            projection: void 0,
          },
        }
      : {}),
    approvalPolicy: binding.approvalPolicy,
    sandbox: binding.sandbox,
    serviceTier: binding.serviceTier ?? runtime.serviceTier ?? void 0,
  });
  return `Codex model set to ${formatCodexDisplayText(response.model ?? model)}.`;
}
async function setCodexConversationFastMode(params) {
  const binding = await requireThreadBinding(params.bindingStore, params.identity);
  if (params.enabled == null)
    return `Codex fast mode: ${isCodexFastServiceTier(binding.serviceTier) ? "on" : "off"}.`;
  const serviceTier = params.enabled ? "priority" : "flex";
  await patchThreadBinding(params.bindingStore, params.identity, binding.threadId, { serviceTier });
  return `Codex fast mode ${params.enabled ? "enabled" : "disabled"}.`;
}
async function setCodexConversationPermissions(params) {
  const binding = await requireThreadBinding(params.bindingStore, params.identity);
  if (!params.mode) return `Codex permissions: ${formatPermissionsMode(binding)}.`;
  const policy = permissionsForMode(params.mode);
  await patchThreadBinding(params.bindingStore, params.identity, binding.threadId, {
    approvalPolicy: policy.approvalPolicy,
    sandbox: policy.sandbox,
  });
  return `Codex permissions set to ${params.mode === "yolo" ? "full access" : "default"}.`;
}
function parseCodexFastModeArg(arg) {
  const normalized = arg?.trim().toLowerCase();
  if (!normalized || normalized === "status") return;
  if (normalized === "on" || normalized === "true" || normalized === "fast") return true;
  if (normalized === "off" || normalized === "false" || normalized === "flex") return false;
}
function parseCodexPermissionsModeArg(arg) {
  const normalized = arg?.trim().toLowerCase();
  if (!normalized || normalized === "status") return;
  if (normalized === "yolo" || normalized === "full" || normalized === "full-access") return "yolo";
  if (normalized === "default" || normalized === "guardian") return "default";
}
function formatPermissionsMode(binding) {
  return binding.approvalPolicy === "never" && binding.sandbox === "danger-full-access"
    ? "full access"
    : "default";
}
async function requireThreadBinding(bindingStore, identity) {
  const binding = await bindingStore.read(identity);
  if (!binding?.threadId)
    throw new Error("No Codex thread is attached to this OpenClaw session yet.");
  return binding;
}
async function patchThreadBinding(bindingStore, identity, threadId, patch) {
  if (
    !(await bindingStore.mutate(identity, {
      kind: "patch",
      threadId,
      patch,
    }))
  )
    throw new Error("Codex thread binding changed while applying the control update.");
}
async function resumeThreadWithOverrides(params) {
  const runtime = params.runtime;
  const clientOptions = {
    startOptions: runtime.start,
    timeoutMs: runtime.requestTimeoutMs,
    authProfileId: params.authProfileId,
    ...buildBindingLookup(params),
  };
  let client = await getLeasedSharedCodexAppServerClient(clientOptions);
  const clientLease = { client };
  try {
    return {
      response: await withLeasedCodexAppServerClientStartSelectionRetry({
        lease: clientLease,
        options: clientOptions,
        run: async (requestClient, requestOptions) =>
          await requestClient.request(
            CODEX_CONTROL_METHODS.resumeThread,
            {
              threadId: params.threadId,
              ...(params.model ? { model: params.model } : {}),
              ...(params.modelProvider ? { modelProvider: params.modelProvider } : {}),
              approvalPolicy: params.approvalPolicy ?? runtime.approvalPolicy,
              sandbox: params.sandbox ?? runtime.sandbox,
              approvalsReviewer: runtime.approvalsReviewer,
              ...(params.serviceTier ? { serviceTier: params.serviceTier } : {}),
            },
            requestOptions,
          ),
        onClientChange: (nextClient) => {
          client = nextClient;
        },
      }),
      clientId: client.getInstanceId(),
    };
  } finally {
    releaseCodexAppServerClientLease(clientLease);
  }
}
function buildBindingLookup(params) {
  const agentDir = params.agentDir?.trim();
  return {
    ...(agentDir ? { agentDir } : {}),
    ...(params.config ? { config: params.config } : {}),
  };
}
function resolveConversationControlModelProvider(params) {
  const modelProvider = resolveCodexBindingModelProviderFallback({
    currentModel: params.currentModel,
    bindingModel: params.bindingModel,
    bindingModelProvider: params.bindingModelProvider,
  })?.trim();
  if (!modelProvider || modelProvider.toLowerCase() === "codex") return;
  if (isCodexAppServerNativeAuthProfile(params) && modelProvider.toLowerCase() === "openai") return;
  return modelProvider.toLowerCase() === "openai" ? "openai" : modelProvider;
}
function permissionsForMode(mode) {
  return mode === "yolo"
    ? {
        approvalPolicy: "never",
        sandbox: "danger-full-access",
      }
    : {
        approvalPolicy: "on-request",
        sandbox: "workspace-write",
      };
}
//#endregion
export {
  setCodexConversationFastMode as a,
  steerCodexConversationTurn as c,
  CODEX_NATIVE_EXECUTION_AUTH_ERROR as d,
  canMutateCodexHost as f,
  readCodexConversationActiveTurn as i,
  stopCodexConversationTurn as l,
  parseCodexFastModeArg as n,
  setCodexConversationModel as o,
  parseCodexPermissionsModeArg as r,
  setCodexConversationPermissions as s,
  formatPermissionsMode as t,
  trackCodexConversationActiveTurn as u,
};
