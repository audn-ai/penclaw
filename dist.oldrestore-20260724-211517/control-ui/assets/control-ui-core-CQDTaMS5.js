import {
  $ as It,
  B as Lt,
  F as Rt,
  G as zt,
  I as Bt,
  J as Vt,
  K as Ht,
  L as Ut,
  Q as Wt,
  R as Gt,
  U as Kt,
  W as qt,
  X as D,
  Y as Jt,
  _t as Yt,
  at as Xt,
  ct as Zt,
  dt as O,
  et as Qt,
  ft as $t,
  ht as en,
  it as tn,
  lt as nn,
  nt as rn,
  ot as an,
  pt as on,
  q as sn,
  rt as cn,
  st as ln,
  tt as un,
  ut as dn,
} from "./control-ui-core--EZfp09c.js";
import {
  $t as ye,
  An as be,
  Ci as xe,
  Cn as Se,
  Cr as Ce,
  Gt as we,
  Hn as C,
  In as Te,
  Jt as Ee,
  Kn as De,
  Kt as Oe,
  Ln as ke,
  Mn as Ae,
  Pr as je,
  Qt as Me,
  Rn as Ne,
  Si as Pe,
  Sr as Fe,
  Tr as Ie,
  Ua as Le,
  Va as w,
  Wa as Re,
  Wn as ze,
  Wt as Be,
  Yt as Ve,
  Zt as He,
  aa as Ue,
  ar as We,
  br as Ge,
  ca as T,
  cr as Ke,
  da as E,
  di as qe,
  dr as Je,
  ea as Ye,
  fa as Xe,
  fi as Ze,
  fn as Qe,
  fr as $e,
  ha as et,
  hi as tt,
  hr as nt,
  ii as rt,
  ir as it,
  jr as at,
  kn as ot,
  la as st,
  li as ct,
  lr as lt,
  ma as ut,
  mi as dt,
  mn as ft,
  mr as pt,
  ni as mt,
  nr as ht,
  oa as gt,
  or as _t,
  pa as vt,
  pi as yt,
  qn as bt,
  qt as xt,
  rr as St,
  sr as Ct,
  tn as wt,
  tr as Tt,
  ua as Et,
  ui as Dt,
  ur as Ot,
  vi as kt,
  vn as At,
  vr as jt,
  wr as Mt,
  xr as Nt,
  yr as Pt,
  zr as Ft,
} from "./control-ui-core-BcbHa4vB.js";
import { Ft as l, Lt as u, Nt as d } from "./control-ui-core-CFS5NQSC.js";
import { i as fn, o as k, t as A } from "./control-ui-core-CwQmiouz.js";
import {
  b as f,
  dt as p,
  ft as m,
  g as ee,
  lt as te,
  t as ne,
  y as re,
} from "./control-ui-foundation-0uuDj0X3.js";
import {
  _ as t,
  a as n,
  d as r,
  g as i,
  i as a,
  o,
  r as s,
  u as c,
} from "./control-ui-foundation-CCDffryi.js";
import {
  $ as S,
  D as ue,
  Dt as de,
  M as fe,
  at as pe,
  jt as me,
  ot as he,
  tt as ge,
} from "./control-ui-foundation-s2wA1PVE.js";
import {
  a as pn,
  d as mn,
  f as hn,
  o as gn,
  s as _n,
  u as vn,
} from "./control-ui-shared-CrnVqnQR.js";
import { n as _e, r as ve } from "./gateway-runtime-D6zABMsO.js";
import {
  F as ie,
  G as h,
  K as ae,
  M as oe,
  R as se,
  Y as g,
  Z as _,
  at as v,
  et as y,
  nt as b,
  st as x,
  ut as ce,
  z as le,
} from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function yn(e) {
  if ((e.setAttribute(`popover`, `manual`), typeof e.showPopover == `function`))
    try {
      e.showPopover();
      return;
    } catch {}
  e.removeAttribute(`popover`);
}
var bn,
  xn = e(() => {
    ((bn = class extends HTMLElement {
      connectedCallback() {
        yn(this);
      }
    }),
      customElements.get(`openclaw-menu-surface`) ||
        customElements.define(`openclaw-menu-surface`, bn));
  });
function Sn(e) {
  return j[e];
}
var j,
  M = e(() => {
    (y(),
      (j = {
        messageSquare: v`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,
        barChart: v`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,
        coins: v`
    <svg viewBox="0 0 24 24">
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  `,
        activity: v`
    <svg viewBox="0 0 24 24">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  `,
        clock: v`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  `,
        link: v`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,
        radio: v`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,
        fileText: v`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,
        zap: v`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,
        monitor: v`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,
        monitorSmartphone: v`
    <svg viewBox="0 0 24 24">
      <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" />
      <path d="M10 19v-3.96 3.15" />
      <path d="M7 19h5" />
      <rect width="6" height="10" x="16" y="12" rx="2" />
    </svg>
  `,
        server: v`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  `,
        sun: v`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  `,
        moon: v`
    <svg viewBox="0 0 24 24">
      <path d="M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  `,
        settings: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,
        bug: v`
    <svg viewBox="0 0 24 24">
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  `,
        scrollText: v`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,
        folder: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,
        kanban: v`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M8 7v7" />
      <path d="M12 7v4" />
      <path d="M16 7v9" />
    </svg>
  `,
        bot: v`
    <svg viewBox="0 0 24 24">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  `,
        users: v`
    <svg viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  `,
        menu: v`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,
        x: v`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,
        check: v` <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg> `,
        play: v` <svg viewBox="0 0 24 24"><polygon points="6 3 20 12 6 21 6 3" /></svg> `,
        pause: v`
    <svg viewBox="0 0 24 24">
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  `,
        target: v`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  `,
        archive: v`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  `,
        archiveRestore: v`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="5" x="2" y="3" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="m9 15 3-3 3 3" />
      <path d="M12 12v6" />
    </svg>
  `,
        alertTriangle: v`
    <svg viewBox="0 0 24 24">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  `,
        layoutComfortable: v`
    <svg viewBox="0 0 24 24">
      <rect width="16" height="5" x="4" y="4" rx="1.5" />
      <rect width="16" height="5" x="4" y="15" rx="1.5" />
      <line x1="7" x2="16" y1="7" y2="7" />
      <line x1="7" x2="16" y1="18" y2="18" />
    </svg>
  `,
        layoutCompact: v`
    <svg viewBox="0 0 24 24">
      <rect width="16" height="3" x="4" y="4" rx="1" />
      <rect width="16" height="3" x="4" y="9" rx="1" />
      <rect width="16" height="3" x="4" y="14" rx="1" />
      <rect width="16" height="3" x="4" y="19" rx="1" />
    </svg>
  `,
        listFilter: v`
    <svg viewBox="0 0 24 24">
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  `,
        arrowDown: v` <svg viewBox="0 0 24 24"><path d="M12 5v14m7-7-7 7-7-7" /></svg> `,
        arrowUp: v` <svg viewBox="0 0 24 24"><path d="M12 19V5m-7 7 7-7 7 7" /></svg> `,
        arrowLeft: v`
    <svg viewBox="0 0 24 24">
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  `,
        cornerDownLeft: v`
    <svg viewBox="0 0 24 24">
      <polyline points="9 10 4 15 9 20" />
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
    </svg>
  `,
        cornerDownRight: v`
    <svg viewBox="0 0 24 24">
      <polyline points="15 10 20 15 15 20" />
      <path d="M4 4v7a4 4 0 0 0 4 4h12" />
    </svg>
  `,
        copy: v`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,
        search: v`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,
        brain: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"
      />
      <path
        d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"
      />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  `,
        book: v`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,
        loader: v`
    <svg viewBox="0 0 24 24">
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  `,
        calendarClock: v`
    <svg viewBox="0 0 24 24">
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </svg>
  `,
        listChecks: v`
    <svg viewBox="0 0 24 24">
      <path d="m3 17 2 2 4-4" />
      <path d="m3 7 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  `,
        wrench: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,
        fileCode: v`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,
        edit: v`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,
        penLine: v`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,
        paperclip: v`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,
        globe: v`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,
        image: v`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,
        camera: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.5 4 16 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3l1.5-3z"
      />
      <circle cx="12" cy="13" r="3" />
    </svg>
  `,
        smartphone: v`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,
        circleQuestionMark: v`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  `,
        plug: v`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,
        circle: v` <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg> `,
        puzzle: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `,
        panelLeft: v`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" stroke-linecap="round" />
    </svg>
  `,
        panelLeftClose: v`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" stroke-linecap="round" />
      <path d="M16 10l-3 2 3 2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        panelLeftOpen: v`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" stroke-linecap="round" />
      <path d="M14 10l3 2-3 2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        chevronDown: v`
    <svg viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        chevronRight: v`
    <svg viewBox="0 0 24 24">
      <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        chevronLeft: v`
    <svg viewBox="0 0 24 24">
      <path d="M15 18l-6-6 6-6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        externalLink: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M15 3h6v6M10 14L21 3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        send: v`
    <svg viewBox="0 0 24 24">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  `,
        stop: v` <svg viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" rx="1" /></svg> `,
        pin: v`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="17" y2="22" />
      <path
        d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"
      />
    </svg>
  `,
        pinOff: v`
    <svg viewBox="0 0 24 24">
      <line x1="2" x2="22" y1="2" y2="22" />
      <line x1="12" x2="12" y1="17" y2="22" />
      <path
        d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0-.39.04"
      />
    </svg>
  `,
        download: v`
    <svg viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  `,
        mic: v`
    <svg viewBox="0 0 24 24">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  `,
        volume2: v`
    <svg viewBox="0 0 24 24">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  `,
        bookmark: v`
    <svg viewBox="0 0 24 24"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
  `,
        plus: v`
    <svg viewBox="0 0 24 24">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  `,
        gitBranch: v`
    <svg viewBox="0 0 24 24">
      <circle cx="6" cy="5" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="19" r="2" />
      <path d="M6 7v10" />
      <path d="M8 9h5a5 5 0 0 0 5-5" />
    </svg>
  `,
        gitPullRequest: v`
    <svg viewBox="0 0 24 24">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <path d="M6 9v12" />
    </svg>
  `,
        gitMerge: v`
    <svg viewBox="0 0 24 24">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
  `,
        terminal: v`
    <svg viewBox="0 0 24 24">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  `,
        claw: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M9.6 9.2 A5.6 5.6 0 1 0 9.6 20.4 A5.6 5.6 0 0 0 9.6 9.2 Z M10 20 C14 20.9 17.9 19.5 20.1 16.1 C20.6 15.4 20.05 14.5 19.25 14.65 C17.1 15 14.9 14.4 13.2 13 L10.6 16 Z"
      />
      <path
        class="claw-icon__jaw"
        d="M6 10.6 C6.6 4.4 12.4 0.8 17.6 2.8 C20.8 4 22.8 6.8 23 9.8 C23.07 10.9 21.9 11.4 21.1 10.7 C19.4 9.2 16.9 8.7 14.7 9.5 C13.4 10 12.3 10.9 11.6 12.1 L7.2 12.4 Z"
      />
    </svg>
  `,
        spark: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
      />
    </svg>
  `,
        lobster: v`
    <svg viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="lob-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ff4d4d" />
          <stop offset="100%" stop-color="#991b1b" />
        </linearGradient>
      </defs>
      <path
        d="M60 10C30 10 15 35 15 55C15 75 30 95 45 100L45 110L55 110L55 100C55 100 60 102 65 100L65 110L75 110L75 100C90 95 105 75 105 55C105 35 90 10 60 10Z"
        fill="url(#lob-g)"
      />
      <path d="M20 45C5 40 0 50 5 60C10 70 20 65 25 55C28 48 25 45 20 45Z" fill="url(#lob-g)" />
      <path
        d="M100 45C115 40 120 50 115 60C110 70 100 65 95 55C92 48 95 45 100 45Z"
        fill="url(#lob-g)"
      />
      <path d="M45 15Q35 5 30 8" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" />
      <path d="M75 15Q85 5 90 8" stroke="#ff4d4d" stroke-width="3" stroke-linecap="round" />
      <circle cx="45" cy="35" r="6" fill="#050810" />
      <circle cx="75" cy="35" r="6" fill="#050810" />
      <circle cx="46" cy="34" r="2.5" fill="#00e5cc" />
      <circle cx="76" cy="34" r="2.5" fill="#00e5cc" />
    </svg>
  `,
        refresh: v`
    <svg viewBox="0 0 24 24">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  `,
        trash: v`
    <svg viewBox="0 0 24 24">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  `,
        eye: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,
        eyeOff: v`
    <svg viewBox="0 0 24 24">
      <path
        d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
      />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path
        d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
      />
      <path d="m2 2 20 20" />
    </svg>
  `,
        moreHorizontal: v`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </svg>
  `,
        arrowUpDown: v`
    <svg viewBox="0 0 24 24">
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  `,
        panelRightOpen: v`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M15 3v18" stroke-linecap="round" />
      <path d="M10 10l-3 2 3 2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        panelRightClose: v`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M15 3v18" stroke-linecap="round" />
      <path d="M8 10l3 2-3 2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        columns2: v`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 3v18" stroke-linecap="round" />
    </svg>
  `,
        panelBottomOpen: v`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15h18" stroke-linecap="round" />
      <path d="m10 8 2 3 2-3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        panelBottomClose: v`
    <svg viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15h18" stroke-linecap="round" />
      <path d="m10 11 2-3 2 3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
        maximize: v`
    <svg viewBox="0 0 24 24">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `,
        minimize: v`
    <svg viewBox="0 0 24 24">
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" x2="21" y1="10" y2="3" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  `,
      }));
  });
function N(e) {
  return v`<span slot="details" class="session-menu__shortcut" aria-hidden="true"
    >${e.toUpperCase()}</span
  >`;
}
function Cn(e, t) {
  if (t.metaKey || t.ctrlKey || t.altKey) return !1;
  let n = t.key.toLowerCase();
  if (!/^[a-z0-9]$/.test(n)) return !1;
  let r = e.querySelector(`[data-shortcut="${n}"]`);
  if (!r || r.disabled || r.getAttribute(`aria-disabled`) === `true`) return !1;
  let i = r.closest(`wa-dropdown-item:not([slot="submenu"])`);
  return r.getAttribute(`slot`) === `submenu` && i?.submenuOpen !== !0
    ? !1
    : (t.preventDefault(), t.stopPropagation(), r.click(), !0);
}
var wn = e(() => {
  y();
});
function Tn(e, t) {
  if (e.key === `Tab`) {
    t?.();
    return;
  }
  e.key === `Escape` && e.currentTarget && jn.add(e.currentTarget);
}
function En(e) {
  let t = e.currentTarget;
  return !t || !jn.has(t) ? !1 : (jn.delete(t), !0);
}
function Dn(e, t) {
  if (!(e instanceof HTMLElement) || e.localName !== `wa-dropdown-item`) return;
  let n = e;
  Promise.resolve(n.updateComplete).then(() => {
    n.isConnected &&
      (n.setAttribute(`role`, `menuitemradio`), n.setAttribute(`aria-checked`, String(t)));
  });
}
function On(e) {
  let t = e.shadowRoot?.querySelector(`[part="menu"]`);
  if (!t) return;
  let n = e.getAttribute(`aria-label`);
  if (n) {
    (t.setAttribute(`aria-label`, n), t.removeAttribute(`aria-labelledby`));
    return;
  }
  let r = e.querySelector(`[slot="trigger"]`),
    i = r?.getAttribute(`aria-label`) ?? r?.textContent?.trim();
  i && (t.setAttribute(`aria-label`, i), t.removeAttribute(`aria-labelledby`));
}
function kn(e) {
  let t = e.target;
  if (
    !(t instanceof HTMLElement) ||
    t.localName !== `wa-dropdown` ||
    (On(t), Mn.get(t)?.disconnect(), typeof MutationObserver > `u`)
  )
    return;
  let n = new MutationObserver(() => On(t));
  (n.observe(t, {
    attributes: !0,
    attributeFilter: [`aria-label`],
    childList: !0,
    characterData: !0,
    subtree: !0,
  }),
    Mn.set(t, n));
}
function An(e) {
  let t = e.target;
  !(t instanceof HTMLElement) ||
    t.localName !== `wa-dropdown` ||
    (Mn.get(t)?.disconnect(), Mn.delete(t));
}
var jn,
  Mn,
  P = e(() => {
    (f(),
      re(),
      (jn = new WeakSet()),
      (Mn = new WeakMap()),
      typeof document < `u` &&
        (document.addEventListener(`wa-show`, kn), document.addEventListener(`wa-after-hide`, An)));
  }),
  Nn,
  F,
  Pn = e(() => {
    (y(),
      h(),
      se(),
      oe(),
      A(),
      et(),
      E(),
      M(),
      wn(),
      xn(),
      P(),
      t(),
      (Nn = { label: ``, pinned: !1, unread: !1, archived: !1, category: null }),
      (F = class extends st {
        constructor(...e) {
          (super(...e),
            (this.session = Nn),
            (this.selectionCount = 1),
            (this.anchor = { x: 0, y: 0 }),
            (this.trigger = null),
            (this.disabled = !1),
            (this.forkDisabled = !1),
            (this.archiveAllowed = !1),
            (this.groups = []),
            (this.canOpenChat = !1),
            (this.work = null),
            (this.workboard = null),
            (this.onAction = () => {}),
            (this.onClose = () => {}),
            (this.handleDocumentKeydown = (e) => {
              if (e.key === `Escape`) {
                (e.preventDefault(), e.stopPropagation(), this.trigger?.focus(), this.onClose());
                return;
              }
              Cn(this, e);
            }),
            (this.handleSelect = (e) => {
              e.preventDefault();
              let t = e.detail.item.value;
              if (!t) return;
              let n = {
                "open-chat": { kind: `open-chat` },
                "toggle-pin": { kind: `toggle-pin` },
                "toggle-unread": { kind: `toggle-unread` },
                rename: { kind: `rename` },
                fork: { kind: `fork` },
                workboard: { kind: `workboard` },
                "new-group": { kind: `new-group` },
                "toggle-archived": { kind: `toggle-archived` },
                delete: { kind: `delete` },
              }[t];
              if (n) {
                this.runAction(n);
                return;
              }
              if (t === `open-pr` && this.work?.pullRequestUrl) {
                this.runAction({ kind: `open-pr`, url: this.work.pullRequestUrl });
                return;
              }
              if (t.startsWith(`open-in:`) && this.work?.worktreePath) {
                let e = t.slice(8);
                Xe.includes(e) &&
                  this.runAction({ kind: `open-in`, editor: e, path: this.work.worktreePath });
                return;
              }
              if (t.startsWith(`move-to-group:`)) {
                let e = t.slice(14);
                this.runAction({
                  kind: `move-to-group`,
                  category: e ? decodeURIComponent(e) : null,
                });
              }
            }),
            (this.handleAfterHide = (e) => {
              e.currentTarget instanceof Node && e.currentTarget.isConnected && this.onClose();
            }));
        }
        connectedCallback() {
          (super.connectedCallback(),
            document.addEventListener(`keydown`, this.handleDocumentKeydown, !0),
            yn(this));
        }
        disconnectedCallback() {
          (document.removeEventListener(`keydown`, this.handleDocumentKeydown, !0),
            super.disconnectedCallback());
        }
        runAction(e) {
          (this.onClose(), this.onAction(e));
        }
        renderWorkItems() {
          let e = this.work;
          if (!e) return b;
          let t = e.pullRequestUrl,
            n = e.worktreePath;
          return v`
      <wa-dropdown-item
        class="session-menu__item"
        value="open-pr"
        data-shortcut="g"
        aria-keyshortcuts="G"
        ?disabled=${this.disabled || !t}
      >
        <span slot="icon" class="session-menu__icon" aria-hidden="true"
          >${j.gitPullRequest}</span
        >
        <span class="session-menu__text">${k(`sessionsView.openPullRequest`)}</span>
        ${N(`g`)}
      </wa-dropdown-item>
      <wa-dropdown-item class="session-menu__item" ?disabled=${this.disabled || !n}>
        <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.externalLink}</span>
        <span class="session-menu__text">${k(`sessionsView.openInEditorMenu`)}</span>
        ${n ? this.renderEditorSubmenu() : b}
      </wa-dropdown-item>
      <div class="session-menu__separator" role="separator"></div>
    `;
        }
        renderEditorSubmenu() {
          return v`
      ${Xe.map(
        (e) => v`
          <wa-dropdown-item
            slot="submenu"
            class="session-menu__item"
            value=${`open-in:${e}`}
            ?disabled=${this.disabled}
          >
            <span class="session-menu__text">${vt[e]}</span>
          </wa-dropdown-item>
        `,
      )}
    `;
        }
        renderGroupSubmenu() {
          let e = this.session,
            t = 1,
            n = () => (t <= 9 ? String(t++) : null),
            r = (e, t, r, i = !0) => {
              let a = n();
              return v`
        <wa-dropdown-item
          slot="submenu"
          class="session-menu__item"
          value=${r}
          role=${i ? `menuitemradio` : `menuitem`}
          aria-checked=${i ? String(t) : b}
          ${i ? ie((e) => Dn(e, t)) : b}
          data-shortcut=${a ?? b}
          aria-keyshortcuts=${a ?? b}
          ?disabled=${this.disabled}
        >
          <span class="session-menu__text">${e}</span>
          ${
            i && t
              ? v`<span slot="details" class="session-menu__check" aria-hidden="true"
                >${j.check}</span
              >`
              : b
          }
          ${a ? N(a) : b}
        </wa-dropdown-item>
      `;
            };
          return v`
      ${this.groups.map((t) => r(t, e.category === t, `move-to-group:${encodeURIComponent(t)}`))}
      ${e.category ? r(k(`sessionsView.removeFromGroup`), !1, `move-to-group:`, !1) : b}
      ${r(k(`sessionsView.newGroup`), !1, `new-group`, !1)}
    `;
        }
        render() {
          let e = Math.max(8, Math.min(this.anchor.x, window.innerWidth - 240 - 8)),
            t = Math.max(8, Math.min(this.anchor.y, window.innerHeight - 460 - 8)),
            n = this.session,
            r = this.selectionCount > 1,
            i = String(this.selectionCount),
            a = r
              ? k(`chat.sidebar.sessionMenuMany`, { count: i })
              : k(`chat.sidebar.sessionMenu`, { session: n.label });
          return le(
            this.anchor,
            v`<wa-dropdown
        class="session-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${a}
        @wa-select=${this.handleSelect}
        @wa-after-hide=${this.handleAfterHide}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${a}
          style="position: fixed; left: ${e}px; top: ${t}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        ${
          !r && this.canOpenChat
            ? v`
              <wa-dropdown-item
                class="session-menu__item"
                value="open-chat"
                data-shortcut="o"
                aria-keyshortcuts="O"
                ?disabled=${this.disabled}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true"
                  >${j.messageSquare}</span
                >
                <span class="session-menu__text">${k(`sessionsView.openChat`)}</span>
                ${N(`o`)}
              </wa-dropdown-item>
            `
            : b
        }
        ${r ? b : this.renderWorkItems()}
        ${
          r
            ? b
            : v`
              <wa-dropdown-item
                class="session-menu__item"
                value="toggle-pin"
                data-shortcut="p"
                aria-keyshortcuts="P"
                ?disabled=${this.disabled || n.archived}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true"
                  >${n.pinned ? j.pinOff : j.pin}</span
                >
                <span class="session-menu__text"
                  >${n.pinned ? k(`sessionsView.unpinSession`) : k(`sessionsView.pinSession`)}</span
                >
                ${N(`p`)}
              </wa-dropdown-item>
            `
        }
        <wa-dropdown-item
          class="session-menu__item"
          value="toggle-unread"
          data-shortcut="u"
          aria-keyshortcuts="U"
          ?disabled=${this.disabled}
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${n.unread ? j.eye : j.circle}</span
          >
          <span class="session-menu__text"
            >${r ? (n.unread ? k(`sessionsView.markReadCount`, { count: i }) : k(`sessionsView.markUnreadCount`, { count: i })) : n.unread ? k(`sessionsView.markRead`) : k(`sessionsView.markUnread`)}</span
          >
          ${N(`u`)}
        </wa-dropdown-item>
        ${
          r
            ? b
            : v`
              <wa-dropdown-item
                class="session-menu__item"
                value="rename"
                data-shortcut="r"
                aria-keyshortcuts="R"
                ?disabled=${this.disabled}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.edit}</span>
                <span class="session-menu__text">${k(`sessionsView.renameSessionMenu`)}</span>
                ${N(`r`)}
              </wa-dropdown-item>
              <wa-dropdown-item
                class="session-menu__item"
                value="fork"
                data-shortcut="f"
                aria-keyshortcuts="F"
                ?disabled=${this.disabled || this.forkDisabled}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.copy}</span>
                <span class="session-menu__text">${k(`sessionsView.forkSession`)}</span>
                ${N(`f`)}
              </wa-dropdown-item>
            `
        }
        ${
          !r && this.workboard
            ? v`
              <wa-dropdown-item
                class="session-menu__item"
                value="workboard"
                data-shortcut="w"
                aria-keyshortcuts="W"
                ?disabled=${this.disabled || this.workboard.busy}
              >
                <span slot="icon" class="session-menu__icon" aria-hidden="true"
                  >${this.workboard.captured ? j.check : j.plus}</span
                >
                <span class="session-menu__text"
                  >${this.workboard.captured ? k(`sessionsView.openWorkboardCard`) : k(`sessionsView.addToWorkboard`)}</span
                >
                ${N(`w`)}
              </wa-dropdown-item>
            `
            : b
        }
        <wa-dropdown-item class="session-menu__item" ?disabled=${this.disabled}>
          <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.folder}</span>
          <span class="session-menu__text"
            >${r ? k(`sessionsView.moveToGroupMenuCount`, { count: i }) : k(`sessionsView.moveToGroupMenu`)}</span
          >
          ${this.renderGroupSubmenu()}
        </wa-dropdown-item>
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item
          class="session-menu__item"
          value="toggle-archived"
          data-shortcut="a"
          aria-keyshortcuts="A"
          ?disabled=${this.disabled || (!n.archived && !this.archiveAllowed)}
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${n.archived ? j.archiveRestore : j.archive}</span
          >
          <span class="session-menu__text"
            >${r ? k(`sessionsView.archiveSessionCount`, { count: i }) : n.archived ? k(`sessionsView.restoreSession`) : k(`sessionsView.archiveSession`)}</span
          >
          ${N(`a`)}
        </wa-dropdown-item>
        <wa-dropdown-item
          class="session-menu__item session-menu__item--destructive"
          value="delete"
          variant="danger"
          data-shortcut="d"
          aria-keyshortcuts="D"
          ?disabled=${this.disabled || !(n.archived || this.archiveAllowed)}
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.trash}</span>
          <span class="session-menu__text"
            >${r ? k(`sessionsView.deleteSessionCount`, { count: i }) : k(`sessionsView.deleteSessionMenu`)}</span
          >
          ${N(`d`)}
        </wa-dropdown-item>
      </wa-dropdown>`,
          );
        }
      }),
      i([_({ attribute: !1 })], F.prototype, `session`, void 0),
      i([_({ attribute: !1 })], F.prototype, `selectionCount`, void 0),
      i([_({ attribute: !1 })], F.prototype, `anchor`, void 0),
      i([_({ attribute: !1 })], F.prototype, `trigger`, void 0),
      i([_({ attribute: !1 })], F.prototype, `disabled`, void 0),
      i([_({ attribute: !1 })], F.prototype, `forkDisabled`, void 0),
      i([_({ attribute: !1 })], F.prototype, `archiveAllowed`, void 0),
      i([_({ attribute: !1 })], F.prototype, `groups`, void 0),
      i([_({ attribute: !1 })], F.prototype, `canOpenChat`, void 0),
      i([_({ attribute: !1 })], F.prototype, `work`, void 0),
      i([_({ attribute: !1 })], F.prototype, `workboard`, void 0),
      i([_({ attribute: !1 })], F.prototype, `onAction`, void 0),
      i([_({ attribute: !1 })], F.prototype, `onClose`, void 0),
      customElements.get(`openclaw-session-menu`) ||
        customElements.define(`openclaw-session-menu`, F));
  });
function Fn() {
  return ((Hn += 1), `openclaw-tooltip-${Hn}`);
}
function In(e) {
  return e.replace(/\s+/gu, ` `).trim();
}
var Ln,
  Rn,
  zn,
  Bn,
  Vn,
  Hn,
  Un,
  Wn,
  I = e(() => {
    (ee(),
      y(),
      h(),
      E(),
      t(),
      (Ln = 150),
      (Rn = 450),
      (zn = 900),
      (Bn = 300),
      (Vn = 10),
      (Hn = 0),
      (Un = class extends Et {
        constructor(...e) {
          (super(...e),
            (this.delay = Ln),
            (this.skipDelay = Bn),
            (this.touchDelay = Rn),
            (this.activeTooltip = null),
            (this.delayed = !0),
            (this.skipDelayTimer = null));
        }
        connectedCallback() {
          (super.connectedCallback(), (this.style.display = `contents`));
        }
        disconnectedCallback() {
          let e = this.activeTooltip;
          ((this.activeTooltip = null),
            e?.closeFromProvider(),
            this.clearSkipDelayTimer(),
            (this.delayed = !0),
            super.disconnectedCallback());
        }
        openTooltip(e) {
          (this.activeTooltip && this.activeTooltip !== e && this.activeTooltip.closeFromProvider(),
            (this.activeTooltip = e),
            (this.delayed = !1),
            this.clearSkipDelayTimer());
        }
        closeTooltip(e) {
          if (this.activeTooltip === e) {
            if (((this.activeTooltip = null), this.clearSkipDelayTimer(), this.skipDelay <= 0)) {
              this.delayed = !0;
              return;
            }
            this.skipDelayTimer = window.setTimeout(() => {
              ((this.skipDelayTimer = null), (this.delayed = !0));
            }, this.skipDelay);
          }
        }
        shouldDelayOpen() {
          return this.delayed;
        }
        clearSkipDelayTimer() {
          this.skipDelayTimer !== null &&
            (window.clearTimeout(this.skipDelayTimer), (this.skipDelayTimer = null));
        }
        render() {
          return v`<slot></slot>`;
        }
      }),
      i([_({ type: Number })], Un.prototype, `delay`, void 0),
      i([_({ type: Number })], Un.prototype, `skipDelay`, void 0),
      i([_({ type: Number })], Un.prototype, `touchDelay`, void 0),
      (Wn = class extends Et {
        constructor(...e) {
          (super(...e),
            (this.content = ``),
            (this.triggerElement = null),
            (this.openTimer = null),
            (this.touchTimer = null),
            (this.touchCloseTimer = null),
            (this.touchStart = null),
            (this.suppressPointerFocus = !1),
            (this.describedBy = null),
            (this.descriptionCaptured = !1),
            (this.descriptionElement = null),
            (this.tooltipProvider = null),
            (this.tooltipId = Fn()),
            (this.descriptionId = `${this.tooltipId}-description`),
            (this.handlePointerEnter = (e) => {
              e.pointerType !== `touch` && this.scheduleOpen();
            }),
            (this.handlePointerLeave = () => this.close()),
            (this.handlePointerDown = (e) => {
              if (e.pointerType !== `touch`) {
                ((this.suppressPointerFocus = !0),
                  document.removeEventListener(`pointerup`, this.handleDocumentPointerUp),
                  document.addEventListener(`pointerup`, this.handleDocumentPointerUp, {
                    once: !0,
                  }),
                  this.close());
                return;
              }
              (this.clearTimers(),
                (this.touchStart = { x: e.clientX, y: e.clientY }),
                (this.touchTimer = window.setTimeout(() => {
                  ((this.touchTimer = null), this.show());
                }, this.touchDelay)));
            }),
            (this.handlePointerMove = (e) => {
              e.pointerType === `touch` &&
                this.touchStart &&
                Math.hypot(e.clientX - this.touchStart.x, e.clientY - this.touchStart.y) > Vn &&
                this.close();
            }),
            (this.handlePointerUp = (e) => {
              if (e.pointerType !== `touch`) {
                this.handleDocumentPointerUp();
                return;
              }
              (this.clearTouchTimer(),
                (this.touchStart = null),
                this.webAwesomeTooltip?.open &&
                  (this.touchCloseTimer = window.setTimeout(() => this.close(), zn)));
            }),
            (this.handlePointerCancel = () => {
              (this.handleDocumentPointerUp(), this.close());
            }),
            (this.handleFocusIn = () => {
              this.suppressPointerFocus || this.show();
            }),
            (this.handleFocusOut = () => this.close()),
            (this.handleClick = () => this.close()),
            (this.handleDocumentPointerUp = () => {
              (document.removeEventListener(`pointerup`, this.handleDocumentPointerUp),
                (this.suppressPointerFocus = !1));
            }),
            (this.handleKeyDown = (e) => {
              e.key === `Escape` && this.close();
            }));
        }
        static {
          this.styles = ce`
    :host {
      display: contents;
    }

    wa-tooltip {
      --max-width: min(260px, calc(100vw - 16px));
      font-family: var(--font-body);
    }

    wa-tooltip::part(body) {
      padding: 7px 9px;
      border: 1px solid color-mix(in srgb, var(--border-strong) 84%, transparent);
      border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--card) 94%, black 6%);
      box-shadow: var(--shadow-md);
      color: var(--text);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.35;
      text-align: center;
      overflow-wrap: anywhere;
      white-space: pre-line;
    }
  `;
        }
        connectedCallback() {
          (super.connectedCallback(),
            (this.tooltipProvider = this.closest(`openclaw-tooltip-provider`)),
            (this.style.display = `contents`));
        }
        updated() {
          (this.attachTrigger(), this.syncWebAwesomeTooltip());
        }
        disconnectedCallback() {
          (this.close(),
            (this.tooltipProvider = null),
            this.detachTrigger(),
            super.disconnectedCallback());
        }
        get provider() {
          return this.tooltipProvider ?? this.closest(`openclaw-tooltip-provider`);
        }
        get hoverDelay() {
          return Math.max(0, this.provider?.delay ?? Ln);
        }
        get touchDelay() {
          return Math.max(0, this.provider?.touchDelay ?? Rn);
        }
        attachTrigger() {
          let e = this.renderRoot
            .querySelector(`slot`)
            ?.assignedElements({ flatten: !0 })
            .find((e) => e instanceof HTMLElement);
          e !== this.triggerElement &&
            (this.close(),
            this.detachTrigger(),
            e &&
              ((this.triggerElement = e),
              e.addEventListener(`pointerenter`, this.handlePointerEnter),
              e.addEventListener(`pointerleave`, this.handlePointerLeave),
              e.addEventListener(`pointerdown`, this.handlePointerDown),
              e.addEventListener(`pointermove`, this.handlePointerMove),
              e.addEventListener(`pointerup`, this.handlePointerUp),
              e.addEventListener(`pointercancel`, this.handlePointerCancel),
              e.addEventListener(`focusin`, this.handleFocusIn),
              e.addEventListener(`focusout`, this.handleFocusOut),
              e.addEventListener(`click`, this.handleClick, !0),
              e.addEventListener(`keydown`, this.handleKeyDown),
              this.syncDescription(),
              this.syncWebAwesomeTooltip()));
        }
        detachTrigger() {
          let e = this.triggerElement;
          e &&
            (e.removeEventListener(`pointerenter`, this.handlePointerEnter),
            e.removeEventListener(`pointerleave`, this.handlePointerLeave),
            e.removeEventListener(`pointerdown`, this.handlePointerDown),
            e.removeEventListener(`pointermove`, this.handlePointerMove),
            e.removeEventListener(`pointerup`, this.handlePointerUp),
            e.removeEventListener(`pointercancel`, this.handlePointerCancel),
            e.removeEventListener(`focusin`, this.handleFocusIn),
            e.removeEventListener(`focusout`, this.handleFocusOut),
            e.removeEventListener(`click`, this.handleClick, !0),
            e.removeEventListener(`keydown`, this.handleKeyDown),
            document.removeEventListener(`pointerup`, this.handleDocumentPointerUp),
            (this.suppressPointerFocus = !1),
            this.restoreDescription(),
            (this.triggerElement = null));
        }
        syncWebAwesomeTooltip() {
          let e = this.webAwesomeTooltip;
          e && ((e.anchor = this.triggerElement), (e.showDelay = 0), (e.hideDelay = 0));
        }
        scheduleOpen() {
          if (this.webAwesomeTooltip?.open || this.openTimer !== null || this.isRedundant()) return;
          let e = this.provider?.shouldDelayOpen() === !1 ? 0 : this.hoverDelay;
          this.openTimer = window.setTimeout(() => {
            ((this.openTimer = null), this.show());
          }, e);
        }
        show() {
          let e = this.webAwesomeTooltip;
          !e ||
            !this.triggerElement ||
            !this.content ||
            this.isRedundant() ||
            (this.clearTimers(),
            this.provider?.openTooltip(this),
            this.syncDescription(),
            (e.open = !0));
        }
        close() {
          (this.clearTimers(),
            (this.touchStart = null),
            this.webAwesomeTooltip?.open && (this.webAwesomeTooltip.open = !1),
            this.provider?.closeTooltip(this));
        }
        closeFromProvider() {
          (this.clearTimers(), this.webAwesomeTooltip?.open && (this.webAwesomeTooltip.open = !1));
        }
        isRedundant() {
          let e = this.triggerElement;
          if (!e) return !1;
          let t = In(this.content),
            n = In(e.textContent ?? ``),
            r = [e, ...e.querySelectorAll(`*`)].some(
              (e) => e instanceof HTMLElement && e.scrollWidth > e.clientWidth,
            );
          return !!(t && n && n.includes(t) && !r);
        }
        syncDescription() {
          let e = this.triggerElement;
          if (!e) return;
          let t = e.getAttribute(`aria-describedby`);
          if (
            ((this.descriptionCaptured ||= ((this.describedBy = t), !0)), !this.descriptionElement)
          ) {
            let e = document.createElement(`span`);
            ((e.id = this.descriptionId),
              (e.hidden = !0),
              this.append(e),
              (this.descriptionElement = e));
          }
          this.descriptionElement.textContent = this.content;
          let n = new Set((t ?? ``).split(/\s+/u).filter(Boolean));
          (n.add(this.descriptionId), e.setAttribute(`aria-describedby`, [...n].join(` `)));
        }
        restoreDescription() {
          this.triggerElement &&
            (this.describedBy
              ? this.triggerElement.setAttribute(`aria-describedby`, this.describedBy)
              : this.triggerElement.removeAttribute(`aria-describedby`),
            this.descriptionElement?.remove(),
            (this.descriptionElement = null),
            (this.describedBy = null),
            (this.descriptionCaptured = !1));
        }
        clearTouchTimer() {
          this.touchTimer !== null &&
            (window.clearTimeout(this.touchTimer), (this.touchTimer = null));
        }
        clearTimers() {
          (this.openTimer !== null &&
            (window.clearTimeout(this.openTimer), (this.openTimer = null)),
            this.clearTouchTimer(),
            this.touchCloseTimer !== null &&
              (window.clearTimeout(this.touchCloseTimer), (this.touchCloseTimer = null)));
        }
        render() {
          return v`
      <slot @slotchange=${() => this.attachTrigger()}></slot>
      <wa-tooltip id=${this.tooltipId} trigger="manual">${this.content}</wa-tooltip>
    `;
        }
      }),
      i([_()], Wn.prototype, `content`, void 0),
      i([ae(`wa-tooltip`)], Wn.prototype, `webAwesomeTooltip`, void 0),
      customElements.get(`openclaw-tooltip-provider`) ||
        customElements.define(`openclaw-tooltip-provider`, Un),
      customElements.get(`openclaw-tooltip`) || customElements.define(`openclaw-tooltip`, Wn));
  }),
  L,
  Gn = e(() => {
    (y(),
      h(),
      A(),
      E(),
      M(),
      I(),
      t(),
      (L = class extends T {
        constructor(...e) {
          (super(...e),
            (this.agentName = ``),
            (this.avatarUrl = null),
            (this.avatarText = ``),
            (this.connected = !1),
            (this.statusLabel = ``),
            (this.subtitle = ``),
            (this.menuOpen = !1),
            (this.menuUnread = !1),
            (this.newSessionDisabled = !1));
        }
        render() {
          return v`
      <div class="sidebar-agent-chip">
        <button
          type="button"
          class="sidebar-agent-chip__main ${this.menuOpen ? `sidebar-agent-chip__main--open` : ``}"
          aria-haspopup="menu"
          aria-expanded=${String(this.menuOpen)}
          aria-label="${this.agentName} · ${k(`agentChip.menuLabel`)}"
          @click=${(e) => this.onToggleMenu?.(e.currentTarget)}
        >
          <span class="sidebar-agent-chip__avatar">
            ${
              this.avatarUrl
                ? v`<img
                  src=${this.avatarUrl}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />`
                : v`<span class="sidebar-agent-chip__avatar-text" aria-hidden="true"
                  >${this.avatarText}</span
                >`
            }
            <span
              class="sidebar-agent-chip__presence ${this.connected ? `sidebar-connection-status--online` : `sidebar-connection-status--offline`}"
              role="img"
              aria-live="polite"
              aria-label=${this.statusLabel}
              title=${this.statusLabel}
            ></span>
          </span>
          <span class="sidebar-agent-chip__text">
            <span class="sidebar-agent-chip__name">${this.agentName}</span>
            ${this.subtitle ? v`<span class="sidebar-agent-chip__subtitle">${this.subtitle}</span>` : b}
          </span>
          ${
            this.menuUnread && !this.menuOpen
              ? v`<span
                class="session-unread-dot sidebar-agent-chip__menu-unread"
                role="img"
                aria-label=${k(`sessionsView.unread`)}
              ></span>`
              : b
          }
        </button>
        <openclaw-tooltip .content=${k(`chat.runControls.newSession`)}>
          <button
            type="button"
            class="sidebar-agent-chip__action"
            aria-label=${k(`chat.runControls.newSession`)}
            ?disabled=${this.newSessionDisabled}
            @click=${() => this.onNewSession?.()}
          >
            ${j.plus}
          </button>
        </openclaw-tooltip>
      </div>
    `;
        }
      }),
      i([_({ attribute: !1 })], L.prototype, `agentName`, void 0),
      i([_({ attribute: !1 })], L.prototype, `avatarUrl`, void 0),
      i([_({ attribute: !1 })], L.prototype, `avatarText`, void 0),
      i([_({ attribute: !1 })], L.prototype, `connected`, void 0),
      i([_({ attribute: !1 })], L.prototype, `statusLabel`, void 0),
      i([_({ attribute: !1 })], L.prototype, `subtitle`, void 0),
      i([_({ attribute: !1 })], L.prototype, `menuOpen`, void 0),
      i([_({ attribute: !1 })], L.prototype, `menuUnread`, void 0),
      i([_({ attribute: !1 })], L.prototype, `newSessionDisabled`, void 0),
      i([_({ attribute: !1 })], L.prototype, `onNewSession`, void 0),
      i([_({ attribute: !1 })], L.prototype, `onToggleMenu`, void 0),
      customElements.get(`openclaw-sidebar-agent-chip`) ||
        customElements.define(`openclaw-sidebar-agent-chip`, L));
  });
