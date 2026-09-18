import {
  $t as i,
  An as a,
  B as o,
  Nt as s,
  Ut as c,
  W as l,
  an as u,
  dt as d,
  gt as ee,
  lt as f,
  tt as p,
} from "./control-ui-foundation-BSyioE0Z.js";
import { n as t, r as n, t as r } from "./control-ui-foundation-CSxeaoE-.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function te(e) {
  let t = e.scopes.join(`,`),
    n = e.token ?? ``;
  return [
    `v2`,
    e.deviceId,
    e.clientId,
    e.clientMode,
    e.role,
    t,
    String(e.signedAtMs),
    n,
    e.nonce,
  ].join(`|`);
}
var m = e(() => {});
function h(e) {
  if (typeof e == `string`) return e.trim() || void 0;
}
function g(e) {
  if (!Array.isArray(e)) return;
  let t = e.map((e) => h(e)).filter((e) => !!e);
  return t.length > 0 ? t : void 0;
}
function _(e) {
  if (!e || typeof e != `object` || Array.isArray(e)) return null;
  let t = e.code;
  return typeof t == `string` && t.trim().length > 0 ? t.trim() : null;
}
function ne(e) {
  if (!e || typeof e != `object` || Array.isArray(e)) return {};
  let t = e,
    n = typeof t.canRetryWithDeviceToken == `boolean` ? t.canRetryWithDeviceToken : void 0,
    r = h(t.recommendedNextStep) ?? ``;
  return { canRetryWithDeviceToken: n, recommendedNextStep: C.has(r) ? r : void 0 };
}
function re(e) {
  let t = h(e) ?? ``;
  return fe.has(t) ? t : void 0;
}
function ie(e) {
  let t = h(e);
  return t && pe.test(t) ? t : void 0;
}
function v(e) {
  return g(e);
}
function ae(e) {
  return {
    code: x.PAIRING_REQUIRED,
    ...(e.reason ? { reason: e.reason } : {}),
    ...(e.requestId ? { requestId: e.requestId } : {}),
    ...(e.remediationHint ? { remediationHint: e.remediationHint } : {}),
    ...(e.recommendedNextStep ? { recommendedNextStep: e.recommendedNextStep } : {}),
    ...(e.retryable === void 0 ? {} : { retryable: e.retryable }),
    ...(e.pauseReconnect === void 0 ? {} : { pauseReconnect: e.pauseReconnect }),
    ...(e.deviceId ? { deviceId: e.deviceId } : {}),
    ...(e.requestedRole ? { requestedRole: e.requestedRole } : {}),
    ...(e.requestedScopes ? { requestedScopes: e.requestedScopes } : {}),
    ...(e.approvedRoles ? { approvedRoles: e.approvedRoles } : {}),
    ...(e.approvedScopes ? { approvedScopes: e.approvedScopes } : {}),
  };
}
function oe(e) {
  return e ? me[e].requirement : `device approval is required`;
}
function se(e) {
  return e ? me[e].remediationHint : `Approve the pending device request before retrying.`;
}
function y(e) {
  if (_(e) !== x.PAIRING_REQUIRED || !e || typeof e != `object` || Array.isArray(e)) return null;
  let t = e,
    n = re(t.reason),
    r = ie(t.requestId),
    i = h(t.remediationHint) ?? se(n),
    a = h(t.recommendedNextStep) ?? ``,
    o = C.has(a) ? a : void 0,
    s = h(t.deviceId),
    c = h(t.requestedRole),
    l = v(t.requestedScopes),
    u = v(t.approvedRoles),
    d = v(t.approvedScopes);
  return ae({
    reason: n,
    requestId: r,
    remediationHint: i,
    recommendedNextStep: o,
    retryable: typeof t.retryable == `boolean` ? t.retryable : void 0,
    pauseReconnect: typeof t.pauseReconnect == `boolean` ? t.pauseReconnect : void 0,
    deviceId: s,
    requestedRole: c,
    requestedScopes: l,
    approvedRoles: u,
    approvedScopes: d,
  });
}
function ce(e) {
  let t = h(e);
  if (!t) return null;
  let n = t.trim().toLowerCase(),
    r;
  for (let [e, t] of Object.entries(he))
    if (n.includes(t)) {
      r = e;
      break;
    }
  if ((!r && n.includes(`pairing required`) && (r = S.NOT_PAIRED), !r)) return null;
  let i = ie(t.match(/\(requestId:\s*([^\s)]+)\)/i)?.[1]);
  return { ...(i ? { requestId: i } : {}), reason: r };
}
function le(e) {
  let t = y(e),
    n = he[t?.reason ?? S.NOT_PAIRED];
  return t?.requestId ? `${n} (requestId: ${t.requestId})` : n;
}
function ue(e) {
  return _(e.details) === x.PAIRING_REQUIRED
    ? le(e.details)
    : _(e.details) === x.PROTOCOL_MISMATCH
      ? de(e.message, e.details)
      : (h(e.message) ?? `gateway request failed`);
}
function de(e, t) {
  let n = t,
    r = b(n.clientMinProtocol),
    i = b(n.clientMaxProtocol),
    a = b(n.expectedProtocol),
    o = b(n.minimumProbeProtocol),
    s = [];
  (r !== void 0 && i !== void 0 && s.push(r === i ? `Control UI v${r}` : `Control UI v${r}-v${i}`),
    a !== void 0 && s.push(`Gateway v${a}`),
    o !== void 0 && s.push(`probe min v${o}`));
  let c = h(e) ?? `protocol mismatch`;
  return s.length > 0 ? `${c}: ${s.join(`, `)}` : c;
}
function b(e) {
  return typeof e == `number` && Number.isInteger(e) && e > 0 ? e : void 0;
}
var x,
  S,
  C,
  fe,
  pe,
  me,
  he,
  w = e(() => {
    ((x = {
      AUTH_REQUIRED: `AUTH_REQUIRED`,
      AUTH_UNAUTHORIZED: `AUTH_UNAUTHORIZED`,
      AUTH_TOKEN_MISSING: `AUTH_TOKEN_MISSING`,
      AUTH_TOKEN_MISMATCH: `AUTH_TOKEN_MISMATCH`,
      AUTH_TOKEN_NOT_CONFIGURED: `AUTH_TOKEN_NOT_CONFIGURED`,
      AUTH_PASSWORD_MISSING: `AUTH_PASSWORD_MISSING`,
      AUTH_PASSWORD_MISMATCH: `AUTH_PASSWORD_MISMATCH`,
      AUTH_PASSWORD_NOT_CONFIGURED: `AUTH_PASSWORD_NOT_CONFIGURED`,
      AUTH_BOOTSTRAP_TOKEN_INVALID: `AUTH_BOOTSTRAP_TOKEN_INVALID`,
      AUTH_DEVICE_TOKEN_MISMATCH: `AUTH_DEVICE_TOKEN_MISMATCH`,
      AUTH_SCOPE_MISMATCH: `AUTH_SCOPE_MISMATCH`,
      AUTH_RATE_LIMITED: `AUTH_RATE_LIMITED`,
      AUTH_TAILSCALE_IDENTITY_MISSING: `AUTH_TAILSCALE_IDENTITY_MISSING`,
      AUTH_TAILSCALE_PROXY_MISSING: `AUTH_TAILSCALE_PROXY_MISSING`,
      AUTH_TAILSCALE_WHOIS_FAILED: `AUTH_TAILSCALE_WHOIS_FAILED`,
      AUTH_TAILSCALE_IDENTITY_MISMATCH: `AUTH_TAILSCALE_IDENTITY_MISMATCH`,
      CONTROL_UI_ORIGIN_NOT_ALLOWED: `CONTROL_UI_ORIGIN_NOT_ALLOWED`,
      PROTOCOL_MISMATCH: `PROTOCOL_MISMATCH`,
      CONTROL_UI_DEVICE_IDENTITY_REQUIRED: `CONTROL_UI_DEVICE_IDENTITY_REQUIRED`,
      DEVICE_IDENTITY_REQUIRED: `DEVICE_IDENTITY_REQUIRED`,
      DEVICE_AUTH_INVALID: `DEVICE_AUTH_INVALID`,
      DEVICE_AUTH_DEVICE_ID_MISMATCH: `DEVICE_AUTH_DEVICE_ID_MISMATCH`,
      DEVICE_AUTH_SIGNATURE_EXPIRED: `DEVICE_AUTH_SIGNATURE_EXPIRED`,
      DEVICE_AUTH_NONCE_REQUIRED: `DEVICE_AUTH_NONCE_REQUIRED`,
      DEVICE_AUTH_NONCE_MISMATCH: `DEVICE_AUTH_NONCE_MISMATCH`,
      DEVICE_AUTH_SIGNATURE_INVALID: `DEVICE_AUTH_SIGNATURE_INVALID`,
      DEVICE_AUTH_PUBLIC_KEY_INVALID: `DEVICE_AUTH_PUBLIC_KEY_INVALID`,
      PAIRING_REQUIRED: `PAIRING_REQUIRED`,
      CLIENT_VERSION_MISMATCH: `CLIENT_VERSION_MISMATCH`,
    }),
      (S = {
        NOT_PAIRED: `not-paired`,
        ROLE_UPGRADE: `role-upgrade`,
        SCOPE_UPGRADE: `scope-upgrade`,
        METADATA_UPGRADE: `metadata-upgrade`,
      }),
      (C = new Set([
        `retry_with_device_token`,
        `update_auth_configuration`,
        `update_auth_credentials`,
        `wait_then_retry`,
        `review_auth_configuration`,
      ])),
      (fe = new Set([`not-paired`, `role-upgrade`, `scope-upgrade`, `metadata-upgrade`])),
      (pe = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/),
      (me = {
        "not-paired": {
          requirement: `device is not approved yet`,
          remediationHint: `Approve this device from the pending pairing requests.`,
          recoveryTitle: `Gateway pairing approval required.`,
        },
        "role-upgrade": {
          requirement: `device is asking for a higher role than currently approved`,
          remediationHint: `Review the requested role upgrade, then approve the pending request.`,
          recoveryTitle: `Gateway role upgrade approval required.`,
        },
        "scope-upgrade": {
          requirement: `device is asking for more scopes than currently approved`,
          remediationHint: `Review the requested scopes, then approve the pending upgrade.`,
          recoveryTitle: `Gateway scope upgrade approval required.`,
        },
        "metadata-upgrade": {
          requirement: `device identity changed and must be re-approved`,
          remediationHint: `Review the refreshed device details, then approve the pending request.`,
          recoveryTitle: `Gateway device refresh approval required.`,
        },
      }),
      (he = {
        "not-paired": `device pairing required`,
        "role-upgrade": `role upgrade pending approval`,
        "scope-upgrade": `scope upgrade pending approval`,
        "metadata-upgrade": `device metadata change pending approval`,
      }));
  });
