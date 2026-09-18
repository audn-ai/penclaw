//#region src/gateway/server/ws-types.ts
const GATEWAY_WS_CONNECTION_KIND_PROPERTY = "__openclawConnectionKind";
const GATEWAY_WS_PREAUTH_BUDGET_PROPERTY = "__openclawPreauthBudget";
const WS_HANDSHAKE_PHASES = [
  "tcp_accepted",
  "ws_upgrade_started",
  "auth_credentials_received",
  "auth_validated",
  "session_attached",
  "hello_payload_prepared",
  "ready",
];
//#endregion
export {
  GATEWAY_WS_PREAUTH_BUDGET_PROPERTY as n,
  WS_HANDSHAKE_PHASES as r,
  GATEWAY_WS_CONNECTION_KIND_PROPERTY as t,
};
