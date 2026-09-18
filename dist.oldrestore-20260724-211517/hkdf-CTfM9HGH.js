//#region node_modules/@noble/hashes/utils.js
/**
 * Utilities for hex, bytes, CSPRNG.
 * @module
 */
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes$1(a) {
  return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array");
}
/** Asserts something is positive integer. */
function anumber$1(n, title = "") {
  if (!Number.isSafeInteger(n) || n < 0) {
    const prefix = title && `"${title}" `;
    throw new Error(`${prefix}expected integer >= 0, got ${n}`);
  }
}
/** Asserts something is Uint8Array. */
function abytes$1(value, length, title = "") {
  const bytes = isBytes$1(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || (needsLen && len !== length)) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
/** Asserts something is hash */
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash must wrapped by utils.createHasher");
  anumber$1(h.outputLen);
  anumber$1(h.blockLen);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists$1(instance, checkFinished = true) {
  if (instance.destroyed) throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput$1(out, instance) {
  abytes$1(out, void 0, "digestInto() output");
  const min = instance.outputLen;
  if (out.length < min) throw new Error('"digestInto() output" expected to be of length >=' + min);
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean$1(...arrays) {
  for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView$1(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
  return (word << (32 - shift)) | (word >>> shift);
}
const hasHexBuiltin = /* @__PURE__ */ (() =>
  typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function")();
const hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) =>
  i.toString(16).padStart(2, "0"),
);
/**
 * Convert byte array to hex string. Uses built-in function, when available.
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex(bytes) {
  abytes$1(bytes);
  if (hasHexBuiltin) return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
  return hex;
}
const asciis = {
  _0: 48,
  _9: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102,
};
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
}
/**
 * Convert hex string to byte array. Uses built-in function, when available.
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes(hex) {
  if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin) return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2) throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
/** Copies several Uint8Arrays into one. */
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes$1(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
/** Creates function with outputLen, blockLen, create properties from a class constructor. */
function createHasher(hashCons, info = {}) {
  const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
  const tmp = hashCons(void 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (opts) => hashCons(opts);
  Object.assign(hashC, info);
  return Object.freeze(hashC);
}
/** Cryptographically secure PRNG. Uses internal OS-level `crypto.getRandomValues`. */
function randomBytes(bytesLength = 32) {
  const cr = typeof globalThis === "object" ? globalThis.crypto : null;
  if (typeof cr?.getRandomValues !== "function")
    throw new Error("crypto.getRandomValues must be defined");
  return cr.getRandomValues(new Uint8Array(bytesLength));
}
/** Creates OID opts for NIST hashes, with prefix 06 09 60 86 48 01 65 03 04 02. */
const oidNist = (suffix) => ({
  oid: Uint8Array.from([6, 9, 96, 134, 72, 1, 101, 3, 4, 2, suffix]),
});
//#endregion
//#region node_modules/@noble/hashes/_md.js
/**
 * Internal Merkle-Damgard hash utils.
 * @module
 */
/** Choice: a ? b : c */
function Chi(a, b, c) {
  return (a & b) ^ (~a & c);
}
/** Majority function, true if any two inputs is true. */
function Maj(a, b, c) {
  return (a & b) ^ (a & c) ^ (b & c);
}
/**
 * Merkle-Damgard hash construction base class.
 * Could be used to create MD5, RIPEMD, SHA1, SHA2.
 */
var HashMD = class {
  blockLen;
  outputLen;
  padOffset;
  isLE;
  buffer;
  view;
  finished = false;
  length = 0;
  pos = 0;
  destroyed = false;
  constructor(blockLen, outputLen, padOffset, isLE) {
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView$1(this.buffer);
  }
  update(data) {
    aexists$1(this);
    abytes$1(data);
    const { view, buffer, blockLen } = this;
    const len = data.length;
    for (let pos = 0; pos < len;) {
      const take = Math.min(blockLen - this.pos, len - pos);
      if (take === blockLen) {
        const dataView = createView$1(data);
        for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    aexists$1(this);
    aoutput$1(out, this);
    this.finished = true;
    const { buffer, view, blockLen, isLE } = this;
    let { pos } = this;
    buffer[pos++] = 128;
    clean$1(this.buffer.subarray(pos));
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    for (let i = pos; i < blockLen; i++) buffer[i] = 0;
    view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view, 0);
    const oview = createView$1(out);
    const len = this.outputLen;
    if (len % 4) throw new Error("_sha2: outputLen must be aligned to 32bit");
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
    for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const { buffer, outputLen } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to ||= new this.constructor();
    to.set(...this.get());
    const { blockLen, buffer, length, finished, destroyed, pos } = this;
    to.destroyed = destroyed;
    to.finished = finished;
    to.length = length;
    to.pos = pos;
    if (length % blockLen) to.buffer.set(buffer);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
};
/**
 * Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
 * Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
 */
/** Initial SHA256 state. Bits 0..32 of frac part of sqrt of primes 2..19 */
const SHA256_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225,
]);
/** Initial SHA512 state. Bits 0..64 of frac part of sqrt of primes 2..19 */
const SHA512_IV = /* @__PURE__ */ Uint32Array.from([
  1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129,
  1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209,
]);
//#endregion
//#region node_modules/@noble/hashes/_u64.js
/**
 * Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
 * @todo re-check https://issues.chromium.org/issues/42212588
 * @module
 */
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
  if (le)
    return {
      h: Number(n & U32_MASK64),
      l: Number((n >> _32n) & U32_MASK64),
    };
  return {
    h: Number((n >> _32n) & U32_MASK64) | 0,
    l: Number(n & U32_MASK64) | 0,
  };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
const shrSH = (h, _l, s) => h >>> s;
const shrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
const rotrSH = (h, l, s) => (h >>> s) | (l << (32 - s));
const rotrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
const rotrBH = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return {
    h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0,
    l: l | 0,
  };
}
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
const add5L = (Al, Bl, Cl, Dl, El) =>
  (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;
//#endregion
//#region node_modules/@noble/hashes/sha2.js
/**
 * SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
 * SHA256 is the fastest hash implementable in JS, even faster than Blake3.
 * Check out [RFC 4634](https://www.rfc-editor.org/rfc/rfc4634) and
 * [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
 * @module
 */
/**
 * Round constants:
 * First 32 bits of fractional parts of the cube roots of the first 64 primes 2..311)
 */
const SHA256_K = /* @__PURE__ */ Uint32Array.from([
  1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221,
  3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
  3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
  2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
  666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037,
  2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
  430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779,
  1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298,
]);
/** Reusable temporary buffer. "W" comes straight from spec. */
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
/** Internal 32-byte base SHA2 hash class. */
var SHA2_32B = class extends HashMD {
  constructor(outputLen) {
    super(64, outputLen, 8, false);
  }
  get() {
    const { A, B, C, D, E, F, G, H } = this;
    return [A, B, C, D, E, F, G, H];
  }
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ (W15 >>> 3);
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ (W2 >>> 10);
      SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
    }
    let { A, B, C, D, E, F, G, H } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
      const T2 = ((rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C)) | 0;
      H = G;
      G = F;
      F = E;
      E = (D + T1) | 0;
      D = C;
      C = B;
      B = A;
      A = (T1 + T2) | 0;
    }
    A = (A + this.A) | 0;
    B = (B + this.B) | 0;
    C = (C + this.C) | 0;
    D = (D + this.D) | 0;
    E = (E + this.E) | 0;
    F = (F + this.F) | 0;
    G = (G + this.G) | 0;
    H = (H + this.H) | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    clean$1(SHA256_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    clean$1(this.buffer);
  }
};
/** Internal SHA2-256 hash class. */
var _SHA256 = class extends SHA2_32B {
  A = SHA256_IV[0] | 0;
  B = SHA256_IV[1] | 0;
  C = SHA256_IV[2] | 0;
  D = SHA256_IV[3] | 0;
  E = SHA256_IV[4] | 0;
  F = SHA256_IV[5] | 0;
  G = SHA256_IV[6] | 0;
  H = SHA256_IV[7] | 0;
  constructor() {
    super(32);
  }
};
const K512 = /* @__PURE__ */ (() =>
  split(
    [
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817",
    ].map((n) => BigInt(n)),
  ))();
const SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
const SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
const SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
const SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
/** Internal 64-byte base SHA2 hash class. */
var SHA2_64B = class extends HashMD {
  constructor(outputLen) {
    super(128, outputLen, 16, false);
  }
  get() {
    const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
  }
  set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
    this.Ah = Ah | 0;
    this.Al = Al | 0;
    this.Bh = Bh | 0;
    this.Bl = Bl | 0;
    this.Ch = Ch | 0;
    this.Cl = Cl | 0;
    this.Dh = Dh | 0;
    this.Dl = Dl | 0;
    this.Eh = Eh | 0;
    this.El = El | 0;
    this.Fh = Fh | 0;
    this.Fl = Fl | 0;
    this.Gh = Gh | 0;
    this.Gl = Gl | 0;
    this.Hh = Hh | 0;
    this.Hl = Hl | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) {
      SHA512_W_H[i] = view.getUint32(offset);
      SHA512_W_L[i] = view.getUint32((offset += 4));
    }
    for (let i = 16; i < 80; i++) {
      const W15h = SHA512_W_H[i - 15] | 0;
      const W15l = SHA512_W_L[i - 15] | 0;
      const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
      const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
      const W2h = SHA512_W_H[i - 2] | 0;
      const W2l = SHA512_W_L[i - 2] | 0;
      const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
      const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
      const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
      const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
      SHA512_W_H[i] = SUMh | 0;
      SHA512_W_L[i] = SUMl | 0;
    }
    let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
    for (let i = 0; i < 80; i++) {
      const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
      const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
      const CHIh = (Eh & Fh) ^ (~Eh & Gh);
      const CHIl = (El & Fl) ^ (~El & Gl);
      const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
      const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
      const T1l = T1ll | 0;
      const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
      const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
      const MAJh = (Ah & Bh) ^ (Ah & Ch) ^ (Bh & Ch);
      const MAJl = (Al & Bl) ^ (Al & Cl) ^ (Bl & Cl);
      Hh = Gh | 0;
      Hl = Gl | 0;
      Gh = Fh | 0;
      Gl = Fl | 0;
      Fh = Eh | 0;
      Fl = El | 0;
      ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
      Dh = Ch | 0;
      Dl = Cl | 0;
      Ch = Bh | 0;
      Cl = Bl | 0;
      Bh = Ah | 0;
      Bl = Al | 0;
      const All = add3L(T1l, sigma0l, MAJl);
      Ah = add3H(All, T1h, sigma0h, MAJh);
      Al = All | 0;
    }
    ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
    ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
    ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
    ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
    ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
    ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
    ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
    ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
    this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
  }
  roundClean() {
    clean$1(SHA512_W_H, SHA512_W_L);
  }
  destroy() {
    clean$1(this.buffer);
    this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
};
/** Internal SHA2-512 hash class. */
var _SHA512 = class extends SHA2_64B {
  Ah = SHA512_IV[0] | 0;
  Al = SHA512_IV[1] | 0;
  Bh = SHA512_IV[2] | 0;
  Bl = SHA512_IV[3] | 0;
  Ch = SHA512_IV[4] | 0;
  Cl = SHA512_IV[5] | 0;
  Dh = SHA512_IV[6] | 0;
  Dl = SHA512_IV[7] | 0;
  Eh = SHA512_IV[8] | 0;
  El = SHA512_IV[9] | 0;
  Fh = SHA512_IV[10] | 0;
  Fl = SHA512_IV[11] | 0;
  Gh = SHA512_IV[12] | 0;
  Gl = SHA512_IV[13] | 0;
  Hh = SHA512_IV[14] | 0;
  Hl = SHA512_IV[15] | 0;
  constructor() {
    super(64);
  }
};
/**
 * SHA2-256 hash function from RFC 4634. In JS it's the fastest: even faster than Blake3. Some info:
 *
 * - Trying 2^128 hashes would get 50% chance of collision, using birthday attack.
 * - BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
 * - Each sha256 hash is executing 2^18 bit operations.
 * - Good 2024 ASICs can do 200Th/sec with 3500 watts of power, corresponding to 2^36 hashes/joule.
 */
const sha256 = /* @__PURE__ */ createHasher(() => new _SHA256(), /* @__PURE__ */ oidNist(1));
/** SHA2-512 hash function from RFC 4634. */
const sha512 = /* @__PURE__ */ createHasher(() => new _SHA512(), /* @__PURE__ */ oidNist(3));
//#endregion
//#region node_modules/@noble/curves/utils.js
/**
 * Hex, bytes and number utilities.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$2 = /* @__PURE__ */ BigInt(0);
const _1n$2 = /* @__PURE__ */ BigInt(1);
function abool$1(value, title = "") {
  if (typeof value !== "boolean") {
    const prefix = title && `"${title}" `;
    throw new Error(prefix + "expected boolean, got type=" + typeof value);
  }
  return value;
}
function abignumber(n) {
  if (typeof n === "bigint") {
    if (!isPosBig(n)) throw new Error("positive bigint expected, got " + n);
  } else anumber$1(n);
  return n;
}
function numberToHexUnpadded(num) {
  const hex = abignumber(num).toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string") throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n$2 : BigInt("0x" + hex);
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  return hexToNumber(bytesToHex(copyBytes$1(abytes$1(bytes)).reverse()));
}
function numberToBytesBE(n, len) {
  anumber$1(len);
  n = abignumber(n);
  const res = hexToBytes(n.toString(16).padStart(len * 2, "0"));
  if (res.length !== len) throw new Error("number too large");
  return res;
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
/**
 * Copies Uint8Array. We can't use u8a.slice(), because u8a can be Buffer,
 * and Buffer#slice creates mutable copy. Never use Buffers!
 */
function copyBytes$1(bytes) {
  return Uint8Array.from(bytes);
}
/**
 * Decodes 7-bit ASCII string to Uint8Array, throws on non-ascii symbols
 * Should be safe to use for things expected to be ASCII.
 * Returns exact same result as `TextEncoder` for ASCII or throws.
 */
function asciiToBytes(ascii) {
  return Uint8Array.from(ascii, (c, i) => {
    const charCode = c.charCodeAt(0);
    if (c.length !== 1 || charCode > 127)
      throw new Error(
        `string contains non-ASCII character "${ascii[i]}" with code ${charCode} at position ${i}`,
      );
    return charCode;
  });
}
const isPosBig = (n) => typeof n === "bigint" && _0n$2 <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
 * Asserts min <= n < max. NOTE: It's < max and not <= max.
 * @example
 * aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
 */
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
/**
 * Calculates amount of bits in a bigint.
 * Same as `n.toString(2).length`
 * TODO: merge with nLength in modular
 */
function bitLen(n) {
  let len;
  for (len = 0; n > _0n$2; n >>= _1n$2, len += 1);
  return len;
}
/**
 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
 */
const bitMask = (n) => (_1n$2 << BigInt(n)) - _1n$2;
/**
 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
 * @returns function that will call DRBG until 2nd arg returns something meaningful
 * @example
 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
 */
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  anumber$1(hashLen, "hashLen");
  anumber$1(qByteLen, "qByteLen");
  if (typeof hmacFn !== "function") throw new Error("hmacFn must be a function");
  const u8n = (len) => new Uint8Array(len);
  const NULL = Uint8Array.of();
  const byte0 = Uint8Array.of(0);
  const byte1 = Uint8Array.of(1);
  const _maxDrbgIters = 1e3;
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...msgs) => hmacFn(k, concatBytes(v, ...msgs));
  const reseed = (seed = NULL) => {
    k = h(byte0, seed);
    v = h();
    if (seed.length === 0) return;
    k = h(byte1, seed);
    v = h();
  };
  const gen = () => {
    if (i++ >= _maxDrbgIters) throw new Error("drbg: tried max amount of iterations");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen()))) reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, fields = {}, optFields = {}) {
  if (!object || typeof object !== "object") throw new Error("expected valid options object");
  function checkField(fieldName, expectedType, isOpt) {
    const val = object[fieldName];
    if (isOpt && val === void 0) return;
    const current = typeof val;
    if (current !== expectedType || val === null)
      throw new Error(`param "${fieldName}" is invalid: expected ${expectedType}, got ${current}`);
  }
  const iter = (f, isOpt) => Object.entries(f).forEach(([k, v]) => checkField(k, v, isOpt));
  iter(fields, false);
  iter(optFields, true);
}
/**
 * Memoizes (caches) computation result.
 * Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
 */
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0) return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
//#endregion
//#region node_modules/@noble/curves/abstract/modular.js
/**
 * Utils for modular division and fields.
 * Field over 11 is a finite (Galois) field is integer number operations `mod 11`.
 * There is no division: it is replaced by modular multiplicative inverse.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n$1 = /* @__PURE__ */ BigInt(0),
  _1n$1 = /* @__PURE__ */ BigInt(1),
  _2n = /* @__PURE__ */ BigInt(2);
