import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { catalog } from "../data";

export default defineTool({
  name: "search_hotels",
  title: "Search hotels",
  description: "Search the StayVista hotel catalog by destination, category, star rating, and price range.",
  inputSchema: {
    query: z.string().trim().optional().describe("Free-text match against name, location, or description."),
    location: z.string().trim().optional().describe("Filter by destination substring, e.g. 'Paris' or 'Morocco'."),
    category: z.string().trim().optional().describe("Filter by category, e.g. 'Beach Resort', 'City Hotel'."),
    minStarRating: z.number().int().min(1).max(5).optional(),
    maxPriceUsd: z.number().positive().optional().describe("Maximum nightly starting price in USD."),
    limit: z.number().int().min(1).max(50).default(10),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, location, category, minStarRating, maxPriceUsd, limit }) => {
    const q = query?.toLowerCase();
    const results = catalog.filter((h) => {
      if (q && !`${h.name} ${h.location} ${h.description}`.toLowerCase().includes(q)) return false;
      if (location && !h.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (category && !h.category.toLowerCase().includes(category.toLowerCase())) return false;
      if (minStarRating && h.starRating < minStarRating) return false;
      if (maxPriceUsd && h.priceFromUsd > maxPriceUsd) return false;
      return true;
    }).slice(0, limit);
    return {
      content: [{ type: "text", text: `Found ${results.length} hotel(s).` }],
      structuredContent: { count: results.length, hotels: results },
    };
  },
});
