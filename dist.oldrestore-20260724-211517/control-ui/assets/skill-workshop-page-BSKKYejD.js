import { K as de, f as fe, l as pe, q as me } from "./control-ui-core--EZfp09c.js";
import {
  Cn as te,
  Hn as y,
  J as ne,
  Rn as re,
  Ua as ie,
  Va as b,
  Y as ae,
  _n as x,
  da as S,
  di as oe,
  fi as se,
  la as ce,
  tn as le,
  ua as ue,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as he, E as ge, J as T, Q as E, w as _e, x as D } from "./control-ui-core-CQDTaMS5.js";
import { o as C, t as w } from "./control-ui-core-CwQmiouz.js";
import { dt as r, ft as i } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { I as g, P as _, at as ee, nt as v } from "./control-ui-foundation-s2wA1PVE.js";
import {
  loadSkillWorkshopPageData as De,
  n as Oe,
  r as ke,
  runSkillWorkshopPageHistoryScan as Ae,
  t as je,
} from "./history-scan-page-controller-CPR2HIQQ.js";
import {
  G as a,
  K as o,
  R as s,
  Z as c,
  at as l,
  d as u,
  et as d,
  l as f,
  nt as p,
  ut as m,
  z as h,
} from "./lit-runtime-DkvDG939.js";
import { n as ye, r as be, t as xe } from "./plugins-ACOlUaqG.js";
import {
  countSkillWorkshopProposals as Se,
  createSkillWorkshopState as O,
  loadSkillWorkshopProposals as Ce,
  requestSkillWorkshopRevision as we,
  runSkillWorkshopLifecycleAction as k,
  selectSkillWorkshopProposal as Te,
  t as Ee,
} from "./proposals-DhWcKEKu.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { t as ve } from "./web-awesome-tabs-B3ooykzD.js";
function A(e, t, n) {
  let r = n.trim().toLowerCase();
  return e.filter(
    (e) =>
      !(
        (t !== `all` && e.status !== t) ||
        (r && !`${e.name} ${e.oneLine} ${e.slug}`.toLowerCase().includes(r))
      ),
  );
}
var j = e(() => {});
function Me(e) {
  return v(v(v(e.skills)?.workshop)?.autonomous)?.enabled === !0;
}
function Ne(e, t, n) {
  let r = ae(e?.state.configSnapshot);
  return r ? { enabled: Me(r), busy: t, error: n } : null;
}
async function Pe(e, t) {
  let n = {
      raw: { skills: { workshop: { autonomous: { enabled: t } } } },
      note: t ? `Enable Skill Workshop self-learning` : `Disable Skill Workshop self-learning`,
    },
    r = await e.patch(n);
  if (!r && e.state.lastError?.includes(M)) {
    if ((await e.refresh(), e.state.lastError)) return e.state.lastError;
    r = await e.patch(n);
  }
  return r
    ? (await e.refresh(), null)
    : (e.state.lastError ?? C(`skillWorkshop.selfLearning.updateError`));
}
function Fe(e, t) {
  return e
    ? l`
    <label
      class="sw-revision-session-toggle"
      title=${C(`skillWorkshop.header.selfLearningTooltip`)}
    >
      <input
        type="checkbox"
        aria-label=${C(`skillWorkshop.header.selfLearningAria`)}
        .checked=${e.enabled}
        ?disabled=${e.busy}
        @change=${(e) => t(e.currentTarget.checked)}
      />
      <span class="sw-revision-session-toggle__track" aria-hidden="true"></span>
      <span class="sw-revision-session-toggle__label"
        >${C(`skillWorkshop.header.selfLearning`)}</span
      >
    </label>
  `
    : p;
}
function Ie(e, t) {
  return !e || e.enabled
    ? p
    : l`
    <div class="sw-empty-state__selflearn">
      <h3>${C(`skillWorkshop.selfLearning.pitchTitle`)}</h3>
      <p>${C(`skillWorkshop.selfLearning.pitchBody`)}</p>
      <button
        type="button"
        class="sw-btn sw-btn--primary ${e.busy ? `is-busy` : ``}"
        ?disabled=${e.busy}
        @click=${() => t(!0)}
      >
        ${e.busy ? C(`skillWorkshop.selfLearning.enabling`) : C(`skillWorkshop.selfLearning.enable`)}
      </button>
    </div>
  `;
}
function Le(e) {
  return e?.error ? l`<div class="sw-error" role="status"><span>${e.error}</span></div>` : p;
}
var M,
  N = e(() => {
    (ee(), d(), w(), ne(), (M = `config changed since last load`));
  });
function Re() {
  try {
    return b()?.getItem(P) === `board` ? `board` : `today`;
  } catch {
    return `today`;
  }
}
function ze(e) {
  try {
    b()?.setItem(P, e);
  } catch {}
}
function Be() {
  try {
    return b()?.getItem(F) === `true`;
  } catch {
    return !1;
  }
}
function Ve(e) {
  try {
    b()?.setItem(F, String(e));
  } catch {}
}
var P,
  F,
  I = e(() => {
    (ie(),
      (P = `openclaw:control-ui:skill-workshop-mode:v1`),
      (F = `openclaw:control-ui:skill-workshop-current-chat-revisions:v1`));
  });
