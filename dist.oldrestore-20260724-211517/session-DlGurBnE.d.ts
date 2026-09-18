import { t as InboundLastRouteUpdate } from "./session.types--DBIZ07e.js";
import { i as MsgContext } from "./templating-h3OQefFR.js";
import { r as GroupKeyResolution } from "./types-Dk-ocvLl.js";

//#region src/channels/session.d.ts
declare function recordInboundSession(params: {
  storePath: string;
  sessionKey: string;
  ctx: MsgContext;
  groupResolution?: GroupKeyResolution | null;
  createIfMissing?: boolean;
  updateLastRoute?: InboundLastRouteUpdate;
  onRecordError: (err: unknown) => void;
  trackSessionMetaTask?: (task: Promise<unknown>) => void;
}): Promise<void>;
//#endregion
export { recordInboundSession as t };
