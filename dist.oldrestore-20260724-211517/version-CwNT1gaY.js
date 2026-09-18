//#region packages/gateway-protocol/src/version.ts
/** Current gateway protocol version emitted by modern clients and servers. */
const PROTOCOL_VERSION = 4;
/** Lowest general client protocol version accepted by the gateway. */
const MIN_CLIENT_PROTOCOL_VERSION = 4;
/** Lowest authenticated node protocol version accepted by the gateway. */
const MIN_NODE_PROTOCOL_VERSION = 3;
/** Lowest lightweight probe protocol version accepted by the gateway. */
const MIN_PROBE_PROTOCOL_VERSION = 3;
//#endregion
export {
  PROTOCOL_VERSION as i,
  MIN_NODE_PROTOCOL_VERSION as n,
  MIN_PROBE_PROTOCOL_VERSION as r,
  MIN_CLIENT_PROTOCOL_VERSION as t,
};