function He(e, t, n) {
  e.skillWorkshopUseCurrentChatForRevisions !== t &&
    ((e.skillWorkshopUseCurrentChatForRevisions = t), Ve(t), n());
}
function L(e, t, n) {
  e.skillWorkshopMode !== t && ((e.skillWorkshopMode = t), ze(t), n());
}
function Ue(e, { selfLearning: t, onSelfLearningToggle: n }, r) {
  let i = C(`skillWorkshop.header.useCurrentChat`);
  return l`
    <div class="sw-header-controls">
      ${Fe(t, n)}
      <label
        class="sw-revision-session-toggle"
        title=${C(`skillWorkshop.header.useCurrentChatTooltip`)}
      >
        <input
          type="checkbox"
          aria-label=${C(`skillWorkshop.header.useCurrentChatAria`)}
          .checked=${e.skillWorkshopUseCurrentChatForRevisions}
          @change=${(t) => He(e, t.currentTarget.checked, r)}
        />
        <span class="sw-revision-session-toggle__track" aria-hidden="true"></span>
        <span class="sw-revision-session-toggle__label">${i}</span>
      </label>
      <wa-tab-group
        class="sw-mode-switch"
        aria-label=${C(`skillWorkshop.header.view`)}
        data-mode=${e.skillWorkshopMode}
        .active=${e.skillWorkshopMode}
        activation="auto"
        without-scroll-controls
        @wa-tab-show=${(t) => {
          (t.detail.name === `board` || t.detail.name === `today`) && L(e, t.detail.name, r);
        }}
      >
        <wa-tab
          id="skill-workshop-mode-tab-board"
          class="sw-mode-switch__opt"
          panel="board"
          aria-controls="skill-workshop-mode-panel"
        >
          <svg viewBox="0 0 24 24" class="sw-mode-switch__icon" aria-hidden="true">
            <rect x="3" y="4" width="7" height="16" rx="1.5" />
            <rect x="14" y="4" width="7" height="9" rx="1.5" />
            <rect x="14" y="15" width="7" height="5" rx="1.5" />
          </svg>
          <span>${C(`skillWorkshop.header.board`)}</span>
        </wa-tab>
        <wa-tab
          id="skill-workshop-mode-tab-today"
          class="sw-mode-switch__opt"
          panel="today"
          aria-controls="skill-workshop-mode-panel"
        >
          <svg viewBox="0 0 24 24" class="sw-mode-switch__icon" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"
            />
          </svg>
          <span>${C(`skillWorkshop.header.today`)}</span>
        </wa-tab>
      </wa-tab-group>
    </div>
  `;
}
var We = e(() => {
  (d(), ve(), w(), N(), I());
});
function Ge(e, t) {
  if (t !== `workshop`) {
    if (t === `skills`) {
      e.navigate(`skills`);
      return;
    }
    e.navigate(`plugins`, t === `discover` ? { search: `?tab=discover` } : void 0);
  }
}
var Ke = e(() => {});
function qe(e) {
  let { state: t, context: n } = e;
  return t && n
    ? {
        state: t,
        context: n,
        epoch: e.epoch,
        gateway: n.gateway,
        agentSelection: n.agentSelection,
        sessions: n.sessions,
        revision: n.skillWorkshopRevision,
        navigate: n.navigate,
      }
    : null;
}
function Je(e, t) {
  let n = t.context;
  return (
    t.state === e.state &&
    n === e.context &&
    t.epoch === e.epoch &&
    n?.gateway === e.gateway &&
    n.agentSelection === e.agentSelection &&
    n.sessions === e.sessions &&
    n.skillWorkshopRevision === e.revision &&
    n.navigate === e.navigate
  );
}
var Ye = e(() => {});
function Xe(e) {
  let t = e.split(`
`),
    n = [];
  for (let e = 0; e < t.length; e += z)
    n.push(
      t.slice(e, e + z).join(`
`),
    );
  return n;
}
function Ze(e) {
  let t = e.split(`.`).pop()?.toLowerCase() ?? ``;
  return (
    {
      md: `Markdown`,
      txt: `Text`,
      json: `JSON`,
      yaml: `YAML`,
      yml: `YAML`,
      ts: `TypeScript`,
      js: `JavaScript`,
      py: `Python`,
      sh: `Shell`,
    }[t] ?? (t ? t.toUpperCase() : `File`)
  );
}
function Qe(e) {
  let t = e.split(`.`).pop()?.toLowerCase() ?? ``;
  return B.has(t) ? E.fileCode : E.fileText;
}
var R,
  z,
  B,
  $e = e(() => {
    (d(),
      a(),
      w(),
      S(),
      _e(),
      he(),
      D(),
      t(),
      (R = class extends ue {
        constructor(...e) {
          (super(...e),
            (this.files = []),
            (this.activePath = ``),
            (this.query = ``),
            (this.label = ``),
            (this.listLabel = ``),
            (this.searchPlaceholder = ``),
            (this.contextLabel = ``),
            (this.readOnlyLabel = ``),
            (this.emptyTitle = ``),
            (this.emptySubtitle = ``),
            (this.copyLabel = ``),
            (this.filteredFiles = []),
            (this.derivedInputsReady = !1),
            (this.codeChunks = []),
            (this.resetScrollAfterUpdate = !0),
            (this.focusAfterUpdate = !1),
            (this.handleQueryInput = (e) => {
              let t = e.target.value ?? ``;
              this.dispatchEvent(
                new CustomEvent(`file-preview-query-change`, {
                  bubbles: !0,
                  composed: !0,
                  detail: t,
                }),
              );
            }),
            (this.preventItemPointerFocus = (e) => {
              e.preventDefault();
            }),
            (this.handleKeydown = (e) => {
              switch (e.key) {
                case `Escape`:
                  (e.preventDefault(), e.stopPropagation(), this.emitClose());
                  return;
                case `ArrowDown`:
                  this.moveSelection(1, e);
                  return;
                case `ArrowUp`:
                  this.moveSelection(-1, e);
                default:
              }
            }),
            (this.emitClose = () => {
              this.dispatchEvent(
                new CustomEvent(`file-preview-close`, { bubbles: !0, composed: !0 }),
              );
            }));
        }
        static {
          this.styles = m`
    :host {
      display: contents;
    }

    .modal {
      width: 100%;
      height: min(780px, 86vh);
      background: var(--bg);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-lg);
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .head {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      background: var(--bg);
    }

    .search-icon {
      color: var(--muted);
      font-size: 18px;
    }

    .search {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-strong);
      font: inherit;
      font-size: 18px;
      font-weight: 400;
      padding: 4px 0;
    }

    .search:focus,
    .search:focus-visible {
      outline: none;
      border: none;
      box-shadow: none;
    }

    .search::placeholder {
      color: var(--muted);
    }

    .state {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--muted);
      padding: 5px 10px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
    }

    .kbd {
      font-family: var(--mono);
      border: 1px solid var(--border);
      color: var(--muted);
    }

    .body {
      flex: 1;
      display: grid;
      grid-template-columns: 360px 1fr;
      min-height: 0;
    }

    .list {
      border-right: 1px solid var(--border);
      padding: 14px 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .list-section {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      padding: 4px 12px 8px;
    }

    .item {
      display: grid;
      grid-template-columns: 16px 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--text);
      font: inherit;
      outline: none;
      text-align: left;
    }

    .item:focus-visible {
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 55%, transparent);
    }

    .item:hover {
      background: var(--bg-elevated);
    }

    .item.is-active {
      background: var(--accent-subtle);
    }

    .item.is-active .item-name {
      color: var(--text-strong);
    }

    .item-icon {
      width: 16px;
      height: 16px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      opacity: 0.85;
    }

    .item.is-active .item-icon {
      color: var(--accent);
      opacity: 1;
    }

    .item-icon svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .item-name {
      font-family: var(--mono);
      font-size: 14px;
      color: var(--text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-meta {
      color: var(--muted);
      font-size: 12px;
    }

    .empty-list {
      color: var(--muted);
      font-size: 13px;
      padding: 12px;
    }

    .detail {
      display: flex;
      flex-direction: column;
      min-width: 0;
      min-height: 0;
    }

    .detail.empty {
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
    }

    .detail-head {
      padding: 20px 24px 14px;
      border-bottom: 1px solid var(--border);
    }

    .detail-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .title {
      flex: 1;
      min-width: 0;
      margin: 0;
      font-family: var(--mono);
      font-size: 22px;
      color: var(--text-strong);
      font-weight: 700;
      letter-spacing: -0.01em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chat-copy-btn {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--bg-elevated);
      color: var(--muted);
    }

    .chat-copy-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-strong);
    }

    .chat-copy-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .chat-copy-btn__icon {
      display: inline-flex;
      width: 16px;
      height: 16px;
      position: relative;
    }

    .chat-copy-btn__icon-copy,
    .chat-copy-btn__icon-check {
      position: absolute;
      inset: 0;
      transition: opacity 150ms ease;
    }

    .chat-copy-btn__icon-check {
      opacity: 0;
    }

    .chat-copy-btn[data-copied="1"] .chat-copy-btn__icon-copy {
      opacity: 0;
    }

    .chat-copy-btn[data-copied="1"] .chat-copy-btn__icon-check {
      opacity: 1;
    }

    .chat-copy-btn[data-copying="1"] {
      opacity: 0;
      pointer-events: none;
    }

    .chat-copy-btn[data-error="1"] {
      border-color: var(--danger-subtle);
      background: var(--danger-subtle);
      color: var(--danger);
    }

    .chat-copy-btn[data-copied="1"] {
      border-color: var(--ok-subtle);
      background: var(--ok-subtle);
      color: var(--ok);
    }

    .chat-copy-btn svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
      fill: none;
      stroke-width: 1.5px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 11.5px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      color: var(--muted);
    }

    .chip.accent {
      background: var(--accent-subtle);
      border-color: color-mix(in srgb, var(--accent) 30%, transparent);
      color: var(--accent);
    }

    .chip.ok {
      background: color-mix(in srgb, var(--ok) 12%, transparent);
      border-color: color-mix(in srgb, var(--ok) 30%, transparent);
      color: var(--ok);
    }

    .detail-body {
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px 24px 24px;
    }

    .code-content {
      min-width: 0;
    }

    .code-chunk {
      margin: 0;
      min-width: 0;
      font-family: var(--mono);
      font-size: 13px;
      line-height: 1.7;
      color: var(--text);
      white-space: pre-wrap;
      word-break: break-word;
      content-visibility: auto;
      contain-intrinsic-block-size: auto 1414px;
    }

    .foot {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 12px 20px;
      border-top: 1px solid var(--border);
      background: var(--bg);
      font-size: 12px;
      color: var(--muted);
    }

    .foot-group {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .kbd {
      font-size: 10.5px;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--bg-elevated);
      color: var(--text);
    }

    .spacer {
      flex: 1;
    }

    .button {
      height: 36px;
      padding: 0 14px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: var(--bg-elevated);
      color: var(--text);
      font-weight: 600;
    }

    .button:hover {
      border-color: var(--border-strong);
      color: var(--text-strong);
    }

    .empty-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-strong);
      margin: 0 0 8px;
    }

    .empty-subtitle {
      margin: 0;
      font-size: 13px;
      color: var(--muted);
      max-width: 380px;
    }
  `;
        }
        willUpdate(e) {
          if (
            !(!this.derivedInputsReady || e.has(`activePath`) || e.has(`query`) || e.has(`files`))
          )
            return;
          ((this.derivedInputsReady = !0), (this.filteredFiles = this.filterFiles()));
          let t = this.resolveActiveFile(this.filteredFiles);
          this.activeFile = t;
          let n = t?.contents;
          (n !== this.codeSource &&
            ((this.codeSource = n), (this.codeChunks = n === void 0 ? [] : Xe(n))),
            (this.resetScrollAfterUpdate = !0));
        }
        render() {
          let e = this.filteredFiles,
            t = this.activeFile,
            n =
              e.length === this.files.length
                ? C(`filePreview.fileCount`, { count: String(this.files.length) })
                : C(`filePreview.filteredFileCount`, {
                    count: String(e.length),
                    total: String(this.files.length),
                  }),
            r = this.label || C(`filePreview.label`),
            i = this.listLabel || C(`filePreview.listLabel`),
            a = this.searchPlaceholder || C(`filePreview.searchPlaceholder`);
          return l`
      <openclaw-modal-dialog
        label=${r}
        style="--openclaw-modal-width: min(1100px, 92vw); --openclaw-modal-max-height: 86vh;"
        @modal-cancel=${this.emitClose}
        @keydown=${this.handleKeydown}
      >
        <div class="modal">
          <header class="head">
            <span class="search-icon">⌕</span>
            <input
              class="search"
              placeholder=${a}
              .value=${this.query}
              @input=${this.handleQueryInput}
            />
            <span class="state">${n}</span>
          </header>
          <div class="body">
            <aside class="list">
              <div class="list-section">${i} · ${e.length}</div>
              ${
                e.length === 0
                  ? l`<div class="empty-list">${C(`filePreview.noMatches`)}</div>`
                  : e.map(
                      (e) => l`
                      <button
                        class="item ${e.path === t?.path ? `is-active` : ``}"
                        @pointerdown=${this.preventItemPointerFocus}
                        @mousedown=${this.preventItemPointerFocus}
                        @click=${() => this.emitSelect(e.path)}
                      >
                        <span class="item-icon">${Qe(e.path)}</span>
                        <span class="item-name">${e.path}</span>
                        <span class="item-meta">${e.size}</span>
                      </button>
                    `,
                    )
              }
            </aside>
            ${t ? this.renderFile(t) : this.renderEmpty()}
          </div>
          <footer class="foot">
            <span class="foot-group"><span class="kbd">↑↓</span> ${C(`filePreview.navigate`)}</span>
            <span class="spacer"></span>
            <button class="button" @click=${this.emitClose}>
              ${C(`common.close`)} <span class="kbd">esc</span>
            </button>
          </footer>
        </div>
      </openclaw-modal-dialog>
    `;
        }
        renderFile(e) {
          return l`
      <section class="detail">
        <div class="detail-head">
          <div class="detail-title-row">
            <h2 class="title">${e.path}</h2>
            ${e.contents ? ge(e.contents, this.copyLabel || C(`filePreview.copyFile`)) : ``}
          </div>
          <div class="chips">
            <span class="chip accent">${Ze(e.path)}</span>
            <span class="chip">${e.size}</span>
            <span class="chip">${this.readOnlyLabel || C(`filePreview.readOnly`)}</span>
            ${this.contextLabel ? l`<span class="chip ok">${this.contextLabel}</span>` : ``}
          </div>
        </div>
        <div class="detail-body">
          <div class="code-content">
            ${this.codeChunks.map((e, t) => l`<pre class="code-chunk" data-chunk=${t}>${e}</pre>`)}
          </div>
        </div>
      </section>
    `;
        }
        renderEmpty() {
          return l`
      <section class="detail empty">
        <p class="empty-title">${this.emptyTitle || C(`filePreview.emptyTitle`)}</p>
        <p class="empty-subtitle">${this.emptySubtitle || C(`filePreview.emptySubtitle`)}</p>
      </section>
    `;
        }
        filterFiles() {
          let e = this.query.trim().toLowerCase();
          return e
            ? this.files.filter((t) => `${t.path}\n${t.contents}`.toLowerCase().includes(e))
            : this.files;
        }
        resolveActiveFile(e) {
          return e.find((e) => e.path === this.activePath) ?? e[0];
        }
        connectedCallback() {
          (super.connectedCallback(),
            (this.resetScrollAfterUpdate = !0),
            (this.focusAfterUpdate = !0),
            this.requestUpdate());
        }
        updated(e) {
          if (this.resetScrollAfterUpdate) {
            this.resetScrollAfterUpdate = !1;
            let e = this.detailBody;
            e && ((e.scrollTop = 0), (e.scrollLeft = 0));
          }
          ((e.has(`activePath`) || e.has(`query`) || e.has(`files`)) &&
            this.scrollActiveFileIntoView(),
            this.focusAfterUpdate &&
              this.isConnected &&
              ((this.focusAfterUpdate = !1), this.focusModal()));
        }
        focusModal() {
          (this.searchInput ?? this.shadowRoot?.querySelector(`.modal`))?.focus({
            preventScroll: !0,
          });
        }
        moveSelection(e, t) {
          (t.preventDefault(), t.stopPropagation());
          let n = this.filterFiles();
          if (n.length === 0) return;
          let r = this.resolveActiveFile(n),
            i = r ? n.findIndex((e) => e.path === r.path) : -1,
            a = n[Math.max(0, Math.min(n.length - 1, i + e))];
          a && a.path !== r?.path && this.emitSelect(a.path);
        }
        scrollActiveFileIntoView() {
          this.updateComplete
            .then(() => {
              this.isConnected &&
                this.shadowRoot
                  ?.querySelector(`.item.is-active`)
                  ?.scrollIntoView({ block: `nearest` });
            })
            .catch(() => {});
        }
        emitSelect(e) {
          (this.dispatchEvent(
            new CustomEvent(`file-preview-select`, { bubbles: !0, composed: !0, detail: e }),
          ),
            this.focusModal());
        }
      }),
      n([c({ attribute: !1 })], R.prototype, `files`, void 0),
      n([c()], R.prototype, `activePath`, void 0),
      n([c()], R.prototype, `query`, void 0),
      n([c()], R.prototype, `label`, void 0),
      n([c()], R.prototype, `listLabel`, void 0),
      n([c()], R.prototype, `searchPlaceholder`, void 0),
      n([c()], R.prototype, `contextLabel`, void 0),
      n([c()], R.prototype, `readOnlyLabel`, void 0),
      n([c()], R.prototype, `emptyTitle`, void 0),
      n([c()], R.prototype, `emptySubtitle`, void 0),
      n([c()], R.prototype, `copyLabel`, void 0),
      n([o(`.search`)], R.prototype, `searchInput`, void 0),
      n([o(`.detail-body`)], R.prototype, `detailBody`, void 0),
      (z = 64),
      (B = new Set(
        `ts.tsx.js.jsx.mjs.cjs.py.sh.bash.zsh.rb.go.rs.java.kt.swift.c.cc.cpp.h.hpp.json.yaml.yml.toml.xml.html.css.scss.sql`.split(
          `.`,
        ),
      )));
  }),
  et = e(() => {
    ($e(),
      customElements.get(`openclaw-file-preview-modal`) ||
        customElements.define(`openclaw-file-preview-modal`, R));
  }),
  tt = e(() => {});
