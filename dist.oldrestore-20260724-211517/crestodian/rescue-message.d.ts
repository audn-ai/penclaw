import { t as CrestodianCommandDeps } from "../operations-Bj052-b9.js";
import { di as CommandContext } from "../types-Ga3mNO_F.js";
import { i as OpenClawConfig } from "../types.openclaw-DDo8sH3F.js";

//#region src/crestodian/rescue-message.d.ts
/** Input required to process one possible `/crestodian` rescue message. */
type CrestodianRescueMessageInput = {
  cfg: OpenClawConfig;
  command: CommandContext;
  commandBody: string;
  agentId?: string;
  isGroup: boolean;
  env?: NodeJS.ProcessEnv;
  deps?: CrestodianCommandDeps;
};
/** Extract the command body after `/crestodian`, or null when the message is not for rescue. */
declare function extractCrestodianRescueMessage(commandBody: string): string | null;
/** Process one rescue message and return a reply, or null when not a rescue command. */
declare function runCrestodianRescueMessage(
  input: CrestodianRescueMessageInput,
): Promise<string | null>;
//#endregion
export { extractCrestodianRescueMessage, runCrestodianRescueMessage };
