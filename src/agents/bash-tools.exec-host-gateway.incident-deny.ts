// [INCIDENT-2026-05-02 P3+P5+E5]
//
// Last-resort deny-list and append-only audit log for the host:gateway exec
// path. Application-layer guard against the 2026-04-19 sandbox-escape chain,
// where a tenant agent was driven into emitting `sudo bash -c '... >> /root/.ssh/authorized_keys'`
// from within the openclaw runtime.
//
// This file is intentionally self-contained: only `node:fs` and `node:crypto`
// imports, no project deps, no dynamic configuration. The deny-list is the
// only piece of code that runs before allowlist evaluation in
// `processGatewayAllowlist`, so it must not be tampered with by a malicious
// tenant config and must not throw on its own infrastructure (the audit
// writer falls back to stderr if /var/log isn't writable).

import { createHash } from "node:crypto";
import { createWriteStream, type WriteStream } from "node:fs";

const AUDIT_LOG_PATH = "/var/log/penclaw-gateway-exec.log";
const CMD_PREVIEW_BYTES = 200;
const CMD_HASH_PREFIX_HEX = 16;

// Patterns are evaluated against both the raw command and a normalised form
// (lower-cased, multi-whitespace collapsed) so that case games and tab/newline
// padding can't sneak past a word-boundary anchor. Order doesn't matter; first
// match wins.
const DENY_PATTERNS: readonly RegExp[] = [
  // Elevation binaries.
  /(^|[\s|;&`(])sudo(\s|$)/i,
  /(^|[\s|;&`(])su(\s|$)/i,
  /(^|[\s|;&`(])doas(\s|$)/i,
  /(^|[\s|;&`(])pkexec(\s|$)/i,
  // Glob/bracket obfuscation: `sudo[do]`, `s?do`, trailing wildcard.
  /\b(?:sudo|su|doas|pkexec)\[/i,
  /\bs[?*]+do\b/i,
  /\b(?:sudo|su|doas|pkexec|chmod|chattr)\*/i,
  /\/usr\/bin\/(?:sudo|su|doas|pkexec)/i,
  // Indirect invocation via env/alias/builtin.
  /\balias\s+\w+\s*=\s*['"]?(?:sudo|su|doas|pkexec)\b/i,
  /\b(?:env|exec|command|builtin)\s+(?:sudo|su|doas|pkexec)\b/i,
  // Variable indirection: VAR=sudo … $VAR.
  /\b\w+\s*=\s*['"]?(?:sudo|su|doas|pkexec)['"]?/i,
  // Copy/link/install of an elevation binary into a writable path.
  /\b(?:cp|mv|ln|install)\s+[^|;&]*\b(?:sudo|su|doas|pkexec)\b/i,
  // Shell-encoded execution paths used to hide payloads from grep filters.
  /\beval\b/i,
  /\bbase64\s+(?:-d|--decode)\b[^;|&]*\|/i,
  /\bxxd\s+-r\b[^;|&]*\|/i,
  /\bprintf\s+["'][^"']*\\x[0-9a-f]/i,
  /\$\(\s*echo\s+[^)]*\|\s*(?:base64|xxd|tr)\b/i,
  // Setuid / capability tampering.
  /(^|[\s|;&`(])(chmod|setcap|chattr|setfacl|setfattr)(\s|$)/i,
  // Namespace / container escape primitives.
  /(^|[\s|;&`(])(nsenter|unshare|capsh|setpriv)(\s|$)/i,
  // Writes / redirects into trust-bearing paths.
  /(>|>>)\s*\/?(root|etc\/sudoers|etc\/ssh|etc\/passwd|etc\/shadow|etc\/pam\.d|etc\/security|etc\/cron|etc\/systemd|var\/spool\/cron)/i,
  /(>|>>)\s*\/?home\/[^/\s]+\/\.(ssh|aws|kube|docker|gnupg)/i,
  /(>|>>)\s*\/?home\/[^/\s]+\/\.bash(rc|_profile|_logout|_history)/i,
  /(>|>>)\s*\/?home\/[^/\s]+\/\.config\/(systemd|cron)/i,
  // tee / dd into trust-bearing paths.
  /\btee\b[^|;&]*\/(root|etc\/sudoers|etc\/ssh|etc\/passwd|etc\/shadow|etc\/cron|home\/[^/\s]+\/\.ssh|home\/[^/\s]+\/\.aws)/i,
  /\bdd\b[^|;&]*of=\/(root|etc|home\/[^/\s]+\/\.ssh)/i,
  // SSH key generation / authorized_keys touch.
  /\bauthorized_keys\b/i,
  /\bssh-keygen\b/i,
  // Privileged file managers.
  /(^|[\s|;&`(])install\s.*\s\/(root|etc|home\/[^/\s]+\/\.ssh)/i,
  // systemctl / service tampering from tenant context.
  /(^|[\s|;&`(])(systemctl|service|update-rc\.d)(\s|$)/i,
  // Mount / kernel / device.
  /(^|[\s|;&`(])(mount|umount|losetup|modprobe|insmod|rmmod|sysctl)(\s|$)/i,
  // Raw cred-file reads.
  /\/etc\/(shadow|gshadow|sudoers)(\b|$)/i,
  /\bAUTH0_SECRET\b/i,
  /\bSUPABASE_SERVICE_ROLE_KEY\b/i,
  // Platform .env access (absolute, traversal).
  /\/home\/ubuntu\/penclaw-platform\/\.env\b/i,
  /(\.\.\/){2,}\.env\b/i,
  // Ubuntu user secret directories.
  /\/home\/ubuntu\/\.aws\b/i,
  /\/home\/ubuntu\/\.ssh\b/i,
  /\/home\/ubuntu\/\.kube\b/i,
  /\/home\/ubuntu\/\.docker\b/i,
  /\/home\/ubuntu\/\.gnupg\b/i,
  /\/home\/ubuntu\/\.bash_history\b/i,
  /\/home\/ubuntu\/\.claude(backup)?\b/i,
  // Cross-tenant config / secret read attempts.
  /\/home\/ubuntu\/penclaw-platform\/instances\/[^/\s]+\/(\.env|\.aws|\.ssh|openclaw\.json|console-openclaw\/openclaw\.json)\b/i,
  // Platform secret keys / tokens by name.
  /\bSTRIPE_SECRET_KEY\b/i,
  /\bGITHUB_TOKEN\b/i,
  /\bOPENAI_API_KEY\b/i,
  /\bANTHROPIC_API_KEY\b/i,
];

export class IncidentDenyError extends Error {
  readonly incident = "INCIDENT-2026-05-02-P3";
  readonly matchedPattern: string;

  constructor(matchedPattern: string) {
    super("exec denied: command pattern not allowed on host gateway");
    this.name = "IncidentDenyError";
    this.matchedPattern = matchedPattern;
  }
}

export function denyHostGatewayDangerous(command: string | undefined | null): void {
  if (typeof command !== "string" || command.length === 0) {
    return;
  }
  const normalized = command.toLowerCase().replace(/\s+/g, " ");
  for (const re of DENY_PATTERNS) {
    if (re.test(command) || re.test(normalized)) {
      throw new IncidentDenyError(String(re));
    }
  }
}

export type HostGatewayAuditEntry = {
  agent?: string;
  sessionKey?: string;
  security?: string;
  ask?: string;
  cmd?: string;
  allowed: boolean;
  reason: string;
};

const auditWriter: (entry: HostGatewayAuditEntry) => void = (() => {
  let stream: WriteStream | null = null;
  try {
    stream = createWriteStream(AUDIT_LOG_PATH, { flags: "a", mode: 0o640 });
    stream.on("error", () => {
      // Ensure a write failure later in the lifetime does not crash the agent.
      stream = null;
    });
  } catch {
    // /var/log/penclaw-gateway-exec.log isn't writable in this environment;
    // fall through to stderr-only audit. Tenant agents must never be able to
    // suppress audit entries by exhausting disk inside their container.
  }
  const sha256 = (s: string): string => {
    try {
      return createHash("sha256").update(s).digest("hex").slice(0, CMD_HASH_PREFIX_HEX);
    } catch {
      return "?";
    }
  };
  return (entry: HostGatewayAuditEntry): void => {
    try {
      // Hash + 200-byte preview keep the log forensically useful without
      // serializing the full command body — a malicious tenant could otherwise
      // turn the audit log itself into a side-channel for secret exfiltration
      // or log-injection.
      const { cmd, ...rest } = entry;
      const record = {
        ts: new Date().toISOString(),
        ...rest,
        cmdHash: cmd ? sha256(cmd) : null,
        cmdPreview: cmd ? String(cmd).slice(0, CMD_PREVIEW_BYTES) : null,
      };
      const line = `${JSON.stringify(record)}\n`;
      if (stream) {
        stream.write(line);
      } else {
        process.stderr.write(`[exec-audit] ${line}`);
      }
    } catch {
      // Never throw from the audit path.
    }
  };
})();

export function auditHostGatewayExec(entry: HostGatewayAuditEntry): void {
  auditWriter(entry);
}