function T(e) {
  return (typeof e == `string` && e.trim()) || void 0;
}
function ge(e) {
  let t = T(e.token),
    n = T(e.bootstrapToken),
    r = T(e.deviceToken),
    i = T(e.password),
    a = T(e.storedToken),
    o = { storedToken: a, storedScopes: e.storedScopes };
  if (e.preferBootstrapToken && n) return { authBootstrapToken: n, authPassword: i, ...o };
  let s = e.pendingDeviceTokenRetry === !0 && !r && !!(t && a && e.trustedDeviceTokenRetry),
    c = r ?? (s || (!(t || i) && (!n || a)) ? a : void 0),
    l = !!(c && !r && a) && c === a,
    u = t ?? c,
    d = !t && !c && !i ? n : void 0;
  return {
    authToken: u,
    authBootstrapToken: d,
    authDeviceToken: s ? a : void 0,
    authPassword: i,
    authApprovalRuntimeToken: T(e.approvalRuntimeToken),
    authAgentRuntimeIdentityToken: T(e.agentRuntimeIdentityToken),
    signatureToken: u ?? d,
    resolvedDeviceToken: c,
    usingStoredDeviceToken: l,
    ...o,
  };
}
function _e(e) {
  let t = {
    token: e.authToken,
    bootstrapToken: e.authBootstrapToken,
    deviceToken: e.authDeviceToken ?? e.resolvedDeviceToken,
    password: e.authPassword,
    approvalRuntimeToken: e.authApprovalRuntimeToken,
    agentRuntimeIdentityToken: e.authAgentRuntimeIdentityToken,
  };
  return Object.values(t).some(Boolean) ? t : void 0;
}
function ve(e) {
  return (
    e.requestedScopes ??
    (e.usingStoredDeviceToken && e.storedScopes?.length ? e.storedScopes : [...e.defaultScopes])
  );
}
function ye(e) {
  if (
    e.retryBudgetUsed ||
    e.currentDeviceToken ||
    !e.explicitToken ||
    !e.storedToken ||
    !e.trustedEndpoint
  )
    return !1;
  let t = ne(e.errorDetails);
  return (
    e.canRetryWithDeviceTokenHint === !0 ||
    t.canRetryWithDeviceToken === !0 ||
    t.recommendedNextStep === `retry_with_device_token` ||
    _(e.errorDetails) === x.AUTH_TOKEN_MISMATCH
  );
}
var be = e(() => {
  w();
});
function E(e) {
  return !!e && typeof e == `object` && !Array.isArray(e);
}
function D(e) {
  return typeof e == `string` && e.length > 0;
}
function xe(e) {
  return typeof e == `number` && Number.isInteger(e) && e >= 0;
}
function Se(e) {
  return !E(e) ||
    !D(e.code) ||
    !D(e.message) ||
    (e.retryable !== void 0 && typeof e.retryable != `boolean`)
    ? !1
    : e.retryAfterMs === void 0 || xe(e.retryAfterMs);
}
function Ce(e) {
  return !E(e) || e.type !== `event` || !D(e.event) ? !1 : e.seq === void 0 || xe(e.seq);
}
function we(e) {
  return !E(e) || e.type !== `res` || !D(e.id) || typeof e.ok != `boolean`
    ? !1
    : e.error === void 0 || Se(e.error);
}
var Te = e(() => {});
function Ee(e, t) {
  let n = Math.min(e.maxMs, e.initialMs * e.factor ** Math.max(t - 1, 0)),
    r = n * e.jitter * Math.random();
  return Math.min(e.maxMs, Math.round(n + r));
}
async function De(e, t) {
  if (!Number.isFinite(e) || e <= 0) return;
  let n = Math.min(Math.max(Math.floor(e), 1), j);
  await new Promise((e, r) => {
    let i = !1,
      a = null,
      o = () => t?.removeEventListener(`abort`, s),
      s = () => {
        i ||
          ((i = !0),
          a && clearTimeout(a),
          (a = null),
          o(),
          r(Error(`aborted`, { cause: t?.reason ?? Error(`aborted`) })));
      };
    if ((t?.addEventListener(`abort`, s, { once: !0 }), t?.aborted)) {
      s();
      return;
    }
    ((a = setTimeout(() => {
      ((i = !0), o(), (a = null), e());
    }, n)),
      t?.aborted && s());
  });
}
function O(e) {
  return typeof e == `number` && Number.isFinite(e) ? e : void 0;
}
function k(e, t, n, r) {
  let i = O(e);
  return i === void 0 ? t : Math.min(Math.max(i, n ?? -1 / 0), r ?? 1 / 0);
}
function Oe(e, t) {
  return Math.max(1, Math.round(O(e) ?? t));
}
function A(e) {
  let t = e === 1 / 0 ? j : (O(e) ?? 0);
  return Math.min(Math.max(Math.round(t), 0), j);
}
function ke(e, t) {
  if (e === `full`) return `full`;
  let n = O(e);
  return n === void 0 ? t : Math.min(Math.max(n, 0), 1);
}
function Ae(e = M, t) {
  let n = Oe(t?.attempts, e.attempts),
    r = A(k(t?.minDelayMs, e.minDelayMs, 0));
  return {
    attempts: n,
    minDelayMs: r,
    maxDelayMs: Math.max(r, A(k(t?.maxDelayMs, e.maxDelayMs, 0))),
    jitter: ke(t?.jitter, e.jitter),
  };
}
function je(e, t, n, r) {
  if (t === `full`)
    return n === `symmetric`
      ? Math.max(0, Math.round(e * (0.5 + r() * 0.5)))
      : Math.max(0, Math.ceil(e * (1 + r())));
  if (t <= 0) return n === `positive` ? Math.ceil(e) : e;
  let i = r(),
    a = e * (1 + (n === `positive` ? i * t : (i * 2 - 1) * t));
  return Math.max(0, n === `positive` ? Math.ceil(a) : Math.round(a));
}
function Me(e, t = `Non-Error thrown`) {
  if (e instanceof Error) return e;
  if (typeof e == `string`) return Error(e);
  let n = Error(t, { cause: e });
  return (((typeof e == `object` && e) || typeof e == `function`) && Object.assign(n, e), n);
}
function Ne(e = {}) {
  let t = e.sleep ?? Fe,
    n = e.random ?? Math.random,
    r = e.createFailure ?? ((e) => Me(e.at(-1) ?? Error(`Retry failed`)));
  return async function (e, i = 3, a = 300) {
    let o = [];
    if (typeof i == `number`) {
      let n = Oe(i, M.attempts);
      for (let r = 0; r < n; r += 1)
        try {
          return await e();
        } catch (e) {
          if ((o.push(e), r === n - 1)) break;
          await t(A(a * 2 ** r));
        }
      throw r(o);
    }
    let s = i,
      c = Ae(M, s),
      l = c.attempts,
      u = c.minDelayMs,
      d = c.maxDelayMs > 0 ? c.maxDelayMs : 1 / 0,
      ee = s.retryAfterMaxDelayMs === void 0 ? d : Math.max(u, A(k(s.retryAfterMaxDelayMs, d, 0))),
      f = s.random ?? n,
      p = s.sleep ?? t,
      te = s.shouldRetry ?? (() => !0);
    for (let t = 1; t <= l; t += 1)
      try {
        return await e();
      } catch (e) {
        if ((o.push(e), t >= l || !te(e, t))) break;
        let n = { attempt: t, maxAttempts: l, err: e, label: s.label },
          r = s.retryAfterMs?.(e),
          i = typeof r == `number` && Number.isFinite(r),
          a = typeof s.delayMs == `function` ? s.delayMs(n) : s.delayMs,
          m = a === void 0 ? void 0 : A(a),
          h = i ? Math.max(r, u) : m === void 0 ? u * 2 ** (t - 1) : Math.max(m, u),
          g = i ? ee : d,
          _ = Math.min(h, g),
          ne = i && (r ?? 0) <= g,
          re = (c.jitter === `full` && !i) || ne;
        ((_ = je(_, c.jitter, re ? `positive` : `symmetric`, f)),
          (_ = Math.min(Math.max(_, u), g)),
          await s.onRetry?.({ ...n, delayMs: _ }),
          _ > 0 && (await p(_)));
      }
    throw r(o);
  };
}
var j,
  Pe,
  M,
  Fe,
  Ie = e(() => {
    ((j = 2147e6),
      (Pe = class {
        constructor(e, t = 1 / 0) {
          ((this.policy = e),
            (this.maxAttempts = t),
            (this.attempts = 0),
            (this.initialMs = e.initialMs));
        }
        reset(e = this.policy.initialMs) {
          (this.cancel(),
            (this.attempts = 0),
            (this.initialMs = e),
            (this.nextDelayOverrideMs = void 0));
        }
        cancel(e = Error(`retry cancelled`)) {
          (this.pendingAbort?.abort(e), (this.pendingAbort = void 0));
        }
        next(e) {
          let t = this.nextDelayOverrideMs;
          if (
            ((this.nextDelayOverrideMs = void 0),
            t === void 0 && ++this.attempts > Math.ceil(this.maxAttempts))
          )
            return;
          let n = Math.max(this.attempts, 1),
            r = t ?? Ee({ ...this.policy, initialMs: this.initialMs }, n);
          this.cancel();
          let i = new AbortController();
          return (
            (this.pendingAbort = i),
            { attempt: n, delayMs: r, signal: e ? AbortSignal.any([i.signal, e]) : i.signal }
          );
        }
      }),
      (M = { attempts: 3, minDelayMs: 300, maxDelayMs: 3e4, jitter: 0 }),
      (Fe = (e) =>
        new Promise((t) => {
          setTimeout(t, e);
        })),
      Ne());
  }),
  N,
  Le,
  Re = e(() => {
    (Te(),
      Ie(),
      (N = class extends Error {
        constructor(e) {
          (super(e.message ?? `request failed`),
            (this.name = `GatewayProtocolRequestError`),
            (this.code = e.code ?? `UNAVAILABLE`),
            (this.gatewayCode = this.code),
            (this.details = e.details),
            (this.retryable = e.retryable === !0),
            (this.retryAfterMs = e.retryAfterMs));
        }
      }),
      (Le = class {
        constructor(e) {
          ((this.opts = e),
            (this.socket = null),
            (this.pending = new Map()),
            (this.listeners = new Set()),
            (this.stopped = !0),
            (this.generation = 0),
            (this.lastSeq = null),
            (this.connectNonce = null),
            (this.connectSent = !1),
            (this.connectRequestSent = !1),
            (this.handshakeTimer = null),
            (this.socketOpened = !1),
            (this.helloReceived = !1),
            (this.connectTiming = null),
            (this.reconnectSupervisor = new Pe({
              initialMs: e.reconnect.initialMs,
              maxMs: e.reconnect.maxMs,
              factor: e.reconnect.multiplier,
              jitter: 0,
            })));
        }
        get connected() {
          return this.socket?.isOpen() ?? !1;
        }
        get hasPendingRequests() {
          return this.pending.size > 0;
        }
        get connecting() {
          return this.connectSent && !this.helloReceived;
        }
        get hasUnboundedPendingRequests() {
          return [...this.pending.values()].some((e) => e.unbounded);
        }
        start() {
          ((this.stopped = !1), this.reconnectSupervisor.cancel(), this.connect());
        }
        stop() {
          ((this.stopped = !0), this.clearHandshakeTimer(), this.reconnectSupervisor.reset());
          let e = this.socket;
          (e &&
            this.opts.notifyStoppedClose &&
            (this.stoppedSocket = { socket: e, context: this.closeContext() }),
            (this.socket = null),
            (this.connectFailure = void 0),
            (this.connectTiming = null),
            this.flushRequests(Error(`gateway client stopped`)),
            e?.close());
        }
        request(e, t, n) {
          let r = this.socket;
          if (!r?.isOpen()) return Promise.reject(Error(`gateway not connected`));
          if (typeof e != `string` || e.length === 0)
            return Promise.reject(
              Error(`invalid request frame: method must be a non-empty string`),
            );
          let i = this.opts.createRequestId(),
            a = n?.timeoutMs === null ? void 0 : (n?.timeoutMs ?? this.opts.requestTimeoutMs);
          return new Promise((o, s) => {
            let c,
              l = {
                resolve: (e) => o(e),
                reject: s,
                expectFinal: n?.expectFinal === !0,
                acceptedNotified: !1,
                onAccepted: n?.onAccepted,
                unbounded: a === void 0,
                method: e,
                startedAtMs: this.nowMs(),
              },
              u = () => {
                (this.pending.delete(i),
                  c && clearTimeout(c),
                  this.finishRequestTiming(i, l, !1, `CLIENT_ABORTED`),
                  s(
                    this.opts.createRequestAbortError?.(e) ??
                      Error(`gateway request aborted for ${e}`),
                  ));
              },
              d = () => {
                (c && clearTimeout(c), n?.signal?.removeEventListener(`abort`, u));
              };
            if (n?.signal?.aborted) {
              s(
                this.opts.createRequestAbortError?.(e) ?? Error(`gateway request aborted for ${e}`),
              );
              return;
            }
            ((l.cleanup = d),
              a !== void 0 &&
                a >= 0 &&
                ((c = setTimeout(() => {
                  (this.pending.delete(i),
                    n?.signal?.removeEventListener(`abort`, u),
                    this.finishRequestTiming(i, l, !1, `CLIENT_TIMEOUT`),
                    s(
                      this.opts.createRequestTimeoutError?.(e, a) ??
                        Error(`gateway request timed out after ${a}ms: ${e}`),
                    ));
                }, a)),
                c.unref?.()),
              n?.signal?.addEventListener(`abort`, u, { once: !0 }),
              this.pending.set(i, l));
            try {
              r.send(JSON.stringify({ type: `req`, id: i, method: e, params: t }));
            } catch (e) {
              (this.pending.delete(i),
                d(),
                this.finishRequestTiming(i, l, !1, `CLIENT_SEND_ERROR`),
                s(e instanceof Error ? e : Error(String(e))));
            }
          });
        }
        addEventListener(e) {
          return (this.listeners.add(e), () => this.listeners.delete(e));
        }
        closeSocket(e, t) {
          this.socket?.close(e, t);
        }
        resetReconnectBackoff(e) {
          this.reconnectSupervisor.reset(e);
        }
        recordTiming(e, t, n, r) {
          let i = this.nowMs(),
            a = this.connectTiming;
          !a ||
            a.generation !== t ||
            ((a.hasChallenge ||= e === `challenge`),
            (a.usedFallback ||= e === `fallback`),
            this.invoke(`connect timing`, () =>
              this.opts.onTiming?.({
                phase: e,
                generation: t,
                durationMs: Math.max(0, i - a.startedAtMs),
                phaseDurationMs: Math.max(0, i - a.lastAtMs),
                hasChallenge: a.hasChallenge,
                usedFallback: a.usedFallback,
                plan: n,
                detail: r,
              }),
            ),
            (a.lastAtMs = i),
            (e === `hello` || e === `failed`) && (this.connectTiming = null));
        }
        connect() {
          if (this.stopped) return;
          let e = this.generation + 1;
          ((this.connectNonce = null),
            (this.connectSent = !1),
            (this.connectRequestSent = !1),
            (this.socketOpened = !1),
            (this.helloReceived = !1),
            (this.connectFailure = void 0));
          let t;
          try {
            t = this.opts.createSocket({
              open: () => this.handleOpen(t, e),
              message: (n) => this.handleMessage(t, e, n),
              close: (n, r) => this.handleClose(t, e, n, r),
              error: (n) => this.handleSocketError(t, e, n),
            });
          } catch (e) {
            let t = e instanceof Error ? e : Error(String(e));
            if (
              (this.opts.onSocketFactoryError?.(t),
              this.opts.onConnectError?.(t),
              this.opts.rethrowSocketFactoryError?.(t))
            )
              throw t;
            return;
          }
          ((this.generation = e), (this.socket = t));
          let n = this.nowMs();
          this.connectTiming = {
            generation: e,
            startedAtMs: n,
            lastAtMs: n,
            hasChallenge: !1,
            usedFallback: !1,
          };
        }
        handleOpen(e, t) {
          if (this.isActive(e, t)) {
            if (
              ((this.socketOpened = !0), this.recordTiming(`socket-open`, t), this.connectNonce)
            ) {
              this.sendConnect(e, t);
              return;
            }
            this.armHandshakeTimer(e, t);
          }
        }
        armHandshakeTimer(e, t) {
          this.clearHandshakeTimer();
          let n = Date.now();
          ((this.handshakeTimer = setTimeout(() => {
            if (
              ((this.handshakeTimer = null),
              !this.isActive(e, t) || this.connectSent || !e.isOpen())
            )
              return;
            if (this.opts.handshake.mode === `fallback`) {
              (this.recordTiming(`fallback`, t), this.sendConnect(e, t));
              return;
            }
            let r = Date.now() - n,
              i = Error(
                this.opts.handshake.timeoutMessage?.(r) ??
                  `gateway connect challenge timeout after ${r}ms`,
              );
            (this.opts.onConnectError?.(i), e.close(1008, `connect challenge timeout`));
          }, this.opts.handshake.timeoutMs)),
            this.handshakeTimer.unref?.());
        }
        sendConnect(e, t) {
          if (!this.isActive(e, t) || !e.isOpen() || this.connectSent) return;
          ((this.connectSent = !0), this.clearHandshakeTimer());
          let n;
          try {
            n = this.opts.buildConnectPlan({ nonce: this.connectNonce, generation: t });
          } catch (n) {
            this.handleConnectPlanError(e, t, n);
            return;
          }
          if (n instanceof Promise) {
            n.then((n) => this.sendConnectPlan(e, t, n)).catch((n) =>
              this.handleConnectPlanError(e, t, n),
            );
            return;
          }
          this.sendConnectPlan(e, t, n);
        }
        handleConnectPlanError(e, t, n) {
          if (!this.isActive(e, t)) return;
          let r = n instanceof Error ? n : Error(String(n)),
            i = this.opts.onConnectPlanError?.(r) ?? {
              closeCode: 1008,
              closeReason: `connect failed`,
            };
          (this.opts.onConnectError?.(i.error ?? r),
            i.stop && (this.stopped = !0),
            e.close(i.closeCode, i.closeReason));
        }
        sendConnectPlan(e, t, n) {
          if (!this.isActive(e, t) || !e.isOpen()) return;
          let r = { generation: t, nonce: this.connectNonce, plan: n };
          (this.recordTiming(`connect-plan-ready`, t, n),
            this.recordTiming(`request-sent`, t, n),
            (this.connectRequestSent = !0),
            this.request(`connect`, this.opts.buildConnectParams(n))
              .then((i) => {
                this.isActive(e, t) &&
                  ((this.helloReceived = !0),
                  (this.connectFailure = void 0),
                  this.reconnectSupervisor.reset(),
                  this.recordTiming(`hello`, t, n),
                  this.opts.onConnectHello?.(i, r),
                  this.invoke(`hello`, () => this.opts.onHello?.(i)));
              })
              .catch((n) => {
                if (!this.isActive(e, t)) return;
                let i = n instanceof N ? n : new N({ message: String(n) }),
                  a = this.opts.onConnectFailure?.(i, r) ?? {
                    closeCode: 1008,
                    closeReason: `connect failed`,
                  };
                ((this.connectFailure = { error: i, reconnectDelayMs: a.reconnectDelayMs }),
                  a.stop && (this.stopped = !0),
                  e.close(a.closeCode, a.closeReason));
              }));
        }
        handleMessage(e, t, n) {
          if (!this.isActive(e, t)) return;
          let r;
          try {
            r = JSON.parse(n);
          } catch (e) {
            this.opts.onParseError?.(e);
            return;
          }
          if (Ce(r)) {
            if ((this.opts.onActivity?.(), r.event === `connect.challenge`)) {
              let n = r.payload,
                i = typeof n?.nonce == `string` ? n.nonce.trim() : ``;
              if (!i) {
                if (this.opts.handshake.mode === `require-challenge`) {
                  let t = Error(`gateway connect challenge missing nonce`);
                  (this.opts.onConnectError?.(t), e.close(1008, `connect challenge missing nonce`));
                }
                return;
              }
              ((this.connectNonce = i), this.recordTiming(`challenge`, t), this.sendConnect(e, t));
              return;
            }
            let n = typeof r.seq == `number` ? r.seq : null;
            if (n !== null) {
              if (this.lastSeq !== null && n > this.lastSeq + 1) {
                let e = this.lastSeq + 1;
                this.invoke(`gap`, () => this.opts.onGap?.({ expected: e, received: n }));
              }
              this.lastSeq = n;
            }
            this.invoke(`event`, () => this.opts.onEvent?.(r));
            for (let e of this.listeners) this.invoke(`event listener`, () => e(r));
            return;
          }
          we(r) && (this.opts.onActivity?.(), this.handleResponse(r));
        }
        handleResponse(e) {
          let t = this.pending.get(e.id);
          if (!t) return;
          let n = e.payload?.status;
          if (t.expectFinal && n === `accepted`) {
            t.acceptedNotified ||
              ((t.acceptedNotified = !0), this.invoke(`accepted`, () => t.onAccepted?.(e.payload)));
            return;
          }
          if ((this.pending.delete(e.id), t.cleanup?.(), e.ok)) {
            (this.finishRequestTiming(e.id, t, !0), t.resolve(e.payload));
            return;
          }
          (this.finishRequestTiming(e.id, t, !1, e.error?.code),
            t.reject(this.opts.createRequestError?.(e.error ?? {}) ?? new N(e.error ?? {})));
        }
        handleClose(e, t, n, r) {
          if (this.socket !== e) {
            if (this.stoppedSocket?.socket === e) {
              let e = { ...this.stoppedSocket.context, code: n, reason: r };
              ((this.stoppedSocket = void 0),
                this.invoke(`close`, () => this.opts.onClose?.(e, { retry: !1, notify: !0 })));
            }
            return;
          }
          ((this.socket = null), this.clearHandshakeTimer());
          let i = { ...this.closeContext(), code: n, reason: r, generation: t };
          this.connectFailure = void 0;
          let a = this.opts.resolveClose(i);
          (this.flushRequests(
            a.pendingError ?? i.connectFailure?.error ?? Error(`gateway closed (${n}): ${r}`),
          ),
            this.invoke(`close`, () => this.opts.onClose?.(i, a)),
            a.retry &&
              !this.stopped &&
              this.scheduleReconnect(a.reconnectDelayMs ?? i.connectFailure?.reconnectDelayMs));
        }
        handleSocketError(e, t, n) {
          !this.isActive(e, t) || this.connectSent || this.opts.onConnectError?.(n);
        }
        flushRequests(e) {
          for (let [t, n] of this.pending)
            (this.finishRequestTiming(t, n, !1, `CLIENT_CLOSED`), n.cleanup?.(), n.reject(e));
          this.pending.clear();
        }
        finishRequestTiming(e, t, n, r) {
          let i = this.nowMs();
          this.invoke(`request timing`, () =>
            this.opts.onRequestTiming?.({
              id: e,
              method: t.method,
              ok: n,
              durationMs: Math.max(0, i - t.startedAtMs),
              startedAtMs: t.startedAtMs,
              endedAtMs: i,
              errorCode: r,
            }),
          );
        }
        scheduleReconnect(e) {
          e !== void 0 && (this.reconnectSupervisor.nextDelayOverrideMs = e);
          let t = this.reconnectSupervisor.next();
          t &&
            De(t.delayMs, t.signal).then(
              () => this.connect(),
              () => {},
            );
        }
        closeContext() {
          return {
            generation: this.generation,
            socketOpened: this.socketOpened,
            helloReceived: this.helloReceived,
            connectRequestSent: this.connectRequestSent,
            connectFailure: this.connectFailure,
          };
        }
        isActive(e, t) {
          return !this.stopped && this.socket === e && this.generation === t;
        }
        nowMs() {
          return this.opts.nowMs?.() ?? Date.now();
        }
        clearHandshakeTimer() {
          this.handshakeTimer &&= (clearTimeout(this.handshakeTimer), null);
        }
        invoke(e, t) {
          try {
            t();
          } catch (t) {
            this.opts.onCallbackError?.(e, t);
          }
        }
      }));
  });
