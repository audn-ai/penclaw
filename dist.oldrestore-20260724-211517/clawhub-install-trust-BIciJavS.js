import { r as stripAnsi, s as visibleWidth } from "./ansi-D4OHEz5F.js";
import {
  C as resolveClawHubBaseUrl,
  _ as fetchClawHubSkillVerification,
  c as fetchClawHubPackageSecurity,
  g as fetchClawHubSkillSecurityVerdicts,
} from "./clawhub-CgGOpxts.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { t as formatTerminalLink } from "./terminal-link-GrnqEUaJ.js";
import { r as theme } from "./theme-vjDs9tao.js";
//#region src/infra/clawhub-install-trust.ts
const CLAWHUB_TRUST_ERROR_CODE = {
  CLAWHUB_SECURITY_UNAVAILABLE: "clawhub_security_unavailable",
  CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED: "clawhub_risk_acknowledgement_required",
  CLAWHUB_DOWNLOAD_BLOCKED: "clawhub_download_blocked",
};
const CLAWHUB_RISK_MODERATION_STATES = /* @__PURE__ */ new Set([
  "blocked",
  "quarantined",
  "revoked",
]);
const CLAWHUB_BLOCKING_MODERATION_STATES = /* @__PURE__ */ new Set([
  "blocked",
  "quarantined",
  "revoked",
]);
const CLAWHUB_SAFE_MODERATION_STATES = /* @__PURE__ */ new Set(["", "approved"]);
const CLAWHUB_NON_RISK_SCAN_STATUSES = /* @__PURE__ */ new Set([
  "pending",
  "scan_pending",
  "stale",
  "stale_scan",
]);
const CLAWHUB_NON_RISK_REASONS = /* @__PURE__ */ new Set([
  "pending",
  "pending_scan",
  "scan:pending",
  "scan_pending",
  "stale",
  "scan:stale",
  "stale_scan",
]);
const CLAWHUB_NON_SECURITY_SKILL_VERIFY_REASONS = /* @__PURE__ */ new Set([
  "card.missing",
  "card_missing",
]);
const CLAWHUB_EVIDENCE_LABEL_WIDTH = 15;
const CLAWHUB_RAW_LINK_LABEL_WIDTH = 16;
function normalizeClawHubTrustToken(value) {
  return normalizeOptionalString(value)?.toLowerCase() ?? "";
}
function formatClawHubTrustStatus(label, token) {
  return token ? `${label} is ${token}` : `${label} is missing`;
}
function formatClawHubReasonCode(reason) {
  switch (normalizeClawHubTrustToken(reason)) {
    case "scan:malicious":
      return "malicious behavior detected";
    case "static:malicious":
      return "malicious behavior detected";
    case "payload_strings":
      return "suspicious payload strings";
    case "security.status_not_clean":
      return "security status is not clean";
    case "skill.not_found":
      return "skill was not found";
    case "version.not_found":
      return "skill version was not found";
    case "scan:pending":
    case "pending_scan":
    case "scan_pending":
      return "scan pending";
    case "scan:stale":
    case "stale_scan":
      return "scan data stale";
    default:
      return reason;
  }
}
function isPendingOrStaleTrustWarning(trust) {
  return trust.pending || trust.stale;
}
function isNonRiskScanStatus(trust, scanStatus) {
  return isPendingOrStaleTrustWarning(trust) && CLAWHUB_NON_RISK_SCAN_STATUSES.has(scanStatus);
}
function isNonRiskReason(trust, reason) {
  return isPendingOrStaleTrustWarning(trust) && CLAWHUB_NON_RISK_REASONS.has(reason);
}
function resolveClawHubRiskReasons(trust) {
  const reasons = [];
  if (trust.blockedFromDownload) reasons.push("Download disabled by ClawHub for this release");
  const scanStatus = normalizeClawHubTrustToken(trust.scanStatus);
  if (scanStatus !== "clean" && !isNonRiskScanStatus(trust, scanStatus))
    reasons.push(formatClawHubTrustStatus("security scan status", scanStatus));
  const moderationState = normalizeClawHubTrustToken(trust.moderationState);
  if (
    CLAWHUB_RISK_MODERATION_STATES.has(moderationState) ||
    !CLAWHUB_SAFE_MODERATION_STATES.has(moderationState)
  )
    reasons.push(formatClawHubTrustStatus("moderation state", moderationState));
  for (const reason of trust.reasons) {
    const normalized = normalizeClawHubTrustToken(reason);
    if (normalized && !isNonRiskReason(trust, normalized))
      reasons.push(formatClawHubReasonCode(reason));
  }
  return reasons;
}
function resolveClawHubTrustStatusNotices(trust) {
  const notices = [];
  if (trust.pending) notices.push("security scan is pending");
  if (trust.stale) notices.push("scan data is stale");
  for (const reason of trust.reasons) {
    const normalized = normalizeClawHubTrustToken(reason);
    if (normalized && isNonRiskReason(trust, normalized))
      notices.push(formatClawHubReasonCode(reason));
  }
  return notices;
}
function isBlockingClawHubTrust(trust) {
  if (trust.blockedFromDownload) return true;
  if (normalizeClawHubTrustToken(trust.scanStatus) === "malicious") return true;
  if (CLAWHUB_BLOCKING_MODERATION_STATES.has(normalizeClawHubTrustToken(trust.moderationState)))
    return true;
  return trust.reasons.some((reason) => {
    const normalized = normalizeClawHubTrustToken(reason);
    return normalized === "scan:malicious" || normalized === "static:malicious";
  });
}
function hasMaliciousClawHubTrustSignal(trust) {
  if (normalizeClawHubTrustToken(trust.scanStatus) === "malicious") return true;
  return trust.reasons.some((reason) => {
    const normalized = normalizeClawHubTrustToken(reason);
    return normalized === "scan:malicious" || normalized === "static:malicious";
  });
}
function assessClawHubTrust(trust) {
  const riskReasons = resolveClawHubRiskReasons(trust);
  const notices = resolveClawHubTrustStatusNotices(trust);
  if (riskReasons.length === 0 && notices.length === 0)
    return {
      disposition: "clean",
      riskReasons,
      notices,
    };
  if (isBlockingClawHubTrust(trust))
    return {
      disposition: "blocked",
      riskReasons,
      notices,
    };
  if (riskReasons.length > 0)
    return {
      disposition: "review-required",
      riskReasons,
      notices,
    };
  return {
    disposition: "review-recommended",
    riskReasons,
    notices,
  };
}
function buildClawHubTrustInstallRecordFields(params) {
  const scanStatus = normalizeClawHubTrustToken(params.trust.scanStatus);
  const moderationState = normalizeClawHubTrustToken(params.trust.moderationState);
  const reasons = params.trust.reasons
    .map((reason) => normalizeOptionalString(reason))
    .filter((reason) => Boolean(reason));
  return {
    clawhubTrustDisposition: params.assessment.disposition,
    ...(scanStatus ? { clawhubTrustScanStatus: scanStatus } : {}),
    ...(moderationState ? { clawhubTrustModerationState: moderationState } : {}),
    ...(reasons.length > 0 ? { clawhubTrustReasons: reasons } : {}),
    ...(params.trust.pending ? { clawhubTrustPending: true } : {}),
    ...(params.trust.stale ? { clawhubTrustStale: true } : {}),
    clawhubTrustCheckedAt: params.checkedAt,
    ...(params.acknowledgedAt ? { clawhubTrustAcknowledgedAt: params.acknowledgedAt } : {}),
  };
}
function encodeClawHubPackagePath(packageName) {
  return packageName
    .split("/")
    .map((part) => encodeURIComponent(part).replaceAll("%40", "@"))
    .join("/");
}
function resolveClawHubSubjectUrl(params) {
  if (params.subject.kind === "skill" && params.subject.ownerHandle)
    return `${resolveClawHubBaseUrl(params.baseUrl)}/${encodeURIComponent(params.subject.ownerHandle)}/skills/${encodeURIComponent(params.subject.packageName)}`;
  const pathRoot = params.subject.kind === "skill" ? "skills" : "plugins";
  return `${resolveClawHubBaseUrl(params.baseUrl)}/${pathRoot}/${encodeClawHubPackagePath(params.subject.packageName)}`;
}
function resolveClawHubSecurityLinks(params) {
  const subjectUrl = resolveClawHubSubjectUrl(params);
  if (params.subject.kind === "skill") {
    const resolvedSubjectUrl = normalizeOptionalString(params.links?.subject) ?? subjectUrl;
    return {
      subject: resolvedSubjectUrl,
      security:
        normalizeOptionalString(params.links?.security) ??
        `${resolvedSubjectUrl}/security-audit?version=${encodeURIComponent(params.version)}`,
    };
  }
  return {
    subject: subjectUrl,
    clawscan: `${subjectUrl}/security/clawscan`,
  };
}
function padRight(value, width) {
  return `${value}${" ".repeat(Math.max(0, width - visibleWidth(value)))}`;
}
function wrapWords(text, width) {
  if (visibleWidth(text) <= width) return [text];
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (visibleWidth(next) > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
function resolveClawHubTrustAccent(disposition) {
  switch (disposition) {
    case "blocked":
      return theme.error;
    case "review-required":
      return theme.warn;
    case "review-recommended":
      return theme.info;
    case "clean":
      return theme.success;
  }
  return theme.info;
}
function formatClawHubEvidenceLine(params) {
  const label = sanitizeTerminalText(params.label).replace(/:$/u, "");
  return `${theme.muted(`• ${padRight(label, CLAWHUB_EVIDENCE_LABEL_WIDTH)}`)} ${params.accent(params.value)}`;
}
function renderClawHubTrustBox(title, lines, disposition) {
  const accent = resolveClawHubTrustAccent(disposition);
  const columns = Math.max(72, Math.min(process.stdout.columns ?? 88, 104));
  const innerWidth = Math.max(54, Math.min(columns - 4, 78));
  const borderWidth = innerWidth + 4 - 2;
  const titleSegment = `─ ${title} `;
  const titleFillWidth = Math.max(0, borderWidth - visibleWidth(titleSegment));
  const top = accent(`╭${titleSegment}${"─".repeat(titleFillWidth)}╮`);
  const bottom = accent(`╰${"─".repeat(borderWidth)}╯`);
  return [
    top,
    ...lines.flatMap((line) => {
      if (line === "") return [`${accent("│")} ${" ".repeat(innerWidth)} ${accent("│")}`];
      return wrapWords(line, innerWidth).map(
        (wrapped) => `${accent("│")} ${padRight(wrapped, innerWidth)} ${accent("│")}`,
      );
    }),
    bottom,
  ].join("\n");
}
function formatLinkedClawHubValue(params) {
  const label = sanitizeTerminalText(params.label);
  return formatTerminalLink(label, sanitizeTerminalText(params.url), {
    fallback: label,
    ...(params.terminalLinks !== void 0 ? { force: params.terminalLinks } : {}),
  });
}
function formatClawHubTrustEvidenceLines(params) {
  const lines = [];
  const accent = resolveClawHubTrustAccent(params.assessment.disposition);
  const securityLink = "clawscan" in params.links ? params.links.clawscan : params.links.security;
  const addLine = (label, value) => {
    lines.push(
      formatClawHubEvidenceLine({
        label,
        value,
        accent,
      }),
    );
  };
  const linked = (label, url) =>
    formatLinkedClawHubValue({
      label,
      url,
      terminalLinks: params.terminalLinks,
    });
  const scanStatus = normalizeClawHubTrustToken(params.trust.scanStatus);
  if (scanStatus) addLine("Security scan:", linked(scanStatus, securityLink));
  const moderationState = normalizeClawHubTrustToken(params.trust.moderationState);
  if (moderationState && !CLAWHUB_SAFE_MODERATION_STATES.has(moderationState))
    addLine("Moderation:", sanitizeTerminalText(moderationState));
  for (const reason of params.trust.reasons) {
    const normalized = normalizeClawHubTrustToken(reason);
    if (!normalized) continue;
    if (
      params.assessment.disposition === "review-recommended" &&
      isNonRiskReason(params.trust, normalized)
    )
      continue;
    switch (normalized) {
      case "scan:malicious":
        addLine("Scanner:", linked("malicious behavior detected", securityLink));
        break;
      case "static:malicious":
        addLine("Scanner:", linked("malicious behavior detected", securityLink));
        break;
      case "payload_strings":
        addLine("Finding:", linked("suspicious payload strings", securityLink));
        break;
      default:
        addLine("Finding:", sanitizeTerminalText(formatClawHubReasonCode(reason)));
        break;
    }
  }
  if (params.assessment.disposition === "review-recommended")
    for (const notice of params.assessment.notices)
      addLine("Status:", sanitizeTerminalText(notice));
  if (params.trust.blockedFromDownload)
    addLine("Finding:", "Download disabled by ClawHub for this release");
  if (lines.length === 0)
    for (const reason of params.assessment.riskReasons)
      addLine("Finding:", sanitizeTerminalText(reason));
  return lines;
}
function formatClawHubRawLinkLine(label, url) {
  return `  ${theme.muted(padRight(label, CLAWHUB_RAW_LINK_LABEL_WIDTH))} ${theme.info(sanitizeTerminalText(url))}`;
}
function formatClawHubRawLinks(params) {
  const subjectUrl = sanitizeTerminalText(params.links.subject);
  if ("security" in params.links)
    return [
      "",
      "Links:",
      formatClawHubRawLinkLine("Skill", subjectUrl),
      formatClawHubRawLinkLine("Security details", params.links.security),
    ].join("\n");
  return [
    "",
    "Links:",
    formatClawHubRawLinkLine("Plugin", subjectUrl),
    formatClawHubRawLinkLine("Security scan", params.links.clawscan),
  ].join("\n");
}
function formatClawHubTrustWarning(params) {
  const links = resolveClawHubSecurityLinks({
    baseUrl: params.baseUrl,
    subject: params.subject,
    version: params.version,
    links: params.links,
  });
  const evidenceLines = formatClawHubTrustEvidenceLines({
    trust: params.trust,
    assessment: params.assessment,
    links,
    terminalLinks: params.terminalLinks,
  });
  const noun = params.subject.kind;
  if (params.assessment.disposition === "blocked") {
    const malicious = hasMaliciousClawHubTrustSignal(params.trust);
    const blockedActionLines =
      params.mode === "update"
        ? malicious
          ? [
              `Latest ${noun} version is marked malicious; OpenClaw will not download it.`,
              `Uninstall the installed ${noun} unless you have independently reviewed it.`,
            ]
          : [`Latest ${noun} version is blocked by ClawHub; OpenClaw will not download it.`]
        : [`OpenClaw will not install this ${noun} release from ClawHub.`];
    return [
      renderClawHubTrustBox(
        malicious
          ? "BLOCKED - ClawHub flagged this release as malicious"
          : "BLOCKED - ClawHub blocked this release",
        [
          ...evidenceLines,
          "",
          ...blockedActionLines,
          "Review the ClawHub security details or contact the package maintainer if you believe this is wrong.",
        ],
        params.assessment.disposition,
      ),
      formatClawHubRawLinks({
        subject: params.subject,
        links,
      }),
    ].join("\n");
  }
  if (params.assessment.disposition === "review-required") {
    const riskContext =
      params.subject.kind === "plugin"
        ? "This plugin is not marked malicious, but ClawHub found security findings or a large local system blast radius."
        : "This skill is not marked malicious, but ClawHub found security findings or a large instruction/tool-use blast radius.";
    return [
      renderClawHubTrustBox(
        "WARNING - ClawHub found security risks in this release",
        [
          ...evidenceLines,
          "",
          riskContext,
          `Review the ClawHub security details before ${params.mode === "update" ? "updating" : "installing"}.`,
        ],
        params.assessment.disposition,
      ),
      formatClawHubRawLinks({
        subject: params.subject,
        links,
      }),
    ].join("\n");
  }
  return [
    renderClawHubTrustBox(
      "REVIEW RECOMMENDED - ClawHub has not completed a fresh clean check",
      [
        ...evidenceLines,
        "",
        `This does not mean the ${noun} is malicious, but ClawHub has not completed a clean security check for this release yet.`,
        `Review the ClawHub security details before ${params.mode === "update" ? "updating" : "installing"}.`,
      ],
      params.assessment.disposition,
    ),
    formatClawHubRawLinks({
      subject: params.subject,
      links,
    }),
  ].join("\n");
}
function formatClawHubReleaseLabel(packageName, version) {
  return `${sanitizeTerminalText(packageName)}@${sanitizeTerminalText(version)}`;
}
function formatClawHubSubjectPackageName(subject) {
  return subject.kind === "skill" && subject.ownerHandle
    ? `@${subject.ownerHandle}/${subject.packageName}`
    : subject.packageName;
}
function formatClawHubSubjectReleaseLabel(subject, version) {
  return formatClawHubReleaseLabel(formatClawHubSubjectPackageName(subject), version);
}
function validateClawHubSecurityIdentity(params) {
  const packageLabel = params.packageLabel ?? params.packageName;
  const responsePackageName = normalizeOptionalString(params.security.package?.name);
  if (responsePackageName !== params.packageName)
    return {
      ok: false,
      error: `ClawHub release trust check for "${formatClawHubReleaseLabel(packageLabel, params.version)}" returned package "${sanitizeTerminalText(responsePackageName ?? "unknown")}".`,
      code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
      version: params.version,
    };
  const responseVersion = normalizeOptionalString(params.security.release?.version);
  if (responseVersion !== params.version)
    return {
      ok: false,
      error: `ClawHub release trust check for "${formatClawHubReleaseLabel(packageLabel, params.version)}" returned version "${sanitizeTerminalText(responseVersion ?? "unknown")}".`,
      code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
      version: params.version,
    };
  return null;
}
function readSkillVerdictSecurityStatus(item) {
  if (!item.security || typeof item.security !== "object") return;
  const security = item.security;
  if (typeof security.status === "string") return security.status;
  return typeof security.rawStatus === "string" ? security.rawStatus : void 0;
}
function readSkillVerdictSecurityPassed(item) {
  if (!item.security || typeof item.security !== "object") return;
  const passed = item.security.passed;
  return typeof passed === "boolean" ? passed : void 0;
}
function hasUsablePassingSkillVerdictSecurity(item) {
  return (
    Boolean(readSkillVerdictSecurityStatus(item)) && readSkillVerdictSecurityPassed(item) === true
  );
}
function hasSkillVerdictSecurityError(item) {
  return Boolean(item.error?.code || item.error?.message || item.version === null);
}
function isSkillVerdictPendingReason(reason) {
  const normalized = normalizeClawHubTrustToken(reason);
  return normalized === "pending" || normalized === "pending_scan" || normalized === "scan_pending";
}
function isSkillVerdictStaleReason(reason) {
  const normalized = normalizeClawHubTrustToken(reason);
  return normalized === "stale" || normalized === "scan:stale" || normalized === "stale_scan";
}
function isSkillVerdictBlockingReason(reason) {
  const normalized = normalizeClawHubTrustToken(reason);
  return (
    normalized.includes("malicious") ||
    normalized.includes("malware") ||
    normalized.endsWith("_blocked") ||
    normalized.endsWith(".blocked") ||
    normalized === "blocked"
  );
}
function mapSkillSecurityVerdictToPackageSecurity(params) {
  const responseSlug = normalizeOptionalString(params.item.slug ?? params.item.requestedSlug);
  if (responseSlug !== params.packageName)
    throw new Error(
      `ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned skill "${sanitizeTerminalText(responseSlug ?? "unknown")}".`,
    );
  const responsePublisher = normalizeOptionalString(params.item.publisherHandle);
  if (params.ownerHandle && responsePublisher !== params.ownerHandle)
    throw new Error(
      `ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned publisher "${sanitizeTerminalText(responsePublisher ?? "unknown")}", expected "${sanitizeTerminalText(params.ownerHandle)}".`,
    );
  const responseVersion = normalizeOptionalString(params.item.version);
  if (responseVersion !== params.version) {
    const reason = params.item.error?.message
      ? `: ${sanitizeTerminalText(params.item.error.message)}`
      : "";
    throw new Error(
      `ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" returned version "${sanitizeTerminalText(responseVersion ?? "unknown")}"${reason}.`,
    );
  }
  if (hasSkillVerdictSecurityError(params.item)) {
    const reason = params.item.error?.message
      ? `: ${sanitizeTerminalText(params.item.error.message)}`
      : "";
    throw new Error(
      `ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" did not return a usable security verdict${reason}.`,
    );
  }
  const decision = normalizeClawHubTrustToken(params.item.decision);
  if (params.item.ok && decision === "pass" && !hasUsablePassingSkillVerdictSecurity(params.item))
    throw new Error(
      `ClawHub skill trust check for "${formatClawHubReleaseLabel(params.packageName, params.version)}" did not return a usable security verdict.`,
    );
  const securityStatus = normalizeClawHubTrustToken(readSkillVerdictSecurityStatus(params.item));
  const securityPassed = readSkillVerdictSecurityPassed(params.item);
  const reasons = params.item.reasons
    .map((reason) => normalizeOptionalString(reason))
    .filter((reason) => Boolean(reason));
  const securityPassedAllowsInstall = securityPassed ?? true;
  const verdictPassed = params.item.ok && decision === "pass" && securityPassedAllowsInstall;
  const scanStatus = verdictPassed
    ? securityStatus || "clean"
    : securityStatus && securityStatus !== "clean"
      ? securityStatus
      : "suspicious";
  if (!verdictPassed && reasons.length === 0)
    reasons.push(decision ? `decision:${decision}` : "decision:fail");
  const hasBlockingReason = reasons.some(isSkillVerdictBlockingReason);
  const displayName = normalizeOptionalString(params.item.displayName);
  return {
    package: {
      name: params.packageName,
      family: "skill",
      ...(displayName ? { displayName } : {}),
    },
    release: { version: params.version },
    trust: {
      scanStatus,
      moderationState: null,
      blockedFromDownload:
        decision === "blocked" || securityStatus === "malicious" || hasBlockingReason,
      reasons,
      pending: securityStatus === "pending" || reasons.some(isSkillVerdictPendingReason),
      stale: securityStatus === "stale" || reasons.some(isSkillVerdictStaleReason),
    },
  };
}
function resolveSkillSecurityLinks(item) {
  const subject = normalizeOptionalString(item.skillUrl);
  const security = normalizeOptionalString(item.securityAuditUrl);
  if (!subject && !security) return;
  return {
    ...(subject ? { subject } : {}),
    ...(security ? { security } : {}),
  };
}
function readObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : void 0;
}
function readOptionalStringField(value, field) {
  return normalizeOptionalString(readObject(value)?.[field]);
}
function readOptionalNumberField(value, field) {
  const raw = readObject(value)?.[field];
  return typeof raw === "number" && Number.isFinite(raw) ? raw : void 0;
}
function mapSkillVerificationSecurityForVerdict(verification, opts) {
  const security = readObject(verification.security);
  if (!security || Object.hasOwn(security, "passed")) return verification.security;
  const status =
    normalizeOptionalString(security.status) ?? normalizeOptionalString(security.rawStatus);
  const decisionPass =
    verification.ok && normalizeClawHubTrustToken(verification.decision) === "pass";
  if (!status || (!decisionPass && opts?.allowCleanCardOnlyPass !== true))
    return verification.security;
  return {
    ...security,
    passed: true,
  };
}
function hasOnlyNonSecuritySkillVerifyReasons(reasons) {
  return (
    reasons.length > 0 &&
    reasons.every((reason) =>
      CLAWHUB_NON_SECURITY_SKILL_VERIFY_REASONS.has(normalizeClawHubTrustToken(reason)),
    )
  );
}
function isOwnerQualifiedSkillNotFoundVerdict(item) {
  return item.error?.code === "skill_not_found";
}
function mapSkillVerificationToSecurityVerdictItem(params) {
  const skill = readObject(params.verification.skill);
  const publisher = readObject(params.verification.publisher);
  const versionRecord = readObject(params.verification.version);
  const pageUrl = normalizeOptionalString(params.verification.pageUrl);
  const reasons = params.verification.reasons
    .map((reason) => normalizeOptionalString(reason))
    .filter((reason) => Boolean(reason));
  const securityStatus = normalizeClawHubTrustToken(
    readOptionalStringField(params.verification.security, "status") ??
      readOptionalStringField(params.verification.security, "rawStatus"),
  );
  const cardOnlyCleanFailure =
    !params.verification.ok &&
    securityStatus === "clean" &&
    hasOnlyNonSecuritySkillVerifyReasons(reasons);
  const verifiedVersion =
    normalizeOptionalString(params.verification.version) ??
    readOptionalStringField(versionRecord, "version");
  return {
    ok: cardOnlyCleanFailure ? true : params.verification.ok,
    decision: cardOnlyCleanFailure ? "pass" : params.verification.decision,
    reasons: cardOnlyCleanFailure ? [] : reasons,
    requestedSlug: params.slug,
    requestedVersion: params.version,
    slug:
      normalizeOptionalString(params.verification.slug) ?? readOptionalStringField(skill, "slug"),
    version: verifiedVersion ?? (cardOnlyCleanFailure ? params.version : null),
    displayName:
      normalizeOptionalString(params.verification.displayName) ??
      readOptionalStringField(skill, "displayName"),
    publisherHandle:
      normalizeOptionalString(params.verification.publisherHandle) ??
      readOptionalStringField(publisher, "handle") ??
      params.ownerHandle,
    publisherDisplayName:
      normalizeOptionalString(params.verification.publisherDisplayName) ??
      readOptionalStringField(publisher, "displayName"),
    createdAt:
      params.verification.createdAt ?? readOptionalNumberField(versionRecord, "createdAt") ?? null,
    checkedAt: readOptionalNumberField(params.verification.security, "checkedAt") ?? null,
    ...(pageUrl ? { skillUrl: pageUrl } : {}),
    ...(pageUrl
      ? {
          securityAuditUrl: `${pageUrl}/security-audit?version=${encodeURIComponent(params.version)}`,
        }
      : {}),
    security: mapSkillVerificationSecurityForVerdict(params.verification, {
      allowCleanCardOnlyPass: cardOnlyCleanFailure,
    }),
  };
}
async function fetchOwnerQualifiedSkillSecurityFallback(params) {
  const ownerHandle = params.subject.ownerHandle;
  if (!ownerHandle) throw new Error("owner-qualified skill fallback requires ownerHandle");
  const item = mapSkillVerificationToSecurityVerdictItem({
    verification: await fetchClawHubSkillVerification({
      slug: params.subject.packageName,
      ownerHandle,
      version: params.version,
      baseUrl: params.baseUrl,
      token: params.token,
      timeoutMs: params.timeoutMs,
    }),
    slug: params.subject.packageName,
    ownerHandle,
    version: params.version,
  });
  return {
    security: mapSkillSecurityVerdictToPackageSecurity({
      item,
      packageName: params.subject.packageName,
      ownerHandle,
      version: params.version,
    }),
    links: resolveSkillSecurityLinks(item),
  };
}
async function fetchClawHubSubjectSecurity(params) {
  if (params.subject.kind === "plugin")
    return {
      security: await fetchClawHubPackageSecurity({
        name: params.subject.packageName,
        version: params.version,
        baseUrl: params.baseUrl,
        token: params.token,
        timeoutMs: params.timeoutMs,
      }),
    };
  const response = await fetchClawHubSkillSecurityVerdicts({
    items: [
      {
        slug: params.subject.packageName,
        ...(params.subject.ownerHandle ? { ownerHandle: params.subject.ownerHandle } : {}),
        version: params.version,
      },
    ],
    baseUrl: params.baseUrl,
    token: params.token,
    timeoutMs: params.timeoutMs,
  });
  if (response.items.length !== 1)
    throw new Error(
      `ClawHub skill trust check for "${formatClawHubReleaseLabel(params.subject.packageName, params.version)}" returned ${response.items.length} verdicts.`,
    );
  const item = response.items[0];
  if (!item)
    throw new Error(
      `ClawHub skill trust check for "${formatClawHubReleaseLabel(params.subject.packageName, params.version)}" returned no verdict.`,
    );
  if (params.subject.ownerHandle && isOwnerQualifiedSkillNotFoundVerdict(item))
    return await fetchOwnerQualifiedSkillSecurityFallback({
      subject: {
        kind: "skill",
        packageName: params.subject.packageName,
        ownerHandle: params.subject.ownerHandle,
      },
      version: params.version,
      baseUrl: params.baseUrl,
      token: params.token,
      timeoutMs: params.timeoutMs,
    });
  return {
    security: mapSkillSecurityVerdictToPackageSecurity({
      item,
      packageName: params.subject.packageName,
      ...(params.subject.ownerHandle ? { ownerHandle: params.subject.ownerHandle } : {}),
      version: params.version,
    }),
    links: resolveSkillSecurityLinks(item),
  };
}
async function ensureClawHubPackageTrustAcknowledged(params) {
  let trust;
  let warningLinks;
  const packageLabel = formatClawHubSubjectPackageName(params.subject);
  const releaseLabel = formatClawHubSubjectReleaseLabel(params.subject, params.version);
  try {
    const fetchedSecurity = await fetchClawHubSubjectSecurity({
      subject: params.subject,
      version: params.version,
      baseUrl: params.baseUrl,
      token: params.token,
      timeoutMs: params.timeoutMs,
    });
    const identityFailure = validateClawHubSecurityIdentity({
      security: fetchedSecurity.security,
      packageName: params.subject.packageName,
      packageLabel,
      version: params.version,
    });
    if (identityFailure) return identityFailure;
    trust = fetchedSecurity.security.trust;
    warningLinks = fetchedSecurity.links;
  } catch (error) {
    return {
      ok: false,
      error: `ClawHub release trust check failed for "${releaseLabel}": ${sanitizeTerminalText(formatErrorMessage(error))}`,
      code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_SECURITY_UNAVAILABLE,
      version: params.version,
    };
  }
  const assessment = assessClawHubTrust(trust);
  const checkedAt = /* @__PURE__ */ new Date().toISOString();
  const acceptTrust = (opts) => ({
    ok: true,
    trustInstallRecordFields: buildClawHubTrustInstallRecordFields({
      trust,
      assessment,
      checkedAt,
      ...(opts?.acknowledgedAt ? { acknowledgedAt: opts.acknowledgedAt } : {}),
    }),
    ...(opts?.warning ? { warning: opts.warning } : {}),
  });
  if (assessment.disposition === "clean") return acceptTrust();
  const terminalWarning = formatClawHubTrustWarning({
    baseUrl: params.baseUrl,
    subject: params.subject,
    version: params.version,
    trust,
    assessment,
    mode: params.mode,
    terminalLinks: params.logger?.terminalLinks,
    links: warningLinks,
  });
  const warning = stripAnsi(
    formatClawHubTrustWarning({
      baseUrl: params.baseUrl,
      subject: params.subject,
      version: params.version,
      trust,
      assessment,
      mode: params.mode,
      terminalLinks: false,
      links: warningLinks,
    }),
  );
  params.logger?.warn?.(terminalWarning);
  if (assessment.disposition === "review-recommended") return acceptTrust({ warning });
  if (assessment.disposition === "blocked")
    return {
      ok: false,
      error: `ClawHub blocked this release; ${params.mode === "update" ? "update" : "install"} was not started.`,
      code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_DOWNLOAD_BLOCKED,
      warning,
      version: params.version,
    };
  if (params.acknowledgeClawHubRisk)
    return acceptTrust({
      acknowledgedAt: /* @__PURE__ */ new Date().toISOString(),
      warning,
    });
  if (
    params.onClawHubRisk
      ? await params.onClawHubRisk({
          packageName: packageLabel,
          version: params.version,
          trust,
          acknowledgementKind:
            assessment.disposition === "review-required" ? "type-package" : "confirm",
          warning,
        })
      : false
  )
    return acceptTrust({
      acknowledgedAt: /* @__PURE__ */ new Date().toISOString(),
      warning,
    });
  return {
    ok: false,
    error: `${params.mode === "update" ? "Update" : "Install"} cancelled; rerun with --acknowledge-clawhub-risk to continue after reviewing the warning.`,
    code: CLAWHUB_TRUST_ERROR_CODE.CLAWHUB_RISK_ACKNOWLEDGEMENT_REQUIRED,
    warning,
    version: params.version,
  };
}
//#endregion
export { ensureClawHubPackageTrustAcknowledged as n, CLAWHUB_TRUST_ERROR_CODE as t };
