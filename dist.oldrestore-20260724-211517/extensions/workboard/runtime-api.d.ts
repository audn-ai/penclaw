import { g as OpenClawPluginApi } from "../../plugin-entry-DPCR66aO.js";
//#region packages/workboard-contract/src/index.d.ts
declare const WORKBOARD_STATUSES: readonly [
  "triage",
  "backlog",
  "todo",
  "scheduled",
  "ready",
  "running",
  "review",
  "blocked",
  "done",
];
declare const WORKBOARD_PRIORITIES: readonly ["low", "normal", "high", "urgent"];
declare const WORKBOARD_EXECUTION_ENGINES: readonly ["codex", "claude"];
declare const WORKBOARD_EXECUTION_MODES: readonly ["autonomous", "manual"];
declare const WORKBOARD_EXECUTION_STATUSES: readonly [
  "idle",
  "running",
  "review",
  "blocked",
  "done",
];
declare const WORKBOARD_EVENT_KINDS: readonly [
  "created",
  "edited",
  "moved",
  "linked",
  "specified",
  "decomposed",
  "claimed",
  "heartbeat",
  "execution_updated",
  "attempt_started",
  "attempt_updated",
  "comment_added",
  "link_added",
  "proof_added",
  "artifact_added",
  "attachment_added",
  "diagnostic",
  "notification",
  "dispatch",
  "orchestration",
  "protocol_violation",
  "archived",
  "unarchived",
  "stale",
];
declare const WORKBOARD_ATTEMPT_STATUSES: readonly [
  "running",
  "succeeded",
  "failed",
  "blocked",
  "stopped",
];
declare const WORKBOARD_LINK_TYPES: readonly [
  "parent",
  "child",
  "blocks",
  "blocked_by",
  "relates_to",
];
declare const WORKBOARD_PROOF_STATUSES: readonly ["passed", "failed", "skipped", "unknown"];
declare const WORKBOARD_TEMPLATE_IDS: readonly ["bugfix", "docs", "release", "pr_review", "plugin"];
declare const WORKBOARD_DIAGNOSTIC_KINDS: readonly [
  "stranded_ready",
  "running_without_heartbeat",
  "blocked_too_long",
  "repeated_failures",
  "missing_proof",
  "orphaned_session",
];
declare const WORKBOARD_DIAGNOSTIC_SEVERITIES: readonly ["warning", "error", "critical"];
declare const WORKBOARD_NOTIFICATION_KINDS: readonly ["completed", "failed", "stale"];
type WorkboardStatus = (typeof WORKBOARD_STATUSES)[number];
type WorkboardPriority = (typeof WORKBOARD_PRIORITIES)[number];
type WorkboardExecutionEngine = (typeof WORKBOARD_EXECUTION_ENGINES)[number];
type WorkboardExecutionMode = (typeof WORKBOARD_EXECUTION_MODES)[number];
type WorkboardExecutionStatus = (typeof WORKBOARD_EXECUTION_STATUSES)[number];
type WorkboardEventKind = (typeof WORKBOARD_EVENT_KINDS)[number];
type WorkboardAttemptStatus = (typeof WORKBOARD_ATTEMPT_STATUSES)[number];
type WorkboardLinkType = (typeof WORKBOARD_LINK_TYPES)[number];
type WorkboardProofStatus = (typeof WORKBOARD_PROOF_STATUSES)[number];
type WorkboardTemplateId = (typeof WORKBOARD_TEMPLATE_IDS)[number];
type WorkboardDiagnosticKind = (typeof WORKBOARD_DIAGNOSTIC_KINDS)[number];
type WorkboardDiagnosticSeverity = (typeof WORKBOARD_DIAGNOSTIC_SEVERITIES)[number];
type WorkboardNotificationKind = (typeof WORKBOARD_NOTIFICATION_KINDS)[number];
type WorkboardExecution = {
  id: string;
  kind: "agent-session";
  engine: WorkboardExecutionEngine;
  mode: WorkboardExecutionMode;
  status: WorkboardExecutionStatus;
  model: string;
  sessionKey?: string;
  runId?: string;
  startedAt: number;
  updatedAt: number;
};
type WorkboardEvent = {
  id: string;
  kind: WorkboardEventKind;
  at: number;
  fromStatus?: WorkboardStatus;
  toStatus?: WorkboardStatus;
  sessionKey?: string;
  runId?: string;
};
type WorkboardRunAttempt = {
  id: string;
  status: WorkboardAttemptStatus;
  startedAt: number;
  endedAt?: number;
  engine?: WorkboardExecutionEngine;
  mode?: WorkboardExecutionMode;
  model?: string;
  sessionKey?: string;
  runId?: string;
  error?: string;
};
type WorkboardComment = {
  id: string;
  body: string;
  createdAt: number;
  updatedAt?: number;
};
type WorkboardLink = {
  id: string;
  type: WorkboardLinkType;
  createdAt: number;
  targetCardId?: string;
  title?: string;
  url?: string;
};
type WorkboardProof = {
  id: string;
  status: WorkboardProofStatus;
  createdAt: number;
  label?: string;
  command?: string;
  url?: string;
  note?: string;
};
type WorkboardArtifact = {
  id: string;
  createdAt: number;
  label?: string;
  url?: string;
  path?: string;
  mimeType?: string;
};
type WorkboardAttachment = {
  id: string;
  cardId: string;
  createdAt: number;
  fileName: string;
  byteSize: number;
  mimeType?: string;
  note?: string;
};
type WorkboardWorkerLog = {
  id: string;
  createdAt: number;
  level: "info" | "warning" | "error";
  message: string;
  sessionKey?: string;
  runId?: string;
};
type WorkboardWorkerProtocol = {
  state: "idle" | "running" | "completed" | "blocked" | "violated";
  updatedAt: number;
  detail?: string;
};
type WorkboardStaleState = {
  detectedAt: number;
  lastSessionUpdatedAt?: number;
  reason: string;
};
type WorkboardClaim = {
  ownerId: string;
  token: string;
  claimedAt: number;
  lastHeartbeatAt: number;
  expiresAt?: number;
};
type WorkboardDiagnosticAction = {
  kind: "claim" | "unblock" | "promote" | "reclaim" | "reassign" | "add_proof" | "open_session";
  label: string;
};
type WorkboardDiagnostic = {
  kind: WorkboardDiagnosticKind;
  severity: WorkboardDiagnosticSeverity;
  title: string;
  detail: string;
  firstSeenAt: number;
  lastSeenAt: number;
  count: number;
  actions: WorkboardDiagnosticAction[];
};
type WorkboardNotification = {
  id: string;
  kind: WorkboardNotificationKind;
  createdAt: number;
  sequence?: number;
  message: string;
  sessionKey?: string;
  runId?: string;
};
type WorkboardWorkspace = {
  kind: "scratch" | "dir" | "worktree";
  path?: string;
  branch?: string;
  sourcePath?: string;
  sourceBranch?: string;
};
type WorkboardWorkspaceAccess =
  | {
      unrestricted: true;
    }
  | {
      unrestricted: false;
      roots: string[];
      writable: boolean;
    };