function Kn(e) {
  return `${Qn}${Yt(e)}`;
}
function qn(e) {
  let t = w();
  if (!t) return {};
  try {
    let n = JSON.parse(t.getItem(Kn(e)) ?? `null`);
    if (!n || typeof n != `object`) return {};
    let r = {};
    for (let e of Zn) {
      let t = n[e];
      typeof t == `string` && (r[e] = t);
    }
    return r;
  } catch {
    return {};
  }
}
function Jn(e, t) {
  let n = w();
  if (n)
    try {
      Object.keys(t).length === 0 ? n.removeItem(Kn(e)) : n.setItem(Kn(e), JSON.stringify(t));
    } catch {}
}
function Yn(e, t, n) {
  let r = { ...qn(e), [t]: n };
  return (Jn(e, r), r);
}
function Xn(e, t) {
  let n = {},
    r = !1;
  for (let i of Zn) {
    let a = e[i];
    a !== void 0 && (t.some((e) => e.kind === i && e.signature === a) ? (n[i] = a) : (r = !0));
  }
  return r ? n : e;
}
var Zn,
  Qn,
  $n = e(() => {
    (en(),
      Le(),
      (Zn = [`cronFailed`, `cronOverdue`, `modelAuthExpired`, `modelAuthExpiring`]),
      (Qn = `openclaw.control.sidebarAttention.v1:`));
  });
function er(e) {
  let t = [],
    n = (e) =>
      e.toSorted().join(`
`),
    r = e.cronJobs.filter(gt);
  r.length > 0 &&
    t.push({
      kind: `cronFailed`,
      severity: `error`,
      icon: `clock`,
      label: k(`attention.cronFailed`, { count: String(r.length) }),
      routeId: `cron`,
      signature: n(r.map((e) => e.id)),
    });
  let i = e.cronJobs.filter(
    (t) => t.enabled && t.state?.nextRunAtMs != null && e.now - t.state.nextRunAtMs > tr,
  );
  i.length > 0 &&
    t.push({
      kind: `cronOverdue`,
      severity: `warning`,
      icon: `clock`,
      label: k(`attention.cronOverdue`, { count: String(i.length) }),
      routeId: `cron`,
      signature: n(i.map((e) => `${e.id}@${e.state?.nextRunAtMs}`)),
    });
  let a = (e.modelAuthStatus?.providers ?? []).filter(dt),
    o = a.filter((e) => e.status === `expired` || e.status === `missing`);
  o.length > 0 &&
    t.push({
      kind: `modelAuthExpired`,
      severity: `error`,
      icon: `plug`,
      label: k(`attention.modelAuthExpired`, { providers: o.map((e) => e.displayName).join(`, `) }),
      routeId: `model-providers`,
      signature: n(o.map((e) => e.provider)),
    });
  let s = a.filter((e) => e.status === `expiring`);
  return (
    s.length > 0 &&
      t.push({
        kind: `modelAuthExpiring`,
        severity: `warning`,
        icon: `plug`,
        label: k(`attention.modelAuthExpiring`, {
          providers: s.map((e) => `${e.displayName} (${e.expiry?.label ?? `soon`})`).join(`, `),
        }),
        routeId: `model-providers`,
        signature: n(s.map((e) => e.provider)),
      }),
    t
  );
}
var tr,
  nr,
  rr,
  R,
  ir = e(() => {
    (p(),
      y(),
      h(),
      sn(),
      A(),
      Ue(),
      Pe(),
      yt(),
      E(),
      Ze(),
      M(),
      $n(),
      t(),
      (tr = 3e5),
      (nr = 6e4),
      (rr = 10 * 6e4),
      (R = class extends T {
        constructor(...e) {
          (super(...e),
            (this.cronJobs = []),
            (this.modelAuthStatus = null),
            (this.dismissed = {}),
            (this.loadedClient = null),
            (this.loadedAtMs = 0),
            (this.dismissedScope = null),
            (this.idleRefreshTimer = null),
            (this.subscriptions = new qe(this).effect(
              () => this.context?.gateway,
              (e) => (this.synchronize(e), e.subscribe(() => this.synchronize(e))),
            )),
            (this.syncDismissalsFromStorage = (e) => {
              this.dismissedScope &&
                (e.key === null || e.key === Kn(this.dismissedScope)) &&
                (this.dismissed = qn(this.dismissedScope));
            }),
            (this.refreshIfStale = () => {
              if (document.visibilityState !== `visible`) return;
              let e = this.context?.gateway;
              e &&
                Date.now() - this.loadedAtMs >= nr &&
                ((this.loadedClient = null), this.synchronize(e));
            }));
        }
        connectedCallback() {
          (super.connectedCallback(),
            document.addEventListener(`visibilitychange`, this.refreshIfStale),
            globalThis.addEventListener(`storage`, this.syncDismissalsFromStorage),
            (this.idleRefreshTimer = globalThis.setInterval(this.refreshIfStale, rr)));
        }
        disconnectedCallback() {
          (document.removeEventListener(`visibilitychange`, this.refreshIfStale),
            globalThis.removeEventListener(`storage`, this.syncDismissalsFromStorage),
            this.idleRefreshTimer !== null &&
              (globalThis.clearInterval(this.idleRefreshTimer), (this.idleRefreshTimer = null)),
            this.subscriptions.clear(),
            (this.loadedClient = null),
            super.disconnectedCallback());
        }
        synchronize(e) {
          let t = e.snapshot,
            n = e.connection.gatewayUrl;
          if (
            (n &&
              n !== this.dismissedScope &&
              ((this.dismissedScope = n), (this.dismissed = qn(n))),
            !t.connected || !t.client)
          ) {
            ((this.loadedClient = null), (this.cronJobs = []), (this.modelAuthStatus = null));
            return;
          }
          t.client !== this.loadedClient &&
            ((this.loadedClient = t.client), this.load(e, t.client));
        }
        async load(e, t) {
          let n = () =>
              this.isConnected &&
              this.loadedClient === t &&
              e.snapshot.client === t &&
              e.snapshot.connected,
            r = kt({ client: t, connected: !0 });
          (await Promise.allSettled([
            xe(r).then(() => {
              n() && (this.cronJobs = r.cronJobs);
            }),
            tt(t, {})
              .catch(() => null)
              .then((e) => {
                n() && (this.modelAuthStatus = e);
              }),
          ]),
            n() && ((this.loadedAtMs = Date.now()), this.pruneAfterRefresh()));
        }
        pruneAfterRefresh() {
          if (!this.dismissedScope) return;
          let e = er({
              cronJobs: this.cronJobs,
              modelAuthStatus: this.modelAuthStatus,
              now: Date.now(),
            }),
            t = qn(this.dismissedScope),
            n = Xn(t, e);
          (n !== t && Jn(this.dismissedScope, n), (this.dismissed = n));
        }
        dismiss(e) {
          this.dismissedScope && (this.dismissed = Yn(this.dismissedScope, e.kind, e.signature));
        }
        render() {
          if (!this.context?.gateway.snapshot.connected) return b;
          let e = er({
            cronJobs: this.cronJobs,
            modelAuthStatus: this.modelAuthStatus,
            now: Date.now(),
          }).filter((e) => this.dismissed[e.kind] !== e.signature);
          return e.length === 0
            ? b
            : v`
      <div class="sidebar-attention" role="status">
        ${e.map(
          (e) => v`
            <div class="sidebar-attention__item sidebar-attention__item--${e.severity}">
              <button
                type="button"
                class="sidebar-attention__open"
                title=${e.label}
                @click=${() => this.onNavigate?.(e.routeId)}
              >
                <span class="sidebar-attention__icon" aria-hidden="true">${j[e.icon]}</span>
                <span class="sidebar-attention__label">${e.label}</span>
              </button>
              <button
                type="button"
                class="sidebar-attention__dismiss"
                title=${k(`common.dismiss`)}
                aria-label=${k(`common.dismiss`)}
                @click=${() => this.dismiss(e)}
              >
                ${j.x}
              </button>
            </div>
          `,
        )}
      </div>
    `;
        }
      }),
      i([m({ context: Ht, subscribe: !0 })], R.prototype, `context`, void 0),
      i([g()], R.prototype, `cronJobs`, void 0),
      i([g()], R.prototype, `modelAuthStatus`, void 0),
      i([g()], R.prototype, `dismissed`, void 0),
      i([_({ attribute: !1 })], R.prototype, `onNavigate`, void 0),
      customElements.get(`openclaw-sidebar-attention`) ||
        customElements.define(`openclaw-sidebar-attention`, R));
  });
function ar(e) {
  return typeof e == `string` && e.trim() ? e.trim() : null;
}
function or(e) {
  let t = ar(e)?.toLowerCase() ?? null;
  return t && fr.test(t) ? t : null;
}
function sr(e) {
  let t = ar(e);
  return t && t !== `HEAD` ? t.slice(0, 100) : null;
}
function cr(e) {
  let t = ar(e);
  if (!t || !pr.test(t)) return null;
  let n = new Date(t);
  if (Number.isNaN(n.getTime())) return null;
  let r = t.replace(/(?:\.(\d{1,3}))?Z$/u, (e, t) => `.${String(t ?? ``).padEnd(3, `0`)}Z`);
  return n.toISOString() === r ? n.toISOString() : null;
}
function lr(e) {
  return ar(e)?.replace(/[^a-zA-Z0-9._-]+/g, `-`)?.slice(0, mr) || `dev`;
}
function ur(e) {
  return lr([e.version, e.commit?.slice(0, 12), e.builtAt].filter((e) => !!e).join(`-`));
}
function dr(e) {
  let t = e && typeof e == `object` ? e : {},
    n = {
      version: ((e) => (typeof e == `string` && e.trim() ? e.trim() : null))(t.version),
      commit: or(t.commit),
      builtAt: cr(t.builtAt),
    };
  return {
    ...n,
    branch: sr(t.branch),
    dirty: typeof t.dirty == `boolean` ? t.dirty : null,
    buildId: lr(t.buildId ?? ur(n)),
  };
}
var fr,
  pr,
  mr,
  hr = e(() => {
    ((fr = /^[0-9a-f]{40}$/u),
      (pr = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/u),
      (mr = 96));
  }),
  gr,
  z,
  _r = e(() => {
    (hr(),
      (gr = {
        version: `2026.7.2`,
        commit: null,
        builtAt: `2026-07-18T14:14:46.065Z`,
        branch: null,
        dirty: null,
        buildId: `2026.7.2-2026-07-18T14-14-46.065Z`,
      }),
      (z = dr(gr)));
  });
function vr(e, t) {
  if (!e.commit) return null;
  let n =
      e.branch && e.branch !== `main`
        ? `${e.branch.length > yr ? `${e.branch.slice(0, yr)}…` : e.branch}@`
        : ``,
    i = `${e.commit.slice(0, 7)}${e.dirty === !0 ? `*` : ``}`;
  if (!e.builtAt) return `${n}${i}`;
  let a = Date.parse(e.builtAt);
  return Number.isNaN(a) ? `${n}${i}` : `${n}${i} · ${r(Math.max(0, t - a), { suffix: !1 })}`;
}
var yr,
  br = e(() => {
    (Ye(), (yr = 14));
  });
function xr(e) {
  return (
    !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
  );
}
var Sr,
  Cr = e(() => {
    (y(),
      h(),
      Vt(),
      _r(),
      A(),
      E(),
      Dt(),
      br(),
      I(),
      t(),
      (Sr = class extends T {
        constructor(...e) {
          (super(...e),
            (this.basePath = ``),
            (this.gatewayVersion = null),
            (this.polling = new ct(this, 6e4, () => this.requestUpdate())));
        }
        render() {
          let e = vr(z, Date.now());
          return e
            ? v`
      <openclaw-tooltip .content=${[
        [z.version ? `v${z.version}` : null, z.branch, z.dirty === !0 ? `dirty` : null]
          .filter((e) => e !== null)
          .join(` · `),
        z.commit,
        z.builtAt ? `${k(`aboutPage.built`)}: ${z.builtAt}` : null,
        this.gatewayVersion ? `${k(`aboutPage.gatewayVersion`)}: ${this.gatewayVersion}` : null,
      ].filter((e) => !!e).join(`
`)}>
        <a
          class="sidebar-footer-build"
          href=${D(`about`, this.basePath)}
          aria-label=${k(`aboutPage.artifactDetails`)}
          @click=${(e) => {
            xr(e) && (e.preventDefault(), this.onNavigate?.(`about`));
          }}
          >${e}</a
        >
      </openclaw-tooltip>
    `
            : b;
        }
      }),
      i([_({ attribute: !1 })], Sr.prototype, `basePath`, void 0),
      i([_({ attribute: !1 })], Sr.prototype, `gatewayVersion`, void 0),
      i([_({ attribute: !1 })], Sr.prototype, `onNavigate`, void 0),
      globalThis.customElements &&
        !customElements.get(`openclaw-sidebar-build-chip`) &&
        customElements.define(`openclaw-sidebar-build-chip`, Sr));
  }),
  B,
  wr = e(() => {
    (y(),
      h(),
      A(),
      E(),
      M(),
      wn(),
      P(),
      t(),
      (B = class extends st {
        constructor(...e) {
          (super(...e),
            (this.x = 0),
            (this.y = 0),
            (this.trigger = null),
            (this.onAction = () => {}),
            (this.onClose = () => {}),
            (this.handleDocumentKeydown = (e) => {
              if (e.key === `Escape`) {
                (e.preventDefault(), e.stopPropagation(), this.trigger?.focus(), this.onClose());
                return;
              }
              Cn(this, e);
            }));
        }
        connectedCallback() {
          (super.connectedCallback(),
            document.addEventListener(`keydown`, this.handleDocumentKeydown, !0));
        }
        disconnectedCallback() {
          (document.removeEventListener(`keydown`, this.handleDocumentKeydown, !0),
            super.disconnectedCallback());
        }
        firstUpdated() {
          let e = this.querySelector(`wa-dropdown`);
          Promise.resolve(e?.updateComplete).then(() => {
            this.querySelector(`wa-dropdown-item:not([disabled])`)?.focus();
          });
        }
        runAction(e) {
          (this.onClose(), this.onAction(e));
        }
        render() {
          let e = Math.max(8, Math.min(this.x, window.innerWidth - 264 - 8)),
            t = Math.max(8, Math.min(this.y, window.innerHeight - 136 - 8));
          return v`
      <wa-dropdown
        class="session-menu native-link-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${k(`nativeLinkMenu.label`)}
        @wa-select=${(e) => {
          e.preventDefault();
          let t = e.detail.item.value;
          t && (this.trigger?.focus(), this.runAction(t));
        }}
        @wa-after-hide=${() => {
          this.onClose();
        }}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${k(`nativeLinkMenu.label`)}
          style="position: fixed; left: ${e}px; top: ${t}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        <wa-dropdown-item
          class="session-menu__item"
          value="inline"
          data-shortcut="s"
          aria-keyshortcuts="S"
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${j.panelRightOpen}</span
          >
          <span class="session-menu__text">${k(`nativeLinkMenu.openInline`)}</span>
          ${N(`s`)}
        </wa-dropdown-item>
        <wa-dropdown-item
          class="session-menu__item"
          value="external"
          data-shortcut="b"
          aria-keyshortcuts="B"
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${j.externalLink}</span
          >
          <span class="session-menu__text">${k(`nativeLinkMenu.openExternal`)}</span>
          ${N(`b`)}
        </wa-dropdown-item>
        <div class="session-menu__separator" role="separator"></div>
        <wa-dropdown-item
          class="session-menu__item"
          value="copy"
          data-shortcut="c"
          aria-keyshortcuts="C"
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.copy}</span>
          <span class="session-menu__text">${k(`nativeLinkMenu.copy`)}</span>
          ${N(`c`)}
        </wa-dropdown-item>
      </wa-dropdown>
    `;
        }
      }),
      i([_({ attribute: !1 })], B.prototype, `x`, void 0),
      i([_({ attribute: !1 })], B.prototype, `y`, void 0),
      i([_({ attribute: !1 })], B.prototype, `trigger`, void 0),
      i([_({ attribute: !1 })], B.prototype, `onAction`, void 0),
      i([_({ attribute: !1 })], B.prototype, `onClose`, void 0),
      customElements.get(`openclaw-native-link-menu`) ||
        customElements.define(`openclaw-native-link-menu`, B));
  });
function Tr(e) {
  return `${e.latestVersion}\u0000${e.channel}`;
}
function Er(e) {
  try {
    let t = w()?.getItem(Or);
    if (!t) return !1;
    let n = JSON.parse(t);
    return n.latestVersion === e.latestVersion && n.channel === e.channel;
  } catch {
    return !1;
  }
}
function Dr(e) {
  try {
    w()?.setItem(
      Or,
      JSON.stringify({
        latestVersion: e.latestVersion,
        channel: e.channel,
        dismissedAtMs: Date.now(),
      }),
    );
  } catch {}
}
var Or,
  kr,
  Ar = e(() => {
    (y(),
      h(),
      Bt(),
      A(),
      E(),
      Le(),
      M(),
      t(),
      (Or = `openclaw:control-ui:update-banner-dismissed:v1`),
      (kr = class extends T {
        constructor(...e) {
          (super(...e),
            (this.updateAvailable = null),
            (this.updateRunning = !1),
            (this.onUpdate = () => void 0),
            (this.dismissedUpdateKey = null),
            (this.handleNativeUpdateDeclined = () => {
              this.updateAvailable && !this.updateRunning && this.onUpdate();
            }));
        }
        connectedCallback() {
          (super.connectedCallback(), window.addEventListener(Rt, this.handleNativeUpdateDeclined));
        }
        disconnectedCallback() {
          (window.removeEventListener(Rt, this.handleNativeUpdateDeclined),
            super.disconnectedCallback());
        }
        render() {
          let e = this.updateAvailable;
          if (
            !e ||
            e.latestVersion === e.currentVersion ||
            this.dismissedUpdateKey === Tr(e) ||
            Er(e)
          )
            return b;
          let t = this.updateRunning ? k(`chat.updating`) : k(`chat.sidebar.updateAvailable`);
          return v`
      <div class="sidebar-update-card" role="status" aria-live="polite">
        <button
          class="sidebar-update-card__action"
          type="button"
          ?disabled=${this.updateRunning}
          @click=${() => {
            Ut() || this.onUpdate();
          }}
        >
          <span class="sidebar-update-card__icon" aria-hidden="true">${j.download}</span>
          <span class="sidebar-update-card__copy">
            <span class="sidebar-update-card__title">${t}</span>
            <span class="sidebar-update-card__subtitle">v${e.latestVersion}</span>
          </span>
          <span class="sidebar-update-card__arrow" aria-hidden="true">${j.chevronRight}</span>
        </button>
        <button
          class="sidebar-update-card__dismiss"
          type="button"
          aria-label=${k(`chat.dismissUpdateBanner`)}
          @click=${() => {
            ((this.dismissedUpdateKey = Tr(e)), Dr(e));
          }}
        >
          ${j.x}
        </button>
      </div>
    `;
        }
      }),
      i([_({ attribute: !1 })], kr.prototype, `updateAvailable`, void 0),
      i([_({ attribute: !1 })], kr.prototype, `updateRunning`, void 0),
      i([_({ attribute: !1 })], kr.prototype, `onUpdate`, void 0),
      i([g()], kr.prototype, `dismissedUpdateKey`, void 0),
      customElements.get(`openclaw-sidebar-update-card`) ||
        customElements.define(`openclaw-sidebar-update-card`, kr));
  }),
  jr,
  Mr = e(() => {
    (y(),
      h(),
      A(),
      E(),
      M(),
      I(),
      t(),
      (jr = class extends T {
        constructor(...e) {
          (super(...e),
            (this.mode = `system`),
            (this.handleModeChange = (e) => {
              let t = this.mode === `system` ? `light` : this.mode === `light` ? `dark` : `system`;
              this.dispatchEvent(
                new CustomEvent(`theme-change`, {
                  detail: { mode: t, element: e.currentTarget },
                  bubbles: !0,
                  composed: !0,
                }),
              );
            }));
        }
        render() {
          let e = k(`common.colorModeOption`, {
            mode: k(
              this.mode === `system`
                ? `common.system`
                : this.mode === `light`
                  ? `common.light`
                  : `common.dark`,
            ),
          });
          return v`
      <openclaw-tooltip .content=${e}>
        <button
          type="button"
          class="theme-mode-toggle"
          aria-label=${e}
          @click=${this.handleModeChange}
        >
          ${this.mode === `system` ? j.monitor : this.mode === `light` ? j.sun : j.moon}
        </button>
      </openclaw-tooltip>
    `;
        }
      }),
      i([_({ attribute: !1 })], jr.prototype, `mode`, void 0),
      customElements.get(`openclaw-theme-mode-toggle`) ||
        customElements.define(`openclaw-theme-mode-toggle`, jr));
  });
function Nr(e) {
  return e.ctrlKey && !e.metaKey && !e.altKey && e.code === `Backquote`;
}
var Pr,
  Fr,
  Ir = e(() => {
    ((Pr = `openclaw:terminal-toggle`), (Fr = `openclaw:browser-toggle`));
  });
function Lr(e) {
  let { agents: t, activeId: n } = e,
    r = new Set(t.map((e) => C(e.id))),
    i = new Set(e.pinnedAgentIds.map((e) => C(e)).filter((e) => r.has(e))),
    a = t.toSorted((e, t) => !i.has(C(e.id)) - +!i.has(C(t.id)));
  if (t.length <= Hr) return { rows: a, showFilter: !1 };
  let o = e.filter.trim().toLowerCase();
  if (o)
    return {
      rows: a.filter((e) => C(e.id).toLowerCase().includes(o) || je(e).toLowerCase().includes(o)),
      showFilter: !0,
    };
  if (i.size > 0)
    return {
      rows: a.filter((e) => {
        let t = C(e.id);
        return i.has(t) || t === n;
      }),
      showFilter: !0,
    };
  let s = a.slice(0, Hr);
  if (!s.some((e) => C(e.id) === n)) {
    let e = a.find((e) => C(e.id) === n);
    e && (s = [...s.slice(0, Hr - 1), e]);
  }
  return { rows: s, showFilter: !0 };
}
function Rr(e, t) {
  let n = C(e.id),
    r = je(e),
    i = n === t.activeId,
    a = i ? 0 : t.agentUnreadCount(n),
    o = Ft(e) ?? (r || e.id).slice(0, 1).toUpperCase();
  return v`
    <wa-dropdown-item
      class="sidebar-customize-menu__item sidebar-agent-menu__agent-switch"
      value=${`${Ur}${encodeURIComponent(n)}`}
      type="checkbox"
      role="menuitemradio"
      aria-checked=${String(i)}
      ${ie((e) => Dn(e, i))}
    >
      <span slot="icon" class="sidebar-agent-section__avatar" aria-hidden="true">${o}</span>
      <span class="sidebar-customize-menu__text">${r}</span>
      ${
        i
          ? v`<span slot="details" class="session-menu__check" aria-hidden="true"
            >${j.check}</span
          >`
          : b
      }
      ${
        a > 0
          ? v`<span
            slot="details"
            class="session-unread-dot"
            role="img"
            aria-label=${k(`sessionsView.unread`)}
          ></span>`
          : b
      }
    </wa-dropdown-item>
  `;
}
function zr() {
  return v`
    ${Vr.map(
      (e) => v`
        <wa-dropdown-item
          slot="submenu"
          class="sidebar-customize-menu__item"
          value=${`${Gr}${encodeURIComponent(e.href)}`}
          @click=${(e) => {
            e.target instanceof Element &&
              e.target.closest(`a`) &&
              (e.currentTarget.dataset.nativeNavigation = `true`);
          }}
        >
          <a
            href=${e.href}
            target=${He}
            rel=${Me()}
            tabindex="-1"
          >
            <span slot="icon" class="nav-item__icon" aria-hidden="true">${j[e.icon]}</span>
            <span class="sidebar-customize-menu__text">${e.label()}</span>
          </a>
        </wa-dropdown-item>
      `,
    )}
  `;
}
function Br(e) {
  let t = e.position;
  if (!t) return b;
  let { activeId: n, activeName: r, agents: i } = e,
    { rows: a, showFilter: o } = Lr(e);
  return v`
    <openclaw-menu-surface>
      <wa-dropdown
        class="sidebar-customize-menu sidebar-agent-menu"
        .open=${!0}
        placement="top-start"
        .distance=${0}
        aria-label=${k(`agentChip.menuLabel`)}
        @wa-select=${(t) => {
          t.preventDefault();
          let r = t.detail.item;
          if (r.dataset.nativeNavigation) {
            (delete r.dataset.nativeNavigation, e.onClose(!1));
            return;
          }
          let i = r.value;
          if (i) {
            if ((e.onClose(!1), i.startsWith(Ur))) {
              e.onSwitchAgent(decodeURIComponent(i.slice(6)));
              return;
            }
            if (i.startsWith(Gr)) {
              Ve(decodeURIComponent(i.slice(5)));
              return;
            }
            switch (i) {
              case `${Wr}capabilities`:
                e.onAskCapabilities(n);
                break;
              case `${Wr}agent-settings`:
                e.onNavigate(`agents`, { search: `?agent=${encodeURIComponent(n)}` });
                break;
              case `${Wr}settings`:
                e.onNavigate(`config`);
                break;
              case `${Wr}pair-mobile`:
                e.onPairMobile();
                break;
            }
          }
        }}
        @wa-after-show=${(e) => {
          o && e.currentTarget.querySelector(`.sidebar-agent-menu__filter input`)?.focus();
        }}
        @keydown=${(t) => Tn(t, e.onTabAway)}
        @wa-after-hide=${(t) => e.onClose(En(t))}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${k(`agentChip.menuLabel`)}
          style="position: fixed; left: ${t.x}px; bottom: ${t.bottom}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        ${
          i.length > 1
            ? v`
              <div class="sidebar-customize-menu__title">${k(`agentChip.agents`)}</div>
              ${
                o
                  ? v`
                    <div class="sidebar-agent-menu__filter">
                      <input
                        type="text"
                        .value=${e.filter}
                        placeholder=${k(`agentChip.filterAgents`)}
                        aria-label=${k(`agentChip.filterAgents`)}
                        @input=${(t) => e.onFilterChange(t.target.value)}
                        @keydown=${(e) => {
                          if (e.key === `ArrowDown` || e.key === `ArrowUp`) {
                            (e.preventDefault(), e.stopPropagation());
                            let t = e.currentTarget.closest(`wa-dropdown`),
                              n = Array.from(t?.children ?? []).filter(
                                (e) =>
                                  e instanceof HTMLElement &&
                                  e.localName === `wa-dropdown-item` &&
                                  !e.hasAttribute(`disabled`),
                              ),
                              r = e.key === `ArrowDown` ? n.at(0) : n.at(-1);
                            r &&
                              (n.forEach((e) => (e.active = e === r)),
                              r.focus({ preventScroll: !0 }));
                            return;
                          }
                          e.key !== `Escape` && e.key !== `Tab` && e.stopPropagation();
                        }}
                      />
                    </div>
                  `
                  : b
              }
              ${a.map((t) => Rr(t, e))}
              ${
                a.length === 0
                  ? v`<div class="sidebar-agent-menu__empty">
                    ${k(`agentChip.noAgentMatches`)}
                  </div>`
                  : b
              }
              <div class="sidebar-customize-menu__separator" role="separator"></div>
            `
            : b
        }
        <wa-dropdown-item
          class="sidebar-customize-menu__item"
          value="command:capabilities"
          ?disabled=${!e.connected}
        >
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${j.bot}</span>
          <span class="sidebar-customize-menu__text">
            ${k(`agentChip.whatCanAgentDo`, { name: r })}
          </span>
        </wa-dropdown-item>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="command:agent-settings">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${j.users}</span>
          <span class="sidebar-customize-menu__text">${k(`agentChip.agentSettings`)}</span>
        </wa-dropdown-item>
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="command:settings">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${j.settings}</span>
          <span class="sidebar-customize-menu__text">${O(`config`)}</span>
        </wa-dropdown-item>
        <wa-dropdown-item
          class="sidebar-customize-menu__item sidebar-pair-mobile"
          value="command:pair-mobile"
          ?disabled=${!e.canPairDevice}
          title=${e.canPairDevice ? b : k(`nodes.pairing.adminRequired`)}
        >
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${j.smartphone}</span>
          <span class="sidebar-customize-menu__text">${k(`nodes.pairing.button`)}</span>
        </wa-dropdown-item>
        <wa-dropdown-item
          class="sidebar-customize-menu__item sidebar-agent-menu__help"
          value="command:help"
        >
          <span slot="icon" class="nav-item__icon" aria-hidden="true"
            >${j.circleQuestionMark}</span
          >
          <span class="sidebar-customize-menu__text">${k(`agentChip.help`)}</span>
          ${zr()}
        </wa-dropdown-item>
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <div class="sidebar-agent-menu__footer">
          <openclaw-sidebar-build-chip
            .basePath=${e.basePath}
            .gatewayVersion=${e.gatewayVersion}
            .onNavigate=${(t) => {
              (e.onClose(), e.onNavigate(t));
            }}
          ></openclaw-sidebar-build-chip>
          <span class="sidebar-mode-switch">
            <openclaw-theme-mode-toggle .mode=${e.themeMode}></openclaw-theme-mode-toggle>
          </span>
        </div>
      </wa-dropdown>
    </openclaw-menu-surface>
  `;
}
var Vr,
  Hr,
  Ur,
  Wr,
  Gr,
  Kr = e(() => {
    (y(),
      oe(),
      rn(),
      A(),
      at(),
      ye(),
      Ee(),
      Ne(),
      M(),
      P(),
      (Vr = [
        { href: `https://docs.openclaw.ai`, icon: `book`, label: () => k(`common.docs`) },
        {
          href: `https://docs.openclaw.ai/help`,
          icon: `messageSquare`,
          label: () => k(`agentChip.getHelp`),
        },
        { href: `https://discord.gg/clawd`, icon: `users`, label: () => k(`agentChip.discord`) },
        {
          href: `https://docs.openclaw.ai/releases`,
          icon: `scrollText`,
          label: () => k(`agentChip.viewChangelog`),
        },
      ]),
      (Hr = 10),
      (Ur = `agent:`),
      (Wr = `command:`),
      (Gr = `link:`));
  }),
  V,
  qr = e(() => {
    (y(),
      h(),
      A(),
      E(),
      M(),
      xn(),
      P(),
      t(),
      (V = class extends st {
        constructor(...e) {
          (super(...e),
            (this.x = 0),
            (this.y = 0),
            (this.trigger = null),
            (this.terminalDisabled = !1),
            (this.onAction = () => {}),
            (this.onClose = () => {}),
            (this.handleDocumentKeydown = (e) => {
              e.key === `Escape` &&
                (e.preventDefault(), e.stopPropagation(), this.trigger?.focus(), this.onClose());
            }),
            (this.handleSelect = (e) => {
              e.preventDefault();
              let t = e.detail.item.value;
              t && this.run(t);
            }),
            (this.handleAfterHide = (e) => {
              e.currentTarget instanceof Node && e.currentTarget.isConnected && this.onClose();
            }));
        }
        connectedCallback() {
          (super.connectedCallback(),
            document.addEventListener(`keydown`, this.handleDocumentKeydown, !0),
            yn(this));
        }
        disconnectedCallback() {
          (document.removeEventListener(`keydown`, this.handleDocumentKeydown, !0),
            super.disconnectedCallback());
        }
        firstUpdated() {
          let e = this.querySelector(`wa-dropdown`);
          Promise.resolve(e?.updateComplete).then(() => {
            this.querySelector(`wa-dropdown-item:not([disabled])`)?.focus();
          });
        }
        run(e) {
          (this.onAction(e), this.onClose());
        }
        render() {
          let e = Math.max(8, Math.min(this.x, window.innerWidth - 240 - 8)),
            t = Math.max(8, Math.min(this.y, window.innerHeight - 112 - 8)),
            n = k(`chat.catalog.sessionMenu`);
          return v`
      <wa-dropdown
        class="session-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${n}
        @wa-select=${this.handleSelect}
        @wa-after-hide=${this.handleAfterHide}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${n}
          style="position: fixed; left: ${e}px; top: ${t}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        <wa-dropdown-item class="session-menu__item" value="viewer">
          <span slot="icon" class="session-menu__icon" aria-hidden="true"
            >${j.messageSquare}</span
          >
          <span class="session-menu__text">${k(`chat.catalog.openInOpenClaw`)}</span>
        </wa-dropdown-item>
        <wa-dropdown-item
          class="session-menu__item"
          value="terminal"
          title=${this.terminalDisabled ? k(`chat.catalog.terminalUnavailable`) : ``}
          ?disabled=${this.terminalDisabled}
        >
          <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.terminal}</span>
          <span class="session-menu__text">${k(`chat.catalog.openInTerminal`)}</span>
        </wa-dropdown-item>
      </wa-dropdown>
    `;
        }
      }),
      i([_({ attribute: !1 })], V.prototype, `x`, void 0),
      i([_({ attribute: !1 })], V.prototype, `y`, void 0),
      i([_({ attribute: !1 })], V.prototype, `trigger`, void 0),
      i([_({ attribute: !1 })], V.prototype, `terminalDisabled`, void 0),
      i([_({ attribute: !1 })], V.prototype, `onAction`, void 0),
      i([_({ attribute: !1 })], V.prototype, `onClose`, void 0),
      customElements.get(`openclaw-catalog-session-menu`) ||
        customElements.define(`openclaw-catalog-session-menu`, V));
  }),
  Jr,
  Yr = e(() => {
    (y(),
      Ot(),
      qr(),
      (Jr = class {
        constructor(e) {
          ((this.hooks = e), (this.state = null), (this.trigger = null));
        }
        get isOpen() {
          return this.state !== null;
        }
        open(e, t, n, r = null) {
          (this.hooks.beforeOpen(),
            (this.trigger = r),
            (this.state = { ...e, x: t, y: n }),
            this.hooks.requestUpdate());
        }
        close() {
          (!this.state && !this.trigger) ||
            ((this.trigger = null), (this.state = null), this.hooks.requestUpdate());
        }
        handleAction(e, t) {
          if (t === `terminal`) {
            e.canOpenTerminal && this.hooks.terminalAvailable() && Je(e.key);
            return;
          }
          this.hooks.navigate(e.search);
        }
        render() {
          let e = this.state;
          return e
            ? v`
      <openclaw-catalog-session-menu
        .x=${e.x}
        .y=${e.y}
        .trigger=${this.trigger}
        .terminalDisabled=${!e.canOpenTerminal || !this.hooks.terminalAvailable()}
        .onAction=${(t) => this.handleAction(e, t)}
        .onClose=${() => this.close()}
      ></openclaw-catalog-session-menu>
    `
            : b;
        }
      }));
  });
