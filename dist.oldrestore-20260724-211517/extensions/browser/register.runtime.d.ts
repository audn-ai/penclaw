import { O as OpenClawPluginSecurityAuditContext } from "../../plugin-entry-DPCR66aO.js";
import {
  b as runBrowserProxyCommand,
  r as handleBrowserGatewayRequest,
  t as createBrowserPluginService,
  x as createBrowserTool,
} from "../../plugin-service-_PNUZKo2.js";

//#region extensions/browser/src/security-audit.d.ts
/** Collects Browser plugin security audit findings for the current config/env. */
declare function collectBrowserSecurityAuditFindings(ctx: OpenClawPluginSecurityAuditContext): {
  checkId: string;
  severity: "warn" | "critical";
  title: string;
  detail: string;
  remediation?: string;
}[];
//#endregion
export {
  collectBrowserSecurityAuditFindings,
  createBrowserPluginService,
  createBrowserTool,
  handleBrowserGatewayRequest,
  runBrowserProxyCommand,
};