const _3n = /* @__PURE__ */ BigInt(3),
  _4n = /* @__PURE__ */ BigInt(4),
  _5n = /* @__PURE__ */ BigInt(5);
const _7n = /* @__PURE__ */ BigInt(7),
  _8n = /* @__PURE__ */ BigInt(8),
  _9n = /* @__PURE__ */ BigInt(9);
const _16n = /* @__PURE__ */ BigInt(16);
function mod(a, b) {
  const result = a % b;
  return result >= _0n$1 ? result : b + result;
}
/** Does `x^(2^power)` mod p. `pow2(30, 4)` == `30^(2^4)` */
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n$1) {
    res *= res;
    res %= modulo;
  }
  return res;
}
/**
 * Inverses number over modulo.
 * Implemented using [Euclidean GCD](https://brilliant.org/wiki/extended-euclidean-algorithm/).
 */
function invert(number, modulo) {
  if (number === _0n$1) throw new Error("invert: expected non-zero number");
  if (modulo <= _0n$1) throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n$1,
    y = _1n$1,
    u = _1n$1,
    v = _0n$1;
  while (a !== _0n$1) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    ((b = a), (a = r), (x = u), (y = v), (u = m), (v = n));
  }
  if (b !== _1n$1) throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function assertIsSquare(Fp, root, n) {
  if (!Fp.eql(Fp.sqr(root), n)) throw new Error("Cannot find square root");
}
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n$1) / _4n;
  const root = Fp.pow(n, p1div4);
  assertIsSquare(Fp, root, n);
  return root;
}
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i = Fp.mul(Fp.mul(nv, _2n), v);
  const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
  assertIsSquare(Fp, root, n);
  return root;
}
function sqrt9mod16(P) {
  const Fp_ = Field(P);
  const tn = tonelliShanks(P);
  const c1 = tn(Fp_, Fp_.neg(Fp_.ONE));
  const c2 = tn(Fp_, c1);
  const c3 = tn(Fp_, Fp_.neg(c1));
  const c4 = (P + _7n) / _16n;
  return (Fp, n) => {
    let tv1 = Fp.pow(n, c4);
    let tv2 = Fp.mul(tv1, c1);
    const tv3 = Fp.mul(tv1, c2);
    const tv4 = Fp.mul(tv1, c3);
    const e1 = Fp.eql(Fp.sqr(tv2), n);
    const e2 = Fp.eql(Fp.sqr(tv3), n);
    tv1 = Fp.cmov(tv1, tv2, e1);
    tv2 = Fp.cmov(tv4, tv3, e2);
    const e3 = Fp.eql(Fp.sqr(tv2), n);
    const root = Fp.cmov(tv1, tv2, e3);
    assertIsSquare(Fp, root, n);
    return root;
  };
}
/**
 * Tonelli-Shanks square root search algorithm.
 * 1. https://eprint.iacr.org/2012/685.pdf (page 12)
 * 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
 * @param P field order
 * @returns function that takes field Fp (created from P) and number n
 */
