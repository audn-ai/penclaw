import { g as parseExecApprovalCommandText } from "./exec-approval-reply-Djiq6tOJ.js";
import { t as reduceInteractiveReply } from "./interactive-jsbwR_sV.js";
import {
  a as buildTelegramApprovalCallbackData,
  l as rewriteTelegramApprovalDecisionAlias,
  n as buildTelegramOpaqueCallbackData,
  s as hasTelegramApprovalCallbackPrefix,
  t as buildTelegramNativeCommandCallbackData,
  u as sanitizeTelegramCallbackData,
} from "./native-command-callback-data-CXJqZx00.js";
import "./approval-reply-runtime-BpszN-io.js";
import {
  _ as resolveMessagePresentationButtonAction,
  c as normalizeInteractiveReply,
  l as normalizeMessagePresentation,
  s as isMessagePresentationInteractiveBlock,
} from "./payload-BFbDi85B.js";
//#region extensions/telegram/src/button-types.ts
const TELEGRAM_INTERACTIVE_ROW_SIZE = 3;
function toTelegramButtonStyle(style) {
  return style === "danger" || style === "success" || style === "primary" ? style : void 0;
}
function toTelegramInlineButton(button) {
  const style = toTelegramButtonStyle(button.style);
  const action = resolveMessagePresentationButtonAction(button);
  if (!action) return;
  if (action.type === "url")
    return {
      text: button.label,
      url: action.url,
      style,
    };
  if (action.type === "web-app")
    return {
      text: button.label,
      web_app: { url: action.url },
      style,
    };
  if (action.type === "approval") {
    const callbackData = buildTelegramApprovalCallbackData(action);
    return callbackData
      ? {
          text: button.label,
          callback_data: callbackData,
          style,
        }
      : void 0;
  }
  if (action.type === "command") {
    const command = rewriteTelegramApprovalDecisionAlias(action.command.trim());
    const callbackData =
      (command
        ? sanitizeTelegramCallbackData(buildTelegramNativeCommandCallbackData(command))
        : void 0) ??
      (parseExecApprovalCommandText(command) ? sanitizeTelegramCallbackData(command) : void 0);
    return callbackData
      ? {
          text: button.label,
          callback_data: callbackData,
          style,
        }
      : void 0;
  }
  const callbackData = sanitizeTelegramCallbackData(
    Boolean(button.action) || hasTelegramApprovalCallbackPrefix(action.value)
      ? buildTelegramOpaqueCallbackData(action.value)
      : action.value,
  );
  return callbackData
    ? {
        text: button.label,
        callback_data: callbackData,
        style,
      }
    : void 0;
}
function chunkInteractiveButtons(buttons, rows) {
  for (let i = 0; i < buttons.length; i += TELEGRAM_INTERACTIVE_ROW_SIZE) {
    const row = buttons
      .slice(i, i + TELEGRAM_INTERACTIVE_ROW_SIZE)
      .map(toTelegramInlineButton)
      .filter((button) => Boolean(button));
    if (row.length > 0) rows.push(row);
  }
}
/**
 * @deprecated Use buildTelegramPresentationButtons with MessagePresentation.
 */
function buildTelegramInteractiveButtons(interactive) {
  const rows = reduceInteractiveReply(interactive, [], (state, block) => {
    if (block.type === "buttons") {
      chunkInteractiveButtons(block.buttons, state);
      return state;
    }
    if (block.type === "select")
      chunkInteractiveButtons(
        block.options.map((option) => ({
          label: option.label,
          action: option.action,
          value: option.value,
        })),
        state,
      );
    return state;
  });
  return rows.length > 0 ? rows : void 0;
}
/** Convert portable presentation controls to Telegram inline keyboard rows. */
function buildTelegramPresentationButtons(presentation) {
  const rows = [];
  for (const block of presentation?.blocks ?? []) {
    if (!isMessagePresentationInteractiveBlock(block)) continue;
    if (block.type === "buttons") {
      chunkInteractiveButtons(block.buttons, rows);
      continue;
    }
    chunkInteractiveButtons(
      block.options.map((option) => ({
        label: option.label,
        action: option.action,
        value: option.value,
      })),
      rows,
    );
  }
  return rows.length > 0 ? rows : void 0;
}
/** Resolve Telegram inline buttons, preserving explicit and legacy button precedence. */
function resolveTelegramInlineButtons(params) {
  return (
    params.buttons ??
    buildTelegramInteractiveButtons(normalizeInteractiveReply(params.interactive)) ??
    buildTelegramPresentationButtons(normalizeMessagePresentation(params.presentation))
  );
}
//#endregion
export { resolveTelegramInlineButtons as n, buildTelegramPresentationButtons as t };
