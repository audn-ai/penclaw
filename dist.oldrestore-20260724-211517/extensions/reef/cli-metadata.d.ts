import {
  v as OpenClawPluginConfigSchema,
  y as OpenClawPluginDefinition$1,
} from "../../plugin-entry-DPCR66aO.js";
import { A as OpenClawPluginDefinition, C as OpenClawPluginApi } from "../../types-Ga3mNO_F.js";
//#region extensions/reef/src/cli-metadata.d.ts
declare function registerReefCliMetadata(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/reef/cli-metadata.d.ts
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<
  OpenClawPluginDefinition,
  "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors"
>;
//#endregion
export { _default as default, registerReefCliMetadata };
