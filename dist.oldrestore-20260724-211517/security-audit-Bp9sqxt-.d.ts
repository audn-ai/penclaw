import { t as ResolvedTelegramAccount } from "./accounts-B_z9gHZ0.js";
import { i as OpenClawConfig } from "./types.openclaw-DDo8sH3F.js";

//#region extensions/telegram/src/security-audit.d.ts
declare function collectTelegramSecurityAuditFindings(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  account: ResolvedTelegramAccount;
}): Promise<
  {
    checkId: string;
    severity: "info" | "warn" | "critical";
    title: string;
    detail: string;
    remediation?: string;
  }[]
>;
//#endregion
export { collectTelegramSecurityAuditFindings as t };
