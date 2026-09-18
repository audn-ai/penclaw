const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "./ghostty-web-BEtr8uf-.js",
      "./rolldown-runtime-DaJ6WEGw.js",
      "./control-ui-foundation-CCDffryi.js",
      "./control-ui-foundation-s2wA1PVE.js",
      "./control-ui-foundation-CSxeaoE-.js",
      "./control-ui-foundation-DmtL9jaX.js",
      "./control-ui-foundation-BSyioE0Z.js",
      "./control-ui-foundation-BV4RtoqL.js",
      "./control-ui-foundation-Ce4npCeY.js",
      "./control-ui-foundation-ZzBFjbRr.js",
      "./control-ui-foundation-BWwpVuhO.js",
      "./control-ui-foundation-0uuDj0X3.js",
      "./lit-runtime-DkvDG939.js",
    ]),
) => i.map((i) => d[i]);
import { v as t, y as n } from "./control-ui-foundation-CCDffryi.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function r(e) {
  if (
    !Number.isSafeInteger(e.columns) ||
    !Number.isSafeInteger(e.rows) ||
    e.columns < 1 ||
    e.rows < 1 ||
    e.columns > 65535 ||
    e.rows > 65535
  )
    throw new i(
      `invalid_terminal_size`,
      `terminal size must be integer columns and rows between 1 and 65535`,
    );
  return e;
}
var i,
  a = e(() => {
    i = class extends Error {
      code;
      cause;
      constructor(e, t, n) {
        (super(t), (this.name = `LibterminalError`), (this.code = e), (this.cause = n?.cause));
      }
    };
  });
function o(e, t) {
  let n = e.sessionId ?? ``,
    r = p.encode(n),
    i = e.payload ?? new Uint8Array(),
    a = t?.maxSessionIdBytes ?? 4096,
    o = t?.maxFrameBytes ?? 1048576;
  if (r.byteLength > a) throw l(`session id exceeds ${a} bytes`);
  if (!u(e.type)) throw l(`terminal frame message type ${String(e.type)} is unsupported`);
  let s = 8 + r.length + 4 + i.length;
  if (s > o) throw l(`terminal frame exceeds ${o} bytes`);
  let c = new Uint8Array(s),
    f = new DataView(c.buffer, c.byteOffset, c.byteLength),
    m = 0;
  return (
    f.setUint16(m, d, !0),
    (m += 2),
    f.setUint8(m, 2),
    (m += 1),
    f.setUint8(m, e.type),
    (m += 1),
    f.setUint32(m, r.length, !0),
    (m += 4),
    c.set(r, m),
    (m += r.length),
    f.setUint32(m, i.length, !0),
    (m += 4),
    c.set(i, m),
    c
  );
}
function s(e, t) {
  let n = t?.maxFrameBytes ?? 1048576,
    r = t?.maxSessionIdBytes ?? 4096;
  if (e.byteLength > n) throw l(`terminal frame exceeds ${n} bytes`);
  if (e.byteLength < 12) throw l(`terminal frame is shorter than its fixed header`);
  let a = new DataView(e.buffer, e.byteOffset, e.byteLength),
    o = 0;
  if (a.getUint16(o, !0) !== 22851) throw l(`terminal frame has invalid magic`);
  o += 2;
  let s = a.getUint8(o);
  if (s !== 2) throw new i(`unsupported_protocol`, `terminal protocol version ${s} is unsupported`);
  o += 1;
  let c = a.getUint8(o);
  if (!u(c)) throw l(`terminal frame message type ${c} is unsupported`);
  o += 1;
  let d = a.getUint32(o, !0);
  if (((o += 4), d > r)) throw l(`session id exceeds ${r} bytes`);
  if (o + d + 4 > e.byteLength) throw l(`terminal frame session id length exceeds frame length`);
  let f;
  try {
    f = m.decode(e.subarray(o, o + d));
  } catch (e) {
    throw new i(`invalid_frame`, `terminal frame session id is not UTF-8`, { cause: e });
  }
  o += d;
  let p = a.getUint32(o, !0);
  if (((o += 4), o + p !== e.byteLength))
    throw l(`terminal frame payload length does not match frame length`);
  return { type: c, sessionId: f, payload: e.subarray(o, o + p) };
}
function c(e, t) {
  try {
    return s(e, t);
  } catch {
    return null;
  }
}
function l(e) {
  return new i(`invalid_frame`, e);
}
function u(e) {
  return h.has(e);
}
var d,
  f,
  p,
  m,
  h,
  g = e(() => {
    (a(),
      (d = 22851),
      (f = {
        Hello: 1,
        Welcome: 2,
        Subscribe: 10,
        Unsubscribe: 11,
        Output: 20,
        Snapshot: 21,
        Event: 22,
        Error: 23,
        Input: 30,
        Key: 31,
        Resize: 32,
        Stop: 33,
        ControlRequest: 50,
        ControlDecision: 51,
        ControlGranted: 52,
        ControlRevoked: 53,
        Ping: 60,
        Pong: 61,
        Ack: 62,
      }),
      (p = new TextEncoder()),
      (m = new TextDecoder(`utf-8`, { fatal: !0 })),
      (h = new Set(Object.values(f))));
  });
