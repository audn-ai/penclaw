//#region extensions/openai/auth-choice-copy.d.ts
declare const OPENAI_API_KEY_LABEL = "OpenAI API Key";
declare const OPENAI_CHATGPT_LOGIN_LABEL = "ChatGPT Login";
declare const OPENAI_CHATGPT_LOGIN_HINT = "Sign in with your ChatGPT or Codex subscription";
declare const OPENAI_CHATGPT_DEVICE_PAIRING_LABEL = "ChatGPT Device Pairing";
declare const OPENAI_CHATGPT_DEVICE_PAIRING_HINT =
  "Pair your ChatGPT account in browser with a device code";
declare const OPENAI_ACCOUNT_WIZARD_GROUP: {
  readonly groupId: "openai";
  readonly groupLabel: "OpenAI";
  readonly groupHint: "ChatGPT/Codex sign-in or API key";
};
declare const OPENAI_CODEX_WIZARD_GROUP: {
  readonly groupId: "openai";
  readonly groupLabel: "OpenAI";
  readonly groupHint: "ChatGPT/Codex sign-in or API key";
};
//#endregion
export {
  OPENAI_ACCOUNT_WIZARD_GROUP,
  OPENAI_API_KEY_LABEL,
  OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
  OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
  OPENAI_CHATGPT_LOGIN_HINT,
  OPENAI_CHATGPT_LOGIN_LABEL,
  OPENAI_CODEX_WIZARD_GROUP,
};