function tonelliShanks(P) {
  if (P < _3n) throw new Error("sqrt is not defined for small field");
  let Q = P - _1n$1;
  let S = 0;
  while (Q % _2n === _0n$1) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1)
    if (Z++ > 1e3) throw new Error("Cannot find square root: probably non-prime P");
  if (S === 1) return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n$1) / _2n;
  return function tonelliSlow(Fp, n) {
    if (Fp.is0(n)) return n;
    if (FpLegendre(Fp, n) !== 1) throw new Error("Cannot find square root");
    let M = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t)) return Fp.ZERO;
      let i = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i++;
        t_tmp = Fp.sqr(t_tmp);
        if (i === M) throw new Error("Cannot find square root");
      }
      const exponent = _1n$1 << BigInt(M - i - 1);
      const b = Fp.pow(c, exponent);
      M = i;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  };
}
/**
 * Square root for a finite field. Will try optimized versions first:
 *
 * 1. P ≡ 3 (mod 4)
 * 2. P ≡ 5 (mod 8)
 * 3. P ≡ 9 (mod 16)
 * 4. Tonelli-Shanks algorithm
 *
 * Different algorithms can give different roots, it is up to user to decide which one they want.
 * For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
 */
function FpSqrt(P) {
  if (P % _4n === _3n) return sqrt3mod4;
  if (P % _8n === _5n) return sqrt5mod8;
  if (P % _16n === _9n) return sqrt9mod16(P);
  return tonelliShanks(P);
}
const isNegativeLE = (num, modulo) => (mod(num, modulo) & _1n$1) === _1n$1;
const FIELD_FIELDS = [
  "create",
  "isValid",
  "is0",
  "neg",
  "inv",
  "sqrt",
  "sqr",
  "eql",
  "add",
  "sub",
  "mul",
  "pow",
  "div",
  "addN",
  "subN",
  "mulN",
  "sqrN",
];
function validateField(field) {
  validateObject(
    field,
    FIELD_FIELDS.reduce(
      (map, val) => {
        map[val] = "function";
        return map;
      },
      {
        ORDER: "bigint",
        BYTES: "number",
        BITS: "number",
      },
    ),
  );
  return field;
}
/**
 * Same as `pow` but for Fp: non-constant-time.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 */
function FpPow(Fp, num, power) {
  if (power < _0n$1) throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n$1) return Fp.ONE;
  if (power === _1n$1) return num;
  let p = Fp.ONE;
  let d = num;
  while (power > _0n$1) {
    if (power & _1n$1) p = Fp.mul(p, d);
    d = Fp.sqr(d);
    power >>= _1n$1;
  }
  return p;
}
/**
 * Efficiently invert an array of Field elements.
 * Exception-free. Will return `undefined` for 0 elements.
 * @param passZero map 0 to 0 (instead of undefined)
 */
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (Fp.is0(num)) return acc;
    inverted[i] = acc;
    return Fp.mul(acc, num);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (Fp.is0(num)) return acc;
    inverted[i] = Fp.mul(acc, inverted[i]);
    return Fp.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
/**
 * Legendre symbol.
 * Legendre constant is used to calculate Legendre symbol (a | p)
 * which denotes the value of a^((p-1)/2) (mod p).
 *
 * * (a | p) ≡ 1    if a is a square (mod p), quadratic residue
 * * (a | p) ≡ -1   if a is not a square (mod p), quadratic non residue
 * * (a | p) ≡ 0    if a ≡ 0 (mod p)
 */
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n$1) / _2n;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no) throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0) anumber$1(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  return {
    nBitLength: _nBitLength,
    nByteLength: Math.ceil(_nBitLength / 8),
  };
}
var _Field = class {
  ORDER;
  BITS;
  BYTES;
  isLE;
  ZERO = _0n$1;
  ONE = _1n$1;
  _lengths;
  _sqrt;
  _mod;
  constructor(ORDER, opts = {}) {
    if (ORDER <= _0n$1) throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    let _nbitLength = void 0;
    this.isLE = false;
    if (opts != null && typeof opts === "object") {
      if (typeof opts.BITS === "number") _nbitLength = opts.BITS;
      if (typeof opts.sqrt === "function") this.sqrt = opts.sqrt;
      if (typeof opts.isLE === "boolean") this.isLE = opts.isLE;
      if (opts.allowedLengths) this._lengths = opts.allowedLengths?.slice();
      if (typeof opts.modFromBytes === "boolean") this._mod = opts.modFromBytes;
    }
    const { nBitLength, nByteLength } = nLength(ORDER, _nbitLength);
    if (nByteLength > 2048) throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    this.ORDER = ORDER;
    this.BITS = nBitLength;
    this.BYTES = nByteLength;
    this._sqrt = void 0;
    Object.preventExtensions(this);
  }
  create(num) {
    return mod(num, this.ORDER);
  }
  isValid(num) {
    if (typeof num !== "bigint")
      throw new Error("invalid field element: expected bigint, got " + typeof num);
    return _0n$1 <= num && num < this.ORDER;
  }
  is0(num) {
    return num === _0n$1;
  }
  isValidNot0(num) {
    return !this.is0(num) && this.isValid(num);
  }
  isOdd(num) {
    return (num & _1n$1) === _1n$1;
  }
  neg(num) {
    return mod(-num, this.ORDER);
  }
  eql(lhs, rhs) {
    return lhs === rhs;
  }
  sqr(num) {
    return mod(num * num, this.ORDER);
  }
  add(lhs, rhs) {
    return mod(lhs + rhs, this.ORDER);
  }
  sub(lhs, rhs) {
    return mod(lhs - rhs, this.ORDER);
  }
  mul(lhs, rhs) {
    return mod(lhs * rhs, this.ORDER);
  }
  pow(num, power) {
    return FpPow(this, num, power);
  }
  div(lhs, rhs) {
    return mod(lhs * invert(rhs, this.ORDER), this.ORDER);
  }
  sqrN(num) {
    return num * num;
  }
  addN(lhs, rhs) {
    return lhs + rhs;
  }
  subN(lhs, rhs) {
    return lhs - rhs;
  }
  mulN(lhs, rhs) {
    return lhs * rhs;
  }
  inv(num) {
    return invert(num, this.ORDER);
  }
  sqrt(num) {
    if (!this._sqrt) this._sqrt = FpSqrt(this.ORDER);
    return this._sqrt(this, num);
  }
  toBytes(num) {
    return this.isLE ? numberToBytesLE(num, this.BYTES) : numberToBytesBE(num, this.BYTES);
  }
  fromBytes(bytes, skipValidation = false) {
    abytes$1(bytes);
    const { _lengths: allowedLengths, BYTES, isLE, ORDER, _mod: modFromBytes } = this;
    if (allowedLengths) {
      if (!allowedLengths.includes(bytes.length) || bytes.length > BYTES)
        throw new Error(
          "Field.fromBytes: expected " + allowedLengths + " bytes, got " + bytes.length,
        );
      const padded = new Uint8Array(BYTES);
      padded.set(bytes, isLE ? 0 : padded.length - bytes.length);
      bytes = padded;
    }
    if (bytes.length !== BYTES)
      throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
    let scalar = isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    if (modFromBytes) scalar = mod(scalar, ORDER);
    if (!skipValidation) {
      if (!this.isValid(scalar))
        throw new Error("invalid field element: outside of range 0..ORDER");
    }
    return scalar;
  }
  invertBatch(lst) {
    return FpInvertBatch(this, lst);
  }
  cmov(a, b, condition) {
    return condition ? b : a;
  }
};
/**
 * Creates a finite field. Major performance optimizations:
 * * 1. Denormalized operations like mulN instead of mul.
 * * 2. Identical object shape: never add or remove keys.
 * * 3. `Object.freeze`.
 * Fragile: always run a benchmark on a change.
 * Security note: operations don't check 'isValid' for all elements for performance reasons,
 * it is caller responsibility to check this.
 * This is low-level code, please make sure you know what you're doing.
 *
 * Note about field properties:
 * * CHARACTERISTIC p = prime number, number of elements in main subgroup.
 * * ORDER q = similar to cofactor in curves, may be composite `q = p^m`.
 *
 * @param ORDER field order, probably prime, or could be composite
 * @param bitLen how many bits the field consumes
 * @param isLE (default: false) if encoding / decoding should be in little-endian
 * @param redef optional faster redefinitions of sqrt and other methods
 */
function Field(ORDER, opts = {}) {
  return new _Field(ORDER, opts);
}
/**
 * Returns total number of bytes consumed by the field element.
 * For example, 32 bytes for usual 256-bit weierstrass curve.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of field
 */
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint") throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
/**
 * Returns minimal amount of bytes that can be safely reduced
 * by field order.
 * Should be 2^-128 for 128-bit curve such as P256.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of target hash
 */
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
/**
 * "Constant-time" private key generation utility.
 * Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
 * and convert them into private scalar, with the modulo bias being negligible.
 * Needs at least 48 bytes of input for 32-byte private key.
 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
 * FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
 * RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
 * @param hash hash output from SHA3 or a similar function
 * @param groupOrder size of subgroup - (e.g. secp256k1.Point.Fn.ORDER)
 * @param isLE interpret hash bytes as LE num
 * @returns valid private scalar
 */
