import { l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";
import { o as isRecord$1 } from "../../record-coerce-BCQdFoCN.js";
import { l as normalizeOptionalString } from "../../string-coerce-DJnd-JG-.js";

//#region extensions/migrate-hermes/helpers.d.ts
declare function resolveHomePath(input: string): string;
declare function exists(filePath: string): Promise<boolean>;
declare function isDirectory(dirPath: string): Promise<boolean>;
declare function sanitizeName(name: string): string;
declare function readText(filePath: string | undefined): Promise<string | undefined>;
declare function parseEnv(content: string | undefined): Record<string, string>;
declare function parseHermesConfig(content: string | undefined): Record<string, unknown>;
declare const isRecord: typeof isRecord$1;
declare function childRecord(
  root: Record<string, unknown> | undefined,
  key: string,
): Record<string, unknown>;
declare const readString: typeof normalizeOptionalString;
declare function readStringArray(value: unknown): string[];
declare function appendItem(item: MigrationItem): Promise<MigrationItem>;
//#endregion
export {
  appendItem,
  childRecord,
  exists,
  isDirectory,
  isRecord,
  parseEnv,
  parseHermesConfig,
  readString,
  readStringArray,
  readText,
  resolveHomePath,
  sanitizeName,
};
