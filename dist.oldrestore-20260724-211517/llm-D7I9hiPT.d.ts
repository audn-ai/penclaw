import { Agent } from "node:http";
import { Agent as Agent$1 } from "node:https";
import { ApiProvider } from "@openclaw/ai";
import {
  calculateCost as calculateCost$1,
  clampThinkingLevel as clampThinkingLevel$1,
  complete,
  completeSimple,
  getApiProvider as getApiProvider$1,
  getApiProviders,
  getEnvApiKey as getEnvApiKey$1,
  parseStreamingJson as parseStreamingJson$1,
  registerApiProvider as registerApiProvider$1,
  sanitizeSurrogates as sanitizeSurrogates$1,
  stream,
  streamSimple,
  unregisterApiProviders,
} from "@openclaw/ai/internal/runtime";
import {
  adjustMaxTokensForThinking,
  buildBaseOptions,
  clampReasoning,
  transformMessages,
} from "@openclaw/ai/internal/shared";

//#region src/llm/utils/node-http-proxy.d.ts
/** HTTP(S) agent pair for Node fetch/client integrations that accept explicit agents. */
interface NodeHttpProxyAgents {
  httpAgent: Agent;
  httpsAgent: Agent$1;
}
/** Builds fixed HTTP and HTTPS proxy agents for a target URL, when env proxy config applies. */
declare function createHttpProxyAgentsForTarget(
  targetUrl: string | URL,
): NodeHttpProxyAgents | undefined;
//#endregion
export {
  completeSimple as _,
  clampReasoning as a,
  getApiProviders as c,
  registerApiProvider$1 as d,
  sanitizeSurrogates$1 as f,
  complete as g,
  createHttpProxyAgentsForTarget as h,
  calculateCost$1 as i,
  getEnvApiKey$1 as l,
  unregisterApiProviders as m,
  adjustMaxTokensForThinking as n,
  clampThinkingLevel$1 as o,
  transformMessages as p,
  buildBaseOptions as r,
  getApiProvider$1 as s,
  ApiProvider as t,
  parseStreamingJson$1 as u,
  stream as v,
  streamSimple as y,
};
