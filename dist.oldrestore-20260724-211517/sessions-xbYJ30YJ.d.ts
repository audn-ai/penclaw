import { Static, Type } from "typebox";

//#region packages/gateway-protocol/src/schema/sessions-create.d.ts
/** Creates or adopts a session with optional model, label, and parent linkage. */
declare const SessionsCreateParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  catalogId: Type.TOptional<Type.TString>;
  parentSessionKey: Type.TOptional<Type.TString>;
  fork: Type.TOptional<Type.TBoolean>;
  emitCommandHooks: Type.TOptional<Type.TBoolean>;
  task: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  worktree: Type.TOptional<Type.TBoolean>;
  worktreeBaseRef: Type.TOptional<Type.TString>;
  worktreeName: Type.TOptional<Type.TString>;
  execNode: Type.TOptional<Type.TString>;
  cwd: Type.TOptional<Type.TString>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.d.ts
/** Start/end event emitted while a session compaction operation runs. */
declare const SessionOperationEventSchema: Type.TObject<{
  operationId: Type.TString;
  operation: Type.TLiteral<"compact">;
  phase: Type.TUnion<[Type.TLiteral<"start">, Type.TLiteral<"end">]>;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  ts: Type.TInteger;
  completed: Type.TOptional<Type.TBoolean>;
  reason: Type.TOptional<Type.TString>;
}>;
/** Session file grouping used by the Control UI session workspace rail. */
declare const SessionFileKindSchema: Type.TUnion<
  [Type.TLiteral<"modified">, Type.TLiteral<"read">]
>;
/** Session relevance marker for browser entries. */
declare const SessionFileRelevanceSchema: Type.TUnion<
  [Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]
>;
/** One file path referenced by a session transcript. */
declare const SessionFileEntrySchema: Type.TObject<{
  path: Type.TString;
  workspacePath: Type.TOptional<Type.TString>;
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
  missing: Type.TBoolean;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
  content: Type.TOptional<Type.TString>;
  hash: Type.TOptional<Type.TString>;
}>;
/** One file or folder in the session-rooted browser. */
declare const SessionFileBrowserEntrySchema: Type.TObject<{
  path: Type.TString;
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
  sessionKind: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>
  >;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
}>;
/** Folder listing or search result rooted at the session workspace. */
declare const SessionFileBrowserResultSchema: Type.TObject<{
  path: Type.TString;
  parentPath: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
  entries: Type.TArray<
    Type.TObject<{
      path: Type.TString;
      name: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
      sessionKind: Type.TOptional<
        Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>
      >;
      size: Type.TOptional<Type.TInteger>;
      updatedAtMs: Type.TOptional<Type.TInteger>;
    }>
  >;
  truncated: Type.TOptional<Type.TBoolean>;
}>;
/** Lists files touched by a session transcript. */
declare const SessionsFilesListParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  path: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
}>;
/** File references visible in one session workspace. */
declare const SessionsFilesListResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  files: Type.TArray<
    Type.TObject<{
      path: Type.TString;
      workspacePath: Type.TOptional<Type.TString>;
      name: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
      missing: Type.TBoolean;
      size: Type.TOptional<Type.TInteger>;
      updatedAtMs: Type.TOptional<Type.TInteger>;
      content: Type.TOptional<Type.TString>;
      hash: Type.TOptional<Type.TString>;
    }>
  >;
  browser: Type.TOptional<
    Type.TObject<{
      path: Type.TString;
      parentPath: Type.TOptional<Type.TString>;
      search: Type.TOptional<Type.TString>;
      entries: Type.TArray<
        Type.TObject<{
          path: Type.TString;
          name: Type.TString;
          kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
          sessionKind: Type.TOptional<
            Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>
          >;
          size: Type.TOptional<Type.TInteger>;
          updatedAtMs: Type.TOptional<Type.TInteger>;
        }>
      >;
      truncated: Type.TOptional<Type.TBoolean>;
    }>
  >;
}>;
/** Reads one session-referenced file by path. */
declare const SessionsFilesGetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  path: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Result for reading one session-referenced file. */
declare const SessionsFilesGetResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  file: Type.TObject<{
    path: Type.TString;
    workspacePath: Type.TOptional<Type.TString>;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
    hash: Type.TOptional<Type.TString>;
  }>;
}>;
/** Overwrites one existing session workspace file with hash-based CAS. */
declare const SessionsFilesSetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  path: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  content: Type.TString;
  expectedHash: Type.TString;
}>;
/** Result for overwriting one session workspace file. */
declare const SessionsFilesSetResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  file: Type.TObject<{
    path: Type.TString;
    workspacePath: Type.TOptional<Type.TString>;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
    hash: Type.TOptional<Type.TString>;
  }>;
}>;
/** Change status for one file in a session checkout diff. */
declare const SessionDiffFileStatusSchema: Type.TUnion<
  [
    Type.TLiteral<"added">,
    Type.TLiteral<"modified">,
    Type.TLiteral<"deleted">,
    Type.TLiteral<"renamed">,
  ]
