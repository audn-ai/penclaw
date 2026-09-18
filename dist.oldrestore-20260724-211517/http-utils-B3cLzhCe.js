import { randomUUID } from "node:crypto";
import "./agent-scope-y9xQv_q1.js";
import { n as normalizeAgentId, t as isValidAgentId } from "./agent-id-DDgUze4y.js";
import { c as resolveDefaultAgentId, n as listAgentIds } from "./agent-scope-config-DVIR1nBa.js";
import { r as resolveDefaultModelForAgent } from "./codex-plugin-diagnostics-DxsLhCf5.js";
import { o as getHeader } from "./http-auth-utils-Cm6rPa7b.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import { s as loadManifestMetadataSnapshot } from "./manifest-contract-eligibility-3WxfNDRv.js";
import { i as normalizeMessageChannel } from "./message-channel-normalize-Be6uJOzO.js";
import { c as parseModelRef, i as modelKey } from "./model-selection-normalize-BoKGJiBx.js";
import { n as createModelVisibilityPolicy } from "./model-visibility-policy-BqHiELXR.js";
import { t as loadGatewayModelCatalog } from "./server-model-catalog-GcPTRbL-.js";
import {
  Gt as canonicalizeSessionKeyForAgent,
  q as resolveSessionEntryAccessTarget,
} from "./session-accessor-PZVNxFCV.js";
import "./message-channel-NQc9DJ6B.js";
import "./model-selection-DOlkTrQa.js";
import { i as buildAgentMainSessionKey } from "./session-key-druuY-GG.js";
import {
  a as isSubagentSessionKey,
  i as isCronSessionKey,
  n as isAcpSessionKey,
} from "./session-key-utils-B8sNp9l4.js";
import {
  Dt as isAgentHarnessSessionStoreEntryProtected,
  Tt as isAgentHarnessSessionKey,
} from "./store-CzZJhTF6.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  c as normalizeOptionalString,
} from "./string-coerce-DW4mBlAt.js";
//#region src/gateway/http-utils.ts
const OPENCLAW_MODEL_ID = "openclaw";
/** Default OpenAI-compatible model alias that targets the default OpenClaw agent. */
const OPENCLAW_DEFAULT_MODEL_ID = "openclaw/default";
var UnknownGatewayAgentError = class extends Error {
  constructor(agentId) {
    super(`Unknown agent '${agentId}'.`);
    this.agentId = agentId;
    this.name = "UnknownGatewayAgentError";
  }
};
var GatewaySessionKeyOverrideError = class extends Error {
  constructor() {
    super("`x-openclaw-session-key` cannot use reserved internal session namespaces.");
    this.name = "GatewaySessionKeyOverrideError";
  }
};
function isUnknownGatewayAgentError(err) {
  return err instanceof UnknownGatewayAgentError;
}
function isGatewaySessionKeyOverrideError(err) {
  return err instanceof GatewaySessionKeyOverrideError;
}
function assertKnownAgentId(agentId, cfg = getRuntimeConfig()) {
  if (!listAgentIds(cfg).includes(agentId)) throw new UnknownGatewayAgentError(agentId);
}
function resolveAgentIdFromHeader(req) {
  const raw =
    normalizeOptionalString(getHeader(req, "x-openclaw-agent-id")) ||
    normalizeOptionalString(getHeader(req, "x-openclaw-agent")) ||
    "";
  if (!raw) return;
  if (!isValidAgentId(raw)) throw new UnknownGatewayAgentError(raw);
  return normalizeAgentId(raw);
}
/** Resolves the target agent encoded by an OpenAI-compatible model id. */
function resolveAgentIdFromModel(model, cfg = getRuntimeConfig()) {
  const raw = model?.trim();
  if (!raw) return;
  const lowered = normalizeLowercaseStringOrEmpty(raw);
  if (lowered === "openclaw" || lowered === "openclaw/default") return resolveDefaultAgentId(cfg);
  const agentId = (
    raw.match(/^openclaw[:/](?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i) ??
    raw.match(/^agent:(?<agentId>[a-z0-9][a-z0-9_-]{0,63})$/i)
  )?.groups?.agentId;
  if (!agentId) return;
  return normalizeAgentId(agentId);
}
/** Validates and resolves the `x-openclaw-model` override for OpenAI-compatible requests. */
async function resolveOpenAiCompatModelOverride(params) {
  const requestModel = params.model?.trim();
  if (requestModel && !resolveAgentIdFromModel(requestModel))
    return { errorMessage: "Invalid `model`. Use `openclaw` or `openclaw/<agentId>`." };
  const raw = getHeader(params.req, "x-openclaw-model")?.trim();
  if (!raw) return {};
  const cfg = getRuntimeConfig();
  const defaultProvider = resolveDefaultModelForAgent({
    cfg,
    agentId: params.agentId,
  }).provider;
  const modelManifestContext = {
    manifestPlugins: loadManifestMetadataSnapshot({
      config: cfg,
      env: process.env,
    }).plugins,
  };
  const parsed = parseModelRef(raw, defaultProvider, {
    allowManifestNormalization: true,
    allowPluginNormalization: true,
    ...modelManifestContext,
  });
  if (!parsed) return { errorMessage: "Invalid `x-openclaw-model`." };
  const policy = createModelVisibilityPolicy({
    cfg,
    catalog: await loadGatewayModelCatalog(),
    defaultProvider,
    agentId: params.agentId,
    allowManifestNormalization: true,
    allowPluginNormalization: true,
    ...modelManifestContext,
  });
  const normalized = modelKey(parsed.provider, parsed.model);
  if (!policy.allowsKey(normalized))
    return { errorMessage: `Model '${normalized}' is not allowed for agent '${params.agentId}'.` };
  return { modelOverride: raw };
}
/** Resolves the request agent from headers, model alias, or the configured default. */
function resolveAgentIdForRequest(params) {
  const cfg = getRuntimeConfig();
  const fromHeader = resolveAgentIdFromHeader(params.req);
  if (fromHeader) {
    assertKnownAgentId(fromHeader, cfg);
    return fromHeader;
  }
  const fromModel = resolveAgentIdFromModel(params.model, cfg);
  if (fromModel) {
    assertKnownAgentId(fromModel, cfg);
    return fromModel;
  }
  return resolveDefaultAgentId(cfg);
}
function resolveSessionKey(params) {
  const explicit = getHeader(params.req, "x-openclaw-session-key")?.trim();
  if (explicit) {
    if (isReservedSessionKeyOverride(explicit, params.agentId))
      throw new GatewaySessionKeyOverrideError();
    return explicit;
  }
  const user = params.user?.trim();
  const mainKey = user ? `${params.prefix}-user:${user}` : `${params.prefix}:${randomUUID()}`;
  return buildAgentMainSessionKey({
    agentId: params.agentId,
    mainKey,
  });
}
function isReservedSessionKeyOverride(sessionKey, agentId) {
  const lowered = normalizeLowercaseStringOrEmpty(sessionKey);
  const harnessLookupKey = sessionKey.startsWith("agent:")
    ? sessionKey
    : canonicalizeSessionKeyForAgent(agentId, sessionKey);
  const harnessEntry = isAgentHarnessSessionKey(sessionKey)
    ? resolveSessionEntryAccessTarget({
        cfg: getRuntimeConfig(),
        sessionKey: harnessLookupKey,
      }).entry
    : void 0;
  const harnessKeyReserved =
    isAgentHarnessSessionKey(sessionKey) &&
    (!harnessEntry || isAgentHarnessSessionStoreEntryProtected(sessionKey, harnessEntry));
  return (
    lowered.startsWith("subagent:") ||
    lowered.startsWith("cron:") ||
    lowered.startsWith("acp:") ||
    harnessKeyReserved ||
    isSubagentSessionKey(sessionKey) ||
    isCronSessionKey(sessionKey) ||
    isAcpSessionKey(sessionKey)
  );
}
/** Resolves gateway agent/session/channel context for OpenAI-compatible handlers. */
function resolveGatewayRequestContext(params) {
  const agentId = resolveAgentIdForRequest({
    req: params.req,
    model: params.model,
  });
  return {
    agentId,
    sessionKey: resolveSessionKey({
      req: params.req,
      agentId,
      user: params.user,
      prefix: params.sessionPrefix,
    }),
    messageChannel: params.useMessageChannelHeader
      ? (normalizeMessageChannel(getHeader(params.req, "x-openclaw-message-channel")) ??
        params.defaultMessageChannel)
      : params.defaultMessageChannel,
  };
}
//#endregion
export {
  resolveAgentIdForRequest as a,
  resolveOpenAiCompatModelOverride as c,
  isUnknownGatewayAgentError as i,
  OPENCLAW_MODEL_ID as n,
  resolveAgentIdFromModel as o,
  isGatewaySessionKeyOverrideError as r,
  resolveGatewayRequestContext as s,
  OPENCLAW_DEFAULT_MODEL_ID as t,
};
