import { html as m, t as h } from "./dist-D_xBiePP.js";
import { a as l, i as u, r as d } from "./dist-DcfhWyQe.js";
import {
  A as t,
  a as n,
  ft as r,
  j as i,
  k as a,
  n as o,
  pt as s,
  x as c,
} from "./dist-DRf-DUop.js";
import { i as f, n as p } from "./dist-DYfdSfYL.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function g(e) {
  return e.configure({ dialect: `selfClosing`, wrap: s(_) }, `vue`);
}
function _(e, t) {
  switch (e.name) {
    case `Attribute`:
      return /^(@|:|v-)/.test(t.read(e.from, e.from + 2)) ? E : null;
    case `Text`:
      return T;
  }
  return null;
}
function v(e = {}) {
  let t = D;
  if (e.base) {
    if (e.base.language.name != `html` || !(e.base.language instanceof o))
      throw RangeError(`The base option must be the result of calling html(...)`);
    t = e.base;
  }
  return new n(t.language == D.language ? O : g(t.language), [
    t.support,
    t.language.data.of({ closeBrackets: { brackets: [`{`, `"`] } }),
  ]);
}
var y, b, x, S, C, w, T, E, D, O;
e(() => {
  (c(),
    h(),
    p(),
    a(),
    r(),
    l(),
    (y = d.deserialize({
      version: 14,
      states:
        "%pOVOWOOObQPOOOpOSO'#C_OOOO'#Cp'#CpQVOWOOQxQPOOO!TQQOOQ!YQPOOOOOO,58y,58yO!_OSO,58yOOOO-E6n-E6nO!dQQO'#CqQ{QPOOO!iQPOOQ{QPOOO!qQPOOOOOO1G.e1G.eOOQO,59],59]OOQO-E6o-E6oO!yOpO'#CiO#RO`O'#CiQOQPOOO#ZO#tO'#CmO#fO!bO'#CmOOQO,59T,59TO#qOpO,59TO#vO`O,59TOOOO'#Cr'#CrO#{O#tO,59XOOQO,59X,59XOOOO'#Cs'#CsO$WO!bO,59XOOQO1G.o1G.oOOOO-E6p-E6pOOQO1G.s1G.sOOOO-E6q-E6q",
      stateData:
        "$g~OjOS~OQROUROkQO~OWTOXUOZUO`VO~OSXOTWO~OXUO[]OlZO~OY^O~O[_O~OT`O~OYaO~OmcOodO~OmfOogO~O^iOnhO~O_jOphO~ObkOqkOrmO~OcnOsnOtmO~OnpO~OppO~ObkOqkOrrO~OcnOsnOtrO~OWX`~",
      goto: `!^hPPPiPPPPPPPPPmPPPpPPsy!Q!WTROSRe]Re_QSORYSS[T^Rb[QlfRqlQogRso`,
      nodeNames: `⚠ Content Text Interpolation InterpolationContent }} Entity Attribute VueAttributeName : Identifier @ Is ScriptAttributeValue AttributeScript AttributeScript AttributeName AttributeValue Entity Entity`,
      maxTerm: 36,
      nodeProps: [[`isolate`, -3, 3, 13, 17, ``]],
      skippedNodes: [0],
      repeatNodeCount: 4,
      tokenData:
        "'y~RdXY!aYZ!a]^!apq!ars!rwx!w}!O!|!O!P#t!Q![#y![!]$s!_!`%g!b!c%l!c!}#y#R#S#y#T#j#y#j#k%q#k#o#y%W;'S#y;'S;:j$m<%lO#y~!fSj~XY!aYZ!a]^!apq!a~!wOm~~!|Oo~!b#RX`!b}!O!|!Q![!|![!]!|!c!}!|#R#S!|#T#o!|%W;'S!|;'S;:j#n<%lO!|!b#qP;=`<%l!|~#yOl~%W$QXY#t`!b}!O!|!Q![#y![!]!|!c!}#y#R#S#y#T#o#y%W;'S#y;'S;:j$m<%lO#y%W$pP;=`<%l#y~$zXX~`!b}!O!|!Q![!|![!]!|!c!}!|#R#S!|#T#o!|%W;'S!|;'S;:j#n<%lO!|~%lO[~~%qOZ~%W%xXY#t`!b}!O&e!Q![#y![!]!|!c!}#y#R#S#y#T#o#y%W;'S#y;'S;:j$m<%lO#y!b&jX`!b}!O!|!Q![!|![!]!|!c!}'V#R#S!|#T#o'V%W;'S!|;'S;:j#n<%lO!|!b'^XW!b`!b}!O!|!Q![!|![!]!|!c!}'V#R#S!|#T#o'V%W;'S!|;'S;:j#n<%lO!|",
      tokenizers: [
        6,
        7,
        new u(`b~RP#q#rU~XP#q#r[~aOT~~`, 17, 4),
        new u(
          "!k~RQvwX#o#p!_~^TU~Opmq!]m!^;'Sm;'S;=`!X<%lOm~pUOpmq!]m!]!^!S!^;'Sm;'S;=`!X<%lOm~!XOU~~![P;=`<%lm~!bP#o#p!e~!jOk~~",
          72,
          2,
        ),
        new u(`[~RPwxU~ZOp~~`, 11, 15),
        new u(`[~RPrsU~ZOn~~`, 11, 14),
        new u(
          "!e~RQvwXwx!_~^Tc~Opmq!]m!^;'Sm;'S;=`!X<%lOm~pUOpmq!]m!]!^!S!^;'Sm;'S;=`!X<%lOm~!XOc~~![P;=`<%lm~!dOt~~",
          66,
          35,
        ),
        new u(
          "!e~RQrsXvw^~^Or~~cTb~Oprq!]r!^;'Sr;'S;=`!^<%lOr~uUOprq!]r!]!^!X!^;'Sr;'S;=`!^<%lOr~!^Ob~~!aP;=`<%lr~",
          66,
          33,
        ),
      ],
      topRules: { Content: [0, 1], Attribute: [1, 7] },
      tokenPrec: 157,
    })),
    (b = f.parser.configure({ top: `SingleExpression` })),
    (x = y.configure({
      props: [
        t({
          Text: i.content,
          Is: i.definitionOperator,
          AttributeName: i.attributeName,
          VueAttributeName: i.keyword,
          Identifier: i.variableName,
          "AttributeValue ScriptAttributeValue": i.attributeValue,
          Entity: i.character,
          "{{ }}": i.brace,
          "@ :": i.punctuation,
        }),
      ],
    })),
    (S = { parser: b }),
    (C = x.configure({ wrap: s((e, t) => (e.name == `InterpolationContent` ? S : null)) })),
    (w = x.configure({
      wrap: s((e, t) => (e.name == `AttributeScript` ? S : null)),
      top: `Attribute`,
    })),
    (T = { parser: C }),
    (E = { parser: w }),
    (D = m()),
    (O = g(D.language)));
})();
export { v as vue };
//# sourceMappingURL=dist-BJQ5U2qN.js.map
