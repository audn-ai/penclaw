import { t as expectDefined } from "./expect-CyE8FADM.js";
import {
  c as NODE_MCP_TOOLS_CALL_COMMAND,
  d as NODE_SYSTEM_NOTIFY_COMMAND,
  f as NODE_SYSTEM_RUN_COMMANDS,
  i as NODE_BROWSER_PROXY_COMMAND,
  o as NODE_EXEC_APPROVALS_COMMANDS,
  r as NODE_AGENT_CLI_CLAUDE_RUN_COMMAND,
  s as NODE_FS_LIST_DIR_COMMAND,
} from "./node-commands-zATGYJg5.js";
import "./src-Bl7G9qvi.js";
import { a as getActivePluginGatewayNodePolicyRegistry } from "./runtime-CcYnX0B4.js";
import {
  a as normalizeLowercaseStringOrEmpty,
  s as normalizeOptionalLowercaseString,
} from "./string-coerce-DW4mBlAt.js";
import { p as normalizeUniqueStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/gateway/device-metadata-normalization.ts
function normalizeTrimmedMetadata(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed ? trimmed : "";
}
/** Normalize device metadata for policy classification. */
function normalizeDeviceMetadataForPolicy(value) {
  const trimmed = normalizeTrimmedMetadata(value);
  if (!trimmed) return "";
  return normalizeLowercaseStringOrEmpty(trimmed.normalize("NFKD").replace(/\p{M}/gu, ""));
}
//#endregion
//#region src/gateway/node-command-policy-mobile.ts
const NOTIFICATION_COMMANDS = ["notifications.list"];
const MOBILE_NODE_COMMANDS = {
  location: ["location.get"],
  notification: NOTIFICATION_COMMANDS,
  androidNotification: [...NOTIFICATION_COMMANDS, "notifications.actions"],
  device: ["device.info", "device.status"],
};
//#endregion
//#region src/gateway/node-command-policy.ts
const CAMERA_COMMANDS = ["camera.list"];
const CAMERA_DANGEROUS_COMMANDS = ["camera.snap", "camera.clip"];
const SCREEN_COMMANDS = ["screen.snapshot"];
const SCREEN_DANGEROUS_COMMANDS = ["screen.record"];
const COMPUTER_DANGEROUS_COMMANDS = ["computer.act"];
const ANDROID_DEVICE_COMMANDS = [
  ...MOBILE_NODE_COMMANDS.device,
  "device.permissions",
  "device.health",
  "device.apps",
];
const CONTACTS_COMMANDS = ["contacts.search"];
const CONTACTS_DANGEROUS_COMMANDS = ["contacts.add"];
const CALENDAR_COMMANDS = ["calendar.events"];
const CALENDAR_DANGEROUS_COMMANDS = ["calendar.add"];
const CALL_LOG_COMMANDS = ["callLog.search"];
const REMINDERS_COMMANDS = ["reminders.list"];
const REMINDERS_DANGEROUS_COMMANDS = ["reminders.add"];
const PHOTOS_COMMANDS = ["photos.latest"];
const MOTION_COMMANDS = ["motion.activity", "motion.pedometer"];
const HEALTH_DANGEROUS_COMMANDS = ["health.summary"];
const SMS_DANGEROUS_COMMANDS = ["sms.send", "sms.search"];
const TALK_PTT_COMMANDS = ["talk.ptt.start", "talk.ptt.stop", "talk.ptt.cancel", "talk.ptt.once"];
const IOS_WATCH_RELAY_COMMANDS = ["watch.status", "watch.notify"];
const IOS_SYSTEM_COMMANDS = [NODE_SYSTEM_NOTIFY_COMMAND];
const SYSTEM_COMMANDS = [
  ...NODE_SYSTEM_RUN_COMMANDS,
  ...NODE_EXEC_APPROVALS_COMMANDS,
  NODE_FS_LIST_DIR_COMMAND,
  NODE_SYSTEM_NOTIFY_COMMAND,
  NODE_BROWSER_PROXY_COMMAND,
  NODE_MCP_TOOLS_CALL_COMMAND,
  NODE_AGENT_CLI_CLAUDE_RUN_COMMAND,
];
const DESKTOP_HOST_COMMANDS = /* @__PURE__ */ new Set([
  ...NODE_SYSTEM_RUN_COMMANDS,
  ...NODE_EXEC_APPROVALS_COMMANDS,
  NODE_FS_LIST_DIR_COMMAND,
  NODE_BROWSER_PROXY_COMMAND,
  NODE_MCP_TOOLS_CALL_COMMAND,
  NODE_AGENT_CLI_CLAUDE_RUN_COMMAND,
  ...SCREEN_COMMANDS,
]);
const UNKNOWN_PLATFORM_COMMANDS = [
  ...CAMERA_COMMANDS,
  ...MOBILE_NODE_COMMANDS.location,
  NODE_SYSTEM_NOTIFY_COMMAND,
];
const DEFAULT_DANGEROUS_NODE_COMMANDS = [
  ...CAMERA_DANGEROUS_COMMANDS,
  ...SCREEN_DANGEROUS_COMMANDS,
  ...COMPUTER_DANGEROUS_COMMANDS,
  ...CONTACTS_DANGEROUS_COMMANDS,
  ...CALENDAR_DANGEROUS_COMMANDS,
  ...REMINDERS_DANGEROUS_COMMANDS,
  ...SMS_DANGEROUS_COMMANDS,
  ...HEALTH_DANGEROUS_COMMANDS,
];
const PLATFORM_DEFAULTS = {
  ios: [
    ...CAMERA_COMMANDS,
    ...MOBILE_NODE_COMMANDS.location,
    ...MOBILE_NODE_COMMANDS.device,
    ...CONTACTS_COMMANDS,
    ...CALENDAR_COMMANDS,
    ...REMINDERS_COMMANDS,
    ...PHOTOS_COMMANDS,
    ...MOTION_COMMANDS,
    ...IOS_SYSTEM_COMMANDS,
  ],
  watchos: [...MOBILE_NODE_COMMANDS.device, ...IOS_SYSTEM_COMMANDS],
  android: [
    ...CAMERA_COMMANDS,
    ...MOBILE_NODE_COMMANDS.location,
    ...MOBILE_NODE_COMMANDS.androidNotification,
    NODE_SYSTEM_NOTIFY_COMMAND,
    ...ANDROID_DEVICE_COMMANDS,
    ...CONTACTS_COMMANDS,
    ...CALENDAR_COMMANDS,
    ...CALL_LOG_COMMANDS,
    ...REMINDERS_COMMANDS,
    ...PHOTOS_COMMANDS,
    ...MOTION_COMMANDS,
  ],
  macos: [
    ...CAMERA_COMMANDS,
    ...MOBILE_NODE_COMMANDS.location,
    ...MOBILE_NODE_COMMANDS.device,
    ...CONTACTS_COMMANDS,
    ...CALENDAR_COMMANDS,
    ...REMINDERS_COMMANDS,
    ...PHOTOS_COMMANDS,
    ...MOTION_COMMANDS,
    ...SYSTEM_COMMANDS,
    ...SCREEN_COMMANDS,
    ...COMPUTER_DANGEROUS_COMMANDS,
  ],
  linux: [...SYSTEM_COMMANDS],
  windows: [
    ...CAMERA_COMMANDS,
    ...MOBILE_NODE_COMMANDS.location,
    ...MOBILE_NODE_COMMANDS.device,
    ...SYSTEM_COMMANDS,
    ...SCREEN_COMMANDS,
  ],
  unknown: [...UNKNOWN_PLATFORM_COMMANDS],
};
const CANONICAL_PLATFORM_IDS = /* @__PURE__ */ new Set([
  "ios",
  "watchos",
  "android",
  "macos",
  "windows",
  "linux",
]);
const DEVICE_FAMILY_TOKEN_RULES = [
  {
    id: "ios",
    tokens: ["iphone", "ipad", "ios"],
  },
  {
    id: "watchos",
    tokens: ["apple watch", "watchos"],
  },
  {
    id: "android",
    tokens: ["android"],
  },
  {
    id: "macos",
    tokens: ["mac"],
  },
  {
    id: "windows",
    tokens: ["windows"],
  },
  {
    id: "linux",
    tokens: ["linux"],
  },
];
function resolvePlatformIdByExactMatch(value) {
  if (CANONICAL_PLATFORM_IDS.has(value)) return value;
}
function platformMatchesDeviceFamily(platformId, family) {
  switch (platformId) {
    case "ios":
      return family === "" || /^(?:iphone|ipad|ios)$/.test(family);
    case "watchos":
      return family === "apple watch" || family === "watchos";
    case "android":
      return family === "" || family === "android";
    case "macos":
      return family === "mac";
    case "windows":
      return family === "windows";
    case "linux":
      return family === "linux";
  }
  return false;
}
function resolvePlatformIdByNativeLabel(platform, deviceFamily) {
  if (/^(?:ios|ipados) \d+(?:\.\d+){0,2}$/.test(platform))
    return /^(?:iphone|ipad|ios)$/.test(deviceFamily) ? "ios" : void 0;
  if (/^watchos \d+(?:\.\d+){0,2}$/.test(platform))
    return /^(?:apple watch|watchos)$/.test(deviceFamily) ? "watchos" : void 0;
  if (/^macos \d+(?:\.\d+){0,2}$/.test(platform)) return deviceFamily === "mac" ? "macos" : void 0;
  if (/^android \d+(?: \(sdk \d+\))?$/.test(platform))
    return deviceFamily === "android" ? "android" : void 0;
}
function resolvePlatformIdByDeviceFamily(value) {
  for (const rule of DEVICE_FAMILY_TOKEN_RULES)
    if (rule.tokens.some((token) => value.includes(token))) return rule.id;
}
function normalizePlatformId(platform, deviceFamily) {
  const raw = normalizeDeviceMetadataForPolicy(platform);
  const family = normalizeDeviceMetadataForPolicy(deviceFamily);
  const byPlatform = resolvePlatformIdByExactMatch(raw);
  if (byPlatform) return platformMatchesDeviceFamily(byPlatform, family) ? byPlatform : "unknown";
  const byNativeLabel = resolvePlatformIdByNativeLabel(raw, family);
  if (byNativeLabel) return byNativeLabel;
  if (raw) return "unknown";
  return resolvePlatformIdByDeviceFamily(family) ?? "unknown";
}
function listDangerousPluginNodeCommands() {
  const registry = getActivePluginGatewayNodePolicyRegistry();
  if (!registry) return [];
  return normalizeUniqueStringEntries([
    ...registry.nodeHostCommands
      .filter((entry) => entry.command.dangerous === true)
      .map((entry) => entry.command.command),
    ...registry.nodeInvokePolicies
      .filter((entry) => entry.policy.dangerous === true)
      .flatMap((entry) => entry.policy.commands),
  ]);
}
function listDefaultPluginNodeCommands(platformId) {
  if (platformId === "watchos") return [];
  const registry = getActivePluginGatewayNodePolicyRegistry();
  if (!registry) return [];
  const policyCommands = registry.nodeInvokePolicies.flatMap((entry) => {
    if (entry.policy.dangerous === true) return [];
    return (entry.policy.defaultPlatforms ?? []).includes(platformId) ? entry.policy.commands : [];
  });
  const nodeHostCommands = registry.nodeHostCommands
    .filter((entry) => {
      if (entry.command.dangerous === true) return false;
      return (entry.command.agentTool?.defaultPlatforms ?? []).includes(platformId);
    })
    .map((entry) => entry.command.command);
  return normalizeUniqueStringEntries([...policyCommands, ...nodeHostCommands]);
}
function isForegroundRestrictedPluginNodeCommand(command) {
  const registry = getActivePluginGatewayNodePolicyRegistry();
  if (!registry) return false;
  const normalized = command.trim();
  if (!normalized) return false;
  return registry.nodeInvokePolicies.some(
    (entry) =>
      entry.policy.foregroundRestrictedOnIos === true &&
      entry.policy.commands.some((policyCommand) => policyCommand.trim() === normalized),
  );
}
function isDesktopPlatformId(platformId) {
  return platformId === "macos" || platformId === "windows" || platformId === "linux";
}
function filterDesktopHostCommandDefaults(params) {
  if (params.includeDesktopHostCommands === true || !isDesktopPlatformId(params.platformId))
    return [...params.commands];
  return params.commands.filter((command) => !DESKTOP_HOST_COMMANDS.has(command));
}
function filterApprovedRuntimeCommands(params) {
  if (!isDesktopPlatformId(params.platformId)) return [];
  return params.commands.filter((command) => DESKTOP_HOST_COMMANDS.has(command.trim()));
}
function isLiveNodeSession(node) {
  return (
    typeof node?.nodeId === "string" &&
    node.nodeId.trim() !== "" &&
    typeof node.connId === "string" &&
    node.connId.trim() !== ""
  );
}
function hasTalkSurface(node) {
  if (!node) return false;
  return (
    (node.caps ?? []).some(
      (capability) => normalizeOptionalLowercaseString(capability) === "talk",
    ) ||
    (node.commands ?? []).some((command) =>
      normalizeOptionalLowercaseString(command)?.startsWith("talk."),
    )
  );
}
function resolveNodeCommandAllowlistInternal(cfg, node, options) {
  const platformId = normalizePlatformId(node?.platform, node?.deviceFamily);
  const base = filterDesktopHostCommandDefaults({
    platformId,
    commands:
      expectDefined(PLATFORM_DEFAULTS[platformId], "platform defaults entry at platform id") ??
      PLATFORM_DEFAULTS.unknown,
    includeDesktopHostCommands: options?.includeDesktopHostCommands,
  });
  const watchRelayCommands =
    platformId === "ios" && normalizeDeviceMetadataForPolicy(node?.deviceFamily) === "iphone"
      ? IOS_WATCH_RELAY_COMMANDS
      : [];
  const talkCommands = hasTalkSurface(node) ? TALK_PTT_COMMANDS : [];
  const pluginDefaults = listDefaultPluginNodeCommands(platformId);
  const approved = filterApprovedRuntimeCommands({
    platformId,
    commands: node?.approvedCommands ?? (isLiveNodeSession(node) ? (node?.commands ?? []) : []),
  });
  const extra = cfg.gateway?.nodes?.allowCommands ?? [];
  const deny = new Set(cfg.gateway?.nodes?.denyCommands ?? []);
  const dangerousPluginCommands = new Set(listDangerousPluginNodeCommands());
  const dangerousBuiltinCommands =
    options?.includeDangerousDefaults === true
      ? /* @__PURE__ */ new Set()
      : new Set(DEFAULT_DANGEROUS_NODE_COMMANDS);
  const allow = new Set(
    [...base, ...watchRelayCommands, ...talkCommands, ...pluginDefaults, ...approved, ...extra]
      .map((cmd) => cmd.trim())
      .filter(
        (cmd) => cmd && !dangerousPluginCommands.has(cmd) && !dangerousBuiltinCommands.has(cmd),
      ),
  );
  for (const cmd of extra) {
    const trimmed = cmd.trim();
    if (trimmed) allow.add(trimmed);
  }
  const denyExemptDeclarable =
    options?.includeDangerousDefaults === true
      ? new Set(DEFAULT_DANGEROUS_NODE_COMMANDS)
      : /* @__PURE__ */ new Set();
  for (const blocked of deny) {
    const trimmed = blocked.trim();
    if (trimmed && !denyExemptDeclarable.has(trimmed)) allow.delete(trimmed);
  }
  return allow;
}
function resolveNodeCommandAllowlist(cfg, node) {
  return resolveNodeCommandAllowlistInternal(cfg, node);
}
function resolveNodePairingCommandAllowlist(cfg, node) {
  return resolveNodeCommandAllowlistInternal(cfg, node, {
    includeDesktopHostCommands: true,
    includeDangerousDefaults: true,
  });
}
function normalizeDeclaredCommands(commands) {
  if (!Array.isArray(commands)) return [];
  const seen = /* @__PURE__ */ new Set();
  const normalized = [];
  for (const value of commands) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    normalized.push(trimmed);
  }
  return normalized;
}
function normalizeDeclaredNodeCommands(params) {
  return normalizeDeclaredCommands(params.declaredCommands).filter((command) =>
    params.allowlist.has(command),
  );
}
function isNodeCommandAllowed(params) {
  const command = params.command.trim();
  if (!command)
    return {
      ok: false,
      reason: "command required",
    };
  if (!params.allowlist.has(command))
    return {
      ok: false,
      reason: "command not allowlisted",
    };
  if (Array.isArray(params.declaredCommands) && params.declaredCommands.length > 0) {
    if (!params.declaredCommands.includes(command))
      return {
        ok: false,
        reason: "command not declared by node",
      };
  } else
    return {
      ok: false,
      reason: "node did not declare commands",
    };
  return { ok: true };
}
//#endregion
export {
  isForegroundRestrictedPluginNodeCommand as a,
  normalizeDeclaredNodeCommands as c,
  TALK_PTT_COMMANDS as i,
  resolveNodeCommandAllowlist as l,
  IOS_WATCH_RELAY_COMMANDS as n,
  isNodeCommandAllowed as o,
  PLATFORM_DEFAULTS as r,
  listDangerousPluginNodeCommands as s,
  DEFAULT_DANGEROUS_NODE_COMMANDS as t,
  resolveNodePairingCommandAllowlist as u,
};
