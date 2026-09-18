import {
  v as OpenClawPluginConfigSchema,
  y as OpenClawPluginDefinition$1,
} from "../../plugin-entry-DPCR66aO.js";
import { A as OpenClawPluginDefinition } from "../../types-Ga3mNO_F.js";
//#region extensions/browser/cli-metadata.d.ts
/** Plugin entry that contributes Browser CLI commands. */
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