function mapHashToField(key, fieldOrder, isLE = false) {
  abytes$1(key);
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const reduced =
    mod(isLE ? bytesToNumberLE(key) : bytesToNumberBE(key), fieldOrder - _1n$1) + _1n$1;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
//#endregion
//#region node_modules/@noble/curves/abstract/curve.js
/**
 * Methods for elliptic curve multiplication by scalars.
 * Contains wNAF, pippenger.
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
function negateCt(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
/**
 * Takes a bunch of Projective Points but executes only one
 * inversion on all of them. Inversion is very slow operation,
 * so this improves performance massively.
 * Optimization: converts a list of projective points to a list of identical points with Z=1.
 */
function normalizeZ(c, points) {
  const invertedZs = FpInvertBatch(
    c.Fp,
    points.map((p) => p.Z),
  );
  return points.map((p, i) => c.fromAffine(p.toAffine(invertedZs[i])));
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  return {
    windows,
    windowSize,
    mask: bitMask(W),
    maxNumber,
    shiftBy: BigInt(W),
  };
}
function calcOffsets(n, window, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n;
  }
  const offsetStart = window * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window % 2 !== 0;
  return {
    nextN,
    offset,
    isZero,
    isNeg,
    isNegF,
    offsetF: offsetStart,
  };
}
const pointPrecomputes = /* @__PURE__ */ new WeakMap();
const pointWindowSizes = /* @__PURE__ */ new WeakMap();
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function assert0(n) {
  if (n !== _0n) throw new Error("invalid wNAF");
}
/**
 * Elliptic curve multiplication of Point by scalar. Fragile.
 * Table generation takes **30MB of ram and 10ms on high-end CPU**,
 * but may take much longer on slow devices. Actual generation will happen on
 * first call of `multiply()`. By default, `BASE` point is precomputed.
 *
 * Scalars should always be less than curve order: this should be checked inside of a curve itself.
 * Creates precomputation tables for fast multiplication:
 * - private scalar is split by fixed size windows of W bits
 * - every window point is collected from window's table & added to accumulator
 * - since windows are different, same point inside tables won't be accessed more than once per calc
 * - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
 * - +1 window is neccessary for wNAF
 * - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
 *
 * @todo Research returning 2d JS array of windows, instead of a single window.
 * This would allow windows to be in different memory locations
 */
var wNAF = class {
  BASE;
  ZERO;
  Fn;
  bits;
  constructor(Point, bits) {
    this.BASE = Point.BASE;
    this.ZERO = Point.ZERO;
    this.Fn = Point.Fn;
    this.bits = bits;
  }
  _unsafeLadder(elm, n, p = this.ZERO) {
    let d = elm;
    while (n > _0n) {
      if (n & _1n) p = p.add(d);
      d = d.double();
      n >>= _1n;
    }
    return p;
  }
  /**
   * Creates a wNAF precomputation window. Used for caching.
   * Default window size is set by `utils.precompute()` and is equal to 8.
   * Number of precomputed points depends on the curve size:
   * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
   * - 𝑊 is the window size
   * - 𝑛 is the bitlength of the curve order.
   * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
   * @param point Point instance
   * @param W window size
   * @returns precomputed point tables flattened to a single array
   */
  precomputeWindow(point, W) {
    const { windows, windowSize } = calcWOpts(W, this.bits);
    const points = [];
    let p = point;
    let base = p;
    for (let window = 0; window < windows; window++) {
      base = p;
      points.push(base);
      for (let i = 1; i < windowSize; i++) {
        base = base.add(p);
        points.push(base);
      }
      p = base.double();
    }
    return points;
  }
  /**
   * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
   * More compact implementation:
   * https://github.com/paulmillr/noble-secp256k1/blob/47cb1669b6e506ad66b35fe7d76132ae97465da2/index.ts#L502-L541
   * @returns real and fake (for const-time) points
   */
  wNAF(W, precomputes, n) {
    if (!this.Fn.isValid(n)) throw new Error("invalid scalar");
    let p = this.ZERO;
    let f = this.BASE;
    const wo = calcWOpts(W, this.bits);
    for (let window = 0; window < wo.windows; window++) {
      const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
      n = nextN;
      if (isZero) f = f.add(negateCt(isNegF, precomputes[offsetF]));
      else p = p.add(negateCt(isNeg, precomputes[offset]));
    }
    assert0(n);
    return {
      p,
      f,
    };
  }
  /**
   * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
   * @param acc accumulator point to add result of multiplication
   * @returns point
   */
  wNAFUnsafe(W, precomputes, n, acc = this.ZERO) {
    const wo = calcWOpts(W, this.bits);
    for (let window = 0; window < wo.windows; window++) {
      if (n === _0n) break;
      const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
      n = nextN;
      if (isZero) continue;
      else {
        const item = precomputes[offset];
        acc = acc.add(isNeg ? item.negate() : item);
      }
    }
    assert0(n);
    return acc;
  }
  getPrecomputes(W, point, transform) {
    let comp = pointPrecomputes.get(point);
    if (!comp) {
      comp = this.precomputeWindow(point, W);
      if (W !== 1) {
        if (typeof transform === "function") comp = transform(comp);
        pointPrecomputes.set(point, comp);
      }
    }
    return comp;
  }
  cached(point, scalar, transform) {
    const W = getW(point);
    return this.wNAF(W, this.getPrecomputes(W, point, transform), scalar);
  }
  unsafe(point, scalar, transform, prev) {
    const W = getW(point);
    if (W === 1) return this._unsafeLadder(point, scalar, prev);
    return this.wNAFUnsafe(W, this.getPrecomputes(W, point, transform), scalar, prev);
  }
  createCache(P, W) {
    validateW(W, this.bits);
    pointWindowSizes.set(P, W);
    pointPrecomputes.delete(P);
  }
  hasCache(elm) {
    return getW(elm) !== 1;
  }
};
/**
 * Endomorphism-specific multiplication for Koblitz curves.
 * Cost: 128 dbl, 0-256 adds.
 */
function mulEndoUnsafe(Point, point, k1, k2) {
  let acc = point;
  let p1 = Point.ZERO;
  let p2 = Point.ZERO;
  while (k1 > _0n || k2 > _0n) {
    if (k1 & _1n) p1 = p1.add(acc);
    if (k2 & _1n) p2 = p2.add(acc);
    acc = acc.double();
    k1 >>= _1n;
    k2 >>= _1n;
  }
  return {
    p1,
    p2,
  };
}
function createField(order, field, isLE) {
  if (field) {
    if (field.ORDER !== order) throw new Error("Field.ORDER must match order: Fp == p, Fn == n");
    validateField(field);
    return field;
  } else return Field(order, { isLE });
}
/** Validates CURVE opts and creates fields */
function createCurveFields(type, CURVE, curveOpts = {}, FpFnLE) {
  if (FpFnLE === void 0) FpFnLE = type === "edwards";
  if (!CURVE || typeof CURVE !== "object") throw new Error(`expected valid ${type} CURVE object`);
  for (const p of ["p", "n", "h"]) {
    const val = CURVE[p];
    if (!(typeof val === "bigint" && val > _0n))
      throw new Error(`CURVE.${p} must be positive bigint`);
  }
  const Fp = createField(CURVE.p, curveOpts.Fp, FpFnLE);
  const Fn = createField(CURVE.n, curveOpts.Fn, FpFnLE);
  const params = ["Gx", "Gy", "a", type === "weierstrass" ? "b" : "d"];
  for (const p of params)
    if (!Fp.isValid(CURVE[p]))
      throw new Error(`CURVE.${p} must be valid field element of CURVE.Fp`);
  CURVE = Object.freeze(Object.assign({}, CURVE));
  return {
    CURVE,
    Fp,
    Fn,
  };
}
function createKeygen(randomSecretKey, getPublicKey) {
  return function keygen(seed) {
    const secretKey = randomSecretKey(seed);
    return {
      secretKey,
      publicKey: getPublicKey(secretKey),
    };
  };
}
//#endregion
//#region node_modules/@noble/hashes/hmac.js
/**
 * HMAC: RFC2104 message authentication code.
 * @module
 */
