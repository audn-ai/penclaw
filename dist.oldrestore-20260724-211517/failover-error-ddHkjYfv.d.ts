import { n as FailoverReason } from "./types-CF0DHR3y.js";

//#region src/agents/failover-error.d.ts
/** Structured error used to carry model fallback/failover metadata across layers. */
declare class FailoverError extends Error {
  readonly reason: FailoverReason;
  readonly provider?: string;
  readonly model?: string;
  readonly profileId?: string;
  readonly authMode?: string;
  readonly status?: number;
  readonly code?: string;
  readonly rawError?: string;
  readonly authProfileFailure?: {
    allInCooldown: boolean;
  };
  readonly sessionId?: string;
  readonly lane?: string;
  readonly suspend?: boolean;
  constructor(
    message: string,
    params: {
      reason: FailoverReason;
      provider?: string;
      model?: string;
      profileId?: string;
      authMode?: string;
      status?: number;
      code?: string;
      rawError?: string;
      authProfileFailure?: {
        allInCooldown: boolean;
      };
      sessionId?: string;
      lane?: string;
      cause?: unknown;
      suspend?: boolean;
    },
  );
}
/** Return true for native or serialized failover errors. */
declare function isFailoverError(err: unknown): err is FailoverError;
/** Convert a failover or raw error into structured fields for logs/UI. */
declare function describeFailoverError(err: unknown): {
  message: string;
  rawError?: string;
  reason?: FailoverReason;
  status?: number;
  code?: string;
  provider?: string;
  model?: string;
  profileId?: string;
  authMode?: string;
  sessionId?: string;
  lane?: string;
};
//#endregion
export { isFailoverError as n, describeFailoverError as t };
