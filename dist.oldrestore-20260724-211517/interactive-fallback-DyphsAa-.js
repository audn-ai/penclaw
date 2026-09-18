import {
  n as resolveTelegramInlineButtons,
  t as buildTelegramPresentationButtons,
} from "./button-types-B6rcRmmv.js";
import { t as buildInlineKeyboard } from "./inline-keyboard-aDe2_Kii.js";
import { n as adaptMessagePresentationForChannel } from "./interactive-jsbwR_sV.js";
import {
  c as normalizeInteractiveReply,
  h as resolveInteractiveTextFallback,
  l as normalizeMessagePresentation,
  o as interactiveReplyToPresentation,
  p as renderMessagePresentationFallbackText,
  s as isMessagePresentationInteractiveBlock,
} from "./payload-BFbDi85B.js";
//#region extensions/telegram/src/interactive-fallback.ts
const TELEGRAM_CONTROL_ONLY_FALLBACK = "Choose an option.";
const TELEGRAM_PRESENTATION_CAPABILITIES = {
  supported: true,
  buttons: true,
  selects: true,
  context: true,
  divider: false,
  limits: {
    actions: {
      maxActions: 100,
      maxActionsPerRow: 3,
      maxLabelLength: 64,
      supportsStyles: false,
      supportsDisabled: false,
    },
    selects: {
      maxOptions: 100,
      maxLabelLength: 64,
    },
    text: { markdownDialect: "markdown" },
  },
};
function canEncodeTelegramPresentationControl(block) {
  return Boolean(buildTelegramPresentationButtons({ blocks: [block] })?.length);
}
function partitionTelegramPresentationBlocks(params) {
  const fallbackBlocks = [];
  const nativeControlBlocks = [];
  for (const block of params.presentation.blocks) {
    if (!isMessagePresentationInteractiveBlock(block)) {
      fallbackBlocks.push(block);
      continue;
    }
    if (!params.presentationControlsSelected) {
      fallbackBlocks.push(block);
      continue;
    }
    if (block.type === "buttons") {
      const nativeButtons = [];
      const fallbackButtons = [];
      for (const button of block.buttons)
        (canEncodeTelegramPresentationControl({
          type: "buttons",
          buttons: [button],
        })
          ? nativeButtons
          : fallbackButtons
        ).push(button);
      if (nativeButtons.length > 0)
        nativeControlBlocks.push({
          type: "buttons",
          buttons: nativeButtons,
        });
      if (fallbackButtons.length > 0)
        fallbackBlocks.push({
          type: "buttons",
          buttons: fallbackButtons,
        });
      continue;
    }
    const nativeOptions = [];
    const fallbackOptions = [];
    for (const option of block.options)
      (canEncodeTelegramPresentationControl({
        type: "select",
        options: [option],
      })
        ? nativeOptions
        : fallbackOptions
      ).push(option);
    if (nativeOptions.length > 0)
      nativeControlBlocks.push({
        ...block,
        options: nativeOptions,
      });
    if (fallbackOptions.length > 0)
      fallbackBlocks.push({
        ...block,
        options: fallbackOptions,
      });
    else if (block.placeholder)
      fallbackBlocks.push({
        type: "text",
        text: block.placeholder,
      });
  }
  return {
    fallbackBlocks,
    nativeControlBlocks,
  };
}
/** Convert portable presentation into the one Telegram payload shape used by every send funnel. */
function canonicalizeTelegramPresentationPayload(payload) {
  const normalizedPresentation = normalizeMessagePresentation(payload.presentation);
  const telegramData = payload.channelData?.telegram;
  if (!normalizedPresentation) {
    if (
      !buildInlineKeyboard(resolveTelegramInlineButtons({ buttons: telegramData?.buttons })) ||
      payload.text?.trim()
    )
      return payload;
    return {
      ...payload,
      text: TELEGRAM_CONTROL_ONLY_FALLBACK,
    };
  }
  const presentation = adaptMessagePresentationForChannel({
    presentation: normalizedPresentation,
    capabilities: TELEGRAM_PRESENTATION_CAPABILITIES,
  });
  const interactive = normalizeInteractiveReply(payload.interactive);
  const existingButtons = resolveTelegramInlineButtons({
    buttons: telegramData?.buttons,
    interactive,
  });
  const { fallbackBlocks, nativeControlBlocks } = partitionTelegramPresentationBlocks({
    presentation,
    presentationControlsSelected: existingButtons === void 0,
  });
  const presentationButtons = buildTelegramPresentationButtons({ blocks: nativeControlBlocks });
  const buttons = existingButtons ?? presentationButtons;
  const fallbackText = renderMessagePresentationFallbackText({
    presentation: {
      ...presentation,
      blocks: fallbackBlocks,
    },
  });
  const currentText =
    resolveInteractiveTextFallback({
      text: payload.text,
      interactive,
    })?.trim() ?? "";
  const text =
    fallbackText.length > 0 &&
    (currentText === fallbackText || currentText.endsWith(`\n\n${fallbackText}`))
      ? currentText
      : [currentText, fallbackText].filter(Boolean).join("\n\n");
  const { presentation: _presentation, ...withoutPresentation } = payload;
  const canonical = {
    ...withoutPresentation,
    text: text || (buttons ? TELEGRAM_CONTROL_ONLY_FALLBACK : ""),
  };
  if (buttons)
    canonical.channelData = {
      ...payload.channelData,
      telegram: {
        ...telegramData,
        buttons,
      },
    };
  return canonical;
}
function resolveTelegramInteractiveTextFallback(params) {
  const interactive = normalizeInteractiveReply(params.interactive);
  const text = resolveInteractiveTextFallback({
    text: params.text ?? void 0,
    interactive,
  });
  if (text?.trim()) return text;
  const presentation = normalizeMessagePresentation(params.presentation);
  if (presentation) {
    const fallback = renderMessagePresentationFallbackText({
      text: params.text ?? void 0,
      presentation,
    });
    if (fallback.trim()) return fallback;
  }
  if (!interactive) return text;
  const interactivePresentation = interactiveReplyToPresentation(interactive);
  if (!interactivePresentation) return text;
  const fallback = renderMessagePresentationFallbackText({ presentation: interactivePresentation });
  return fallback.trim() ? fallback : text;
}
//#endregion
export {
  canonicalizeTelegramPresentationPayload as n,
  resolveTelegramInteractiveTextFallback as r,
  TELEGRAM_PRESENTATION_CAPABILITIES as t,
};
