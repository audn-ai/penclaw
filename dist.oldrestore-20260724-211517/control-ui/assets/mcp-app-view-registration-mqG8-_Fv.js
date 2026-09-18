import {
  C as f,
  D as le,
  S as p,
  _ as m,
  a as ue,
  b as h,
  c as g,
  f as de,
  g as _,
  h as fe,
  i as v,
  l as pe,
  m as y,
  n as me,
  o as he,
  p as b,
  s as x,
  t as ge,
  u as _e,
  v as S,
  w as ve,
  x as C,
  y as ye,
} from "./config-runtime-BxOat2Bj.js";
import { K as se, q as ce } from "./control-ui-core--EZfp09c.js";
import { Jt as ae, Yt as oe } from "./control-ui-core-BcbHa4vB.js";
import { n as be, o as xe, t as Se } from "./control-ui-core-CwQmiouz.js";
import { dt as i, ft as a, lt as o } from "./control-ui-foundation-0uuDj0X3.js";
import { _ as n, g as r } from "./control-ui-foundation-CCDffryi.js";
import {
  F as s,
  G as c,
  M as l,
  N as ee,
  Y as u,
  Z as d,
  at as te,
  et as ne,
  nt as re,
  ut as ie,
} from "./lit-runtime-DkvDG939.js";
import { i as e, n as t } from "./rolldown-runtime-DaJ6WEGw.js";
var w,
  T,
  Ce,
  we,
  Te,
  Ee,
  De,
  E,
  D,
  Oe,
  O,
  k,
  A,
  j,
  M,
  ke,
  Ae,
  je,
  Me,
  Ne,
  N,
  P,
  Pe,
  Fe,
  Ie,
  Le,
  Re,
  ze,
  Be,
  F,
  I,
  L,
  Ve,
  He,
  Ue,
  We,
  Ge,
  Ke,
  qe,
  Je,
  Ye,
  Xe,
  R,
  Ze,
  Qe,
  z,
  $e,
  B,
  V,
  et,
  H,
  tt,
  nt,
  U,
  rt,
  it,
  at,
  W,
  ot,
  st,
  ct,
  lt,
  ut,
  dt,
  ft,
  G,
  K,
  pt,
  mt,
  ht,
  gt,
  _t,
  vt,
  yt,
  bt,
  xt,
  St,
  Ct,
  wt,
  Tt,
  Et,
  Dt,
  Ot,
  kt,
  At,
  jt,
  Mt,
  Nt,
  Pt,
  Ft,
  It,
  Lt,
  Rt,
  zt,
  Bt,
  Vt,
  q,
  Ht,
  Ut,
  Wt,
  Gt,
  Kt,
  qt,
  Jt,
  Yt,
  J,
  Xt,
  Zt,
  Qt,
  $t,
  en,
  tn,
  nn,
  rn,
  an,
  on,
  sn,
  cn,
  ln,
  Y,
  un,
  dn,
  fn,
  pn,
  mn,
  hn,
  gn,
  _n,
  vn,
  yn,
  bn,
  xn,
  Sn,
  Cn,
  wn,
  Tn,
  En,
  Dn,
  On,
  kn,
  An,
  jn,
  Mn,
  Nn,
  Pn,
  Fn,
  In,
  Ln,
  Rn,
  zn,
  Bn,
  Vn,
  Hn,
  X,
  Un,
  Wn = t(() => {
    (me(),
      (w = `io.modelcontextprotocol/related-task`),
      (T = pe((e) => e !== null && (typeof e == `object` || typeof e == `function`))),
      (Ce = p([C(), _().int()])),
      (we = C()),
      y({ ttl: _().optional(), pollInterval: _().optional() }),
      (Te = m({ ttl: _().optional() })),
      (Ee = m({ taskId: C() })),
      (De = y({ progressToken: Ce.optional(), [w]: Ee.optional() })),
      (E = m({ _meta: De.optional() })),
      (D = E.extend({ task: Te.optional() })),
      (Oe = (e) => D.safeParse(e).success),
      (O = m({ method: C(), params: E.loose().optional() })),
      (k = m({ _meta: De.optional() })),
      (A = m({ method: C(), params: k.loose().optional() })),
      (j = y({ _meta: De.optional() })),
      (M = p([C(), _().int()])),
      (ke = m({ jsonrpc: b(`2.0`), id: M, ...O.shape }).strict()),
      (Ae = (e) => ke.safeParse(e).success),
      (je = m({ jsonrpc: b(`2.0`), ...A.shape }).strict()),
      (Me = (e) => je.safeParse(e).success),
      (Ne = m({ jsonrpc: b(`2.0`), id: M, result: j }).strict()),
      (N = (e) => Ne.safeParse(e).success),
      (function (e) {
        ((e[(e.ConnectionClosed = -32e3)] = `ConnectionClosed`),
          (e[(e.RequestTimeout = -32001)] = `RequestTimeout`),
          (e[(e.ParseError = -32700)] = `ParseError`),
          (e[(e.InvalidRequest = -32600)] = `InvalidRequest`),
          (e[(e.MethodNotFound = -32601)] = `MethodNotFound`),
          (e[(e.InvalidParams = -32602)] = `InvalidParams`),
          (e[(e.InternalError = -32603)] = `InternalError`),
          (e[(e.UrlElicitationRequired = -32042)] = `UrlElicitationRequired`));
      })((P ||= {})),
      (Pe = m({
        jsonrpc: b(`2.0`),
        id: M.optional(),
        error: m({ code: _().int(), message: C(), data: f().optional() }),
      }).strict()),
      (Fe = (e) => Pe.safeParse(e).success),
      (Ie = p([ke, je, Ne, Pe])),
      p([Ne, Pe]),
      (Le = j.strict()),
      (Re = k.extend({ requestId: M.optional(), reason: C().optional() })),
      (ze = A.extend({ method: b(`notifications/cancelled`), params: Re })),
      (Be = m({
        src: C(),
        mimeType: C().optional(),
        sizes: x(C()).optional(),
        theme: v([`light`, `dark`]).optional(),
      })),
      (F = m({ icons: x(Be).optional() })),
      (I = m({ name: C(), title: C().optional() })),
      (L = I.extend({
        ...I.shape,
        ...F.shape,
        version: C(),
        websiteUrl: C().optional(),
        description: C().optional(),
      })),
      (Ve = de(m({ applyDefaults: g().optional() }), h(C(), f()))),
      (He = ye(
        (e) =>
          e && typeof e == `object` && !Array.isArray(e) && Object.keys(e).length === 0
            ? { form: {} }
            : e,
        de(m({ form: Ve.optional(), url: T.optional() }), h(C(), f()).optional()),
      )),
      (Ue = y({
        list: T.optional(),
        cancel: T.optional(),
        requests: y({
          sampling: y({ createMessage: T.optional() }).optional(),
          elicitation: y({ create: T.optional() }).optional(),
        }).optional(),
      })),
      (We = y({
        list: T.optional(),
        cancel: T.optional(),
        requests: y({ tools: y({ call: T.optional() }).optional() }).optional(),
      })),
      (Ge = m({
        experimental: h(C(), T).optional(),
        sampling: m({ context: T.optional(), tools: T.optional() }).optional(),
        elicitation: He.optional(),
        roots: m({ listChanged: g().optional() }).optional(),
        tasks: Ue.optional(),
        extensions: h(C(), T).optional(),
      })),
      (Ke = E.extend({ protocolVersion: C(), capabilities: Ge, clientInfo: L })),
      (qe = O.extend({ method: b(`initialize`), params: Ke })),
      (Je = m({
        experimental: h(C(), T).optional(),
        logging: T.optional(),
        completions: T.optional(),
        prompts: m({ listChanged: g().optional() }).optional(),
        resources: m({ subscribe: g().optional(), listChanged: g().optional() }).optional(),
        tools: m({ listChanged: g().optional() }).optional(),
        tasks: We.optional(),
        extensions: h(C(), T).optional(),
      })),
      (Ye = j.extend({
        protocolVersion: C(),
        capabilities: Je,
        serverInfo: L,
        instructions: C().optional(),
      })),
      (Xe = A.extend({ method: b(`notifications/initialized`), params: k.optional() })),
      (R = O.extend({ method: b(`ping`), params: E.optional() })),
      (Ze = m({ progress: _(), total: S(_()), message: S(C()) })),
      (Qe = m({ ...k.shape, ...Ze.shape, progressToken: Ce })),
      (z = A.extend({ method: b(`notifications/progress`), params: Qe })),
      ($e = E.extend({ cursor: we.optional() })),
      (B = O.extend({ params: $e.optional() })),
      (V = j.extend({ nextCursor: we.optional() })),
      (et = v([`working`, `input_required`, `completed`, `failed`, `cancelled`])),
      (H = m({
        taskId: C(),
        status: et,
        ttl: p([_(), ue()]),
        createdAt: C(),
        lastUpdatedAt: C(),
        pollInterval: S(_()),
        statusMessage: S(C()),
      })),
      (tt = j.extend({ task: H })),
      (nt = k.merge(H)),
      (U = A.extend({ method: b(`notifications/tasks/status`), params: nt })),
      (rt = O.extend({ method: b(`tasks/get`), params: E.extend({ taskId: C() }) })),
      (it = j.merge(H)),
      (at = O.extend({ method: b(`tasks/result`), params: E.extend({ taskId: C() }) })),
      j.loose(),
      (W = B.extend({ method: b(`tasks/list`) })),
      (ot = V.extend({ tasks: x(H) })),
      (st = O.extend({ method: b(`tasks/cancel`), params: E.extend({ taskId: C() }) })),
      (ct = j.merge(H)),
      (lt = m({ uri: C(), mimeType: S(C()), _meta: h(C(), f()).optional() })),
      (ut = lt.extend({ text: C() })),
      (dt = C().refine(
        (e) => {
          try {
            return (atob(e), !0);
          } catch {
            return !1;
          }
        },
        { message: `Invalid Base64 string` },
      )),
      (ft = lt.extend({ blob: dt })),
      (G = v([`user`, `assistant`])),
      (K = m({
        audience: x(G).optional(),
        priority: _().min(0).max(1).optional(),
        lastModified: ve({ offset: !0 }).optional(),
      })),
      (pt = m({
        ...I.shape,
        ...F.shape,
        uri: C(),
        description: S(C()),
        mimeType: S(C()),
        size: S(_()),
        annotations: K.optional(),
        _meta: S(y({})),
      })),
      (mt = m({
        ...I.shape,
        ...F.shape,
        uriTemplate: C(),
        description: S(C()),
        mimeType: S(C()),
        annotations: K.optional(),
        _meta: S(y({})),
      })),
      (ht = B.extend({ method: b(`resources/list`) })),
      (gt = V.extend({ resources: x(pt) })),
      (_t = B.extend({ method: b(`resources/templates/list`) })),
      (vt = V.extend({ resourceTemplates: x(mt) })),
      (yt = E.extend({ uri: C() })),
      (bt = yt),
      (xt = O.extend({ method: b(`resources/read`), params: bt })),
      (St = j.extend({ contents: x(p([ut, ft])) })),
      (Ct = A.extend({ method: b(`notifications/resources/list_changed`), params: k.optional() })),
      (wt = yt),
      (Tt = O.extend({ method: b(`resources/subscribe`), params: wt })),
      (Et = yt),
      (Dt = O.extend({ method: b(`resources/unsubscribe`), params: Et })),
      (Ot = k.extend({ uri: C() })),
      (kt = A.extend({ method: b(`notifications/resources/updated`), params: Ot })),
      (At = m({ name: C(), description: S(C()), required: S(g()) })),
      (jt = m({
        ...I.shape,
        ...F.shape,
        description: S(C()),
        arguments: S(x(At)),
        _meta: S(y({})),
      })),
      (Mt = B.extend({ method: b(`prompts/list`) })),
      (Nt = V.extend({ prompts: x(jt) })),
      (Pt = E.extend({ name: C(), arguments: h(C(), C()).optional() })),
      (Ft = O.extend({ method: b(`prompts/get`), params: Pt })),
      (It = m({
        type: b(`text`),
        text: C(),
        annotations: K.optional(),
        _meta: h(C(), f()).optional(),
      })),
      (Lt = m({
        type: b(`image`),
        data: dt,
        mimeType: C(),
        annotations: K.optional(),
        _meta: h(C(), f()).optional(),
      })),
      (Rt = m({
        type: b(`audio`),
        data: dt,
        mimeType: C(),
        annotations: K.optional(),
        _meta: h(C(), f()).optional(),
      })),
      (zt = m({
        type: b(`tool_use`),
        name: C(),
        id: C(),
        input: h(C(), f()),
        _meta: h(C(), f()).optional(),
      })),
      (Bt = m({
        type: b(`resource`),
        resource: p([ut, ft]),
        annotations: K.optional(),
        _meta: h(C(), f()).optional(),
      })),
      (Vt = pt.extend({ type: b(`resource_link`) })),
      (q = p([It, Lt, Rt, Vt, Bt])),
      (Ht = m({ role: G, content: q })),
      (Ut = j.extend({ description: C().optional(), messages: x(Ht) })),
      (Wt = A.extend({ method: b(`notifications/prompts/list_changed`), params: k.optional() })),
      (Gt = m({
        title: C().optional(),
        readOnlyHint: g().optional(),
        destructiveHint: g().optional(),
        idempotentHint: g().optional(),
        openWorldHint: g().optional(),
      })),
      (Kt = m({ taskSupport: v([`required`, `optional`, `forbidden`]).optional() })),
      (qt = m({
        ...I.shape,
        ...F.shape,
        description: C().optional(),
        inputSchema: m({
          type: b(`object`),
          properties: h(C(), T).optional(),
          required: x(C()).optional(),
        }).catchall(f()),
        outputSchema: m({
          type: b(`object`),
          properties: h(C(), T).optional(),
          required: x(C()).optional(),
        })
          .catchall(f())
          .optional(),
        annotations: Gt.optional(),
        execution: Kt.optional(),
        _meta: h(C(), f()).optional(),
      })),
      (Jt = B.extend({ method: b(`tools/list`) })),
      (Yt = V.extend({ tools: x(qt) })),
      (J = j.extend({
        content: x(q).default([]),
        structuredContent: h(C(), f()).optional(),
        isError: g().optional(),
      })),
      J.or(j.extend({ toolResult: f() })),
      (Xt = D.extend({ name: C(), arguments: h(C(), f()).optional() })),
      (Zt = O.extend({ method: b(`tools/call`), params: Xt })),
      (Qt = A.extend({ method: b(`notifications/tools/list_changed`), params: k.optional() })),
      m({ autoRefresh: g().default(!0), debounceMs: _().int().nonnegative().default(300) }),
      ($t = v([`debug`, `info`, `notice`, `warning`, `error`, `critical`, `alert`, `emergency`])),
      (en = E.extend({ level: $t })),
      (tn = O.extend({ method: b(`logging/setLevel`), params: en })),
      (nn = k.extend({ level: $t, logger: C().optional(), data: f() })),
      (rn = A.extend({ method: b(`notifications/message`), params: nn })),
      (an = m({ name: C().optional() })),
      (on = m({
        hints: x(an).optional(),
        costPriority: _().min(0).max(1).optional(),
        speedPriority: _().min(0).max(1).optional(),
        intelligencePriority: _().min(0).max(1).optional(),
      })),
      (sn = m({ mode: v([`auto`, `required`, `none`]).optional() })),
      (cn = m({
        type: b(`tool_result`),
        toolUseId: C().describe(`The unique identifier for the corresponding tool call.`),
        content: x(q).default([]),
        structuredContent: m({}).loose().optional(),
        isError: g().optional(),
        _meta: h(C(), f()).optional(),
      })),
      (ln = _e(`type`, [It, Lt, Rt])),
      (Y = _e(`type`, [It, Lt, Rt, zt, cn])),
      (un = m({ role: G, content: p([Y, x(Y)]), _meta: h(C(), f()).optional() })),
      (dn = D.extend({
        messages: x(un),
        modelPreferences: on.optional(),
        systemPrompt: C().optional(),
        includeContext: v([`none`, `thisServer`, `allServers`]).optional(),
        temperature: _().optional(),
        maxTokens: _().int(),
        stopSequences: x(C()).optional(),
        metadata: T.optional(),
        tools: x(qt).optional(),
        toolChoice: sn.optional(),
      })),
      (fn = O.extend({ method: b(`sampling/createMessage`), params: dn })),
      (pn = j.extend({
        model: C(),
        stopReason: S(v([`endTurn`, `stopSequence`, `maxTokens`]).or(C())),
        role: G,
        content: ln,
      })),
      (mn = j.extend({
        model: C(),
        stopReason: S(v([`endTurn`, `stopSequence`, `maxTokens`, `toolUse`]).or(C())),
        role: G,
        content: p([Y, x(Y)]),
      })),
      (hn = m({
        type: b(`boolean`),
        title: C().optional(),
        description: C().optional(),
        default: g().optional(),
      })),
      (gn = m({
        type: b(`string`),
        title: C().optional(),
        description: C().optional(),
        minLength: _().optional(),
        maxLength: _().optional(),
        format: v([`email`, `uri`, `date`, `date-time`]).optional(),
        default: C().optional(),
      })),
      (_n = m({
        type: v([`number`, `integer`]),
        title: C().optional(),
        description: C().optional(),
        minimum: _().optional(),
        maximum: _().optional(),
        default: _().optional(),
      })),
      (vn = m({
        type: b(`string`),
        title: C().optional(),
        description: C().optional(),
        enum: x(C()),
        default: C().optional(),
      })),
      (yn = m({
        type: b(`string`),
        title: C().optional(),
        description: C().optional(),
        oneOf: x(m({ const: C(), title: C() })),
        default: C().optional(),
      })),
      (bn = m({
        type: b(`string`),
        title: C().optional(),
        description: C().optional(),
        enum: x(C()),
        enumNames: x(C()).optional(),
        default: C().optional(),
      })),
      (xn = p([vn, yn])),
      (Sn = m({
        type: b(`array`),
        title: C().optional(),
        description: C().optional(),
        minItems: _().optional(),
        maxItems: _().optional(),
        items: m({ type: b(`string`), enum: x(C()) }),
        default: x(C()).optional(),
      })),
      (Cn = m({
        type: b(`array`),
        title: C().optional(),
        description: C().optional(),
        minItems: _().optional(),
        maxItems: _().optional(),
        items: m({ anyOf: x(m({ const: C(), title: C() })) }),
        default: x(C()).optional(),
      })),
      (wn = p([Sn, Cn])),
      (Tn = p([bn, xn, wn])),
      (En = p([Tn, hn, gn, _n])),
      (Dn = D.extend({
        mode: b(`form`).optional(),
        message: C(),
        requestedSchema: m({
          type: b(`object`),
          properties: h(C(), En),
          required: x(C()).optional(),
        }),
      })),
      (On = D.extend({ mode: b(`url`), message: C(), elicitationId: C(), url: C().url() })),
      (kn = p([Dn, On])),
      (An = O.extend({ method: b(`elicitation/create`), params: kn })),
      (jn = k.extend({ elicitationId: C() })),
      (Mn = A.extend({ method: b(`notifications/elicitation/complete`), params: jn })),
      (Nn = j.extend({
        action: v([`accept`, `decline`, `cancel`]),
        content: ye(
          (e) => (e === null ? void 0 : e),
          h(C(), p([C(), _(), g(), x(C())])).optional(),
        ),
      })),
      (Pn = m({ type: b(`ref/resource`), uri: C() })),
      (Fn = m({ type: b(`ref/prompt`), name: C() })),
      (In = E.extend({
        ref: p([Fn, Pn]),
        argument: m({ name: C(), value: C() }),
        context: m({ arguments: h(C(), C()).optional() }).optional(),
      })),
      (Ln = O.extend({ method: b(`completion/complete`), params: In })),
      (Rn = j.extend({
        completion: y({ values: x(C()).max(100), total: S(_().int()), hasMore: S(g()) }),
      })),
      (zn = m({
        uri: C().startsWith(`file://`),
        name: C().optional(),
        _meta: h(C(), f()).optional(),
      })),
      (Bn = O.extend({ method: b(`roots/list`), params: E.optional() })),
      (Vn = j.extend({ roots: x(zn) })),
      (Hn = A.extend({ method: b(`notifications/roots/list_changed`), params: k.optional() })),
      p([R, qe, Ln, tn, Ft, Mt, ht, _t, xt, Tt, Dt, Zt, Jt, rt, at, W, st]),
      p([ze, z, Xe, Hn, U]),
      p([Le, pn, mn, Nn, Vn, it, ot, tt]),
      p([R, fn, An, Bn, rt, at, W, st]),
      p([ze, z, rn, kt, Ct, Qt, Wt, U, Mn]),
      p([Le, Ye, Rn, Ut, Nt, gt, vt, St, J, Yt, it, ot, tt]),
      (X = class e extends Error {
        constructor(e, t, n) {
          (super(`MCP error ${e}: ${t}`),
            (this.code = e),
            (this.data = n),
            (this.name = `McpError`));
        }
        static fromError(t, n, r) {
          if (t === P.UrlElicitationRequired && r) {
            let e = r;
            if (e.elicitations) return new Un(e.elicitations, n);
          }
          return new e(t, n, r);
        }
      }),
      (Un = class extends X {
        constructor(e, t = `URL elicitation${e.length > 1 ? `s` : ``} required`) {
          super(P.UrlElicitationRequired, t, { elicitations: e });
        }
        get elicitations() {
          return this.data?.elicitations ?? [];
        }
      }));
  });
