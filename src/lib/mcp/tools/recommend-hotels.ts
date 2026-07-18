import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { catalog } from "../data";

export default defineTool({
  name: "recommend_hotels",
  title: "Recommend hotels",
  description: "Recommend top-rated StayVista hotels for a travel style (beach, city, mountain, nature, cultural, luxury).",
  inputSchema: {
    style: z.enum(["beach", "city", "mountain", "nature", "cultural", "luxury"]).describe("Preferred travel style."),
    limit: z.number().int().min(1).max(10).default(5),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ style, limit }) => {
    const bucket: Record<string, (c: typeof catalog[number]) => boolean> = {
      beach:    (c) => /Beach|Overwater|Lagoon/i.test(c.category + c.description),
      city:     (c) => /City Hotel|Boutique/i.test(c.category),
      mountain: (c) => /Mountain|Ski|Alpine|Patagonia/i.test(c.category + c.description),
      nature:   (c) => /Nature|Eco|Desert|Aurora|Amazon|Patagonia/i.test(c.category + c.description),
      cultural: (c) => /Ryokan|Riad|Château|Kyoto|Marrakech|Tuscan/i.test(c.category + c.name),
      luxury:   (c) => c.starRating === 5,
    };
    const picks = catalog
      .filter(bucket[style])
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
    return {
      content: [{ type: "text", text: `Top ${picks.length} ${style} pick(s).` }],
      structuredContent: { style, hotels: picks },
    };
  },
});
