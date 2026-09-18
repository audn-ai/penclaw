import fs from "node:fs";
import path from "node:path";
import "./parse-finite-number-Z7n6tXLk.js";
import { pathToFileURL } from "node:url";
import { t as sanitizeForLog } from "./ansi-D4OHEz5F.js";
import { b as parseStrictPositiveInteger } from "./number-coercion-CJQ8TR--.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
//#region src/daemon/runtime-binary.ts
/** Classifies runtime executable paths for daemon command rendering. */
const NODE_VERSIONED_PATTERN = /^node(?:-\d+|\d+)(?:\.\d+)*(?:\.exe)?$/;
function normalizeRuntimeBasename(execPath) {
  const trimmed = execPath.trim().replace(/^["']|["']$/g, "");
  const lastSlash = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
  return normalizeLowercaseStringOrEmpty(lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1));
}
/** Returns whether an executable path names a Node runtime binary. */
function isNodeRuntime(execPath) {
  const base = normalizeRuntimeBasename(execPath);
  return (
    base === "node" ||
    base === "node.exe" ||
    base === "nodejs" ||
    base === "nodejs.exe" ||
    NODE_VERSIONED_PATTERN.test(base)
  );
}
/** Returns whether an executable path names a Bun runtime binary. */
function isBunRuntime(execPath) {
  const base = normalizeRuntimeBasename(execPath);
  return base === "bun" || base === "bun.exe";
}
const ROOT_BOOLEAN_FLAGS = /* @__PURE__ */ new Set(["--dev", "--no-color"]);
const ROOT_VALUE_FLAGS = /* @__PURE__ */ new Set(["--profile", "--log-level", "--container"]);
/** Returns whether a token can be consumed as a root option value. */
function isValueToken(arg) {
  if (!arg || arg === "--") return false;
  if (!arg.startsWith("-")) return true;
  return /^-\d+(?:\.\d+)?$/.test(arg);
}
/** Returns how many argv tokens a supported root option consumes at the given index. */
function consumeRootOptionToken(args, index) {
  const arg = args[index];
  if (!arg) return 0;
  if (ROOT_BOOLEAN_FLAGS.has(arg)) return 1;
  if (
    arg.startsWith("--profile=") ||
    arg.startsWith("--log-level=") ||
    arg.startsWith("--container=")
  )
    return 1;
  if (ROOT_VALUE_FLAGS.has(arg)) return isValueToken(args[index + 1]) ? 2 : 1;
  return 0;
}
//#endregion
//#region src/cli/program/command-descriptor-utils.ts
const SAFE_COMMAND_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
/** Normalize and validate a command descriptor name for safe Commander registration. */
function normalizeCommandDescriptorName(name) {
  const normalized = name.trim();
  return SAFE_COMMAND_NAME_PATTERN.test(normalized) ? normalized : null;
}
function assertSafeCommandDescriptorName(name) {
  const normalized = normalizeCommandDescriptorName(name);
  if (!normalized) throw new Error(`Invalid CLI command name: ${JSON.stringify(name.trim())}`);
  return normalized;
}
/** Strip unsafe terminal content from descriptor descriptions. */
function sanitizeCommandDescriptorDescription(description) {
  return sanitizeForLog(description).trim();
}
/** Return descriptor names in registration order. */
function getCommandDescriptorNames(descriptors) {
  return descriptors.map((descriptor) => descriptor.name);
}
/** Return descriptor names that should remain parent commands with subcommands. */
function getCommandsWithSubcommands(descriptors) {
  return descriptors
    .filter((descriptor) => descriptor.hasSubcommands)
    .map((descriptor) => descriptor.name);
}
/** Return descriptors whose parent command should show help by default. */
function getParentDefaultHelpCommands(descriptors) {
  return descriptors
    .filter((descriptor) => descriptor.parentDefaultHelp)
    .map((descriptor) => descriptor.name);
}
/** Merge descriptor groups while keeping the first descriptor for each command name. */
function collectUniqueCommandDescriptors(descriptorGroups) {
  const seen = /* @__PURE__ */ new Set();
  const descriptors = [];
  for (const group of descriptorGroups)
    for (const descriptor of group) {
      if (seen.has(descriptor.name)) continue;
      seen.add(descriptor.name);
      descriptors.push(descriptor);
    }
  return descriptors;
}
/** Create a descriptor catalog with stable derived lists. */
function defineCommandDescriptorCatalog(descriptors) {
  return {
    descriptors,
    getDescriptors: () => descriptors,
    getNames: () => getCommandDescriptorNames(descriptors),
    getCommandsWithSubcommands: () => getCommandsWithSubcommands(descriptors),
    getParentDefaultHelpCommands: () => getParentDefaultHelpCommands(descriptors),
  };
}
/** Add safe placeholder commands to Commander without duplicating existing command names. */
function addCommandDescriptorsToProgram(
  program,
  descriptors,
  existingCommands = /* @__PURE__ */ new Set(),
) {
  for (const descriptor of descriptors) {
    const name = assertSafeCommandDescriptorName(descriptor.name);
    if (existingCommands.has(name)) continue;
    program.command(name).description(sanitizeCommandDescriptorDescription(descriptor.description));
    existingCommands.add(name);
  }
  return existingCommands;
}
//#endregion
//#region src/cli/program/core-command-descriptors.ts
const coreCliCommandCatalog = defineCommandDescriptorCatalog([
  {
    name: "crestodian",
    description: "Open the ring-zero setup and repair helper",
    hasSubcommands: false,
  },
  {
    name: "setup",
    description: "Alias for openclaw onboard",
    hasSubcommands: false,
  },
  {
    name: "onboard",
    description: "Guided setup for auth, models, Gateway, workspace, channels, and skills",
    hasSubcommands: false,
  },
  {
    name: "configure",
    description: "Interactive configuration for credentials, channels, gateway, and agent defaults",
    hasSubcommands: false,
  },
  {
    name: "config",
    description:
      "Non-interactive config helpers (get/set/patch/unset/file/schema/validate). Run without subcommand for guided setup.",
    hasSubcommands: true,
  },
  {
    name: "backup",
    description: "Create and verify backup archives and SQLite snapshots",
    hasSubcommands: true,
  },
  {
    name: "migrate",
    description: "Import state from another agent system",
    hasSubcommands: true,
  },
  {
    name: "doctor",
    description: "Health checks + quick fixes for the gateway and channels",
    hasSubcommands: false,
  },
  {
    name: "dashboard",
    description: "Open the Control UI with your current token",
    hasSubcommands: false,
  },
  {
    name: "reset",
    description: "Reset local config/state (keeps the CLI installed)",
    hasSubcommands: false,
  },
  {
    name: "uninstall",
    description: "Uninstall the gateway service + local data (CLI remains)",
    hasSubcommands: false,
  },
  {
    name: "message",
    description: "Send, read, and manage messages and channel actions",
    hasSubcommands: true,
  },
  {
    name: "mcp",
    description: "Manage OpenClaw mcp.servers config and channel bridge",
    hasSubcommands: true,
    parentDefaultHelp: true,
  },
  {
    name: "transcripts",
    description: "Inspect stored transcripts",
    hasSubcommands: true,
  },
  {
    name: "agent",
    description: "Run an agent turn via the Gateway (use --local for embedded)",
    hasSubcommands: false,
  },
  {
    name: "agents",
    description: "Manage isolated agents (workspaces + auth + routing)",
    hasSubcommands: true,
  },
  {
    name: "status",
    description: "Show channel health and recent session recipients",
    hasSubcommands: false,
  },
  {
    name: "health",
    description: "Fetch health from the running gateway",
    hasSubcommands: false,
  },
  {
    name: "audit",
    description: "Inspect metadata-only run, tool, and message lifecycle records",
    hasSubcommands: false,
  },
  {
    name: "sessions",
    description: "List stored conversation sessions",
    hasSubcommands: true,
  },
  {
    name: "commitments",
    description: "List and manage inferred follow-up commitments",
    hasSubcommands: true,
  },
  {
    name: "tasks",
    description: "Inspect durable background tasks and TaskFlow state",
    hasSubcommands: true,
  },
]);
/** Static root-command descriptors for the core CLI surface. */
const CORE_CLI_COMMAND_DESCRIPTORS = coreCliCommandCatalog.descriptors;
/** Return core root-command descriptors in help/registration order. */
function getCoreCliCommandDescriptors() {
  return coreCliCommandCatalog.getDescriptors();
}
/** Return names for all core root commands. */
function getCoreCliCommandNames() {
  return coreCliCommandCatalog.getNames();
}
/** Return core root commands that own child subcommands. */
function getCoreCliCommandsWithSubcommands() {
  return coreCliCommandCatalog.getCommandsWithSubcommands();
}
/** Return core root commands whose parent action should default to help. */
function getCoreCliParentDefaultHelpCommands() {
  return coreCliCommandCatalog.getParentDefaultHelpCommands();
}
//#endregion
//#region src/cli/program/private-qa-cli.ts
const PRIVATE_QA_DIST_RELATIVE_PATH = path.join("dist", "plugin-sdk", "qa-lab.js");
const SOURCE_CHECKOUT_MARKER_RELATIVE_PATHS = [".git", "pnpm-workspace.yaml"];
/** Return true when private QA CLI routes should be exposed. */
function isPrivateQaCliEnabled(env = process.env) {
  return env.OPENCLAW_ENABLE_PRIVATE_QA_CLI === "1";
}
function resolvePrivateQaSourceModuleSpecifier(params) {
  if (!isPrivateQaCliEnabled(params?.env ?? process.env)) return null;
  const packageRoot = (params?.resolvePackageRootSync ?? resolveOpenClawPackageRootSync)({
    argv1: params?.argv1 ?? process.argv[1],
    cwd: params?.cwd ?? process.cwd(),
    moduleUrl: params?.moduleUrl ?? import.meta.url,
  });
  if (!packageRoot) return null;
  const existsSync = params?.existsSync ?? fs.existsSync;
  const sourceModulePath = path.join(packageRoot, PRIVATE_QA_DIST_RELATIVE_PATH);
  if (
    !SOURCE_CHECKOUT_MARKER_RELATIVE_PATHS.some((relativePath) =>
      existsSync(path.join(packageRoot, relativePath)),
    ) ||
    !existsSync(path.join(packageRoot, "src")) ||
    !existsSync(sourceModulePath)
  )
    return null;
  return pathToFileURL(sourceModulePath).href;
}
async function dynamicImportPrivateQaCliModule(specifier) {
  return await import(specifier);
}
/** Load the private QA module from a source checkout or throw a user-facing availability error. */
function loadPrivateQaCliModule(params) {
  const specifier = resolvePrivateQaSourceModuleSpecifier(params);
  if (!specifier)
    throw new Error("Private QA CLI is only available from an OpenClaw source checkout.");
  return (params?.importModule ?? dynamicImportPrivateQaCliModule)(specifier);
}
//#endregion
//#region src/cli/program/subcli-descriptors.ts
const subCliCommandCatalog = defineCommandDescriptorCatalog([
  {
    name: "acp",
    description: "Run an ACP bridge backed by the Gateway",
    hasSubcommands: true,
  },
  {
    name: "gateway",
    description: "Run, inspect, and query the WebSocket Gateway",
    hasSubcommands: true,
  },
  {
    name: "daemon",
    description: "Manage the Gateway service (launchd/systemd/schtasks)",
    hasSubcommands: true,
  },
  {
    name: "logs",
    description: "Tail gateway file logs via RPC",
    hasSubcommands: false,
  },
  {
    name: "system",
    description: "System tools (events, heartbeat, presence)",
    hasSubcommands: true,
  },
  {
    name: "models",
    description: "Model discovery, scanning, and configuration",
    hasSubcommands: true,
  },
  {
    name: "promos",
    description: "Discover and claim promotional model offers from ClawHub",
    hasSubcommands: true,
  },
  {
    name: "infer",
    description: "Run provider-backed inference commands through a stable CLI surface",
    hasSubcommands: true,
  },
  {
    name: "capability",
    description: "Run provider capability commands (fallback alias: infer)",
    hasSubcommands: true,
  },
  {
    name: "approvals",
    description: "Manage exec approvals (gateway or node host)",
    hasSubcommands: true,
    parentDefaultHelp: true,
  },
  {
    name: "exec-approvals",
    description: "Manage exec approvals (alias for approvals)",
    hasSubcommands: true,
  },
  {
    name: "exec-policy",
    description: "Show or synchronize requested exec policy with host approvals",
    hasSubcommands: true,
  },
  {
    name: "nodes",
    description: "Manage gateway-owned nodes (pairing, status, invoke, and media)",
    hasSubcommands: true,
  },
  {
    name: "devices",
    description: "Device pairing and auth tokens",
    hasSubcommands: true,
    parentDefaultHelp: true,
  },
  {
    name: "node",
    description: "Run and manage the headless node host service",
    hasSubcommands: true,
  },
  {
    name: "worker",
    description: "Run the restricted cloud worker runtime",
    hasSubcommands: false,
  },
  {
    name: "sandbox",
    description: "Manage sandbox containers (Docker-based agent isolation)",
    hasSubcommands: true,
  },
  {
    name: "fleet",
    description: "Provision and manage isolated tenant cells (experimental)",
    hasSubcommands: true,
  },
  {
    name: "worktrees",
    description: "Create, inspect, restore, and clean up managed worktrees",
    hasSubcommands: true,
    parentDefaultHelp: true,
  },
  {
    name: "attach",
    description: "Attach Claude Code to a gateway session with scoped MCP tools",
    hasSubcommands: false,
  },
  {
    name: "tui",
    description: "Open a terminal UI connected to the Gateway",
    hasSubcommands: false,
  },
  {
    name: "terminal",
    description: "Open a local terminal UI (alias for tui --local)",
    hasSubcommands: false,
  },
  {
    name: "chat",
    description: "Open a local terminal UI (alias for tui --local)",
    hasSubcommands: false,
  },
  {
    name: "cron",
    description: "Manage cron jobs (via Gateway)",
    hasSubcommands: true,
    parentDefaultHelp: true,
  },
  {
    name: "dns",
    description: "DNS helpers for wide-area discovery (Tailscale + CoreDNS)",
    hasSubcommands: true,
  },
  {
    name: "docs",
    description: "Search the live OpenClaw docs",
    hasSubcommands: false,
  },
  {
    name: "qa",
    description: "Run QA scenarios and launch the private QA debugger UI",
    hasSubcommands: true,
  },
  {
    name: "proxy",
    description: "Run the OpenClaw debug proxy and inspect captured traffic",
    hasSubcommands: true,
  },
  {
    name: "hooks",
    description: "Manage internal agent hooks",
    hasSubcommands: true,
  },
  {
    name: "webhooks",
    description: "Webhook helpers and integrations",
    hasSubcommands: true,
  },
  {
    name: "qr",
    description: "Generate a mobile pairing QR code and setup code",
    hasSubcommands: false,
  },
  {
    name: "clawbot",
    description: "Legacy clawbot command aliases",
    hasSubcommands: true,
  },
  {
    name: "pairing",
    description: "Secure DM pairing (approve inbound requests)",
    hasSubcommands: true,
  },
  {
    name: "plugins",
    description: "Manage OpenClaw plugins and extensions",
    hasSubcommands: true,
    parentDefaultHelp: true,
  },
  {
    name: "channels",
    description: "Manage connected chat channels and accounts",
    hasSubcommands: true,
    parentDefaultHelp: true,
  },
  {
    name: "directory",
    description: "Lookup contact and group IDs (self, peers, groups) for supported chat channels",
    hasSubcommands: true,
  },
  {
    name: "security",
    description: "Audit local config and state for common security foot-guns",
    hasSubcommands: true,
  },
  {
    name: "secrets",
    description: "Secrets runtime controls",
    hasSubcommands: true,
  },
  {
    name: "skills",
    description: "List and inspect available skills",
    hasSubcommands: true,
  },
  {
    name: "update",
    description: "Update OpenClaw and inspect update channel status",
    hasSubcommands: true,
  },
  {
    name: "completion",
    description: "Generate shell completion script",
    hasSubcommands: false,
  },
]);
function filterPrivateQaItems(items, getName) {
  if (isPrivateQaCliEnabled()) return items;
  return items.filter((item) => getName(item) !== "qa");
}
/** Visible sub-CLI descriptors after private QA gating. */
const SUB_CLI_DESCRIPTORS = filterPrivateQaItems(
  subCliCommandCatalog.descriptors,
  (descriptor) => descriptor.name,
);
/** Return visible sub-CLI descriptors in help/registration order. */
function getSubCliEntries() {
  return filterPrivateQaItems(
    subCliCommandCatalog.getDescriptors(),
    (descriptor) => descriptor.name,
  );
}
/** Return visible sub-CLI names that own child subcommands. */
function getSubCliCommandsWithSubcommands() {
  return [
    ...filterPrivateQaItems(
      subCliCommandCatalog.getCommandsWithSubcommands(),
      (command) => command,
    ),
  ];
}
/** Return visible sub-CLI names whose parent command should show help by default. */
function getSubCliParentDefaultHelpCommands() {
  return [
    ...filterPrivateQaItems(
      subCliCommandCatalog.getParentDefaultHelpCommands(),
      (command) => command,
    ),
  ];
}
//#endregion
//#region src/cli/argv.ts
const HELP_FLAGS = /* @__PURE__ */ new Set(["-h", "--help"]);
const VERSION_FLAGS = /* @__PURE__ */ new Set(["-V", "--version"]);
const ROOT_VERSION_ALIAS_FLAG = "-v";
const ROOT_COMMAND_DESCRIPTORS = [...CORE_CLI_COMMAND_DESCRIPTORS, ...SUB_CLI_DESCRIPTORS];
const KNOWN_ROOT_COMMANDS = new Set(ROOT_COMMAND_DESCRIPTORS.map((descriptor) => descriptor.name));
const ROOT_COMMANDS_WITH_SUBCOMMANDS = new Set(
  ROOT_COMMAND_DESCRIPTORS.filter((descriptor) => descriptor.hasSubcommands).map(
    (descriptor) => descriptor.name,
  ),
);
function isHelpOrVersionInvocation(argv) {
  if (hasRootVersionAlias(argv)) return true;
  const args = argv.slice(2);
  let sawCommandOption = false;
  const positionals = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg || arg === "--") break;
    const rootConsumed = consumeRootOptionToken(args, i);
    if (rootConsumed > 0) {
      i += rootConsumed - 1;
      continue;
    }
    if (HELP_FLAGS.has(arg) || VERSION_FLAGS.has(arg)) return true;
    if (arg.startsWith("-")) {
      sawCommandOption = true;
      continue;
    }
    positionals.push(arg);
    if (arg !== "help") continue;
    if (sawCommandOption) return false;
    if (positionals.length === 1) return true;
    const [primary] = positionals;
    if (!primary || !KNOWN_ROOT_COMMANDS.has(primary)) return true;
    if (positionals.length === 2 && ROOT_COMMANDS_WITH_SUBCOMMANDS.has(primary)) return true;
    return false;
  }
  return false;
}
function parsePositiveInt(value) {
  return parseStrictPositiveInteger(value);
}
function hasFlag(argv, name) {
  const args = argv.slice(2);
  for (const arg of args) {
    if (arg === "--") break;
    if (arg === name) return true;
  }
  return false;
}
function hasRootVersionAlias(argv) {
  const args = argv.slice(2);
  let hasAlias = false;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg) continue;
    if (arg === "--") break;
    if (arg === ROOT_VERSION_ALIAS_FLAG) {
      hasAlias = true;
      continue;
    }
    const consumed = consumeRootOptionToken(args, i);
    if (consumed > 0) {
      i += consumed - 1;
      continue;
    }
    if (arg.startsWith("-")) return false;
    return false;
  }
  return hasAlias;
}
function isRootVersionInvocation(argv) {
  return isRootInvocationForFlags(argv, VERSION_FLAGS, { includeVersionAlias: true });
}
function isRootInvocationForFlags(argv, targetFlags, options) {
  const args = argv.slice(2);
  let hasTarget = false;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg) continue;
    if (arg === "--") break;
    if (
      targetFlags.has(arg) ||
      (options?.includeVersionAlias === true && arg === ROOT_VERSION_ALIAS_FLAG)
    ) {
      hasTarget = true;
      continue;
    }
    const consumed = consumeRootOptionToken(args, i);
    if (consumed > 0) {
      i += consumed - 1;
      continue;
    }
    return false;
  }
  return hasTarget;
}
function isRootHelpInvocation(argv) {
  return isRootInvocationForFlags(argv, HELP_FLAGS);
}
function scanHelpNormalizationArgv(argv) {
  const positionals = [];
  const rootOptions = [];
  let helpFlagIndex = null;
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg || arg === "--") break;
    const consumed = consumeRootOptionToken(argv, index);
    if (consumed > 0) {
      rootOptions.push(...argv.slice(index, index + consumed));
      index += consumed - 1;
      continue;
    }
    if (HELP_FLAGS.has(arg)) {
      helpFlagIndex = index;
      continue;
    }
    if (arg.startsWith("-")) return { ok: false };
    positionals.push({
      value: arg,
      index,
    });
  }
  return {
    ok: true,
    positionals,
    rootOptions,
    helpFlagIndex,
  };
}
function normalizeGeneratedHelpCommandArgv(argv) {
  const scan = scanHelpNormalizationArgv(argv);
  if (!scan.ok) return argv;
  const { positionals, rootOptions, helpFlagIndex } = scan;
  const [primary, secondary, target] = positionals;
  if (
    !primary ||
    secondary?.value !== "help" ||
    (KNOWN_ROOT_COMMANDS.has(primary.value) && !ROOT_COMMANDS_WITH_SUBCOMMANDS.has(primary.value))
  )
    return argv;
  if (positionals.length === 2 && helpFlagIndex === secondary.index + 1)
    return argv.toSpliced(helpFlagIndex, 1);
  if (
    !target ||
    positionals.length !== 3 ||
    (helpFlagIndex !== null && helpFlagIndex !== target.index + 1)
  )
    return argv;
  const [runtimePath, entryPath] = argv;
  if (runtimePath === void 0 || entryPath === void 0) return argv;
  return [runtimePath, entryPath, ...rootOptions, primary.value, target.value, "--help"];
}
function normalizeRootHelpTargetArgv(argv) {
  const scan = scanHelpNormalizationArgv(argv);
  if (!scan.ok) return argv;
  const { positionals, rootOptions, helpFlagIndex } = scan;
  const [help, target] = positionals;
  const lastPositional = positionals.at(-1);
  if (
    help?.value !== "help" ||
    !target ||
    !lastPositional ||
    (helpFlagIndex !== null && helpFlagIndex !== lastPositional.index + 1)
  )
    return argv;
  const [runtimePath, entryPath] = argv;
  if (runtimePath === void 0 || entryPath === void 0) return argv;
  const targetPath = positionals.slice(1).map((positional) => positional.value);
  return [runtimePath, entryPath, ...rootOptions, ...targetPath, "--help"];
}
function isPossibleCommandOptionValue(remainingArgs, optionIndex) {
  const previous = remainingArgs[optionIndex - 1];
  if (!previous?.startsWith("-") || previous === "--") return false;
  return !previous.includes("=");
}
function consumeRootLogLevelToken(args, index) {
  const arg = args[index];
  if (!arg || arg === "--") return 0;
  if (arg.startsWith("--log-level=")) return arg.slice(12).trim() ? 1 : 0;
  if (arg === "--log-level") return isValueToken(args[index + 1]) ? 2 : 0;
  return 0;
}
function splitRootOptionPrefix(argv) {
  const prefix = argv.slice(0, 2);
  const args = argv.slice(2);
  let rootPrefixEnd = 0;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg || arg === "--") break;
    const consumed = consumeRootOptionToken(args, index);
    if (consumed <= 0) break;
    rootPrefixEnd = index + consumed;
    index += consumed - 1;
  }
  return {
    prefix,
    rootPrefix: args.slice(0, rootPrefixEnd),
    remainingArgs: args.slice(rootPrefixEnd),
  };
}
function normalizeRootNoColorArgv(argv, options = {}) {
  const { prefix, rootPrefix, remainingArgs } = splitRootOptionPrefix(argv);
  const movedNoColorArgs = [];
  const nextArgs = [];
  for (let index = 0; index < remainingArgs.length; index += 1) {
    const arg = remainingArgs.at(index);
    if (arg === void 0) break;
    if (arg === "--") {
      nextArgs.push(...remainingArgs.slice(index));
      break;
    }
    if (arg === "--no-color") {
      if (
        options.shouldPreserveNoColor?.({
          remainingArgs,
          noColorIndex: index,
        }) ??
        isPossibleCommandOptionValue(remainingArgs, index)
      ) {
        nextArgs.push(arg);
        continue;
      }
      movedNoColorArgs.push(arg);
      continue;
    }
    nextArgs.push(arg);
  }
  if (movedNoColorArgs.length === 0) return argv;
  return [...prefix, ...rootPrefix, ...movedNoColorArgs, ...nextArgs];
}
function normalizeRootLogLevelArgv(argv, options = {}) {
  const { prefix, rootPrefix, remainingArgs } = splitRootOptionPrefix(argv);
  const movedLogLevelArgs = [];
  const nextArgs = [];
  for (let index = 0; index < remainingArgs.length; index += 1) {
    const arg = remainingArgs.at(index);
    if (arg === void 0) break;
    if (arg === "--") {
      nextArgs.push(...remainingArgs.slice(index));
      break;
    }
    const consumed = consumeRootLogLevelToken(remainingArgs, index);
    if (consumed > 0) {
      const shouldPreserve =
        options.shouldPreserveLogLevel?.({
          remainingArgs,
          logLevelIndex: index,
          consumed,
        }) ?? isPossibleCommandOptionValue(remainingArgs, index);
      const tokens = remainingArgs.slice(index, index + consumed);
      if (shouldPreserve) nextArgs.push(...tokens);
      else movedLogLevelArgs.push(...tokens);
      index += consumed - 1;
      continue;
    }
    nextArgs.push(arg);
  }
  if (movedLogLevelArgs.length === 0) return argv;
  return [...prefix, ...rootPrefix, ...movedLogLevelArgs, ...nextArgs];
}
function getFlagValue(argv, name) {
  const args = argv.slice(2);
  let value;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args.at(i);
    if (arg === void 0) break;
    if (arg === "--") break;
    if (arg === name) {
      const next = args[i + 1];
      if (!isValueToken(next)) return null;
      value = next;
      i += 1;
      continue;
    }
    if (arg.startsWith(`${name}=`)) {
      const assigned = arg.slice(name.length + 1);
      if (!assigned) return null;
      value = assigned;
    }
  }
  return value;
}
function getVerboseFlag(argv, options) {
  if (hasFlag(argv, "--verbose")) return true;
  if (options?.includeDebug && hasFlag(argv, "--debug")) return true;
  return false;
}
function getPositiveIntFlagValue(argv, name) {
  const raw = getFlagValue(argv, name);
  if (raw === null || raw === void 0) return raw;
  return parsePositiveInt(raw) ?? null;
}
function getCommandPathWithRootOptions(argv, depth = 2) {
  return getCommandPathInternal(argv, depth, { skipRootOptions: true });
}
function getCommandPathInternal(argv, depth, opts) {
  const args = argv.slice(2);
  const path = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg) continue;
    if (arg === "--") break;
    if (opts.skipRootOptions) {
      const consumed = consumeRootOptionToken(args, i);
      if (consumed > 0) {
        i += consumed - 1;
        continue;
      }
    }
    if (arg.startsWith("-")) continue;
    path.push(arg);
    if (path.length >= depth) break;
  }
  return path;
}
function getPrimaryCommand(argv) {
  const [primary] = getCommandPathWithRootOptions(argv, 1);
  return primary ?? null;
}
function consumeKnownOptionToken(args, index, booleanFlags, valueFlags) {
  const arg = args[index];
  if (!arg || arg === "--" || !arg.startsWith("-")) return 0;
  const equalsIndex = arg.indexOf("=");
  const flag = equalsIndex === -1 ? arg : arg.slice(0, equalsIndex);
  if (booleanFlags.has(flag)) return equalsIndex === -1 ? 1 : 0;
  if (!valueFlags.has(flag)) return 0;
  if (equalsIndex !== -1) return arg.slice(equalsIndex + 1).trim() ? 1 : 0;
  return isValueToken(args[index + 1]) ? 2 : 0;
}
function getCommandPositionalsWithRootOptions(argv, options) {
  const args = argv.slice(2);
  const commandPath = options.commandPath;
  const booleanFlags = new Set(options.booleanFlags ?? []);
  const valueFlags = new Set(options.valueFlags ?? []);
  const positionals = [];
  let commandIndex = 0;
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg || arg === "--") break;
    const rootConsumed = consumeRootOptionToken(args, i);
    if (rootConsumed > 0) {
      i += rootConsumed - 1;
      continue;
    }
    if (arg.startsWith("-")) {
      const optionConsumed = consumeKnownOptionToken(args, i, booleanFlags, valueFlags);
      if (optionConsumed === 0) return null;
      i += optionConsumed - 1;
      continue;
    }
    if (commandIndex < commandPath.length) {
      if (arg !== commandPath[commandIndex]) return null;
      commandIndex += 1;
      continue;
    }
    positionals.push(arg);
  }
  if (commandIndex < commandPath.length) return null;
  return positionals;
}
function buildParseArgv(rawArgs, programName = "openclaw") {
  const normalizedArgv =
    rawArgs[0] === programName
      ? rawArgs.slice(1)
      : rawArgs[0]?.endsWith("openclaw")
        ? rawArgs.slice(1)
        : rawArgs;
  if (
    normalizedArgv.length >= 2 &&
    (isNodeRuntime(normalizedArgv[0] ?? "") || isBunRuntime(normalizedArgv[0] ?? ""))
  )
    return normalizedArgv;
  return ["node", programName, ...normalizedArgv];
}
function shouldMigrateStateFromPath(path) {
  if (path.length === 0) return true;
  const [primary, secondary] = path;
  if (primary === "health" || primary === "sessions") return false;
  if (primary === "update" && secondary === "status") return false;
  if (primary === "config" && (secondary === "get" || secondary === "unset")) return false;
  return true;
}
//#endregion
export {
  consumeRootOptionToken as A,
  getCoreCliCommandNames as C,
  collectUniqueCommandDescriptors as D,
  addCommandDescriptorsToProgram as E,
  isBunRuntime as M,
  isNodeRuntime as N,
  normalizeCommandDescriptorName as O,
  getCoreCliCommandDescriptors as S,
  getCoreCliParentDefaultHelpCommands as T,
  shouldMigrateStateFromPath as _,
  getPositiveIntFlagValue as a,
  getSubCliParentDefaultHelpCommands as b,
  hasFlag as c,
  isRootHelpInvocation as d,
  isRootVersionInvocation as f,
  normalizeRootNoColorArgv as g,
  normalizeRootLogLevelArgv as h,
  getFlagValue as i,
  isValueToken as j,
  sanitizeCommandDescriptorDescription as k,
  hasRootVersionAlias as l,
  normalizeRootHelpTargetArgv as m,
  getCommandPathWithRootOptions as n,
  getPrimaryCommand as o,
  normalizeGeneratedHelpCommandArgv as p,
  getCommandPositionalsWithRootOptions as r,
  getVerboseFlag as s,
  buildParseArgv as t,
  isHelpOrVersionInvocation as u,
  getSubCliCommandsWithSubcommands as v,
  getCoreCliCommandsWithSubcommands as w,
  loadPrivateQaCliModule as x,
  getSubCliEntries as y,
};
