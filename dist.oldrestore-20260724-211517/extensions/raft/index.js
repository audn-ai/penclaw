import { t as defineBundledChannelEntry } from "../../channel-entry-contract-Cy1kYSbr.js";
//#region extensions/raft/index.ts
var raft_default = defineBundledChannelEntry({
  id: "raft",
  name: "Raft",
  description: "Raft CLI wake bridge channel plugin",
  importMetaUrl: import.meta.url,
  plugin: {
    specifier: "./channel-plugin-api.js",
    exportName: "raftPlugin",
  },
});
//#endregion
export { raft_default as default };
