import { l as MigrationItem } from "../../plugin-entry-DPCR66aO.js";
import { t as HermesSource } from "../../source-CnuRfNXX.js";

//#region extensions/migrate-hermes/auth-source.d.ts
type HermesCodexAuthCandidate = {
  access: string;
  accountId?: string;
  refresh: string;
  sourceKind: "hermes-auth-json" | "opencode-auth-json";
  sourceSlot: "provider" | "pool" | "opencode";
  sourceCredentialIndex?: number;
  sourceLabel: string;
  sourcePath: string;
  updatedAt?: number;
};
declare function readHermesCodexAuthCandidates(
  authPath: string | undefined,
): Promise<HermesCodexAuthCandidate[]>;
declare function buildReauthenticationItems(source: HermesSource): Promise<MigrationItem[]>;
//#endregion
export { HermesCodexAuthCandidate, buildReauthenticationItems, readHermesCodexAuthCandidates };
