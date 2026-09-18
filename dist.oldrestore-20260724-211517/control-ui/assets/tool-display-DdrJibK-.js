import { Wa as u } from "./control-ui-core-BcbHa4vB.js";
import {
  $ as t,
  B as n,
  F as r,
  P as i,
  Q as a,
  at as o,
  rt as s,
  tt as c,
  z as l,
} from "./control-ui-foundation-s2wA1PVE.js";
import { n as e } from "./rolldown-runtime-DaJ6WEGw.js";
var d,
  f,
  p,
  ee = e(() => {
    ((d = {
      emoji: `🧩`,
      detailKeys: [
        `command`,
        `path`,
        `url`,
        `targetUrl`,
        `targetId`,
        `ref`,
        `element`,
        `node`,
        `nodeId`,
        `id`,
        `requestId`,
        `to`,
        `channelId`,
        `guildId`,
        `userId`,
        `name`,
        `query`,
        `pattern`,
        `messageId`,
      ],
    }),
      (f = {
        bash: { emoji: `🛠️`, title: `Bash`, detailKeys: [`command`] },
        computer: {
          emoji: `🖱️`,
          title: `Computer`,
          detailKeys: [`action`, `coordinate`, `text`, `node`, `nodeId`, `screenIndex`],
        },
        process: { emoji: `🧰`, title: `Process`, detailKeys: [`sessionId`] },
        read: { emoji: `📖`, title: `Read`, detailKeys: [`path`] },
        write: { emoji: `✍️`, title: `Write`, detailKeys: [`path`] },
        edit: { emoji: `📝`, title: `Edit`, detailKeys: [`path`] },
        attach: { emoji: `📎`, title: `Attach`, detailKeys: [`path`, `url`, `fileName`] },
        api: {
          emoji: `🌐`,
          title: `API`,
          detailKeys: [`url`, `endpoint`, `path`, `method`, `name`],
        },
        browser: {
          emoji: `🌐`,
          title: `Browser`,
          actions: {
            status: { label: `status` },
            start: { label: `start` },
            stop: { label: `stop` },
            tabs: { label: `tabs` },
            open: { label: `open`, detailKeys: [`targetUrl`] },
            focus: { label: `focus`, detailKeys: [`targetId`] },
            close: { label: `close`, detailKeys: [`targetId`] },
            snapshot: {
              label: `snapshot`,
              detailKeys: [`targetUrl`, `targetId`, `ref`, `element`, `format`],
            },
            screenshot: {
              label: `screenshot`,
              detailKeys: [`targetUrl`, `targetId`, `ref`, `element`],
            },
            navigate: { label: `navigate`, detailKeys: [`targetUrl`, `targetId`] },
            console: { label: `console`, detailKeys: [`level`, `targetId`] },
            pdf: { label: `pdf`, detailKeys: [`targetId`] },
            upload: {
              label: `upload`,
              detailKeys: [`paths`, `ref`, `inputRef`, `element`, `targetId`],
            },
            dialog: { label: `dialog`, detailKeys: [`accept`, `promptText`, `targetId`] },
            act: {
              label: `act`,
              detailKeys: [
                `request.kind`,
                `request.ref`,
                `request.selector`,
                `request.text`,
                `request.value`,
              ],
            },
          },
        },
        canvas: {
          emoji: `🖼️`,
          title: `Canvas`,
          actions: {
            present: { label: `present`, detailKeys: [`target`, `node`, `nodeId`] },
            hide: { label: `hide`, detailKeys: [`node`, `nodeId`] },
            navigate: { label: `navigate`, detailKeys: [`url`, `node`, `nodeId`] },
            eval: { label: `eval`, detailKeys: [`javaScript`, `node`, `nodeId`] },
            snapshot: { label: `snapshot`, detailKeys: [`format`, `node`, `nodeId`] },
            a2ui_push: { label: `A2UI push`, detailKeys: [`jsonlPath`, `node`, `nodeId`] },
            a2ui_reset: { label: `A2UI reset`, detailKeys: [`node`, `nodeId`] },
          },
        },
        nodes: {
          emoji: `📱`,
          title: `Nodes`,
          actions: {
            status: { label: `status` },
            describe: { label: `describe`, detailKeys: [`node`, `nodeId`] },
            pending: { label: `pending` },
            approve: { label: `approve`, detailKeys: [`requestId`] },
            reject: { label: `reject`, detailKeys: [`requestId`] },
            notify: { label: `notify`, detailKeys: [`node`, `nodeId`, `title`, `body`] },
            camera_snap: {
              label: `camera snap`,
              detailKeys: [`node`, `nodeId`, `facing`, `deviceId`],
            },
            camera_list: { label: `camera list`, detailKeys: [`node`, `nodeId`] },
            camera_clip: {
              label: `camera clip`,
              detailKeys: [`node`, `nodeId`, `facing`, `duration`, `durationMs`],
            },
            screen_record: {
              label: `screen record`,
              detailKeys: [`node`, `nodeId`, `duration`, `durationMs`, `fps`, `screenIndex`],
            },
            screen_snapshot: {
              label: `screen snapshot`,
              detailKeys: [`node`, `nodeId`, `screenIndex`, `maxWidth`],
            },
          },
        },
        cron: {
          emoji: `⏰`,
          title: `Cron`,
          actions: {
            status: { label: `status` },
            list: { label: `list` },
            add: { label: `add`, detailKeys: [`job.name`, `job.id`, `job.schedule`, `job.cron`] },
            update: { label: `update`, detailKeys: [`id`] },
            remove: { label: `remove`, detailKeys: [`id`] },
            run: { label: `run`, detailKeys: [`id`] },
            runs: { label: `runs`, detailKeys: [`id`] },
            wake: { label: `wake`, detailKeys: [`text`, `mode`] },
          },
        },
        get_goal: { emoji: `🎯`, title: `Get Goal`, detailKeys: [] },
        create_goal: {
          emoji: `🎯`,
          title: `Create Goal`,
          detailKeys: [`objective`, `token_budget`],
        },
        update_goal: { emoji: `🎯`, title: `Update Goal`, detailKeys: [`status`] },
        update_plan: {
          emoji: `🗺️`,
          title: `Update Plan`,
          detailKeys: [`explanation`, `plan.0.step`],
        },
        spawn_task: { emoji: `✨`, title: `Suggest Task`, detailKeys: [`title`, `tldr`, `cwd`] },
        dismiss_task: { emoji: `🗑️`, title: `Dismiss Task`, detailKeys: [`task_id`, `reason`] },
        skill_workshop: {
          emoji: `🧰`,
          title: `Skill Workshop`,
          detailKeys: [`action`, `name`, `proposal_id`],
        },
        crestodian: { emoji: `🦀`, title: `Crestodian`, detailKeys: [`action`, `path`, `model`] },
        gateway: {
          emoji: `🔌`,
          title: `Gateway`,
          actions: { restart: { label: `restart`, detailKeys: [`reason`, `delayMs`] } },
        },
        exec: { emoji: `🛠️`, title: `Exec`, detailKeys: [`command`] },
        tool_call: { emoji: `🧰`, title: `Tool Call`, detailKeys: [] },
        tool_call_update: { emoji: `🧰`, title: `Tool Call`, detailKeys: [] },
        session_status: {
          emoji: `📊`,
          title: `Session Status`,
          detailKeys: [`sessionKey`, `model`],
        },
        sessions_list: {
          emoji: `🗂️`,
          title: `Sessions`,
          detailKeys: [
            `kinds`,
            `label`,
            `agentId`,
            `search`,
            `limit`,
            `activeMinutes`,
            `includeDerivedTitles`,
            `includeLastMessage`,
            `messageLimit`,
          ],
        },
        sessions_send: {
          emoji: `📨`,
          title: `Session Send`,
          detailKeys: [`label`, `sessionKey`, `agentId`, `timeoutSeconds`],
        },
        sessions_history: {
          emoji: `🧾`,
          title: `Session History`,
          detailKeys: [`sessionKey`, `limit`, `includeTools`],
        },
        sessions_search: {
          emoji: `🔎`,
          title: `Session Search`,
          detailKeys: [`query`, `sessionKey`, `limit`],
        },
        transcripts: {
          emoji: `🎙️`,
          title: `Transcripts`,
          actions: {
            start: {
              label: `start`,
              detailKeys: [
                `sessionId`,
                `title`,
                `providerId`,
                `accountId`,
                `guildId`,
                `channelId`,
                `meetingUrl`,
              ],
            },
            stop: { label: `stop`, detailKeys: [`sessionId`] },
            status: { label: `status` },
            import: {
              label: `import`,
              detailKeys: [`sessionId`, `title`, `providerId`, `meetingUrl`, `speakerLabel`],
            },
            summarize: { label: `summarize`, detailKeys: [`sessionId`] },
          },
        },
        sessions_spawn: {
          emoji: `🧑‍🔧`,
          title: `Sub-agent`,
          detailKeys: [
            `label`,
            `task`,
            `agentId`,
            `model`,
            `thinking`,
            `runTimeoutSeconds`,
            `cleanup`,
          ],
        },
        subagents: {
          emoji: `🤖`,
          title: `Subagents`,
          actions: {
            list: { label: `list`, detailKeys: [`recentMinutes`] },
            kill: { label: `kill`, detailKeys: [`target`] },
            steer: { label: `steer`, detailKeys: [`target`] },
          },
        },
        agents_list: { emoji: `🧭`, title: `Agents`, detailKeys: [] },
        memory_search: { emoji: `🧠`, title: `Memory Search`, detailKeys: [`query`] },
        memory_get: { emoji: `📓`, title: `Memory Get`, detailKeys: [`path`, `from`, `lines`] },
        web_search: { emoji: `🔎`, title: `Web Search`, detailKeys: [`query`, `count`] },
        web_fetch: {
          emoji: `📄`,
          title: `Web Fetch`,
          detailKeys: [`url`, `extractMode`, `maxChars`],
        },
        code_execution: { emoji: `🧮`, title: `Code Execution`, detailKeys: [`task`] },
        message: {
          emoji: `✉️`,
          title: `Message`,
          actions: {
            send: { label: `send`, detailKeys: [`provider`, `to`, `media`, `replyTo`, `threadId`] },
            poll: { label: `poll`, detailKeys: [`provider`, `to`, `pollQuestion`] },
            react: {
              label: `react`,
              detailKeys: [`provider`, `to`, `messageId`, `emoji`, `remove`],
            },
            reactions: { label: `reactions`, detailKeys: [`provider`, `to`, `messageId`, `limit`] },
            read: { label: `read`, detailKeys: [`provider`, `to`, `limit`] },
            edit: { label: `edit`, detailKeys: [`provider`, `to`, `messageId`] },
            delete: { label: `delete`, detailKeys: [`provider`, `to`, `messageId`] },
            pin: { label: `pin`, detailKeys: [`provider`, `to`, `messageId`] },
            unpin: { label: `unpin`, detailKeys: [`provider`, `to`, `messageId`] },
            "list-pins": { label: `list pins`, detailKeys: [`provider`, `to`] },
            permissions: { label: `permissions`, detailKeys: [`provider`, `channelId`, `to`] },
            "thread-create": {
              label: `thread create`,
              detailKeys: [`provider`, `channelId`, `threadName`],
            },
            "thread-list": {
              label: `thread list`,
              detailKeys: [`provider`, `guildId`, `channelId`],
            },
            "thread-reply": {
              label: `thread reply`,
              detailKeys: [`provider`, `channelId`, `messageId`],
            },
            search: { label: `search`, detailKeys: [`provider`, `guildId`, `query`] },
            sticker: { label: `sticker`, detailKeys: [`provider`, `to`, `stickerId`] },
            "member-info": { label: `member`, detailKeys: [`provider`, `guildId`, `userId`] },
            "role-info": { label: `roles`, detailKeys: [`provider`, `guildId`] },
            "emoji-list": { label: `emoji list`, detailKeys: [`provider`, `guildId`] },
            "emoji-upload": {
              label: `emoji upload`,
              detailKeys: [`provider`, `guildId`, `emojiName`],
            },
            "sticker-upload": {
              label: `sticker upload`,
              detailKeys: [`provider`, `guildId`, `stickerName`],
            },
            "role-add": {
              label: `role add`,
              detailKeys: [`provider`, `guildId`, `userId`, `roleId`],
            },
            "role-remove": {
              label: `role remove`,
              detailKeys: [`provider`, `guildId`, `userId`, `roleId`],
            },
            "channel-info": { label: `channel`, detailKeys: [`provider`, `channelId`] },
            "channel-list": { label: `channels`, detailKeys: [`provider`, `guildId`] },
            "voice-status": { label: `voice`, detailKeys: [`provider`, `guildId`, `userId`] },
            "event-list": { label: `events`, detailKeys: [`provider`, `guildId`] },
            "event-create": {
              label: `event create`,
              detailKeys: [`provider`, `guildId`, `eventName`],
            },
            timeout: { label: `timeout`, detailKeys: [`provider`, `guildId`, `userId`] },
            kick: { label: `kick`, detailKeys: [`provider`, `guildId`, `userId`] },
            ban: { label: `ban`, detailKeys: [`provider`, `guildId`, `userId`] },
          },
        },
        apply_patch: { emoji: `🩹`, title: `Apply Patch`, detailKeys: [] },
        image: {
          emoji: `🖼️`,
          title: `Image`,
          detailKeys: [`path`, `paths`, `url`, `urls`, `prompt`, `model`],
        },
        image_generate: {
          emoji: `🎨`,
          title: `Image Generation`,
          actions: {
            generate: {
              label: `generate`,
              detailKeys: [`prompt`, `model`, `count`, `resolution`, `aspectRatio`],
            },
            list: { label: `list`, detailKeys: [`provider`, `model`] },
          },
        },
        music_generate: {
          emoji: `🎵`,
          title: `Music Generation`,
          actions: {
            generate: {
              label: `generate`,
              detailKeys: [`prompt`, `model`, `durationSeconds`, `format`, `instrumental`],
            },
            list: { label: `list`, detailKeys: [`provider`, `model`] },
          },
        },
        video_generate: {
          emoji: `🎬`,
          title: `Video Generation`,
          actions: {
            generate: {
              label: `generate`,
              detailKeys: [
                `prompt`,
                `model`,
                `durationSeconds`,
                `resolution`,
                `aspectRatio`,
                `audio`,
                `watermark`,
              ],
            },
            list: { label: `list`, detailKeys: [`provider`, `model`] },
          },
        },
        pdf: {
          emoji: `📑`,
          title: `PDF`,
          detailKeys: [`path`, `paths`, `url`, `urls`, `prompt`, `pageRange`, `model`],
        },
        sessions_yield: { emoji: `⏸️`, title: `Yield`, detailKeys: [`message`] },
        tts: { emoji: `🔊`, title: `TTS`, detailKeys: [`text`, `channel`] },
      }),
      (p = { version: 1, fallback: d, tools: f }));
  }),
  te = e(() => {
    l();
  });
