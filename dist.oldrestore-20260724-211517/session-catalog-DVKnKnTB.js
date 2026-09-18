import crypto from "node:crypto";
import { t as resolveAgentIdOrRespondError } from "./agent-id-shared-DmSKVSKI.js";
import {
  C as unbindConversationBindingRecord,
  a as buildPluginBindingIdentity,
  t as bindConversationNow,
  v as createConversationBindingRecord,
  x as resolveConversationBindingRecord,
} from "./conversation-binding-B-BUd2yg.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-CvbXi0yz.js";
import { n as getPluginRegistryState } from "./runtime-state-Bd0YsvqM.js";
import { d as resolveAgentIdFromSessionKey } from "./session-key-druuY-GG.js";
import {
  d as recordSessionStateEvent,
  y as upsertSessionUpstreamLink,
} from "./session-state-events-DXdC9X_q.js";
import {
  Bn as validateSessionsCatalogListParams,
  Rn as validateSessionsCatalogArchiveParams,
  Vn as validateSessionsCatalogReadParams,
  zn as validateSessionsCatalogContinueParams,
} from "./src-CIJf1lT0.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as createSubsystemLogger } from "./subsystem-Nlw-XKx1.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
//#region src/plugins/session-conversation-binding.ts
const log = createSubsystemLogger("plugins/binding");
const pluginSessionBindTails = /* @__PURE__ */ new Map();
/** Binds a plugin-owned runtime to one authenticated Control UI session. */
async function bindPluginSessionConversation(params) {
  const sessionKey = params.sessionKey.trim();
  if (!sessionKey) throw new Error("session key is required for a plugin session binding");
  const operation = (pluginSessionBindTails.get(sessionKey) ?? Promise.resolve()).then(() =>
    bindPluginSessionConversationExclusive({
      ...params,
      sessionKey,
    }),
  );
  const tail = operation.then(
    () => void 0,
    () => void 0,
  );
  pluginSessionBindTails.set(sessionKey, tail);
  try {
    return await operation;
  } finally {
    if (pluginSessionBindTails.get(sessionKey) === tail) pluginSessionBindTails.delete(sessionKey);
  }
}
async function bindPluginSessionConversationExclusive(params) {
  const sessionKey = params.sessionKey;
  const conversation = {
    channel: INTERNAL_MESSAGE_CHANNEL,
    accountId: "default",
    conversationId: sessionKey,
  };
  const previous = resolveConversationBindingRecord(conversation);
  const bindingAttemptId = crypto.randomUUID();
  const binding = await bindConversationNow({
    identity: buildPluginBindingIdentity(params),
    conversation,
    targetSessionKey: sessionKey,
    summary: params.binding.summary,
    detachHint: params.binding.detachHint,
    data: params.binding.data,
    bindingAttemptId,
  });
  try {
    await params.afterBind?.();
    return binding;
  } catch (error) {
    const current = resolveConversationBindingRecord(conversation);
    if (current?.metadata?.bindingAttemptId !== bindingAttemptId) throw error;
    try {
      await unbindConversationBindingRecord({
        bindingId: current.bindingId,
        reason: "plugin-session-bind-rollback",
      });
      if (previous && (previous.expiresAt === void 0 || previous.expiresAt > Date.now()))
        await createConversationBindingRecord({
          targetSessionKey: previous.targetSessionKey,
          targetKind: previous.targetKind,
          conversation: previous.conversation,
          placement: "current",
          metadata: previous.metadata,
          ...(previous.expiresAt === void 0
            ? {}
            : { ttlMs: Math.max(1, previous.expiresAt - Date.now()) }),
        });
    } catch (rollbackError) {
      log.warn("plugin session binding finalization failed before rollback", { error });
      throw new Error(
        "plugin session binding finalization failed and its previous binding could not be restored",
        { cause: rollbackError },
      );
    }
    throw error;
  }
}
//#endregion
//#region src/gateway/server-methods/session-catalog.ts
function catalogError(error) {
  const record = error && typeof error === "object" ? error : void 0;
  const recordMessage = typeof record?.message === "string" ? record.message.trim() : "";
  const fallbackMessage = typeof error === "string" ? error.trim() : "";
  return {
    code: typeof record?.code === "string" && record.code ? record.code : "catalog_error",
    message: recordMessage || fallbackMessage || "session catalog provider failed",
  };
}
function providers() {
  return registrations().map((entry) => entry.provider);
}
function resolveSessionCatalogProvider(catalogId) {
  return providers().find((candidate) => candidate.id === catalogId);
}
function registrations() {
  return (getPluginRegistryState()?.activeRegistry?.sessionCatalogs ?? []).toSorted((left, right) =>
    left.provider.id.localeCompare(right.provider.id),
  );
}
function resolveProviderCreateTarget(provider, agentId) {
  try {
    const target = provider.resolveCreateSession?.({ agentId });
    const model = target?.model.trim();
    const agentRuntime = target?.agentRuntime.trim();
    return model && agentRuntime
      ? {
          ok: true,
          target: {
            model,
            agentRuntime,
          },
        }
      : {
          ok: false,
          message: `session catalog ${provider.id} cannot create sessions`,
        };
  } catch (error) {
    return {
      ok: false,
      message: catalogError(error).message,
    };
  }
}
/** Resolves a catalog-owned create target at the start of sessions.create. */
function resolveSessionCatalogCreateTarget(catalogId, agentId) {
  const registration = registrations().find((entry) => entry.provider.id === catalogId);
  if (!registration)
    return {
      ok: false,
      message: `unknown session catalog: ${catalogId}`,
      unknownCatalog: true,
    };
  const resolved = resolveProviderCreateTarget(registration.provider, agentId);
  return resolved.ok
    ? {
        ok: true,
        target: {
          ...resolved.target,
          pluginOwnerId: registration.pluginId,
        },
      }
    : resolved;
}
function providerOrRespond(catalogId, respond) {
  const provider = resolveSessionCatalogProvider(catalogId);
  if (!provider)
    respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${catalogId}`),
    );
  return provider;
}
function registrationOrRespond(catalogId, respond) {
  const registration = registrations().find((candidate) => candidate.provider.id === catalogId);
  if (!registration)
    respond(
      false,
      void 0,
      errorShape(ErrorCodes.INVALID_REQUEST, `unknown session catalog: ${catalogId}`),
    );
  return registration;
}
function catalogResult(provider, hosts, error, createSession) {
  const result = {
    id: provider.id,
    label: provider.label,
    capabilities: {
      continueSession: Boolean(provider.continueSession),
      archive: Boolean(provider.archive),
      ...(provider.openTerminal ? { openTerminal: true } : {}),
      ...(createSession ? { createSession } : {}),
    },
    hosts,
  };
  if (error) result.error = error;
  return result;
}
const sessionCatalogHandlers = {
  "sessions.catalog.list": async ({ params, respond, context }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsCatalogListParams,
        "sessions.catalog.list",
        respond,
      )
    )
      return;
    const request = params;
    let selected;
    if (request.catalogId) {
      const provider = providerOrRespond(request.catalogId, respond);
      if (!provider) return;
      selected = [provider];
    } else selected = providers();
    const config = context.getRuntimeConfig();
    const resolvedAgent = resolveAgentIdOrRespondError({
      rawAgentId: request.agentId,
      respond,
      cfg: config,
      normalize: normalizeOptionalString,
    });
    if (!resolvedAgent) return;
    respond(true, {
      catalogs: await Promise.all(
        selected.map(async (provider) => {
          const createTarget = resolveProviderCreateTarget(provider, resolvedAgent.agentId);
          const createSession = createTarget.ok ? { model: createTarget.target.model } : void 0;
          try {
            return catalogResult(
              provider,
              await provider.list({
                search: request.search,
                limitPerHost: request.limitPerHost,
                hostIds: request.hostIds,
                ...("cursors" in request ? { cursors: request.cursors } : {}),
              }),
              void 0,
              createSession,
            );
          } catch (error) {
            return catalogResult(provider, [], catalogError(error), createSession);
          }
        }),
      ),
    });
  },
  "sessions.catalog.read": async ({ params, respond }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsCatalogReadParams,
        "sessions.catalog.read",
        respond,
      )
    )
      return;
    const request = params;
    const provider = providerOrRespond(request.catalogId, respond);
    if (!provider) return;
    try {
      const { catalogId: _catalogId, ...providerRequest } = request;
      respond(true, await provider.read(providerRequest));
    } catch (error) {
      const details = catalogError(error);
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, details.message, { details }));
    }
  },
  "sessions.catalog.continue": async ({ params, respond, client }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsCatalogContinueParams,
        "sessions.catalog.continue",
        respond,
      )
    )
      return;
    const request = params;
    const registration = registrationOrRespond(request.catalogId, respond);
    if (!registration) return;
    const provider = registration.provider;
    if (!provider.continueSession) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "catalog is view-only"));
      return;
    }
    try {
      const { catalogId: _catalogId, ...providerRequest } = request;
      const clientScopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
      const result = await provider.continueSession({
        ...providerRequest,
        clientScopes,
      });
      if (result.conversationBinding)
        await bindPluginSessionConversation({
          pluginId: registration.pluginId,
          pluginName: registration.pluginName,
          pluginRoot: registration.rootDir?.trim() || registration.source,
          sessionKey: result.sessionKey,
          binding: result.conversationBinding,
          afterBind: result.afterConversationBound,
        });
      const agentId = resolveAgentIdFromSessionKey(result.sessionKey);
      if (result.upstream)
        upsertSessionUpstreamLink({
          sessionKey: result.sessionKey,
          agentId,
          catalogId: request.catalogId,
          hostId: request.hostId,
          threadId: request.threadId,
          upstreamKind: result.upstream.kind,
          upstreamRef: result.upstream.ref,
          marker: result.upstream.marker,
        });
      recordSessionStateEvent({
        sessionKey: result.sessionKey,
        agentId,
        kind: "adopted",
        actorType: "human",
        dedupeKey: `adopted:${result.sessionKey}`,
        summary: `adopted from ${request.catalogId}`,
        payload: {
          catalogId: request.catalogId,
          hostId: request.hostId,
        },
      });
      respond(true, { sessionKey: result.sessionKey });
    } catch (error) {
      const details = catalogError(error);
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, details.message, { details }));
    }
  },
  "sessions.catalog.archive": async ({ params, respond }) => {
    if (
      !assertValidParams(
        params,
        validateSessionsCatalogArchiveParams,
        "sessions.catalog.archive",
        respond,
      )
    )
      return;
    const request = params;
    const provider = providerOrRespond(request.catalogId, respond);
    if (!provider) return;
    if (!provider.archive) {
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "catalog cannot archive"));
      return;
    }
    try {
      const { catalogId: _catalogId, ...providerRequest } = request;
      respond(true, await provider.archive(providerRequest));
    } catch (error) {
      const details = catalogError(error);
      respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, details.message, { details }));
    }
  },
};
//#endregion
export {
  resolveSessionCatalogProvider as n,
  sessionCatalogHandlers as r,
  resolveSessionCatalogCreateTarget as t,
};