>;
/** One changed file in a session checkout diff. */
declare const SessionDiffFileSchema: Type.TObject<{
  path: Type.TString;
  oldPath: Type.TOptional<Type.TString>;
  status: Type.TUnion<
    [
      Type.TLiteral<"added">,
      Type.TLiteral<"modified">,
      Type.TLiteral<"deleted">,
      Type.TLiteral<"renamed">,
    ]
  >;
  additions: Type.TInteger;
  deletions: Type.TInteger;
  binary: Type.TOptional<Type.TBoolean>;
  untracked: Type.TOptional<Type.TBoolean> /** Per-file unified patch text; absent for binary or oversized files. */;
  patch: Type.TOptional<Type.TString>;
  truncated: Type.TOptional<Type.TBoolean>;
}>;
/** Reads the git diff of a session checkout against its base branch. */
declare const SessionsDiffParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Branch + working-tree diff for one session checkout. */
declare const SessionsDiffResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  branch: Type.TOptional<Type.TString> /** Display label of the diff base: the default branch name or "HEAD". */;
  baseRef: Type.TOptional<Type.TString>;
  files: Type.TArray<
    Type.TObject<{
      path: Type.TString;
      oldPath: Type.TOptional<Type.TString>;
      status: Type.TUnion<
        [
          Type.TLiteral<"added">,
          Type.TLiteral<"modified">,
          Type.TLiteral<"deleted">,
          Type.TLiteral<"renamed">,
        ]
      >;
      additions: Type.TInteger;
      deletions: Type.TInteger;
      binary: Type.TOptional<Type.TBoolean>;
      untracked: Type.TOptional<Type.TBoolean> /** Per-file unified patch text; absent for binary or oversized files. */;
      patch: Type.TOptional<Type.TString>;
      truncated: Type.TOptional<Type.TBoolean>;
    }>
  >;
  additions: Type.TInteger;
  deletions: Type.TInteger;
  truncated: Type.TOptional<Type.TBoolean>;
  unavailableReason: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"unknown_session">, Type.TLiteral<"not_git">]>
  >;
}>;
/** Lists sessions with optional scope, activity, label, and preview filters. */
declare const SessionsListParamsSchema: Type.TObject<{
  /**
   * Maximum rows to return. Omitted Gateway RPC calls use a bounded default
   * to keep large session stores from monopolizing the event loop.
   */
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  activeMinutes: Type.TOptional<Type.TInteger>;
  includeGlobal: Type.TOptional<Type.TBoolean>;
  includeUnknown: Type.TOptional<Type.TBoolean>;
  /**
   * Limit returned agent-scoped rows to agents currently present in config.
   * Broad disk discovery remains the default for recovery/ACP consumers.
   */
  configuredAgentsOnly: Type.TOptional<Type.TBoolean>;
  /**
   * Read first 8KB of each session transcript to derive title from first user message.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeDerivedTitles: Type.TOptional<Type.TBoolean>;
  /**
   * Read last 16KB of each session transcript to extract most recent message preview.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeLastMessage: Type.TOptional<Type.TBoolean>;
  label: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString> /** True lists archived sessions; false or omitted lists active sessions. */;
  archived: Type.TOptional<Type.TBoolean>;
}>;
/** Searches one agent's indexed session transcripts, optionally within selected sessions. */
declare const SessionsSearchParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKeys: Type.TOptional<Type.TArray<Type.TString>>;
  query: Type.TString;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** One full-text session transcript match with follow-up provenance. */