function Gn(e) {
  return !!e._zod;
}
function Kn(e, t) {
  return Gn(e) ? le(e, t) : e.safeParse(t);
}
function qn(e) {
  if (!e) return;
  let t;
  if (((t = Gn(e) ? e._zod?.def?.shape : e.shape), t)) {
    if (typeof t == `function`)
      try {
        return t();
      } catch {
        return;
      }
    return t;
  }
}
function Jn(e) {
  if (Gn(e)) {
    let t = e._zod?.def;
    if (t) {
      if (t.value !== void 0) return t.value;
      if (Array.isArray(t.values) && t.values.length > 0) return t.values[0];
    }
  }
  let t = e._def;
  if (t) {
    if (t.value !== void 0) return t.value;
    if (Array.isArray(t.values) && t.values.length > 0) return t.values[0];
  }
  let n = e.value;
  if (n !== void 0) return n;
}
var Yn = t(() => {
  ge();
});
function Z(e) {
  return e === `completed` || e === `failed` || e === `cancelled`;
}
var Xn = t(() => {}),
  Zn = t(() => {}),
  Qn = t(() => {}),
  $n = t(() => {}),
  er = t(() => {}),
  tr = t(() => {}),
  nr = t(() => {}),
  rr = t(() => {}),
  ir = t(() => {}),
  ar = t(() => {}),
  or = t(() => {}),
  sr = t(() => {}),
  cr = t(() => {}),
  lr = t(() => {}),
  ur = t(() => {}),
  dr = t(() => {}),
  fr = t(() => {}),
  pr = t(() => {}),
  mr = t(() => {}),
  hr = t(() => {}),
  gr = t(() => {}),
  _r = t(() => {}),
  vr = t(() => {}),
  yr = t(() => {}),
  br = t(() => {}),
  xr = t(() => {}),
  Sr = t(() => {}),
  Cr = t(() => {}),
  wr = t(() => {}),
  Tr = t(() => {}),
  Er = t(() => {}),
  Dr = t(() => {}),
  Or = t(() => {}),
  kr = t(() => {}),
  Ar = t(() => {}),
  jr = t(() => {}),
  Mr = t(() => {}),
  Nr = t(() => {}),
  Pr = t(() => {}),
  Fr = t(() => {
    (Zn(),
      Qn(),
      $n(),
      er(),
      Mr(),
      Nr(),
      tr(),
      nr(),
      rr(),
      ir(),
      ar(),
      or(),
      sr(),
      cr(),
      lr(),
      ur(),
      dr(),
      fr(),
      hr(),
      gr(),
      _r(),
      vr(),
      br(),
      xr(),
      Sr(),
      Cr(),
      wr(),
      Tr(),
      Ar(),
      mr(),
      Er(),
      pr(),
      Dr(),
      Or(),
      yr(),
      kr(),
      jr(),
      Pr());
  });
