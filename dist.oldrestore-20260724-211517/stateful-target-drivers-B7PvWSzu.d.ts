import {
  a as StatefulBindingTargetDescriptor,
  i as ConfiguredBindingResolution,
} from "./binding-types-DrvK0cKt.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region src/channels/plugins/stateful-target-drivers.d.ts
type StatefulBindingTargetReadyResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: string;
    };
type StatefulBindingTargetSessionResult =
  | {
      ok: true;
      sessionKey: string;
    }
  | {
      ok: false;
      sessionKey: string;
      error: string;
    };
type StatefulBindingTargetResetResult =
  | {
      ok: true;
      sessionKey?: string;
      sessionId?: string;
      storePath?: string;
    }
  | {
      ok: false;
      skipped?: boolean;
      error?: string;
    };
/** Driver contract for lifecycle operations on one stateful target family. */
type StatefulBindingTargetDriver = {
  id: string;
  ensureReady: (params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution;
  }) => Promise<StatefulBindingTargetReadyResult>;
  ensureSession: (params: {
    cfg: OpenClawConfig;
    bindingResolution: ConfiguredBindingResolution;
  }) => Promise<StatefulBindingTargetSessionResult>;
  resolveTargetBySessionKey?: (params: {
    cfg: OpenClawConfig;
    sessionKey: string;
  }) => StatefulBindingTargetDescriptor | null;
  resetInPlace?: (params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    bindingTarget: StatefulBindingTargetDescriptor;
    reason: "new" | "reset";
    commandSource?: string;
  }) => Promise<StatefulBindingTargetResetResult>;
};
//#endregion
export {
  StatefulBindingTargetSessionResult as i,
  StatefulBindingTargetReadyResult as n,
  StatefulBindingTargetResetResult as r,
  StatefulBindingTargetDriver as t,
};
