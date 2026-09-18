import { K as w, q as T } from "./control-ui-core--EZfp09c.js";
import {
  Wa as g,
  ca as _,
  da as v,
  di as ee,
  ea as te,
  fi as y,
  hn as b,
  tn as x,
  xr as S,
  yr as C,
} from "./control-ui-core-BcbHa4vB.js";
import { $ as O, Q as k, m as A, p as j, x as M } from "./control-ui-core-CQDTaMS5.js";
import { o as E, t as D } from "./control-ui-core-CwQmiouz.js";
import { dt as i, ft as a } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n, u as r } from "./control-ui-foundation-CCDffryi.js";
import { $ as m, tt as h } from "./control-ui-foundation-s2wA1PVE.js";
import {
  F as o,
  G as s,
  M as c,
  Y as l,
  Z as u,
  at as d,
  et as f,
  nt as p,
} from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function N() {
  return [
    {
      id: `nav-new-session`,
      label: E(`newSession.title`),
      icon: `plus`,
      category: `navigation`,
      action: `nav:new-session`,
    },
    {
      id: `nav-sessions`,
      label: E(`palette.items.sessions`),
      icon: `fileText`,
      category: `navigation`,
      action: `nav:sessions`,
    },
    {
      id: `nav-cron`,
      label: E(`palette.items.scheduled`),
      icon: `scrollText`,
      category: `navigation`,
      action: `nav:cron`,
    },
    {
      id: `nav-skills`,
      label: E(`palette.items.skills`),
      icon: `zap`,
      category: `navigation`,
      action: `nav:skills`,
    },
    {
      id: `nav-plugins`,
      label: E(`palette.items.plugins`),
      icon: `puzzle`,
      category: `navigation`,
      action: `nav:plugins`,
    },
    {
      id: `nav-config`,
      label: E(`palette.items.settings`),
      icon: `settings`,
      category: `navigation`,
      action: `nav:config`,
    },
    {
      id: `nav-agents`,
      label: E(`palette.items.agents`),
      icon: `folder`,
      category: `navigation`,
      action: `nav:agents`,
    },
    {
      id: `slash:verbose`,
      label: `/verbose`,
      icon: `terminal`,
      category: `search`,
      action: `/verbose full`,
      description: E(`palette.descriptions.verboseMode`),
    },
  ];
}
function P() {
  return N();
}
function F(e, t = !0, n = []) {
  let r = P().filter((e) => t || e.category !== `search`);
  if (!e) return r;
  let i = m(e),
    a = r.filter((e) => m(e.label).includes(i) || m(e.description).includes(i));
  return [...n, ...a];
}
function I(e) {
  let t = new Map();
  for (let n of e) {
    let e = t.get(n.category) ?? [];
    (e.push(n), t.set(n.category, e));
  }
  return [...t.entries()];
}
function L(e, t) {
  (e.action.startsWith(`nav:`)
    ? t.onNavigate(e.action.slice(4))
    : e.action.startsWith(G)
      ? t.onSelectSession?.(e.action.slice(8))
      : t.onSlashCommand?.(e.action),
    t.onToggle());
}
function R(e) {
  e.onToggle();
}
function z() {
  requestAnimationFrame(() => {
    document.querySelector(`.cmd-palette__item--active`)?.scrollIntoView({ block: `nearest` });
  });
}
function B(e, t) {
  let n = F(t.query, !!t.onSlashCommand, t.sessionItems);
  if (!(n.length === 0 && (e.key === `ArrowDown` || e.key === `ArrowUp` || e.key === `Enter`)))
    switch (e.key) {
      case `ArrowDown`:
        (e.preventDefault(), t.onActiveIndexChange((t.activeIndex + 1) % n.length), z());
        break;
      case `ArrowUp`:
        (e.preventDefault(), t.onActiveIndexChange((t.activeIndex - 1 + n.length) % n.length), z());
        break;
      case `Enter`:
        e.preventDefault();
        {
          let e = n[t.activeIndex];
          e && L(e, t);
        }
        break;
      case `Escape`:
        (e.preventDefault(), e.stopPropagation(), R(t));
        break;
    }
}
function V(e) {
  switch (e) {
    case `search`:
      return E(`palette.categories.search`);
    case `navigation`:
      return E(`palette.categories.navigation`);
    case `skills`:
      return E(`palette.categories.skills`);
    case `chats`:
      return E(`sessionsView.title`);
    default:
      return e;
  }
}
function H(e) {
  return `cmd-palette-option-${e.id.replace(/[^a-zA-Z0-9_-]/g, `-`)}`;
}
function U(e) {
  e instanceof HTMLInputElement &&
    requestAnimationFrame(() => {
      e.isConnected && e.focus();
    });
}
function W(e) {
  if (!e.open) return p;
  let t = F(e.query, !!e.onSlashCommand, e.sessionItems),
    n = I(t),
    r = t[e.activeIndex],
    i = r ? H(r) : p,
    a = E(`palette.placeholder`);
  return d`
    <openclaw-modal-dialog
      class="cmd-palette-overlay palette"
      label=${a}
      style="--openclaw-modal-width: min(640px, calc(100vw - 32px));"
      @modal-cancel=${() => R(e)}
    >
      <div
        class="cmd-palette"
        @click=${(e) => e.stopPropagation()}
        @keydown=${(t) => B(t, e)}
      >
        <label id=${X} class="cmd-palette__label" for=${Z}
          >${a}</label
        >
        <input
          ${o(e.onInputRef)}
          autofocus
          id=${Z}
          class="cmd-palette__input"
          role="combobox"
          aria-autocomplete="list"
          aria-controls=${Q}
          aria-activedescendant=${i}
          aria-expanded="true"
          placeholder=${a}
          .value=${e.query}
          @input=${(t) => {
            (e.onQueryChange(t.target.value), e.onActiveIndexChange(0));
          }}
        />
        <div id=${Q} class="cmd-palette__results" role="listbox">
          ${
            n.length === 0
              ? d`<div class="cmd-palette__empty">
                <span class="nav-item__icon" style="opacity:0.3;width:20px;height:20px"
                  >${k.search}</span
                >
                <span>${E(`palette.noResults`)}</span>
              </div>`
              : n.map(
                  ([n, r]) => d`
                  <div class="cmd-palette__group-label">${V(n)}</div>
                  ${r.map((n) => {
                    let r = t.indexOf(n),
                      i = r === e.activeIndex;
                    return d`
                      <div
                        id=${H(n)}
                        class="cmd-palette__item ${i ? `cmd-palette__item--active` : ``}"
                        role="option"
                        aria-selected=${i ? `true` : `false`}
                        @click=${(t) => {
                          (t.stopPropagation(), L(n, e));
                        }}
                        @mouseenter=${() => e.onActiveIndexChange(r)}
                      >
                        <span class="nav-item__icon">${k[n.icon]}</span>
                        <span>${n.label}</span>
                        ${
                          n.description
                            ? d`<span class="cmd-palette__item-desc muted"
                              >${n.description}</span
                            >`
                            : p
                        }
                      </div>
                    `;
                  })}
                `,
                )
          }
        </div>
        <div class="cmd-palette__footer">
          <span><kbd>↑↓</kbd> ${E(`palette.footer.navigate`)}</span>
          <span><kbd>↵</kbd> ${E(`palette.footer.select`)}</span>
          <span><kbd>esc</kbd> ${E(`palette.footer.close`)}</span>
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
var G, K, q, J, Y, X, Z, Q, $;
e(() => {
  (i(),
    f(),
    s(),
    c(),
    T(),
    D(),
    te(),
    C(),
    x(),
    g(),
    v(),
    y(),
    j(),
    O(),
    M(),
    t(),
    (G = `session:`),
    (K = 250),
    (q = 10),
    (J = 4),
    (Y = 50),
    (X = `cmd-palette-label`),
    (Z = `cmd-palette-input`),
    (Q = `cmd-palette-listbox`),
    ($ = class extends _ {
      constructor() {
        (super(),
          (this.open = !1),
          (this.query = ``),
          (this.activeIndex = 0),
          (this.sessionItems = []),
          (this.subscriptions = new ee(this)),
          (this.sessionSearchTimer = null),
          (this.sessionSearchId = 0),
          (this.togglePalette = () => {
            if (this.open) {
              ((this.open = !1), this.clearSessionSearch());
              return;
            }
            this.openPalette();
          }),
          (this.handleInputRef = (e) => {
            this.open && U(e);
          }),
          (this.handleGlobalKeydown = (e) => {
            if (!e.defaultPrevented && e.key === `Escape` && this.open) {
              (e.preventDefault(), this.togglePalette());
              return;
            }
            A(e) && (e.preventDefault(), this.togglePalette());
          }),
          this.subscriptions.watch(
            () => this.context?.gateway,
            (e, t) => e.subscribe(t),
            (e) => this.synchronizeGateway(e),
          ));
      }
      connectedCallback() {
        (super.connectedCallback(), document.addEventListener(`keydown`, this.handleGlobalKeydown));
      }
      disconnectedCallback() {
        (document.removeEventListener(`keydown`, this.handleGlobalKeydown),
          (this.open = !1),
          (this.query = ``),
          (this.activeIndex = 0),
          this.clearSessionSearch(),
          (this.sessionSearchSource = void 0),
          super.disconnectedCallback());
      }
      openPalette() {
        ((this.open = !0), (this.query = ``), (this.activeIndex = 0), this.clearSessionSearch());
      }
      get isOpen() {
        return this.open;
      }
      synchronizeGateway(e) {
        let t = e.snapshot,
          n = this.sessionSearchSource,
          r = n?.gateway !== e,
          i = n?.client !== t.client,
          a = n?.connected === !1 && t.connected;
        ((this.sessionSearchSource = { gateway: e, client: t.client, connected: t.connected }),
          (r || i || !t.connected) && this.clearSessionSearch(),
          t.connected && (r || i || a) && this.scheduleSessionSearch(this.query));
      }
      clearSessionSearch() {
        (this.sessionSearchTimer !== null &&
          (globalThis.clearTimeout(this.sessionSearchTimer), (this.sessionSearchTimer = null)),
          (this.sessionSearchId += 1),
          (this.sessionItems = []));
      }
      scheduleSessionSearch(e) {
        (this.sessionSearchTimer !== null &&
          (globalThis.clearTimeout(this.sessionSearchTimer), (this.sessionSearchTimer = null)),
          (this.sessionSearchId += 1),
          (this.sessionItems = []));
        let t = h(e);
        !this.open ||
          !t ||
          !this.onSelectSession ||
          (this.sessionSearchTimer = globalThis.setTimeout(() => {
            ((this.sessionSearchTimer = null), this.searchSessions(t));
          }, K));
      }
      async searchSessions(e) {
        let t = this.context,
          n = t?.sessions,
          i = t?.gateway,
          a = i?.snapshot.client;
        if (!n || !i?.snapshot.connected || !a) return;
        let o = ++this.sessionSearchId,
          s = [],
          c = new Set(),
          l = new Set([0]),
          u = 0,
          d;
        try {
          for (; s.length < q && u < J;) {
            let t = await n.list({
              search: e,
              limit: Y,
              ...(d === void 0 ? {} : { offset: d }),
              includeGlobal: !1,
              includeUnknown: !1,
            });
            if (
              ((u += 1),
              o !== this.sessionSearchId ||
                !this.open ||
                this.context?.sessions !== n ||
                this.context?.gateway !== i ||
                i.snapshot.client !== a ||
                !i.snapshot.connected ||
                !t)
            )
              return;
            let r = b(t, { agentId: ``, defaultAgentId: ``, filterByAgent: !1 });
            for (let e of r) c.has(e.key) || (c.add(e.key), s.push(e));
            if (s.length >= q || !t.hasMore) break;
            let f =
              typeof t.nextOffset == `number` && Number.isFinite(t.nextOffset)
                ? Math.max(0, Math.floor(t.nextOffset))
                : t.sessions.length > 0
                  ? (d ?? 0) + t.sessions.length
                  : null;
            if (f === null || l.has(f)) break;
            (l.add(f), (d = f));
          }
          ((this.sessionItems = s
            .slice(0, q)
            .map((e) => ({
              id: `session-${e.key}`,
              label: S(e.key, e),
              icon: `messageSquare`,
              category: `chats`,
              action: `${G}${e.key}`,
              description: r(e.updatedAt, { fallback: `` }),
            }))),
            (this.activeIndex = 0));
        } catch {}
      }
      render() {
        return W({
          open: this.open,
          query: this.query,
          activeIndex: this.activeIndex,
          sessionItems: this.sessionItems,
          onToggle: this.togglePalette,
          onQueryChange: (e) => {
            ((this.query = e), (this.activeIndex = 0), this.scheduleSessionSearch(e));
          },
          onActiveIndexChange: (e) => {
            this.activeIndex = e;
          },
          onNavigate: (e) => this.onNavigate?.(e),
          onSelectSession: this.onSelectSession,
          onSlashCommand: this.onSlashCommand,
          onInputRef: this.handleInputRef,
        });
      }
    }),
    n([u({ attribute: !1 })], $.prototype, `onNavigate`, void 0),
    n([u({ attribute: !1 })], $.prototype, `onSelectSession`, void 0),
    n([u({ attribute: !1 })], $.prototype, `onSlashCommand`, void 0),
    n([a({ context: w, subscribe: !0 })], $.prototype, `context`, void 0),
    n([l()], $.prototype, `open`, void 0),
    n([l()], $.prototype, `query`, void 0),
    n([l()], $.prototype, `activeIndex`, void 0),
    n([l()], $.prototype, `sessionItems`, void 0),
    customElements.get(`openclaw-command-palette`) ||
      customElements.define(`openclaw-command-palette`, $));
})();
export { $ as CommandPalette };
//# sourceMappingURL=command-palette-DgsfrtcH.js.map