async function _(e) {
  if (e?.module) return S(e.module, e.wasmUrl);
  let n = e?.wasmUrl ?? `<default>`,
    r = A.get(n);
  r ||
    ((r = t(
      () => import(`./ghostty-web-BEtr8uf-.js`).then((t) => S(t, e?.wasmUrl)),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
      import.meta.url,
    )),
    A.set(n, r));
  try {
    return await r;
  } catch (e) {
    throw (
      A.delete(n),
      new i(`ghostty_unavailable`, `failed to load Ghostty browser runtime`, { cause: e })
    );
  }
}
async function v(e) {
  (e.onStatus?.({ state: `loading` }), w(e.signal));
  let t, n;
  try {
    let r = e.runtime ?? (await _(e.runtimeOptions));
    w(e.signal);
    let i = e.readOnly ?? !0;
    t = new r.Terminal({ ...e.terminalOptions, disableStdin: i, ghostty: r.ghostty });
    let a = new r.FitAddon();
    return (
      t.loadAddon(a),
      t.open(e.parent),
      (n = new P(t, a, i, e)),
      n.start(),
      e.onStatus?.({ state: `ready` }),
      n
    );
  } catch (r) {
    throw (
      n ? n.dispose() : t?.dispose(),
      T(e.signal, r) || (e.onStatus?.({ state: `error`, error: r }), r instanceof i)
        ? r
        : new i(`ghostty_unavailable`, `failed to create Ghostty browser terminal`, { cause: r })
    );
  }
}
async function y(e, t, n) {
  let r = t[Symbol.asyncIterator](),
    i = C(n),
    a = !1,
    o = !1,
    s;
  try {
    for (;;) {
      let t = i ? await Promise.race([r.next(), i.promise]) : await r.next();
      if (t === F || t.done) {
        a = t !== F;
        return;
      }
      e.write(t.value);
    }
  } catch (e) {
    ((o = !0), (s = e));
  } finally {
    if ((i?.dispose(), !a)) {
      let e = r.return?.();
      if (n?.aborted) Promise.resolve(e).catch(D);
      else
        try {
          await e;
        } catch (e) {
          o || ((o = !0), (s = e));
        }
    }
  }
  if (o) throw s;
}
function b(e) {
  return new WebSocket(e);
}
async function x(e) {
  return e instanceof Uint8Array
    ? e.slice()
    : e instanceof ArrayBuffer
      ? new Uint8Array(e)
      : ArrayBuffer.isView(e)
        ? new Uint8Array(e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength))
        : (typeof Blob < `u` && e instanceof Blob) || O(e)
          ? new Uint8Array(await e.arrayBuffer())
          : k.encode(String(e));
}
async function S(e, t) {
  try {
    return { ghostty: await e.Ghostty.load(t), Terminal: e.Terminal, FitAddon: e.FitAddon };
  } catch (e) {
    throw new i(`ghostty_unavailable`, `failed to load Ghostty WASM`, { cause: e });
  }
}
function C(e) {
  if (!e) return;
  if (e.aborted) return { promise: Promise.resolve(F), dispose: () => void 0 };
  let t = D,
    n = new Promise((e) => {
      t = e;
    }),
    r = () => t(F);
  return (
    e.addEventListener(`abort`, r, { once: !0 }),
    { promise: n, dispose: () => e.removeEventListener(`abort`, r) }
  );
}
function w(e) {
  if (e?.aborted) throw e.reason ?? new DOMException(`The operation was aborted`, `AbortError`);
}
function T(e, t) {
  return e?.aborted
    ? t === e.reason
      ? !0
      : e.reason === void 0 && t instanceof DOMException && t.name === `AbortError`
    : !1;
}
function E(e, t) {
  if (!t) return { signal: e, dispose: () => void 0 };
  let n = new AbortController(),
    r = () => n.abort(e.reason),
    i = () => n.abort(t.reason);
  return (
    e.aborted
      ? r()
      : t.aborted
        ? i()
        : (e.addEventListener(`abort`, r, { once: !0 }),
          t.addEventListener(`abort`, i, { once: !0 })),
    {
      signal: n.signal,
      dispose: () => {
        (e.removeEventListener(`abort`, r), t.removeEventListener(`abort`, i));
      },
    }
  );
}
function D() {}
function O(e) {
  return typeof e == `object` && !!e && `arrayBuffer` in e && typeof e.arrayBuffer == `function`;
}
var k, A, j, M, N, P, F;
e(() => {
  (a(),
    g(),
    n(),
    (k = new TextEncoder()),
    (A = new Map()),
    (j = 2),
    (M = 1),
    (N = class {
      options;
      socket;
      reconnectTimer;
      closedByCaller = !1;
      constructor(e) {
        this.options = e;
      }
      get isOpen() {
        return this.socket?.readyState === M;
      }
      connect() {
        if (((this.closedByCaller = !1), this.socket && this.socket.readyState < j)) return;
        this.clearReconnectTimer();
        let e;
        try {
          e = (this.options.socketFactory ?? b)(this.resolveUrl());
        } catch (e) {
          (this.reportError(e), this.scheduleReconnect());
          return;
        }
        this.socket = e;
        let t = Promise.resolve();
        ((e.binaryType = `arraybuffer`),
          e.addEventListener(`open`, this.handleOpen(e)),
          e.addEventListener(
            `message`,
            this.handleMessage(e, (e) => {
              t = t
                .catch(D)
                .then(e)
                .catch((e) => this.reportError(e));
            }),
          ),
          e.addEventListener(`close`, this.handleClose(e)),
          e.addEventListener(`error`, this.handleError(e)));
      }
      send(e) {
        let t = this.socket;
        if (!t || t.readyState !== M) return !1;
        try {
          return (t.send(o(e, this.options.frameLimits)), !0);
        } catch (e) {
          return (this.reportError(e), !1);
        }
      }
      close(e = 1e3, t = `terminal hub closed`) {
        ((this.closedByCaller = !0), this.clearReconnectTimer());
        let n = this.socket;
        if (!(!n || n.readyState >= j))
          try {
            n.close(e, t);
          } catch (e) {
            ((this.socket = void 0), this.reportError(e));
          }
      }
      handleOpen(e) {
        return () => {
          this.socket === e &&
            (this.send({ type: f.Hello }), this.notify(() => this.options.onOpen?.()));
        };
      }
      handleMessage(e, t) {
        return (n) => {
          t(async () => {
            if (this.socket !== e) return;
            let t = c(await x(n.data), this.options.frameLimits);
            t && this.socket === e && this.notify(() => this.options.onFrame?.(t));
          });
        };
      }
      handleClose(e) {
        return (t) => {
          this.socket === e &&
            ((this.socket = void 0),
            this.notify(() => this.options.onClose?.(t)),
            this.scheduleReconnect());
        };
      }
      handleError(e) {
        return () => {
          this.socket === e && this.reportError();
        };
      }
      resolveUrl() {
        return typeof this.options.url == `function` ? this.options.url() : this.options.url;
      }
      scheduleReconnect() {
        this.closedByCaller ||
          this.reconnectTimer ||
          !this.shouldReconnect() ||
          (this.reconnectTimer = setTimeout(() => {
            ((this.reconnectTimer = void 0), this.connect());
          }, this.options.reconnectDelayMs ?? 1500));
      }
      shouldReconnect() {
        try {
          return !!this.options.shouldReconnect?.();
        } catch (e) {
          return (this.reportError(e), !1);
        }
      }
      clearReconnectTimer() {
        this.reconnectTimer &&= (clearTimeout(this.reconnectTimer), void 0);
      }
      notify(e) {
        try {
          e();
        } catch (e) {
          this.reportError(e);
        }
      }
      reportError(e) {
        try {
          this.options.onError?.(e);
        } catch {}
      }
    }),
    (P = class {
      terminal;
      fitAddon;
      options;
      inputSubscription;
      resizeSubscription;
      abortListener;
      disposed = !1;
      currentReadOnly;
      disposeController = new AbortController();
      constructor(e, t, n, r) {
        ((this.terminal = e), (this.fitAddon = t), (this.currentReadOnly = n), (this.options = r));
      }
      get readOnly() {
        return this.currentReadOnly;
      }
      start() {
        ((this.inputSubscription = this.terminal.onData((e) => {
          this.currentReadOnly || this.options.onData?.(k.encode(e));
        })),
          (this.resizeSubscription = this.terminal.onResize(({ cols: e, rows: t }) => {
            this.options.onResize?.({ columns: e, rows: t });
          })),
          this.options.size
            ? this.resize(this.options.size)
            : this.options.autoFit !== !1 && this.fitAddon.fit(),
          this.options.autoFit !== !1 && this.fitAddon.observeResize());
        let e = this.options.signal;
        e &&
          ((this.abortListener = () => this.dispose()),
          e.addEventListener(`abort`, this.abortListener, { once: !0 }),
          e.aborted && this.abortListener());
      }
      write(e) {
        (this.assertOpen(), this.terminal.write(e));
      }
      resize(e) {
        (this.assertOpen(), r(e), this.terminal.resize(e.columns, e.rows));
      }
      fit() {
        (this.assertOpen(), this.fitAddon.fit());
      }
      setReadOnly(e) {
        (this.assertOpen(), (this.currentReadOnly = e), (this.terminal.options.disableStdin = e));
      }
      async attach(e, t) {
        this.assertOpen();
        let n = E(this.disposeController.signal, t ?? this.options.signal);
        try {
          (await y(this.terminal, e, n.signal), this.options.onStatus?.({ state: `ended` }));
        } catch (e) {
          throw (this.options.onStatus?.({ state: `error`, error: e }), e);
        } finally {
          n.dispose();
        }
      }
      dispose() {
        this.disposed ||
          ((this.disposed = !0),
          this.disposeController.abort(`terminal disposed`),
          (this.abortListener &&=
            (this.options.signal?.removeEventListener(`abort`, this.abortListener), void 0)),
          this.inputSubscription?.dispose(),
          this.resizeSubscription?.dispose(),
          this.fitAddon.dispose(),
          this.terminal.dispose());
      }
      assertOpen() {
        if (this.disposed) throw new i(`transport_closed`, `Ghostty browser terminal is disposed`);
      }
    }),
    (F = Symbol(`aborted`)));
})();
export {
  N as TerminalHubClient,
  y as attachTerminalStream,
  v as createGhosttyTerminal,
  _ as loadGhosttyRuntime,
};
//# sourceMappingURL=browser-Bh1my_FA.js.map
