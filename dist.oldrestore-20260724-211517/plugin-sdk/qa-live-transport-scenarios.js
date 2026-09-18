//#region src/plugin-sdk/qa-live-transport-scenarios.ts
const LIVE_TRANSPORT_STANDARD_SCENARIOS = [
  {
    id: "canary",
    title: "Transport canary",
    description: "The lane can trigger one known-good reply on the real transport.",
  },
  {
    id: "mention-gating",
    title: "Mention gating",
    description: "Messages without the required mention do not trigger a reply.",
  },
  {
    id: "allowlist-block",
    title: "Sender allowlist block",
    description: "Non-allowlisted senders do not trigger a reply.",
  },
  {
    id: "top-level-reply-shape",
    title: "Top-level reply shape",
    description: "Top-level replies stay top-level when the lane is configured that way.",
  },
  {
    id: "quote-reply",
    title: "Quote reply",
    description: "Reply-mode responses quote the triggering transport message.",
  },
  {
    id: "restart-resume",
    title: "Restart resume",
    description: "The lane still responds after a gateway restart.",
  },
  {
    id: "thread-follow-up",
    title: "Thread follow-up",
    description: "Threaded prompts receive threaded replies with the expected relation metadata.",
  },
  {
    id: "thread-isolation",
    title: "Thread isolation",
    description: "Fresh top-level prompts stay out of prior threads.",
  },
  {
    id: "reaction-observation",
    title: "Reaction observation",
    description: "Reaction events are observed and normalized correctly.",
  },
  {
    id: "help-command",
    title: "Help command",
    description: "The transport-specific help command path replies successfully.",
  },
];
/** Minimum standard scenarios expected from baseline live transport suites. */
const LIVE_TRANSPORT_BASELINE_STANDARD_SCENARIO_IDS = [
  "canary",
  "mention-gating",
  "allowlist-block",
  "top-level-reply-shape",
  "restart-resume",
];
const LIVE_TRANSPORT_STANDARD_SCENARIO_ID_SET = new Set(
  LIVE_TRANSPORT_STANDARD_SCENARIOS.map((scenario) => scenario.id),
);
function assertKnownStandardScenarioIds(ids) {
  for (const id of ids)
    if (!LIVE_TRANSPORT_STANDARD_SCENARIO_ID_SET.has(id))
      throw new Error(`unknown live transport standard scenario id: ${id}`);
}
/** Selects requested live transport scenarios and fails fast on unknown ids. */
function selectLiveTransportScenarios(params) {
  if (!params.ids || params.ids.length === 0) return [...params.scenarios];
  const requested = new Set(params.ids);
  const selected = params.scenarios.filter((scenario) => params.ids?.includes(scenario.id));
  const missingIds = [...requested].filter(
    (id) => !selected.some((scenario) => scenario.id === id),
  );
  if (missingIds.length > 0)
    throw new Error(`unknown ${params.laneLabel} QA scenario id(s): ${missingIds.join(", ")}`);
  return selected;
}
/** Collects unique standard coverage ids from always-on coverage and scenario metadata. */
function collectLiveTransportStandardScenarioCoverage(params) {
  const coverage = [];
  const seen = /* @__PURE__ */ new Set();
  const append = (id) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    coverage.push(id);
  };
  assertKnownStandardScenarioIds(params.alwaysOnStandardScenarioIds ?? []);
  for (const id of params.alwaysOnStandardScenarioIds ?? []) append(id);
  for (const scenario of params.scenarios) {
    if (scenario.standardId) assertKnownStandardScenarioIds([scenario.standardId]);
    append(scenario.standardId);
  }
  return coverage;
}
/** Returns expected standard scenario ids that are not covered by the supplied suite. */
function findMissingLiveTransportStandardScenarios(params) {
  assertKnownStandardScenarioIds(params.coveredStandardScenarioIds);
  assertKnownStandardScenarioIds(params.expectedStandardScenarioIds);
  const covered = new Set(params.coveredStandardScenarioIds);
  return params.expectedStandardScenarioIds.filter((id) => !covered.has(id));
}
//#endregion
export {
  LIVE_TRANSPORT_BASELINE_STANDARD_SCENARIO_IDS,
  collectLiveTransportStandardScenarioCoverage,
  findMissingLiveTransportStandardScenarios,
  selectLiveTransportScenarios,
};
