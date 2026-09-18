//#region packages/terminal-core/src/osc-progress.ts
const OSC_PROGRESS_PREFIX = "\x1B]9;4;";
const OSC_PROGRESS_ST = "\x1B\\";
const OSC_PROGRESS_BEL = "\x07";
const OSC_PROGRESS_C1_ST = "";
/** Return true when the terminal is known to support OSC progress messages. */
function supportsOscProgress(env, isTty) {
  if (!isTty) return false;
  const termProgram = (env.TERM_PROGRAM ?? "").toLowerCase();
  return (
    termProgram.includes("ghostty") || termProgram.includes("wezterm") || Boolean(env.WT_SESSION)
  );
}
/** Remove OSC terminators and escape introducers from progress labels. */
function sanitizeOscProgressLabel(label) {
  return label
    .replaceAll(OSC_PROGRESS_ST, "")
    .replaceAll(OSC_PROGRESS_BEL, "")
    .replaceAll(OSC_PROGRESS_C1_ST, "")
    .split("\x1B")
    .join("")
    .replaceAll("]", "")
    .trim();
}
/** Format one OSC progress control sequence. */
function formatOscProgress(state, percent, label) {
  const cleanLabel = sanitizeOscProgressLabel(label);
  if (percent === null) return `${OSC_PROGRESS_PREFIX}${state};;${cleanLabel}${OSC_PROGRESS_ST}`;
  return `${OSC_PROGRESS_PREFIX}${state};${Math.max(0, Math.min(100, Math.round(percent)))};${cleanLabel}${OSC_PROGRESS_ST}`;
}
/** Create a progress controller, returning no-op methods on unsupported terminals. */
function createOscProgressController(params) {
  if (!supportsOscProgress(params.env, params.isTty))
    return {
      setIndeterminate: () => {},
      setPercent: () => {},
      clear: () => {},
    };
  let lastLabel = "";
  return {
    setIndeterminate: (label) => {
      lastLabel = label;
      params.write(formatOscProgress(3, null, label));
    },
    setPercent: (label, percent) => {
      lastLabel = label;
      params.write(formatOscProgress(1, percent, label));
    },
    clear: () => {
      params.write(formatOscProgress(0, 0, lastLabel));
    },
  };
}
//#endregion
export { supportsOscProgress as n, createOscProgressController as t };
