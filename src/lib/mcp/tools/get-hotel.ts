import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { catalog } from "../data";

export default defineTool({
  name: "get_hotel",
  title: "Get hotel details",
  description: "Retrieve full public details for a single hotel by its id.",
  inputSchema: {
    id: z.string().min(1).describe("Hotel id from search_hotels (e.g. '1', '12')."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const hotel = catalog.find((h) => h.id === id);
    if (!hotel) {
      return { content: [{ type: "text", text: `No hotel found with id '${id}'.` }], isError: true };
    }
    return {
      content: [{ type: "text", text: `${hotel.name} — ${hotel.location} (${hotel.starRating}★)` }],
      structuredContent: { hotel },
    };
  },
});
