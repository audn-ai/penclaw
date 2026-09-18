import "./agent-scope-y9xQv_q1.js";
import { r as resolveAgentConfig } from "./agent-scope-config-DVIR1nBa.js";
import { a as resolveToolsBySender } from "./group-policy-7QrY--DR.js";
import { n as pickSandboxToolPolicy } from "./sandbox-tool-policy-ClB7s2K0.js";
//#region src/agents/sender-tool-policy.ts
/**
 * Sender-scoped sandbox tool policy resolver.
 * Applies per-agent toolsBySender matches before global sender policy so
 * channel delivery can narrow tool access by sender identity.
 */
/** Resolves sender-scoped sandbox tool policy, preferring agent config over global config. */
function resolveSenderToolPolicy(params) {
  const cfg = params.config;
  if (!cfg) return;
  const sender = {
    messageProvider: params.messageProvider,
    senderId: params.senderId,
    senderName: params.senderName,
    senderUsername: params.senderUsername,
    senderE164: params.senderE164,
  };
  const agentPolicy = resolveToolsBySender({
    toolsBySender: (params.agentId && params.agentId.trim()
      ? resolveAgentConfig(cfg, params.agentId)?.tools
      : void 0
    )?.toolsBySender,
    ...sender,
  });
  if (agentPolicy) return pickSandboxToolPolicy(agentPolicy);
  return pickSandboxToolPolicy(
    resolveToolsBySender({
      toolsBySender: cfg.tools?.toolsBySender,
      ...sender,
    }),
  );
}
//#endregion
export { resolveSenderToolPolicy as t };