function ze(e) {
  let t = _(e.details);
  if (!t) return !1;
  let n = y(e.details);
  return t === x.PAIRING_REQUIRED &&
    (n?.pauseReconnect === !1 || n?.recommendedNextStep === `wait_then_retry`)
    ? !1
    : t === x.AUTH_TOKEN_MISMATCH
      ? e.tokenMismatchIsTerminal === !0 && !e.deviceTokenRetryPending
      : Be.has(t) ||
        (e.protocolMismatchIsTerminal === !0 && t === x.PROTOCOL_MISMATCH) ||
        (e.clientVersionMismatchIsTerminal === !0 && t === x.CLIENT_VERSION_MISMATCH);
}
var Be,
  Ve = e(() => {
    (w(),
      (Be = new Set([
        x.AUTH_TOKEN_MISSING,
        x.AUTH_BOOTSTRAP_TOKEN_INVALID,
        x.AUTH_PASSWORD_MISSING,
        x.AUTH_PASSWORD_MISMATCH,
        x.AUTH_RATE_LIMITED,
        x.AUTH_DEVICE_TOKEN_MISMATCH,
        x.AUTH_SCOPE_MISMATCH,
        x.PAIRING_REQUIRED,
        x.CONTROL_UI_DEVICE_IDENTITY_REQUIRED,
        x.DEVICE_IDENTITY_REQUIRED,
      ])));
  }),
  P,
  He,
  F,
  Ue,
  I = e(() => {
    ((P = {
      WEBCHAT_UI: `webchat-ui`,
      CONTROL_UI: `openclaw-control-ui`,
      TUI: `openclaw-tui`,
      WEBCHAT: `webchat`,
      CLI: `cli`,
      GATEWAY_CLIENT: `gateway-client`,
      MACOS_APP: `openclaw-macos`,
      IOS_APP: `openclaw-ios`,
      WATCHOS_APP: `openclaw-watchos`,
      ANDROID_APP: `openclaw-android`,
      NODE_HOST: `node-host`,
      WORKER: `openclaw-worker`,
      TEST: `test`,
      FINGERPRINT: `fingerprint`,
      PROBE: `openclaw-probe`,
    }),
      (He = P),
      (F = {
        WEBCHAT: `webchat`,
        CLI: `cli`,
        UI: `ui`,
        BACKEND: `backend`,
        NODE: `node`,
        WORKER: `worker`,
        PROBE: `probe`,
        TEST: `test`,
      }),
      (Ue = {
        INLINE_WIDGETS: `inline-widgets`,
        TASK_SUGGESTIONS: `task-suggestions`,
        TOOL_EVENTS: `tool-events`,
      }),
      new Set(Object.values(P)),
      new Set(Object.values(F)));
  });
