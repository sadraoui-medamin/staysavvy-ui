import { defineMcp } from "@lovable.dev/mcp-js";
import searchHotels from "./tools/search-hotels";
import getHotel from "./tools/get-hotel";
import listDestinations from "./tools/list-destinations";
import recommendHotels from "./tools/recommend-hotels";

export default defineMcp({
  name: "stayvista-mcp",
  title: "StayVista MCP",
  version: "0.1.0",
  instructions:
    "Public catalog tools for StayVista, a luxury hotel booking platform. Use `search_hotels` to filter by destination, category, star rating, or price. Use `get_hotel` for full details of a single property. Use `list_destinations` to see all featured destinations, and `recommend_hotels` to suggest properties for a travel style (beach, city, mountain, nature, cultural, luxury). All data is public catalog information — no bookings or user data are exposed.",
  tools: [searchHotels, getHotel, listDestinations, recommendHotels],
});
