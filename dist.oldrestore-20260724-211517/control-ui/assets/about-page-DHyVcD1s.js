import { K as ne, dt as re, nt as _, q as v } from "./control-ui-core--EZfp09c.js";
import {
  $t as f,
  Qt as p,
  Zt as m,
  da as h,
  di as g,
  fi as ee,
  la as te,
} from "./control-ui-core-BcbHa4vB.js";
import {
  $ as S,
  I as C,
  J as w,
  K as T,
  M as E,
  P as D,
  Q as O,
  j as k,
  q as A,
} from "./control-ui-core-CQDTaMS5.js";
import { i as y, o as b, t as x } from "./control-ui-core-CwQmiouz.js";
import { dt as r, ft as i } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as t, g as n } from "./control-ui-foundation-CCDffryi.js";
import { D as u, M as d } from "./control-ui-foundation-s2wA1PVE.js";
import { d as j, f as M } from "./control-ui-shared-CrnVqnQR.js";
import { G as a, Y as o, at as s, et as c, nt as l } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
import { a as P, f as F, o as I, s as L, t as R } from "./settings-ui-T0X7dZpU.js";
import { n as ie, t as N } from "./settings-workspace-DRQpceJK.js";
var z = e(() => {}),
  B,
  V = e(() => {
    (c(),
      (B = {
        github: s`
    <svg viewBox="0 0 24 24" class="icon--filled">
      <path
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.67.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
      />
    </svg>
  `,
        discord: s`
    <svg viewBox="0 0 24 24" class="icon--filled">
      <path
        d="M20.32 4.37a19.8 19.8 0 0 0-4.93-1.51 13.78 13.78 0 0 0-.64 1.29 18.27 18.27 0 0 0-5.5 0 12.64 12.64 0 0 0-.64-1.29 19.74 19.74 0 0 0-4.93 1.51C.53 9.05-.32 13.6.1 18.06a19.9 19.9 0 0 0 6.07 3.03c.46-.63.87-1.3 1.24-2a12.86 12.86 0 0 1-1.96-.93c.16-.12.32-.24.48-.37a14.2 14.2 0 0 0 12.14 0c.16.13.32.25.48.37-.63.37-1.28.68-1.96.93.36.7.78 1.37 1.24 2a19.84 19.84 0 0 0 6.07-3.03c.5-5.18-.84-9.68-3.58-13.69ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.95-2.42 2.16-2.42 1.21 0 2.18 1.09 2.16 2.42 0 1.34-.95 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.22 0 2.18 1.09 2.16 2.42 0 1.34-.94 2.42-2.16 2.42Z"
      />
    </svg>
  `,
      }));
  });
