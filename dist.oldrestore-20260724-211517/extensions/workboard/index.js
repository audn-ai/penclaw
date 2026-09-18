import { Type } from "typebox";
import { t as resolveWorkboardCardByIdOrPrefix } from "../../card-lookup-BoXKYGHH.js";
import { y as readStringParam } from "../../common-DyDSUect.js";
import "../../security-runtime-CraX8Pqe.js";
import { t as definePluginEntry } from "../../plugin-entry-DzBhXPVE.js";
import "../../core-V3U0lOIj.js";
import "../../api-BhBBRVgX.js";
import {
  a as WORKBOARD_TOOL_NAMES,
  c as resolveAgentWorkboardWorkspaceRuntime,
  i as cleanupWorkboardRunWorktree,
  l as resolveCommandWorkboardWorkspaceAccess,
  n as dispatchAndStartWorkboardCards,
  o as canonicalizeWorkboardWorkspaceAccess,
  r as WorkboardStore,
  s as guardWorkboardToolsForWorkspaceAccess,
  t as registerWorkboardGatewayMethods,
  u as resolveWorkboardAgentWorkspace,
} from "../../runtime-api-5qPGxPSK.js";
import { t as safeEqualSecret } from "../../secret-equal-DRsL8lKD.js";
import { f as WORKBOARD_STATUSES } from "../../src-CpFrZXrA.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
//#region extensions/workboard/src/command.ts
const ADMIN_SCOPE = "operator.admin";
const WRITE_SCOPE = "operator.write";
function splitArgs(input) {
  return (input ?? "").trim().split(/\s+/).filter(Boolean);
}
function formatCardLine(card) {
  const boardId = card.metadata?.automation?.boardId ?? "default";
  const agent = card.agentId ? ` @${card.agentId}` : "";
  return `${card.id.slice(0, 8)} ${card.status.padEnd(8)} ${card.priority.padEnd(6)} [${boardId}]${agent} ${card.title}`;
}
function formatCardDetails(card) {
  const lines = [
    card.title,
    `id: ${card.id}`,
    `status: ${card.status}`,
    `priority: ${card.priority}`,
    `board: ${card.metadata?.automation?.boardId ?? "default"}`,
  ];
  if (card.agentId) lines.push(`agent: ${card.agentId}`);
  if (card.sessionKey) lines.push(`session: ${card.sessionKey}`);
  if (card.runId) lines.push(`run: ${card.runId}`);
  if (card.notes) lines.push("", card.notes);
  return lines.join("\n");
}
function normalizeTitle(tokens) {
  return tokens.join(" ").trim();
}
function isWorkboardStatus(value) {
  return WORKBOARD_STATUSES.includes(value);
}
function canMutateWorkboard(params) {
  const scopes = params.gatewayClientScopes;
  if (scopes) return scopes.includes(ADMIN_SCOPE) || scopes.includes(WRITE_SCOPE);
  return params.senderIsOwner === true;
}
function requireWriteAccess(params) {
  if (canMutateWorkboard(params)) return;
  return {
    text: `This command requires gateway scope: ${WRITE_SCOPE}.`,
    isError: true,
  };
}
async function handleWorkboardCommand(params) {
  const [action = "list", ...rest] = splitArgs(params.args);
  if (action === "help")
    return {
      text: [
        "/workboard list",
        "/workboard show <card-id>",
        "/workboard create <title>",
        "/workboard move <card-id> --status <status>",
        "/workboard dispatch",
      ].join("\n"),
    };
  if (action === "list") {
    const rows = (await params.store.list())
      .filter((card) => !card.metadata?.archivedAt)
      .slice(0, 12)
      .map(formatCardLine);
    return { text: rows.length ? rows.join("\n") : "No Workboard cards." };
  }
  if (action === "show" || action === "read") {
    const id = rest[0];
    if (!id)
      return {
        text: "Usage: /workboard show <card-id>",
        isError: true,
      };
    const { card, error } = resolveWorkboardCardByIdOrPrefix(await params.store.list(), id);
    return card
      ? { text: formatCardDetails(card) }
      : {
          text: error,
          isError: true,
        };
  }
  if (action === "create") {
    const accessError = requireWriteAccess(params);
    if (accessError) return accessError;
    const title = normalizeTitle(rest);
    if (!title)
      return {
        text: "Usage: /workboard create <title>",
        isError: true,
      };
    const workspaceAccess = await canonicalizeWorkboardWorkspaceAccess(
      params.workspaceAccess ?? { unrestricted: true },
    );
    const card = await params.store.create({
      title,
      workspaceAccess,
    });
    return { text: `Created ${card.id.slice(0, 8)} ${card.title}` };
  }
  if (action === "move") {
    const accessError = requireWriteAccess(params);
    if (accessError) return accessError;
    const id = rest[0];
    const statusIndex = rest.indexOf("--status");
    const status = statusIndex >= 0 ? rest[statusIndex + 1] : void 0;
    if (!id || !status)
      return {
        text: "Usage: /workboard move <card-id> --status <status>",
        isError: true,
      };
    if (!isWorkboardStatus(status))
      return {
        text: `status must be one of: ${WORKBOARD_STATUSES.join(", ")}.`,
        isError: true,
      };
    const { card, error } = resolveWorkboardCardByIdOrPrefix(await params.store.list(), id);
    if (!card)
      return {
        text: error,
        isError: true,
      };
    return { text: formatCardLine(await params.store.move(card.id, status, void 0)) };
  }
  if (action === "dispatch") {
    const accessError = requireWriteAccess(params);
    if (accessError) return accessError;
    const workspaceAccess = params.workspaceAccess ?? { unrestricted: true };
    const result = await dispatchAndStartWorkboardCards({
      store: params.store,
      subagent: params.api.runtime.subagent,
      worktrees: params.api.runtime.worktrees,
      options: {
        materializeWorktree: true,
        resolveAgentWorkspace: params.resolveAgentWorkspace,
        resolveAgentWorkspaceRuntime: params.resolveAgentWorkspaceRuntime,
        workspaceAccess,
      },
    });
    return {
      text: [
        `dispatch: started=${result.started.length} failures=${result.startFailures.length} promoted=${result.promoted.length} blocked=${result.blocked.length}`,
        ...result.started.map((run) => `started ${run.cardId.slice(0, 8)} run=${run.runId}`),
        ...result.startFailures.map(
          (failure) => `failed ${failure.cardId.slice(0, 8)} ${failure.error}`,
        ),
      ].join("\n"),
    };
  }
  return {
    text: `Unknown Workboard action: ${action}`,
    isError: true,
  };
}
function registerWorkboardCommand(params) {
  params.api.registerCommand({
    name: "workboard",
    description: "List, create, inspect, and dispatch Workboard cards.",
    acceptsArgs: true,
    exposeSenderIsOwner: true,
    handler: async (ctx) =>
      await handleWorkboardCommand({
        api: params.api,
        store: params.store,
        args: ctx.args,
        senderIsOwner: ctx.senderIsOwner,
        gatewayClientScopes: ctx.gatewayClientScopes,
        resolveAgentWorkspace: (agentId) => resolveWorkboardAgentWorkspace(ctx.config, agentId),
        resolveAgentWorkspaceRuntime: (agentId, sessionKey, workspaceDir, modelProvider, modelId) =>
          resolveAgentWorkboardWorkspaceRuntime({
            config: ctx.config,
            agentId,
            sessionKey,
            workspaceDir,
            modelProvider,
            modelId,
            prepareSandboxWorkspaceAuthority: params.api.runtime.sandbox.prepareWorkspaceAuthority,
          }),
        workspaceAccess: resolveCommandWorkboardWorkspaceAccess({
          config: ctx.config,
          agentId: ctx.agentId,
          sessionKey: ctx.sessionKey,
          gatewayClientScopes: ctx.gatewayClientScopes,
          resolveSandboxWorkspaceAuthority: params.api.runtime.sandbox.resolveWorkspaceAuthority,
        }),
      }),
  });
}
//#endregion
//#region extensions/workboard/src/tools-card-mutations.ts
const ClaimTokenFieldName = "token";
function cardIdField() {
  return Type.String({ description: "Workboard card id." });
}
function claimTokenField(description = "Claim token returned by workboard_claim.") {
  return Type.Optional(Type.String({ description }));
}
function createWorkboardMoveTool(params) {
  return {
    name: "workboard_move",
    label: "Workboard Move",
    description:
      "Move a Workboard card to another status. Claimed cards require matching claim scope.",
    parameters: Type.Object(
      {
        id: cardIdField(),
        status: Type.Union(
          WORKBOARD_STATUSES.map((status) => Type.Literal(status)),
          { description: "Target Workboard status." },
        ),
        [ClaimTokenFieldName]: claimTokenField("Claim token for claimed cards."),
      },
      { additionalProperties: false },
    ),
    execute: async (_toolCallId, rawParams) => {
      const { record, id, scope } = await params.readScopedCardToolParams(rawParams);
      return params.redactedCardResult(await params.store.move(id, record.status, void 0, scope));
    },
  };
}
//#endregion
//#region extensions/workboard/src/tools.ts
function contextOwner(ctx) {
  const record = ctx ?? {};
  return (
    (typeof record.agentId === "string" && record.agentId) ||
    (typeof record.sessionKey === "string" && record.sessionKey) ||
    (typeof record.sessionId === "string" && record.sessionId) ||
    "agent"
  );
}
function canMutateCard(card, ownerId, token) {
  const claim = card.metadata?.claim;
  return !claim || claim.ownerId === ownerId || safeEqualSecret(token, claim.token);
}
function readParentIds(value) {
  if (value == null) return [];
  const entries =
    typeof value === "string" ? value.split(",") : Array.isArray(value) ? value : void 0;
  if (!entries) throw new Error("parents must be an array or comma-separated string.");
  const parents = [];
  for (const entry of entries) {
    if (typeof entry !== "string") throw new Error("parents must contain only strings.");
    const parent = entry.trim();
    if (!parent || parents.includes(parent)) continue;
    if (parent.length > 120) throw new Error("parents must be 120 characters or fewer.");
    parents.push(parent);
    if (parents.length >= 20) break;
  }
  return parents;
}
async function requireScopedCard(store, cardId, ownerId, token) {
  const card = await store.get(cardId);
  if (!card) throw new Error(`card not found: ${cardId}`);
  if (!canMutateCard(card, ownerId, token))
    throw new Error(`card is claimed by ${card.metadata?.claim?.ownerId ?? "another agent"}.`);
  return card;
}
async function requireClaimedCard(store, cardId, ownerId, token) {
  const card = await requireScopedCard(store, cardId, ownerId, token);
  if (!card.metadata?.claim) throw new Error("card must be claimed before lifecycle completion.");
  return card;
}
function summarizeCard(card) {
  return {
    id: card.id,
    title: card.title,
    status: card.status,
    priority: card.priority,
    agentId: card.agentId,
    tenant: card.metadata?.automation?.tenant,
    boardId: card.metadata?.automation?.boardId ?? "default",
    parents: card.metadata?.links
      ?.filter((link) => link.type === "parent" && link.targetCardId)
      .map((link) => link.targetCardId),
    children: card.metadata?.links
      ?.filter((link) => link.type === "child" && link.targetCardId)
      .map((link) => link.targetCardId),
    claim: card.metadata?.claim
      ? {
          ownerId: card.metadata.claim.ownerId,
          claimedAt: card.metadata.claim.claimedAt,
          lastHeartbeatAt: card.metadata.claim.lastHeartbeatAt,
          expiresAt: card.metadata.claim.expiresAt,
        }
      : void 0,
    diagnostics: card.metadata?.diagnostics,
    archivedAt: card.metadata?.archivedAt,
    updatedAt: card.updatedAt,
  };
}
function redactClaimToken(card) {
  const claim = card.metadata?.claim;
  if (!claim) return card;
  return {
    ...card,
    metadata: {
      ...card.metadata,
      claim: {
        ...claim,
        token: "[redacted]",
      },
    },
  };
}
const ScopedClaimTokenField = claimTokenField("Claim token for claimed cards.");
const OptionalNextStatusField = Type.Optional(
  Type.String({ description: "Optional next status." }),
);
const OptionalOperatorNoteField = Type.Optional(
  Type.String({ description: "Optional operator note." }),
);
function readCardToolParams(rawParams, ownerId) {
  const record = rawParams;
  const id = readStringParam(record, "id", { required: true });
  const token = record.token;
  return {
    record,
    id,
    token,
    scope: {
      ownerId,
      token,
    },
  };
}
function redactedCardResult(card) {
  return jsonResult({ card: redactClaimToken(card) });
}
function redactedRawCardResult(card) {
  return jsonResult(redactClaimToken(card));
}
const CardIdSchema = Type.Object(
  {
    id: cardIdField(),
    token: claimTokenField(),
  },
  { additionalProperties: false },
);
function createWorkboardTools(params) {
  const store = params.store ?? WorkboardStore.openSqlite();
  const ownerId = contextOwner(params.context);
  const readScopedCardToolParams = async (rawParams) => {
    const input = readCardToolParams(rawParams, ownerId);
    await requireScopedCard(store, input.id, ownerId, input.token);
    return input;
  };
  const readClaimedCardToolParams = async (rawParams) => {
    const input = readCardToolParams(rawParams, ownerId);
    await requireClaimedCard(store, input.id, ownerId, input.token);
    return input;
  };
  const runCardMutation = async (rawParams, readParams, mutate) => {
    const { record, id, scope } = await readParams(rawParams);
    return redactedCardResult(await mutate(id, record, scope));
  };
  const runScopedCardMutation = (rawParams, mutate) =>
    runCardMutation(rawParams, readScopedCardToolParams, mutate);
  const runClaimedCardMutation = (rawParams, mutate) =>
    runCardMutation(rawParams, readClaimedCardToolParams, mutate);
  return [
    {
      name: "workboard_list",
      label: "Workboard List",
      description:
        "List Workboard cards with compact claim and diagnostic state. Use before choosing or routing board work.",
      parameters: Type.Object(
        {
          status: Type.Optional(Type.String({ description: "Optional card status filter." })),
          agentId: Type.Optional(Type.String({ description: "Optional agent id filter." })),
          tenant: Type.Optional(Type.String({ description: "Optional tenant filter." })),
          boardId: Type.Optional(Type.String({ description: "Optional board id filter." })),
          limit: Type.Optional(
            Type.Number({ description: "Maximum cards to return. Default 50." }),
          ),
          refreshDiagnostics: Type.Optional(
            Type.Boolean({ description: "Refresh stored diagnostics before listing." }),
          ),
          includeArchived: Type.Optional(
            Type.Boolean({ description: "Include archived cards. Default false." }),
          ),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = rawParams;
        if (record.refreshDiagnostics === true) await store.refreshDiagnostics();
        const status = typeof record.status === "string" ? record.status : void 0;
        const agentId = typeof record.agentId === "string" ? record.agentId : void 0;
        const tenant = typeof record.tenant === "string" ? record.tenant : void 0;
        const boardId = typeof record.boardId === "string" ? record.boardId : void 0;
        const limit =
          typeof record.limit === "number" && Number.isFinite(record.limit)
            ? Math.max(1, Math.min(200, Math.trunc(record.limit)))
            : 50;
        return jsonResult({
          cards: (await store.list({ boardId }))
            .filter((card) => record.includeArchived === true || !card.metadata?.archivedAt)
            .filter((card) => !status || card.status === status)
            .filter((card) => !agentId || card.agentId === agentId)
            .filter((card) => !tenant || card.metadata?.automation?.tenant === tenant)
            .slice(0, limit)
            .map(summarizeCard),
        });
      },
    },
    {
      name: "workboard_create",
      label: "Workboard Create",
      description:
        "Create a Workboard card, optionally with parent dependencies, tenant, skills, workspace, and idempotency key.",
      parameters: Type.Object(
        {
          title: Type.String({ description: "Card title." }),
          notes: Type.Optional(Type.String({ description: "Card notes or acceptance criteria." })),
          status: Type.Optional(Type.String({ description: "Initial status." })),
          priority: Type.Optional(Type.String({ description: "low, normal, high, or urgent." })),
          labels: Type.Optional(Type.Array(Type.String(), { description: "Card labels." })),
          agentId: Type.Optional(Type.String({ description: "Assigned agent id." })),
          parents: Type.Optional(Type.Array(Type.String(), { description: "Parent card ids." })),
          token: Type.Optional(
            Type.String({ description: "Claim token for claimed parent cards." }),
          ),
          tenant: Type.Optional(Type.String({ description: "Soft tenant namespace." })),
          boardId: Type.Optional(Type.String({ description: "Soft board namespace." })),
          createdByCardId: Type.Optional(
            Type.String({ description: "Parent card that created this card." }),
          ),
          idempotencyKey: Type.Optional(Type.String({ description: "Idempotent create key." })),
          skills: Type.Optional(Type.Array(Type.String(), { description: "Suggested skills." })),
          workspace: Type.Optional(
            Type.Object(
              {
                kind: Type.String({ description: "scratch, dir, or worktree." }),
                path: Type.Optional(Type.String({ description: "Absolute dir/worktree path." })),
                branch: Type.Optional(Type.String({ description: "Suggested branch." })),
              },
              { additionalProperties: false },
            ),
          ),
          maxRuntimeSeconds: Type.Optional(Type.Number({ description: "Run timeout seconds." })),
          maxRetries: Type.Optional(Type.Number({ description: "Retry budget." })),
          scheduledAt: Type.Optional(Type.Number({ description: "Unix epoch milliseconds." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = rawParams;
        readParentIds(record.parents);
        return jsonResult({
          card: redactClaimToken(
            await store.create(record, {
              ownerId,
              token: record.token,
            }),
          ),
        });
      },
    },
    {
      name: "workboard_link",
      label: "Workboard Link",
      description:
        "Link a parent card to a child card so the child becomes ready only after parents are done.",
      parameters: Type.Object(
        {
          parentId: Type.String({ description: "Parent card id." }),
          childId: Type.String({ description: "Child card id." }),
          token: Type.Optional(
            Type.String({ description: "Claim token for claimed parent or child cards." }),
          ),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = rawParams;
        const parentId = readStringParam(record, "parentId", { required: true });
        const childId = readStringParam(record, "childId", { required: true });
        const token = record.token;
        return jsonResult({
          card: redactClaimToken(
            await store.linkCards(parentId, childId, {
              ownerId,
              token,
            }),
          ),
        });
      },
    },
    {
      name: "workboard_read",
      label: "Workboard Read",
      description:
        "Read one Workboard card and return bounded worker context with notes, attempts, comments, proof, links, and diagnostics.",
      parameters: CardIdSchema,
      execute: async (_toolCallId, rawParams) => {
        const id = readStringParam(rawParams, "id", { required: true });
        const card = await store.get(id);
        if (!card) throw new Error(`card not found: ${id}`);
        return jsonResult({
          card: redactClaimToken(card),
          workerContext: await store.buildWorkerContext(id),
        });
      },
    },
    {
      name: "workboard_claim",
      label: "Workboard Claim",
      description:
        "Claim a Workboard card for this agent and move backlog/todo cards into running. Returns a claim token for heartbeats and release.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          ttlSeconds: Type.Optional(Type.Number({ description: "Claim TTL in seconds." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = rawParams;
        const id = readStringParam(record, "id", { required: true });
        const claimed = await store.claim(id, {
          ownerId,
          ttlSeconds: record.ttlSeconds,
        });
        return jsonResult({
          ...claimed,
          card: redactClaimToken(claimed.card),
        });
      },
    },
    {
      name: "workboard_heartbeat",
      label: "Workboard Heartbeat",
      description:
        "Refresh this agent's Workboard claim heartbeat. Use during long-running card work so diagnostics do not mark it stale.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          token: claimTokenField(),
          note: Type.Optional(Type.String({ description: "Optional compact progress note." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const { record, id, scope } = await readScopedCardToolParams(rawParams);
        return redactedRawCardResult(
          await store.heartbeat(id, {
            ...scope,
            note: record.note,
          }),
        );
      },
    },
    {
      name: "workboard_release",
      label: "Workboard Release",
      description:
        "Release this agent's Workboard claim after finishing, pausing, or handing off card work.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          token: claimTokenField(),
          status: Type.Optional(
            Type.String({ description: "Optional next card status after release." }),
          ),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const { record, id, scope } = await readScopedCardToolParams(rawParams);
        return redactedRawCardResult(
          await store.releaseClaim(id, {
            ...scope,
            status: record.status,
          }),
        );
      },
    },
    {
      name: "workboard_comment",
      label: "Workboard Comment",
      description: "Append a compact comment to a Workboard card.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          body: Type.String({ description: "Comment body." }),
          token: ScopedClaimTokenField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const { record, id, scope } = await readScopedCardToolParams(rawParams);
        return redactedRawCardResult(await store.addComment(id, { body: record.body }, scope));
      },
    },
    {
      name: "workboard_proof",
      label: "Workboard Proof",
      description:
        "Attach proof or artifact metadata to a Workboard card after running tests, checks, or producing screenshots/logs.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          status: Type.Optional(
            Type.String({ description: "passed, failed, skipped, or unknown." }),
          ),
          label: Type.Optional(Type.String({ description: "Proof label." })),
          command: Type.Optional(Type.String({ description: "Command or exact step run." })),
          url: Type.Optional(Type.String({ description: "Proof or artifact URL." })),
          note: Type.Optional(Type.String({ description: "Short proof note." })),
          artifactPath: Type.Optional(
            Type.String({ description: "Optional local artifact path." }),
          ),
          token: ScopedClaimTokenField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const { record, id, scope } = await readScopedCardToolParams(rawParams);
        return redactedCardResult(
          (typeof record.artifactPath === "string" && record.artifactPath.trim() !== "") ||
            (typeof record.url === "string" && record.url.trim() !== "")
            ? await store.addProofWithArtifact(
                id,
                record,
                {
                  label: record.label,
                  path: record.artifactPath,
                  url: record.url,
                },
                scope,
              )
            : await store.addProof(id, record, scope),
        );
      },
    },
    {
      name: "workboard_complete",
      label: "Workboard Complete",
      description:
        "Complete a claimed Workboard card with a structured summary, proof, artifacts, and created-card manifest.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          token: claimTokenField(),
          summary: Type.Optional(Type.String({ description: "Completion summary." })),
          proof: Type.Optional(
            Type.Object(
              {
                status: Type.Optional(
                  Type.String({ description: "passed, failed, skipped, or unknown." }),
                ),
                label: Type.Optional(Type.String({ description: "Proof label." })),
                command: Type.Optional(Type.String({ description: "Command or step run." })),
                url: Type.Optional(Type.String({ description: "Proof URL." })),
                note: Type.Optional(Type.String({ description: "Proof note." })),
              },
              { additionalProperties: false },
            ),
          ),
          artifacts: Type.Optional(
            Type.Array(
              Type.Object(
                {
                  label: Type.Optional(Type.String()),
                  url: Type.Optional(Type.String()),
                  path: Type.Optional(Type.String()),
                  mimeType: Type.Optional(Type.String()),
                },
                { additionalProperties: false },
              ),
            ),
          ),
          createdCardIds: Type.Optional(
            Type.Array(Type.String(), { description: "Cards created during this run." }),
          ),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        return runClaimedCardMutation(rawParams, (id, record, scope) =>
          store.complete(id, record, scope),
        );
      },
    },
    {
      name: "workboard_attachment_add",
      label: "Workboard Attachment Add",
      description:
        "Store a small Workboard attachment in plugin SQLite KV and link it to the card.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          fileName: Type.String({ description: "Attachment file name." }),
          contentBase64: Type.String({ description: "Base64 attachment content." }),
          mimeType: Type.Optional(Type.String({ description: "Attachment MIME type." })),
          note: Type.Optional(Type.String({ description: "Optional attachment note." })),
          token: ScopedClaimTokenField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const { record, id, scope } = await readScopedCardToolParams(rawParams);
        return redactedCardResult(await store.addAttachment(id, record, scope));
      },
    },
    {
      name: "workboard_attachment_read",
      label: "Workboard Attachment Read",
      description: "Read one Workboard attachment from plugin SQLite KV.",
      parameters: Type.Object(
        { id: Type.String({ description: "Attachment id." }) },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const id = readStringParam(rawParams, "id", { required: true });
        const attachment = await store.getAttachment(id);
        if (!attachment) throw new Error(`attachment not found: ${id}`);
        return jsonResult(attachment);
      },
    },
    {
      name: "workboard_attachment_delete",
      label: "Workboard Attachment Delete",
      description: "Delete one Workboard attachment from plugin SQLite KV and the card index.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          attachmentId: Type.String({ description: "Attachment id." }),
          token: ScopedClaimTokenField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const { record, id, scope } = await readScopedCardToolParams(rawParams);
        const attachmentId = readStringParam(record, "attachmentId", { required: true });
        return redactedCardResult(await store.deleteAttachment(id, attachmentId, scope));
      },
    },
    {
      name: "workboard_block",
      label: "Workboard Block",
      description: "Block a claimed Workboard card with a durable reason and release the claim.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          token: claimTokenField(),
          reason: Type.Optional(Type.String({ description: "Blocker summary." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        return runClaimedCardMutation(rawParams, (id, record, scope) =>
          store.block(id, record, scope),
        );
      },
    },
    {
      name: "workboard_unblock",
      label: "Workboard Unblock",
      description: "Move a blocked Workboard card back to todo after adding enough context.",
      parameters: CardIdSchema,
      execute: async (_toolCallId, rawParams) => {
        const { id, scope } = await readScopedCardToolParams(rawParams);
        return redactedRawCardResult(await store.unblock(id, scope));
      },
    },
    createWorkboardMoveTool({
      store,
      readScopedCardToolParams,
      redactedCardResult,
    }),
    {
      name: "workboard_boards",
      label: "Workboard Boards",
      description: "List Workboard board namespaces with active, archived, and status counts.",
      parameters: Type.Object({}, { additionalProperties: false }),
      execute: async () => jsonResult(await store.listBoards()),
    },
    {
      name: "workboard_board_create",
      label: "Workboard Board Create",
      description: "Create or update a Workboard board namespace with persisted SQLite metadata.",
      parameters: Type.Object(
        {
          id: Type.String({ description: "Board id." }),
          name: Type.Optional(Type.String({ description: "Display name." })),
          description: Type.Optional(Type.String({ description: "Board description." })),
          icon: Type.Optional(Type.String({ description: "Short icon or label." })),
          color: Type.Optional(Type.String({ description: "Display color token." })),
          defaultWorkspace: Type.Optional(
            Type.Object(
              {
                kind: Type.String({ description: "scratch, dir, or worktree." }),
                path: Type.Optional(Type.String({ description: "Absolute dir/worktree path." })),
                branch: Type.Optional(Type.String({ description: "Suggested branch." })),
              },
              { additionalProperties: false },
            ),
          ),
          orchestration: Type.Optional(
            Type.Object(
              {
                autoDecompose: Type.Optional(
                  Type.Boolean({ description: "Mark ready triage cards for decomposition." }),
                ),
                autoDecomposePerDispatch: Type.Optional(
                  Type.Number({ description: "Maximum orchestration candidates per dispatch." }),
                ),
                defaultAssignee: Type.Optional(Type.String({ description: "Default assignee." })),
                orchestratorProfile: Type.Optional(
                  Type.String({ description: "Orchestrator profile id." }),
                ),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) =>
        jsonResult({ board: await store.upsertBoard(rawParams) }),
    },
    {
      name: "workboard_board_archive",
      label: "Workboard Board Archive",
      description: "Archive or restore persisted Workboard board metadata.",
      parameters: Type.Object(
        {
          id: Type.String({ description: "Board id." }),
          archived: Type.Optional(Type.Boolean({ description: "Archive when true." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = rawParams;
        return jsonResult({ board: await store.archiveBoard(record.id, record.archived) });
      },
    },
    {
      name: "workboard_board_delete",
      label: "Workboard Board Delete",
      description: "Delete an empty non-default Workboard board metadata record.",
      parameters: Type.Object(
        { id: Type.String({ description: "Board id." }) },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => jsonResult(await store.deleteBoard(rawParams.id)),
    },
    {
      name: "workboard_stats",
      label: "Workboard Stats",
      description: "Summarize Workboard counts by status and assignee for one board or all boards.",
      parameters: Type.Object(
        { boardId: Type.Optional(Type.String({ description: "Optional board id filter." })) },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = rawParams;
        return jsonResult(await store.stats({ boardId: record.boardId }));
      },
    },
    {
      name: "workboard_runs",
      label: "Workboard Runs",
      description: "List persisted Workboard run attempts for one card.",
      parameters: CardIdSchema,
      execute: async (_toolCallId, rawParams) => {
        const id = readStringParam(rawParams, "id", { required: true });
        const result = await store.runs(id);
        return jsonResult({
          ...result,
          card: redactClaimToken(result.card),
        });
      },
    },
    {
      name: "workboard_specify",
      label: "Workboard Specify",
      description:
        "Turn a rough triage/backlog Workboard card into a specified todo card after reasoning through the requirements.",
      parameters: Type.Object(
        {
          id: Type.String({ description: "Workboard card id." }),
          title: Type.Optional(Type.String({ description: "Clarified title." })),
          notes: Type.Optional(
            Type.String({ description: "Clarified notes or acceptance criteria." }),
          ),
          agentId: Type.Optional(Type.String({ description: "Assigned agent id." })),
          priority: Type.Optional(Type.String({ description: "low, normal, high, or urgent." })),
          labels: Type.Optional(Type.Array(Type.String(), { description: "Card labels." })),
          boardId: Type.Optional(Type.String({ description: "Board id." })),
          tenant: Type.Optional(Type.String({ description: "Tenant or routing namespace." })),
          skills: Type.Optional(Type.Array(Type.String(), { description: "Suggested skills." })),
          workspace: Type.Optional(
            Type.Object(
              {
                kind: Type.String({ description: "scratch, dir, or worktree." }),
                path: Type.Optional(Type.String({ description: "Absolute dir/worktree path." })),
                branch: Type.Optional(Type.String({ description: "Suggested branch." })),
              },
              { additionalProperties: false },
            ),
          ),
          maxRuntimeSeconds: Type.Optional(Type.Number({ description: "Runtime budget." })),
          maxRetries: Type.Optional(Type.Number({ description: "Retry budget." })),
          summary: Type.Optional(Type.String({ description: "Specification summary comment." })),
          token: Type.Optional(Type.String({ description: "Claim token for claimed cards." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = rawParams;
        const id = readStringParam(record, "id", { required: true });
        await requireScopedCard(store, id, ownerId, record.token);
        return jsonResult({
          card: redactClaimToken(
            await store.specify(id, record, {
              ownerId,
              token: record.token,
            }),
          ),
        });
      },
    },
    {
      name: "workboard_decompose",
      label: "Workboard Decompose",
      description:
        "Fan out a Workboard card into linked child cards and optionally complete the parent orchestration card.",
      parameters: Type.Object(
        {
          id: Type.String({ description: "Parent Workboard card id." }),
          token: Type.Optional(Type.String({ description: "Claim token for claimed cards." })),
          summary: Type.Optional(Type.String({ description: "Decomposition summary." })),
          completeParent: Type.Optional(
            Type.Boolean({
              description: "Complete the parent after child creation. Default true.",
            }),
          ),
          children: Type.Array(
            Type.Object(
              {
                title: Type.String({ description: "Child title." }),
                notes: Type.Optional(Type.String({ description: "Child notes." })),
                agentId: Type.Optional(Type.String({ description: "Assigned agent id." })),
                priority: Type.Optional(
                  Type.String({ description: "low, normal, high, or urgent." }),
                ),
                labels: Type.Optional(Type.Array(Type.String())),
                boardId: Type.Optional(Type.String()),
                tenant: Type.Optional(Type.String()),
                skills: Type.Optional(Type.Array(Type.String())),
                workspace: Type.Optional(
                  Type.Object(
                    {
                      kind: Type.String({ description: "scratch, dir, or worktree." }),
                      path: Type.Optional(
                        Type.String({ description: "Absolute dir/worktree path." }),
                      ),
                      branch: Type.Optional(Type.String({ description: "Suggested branch." })),
                    },
                    { additionalProperties: false },
                  ),
                ),
                maxRuntimeSeconds: Type.Optional(Type.Number()),
                maxRetries: Type.Optional(Type.Number()),
                idempotencyKey: Type.Optional(Type.String()),
              },
              { additionalProperties: false },
            ),
          ),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record = rawParams;
        const id = readStringParam(record, "id", { required: true });
        await requireScopedCard(store, id, ownerId, record.token);
        const result = await store.decompose(id, record, {
          ownerId,
          token: record.token,
        });
        return jsonResult({
          parent: redactClaimToken(result.parent),
          children: result.children.map(redactClaimToken),
        });
      },
    },
    {
      name: "workboard_notify_subscribe",
      label: "Workboard Notify Subscribe",
      description: "Persist a Workboard notification subscription in the plugin SQLite store.",
      parameters: Type.Object(
        {
          boardId: Type.Optional(Type.String({ description: "Board id. Default default." })),
          cardId: Type.Optional(Type.String({ description: "Card id." })),
          sessionKey: Type.Optional(Type.String({ description: "Session key." })),
          runId: Type.Optional(Type.String({ description: "Run id." })),
          target: Type.Optional(Type.String({ description: "Human-readable target." })),
          eventKinds: Type.Optional(
            Type.Array(Type.String(), { description: "completed, failed, stale." }),
          ),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) =>
        jsonResult({ subscription: await store.subscribeNotifications(rawParams) }),
    },
    {
      name: "workboard_notify_list",
      label: "Workboard Notify List",
      description: "List persisted Workboard notification subscriptions.",
      parameters: Type.Object(
        {
          boardId: Type.Optional(Type.String({ description: "Board id." })),
          cardId: Type.Optional(Type.String({ description: "Card id." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) =>
        jsonResult(await store.listNotificationSubscriptions(rawParams)),
    },
    {
      name: "workboard_notify_events",
      label: "Workboard Notify Events",
      description: "Read replay-safe Workboard notification events without advancing cursors.",
      parameters: Type.Object(
        {
          subscriptionId: Type.Optional(Type.String({ description: "Subscription id." })),
          boardId: Type.Optional(Type.String({ description: "Board id." })),
          cardId: Type.Optional(Type.String({ description: "Card id." })),
          limit: Type.Optional(Type.Number({ description: "Maximum events. Default 50." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) =>
        jsonResult(await store.notificationEvents(rawParams)),
    },
    {
      name: "workboard_notify_advance",
      label: "Workboard Notify Advance",
      description: "Read Workboard notification events and advance the subscription cursor.",
      parameters: Type.Object(
        {
          subscriptionId: Type.String({ description: "Subscription id." }),
          limit: Type.Optional(Type.Number({ description: "Maximum events. Default 50." })),
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) =>
        jsonResult(await store.advanceNotificationEvents(rawParams)),
    },
    {
      name: "workboard_notify_unsubscribe",
      label: "Workboard Notify Unsubscribe",
      description: "Delete a persisted Workboard notification subscription.",
      parameters: Type.Object(
        { id: Type.String({ description: "Subscription id." }) },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const id = readStringParam(rawParams, "id", { required: true });
        return jsonResult(await store.deleteNotificationSubscription(id));
      },
    },
    {
      name: "workboard_promote",
      label: "Workboard Promote",
      description:
        "Promote a dependency-ready card into ready, optionally forcing past holds for operator recovery.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          token: ScopedClaimTokenField,
          force: Type.Optional(
            Type.Boolean({ description: "Bypass dependency or schedule holds." }),
          ),
          reason: OptionalOperatorNoteField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        return runScopedCardMutation(rawParams, (id, record, scope) =>
          store.promote(id, record, scope),
        );
      },
    },
    {
      name: "workboard_reassign",
      label: "Workboard Reassign",
      description: "Change a card assignee and optionally reset failure state during recovery.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          token: ScopedClaimTokenField,
          agentId: Type.Optional(Type.String({ description: "New assignee id." })),
          status: OptionalNextStatusField,
          resetFailures: Type.Optional(Type.Boolean({ description: "Reset failure count." })),
          reason: OptionalOperatorNoteField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        return runScopedCardMutation(rawParams, (id, record, scope) =>
          store.reassign(id, record, scope),
        );
      },
    },
    {
      name: "workboard_reclaim",
      label: "Workboard Reclaim",
      description:
        "Release a stale claim and stop running attempts so another agent can pick it up.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          token: ScopedClaimTokenField,
          status: OptionalNextStatusField,
          reason: OptionalOperatorNoteField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        return runScopedCardMutation(rawParams, (id, record, scope) =>
          store.reclaim(id, record, scope),
        );
      },
    },
    {
      name: "workboard_dispatch",
      label: "Workboard Dispatch",
      description:
        "Advance persisted board state without launching workers: promote unblocked cards, reclaim expired claims, and block timed-out runs.",
      parameters: Type.Object(
        { boardId: Type.Optional(Type.String({ description: "Optional board id filter." })) },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const record =
          rawParams && typeof rawParams === "object" && !Array.isArray(rawParams) ? rawParams : {};
        const result = await store.dispatch({ boardId: record.boardId });
        return jsonResult({
          ...result,
          promoted: result.promoted.map(redactClaimToken),
          reclaimed: result.reclaimed.map(redactClaimToken),
          blocked: result.blocked.map(redactClaimToken),
          orchestrated: result.orchestrated.map(redactClaimToken),
        });
      },
    },
    {
      name: "workboard_worker_log",
      label: "Workboard Worker Log",
      description: "Append a persisted worker log entry to a Workboard card.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          level: Type.Optional(Type.String({ description: "info, warning, or error." })),
          message: Type.String({ description: "Worker log message." }),
          sessionKey: Type.Optional(Type.String({ description: "Linked session key." })),
          runId: Type.Optional(Type.String({ description: "Linked run id." })),
          token: ScopedClaimTokenField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const { record, id, scope } = await readScopedCardToolParams(rawParams);
        return redactedCardResult(await store.addWorkerLog(id, record, scope));
      },
    },
    {
      name: "workboard_protocol_violation",
      label: "Workboard Protocol Violation",
      description:
        "Block a card and record a worker protocol violation when work stops without complete/block.",
      parameters: Type.Object(
        {
          id: cardIdField(),
          detail: Type.Optional(Type.String({ description: "Violation detail." })),
          sessionKey: Type.Optional(Type.String({ description: "Linked session key." })),
          runId: Type.Optional(Type.String({ description: "Linked run id." })),
          token: ScopedClaimTokenField,
        },
        { additionalProperties: false },
      ),
      execute: async (_toolCallId, rawParams) => {
        const { record, id, scope } = await readClaimedCardToolParams(rawParams);
        return redactedCardResult(await store.recordProtocolViolation(id, record, scope));
      },
    },
  ];
}
//#endregion
//#region extensions/workboard/index.ts
var workboard_default = definePluginEntry({
  id: "workboard",
  name: "Workboard",
  description: "Dashboard workboard for agent-owned issues and sessions.",
  register(api) {
    const store = WorkboardStore.openSqlite();
    registerWorkboardGatewayMethods({
      api,
      store,
    });
    registerWorkboardCommand({
      api,
      store,
    });
    api.on("subagent_ended", async (event) => {
      if (event.runId)
        await cleanupWorkboardRunWorktree({
          store,
          worktrees: api.runtime.worktrees,
          runId: event.runId,
        });
    });
    api.registerCli(
      async ({ program }) => {
        const { registerWorkboardCli } = await import("../../cli-gsdAvc7T.js");
        registerWorkboardCli({
          program,
          store,
        });
      },
      {
        descriptors: [
          {
            name: "workboard",
            description: "Manage Workboard cards and worker dispatch",
            hasSubcommands: true,
          },
        ],
      },
    );
    api.registerTool(
      (context) =>
        guardWorkboardToolsForWorkspaceAccess(
          createWorkboardTools({
            api,
            context,
            store,
          }),
          context,
          api.runtime.sandbox.resolveWorkspaceAuthority,
        ),
      {
        names: [...WORKBOARD_TOOL_NAMES],
        optional: true,
      },
    );
  },
});
//#endregion
export { workboard_default as default };