function nt(e, t) {
  let n = rt(e, t);
  return l`
    <div class="sw-detail sw-detail--empty">
      <div class="sw-filter-empty">
        <div class="sw-filter-empty__icon" aria-hidden="true">
          ${it(n.icon)}
        </div>
        <p class="sw-empty__title">${n.title}</p>
        <p class="sw-empty__sub">${n.body}</p>
      </div>
    </div>
  `;
}
function rt(e, t) {
  if (e.trim())
    return {
      icon: `search`,
      title: C(`skillWorkshop.empty.searchTitle`),
      body: C(`skillWorkshop.empty.searchBody`),
    };
  switch (t) {
    case `pending`:
      return {
        icon: `clock`,
        title: C(`skillWorkshop.empty.pendingTitle`),
        body: C(`skillWorkshop.empty.pendingBody`),
      };
    case `applied`:
      return {
        icon: `check`,
        title: C(`skillWorkshop.empty.appliedTitle`),
        body: C(`skillWorkshop.empty.appliedBody`),
      };
    case `rejected`:
      return {
        icon: `x`,
        title: C(`skillWorkshop.empty.rejectedTitle`),
        body: C(`skillWorkshop.empty.rejectedBody`),
      };
    case `quarantined`:
      return {
        icon: `shield`,
        title: C(`skillWorkshop.empty.quarantinedTitle`),
        body: C(`skillWorkshop.empty.quarantinedBody`),
      };
    case `stale`:
      return {
        icon: `refresh`,
        title: C(`skillWorkshop.empty.staleTitle`),
        body: C(`skillWorkshop.empty.staleBody`),
      };
    case `all`:
      return {
        icon: `search`,
        title: C(`skillWorkshop.empty.allTitle`),
        body: C(`skillWorkshop.empty.allBody`),
      };
  }
  return {
    icon: `search`,
    title: C(`skillWorkshop.empty.allTitle`),
    body: C(`skillWorkshop.empty.allBody`),
  };
}
function it(e) {
  switch (e) {
    case `clock`:
      return l`
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="8"></circle>
          <path d="M12 7v5l3 2"></path>
        </svg>
      `;
    case `check`:
      return l`
        <svg viewBox="0 0 24 24">
          <path d="M5 12.5l4 4L19 7"></path>
        </svg>
      `;
    case `x`:
      return l`
        <svg viewBox="0 0 24 24">
          <path d="M7 7l10 10"></path>
          <path d="M17 7L7 17"></path>
        </svg>
      `;
    case `shield`:
      return l`
        <svg viewBox="0 0 24 24">
          <path d="M12 3l7 3v5c0 4.2-2.8 7.8-7 10-4.2-2.2-7-5.8-7-10V6l7-3z"></path>
          <path d="M9 12l2 2 4-5"></path>
        </svg>
      `;
    case `refresh`:
      return l`
        <svg viewBox="0 0 24 24">
          <path d="M17 2v5h-5"></path>
          <path d="M7 22v-5h5"></path>
          <path d="M19 10a7 7 0 0 0-12-4l-2 2"></path>
          <path d="M5 14a7 7 0 0 0 12 4l2-2"></path>
        </svg>
      `;
    case `search`:
      return l`
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="6"></circle>
          <path d="M16 16l4 4"></path>
        </svg>
      `;
  }
  return p;
}
function at(e) {
  return l`
    <div class="sw-empty-state">
      <section class="sw-empty-state__panel" aria-label=${C(`skillWorkshop.empty.noProposalsAria`)}>
        <div class="sw-empty-state__glyph" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p class="sw-empty-state__eyebrow">${C(`skillWorkshop.title`)}</p>
        <h2>${C(`skillWorkshop.empty.noProposalsTitle`)}</h2>
        <p>${C(`skillWorkshop.empty.noProposalsBody`, { agent: e.agentName })}</p>
        <div class="sw-empty-state__footer">${C(`skillWorkshop.empty.noProposalsFooter`)}</div>
        ${Ie(e.selfLearning, e.onSelfLearningToggle)}
      </section>
    </div>
  `;
}
var ot = e(() => {
  (d(), w(), N());
});
function st(e) {
  let t = A(e.proposals, e.statusFilter, e.query),
    n = t.find((t) => t.key === e.selectedKey) ?? t[0],
    r = Et(t),
    i = n && e.filePreviewKey ? n.supportFiles.find((t) => t.path === e.filePreviewKey) : null,
    a = e.revisionKey ? e.proposals.find((t) => t.key === e.revisionKey) : null,
    o = e.proposals.filter((e) => e.status === `pending`),
    s = n ?? o[0] ?? e.proposals[0],
    c =
      e.proposals.length === 0 && !e.loading && !e.error
        ? at({
            agentName: H(e, C(`skillWorkshop.empty.defaultAgent`)),
            selfLearning: e.selfLearning,
            onSelfLearningToggle: e.onSelfLearningToggle,
          })
        : e.mode === `today`
          ? vt(e, s, o)
          : lt(e, r, n);
  return l`
    <section class="skill-workshop sw-mode-${e.mode}">
      ${
        e.error
          ? l`<div class="sw-error" role="status">
            <span>${e.error}</span>
            <button type="button" class="btn btn--sm" @click=${e.onRetry}>
              ${C(`pluginsPage.tryAgain`)}
            </button>
          </div>`
          : p
      }
      ${Le(e.selfLearning)}
      ${ke({ state: e.historyScan, onScan: e.onHistoryScan })}
      <div class="sw-view" data-mode=${e.mode}>
        ${h(e.mode, l`<div class="sw-view__pane">${c}</div>`)}
      </div>
    </section>
    ${
      i && n
        ? l`
          <openclaw-file-preview-modal
            .files=${n.supportFiles}
            .activePath=${i.path}
            .query=${e.filePreviewQuery}
            .contextLabel=${C(`skillWorkshop.previewContext`, { slug: n.slug })}
            @file-preview-query-change=${(t) => e.onFilePreviewQueryChange(t.detail)}
            @file-preview-select=${(t) => e.onPreviewFile(n.key, t.detail)}
            @file-preview-close=${e.onClosePreview}
          ></openclaw-file-preview-modal>
        `
        : p
    }
    ${a ? ct(e, a) : p}
  `;
}
function ct(e, t) {
  let n = e.actionBusy?.key === t.key && e.actionBusy.action === `revise`,
    r = e.revisionDraft.trim().length > 0 && !e.actionBusy,
    i = e.mode === `board` ? C(`skillWorkshop.actions.revise`) : C(`skillWorkshop.actions.tweak`);
  return l`
    <openclaw-modal-dialog
      .label=${`${C(`skillWorkshop.revision.title`, { verb: i })}: ${t.slug}`}
      .description=${C(`skillWorkshop.revision.description`)}
      style="--openclaw-modal-width: 560px"
      @modal-cancel=${e.onRevisionCancel}
    >
      <section class="sw-revision-dialog ${n ? `sw-revision-dialog--sending` : ``}">
        <div class="sw-revision-dialog__head">
          <div>
            <div class="sw-revision-dialog__eyebrow">
              ${C(`skillWorkshop.revision.title`, { verb: i })}
            </div>
            <h2 id="sw-revision-title">${t.slug}</h2>
          </div>
          <openclaw-tooltip content=${C(`skillWorkshop.actions.close`)}>
            <button
              type="button"
              class="sw-revision-dialog__close"
              aria-label=${C(`skillWorkshop.actions.close`)}
              ?disabled=${!!e.actionBusy}
              @click=${e.onRevisionCancel}
            >
              ×
            </button>
          </openclaw-tooltip>
        </div>
        <p class="sw-revision-dialog__copy">${C(`skillWorkshop.revision.description`)}</p>
        <textarea
          class="sw-revision-dialog__input"
          autofocus
          placeholder=${C(`skillWorkshop.revision.placeholder`)}
          .value=${e.revisionDraft}
          ?disabled=${!!e.actionBusy}
          @input=${(t) => e.onRevisionDraftChange(t.target.value ?? ``)}
        ></textarea>
        ${
          n
            ? l`
              <div class="sw-revision-dialog__status" role="status">
                <span class="sw-revision-dialog__status-dot" aria-hidden="true"></span>
                <span>${C(`skillWorkshop.revision.preparing`)}</span>
              </div>
            `
            : p
        }
        <div class="sw-revision-dialog__actions">
          <button
            type="button"
            class="sw-btn sw-btn--ghost"
            ?disabled=${!!e.actionBusy}
            @click=${e.onRevisionCancel}
          >
            ${C(`skillWorkshop.actions.cancel`)}
          </button>
          <button
            type="button"
            class="sw-btn sw-btn--primary ${n ? `is-busy` : ``}"
            ?disabled=${!r}
            @click=${() => e.onRevisionSubmit(t.key)}
          >
            ${C(n ? `skillWorkshop.actions.sending` : `skillWorkshop.revision.send`)}
          </button>
        </div>
      </section>
    </openclaw-modal-dialog>
  `;
}
function lt(e, t, n) {
  return l`
    ${pt(e)}
    <div class="sw-triage" style=${u({ "--sw-queue-width": `${e.queueWidth}px` })}>
      ${mt(e, t, n)} ${ut(e)}
      ${n ? gt(e, n) : nt(e.query, e.statusFilter)}
    </div>
  `;
}
function ut(e) {
  return l`
    <div
      class="sw-queue-resizer"
      role="separator"
      aria-label=${C(`skillWorkshop.queue.resize`)}
      aria-orientation="vertical"
      tabindex="0"
      @pointerdown=${(t) => dt(t, e)}
      @keydown=${(t) => ft(t, e)}
    ></div>
  `;
}
function dt(e, t) {
  (e.preventDefault(), e.stopPropagation());
  let n = e.clientX,
    r = t.queueWidth,
    i = document.body,
    a = i.style.cursor,
    o = i.style.userSelect;
  ((i.style.cursor = `col-resize`), (i.style.userSelect = `none`));
  let s = () => {
      (window.removeEventListener(`pointermove`, c),
        window.removeEventListener(`pointerup`, l),
        window.removeEventListener(`pointercancel`, l),
        (i.style.cursor = a),
        (i.style.userSelect = o));
    },
    c = (e) => {
      t.onQueueWidthChange(r + e.clientX - n);
    },
    l = () => {
      s();
    };
  (window.addEventListener(`pointermove`, c),
    window.addEventListener(`pointerup`, l),
    window.addEventListener(`pointercancel`, l));
}
function ft(e, t) {
  if (e.key !== `ArrowLeft` && e.key !== `ArrowRight`) return;
  e.preventDefault();
  let n = e.key === `ArrowLeft` ? -24 : 24;
  t.onQueueWidthChange(t.queueWidth + n);
}
function pt(e) {
  return l`
    <div class="sw-lifecycle-tabs">
      ${J.map((t) => {
        let n = e.statusFilter === t,
          r = e.counts[t] ?? 0;
        return l`
          <button
            class="sw-lifecycle-tab ${n ? `is-active` : ``}"
            @click=${() => e.onStatusFilterChange(t)}
          >
            ${C(Y[t])} <span class="settings-count">${r}</span>
          </button>
        `;
      })}
    </div>
  `;
}
function mt(e, t, n) {
  let r = t.reduce((e, t) => e + t.items.length, 0);
  return l`
    <aside class="sw-queue">
      <div class="sw-queue__search">
        <input
          placeholder=${C(`skillWorkshop.queue.search`)}
          .value=${e.query}
          @input=${(t) => e.onQueryChange(t.target.value ?? ``)}
        />
      </div>
      <div class="sw-queue__body">
        ${
          r === 0
            ? l`<div class="sw-queue__empty">${Dt(e)}</div>`
            : t.map(
                (t) => l`
                <div class="sw-queue__group">
                  ${C(t.label)}
                  <span class="settings-count">${t.items.length}</span>
                </div>
                ${t.items.map((t) => ht(e, t, n))}
              `,
              )
        }
      </div>
    </aside>
  `;
}
function ht(e, t, n) {
  let r = n?.key === t.key;
  return l`
    <button
      class="sw-row ${t.isNew ? `is-new` : `is-seen`} ${r ? `is-selected` : ``}"
      @click=${() => e.onSelect(t.key)}
    >
      <span class="sw-row__dot"></span>
      <span>
        <span class="sw-row__title">${t.name}</span>
        <span class="sw-row__desc">${t.oneLine}</span>
      </span>
      <span class="sw-row__meta">${t.ageLabel}</span>
    </button>
  `;
}
function gt(e, t) {
  let n = t.updatedAt && t.updatedAt > t.createdAt ? t.updatedAt : null,
    r = n
      ? C(`skillWorkshop.detail.edited`, { time: q(n) })
      : C(`skillWorkshop.detail.created`, { time: q(t.createdAt) }),
    i = e.inspectingKey === t.key && !t.body,
    a = t.supportFiles[0];
  return l`
    <div class="sw-detail">
      <div class="sw-detail__head">
        <div class="sw-detail__head-left">
          <h1 class="sw-detail__title">${t.name}</h1>
          <div class="sw-detail__one-line">${t.oneLine}</div>
          <div class="sw-detail__meta">
            <span>${r}</span>
            <span>·</span>
            <span>v${t.version}</span>
            <span>·</span>
            ${
              a
                ? l`<button
                  class="sw-detail__meta-link"
                  @click=${() => e.onPreviewFile(t.key, a.path)}
                >
                  ${C(`skillWorkshop.detail.supportFiles`, { count: String(t.supportFiles.length) })}
                </button>`
                : l`<span>${C(`skillWorkshop.detail.noSupportFiles`)}</span>`
            }
          </div>
        </div>
        <div class="sw-detail__nav">
          <openclaw-tooltip content=${C(`skillWorkshop.actions.previous`)}>
            <button aria-label=${C(`skillWorkshop.actions.previous`)} @click=${e.onPrev}>
              ↑
            </button>
          </openclaw-tooltip>
          <openclaw-tooltip content=${C(`skillWorkshop.actions.next`)}>
            <button aria-label=${C(`skillWorkshop.actions.next`)} @click=${e.onNext}>↓</button>
          </openclaw-tooltip>
        </div>
      </div>

      <div class="sw-detail__body">
        <div class="sw-body-card">
          <h1>${t.slug}</h1>
          ${i ? l`<p class="sw-muted">${C(`skillWorkshop.detail.loading`)}</p>` : Tt(t.body)}
        </div>

        ${
          t.supportFiles.length > 0
            ? l`
              <div class="sw-section" style="margin-top: 18px;">
                <h3 class="sw-section__label">${C(`skillWorkshop.detail.supportFilesTitle`)}</h3>
                <div class="sw-files">
                  ${t.supportFiles.map(
                    (n) => l`
                      <button
                        class="sw-file"
                        @click=${() => e.onPreviewFile(t.key, n.path)}
                      >
                        <span>📄</span>
                        <span class="sw-file__name">${n.path}</span>
                        <span class="sw-file__size"
                          >${n.size}
                          <span class="sw-file__hint"
                            >${C(`skillWorkshop.detail.clickToPreview`)}</span
                          ></span
                        >
                      </button>
                    `,
                  )}
                </div>
              </div>
            `
            : p
        }
      </div>

      ${e.actionNotice?.key === t.key ? V(e.actionNotice) : p}
      ${t.status === `pending` ? _t(e, t) : p}
    </div>
  `;
}
function V(e) {
  return l`
    <div class="sw-action-toast" role="status" aria-live="polite">
      <span>${e.label}</span>
      <strong>${e.slug}</strong>
      <span>·</span>
    </div>
  `;
}
function _t(e, t) {
  let n = e.actionBusy?.key === t.key ? e.actionBusy.action : null,
    r = !!e.actionBusy;
  return l`
    <div class="sw-action-bar" aria-busy=${n ? `true` : `false`}>
      <button
        class="sw-btn sw-btn--primary ${n === `apply` ? `is-busy` : ``}"
        ?disabled=${r}
        @click=${() => e.onApply(t.key)}
      >
        ${C(n === `apply` ? `skillWorkshop.actions.applying` : `skillWorkshop.actions.apply`)}
      </button>
      <button
        class="sw-btn ${n === `revise` ? `is-busy` : ``}"
        ?disabled=${r}
        @click=${() => e.onRevise(t.key)}
      >
        ${C(n === `revise` ? `skillWorkshop.actions.opening` : `skillWorkshop.actions.revise`)}
      </button>
      <button
        class="sw-btn sw-btn--ghost sw-btn--danger ${n === `reject` ? `is-busy` : ``}"
        ?disabled=${r}
        @click=${() => e.onReject(t.key)}
      >
        ${C(n === `reject` ? `skillWorkshop.actions.rejecting` : `skillWorkshop.actions.reject`)}
      </button>
    </div>
  `;
}
function H(e, t) {
  return e.workshopAgentName.trim() || e.assistantName.trim() || t;
}
function vt(e, t, n) {
  if (!t)
    return l`
      <div class="sw-today sw-today--empty">
        <p class="sw-empty__title">${C(`skillWorkshop.today.emptyTitle`)}</p>
        <p class="sw-empty__sub">${C(`skillWorkshop.today.emptyBody`)}</p>
      </div>
    `;
  let r = Math.max(
      0,
      n.findIndex((e) => e.key === t.key),
    ),
    i = Math.max(n.length, 1),
    a = n.filter((e) => e.key !== t.key).slice(0, 3),
    o = e.proposals.filter((e) => e.status === `applied`).slice(0, 3),
    s = t.isNew
      ? C(`skillWorkshop.today.new`)
      : t.status === `pending`
        ? C(`skillWorkshop.today.waiting`)
        : C(`skillWorkshop.today.reviewed`),
    c = t.ageLabel,
    u = wt(Date.now()),
    d = t.status === `pending`,
    f = e.actionBusy?.key === t.key ? e.actionBusy.action : null,
    m = !!e.actionBusy,
    h = H(e, C(`skillWorkshop.today.agent`)),
    g = t.supportFiles[0];
  return l`
    <div class="sw-today">
      <div class="sw-today__head">
        <div class="sw-today__date">${u}</div>
        <h1 class="sw-today__h1">
          ${C(`skillWorkshop.today.proposalsWaiting`, { count: String(n.length) })}
        </h1>
        ${n.length === 0 ? l`<div class="sw-today__sub">${C(`skillWorkshop.today.browseApplied`)}</div>` : p}
        ${
          n.length > 0
            ? l`
              <div class="sw-today__progress">
                <span
                  >${C(`skillWorkshop.today.progress`, { current: String(r + 1), total: String(i) })}</span
                >
                <div class="sw-today__dots">
                  ${n.map(
                    (e, t) => l`
                      <span
                        class="sw-today__dot ${t < r ? `is-done` : t === r ? `is-now` : ``}"
                      ></span>
                    `,
                  )}
                </div>
              </div>
            `
            : p
        }
      </div>

      <article class="sw-today__hero">
        <div class="sw-today__label">
          <span class="sw-today__ping"></span>
          ${s} · ${c}
        </div>
        <h2 class="sw-today__name">${t.slug}</h2>
        <p class="sw-today__one-liner">${t.oneLine}</p>

        ${yt(t)}

        <div class="sw-today__author">
          <span class="sw-today__avatar">v${t.version}</span>
          <span>
            ${C(`skillWorkshop.today.draftedBy`)}
            <strong>${h}</strong> · ${c}.
            ${
              g
                ? l`
                  <button
                    class="sw-today__files-link"
                    @click=${() => e.onPreviewFile(t.key, g.path)}
                  >
                    ${C(t.supportFiles.length === 1 ? `skillWorkshop.today.supportFile` : `skillWorkshop.today.supportFiles`, { count: String(t.supportFiles.length) })}
                  </button>
                  ${C(`skillWorkshop.today.comeWithIt`)}
                `
                : p
            }
          </span>
        </div>

        ${
          d
            ? l`
              <div class="sw-today__actions" aria-busy=${f ? `true` : `false`}>
                <button
                  class="sw-today__big sw-today__big--primary ${f === `apply` ? `is-busy` : ``}"
                  ?disabled=${m}
                  @click=${() => e.onApply(t.key)}
                >
                  ${C(f === `apply` ? `skillWorkshop.actions.applying` : `skillWorkshop.today.useIt`)}
                  <span class="sw-today__big-sub">${C(`skillWorkshop.today.addToSkills`)}</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--tweak ${f === `revise` ? `is-busy` : ``}"
                  ?disabled=${m}
                  @click=${() => e.onRevise(t.key)}
                >
                  ${C(f === `revise` ? `skillWorkshop.actions.opening` : `skillWorkshop.today.tweakIt`)}
                  <span class="sw-today__big-sub">${C(`skillWorkshop.today.askAgent`)}</span>
                </button>
                <button
                  class="sw-today__big sw-today__big--skip ${f === `reject` ? `is-busy` : ``}"
                  ?disabled=${m}
                  @click=${() => e.onReject(t.key)}
                >
                  ${C(f === `reject` ? `skillWorkshop.today.skipping` : `skillWorkshop.today.skip`)}
                  <span class="sw-today__big-sub">${C(`skillWorkshop.today.notForMe`)}</span>
                </button>
              </div>
            `
            : p
        }
        ${e.actionNotice?.key === t.key ? V(e.actionNotice) : p}
      </article>

      ${
        a.length > 0
          ? l`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>
                  ${C(`skillWorkshop.today.upNext`, { count: String(n.length - 1) })}
                </h3>
                <button class="sw-today__link" @click=${() => e.onModeChange(`board`)}>
                  ${C(`skillWorkshop.today.seeAll`)}
                </button>
              </header>
              <div class="sw-today__upnext">
                ${a.map(
                  (t) => l`
                    <button class="sw-today__mini" @click=${() => e.onSelect(t.key)}>
                      <div class="sw-today__mini-name">${t.slug}</div>
                      <div class="sw-today__mini-desc">${t.oneLine}</div>
                      <div class="sw-today__mini-meta">${t.ageLabel}</div>
                    </button>
                  `,
                )}
              </div>
            </section>
          `
          : p
      }
      ${
        o.length > 0
          ? l`
            <section class="sw-today__section">
              <header class="sw-today__section-head">
                <h3>
                  ${C(`skillWorkshop.today.collection`, { count: String(e.counts.applied) })}
                </h3>
                <button
                  class="sw-today__link sw-today__link--muted"
                  @click=${() => e.onModeChange(`board`)}
                >
                  ${C(`skillWorkshop.today.manage`)}
                </button>
              </header>
              <div class="sw-today__applied">
                ${o.map(
                  (t) => l`
                    <button
                      class="sw-today__applied-row"
                      @click=${() => {
                        (e.onSelect(t.key), e.onModeChange(`board`));
                      }}
                    >
                      <span class="sw-today__check">✓</span>
                      <span class="sw-today__applied-name">
                        <strong>${t.slug}</strong> — ${t.oneLine}
                      </span>
                      <span class="sw-today__applied-when">${t.ageLabel}</span>
                    </button>
                  `,
                )}
              </div>
            </section>
          `
          : p
      }
    </div>
  `;
}
function yt(e) {
  let t = bt(e.body);
  return t
    ? l`
    <div class="sw-today__does">
      <div class="sw-today__does-h">${t.heading}</div>
      <ul>
        ${t.items.map((e) => l`<li>${e}</li>`)}
      </ul>
    </div>
  `
    : p;
}
function bt(e) {
  let t = xt(e),
    n = U(t, [`workflow`, `procedure`, `steps`, `agent workflow`, `process`]),
    r = n ? G(n.lines) : [];
  if (r.length > 0)
    return { heading: C(`skillWorkshop.today.workflowHeading`), items: r.slice(0, X) };
  let i = U(t, [`when to use`, `use when`, `applies when`, `trigger`, `triggers`]),
    a = i ? G(i.lines) : [];
  return a.length > 0
    ? { heading: C(`skillWorkshop.today.applicabilityHeading`), items: a.slice(0, X) }
    : null;
}
function xt(e) {
  let t = [],
    n = null,
    r = !1;
  for (let i of e.split(`
`)) {
    let e = i.trim();
    e.startsWith("```") && (r = !r);
    let a = (r ? null : /^(#{2,4})\s+(.+?)\s*$/.exec(e))?.[2];
    if (a) {
      ((n = { title: W(a), lines: [] }), t.push(n));
      continue;
    }
    n?.lines.push(i);
  }
  return t;
}
function U(e, t) {
  let n = new Set(t.map(W));
  return e.find((e) => n.has(e.title));
}
function W(e) {
  return e
    .replace(/[#*_`[\]().:]/g, ` `)
    .replace(/\s+/g, ` `)
    .trim()
    .toLowerCase();
}
function G(e) {
  let t = [];
  for (let n of e) {
    if (/^\s{2,}/.test(n)) continue;
    let e = n.trim(),
      r = /^(?:[-*]|\d+\.)\s+(.+)/.exec(e)?.[1];
    r && t.push(St(r));
  }
  return t.filter(Boolean);
}
function St(e) {
  return Ct(
    e
      .replace(/^\*\*[^*]+\*\*\s*/, ``)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, `$1`)
      .replace(/`([^`]+)`/g, `$1`)
      .replace(/\s+/g, ` `)
      .trim(),
    Z,
  );
}
function Ct(e, t) {
  if (e.length <= t) return e;
  let n = g(e, t - 1),
    r = n.lastIndexOf(` `);
  return `${(r > 48 ? n.slice(0, r) : n).trimEnd()}…`;
}
function wt(e) {
  let t = new Date(e);
  return `${t.toLocaleDateString(void 0, { weekday: `long` })} · ${t.toLocaleDateString(void 0, { month: `short`, day: `numeric` })}`;
}
function Tt(e) {
  let t = e.split(`
`),
    n = [],
    r = [],
    i = [],
    a = !1,
    o = [],
    s = () => {
      r.length && (n.push(l`<p>${K(r.join(` `))}</p>`), (r = []));
    },
    c = () => {
      if (i.length) {
        let e = i;
        (n.push(l`
        <ol>
          ${e.map((e) => l`<li>${K(e)}</li>`)}
        </ol>
      `),
          (i = []));
      }
    };
  for (let e of t) {
    let t = e.trimEnd();
    if (t.startsWith("```")) {
      (s(),
        c(),
        a
          ? (n.push(
              l`<pre>${o.join(`
`)}</pre>`,
            ),
            (o = []),
            (a = !1))
          : (a = !0));
      continue;
    }
    if (a) {
      o.push(e);
      continue;
    }
    if (t === ``) {
      (s(), c());
      continue;
    }
    if (t.startsWith(`## `)) {
      (s(), c(), n.push(l`<h3>${t.slice(3)}</h3>`));
      continue;
    }
    if (t.startsWith(`# `)) {
      (s(), c(), n.push(l`<h3>${t.slice(2)}</h3>`));
      continue;
    }
    let u = /^\d+\.\s+(.+)/.exec(t)?.[1];
    if (u) {
      (s(), i.push(u));
      continue;
    }
    r.push(t);
  }
  return (
    s(),
    c(),
    a &&
      o.length &&
      n.push(
        l`<pre>${o.join(`
`)}</pre>`,
      ),
    n
  );
}
function K(e) {
  let t = [],
    n = /(`[^`]+`|\*\*[^*]+\*\*)/g,
    r = 0,
    i;
  for (; (i = n.exec(e));) {
    i.index > r && t.push(e.slice(r, i.index));
    let n = i[0];
    (n.startsWith("`")
      ? t.push(l`<code>${n.slice(1, -1)}</code>`)
      : t.push(l`<strong>${n.slice(2, -2)}</strong>`),
      (r = i.index + n.length));
  }
  return (r < e.length && t.push(e.slice(r)), t);
}
function Et(e) {
  let t = new Map();
  for (let n of e) {
    let e = t.get(n.recencyGroup) ?? [];
    (e.push(n), t.set(n.recencyGroup, e));
  }
  return [`today`, `yesterday`, `earlier`]
    .filter((e) => t.has(e))
    .map((e) => ({ label: Q[e], items: t.get(e) ?? [] }));
}
function Dt(e) {
  return e.error
    ? C(`skillWorkshop.queue.loadError`)
    : e.loading
      ? C(`skillWorkshop.queue.loading`)
      : e.statusFilter === `all`
        ? C(`skillWorkshop.queue.noMatch`)
        : C(`skillWorkshop.queue.noStatus`, { status: C(Y[e.statusFilter]).toLocaleLowerCase() });
}
function q(e) {
  let t = Math.max(0, Date.now() - e),
    n = Math.floor(t / 1e3);
  if (n < 60) return C(`skillWorkshop.relative.secondsAgo`, { count: String(n) });
  let r = Math.floor(n / 60);
  if (r < 60) return C(`skillWorkshop.relative.minutesAgo`, { count: String(r) });
  let i = Math.floor(r / 60);
  if (i < 24) return C(`skillWorkshop.relative.hoursAgo`, { count: String(i) });
  let a = Math.floor(i / 24);
  return a < 7
    ? C(`skillWorkshop.relative.daysAgo`, { count: String(a) })
    : new Date(e).toLocaleDateString();
}
var J,
  Y,
  X,
  Z,
  Q,
  Ot = e(() => {
    (_(),
      d(),
      s(),
      f(),
      et(),
      D(),
      T(),
      w(),
      xe(),
      tt(),
      j(),
      ot(),
      Oe(),
      N(),
      (J = [`all`, `pending`, `applied`, `rejected`, `quarantined`, `stale`]),
      (Y = {
        all: `skillWorkshop.status.all`,
        pending: `skillWorkshop.status.pending`,
        applied: `skillWorkshop.status.applied`,
        rejected: `skillWorkshop.status.rejected`,
        quarantined: `skillWorkshop.status.quarantined`,
        stale: `skillWorkshop.status.stale`,
      }),
      (X = 3),
      (Z = 120),
      (Q = {
        today: `skillWorkshop.recency.today`,
        yesterday: `skillWorkshop.recency.yesterday`,
        earlier: `skillWorkshop.recency.earlier`,
      }));
  });