type WorkboardAutomation = {
  tenant?: string;
  boardId?: string;
  createdByCardId?: string;
  idempotencyKey?: string;
  skills?: string[];
  workspace?: WorkboardWorkspace;
  workspaceAccess?: WorkboardWorkspaceAccess;
  maxRuntimeSeconds?: number;
  maxRetries?: number;
  scheduledAt?: number;
  summary?: string;
  createdCardIds?: string[];
  dispatchCount?: number;
  lastDispatchAt?: number;
};
type WorkboardBoardMetadata = {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultWorkspace?: WorkboardWorkspace;
  orchestration?: WorkboardOrchestrationSettings;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
};
type WorkboardOrchestrationSettings = {
  autoDecompose?: boolean;
  autoDecomposePerDispatch?: number;
  defaultAssignee?: string;
  orchestratorProfile?: string;
};
type WorkboardNotificationSubscription = {
  id: string;
  boardId: string;
  cardId?: string;
  sessionKey?: string;
  runId?: string;
  target?: string;
  eventKinds?: WorkboardNotificationKind[];
  lastEventAt?: number;
  lastEventId?: string;
  lastEventSequence?: number;
  deliveredEventIds?: string[];
  createdAt: number;
  updatedAt: number;
};
type WorkboardMetadata = {
  attempts?: WorkboardRunAttempt[];
  comments?: WorkboardComment[];
  links?: WorkboardLink[];
  proof?: WorkboardProof[];
  artifacts?: WorkboardArtifact[];
  attachments?: WorkboardAttachment[];
  workerLogs?: WorkboardWorkerLog[];
  workerProtocol?: WorkboardWorkerProtocol;
  automation?: WorkboardAutomation;
  claim?: WorkboardClaim;
  diagnostics?: WorkboardDiagnostic[];
  notifications?: WorkboardNotification[];
  templateId?: WorkboardTemplateId;
  archivedAt?: number;
  stale?: WorkboardStaleState;
  lifecycleStatusSourceUpdatedAt?: number;
  failureCount?: number;
};
type WorkboardCard = {
  id: string;
  title: string;
  notes?: string;
  status: WorkboardStatus;
  priority: WorkboardPriority;
  labels: string[];
  agentId?: string;
  sessionKey?: string;
  runId?: string;
  taskId?: string;
  sourceUrl?: string;
  execution?: WorkboardExecution;
  position: number;
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  completedAt?: number;
  events?: WorkboardEvent[];
  metadata?: WorkboardMetadata;
};
type WorkboardListResult = {
  cards: WorkboardCard[];
  statuses: readonly WorkboardStatus[];
};
//#endregion
//#region extensions/workboard/src/persistence-types.d.ts
type PersistedWorkboardCard = {
  version: 1;
  card: WorkboardCard;
};
type PersistedWorkboardBoard = {
  version: 1;
  board: WorkboardBoardMetadata;
};
type PersistedWorkboardNotificationSubscription = {
  version: 1;
  subscription: WorkboardNotificationSubscription;
};
type PersistedWorkboardAttachment = {
  version: 1;
  attachment: WorkboardAttachment;
  contentBase64: string;
};
type WorkboardKeyedStore<T = PersistedWorkboardCard> = {
  register(key: string, value: T): Promise<void>;
  lookup(key: string): Promise<T | undefined>;
  delete(key: string): Promise<boolean>;
  entries(): Promise<
    Array<{
      key: string;
      value: T;
    }>
  >;
};
//#endregion
//#region extensions/workboard/src/store-inputs.d.ts
type WorkboardCardInput = {
  title?: unknown;
  notes?: unknown;
  status?: unknown;
  priority?: unknown;
  labels?: unknown;
  agentId?: unknown;
  sessionKey?: unknown;
  runId?: unknown;
  taskId?: unknown;
  sourceUrl?: unknown;
  execution?: unknown;
  metadata?: unknown;
  templateId?: unknown;
  position?: unknown;
  tenant?: unknown;
  boardId?: unknown;
  createdByCardId?: unknown;
  idempotencyKey?: unknown;
  skills?: unknown;
  workspace?: unknown /** Trusted mutation provenance; not accepted from public tool schemas. */;
  workspaceAccess?: unknown;
  maxRuntimeSeconds?: unknown;
  maxRetries?: unknown;
  scheduledAt?: unknown;
  startedAt?: unknown;
  completedAt?: unknown;
  parents?: unknown;
};
type WorkboardCardPatch = Partial<WorkboardCardInput>;
type WorkboardCommentInput = {
  body?: unknown;
};
type WorkboardLinkInput = {
  type?: unknown;
  targetCardId?: unknown;
  title?: unknown;
  url?: unknown;
};
type WorkboardLinkedCreateInput = WorkboardCardInput & {
  parents?: unknown;
};
type WorkboardProofInput = {
  status?: unknown;
  label?: unknown;
  command?: unknown;
  url?: unknown;
  note?: unknown;
};
type WorkboardArtifactInput = {
  label?: unknown;
  url?: unknown;
  path?: unknown;
  mimeType?: unknown;
};
type WorkboardAttachmentInput = {
  fileName?: unknown;
  contentBase64?: unknown;
  mimeType?: unknown;
  note?: unknown;
};
type WorkboardWorkerLogInput = {
  level?: unknown;
  message?: unknown;
  sessionKey?: unknown;
  runId?: unknown;
};
type WorkboardProtocolViolationInput = {
  detail?: unknown;
  sessionKey?: unknown;
  runId?: unknown;
};
type WorkboardClaimInput = {
  ownerId?: unknown;
  token?: unknown;
  ttlSeconds?: unknown;
};
type WorkboardClaimOptions = {
  /** Trusted dispatcher guard; never accepted from public tool or gateway input. */ expectedAuthority?: {
    agentId?: string;
    workspace?: WorkboardWorkspace;
    workspaceAccess?: WorkboardWorkspaceAccess;
  } /** Trusted legacy-card adoption; applied only while expectedAuthority still matches. */;
  adoptWorkspaceAccess?: WorkboardWorkspaceAccess;
};
type WorkboardHeartbeatInput = {
  token?: unknown;
  ownerId?: unknown;
  note?: unknown;
};
type WorkboardBulkInput = {
  ids?: unknown;
  patch?: unknown;
  archived?: unknown;
};
type WorkboardCompleteInput = {
  ownerId?: unknown;
  token?: unknown;
  summary?: unknown;
  proof?: unknown;
  artifacts?: unknown;
  createdCardIds?: unknown;
};
type WorkboardBlockInput = {
  ownerId?: unknown;
  token?: unknown;
  reason?: unknown;
};
type WorkboardDispatchResult = {
  promoted: WorkboardCard[];
  reclaimed: WorkboardCard[];
  blocked: WorkboardCard[];
  orchestrated: WorkboardCard[];
  count: number;
};
type WorkboardListOptions = {
  boardId?: unknown;
};
type WorkboardDispatchOptions = WorkboardListOptions & {
  now?: unknown;
};
type WorkboardBoardSummary = {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  defaultWorkspace?: WorkboardWorkspace;
  orchestration?: WorkboardOrchestrationSettings;
  total: number;
  active: number;
  archived: number;
  byStatus: Partial<Record<WorkboardStatus, number>>;
  updatedAt?: number;
  archivedAt?: number;
};
type WorkboardStatsResult = WorkboardBoardSummary & {
  byAgent: Record<string, number>;
  oldestReadyAgeMs?: number;
};
type WorkboardPromoteInput = {
  force?: unknown;
  reason?: unknown;
};
type WorkboardReassignInput = {
  agentId?: unknown;
  status?: unknown;
  resetFailures?: unknown;
  reason?: unknown;
};
type WorkboardReclaimInput = {
  status?: unknown;
  reason?: unknown;
};
type WorkboardBoardInput = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  icon?: unknown;
  color?: unknown;
  defaultWorkspace?: unknown;
  orchestration?: unknown;
  archived?: unknown;
};
type WorkboardSpecifyInput = WorkboardCardPatch & {
  summary?: unknown;
};
type WorkboardDecomposeInput = {
  summary?: unknown;
  children?: unknown;
  completeParent?: unknown;
};
type WorkboardNotificationSubscribeInput = {
  boardId?: unknown;
  cardId?: unknown;
  sessionKey?: unknown;
  runId?: unknown;
  target?: unknown;
  eventKinds?: unknown;
};
type WorkboardNotificationListOptions = {
  boardId?: unknown;
  cardId?: unknown;
};
type WorkboardNotificationEventsInput = WorkboardNotificationListOptions & {
  subscriptionId?: unknown;
  limit?: unknown;
};
type WorkboardMutationScope = {
  ownerId?: unknown;
  token?: unknown;
};
type WorkboardDiagnosticsResult = {
  diagnostics: Array<{
    card: WorkboardCard;
    diagnostics: WorkboardDiagnostic[];
  }>;
  count: number;
};
//#endregion
//#region extensions/workboard/src/store-core.d.ts
declare class WorkboardCoreStore {
  protected readonly store: WorkboardKeyedStore;
  private mutationQueue;
  private lastNotificationSequence;
  protected readonly boardStore: WorkboardKeyedStore<PersistedWorkboardBoard>;
  protected readonly subscriptionStore: WorkboardKeyedStore<PersistedWorkboardNotificationSubscription>;
  protected readonly attachmentStore: WorkboardKeyedStore<PersistedWorkboardAttachment>;
  constructor(
    store: WorkboardKeyedStore,
    stores?: {
      boards?: WorkboardKeyedStore<PersistedWorkboardBoard>;
      subscriptions?: WorkboardKeyedStore<PersistedWorkboardNotificationSubscription>;
      attachments?: WorkboardKeyedStore<PersistedWorkboardAttachment>;
    },
  );
  protected enqueueMutation<T>(run: () => Promise<T>): Promise<T>;
  protected updateMetadata(
    id: string,
    mutate: (existing: WorkboardCard) => WorkboardMetadata,
  ): Promise<WorkboardCard>;
  protected deleteDetachedAttachments(existing: WorkboardCard, next: WorkboardCard): Promise<void>;
  protected nextNotificationSequence(now: number): number;
  list(options?: WorkboardListOptions): Promise<WorkboardCard[]>;
  listBoards(): Promise<{
    boards: WorkboardBoardSummary[];
  }>;
  upsertBoard(input: WorkboardBoardInput): Promise<WorkboardBoardMetadata>;
  archiveBoard(id: unknown, archived?: unknown): Promise<WorkboardBoardMetadata>;
  deleteBoard(id: unknown): Promise<{
    deleted: boolean;
  }>;
  stats(input?: WorkboardListOptions, now?: number): Promise<WorkboardStatsResult>;
  get(id: string): Promise<WorkboardCard | undefined>;
  private removeReferencesToCard;
  create(input: WorkboardLinkedCreateInput, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  protected createDirect(
    input: WorkboardLinkedCreateInput,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  update(id: string, patch: WorkboardCardPatch): Promise<WorkboardCard>;
  protected updateCard(
    id: string,
    patch: WorkboardCardPatch,
    options?: {
      allowMetadataDependencyLinks?: boolean;
      enforceStatusHolds?: boolean;
    },
  ): Promise<WorkboardCard>;
  private assertActiveStatusAllowed;
  delete(id: string): Promise<{
    deleted: boolean;
  }>;
  protected deleteDirect(id: string): Promise<{
    deleted: boolean;
  }>;
  addComment(
    id: string,
    input: WorkboardCommentInput,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  addLink(id: string, input: WorkboardLinkInput): Promise<WorkboardCard>;
  linkCards(
    parentId: string,
    childId: string,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  protected linkCardsDirect(
    parentId: string,
    childId: string,
    now?: number,
    options?: {
      allowStatusOnlyActiveChild?: boolean;
      scope?: WorkboardMutationScope;
    },
  ): Promise<WorkboardCard>;
  private dependencyTargetStatus;
  private dependsOn;
  protected recordDispatch(card: WorkboardCard, now: number): Promise<WorkboardCard>;
  protected recordOrchestrationCandidate(card: WorkboardCard, now: number): Promise<WorkboardCard>;
  protected shouldAutoOrchestrate(card: WorkboardCard): Promise<boolean>;
  protected promoteDependencyReady(id: string, now?: number): Promise<WorkboardCard>;
  promoteReady(now?: number): Promise<{
    cards: WorkboardCard[];
    count: number;
  }>;
}
//#endregion
//#region extensions/workboard/src/store-enrichment.d.ts
declare class WorkboardEnrichmentStore extends WorkboardCoreStore {
  addProof(
    id: string,
    input: WorkboardProofInput,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  addProofWithArtifact(
    id: string,
    proofInput: WorkboardProofInput,
    artifactInput: WorkboardArtifactInput,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  addArtifact(
    id: string,
    input: WorkboardArtifactInput,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  addAttachment(
    id: string,
    input: WorkboardAttachmentInput,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  listAttachments(id: string): Promise<{
    card: WorkboardCard;
    attachments: WorkboardAttachment[];
  }>;
  getAttachment(id: string): Promise<PersistedWorkboardAttachment | undefined>;
  deleteAttachment(
    cardId: string,
    attachmentId: string,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  addWorkerLog(
    id: string,
    input: WorkboardWorkerLogInput,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  recordProtocolViolation(
    id: string,
    input?: WorkboardProtocolViolationInput,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
}
//#endregion
//#region extensions/workboard/src/store-promote.d.ts
declare class WorkboardPromoteStore extends WorkboardEnrichmentStore {
  move(
    id: string,
    status: unknown,
    position: unknown,
    scope?: WorkboardMutationScope,
  ): Promise<WorkboardCard>;
  promote(
    id: string,
    input?: WorkboardPromoteInput,
    scope?: WorkboardMutationScope | null,
  ): Promise<WorkboardCard>;
}
//#endregion
//#region extensions/workboard/src/store-workflow.d.ts
declare class WorkboardWorkflowStore extends WorkboardPromoteStore {
  claim(
    id: string,
    input: WorkboardClaimInput,
    options?: WorkboardClaimOptions,
  ): Promise<{
    card: WorkboardCard;
    token: string;
  }>;
  heartbeat(id: string, input: WorkboardHeartbeatInput): Promise<WorkboardCard>;
  releaseClaim(
    id: string,
    input?: WorkboardHeartbeatInput & {
      status?: unknown;
    },
  ): Promise<WorkboardCard>;
  complete(
    id: string,
    input?: WorkboardCompleteInput,
    scope?: WorkboardMutationScope | null | undefined,
  ): Promise<WorkboardCard>;
  private completeDirect;
  block(
    id: string,
    input?: WorkboardBlockInput,
    scope?: WorkboardMutationScope | null | undefined,
  ): Promise<WorkboardCard>;
  unblock(id: string, scope?: WorkboardMutationScope): Promise<WorkboardCard>;
  reassign(
    id: string,
    input?: WorkboardReassignInput,
    scope?: WorkboardMutationScope | null,
  ): Promise<WorkboardCard>;
  reclaim(
    id: string,
    input?: WorkboardReclaimInput,
    scope?: WorkboardMutationScope | null,
  ): Promise<WorkboardCard>;
  runs(id: string): Promise<{
    card: WorkboardCard;
    attempts: WorkboardRunAttempt[];
  }>;
  specify(
    id: string,
    input?: WorkboardSpecifyInput,
    scope?: WorkboardMutationScope | null,
  ): Promise<WorkboardCard>;
  decompose(
    id: string,
    input?: WorkboardDecomposeInput,
    scope?: WorkboardMutationScope | null,
  ): Promise<{
    parent: WorkboardCard;
    children: WorkboardCard[];
  }>;
}
//#endregion
//#region extensions/workboard/src/store-notifications.d.ts
declare class WorkboardNotificationStore extends WorkboardWorkflowStore {
  subscribeNotifications(
    input: WorkboardNotificationSubscribeInput,
  ): Promise<WorkboardNotificationSubscription>;
  listNotificationSubscriptions(input?: WorkboardNotificationListOptions): Promise<{
    subscriptions: WorkboardNotificationSubscription[];
  }>;
  deleteNotificationSubscription(id: string): Promise<{
    deleted: boolean;
  }>;
  private collectNotificationEvents;
  notificationEvents(input?: WorkboardNotificationEventsInput): Promise<{
    subscription?: WorkboardNotificationSubscription;
    events: WorkboardNotification[];
  }>;
  advanceNotificationEvents(input?: WorkboardNotificationEventsInput): Promise<{
    subscription?: WorkboardNotificationSubscription;
    events: WorkboardNotification[];
  }>;
}
//#endregion
//#region extensions/workboard/src/store.d.ts
declare class WorkboardStore extends WorkboardNotificationStore {
  dispatch(input?: number | WorkboardDispatchOptions): Promise<WorkboardDispatchResult>;
  bulkUpdate(input: WorkboardBulkInput): Promise<{
    cards: WorkboardCard[];
  }>;
  archive(id: string, archived: unknown): Promise<WorkboardCard>;
  exportCards(): Promise<{
    cards: WorkboardCard[];
    attachments: WorkboardAttachment[];
    exportedAt: number;
  }>;
  diagnostics(now?: number): Promise<WorkboardDiagnosticsResult>;
  refreshDiagnostics(now?: number): Promise<WorkboardDiagnosticsResult>;
  buildWorkerContext(id: string): Promise<string>;
  static open(
    openKeyedStore: (options: {
      namespace: string;
      maxEntries: number;
    }) => WorkboardKeyedStore<unknown>,
  ): WorkboardStore;
  static openSqlite(): WorkboardStore;
}
//#endregion
//#region extensions/workboard/src/gateway.d.ts
declare function registerWorkboardGatewayMethods(params: {
  api: OpenClawPluginApi;
  store?: WorkboardStore;
}): void;
//#endregion
export {
  type WorkboardCard,
  type WorkboardClaim,
  type WorkboardDiagnostic,
  type WorkboardListResult,
  type WorkboardPriority,
  type WorkboardStatus,
  registerWorkboardGatewayMethods,
};
