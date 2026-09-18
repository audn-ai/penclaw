import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function t(e) {
  return typeof e == `string` ? e.trim().toLowerCase() : ``;
}
function n(e) {
  return e.replace(l, `/bot***`);
}
function r(e) {
  let n = e.replace(c, ``);
  try {
    return t(decodeURIComponent(n).replace(c, ``)).replaceAll(`-`, `_`);
  } catch {
    return t(n).replaceAll(`-`, `_`);
  }
}
function i(e) {
  let t = r(e);
  return s.has(t);
}
function a(e) {
  try {
    let t = new URL(e),
      r = !1,
      a = n(t.pathname);
    (a !== t.pathname && ((t.pathname = a), (r = !0)),
      (t.username || t.password) &&
        ((t.username = t.username ? `***` : ``), (t.password = t.password ? `***` : ``), (r = !0)));
    for (let e of Array.from(t.searchParams.keys()))
      i(e) && (t.searchParams.set(e, `***`), (r = !0));
    return r ? t.toString() : e;
  } catch {
    return e;
  }
}
function o(e) {
  let t = a(e);
  return t === e
    ? n(
        e
          .replace(/\/\/([^@/?#\s]+)@/g, `//***:***@`)
          .replace(/([?&])([^=&]+)=([^&]*)/g, (e, t, n) => (i(n) ? `${t}${n}=***` : e)),
      )
    : t;
}
var s,
  c,
  l,
  u = e(() => {
    ((s = new Set([
      `token`,
      `key`,
      `api_key`,
      `apikey`,
      `secret`,
      `access_token`,
      `auth_token`,
      `password`,
      `pass`,
      `passwd`,
      `auth`,
      `jwt`,
      `session`,
      `id_token`,
      `code`,
      `client_secret`,
      `app_secret`,
      `hook_token`,
      `refresh_token`,
      `signature`,
      `x_amz_signature`,
      `x_amz_security_token`,
      `private_key`,
      `credential`,
      `authorization`,
    ])),
      (c = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu),
      (l = /\/bot\d{6,}(?::|%3[aA])[A-Za-z0-9_-]{20,}(?=\/|$)/giu));
  });
export { o as n, u as t };
//# sourceMappingURL=redact-sensitive-url-DaWVLiYm.js.map
