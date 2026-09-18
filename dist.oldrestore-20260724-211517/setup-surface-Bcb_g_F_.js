import {
  a as listCombinedAccountIds,
  s as resolveListedDefaultAccountId,
} from "./account-helpers-BAtt8fRD.js";
import {
  n as normalizeAccountId,
  r as normalizeOptionalAccountId,
  t as DEFAULT_ACCOUNT_ID,
} from "./account-id-C7N4Rwku.js";
import {
  $ as randomBytes,
  B as createHmacDrbg,
  C as negateCt,
  D as getMinHashLength,
  E as Field,
  F as bitLen,
  G as sha256,
  I as bitMask,
  J as ahash,
  L as bytesToNumberBE,
  M as aInRange,
  N as abool,
  P as asciiToBytes,
  Q as isBytes$1,
  S as mulEndoUnsafe,
  T as wNAF,
  U as numberToHexUnpadded,
  V as memoized,
  W as validateObject,
  X as concatBytes,
  Y as bytesToHex,
  Z as hexToBytes,
  b as createCurveFields,
  c as aexists,
  d as checkOpts,
  f as clean,
  g as u32,
  i as cbc,
  j as pow2,
  k as mapHashToField,
  l as anumber$1,
  m as equalBytes,
  n as extract,
  o as abool$1,
  p as copyBytes,
  q as abytes$1,
  s as abytes$2,
  t as expand,
  u as aoutput,
  w as normalizeZ,
  x as createKeygen,
  y as hmac,
} from "./hkdf-CTfM9HGH.js";
import { t as createSetupTranslator } from "./i18n-BDUMKn0X.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import "./string-coerce-runtime-BUe4iD0r.js";
import "./routing-CwvmVRHd.js";
import "./secret-input-D1aG0n6v.js";
import {
  i as DEFAULT_RELAYS,
  n as createNostrSetupAdapter,
  r as parseRelayUrls,
  t as buildNostrSetupPatch,
} from "./setup-adapter-BeDn7fu4.js";
import {
  D as patchTopLevelChannelConfigSection,
  _ as createTopLevelChannelParsedAllowFromPrompt,
  f as createStandardChannelSetupStatus,
  m as createTopLevelChannelDmPolicy,
  v as mergeAllowFromEntries,
  w as parseSetupEntriesWithParser,
} from "./setup-wizard-helpers-Kz9xlQ7e.js";
import "./setup-CM3hyaUe.js";
import "./account-resolution-DijsTQIy.js";
import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import {
  c as hasConfiguredSecretInput,
  p as normalizeSecretInputString,
} from "./types.secrets-BV0ywRAy.js";
//#region node_modules/@noble/curves/abstract/weierstrass.js
/**
 * Short Weierstrass curve methods. The formula is: y² = x³ + ax + b.
 *
 * ### Design rationale for types
 *
 * * Interaction between classes from different curves should fail:
 *   `k256.Point.BASE.add(p256.Point.BASE)`
 * * For this purpose we want to use `instanceof` operator, which is fast and works during runtime
 * * Different calls of `curve()` would return different classes -
 *   `curve(params) !== curve(params)`: if somebody decided to monkey-patch their curve,
 *   it won't affect others
 *
 * TypeScript can't infer types for classes created inside a function. Classes is one instance
 * of nominative types in TypeScript and interfaces only check for shape, so it's hard to create
 * unique type for every function call.
 *
 * We can use generic types via some param, like curve opts, but that would:
 *     1. Enable interaction between `curve(params)` and `curve(params)` (curves of same params)
 *     which is hard to debug.
 *     2. Params can be generic and we can't enforce them to be constant value:
 *     if somebody creates curve from non-constant params,
 *     it would be allowed to interact with other curves with non-constant params
 *
 * @todo https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#unique-symbol
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const divNearest = (num, den) => (num + (num >= 0 ? den : -den) / _2n$1) / den;
/**
 * Splits scalar for GLV endomorphism.
 */
function _splitEndoScalar(k, basis, n) {
  const [[a1, b1], [a2, b2]] = basis;
  const c1 = divNearest(b2 * k, n);
  const c2 = divNearest(-b1 * k, n);
  let k1 = k - c1 * a1 - c2 * a2;
  let k2 = -c1 * b1 - c2 * b2;
  const k1neg = k1 < _0n$1;
  const k2neg = k2 < _0n$1;
  if (k1neg) k1 = -k1;
  if (k2neg) k2 = -k2;
  const MAX_NUM = bitMask(Math.ceil(bitLen(n) / 2)) + _1n;
  if (k1 < _0n$1 || k1 >= MAX_NUM || k2 < _0n$1 || k2 >= MAX_NUM)
    throw new Error("splitScalar (endomorphism): failed, k=" + k);
  return {
    k1neg,
    k1,
    k2neg,
    k2,
  };
}
function validateSigFormat(format) {
  if (!["compact", "recovered", "der"].includes(format))
    throw new Error('Signature format must be "compact", "recovered", or "der"');
  return format;
}
function validateSigOpts(opts, def) {
  const optsn = {};
  for (let optName of Object.keys(def))
    optsn[optName] = opts[optName] === void 0 ? def[optName] : opts[optName];
  abool(optsn.lowS, "lowS");
  abool(optsn.prehash, "prehash");
  if (optsn.format !== void 0) validateSigFormat(optsn.format);
  return optsn;
}
var DERErr = class extends Error {
  constructor(m = "") {
    super(m);
  }
};
/**
 * ASN.1 DER encoding utilities. ASN is very complex & fragile. Format:
 *
 *     [0x30 (SEQUENCE), bytelength, 0x02 (INTEGER), intLength, R, 0x02 (INTEGER), intLength, S]
 *
 * Docs: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/, https://luca.ntop.org/Teaching/Appunti/asn1.html
 */
const DER = {
  Err: DERErr,
  _tlv: {
    encode: (tag, data) => {
      const { Err: E } = DER;
      if (tag < 0 || tag > 256) throw new E("tlv.encode: wrong tag");
      if (data.length & 1) throw new E("tlv.encode: unpadded data");
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if ((len.length / 2) & 128) throw new E("tlv.encode: long form length too big");
      const lenLen = dataLen > 127 ? numberToHexUnpadded((len.length / 2) | 128) : "";
      return numberToHexUnpadded(tag) + lenLen + len + data;
    },
    decode(tag, data) {
      const { Err: E } = DER;
      let pos = 0;
      if (tag < 0 || tag > 256) throw new E("tlv.encode: wrong tag");
      if (data.length < 2 || data[pos++] !== tag) throw new E("tlv.decode: wrong tlv");
      const first = data[pos++];
      const isLong = !!(first & 128);
      let length = 0;
      if (!isLong) length = first;
      else {
        const lenLen = first & 127;
        if (!lenLen) throw new E("tlv.decode(long): indefinite length not supported");
        if (lenLen > 4) throw new E("tlv.decode(long): byte length is too big");
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen) throw new E("tlv.decode: length bytes not complete");
        if (lengthBytes[0] === 0) throw new E("tlv.decode(long): zero leftmost byte");
        for (const b of lengthBytes) length = (length << 8) | b;
        pos += lenLen;
        if (length < 128) throw new E("tlv.decode(long): not minimal encoding");
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length) throw new E("tlv.decode: wrong value length");
      return {
        v,
        l: data.subarray(pos + length),
      };
    },
  },
  _int: {
    encode(num) {
      const { Err: E } = DER;
      if (num < _0n$1) throw new E("integer: negative integers are not allowed");
      let hex = numberToHexUnpadded(num);
      if (Number.parseInt(hex[0], 16) & 8) hex = "00" + hex;
      if (hex.length & 1) throw new E("unexpected DER parsing assertion: unpadded hex");
      return hex;
    },
    decode(data) {
      const { Err: E } = DER;
      if (data[0] & 128) throw new E("invalid signature integer: negative");
      if (data[0] === 0 && !(data[1] & 128))
        throw new E("invalid signature integer: unnecessary leading zero");
      return bytesToNumberBE(data);
    },
  },
  toSig(bytes) {
    const { Err: E, _int: int, _tlv: tlv } = DER;
    const data = abytes$1(bytes, void 0, "signature");
    const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
    if (seqLeftBytes.length) throw new E("invalid signature: left bytes after parsing");
    const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
    const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
    if (sLeftBytes.length) throw new E("invalid signature: left bytes after parsing");
    return {
      r: int.decode(rBytes),
      s: int.decode(sBytes),
    };
  },
  hexFromSig(sig) {
    const { _tlv: tlv, _int: int } = DER;
    const seq = tlv.encode(2, int.encode(sig.r)) + tlv.encode(2, int.encode(sig.s));
    return tlv.encode(48, seq);
  },
};
const _0n$1 = BigInt(0),
  _1n = BigInt(1),
  _2n$1 = BigInt(2),
  _3n = BigInt(3),
  _4n = BigInt(4);
/**
* Creates weierstrass Point constructor, based on specified curve options.
*
* See {@link WeierstrassOpts}.
*
* @example
```js
const opts = {
p: 0xfffffffffffffffffffffffffffffffeffffac73n,
n: 0x100000000000000000001b8fa16dfab9aca16b6b3n,
h: 1n,
a: 0n,
b: 7n,
Gx: 0x3b4c382ce37aa192a4019e763036f4f5dd4d7ebbn,
Gy: 0x938cf935318fdced6bc28286531733c3f03c4feen,
};
const secp160k1_Point = weierstrass(opts);
```
*/
function weierstrass(params, extraOpts = {}) {
  const validated = createCurveFields("weierstrass", params, extraOpts);
  const { Fp, Fn } = validated;
  let CURVE = validated.CURVE;
  const { h: cofactor, n: CURVE_ORDER } = CURVE;
  validateObject(
    extraOpts,
    {},
    {
      allowInfinityPoint: "boolean",
      clearCofactor: "function",
      isTorsionFree: "function",
      fromBytes: "function",
      toBytes: "function",
      endo: "object",
    },
  );
  const { endo } = extraOpts;
  if (endo) {
    if (!Fp.is0(CURVE.a) || typeof endo.beta !== "bigint" || !Array.isArray(endo.basises))
      throw new Error('invalid endo: expected "beta": bigint and "basises": array');
  }
  const lengths = getWLengths(Fp, Fn);
  function assertCompressionIsSupported() {
    if (!Fp.isOdd) throw new Error("compression is not supported: Field does not have .isOdd()");
  }
  function pointToBytes(_c, point, isCompressed) {
    const { x, y } = point.toAffine();
    const bx = Fp.toBytes(x);
    abool(isCompressed, "isCompressed");
    if (isCompressed) {
      assertCompressionIsSupported();
      return concatBytes(pprefix(!Fp.isOdd(y)), bx);
    } else return concatBytes(Uint8Array.of(4), bx, Fp.toBytes(y));
  }
  function pointFromBytes(bytes) {
    abytes$1(bytes, void 0, "Point");
    const { publicKey: comp, publicKeyUncompressed: uncomp } = lengths;
    const length = bytes.length;
    const head = bytes[0];
    const tail = bytes.subarray(1);
    if (length === comp && (head === 2 || head === 3)) {
      const x = Fp.fromBytes(tail);
      if (!Fp.isValid(x)) throw new Error("bad point: is not on curve, wrong x");
      const y2 = weierstrassEquation(x);
      let y;
      try {
        y = Fp.sqrt(y2);
      } catch (sqrtError) {
        const err = sqrtError instanceof Error ? ": " + sqrtError.message : "";
        throw new Error("bad point: is not on curve, sqrt error" + err);
      }
      assertCompressionIsSupported();
      const evenY = Fp.isOdd(y);
      if (((head & 1) === 1) !== evenY) y = Fp.neg(y);
      return {
        x,
        y,
      };
    } else if (length === uncomp && head === 4) {
      const L = Fp.BYTES;
      const x = Fp.fromBytes(tail.subarray(0, L));
      const y = Fp.fromBytes(tail.subarray(L, L * 2));
      if (!isValidXY(x, y)) throw new Error("bad point: is not on curve");
      return {
        x,
        y,
      };
    } else
      throw new Error(
        `bad point: got length ${length}, expected compressed=${comp} or uncompressed=${uncomp}`,
      );
  }
  const encodePoint = extraOpts.toBytes || pointToBytes;
  const decodePoint = extraOpts.fromBytes || pointFromBytes;
  function weierstrassEquation(x) {
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, CURVE.a)), CURVE.b);
  }
  /** Checks whether equation holds for given x, y: y² == x³ + ax + b */
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy)) throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n), _4n);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2))) throw new Error("bad curve params: a or b");
  /** Asserts coordinate is valid: 0 <= n < Fp.ORDER. */
  function acoord(title, n, banZero = false) {
    if (!Fp.isValid(n) || (banZero && Fp.is0(n))) throw new Error(`bad point coordinate ${title}`);
    return n;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point)) throw new Error("Weierstrass Point expected");
  }
  function splitEndoScalarN(k) {
    if (!endo || !endo.basises) throw new Error("no endo");
    return _splitEndoScalar(k, endo.basises, Fn.ORDER);
  }
  const toAffineMemo = memoized((p, iz) => {
    const { X, Y, Z } = p;
    if (Fp.eql(Z, Fp.ONE))
      return {
        x: X,
        y: Y,
      };
    const is0 = p.is0();
    if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(Z);
    const x = Fp.mul(X, iz);
    const y = Fp.mul(Y, iz);
    const zz = Fp.mul(Z, iz);
    if (is0)
      return {
        x: Fp.ZERO,
        y: Fp.ZERO,
      };
    if (!Fp.eql(zz, Fp.ONE)) throw new Error("invZ was invalid");
    return {
      x,
      y,
    };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (extraOpts.allowInfinityPoint && !Fp.is0(p.Y)) return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error("bad point: x or y not field elements");
    if (!isValidXY(x, y)) throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree()) throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  function finishEndo(endoBeta, k1p, k2p, k1neg, k2neg) {
    k2p = new Point(Fp.mul(k2p.X, endoBeta), k2p.Y, k2p.Z);
    k1p = negateCt(k1neg, k1p);
    k2p = negateCt(k2neg, k2p);
    return k1p.add(k2p);
  }
  /**
   * Projective Point works in 3d / projective (homogeneous) coordinates:(X, Y, Z) ∋ (x=X/Z, y=Y/Z).
   * Default Point works in 2d / affine coordinates: (x, y).
   * We're doing calculations in projective, because its operations don't require costly inversion.
   */
  class Point {
    static BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
    static ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
    static Fp = Fp;
    static Fn = Fn;
    X;
    Y;
    Z;
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    constructor(X, Y, Z) {
      this.X = acoord("x", X);
      this.Y = acoord("y", Y, true);
      this.Z = acoord("z", Z);
      Object.freeze(this);
    }
    static CURVE() {
      return CURVE;
    }
    /** Does NOT validate if the point is valid. Use `.assertValidity()`. */
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error("invalid affine point");
      if (p instanceof Point) throw new Error("projective point not allowed");
      if (Fp.is0(x) && Fp.is0(y)) return Point.ZERO;
      return new Point(x, y, Fp.ONE);
    }
    static fromBytes(bytes) {
      const P = Point.fromAffine(decodePoint(abytes$1(bytes, void 0, "point")));
      P.assertValidity();
      return P;
    }
    static fromHex(hex) {
      return Point.fromBytes(hexToBytes(hex));
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     *
     * @param windowSize
     * @param isLazy true will defer table computation until the first multiplication
     * @returns
     */
    precompute(windowSize = 8, isLazy = true) {
      wnaf.createCache(this, windowSize);
      if (!isLazy) this.multiply(_3n);
      return this;
    }
    /** A point on curve is valid if it conforms to equation. */
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (!Fp.isOdd) throw new Error("Field doesn't support isOdd");
      return !Fp.isOdd(y);
    }
    /** Compare one point to another. */
    equals(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /** Flips point to one corresponding to (x, -y) in Affine coordinates. */
    negate() {
      return new Point(this.X, Fp.neg(this.Y), this.Z);
    }
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      let X3 = Fp.ZERO,
        Y3 = Fp.ZERO,
        Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    add(other) {
      aprjpoint(other);
      const { X: X1, Y: Y1, Z: Z1 } = this;
      const { X: X2, Y: Y2, Z: Z2 } = other;
      let X3 = Fp.ZERO,
        Y3 = Fp.ZERO,
        Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo } = extraOpts;
      if (!Fn.isValidNot0(scalar)) throw new Error("invalid scalar: out of range");
      let point, fake;
      const mul = (n) => wnaf.cached(this, n, (p) => normalizeZ(Point, p));
      /** See docs for {@link EndomorphismOpts} */
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(scalar);
        const { p: k1p, f: k1f } = mul(k1);
        const { p: k2p, f: k2f } = mul(k2);
        fake = k1f.add(k2f);
        point = finishEndo(endo.beta, k1p, k2p, k1neg, k2neg);
      } else {
        const { p, f } = mul(scalar);
        point = p;
        fake = f;
      }
      return normalizeZ(Point, [point, fake])[0];
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed secret key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo } = extraOpts;
      const p = this;
      if (!Fn.isValid(sc)) throw new Error("invalid scalar: out of range");
      if (sc === _0n$1 || p.is0()) return Point.ZERO;
      if (sc === _1n) return p;
      if (wnaf.hasCache(this)) return this.multiply(sc);
      if (endo) {
        const { k1neg, k1, k2neg, k2 } = splitEndoScalarN(sc);
        const { p1, p2 } = mulEndoUnsafe(Point, p, k1, k2);
        return finishEndo(endo.beta, p1, p2, k1neg, k2neg);
      } else return wnaf.unsafe(p, sc);
    }
    /**
     * Converts Projective point to affine (x, y) coordinates.
     * @param invertedZ Z^-1 (inverted zero) - optional, precomputation is useful for invertBatch
     */
    toAffine(invertedZ) {
      return toAffineMemo(this, invertedZ);
    }
    /**
     * Checks whether Point is free of torsion elements (is in prime subgroup).
     * Always torsion-free for cofactor=1 curves.
     */
    isTorsionFree() {
      const { isTorsionFree } = extraOpts;
      if (cofactor === _1n) return true;
      if (isTorsionFree) return isTorsionFree(Point, this);
      return wnaf.unsafe(this, CURVE_ORDER).is0();
    }
    clearCofactor() {
      const { clearCofactor } = extraOpts;
      if (cofactor === _1n) return this;
      if (clearCofactor) return clearCofactor(Point, this);
      return this.multiplyUnsafe(cofactor);
    }
    isSmallOrder() {
      return this.multiplyUnsafe(cofactor).is0();
    }
    toBytes(isCompressed = true) {
      abool(isCompressed, "isCompressed");
      this.assertValidity();
      return encodePoint(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      return bytesToHex(this.toBytes(isCompressed));
    }
    toString() {
      return `<Point ${this.is0() ? "ZERO" : this.toHex()}>`;
    }
  }
  const bits = Fn.BITS;
  const wnaf = new wNAF(Point, extraOpts.endo ? Math.ceil(bits / 2) : bits);
  Point.BASE.precompute(8);
  return Point;
}
function pprefix(hasEvenY) {
  return Uint8Array.of(hasEvenY ? 2 : 3);
}
function getWLengths(Fp, Fn) {
  return {
    secretKey: Fn.BYTES,
    publicKey: 1 + Fp.BYTES,
    publicKeyUncompressed: 1 + 2 * Fp.BYTES,
    publicKeyHasPrefix: true,
    signature: 2 * Fn.BYTES,
  };
}
/**
 * Sometimes users only need getPublicKey, getSharedSecret, and secret key handling.
 * This helper ensures no signature functionality is present. Less code, smaller bundle size.
 */
function ecdh(Point, ecdhOpts = {}) {
  const { Fn } = Point;
  const randomBytes_ = ecdhOpts.randomBytes || randomBytes;
  const lengths = Object.assign(getWLengths(Point.Fp, Fn), { seed: getMinHashLength(Fn.ORDER) });
  function isValidSecretKey(secretKey) {
    try {
      const num = Fn.fromBytes(secretKey);
      return Fn.isValidNot0(num);
    } catch (error) {
      return false;
    }
  }
  function isValidPublicKey(publicKey, isCompressed) {
    const { publicKey: comp, publicKeyUncompressed } = lengths;
    try {
      const l = publicKey.length;
      if (isCompressed === true && l !== comp) return false;
      if (isCompressed === false && l !== publicKeyUncompressed) return false;
      return !!Point.fromBytes(publicKey);
    } catch (error) {
      return false;
    }
  }
  /**
   * Produces cryptographically secure secret key from random of size
   * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
   */
  function randomSecretKey(seed = randomBytes_(lengths.seed)) {
    return mapHashToField(abytes$1(seed, lengths.seed, "seed"), Fn.ORDER);
  }
  /**
   * Computes public key for a secret key. Checks for validity of the secret key.
   * @param isCompressed whether to return compact (default), or full key
   * @returns Public key, full when isCompressed=false; short when isCompressed=true
   */
  function getPublicKey(secretKey, isCompressed = true) {
    return Point.BASE.multiply(Fn.fromBytes(secretKey)).toBytes(isCompressed);
  }
  /**
   * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
   */
  function isProbPub(item) {
    const { secretKey, publicKey, publicKeyUncompressed } = lengths;
    if (!isBytes$1(item)) return void 0;
    if (("_lengths" in Fn && Fn._lengths) || secretKey === publicKey) return void 0;
    const l = abytes$1(item, void 0, "key").length;
    return l === publicKey || l === publicKeyUncompressed;
  }
  /**
   * ECDH (Elliptic Curve Diffie Hellman).
   * Computes shared public key from secret key A and public key B.
   * Checks: 1) secret key validity 2) shared key is on-curve.
   * Does NOT hash the result.
   * @param isCompressed whether to return compact (default), or full key
   * @returns shared public key
   */
  function getSharedSecret(secretKeyA, publicKeyB, isCompressed = true) {
    if (isProbPub(secretKeyA) === true) throw new Error("first arg must be private key");
    if (isProbPub(publicKeyB) === false) throw new Error("second arg must be public key");
    const s = Fn.fromBytes(secretKeyA);
    return Point.fromBytes(publicKeyB).multiply(s).toBytes(isCompressed);
  }
  const utils = {
    isValidSecretKey,
    isValidPublicKey,
    randomSecretKey,
  };
  const keygen = createKeygen(randomSecretKey, getPublicKey);
  return Object.freeze({
    getPublicKey,
    getSharedSecret,
    keygen,
    Point,
    utils,
    lengths,
  });
}
/**
 * Creates ECDSA signing interface for given elliptic curve `Point` and `hash` function.
 *
 * @param Point created using {@link weierstrass} function
 * @param hash used for 1) message prehash-ing 2) k generation in `sign`, using hmac_drbg(hash)
 * @param ecdsaOpts rarely needed, see {@link ECDSAOpts}
 *
 * @example
 * ```js
 * const p256_Point = weierstrass(...);
 * const p256_sha256 = ecdsa(p256_Point, sha256);
 * const p256_sha224 = ecdsa(p256_Point, sha224);
 * const p256_sha224_r = ecdsa(p256_Point, sha224, { randomBytes: (length) => { ... } });
 * ```
 */
