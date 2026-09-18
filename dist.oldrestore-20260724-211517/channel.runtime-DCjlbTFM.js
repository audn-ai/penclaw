import fs from "node:fs/promises";
import path from "node:path";
import {
  a as resolveIMessageAccount,
  o as resolveIMessageDuplicateSourceOwner,
} from "./accounts--1GXl2sX.js";
import "./text-utility-runtime-CJESZCN5.js";
import { t as resolveBrewExecutable } from "./brew-BuAbPCrG.js";
import { t as detectBinary } from "./detect-binary-BkSLZSbH.js";
import { a as resolveChannelMediaMaxBytes } from "./media-runtime-BhmZORKM.js";
import { t as monitorIMessageProvider } from "./monitor-4VKDtG7H.js";
import { t as IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS } from "./outbound-send-deps-B-QEsLSM.js";
import "./setup-CM3hyaUe.js";
import "./setup-tools-DI8M-Tdb.js";
import "./channel-outbound-DlkFd7rO.js";
import { t as PAIRING_APPROVED_MESSAGE } from "./pairing-message-DNhqI-OE.js";
import { t as runPluginCommandWithTimeout } from "./run-command-jyi8dasm.js";
import {
  c as IMESSAGE_INSTALL_COMMAND,
  d as imessageCompletionNote,
  f as imessageDmPolicy,
  g as normalizeIMessageCliPathForSetup,
  h as isAutoManagedIMessageCliPath,
  l as createIMessageCliPathTextInput,
  m as imessageSetupStatusBase,
  o as probeIMessage,
} from "./sanitize-outbound-DuVgJyZw.js";
import { t as sendMessageIMessage } from "./send-CPGPD4PZ.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import { J as setSetupChannelEnabled } from "./setup-wizard-helpers-Kz9xlQ7e.js";
import { l as createDetectedBinaryStatus } from "./setup-wizard-proxy-DIVPLm_0.js";
import { r as truncateUtf16Safe } from "./utf16-slice-lH-m0h6-.js";
//#region extensions/imessage/src/install-imsg.ts
async function resolveBrewIMessageCliPath(brewExe) {
  try {
    const result = await runPluginCommandWithTimeout({
      argv: [brewExe, "--prefix", "imsg"],
      timeoutMs: 1e4,
    });
    if (result.code !== 0 || !result.stdout.trim()) return null;
    const candidate = path.join(result.stdout.trim(), "bin", "imsg");
    await fs.access(candidate);
    return candidate;
  } catch {
    return null;
  }
}
async function installIMessageCli(runtime, opts) {
  if (process.platform !== "darwin")
    return {
      ok: false,
      error: "imsg auto-install is supported only on macOS.",
    };
  const brewExe = resolveBrewExecutable();
  if (!brewExe)
    return {
      ok: false,
      error: `Homebrew is required for imsg setup. Install Homebrew (https://brew.sh), then run: ${IMESSAGE_INSTALL_COMMAND}`,
    };
  runtime.log(`${opts?.upgrade ? "Updating" : "Installing"} imsg via Homebrew (${brewExe})...`);
  if (opts?.upgrade) {
    const update = await runPluginCommandWithTimeout({
      argv: [brewExe, "update"],
      timeoutMs: 5 * 6e4,
    });
    if (update.code !== 0)
      return {
        ok: false,
        error: `brew update failed (exit ${update.code}): ${truncateUtf16Safe(update.stderr.trim(), 200)}`,
      };
  }
  const command = opts?.upgrade ? ["upgrade", "imsg"] : ["install", "steipete/tap/imsg"];
  const result = await runPluginCommandWithTimeout({
    argv: [brewExe, ...command],
    timeoutMs: 15 * 6e4,
  });
  if (result.code !== 0)
    return {
      ok: false,
      error: `brew ${command.join(" ")} failed (exit ${result.code}): ${truncateUtf16Safe(result.stderr.trim(), 200)}`,
    };
  const cliPath = await resolveBrewIMessageCliPath(brewExe);
  if (!cliPath)
    return {
      ok: false,
      error: "brew install succeeded but imsg binary was not found.",
    };
  let version;
  try {
    version =
      (
        await runPluginCommandWithTimeout({
          argv: [cliPath, "--version"],
          timeoutMs: 1e4,
        })
      ).stdout.trim() || void 0;
  } catch {}
  return {
    ok: true,
    cliPath,
    version,
  };
}
//#endregion
//#region extensions/imessage/src/setup-surface.ts
const channel = "imessage";
const imessageDetectedBinaryStatus = createDetectedBinaryStatus({
  channelLabel: "iMessage",
  binaryLabel: "imsg",
  configuredLabel: imessageSetupStatusBase.configuredLabel,
  unconfiguredLabel: imessageSetupStatusBase.unconfiguredLabel,
  configuredHint: imessageSetupStatusBase.configuredHint,
  unconfiguredHint: imessageSetupStatusBase.unconfiguredHint,
  configuredScore: imessageSetupStatusBase.configuredScore,
  unconfiguredScore: imessageSetupStatusBase.unconfiguredScore,
  resolveConfigured: imessageSetupStatusBase.resolveConfigured,
  resolveBinaryPath: ({ cfg, accountId }) =>
    resolveIMessageAccount({
      cfg,
      accountId,
    }).config.cliPath ?? "imsg",
  detectBinary,
});
const imessageSetupWizard = {
  channel,
  status: {
    ...imessageDetectedBinaryStatus,
    async resolveStatusLines(params) {
      const lines = (await imessageDetectedBinaryStatus.resolveStatusLines?.(params)) ?? [];
      const configuredCliPath = resolveIMessageAccount({
        cfg: params.cfg,
        accountId: params.accountId,
      }).config.cliPath;
      const cliPath = configuredCliPath ?? "imsg";
      if (await detectBinary(cliPath)) return lines;
      const hint = isAutoManagedIMessageCliPath(cliPath, { explicit: configuredCliPath !== void 0 })
        ? `Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}`
        : `imsg command not found (${cliPath}). Check the configured cliPath or wrapper.`;
      return [...lines, hint];
    },
  },
  prepare: async ({ cfg, accountId, credentialValues, runtime, prompter, options }) => {
    if (!options?.allowIMessageInstall || process.platform !== "darwin") return;
    const credentialCliPath =
      typeof credentialValues.cliPath === "string" ? credentialValues.cliPath : void 0;
    const configuredCliPath = resolveIMessageAccount({
      cfg,
      accountId,
    }).config.cliPath;
    const explicitCliPath = credentialCliPath ?? configuredCliPath;
    const normalizedCliPath = normalizeIMessageCliPathForSetup(explicitCliPath ?? "imsg");
    if (!isAutoManagedIMessageCliPath(normalizedCliPath, { explicit: explicitCliPath !== void 0 }))
      return;
    const cliDetected = await detectBinary(normalizedCliPath);
    if (
      !(await prompter.confirm({
        message: cliDetected
          ? "imsg detected. Reinstall/update now?"
          : "imsg not found. Install now?",
        initialValue: !cliDetected,
      }))
    )
      return;
    try {
      await options?.beforePersistentEffect?.();
      const result = await installIMessageCli(runtime, { upgrade: cliDetected });
      if (result.ok && result.cliPath) {
        await prompter.note(`Installed imsg at ${result.cliPath}`, "iMessage");
        return { credentialValues: { cliPath: result.cliPath } };
      }
      if (!result.ok) await prompter.note(result.error ?? "imsg install failed.", "iMessage");
    } catch (error) {
      await prompter.note(`imsg install failed: ${String(error)}`, "iMessage");
    }
  },
  credentials: [],
  textInputs: [
    createIMessageCliPathTextInput(async ({ currentValue }) => {
      return !(await detectBinary(currentValue ?? "imsg"));
    }),
  ],
  completionNote: imessageCompletionNote,
  dmPolicy: imessageDmPolicy,
  disable: (cfg) => setSetupChannelEnabled(cfg, channel, false),
};
//#endregion
//#region extensions/imessage/src/channel.runtime.ts
async function sendIMessageOutbound(params) {
  const send =
    resolveOutboundSendDep(params.deps, "imessage", {
      legacyKeys: IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS,
    }) ?? sendMessageIMessage;
  const maxBytes = resolveChannelMediaMaxBytes({
    cfg: params.cfg,
    resolveChannelLimitMb: ({ cfg, accountId }) =>
      cfg.channels?.imessage?.accounts?.[accountId]?.mediaMaxMb ??
      cfg.channels?.imessage?.mediaMaxMb,
    accountId: params.accountId,
  });
  const result = await send(params.to, params.text, {
    config: params.cfg,
    ...(params.mediaUrl ? { mediaUrl: params.mediaUrl } : {}),
    ...(params.mediaLocalRoots?.length ? { mediaLocalRoots: params.mediaLocalRoots } : {}),
    ...(params.audioAsVoice ? { audioAsVoice: true } : {}),
    maxBytes,
    accountId: params.accountId ?? void 0,
    replyToId: params.replyToId ?? void 0,
  });
  const meta = {
    ...result.meta,
    ...(result.guid ? { imessageMessageGuid: result.guid } : {}),
    ...(result.sentText ? { imessageVisibleText: result.sentText } : {}),
  };
  return Object.keys(meta).length > 0
    ? {
        ...result,
        meta,
      }
    : result;
}
async function notifyIMessageApproval(params) {
  await sendMessageIMessage(params.id, PAIRING_APPROVED_MESSAGE, { config: params.cfg });
}
async function probeIMessageAccount(params) {
  return await probeIMessage(params?.timeoutMs, {
    cliPath: params?.cliPath,
    dbPath: params?.dbPath,
    forceRefresh: true,
  });
}
async function startIMessageGatewayAccount(ctx) {
  const account = ctx.account;
  const cliPath = account.config.cliPath?.trim() || "imsg";
  const dbPath = account.config.dbPath?.trim();
  ctx.setStatus({
    accountId: account.accountId,
    cliPath,
    dbPath: dbPath ?? null,
  });
  const ownerAccountId = resolveIMessageDuplicateSourceOwner({
    cfg: ctx.cfg,
    account,
  });
  if (ownerAccountId) {
    ctx.log?.info?.(
      `[${account.accountId}] skipping watcher: duplicate iMessage source; using account "${ownerAccountId}"`,
    );
    if (ctx.abortSignal.aborted) return;
    await new Promise((resolve) => {
      ctx.abortSignal.addEventListener("abort", () => resolve(), { once: true });
    });
    return;
  }
  ctx.log?.info?.(
    `[${account.accountId}] starting provider (${cliPath}${dbPath ? ` db=${dbPath}` : ""})`,
  );
  return await monitorIMessageProvider({
    accountId: account.accountId,
    config: ctx.cfg,
    runtime: ctx.runtime,
    abortSignal: ctx.abortSignal,
    channelRuntime: ctx.channelRuntime,
  });
}
//#endregion
export {
  imessageSetupWizard,
  notifyIMessageApproval,
  probeIMessageAccount,
  sendIMessageOutbound,
  startIMessageGatewayAccount,
};
