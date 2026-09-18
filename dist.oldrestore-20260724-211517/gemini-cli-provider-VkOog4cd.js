import { t as GOOGLE_GEMINI_CLI_PROVIDER_ID } from "./gemini-cli-auth-home-CXgkYWW_.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-B-Fc-m0I.js";
import {
  r as parseGoogleUsageToken,
  t as formatGoogleOauthApiKey,
} from "./oauth-token-shared-BpSqB4gY.js";
import { t as buildOauthProviderAuthResult } from "./provider-auth-result-C3SBJpUX.js";
import { t as GOOGLE_GEMINI_PROVIDER_HOOKS } from "./provider-hooks-Cpu4biP8.js";
import {
  n as resolveGoogleGeminiForwardCompatModel,
  t as isModernGoogleModel,
} from "./provider-models-BovOaplt.js";
import { r as fetchGeminiUsage } from "./provider-usage-DW1nF0aA.js";
//#region extensions/google/gemini-cli-provider.ts
const PROVIDER_ID = GOOGLE_GEMINI_CLI_PROVIDER_ID;
const PROVIDER_LABEL = "Gemini CLI OAuth";
const DEFAULT_MODEL = "google/gemini-3.1-pro-preview";
const ENV_VARS = [
  "OPENCLAW_GEMINI_OAUTH_CLIENT_ID",
  "OPENCLAW_GEMINI_OAUTH_CLIENT_SECRET",
  "GEMINI_CLI_OAUTH_CLIENT_ID",
  "GEMINI_CLI_OAUTH_CLIENT_SECRET",
];
const loadOauthRuntimeModule = createLazyRuntimeModule(
  () => import("./extensions/google/oauth.runtime.js"),
);
async function fetchGeminiCliUsage(ctx) {
  return await fetchGeminiUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn, PROVIDER_ID);
}
function buildGoogleGeminiCliProvider() {
  return {
    id: PROVIDER_ID,
    label: PROVIDER_LABEL,
    docsPath: "/providers/models",
    aliases: ["gemini-cli"],
    envVars: [...ENV_VARS],
    auth: [
      {
        id: "oauth",
        label: "Google OAuth",
        hint: "PKCE + localhost callback",
        kind: "oauth",
        run: async (ctx) => {
          await ctx.prompter.note(
            [
              "This is an unofficial integration and is not endorsed by Google.",
              "Some users have reported account restrictions or suspensions after using third-party Gemini CLI and Antigravity OAuth clients.",
              "Proceed only if you understand and accept this risk.",
            ].join("\n"),
            "Google Gemini CLI caution",
          );
          if (
            !(await ctx.prompter.confirm({
              message: "Continue with Google Gemini CLI OAuth?",
              initialValue: false,
            }))
          ) {
            await ctx.prompter.note("Skipped Google Gemini CLI OAuth setup.", "Setup skipped");
            return { profiles: [] };
          }
          const spin = ctx.prompter.progress("Starting Gemini CLI OAuth…");
          try {
            const { loginGeminiCliOAuth } = await loadOauthRuntimeModule();
            const result = await loginGeminiCliOAuth({
              isRemote: ctx.isRemote,
              openUrl: ctx.openUrl,
              log: (msg) => ctx.runtime.log(msg),
              note: (message, title) => ctx.prompter.note(message, title),
              prompt: async (message) => ctx.prompter.text({ message }),
              progress: spin,
              ...(ctx.signal ? { signal: ctx.signal } : {}),
            });
            spin.stop("Gemini CLI OAuth complete");
            return buildOauthProviderAuthResult({
              providerId: PROVIDER_ID,
              defaultModel: DEFAULT_MODEL,
              access: result.access,
              refresh: result.refresh,
              expires: result.expires,
              email: result.email,
              configPatch: {
                agents: {
                  defaults: { models: { [DEFAULT_MODEL]: { agentRuntime: { id: PROVIDER_ID } } } },
                },
              },
              ...(result.projectId ? { credentialExtra: { projectId: result.projectId } } : {}),
              ...(result.projectId
                ? {
                    notes: [
                      "If requests fail, set GOOGLE_CLOUD_PROJECT or GOOGLE_CLOUD_PROJECT_ID.",
                    ],
                  }
                : {}),
            });
          } catch (err) {
            spin.stop("Gemini CLI OAuth failed");
            await ctx.prompter.note(
              "Trouble with OAuth? Ensure your Google account has Gemini CLI access.",
              "OAuth help",
            );
            throw err;
          }
        },
      },
    ],
    wizard: {
      setup: {
        choiceId: "google-gemini-cli",
        choiceLabel: "Gemini CLI OAuth",
        choiceHint: "Google OAuth with project-aware token payload",
        methodId: "oauth",
      },
    },
    resolveDynamicModel: (ctx) =>
      resolveGoogleGeminiForwardCompatModel({
        providerId: PROVIDER_ID,
        ctx,
      }),
    ...GOOGLE_GEMINI_PROVIDER_HOOKS,
    isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId),
    formatApiKey: (cred) => formatGoogleOauthApiKey(cred),
    refreshOAuth: async (cred) => {
      const { refreshGeminiCliOAuthToken } = await loadOauthRuntimeModule();
      return await refreshGeminiCliOAuthToken(cred);
    },
    resolveUsageAuth: async (ctx) => {
      const auth = await ctx.resolveOAuthToken();
      if (!auth) return null;
      return {
        ...auth,
        token: parseGoogleUsageToken(auth.token),
      };
    },
    fetchUsageSnapshot: async (ctx) => await fetchGeminiCliUsage(ctx),
  };
}
function registerGoogleGeminiCliProvider(api) {
  api.registerProvider(buildGoogleGeminiCliProvider());
}
//#endregion
export { registerGoogleGeminiCliProvider as n, buildGoogleGeminiCliProvider as t };