function Ir(e) {
  let t = qn(e)?.method;
  if (!t) throw Error(`Schema is missing a method literal`);
  let n = Jn(t);
  if (typeof n != `string`) throw Error(`Schema method literal must be a string`);
  return n;
}
function Lr(e, t) {
  let n = Kn(e, t);
  if (!n.success) throw n.error;
  return n.data;
}
var Rr = t(() => {
    (Yn(), Fr());
  }),
  zr,
  Br = t(() => {
    (Yn(),
      Wn(),
      Xn(),
      Rr(),
      (zr = class {
        constructor(e) {
          ((this._options = e),
            (this._requestMessageId = 0),
            (this._requestHandlers = new Map()),
            (this._requestHandlerAbortControllers = new Map()),
            (this._notificationHandlers = new Map()),
            (this._responseHandlers = new Map()),
            (this._progressHandlers = new Map()),
            (this._timeoutInfo = new Map()),
            (this._pendingDebouncedNotifications = new Set()),
            (this._taskProgressTokens = new Map()),
            (this._requestResolvers = new Map()),
            this.setNotificationHandler(ze, (e) => {
              this._oncancel(e);
            }),
            this.setNotificationHandler(z, (e) => {
              this._onprogress(e);
            }),
            this.setRequestHandler(R, (e) => ({})),
            (this._taskStore = e?.taskStore),
            (this._taskMessageQueue = e?.taskMessageQueue),
            this._taskStore &&
              (this.setRequestHandler(rt, async (e, t) => {
                let n = await this._taskStore.getTask(e.params.taskId, t.sessionId);
                if (!n) throw new X(P.InvalidParams, `Failed to retrieve task: Task not found`);
                return { ...n };
              }),
              this.setRequestHandler(at, async (e, t) => {
                let n = async () => {
                  let r = e.params.taskId;
                  if (this._taskMessageQueue) {
                    let e;
                    for (; (e = await this._taskMessageQueue.dequeue(r, t.sessionId));) {
                      if (e.type === `response` || e.type === `error`) {
                        let t = e.message,
                          n = t.id,
                          r = this._requestResolvers.get(n);
                        if (r)
                          if ((this._requestResolvers.delete(n), e.type === `response`)) r(t);
                          else {
                            let e = t;
                            r(new X(e.error.code, e.error.message, e.error.data));
                          }
                        else {
                          let t = e.type === `response` ? `Response` : `Error`;
                          this._onerror(Error(`${t} handler missing for request ${n}`));
                        }
                        continue;
                      }
                      await this._transport?.send(e.message, { relatedRequestId: t.requestId });
                    }
                  }
                  let i = await this._taskStore.getTask(r, t.sessionId);
                  if (!i) throw new X(P.InvalidParams, `Task not found: ${r}`);
                  if (!Z(i.status)) return (await this._waitForTaskUpdate(r, t.signal), await n());
                  if (Z(i.status)) {
                    let e = await this._taskStore.getTaskResult(r, t.sessionId);
                    return (
                      this._clearTaskQueue(r), { ...e, _meta: { ...e._meta, [w]: { taskId: r } } }
                    );
                  }
                  return await n();
                };
                return await n();
              }),
              this.setRequestHandler(W, async (e, t) => {
                try {
                  let { tasks: n, nextCursor: r } = await this._taskStore.listTasks(
                    e.params?.cursor,
                    t.sessionId,
                  );
                  return { tasks: n, nextCursor: r, _meta: {} };
                } catch (e) {
                  throw new X(
                    P.InvalidParams,
                    `Failed to list tasks: ${e instanceof Error ? e.message : String(e)}`,
                  );
                }
              }),
              this.setRequestHandler(st, async (e, t) => {
                try {
                  let n = await this._taskStore.getTask(e.params.taskId, t.sessionId);
                  if (!n) throw new X(P.InvalidParams, `Task not found: ${e.params.taskId}`);
                  if (Z(n.status))
                    throw new X(
                      P.InvalidParams,
                      `Cannot cancel task in terminal status: ${n.status}`,
                    );
                  (await this._taskStore.updateTaskStatus(
                    e.params.taskId,
                    `cancelled`,
                    `Client cancelled task execution.`,
                    t.sessionId,
                  ),
                    this._clearTaskQueue(e.params.taskId));
                  let r = await this._taskStore.getTask(e.params.taskId, t.sessionId);
                  if (!r)
                    throw new X(
                      P.InvalidParams,
                      `Task not found after cancellation: ${e.params.taskId}`,
                    );
                  return { _meta: {}, ...r };
                } catch (e) {
                  throw e instanceof X
                    ? e
                    : new X(
                        P.InvalidRequest,
                        `Failed to cancel task: ${e instanceof Error ? e.message : String(e)}`,
                      );
                }
              })));
        }
        async _oncancel(e) {
          e.params.requestId &&
            this._requestHandlerAbortControllers.get(e.params.requestId)?.abort(e.params.reason);
        }
        _setupTimeout(e, t, n, r, i = !1) {
          this._timeoutInfo.set(e, {
            timeoutId: setTimeout(r, t),
            startTime: Date.now(),
            timeout: t,
            maxTotalTimeout: n,
            resetTimeoutOnProgress: i,
            onTimeout: r,
          });
        }
        _resetTimeout(e) {
          let t = this._timeoutInfo.get(e);
          if (!t) return !1;
          let n = Date.now() - t.startTime;
          if (t.maxTotalTimeout && n >= t.maxTotalTimeout)
            throw (
              this._timeoutInfo.delete(e),
              X.fromError(P.RequestTimeout, `Maximum total timeout exceeded`, {
                maxTotalTimeout: t.maxTotalTimeout,
                totalElapsed: n,
              })
            );
          return (
            clearTimeout(t.timeoutId), (t.timeoutId = setTimeout(t.onTimeout, t.timeout)), !0
          );
        }
        _cleanupTimeout(e) {
          let t = this._timeoutInfo.get(e);
          t && (clearTimeout(t.timeoutId), this._timeoutInfo.delete(e));
        }
        async connect(e) {
          if (this._transport)
            throw Error(
              `Already connected to a transport. Call close() before connecting to a new transport, or use a separate Protocol instance per connection.`,
            );
          this._transport = e;
          let t = this.transport?.onclose;
          this._transport.onclose = () => {
            (t?.(), this._onclose());
          };
          let n = this.transport?.onerror;
          this._transport.onerror = (e) => {
            (n?.(e), this._onerror(e));
          };
          let r = this._transport?.onmessage;
          ((this._transport.onmessage = (e, t) => {
            (r?.(e, t),
              N(e) || Fe(e)
                ? this._onresponse(e)
                : Ae(e)
                  ? this._onrequest(e, t)
                  : Me(e)
                    ? this._onnotification(e)
                    : this._onerror(Error(`Unknown message type: ${JSON.stringify(e)}`)));
          }),
            await this._transport.start());
        }
        _onclose() {
          let e = this._responseHandlers;
          ((this._responseHandlers = new Map()),
            this._progressHandlers.clear(),
            this._taskProgressTokens.clear(),
            this._pendingDebouncedNotifications.clear());
          for (let e of this._timeoutInfo.values()) clearTimeout(e.timeoutId);
          this._timeoutInfo.clear();
          for (let e of this._requestHandlerAbortControllers.values()) e.abort();
          this._requestHandlerAbortControllers.clear();
          let t = X.fromError(P.ConnectionClosed, `Connection closed`);
          ((this._transport = void 0), this.onclose?.());
          for (let n of e.values()) n(t);
        }
        _onerror(e) {
          this.onerror?.(e);
        }
        _onnotification(e) {
          let t = this._notificationHandlers.get(e.method) ?? this.fallbackNotificationHandler;
          t !== void 0 &&
            Promise.resolve()
              .then(() => t(e))
              .catch((e) => this._onerror(Error(`Uncaught error in notification handler: ${e}`)));
        }
        _onrequest(e, t) {
          let n = this._requestHandlers.get(e.method) ?? this.fallbackRequestHandler,
            r = this._transport,
            i = e.params?._meta?.[w]?.taskId;
          if (n === void 0) {
            let t = {
              jsonrpc: `2.0`,
              id: e.id,
              error: { code: P.MethodNotFound, message: `Method not found` },
            };
            i && this._taskMessageQueue
              ? this._enqueueTaskMessage(
                  i,
                  { type: `error`, message: t, timestamp: Date.now() },
                  r?.sessionId,
                ).catch((e) => this._onerror(Error(`Failed to enqueue error response: ${e}`)))
              : r
                  ?.send(t)
                  .catch((e) => this._onerror(Error(`Failed to send an error response: ${e}`)));
            return;
          }
          let a = new AbortController();
          this._requestHandlerAbortControllers.set(e.id, a);
          let o = Oe(e.params) ? e.params.task : void 0,
            s = this._taskStore ? this.requestTaskStore(e, r?.sessionId) : void 0,
            c = {
              signal: a.signal,
              sessionId: r?.sessionId,
              _meta: e.params?._meta,
              sendNotification: async (t) => {
                if (a.signal.aborted) return;
                let n = { relatedRequestId: e.id };
                (i && (n.relatedTask = { taskId: i }), await this.notification(t, n));
              },
              sendRequest: async (t, n, r) => {
                if (a.signal.aborted) throw new X(P.ConnectionClosed, `Request was cancelled`);
                let o = { ...r, relatedRequestId: e.id };
                i && !o.relatedTask && (o.relatedTask = { taskId: i });
                let c = o.relatedTask?.taskId ?? i;
                return (
                  c && s && (await s.updateTaskStatus(c, `input_required`)),
                  await this.request(t, n, o)
                );
              },
              authInfo: t?.authInfo,
              requestId: e.id,
              requestInfo: t?.requestInfo,
              taskId: i,
              taskStore: s,
              taskRequestedTtl: o?.ttl,
              closeSSEStream: t?.closeSSEStream,
              closeStandaloneSSEStream: t?.closeStandaloneSSEStream,
            };
          Promise.resolve()
            .then(() => {
              o && this.assertTaskHandlerCapability(e.method);
            })
            .then(() => n(e, c))
            .then(
              async (t) => {
                if (a.signal.aborted) return;
                let n = { result: t, jsonrpc: `2.0`, id: e.id };
                i && this._taskMessageQueue
                  ? await this._enqueueTaskMessage(
                      i,
                      { type: `response`, message: n, timestamp: Date.now() },
                      r?.sessionId,
                    )
                  : await r?.send(n);
              },
              async (t) => {
                if (a.signal.aborted) return;
                let n = {
                  jsonrpc: `2.0`,
                  id: e.id,
                  error: {
                    code: Number.isSafeInteger(t.code) ? t.code : P.InternalError,
                    message: t.message ?? `Internal error`,
                    ...(t.data !== void 0 && { data: t.data }),
                  },
                };
                i && this._taskMessageQueue
                  ? await this._enqueueTaskMessage(
                      i,
                      { type: `error`, message: n, timestamp: Date.now() },
                      r?.sessionId,
                    )
                  : await r?.send(n);
              },
            )
            .catch((e) => this._onerror(Error(`Failed to send response: ${e}`)))
            .finally(() => {
              this._requestHandlerAbortControllers.get(e.id) === a &&
                this._requestHandlerAbortControllers.delete(e.id);
            });
        }
        _onprogress(e) {
          let { progressToken: t, ...n } = e.params,
            r = Number(t),
            i = this._progressHandlers.get(r);
          if (!i) {
            this._onerror(
              Error(`Received a progress notification for an unknown token: ${JSON.stringify(e)}`),
            );
            return;
          }
          let a = this._responseHandlers.get(r),
            o = this._timeoutInfo.get(r);
          if (o && a && o.resetTimeoutOnProgress)
            try {
              this._resetTimeout(r);
            } catch (e) {
              (this._responseHandlers.delete(r),
                this._progressHandlers.delete(r),
                this._cleanupTimeout(r),
                a(e));
              return;
            }
          i(n);
        }
        _onresponse(e) {
          let t = Number(e.id),
            n = this._requestResolvers.get(t);
          if (n) {
            (this._requestResolvers.delete(t),
              N(e) ? n(e) : n(new X(e.error.code, e.error.message, e.error.data)));
            return;
          }
          let r = this._responseHandlers.get(t);
          if (r === void 0) {
            this._onerror(
              Error(`Received a response for an unknown message ID: ${JSON.stringify(e)}`),
            );
            return;
          }
          (this._responseHandlers.delete(t), this._cleanupTimeout(t));
          let i = !1;
          if (N(e) && e.result && typeof e.result == `object`) {
            let n = e.result;
            if (n.task && typeof n.task == `object`) {
              let e = n.task;
              typeof e.taskId == `string` && ((i = !0), this._taskProgressTokens.set(e.taskId, t));
            }
          }
          (i || this._progressHandlers.delete(t),
            N(e) ? r(e) : r(X.fromError(e.error.code, e.error.message, e.error.data)));
        }
        get transport() {
          return this._transport;
        }
        async close() {
          await this._transport?.close();
        }
        async *requestStream(e, t, n) {
          let { task: r } = n ?? {};
          if (!r) {
            try {
              yield { type: `result`, result: await this.request(e, t, n) };
            } catch (e) {
              yield {
                type: `error`,
                error: e instanceof X ? e : new X(P.InternalError, String(e)),
              };
            }
            return;
          }
          let i;
          try {
            let r = await this.request(e, tt, n);
            if (r.task) ((i = r.task.taskId), yield { type: `taskCreated`, task: r.task });
            else throw new X(P.InternalError, `Task creation did not return a task`);
            for (;;) {
              let e = await this.getTask({ taskId: i }, n);
              if ((yield { type: `taskStatus`, task: e }, Z(e.status))) {
                e.status === `completed`
                  ? yield { type: `result`, result: await this.getTaskResult({ taskId: i }, t, n) }
                  : e.status === `failed`
                    ? yield { type: `error`, error: new X(P.InternalError, `Task ${i} failed`) }
                    : e.status === `cancelled` &&
                      (yield {
                        type: `error`,
                        error: new X(P.InternalError, `Task ${i} was cancelled`),
                      });
                return;
              }
              if (e.status === `input_required`) {
                yield { type: `result`, result: await this.getTaskResult({ taskId: i }, t, n) };
                return;
              }
              let r = e.pollInterval ?? this._options?.defaultTaskPollInterval ?? 1e3;
              (await new Promise((e) => setTimeout(e, r)), n?.signal?.throwIfAborted());
            }
          } catch (e) {
            yield { type: `error`, error: e instanceof X ? e : new X(P.InternalError, String(e)) };
          }
        }
        request(e, t, n) {
          let {
            relatedRequestId: r,
            resumptionToken: i,
            onresumptiontoken: a,
            task: o,
            relatedTask: s,
          } = n ?? {};
          return new Promise((c, l) => {
            let ee = (e) => {
              l(e);
            };
            if (!this._transport) {
              ee(Error(`Not connected`));
              return;
            }
            if (this._options?.enforceStrictCapabilities === !0)
              try {
                (this.assertCapabilityForMethod(e.method),
                  o && this.assertTaskCapability(e.method));
              } catch (e) {
                ee(e);
                return;
              }
            n?.signal?.throwIfAborted();
            let u = this._requestMessageId++,
              d = { ...e, jsonrpc: `2.0`, id: u };
            (n?.onprogress &&
              (this._progressHandlers.set(u, n.onprogress),
              (d.params = {
                ...e.params,
                _meta: { ...(e.params?._meta || {}), progressToken: u },
              })),
              o && (d.params = { ...d.params, task: o }),
              s && (d.params = { ...d.params, _meta: { ...(d.params?._meta || {}), [w]: s } }));
            let te = (e) => {
              (this._responseHandlers.delete(u),
                this._progressHandlers.delete(u),
                this._cleanupTimeout(u),
                this._transport
                  ?.send(
                    {
                      jsonrpc: `2.0`,
                      method: `notifications/cancelled`,
                      params: { requestId: u, reason: String(e) },
                    },
                    { relatedRequestId: r, resumptionToken: i, onresumptiontoken: a },
                  )
                  .catch((e) => this._onerror(Error(`Failed to send cancellation: ${e}`))),
                l(e instanceof X ? e : new X(P.RequestTimeout, String(e))));
            };
            (this._responseHandlers.set(u, (e) => {
              if (!n?.signal?.aborted) {
                if (e instanceof Error) return l(e);
                try {
                  let n = Kn(t, e.result);
                  n.success ? c(n.data) : l(n.error);
                } catch (e) {
                  l(e);
                }
              }
            }),
              n?.signal?.addEventListener(`abort`, () => {
                te(n?.signal?.reason);
              }));
            let ne = n?.timeout ?? 6e4;
            this._setupTimeout(
              u,
              ne,
              n?.maxTotalTimeout,
              () => te(X.fromError(P.RequestTimeout, `Request timed out`, { timeout: ne })),
              n?.resetTimeoutOnProgress ?? !1,
            );
            let re = s?.taskId;
            re
              ? (this._requestResolvers.set(u, (e) => {
                  let t = this._responseHandlers.get(u);
                  t
                    ? t(e)
                    : this._onerror(
                        Error(`Response handler missing for side-channeled request ${u}`),
                      );
                }),
                this._enqueueTaskMessage(re, {
                  type: `request`,
                  message: d,
                  timestamp: Date.now(),
                }).catch((e) => {
                  (this._cleanupTimeout(u), l(e));
                }))
              : this._transport
                  .send(d, { relatedRequestId: r, resumptionToken: i, onresumptiontoken: a })
                  .catch((e) => {
                    (this._cleanupTimeout(u), l(e));
                  });
          });
        }
        async getTask(e, t) {
          return this.request({ method: `tasks/get`, params: e }, it, t);
        }
        async getTaskResult(e, t, n) {
          return this.request({ method: `tasks/result`, params: e }, t, n);
        }
        async listTasks(e, t) {
          return this.request({ method: `tasks/list`, params: e }, ot, t);
        }
        async cancelTask(e, t) {
          return this.request({ method: `tasks/cancel`, params: e }, ct, t);
        }
        async notification(e, t) {
          if (!this._transport) throw Error(`Not connected`);
          this.assertNotificationCapability(e.method);
          let n = t?.relatedTask?.taskId;
          if (n) {
            let r = {
              ...e,
              jsonrpc: `2.0`,
              params: { ...e.params, _meta: { ...(e.params?._meta || {}), [w]: t.relatedTask } },
            };
            await this._enqueueTaskMessage(n, {
              type: `notification`,
              message: r,
              timestamp: Date.now(),
            });
            return;
          }
          if (
            (this._options?.debouncedNotificationMethods ?? []).includes(e.method) &&
            !e.params &&
            !t?.relatedRequestId &&
            !t?.relatedTask
          ) {
            if (this._pendingDebouncedNotifications.has(e.method)) return;
            (this._pendingDebouncedNotifications.add(e.method),
              Promise.resolve().then(() => {
                if ((this._pendingDebouncedNotifications.delete(e.method), !this._transport))
                  return;
                let n = { ...e, jsonrpc: `2.0` };
                (t?.relatedTask &&
                  (n = {
                    ...n,
                    params: {
                      ...n.params,
                      _meta: { ...(n.params?._meta || {}), [w]: t.relatedTask },
                    },
                  }),
                  this._transport?.send(n, t).catch((e) => this._onerror(e)));
              }));
            return;
          }
          let r = { ...e, jsonrpc: `2.0` };
          (t?.relatedTask &&
            (r = {
              ...r,
              params: { ...r.params, _meta: { ...(r.params?._meta || {}), [w]: t.relatedTask } },
            }),
            await this._transport.send(r, t));
        }
        setRequestHandler(e, t) {
          let n = Ir(e);
          (this.assertRequestHandlerCapability(n),
            this._requestHandlers.set(n, (n, r) => {
              let i = Lr(e, n);
              return Promise.resolve(t(i, r));
            }));
        }
        removeRequestHandler(e) {
          this._requestHandlers.delete(e);
        }
        assertCanSetRequestHandler(e) {
          if (this._requestHandlers.has(e))
            throw Error(`A request handler for ${e} already exists, which would be overridden`);
        }
        setNotificationHandler(e, t) {
          let n = Ir(e);
          this._notificationHandlers.set(n, (n) => {
            let r = Lr(e, n);
            return Promise.resolve(t(r));
          });
        }
        removeNotificationHandler(e) {
          this._notificationHandlers.delete(e);
        }
        _cleanupTaskProgressHandler(e) {
          let t = this._taskProgressTokens.get(e);
          t !== void 0 && (this._progressHandlers.delete(t), this._taskProgressTokens.delete(e));
        }
        async _enqueueTaskMessage(e, t, n) {
          if (!this._taskStore || !this._taskMessageQueue)
            throw Error(
              `Cannot enqueue task message: taskStore and taskMessageQueue are not configured`,
            );
          let r = this._options?.maxTaskQueueSize;
          await this._taskMessageQueue.enqueue(e, t, n, r);
        }
        async _clearTaskQueue(e, t) {
          if (this._taskMessageQueue) {
            let n = await this._taskMessageQueue.dequeueAll(e, t);
            for (let t of n)
              if (t.type === `request` && Ae(t.message)) {
                let n = t.message.id,
                  r = this._requestResolvers.get(n);
                r
                  ? (r(new X(P.InternalError, `Task cancelled or completed`)),
                    this._requestResolvers.delete(n))
                  : this._onerror(
                      Error(`Resolver missing for request ${n} during task ${e} cleanup`),
                    );
              }
          }
        }
        async _waitForTaskUpdate(e, t) {
          let n = this._options?.defaultTaskPollInterval ?? 1e3;
          try {
            let t = await this._taskStore?.getTask(e);
            t?.pollInterval && (n = t.pollInterval);
          } catch {}
          return new Promise((e, r) => {
            if (t.aborted) {
              r(new X(P.InvalidRequest, `Request cancelled`));
              return;
            }
            let i = setTimeout(e, n);
            t.addEventListener(
              `abort`,
              () => {
                (clearTimeout(i), r(new X(P.InvalidRequest, `Request cancelled`)));
              },
              { once: !0 },
            );
          });
        }
        requestTaskStore(e, t) {
          let n = this._taskStore;
          if (!n) throw Error(`No task store configured`);
          return {
            createTask: async (r) => {
              if (!e) throw Error(`No request provided`);
              return await n.createTask(r, e.id, { method: e.method, params: e.params }, t);
            },
            getTask: async (e) => {
              let r = await n.getTask(e, t);
              if (!r) throw new X(P.InvalidParams, `Failed to retrieve task: Task not found`);
              return r;
            },
            storeTaskResult: async (e, r, i) => {
              await n.storeTaskResult(e, r, i, t);
              let a = await n.getTask(e, t);
              if (a) {
                let t = U.parse({ method: `notifications/tasks/status`, params: a });
                (await this.notification(t), Z(a.status) && this._cleanupTaskProgressHandler(e));
              }
            },
            getTaskResult: (e) => n.getTaskResult(e, t),
            updateTaskStatus: async (e, r, i) => {
              let a = await n.getTask(e, t);
              if (!a)
                throw new X(P.InvalidParams, `Task "${e}" not found - it may have been cleaned up`);
              if (Z(a.status))
                throw new X(
                  P.InvalidParams,
                  `Cannot update task "${e}" from terminal status "${a.status}" to "${r}". Terminal states (completed, failed, cancelled) cannot transition to other states.`,
                );
              await n.updateTaskStatus(e, r, i, t);
              let o = await n.getTask(e, t);
              if (o) {
                let t = U.parse({ method: `notifications/tasks/status`, params: o });
                (await this.notification(t), Z(o.status) && this._cleanupTaskProgressHandler(e));
              }
            },
            listTasks: (e) => n.listTasks(e, t),
          };
        }
      }));
  });
