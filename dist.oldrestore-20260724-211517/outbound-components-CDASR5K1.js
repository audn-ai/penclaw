import { s as readDiscordComponentSpec } from "./components-Dpcn95GZ.js";
import {
  i as createLazyRuntimeNamedExport,
  r as createLazyRuntimeModule,
} from "./lazy-runtime-B-Fc-m0I.js";
//#region extensions/discord/src/outbound-components.ts
const DISCORD_MESSAGE_COMPONENT_LIMIT = 40;
const DISCORD_TEXT_DISPLAY_LIMIT = 2e3;
const DISCORD_PRESENTATION_CAPABILITIES = {
  supported: true,
  buttons: true,
  selects: true,
  context: true,
  divider: true,
  charts: false,
  limits: {
    actions: {
      maxActions: 25,
      maxActionsPerRow: 5,
      maxRows: 5,
      maxLabelLength: 80,
      supportsDisabled: true,
    },
    selects: {
      maxOptions: 25,
      maxLabelLength: 100,
      maxValueBytes: 100,
    },
    text: {
      maxLength: DISCORD_TEXT_DISPLAY_LIMIT - Array.from("-# ").length,
      encoding: "characters",
      markdownDialect: "discord-markdown",
    },
  },
};
const loadDiscordComponentSend = createLazyRuntimeNamedExport(
  () => import("./send.components-D8wkgRAC.js"),
  "sendDiscordComponentMessage",
);
async function sendDiscordComponentMessageLazy(...args) {
  return await (
    await loadDiscordComponentSend()
  )(...args);
}
const loadDiscordSharedInteractive = createLazyRuntimeModule(
  () => import("./shared-interactive-Bz8R0wjC.js"),
);
function addPayloadTextFallback(spec, payload) {
  return spec.text
    ? spec
    : {
        ...spec,
        text: payload.text?.trim() ? payload.text : void 0,
      };
}
function countDiscordComponentBlock(block) {
  if (block.type === "section")
    return (
      1 +
      (block.texts?.length ? block.texts.length : block.text ? 1 : 0) +
      (block.accessory ? 1 : 0)
    );
  if (block.type === "actions") return 1 + (block.buttons?.length ?? (block.select ? 1 : 0));
  return 1;
}
function countDiscordMessageComponents(params) {
  const blocks = params.spec.blocks ?? [];
  let count = 1 + (params.spec.text ? 1 : 0);
  for (const block of blocks) count += countDiscordComponentBlock(block);
  if (params.spec.modal) {
    const lastBlock = blocks.at(-1);
    const triggerFitsLastRow =
      lastBlock?.type === "actions" && !lastBlock.select && (lastBlock.buttons?.length ?? 0) < 5;
    count += triggerFitsLastRow ? 1 : 2;
  }
  const hasFileBlock = blocks.some((block) => block.type === "file");
  if (params.includesMedia && !hasFileBlock) count += 1;
  return count;
}
function isDiscordComponentSpecWithinMessageLimit(params) {
  const countedSpec = addPayloadTextFallback(params.spec, { text: params.fallbackText });
  if (countedSpec.text && Array.from(countedSpec.text).length > DISCORD_TEXT_DISPLAY_LIMIT)
    return false;
  return (
    countDiscordMessageComponents({
      spec: countedSpec,
      includesMedia: params.includesMedia === true,
    }) <= DISCORD_MESSAGE_COMPONENT_LIMIT
  );
}
async function buildDiscordPresentationPayload(params) {
  const componentSpec = (await loadDiscordSharedInteractive()).buildDiscordPresentationComponents(
    params.presentation,
  );
  if (!componentSpec) return null;
  const includesMedia = Boolean(
    params.payload.mediaUrl || params.payload.mediaUrls?.some((mediaUrl) => mediaUrl),
  );
  if (
    !isDiscordComponentSpecWithinMessageLimit({
      spec: componentSpec,
      fallbackText: params.payload.text,
      includesMedia,
    })
  )
    return null;
  return {
    ...params.payload,
    channelData: {
      ...params.payload.channelData,
      discord: {
        ...params.payload.channelData?.discord,
        presentationComponents: componentSpec,
      },
    },
  };
}
async function resolveDiscordComponentSpec(payload) {
  const discordData = payload.channelData?.discord;
  const rawComponentSpec =
    discordData?.presentationComponents ??
    (discordData?.components &&
    typeof discordData.components === "object" &&
    !Array.isArray(discordData.components)
      ? readDiscordComponentSpec(discordData.components)
      : null);
  if (rawComponentSpec) return addPayloadTextFallback(rawComponentSpec, payload);
  if (!payload.interactive) return;
  const interactiveSpec = (await loadDiscordSharedInteractive()).buildDiscordInteractiveComponents(
    payload.interactive,
  );
  return interactiveSpec ? addPayloadTextFallback(interactiveSpec, payload) : void 0;
}
//#endregion
export {
  sendDiscordComponentMessageLazy as a,
  resolveDiscordComponentSpec as i,
  buildDiscordPresentationPayload as n,
  isDiscordComponentSpecWithinMessageLimit as r,
  DISCORD_PRESENTATION_CAPABILITIES as t,
};
