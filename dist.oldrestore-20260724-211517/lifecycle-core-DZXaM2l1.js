import { t as resolveGatewayAuthToken } from "./auth-token-resolution--RLjXsYk.js";
import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { h as resolveFutureConfigActionBlock } from "./config-env-vars-CwdMUFhk.js";
import {
  n as formatPluginPackagingRuntimeOutputRecoveryHint,
  t as formatInvalidConfigRecoveryHint,
} from "./config-recovery-hints-DhFjfGDg.js";
import { t as createGatewayCredentialPlan } from "./credential-planner-BTC1pLMc.js";
import {
  n as isGatewaySecretRefUnavailableError,
  t as GatewaySecretRefUnavailableError,
} from "./credentials-DqHTozxM.js";
import { c as readBestEffortConfig, u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { n as formatConfigIssueLines } from "./issue-format-IJKFr2SL.js";
import { m as resolveIsNixMode } from "./paths-DEklnbzU.js";
import { n as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-CsUZ07YX.js";
import {
  t as clearGatewayRestartIntentSync,
  v as writeGatewayRestartIntentSync,
} from "./restart-DuVWNzPR.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import "./config-BDv-QbJ6.js";
import { o as renderSystemdUnavailableHints } from "./runtime-hints-DaMB6xc0.js";
import { r as checkTokenDrift } from "./service-audit-HqR_kPc_.js";
import {
  o as startGatewayService,
  r as inspectGatewayServiceStartRepair,
  t as describeGatewayServiceRestart,
} from "./service-Dw37Ek79.js";
import {
  i as filterContainerGenericHints,
  m as createDaemonActionContext,
  p as buildDaemonServiceSnapshot,
} from "./shared-BM2cZyxM.js";
import { o as isSystemdUserServiceAvailable } from "./systemd-BI3sgDKJ.js";
import { l as isWSL } from "./undici-runtime-Bm6J6FAw.js";
//#region src/cli/daemon-cli/gateway-token-drift.ts
function authModeDisablesToken(mode) {
  return mode === "password" || mode === "none" || mode === "trusted-proxy";
}
function isPasswordFallbackActive(params) {
  const plan = createGatewayCredentialPlan({
    config: params.cfg,
    env: params.env,
  });
  if (plan.authMode !== void 0) return false;
  return plan.passwordCanWin && !plan.tokenCanWin;
}
/** Resolve the expected Gateway token for service drift checks, or undefined when token auth is inactive. */
async function resolveGatewayTokenForDriftCheck(params) {
  const env = params.env ?? process.env;
  const mode = params.cfg.gateway?.auth?.mode;
  if (authModeDisablesToken(mode)) return;
  if (
    isPasswordFallbackActive({
      cfg: params.cfg,
      env,
    })
  )
    return;
  const resolved = await resolveGatewayAuthToken({
    cfg: params.cfg,
    env,
    envFallback: "never",
    unresolvedReasonStyle: "detailed",
  });
  if (resolved.token) return resolved.token;
  if (!resolved.secretRefConfigured) return;
  throw new GatewaySecretRefUnavailableError("gateway.auth.token");
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-core.ts
async function maybeAugmentSystemdHints(hints) {
  if (process.platform !== "linux") return hints;
  if (await isSystemdUserServiceAvailable().catch(() => false)) return hints;
  return [
    ...hints,
    ...renderSystemdUnavailableHints({
      wsl: await isWSL(),
      kind: "generic_unavailable",
    }),
  ];
}
function emitActionMessage(params) {
  params.emit(params.payload);
  if (!params.json && params.payload.message) defaultRuntime.log(params.payload.message);
}
function mergeWarnings(captured, reported) {
  const combined = [...captured, ...(reported ?? [])];
  return combined.length > 0 ? combined : void 0;
}
async function handleServiceNotLoaded(params) {
  const hints = filterContainerGenericHints(
    await maybeAugmentSystemdHints(params.renderStartHints()),
  );
  params.emit({
    ok: true,
    result: "not-loaded",
    message: `${params.serviceNoun} service ${params.service.notLoadedText}.`,
    hints,
    service: buildDaemonServiceSnapshot(params.service, params.loaded),
  });
  if (!params.json) {
    defaultRuntime.log(`${params.serviceNoun} service ${params.service.notLoadedText}.`);
    for (const hint of hints) defaultRuntime.log(`Start with: ${hint}`);
  }
}
async function resolveServiceLoadedOrFail(params) {
  try {
    return await params.service.isLoaded({ env: process.env });
  } catch (err) {
    params.fail(`${params.serviceNoun} service check failed: ${String(err)}`);
    return null;
  }
}
function formatPluginPackagingRuntimeOutputRecoveryHints() {
  return formatPluginPackagingRuntimeOutputRecoveryHint().split("\n");
}
async function getConfigActionPreflightFailure(action) {
  let snapshot;
  try {
    snapshot = await readConfigFileSnapshot();
    if (snapshot.exists && !snapshot.valid)
      return {
        message:
          snapshot.issues.length > 0
            ? formatConfigIssueLines(snapshot.issues, "", { normalizeRoot: true }).join("\n")
            : "Unknown validation issue.",
        ...(isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot)
          ? { hints: formatPluginPackagingRuntimeOutputRecoveryHints() }
          : {}),
      };
  } catch {
    return null;
  }
  const futureBlock = resolveFutureConfigActionBlock({
    action,
    snapshot,
  });
  if (futureBlock)
    return {
      message: futureBlock.message,
      hints: futureBlock.hints,
    };
  return null;
}
async function runServiceUninstall(params) {
  const { stdout, emit, fail } = createDaemonActionContext({
    action: "uninstall",
    json: Boolean(params.opts?.json),
  });
  if (resolveIsNixMode(process.env)) {
    fail("Nix mode detected; service uninstall is disabled.");
    return;
  }
  {
    const preflight = await getConfigActionPreflightFailure("uninstall the gateway service");
    if (preflight) {
      fail(`${params.serviceNoun} uninstall blocked: ${preflight.message}`, preflight.hints);
      return;
    }
  }
  let loaded;
  try {
    loaded = await params.service.isLoaded({ env: process.env });
  } catch {
    loaded = false;
  }
  if (loaded && params.stopBeforeUninstall)
    try {
      await params.service.stop({
        env: process.env,
        stdout,
      });
    } catch {}
  try {
    await params.service.uninstall({
      env: process.env,
      stdout,
    });
  } catch (err) {
    fail(`${params.serviceNoun} uninstall failed: ${String(err)}`);
    return;
  }
  try {
    loaded = await params.service.isLoaded({ env: process.env });
  } catch {
    loaded = false;
  }
  if (loaded && params.assertNotLoadedAfterUninstall) {
    fail(`${params.serviceNoun} service still loaded after uninstall.`);
    return;
  }
  emit({
    ok: true,
    result: "uninstalled",
    service: buildDaemonServiceSnapshot(params.service, loaded),
  });
}
async function runServiceStart(params) {
  const json = Boolean(params.opts?.json);
  const { stdout, warnings, emit, fail } = createDaemonActionContext({
    action: "start",
    json,
  });
  const warn = json ? (message) => warnings.push(message) : void 0;
  const loaded = await resolveServiceLoadedOrFail({
    serviceNoun: params.serviceNoun,
    service: params.service,
    fail,
  });
  if (loaded === null) return;
  {
    const preflight = await getConfigActionPreflightFailure("start the gateway service");
    if (preflight) {
      fail(
        preflight.hints
          ? `${params.serviceNoun} start blocked: ${preflight.message}`
          : `${params.serviceNoun} aborted: config is invalid.\n${preflight.message}\n${formatInvalidConfigRecoveryHint()}`,
        preflight.hints,
      );
      return;
    }
  }
  if (!loaded)
    try {
      const handled = await params.onNotLoaded?.({
        json,
        stdout,
        warn,
        fail,
      });
      if (handled) {
        emit({
          ok: true,
          result: handled.result,
          message: handled.message,
          warnings: mergeWarnings(warnings, handled.warnings),
          service: buildDaemonServiceSnapshot(params.service, handled.loaded ?? false),
        });
        if (!json && handled.message) defaultRuntime.log(handled.message);
        return;
      }
    } catch (err) {
      const hints = params.renderStartHints();
      fail(`${params.serviceNoun} start failed: ${String(err)}`, hints);
      return;
    }
  try {
    const startResult = await startGatewayService(
      params.service,
      {
        env: process.env,
        stdout,
        warn,
      },
      params.expectedPort,
    );
    if (startResult.outcome === "missing-install") {
      await handleServiceNotLoaded({
        serviceNoun: params.serviceNoun,
        service: params.service,
        loaded: startResult.state.loaded,
        renderStartHints: params.renderStartHints,
        json,
        emit,
      });
      return;
    }
    if (startResult.outcome === "scheduled") {
      emitActionMessage({
        json,
        emit,
        payload: {
          ok: true,
          result: "scheduled",
          message: describeGatewayServiceRestart(params.serviceNoun, { outcome: "scheduled" })
            .message,
          service: buildDaemonServiceSnapshot(params.service, startResult.state.loaded),
          warnings: warnings.length ? warnings : void 0,
        },
      });
      return;
    }
    if (startResult.outcome === "repair-required") {
      try {
        const handled = await params.repairLoadedService?.({
          json,
          stdout,
          warn,
          fail,
          state: startResult.state,
          issues: startResult.issues,
        });
        if (handled) {
          emit({
            ok: true,
            result: handled.result,
            message: handled.message,
            warnings: mergeWarnings(warnings, handled.warnings),
            service: buildDaemonServiceSnapshot(params.service, handled.loaded ?? true),
          });
          if (!json && handled.message) defaultRuntime.log(handled.message);
          return;
        }
      } catch (err) {
        const hints = params.renderStartHints();
        fail(`${params.serviceNoun} repair failed: ${String(err)}`, hints);
        return;
      }
      fail(
        `${params.serviceNoun} service needs repair before it can start: ${startResult.issues.map((issue) => issue.message).join("; ")}`,
        [formatCliCommand("openclaw gateway install --force")],
      );
      return;
    }
    emit({
      ok: true,
      result: "started",
      service: buildDaemonServiceSnapshot(params.service, startResult.state.loaded),
      warnings: warnings.length ? warnings : void 0,
    });
  } catch (err) {
    const hints = params.renderStartHints();
    fail(`${params.serviceNoun} start failed: ${String(err)}`, hints);
  }
}
async function runServiceStop(params) {
  const json = Boolean(params.opts?.json);
  const { stdout, emit, fail } = createDaemonActionContext({
    action: "stop",
    json,
  });
  const loaded = await resolveServiceLoadedOrFail({
    serviceNoun: params.serviceNoun,
    service: params.service,
    fail,
  });
  if (loaded === null) return;
  {
    const preflight = await getConfigActionPreflightFailure("stop the gateway service");
    if (preflight) {
      fail(`${params.serviceNoun} stop blocked: ${preflight.message}`, preflight.hints);
      return;
    }
  }
  if (!loaded) {
    if (params.stopWhenNotLoaded) {
      try {
        await params.service.stop({
          env: process.env,
          stdout,
          disable: params.opts?.disable,
        });
      } catch (err) {
        fail(`${params.serviceNoun} stop failed: ${String(err)}`);
        return;
      }
      emit({
        ok: true,
        result: "stopped",
        service: buildDaemonServiceSnapshot(params.service, false),
      });
      return;
    }
    try {
      const handled = await params.onNotLoaded?.({
        json,
        stdout,
        fail,
      });
      if (handled) {
        emit({
          ok: true,
          result: handled.result,
          message: handled.message,
          warnings: handled.warnings,
          service: buildDaemonServiceSnapshot(params.service, false),
        });
        if (!json && handled.message) defaultRuntime.log(handled.message);
        return;
      }
    } catch (err) {
      fail(`${params.serviceNoun} stop failed: ${String(err)}`);
      return;
    }
    emit({
      ok: true,
      result: "not-loaded",
      message: `${params.serviceNoun} service ${params.service.notLoadedText}.`,
      service: buildDaemonServiceSnapshot(params.service, loaded),
    });
    if (!json) defaultRuntime.log(`${params.serviceNoun} service ${params.service.notLoadedText}.`);
    return;
  }
  try {
    await params.service.stop({
      env: process.env,
      stdout,
      disable: params.opts?.disable,
    });
  } catch (err) {
    fail(`${params.serviceNoun} stop failed: ${String(err)}`);
    return;
  }
  let stopped;
  try {
    stopped = await params.service.isLoaded({ env: process.env });
  } catch {
    stopped = false;
  }
  emit({
    ok: true,
    result: "stopped",
    service: buildDaemonServiceSnapshot(params.service, stopped),
  });
}
async function runServiceRestart(params) {
  const json = Boolean(params.opts?.json);
  const { stdout, warnings, emit, fail } = createDaemonActionContext({
    action: "restart",
    json,
  });
  const warn = json ? (message) => warnings.push(message) : void 0;
  const restartIntent = params.opts?.restartIntent;
  let handledRecovery = null;
  let handledRepair = null;
  let recoveredLoadedState = null;
  let wroteRestartIntent = false;
  const prepareGatewayRestartIntent = async () => {
    if (params.serviceNoun !== "Gateway" || wroteRestartIntent) return;
    wroteRestartIntent = writeGatewayRestartIntentSync({
      targetPid: (await params.service.readRuntime(process.env).catch(() => null))?.pid,
      reason: "gateway.restart",
      ...(restartIntent ? { intent: restartIntent } : {}),
    });
  };
  const clearPreparedRestartIntent = () => {
    if (wroteRestartIntent) {
      clearGatewayRestartIntentSync();
      wroteRestartIntent = false;
    }
  };
  const emitScheduledRestart = (restartStatus, serviceLoaded) => {
    emitActionMessage({
      json,
      emit,
      payload: {
        ok: true,
        result: restartStatus.daemonActionResult,
        message: restartStatus.message,
        service: buildDaemonServiceSnapshot(params.service, serviceLoaded),
        warnings: warnings.length ? warnings : void 0,
      },
    });
    return true;
  };
  const loaded = await resolveServiceLoadedOrFail({
    serviceNoun: params.serviceNoun,
    service: params.service,
    fail,
  });
  if (loaded === null) return false;
  {
    const preflight = await getConfigActionPreflightFailure("restart the gateway service");
    if (preflight) {
      fail(
        preflight.hints
          ? `${params.serviceNoun} restart blocked: ${preflight.message}`
          : `${params.serviceNoun} aborted: config is invalid.\n${preflight.message}\n${formatInvalidConfigRecoveryHint()}`,
        preflight.hints,
      );
      return false;
    }
  }
  if (!loaded) {
    try {
      handledRecovery =
        (await params.onNotLoaded?.({
          json,
          stdout,
          warn,
          fail,
        })) ?? null;
    } catch (err) {
      fail(`${params.serviceNoun} restart failed: ${String(err)}`);
      return false;
    }
    if (!handledRecovery) {
      await handleServiceNotLoaded({
        serviceNoun: params.serviceNoun,
        service: params.service,
        loaded,
        renderStartHints: params.renderStartHints,
        json,
        emit,
      });
      return false;
    }
    if (handledRecovery.warnings?.length) warnings.push(...handledRecovery.warnings);
    recoveredLoadedState = handledRecovery.loaded ?? null;
  }
  if (loaded && params.repairLoadedService)
    try {
      const { state, issues } = await inspectGatewayServiceStartRepair(
        params.service,
        { env: process.env },
        params.expectedPort,
      );
      if (issues.length > 0) {
        await prepareGatewayRestartIntent();
        handledRepair = await params.repairLoadedService({
          json,
          stdout,
          warn,
          fail,
          state,
          issues,
        });
        if (!handledRepair) {
          clearPreparedRestartIntent();
          fail(
            `${params.serviceNoun} service needs repair before restart: ${issues.map((issue) => issue.message).join("; ")}`,
            [formatCliCommand("openclaw gateway install --force")],
          );
          return false;
        }
        if (handledRepair.warnings?.length) warnings.push(...handledRepair.warnings);
      }
    } catch (err) {
      clearPreparedRestartIntent();
      const hints = params.renderStartHints();
      fail(`${params.serviceNoun} repair failed: ${String(err)}`, hints);
      return false;
    }
  if (loaded && params.checkTokenDrift)
    try {
      const command = await params.service.readCommand(process.env);
      const serviceToken = command?.environment?.OPENCLAW_GATEWAY_TOKEN;
      const driftIssue = checkTokenDrift({
        serviceToken,
        configToken: await resolveGatewayTokenForDriftCheck({
          cfg: await readBestEffortConfig(),
          env: {
            ...process.env,
            ...command?.environment,
          },
        }),
      });
      if (driftIssue) {
        const warning = driftIssue.detail
          ? `${driftIssue.message} ${driftIssue.detail}`
          : driftIssue.message;
        warnings.push(warning);
        if (!json) {
          defaultRuntime.log(`\n⚠️  ${driftIssue.message}`);
          if (driftIssue.detail) defaultRuntime.log(`   ${driftIssue.detail}\n`);
        }
      }
    } catch (err) {
      if (isGatewaySecretRefUnavailableError(err, "gateway.auth.token")) {
        const warning =
          "Unable to verify gateway token drift: gateway.auth.token SecretRef is configured but unavailable in this command path.";
        warnings.push(warning);
        if (!json) defaultRuntime.log(`\n⚠️  ${warning}\n`);
      }
    }
  try {
    let restartResult = { outcome: "completed" };
    if (loaded && !handledRepair) {
      await prepareGatewayRestartIntent();
      try {
        restartResult = await params.service.restart({
          env: process.env,
          stdout,
          warn,
        });
      } catch (err) {
        clearPreparedRestartIntent();
        throw err;
      }
    }
    let restartStatus = describeGatewayServiceRestart(params.serviceNoun, restartResult);
    if (restartStatus.scheduled)
      return emitScheduledRestart(restartStatus, loaded || recoveredLoadedState === true);
    if (params.postRestartCheck) {
      const postRestartResult = await params.postRestartCheck({
        json,
        stdout,
        warnings,
        warn,
        fail,
      });
      if (postRestartResult) {
        restartStatus = describeGatewayServiceRestart(params.serviceNoun, postRestartResult);
        if (restartStatus.scheduled)
          return emitScheduledRestart(restartStatus, loaded || recoveredLoadedState === true);
      }
    }
    let restarted = loaded;
    if (loaded)
      try {
        restarted = await params.service.isLoaded({ env: process.env });
      } catch {
        restarted = true;
      }
    else if (recoveredLoadedState !== null) restarted = recoveredLoadedState;
    emit({
      ok: true,
      result: "restarted",
      message: handledRecovery?.message ?? handledRepair?.message,
      service: buildDaemonServiceSnapshot(params.service, restarted),
      warnings: warnings.length ? warnings : void 0,
    });
    const actionMessage = handledRecovery?.message ?? handledRepair?.message;
    if (!json && actionMessage) defaultRuntime.log(actionMessage);
    return true;
  } catch (err) {
    const hints = params.renderStartHints();
    fail(`${params.serviceNoun} restart failed: ${String(err)}`, hints);
    return false;
  }
}
//#endregion
export {
  runServiceUninstall as i,
  runServiceStart as n,
  runServiceStop as r,
  runServiceRestart as t,
};
