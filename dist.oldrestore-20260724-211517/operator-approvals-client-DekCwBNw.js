import { t as GatewayClient } from "./client-BkZfVL9e.js";
import { t as resolveGatewayClientBootstrap } from "./client-bootstrap-BOzSWcXH.js";
import { i as GATEWAY_CLIENT_NAMES, r as GATEWAY_CLIENT_MODES } from "./client-info-Br1guPTt.js";
import { t as startGatewayClientWhenEventLoopReady } from "./client-start-readiness-_Anybv37.js";
import { t as getOperatorApprovalRuntimeToken } from "./operator-approval-runtime-token-CwiIM76w.js";
//#region src/gateway/operator-approvals-client.ts
function shouldSendApprovalRuntimeToken(urlSource) {
  return (
    urlSource === "local loopback" || urlSource === "missing gateway.remote.url (fallback local)"
  );
}
function shouldOmitApprovalRuntimeDeviceIdentity(params) {
  return params.sendsApprovalRuntimeToken;
}
/** Create a Gateway client authorized for operator approval event handling. */
async function createOperatorApprovalsGatewayClient(params) {
  const bootstrap = await resolveGatewayClientBootstrap({
    config: params.config,
    gatewayUrl: params.gatewayUrl,
    env: process.env,
  });
  const sendsApprovalRuntimeToken = shouldSendApprovalRuntimeToken(bootstrap.urlSource);
  return new GatewayClient({
    url: bootstrap.url,
    token: bootstrap.auth.token,
    password: bootstrap.auth.password,
    ...(sendsApprovalRuntimeToken
      ? { approvalRuntimeToken: getOperatorApprovalRuntimeToken() }
      : {}),
    preauthHandshakeTimeoutMs: bootstrap.preauthHandshakeTimeoutMs,
    clientName: GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
    clientDisplayName: params.clientDisplayName,
    mode: GATEWAY_CLIENT_MODES.BACKEND,
    scopes: ["operator.approvals"],
    deviceIdentity: shouldOmitApprovalRuntimeDeviceIdentity({ sendsApprovalRuntimeToken })
      ? null
      : void 0,
    onEvent: params.onEvent,
    onHelloOk: params.onHelloOk,
    onConnectError: params.onConnectError,
    onReconnectPaused: params.onReconnectPaused,
    onClose: params.onClose,
  });
}
/** Run a callback with a started operator-approvals Gateway client and close it after. */
async function withOperatorApprovalsGatewayClient(params, run) {
  let readySettled = false;
  let resolveReady;
  let rejectReady;
  const ready = new Promise((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });
  const markReady = () => {
    if (readySettled) return;
    readySettled = true;
    resolveReady();
  };
  const failReady = (err) => {
    if (readySettled) return;
    readySettled = true;
    rejectReady(err);
  };
  const gatewayClient = await createOperatorApprovalsGatewayClient({
    config: params.config,
    gatewayUrl: params.gatewayUrl,
    clientDisplayName: params.clientDisplayName,
    onHelloOk: () => {
      markReady();
    },
    onConnectError: (err) => {
      failReady(err);
    },
    onClose: (code, reason) => {
      failReady(/* @__PURE__ */ new Error(`gateway closed (${code}): ${reason}`));
    },
  });
  try {
    const readiness = await startGatewayClientWhenEventLoopReady(gatewayClient, {
      clientOptions: { preauthHandshakeTimeoutMs: params.config.gateway?.handshakeTimeoutMs },
    });
    if (!readiness.ready)
      throw new Error(
        readiness.aborted
          ? "gateway approval client start aborted before readiness"
          : "gateway readiness unavailable before approval client start",
      );
    await ready;
    return await run(gatewayClient);
  } finally {
    await gatewayClient.stopAndWait().catch(() => {
      gatewayClient.stop();
    });
  }
}
//#endregion
export { withOperatorApprovalsGatewayClient as n, createOperatorApprovalsGatewayClient as t };
