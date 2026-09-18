import { t as resolveBaseHashParam } from "./base-hash-BJkn_bB6.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { n as errorShape, t as ErrorCodes } from "./error-codes-O0AkRNx7.js";
import {
  M as readExecApprovalsSnapshot,
  f as ensureExecApprovalsSnapshot,
  rt as updateExecApprovals,
  w as normalizeExecApprovals,
  x as mergeExecApprovalsSocketDefaults,
} from "./exec-approvals-Bz218bS2.js";
import {
  l as resolveNodeCommandAllowlist,
  o as isNodeCommandAllowed,
} from "./node-command-policy-pdhFRd-t.js";
import {
  i as safeParseJson,
  n as respondUnavailableOnNodeInvokeError,
  r as respondUnavailableOnThrow,
} from "./nodes.helpers-eTJDH6p7.js";
import {
  At as validateExecApprovalsNodeSnapshot,
  Dt as validateExecApprovalsGetParams,
  Ot as validateExecApprovalsNodeGetParams,
  jt as validateExecApprovalsSetParams,
  kt as validateExecApprovalsNodeSetParams,
} from "./src-CIJf1lT0.js";
import { t as assertValidParams } from "./validation-DyMnkiTp.js";
//#region src/gateway/server-methods/exec-approvals.ts
function requireApprovalsBaseHash(params, snapshot, respond) {
  const baseHash = resolveBaseHashParam(params);
  if (!snapshot.exists) {
    if (baseHash && baseHash !== snapshot.hash) {
      respondApprovalsChanged(respond);
      return false;
    }
    return true;
  }
  if (!snapshot.hash) {
    respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "exec approvals base hash unavailable; re-run exec.approvals.get and retry",
      ),
    );
    return false;
  }
  if (!baseHash) {
    respond(
      false,
      void 0,
      errorShape(
        ErrorCodes.INVALID_REQUEST,
        "exec approvals base hash required; re-run exec.approvals.get and retry",
      ),
    );
    return false;
  }
  if (baseHash !== snapshot.hash) {
    respondApprovalsChanged(respond);
    return false;
  }
  return true;
}
function respondApprovalsChanged(respond) {
  respond(
    false,
    void 0,
    errorShape(
      ErrorCodes.INVALID_REQUEST,
      "exec approvals changed since last load; re-run exec.approvals.get and retry",
    ),
  );
}
function redactExecApprovals(file) {
  const socketPath = file.socket?.path?.trim();
  return {
    ...file,
    socket: socketPath ? { path: socketPath } : void 0,
  };
}
function toExecApprovalsPayload(snapshot) {
  return {
    path: snapshot.path,
    exists: snapshot.exists,
    hash: snapshot.hash,
    file: redactExecApprovals(snapshot.file),
  };
}
function isMacAppNode(session) {
  const platform = session?.platform?.trim().toLowerCase();
  return (
    session?.clientId === GATEWAY_CLIENT_IDS.MACOS_APP &&
    session.clientMode === GATEWAY_CLIENT_MODES.NODE &&
    (platform === "macos" || platform?.startsWith("macos ") === true)
  );
}
async function respondWithExecApprovalsNodePayload(params) {
  const rawParams = params.rawParams;
  if (!assertValidParams(rawParams, params.validate, params.method, params.respond)) return;
  const parsedParams = rawParams;
  const nodeId = parsedParams.nodeId.trim();
  if (!nodeId) {
    params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId required"));
    return;
  }
  const nodeSession = params.context.nodeRegistry.get(nodeId);
  if (nodeSession) {
    const allowed = isNodeCommandAllowed({
      command: params.command,
      declaredCommands: nodeSession.commands,
      allowlist: resolveNodeCommandAllowlist(params.context.getRuntimeConfig(), {
        ...nodeSession,
        approvedCommands: nodeSession.commands,
      }),
    });
    if (!allowed.ok) {
      params.respond(
        false,
        void 0,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `node command not allowed: ${params.command} (${allowed.reason})`,
          {
            details: {
              command: params.command,
              reason: allowed.reason,
            },
          },
        ),
      );
      return;
    }
  }
  await respondUnavailableOnThrow(params.respond, async () => {
    const res = await params.context.nodeRegistry.invoke({
      nodeId,
      command: params.command,
      params: params.commandParams(parsedParams, nodeSession),
    });
    if (!respondUnavailableOnNodeInvokeError(params.respond, res)) return;
    const payload = params.readPayload(res);
    if (params.validatePayload && !params.validatePayload(payload)) {
      params.respond(
        false,
        void 0,
        errorShape(ErrorCodes.INVALID_REQUEST, "node returned invalid exec approvals payload"),
      );
      return;
    }
    params.respond(true, payload, void 0);
  });
}
const execApprovalsHandlers = {
  "exec.approvals.get": async ({ params, respond }) => {
    if (!assertValidParams(params, validateExecApprovalsGetParams, "exec.approvals.get", respond))
      return;
    await respondUnavailableOnThrow(respond, async () => {
      respond(true, toExecApprovalsPayload(await ensureExecApprovalsSnapshot()), void 0);
    });
  },
  "exec.approvals.set": async ({ params, respond }) => {
    if (!assertValidParams(params, validateExecApprovalsSetParams, "exec.approvals.set", respond))
      return;
    await respondUnavailableOnThrow(respond, async () => {
      const snapshot = readExecApprovalsSnapshot();
      if (!requireApprovalsBaseHash(params, snapshot, respond)) return;
      const incoming = params.file;
      if (!incoming || typeof incoming !== "object") {
        respond(
          false,
          void 0,
          errorShape(ErrorCodes.INVALID_REQUEST, "exec approvals file is required"),
        );
        return;
      }
      const normalized = normalizeExecApprovals(incoming);
      const nextSnapshot = await updateExecApprovals({
        baseHash: snapshot.hash,
        update: (current) =>
          mergeExecApprovalsSocketDefaults({
            normalized,
            current,
          }),
      });
      if (!nextSnapshot) {
        respondApprovalsChanged(respond);
        return;
      }
      respond(true, toExecApprovalsPayload(nextSnapshot), void 0);
    });
  },
  "exec.approvals.node.get": async ({ params, respond, context }) => {
    await respondWithExecApprovalsNodePayload({
      method: "exec.approvals.node.get",
      rawParams: params,
      validate: validateExecApprovalsNodeGetParams,
      context,
      respond,
      command: "system.execApprovals.get",
      commandParams: (_parsedParams, nodeSession) =>
        isMacAppNode(nodeSession) ? { includeResolvedDefaults: true } : {},
      readPayload: (res) => (res.payloadJSON ? safeParseJson(res.payloadJSON) : res.payload),
      validatePayload: validateExecApprovalsNodeSnapshot,
    });
  },
  "exec.approvals.node.set": async ({ params, respond, context }) => {
    await respondWithExecApprovalsNodePayload({
      method: "exec.approvals.node.set",
      rawParams: params,
      validate: validateExecApprovalsNodeSetParams,
      context,
      respond,
      command: "system.execApprovals.set",
      commandParams: (parsedParams) =>
        "native" in parsedParams
          ? {
              ...parsedParams.native,
              baseHash: parsedParams.baseHash,
            }
          : {
              file: parsedParams.file,
              baseHash: parsedParams.baseHash,
            },
      readPayload: (res) => (res.payloadJSON ? safeParseJson(res.payloadJSON) : res.payload),
    });
  },
};
//#endregion
export { execApprovalsHandlers };
