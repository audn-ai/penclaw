import { confirm, intro, outro, password, select, text } from "@clack/prompts";
import { t as styleSelectParams } from "./prompt-select-styled-params-CvMQXWIw.js";
import { n as stylePromptMessage, r as stylePromptTitle } from "./prompt-style-BQVvtDcR.js";
import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
//#region src/commands/configure.shared.ts
const CONFIGURE_WIZARD_SECTIONS = [
  "workspace",
  "model",
  "web",
  "gateway",
  "daemon",
  "channels",
  "plugins",
  "skills",
  "health",
];
/** Parse repeated `--section` values into known configure wizard sections and invalid entries. */
function parseConfigureWizardSections(raw) {
  const sectionsRaw = Array.isArray(raw) ? normalizeStringEntries(raw) : [];
  if (sectionsRaw.length === 0)
    return {
      sections: [],
      invalid: [],
    };
  const invalid = sectionsRaw.filter((s) => !CONFIGURE_WIZARD_SECTIONS.includes(s));
  return {
    sections: sectionsRaw.filter((s) => CONFIGURE_WIZARD_SECTIONS.includes(s)),
    invalid,
  };
}
const CONFIGURE_SECTION_OPTIONS = [
  {
    value: "workspace",
    label: "Workspace",
    hint: "Set workspace + sessions",
  },
  {
    value: "model",
    label: "Model",
    hint: "Pick provider + credentials",
  },
  {
    value: "web",
    label: "Web tools",
    hint: "Configure web search (Perplexity/Brave) + fetch",
  },
  {
    value: "gateway",
    label: "Gateway",
    hint: "Port, bind, auth, tailscale",
  },
  {
    value: "daemon",
    label: "Daemon",
    hint: "Install/manage the background service",
  },
  {
    value: "channels",
    label: "Channels",
    hint: "Link WhatsApp/Telegram/etc and defaults",
  },
  {
    value: "plugins",
    label: "Plugins",
    hint: "Configure plugin settings (sandbox, tools, etc.)",
  },
  {
    value: "skills",
    label: "Skills",
    hint: "Install/enable workspace skills",
  },
  {
    value: "health",
    label: "Health check",
    hint: "Run gateway + channel checks",
  },
];
/** Styled configure wizard intro wrapper. */
const intro$1 = (message) => intro(stylePromptTitle(message) ?? message);
/** Styled configure wizard outro wrapper. */
const outro$1 = (message) => outro(stylePromptTitle(message) ?? message);
/** Styled text prompt wrapper. */
const text$1 = (params) =>
  text({
    ...params,
    message: stylePromptMessage(params.message),
  });
/** Styled password prompt wrapper. Echoes bullets so secrets never appear in cleartext. */
const password$1 = (params) =>
  password({
    ...params,
    message: stylePromptMessage(params.message),
  });
/** Styled confirm prompt wrapper. */
const confirm$1 = (params) =>
  confirm({
    ...params,
    message: stylePromptMessage(params.message),
  });
/** Styled select prompt wrapper that also normalizes option hints. */
const select$1 = (params) => select(styleSelectParams(params));
//#endregion
export {
  outro$1 as a,
  select$1 as c,
  intro$1 as i,
  text$1 as l,
  CONFIGURE_WIZARD_SECTIONS as n,
  parseConfigureWizardSections as o,
  confirm$1 as r,
  password$1 as s,
  CONFIGURE_SECTION_OPTIONS as t,
};
