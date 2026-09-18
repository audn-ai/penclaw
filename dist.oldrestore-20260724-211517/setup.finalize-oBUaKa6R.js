import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { s as resolveDefaultAgentDir } from "./agent-scope-config-DVIR1nBa.js";
import { n as openUrl, t as detectBrowserOpenSupport } from "./browser-open-BIKaPeXy.js";
import { n as resolveCliName } from "./cli-name-CVj-3DWf.js";
import { t as describeCodexNativeWebSearch } from "./codex-native-web-search.shared-D7KzlpGf.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import {
  a as installCompletion,
  i as formatCompletionReloadCommand,
  l as resolveCompletionProfilePath,
} from "./completion-runtime-Ck51_Qqg.js";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.js";
import { t as ensureControlUiAssetsBuilt } from "./control-ui-assets-Bfrq0NUW.js";
import {
  r as resolveLocalControlUiProbeLinks,
  t as resolveAdvertisedControlUiLinks,
} from "./control-ui-links-BImlWgwk.js";
import {
  n as gatewayInstallErrorHint,
  t as buildGatewayInstallPlan,
} from "./daemon-install-helpers-DbcV1pnD.js";
import {
  n as GATEWAY_DAEMON_RUNTIME_OPTIONS,
  t as DEFAULT_GATEWAY_DAEMON_RUNTIME,
} from "./daemon-runtime-CHOL1Kuf.js";
import {
  r as ensureCompletionCacheExists,
  t as checkShellCompletionStatus,
} from "./doctor-completion-CCbtOaHX.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-CwKaSRw3.js";
import { c as healthCommand } from "./health-B7JDh_rX.js";
import { r as formatHealthCheckFailure } from "./health-format-DQ9OK_xq.js";
import { c as resolveUserPath } from "./home-dir-DxrrpDft.js";
import { n as t } from "./i18n-BDUMKn0X.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import { i as hasAuthProfileForProvider } from "./model-config.helpers-YCqd3cyK.js";
import {
  d as probeGatewayReachable,
  h as waitForGatewayReachable,
  i as formatControlUiSshHint,
} from "./onboard-helpers-CUS3BGDx.js";
import { t as restoreTerminalState } from "./restore-BWpek1U9.js";
import { n as listConfiguredWebSearchProviders } from "./runtime-Inp394Wl.js";
import {
  a as resolveGatewayService,
  t as describeGatewayServiceRestart,
} from "./service-Dw37Ek79.js";
import { t as resolveSetupSecretInputString } from "./setup.secret-input-CSZyNx9j.js";
import { o as isSystemdUserServiceAvailable } from "./systemd-BI3sgDKJ.js";
import { t as launchTuiCli } from "./tui-launch-x-Z1uEXj.js";
import { l as pathExists } from "./utils-DtcDeqWS.js";
import { t as formatWindowsGatewayFirewallGuidance } from "./windows-gateway-firewall-diagnostics-Cwjm2Cse.js";
import { n as DEFAULT_BOOTSTRAP_FILENAME } from "./workspace-DXzCbuC0.js";
//#region src/wizard/setup.completion.ts
async function resolveProfileHint(shell) {
  const home = process.env.HOME || os.homedir();
  if (shell === "zsh") return "~/.zshrc";
  if (shell === "bash")
    return (await pathExists(path.join(home, ".bashrc"))) ? "~/.bashrc" : "~/.bash_profile";
  if (shell === "fish") return "~/.config/fish/config.fish";
  return resolveCompletionProfilePath("powershell");
}
function formatReloadHint(shell, profileHint) {
  if (shell === "powershell")
    return t("wizard.completion.reloadPowerShell", {
      command: formatCompletionReloadCommand("powershell", profileHint),
    });
  return t("wizard.completion.reloadShell", { profile: profileHint });
}
async function setupWizardShellCompletion(params) {
  const deps = {
    resolveCliName,
    checkShellCompletionStatus,
    ensureCompletionCacheExists,
    installCompletion,
    ...params.deps,
  };
  const cliName = deps.resolveCliName();
  const completionStatus = await deps.checkShellCompletionStatus(cliName);
  const generationOptions = { generationMode: "full" };
  if (completionStatus.usesSlowPattern) {
    if (await deps.ensureCompletionCacheExists(cliName, generationOptions))
      await deps.installCompletion(completionStatus.shell, true, cliName);
    return;
  }
  if (completionStatus.profileInstalled && !completionStatus.cacheExists) {
    await deps.ensureCompletionCacheExists(cliName, generationOptions);
    return;
  }
  if (!completionStatus.profileInstalled) {
    if (
      !(params.flow === "quickstart"
        ? true
        : await params.prompter.confirm({
            message: t("wizard.completion.enable", {
              shell: completionStatus.shell,
              cli: cliName,
            }),
            initialValue: true,
          }))
    )
      return;
    if (!(await deps.ensureCompletionCacheExists(cliName, generationOptions))) {
      await params.prompter.note(
        t("wizard.completion.cacheFailed", { command: `${cliName} completion --install` }),
        t("wizard.completion.title"),
      );
      return;
    }
    await deps.installCompletion(completionStatus.shell, true, cliName);
    const profileHint = await resolveProfileHint(completionStatus.shell);
    await params.prompter.note(
      t("wizard.completion.installed", {
        reloadHint: formatReloadHint(completionStatus.shell, profileHint),
      }),
      t("wizard.completion.title"),
    );
  }
}
//#endregion
//#region src/wizard/setup.finalize.ts
const HATCH_TUI_TIMEOUT_MS = 300 * 1e3;
function buildSessionGatewayAuthOverride(params) {
  if (params.settings.authMode === "token" && params.settings.gatewayToken)
    return {
      ...params.nextConfig.gateway?.auth,
      mode: "token",
      token: params.settings.gatewayToken,
    };
  if (params.settings.authMode === "password" && params.resolvedGatewayPassword)
    return {
      ...params.nextConfig.gateway?.auth,
      mode: "password",
      password: params.resolvedGatewayPassword,
    };
  return params.nextConfig.gateway?.auth;
}
async function startSessionGatewayForOnboarding(params) {
  const progress = params.prompter.progress(t("wizard.finalize.sessionGatewayStarting"));
  try {
    const { startGatewayServer } = await import("./server-BiHhCWxK.js");
    const server = await startGatewayServer(params.settings.port, {
      bind: params.settings.bind,
      ...(params.settings.bind === "custom" && params.settings.customBindHost
        ? { host: params.settings.customBindHost }
        : {}),
      auth: buildSessionGatewayAuthOverride({
        nextConfig: params.nextConfig,
        settings: params.settings,
        resolvedGatewayPassword: params.resolvedGatewayPassword,
      }),
      tailscale: params.nextConfig.gateway?.tailscale,
    });
    progress.stop(t("wizard.finalize.sessionGatewayStarted"));
    return server;
  } catch (error) {
    progress.stop(t("wizard.finalize.sessionGatewayStartFailed"));
    await params.prompter.note(
      [
        t("wizard.finalize.sessionGatewayStartFailed"),
        formatErrorMessage(error),
        t("wizard.finalize.startGatewayNow", { command: formatCliCommand("openclaw gateway run") }),
      ].join("\n"),
      "Gateway",
    );
    return;
  }
}
async function closeSessionGatewayForOnboarding(params) {
  await params.sessionGateway.close({ reason: params.reason }).catch((error) => {
    params.runtime.error(formatErrorMessage(error));
  });
}
async function showControlUiDashboardNote(params) {
  let opened = false;
  let openHint;
  if ((await detectBrowserOpenSupport()).ok) {
    opened = await openUrl(params.authedUrl);
    if (!opened)
      openHint = formatControlUiSshHint({
        port: params.settings.port,
        basePath: params.controlUiBasePath,
        token: params.hintToken,
      });
  } else
    openHint = formatControlUiSshHint({
      port: params.settings.port,
      basePath: params.controlUiBasePath,
      token: params.hintToken,
    });
  await params.prompter.note(
    [
      t("wizard.finalize.dashboardLinkWithToken", { url: params.authedUrl }),
      opened ? t("wizard.finalize.dashboardOpened") : t("wizard.finalize.dashboardCopyPaste"),
      openHint,
    ]
      .filter(Boolean)
      .join("\n"),
    t("wizard.finalize.dashboardReady"),
  );
  return { opened };
}
function getLocalizedGatewayDaemonRuntimeOptions() {
  return GATEWAY_DAEMON_RUNTIME_OPTIONS.map((option) => ({
    hint:
      option.value === "node"
        ? t("wizard.finalize.daemonRuntimeNodeHint")
        : (option.hint ?? void 0),
    label: option.value === "node" ? t("wizard.finalize.daemonRuntimeNode") : option.label,
    value: option.value,
  }));
}
const loadOnboardSearchModule = createLazyRuntimeModule(
  () => import("./onboard-search-CIFl14rz.js"),
);
/**
 * Ensure the gateway service matches the onboarding decision: prompt/decide
 * whether to install the daemon, then install/restart/reinstall it. Shared by
 * the classic wizard finalize and the bootstrap onboarding flow.
 */
