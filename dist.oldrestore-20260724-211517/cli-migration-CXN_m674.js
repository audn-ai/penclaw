import { t as resolveClaudeCliAnthropicModelRefs } from "./claude-model-refs-D6pzIuWe.js";
import {
  i as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS,
  t as CLAUDE_CLI_BACKEND_ID,
} from "./cli-constants-CpgfT8aN.js";
import { E as CLAUDE_CLI_PROFILE_ID } from "./persisted-B2tK2f7d.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./provider-auth-mypr64nh.js";
import { o as isRecord } from "./record-coerce-DHZ4bFlT.js";
import "./cli-shared-KlT4css5.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region extensions/anthropic/cli-migration.ts
/**
 * Claude CLI setup migration helpers. They rewrite legacy Claude CLI model refs
 * to Anthropic refs while preserving runtime allowlist entries for CLI execution.
 */
function toAnthropicModelRef(raw) {
  return resolveClaudeCliAnthropicModelRefs(raw)?.rewriteRef ?? null;
}
function toAnthropicRuntimeRefs(raw) {
  return resolveClaudeCliAnthropicModelRefs(raw)?.runtimeRefs ?? [];
}
function toAnthropicSelectedModelRef(raw) {
  const resolved = resolveClaudeCliAnthropicModelRefs(raw);
  return resolved?.rewriteRef ?? resolved?.selectedRef;
}
function rewriteModelSelection(model) {
  if (typeof model === "string") {
    const runtimeRefs = toAnthropicRuntimeRefs(model);
    const converted = toAnthropicModelRef(model);
    const selectedRef = converted ?? toAnthropicSelectedModelRef(model);
    return converted
      ? {
          value: converted,
          primary: converted,
          runtimeRefs,
          changed: true,
        }
      : {
          value: model,
          ...(selectedRef ? { primary: selectedRef } : {}),
          runtimeRefs,
          changed: false,
        };
  }
  if (!model || typeof model !== "object" || Array.isArray(model))
    return {
      value: model,
      runtimeRefs: [],
      changed: false,
    };
  const current = model;
  const next = { ...current };
  const runtimeRefs = [];
  let changed = false;
  let primary;
  if (typeof current.primary === "string") {
    runtimeRefs.push(...toAnthropicRuntimeRefs(current.primary));
    const converted = toAnthropicModelRef(current.primary);
    if (converted) {
      next.primary = converted;
      primary = converted;
      changed = true;
    } else primary = toAnthropicSelectedModelRef(current.primary);
  }
  const currentFallbacks = current.fallbacks;
  if (Array.isArray(currentFallbacks)) {
    const nextFallbacks = currentFallbacks.map((entry) => {
      if (typeof entry !== "string") return entry;
      runtimeRefs.push(...toAnthropicRuntimeRefs(entry));
      return toAnthropicModelRef(entry) ?? entry;
    });
    if (nextFallbacks.some((entry, index) => entry !== currentFallbacks[index])) {
      next.fallbacks = nextFallbacks;
      changed = true;
    }
  }
  return {
    value: changed ? next : model,
    ...(primary ? { primary } : {}),
    runtimeRefs,
    changed,
  };
}
function rewriteModelEntryMap(models) {
  if (!models)
    return {
      value: models,
      migrated: [],
      runtimeRefs: [],
    };
  const next = { ...models };
  const migrated = [];
  const runtimeRefs = [];
  for (const [rawKey, value] of Object.entries(models)) {
    runtimeRefs.push(...toAnthropicRuntimeRefs(rawKey));
    const converted = toAnthropicModelRef(rawKey);
    if (!converted) continue;
    if (converted === rawKey) continue;
    if (!(converted in next)) next[converted] = value;
    if (normalizeLowercaseStringOrEmpty(rawKey).startsWith(`claude-cli/`)) delete next[rawKey];
    migrated.push(converted);
  }
  return {
    value: migrated.length > 0 || runtimeRefs.length > 0 ? next : models,
    migrated,
    runtimeRefs,
  };
}
function seedClaudeCliAllowlist(models, selectedRefs = []) {
  const next = { ...models };
  const runtimeRefs = /* @__PURE__ */ new Set();
  for (const ref of CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS) {
    const canonicalRef = toAnthropicModelRef(ref) ?? ref;
    runtimeRefs.add(canonicalRef);
  }
  for (const ref of selectedRefs) runtimeRefs.add(ref);
  for (const ref of runtimeRefs) next[ref] = modelEntryWithClaudeCliRuntime(next[ref]);
  return next;
}
function modelEntryWithClaudeCliRuntime(entry) {
  const base = isRecord(entry) ? { ...entry } : {};
  const currentRuntimeId = isRecord(base.agentRuntime) ? base.agentRuntime.id : void 0;
  const currentRuntime =
    typeof currentRuntimeId === "string" ? normalizeLowercaseStringOrEmpty(currentRuntimeId) : "";
  if (currentRuntime && currentRuntime !== "auto") return base;
  base.agentRuntime = {
    ...(isRecord(base.agentRuntime) ? base.agentRuntime : {}),
    id: CLAUDE_CLI_BACKEND_ID,
  };
  return base;
}
function buildClaudeCliAuthProfiles(credential) {
  if (!credential) return [];
  if (credential.type === "oauth")
    return [
      {
        profileId: CLAUDE_CLI_PROFILE_ID,
        credential: {
          type: "oauth",
          provider: CLAUDE_CLI_BACKEND_ID,
          access: credential.access,
          refresh: credential.refresh,
          expires: credential.expires,
        },
      },
    ];
  return [
    {
      profileId: CLAUDE_CLI_PROFILE_ID,
      credential: {
        type: "token",
        provider: CLAUDE_CLI_BACKEND_ID,
        token: credential.token,
        expires: credential.expires,
      },
    },
  ];
}
/** Build the config migration result for adopting Claude CLI-backed Anthropic defaults. */
function buildAnthropicCliMigrationResult(config, credential) {
  const defaults = config.agents?.defaults;
  const rewrittenModel = rewriteModelSelection(defaults?.model);
  const rewrittenModels = rewriteModelEntryMap(defaults?.models);
  const nextModels = seedClaudeCliAllowlist(rewrittenModels.value ?? defaults?.models ?? {}, [
    ...rewrittenModel.runtimeRefs,
    ...rewrittenModels.runtimeRefs,
    ...rewrittenModels.migrated,
  ]);
  const defaultModel = rewrittenModel.primary ?? "anthropic/claude-opus-4-8";
  return {
    profiles: buildClaudeCliAuthProfiles(credential),
    configPatch: {
      agents: {
        defaults: {
          ...(rewrittenModel.changed ? { model: rewrittenModel.value } : {}),
          models: nextModels,
        },
      },
    },
    replaceDefaultModels: true,
    defaultModel,
    notes: [
      "Claude CLI auth detected; kept Anthropic model refs and selected the local Claude CLI runtime.",
      "Existing Anthropic auth profiles are kept for rollback.",
      ...(rewrittenModels.migrated.length > 0
        ? [`Migrated allowlist entries: ${rewrittenModels.migrated.join(", ")}.`]
        : []),
    ],
  };
}
//#endregion
export { buildAnthropicCliMigrationResult as t };
