import { Command } from "commander";
import { n as MemoryCoreLocalServiceHost } from "../../embedding-local-service-6ShbpdO7.js";

//#region extensions/memory-core/src/cli.d.ts
declare function registerMemoryCli(
  program: Command,
  hostOptions?: MemoryCoreLocalServiceHost,
): void;
//#endregion
export { registerMemoryCli };
