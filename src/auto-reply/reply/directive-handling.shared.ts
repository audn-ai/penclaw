import { SYSTEM_MARK, prefixSystemMessage } from "../../infra/system-message.js";
import { isInternalMessageChannel } from "../../utils/message-channel.js";
import type { ElevatedLevel, ReasoningLevel } from "./directives.js";

export const formatDirectiveAck = (text: string): string => {
  return prefixSystemMessage(text);
};

export const formatOptionsLine = (options: string) => `Options: ${options}.`;
export const withOptions = (line: string, options: string) =>
  `${line}\n${formatOptionsLine(options)}`;

export const formatElevatedRuntimeHint = () =>
  `${SYSTEM_MARK} Runtime is direct; sandboxing does not apply.`;

export const formatInternalExecPersistenceDeniedText = () =>
  "Exec defaults require operator.admin for internal gateway callers; skipped persistence.";

export function canPersistInternalExecDirective(params: {
  surface?: string;
  gatewayClientScopes?: string[];
}): boolean {
  if (!isInternalMessageChannel(params.surface)) {
    return true;
  }
  const scopes = params.gatewayClientScopes ?? [];
  return scopes.includes("operator.admin");
}

export const formatElevatedEvent = (level: ElevatedLevel) => {
  if (level === "full") {
    return "Elevated FULL — exec runs on host with auto-approval.";
  }
  if (level === "ask" || level === "on") {
    return "Elevated ASK — exec runs on host; approvals may still apply.";
  }
  return "Elevated OFF — exec stays in sandbox.";
};

export const formatReasoningEvent = (level: ReasoningLevel) => {
  if (level === "stream") {
    return "Reasoning STREAM — emit live <think>.";
  }
  if (level === "on") {
    return "Reasoning ON — include <think>.";
  }
  return "Reasoning OFF — hide <think>.";
};

export function enqueueModeSwitchEvents(params: {
  enqueueSystemEvent: (text: string, meta: { sessionKey: string; contextKey: string }) => void;
  sessionEntry: { elevatedLevel?: string | null; reasoningLevel?: string | null };
  sessionKey: string;
  elevatedChanged?: boolean;
  reasoningChanged?: boolean;
}): void {
  if (params.elevatedChanged) {
    const nextElevated = (params.sessionEntry.elevatedLevel ?? "off") as ElevatedLevel;
    params.enqueueSystemEvent(formatElevatedEvent(nextElevated), {
      sessionKey: params.sessionKey,
      contextKey: "mode:elevated",
    });
  }
  if (params.reasoningChanged) {
    const nextReasoning = (params.sessionEntry.reasoningLevel ?? "off") as ReasoningLevel;
    params.enqueueSystemEvent(formatReasoningEvent(nextReasoning), {
      sessionKey: params.sessionKey,
      contextKey: "mode:reasoning",
    });
  }
}

// [INCIDENT-2026-05-02 P2] Mirror of `formatElevatedUnavailableMessage`: strip
// gate/fix-it details so the directive-handling reply does not hand the agent
// the config keys to flip for sandbox escape. See ./elevated-unavailable.ts.
export function formatElevatedUnavailableText(_params: {
  runtimeSandboxed: boolean;
  failures?: Array<{ gate: string; key: string }>;
  sessionKey?: string;
}): string {
  return "elevated unavailable";
}