function ecdsa(Point, hash, ecdsaOpts = {}) {
  ahash(hash);
  validateObject(
    ecdsaOpts,
    {},
    {
      hmac: "function",
      lowS: "boolean",
      randomBytes: "function",
      bits2int: "function",
      bits2int_modN: "function",
    },
  );
  ecdsaOpts = Object.assign({}, ecdsaOpts);
  const randomBytes$1 = ecdsaOpts.randomBytes || randomBytes;
  const hmac$1 = ecdsaOpts.hmac || ((key, msg) => hmac(hash, key, msg));
  const { Fp, Fn } = Point;
  const { ORDER: CURVE_ORDER, BITS: fnBits } = Fn;
  const { keygen, getPublicKey, getSharedSecret, utils, lengths } = ecdh(Point, ecdsaOpts);
  const defaultSigOpts = {
    prehash: true,
    lowS: typeof ecdsaOpts.lowS === "boolean" ? ecdsaOpts.lowS : true,
    format: "compact",
    extraEntropy: false,
  };
  const hasLargeCofactor = CURVE_ORDER * _2n$1 < Fp.ORDER;
  function isBiggerThanHalfOrder(number) {
    return number > CURVE_ORDER >> _1n;
  }
  function validateRS(title, num) {
    if (!Fn.isValidNot0(num))
      throw new Error(`invalid signature ${title}: out of range 1..Point.Fn.ORDER`);
    return num;
  }
  function assertSmallCofactor() {
    if (hasLargeCofactor)
      throw new Error('"recovered" sig type is not supported for cofactor >2 curves');
  }
  function validateSigLength(bytes, format) {
    validateSigFormat(format);
    const size = lengths.signature;
    return abytes$1(
      bytes,
      format === "compact" ? size : format === "recovered" ? size + 1 : void 0,
    );
  }
  /**
   * ECDSA signature with its (r, s) properties. Supports compact, recovered & DER representations.
   */
  class Signature {
    r;
    s;
    recovery;
    constructor(r, s, recovery) {
      this.r = validateRS("r", r);
      this.s = validateRS("s", s);
      if (recovery != null) {
        assertSmallCofactor();
        if (![0, 1, 2, 3].includes(recovery)) throw new Error("invalid recovery id");
        this.recovery = recovery;
      }
      Object.freeze(this);
    }
    static fromBytes(bytes, format = defaultSigOpts.format) {
      validateSigLength(bytes, format);
      let recid;
      if (format === "der") {
        const { r, s } = DER.toSig(abytes$1(bytes));
        return new Signature(r, s);
      }
      if (format === "recovered") {
        recid = bytes[0];
        format = "compact";
        bytes = bytes.subarray(1);
      }
      const L = lengths.signature / 2;
      const r = bytes.subarray(0, L);
      const s = bytes.subarray(L, L * 2);
      return new Signature(Fn.fromBytes(r), Fn.fromBytes(s), recid);
    }
    static fromHex(hex, format) {
      return this.fromBytes(hexToBytes(hex), format);
    }
    assertRecovery() {
      const { recovery } = this;
      if (recovery == null) throw new Error("invalid recovery id: must be present");
      return recovery;
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(messageHash) {
      const { r, s } = this;
      const recovery = this.assertRecovery();
      const radj = recovery === 2 || recovery === 3 ? r + CURVE_ORDER : r;
      if (!Fp.isValid(radj)) throw new Error("invalid recovery id: sig.r+curve.n != R.x");
      const x = Fp.toBytes(radj);
      const R = Point.fromBytes(concatBytes(pprefix((recovery & 1) === 0), x));
      const ir = Fn.inv(radj);
      const h = bits2int_modN(abytes$1(messageHash, void 0, "msgHash"));
      const u1 = Fn.create(-h * ir);
      const u2 = Fn.create(s * ir);
      const Q = Point.BASE.multiplyUnsafe(u1).add(R.multiplyUnsafe(u2));
      if (Q.is0()) throw new Error("invalid recovery: point at infinify");
      Q.assertValidity();
      return Q;
    }
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    toBytes(format = defaultSigOpts.format) {
      validateSigFormat(format);
      if (format === "der") return hexToBytes(DER.hexFromSig(this));
      const { r, s } = this;
      const rb = Fn.toBytes(r);
      const sb = Fn.toBytes(s);
      if (format === "recovered") {
        assertSmallCofactor();
        return concatBytes(Uint8Array.of(this.assertRecovery()), rb, sb);
      }
      return concatBytes(rb, sb);
    }
    toHex(format) {
      return bytesToHex(this.toBytes(format));
    }
  }
  const bits2int =
    ecdsaOpts.bits2int ||
    function bits2int_def(bytes) {
      if (bytes.length > 8192) throw new Error("input is too large");
      const num = bytesToNumberBE(bytes);
      const delta = bytes.length * 8 - fnBits;
      return delta > 0 ? num >> BigInt(delta) : num;
    };
  const bits2int_modN =
    ecdsaOpts.bits2int_modN ||
    function bits2int_modN_def(bytes) {
      return Fn.create(bits2int(bytes));
    };
  const ORDER_MASK = bitMask(fnBits);
  /** Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`. */
  function int2octets(num) {
    aInRange("num < 2^" + fnBits, num, _0n$1, ORDER_MASK);
    return Fn.toBytes(num);
  }
  function validateMsgAndHash(message, prehash) {
    abytes$1(message, void 0, "message");
    return prehash ? abytes$1(hash(message), void 0, "prehashed message") : message;
  }
  /**
   * Steps A, D of RFC6979 3.2.
   * Creates RFC6979 seed; converts msg/privKey to numbers.
   * Used only in sign, not in verify.
   *
   * Warning: we cannot assume here that message has same amount of bytes as curve order,
   * this will be invalid at least for P521. Also it can be bigger for P224 + SHA256.
   */
  function prepSig(message, secretKey, opts) {
    const { lowS, prehash, extraEntropy } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    const h1int = bits2int_modN(message);
    const d = Fn.fromBytes(secretKey);
    if (!Fn.isValidNot0(d)) throw new Error("invalid private key");
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (extraEntropy != null && extraEntropy !== false) {
      const e = extraEntropy === true ? randomBytes$1(lengths.secretKey) : extraEntropy;
      seedArgs.push(abytes$1(e, void 0, "extraEntropy"));
    }
    const seed = concatBytes(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!Fn.isValidNot0(k)) return;
      const ik = Fn.inv(k);
      const q = Point.BASE.multiply(k).toAffine();
      const r = Fn.create(q.x);
      if (r === _0n$1) return;
      const s = Fn.create(ik * Fn.create(m + r * d));
      if (s === _0n$1) return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = Fn.neg(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, hasLargeCofactor ? void 0 : recovery);
    }
    return {
      seed,
      k2sig,
    };
  }
  /**
   * Signs message hash with a secret key.
   *
   * ```
   * sign(m, d) where
   *   k = rfc6979_hmac_drbg(m, d)
   *   (x, y) = G × k
   *   r = x mod n
   *   s = (m + dr) / k mod n
   * ```
   */
  function sign(message, secretKey, opts = {}) {
    const { seed, k2sig } = prepSig(message, secretKey, opts);
    return createHmacDrbg(hash.outputLen, Fn.BYTES, hmac$1)(seed, k2sig).toBytes(opts.format);
  }
  /**
   * Verifies a signature against message and public key.
   * Rejects lowS signatures by default: see {@link ECDSAVerifyOpts}.
   * Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
   *
   * ```
   * verify(r, s, h, P) where
   *   u1 = hs^-1 mod n
   *   u2 = rs^-1 mod n
   *   R = u1⋅G + u2⋅P
   *   mod(R.x, n) == r
   * ```
   */
  function verify(signature, message, publicKey, opts = {}) {
    const { lowS, prehash, format } = validateSigOpts(opts, defaultSigOpts);
    publicKey = abytes$1(publicKey, void 0, "publicKey");
    message = validateMsgAndHash(message, prehash);
    if (!isBytes$1(signature)) {
      const end = signature instanceof Signature ? ", use sig.toBytes()" : "";
      throw new Error("verify expects Uint8Array signature" + end);
    }
    validateSigLength(signature, format);
    try {
      const sig = Signature.fromBytes(signature, format);
      const P = Point.fromBytes(publicKey);
      if (lowS && sig.hasHighS()) return false;
      const { r, s } = sig;
      const h = bits2int_modN(message);
      const is = Fn.inv(s);
      const u1 = Fn.create(h * is);
      const u2 = Fn.create(r * is);
      const R = Point.BASE.multiplyUnsafe(u1).add(P.multiplyUnsafe(u2));
      if (R.is0()) return false;
      return Fn.create(R.x) === r;
    } catch (e) {
      return false;
    }
  }
  function recoverPublicKey(signature, message, opts = {}) {
    const { prehash } = validateSigOpts(opts, defaultSigOpts);
    message = validateMsgAndHash(message, prehash);
    return Signature.fromBytes(signature, "recovered").recoverPublicKey(message).toBytes();
  }
  return Object.freeze({
    keygen,
    getPublicKey,
    getSharedSecret,
    utils,
    lengths,
    Point,
    sign,
    verify,
    recoverPublicKey,
    Signature,
    hash,
  });
}
//#endregion
//#region node_modules/@noble/curves/secp256k1.js
/**
 * SECG secp256k1. See [pdf](https://www.secg.org/sec2-v2.pdf).
 *
 * Belongs to Koblitz curves: it has efficiently-computable GLV endomorphism ψ,
 * check out {@link EndomorphismOpts}. Seems to be rigid (not backdoored).
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const secp256k1_CURVE = {
  p: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: BigInt(1),
  a: BigInt(0),
  b: BigInt(7),
  Gx: BigInt("0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798"),
  Gy: BigInt("0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"),
};
const secp256k1_ENDO = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  basises: [
    [BigInt("0x3086d221a7d46bcde86c90e49284eb15"), -BigInt("0xe4437ed6010e88286f547fa90abfe4c3")],
    [BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), BigInt("0x3086d221a7d46bcde86c90e49284eb15")],
  ],
};
const _0n = /* @__PURE__ */ BigInt(0);
const _2n = /* @__PURE__ */ BigInt(2);
/**
 * √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
 * (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
 */
function sqrtMod(y) {
  const P = secp256k1_CURVE.p;
  const _3n = BigInt(3),
    _6n = BigInt(6),
    _11n = BigInt(11),
    _22n = BigInt(22);
  const _23n = BigInt(23),
    _44n = BigInt(44),
    _88n = BigInt(88);
  const b2 = (y * y * y) % P;
  const b3 = (b2 * b2 * y) % P;
  const b11 = (pow2((pow2((pow2(b3, _3n, P) * b3) % P, _3n, P) * b3) % P, _2n, P) * b2) % P;
  const b22 = (pow2(b11, _11n, P) * b11) % P;
  const b44 = (pow2(b22, _22n, P) * b22) % P;
  const b88 = (pow2(b44, _44n, P) * b44) % P;
  const root = pow2(
    (pow2(
      (pow2(
        (pow2((pow2((pow2(b88, _88n, P) * b88) % P, _44n, P) * b44) % P, _3n, P) * b3) % P,
        _23n,
        P,
      ) *
        b22) %
        P,
      _6n,
      P,
    ) *
      b2) %
      P,
    _2n,
    P,
  );
  if (!Fpk1.eql(Fpk1.sqr(root), y)) throw new Error("Cannot find square root");
  return root;
}
const Fpk1 = Field(secp256k1_CURVE.p, { sqrt: sqrtMod });
const Pointk1 = /* @__PURE__ */ weierstrass(secp256k1_CURVE, {
  Fp: Fpk1,
  endo: secp256k1_ENDO,
});
/**
 * secp256k1 curve: ECDSA and ECDH methods.
 *
 * Uses sha256 to hash messages. To use a different hash,
 * pass `{ prehash: false }` to sign / verify.
 *
 * @example
 * ```js
 * import { secp256k1 } from '@noble/curves/secp256k1.js';
 * const { secretKey, publicKey } = secp256k1.keygen();
 * // const publicKey = secp256k1.getPublicKey(secretKey);
 * const msg = new TextEncoder().encode('hello noble');
 * const sig = secp256k1.sign(msg, secretKey);
 * const isValid = secp256k1.verify(sig, msg, publicKey);
 * // const sigKeccak = secp256k1.sign(keccak256(msg), secretKey, { prehash: false });
 * ```
 */
const secp256k1 = /* @__PURE__ */ ecdsa(Pointk1, sha256);
/** An object mapping tags to their tagged hash prefix of [SHA256(tag) | SHA256(tag)] */
const TAGGED_HASH_PREFIXES = {};
function taggedHash(tag, ...messages) {
  let tagP = TAGGED_HASH_PREFIXES[tag];
  if (tagP === void 0) {
    const tagH = sha256(asciiToBytes(tag));
    tagP = concatBytes(tagH, tagH);
    TAGGED_HASH_PREFIXES[tag] = tagP;
  }
  return sha256(concatBytes(tagP, ...messages));
}
const pointToBytes = (point) => point.toBytes(true).slice(1);
const hasEven = (y) => y % _2n === _0n;
function schnorrGetExtPubKey(priv) {
  const { Fn, BASE } = Pointk1;
  const d_ = Fn.fromBytes(priv);
  const p = BASE.multiply(d_);
  return {
    scalar: hasEven(p.y) ? d_ : Fn.neg(d_),
    bytes: pointToBytes(p),
  };
}
/**
 * lift_x from BIP340. Convert 32-byte x coordinate to elliptic curve point.
 * @returns valid point checked for being on-curve
 */
function lift_x(x) {
  const Fp = Fpk1;
  if (!Fp.isValidNot0(x)) throw new Error("invalid x: Fail if x ≥ p");
  const xx = Fp.create(x * x);
  const c = Fp.create(xx * x + BigInt(7));
  let y = Fp.sqrt(c);
  if (!hasEven(y)) y = Fp.neg(y);
  const p = Pointk1.fromAffine({
    x,
    y,
  });
  p.assertValidity();
  return p;
}
const num = bytesToNumberBE;
/**
 * Create tagged hash, convert it to bigint, reduce modulo-n.
 */
function challenge(...args) {
  return Pointk1.Fn.create(num(taggedHash("BIP0340/challenge", ...args)));
}
/**
 * Schnorr public key is just `x` coordinate of Point as per BIP340.
 */
function schnorrGetPublicKey(secretKey) {
  return schnorrGetExtPubKey(secretKey).bytes;
}
/**
 * Creates Schnorr signature as per BIP340. Verifies itself before returning anything.
 * auxRand is optional and is not the sole source of k generation: bad CSPRNG won't be dangerous.
 */
function schnorrSign(message, secretKey, auxRand = randomBytes(32)) {
  const { Fn } = Pointk1;
  const m = abytes$1(message, void 0, "message");
  const { bytes: px, scalar: d } = schnorrGetExtPubKey(secretKey);
  const a = abytes$1(auxRand, 32, "auxRand");
  const { bytes: rx, scalar: k } = schnorrGetExtPubKey(
    taggedHash("BIP0340/nonce", Fn.toBytes(d ^ num(taggedHash("BIP0340/aux", a))), px, m),
  );
  const e = challenge(rx, px, m);
  const sig = /* @__PURE__ */ new Uint8Array(64);
  sig.set(rx, 0);
  sig.set(Fn.toBytes(Fn.create(k + e * d)), 32);
  if (!schnorrVerify(sig, m, px)) throw new Error("sign: Invalid signature produced");
  return sig;
}
/**
 * Verifies Schnorr signature.
 * Will swallow errors & return false except for initial type validation of arguments.
 */
function schnorrVerify(signature, message, publicKey) {
  const { Fp, Fn, BASE } = Pointk1;
  const sig = abytes$1(signature, 64, "signature");
  const m = abytes$1(message, void 0, "message");
  const pub = abytes$1(publicKey, 32, "publicKey");
  try {
    const P = lift_x(num(pub));
    const r = num(sig.subarray(0, 32));
    if (!Fp.isValidNot0(r)) return false;
    const s = num(sig.subarray(32, 64));
    if (!Fn.isValidNot0(s)) return false;
    const e = challenge(Fn.toBytes(r), pointToBytes(P), m);
    const R = BASE.multiplyUnsafe(s).add(P.multiplyUnsafe(Fn.neg(e)));
    const { x, y } = R.toAffine();
    if (R.is0() || !hasEven(y) || x !== r) return false;
    return true;
  } catch (error) {
    return false;
  }
}
/**
 * Schnorr signatures over secp256k1.
 * https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
 * @example
 * ```js
 * import { schnorr } from '@noble/curves/secp256k1.js';
 * const { secretKey, publicKey } = schnorr.keygen();
 * // const publicKey = schnorr.getPublicKey(secretKey);
 * const msg = new TextEncoder().encode('hello');
 * const sig = schnorr.sign(msg, secretKey);
 * const isValid = schnorr.verify(sig, msg, publicKey);
 * ```
 */
const schnorr = /* @__PURE__ */ (() => {
  const size = 32;
  const seedLength = 48;
  const randomSecretKey = (seed = randomBytes(seedLength)) => {
    return mapHashToField(seed, secp256k1_CURVE.n);
  };
  return {
    keygen: createKeygen(randomSecretKey, schnorrGetPublicKey),
    getPublicKey: schnorrGetPublicKey,
    sign: schnorrSign,
    verify: schnorrVerify,
    Point: Pointk1,
    utils: {
      randomSecretKey,
      taggedHash,
      lift_x,
      pointToBytes,
    },
    lengths: {
      secretKey: size,
      publicKey: size,
      publicKeyHasPrefix: false,
      signature: size * 2,
      seed: seedLength,
    },
  };
})();
//#endregion
//#region node_modules/@scure/base/index.js
/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
function isBytes(a) {
  return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array");
}
/** Asserts something is Uint8Array. */
function abytes(b) {
  if (!isBytes(b)) throw new Error("Uint8Array expected");
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr)) return false;
  if (arr.length === 0) return true;
  if (isString) return arr.every((item) => typeof item === "string");
  else return arr.every((item) => Number.isSafeInteger(item));
}
function afn(input) {
  if (typeof input !== "function") throw new Error("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string") throw new Error(`${label}: string expected`);
  return true;
}
function anumber(n) {
  if (!Number.isSafeInteger(n)) throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input)) throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input)) throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input)) throw new Error(`${label}: array of numbers expected`);
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  return {
    encode: args.map((x) => x.encode).reduceRight(wrap, id),
    decode: args.map((x) => x.decode).reduce(wrap, id),
  };
}
/**
 * Encodes integer radix representation to array of strings using alphabet and back.
 * Could also be array of strings.
 * @__NO_SIDE_EFFECTS__
 */
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i) => [l, i]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i) => {
        if (!Number.isSafeInteger(i) || i < 0 || i >= len)
          throw new Error(
            `alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`,
          );
        return lettersA[i];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i = indexes.get(letter);
        if (i === void 0) throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i;
      });
    },
  };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from) => {
      astrArr("join.decode", from);
      return from.join(separator);
    },
    decode: (to) => {
      astr("join.decode", to);
      return to.split(separator);
    },
  };
}
/**
 * Pad strings array so it has integer number of bits
 * @__NO_SIDE_EFFECTS__
 */
function padding(bits, chr = "=") {
  anumber(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while ((data.length * bits) % 8) data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if ((end * bits) % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--)
        if (((end - 1) * bits) % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      return input.slice(0, end);
    },
  };
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function normalize(fn) {
  afn(fn);
  return {
    encode: (from) => from,
    decode: (to) => fn(to),
  };
}
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
const powers = /* @__PURE__ */ (() => {
  let res = [];
  for (let i = 0; i < 40; i++) res.push(2 ** i);
  return res;
})();
/**
 * Implemented with numbers, because BigInt is 5x slower
 */
function convertRadix2(data, from, to, padding) {
  aArr(data);
  if (from <= 0 || from > 32) throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32) throw new Error(`convertRadix2: wrong to=${to}`);
  if (/* @__PURE__ */ radix2carry(from, to) > 32)
    throw new Error(
      `convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`,
    );
  let carry = 0;
  let pos = 0;
  const max = powers[from];
  const mask = powers[to] - 1;
  const res = [];
  for (const n of data) {
    anumber(n);
    if (n >= max) throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = (carry << from) | n;
    if (pos + from > 32) throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to) res.push(((carry >> (pos - to)) & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0) throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = (carry << (to - pos)) & mask;
  if (!padding && pos >= from) throw new Error("Excess padding");
  if (!padding && carry > 0) throw new Error(`Non-zero padding: ${carry}`);
  if (padding && pos > 0) res.push(carry >>> 0);
  return res;
}
/**
 * If both bases are power of same number (like `2**8 <-> 2**64`),
 * there is a linear algorithm. For now we have implementation for power-of-two bases only.
 * @__NO_SIDE_EFFECTS__
 */
function radix2(bits, revPadding = false) {
  anumber(bits);
  if (bits <= 0 || bits > 32) throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes) => {
      if (!isBytes(bytes)) throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    },
  };
}
function unsafeWrapper(fn) {
  afn(fn);
  return function (...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {}
  };
}
chain(radix2(4), alphabet("0123456789ABCDEF"), join(""));
chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), padding(5), join(""));
chain(radix2(5), alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), join(""));
chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), padding(5), join(""));
chain(radix2(5), alphabet("0123456789ABCDEFGHIJKLMNOPQRSTUV"), join(""));
chain(
  radix2(5),
  alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"),
  join(""),
  normalize((s) => s.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1")),
);
const hasBase64Builtin = /* @__PURE__ */ (() =>
  typeof Uint8Array.from([]).toBase64 === "function" &&
  typeof Uint8Array.fromBase64 === "function")();
const decodeBase64Builtin = (s, isUrl) => {
  astr("base64", s);
  const re = isUrl ? /^[A-Za-z0-9=_-]+$/ : /^[A-Za-z0-9=+/]+$/;
  const alphabet = isUrl ? "base64url" : "base64";
  if (s.length > 0 && !re.test(s)) throw new Error("invalid base64");
  return Uint8Array.fromBase64(s, {
    alphabet,
    lastChunkHandling: "strict",
  });
};
/**
 * base64 from RFC 4648. Padded.
 * Use `base64nopad` for unpadded version.
 * Also check out `base64url`, `base64urlnopad`.
 * Falls back to built-in function, when available.
 * @example
 * ```js
 * base64.encode(Uint8Array.from([0x12, 0xab]));
 * // => 'Eqs='
 * base64.decode('Eqs=');
 * // => Uint8Array.from([0x12, 0xab])
 * ```
 */
const base64 = hasBase64Builtin
  ? {
      encode(b) {
        abytes(b);
        return b.toBase64();
      },
      decode(s) {
        return decodeBase64Builtin(s, false);
      },
    }
  : chain(
      radix2(6),
      alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),
      padding(6),
      join(""),
    );
chain(
  radix2(6),
  alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"),
  join(""),
);
hasBase64Builtin ||
  chain(
    radix2(6),
    alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),
    padding(6),
    join(""),
  );
chain(
  radix2(6),
  alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),
  join(""),
);
const BECH_ALPHABET = chain(alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), join(""));
const POLYMOD_GENERATORS = [996825010, 642813549, 513874426, 1027748829, 705979059];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 33554431) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++)
    if (((b >> i) & 1) === 1) chk ^= POLYMOD_GENERATORS[i];
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ (c >> 5);
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++) chk = bech32Polymod(chk) ^ (prefix.charCodeAt(i) & 31);
  for (let v of words) chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++) chk = bech32Polymod(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET.encode(convertRadix2([chk % powers[30]], 30, 5, false));
}
/**
 * @__NO_SIDE_EFFECTS__
 */
