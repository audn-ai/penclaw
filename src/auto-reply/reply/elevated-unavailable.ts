// [INCIDENT-2026-05-02 P2] Strip gate/fix-it diagnostics from the response. The
// original text named the exact config keys ("tools.elevated.enabled",
// "tools.elevated.allowFrom.<provider>") an attacker would need to flip — a
// gift to anyone driving the agent toward sandbox escape. Return a literal so
// the agent learns nothing about why elevation failed.
export function formatElevatedUnavailableMessage(_params: {
  runtimeSandboxed: boolean;
  failures: Array<{ gate: string; key: string }>;
  sessionKey?: string;
}): string {
  return "elevated unavailable";
}