function Vr(e, t) {
  return JSON.stringify(e) === JSON.stringify(t);
}
var Hr,
  Ur,
  Wr,
  Q,
  Gr,
  Kr,
  qr,
  Jr,
  Yr,
  Xr,
  Zr,
  Qr,
  $r,
  ei,
  ti,
  ni,
  ri,
  ii,
  ai,
  oi,
  si,
  ci,
  li,
  ui,
  di,
  fi,
  pi,
  mi,
  hi,
  gi = t(() => {
    (Wn(),
      Br(),
      me(),
      ((t) =>
        typeof e < `u`
          ? e
          : typeof Proxy < `u`
            ? new Proxy(t, { get: (t, n) => (typeof e < `u` ? e : t)[n] })
            : t)(function (t) {
        if (typeof e < `u`) return e.apply(this, arguments);
        throw Error(`Dynamic require of "` + t + `" is not supported`);
      }),
      (Hr = class extends zr {
        _registeredMethods = new Set();
        _eventSlots = new Map();
        onEventDispatch(e, t) {}
        _ensureEventSlot(e) {
          let t = this._eventSlots.get(e);
          if (!t) {
            let n = this.eventSchemas[e];
            if (!n) throw Error(`Unknown event: ${String(e)}`);
            ((t = { listeners: [] }), this._eventSlots.set(e, t));
            let r = n.shape.method.value;
            this._registeredMethods.add(r);
            let i = t;
            super.setNotificationHandler(n, (t) => {
              let n = t.params;
              (this.onEventDispatch(e, n), i.onHandler?.(n));
              for (let e of [...i.listeners]) e(n);
            });
          }
          return t;
        }
        setEventHandler(e, t) {
          let n = this._ensureEventSlot(e);
          (n.onHandler &&
            t &&
            console.warn(
              `[MCP Apps] on${String(e)} handler replaced. Use addEventListener("${String(e)}", …) to add multiple listeners without replacing.`,
            ),
            (n.onHandler = t));
        }
        getEventHandler(e) {
          return this._eventSlots.get(e)?.onHandler;
        }
        addEventListener(e, t) {
          this._ensureEventSlot(e).listeners.push(t);
        }
        removeEventListener(e, t) {
          let n = this._eventSlots.get(e);
          if (!n) return;
          let r = n.listeners.indexOf(t);
          r !== -1 && n.listeners.splice(r, 1);
        }
        setRequestHandler = (e, t) => {
          (this._assertMethodNotRegistered(e, `setRequestHandler`), super.setRequestHandler(e, t));
        };
        setNotificationHandler = (e, t) => {
          (this._assertMethodNotRegistered(e, `setNotificationHandler`),
            super.setNotificationHandler(e, t));
        };
        warnIfRequestHandlerReplaced(e, t, n) {
          t &&
            n &&
            console.warn(
              `[MCP Apps] ${e} handler replaced. Previous handler will no longer be called.`,
            );
        }
        replaceRequestHandler = (e, t) => {
          let n = e.shape.method.value;
          (this._registeredMethods.add(n), super.setRequestHandler(e, t));
        };
        _assertMethodNotRegistered(e, t) {
          let n = e.shape.method.value;
          if (this._registeredMethods.has(n))
            throw Error(
              `Handler for "${n}" already registered (via ${t}). Use addEventListener() to attach multiple listeners, or the on* setter for replace semantics.`,
            );
          this._registeredMethods.add(n);
        }
      }),
      (Ur = `2026-01-26`),
      (Wr = p([b(`light`), b(`dark`)]).describe(
        `Color theme preference for the host environment.`,
      )),
      (Q = p([b(`inline`), b(`fullscreen`), b(`pip`)]).describe(
        `Display mode for UI presentation.`,
      )),
      (Gr = p([
        b(`--color-background-primary`),
        b(`--color-background-secondary`),
        b(`--color-background-tertiary`),
        b(`--color-background-inverse`),
        b(`--color-background-ghost`),
        b(`--color-background-info`),
        b(`--color-background-danger`),
        b(`--color-background-success`),
        b(`--color-background-warning`),
        b(`--color-background-disabled`),
        b(`--color-text-primary`),
        b(`--color-text-secondary`),
        b(`--color-text-tertiary`),
        b(`--color-text-inverse`),
        b(`--color-text-ghost`),
        b(`--color-text-info`),
        b(`--color-text-danger`),
        b(`--color-text-success`),
        b(`--color-text-warning`),
        b(`--color-text-disabled`),
        b(`--color-border-primary`),
        b(`--color-border-secondary`),
        b(`--color-border-tertiary`),
        b(`--color-border-inverse`),
        b(`--color-border-ghost`),
        b(`--color-border-info`),
        b(`--color-border-danger`),
        b(`--color-border-success`),
        b(`--color-border-warning`),
        b(`--color-border-disabled`),
        b(`--color-ring-primary`),
        b(`--color-ring-secondary`),
        b(`--color-ring-inverse`),
        b(`--color-ring-info`),
        b(`--color-ring-danger`),
        b(`--color-ring-success`),
        b(`--color-ring-warning`),
        b(`--font-sans`),
        b(`--font-mono`),
        b(`--font-weight-normal`),
        b(`--font-weight-medium`),
        b(`--font-weight-semibold`),
        b(`--font-weight-bold`),
        b(`--font-text-xs-size`),
        b(`--font-text-sm-size`),
        b(`--font-text-md-size`),
        b(`--font-text-lg-size`),
        b(`--font-heading-xs-size`),
        b(`--font-heading-sm-size`),
        b(`--font-heading-md-size`),
        b(`--font-heading-lg-size`),
        b(`--font-heading-xl-size`),
        b(`--font-heading-2xl-size`),
        b(`--font-heading-3xl-size`),
        b(`--font-text-xs-line-height`),
        b(`--font-text-sm-line-height`),
        b(`--font-text-md-line-height`),
        b(`--font-text-lg-line-height`),
        b(`--font-heading-xs-line-height`),
        b(`--font-heading-sm-line-height`),
        b(`--font-heading-md-line-height`),
        b(`--font-heading-lg-line-height`),
        b(`--font-heading-xl-line-height`),
        b(`--font-heading-2xl-line-height`),
        b(`--font-heading-3xl-line-height`),
        b(`--border-radius-xs`),
        b(`--border-radius-sm`),
        b(`--border-radius-md`),
        b(`--border-radius-lg`),
        b(`--border-radius-xl`),
        b(`--border-radius-full`),
        b(`--border-width-regular`),
        b(`--shadow-hairline`),
        b(`--shadow-sm`),
        b(`--shadow-md`),
        b(`--shadow-lg`),
      ]).describe(`CSS variable keys available to MCP apps for theming.`)),
      (Kr = h(
        Gr.describe(`Style variables for theming MCP apps.

Individual style keys are optional - hosts may provide any subset of these values.
Values are strings containing CSS values (colors, sizes, font stacks, etc.).

Note: This type uses \`Record<K, string | undefined>\` rather than \`Partial<Record<K, string>>\`
for compatibility with Zod schema generation. Both are functionally equivalent for validation.`),
        p([C(), he()]).describe(`Style variables for theming MCP apps.

Individual style keys are optional - hosts may provide any subset of these values.
Values are strings containing CSS values (colors, sizes, font stacks, etc.).

Note: This type uses \`Record<K, string | undefined>\` rather than \`Partial<Record<K, string>>\`
for compatibility with Zod schema generation. Both are functionally equivalent for validation.`),
      ).describe(`Style variables for theming MCP apps.

Individual style keys are optional - hosts may provide any subset of these values.
Values are strings containing CSS values (colors, sizes, font stacks, etc.).

Note: This type uses \`Record<K, string | undefined>\` rather than \`Partial<Record<K, string>>\`
for compatibility with Zod schema generation. Both are functionally equivalent for validation.`)),
      (qr = m({
        method: b(`ui/open-link`),
        params: m({ url: C().describe(`URL to open in the host's browser`) }),
      })),
      m({
        isError: g()
          .optional()
          .describe(`True if the host failed to open the URL (e.g., due to security policy).`),
      }).passthrough(),
      m({
        isError: g()
          .optional()
          .describe(`True if the download failed (e.g., user cancelled or host denied).`),
      }).passthrough(),
      m({
        isError: g()
          .optional()
          .describe(`True if the host rejected or failed to deliver the message.`),
      }).passthrough(),
      (Jr = m({ method: b(`ui/notifications/sandbox-proxy-ready`), params: m({}) })),
      (Yr = m({
        connectDomains: x(C()).optional()
          .describe(`Origins for network requests (fetch/XHR/WebSocket).

- Maps to CSP \`connect-src\` directive
- Empty or omitted → no network connections (secure default)`),
        resourceDomains: x(C())
          .optional()
          .describe(
            "Origins for static resources (images, scripts, stylesheets, fonts, media).\n\n- Maps to CSP `img-src`, `script-src`, `style-src`, `font-src`, `media-src` directives\n- Wildcard subdomains supported: `https://*.example.com`\n- Empty or omitted → no network resources (secure default)",
          ),
        frameDomains: x(C())
          .optional()
          .describe(
            "Origins for nested iframes.\n\n- Maps to CSP `frame-src` directive\n- Empty or omitted → no nested iframes allowed (`frame-src 'none'`)",
          ),
        baseUriDomains: x(C())
          .optional()
          .describe(
            "Allowed base URIs for the document.\n\n- Maps to CSP `base-uri` directive\n- Empty or omitted → only same origin allowed (`base-uri 'self'`)",
          ),
      })),
      (Xr = m({
        camera: m({}).optional().describe(`Request camera access.

Maps to Permission Policy \`camera\` feature.`),
        microphone: m({}).optional().describe(`Request microphone access.

Maps to Permission Policy \`microphone\` feature.`),
        geolocation: m({}).optional().describe(`Request geolocation access.

Maps to Permission Policy \`geolocation\` feature.`),
        clipboardWrite: m({}).optional().describe(`Request clipboard write access.

Maps to Permission Policy \`clipboard-write\` feature.`),
      })),
      (Zr = m({
        method: b(`ui/notifications/size-changed`),
        params: m({
          width: _().optional().describe(`New width in pixels.`),
          height: _().optional().describe(`New height in pixels.`),
        }),
      })),
      m({
        method: b(`ui/notifications/tool-input`),
        params: m({
          arguments: h(C(), f().describe(`Complete tool call arguments as key-value pairs.`))
            .optional()
            .describe(`Complete tool call arguments as key-value pairs.`),
        }),
      }),
      m({
        method: b(`ui/notifications/tool-input-partial`),
        params: m({
          arguments: h(C(), f().describe(`Partial tool call arguments (incomplete, may change).`))
            .optional()
            .describe(`Partial tool call arguments (incomplete, may change).`),
        }),
      }),
      m({
        method: b(`ui/notifications/tool-cancelled`),
        params: m({
          reason: C()
            .optional()
            .describe(`Optional reason for the cancellation (e.g., "user action", "timeout").`),
        }),
      }),
      (Qr = m({ fonts: C().optional() })),
      ($r = m({
        variables: Kr.optional().describe(`CSS variables for theming the app.`),
        css: Qr.optional().describe(`CSS blocks that apps can inject.`),
      })),
      m({ method: b(`ui/resource-teardown`), params: m({}) }),
      (ei = h(C(), f())),
      (ti = m({
        text: m({}).optional().describe(`Host supports text content blocks.`),
        image: m({}).optional().describe(`Host supports image content blocks.`),
        audio: m({}).optional().describe(`Host supports audio content blocks.`),
        resource: m({}).optional().describe(`Host supports resource content blocks.`),
        resourceLink: m({}).optional().describe(`Host supports resource link content blocks.`),
        structuredContent: m({}).optional().describe(`Host supports structured content.`),
      })),
      (ni = m({ method: b(`ui/notifications/request-teardown`), params: m({}).optional() })),
      (ri = m({
        experimental: m({}).optional().describe(`Experimental features (structure TBD).`),
        openLinks: m({}).optional().describe(`Host supports opening external URLs.`),
        downloadFile: m({})
          .optional()
          .describe(`Host supports file downloads via ui/download-file.`),
        serverTools: m({
          listChanged: g().optional().describe(`Host supports tools/list_changed notifications.`),
        })
          .optional()
          .describe(`Host can proxy tool calls to the MCP server.`),
        serverResources: m({
          listChanged: g()
            .optional()
            .describe(`Host supports resources/list_changed notifications.`),
        })
          .optional()
          .describe(`Host can proxy resource reads to the MCP server.`),
        logging: m({}).optional().describe(`Host accepts log messages.`),
        sandbox: m({
          permissions: Xr.optional().describe(
            `Permissions granted by the host (camera, microphone, geolocation).`,
          ),
          csp: Yr.optional().describe(`CSP domains approved by the host.`),
        })
          .optional()
          .describe(`Sandbox configuration applied by the host.`),
        updateModelContext: ti
          .optional()
          .describe(
            `Host accepts context updates (ui/update-model-context) to be included in the model's context for future turns.`,
          ),
        message: ti
          .optional()
          .describe(`Host supports receiving content messages (ui/message) from the view.`),
        sampling: m({
          tools: m({})
            .optional()
            .describe("Host supports tool use via `tools` and `toolChoice` parameters."),
        })
          .optional()
          .describe(
            "Host supports LLM sampling (sampling/createMessage) from the view.\nMirrors the MCP `ClientCapabilities.sampling` shape so hosts can pass it through.",
          ),
      })),
      (ii = m({
        experimental: m({}).optional().describe(`Experimental features (structure TBD).`),
        tools: m({
          listChanged: g().optional().describe(`App supports tools/list_changed notifications.`),
        })
          .optional()
          .describe(`App exposes MCP-style tools that the host can call.`),
        availableDisplayModes: x(Q).optional().describe(`Display modes the app supports.`),
      })),
      (ai = m({ method: b(`ui/notifications/initialized`), params: m({}).optional() })),
      m({
        csp: Yr.optional().describe(`Content Security Policy configuration for UI resources.`),
        permissions: Xr.optional().describe(`Sandbox permissions requested by the UI resource.`),
        domain: C().optional().describe(`Dedicated origin for view sandbox.

Useful when views need stable, dedicated origins for OAuth callbacks, CORS policies, or API key allowlists.

**Host-dependent:** The format and validation rules for this field are determined by each host. Servers MUST consult host-specific documentation for the expected domain format. Common patterns include:
- Hash-based subdomains (e.g., \`{hash}.claudemcpcontent.com\`)
- URL-derived subdomains (e.g., \`www-example-com.oaiusercontent.com\`)

If omitted, host uses default sandbox origin (typically per-conversation).`),
        prefersBorder: g().optional()
          .describe(`Visual boundary preference - true if view prefers a visible border.

Boolean requesting whether a visible border and background is provided by the host. Specifying an explicit value for this is recommended because hosts' defaults may vary.

- \`true\`: request visible border + background
- \`false\`: request no visible border + background
- omitted: host decides border`),
      }),
      (oi = m({
        method: b(`ui/request-display-mode`),
        params: m({ mode: Q.describe(`The display mode being requested.`) }),
      })),
      m({
        mode: Q.describe(
          `The display mode that was actually set. May differ from requested if not supported.`,
        ),
      }).passthrough(),
      (si = p([b(`model`), b(`app`)]).describe(`Tool visibility scope - who can access the tool.`)),
      m({
        resourceUri: C().optional(),
        visibility: x(si).optional().describe(`Who can access this tool. Default: ["model", "app"]
- "model": Tool visible to and callable by the agent
- "app": Tool callable by the app from this server only`),
        csp: fe().optional(),
        permissions: fe().optional(),
      }),
      m({
        mimeTypes: x(C())
          .optional()
          .describe(
            'Array of supported MIME types for UI resources.\nMust include `"text/html;profile=mcp-app"` for MCP Apps support.',
          ),
      }),
      (ci = m({
        method: b(`ui/download-file`),
        params: m({
          contents: x(p([Bt, Vt])).describe(
            `Resource contents to download — embedded (inline data) or linked (host fetches). Uses standard MCP resource types.`,
          ),
        }),
      })),
      (li = m({
        method: b(`ui/message`),
        params: m({
          role: b(`user`).describe(`Message role, currently only "user" is supported.`),
          content: x(q).describe(`Message content blocks (text, image, etc.).`),
        }),
      })),
      m({
        method: b(`ui/notifications/sandbox-resource-ready`),
        params: m({
          html: C().describe(`HTML content to load into the inner iframe.`),
          sandbox: C()
            .optional()
            .describe(`Optional override for the inner iframe's sandbox attribute.`),
          csp: Yr.optional().describe(`CSP configuration from resource metadata.`),
          permissions: Xr.optional().describe(`Sandbox permissions from resource metadata.`),
        }),
      }),
      m({
        method: b(`ui/notifications/tool-result`),
        params: J.describe(`Standard MCP tool execution result.`),
      }),
      (ui = m({
        toolInfo: m({
          id: M.optional().describe(`JSON-RPC id of the tools/call request.`),
          tool: qt.describe(`Tool definition including name, inputSchema, etc.`),
        })
          .optional()
          .describe(`Metadata of the tool call that instantiated this App.`),
        theme: Wr.optional().describe(`Current color theme preference.`),
        styles: $r.optional().describe(`Style configuration for theming the app.`),
        displayMode: Q.optional().describe(`How the UI is currently displayed.`),
        availableDisplayModes: x(Q).optional().describe(`Display modes the host supports.`),
        containerDimensions: p([
          m({ height: _().describe(`Fixed container height in pixels.`) }),
          m({
            maxHeight: p([_(), he()]).optional().describe(`Maximum container height in pixels.`),
          }),
        ])
          .and(
            p([
              m({ width: _().describe(`Fixed container width in pixels.`) }),
              m({
                maxWidth: p([_(), he()]).optional().describe(`Maximum container width in pixels.`),
              }),
            ]),
          )
          .optional()
          .describe(`Container dimensions. Represents the dimensions of the iframe or other
container holding the app. Specify either width or maxWidth, and either height or maxHeight.`),
        locale: C().optional().describe(`User's language and region preference in BCP 47 format.`),
        timeZone: C().optional().describe(`User's timezone in IANA format.`),
        userAgent: C().optional().describe(`Host application identifier.`),
        platform: p([b(`web`), b(`desktop`), b(`mobile`)])
          .optional()
          .describe(`Platform type for responsive design decisions.`),
        deviceCapabilities: m({
          touch: g().optional().describe(`Whether the device supports touch input.`),
          hover: g().optional().describe(`Whether the device supports hover interactions.`),
        })
          .optional()
          .describe(`Device input capabilities.`),
        safeAreaInsets: m({
          top: _().describe(`Top safe area inset in pixels.`),
          right: _().describe(`Right safe area inset in pixels.`),
          bottom: _().describe(`Bottom safe area inset in pixels.`),
          left: _().describe(`Left safe area inset in pixels.`),
        })
          .optional()
          .describe(`Mobile safe area boundaries in pixels.`),
      }).passthrough()),
      m({
        method: b(`ui/notifications/host-context-changed`),
        params: ui.describe(`Partial context update containing only changed fields.`),
      }),
      (di = m({
        method: b(`ui/update-model-context`),
        params: m({
          content: x(q).optional().describe(`Context content blocks (text, image, etc.).`),
          structuredContent: h(
            C(),
            f().describe(`Structured content for machine-readable context data.`),
          )
            .optional()
            .describe(`Structured content for machine-readable context data.`),
        }),
      })),
      (fi = m({
        method: b(`ui/initialize`),
        params: m({
          appInfo: L.describe(`App identification (name and version).`),
          appCapabilities: ii.describe(`Features and capabilities this app provides.`),
          protocolVersion: C().describe(`Protocol version this app supports.`),
        }),
      })),
      m({
        protocolVersion: C().describe(`Negotiated protocol version string (e.g., "2025-11-21").`),
        hostInfo: L.describe(`Host application identification and version.`),
        hostCapabilities: ri.describe(`Features and capabilities provided by the host.`),
        hostContext: ui.describe(`Rich context about the host environment.`),
      }).passthrough(),
      (pi = class {
        eventTarget;
        eventSource;
        messageListener;
        constructor(e = window.parent, t) {
          ((this.eventTarget = e),
            (this.eventSource = t),
            (this.messageListener = (e) => {
              if (t && e.source !== this.eventSource) {
                console.debug(`Ignoring message from unknown source`, e);
                return;
              }
              let n = Ie.safeParse(e.data);
              n.success
                ? (console.debug(`Parsed message`, n.data), this.onmessage?.(n.data))
                : e.data?.jsonrpc === `2.0`
                  ? (console.error(`Failed to parse message`, n.error.message, e),
                    this.onerror?.(Error(`Invalid JSON-RPC message received: ` + n.error.message)))
                  : console.debug(`Ignoring non-JSON-RPC message`, n.error.message, e);
            }));
        }
        async start() {
          window.addEventListener(`message`, this.messageListener);
        }
        async send(e, t) {
          (e.method !== `ui/notifications/tool-input-partial` &&
            console.debug(`Sending message`, e),
            this.eventTarget.postMessage(e, `*`));
        }
        async close() {
          (window.removeEventListener(`message`, this.messageListener), this.onclose?.());
        }
        onclose;
        onerror;
        onmessage;
        sessionId;
        setProtocolVersion;
      }),
      (mi = [Ur]),
      (hi = class extends Hr {
        _client;
        _hostInfo;
        _capabilities;
        _appCapabilities;
        _hostContext = {};
        _appInfo;
        _initializedReceived = !1;
        _baseReplaceRequestHandler = this.replaceRequestHandler;
        replaceRequestHandler = (e, t) => {
          this._baseReplaceRequestHandler(
            e,
            (e, n) => (
              this._initializedReceived ||
                console.warn(
                  `[ext-apps] AppBridge received '${e.method}' before ui/notifications/initialized. The View is calling host methods before completing the handshake; it should await app.connect() first.`,
                ),
              t(e, n)
            ),
          );
        };
        eventSchemas = {
          sizechange: Zr,
          sandboxready: Jr,
          initialized: ai,
          requestteardown: ni,
          loggingmessage: rn,
        };
        constructor(e, t, n, r) {
          (super(r),
            (this._client = e),
            (this._hostInfo = t),
            (this._capabilities = n),
            this.addEventListener(`initialized`, () => {
              this._initializedReceived = !0;
            }),
            (this._hostContext = r?.hostContext || {}),
            this.setRequestHandler(fi, (e) => this._oninitialize(e)),
            this.setRequestHandler(R, (e, t) => (this.onping?.(e.params, t), {})),
            this.replaceRequestHandler(oi, (e) => ({
              mode: this._hostContext.displayMode ?? `inline`,
            })));
        }
        getAppCapabilities() {
          return this._appCapabilities;
        }
        getAppVersion() {
          return this._appInfo;
        }
        onping;
        get onsizechange() {
          return this.getEventHandler(`sizechange`);
        }
        set onsizechange(e) {
          this.setEventHandler(`sizechange`, e);
        }
        get onsandboxready() {
          return this.getEventHandler(`sandboxready`);
        }
        set onsandboxready(e) {
          this.setEventHandler(`sandboxready`, e);
        }
        get oninitialized() {
          return this.getEventHandler(`initialized`);
        }
        set oninitialized(e) {
          this.setEventHandler(`initialized`, e);
        }
        _onmessage;
        get onmessage() {
          return this._onmessage;
        }
        set onmessage(e) {
          (this.warnIfRequestHandlerReplaced(`onmessage`, this._onmessage, e),
            (this._onmessage = e),
            this.replaceRequestHandler(li, async (e, t) => {
              if (!this._onmessage) throw Error(`No onmessage handler set`);
              return this._onmessage(e.params, t);
            }));
        }
        _onopenlink;
        get onopenlink() {
          return this._onopenlink;
        }
        set onopenlink(e) {
          (this.warnIfRequestHandlerReplaced(`onopenlink`, this._onopenlink, e),
            (this._onopenlink = e),
            this.replaceRequestHandler(qr, async (e, t) => {
              if (!this._onopenlink) throw Error(`No onopenlink handler set`);
              return this._onopenlink(e.params, t);
            }));
        }
        _ondownloadfile;
        get ondownloadfile() {
          return this._ondownloadfile;
        }
        set ondownloadfile(e) {
          (this.warnIfRequestHandlerReplaced(`ondownloadfile`, this._ondownloadfile, e),
            (this._ondownloadfile = e),
            this.replaceRequestHandler(ci, async (e, t) => {
              if (!this._ondownloadfile) throw Error(`No ondownloadfile handler set`);
              return this._ondownloadfile(e.params, t);
            }));
        }
        get onrequestteardown() {
          return this.getEventHandler(`requestteardown`);
        }
        set onrequestteardown(e) {
          this.setEventHandler(`requestteardown`, e);
        }
        _onrequestdisplaymode;
        get onrequestdisplaymode() {
          return this._onrequestdisplaymode;
        }
        set onrequestdisplaymode(e) {
          (this.warnIfRequestHandlerReplaced(`onrequestdisplaymode`, this._onrequestdisplaymode, e),
            (this._onrequestdisplaymode = e),
            this.replaceRequestHandler(oi, async (e, t) => {
              if (!this._onrequestdisplaymode) throw Error(`No onrequestdisplaymode handler set`);
              return this._onrequestdisplaymode(e.params, t);
            }));
        }
        get onloggingmessage() {
          return this.getEventHandler(`loggingmessage`);
        }
        set onloggingmessage(e) {
          this.setEventHandler(`loggingmessage`, e);
        }
        _onupdatemodelcontext;
        get onupdatemodelcontext() {
          return this._onupdatemodelcontext;
        }
        set onupdatemodelcontext(e) {
          (this.warnIfRequestHandlerReplaced(`onupdatemodelcontext`, this._onupdatemodelcontext, e),
            (this._onupdatemodelcontext = e),
            this.replaceRequestHandler(di, async (e, t) => {
              if (!this._onupdatemodelcontext) throw Error(`No onupdatemodelcontext handler set`);
              return this._onupdatemodelcontext(e.params, t);
            }));
        }
        _oncalltool;
        get oncalltool() {
          return this._oncalltool;
        }
        set oncalltool(e) {
          (this.warnIfRequestHandlerReplaced(`oncalltool`, this._oncalltool, e),
            (this._oncalltool = e),
            this.replaceRequestHandler(Zt, async (e, t) => {
              if (!this._oncalltool) throw Error(`No oncalltool handler set`);
              return this._oncalltool(e.params, t);
            }));
        }
        set oncreatesamplingmessage(e) {
          this.setRequestHandler(fn, async (t, n) => e(t.params, n));
        }
        sendToolListChanged(e = {}) {
          return this.notification({ method: `notifications/tools/list_changed`, params: e });
        }
        _onlistresources;
        get onlistresources() {
          return this._onlistresources;
        }
        set onlistresources(e) {
          (this.warnIfRequestHandlerReplaced(`onlistresources`, this._onlistresources, e),
            (this._onlistresources = e),
            this.replaceRequestHandler(ht, async (e, t) => {
              if (!this._onlistresources) throw Error(`No onlistresources handler set`);
              return this._onlistresources(e.params, t);
            }));
        }
        _onlistresourcetemplates;
        get onlistresourcetemplates() {
          return this._onlistresourcetemplates;
        }
        set onlistresourcetemplates(e) {
          (this.warnIfRequestHandlerReplaced(
            `onlistresourcetemplates`,
            this._onlistresourcetemplates,
            e,
          ),
            (this._onlistresourcetemplates = e),
            this.replaceRequestHandler(_t, async (e, t) => {
              if (!this._onlistresourcetemplates)
                throw Error(`No onlistresourcetemplates handler set`);
              return this._onlistresourcetemplates(e.params, t);
            }));
        }
        _onreadresource;
        get onreadresource() {
          return this._onreadresource;
        }
        set onreadresource(e) {
          (this.warnIfRequestHandlerReplaced(`onreadresource`, this._onreadresource, e),
            (this._onreadresource = e),
            this.replaceRequestHandler(xt, async (e, t) => {
              if (!this._onreadresource) throw Error(`No onreadresource handler set`);
              return this._onreadresource(e.params, t);
            }));
        }
        sendResourceListChanged(e = {}) {
          return this.notification({ method: `notifications/resources/list_changed`, params: e });
        }
        _onlistprompts;
        get onlistprompts() {
          return this._onlistprompts;
        }
        set onlistprompts(e) {
          (this.warnIfRequestHandlerReplaced(`onlistprompts`, this._onlistprompts, e),
            (this._onlistprompts = e),
            this.replaceRequestHandler(Mt, async (e, t) => {
              if (!this._onlistprompts) throw Error(`No onlistprompts handler set`);
              return this._onlistprompts(e.params, t);
            }));
        }
        sendPromptListChanged(e = {}) {
          return this.notification({ method: `notifications/prompts/list_changed`, params: e });
        }
        assertCapabilityForMethod(e) {}
        assertRequestHandlerCapability(e) {}
        assertNotificationCapability(e) {}
        assertTaskCapability(e) {
          throw Error(`Tasks are not supported in MCP Apps`);
        }
        assertTaskHandlerCapability(e) {
          throw Error(`Task handlers are not supported in MCP Apps`);
        }
        getCapabilities() {
          return this._capabilities;
        }
        async _oninitialize(e) {
          let t = e.params.protocolVersion;
          return (
            this._appInfo !== void 0 &&
              console.warn(
                `[ext-apps] AppBridge received a second ui/initialize. The View may be double-mounting (e.g. React StrictMode in dev) without closing the previous App instance. Responding normally; the latest appInfo/appCapabilities replace the previous values.`,
              ),
            (this._appCapabilities = e.params.appCapabilities),
            (this._appInfo = e.params.appInfo),
            {
              protocolVersion: mi.includes(t) ? t : Ur,
              hostCapabilities: this.getCapabilities(),
              hostInfo: this._hostInfo,
              hostContext: this._hostContext,
            }
          );
        }
        setHostContext(e) {
          let t = {},
            n = !1;
          for (let r of Object.keys(e)) {
            let i = this._hostContext[r],
              a = e[r];
            Vr(i, a) || ((t[r] = a), (n = !0));
          }
          n && ((this._hostContext = e), this.sendHostContextChange(t));
        }
        sendHostContextChange(e) {
          return this.notification({ method: `ui/notifications/host-context-changed`, params: e });
        }
        sendToolInput(e) {
          return this.notification({ method: `ui/notifications/tool-input`, params: e });
        }
        sendToolInputPartial(e) {
          return this.notification({ method: `ui/notifications/tool-input-partial`, params: e });
        }
        sendToolResult(e) {
          return this.notification({ method: `ui/notifications/tool-result`, params: e });
        }
        sendToolCancelled(e) {
          return this.notification({ method: `ui/notifications/tool-cancelled`, params: e });
        }
        sendSandboxResourceReady(e) {
          return this.notification({
            method: `ui/notifications/sandbox-resource-ready`,
            params: e,
          });
        }
        teardownResource(e, t) {
          return this.request({ method: `ui/resource-teardown`, params: e }, ei, t);
        }
        sendResourceTeardown = this.teardownResource;
        callTool(e, t) {
          return this.request({ method: `tools/call`, params: e }, J, t);
        }
        listTools(e, t) {
          return this.request({ method: `tools/list`, params: e }, Yt, t);
        }
        async connect(e) {
          if (this.transport)
            throw Error(`AppBridge is already connected. Call close() before connecting again.`);
          if (((this._initializedReceived = !1), this._client)) {
            let e = this._client.getServerCapabilities();
            if (!e) throw Error(`Client server capabilities not available`);
            (e.tools &&
              ((this.oncalltool = async (e, t) =>
                this._client.request({ method: `tools/call`, params: e }, J, { signal: t.signal })),
              e.tools.listChanged &&
                this._client.setNotificationHandler(Qt, (e) => this.sendToolListChanged(e.params))),
              e.resources &&
                ((this.onlistresources = async (e, t) =>
                  this._client.request({ method: `resources/list`, params: e }, gt, {
                    signal: t.signal,
                  })),
                (this.onlistresourcetemplates = async (e, t) =>
                  this._client.request({ method: `resources/templates/list`, params: e }, vt, {
                    signal: t.signal,
                  })),
                (this.onreadresource = async (e, t) =>
                  this._client.request({ method: `resources/read`, params: e }, St, {
                    signal: t.signal,
                  })),
                e.resources.listChanged &&
                  this._client.setNotificationHandler(Ct, (e) =>
                    this.sendResourceListChanged(e.params),
                  )),
              e.prompts &&
                ((this.onlistprompts = async (e, t) =>
                  this._client.request({ method: `prompts/list`, params: e }, Nt, {
                    signal: t.signal,
                  })),
                e.prompts.listChanged &&
                  this._client.setNotificationHandler(Wt, (e) =>
                    this.sendPromptListChanged(e.params),
                  )));
          }
          return super.connect(e);
        }
      }));
  });
