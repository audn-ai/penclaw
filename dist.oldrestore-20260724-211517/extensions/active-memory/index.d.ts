import {
  a as normalizePluginConfig,
  d as setMinimumTimeoutMsForTests,
  f as setSetupGraceTimeoutMsForTests,
  i as isMissingRegisteredMemoryToolsError,
} from "../../config-C9cx8BnI.js";
import {
  v as OpenClawPluginConfigSchema,
  y as OpenClawPluginDefinition$1,
} from "../../plugin-entry-DPCR66aO.js";
import { n as buildPromptPrefix, t as buildMetadata } from "../../prompt-DQHjsStn.js";
import { n as buildSearchQuery } from "../../query-Chzlw43P.js";
import {
  a as isCircuitBreakerOpen,
  d as shouldCacheResult,
  i as getCircuitBreakerEntry,
  n as buildCircuitBreakerKey,
  r as getCachedResult,
  t as buildCacheKey,
  u as setCachedResult,
} from "../../recall-state-C2WOkJO2.js";
import { n as buildPluginStatusLine } from "../../session-SDjIIkWZ.js";
import { s as hasUsableMemoryResultInSessionRecord } from "../../transcript-Bt7ZPlVR.js";
import {
  a as readPartialAssistantText,
  l as setTimeoutPartialDataGraceMsForTests,
} from "../../transcript-result-ptlwKRl-.js";
import { t as readActiveMemorySearchDebug } from "../../transcript-watch-CHqH2cwl.js";
import { A as OpenClawPluginDefinition } from "../../types-Ga3mNO_F.js";

//#region extensions/active-memory/index.d.ts
/** Plugin entry registering Active Memory hooks, tools, config schema, and doctor cleanup. */
declare const _default: {
  id: string;
  name: string;
  description: string;
  configSchema: OpenClawPluginConfigSchema;
  register: NonNullable<OpenClawPluginDefinition$1["register"]>;
} & Pick<
  OpenClawPluginDefinition,
  "kind" | "reload" | "nodeHostCommands" | "securityAuditCollectors"
>;
declare const testing: {
  buildSearchQuery: typeof buildSearchQuery;
  buildCacheKey: typeof buildCacheKey;
  buildCircuitBreakerKey: typeof buildCircuitBreakerKey;
  buildMetadata: typeof buildMetadata;
  buildPluginStatusLine: typeof buildPluginStatusLine;
  buildPromptPrefix: typeof buildPromptPrefix;
  getCachedResult: typeof getCachedResult;
  hasUsableMemoryResultInSessionRecord: typeof hasUsableMemoryResultInSessionRecord;
  isCircuitBreakerOpen: typeof isCircuitBreakerOpen;
  isMissingRegisteredMemoryToolsError: typeof isMissingRegisteredMemoryToolsError;
  normalizePluginConfig: typeof normalizePluginConfig;
  readActiveMemorySearchDebug: typeof readActiveMemorySearchDebug;
  readPartialAssistantText: typeof readPartialAssistantText;
  shouldCacheResult: typeof shouldCacheResult;
  resetActiveRecallCacheForTests(): void;
  setMinimumTimeoutMsForTests: typeof setMinimumTimeoutMsForTests;
  setSetupGraceTimeoutMsForTests: typeof setSetupGraceTimeoutMsForTests;
  setTimeoutPartialDataGraceMsForTests: typeof setTimeoutPartialDataGraceMsForTests;
  setCachedResult: typeof setCachedResult;
  getCircuitBreakerEntry: typeof getCircuitBreakerEntry;
};
//#endregion
export { testing as __testing, testing, _default as default };