function genBech32(encoding) {
  const ENCODING_CONST = encoding === "bech32" ? 1 : 734539939;
  const _words = radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode(prefix, words, limit = 90) {
    astr("bech32.encode prefix", prefix);
    if (isBytes(words)) words = Array.from(words);
    anumArr("bech32.encode", words);
    const plen = prefix.length;
    if (plen === 0) throw new TypeError(`Invalid prefix length ${plen}`);
    const actualLength = plen + 7 + words.length;
    if (limit !== false && actualLength > limit)
      throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    const lowered = prefix.toLowerCase();
    const sum = bechChecksum(lowered, words, ENCODING_CONST);
    return `${lowered}1${BECH_ALPHABET.encode(words)}${sum}`;
  }
  function decode(str, limit = 90) {
    astr("bech32.decode input", str);
    const slen = str.length;
    if (slen < 8 || (limit !== false && slen > limit))
      throw new TypeError(`invalid string length: ${slen} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase())
      throw new Error(`String must be lowercase or uppercase`);
    const sepIndex = lowered.lastIndexOf("1");
    if (sepIndex === 0 || sepIndex === -1)
      throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = lowered.slice(0, sepIndex);
    const data = lowered.slice(sepIndex + 1);
    if (data.length < 6) throw new Error("Data must be at least 6 characters long");
    const words = BECH_ALPHABET.decode(data).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!data.endsWith(sum)) throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return {
      prefix,
      words,
    };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str) {
    const { prefix, words } = decode(str, false);
    return {
      prefix,
      words,
      bytes: fromWords(words),
    };
  }
  function encodeFromBytes(prefix, bytes) {
    return encode(prefix, toWords(bytes));
  }
  return {
    encode,
    decode,
    encodeFromBytes,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords,
  };
}
/**
 * bech32 from BIP 173. Operates on words.
 * For high-level, check out scure-btc-signer:
 * https://github.com/paulmillr/scure-btc-signer.
 */
const bech32 = genBech32("bech32");
genBech32("bech32m");
/* @__PURE__ */ (() =>
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")() ||
  chain(
    radix2(4),
    alphabet("0123456789abcdef"),
    join(""),
    normalize((s) => {
      if (typeof s !== "string" || s.length % 2 !== 0)
        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
      return s.toLowerCase();
    }),
  );
//#endregion
//#region node_modules/@noble/ciphers/_arx.js
/**
* Basic utils for ARX (add-rotate-xor) salsa and chacha ciphers.

RFC8439 requires multi-step cipher stream, where
authKey starts with counter: 0, actual msg with counter: 1.

For this, we need a way to re-use nonce / counter:

const counter = new Uint8Array(4);
chacha(..., counter, ...); // counter is now 1
chacha(..., counter, ...); // counter is now 2

This is complicated:

- 32-bit counters are enough, no need for 64-bit: max ArrayBuffer size in JS is 4GB
- Original papers don't allow mutating counters
- Counter overflow is undefined [^1]
- Idea A: allow providing (nonce | counter) instead of just nonce, re-use it
- Caveat: Cannot be re-used through all cases:
- * chacha has (counter | nonce)
- * xchacha has (nonce16 | counter | nonce16)
- Idea B: separate nonce / counter and provide separate API for counter re-use
- Caveat: there are different counter sizes depending on an algorithm.
- salsa & chacha also differ in structures of key & sigma:
salsa20:      s[0] | k(4) | s[1] | nonce(2) | cnt(2) | s[2] | k(4) | s[3]
chacha:       s(4) | k(8) | cnt(1) | nonce(3)
chacha20orig: s(4) | k(8) | cnt(2) | nonce(2)
- Idea C: helper method such as `setSalsaState(key, nonce, sigma, data)`
- Caveat: we can't re-use counter array

xchacha [^2] uses the subkey and remaining 8 byte nonce with ChaCha20 as normal
(prefixed by 4 NUL bytes, since [RFC8439] specifies a 12-byte nonce).

[^1]: https://mailarchive.ietf.org/arch/msg/cfrg/gsOnTJzcbgG6OqD8Sc0GO5aR_tU/
[^2]: https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha#appendix-A.2

* @module
*/
const encodeStr = (str) => Uint8Array.from(str.split(""), (c) => c.charCodeAt(0));
const sigma16 = encodeStr("expand 16-byte k");
const sigma32 = encodeStr("expand 32-byte k");
const sigma16_32 = u32(sigma16);
const sigma32_32 = u32(sigma32);
/** Rotate left. */
function rotl(a, b) {
  return (a << b) | (a >>> (32 - b));
}
function isAligned32(b) {
  return b.byteOffset % 4 === 0;
}
const BLOCK_LEN = 64;
const BLOCK_LEN32 = 16;
const MAX_COUNTER = 2 ** 32 - 1;
const U32_EMPTY = Uint32Array.of();
function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
  const len = data.length;
  const block = new Uint8Array(BLOCK_LEN);
  const b32 = u32(block);
  const isAligned = isAligned32(data) && isAligned32(output);
  const d32 = isAligned ? u32(data) : U32_EMPTY;
  const o32 = isAligned ? u32(output) : U32_EMPTY;
  for (let pos = 0; pos < len; counter++) {
    core(sigma, key, nonce, b32, counter, rounds);
    if (counter >= MAX_COUNTER) throw new Error("arx: counter overflow");
    const take = Math.min(BLOCK_LEN, len - pos);
    if (isAligned && take === BLOCK_LEN) {
      const pos32 = pos / 4;
      if (pos % 4 !== 0) throw new Error("arx: invalid block position");
      for (let j = 0, posj; j < BLOCK_LEN32; j++) {
        posj = pos32 + j;
        o32[posj] = d32[posj] ^ b32[j];
      }
      pos += BLOCK_LEN;
      continue;
    }
    for (let j = 0, posj; j < take; j++) {
      posj = pos + j;
      output[posj] = data[posj] ^ block[j];
    }
    pos += take;
  }
}
/** Creates ARX-like (ChaCha, Salsa) cipher stream from core function. */
function createCipher(core, opts) {
  const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = checkOpts(
    {
      allowShortKeys: false,
      counterLength: 8,
      counterRight: false,
      rounds: 20,
    },
    opts,
  );
  if (typeof core !== "function") throw new Error("core must be a function");
  anumber$1(counterLength);
  anumber$1(rounds);
  abool$1(counterRight);
  abool$1(allowShortKeys);
  return (key, nonce, data, output, counter = 0) => {
    abytes$2(key, void 0, "key");
    abytes$2(nonce, void 0, "nonce");
    abytes$2(data, void 0, "data");
    const len = data.length;
    if (output === void 0) output = new Uint8Array(len);
    abytes$2(output, void 0, "output");
    anumber$1(counter);
    if (counter < 0 || counter >= MAX_COUNTER) throw new Error("arx: counter overflow");
    if (output.length < len)
      throw new Error(`arx: output (${output.length}) is shorter than data (${len})`);
    const toClean = [];
    let l = key.length;
    let k;
    let sigma;
    if (l === 32) {
      toClean.push((k = copyBytes(key)));
      sigma = sigma32_32;
    } else if (l === 16 && allowShortKeys) {
      k = /* @__PURE__ */ new Uint8Array(32);
      k.set(key);
      k.set(key, 16);
      sigma = sigma16_32;
      toClean.push(k);
    } else {
      abytes$2(key, 32, "arx key");
      throw new Error("invalid key size");
    }
    if (!isAligned32(nonce)) toClean.push((nonce = copyBytes(nonce)));
    const k32 = u32(k);
    if (extendNonceFn) {
      if (nonce.length !== 24) throw new Error(`arx: extended nonce must be 24 bytes`);
      extendNonceFn(sigma, k32, u32(nonce.subarray(0, 16)), k32);
      nonce = nonce.subarray(16);
    }
    const nonceNcLen = 16 - counterLength;
    if (nonceNcLen !== nonce.length)
      throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
    if (nonceNcLen !== 12) {
      const nc = /* @__PURE__ */ new Uint8Array(12);
      nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
      nonce = nc;
      toClean.push(nonce);
    }
    const n32 = u32(nonce);
    runCipher(core, sigma, k32, n32, data, output, counter, rounds);
    clean(...toClean);
    return output;
  };
}
//#endregion
//#region node_modules/@noble/ciphers/_poly1305.js
/**
 * Poly1305 ([PDF](https://cr.yp.to/mac/poly1305-20050329.pdf),
 * [wiki](https://en.wikipedia.org/wiki/Poly1305))
 * is a fast and parallel secret-key message-authentication code suitable for
 * a wide variety of applications. It was standardized in
 * [RFC 8439](https://www.rfc-editor.org/rfc/rfc8439) and is now used in TLS 1.3.
 *
 * Polynomial MACs are not perfect for every situation:
 * they lack Random Key Robustness: the MAC can be forged, and can't be used in PAKE schemes.
 * See [invisible salamanders attack](https://keymaterial.net/2020/09/07/invisible-salamanders-in-aes-gcm-siv/).
 * To combat invisible salamanders, `hash(key)` can be included in ciphertext,
 * however, this would violate ciphertext indistinguishability:
 * an attacker would know which key was used - so `HKDF(key, i)`
 * could be used instead.
 *
 * Check out [original website](https://cr.yp.to/mac.html).
 * Based on Public Domain [poly1305-donna](https://github.com/floodyberry/poly1305-donna).
 * @module
 */
function u8to16(a, i) {
  return (a[i++] & 255) | ((a[i++] & 255) << 8);
}
/** Poly1305 class. Prefer poly1305() function instead. */
var Poly1305 = class {
  blockLen = 16;
  outputLen = 16;
  buffer = /* @__PURE__ */ new Uint8Array(16);
  r = /* @__PURE__ */ new Uint16Array(10);
  h = /* @__PURE__ */ new Uint16Array(10);
  pad = /* @__PURE__ */ new Uint16Array(8);
  pos = 0;
  finished = false;
  constructor(key) {
    key = copyBytes(abytes$2(key, 32, "key"));
    const t0 = u8to16(key, 0);
    const t1 = u8to16(key, 2);
    const t2 = u8to16(key, 4);
    const t3 = u8to16(key, 6);
    const t4 = u8to16(key, 8);
    const t5 = u8to16(key, 10);
    const t6 = u8to16(key, 12);
    const t7 = u8to16(key, 14);
    this.r[0] = t0 & 8191;
    this.r[1] = ((t0 >>> 13) | (t1 << 3)) & 8191;
    this.r[2] = ((t1 >>> 10) | (t2 << 6)) & 7939;
    this.r[3] = ((t2 >>> 7) | (t3 << 9)) & 8191;
    this.r[4] = ((t3 >>> 4) | (t4 << 12)) & 255;
    this.r[5] = (t4 >>> 1) & 8190;
    this.r[6] = ((t4 >>> 14) | (t5 << 2)) & 8191;
    this.r[7] = ((t5 >>> 11) | (t6 << 5)) & 8065;
    this.r[8] = ((t6 >>> 8) | (t7 << 8)) & 8191;
    this.r[9] = (t7 >>> 5) & 127;
    for (let i = 0; i < 8; i++) this.pad[i] = u8to16(key, 16 + 2 * i);
  }
  process(data, offset, isLast = false) {
    const hibit = isLast ? 0 : 2048;
    const { h, r } = this;
    const r0 = r[0];
    const r1 = r[1];
    const r2 = r[2];
    const r3 = r[3];
    const r4 = r[4];
    const r5 = r[5];
    const r6 = r[6];
    const r7 = r[7];
    const r8 = r[8];
    const r9 = r[9];
    const t0 = u8to16(data, offset + 0);
    const t1 = u8to16(data, offset + 2);
    const t2 = u8to16(data, offset + 4);
    const t3 = u8to16(data, offset + 6);
    const t4 = u8to16(data, offset + 8);
    const t5 = u8to16(data, offset + 10);
    const t6 = u8to16(data, offset + 12);
    const t7 = u8to16(data, offset + 14);
    let h0 = h[0] + (t0 & 8191);
    let h1 = h[1] + (((t0 >>> 13) | (t1 << 3)) & 8191);
    let h2 = h[2] + (((t1 >>> 10) | (t2 << 6)) & 8191);
    let h3 = h[3] + (((t2 >>> 7) | (t3 << 9)) & 8191);
    let h4 = h[4] + (((t3 >>> 4) | (t4 << 12)) & 8191);
    let h5 = h[5] + ((t4 >>> 1) & 8191);
    let h6 = h[6] + (((t4 >>> 14) | (t5 << 2)) & 8191);
    let h7 = h[7] + (((t5 >>> 11) | (t6 << 5)) & 8191);
    let h8 = h[8] + (((t6 >>> 8) | (t7 << 8)) & 8191);
    let h9 = h[9] + ((t7 >>> 5) | hibit);
    let c = 0;
    let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
    c = d0 >>> 13;
    d0 &= 8191;
    d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
    c += d0 >>> 13;
    d0 &= 8191;
    let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
    c = d1 >>> 13;
    d1 &= 8191;
    d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
    c += d1 >>> 13;
    d1 &= 8191;
    let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
    c = d2 >>> 13;
    d2 &= 8191;
    d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
    c += d2 >>> 13;
    d2 &= 8191;
    let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
    c = d3 >>> 13;
    d3 &= 8191;
    d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
    c += d3 >>> 13;
    d3 &= 8191;
    let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
    c = d4 >>> 13;
    d4 &= 8191;
    d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
    c += d4 >>> 13;
    d4 &= 8191;
    let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
    c = d5 >>> 13;
    d5 &= 8191;
    d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
    c += d5 >>> 13;
    d5 &= 8191;
    let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
    c = d6 >>> 13;
    d6 &= 8191;
    d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
    c += d6 >>> 13;
    d6 &= 8191;
    let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
    c = d7 >>> 13;
    d7 &= 8191;
    d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
    c += d7 >>> 13;
    d7 &= 8191;
    let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
    c = d8 >>> 13;
    d8 &= 8191;
    d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
    c += d8 >>> 13;
    d8 &= 8191;
    let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
    c = d9 >>> 13;
    d9 &= 8191;
    d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
    c += d9 >>> 13;
    d9 &= 8191;
    c = ((c << 2) + c) | 0;
    c = (c + d0) | 0;
    d0 = c & 8191;
    c = c >>> 13;
    d1 += c;
    h[0] = d0;
    h[1] = d1;
    h[2] = d2;
    h[3] = d3;
    h[4] = d4;
    h[5] = d5;
    h[6] = d6;
    h[7] = d7;
    h[8] = d8;
    h[9] = d9;
  }
  finalize() {
    const { h, pad } = this;
    const g = /* @__PURE__ */ new Uint16Array(10);
    let c = h[1] >>> 13;
    h[1] &= 8191;
    for (let i = 2; i < 10; i++) {
      h[i] += c;
      c = h[i] >>> 13;
      h[i] &= 8191;
    }
    h[0] += c * 5;
    c = h[0] >>> 13;
    h[0] &= 8191;
    h[1] += c;
    c = h[1] >>> 13;
    h[1] &= 8191;
    h[2] += c;
    g[0] = h[0] + 5;
    c = g[0] >>> 13;
    g[0] &= 8191;
    for (let i = 1; i < 10; i++) {
      g[i] = h[i] + c;
      c = g[i] >>> 13;
      g[i] &= 8191;
    }
    g[9] -= 8192;
    let mask = (c ^ 1) - 1;
    for (let i = 0; i < 10; i++) g[i] &= mask;
    mask = ~mask;
    for (let i = 0; i < 10; i++) h[i] = (h[i] & mask) | g[i];
    h[0] = (h[0] | (h[1] << 13)) & 65535;
    h[1] = ((h[1] >>> 3) | (h[2] << 10)) & 65535;
    h[2] = ((h[2] >>> 6) | (h[3] << 7)) & 65535;
    h[3] = ((h[3] >>> 9) | (h[4] << 4)) & 65535;
    h[4] = ((h[4] >>> 12) | (h[5] << 1) | (h[6] << 14)) & 65535;
    h[5] = ((h[6] >>> 2) | (h[7] << 11)) & 65535;
    h[6] = ((h[7] >>> 5) | (h[8] << 8)) & 65535;
    h[7] = ((h[8] >>> 8) | (h[9] << 5)) & 65535;
    let f = h[0] + pad[0];
    h[0] = f & 65535;
    for (let i = 1; i < 8; i++) {
      f = (((h[i] + pad[i]) | 0) + (f >>> 16)) | 0;
      h[i] = f & 65535;
    }
    clean(g);
  }
  update(data) {
    aexists(this);
    abytes$2(data);
    data = copyBytes(data);
    const { buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len;) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        for (; blockLen <= len - pos; pos += blockLen) this.process(data, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(buffer, 0, false);
        this.pos = 0;
      }
    }
    return this;
  }
  destroy() {
    clean(this.h, this.r, this.buffer, this.pad);
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { buffer, h } = this;
    let { pos } = this;
    if (pos) {
      buffer[pos++] = 1;
      for (; pos < 16; pos++) buffer[pos] = 0;
      this.process(buffer, 0, true);
    }
    this.finalize();
    let opos = 0;
    for (let i = 0; i < 8; i++) {
      out[opos++] = h[i] >>> 0;
      out[opos++] = h[i] >>> 8;
    }
    return out;
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
};
function wrapConstructorWithKey(hashCons) {
  const hashC = (msg, key) => hashCons(key).update(msg).digest();
  const tmp = hashCons(/* @__PURE__ */ new Uint8Array(32));
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (key) => hashCons(key);
  return hashC;
}
(() => wrapConstructorWithKey((key) => new Poly1305(key)))();
//#endregion
//#region node_modules/@noble/ciphers/chacha.js
/**
 * ChaCha stream cipher, released
 * in 2008. Developed after Salsa20, ChaCha aims to increase diffusion per round.
 * It was standardized in [RFC 8439](https://www.rfc-editor.org/rfc/rfc8439) and
 * is now used in TLS 1.3.
 *
 * [XChaCha20](https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha)
 * extended-nonce variant is also provided. Similar to XSalsa, it's safe to use with
 * randomly-generated nonces.
 *
 * Check out [PDF](http://cr.yp.to/chacha/chacha-20080128.pdf) and
 * [wiki](https://en.wikipedia.org/wiki/Salsa20) and
 * [website](https://cr.yp.to/chacha.html).
 *
 * @module
 */
/** Identical to `chachaCore_small`. Unused. */
function chachaCore(s, k, n, out, cnt, rounds = 20) {
  let y00 = s[0],
    y01 = s[1],
    y02 = s[2],
    y03 = s[3],
    y04 = k[0],
    y05 = k[1],
    y06 = k[2],
    y07 = k[3],
    y08 = k[4],
    y09 = k[5],
    y10 = k[6],
    y11 = k[7],
    y12 = cnt,
    y13 = n[0],
    y14 = n[1],
    y15 = n[2];
  let x00 = y00,
    x01 = y01,
    x02 = y02,
    x03 = y03,
    x04 = y04,
    x05 = y05,
    x06 = y06,
    x07 = y07,
    x08 = y08,
    x09 = y09,
    x10 = y10,
    x11 = y11,
    x12 = y12,
    x13 = y13,
    x14 = y14,
    x15 = y15;
  for (let r = 0; r < rounds; r += 2) {
    x00 = (x00 + x04) | 0;
    x12 = rotl(x12 ^ x00, 16);
    x08 = (x08 + x12) | 0;
    x04 = rotl(x04 ^ x08, 12);
    x00 = (x00 + x04) | 0;
    x12 = rotl(x12 ^ x00, 8);
    x08 = (x08 + x12) | 0;
    x04 = rotl(x04 ^ x08, 7);
    x01 = (x01 + x05) | 0;
    x13 = rotl(x13 ^ x01, 16);
    x09 = (x09 + x13) | 0;
    x05 = rotl(x05 ^ x09, 12);
    x01 = (x01 + x05) | 0;
    x13 = rotl(x13 ^ x01, 8);
    x09 = (x09 + x13) | 0;
    x05 = rotl(x05 ^ x09, 7);
    x02 = (x02 + x06) | 0;
    x14 = rotl(x14 ^ x02, 16);
    x10 = (x10 + x14) | 0;
    x06 = rotl(x06 ^ x10, 12);
    x02 = (x02 + x06) | 0;
    x14 = rotl(x14 ^ x02, 8);
    x10 = (x10 + x14) | 0;
    x06 = rotl(x06 ^ x10, 7);
    x03 = (x03 + x07) | 0;
    x15 = rotl(x15 ^ x03, 16);
    x11 = (x11 + x15) | 0;
    x07 = rotl(x07 ^ x11, 12);
    x03 = (x03 + x07) | 0;
    x15 = rotl(x15 ^ x03, 8);
    x11 = (x11 + x15) | 0;
    x07 = rotl(x07 ^ x11, 7);
    x00 = (x00 + x05) | 0;
    x15 = rotl(x15 ^ x00, 16);
    x10 = (x10 + x15) | 0;
    x05 = rotl(x05 ^ x10, 12);
    x00 = (x00 + x05) | 0;
    x15 = rotl(x15 ^ x00, 8);
    x10 = (x10 + x15) | 0;
    x05 = rotl(x05 ^ x10, 7);
    x01 = (x01 + x06) | 0;
    x12 = rotl(x12 ^ x01, 16);
    x11 = (x11 + x12) | 0;
    x06 = rotl(x06 ^ x11, 12);
    x01 = (x01 + x06) | 0;
    x12 = rotl(x12 ^ x01, 8);
    x11 = (x11 + x12) | 0;
    x06 = rotl(x06 ^ x11, 7);
    x02 = (x02 + x07) | 0;
    x13 = rotl(x13 ^ x02, 16);
    x08 = (x08 + x13) | 0;
    x07 = rotl(x07 ^ x08, 12);
    x02 = (x02 + x07) | 0;
    x13 = rotl(x13 ^ x02, 8);
    x08 = (x08 + x13) | 0;
    x07 = rotl(x07 ^ x08, 7);
    x03 = (x03 + x04) | 0;
    x14 = rotl(x14 ^ x03, 16);
    x09 = (x09 + x14) | 0;
    x04 = rotl(x04 ^ x09, 12);
    x03 = (x03 + x04) | 0;
    x14 = rotl(x14 ^ x03, 8);
    x09 = (x09 + x14) | 0;
    x04 = rotl(x04 ^ x09, 7);
  }
  let oi = 0;
  out[oi++] = (y00 + x00) | 0;
  out[oi++] = (y01 + x01) | 0;
  out[oi++] = (y02 + x02) | 0;
  out[oi++] = (y03 + x03) | 0;
  out[oi++] = (y04 + x04) | 0;
  out[oi++] = (y05 + x05) | 0;
  out[oi++] = (y06 + x06) | 0;
  out[oi++] = (y07 + x07) | 0;
  out[oi++] = (y08 + x08) | 0;
  out[oi++] = (y09 + x09) | 0;
  out[oi++] = (y10 + x10) | 0;
  out[oi++] = (y11 + x11) | 0;
  out[oi++] = (y12 + x12) | 0;
  out[oi++] = (y13 + x13) | 0;
  out[oi++] = (y14 + x14) | 0;
  out[oi++] = (y15 + x15) | 0;
}
/**
 * ChaCha stream cipher. Conforms to RFC 8439 (IETF, TLS). 12-byte nonce, 4-byte counter.
 * With smaller nonce, it's not safe to make it random (CSPRNG), due to collision chance.
 */
const chacha20 = /* @__PURE__ */ createCipher(chachaCore, {
  counterRight: false,
  counterLength: 4,
  allowShortKeys: false,
});
//#endregion
//#region node_modules/nostr-tools/lib/esm/index.js
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
    });
};
var verifiedSymbol = Symbol("verified");
var isRecord = (obj) => obj instanceof Object;
function validateEvent(event) {
  if (!isRecord(event)) return false;
  if (typeof event.kind !== "number") return false;
  if (typeof event.content !== "string") return false;
  if (typeof event.created_at !== "number") return false;
  if (typeof event.pubkey !== "string") return false;
  if (!event.pubkey.match(/^[a-f0-9]{64}$/)) return false;
  if (!Array.isArray(event.tags)) return false;
  for (let i2 = 0; i2 < event.tags.length; i2++) {
    let tag = event.tags[i2];
    if (!Array.isArray(tag)) return false;
    for (let j = 0; j < tag.length; j++) if (typeof tag[j] !== "string") return false;
  }
  return true;
}
__export(
  {},
  {
    binarySearch: () => binarySearch,
    bytesToHex: () => bytesToHex,
    hexToBytes: () => hexToBytes,
    insertEventIntoAscendingList: () => insertEventIntoAscendingList,
    insertEventIntoDescendingList: () => insertEventIntoDescendingList,
    mergeReverseSortedLists: () => mergeReverseSortedLists,
    normalizeURL: () => normalizeURL,
    utf8Decoder: () => utf8Decoder,
    utf8Encoder: () => utf8Encoder,
  },
);
var utf8Decoder = new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function normalizeURL(url) {
  try {
    if (url.indexOf("://") === -1) url = "wss://" + url;
    let p = new URL(url);
    if (p.protocol === "http:") p.protocol = "ws:";
    else if (p.protocol === "https:") p.protocol = "wss:";
    p.pathname = p.pathname.replace(/\/+/g, "/");
    if (p.pathname.endsWith("/")) p.pathname = p.pathname.slice(0, -1);
    if ((p.port === "80" && p.protocol === "ws:") || (p.port === "443" && p.protocol === "wss:"))
      p.port = "";
    p.searchParams.sort();
    p.hash = "";
    return p.toString();
  } catch (e) {
    throw new Error(`Invalid URL: ${url}`);
  }
}
function insertEventIntoDescendingList(sortedArray, event) {
  const [idx, found] = binarySearch(sortedArray, (b) => {
    if (event.id === b.id) return 0;
    if (event.created_at === b.created_at) return -1;
    return b.created_at - event.created_at;
  });
  if (!found) sortedArray.splice(idx, 0, event);
  return sortedArray;
}
function insertEventIntoAscendingList(sortedArray, event) {
  const [idx, found] = binarySearch(sortedArray, (b) => {
    if (event.id === b.id) return 0;
    if (event.created_at === b.created_at) return -1;
    return event.created_at - b.created_at;
  });
  if (!found) sortedArray.splice(idx, 0, event);
  return sortedArray;
}
function binarySearch(arr, compare) {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const cmp = compare(arr[mid]);
    if (cmp === 0) return [mid, true];
    if (cmp < 0) end = mid - 1;
    else start = mid + 1;
  }
  return [start, false];
}
function mergeReverseSortedLists(list1, list2) {
  const result = new Array(list1.length + list2.length);
  result.length = 0;
  let i1 = 0;
  let i2 = 0;
  let sameTimestampIds = [];
  while (i1 < list1.length && i2 < list2.length) {
    let next;
    if (list1[i1]?.created_at > list2[i2]?.created_at) {
      next = list1[i1];
      i1++;
    } else {
      next = list2[i2];
      i2++;
    }
    if (result.length > 0 && result[result.length - 1].created_at === next.created_at) {
      if (sameTimestampIds.includes(next.id)) continue;
    } else sameTimestampIds.length = 0;
    result.push(next);
    sameTimestampIds.push(next.id);
  }
  while (i1 < list1.length) {
    const next = list1[i1];
    i1++;
    if (result.length > 0 && result[result.length - 1].created_at === next.created_at) {
      if (sameTimestampIds.includes(next.id)) continue;
    } else sameTimestampIds.length = 0;
    result.push(next);
    sameTimestampIds.push(next.id);
  }
  while (i2 < list2.length) {
    const next = list2[i2];
    i2++;
    if (result.length > 0 && result[result.length - 1].created_at === next.created_at) {
      if (sameTimestampIds.includes(next.id)) continue;
    } else sameTimestampIds.length = 0;
    result.push(next);
    sameTimestampIds.push(next.id);
  }
  return result;
}
var JS = class {
  generateSecretKey() {
    return schnorr.utils.randomSecretKey();
  }
  getPublicKey(secretKey) {
    return bytesToHex(schnorr.getPublicKey(secretKey));
  }
  finalizeEvent(t, secretKey) {
    const event = t;
    event.pubkey = bytesToHex(schnorr.getPublicKey(secretKey));
    event.id = getEventHash(event);
    event.sig = bytesToHex(schnorr.sign(hexToBytes(getEventHash(event)), secretKey));
    event[verifiedSymbol] = true;
    return event;
  }
  verifyEvent(event) {
    if (typeof event[verifiedSymbol] === "boolean") return event[verifiedSymbol];
    try {
      const hash = getEventHash(event);
      if (hash !== event.id) {
        event[verifiedSymbol] = false;
        return false;
      }
      const valid = schnorr.verify(
        hexToBytes(event.sig),
        hexToBytes(hash),
        hexToBytes(event.pubkey),
      );
      event[verifiedSymbol] = valid;
      return valid;
    } catch (err) {
      event[verifiedSymbol] = false;
      return false;
    }
  }
};
function serializeEvent(evt) {
  if (!validateEvent(evt))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([0, evt.pubkey, evt.created_at, evt.kind, evt.tags, evt.content]);
}
function getEventHash(event) {
  return bytesToHex(sha256(utf8Encoder.encode(serializeEvent(event))));
}
var i = new JS();
var generateSecretKey = i.generateSecretKey;
var getPublicKey = i.getPublicKey;
var finalizeEvent = i.finalizeEvent;
var verifyEvent = i.verifyEvent;
__export(
  {},
  {
    AIEmbeddings: () => AIEmbeddings,
    AppCurationSet: () => AppCurationSet,
    Application: () => Application,
    AuthoredPodcasts: () => AuthoredPodcasts,
    BadgeAward: () => BadgeAward,
    BadgeDefinition: () => BadgeDefinition,
    Bid: () => Bid,
    BidConfirmation: () => BidConfirmation,
    BlobsAuth: () => BlobsAuth,
    BlockedRelaysList: () => BlockedRelaysList,
    BlossomServerList: () => BlossomServerList,
    BookmarkList: () => BookmarkList,
    Bookmarksets: () => Bookmarksets,
    Calendar: () => Calendar,
    CalendarEventRSVP: () => CalendarEventRSVP,
    CashuMintAnnouncement: () => CashuMintAnnouncement,
    CashuWalletEvent: () => CashuWalletEvent,
    CashuWalletHistory: () => CashuWalletHistory,
    CashuWalletTokens: () => CashuWalletTokens,
    ChannelCreation: () => ChannelCreation,
    ChannelHideMessage: () => ChannelHideMessage,
    ChannelMessage: () => ChannelMessage,
    ChannelMetadata: () => ChannelMetadata,
    ChannelMuteUser: () => ChannelMuteUser,
    ChatMessage: () => ChatMessage,
    Chess: () => Chess,
    ClassifiedListing: () => ClassifiedListing,
    ClientAuth: () => ClientAuth,
    CodeSnippet: () => CodeSnippet,
    CoinjoinPool: () => CoinjoinPool,
    Comment: () => Comment,
    CommunitiesList: () => CommunitiesList,
    CommunityDefinition: () => CommunityDefinition,
    CommunityPostApproval: () => CommunityPostApproval,
    ConferenceEvent: () => ConferenceEvent,
    Contacts: () => Contacts,
    CreateOrUpdateProduct: () => CreateOrUpdateProduct,
    CreateOrUpdateStall: () => CreateOrUpdateStall,
    CuratedVideoSets: () => CuratedVideoSets,
    Curationsets: () => Curationsets,
    Date: () => Date2,
    DecoupledEncryptionKeyDistribution: () => DecoupledEncryptionKeyDistribution,
    DecoupledKeyAnnouncement: () => DecoupledKeyAnnouncement,
    DecoupledKeyClientAnnouncement: () => DecoupledKeyClientAnnouncement,
    DirectMessageRelaysList: () => DirectMessageRelaysList,
    DraftClassifiedListing: () => DraftClassifiedListing,
    DraftEvent: () => DraftEvent,
    DraftLong: () => DraftLong,
    Emojisets: () => Emojisets,
    EncryptedDirectMessage: () => EncryptedDirectMessage,
    EventDeletion: () => EventDeletion,
    FavoritePodcasts: () => FavoritePodcasts,
    FavoriteRelays: () => FavoriteRelays,
    FedimintAnnouncement: () => FedimintAnnouncement,
    Feed: () => Feed,
    FileMessage: () => FileMessage,
    FileMetadata: () => FileMetadata,
    FileServerPreference: () => FileServerPreference,
    Followsets: () => Followsets,
    ForumThread: () => ForumThread,
    GenericRepost: () => GenericRepost,
    Genericlists: () => Genericlists,
    GeocacheListing: () => GeocacheListing,
    GeocacheLog: () => GeocacheLog,
    GeocacheLogEntry: () => GeocacheLogEntry,
    GeocacheProofOfFind: () => GeocacheProofOfFind,
    GiftWrap: () => GiftWrap,
    GitPullRequest: () => GitPullRequest,
    GitPullRequestUpdate: () => GitPullRequestUpdate,
    GoodWikiAuthorList: () => GoodWikiAuthorList,
    GoodWikiRelayList: () => GoodWikiRelayList,
    GroupMetadata: () => GroupMetadata,
    HTTPAuth: () => HTTPAuth,
    Handlerinformation: () => Handlerinformation,
    Handlerrecommendation: () => Handlerrecommendation,
    Highlights: () => Highlights,
    InteractiveRoom: () => InteractiveRoom,
    InterestsList: () => InterestsList,
    Interestsets: () => Interestsets,
    Issue: () => Issue,
    JobFeedback: () => JobFeedback,
    JobRequest: () => JobRequest,
    JobResult: () => JobResult,
    Label: () => Label,
    LegacyNsiteFile: () => LegacyNsiteFile,
    LightningPubRPC: () => LightningPubRPC,
    LinkSet: () => LinkSet,
    LiveChatMessage: () => LiveChatMessage,
    LiveEvent: () => LiveEvent,
    LongFormArticle: () => LongFormArticle,
    MarketplaceUI: () => MarketplaceUI,
    MediaFollows: () => MediaFollows,
    MediaStarterPacks: () => MediaStarterPacks,
    MergeRequests: () => MergeRequests,
    Metadata: () => Metadata,
    ModularArticleContent: () => ModularArticleContent,
    ModularArticleHeader: () => ModularArticleHeader,
    MuteSets: () => MuteSets,
    Mutelist: () => Mutelist,
    NWCWalletInfo: () => NWCWalletInfo,
    NWCWalletRequest: () => NWCWalletRequest,
    NWCWalletResponse: () => NWCWalletResponse,
    NormalVideo: () => NormalVideo,
    NostrConnect: () => NostrConnect,
    NsiteNamed: () => NsiteNamed,
    NsiteRoot: () => NsiteRoot,
    NutZap: () => NutZap,
    NutZapInfo: () => NutZapInfo,
    OpenTimestamps: () => OpenTimestamps,
    Patch: () => Patch,
    PeerToPeerOrderEvents: () => PeerToPeerOrderEvents,
    Photo: () => Photo,
    Pinlist: () => Pinlist,
    PodcastEpisode: () => PodcastEpisode,
    PodcastMetadata: () => PodcastMetadata,
    Poll: () => Poll,
    PollResponse: () => PollResponse,
    PrivateDirectMessage: () => PrivateDirectMessage,
    PrivateEventRelayList: () => PrivateEventRelayList,
    ProblemTracker: () => ProblemTracker,
    ProductSoldAsAuction: () => ProductSoldAsAuction,
    ProfileBadges: () => ProfileBadges,
    ProxyAnnouncement: () => ProxyAnnouncement,
    PublicChatsList: () => PublicChatsList,
    PublicMessage: () => PublicMessage,
    Reaction: () => Reaction,
    ReactionToWebsite: () => ReactionToWebsite,
    RecommendRelay: () => RecommendRelay,
    Redirects: () => Redirects,
    RelayDiscovery: () => RelayDiscovery,
    RelayList: () => RelayList,
    RelayMonitorAnnouncement: () => RelayMonitorAnnouncement,
    RelayReview: () => RelayReview,
    RelayReviews: () => RelayReviews,
    Relaysets: () => Relaysets,
    ReleaseArtifactSets: () => ReleaseArtifactSets,
    Reply: () => Reply,
    Report: () => Report,
    Reporting: () => Reporting,
    RepositoryAnnouncement: () => RepositoryAnnouncement,
    RepositoryState: () => RepositoryState,
    Repost: () => Repost,
    ReservedCashuWalletTokens: () => ReservedCashuWalletTokens,
    RoomPresence: () => RoomPresence,
    Scroll: () => Scroll,
    Seal: () => Seal,
    SearchRelaysList: () => SearchRelaysList,
    ShortTextNote: () => ShortTextNote,
    ShortVideo: () => ShortVideo,
    SimpleGroupAdmins: () => SimpleGroupAdmins,
    SimpleGroupCreateGroup: () => SimpleGroupCreateGroup,
    SimpleGroupCreateInvite: () => SimpleGroupCreateInvite,
    SimpleGroupDeleteEvent: () => SimpleGroupDeleteEvent,
    SimpleGroupDeleteGroup: () => SimpleGroupDeleteGroup,
    SimpleGroupEditMetadata: () => SimpleGroupEditMetadata,
    SimpleGroupJoinRequest: () => SimpleGroupJoinRequest,
    SimpleGroupLeaveRequest: () => SimpleGroupLeaveRequest,
    SimpleGroupList: () => SimpleGroupList,
    SimpleGroupLiveKitParticipants: () => SimpleGroupLiveKitParticipants,
    SimpleGroupMembers: () => SimpleGroupMembers,
    SimpleGroupPutUser: () => SimpleGroupPutUser,
    SimpleGroupRemoveUser: () => SimpleGroupRemoveUser,
    SimpleGroupReply: () => SimpleGroupReply,
    SimpleGroupRoles: () => SimpleGroupRoles,
    SimpleGroupThreadedReply: () => SimpleGroupThreadedReply,
    SlideSet: () => SlideSet,
    SoftwareApplication: () => SoftwareApplication,
    StarterPacks: () => StarterPacks,
    StatusApplied: () => StatusApplied,
    StatusClosed: () => StatusClosed,
    StatusDraft: () => StatusDraft,
    StatusOpen: () => StatusOpen,
    TidalLogin: () => TidalLogin,
    Time: () => Time,
    Torrent: () => Torrent,
    TorrentComment: () => TorrentComment,
    TransportMethodAnnouncement: () => TransportMethodAnnouncement,
    UserEmojiList: () => UserEmojiList,
    UserGraspList: () => UserGraspList,
    UserStatuses: () => UserStatuses,
    VideoViewEvent: () => VideoViewEvent,
    Voice: () => Voice,
    VoiceComment: () => VoiceComment,
    WebBookmarks: () => WebBookmarks,
    WikiArticle: () => WikiArticle,
    Zap: () => Zap,
    ZapGoal: () => ZapGoal,
    ZapRequest: () => ZapRequest,
    classifyKind: () => classifyKind,
    isAddressableKind: () => isAddressableKind,
    isEphemeralKind: () => isEphemeralKind,
    isKind: () => isKind,
    isRegularKind: () => isRegularKind,
    isReplaceableKind: () => isReplaceableKind,
  },
);
function isRegularKind(kind) {
  return kind < 1e4 && kind !== 0 && kind !== 3;
}
function isReplaceableKind(kind) {
  return kind === 0 || kind === 3 || (1e4 <= kind && kind < 2e4);
}
function isEphemeralKind(kind) {
  return 2e4 <= kind && kind < 3e4;
}
function isAddressableKind(kind) {
  return 3e4 <= kind && kind < 4e4;
}
function classifyKind(kind) {
  if (isRegularKind(kind)) return "regular";
  if (isReplaceableKind(kind)) return "replaceable";
  if (isEphemeralKind(kind)) return "ephemeral";
  if (isAddressableKind(kind)) return "parameterized";
  return "unknown";
}
function isKind(event, kind) {
  const kindAsArray = kind instanceof Array ? kind : [kind];
  return (validateEvent(event) && kindAsArray.includes(event.kind)) || false;
}
var Metadata = 0;
var ShortTextNote = 1;
var RecommendRelay = 2;
var Contacts = 3;
var EncryptedDirectMessage = 4;
var EventDeletion = 5;
var Repost = 6;
var Reaction = 7;
var BadgeAward = 8;
var ChatMessage = 9;
var SimpleGroupThreadedReply = 10;
var ForumThread = 11;
var SimpleGroupReply = 12;
var Seal = 13;
var PrivateDirectMessage = 14;
var FileMessage = 15;
var GenericRepost = 16;
var ReactionToWebsite = 17;
var Photo = 20;
var NormalVideo = 21;
var ShortVideo = 22;
var PublicMessage = 24;
var ChannelCreation = 40;
var ChannelMetadata = 41;
var ChannelMessage = 42;
var ChannelHideMessage = 43;
var ChannelMuteUser = 44;
var PodcastEpisode = 54;
var Chess = 64;
var MergeRequests = 818;
var PollResponse = 1018;
var Bid = 1021;
var BidConfirmation = 1022;
var OpenTimestamps = 1040;
var GiftWrap = 1059;
var FileMetadata = 1063;
var Poll = 1068;
var Comment = 1111;
var Voice = 1222;
var Scroll = 1227;
var VoiceComment = 1244;
var LiveChatMessage = 1311;
var CodeSnippet = 1337;
var Patch = 1617;
var GitPullRequest = 1618;
var GitPullRequestUpdate = 1619;
var Issue = 1621;
var Reply = 1622;
var StatusOpen = 1630;
var StatusApplied = 1631;
var StatusClosed = 1632;
var StatusDraft = 1633;
var ProblemTracker = 1971;
var Report = 1984;
var Reporting = 1984;
var Label = 1985;
var RelayReviews = 1986;
var AIEmbeddings = 1987;
var Torrent = 2003;
var TorrentComment = 2004;
var CoinjoinPool = 2022;
var DecoupledKeyClientAnnouncement = 4454;
var DecoupledEncryptionKeyDistribution = 4455;
var CommunityPostApproval = 4550;
var JobRequest = 5999;
var JobResult = 6999;
var JobFeedback = 7e3;
var ReservedCashuWalletTokens = 7374;
var CashuWalletTokens = 7375;
var CashuWalletHistory = 7376;
var GeocacheLog = 7516;
var GeocacheProofOfFind = 7517;
var SimpleGroupPutUser = 9e3;
var SimpleGroupRemoveUser = 9001;
var SimpleGroupEditMetadata = 9002;
var SimpleGroupDeleteEvent = 9005;
var SimpleGroupCreateGroup = 9007;
var SimpleGroupDeleteGroup = 9008;
var SimpleGroupCreateInvite = 9009;
var SimpleGroupJoinRequest = 9021;
var SimpleGroupLeaveRequest = 9022;
var ZapGoal = 9041;
var NutZap = 9321;
var TidalLogin = 9467;
var ZapRequest = 9734;
var Zap = 9735;
var Highlights = 9802;
var Mutelist = 1e4;
var Pinlist = 10001;
var RelayList = 10002;
var BookmarkList = 10003;
var CommunitiesList = 10004;
var PublicChatsList = 10005;
var BlockedRelaysList = 10006;
var SearchRelaysList = 10007;
var SimpleGroupList = 10009;
var FavoriteRelays = 10012;
var PrivateEventRelayList = 10013;
var InterestsList = 10015;
var NutZapInfo = 10019;
var MediaFollows = 10020;
var UserEmojiList = 10030;
var DecoupledKeyAnnouncement = 10044;
var DirectMessageRelaysList = 10050;
var FavoritePodcasts = 10054;
var BlossomServerList = 10063;
var FileServerPreference = 10096;
var GoodWikiAuthorList = 10101;
var GoodWikiRelayList = 10102;
var PodcastMetadata = 10154;
var AuthoredPodcasts = 10164;
var RelayMonitorAnnouncement = 10166;
var RoomPresence = 10312;
var UserGraspList = 10317;
var ProxyAnnouncement = 10377;
var TransportMethodAnnouncement = 11111;
var NWCWalletInfo = 13194;
var NsiteRoot = 15128;
var CashuWalletEvent = 17375;
var LightningPubRPC = 21e3;
var ClientAuth = 22242;
var NWCWalletRequest = 23194;
var NWCWalletResponse = 23195;
var NostrConnect = 24133;
var BlobsAuth = 24242;
var HTTPAuth = 27235;
var Followsets = 3e4;
var Genericlists = 30001;
var Relaysets = 30002;
var Bookmarksets = 30003;
var Curationsets = 30004;
var CuratedVideoSets = 30005;
var MuteSets = 30007;
var ProfileBadges = 30008;
var BadgeDefinition = 30009;
var Interestsets = 30015;
var CreateOrUpdateStall = 30017;
var CreateOrUpdateProduct = 30018;
var MarketplaceUI = 30019;
var ProductSoldAsAuction = 30020;
var LongFormArticle = 30023;
var DraftLong = 30024;
var Emojisets = 30030;
var ModularArticleHeader = 30040;
var ModularArticleContent = 30041;
var ReleaseArtifactSets = 30063;
var Application = 30078;
var RelayDiscovery = 30166;
var AppCurationSet = 30267;
var LiveEvent = 30311;
var InteractiveRoom = 30312;
var ConferenceEvent = 30313;
var UserStatuses = 30315;
var SlideSet = 30388;
var ClassifiedListing = 30402;
var DraftClassifiedListing = 30403;
var RepositoryAnnouncement = 30617;
var RepositoryState = 30618;
var WikiArticle = 30818;
var Redirects = 30819;
var DraftEvent = 31234;
var LinkSet = 31388;
var Feed = 31890;
var Date2 = 31922;
var Time = 31923;
var Calendar = 31924;
var CalendarEventRSVP = 31925;
var RelayReview = 31987;
var Handlerrecommendation = 31989;
var Handlerinformation = 31990;
var SoftwareApplication = 32267;
var LegacyNsiteFile = 34128;
var VideoViewEvent = 34237;
var CommunityDefinition = 34550;
var NsiteNamed = 35128;
var GeocacheListing = 37515;
var GeocacheLogEntry = 37516;
var CashuMintAnnouncement = 38172;
var FedimintAnnouncement = 38173;
var PeerToPeerOrderEvents = 38383;
var GroupMetadata = 39e3;
var SimpleGroupAdmins = 39001;
var SimpleGroupMembers = 39002;
var SimpleGroupRoles = 39003;
var SimpleGroupLiveKitParticipants = 39004;
var StarterPacks = 39089;
var MediaStarterPacks = 39092;
var WebBookmarks = 39701;
function matchFilter(filter, event) {
  if (filter.ids && filter.ids.indexOf(event.id) === -1) return false;
  if (filter.kinds && filter.kinds.indexOf(event.kind) === -1) return false;
  if (filter.authors && filter.authors.indexOf(event.pubkey) === -1) return false;
  for (let f in filter)
    if (f[0] === "#") {
      let values = filter[`#${f.slice(1)}`];
      if (values && !event.tags.find(([t, v]) => t === f.slice(1) && values.indexOf(v) !== -1))
        return false;
    }
  if (filter.since && event.created_at < filter.since) return false;
  if (filter.until && event.created_at > filter.until) return false;
  return true;
}
function matchFilters(filters, event) {
  for (let i2 = 0; i2 < filters.length; i2++) if (matchFilter(filters[i2], event)) return true;
  return false;
}
__export(
  {},
  {
    getHex64: () => getHex64,
    getInt: () => getInt,
    getSubscriptionId: () => getSubscriptionId,
    matchEventId: () => matchEventId,
    matchEventKind: () => matchEventKind,
    matchEventPubkey: () => matchEventPubkey,
  },
);
function getHex64(json, field) {
  let len = field.length + 3;
  let idx = json.indexOf(`"${field}":`) + len;
  let s = json.slice(idx).indexOf(`"`) + idx + 1;
  return json.slice(s, s + 64);
}
function getInt(json, field) {
  let len = field.length;
  let idx = json.indexOf(`"${field}":`) + len + 3;
  let sliced = json.slice(idx);
  let end = Math.min(sliced.indexOf(","), sliced.indexOf("}"));
  return parseInt(sliced.slice(0, end), 10);
}
function getSubscriptionId(json) {
  let idx = json.slice(0, 22).indexOf(`"EVENT"`);
  if (idx === -1) return null;
  let pstart = json.slice(idx + 7 + 1).indexOf(`"`);
  if (pstart === -1) return null;
  let start = idx + 7 + 1 + pstart;
  let pend = json.slice(start + 1, 80).indexOf(`"`);
  if (pend === -1) return null;
  let end = start + 1 + pend;
  return json.slice(start + 1, end);
}
function matchEventId(json, id) {
  return id === getHex64(json, "id");
}
function matchEventPubkey(json, pubkey) {
  return pubkey === getHex64(json, "pubkey");
}
function matchEventKind(json, kind) {
  return kind === getInt(json, "kind");
}
__export({}, { makeAuthEvent: () => makeAuthEvent });
function makeAuthEvent(relayURL, challenge) {
  return {
    kind: ClientAuth,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", relayURL],
      ["challenge", challenge],
    ],
    content: "",
  };
}
var SendingOnClosedConnection = class extends Error {
  constructor(message, relay) {
    super(`Tried to send message '${message} on a closed connection to ${relay}.`);
    this.name = "SendingOnClosedConnection";
  }
};
var AbstractRelay = class {
  url;
  _connected = false;
  onclose = null;
  onnotice = (msg) => console.debug(`NOTICE from ${this.url}: ${msg}`);
  onauth;
  baseEoseTimeout = 4400;
  publishTimeout = 4400;
  pingFrequency = 29e3;
  pingTimeout = 2e4;
  resubscribeBackoff = [1e4, 1e4, 1e4, 2e4, 2e4, 3e4, 6e4];
  openSubs = /* @__PURE__ */ new Map();
  enablePing;
  enableReconnect;
  idleSince = Date.now();
  ongoingOperations = 0;
  reconnectTimeoutHandle;
  pingIntervalHandle;
  reconnectAttempts = 0;
  skipReconnection = false;
  connectionPromise;
  openCountRequests = /* @__PURE__ */ new Map();
  openEventPublishes = /* @__PURE__ */ new Map();
  ws;
  challenge;
  authPromise;
  serial = 0;
  verifyEvent;
  _WebSocket;
  constructor(url, opts) {
    this.url = normalizeURL(url);
    this.verifyEvent = opts.verifyEvent;
    this._WebSocket = opts.websocketImplementation || WebSocket;
    this.enablePing = opts.enablePing;
    this.enableReconnect = opts.enableReconnect || false;
  }
  static async connect(url, opts) {
    const relay = new AbstractRelay(url, opts);
    await relay.connect(opts);
    return relay;
  }
  closeAllSubscriptions(reason) {
    for (let [_, sub] of this.openSubs) sub.close(reason);
    this.openSubs.clear();
    for (let [_, ep] of this.openEventPublishes) ep.reject(new Error(reason));
    this.openEventPublishes.clear();
    for (let [_, cr] of this.openCountRequests) cr.reject(new Error(reason));
    this.openCountRequests.clear();
  }
  get connected() {
    return this._connected;
  }
  async reconnect() {
    const backoff =
      this.resubscribeBackoff[Math.min(this.reconnectAttempts, this.resubscribeBackoff.length - 1)];
    this.reconnectAttempts++;
    this.reconnectTimeoutHandle = setTimeout(async () => {
      try {
        await this.connect();
      } catch (err) {}
    }, backoff);
  }
  handleHardClose(reason) {
    if (this.pingIntervalHandle) {
      clearInterval(this.pingIntervalHandle);
      this.pingIntervalHandle = void 0;
    }
    this._connected = false;
    this.connectionPromise = void 0;
    this.idleSince = void 0;
    if (this.enableReconnect && !this.skipReconnection) this.reconnect();
    else {
      this.onclose?.();
      this.closeAllSubscriptions(reason);
    }
  }
  async connect(opts) {
    let connectionTimeoutHandle;
    if (this.connectionPromise) return this.connectionPromise;
    this.challenge = void 0;
    this.authPromise = void 0;
    this.skipReconnection = false;
    this.connectionPromise = new Promise((resolve, reject) => {
      if (opts?.timeout)
        connectionTimeoutHandle = setTimeout(() => {
          reject("connection timed out");
          this.connectionPromise = void 0;
          if (this.reconnectAttempts === 0) this.skipReconnection = true;
          this.onclose?.();
          this.handleHardClose("relay connection timed out");
        }, opts.timeout);
      if (opts?.abort) opts.abort.onabort = reject;
      try {
        this.ws = new this._WebSocket(this.url);
      } catch (err) {
        clearTimeout(connectionTimeoutHandle);
        reject(err);
        return;
      }
      this.ws.onopen = () => {
        if (this.reconnectTimeoutHandle) {
          clearTimeout(this.reconnectTimeoutHandle);
          this.reconnectTimeoutHandle = void 0;
        }
        clearTimeout(connectionTimeoutHandle);
        this._connected = true;
        const isReconnection = this.reconnectAttempts > 0;
        this.reconnectAttempts = 0;
        for (const sub of this.openSubs.values()) {
          sub.eosed = false;
          if (isReconnection) {
            for (let f = 0; f < sub.filters.length; f++)
              if (sub.lastEmitted) sub.filters[f].since = sub.lastEmitted + 1;
          }
          sub.fire();
        }
        if (this.enablePing)
          this.pingIntervalHandle = setInterval(() => this.pingpong(), this.pingFrequency);
        resolve();
      };
      this.ws.onerror = () => {
        clearTimeout(connectionTimeoutHandle);
        reject("connection failed");
        this.connectionPromise = void 0;
        if (this.reconnectAttempts === 0) this.skipReconnection = true;
        this.onclose?.();
        this.handleHardClose("relay connection failed");
      };
      this.ws.onclose = (ev) => {
        clearTimeout(connectionTimeoutHandle);
        reject(ev.message || "websocket closed");
        this.handleHardClose("relay connection closed");
      };
      this.ws.onmessage = this._onmessage.bind(this);
    });
    return this.connectionPromise;
  }
  waitForPingPong() {
    return new Promise((resolve) => {
      this.ws.once("pong", () => resolve(true));
      this.ws.ping();
    });
  }
  waitForDummyReq() {
    return new Promise((resolve, reject) => {
      if (!this.connectionPromise)
        return reject(/* @__PURE__ */ new Error(`no connection to ${this.url}, can't ping`));
      try {
        const sub = this.subscribe(
          [
            {
              ids: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
              limit: 0,
            },
          ],
          {
            label: "<forced-ping>",
            oneose: () => {
              resolve(true);
              sub.close();
            },
            onclose() {
              resolve(true);
            },
            eoseTimeout: this.pingTimeout + 1e3,
          },
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  async pingpong() {
    if (this.ws?.readyState === 1) {
      if (
        !(await Promise.any([
          this.ws && this.ws.ping && this.ws.once ? this.waitForPingPong() : this.waitForDummyReq(),
          new Promise((res) => setTimeout(() => res(false), this.pingTimeout)),
        ]))
      ) {
        if (this.ws?.readyState === this._WebSocket.OPEN) this.ws?.close();
      }
    }
  }
  async send(message) {
    if (!this.connectionPromise) throw new SendingOnClosedConnection(message, this.url);
    this.connectionPromise.then(() => {
      this.ws?.send(message);
    });
  }
  async auth(signAuthEvent) {
    const challenge = this.challenge;
    if (!challenge) throw new Error("can't perform auth, no challenge was received");
    if (this.authPromise) return this.authPromise;
    this.authPromise = new Promise(async (resolve, reject) => {
      try {
        let evt = await signAuthEvent(makeAuthEvent(this.url, challenge));
        let timeout = setTimeout(() => {
          let ep = this.openEventPublishes.get(evt.id);
          if (ep) {
            ep.reject(/* @__PURE__ */ new Error("auth timed out"));
            this.openEventPublishes.delete(evt.id);
          }
        }, this.publishTimeout);
        this.openEventPublishes.set(evt.id, {
          resolve,
          reject,
          timeout,
        });
        this.send('["AUTH",' + JSON.stringify(evt) + "]");
      } catch (err) {
        console.warn("subscribe auth function failed:", err);
      }
    });
    return this.authPromise;
  }
  async publish(event) {
    this.idleSince = void 0;
    this.ongoingOperations++;
    const ret = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const ep = this.openEventPublishes.get(event.id);
        if (ep) {
          ep.reject(/* @__PURE__ */ new Error("publish timed out"));
          this.openEventPublishes.delete(event.id);
        }
      }, this.publishTimeout);
      this.openEventPublishes.set(event.id, {
        resolve,
        reject,
        timeout,
      });
    });
    try {
      await this.send('["EVENT",' + JSON.stringify(event) + "]");
    } catch (err) {
      const ep = this.openEventPublishes.get(event.id);
      if (ep) {
        ep.reject(err);
        this.openEventPublishes.delete(event.id);
      }
    }
    this.ongoingOperations--;
    if (this.ongoingOperations === 0) this.idleSince = Date.now();
    return ret;
  }
  async count(filters, params) {
    return (await this.countWithHLL(filters, params)).count;
  }
  async countWithHLL(filters, params) {
    this.serial++;
    const id = params?.id || "count:" + this.serial;
    const ret = new Promise((resolve, reject) => {
      this.openCountRequests.set(id, {
        resolve,
        reject,
      });
    });
    try {
      await this.send('["COUNT","' + id + '",' + JSON.stringify(filters).substring(1));
    } catch (err) {
      const cr = this.openCountRequests.get(id);
      if (cr) {
        cr.reject(err);
        this.openCountRequests.delete(id);
      }
    }
    return ret;
  }
  subscribe(filters, params) {
    if (params.label !== "<forced-ping>") {
      this.idleSince = void 0;
      this.ongoingOperations++;
    }
    const sub = this.prepareSubscription(filters, params);
    sub.fire();
    if (params.abort)
      params.abort.onabort = () => sub.close(String(params.abort.reason || "<aborted>"));
    return sub;
  }
  prepareSubscription(filters, params) {
    this.serial++;
    const id = params.id || (params.label ? params.label + ":" : "sub:") + this.serial;
    const sub = new Subscription(this, id, filters, params);
    this.openSubs.set(id, sub);
    return sub;
  }
  close() {
    this.skipReconnection = true;
    if (this.reconnectTimeoutHandle) {
      clearTimeout(this.reconnectTimeoutHandle);
      this.reconnectTimeoutHandle = void 0;
    }
    if (this.pingIntervalHandle) {
      clearInterval(this.pingIntervalHandle);
      this.pingIntervalHandle = void 0;
    }
    this.closeAllSubscriptions("relay connection closed by us");
    this._connected = false;
    this.idleSince = void 0;
    this.onclose?.();
    if (this.ws?.readyState === this._WebSocket.OPEN) this.ws?.close();
  }
  _onmessage(ev) {
    const json = ev.data;
    if (!json) return;
    const subid = getSubscriptionId(json);
    if (subid) {
      const so = this.openSubs.get(subid);
      if (!so) return;
      const id = getHex64(json, "id");
      const alreadyHave = so.alreadyHaveEvent?.(id);
      so.receivedEvent?.(this, id);
      if (alreadyHave) return;
    }
    try {
      let data = JSON.parse(json);
      switch (data[0]) {
        case "EVENT": {
          const so = this.openSubs.get(data[1]);
          const event = data[2];
          if (this.verifyEvent(event) && matchFilters(so.filters, event)) so.onevent(event);
          else so.oninvalidevent?.(event);
          if (!so.lastEmitted || so.lastEmitted < event.created_at)
            so.lastEmitted = event.created_at;
          return;
        }
        case "COUNT": {
          const id = data[1];
          const payload = data[2];
          const cr = this.openCountRequests.get(id);
          if (cr) {
            cr.resolve(payload);
            this.openCountRequests.delete(id);
          }
          return;
        }
        case "EOSE": {
          const so = this.openSubs.get(data[1]);
          if (!so) return;
          so.receivedEose();
          return;
        }
        case "OK": {
          const id = data[1];
          const ok = data[2];
          const reason = data[3];
          const ep = this.openEventPublishes.get(id);
          if (ep) {
            clearTimeout(ep.timeout);
            if (ok) ep.resolve(reason);
            else ep.reject(new Error(reason));
            this.openEventPublishes.delete(id);
          }
          return;
        }
        case "CLOSED": {
          const id = data[1];
          const so = this.openSubs.get(id);
          if (!so) {
            const cr = this.openCountRequests.get(id);
            if (cr) {
              cr.reject(new Error(data[2]));
              this.openCountRequests.delete(id);
            }
            return;
          }
          so.closed = true;
          so.close(data[2]);
          return;
        }
        case "NOTICE":
          this.onnotice(data[1]);
          return;
        case "AUTH":
          this.challenge = data[1];
          if (this.onauth)
            this.auth(this.onauth).catch((err) => {
              if (!(err instanceof SendingOnClosedConnection)) throw err;
            });
          return;
        default:
          this.openSubs.get(data[1])?.oncustom?.(data);
          return;
      }
    } catch (err) {
      try {
        const [_, __, event] = JSON.parse(json);
        console.warn(`[nostr] relay ${this.url} error processing message:`, err, event);
      } catch (_) {
        console.warn(`[nostr] relay ${this.url} error processing message:`, err);
      }
      return;
    }
  }
};
var Subscription = class {
  relay;
  id;
  lastEmitted;
  closed = false;
  eosed = false;
  filters;
  alreadyHaveEvent;
  receivedEvent;
  onevent;
  oninvalidevent;
  oneose;
  onclose;
  oncustom;
  eoseTimeout;
  eoseTimeoutHandle;
  constructor(relay, id, filters, params) {
    if (filters.length === 0) throw new Error("subscription can't be created with zero filters");
    this.relay = relay;
    this.filters = filters;
    this.id = id;
    this.alreadyHaveEvent = params.alreadyHaveEvent;
    this.receivedEvent = params.receivedEvent;
    this.eoseTimeout = params.eoseTimeout || relay.baseEoseTimeout;
    this.oneose = params.oneose;
    this.onclose = params.onclose;
    this.oninvalidevent = params.oninvalidevent;
    this.onevent =
      params.onevent ||
      ((event) => {
        console.warn(
          `onevent() callback not defined for subscription '${this.id}' in relay ${this.relay.url}. event received:`,
          event,
        );
      });
  }
  fire() {
    this.relay.send('["REQ","' + this.id + '",' + JSON.stringify(this.filters).substring(1));
    this.eoseTimeoutHandle = setTimeout(this.receivedEose.bind(this), this.eoseTimeout);
  }
  receivedEose() {
    if (this.eosed) return;
    clearTimeout(this.eoseTimeoutHandle);
    this.eosed = true;
    this.oneose?.();
  }
  close(reason = "closed by caller") {
    if (!this.closed && this.relay.connected) {
      try {
        this.relay.send('["CLOSE",' + JSON.stringify(this.id) + "]");
      } catch (err) {
        if (err instanceof SendingOnClosedConnection) {
        } else throw err;
      }
      this.closed = true;
    }
    this.relay.openSubs.delete(this.id);
    this.relay.ongoingOperations--;
    if (this.relay.ongoingOperations === 0) this.relay.idleSince = Date.now();
    this.onclose?.(reason);
  }
};
var alwaysTrue = (t) => {
  t[verifiedSymbol] = true;
  return true;
};
var M = 256;
var HLL_HEX_LENGTH = M * 2;
new TextEncoder();
function getCountManyFilter(target, directive) {
  switch (directive) {
    case "reactions":
      return {
        "#e": [target],
        kinds: [7],
      };
    case "reposts":
      return {
        "#e": [target],
        kinds: [6],
      };
    case "quotes":
      return {
        "#q": [target],
        kinds: [1, 1111],
      };
    case "replies":
      return {
        "#e": [target],
        kinds: [1],
      };
    case "comments":
      return {
        "#E": [target],
        kinds: [1111],
      };
    case "followers":
      return {
        "#p": [target],
        kinds: [3],
      };
  }
}
function newHll() {
  return new Uint8Array(M);
}
function hllDecode(hex) {
  if (hex.length !== HLL_HEX_LENGTH || !/^[0-9a-fA-F]+$/.test(hex)) return void 0;
  const registers = new Uint8Array(M);
  for (let i2 = 0; i2 < M; i2++) registers[i2] = parseInt(hex.slice(i2 * 2, i2 * 2 + 2), 16);
  return registers;
}
function hllEncode(registers) {
  if (registers.length !== M) throw new Error(`invalid number of registers ${registers.length}`);
  let hex = "";
  for (let i2 = 0; i2 < M; i2++) hex += registers[i2].toString(16).padStart(2, "0");
  return hex;
}
function mergeHll(target, source) {
  if (target.length === 0) target = newHll();
  if (target.length !== M) throw new Error(`invalid number of registers ${target.length}`);
  if (source.length !== M) throw new Error(`invalid number of registers ${source.length}`);
  for (let i2 = 0; i2 < M; i2++) if (source[i2] > target[i2]) target[i2] = source[i2];
  return target;
}
var AbstractSimplePool = class {
  relays = /* @__PURE__ */ new Map();
  seenOn = /* @__PURE__ */ new Map();
  trackRelays = false;
  verifyEvent;
  enablePing;
  enableReconnect;
  automaticallyAuth;
  trustedRelayURLs = /* @__PURE__ */ new Set();
  onRelayConnectionFailure;
  onRelayConnectionSuccess;
  allowConnectingToRelay;
  maxWaitForConnection;
  _WebSocket;
  constructor(opts) {
    this.verifyEvent = opts.verifyEvent;
    this._WebSocket = opts.websocketImplementation;
    this.enablePing = opts.enablePing;
    this.enableReconnect = opts.enableReconnect || false;
    this.automaticallyAuth = opts.automaticallyAuth;
    this.onRelayConnectionFailure = opts.onRelayConnectionFailure;
    this.onRelayConnectionSuccess = opts.onRelayConnectionSuccess;
    this.allowConnectingToRelay = opts.allowConnectingToRelay;
    this.maxWaitForConnection = opts.maxWaitForConnection || 3e3;
  }
  async ensureRelay(url, params) {
    url = normalizeURL(url);
    let relay = this.relays.get(url);
    if (!relay) {
      relay = new AbstractRelay(url, {
        verifyEvent: this.trustedRelayURLs.has(url) ? alwaysTrue : this.verifyEvent,
        websocketImplementation: this._WebSocket,
        enablePing: this.enablePing,
        enableReconnect: this.enableReconnect,
      });
      relay.onclose = () => {
        this.relays.delete(url);
      };
      this.relays.set(url, relay);
    }
    if (this.automaticallyAuth) {
      const authSignerFn = this.automaticallyAuth(url);
      if (authSignerFn) relay.onauth = authSignerFn;
    }
    try {
      await relay.connect({
        timeout: params?.connectionTimeout,
        abort: params?.abort,
      });
    } catch (err) {
      this.relays.delete(url);
      throw err;
    }
    return relay;
  }
  close(relays) {
    relays.map(normalizeURL).forEach((url) => {
      this.relays.get(url)?.close();
      this.relays.delete(url);
    });
  }
  subscribe(relays, filter, params) {
    const request = [];
    const uniqUrls = [];
    for (let i2 = 0; i2 < relays.length; i2++) {
      const url = normalizeURL(relays[i2]);
      if (!request.find((r) => r.url === url)) {
        if (uniqUrls.indexOf(url) === -1) {
          uniqUrls.push(url);
          request.push({
            url,
            filter,
          });
        }
      }
    }
    return this.subscribeMap(request, params);
  }
  subscribeMany(relays, filter, params) {
    return this.subscribe(relays, filter, params);
  }
  subscribeMap(requests, params) {
    const grouped = /* @__PURE__ */ new Map();
    for (const req of requests) {
      const { url, filter } = req;
      if (!grouped.has(url)) grouped.set(url, []);
      grouped.get(url).push(filter);
    }
    const groupedRequests = Array.from(grouped.entries()).map(([url, filters]) => ({
      url,
      filters,
    }));
    if (this.trackRelays)
      params.receivedEvent = (relay, id) => {
        let set = this.seenOn.get(id);
        if (!set) {
          set = /* @__PURE__ */ new Set();
          this.seenOn.set(id, set);
        }
        set.add(relay);
      };
    const _knownIds = /* @__PURE__ */ new Set();
    const subs = [];
    const eosesReceived = [];
    let handleEose = (i2) => {
      if (eosesReceived[i2]) return;
      eosesReceived[i2] = true;
      if (eosesReceived.filter((a) => a).length === groupedRequests.length) {
        params.oneose?.();
        handleEose = () => {};
      }
    };
    const closesReceived = [];
    let handleClose = (i2, reason) => {
      if (closesReceived[i2]) return;
      handleEose(i2);
      closesReceived[i2] = reason;
      if (closesReceived.filter((a) => a).length === groupedRequests.length) {
        params.onclose?.(closesReceived);
        handleClose = () => {};
      }
    };
    const localAlreadyHaveEventHandler = (id) => {
      if (params.alreadyHaveEvent?.(id)) return true;
      const have = _knownIds.has(id);
      _knownIds.add(id);
      return have;
    };
    const allOpened = Promise.all(
      groupedRequests.map(async ({ url, filters }, i2) => {
        if (this.allowConnectingToRelay?.(url, ["read", filters]) === false) {
          handleClose(i2, "connection skipped by allowConnectingToRelay");
          return;
        }
        let relay;
        try {
          relay = await this.ensureRelay(url, {
            connectionTimeout:
              this.maxWaitForConnection < (params.maxWait || 0)
                ? Math.max(params.maxWait * 0.8, params.maxWait - 1e3)
                : this.maxWaitForConnection,
            abort: params.abort,
          });
        } catch (err) {
          this.onRelayConnectionFailure?.(url);
          handleClose(i2, err?.message || String(err));
          return;
        }
        this.onRelayConnectionSuccess?.(url);
        let subscription = relay.subscribe(filters, {
          ...params,
          oneose: () => handleEose(i2),
          onclose: (reason) => {
            if (reason.startsWith("auth-required: ") && params.onauth)
              relay
                .auth(params.onauth)
                .then(() => {
                  relay.subscribe(filters, {
                    ...params,
                    oneose: () => handleEose(i2),
                    onclose: (reason2) => {
                      handleClose(i2, reason2);
                    },
                    alreadyHaveEvent: localAlreadyHaveEventHandler,
                    eoseTimeout: params.maxWait,
                    abort: params.abort,
                  });
                })
                .catch((err) => {
                  handleClose(i2, `auth was required and attempted, but failed with: ${err}`);
                });
            else handleClose(i2, reason);
          },
          alreadyHaveEvent: localAlreadyHaveEventHandler,
          eoseTimeout: params.maxWait,
          abort: params.abort,
        });
        subs.push(subscription);
      }),
    );
    return {
      async close(reason) {
        await allOpened;
        subs.forEach((sub) => {
          sub.close(reason);
        });
      },
    };
  }
  subscribeEose(relays, filter, params) {
    let subcloser;
    subcloser = this.subscribe(relays, filter, {
      ...params,
      oneose() {
        const reason = "closed automatically on eose";
        if (subcloser) subcloser.close(reason);
        else params.onclose?.(relays.map((_) => reason));
      },
    });
    return subcloser;
  }
  subscribeManyEose(relays, filter, params) {
    return this.subscribeEose(relays, filter, params);
  }
  async querySync(relays, filter, params) {
    return new Promise(async (resolve) => {
      const events = [];
      this.subscribeEose(relays, filter, {
        ...params,
        onevent(event) {
          events.push(event);
        },
        onclose(_) {
          resolve(events);
        },
      });
    });
  }
  async get(relays, filter, params) {
    filter.limit = 1;
    const events = await this.querySync(relays, filter, params);
    events.sort((a, b) => b.created_at - a.created_at);
    return events[0] || null;
  }
  async countMany(relays, target, directive, params) {
    const filter = getCountManyFilter(target, directive);
    const urls = [];
    for (let i2 = 0; i2 < relays.length; i2++) {
      const url = normalizeURL(relays[i2]);
      if (urls.indexOf(url) === -1) urls.push(url);
    }
    const responses = await Promise.all(
      urls.map(async (url) => {
        if (this.allowConnectingToRelay?.(url, ["read", [filter]]) === false) return null;
        let relay;
        try {
          relay = await this.ensureRelay(url, {
            connectionTimeout:
              this.maxWaitForConnection < (params?.maxWait || 0)
                ? Math.max(params.maxWait * 0.8, params.maxWait - 1e3)
                : this.maxWaitForConnection,
            abort: params?.abort,
          });
        } catch (err) {
          this.onRelayConnectionFailure?.(url);
          return null;
        }
        this.onRelayConnectionSuccess?.(url);
        return relay.countWithHLL([filter], { id: params?.id }).catch(() => null);
      }),
    );
    let count = 0;
    let hll;
    for (const response of responses) {
      if (!response) continue;
      if (response.count > count) count = response.count;
      if (!response.hll || response.hll.length !== 512) continue;
      const registers = hllDecode(response.hll);
      if (!registers) continue;
      hll = mergeHll(hll || /* @__PURE__ */ new Uint8Array(0), registers);
    }
    return hll
      ? {
          count,
          hll: hllEncode(hll),
        }
      : { count };
  }
  publish(relays, event, params) {
    return relays.map(normalizeURL).map(async (url, i2, arr) => {
      if (arr.indexOf(url) !== i2) return Promise.reject("duplicate url");
      if (this.allowConnectingToRelay?.(url, ["write", event]) === false)
        return Promise.reject("connection skipped by allowConnectingToRelay");
      let r;
      try {
        r = await this.ensureRelay(url, {
          connectionTimeout:
            this.maxWaitForConnection < (params?.maxWait || 0)
              ? Math.max(params.maxWait * 0.8, params.maxWait - 1e3)
              : this.maxWaitForConnection,
          abort: params?.abort,
        });
      } catch (err) {
        this.onRelayConnectionFailure?.(url);
        return String("connection failure: " + String(err));
      }
      return r
        .publish(event)
        .catch(async (err) => {
          if (err instanceof Error && err.message.startsWith("auth-required: ") && params?.onauth) {
            await r.auth(params.onauth);
            return r.publish(event);
          }
          throw err;
        })
        .then((reason) => {
          if (this.trackRelays) {
            let set = this.seenOn.get(event.id);
            if (!set) {
              set = /* @__PURE__ */ new Set();
              this.seenOn.set(event.id, set);
            }
            set.add(r);
          }
          return reason;
        });
    });
  }
  listConnectionStatus() {
    const map = /* @__PURE__ */ new Map();
    this.relays.forEach((relay, url) => map.set(url, relay.connected));
    return map;
  }
  destroy() {
    this.relays.forEach((conn) => conn.close());
    this.relays = /* @__PURE__ */ new Map();
  }
  pruneIdleRelays(idleThresholdMs = 1e4) {
    const prunedUrls = [];
    for (const [url, relay] of this.relays)
      if (relay.idleSince && Date.now() - relay.idleSince >= idleThresholdMs) {
        this.relays.delete(url);
        prunedUrls.push(url);
        relay.close();
      }
    return prunedUrls;
  }
};
var _WebSocket2;
try {
  _WebSocket2 = WebSocket;
} catch {}
var SimplePool = class extends AbstractSimplePool {
  constructor(options) {
    super({
      verifyEvent,
      websocketImplementation: _WebSocket2,
      maxWaitForConnection: 3e3,
      ...options,
    });
  }
};
var nip19_exports = {};
__export(nip19_exports, {
  BECH32_REGEX: () => BECH32_REGEX,
  Bech32MaxSize: () => Bech32MaxSize,
  NostrTypeGuard: () => NostrTypeGuard,
  decode: () => decode,
  decodeNostrURI: () => decodeNostrURI,
  encodeBytes: () => encodeBytes,
  naddrEncode: () => naddrEncode,
  neventEncode: () => neventEncode,
  noteEncode: () => noteEncode,
  nprofileEncode: () => nprofileEncode,
  npubEncode: () => npubEncode,
  nsecEncode: () => nsecEncode,
});
var NostrTypeGuard = {
  isNProfile: (value) => /^nprofile1[a-z\d]+$/.test(value || ""),
  isNEvent: (value) => /^nevent1[a-z\d]+$/.test(value || ""),
  isNAddr: (value) => /^naddr1[a-z\d]+$/.test(value || ""),
  isNSec: (value) => /^nsec1[a-z\d]{58}$/.test(value || ""),
  isNPub: (value) => /^npub1[a-z\d]{58}$/.test(value || ""),
  isNote: (value) => /^note1[a-z\d]+$/.test(value || ""),
  isNcryptsec: (value) => /^ncryptsec1[a-z\d]+$/.test(value || ""),
};
var Bech32MaxSize = 5e3;
var BECH32_REGEX = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
function integerToUint8Array(number) {
  const uint8Array = /* @__PURE__ */ new Uint8Array(4);
  uint8Array[0] = (number >> 24) & 255;
  uint8Array[1] = (number >> 16) & 255;
  uint8Array[2] = (number >> 8) & 255;
  uint8Array[3] = number & 255;
  return uint8Array;
}
function decodeNostrURI(nip19code) {
  try {
    if (nip19code.startsWith("nostr:")) nip19code = nip19code.substring(6);
    return decode(nip19code);
  } catch (_err) {
    return {
      type: "invalid",
      data: null,
    };
  }
}
function decode(code) {
  let { prefix, words } = bech32.decode(code, Bech32MaxSize);
  let data = new Uint8Array(bech32.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0]) throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: bytesToHex(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
        },
      };
    }
    case "nevent": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0]) throw new Error("missing TLV 0 for nevent");
      if (tlv[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
      if (tlv[2] && tlv[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
      if (tlv[3] && tlv[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "nevent",
        data: {
          id: bytesToHex(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
          author: tlv[2]?.[0] ? bytesToHex(tlv[2][0]) : void 0,
          kind: tlv[3]?.[0] ? parseInt(bytesToHex(tlv[3][0]), 16) : void 0,
        },
      };
    }
    case "naddr": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0]) throw new Error("missing TLV 0 for naddr");
      if (!tlv[2]?.[0]) throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
      if (!tlv[3]?.[0]) throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder.decode(tlv[0][0]),
          pubkey: bytesToHex(tlv[2][0]),
          kind: parseInt(bytesToHex(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
        },
      };
    }
    case "nsec":
      return {
        type: prefix,
        data,
      };
    case "npub":
    case "note":
      return {
        type: prefix,
        data: bytesToHex(data),
      };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}
function parseTLV(data) {
  let result = {};
  let rest = data;
  while (rest.length > 0) {
    if (rest.length < 2) throw new Error("not enough data to read TLV");
    let t = rest[0];
    let l = rest[1];
    let v = rest.slice(2, 2 + l);
    rest = rest.slice(2 + l);
    if (v.length < l) throw new Error(`not enough data to read on TLV ${t}`);
    result[t] = result[t] || [];
    result[t].push(v);
  }
  return result;
}
function nsecEncode(key) {
  return encodeBytes("nsec", key);
}
function npubEncode(hex) {
  return encodeBytes("npub", hexToBytes(hex));
}
function noteEncode(hex) {
  return encodeBytes("note", hexToBytes(hex));
}
function encodeBech32(prefix, data) {
  let words = bech32.toWords(data);
  return bech32.encode(prefix, words, Bech32MaxSize);
}
function encodeBytes(prefix, bytes) {
  return encodeBech32(prefix, bytes);
}
function nprofileEncode(profile) {
  return encodeBech32(
    "nprofile",
    encodeTLV({
      0: [hexToBytes(profile.pubkey)],
      1: (profile.relays || []).map((url) => utf8Encoder.encode(url)),
    }),
  );
}
function neventEncode(event) {
  let kindArray;
  if (event.kind !== void 0) kindArray = integerToUint8Array(event.kind);
  return encodeBech32(
    "nevent",
    encodeTLV({
      0: [hexToBytes(event.id)],
      1: (event.relays || []).map((url) => utf8Encoder.encode(url)),
      2: event.author ? [hexToBytes(event.author)] : [],
      3: kindArray ? [new Uint8Array(kindArray)] : [],
    }),
  );
}
function naddrEncode(addr) {
  let kind = /* @__PURE__ */ new ArrayBuffer(4);
  new DataView(kind).setUint32(0, addr.kind, false);
  return encodeBech32(
    "naddr",
    encodeTLV({
      0: [utf8Encoder.encode(addr.identifier)],
      1: (addr.relays || []).map((url) => utf8Encoder.encode(url)),
      2: [hexToBytes(addr.pubkey)],
      3: [new Uint8Array(kind)],
    }),
  );
}
function encodeTLV(tlv) {
  let entries = [];
  Object.entries(tlv)
    .reverse()
    .forEach(([t, vs]) => {
      vs.forEach((v) => {
        let entry = new Uint8Array(v.length + 2);
        entry.set([parseInt(t)], 0);
        entry.set([v.length], 1);
        entry.set(v, 2);
        entries.push(entry);
      });
    });
  return concatBytes(...entries);
}
__export(
  {},
  {
    decrypt: () => decrypt,
    encrypt: () => encrypt,
  },
);
function encrypt(secretKey, pubkey, text) {
  const privkey = secretKey instanceof Uint8Array ? secretKey : hexToBytes(secretKey);
  const normalizedKey = getNormalizedX(
    secp256k1.getSharedSecret(privkey, hexToBytes("02" + pubkey)),
  );
  let iv = Uint8Array.from(randomBytes(16));
  let plaintext = utf8Encoder.encode(text);
  let ciphertext = cbc(normalizedKey, iv).encrypt(plaintext);
  return `${base64.encode(new Uint8Array(ciphertext))}?iv=${base64.encode(new Uint8Array(iv.buffer))}`;
}
function decrypt(secretKey, pubkey, data) {
  const privkey = secretKey instanceof Uint8Array ? secretKey : hexToBytes(secretKey);
  let [ctb64, ivb64] = data.split("?iv=");
  let normalizedKey = getNormalizedX(secp256k1.getSharedSecret(privkey, hexToBytes("02" + pubkey)));
  let iv = base64.decode(ivb64);
  let ciphertext = base64.decode(ctb64);
  let plaintext = cbc(normalizedKey, iv).decrypt(ciphertext);
  return utf8Decoder.decode(plaintext);
}
function getNormalizedX(key) {
  return key.slice(1, 33);
}
__export(
  {},
  {
    NIP05_REGEX: () => NIP05_REGEX,
    isNip05: () => isNip05,
    isValid: () => isValid,
    queryProfile: () => queryProfile,
    searchDomain: () => searchDomain,
    useFetchImplementation: () => useFetchImplementation,
  },
);
var NIP05_REGEX = /^(?:([\w.+-]+)@)?([\w_-]+(\.[\w_-]+)+)$/;
var isNip05 = (value) => NIP05_REGEX.test(value || "");
var _fetch;
try {
  _fetch = fetch;
} catch (_) {}
function useFetchImplementation(fetchImplementation) {
  _fetch = fetchImplementation;
}
async function searchDomain(domain, query = "") {
  try {
    const url = `https://${domain}/.well-known/nostr.json?name=${query}`;
    const res = await _fetch(url, { redirect: "manual" });
    if (res.status !== 200) throw Error("Wrong response code");
    return (await res.json()).names;
  } catch (_) {
    return {};
  }
}
async function queryProfile(fullname) {
  const match = fullname.match(NIP05_REGEX);
  if (!match) return null;
  const [, name = "_", domain] = match;
  try {
    const url = `https://${domain}/.well-known/nostr.json?name=${name}`;
    const res = await _fetch(url, { redirect: "manual" });
    if (res.status !== 200) throw Error("Wrong response code");
    const json = await res.json();
    const pubkey = json.names[name];
    return pubkey
      ? {
          pubkey,
          relays: json.relays?.[pubkey],
        }
      : null;
  } catch (_e) {
    return null;
  }
}
async function isValid(pubkey, nip05) {
  const res = await queryProfile(nip05);
  return res ? res.pubkey === pubkey : false;
}
__export({}, { parse: () => parse });
var HEX64 = /^[0-9a-fA-F]{64}$/;
function parse(event) {
  const result = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: [],
    quotes: [],
  };
  let maybeParent;
  let maybeRoot;
  for (let i2 = event.tags.length - 1; i2 >= 0; i2--) {
    const tag = event.tags[i2];
    if (tag[0] === "e" && tag[1] && HEX64.test(tag[1])) {
      const [_, eTagEventId, eTagRelayUrl, eTagMarker, eTagAuthor] = tag;
      const eventPointer = {
        id: eTagEventId,
        relays: eTagRelayUrl ? [eTagRelayUrl] : [],
        author: eTagAuthor && HEX64.test(eTagAuthor) ? eTagAuthor : void 0,
      };
      if (eTagMarker === "root") {
        result.root = eventPointer;
        continue;
      }
      if (eTagMarker === "reply") {
        result.reply = eventPointer;
        continue;
      }
      if (eTagMarker === "mention") {
        result.mentions.push(eventPointer);
        continue;
      }
      if (!maybeParent) maybeParent = eventPointer;
      else maybeRoot = eventPointer;
      result.mentions.push(eventPointer);
      continue;
    }
    if (tag[0] === "q" && tag[1] && HEX64.test(tag[1])) {
      const [_, eTagEventId, eTagRelayUrl] = tag;
      result.quotes.push({
        id: eTagEventId,
        relays: eTagRelayUrl ? [eTagRelayUrl] : [],
      });
    }
    if (tag[0] === "p" && tag[1] && HEX64.test(tag[1])) {
      result.profiles.push({
        pubkey: tag[1],
        relays: tag[2] ? [tag[2]] : [],
      });
      continue;
    }
  }
  if (!result.root) result.root = maybeRoot || maybeParent || result.reply;
  if (!result.reply) result.reply = maybeParent || result.root;
  [result.reply, result.root].forEach((ref) => {
    if (!ref) return;
    let idx = result.mentions.indexOf(ref);
    if (idx !== -1) result.mentions.splice(idx, 1);
    if (ref.author) {
      let author = result.profiles.find((p) => p.pubkey === ref.author);
      if (author && author.relays) {
        if (!ref.relays) ref.relays = [];
        author.relays.forEach((url) => {
          if (ref.relays?.indexOf(url) === -1) ref.relays.push(url);
        });
        author.relays = ref.relays;
      }
    }
  });
  result.mentions.forEach((ref) => {
    if (ref.author) {
      let author = result.profiles.find((p) => p.pubkey === ref.author);
      if (author && author.relays) {
        if (!ref.relays) ref.relays = [];
        author.relays.forEach((url) => {
          if (ref.relays.indexOf(url) === -1) ref.relays.push(url);
        });
        author.relays = ref.relays;
      }
    }
  });
  return result;
}
__export(
  {},
  {
    fetchRelayInformation: () => fetchRelayInformation,
    useFetchImplementation: () => useFetchImplementation2,
  },
);
function useFetchImplementation2(fetchImplementation) {}
async function fetchRelayInformation(url) {
  return await (
    await fetch(url.replace("ws://", "http://").replace("wss://", "https://"), {
      headers: { Accept: "application/nostr+json" },
    })
  ).json();
}
__export(
  {},
  {
    getPow: () => getPow,
    minePow: () => minePow,
  },
);
function getPow(hex) {
  let count = 0;
  for (let i2 = 0; i2 < 64; i2 += 8) {
    const nibble = parseInt(hex.substring(i2, i2 + 8), 16);
    if (nibble === 0) count += 32;
    else {
      count += Math.clz32(nibble);
      break;
    }
  }
  return count;
}
function getPowFromBytes(hash) {
  let count = 0;
  for (let i2 = 0; i2 < hash.length; i2++) {
    const byte = hash[i2];
    if (byte === 0) count += 8;
    else {
      count += Math.clz32(byte) - 24;
      break;
    }
  }
  return count;
}
function minePow(unsigned, difficulty) {
  let count = 0;
  const event = unsigned;
  const tag = ["nonce", count.toString(), difficulty.toString()];
  event.tags.push(tag);
  while (true) {
    const now2 = Math.floor(/* @__PURE__ */ new Date().getTime() / 1e3);
    if (now2 !== event.created_at) {
      count = 0;
      event.created_at = now2;
    }
    tag[1] = (++count).toString();
    const hash = sha256(
      utf8Encoder.encode(
        JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]),
      ),
    );
    if (getPowFromBytes(hash) >= difficulty) {
      event.id = bytesToHex(hash);
      break;
    }
  }
  return event;
}
__export(
  {},
  {
    unwrapEvent: () => unwrapEvent2,
    unwrapManyEvents: () => unwrapManyEvents2,
    wrapEvent: () => wrapEvent2,
    wrapManyEvents: () => wrapManyEvents2,
  },
);
__export(
  {},
  {
    createRumor: () => createRumor,
    createSeal: () => createSeal,
    createWrap: () => createWrap,
    unwrapEvent: () => unwrapEvent,
    unwrapManyEvents: () => unwrapManyEvents,
    wrapEvent: () => wrapEvent,
    wrapManyEvents: () => wrapManyEvents,
  },
);
__export(
  {},
  {
    decrypt: () => decrypt2,
    encrypt: () => encrypt2,
    getConversationKey: () => getConversationKey,
    v2: () => v2,
  },
);
var minPlaintextSize = 1;
var maxPlaintextSize = 4294967295;
var extendedPrefixThreshold = 65536;
function getConversationKey(privkeyA, pubkeyB) {
  return extract(
    sha256,
    secp256k1.getSharedSecret(privkeyA, hexToBytes("02" + pubkeyB)).subarray(1, 33),
    utf8Encoder.encode("nip44-v2"),
  );
}
function getMessageKeys(conversationKey, nonce) {
  const keys = expand(sha256, conversationKey, nonce, 76);
  return {
    chacha_key: keys.subarray(0, 32),
    chacha_nonce: keys.subarray(32, 44),
    hmac_key: keys.subarray(44, 76),
  };
}
function calcPaddedLen(len) {
  if (!Number.isSafeInteger(len) || len < 1) throw new Error("expected positive integer");
  if (len <= 32) return 32;
  const nextPower = 2 ** (Math.floor(Math.log2(len - 1)) + 1);
  const chunk = nextPower <= 256 ? 32 : nextPower / 8;
  return chunk * (Math.floor((len - 1) / chunk) + 1);
}
function writeU16BE(num) {
  if (!Number.isSafeInteger(num) || num < minPlaintextSize || num > 65535)
    throw new Error("invalid plaintext size: must be between 1 and 65535 bytes");
  const arr = /* @__PURE__ */ new Uint8Array(2);
  new DataView(arr.buffer).setUint16(0, num, false);
  return arr;
}
function writeU32BE(num) {
  if (!Number.isSafeInteger(num) || num < extendedPrefixThreshold || num > maxPlaintextSize)
    throw new Error("invalid plaintext size: must be between 65536 and 4294967295 bytes");
  const arr = /* @__PURE__ */ new Uint8Array(4);
  new DataView(arr.buffer).setUint32(0, num, false);
  return arr;
}
function pad(plaintext) {
  const unpadded = utf8Encoder.encode(plaintext);
  const unpaddedLen = unpadded.length;
  if (unpaddedLen < minPlaintextSize || unpaddedLen > maxPlaintextSize)
    throw new Error("invalid plaintext size: must be between 1 and 4294967295 bytes");
  return concatBytes(
    unpaddedLen >= extendedPrefixThreshold
      ? concatBytes(new Uint8Array([0, 0]), writeU32BE(unpaddedLen))
      : writeU16BE(unpaddedLen),
    unpadded,
    new Uint8Array(calcPaddedLen(unpaddedLen) - unpaddedLen),
  );
}
function unpad(padded) {
  const dv = new DataView(padded.buffer, padded.byteOffset, padded.byteLength);
  const firstTwo = dv.getUint16(0);
  let unpaddedLen;
  let prefixLen;
  if (firstTwo === 0) {
    unpaddedLen = dv.getUint32(2);
    if (unpaddedLen < extendedPrefixThreshold) throw new Error("invalid padding");
    prefixLen = 6;
  } else {
    unpaddedLen = firstTwo;
    prefixLen = 2;
  }
  const unpadded = padded.subarray(prefixLen, prefixLen + unpaddedLen);
  if (
    unpaddedLen < minPlaintextSize ||
    unpaddedLen > maxPlaintextSize ||
    unpadded.length !== unpaddedLen ||
    padded.length !== prefixLen + calcPaddedLen(unpaddedLen)
  )
    throw new Error("invalid padding");
  return utf8Decoder.decode(unpadded);
}
function hmacAad(key, message, aad) {
  if (aad.length !== 32) throw new Error("AAD associated data must be 32 bytes");
  return hmac(sha256, key, concatBytes(aad, message));
}
function decodePayload(payload) {
  if (typeof payload !== "string") throw new Error("payload must be a valid string");
  const plen = payload.length;
  if (plen < 132) throw new Error("invalid payload length: " + plen);
  if (payload[0] === "#") throw new Error("unknown encryption version");
  let data;
  try {
    data = base64.decode(payload);
  } catch (error) {
    throw new Error("invalid base64: " + error.message);
  }
  const dlen = data.length;
  if (dlen < 99) throw new Error("invalid data length: " + dlen);
  const vers = data[0];
  if (vers !== 2) throw new Error("unknown encryption version " + vers);
  return {
    nonce: data.subarray(1, 33),
    ciphertext: data.subarray(33, -32),
    mac: data.subarray(-32),
  };
}
function encrypt2(plaintext, conversationKey, nonce = randomBytes(32)) {
  const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
  const ciphertext = chacha20(chacha_key, chacha_nonce, pad(plaintext));
  const mac = hmacAad(hmac_key, ciphertext, nonce);
  return base64.encode(concatBytes(new Uint8Array([2]), nonce, ciphertext, mac));
}
function decrypt2(payload, conversationKey) {
  const { nonce, ciphertext, mac } = decodePayload(payload);
  const { chacha_key, chacha_nonce, hmac_key } = getMessageKeys(conversationKey, nonce);
  if (!equalBytes(hmacAad(hmac_key, ciphertext, nonce), mac)) throw new Error("invalid MAC");
  return unpad(chacha20(chacha_key, chacha_nonce, ciphertext));
}
var v2 = {
  utils: {
    getConversationKey,
    calcPaddedLen,
    pad,
    unpad,
  },
  encrypt: encrypt2,
  decrypt: decrypt2,
};
var TWO_DAYS = 2880 * 60;
var now = () => Math.round(Date.now() / 1e3);
var randomNow = () => Math.round(now() - Math.random() * TWO_DAYS);
var nip44ConversationKey = (privateKey, publicKey) => getConversationKey(privateKey, publicKey);
var nip44Encrypt = (data, privateKey, publicKey) =>
  encrypt2(JSON.stringify(data), nip44ConversationKey(privateKey, publicKey));