function We(e) {
  return typeof e == `object` && !!e && e.reason === `startup-sidecars`;
}
function Ge(e) {
  if (!e || typeof e != `object`) return !1;
  let t = e;
  return (t.gatewayCode ?? t.code) === `UNAVAILABLE` && t.retryable === !0 && We(t.details);
}
function Ke(e) {
  if (!Ge(e)) return null;
  let t = e.retryAfterMs;
  return Math.min(
    Math.max(Math.floor(typeof t == `number` && Number.isFinite(t) ? t : 500), qe),
    Je,
  );
}
var qe,
  Je,
  Ye = e(() => {
    ((qe = 100), (Je = 2e3));
  }),
  Xe = e(() => {}),
  Ze = e(() => {
    (m(), be(), Re(), Ve(), I(), w(), Ye(), Xe());
  });
function Qe(e) {
  return typeof e == `object` && !!e && !Array.isArray(e);
}
function $e(e) {
  return Qe(e) ? e : void 0;
}
function et(e) {
  return Qe(e) ? e : null;
}
function tt(e) {
  return e && typeof e == `object` ? e : void 0;
}
var nt = e(() => {});
function rt(e) {
  return (typeof e == `string` && e.trim()) || null;
}
function L(e) {
  return rt(e) ?? void 0;
}
function it(e) {
  return L(e)?.toLowerCase();
}
function at(e) {
  return it(e) ?? ``;
}
var R = e(() => {});
function ot(e) {
  return (e ?? []).map((e) => L(String(e)) ?? ``).filter(Boolean);
}
function st(e) {
  return [...new Set(e)];
}
function z(e) {
  return st(e);
}
function ct(e) {
  return z(e).toSorted((e, t) => (e < t ? -1 : +(e > t)));
}
function lt(e) {
  return Array.isArray(e)
    ? e.flatMap((e) => {
        let t = L(e);
        return t ? [t] : [];
      })
    : [];
}
function ut(e) {
  if (Array.isArray(e)) return lt(e);
  let t = L(e);
  return t ? [t] : [];
}
function dt(e) {
  return z(ut(e));
}
var B = e(() => {
    R();
  }),
  ft,
  pt,
  mt,
  ht = e(() => {
    ((ft = `/control-ui-config.json`),
      (pt = `data-openclaw-control-ui-base-path`),
      (mt = `data-openclaw-terminal-enabled`));
  });