declare const SessionsSearchHitSchema: Type.TObject<{
  sessionKey: Type.TString;
  sessionId: Type.TString;
  messageId: Type.TString;
  role: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"assistant">]>;
  timestamp: Type.TInteger;
  snippet: Type.TString;
  score: Type.TNumber;
}>;
/** Full-text search response; indexing marks a still-running first-use reconcile. */
declare const SessionsSearchResultSchema: Type.TObject<{
  results: Type.TArray<
    Type.TObject<{
      sessionKey: Type.TString;
      sessionId: Type.TString;
      messageId: Type.TString;
      role: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"assistant">]>;
      timestamp: Type.TInteger;
      snippet: Type.TString;
      score: Type.TNumber;
    }>
  >;
  indexing: Type.TOptional<Type.TBoolean>;
  truncated: Type.TOptional<Type.TBoolean>;
}>;
/** Repairs or removes invalid session records from the selected agent scope. */
declare const SessionsCleanupParamsSchema: Type.TObject<{
  agent: Type.TOptional<Type.TString>;
  allAgents: Type.TOptional<Type.TBoolean>;
  enforce: Type.TOptional<Type.TBoolean>;
  activeKey: Type.TOptional<Type.TString>;
  fixMissing: Type.TOptional<Type.TBoolean>;
  fixDmScope: Type.TOptional<Type.TBoolean>;
}>;
/** Reads short previews for selected session keys. */
declare const SessionsPreviewParamsSchema: Type.TObject<{
  keys: Type.TArray<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Describes one session and optional derived title/last-message previews. */
declare const SessionsDescribeParamsSchema: Type.TObject<{
  key: Type.TString;
  includeDerivedTitles: Type.TOptional<Type.TBoolean>;
  includeLastMessage: Type.TOptional<Type.TBoolean>;
}>;
/** Resolves a session by key, raw session id, label, or parent/agent scope. */
declare const SessionsResolveParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  includeGlobal: Type.TOptional<Type.TBoolean>;
  includeUnknown: Type.TOptional<Type.TBoolean> /** Return a successful `{ ok: false }` response when the selector does not match a session. */;
  allowMissing: Type.TOptional<Type.TBoolean>;
}>;
declare const SessionWorktreeInfoSchema: Type.TObject<{
  id: Type.TString;
  path: Type.TString;
  branch: Type.TString;
}>;
/** Result returned after creating or adopting a session. */
declare const SessionsCreateResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  entry: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  runStarted: Type.TOptional<Type.TBoolean>;
  runError: Type.TOptional<
    Type.TObject<{
      code: Type.TString;
      message: Type.TString;
      details: Type.TOptional<Type.TUnknown>;
      retryable: Type.TOptional<Type.TBoolean>;
      retryAfterMs: Type.TOptional<Type.TInteger>;
    }>
  >;
  worktree: Type.TOptional<
    Type.TObject<{
      id: Type.TString;
      path: Type.TString;
      branch: Type.TString;
    }>
  >;
}>;
/** Sends one message into an existing session. */
declare const SessionsSendParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  message: Type.TString;
  thinking: Type.TOptional<Type.TString>;
  attachments: Type.TOptional<Type.TArray<Type.TUnknown>>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  idempotencyKey: Type.TOptional<Type.TString>;
}>;
/** Aborts the active or named run for a session. */
declare const SessionsAbortParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Mutable per-session preferences and routing metadata. */
declare const SessionsPatchParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  label: Type.TOptional<
    Type.TUnion<[Type.TString, Type.TNull]>
  > /** User-defined organization bucket ("category", not chat-group); null clears it. */;
  category: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  archived: Type.TOptional<Type.TBoolean>;
  pinned: Type.TOptional<Type.TBoolean>;
  unread: Type.TOptional<Type.TBoolean>;
  thinkingLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TNull]>>;
  verboseLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  traceLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  reasoningLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  responseUsage: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"off">,
        Type.TLiteral<"tokens">,
        Type.TLiteral<"full">,
        Type.TLiteral<"on">,
        Type.TNull,
      ]
    >
  >;
  elevatedLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execHost: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execSecurity: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execAsk: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execNode: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedBy: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedWorkspaceDir: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedCwd: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnDepth: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
  subagentRole: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"orchestrator">, Type.TLiteral<"leaf">, Type.TNull]>
  >;
  subagentControlScope: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"children">, Type.TLiteral<"none">, Type.TNull]>
  >;
  inheritedToolAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  inheritedToolDeny: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  sendPolicy: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TNull]>
  >;
  groupActivation: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"mention">, Type.TLiteral<"always">, Type.TNull]>
  >;
}>;
type SessionsPatchParams = Static<typeof SessionsPatchParamsSchema>;
/** Updates or clears one plugin namespace value on a session record. */
declare const SessionsPluginPatchParamsSchema: Type.TObject<{
  key: Type.TString;
  pluginId: Type.TString;
  namespace: Type.TString;
  value: Type.TOptional<Type.TUnknown>;
  unset: Type.TOptional<Type.TBoolean>;
}>;
/** Resets a session to a new or reset transcript state. */
declare const SessionsResetParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"new">, Type.TLiteral<"reset">]>>;
}>;
/** Deletes a session record and optionally its transcript. */
declare const SessionsDeleteParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  deleteTranscript: Type.TOptional<Type.TBoolean>;
  expectedSessionId: Type.TOptional<Type.TString>;
  expectedLifecycleRevision: Type.TOptional<Type.TString>;
  expectedSessionUpdatedAt: Type.TOptional<Type.TNumber>;
  emitLifecycleHooks: Type.TOptional<Type.TBoolean>;
  /**
   * Restricts the delete to already-archived sessions (archive-then-delete).
   * operator.write callers must set this; deletes without it require
   * operator.admin.
   */
  archivedOnly: Type.TOptional<Type.TBoolean>;
}>;
/** Lists the gateway-owned custom session group catalog (names + order). */
declare const SessionsGroupsListParamsSchema: Type.TObject<{}>;
/** One custom session group catalog entry. */
declare const SessionGroupSchema: Type.TObject<{
  name: Type.TString;
  position: Type.TInteger;
}>;
/** Custom session group catalog in display order. */
declare const SessionsGroupsListResultSchema: Type.TObject<{
  groups: Type.TArray<
    Type.TObject<{
      name: Type.TString;
      position: Type.TInteger;
    }>
  >;
}>;
/** Replaces the ordered group catalog; creates listed names, keeps member categories untouched. */
declare const SessionsGroupsPutParamsSchema: Type.TObject<{
  names: Type.TArray<Type.TString>;
}>;
/** Renames a group and repoints every member session's category. */
declare const SessionsGroupsRenameParamsSchema: Type.TObject<{
  name: Type.TString;
  to: Type.TString;
}>;
/** Deletes a group and clears every member session's category. */
declare const SessionsGroupsDeleteParamsSchema: Type.TObject<{
  name: Type.TString;
}>;
/** Result for group catalog mutations, with member sessions updated where applicable. */
declare const SessionsGroupsMutationResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  groups: Type.TArray<
    Type.TObject<{
      name: Type.TString;
      position: Type.TInteger;
    }>
  >;
  updatedSessions: Type.TOptional<Type.TInteger>;
}>;
/** Requests manual compaction for a session transcript. */
declare const SessionsCompactParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  maxLines: Type.TOptional<Type.TInteger>;
}>;
/** Lists compaction checkpoints for one session. */
declare const SessionsCompactionListParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Reads one compaction checkpoint by id. */
declare const SessionsCompactionGetParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  checkpointId: Type.TString;
}>;
/** Creates a new branch from a compaction checkpoint. */
declare const SessionsCompactionBranchParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  checkpointId: Type.TString;
}>;
/** Restores an existing session to a compaction checkpoint. */
declare const SessionsCompactionRestoreParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  checkpointId: Type.TString;
}>;
/** Usage report query across one session, one agent, or all agent sessions. */
declare const SessionsUsageParamsSchema: Type.TObject<{
  /** Specific session key to analyze; if omitted returns sessions for the effective agent. */ key: Type.TOptional<Type.TString> /** Agent scope for list-style usage queries. */;
  agentId: Type.TOptional<Type.TString> /** Explicit all-agent scope for list-style usage queries. */;
  agentScope: Type.TOptional<Type.TLiteral<"all">> /** Start date for range filter (YYYY-MM-DD). */;
  startDate: Type.TOptional<Type.TString> /** End date for range filter (YYYY-MM-DD). */;
  endDate: Type.TOptional<Type.TString> /** How start/end dates should be interpreted. Defaults to UTC when omitted. */;
  mode: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"utc">, Type.TLiteral<"gateway">, Type.TLiteral<"specific">]>
  > /** Preset range for usage queries when explicit start/end dates are omitted. */;
  range: Type.TOptional<
    Type.TUnion<
      [
        Type.TLiteral<"7d">,
        Type.TLiteral<"30d">,
        Type.TLiteral<"90d">,
        Type.TLiteral<"1y">,
        Type.TLiteral<"all">,
      ]
    >
  > /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */;
  groupBy: Type.TOptional<
    Type.TUnion<[Type.TLiteral<"instance">, Type.TLiteral<"family">]>
  > /** Backward-compatible alias for requesting family grouping. */;
  includeHistorical: Type.TOptional<Type.TBoolean> /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */;
  utcOffset: Type.TOptional<Type.TString> /** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */;
  timeZone: Type.TOptional<Type.TString> /** Maximum sessions to return (default 50). */;
  limit: Type.TOptional<Type.TInteger> /** Include context weight breakdown (systemPromptReport). */;
  includeContextWeight: Type.TOptional<Type.TBoolean>;
}>;
type SessionsListParams = Static<typeof SessionsListParamsSchema>;
type SessionsCleanupParams = Static<typeof SessionsCleanupParamsSchema>;
type SessionsPreviewParams = Static<typeof SessionsPreviewParamsSchema>;
type SessionsDescribeParams = Static<typeof SessionsDescribeParamsSchema>;
type SessionsResolveParams = Static<typeof SessionsResolveParamsSchema>;
type SessionsSearchParams = Static<typeof SessionsSearchParamsSchema>;
type SessionsSearchHit = Static<typeof SessionsSearchHitSchema>;
type SessionsSearchResult = Static<typeof SessionsSearchResultSchema>;
type SessionOperationEvent = Static<typeof SessionOperationEventSchema>;
type SessionWorktreeInfo = Static<typeof SessionWorktreeInfoSchema>;
type SessionsCreateResult = Static<typeof SessionsCreateResultSchema>;
type SessionsResetParams = Static<typeof SessionsResetParamsSchema>;
type SessionsDeleteParams = Static<typeof SessionsDeleteParamsSchema>;
type SessionGroup = Static<typeof SessionGroupSchema>;
type SessionsGroupsListParams = Static<typeof SessionsGroupsListParamsSchema>;
type SessionsGroupsListResult = Static<typeof SessionsGroupsListResultSchema>;
type SessionsGroupsPutParams = Static<typeof SessionsGroupsPutParamsSchema>;
type SessionsGroupsRenameParams = Static<typeof SessionsGroupsRenameParamsSchema>;
type SessionsGroupsDeleteParams = Static<typeof SessionsGroupsDeleteParamsSchema>;
type SessionsGroupsMutationResult = Static<typeof SessionsGroupsMutationResultSchema>;
type SessionsCompactParams = Static<typeof SessionsCompactParamsSchema>;
type SessionsUsageParams = Static<typeof SessionsUsageParamsSchema>;
type SessionFileKind = Static<typeof SessionFileKindSchema>;
type SessionFileRelevance = Static<typeof SessionFileRelevanceSchema>;
type SessionFileEntry = Static<typeof SessionFileEntrySchema>;
type SessionFileBrowserEntry = Static<typeof SessionFileBrowserEntrySchema>;
type SessionFileBrowserResult = Static<typeof SessionFileBrowserResultSchema>;
type SessionsFilesListParams = Static<typeof SessionsFilesListParamsSchema>;
type SessionsFilesListResult = Static<typeof SessionsFilesListResultSchema>;
type SessionsFilesGetParams = Static<typeof SessionsFilesGetParamsSchema>;
type SessionsFilesGetResult = Static<typeof SessionsFilesGetResultSchema>;
type SessionsFilesSetParams = Static<typeof SessionsFilesSetParamsSchema>;
type SessionsFilesSetResult = Static<typeof SessionsFilesSetResultSchema>;
type SessionDiffFileStatus = Static<typeof SessionDiffFileStatusSchema>;
type SessionDiffFile = Static<typeof SessionDiffFileSchema>;
type SessionsDiffParams = Static<typeof SessionsDiffParamsSchema>;
type SessionsDiffResult = Static<typeof SessionsDiffResultSchema>;
//#endregion
export {
  SessionsGroupsListParams as $,
  SessionsCreateResultSchema as A,
  SessionsFilesGetParamsSchema as B,
  SessionsCompactParams as C,
  SessionsSearchParamsSchema as Ct,
  SessionsCompactionListParamsSchema as D,
  SessionsUsageParams as Dt,
  SessionsCompactionGetParamsSchema as E,
  SessionsSendParamsSchema as Et,
  SessionsDiffParams as F,
  SessionsFilesListResult as G,
  SessionsFilesGetResultSchema as H,
  SessionsDiffParamsSchema as I,
  SessionsFilesSetParamsSchema as J,
  SessionsFilesListResultSchema as K,
  SessionsDiffResult as L,
  SessionsDeleteParamsSchema as M,
  SessionsDescribeParams as N,
  SessionsCompactionRestoreParamsSchema as O,
  SessionsUsageParamsSchema as Ot,
  SessionsDescribeParamsSchema as P,
  SessionsGroupsDeleteParamsSchema as Q,
  SessionsDiffResultSchema as R,
  SessionsCleanupParamsSchema as S,
  SessionsSearchParams as St,
  SessionsCompactionBranchParamsSchema as T,
  SessionsSearchResultSchema as Tt,
  SessionsFilesListParams as U,
  SessionsFilesGetResult as V,
  SessionsFilesListParamsSchema as W,
  SessionsFilesSetResultSchema as X,
  SessionsFilesSetResult as Y,
  SessionsGroupsDeleteParams as Z,
  SessionOperationEvent as _,
  SessionsResetParamsSchema as _t,
  SessionFileBrowserEntry as a,
  SessionsGroupsPutParams as at,
  SessionsAbortParamsSchema as b,
  SessionsSearchHit as bt,
  SessionFileBrowserResultSchema as c,
  SessionsGroupsRenameParamsSchema as ct,
  SessionFileKind as d,
  SessionsPatchParams as dt,
  SessionsGroupsListParamsSchema as et,
  SessionFileKindSchema as f,
  SessionsPatchParamsSchema as ft,
  SessionGroupSchema as g,
  SessionsResetParams as gt,
  SessionGroup as h,
  SessionsPreviewParamsSchema as ht,
  SessionDiffFileStatusSchema as i,
  SessionsGroupsMutationResultSchema as it,
  SessionsDeleteParams as j,
  SessionsCreateResult as k,
  SessionsCreateParamsSchema as kt,
  SessionFileEntry as l,
  SessionsListParams as lt,
  SessionFileRelevanceSchema as m,
  SessionsPreviewParams as mt,
  SessionDiffFileSchema as n,
  SessionsGroupsListResultSchema as nt,
  SessionFileBrowserEntrySchema as o,
  SessionsGroupsPutParamsSchema as ot,
  SessionFileRelevance as p,
  SessionsPluginPatchParamsSchema as pt,
  SessionsFilesSetParams as q,
  SessionDiffFileStatus as r,
  SessionsGroupsMutationResult as rt,
  SessionFileBrowserResult as s,
  SessionsGroupsRenameParams as st,
  SessionDiffFile as t,
  SessionsGroupsListResult as tt,
  SessionFileEntrySchema as u,
  SessionsListParamsSchema as ut,
  SessionWorktreeInfo as v,
  SessionsResolveParams as vt,
  SessionsCompactParamsSchema as w,
  SessionsSearchResult as wt,
  SessionsCleanupParams as x,
  SessionsSearchHitSchema as xt,
  SessionWorktreeInfoSchema as y,
  SessionsResolveParamsSchema as yt,
  SessionsFilesGetParams as z,
};
