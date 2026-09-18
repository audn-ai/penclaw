//#region extensions/telegram/src/inline-keyboard.ts
function toInlineKeyboardButton(button) {
  if (!button?.text) return;
  if (button.url)
    return button.style
      ? {
          text: button.text,
          url: button.url,
          style: button.style,
        }
      : {
          text: button.text,
          url: button.url,
        };
  if (button.callback_data)
    return button.style
      ? {
          text: button.text,
          callback_data: button.callback_data,
          style: button.style,
        }
      : {
          text: button.text,
          callback_data: button.callback_data,
        };
  if (button.web_app?.url)
    return button.style
      ? {
          text: button.text,
          web_app: { url: button.web_app.url },
          style: button.style,
        }
      : {
          text: button.text,
          web_app: { url: button.web_app.url },
        };
}
function buildInlineKeyboard(buttons) {
  if (!buttons?.length) return;
  const rows = buttons
    .map((row) => row.map(toInlineKeyboardButton).filter((button) => Boolean(button)))
    .filter((row) => row.length > 0);
  if (rows.length === 0) return;
  return { inline_keyboard: rows };
}
//#endregion
export { buildInlineKeyboard as t };
