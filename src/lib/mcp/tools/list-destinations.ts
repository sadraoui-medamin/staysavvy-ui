import { defineTool } from "@lovable.dev/mcp-js";
import { destinations } from "../data";

export default defineTool({
  name: "list_destinations",
  title: "List destinations",
  description: "List every destination StayVista features, with how many properties each has.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: `${destinations.length} destinations available.` }],
    structuredContent: { count: destinations.length, destinations },
  }),
});
