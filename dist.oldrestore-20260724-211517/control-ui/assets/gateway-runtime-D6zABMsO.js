import { n as e, t } from "./rolldown-runtime-DaJ6WEGw.js";
var n,
  r,
  i,
  a,
  o,
  s,
  c,
  l,
  u,
  d,
  f,
  p,
  m,
  h,
  g,
  _,
  v,
  y,
  b,
  x,
  S,
  C,
  w,
  T,
  E,
  ee,
  D,
  O,
  k,
  A,
  j,
  M,
  te,
  N,
  P,
  F,
  I,
  L,
  R,
  z,
  B,
  V,
  H,
  U,
  W,
  G,
  K,
  q,
  ne,
  J,
  Y,
  re,
  ie,
  ae,
  oe,
  se,
  ce,
  le,
  ue,
  X,
  Z,
  Q,
  de,
  fe,
  $,
  pe,
  me = e(() => {
    ((n = Object.freeze({
      p: 57896044618658097711785492504343953926634992332820282019728792003956564819949n,
      n: 7237005577332262213973186563042994240857116359379907606001950938285454250989n,
      h: 8n,
      a: 57896044618658097711785492504343953926634992332820282019728792003956564819948n,
      d: 37095705934669439343138083508754565189542113879843219016388785533085940283555n,
      Gx: 15112221349535400772501151409588531511454012693041857206046113283949847762202n,
      Gy: 46316835694926478169428394003475163141307993866256225615783033603165251855960n,
    })),
      ({ p: r, n: i, Gx: a, Gy: o, a: s, d: c, h: l } = n),
      (u = 32),
      (d = (...e) => {
        `captureStackTrace` in Error &&
          typeof Error.captureStackTrace == `function` &&
          Error.captureStackTrace(...e);
      }),
      (f = (e = ``) => {
        let t = Error(e);
        throw (d(t, f), t);
      }),
      (p = (e) => typeof e == `bigint`),
      (m = (e) => typeof e == `string`),
      (h = (e) =>
        e instanceof Uint8Array ||
        (ArrayBuffer.isView(e) &&
          e.constructor.name === `Uint8Array` &&
          `BYTES_PER_ELEMENT` in e &&
          e.BYTES_PER_ELEMENT === 1)),
      (g = (e, t, n = ``) => {
        let r = h(e),
          i = e?.length,
          a = t !== void 0;
        if (!r || (a && i !== t)) {
          let o = n && `"${n}" `,
            s = a ? ` of length ${t}` : ``,
            c = r ? `length=${i}` : `type=${typeof e}`,
            l = o + `expected Uint8Array` + s + `, got ` + c;
          throw r ? RangeError(l) : TypeError(l);
        }
        return e;
      }),
      (_ = (e) => new Uint8Array(e)),
      (v = (e) => Uint8Array.from(e)),
      (y = (e, t) => e.toString(16).padStart(t, `0`)),
      (b = (e) =>
        Array.from(g(e))
          .map((e) => y(e, 2))
          .join(``)),
      (x = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 }),
      (S = (e) => {
        if (e >= x._0 && e <= x._9) return e - x._0;
        if (e >= x.A && e <= x.F) return e - (x.A - 10);
        if (e >= x.a && e <= x.f) return e - (x.a - 10);
      }),
      (C = (e) => {
        let t = `hex invalid`;
        if (!m(e)) return f(t);
        let n = e.length,
          r = n / 2;
        if (n % 2) return f(t);
        let i = _(r);
        for (let n = 0, a = 0; n < r; n++, a += 2) {
          let r = S(e.charCodeAt(a)),
            o = S(e.charCodeAt(a + 1));
          if (r === void 0 || o === void 0) return f(t);
          i[n] = r * 16 + o;
        }
        return i;
      }),
      (w = () => globalThis?.crypto),
      (T = () => w()?.subtle ?? f(`crypto.subtle must be defined, consider polyfill`)),
      (E = (...e) => {
        let t = 0;
        for (let n of e) t += g(n).length;
        let n = _(t),
          r = 0;
        return (
          e.forEach((e) => {
            (n.set(e, r), (r += e.length));
          }),
          n
        );
      }),
      (ee = (e = u) => w().getRandomValues(_(e))),
      (D = BigInt),
      (O = (e, t, n, r = `bad number: out of range`) => {
        if (!p(e)) throw TypeError(r);
        if (t <= e && e < n) return e;
        throw RangeError(r);
      }),
      (k = (e, t = r) => {
        let n = e % t;
        return n >= 0n ? n : t + n;
      }),
      (A = (1n << 255n) - 1n),
      (j = (e) => {
        e < 0n && f(`negative coordinate`);
        let t = (e >> 255n) * 19n + (e & A);
        return ((t = (t >> 255n) * 19n + (t & A)), t % r);
      }),
      (M = (e) => k(e, i)),
      (te = (e, t) => {
        (e === 0n || t <= 0n) && f(`no inverse n=` + e + ` mod=` + t);
        let n = k(e, t),
          r = t,
          i = 0n,
          a = 1n,
          o = 1n,
          s = 0n;
        for (; n !== 0n;) {
          let e = r / n,
            t = r % n,
            c = i - o * e,
            l = a - s * e;
          ((r = n), (n = t), (i = o), (a = s), (o = c), (s = l));
        }
        return r === 1n ? k(i, t) : f(`no inverse`);
      }),
      (N = (e) => {
        let t = ce[e];
        return (typeof t != `function` && f(`hashes.` + e + ` not set`), t);
      }),
      (P = (e) => g(e, 64, `digest`)),
      (F = (e) => (e instanceof L ? e : f(`Point expected`))),
      (I = 2n ** 256n),
      (L = class e {
        static BASE;
        static ZERO;
        X;
        Y;
        Z;
        T;
        constructor(e, t, n, r) {
          let i = I;
          ((this.X = O(e, 0n, i)),
            (this.Y = O(t, 0n, i)),
            (this.Z = O(n, 1n, i)),
            (this.T = O(r, 0n, i)),
            Object.freeze(this));
        }
        static CURVE() {
          return n;
        }
        static fromAffine(t) {
          return new e(t.x, t.y, 1n, j(t.x * t.y));
        }
        static fromBytes(t, n = !1) {
          let i = c,
            a = v(g(t, u)),
            o = t[31];
          a[31] = o & -129;
          let s = V(a);
          O(s, 0n, n ? I : r);
          let l = j(s * s),
            d = k(l - 1n),
            p = j(i * l + 1n),
            { isValid: m, value: h } = G(d, p);
          m || f(`bad point: y not sqrt`);
          let _ = (h & 1n) == 1n,
            y = (o & 128) != 0;
          return (
            !n && h === 0n && y && f(`bad point: x==0, isLastByteOdd`),
            y !== _ && (h = k(-h)),
            new e(h, s, 1n, j(h * s))
          );
        }
        static fromHex(t, n) {
          return e.fromBytes(C(t), n);
        }
        get x() {
          return this.toAffine().x;
        }
        get y() {
          return this.toAffine().y;
        }
        assertValidity() {
          let e = s,
            t = c,
            n = this;
          if (n.is0()) return f(`bad point: ZERO`);
          let { X: r, Y: i, Z: a, T: o } = n,
            l = j(r * r),
            u = j(i * i),
            d = j(a * a),
            p = j(d * d),
            m = j(l * e);
          return j(d * (m + u)) === k(p + j(t * j(l * u)))
            ? j(r * i) === j(a * o)
              ? this
              : f(`bad point: equation left != right (2)`)
            : f(`bad point: equation left != right (1)`);
        }
        equals(e) {
          let { X: t, Y: n, Z: r } = this,
            { X: i, Y: a, Z: o } = F(e),
            s = j(t * o),
            c = j(i * r),
            l = j(n * o),
            u = j(a * r);
          return s === c && l === u;
        }
        is0() {
          return this.equals(z);
        }
        negate() {
          return new e(k(-this.X), this.Y, this.Z, k(-this.T));
        }
        double() {
          let { X: t, Y: n, Z: r } = this,
            i = s,
            a = j(t * t),
            o = j(n * n),
            c = j(2n * r * r),
            l = j(i * a),
            u = k(t + n),
            d = k(j(u * u) - a - o),
            f = k(l + o),
            p = k(f - c),
            m = k(l - o),
            h = j(d * p),
            g = j(f * m),
            _ = j(d * m),
            v = j(p * f);
          return new e(h, g, v, _);
        }
        add(t) {
          let { X: n, Y: r, Z: i, T: a } = this,
            { X: o, Y: l, Z: u, T: d } = F(t),
            f = s,
            p = c,
            m = j(n * o),
            h = j(r * l),
            g = j(j(a * p) * d),
            _ = j(i * u),
            v = k(j(k(n + r) * k(o + l)) - m - h),
            y = k(_ - g),
            b = k(_ + g),
            x = k(h - j(f * m)),
            S = j(v * y),
            C = j(b * x),
            w = j(v * x),
            T = j(y * b);
          return new e(S, C, T, w);
        }
        subtract(e) {
          return this.add(F(e).negate());
        }
        multiply(e, t = !0) {
          if ((!t && e === 0n) || (O(e, 1n, i), !t && this.is0())) return z;
          if (e === 1n) return this;
          if (this.equals(R)) return pe(e).p;
          let n = z,
            r = R;
          for (let i = this; e > 0n; i = i.double(), e >>= 1n)
            e & 1n ? (n = n.add(i)) : t && (r = r.add(i));
          return n;
        }
        multiplyUnsafe(e) {
          return this.multiply(e, !1);
        }
        toAffine() {
          let { X: e, Y: t, Z: n } = this;
          if (this.equals(z)) return { x: 0n, y: 1n };
          let i = te(n, r);
          return (j(n * i) !== 1n && f(`invalid inverse`), { x: j(e * i), y: j(t * i) });
        }
        toBytes() {
          let { x: e, y: t } = this.toAffine(),
            n = B(t);
          return ((n[31] |= e & 1n ? 128 : 0), n);
        }
        toHex() {
          return b(this.toBytes());
        }
        clearCofactor() {
          return this.multiply(D(l), !1);
        }
        isSmallOrder() {
          return this.clearCofactor().is0();
        }
        isTorsionFree() {
          let e = this.multiply(i / 2n, !1).double();
          return (i % 2n && (e = e.add(this)), e.is0());
        }
      }),
      (R = new L(a, o, 1n, k(a * o))),
      (z = new L(0n, 1n, 1n, 0n)),
      (L.BASE = R),
      (L.ZERO = z),
      (B = (e) => C(y(O(e, 0n, I), 64)).reverse()),
      (V = (e) => D(`0x` + b(v(g(e)).reverse()))),
      (H = (e, t) => {
        let n = e;
        for (; t-- > 0n;) n = j(n * n);
        return n;
      }),
      (U = (e) => {
        let t = j(e * e),
          n = j(t * e),
          r = j(H(n, 2n) * n),
          i = j(H(r, 1n) * e),
          a = j(H(i, 5n) * i),
          o = j(H(a, 10n) * a),
          s = j(H(o, 20n) * o),
          c = j(H(s, 40n) * s),
          l = j(H(c, 80n) * c),
          u = j(H(l, 80n) * c),
          d = j(H(u, 10n) * a);
        return { pow_p_5_8: j(H(d, 2n) * e), b2: n };
      }),
      (W = 19681161376707505956807079304988542015446066515923890162744021073123829784752n),
      (G = (e, t) => {
        let n = j(t * j(t * t)),
          r = j(j(n * n) * t),
          i = U(j(e * r)).pow_p_5_8,
          a = j(e * j(n * i)),
          o = j(t * j(a * a)),
          s = a,
          c = j(a * W),
          l = o === e,
          u = o === k(-e),
          d = o === k(-e * W);
        return (
          l && (a = s),
          (u || d) && (a = c),
          (k(a) & 1n) == 1n && (a = k(-a)),
          { isValid: l || u, value: a }
        );
      }),
      (K = (e) => M(V(e))),
      (q = (...e) => Promise.resolve(N(`sha512Async`)(E(...e))).then(P)),
      (ne = (...e) => P(N(`sha512`)(E(...e)))),
      (J = (e) => {
        let t = v(e),
          n = t.slice(0, 32);
        ((n[0] &= 248), (n[31] &= 127), (n[31] |= 64));
        let r = t.slice(32, 64),
          i = K(n),
          a = R.multiply(i);
        return { head: n, prefix: r, scalar: i, point: a, pointBytes: a.toBytes() };
      }),
      (Y = (e) => q(g(e, u)).then(J)),
      (re = (e) => J(ne(g(e, u)))),
      (ie = (e) => Y(e).then((e) => e.pointBytes)),
      (ae = (e) => q(e.hashable).then(e.finish)),
      (oe = (e, t, n) => {
        let { pointBytes: r, scalar: i } = e,
          a = K(t),
          o = R.multiply(a).toBytes();
        return {
          hashable: E(o, r, n),
          finish: (e) => {
            let t = M(a + K(e) * i);
            return g(E(o, B(t)), 64);
          },
        };
      }),
      (se = async (e, t) => {
        let n = g(e),
          r = await Y(t),
          i = await q(r.prefix, n);
        return ae(oe(r, i, n));
      }),
      (ce = {
        sha512Async: async (e) => {
          let t = T(),
            n = E(e);
          return _(await t.digest(`SHA-512`, n.buffer));
        },
        sha512: void 0,
      }),
      (le = (e) => ((e = e === void 0 ? ee(u) : e), g(e, u))),
      (ue = Object.freeze({
        getExtendedPublicKeyAsync: Y,
        getExtendedPublicKey: re,
        randomSecretKey: le,
      })),
      (X = 8),
      (Z = Math.ceil(256 / X) + 1),
      (Q = 2 ** (X - 1)),
      (de = () => {
        let e = [],
          t = R,
          n = t;
        for (let r = 0; r < Z; r++) {
          ((n = t), e.push(n));
          for (let r = 1; r < Q; r++) ((n = n.add(t)), e.push(n));
          t = n.double();
        }
        return e;
      }),
      (fe = void 0),
      ($ = (e, t) => {
        let n = t.negate();
        return e ? n : t;
      }),
      (pe = (e) => {
        let t = (fe ||= de()),
          n = z,
          r = R,
          i = 2 ** X,
          a = i,
          o = D(i - 1),
          s = D(X);
        for (let i = 0; i < Z; i++) {
          let c = Number(e & o);
          ((e >>= s), c > Q && ((c -= a), (e += 1n)));
          let l = i * Q,
            u = l,
            d = l + Math.abs(c) - 1,
            f = i % 2 != 0,
            p = c < 0;
          c === 0 ? (r = r.add($(f, t[u]))) : (n = n.add($(p, t[d])));
        }
        return (e !== 0n && f(`invalid wnaf`), { p: n, f: r });
      }));
  });
