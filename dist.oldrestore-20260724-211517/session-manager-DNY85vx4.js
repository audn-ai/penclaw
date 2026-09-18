import { randomUUID } from "node:crypto";
import { t as TerminalOutputRing } from "./output-ring-Bz-YhhYd.js";
import { t as spawnTerminalPty } from "./terminal-pty-BOVSjGUD.js";
//#region src/gateway/terminal/backend.ts
async function createLocalTerminalBackend(params, spawn = spawnTerminalPty) {
  const pty = await spawn(params);
  return {
    write: (data) => pty.write(data),
    resize: (cols, rows) => pty.resize(cols, rows),
    kill: () => pty.kill(),
    onData: (callback) => pty.onData(callback),
    onExit: (callback) => pty.onExit(callback),
  };
}
//#endregion
//#region src/gateway/terminal/session-manager.ts
const TERMINAL_EVENT_DATA = "terminal.data";
const TERMINAL_EVENT_EXIT = "terminal.exit";
/** Bounds concurrent shells so a client cannot exhaust host processes. */
const DEFAULT_MAX_SESSIONS = 24;
/**
 * Rolling output kept per session for reattach replay and terminal.text,
 * in UTF-16 code units (≈ bytes for typical terminal output). Constant, not
 * config: ~256 KiB × session cap bounds worst-case memory at a few MiB.
 */
const DEFAULT_SCROLLBACK_CHARS = 256 * 1024;
/**
 * Cap on simultaneously detached sessions; the oldest detached session is
 * killed to make room. Keeps repeated disconnects from parking a full
 * session-cap worth of headless shells.
 */
const DEFAULT_MAX_DETACHED_SESSIONS = 8;
/** Default grace period before a detached session is killed (seconds). */
const DEFAULT_TERMINAL_DETACH_SECONDS = 300;
/**
 * Tracks live PTY sessions keyed by session id, with a reverse index by
 * connection so a disconnect can tear down every shell it owned.
 */