function _i(e) {
  return { openLinks: {}, serverResources: {}, serverTools: {}, sandbox: { csp: e ?? {} } };
}
function vi(e, t, n, r, i) {
  if (!Number.isInteger(t) || t < 1 || t > 65535) throw Error(`MCP App sandbox port is invalid`);
  let a = new URL(r || i, i);
  if (
    (a.protocol === `ws:`
      ? (a.protocol = `http:`)
      : a.protocol === `wss:` && (a.protocol = `https:`),
    a.protocol !== `http:` && a.protocol !== `https:`)
  )
    throw Error(`MCP App sandbox URL is invalid`);
  let o = a.origin,
    s = n ? new URL(n) : new URL(o);
  if (n) {
    if (s.origin !== n.replace(/\/$/u, ``) || s.username !== `` || s.password !== ``)
      throw Error(`MCP App sandbox URL is invalid`);
  } else s.port = String(t);
  ((s.pathname = `/`), (s.search = ``), (s.hash = ``));
  let c = new URL(e, s);
  if (
    (s.protocol !== `http:` && s.protocol !== `https:`) ||
    s.origin === new URL(i).origin ||
    s.origin === o ||
    c.origin !== s.origin ||
    c.pathname !== `/mcp-app-sandbox`
  )
    throw Error(`MCP App sandbox URL is invalid`);
  return c.href;
}
var yi = t(() => {});
async function bi(
  e = window.requestAnimationFrame.bind(window),
  t = window.setTimeout.bind(window),
) {
  await Promise.race([
    new Promise((t) => {
      e(() => {
        e(() => t());
      });
    }),
    new Promise((e) => {
      t(e, 1e3);
    }),
  ]);
}
function xi(e, t) {
  let n = e?.getBoundingClientRect(),
    r = navigator.maxTouchPoints > 0 || window.matchMedia?.(`(pointer: coarse)`).matches;
  return {
    theme: window.matchMedia?.(`(prefers-color-scheme: dark)`).matches ? `dark` : `light`,
    displayMode: `inline`,
    availableDisplayModes: [`inline`],
    containerDimensions: {
      width: Math.max(1, Math.round(n?.width || window.innerWidth)),
      height: t,
    },
    locale: navigator.language || void 0,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    platform: r && window.innerWidth < 768 ? `mobile` : `web`,
    deviceCapabilities: { touch: r, hover: window.matchMedia?.(`(hover: hover)`).matches },
    safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
  };
}
var Si,
  $,
  Ci = t(() => {
    (i(),
      gi(),
      Wn(),
      ne(),
      c(),
      l(),
      ce(),
      Se(),
      ae(),
      yi(),
      n(),
      (Si = class extends hi {
        setListToolsHandler(e) {
          this.replaceRequestHandler(Jt, (t) => e(t.params));
        }
      }),
      ($ = class extends o {
        constructor(...e) {
          (super(...e),
            (this.sessionKey = ``),
            (this.viewId = ``),
            (this.height = 600),
            (this.title = ``),
            (this.error = null),
            (this.i18nController = new be(this)),
            (this.mount = ee()),
            (this.bridge = null),
            (this.iframe = null),
            (this.transport = null),
            (this.setupKey = ``),
            (this.setupClient = null),
            (this.setupGeneration = 0));
        }
        static {
          this.styles = ie`
    :host {
      display: block;
      width: 100%;
    }
    .mount {
      width: 100%;
      min-height: 160px;
    }
    .mount:empty {
      min-height: 0;
    }
    iframe {
      display: block;
      width: 100%;
      border: 0;
      background: transparent;
    }
    .error {
      padding: 14px;
      color: var(--danger, #dc2626);
      font-size: 13px;
    }
  `;
        }
        disconnectedCallback() {
          ((this.setupGeneration += 1), this.teardown(), super.disconnectedCallback());
        }
        updated() {
          this.iframe && (this.iframe.title = this.title || xe(`mcpApp.title`));
          let e = `${this.sessionKey}\0${this.viewId}`,
            t = this.context?.gateway.snapshot.client ?? null;
          (e !== this.setupKey || t !== this.setupClient) &&
            ((this.setupKey = e), (this.setupClient = t), this.setup());
        }
        async request(e, t) {
          let n = this.context?.gateway.snapshot.client;
          if (!n || !this.sessionKey || !this.viewId) throw Error(`MCP App gateway unavailable`);
          return await n.request(e, { sessionKey: this.sessionKey, viewId: this.viewId, ...t });
        }
        async teardown() {
          let e = this.bridge,
            t = this.transport,
            n = this.iframe;
          ((this.bridge = null),
            (this.transport = null),
            (this.iframe = null),
            n?.remove(),
            e &&
              (await Promise.race([
                e.teardownResource({}).catch(() => void 0),
                new Promise((e) => {
                  setTimeout(e, 250);
                }),
              ])),
            await t?.close().catch(() => void 0));
        }
        async setup() {
          let e = ++this.setupGeneration;
          if (
            (await this.teardown(),
            !(!this.sessionKey || !this.viewId || e !== this.setupGeneration))
          )
            try {
              let t = await this.request(`mcp.app.view`, {}),
                n = this.mount.value;
              if (!n || e !== this.setupGeneration) return;
              let r = document.createElement(`iframe`);
              ((r.title = this.title || xe(`mcpApp.title`)),
                (r.referrerPolicy = `origin`),
                (r.style.height = `${this.height}px`),
                r.setAttribute(`sandbox`, `allow-scripts allow-same-origin allow-forms`),
                n.appendChild(r),
                (this.iframe = r));
              let i = new Promise((e, t) => {
                let n = window.setTimeout(() => {
                    (window.removeEventListener(`message`, i),
                      t(Error(`MCP App sandbox timed out`)));
                  }, 15e3),
                  i = (t) => {
                    t.source === r.contentWindow &&
                      t.data?.method === `ui/notifications/sandbox-proxy-ready` &&
                      (window.clearTimeout(n), window.removeEventListener(`message`, i), e());
                  };
                window.addEventListener(`message`, i);
              });
              if (
                ((r.src = vi(
                  t.sandboxUrl,
                  t.sandboxPort,
                  t.sandboxOrigin,
                  this.context?.gateway.connection.gatewayUrl ?? ``,
                  window.location.origin,
                )),
                await i,
                !r.contentWindow || e !== this.setupGeneration)
              )
                return;
              let a = new Si(null, { name: `OpenClaw`, version: `1.0.0` }, _i(t.csp), {
                hostContext: xi(n, this.height),
              });
              ((a.oncalltool = async (e) =>
                await this.request(`mcp.app.callTool`, {
                  toolName: e.name,
                  arguments: e.arguments,
                })),
                a.setListToolsHandler(
                  async (e) =>
                    await this.request(`mcp.app.listTools`, e?.cursor ? { cursor: e.cursor } : {}),
                ),
                (a.onlistresources = async (e) =>
                  await this.request(
                    `mcp.app.listResources`,
                    e?.cursor ? { cursor: e.cursor } : {},
                  )),
                (a.onlistresourcetemplates = async (e) =>
                  await this.request(
                    `mcp.app.listResourceTemplates`,
                    e?.cursor ? { cursor: e.cursor } : {},
                  )),
                (a.onreadresource = async (e) =>
                  await this.request(`mcp.app.readResource`, { uri: e.uri })),
                (a.onopenlink = async ({ url: e }) => (oe(e) ? {} : { isError: !0 })),
                (a.onsizechange = ({ height: e }) => {
                  if (e !== void 0) {
                    let t = Math.min(1200, Math.max(160, Math.round(e)));
                    ((r.style.height = `${t}px`), a.setHostContext(xi(n, t)));
                  }
                }));
              let o = new Promise((e) => {
                  a.oninitialized = () => e();
                }),
                s = new pi(r.contentWindow, r.contentWindow);
              if (
                ((this.bridge = a),
                (this.transport = s),
                await a.connect(s),
                await a.sendSandboxResourceReady({ html: t.html, csp: t.csp }),
                await Promise.race([
                  o,
                  new Promise((e, t) => {
                    window.setTimeout(() => t(Error(`MCP App initialization timed out`)), 15e3);
                  }),
                ]),
                await bi(),
                e !== this.setupGeneration)
              )
                return;
              (await a.sendToolInput({
                arguments:
                  t.toolInput && typeof t.toolInput == `object` && !Array.isArray(t.toolInput)
                    ? t.toolInput
                    : {},
              }),
                await a.sendToolResult(t.toolResult),
                e === this.setupGeneration && (this.error = null));
            } catch (t) {
              e === this.setupGeneration &&
                (await this.teardown(), (this.error = t instanceof Error ? t.message : String(t)));
            }
        }
        render() {
          return te`<div ${s(this.mount)} class="mount"></div>
      ${this.error ? te`<div class="error">${xe(`mcpApp.unavailable`, { error: this.error })}</div>` : re}`;
        }
      }),
      r([a({ context: se, subscribe: !0 })], $.prototype, `context`, void 0),
      r([d({ attribute: !1 })], $.prototype, `sessionKey`, void 0),
      r([d({ attribute: !1 })], $.prototype, `viewId`, void 0),
      r([d({ type: Number })], $.prototype, `height`, void 0),
      r([d()], $.prototype, `title`, void 0),
      r([u()], $.prototype, `error`, void 0));
  });
t(() => {
  (Ci(), customElements.get(`mcp-app-view`) || customElements.define(`mcp-app-view`, $));
})();
//# sourceMappingURL=mcp-app-view-registration-mqG8-_Fv.js.map
