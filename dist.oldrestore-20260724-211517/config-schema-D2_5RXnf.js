import { n as createChannelConfigUiHints } from "./channel-core-Z_rV5hXh.js";
import { r as buildChannelConfigSchema } from "./config-schema-qmCQZl6j.js";
import { n as IMessageConfigSchema } from "./zod-schema.providers-core-BNKhRce5.js";
import "./config-api-C3U8VEbn.js";
//#endregion
//#region extensions/imessage/src/config-schema.ts
const IMessageChannelConfigSchema = buildChannelConfigSchema(IMessageConfigSchema, {
  uiHints: {
    "": {
      label: "iMessage",
      help: "iMessage channel provider configuration for CLI integration and DM access policy handling. Use explicit CLI paths when runtime environments have non-standard binary locations.",
    },
    ...createChannelConfigUiHints({
      channelLabel: "iMessage",
      dmPolicy: { channelKey: "imessage" },
      configWrites: true,
    }),
    cliPath: {
      label: "iMessage CLI Path",
      help: "Filesystem path to the iMessage bridge CLI binary used for send/receive operations. Set explicitly when the binary is not on PATH in service runtime environments.",
    },
    sendTransport: {
      label: "iMessage Send Transport",
      help: 'Preferred imsg RPC send transport for normal outbound replies. "auto" uses the IMCore bridge when available, "bridge" requires it, and "applescript" forces Messages automation.',
    },
  },
});
//#endregion
export { IMessageChannelConfigSchema as t };