function ne(e) {
  return e.length <= 10 ? `***` : `${r(e, 0, 6)}...${r(e, -4)}`;
}
function re(e) {
  let t = e.split(/\r?\n/).filter(Boolean);
  return t.length < 2 ? `***` : `${t[0]}\n...redacted...\n${t[t.length - 1]}`;
}
function m(e, t) {
  if (e.includes(`PRIVATE KEY-----`)) return re(e);
  let n = t.findLast((e) => typeof e == `string` && e.length > 0) ?? e,
    r = ne(n);
  if (n === e) return r;
  let i = e.lastIndexOf(n);
  return i < 0 ? `***` : `${e.slice(0, i)}${r}${e.slice(i + n.length)}`;
}
function h(e) {
  let t = e;
  for (let e of _) t = t.replace(e, (...e) => m(e[0] ?? ``, e.slice(1, -2)));
  return t;
}
var g,
  _,
  v,
  y = e(() => {
    (i(),
      (g = `card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|securityCode|payment[-_]?credential|paymentCredential|shared[-_]?payment[-_]?token|sharedPaymentToken`),
      (_ = [
        /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*(["']?)([^\s"'\\&<>]+)\1/gi,
        /\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN)\b\s*[=:]\s*\\+(["'])([^\s"'\\&<>]+)\\+\1/gi,
        RegExp(
          `[?&](?:access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|api[-_]?key|client[-_]?secret|token|key|secret|password|pass|passwd|auth|signature|${g})=([^&\\s"'<>]+)`,
          `gi`,
        ),
        /"(?:apiKey|token|secret|password|passwd|accessToken|refreshToken|cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token)"\s*:\s*"([^"]+)"/gi,
        /(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
        /(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2/gi,
        RegExp(
          `--(?:api[-_]?key|hook[-_]?token|token|secret|password|passwd|${g})\\s+(["']?)([^\\s"']+)\\1`,
          `gi`,
        ),
        /Authorization\s*[:=]\s*Bearer\s+([A-Za-z0-9._\-+=]+)/gi,
        /Authorization\s*[:=]\s*Basic\s+([A-Za-z0-9+/=]+)/gi,
        /(?:X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token)\s*[:=]\s*([^\s"',;]+)/gi,
        /\bBearer\s+([A-Za-z0-9._\-+=]{18,})\b/gi,
        RegExp(
          `(^|[\\s,;])(?:access_token|refresh_token|auth[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|token|secret|password|passwd|${g})=([^\\s&#]+)`,
          `gi`,
        ),
        /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----/g,
        /\b(sk-[A-Za-z0-9_-]{8,})\b/g,
        /\b(ghp_[A-Za-z0-9]{20,})\b/g,
        /\b(github_pat_[A-Za-z0-9_]{20,})\b/g,
        /\b(xox[baprs]-[A-Za-z0-9-]{10,})\b/g,
        /\b(xapp-[A-Za-z0-9-]{10,})\b/g,
        /\b(gsk_[A-Za-z0-9_-]{10,})\b/g,
        /\b(AIza[0-9A-Za-z\-_]{20,})\b/g,
        /\b(ya29\.[0-9A-Za-z_\-./+=]{10,})\b/g,
        /\b(1\/\/0[0-9A-Za-z_\-./+=]{10,})\b/g,
        /\b(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})\b/g,
        /\b(pplx-[A-Za-z0-9_-]{10,})\b/g,
        /(^|[^A-Za-z0-9_])(fw-[A-Za-z0-9]{30,})/g,
        /(^|[^A-Za-z0-9_])(fw_[A-Za-z0-9]{30,})/g,
        /(^|[^A-Za-z0-9_])(fpk_[A-Za-z0-9]{30,})/g,
        /\b(npm_[A-Za-z0-9]{10,})\b/g,
        /\b(AKID[A-Za-z0-9]{10,})\b/g,
        /\b(LTAI[A-Za-z0-9]{10,})\b/g,
        /\b(hf_[A-Za-z0-9]{10,})\b/g,
        /\b(r8_[A-Za-z0-9]{10,})\b/g,
        /\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
        /\b(\d{6,}:[A-Za-z0-9_-]{20,})\b/g,
      ]),
      (v = h));
  });
function ie(e) {
  let t = 0,
    n = 0;
  for (let r of e) {
    if (r === "`") {
      ((n += 1), (t = Math.max(t, n)));
      continue;
    }
    n = 0;
  }
  return t;
}
function ae(e) {
  let t = "`".repeat(ie(e) + 1),
    n =
      e.startsWith("`") ||
      e.endsWith("`") ||
      e.includes(`
`)
        ? ` `
        : ``;
  return `${t}${n}${e}${n}${t}`;
}
var oe = e(() => {});
function b(e) {
  if (!e) return e;
  let t = e.trim();
  return t.length >= 2 &&
    ((t.startsWith(`"`) && t.endsWith(`"`)) || (t.startsWith(`'`) && t.endsWith(`'`)))
    ? t.slice(1, -1).trim()
    : t;
}
function x(e, t = 48) {
  if (!e) return [];
  let n = [],
    r = ``,
    i,
    a = !1;
  for (let o of e) {
    if (a) {
      ((r += o), (a = !1));
      continue;
    }
    if (o === `\\`) {
      a = !0;
      continue;
    }
    if (i) {
      o === i ? (i = void 0) : (r += o);
      continue;
    }
    if (o === `"` || o === `'`) {
      i = o;
      continue;
    }
    if (/\s/.test(o)) {
      if (!r) continue;
      if ((n.push(r), n.length >= t)) return n;
      r = ``;
      continue;
    }
    r += o;
  }
  return (r && n.push(r), n);
}
function S(e) {
  if (!e) return;
  let n = b(e) ?? e;
  return t(n.split(/[/]/).at(-1) ?? n);
}
function C(e, t) {
  let n = new Set(t);
  for (let r = 0; r < e.length; r += 1) {
    let i = e[r];
    if (i) {
      if (n.has(i)) {
        let t = e[r + 1];
        if (t && !t.startsWith(`-`)) return t;
        continue;
      }
      for (let e of t)
        if (e.startsWith(`--`) && i.startsWith(`${e}=`)) return i.slice(e.length + 1);
    }
  }
}
function w(e, t = 1, n = []) {
  let r = [],
    i = new Set(n);
  for (let n = t; n < e.length; n += 1) {
    let t = e[n];
    if (t) {
      if (t === `--`) {
        for (let t = n + 1; t < e.length; t += 1) {
          let n = e[t];
          n && r.push(n);
        }
        break;
      }
      if (t.startsWith(`--`)) {
        if (t.includes(`=`)) continue;
        i.has(t) && (n += 1);
        continue;
      }
      if (t.startsWith(`-`)) {
        i.has(t) && (n += 1);
        continue;
      }
      r.push(t);
    }
  }
  return r;
}
function T(e, t = 1, n = []) {
  return w(e, t, n)[0];
}
function E(e) {
  if (e.length === 0) return e;
  let t = 0;
  if (S(e[0]) === `env`) {
    for (t = 1; t < e.length;) {
      let n = e[t];
      if (!n) break;
      if (n.startsWith(`-`)) {
        t += 1;
        continue;
      }
      if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(n)) {
        t += 1;
        continue;
      }
      break;
    }
    return e.slice(t);
  }
  for (; t < e.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(e.at(t) ?? ``);) t += 1;
  return e.slice(t);
}
function se(e) {
  let t = x(e, 10);
  if (t.length < 3) return e;
  let n = S(t[0]);
  if (!(n === `bash` || n === `sh` || n === `zsh` || n === `fish`)) return e;
  let r = t.findIndex((e, t) => t > 0 && (e === `-c` || e === `-lc` || e === `-ic`));
  if (r === -1) return e;
  let i = t
    .slice(r + 1)
    .join(` `)
    .trim();
  return i ? (b(i) ?? e) : e;
}
function ce(e, t) {
  if (e[t] !== `<` || e[t - 1] === `<` || e[t + 1] !== `<` || e[t + 2] === `<`) return;
  let n = e[t + 2] === `-`,
    r = t + (n ? 3 : 2);
  for (; /[ \t]/u.test(e[r] ?? ``);) r += 1;
  let i = ``,
    a;
  for (; r < e.length; r += 1) {
    let t = e[r] ?? ``;
    if (a) {
      if (t === a) {
        a = void 0;
        continue;
      }
      if (a === `"` && t === `\\` && r + 1 < e.length) {
        ((r += 1), (i += e[r] ?? ``));
        continue;
      }
      i += t;
      continue;
    }
    if (/[\r\n;&|<>]/u.test(t) || /[ \t]/u.test(t)) break;
    if (t === `'` || t === `"`) {
      a = t;
      continue;
    }
    if (t === `\\` && r + 1 < e.length) {
      ((r += 1), (i += e[r] ?? ``));
      continue;
    }
    i += t;
  }
  return i ? { value: i, stripLeadingTabs: n, operatorIndex: t } : void 0;
}
function le(e, t, n) {
  let r = n;
  for (; r <= e.length;) {
    let n = e.indexOf(
        `
`,
        r,
      ),
      i = n === -1 ? e.length : n,
      a = e.slice(r, i).replace(/\r$/u, ``);
    if ((t.stripLeadingTabs ? a.replace(/^\t+/u, ``) : a) === t.value) return i;
    if (n === -1) return;
    r = n + 1;
  }
}
function D(e, t, n) {
  let r,
    i = !1,
    a = !0,
    o = 0,
    s = 0,
    c = [];
  for (let l = 0; l < e.length; l += 1) {
    let u = e.charAt(l);
    if (i) {
      ((i = !1),
        u !==
          `
` && (a = !1));
      continue;
    }
    if (u === `\\`) {
      i = !0;
      continue;
    }
    if (r) {
      u === r && (r = void 0);
      continue;
    }
    if (u === `"` || u === `'`) {
      ((r = u), (a = !1));
      continue;
    }
    if (u === `#` && a && o === 0) {
      let t = e.indexOf(
        `
`,
        l + 1,
      );
      if (t === -1) return;
      l = t - 1;
      continue;
    }
    let d = o === 0 && u === `(` && e[l + 1] === `(` && (e[l - 1] === `$` || a),
      f = o > 0 || d;
    if (!f) {
      let t = ce(e, l);
      t && c.push(t);
    }
    if (
      u ===
        `
` &&
      c.length > 0
    ) {
      let t = l + 1,
        r,
        i = [];
      for (let n of c) {
        if (((r = le(e, n, t)), r === void 0)) break;
        (i.push({ marker: n, start: t, end: r }), (t = r + 1));
      }
      if (((c = []), r !== void 0)) {
        for (let e of i) n?.(e.marker.operatorIndex, e.start, e.end);
        l = r - 1;
        continue;
      }
    }
    if (!f && t(u, l) === !1) return;
    if (u === `(` && (o > 0 || d)) {
      o += 1;
      continue;
    }
    if (u === `)` && o > 0) {
      --o;
      continue;
    }
    if (!f)
      if (/\s/u.test(u)) a = !0;
      else if (u === `(`) {
        let t = e[l - 1];
        t === `$` || t === `<` || t === `>` ? (a = !0) : (a &&= ((s += 1), !0));
      } else u === `)` ? (s > 0 ? (--s, (a = !0)) : (a = !1)) : (a = !!/[;&|<>]/u.test(u));
  }
}
function O(e, t) {
  let n = [],
    r = 0,
    i = 0,
    a = [];
  return (
    D(
      e,
      (o, s) => {
        let c = t(o, s);
        return c === 0
          ? !0
          : (n.push(a.join(``) + e.slice(i, s)), (r = s + c), (i = r), (a = []), !0);
      },
      (t, n, o) => {
        t < r && (a.push(e.slice(i, n)), (i = o));
      },
    ),
    n.push(a.join(``) + e.slice(i)),
    n.map((e) => e.trim()).filter((e) => e.length > 0)
  );
}
function ue(e) {
  return O(e, (t, n) => (t === `;` ? 1 : (t === `&` || t === `|`) && e[n + 1] === t ? 2 : 0));
}
function de(e) {
  return O(e, (t, n) => +(t === `|` && e[n - 1] !== `|` && e[n + 1] !== `|`));
}
function fe(e) {
  let t = x(e, 3),
    n = S(t[0]);
  if (n === `cd` || n === `pushd`) return t[1] || void 0;
}
function pe(e) {
  let t = S(x(e, 2)[0]);
  return t === `cd` || t === `pushd` || t === `popd`;
}
function me(e) {
  return S(x(e, 2)[0]) === `popd`;
}
function he(e) {
  let t = e.trim(),
    n;
  for (let e = 0; e < 4; e += 1) {
    let r;
    D(t, (e, n) => {
      if (e === `&` && t[n + 1] === `&`) return ((r = { index: n, length: 2 }), !1);
      if (e === `|` && t[n + 1] === `|`) return ((r = { index: n, length: 2, isOr: !0 }), !1);
      if (
        e === `;` ||
        e ===
          `
`
      )
        return ((r = { index: n, length: 1 }), !1);
    });
    let i = (r ? t.slice(0, r.index) : t).trim(),
      a = (r ? !r.isOr : e > 0) && pe(i);
    if (
      !(i.startsWith(`set `) || i.startsWith(`export `) || i.startsWith(`unset `) || a) ||
      (a && (n = me(i) ? void 0 : (fe(i) ?? n)),
      (t = r ? t.slice(r.index + r.length).trimStart() : ``),
      !t)
    )
      break;
  }
  return { command: t.trim(), chdirPath: n };
}
var ge = e(() => {
  a();
});
function k(e) {
  if (e.length === 0) return `run command`;
  let t = S(e[0]) ?? `command`;
  if (t === `git`) {
    let t = new Set([`-C`, `-c`, `--git-dir`, `--work-tree`, `--namespace`, `--config-env`]),
      n = C(e, [`-C`]),
      r;
    for (let n = 1; n < e.length; n += 1) {
      let i = e[n];
      if (i) {
        if (i === `--`) {
          r = T(e, n + 1);
          break;
        }
        if (i.startsWith(`--`)) {
          if (i.includes(`=`)) continue;
          t.has(i) && (n += 1);
          continue;
        }
        if (i.startsWith(`-`)) {
          t.has(i) && (n += 1);
          continue;
        }
        r = i;
        break;
      }
    }
    return (
      (r
        ? {
            status: `check git status`,
            diff: `check git diff`,
            log: `view git history`,
            show: `show git object`,
            branch: `list git branches`,
            checkout: `switch git branch`,
            switch: `switch git branch`,
            commit: `create git commit`,
            pull: `pull git changes`,
            push: `push git changes`,
            fetch: `fetch git changes`,
            merge: `merge git changes`,
            rebase: `rebase git branch`,
            add: `stage git changes`,
            restore: `restore git files`,
            reset: `reset git state`,
            stash: `stash git changes`,
          }[r]
        : void 0) ||
      (!r || r.startsWith(`/`) || r.startsWith(`~`) || r.includes(`/`)
        ? n
          ? `run git command in ${n}`
          : `run git command`
        : `run git ${r}`)
    );
  }
  if (t === `grep` || t === `rg` || t === `ripgrep`) {
    let t = w(e, 1, [
        `-e`,
        `--regexp`,
        `-f`,
        `--file`,
        `-m`,
        `--max-count`,
        `-A`,
        `--after-context`,
        `-B`,
        `--before-context`,
        `-C`,
        `--context`,
      ]),
      n = C(e, [`-e`, `--regexp`]) ?? t[0],
      r = t.length > 1 ? t.at(-1) : void 0;
    return n ? (r ? `search "${n}" in ${r}` : `search "${n}"`) : `search text`;
  }
  if (t === `find`) {
    let t = e[1] && !e[1].startsWith(`-`) ? e[1] : `.`,
      n = C(e, [`-name`, `-iname`]);
    return n ? `find files named "${n}" in ${t}` : `find files in ${t}`;
  }
  if (t === `ls`) {
    let t = T(e, 1);
    return t ? `list files in ${t}` : `list files`;
  }
  if (t === `head` || t === `tail`) {
    let n =
        C(e, [`-n`, `--lines`]) ??
        e
          .slice(1)
          .find((e) => /^-\d+$/.test(e))
          ?.slice(1),
      r = w(e, 1, [`-n`, `--lines`]),
      i = r.at(-1);
    i && /^\d+$/.test(i) && r.length === 1 && (i = void 0);
    let a = t === `head` ? `first` : `last`,
      o = n === `1` ? `line` : `lines`;
    return n && i
      ? `show ${a} ${n} ${o} of ${i}`
      : n
        ? `show ${a} ${n} ${o}`
        : i
          ? `show ${i}`
          : `show ${t} output`;
  }
  if (t === `cat`) {
    let t = T(e, 1);
    return t ? `show ${t}` : `show output`;
  }
  if (t === `sed`) {
    let t = C(e, [`-e`, `--expression`]),
      n = w(e, 1, [`-e`, `--expression`, `-f`, `--file`]),
      r = t ?? n[0],
      i = t ? n[0] : n[1];
    if (r) {
      let e = (b(r) ?? r).replace(/\s+/g, ``),
        t = e.match(/^([0-9]+),([0-9]+)p$/);
      if (t) return i ? `print lines ${t[1]}-${t[2]} from ${i}` : `print lines ${t[1]}-${t[2]}`;
      let n = e.match(/^([0-9]+)p$/);
      if (n) return i ? `print line ${n[1]} from ${i}` : `print line ${n[1]}`;
    }
    return i ? `run sed on ${i}` : `run sed transform`;
  }
  if (t === `printf` || t === `echo`) return `print text`;
  if (t === `cp` || t === `mv`) {
    let n = w(e, 1, [`-t`, `--target-directory`, `-S`, `--suffix`]),
      r = n[0],
      i = n[1],
      a = t === `cp` ? `copy` : `move`;
    return r && i ? `${a} ${r} to ${i}` : r ? `${a} ${r}` : `${a} files`;
  }
  if (t === `rm`) {
    let t = T(e, 1);
    return t ? `remove ${t}` : `remove files`;
  }
  if (t === `mkdir`) {
    let t = T(e, 1);
    return t ? `create folder ${t}` : `create folder`;
  }
  if (t === `touch`) {
    let t = T(e, 1);
    return t ? `create file ${t}` : `create file`;
  }
  if (t === `curl` || t === `wget`) {
    let t = e.find((e) => /^https?:\/\//i.test(e));
    return t ? `fetch ${t}` : `fetch url`;
  }
  if (t === `npm` || t === `pnpm` || t === `yarn` || t === `bun`) {
    let n = w(e, 1, [`--prefix`, `-C`, `--cwd`, `--config`]),
      r = n[0] ?? `command`;
    return (
      {
        install: `install dependencies`,
        test: `run tests`,
        build: `run build`,
        start: `start app`,
        lint: `run lint`,
        run: n[1] ? `run ${n[1]}` : `run script`,
      }[r] ?? `run ${t} ${r}`
    );
  }
  if (t === `node` || t === `python` || t === `python3` || t === `ruby` || t === `php`) {
    if (e.slice(1).find((e) => e.startsWith(`<<`))) return `run ${t} inline script (heredoc)`;
    if (
      (t === `node`
        ? C(e, [`-e`, `--eval`])
        : t === `python` || t === `python3`
          ? C(e, [`-c`])
          : void 0) !== void 0
    )
      return `run ${t} inline script`;
    let n = T(e, 1, t === `node` ? [`-e`, `--eval`, `-m`] : [`-c`, `-e`, `--eval`, `-m`]);
    return n
      ? t === `node`
        ? `${e.includes(`--check`) || e.includes(`-c`) ? `check js syntax for` : `run node script`} ${n}`
        : `run ${t} ${n}`
      : `run ${t}`;
  }
  if (t === `openclaw`) {
    let t = T(e, 1);
    return t ? `run openclaw ${t}` : `run openclaw`;
  }
  let n = T(e, 1);
  return !n || n.length > 48
    ? `run ${t}`
    : /^[A-Za-z0-9._/-]+$/.test(n)
      ? `run ${t} ${n}`
      : `run ${t}`;
}
function A(e) {
  let t = de(e);
  return t.length > 1
    ? `${k(E(x(t[0])))} -> ${k(E(x(t[t.length - 1])))}${t.length > 2 ? ` (+${t.length - 2} steps)` : ``}`
    : k(E(x(e)));
}
function j(e) {
  let t = [];
  return (
    D(e, (n, r) => {
      if (n !== `<` || e[r - 1] === `<` || e[r + 1] !== `<` || e[r + 2] === `<`) return !0;
      let i = e[r + 2] === `-`,
        a = M(e, r + (i ? 3 : 2));
      return (a && t.push({ value: a, stripLeadingTabs: i }), !0);
    }),
    t
  );
}
function M(e, t) {
  let n = t;
  for (; /\s/u.test(e[n] ?? ``);) n += 1;
  let r = ``,
    i;
  for (let t = n; t < e.length; t += 1) {
    let n = e[t] ?? ``;
    if (i) {
      if (n === i) {
        i = void 0;
        continue;
      }
      if (i === `"` && n === `\\` && t + 1 < e.length) {
        ((t += 1), (r += e[t] ?? ``));
        continue;
      }
      r += n;
      continue;
    }
    if (/[\s;&|<>]/u.test(n)) break;
    if (n === `'` || n === `"`) {
      i = n;
      continue;
    }
    if (n === `\\` && t + 1 < e.length) {
      ((t += 1), (r += e[t] ?? ``));
      continue;
    }
    r += n;
  }
  return r || void 0;
}
function N(e) {
  if (
    !e.includes(`
`)
  )
    return;
  let t = e.split(/\r?\n/u),
    n = [],
    r = !1;
  for (let e = 0; e < t.length; e += 1) {
    let i = t[e] ?? ``;
    n.push(i);
    let a = j(i);
    if (a.length !== 0) {
      r = !0;
      for (let n of a)
        for (
          e += 1;
          e < t.length &&
          (n.stripLeadingTabs ? (t[e] ?? ``).replace(/^\t+/u, ``) : (t[e] ?? ``)) !== n.value;
        )
          e += 1;
    }
  }
  if (r)
    return n
      .map((e) => e.trim())
      .filter(Boolean)
      .join(`; `);
}
function P(e) {
  return e.replace(/\\/g, `/`).replace(/\/+$/g, ``);
}
function F(e) {
  let t = P(e).split(`/`).filter(Boolean);
  if (t.length !== 0) {
    for (let e = 0; e < t.length; e += 1) {
      let n = t[e];
      if (n) {
        if (n === `.openclaw` && t[e + 1] === `workspace`) return `agent`;
        if (n === `.openclaw` && t[e + 1] === `sandboxes`) return `sandbox`;
        if (
          (/[-_]workspace$/i.test(n) && n.toLowerCase() !== `workspace`) ||
          /^workspace[-_]/i.test(n)
        )
          return `agent`;
      }
    }
    if (t.includes(`Projects`) || t.includes(`projects`)) return `repo`;
    if (t.at(-1)?.toLowerCase() === `workspace`) return `workspace`;
  }
}
function I(e) {
  let t = F(e);
  if (t !== `sandbox`) return t ? `(${t})` : `(in ${e})`;
}
function L(e) {
  let { command: t, chdirPath: n } = he(e);
  if (!t) return n ? { text: ``, chdirPath: n } : void 0;
  let r = ue(N(t) ?? t);
  if (r.length === 0) return;
  let i = r.map((e) => A(e)),
    a = i.length === 1 ? i.at(0) : i.join(` → `);
  if (a) return { text: a, chdirPath: n, allGeneric: i.every((e) => R(e)) };
}
function R(e) {
  return e === `run command` ? !0 : e.startsWith(`run `) ? !z.some((t) => e.startsWith(t)) : !1;
}
function _e(e, t = 120) {
  let n = v(
    e
      .replace(/\s*\n\s*/g, ` `)
      .replace(/\s{2,}/g, ` `)
      .trim(),
  );
  if (n.length <= t) return n;
  let i = Math.floor((t - 1) / 2);
  return `${r(n, 0, i)}…${r(n, -(t - 1 - i))}`;
}
function ve(e, t) {
  let n = s(e);
  if (!n) return;
  let r = typeof n.command == `string` ? n.command.trim() : void 0;
  if (!r) return;
  let i = n.host === `node` && typeof n.node == `string` && n.node.trim() ? n.node.trim() : void 0,
    a = se(r),
    o = L(a) ?? L(r),
    c = o?.text || `run command`,
    l =
      (typeof n.workdir == `string`
        ? n.workdir
        : typeof n.cwd == `string`
          ? n.cwd
          : void 0
      )?.trim() ||
      o?.chdirPath ||
      void 0,
    u = _e(a),
    d = l ? I(l) : void 0,
    f = i ? ` · node: ${i}` : ``;
  if (o?.allGeneric !== !1 && R(c)) return `${d ? `${u} ${d}` : u}${f}`;
  let p = d ? `${c} ${d}` : c;
  return t?.detailMode !== `explain` && u && u !== p && u !== c
    ? `${p}${f} · ${ae(u)}`
    : `${p}${f}`;
}
var z,
  ye = e(() => {
    (o(),
      i(),
      y(),
      oe(),
      ge(),
      (z =
        `check git.view git.show git.list git.switch git.create git.pull git.push git.fetch git.merge git.rebase git.stage git.restore git.reset git.stash git.search .find files.list files.show first.show last.print line.print text.copy .move .remove .create folder.create file.fetch http.install dependencies.run tests.run build.start app.run lint.run openclaw.run node script.run node .run python.run ruby.run php.run sed.run git .run npm .run pnpm .run yarn .run bun .check js syntax`.split(
          `.`,
        )));
  });
function be(e) {
  return (e ?? `tool`).trim();
}
function xe(e) {
  let t = e.replace(/_/g, ` `).trim();
  if (!t) return `Tool`;
  let n = [];
  for (let e of t.split(/\s+/))
    n.push(
      e.length <= 2 && e.toUpperCase() === e ? e : `${e.at(0)?.toUpperCase() ?? ``}${e.slice(1)}`,
    );
  return n.join(` `);
}
function Se(e) {
  let t = c(e);
  if (t) return t.replace(/_/g, ` `);
}
function Ce(e) {
  if (!e || typeof e != `object`) return;
  let t = e.action;
  if (typeof t == `string`) return c(t) || void 0;
}
function we(e) {
  return He({
    toolKey: e.toolKey,
    args: e.args,
    meta: e.meta,
    action: Ce(e.args),
    spec: e.spec,
    fallbackDetailKeys: e.fallbackDetailKeys,
    detailMode: e.detailMode,
    toolDetailMode: e.toolDetailMode,
    detailCoerce: e.detailCoerce,
    detailMaxEntries: e.detailMaxEntries,
    detailFormatKey: e.detailFormatKey,
  });
}
function B(e, t = {}) {
  let n = t.maxStringChars ?? 160,
    i = t.maxArrayEntries ?? 3;
  if (e != null) {
    if (typeof e == `string`) {
      let t = e.trim();
      if (!t) return;
      let i = c(t.split(/\r?\n/)[0]) ?? ``;
      if (!i) return;
      let a = v(i);
      if (a.length > n) {
        let e = Math.floor((n - 1) / 2);
        return `${r(a, 0, e)}…${r(a, -(n - 1 - e))}`;
      }
      return a;
    }
    if (typeof e == `boolean`) return !e && !t.includeFalse ? void 0 : e ? `true` : `false`;
    if (typeof e == `number`)
      return Number.isFinite(e)
        ? e === 0 && !t.includeZero
          ? void 0
          : String(e)
        : t.includeNonFinite
          ? String(e)
          : void 0;
    if (Array.isArray(e)) {
      let n = [],
        r = 0;
      for (let a of e) {
        let e = B(a, t);
        e && ((r += 1), n.length < i && n.push(e));
      }
      if (r === 0) return;
      let a = n.join(`, `);
      return r > i ? `${a}…` : a;
    }
  }
}
function V(e, t) {
  if (!e || typeof e != `object`) return;
  let n = e;
  for (let e of t.split(`.`)) {
    if (!e || !n || typeof n != `object`) return;
    n = n[e];
  }
  return n;
}
function H(e) {
  let t = s(e);
  if (t)
    for (let e of [t.path, t.file_path, t.filePath]) {
      if (typeof e != `string`) continue;
      let t = e.trim();
      if (t) return t;
    }
}
function Te(e) {
  let t = s(e);
  if (!t) return;
  let n = H(t);
  if (!n) return;
  let r = typeof t.offset == `number` && Number.isFinite(t.offset) ? Math.floor(t.offset) : void 0,
    i = typeof t.limit == `number` && Number.isFinite(t.limit) ? Math.floor(t.limit) : void 0,
    a = r === void 0 ? void 0 : Math.max(1, r),
    o = i === void 0 ? void 0 : Math.max(1, i);
  return a !== void 0 && o !== void 0
    ? `${o === 1 ? `line` : `lines`} ${a}-${a + o - 1} from ${n}`
    : a === void 0
      ? o === void 0
        ? `from ${n}`
        : `first ${o} ${o === 1 ? `line` : `lines`} of ${n}`
      : `from line ${a} in ${n}`;
}
function Ee(e, t) {
  let n = s(t);
  if (!n) return;
  let r = H(n) ?? c(n.url);
  if (!r) return;
  if (e === `attach`) return `from ${r}`;
  let i = e === `edit` ? `in` : `to`,
    a =
      typeof n.content == `string`
        ? n.content
        : typeof n.newText == `string`
          ? n.newText
          : typeof n.new_string == `string`
            ? n.new_string
            : void 0;
  return a && a.length > 0 ? `${i} ${r} (${a.length} chars)` : `${i} ${r}`;
}
function De(e) {
  let t = s(e);
  if (!t) return;
  let n = Oe(t),
    r =
      typeof t.count == `number` && Number.isFinite(t.count) && t.count > 0
        ? Math.floor(t.count)
        : typeof t.max_results == `number` && Number.isFinite(t.max_results) && t.max_results > 0
          ? Math.floor(t.max_results)
          : typeof t.num_results == `number` && Number.isFinite(t.num_results) && t.num_results > 0
            ? Math.floor(t.num_results)
            : typeof t.limit == `number` && Number.isFinite(t.limit) && t.limit > 0
              ? Math.floor(t.limit)
              : typeof t.top_k == `number` && Number.isFinite(t.top_k) && t.top_k > 0
                ? Math.floor(t.top_k)
                : void 0;
  if (n.length === 0) return;
  let i = n.slice(0, 3).map((e) => `"${e}"`),
    a = n.length > i.length ? `${i.join(`, `)}…` : i.join(`, `);
  return r === void 0 ? `for ${a}` : `for ${a} (top ${r})`;
}
function Oe(e) {
  let t = [],
    n = new Set(),
    r = (e) => {
      let r = c(e);
      !r || n.has(r) || (n.add(r), t.push(r));
    };
  (r(e.query), r(e.q), r(e.search), r(e.input), r(e.objective));
  for (let t of [`search_query`, `image_query`, `queries`, `search_queries`]) {
    let n = e[t];
    if (Array.isArray(n))
      for (let e of n) {
        if (typeof e == `string`) {
          r(e);
          continue;
        }
        let t = s(e);
        t && (r(t.query), r(t.q), r(t.search));
      }
  }
  return t;
}
function ke(e) {
  let t = e.match(/openclaw\.tools\.call\s*\(\s*/s);
  if (!t || t.index === void 0) return;
  let n = e.slice(t.index + t[0].length),
    r = n.match(/^("[^"]{1,240}"|'[^']{1,240}'|[^,)\s]{1,240})/s);
  if (!r?.[1]) return;
  let i = n.slice(r[0].length),
    a = i.indexOf(`,`);
  if (a < 0) return { target: r[1] };
  let o = i.slice(a + 1);
  return { target: r[1], args: o };
}
function Ae(e) {
  let t = c(e);
  if (t) return c(t.match(/^(?:openclaw|mcp|client):[^:]+:(.+)$/s)?.[1]) ?? t;
}
function je(e) {
  let t = new Map();
  for (let n of e.matchAll(
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?openclaw\.tools\.describe\s*\(\s*("[^"]{1,240}"|'[^']{1,240}')\s*(?:,|\))/gs,
  )) {
    let e = n[1],
      r = U(n[2]);
    e && r && t.set(e, r);
  }
  return t;
}
function Me(e, t) {
  let n = c(t);
  if (!n) return;
  let r = n.match(/^([A-Za-z_$][\w$]*)\.id\b/s);
  if (r?.[1]) {
    let t = je(e).get(r[1]);
    if (t) return t;
  }
  return U(n);
}
function U(e) {
  let t = c(e);
  if (!t) return;
  let n = t.match(/^[\s]*["']([^"']{1,160})["'][\s]*$/s);
  if (n?.[1]) return c(n[1]);
  if (t.match(/\.id\b/)) return c(t.replace(/\.id\b.*/s, ``));
  let r = t.match(/name\s*:\s*["']([^"']{1,120})["']/s);
  if (r?.[1]) return c(r[1]);
  let i = t.replace(/\s+/g, ` `).trim();
  return i.length <= 80 ? i : void 0;
}
function Ne(e) {
  let t = Pe(e);
  if (!t) return;
  let n = {};
  for (let e of t.matchAll(
    /(?:^|[,{\s])([A-Za-z_$][\w$]*)\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|true|false|null|[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:e[+-]?\d+)?)/gi,
  )) {
    let t = e[1],
      r = e[2];
    !t || r === void 0 || (n[t] = Fe(r));
  }
  return Object.keys(n).length > 0 ? n : void 0;
}
function Pe(e) {
  let t = c(e);
  if (!t) return;
  let n = t.indexOf(`{`);
  if (n < 0) return;
  let r = 0,
    i,
    a = !1;
  for (let e = n; e < t.length; e += 1) {
    let o = t[e];
    if (a) {
      a = !1;
      continue;
    }
    if (o === `\\`) {
      a = !0;
      continue;
    }
    if (i) {
      o === i && (i = void 0);
      continue;
    }
    if (o === `"` || o === `'`) {
      i = o;
      continue;
    }
    if (o === `{`) {
      r += 1;
      continue;
    }
    if (o === `}` && (--r, r === 0)) return t.slice(n, e + 1);
  }
}
function Fe(e) {
  if (e === `true`) return !0;
  if (e === `false`) return !1;
  if (e === `null`) return null;
  let t = n(e);
  if (t !== void 0) return t;
  let r = e[0],
    i = e.slice(1, -1);
  if (r === `"`)
    try {
      return JSON.parse(e);
    } catch {
      return i;
    }
  return i.replace(/\\'/g, `'`).replace(/\\\\/g, `\\`);
}
function Ie(e) {
  let t = c(e)
    ?.replace(/[);\s]+$/g, ``)
    .trim();
  if (!t) return;
  let n = t.match(/query\s*:\s*["']([^"']{1,80})["']/s);
  if (n?.[1]) return `query ` + n[1].trim();
  let r = t.match(/action\s*:\s*["']([^"']{1,80})["']/s);
  if (r?.[1]) return c(r[1]);
  let i = t.match(/command\s*:\s*["']([^"'\n]{1,120})["']/s);
  if (i?.[1]) return c(i[1]);
  let a = t.match(/sessionId\s*:\s*["']([^"']{1,80})["']/s);
  if (a?.[1]) return `session ` + a[1].trim();
  let o = t.match(/id\s*:\s*["']([^"']{1,80})["']/s);
  if (o?.[1]) return o[1].trim();
}
function Le(e) {
  let t = s(e);
  if (!t || typeof t.code != `string`) return;
  let n = t.code,
    r = ke(n);
  if (r) {
    let e = Me(n, r.target);
    return e
      ? {
          toolName: e,
          displayToolName: Ae(e),
          displayArgs: Ne(r.args),
          detail: Ie(r.args),
          bridgeVerb: `call`,
        }
      : { toolName: `tool_search_code`, detail: `call selected tool`, bridgeVerb: `call` };
  }
  let i = n.match(/openclaw\.tools\.describe\s*\(\s*([^)]+?)\s*(?:,|\))/s);
  if (i) {
    let e = U(i[1]);
    return e
      ? { toolName: e, detail: `describe via tool search`, bridgeVerb: `describe` }
      : { toolName: `tool_search_code`, detail: `describe selected tool`, bridgeVerb: `describe` };
  }
  let a = n.match(/openclaw\.tools\.search\s*\(\s*([^)]+?)\s*(?:,|\))/s);
  if (a) {
    let e = U(a[1]);
    return {
      toolName: `tool_search_code`,
      detail: e ? `search ` + e : `search tools`,
      bridgeVerb: `search`,
    };
  }
  return { toolName: `tool_search_code`, detail: `run bridge code` };
}
function Re(e) {
  return Le(e)?.detail;
}
function ze(e) {
  let t = s(e);
  if (!t) return;
  let n = c(t.url);
  if (!n) return;
  let r = c(t.extractMode),
    i =
      typeof t.maxChars == `number` && Number.isFinite(t.maxChars) && t.maxChars > 0
        ? Math.floor(t.maxChars)
        : void 0,
    a = ``;
  return (
    r && (a = `mode ${r}`),
    i !== void 0 && (a = a ? `${a}, max ${i} chars` : `max ${i} chars`),
    a ? `from ${n} (${a})` : `from ${n}`
  );
}
function Be(e, t) {
  if (!(!e || !t)) return e.actions?.[t] ?? void 0;
}
function Ve(e, t, n) {
  if (n.mode === `first`) {
    for (let r of t) {
      let t = B(V(e, r), n.coerce);
      if (t) return t;
    }
    return;
  }
  let r = [];
  for (let i of t) {
    let t = B(V(e, i), n.coerce);
    t && r.push({ label: n.formatKey ? n.formatKey(i) : i, value: t });
  }
  if (r.length === 0) return;
  if (r.length === 1) return r.at(0)?.value;
  let i = new Set(),
    a = [];
  for (let e of r) {
    let t = `${e.label}:${e.value}`;
    i.has(t) || (i.add(t), a.push(e));
  }
  if (a.length === 0) return;
  let o = n.maxEntries ?? 8,
    s = [];
  for (let e = 0; e < a.length && e < o; e += 1) {
    let t = a[e];
    t && s.push(`${t.label} ${t.value}`);
  }
  return s.join(` · `);
}
function He(e) {
  let t = Be(e.spec, e.action),
    n =
      e.toolKey === `web_search`
        ? `search`
        : e.toolKey === `web_fetch`
          ? `fetch`
          : e.toolKey.replace(/_/g, ` `).replace(/\./g, ` `),
    r = Se(t?.label ?? e.action ?? n),
    i;
  ((e.toolKey === `exec` || e.toolKey === `bash`) &&
    (i = ve(e.args, { detailMode: e.toolDetailMode })),
    !i && e.toolKey === `read` && (i = Te(e.args)),
    !i &&
      (e.toolKey === `write` || e.toolKey === `edit` || e.toolKey === `attach`) &&
      (i = Ee(e.toolKey, e.args)),
    !i && e.toolKey === `web_search` && (i = De(e.args)),
    !i && e.toolKey === `web_fetch` && (i = ze(e.args)),
    !i && e.toolKey === `tool_search_code` && (i = Re(e.args)));
  let a = t?.detailKeys ?? e.spec?.detailKeys ?? e.fallbackDetailKeys ?? [];
  return (
    !i &&
      a.length > 0 &&
      (i = Ve(e.args, a, {
        mode: e.detailMode,
        coerce: e.detailCoerce,
        maxEntries: e.detailMaxEntries,
        formatKey: e.detailFormatKey,
      })),
    !i && e.meta && (i = e.meta),
    { verb: r, detail: i }
  );
}
function Ue(e, t = {}) {
  if (!e) return;
  let n = e.includes(` · `)
    ? (() => {
        let t = [];
        for (let n of e.split(` · `)) {
          let e = n.trim();
          e && t.push(e);
        }
        return t.join(`, `);
      })()
    : e;
  if (n) return t.prefixWithWith ? `with ${n}` : n;
}
var We = e(() => {
  (o(), a(), i(), te(), y(), ye());
});
function Ge(e) {
  return e ? (X[e] ?? `puzzle`) : `puzzle`;
}
function W(e) {
  return {
    icon: Ge(e?.emoji),
    title: e?.title,
    label: e?.label,
    detailKeys: e?.detailKeys,
    actions: e?.actions,
  };
}
function Ke(e) {
  if (!e) return e;
  for (let t of [
    { re: /^\/Users\/[^/]+(\/|$)/, replacement: `~$1` },
    { re: /^\/home\/[^/]+(\/|$)/, replacement: `~$1` },
    { re: /^C:\\Users\\[^\\]+(\\|$)/i, replacement: `~$1` },
  ])
    if (t.re.test(e)) return e.replace(t.re, t.replacement);
  return e;
}
function qe(e) {
  let n = be(e.name),
    r = t(n),
    i = $[r],
    a = i?.icon ?? Q.icon ?? `puzzle`,
    o = i?.title ?? xe(n),
    s = i?.label ?? o,
    c = we({
      toolKey: r,
      args: e.args,
      meta: e.meta,
      spec: i,
      fallbackDetailKeys: Q.detailKeys,
      detailMode: `first`,
      toolDetailMode: e.detailMode,
      detailCoerce: { includeFalse: !0, includeZero: !0 },
    }),
    { verb: l } = c,
    { detail: u } = c;
  return ((u &&= Ke(u)), { name: n, icon: a, title: o, label: s, verb: l, detail: u });
}
function Je(e) {
  return Ue(e.detail, { prefixWithWith: !0 });
}
function G(e) {
  return e === J || e.startsWith(`${J}/`) || e === q || e.startsWith(`${q}/`);
}
function K(e) {
  return e.protocol === `http:` || e.protocol === `https:`;
}
function Ye(e, t = !1) {
  try {
    let n = new URL(e, `http://localhost`);
    return n.origin === `http://localhost`
      ? G(n.pathname)
        ? `${n.pathname}${n.search}${n.hash}`
        : void 0
      : !t || !K(n)
        ? void 0
        : n.toString();
  } catch {
    return;
  }
}
function Xe(e, t, n = !1) {
  let r = e?.trim();
  if (!r) return;
  let i = Ye(r, n);
  if (i) {
    if (!t?.trim()) return i;
    try {
      let e = new URL(t),
        n = e.pathname.replace(/\/+$/, ``);
      if (!n.startsWith(Y)) return i;
      let r = new URL(i, e.origin);
      return G(r.pathname)
        ? ((r.protocol = e.protocol),
          (r.username = e.username),
          (r.password = e.password),
          (r.host = e.host),
          (r.pathname = `${n}${r.pathname}`),
          r.toString())
        : i;
    } catch {
      return i;
    }
  }
}
function Ze(e, t) {
  if (t === `strict` || (t === `scripts` && e === `strict`)) return ``;
  if (t === `scripts`) return `allow-scripts`;
  switch (e) {
    case `strict`:
      return ``;
    case `trusted`:
      return `allow-scripts allow-same-origin`;
    default:
      return `allow-scripts`;
  }
}
var q,
  J,
  Y,
  X,
  Z,
  Q,
  $,
  Qe = e(() => {
    (ee(),
      We(),
      u(),
      (q = `/__openclaw__/a2ui`),
      (J = `/__openclaw__/canvas`),
      (Y = `/__openclaw__/cap`),
      (X = {
        "🧩": `puzzle`,
        "🛠️": `wrench`,
        "🧰": `wrench`,
        "📖": `fileText`,
        "✍️": `edit`,
        "📝": `penLine`,
        "📎": `paperclip`,
        "🌐": `globe`,
        "📺": `monitor`,
        "🧾": `fileText`,
        "🔐": `settings`,
        "💻": `monitor`,
        "🔌": `plug`,
        "💬": `messageSquare`,
      }),
      (Z = p),
      (Q = W(Z.fallback ?? { emoji: `🧩` })),
      ($ = Object.fromEntries(Object.entries(Z.tools ?? {}).map(([e, t]) => [e, W(t)]))));
  });
export { qe as a, Ze as i, Qe as n, y as o, Xe as r, v as s, Je as t };
//# sourceMappingURL=tool-display-DdrJibK-.js.map
