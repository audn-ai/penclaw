import {
  v as OpenClawPluginConfigSchema,
  y as OpenClawPluginDefinition$1,
} from "../../plugin-entry-DPCR66aO.js";
import { A as OpenClawPluginDefinition } from "../../types-Ga3mNO_F.js";
//#region extensions/lmstudio/index.d.ts
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
export { _default as default };
