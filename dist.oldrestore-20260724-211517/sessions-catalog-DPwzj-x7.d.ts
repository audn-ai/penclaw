import { Static, Type } from "typebox";

//#region packages/gateway-protocol/src/schema/sessions-catalog.d.ts
declare const SessionCatalogCapabilitiesSchema: Type.TObject<{
  continueSession: Type.TBoolean;
  archive: Type.TBoolean;
  createSession: Type.TOptional<
    Type.TObject<{
      model: Type.TString;
    }>
  >;
  openTerminal: Type.TOptional<Type.TBoolean>;
}>;
declare const SessionCatalogDescriptorSchema: Type.TObject<{
  id: Type.TString;
  label: Type.TString;
  capabilities: Type.TObject<{
    continueSession: Type.TBoolean;
    archive: Type.TBoolean;
    createSession: Type.TOptional<
      Type.TObject<{
        model: Type.TString;
      }>
    >;
    openTerminal: Type.TOptional<Type.TBoolean>;
  }>;
}>;
declare const SessionCatalogSessionSchema: Type.TObject<{
  threadId: Type.TString;
  name: Type.TOptional<Type.TString>;
  cwd: Type.TOptional<Type.TString>;
  status: Type.TString;
  createdAt: Type.TOptional<Type.TNumber>;
  updatedAt: Type.TOptional<Type.TNumber>;
  recencyAt: Type.TOptional<Type.TNumber>;
  source: Type.TOptional<Type.TString>;
  modelProvider: Type.TOptional<Type.TString>;
  cliVersion: Type.TOptional<Type.TString>;
  gitBranch: Type.TOptional<Type.TString>;
  archived: Type.TBoolean;
  openClawSessionKey: Type.TOptional<Type.TString>;
  canContinue: Type.TBoolean;
  canArchive: Type.TBoolean;
  canOpenTerminal: Type.TOptional<Type.TBoolean>;
}>;
declare const SessionCatalogHostSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"node">]>;
  connected: Type.TBoolean;
  nodeId: Type.TOptional<Type.TString>;
  sessions: Type.TArray<
    Type.TObject<{
      threadId: Type.TString;
      name: Type.TOptional<Type.TString>;
      cwd: Type.TOptional<Type.TString>;
      status: Type.TString;
      createdAt: Type.TOptional<Type.TNumber>;
      updatedAt: Type.TOptional<Type.TNumber>;
      recencyAt: Type.TOptional<Type.TNumber>;
      source: Type.TOptional<Type.TString>;
      modelProvider: Type.TOptional<Type.TString>;
      cliVersion: Type.TOptional<Type.TString>;
      gitBranch: Type.TOptional<Type.TString>;
      archived: Type.TBoolean;
      openClawSessionKey: Type.TOptional<Type.TString>;
      canContinue: Type.TBoolean;
      canArchive: Type.TBoolean;
      canOpenTerminal: Type.TOptional<Type.TBoolean>;
    }>
  >;
  nextCursor: Type.TOptional<Type.TString>;
  error: Type.TOptional<
    Type.TObject<{
      code: Type.TString;
      message: Type.TString;
    }>
  >;
}>;
declare const SessionCatalogSchema: Type.TObject<{
  id: Type.TString;
  label: Type.TString;
  capabilities: Type.TObject<{
    continueSession: Type.TBoolean;
    archive: Type.TBoolean;
    createSession: Type.TOptional<
      Type.TObject<{
        model: Type.TString;
      }>
    >;
    openTerminal: Type.TOptional<Type.TBoolean>;
  }>;
  hosts: Type.TArray<
    Type.TObject<{
      hostId: Type.TString;
      label: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"node">]>;
      connected: Type.TBoolean;
      nodeId: Type.TOptional<Type.TString>;
      sessions: Type.TArray<
        Type.TObject<{
          threadId: Type.TString;
          name: Type.TOptional<Type.TString>;
          cwd: Type.TOptional<Type.TString>;
          status: Type.TString;
          createdAt: Type.TOptional<Type.TNumber>;
          updatedAt: Type.TOptional<Type.TNumber>;
          recencyAt: Type.TOptional<Type.TNumber>;
          source: Type.TOptional<Type.TString>;
          modelProvider: Type.TOptional<Type.TString>;
          cliVersion: Type.TOptional<Type.TString>;
          gitBranch: Type.TOptional<Type.TString>;
          archived: Type.TBoolean;
          openClawSessionKey: Type.TOptional<Type.TString>;
          canContinue: Type.TBoolean;
          canArchive: Type.TBoolean;
          canOpenTerminal: Type.TOptional<Type.TBoolean>;
        }>
      >;
      nextCursor: Type.TOptional<Type.TString>;
      error: Type.TOptional<
        Type.TObject<{
          code: Type.TString;
          message: Type.TString;
        }>
      >;
    }>
  >;
  error: Type.TOptional<
    Type.TObject<{
      code: Type.TString;
      message: Type.TString;
    }>
  >;
}>;
declare const SessionsCatalogListParamsSchema: Type.TUnion<
  [
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      search: Type.TOptional<Type.TString>;
      limitPerHost: Type.TOptional<Type.TInteger>;
      hostIds: Type.TOptional<Type.TArray<Type.TString>>;
      catalogId: Type.TOptional<Type.TString>;
    }>,
    Type.TObject<{
      agentId: Type.TOptional<Type.TString>;
      search: Type.TOptional<Type.TString>;
      limitPerHost: Type.TOptional<Type.TInteger>;
      hostIds: Type.TOptional<Type.TArray<Type.TString>>;
      catalogId: Type.TString;
      cursors: Type.TRecord<"^.*$", Type.TString>;
    }>,
  ]
