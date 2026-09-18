//#region extensions/openai/auth-choice-copy.ts
const OPENAI_API_KEY_LABEL = "OpenAI API Key";
const OPENAI_CHATGPT_LOGIN_LABEL = "ChatGPT Login";
const OPENAI_CHATGPT_LOGIN_HINT = "Sign in with your ChatGPT or Codex subscription";
const OPENAI_CHATGPT_DEVICE_PAIRING_LABEL = "ChatGPT Device Pairing";
const OPENAI_CHATGPT_DEVICE_PAIRING_HINT =
  "Pair your ChatGPT account in browser with a device code";
const OPENAI_UNIFIED_GROUP_HINT = "ChatGPT/Codex sign-in or API key";
const OPENAI_ACCOUNT_WIZARD_GROUP = {
  groupId: "openai",
  groupLabel: "OpenAI",
  groupHint: OPENAI_UNIFIED_GROUP_HINT,
};
const OPENAI_CODEX_WIZARD_GROUP = {
  groupId: "openai",
  groupLabel: "OpenAI",
  groupHint: OPENAI_UNIFIED_GROUP_HINT,
};
//#endregion
export {
  OPENAI_CHATGPT_LOGIN_HINT as a,
  OPENAI_CHATGPT_DEVICE_PAIRING_LABEL as i,
  OPENAI_API_KEY_LABEL as n,
  OPENAI_CHATGPT_LOGIN_LABEL as o,
  OPENAI_CHATGPT_DEVICE_PAIRING_HINT as r,
  OPENAI_CODEX_WIZARD_GROUP as s,
  OPENAI_ACCOUNT_WIZARD_GROUP as t,
};