function he(e, t) {
  let n = e.hello?.features?.methods;
  return Array.isArray(n) ? n.includes(t) : null;
}
var ge = e(() => {}),
  _e = t((e, t) => {
    (function (e) {
      let n = `(0?\\d+|0x[a-f0-9]+)`,
        r = {
          fourOctet: RegExp(`^${n}\\.${n}\\.${n}\\.${n}$`, `i`),
          threeOctet: RegExp(`^${n}\\.${n}\\.${n}$`, `i`),
          twoOctet: RegExp(`^${n}\\.${n}$`, `i`),
          longValue: RegExp(`^${n}$`, `i`),
        },
        i = RegExp(`^0[0-7]+$`, `i`),
        a = RegExp(`^0x[a-f0-9]+$`, `i`),
        o = `%[0-9a-z]{1,}`,
        s = `(?:[0-9a-f]+::?)+`,
        c = {
          zoneIndex: RegExp(o, `i`),
          native: RegExp(`^(::)?(${s})?([0-9a-f]+)?(::)?(${o})?$`, `i`),
          deprecatedTransitional: RegExp(`^(?:::)(${n}\\.${n}\\.${n}\\.${n}(${o})?)$`, `i`),
          transitional: RegExp(`^((?:${s})|(?:::)(?:${s})?)${n}\\.${n}\\.${n}\\.${n}(${o})?$`, `i`),
        };
      function l(e, t) {
        if (e.indexOf(`::`) !== e.lastIndexOf(`::`)) return null;
        let n = 0,
          r = -1,
          i = (e.match(c.zoneIndex) || [])[0],
          a,
          o;
        for (
          i && ((i = i.substring(1)), (e = e.replace(/%.+$/, ``)));
          (r = e.indexOf(`:`, r + 1)) >= 0;
        )
          n++;
        if ((e.substr(0, 2) === `::` && n--, e.substr(-2, 2) === `::` && n--, n > t)) return null;
        for (o = t - n, a = `:`; o--;) a += `0:`;
        return (
          (e = e.replace(`::`, a)),
          e[0] === `:` && (e = e.slice(1)),
          e[e.length - 1] === `:` && (e = e.slice(0, -1)),
          (t = (function () {
            let t = e.split(`:`),
              n = [];
            for (let e = 0; e < t.length; e++) n.push(parseInt(t[e], 16));
            return n;
          })()),
          { parts: t, zoneId: i }
        );
      }
      function u(e, t, n, r) {
        if (e.length !== t.length)
          throw Error(`ipaddr: cannot match CIDR for objects with different lengths`);
        let i = 0,
          a;
        for (; r > 0;) {
          if (((a = n - r), a < 0 && (a = 0), e[i] >> a !== t[i] >> a)) return !1;
          ((r -= n), (i += 1));
        }
        return !0;
      }
      function d(e) {
        if (a.test(e)) return parseInt(e, 16);
        if (e[0] === `0` && !isNaN(parseInt(e[1], 10))) {
          if (i.test(e)) return parseInt(e, 8);
          throw Error(`ipaddr: cannot parse ${e} as octal`);
        }
        return parseInt(e, 10);
      }
      function f(e, t) {
        for (; e.length < t;) e = `0${e}`;
        return e;
      }
      let p = {};
      ((p.IPv4 = (function () {
        function e(e) {
          if (e.length !== 4) throw Error(`ipaddr: ipv4 octet count should be 4`);
          let t, n;
          for (t = 0; t < e.length; t++)
            if (((n = e[t]), !(0 <= n && n <= 255)))
              throw Error(`ipaddr: ipv4 octet should fit in 8 bits`);
          this.octets = e;
        }
        return (
          (e.prototype.SpecialRanges = {
            unspecified: [[new e([0, 0, 0, 0]), 8]],
            broadcast: [[new e([255, 255, 255, 255]), 32]],
            multicast: [[new e([224, 0, 0, 0]), 4]],
            linkLocal: [[new e([169, 254, 0, 0]), 16]],
            loopback: [[new e([127, 0, 0, 0]), 8]],
            carrierGradeNat: [[new e([100, 64, 0, 0]), 10]],
            private: [
              [new e([10, 0, 0, 0]), 8],
              [new e([172, 16, 0, 0]), 12],
              [new e([192, 168, 0, 0]), 16],
            ],
            reserved: [
              [new e([192, 0, 0, 0]), 24],
              [new e([192, 0, 2, 0]), 24],
              [new e([192, 88, 99, 0]), 24],
              [new e([198, 18, 0, 0]), 15],
              [new e([198, 51, 100, 0]), 24],
              [new e([203, 0, 113, 0]), 24],
              [new e([240, 0, 0, 0]), 4],
            ],
            as112: [
              [new e([192, 175, 48, 0]), 24],
              [new e([192, 31, 196, 0]), 24],
            ],
            amt: [[new e([192, 52, 193, 0]), 24]],
          }),
          (e.prototype.kind = function () {
            return `ipv4`;
          }),
          (e.prototype.match = function (e, t) {
            let n;
            if ((t === void 0 && ((n = e), (e = n[0]), (t = n[1])), e.kind() !== `ipv4`))
              throw Error(`ipaddr: cannot match ipv4 address with non-ipv4 one`);
            return u(this.octets, e.octets, 8, t);
          }),
          (e.prototype.prefixLengthFromSubnetMask = function () {
            let e = 0,
              t = !1,
              n = { 0: 8, 128: 7, 192: 6, 224: 5, 240: 4, 248: 3, 252: 2, 254: 1, 255: 0 },
              r,
              i,
              a;
            for (r = 3; r >= 0; --r)
              if (((i = this.octets[r]), i in n)) {
                if (((a = n[i]), t && a !== 0)) return null;
                (a !== 8 && (t = !0), (e += a));
              } else return null;
            return 32 - e;
          }),
          (e.prototype.range = function () {
            return p.subnetMatch(this, this.SpecialRanges);
          }),
          (e.prototype.toByteArray = function () {
            return this.octets.slice(0);
          }),
          (e.prototype.toIPv4MappedAddress = function () {
            return p.IPv6.parse(`::ffff:${this.toString()}`);
          }),
          (e.prototype.toNormalizedString = function () {
            return this.toString();
          }),
          (e.prototype.toString = function () {
            return this.octets.join(`.`);
          }),
          e
        );
      })()),
        (p.IPv4.broadcastAddressFromCIDR = function (e) {
          try {
            let t = this.parseCIDR(e),
              n = t[0].toByteArray(),
              r = this.subnetMaskFromPrefixLength(t[1]).toByteArray(),
              i = [],
              a = 0;
            for (; a < 4;) (i.push(parseInt(n[a], 10) | (parseInt(r[a], 10) ^ 255)), a++);
            return new this(i);
          } catch {
            throw Error(`ipaddr: the address does not have IPv4 CIDR format`);
          }
        }),
        (p.IPv4.isIPv4 = function (e) {
          return this.parser(e) !== null;
        }),
        (p.IPv4.isValid = function (e) {
          try {
            return (new this(this.parser(e)), !0);
          } catch {
            return !1;
          }
        }),
        (p.IPv4.isValidCIDR = function (e) {
          try {
            return (this.parseCIDR(e), !0);
          } catch {
            return !1;
          }
        }),
        (p.IPv4.isValidFourPartDecimal = function (e) {
          return !!(p.IPv4.isValid(e) && e.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/));
        }),
        (p.IPv4.isValidCIDRFourPartDecimal = function (e) {
          let t = e.match(/^(.+)\/(\d+)$/);
          return !p.IPv4.isValidCIDR(e) || !t ? !1 : p.IPv4.isValidFourPartDecimal(t[1]);
        }),
        (p.IPv4.networkAddressFromCIDR = function (e) {
          let t, n, r, i, a;
          try {
            for (
              t = this.parseCIDR(e),
                r = t[0].toByteArray(),
                a = this.subnetMaskFromPrefixLength(t[1]).toByteArray(),
                i = [],
                n = 0;
              n < 4;
            )
              (i.push(parseInt(r[n], 10) & parseInt(a[n], 10)), n++);
            return new this(i);
          } catch {
            throw Error(`ipaddr: the address does not have IPv4 CIDR format`);
          }
        }),
        (p.IPv4.parse = function (e) {
          let t = this.parser(e);
          if (t === null) throw Error(`ipaddr: string is not formatted like an IPv4 Address`);
          return new this(t);
        }),
        (p.IPv4.parseCIDR = function (e) {
          let t;
          if ((t = e.match(/^(.+)\/(\d+)$/))) {
            let e = parseInt(t[2]);
            if (e >= 0 && e <= 32) {
              let n = [this.parse(t[1]), e];
              return (
                Object.defineProperty(n, "toString", {
                  value: function () {
                    return this.join(`/`);
                  },
                }),
                n
              );
            }
          }
          throw Error(`ipaddr: string is not formatted like an IPv4 CIDR range`);
        }),
        (p.IPv4.parser = function (e) {
          let t, n, i;
          if ((t = e.match(r.fourOctet)))
            return (function () {
              let e = t.slice(1, 6),
                r = [];
              for (let t = 0; t < e.length; t++) ((n = e[t]), r.push(d(n)));
              return r;
            })();
          if ((t = e.match(r.longValue))) {
            if (((i = d(t[1])), i > 4294967295 || i < 0))
              throw Error(`ipaddr: address outside defined range`);
            return (function () {
              let e = [],
                t;
              for (t = 0; t <= 24; t += 8) e.push((i >> t) & 255);
              return e;
            })().reverse();
          } else if ((t = e.match(r.twoOctet)))
            return (function () {
              let e = t.slice(1, 4),
                n = [];
              if (((i = d(e[1])), i > 16777215 || i < 0))
                throw Error(`ipaddr: address outside defined range`);
              return (
                n.push(d(e[0])), n.push((i >> 16) & 255), n.push((i >> 8) & 255), n.push(i & 255), n
              );
            })();
          else if ((t = e.match(r.threeOctet)))
            return (function () {
              let e = t.slice(1, 5),
                n = [];
              if (((i = d(e[2])), i > 65535 || i < 0))
                throw Error(`ipaddr: address outside defined range`);
              return (n.push(d(e[0])), n.push(d(e[1])), n.push((i >> 8) & 255), n.push(i & 255), n);
            })();
          else return null;
        }),
        (p.IPv4.subnetMaskFromPrefixLength = function (e) {
          if (((e = parseInt(e)), e < 0 || e > 32))
            throw Error(`ipaddr: invalid IPv4 prefix length`);
          let t = [0, 0, 0, 0],
            n = 0,
            r = Math.floor(e / 8);
          for (; n < r;) ((t[n] = 255), n++);
          return (r < 4 && (t[r] = (2 ** (e % 8) - 1) << (8 - (e % 8))), new this(t));
        }),
        (p.IPv6 = (function () {
          function e(e, t) {
            let n, r;
            if (e.length === 16)
              for (this.parts = [], n = 0; n <= 14; n += 2) this.parts.push((e[n] << 8) | e[n + 1]);
            else if (e.length === 8) this.parts = e;
            else throw Error(`ipaddr: ipv6 part count should be 8 or 16`);
            for (n = 0; n < this.parts.length; n++)
              if (((r = this.parts[n]), !(0 <= r && r <= 65535)))
                throw Error(`ipaddr: ipv6 part should fit in 16 bits`);
            t && (this.zoneId = t);
          }
          return (
            (e.prototype.SpecialRanges = {
              unspecified: [new e([0, 0, 0, 0, 0, 0, 0, 0]), 128],
              linkLocal: [new e([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
              multicast: [new e([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
              loopback: [new e([0, 0, 0, 0, 0, 0, 0, 1]), 128],
              uniqueLocal: [new e([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
              ipv4Mapped: [new e([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
              deprecatedSiteLocal: [new e([65216, 0, 0, 0, 0, 0, 0, 0]), 10],
              discard: [new e([256, 0, 0, 0, 0, 0, 0, 0]), 64],
              rfc6145: [new e([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
              rfc6052: [
                [new e([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
                [new e([100, 65435, 1, 0, 0, 0, 0, 0]), 48],
              ],
              "6to4": [new e([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
              teredo: [new e([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
              benchmarking: [new e([8193, 2, 0, 0, 0, 0, 0, 0]), 48],
              amt: [new e([8193, 3, 0, 0, 0, 0, 0, 0]), 32],
              as112v6: [
                [new e([8193, 4, 274, 0, 0, 0, 0, 0]), 48],
                [new e([9760, 79, 32768, 0, 0, 0, 0, 0]), 48],
              ],
              deprecatedOrchid: [new e([8193, 16, 0, 0, 0, 0, 0, 0]), 28],
              orchid2: [new e([8193, 32, 0, 0, 0, 0, 0, 0]), 28],
              droneRemoteIdProtocolEntityTags: [new e([8193, 48, 0, 0, 0, 0, 0, 0]), 28],
              segmentRouting: [new e([24320, 0, 0, 0, 0, 0, 0, 0]), 16],
              reserved: [
                [new e([8193, 0, 0, 0, 0, 0, 0, 0]), 23],
                [new e([8193, 3512, 0, 0, 0, 0, 0, 0]), 32],
                [new e([16383, 0, 0, 0, 0, 0, 0, 0]), 20],
              ],
            }),
            (e.prototype.isIPv4MappedAddress = function () {
              return this.range() === `ipv4Mapped`;
            }),
            (e.prototype.kind = function () {
              return `ipv6`;
            }),
            (e.prototype.match = function (e, t) {
              let n;
              if ((t === void 0 && ((n = e), (e = n[0]), (t = n[1])), e.kind() !== `ipv6`))
                throw Error(`ipaddr: cannot match ipv6 address with non-ipv6 one`);
              return u(this.parts, e.parts, 16, t);
            }),
            (e.prototype.prefixLengthFromSubnetMask = function () {
              let e = 0,
                t = !1,
                n = {
                  0: 16,
                  32768: 15,
                  49152: 14,
                  57344: 13,
                  61440: 12,
                  63488: 11,
                  64512: 10,
                  65024: 9,
                  65280: 8,
                  65408: 7,
                  65472: 6,
                  65504: 5,
                  65520: 4,
                  65528: 3,
                  65532: 2,
                  65534: 1,
                  65535: 0,
                },
                r,
                i;
              for (let a = 7; a >= 0; --a)
                if (((r = this.parts[a]), r in n)) {
                  if (((i = n[r]), t && i !== 0)) return null;
                  (i !== 16 && (t = !0), (e += i));
                } else return null;
              return 128 - e;
            }),
            (e.prototype.range = function () {
              return p.subnetMatch(this, this.SpecialRanges);
            }),
            (e.prototype.toByteArray = function () {
              let e,
                t = [],
                n = this.parts;
              for (let r = 0; r < n.length; r++) ((e = n[r]), t.push(e >> 8), t.push(e & 255));
              return t;
            }),
            (e.prototype.toFixedLengthString = function () {
              let e = function () {
                  let e = [];
                  for (let t = 0; t < this.parts.length; t++)
                    e.push(f(this.parts[t].toString(16), 4));
                  return e;
                }
                  .call(this)
                  .join(`:`),
                t = ``;
              return (this.zoneId && (t = `%${this.zoneId}`), e + t);
            }),
            (e.prototype.toIPv4Address = function () {
              if (!this.isIPv4MappedAddress())
                throw Error(`ipaddr: trying to convert a generic ipv6 address to ipv4`);
              let e = this.parts.slice(-2),
                t = e[0],
                n = e[1];
              return new p.IPv4([t >> 8, t & 255, n >> 8, n & 255]);
            }),
            (e.prototype.toNormalizedString = function () {
              let e = function () {
                  let e = [];
                  for (let t = 0; t < this.parts.length; t++) e.push(this.parts[t].toString(16));
                  return e;
                }
                  .call(this)
                  .join(`:`),
                t = ``;
              return (this.zoneId && (t = `%${this.zoneId}`), e + t);
            }),
            (e.prototype.toRFC5952String = function () {
              let e = /((^|:)(0(:|$)){2,})/g,
                t = this.toNormalizedString(),
                n = 0,
                r = -1,
                i;
              for (; (i = e.exec(t));) i[0].length > r && ((n = i.index), (r = i[0].length));
              return r < 0 ? t : `${t.substring(0, n)}::${t.substring(n + r)}`;
            }),
            (e.prototype.toString = function () {
              return this.toRFC5952String();
            }),
            e
          );
        })()),
        (p.IPv6.broadcastAddressFromCIDR = function (e) {
          try {
            let t = this.parseCIDR(e),
              n = t[0].toByteArray(),
              r = this.subnetMaskFromPrefixLength(t[1]).toByteArray(),
              i = [],
              a = 0;
            for (; a < 16;) (i.push(parseInt(n[a], 10) | (parseInt(r[a], 10) ^ 255)), a++);
            return new this(i);
          } catch (e) {
            throw Error(`ipaddr: the address does not have IPv6 CIDR format (${e})`);
          }
        }),
        (p.IPv6.isIPv6 = function (e) {
          return this.parser(e) !== null;
        }),
        (p.IPv6.isValid = function (e) {
          if (typeof e == `string` && e.indexOf(`:`) === -1) return !1;
          try {
            let t = this.parser(e);
            return (new this(t.parts, t.zoneId), !0);
          } catch {
            return !1;
          }
        }),
        (p.IPv6.isValidCIDR = function (e) {
          if (typeof e == `string` && e.indexOf(`:`) === -1) return !1;
          try {
            return (this.parseCIDR(e), !0);
          } catch {
            return !1;
          }
        }),
        (p.IPv6.networkAddressFromCIDR = function (e) {
          let t, n, r, i, a;
          try {
            for (
              t = this.parseCIDR(e),
                r = t[0].toByteArray(),
                a = this.subnetMaskFromPrefixLength(t[1]).toByteArray(),
                i = [],
                n = 0;
              n < 16;
            )
              (i.push(parseInt(r[n], 10) & parseInt(a[n], 10)), n++);
            return new this(i);
          } catch (e) {
            throw Error(`ipaddr: the address does not have IPv6 CIDR format (${e})`);
          }
        }),
        (p.IPv6.parse = function (e) {
          let t = this.parser(e);
          if (t.parts === null) throw Error(`ipaddr: string is not formatted like an IPv6 Address`);
          return new this(t.parts, t.zoneId);
        }),
        (p.IPv6.parseCIDR = function (e) {
          let t, n, r;
          if ((n = e.match(/^(.+)\/(\d+)$/)) && ((t = parseInt(n[2])), t >= 0 && t <= 128))
            return (
              (r = [this.parse(n[1]), t]),
              Object.defineProperty(r, "toString", {
                value: function () {
                  return this.join(`/`);
                },
              }),
              r
            );
          throw Error(`ipaddr: string is not formatted like an IPv6 CIDR range`);
        }),
        (p.IPv6.parser = function (e) {
          let t, n, r, i, a, o;
          if ((r = e.match(c.deprecatedTransitional))) return this.parser(`::ffff:${r[1]}`);
          if (c.native.test(e)) return l(e, 8);
          if (
            (r = e.match(c.transitional)) &&
            ((o = r[6] || ``),
            (t = r[1]),
            r[1].endsWith(`::`) || (t = t.slice(0, -1)),
            (t = l(t + o, 6)),
            t.parts)
          ) {
            for (
              a = [parseInt(r[2]), parseInt(r[3]), parseInt(r[4]), parseInt(r[5])], n = 0;
              n < a.length;
              n++
            )
              if (((i = a[n]), !(0 <= i && i <= 255))) return null;
            return (
              t.parts.push((a[0] << 8) | a[1]),
              t.parts.push((a[2] << 8) | a[3]),
              { parts: t.parts, zoneId: t.zoneId }
            );
          }
          return null;
        }),
        (p.IPv6.subnetMaskFromPrefixLength = function (e) {
          if (((e = parseInt(e)), e < 0 || e > 128))
            throw Error(`ipaddr: invalid IPv6 prefix length`);
          let t = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            n = 0,
            r = Math.floor(e / 8);
          for (; n < r;) ((t[n] = 255), n++);
          return (r < 16 && (t[r] = (2 ** (e % 8) - 1) << (8 - (e % 8))), new this(t));
        }),
        (p.fromByteArray = function (e) {
          let t = e.length;
          if (t === 4) return new p.IPv4(e);
          if (t === 16) return new p.IPv6(e);
          throw Error(`ipaddr: the binary input is neither an IPv6 nor IPv4 address`);
        }),
        (p.isValid = function (e) {
          return p.IPv6.isValid(e) || p.IPv4.isValid(e);
        }),
        (p.isValidCIDR = function (e) {
          return p.IPv6.isValidCIDR(e) || p.IPv4.isValidCIDR(e);
        }),
        (p.parse = function (e) {
          if (p.IPv6.isValid(e)) return p.IPv6.parse(e);
          if (p.IPv4.isValid(e)) return p.IPv4.parse(e);
          throw Error(`ipaddr: the address has neither IPv6 nor IPv4 format`);
        }),
        (p.parseCIDR = function (e) {
          try {
            return p.IPv6.parseCIDR(e);
          } catch {
            try {
              return p.IPv4.parseCIDR(e);
            } catch {
              throw Error(`ipaddr: the address has neither IPv6 nor IPv4 CIDR format`);
            }
          }
        }),
        (p.process = function (e) {
          let t = this.parse(e);
          return t.kind() === `ipv6` && t.isIPv4MappedAddress() ? t.toIPv4Address() : t;
        }),
        (p.subnetMatch = function (e, t, n) {
          let r, i, a, o;
          for (i in ((n ??= `unicast`), t))
            if (Object.prototype.hasOwnProperty.call(t, i)) {
              for (
                a = t[i], a[0] && !(a[0] instanceof Array) && (a = [a]), r = 0;
                r < a.length;
                r++
              )
                if (((o = a[r]), e.kind() === o[0].kind() && e.match.apply(e, o))) return i;
            }
          return n;
        }),
        t !== void 0 && t.exports ? (t.exports = p) : (e.ipaddr = p));
    })(e);
  });
export { me as a, ie as i, ge as n, se as o, he as r, ue as s, _e as t };
//# sourceMappingURL=gateway-runtime-D6zABMsO.js.map
