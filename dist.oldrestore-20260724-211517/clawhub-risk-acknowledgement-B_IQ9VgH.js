import { n as promptText, r as promptYesNo } from "./prompt-DMGJRcz7.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
//#region src/cli/clawhub-risk-acknowledgement.ts
function canPromptForClawHubRisk() {
  return process.stdin.isTTY && process.stdout.isTTY;
}
function resolveClawHubRiskAcknowledgementCliOptions(params) {
  return {
    acknowledgeClawHubRisk: params.acknowledgeClawHubRisk,
    onClawHubRisk:
      params.acknowledgeClawHubRisk || params.allowPrompt === false || !canPromptForClawHubRisk()
        ? void 0
        : async (request) => {
            const packageName = sanitizeTerminalText(request.packageName);
            const releaseLabel = `${packageName}@${sanitizeTerminalText(request.version)}`;
            if (request.acknowledgementKind === "type-package")
              return (
                (
                  await promptText(
                    `type: '${packageName}' to ${params.action === "installing" ? "install" : "update"} anyway\n> `,
                  )
                ).trim() === packageName
              );
            return await promptYesNo(
              `${params.action === "installing" ? "Install" : "Update"} ClawHub package "${releaseLabel}" after reviewing the warning above?`,
            );
          },
  };
}
//#endregion
export { resolveClawHubRiskAcknowledgementCliOptions as t };
