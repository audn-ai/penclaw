//#region src/agents/mcp-content.ts
/** Converts the full MCP content union into the agent text/image contract. */
function mcpContentBlockToAgentContent(block) {
  switch (block.type) {
    case "text":
      return {
        type: "text",
        text: block.text,
      };
    case "image":
      if (block.data && block.mimeType)
        return {
          type: "image",
          data: block.data,
          mimeType: block.mimeType,
        };
      return {
        type: "text",
        text: JSON.stringify(block),
      };
    case "audio":
      return {
        type: "text",
        text: `[audio ${block.mimeType}]`,
      };
    case "resource_link": {
      const label = block.title ?? block.name;
      return {
        type: "text",
        text: label ? `[${label}] ${block.uri}` : block.uri,
      };
    }
    case "resource": {
      const resource = block.resource;
      return {
        type: "text",
        text: ("text" in resource ? resource.text : void 0) ?? resource.uri,
      };
    }
    default:
      return {
        type: "text",
        text: JSON.stringify(block),
      };
  }
}
//#endregion
export { mcpContentBlockToAgentContent as t };
