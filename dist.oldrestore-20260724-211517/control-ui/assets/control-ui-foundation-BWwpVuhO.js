import { h as t, m as n } from "./control-ui-foundation-0uuDj0X3.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function r(e, n) {
  let r = typeof e == `bigint`;
  if (!r && !Number.isFinite(e)) throw TypeError(`Expected a finite number or bigint`);
  n = { ...n };
  let c = e < 0 ? `-` : ``;
  ((e = e < 0 ? -e : e),
    n.colonNotation &&
      ((n.compact = !1),
      (n.formatSubMilliseconds = !1),
      (n.separateMilliseconds = !1),
      (n.verbose = !1)),
    n.compact &&
      ((n.unitCount = 1), (n.secondsDecimalDigits = 0), (n.millisecondsDecimalDigits = 0)));
  let l = [],
    u = (e, t) => {
      let n = Math.floor(e * 10 ** t + o);
      return (Math.round(n) / 10 ** t).toFixed(t);
    },
    d = (e, t, r, o) => {
      if (!((l.length === 0 || !n.colonNotation) && i(e) && !(n.colonNotation && r === `m`))) {
        if (((o ??= String(e)), n.colonNotation)) {
          let e = o.includes(`.`) ? o.split(`.`)[0].length : o.length,
            t = l.length > 0 ? 2 : 1;
          o = `0`.repeat(Math.max(0, t - e)) + o;
        } else o += n.verbose ? ` ` + a(t, e) : r;
        l.push(o);
      }
    },
    f = t(e),
    p = BigInt(f.days);
  if (
    (n.hideYearAndDays
      ? d(BigInt(p) * 24n + BigInt(f.hours), `hour`, `h`)
      : (n.hideYear ? d(p, `day`, `d`) : (d(p / 365n, `year`, `y`), d(p % 365n, `day`, `d`)),
        d(Number(f.hours), `hour`, `h`)),
    d(Number(f.minutes), `minute`, `m`),
    !n.hideSeconds)
  )
    if (
      n.separateMilliseconds ||
      n.formatSubMilliseconds ||
      (!n.colonNotation && e < 1e3 && !n.subSecondsAsDecimals)
    ) {
      let e = Number(f.seconds),
        t = Number(f.milliseconds),
        r = Number(f.microseconds),
        i = Number(f.nanoseconds);
      if ((d(e, `second`, `s`), n.formatSubMilliseconds))
        (d(t, `millisecond`, `ms`), d(r, `microsecond`, `µs`), d(i, `nanosecond`, `ns`));
      else {
        let e = t + r / 1e3 + i / 1e6,
          a = typeof n.millisecondsDecimalDigits == `number` ? n.millisecondsDecimalDigits : 0,
          o = a ? e.toFixed(a) : e >= 1 ? Math.round(e) : Math.ceil(e);
        d(Number.parseFloat(o), `millisecond`, `ms`, o);
      }
    } else {
      let t = u(
          ((r ? Number(e % s) : e) / 1e3) % 60,
          typeof n.secondsDecimalDigits == `number` ? n.secondsDecimalDigits : 1,
        ),
        i = n.keepDecimalsOnWholeSeconds ? t : t.replace(/\.0+$/, ``);
      d(Number.parseFloat(i), `second`, `s`, i);
    }
  if (l.length === 0) return c + `0` + (n.verbose ? ` milliseconds` : `ms`);
  let m = n.colonNotation ? `:` : ` `;
  return (
    typeof n.unitCount == `number` && (l = l.slice(0, Math.max(n.unitCount, 1))), c + l.join(m)
  );
}
var i,
  a,
  o,
  s,
  c = e(() => {
    (n(),
      (i = (e) => e === 0 || e === 0n),
      (a = (e, t) => (t === 1 || t === 1n ? e : `${e}s`)),
      (o = 1e-7),
      (s = 24n * 60n * 60n * 1000n));
  });
export { r as n, c as t };
//# sourceMappingURL=control-ui-foundation-BWwpVuhO.js.map