async function ensureGatewayServiceForOnboarding(params) {
  const { flow, opts, nextConfig, settings, prompter, runtime } = params;
  const withWizardProgress = async (label, optionsLocal, work) => {
    const progress = prompter.progress(label);
    try {
      return await work(progress);
    } finally {
      progress.stop(
        typeof optionsLocal.doneMessage === "function"
          ? optionsLocal.doneMessage()
          : optionsLocal.doneMessage,
      );
    }
  };
  const systemdAvailable =
    process.platform === "linux" ? await isSystemdUserServiceAvailable() : true;
  const linuxWithoutUserSystemd = process.platform === "linux" && !systemdAvailable;
  const containerWithoutUserSystemd = linuxWithoutUserSystemd && isContainerEnvironment();
  if (linuxWithoutUserSystemd)
    await prompter.note(
      t(
        containerWithoutUserSystemd
          ? "wizard.finalize.containerSystemdUnavailable"
          : "wizard.finalize.systemdUnavailable",
      ),
      containerWithoutUserSystemd ? t("wizard.finalize.containerRuntimeTitle") : "Systemd",
    );
  if (process.platform === "linux" && systemdAvailable) {
    const { ensureSystemdUserLingerInteractive } = await import("./systemd-linger-CRThYqWy.js");
    await ensureSystemdUserLingerInteractive({
      runtime,
      prompter: {
        confirm: prompter.confirm,
        note: prompter.note,
      },
      reason: t("wizard.finalize.systemdLingerReason"),
      requireConfirm: false,
    });
  }
  const explicitInstallDaemon =
    typeof opts.installDaemon === "boolean" ? opts.installDaemon : void 0;
  let installDaemon;
  if (explicitInstallDaemon !== void 0) installDaemon = explicitInstallDaemon;
  else if (linuxWithoutUserSystemd) installDaemon = false;
  else if (flow === "quickstart") installDaemon = true;
  else
    installDaemon = await prompter.confirm({
      message: t("wizard.finalize.installGateway"),
      initialValue: true,
    });
  if (linuxWithoutUserSystemd && installDaemon) {
    await prompter.note(
      t("wizard.finalize.systemdInstallSkipped"),
      t("wizard.finalize.gatewayService"),
    );
    installDaemon = false;
  }
  if (installDaemon) {
    const daemonRuntime =
      flow === "quickstart"
        ? DEFAULT_GATEWAY_DAEMON_RUNTIME
        : await prompter.select({
            message: t("wizard.finalize.daemonRuntime"),
            options: getLocalizedGatewayDaemonRuntimeOptions(),
            initialValue: opts.daemonRuntime ?? "node",
          });
    if (flow === "quickstart")
      await prompter.note(
        t("wizard.finalize.quickstartNodeRuntime"),
        t("wizard.finalize.daemonRuntime"),
      );
    const service = resolveGatewayService();
    const loaded = await service.isLoaded({ env: process.env });
    let restartWasScheduled = false;
    if (loaded) {
      const action =
        params.loadedAction ??
        (await prompter.select({
          message: t("wizard.finalize.alreadyInstalled"),
          options: [
            {
              value: "restart",
              label: t("wizard.finalize.restart"),
            },
            {
              value: "reinstall",
              label: t("wizard.finalize.reinstall"),
            },
            {
              value: "skip",
              label: t("common.skip"),
            },
          ],
        }));
      if (action === "restart") {
        let restartDoneMessage = t("wizard.finalize.gatewayServiceRestarted");
        await withWizardProgress(
          t("wizard.finalize.gatewayService"),
          { doneMessage: () => restartDoneMessage },
          async (progress) => {
            progress.update(t("wizard.finalize.gatewayServiceRestarting"));
            const restartStatus = describeGatewayServiceRestart(
              "Gateway",
              await service.restart({
                env: process.env,
                stdout: process.stdout,
              }),
            );
            restartDoneMessage = restartStatus.scheduled
              ? t("wizard.finalize.gatewayServiceRestartScheduled")
              : t("wizard.finalize.gatewayServiceRestarted");
            restartWasScheduled = restartStatus.scheduled;
          },
        );
      } else if (action === "reinstall")
        await withWizardProgress(
          t("wizard.finalize.gatewayService"),
          { doneMessage: t("wizard.finalize.gatewayServiceUninstalled") },
          async (progress) => {
            progress.update(t("wizard.finalize.gatewayServiceUninstalling"));
            await service.uninstall({
              env: process.env,
              stdout: process.stdout,
            });
          },
        );
    }
    if (
      !loaded ||
      (!restartWasScheduled && loaded && !(await service.isLoaded({ env: process.env })))
    ) {
      const progress = prompter.progress(t("wizard.finalize.gatewayService"));
      let installError = null;
      const installWarnings = [];
      const flushInstallWarnings = async () => {
        let warning;
        while ((warning = installWarnings.shift()) !== void 0)
          await prompter.note(warning.message, warning.title);
      };
      try {
        progress.update(t("wizard.finalize.gatewayServicePreparing"));
        const tokenResolution = await resolveGatewayInstallToken({
          config: nextConfig,
          env: process.env,
        });
        for (const warning of tokenResolution.warnings)
          await prompter.note(warning, "Gateway service");
        if (tokenResolution.unavailableReason)
          installError = [
            t("wizard.finalize.gatewayInstallBlocked"),
            tokenResolution.unavailableReason,
            t("wizard.finalize.gatewayInstallFixAuth"),
          ].join(" ");
        else {
          const { programArguments, workingDirectory, environment, environmentValueSources } =
            await buildGatewayInstallPlan({
              env: process.env,
              port: settings.port,
              runtime: daemonRuntime,
              warn: (message, title) => {
                installWarnings.push({
                  message,
                  title,
                });
              },
              config: nextConfig,
            });
          await flushInstallWarnings();
          progress.update(t("wizard.finalize.gatewayServiceInstalling"));
          await service.install({
            env: process.env,
            stdout: process.stdout,
            programArguments,
            workingDirectory,
            environment,
            environmentValueSources,
          });
        }
      } catch (err) {
        await flushInstallWarnings();
        installError = formatErrorMessage(err);
      } finally {
        progress.stop(
          installError
            ? t("wizard.finalize.gatewayServiceInstallFailed")
            : t("wizard.finalize.gatewayServiceInstalled"),
        );
      }
      if (installError) {
        await prompter.note(
          t("wizard.finalize.gatewayServiceInstallFailedWithError", { error: installError }),
          "Gateway",
        );
        await prompter.note(gatewayInstallErrorHint(), "Gateway");
      }
    }
  }
  return {
    installDaemon,
    containerWithoutUserSystemd,
  };
}
async function finalizeSetupWizard(options) {
  const { flow, opts, baseConfig, nextConfig, settings, prompter, runtime } = options;
  const suppressGatewayTokenOutput = opts.suppressGatewayTokenOutput === true;
  let gatewayProbe = { ok: true };
  let resolvedGatewayPassword = "";
  let sessionGateway;
  const { installDaemon, containerWithoutUserSystemd } = await ensureGatewayServiceForOnboarding({
    flow,
    opts,
    nextConfig,
    settings,
    prompter,
    runtime,
  });
  if (settings.authMode === "password")
    try {
      resolvedGatewayPassword =
        (await resolveSetupSecretInputString({
          config: nextConfig,
          value: nextConfig.gateway?.auth?.password,
          path: "gateway.auth.password",
          env: process.env,
        })) ?? "";
    } catch (error) {
      await prompter.note(
        [
          t("wizard.finalize.secretRefAuthFailed", { field: "gateway.auth.password" }),
          formatErrorMessage(error),
        ].join("\n"),
        t("wizard.gateway.auth"),
      );
    }
  if (containerWithoutUserSystemd && !opts.skipUi)
    sessionGateway = await startSessionGatewayForOnboarding({
      nextConfig,
      settings,
      resolvedGatewayPassword,
      prompter,
    });
  try {
    if (!opts.skipHealth) {
      const probeLinks = resolveLocalControlUiProbeLinks({
        bind: nextConfig.gateway?.bind ?? "loopback",
        port: settings.port,
        customBindHost: nextConfig.gateway?.customBindHost,
        basePath: void 0,
        tlsEnabled: nextConfig.gateway?.tls?.enabled === true,
      });
      gatewayProbe = await waitForGatewayReachable({
        url: probeLinks.wsUrl,
        token: settings.authMode === "token" ? settings.gatewayToken : void 0,
        password: settings.authMode === "password" ? resolvedGatewayPassword : void 0,
        deadlineMs: 15e3,
      });
      if (gatewayProbe.ok)
        try {
          await healthCommand(
            {
              json: false,
              timeoutMs: 1e4,
              config:
                settings.authMode === "token" && settings.gatewayToken
                  ? {
                      ...nextConfig,
                      gateway: {
                        ...nextConfig.gateway,
                        auth: {
                          ...nextConfig.gateway?.auth,
                          mode: "token",
                          token: settings.gatewayToken,
                        },
                      },
                    }
                  : nextConfig,
              token: settings.authMode === "token" ? settings.gatewayToken : void 0,
              password: settings.authMode === "password" ? resolvedGatewayPassword : void 0,
            },
            runtime,
          );
        } catch (err) {
          runtime.error(formatHealthCheckFailure(err));
          await prompter.note(
            [
              t("common.docs"),
              "https://docs.openclaw.ai/gateway/health",
              "https://docs.openclaw.ai/gateway/troubleshooting",
            ].join("\n"),
            t("wizard.finalize.healthCheckHelp"),
          );
        }
      else if (installDaemon) {
        runtime.error(
          formatHealthCheckFailure(
            new Error(
              gatewayProbe.detail ?? `gateway did not become reachable at ${probeLinks.wsUrl}`,
            ),
          ),
        );
        await prompter.note(
          [
            t("common.docs"),
            "https://docs.openclaw.ai/gateway/health",
            "https://docs.openclaw.ai/gateway/troubleshooting",
          ].join("\n"),
          t("wizard.finalize.healthCheckHelp"),
        );
      } else
        await prompter.note(
          [
            t("wizard.finalize.gatewayNotDetected"),
            t("wizard.finalize.noBackgroundGatewayExpected"),
            t("wizard.finalize.startGatewayNow", {
              command: formatCliCommand("openclaw gateway run"),
            }),
            t("wizard.finalize.rerunInstallDaemon", {
              command: formatCliCommand("openclaw onboard --install-daemon"),
            }),
            t("wizard.finalize.skipHealthNextTime", {
              command: formatCliCommand("openclaw onboard --skip-health"),
            }),
          ].join("\n"),
          "Gateway",
        );
    }
    const controlUiEnabled =
      nextConfig.gateway?.controlUi?.enabled ?? baseConfig.gateway?.controlUi?.enabled ?? true;
    if (!opts.skipUi && controlUiEnabled) {
      const controlUiAssets = await ensureControlUiAssetsBuilt(runtime);
      if (!controlUiAssets.ok && controlUiAssets.message) runtime.error(controlUiAssets.message);
    }
    await prompter.note(
      [
        t("wizard.finalize.addNodes"),
        `- ${t("wizard.finalize.nodeMac")}`,
        `- ${t("wizard.finalize.nodeIos")}`,
        `- ${t("wizard.finalize.nodeAndroid")}`,
      ].join("\n"),
      t("wizard.finalize.optionalApps"),
    );
    const controlUiBasePath =
      nextConfig.gateway?.controlUi?.basePath ?? baseConfig.gateway?.controlUi?.basePath;
    const displayLinks = await resolveAdvertisedControlUiLinks({
      bind: settings.bind,
      port: settings.port,
      customBindHost: settings.customBindHost,
      basePath: controlUiBasePath,
      tlsEnabled: nextConfig.gateway?.tls?.enabled === true,
    });
    const probeLinks = resolveLocalControlUiProbeLinks({
      bind: settings.bind,
      port: settings.port,
      customBindHost: settings.customBindHost,
      basePath: controlUiBasePath,
      tlsEnabled: nextConfig.gateway?.tls?.enabled === true,
    });
    const authedUrl =
      settings.authMode === "token" && settings.gatewayToken && !suppressGatewayTokenOutput
        ? `${displayLinks.httpUrl}#token=${encodeURIComponent(settings.gatewayToken)}`
        : displayLinks.httpUrl;
    if (opts.skipHealth || !gatewayProbe.ok)
      gatewayProbe = await probeGatewayReachable({
        url: probeLinks.wsUrl,
        token: settings.authMode === "token" ? settings.gatewayToken : void 0,
        password: settings.authMode === "password" ? resolvedGatewayPassword : "",
      });
    const gatewayStatusLine = gatewayProbe.ok
      ? t("wizard.finalize.gatewayReachable")
      : t("wizard.finalize.gatewayNotDetectedStatus", {
          detail: gatewayProbe.detail ? ` (${gatewayProbe.detail})` : "",
        });
    const windowsFirewallLines = formatWindowsGatewayFirewallGuidance({ bind: settings.bind });
    const bootstrapPath = path.join(
      resolveUserPath(options.workspaceDir),
      DEFAULT_BOOTSTRAP_FILENAME,
    );
    const hasBootstrap = await fs
      .access(bootstrapPath)
      .then(() => true)
      .catch(() => false);
    const agentDir = resolveDefaultAgentDir(nextConfig);
    const [
      { resolveDefaultModelAuthStatus, resolveDefaultModelCatalogFacts },
      { loadModelCatalogSnapshot },
    ] = await Promise.all([
      import("./auth-choice-CyFH-xSr.js"),
      import("./model-catalog-CKXmb4DJ.js"),
    ]);
    const modelCatalog = await loadModelCatalogSnapshot({
      config: nextConfig,
      readOnly: true,
    });
    const modelCatalogFacts = resolveDefaultModelCatalogFacts(nextConfig, modelCatalog.entries, {
      routeVariants: modelCatalog.routeVariants,
    });
    const modelAuthStatus = resolveDefaultModelAuthStatus(nextConfig, {
      agentDir,
      ...(modelCatalogFacts.observedRoutes
        ? { observedRoutes: modelCatalogFacts.observedRoutes }
        : {}),
    });
    const shouldSeedBootstrapHatch =
      hasBootstrap && options.hadExistingConfig !== true && modelAuthStatus.status === "ready";
    await prompter.note(
      [
        t("wizard.finalize.webUiUrl", { url: displayLinks.httpUrl }),
        settings.authMode === "token" && settings.gatewayToken && !suppressGatewayTokenOutput
          ? t("wizard.finalize.webUiWithTokenUrl", { url: authedUrl })
          : void 0,
        t("wizard.finalize.gatewayWsUrl", { url: displayLinks.wsUrl }),
        gatewayStatusLine,
        ...windowsFirewallLines,
        t("wizard.finalize.controlUiDocs"),
      ]
        .filter(Boolean)
        .join("\n"),
      "Control UI",
    );
    let controlUiOpened = false;
    let launchedTui = false;
    const shouldLaunchTui = !opts.skipUi;
    if (shouldLaunchTui) {
      if (hasBootstrap)
        await prompter.note(
          [
            t("wizard.finalize.workspaceReady"),
            ...(shouldSeedBootstrapHatch ? [t("wizard.finalize.firstTerminalChat")] : []),
            t("wizard.finalize.editBootstrap"),
          ].join("\n"),
          t("wizard.finalize.hatchYourAgent"),
        );
      if (modelAuthStatus.status === "missing")
        await prompter.note(
          [
            t("wizard.finalize.noModelAuth", { provider: modelAuthStatus.provider }),
            t("wizard.finalize.noModelAuthNext", {
              command: formatCliCommand("openclaw configure --section model"),
            }),
          ].join("\n"),
          t("wizard.finalize.noModelAuthTitle"),
        );
      if (gatewayProbe.ok) {
        const tokenNotes = [
          t("wizard.finalize.gatewayTokenShared"),
          t("wizard.finalize.gatewayTokenStored"),
          t("wizard.finalize.gatewayTokenView", {
            command: formatCliCommand("openclaw config get gateway.auth.token"),
          }),
          t("wizard.finalize.gatewayTokenGenerate", {
            command: formatCliCommand("openclaw doctor --generate-gateway-token"),
          }),
          suppressGatewayTokenOutput ? void 0 : t("wizard.finalize.dashboardTokenMemory"),
          t("wizard.finalize.dashboardOpenAnytime", {
            command: formatCliCommand("openclaw dashboard --no-open"),
          }),
          suppressGatewayTokenOutput ? void 0 : t("wizard.finalize.dashboardTokenPrompt"),
        ].filter(Boolean);
        await prompter.note(tokenNotes.join("\n"), "Token");
      }
    } else if (opts.skipUi)
      await prompter.note(t("wizard.finalize.skipControlUi"), t("wizard.finalize.controlUiTitle"));
    await prompter.note(
      [t("wizard.finalize.backupWorkspace"), t("wizard.finalize.workspaceDocs")].join("\n"),
      t("wizard.finalize.workspaceBackupTitle"),
    );
    await prompter.note(t("wizard.finalize.securityReminder"), t("wizard.security.title"));
    await setupWizardShellCompletion({
      flow,
      prompter,
    });
    if (
      !opts.skipUi &&
      gatewayProbe.ok &&
      settings.authMode === "token" &&
      Boolean(settings.gatewayToken) &&
      !suppressGatewayTokenOutput &&
      !shouldLaunchTui
    )
      controlUiOpened = (
        await showControlUiDashboardNote({
          prompter,
          settings,
          authedUrl,
          controlUiBasePath,
          hintToken: settings.gatewayToken,
        })
      ).opened;
    const codexNativeSummary = describeCodexNativeWebSearch(nextConfig);
    const webSearchProvider = nextConfig.tools?.web?.search?.provider;
    const webSearchEnabled = nextConfig.tools?.web?.search?.enabled;
    const configuredSearchProviders = listConfiguredWebSearchProviders({ config: nextConfig });
    if (webSearchProvider) {
      const { resolveExistingKey, hasExistingKey, hasKeyInEnv } = await loadOnboardSearchModule();
      const entry = configuredSearchProviders.find((e) => e.id === webSearchProvider);
      const label = entry?.label ?? webSearchProvider;
      const storedKey = entry ? resolveExistingKey(nextConfig, webSearchProvider) : void 0;
      const keyConfigured = entry ? hasExistingKey(nextConfig, webSearchProvider) : false;
      const envAvailable = entry ? hasKeyInEnv(entry) : false;
      const hasKey = keyConfigured || envAvailable;
      const authProviderId = entry?.authProviderId?.trim();
      const authProviderLabel = authProviderId === "xai" ? "xAI" : authProviderId;
      const providerAuthProfileAvailable = authProviderId
        ? hasAuthProfileForProvider({
            provider: authProviderId,
            agentDir,
          })
        : false;
      const oauthAuthProfileAvailable =
        authProviderId && providerAuthProfileAvailable
          ? hasAuthProfileForProvider({
              provider: authProviderId,
              agentDir,
              type: "oauth",
            })
          : false;
      const hasCredential = hasKey || providerAuthProfileAvailable;
      const keySource = storedKey
        ? t("wizard.finalize.webSearchKeyStored")
        : keyConfigured
          ? t("wizard.finalize.webSearchKeyRef")
          : envAvailable
            ? t("wizard.finalize.webSearchKeyEnv", { env: entry?.envVars.join(" / ") ?? "" })
            : oauthAuthProfileAvailable && authProviderLabel
              ? t("wizard.finalize.webSearchOAuthProfile", { provider: authProviderLabel })
              : providerAuthProfileAvailable && authProviderLabel
                ? t("wizard.finalize.webSearchAuthProfile", { provider: authProviderLabel })
                : void 0;
      if (!entry)
        await prompter.note(
          [
            t("wizard.finalize.webSearchProviderUnavailable", { provider: label }),
            t("wizard.finalize.webSearchUnavailableAction"),
            `  ${formatCliCommand("openclaw configure --section web")}`,
            "",
            t("wizard.finalize.webDocs"),
          ].join("\n"),
          t("wizard.finalize.webSearchTitle"),
        );
      else if (webSearchEnabled !== false && entry.requiresCredential === false)
        await prompter.note(
          [
            t("wizard.finalize.webSearchKeyFree"),
            "",
            t("wizard.finalize.webSearchProvider", { provider: label }),
            t("wizard.finalize.webDocs"),
          ].join("\n"),
          t("wizard.finalize.webSearchTitle"),
        );
      else if (webSearchEnabled !== false && hasCredential)
        await prompter.note(
          [
            t("wizard.finalize.webSearchEnabled"),
            "",
            t("wizard.finalize.webSearchProvider", { provider: label }),
            ...(keySource ? [keySource] : []),
            t("wizard.finalize.webDocs"),
          ].join("\n"),
          t("wizard.finalize.webSearchTitle"),
        );
      else if (entry.requiresCredential !== false && !hasCredential)
        await prompter.note(
          [
            t("wizard.finalize.webSearchNoKey", { provider: label }),
            t("wizard.finalize.webSearchNeedsKey"),
            `  ${formatCliCommand("openclaw configure --section web")}`,
            "",
            t("wizard.finalize.webSearchGetKey", {
              url: entry?.signupUrl ?? "https://docs.openclaw.ai/tools/web",
            }),
            t("wizard.finalize.webDocs"),
          ].join("\n"),
          t("wizard.finalize.webSearchTitle"),
        );
      else
        await prompter.note(
          [
            t("wizard.finalize.webSearchDisabled", { provider: label }),
            t("wizard.finalize.webSearchReenable", {
              command: formatCliCommand("openclaw configure --section web"),
            }),
            "",
            t("wizard.finalize.webDocs"),
          ].join("\n"),
          t("wizard.finalize.webSearchTitle"),
        );
    } else {
      const { hasExistingKey, hasKeyInEnv } = await loadOnboardSearchModule();
      const legacyDetected = configuredSearchProviders.find(
        (e) => hasExistingKey(nextConfig, e.id) || hasKeyInEnv(e),
      );
      if (legacyDetected)
        await prompter.note(
          [
            t("wizard.finalize.webSearchAutoDetected", { provider: legacyDetected.label }),
            t("wizard.finalize.webDocs"),
          ].join("\n"),
          t("wizard.finalize.webSearchTitle"),
        );
      else if (codexNativeSummary)
        await prompter.note(
          [
            t("wizard.finalize.managedWebSearchSkipped"),
            codexNativeSummary,
            t("wizard.finalize.webDocs"),
          ].join("\n"),
          t("wizard.finalize.webSearchTitle"),
        );
      else
        await prompter.note(
          [
            t("wizard.finalize.webSearchSkipped"),
            `  ${formatCliCommand("openclaw configure --section web")}`,
            "",
            t("wizard.finalize.webDocs"),
          ].join("\n"),
          t("wizard.finalize.webSearchTitle"),
        );
    }
    if (codexNativeSummary)
      await prompter.note(
        [
          codexNativeSummary,
          t("wizard.finalize.codexNativeSearchOnly"),
          t("wizard.finalize.webDocs"),
        ].join("\n"),
        t("wizard.finalize.codexNativeSearchTitle"),
      );
    await prompter.note(t("wizard.finalize.whatNow"), t("wizard.finalize.whatNowTitle"));
    await prompter.outro(
      controlUiOpened
        ? t("wizard.finalize.outroDashboardOpened")
        : t("wizard.finalize.outroDashboardLink"),
    );
    if (shouldLaunchTui) {
      restoreTerminalState("pre-setup tui", { resumeStdinIfPaused: false });
      try {
        await launchTuiCli(
          {
            ...(gatewayProbe.ok ? {} : { local: true }),
            deliver: false,
            message: shouldSeedBootstrapHatch ? t("wizard.finalize.bootstrapHatchMessage") : void 0,
            timeoutMs: HATCH_TUI_TIMEOUT_MS,
          },
          gatewayProbe.ok
            ? {
                gatewayUrl: displayLinks.wsUrl,
                authSource: "config",
              }
            : {},
        );
      } finally {
        restoreTerminalState("post-setup tui", { resumeStdinIfPaused: false });
        if (sessionGateway) {
          await closeSessionGatewayForOnboarding({
            sessionGateway,
            runtime,
            reason: "onboarding tui exited",
          });
          sessionGateway = void 0;
        }
      }
      launchedTui = true;
    }
    return { launchedTui };
  } finally {
    if (sessionGateway)
      await closeSessionGatewayForOnboarding({
        sessionGateway,
        runtime,
        reason: "onboarding finalize exited",
      });
  }
}
//#endregion
export { ensureGatewayServiceForOnboarding, finalizeSetupWizard };