function H(e, t) {
  if (!e) return null;
  let n = new Date(e);
  return Number.isNaN(n.getTime())
    ? null
    : new Intl.DateTimeFormat(t, { dateStyle: `medium`, timeZone: `UTC` }).format(n);
}
function U(e) {
  return b(
    e === `copying`
      ? `aboutPage.copyingCommit`
      : e === `copied`
        ? `aboutPage.copiedCommit`
        : e === `error`
          ? `aboutPage.copyCommitFailed`
          : `aboutPage.copyCommit`,
  );
}
function W(e) {
  return e === `copied`
    ? b(`aboutPage.copiedCommit`)
    : e === `error`
      ? b(`aboutPage.copyCommitFailed`)
      : ``;
}
function G() {
  return s`<span class="muted">${b(`aboutPage.unavailable`)}</span>`;
}
function K(e) {
  let t = e.buildInfo.commit;
  if (!t) return G();
  let n = U(e.copyState);
  return s`
    <span class="about-commit">
      <code dir="ltr" title=${t}>${t.slice(0, Y)}</code>
      <openclaw-tooltip .content=${n}>
        <button
          type="button"
          class="btn btn--icon"
          aria-label=${n}
          aria-busy=${e.copyState === `copying` ? `true` : l}
          ?disabled=${e.copyState === `copying`}
          @click=${e.onCopyCommit}
        >
          <span aria-hidden="true">${e.copyState === `copied` ? O.check : O.copy}</span>
        </button>
      </openclaw-tooltip>
      <span class="about-sr-only" role="status" aria-live="polite"
        >${W(e.copyState)}</span
      >
    </span>
  `;
}
function q(e) {
  let t = E(k.find((e) => e.id === `crimson`) ?? d(k[0], `about lobster palette`));
  return s`
    <section class="about-hero">
      <button
        type="button"
        class="about-hero__clawd ${e.clawdWaving ? `about-hero__clawd--wave` : ``}"
        style=${`--lob-shell:${t.palette.shell};--lob-claw:${t.palette.claw}`}
        aria-label=${b(`aboutPage.waveHello`)}
        @click=${e.onPokeClawd}
      >
        ${C(t)}
      </button>
      <h2 class="about-hero__name">${b(`aboutPage.productName`)}</h2>
      <p class="about-hero__tagline">${b(`aboutPage.tagline`)}</p>
      ${e.buildInfo.version ? s`<code class="about-hero__version" dir="ltr">v${e.buildInfo.version}</code>` : l}
      <nav class="about-hero__links" aria-label=${b(`aboutPage.linksLabel`)}>
        ${X.map(
          (e) => s`
            <a
              class="about-hero__link"
              href=${e.href}
              target=${m}
              rel=${p()}
            >
              <span class="about-hero__link-icon" aria-hidden="true">${e.icon}</span>
              <span>${e.label()}</span>
            </a>
          `,
        )}
      </nav>
    </section>
  `;
}
function J(e) {
  let t = H(e.buildInfo.builtAt, y.getLocale()),
    n = s`
    <dl class="settings-kv" role="group" aria-label=${b(`aboutPage.artifactDetails`)}>
      <dt>${b(`aboutPage.version`)}</dt>
      <dd>
        ${e.buildInfo.version ? s`<code dir="ltr" title=${e.buildInfo.version}>${e.buildInfo.version}</code>` : G()}
      </dd>
      <dt>${b(`aboutPage.commit`)}</dt>
      <dd>${K(e)}</dd>
      ${
        e.buildInfo.branch
          ? s`
            <dt>${b(`aboutPage.branch`)}</dt>
            <dd>
              <code dir="ltr" title=${e.buildInfo.branch}
                >${e.buildInfo.branch}${e.buildInfo.dirty === !0 ? `*` : ``}</code
              >
            </dd>
          `
          : l
      }
      <dt>${b(`aboutPage.built`)}</dt>
      <dd>
        ${
          t && e.buildInfo.builtAt
            ? s`<time
              dir="auto"
              datetime=${e.buildInfo.builtAt}
              title=${e.buildInfo.builtAt}
              >${t}</time
            >`
            : G()
        }
      </dd>
    </dl>
  `;
  return P([
    q(e),
    L({ title: b(`aboutPage.artifactTitle`), description: b(`aboutPage.artifactSubtitle`) }, n),
    L(
      {},
      I({
        title: b(`aboutPage.gatewayVersion`),
        description: b(`aboutPage.gatewayVersionHint`),
        control: e.gatewayVersion
          ? F(s`<code dir="ltr" title=${e.gatewayVersion}>${e.gatewayVersion}</code>`, { mono: !0 })
          : F(b(`aboutPage.unavailable`)),
      }),
    ),
    s`<p class="about-footer">${b(`aboutPage.license`)}</p>`,
  ]);
}
var Y,
  X,
  ae = e(() => {
    (u(),
      c(),
      S(),
      D(),
      R(),
      w(),
      x(),
      f(),
      z(),
      V(),
      (Y = 12),
      (X = [
        { href: `https://openclaw.ai`, icon: O.globe, label: () => b(`aboutPage.linkWebsite`) },
        { href: `https://docs.openclaw.ai`, icon: O.book, label: () => b(`aboutPage.linkDocs`) },
        {
          href: `https://github.com/openclaw/openclaw`,
          icon: B.github,
          label: () => b(`aboutPage.linkGitHub`),
        },
        {
          href: `https://discord.gg/clawd`,
          icon: B.discord,
          label: () => b(`aboutPage.linkDiscord`),
        },
        {
          href: `https://docs.openclaw.ai/releases`,
          icon: O.scrollText,
          label: () => b(`aboutPage.linkChangelog`),
        },
      ]));
  }),
  Z,
  Q,
  $;
e(() => {
  (r(),
    c(),
    a(),
    _(),
    v(),
    A(),
    N(),
    M(),
    h(),
    ee(),
    ae(),
    t(),
    (Z = 1800),
    (Q = 1400),
    ($ = class extends te {
      constructor(...e) {
        (super(...e),
          (this.copyState = `idle`),
          (this.clawdWaving = !1),
          (this.copyResetTimer = null),
          (this.waveResetTimer = null),
          (this.subscriptions = new g(this).watch(
            () => this.context?.gateway,
            (e, t) => e.subscribe(t),
          )));
      }
      disconnectedCallback() {
        (this.subscriptions.clear(),
          this.copyResetTimer !== null &&
            (globalThis.clearTimeout(this.copyResetTimer), (this.copyResetTimer = null)),
          this.waveResetTimer !== null &&
            (globalThis.clearTimeout(this.waveResetTimer), (this.waveResetTimer = null)),
          super.disconnectedCallback());
      }
      pokeClawd() {
        this.clawdWaving ||
          ((this.clawdWaving = !0),
          (this.waveResetTimer = globalThis.setTimeout(() => {
            ((this.waveResetTimer = null), (this.clawdWaving = !1));
          }, Q)));
      }
      async copyCommit() {
        let e = T.commit;
        if (!e || this.copyState === `copying`) return;
        this.copyState = `copying`;
        let t = await j(e);
        this.isConnected &&
          ((this.copyState = t ? `copied` : `error`),
          this.copyResetTimer !== null && globalThis.clearTimeout(this.copyResetTimer),
          (this.copyResetTimer = globalThis.setTimeout(() => {
            ((this.copyResetTimer = null), (this.copyState = `idle`));
          }, Z)));
      }
      render() {
        let e = this.context.gateway.snapshot,
          t = J({
            buildInfo: T,
            gatewayVersion: (e.connected && e.hello?.server?.version?.trim()) || null,
            copyState: this.copyState,
            onCopyCommit: () => void this.copyCommit(),
            clawdWaving: this.clawdWaving,
            onPokeClawd: () => this.pokeClawd(),
          });
        return s`
      <section class="content-header">
        <div>
          <div class="page-title">${re(`about`)}</div>
        </div>
      </section>
      ${ie(t)}
    `;
      }
    }),
    n([i({ context: ne, subscribe: !0 })], $.prototype, `context`, void 0),
    n([o()], $.prototype, `copyState`, void 0),
    n([o()], $.prototype, `clawdWaving`, void 0),
    customElements.define(`openclaw-about-page`, $));
})();
//# sourceMappingURL=about-page-DHyVcD1s.js.map
