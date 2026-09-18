import { randomUUID } from "node:crypto";
import milliseconds from "ms";
import prettyMilliseconds from "pretty-ms";
import "../../number-runtime-B-n-wjMn.js";
import "../../string-coerce-runtime-BUe4iD0r.js";
import {
  C as resolveExpiresAtMsFromDurationMs,
  o as asDateTimestampMs,
} from "../../number-coercion-CJQ8TR--.js";
import "../../runtime-api-tOKAtVtG.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "../../string-coerce-DW4mBlAt.js";
import {
  g as sortUniqueStrings,
  l as normalizeStringEntries,
} from "../../string-normalization-CRyoFBPt.js";
//#region extensions/phone-control/index.ts
const STATE_VERSION = 3;
const ARM_STATE_NAMESPACE = "armed";
const PHONE_ADMIN_SCOPE = "operator.admin";
const PHONE_CONTROL_POLICY_DENIED = "PHONE_CONTROL_DISARMED";
const PHONE_CONTROL_POLICY_UNAVAILABLE = "PHONE_CONTROL_STATE_UNAVAILABLE";
const GROUP_COMMANDS = {
  camera: ["camera.snap", "camera.clip"],
  screen: ["screen.record"],
  computer: ["computer.act"],
  writes: ["calendar.add", "contacts.add", "reminders.add", "sms.send"],
};
const PHONE_CONTROL_COMMANDS = Object.values(GROUP_COMMANDS).flat();
const LEGACY_ALL_GROUPS = ["camera", "screen", "writes"];
function uniqSorted(values) {
  return sortUniqueStrings(normalizeStringEntries(values));
}
function resolveCommandsForGroup(group) {
  if (group === "all")
    return uniqSorted(LEGACY_ALL_GROUPS.flatMap((legacyGroup) => GROUP_COMMANDS[legacyGroup]));
  return uniqSorted(GROUP_COMMANDS[group]);
}
function formatGroupList() {
  return ["camera", "screen", "computer", "writes", "all"].join(", ");
}
function parseDurationMs(input) {
  const raw = normalizeOptionalLowercaseString(input);
  if (!raw || !/^\d+(?:\.\d+)?(?:ms|s|m|h|d)$/.test(raw)) return null;
  const durationMs = milliseconds(raw);
  return Number.isSafeInteger(durationMs) && durationMs > 0 ? durationMs : null;
}
function formatDuration(ms) {
  const roundedMs = ms < 1e3 ? Math.round(ms) : Math.round(ms / 1e3) * 1e3;
  return prettyMilliseconds(Math.max(0, roundedMs), {
    compact: true,
    hideYear: true,
  });
}
function openArmStateStore(api) {
  return api.runtime.state.openKeyedStore({
    namespace: ARM_STATE_NAMESPACE,
    maxEntries: 1,
    overflowPolicy: "reject-new",
  });
}
async function readStoredArmState(api) {
  const entries = await openArmStateStore(api).entries();
  if (entries.length === 0) return null;
  if (entries.length !== 1)
    throw new Error("phone-control: arm state contains multiple lease records");
  const entry = entries[0];
  if (!entry) return null;
  return {
    key: entry.key,
    state: entry.value,
  };
}
async function readArmState(api) {
  return (await readStoredArmState(api))?.state ?? null;
}
async function registerArmState(api, state) {
  await openArmStateStore(api).register(state.generation, state);
}
async function activateArmState(api, preparing) {
  const store = openArmStateStore(api);
  if (!store.update) throw new Error("phone-control: atomic arm-state update is unavailable");
  return await store.update(preparing.generation, (current) => {
    if (
      current?.version !== STATE_VERSION ||
      current.generation !== preparing.generation ||
      current.phase !== "preparing"
    )
      return;
    return {
      ...preparing,
      phase: "active",
    };
  });
}
async function consumeArmState(api, expected) {
  const consumed = await openArmStateStore(api).consume(expected.key);
  if (!consumed) return false;
  if (
    expected.state.version === STATE_VERSION &&
    (consumed.version !== STATE_VERSION || consumed.generation !== expected.state.generation)
  )
    throw new Error("phone-control: arm-state generation changed during cleanup");
  return true;
}
function normalizeDenyList(cfg) {
  return uniqSorted([...(cfg.gateway?.nodes?.denyCommands ?? [])]);
}
function normalizeAllowList(cfg) {
  return uniqSorted([...(cfg.gateway?.nodes?.allowCommands ?? [])]);
}
function resolveEffectivePhoneControlAllows(params) {
  return uniqSorted(
    PHONE_CONTROL_COMMANDS.filter(
      (command) => params.allow.has(command) && !params.deny.has(command),
    ),
  );
}
function resolvePersistentEffectivePhoneControlAllows(cfg, state) {
  const effective = resolveEffectivePhoneControlAllows({
    allow: new Set(normalizeAllowList(cfg)),
    deny: new Set(normalizeDenyList(cfg)),
  });
  if (!state) return effective;
  if (state.version === STATE_VERSION) {
    const persistent = new Set(state.persistentAllows);
    return effective.filter((command) => persistent.has(command));
  }
  const temporary = /* @__PURE__ */ new Set([
    ...(state.version === 2 ? state.addedToAllow : []),
    ...state.removedFromDeny,
  ]);
  return effective.filter((command) => !temporary.has(command));
}
function resolveArmStateCommands(state) {
  if (state.version === 1) return uniqSorted(state.removedFromDeny);
  return uniqSorted(
    state.armedCommands.length > 0
      ? state.armedCommands
      : [...state.addedToAllow, ...state.removedFromDeny],
  );
}
function isArmStatePreparing(state) {
  return state.version === STATE_VERSION && state.phase === "preparing";
}
function isCommandEffectivelyAllowed(cfg, command) {
  const allow = new Set(normalizeAllowList(cfg));
  const deny = new Set(normalizeDenyList(cfg));
  return allow.has(command) && !deny.has(command);
}
function formatPersistentAllows(commands) {
  if (commands.length === 0) return null;
  return `Persistent gateway allows (remain active after /phone disarm): ${commands.join(", ")}`;
}
function hasPhoneControlAllowOverride(cfg) {
  const allow = new Set(normalizeAllowList(cfg));
  return PHONE_CONTROL_COMMANDS.some((cmd) => allow.has(cmd));
}
function patchConfigNodeLists(cfg, next) {
  return {
    ...cfg,
    gateway: {
      ...cfg.gateway,
      nodes: {
        ...cfg.gateway?.nodes,
        allowCommands: next.allowCommands,
        denyCommands: next.denyCommands,
      },
    },
  };
}
async function disarmNow(params) {
  const { api, reason } = params;
  const stored = await readStoredArmState(api);
  const currentConfig = api.runtime.config.current();
  const matchingStored =
    stored !== null && (params.expectedKey === void 0 || stored.key === params.expectedKey)
      ? stored
      : null;
  const fallbackMatchesExpected =
    stored === null &&
    params.expectedKey !== void 0 &&
    params.fallbackState?.generation === params.expectedKey;
  if (!matchingStored && !fallbackMatchesExpected)
    return {
      changed: false,
      restored: [],
      removed: [],
      persistentlyAllowed: resolveEffectivePhoneControlAllows({
        allow: new Set(normalizeAllowList(currentConfig)),
        deny: new Set(normalizeDenyList(currentConfig)),
      }),
    };
  const state = matchingStored?.state ?? params.fallbackState;
  if (!state) throw new Error("phone-control: missing arm-state cleanup journal");
  const removed = [];
  const restored = [];
  let finalAllow = normalizeAllowList(currentConfig);
  let finalDeny = normalizeDenyList(currentConfig);
  const addedToAllow = state.version === 1 ? [] : state.addedToAllow;
  if (addedToAllow.length > 0 || state.removedFromDeny.length > 0)
    await api.runtime.config.mutateConfigFile({
      afterWrite: { mode: "auto" },
      mutate: (draft) => {
        const allow = new Set(normalizeAllowList(draft));
        const deny = new Set(normalizeDenyList(draft));
        for (const cmd of addedToAllow) if (allow.delete(cmd)) removed.push(cmd);
        for (const cmd of state.removedFromDeny)
          if (!deny.has(cmd)) {
            deny.add(cmd);
            restored.push(cmd);
          }
        finalAllow = uniqSorted([...allow]);
        finalDeny = uniqSorted([...deny]);
        const next = patchConfigNodeLists(draft, {
          allowCommands: finalAllow,
          denyCommands: finalDeny,
        });
        Object.assign(draft, next);
      },
    });
  if (matchingStored && !(await consumeArmState(api, matchingStored)))
    throw new Error("phone-control: arm state changed before cleanup completed");
  api.logger.info(`phone-control: disarmed (${reason})`);
  return {
    changed: removed.length > 0 || restored.length > 0,
    removed: uniqSorted(removed),
    restored: uniqSorted(restored),
    persistentlyAllowed: resolveEffectivePhoneControlAllows({
      allow: new Set(finalAllow),
      deny: new Set(finalDeny),
    }),
  };
}
function formatHelp() {
  return [
    "Phone control commands:",
    "",
    "/phone status",
    "/phone arm <group> [duration]",
    "/phone disarm",
    "",
    "Groups:",
    `- ${formatGroupList()}`,
    "",
    "Duration format: 30s | 10m | 2h | 1d (default: 10m).",
    "",
    "Notes:",
    "- This only toggles what the gateway is allowed to invoke on paired nodes.",
    "- iOS will still ask for permissions (camera, photos, contacts, etc.) on first use.",
    "- all keeps its legacy camera/screen/writes scope; desktop control requires",
    "  an explicit /phone arm computer.",
    "- computer: desktop pointer/keyboard control on a paired macOS node; the Mac",
    "  app still requires Computer Control enabled plus Accessibility permission.",
  ].join("\n");
}
function parseGroup(raw) {
  const value = normalizeOptionalLowercaseString(raw) ?? "";
  if (!value) return null;
  if (
    value === "camera" ||
    value === "screen" ||
    value === "computer" ||
    value === "writes" ||
    value === "all"
  )
    return value;
  return null;
}
function lacksAdminToMutatePhoneControl(params) {
  const { senderIsOwner, gatewayClientScopes } = params;
  if (Array.isArray(gatewayClientScopes)) return !gatewayClientScopes.includes(PHONE_ADMIN_SCOPE);
  return senderIsOwner !== true;
}
function resolveArmExpiryStatus(state, nowRaw = Date.now()) {
  if (state.expiresAtMs == null) return "manual disarm required";
  const now = asDateTimestampMs(nowRaw);
  if (now === void 0) return "expiry unavailable";
  const expiresAt = asDateTimestampMs(state.expiresAtMs);
  if (expiresAt === void 0 || expiresAt <= now) return "expired";
  return `expires in ${formatDuration(expiresAt - now)}`;
}
function isArmStateExpired(state, nowRaw = Date.now()) {
  if (state.expiresAtMs == null) return false;
  const now = asDateTimestampMs(nowRaw);
  if (now === void 0) return false;
  const expiresAt = asDateTimestampMs(state.expiresAtMs);
  return expiresAt === void 0 || expiresAt <= now;
}
function formatStatus(state, cfg) {
  const persistentLine = formatPersistentAllows(
    resolvePersistentEffectivePhoneControlAllows(cfg, state),
  );
  if (!state) return ["Phone control: disarmed.", persistentLine].filter(Boolean).join("\n");
  if (isArmStatePreparing(state)) {
    const commands = resolveArmStateCommands(state);
    return [
      "Phone control: reconciling (temporary commands unavailable).",
      `Pending scope: ${commands.length > 0 ? commands.join(", ") : "none"}`,
      persistentLine,
    ]
      .filter(Boolean)
      .join("\n");
  }
  const until = resolveArmExpiryStatus(state);
  const cmds = resolveArmStateCommands(state);
  const cmdLabel = cmds.length > 0 ? cmds.join(", ") : "none";
  const commandLabel = persistentLine ? "Arm scope" : "Temporarily allowed";
  return [`Phone control: armed (${until}).`, `${commandLabel}: ${cmdLabel}`, persistentLine]
    .filter(Boolean)
    .join("\n");
}
var phone_control_default = definePluginEntry({
  id: "phone-control",
  name: "Phone Control",
  description: "Temporary allowlist control for phone automation commands",
  register(api) {
    let expiryInterval = null;
    let initialExpiryTick = null;
    let acceptingLeaseMutations = true;
    let leaseMutationTail = Promise.resolve();
    const serializeLeaseMutation = (run) => {
      if (!acceptingLeaseMutations)
        return Promise.reject(/* @__PURE__ */ new Error("phone-control: lease owner is stopping"));
      const result = leaseMutationTail.then(run, run);
      leaseMutationTail = result.then(
        () => void 0,
        () => void 0,
      );
      return result;
    };
    const disarmLease = async (params) =>
      await disarmNow({
        api,
        ...params,
      });
    const reconcileLease = async (reason) => {
      const stored = await readStoredArmState(api);
      if (!stored) return;
      if (!isArmStatePreparing(stored.state) && !isArmStateExpired(stored.state)) return;
      await disarmLease({
        reason,
        expectedKey: stored.key,
      });
    };
    const logReconcileFailure = (reason, err) => {
      api.logger.warn(`phone-control: ${reason} reconciliation failed: ${String(err)}`);
    };
    api.registerService({
      id: "phone-control-expiry",
      start: async (ctx) => {
        const tick = async () =>
          await serializeLeaseMutation(async () => await reconcileLease("expired"));
        expiryInterval = setInterval(() => {
          tick().catch((err) => logReconcileFailure("expiry", err));
        }, 15e3);
        expiryInterval.unref?.();
        if (hasPhoneControlAllowOverride(ctx.config))
          await tick().catch((err) => logReconcileFailure("startup", err));
        else {
          initialExpiryTick = setImmediate(() => {
            initialExpiryTick = null;
            tick().catch((err) => logReconcileFailure("initial expiry", err));
          });
          initialExpiryTick.unref?.();
        }
      },
      stop: async () => {
        acceptingLeaseMutations = false;
        if (initialExpiryTick) {
          clearImmediate(initialExpiryTick);
          initialExpiryTick = null;
        }
        if (expiryInterval) {
          clearInterval(expiryInterval);
          expiryInterval = null;
        }
        await leaseMutationTail;
      },
    });
    api.registerNodeInvokePolicy({
      commands: [...GROUP_COMMANDS.computer],
      handle: async (ctx) => {
        let allowed;
        try {
          allowed = await serializeLeaseMutation(async () => {
            await reconcileLease("dispatch");
            const state = await readArmState(api);
            const cfg = api.runtime.config.current();
            if (!isCommandEffectivelyAllowed(cfg, ctx.command)) return false;
            if (!state) return true;
            if (resolvePersistentEffectivePhoneControlAllows(cfg, state).includes(ctx.command))
              return true;
            return (
              !isArmStatePreparing(state) &&
              !isArmStateExpired(state) &&
              resolveArmStateCommands(state).includes(ctx.command)
            );
          });
        } catch (err) {
          logReconcileFailure("computer dispatch", err);
          return {
            ok: false,
            code: PHONE_CONTROL_POLICY_UNAVAILABLE,
            message: `phone-control: ${ctx.command} lease state is unavailable`,
            unavailable: true,
          };
        }
        if (!allowed)
          return {
            ok: false,
            code: PHONE_CONTROL_POLICY_DENIED,
            message: `phone-control: ${ctx.command} is not covered by an active temporary lease or persistent gateway allow`,
          };
        return await ctx.invokeNode();
      },
    });
    api.registerCommand({
      name: "phone",
      description: "Arm/disarm high-risk node commands (camera/screen/computer/writes).",
      acceptsArgs: true,
      exposeSenderIsOwner: true,
      handler: async (ctx) => {
        const tokens = (ctx.args?.trim() ?? "").split(/\s+/).filter(Boolean);
        const action = normalizeLowercaseStringOrEmpty(tokens[0]);
        if (!action || action === "help")
          return {
            text: `${formatStatus(await serializeLeaseMutation(async () => await readArmState(api)), api.runtime.config.current())}\n\n${formatHelp()}`,
          };
        if (action === "status")
          return {
            text: formatStatus(
              await serializeLeaseMutation(async () => await readArmState(api)),
              api.runtime.config.current(),
            ),
          };
        if (action === "disarm") {
          if (
            lacksAdminToMutatePhoneControl({
              senderIsOwner: ctx.senderIsOwner,
              gatewayClientScopes: ctx.gatewayClientScopes,
            })
          )
            return { text: "⚠️ /phone disarm requires operator.admin." };
          const res = await serializeLeaseMutation(
            async () => await disarmLease({ reason: "manual" }),
          );
          const persistentLine = formatPersistentAllows(res.persistentlyAllowed);
          if (!res.changed && !persistentLine) return { text: "Phone control: disarmed." };
          const restoredLabel = res.restored.length > 0 ? res.restored.join(", ") : "none";
          return {
            text: [
              "Phone control: disarmed.",
              `Removed allowlist: ${res.removed.length > 0 ? res.removed.join(", ") : "none"}`,
              `Restored denylist: ${restoredLabel}`,
              persistentLine,
            ]
              .filter(Boolean)
              .join("\n"),
          };
        }
        if (action === "arm") {
          if (
            lacksAdminToMutatePhoneControl({
              senderIsOwner: ctx.senderIsOwner,
              gatewayClientScopes: ctx.gatewayClientScopes,
            })
          )
            return { text: "⚠️ /phone arm requires operator.admin." };
          const group = parseGroup(tokens[1]);
          if (!group)
            return { text: `Usage: /phone arm <group> [duration]\nGroups: ${formatGroupList()}` };
          const durationMs = tokens[2] === void 0 ? 10 * 6e4 : parseDurationMs(tokens[2]);
          if (durationMs === null)
            return { text: "Invalid duration. Use values like 30s, 10m, 2h, or 1d." };
          const armedAtMs = asDateTimestampMs(Date.now());
          const expiresAtMs =
            armedAtMs === void 0
              ? void 0
              : resolveExpiresAtMsFromDurationMs(durationMs, { nowMs: armedAtMs });
          if (armedAtMs === void 0 || expiresAtMs === void 0)
            return { text: "Invalid duration. Use values like 30s, 10m, 2h, or 1d." };
          return await serializeLeaseMutation(async () => {
            await disarmLease({ reason: "rearmed" });
            const commands = resolveCommandsForGroup(group);
            const generation = randomUUID();
            let preparingState;
            let configCommitCompleted = false;
            try {
              await api.runtime.config.mutateConfigFile({
                afterWrite: { mode: "auto" },
                mutate: async (draft) => {
                  const allow = new Set(normalizeAllowList(draft));
                  const deny = new Set(normalizeDenyList(draft));
                  const persistentAllows = resolveEffectivePhoneControlAllows({
                    allow,
                    deny,
                  });
                  const addedToAllow = [];
                  const removedFromDeny = [];
                  for (const cmd of commands) {
                    if (!allow.has(cmd)) {
                      allow.add(cmd);
                      addedToAllow.push(cmd);
                    }
                    if (deny.delete(cmd)) removedFromDeny.push(cmd);
                  }
                  preparingState = {
                    version: STATE_VERSION,
                    generation,
                    phase: "preparing",
                    armedAtMs,
                    expiresAtMs,
                    group,
                    armedCommands: uniqSorted(commands),
                    addedToAllow: uniqSorted(addedToAllow),
                    removedFromDeny: uniqSorted(removedFromDeny),
                    persistentAllows,
                  };
                  await registerArmState(api, preparingState);
                  const next = patchConfigNodeLists(draft, {
                    allowCommands: uniqSorted([...allow]),
                    denyCommands: uniqSorted([...deny]),
                  });
                  Object.assign(draft, next);
                },
              });
              configCommitCompleted = true;
              const prepared = preparingState;
              if (!prepared)
                throw new Error("phone-control: config mutation did not prepare an arm lease");
              if (!(await activateArmState(api, prepared)))
                throw new Error("phone-control: prepared arm lease changed before activation");
            } catch (err) {
              if (preparingState)
                try {
                  await disarmLease({
                    reason: "arm failed",
                    expectedKey: preparingState.generation,
                    fallbackState: configCommitCompleted ? preparingState : void 0,
                  });
                } catch (cleanupError) {
                  throw new Error(
                    `phone-control: arm failed and cleanup could not complete: ${String(err)}`,
                    { cause: cleanupError },
                  );
                }
              throw new Error("phone-control: failed to persist temporary arm lease", {
                cause: err,
              });
            }
            const allowedLabel = uniqSorted(commands).join(", ");
            return {
              text: `Phone control: armed for ${formatDuration(durationMs)}.\nTemporarily allowed: ${allowedLabel}\nTo disarm early: /phone disarm`,
            };
          });
        }
        return { text: formatHelp() };
      },
    });
  },
});
//#endregion
export { phone_control_default as default };
