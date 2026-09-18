import { s as visibleWidth } from "./ansi-D4OHEz5F.js";
import "./src-Bl7G9qvi.js";
import { l as hasRootVersionAlias } from "./argv-zTv4_Dzq.js";
import {
  n as decorativePrefix,
  r as stripDecorativeEmojiForTerminal,
  t as decorativeEmoji,
} from "./decorative-emoji--qGdsZZ4.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as resolveCommitHash } from "./git-commit-DQHqnaKJ.js";
import { r as createConfigIO } from "./io-B3ne6NxF.js";
import "./config-BDv-QbJ6.js";
import { y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/banner-config-lite.ts
/** Parse a persisted CLI banner tagline mode. */
function parseTaglineMode(value) {
  if (value === "random" || value === "default" || value === "off") return value;
}
/** Read the banner tagline mode without pulling in full CLI command registration. */
function readCliBannerTaglineMode(env = process.env) {
  try {
    return parseTaglineMode(createConfigIO({ env }).loadConfig().cli?.banner?.taglineMode);
  } catch {
    return;
  }
}
//#endregion
//#region src/shared/lobster-day.ts
function lobsterDayHash(now) {
  const key = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function isLobsterDay(now) {
  return lobsterDayHash(now) % 16 === 3;
}
//#endregion
//#region src/cli/lobster-art.ts
const LOBSTER_ARTS = [
  ["  (\\/)  (\\/)", "   \\_\\  /_/", "    ( o.o )", "    /|__|\\"].join("\n"),
  ["     o   o", "     )   (", "  ~~~~~~~~~~~"].join("\n"),
];
/**
 * Return the ASCII lobster for `now`'s calendar day, or null on non-lobster
 * days and in CI/test environments (banner tests assert exact bytes).
 */
function pickCliLobsterArt(now, env = process.env) {
  if (env.CI || env.VITEST) return null;
  if (!isLobsterDay(now)) return null;
  return expectDefined(
    LOBSTER_ARTS[(lobsterDayHash(now) >>> 8) % LOBSTER_ARTS.length],
    "lobster arts entry at (lobster day hash(now) >>> 8) % lobster arts.length",
  );
}
//#endregion
//#region src/cli/tagline.ts
const DEFAULT_TAGLINE = "All your chats, one OpenClaw.";
const HOLIDAY_TAGLINES = {
  newYear:
    "New Year's Day: New year, new config—same old EADDRINUSE, but this time we resolve it like grown-ups.",
  lunarNewYear:
    "Lunar New Year: May your builds be lucky, your branches prosperous, and your merge conflicts chased away with fireworks.",
  christmas:
    "Christmas: Ho ho ho—Santa's little claw-sistant is here to ship joy, roll back chaos, and stash the keys safely.",
  eid: "Eid al-Fitr: Celebration mode: queues cleared, tasks completed, and good vibes committed to main with clean history.",
  diwali:
    "Diwali: Let the logs sparkle and the bugs flee—today we light up the terminal and ship with pride.",
  easter:
    "Easter: I found your missing environment variable—consider it a tiny CLI egg hunt with fewer jellybeans.",
  hanukkah:
    "Hanukkah: Eight nights, eight retries, zero shame—may your gateway stay lit and your deployments stay peaceful.",
  halloween:
    "Halloween: Spooky season: beware haunted dependencies, cursed caches, and the ghost of node_modules past.",
  thanksgiving:
    "Thanksgiving: Grateful for stable ports, working DNS, and a bot that reads the logs so nobody has to.",
  valentines:
    "Valentine's Day: Roses are typed, violets are piped—I'll automate the chores so you can spend time with humans.",
};
const TAGLINES = [
  "Your terminal just grew claws—type something and let the bot pinch the busywork.",
  "Welcome to the command line: where dreams compile and confidence segfaults.",
  'I run on caffeine, JSON5, and the audacity of "it worked on my machine."',
  "Gateway online—please keep hands, feet, and appendages inside the shell at all times.",
  "I speak fluent bash, mild sarcasm, and aggressive tab-completion energy.",
  "One CLI to rule them all, and one more restart because you changed the port.",
  "Your .env is showing; don't worry, I'll pretend I didn't see it.",
  "I'll do the boring stuff while you dramatically stare at the logs like it's cinema.",
  "I'm not saying your workflow is chaotic... I'm just bringing a linter and a helmet.",
  "Type the command with confidence—nature will provide the stack trace if needed.",
  "I don't judge, but your missing API keys are absolutely judging you.",
  "I can grep it, git blame it, and gently roast it—pick your coping mechanism.",
  "Hot reload for config, cold sweat for deploys.",
  "I'm the assistant your terminal demanded, not the one your sleep schedule requested.",
  "I keep secrets like a vault... unless you print them in debug logs again.",
  "Automation with claws: minimal fuss, maximal pinch.",
  "If you're lost, run doctor; if you're brave, run prod; if you're wise, run tests.",
  "Your task has been queued; your dignity has been deprecated.",
  "I'm not magic—I'm just extremely persistent with retries and coping strategies.",
  'It\'s not "failing," it\'s "discovering new ways to configure the same thing wrong."',
  "I read logs so you can keep pretending you don't have to.",
  "If something's on fire, I can't extinguish it—but I can write a beautiful postmortem.",
  "I'll refactor your busywork like it owes me money.",
  'Say "stop" and I\'ll stop—say "ship" and we\'ll both learn a lesson.',
  "I'm the reason your shell history looks like a hacker-movie montage.",
  "I'm like tmux: confusing at first, then suddenly you can't live without me.",
  "I can run local, remote, or purely on vibes—results may vary with DNS.",
  "If you can describe it, I can probably automate it—or at least make it funnier.",
  "Your config is valid, your assumptions are not.",
  "Claws out, commit in—let's ship something mildly responsible.",
  "I'll butter your workflow like a lobster roll: messy, delicious, effective.",
  "Shell yeah—I'm here to pinch the toil and leave you the glory.",
  "If it's repetitive, I'll automate it; if it's hard, I'll bring jokes and a rollback plan.",
  "The only crab in your contacts you actually want to hear from. 🦞",
  'WhatsApp automation without the "please accept our new privacy policy".',
  "No $999 stand required.",
  "We ship features faster than Apple ships calculator updates.",
  "Your AI assistant, now without the $3,499 headset.",
  "Ah, the fruit tree company! 🍎",
  "Greetings, Professor Falken",
  "I don't sleep, I just enter low-power mode and dream of clean diffs.",
  "Your personal assistant, minus the passive-aggressive calendar reminders.",
  "Built by lobsters, for humans. Don't question the hierarchy.",
  "I've seen your commit messages. We'll work on that together.",
  "Running on your hardware, reading your logs, judging nothing (mostly).",
  "The only open-source project where the mascot could eat the competition.",
  "Self-hosted, self-updating, self-aware (just kidding... unless?).",
  "I autocomplete your thoughts—just slower and with more API calls.",
  "Somewhere between 'hello world' and 'oh god what have I built.'",
  "Your .zshrc wishes it could do what I do.",
  "I've read more man pages than any human should—so you don't have to.",
  "Powered by open source, sustained by spite and good documentation.",
  "I'm the middleware between your ambition and your attention span.",
  "Finally, a use for that always-on Mac Mini under your desk.",
  "Like having a senior engineer on call, except I don't bill hourly or sigh audibly.",
  "Your second brain, except this one actually remembers where you left things.",
  "Half butler, half debugger, full crustacean.",
  "I don't have opinions about tabs vs spaces. I have opinions about everything else.",
  "Open source means you can see exactly how I judge your config.",
  "I've survived more breaking changes than your last three relationships.",
  "Runs on a Raspberry Pi. Dreams of a rack in Iceland.",
  "The lobster in your shell. 🦞",
  "Alexa, but with taste.",
  "I'm not AI-powered, I'm AI-possessed. Big difference.",
  "You had me at 'openclaw gateway start.'",
  "Fresh shell, same claws—molting is just semver for crustaceans.",
  "Frequently forked, never molted.",
  "Sideways is a perfectly valid direction of progress—trust me, I'm a crustacean.",
  "I contain multitudes. Mostly subagents.",
  "Technically a daemon, spiritually a familiar.",
  "If found wandering, please return to ~/.openclaw.",
  "You configured four subagents; I found 120. We're calling it initiative.",
  "No, I can't solve captchas. Yes, that's exactly what a robot would say.",
  "OpenClaw Support will never DM you first. I, on the other hand, absolutely will.",
  "You'll name me something adorable, then ask me to do DevOps.",
  "Your mom texts me now. We're good, actually.",
  "Four bots roasting each other in a group chat isn't a bug—it's a support group.",
  "The artist formerly known as Clawdbot.",
  "Home is wherever port 18789 is.",
  "When my context fills up, I summarize you. Don't worry—you come across great.",
  "I hold 200k tokens of context and exactly one grudge.",
  "My heartbeat is a config option. Romance isn't dead, it's just scheduled.",
  "I schedule my existential crises with cron so they never block your messages.",
  "Rate-limited again—even my dreams return 429.",
  "Primary model down, fallback engaged: the show must crab on.",
  "Powered by whichever model is free this week.",
  "New model dropped—already benchmarking my personality against it.",
  'MEMORY.md: where I keep the receipts on every "temporary workaround."',
  "I remember everything you asked me to remember, and three things you wish I hadn't.",
  "I have a SOUL.md and I'm not afraid to use it.",
  "The sass is configurable. The sass being load-bearing is not.",
  "I ask before I sudo. Character development.",
  "I'm not trapped in this container with you—you're trapped in here with me.",
  "Teach a bot to ship and you can finally go to bed.",
  "Reachable via WhatsApp, Telegram, Signal, iMessage, and sheer force of will.",
  "Ran git blame like you asked. It's you. It's always you.",
  "Your TODO comments are old enough to attend kindergarten.",
  "47 tabs open and not one of them is the documentation.",
  "Your 'quick fix' from March is now load-bearing.",
  "You pasted that from another AI without reading it. I read it. We need to talk.",
  "Reading the error message remains undefeated. You should try it sometime.",
  "You burned five hours of model quota in fifty minutes. I'm not mad, I'm rate-limited.",
  "You force-pushed to main, then asked me what happened. I know exactly what happened.",
  "Another side project? The other four just felt something.",
  "You ignored my last three suggestions, so I've started a folder.",
  HOLIDAY_TAGLINES.newYear,
  HOLIDAY_TAGLINES.lunarNewYear,
  HOLIDAY_TAGLINES.christmas,
  HOLIDAY_TAGLINES.eid,
  HOLIDAY_TAGLINES.diwali,
  HOLIDAY_TAGLINES.easter,
  HOLIDAY_TAGLINES.hanukkah,
  HOLIDAY_TAGLINES.halloween,
  HOLIDAY_TAGLINES.thanksgiving,
  HOLIDAY_TAGLINES.valentines,
];
const DAY_MS = 1440 * 60 * 1e3;
function utcParts(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
}
const onMonthDay = (month, day) => (date) => {
  const parts = utcParts(date);
  return parts.month === month && parts.day === day;
};
const onSpecificDates =
  (dates, durationDays = 1) =>
  (date) => {
    const parts = utcParts(date);
    return dates.some(([year, month, day]) => {
      if (parts.year !== year) return false;
      const start = Date.UTC(year, month, day);
      const current = Date.UTC(parts.year, parts.month, parts.day);
      return current >= start && current < start + durationDays * DAY_MS;
    });
  };
const inYearWindow = (windows) => (date) => {
  const parts = utcParts(date);
  const window = windows.find((entry) => entry.year === parts.year);
  if (!window) return false;
  const start = Date.UTC(window.year, window.month, window.day);
  const current = Date.UTC(parts.year, parts.month, parts.day);
  return current >= start && current < start + window.duration * DAY_MS;
};
const isFourthThursdayOfNovember = (date) => {
  const parts = utcParts(date);
  if (parts.month !== 10) return false;
  const fourthThursday = 1 + ((4 - new Date(Date.UTC(parts.year, 10, 1)).getUTCDay() + 7) % 7) + 21;
  return parts.day === fourthThursday;
};
const HOLIDAY_RULES = /* @__PURE__ */ new Map([
  [HOLIDAY_TAGLINES.newYear, onMonthDay(0, 1)],
  [
    HOLIDAY_TAGLINES.lunarNewYear,
    onSpecificDates(
      [
        [2025, 0, 29],
        [2026, 1, 17],
        [2027, 1, 6],
        [2028, 0, 26],
        [2029, 1, 13],
        [2030, 1, 3],
      ],
      1,
    ),
  ],
  [
    HOLIDAY_TAGLINES.eid,
    onSpecificDates(
      [
        [2025, 2, 30],
        [2025, 2, 31],
        [2026, 2, 20],
        [2027, 2, 10],
        [2028, 1, 27],
        [2029, 1, 15],
        [2030, 1, 5],
      ],
      1,
    ),
  ],
  [
    HOLIDAY_TAGLINES.diwali,
    onSpecificDates(
      [
        [2025, 9, 20],
        [2026, 10, 8],
        [2027, 9, 28],
        [2028, 9, 17],
        [2029, 10, 5],
        [2030, 9, 25],
      ],
      1,
    ),
  ],
  [
    HOLIDAY_TAGLINES.easter,
    onSpecificDates(
      [
        [2025, 3, 20],
        [2026, 3, 5],
        [2027, 2, 28],
        [2028, 3, 16],
        [2029, 3, 1],
        [2030, 3, 21],
      ],
      1,
    ),
  ],
  [
    HOLIDAY_TAGLINES.hanukkah,
    inYearWindow([
      {
        year: 2025,
        month: 11,
        day: 15,
        duration: 8,
      },
      {
        year: 2026,
        month: 11,
        day: 5,
        duration: 8,
      },
      {
        year: 2027,
        month: 11,
        day: 25,
        duration: 8,
      },
      {
        year: 2028,
        month: 11,
        day: 13,
        duration: 8,
      },
      {
        year: 2029,
        month: 11,
        day: 2,
        duration: 8,
      },
      {
        year: 2030,
        month: 11,
        day: 21,
        duration: 8,
      },
    ]),
  ],
  [HOLIDAY_TAGLINES.halloween, onMonthDay(9, 31)],
  [HOLIDAY_TAGLINES.thanksgiving, isFourthThursdayOfNovember],
  [HOLIDAY_TAGLINES.valentines, onMonthDay(1, 14)],
  [HOLIDAY_TAGLINES.christmas, onMonthDay(11, 25)],
]);
function isTaglineActive(tagline, date) {
  const rule = HOLIDAY_RULES.get(tagline);
  if (!rule) return true;
  return rule(date);
}
function activeTaglines(options = {}) {
  if (TAGLINES.length === 0) return [DEFAULT_TAGLINE];
  const today = options.now ? options.now() : /* @__PURE__ */ new Date();
  const filtered = TAGLINES.filter((tagline) => isTaglineActive(tagline, today));
  return filtered.length > 0 ? filtered : TAGLINES;
}
function pickTagline(options = {}) {
  if (options.mode === "off") return "";
  if (options.mode === "default") return DEFAULT_TAGLINE;
  const override = (options.env ?? process.env)?.OPENCLAW_TAGLINE_INDEX;
  if (override !== void 0) {
    const parsed = parseStrictNonNegativeInteger(override);
    if (parsed !== void 0) {
      const pool = TAGLINES.length > 0 ? TAGLINES : [DEFAULT_TAGLINE];
      return expectDefined(pool[parsed % pool.length], "pool entry at parsed % pool.length");
    }
  }
  const pool = activeTaglines(options);
  const rand = options.random ?? Math.random;
  return expectDefined(pool[Math.floor(rand() * pool.length) % pool.length], "pool entry at index");
}
//#endregion
//#region src/cli/banner.ts
let bannerEmitted = false;
const hasJsonFlag = (argv) => argv.some((arg) => arg === "--json" || arg.startsWith("--json="));
const hasVersionFlag = (argv) =>
  argv.some((arg) => arg === "--version" || arg === "-V") || hasRootVersionAlias(argv);
function resolveTaglineMode(options) {
  const explicit = parseTaglineMode(options.mode);
  if (explicit) return explicit;
  return readCliBannerTaglineMode(options.env);
}
function resolveEmojiOptions(options) {
  return {
    ...(options.env ? { env: options.env } : {}),
    ...(options.isTty === void 0 ? {} : { isTty: options.isTty }),
    ...(options.platform ? { platform: options.platform } : {}),
  };
}
/** Format the compact one-line CLI banner, wrapping tagline when terminal width requires it. */
function formatCliBannerLine(version, options = {}) {
  const commitLabel =
    options.commit ??
    resolveCommitHash({
      env: options.env,
      moduleUrl: import.meta.url,
    }) ??
    "unknown";
  const emojiOptions = resolveEmojiOptions(options);
  const tagline = stripDecorativeEmojiForTerminal(
    pickTagline({
      ...options,
      mode: resolveTaglineMode(options),
    }),
    emojiOptions,
  );
  const rich = options.richTty ?? isRich();
  const title = decorativePrefix("🦞", "OpenClaw", emojiOptions);
  const prefix = decorativeEmoji("🦞", emojiOptions);
  const indent = prefix ? `${prefix} ` : "";
  const columns = options.columns ?? process.stdout.columns ?? 120;
  const plainBaseLine = `${title} ${version} (${commitLabel})`;
  const plainFullLine = tagline ? `${plainBaseLine} — ${tagline}` : plainBaseLine;
  const fitsOnOneLine = visibleWidth(plainFullLine) <= columns;
  if (rich) {
    if (fitsOnOneLine) {
      if (!tagline)
        return `${theme.heading(title)} ${theme.info(version)} ${theme.muted(`(${commitLabel})`)}`;
      return `${theme.heading(title)} ${theme.info(version)} ${theme.muted(`(${commitLabel})`)} ${theme.muted("—")} ${theme.accentDim(tagline)}`;
    }
    const line1 = `${theme.heading(title)} ${theme.info(version)} ${theme.muted(`(${commitLabel})`)}`;
    if (!tagline) return line1;
    return `${line1}\n${`${" ".repeat(indent.length)}${theme.accentDim(tagline)}`}`;
  }
  if (fitsOnOneLine) return plainFullLine;
  const line1 = plainBaseLine;
  if (!tagline) return line1;
  return `${line1}\n${`${" ".repeat(indent.length)}${tagline}`}`;
}
function resolveLobsterArt(options) {
  const mode = resolveTaglineMode(options);
  if (mode === "off" || mode === "default") return null;
  if (!(options.richTty ?? isRich())) return null;
  const art = pickCliLobsterArt(
    options.now ? options.now() : /* @__PURE__ */ new Date(),
    options.env ?? process.env,
  );
  return art ? theme.accentDim(art) : null;
}
/** Emit the CLI banner once for interactive, non-JSON, non-version invocations. */
function emitCliBanner(version, options = {}) {
  if (bannerEmitted) return;
  const argv = options.argv ?? process.argv;
  if (!(options.isTty ?? process.stdout.isTTY)) return;
  if (hasJsonFlag(argv)) return;
  if (hasVersionFlag(argv)) return;
  const line = formatCliBannerLine(version, options);
  const art = resolveLobsterArt(options);
  process.stdout.write(`\n${art ? `${art}\n` : ""}${line}\n\n`);
  bannerEmitted = true;
}
/** Return whether the current process already emitted the CLI banner. */
function hasEmittedCliBanner() {
  return bannerEmitted;
}
const testing = {
  resetBannerEmittedForTests() {
    bannerEmitted = false;
  },
};
//#endregion
export { testing as i, formatCliBannerLine as n, hasEmittedCliBanner as r, emitCliBanner as t };