var TerminalSessionManager = class {
  constructor(options) {
    this.sessions = /* @__PURE__ */ new Map();
    this.byConn = /* @__PURE__ */ new Map();
    this.pendingOpens = /* @__PURE__ */ new Map();
    this.opening = 0;
    this.emit = options.emit;
    this.spawn = options.spawn;
    this.maxSessions = options.maxSessions ?? DEFAULT_MAX_SESSIONS;
    this.detachGraceMs = options.detachGraceMs ?? 0;
    this.maxDetachedSessions = options.maxDetachedSessions ?? DEFAULT_MAX_DETACHED_SESSIONS;
    this.scrollbackChars = options.scrollbackChars ?? DEFAULT_SCROLLBACK_CHARS;
  }
  /** Number of live sessions; used by tests and health surfaces. */
  get size() {
    return this.sessions.size;
  }
  /** Spawns a shell and wires its output/exit to the owning connection. */
  async open(request) {
    if (this.sessions.size + this.opening >= this.maxSessions)
      return {
        ok: false,
        code: "limit",
        message: `terminal session limit reached (${this.maxSessions})`,
      };
    this.opening += 1;
    const token = { agentId: request.agentId };
    this.trackPendingOpen(request.connId, token);
    let backend;
    try {
      backend = request.createBackend
        ? await request.createBackend()
        : await createLocalTerminalBackend(
            {
              file: request.shell,
              args: request.args,
              cwd: request.cwd,
              env: request.env,
              cols: request.cols,
              rows: request.rows,
            },
            this.spawn,
          );
    } catch (err) {
      this.opening -= 1;
      this.untrackPendingOpen(request.connId, token);
      return {
        ok: false,
        code: "spawn_failed",
        message: err instanceof Error ? err.message : String(err),
      };
    }
    this.opening -= 1;
    this.untrackPendingOpen(request.connId, token);
    if (token.abortMessage) {
      try {
        backend.kill();
      } catch {}
      return {
        ok: false,
        code: "closed",
        message: token.abortMessage,
      };
    }
    const session = {
      id: randomUUID(),
      connId: request.connId,
      agentId: request.agentId,
      cwd: request.cwd,
      shell: request.shell,
      backend,
      seq: 0,
      closed: false,
      createdAtMs: Date.now(),
      buffer: new TerminalOutputRing(this.scrollbackChars),
      reaper: null,
      detachedAtMs: null,
    };
    this.sessions.set(session.id, session);
    this.indexByConn(request.connId, session.id);
    backend.onData((chunk) => {
      if (session.closed) return;
      session.buffer.push(chunk);
      if (session.connId === null) return;
      this.emit(session.connId, TERMINAL_EVENT_DATA, {
        sessionId: session.id,
        seq: session.seq++,
        data: chunk,
      });
    });
    backend.onExit((event) => {
      const signal = event.signal && event.signal !== 0 ? event.signal : null;
      this.finalize(session, event.error ? "error" : "process_exit", {
        exitCode: event.exitCode ?? null,
        signal,
        ...(event.error ? { error: event.error } : {}),
      });
    });
    return {
      ok: true,
      sessionId: session.id,
      agentId: session.agentId,
      cwd: session.cwd,
      shell: session.shell,
    };
  }
  /** Writes client input to a session; returns false when the session is gone. */
  write(connId, sessionId, data) {
    const session = this.ownedSession(connId, sessionId);
    if (!session) return false;
    try {
      session.backend.write(data);
      return true;
    } catch {
      this.finalize(session, "error", { error: "write failed" });
      return false;
    }
  }
  /** Applies a new PTY grid size; returns false when the session is gone. */
  resize(connId, sessionId, cols, rows) {
    const session = this.ownedSession(connId, sessionId);
    if (!session) return false;
    try {
      session.backend.resize(cols, rows);
      return true;
    } catch {
      this.finalize(session, "error", { error: "resize failed" });
      return false;
    }
  }
  /** Closes one session on operator request. */
  close(connId, sessionId) {
    const session = this.ownedSession(connId, sessionId);
    if (!session) return false;
    this.finalize(session, "closed", {});
    return true;
  }
  /**
   * Rebinds a live-or-detached session to `connId` and returns the replay
   * buffer. Take-over is deliberate: the surface is operator.admin (full host
   * access already), so any admin connection may adopt any session; a previous
   * live owner is notified with reason "detached". Snapshot and rebind happen
   * in one synchronous step, so no PTY chunk can land in both the returned
   * buffer and the new owner's event stream.
   */
  attach(connId, sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed) return;
    if (session.reaper) {
      clearTimeout(session.reaper);
      session.reaper = null;
    }
    session.detachedAtMs = null;
    if (session.connId !== null && session.connId !== connId) {
      this.byConn.get(session.connId)?.delete(session.id);
      this.emit(session.connId, TERMINAL_EVENT_EXIT, {
        sessionId: session.id,
        exitCode: null,
        signal: null,
        reason: "detached",
      });
    }
    session.connId = connId;
    this.indexByConn(connId, session.id);
    return {
      sessionId: session.id,
      agentId: session.agentId,
      cwd: session.cwd,
      shell: session.shell,
      buffer: session.buffer.snapshot(),
    };
  }
  /** Every live session, oldest first; all admin connections see the same list. */
  list() {
    return [...this.sessions.values()]
      .filter((session) => !session.closed)
      .map((session) => ({
        sessionId: session.id,
        agentId: session.agentId,
        shell: session.shell,
        cwd: session.cwd,
        attached: session.connId !== null,
        createdAtMs: session.createdAtMs,
      }))
      .toSorted((a, b) => a.createdAtMs - b.createdAtMs);
  }
  /** Raw buffered output for one session, or undefined when it is gone. */
  snapshot(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.closed) return;
    return session.buffer.snapshot();
  }
  trackPendingOpen(connId, token) {
    let set = this.pendingOpens.get(connId);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      this.pendingOpens.set(connId, set);
    }
    set.add(token);
  }
  untrackPendingOpen(connId, token) {
    const set = this.pendingOpens.get(connId);
    if (set) {
      set.delete(token);
      if (set.size === 0) this.pendingOpens.delete(connId);
    }
  }
  /**
   * Handles a dropped connection: detaches its sessions for later reattach
   * when a grace period is configured, otherwise kills them (legacy behavior,
   * still selected by detachedSessionTimeoutSeconds: 0).
   */
  handleDisconnect(connId) {
    const opens = this.pendingOpens.get(connId);
    if (opens) for (const token of opens) token.abortMessage = "connection closed during open";
    const ids = this.byConn.get(connId);
    if (!ids) return;
    for (const id of Array.from(ids)) {
      const session = this.sessions.get(id);
      if (!session) continue;
      if (this.detachGraceMs > 0) this.detach(session);
      else this.finalize(session, "disconnected", {}, { silent: true });
    }
    this.byConn.delete(connId);
  }
  /** Closes live and pending sessions whose agent no longer permits a host shell. */
  closeDisallowedAgents(isAllowed) {
    for (const opens of this.pendingOpens.values())
      for (const token of opens)
        if (!isAllowed(token.agentId))
          token.abortMessage = "terminal closed because the agent policy changed";
    for (const session of Array.from(this.sessions.values()))
      if (!isAllowed(session.agentId))
        this.finalize(session, "closed", {
          error: "terminal closed because the agent policy changed",
        });
  }
  /** Parks a session ownerless with a reaper; PTY output keeps buffering. */
  detach(session) {
    session.connId = null;
    session.detachedAtMs = Date.now();
    session.reaper = setTimeout(() => {
      this.finalize(session, "disconnected", {}, { silent: true });
    }, this.detachGraceMs);
    session.reaper.unref?.();
    this.enforceDetachedCap();
  }
  enforceDetachedCap() {
    const detached = [...this.sessions.values()]
      .filter((session) => !session.closed && session.connId === null)
      .toSorted((a, b) => (a.detachedAtMs ?? 0) - (b.detachedAtMs ?? 0));
    for (const session of detached.slice(
      0,
      Math.max(0, detached.length - this.maxDetachedSessions),
    ))
      this.finalize(session, "disconnected", {}, { silent: true });
  }
  /**
   * Tears down every session — detached ones included — on gateway
   * shutdown/stop. Silent because the sockets are going away anyway (disabling
   * the terminal is a `gateway` restart, so that path also runs through here,
   * not a live notification).
   */
  disposeAll() {
    for (const opens of this.pendingOpens.values())
      for (const token of opens) token.abortMessage = "gateway closed during terminal open";
    for (const session of Array.from(this.sessions.values()))
      this.finalize(session, "disconnected", {}, { silent: true });
  }
  indexByConn(connId, sessionId) {
    let connSessions = this.byConn.get(connId);
    if (!connSessions) {
      connSessions = /* @__PURE__ */ new Set();
      this.byConn.set(connId, connSessions);
    }
    connSessions.add(sessionId);
  }
  ownedSession(connId, sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.connId !== connId || session.closed) return;
    return session;
  }
  finalize(session, reason, detail, opts) {
    if (session.closed) return;
    session.closed = true;
    if (session.reaper) {
      clearTimeout(session.reaper);
      session.reaper = null;
    }
    this.sessions.delete(session.id);
    if (session.connId !== null) this.byConn.get(session.connId)?.delete(session.id);
    try {
      session.backend.kill();
    } catch {}
    if (!opts?.silent && session.connId !== null)
      this.emit(session.connId, TERMINAL_EVENT_EXIT, {
        sessionId: session.id,
        exitCode: detail.exitCode ?? null,
        signal: detail.signal ?? null,
        reason,
        ...(detail.error ? { error: detail.error } : {}),
      });
  }
};
//#endregion
export { DEFAULT_TERMINAL_DETACH_SECONDS, TerminalSessionManager };
