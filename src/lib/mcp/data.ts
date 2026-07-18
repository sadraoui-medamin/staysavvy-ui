// Public, asset-free hotel catalog for the MCP server. Keep in sync with
// src/data/hotels.ts (image imports omitted so this file is safe to bundle
// into the Deno Edge Function).

export type McpHotel = {
  id: string;
  name: string;
  location: string;
  category: string;
  starRating: number;
  description: string;
  priceFromUsd: number;
  rating: number;
  reviews: number;
  amenities: string[];
};

export const catalog: McpHotel[] = [
  { id: "1", name: "The Grand Azure Resort & Spa", location: "Santorini, Greece", category: "Luxury Resort", starRating: 5, description: "Caldera-cliff suites with private plunge pools and panoramic Aegean views.", priceFromUsd: 349, rating: 4.9, reviews: 2847, amenities: ["Pool","Spa","Restaurant","Bar","Gym","Concierge"] },
  { id: "2", name: "Château Lumière Palace", location: "Paris, France", category: "City Hotel", starRating: 5, description: "19th-century palace hotel steps from the Champs-Élysées.", priceFromUsd: 425, rating: 4.8, reviews: 3421, amenities: ["Spa","Restaurant","Bar","Gym","Valet","Concierge"] },
  { id: "3", name: "Palm Oasis Beach Resort", location: "Maldives", category: "Beach Resort", starRating: 5, description: "Overwater bungalows with direct lagoon access.", priceFromUsd: 599, rating: 4.9, reviews: 1856, amenities: ["Private Beach","Diving","Spa","Water Sports"] },
  { id: "4", name: "Skyline Metropolitan Hotel", location: "Dubai, UAE", category: "City Hotel", starRating: 5, description: "Rooftop infinity pool above the Dubai skyline.", priceFromUsd: 289, rating: 4.7, reviews: 4102, amenities: ["Rooftop Pool","Spa","Restaurant","Gym"] },
  { id: "5", name: "Alpine Serenity Lodge", location: "Zermatt, Switzerland", category: "Mountain Lodge", starRating: 4, description: "Ski-in/ski-out lodge beneath the Matterhorn.", priceFromUsd: 375, rating: 4.8, reviews: 1543, amenities: ["Ski Storage","Spa","Sauna","Heated Pool"] },
  { id: "6", name: "The Royal Majestic", location: "London, UK", category: "Boutique Hotel", starRating: 5, description: "Elegant Mayfair boutique with afternoon tea and butler service.", priceFromUsd: 460, rating: 4.8, reviews: 2210, amenities: ["Restaurant","Bar","Spa","Concierge"] },
  { id: "7", name: "Kyoto Garden Ryokan", location: "Kyoto, Japan", category: "Ryokan", starRating: 5, description: "Traditional tatami suites with private onsen and kaiseki dining.", priceFromUsd: 410, rating: 4.9, reviews: 987, amenities: ["Onsen","Restaurant","Garden","Tea Ceremony"] },
  { id: "8", name: "Copacabana Sun Tower", location: "Rio de Janeiro, Brazil", category: "Beach Resort", starRating: 4, description: "Beachfront tower overlooking Copacabana with samba nightlife.", priceFromUsd: 220, rating: 4.6, reviews: 1780, amenities: ["Pool","Beach","Bar","Gym"] },
  { id: "9", name: "Aurora Ice Retreat", location: "Reykjavík, Iceland", category: "Nature Lodge", starRating: 4, description: "Glass-roof cabins for northern-lights viewing.", priceFromUsd: 520, rating: 4.9, reviews: 640, amenities: ["Hot Springs","Restaurant","Aurora Tours"] },
  { id: "10", name: "Sahara Mirage Camp", location: "Merzouga, Morocco", category: "Desert Camp", starRating: 4, description: "Luxury Berber tents deep in the Erg Chebbi dunes.", priceFromUsd: 310, rating: 4.8, reviews: 512, amenities: ["Camel Trek","Stargazing","Restaurant"] },
  { id: "11", name: "Amazon Canopy Eco-Lodge", location: "Manaus, Brazil", category: "Eco Lodge", starRating: 4, description: "Treetop cabins with guided rainforest expeditions.", priceFromUsd: 275, rating: 4.7, reviews: 430, amenities: ["Guided Tours","Restaurant","Kayaks"] },
  { id: "12", name: "Bora Bora Pearl Lagoon", location: "Bora Bora, French Polynesia", category: "Beach Resort", starRating: 5, description: "Iconic overwater villas above a turquoise lagoon.", priceFromUsd: 890, rating: 4.9, reviews: 1120, amenities: ["Overwater Villa","Spa","Diving","Bar"] },
  { id: "13", name: "Tuscan Vineyard Estate", location: "Tuscany, Italy", category: "Countryside Villa", starRating: 5, description: "Restored 16th-century villa amid working vineyards.", priceFromUsd: 395, rating: 4.9, reviews: 720, amenities: ["Wine Tasting","Pool","Restaurant"] },
  { id: "14", name: "Manhattan Skyline Tower", location: "New York, USA", category: "City Hotel", starRating: 5, description: "Midtown tower with Central Park views and rooftop bar.", priceFromUsd: 510, rating: 4.7, reviews: 3300, amenities: ["Gym","Bar","Restaurant","Business Center"] },
  { id: "15", name: "Patagonia Wilderness Retreat", location: "Torres del Paine, Chile", category: "Nature Lodge", starRating: 4, description: "All-inclusive lodge with guided treks in Torres del Paine.", priceFromUsd: 640, rating: 4.9, reviews: 380, amenities: ["Guided Hikes","Spa","Restaurant"] },
  { id: "16", name: "Marrakech Riad Mirage", location: "Marrakech, Morocco", category: "Riad", starRating: 5, description: "Historic riad in the medina with rooftop hammam.", priceFromUsd: 260, rating: 4.8, reviews: 890, amenities: ["Hammam","Pool","Restaurant","Rooftop"] },
];

export const destinations = [
  { name: "Santorini, Greece", hotels: 1 },
  { name: "Paris, France", hotels: 1 },
  { name: "Maldives", hotels: 1 },
  { name: "Dubai, UAE", hotels: 1 },
  { name: "Zermatt, Switzerland", hotels: 1 },
  { name: "London, UK", hotels: 1 },
  { name: "Kyoto, Japan", hotels: 1 },
  { name: "Rio de Janeiro, Brazil", hotels: 1 },
  { name: "Reykjavík, Iceland", hotels: 1 },
  { name: "Merzouga, Morocco", hotels: 1 },
  { name: "Manaus, Brazil", hotels: 1 },
  { name: "Bora Bora, French Polynesia", hotels: 1 },
  { name: "Tuscany, Italy", hotels: 1 },
  { name: "New York, USA", hotels: 1 },
  { name: "Torres del Paine, Chile", hotels: 1 },
  { name: "Marrakech, Morocco", hotels: 1 },
];
