import {
  a as OPENAI_CHATGPT_LOGIN_HINT,
  i as OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
  n as OPENAI_API_KEY_LABEL,
  o as OPENAI_CHATGPT_LOGIN_LABEL,
  r as OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
  t as OPENAI_ACCOUNT_WIZARD_GROUP,
} from "../../auth-choice-copy-D_t1WwLd.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
//#region extensions/openai/setup-api.ts
async function runOpenAIProviderAuthMethod(methodId, ctx) {
  const { buildOpenAIProvider } = await import("./openai-provider.js");
  const method = buildOpenAIProvider().auth.find((entry) => entry.id === methodId);
  if (!method) return { profiles: [] };
  return method.run(ctx);
}
function buildOpenAISetupProvider() {
  return {
    id: "openai",
    label: "OpenAI",
    docsPath: "/providers/models",
    envVars: ["OPENAI_API_KEY"],
    auth: [
      {
        id: "oauth",
        label: OPENAI_CHATGPT_LOGIN_LABEL,
        hint: OPENAI_CHATGPT_LOGIN_HINT,
        kind: "oauth",
        wizard: {
          choiceId: "openai",
          choiceLabel: OPENAI_CHATGPT_LOGIN_LABEL,
          choiceHint: OPENAI_CHATGPT_LOGIN_HINT,
          assistantPriority: -40,
          assistantVisibility: "manual-only",
          ...OPENAI_ACCOUNT_WIZARD_GROUP,
        },
        run: async (ctx) => runOpenAIProviderAuthMethod("oauth", ctx),
      },
      {
        id: "device-code",
        label: OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
        hint: OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
        kind: "device_code",
        wizard: {
          choiceId: "openai-device-code",
          choiceLabel: OPENAI_CHATGPT_DEVICE_PAIRING_LABEL,
          choiceHint: OPENAI_CHATGPT_DEVICE_PAIRING_HINT,
          assistantPriority: -10,
          assistantVisibility: "manual-only",
          ...OPENAI_ACCOUNT_WIZARD_GROUP,
        },
        run: async (ctx) => runOpenAIProviderAuthMethod("device-code", ctx),
      },
      {
        id: "api-key",
        label: OPENAI_API_KEY_LABEL,
        hint: "Use your OpenAI API key directly",
        kind: "api_key",
        wizard: {
          choiceId: "openai-api-key",
          choiceLabel: OPENAI_API_KEY_LABEL,
          choiceHint: "Use your OpenAI API key directly",
          assistantPriority: 5,
          ...OPENAI_ACCOUNT_WIZARD_GROUP,
        },
        run: async (ctx) => runOpenAIProviderAuthMethod("api-key", ctx),
      },
    ],
  };
}
var setup_api_default = definePluginEntry({
  id: "openai",
  name: "OpenAI Setup",
  description: "Lightweight OpenAI setup hooks",
  register(api) {
    api.registerProvider(buildOpenAISetupProvider());
  },
});
//#endregion
export { buildOpenAISetupProvider, setup_api_default as default };
