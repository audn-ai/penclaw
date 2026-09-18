import { n as runCommandWithRuntime } from "./cli-utils-f3ET47a0.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as parsePort } from "./parse-port-DxlKuJRE.js";
import {
  i as resolveInstallDaemonFlag,
  n as registerOnboardAuthOptions,
  t as pickOnboardAuthOptionValues,
} from "./register.onboard-D7DIkR2R.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/program/register.setup.ts
/** Register the `setup` command as an onboarding alias. */
function registerSetupCommand(program) {
  const command = program
    .command("setup")
    .description("Alias for openclaw onboard")
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n  ${theme.command("openclaw setup")}\n    ${theme.muted("Run full onboarding for auth, models, Gateway, and channels.")}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/setup", "docs.openclaw.ai/cli/setup")}\n`,
    )
    .option(
      "--workspace <dir>",
      "Workspace proposal for guided setup; persisted by baseline/classic/non-interactive setup",
    )
    .option("--wizard", "Run interactive onboarding", false)
    .option(
      "--baseline",
      "Create baseline config/workspace/session folders without onboarding",
      false,
    )
    .option(
      "--reset",
      "Reset config + credentials + sessions before running onboarding (workspace only with --reset-scope full)",
    )
    .option("--reset-scope <scope>", "Reset scope: config|config+creds+sessions|full")
    .option("--non-interactive", "Run onboarding without prompts", false)
    .option("--classic", "Use the classic multi-step setup wizard", false)
    .option(
      "--accept-risk",
      "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)",
      false,
    )
    .option("--flow <flow>", "Onboard flow: quickstart|advanced|manual|import")
    .option("--mode <mode>", "Onboard mode: local|remote");
  registerOnboardAuthOptions(command);
  command
    .option("--gateway-port <port>", "Gateway port")
    .option("--gateway-bind <mode>", "Gateway bind: loopback|tailnet|lan|auto|custom")
    .option("--gateway-auth <mode>", "Gateway auth: token|password")
    .option("--gateway-token <token>", "Gateway token (token auth)")
    .option(
      "--gateway-token-ref-env <name>",
      "Gateway token SecretRef env var name (token auth; e.g. OPENCLAW_GATEWAY_TOKEN)",
    )
    .option("--gateway-password <password>", "Gateway password (password auth)")
    .option("--tailscale <mode>", "Tailscale: off|serve|funnel")
    .option("--tailscale-reset-on-exit", "Reset tailscale serve/funnel on exit")
    .option("--install-daemon", "Install gateway service")
    .option("--no-install-daemon", "Skip gateway service install")
    .option("--skip-daemon", "Skip gateway service install")
    .option("--daemon-runtime <runtime>", "Daemon runtime: node")
    .option("--skip-channels", "Skip channel setup")
    .option("--skip-skills", "Skip skills setup")
    .option("--skip-bootstrap", "Skip creating default agent workspace files")
    .option("--skip-search", "Skip search provider setup")
    .option("--skip-health", "Skip health check")
    .option("--skip-ui", "Skip Control UI/TUI launch")
    .option("--suppress-gateway-token-output", "Suppress token-bearing Gateway/UI output")
    .option("--skip-hooks", "Accepted for onboard compatibility; hooks setup is skipped")
    .option("--node-manager <name>", "Node manager for skills: npm|pnpm|bun")
    .option("--import-from <provider>", "Migration provider to run during onboarding")
    .option("--import-source <path>", "Source agent home for --import-from")
    .option("--import-secrets", "Import supported secrets during onboarding migration", false)
    .option("--remote-url <url>", "Remote Gateway WebSocket URL")
    .option("--remote-token <token>", "Remote Gateway token (optional)")
    .option("--json", "Output JSON summary", false)
    .action(async (opts, commandRuntime) => {
      const { defaultRuntime } = await import("./runtime-Dvam4E8I.js");
      await runCommandWithRuntime(defaultRuntime, async () => {
        if (opts.baseline) {
          const { setupCommand } = await import("./setup-DtfC4DAS.js");
          await setupCommand({ workspace: opts.workspace }, defaultRuntime);
          return;
        }
        const installDaemon = resolveInstallDaemonFlag(commandRuntime);
        const gatewayPort = parsePort(opts.gatewayPort);
        const { setupWizardCommand } = await import("./onboard-BFhlPwFB.js");
        await setupWizardCommand(
          {
            workspace: opts.workspace,
            nonInteractive: Boolean(opts.nonInteractive),
            acceptRisk: Boolean(opts.acceptRisk),
            classic: Boolean(opts.classic),
            flow: opts.flow,
            mode: opts.mode,
            ...pickOnboardAuthOptionValues(opts),
            reset: Boolean(opts.reset),
            resetScope: opts.resetScope,
            gatewayPort: gatewayPort ?? void 0,
            gatewayBind: opts.gatewayBind,
            gatewayAuth: opts.gatewayAuth,
            gatewayToken: opts.gatewayToken,
            gatewayTokenRefEnv: opts.gatewayTokenRefEnv,
            gatewayPassword: opts.gatewayPassword,
            tailscale: opts.tailscale,
            tailscaleResetOnExit: Boolean(opts.tailscaleResetOnExit),
            installDaemon,
            daemonRuntime: opts.daemonRuntime,
            skipChannels: Boolean(opts.skipChannels),
            skipSkills: Boolean(opts.skipSkills),
            skipBootstrap: Boolean(opts.skipBootstrap),
            skipSearch: Boolean(opts.skipSearch),
            skipHealth: Boolean(opts.skipHealth),
            skipUi: Boolean(opts.skipUi),
            suppressGatewayTokenOutput: Boolean(opts.suppressGatewayTokenOutput),
            skipHooks: Boolean(opts.skipHooks),
            nodeManager: opts.nodeManager,
            importFrom: opts.importFrom,
            importSource: opts.importSource,
            importSecrets: Boolean(opts.importSecrets),
            remoteUrl: opts.remoteUrl,
            remoteToken: opts.remoteToken,
            json: Boolean(opts.json),
          },
          defaultRuntime,
        );
      });
    });
}
//#endregion
export { registerSetupCommand };
