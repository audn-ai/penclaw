import {
  i as ReefFriendManager,
  r as ReviewApprovalStore,
  t as ReefMessageFlow,
} from "../../flow-DSZM7wnH.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";

//#region extensions/reef/src/runtime.d.ts
declare let active:
  | {
      flow: ReefMessageFlow;
      friends: ReefFriendManager;
      reviews: ReviewApprovalStore;
    }
  | undefined;
declare function setReefRuntime(value: PluginRuntime): void;
declare function getReefRuntime(): PluginRuntime;
declare function setActiveReef(value: typeof active): void;
declare function getActiveReef(): {
  flow: ReefMessageFlow;
  friends: ReefFriendManager;
  reviews: ReviewApprovalStore;
};
//#endregion
export { getActiveReef, getReefRuntime, setActiveReef, setReefRuntime };
