import crypto from "node:crypto";
import "../../string-coerce-runtime-BUe4iD0r.js";
import fs from "node:fs/promises";
import path from "node:path";
import {
  T as normalizeStoredConversationId,
  _ as buildMSTeamsConversationStateKey,
  a as MSTEAMS_SQLITE_MAX_POLL_ROWS,
  b as prepareMSTeamsConversationReferenceForStorage,
  c as buildMSTeamsPollVoteBucketKey,
  d as selectMSTeamsPollVoteBucket,
  f as selectRetainedMSTeamsPolls,
  g as MSTEAMS_SQLITE_MAX_CONVERSATION_ROWS,
  h as MSTEAMS_CONVERSATIONS_NAMESPACE,
  i as MSTEAMS_POLL_VOTE_BUCKETS_NAMESPACE,
  m as MSTEAMS_CONVERSATIONS_LEGACY_FILENAME,
  n as MSTEAMS_POLLS_LEGACY_FILENAME,
  p as splitMSTeamsPoll,
  r as MSTEAMS_POLLS_NAMESPACE,
  s as buildMSTeamsPollStateKey,
  t as MSTEAMS_MAX_POLL_VOTE_BUCKET_ROWS,
  x as selectRetainedMSTeamsConversations,
  y as normalizeMSTeamsLegacyConversationStore,
} from "../../polls-XDDfaapC.js";
import { o as isRecord } from "../../record-coerce-DHZ4bFlT.js";
import {
  r as defineChannelAliasMigration,
  t as archiveLegacyStateSource,
} from "../../runtime-doctor-DOtJb07X.js";
import { m as resolveStorePath } from "../../session-store-runtime-BwE6SlGz.js";
import {
  a as isMSTeamsSsoStoreData,
  n as MSTEAMS_SSO_TOKENS_LEGACY_FILENAME,
  o as makeMSTeamsSsoTokenStoreKey,
  r as MSTEAMS_SSO_TOKENS_NAMESPACE,
  s as normalizeMSTeamsSsoStoredToken,
  t as MSTEAMS_MAX_SSO_TOKENS,
} from "../../sso-token-store-RYuVZ3SE.js";
//#region extensions/msteams/doctor-contract-api.ts
const streamingAliasMigration = defineChannelAliasMigration({
  channelId: "msteams",
  streaming: { defaultMode: "partial" },
});
const legacyConfigRules = streamingAliasMigration.legacyConfigRules;
function normalizeCompatibilityConfig({ cfg }) {
  return streamingAliasMigration.normalizeChannelConfig({ cfg });
}
const LEARNINGS_NAMESPACE = "feedback-learnings";
const MAX_LEARNING_ENTRIES = 1e4;
const MSTEAMS_PLUGIN_ID = "Microsoft Teams";
function encodeSessionKey(sessionKey) {
  return Buffer.from(sessionKey, "utf8").toString("base64url");
}
function learningStoreKey(storePath, sessionKey) {
  return crypto.createHash("sha256").update(`${storePath}\0${sessionKey}`, "utf8").digest("hex");
}
function decodeSessionKey(fileStem) {
  try {
    const decoded = Buffer.from(fileStem, "base64url").toString("utf8");
    return encodeSessionKey(decoded) === fileStem && decoded.trim() ? decoded : null;
  } catch {
    return null;
  }
}
function resolveLearningSessionKey(fileStem) {
  return decodeSessionKey(fileStem);
}
function legacySanitizeSessionKey(sessionKey) {
  return sessionKey.replace(/[^a-zA-Z0-9_-]/g, "_");
}
async function listKnownSessionKeys(storePath) {
  const candidates = [storePath, path.join(storePath, "sessions.json")];
  for (const candidate of candidates)
    try {
      const parsed = JSON.parse(await fs.readFile(candidate, "utf8"));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
      const sessions =
        parsed.sessions && typeof parsed.sessions === "object" && !Array.isArray(parsed.sessions)
          ? parsed.sessions
          : parsed;
      return Object.keys(sessions).filter((key) => key.trim());
    } catch {}
  return [];
}
function resolveLegacySanitizedSessionKey(fileStem, knownSessionKeys) {
  const matches = knownSessionKeys.filter(
    (sessionKey) => legacySanitizeSessionKey(sessionKey) === fileStem,
  );
  const [match] = matches;
  return matches.length === 1 && match ? match : null;
}
function listAgentIds(config) {
  const ids = /* @__PURE__ */ new Set(["main"]);
  for (const agent of config.agents?.list ?? [])
    if (typeof agent.id === "string" && agent.id.trim()) ids.add(agent.id.trim());
  return [...ids];
}
function listCandidateStorePaths(params) {
  const paths = /* @__PURE__ */ new Set();
  paths.add(resolveStorePath(params.config.session?.store, { env: params.env }));
  for (const agentId of listAgentIds(params.config))
    paths.add(
      resolveStorePath(params.config.session?.store, {
        agentId,
        env: params.env,
      }),
    );
  return [...paths];
}
function resolveStateFilePath(stateDir, filename) {
  return path.join(stateDir, filename);
}
async function readLegacyJsonFile(filePath, parse) {
  try {
    return parse(JSON.parse(await fs.readFile(filePath, "utf8")));
  } catch {
    return null;
  }
}
function isStringArray(value) {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}
function parseLegacyConversationStore(value) {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.conversations)) return null;
  return normalizeMSTeamsLegacyConversationStore({
    version: 1,
    conversations: value.conversations,
  });
}
function parseLegacyPoll(value) {
  if (!isRecord(value)) return null;
  const votes = isRecord(value.votes) ? value.votes : null;
  if (
    typeof value.id !== "string" ||
    !value.id ||
    typeof value.question !== "string" ||
    !value.question ||
    !isStringArray(value.options) ||
    typeof value.maxSelections !== "number" ||
    !Number.isFinite(value.maxSelections) ||
    typeof value.createdAt !== "string" ||
    !votes
  )
    return null;
  const normalizedVotes = {};
  for (const [voterId, selections] of Object.entries(votes))
    if (typeof voterId === "string" && isStringArray(selections))
      normalizedVotes[voterId] = selections;
  return {
    id: value.id,
    question: value.question,
    options: value.options,
    maxSelections: value.maxSelections,
    createdAt: value.createdAt,
    ...(typeof value.updatedAt === "string" ? { updatedAt: value.updatedAt } : {}),
    ...(typeof value.conversationId === "string" ? { conversationId: value.conversationId } : {}),
    ...(typeof value.messageId === "string" ? { messageId: value.messageId } : {}),
    votes: normalizedVotes,
  };
}
function parseLegacyPollStore(value) {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.polls)) return null;
  const polls = {};
  for (const [pollId, poll] of Object.entries(value.polls)) {
    const parsed = parseLegacyPoll(poll);
    if (parsed) polls[pollId] = parsed;
  }
  return {
    version: 1,
    polls,
  };
}
async function listLegacyLearningFiles(storePath) {
  let entries;
  try {
    entries = await fs.readdir(storePath, { withFileTypes: true });
  } catch {
    return [];
  }
  const suffix = ".learnings.json";
  const knownSessionKeys = await listKnownSessionKeys(storePath);
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(suffix)) continue;
    const fileStem = entry.name.slice(0, -15);
    const sessionKey =
      resolveLearningSessionKey(fileStem) ??
      resolveLegacySanitizedSessionKey(fileStem, knownSessionKeys);
    const filePath = path.join(storePath, entry.name);
    try {
      const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
      if (Array.isArray(parsed)) {
        const learnings = parsed.filter((item) => typeof item === "string");
        if (learnings.length > 0)
          files.push({
            storePath,
            sessionKey,
            filePath,
            learnings: learnings.slice(-10),
          });
      }
    } catch {}
  }
  return files;
}
function mergeLearnings(legacy, existing) {
  const seen = /* @__PURE__ */ new Set();
  const merged = [];
  for (const learning of [...legacy, ...(existing?.learnings ?? [])]) {
    if (seen.has(learning)) continue;
    seen.add(learning);
    merged.push(learning);
  }
  return merged.slice(-10);
}
const stateMigrations = [
  {
    id: "msteams-conversations-json-to-plugin-state",
    label: "Microsoft Teams conversations",
    async detectLegacyState(params) {
      const state = await readLegacyJsonFile(
        resolveStateFilePath(params.stateDir, MSTEAMS_CONVERSATIONS_LEGACY_FILENAME),
        parseLegacyConversationStore,
      );
      if (!state || Object.keys(state.conversations).length === 0) return null;
      return {
        preview: [
          `- ${MSTEAMS_PLUGIN_ID} conversations: ${Object.keys(state.conversations).length} entries -> plugin state (${MSTEAMS_CONVERSATIONS_NAMESPACE})`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const filePath = resolveStateFilePath(params.stateDir, MSTEAMS_CONVERSATIONS_LEGACY_FILENAME);
      const state = await readLegacyJsonFile(filePath, parseLegacyConversationStore);
      if (!state)
        return {
          changes,
          warnings,
        };
      const store = params.context.openPluginStateKeyedStore({
        namespace: MSTEAMS_CONVERSATIONS_NAMESPACE,
        maxEntries: MSTEAMS_SQLITE_MAX_CONVERSATION_ROWS,
      });
      let imported = 0;
      for (const [rawConversationId, reference] of selectRetainedMSTeamsConversations(
        state.conversations,
      )) {
        const conversationId = normalizeStoredConversationId(rawConversationId);
        if (!conversationId) continue;
        if (
          await store.registerIfAbsent(
            buildMSTeamsConversationStateKey(conversationId),
            prepareMSTeamsConversationReferenceForStorage(conversationId, reference),
          )
        )
          imported++;
      }
      changes.push(
        `Migrated ${imported} ${MSTEAMS_PLUGIN_ID} conversation ${imported === 1 ? "entry" : "entries"} -> plugin state`,
      );
      await archiveLegacyStateSource({
        filePath,
        label: `${MSTEAMS_PLUGIN_ID} conversation`,
        changes,
        warnings,
      });
      return {
        changes,
        warnings,
      };
    },
  },
  {
    id: "msteams-polls-json-to-plugin-state",
    label: "Microsoft Teams polls",
    async detectLegacyState(params) {
      const state = await readLegacyJsonFile(
        resolveStateFilePath(params.stateDir, MSTEAMS_POLLS_LEGACY_FILENAME),
        parseLegacyPollStore,
      );
      if (!state || Object.keys(state.polls).length === 0) return null;
      return {
        preview: [
          `- ${MSTEAMS_PLUGIN_ID} polls: ${Object.keys(state.polls).length} entries -> plugin state (${MSTEAMS_POLLS_NAMESPACE})`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const filePath = resolveStateFilePath(params.stateDir, MSTEAMS_POLLS_LEGACY_FILENAME);
      const state = await readLegacyJsonFile(filePath, parseLegacyPollStore);
      if (!state)
        return {
          changes,
          warnings,
        };
      const pollStore = params.context.openPluginStateKeyedStore({
        namespace: MSTEAMS_POLLS_NAMESPACE,
        maxEntries: MSTEAMS_SQLITE_MAX_POLL_ROWS,
      });
      const voteBucketStore = params.context.openPluginStateKeyedStore({
        namespace: MSTEAMS_POLL_VOTE_BUCKETS_NAMESPACE,
        maxEntries: MSTEAMS_MAX_POLL_VOTE_BUCKET_ROWS,
      });
      let imported = 0;
      for (const [pollId, poll] of selectRetainedMSTeamsPolls(state.polls)) {
        const { metadata, votes } = splitMSTeamsPoll(poll);
        const didImportPoll = await pollStore.registerIfAbsent(
          buildMSTeamsPollStateKey(pollId),
          metadata,
        );
        const buckets = /* @__PURE__ */ new Map();
        for (const [voterId, selections] of Object.entries(votes)) {
          const bucket = selectMSTeamsPollVoteBucket(pollId, voterId);
          const bucketVotes = buckets.get(bucket) ?? {};
          bucketVotes[voterId] = selections;
          buckets.set(bucket, bucketVotes);
        }
        let importedVoteBucket = false;
        for (const [bucket, bucketVotes] of buckets) {
          const key = buildMSTeamsPollVoteBucketKey(pollId, bucket);
          const existing = await voteBucketStore.lookup(key);
          await voteBucketStore.register(key, {
            pollId,
            bucket,
            votes: {
              ...bucketVotes,
              ...existing?.votes,
            },
            updatedAt: poll.updatedAt ?? poll.createdAt,
          });
          importedVoteBucket = true;
        }
        if (didImportPoll || importedVoteBucket) imported++;
      }
      changes.push(
        `Migrated ${imported} ${MSTEAMS_PLUGIN_ID} poll ${imported === 1 ? "entry" : "entries"} -> plugin state`,
      );
      await archiveLegacyStateSource({
        filePath,
        label: `${MSTEAMS_PLUGIN_ID} poll`,
        changes,
        warnings,
      });
      return {
        changes,
        warnings,
      };
    },
  },
  {
    id: "msteams-sso-tokens-json-to-plugin-state",
    label: "Microsoft Teams SSO tokens",
    async detectLegacyState(params) {
      const state = await readLegacyJsonFile(
        resolveStateFilePath(params.stateDir, MSTEAMS_SSO_TOKENS_LEGACY_FILENAME),
        (value) => (isMSTeamsSsoStoreData(value) ? value : null),
      );
      if (!state || Object.keys(state.tokens).length === 0) return null;
      return {
        preview: [
          `- ${MSTEAMS_PLUGIN_ID} SSO tokens: ${Object.keys(state.tokens).length} entries -> plugin state (${MSTEAMS_SSO_TOKENS_NAMESPACE})`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const filePath = resolveStateFilePath(params.stateDir, MSTEAMS_SSO_TOKENS_LEGACY_FILENAME);
      const state = await readLegacyJsonFile(filePath, (value) =>
        isMSTeamsSsoStoreData(value) ? value : null,
      );
      if (!state)
        return {
          changes,
          warnings,
        };
      const store = params.context.openPluginStateKeyedStore({
        namespace: MSTEAMS_SSO_TOKENS_NAMESPACE,
        maxEntries: MSTEAMS_MAX_SSO_TOKENS,
      });
      let imported = 0;
      let skipped = 0;
      for (const token of Object.values(state.tokens)) {
        const normalized = normalizeMSTeamsSsoStoredToken(token);
        if (!normalized) {
          skipped++;
          continue;
        }
        if (
          await store.registerIfAbsent(
            makeMSTeamsSsoTokenStoreKey(normalized.connectionName, normalized.userId),
            normalized,
          )
        )
          imported++;
      }
      changes.push(
        `Migrated ${imported} ${MSTEAMS_PLUGIN_ID} SSO token ${imported === 1 ? "entry" : "entries"} -> plugin state`,
      );
      if (skipped > 0)
        warnings.push(
          `Skipped ${skipped} malformed ${MSTEAMS_PLUGIN_ID} SSO token ${skipped === 1 ? "entry" : "entries"} during migration`,
        );
      await archiveLegacyStateSource({
        filePath,
        label: `${MSTEAMS_PLUGIN_ID} SSO-token`,
        changes,
        warnings,
      });
      return {
        changes,
        warnings,
      };
    },
  },
  {
    id: "msteams-feedback-learnings-json-to-plugin-state",
    label: "Microsoft Teams feedback learnings",
    async detectLegacyState(params) {
      const files = (
        await Promise.all(
          listCandidateStorePaths(params).map((storePath) => listLegacyLearningFiles(storePath)),
        )
      ).flat();
      if (files.length === 0) return null;
      return {
        preview: [
          `- Microsoft Teams feedback learnings: ${files.length} ${files.length === 1 ? "file" : "files"} -> plugin state (${LEARNINGS_NAMESPACE})`,
        ],
      };
    },
    async migrateLegacyState(params) {
      const changes = [];
      const warnings = [];
      const files = (
        await Promise.all(
          listCandidateStorePaths(params).map((storePath) => listLegacyLearningFiles(storePath)),
        )
      ).flat();
      const store = params.context.openPluginStateKeyedStore({
        namespace: LEARNINGS_NAMESPACE,
        maxEntries: MAX_LEARNING_ENTRIES,
      });
      const existingEntries = await store.entries();
      const existingKeys = new Set(existingEntries.map((entry) => entry.key));
      const importableFiles = files.filter((file) => file.sessionKey);
      const missingKeys = new Set(
        importableFiles
          .map((file) => learningStoreKey(file.storePath, file.sessionKey ?? ""))
          .filter((key) => !existingKeys.has(key)),
      );
      if (missingKeys.size > MAX_LEARNING_ENTRIES - existingKeys.size) {
        warnings.push(
          `Skipped Microsoft Teams feedback-learning migration because plugin state has room for ${MAX_LEARNING_ENTRIES - existingKeys.size} of ${missingKeys.size} missing entries; left legacy sources in place`,
        );
        return {
          changes,
          warnings,
        };
      }
      let imported = 0;
      for (const file of files) {
        if (!file.sessionKey) {
          warnings.push(
            `Left Microsoft Teams feedback-learning source in place because its legacy filename cannot be mapped to a session key: ${file.filePath}`,
          );
          continue;
        }
        const key = learningStoreKey(file.storePath, file.sessionKey);
        const existing = await store.lookup(key);
        await store.register(key, {
          sessionKey: existing?.sessionKey ?? file.sessionKey,
          learnings: mergeLearnings(file.learnings, existing),
          updatedAt: Date.now(),
        });
        imported++;
        await archiveLegacyStateSource({
          filePath: file.filePath,
          label: "Microsoft Teams feedback-learning",
          changes,
          warnings,
        });
      }
      if (imported > 0)
        changes.unshift(
          `Migrated ${imported} Microsoft Teams feedback-learning ${imported === 1 ? "entry" : "entries"} -> plugin state`,
        );
      return {
        changes,
        warnings,
      };
    },
  },
];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