function Xr(e) {
  return (
    !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
  );
}
function Zr(e, t) {
  return e === void 0 ? !1 : t === `config` ? tn(e) : t === `plugins` ? cn(e) : e === t;
}
function Qr(e) {
  let t = e ?? [];
  return [`chat`, `control`, `agent`, `settings`].flatMap((e) =>
    t.filter((t) => (t.group ?? `control`) === e),
  );
}
function $r(e) {
  return v`
    <a
      href=${e.href}
      class="nav-item ${e.active ? `nav-item--active` : ``}"
      @focus=${(t) => e.onPreload(t)}
      @blur=${e.onCancelPreload}
      @pointerenter=${(t) => e.onPreload(t)}
      @pointerleave=${e.onCancelPreload}
      @touchstart=${(t) => e.onPreload(t, !0)}
      @click=${(t) => {
        Xr(t) && (t.preventDefault(), e.onNavigate());
      }}
    >
      <span class="nav-item__icon" aria-hidden="true"
        >${j[Xt(e.routeId)]}</span
      >
      <span class="nav-item__text">${O(e.routeId)}</span>
    </a>
  `;
}
function ei(e) {
  return v`
    <button
      type="button"
      class="nav-item nav-item--action ${e.active ? `nav-item--active` : ``}"
      aria-haspopup="menu"
      aria-expanded=${String(e.open)}
      @click=${(t) => e.onToggle(t.currentTarget)}
    >
      <span class="nav-item__icon" aria-hidden="true">${j.moreHorizontal}</span>
      <span class="nav-item__text">${k(`nav.more`)}</span>
    </button>
  `;
}
function ti(e, t) {
  let n = Zr(e.activeRouteId, t);
  return v`
    <wa-dropdown-item
      value=${t}
      class="sidebar-customize-menu__item ${n ? `sidebar-customize-menu__item--active` : ``}"
      aria-current=${n ? `page` : b}
      @pointerenter=${(n) => e.onPreloadRoute(t, n)}
      @pointerleave=${e.onCancelPreload}
      @click=${(e) => {
        if (!Xr(e)) {
          e.currentTarget.dataset.nativeNavigation = `true`;
          return;
        }
        e.preventDefault();
      }}
    >
      <a href=${D(t, e.basePath)} tabindex="-1">
        <span class="nav-item__icon" aria-hidden="true"
          >${j[Xt(t)]}</span
        >
        <span class="sidebar-customize-menu__text">${O(t)}</span>
      </a>
    </wa-dropdown-item>
  `;
}
function ni(e, t) {
  let n = { pluginId: t.pluginId, id: t.id },
    r = u(n),
    i = e.activeRouteId === `plugin` && e.activePluginTabId === l(n),
    a = t.icon && Object.hasOwn(j, t.icon) ? t.icon : `puzzle`;
  return v`
    <wa-dropdown-item
      value=${`plugin:${l(n)}`}
      class="sidebar-customize-menu__item ${i ? `sidebar-customize-menu__item--active` : ``}"
      aria-current=${i ? `page` : b}
      @click=${(e) => {
        if (!Xr(e)) {
          e.currentTarget.dataset.nativeNavigation = `true`;
          return;
        }
        e.preventDefault();
      }}
    >
      <a href=${`${D(`plugin`, e.basePath)}${r}`} tabindex="-1">
        <span class="nav-item__icon" aria-hidden="true">${j[a]}</span>
        <span class="sidebar-customize-menu__text">${t.label}</span>
      </a>
    </wa-dropdown-item>
  `;
}
function ri(e) {
  let t = e.position;
  if (!t) return b;
  let n = nn(e.pinnedRoutes).filter((t) => e.isRouteEnabled(t));
  return v`
    <openclaw-menu-surface>
      <wa-dropdown
        class="sidebar-customize-menu sidebar-more-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${k(`nav.more`)}
        @wa-select=${(t) => {
          t.preventDefault();
          let r = t.detail.item;
          if (r.dataset.nativeNavigation) {
            delete r.dataset.nativeNavigation;
            return;
          }
          let i = r.value;
          if (i === `customize`) {
            e.onEditPinnedItems();
            return;
          }
          if (i?.startsWith(`plugin:`)) {
            let t = e.pluginTabs.find(
              (e) => `plugin:${l({ pluginId: e.pluginId, id: e.id })}` === i,
            );
            t && e.onNavigatePluginTab(u({ pluginId: t.pluginId, id: t.id }));
            return;
          }
          i && n.includes(i) && e.onNavigateRoute(i);
        }}
        @keydown=${(t) => Tn(t, e.onTabAway)}
        @wa-after-hide=${(t) => e.onClose(En(t))}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${k(`nav.more`)}
          style="position: fixed; left: ${t.x}px; top: ${t.y}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        ${n.map((t) => ti(e, t))}
        ${e.pluginTabs.map((t) => ni(e, t))}
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="customize">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${j.penLine}</span>
          <span class="sidebar-customize-menu__text">${k(`nav.customize`)}</span>
        </wa-dropdown-item>
      </wa-dropdown>
    </openclaw-menu-surface>
  `;
}
function ii(e) {
  let t = e.position;
  return t
    ? v`
    <openclaw-menu-surface>
      <wa-dropdown
        class="sidebar-customize-menu"
        .open=${!0}
        placement="bottom-start"
        .distance=${0}
        aria-label=${k(`nav.customize`)}
        @wa-select=${(t) => {
          t.preventDefault();
          let n = t.detail.item.value;
          n === `reset` ? e.onReset() : n && Qt.includes(n) && e.onToggleRoute(n);
        }}
        @keydown=${(t) => Tn(t, e.onTabAway)}
        @wa-after-hide=${(t) => e.onClose(En(t))}
      >
        <button
          slot="trigger"
          type="button"
          tabindex="-1"
          aria-hidden="true"
          aria-label=${k(`nav.customize`)}
          style="position: fixed; left: ${t.x}px; top: ${t.y}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
        ></button>
        <div class="sidebar-customize-menu__title">${k(`nav.customize`)}</div>
        ${Qt.filter((t) => e.isRouteEnabled(t)).map(
          (t) => v`
            <wa-dropdown-item
              class="sidebar-customize-menu__item"
              type="checkbox"
              value=${t}
              .checked=${e.pinnedRoutes.includes(t)}
            >
              <span slot="icon" class="nav-item__icon" aria-hidden="true"
                >${j[Xt(t)]}</span
              >
              <span class="sidebar-customize-menu__text">${O(t)}</span>
            </wa-dropdown-item>
          `,
        )}
        <div class="sidebar-customize-menu__separator" role="separator"></div>
        <wa-dropdown-item class="sidebar-customize-menu__item" value="reset">
          <span slot="icon" class="nav-item__icon" aria-hidden="true">${j.refresh}</span>
          <span class="sidebar-customize-menu__text">${k(`nav.customizeReset`)}</span>
        </wa-dropdown-item>
      </wa-dropdown>
    </openclaw-menu-surface>
  `
    : b;
}
function ai(e) {
  return (
    e.activeRouteId === `plugin` ||
    nn(e.pinnedRoutes).some((t) => e.isRouteEnabled(t) && Zr(e.activeRouteId, t))
  );
}
var oi = e(() => {
  (y(), rn(), Vt(), A(), d(), M(), P());
});
function si(e) {
  return {
    code: e instanceof $t ? e.gatewayCode : `UNAVAILABLE`,
    message: e instanceof Error ? e.message : String(e),
  };
}
function ci(e, t) {
  let n = new Set(e.map((e) => e.threadId));
  return [...e, ...t.filter((e) => !n.has(e.threadId))];
}
function li(e, t) {
  if (!t) return e;
  let { sessions: n, nextCursor: r, ...i } = t,
    { sessions: a, nextCursor: o, ...s } = e;
  return { ...i, ...s, sessions: n, ...(r === void 0 ? {} : { nextCursor: r }) };
}
function ui(e) {
  let t = new Map(e.page.hosts.map((e) => [e.hostId, e])),
    n = [],
    r = e.current.hosts.map((r) => {
      let i = e.cursors[r.hostId],
        a = t.get(r.hostId);
      if (i === void 0 || r.nextCursor !== i || !a) return r;
      if (a.error) return li(a, r);
      n.push(r.hostId);
      let { nextCursor: o, sessions: s, error: c, ...l } = a,
        { nextCursor: u, error: d, ...f } = r;
      return { ...f, ...l, sessions: ci(r.sessions, s), ...(o ? { nextCursor: o } : {}) };
    }),
    { hosts: i, error: a, ...o } = e.current,
    { hosts: s, error: c, ...l } = e.page;
  return { catalog: { ...o, ...l, hosts: r, ...(c ? { error: c } : {}) }, advancedHostIds: n };
}
var di = e(() => {
  on();
});
function fi(e) {
  let t = c(e, { fallback: `` });
  return t === `just now` ? `now` : t.endsWith(` ago`) ? t.slice(0, -4) : t;
}
function pi(e) {
  let t = new Set();
  for (let n of e)
    for (let e of n.hosts)
      for (let n of e.sessions) n.openClawSessionKey && t.add(n.openClawSessionKey);
  return t;
}
function mi(e, t) {
  return e.map((e) =>
    e.id === t.catalogId
      ? {
          ...e,
          hosts: e.hosts.map((e) =>
            e.hostId === t.hostId
              ? {
                  ...e,
                  sessions: e.sessions.map((e) =>
                    e.threadId === t.threadId ? { ...e, openClawSessionKey: t.sessionKey } : e,
                  ),
                }
              : e,
          ),
        }
      : e,
  );
}
function hi(e, t) {
  return e
    ? v`<span
      class="session-run-spinner"
      role="img"
      aria-label=${k(`sessionsView.activeRun`)}
      title=${k(`sessionsView.activeRun`)}
    ></span>`
    : t
      ? v`<span
        class="session-unread-dot"
        role="img"
        aria-label=${k(`sessionsView.unread`)}
      ></span>`
      : b;
}
function gi(e) {
  let t = new Map();
  for (let n of e.liveRows) t.has(n.key) || t.set(n.key, n);
  return e.catalogs.map((n) => {
    let r = `catalog:${n.id}`,
      i = e.collapsedSections.has(r),
      a = n.hosts,
      o = a.flatMap((e) => e.sessions.map((t) => ({ host: e, session: t }))),
      s = o.flatMap(({ session: e }) => {
        let n = e.openClawSessionKey ? t.get(e.openClawSessionKey) : void 0;
        return n ? [n] : [];
      }),
      c = s.some((e) => e.hasActiveRun === !0),
      l = s.some((e) => e.unread === !0),
      u = e.loadingMoreCatalogIds.has(n.id),
      d = a.some((e) => !!e.nextCursor),
      f = n.capabilities.createSession !== void 0,
      p = [
        ...(n.error ? [`[${n.error.code}] ${n.error.message}`] : []),
        ...a.flatMap((e) => (e.error ? [`[${e.error.code}] ${e.error.message}`] : [])),
      ],
      m = p.length > 0;
    if (o.length === 0 && !d && !m && !n.capabilities.createSession) return b;
    let ee = `${p.join(`; `)}. Configure native session discovery in Settings > Automation > Plugins.`;
    return v`
      <div class="sidebar-recent-sessions__group" data-session-section=${r}>
        <div class="sidebar-recent-sessions__head">
          <button
            type="button"
            class="sidebar-session-group-toggle"
            aria-expanded=${String(!i)}
            aria-label=${m ? `${n.label}: ${ee}` : n.label}
            title=${m ? ee : b}
            @click=${() => e.onToggleSection(r)}
          >
            <span class="sidebar-session-group-toggle__icon" aria-hidden="true"
              >${i ? j.chevronRight : j.chevronDown}</span
            >
            <span class="sidebar-recent-sessions__label-text">${n.label}</span>
            ${hi(c, l)}
            <span
              class="sidebar-session-group-count ${m ? `sidebar-session-group-count--error` : ``}"
              data-session-catalog-error=${m ? n.id : b}
              aria-hidden="true"
              >${m ? j.alertTriangle : o.length}</span
            >
          </button>
          ${
            f
              ? v`<button
                type="button"
                class="sidebar-session-sort sidebar-session-new sidebar-session-catalog-new"
                title=${`${k(`chat.runControls.newSession`)} — ${n.label}`}
                aria-label=${`${k(`chat.runControls.newSession`)} — ${n.label}`}
                ?disabled=${!e.connected}
                @click=${() => e.onOpenNewSession?.(e.newSessionAgentId, { catalogId: n.id })}
              >
                ${j.plus}
              </button>`
              : b
          }
        </div>
        ${
          i
            ? b
            : v`<div class="sidebar-recent-sessions__list">
                ${o.map(({ host: r, session: i }) => _i(n, r, i, t, e))}
              </div>
              ${
                d
                  ? v`<button
                    type="button"
                    class="sidebar-session-catalog-load-more"
                    data-session-catalog-load-more=${n.id}
                    ?disabled=${u}
                    aria-busy=${String(u)}
                    @click=${() => e.onLoadMore(n.id)}
                  >
                    ${k(`chat.selectors.loadMoreSessions`)}
                  </button>`
                  : b
              }`
        }
      </div>
    `;
  });
}
function _i(e, t, n, r, i) {
  let a = n.openClawSessionKey ? r.get(n.openClawSessionKey) : void 0;
  if (a) {
    let r = n.recencyAt ?? n.updatedAt ?? n.createdAt,
      o = typeof r == `number` && r < 0xe8d4a51000 ? r * 1e3 : r,
      s = n.name || n.threadId,
      c = e.hosts.length > 1 || t.kind === `node` ? t.label : void 0;
    return i.renderLiveRow(a, {
      label: s,
      ...(c ? { subtitle: c } : {}),
      meta: fi(o),
      title: `${s} · ${t.label}`,
    });
  }
  let o = { catalogId: e.id, hostId: t.hostId, threadId: n.threadId },
    s = n.openClawSessionKey ?? pt(o),
    c = Se(s),
    l = `${D(`chat`, i.basePath)}${c}`,
    u = t.kind === `node` ? t.label : void 0,
    d = i.routeSessionKey !== `` && s === i.routeSessionKey,
    f = n.recencyAt ?? n.updatedAt ?? n.createdAt,
    p = typeof f == `number` && f < 0xe8d4a51000 ? f * 1e3 : f,
    m = n.canOpenTerminal === !0 && i.terminalAvailable,
    ee = () => i.onOpenTerminal(o),
    te = (e, t, r) =>
      i.onOpenMenu({ key: o, search: c, canOpenTerminal: n.canOpenTerminal === !0 }, e, t, r);
  return v`
    <div
      class="sidebar-recent-session session-row-host ${d ? `sidebar-recent-session--active` : ``}"
      data-session-key=${s}
      @contextmenu=${(e) => {
        (e.preventDefault(), te(e.clientX, e.clientY));
      }}
    >
      <a
        href=${l}
        class="sidebar-recent-session__link"
        title=${u ? `${n.name || n.threadId} · ${u}` : n.name || n.threadId}
        @click=${(e) => {
          Xr(e) &&
            (e.preventDefault(),
            i.catalogOpenTarget === `terminal` && m ? ee() : i.onNavigate?.(`chat`, { search: c }));
        }}
      >
        <span class="sidebar-recent-session__text">
          <span class="sidebar-recent-session__name hover-marquee"
            >${n.name || n.threadId}</span
          >
          ${u ? v`<span class="sidebar-recent-session__subtitle">${u}</span>` : b}
        </span>
      </a>
      <span class="sidebar-recent-session__aside session-row-aside">
        <span class="session-row-trail">${fi(p)}</span>
        <span class="session-row-actions">
          <button
            class="session-action"
            data-catalog-session-menu="true"
            type="button"
            title=${k(`chat.sidebar.openSessionMenu`)}
            aria-label=${k(`chat.sidebar.openSessionMenu`)}
            aria-haspopup="menu"
            @click=${(e) => {
              e.stopPropagation();
              let t = e.currentTarget,
                n = t.getBoundingClientRect();
              te(n.right, n.bottom + 4, t);
            }}
          >
            ${j.moreHorizontal}
          </button>
        </span>
      </span>
    </div>
  `;
}
var vi = e(() => {
  (y(), Vt(), A(), Ye(), nt(), wt(), oi(), M());
});
function yi() {
  try {
    let e = w()?.getItem(ji),
      t = e ? JSON.parse(e) : {},
      n = new Map();
    if (Array.isArray(t)) {
      for (let e of t) typeof e == `string` && e && n.set(e, { firstSeenAt: null, name: null });
      return n;
    }
    if (t && typeof t == `object`)
      for (let [e, r] of Object.entries(t))
        e &&
          n.set(e, {
            firstSeenAt: typeof r?.firstSeenAt == `number` ? r.firstSeenAt : null,
            name: typeof r?.name == `string` && r.name ? r.name : null,
          });
    return n;
  } catch {
    return new Map();
  }
}
function bi(e) {
  let t = {};
  for (let [n, r] of [...e.entries()].toSorted(([e], [t]) => e.localeCompare(t)))
    t[n] = {
      ...(r.firstSeenAt === null ? {} : { firstSeenAt: r.firstSeenAt }),
      ...(r.name === null ? {} : { name: r.name }),
    };
  w()?.setItem(ji, JSON.stringify(t));
}
function xi() {
  return new Set(yi().keys());
}
function Si() {
  return yi();
}
function Ci(e, t = {}) {
  try {
    let n = yi(),
      r = n.get(e);
    if (r) {
      if (r.firstSeenAt !== null && r.name !== null) return;
      n.set(e, { firstSeenAt: r.firstSeenAt ?? Date.now(), name: r.name ?? t.name ?? null });
    } else n.set(e, { firstSeenAt: Date.now(), name: t.name ?? null });
    bi(n);
  } catch {}
}
function wi() {
  try {
    let e = w()?.getItem(Mi),
      t = e ? JSON.parse(e) : {},
      n = t && typeof t == `object` ? t : {};
    return {
      visits: typeof n.visits == `number` && n.visits >= 0 ? n.visits : 0,
      shoos: typeof n.shoos == `number` && n.shoos >= 0 ? n.shoos : 0,
    };
  } catch {
    return { visits: 0, shoos: 0 };
  }
}
function Ti(e) {
  try {
    w()?.setItem(Mi, JSON.stringify(e));
  } catch {}
}
function Ei() {
  let e = wi();
  Ti({ ...e, visits: e.visits + 1 });
}
function Di() {
  let e = wi();
  Ti({ ...e, shoos: e.shoos + 1 });
}
function Oi() {
  let { visits: e, shoos: t } = wi();
  return {
    tier: e < 3 ? `shy` : e < 15 ? `regular` : `friend`,
    wary: t >= 3 && t > e * 0.3,
    visits: e,
    shoos: t,
  };
}
function ki(e) {
  for (let [t, n] of Pi) if (e >= t) return n;
  return null;
}
function Ai(e, t) {
  if (e === null || t.getTime() - e < Fi) return !1;
  let n = new Date(e);
  return n.getMonth() === t.getMonth() && n.getDate() === t.getDate();
}
var ji,
  Mi,
  Ni,
  Pi,
  Fi,
  Ii = e(() => {
    (Le(),
      (ji = `openclaw.control.lobsterdex.v1`),
      (Mi = `openclaw.control.lobsterpet.familiarity.v1`),
      (Ni = {
        shy: { stayMul: 0.6, firstDelayMul: 1.3, gapMul: 1 },
        regular: { stayMul: 1, firstDelayMul: 1, gapMul: 1 },
        friend: { stayMul: 1.6, firstDelayMul: 0.7, gapMul: 0.8 },
        waryGapMul: 1.7,
      }),
      (Pi = [
        [250, `Elder`],
        [100, `Captain`],
        [50, `Sir`],
      ]),
      (Fi = 300 * 24 * 60 * 60 * 1e3));
  });