function gt(e) {
  return typeof e == `number` && Number.isFinite(e) ? e : void 0;
}
function _t(e, t) {
  let n = gt(e);
  if (
    n !== void 0 &&
    !(t.min !== void 0 && (t.minExclusive ? n <= t.min : n < t.min)) &&
    !(t.max !== void 0 && (t.maxExclusive ? n >= t.max : n > t.max))
  )
    return n;
}
function vt(e) {
  return e.trim() || void 0;
}
function yt(e) {
  if (typeof e == `number`) return Number.isSafeInteger(e) ? e : void 0;
  if (typeof e != `string`) return;
  let t = vt(e);
  if (!t || !/^[+-]?\d+$/.test(t)) return;
  let n = Number(t);
  return Number.isSafeInteger(n) ? n : void 0;
}
function bt(e) {
  if (typeof e == `number`) return Number.isFinite(e) ? e : void 0;
  if (typeof e != `string`) return;
  let t = vt(e);
  if (!t || !/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?$/i.test(t)) return;
  let n = Number(t);
  return Number.isFinite(n) ? n : void 0;
}
function xt(e) {
  return _t(e, { min: -864e13, max: Tt });
}
function St(e) {
  let t = xt(e);
  return t === void 0 ? void 0 : new Date(t).toISOString();
}
function Ct(e) {
  let t = yt(e);
  return t !== void 0 && t > 0 ? t : void 0;
}
var wt,
  Tt,
  Et = e(() => {
    ((wt = 2147e6), Math.floor(wt / 1e3), (Tt = 864e13));
  });
