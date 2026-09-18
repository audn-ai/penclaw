import { randomUUID } from "node:crypto";
//#region src/gateway/process-instance.ts
const gatewayProcessInstanceId = randomUUID();
/** Stable for one Gateway process; changes across every restart, including PID reuse. */
function getGatewayProcessInstanceId() {
  return gatewayProcessInstanceId;
}
//#endregion
export { getGatewayProcessInstanceId as t };
