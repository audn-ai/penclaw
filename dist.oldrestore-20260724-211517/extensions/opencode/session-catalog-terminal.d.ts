import { x as OpenClawPluginNodeHostCommand } from "../../plugin-entry-DPCR66aO.js";
import { s as SessionCatalogTerminalPlan } from "../../session-catalog-CskF-bPr.js";
import { t as OpenCodeSessionPage } from "../../session-catalog-YRD2ThJI.js";
import { cr as PluginRuntime } from "../../types-Ga3mNO_F.js";

//#region extensions/opencode/session-catalog-terminal.d.ts
type OpenCodeTerminalDependencies = {
  parseNodeSessionPage: (value: unknown) => OpenCodeSessionPage;
  unwrapNodePayload: (value: unknown) => unknown;
};
declare function createOpenCodeTerminalNodeHostCommand(
  isAvailable: NonNullable<OpenClawPluginNodeHostCommand["isAvailable"]>,
): OpenClawPluginNodeHostCommand;
declare function openOpenCodeCatalogTerminal(
  params: {
    runtime: PluginRuntime;
    hostId: string;
    threadId: string;
  } & OpenCodeTerminalDependencies,
): Promise<SessionCatalogTerminalPlan>;
//#endregion
export { createOpenCodeTerminalNodeHostCommand, openOpenCodeCatalogTerminal };
