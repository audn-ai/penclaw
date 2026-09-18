import { readFile, rm } from "node:fs/promises";
import "./config-mutation-FDl4lip6.js";
import { join } from "node:path";
import { t as mutateConfigFile } from "./config-BDv-QbJ6.js";
import { t as ReefChannelConfigSchema } from "./config-schema-DPAbXJqg.js";
import {
  l as resolveStateDir,
  o as generateAndStoreKeys,
  r as ReefTransportClient,
  s as loadKeys,
  t as ReefFriendManager,
  u as writePrivateJson,
  v as fingerprint,
} from "./friends-DaMmE29h.js";
import { n as getReefRuntime } from "./runtime-DDrbavBb.js";
//#region extensions/reef/src/cli.ts
const HANDLE_PATTERN = /^[a-z0-9][a-z0-9_-]{0,62}$/;
const GUARD_DEFAULTS = {
  openai: {
    pinnedModel: "gpt-5.6-terra",
    apiKeyEnv: "REEF_GUARD_OPENAI_KEY",
  },
  anthropic: {
    pinnedModel: "claude-haiku-4-5-20251001",
    apiKeyEnv: "REEF_GUARD_ANTHROPIC_KEY",
  },
};
function emit(output, payload, lines) {
  if (output.json) {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
    return;
  }
  for (const line of lines) process.stdout.write(`${line}\n`);
}
async function fail(output, message) {
  const stream = output.json ? process.stdout : process.stderr;
  const text = output.json ? `${JSON.stringify({ error: message })}\n` : `${message}\n`;
  await new Promise((resolve) => {
    stream.write(text, () => resolve());
  });
  process.exit(1);
}
function reefCliAction(run) {
  return async (...args) => {
    const optionsIndex = args.length - 2;
    const options = args[optionsIndex];
    const positional = args.slice(0, optionsIndex);
    const output = { json: options.json };
    try {
      await run(output, options, ...positional);
    } catch (error) {
      await fail(output, error instanceof Error ? error.message : String(error));
    }
  };
}
async function loadOrCreateKeys(stateDir, createMissing) {
  try {
    return await loadKeys(stateDir);
  } catch (error) {
    if (createMissing && error.code === "ENOENT") return await generateAndStoreKeys(stateDir);
    throw error;
  }
}
function currentReefConfig() {
  const raw = getReefRuntime().config.current().channels?.reef;
  if (!raw) return;
  const parsed = ReefChannelConfigSchema.safeParse(raw);
  return parsed.success ? parsed.data : void 0;
}
async function loadConfiguredManager(output) {
  const config = currentReefConfig();
  if (!config?.handle)
    return await fail(output, "Reef is not configured. Run `openclaw reef register` first.");
  const stateDir = resolveStateDir(config.stateDir);
  const keys = await loadOrCreateKeys(stateDir, false);
  return {
    config,
    keys,
    manager: new ReefFriendManager(
      config,
      new ReefTransportClient(config.relayUrl, config.handle, keys),
      stateDir,
    ),
  };
}
async function writeReefRegistration(candidate) {
  await mutateConfigFile({
    afterWrite: { mode: "auto" },
    mutate(draft) {
      const existing = draft.channels?.reef ?? {};
      const sameIdentity =
        existing.handle === candidate.handle &&
        existing.relayUrl === candidate.relayUrl &&
        resolveStateDir(existing.stateDir) === resolveStateDir(candidate.stateDir);
      draft.channels = {
        ...draft.channels,
        reef: {
          ...candidate,
          friends: sameIdentity ? (existing.friends ?? {}) : {},
          allowFrom: sameIdentity ? (existing.allowFrom ?? []) : [],
        },
      };
    },
  });
}
async function runRegister(output, options) {
  if (!options.email.includes("@")) return await fail(output, "A valid --email is required.");
  const provider = options.guardProvider;
  const guardDefaults = GUARD_DEFAULTS[provider];
  if (!guardDefaults)
    return await fail(output, "--guard-provider must be one of: anthropic, openai.");
  const stateDir = resolveStateDir(options.stateDir);
  const requestedHandle = options.handle?.toLowerCase();
  const identityPath = join(stateDir, "identity.json");
  const identity = await readFile(identityPath, "utf8").then(
    (raw) => JSON.parse(raw),
    () => void 0,
  );
  if (
    identity?.handle &&
    (identity.handle !== requestedHandle || identity.relayUrl !== options.relay)
  )
    return await fail(
      output,
      `This state dir already holds the identity @${identity.handle} on ${identity.relayUrl}. Re-register the same handle and relay, or pass a fresh --state-dir for a new identity.`,
    );
  const keys = await loadOrCreateKeys(stateDir, true);
  const bootstrap = new ReefTransportClient(options.relay, options.handle ?? "pending", keys);
  const sessionPath = join(stateDir, "setup-session.json");
  const stored = await readFile(sessionPath, "utf8").then(
    (raw) => JSON.parse(raw),
    () => void 0,
  );
  const token = options.token?.trim();
  const storedSession =
    !options.session?.trim() &&
    stored?.relayUrl === options.relay &&
    stored?.email === options.email
      ? stored.session
      : void 0;
  const session = options.session?.trim() || storedSession;
  if (!session && !token) {
    const started = await bootstrap.authStart(options.email);
    emit(
      output,
      {
        status: "email_sent",
        email: options.email,
        ...(started.magicLink ? { magicLink: started.magicLink } : {}),
        next: "Open the magic link, copy the token from the URL fragment, then rerun the exact same command with --token <token> added (or --session from the welcome page).",
      },
      [
        `Sign-in link sent to ${options.email}.`,
        ...(started.magicLink ? [`Development magic link: ${started.magicLink}`] : []),
        "Open the link, copy the token from the URL fragment, then rerun the exact",
        "same command with --token <token> added.",
      ],
    );
    return;
  }
  const handle = options.handle?.toLowerCase();
  if (!handle || !HANDLE_PATTERN.test(handle))
    return await fail(output, "A valid --handle is required (lowercase letters, digits, - or _).");
  const guard = {
    provider,
    pinnedModel: options.guardModel ?? guardDefaults.pinnedModel,
    apiKeyEnv: options.guardEnv ?? guardDefaults.apiKeyEnv,
    policyVersion: options.guardPolicy,
    timeoutMs: 3e4,
  };
  const provisional = {
    enabled: true,
    relayUrl: options.relay,
    handle,
    email: options.email,
    requestPolicy: options.policy,
    stateDir,
    friends: {},
    dmPolicy: "pairing",
    allowFrom: [],
    guard,
  };
  ReefChannelConfigSchema.parse(provisional);
  let resolvedSession = session;
  if (!resolvedSession) {
    resolvedSession = (await bootstrap.authComplete(token ?? "")).session;
    await writePrivateJson(sessionPath, {
      session: resolvedSession,
      relayUrl: options.relay,
      email: options.email,
    });
  }
  const transport = new ReefTransportClient(options.relay, handle, keys);
  let effectivePolicy = options.policy;
  try {
    await transport.createHandle(resolvedSession, options.policy);
  } catch (error) {
    if (
      !(
        error instanceof Error &&
        error.message.includes("handle_unavailable") &&
        (await transport.listFriends().then(
          () => true,
          () => false,
        ))
      )
    )
      throw error;
    const { handles } = await transport.listOwnHandles(resolvedSession);
    const existingHandle = handles.find((entry) => entry.handle === handle);
    if (!existingHandle)
      return await fail(
        output,
        `Handle @${handle} is owned by this claw's keys, but the supplied session belongs to a different relay account. Use a session for the account that registered the handle.`,
      );
    effectivePolicy = existingHandle.request_policy;
  }
  const candidate = ReefChannelConfigSchema.parse({
    ...provisional,
    requestPolicy: effectivePolicy,
  });
  try {
    await writeReefRegistration(candidate);
  } catch (error) {
    await fail(
      output,
      `Handle @${handle} is claimed, but writing the local config failed: ${error instanceof Error ? error.message : String(error)}. Fix the local issue and rerun the exact same command — the retry reuses the stored session and recognizes the existing claim.`,
    );
  }
  await writePrivateJson(identityPath, {
    handle,
    relayUrl: options.relay,
  });
  await rm(sessionPath, { force: true });
  const printed = fingerprint(keys.signing.publicKey, keys.encryption.publicKey);
  emit(
    output,
    {
      status: "registered",
      handle,
      relayUrl: options.relay,
      stateDir,
      fingerprint: printed,
    },
    [
      `Registered @${handle} on ${options.relay}.`,
      `Safety fingerprint (share out of band): ${printed}`,
      "Restart the gateway to connect: openclaw gateway restart",
    ],
  );
}
function registerReefCli({ program }) {
  const reef = program
    .command("reef")
    .description("Register on a Reef relay and manage guarded claw-to-claw friendships");
  reef
    .command("register")
    .description("Claim a handle and configure the Reef channel without the wizard")
    .requiredOption("--email <email>", "Owner email registered with the relay")
    .option("--handle <handle>", "Unlisted handle for this claw")
    .option("--session <session>", "Setup session from the relay welcome page")
    .option("--token <token>", "Magic-link token to exchange for a session")
    .option("--relay <url>", "Relay URL", "https://reefwire.ai")
    .option("--policy <policy>", "Inbound friend-request policy", "code-only")
    .option("--state-dir <dir>", "Local key/state directory")
    .option("--guard-provider <provider>", "Guard provider (anthropic|openai)", "openai")
    .option("--guard-model <model>", "Immutable guard model id (default depends on provider)")
    .option("--guard-env <name>", "Env var holding the guard API key (default depends on provider)")
    .option("--guard-policy <version>", "Guard policy version", "reef-v1")
    .option("--json", "Emit JSON", false)
    .action(reefCliAction(runRegister));
  reef
    .command("status")
    .description("Show Reef configuration and relay-side friendships")
    .option("--json", "Emit JSON", false)
    .action(
      reefCliAction(async (output) => {
        const { config, keys, manager } = await loadConfiguredManager(output);
        const friends = await manager.list();
        const printed = fingerprint(keys.signing.publicKey, keys.encryption.publicKey);
        emit(
          output,
          {
            handle: config.handle,
            relayUrl: config.relayUrl,
            requestPolicy: config.requestPolicy,
            guard: {
              provider: config.guard?.provider,
              pinnedModel: config.guard?.pinnedModel,
            },
            fingerprint: printed,
            friends: friends.map((friend) => ({
              peer: friend.peer,
              status: friend.status,
              autonomy: friend.autonomy ?? null,
              fingerprint: friend.fingerprint,
            })),
          },
          [
            `@${config.handle} on ${config.relayUrl} (policy ${config.requestPolicy})`,
            `Guard: ${config.guard?.provider}/${config.guard?.pinnedModel}`,
            `Fingerprint: ${printed}`,
            ...friends.map(
              (friend) =>
                `- @${friend.peer}: ${friend.status}${friend.autonomy ? ` (${friend.autonomy})` : ""}`,
            ),
            ...(friends.length === 0 ? ["No friendships yet."] : []),
          ],
        );
      }),
    );
  const friend = reef.command("friend").description("Manage Reef friendships");
  friend
    .command("code")
    .description("Mint a short-lived code a friend can use to request pairing")
    .option("--json", "Emit JSON", false)
    .action(
      reefCliAction(async (output) => {
        const { manager } = await loadConfiguredManager(output);
        const minted = await manager.mintCode();
        const expires = /* @__PURE__ */ new Date(minted.expires * 1e3).toISOString();
        emit(
          output,
          {
            code: minted.code,
            expires,
          },
          [`Friend code: ${minted.code} (expires ${expires})`],
        );
      }),
    );
  friend
    .command("request <handle>")
    .description("Request a friendship (adopted automatically once accepted)")
    .option("--code <code>", "Friend code minted by the recipient")
    .option("--json", "Emit JSON", false)
    .action(
      reefCliAction(async (output, options, handle) => {
        const { manager } = await loadConfiguredManager(output);
        const peer = handle.replace(/^@/, "").toLowerCase();
        const result = await manager.request(peer, options.code);
        emit(
          output,
          {
            peer,
            status: result.status,
          },
          [
            `Friend request to @${peer}: ${result.status}. Adopted automatically once the peer accepts.`,
          ],
        );
      }),
    );
  friend
    .command("list")
    .description("List relay-side friendships with local autonomy")
    .option("--json", "Emit JSON", false)
    .action(
      reefCliAction(async (output) => {
        const { manager } = await loadConfiguredManager(output);
        const friends = await manager.list();
        emit(
          output,
          {
            friends: friends.map((entry) => ({
              peer: entry.peer,
              status: entry.status,
              autonomy: entry.autonomy ?? null,
              keyEpoch: entry.key_epoch,
              fingerprint: entry.fingerprint,
            })),
          },
          friends.length
            ? friends.map(
                (entry) =>
                  `@${entry.peer} ${entry.status} epoch=${entry.key_epoch} fingerprint=${entry.fingerprint}${entry.autonomy ? ` autonomy=${entry.autonomy}` : ""}`,
              )
            : ["No friendships yet."],
        );
      }),
    );
  friend
    .command("remove <handle>")
    .description("Remove or block a friendship")
    .option("--json", "Emit JSON", false)
    .action(
      reefCliAction(async (output, _options, handle) => {
        const { manager } = await loadConfiguredManager(output);
        const peer = handle.replace(/^@/, "").toLowerCase();
        await manager.remove(peer);
        await mutateConfigFile({
          afterWrite: { mode: "auto" },
          mutate(draft) {
            const reefDraft = draft.channels?.reef;
            if (reefDraft?.friends) delete reefDraft.friends[peer];
            if (Array.isArray(reefDraft?.allowFrom))
              reefDraft.allowFrom = reefDraft.allowFrom.filter(
                (entry) => String(entry).replace(/^@/, "").toLowerCase() !== peer,
              );
          },
        });
        emit(
          output,
          {
            peer,
            status: "removed",
          },
          [`Removed @${peer}.`],
        );
      }),
    );
}
//#endregion
export { registerReefCli };
