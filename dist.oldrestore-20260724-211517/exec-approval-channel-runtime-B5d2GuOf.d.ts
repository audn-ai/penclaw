import {
  f as ExecApprovalChannelRuntime,
  p as ExecApprovalChannelRuntimeAdapter,
} from "./approval-handler-runtime-types-BO5RsjHV.js";
import { s as GatewayReconnectPausedInfo } from "./client-CFSDLgzq.js";
import { d as ExecApprovalResolved, l as ExecApprovalRequest } from "./exec-approvals-B59RubLo.js";
import {
  l as PluginApprovalResolved,
  s as PluginApprovalRequest,
} from "./plugin-approvals-DCKU3bfY.js";

//#region src/infra/exec-approval-channel-runtime.d.ts
type ApprovalRequestEvent = ExecApprovalRequest | PluginApprovalRequest;
type ApprovalResolvedEvent = ExecApprovalResolved | PluginApprovalResolved;
/** Error raised when the gateway pauses approval reconnects after a terminal startup failure. */
declare class ExecApprovalChannelRuntimeTerminalStartError extends Error {
  readonly detailCode: string | null;
  constructor(info: GatewayReconnectPausedInfo, cause?: unknown);
}
/** Narrows terminal approval runtime startup failures for bootstrap retry policy. */
declare function isExecApprovalChannelRuntimeTerminalStartError(
  error: unknown,
): error is ExecApprovalChannelRuntimeTerminalStartError;
/** Creates the gateway-backed approval runtime that tracks pending requests and finalization. */
declare function createExecApprovalChannelRuntime<
  TPending,
  TRequest extends ApprovalRequestEvent = ExecApprovalRequest,
  TResolved extends ApprovalResolvedEvent = ExecApprovalResolved,
>(
  adapter: ExecApprovalChannelRuntimeAdapter<TPending, TRequest, TResolved>,
): ExecApprovalChannelRuntime<TRequest, TResolved>;
//#endregion
export {
  createExecApprovalChannelRuntime as n,
  isExecApprovalChannelRuntimeTerminalStartError as r,
  ExecApprovalChannelRuntimeTerminalStartError as t,
};
