//#region src/plugin-sdk/qa-live-transport-scenarios.d.ts
/** Standard live-transport behavior buckets used to compare channel QA suites. */
type LiveTransportStandardScenarioId =
  | "canary"
  | "mention-gating"
  | "allowlist-block"
  | "top-level-reply-shape"
  | "quote-reply"
  | "restart-resume"
  | "thread-follow-up"
  | "thread-isolation"
  | "reaction-observation"
  | "help-command";
/** Transport-specific live QA scenario with optional mapping to a standard behavior bucket. */
type LiveTransportScenarioDefinition<TId extends string = string> = {
  /** Transport-specific scenario id accepted by CLI scenario filters. */ id: TId /** Optional standard coverage bucket this transport-specific scenario proves. */;
  standardId?: LiveTransportStandardScenarioId /** Per-scenario timeout for live transport execution. */;
  timeoutMs: number /** Human-readable label used in QA output. */;
  title: string;
};
/** Minimum standard scenarios expected from baseline live transport suites. */
declare const LIVE_TRANSPORT_BASELINE_STANDARD_SCENARIO_IDS: readonly LiveTransportStandardScenarioId[];
/** Selects requested live transport scenarios and fails fast on unknown ids. */
declare function selectLiveTransportScenarios<
  TDefinition extends {
    id: string;
  },
>(params: { ids?: string[]; laneLabel: string; scenarios: readonly TDefinition[] }): TDefinition[];
/** Collects unique standard coverage ids from always-on coverage and scenario metadata. */
declare function collectLiveTransportStandardScenarioCoverage<TId extends string>(params: {
  alwaysOnStandardScenarioIds?: readonly LiveTransportStandardScenarioId[];
  scenarios: readonly LiveTransportScenarioDefinition<TId>[];
}): LiveTransportStandardScenarioId[];
/** Returns expected standard scenario ids that are not covered by the supplied suite. */
declare function findMissingLiveTransportStandardScenarios(params: {
  coveredStandardScenarioIds: readonly LiveTransportStandardScenarioId[];
  expectedStandardScenarioIds: readonly LiveTransportStandardScenarioId[];
}): LiveTransportStandardScenarioId[];
//#endregion
export {
  LIVE_TRANSPORT_BASELINE_STANDARD_SCENARIO_IDS,
  LiveTransportScenarioDefinition,
  LiveTransportStandardScenarioId,
  collectLiveTransportStandardScenarioCoverage,
  findMissingLiveTransportStandardScenarios,
  selectLiveTransportScenarios,
};