var nip44Decrypt = (data, privateKey) =>
  JSON.parse(decrypt2(data.content, nip44ConversationKey(privateKey, data.pubkey)));
function createRumor(event, privateKey) {
  const rumor = {
    created_at: now(),
    content: "",
    tags: [],
    ...event,
    pubkey: getPublicKey(privateKey),
  };
  rumor.id = getEventHash(rumor);
  return rumor;
}
function createSeal(rumor, privateKey, recipientPublicKey) {
  return finalizeEvent(
    {
      kind: Seal,
      content: nip44Encrypt(rumor, privateKey, recipientPublicKey),
      created_at: randomNow(),
      tags: [],
    },
    privateKey,
  );
}
function createWrap(seal, recipientPublicKey) {
  const randomKey = generateSecretKey();
  return finalizeEvent(
    {
      kind: GiftWrap,
      content: nip44Encrypt(seal, randomKey, recipientPublicKey),
      created_at: randomNow(),
      tags: [["p", recipientPublicKey]],
    },
    randomKey,
  );
}
function wrapEvent(event, senderPrivateKey, recipientPublicKey) {
  return createWrap(
    createSeal(createRumor(event, senderPrivateKey), senderPrivateKey, recipientPublicKey),
    recipientPublicKey,
  );
}
function wrapManyEvents(event, senderPrivateKey, recipientsPublicKeys) {
  if (!recipientsPublicKeys || recipientsPublicKeys.length === 0)
    throw new Error("At least one recipient is required.");
  const wrappeds = [wrapEvent(event, senderPrivateKey, getPublicKey(senderPrivateKey))];
  recipientsPublicKeys.forEach((recipientPublicKey) => {
    wrappeds.push(wrapEvent(event, senderPrivateKey, recipientPublicKey));
  });
  return wrappeds;
}
function unwrapEvent(wrap, recipientPrivateKey) {
  return nip44Decrypt(nip44Decrypt(wrap, recipientPrivateKey), recipientPrivateKey);
}
function unwrapManyEvents(wrappedEvents, recipientPrivateKey) {
  let unwrappedEvents = [];
  wrappedEvents.forEach((e) => {
    unwrappedEvents.push(unwrapEvent(e, recipientPrivateKey));
  });
  unwrappedEvents.sort((a, b) => a.created_at - b.created_at);
  return unwrappedEvents;
}
function createEvent(recipients, message, conversationTitle, replyTo) {
  const baseEvent = {
    created_at: Math.ceil(Date.now() / 1e3),
    kind: PrivateDirectMessage,
    tags: [],
    content: message,
  };
  (Array.isArray(recipients) ? recipients : [recipients]).forEach(({ publicKey, relayUrl }) => {
    baseEvent.tags.push(relayUrl ? ["p", publicKey, relayUrl] : ["p", publicKey]);
  });
  if (replyTo) baseEvent.tags.push(["e", replyTo.eventId, replyTo.relayUrl || "", "reply"]);
  if (conversationTitle) baseEvent.tags.push(["subject", conversationTitle]);
  return baseEvent;
}
function wrapEvent2(senderPrivateKey, recipient, message, conversationTitle, replyTo) {
  return wrapEvent(
    createEvent(recipient, message, conversationTitle, replyTo),
    senderPrivateKey,
    recipient.publicKey,
  );
}
function wrapManyEvents2(senderPrivateKey, recipients, message, conversationTitle, replyTo) {
  if (!recipients || recipients.length === 0)
    throw new Error("At least one recipient is required.");
  return [{ publicKey: getPublicKey(senderPrivateKey) }, ...recipients].map((recipient) =>
    wrapEvent2(senderPrivateKey, recipient, message, conversationTitle, replyTo),
  );
}
var unwrapEvent2 = unwrapEvent;
var unwrapManyEvents2 = unwrapManyEvents;
__export(
  {},
  {
    finishRepostEvent: () => finishRepostEvent,
    getRepostedEvent: () => getRepostedEvent,
    getRepostedEventPointer: () => getRepostedEventPointer,
  },
);
function finishRepostEvent(t, reposted, relayUrl, privateKey) {
  let kind;
  const tags = [...(t.tags ?? []), ["e", reposted.id, relayUrl], ["p", reposted.pubkey]];
  if (reposted.kind === ShortTextNote) kind = Repost;
  else {
    kind = GenericRepost;
    tags.push(["k", String(reposted.kind)]);
  }
  return finalizeEvent(
    {
      kind,
      tags,
      content:
        t.content === "" || reposted.tags?.find((tag) => tag[0] === "-")
          ? ""
          : JSON.stringify(reposted),
      created_at: t.created_at,
    },
    privateKey,
  );
}
function getRepostedEventPointer(event) {
  if (![Repost, GenericRepost].includes(event.kind)) return;
  let lastETag;
  let lastPTag;
  for (
    let i2 = event.tags.length - 1;
    i2 >= 0 && (lastETag === void 0 || lastPTag === void 0);
    i2--
  ) {
    const tag = event.tags[i2];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) lastETag = tag;
      else if (tag[0] === "p" && lastPTag === void 0) lastPTag = tag;
    }
  }
  if (lastETag === void 0) return;
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag?.[2]].filter((x) => typeof x === "string"),
    author: lastPTag?.[1],
  };
}
function getRepostedEvent(event, { skipVerification } = {}) {
  const pointer = getRepostedEventPointer(event);
  if (pointer === void 0 || event.content === "") return;
  let repostedEvent;
  try {
    repostedEvent = JSON.parse(event.content);
  } catch (error) {
    return;
  }
  if (repostedEvent.id !== pointer.id) return;
  if (!skipVerification && !verifyEvent(repostedEvent)) return;
  return repostedEvent;
}
__export(
  {},
  {
    NOSTR_URI_REGEX: () => NOSTR_URI_REGEX,
    parse: () => parse2,
    test: () => test,
  },
);
var NOSTR_URI_REGEX = new RegExp(`nostr:(${BECH32_REGEX.source})`);
function test(value) {
  return typeof value === "string" && new RegExp(`^${NOSTR_URI_REGEX.source}$`).test(value);
}
function parse2(uri) {
  const match = uri.match(new RegExp(`^${NOSTR_URI_REGEX.source}$`));
  if (!match) throw new Error(`Invalid Nostr URI: ${uri}`);
  return {
    uri: match[0],
    value: match[1],
    decoded: decode(match[1]),
  };
}
__export({}, { parse: () => parse3 });
var HEX642 = /^[0-9a-fA-F]{64}$/;
function parseKind(kind) {
  if (!kind) return void 0;
  return /^\d+$/.test(kind) ? parseInt(kind, 10) : kind;
}
function parseAddressPointer(value, relayUrl) {
  const idx = value.indexOf(":");
  const idx2 = value.indexOf(":", idx + 1);
  if (idx === -1 || idx2 === -1) return void 0;
  const kind = parseInt(value.slice(0, idx), 10);
  if (Number.isNaN(kind)) return void 0;
  const pubkey = value.slice(idx + 1, idx2);
  if (!HEX642.test(pubkey)) return void 0;
  return {
    kind,
    pubkey,
    identifier: value.slice(idx2 + 1),
    relays: relayUrl ? [relayUrl] : [],
  };
}
function parsePointer(tag) {
  switch (tag[0]) {
    case "E":
    case "e":
      if (!tag[1] || !HEX642.test(tag[1])) return void 0;
      return {
        id: tag[1],
        relays: tag[2] ? [tag[2]] : [],
        author: tag[3] && HEX642.test(tag[3]) ? tag[3] : void 0,
      };
    case "A":
    case "a":
      if (!tag[1]) return void 0;
      return parseAddressPointer(tag[1], tag[2]);
    case "I":
    case "i":
      if (!tag[1]) return void 0;
      return {
        value: tag[1],
        hint: tag[2],
      };
  }
}
function parseQuote(tag) {
  if (!tag[1]) return void 0;
  if (tag[1].includes(":")) return parseAddressPointer(tag[1], tag[2]);
  if (!HEX642.test(tag[1])) return void 0;
  return {
    id: tag[1],
    relays: tag[2] ? [tag[2]] : [],
    author: tag[3] && HEX642.test(tag[3]) ? tag[3] : void 0,
  };
}
function choosePointer(candidates) {
  return (
    candidates.findLast((candidate) => candidate.tagName === "A" || candidate.tagName === "a")
      ?.pointer ||
    candidates.findLast((candidate) => candidate.tagName === "I" || candidate.tagName === "i")
      ?.pointer ||
    candidates.findLast((candidate) => candidate.tagName === "E" || candidate.tagName === "e")
      ?.pointer
  );
}
function inheritRelayHints(pointer, profiles) {
  if (!pointer || !("id" in pointer) || !pointer.author) return;
  const author = profiles.find((profile) => profile.pubkey === pointer.author);
  if (!author || !author.relays) return;
  if (!pointer.relays) pointer.relays = [];
  author.relays.forEach((url) => {
    if (pointer.relays.indexOf(url) === -1) pointer.relays.push(url);
  });
  author.relays = pointer.relays;
}
function parse3(event) {
  const result = {
    root: void 0,
    rootKind: void 0,
    reply: void 0,
    replyKind: void 0,
    mentions: [],
    quotes: [],
    profiles: [],
  };
  const rootCandidates = [];
  const replyCandidates = [];
  for (const tag of event.tags) {
    if ((tag[0] === "E" || tag[0] === "A" || tag[0] === "I") && tag[1]) {
      const pointer = parsePointer(tag);
      if (pointer)
        rootCandidates.push({
          tagName: tag[0],
          pointer,
        });
      continue;
    }
    if ((tag[0] === "e" || tag[0] === "a" || tag[0] === "i") && tag[1]) {
      const pointer = parsePointer(tag);
      if (pointer)
        replyCandidates.push({
          tagName: tag[0],
          pointer,
        });
      continue;
    }
    if (tag[0] === "K") {
      result.rootKind = parseKind(tag[1]);
      continue;
    }
    if (tag[0] === "k") {
      result.replyKind = parseKind(tag[1]);
      continue;
    }
    if (tag[0] === "q") {
      const pointer = parseQuote(tag);
      if (pointer) result.quotes.push(pointer);
      continue;
    }
    if ((tag[0] === "P" || tag[0] === "p") && tag[1] && HEX642.test(tag[1]))
      result.profiles.push({
        pubkey: tag[1],
        relays: tag[2] ? [tag[2]] : [],
      });
  }
  result.root = choosePointer(rootCandidates);
  result.reply = choosePointer(replyCandidates);
  inheritRelayHints(result.root, result.profiles);
  inheritRelayHints(result.reply, result.profiles);
  result.quotes.forEach((pointer) => inheritRelayHints(pointer, result.profiles));
  return result;
}
__export(
  {},
  {
    finishReactionEvent: () => finishReactionEvent,
    getReactedEventPointer: () => getReactedEventPointer,
  },
);
function finishReactionEvent(t, reacted, privateKey) {
  const inheritedTags = reacted.tags.filter(
    (tag) => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"),
  );
  return finalizeEvent(
    {
      ...t,
      kind: Reaction,
      tags: [...(t.tags ?? []), ...inheritedTags, ["e", reacted.id], ["p", reacted.pubkey]],
      content: t.content ?? "+",
    },
    privateKey,
  );
}
function getReactedEventPointer(event) {
  if (event.kind !== Reaction) return;
  let lastETag;
  let lastPTag;
  for (
    let i2 = event.tags.length - 1;
    i2 >= 0 && (lastETag === void 0 || lastPTag === void 0);
    i2--
  ) {
    const tag = event.tags[i2];
    if (tag.length >= 2) {
      if (tag[0] === "e" && lastETag === void 0) lastETag = tag;
      else if (tag[0] === "p" && lastPTag === void 0) lastPTag = tag;
    }
  }
  if (lastETag === void 0 || lastPTag === void 0) return;
  return {
    id: lastETag[1],
    relays: [lastETag[2], lastPTag[2]].filter((x) => x !== void 0),
    author: lastPTag[1],
  };
}
__export({}, { parse: () => parse4 });
var noCharacter = /\W/m;
var noURLCharacter = /[^\w\/] |[^\w\/]$|$|,| /m;
var MAX_HASHTAG_LENGTH = 42;
function* parse4(content) {
  let emojis = [];
  if (typeof content !== "string") {
    for (let i2 = 0; i2 < content.tags.length; i2++) {
      const tag = content.tags[i2];
      if (tag[0] === "emoji" && tag.length >= 3)
        emojis.push({
          type: "emoji",
          shortcode: tag[1],
          url: tag[2],
        });
    }
    content = content.content;
  }
  const max = content.length;
  let prevIndex = 0;
  let index = 0;
  mainloop: while (index < max) {
    const u = content.indexOf(":", index);
    const h = content.indexOf("#", index);
    if (u === -1 && h === -1) break mainloop;
    if (u === -1 || (h >= 0 && h < u)) {
      if (h === 0 || content[h - 1].match(noCharacter)) {
        const m = content.slice(h + 1, h + MAX_HASHTAG_LENGTH).match(noCharacter);
        const end = m ? h + 1 + m.index : max;
        yield {
          type: "text",
          text: content.slice(prevIndex, h),
        };
        yield {
          type: "hashtag",
          value: content.slice(h + 1, end),
        };
        index = end;
        prevIndex = index;
        continue mainloop;
      }
      index = h + 1;
      continue mainloop;
    }
    if (content.slice(u - 5, u) === "nostr") {
      const m = content.slice(u + 60).match(noCharacter);
      const end = m ? u + 60 + m.index : max;
      try {
        let pointer;
        let { data, type } = decode(content.slice(u + 1, end));
        switch (type) {
          case "npub":
            pointer = { pubkey: data };
            break;
          case "note":
            pointer = { id: data };
            break;
          case "nsec":
            index = end + 1;
            continue;
          default:
            pointer = data;
        }
        if (prevIndex !== u - 5)
          yield {
            type: "text",
            text: content.slice(prevIndex, u - 5),
          };
        yield {
          type: "reference",
          pointer,
        };
        index = end;
        prevIndex = index;
        continue mainloop;
      } catch (_err) {
        index = u + 1;
        continue mainloop;
      }
    } else if (content.slice(u - 5, u) === "https" || content.slice(u - 4, u) === "http") {
      const m = content.slice(u + 4).match(noURLCharacter);
      const end = m ? u + 4 + m.index : max;
      const prefixLen = content[u - 1] === "s" ? 5 : 4;
      try {
        let url = new URL(content.slice(u - prefixLen, end));
        if (url.hostname.indexOf(".") === -1) throw new Error("invalid url");
        if (prevIndex !== u - prefixLen)
          yield {
            type: "text",
            text: content.slice(prevIndex, u - prefixLen),
          };
        if (/\.(png|jpe?g|gif|webp|heic|svg)$/i.test(url.pathname)) {
          yield {
            type: "image",
            url: url.toString(),
          };
          index = end;
          prevIndex = index;
          continue mainloop;
        }
        if (/\.(mp4|avi|webm|mkv|mov)$/i.test(url.pathname)) {
          yield {
            type: "video",
            url: url.toString(),
          };
          index = end;
          prevIndex = index;
          continue mainloop;
        }
        if (/\.(mp3|aac|ogg|opus|wav|flac)$/i.test(url.pathname)) {
          yield {
            type: "audio",
            url: url.toString(),
          };
          index = end;
          prevIndex = index;
          continue mainloop;
        }
        yield {
          type: "url",
          url: url.toString(),
        };
        index = end;
        prevIndex = index;
        continue mainloop;
      } catch (_err) {
        index = end + 1;
        continue mainloop;
      }
    } else if (content.slice(u - 3, u) === "wss" || content.slice(u - 2, u) === "ws") {
      const m = content.slice(u + 4).match(noURLCharacter);
      const end = m ? u + 4 + m.index : max;
      const prefixLen = content[u - 1] === "s" ? 3 : 2;
      try {
        let url = new URL(content.slice(u - prefixLen, end));
        if (url.hostname.indexOf(".") === -1) throw new Error("invalid ws url");
        if (prevIndex !== u - prefixLen)
          yield {
            type: "text",
            text: content.slice(prevIndex, u - prefixLen),
          };
        yield {
          type: "relay",
          url: url.toString(),
        };
        index = end;
        prevIndex = index;
        continue mainloop;
      } catch (_err) {
        index = end + 1;
        continue mainloop;
      }
    } else {
      for (let e = 0; e < emojis.length; e++) {
        const emoji = emojis[e];
        if (
          content[u + emoji.shortcode.length + 1] === ":" &&
          content.slice(u + 1, u + emoji.shortcode.length + 1) === emoji.shortcode
        ) {
          if (prevIndex !== u)
            yield {
              type: "text",
              text: content.slice(prevIndex, u),
            };
          yield emoji;
          index = u + emoji.shortcode.length + 2;
          prevIndex = index;
          continue mainloop;
        }
      }
      index = u + 1;
      continue mainloop;
    }
  }
  if (prevIndex !== max)
    yield {
      type: "text",
      text: content.slice(prevIndex),
    };
}
__export(
  {},
  {
    channelCreateEvent: () => channelCreateEvent,
    channelHideMessageEvent: () => channelHideMessageEvent,
    channelMessageEvent: () => channelMessageEvent,
    channelMetadataEvent: () => channelMetadataEvent,
    channelMuteUserEvent: () => channelMuteUserEvent,
  },
);
var channelCreateEvent = (t, privateKey) => {
  let content;
  if (typeof t.content === "object") content = JSON.stringify(t.content);
  else if (typeof t.content === "string") content = t.content;
  else return;
  return finalizeEvent(
    {
      kind: ChannelCreation,
      tags: [...(t.tags ?? [])],
      content,
      created_at: t.created_at,
    },
    privateKey,
  );
};
var channelMetadataEvent = (t, privateKey) => {
  let content;
  if (typeof t.content === "object") content = JSON.stringify(t.content);
  else if (typeof t.content === "string") content = t.content;
  else return;
  return finalizeEvent(
    {
      kind: ChannelMetadata,
      tags: [["e", t.channel_create_event_id], ...(t.tags ?? [])],
      content,
      created_at: t.created_at,
    },
    privateKey,
  );
};
var channelMessageEvent = (t, privateKey) => {
  const tags = [["e", t.channel_create_event_id, t.relay_url, "root"]];
  if (t.reply_to_channel_message_event_id)
    tags.push(["e", t.reply_to_channel_message_event_id, t.relay_url, "reply"]);
  return finalizeEvent(
    {
      kind: ChannelMessage,
      tags: [...tags, ...(t.tags ?? [])],
      content: t.content,
      created_at: t.created_at,
    },
    privateKey,
  );
};
var channelHideMessageEvent = (t, privateKey) => {
  let content;
  if (typeof t.content === "object") content = JSON.stringify(t.content);
  else if (typeof t.content === "string") content = t.content;
  else return;
  return finalizeEvent(
    {
      kind: ChannelHideMessage,
      tags: [["e", t.channel_message_event_id], ...(t.tags ?? [])],
      content,
      created_at: t.created_at,
    },
    privateKey,
  );
};
var channelMuteUserEvent = (t, privateKey) => {
  let content;
  if (typeof t.content === "object") content = JSON.stringify(t.content);
  else if (typeof t.content === "string") content = t.content;
  else return;
  return finalizeEvent(
    {
      kind: ChannelMuteUser,
      tags: [["p", t.pubkey_to_mute], ...(t.tags ?? [])],
      content,
      created_at: t.created_at,
    },
    privateKey,
  );
};
__export(
  {},
  {
    EMOJI_SHORTCODE_REGEX: () => EMOJI_SHORTCODE_REGEX,
    matchAll: () => matchAll,
    regex: () => regex,
    replaceAll: () => replaceAll,
  },
);
var EMOJI_SHORTCODE_REGEX = /:(\w+):/;
var regex = () => new RegExp(`\\B${EMOJI_SHORTCODE_REGEX.source}\\B`, "g");
function* matchAll(content) {
  const matches = content.matchAll(regex());
  for (const match of matches)
    try {
      const [shortcode, name] = match;
      yield {
        shortcode,
        name,
        start: match.index,
        end: match.index + shortcode.length,
      };
    } catch (_e) {}
}
function replaceAll(content, replacer) {
  return content.replaceAll(regex(), (shortcode, name) => {
    return replacer({
      shortcode,
      name,
    });
  });
}
__export(
  {},
  {
    useFetchImplementation: () => useFetchImplementation3,
    validateGithub: () => validateGithub,
  },
);
var _fetch3;
try {
  _fetch3 = fetch;
} catch {}
function useFetchImplementation3(fetchImplementation) {
  _fetch3 = fetchImplementation;
}
async function validateGithub(pubkey, username, proof) {
  try {
    return (
      (await (await _fetch3(`https://gist.github.com/${username}/${proof}/raw`)).text()) ===
      `Verifying that I control the following Nostr public key: ${pubkey}`
    );
  } catch (_) {
    return false;
  }
}
__export(
  {},
  {
    makeNwcRequestEvent: () => makeNwcRequestEvent,
    parseConnectionString: () => parseConnectionString,
  },
);
function parseConnectionString(connectionString) {
  const { host, pathname, searchParams } = new URL(connectionString);
  const pubkey = pathname || host;
  const relays = searchParams.getAll("relay");
  const secret = searchParams.get("secret");
  if (!pubkey || relays.length === 0 || !secret) throw new Error("invalid connection string");
  return {
    pubkey,
    relay: relays[0],
    relays,
    secret,
  };
}
async function makeNwcRequestEvent(pubkey, secretKey, invoice) {
  const encryptedContent = encrypt(
    secretKey,
    pubkey,
    JSON.stringify({
      method: "pay_invoice",
      params: { invoice },
    }),
  );
  return finalizeEvent(
    {
      kind: NWCWalletRequest,
      created_at: Math.round(Date.now() / 1e3),
      content: encryptedContent,
      tags: [["p", pubkey]],
    },
    secretKey,
  );
}
__export({}, { normalizeIdentifier: () => normalizeIdentifier });
function normalizeIdentifier(name) {
  name = name.trim().toLowerCase();
  name = name.normalize("NFKC");
  return Array.from(name)
    .map((char) => {
      if (/\p{Letter}/u.test(char) || /\p{Number}/u.test(char)) return char;
      return "-";
    })
    .join("");
}
__export(
  {},
  {
    getSatoshisAmountFromBolt11: () => getSatoshisAmountFromBolt11,
    getZapEndpoint: () => getZapEndpoint,
    makeZapReceipt: () => makeZapReceipt,
    makeZapRequest: () => makeZapRequest,
    useFetchImplementation: () => useFetchImplementation4,
    validateZapRequest: () => validateZapRequest,
  },
);
var _fetch4;
try {
  _fetch4 = fetch;
} catch {}
function useFetchImplementation4(fetchImplementation) {
  _fetch4 = fetchImplementation;
}
async function getZapEndpoint(metadata) {
  try {
    let lnurl = "";
    let { lud06, lud16 } = JSON.parse(metadata.content);
    if (lud16) {
      let [name, domain] = lud16.split("@");
      lnurl = new URL(`/.well-known/lnurlp/${name}`, `https://${domain}`).toString();
    } else if (lud06) {
      let { words } = bech32.decode(lud06, 1e3);
      let data = bech32.fromWords(words);
      lnurl = utf8Decoder.decode(data);
    } else return null;
    let body = await (await _fetch4(lnurl)).json();
    if (body.allowsNostr && body.nostrPubkey) return body.callback;
  } catch (err) {}
  return null;
}
function makeZapRequest(params) {
  let zr = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: params.comment || "",
    tags: [
      ["p", "pubkey" in params ? params.pubkey : params.event.pubkey],
      ["amount", params.amount.toString()],
      ["relays", ...params.relays],
    ],
  };
  if ("event" in params) {
    zr.tags.push(["e", params.event.id]);
    if (isReplaceableKind(params.event.kind)) {
      const a = ["a", `${params.event.kind}:${params.event.pubkey}:`];
      zr.tags.push(a);
    } else if (isAddressableKind(params.event.kind)) {
      let d = params.event.tags.find(([t, v]) => t === "d" && v);
      if (!d) throw new Error("d tag not found or is empty");
      const a = ["a", `${params.event.kind}:${params.event.pubkey}:${d[1]}`];
      zr.tags.push(a);
    }
    zr.tags.push(["k", params.event.kind.toString()]);
  }
  return zr;
}
function validateZapRequest(zapRequestString) {
  let zapRequest;
  try {
    zapRequest = JSON.parse(zapRequestString);
  } catch (err) {
    return "Invalid zap request JSON.";
  }
  if (!validateEvent(zapRequest)) return "Zap request is not a valid Nostr event.";
  if (!verifyEvent(zapRequest)) return "Invalid signature on zap request.";
  let p = zapRequest.tags.find(([t, v]) => t === "p" && v);
  if (!p) return "Zap request doesn't have a 'p' tag.";
  if (!p[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'p' tag is not valid hex.";
  let e = zapRequest.tags.find(([t, v]) => t === "e" && v);
  if (e && !e[1].match(/^[a-f0-9]{64}$/)) return "Zap request 'e' tag is not valid hex.";
  if (!zapRequest.tags.find(([t, v]) => t === "relays" && v))
    return "Zap request doesn't have a 'relays' tag.";
  return null;
}
function makeZapReceipt({ zapRequest, preimage, bolt11, paidAt }) {
  let zr = JSON.parse(zapRequest);
  let tagsFromZapRequest = zr.tags.filter(([t]) => t === "e" || t === "p" || t === "a");
  let zap = {
    kind: 9735,
    created_at: Math.round(paidAt.getTime() / 1e3),
    content: "",
    tags: [
      ...tagsFromZapRequest,
      ["P", zr.pubkey],
      ["bolt11", bolt11],
      ["description", zapRequest],
    ],
  };
  if (preimage) zap.tags.push(["preimage", preimage]);
  return zap;
}
function getSatoshisAmountFromBolt11(bolt11) {
  if (bolt11.length < 50) return 0;
  bolt11 = bolt11.substring(0, 50);
  const idx = bolt11.lastIndexOf("1");
  if (idx === -1) return 0;
  const hrp = bolt11.substring(0, idx);
  if (!hrp.startsWith("lnbc")) return 0;
  const amount = hrp.substring(4);
  if (amount.length < 1) return 0;
  const char = amount[amount.length - 1];
  const digit = char.charCodeAt(0) - "0".charCodeAt(0);
  const isDigit = digit >= 0 && digit <= 9;
  let cutPoint = amount.length - 1;
  if (isDigit) cutPoint++;
  if (cutPoint < 1) return 0;
  const num = parseInt(amount.substring(0, cutPoint));
  switch (char) {
    case "m":
      return num * 1e5;
    case "u":
      return num * 100;
    case "n":
      return num / 10;
    case "p":
      return num / 1e4;
    default:
      return num * 1e8;
  }
}
__export(
  {},
  {
    Negentropy: () => Negentropy,
    NegentropyStorageVector: () => NegentropyStorageVector,
    NegentropySync: () => NegentropySync,
  },
);
var PROTOCOL_VERSION = 97;
var ID_SIZE = 32;
var FINGERPRINT_SIZE = 16;
var Mode = {
  Skip: 0,
  Fingerprint: 1,
  IdList: 2,
};
var WrappedBuffer = class {
  _raw;
  length;
  constructor(buffer) {
    if (typeof buffer === "number") {
      this._raw = new Uint8Array(buffer);
      this.length = 0;
    } else if (buffer instanceof Uint8Array) {
      this._raw = new Uint8Array(buffer);
      this.length = buffer.length;
    } else {
      this._raw = /* @__PURE__ */ new Uint8Array(512);
      this.length = 0;
    }
  }
  unwrap() {
    return this._raw.subarray(0, this.length);
  }
  get capacity() {
    return this._raw.byteLength;
  }
  extend(buf) {
    if (buf instanceof WrappedBuffer) buf = buf.unwrap();
    if (typeof buf.length !== "number") throw Error("bad length");
    const targetSize = buf.length + this.length;
    if (this.capacity < targetSize) {
      const oldRaw = this._raw;
      const newCapacity = Math.max(this.capacity * 2, targetSize);
      this._raw = new Uint8Array(newCapacity);
      this._raw.set(oldRaw);
    }
    this._raw.set(buf, this.length);
    this.length += buf.length;
  }
  shift() {
    const first = this._raw[0];
    this._raw = this._raw.subarray(1);
    this.length--;
    return first;
  }
  shiftN(n = 1) {
    const firstSubarray = this._raw.subarray(0, n);
    this._raw = this._raw.subarray(n);
    this.length -= n;
    return firstSubarray;
  }
};
function decodeVarInt(buf) {
  let res = 0;
  while (1) {
    if (buf.length === 0) throw Error("parse ends prematurely");
    let byte = buf.shift();
    res = (res << 7) | (byte & 127);
    if ((byte & 128) === 0) break;
  }
  return res;
}
function encodeVarInt(n) {
  if (n === 0) return new WrappedBuffer(new Uint8Array([0]));
  let o = [];
  while (n !== 0) {
    o.push(n & 127);
    n >>>= 7;
  }
  o.reverse();
  for (let i2 = 0; i2 < o.length - 1; i2++) o[i2] |= 128;
  return new WrappedBuffer(new Uint8Array(o));
}
function getByte(buf) {
  return getBytes(buf, 1)[0];
}
function getBytes(buf, n) {
  if (buf.length < n) throw Error("parse ends prematurely");
  return buf.shiftN(n);
}
var Accumulator = class {
  buf;
  constructor() {
    this.setToZero();
  }
  setToZero() {
    this.buf = new Uint8Array(ID_SIZE);
  }
  add(otherBuf) {
    let currCarry = 0,
      nextCarry = 0;
    let p = new DataView(this.buf.buffer);
    let po = new DataView(otherBuf.buffer);
    for (let i2 = 0; i2 < 8; i2++) {
      let offset = i2 * 4;
      let orig = p.getUint32(offset, true);
      let otherV = po.getUint32(offset, true);
      let next = orig;
      next += currCarry;
      next += otherV;
      if (next > 4294967295) nextCarry = 1;
      p.setUint32(offset, next & 4294967295, true);
      currCarry = nextCarry;
      nextCarry = 0;
    }
  }
  negate() {
    let p = new DataView(this.buf.buffer);
    for (let i2 = 0; i2 < 8; i2++) {
      let offset = i2 * 4;
      p.setUint32(offset, ~p.getUint32(offset, true));
    }
    let one = new Uint8Array(ID_SIZE);
    one[0] = 1;
    this.add(one);
  }
  getFingerprint(n) {
    let input = new WrappedBuffer();
    input.extend(this.buf);
    input.extend(encodeVarInt(n));
    return sha256(input.unwrap()).subarray(0, FINGERPRINT_SIZE);
  }
};
var NegentropyStorageVector = class {
  items;
  sealed;
  constructor() {
    this.items = [];
    this.sealed = false;
  }
  insert(timestamp, id) {
    if (this.sealed) throw Error("already sealed");
    const idb = hexToBytes(id);
    if (idb.byteLength !== ID_SIZE) throw Error("bad id size for added item");
    this.items.push({
      timestamp,
      id: idb,
    });
  }
  seal() {
    if (this.sealed) throw Error("already sealed");
    this.sealed = true;
    this.items.sort(itemCompare);
    for (let i2 = 1; i2 < this.items.length; i2++)
      if (itemCompare(this.items[i2 - 1], this.items[i2]) === 0)
        throw Error("duplicate item inserted");
  }
  unseal() {
    this.sealed = false;
  }
  size() {
    this._checkSealed();
    return this.items.length;
  }
  getItem(i2) {
    this._checkSealed();
    if (i2 >= this.items.length) throw Error("out of range");
    return this.items[i2];
  }
  iterate(begin, end, cb) {
    this._checkSealed();
    this._checkBounds(begin, end);
    for (let i2 = begin; i2 < end; ++i2) if (!cb(this.items[i2], i2)) break;
  }
  findLowerBound(begin, end, bound) {
    this._checkSealed();
    this._checkBounds(begin, end);
    return this._binarySearch(this.items, begin, end, (a) => itemCompare(a, bound) < 0);
  }
  fingerprint(begin, end) {
    let out = new Accumulator();
    out.setToZero();
    this.iterate(begin, end, (item) => {
      out.add(item.id);
      return true;
    });
    return out.getFingerprint(end - begin);
  }
  _checkSealed() {
    if (!this.sealed) throw Error("not sealed");
  }
  _checkBounds(begin, end) {
    if (begin > end || end > this.items.length) throw Error("bad range");
  }
  _binarySearch(arr, first, last, cmp) {
    let count = last - first;
    while (count > 0) {
      let it = first;
      let step = Math.floor(count / 2);
      it += step;
      if (cmp(arr[it])) {
        first = ++it;
        count -= step + 1;
      } else count = step;
    }
    return first;
  }
};
var Negentropy = class {
  storage;
  frameSizeLimit;
  lastTimestampIn;
  lastTimestampOut;
  constructor(storage, frameSizeLimit = 6e4) {
    if (frameSizeLimit < 4096) throw Error("frameSizeLimit too small");
    this.storage = storage;
    this.frameSizeLimit = frameSizeLimit;
    this.lastTimestampIn = 0;
    this.lastTimestampOut = 0;
  }
  _bound(timestamp, id) {
    return {
      timestamp,
      id: id || /* @__PURE__ */ new Uint8Array(0),
    };
  }
  initiate() {
    let output = new WrappedBuffer();
    output.extend(new Uint8Array([PROTOCOL_VERSION]));
    this.splitRange(0, this.storage.size(), this._bound(Number.MAX_VALUE), output);
    return bytesToHex(output.unwrap());
  }
  reconcile(queryMsg, onhave, onneed) {
    const query = new WrappedBuffer(hexToBytes(queryMsg));
    this.lastTimestampIn = this.lastTimestampOut = 0;
    let fullOutput = new WrappedBuffer();
    fullOutput.extend(new Uint8Array([PROTOCOL_VERSION]));
    let protocolVersion = getByte(query);
    if (protocolVersion < 96 || protocolVersion > 111)
      throw Error("invalid negentropy protocol version byte");
    if (protocolVersion !== PROTOCOL_VERSION)
      throw Error("unsupported negentropy protocol version requested: " + (protocolVersion - 96));
    let storageSize = this.storage.size();
    let prevBound = this._bound(0);
    let prevIndex = 0;
    let skip = false;
    while (query.length !== 0) {
      let o = new WrappedBuffer();
      let doSkip = () => {
        if (skip) {
          skip = false;
          o.extend(this.encodeBound(prevBound));
          o.extend(encodeVarInt(Mode.Skip));
        }
      };
      let currBound = this.decodeBound(query);
      let mode = decodeVarInt(query);
      let lower = prevIndex;
      let upper = this.storage.findLowerBound(prevIndex, storageSize, currBound);
      if (mode === Mode.Skip) skip = true;
      else if (mode === Mode.Fingerprint)
        if (
          compareUint8Array(
            getBytes(query, FINGERPRINT_SIZE),
            this.storage.fingerprint(lower, upper),
          ) !== 0
        ) {
          doSkip();
          this.splitRange(lower, upper, currBound, o);
        } else skip = true;
      else if (mode === Mode.IdList) {
        let numIds = decodeVarInt(query);
        let theirElems = {};
        for (let i2 = 0; i2 < numIds; i2++) {
          let e = getBytes(query, ID_SIZE);
          theirElems[bytesToHex(e)] = e;
        }
        skip = true;
        this.storage.iterate(lower, upper, (item) => {
          let k = item.id;
          const id = bytesToHex(k);
          if (!theirElems[id]) onhave?.(id);
          else delete theirElems[bytesToHex(k)];
          return true;
        });
        if (onneed) for (let v of Object.values(theirElems)) onneed(bytesToHex(v));
      } else throw Error("unexpected mode");
      if (this.exceededFrameSizeLimit(fullOutput.length + o.length)) {
        let remainingFingerprint = this.storage.fingerprint(upper, storageSize);
        fullOutput.extend(this.encodeBound(this._bound(Number.MAX_VALUE)));
        fullOutput.extend(encodeVarInt(Mode.Fingerprint));
        fullOutput.extend(remainingFingerprint);
        break;
      } else fullOutput.extend(o);
      prevIndex = upper;
      prevBound = currBound;
    }
    return fullOutput.length === 1 ? null : bytesToHex(fullOutput.unwrap());
  }
  splitRange(lower, upper, upperBound, o) {
    let numElems = upper - lower;
    let buckets = 16;
    if (numElems < buckets * 2) {
      o.extend(this.encodeBound(upperBound));
      o.extend(encodeVarInt(Mode.IdList));
      o.extend(encodeVarInt(numElems));
      this.storage.iterate(lower, upper, (item) => {
        o.extend(item.id);
        return true;
      });
    } else {
      let itemsPerBucket = Math.floor(numElems / buckets);
      let bucketsWithExtra = numElems % buckets;
      let curr = lower;
      for (let i2 = 0; i2 < buckets; i2++) {
        let bucketSize = itemsPerBucket + (i2 < bucketsWithExtra ? 1 : 0);
        let ourFingerprint = this.storage.fingerprint(curr, curr + bucketSize);
        curr += bucketSize;
        let nextBound;
        if (curr === upper) nextBound = upperBound;
        else {
          let prevItem;
          let currItem;
          this.storage.iterate(curr - 1, curr + 1, (item, index) => {
            if (index === curr - 1) prevItem = item;
            else currItem = item;
            return true;
          });
          nextBound = this.getMinimalBound(prevItem, currItem);
        }
        o.extend(this.encodeBound(nextBound));
        o.extend(encodeVarInt(Mode.Fingerprint));
        o.extend(ourFingerprint);
      }
    }
  }
  exceededFrameSizeLimit(n) {
    return n > this.frameSizeLimit - 200;
  }
  decodeTimestampIn(encoded) {
    let timestamp = decodeVarInt(encoded);
    timestamp = timestamp === 0 ? Number.MAX_VALUE : timestamp - 1;
    if (this.lastTimestampIn === Number.MAX_VALUE || timestamp === Number.MAX_VALUE) {
      this.lastTimestampIn = Number.MAX_VALUE;
      return Number.MAX_VALUE;
    }
    timestamp += this.lastTimestampIn;
    this.lastTimestampIn = timestamp;
    return timestamp;
  }
  decodeBound(encoded) {
    let timestamp = this.decodeTimestampIn(encoded);
    let len = decodeVarInt(encoded);
    if (len > ID_SIZE) throw Error("bound key too long");
    return {
      timestamp,
      id: getBytes(encoded, len),
    };
  }
  encodeTimestampOut(timestamp) {
    if (timestamp === Number.MAX_VALUE) {
      this.lastTimestampOut = Number.MAX_VALUE;
      return encodeVarInt(0);
    }
    let temp = timestamp;
    timestamp -= this.lastTimestampOut;
    this.lastTimestampOut = temp;
    return encodeVarInt(timestamp + 1);
  }
  encodeBound(key) {
    let output = new WrappedBuffer();
    output.extend(this.encodeTimestampOut(key.timestamp));
    output.extend(encodeVarInt(key.id.length));
    output.extend(key.id);
    return output;
  }
  getMinimalBound(prev, curr) {
    if (curr.timestamp !== prev.timestamp) return this._bound(curr.timestamp);
    else {
      let sharedPrefixBytes = 0;
      let currKey = curr.id;
      let prevKey = prev.id;
      for (let i2 = 0; i2 < ID_SIZE; i2++) {
        if (currKey[i2] !== prevKey[i2]) break;
        sharedPrefixBytes++;
      }
      return this._bound(curr.timestamp, curr.id.subarray(0, sharedPrefixBytes + 1));
    }
  }
};
function compareUint8Array(a, b) {
  for (let i2 = 0; i2 < a.byteLength; i2++) {
    if (a[i2] < b[i2]) return -1;
    if (a[i2] > b[i2]) return 1;
  }
  if (a.byteLength > b.byteLength) return 1;
  if (a.byteLength < b.byteLength) return -1;
  return 0;
}
function itemCompare(a, b) {
  if (a.timestamp === b.timestamp) return compareUint8Array(a.id, b.id);
  return a.timestamp - b.timestamp;
}
var NegentropySync = class {
  relay;
  storage;
  neg;
  filter;
  subscription;
  onhave;
  onneed;
  constructor(relay, storage, filter, params = {}) {
    this.relay = relay;
    this.storage = storage;
    this.neg = new Negentropy(storage);
    this.onhave = params.onhave;
    this.onneed = params.onneed;
    this.filter = filter;
    this.subscription = this.relay.prepareSubscription([{}], {
      label: params.label || "negentropy",
    });
    this.subscription.oncustom = (data) => {
      switch (data[0]) {
        case "NEG-MSG":
          if (data.length < 3) console.warn(`got invalid NEG-MSG from ${this.relay.url}: ${data}`);
          try {
            const response = this.neg.reconcile(data[2], this.onhave, this.onneed);
            if (response) this.relay.send(`["NEG-MSG", "${this.subscription.id}", "${response}"]`);
            else {
              this.close();
              params.onclose?.();
            }
          } catch (error) {
            console.error("negentropy reconcile error:", error);
            params?.onclose?.(`reconcile error: ${error}`);
          }
          break;
        case "NEG-CLOSE": {
          const reason = data[2];
          console.warn("negentropy error:", reason);
          params.onclose?.(reason);
          break;
        }
        case "NEG-ERR":
          params.onclose?.();
      }
    };
  }
  async start() {
    const initMsg = this.neg.initiate();
    this.relay.send(
      `["NEG-OPEN","${this.subscription.id}",${JSON.stringify(this.filter)},"${initMsg}"]`,
    );
  }
  close() {
    this.relay.send(`["NEG-CLOSE","${this.subscription.id}"]`);
    this.subscription.close();
  }
};
__export(
  {},
  {
    getToken: () => getToken,
    hashPayload: () => hashPayload,
    unpackEventFromToken: () => unpackEventFromToken,
    validateEvent: () => validateEvent2,
    validateEventKind: () => validateEventKind,
    validateEventMethodTag: () => validateEventMethodTag,
    validateEventPayloadTag: () => validateEventPayloadTag,
    validateEventTimestamp: () => validateEventTimestamp,
    validateEventUrlTag: () => validateEventUrlTag,
    validateToken: () => validateToken,
  },
);
var _authorizationScheme = "Nostr ";
async function getToken(loginUrl, httpMethod, sign, includeAuthorizationScheme = false, payload) {
  const event = {
    kind: HTTPAuth,
    tags: [
      ["u", loginUrl],
      ["method", httpMethod],
    ],
    created_at: Math.round(/* @__PURE__ */ new Date().getTime() / 1e3),
    content: "",
  };
  if (payload) event.tags.push(["payload", hashPayload(payload)]);
  const signedEvent = await sign(event);
  return (
    (includeAuthorizationScheme ? _authorizationScheme : "") +
    base64.encode(utf8Encoder.encode(JSON.stringify(signedEvent)))
  );
}
async function validateToken(token, url, method) {
  return await validateEvent2(
    await unpackEventFromToken(token).catch((error) => {
      throw error;
    }),
    url,
    method,
  ).catch((error) => {
    throw error;
  });
}
async function unpackEventFromToken(token) {
  if (!token) throw new Error("Missing token");
  token = token.replace(_authorizationScheme, "");
  const eventB64 = utf8Decoder.decode(base64.decode(token));
  if (!eventB64 || eventB64.length === 0 || !eventB64.startsWith("{"))
    throw new Error("Invalid token");
  return JSON.parse(eventB64);
}
function validateEventTimestamp(event) {
  if (!event.created_at) return false;
  return Math.round(/* @__PURE__ */ new Date().getTime() / 1e3) - event.created_at < 60;
}
function validateEventKind(event) {
  return event.kind === HTTPAuth;
}
function validateEventUrlTag(event, url) {
  const urlTag = event.tags.find((t) => t[0] === "u");
  if (!urlTag) return false;
  return urlTag.length > 0 && urlTag[1] === url;
}
function validateEventMethodTag(event, method) {
  const methodTag = event.tags.find((t) => t[0] === "method");
  if (!methodTag) return false;
  return methodTag.length > 0 && methodTag[1].toLowerCase() === method.toLowerCase();
}
function hashPayload(payload) {
  return bytesToHex(sha256(utf8Encoder.encode(JSON.stringify(payload))));
}
function validateEventPayloadTag(event, payload) {
  const payloadTag = event.tags.find((t) => t[0] === "payload");
  if (!payloadTag) return false;
  const payloadHash = hashPayload(payload);
  return payloadTag.length > 0 && payloadTag[1] === payloadHash;
}
async function validateEvent2(event, url, method, body) {
  if (!verifyEvent(event)) throw new Error("Invalid nostr event, signature invalid");
  if (!validateEventKind(event)) throw new Error("Invalid nostr event, kind invalid");
  if (!validateEventTimestamp(event))
    throw new Error("Invalid nostr event, created_at timestamp invalid");
  if (!validateEventUrlTag(event, url)) throw new Error("Invalid nostr event, url tag invalid");
  if (!validateEventMethodTag(event, method))
    throw new Error("Invalid nostr event, method tag invalid");
  if (Boolean(body) && typeof body === "object" && Object.keys(body).length > 0) {
    if (!validateEventPayloadTag(event, body))
      throw new Error("Invalid nostr event, payload tag does not match request body hash");
  }
  return true;
}
//#endregion
//#region extensions/nostr/src/nostr-key-utils.ts
/**
 * Validate and normalize a private key (accepts hex or nsec format)
 */
function validatePrivateKey(key) {
  const trimmed = key.trim();
  if (trimmed.startsWith("nsec1")) {
    const decoded = nip19_exports.decode(trimmed);
    if (decoded.type !== "nsec") throw new Error("Invalid nsec key: wrong type");
    return decoded.data;
  }
  if (!/^[0-9a-fA-F]{64}$/.test(trimmed))
    throw new Error("Private key must be 64 hex characters or nsec bech32 format");
  const bytes = /* @__PURE__ */ new Uint8Array(32);
  for (let i = 0; i < 32; i++) bytes[i] = Number.parseInt(trimmed.slice(i * 2, i * 2 + 2), 16);
  return bytes;
}
/**
 * Get public key from private key (hex or nsec format)
 */
function getPublicKeyFromPrivate(privateKey) {
  return getPublicKey(validatePrivateKey(privateKey));
}
/**
 * Normalize a pubkey to hex format (accepts npub or hex)
 */
function normalizePubkey(input) {
  const trimmed = input.trim();
  if (trimmed.startsWith("npub1")) {
    const decoded = nip19_exports.decode(trimmed);
    if (decoded.type !== "npub" || typeof decoded.data !== "string")
      throw new Error("Invalid npub key");
    return decoded.data.toLowerCase();
  }
  if (!/^[0-9a-fA-F]{64}$/.test(trimmed))
    throw new Error("Pubkey must be 64 hex characters or npub format");
  return trimmed.toLowerCase();
}
//#endregion
//#region extensions/nostr/src/types.ts
function resolveConfiguredDefaultNostrAccountId(cfg) {
  const nostrCfg = cfg.channels?.nostr;
  return normalizeOptionalAccountId(nostrCfg?.defaultAccount);
}
/**
 * List all configured Nostr account IDs
 */
function listNostrAccountIds(cfg) {
  const nostrCfg = cfg.channels?.nostr;
  return listCombinedAccountIds({
    configuredAccountIds: [],
    implicitAccountId: normalizeSecretInputString(nostrCfg?.privateKey)
      ? (resolveConfiguredDefaultNostrAccountId(cfg) ?? "default")
      : void 0,
  });
}
/**
 * Get the default account ID
 */
function resolveDefaultNostrAccountId(cfg) {
  return resolveListedDefaultAccountId({
    accountIds: listNostrAccountIds(cfg),
    configuredDefaultAccountId: resolveConfiguredDefaultNostrAccountId(cfg),
  });
}
/**
 * Resolve a Nostr account from config
 */
function resolveNostrAccount(opts) {
  const accountId = normalizeAccountId(opts.accountId ?? resolveDefaultNostrAccountId(opts.cfg));
  const nostrCfg = opts.cfg.channels?.nostr;
  const baseEnabled = nostrCfg?.enabled !== false;
  const privateKey = normalizeSecretInputString(nostrCfg?.privateKey) ?? "";
  const configured = Boolean(privateKey);
  let publicKey = "";
  if (privateKey)
    try {
      publicKey = getPublicKeyFromPrivate(privateKey);
    } catch {}
  return {
    accountId,
    name: normalizeOptionalString(nostrCfg?.name),
    enabled: baseEnabled,
    configured,
    privateKey,
    publicKey,
    relays: nostrCfg?.relays ?? DEFAULT_RELAYS,
    profile: nostrCfg?.profile,
    config: {
      enabled: nostrCfg?.enabled,
      name: nostrCfg?.name,
      privateKey: nostrCfg?.privateKey,
      relays: nostrCfg?.relays,
      dmPolicy: nostrCfg?.dmPolicy,
      allowFrom: nostrCfg?.allowFrom,
      profile: nostrCfg?.profile,
    },
  };
}
//#endregion
//#region extensions/nostr/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "nostr";
const NOSTR_SETUP_HELP_LINES = [
  t("wizard.nostr.helpPrivateKeyFormat"),
  t("wizard.nostr.helpRelaysOptional"),
  t("wizard.nostr.helpEnvVars"),
  `Docs: ${formatDocsLink("/channels/nostr", "channels/nostr")}`,
];
const NOSTR_ALLOW_FROM_HELP_LINES = [
  t("wizard.nostr.allowlistIntro"),
  t("wizard.nostr.examples"),
  "- npub1...",
  "- nostr:npub1...",
  "- 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  t("wizard.nostr.multipleEntries"),
  `Docs: ${formatDocsLink("/channels/nostr", "channels/nostr")}`,
];
function parseNostrAllowFrom(raw) {
  return parseSetupEntriesWithParser(raw, (entry) => {
    const cleaned = entry.replace(/^nostr:/i, "").trim();
    try {
      return { value: normalizePubkey(cleaned) };
    } catch {
      return { error: `Invalid Nostr pubkey: ${entry}` };
    }
  });
}
const nostrDmPolicy = createTopLevelChannelDmPolicy({
  label: "Nostr",
  channel,
  policyKey: "channels.nostr.dmPolicy",
  allowFromKey: "channels.nostr.allowFrom",
  getCurrent: (cfg) => cfg.channels?.nostr?.dmPolicy ?? "pairing",
  promptAllowFrom: createTopLevelChannelParsedAllowFromPrompt({
    channel,
    defaultAccountId: resolveDefaultNostrAccountId,
    noteTitle: t("wizard.nostr.allowlistTitle"),
    noteLines: NOSTR_ALLOW_FROM_HELP_LINES,
    message: t("wizard.nostr.allowFromPrompt"),
    placeholder: "npub1..., 0123abcd...",
    parseEntries: parseNostrAllowFrom,
    mergeEntries: ({ existing, parsed }) => mergeAllowFromEntries(existing, parsed),
  }),
});
const nostrSetupAdapter = createNostrSetupAdapter({
  resolveAccountId: (cfg, accountId) => accountId?.trim() || resolveDefaultNostrAccountId(cfg),
  validatePrivateKey: (privateKey) => {
    try {
      getPublicKeyFromPrivate(privateKey);
      return true;
    } catch {
      return false;
    }
  },
});
const nostrSetupWizard = {
  channel,
  resolveAccountIdForConfigure: ({ accountOverride, defaultAccountId }) =>
    accountOverride?.trim() || defaultAccountId,
  resolveShouldPromptAccountIds: () => false,
  status: createStandardChannelSetupStatus({
    channelLabel: "Nostr",
    configuredLabel: t("wizard.channels.statusConfigured"),
    unconfiguredLabel: t("wizard.channels.statusNeedsPrivateKey"),
    configuredHint: t("wizard.channels.statusConfigured"),
    unconfiguredHint: t("wizard.channels.statusNeedsPrivateKey"),
    configuredScore: 1,
    unconfiguredScore: 0,
    includeStatusLine: true,
    resolveConfigured: ({ cfg }) => resolveNostrAccount({ cfg }).configured,
    resolveExtraStatusLines: ({ cfg }) => {
      return [`Relays: ${resolveNostrAccount({ cfg }).relays.length || DEFAULT_RELAYS.length}`];
    },
  }),
  introNote: {
    title: t("wizard.nostr.setupTitle"),
    lines: NOSTR_SETUP_HELP_LINES,
  },
  envShortcut: {
    prompt: t("wizard.nostr.privateKeyEnvPrompt"),
    preferredEnvVar: "NOSTR_PRIVATE_KEY",
    isAvailable: ({ cfg, accountId }) =>
      accountId === "default" &&
      Boolean(process.env.NOSTR_PRIVATE_KEY?.trim()) &&
      !hasConfiguredSecretInput(
        resolveNostrAccount({
          cfg,
          accountId,
        }).config.privateKey,
      ),
    apply: async ({ cfg, accountId }) =>
      patchTopLevelChannelConfigSection({
        cfg,
        channel,
        enabled: true,
        clearFields: ["privateKey"],
        patch: buildNostrSetupPatch(accountId, {}),
      }),
  },
  credentials: [
    {
      inputKey: "privateKey",
      providerHint: channel,
      credentialLabel: "private key",
      preferredEnvVar: "NOSTR_PRIVATE_KEY",
      helpTitle: t("wizard.nostr.privateKeyTitle"),
      helpLines: NOSTR_SETUP_HELP_LINES,
      envPrompt: t("wizard.nostr.privateKeyEnvPrompt"),
      keepPrompt: t("wizard.nostr.privateKeyKeep"),
      inputPrompt: t("wizard.nostr.privateKeyInput"),
      allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
      inspect: ({ cfg, accountId }) => {
        const account = resolveNostrAccount({
          cfg,
          accountId,
        });
        return {
          accountConfigured: account.configured,
          hasConfiguredValue: hasConfiguredSecretInput(account.config.privateKey),
          resolvedValue: normalizeSecretInputString(account.config.privateKey),
          envValue: process.env.NOSTR_PRIVATE_KEY?.trim(),
        };
      },
      applyUseEnv: async ({ cfg, accountId }) =>
        patchTopLevelChannelConfigSection({
          cfg,
          channel,
          enabled: true,
          clearFields: ["privateKey"],
          patch: buildNostrSetupPatch(accountId, {}),
        }),
      applySet: async ({ cfg, accountId, resolvedValue }) =>
        patchTopLevelChannelConfigSection({
          cfg,
          channel,
          enabled: true,
          patch: buildNostrSetupPatch(accountId, { privateKey: resolvedValue }),
        }),
    },
  ],
  textInputs: [
    {
      inputKey: "relayUrls",
      message: t("wizard.nostr.relayUrlsPrompt"),
      placeholder: DEFAULT_RELAYS.join(", "),
      required: false,
      applyEmptyValue: true,
      helpTitle: t("wizard.nostr.relaysTitle"),
      helpLines: [t("wizard.nostr.relaysWsOnly"), t("wizard.nostr.helpRelaysOptional")],
      currentValue: ({ cfg, accountId }) => {
        const account = resolveNostrAccount({
          cfg,
          accountId,
        });
        const configuredRelays = cfg.channels?.nostr?.relays;
        return (configuredRelays && configuredRelays.length > 0 ? account.relays : []).join(", ");
      },
      keepPrompt: (value) => t("wizard.nostr.relayUrlsKeep", { value }),
      validate: ({ value }) => parseRelayUrls(value).error,
      applySet: async ({ cfg, accountId, value }) => {
        const relayResult = parseRelayUrls(value);
        return patchTopLevelChannelConfigSection({
          cfg,
          channel,
          enabled: true,
          clearFields: relayResult.relays.length > 0 ? void 0 : ["relays"],
          patch: buildNostrSetupPatch(
            accountId,
            relayResult.relays.length > 0 ? { relays: relayResult.relays } : {},
          ),
        });
      },
    },
  ],
  dmPolicy: nostrDmPolicy,
  disable: (cfg) =>
    patchTopLevelChannelConfigSection({
      cfg,
      channel,
      patch: { enabled: false },
    }),
};
//#endregion
export {
  resolveNostrAccount as a,
  SimplePool as c,
  verifyEvent as d,
  base64 as f,
  resolveDefaultNostrAccountId as i,
  finalizeEvent as l,
  nostrSetupWizard as n,
  normalizePubkey as o,
  secp256k1 as p,
  listNostrAccountIds as r,
  validatePrivateKey as s,
  nostrSetupAdapter as t,
  getPublicKey as u,
};