/** Internal class for HMAC. */
var _HMAC = class {
  oHash;
  iHash;
  blockLen;
  outputLen;
  finished = false;
  destroyed = false;
  constructor(hash, key) {
    ahash(hash);
    abytes$1(key, void 0, "key");
    this.iHash = hash.create();
    if (typeof this.iHash.update !== "function")
      throw new Error("Expected instance of class which extends utils.Hash");
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
    this.iHash.update(pad);
    this.oHash = hash.create();
    for (let i = 0; i < pad.length; i++) pad[i] ^= 106;
    this.oHash.update(pad);
    clean$1(pad);
  }
  update(buf) {
    aexists$1(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    aexists$1(this);
    abytes$1(out, this.outputLen, "output");
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    to ||= Object.create(Object.getPrototypeOf(this), {});
    const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  clone() {
    return this._cloneInto();
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
};
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 * @example
 * import { hmac } from '@noble/hashes/hmac';
 * import { sha256 } from '@noble/hashes/sha2';
 * const mac1 = hmac(sha256, 'key', 'message');
 */
const hmac = (hash, key, message) => new _HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new _HMAC(hash, key);
//#endregion
//#region node_modules/@noble/ciphers/utils.js
/**
 * Utilities for hex, bytes, CSPRNG.
 * @module
 */
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
function isBytes(a) {
  return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array");
}
/** Asserts something is boolean. */
function abool(b) {
  if (typeof b !== "boolean") throw new Error(`boolean expected, not ${b}`);
}
/** Asserts something is positive integer. */
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error("positive integer expected, got " + n);
}
/** Asserts something is Uint8Array. */
function abytes(value, length, title = "") {
  const bytes = isBytes(value);
  const len = value?.length;
  const needsLen = length !== void 0;
  if (!bytes || (needsLen && len !== length)) {
    const prefix = title && `"${title}" `;
    const ofLen = needsLen ? ` of length ${length}` : "";
    const got = bytes ? `length=${len}` : `type=${typeof value}`;
    throw new Error(prefix + "expected Uint8Array" + ofLen + ", got " + got);
  }
  return value;
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
  if (instance.destroyed) throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
  abytes(out, void 0, "output");
  const min = instance.outputLen;
  if (out.length < min)
    throw new Error("digestInto() expects output buffer of length at least " + min);
}
/** Cast u8 / u16 / u32 to u8. */
function u8(arr) {
  return new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** Cast u8 / u16 / u32 to u32. */
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/** Zeroize a byte array. Warning: JS provides no guarantees. */
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/** Create DataView of an array for easy byte-level manipulation. */
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
const isLE = /* @__PURE__ */ (() =>
  new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
/**
 * Checks if two U8A use same underlying buffer and overlaps.
 * This is invalid and can corrupt data.
 */
function overlapBytes(a, b) {
  return (
    a.buffer === b.buffer &&
    a.byteOffset < b.byteOffset + b.byteLength &&
    b.byteOffset < a.byteOffset + a.byteLength
  );
}
/**
 * If input and output overlap and input starts before output, we will overwrite end of input before
 * we start processing it, so this is not supported for most ciphers (except chacha/salse, which designed with this)
 */
function complexOverlapBytes(input, output) {
  if (overlapBytes(input, output) && input.byteOffset < output.byteOffset)
    throw new Error("complex overlap of input and output is not supported");
}
function checkOpts(defaults, opts) {
  if (opts == null || typeof opts !== "object") throw new Error("options must be defined");
  return Object.assign(defaults, opts);
}
/** Compares 2 uint8array-s in kinda constant time. */
function equalBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
/**
 * Wraps a cipher: validates args, ensures encrypt() can only be called once.
 * @__NO_SIDE_EFFECTS__
 */
const wrapCipher = (params, constructor) => {
  function wrappedCipher(key, ...args) {
    abytes(key, void 0, "key");
    if (!isLE) throw new Error("Non little-endian hardware is not yet supported");
    if (params.nonceLength !== void 0) {
      const nonce = args[0];
      abytes(nonce, params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
    }
    const tagl = params.tagLength;
    if (tagl && args[1] !== void 0) abytes(args[1], void 0, "AAD");
    const cipher = constructor(key, ...args);
    const checkOutput = (fnLength, output) => {
      if (output !== void 0) {
        if (fnLength !== 2) throw new Error("cipher output not supported");
        abytes(output, void 0, "output");
      }
    };
    let called = false;
    return {
      encrypt(data, output) {
        if (called) throw new Error("cannot encrypt() twice with same key + nonce");
        called = true;
        abytes(data);
        checkOutput(cipher.encrypt.length, output);
        return cipher.encrypt(data, output);
      },
      decrypt(data, output) {
        abytes(data);
        if (tagl && data.length < tagl)
          throw new Error('"ciphertext" expected length bigger than tagLength=' + tagl);
        checkOutput(cipher.decrypt.length, output);
        return cipher.decrypt(data, output);
      },
    };
  }
  Object.assign(wrappedCipher, params);
  return wrappedCipher;
};
/**
 * By default, returns u8a of length.
 * When out is available, it checks it for validity and uses it.
 */
function getOutput(expectedLength, out, onlyAligned = true) {
  if (out === void 0) return new Uint8Array(expectedLength);
  if (out.length !== expectedLength)
    throw new Error(
      '"output" expected Uint8Array of length ' + expectedLength + ", got: " + out.length,
    );
  if (onlyAligned && !isAligned32(out)) throw new Error("invalid output, must be aligned");
  return out;
}
function u64Lengths(dataLength, aadLength, isLE) {
  abool(isLE);
  const num = /* @__PURE__ */ new Uint8Array(16);
  const view = createView(num);
  view.setBigUint64(0, BigInt(aadLength), isLE);
  view.setBigUint64(8, BigInt(dataLength), isLE);
  return num;
}
function isAligned32(bytes) {
  return bytes.byteOffset % 4 === 0;
}
function copyBytes(bytes) {
  return Uint8Array.from(bytes);
}
//#endregion
//#region node_modules/@noble/ciphers/_polyval.js
/**
 * GHash from AES-GCM and its little-endian "mirror image" Polyval from AES-SIV.
 *
 * Implemented in terms of GHash with conversion function for keys
 * GCM GHASH from
 * [NIST SP800-38d](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-38d.pdf),
 * SIV from
 * [RFC 8452](https://www.rfc-editor.org/rfc/rfc8452).
 *
 * GHASH   modulo: x^128 + x^7   + x^2   + x     + 1
 * POLYVAL modulo: x^128 + x^127 + x^126 + x^121 + 1
 *
 * @module
 */
const BLOCK_SIZE$1 = 16;
const ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
const ZEROS32 = u32(ZEROS16);
const POLY$1 = 225;
const mul2$1 = (s0, s1, s2, s3) => {
  const hiBit = s3 & 1;
  return {
    s3: (s2 << 31) | (s3 >>> 1),
    s2: (s1 << 31) | (s2 >>> 1),
    s1: (s0 << 31) | (s1 >>> 1),
    s0: (s0 >>> 1) ^ ((POLY$1 << 24) & -(hiBit & 1)),
  };
};
const swapLE = (n) =>
  (((n >>> 0) & 255) << 24) |
  (((n >>> 8) & 255) << 16) |
  (((n >>> 16) & 255) << 8) |
  ((n >>> 24) & 255) |
  0;
/**
 * `mulX_POLYVAL(ByteReverse(H))` from spec
 * @param k mutated in place
 */
function _toGHASHKey(k) {
  k.reverse();
  const hiBit = k[15] & 1;
  let carry = 0;
  for (let i = 0; i < k.length; i++) {
    const t = k[i];
    k[i] = (t >>> 1) | carry;
    carry = (t & 1) << 7;
  }
  k[0] ^= -hiBit & 225;
  return k;
}
const estimateWindow = (bytes) => {
  if (bytes > 64 * 1024) return 8;
  if (bytes > 1024) return 4;
  return 2;
};
var GHASH = class {
  blockLen = BLOCK_SIZE$1;
  outputLen = BLOCK_SIZE$1;
  s0 = 0;
  s1 = 0;
  s2 = 0;
  s3 = 0;
  finished = false;
  t;
  W;
  windowSize;
  constructor(key, expectedLength) {
    abytes(key, 16, "key");
    key = copyBytes(key);
    const kView = createView(key);
    let k0 = kView.getUint32(0, false);
    let k1 = kView.getUint32(4, false);
    let k2 = kView.getUint32(8, false);
    let k3 = kView.getUint32(12, false);
    const doubles = [];
    for (let i = 0; i < 128; i++) {
      doubles.push({
        s0: swapLE(k0),
        s1: swapLE(k1),
        s2: swapLE(k2),
        s3: swapLE(k3),
      });
      ({ s0: k0, s1: k1, s2: k2, s3: k3 } = mul2$1(k0, k1, k2, k3));
    }
    const W = estimateWindow(expectedLength || 1024);
    if (![1, 2, 4, 8].includes(W))
      throw new Error("ghash: invalid window size, expected 2, 4 or 8");
    this.W = W;
    const windows = 128 / W;
    const windowSize = (this.windowSize = 2 ** W);
    const items = [];
    for (let w = 0; w < windows; w++)
      for (let byte = 0; byte < windowSize; byte++) {
        let s0 = 0,
          s1 = 0,
          s2 = 0,
          s3 = 0;
        for (let j = 0; j < W; j++) {
          if (!((byte >>> (W - j - 1)) & 1)) continue;
          const { s0: d0, s1: d1, s2: d2, s3: d3 } = doubles[W * w + j];
          ((s0 ^= d0), (s1 ^= d1), (s2 ^= d2), (s3 ^= d3));
        }
        items.push({
          s0,
          s1,
          s2,
          s3,
        });
      }
    this.t = items;
  }
  _updateBlock(s0, s1, s2, s3) {
    ((s0 ^= this.s0), (s1 ^= this.s1), (s2 ^= this.s2), (s3 ^= this.s3));
    const { W, t, windowSize } = this;
    let o0 = 0,
      o1 = 0,
      o2 = 0,
      o3 = 0;
    const mask = (1 << W) - 1;
    let w = 0;
    for (const num of [s0, s1, s2, s3])
      for (let bytePos = 0; bytePos < 4; bytePos++) {
        const byte = (num >>> (8 * bytePos)) & 255;
        for (let bitPos = 8 / W - 1; bitPos >= 0; bitPos--) {
          const bit = (byte >>> (W * bitPos)) & mask;
          const { s0: e0, s1: e1, s2: e2, s3: e3 } = t[w * windowSize + bit];
          ((o0 ^= e0), (o1 ^= e1), (o2 ^= e2), (o3 ^= e3));
          w += 1;
        }
      }
    this.s0 = o0;
    this.s1 = o1;
    this.s2 = o2;
    this.s3 = o3;
  }
  update(data) {
    aexists(this);
    abytes(data);
    data = copyBytes(data);
    const b32 = u32(data);
    const blocks = Math.floor(data.length / BLOCK_SIZE$1);
    const left = data.length % BLOCK_SIZE$1;
    for (let i = 0; i < blocks; i++)
      this._updateBlock(b32[i * 4 + 0], b32[i * 4 + 1], b32[i * 4 + 2], b32[i * 4 + 3]);
    if (left) {
      ZEROS16.set(data.subarray(blocks * BLOCK_SIZE$1));
      this._updateBlock(ZEROS32[0], ZEROS32[1], ZEROS32[2], ZEROS32[3]);
      clean(ZEROS32);
    }
    return this;
  }
  destroy() {
    const { t } = this;
    for (const elm of t) ((elm.s0 = 0), (elm.s1 = 0), (elm.s2 = 0), (elm.s3 = 0));
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { s0, s1, s2, s3 } = this;
    const o32 = u32(out);
    o32[0] = s0;
    o32[1] = s1;
    o32[2] = s2;
    o32[3] = s3;
    return out;
  }
  digest() {
    const res = new Uint8Array(BLOCK_SIZE$1);
    this.digestInto(res);
    this.destroy();
    return res;
  }
};
var Polyval = class extends GHASH {
  constructor(key, expectedLength) {
    abytes(key);
    const ghKey = _toGHASHKey(copyBytes(key));
    super(ghKey, expectedLength);
    clean(ghKey);
  }
  update(data) {
    aexists(this);
    abytes(data);
    data = copyBytes(data);
    const b32 = u32(data);
    const left = data.length % BLOCK_SIZE$1;
    const blocks = Math.floor(data.length / BLOCK_SIZE$1);
    for (let i = 0; i < blocks; i++)
      this._updateBlock(
        swapLE(b32[i * 4 + 3]),
        swapLE(b32[i * 4 + 2]),
        swapLE(b32[i * 4 + 1]),
        swapLE(b32[i * 4 + 0]),
      );
    if (left) {
      ZEROS16.set(data.subarray(blocks * BLOCK_SIZE$1));
      this._updateBlock(
        swapLE(ZEROS32[3]),
        swapLE(ZEROS32[2]),
        swapLE(ZEROS32[1]),
        swapLE(ZEROS32[0]),
      );
      clean(ZEROS32);
    }
    return this;
  }
  digestInto(out) {
    aexists(this);
    aoutput(out, this);
    this.finished = true;
    const { s0, s1, s2, s3 } = this;
    const o32 = u32(out);
    o32[0] = s0;
    o32[1] = s1;
    o32[2] = s2;
    o32[3] = s3;
    return out.reverse();
  }
};
function wrapConstructorWithKey(hashCons) {
  const hashC = (msg, key) => hashCons(key, msg.length).update(msg).digest();
  const tmp = hashCons(/* @__PURE__ */ new Uint8Array(16), 0);
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = (key, expectedLength) => hashCons(key, expectedLength);
  return hashC;
}
/** GHash MAC for AES-GCM. */
const ghash = wrapConstructorWithKey((key, expectedLength) => new GHASH(key, expectedLength));
wrapConstructorWithKey((key, expectedLength) => new Polyval(key, expectedLength));
//#endregion
//#region node_modules/@noble/ciphers/aes.js
/**
 * [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
 * a.k.a. Advanced Encryption Standard
 * is a variant of Rijndael block cipher, standardized by NIST in 2001.
 * We provide the fastest available pure JS implementation.
 *
 * `cipher = encrypt(block, key)`
 *
 * Data is split into 128-bit blocks. Encrypted in 10/12/14 rounds (128/192/256 bits). In every round:
 * 1. **S-box**, table substitution
 * 2. **Shift rows**, cyclic shift left of all rows of data array
 * 3. **Mix columns**, multiplying every column by fixed polynomial
 * 4. **Add round key**, round_key xor i-th column of array
 *
 * Check out [FIPS-197](https://csrc.nist.gov/files/pubs/fips/197/final/docs/fips-197.pdf),
 * [NIST 800-38G](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-38G.pdf)
 * and [original proposal](https://csrc.nist.gov/csrc/media/projects/cryptographic-standards-and-guidelines/documents/aes-development/rijndael-ammended.pdf)
 * @module
 */
const BLOCK_SIZE = 16;
const BLOCK_SIZE32 = 4;
const EMPTY_BLOCK = /* @__PURE__ */ new Uint8Array(BLOCK_SIZE);
const POLY = 283;
function validateKeyLength(key) {
  if (![16, 24, 32].includes(key.length))
    throw new Error('"aes key" expected Uint8Array of length 16/24/32, got length=' + key.length);
}
function mul2(n) {
  return (n << 1) ^ (POLY & -(n >> 7));
}
function mul(a, b) {
  let res = 0;
  for (; b > 0; b >>= 1) {
    res ^= a & -(b & 1);
    a = mul2(a);
  }
  return res;
}
const sbox = /* @__PURE__ */ (() => {
  const t = /* @__PURE__ */ new Uint8Array(256);
  for (let i = 0, x = 1; i < 256; i++, x ^= mul2(x)) t[i] = x;
  const box = /* @__PURE__ */ new Uint8Array(256);
  box[0] = 99;
  for (let i = 0; i < 255; i++) {
    let x = t[255 - i];
    x |= x << 8;
    box[t[i]] = (x ^ (x >> 4) ^ (x >> 5) ^ (x >> 6) ^ (x >> 7) ^ 99) & 255;
  }
  clean(t);
  return box;
})();
const invSbox = /* @__PURE__ */ sbox.map((_, j) => sbox.indexOf(j));
const rotr32_8 = (n) => (n << 24) | (n >>> 8);
const rotl32_8 = (n) => (n << 8) | (n >>> 24);
function genTtable(sbox, fn) {
  if (sbox.length !== 256) throw new Error("Wrong sbox length");
  const T0 = /* @__PURE__ */ new Uint32Array(256).map((_, j) => fn(sbox[j]));
  const T1 = T0.map(rotl32_8);
  const T2 = T1.map(rotl32_8);
  const T3 = T2.map(rotl32_8);
  const T01 = new Uint32Array(256 * 256);
  const T23 = new Uint32Array(256 * 256);
  const sbox2 = new Uint16Array(256 * 256);
  for (let i = 0; i < 256; i++)
    for (let j = 0; j < 256; j++) {
      const idx = i * 256 + j;
      T01[idx] = T0[i] ^ T1[j];
      T23[idx] = T2[i] ^ T3[j];
      sbox2[idx] = (sbox[i] << 8) | sbox[j];
    }
  return {
    sbox,
    sbox2,
    T0,
    T1,
    T2,
    T3,
    T01,
    T23,
  };
}
const tableEncoding = /* @__PURE__ */ genTtable(
  sbox,
  (s) => (mul(s, 3) << 24) | (s << 16) | (s << 8) | mul(s, 2),
);
const tableDecoding = /* @__PURE__ */ genTtable(
  invSbox,
  (s) => (mul(s, 11) << 24) | (mul(s, 13) << 16) | (mul(s, 9) << 8) | mul(s, 14),
);
const xPowers = /* @__PURE__ */ (() => {
  const p = /* @__PURE__ */ new Uint8Array(16);
  for (let i = 0, x = 1; i < 16; i++, x = mul2(x)) p[i] = x;
  return p;
})();
/** Key expansion used in CTR. */
function expandKeyLE(key) {
  abytes(key);
  const len = key.length;
  validateKeyLength(key);
  const { sbox2 } = tableEncoding;
  const toClean = [];
  if (!isAligned32(key)) toClean.push((key = copyBytes(key)));
  const k32 = u32(key);
  const Nk = k32.length;
  const subByte = (n) => applySbox(sbox2, n, n, n, n);
  const xk = new Uint32Array(len + 28);
  xk.set(k32);
  for (let i = Nk; i < xk.length; i++) {
    let t = xk[i - 1];
    if (i % Nk === 0) t = subByte(rotr32_8(t)) ^ xPowers[i / Nk - 1];
    else if (Nk > 6 && i % Nk === 4) t = subByte(t);
    xk[i] = xk[i - Nk] ^ t;
  }
  clean(...toClean);
  return xk;
}
function expandKeyDecLE(key) {
  const encKey = expandKeyLE(key);
  const xk = encKey.slice();
  const Nk = encKey.length;
  const { sbox2 } = tableEncoding;
  const { T0, T1, T2, T3 } = tableDecoding;
  for (let i = 0; i < Nk; i += 4) for (let j = 0; j < 4; j++) xk[i + j] = encKey[Nk - i - 4 + j];
  clean(encKey);
  for (let i = 4; i < Nk - 4; i++) {
    const x = xk[i];
    const w = applySbox(sbox2, x, x, x, x);
    xk[i] = T0[w & 255] ^ T1[(w >>> 8) & 255] ^ T2[(w >>> 16) & 255] ^ T3[w >>> 24];
  }
  return xk;
}
function apply0123(T01, T23, s0, s1, s2, s3) {
  return (
    T01[((s0 << 8) & 65280) | ((s1 >>> 8) & 255)] ^ T23[((s2 >>> 8) & 65280) | ((s3 >>> 24) & 255)]
  );
}
function applySbox(sbox2, s0, s1, s2, s3) {
  return (
    sbox2[(s0 & 255) | (s1 & 65280)] | (sbox2[((s2 >>> 16) & 255) | ((s3 >>> 16) & 65280)] << 16)
  );
}
function encrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableEncoding;
  let k = 0;
  ((s0 ^= xk[k++]), (s1 ^= xk[k++]), (s2 ^= xk[k++]), (s3 ^= xk[k++]));
  const rounds = xk.length / 4 - 2;
  for (let i = 0; i < rounds; i++) {
    const t0 = xk[k++] ^ apply0123(T01, T23, s0, s1, s2, s3);
    const t1 = xk[k++] ^ apply0123(T01, T23, s1, s2, s3, s0);
    const t2 = xk[k++] ^ apply0123(T01, T23, s2, s3, s0, s1);
    const t3 = xk[k++] ^ apply0123(T01, T23, s3, s0, s1, s2);
    ((s0 = t0), (s1 = t1), (s2 = t2), (s3 = t3));
  }
  return {
    s0: xk[k++] ^ applySbox(sbox2, s0, s1, s2, s3),
    s1: xk[k++] ^ applySbox(sbox2, s1, s2, s3, s0),
    s2: xk[k++] ^ applySbox(sbox2, s2, s3, s0, s1),
    s3: xk[k++] ^ applySbox(sbox2, s3, s0, s1, s2),
  };
}
function decrypt(xk, s0, s1, s2, s3) {
  const { sbox2, T01, T23 } = tableDecoding;
  let k = 0;
  ((s0 ^= xk[k++]), (s1 ^= xk[k++]), (s2 ^= xk[k++]), (s3 ^= xk[k++]));
  const rounds = xk.length / 4 - 2;
  for (let i = 0; i < rounds; i++) {
    const t0 = xk[k++] ^ apply0123(T01, T23, s0, s3, s2, s1);
    const t1 = xk[k++] ^ apply0123(T01, T23, s1, s0, s3, s2);
    const t2 = xk[k++] ^ apply0123(T01, T23, s2, s1, s0, s3);
    const t3 = xk[k++] ^ apply0123(T01, T23, s3, s2, s1, s0);
    ((s0 = t0), (s1 = t1), (s2 = t2), (s3 = t3));
  }
  return {
    s0: xk[k++] ^ applySbox(sbox2, s0, s3, s2, s1),
    s1: xk[k++] ^ applySbox(sbox2, s1, s0, s3, s2),
    s2: xk[k++] ^ applySbox(sbox2, s2, s1, s0, s3),
    s3: xk[k++] ^ applySbox(sbox2, s3, s2, s1, s0),
  };
}
function ctr32(xk, isLE, nonce, src, dst) {
  abytes(nonce, BLOCK_SIZE, "nonce");
  abytes(src);
  dst = getOutput(src.length, dst);
  const ctr = nonce;
  const c32 = u32(ctr);
  const view = createView(ctr);
  const src32 = u32(src);
  const dst32 = u32(dst);
  const ctrPos = isLE ? 0 : 12;
  const srcLen = src.length;
  let ctrNum = view.getUint32(ctrPos, isLE);
  let { s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]);
  for (let i = 0; i + 4 <= src32.length; i += 4) {
    dst32[i + 0] = src32[i + 0] ^ s0;
    dst32[i + 1] = src32[i + 1] ^ s1;
    dst32[i + 2] = src32[i + 2] ^ s2;
    dst32[i + 3] = src32[i + 3] ^ s3;
    ctrNum = (ctrNum + 1) >>> 0;
    view.setUint32(ctrPos, ctrNum, isLE);
    ({ s0, s1, s2, s3 } = encrypt(xk, c32[0], c32[1], c32[2], c32[3]));
  }
  const start = BLOCK_SIZE * Math.floor(src32.length / BLOCK_SIZE32);
  if (start < srcLen) {
    const b32 = new Uint32Array([s0, s1, s2, s3]);
    const buf = u8(b32);
    for (let i = start, pos = 0; i < srcLen; i++, pos++) dst[i] = src[i] ^ buf[pos];
    clean(b32);
  }
  return dst;
}
function validateBlockDecrypt(data) {
  abytes(data);
  if (data.length % BLOCK_SIZE !== 0)
    throw new Error("aes-(cbc/ecb).decrypt ciphertext should consist of blocks with size 16");
}
function validateBlockEncrypt(plaintext, pcks5, dst) {
  abytes(plaintext);
  let outLen = plaintext.length;
  const remaining = outLen % BLOCK_SIZE;
  if (!pcks5 && remaining !== 0)
    throw new Error("aec/(cbc-ecb): unpadded plaintext with disabled padding");
  if (!isAligned32(plaintext)) plaintext = copyBytes(plaintext);
  const b = u32(plaintext);
  if (pcks5) {
    let left = BLOCK_SIZE - remaining;
    if (!left) left = BLOCK_SIZE;
    outLen = outLen + left;
  }
  dst = getOutput(outLen, dst);
  complexOverlapBytes(plaintext, dst);
  return {
    b,
    o: u32(dst),
    out: dst,
  };
}
function validatePCKS(data, pcks5) {
  if (!pcks5) return data;
  const len = data.length;
  if (!len) throw new Error("aes/pcks5: empty ciphertext not allowed");
  const lastByte = data[len - 1];
  if (lastByte <= 0 || lastByte > 16) throw new Error("aes/pcks5: wrong padding");
  const out = data.subarray(0, -lastByte);
  for (let i = 0; i < lastByte; i++)
    if (data[len - i - 1] !== lastByte) throw new Error("aes/pcks5: wrong padding");
  return out;
}
function padPCKS(left) {
  const tmp = /* @__PURE__ */ new Uint8Array(16);
  const tmp32 = u32(tmp);
  tmp.set(left);
  const paddingByte = BLOCK_SIZE - left.length;
  for (let i = BLOCK_SIZE - paddingByte; i < BLOCK_SIZE; i++) tmp[i] = paddingByte;
  return tmp32;
}
/**
 * **CBC** (Cipher Block Chaining): Each plaintext block is XORed with the
 * previous block of ciphertext before encryption.
 * Hard to use: requires proper padding and an IV. Unauthenticated: needs MAC.
 */
const cbc = /* @__PURE__ */ wrapCipher(
  {
    blockSize: 16,
    nonceLength: 16,
  },
  function aescbc(key, iv, opts = {}) {
    const pcks5 = !opts.disablePadding;
    return {
      encrypt(plaintext, dst) {
        const xk = expandKeyLE(key);
        const { b, o, out: _out } = validateBlockEncrypt(plaintext, pcks5, dst);
        let _iv = iv;
        const toClean = [xk];
        if (!isAligned32(_iv)) toClean.push((_iv = copyBytes(_iv)));
        const n32 = u32(_iv);
        let s0 = n32[0],
          s1 = n32[1],
          s2 = n32[2],
          s3 = n32[3];
        let i = 0;
        for (; i + 4 <= b.length;) {
          ((s0 ^= b[i + 0]), (s1 ^= b[i + 1]), (s2 ^= b[i + 2]), (s3 ^= b[i + 3]));
          ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
          ((o[i++] = s0), (o[i++] = s1), (o[i++] = s2), (o[i++] = s3));
        }
        if (pcks5) {
          const tmp32 = padPCKS(plaintext.subarray(i * 4));
          ((s0 ^= tmp32[0]), (s1 ^= tmp32[1]), (s2 ^= tmp32[2]), (s3 ^= tmp32[3]));
          ({ s0, s1, s2, s3 } = encrypt(xk, s0, s1, s2, s3));
          ((o[i++] = s0), (o[i++] = s1), (o[i++] = s2), (o[i++] = s3));
        }
        clean(...toClean);
        return _out;
      },
      decrypt(ciphertext, dst) {
        validateBlockDecrypt(ciphertext);
        const xk = expandKeyDecLE(key);
        let _iv = iv;
        const toClean = [xk];
        if (!isAligned32(_iv)) toClean.push((_iv = copyBytes(_iv)));
        const n32 = u32(_iv);
        dst = getOutput(ciphertext.length, dst);
        if (!isAligned32(ciphertext)) toClean.push((ciphertext = copyBytes(ciphertext)));
        complexOverlapBytes(ciphertext, dst);
        const b = u32(ciphertext);
        const o = u32(dst);
        let s0 = n32[0],
          s1 = n32[1],
          s2 = n32[2],
          s3 = n32[3];
        for (let i = 0; i + 4 <= b.length;) {
          const ps0 = s0,
            ps1 = s1,
            ps2 = s2,
            ps3 = s3;
          ((s0 = b[i + 0]), (s1 = b[i + 1]), (s2 = b[i + 2]), (s3 = b[i + 3]));
          const { s0: o0, s1: o1, s2: o2, s3: o3 } = decrypt(xk, s0, s1, s2, s3);
          ((o[i++] = o0 ^ ps0), (o[i++] = o1 ^ ps1), (o[i++] = o2 ^ ps2), (o[i++] = o3 ^ ps3));
        }
        clean(...toClean);
        return validatePCKS(dst, pcks5);
      },
    };
  },
);
function computeTag(fn, isLE, key, data, AAD) {
  const aadLength = AAD ? AAD.length : 0;
  const h = fn.create(key, data.length + aadLength);
  if (AAD) h.update(AAD);
  const num = u64Lengths(8 * data.length, 8 * aadLength, isLE);
  h.update(data);
  h.update(num);
  const res = h.digest();
  clean(num);
  return res;
}
/**
 * **GCM** (Galois/Counter Mode): Combines CTR mode with polynomial MAC. Efficient and widely used.
 * Not perfect:
 * a) conservative key wear-out is `2**32` (4B) msgs.
 * b) key wear-out under random nonces is even smaller: `2**23` (8M) messages for `2**-50` chance.
 * c) MAC can be forged: see Poly1305 documentation.
 */
const gcm = /* @__PURE__ */ wrapCipher(
  {
    blockSize: 16,
    nonceLength: 12,
    tagLength: 16,
    varSizeNonce: true,
  },
  function aesgcm(key, nonce, AAD) {
    if (nonce.length < 8) throw new Error("aes/gcm: invalid nonce length");
    const tagLength = 16;
    function _computeTag(authKey, tagMask, data) {
      const tag = computeTag(ghash, false, authKey, data, AAD);
      for (let i = 0; i < tagMask.length; i++) tag[i] ^= tagMask[i];
      return tag;
    }
    function deriveKeys() {
      const xk = expandKeyLE(key);
      const authKey = EMPTY_BLOCK.slice();
      const counter = EMPTY_BLOCK.slice();
      ctr32(xk, false, counter, counter, authKey);
      if (nonce.length === 12) counter.set(nonce);
      else {
        const nonceLen = EMPTY_BLOCK.slice();
        createView(nonceLen).setBigUint64(8, BigInt(nonce.length * 8), false);
        const g = ghash.create(authKey).update(nonce).update(nonceLen);
        g.digestInto(counter);
        g.destroy();
      }
      return {
        xk,
        authKey,
        counter,
        tagMask: ctr32(xk, false, counter, EMPTY_BLOCK),
      };
    }
    return {
      encrypt(plaintext) {
        const { xk, authKey, counter, tagMask } = deriveKeys();
        const out = new Uint8Array(plaintext.length + tagLength);
        const toClean = [xk, authKey, counter, tagMask];
        if (!isAligned32(plaintext)) toClean.push((plaintext = copyBytes(plaintext)));
        ctr32(xk, false, counter, plaintext, out.subarray(0, plaintext.length));
        const tag = _computeTag(authKey, tagMask, out.subarray(0, out.length - tagLength));
        toClean.push(tag);
        out.set(tag, plaintext.length);
        clean(...toClean);
        return out;
      },
      decrypt(ciphertext) {
        const { xk, authKey, counter, tagMask } = deriveKeys();
        const toClean = [xk, authKey, tagMask, counter];
        if (!isAligned32(ciphertext)) toClean.push((ciphertext = copyBytes(ciphertext)));
        const data = ciphertext.subarray(0, -16);
        const passedTag = ciphertext.subarray(-16);
        const tag = _computeTag(authKey, tagMask, data);
        toClean.push(tag);
        if (!equalBytes(tag, passedTag)) throw new Error("aes/gcm: invalid ghash tag");
        const out = ctr32(xk, false, counter, data);
        clean(...toClean);
        return out;
      },
    };
  },
);
function isBytes32(a) {
  return (
    a instanceof Uint32Array || (ArrayBuffer.isView(a) && a.constructor.name === "Uint32Array")
  );
}
function encryptBlock(xk, block) {
  abytes(block, 16, "block");
  if (!isBytes32(xk)) throw new Error("_encryptBlock accepts result of expandKeyLE");
  const b32 = u32(block);
  let { s0, s1, s2, s3 } = encrypt(xk, b32[0], b32[1], b32[2], b32[3]);
  ((b32[0] = s0), (b32[1] = s1), (b32[2] = s2), (b32[3] = s3));
  return block;
}
/**
 * Left-shift by one bit and conditionally XOR with 0x87:
 * ```
 * if MSB(L) is equal to 0
 * then    K1 := L << 1;
 * else    K1 := (L << 1) XOR const_Rb;
 * ```
 *
 * Specs: [RFC 4493, Section 2.3](https://www.rfc-editor.org/rfc/rfc4493.html#section-2.3),
 *        [RFC 5297 Section 2.3](https://datatracker.ietf.org/doc/html/rfc5297.html#section-2.3)
 *
 * @returns modified `block` (for chaining)
 */
function dbl(block) {
  let carry = 0;
  for (let i = BLOCK_SIZE - 1; i >= 0; i--) {
    const newCarry = (block[i] & 128) >>> 7;
    block[i] = (block[i] << 1) | carry;
    carry = newCarry;
  }
  if (carry) block[BLOCK_SIZE - 1] ^= 135;
  return block;
}
/**
 * `a XOR b`, running in-site on `a`.
 * @param a left operand and output
 * @param b right operand
 * @returns `a` (for chaining)
 */
function xorBlock(a, b) {
  if (a.length !== b.length) throw new Error("xorBlock: blocks must have same length");
  for (let i = 0; i < a.length; i++) a[i] = a[i] ^ b[i];
  return a;
}
/**
 * Internal CMAC class.
 */
var _CMAC = class {
  buffer;
  destroyed;
  k1;
  k2;
  xk;
  constructor(key) {
    abytes(key);
    validateKeyLength(key);
    this.xk = expandKeyLE(key);
    this.buffer = /* @__PURE__ */ new Uint8Array(0);
    this.destroyed = false;
    const L = new Uint8Array(BLOCK_SIZE);
    encryptBlock(this.xk, L);
    this.k1 = dbl(L);
    this.k2 = dbl(new Uint8Array(this.k1));
  }
  update(data) {
    const { destroyed, buffer } = this;
    if (destroyed) throw new Error("CMAC instance was destroyed");
    abytes(data);
    const newBuffer = new Uint8Array(buffer.length + data.length);
    newBuffer.set(buffer);
    newBuffer.set(data, buffer.length);
    this.buffer = newBuffer;
    return this;
  }
  digest() {
    if (this.destroyed) throw new Error("CMAC instance was destroyed");
    const { buffer } = this;
    const msgLen = buffer.length;
    let n = Math.ceil(msgLen / BLOCK_SIZE);
    let flag;
    if (n === 0) {
      n = 1;
      flag = false;
    } else flag = msgLen % BLOCK_SIZE === 0;
    const lastBlockStart = (n - 1) * BLOCK_SIZE;
    const lastBlockData = buffer.subarray(lastBlockStart);
    let m_last;
    if (flag) m_last = xorBlock(new Uint8Array(lastBlockData), this.k1);
    else {
      const padded = new Uint8Array(BLOCK_SIZE);
      padded.set(lastBlockData);
      padded[lastBlockData.length] = 128;
      m_last = xorBlock(padded, this.k2);
    }
    let x = new Uint8Array(BLOCK_SIZE);
    for (let i = 0; i < n - 1; i++) {
      xorBlock(x, buffer.subarray(i * BLOCK_SIZE, (i + 1) * BLOCK_SIZE));
      encryptBlock(this.xk, x);
    }
    xorBlock(x, m_last);
    encryptBlock(this.xk, x);
    clean(m_last);
    return x;
  }
  destroy() {
    const { buffer, destroyed, xk, k1, k2 } = this;
    if (destroyed) return;
    this.destroyed = true;
    clean(buffer, xk, k1, k2);
  }
};
/**
 * AES-CMAC (Cipher-based Message Authentication Code).
 * Specs: [RFC 4493](https://www.rfc-editor.org/rfc/rfc4493.html).
 */
const cmac = (key, message) => new _CMAC(key).update(message).digest();
cmac.create = (key) => new _CMAC(key);
//#endregion
//#region node_modules/@noble/hashes/hkdf.js
/**
 * HKDF (RFC 5869): extract + expand in one step.
 * See https://soatok.blog/2021/11/17/understanding-hkdf/.
 * @module
 */
/**
 * HKDF-extract from spec. Less important part. `HKDF-Extract(IKM, salt) -> PRK`
 * Arguments position differs from spec (IKM is first one, since it is not optional)
 * @param hash - hash function that would be used (e.g. sha256)
 * @param ikm - input keying material, the initial key
 * @param salt - optional salt value (a non-secret random value)
 */
function extract(hash, ikm, salt) {
  ahash(hash);
  if (salt === void 0) salt = new Uint8Array(hash.outputLen);
  return hmac(hash, salt, ikm);
}
const HKDF_COUNTER = /* @__PURE__ */ Uint8Array.of(0);
const EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
/**
 * HKDF-expand from the spec. The most important part. `HKDF-Expand(PRK, info, L) -> OKM`
 * @param hash - hash function that would be used (e.g. sha256)
 * @param prk - a pseudorandom key of at least HashLen octets (usually, the output from the extract step)
 * @param info - optional context and application specific information (can be a zero-length string)
 * @param length - length of output keying material in bytes
 */
function expand(hash, prk, info, length = 32) {
  ahash(hash);
  anumber$1(length, "length");
  const olen = hash.outputLen;
  if (length > 255 * olen) throw new Error("Length must be <= 255*HashLen");
  const blocks = Math.ceil(length / olen);
  if (info === void 0) info = EMPTY_BUFFER;
  else abytes$1(info, void 0, "info");
  const okm = new Uint8Array(blocks * olen);
  const HMAC = hmac.create(hash, prk);
  const HMACTmp = HMAC._cloneInto();
  const T = new Uint8Array(HMAC.outputLen);
  for (let counter = 0; counter < blocks; counter++) {
    HKDF_COUNTER[0] = counter + 1;
    HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T)
      .update(info)
      .update(HKDF_COUNTER)
      .digestInto(T);
    okm.set(T, olen * counter);
    HMAC._cloneInto(HMACTmp);
  }
  HMAC.destroy();
  HMACTmp.destroy();
  clean$1(T, HKDF_COUNTER);
  return okm.slice(0, length);
}
/**
 * HKDF (RFC 5869): derive keys from an initial input.
 * Combines hkdf_extract + hkdf_expand in one step
 * @param hash - hash function that would be used (e.g. sha256)
 * @param ikm - input keying material, the initial key
 * @param salt - optional salt value (a non-secret random value)
 * @param info - optional context and application specific information (can be a zero-length string)
 * @param length - length of output keying material in bytes
 * @example
 * import { hkdf } from '@noble/hashes/hkdf';
 * import { sha256 } from '@noble/hashes/sha2';
 * import { randomBytes } from '@noble/hashes/utils';
 * const inputKey = randomBytes(32);
 * const salt = randomBytes(32);
 * const info = 'application-key';
 * const hk1 = hkdf(sha256, inputKey, salt, info, 32);
 */
const hkdf = (hash, ikm, salt, info, length) =>
  expand(hash, extract(hash, ikm, salt), info, length);
//#endregion
export {
  randomBytes as $,
  mod as A,
  createHmacDrbg as B,
  negateCt as C,
  getMinHashLength as D,
  Field as E,
  bitLen as F,
  sha256 as G,
  numberToBytesLE as H,
  bitMask as I,
  ahash as J,
  sha512 as K,
  bytesToNumberBE as L,
  aInRange as M,
  abool$1 as N,
  isNegativeLE as O,
  asciiToBytes as P,
  isBytes$1 as Q,
  bytesToNumberLE as R,
  mulEndoUnsafe as S,
  wNAF as T,
  numberToHexUnpadded as U,
  memoized as V,
  validateObject as W,
  concatBytes as X,
  bytesToHex as Y,
  hexToBytes as Z,
  u64Lengths as _,
  gcm as a,
  createCurveFields as b,
  aexists as c,
  checkOpts as d,
  clean as f,
  u32 as g,
  getOutput as h,
  cbc as i,
  pow2 as j,
  mapHashToField as k,
  anumber as l,
  equalBytes as m,
  extract as n,
  abool as o,
  copyBytes as p,
  abytes$1 as q,
  hkdf as r,
  abytes as s,
  expand as t,
  aoutput as u,
  wrapCipher as v,
  normalizeZ as w,
  createKeygen as x,
  hmac as y,
  copyBytes$1 as z,
};
