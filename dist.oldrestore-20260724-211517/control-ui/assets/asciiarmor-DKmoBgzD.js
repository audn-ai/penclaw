import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function t(e) {
  var t = e.match(/^\s*\S/);
  return (e.skipToEnd(), t ? `error` : null);
}
var n;
e(() => {
  n = {
    name: `asciiarmor`,
    token: function (e, n) {
      var r;
      if (n.state == `top`)
        return e.sol() && (r = e.match(/^-----BEGIN (.*)?-----\s*$/))
          ? ((n.state = `headers`), (n.type = r[1]), `tag`)
          : t(e);
      if (n.state == `headers`) {
        if (e.sol() && e.match(/^\w+:/)) return ((n.state = `header`), `atom`);
        var i = t(e);
        return (i && (n.state = `body`), i);
      } else if (n.state == `header`) return (e.skipToEnd(), (n.state = `headers`), `string`);
      else if (n.state == `body`)
        return e.sol() && (r = e.match(/^-----END (.*)?-----\s*$/))
          ? r[1] == n.type
            ? ((n.state = `end`), `tag`)
            : `error`
          : e.eatWhile(/[A-Za-z0-9+\/=]/)
            ? null
            : (e.next(), `error`);
      else if (n.state == `end`) return t(e);
    },
    blankLine: function (e) {
      e.state == `headers` && (e.state = `body`);
    },
    startState: function () {
      return { state: `top`, type: null };
    },
  };
})();
export { n as asciiArmor };
//# sourceMappingURL=asciiarmor-DKmoBgzD.js.map
