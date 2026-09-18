import { B as r, z as i } from "./control-ui-core--EZfp09c.js";
import { at as t, et as n } from "./lit-runtime-DkvDG939.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function a(e) {
  return e
    .split(/[-_]+/u)
    .filter(Boolean)
    .map((e) => `${e.charAt(0).toUpperCase()}${e.slice(1)}`)
    .join(` `);
}
function o(e) {
  return f[e] ?? a(e);
}
function s(e) {
  let t = e.trim().toLowerCase(),
    n = d[t] ?? t;
  return u.has(n) ? n : null;
}
function c(e) {
  return i(`provider-icons/ProviderIcon-${e}.svg`);
}
function l(e, n) {
  let r = n?.className ? ` ${n.className}` : ``,
    i = s(e);
  return i
    ? t`
    <span
      class="provider-brand-icon${r}"
      data-provider-icon=${i}
      style=${`--provider-icon-url: url("${c(i)}")`}
      aria-hidden="true"
    ></span>
  `
    : t`
      <span
        class="provider-brand-icon provider-brand-icon--fallback${r}"
        aria-hidden="true"
      >
        ${(e.trim().charAt(0) || `?`).toUpperCase()}
      </span>
    `;
}
var u,
  d,
  f,
  p = e(() => {
    (n(),
      r(),
      (u = new Set(
        `abacus.alibaba.amp.antigravity.augment.bedrock.chutes.claude.clawrouter.codebuff.codex.commandcode.copilot.crof.crossmodel.cursor.deepgram.deepseek.devin.doubao.elevenlabs.factory.gemini.grok.groq.jetbrains.kilo.kimi.kiro.litellm.llmproxy.manus.mimo.minimax.mistral.ollama.opencode.opencodego.openrouter.perplexity.poe.qoder.sakana.stepfun.synthetic.t3chat.venice.vertexai.warp.windsurf.zai.zed`.split(
          `.`,
        ),
      )),
      (d = {
        anthropic: `claude`,
        "amazon-bedrock": `bedrock`,
        "aws-bedrock": `bedrock`,
        google: `gemini`,
        "google-gemini-cli": `gemini`,
        "github-copilot": `copilot`,
        openai: `codex`,
        "opencode-go": `opencodego`,
        "opencode-zen": `opencode`,
        xai: `grok`,
        "vertex-ai": `vertexai`,
        "z-ai": `zai`,
      }),
      (f = {
        anthropic: `Anthropic`,
        google: `Google`,
        "github-copilot": `GitHub`,
        openai: `OpenAI`,
        opencode: `OpenCode`,
        openrouter: `OpenRouter`,
      }));
  });
export { l as i, p as n, o as r, a as t };
//# sourceMappingURL=provider-icon-CsUwkorr.js.map
