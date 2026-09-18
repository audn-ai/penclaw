import { i as supportsDecorativeEmoji, t as decorativeEmoji } from "./decorative-emoji--qGdsZZ4.js";
import { t as restoreTerminalState } from "./restore-BWpek1U9.js";
import { n as isRich, r as theme } from "./theme-vjDs9tao.js";
//#region src/cli/claw-banner.ts
const MASCOT_ART = [
  "▄███▄     ▄███▄",
  "▀█▄█▀     ▀█▄█▀",
  "     ▀▄ ▄▀",
  "    ██ █ ██",
  "    ▀█████▀",
  "   ▄█▀ █ ▀█▄",
];
const MASCOT_OPEN_ROWS = ["▄█▀█▄     ▄█▀█▄", "▀█ █▀     ▀█ █▀"];
const MASCOT_WIDTH = 15;
const WORDMARK_ROW_OFFSET = 2;
const WORDMARK_ART = [
  "█▀▀▀█ █▀▀▀█ █▀▀▀▀ █▄  █ █▀▀▀▀ █     █▀▀▀█ █   █",
  "█   █ █▀▀▀▀ █▀▀▀  █ ▀▄█ █     █     █▀▀▀█ █▄▀▄█",
  "▀▀▀▀▀ ▀     ▀▀▀▀▀ ▀   ▀ ▀▀▀▀▀ ▀▀▀▀▀ ▀   ▀ ▀   ▀",
];
const GAP = 3;
const BANNER_WIDTH = 66;
const ROWS = MASCOT_ART.length;
const identityTint = (text) => text;
function composeFrame(params) {
  const mascotRows = params.mascotRows ?? MASCOT_ART;
  const lines = [];
  for (let row = 0; row < ROWS; row++) {
    const mascotRow = (mascotRows[row] ?? "").padEnd(MASCOT_WIDTH).slice(0, MASCOT_WIDTH);
    let out = "";
    for (let col = 0; col < mascotRow.length; col++) {
      const ch = mascotRow[col] ?? " ";
      out += ch === " " ? " " : (params.mascotTint?.(col) ?? theme.accent)(ch);
    }
    const wordmarkRow = WORDMARK_ART[row - WORDMARK_ROW_OFFSET];
    if (wordmarkRow) {
      out += " ".repeat(GAP);
      for (let col = 0; col < wordmarkRow.length; col++) {
        const ch = wordmarkRow[col] ?? " ";
        out += ch === " " ? " " : (params.wordmarkTint?.(18 + col) ?? identityTint)(ch);
      }
    }
    lines.push(out.replace(/\s+$/, ""));
  }
  return lines;
}
function staticBannerLines() {
  return composeFrame({});
}
function plainTitleLine() {
  const icon = decorativeEmoji("🦞");
  return supportsDecorativeEmoji() && icon ? `${icon} OPENCLAW ${icon}` : "OPENCLAW";
}
const defaultSleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
async function animateBanner(opts) {
  const { rng, settleWhen, sleep, write } = opts;
  let settleRequested = false;
  const settleSignal = settleWhen
    ? Promise.resolve(settleWhen).then(
        () => {
          settleRequested = true;
        },
        () => {
          settleRequested = true;
        },
      )
    : null;
  const pause = async (ms) => {
    if (!settleSignal) {
      await sleep(ms);
      return true;
    }
    await Promise.race([sleep(ms), settleSignal]);
    return !settleRequested;
  };
  let drewFrame = false;
  const draw = (lines) => {
    const prefix = drewFrame ? `\x1b[${ROWS}F` : "";
    drewFrame = true;
    write(`${prefix}${lines.map((line) => `\x1b[K${line}`).join("\n")}\n`);
  };
  const onSignal = (signal) => {
    restoreTerminalState(`claw banner ${signal}`);
    process.exit(signal === "SIGINT" ? 130 : 143);
  };
  const onSigint = () => onSignal("SIGINT");
  const onSigterm = () => onSignal("SIGTERM");
  process.once("SIGINT", onSigint);
  process.once("SIGTERM", onSigterm);
  write("\x1B[?25l");
  try {
    const wipeSteps = 9;
    for (let step = 0; step <= wipeSteps; step++) {
      const edge = Math.round((BANNER_WIDTH * step) / wipeSteps);
      const tintAt = (colored) => (col) =>
        col < edge ? colored : col < edge + 2 ? theme.accentBright : theme.muted;
      draw(
        composeFrame({
          mascotTint: tintAt(theme.accent),
          wordmarkTint: tintAt(identityTint),
        }),
      );
      if (!(await pause(45))) return "settled";
    }
    const shimmerPasses = rng() < 0.2 ? 2 : 1;
    for (let pass = 0; pass < shimmerPasses; pass++)
      for (let x = MASCOT_WIDTH; x < 72; x += 4) {
        const band = (col) => (col >= x && col < x + 6 ? theme.accentBright : identityTint);
        draw(composeFrame({ wordmarkTint: band }));
        if (!(await pause(40))) return "settled";
      }
    const snips = rng() < 0.4 ? 2 : 1;
    for (let snip = 0; snip < snips; snip++) {
      draw(composeFrame({ mascotRows: [...MASCOT_OPEN_ROWS, ...MASCOT_ART.slice(2)] }));
      if (!(await pause(95))) return "settled";
      draw(staticBannerLines());
      if (!(await pause(115))) return "settled";
    }
    draw(staticBannerLines());
    return "completed";
  } finally {
    try {
      if (settleRequested && drewFrame) draw(staticBannerLines());
    } finally {
      process.off("SIGINT", onSigint);
      process.off("SIGTERM", onSigterm);
      write("\x1B[?25h");
    }
  }
}
/**
 * Prints the OpenClaw banner: animated on rich interactive terminals, static
 * otherwise, plain title on terminals too narrow for the art.
 */
async function printClawBanner(runtime, options = {}) {
  if ((options.columns ?? process.stdout.columns ?? 80) < BANNER_WIDTH) {
    runtime.log(`${plainTitleLine()}\n`);
    return "static";
  }
  const env = options.env ?? process.env;
  if (
    !(
      (options.isTty ?? process.stdout.isTTY ?? false) &&
      (options.rich ?? isRich()) &&
      !env.CI &&
      !env.VITEST
    )
  ) {
    runtime.log(`${staticBannerLines().join("\n")}\n`);
    return "static";
  }
  const result = await animateBanner({
    rng: options.rng ?? Math.random,
    settleWhen: options.settleWhen,
    sleep: options.sleep ?? defaultSleep,
    write: options.write ?? ((chunk) => process.stdout.write(chunk)),
  });
  (options.write ?? ((chunk) => process.stdout.write(chunk)))("\n");
  return result;
}
//#endregion
export { printClawBanner as t };