function Dt(e) {
  return e >= 55296 && e <= 56319;
}
function Ot(e) {
  return e >= 56320 && e <= 57343;
}
function kt(e, t, n) {
  let r = e.length,
    i = t < 0 ? Math.max(r + t, 0) : Math.min(t, r),
    a = n === void 0 ? r : n < 0 ? Math.max(r + n, 0) : Math.min(n, r);
  return a <= i
    ? ``
    : (i > 0 && i < r && Ot(e.charCodeAt(i)) && Dt(e.charCodeAt(i - 1)) && (i += 1),
      a > 0 && a < r && Dt(e.charCodeAt(a - 1)) && Ot(e.charCodeAt(a)) && --a,
      e.slice(i, a));
}
function At(e, t) {
  let n = Math.max(0, Math.floor(t));
  return e.length <= n ? e : kt(e, 0, n);
}
var jt = e(() => {}),
  Mt = e(() => {}),
  Nt = e(() => {});
function V(e, t) {
  if (e == null) throw Error(`expected ` + t + ` to be defined`);
  return e;
}
var H = e(() => {});
function Pt(e, t) {
  let { base: n, labels: r } = Ft[t.style],
    i = U.indexOf(t.maxUnit),
    a = 0,
    o = e;
  for (; o >= n && a < i;) ((o /= n), (a += 1));
  let s = V(U[a], `byte-size unit`),
    c = V(r[a], `byte-size label`),
    l = typeof t.fractionDigits == `function` ? t.fractionDigits(o, s) : t.fractionDigits;
  return l === null
    ? `${o}${t.separator}${c}`
    : (t.floorUnits?.includes(s) && (o = Math.floor(o * 10 ** l) / 10 ** l),
      `${o.toFixed(l)}${t.separator}${c}`);
}
var U,
  Ft,
  It = e(() => {
    (H(),
      (U = [`byte`, `kilo`, `mega`, `giga`, `tera`]),
      (Ft = {
        iec: { base: 1024, labels: [`B`, `KiB`, `MiB`, `GiB`, `TiB`] },
        "legacy-binary": { base: 1024, labels: [`B`, `KB`, `MB`, `GB`, `TB`] },
      }));
  });
function Lt(e) {
  try {
    return JSON.parse(e);
  } catch {
    return;
  }
}
var Rt = e(() => {}),
  zt = e(() => {}),
  Bt = e(() => {
    (Mt(), Nt(), H(), It(), Rt(), Et(), nt(), R(), B(), zt(), jt());
  }),
  Vt,
  Ht,
  Ut,
  Wt,
  Gt,
  Kt,
  qt,
  Jt,
  Yt,
  Xt,
  Zt,
  Qt,
  $t = e(() => {
    ((Vt = `Run shell now.`),
      (Ht = `Inspect/control exec sessions.`),
      (Ut = `Schedule reminders, cron, wake events.`),
      (Wt = `List visible sessions; filters/previews.`),
      (Gt = `Read sanitized session history.`),
      (Kt = `Search past session transcripts.`),
      (qt = `Message session or configured agent.`),
      (Jt = `Spawn subagent or ACP session.`),
      (Yt = `Show session status/model/usage.`),
      (Xt = `Track short work plan.`),
      (Zt = `Suggest follow-up work for operator approval.`),
      (Qt = `Withdraw a pending task suggestion.`));
  });
