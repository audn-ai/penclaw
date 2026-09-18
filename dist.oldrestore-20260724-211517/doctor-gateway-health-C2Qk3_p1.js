import {
  c as callGateway,
  m as isGatewayCredentialsRequiredError,
  o as buildGatewayConnectionDetails,
  s as buildGatewayProbeConnectionDetails,
} from "./call-BVMO6az_.js";
import { t as collectChannelStatusIssues } from "./channels-status-issues-DjgExlwq.js";
import { n as isGatewaySecretRefUnavailableError } from "./credentials-DqHTozxM.js";
import { r as formatErrorMessage } from "./errors-BoHeli7m.js";
import {
  a as gatewayProbeResultSawGateway,
  n as GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE,
  t as GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE,
} from "./gateway-health-auth-diagnostic-Bd2f-neB.js";
import {
  r as formatHealthCheckFailure,
  t as formatGatewayClosedDiagnostic,
} from "./health-format-DQ9OK_xq.js";
import { t as note } from "./note-Uvqr4R1d.js";
import { t as probeGatewayStatus } from "./probe-DyT9Tau-.js";
import { n as VERSION } from "./version-CeFj_iGk.js";
//#region src/commands/doctor-gateway-health.ts
/** Gateway health probes used by doctor before deeper daemon and memory diagnostics. */
function isGatewayCallTimeout(message) {
  return /^gateway timeout after \d+ms(?:\n|$)/.test(message);
}
function isGatewayHealthAuthUnavailableError(error) {
  return isGatewayCredentialsRequiredError(error) || isGatewaySecretRefUnavailableError(error);
}
function noteCliGatewayVersionSkew(status) {
  const gatewayVersion = status?.runtimeVersion?.trim();
  if (!gatewayVersion || gatewayVersion === VERSION) return;
  note(
    [
      `This command is OpenClaw ${VERSION}; the running Gateway is OpenClaw ${gatewayVersion}.`,
      "Check `openclaw --version`, `which openclaw`, and `openclaw gateway status --deep`.",
      "If this mismatch is unexpected, update PATH so `openclaw` points to the version you want, or reinstall the Gateway service from that same OpenClaw install.",
    ].join("\n"),
    "OpenClaw version mismatch",
  );
}
/**
 * Probes gateway status and reports user-facing connection/auth/channel warnings.
 *
 * A credentials-required gateway still counts as healthy but unauthenticated when the preauth
 * probe confirms the server is reachable.
 */
async function checkGatewayHealth(params) {
  const timeoutMs =
    typeof params.timeoutMs === "number" && params.timeoutMs > 0 ? params.timeoutMs : 1e4;
  let healthOk = false;
  let status;
  try {
    status = await callGateway({
      method: "status",
      params: { includeChannelSummary: false },
      timeoutMs,
      config: params.cfg,
    });
    healthOk = true;
    noteCliGatewayVersionSkew(status);
    try {
      const issues = collectChannelStatusIssues(
        await callGateway({
          method: "channels.status",
          params: {
            probe: true,
            timeoutMs: 5e3,
          },
          timeoutMs: 6e3,
        }),
      );
      if (issues.length > 0)
        note(
          issues
            .map(
              (issue) =>
                `- ${issue.channel} ${issue.accountId}: ${issue.message}${issue.fix ? ` (${issue.fix})` : ""}`,
            )
            .join("\n"),
          "Channel warnings",
        );
    } catch {}
    return {
      healthOk,
      authenticated: true,
      status,
    };
  } catch (err) {
    if (isGatewayHealthAuthUnavailableError(err)) {
      const probeDetails = await buildGatewayProbeConnectionDetails({ config: params.cfg });
      if (
        gatewayProbeResultSawGateway(
          await probeGatewayStatus({
            url: probeDetails.url,
            timeoutMs,
            tlsFingerprint: probeDetails.tlsFingerprint,
            preauthHandshakeTimeoutMs: probeDetails.preauthHandshakeTimeoutMs,
            config: params.cfg,
            json: true,
          }),
        )
      ) {
        note(
          GATEWAY_HEALTH_CREDENTIALS_REQUIRED_MESSAGE,
          GATEWAY_HEALTH_CREDENTIALS_REQUIRED_TITLE,
        );
        healthOk = true;
        return {
          healthOk,
          authenticated: false,
        };
      }
    }
    if (String(err).includes("gateway closed")) {
      const gatewayDetails = buildGatewayConnectionDetails({ config: params.cfg });
      const closedDiagnostic = formatGatewayClosedDiagnostic(err);
      if (closedDiagnostic) note(closedDiagnostic, "Gateway");
      else note("Gateway not running.", "Gateway");
      note(gatewayDetails.message, "Gateway connection");
    } else params.runtime.error(formatHealthCheckFailure(err));
  }
  return {
    healthOk,
    authenticated: false,
    status,
  };
}
/** Probes gateway memory readiness without forcing deep embedding checks. */
async function probeGatewayMemoryStatus(params) {
  const timeoutMs =
    typeof params.timeoutMs === "number" && params.timeoutMs > 0 ? params.timeoutMs : 8e3;
  try {
    const payload = await callGateway({
      method: "doctor.memory.status",
      params: { probe: false },
      timeoutMs,
      config: params.cfg,
    });
    const gatewayChecked = payload.embedding.checked !== false;
    return {
      checked: gatewayChecked,
      ready: payload.embedding.ok,
      error: payload.embedding.error,
      ...(payload.embeddingRuntime ? { runtimeFacts: payload.embeddingRuntime } : {}),
      skipped: !gatewayChecked,
    };
  } catch (err) {
    const message = formatErrorMessage(err);
    if (isGatewayCallTimeout(message))
      return {
        checked: false,
        ready: false,
        error: `gateway memory probe timed out: ${message}`,
        skipped: false,
      };
    return {
      checked: true,
      ready: false,
      error: `gateway memory probe unavailable: ${message}`,
      skipped: false,
    };
  }
}
//#endregion
export { checkGatewayHealth, probeGatewayMemoryStatus };
