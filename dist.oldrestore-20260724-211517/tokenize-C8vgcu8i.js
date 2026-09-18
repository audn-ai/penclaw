import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import "./string-coerce-runtime-BUe4iD0r.js";
//#region extensions/memory-core/src/memory/tokenize.ts
/**
 * Shared CJK-aware tokenizer + Jaccard similarity helpers.
 *
 * Originally introduced for memory MMR re-ranking; now also used by the dreaming
 * dedupe path so similar-but-not-identical CJK candidates do not slip past the
 * Jaccard threshold (issue #80613).
 */
/**
 * Regex matching CJK-family characters that lack whitespace word boundaries:
 * - CJK Unified Ideographs (Chinese hanzi, Japanese kanji, Korean hanja)
 * - CJK Extension A
 * - Hiragana & Katakana (Japanese)
 * - Hangul Syllables & Jamo (Korean)
 */
const CJK_RE = /[\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\u1100-\u11ff]/;
/**
 * Tokenize text for Jaccard similarity computation.
 * Extracts alphanumeric tokens, CJK-family characters (unigrams),
 * and consecutive CJK character pairs (bigrams).
 *
 * Bigrams are only created from characters that are adjacent in the
 * original text, so mixed content like "我喜欢hello你好" will NOT
 * produce the spurious bigram "欢你".
 */
function tokenize(text) {
  const lower = normalizeLowercaseStringOrEmpty(text);
  const ascii = lower.match(/[a-z0-9_]+/g) ?? [];
  const chars = Array.from(lower);
  const cjkData = [];
  for (const [i, char] of chars.entries())
    if (CJK_RE.test(char))
      cjkData.push({
        char,
        index: i,
      });
  const bigrams = [];
  for (const [i, next] of cjkData.slice(1).entries()) {
    const previous = cjkData[i];
    if (previous !== void 0 && next.index === previous.index + 1)
      bigrams.push(previous.char + next.char);
  }
  const unigrams = cjkData.map((d) => d.char);
  return /* @__PURE__ */ new Set([...ascii, ...bigrams, ...unigrams]);
}
/**
 * Compute Jaccard similarity between two token sets.
 * Returns a value in [0, 1] where 1 means identical sets.
 */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersectionSize = 0;
  const smaller = setA.size <= setB.size ? setA : setB;
  const larger = setA.size <= setB.size ? setB : setA;
  for (const token of smaller) if (larger.has(token)) intersectionSize++;
  const unionSize = setA.size + setB.size - intersectionSize;
  return unionSize === 0 ? 0 : intersectionSize / unionSize;
}
/**
 * Compute text similarity between two content strings using Jaccard on tokens.
 *
 * When BOTH inputs tokenize to empty sets (e.g. Cyrillic/Arabic/emoji-only or
 * punctuation-only snippets that contain no ASCII or CJK tokens), the raw
 * `jaccardSimilarity` returns `1` for two empty sets. To prevent the dreaming
 * dedupe path (and other callers that compare distinct strings via Jaccard)
 * from collapsing distinct non-tokenized snippets into one, we fall back to
 * exact normalized-string equality for that empty/empty case. Non-empty cases
 * continue to use Jaccard unchanged.
 */
function textSimilarity(contentA, contentB) {
  const tokensA = tokenize(contentA);
  const tokensB = tokenize(contentB);
  if (tokensA.size === 0 && tokensB.size === 0)
    return normalizeLowercaseStringOrEmpty(contentA) === normalizeLowercaseStringOrEmpty(contentB)
      ? 1
      : 0;
  return jaccardSimilarity(tokensA, tokensB);
}
//#endregion
export { textSimilarity as n, tokenize as r, jaccardSimilarity as t };