function W(e) {
  return G.filter((t) => t.profiles.includes(e)).map((e) => e.id);
}
function en() {
  let e = new Map();
  for (let t of G) {
    let n = `group:${t.sectionId}`,
      r = e.get(n) ?? [];
    (r.push(t.id), e.set(n, r));
  }
  return {
    "group:openclaw": G.filter((e) => e.includeInOpenClawGroup).map((e) => e.id),
    ...Object.fromEntries(e.entries()),
  };
}
function tn(e) {
  if (!e) return;
  let t = nn[e];
  if (t && !(!t.allow && !t.deny))
    return { allow: t.allow ? [...t.allow] : void 0, deny: t.deny ? [...t.deny] : void 0 };
}
var G,
  nn,
  rn,
  an = e(() => {
    ($t(),
      (G = [
        {
          id: `read`,
          label: `read`,
          description: `Read file contents`,
          sectionId: `fs`,
          profiles: [`coding`],
        },
        {
          id: `write`,
          label: `write`,
          description: `Create or overwrite files`,
          sectionId: `fs`,
          profiles: [`coding`],
        },
        {
          id: `edit`,
          label: `edit`,
          description: `Make precise edits`,
          sectionId: `fs`,
          profiles: [`coding`],
        },
        {
          id: `apply_patch`,
          label: `apply_patch`,
          description: `Patch files`,
          sectionId: `fs`,
          profiles: [`coding`],
        },
        { id: `exec`, label: `exec`, description: Vt, sectionId: `runtime`, profiles: [`coding`] },
        {
          id: `process`,
          label: `process`,
          description: Ht,
          sectionId: `runtime`,
          profiles: [`coding`],
        },
        {
          id: `code_execution`,
          label: `code_execution`,
          description: `Run sandboxed remote analysis`,
          sectionId: `runtime`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `web_search`,
          label: `web_search`,
          description: `Search the web`,
          sectionId: `web`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `web_fetch`,
          label: `web_fetch`,
          description: `Fetch web content`,
          sectionId: `web`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `x_search`,
          label: `x_search`,
          description: `Search X posts`,
          sectionId: `web`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `memory_search`,
          label: `memory_search`,
          description: `Semantic search`,
          sectionId: `memory`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `memory_get`,
          label: `memory_get`,
          description: `Read memory files`,
          sectionId: `memory`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `sessions_list`,
          label: `sessions_list`,
          description: Wt,
          sectionId: `sessions`,
          profiles: [`coding`, `messaging`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `sessions_history`,
          label: `sessions_history`,
          description: Gt,
          sectionId: `sessions`,
          profiles: [`coding`, `messaging`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `sessions_search`,
          label: `sessions_search`,
          description: Kt,
          sectionId: `sessions`,
          profiles: [`coding`, `messaging`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `sessions_send`,
          label: `sessions_send`,
          description: qt,
          sectionId: `sessions`,
          profiles: [`coding`, `messaging`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `sessions_spawn`,
          label: `sessions_spawn`,
          description: Jt,
          sectionId: `sessions`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `sessions_yield`,
          label: `sessions_yield`,
          description: `End turn to receive sub-agent results`,
          sectionId: `sessions`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `subagents`,
          label: `subagents`,
          description: `Manage sub-agents`,
          sectionId: `sessions`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `session_status`,
          label: `session_status`,
          description: Yt,
          sectionId: `sessions`,
          profiles: [`minimal`, `coding`, `messaging`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `spawn_task`,
          label: `spawn_task`,
          description: Zt,
          sectionId: `sessions`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `dismiss_task`,
          label: `dismiss_task`,
          description: Qt,
          sectionId: `sessions`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `browser`,
          label: `browser`,
          description: `Control web browser`,
          sectionId: `ui`,
          profiles: [],
          includeInOpenClawGroup: !0,
        },
        {
          id: `canvas`,
          label: `canvas`,
          description: `Control node Canvas surfaces when the Canvas plugin is enabled`,
          sectionId: `ui`,
          profiles: [],
        },
        {
          id: `message`,
          label: `message`,
          description: `Send messages`,
          sectionId: `messaging`,
          profiles: [`messaging`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `heartbeat_respond`,
          label: `heartbeat_respond`,
          description: `Record heartbeat outcomes`,
          sectionId: `automation`,
          profiles: [],
          includeInOpenClawGroup: !0,
        },
        {
          id: `cron`,
          label: `cron`,
          description: Ut,
          sectionId: `automation`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `gateway`,
          label: `gateway`,
          description: `Gateway control`,
          sectionId: `automation`,
          profiles: [],
          includeInOpenClawGroup: !0,
        },
        {
          id: `nodes`,
          label: `nodes`,
          description: `Nodes + devices`,
          sectionId: `nodes`,
          profiles: [],
          includeInOpenClawGroup: !0,
        },
        {
          id: `computer`,
          label: `computer`,
          description: `Control a paired computer node desktop`,
          sectionId: `nodes`,
          profiles: [],
          includeInOpenClawGroup: !0,
        },
        {
          id: `agents_list`,
          label: `agents_list`,
          description: `List agents`,
          sectionId: `agents`,
          profiles: [],
          includeInOpenClawGroup: !0,
        },
        {
          id: `get_goal`,
          label: `get_goal`,
          description: `Get current thread goal`,
          sectionId: `agents`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `create_goal`,
          label: `create_goal`,
          description: `Create a thread goal`,
          sectionId: `agents`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `update_goal`,
          label: `update_goal`,
          description: `Complete or block a thread goal`,
          sectionId: `agents`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `update_plan`,
          label: `update_plan`,
          description: Xt,
          sectionId: `agents`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `skill_workshop`,
          label: `skill_workshop`,
          description: `Create, update, revise, list, inspect, apply, reject, or quarantine Skill Workshop proposals`,
          sectionId: `agents`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `image`,
          label: `image`,
          description: `Image understanding`,
          sectionId: `media`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `image_generate`,
          label: `image_generate`,
          description: `Image generation`,
          sectionId: `media`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `music_generate`,
          label: `music_generate`,
          description: `Music generation`,
          sectionId: `media`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `video_generate`,
          label: `video_generate`,
          description: `Video generation`,
          sectionId: `media`,
          profiles: [`coding`],
          includeInOpenClawGroup: !0,
        },
        {
          id: `tts`,
          label: `tts`,
          description: `Text-to-speech conversion`,
          sectionId: `media`,
          profiles: [],
          includeInOpenClawGroup: !0,
        },
      ]),
      new Map(G.map((e) => [e.id, e])),
      (nn = {
        minimal: { allow: W(`minimal`) },
        coding: { allow: [...W(`coding`), `bundle-mcp`] },
        messaging: { allow: [...W(`messaging`), `bundle-mcp`] },
        full: { allow: [`*`] },
      }),
      (rn = en()));
  });
function on(e) {
  let t = at(e);
  return un[t] ?? t;
}
function sn(e) {
  return e ? e.map(on).filter(Boolean) : [];
}
function cn(e) {
  let t = sn(e),
    n = [];
  for (let e of t) {
    let t = dn[e];
    if (t) {
      n.push(...t);
      continue;
    }
    n.push(e);
  }
  return z(n);
}
function ln(e) {
  return tn(e);
}
var un,
  dn,
  fn = e(() => {
    (R(), B(), an(), (un = { bash: `exec`, "apply-patch": `apply_patch` }), (dn = { ...rn }));
  });
function pn(e) {
  return typeof e == `string` && e.trim().length > 0 ? e : void 0;
}
function mn(e) {
  return (
    e === K.SECURITY_UNAVAILABLE ||
    e === K.RISK_ACKNOWLEDGEMENT_REQUIRED ||
    e === K.DOWNLOAD_BLOCKED
  );
}
function hn(e) {
  if (!e || typeof e != `object` || Array.isArray(e)) return;
  let t = e,
    n = mn(t.clawhubTrustCode) ? t.clawhubTrustCode : void 0,
    r = pn(t.version),
    i = pn(t.warning);
  if (!(!n && !r && !i))
    return {
      ...(n ? { clawhubTrustCode: n } : {}),
      ...(r ? { version: r } : {}),
      ...(i ? { warning: i } : {}),
    };
}
var K,
  gn = e(() => {
    K = {
      SECURITY_UNAVAILABLE: `clawhub_security_unavailable`,
      RISK_ACKNOWLEDGEMENT_REQUIRED: `clawhub_risk_acknowledgement_required`,
      DOWNLOAD_BLOCKED: `clawhub_download_blocked`,
    };
  });
function _n(e, t) {
  let r,
    i = null,
    a = () => ((r ??= n(e)), r),
    o = (e) => {
      let n = t?.(e);
      if (n) return ((i = [n]), !1);
      let r = a(),
        o = r.Check(e);
      return ((i = o ? null : [...r.Errors(e)]), o);
    };
  return (
    Object.defineProperties(o, {
      errors: {
        configurable: !0,
        enumerable: !0,
        get: () => i,
        set: (e) => {
          i = e ?? null;
        },
      },
      schema: { configurable: !0, enumerable: !0, get: () => e },
    }),
    o
  );
}
var vn = e(() => {
    t();
  }),
  yn,
  bn = e(() => {
    yn = `^(?!\\.{1,2}$)(?:[^\\uD800-\\uDFFF]|[\\uD800-\\uDBFF][\\uDC00-\\uDFFF])+$`;
  });
function q(e) {
  return i(e, { additionalProperties: !1 });
}
var xn = e(() => {
    r();
  }),
  Sn,
  Cn,
  wn,
  Tn,
  En = e(() => {
    ((Sn = `value`),
      (Cn = /^[a-z][a-z0-9_-]{0,63}$/),
      (wn = `~(?:[^01]|$)`),
      (Tn = `^(?!.*(?:^|/)\\.{1,2}(?:/|$))[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$`));
  }),
  Dn,
  On,
  kn,
  J,
  Y,
  An,
  jn,
  Mn,
  Nn,
  Pn,
  Fn = e(() => {
    (r(),
      I(),
      En(),
      xn(),
      (Dn = /^[A-Z][A-Z0-9_]{0,127}$/),
      (On = [`external_user`, `inter_session`, `internal_system`]),
      (kn = 512),
      (J = l({ minLength: 1 })),
      l({ minLength: 1, maxLength: 512 }),
      l({ minLength: 1, maxLength: kn }),
      q({
        kind: l({ enum: [...On] }),
        originSessionId: u(l()),
        sourceSessionKey: u(l()),
        sourceChannel: u(l()),
        sourceTool: u(l()),
      }),
      s(P),
      s(F),
      o([f(`env`), f(`file`), f(`exec`)]),
      (Y = l({ pattern: Cn.source })),
      (An = q({ source: f(`env`), provider: Y, id: l({ pattern: Dn.source }) })),
      (jn = c({
        type: `string`,
        anyOf: [{ const: Sn }, { allOf: [{ pattern: `^/` }, { not: { pattern: wn } }] }],
      })),
      (Mn = q({ source: f(`file`), provider: Y, id: jn })),
      (Nn = q({ source: f(`exec`), provider: Y, id: l({ pattern: Tn }) })),
      (Pn = o([An, Mn, Nn])),
      o([l(), Pn]));
  }),
  In,
  Ln,
  X,
  Rn,
  zn,
  Bn,
  Vn,
  Hn,
  Un,
  Wn,
  Gn,
  Kn,
  qn,
  Z,
  Q,
  $,
  Jn,
  Yn,
  Xn,
  Zn,
  Qn,
  $n,
  er,
  tr,
  nr,
  rr,
  ir,
  ar = e(() => {
    (r(),
      bn(),
      xn(),
      Fn(),
      (In = l({
        minLength: 1,
        pattern: yn,
        description: `Exact full approval id encoded safely in deep-link paths.`,
      })),
      (Ln = o([f(`exec`), f(`plugin`)])),
      (X = o([f(`allow-once`), f(`allow-always`), f(`deny`)])),
      (Rn = o([f(`allow-once`), f(`allow-always`)])),
      o([
        f(`user`),
        f(`timeout`),
        f(`malformed-verdict`),
        f(`no-route`),
        f(`run-aborted`),
        f(`gateway-restart`),
        f(`storage-corrupt`),
      ]),
      (zn = o([f(`user`)])),
      (Bn = o([f(`user`), f(`malformed-verdict`), f(`no-route`), f(`storage-corrupt`)])),
      (Vn = o([f(`timeout`)])),
      (Hn = o([f(`run-aborted`), f(`gateway-restart`)])),
      (Un = o([f(`info`), f(`warning`), f(`critical`)])),
      (Wn = a(X, {
        minItems: 1,
        maxItems: 3,
        uniqueItems: !0,
        contains: f(`deny`),
        description: `Available reviewer decisions. Deny is always available so malformed or unsafe input can fail closed.`,
      })),
      (Gn = i(
        {
          kind: f(`exec`),
          commandText: J,
          commandPreview: u(o([l(), p()])),
          warningText: u(o([l(), p()])),
          host: u(o([l(), p()])),
          nodeId: u(o([J, p()])),
          agentId: u(o([J, p()])),
          allowedDecisions: Wn,
        },
        {
          additionalProperties: !1,
          description: `Reviewer-safe exec presentation. Runtime cwd, environment, system-run binding, and execution plan are intentionally excluded.`,
        },
      )),
      (Kn = q({
        kind: f(`plugin`),
        title: l({ minLength: 1, maxLength: 80 }),
        description: l({ minLength: 1, maxLength: 512 }),
        severity: Un,
        pluginId: u(o([J, p()])),
        toolName: u(o([J, p()])),
        agentId: u(o([J, p()])),
        allowedDecisions: Wn,
      })),
      (qn = o([Gn, Kn])),
      (Z = {
        id: In,
        urlPath: J,
        createdAtMs: d({ minimum: 0 }),
        expiresAtMs: d({ minimum: 0 }),
        presentation: qn,
      }),
      (Q = { resolvedAtMs: d({ minimum: 0 }) }),
      ($ = q({ ...Z, status: f(`pending`) })),
      (Jn = q({ ...Z, ...Q, status: f(`allowed`), decision: Rn, reason: zn })),
      (Yn = q({ ...Z, ...Q, status: f(`denied`), decision: f(`deny`), reason: Bn })),
      (Xn = q({ ...Z, ...Q, status: f(`expired`), reason: Vn })),
      (Zn = q({ ...Z, ...Q, status: f(`cancelled`), reason: Hn })),
      (Qn = o([$, Jn, Yn, Xn, Zn])),
      ($n = o([Jn, Yn, Xn, Zn])),
      q({ id: Z.id }),
      (er = q({ approval: Qn })),
      q({ id: Z.id, kind: Ln, decision: X }),
      (tr = q({ applied: ee(), approval: $n })),
      (nr = { sessionKey: J, sourceSessionKey: u(J), updatedAtMs: d({ minimum: 0 }) }),
      (rr = q({ ...nr, phase: f(`pending`), approval: $ })),
      (ir = q({ ...nr, phase: f(`terminal`), approval: $n })),
      o([rr, ir]),
      q({ sessionKey: J, updatedAtMs: d({ minimum: 0 }), approvals: a($), truncated: ee() }));
  }),
  or,
  sr,
  cr = e(() => {
    (vn(), ar(), (or = _n(er)), (sr = _n(tr)));
  }),
  lr,
  ur,
  dr,
  fr,
  pr,
  mr,
  hr,
  gr,
  _r,
  vr,
  yr,
  br,
  xr,
  Sr = e(() => {
    ((lr = [
      `triage`,
      `backlog`,
      `todo`,
      `scheduled`,
      `ready`,
      `running`,
      `review`,
      `blocked`,
      `done`,
    ]),
      (ur = [`low`, `normal`, `high`, `urgent`]),
      (dr = [`codex`, `claude`]),
      (fr = [`autonomous`, `manual`]),
      (pr = [`idle`, `running`, `review`, `blocked`, `done`]),
      (mr = [
        `created`,
        `edited`,
        `moved`,
        `linked`,
        `specified`,
        `decomposed`,
        `claimed`,
        `heartbeat`,
        `execution_updated`,
        `attempt_started`,
        `attempt_updated`,
        `comment_added`,
        `link_added`,
        `proof_added`,
        `artifact_added`,
        `attachment_added`,
        `diagnostic`,
        `notification`,
        `dispatch`,
        `orchestration`,
        `protocol_violation`,
        `archived`,
        `unarchived`,
        `stale`,
      ]),
      (hr = [`running`, `succeeded`, `failed`, `blocked`, `stopped`]),
      (gr = [`parent`, `child`, `blocks`, `blocked_by`, `relates_to`]),
      (_r = [`passed`, `failed`, `skipped`, `unknown`]),
      (vr = [`bugfix`, `docs`, `release`, `pr_review`, `plugin`]),
      (yr = [
        `stranded_ready`,
        `running_without_heartbeat`,
        `blocked_too_long`,
        `repeated_failures`,
        `missing_proof`,
        `orphaned_session`,
      ]),
      (br = [`warning`, `error`, `critical`]),
      (xr = [`completed`, `failed`, `stale`]));
  }),
  Cr,
  wr = e(() => {
    Cr = `update.available`;
  });
export {
  at as $,
  Pt as A,
  le as At,
  bt as B,
  cn as C,
  be as Ct,
  Bt as D,
  x as Dt,
  ln as E,
  ye as Et,
  kt as F,
  te as Ft,
  mt as G,
  St as H,
  At as I,
  m as It,
  ot as J,
  ht as K,
  xt as L,
  V as M,
  _ as Mt,
  H as N,
  ce as Nt,
  Rt as O,
  oe as Ot,
  jt as P,
  y as Pt,
  R as Q,
  gt as R,
  hn as S,
  _e as St,
  on as T,
  ge as Tt,
  pt as U,
  Ct as V,
  ft as W,
  ct as X,
  dt as Y,
  z as Z,
  cr as _,
  Ve as _t,
  br as a,
  nt as at,
  K as b,
  N as bt,
  fr as c,
  Xe as ct,
  xr as d,
  Ke as dt,
  it as et,
  ur as f,
  Ue as ft,
  Sr as g,
  I as gt,
  vr as h,
  He as ht,
  yr as i,
  $e as it,
  It as j,
  w as jt,
  Lt as k,
  ue as kt,
  pr as l,
  Ye as lt,
  lr as m,
  F as mt,
  wr as n,
  et as nt,
  mr as o,
  Qe as ot,
  _r as p,
  P as pt,
  B as q,
  hr as r,
  tt as rt,
  dr as s,
  Ze as st,
  Cr as t,
  L as tt,
  gr as u,
  Ge as ut,
  or as v,
  ze as vt,
  fn as w,
  ve as wt,
  gn as x,
  Re as xt,
  sr as y,
  Le as yt,
  Et as z,
};
//# sourceMappingURL=control-ui-foundation-s2wA1PVE.js.map
