import { B as r, z as i } from "./control-ui-core--EZfp09c.js";
import { o as a, t as o } from "./control-ui-core-CwQmiouz.js";
import { D as t, M as n } from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
function s(e) {
  return d.has(e) ? i(`plugin-art/${e}.webp`) : null;
}
function c(e) {
  let t = 0;
  for (let n of e) t = (t * 31 + (n.codePointAt(0) ?? 0)) >>> 0;
  return n(f[t % f.length], `plugin fallback gradient palette entry`);
}
function l(e) {
  let t = e.trim().split(/\s+/u).filter(Boolean);
  if (t.length === 0) return ``;
  let r = n(t[0], `plugin monogram first word`),
    i = t[1];
  return (i ? `${r.charAt(0)}${i.charAt(0)}` : r.slice(0, 2)).toLocaleUpperCase();
}
function u(e) {
  switch (e) {
    case `channel`:
      return a(`pluginsPage.categoryChannels`);
    case `provider`:
      return a(`pluginsPage.categoryProviders`);
    case `memory`:
      return a(`pluginsPage.categoryMemory`);
    case `context-engine`:
      return a(`pluginsPage.categoryContextEngine`);
    case `tool`:
      return a(`pluginsPage.categoryTools`);
    default:
      return a(`pluginsPage.categoryOther`);
  }
}
var d,
  f,
  p,
  m,
  h,
  g = e(() => {
    (t(),
      r(),
      o(),
      (d = new Set(
        `acpx.active-memory.admin-http-rpc.airtable.alibaba.amazon-bedrock.amazon-bedrock-mantle.anthropic.anthropic-vertex.arcee.azure-speech.bonjour.brave.browser.byteplus.canva.canvas.cerebras.chutes.clawrouter.clickclack.cloudflare-ai-gateway.codex.cohere.comfy.context7.copilot.copilot-proxy.deepgram.deepinfra.deepseek.deepwiki.device-pair.diagnostics-otel.diagnostics-prometheus.diffs.diffs-language-pack.discord.document-extract.duckduckgo.dungeon-master.elevenlabs.email-inbox.exa.fal.featherless.feishu.file-transfer.firecrawl.fireworks.github.github-copilot.gmi.google.google-calendar.google-meet.googlechat.gradium.grafana.groq.home-assistant.hugging-face.huggingface.imessage.inworld.irc.jira.kilocode.kimi.kubernetes.line.linear.litellm.llama-cpp.llm-task.lmstudio.lobster.logbook.longcat.maps.matrix.mattermost.memory-core.memory-lancedb.memory-wiki.meta.microsoft.microsoft-foundry.migrate-claude.migrate-hermes.minimax.mistral.moonshot.morning-brief.msteams.nextcloud-talk.nostr.notes.notion.novita.nvidia.oc-path.ollama.open-prose.openai.opencode.opencode-go.openrouter.openshell.parallel.pdf-tools.perplexity.philips-hue.phone-control.pixverse.policy.portfolio-pulse.qa-channel.qa-lab.qa-matrix.qianfan.qqbot.qwen.raft.reddit.reef.runway.searxng.senseaudio.sentry.sglang.signal.slack.sms.sonos.spotify.stepfun.stripe.synology-chat.synthetic.talk-voice.tavily.telegram.tencent.thread-ownership.tlon.todoist.together.tokenjuice.transcription.translation.trip-scout.tts-local-cli.twitch.vault.venice.vercel-ai-gateway.vllm.voice-call.volcengine.voyage.vydra.web-readability.webhooks.whatsapp.workboard.xai.xiaomi.youtube.zai.zalo.zalouser`.split(
          `.`,
        ),
      )),
      (f = [
        [`#f59e0b`, `#ea580c`],
        [`#38bdf8`, `#1d4ed8`],
        [`#34d399`, `#047857`],
        [`#a855f7`, `#6b21a8`],
        [`#f472b6`, `#be185d`],
        [`#22d3ee`, `#0e7490`],
        [`#fbbf24`, `#b45309`],
        [`#818cf8`, `#4338ca`],
        [`#4ade80`, `#166534`],
        [`#fb7185`, `#9f1239`],
      ]),
      (p = [`channel`, `provider`, `memory`, `context-engine`, `tool`, `other`]),
      (m = [`work`, `dev`, `home`, `life`]),
      (h = [
        {
          id: `notion`,
          group: `work`,
          name: `Notion`,
          descriptionKey: `pluginsPage.connectorDescriptions.notion`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `notion`,
              config: {
                url: `https://mcp.notion.com/mcp`,
                transport: `streamable-http`,
                auth: `oauth`,
              },
              followUp: `oauth`,
              docsUrl: `https://developers.notion.com/docs/mcp`,
            },
          },
        },
        {
          id: `linear`,
          group: `work`,
          name: `Linear`,
          descriptionKey: `pluginsPage.connectorDescriptions.linear`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `linear`,
              config: {
                url: `https://mcp.linear.app/mcp`,
                transport: `streamable-http`,
                auth: `oauth`,
              },
              followUp: `oauth`,
              docsUrl: `https://linear.app/docs/mcp`,
            },
          },
        },
        {
          id: `todoist`,
          group: `work`,
          name: `Todoist`,
          descriptionKey: `pluginsPage.connectorDescriptions.todoist`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `todoist`,
              config: {
                url: `https://ai.todoist.net/mcp`,
                transport: `streamable-http`,
                auth: `oauth`,
              },
              followUp: `oauth`,
              docsUrl: `https://www.todoist.com/help/articles/use-claude-code-with-todoist-cli-and-mcp-b1USJ4HB3`,
            },
          },
        },
        {
          id: `airtable`,
          group: `work`,
          name: `Airtable`,
          descriptionKey: `pluginsPage.connectorDescriptions.airtable`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `airtable`,
              config: {
                url: `https://mcp.airtable.com/mcp`,
                transport: `streamable-http`,
                auth: `oauth`,
              },
              followUp: `oauth`,
              docsUrl: `https://support.airtable.com/docs/using-the-airtable-mcp-server`,
            },
          },
        },
        {
          id: `jira`,
          group: `work`,
          name: `Jira`,
          descriptionKey: `pluginsPage.connectorDescriptions.jira`,
          action: { kind: `clawhub`, query: `jira` },
        },
        {
          id: `canva`,
          group: `work`,
          name: `Canva`,
          descriptionKey: `pluginsPage.connectorDescriptions.canva`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `canva`,
              config: {
                url: `https://mcp.canva.com/mcp`,
                transport: `streamable-http`,
                auth: `oauth`,
              },
              followUp: `oauth`,
              docsUrl: `https://www.canva.dev/docs/mcp/`,
            },
          },
        },
        {
          id: `stripe`,
          group: `work`,
          name: `Stripe`,
          descriptionKey: `pluginsPage.connectorDescriptions.stripe`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `stripe`,
              config: {
                url: `https://mcp.stripe.com`,
                transport: `streamable-http`,
                auth: `oauth`,
              },
              followUp: `oauth`,
              docsUrl: `https://docs.stripe.com/mcp`,
            },
          },
        },
        {
          id: `google-calendar`,
          group: `work`,
          name: `Calendar`,
          descriptionKey: `pluginsPage.connectorDescriptions.googleCalendar`,
          action: { kind: `clawhub`, query: `google calendar` },
        },
        {
          id: `email-inbox`,
          group: `work`,
          name: `Email`,
          descriptionKey: `pluginsPage.connectorDescriptions.email`,
          action: { kind: `clawhub`, query: `email` },
        },
        {
          id: `pdf-tools`,
          group: `work`,
          name: `PDF`,
          descriptionKey: `pluginsPage.connectorDescriptions.pdf`,
          action: { kind: `clawhub`, query: `pdf` },
        },
        {
          id: `transcription`,
          group: `work`,
          name: `Transcription`,
          descriptionKey: `pluginsPage.connectorDescriptions.transcription`,
          action: { kind: `clawhub`, query: `transcription` },
        },
        {
          id: `github`,
          group: `dev`,
          name: `GitHub`,
          descriptionKey: `pluginsPage.connectorDescriptions.github`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `github`,
              config: { url: `https://api.githubcopilot.com/mcp/`, transport: `streamable-http` },
              followUp: `endpoint`,
              docsUrl: `https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/use-the-github-mcp-server`,
            },
          },
        },
        {
          id: `sentry`,
          group: `dev`,
          name: `Sentry`,
          descriptionKey: `pluginsPage.connectorDescriptions.sentry`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `sentry`,
              config: {
                url: `https://mcp.sentry.dev/mcp`,
                transport: `streamable-http`,
                auth: `oauth`,
              },
              followUp: `oauth`,
              docsUrl: `https://mcp.sentry.dev/`,
            },
          },
        },
        {
          id: `context7`,
          group: `dev`,
          name: `Context7`,
          descriptionKey: `pluginsPage.connectorDescriptions.context7`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `context7`,
              config: { url: `https://mcp.context7.com/mcp`, transport: `streamable-http` },
              followUp: `none`,
              docsUrl: `https://github.com/upstash/context7`,
            },
          },
        },
        {
          id: `deepwiki`,
          group: `dev`,
          name: `DeepWiki`,
          descriptionKey: `pluginsPage.connectorDescriptions.deepwiki`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `deepwiki`,
              config: { url: `https://mcp.deepwiki.com/mcp`, transport: `streamable-http` },
              followUp: `none`,
              docsUrl: `https://docs.devin.ai/work-with-devin/deepwiki-mcp`,
            },
          },
        },
        {
          id: `hugging-face`,
          group: `dev`,
          name: `Hugging Face`,
          descriptionKey: `pluginsPage.connectorDescriptions.huggingFace`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `hugging-face`,
              config: { url: `https://huggingface.co/mcp`, transport: `streamable-http` },
              followUp: `none`,
              docsUrl: `https://huggingface.co/docs/hub/hf-mcp-server`,
            },
          },
        },
        {
          id: `grafana`,
          group: `dev`,
          name: `Grafana`,
          descriptionKey: `pluginsPage.connectorDescriptions.grafana`,
          action: { kind: `clawhub`, query: `grafana` },
        },
        {
          id: `kubernetes`,
          group: `dev`,
          name: `Kubernetes`,
          descriptionKey: `pluginsPage.connectorDescriptions.kubernetes`,
          action: { kind: `clawhub`, query: `kubernetes` },
        },
        {
          id: `home-assistant`,
          group: `home`,
          name: `Home Assistant`,
          descriptionKey: `pluginsPage.connectorDescriptions.homeAssistant`,
          action: {
            kind: `mcp`,
            mcp: {
              serverName: `home-assistant`,
              config: {
                url: `http://homeassistant.local:8123/api/mcp`,
                transport: `streamable-http`,
              },
              followUp: `endpoint`,
              docsUrl: `https://www.home-assistant.io/integrations/mcp_server/`,
            },
          },
        },
        {
          id: `spotify`,
          group: `home`,
          name: `Spotify`,
          descriptionKey: `pluginsPage.connectorDescriptions.spotify`,
          action: { kind: `clawhub`, query: `spotify` },
        },
        {
          id: `sonos`,
          group: `home`,
          name: `Sonos`,
          descriptionKey: `pluginsPage.connectorDescriptions.sonos`,
          action: { kind: `clawhub`, query: `sonos` },
        },
        {
          id: `reddit`,
          group: `life`,
          name: `Reddit`,
          descriptionKey: `pluginsPage.connectorDescriptions.reddit`,
          action: { kind: `clawhub`, query: `reddit` },
        },
        {
          id: `portfolio-pulse`,
          group: `life`,
          name: `Markets`,
          descriptionKey: `pluginsPage.connectorDescriptions.markets`,
          action: { kind: `clawhub`, query: `stocks` },
        },
        {
          id: `trip-scout`,
          group: `life`,
          name: `Travel`,
          descriptionKey: `pluginsPage.connectorDescriptions.travel`,
          action: { kind: `clawhub`, query: `flights` },
        },
        {
          id: `morning-brief`,
          group: `life`,
          name: `News`,
          descriptionKey: `pluginsPage.connectorDescriptions.news`,
          action: { kind: `clawhub`, query: `news` },
        },
        {
          id: `maps`,
          group: `life`,
          name: `Maps`,
          descriptionKey: `pluginsPage.connectorDescriptions.maps`,
          action: { kind: `clawhub`, query: `maps` },
        },
        {
          id: `translation`,
          group: `life`,
          name: `Translation`,
          descriptionKey: `pluginsPage.connectorDescriptions.translation`,
          action: { kind: `clawhub`, query: `translation` },
        },
        {
          id: `notes`,
          group: `life`,
          name: `Notes`,
          descriptionKey: `pluginsPage.connectorDescriptions.notes`,
          action: { kind: `clawhub`, query: `notes` },
        },
      ]));
  });
export { s as a, l as c, g as i, h as n, u as o, p as r, c as s, m as t };
//# sourceMappingURL=presentation-Dx9lM6Rf.js.map
