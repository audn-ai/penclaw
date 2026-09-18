import { r as replaceConfigFile } from "./config-BDv-QbJ6.js";
import { n as sanitizeExecApprovalDisplayText } from "./exec-approval-command-display-SUzu7-Pq.js";
import {
  K as resolveExecApprovalsFromFile,
  M as readExecApprovalsSnapshot,
  O as normalizeExecSecurity,
  S as minSecurity,
  T as normalizeExecAsk,
  b as maxAsk,
  k as normalizeExecTarget,
  rt as updateExecApprovals,
  tt as restoreExecApprovalsSnapshotLocked,
} from "./exec-approvals-Bz218bS2.js";
import {
  n as collectExecPolicyScopeSnapshots,
  t as SESSION_EXEC_OVERRIDES_NOTE,
} from "./exec-approvals-effective-CRssvSe9.js";
import { u as readConfigFileSnapshot } from "./io-B3ne6NxF.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { t as sanitizeTerminalText } from "./safe-text-DiGQuw-e.js";
import { n as renderTable, t as getTerminalTableWidth } from "./table-quSzXaPg.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/exec-policy-cli.ts
const EXEC_POLICY_PRESETS = {
  yolo: {
    host: "gateway",
    security: "full",
    ask: "off",
    askFallback: "full",
  },
  cautious: {
    host: "gateway",
    security: "allowlist",
    ask: "on-miss",
    askFallback: "deny",
  },
  "deny-all": {
    host: "gateway",
    security: "deny",
    ask: "off",
    askFallback: "deny",
  },
};
var ExecPolicyCliError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ExecPolicyCliError";
  }
};
function failExecPolicy(message) {
  throw new ExecPolicyCliError(message);
}
function formatExecPolicyError(err) {
  return sanitizeExecPolicyMessage(err instanceof Error ? err.message : String(err));
}
async function runExecPolicyAction(action) {
  try {
    await action();
  } catch (err) {
    defaultRuntime.error(formatExecPolicyError(err));
    defaultRuntime.exit(1);
  }
}
function sanitizeExecPolicyTableCell(value) {
  return sanitizeExecApprovalDisplayText(sanitizeTerminalText(value));
}
function sanitizeExecPolicyMessage(value) {
  return sanitizeTerminalText(String(value));
}
function resolveExecPolicyInput(params) {
  const resolved = {};
  if (params.host !== void 0) {
    const host = normalizeExecTarget(params.host);
    if (!host) failExecPolicy(`Invalid exec host: ${sanitizeExecPolicyMessage(params.host)}`);
    resolved.host = host;
  }
  if (params.security !== void 0) {
    const security = normalizeExecSecurity(params.security);
    if (!security)
      failExecPolicy(`Invalid exec security: ${sanitizeExecPolicyMessage(params.security)}`);
    resolved.security = security;
  }
  if (params.ask !== void 0) {
    const ask = normalizeExecAsk(params.ask);
    if (!ask) failExecPolicy(`Invalid exec ask mode: ${sanitizeExecPolicyMessage(params.ask)}`);
    resolved.ask = ask;
  }
  if (params.askFallback !== void 0) {
    const askFallback = normalizeExecSecurity(params.askFallback);
    if (!askFallback)
      failExecPolicy(`Invalid exec askFallback: ${sanitizeExecPolicyMessage(params.askFallback)}`);
    resolved.askFallback = askFallback;
  }
  return resolved;
}
function applyConfigExecPolicy(draft, policy) {
  const root = draft;
  root.tools ??= {};
  root.tools.exec ??= {};
  if (policy.host !== void 0) root.tools.exec.host = policy.host;
  if (policy.security !== void 0) root.tools.exec.security = policy.security;
  if (policy.ask !== void 0) root.tools.exec.ask = policy.ask;
}
function applyApprovalsDefaults(file, policy) {
  const next = structuredClone(file ?? { version: 1 });
  next.version = 1;
  next.defaults ??= {};
  if (policy.security !== void 0) next.defaults.security = policy.security;
  if (policy.ask !== void 0) next.defaults.ask = policy.ask;
  if (policy.askFallback !== void 0) next.defaults.askFallback = policy.askFallback;
  return next;
}
function buildExecPolicyApprovalsRollback(params) {
  const fields = [
    ["security", params.policy.security],
    ["ask", params.policy.ask],
    ["askFallback", params.policy.askFallback],
  ];
  const originalDefaults = resolveExecApprovalsFromFile({ file: params.original }).defaults;
  const currentDefaults = resolveExecApprovalsFromFile({ file: params.current }).defaults;
  const next = structuredClone(params.current);
  let changed = false;
  for (const [field, appliedValue] of fields) {
    const currentValue = params.current.defaults?.[field];
    const originalValue = params.original.defaults?.[field];
    const rollbackDoesNotLoosen =
      field === "ask"
        ? maxAsk(originalDefaults.ask, currentDefaults.ask) === originalDefaults.ask
        : minSecurity(originalDefaults[field], currentDefaults[field]) === originalDefaults[field];
    if (
      appliedValue !== void 0 &&
      currentValue === params.written.defaults?.[field] &&
      currentValue !== originalValue &&
      rollbackDoesNotLoosen
    ) {
      next.defaults = {
        ...next.defaults,
        [field]: originalValue,
      };
      changed = true;
    }
  }
  return changed ? next : null;
}
function buildNextExecPolicyConfig(config, policy) {
  const draft = structuredClone(config);
  applyConfigExecPolicy(draft, policy);
  return draft;
}
async function buildLocalExecPolicyShowPayload() {
  const configSnapshot = await readConfigFileSnapshot();
  const approvalsSnapshot = readExecApprovalsSnapshot();
  const scopes = collectExecPolicyScopeSnapshots({
    cfg: configSnapshot.config ?? {},
    approvals: approvalsSnapshot.file,
    hostPath: approvalsSnapshot.path,
  }).map(buildExecPolicyShowScope);
  const baseNote = scopes.some((scope) => scope.runtimeApprovalsSource === "node-runtime")
    ? "Scopes requesting host=node are node-managed at runtime. Local approvals are shown only for local/gateway scopes."
    : "Effective exec policy is the host approvals file intersected with requested tools.exec policy.";
  return {
    configPath: configSnapshot.path,
    approvalsPath: approvalsSnapshot.path,
    approvalsExists: approvalsSnapshot.exists,
    effectivePolicy: {
      note: `${baseNote} ${SESSION_EXEC_OVERRIDES_NOTE}`,
      scopes,
    },
  };
}
function buildExecPolicyShowScope(snapshot) {
  const { allowedDecisions: _allowedDecisions, ...baseScope } = snapshot;
  if (snapshot.host.requested !== "node")
    return {
      ...baseScope,
      runtimeApprovalsSource: "local-file",
    };
  return {
    ...baseScope,
    runtimeApprovalsSource: "node-runtime",
    security: {
      requested: snapshot.security.requested,
      requestedSource: snapshot.security.requestedSource,
      host: "unknown",
      hostSource: "node runtime approvals",
      effective: "unknown",
      note: "runtime policy resolved by node approvals",
    },
    ask: {
      requested: snapshot.ask.requested,
      requestedSource: snapshot.ask.requestedSource,
      host: "unknown",
      hostSource: "node runtime approvals",
      effective: "unknown",
      note: "runtime policy resolved by node approvals",
    },
    askFallback: {
      effective: "unknown",
      source: "node runtime approvals",
    },
  };
}
function renderExecPolicyShow(payload) {
  const rich = isRich();
  const heading = (text) => (rich ? theme.heading(text) : text);
  const muted = (text) => (rich ? theme.muted(text) : text);
  defaultRuntime.log(heading("Exec Policy"));
  defaultRuntime.log(
    renderTable({
      width: getTerminalTableWidth(),
      columns: [
        {
          key: "Field",
          header: "Field",
          minWidth: 14,
        },
        {
          key: "Value",
          header: "Value",
          minWidth: 24,
          flex: true,
        },
      ],
      rows: [
        {
          Field: "Config",
          Value: sanitizeExecPolicyTableCell(payload.configPath),
        },
        {
          Field: "Approvals",
          Value: sanitizeExecPolicyTableCell(payload.approvalsPath),
        },
        {
          Field: "Approvals File",
          Value: sanitizeExecPolicyTableCell(payload.approvalsExists ? "present" : "missing"),
        },
      ],
    }).trimEnd(),
  );
  defaultRuntime.log("");
  defaultRuntime.log(heading("Effective Policy"));
  defaultRuntime.log(
    renderTable({
      width: getTerminalTableWidth(),
      columns: [
        {
          key: "Scope",
          header: "Scope",
          minWidth: 12,
        },
        {
          key: "Requested",
          header: "Requested",
          minWidth: 24,
          flex: true,
        },
        {
          key: "Host",
          header: "Host",
          minWidth: 24,
          flex: true,
        },
        {
          key: "Effective",
          header: "Effective",
          minWidth: 16,
        },
      ],
      rows: payload.effectivePolicy.scopes.map((scope) => ({
        Scope: sanitizeExecPolicyTableCell(scope.scopeLabel),
        Requested: sanitizeExecPolicyTableCell(
          `host=${scope.host.requested} (${scope.host.requestedSource})\nsecurity=${scope.security.requested} (${scope.security.requestedSource})\nask=${scope.ask.requested} (${scope.ask.requestedSource})`,
        ),
        Host: sanitizeExecPolicyTableCell(
          `security=${scope.security.host} (${scope.security.hostSource})\nask=${scope.ask.host} (${scope.ask.hostSource})\naskFallback=${scope.askFallback.effective} (${scope.askFallback.source})`,
        ),
        Effective: sanitizeExecPolicyTableCell(
          `security=${scope.security.effective}\nask=${scope.ask.effective}`,
        ),
      })),
    }).trimEnd(),
  );
  defaultRuntime.log("");
  defaultRuntime.log(muted(payload.effectivePolicy.note));
}
async function applyLocalExecPolicy(policy) {
  const configSnapshot = await readConfigFileSnapshot();
  const nextConfig = buildNextExecPolicyConfig(configSnapshot.config ?? {}, policy);
  if (nextConfig.tools?.exec?.host === "node")
    failExecPolicy(
      "Local exec-policy cannot synchronize host=node. Node approvals are fetched from the node at runtime.",
    );
  const approvalsSnapshot = readExecApprovalsSnapshot();
  const nextApprovals = applyApprovalsDefaults(approvalsSnapshot.file, policy);
  const writtenApprovals = await updateExecApprovals({
    baseHash: approvalsSnapshot.hash,
    update: () => nextApprovals,
  });
  if (!writtenApprovals) throw new Error("Exec approvals changed; reload and retry.");
  try {
    await replaceConfigFile({
      baseHash: configSnapshot.hash,
      nextConfig,
    });
  } catch (err) {
    try {
      if (!(await restoreExecApprovalsSnapshotLocked(approvalsSnapshot, writtenApprovals.hash)))
        await updateExecApprovals({
          update: (current) =>
            buildExecPolicyApprovalsRollback({
              current,
              original: approvalsSnapshot.file,
              written: writtenApprovals.file,
              policy,
            }),
        });
    } catch (rollbackError) {
      throw new Error(
        `Config update failed: ${formatExecPolicyError(err)}; exec approvals rollback failed: ${formatExecPolicyError(rollbackError)}`,
        { cause: rollbackError },
      );
    }
    throw err;
  }
  return await buildLocalExecPolicyShowPayload();
}
function registerExecPolicyCli(program) {
  const execPolicy = program
    .command("exec-policy")
    .description("Show or synchronize requested exec policy with host approvals")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/approvals", "docs.openclaw.ai/cli/approvals")}\n`,
    );
  execPolicy
    .command("show")
    .description("Show the local config policy, host approvals, and effective merge")
    .option("--json", "Output as JSON", false)
    .action(async (opts) => {
      await runExecPolicyAction(async () => {
        const payload = await buildLocalExecPolicyShowPayload();
        if (opts.json) {
          defaultRuntime.writeJson(payload, 0);
          return;
        }
        renderExecPolicyShow(payload);
      });
    });
  execPolicy
    .command("preset <name>")
    .description('Apply a synchronized preset: "yolo", "cautious", or "deny-all"')
    .option("--json", "Output as JSON", false)
    .action(async (name, opts) => {
      await runExecPolicyAction(async () => {
        if (!Object.hasOwn(EXEC_POLICY_PRESETS, name))
          failExecPolicy(`Unknown exec-policy preset: ${sanitizeExecPolicyMessage(name)}`);
        const preset = EXEC_POLICY_PRESETS[name];
        const payload = await applyLocalExecPolicy(preset);
        if (opts.json) {
          defaultRuntime.writeJson(
            {
              preset: name,
              ...payload,
            },
            0,
          );
          return;
        }
        defaultRuntime.log(`Applied exec-policy preset: ${sanitizeExecPolicyMessage(name)}`);
        defaultRuntime.log("");
        renderExecPolicyShow(payload);
      });
    });
  execPolicy
    .command("set")
    .description("Synchronize local config and host approvals using explicit values")
    .option("--host <host>", "Exec host target: auto|sandbox|gateway|node")
    .option("--security <mode>", "Exec security: deny|allowlist|full")
    .option("--ask <mode>", "Exec ask mode: off|on-miss|always")
    .option("--ask-fallback <mode>", "Host approvals fallback: deny|allowlist|full")
    .option("--json", "Output as JSON", false)
    .action(async (opts) => {
      await runExecPolicyAction(async () => {
        const policy = resolveExecPolicyInput(opts);
        if (Object.keys(policy).length === 0)
          failExecPolicy("Provide at least one of --host, --security, --ask, or --ask-fallback.");
        const payload = await applyLocalExecPolicy(policy);
        if (opts.json) {
          defaultRuntime.writeJson(
            {
              applied: policy,
              ...payload,
            },
            0,
          );
          return;
        }
        defaultRuntime.log("Synchronized local exec policy.");
        defaultRuntime.log("");
        renderExecPolicyShow(payload);
      });
    });
}
//#endregion
export { registerExecPolicyCli };
