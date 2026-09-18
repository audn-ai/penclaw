import crypto from "node:crypto";
import fs from "node:fs/promises";
import "../../temp-path-DYqJUh96.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import path from "node:path";
import {
  n as resolveGeminiCliProfileHome$1,
  t as GOOGLE_GEMINI_CLI_PROVIDER_ID,
} from "../../gemini-cli-auth-home-CXgkYWW_.js";
import { o as isRecord } from "../../record-coerce-DHZ4bFlT.js";
import { n as resolvePreferredOpenClawTmpDir } from "../../tmp-openclaw-dir-uPgNO8da.js";
//#region extensions/google/cli-backend-auth.runtime.ts
const GEMINI_CLI_PROVIDER_ID = GOOGLE_GEMINI_CLI_PROVIDER_ID;
const GOOGLE_PROVIDER_ID = "google";
const VERCEL_AI_GATEWAY_PROVIDER_ID = "vercel-ai-gateway";
const GEMINI_CLI_CREDENTIALS_FILENAME = "gemini-credentials.json";
const GEMINI_CLI_PROFILE_AUTH_ENV = [
  ...[
    ...[
      "GOOGLE_GENAI_USE_GCA",
      "GOOGLE_CLOUD_ACCESS_TOKEN",
      "GOOGLE_APPLICATION_CREDENTIALS",
      "GEMINI_FORCE_ENCRYPTED_FILE_STORAGE",
      "GEMINI_FORCE_FILE_STORAGE",
    ],
    "GOOGLE_GENAI_USE_VERTEXAI",
    "GOOGLE_API_KEY",
    "GOOGLE_CLOUD_PROJECT",
    "GOOGLE_CLOUD_PROJECT_ID",
    "GOOGLE_CLOUD_QUOTA_PROJECT",
    "GOOGLE_CLOUD_LOCATION",
    "GOOGLE_GEMINI_BASE_URL",
    "GEMINI_CLI_CUSTOM_HEADERS",
    "GEMINI_API_KEY_AUTH_MECHANISM",
  ],
  "GEMINI_API_KEY",
];
const GEMINI_CLI_PROFILE_SETTINGS_ENV = ["GEMINI_CLI_SYSTEM_SETTINGS_PATH"];
function normalizeString(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function throwUnsupportedGeminiCredential(credential) {
  if (credential.provider === VERCEL_AI_GATEWAY_PROVIDER_ID)
    throw new Error(
      "Gemini CLI execution cannot use a vercel-ai-gateway auth profile. Use the OpenClaw vercel-ai-gateway provider instead.",
    );
  throw new Error("Gemini CLI execution requires a google-gemini-cli auth profile.");
}
function throwUnstageableSelectedGeminiProfile(ctx, credential) {
  if (!normalizeString(ctx.authProfileId))
    throw new Error("Gemini CLI execution requires a selected auth profile.");
  if (!credential)
    throw new Error(
      "Gemini CLI auth profile was selected but no credential material was found. Re-authenticate with `openclaw models auth login --provider google-gemini-cli --force`.",
    );
  if (credential.provider !== GEMINI_CLI_PROVIDER_ID) throwUnsupportedGeminiCredential(credential);
  throw new Error(
    "Gemini CLI execution supports google-gemini-cli OAuth or API-key auth profiles. Re-authenticate with `openclaw models auth login --provider google-gemini-cli --force`.",
  );
}
function requireGeminiOAuthCredential(credential) {
  if (!credential) return null;
  if (credential.type !== "oauth") return null;
  if (credential.provider !== GEMINI_CLI_PROVIDER_ID) throwUnsupportedGeminiCredential(credential);
  const access = normalizeString(credential.access);
  const refresh = normalizeString(credential.refresh);
  if (
    !access ||
    !refresh ||
    typeof credential.expires !== "number" ||
    !Number.isFinite(credential.expires)
  )
    throw new Error(
      "Gemini CLI OAuth profile is missing usable token material. Re-authenticate with `openclaw models auth login --provider google-gemini-cli --force`.",
    );
  return {
    ...credential,
    type: "oauth",
    provider: GEMINI_CLI_PROVIDER_ID,
    access,
    refresh,
    expires: credential.expires,
    idToken: normalizeString(credential.idToken),
    projectId: normalizeString(credential.projectId),
  };
}
function requireGeminiApiKeyCredential(credential) {
  if (!credential) return null;
  if (credential.type !== "api_key") return null;
  if (credential.provider !== GEMINI_CLI_PROVIDER_ID && credential.provider !== GOOGLE_PROVIDER_ID)
    throwUnsupportedGeminiCredential(credential);
  const key = normalizeString(credential.key);
  if (!key) throw new Error("Gemini CLI API-key profile is missing usable key material.");
  return {
    ...credential,
    type: "api_key",
    provider: credential.provider,
    key,
  };
}
function resolveGeminiCliProfileHome(ctx) {
  const agentDir = normalizeString(ctx.agentDir);
  if (!agentDir) throw new Error("Gemini CLI auth profile execution requires an agent directory.");
  const authProfileId = normalizeString(ctx.authProfileId);
  if (!authProfileId)
    throw new Error("Gemini CLI auth profile execution requires a selected auth profile.");
  const home = resolveGeminiCliProfileHome$1(agentDir, authProfileId);
  return {
    home,
    geminiDir: path.join(home, ".gemini"),
  };
}
function readGeminiAuthProfileCredential(credential) {
  if (!isRecord(credential)) return;
  return credential;
}
async function readGeminiCliJsonObject(filePath) {
  const normalized = normalizeString(filePath);
  if (!normalized) return {};
  try {
    const parsed = JSON.parse(await fs.readFile(normalized, "utf8"));
    if (!isRecord(parsed))
      throw new Error(`Gemini CLI system settings must be a JSON object: ${normalized}`);
    return { ...parsed };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return {};
    throw error;
  }
}
function buildGeminiCliAuthSettings(selectedType) {
  return { security: { auth: { selectedType } } };
}
async function buildGeminiCliSystemSettings(ctx, selectedType) {
  const base = await readGeminiCliJsonObject(ctx.systemSettingsPath);
  const security = isRecord(base.security) ? { ...base.security } : {};
  const auth = isRecord(security.auth) ? { ...security.auth } : {};
  const enforcedType = normalizeString(
    typeof auth.enforcedType === "string" ? auth.enforcedType : void 0,
  );
  if (enforcedType && enforcedType !== selectedType)
    throw new Error(
      `Gemini CLI system settings enforce ${enforcedType} auth, but the selected OpenClaw profile requires ${selectedType}.`,
    );
  security.auth = {
    ...auth,
    selectedType,
  };
  return {
    ...base,
    security,
  };
}
async function writeGeminiCliJson(filePath, value) {
  const tempPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${crypto.randomUUID()}.tmp`,
  );
  await fs.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf8",
    mode: 384,
  });
  await fs.chmod(tempPath, 384);
  await fs.rename(tempPath, filePath);
  await fs.chmod(filePath, 384);
}
async function prepareGeminiCliProfileHome(ctx, selectedType) {
  const { home, geminiDir } = resolveGeminiCliProfileHome(ctx);
  const settings = buildGeminiCliAuthSettings(selectedType);
  const systemSettings = await buildGeminiCliSystemSettings(ctx, selectedType);
  const systemSettingsDir = await fs.mkdtemp(
    path.join(resolvePreferredOpenClawTmpDir(), "openclaw-gemini-cli-"),
  );
  await fs.chmod(systemSettingsDir, 448);
  const systemSettingsPath = path.join(systemSettingsDir, "settings.json");
  return {
    home,
    geminiDir,
    systemSettingsPath,
    beforeExecution: async () => {
      await fs.mkdir(geminiDir, {
        recursive: true,
        mode: 448,
      });
      await fs.chmod(home, 448);
      await fs.chmod(geminiDir, 448);
      await Promise.all([
        writeGeminiCliJson(path.join(geminiDir, "settings.json"), settings),
        writeGeminiCliJson(path.join(home, "settings.json"), settings),
        writeGeminiCliJson(systemSettingsPath, systemSettings),
      ]);
    },
    cleanup: async () => {
      await fs.rm(systemSettingsDir, {
        recursive: true,
        force: true,
      });
    },
  };
}
async function clearGeminiCliCachedCredentials(geminiDir) {
  await fs.rm(path.join(geminiDir, GEMINI_CLI_CREDENTIALS_FILENAME), { force: true });
}
function buildGeminiCliProjectEnv(projectId) {
  const normalized = normalizeString(projectId);
  if (!normalized) return {};
  return {
    GOOGLE_CLOUD_PROJECT: normalized,
    GOOGLE_CLOUD_PROJECT_ID: normalized,
    GOOGLE_CLOUD_QUOTA_PROJECT: normalized,
  };
}
async function prepareGeminiCliOAuthHome(ctx, credential) {
  const oauth = requireGeminiOAuthCredential(credential);
  if (!oauth) return null;
  const profileHome = await prepareGeminiCliProfileHome(ctx, "oauth-personal");
  const idToken = normalizeString(oauth.idToken);
  const oauthCreds = {
    access_token: oauth.access,
    refresh_token: oauth.refresh,
    expiry_date: oauth.expires,
    token_type: "Bearer",
  };
  if (idToken) oauthCreds.id_token = idToken;
  return {
    env: {
      GEMINI_CLI_HOME: profileHome.home,
      GEMINI_CLI_SYSTEM_SETTINGS_PATH: profileHome.systemSettingsPath,
      GEMINI_FORCE_FILE_STORAGE: "true",
      ...buildGeminiCliProjectEnv(oauth.projectId),
    },
    clearEnv: [...GEMINI_CLI_PROFILE_AUTH_ENV, ...GEMINI_CLI_PROFILE_SETTINGS_ENV],
    beforeExecution: async () => {
      await profileHome.beforeExecution();
      await clearGeminiCliCachedCredentials(profileHome.geminiDir);
      await writeGeminiCliJson(path.join(profileHome.geminiDir, "oauth_creds.json"), oauthCreds);
    },
    cleanup: profileHome.cleanup,
  };
}
async function prepareGeminiCliApiKeyHome(ctx, credential) {
  const apiKey = requireGeminiApiKeyCredential(credential);
  if (!apiKey) return null;
  const profileHome = await prepareGeminiCliProfileHome(ctx, "gemini-api-key");
  return {
    env: {
      GEMINI_CLI_HOME: profileHome.home,
      GEMINI_CLI_SYSTEM_SETTINGS_PATH: profileHome.systemSettingsPath,
      GEMINI_FORCE_FILE_STORAGE: "true",
      GEMINI_API_KEY: apiKey.key,
    },
    clearEnv: [...GEMINI_CLI_PROFILE_AUTH_ENV, ...GEMINI_CLI_PROFILE_SETTINGS_ENV],
    beforeExecution: async () => {
      await profileHome.beforeExecution();
      await Promise.all([
        fs.rm(path.join(profileHome.geminiDir, "oauth_creds.json"), { force: true }),
        clearGeminiCliCachedCredentials(profileHome.geminiDir),
      ]);
    },
    cleanup: profileHome.cleanup,
  };
}
async function prepareGeminiCliAuthHome(ctx, credential) {
  const authCredential = readGeminiAuthProfileCredential(credential);
  const prepared =
    (await prepareGeminiCliOAuthHome(ctx, authCredential)) ??
    (await prepareGeminiCliApiKeyHome(ctx, authCredential));
  if (prepared) return prepared;
  if (normalizeString(ctx.authProfileId))
    throwUnstageableSelectedGeminiProfile(ctx, authCredential);
  return null;
}
//#endregion
export { prepareGeminiCliAuthHome };