function kt(e, t) {
  let n = t?.trim();
  return n ? (e?.sessions.find((e) => e.key === n) ?? null) : null;
}
function At(e) {
  return !!(e && !e.archived && !e.hasActiveRun);
}
async function jt(e, t) {
  let n = e.sessions.state;
  return n.agentId === t && n.result?.sessions.length ? n.result : e.sessions.list({ agentId: t });
}
async function Mt(e, t, n, r) {
  let i = t.gateway.snapshot.hello;
  if (e.skillWorkshopUseCurrentChatForRevisions) return x(fe().sessionKey, i).trim() || null;
  let a = y(n.origin?.agentId ?? r),
    o = kt(await jt(t, a), n.origin?.sessionKey);
  if (At(o)) return o.key;
  let s = x(
    await t.sessions.create({ agentId: a, label: g(`Skill Workshop: ${n.slug || n.key}`, 80) }),
    i,
  ).trim();
  if (!s) throw Error(t.sessions.state.error ?? `Could not prepare a Skill Workshop session.`);
  return s;
}
function Nt(e, t, n) {
  let {
    context: r,
    workshopAgentName: i,
    onRevisionRequest: a,
    selfLearning: o,
    onSelfLearningToggle: s,
    onHistoryScan: c,
  } = t;
  return l`
    <section class=${e.skillWorkshopMode === `today` ? `content--skill-workshop content--skill-workshop-today` : `content--skill-workshop`}>
      <section class="content-header content-header--page plugins-content-header">
        <div>
          <h1 class="page-title">${C(`tabs.skillWorkshop`)}</h1>
        </div>
        <div class="page-meta">
          ${Ue(e, t, n)}
        </div>
      </section>
      <div class="plugins-hub-tabs-row">
        ${be({ active: `workshop`, onSelect: (e) => Ge(r, e) })}
      </div>
      <wa-tab-panel
        id="plugins-hub-panel"
        class="sw-hub-panel"
        name="workshop"
        active
        aria-labelledby="plugins-tab-workshop"
      >
        ${(() => {
          let t = A(e.skillWorkshopProposals, e.skillWorkshopStatusFilter, e.skillWorkshopQuery),
            u = t.findIndex((t) => t.key === e.skillWorkshopSelectedKey),
            d = (t) => {
              ((e.skillWorkshopFilePreviewKey = null), Te(e, r, t).finally(n), n());
            },
            f = (e) => {
              if (t.length === 0) return;
              let n = u < 0 ? 0 : (u + e + t.length) % t.length,
                r = t[n];
              r && d(r.key);
            },
            p = (t) => {
              if (t.length === 0 || t.some((t) => t.key === e.skillWorkshopSelectedKey)) return;
              let n = t[0];
              n && d(n.key);
            };
          return l`<wa-tab-panel
            id="skill-workshop-mode-panel"
            name=${e.skillWorkshopMode}
            active
            aria-labelledby=${`skill-workshop-mode-tab-${e.skillWorkshopMode}`}
          >
            ${st({
              loading: e.skillWorkshopLoading,
              error: e.skillWorkshopError,
              inspectingKey: e.skillWorkshopInspectingKey,
              proposals: e.skillWorkshopProposals,
              selectedKey: e.skillWorkshopSelectedKey,
              statusFilter: e.skillWorkshopStatusFilter,
              query: e.skillWorkshopQuery,
              filePreviewKey: e.skillWorkshopFilePreviewKey,
              filePreviewQuery: e.skillWorkshopFilePreviewQuery,
              queueWidth: e.skillWorkshopQueueWidth,
              mode: e.skillWorkshopMode,
              actionBusy: e.skillWorkshopActionBusy,
              actionNotice: e.skillWorkshopActionNotice,
              revisionKey: e.skillWorkshopRevisionKey,
              revisionDraft: e.skillWorkshopRevisionDraft,
              assistantName: r.config.current.assistantIdentity.name,
              workshopAgentName: i,
              selfLearning: o,
              historyScan: e.skillWorkshopHistoryScan,
              counts: Se(e.skillWorkshopProposals),
              onRetry: () => {
                (Ce(e, r, { force: !0 }).finally(n), n());
              },
              onStatusFilterChange: (t) => {
                ((e.skillWorkshopStatusFilter = t),
                  n(),
                  p(A(e.skillWorkshopProposals, t, e.skillWorkshopQuery)));
              },
              onQueryChange: (t) => {
                ((e.skillWorkshopQuery = t),
                  n(),
                  p(A(e.skillWorkshopProposals, e.skillWorkshopStatusFilter, t)));
              },
              onFilePreviewQueryChange: (t) => {
                ((e.skillWorkshopFilePreviewQuery = t), n());
              },
              onQueueWidthChange: (t) => {
                ((e.skillWorkshopQueueWidth = t), n());
              },
              onModeChange: (t) => L(e, t, n),
              onSelect: d,
              onPrev: () => f(-1),
              onNext: () => f(1),
              onApply: (t) => {
                (k(e, r, `apply`, t).finally(n), n());
              },
              onRevise: (t) => {
                ((e.skillWorkshopRevisionKey = t), (e.skillWorkshopRevisionDraft = ``), n());
              },
              onReject: (t) => {
                (k(e, r, `reject`, t).finally(n), n());
              },
              onRevisionDraftChange: (t) => {
                ((e.skillWorkshopRevisionDraft = t), n());
              },
              onRevisionCancel: () => {
                ((e.skillWorkshopRevisionKey = null), (e.skillWorkshopRevisionDraft = ``), n());
              },
              onRevisionSubmit: (t) => (a ? void we(e, r, t, a).finally(n) : void 0),
              onPreviewFile: (t, r) => {
                ((e.skillWorkshopSelectedKey = t), (e.skillWorkshopFilePreviewKey = r), n());
              },
              onClosePreview: () => {
                ((e.skillWorkshopFilePreviewKey = null),
                  (e.skillWorkshopFilePreviewQuery = ``),
                  n());
              },
              onSelfLearningToggle: s,
              onHistoryScan: c,
            })}
          </wa-tab-panel>`;
        })()}
      </wa-tab-panel>
    </section>
  `;
}
var $;
e(() => {
  (r(),
    _(),
    d(),
    a(),
    me(),
    pe(),
    ye(),
    T(),
    w(),
    le(),
    re(),
    j(),
    S(),
    se(),
    We(),
    je(),
    Ke(),
    Ee(),
    N(),
    Ye(),
    I(),
    Ot(),
    t(),
    ($ = class extends ce {
      constructor(...e) {
        (super(...e),
          (this.sourceEpoch = 0),
          (this.hasBoundContext = !1),
          (this.gatewayClient = null),
          (this.gatewayConnected = !1),
          (this.hasBoundAgentSelection = !1),
          (this.hasBoundSessions = !1),
          (this.selfLearningBusy = !1),
          (this.selfLearningError = null),
          (this.subscriptions = new oe(this)
            .effect(
              () => this.context,
              (e) => {
                let t = this.hasBoundContext && this.contextSource !== e;
                if (((this.hasBoundContext = !0), (this.contextSource = e), t)) {
                  let t = e.gateway;
                  ((this.gatewaySource = t),
                    (this.gatewayClient = t.snapshot.client),
                    (this.gatewayConnected = t.snapshot.connected),
                    (this.agentSelectionSource = e.agentSelection),
                    (this.selectedAgentId = e.agentSelection.state.selectedId),
                    (this.sessionsSource = e.sessions),
                    this.resetSourceState(),
                    this.loadProposals(!0));
                }
              },
            )
            .effect(
              () => this.context?.gateway,
              (e) => {
                let t = e.snapshot,
                  n = this.gatewaySource !== void 0 && this.gatewaySource !== e,
                  r = this.gatewaySource !== void 0 && this.gatewayClient !== t.client,
                  i = this.gatewaySource !== void 0 && this.gatewayConnected !== t.connected;
                return (
                  this.applyGatewaySnapshot(e, t, n || r || i),
                  e.subscribe((t) => {
                    if (this.gatewaySource !== e || this.context?.gateway !== e) return;
                    let n =
                      t.client !== this.gatewayClient || t.connected !== this.gatewayConnected;
                    this.applyGatewaySnapshot(e, t, n);
                  })
                );
              },
            )
            .watch(
              () => this.context?.config,
              (e, t) => e.subscribe(t),
            )
            .effect(
              () => this.context?.agentSelection,
              (e) => {
                let t = this.hasBoundAgentSelection && this.agentSelectionSource !== e;
                ((this.hasBoundAgentSelection = !0), (this.agentSelectionSource = e));
                let n = !0,
                  r = () => {
                    if (this.agentSelectionSource !== e || this.context?.agentSelection !== e)
                      return;
                    let r = e.state.selectedId,
                      i = !n && this.selectedAgentId !== r;
                    this.selectedAgentId = r;
                    let a = t || i;
                    ((t = !1), (n = !1), a && this.resetSourceState(), this.loadProposals(a));
                  };
                return (r(), e.subscribe(r));
              },
            )
            .effect(
              () => this.context?.sessions,
              (e) => {
                let t = this.hasBoundSessions && this.sessionsSource !== e;
                ((this.hasBoundSessions = !0),
                  (this.sessionsSource = e),
                  t && (this.resetSourceState(), this.loadProposals(!0)));
              },
            )
            .watch(
              () => this.context?.agentIdentity,
              (e, t) => e.subscribe(t),
            )
            .watch(
              () => this.context?.runtimeConfig,
              (e, t) => e.subscribe(t),
            )),
          (this.handleRevisionRequest = async (e, t, n) => {
            let r = this.captureSourceScope();
            if (!r) throw Error(`Skill Workshop is not ready.`);
            let i;
            try {
              i = await Mt(r.state, r.context, t, n);
            } catch (e) {
              if (!this.isCurrentSourceScope(r)) return;
              throw e;
            }
            if (this.isCurrentSourceScope(r)) {
              if (!i)
                throw Error(
                  r.sessions.state.error ?? `Could not prepare a Skill Workshop session.`,
                );
              try {
                r.revision.prepare({
                  sessionKey: i,
                  instructions: e,
                  proposalId: t.key,
                  proposalAgentId: y(t.origin?.agentId ?? n),
                });
              } catch (e) {
                if (!this.isCurrentSourceScope(r)) return;
                throw e;
              }
              this.isCurrentSourceScope(r) && r.navigate(`chat`, { search: te(i) });
            }
          }),
          (this.requestPageUpdate = () => {
            this.isConnected && this.requestUpdate();
          }),
          (this.handleHistoryScan = () => {
            let e = this.captureSourceScope();
            e &&
              (Ae({
                state: e.state,
                context: e.context,
                current: () => {
                  let e = this.state,
                    t = this.context;
                  return e && t ? { state: e, context: t } : void 0;
                },
              }).finally(this.requestPageUpdate),
              this.requestPageUpdate());
          }),
          (this.handleSelfLearningToggle = (e) => {
            this.applySelfLearningToggle(e);
          }));
      }
      willUpdate() {
        !this.state &&
          this.context &&
          ((this.state = O(this.data)),
          (this.state.skillWorkshopMode = Re()),
          (this.state.skillWorkshopUseCurrentChatForRevisions = Be()));
      }
      updated() {
        let e = this.state,
          t = e && !e.skillWorkshopLoaded && !e.skillWorkshopLoading && !e.skillWorkshopError;
        (this.gatewayConnected && t && this.loadProposals(!1), this.ensureWorkshopAgentIdentity());
        let n = this.context?.runtimeConfig;
        n &&
          this.gatewayConnected &&
          !n.state.configSnapshot &&
          !n.state.configLoading &&
          n.ensureLoaded();
      }
      resetSourceState() {
        this.sourceEpoch += 1;
        let e = this.state;
        if (!e) return;
        e.skillWorkshopActionNoticeTimer &&
          globalThis.clearTimeout(e.skillWorkshopActionNoticeTimer);
        let t = O();
        ((t.skillWorkshopStatusFilter = e.skillWorkshopStatusFilter),
          (t.skillWorkshopQuery = e.skillWorkshopQuery),
          (t.skillWorkshopQueueWidth = e.skillWorkshopQueueWidth),
          (t.skillWorkshopMode = e.skillWorkshopMode),
          (t.skillWorkshopUseCurrentChatForRevisions = e.skillWorkshopUseCurrentChatForRevisions),
          (this.state = t),
          this.requestPageUpdate());
      }
      applyGatewaySnapshot(e, t, n) {
        ((this.gatewaySource = e),
          (this.gatewayClient = t.client),
          (this.gatewayConnected = t.connected),
          n && this.resetSourceState(),
          t.connected && (n || !this.state?.skillWorkshopLoaded) && this.loadProposals(n));
      }
      captureSourceScope() {
        return qe({ state: this.state, context: this.context, epoch: this.sourceEpoch });
      }
      isCurrentSourceScope(e) {
        return Je(e, { state: this.state, context: this.context, epoch: this.sourceEpoch });
      }
      loadProposals(e) {
        let t = this.state,
          n = this.context;
        !t ||
          !n ||
          !n.gateway.snapshot.connected ||
          De({ state: t, context: n, force: e }).finally(this.requestPageUpdate);
      }
      async applySelfLearningToggle(e) {
        let t = this.context?.runtimeConfig;
        if (!(!t || this.selfLearningBusy)) {
          ((this.selfLearningBusy = !0), (this.selfLearningError = null), this.requestPageUpdate());
          try {
            this.selfLearningError = await Pe(t, e);
          } finally {
            ((this.selfLearningBusy = !1), this.requestPageUpdate());
          }
        }
      }
      ensureWorkshopAgentIdentity() {
        let e = this.context,
          t = this.state?.skillWorkshopAgentId;
        !e || !t || e.agentIdentity.get(t) || e.agentIdentity.ensure([t]);
      }
      disconnectedCallback() {
        (this.subscriptions.clear(), this.resetSourceState(), super.disconnectedCallback());
      }
      render() {
        return this.state && this.context
          ? Nt(
              this.state,
              {
                context: this.context,
                workshopAgentName:
                  this.context.agentIdentity.get(this.state.skillWorkshopAgentId)?.name?.trim() ??
                  ``,
                onRevisionRequest: this.onRevisionRequest ?? this.handleRevisionRequest,
                selfLearning: Ne(
                  this.context.runtimeConfig,
                  this.selfLearningBusy,
                  this.selfLearningError,
                ),
                onSelfLearningToggle: this.handleSelfLearningToggle,
                onHistoryScan: this.handleHistoryScan,
              },
              this.requestPageUpdate,
            )
          : p;
      }
    }),
    n([i({ context: de, subscribe: !0 })], $.prototype, `context`, void 0),
    n([c({ attribute: !1 })], $.prototype, `data`, void 0),
    n([c({ attribute: !1 })], $.prototype, `onRevisionRequest`, void 0),
    customElements.get(`openclaw-skill-workshop-page`) ||
      customElements.define(`openclaw-skill-workshop-page`, $));
})();
//# sourceMappingURL=skill-workshop-page-BSKKYejD.js.map