function Li(e) {
  return {
    palette: e,
    scale: 2,
    accessory: `none`,
    antennae: `perky`,
    side: `left`,
    spotPct: 0,
    facing: 1,
    personality: `friendly`,
    blinkDelayS: 0,
    build: `round`,
    clawSize: `regular`,
    tailFan: !1,
  };
}
function Ri(e) {
  return e.getMonth() === sa.month && e.getDate() === sa.day;
}
function zi(e) {
  let t = e.getMonth(),
    n = e.getDate();
  return t === 11 ? [[`santa`, 18]] : t === 9 && n >= 20 ? [[`pumpkin`, 18]] : [];
}
function Bi(e, t) {
  return Ta[e.palette.id] ?? fe(wa[(t >>> 3) % wa.length], `lobster pet name catalog entry`);
}
function Vi(e) {
  return H((e ^ 12317) >>> 0)() < 0.12;
}
function Hi(e) {
  return H((e ^ 30485) >>> 0)() < 0.04;
}
function Ui(e) {
  return H((e ^ 4195) >>> 0)() < 0.12;
}
function Wi(e) {
  let t = H((e ^ 3243) >>> 0),
    n = t();
  return n >= 0.095
    ? null
    : {
        kind: n < 0.015 ? `crab` : `stranger`,
        atMs: Math.round(6e4 + t() * 84e4),
        direction: t() < 0.5 ? 1 : -1,
      };
}
function Gi(e, t) {
  for (let n = 1; n <= 24; n++) {
    let r = Xi((e + n * 7919) >>> 0);
    if (r.palette.id !== t) return r;
  }
  return Xi((e + 1) >>> 0);
}
function Ki(e) {
  try {
    let t = w();
    if (!t) return !1;
    let n = t.getItem(Da);
    return n === e ? !1 : (t.setItem(Da, e), n !== null);
  } catch {
    return !1;
  }
}
function qi(e = new Date()) {
  let t = e.getHours();
  return t >= 22 || t < 6;
}
function Ji(e) {
  let t = 2166136261;
  for (let n = 0; n < e.length; n++) ((t ^= e.charCodeAt(n)), (t = Math.imul(t, 16777619)));
  return t >>> 0;
}
function H(e) {
  let t = e >>> 0;
  return () => {
    t = (t + 1831565813) | 0;
    let e = Math.imul(t ^ (t >>> 15), 1 | t);
    return (
      (e = (e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ e), ((e ^ (e >>> 14)) >>> 0) / 4294967296
    );
  };
}
function U(e, t) {
  let n = t.reduce((e, [, t]) => e + t, 0),
    r = e() * n;
  for (let [e, n] of t) if (((r -= n), r <= 0)) return e;
  return fe(t.at(-1), `weighted lobster choice fallback`)[0];
}
function W(e, t, n) {
  return t + e() * (n - t);
}
function Yi(e) {
  return (Ji(e) ^ Oa) >>> 0;
}
function Xi(e, t = new Date()) {
  let n = H(e),
    r = U(n, ia),
    i = U(n, la),
    a = U(n, [...oa, ...zi(t)]),
    o = n() < 0.6 ? `perky` : `droopy`,
    s = n() < 0.5 ? `left` : `right`,
    c = ma[s],
    l = Math.round(W(n, c[0], c[1])),
    u = n() < 0.5 ? 1 : -1,
    d = U(n, ca),
    f = Math.round(W(n, 0, 4) * 10) / 10,
    p = U(n, ua),
    m = U(n, da),
    ee = n() < 0.3;
  return Ri(t)
    ? {
        palette: ia.find(([e]) => e.id === `retro`)?.[0] ?? r,
        scale: i,
        accessory: `party`,
        antennae: o,
        side: s,
        spotPct: l,
        facing: u,
        personality: d,
        blinkDelayS: f,
        build: p,
        clawSize: m,
        tailFan: ee,
      }
    : {
        palette: r,
        scale: i,
        accessory: a,
        antennae: o,
        side: s,
        spotPct: l,
        facing: u,
        personality: d,
        blinkDelayS: f,
        build: p,
        clawSize: m,
        tailFan: ee,
      };
}
function Zi(e) {
  let t = null;
  for (let n of e ?? []) {
    if (!n.status || n.status === `running`) continue;
    let e = n.endedAt ?? n.lastActivityAt ?? n.updatedAt ?? 0;
    (!t || e > t.at) &&
      (t = {
        at: e,
        outcome:
          n.status === `failed` || n.status === `timeout`
            ? `error`
            : n.status === `killed`
              ? `aborted`
              : `ok`,
      });
  }
  return t?.outcome ?? `ok`;
}
function Qi(e, t) {
  return e ? (t?.some((e) => e.hasActiveRun === !0) ? `busy` : `idle`) : `offline`;
}
function G() {
  return (
    typeof window < `u` &&
    typeof window.matchMedia == `function` &&
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  );
}
function $i() {
  return x`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="#a63a2e" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M22 78 L8 88" />
        <path d="M28 88 L16 99" />
        <path d="M98 78 L112 88" />
        <path d="M92 88 L104 99" />
      </g>
      <g stroke="#c44536" stroke-width="3.5" stroke-linecap="round" fill="none">
        <path d="M44 38 L40 24" />
        <path d="M76 38 L80 24" />
      </g>
      <circle cx="40" cy="22" r="4.5" fill="#0a1014" />
      <circle cx="80" cy="22" r="4.5" fill="#0a1014" />
      <circle cx="41.5" cy="20.5" r="1.8" fill="#ffd166" />
      <circle cx="81.5" cy="20.5" r="1.8" fill="#ffd166" />
      <ellipse cx="60" cy="70" rx="46" ry="30" fill="#c44536" />
      <ellipse cx="48" cy="60" rx="16" ry="9" fill="#ffffff" opacity="0.1" />
      <path
        d="M16 58 C2 52 -2 62 4 72 C10 82 20 76 24 66 C26 60 22 58 16 58 Z"
        fill="#d95f4b"
      />
      <path
        d="M104 58 C118 52 122 62 116 72 C110 82 100 76 96 66 C94 60 98 58 104 58 Z"
        fill="#d95f4b"
      />
      <path d="M48 82 Q60 90 72 82" stroke="#7e2a20" stroke-width="3" stroke-linecap="round" fill="none" />
    </svg>
  `;
}
function ea(e, t = {}) {
  return x`
    <svg
      class="lobster-pet__svg"
      viewBox="0 0 120 105"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      ${e.palette.id === `retro` ? Na : Ba[e.antennae]}
      ${e.tailFan ? Fa : b}
      <g class="lob-claw lob-claw--l">
        <path
          d="M20 42 C5 37 0 47 5 57 C10 67 20 62 25 52 C28 45 25 42 20 42 Z"
          fill="var(--lob-claw)"
        />
      </g>
      ${
        e.palette.id === `retro`
          ? b
          : x`
            <g class="lob-claw lob-claw--r">
              <path
                d="M100 42 C115 37 120 47 115 57 C110 67 100 62 95 52 C92 45 95 42 100 42 Z"
                fill="var(--lob-claw)"
              />
            </g>
          `
      }
      <path
        d="M60 8 C32 8 16 32 16 52 C16 72 30 90 44 95 L44 104 L54 104 L54 96 C58 97.5 62 97.5 66 96 L66 104 L76 104 L76 95 C90 90 104 72 104 52 C104 32 88 8 60 8 Z"
        fill="var(--lob-shell)"
      />
      ${e.palette.id === `split` ? ja : b}
      ${e.palette.id === `calico` ? Aa : b}
      <ellipse cx="48" cy="28" rx="20" ry="11" fill="#ffffff" opacity="0.1" />
      <g class="lob-eye-open" style=${t.shell || t.sleeping ? `display:none` : ``}>
        <circle cx="45" cy="32" r="5.5" fill="#0a1014" />
        <circle cx="75" cy="32" r="5.5" fill="#0a1014" />
        <circle cx="46.5" cy="30.5" r="2.2" fill="var(--lob-glint, #00e5cc)" />
        <circle cx="76.5" cy="30.5" r="2.2" fill="var(--lob-glint, #00e5cc)" />
      </g>
      ${
        t.sleeping
          ? x`
            <g class="lob-eye-peek">
              <circle cx="45" cy="32" r="4" fill="#0a1014" />
              <circle cx="46" cy="30.8" r="1.6" fill="var(--lob-glint, #00e5cc)" />
            </g>
          `
          : b
      }
      <g
        class="lob-eye-closed"
        stroke="#0a1014"
        stroke-width="3"
        stroke-linecap="round"
        fill="none"
        style=${t.shell || t.sleeping ? `opacity:1` : t.standalone ? `display:none` : ``}
      >
        <path d="M39 33 Q45 28 51 33" />
        <path d="M69 33 Q75 28 81 33" />
      </g>
      ${
        e.palette.id === `retro`
          ? x`
            ${Pa}
            <g class="lob-claw lob-claw--r">${Ma}</g>
          `
          : b
      }
      ${t.grumpy && e.palette.id !== `retro` ? za : b}
      ${e.accessory === `none` || t.shell ? b : ka[e.accessory]}
      ${t.bindle && e.palette.id !== `retro` ? Ia : b}
      ${t.sailorCap && !t.shell && !La.has(e.accessory) ? Ra : b}
    </svg>
  `;
}
var ta,
  na,
  ra,
  ia,
  aa,
  oa,
  sa,
  ca,
  la,
  ua,
  da,
  fa,
  pa,
  ma,
  ha,
  ga,
  _a,
  va,
  ya,
  ba,
  xa,
  Sa,
  Ca,
  wa,
  Ta,
  Ea,
  Da,
  Oa,
  ka,
  Aa,
  ja,
  Ma,
  Na,
  Pa,
  Fa,
  Ia,
  La,
  Ra,
  za,
  Ba,
  K,
  Va = e(() => {
    (ue(),
      y(),
      h(),
      n(),
      Le(),
      Ii(),
      t(),
      (ta = {
        wave: 1400,
        snip: 1e3,
        hop: 750,
        spin: 950,
        peek: 1700,
        nap: 4400,
        bubble: 2600,
        scuttle: 1250,
        startle: 750,
        cheer: 1300,
        molt: 2600,
        pet: 1500,
        droop: 1600,
        sweep: 1800,
      }),
      (na = {
        sleepy: {
          delayMs: [6e3, 12e3],
          acts: [
            [`nap`, 40],
            [`bubble`, 20],
            [`wave`, 12],
            [`scuttle`, 12],
            [`peek`, 10],
            [`hop`, 6],
          ],
        },
        zoomy: {
          delayMs: [2800, 6e3],
          acts: [
            [`scuttle`, 42],
            [`hop`, 22],
            [`spin`, 12],
            [`peek`, 12],
            [`wave`, 12],
          ],
        },
        friendly: {
          delayMs: [3600, 7500],
          acts: [
            [`wave`, 32],
            [`snip`, 22],
            [`scuttle`, 18],
            [`hop`, 14],
            [`bubble`, 14],
          ],
        },
        showoff: {
          delayMs: [3600, 7500],
          acts: [
            [`spin`, 24],
            [`snip`, 22],
            [`peek`, 20],
            [`hop`, 18],
            [`wave`, 16],
          ],
        },
      }),
      (ra = {
        busy: {
          delayMs: [2200, 4500],
          acts: [
            [`scuttle`, 40],
            [`hop`, 20],
            [`snip`, 20],
            [`wave`, 12],
            [`spin`, 8],
          ],
        },
        offline: {
          delayMs: [2800, 5600],
          acts: [
            [`scuttle`, 55],
            [`peek`, 30],
            [`hop`, 15],
          ],
        },
      }),
      (ia = [
        [{ id: `crimson`, shell: `#ff4f40`, claw: `#ff775f` }, 26],
        [{ id: `coral`, shell: `#d0836a`, claw: `#de9b80` }, 26],
        [{ id: `teal`, shell: `#2fbfa7`, claw: `#5cd9c4` }, 10],
        [{ id: `violet`, shell: `#9f7dfa`, claw: `#bba4fd` }, 10],
        [{ id: `ink`, shell: `#5e6b7a`, claw: `#7b8996` }, 9],
        [{ id: `blue`, shell: `#4a7dfc`, claw: `#7fa4ff` }, 7],
        [{ id: `gold`, shell: `#f4b840`, claw: `#f9d47a` }, 5],
        [{ id: `calico`, shell: `#d97a3d`, claw: `#e89a63` }, 3],
        [{ id: `abyss`, shell: `#2c3b68`, claw: `#465b96` }, 2],
        [{ id: `ghost`, shell: `#dce8f2`, claw: `#ecf3fa` }, 1],
        [{ id: `split`, shell: `#ff4f40`, claw: `#ff775f` }, 1],
        [{ id: `retro`, shell: `#e8262c`, claw: `#f04a3e` }, 0.5],
      ]),
      (aa = ia.map(([e]) => e)),
      (oa = [
        [`none`, 62],
        [`sprout`, 14],
        [`patch`, 14],
        [`crown`, 10],
      ]),
      (sa = { month: 10, day: 24 }),
      (ca = [
        [`sleepy`, 25],
        [`zoomy`, 25],
        [`friendly`, 25],
        [`showoff`, 25],
      ]),
      (la = [
        [1.7, 25],
        [2, 55],
        [2.5, 20],
      ]),
      (ua = [
        [`round`, 40],
        [`squat`, 30],
        [`slender`, 30],
      ]),
      (da = [
        [`regular`, 55],
        [`dainty`, 25],
        [`mighty`, 20],
      ]),
      (fa = { round: { w: 1, h: 1 }, squat: { w: 1.14, h: 0.9 }, slender: { w: 0.88, h: 1.1 } }),
      (pa = { dainty: 0.85, regular: 1, mighty: 1.18 }),
      (ma = { left: [12, 38], right: [60, 84] }),
      (ha = 450),
      (ga = 350),
      (_a = 11e3),
      (va = [18, 50]),
      (ya = 1.7),
      (ba = 0.25),
      (xa = [15e3, 18e4]),
      (Sa = [9e4, 3e5]),
      (Ca = [36e4, 108e4]),
      (wa = [
        `Pinchy`,
        `Barnaby`,
        `Thermidor`,
        `Clawdette`,
        `Sheldon`,
        `Scuttles`,
        `Bisque`,
        `Crusty`,
        `Snips`,
        `Bubbles`,
        `Clawdia`,
        `Ferdinand`,
        `Maple`,
        `Pearl`,
        `Biscuit`,
        `Captain`,
        `Ziggy`,
        `Noodle`,
        `Waffles`,
        `Pippin`,
        `Squirt`,
        `Chip`,
        `Clementine`,
        `Moss`,
      ]),
      (Ta = {
        blue: `Blueberry`,
        gold: `Goldie`,
        calico: `Patches`,
        abyss: `Lantern`,
        ghost: `Boo`,
        split: `Picasso`,
        retro: `OG`,
      }),
      (Ea = `openclaw-lobster-logo-visit`),
      (Da = `openclaw.control.lobsterpet.gatewayVersion.v1`),
      (Oa = Math.trunc(Math.random() * 4294967295)),
      (ka = {
        crown: x`
    <path
      d="M46 12 L46 2 L53 8 L60 0 L67 8 L74 2 L74 12 Q60 8 46 12 Z"
      fill="#f6c945"
    />
  `,
        sprout: x`
    <g>
      <path d="M60 12 Q58 4 63 1" stroke="#3f9d63" stroke-width="3" stroke-linecap="round" fill="none" />
      <ellipse cx="67" cy="3" rx="5" ry="3" fill="#57c785" transform="rotate(-24 67 3)" />
    </g>
  `,
        patch: x`
    <g>
      <path d="M28 27 Q60 14 92 22" stroke="#101820" stroke-width="4" stroke-linecap="round" fill="none" />
      <circle cx="75" cy="32" r="9" fill="#101820" />
    </g>
  `,
        santa: x`
    <g>
      <path d="M47 10 Q54 1 68 3 L72 9 Z" fill="#e0312f" />
      <circle cx="71" cy="3.5" r="3.5" fill="#f5f7fa" />
      <ellipse cx="59" cy="10.5" rx="15" ry="3.5" fill="#f5f7fa" />
    </g>
  `,
        pumpkin: x`
    <g>
      <ellipse cx="60" cy="6.5" rx="8.5" ry="5.5" fill="#e8871e" />
      <path d="M56 2.5 Q56 6.5 56 10.5 M64 2.5 Q64 6.5 64 10.5" stroke="#c96a10" stroke-width="1.5" fill="none" />
      <path d="M60 1.5 Q60.5 0 63 0.5" stroke="#4c9a4c" stroke-width="2.5" stroke-linecap="round" fill="none" />
    </g>
  `,
        party: x`
    <g>
      <path d="M52 11 L60 0.5 L68 11 Z" fill="#7c5cff" />
      <path d="M55.5 6.5 L64.5 6.5" stroke="#ffd166" stroke-width="2" />
      <circle cx="60" cy="1" r="2.4" fill="#ff5c8a" />
    </g>
  `,
      }),
      (Aa = x`
  <g class="lob-spots" fill="#2a1f16" opacity="0.8">
    <ellipse cx="40" cy="50" rx="6" ry="4" transform="rotate(-15 40 50)" />
    <ellipse cx="72" cy="62" rx="7" ry="4.5" transform="rotate(18 72 62)" />
    <ellipse cx="55" cy="76" rx="5" ry="3.5" transform="rotate(-8 55 76)" />
    <ellipse cx="84" cy="42" rx="4" ry="3" transform="rotate(25 84 42)" />
    <ellipse cx="47" cy="18" rx="4.5" ry="3" transform="rotate(-20 47 18)" />
    <ellipse cx="30" cy="64" rx="4" ry="3" transform="rotate(12 30 64)" />
  </g>
`),
      (ja = x`
  <path
    class="lob-split-half"
    d="M60 8 C88 8 104 32 104 52 C104 72 90 90 76 95 L76 104 L66 104 L66 96 C64 96.8 62 97.1 60 97.1 L60 8 Z"
    fill="var(--lob-shell2, #46536b)"
  />
`),
      (Ma = x`
  <path
    d="M95 55 C112 53 119 39 116 25 C113 11 99 5 91 12 C88 15 87 19 88 23 C83 27 83 36 88 43 C91 49 93 52 95 55 Z"
    fill="var(--lob-claw)"
  />
  <path
    d="M92 14 C97 22 99 31 95 41"
    stroke="#b8151b"
    stroke-width="3"
    stroke-linecap="round"
    fill="none"
  />
`),
      (Na = x`
  <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
    <path d="M50 16 Q45 4 37 1" />
    <path d="M70 16 Q75 4 83 1" />
  </g>
`),
      (Pa = x`
  <g stroke="#0a1014" stroke-linecap="round" fill="none">
    <path d="M37 24 L51 28" stroke-width="3.5" />
    <path d="M69 28 L83 24" stroke-width="3.5" />
    <path d="M49 45 Q59 51 69 45 L72 42" stroke-width="3" />
  </g>
`),
      (Fa = x`
  <g class="lob-tail">
    <ellipse cx="16" cy="84" rx="11" ry="7" transform="rotate(-32 16 84)" />
    <ellipse cx="104" cy="84" rx="11" ry="7" transform="rotate(32 104 84)" />
  </g>
`),
      (Ia = x`
  <g class="lob-bindle">
    <path d="M70 62 L99 30" stroke="#8a5a2b" stroke-width="3.5" stroke-linecap="round" />
    <circle cx="101" cy="27" r="9.5" fill="#e8b04b" />
    <circle cx="98" cy="24" r="1.6" fill="#b6791f" />
    <circle cx="104" cy="29" r="1.6" fill="#b6791f" />
    <circle cx="100" cy="32" r="1.3" fill="#b6791f" />
  </g>
`),
      (La = new Set([`crown`, `sprout`, `santa`, `pumpkin`, `party`])),
      (Ra = x`
  <g class="lob-cap">
    <path d="M46 10 Q60 -3 74 10 L74 13 Q60 7 46 13 Z" fill="#f5f7fa" />
    <path d="M45 12 Q60 6 75 12 L75 16 Q60 10.5 45 16 Z" fill="#dfe7ee" />
    <circle cx="60" cy="2.5" r="1.8" fill="#3b6ea5" />
  </g>
`),
      (za = x`
  <g stroke="#0a1014" stroke-linecap="round" fill="none">
    <path d="M37 24 L51 28" stroke-width="3.5" />
    <path d="M69 28 L83 24" stroke-width="3.5" />
    <path d="M50 48 Q60 42 70 48" stroke-width="3" />
  </g>
`),
      (Ba = {
        perky: x`
    <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M46 14 Q38 4 31 7" />
      <path d="M74 14 Q82 4 89 7" />
    </g>
  `,
        droopy: x`
    <g class="lob-antennae" stroke="var(--lob-shell)" stroke-width="4" stroke-linecap="round" fill="none">
      <path d="M46 14 Q36 8 34 18" />
      <path d="M74 14 Q84 8 86 18" />
    </g>
  `,
      }),
      (K = class extends te {
        constructor(...e) {
          (super(...e),
            (this.seed = 0),
            (this.mode = `idle`),
            (this.visitsEnabled = !0),
            (this.runOutcome = `ok`),
            (this.soundsEnabled = !1),
            (this.gatewayVersion = null),
            (this.act = null),
            (this.spotPct = 80),
            (this.facing = 1),
            (this.entering = !1),
            (this.presence = `out`),
            (this.anchor = `ledge`),
            (this.scheduledVisiting = !1),
            (this.logoPerched = !1),
            (this.logoPlanned = !1),
            (this.logoDone = !1),
            (this.lastLogoPhase = `out`),
            (this.dismissed = !1),
            (this.grumpy = !1),
            (this.vigil = !1),
            (this.outcomePresenceOwner = null),
            (this.passer = null),
            (this.movingDay = !1),
            (this.movingDayChecked = !1),
            (this.anniversary = !1),
            (this.sailorDay = !1),
            (this.shellVisible = !1),
            (this.shellSpotPct = 50),
            (this.shellScale = 2),
            (this.molted = !1),
            (this.moltPlanned = !1),
            (this.twinPlanned = !1),
            (this.shellTimer = null),
            (this.passerTimer = null),
            (this.passerEndTimer = null),
            (this.passerWatchTimer = null),
            (this.familiarity = { tier: `regular`, wary: !1, visits: 0, shoos: 0 }),
            (this.greetedThisLoad = !1),
            (this.look = null),
            (this.rng = H(0)),
            (this.visitRng = H(0)),
            (this.idleTimer = null),
            (this.actEndTimer = null),
            (this.enterTimer = null),
            (this.visitTimer = null),
            (this.leaveTimer = null),
            (this.grumpyTimer = null),
            (this.vigilTimer = null),
            (this.holdTimer = null),
            (this.holdPetted = !1),
            (this.audioCtx = null),
            (this.pokeTimes = []),
            (this.lastGazeAt = 0),
            (this.restartPending = !1),
            (this.handleVisibilityChange = () => {
              document.hidden
                ? ((this.outcomePresenceOwner = null), this.clearActTimers(), (this.act = null))
                : this.scheduleNextAct();
            }),
            (this.handleHoldStart = () => {
              G() ||
                ((this.holdPetted = !1),
                this.holdTimer !== null && window.clearTimeout(this.holdTimer),
                (this.holdTimer = window.setTimeout(() => {
                  ((this.holdTimer = null),
                    (this.holdPetted = !0),
                    (this.grumpy = !1),
                    this.playChirp(`pet`),
                    this.performAct(`pet`));
                }, 600)));
            }),
            (this.handleHoldEnd = () => {
              (this.holdTimer !== null &&
                (window.clearTimeout(this.holdTimer),
                (this.holdTimer = null),
                this.holdPetted || this.pokeNow()),
                (this.holdPetted = !1));
            }),
            (this.handleHoldCancel = () => {
              (this.holdTimer !== null &&
                (window.clearTimeout(this.holdTimer), (this.holdTimer = null)),
                (this.holdPetted = !1));
            }),
            (this.handleGaze = (e) => {
              if (this.presence !== `in` || this.act !== null || this.vigil || G()) return;
              let t = Date.now();
              if (t - this.lastGazeAt < 120) return;
              this.lastGazeAt = t;
              let n = this.querySelector(`.lobster-pet:not(.lobster-pet--shell)`);
              if (!n) return;
              let r = n.getBoundingClientRect(),
                i = r.left + r.width / 2,
                a = e.clientX < i ? -1 : 1;
              a !== this.facing && (this.facing = a);
            }),
            (this.handleShoo = (e) => {
              (e.preventDefault(), (this.dismissed = !0), Di());
            }));
        }
        createRenderRoot() {
          return this;
        }
        connectedCallback() {
          (super.connectedCallback(),
            document.addEventListener(`visibilitychange`, this.handleVisibilityChange),
            document.addEventListener(`pointermove`, this.handleGaze, { passive: !0 }));
        }
        disconnectedCallback() {
          (document.removeEventListener(`visibilitychange`, this.handleVisibilityChange),
            this.clearActTimers(),
            this.clearVisitTimers(),
            this.grumpyTimer !== null &&
              (window.clearTimeout(this.grumpyTimer), (this.grumpyTimer = null)),
            this.shellTimer !== null &&
              (window.clearTimeout(this.shellTimer), (this.shellTimer = null)));
          for (let e of [
            this.vigilTimer,
            this.holdTimer,
            this.passerTimer,
            this.passerEndTimer,
            this.passerWatchTimer,
          ])
            e !== null && window.clearTimeout(e);
          ((this.vigilTimer = null),
            (this.holdTimer = null),
            (this.passerTimer = null),
            (this.passerEndTimer = null),
            (this.passerWatchTimer = null),
            (this.audioCtx &&= (this.audioCtx.close().catch(() => {}), null)),
            document.removeEventListener(`pointermove`, this.handleGaze),
            super.disconnectedCallback());
        }
        wantsVisible() {
          return (
            this.visitsEnabled &&
            !this.dismissed &&
            (this.mode === `offline` ||
              this.vigil ||
              this.outcomePresenceOwner !== null ||
              this.scheduledVisiting)
          );
        }
        willUpdate(e) {
          if (this.look === null || e.has(`seed`))
            ((this.look = Xi(this.seed)),
              (this.rng = H(this.seed ^ 2654435769)),
              (this.visitRng = H(this.seed ^ 99282957)),
              (this.spotPct = this.look.spotPct),
              (this.facing = this.look.facing),
              this.clearActTimers(),
              (this.act = null),
              (this.dismissed = !1),
              (this.presence = `out`),
              (this.molted = !1),
              (this.shellVisible = !1),
              this.shellTimer !== null &&
                (window.clearTimeout(this.shellTimer), (this.shellTimer = null)),
              (this.moltPlanned = Vi(this.seed)),
              (this.twinPlanned = Hi(this.seed)),
              (this.logoPlanned = Ui(this.seed)),
              (this.logoDone = !1),
              (this.logoPerched = !1),
              (this.familiarity = Oi()),
              (this.sailorDay = o(new Date())),
              (this.greetedThisLoad = !1),
              this.scheduleVisits(),
              this.schedulePasser(),
              (this.vigil = !1),
              (this.outcomePresenceOwner = null),
              this.trackVigil());
          else if (e.has(`mode`)) {
            this.logoPerched && this.mode !== `idle` && (this.logoPerched = !1);
            let t = e.get(`mode`) === `busy` && this.mode === `idle`,
              n = t && this.vigil ? `vigil` : null;
            if ((this.trackVigil(), this.presence === `in` && !G())) {
              let e =
                this.runOutcome === `error`
                  ? `droop`
                  : this.runOutcome === `aborted`
                    ? `startle`
                    : `cheer`;
              this.performAct(t ? e : `startle`, n);
            }
          }
          (!this.movingDayChecked &&
            this.gatewayVersion &&
            ((this.movingDayChecked = !0), (this.movingDay = Ki(this.gatewayVersion))),
            this.reconcilePresence());
        }
        reconcilePresence() {
          let e = this.wantsVisible();
          if (e && this.presence !== `in`) {
            (this.leaveTimer !== null &&
              (window.clearTimeout(this.leaveTimer), (this.leaveTimer = null)),
              this.presence === `out` &&
                (this.rollPerch(),
                (this.logoPerched =
                  this.logoPlanned &&
                  !this.logoDone &&
                  this.scheduledVisiting &&
                  this.mode === `idle`),
                this.logoPerched && (this.logoDone = !0),
                this.look &&
                  ((this.anniversary = Ai(
                    Si().get(this.look.palette.id)?.firstSeenAt ?? null,
                    new Date(),
                  )),
                  Ci(this.look.palette.id, { name: Bi(this.look, this.seed) }),
                  Ei())),
              (this.presence = `in`),
              (this.entering = !G()),
              (this.restartPending = !0));
            return;
          }
          !e &&
            this.presence === `in` &&
            ((this.outcomePresenceOwner = null),
            this.clearActTimers(),
            (this.act = null),
            (this.entering = !1),
            (this.presence = `leaving`),
            (this.leaveTimer = window.setTimeout(() => {
              ((this.leaveTimer = null), (this.presence = `out`), (this.logoPerched = !1));
            }, ga)));
        }
        updated() {
          (this.dispatchLogoPhase(),
            this.restartPending &&
              ((this.restartPending = !1),
              (this.enterTimer = window.setTimeout(() => {
                ((this.enterTimer = null),
                  (this.entering = !1),
                  !this.greetedThisLoad &&
                    this.familiarity.tier === `friend` &&
                    this.presence === `in` &&
                    !this.logoPerched &&
                    !G() &&
                    ((this.greetedThisLoad = !0), this.performAct(`wave`)));
              }, ha)),
              this.scheduleNextAct()));
        }
        logoVisitPhase() {
          return !this.logoPerched || !this.visitsEnabled || this.dismissed
            ? `out`
            : this.presence === `in`
              ? `in`
              : this.presence === `leaving`
                ? `leaving`
                : `out`;
        }
        dispatchLogoPhase() {
          let e = this.logoVisitPhase();
          if (e === this.lastLogoPhase) return;
          this.lastLogoPhase = e;
          let t = e === `out` || !this.look ? null : this.look,
            n = t && this.anniversary && t.accessory !== `party` ? { ...t, accessory: `party` } : t;
          this.dispatchEvent(
            new CustomEvent(Ea, {
              detail: { phase: e, look: n, name: n ? Bi(n, this.seed) : null },
              bubbles: !0,
              composed: !0,
            }),
          );
        }
        playChirp(e) {
          if (this.soundsEnabled)
            try {
              let t = window.AudioContext;
              if (!t) return;
              this.audioCtx ??= new t();
              let n = this.audioCtx;
              n.state === `suspended` && n.resume();
              let r = n.currentTime,
                i = n.createOscillator(),
                a = n.createGain();
              ((i.type = `sine`),
                e === `poke`
                  ? (i.frequency.setValueAtTime(330, r),
                    i.frequency.exponentialRampToValueAtTime(165, r + 0.09))
                  : (i.frequency.setValueAtTime(392, r),
                    i.frequency.exponentialRampToValueAtTime(523, r + 0.18)),
                a.gain.setValueAtTime(1e-4, r),
                a.gain.exponentialRampToValueAtTime(0.05, r + 0.02),
                a.gain.exponentialRampToValueAtTime(1e-4, r + (e === `poke` ? 0.12 : 0.24)),
                i.connect(a).connect(n.destination),
                i.start(r),
                i.stop(r + 0.26));
            } catch {}
        }
        pokeNow() {
          this.playChirp(`poke`);
          let e = Date.now();
          if (
            ((this.pokeTimes = [...this.pokeTimes.filter((t) => e - t < 6e3), e]),
            this.pokeTimes.length >= 10 && this.mode !== `offline`)
          ) {
            this.huffOff();
            return;
          }
          (this.pokeTimes.length >= 3 && this.enterGrumpy(), this.performAct(`startle`));
        }
        enterGrumpy() {
          ((this.grumpy = !0),
            this.grumpyTimer !== null && window.clearTimeout(this.grumpyTimer),
            (this.grumpyTimer = window.setTimeout(() => {
              ((this.grumpyTimer = null), (this.grumpy = !1));
            }, 6e4)));
        }
        huffOff() {
          ((this.pokeTimes = []),
            (this.grumpy = !1),
            this.clearVisitTimers(),
            (this.scheduledVisiting = !1),
            this.armArrival(W(this.visitRng, Ca[0], Ca[1])));
        }
        trackVigil() {
          (this.vigilTimer !== null &&
            (window.clearTimeout(this.vigilTimer), (this.vigilTimer = null)),
            this.mode === `busy`
              ? (this.vigilTimer = window.setTimeout(() => {
                  ((this.vigilTimer = null),
                    (this.vigil = !0),
                    this.clearActTimers(),
                    (this.act = null));
                }, 6e5))
              : (this.vigil = !1));
        }
        clearActTimers() {
          for (let e of [this.idleTimer, this.actEndTimer, this.enterTimer])
            e !== null && window.clearTimeout(e);
          ((this.idleTimer = null), (this.actEndTimer = null), (this.enterTimer = null));
        }
        clearVisitTimers() {
          for (let e of [this.visitTimer, this.leaveTimer]) e !== null && window.clearTimeout(e);
          ((this.visitTimer = null), (this.leaveTimer = null));
        }
        scheduleVisits() {
          if ((this.clearVisitTimers(), (this.scheduledVisiting = !1), this.visitRng() < ba))
            return;
          let e = Ni[this.familiarity.tier];
          this.armArrival(W(this.visitRng, xa[0], xa[1]) * e.firstDelayMul);
        }
        armArrival(e) {
          this.visitTimer = window.setTimeout(() => {
            ((this.visitTimer = null),
              this.rollPerch(),
              (this.scheduledVisiting = !0),
              this.armDeparture(
                W(this.visitRng, Sa[0], Sa[1]) * Ni[this.familiarity.tier].stayMul,
              ));
          }, e);
        }
        armDeparture(e) {
          this.visitTimer = window.setTimeout(() => {
            ((this.visitTimer = null), (this.scheduledVisiting = !1));
            let e = Ni[this.familiarity.tier],
              t = this.familiarity.wary ? Ni.waryGapMul : 1;
            this.armArrival(W(this.visitRng, Ca[0], Ca[1]) * e.gapMul * t);
          }, e);
        }
        schedulePasser() {
          for (let e of [this.passerTimer, this.passerEndTimer, this.passerWatchTimer])
            e !== null && window.clearTimeout(e);
          ((this.passerTimer = null),
            (this.passerEndTimer = null),
            (this.passerWatchTimer = null),
            (this.passer = null));
          let e = Wi(this.seed);
          !e ||
            G() ||
            (this.passerTimer = window.setTimeout(() => {
              ((this.passerTimer = null),
                !(!this.visitsEnabled || document.hidden) &&
                  ((this.passer = e),
                  this.watchPasser(e),
                  (this.passerEndTimer = window.setTimeout(() => {
                    ((this.passerEndTimer = null), (this.passer = null), this.scheduleNextAct());
                  }, _a))));
            }, e.atMs));
        }
        watchPasser(e) {
          let t = (e) => {
            this.presence === `in` && this.act !== `scuttle` && !this.vigil && (this.facing = e);
          };
          (t(e.direction === 1 ? -1 : 1),
            (this.passerWatchTimer = window.setTimeout(() => {
              ((this.passerWatchTimer = null), t(e.direction));
            }, _a / 2)));
        }
        rollPerch() {
          ((this.anchor = this.visitRng() < 0.6 ? `ledge` : `bar`),
            this.setAttribute(`data-spot`, this.anchor));
          let e = this.currentZone();
          ((this.spotPct = Math.round(W(this.visitRng, e[0], e[1]))),
            (this.facing = this.visitRng() < 0.5 ? 1 : -1));
        }
        currentZone() {
          if (this.anchor === `bar`) return va;
          let e = this.look?.side ?? `right`;
          return ma[e];
        }
        actProfile() {
          return this.mode === `busy` || this.mode === `offline`
            ? ra[this.mode]
            : qi()
              ? na.sleepy
              : this.look
                ? na[this.look.personality]
                : null;
        }
        scheduleNextAct() {
          if (
            !this.look ||
            this.presence !== `in` ||
            this.logoPerched ||
            this.vigil ||
            this.passer !== null ||
            this.idleTimer !== null ||
            this.actEndTimer !== null ||
            G()
          )
            return;
          let e = this.actProfile();
          if (!e) return;
          let t = W(this.rng, e.delayMs[0], e.delayMs[1]);
          this.idleTimer = window.setTimeout(() => {
            this.idleTimer = null;
            let e = this.actProfile();
            if (!(!e || document.hidden || this.presence !== `in` || this.passer !== null)) {
              if (this.moltPlanned && !this.molted && this.mode === `idle`) {
                this.performAct(`molt`);
                return;
              }
              this.performAct(U(this.rng, e.acts));
            }
          }, t);
        }
        performAct(e, t = null) {
          (this.clearActTimers(),
            (this.outcomePresenceOwner = t),
            (this.entering = !1),
            e === `scuttle` && this.startScuttle(),
            (this.act = e),
            (this.actEndTimer = window.setTimeout(() => {
              if (
                ((this.actEndTimer = null),
                (this.act = null),
                e === `molt` && this.completeMolt(),
                e === `droop`)
              ) {
                this.performAct(`sweep`, t);
                return;
              }
              ((this.outcomePresenceOwner = null), this.wantsVisible() && this.scheduleNextAct());
            }, ta[e])));
        }
        completeMolt() {
          if (((this.molted = !0), this.look)) {
            let e = [1.7, 2, 2.5],
              t = e.indexOf(this.look.scale);
            ((this.shellScale = this.look.scale),
              (this.look = {
                ...this.look,
                scale: fe(e[Math.min(t + 1, e.length - 1)], `lobster molt size tier`),
              }));
          }
          ((this.shellSpotPct = this.spotPct), (this.shellVisible = !0));
          let e = this.currentZone();
          ((this.spotPct = Math.min(
            e[1],
            Math.max(e[0], this.spotPct + (this.facing === 1 ? 9 : -9)),
          )),
            this.shellTimer !== null && window.clearTimeout(this.shellTimer),
            (this.shellTimer = window.setTimeout(() => {
              ((this.shellTimer = null), (this.shellVisible = !1));
            }, 6e4)));
        }
        startScuttle() {
          if (!this.look) return;
          let e = this.currentZone(),
            t = Math.round(W(this.rng, e[0], e[1]));
          (Math.abs(t - this.spotPct) < 4 &&
            (t = Math.abs(e[0] - this.spotPct) > Math.abs(e[1] - this.spotPct) ? e[0] : e[1]),
            (this.facing = t < this.spotPct ? -1 : 1),
            (this.spotPct = t));
        }
        spriteStyle(e, t, n, r) {
          return [
            `--lob-shell:${e.palette.shell}`,
            `--lob-claw:${e.palette.claw}`,
            `--lob-scale:${t}`,
            `--lob-x:${n}%`,
            `--lob-face:${r}`,
            `--lob-blink-delay:${e.blinkDelayS}s`,
            `--lob-w:${fa[e.build].w}`,
            `--lob-h:${fa[e.build].h}`,
            `--lob-claw-scale:${pa[e.clawSize]}`,
          ].join(`;`);
        }
        anchoredScale(e) {
          return this.anchor === `bar` ? Math.min(e, ya) : e;
        }
        renderSprite(e, t) {
          let n = this.anniversary && e.accessory !== `party` ? { ...e, accessory: `party` } : e,
            r = [
              `lobster-pet`,
              `lobster-pet--${this.mode}`,
              `lobster-pet--palette-${e.palette.id}`,
              t ? `lobster-pet--twin` : ``,
              n.accessory === `party` ? `lobster-pet--party` : ``,
              this.presence === `leaving` ? `lobster-pet--away` : ``,
              this.entering ? `lobster-pet--entering` : ``,
              this.grumpy ? `lobster-pet--grumpy` : ``,
              this.vigil ? `lobster-pet--vigil` : ``,
              this.act ? `lobster-pet--act-${this.act}` : ``,
            ]
              .filter(Boolean)
              .join(` `),
            i = this.currentZone(),
            a = t
              ? Math.min(i[1], Math.max(i[0], this.spotPct + (this.facing === 1 ? -12 : 12)))
              : this.spotPct,
            o = this.anchoredScale(t ? e.scale * 0.55 : e.scale),
            s = t
              ? `${this.spriteStyle(e, o, a, this.facing === 1 ? -1 : 1)};--lob-act-delay:0.18s`
              : this.spriteStyle(e, o, a, this.facing),
            c = ki(this.familiarity.visits),
            l = Bi(e, this.seed),
            u = c ? `${c} ${l}` : l,
            d = this.movingDay && !t;
          return v`
      <div
        class=${r}
        style=${s}
        aria-hidden="true"
        title=${t ? `${u} Jr.` : d ? `${u} · just moved in` : u}
        @pointerdown=${this.handleHoldStart}
        @pointerup=${this.handleHoldEnd}
        @pointercancel=${this.handleHoldCancel}
        @pointerleave=${this.handleHoldCancel}
        @contextmenu=${this.handleShoo}
      >
        <div class="lobster-pet__body">
          ${ea(n, { grumpy: this.grumpy, bindle: d, sailorCap: this.sailorDay })}
          <span class="lobster-pet__z" style="--i:0">z</span>
          <span class="lobster-pet__z" style="--i:1">z</span>
          <span class="lobster-pet__z" style="--i:2">Z</span>
          <span class="lobster-pet__bubble" style="--i:0"></span>
          <span class="lobster-pet__bubble" style="--i:1"></span>
          <span class="lobster-pet__bubble" style="--i:2"></span>
          <span class="lobster-pet__heart">♥</span>
          <svg class="lobster-pet__broom" viewBox="0 0 24 40" aria-hidden="true">
            <path d="M12 2 L12 24" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round" />
            <path d="M6 24 L18 24 L21 38 L3 38 Z" fill="#e8b04b" />
            <path
              d="M7.5 28 L6.5 36 M12 28 L12 36 M16.5 28 L17.5 36"
              stroke="#b6791f"
              stroke-width="1.5"
            />
          </svg>
        </div>
      </div>
    `;
        }
        renderShell(e) {
          return v`
      <div class="lobster-pet lobster-pet--shell" style=${this.spriteStyle(e, this.anchoredScale(this.shellScale), this.shellSpotPct, this.facing)} aria-hidden="true">
        <div class="lobster-pet__body">${ea(e, { shell: !0 })}</div>
      </div>
    `;
        }
        render() {
          let e = this.look;
          if (!e) return b;
          let t = this.presence !== `out` && !this.logoPerched,
            n = this.shellVisible && this.visitsEnabled && !this.dismissed,
            r = this.passer !== null && this.visitsEnabled;
          return !t && !n && !r
            ? b
            : v`
      ${n ? this.renderShell(e) : b}
      ${t ? this.renderSprite(e, !1) : b}
      ${t && this.twinPlanned ? this.renderSprite(e, !0) : b}
      ${r && this.passer ? this.renderPasser(this.passer, e) : b}
    `;
        }
        renderPasser(e, t) {
          let n = e.kind === `crab`,
            r = n ? t : Gi(this.seed, t.palette.id);
          return v`
      <div
        class=${[`lobster-pet`, `lobster-pet--passer`, n ? `lobster-pet--crab` : `lobster-pet--palette-${r.palette.id}`, e.direction === 1 ? `lobster-pet--passer-ltr` : `lobster-pet--passer-rtl`].join(` `)}
        style=${n ? `--lob-scale:2;--lob-w:1;--lob-h:0.82;--lob-face:1` : this.spriteStyle(r, Math.min(r.scale, 2), 0, e.direction)}
        aria-hidden="true"
        title=${n ? `definitely a lobster` : `a stranger`}
      >
        <div class="lobster-pet__body">
          ${n ? $i() : ea(r, { standalone: !0 })}
        </div>
      </div>
    `;
        }
      }),
      i([_({ attribute: !1 })], K.prototype, `seed`, void 0),
      i([_({ attribute: !1 })], K.prototype, `mode`, void 0),
      i([_({ attribute: !1 })], K.prototype, `visitsEnabled`, void 0),
      i([_({ attribute: !1 })], K.prototype, `runOutcome`, void 0),
      i([_({ attribute: !1 })], K.prototype, `soundsEnabled`, void 0),
      i([_({ attribute: !1 })], K.prototype, `gatewayVersion`, void 0),
      i([g()], K.prototype, `act`, void 0),
      i([g()], K.prototype, `spotPct`, void 0),
      i([g()], K.prototype, `facing`, void 0),
      i([g()], K.prototype, `entering`, void 0),
      i([g()], K.prototype, `presence`, void 0),
      i([g()], K.prototype, `anchor`, void 0),
      i([g()], K.prototype, `scheduledVisiting`, void 0),
      i([g()], K.prototype, `logoPerched`, void 0),
      i([g()], K.prototype, `dismissed`, void 0),
      i([g()], K.prototype, `grumpy`, void 0),
      i([g()], K.prototype, `vigil`, void 0),
      i([g()], K.prototype, `outcomePresenceOwner`, void 0),
      i([g()], K.prototype, `passer`, void 0),
      i([g()], K.prototype, `movingDay`, void 0),
      i([g()], K.prototype, `anniversary`, void 0),
      i([g()], K.prototype, `shellVisible`, void 0),
      customElements.get(`openclaw-lobster-pet`) ||
        customElements.define(`openclaw-lobster-pet`, K));
  });
function Ha(e) {
  for (let t of Ka) {
    let n = e.find((e) => e.state === t);
    if (n) return n.url;
  }
  return null;
}
async function Ua(e) {
  if (!e.pullRequestsAvailable) return null;
  try {
    return Ha(
      (
        await e.client.request(`controlUi.sessionPullRequests`, {
          sessionKey: e.sessionKey,
          ...(e.agentId ? { agentId: e.agentId } : {}),
        })
      ).pullRequests,
    );
  } catch {
    return null;
  }
}
async function Wa(e) {
  let t = e.worktreeId;
  if (!t) return null;
  try {
    return (
      (await e.client.request(`worktrees.list`, {})).worktrees.find(
        (e) => e.id === t && e.removedAt === void 0,
      )?.path ?? null
    );
  } catch {
    return null;
  }
}
async function Ga(e) {
  let [t, n] = await Promise.all([Ua(e), Wa(e)]);
  return { pullRequestUrl: t, worktreePath: n };
}
var Ka,
  qa = e(() => {
    Ka = [`open`, `draft`, `merged`, `closed`];
  });
function Ja(e, t) {
  let n = e.filter((e) => e.active || e.pinned).length,
    r = Math.max(0, t - n);
  return e.filter((e) => (e.active || e.pinned ? !0 : r === 0 ? !1 : (--r, !0)));
}
function Ya() {
  return Ae(w()?.getItem($a));
}
function Xa() {
  return w()?.getItem(eo) === `true`;
}
function Za() {
  try {
    let e = w()?.getItem(io),
      t = e ? JSON.parse(e) : [];
    return new Set(
      Array.isArray(t) ? t.flatMap((e) => (typeof e == `string` && e ? [e] : [])) : [],
    );
  } catch {
    return new Set();
  }
}
function Qa(e, t) {
  return `${e}\u0000${t}`;
}
var $a,
  eo,
  to,
  no,
  ro,
  io,
  ao,
  oo,
  q,
  so = e(() => {
    (p(),
      y(),
      h(),
      se(),
      oe(),
      rn(),
      Vt(),
      sn(),
      zt(),
      Lt(),
      A(),
      xn(),
      Pn(),
      Gn(),
      ir(),
      Cr(),
      Ar(),
      Mr(),
      at(),
      I(),
      mt(),
      et(),
      _e(),
      Ce(),
      Pt(),
      nt(),
      Ot(),
      Ke(),
      Tt(),
      be(),
      wt(),
      Ne(),
      Re(),
      E(),
      Ze(),
      Le(),
      Kr(),
      Yr(),
      oi(),
      di(),
      vi(),
      M(),
      Va(),
      qa(),
      P(),
      t(),
      ($a = `openclaw:sidebar:sessions:grouping`),
      (eo = `openclaw:sidebar:sessions:show-cron`),
      (to = 60),
      (no = 10),
      (ro = 30),
      (io = `openclaw:sidebar:sessions:collapsed-sections`),
      (ao = /Mac|iP(hone|ad|od)/i.test(globalThis.navigator?.platform ?? ``) ? `⌘K` : `Ctrl K`),
      (oo = [
        { mode: `created`, labelKey: `chat.sidebar.sortCreated` },
        { mode: `updated`, labelKey: `chat.sidebar.sortUpdated` },
      ]),
      (q = class extends T {
        constructor() {
          (super(),
            (this.basePath = ``),
            (this.activePluginTabId = ``),
            (this.connected = !1),
            (this.terminalAvailable = !1),
            (this.catalogOpenTarget = `viewer`),
            (this.canPairDevice = !1),
            (this.sessionKey = ``),
            (this.sidebarPinnedRoutes = Wt),
            (this.pinnedAgentIds = []),
            (this.themeMode = `system`),
            (this.lobsterPetVisits = !0),
            (this.lobsterPetSounds = !1),
            (this.gatewayVersion = null),
            (this.devGitBranch = null),
            (this.updateAvailable = null),
            (this.updateRunning = !1),
            (this.onUpdate = () => void 0),
            (this.draftSessionAgentId = ``),
            (this.customizeMenuPosition = null),
            (this.moreMenuPosition = null),
            (this.sessionMenu = null),
            (this.selectedSessionKeys = new Set()),
            (this.sessionSelectionAnchor = null),
            (this.sessionMenuWork = null),
            (this.sessionGroupMenu = null),
            (this.draggingSessionKey = null),
            (this.draggingSessionGroup = null),
            (this.sessionDropTarget = null),
            (this.sessionGroupDropTarget = null),
            (this.collapsedSessionSections = Za()),
            (this.sessionSortMode = `created`),
            (this.sessionsGrouping = Ya()),
            (this.sessionsShowCron = Xa()),
            (this.sessionSortMenuPosition = null),
            (this.agentMenuPosition = null),
            (this.agentMenuFilter = ``),
            (this.visibleSessionLimit = no),
            (this.sessionsResult = null),
            (this.sessionsAgentId = null),
            (this.sessionsLoading = !1),
            (this.sessionsScrollState = `none`),
            (this.sessionCatalogs = []),
            (this.loadingMoreSessionCatalogIds = new Set()),
            (this.sessionMutationError = null),
            (this.logoVisit = null),
            (this.subscriptions = new qe(this)),
            (this.customizeMenuTrigger = null),
            (this.moreMenuTrigger = null),
            (this.sessionMenuTrigger = null),
            (this.catalogMenu = new Jr({
              beforeOpen: () => void this.dismissTransientMenus(),
              requestUpdate: () => this.requestUpdate(),
              terminalAvailable: () => this.terminalAvailable,
              navigate: (e) => this.onNavigate?.(`chat`, { search: e }),
            })),
            (this.sessionMenuWorkVersion = 0),
            (this.sessionGroupMenuTrigger = null),
            (this.sessionSortMenuTrigger = null),
            (this.agentMenuTrigger = null),
            (this.sessionRowsByAgent = {}),
            (this.sessionCreatedOrder = new Map()),
            (this.sessionsSource = null),
            (this.reconnectListRevision = null),
            (this.gatewaySource = null),
            (this.gatewayClient = null),
            (this.gatewayConnected = !1),
            (this.sessionMutationEpoch = 0),
            (this.sessionsScrollElement = null),
            (this.sessionsScrollResizeObserver = null),
            (this.sessionCatalogTimer = null),
            (this.sessionCatalogAgentId = null),
            (this.sessionCatalogGeneration = 0),
            (this.sessionCatalogRevision = 0),
            (this.sessionCatalogRequestGeneration = null),
            (this.sessionCatalogPageDepths = new Map()),
            (this.sessionCatalogRevisions = new Map()),
            (this.routePreloadTimers = new Map()),
            (this.handleCatalogSessionContinued = (e) => {
              let t = e.detail;
              t?.sessionKey &&
                ((this.sessionCatalogs = mi(this.sessionCatalogs, t)),
                (this.sessionCatalogRevision += 1),
                this.sessionCatalogRevisions.set(
                  t.catalogId,
                  (this.sessionCatalogRevisions.get(t.catalogId) ?? 0) + 1,
                ));
            }),
            (this.updateSessions = (e) => {
              let t = e.state,
                n = this.context?.gateway,
                r =
                  n !== void 0 &&
                  n === this.gatewaySource &&
                  n.snapshot.client !== null &&
                  n.snapshot.client === this.gatewayClient &&
                  !n.snapshot.connected;
              r &&
                this.reconnectListRevision === null &&
                (this.reconnectListRevision = e.canonicalListRevision + 1);
              let i =
                this.reconnectListRevision !== null &&
                e.canonicalListRevision < this.reconnectListRevision;
              if (!r && !i) {
                if (
                  ((this.reconnectListRevision = null),
                  (this.sessionsResult = t.result),
                  (this.sessionsAgentId = t.agentId),
                  t.result)
                )
                  for (let e of t.result.sessions)
                    e.key &&
                      !this.sessionCreatedOrder.has(e.key) &&
                      this.sessionCreatedOrder.set(e.key, this.sessionCreatedOrder.size);
                t.result &&
                  t.agentId &&
                  (this.sessionRowsByAgent[C(t.agentId)] = t.result.sessions);
              }
              this.sessionsLoading = t.loading;
            }),
            (this.handleLogoVisit = (e) => {
              let t = e.detail;
              this.logoVisit = t.phase === `out` || !t.look ? null : t;
            }),
            (this.compareSidebarSessionRows = (e, t) =>
              this.sessionSortMode === `updated`
                ? Qe(e, t)
                : (this.sessionCreatedOrder.get(e.key) ?? 2 ** 53 - 1) -
                  (this.sessionCreatedOrder.get(t.key) ?? 2 ** 53 - 1)),
            (this.selectSession = (e) => {
              (this.context?.gateway.setSessionKey(e),
                this.onNavigate?.(`chat`, { search: Se(e) }));
            }),
            (this.replaceCurrentSession = (e) => {
              (this.context?.gateway.setSessionKey(e),
                this.activeRouteId === `chat` && this.onNavigate?.(`chat`, { search: Se(e) }));
            }),
            (this.expandAgent = (e) => {
              let t = this.context;
              if (!t) return;
              let n = C(e);
              if (n === C(this.expandedAgentId())) {
                t.agentSelection.setScope(n);
                return;
              }
              (this.clearSessionSelection(),
                (this.visibleSessionLimit = no),
                t.agentSelection.set(n),
                t.sessions.refresh({
                  agentId: n,
                  limit: to,
                  includeGlobal: !0,
                  includeUnknown: !0,
                  configuredAgentsOnly: !0,
                  force: !0,
                }));
            }),
            (this.patchSession = async (e, t, n = this.beginSessionMutation()) => {
              if (!n) return `stale`;
              let r = ze(e.key)?.agentId ?? n.selectedAgentId;
              try {
                let i = await n.sessions.patch(e.key, t, { agentId: r });
                return this.isSessionMutationScopeCurrent(n)
                  ? i
                    ? (t.archived !== !0 ||
                        !e.active ||
                        this.replaceCurrentSession(
                          Te({
                            agentId: r,
                            mainKey: De({
                              agentsList: n.context.agents.state.agentsList,
                              hello: n.gateway.snapshot.hello,
                            }),
                          }),
                        ),
                      `completed`)
                    : (n.sessions.state.error &&
                        this.publishSessionMutationError(n, n.sessions.state.error),
                      `failed`)
                  : `stale`;
              } catch (e) {
                return this.isSessionMutationScopeCurrent(n)
                  ? (this.publishSessionMutationError(n, e), `failed`)
                  : `stale`;
              }
            }),
            (this.cancelPreload = (e) => {
              un(this.routePreloadTimers, e);
            }),
            (this.openCustomizeMenuFromContext = (e) => {
              (e.preventDefault(), this.openCustomizeMenu(e.clientX, e.clientY));
            }),
            this.addEventListener(Ea, this.handleLogoVisit),
            this.subscriptions
              .watch(
                () => this.context?.gateway,
                (e, t) => e.subscribe(t),
                (e) => this.synchronizeGateway(e),
              )
              .watch(
                () => this.context?.sessions,
                (e, t) => e.subscribe(t),
                (e) => this.synchronizeSessions(e),
              )
              .effect(
                () => this.context?.sessions,
                (e) => e.subscribeCreated((e) => this.promoteCreatedSession(e)),
              )
              .watch(
                () => this.context?.agents,
                (e, t) => e.subscribe(t),
              )
              .watch(
                () => this.context?.agentSelection,
                (e, t) => e.subscribe(t),
              ));
        }
        connectedCallback() {
          (super.connectedCallback(),
            document.addEventListener($e, this.handleCatalogSessionContinued));
        }
        disconnectedCallback() {
          (document.removeEventListener($e, this.handleCatalogSessionContinued),
            this.dismissTransientMenus(),
            this.invalidateSessionMutations(),
            (this.gatewaySource = null),
            (this.gatewayClient = null),
            (this.gatewayConnected = !1),
            (this.sessionCatalogGeneration += 1));
          for (let e of this.routePreloadTimers.values()) globalThis.clearTimeout(e);
          (this.routePreloadTimers.clear(),
            this.sessionsScrollResizeObserver?.disconnect(),
            (this.sessionsScrollResizeObserver = null),
            (this.sessionsScrollElement = null),
            (this.sessionCatalogTimer &&=
              (globalThis.clearTimeout(this.sessionCatalogTimer), null)),
            super.disconnectedCallback());
        }
        updated() {
          this.syncSessionsScrollObserver();
          let e = this.context?.gateway.snapshot;
          (this.context && this.synchronizeSessionCatalogAgent(this.expandedAgentId()),
            !(
              !e?.connected ||
              !e.client ||
              ve(e, `sessions.catalog.list`) !== !0 ||
              this.sessionCatalogTimer ||
              this.sessionCatalogRequestGeneration === this.sessionCatalogGeneration
            ) && this.refreshSessionCatalogs());
        }
        synchronizeSessionCatalogAgent(e) {
          e !== this.sessionCatalogAgentId &&
            ((this.sessionCatalogAgentId = e),
            (this.sessionCatalogGeneration += 1),
            (this.sessionCatalogRevision += 1),
            (this.loadingMoreSessionCatalogIds = new Set()),
            (this.sessionCatalogTimer &&=
              (globalThis.clearTimeout(this.sessionCatalogTimer), null)),
            this.sessionCatalogs.some((e) => e.capabilities.createSession) &&
              (this.sessionCatalogs = this.sessionCatalogs.map((e) => {
                let { createSession: t, ...n } = e.capabilities;
                return { ...e, capabilities: n };
              })));
        }
        async refreshSessionCatalogs() {
          let e = this.context?.gateway.snapshot.client;
          if (!e || !this.connected) return;
          let t = this.sessionCatalogGeneration,
            n = this.sessionCatalogRevision,
            r = this.sessionCatalogAgentId ?? this.expandedAgentId();
          if (this.sessionCatalogRequestGeneration !== t) {
            this.sessionCatalogRequestGeneration = t;
            try {
              let i = await e.request(`sessions.catalog.list`, { agentId: r, limitPerHost: 40 });
              if (t !== this.sessionCatalogGeneration || e !== this.gatewayClient) return;
              let a = await this.refetchSessionCatalogPages({
                catalogs: i.catalogs,
                client: e,
                generation: t,
                agentId: r,
              });
              if (
                t !== this.sessionCatalogGeneration ||
                n !== this.sessionCatalogRevision ||
                e !== this.gatewayClient
              )
                return;
              let o = new Set([...this.sessionCatalogs.map((e) => e.id), ...a.map((e) => e.id)]);
              this.sessionCatalogs = a;
              for (let e of o)
                this.sessionCatalogRevisions.set(e, (this.sessionCatalogRevisions.get(e) ?? 0) + 1);
              this.sessionCatalogRevision += 1;
            } catch {
            } finally {
              (this.sessionCatalogRequestGeneration === t &&
                (this.sessionCatalogRequestGeneration = null),
                t === this.sessionCatalogGeneration &&
                  e === this.gatewayClient &&
                  this.isConnected &&
                  (this.sessionCatalogTimer = globalThis.setTimeout(() => {
                    ((this.sessionCatalogTimer = null), this.refreshSessionCatalogs());
                  }, 3e4)));
            }
          }
        }
        async refetchSessionCatalogPages(e) {
          let t = new Map(this.sessionCatalogs.map((e) => [e.id, e]));
          return Promise.all(
            e.catalogs.map(async (n) => {
              let r = new Map(t.get(n.id)?.hosts.map((e) => [e.hostId, e]) ?? []),
                i = await Promise.all(
                  n.hosts.map(async (t) => {
                    let i = Qa(n.id, t.hostId),
                      a = this.sessionCatalogPageDepths.get(i) ?? 0;
                    if (a === 0) return t;
                    let o = r.get(t.hostId);
                    if (t.error) return li(t, o);
                    let s = t.sessions,
                      c = t.nextCursor,
                      l = 0;
                    for (; l < a && c; l += 1) {
                      let r;
                      try {
                        r = await e.client.request(`sessions.catalog.list`, {
                          agentId: e.agentId,
                          catalogId: n.id,
                          cursors: { [t.hostId]: c },
                        });
                      } catch {
                        return o ?? t;
                      }
                      if (
                        e.generation !== this.sessionCatalogGeneration ||
                        e.client !== this.gatewayClient
                      )
                        return o ?? t;
                      let i = r.catalogs
                        .find((e) => e.id === n.id)
                        ?.hosts.find((e) => e.hostId === t.hostId);
                      if (!i) return o ?? t;
                      if (i.error) return li({ ...t, ...i }, o ?? t);
                      ((s = ci(s, i.sessions)), (c = i.nextCursor));
                    }
                    let { nextCursor: u, sessions: d, ...f } = t;
                    return { ...f, sessions: s, ...(c ? { nextCursor: c } : {}) };
                  }),
                );
              return { ...n, hosts: i };
            }),
          );
        }
        async loadMoreSessionCatalog(e) {
          if (this.loadingMoreSessionCatalogIds.has(e)) return;
          let t = this.sessionCatalogs.find((t) => t.id === e),
            n = Object.fromEntries(
              (t?.hosts ?? []).flatMap((e) => (e.nextCursor ? [[e.hostId, e.nextCursor]] : [])),
            );
          if (!t || Object.keys(n).length === 0) return;
          let r = this.context?.gateway.snapshot.client;
          if (!r || !this.connected) return;
          let i = this.sessionCatalogGeneration,
            a = this.sessionCatalogAgentId ?? this.expandedAgentId(),
            o = this.sessionCatalogRevisions.get(e) ?? 0;
          this.loadingMoreSessionCatalogIds = new Set([...this.loadingMoreSessionCatalogIds, e]);
          try {
            let t = await r.request(`sessions.catalog.list`, {
              agentId: a,
              catalogId: e,
              cursors: n,
            });
            if (
              i !== this.sessionCatalogGeneration ||
              o !== (this.sessionCatalogRevisions.get(e) ?? 0) ||
              r !== this.gatewayClient
            )
              return;
            let s = t.catalogs.find((t) => t.id === e);
            if (!s) return;
            let c = this.sessionCatalogs.find((t) => t.id === e);
            if (!c) return;
            let l = ui({ current: c, page: s, cursors: n });
            for (let t of l.advancedHostIds) {
              let n = Qa(e, t);
              this.sessionCatalogPageDepths.set(n, (this.sessionCatalogPageDepths.get(n) ?? 0) + 1);
            }
            ((this.sessionCatalogs = this.sessionCatalogs.map((t) => (t.id === e ? l.catalog : t))),
              this.sessionCatalogRevisions.set(e, o + 1),
              (this.sessionCatalogRevision += 1));
          } catch (t) {
            if (
              i !== this.sessionCatalogGeneration ||
              o !== (this.sessionCatalogRevisions.get(e) ?? 0) ||
              r !== this.gatewayClient
            )
              return;
            ((this.sessionCatalogs = this.sessionCatalogs.map((n) =>
              n.id === e ? { ...n, error: si(t) } : n,
            )),
              this.sessionCatalogRevisions.set(e, o + 1),
              (this.sessionCatalogRevision += 1));
          } finally {
            if (i === this.sessionCatalogGeneration) {
              let t = new Set(this.loadingMoreSessionCatalogIds);
              (t.delete(e), (this.loadingMoreSessionCatalogIds = t));
            }
          }
        }
        syncSessionsScrollObserver() {
          let e = this.querySelector(`.sidebar-recent-sessions`);
          (e !== this.sessionsScrollElement &&
            (this.sessionsScrollResizeObserver?.disconnect(),
            (this.sessionsScrollElement = e),
            (this.sessionsScrollResizeObserver = null),
            e &&
              typeof ResizeObserver == `function` &&
              ((this.sessionsScrollResizeObserver = new ResizeObserver(() =>
                this.updateSessionsScrollState(e),
              )),
              this.sessionsScrollResizeObserver.observe(e))),
            e && this.updateSessionsScrollState(e));
        }
        updateSessionsScrollState(e) {
          let t = Math.max(0, e.scrollHeight - e.clientHeight),
            n = `none`;
          (t > 1 && (n = e.scrollTop <= 1 ? `top` : e.scrollTop >= t - 1 ? `bottom` : `middle`),
            n !== this.sessionsScrollState && (this.sessionsScrollState = n));
        }
        dismissTransientMenus() {
          let e = !!(
            this.customizeMenuPosition ||
            this.moreMenuPosition ||
            this.sessionMenu ||
            this.catalogMenu.isOpen ||
            this.sessionGroupMenu ||
            this.sessionSortMenuPosition ||
            this.agentMenuPosition
          );
          return (
            this.closeCustomizeMenu(),
            this.closeMoreMenu(),
            this.closeSessionMenu(),
            this.catalogMenu.close(),
            this.closeSessionGroupMenu(),
            this.closeSessionSortMenu(),
            this.closeAgentMenu(),
            e
          );
        }
        synchronizeSessions(e) {
          (e !== this.sessionsSource &&
            (this.invalidateSessionMutations(),
            this.clearSessionCache(),
            (this.sessionsSource = e)),
            this.updateSessions(e),
            this.context?.gateway.snapshot.connected && e.groupsLoad());
        }
        synchronizeGateway(e) {
          let t = e.snapshot.client,
            n = e.snapshot.connected,
            r = e !== this.gatewaySource || t !== this.gatewayClient,
            i = n !== this.gatewayConnected;
          (!r && !i) ||
            (this.invalidateSessionMutations(),
            (this.gatewaySource = e),
            (this.gatewayClient = t),
            (this.gatewayConnected = n),
            r &&
              (this.clearSessionCache(),
              (this.sessionCatalogGeneration += 1),
              (this.sessionCatalogRevision += 1),
              (this.sessionCatalogTimer &&=
                (globalThis.clearTimeout(this.sessionCatalogTimer), null)),
              (this.sessionCatalogs = []),
              (this.loadingMoreSessionCatalogIds = new Set()),
              this.sessionCatalogPageDepths.clear(),
              this.sessionCatalogRevisions.clear()));
        }
        clearSessionCache() {
          ((this.reconnectListRevision = null),
            (this.sessionsResult = null),
            (this.sessionsAgentId = null),
            (this.sessionRowsByAgent = {}),
            this.sessionCreatedOrder.clear(),
            (this.visibleSessionLimit = no));
        }
        invalidateSessionMutations() {
          ((this.sessionMutationEpoch += 1), (this.sessionMutationError = null));
        }
        beginSessionMutation() {
          let e = this.context;
          if (!e || !this.connected) return null;
          let t = e.gateway,
            n = t.snapshot.client;
          return !t.snapshot.connected || !n
            ? null
            : ((this.sessionMutationError = null),
              {
                epoch: this.sessionMutationEpoch,
                context: e,
                gateway: t,
                sessions: e.sessions,
                client: n,
                selectedAgentId: this.getSessionNavigationState().selectedAgentId,
              });
        }
        isSessionMutationScopeCurrent(e) {
          let t = this.context,
            n = t?.gateway;
          return (
            this.connected &&
            this.sessionMutationEpoch === e.epoch &&
            t === e.context &&
            n === e.gateway &&
            t.sessions === e.sessions &&
            n.snapshot.connected &&
            n.snapshot.client === e.client
          );
        }
        publishSessionMutationError(e, t) {
          this.isSessionMutationScopeCurrent(e) && (this.sessionMutationError = String(t));
        }
        renderLogoStandIn() {
          let e = this.logoVisit;
          if (!e?.look) return b;
          let t = e.look;
          return v`
      <span class=${[`sidebar-brand__pet`, `lobster-pet--palette-${t.palette.id}`, e.phase === `leaving` ? `sidebar-brand__pet--leaving` : ``].filter(Boolean).join(` `)} style=${[`--lob-shell:${t.palette.shell}`, `--lob-claw:${t.palette.claw}`, `--lob-blink-delay:${t.blinkDelayS}s`, `--lob-w:${fa[t.build].w}`, `--lob-h:${fa[t.build].h}`, `--lob-claw-scale:${pa[t.clawSize]}`].join(`;`)} title=${`${e.name} · filling in for the logo`}>${ea(t)}</span>
    `;
        }
        renderBrand() {
          let e = k(`nav.collapse`);
          return v`
      <div class="sidebar-brand">
        <a
          class="sidebar-brand__identity"
          href=${D(`new-session`, this.basePath)}
          aria-label=${O(`new-session`)}
          @click=${(e) => {
            Xr(e) && (e.preventDefault(), this.onNavigate?.(`new-session`));
          }}
        >
          <span class="sidebar-brand__logo-slot">
            <img
              class="sidebar-brand__logo ${this.logoVisit ? `sidebar-brand__logo--vacated` : ``}"
              src=${Gt(`apple-touch-icon.png`, this.basePath)}
              alt=""
              aria-hidden="true"
            />
            ${this.renderLogoStandIn()}
          </span>
          <span class="sidebar-brand__title">OpenClaw</span>
        </a>
        <div class="sidebar-brand__actions">
          ${this.renderSearch()}
          <openclaw-tooltip .content=${`${e} (⌘B)`}>
            <button
              class="sidebar-brand__icon sidebar-brand__collapse"
              type="button"
              @click=${() => this.onToggleSidebar?.()}
              aria-label=${e}
              aria-expanded="true"
            >
              ${j.panelLeftClose}
            </button>
          </openclaw-tooltip>
        </div>
      </div>
    `;
        }
        renderSearch() {
          return v`
      <openclaw-tooltip .content=${`${k(`chat.openCommandPalette`)} (${ao})`}>
        <button
          type="button"
          class="sidebar-brand__icon sidebar-search"
          ?disabled=${!this.onOpenPalette}
          aria-label=${k(`chat.openCommandPalette`)}
          @click=${() => this.onOpenPalette?.()}
        >
          ${j.search}
        </button>
      </openclaw-tooltip>
    `;
        }
        getRouteSessionKey() {
          return this.sessionKey.trim() || this.context?.gateway.snapshot.sessionKey.trim() || ``;
        }
        promoteCreatedSession(e) {
          let t = this.sessionCreatedOrder.get(e);
          if (t !== 0) {
            for (let [n, r] of this.sessionCreatedOrder)
              n !== e && (t === void 0 || r < t) && this.sessionCreatedOrder.set(n, r + 1);
            (this.sessionCreatedOrder.set(e, 0), this.requestUpdate());
          }
        }
        getSessionNavigationState() {
          let e = this.context,
            t = this.getRouteSessionKey(),
            n = At({
              result: this.sessionsResult,
              resultAgentId: this.sessionsAgentId,
              sessionKey: t,
              assistantAgentId:
                e?.agentSelection.state.selectedId ?? e?.gateway.snapshot.assistantAgentId,
              hello: e?.gateway.snapshot.hello,
              showCron: this.sessionsShowCron,
              compareSessions: this.compareSidebarSessionRows,
            }),
            r = this.activeRouteId === `chat`,
            i = (t) => {
              let i = Ge(t.key, t.channel);
              return {
                key: t.key,
                label: Nt(t.key, t),
                meta: fi(t.updatedAt),
                subtitle: Fe(t),
                href: `${D(`chat`, e?.basePath ?? ``)}${Se(t.key)}`,
                active: t.key === n.activeRowKey,
                visuallyActive: r && t.key === n.currentSessionKey,
                hasActiveRun: !!t.hasActiveRun,
                modelSelectionLocked: t.modelSelectionLocked === !0,
                kind: t.kind,
                pinned: t.pinned === !0,
                category: ge(t.category),
                channel: i.channel,
                channelSession: i.channelSession,
                workSession: !!(t.worktree || t.execNode),
                worktreeId: t.worktree?.id,
                hasAutomation: t.hasAutomation === !0,
                unread: t.unread === !0,
              };
            },
            a = n.visibleSessions.map(i),
            o = !this.connected;
          return {
            routeSessionKey: n.currentSessionKey,
            selectedAgentId: n.selectedAgentId,
            visibleSessions: a,
            toSidebarSession: i,
            newSessionDisabled: o,
            newSessionTitle: this.connected
              ? k(`chat.runControls.newSession`)
              : k(`chat.runControls.newSessionDisconnected`),
          };
        }
        visibleSessionRowsInOrder() {
          let e = this.getSessionNavigationState();
          return ot(Ja(this.selectedAgentSessionRows(e), this.visibleSessionLimit), {
            grouping: this.sessionsGrouping,
            knownGroups: this.sessionsGrouping === `category` ? this.knownSessionGroups() : void 0,
          }).flatMap((e) =>
            (e.id === `pinned` || this.sessionsGrouping === `category`) &&
            this.collapsedSessionSections.has(e.id)
              ? []
              : e.rows,
          );
        }
        selectedVisibleSessions() {
          return this.selectedSessionKeys.size === 0
            ? []
            : this.visibleSessionRowsInOrder().filter((e) => this.selectedSessionKeys.has(e.key));
        }
        handleSessionRowClick(e, t) {
          if (!(e.defaultPrevented || e.button !== 0)) {
            if (e.metaKey || e.ctrlKey) {
              (e.preventDefault(), this.toggleSessionSelected(t.key));
              return;
            }
            if (e.shiftKey) {
              (e.preventDefault(), this.extendSessionSelection(t.key));
              return;
            }
            e.altKey ||
              (e.preventDefault(), this.clearSessionSelection(), this.selectSession(t.key));
          }
        }
        toggleSessionSelected(e) {
          let t = new Set(this.selectedSessionKeys);
          (t.has(e) ? t.delete(e) : t.add(e),
            (this.sessionSelectionAnchor = t.has(e) ? e : null),
            (this.selectedSessionKeys = t));
        }
        extendSessionSelection(e) {
          let t = this.visibleSessionRowsInOrder(),
            n =
              this.sessionSelectionAnchor ?? t.find((e) => e.visuallyActive || e.active)?.key ?? e,
            r = t.findIndex((e) => e.key === n),
            i = t.findIndex((t) => t.key === e);
          if (r === -1 || i === -1) {
            ((this.sessionSelectionAnchor = e), (this.selectedSessionKeys = new Set([e])));
            return;
          }
          let [a, o] = r <= i ? [r, i] : [i, r];
          ((this.sessionSelectionAnchor = n),
            (this.selectedSessionKeys = new Set(t.slice(a, o + 1).map((e) => e.key))));
        }
        clearSessionSelection() {
          ((this.sessionSelectionAnchor = null),
            this.selectedSessionKeys.size > 0 && (this.selectedSessionKeys = new Set()));
        }
        expandedAgentId() {
          let e = this.context;
          return C(
            ge(e?.agentSelection.state.selectedId) ||
              this.getSessionNavigationState().selectedAgentId,
          );
        }
        async patchSessions(e, t, n = this.beginSessionMutation()) {
          if (!n) return `stale`;
          let r = `completed`;
          for (let i of e) {
            let e = await this.patchSession(i, t, n);
            if (e === `stale`) return `stale`;
            e === `failed` && (r = `failed`);
          }
          return r;
        }
        async deleteSessionsBatch(e) {
          if (
            e.length === 0 ||
            !window.confirm(k(`sessionsView.deleteSessionsConfirm`, { count: String(e.length) }))
          )
            return;
          let t = this.beginSessionMutation();
          if (t)
            try {
              let n = await t.sessions.deleteMany(
                e.map((e) => ({
                  key: e.key,
                  agentId: ze(e.key)?.agentId ?? t.selectedAgentId,
                  deleteTranscript: !0,
                })),
              );
              if (
                !this.isSessionMutationScopeCurrent(t) ||
                (n.preservedWorktrees.length > 0 &&
                  (window.alert(
                    k(`sessionsView.deletePreservedWorktrees`, {
                      count: String(n.preservedWorktrees.length),
                      branches: n.preservedWorktrees.map((e) => e.branch).join(`, `),
                    }),
                  ),
                  !this.isSessionMutationScopeCurrent(t)))
              )
                return;
              let r = e.find((e) => e.active && n.deleted.includes(e.key));
              (r &&
                this.replaceCurrentSession(
                  Te({
                    agentId: ze(r.key)?.agentId ?? t.selectedAgentId,
                    mainKey: De({
                      agentsList: t.context.agents.state.agentsList,
                      hello: t.gateway.snapshot.hello,
                    }),
                  }),
                ),
                n.errors.length > 0 && this.publishSessionMutationError(t, n.errors.join(`; `)));
            } catch (e) {
              this.publishSessionMutationError(t, e);
            }
        }
        runBatchSessionAction(e, t, n) {
          switch (e.kind) {
            case `toggle-unread`:
              this.patchSessions(t, { unread: !n });
              break;
            case `move-to-group`:
              this.patchSessions(
                t.filter((t) => (t.category ?? null) !== e.category),
                { category: e.category },
              );
              break;
            case `new-group`:
              this.createSessionGroup(t);
              break;
            case `toggle-archived`:
              this.patchSessions(t, { archived: !0 });
              break;
            case `delete`:
              this.deleteSessionsBatch(t);
              break;
            default:
              break;
          }
        }
        preloadRoute(e, t, n = !1) {
          an(
            this.routePreloadTimers,
            e,
            t,
            (e) => this.onPreloadRoute?.(e),
            e === this.activeRouteId || !this.isRouteEnabled(e),
            n,
          );
        }
        isRouteEnabled(e) {
          return this.enabledRouteIds?.includes(e) ?? !0;
        }
        openCustomizeMenu(e, t, n = null) {
          (this.dismissTransientMenus(),
            (this.customizeMenuTrigger = n),
            (this.customizeMenuPosition = {
              x: Math.max(8, Math.min(e, window.innerWidth - 240 - 8)),
              y: Math.max(8, Math.min(t, window.innerHeight - 420 - 8)),
            }));
        }
        closeCustomizeMenu(e = {}) {
          let t = this.customizeMenuTrigger;
          ((this.customizeMenuTrigger = null),
            (this.customizeMenuPosition = null),
            e.restoreFocus && t?.focus());
        }
        toggleMoreMenu(e) {
          if (this.moreMenuPosition) {
            this.closeMoreMenu();
            return;
          }
          let t = e.getBoundingClientRect();
          (this.dismissTransientMenus(),
            (this.moreMenuTrigger = e),
            (this.moreMenuPosition = {
              x: Math.max(8, Math.min(t.left, window.innerWidth - 240 - 8)),
              y: Math.max(8, Math.min(t.bottom + 4, window.innerHeight - 420 - 8)),
            }));
        }
        closeMoreMenu(e = {}) {
          let t = this.moreMenuTrigger;
          ((this.moreMenuTrigger = null),
            (this.moreMenuPosition = null),
            e.restoreFocus && t?.focus());
        }
        openSessionMenuForRow(e, t, n, r = null) {
          (this.selectedSessionKeys.has(e.key) || this.clearSessionSelection(),
            this.openSessionMenu(e, t, n, r));
        }
        openSessionMenu(e, t, n, r = null) {
          (this.dismissTransientMenus(),
            (this.sessionMenuTrigger = r),
            (this.sessionMenu = { session: e, x: t, y: n }),
            this.loadSessionMenuWork(e));
        }
        closeSessionMenu() {
          ((this.sessionMenuTrigger = null),
            (this.sessionMenu = null),
            (this.sessionMenuWorkVersion += 1),
            (this.sessionMenuWork = null));
        }
        loadSessionMenuWork(e) {
          let t = ++this.sessionMenuWorkVersion;
          if (!e.worktreeId) {
            this.sessionMenuWork = null;
            return;
          }
          this.sessionMenuWork = { loading: !0, pullRequestUrl: null, worktreePath: null };
          let n = this.context,
            r = n?.gateway.snapshot.client;
          if (!n || !r) {
            this.sessionMenuWork = { loading: !1, pullRequestUrl: null, worktreePath: null };
            return;
          }
          let { selectedAgentId: i } = this.getSessionNavigationState();
          Ga({
            client: r,
            pullRequestsAvailable: ve(n.gateway.snapshot, `controlUi.sessionPullRequests`) === !0,
            sessionKey: e.key,
            agentId: ze(e.key)?.agentId ?? i,
            worktreeId: e.worktreeId,
          }).then((e) => {
            t === this.sessionMenuWorkVersion && (this.sessionMenuWork = { loading: !1, ...e });
          });
        }
        openSessionGroupMenu(e, t, n, r) {
          (this.dismissTransientMenus(),
            (this.sessionGroupMenuTrigger = r),
            (this.sessionGroupMenu = {
              group: e,
              x: Math.max(8, Math.min(t, window.innerWidth - 224 - 8)),
              y: Math.max(8, Math.min(n, window.innerHeight - 160 - 8)),
            }));
        }
        closeSessionGroupMenu(e = {}) {
          let t = this.sessionGroupMenuTrigger;
          ((this.sessionGroupMenuTrigger = null),
            (this.sessionGroupMenu = null),
            e.restoreFocus && t?.focus());
        }
        toggleSessionSortMenu(e) {
          if (this.sessionSortMenuPosition) {
            this.closeSessionSortMenu();
            return;
          }
          let t = e.getBoundingClientRect();
          (this.dismissTransientMenus(),
            (this.sessionSortMenuTrigger = e),
            (this.sessionSortMenuPosition = {
              x: Math.max(8, Math.min(t.right, window.innerWidth - 200 - 8)),
              y: Math.max(8, Math.min(t.bottom + 4, window.innerHeight - 280 - 8)),
            }));
        }
        closeSessionSortMenu(e = {}) {
          let t = this.sessionSortMenuTrigger;
          ((this.sessionSortMenuTrigger = null),
            (this.sessionSortMenuPosition = null),
            e.restoreFocus && t?.focus());
        }
        toggleAgentMenu(e) {
          if (this.agentMenuPosition) {
            this.closeAgentMenu();
            return;
          }
          let t = e.getBoundingClientRect();
          (this.closeCustomizeMenu(),
            this.closeMoreMenu(),
            this.closeSessionMenu(),
            this.closeSessionGroupMenu(),
            this.closeSessionSortMenu(),
            (this.agentMenuTrigger = e),
            (this.agentMenuFilter = ``),
            (this.agentMenuPosition = {
              x: Math.max(8, Math.min(t.right - 240, window.innerWidth - 240 - 8)),
              bottom: Math.max(8, window.innerHeight - t.top + 4),
            }));
        }
        closeAgentMenu(e = {}) {
          let t = this.agentMenuTrigger;
          ((this.agentMenuTrigger = null),
            (this.agentMenuPosition = null),
            (this.agentMenuFilter = ``),
            e.restoreFocus && t?.focus());
        }
        activeChipAgent() {
          let e = this.context?.agents.state.agentsList?.agents ?? [],
            t = this.expandedAgentId();
          return { activeId: t, agent: e.find((e) => C(e.id) === t), agents: e };
        }
        latestAgentSessionRow(e) {
          let t = C(e);
          return (
            ft(
              t === C(this.sessionsAgentId ?? ``)
                ? (this.sessionsResult?.sessions ?? [])
                : (this.sessionRowsByAgent[t] ?? []),
              {
                agentId: t,
                defaultAgentId: bt({
                  agentsList: this.context?.agents.state.agentsList,
                  hello: this.context?.gateway.snapshot.hello,
                }),
                filterByAgent: !0,
              },
            ).toSorted(Qe)[0] ?? null
          );
        }
        agentResumeKey(e) {
          let t = this.latestAgentSessionRow(e);
          return t
            ? t.key
            : Te({
                agentId: e,
                mainKey: De({
                  agentsList: this.context?.agents.state.agentsList,
                  hello: this.context?.gateway.snapshot.hello,
                }),
              });
        }
        openAgentConversation(e) {
          if (!this.connected) {
            this.onNavigate?.(`config`);
            return;
          }
          this.selectSession(this.agentResumeKey(e));
        }
        agentChipSubtitle(e) {
          if (!this.connected) return k(`common.offline`);
          let t = this.latestAgentSessionRow(e);
          if (t?.hasActiveRun) return k(`agentChip.working`);
          if (t) {
            let e = Nt(t.key, t),
              n = fi(t.updatedAt);
            return n ? `${e} · ${n}` : e;
          }
          return k(`agentChip.ready`);
        }
        switchChipAgent(e) {
          (this.closeAgentMenu(), this.expandAgent(e), this.openAgentConversation(e));
        }
        askAgentCapabilities(e) {
          if ((this.closeAgentMenu(), !this.connected)) return;
          let t = this.agentResumeKey(e),
            n = encodeURIComponent(k(`chat.welcome.suggestions.whatCanYouDo`));
          (this.context?.gateway.setSessionKey(t),
            this.onNavigate?.(`chat`, { search: `${Se(t)}&draft=${n}` }));
        }
        knownSessionGroups() {
          let e = this.context?.sessions.state.groups ?? [],
            t = new Set(e),
            n = (this.sessionsResult?.sessions ?? [])
              .map((e) => ge(e.category))
              .filter((e) => typeof e == `string` && !t.has(e))
              .toSorted((e, t) => e.localeCompare(t));
          return [...e, ...new Set(n)];
        }
        async rememberSessionGroup(e, t) {
          let n = this.knownSessionGroups();
          if (n.includes(e)) return `completed`;
          try {
            return (
              await t.sessions.groupsPut([...n, e]),
              this.isSessionMutationScopeCurrent(t) ? `completed` : `stale`
            );
          } catch (e) {
            return this.isSessionMutationScopeCurrent(t)
              ? (this.publishSessionMutationError(t, e), `failed`)
              : `stale`;
          }
        }
        renameSession(e) {
          let t = window.prompt(k(`sessionsView.renameSessionPrompt`), e.label);
          t !== null && this.patchSession(e, { label: ge(t) ?? null });
        }
        createSessionGroup(e = []) {
          let t = window.prompt(k(`sessionsView.newGroupPrompt`))?.trim();
          if (!t) return;
          let n = this.beginSessionMutation();
          n &&
            (async () => {
              (await this.rememberSessionGroup(t, n)) === `completed` &&
                (e.length > 0
                  ? await this.patchSessions(e, { category: t }, n)
                  : this.isSessionMutationScopeCurrent(n) && this.requestUpdate());
            })();
        }
        renameSessionGroupFromMenu(e) {
          let t = window.prompt(k(`sessionsView.renameGroupPrompt`), e)?.trim();
          if (!t || t === e) return;
          let n = this.beginSessionMutation();
          n &&
            (async () => {
              try {
                if (
                  (await n.sessions.groupsRename(e, t)) !== `completed` ||
                  !this.isSessionMutationScopeCurrent(n)
                )
                  return;
                let r = `category:${e}`;
                if (this.collapsedSessionSections.has(r)) {
                  let e = new Set(this.collapsedSessionSections);
                  (e.delete(r), e.add(`category:${t}`), this.saveCollapsedSessionSections(e));
                }
                this.requestUpdate();
              } catch (e) {
                this.publishSessionMutationError(n, e);
              }
            })();
        }
        deleteSessionGroupFromMenu(e) {
          if (!window.confirm(k(`sessionsView.deleteGroupConfirm`, { group: e }))) return;
          let t = this.beginSessionMutation();
          t &&
            (async () => {
              try {
                if (
                  (await t.sessions.groupsDelete(e)) !== `completed` ||
                  !this.isSessionMutationScopeCurrent(t)
                )
                  return;
                let n = new Set(this.collapsedSessionSections);
                (n.delete(`category:${e}`),
                  this.saveCollapsedSessionSections(n),
                  this.requestUpdate());
              } catch (e) {
                this.publishSessionMutationError(t, e);
              }
            })();
        }
        saveCollapsedSessionSections(e) {
          this.collapsedSessionSections = new Set(e);
          try {
            w()?.setItem(io, JSON.stringify([...e]));
          } catch {}
        }
        toggleSessionSection(e) {
          let t = new Set(this.collapsedSessionSections);
          (t.has(e) ? t.delete(e) : t.add(e), this.saveCollapsedSessionSections(t));
        }
        reorderSessionGroup(e, t, n) {
          let r = lt(this.knownSessionGroups(), e, t, n),
            i = this.beginSessionMutation();
          i &&
            (async () => {
              try {
                (await i.sessions.groupsPut(r),
                  this.isSessionMutationScopeCurrent(i) && this.requestUpdate());
              } catch (e) {
                this.publishSessionMutationError(i, e);
              }
            })();
        }
        assignSessionCategory(e, t, n = {}) {
          let r = this.beginSessionMutation();
          r &&
            (async () => {
              (t && (await this.rememberSessionGroup(t, r)) !== `completed`) ||
                (await this.patchSession(e, { category: t, ...n }, r));
            })();
        }
        handleSessionSectionDragOver(e, t, n) {
          let r = e.dataTransfer;
          if (n && We(r) && this.draggingSessionGroup !== n) {
            (e.preventDefault(), r && (r.dropEffect = `move`));
            let t = e.currentTarget.getBoundingClientRect(),
              i = e.clientY < t.top + t.height / 2 ? `before` : `after`;
            ((this.sessionGroupDropTarget = { group: n, position: i }),
              (this.sessionDropTarget = null));
            return;
          }
          !it(r) ||
            t === `pinned` ||
            (e.preventDefault(),
            r && (r.dropEffect = `move`),
            (this.sessionDropTarget = t),
            (this.sessionGroupDropTarget = null));
        }
        handleSessionSectionDragLeave(e, t, n) {
          let r = e.currentTarget;
          (e.relatedTarget instanceof Node && r.contains(e.relatedTarget)) ||
            (this.sessionDropTarget === t && (this.sessionDropTarget = null),
            n && this.sessionGroupDropTarget?.group === n && (this.sessionGroupDropTarget = null));
        }
        findSidebarSessionByKey(e) {
          let t = this.getSessionNavigationState(),
            n = t.visibleSessions.find((t) => t.key === e);
          if (n) return n;
          for (let n of Object.values(this.sessionRowsByAgent)) {
            let r = n.find((t) => t.key === e);
            if (r) return t.toSidebarSession(r);
          }
        }
        handleSessionSectionDrop(e, t) {
          e.preventDefault();
          let n = St(e.dataTransfer);
          if (n && t && n !== t) {
            let e =
              this.sessionGroupDropTarget?.group === t
                ? this.sessionGroupDropTarget.position
                : `before`;
            this.reorderSessionGroup(n, t, e);
          } else {
            let n = ht(e.dataTransfer),
              r = n ? this.findSidebarSessionByKey(n) : void 0,
              i = t ?? null;
            r &&
              (r.category !== i || r.pinned) &&
              this.assignSessionCategory(r, i, r.pinned ? { pinned: !1 } : {});
          }
          ((this.draggingSessionKey = null),
            (this.draggingSessionGroup = null),
            (this.sessionDropTarget = null),
            (this.sessionGroupDropTarget = null));
        }
        setSessionsGrouping(e) {
          this.sessionsGrouping = e;
          try {
            w()?.setItem($a, e);
          } catch {}
        }
        setSessionsShowCron(e) {
          this.sessionsShowCron = e;
          try {
            w()?.setItem(eo, String(e));
          } catch {}
        }
        async forkSession(e) {
          let t = this.beginSessionMutation();
          if (!t) return;
          let n = ze(e.key)?.agentId ?? t.selectedAgentId;
          try {
            let r = await t.sessions.create({ parentSessionKey: e.key, fork: !0, agentId: n });
            if (!this.isSessionMutationScopeCurrent(t)) return;
            r
              ? this.selectSession(r)
              : this.publishSessionMutationError(
                  t,
                  t.sessions.state.error ?? k(`newSession.createFailed`),
                );
          } catch (e) {
            this.publishSessionMutationError(t, e);
          }
        }
        async deleteSession(e) {
          if (!window.confirm(k(`sessionsView.deleteSessionConfirm`, { session: e.label }))) return;
          let t = this.beginSessionMutation();
          if (!t) return;
          let n = ze(e.key)?.agentId ?? t.selectedAgentId;
          try {
            let r = await t.sessions.delete(e.key, { agentId: n, deleteTranscript: !0 });
            if (!this.isSessionMutationScopeCurrent(t)) return;
            if (r.worktreePreserved) {
              let e = r.worktreePreserved;
              if (
                window.confirm(
                  k(`sessionsView.deletePreservedWorktreeConfirm`, { branch: e.branch }),
                )
              ) {
                if (!this.isSessionMutationScopeCurrent(t)) return;
                try {
                  await t.client.request(`worktrees.remove`, { id: e.id, force: !0 });
                } catch (e) {
                  this.publishSessionMutationError(t, e);
                }
                if (!this.isSessionMutationScopeCurrent(t)) return;
              }
            }
            if (!r.deleted || !e.active) return;
            this.replaceCurrentSession(
              Te({
                agentId: n,
                mainKey: De({
                  agentsList: t.context.agents.state.agentsList,
                  hello: t.gateway.snapshot.hello,
                }),
              }),
            );
          } catch (e) {
            this.publishSessionMutationError(t, e);
          }
        }
        renderCustomizeMenu() {
          let e = this.customizeMenuPosition,
            t = this.customizeMenuTrigger;
          return ii({
            position: e,
            pinnedRoutes: this.sidebarPinnedRoutes,
            isRouteEnabled: (e) => this.isRouteEnabled(e),
            onTabAway: () => t?.focus(),
            onClose: (t) => {
              this.customizeMenuPosition === e && this.closeCustomizeMenu({ restoreFocus: t });
            },
            onToggleRoute: (e) => {
              let t = this.sidebarPinnedRoutes,
                n = t.includes(e) ? t.filter((t) => t !== e) : [...t, e];
              this.onUpdatePinnedRoutes?.(n);
            },
            onReset: () => {
              (this.onUpdatePinnedRoutes?.([...Wt]), this.closeCustomizeMenu({ restoreFocus: !0 }));
            },
          });
        }
        renderAgentMenu() {
          let e = this.agentMenuPosition,
            t = this.agentMenuTrigger,
            { activeId: n, agent: r, agents: i } = this.activeChipAgent();
          return Br({
            position: e,
            activeId: n,
            activeName: r ? je(r) : n,
            agents: i,
            filter: this.agentMenuFilter,
            pinnedAgentIds: this.pinnedAgentIds,
            connected: this.connected,
            canPairDevice: this.canPairDevice,
            basePath: this.basePath,
            gatewayVersion: this.gatewayVersion,
            themeMode: this.themeMode,
            agentUnreadCount: (e) => this.agentUnreadCount(e),
            onFilterChange: (e) => {
              this.agentMenuFilter = e;
            },
            onSwitchAgent: (e) => this.switchChipAgent(e),
            onAskCapabilities: (e) => this.askAgentCapabilities(e),
            onTabAway: () => t?.focus(),
            onClose: (t) => {
              this.agentMenuPosition === e && this.closeAgentMenu({ restoreFocus: t });
            },
            onNavigate: (e, t) => this.onNavigate?.(e, t),
            onPairMobile: () => this.onPairMobile?.(),
          });
        }
        renderSessionMenu() {
          let e = this.sessionMenu;
          if (!e) return b;
          let { session: t } = e,
            n = this.context,
            r = De({ agentsList: n?.agents.state.agentsList, hello: n?.gateway.snapshot.hello }),
            i = this.selectedVisibleSessions(),
            a = i.length > 1 && i.some((e) => e.key === t.key) ? i : null,
            o = a ?? [t],
            s = o.every((e) => ke(e, r)),
            c = o.every((e) => e.unread),
            l = o.every((e) => (e.category ?? null) === (o[0]?.category ?? null))
              ? (o[0]?.category ?? null)
              : null;
          return le(
            e,
            v`
        <openclaw-session-menu
          .session=${{ label: t.label, pinned: t.pinned, unread: a ? c : t.unread, archived: !1, category: a ? l : (t.category ?? null) }}
          .selectionCount=${o.length}
          .anchor=${e}
          .trigger=${this.sessionMenuTrigger}
          .disabled=${!this.connected}
          .forkDisabled=${this.sessionsLoading || t.modelSelectionLocked}
          .archiveAllowed=${s}
          .groups=${this.knownSessionGroups()}
          .canOpenChat=${!0}
          .work=${a ? null : this.sessionMenuWork}
          .workboard=${null}
          .onClose=${() => {
            this.sessionMenu === e && this.closeSessionMenu();
          }}
          .onAction=${(e) => {
            if (a) {
              this.runBatchSessionAction(e, a, c);
              return;
            }
            switch (e.kind) {
              case `open-chat`:
                this.selectSession(t.key);
                break;
              case `open-pr`:
                window.open(e.url, `_blank`, `noopener`);
                break;
              case `open-in`:
                window.open(ut(e.editor, e.path));
                break;
              case `toggle-pin`:
                this.patchSession(t, { pinned: !t.pinned });
                break;
              case `toggle-unread`:
                this.patchSession(t, { unread: !t.unread });
                break;
              case `rename`:
                this.renameSession(t);
                break;
              case `fork`:
                this.forkSession(t);
                break;
              case `workboard`:
                break;
              case `move-to-group`:
                (e.category === null || t.category !== e.category) &&
                  this.assignSessionCategory(t, e.category);
                break;
              case `new-group`:
                this.createSessionGroup([t]);
                break;
              case `toggle-archived`:
                this.patchSession(t, { archived: !0 });
                break;
              case `delete`:
                this.deleteSession(t);
                break;
            }
          }}
        ></openclaw-session-menu>
      `,
          );
        }
        renderSessionGroupMenu() {
          let e = this.sessionGroupMenu,
            t = this.sessionGroupMenuTrigger;
          return e
            ? le(
                e,
                v`
        <openclaw-menu-surface>
          <wa-dropdown
            class="session-menu sidebar-session-group-menu"
            .open=${!0}
            placement="bottom-start"
            .distance=${0}
            aria-label=${k(`sessionsView.groupMenu`, { group: e.group })}
            @wa-select=${(t) => {
              t.preventDefault();
              let n = t.detail.item.value;
              switch ((this.closeSessionGroupMenu({ restoreFocus: !0 }), n)) {
                case `rename-group`:
                  this.renameSessionGroupFromMenu(e.group);
                  break;
                case `new-group`:
                  this.createSessionGroup();
                  break;
                case `delete-group`:
                  this.deleteSessionGroupFromMenu(e.group);
                  break;
                case void 0:
                  break;
              }
            }}
            @keydown=${(e) => Tn(e, () => t?.focus())}
            @wa-after-hide=${(t) => {
              (this.sessionGroupMenu && this.sessionGroupMenu !== e) ||
                this.closeSessionGroupMenu({ restoreFocus: En(t) });
            }}
          >
            <button
              slot="trigger"
              type="button"
              tabindex="-1"
              aria-hidden="true"
              aria-label=${k(`sessionsView.groupMenu`, { group: e.group })}
              style="position: fixed; left: ${e.x}px; top: ${e.y}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
            ></button>
            <wa-dropdown-item
              class="session-menu__item"
              value="rename-group"
              ?disabled=${!this.connected}
            >
              <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.edit}</span>
              <span class="session-menu__text">${k(`sessionsView.renameGroupMenu`)}</span>
            </wa-dropdown-item>
            <wa-dropdown-item class="session-menu__item" value="new-group">
              <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.folder}</span>
              <span class="session-menu__text">${k(`sessionsView.newGroup`)}</span>
            </wa-dropdown-item>
            <div class="session-menu__separator" role="separator"></div>
            <wa-dropdown-item
              class="session-menu__item session-menu__item--destructive"
              value="delete-group"
              variant="danger"
              ?disabled=${!this.connected}
            >
              <span slot="icon" class="session-menu__icon" aria-hidden="true">${j.trash}</span>
              <span class="session-menu__text">${k(`sessionsView.deleteGroupMenu`)}</span>
            </wa-dropdown-item>
          </wa-dropdown>
        </openclaw-menu-surface>
      `,
              )
            : b;
        }
        renderSessionSortMenu() {
          let e = this.sessionSortMenuPosition,
            t = this.sessionSortMenuTrigger;
          if (!e) return b;
          let n = [
            { grouping: `category`, label: k(`sessionsView.groupByCategory`) },
            { grouping: `none`, label: k(`sessionsView.groupByNone`) },
          ];
          return le(
            e,
            v`
        <openclaw-menu-surface>
          <wa-dropdown
            class="sidebar-session-sort-menu"
            .open=${!0}
            placement="bottom-start"
            .distance=${0}
            aria-label=${k(`chat.sidebar.sortSessions`)}
            @wa-select=${(e) => {
              e.preventDefault();
              let t = e.detail.item.value;
              (t?.startsWith(`grouping:`)
                ? this.setSessionsGrouping(t.slice(9))
                : t?.startsWith(`sort:`)
                  ? (this.sessionSortMode = t.slice(5))
                  : t === `show-cron` && this.setSessionsShowCron(!this.sessionsShowCron),
                this.closeSessionSortMenu({ restoreFocus: !0 }));
            }}
            @keydown=${(e) => Tn(e, () => t?.focus())}
            @wa-after-hide=${(t) => {
              this.sessionSortMenuPosition === e &&
                this.closeSessionSortMenu({ restoreFocus: En(t) });
            }}
          >
            <button
              slot="trigger"
              type="button"
              tabindex="-1"
              aria-hidden="true"
              aria-label=${k(`chat.sidebar.sortSessions`)}
              style="position: fixed; left: ${e.x}px; top: ${e.y}px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
            ></button>
            <div class="sidebar-session-sort-menu__title">${k(`sessionsView.groupBy`)}</div>
            ${n.map(
              (e) => v`
                <wa-dropdown-item
                  class="sidebar-session-sort-menu__item"
                  value=${`grouping:${e.grouping}`}
                  role="menuitemradio"
                  aria-checked=${String(this.sessionsGrouping === e.grouping)}
                  ${ie((t) => Dn(t, this.sessionsGrouping === e.grouping))}
                >
                  <span slot="details" class="session-menu__check" aria-hidden="true"
                    >${this.sessionsGrouping === e.grouping ? j.check : b}</span
                  >
                  <span class="session-menu__text">${e.label}</span>
                </wa-dropdown-item>
              `,
            )}
            <div class="session-menu__separator" role="separator"></div>
            <div class="sidebar-session-sort-menu__title">${k(`chat.sidebar.sortBy`)}</div>
            ${oo.map(
              (e) => v`
                <wa-dropdown-item
                  class="sidebar-session-sort-menu__item"
                  value=${`sort:${e.mode}`}
                  role="menuitemradio"
                  aria-checked=${String(this.sessionSortMode === e.mode)}
                  ${ie((t) => Dn(t, this.sessionSortMode === e.mode))}
                >
                  <span slot="details" class="session-menu__check" aria-hidden="true"
                    >${this.sessionSortMode === e.mode ? j.check : b}</span
                  >
                  <span class="session-menu__text">${k(e.labelKey)}</span>
                </wa-dropdown-item>
              `,
            )}
            <div class="session-menu__separator" role="separator"></div>
            <wa-dropdown-item
              class="sidebar-session-sort-menu__item"
              type="checkbox"
              value="show-cron"
              .checked=${this.sessionsShowCron}
            >
              <span class="session-menu__text">${k(`sessionsView.showCronSessions`)}</span>
            </wa-dropdown-item>
          </wa-dropdown>
        </openclaw-menu-surface>
      `,
          );
        }
        renderRoute(e) {
          if (!this.isRouteEnabled(e)) return b;
          let t = e === `chat` ? this.getRouteSessionKey() : ``,
            n = e === `chat` && t ? Se(t) : ``;
          return $r({
            routeId: e,
            href: n ? `${D(`chat`, this.basePath)}${n}` : D(e, this.basePath),
            active: Zr(this.activeRouteId, e),
            onNavigate: () => {
              this.onNavigate?.(e, n ? { search: n } : void 0);
            },
            onPreload: (t, n) => this.preloadRoute(e, t, n),
            onCancelPreload: this.cancelPreload,
          });
        }
        renderRecentSession(e, t) {
          let n = t?.label ?? e.label,
            r = t
              ? t.subtitle
              : e.subtitle && e.workSession && e.subtitle !== e.label
                ? e.subtitle
                : void 0,
            i = t?.meta ?? e.meta,
            a = v`
      <div
        class=${[`sidebar-recent-session`, `session-row-host`, e.visuallyActive ? `sidebar-recent-session--active` : ``, this.selectedSessionKeys.has(e.key) ? `sidebar-recent-session--selected` : ``, e.pinned ? `session-row-host--pinned` : ``, e.hasActiveRun ? `session-row-host--running` : ``, this.draggingSessionKey === e.key ? `sidebar-recent-session--dragging` : ``].filter(Boolean).join(` `)}
        data-session-key=${e.key}
        draggable="true"
        @dragstart=${(t) => {
          t.dataTransfer && (_t(t.dataTransfer, e.key), (this.draggingSessionKey = e.key));
        }}
        @dragend=${() => {
          ((this.draggingSessionKey = null), (this.sessionDropTarget = null));
        }}
        @contextmenu=${(t) => {
          (t.preventDefault(), this.openSessionMenuForRow(e, t.clientX, t.clientY));
        }}
        @mouseenter=${(e) => Mt(e.currentTarget)}
        @mouseleave=${(e) => Ie(e.currentTarget)}
      >
        <a
          href=${e.href}
          class="sidebar-recent-session__link"
          draggable="false"
          title=${t?.title ?? `${e.label} · ${e.key}`}
          @click=${(t) => this.handleSessionRowClick(t, e)}
        >
          ${
            e.hasActiveRun
              ? v`<span
                class="session-run-spinner sidebar-recent-session__state"
                role="img"
                aria-label=${k(`sessionsView.activeRun`)}
                title=${k(`sessionsView.activeRun`)}
              ></span>`
              : e.unread
                ? v`<span
                  class="session-unread-dot sidebar-recent-session__unread"
                  role="img"
                  aria-label=${k(`sessionsView.unread`)}
                ></span>`
                : b
          }
          <span class="sidebar-recent-session__text">
            <span class="sidebar-recent-session__name hover-marquee">${n}</span>
            ${r ? v`<span class="sidebar-recent-session__subtitle">${r}</span>` : b}
          </span>
          ${
            e.worktreeId || e.hasAutomation
              ? v`<span class="session-row-badges">
                ${
                  e.worktreeId
                    ? v`<span
                      class="session-row-badge"
                      role="img"
                      aria-label=${k(`sessionsView.worktreeSession`)}
                      title=${k(`sessionsView.worktreeSession`)}
                      >${j.gitBranch}</span
                    >`
                    : b
                }
                ${
                  e.hasAutomation
                    ? v`<span
                      class="session-row-badge"
                      role="img"
                      aria-label=${k(`sessionsView.automationAttached`)}
                      title=${k(`sessionsView.automationAttached`)}
                      >${j.clock}</span
                    >`
                    : b
                }
              </span>`
              : b
          }
        </a>
        <span class="sidebar-recent-session__aside session-row-aside">
          <span class="session-row-trail">${i}</span>
          <span class="session-row-actions">
            <button
              class="session-action session-action--pin"
              data-sidebar-session-pin="true"
              type="button"
              title=${e.pinned ? k(`sessionsView.unpinSession`) : k(`sessionsView.pinSession`)}
              aria-label=${e.pinned ? k(`sessionsView.unpinSession`) : k(`sessionsView.pinSession`)}
              ?disabled=${!this.connected}
              @click=${() => void this.patchSession(e, { pinned: !e.pinned })}
            >
              ${j.pin}
            </button>
            <button
              class="session-action"
              data-session-menu="true"
              type="button"
              title=${k(`chat.sidebar.openSessionMenu`)}
              aria-label=${k(`chat.sidebar.openSessionMenu`)}
              aria-haspopup="menu"
              aria-expanded=${String(this.sessionMenu?.session.key === e.key)}
              @click=${(t) => {
                if ((t.stopPropagation(), this.sessionMenu?.session.key === e.key)) {
                  this.closeSessionMenu();
                  return;
                }
                let n = t.currentTarget,
                  r = n.getBoundingClientRect();
                this.openSessionMenuForRow(e, r.right, r.bottom + 4, n);
              }}
            >
              ${j.moreHorizontal}
            </button>
          </span>
        </span>
      </div>
    `;
          return le(e.key, a);
        }
        renderSessionSection(e, t = !1) {
          let n = e.category,
            r = e.id === `pinned`,
            i = r || this.sessionsGrouping === `category`,
            a = i && this.collapsedSessionSections.has(e.id),
            o = r
              ? k(`sessionsView.pinned`)
              : e.channel
                ? jt(e.channel)
                : e.work
                  ? k(`chat.sidebar.workSessions`)
                  : n || k(`chat.sidebar.chats`),
            s = !r && this.sessionsGrouping === `category` && (e.id === `ungrouped` || !!n);
          return v`
      <div
        class=${[`sidebar-recent-sessions__group`, a ? `sidebar-recent-sessions__group--collapsed` : ``, n && this.draggingSessionGroup === n ? `sidebar-recent-sessions__group--dragging` : ``, this.sessionDropTarget === e.id ? `sidebar-recent-sessions__group--session-drop` : ``, n && this.sessionGroupDropTarget?.group === n ? `sidebar-recent-sessions__group--group-drop-${this.sessionGroupDropTarget.position}` : ``].filter(Boolean).join(` `)}
        data-session-section=${e.id}
        @dragover=${s || n ? (t) => this.handleSessionSectionDragOver(t, e.id, n) : b}
        @dragleave=${s || n ? (t) => this.handleSessionSectionDragLeave(t, e.id, n) : b}
        @drop=${s || n ? (e) => this.handleSessionSectionDrop(e, n) : b}
      >
        ${
          i
            ? v`
              <div
                class="sidebar-recent-sessions__head ${n ? `sidebar-recent-sessions__head--draggable` : ``}"
                draggable=${n ? `true` : `false`}
                @dragstart=${
                  n
                    ? (e) => {
                        e.dataTransfer && (Ct(e.dataTransfer, n), (this.draggingSessionGroup = n));
                      }
                    : b
                }
                @dragend=${
                  n
                    ? () => {
                        ((this.draggingSessionGroup = null), (this.sessionGroupDropTarget = null));
                      }
                    : b
                }
                @contextmenu=${
                  n
                    ? (e) => {
                        (e.preventDefault(),
                          this.openSessionGroupMenu(n, e.clientX, e.clientY, null));
                      }
                    : b
                }
              >
                ${
                  n
                    ? v`
                      <span class="sidebar-session-group-drag-handle" aria-hidden="true"></span>
                    `
                    : b
                }
                <button
                  type="button"
                  class="sidebar-session-group-toggle"
                  aria-expanded=${String(!a)}
                  aria-label=${o}
                  @click=${() => this.toggleSessionSection(e.id)}
                >
                  <span class="sidebar-session-group-toggle__icon" aria-hidden="true"
                    >${a ? j.chevronRight : j.chevronDown}</span
                  >
                  <span class="sidebar-recent-sessions__label-text">${o}</span>
                  <span class="sidebar-session-group-count">${e.rows.length}</span>
                </button>
                ${
                  n
                    ? v`
                      <button
                        type="button"
                        class="sidebar-session-group-actions"
                        title=${k(`sessionsView.groupMenu`, { group: n })}
                        aria-label=${k(`sessionsView.groupMenu`, { group: n })}
                        aria-haspopup="menu"
                        aria-expanded=${String(this.sessionGroupMenu?.group === n)}
                        @click=${(e) => {
                          e.stopPropagation();
                          let t = e.currentTarget,
                            r = t.getBoundingClientRect();
                          this.openSessionGroupMenu(n, r.right, r.bottom + 4, t);
                        }}
                      >
                        ${j.moreHorizontal}
                      </button>
                    `
                    : b
                }
              </div>
            `
            : b
        }
        ${
          a
            ? b
            : v`
              <div class="sidebar-recent-sessions__list">
                ${t ? this.renderChatFallback() : e.rows.map((e) => this.renderRecentSession(e))}
              </div>
            `
        }
      </div>
    `;
        }
        selectedAgentSessionRows(e) {
          let t = pi(this.sessionCatalogs),
            n = this.expandedAgentId(),
            r = C(this.sessionsAgentId ?? ``);
          return n === C(e.selectedAgentId) && n === r
            ? e.visibleSessions.filter((e) => !t.has(e.key))
            : ft(
                n === r
                  ? (this.sessionsResult?.sessions ?? [])
                  : (this.sessionRowsByAgent[n] ?? []),
                {
                  agentId: n,
                  defaultAgentId: bt({
                    agentsList: this.context?.agents.state.agentsList,
                    hello: this.context?.gateway.snapshot.hello,
                  }),
                  filterByAgent: !0,
                  showCron: this.sessionsShowCron,
                },
              )
                .toSorted(this.compareSidebarSessionRows)
                .filter((e) => !t.has(e.key))
                .map(e.toSidebarSession);
        }
        agentUnreadCount(e) {
          return (this.sessionRowsByAgent[C(e)] ?? []).filter(
            (e) => e.unread === !0 && e.archived !== !0,
          ).length;
        }
        renderDraftSessionRow() {
          return v`
      <div class="sidebar-recent-session sidebar-recent-session--draft">
        <span class="sidebar-recent-session__link">
          <span class="sidebar-recent-session__text">
            <span class="sidebar-recent-session__name">${k(`newSession.draftRow`)}</span>
          </span>
        </span>
      </div>
    `;
        }
        renderSessionListBody(e, t) {
          let n = Ja(e, this.visibleSessionLimit),
            r = ot(n, {
              grouping: this.sessionsGrouping,
              knownGroups:
                this.sessionsGrouping === `category` ? this.knownSessionGroups() : void 0,
            });
          return v`
      ${t.showDraft ? this.renderDraftSessionRow() : b}
      ${r.map((n) => this.renderSessionSection(n, t.showFallback && e.length === 0 && n.id === `ungrouped`))}
      ${this.renderSessionPagination(e, n.length)}
    `;
        }
        renderSessionPagination(e, t) {
          let n = t < e.length,
            r = Ja(e, no).length,
            i = t > ro && t > r;
          return !n && !i
            ? b
            : v`
      <div class="sidebar-session-pagination">
        ${
          n
            ? v`<button
              type="button"
              class="sidebar-session-pagination__button"
              aria-label=${k(`chat.selectors.loadMoreSessions`)}
              @click=${() => {
                this.visibleSessionLimit = t + no;
              }}
            >
              ${k(`chat.selectors.loadMoreSessions`)}
            </button>`
            : b
        }
        ${
          i
            ? v`<button
              type="button"
              class="sidebar-session-pagination__button"
              aria-label=${k(`usage.details.collapse`)}
              @click=${() => {
                (this.clearSessionSelection(), (this.visibleSessionLimit = no));
              }}
            >
              ${k(`usage.details.collapse`)}
            </button>`
            : b
        }
      </div>
    `;
        }
        renderSessions() {
          let e = this.getSessionNavigationState(),
            { newSessionDisabled: t, newSessionTitle: n } = e,
            r = this.selectedAgentSessionRows(e),
            i = this.expandedAgentId();
          return v`
      <section class="sidebar-sessions">
        ${
          this.sessionMutationError
            ? v`
              <div
                class="sidebar-session-error callout danger callout--dismissible"
                role="alert"
                data-sidebar-session-error
              >
                <span class="callout__content">${this.sessionMutationError}</span>
                <openclaw-tooltip .content=${k(`chat.actions.dismissError`)}>
                  <button
                    class="callout__dismiss"
                    type="button"
                    @click=${() => {
                      this.sessionMutationError = null;
                    }}
                    aria-label=${k(`chat.actions.dismissError`)}
                  >
                    ${j.x}
                  </button>
                </openclaw-tooltip>
              </div>
            `
            : b
        }
        <div
          class="sidebar-recent-sessions sidebar-recent-sessions--scroll-${this.sessionsScrollState}"
          aria-label=${O(`sessions`)}
          @scroll=${(e) => this.updateSessionsScrollState(e.currentTarget)}
        >
          <div class="sidebar-recent-sessions__head sidebar-recent-sessions__head--root">
            <span class="sidebar-recent-sessions__label-text">${k(`sessionsView.title`)}</span>
            <button
              type="button"
              class="sidebar-session-sort"
              title=${k(`chat.sidebar.sortSessions`)}
              aria-label=${k(`chat.sidebar.sortSessions`)}
              aria-haspopup="menu"
              aria-expanded=${String(this.sessionSortMenuPosition !== null)}
              @click=${(e) => {
                let t = e.currentTarget;
                this.toggleSessionSortMenu(t);
              }}
            >
              ${j.listFilter}
            </button>
            <button
              type="button"
              class="sidebar-session-sort sidebar-session-new"
              title=${n}
              aria-label=${k(`chat.runControls.newSession`)}
              ?disabled=${t}
              @click=${() => this.onOpenNewSession?.(i)}
            >
              ${j.plus}
            </button>
          </div>
          ${this.renderSessionListBody(r, { showDraft: !!this.draftSessionAgentId && C(this.draftSessionAgentId) === i, showFallback: !0 })}
          ${this.renderSessionCatalogs(e)}
        </div>
      </section>
    `;
        }
        renderSessionCatalogs(e) {
          return gi({
            catalogs: this.sessionCatalogs,
            connected: this.connected,
            basePath: this.basePath,
            routeSessionKey: this.activeRouteId === `chat` ? this.getRouteSessionKey() : ``,
            newSessionAgentId: this.expandedAgentId(),
            collapsedSections: this.collapsedSessionSections,
            loadingMoreCatalogIds: this.loadingMoreSessionCatalogIds,
            liveRows: [
              ...(this.sessionsResult?.sessions ?? []),
              ...Object.values(this.sessionRowsByAgent).flat(),
            ],
            renderLiveRow: (t, n) => this.renderRecentSession(e.toSidebarSession(t), n),
            onToggleSection: (e) => this.toggleSessionSection(e),
            onLoadMore: (e) => void this.loadMoreSessionCatalog(e),
            onOpenNewSession: this.onOpenNewSession,
            onNavigate: this.onNavigate,
            catalogOpenTarget: this.catalogOpenTarget,
            terminalAvailable: this.terminalAvailable,
            onOpenTerminal: (e) => Je(e),
            onOpenMenu: (e, t, n, r) => this.catalogMenu.open(e, t, n, r),
          });
        }
        renderMoreRow() {
          return ei({
            open: this.moreMenuPosition !== null,
            active: ai({
              activeRouteId: this.activeRouteId,
              pinnedRoutes: this.sidebarPinnedRoutes,
              isRouteEnabled: (e) => this.isRouteEnabled(e),
            }),
            onToggle: (e) => this.toggleMoreMenu(e),
          });
        }
        renderMoreMenu() {
          let e = this.moreMenuPosition,
            t = this.moreMenuTrigger;
          return ri({
            position: e,
            basePath: this.basePath,
            activeRouteId: this.activeRouteId,
            activePluginTabId: this.activePluginTabId,
            pinnedRoutes: this.sidebarPinnedRoutes,
            pluginTabs: Qr(this.context?.gateway.snapshot.hello?.controlUiTabs),
            isRouteEnabled: (e) => this.isRouteEnabled(e),
            onTabAway: () => t?.focus(),
            onClose: (t) => {
              this.moreMenuPosition === e && this.closeMoreMenu({ restoreFocus: t });
            },
            onNavigateRoute: (e) => {
              (this.closeMoreMenu({ restoreFocus: !0 }), this.onNavigate?.(e));
            },
            onNavigatePluginTab: (e) => {
              (this.closeMoreMenu({ restoreFocus: !0 }),
                this.onNavigate?.(`plugin`, { search: e }));
            },
            onPreloadRoute: (e, t) => this.preloadRoute(e, t),
            onCancelPreload: this.cancelPreload,
            onEditPinnedItems: () => {
              let e = this.moreMenuPosition,
                t = this.moreMenuTrigger;
              e && this.openCustomizeMenu(e.x, e.y, t);
            },
          });
        }
        renderChatFallback() {
          return v`
      <a
        href=${D(`chat`, this.basePath)}
        class="sidebar-recent-session ${this.activeRouteId === `chat` ? `sidebar-recent-session--active` : ``}"
        @click=${(e) => {
          Xr(e) && (e.preventDefault(), this.onNavigate?.(`chat`));
        }}
      >
        <span class="sidebar-recent-session__text">
          <span class="sidebar-recent-session__name">${k(`nav.chat`)}</span>
        </span>
      </a>
    `;
        }
        render() {
          let e = k(`chat.gatewayStatus`, {
              status: this.connected ? k(`common.online`) : k(`common.offline`),
            }),
            { activeId: t, agent: n, agents: r } = this.activeChipAgent(),
            i = r.some((e) => {
              let n = C(e.id);
              return n !== t && this.agentUnreadCount(n) > 0;
            }),
            a = n ? je(n) : t,
            o = (n ? Ft(n) : null) ?? (a || t).slice(0, 1).toUpperCase();
          return v`
      <aside class="sidebar">
        <!-- The Mac app reserves this padding strip for the titlebar; presses
             on the bare inset ask the host to move the window (the native
             drag region that used to float here is gone). -->
        <div class="sidebar-shell" @mousedown=${qt}>
          ${this.renderBrand()}
          <div class="sidebar-shell__body">
            <nav class="sidebar-nav" @contextmenu=${this.openCustomizeMenuFromContext}>
              <div class="nav-section__items">
                ${this.sidebarPinnedRoutes.map((e) => this.renderRoute(e))}
                ${this.renderMoreRow()}
              </div>
            </nav>
            ${this.renderSessions()}
          </div>
          <div class="sidebar-shell__footer">
            <openclaw-sidebar-attention
              .onNavigate=${(e) => this.onNavigate?.(e)}
            ></openclaw-sidebar-attention>
            <openclaw-sidebar-update-card
              .updateAvailable=${this.updateAvailable}
              .updateRunning=${this.updateRunning}
              .onUpdate=${this.onUpdate}
            ></openclaw-sidebar-update-card>
            <openclaw-lobster-pet
              .seed=${Yi(this.sessionKey)}
              .mode=${Qi(this.connected, this.sessionsResult?.sessions)}
              .runOutcome=${Zi(this.sessionsResult?.sessions)}
              .visitsEnabled=${this.lobsterPetVisits}
              .soundsEnabled=${this.lobsterPetSounds}
              .gatewayVersion=${this.gatewayVersion}
            ></openclaw-lobster-pet>
            ${
              this.devGitBranch
                ? v`<div class="sidebar-footer-branch" title=${this.devGitBranch}>
                  <span class="sidebar-footer-branch__icon" aria-hidden="true"
                    >${j.gitBranch}</span
                  >
                  <span class="sidebar-footer-branch__name">${this.devGitBranch}</span>
                </div>`
                : b
            }
            <openclaw-sidebar-agent-chip
              .agentName=${a}
              .avatarUrl=${n ? rt(n) : null}
              .avatarText=${o}
              .connected=${this.connected}
              .statusLabel=${e}
              .subtitle=${this.agentChipSubtitle(t)}
              .menuOpen=${this.agentMenuPosition !== null}
              .menuUnread=${i}
              .newSessionDisabled=${!this.connected}
              .onNewSession=${() => this.onOpenNewSession?.(t)}
              .onToggleMenu=${(e) => this.toggleAgentMenu(e)}
            ></openclaw-sidebar-agent-chip>
          </div>
        </div>
        ${this.renderCustomizeMenu()} ${this.renderMoreMenu()} ${this.renderAgentMenu()}
        ${this.renderSessionMenu()} ${this.catalogMenu.render()} ${this.renderSessionGroupMenu()}
        ${this.renderSessionSortMenu()}
      </aside>
    `;
        }
      }),
      i([_({ attribute: !1 })], q.prototype, `basePath`, void 0),
      i([_({ attribute: !1 })], q.prototype, `activeRouteId`, void 0),
      i([_({ attribute: !1 })], q.prototype, `activePluginTabId`, void 0),
      i([_({ attribute: !1 })], q.prototype, `enabledRouteIds`, void 0),
      i([_({ attribute: !1 })], q.prototype, `connected`, void 0),
      i([_({ attribute: !1 })], q.prototype, `terminalAvailable`, void 0),
      i([_({ attribute: !1 })], q.prototype, `catalogOpenTarget`, void 0),
      i([_({ attribute: !1 })], q.prototype, `canPairDevice`, void 0),
      i([_({ attribute: !1 })], q.prototype, `sessionKey`, void 0),
      i([_({ attribute: !1 })], q.prototype, `sidebarPinnedRoutes`, void 0),
      i([_({ attribute: !1 })], q.prototype, `pinnedAgentIds`, void 0),
      i([_({ attribute: !1 })], q.prototype, `themeMode`, void 0),
      i([_({ attribute: !1 })], q.prototype, `lobsterPetVisits`, void 0),
      i([_({ attribute: !1 })], q.prototype, `lobsterPetSounds`, void 0),
      i([_({ attribute: !1 })], q.prototype, `gatewayVersion`, void 0),
      i([_({ attribute: !1 })], q.prototype, `devGitBranch`, void 0),
      i([_({ attribute: !1 })], q.prototype, `updateAvailable`, void 0),
      i([_({ attribute: !1 })], q.prototype, `updateRunning`, void 0),
      i([_({ attribute: !1 })], q.prototype, `onUpdate`, void 0),
      i([_({ attribute: !1 })], q.prototype, `onOpenPalette`, void 0),
      i([_({ attribute: !1 })], q.prototype, `onToggleSidebar`, void 0),
      i([_({ attribute: !1 })], q.prototype, `onOpenNewSession`, void 0),
      i([_({ attribute: !1 })], q.prototype, `draftSessionAgentId`, void 0),
      i([_({ attribute: !1 })], q.prototype, `onUpdatePinnedRoutes`, void 0),
      i([_({ attribute: !1 })], q.prototype, `onPairMobile`, void 0),
      i([_({ attribute: !1 })], q.prototype, `onNavigate`, void 0),
      i([_({ attribute: !1 })], q.prototype, `onPreloadRoute`, void 0),
      i([m({ context: Ht, subscribe: !0 })], q.prototype, `context`, void 0),
      i([g()], q.prototype, `customizeMenuPosition`, void 0),
      i([g()], q.prototype, `moreMenuPosition`, void 0),
      i([g()], q.prototype, `sessionMenu`, void 0),
      i([g()], q.prototype, `selectedSessionKeys`, void 0),
      i([g()], q.prototype, `sessionMenuWork`, void 0),
      i([g()], q.prototype, `sessionGroupMenu`, void 0),
      i([g()], q.prototype, `draggingSessionKey`, void 0),
      i([g()], q.prototype, `draggingSessionGroup`, void 0),
      i([g()], q.prototype, `sessionDropTarget`, void 0),
      i([g()], q.prototype, `sessionGroupDropTarget`, void 0),
      i([g()], q.prototype, `collapsedSessionSections`, void 0),
      i([g()], q.prototype, `sessionSortMode`, void 0),
      i([g()], q.prototype, `sessionsGrouping`, void 0),
      i([g()], q.prototype, `sessionsShowCron`, void 0),
      i([g()], q.prototype, `sessionSortMenuPosition`, void 0),
      i([g()], q.prototype, `agentMenuPosition`, void 0),
      i([g()], q.prototype, `agentMenuFilter`, void 0),
      i([g()], q.prototype, `visibleSessionLimit`, void 0),
      i([g()], q.prototype, `sessionsResult`, void 0),
      i([g()], q.prototype, `sessionsAgentId`, void 0),
      i([g()], q.prototype, `sessionsLoading`, void 0),
      i([g()], q.prototype, `sessionsScrollState`, void 0),
      i([g()], q.prototype, `sessionCatalogs`, void 0),
      i([g()], q.prototype, `loadingMoreSessionCatalogIds`, void 0),
      i([g()], q.prototype, `sessionMutationError`, void 0),
      i([g()], q.prototype, `logoVisit`, void 0),
      customElements.get(`openclaw-app-sidebar`) ||
        customElements.define(`openclaw-app-sidebar`, q));
  }),
  J,
  co = e(() => {
    (y(),
      h(),
      zt(),
      Lt(),
      A(),
      E(),
      M(),
      I(),
      t(),
      (J = class extends T {
        constructor(...e) {
          (super(...e),
            (this.navDrawerOpen = !1),
            (this.onboarding = !1),
            (this.basePath = ``),
            (this.searchDisabled = !1));
        }
        render() {
          let e = this.navDrawerOpen ? k(`nav.collapse`) : k(`nav.expand`);
          return v`
      <header
        class="topbar"
        ?inert=${this.onboarding}
        aria-hidden=${this.onboarding ? `true` : b}
      >
        <div class="topnav-shell">
          <openclaw-tooltip .content=${e}>
            <button
              type="button"
              class="topbar-icon-btn topbar-nav-toggle"
              @click=${(e) => this.onToggleDrawer?.(e.currentTarget)}
              aria-label=${e}
              aria-expanded=${String(this.navDrawerOpen)}
            >
              <span class="nav-collapse-toggle__icon" aria-hidden="true">${j.menu}</span>
            </button>
          </openclaw-tooltip>
          <!-- The Mac app used to float a native drag strip over this brand
               row; the web now asks the host to move the window itself. -->
          <div class="topnav-shell__content" @mousedown=${Kt}>
            <div class="topbar-brand" aria-label="OpenClaw">
              <img
                class="topbar-brand__logo"
                src=${Gt(`apple-touch-icon.png`, this.basePath)}
                alt=""
                aria-hidden="true"
              />
              <span class="topbar-brand__title">OpenClaw</span>
            </div>
          </div>
          <div class="topnav-shell__actions">
            <openclaw-tooltip .content=${k(`chat.commandPaletteTitle`)}>
              <button
                class="topbar-search"
                ?disabled=${this.searchDisabled || !this.onOpenPalette}
                @click=${() => this.onOpenPalette?.()}
                aria-label=${k(`chat.openCommandPalette`)}
              >
                ${j.search}
              </button>
            </openclaw-tooltip>
          </div>
        </div>
      </header>
    `;
        }
      }),
      i([_({ attribute: !1 })], J.prototype, `navDrawerOpen`, void 0),
      i([_({ attribute: !1 })], J.prototype, `onboarding`, void 0),
      i([_({ attribute: !1 })], J.prototype, `basePath`, void 0),
      i([_({ attribute: !1 })], J.prototype, `onToggleDrawer`, void 0),
      i([_({ attribute: !1 })], J.prototype, `onOpenPalette`, void 0),
      i([_({ attribute: !1 })], J.prototype, `searchDisabled`, void 0),
      customElements.get(`openclaw-app-topbar`) || customElements.define(`openclaw-app-topbar`, J));
  });
function lo(e, t) {
  e.setAttribute(`aria-label`, t);
}
function uo(e) {
  let t = e.label ?? go;
  return v`
    <openclaw-tooltip .content=${t}>
      <button
        class="btn btn--xs chat-copy-btn"
        type="button"
        aria-label=${t}
        @click=${async (n) => {
          let r = n.currentTarget;
          if (!r || r.dataset.copying === `1`) return;
          ((r.dataset.copying = `1`), r.setAttribute(`aria-busy`, `true`), (r.disabled = !0));
          let i = await mn(e.text());
          if (r.isConnected) {
            if ((delete r.dataset.copying, r.removeAttribute(`aria-busy`), (r.disabled = !1), !i)) {
              ((r.dataset.error = `1`),
                lo(r, vo),
                window.setTimeout(() => {
                  r.isConnected && (delete r.dataset.error, lo(r, t));
                }, ho));
              return;
            }
            ((r.dataset.copied = `1`),
              lo(r, _o),
              window.setTimeout(() => {
                r.isConnected && (delete r.dataset.copied, lo(r, t));
              }, mo));
          }
        }}
      >
        <span class="chat-copy-btn__icon" aria-hidden="true">
          <span class="chat-copy-btn__icon-copy">${j.copy}</span>
          <span class="chat-copy-btn__icon-check">${j.check}</span>
        </span>
      </button>
    </openclaw-tooltip>
  `;
}
function fo(e, t = go) {
  return uo({ text: () => e, label: t });
}
function po(e) {
  return fo(e, go);
}
var mo,
  ho,
  go,
  _o,
  vo,
  yo = e(() => {
    (y(),
      hn(),
      M(),
      I(),
      (mo = 1500),
      (ho = 2e3),
      (go = `Copy as markdown`),
      (_o = `Copied`),
      (vo = `Copy failed`));
  });
async function bo(e) {
  await mn(e);
}
function xo(e) {
  let t = k(`connection.help.copyCommand`);
  return v`
    <openclaw-tooltip .content=${t}>
      <div
        class="login-gate__command"
        role="button"
        tabindex="0"
        aria-label=${k(`connection.help.copyCommandAria`, { command: e })}
        @click=${async (t) => {
          t.target?.closest(`.chat-copy-btn`) || (await bo(e));
        }}
        @keydown=${async (t) => {
          (t.key !== `Enter` && t.key !== ` `) || (t.preventDefault(), await bo(e));
        }}
      >
        <code>${e}</code>
        ${fo(e, t)}
      </div>
    </openclaw-tooltip>
  `;
}
var So = e(() => {
  (y(), A(), hn(), yo(), I());
});
function Co(e) {
  return e.includes(`insecure-http`)
    ? k(`login.failure.docsInsecure`)
    : e.includes(`device-pairing`)
      ? k(`login.failure.docsPairing`)
      : k(`login.failure.docsAuth`);
}
function wo(e) {
  return e
    .replace(
      /([?#&])(?:access_token|auth|deviceToken|password|refresh_token|token)=([^&#\s]+)/gi,
      `$1[redacted-credential]`,
    )
    .replace(/\bBearer\s+([A-Za-z0-9._~+/-]+=*)/gi, `Bearer [redacted]`)
    .replace(
      /(["']?(?:access|accessToken|deviceToken|password|refresh|refreshToken|token)["']?\s*[:=]\s*)["']?[^"',\s}]+/gi,
      `$1[redacted]`,
    );
}
function To(e) {
  let t = e.docsHref ?? `https://docs.openclaw.ai/web/dashboard`;
  return {
    kind: e.kind,
    title: k(e.titleKey, e.stepParams),
    summary: k(e.summaryKey, e.stepParams),
    steps: e.stepKeys.map((t) => k(t, e.stepParams)),
    docsHref: t,
    docsLabel: Co(t),
    rawError: wo(e.rawError),
  };
}
function Eo(e) {
  if (e.connected || !e.lastError) return null;
  let t = e.lastError,
    n = e.lastErrorCode ?? null,
    r = S(t),
    i = Oe(!1, t, n);
  if (i)
    return To({
      kind: `pairing-required`,
      rawError: t,
      docsHref: `https://docs.openclaw.ai/web/control-ui#device-pairing-first-connection`,
      titleKey:
        i.kind === `scope-upgrade-pending`
          ? `login.failure.pairing.scopeTitle`
          : i.kind === `role-upgrade-pending`
            ? `login.failure.pairing.roleTitle`
            : i.kind === `metadata-upgrade-pending`
              ? `login.failure.pairing.metadataTitle`
              : `login.failure.pairing.title`,
      summaryKey:
        i.kind === `pairing-required`
          ? `login.failure.pairing.summary`
          : `login.failure.pairing.upgradeSummary`,
      stepKeys: [
        `login.failure.pairing.stepList`,
        i.requestId ? `login.failure.pairing.stepApproveId` : `login.failure.pairing.stepApprove`,
        `login.failure.pairing.stepReconnect`,
      ],
      stepParams: { requestId: i.requestId ?? `` },
    });
  if (
    n === de.AUTH_RATE_LIMITED ||
    r.includes(`too many failed authentication attempts`) ||
    r.includes(`rate limit`)
  )
    return To({
      kind: `auth-rate-limited`,
      rawError: t,
      titleKey: `login.failure.rateLimited.title`,
      summaryKey: `login.failure.rateLimited.summary`,
      stepKeys: [
        `login.failure.rateLimited.stepStop`,
        `login.failure.rateLimited.stepWait`,
        `login.failure.rateLimited.stepCheckClients`,
      ],
    });
  if (xt(!1, t, n))
    return To({
      kind: `insecure-context`,
      rawError: t,
      docsHref: `https://docs.openclaw.ai/web/control-ui#insecure-http`,
      titleKey: `login.failure.insecure.title`,
      summaryKey: `login.failure.insecure.summary`,
      stepKeys: [
        `login.failure.insecure.stepHttps`,
        `login.failure.insecure.stepLocalCompat`,
        `login.failure.insecure.stepAvoidDisable`,
      ],
    });
  if (n === de.CONTROL_UI_ORIGIN_NOT_ALLOWED || r.includes(`origin not allowed`))
    return To({
      kind: `origin-not-allowed`,
      rawError: t,
      docsHref: `https://docs.openclaw.ai/web/control-ui#debuggingtesting-dev-server--remote-gateway`,
      titleKey: `login.failure.origin.title`,
      summaryKey: `login.failure.origin.summary`,
      stepKeys: [
        `login.failure.origin.stepAllowedOrigins`,
        `login.failure.origin.stepFullOrigin`,
        `login.failure.origin.stepRestart`,
      ],
    });
  if (r.includes(`protocol mismatch`))
    return To({
      kind: `protocol-mismatch`,
      rawError: t,
      docsHref: `https://docs.openclaw.ai/web/control-ui#debuggingtesting-dev-server--remote-gateway`,
      titleKey: `login.failure.protocol.title`,
      summaryKey: `login.failure.protocol.summary`,
      stepKeys: [
        `login.failure.protocol.stepDashboard`,
        `login.failure.protocol.stepDevUi`,
        `login.failure.protocol.stepRestart`,
      ],
    });
  let a = we({
    connected: !1,
    lastError: t,
    lastErrorCode: n,
    hasToken: e.hasToken,
    hasPassword: e.hasPassword,
  });
  return To(
    a === `required`
      ? {
          kind: `auth-required`,
          rawError: t,
          titleKey: `login.failure.authRequired.title`,
          summaryKey: `login.failure.authRequired.summary`,
          stepKeys: [
            `login.failure.authRequired.stepPaste`,
            `login.failure.authRequired.stepGenerate`,
            `login.failure.authRequired.stepConnect`,
          ],
        }
      : a === `failed`
        ? {
            kind: `auth-failed`,
            rawError: t,
            titleKey: `login.failure.authFailed.title`,
            summaryKey: `login.failure.authFailed.summary`,
            stepKeys: [
              `login.failure.authFailed.stepDashboard`,
              `login.failure.authFailed.stepReplace`,
              `login.failure.authFailed.stepMode`,
            ],
          }
        : {
            kind: `network`,
            rawError: t,
            titleKey: `login.failure.network.title`,
            summaryKey: `login.failure.network.summary`,
            stepKeys: [
              `login.failure.network.stepGateway`,
              `login.failure.network.stepUrl`,
              `login.failure.network.stepDashboard`,
            ],
          },
  );
}
function Do(e) {
  return v`
    <div
      class="callout danger login-gate__failure"
      role="alert"
      aria-live="polite"
      data-kind=${e.kind}
    >
      <div class="login-gate__failure-title">${e.title}</div>
      <div class="login-gate__failure-summary">${e.summary}</div>
      <ol class="login-gate__failure-steps">
        ${e.steps.map((e) => v`<li>${e}</li>`)}
      </ol>
      <details class="login-gate__failure-detail">
        <summary>${k(`login.failure.rawError`)}</summary>
        <div class="login-gate__failure-raw mono">${e.rawError}</div>
      </details>
      <a
        class="session-link login-gate__failure-docs"
        href=${e.docsHref}
        target=${He}
        rel=${Me()}
        >${e.docsLabel}</a
      >
    </div>
  `;
}
function Oo(e) {
  let t = Gt(`favicon.svg`, Jt(e.basePath)),
    n = Eo({
      connected: e.connected,
      lastError: e.lastError,
      lastErrorCode: e.lastErrorCode,
      hasToken: e.hasToken,
      hasPassword: e.hasPassword,
    });
  return v`
    <div class="login-gate">
      <div class="login-gate__card">
        <div class="login-gate__header">
          <img class="login-gate__logo" src=${t} alt="OpenClaw" />
          <div class="login-gate__title">OpenClaw</div>
          <div class="login-gate__sub">${k(`login.subtitle`)}</div>
        </div>
        <div class="login-gate__form">
          <label class="field">
            <span>${k(`connection.access.wsUrl`)}</span>
            <input
              inputmode="url"
              autocapitalize="none"
              autocorrect="off"
              autocomplete="off"
              spellcheck="false"
              enterkeyhint="go"
              .value=${e.gatewayUrl}
              @input=${(t) => {
                e.onGatewayUrlChange(t.target.value);
              }}
              @keydown=${(t) => {
                t.key === `Enter` && e.onConnect();
              }}
              placeholder="ws://127.0.0.1:18789"
            />
          </label>
          <label class="field">
            <span>${k(`connection.access.token`)}</span>
            <div class="login-gate__secret-row">
              <input
                type=${e.showGatewayToken ? `text` : `password`}
                autocomplete="off"
                spellcheck="false"
                enterkeyhint="go"
                .value=${e.token}
                @input=${(t) => {
                  e.onTokenChange(t.target.value);
                }}
                placeholder="OPENCLAW_GATEWAY_TOKEN (${k(`login.passwordPlaceholder`)})"
                @keydown=${(t) => {
                  t.key === `Enter` && e.onConnect();
                }}
              />
              <openclaw-tooltip
                .content=${e.showGatewayToken ? k(`login.hideToken`) : k(`login.showToken`)}
              >
                <button
                  type="button"
                  class="btn btn--icon ${e.showGatewayToken ? `active` : ``}"
                  aria-label=${k(`login.toggleTokenVisibility`)}
                  aria-pressed=${e.showGatewayToken}
                  @click=${e.onToggleGatewayToken}
                >
                  ${e.showGatewayToken ? j.eye : j.eyeOff}
                </button>
              </openclaw-tooltip>
            </div>
          </label>
          <label class="field">
            <span>${k(`connection.access.password`)}</span>
            <div class="login-gate__secret-row">
              <input
                type=${e.showGatewayPassword ? `text` : `password`}
                autocomplete="off"
                spellcheck="false"
                enterkeyhint="go"
                .value=${e.password}
                @input=${(t) => {
                  e.onPasswordChange(t.target.value);
                }}
                placeholder="${k(`login.passwordPlaceholder`)}"
                @keydown=${(t) => {
                  t.key === `Enter` && e.onConnect();
                }}
              />
              <openclaw-tooltip
                .content=${e.showGatewayPassword ? k(`login.hidePassword`) : k(`login.showPassword`)}
              >
                <button
                  type="button"
                  class="btn btn--icon ${e.showGatewayPassword ? `active` : ``}"
                  aria-label=${k(`login.togglePasswordVisibility`)}
                  aria-pressed=${e.showGatewayPassword}
                  @click=${e.onToggleGatewayPassword}
                >
                  ${e.showGatewayPassword ? j.eye : j.eyeOff}
                </button>
              </openclaw-tooltip>
            </div>
          </label>
          <button class="btn primary login-gate__connect" @click=${e.onConnect}>
            ${k(`common.connect`)}
          </button>
        </div>
        ${n ? Do(n) : ``}
        <details class="login-gate__help">
          <summary class="login-gate__help-title">${k(`connection.help.title`)}</summary>
          <ol class="login-gate__steps">
            <li>${k(`connection.help.step1`)}${xo(`openclaw gateway run`)}</li>
            <li>${k(`connection.help.step2`)} ${xo(`openclaw dashboard`)}</li>
            <li>${k(`connection.help.step3`)}</li>
          </ol>
          <div class="login-gate__docs">
            <a
              class="session-link"
              href="https://docs.openclaw.ai/web/dashboard"
              target="_blank"
              rel="noreferrer"
              >${k(`connection.help.docsLink`)}</a
            >
          </div>
        </details>
      </div>
    </div>
  `;
}
var ko,
  Ao = e(() => {
    (y(),
      h(),
      me(),
      Vt(),
      Lt(),
      A(),
      Be(),
      ye(),
      Re(),
      E(),
      So(),
      M(),
      t(),
      (ko = class extends T {
        render() {
          return this.props ? Oo(this.props) : b;
        }
      }),
      i([_({ attribute: !1 })], ko.prototype, `props`, void 0),
      customElements.get(`openclaw-login-gate`) ||
        customElements.define(`openclaw-login-gate`, ko));
  });
function jo(e) {
  let t = e.lastError ? wo(e.lastError) : null,
    n = k(`connection.offlineHint`);
  return v`
    <div class="connection-banner" role="status" aria-live="polite">
      <div class="connection-banner__pill" title=${t ? `${n}\n${t}` : n}>
        <span class="connection-banner__dot" aria-hidden="true"></span>
        <span class="connection-banner__title">${k(`connection.lostTitle`)}</span>
        <span class="connection-banner__state">${k(`connection.reconnecting`)}</span>
        <span class="connection-banner__sr-hint">${n}</span>
        <button class="connection-banner__retry" type="button" @click=${e.onRetry}>
          ${k(`connection.retryNow`)}
        </button>
      </div>
    </div>
  `;
}
var Mo,
  No = e(() => {
    (y(),
      h(),
      A(),
      E(),
      Ao(),
      t(),
      (Mo = class extends T {
        render() {
          return this.props ? jo(this.props) : b;
        }
      }),
      i([_({ attribute: !1 })], Mo.prototype, `props`, void 0),
      customElements.get(`openclaw-connection-banner`) ||
        customElements.define(`openclaw-connection-banner`, Mo));
  }),
  Po,
  Fo = e(() => {
    (ne(),
      y(),
      h(),
      E(),
      t(),
      (Po = class extends Et {
        constructor(...e) {
          (super(...e),
            (this.open = !0),
            (this.manual = !1),
            (this.label = ``),
            (this.description = ``),
            (this.returnFocus = null),
            (this.syncGeneration = 0),
            (this.suppressNextCancel = !1),
            (this.handleAfterShow = () => {
              this.isConnected && this.querySelector(`[autofocus]`)?.focus({ preventScroll: !0 });
            }),
            (this.handleShow = () => {
              queueMicrotask(() => requestAnimationFrame(() => this.handleAfterShow()));
            }),
            (this.handleAfterHide = () => {
              ((this.open = !1), (this.returnFocus = null));
            }),
            (this.handleHide = (e) => {
              if (this.suppressNextCancel) {
                this.suppressNextCancel = !1;
                return;
              }
              let t = new CustomEvent(`modal-cancel`, {
                bubbles: !0,
                composed: !0,
                cancelable: !0,
              });
              (this.dispatchEvent(t), t.defaultPrevented && e.preventDefault());
            }));
        }
        static {
          this.styles = ce`
    :host {
      display: contents;
    }

    wa-dialog {
      --width: min(var(--openclaw-modal-width, 540px), calc(100vw - 48px));
      --spacing: 0;
      --backdrop-filter: blur(4px);
    }

    wa-dialog::part(dialog) {
      max-height: var(--openclaw-modal-max-height, calc(100dvh - 48px));
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text);
      overflow: visible;
    }

    wa-dialog::part(body) {
      padding: 0;
      overflow: visible;
    }

    :host(.fullscreen) wa-dialog {
      --width: calc(100vw - 20px);
    }

    :host(.fullscreen) wa-dialog::part(dialog) {
      max-height: calc(100dvh - 20px);
    }

    :host(.palette) wa-dialog::part(dialog) {
      margin-block-start: min(20dvh, 160px);
      margin-block-end: auto;
    }

    :host(.drawer) wa-dialog::part(dialog) {
      height: 100dvh;
      max-height: 100dvh;
      margin: 0 0 0 auto;
      border-radius: 0;
    }

    @media (max-width: 640px) {
      wa-dialog {
        --width: calc(100vw - 24px);
      }

      wa-dialog::part(dialog) {
        max-height: 90dvh;
      }
    }
  `;
        }
        connectedCallback() {
          (this.manual && (this.open = !1),
            super.connectedCallback(),
            this.updateComplete.then(() => this.syncDialogOpen()));
        }
        disconnectedCallback() {
          this.syncGeneration += 1;
          let e = this.webAwesomeDialog,
            t = e?.shadowRoot?.querySelector(`dialog`);
          (t?.open && t.close(), e && (e.open = !1));
          let n = this.returnFocus;
          ((this.returnFocus = null),
            n?.isConnected && n.focus({ preventScroll: !0 }),
            super.disconnectedCallback());
        }
        render() {
          return v`
      <wa-dialog
        without-header
        light-dismiss
        .label=${this.label}
        @wa-show=${this.handleShow}
        @wa-after-show=${this.handleAfterShow}
        @wa-after-hide=${this.handleAfterHide}
        @wa-hide=${this.handleHide}
      >
        <slot></slot>
      </wa-dialog>
    `;
        }
        updated() {
          (this.syncAccessibility(), this.syncDialogOpen());
        }
        async syncDialogOpen() {
          let e = ++this.syncGeneration,
            t = this.webAwesomeDialog;
          if (!t || (await t.updateComplete, e !== this.syncGeneration || !this.isConnected))
            return;
          let n = t.shadowRoot?.querySelector(`dialog`);
          if (this.open) {
            if (n?.open) return;
            ((this.returnFocus =
              document.activeElement instanceof HTMLElement ? document.activeElement : null),
              (t.open = !0));
            return;
          }
          (t.open || n?.open) && ((this.suppressNextCancel = !0), (t.open = !1));
        }
        async syncAccessibility() {
          let e = this.webAwesomeDialog;
          if (!e) return;
          await e.updateComplete;
          let t = e.shadowRoot?.querySelector(`dialog`);
          t &&
            (this.label
              ? t.setAttribute(`aria-label`, this.label)
              : t.removeAttribute(`aria-label`),
            this.description
              ? t.setAttribute(`aria-description`, this.description)
              : t.removeAttribute(`aria-description`));
        }
        show() {
          this.open = !0;
        }
        hide() {
          this.open = !1;
        }
      }),
      i([_({ type: Boolean })], Po.prototype, `open`, void 0),
      i([_({ type: Boolean, reflect: !0 })], Po.prototype, `manual`, void 0),
      i([_()], Po.prototype, `label`, void 0),
      i([_()], Po.prototype, `description`, void 0),
      i([ae(`wa-dialog`)], Po.prototype, `webAwesomeDialog`, void 0),
      customElements.get(`openclaw-modal-dialog`) ||
        customElements.define(`openclaw-modal-dialog`, Po));
  });
function Io(e) {
  let t = Math.floor(Math.max(0, e) / 1e3);
  if (t < 60) return `${t}s`;
  let n = Math.floor(t / 60);
  return n < 60 ? `${n}m` : `${Math.floor(n / 60)}h`;
}
function Y(e, t, n) {
  return t
    ? v`<div class="exec-approval-meta-row">
    <span>${e}</span><span>${n?.path ? s(t) : t}</span>
  </div>`
    : b;
}
function Lo(e) {
  let t = [...(e.commandSpans ?? [])]
      .filter(
        (t) =>
          Number.isSafeInteger(t.startIndex) &&
          Number.isSafeInteger(t.endIndex) &&
          t.startIndex >= 0 &&
          t.endIndex > t.startIndex &&
          t.endIndex <= e.command.length,
      )
      .toSorted((e, t) => e.startIndex - t.startIndex || t.endIndex - e.endIndex),
    n = [],
    r = 0;
  for (let e of t) e.startIndex < r || (n.push(e), (r = e.endIndex));
  if (n.length === 0) return v`<div class="exec-approval-command mono">${e.command}</div>`;
  let i = [];
  r = 0;
  for (let t of n)
    (t.startIndex > r && i.push(e.command.slice(r, t.startIndex)),
      i.push(v`<mark class="exec-approval-command-span"
        >${e.command.slice(t.startIndex, t.endIndex)}</mark
      >`),
      (r = t.endIndex));
  return (
    r < e.command.length && i.push(e.command.slice(r)),
    v`<div class="exec-approval-command mono">${i}</div>`
  );
}
function Ro(e) {
  return v`
    ${Lo(e)}
    <div class="exec-approval-meta">
      ${Y(k(`execApproval.labels.host`), e.host)}
      ${Y(k(`execApproval.labels.agent`), e.agentId)}
      ${Y(k(`execApproval.labels.session`), e.sessionKey)}
      ${Y(k(`execApproval.labels.cwd`), e.cwd, { path: !0 })}
      ${Y(k(`execApproval.labels.resolved`), e.resolvedPath, { path: !0 })}
      ${Y(k(`execApproval.labels.security`), e.security)}
      ${Y(k(`execApproval.labels.ask`), e.ask)}
    </div>
  `;
}
function zo(e) {
  return v`
    ${
      e.pluginDescription
        ? v`<pre class="exec-approval-command mono" style="white-space:pre-wrap">
${e.pluginDescription}</pre>`
        : b
    }
    <div class="exec-approval-meta">
      ${Y(k(`execApproval.labels.severity`), e.pluginSeverity)}
      ${Y(k(`execApproval.labels.plugin`), e.pluginId)}
      ${Y(k(`execApproval.labels.agent`), e.request.agentId)}
      ${Y(k(`execApproval.labels.session`), e.request.sessionKey)}
    </div>
  `;
}
function Bo(e) {
  switch (e) {
    case `allow-once`:
      return k(`execApproval.allowOnce`);
    case `allow-always`:
      return k(`execApproval.alwaysAllow`);
    case `deny`:
      return k(`execApproval.deny`);
  }
  return k(`execApproval.deny`);
}
function Vo(e) {
  switch (e) {
    case `allow-once`:
      return `btn primary`;
    case `allow-always`:
      return `btn`;
    case `deny`:
      return `btn danger`;
  }
  return `btn danger`;
}
function Ho(e) {
  return e.request.allowedDecisions?.length
    ? e.request.allowedDecisions
    : e.kind === `exec` && e.request.ask === `always`
      ? [`allow-once`, `deny`]
      : Go;
}
function Uo(e, t) {
  return e.kind !== `exec` || t.includes(`allow-always`)
    ? b
    : v`<div class="exec-approval-warning">${k(`execApproval.allowAlwaysUnavailable`)}</div>`;
}
function Wo(e) {
  let t = e.queue[0];
  if (!t) return b;
  let n = t.request,
    r = t.expiresAtMs - Date.now(),
    i = r > 0 ? k(`execApproval.expiresIn`, { time: Io(r) }) : k(`execApproval.expired`),
    a = e.queue.length,
    o = t.kind === `plugin`,
    s = o
      ? (t.pluginTitle ?? k(`execApproval.pluginApprovalNeeded`))
      : k(`execApproval.execApprovalNeeded`),
    c = Ho(t);
  return v`
    <openclaw-modal-dialog label=${s} description=${i} @modal-cancel=${() => {
      !e.busy && c.includes(`deny`) && e.onDecision(`deny`);
    }}>
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`exec-approval-title`} class="exec-approval-title">${s}</div>
            <div id=${`exec-approval-description`} class="exec-approval-sub">${i}</div>
          </div>
          ${
            a > 1
              ? v`<div class="exec-approval-queue">
                ${k(`execApproval.pending`, { count: String(a) })}
              </div>`
              : b
          }
        </div>
        ${o ? zo(t) : Ro(n)}
        ${Uo(t, c)}
        ${e.error ? v`<div class="exec-approval-error">${e.error}</div>` : b}
        <div class="exec-approval-actions">
          ${c.map(
            (t) => v`
              <button
                class=${Vo(t)}
                ?disabled=${e.busy}
                @click=${() => e.onDecision(t)}
              >
                ${Bo(t)}
              </button>
            `,
          )}
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
var Go,
  Ko,
  qo = e(() => {
    (y(),
      h(),
      a(),
      Fo(),
      A(),
      E(),
      t(),
      (Go = [`allow-once`, `allow-always`, `deny`]),
      (Ko = class extends T {
        render() {
          return this.props ? Wo(this.props) : b;
        }
      }),
      i([_({ attribute: !1 })], Ko.prototype, `props`, void 0),
      customElements.get(`openclaw-exec-approval`) ||
        customElements.define(`openclaw-exec-approval`, Ko));
  });
function Jo(e) {
  if (!e.pendingGatewayUrl) return b;
  let t = k(`channels.gatewayUrlConfirmation.title`),
    n = k(`channels.gatewayUrlConfirmation.subtitle`);
  return v`
    <openclaw-modal-dialog
      label=${t}
      description=${n}
      @modal-cancel=${e.onCancel}
    >
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div id=${`gateway-url-confirmation-title`} class="exec-approval-title">${t}</div>
            <div id=${`gateway-url-confirmation-description`} class="exec-approval-sub">${n}</div>
          </div>
        </div>
        <div class="exec-approval-command mono">${e.pendingGatewayUrl}</div>
        <div class="callout danger" style="margin-top: 12px;">
          ${k(`channels.gatewayUrlConfirmation.warning`)}
        </div>
        <div class="exec-approval-actions">
          <button class="btn primary" @click=${e.onConfirm}>${k(`common.confirm`)}</button>
          <button class="btn" @click=${e.onCancel}>${k(`common.cancel`)}</button>
        </div>
      </div>
    </openclaw-modal-dialog>
  `;
}
var Yo,
  Xo = e(() => {
    (y(),
      h(),
      A(),
      E(),
      Fo(),
      t(),
      (Yo = class extends T {
        render() {
          return this.props ? Jo(this.props) : b;
        }
      }),
      i([_({ attribute: !1 })], Yo.prototype, `props`, void 0),
      customElements.get(`openclaw-gateway-url-confirmation`) ||
        customElements.define(`openclaw-gateway-url-confirmation`, Yo));
  });
function Zo(e, t) {
  let n = e[t];
  if (typeof n != `string` || !n.trim()) throw Error(`GitHub response omitted ${t}`);
  return n;
}
function Qo(e, t) {
  let n = e[t];
  return typeof n == `string` && n.trim() ? n : void 0;
}
function $o(e, t) {
  let n = e[t];
  return typeof n == `number` && Number.isFinite(n) ? n : void 0;
}
function es(e) {
  try {
    let t = decodeURIComponent(e).trim();
    return t && t !== `.` && t !== `..` ? t : null;
  } catch {
    return null;
  }
}
function ts(e) {
  let t;
  try {
    t = new URL(e, globalThis.location?.href ?? `http://localhost/`);
  } catch {
    return null;
  }
  if (
    t.protocol !== `https:` ||
    t.hostname.toLowerCase() !== ds ||
    t.username ||
    t.password ||
    (t.port && t.port !== `443`)
  )
    return null;
  let n = t.pathname.split(`/`).filter(Boolean),
    r = es(n[0] ?? ``),
    i = es(n[1] ?? ``),
    a = n[2],
    o = n[3] ?? ``;
  if (!r || !i || !/^[1-9]\d{0,9}$/.test(o)) return null;
  let s = a === `issues` ? `issue` : a === `pull` ? `pull` : null;
  return s ? { href: t.href, kind: s, number: Number(o), owner: r, repo: i } : null;
}
function ns(e) {
  return typeof e == `string` && /^data:image\/(?:gif|jpeg|png|webp);base64,/u.test(e) ? e : void 0;
}
function rs(e, t) {
  if (!he(t)) throw Error(`GitHub response was not an object`);
  if (
    t.kind !== e.kind ||
    typeof t.owner != `string` ||
    t.owner.toLowerCase() !== e.owner.toLowerCase() ||
    typeof t.repo != `string` ||
    t.repo.toLowerCase() !== e.repo.toLowerCase() ||
    t.number !== e.number
  )
    throw Error(`GitHub response did not match the requested link`);
  return {
    ...e,
    additions: $o(t, `additions`),
    avatarDataUrl: ns(t.avatarDataUrl),
    changedFiles: $o(t, `changedFiles`),
    closedAt: Qo(t, `closedAt`),
    comments: $o(t, `comments`),
    createdAt: Zo(t, `createdAt`),
    deletions: $o(t, `deletions`),
    draft: typeof t.draft == `boolean` ? t.draft : void 0,
    kind: e.kind,
    login: Qo(t, `login`) ?? `ghost`,
    mergedAt: Qo(t, `mergedAt`),
    number: e.number,
    owner: e.owner,
    repo: e.repo,
    state: Zo(t, `state`),
    stateReason: Qo(t, `stateReason`),
    title: Zo(t, `title`),
    updatedAt: Zo(t, `updatedAt`),
  };
}
function is(e) {
  return e.kind === `pull`
    ? e.mergedAt
      ? { label: k(`githubPreview.states.merged`), tone: `purple` }
      : e.draft && e.state === `open`
        ? { label: k(`githubPreview.states.draft`), tone: `muted` }
        : e.state === `open`
          ? { label: k(`githubPreview.states.open`), tone: `open` }
          : { label: k(`githubPreview.states.closed`), tone: `danger` }
    : e.state === `open`
      ? { label: k(`githubPreview.states.open`), tone: `open` }
      : e.stateReason === `not_planned`
        ? { label: k(`githubPreview.states.notPlanned`), tone: `muted` }
        : { label: k(`githubPreview.states.closed`), tone: `purple` };
}
function as(e, t, n, r) {
  let i = document.createElement(t);
  return ((i.className = n), (i.textContent = r), e.append(i), i);
}
function os(e, t, n) {
  as(e, `span`, `github-link-hovercard__metric ${t}`, n);
}
function ss(e) {
  (e.replaceChildren(),
    (e.dataset.loading = `true`),
    e.removeAttribute(`data-state`),
    as(e, `div`, `github-link-hovercard__loading`, k(`githubPreview.loading`)));
}
function cs(e) {
  (e.replaceChildren(),
    (e.dataset.loading = `false`),
    (e.dataset.state = `unavailable`),
    as(e, `div`, `github-link-hovercard__unavailable`, k(`githubPreview.unavailable`)));
}
function ls(e, t) {
  (e.replaceChildren(), (e.dataset.loading = `false`));
  let n = is(t);
  e.dataset.state = n.tone;
  let r = document.createElement(`div`);
  r.className = `github-link-hovercard__header`;
  let i = document.createElement(`span`);
  ((i.className = `github-link-hovercard__state`), (i.dataset.tone = n.tone));
  let a = document.createElement(`span`);
  ((a.className = `github-link-hovercard__state-dot`),
    a.setAttribute(`aria-hidden`, `true`),
    i.append(a, document.createTextNode(n.label)),
    r.append(i),
    as(r, `span`, `github-link-hovercard__repo`, `${t.owner}/${t.repo} #${t.number}`),
    as(r, `time`, `github-link-hovercard__time`, c(Date.parse(t.updatedAt))));
  let o = document.createElement(`div`);
  ((o.className = `github-link-hovercard__title`), (o.textContent = t.title));
  let s = document.createElement(`div`);
  s.className = `github-link-hovercard__footer`;
  let l = document.createElement(`span`);
  if (((l.className = `github-link-hovercard__author`), t.avatarDataUrl)) {
    let e = document.createElement(`img`);
    ((e.className = `github-link-hovercard__avatar`),
      (e.alt = ``),
      (e.decoding = `async`),
      (e.referrerPolicy = `no-referrer`),
      (e.src = t.avatarDataUrl),
      l.append(e));
  }
  (l.append(document.createTextNode(t.login)), s.append(l));
  let u = document.createElement(`span`);
  if (((u.className = `github-link-hovercard__metrics`), t.kind === `pull`)) {
    (os(u, `github-link-hovercard__metric--additions`, `+${t.additions ?? 0}`),
      os(u, `github-link-hovercard__metric--deletions`, `−${t.deletions ?? 0}`));
    let e = t.changedFiles ?? 0;
    os(u, ``, k(e === 1 ? `githubPreview.file` : `githubPreview.files`, { count: String(e) }));
  } else {
    let e = t.comments ?? 0;
    os(
      u,
      ``,
      k(e === 1 ? `githubPreview.comment` : `githubPreview.comments`, { count: String(e) }),
    );
  }
  (s.append(u),
    e.append(r, o, s),
    e.setAttribute(
      `aria-label`,
      k(`githubPreview.ariaLabel`, {
        state: n.label,
        kind: t.kind === `pull` ? k(`githubPreview.pullRequest`) : k(`githubPreview.issue`),
        repo: `${t.owner}/${t.repo}`,
        number: String(t.number),
        title: t.title,
        author: t.login,
      }),
    ));
}
function us(e) {
  for (let t of e.composedPath()) {
    if (t instanceof HTMLAnchorElement) return t;
    if (t === e.currentTarget) break;
  }
  return null;
}
var ds,
  fs,
  ps,
  ms,
  hs,
  X,
  gs,
  _s,
  vs,
  ys = e(() => {
    (pe(),
      A(),
      Ye(),
      (ds = `github.com`),
      (fs = 250),
      (ps = 5 * 6e4),
      (ms = 3e4),
      (hs = 100),
      (X = 12),
      (gs = 10),
      (_s = 0),
      (vs = class extends HTMLElement {
        constructor(...e) {
          (super(...e),
            (this.client = null),
            (this.cache = new Map()),
            (this.activeAnchor = null),
            (this.activeTarget = null),
            (this.card = null),
            (this.describedBy = null),
            (this.focusInside = !1),
            (this.openTimer = null),
            (this.pointerInside = !1),
            (this.renderedPreview = null),
            (this.renderedUnavailable = !1),
            (this.requestVersion = 0),
            (this.stopI18n = null),
            (this.handleLocaleChange = () => {
              let e = this.card;
              e &&
                (this.renderedPreview
                  ? ls(e, this.renderedPreview)
                  : this.renderedUnavailable
                    ? cs(e)
                    : ss(e),
                this.positionCard());
            }),
            (this.handlePointerOver = (e) => {
              if (e.pointerType === `touch`) return;
              let t = us(e),
                n = t ? ts(t.href) : null;
              !t || !n || (this.activate(t, n, fs), (this.pointerInside = !0));
            }),
            (this.handlePointerOut = (e) => {
              let t = us(e);
              !t ||
                t !== this.activeAnchor ||
                (e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) ||
                ((this.pointerInside = !1), this.focusInside || this.close());
            }),
            (this.handleFocusIn = (e) => {
              let t = us(e),
                n = t ? ts(t.href) : null;
              !t || !n || (this.activate(t, n, 0), (this.focusInside = !0));
            }),
            (this.handleFocusOut = (e) => {
              this.activeAnchor &&
                ((e.relatedTarget instanceof Node && this.activeAnchor.contains(e.relatedTarget)) ||
                  ((this.focusInside = !1), this.pointerInside || this.close()));
            }),
            (this.handleKeyDown = (e) => {
              e.key === `Escape` && this.close();
            }),
            (this.handleClick = () => {
              this.close();
            }),
            (this.handleViewportChange = () => {
              this.positionCard();
            }));
        }
        connectedCallback() {
          ((this.style.display = `contents`),
            this.addEventListener(`pointerover`, this.handlePointerOver),
            this.addEventListener(`pointerout`, this.handlePointerOut),
            this.addEventListener(`focusin`, this.handleFocusIn),
            this.addEventListener(`focusout`, this.handleFocusOut),
            this.addEventListener(`keydown`, this.handleKeyDown),
            this.addEventListener(`click`, this.handleClick),
            (this.stopI18n ??= fn.subscribe(this.handleLocaleChange)));
        }
        disconnectedCallback() {
          (this.removeEventListener(`pointerover`, this.handlePointerOver),
            this.removeEventListener(`pointerout`, this.handlePointerOut),
            this.removeEventListener(`focusin`, this.handleFocusIn),
            this.removeEventListener(`focusout`, this.handleFocusOut),
            this.removeEventListener(`keydown`, this.handleKeyDown),
            this.removeEventListener(`click`, this.handleClick),
            this.stopI18n?.(),
            (this.stopI18n = null),
            this.close());
        }
        activate(e, t, n) {
          (e === this.activeAnchor && this.activeTarget?.href === t.href) ||
            (this.close(),
            (this.activeAnchor = e),
            (this.activeTarget = t),
            (this.describedBy = e.getAttribute(`aria-describedby`)),
            (this.openTimer = window.setTimeout(() => {
              ((this.openTimer = null), this.show(e, t));
            }, n)));
        }
        async show(e, t) {
          if (this.activeAnchor !== e || this.activeTarget?.href !== t.href) return;
          let n = ++this.requestVersion,
            r = document.createElement(`div`);
          ((_s += 1),
            (r.id = `openclaw-github-hovercard-${_s}`),
            (r.className = `github-link-hovercard`),
            (r.dataset.open = `true`),
            r.setAttribute(`role`, `tooltip`),
            r.setAttribute(`aria-live`, `polite`),
            (this.renderedPreview = null),
            (this.renderedUnavailable = !1),
            ss(r),
            document.body.append(r),
            (this.card = r),
            e.setAttribute(
              `aria-describedby`,
              this.describedBy ? `${this.describedBy} ${r.id}` : r.id,
            ),
            this.listenForViewportChanges(),
            this.positionCard());
          try {
            let e = await this.loadPreview(t);
            if (n !== this.requestVersion || r !== this.card) return;
            ((this.renderedPreview = e), ls(r, e));
          } catch {
            if (n !== this.requestVersion || r !== this.card) return;
            ((this.renderedUnavailable = !0), cs(r));
          }
          this.positionCard();
        }
        loadPreview(e) {
          let t = `${e.kind}:${e.owner.toLowerCase()}/${e.repo.toLowerCase()}#${e.number}`,
            n = Date.now(),
            r = this.cache.get(t);
          if (r && r.expiresAt > n) return (this.cache.delete(t), this.cache.set(t, r), r.promise);
          r && this.cache.delete(t);
          let i = {
            expiresAt: n + ps,
            promise: (async () => {
              if (!this.client) throw Error(`GitHub preview requires a connected Gateway`);
              return rs(
                e,
                await this.client.request(`controlUi.githubPreview`, {
                  kind: e.kind,
                  number: e.number,
                  owner: e.owner,
                  repo: e.repo,
                }),
              );
            })().catch((e) => {
              throw ((i.expiresAt = Date.now() + ms), e);
            }),
          };
          for (this.cache.set(t, i); this.cache.size > hs;) {
            let e = this.cache.keys().next().value;
            if (!e) break;
            this.cache.delete(e);
          }
          return i.promise;
        }
        close() {
          (this.openTimer !== null &&
            (window.clearTimeout(this.openTimer), (this.openTimer = null)),
            (this.requestVersion += 1),
            this.activeAnchor &&
              (this.describedBy === null
                ? this.activeAnchor.removeAttribute(`aria-describedby`)
                : this.activeAnchor.setAttribute(`aria-describedby`, this.describedBy)),
            this.card?.remove(),
            (this.card = null),
            (this.renderedPreview = null),
            (this.renderedUnavailable = !1),
            (this.activeAnchor = null),
            (this.activeTarget = null),
            (this.describedBy = null),
            (this.focusInside = !1),
            (this.pointerInside = !1),
            this.stopListeningForViewportChanges());
        }
        listenForViewportChanges() {
          (window.addEventListener(`resize`, this.handleViewportChange),
            window.addEventListener(`scroll`, this.handleViewportChange, !0),
            window.visualViewport?.addEventListener(`resize`, this.handleViewportChange),
            window.visualViewport?.addEventListener(`scroll`, this.handleViewportChange));
        }
        stopListeningForViewportChanges() {
          (window.removeEventListener(`resize`, this.handleViewportChange),
            window.removeEventListener(`scroll`, this.handleViewportChange, !0),
            window.visualViewport?.removeEventListener(`resize`, this.handleViewportChange),
            window.visualViewport?.removeEventListener(`scroll`, this.handleViewportChange));
        }
        positionCard() {
          let e = this.activeAnchor,
            t = this.card;
          if (!e || !t) return;
          let n = e.getBoundingClientRect(),
            r = t.getBoundingClientRect(),
            i = n.bottom + gs + r.height + X <= innerHeight ? `bottom` : `top`,
            a = i === `bottom` ? n.bottom + gs : n.top - r.height - gs,
            o = Math.max(X, innerWidth - r.width - X),
            s = Math.max(X, innerHeight - r.height - X);
          ((t.dataset.side = i),
            (t.style.left = `${Math.min(Math.max(X, n.left), o)}px`),
            (t.style.top = `${Math.min(Math.max(X, a), s)}px`));
        }
      }));
  }),
  bs = e(() => {
    (ys(),
      customElements.get(`openclaw-github-link-hovercard-provider`) ||
        customElements.define(`openclaw-github-link-hovercard-provider`, vs));
  }),
  Z,
  xs = e(() => {
    (y(),
      h(),
      zt(),
      A(),
      E(),
      M(),
      I(),
      t(),
      (Z = class extends T {
        constructor(...e) {
          (super(...e),
            (this.navCollapsed = !1),
            (this.historyOnly = !1),
            (this.canGoBack = !1),
            (this.canGoForward = !1));
        }
        render() {
          let e = this.navCollapsed ? k(`nav.expand`) : k(`nav.collapse`);
          return v`
      <nav class="macos-titlebar-controls" @mousedown=${Kt}>
        ${this.historyOnly ? b : this.renderButton({ label: e, icon: this.navCollapsed ? j.panelLeftOpen : j.panelLeftClose, ariaExpanded: !this.navCollapsed, onClick: this.onToggleSidebar, className: `macos-titlebar-controls__sidebar-toggle` })}
        ${this.renderButton({ label: k(`nav.back`), icon: j.chevronLeft, disabled: !this.canGoBack, onClick: () => globalThis.history.back(), className: `macos-titlebar-controls__back` })}
        ${this.renderButton({ label: k(`nav.forward`), icon: j.chevronRight, disabled: !this.canGoForward, onClick: () => globalThis.history.forward(), className: `macos-titlebar-controls__forward` })}
        ${
          this.navCollapsed && !this.historyOnly
            ? v`
              ${this.renderButton({ label: k(`chat.openCommandPalette`), tooltip: k(`chat.commandPaletteTitle`), icon: j.search, onClick: this.onOpenPalette, className: `macos-titlebar-controls__search` })}
              ${this.renderButton({ label: k(`chat.runControls.newSession`), icon: j.plus, onClick: this.onOpenNewSession, className: `macos-titlebar-controls__new-session` })}
            `
            : b
        }
      </nav>
    `;
        }
        renderButton(e) {
          return v`
      <openclaw-tooltip .content=${e.tooltip ?? e.label}>
        <button
          type="button"
          class="topbar-icon-btn macos-titlebar-controls__button ${e.className}"
          aria-label=${e.label}
          aria-expanded=${e.ariaExpanded === void 0 ? b : String(e.ariaExpanded)}
          ?disabled=${e.disabled || !e.onClick}
          @click=${e.onClick}
        >
          ${e.icon}
        </button>
      </openclaw-tooltip>
    `;
        }
      }),
      i([_({ attribute: !1 })], Z.prototype, `navCollapsed`, void 0),
      i([_({ attribute: !1 })], Z.prototype, `historyOnly`, void 0),
      i([_({ attribute: !1 })], Z.prototype, `canGoBack`, void 0),
      i([_({ attribute: !1 })], Z.prototype, `canGoForward`, void 0),
      i([_({ attribute: !1 })], Z.prototype, `onToggleSidebar`, void 0),
      i([_({ attribute: !1 })], Z.prototype, `onOpenPalette`, void 0),
      i([_({ attribute: !1 })], Z.prototype, `onOpenNewSession`, void 0),
      customElements.get(`openclaw-macos-titlebar-controls`) ||
        customElements.define(`openclaw-macos-titlebar-controls`, Z));
  }),
  Ss,
  Cs = e(() => {
    (y(),
      h(),
      E(),
      t(),
      (Ss = class extends Et {
        constructor(...e) {
          (super(...e),
            (this.splitRatio = 0.6),
            (this.minRatio = 0.4),
            (this.maxRatio = 0.7),
            (this.label = `Resize split view`),
            (this.orientation = `vertical`),
            (this.isDragging = !1),
            (this.startPosition = 0),
            (this.startRatio = 0),
            (this.activePointerId = null),
            (this.handlePointerDown = (e) => {
              e.button === 0 &&
                ((this.isDragging = !0),
                (this.startPosition = this.orientation === `horizontal` ? e.clientY : e.clientX),
                (this.startRatio = this.splitRatio),
                this.classList.add(`dragging`),
                this.focus(),
                this.capturePointer(e.pointerId),
                document.addEventListener(`pointermove`, this.handlePointerMove),
                document.addEventListener(`pointerup`, this.handlePointerUp),
                document.addEventListener(`pointercancel`, this.handlePointerUp),
                e.preventDefault());
            }),
            (this.handlePointerMove = (e) => {
              if (!this.isDragging) return;
              let t = this.parentElement;
              if (!t) return;
              let n = this.previousElementSibling?.getBoundingClientRect(),
                r = this.nextElementSibling?.getBoundingClientRect(),
                i = t.getBoundingClientRect(),
                a =
                  this.orientation === `horizontal`
                    ? (n?.height ?? 0) + (r?.height ?? 0) || i.height
                    : (n?.width ?? 0) + (r?.width ?? 0) || i.width,
                o =
                  ((this.orientation === `horizontal` ? e.clientY : e.clientX) -
                    this.startPosition) /
                  a;
              this.emitResize(this.startRatio + o);
            }),
            (this.handlePointerUp = () => {
              this.stopDragging();
            }),
            (this.handleKeyDown = (e) => {
              let t = e.shiftKey ? 0.05 : 0.02,
                n = null,
                r = this.orientation === `horizontal` ? `ArrowUp` : `ArrowLeft`,
                i = this.orientation === `horizontal` ? `ArrowDown` : `ArrowRight`;
              (e.key === r
                ? (n = this.splitRatio - t)
                : e.key === i
                  ? (n = this.splitRatio + t)
                  : e.key === `Home`
                    ? (n = this.minRatio)
                    : e.key === `End` && (n = this.maxRatio),
                n != null && (e.preventDefault(), this.emitResize(n)));
            }));
        }
        static {
          this.styles = ce`
    :host {
      width: 4px;
      cursor: col-resize;
      flex-shrink: 0;
      position: relative;
      touch-action: none;
      user-select: none;
    }
    :host::before {
      content: "";
      position: absolute;
      top: 0;
      left: -4px;
      right: -4px;
      bottom: 0;
    }
    /* The visible divider is a centered hairline, not the whole gutter:
       filling the host paints a fat bar that stacks with neighboring pane
       borders into a multi-line smear while dragging. */
    :host::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 1px;
      transform: translateX(-50%);
      background: var(--border, #333);
      transition:
        background 150ms ease-out,
        width 150ms ease-out;
    }
    :host(:hover)::after,
    :host(.dragging)::after,
    :host(:focus-visible)::after {
      width: 2px;
      background: var(--accent, #007bff);
    }
    :host(:focus-visible) {
      outline: 2px solid var(--accent, #007bff);
      outline-offset: 2px;
    }
    :host([orientation="horizontal"]) {
      width: auto;
      height: 4px;
      cursor: row-resize;
    }
    :host([orientation="horizontal"])::before {
      top: -4px;
      left: 0;
      right: 0;
      bottom: -4px;
    }
    :host([orientation="horizontal"])::after {
      top: 50%;
      bottom: auto;
      left: 0;
      right: 0;
      width: auto;
      height: 1px;
      transform: translateY(-50%);
      transition:
        background 150ms ease-out,
        height 150ms ease-out;
    }
    :host([orientation="horizontal"]:hover)::after,
    :host([orientation="horizontal"].dragging)::after,
    :host([orientation="horizontal"]:focus-visible)::after {
      width: auto;
      height: 2px;
    }
  `;
        }
        render() {
          return b;
        }
        connectedCallback() {
          (super.connectedCallback(),
            this.setStaticAccessibilityAttributes(),
            this.addEventListener(`pointerdown`, this.handlePointerDown),
            this.addEventListener(`keydown`, this.handleKeyDown));
        }
        disconnectedCallback() {
          (super.disconnectedCallback(),
            this.removeEventListener(`pointerdown`, this.handlePointerDown),
            this.removeEventListener(`keydown`, this.handleKeyDown),
            this.stopDragging());
        }
        updated() {
          (this.setAttribute(`aria-valuemin`, String(this.toAriaValue(this.minRatio))),
            this.setAttribute(`aria-valuemax`, String(this.toAriaValue(this.maxRatio))),
            this.setAttribute(`aria-valuenow`, String(this.toAriaValue(this.splitRatio))),
            this.label
              ? this.setAttribute(`aria-label`, this.label)
              : this.removeAttribute(`aria-label`),
            this.setAttribute(`aria-orientation`, this.orientation));
        }
        stopDragging() {
          this.isDragging &&
            ((this.isDragging = !1),
            this.classList.remove(`dragging`),
            this.releaseActivePointer(),
            document.removeEventListener(`pointermove`, this.handlePointerMove),
            document.removeEventListener(`pointerup`, this.handlePointerUp),
            document.removeEventListener(`pointercancel`, this.handlePointerUp));
        }
        emitResize(e) {
          let t = this.clampRatio(e);
          this.dispatchEvent(
            new CustomEvent(`resize`, { detail: { splitRatio: t }, bubbles: !0, composed: !0 }),
          );
        }
        clampRatio(e) {
          return Math.max(this.minRatio, Math.min(this.maxRatio, e));
        }
        toAriaValue(e) {
          return Math.round(e * 100);
        }
        setStaticAccessibilityAttributes() {
          (this.setAttribute(`role`, `separator`),
            this.setAttribute(`tabindex`, `0`),
            this.setAttribute(`aria-orientation`, this.orientation));
        }
        capturePointer(e) {
          typeof this.setPointerCapture == `function` &&
            (this.setPointerCapture(e), (this.activePointerId = e));
        }
        releaseActivePointer() {
          let e = this.activePointerId;
          ((this.activePointerId = null),
            !(e == null || typeof this.releasePointerCapture != `function`) &&
              ((typeof this.hasPointerCapture == `function` && !this.hasPointerCapture(e)) ||
                this.releasePointerCapture(e)));
        }
      }),
      i([_({ type: Number })], Ss.prototype, `splitRatio`, void 0),
      i([_({ type: Number })], Ss.prototype, `minRatio`, void 0),
      i([_({ type: Number })], Ss.prototype, `maxRatio`, void 0),
      i([_({ type: String })], Ss.prototype, `label`, void 0),
      i([_({ type: String, reflect: !0 })], Ss.prototype, `orientation`, void 0),
      customElements.get(`resizable-divider`) || customElements.define(`resizable-divider`, Ss));
  }),
  ws,
  Ts = e(() => {
    (y(),
      h(),
      E(),
      t(),
      (ws = class extends T {
        render() {
          let e = this.props;
          return e
            ? v`
      ${
        e.statusBanner
          ? v`<div class="callout ${e.statusBanner.tone}" role="alert">
            ${e.statusBanner.text}
          </div>`
          : b
      }
    `
            : b;
        }
      }),
      i([_({ attribute: !1 })], ws.prototype, `props`, void 0),
      customElements.get(`openclaw-update-banner`) ||
        customElements.define(`openclaw-update-banner`, ws));
  });
function Es(e) {
  return (e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === `k`;
}
var Ds,
  Os = e(() => {
    Ds = `openclaw-command-palette-target`;
  });
function ks(e, t) {
  let n = S(t.label);
  return [ln(e), O(e)].some((e) => S(e) === n);
}
function As(e, t) {
  let n = S(e);
  if (!n)
    return It.map((e) => ({
      labelKey: e.labelKey,
      items: e.routes.map((e) => ({ routeId: e, blocks: [] })),
    }));
  let r = It.flatMap((e) => e.routes),
    i = r.filter((e) => [ln(e), O(e), dn(e)].some((e) => Zt(e, n))),
    a = new Set(i),
    o = It.flatMap((e) =>
      e.labelKey && Zt(k(e.labelKey), n)
        ? e.routes.filter((e) => (a.has(e) ? !1 : (a.add(e), !0)))
        : [],
    ),
    s = new Map(),
    c = new Set();
  for (let e of t) {
    let t = `${e.routeId}\u0000${e.search ?? ``}\u0000${e.hash}`;
    if (c.has(t)) continue;
    c.add(t);
    let n = s.get(e.routeId) ?? [];
    (n.push(e), s.set(e.routeId, n));
  }
  let l = [...i, ...o];
  return [
    ...(l.length > 0
      ? [
          {
            labelKey: null,
            items: l.map((e) => ({
              routeId: e,
              blocks: (s.get(e) ?? []).filter((t) => !ks(e, t)),
            })),
          },
        ]
      : []),
    ...r
      .filter((e) => !a.has(e) && s.has(e))
      .map((e) => ({ labelKey: null, items: [{ routeId: e, blocks: s.get(e) ?? [] }] })),
  ];
}
function js(e, t, n) {
  let r = !e.searchQuery && e.activeRouteId === t;
  return v`
    <a
      href=${D(t, e.basePath)}
      class="settings-sidebar__item ${r ? `settings-sidebar__item--active` : ``}"
      aria-current=${r ? `page` : b}
      @focus=${(n) => an(e.preloadTimers, t, n, e.onPreload, r)}
      @blur=${(t) => un(e.preloadTimers, t)}
      @pointerenter=${(n) => an(e.preloadTimers, t, n, e.onPreload, r)}
      @pointerleave=${(t) => un(e.preloadTimers, t)}
      @touchstart=${(n) => an(e.preloadTimers, t, n, e.onPreload, r, !0)}
      @click=${(n) => {
        n.defaultPrevented ||
          n.button !== 0 ||
          n.metaKey ||
          n.ctrlKey ||
          n.shiftKey ||
          n.altKey ||
          (n.preventDefault(), e.onNavigate(t));
      }}
    >
      <span class="settings-sidebar__item-icon" aria-hidden="true"
        >${j[Xt(t)]}</span
      >
      <span class="settings-sidebar__item-label"
        >${n ?? ln(t)}</span
      >
    </a>
  `;
}
function Ms(e, t) {
  let n = D(t.routeId, e.basePath) + (t.search ?? ``) + t.hash,
    r =
      e.activeRouteId === t.routeId &&
      e.activeHash === t.hash &&
      (t.search === void 0 || e.activeSearch === t.search);
  return v`
    <a
      href=${n}
      class="settings-sidebar__subitem ${r ? `settings-sidebar__subitem--active` : ``}"
      aria-current=${r ? `location` : b}
      @click=${(n) => {
        n.defaultPrevented ||
          n.button !== 0 ||
          n.metaKey ||
          n.ctrlKey ||
          n.shiftKey ||
          n.altKey ||
          (n.preventDefault(),
          e.onNavigate(t.routeId, { ...(t.search ? { search: t.search } : {}), hash: t.hash }));
      }}
    >
      <span class="settings-sidebar__subitem-label">${t.label}</span>
    </a>
  `;
}
function Ns(e) {
  let t = k(`chat.gatewayStatus`, {
      status: e.connected ? k(`common.online`) : k(`common.offline`),
    }),
    n = As(e.searchQuery, e.searchBlockMatches ?? []);
  return v`
    <aside class="settings-sidebar">
      <header class="settings-sidebar__header">
        <button type="button" class="settings-sidebar__back" @click=${() => e.onExit()}>
          <span class="settings-sidebar__back-icon" aria-hidden="true">${j.arrowLeft}</span>
          ${k(`nav.exitSettings`)}
          <kbd class="settings-sidebar__esc" aria-hidden="true">esc</kbd>
        </button>
        <h1 class="settings-sidebar__title">${k(`nav.settings`)}</h1>
      </header>
      <div class="settings-sidebar__search" role="search">
        <span class="settings-sidebar__search-icon" aria-hidden="true">${j.search}</span>
        <input
          class="settings-sidebar__search-input"
          type="search"
          autocomplete="off"
          spellcheck="false"
          aria-label=${k(`nav.settingsSearchLabel`)}
          placeholder=${k(`nav.settingsSearchPlaceholder`)}
          .value=${e.searchQuery}
          @input=${(t) => e.onSearchQueryChange(t.currentTarget.value)}
          @keydown=${(t) => {
            t.key !== `Escape` || !e.searchQuery || (t.preventDefault(), e.onSearchQueryChange(``));
          }}
        />
        ${
          e.searchQuery
            ? v`
              <button
                type="button"
                class="settings-sidebar__search-clear"
                aria-label=${k(`nav.settingsSearchClear`)}
                @click=${(t) => {
                  let n = t.currentTarget.parentElement?.querySelector(`input`);
                  (e.onSearchQueryChange(``), n?.focus());
                }}
              >
                ${j.x}
              </button>
            `
            : b
        }
      </div>
      <nav class="settings-sidebar__nav" aria-label=${k(`common.settingsSections`)}>
        ${
          n.length === 0
            ? v`<p class="settings-sidebar__empty" role="status">
              ${k(`nav.settingsSearchNoResults`)}
            </p>`
            : n.map(
                (t) => v`
                <div class="settings-sidebar__group">
                  ${t.labelKey ? v`<div class="settings-sidebar__group-label">${k(t.labelKey)}</div>` : b}
                  ${t.items.map(
                    (t) => v`
                      ${js(e, t.routeId)}
                      ${t.blocks.map((t) => Ms(e, t))}
                    `,
                  )}
                </div>
              `,
              )
        }
      </nav>
      <openclaw-sidebar-update-card
        .updateAvailable=${e.updateAvailable}
        .updateRunning=${e.updateRunning}
        .onUpdate=${e.onUpdate}
      ></openclaw-sidebar-update-card>
      <footer class="settings-sidebar__footer">
        <span
          class="sidebar-status__dot ${e.connected ? `sidebar-connection-status--online` : `sidebar-connection-status--offline`}"
          role="img"
          aria-label=${t}
        ></span>
        <span class="settings-sidebar__footer-status">${t}</span>
        ${e.version ? v`<span class="settings-sidebar__footer-version">${e.version}</span>` : b}
      </footer>
    </aside>
  `;
}
var Ps = e(() => {
  (y(), rn(), Vt(), A(), Re(), M(), Ar());
});
function Q(e) {
  return {
    get label() {
      return k(`configForm.sections.${e}.label`);
    },
    get description() {
      return k(`configForm.sections.${e}.description`);
    },
  };
}
var Fs,
  Is = e(() => {
    (A(),
      (Fs = {
        env: Q(`env`),
        update: Q(`update`),
        agents: Q(`agents`),
        auth: Q(`auth`),
        channels: Q(`channels`),
        messages: Q(`messages`),
        commands: Q(`commands`),
        hooks: Q(`hooks`),
        skills: Q(`skills`),
        tools: Q(`tools`),
        gateway: Q(`gateway`),
        wizard: Q(`wizard`),
        meta: Q(`meta`),
        logging: Q(`logging`),
        browser: Q(`browser`),
        ui: Q(`ui`),
        models: Q(`models`),
        bindings: Q(`bindings`),
        broadcast: Q(`broadcast`),
        audio: Q(`audio`),
        session: Q(`session`),
        cron: Q(`cron`),
        web: Q(`web`),
        discovery: Q(`discovery`),
        canvasHost: Q(`canvasHost`),
        talk: Q(`talk`),
        plugins: Q(`plugins`),
        diagnostics: Q(`diagnostics`),
        cli: Q(`cli`),
        secrets: Q(`secrets`),
        acp: Q(`acp`),
        mcp: Q(`mcp`),
      }));
  });
function Ls(e) {
  return !!(e && (e.text.length > 0 || e.tags.length > 0));
}
function Rs(e) {
  let t = [],
    n = new Set();
  return {
    text: S(
      e.trim().replace(/(^|\s)tag:([^\s]+)/gi, (e, r, i) => {
        let a = S(i);
        return (a && !n.has(a) && (n.add(a), t.push(a)), r);
      }),
    ),
    tags: t,
  };
}
function zs(e) {
  if (!Array.isArray(e)) return [];
  let t = new Set(),
    n = [];
  for (let r of e) {
    if (typeof r != `string`) continue;
    let e = r.trim();
    if (!e) continue;
    let i = S(e);
    t.has(i) || (t.add(i), n.push(e));
  }
  return n;
}
function Bs(e, t, n) {
  let r = pn(e, n),
    i = r?.label ?? t.title ?? gn(String(e.at(-1))),
    a = r?.help ?? t.description,
    o = zs(t[`x-tags`] ?? t.tags),
    s = zs(r?.tags);
  return { label: i, help: a, tags: s.length > 0 ? s : o };
}
function Vs(e, t) {
  return S(e).includes(S(t));
}
function Hs(e, t, n) {
  return e ? t.some((t) => t !== void 0 && n(t, e)) : !0;
}
function Us(e, t) {
  if (e.length === 0) return !0;
  let n = new Set(t.map((e) => S(e)));
  return e.every((e) => n.has(e));
}
function Ws(e) {
  let { schema: t, path: n, hints: r, criteria: i, textMatcher: a = Vs } = e;
  if (!Ls(i)) return !0;
  let { label: o, help: s, tags: c } = Bs(n, t, r);
  if (!Us(i.tags, c)) return !1;
  if (!i.text) return !0;
  let l = n.filter((e) => typeof e == `string`).join(`.`),
    u = t.enum?.map((e) => String(e)).join(` `) ?? ``;
  return Hs(i.text, [o, s, t.title, t.description, l, u], a);
}
function $(e) {
  let { schema: t, value: n, path: r, hints: i, criteria: a, textMatcher: o = Vs } = e;
  if (!Ls(a) || Ws({ schema: t, path: r, hints: i, criteria: a, textMatcher: o })) return !0;
  let s = vn(t);
  if (s === `object`) {
    let e = n ?? t.default,
      s = e && typeof e == `object` && !Array.isArray(e) ? e : {},
      c = t.properties ?? {};
    for (let [e, t] of Object.entries(c))
      if ($({ schema: t, value: s[e], path: [...r, e], hints: i, criteria: a, textMatcher: o }))
        return !0;
    let l = t.additionalProperties;
    if (l && typeof l == `object`) {
      let e = new Set(Object.keys(c)),
        t = Object.entries(s).filter(([t]) => !e.has(t));
      if (t.length === 0)
        return $({
          schema: l,
          value: void 0,
          path: [...r, `*`],
          hints: i,
          criteria: a,
          textMatcher: o,
        });
      for (let [e, n] of t)
        if ($({ schema: l, value: n, path: [...r, e], hints: i, criteria: a, textMatcher: o }))
          return !0;
    }
    return !1;
  }
  if (s !== `array`) return !1;
  let c = Array.isArray(t.items) ? t.items[0] : t.items;
  if (!c) return !1;
  let l = Array.isArray(n) ? n : Array.isArray(t.default) ? t.default : [];
  return l.length === 0
    ? $({ schema: c, value: void 0, path: [...r, 0], hints: i, criteria: a, textMatcher: o })
    : l.some((e, t) =>
        $({ schema: c, value: e, path: [...r, t], hints: i, criteria: a, textMatcher: o }),
      );
}
function Gs(e) {
  if (!e.query) return !0;
  let t = Rs(e.query);
  return (
    (t.tags.length === 0 &&
      t.text.length > 0 &&
      [e.key, e.label, e.description].some((n) =>
        n === void 0 ? !1 : (e.textMatcher ?? Vs)(n, t.text),
      )) ||
    $({
      schema: e.schema,
      value: e.value,
      path: [e.key],
      hints: e.hints,
      criteria: t,
      textMatcher: e.textMatcher,
    })
  );
}
var Ks = e(() => {
  (Re(), _n());
});
export {
  M as $,
  qa as A,
  Fr as B,
  Ao as C,
  co as D,
  fo as E,
  Yi as F,
  wr as G,
  Ir as H,
  ea as I,
  I as J,
  z as K,
  xi as L,
  Li as M,
  Xi as N,
  so as O,
  Va as P,
  j as Q,
  Si as R,
  No as S,
  po as T,
  Nr as U,
  Pr as V,
  Ar as W,
  P as X,
  Pn as Y,
  Sn as Z,
  xs as _,
  Ws as a,
  qo as b,
  Fs as c,
  Ns as d,
  xn as et,
  Ds as f,
  Cs as g,
  Ts as h,
  $ as i,
  aa as j,
  Ga as k,
  Is as l,
  Es as m,
  Ks as n,
  Rs as o,
  Os as p,
  _r as q,
  Gs as r,
  Bs as s,
  Ls as t,
  yn as tt,
  Ps as u,
  bs as v,
  yo as w,
  Fo as x,
  Xo as y,
  Ii as z,
};
//# sourceMappingURL=control-ui-core-CQDTaMS5.js.map