>;
declare const SessionsCatalogListResultSchema: Type.TObject<{
  catalogs: Type.TArray<
    Type.TObject<{
      id: Type.TString;
      label: Type.TString;
      capabilities: Type.TObject<{
        continueSession: Type.TBoolean;
        archive: Type.TBoolean;
        createSession: Type.TOptional<
          Type.TObject<{
            model: Type.TString;
          }>
        >;
        openTerminal: Type.TOptional<Type.TBoolean>;
      }>;
      hosts: Type.TArray<
        Type.TObject<{
          hostId: Type.TString;
          label: Type.TString;
          kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"node">]>;
          connected: Type.TBoolean;
          nodeId: Type.TOptional<Type.TString>;
          sessions: Type.TArray<
            Type.TObject<{
              threadId: Type.TString;
              name: Type.TOptional<Type.TString>;
              cwd: Type.TOptional<Type.TString>;
              status: Type.TString;
              createdAt: Type.TOptional<Type.TNumber>;
              updatedAt: Type.TOptional<Type.TNumber>;
              recencyAt: Type.TOptional<Type.TNumber>;
              source: Type.TOptional<Type.TString>;
              modelProvider: Type.TOptional<Type.TString>;
              cliVersion: Type.TOptional<Type.TString>;
              gitBranch: Type.TOptional<Type.TString>;
              archived: Type.TBoolean;
              openClawSessionKey: Type.TOptional<Type.TString>;
              canContinue: Type.TBoolean;
              canArchive: Type.TBoolean;
              canOpenTerminal: Type.TOptional<Type.TBoolean>;
            }>
          >;
          nextCursor: Type.TOptional<Type.TString>;
          error: Type.TOptional<
            Type.TObject<{
              code: Type.TString;
              message: Type.TString;
            }>
          >;
        }>
      >;
      error: Type.TOptional<
        Type.TObject<{
          code: Type.TString;
          message: Type.TString;
        }>
      >;
    }>
  >;
}>;
declare const SessionCatalogTranscriptItemSchema: Type.TObject<{
  id: Type.TOptional<Type.TString>;
  type: Type.TUnion<
    [
      Type.TLiteral<"userMessage">,
      Type.TLiteral<"agentMessage">,
      Type.TLiteral<"reasoning">,
      Type.TLiteral<"toolCall">,
      Type.TLiteral<"toolResult">,
      Type.TLiteral<"other">,
    ]
  >;
  text: Type.TOptional<Type.TString>;
  timestamp: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  truncated: Type.TOptional<Type.TBoolean>;
  raw: Type.TOptional<Type.TUnknown>;
}>;
declare const SessionsCatalogReadParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogReadResultSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TOptional<Type.TString>;
  threadId: Type.TString;
  items: Type.TArray<
    Type.TObject<{
      id: Type.TOptional<Type.TString>;
      type: Type.TUnion<
        [
          Type.TLiteral<"userMessage">,
          Type.TLiteral<"agentMessage">,
          Type.TLiteral<"reasoning">,
          Type.TLiteral<"toolCall">,
          Type.TLiteral<"toolResult">,
          Type.TLiteral<"other">,
        ]
      >;
      text: Type.TOptional<Type.TString>;
      timestamp: Type.TOptional<Type.TString>;
      model: Type.TOptional<Type.TString>;
      truncated: Type.TOptional<Type.TBoolean>;
      raw: Type.TOptional<Type.TUnknown>;
    }>
  >;
  nextCursor: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogContinueParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
}>;
declare const SessionsCatalogContinueResultSchema: Type.TObject<{
  sessionKey: Type.TString;
}>;
declare const SessionsCatalogArchiveParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
  confirmNoOtherRunner: Type.TLiteral<true>;
}>;
declare const SessionsCatalogArchiveResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
}>;
type SessionCatalogCapabilities = Static<typeof SessionCatalogCapabilitiesSchema>;
type SessionCatalogDescriptor = Static<typeof SessionCatalogDescriptorSchema>;
type SessionCatalogSession = Static<typeof SessionCatalogSessionSchema>;
type SessionCatalogHost = Static<typeof SessionCatalogHostSchema>;
type SessionCatalog = Static<typeof SessionCatalogSchema>;
type SessionsCatalogListParams = Static<typeof SessionsCatalogListParamsSchema>;
type SessionsCatalogListResult = Static<typeof SessionsCatalogListResultSchema>;
type SessionCatalogTranscriptItem = Static<typeof SessionCatalogTranscriptItemSchema>;
type SessionsCatalogReadParams = Static<typeof SessionsCatalogReadParamsSchema>;
type SessionsCatalogReadResult = Static<typeof SessionsCatalogReadResultSchema>;
type SessionsCatalogContinueParams = Static<typeof SessionsCatalogContinueParamsSchema>;
type SessionsCatalogContinueResult = Static<typeof SessionsCatalogContinueResultSchema>;
type SessionsCatalogArchiveParams = Static<typeof SessionsCatalogArchiveParamsSchema>;
type SessionsCatalogArchiveResult = Static<typeof SessionsCatalogArchiveResultSchema>;
//#endregion
export {
  SessionsCatalogListResult as C,
  SessionsCatalogReadResult as D,
  SessionsCatalogReadParamsSchema as E,
  SessionsCatalogReadResultSchema as O,
  SessionsCatalogListParamsSchema as S,
  SessionsCatalogReadParams as T,
  SessionsCatalogContinueParams as _,
  SessionCatalogDescriptorSchema as a,
  SessionsCatalogContinueResultSchema as b,
  SessionCatalogSchema as c,
  SessionCatalogTranscriptItem as d,
  SessionCatalogTranscriptItemSchema as f,
  SessionsCatalogArchiveResultSchema as g,
  SessionsCatalogArchiveResult as h,
  SessionCatalogDescriptor as i,
  SessionCatalogSession as l,
  SessionsCatalogArchiveParamsSchema as m,
  SessionCatalogCapabilities as n,
  SessionCatalogHost as o,
  SessionsCatalogArchiveParams as p,
  SessionCatalogCapabilitiesSchema as r,
  SessionCatalogHostSchema as s,
  SessionCatalog as t,
  SessionCatalogSessionSchema as u,
  SessionsCatalogContinueParamsSchema as v,
  SessionsCatalogListResultSchema as w,
  SessionsCatalogListParams as x,
  SessionsCatalogContinueResult as y,
};
