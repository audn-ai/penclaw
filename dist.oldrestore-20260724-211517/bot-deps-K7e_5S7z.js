import { createHash } from "node:crypto";
import { n as resolveAmbientTranscriptWatermarkKey } from "./ambient-transcript-watermark-ZvdDmxy7.js";
import { t as resolveApprovalOverGateway } from "./approval-gateway-resolver-BfeFoNXV.js";
import { n as recordChannelActivity } from "./channel-activity-4piA219h.js";
import { t as deliverInboundReplyWithMessageSendContext } from "./channel-outbound-DlkFd7rO.js";
import { t as listSkillCommandsForAgents } from "./chat-commands-CJmNOwIE.js";
import {
  r as normalizeTelegramCommandName,
  t as TELEGRAM_COMMAND_NAME_PATTERN,
} from "./command-config-BM9MYdyK.js";
import { t as buildModelsProviderData } from "./commands-models-DBIUoW_v.js";
import { t as buildChannelInboundEventContext } from "./context-DMJN91Z-.js";
import "./error-runtime-BIAwr399.js";
import "./runtime-config-snapshot-hRn3WGyJ.js";
import "./runtime-env-D0V-7Gqz.js";
import "./security-runtime-CraX8Pqe.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import { n as emitInternalMessageSentHook, t as deliverReplies } from "./delivery-DVOZx9e2.js";
import "./routing-CwvmVRHd.js";
import { l as resolvePinnedMainDmOwnerFromAllowlist } from "./dm-policy-shared-d7KFGRtT.js";
import {
  a as takeMessageIdAfterStop,
  i as createFinalizableDraftStreamControlsForState,
} from "./draft-stream-controls-CaxJNqVC.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { r as logVerbose } from "./globals-CNUzHTcU.js";
import { i as getRuntimeConfig } from "./io-B3ne6NxF.js";
import {
  f as readTelegramRetryAfterMs,
  i as isTelegramClientRejection,
  r as isSafeToRetrySendError,
  s as isTelegramMessageNotModifiedError,
  t as isRecoverableTelegramNetworkError,
  u as isTelegramRateLimitError,
} from "./network-errors-CFprAVtH.js";
import { t as TELEGRAM_TEXT_CHUNK_LIMIT } from "./outbound-adapter-CvNvgoM8.js";
import {
  c as upsertChannelPairingRequest,
  i as readChannelAllowFromStore,
} from "./pairing-store-C4j5pnVS.js";
import "./approval-gateway-runtime-DpnfEvUS.js";
import { t as dispatchReplyWithBufferedBlockDispatcher } from "./reply-dispatch-runtime-vBmhhmkr.js";
import { t as createChannelReplyPipeline } from "./reply-pipeline-uYpC1TSz.js";
import "./reply-reference-BM3zoGu5.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-CblWzjbF.js";
import { a as resolveInboundLastRouteSessionKey } from "./resolve-route-oiOq6bK9.js";
import "./web-media-Cv2iCdbz.js";
import "./system-event-runtime-BCfCTl5a.js";
import "./conversation-runtime-DuXhVyjf.js";
import {
  A as splitTelegramRichMarkdownChunks,
  E as buildTelegramRichMarkdownPlan,
  O as getTelegramRichRawApi,
  R as recordOutboundMessageForPromptContext,
  S as TELEGRAM_RICH_TEXT_LIMIT,
  a as editMessageTelegram,
  b as splitTelegramPlainTextChunks,
  et as withTelegramApiErrorLogging,
  j as splitTelegramRichMessageTextChunks,
  v as buildTelegramPlainFallbackPlan,
  w as buildTelegramRichHtmlPlan,
  x as warnTelegramRichHtmlDegradations,
  y as isTelegramHtmlParseError,
} from "./send-CfVpuwvn.js";
import "./channel-inbound-vhkYEe2n.js";
import "./models-provider-runtime-CqsAAgxL.js";
import "./skill-commands-runtime-CyIMauYt.js";
import {
  A as buildTelegramThreadParams,
  a as wasSentByBot,
  ct as markdownToTelegramChunks,
  ht as telegramHtmlToPlainTextFallback,
  mt as splitTelegramHtmlChunks,
  pt as renderTelegramHtmlText,
  st as escapeTelegramHtml,
  vt as normalizeTelegramReplyToMessageId,
} from "./sent-message-cache-D-3cw6_g.js";
import { t as recordInboundSession } from "./session-Fo42_iaz.js";
import {
  c as readAmbientTranscriptWatermark,
  i as listSessionEntries,
  l as readSessionUpdatedAt,
  m as resolveStorePath,
  r as getSessionEntry,
} from "./session-store-runtime-BwE6SlGz.js";
import { c as normalizeOptionalString, p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { a as enqueueSystemEvent } from "./system-events-CIAdjAwz.js";
import { n as loadWebMedia } from "./web-media-3hQ71Ejp.js";
//#region extensions/telegram/src/bot-native-command-menu.ts
const TELEGRAM_MAX_COMMANDS = 100;
const TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET = 5700;
const TELEGRAM_COMMAND_RETRY_RATIO = 0.8;
const TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH = 1;
const TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH = 256;
const TELEGRAM_MENU_RESULT_CACHE_MAX = 128;
const TELEGRAM_COMMAND_MENU_SCOPES = [
  { label: "default" },
  {
    label: "all_group_chats",
    options: { scope: { type: "all_group_chats" } },
  },
];
const cappedTelegramMenuCache = /* @__PURE__ */ new Map();
function countTelegramCommandText(value) {
  let count = 0;
  for (let index = 0; index < value.length;) {
    const codePoint = value.codePointAt(index);
    index += codePoint && codePoint > 65535 ? 2 : 1;
    count += 1;
  }
  return count;
}
function truncateTelegramCommandText(value, maxLength) {
  if (maxLength <= 0) return "";
  const suffix = maxLength > 1 ? "…" : "";
  const prefixLimit = maxLength - countTelegramCommandText(suffix);
  let count = 0;
  let prefixEnd = 0;
  for (const char of value) {
    count += 1;
    if (count <= prefixLimit) prefixEnd += char.length;
    if (count > maxLength) return `${value.slice(0, prefixEnd)}${suffix}`;
  }
  return value;
}
function fitTelegramCommandsWithinTextBudget(commands, maxTotalChars) {
  let candidateCommands = [...commands];
  while (candidateCommands.length > 0) {
    const descriptionBudget =
      maxTotalChars -
      candidateCommands.reduce(
        (total, command) => total + countTelegramCommandText(command.command),
        0,
      );
    if (descriptionBudget < candidateCommands.length * TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH) {
      candidateCommands = candidateCommands.slice(0, -1);
      continue;
    }
    const descriptionCap = Math.max(
      TELEGRAM_MIN_COMMAND_DESCRIPTION_LENGTH,
      Math.floor(descriptionBudget / candidateCommands.length),
    );
    let descriptionTrimmed = false;
    const fittedCommands = candidateCommands.map((command) => {
      const description = truncateTelegramCommandText(
        command.description,
        Math.min(descriptionCap, TELEGRAM_MAX_COMMAND_DESCRIPTION_LENGTH),
      );
      if (description !== command.description) {
        descriptionTrimmed = true;
        return Object.assign({}, command, { description });
      }
      return command;
    });
    return {
      commands: fittedCommands,
      descriptionTrimmed,
      textBudgetDropCount: commands.length - fittedCommands.length,
    };
  }
  return {
    commands: [],
    descriptionTrimmed: false,
    textBudgetDropCount: commands.length,
  };
}
function readErrorTextField(value, key) {
  if (!value || typeof value !== "object" || !(key in value)) return;
  return readStringValue(value[key]);
}
function isBotCommandsTooMuchError(err) {
  if (!err) return false;
  const pattern = /\bBOT_COMMANDS_TOO_MUCH\b/i;
  if (typeof err === "string") return pattern.test(err);
  if (err instanceof Error) {
    if (pattern.test(err.message)) return true;
  }
  const description = readErrorTextField(err, "description");
  if (description && pattern.test(description)) return true;
  const message = readErrorTextField(err, "message");
  if (message && pattern.test(message)) return true;
  return false;
}
function formatTelegramCommandRetrySuccessLog(params) {
  const omittedCount = Math.max(0, params.initialCount - params.acceptedCount);
  return `Telegram accepted ${params.acceptedCount} commands after BOT_COMMANDS_TOO_MUCH (started with ${params.initialCount}; omitted ${omittedCount}). Reduce plugin/skill/custom commands to expose more menu entries.`;
}
function buildPluginTelegramMenuCommands(params) {
  const { specs, existingCommands } = params;
  const commands = [];
  const issues = [];
  const pluginCommandNames = /* @__PURE__ */ new Set();
  for (const spec of specs) {
    const rawName = typeof spec.name === "string" ? spec.name : "";
    const normalized = normalizeTelegramCommandName(rawName);
    if (!normalized || !TELEGRAM_COMMAND_NAME_PATTERN.test(normalized)) {
      const invalidName = rawName.trim() ? rawName : "<unknown>";
      issues.push(
        `Plugin command "/${invalidName}" is invalid for Telegram (use a-z, 0-9, underscore; max 32 chars).`,
      );
      continue;
    }
    const description = normalizeOptionalString(spec.description) ?? "";
    if (!description) {
      issues.push(`Plugin command "/${normalized}" is missing a description.`);
      continue;
    }
    if (existingCommands.has(normalized)) {
      if (pluginCommandNames.has(normalized))
        issues.push(`Plugin command "/${normalized}" is duplicated.`);
      else
        issues.push(`Plugin command "/${normalized}" conflicts with an existing Telegram command.`);
      continue;
    }
    pluginCommandNames.add(normalized);
    existingCommands.add(normalized);
    const menuCommand = {
      command: normalized,
      description,
    };
    if (spec.descriptionLocalizations)
      menuCommand.descriptionLocalizations = spec.descriptionLocalizations;
    commands.push(menuCommand);
  }
  return {
    commands,
    issues,
  };
}
function buildCappedTelegramMenuCommands(params) {
  const maxCommands = params.maxCommands ?? TELEGRAM_MAX_COMMANDS;
  const maxTotalChars = params.maxTotalChars ?? TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET;
  const cacheKey = buildTelegramMenuResultCacheKey({
    allCommands: params.allCommands,
    maxCommands,
    maxTotalChars,
  });
  const cached = cappedTelegramMenuCache.get(cacheKey);
  if (cached) return cached;
  const result = buildUncachedCappedTelegramMenuCommands({
    allCommands: params.allCommands,
    maxCommands,
    maxTotalChars,
  });
  rememberCappedTelegramMenuResult(cacheKey, result);
  return result;
}
function buildUncachedCappedTelegramMenuCommands(params) {
  const { allCommands } = params;
  const { maxCommands, maxTotalChars } = params;
  const totalCommands = allCommands.length;
  const overflowCount = Math.max(0, totalCommands - maxCommands);
  const canonicalCommands = allCommands.filter((command) => !command.isAlias);
  const aliasCommands = allCommands.filter((command) => command.isAlias);
  const aliasBudget = Math.max(0, maxCommands - canonicalCommands.length);
  const {
    commands: fittedCommands,
    descriptionTrimmed,
    textBudgetDropCount,
  } = fitTelegramCommandsWithinTextBudget(
    (overflowCount === 0
      ? allCommands
      : [...canonicalCommands, ...aliasCommands.slice(0, aliasBudget)]
    ).slice(0, maxCommands),
    maxTotalChars,
  );
  return {
    commandsToRegister: fittedCommands.map(({ isAlias: _isAlias, ...command }) => command),
    totalCommands,
    maxCommands,
    overflowCount,
    maxTotalChars,
    descriptionTrimmed,
    textBudgetDropCount,
  };
}
function buildTelegramMenuResultCacheKey(params) {
  const digest = createHash("sha256");
  updateTelegramCommandDigestField(digest, String(params.maxCommands));
  updateTelegramCommandDigestField(digest, String(params.maxTotalChars));
  for (const command of params.allCommands) {
    updateTelegramCommandDigestField(digest, command.command);
    updateTelegramCommandDigestField(digest, command.description);
    updateTelegramCommandDigestField(digest, command.isAlias ? "1" : "0");
    updateTelegramCommandLocalizationDigest(digest, command.descriptionLocalizations);
  }
  return digest.digest("hex").slice(0, 16);
}
function updateTelegramCommandDigestField(digest, value) {
  digest.update(String(value.length));
  digest.update(":");
  digest.update(value);
}
function updateTelegramCommandLocalizationDigest(digest, localizations) {
  const entries = Object.entries(localizations ?? {}).toSorted(([a], [b]) => a.localeCompare(b));
  updateTelegramCommandDigestField(digest, String(entries.length));
  for (const [locale, description] of entries) {
    updateTelegramCommandDigestField(digest, locale);
    updateTelegramCommandDigestField(digest, description);
  }
}
function rememberCappedTelegramMenuResult(key, result) {
  cappedTelegramMenuCache.set(key, result);
  if (cappedTelegramMenuCache.size <= TELEGRAM_MENU_RESULT_CACHE_MAX) return;
  const oldestKey = cappedTelegramMenuCache.keys().next().value;
  if (oldestKey) cappedTelegramMenuCache.delete(oldestKey);
}
function hashCommandList(commands) {
  const sorted = [...commands].toSorted((a, b) => a.command.localeCompare(b.command));
  return createHash("sha256").update(JSON.stringify(sorted)).digest("hex").slice(0, 16);
}
const syncedCommandHashes = /* @__PURE__ */ new Map();
function getCommandHashKey(accountId, botIdentity) {
  return `${accountId ?? "default"}:${botIdentity ?? ""}`;
}
function readCachedCommandHash(accountId, botIdentity) {
  const key = getCommandHashKey(accountId, botIdentity);
  return syncedCommandHashes.get(key) ?? null;
}
function writeCachedCommandHash(accountId, botIdentity, hash) {
  const key = getCommandHashKey(accountId, botIdentity);
  syncedCommandHashes.set(key, hash);
}
function normalizeTelegramLanguageCode(languageCode) {
  const normalized = languageCode.trim().toLowerCase();
  return /^[a-z]{2}$/.test(normalized) ? normalized : null;
}
function readLocalizedDescription(command, languageCode) {
  for (const [rawLanguageCode, rawDescription] of Object.entries(
    command.descriptionLocalizations ?? {},
  )) {
    if (normalizeTelegramLanguageCode(rawLanguageCode) !== languageCode) continue;
    const description = normalizeOptionalString(rawDescription);
    if (description) return description;
  }
}
function toTelegramBotCommands(commands) {
  return commands.map((command) => ({
    command: command.command,
    description: command.description,
  }));
}
function buildLocalizedCommandVariants(commands) {
  const locales = /* @__PURE__ */ new Set();
  const unsupportedLanguageCodes = /* @__PURE__ */ new Set();
  for (const cmd of commands)
    if (cmd.descriptionLocalizations)
      for (const lang of Object.keys(cmd.descriptionLocalizations)) {
        const normalized = normalizeTelegramLanguageCode(lang);
        if (normalized) locales.add(normalized);
        else unsupportedLanguageCodes.add(lang);
      }
  return {
    variants: [...locales].toSorted().map((languageCode) => {
      return {
        languageCode,
        commands: fitTelegramCommandsWithinTextBudget(
          commands.map((cmd) => ({
            command: cmd.command,
            description: readLocalizedDescription(cmd, languageCode) ?? cmd.description,
          })),
          TELEGRAM_TOTAL_COMMAND_TEXT_BUDGET,
        ).commands,
      };
    }),
    unsupportedLanguageCodes: [...unsupportedLanguageCodes].toSorted(),
  };
}
function formatTelegramCommandScopeOperation(operation, scope, languageCode) {
  const base = scope.label === "default" ? operation : `${operation}(${scope.label})`;
  return languageCode ? `${base}(${languageCode})` : base;
}
async function deleteTelegramMenuCommandsForScopes(params) {
  const { bot, runtime } = params;
  if (typeof bot.api.deleteMyCommands !== "function") return true;
  let allDeleted = true;
  for (const scope of TELEGRAM_COMMAND_MENU_SCOPES) {
    const deleted = await withTelegramApiErrorLogging({
      operation: formatTelegramCommandScopeOperation("deleteMyCommands", scope),
      runtime,
      fn: () =>
        scope.options ? bot.api.deleteMyCommands(scope.options) : bot.api.deleteMyCommands(),
    })
      .then(() => true)
      .catch(() => false);
    allDeleted &&= deleted;
  }
  return allDeleted;
}
async function setTelegramMenuCommandsForScopes(params) {
  const { bot, runtime, commands, languageCode, shouldLog } = params;
  for (const scope of TELEGRAM_COMMAND_MENU_SCOPES)
    await withTelegramApiErrorLogging({
      operation: formatTelegramCommandScopeOperation("setMyCommands", scope, languageCode),
      runtime,
      shouldLog,
      fn: () => {
        const botCommands = toTelegramBotCommands(commands);
        const opts = {
          ...scope.options,
          ...(languageCode ? { language_code: languageCode } : void 0),
        };
        return Object.keys(opts).length > 0
          ? bot.api.setMyCommands(botCommands, opts)
          : bot.api.setMyCommands(botCommands);
      },
    });
}
function syncTelegramMenuCommands(params) {
  const { bot, runtime, commandsToRegister, accountId, botIdentity } = params;
  const sync = async () => {
    const currentHash = hashCommandList(commandsToRegister);
    if (readCachedCommandHash(accountId, botIdentity) === currentHash) {
      logVerbose("telegram: command menu unchanged; skipping sync");
      return;
    }
    const deleteSucceeded = await deleteTelegramMenuCommandsForScopes({
      bot,
      runtime,
    });
    if (commandsToRegister.length === 0) {
      if (!deleteSucceeded) {
        runtime.log?.("telegram: deleteMyCommands failed; skipping empty-menu hash cache write");
        return;
      }
      if (typeof bot.api.deleteMyCommands !== "function")
        await setTelegramMenuCommandsForScopes({
          bot,
          runtime,
          commands: [],
        });
      writeCachedCommandHash(accountId, botIdentity, currentHash);
      return;
    }
    let retryCommands = commandsToRegister;
    let acceptedCommands = null;
    const initialCommandCount = commandsToRegister.length;
    while (retryCommands.length > 0)
      try {
        await setTelegramMenuCommandsForScopes({
          bot,
          runtime,
          commands: retryCommands,
          shouldLog: (err) => !isBotCommandsTooMuchError(err),
        });
        if (retryCommands.length < initialCommandCount)
          runtime.log?.(
            formatTelegramCommandRetrySuccessLog({
              initialCount: initialCommandCount,
              acceptedCount: retryCommands.length,
            }),
          );
        acceptedCommands = retryCommands;
        break;
      } catch (err) {
        if (!isBotCommandsTooMuchError(err)) throw err;
        const nextCount = Math.floor(retryCommands.length * TELEGRAM_COMMAND_RETRY_RATIO);
        const reducedCount =
          nextCount < retryCommands.length ? nextCount : retryCommands.length - 1;
        if (reducedCount <= 0) {
          runtime.error?.(
            "Telegram rejected native command registration (BOT_COMMANDS_TOO_MUCH); leaving menu empty. Reduce commands or disable channels.telegram.commands.native.",
          );
          return;
        }
        runtime.log?.(
          `Telegram rejected ${retryCommands.length} commands (BOT_COMMANDS_TOO_MUCH); retrying with ${reducedCount}.`,
        );
        retryCommands = retryCommands.slice(0, reducedCount);
      }
    if (!acceptedCommands) return;
    const { variants, unsupportedLanguageCodes } = buildLocalizedCommandVariants(acceptedCommands);
    if (unsupportedLanguageCodes.length > 0)
      runtime.log?.(
        `Telegram command menu ignored unsupported description localization codes: ${unsupportedLanguageCodes.join(", ")}.`,
      );
    for (const variant of variants)
      await setTelegramMenuCommandsForScopes({
        bot,
        runtime,
        commands: variant.commands,
        languageCode: variant.languageCode,
      });
    writeCachedCommandHash(accountId, botIdentity, currentHash);
  };
  sync().catch((err) => {
    runtime.error?.(`Telegram command sync failed: ${String(err)}`);
  });
}
//#endregion
//#region extensions/telegram/src/draft-stream.ts
const DEFAULT_THROTTLE_MS = 1e3;
const MAX_CONSECUTIVE_PREVIEW_FAILURES = 3;
const MAX_PREVIEW_FLOOD_SUSPEND_MS = 6e4;
const MIN_PREVIEW_DWELL_MS = 4e3;
function telegramRichHtmlToParseModeHtml(html) {
  return html.replace(/<br\s*\/?>/giu, "\n");
}
function buildTelegramDraftRichPlan(preview) {
  const options = preview.richMessage
    ? { skipEntityDetection: preview.richMessage.skip_entity_detection === true }
    : void 0;
  if (preview.richMessage?.html !== void 0)
    return buildTelegramRichHtmlPlan(preview.richMessage.html, options);
  return buildTelegramRichMarkdownPlan(preview.richMessage?.markdown ?? preview.text, options);
}
function planTelegramDraftPages(preview, maxChars, richMessages) {
  if (richMessages) {
    const previews = preview.richMessage
      ? [preview]
      : splitTelegramRichMarkdownChunks(preview.text, Number.MAX_SAFE_INTEGER, "length").map(
          (text) => ({ text }),
        );
    const pages = [];
    for (const richPreview of previews) {
      const plan = buildTelegramDraftRichPlan(richPreview);
      const planPages = splitTelegramRichMessageTextChunks({
        text: plan.richMessage.html,
        textLimit: maxChars,
        textMode: "html",
        chunkMode: "length",
        skipEntityDetection: plan.richMessage.skip_entity_detection === true,
      }).map((page) => ({
        text: page.plainText,
        sourceText: page.text,
        sourceTextMode: page.textMode,
        richMessage: {
          html: page.text,
          ...(page.skipEntityDetection ? { skip_entity_detection: true } : {}),
        },
      }));
      if (planPages[0] && plan.degradationReasons.length > 0)
        planPages[0].degradationReasons = plan.degradationReasons;
      pages.push(...planPages);
    }
    return pages;
  }
  if (preview.markdownSource)
    return markdownToTelegramChunks(preview.markdownSource.text, maxChars, {
      tableMode: preview.markdownSource.tableMode,
    }).map((chunk) => ({
      text: chunk.text,
      sourceText: chunk.html,
      sourceTextMode: "html",
    }));
  const htmlText = preview.richMessage?.html
    ? telegramRichHtmlToParseModeHtml(preview.richMessage.html)
    : preview.richMessage?.markdown
      ? renderTelegramHtmlText(preview.richMessage.markdown)
      : preview.parseMode === "HTML"
        ? telegramRichHtmlToParseModeHtml(preview.text)
        : void 0;
  if (htmlText === void 0)
    return splitTelegramPlainTextChunks(preview.text, maxChars)
      .map((chunk, index) => (index === 0 ? chunk.trimEnd() : chunk.trim()))
      .filter(Boolean)
      .map((sourceText) => ({
        text: sourceText,
        sourceText,
        sourceTextMode: "markdown",
      }));
  const plainText = preview.richMessage
    ? preview.text
    : telegramHtmlToPlainTextFallback(preview.text);
  const htmlPages = splitTelegramHtmlChunks(htmlText, maxChars);
  return htmlPages.map((sourceText) => ({
    text: htmlPages.length === 1 ? plainText : telegramHtmlToPlainTextFallback(sourceText),
    sourceText,
    sourceTextMode: "html",
    fullSourceText: htmlText,
  }));
}
function createTelegramDraftStream(params) {
  const richMessages = params.richMessages === true;
  const transportLimit = richMessages ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT;
  const maxChars = Math.min(params.maxChars ?? transportLimit, transportLimit);
  const throttleMs = Math.max(250, params.throttleMs ?? DEFAULT_THROTTLE_MS);
  const minInitialChars = params.minInitialChars;
  const chatId = params.chatId;
  const threadParams = buildTelegramThreadParams(params.thread);
  const replyToMessageId = normalizeTelegramReplyToMessageId(params.replyToMessageId);
  const initialSendMessageParams =
    replyToMessageId != null
      ? {
          ...threadParams,
          reply_parameters: {
            message_id: replyToMessageId,
            allow_sending_without_reply: true,
          },
        }
      : (threadParams ?? {});
  const consumesReplyTarget =
    replyToMessageId != null &&
    params.replyToMode !== void 0 &&
    isSingleUseReplyToMode(params.replyToMode);
  let replyTargetState = { kind: "available" };
  const reserveReplyTargetForSend = (sendGeneration) => {
    if (!consumesReplyTarget) return initialSendMessageParams;
    if (replyTargetState.kind !== "available") return threadParams ?? {};
    replyTargetState = {
      kind: "pending",
      generation: sendGeneration,
    };
    return initialSendMessageParams;
  };
  const releasePendingReplyTarget = (sendGeneration) => {
    if (replyTargetState.kind === "pending" && replyTargetState.generation === sendGeneration)
      replyTargetState = { kind: "available" };
  };
  const retainReplyTarget = (sendGeneration, messageId) => {
    if (replyTargetState.kind === "pending" && replyTargetState.generation === sendGeneration)
      replyTargetState = {
        kind: "retained",
        generation: sendGeneration,
        messageId,
      };
  };
  const streamState = {
    stopped: false,
    final: false,
  };
  let messageSendAttempted = false;
  let suspendedUntilMs = 0;
  let consecutivePreviewFailures = 0;
  let streamMessageId;
  let streamMessageSnapshot;
  let streamVisibleSinceMs;
  let lastSentPreviewKey = "";
  let lastDeliveredText = "";
  let lastRequestedText = "";
  let lastRequestedPreview;
  let generation = 0;
  let finalPagePlan;
  const repositionedSendGenerations = /* @__PURE__ */ new Set();
  const fallbackSnapshot = (plainText) => ({
    text: plainText,
    sourceText: escapeTelegramHtml(plainText),
    sourceTextMode: "html",
  });
  const sendPlannedMessage = async (page, sendMessageParams) => {
    if (page.richMessage) {
      warnTelegramRichHtmlDegradations({
        context: "stream preview",
        reasons: page.degradationReasons ?? [],
        warn: (message) => params.warn?.(message),
      });
      try {
        return {
          message: await getTelegramRichRawApi(params.api).sendRichMessage({
            chat_id: chatId,
            rich_message: page.richMessage,
            ...sendMessageParams,
          }),
          snapshot: page,
        };
      } catch (err) {
        const fallbackPlan = buildTelegramPlainFallbackPlan({
          html: page.richMessage.html,
          err,
          context: "stream preview",
          warn: (message) => params.warn?.(message),
        });
        if (!fallbackPlan) throw err;
        return {
          message: await params.api.sendMessage(chatId, fallbackPlan.plainText, sendMessageParams),
          snapshot: fallbackSnapshot(fallbackPlan.plainText),
        };
      }
    }
    if (page.sourceTextMode !== "html")
      return {
        message: await params.api.sendMessage(chatId, page.text, sendMessageParams),
        snapshot: page,
      };
    try {
      return {
        message: await params.api.sendMessage(chatId, page.sourceText, {
          parse_mode: "HTML",
          ...sendMessageParams,
        }),
        snapshot: page,
      };
    } catch (err) {
      if (!isTelegramHtmlParseError(err)) throw err;
      return {
        message: await params.api.sendMessage(chatId, page.text, sendMessageParams),
        snapshot: fallbackSnapshot(page.text),
      };
    }
  };
  const sendMessageTransportPreview = async (page, sendGeneration) => {
    const targetMessageId = streamMessageId;
    if (typeof targetMessageId === "number") {
      streamVisibleSinceMs ??= Date.now();
      let acceptedSnapshot = page;
      if (page.richMessage) {
        warnTelegramRichHtmlDegradations({
          context: "stream preview edit",
          reasons: page.degradationReasons ?? [],
          warn: (message) => params.warn?.(message),
        });
        try {
          await getTelegramRichRawApi(params.api).editMessageText({
            chat_id: chatId,
            message_id: targetMessageId,
            rich_message: page.richMessage,
          });
        } catch (err) {
          const fallbackPlan = buildTelegramPlainFallbackPlan({
            html: page.richMessage.html,
            err,
            context: "stream preview edit",
            warn: (message) => params.warn?.(message),
          });
          if (!fallbackPlan) throw err;
          await params.api.editMessageText(chatId, targetMessageId, fallbackPlan.plainText);
          acceptedSnapshot = fallbackSnapshot(fallbackPlan.plainText);
        }
      } else if (page.sourceTextMode === "html")
        try {
          await params.api.editMessageText(chatId, targetMessageId, page.sourceText, {
            parse_mode: "HTML",
          });
        } catch (err) {
          if (!isTelegramHtmlParseError(err)) throw err;
          await params.api.editMessageText(chatId, targetMessageId, page.text);
          acceptedSnapshot = fallbackSnapshot(page.text);
        }
      else await params.api.editMessageText(chatId, targetMessageId, page.sourceText);
      if (sendGeneration === generation && streamMessageId === targetMessageId)
        streamMessageSnapshot = acceptedSnapshot;
      return true;
    }
    messageSendAttempted = true;
    const sendMessageParams = reserveReplyTargetForSend(sendGeneration);
    let sent;
    try {
      sent = await sendPlannedMessage(page, sendMessageParams);
    } catch (err) {
      const definitelyRejected = isSafeToRetrySendError(err) || isTelegramClientRejection(err);
      if (sendGeneration === generation && definitelyRejected) messageSendAttempted = false;
      if (definitelyRejected) releasePendingReplyTarget(sendGeneration);
      throw err;
    }
    const sentMessageId = sent.message?.message_id;
    const normalizedMessageId =
      typeof sentMessageId === "number" && Number.isFinite(sentMessageId)
        ? Math.trunc(sentMessageId)
        : void 0;
    if (normalizedMessageId === void 0) {
      if (sendGeneration === generation) {
        streamState.stopped = true;
        params.warn?.("telegram stream preview stopped (missing message id from sendMessage)");
        return false;
      }
      return true;
    }
    retainReplyTarget(sendGeneration, normalizedMessageId);
    if (sendGeneration !== generation) {
      const visibleSinceMs = Date.now();
      if (repositionedSendGenerations.delete(sendGeneration)) {
        scheduleDetachedDelete(normalizedMessageId, visibleSinceMs, REPOSITION_DELETE_DELAY_MS);
        return true;
      }
      params.onRetainedPage?.({
        messageId: normalizedMessageId,
        textSnapshot: sent.snapshot.text,
        visibleSinceMs,
      });
      return true;
    }
    const visibleSinceMs = Date.now();
    streamMessageId = normalizedMessageId;
    streamMessageSnapshot = sent.snapshot;
    streamVisibleSinceMs = visibleSinceMs;
    return true;
  };
  const sendOrEditPlannedPage = async (page) => {
    const renderedPreviewKey = JSON.stringify([
      page.sourceTextMode,
      page.sourceText,
      page.richMessage?.skip_entity_detection === true,
    ]);
    if (renderedPreviewKey === lastSentPreviewKey) return true;
    const sendGeneration = generation;
    if (typeof streamMessageId !== "number" && minInitialChars != null && !streamState.final) {
      if (page.text.length < minInitialChars) return false;
    }
    const previousSentPreviewKey = lastSentPreviewKey;
    lastSentPreviewKey = renderedPreviewKey;
    try {
      const sent = await sendMessageTransportPreview(page, sendGeneration);
      if (sendGeneration !== generation) return true;
      if (sent) {
        consecutivePreviewFailures = 0;
        suspendedUntilMs = 0;
      }
      return sent;
    } catch (err) {
      if (sendGeneration !== generation) return true;
      const isEdit = typeof streamMessageId === "number";
      if (isEdit && isTelegramMessageNotModifiedError(err)) {
        consecutivePreviewFailures = 0;
        streamMessageSnapshot = page;
        return true;
      }
      lastSentPreviewKey = previousSentPreviewKey;
      const retryable =
        isTelegramRateLimitError(err) ||
        (isEdit ? isRecoverableTelegramNetworkError(err) : isSafeToRetrySendError(err));
      consecutivePreviewFailures += 1;
      if (retryable && consecutivePreviewFailures <= MAX_CONSECUTIVE_PREVIEW_FAILURES) {
        const retryAfterMs = readTelegramRetryAfterMs(err);
        if (retryAfterMs !== void 0)
          suspendedUntilMs = Date.now() + Math.min(retryAfterMs, MAX_PREVIEW_FLOOD_SUSPEND_MS);
        params.warn?.(
          `telegram stream preview ${isEdit ? "edit" : "send"} failed (retrying): ${formatErrorMessage(err)}`,
        );
        return false;
      }
      streamState.stopped = true;
      params.warn?.(`telegram stream preview failed: ${formatErrorMessage(err)}`);
      return false;
    }
  };
  const retainCurrentPage = () => {
    if (typeof streamMessageId !== "number" || !streamMessageSnapshot?.text) return;
    params.onRetainedPage?.({
      messageId: streamMessageId,
      textSnapshot: streamMessageSnapshot.text,
      visibleSinceMs: streamVisibleSinceMs,
    });
  };
  const resolveExactRemainingPage = (plan) => {
    if (plan.nextPageIndex <= 0 || plan.nextPageIndex >= plan.pages.length) return;
    const acceptedSourceText = plan.pages
      .slice(0, plan.nextPageIndex)
      .map((page) => page.sourceText)
      .join("");
    const fullSourceText = plan.pages[0]?.fullSourceText;
    if (!fullSourceText?.startsWith(acceptedSourceText)) return;
    const sourceText = fullSourceText.slice(acceptedSourceText.length);
    const text = telegramHtmlToPlainTextFallback(sourceText);
    return text.length <= maxChars
      ? {
          text,
          sourceText,
          sourceTextMode: "html",
          fullSourceText,
        }
      : void 0;
  };
  const sendOrEditStreamMessage = async (text) => {
    if (streamState.stopped && !streamState.final) return false;
    if (!streamState.final && Date.now() < suspendedUntilMs) return false;
    const trimmed = text.trimEnd();
    if (!trimmed) return false;
    const fullPreview =
      lastRequestedPreview?.text === trimmed
        ? lastRequestedPreview
        : (params.renderText?.(trimmed) ?? { text: trimmed });
    const pages =
      streamState.final && finalPagePlan
        ? finalPagePlan.pages
        : planTelegramDraftPages(fullPreview, maxChars, richMessages);
    const firstPage = pages[0];
    if (!firstPage) return false;
    if (!streamState.final) {
      finalPagePlan = void 0;
      const sent = await sendOrEditPlannedPage(firstPage);
      if (sent) lastDeliveredText = pages.length === 1 ? trimmed : firstPage.text.trimEnd();
      return sent;
    }
    const activePlan = (finalPagePlan ??= {
      pages,
      nextPageIndex: 0,
    });
    for (let index = activePlan.nextPageIndex; index < pages.length; index += 1) {
      const exactRemainingPage = resolveExactRemainingPage(activePlan);
      const page = exactRemainingPage ?? pages[index];
      if (index > 0 && typeof streamMessageId === "number") {
        retainCurrentPage();
        resetStreamToNewMessage(true);
      }
      if (!(await sendOrEditPlannedPage(page))) return false;
      if (finalPagePlan !== activePlan) return true;
      activePlan.nextPageIndex = exactRemainingPage ? pages.length : index + 1;
      if (exactRemainingPage) break;
    }
    finalPagePlan = void 0;
    lastDeliveredText = trimmed;
    return true;
  };
  const {
    loop,
    update: updateDraft,
    stopForClear,
  } = createFinalizableDraftStreamControlsForState({
    throttleMs,
    state: streamState,
    sendOrEditStreamMessage,
  });
  const requestDraftUpdate = (text, preview) => {
    if (streamState.stopped || streamState.final) return;
    lastRequestedPreview = preview;
    lastRequestedText = text;
    updateDraft(text);
  };
  const updatePreview = (preview) => {
    const text = preview.text.trimEnd();
    if (!text) return;
    requestDraftUpdate(text, {
      ...preview,
      text,
    });
  };
  const stop = async () => {
    const stopGeneration = generation;
    const waitForRetryAfter = async () => {
      const delayMs = Math.max(0, suspendedUntilMs - Date.now());
      if (delayMs > 0)
        await new Promise((resolve) => {
          setTimeout(resolve, delayMs);
        });
    };
    streamState.final = true;
    loop.resetThrottleWindow();
    await loop.waitForInFlight();
    if (generation !== stopGeneration || streamState.stopped) return;
    await waitForRetryAfter();
    if (generation !== stopGeneration || streamState.stopped) return;
    await loop.flush();
    if (generation !== stopGeneration || streamState.stopped) return;
    const finalText = lastRequestedText.trimEnd();
    if (finalText && finalText !== lastDeliveredText.trimEnd())
      for (let attempt = 0; attempt < 2; attempt += 1) {
        await waitForRetryAfter();
        if (generation !== stopGeneration || streamState.stopped) return;
        const sent = await sendOrEditStreamMessage(finalText);
        if (generation !== stopGeneration) return;
        if (sent) {
          loop.resetPending();
          break;
        }
        if (!finalPagePlan || streamState.stopped) break;
      }
    streamState.final = true;
  };
  const remainingFinalContent = () => {
    const plan = finalPagePlan;
    if (!plan || plan.nextPageIndex <= 0 || plan.nextPageIndex >= plan.pages.length) return;
    const pages = plan.pages.slice(plan.nextPageIndex);
    const exactRemainingPage = resolveExactRemainingPage(plan);
    const sourceText =
      exactRemainingPage?.sourceText ||
      pages
        .map((page) =>
          page.sourceTextMode === "html" ? page.sourceText : escapeTelegramHtml(page.text),
        )
        .join("");
    return {
      text: exactRemainingPage?.text ?? pages.map((page) => page.text).join(""),
      sourceText,
      sourceTextMode: "html",
    };
  };
  const resetStreamToNewMessage = (continueFinalPagination = false) => {
    streamState.stopped = false;
    streamState.final = continueFinalPagination;
    if (!continueFinalPagination) generation += 1;
    messageSendAttempted = false;
    streamMessageId = void 0;
    streamMessageSnapshot = void 0;
    streamVisibleSinceMs = void 0;
    lastSentPreviewKey = "";
    if (!continueFinalPagination) {
      finalPagePlan = void 0;
      lastRequestedText = "";
      loop.resetPending();
      lastRequestedPreview = void 0;
    }
    loop.resetThrottleWindow();
  };
  const scheduleDetachedDelete = (messageId, visibleSince, minDelayMs = 0) => {
    const runDelete = async () => {
      try {
        if (!(await params.api.deleteMessage(chatId, messageId))) {
          params.warn?.(
            `telegram stream preview cleanup was not confirmed (chat=${chatId}, message=${messageId})`,
          );
          return;
        }
        if (replyTargetState.kind === "retained" && replyTargetState.messageId === messageId)
          replyTargetState = { kind: "available" };
        params.log?.(`telegram stream preview deleted (chat=${chatId}, message=${messageId})`);
      } catch (err) {
        params.warn?.(`telegram stream preview cleanup failed: ${formatErrorMessage(err)}`);
      }
    };
    const elapsedMs =
      typeof visibleSince === "number" ? Date.now() - visibleSince : MIN_PREVIEW_DWELL_MS;
    const remainingDwellMs = Math.max(0, MIN_PREVIEW_DWELL_MS - elapsedMs);
    const delayMs = Math.max(remainingDwellMs, minDelayMs);
    if (delayMs <= 0) runDelete();
    else
      setTimeout(() => {
        runDelete();
      }, delayMs);
  };
  const clear = async () => {
    const visibleSince = streamVisibleSinceMs;
    const messageId = await takeMessageIdAfterStop({
      stopForClear,
      readMessageId: () => streamMessageId,
      clearMessageId: () => {
        streamMessageId = void 0;
        streamMessageSnapshot = void 0;
      },
    });
    if (typeof messageId === "number" && Number.isFinite(messageId))
      scheduleDetachedDelete(messageId, visibleSince);
  };
  const REPOSITION_DELETE_DELAY_MS = 1500;
  const rotateToNewMessageDeferringDelete = () => {
    const supersededMessageId = streamMessageId;
    const supersededVisibleSince = streamVisibleSinceMs;
    if (messageSendAttempted && streamMessageId === void 0)
      repositionedSendGenerations.add(generation);
    resetStreamToNewMessage();
    if (typeof supersededMessageId === "number" && Number.isFinite(supersededMessageId)) {
      scheduleDetachedDelete(
        supersededMessageId,
        supersededVisibleSince,
        REPOSITION_DELETE_DELAY_MS,
      );
      return supersededMessageId;
    }
  };
  const finalizeToPreview = async (preview) => {
    const finalizeGeneration = generation;
    const text = preview.text.trimEnd();
    if (!text) return;
    streamState.final = true;
    await loop.flush();
    if (generation !== finalizeGeneration) return;
    if (typeof streamMessageId !== "number" && !streamState.stopped) {
      const pending = lastRequestedText.trimEnd();
      if (pending && pending !== lastDeliveredText.trimEnd()) {
        const materialized = await sendOrEditStreamMessage(pending);
        if (generation !== finalizeGeneration) return;
        if (materialized) loop.resetPending();
      }
    }
    if (typeof streamMessageId !== "number") return;
    loop.resetPending();
    finalPagePlan = void 0;
    lastSentPreviewKey = "";
    lastRequestedText = text;
    lastRequestedPreview = {
      ...preview,
      text,
    };
    const edited = await sendOrEditStreamMessage(text);
    if (generation !== finalizeGeneration) return;
    streamState.stopped = true;
    return edited ? streamMessageId : void 0;
  };
  params.log?.(`telegram stream preview ready (maxChars=${maxChars}, throttleMs=${throttleMs})`);
  return {
    update: requestDraftUpdate,
    updatePreview,
    flush: loop.flush,
    messageId: () => streamMessageId,
    lastDeliveredText: () => lastDeliveredText,
    currentMessageSnapshot: () => streamMessageSnapshot,
    clear,
    stop,
    discard: stopForClear,
    remainingFinalContent,
    hasConsumedReplyTarget: () => replyTargetState.kind !== "available",
    finalizeToPreview,
    forceNewMessage: () => resetStreamToNewMessage(),
    rotateToNewMessageDeferringDelete,
    sendMayHaveLanded: () => messageSendAttempted && typeof streamMessageId !== "number",
  };
}
//#endregion
//#region extensions/telegram/src/exec-approval-resolver.ts
async function resolveTelegramApproval(params) {
  return await resolveApprovalOverGateway({
    cfg: params.cfg,
    approvalId: params.approvalId,
    approvalKind: params.approvalKind,
    decision: params.decision,
    senderId: params.senderId,
    gatewayUrl: params.gatewayUrl,
    clientDisplayName: `Telegram approval (${params.senderId?.trim() || "unknown"})`,
  });
}
/** Compatibility resolver for command/value buttons that predate typed approval actions. */
async function resolveTelegramLegacyApproval(params) {
  await resolveApprovalOverGateway({
    cfg: params.cfg,
    approvalId: params.approvalId,
    decision: params.decision,
    senderId: params.senderId,
    gatewayUrl: params.gatewayUrl,
    resolveMethod: params.approvalKind,
    clientDisplayName: `Telegram approval (${params.senderId?.trim() || "unknown"})`,
  });
}
//#endregion
//#region extensions/telegram/src/bot-deps.ts
const defaultTelegramBotDeps = {
  get getRuntimeConfig() {
    return getRuntimeConfig;
  },
  get resolveStorePath() {
    return resolveStorePath;
  },
  get getSessionEntry() {
    return getSessionEntry;
  },
  get listSessionEntries() {
    return listSessionEntries;
  },
  get readChannelAllowFromStore() {
    return readChannelAllowFromStore;
  },
  get readSessionUpdatedAt() {
    return readSessionUpdatedAt;
  },
  get readAmbientTranscriptWatermark() {
    return readAmbientTranscriptWatermark;
  },
  get resolveAmbientTranscriptWatermarkKey() {
    return resolveAmbientTranscriptWatermarkKey;
  },
  get recordInboundSession() {
    return recordInboundSession;
  },
  get recordChannelActivity() {
    return recordChannelActivity;
  },
  get resolveInboundLastRouteSessionKey() {
    return resolveInboundLastRouteSessionKey;
  },
  get resolvePinnedMainDmOwnerFromAllowlist() {
    return resolvePinnedMainDmOwnerFromAllowlist;
  },
  get buildChannelInboundEventContext() {
    return buildChannelInboundEventContext;
  },
  get upsertChannelPairingRequest() {
    return upsertChannelPairingRequest;
  },
  get enqueueSystemEvent() {
    return enqueueSystemEvent;
  },
  get dispatchReplyWithBufferedBlockDispatcher() {
    return dispatchReplyWithBufferedBlockDispatcher;
  },
  get loadWebMedia() {
    return loadWebMedia;
  },
  get buildModelsProviderData() {
    return buildModelsProviderData;
  },
  get listSkillCommandsForAgents() {
    return listSkillCommandsForAgents;
  },
  get syncTelegramMenuCommands() {
    return syncTelegramMenuCommands;
  },
  get wasSentByBot() {
    return wasSentByBot;
  },
  get resolveApproval() {
    return resolveTelegramApproval;
  },
  get resolveLegacyApproval() {
    return resolveTelegramLegacyApproval;
  },
  get createTelegramDraftStream() {
    return createTelegramDraftStream;
  },
  get deliverReplies() {
    return deliverReplies;
  },
  get deliverInboundReplyWithMessageSendContext() {
    return deliverInboundReplyWithMessageSendContext;
  },
  get emitInternalMessageSentHook() {
    return emitInternalMessageSentHook;
  },
  get editMessageTelegram() {
    return editMessageTelegram;
  },
  get recordOutboundMessageForPromptContext() {
    return recordOutboundMessageForPromptContext;
  },
  get createChannelMessageReplyPipeline() {
    return createChannelReplyPipeline;
  },
};
//#endregion
export {
  buildCappedTelegramMenuCommands as a,
  createTelegramDraftStream as i,
  resolveTelegramApproval as n,
  buildPluginTelegramMenuCommands as o,
  resolveTelegramLegacyApproval as r,
  syncTelegramMenuCommands as s,
  defaultTelegramBotDeps as t,
};
