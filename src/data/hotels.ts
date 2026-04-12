import hotel1 from "@/assets/hotel-1.jpg";
import hotel2 from "@/assets/hotel-2.jpg";
import hotel3 from "@/assets/hotel-3.jpg";
import hotel4 from "@/assets/hotel-4.jpg";
import hotel5 from "@/assets/hotel-5.jpg";
import dest1 from "@/assets/dest-1.jpg";
import dest2 from "@/assets/dest-2.jpg";
import dest3 from "@/assets/dest-3.jpg";

export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  amenities: string[];
  category: string;
  starRating: number;
  rooms: Room[];
  reviewsList: Review[];
}

export interface Room {
  id: string;
  name: string;
  price: number;
  capacity: number;
  beds: string;
  size: string;
  amenities: string[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  hotels: number;
}

export interface Booking {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  total: number;
  status: "confirmed" | "upcoming" | "completed" | "cancelled";
  image: string;
  paymentMethod?: string;
  confirmationCode?: string;
  refundAmount?: number;
  refundStatus?: "none" | "pending" | "processed" | "denied";
  cancelledAt?: string;
}

export const destinations: Destination[] = [
  { id: "1", name: "Santorini", country: "Greece", image: dest1, hotels: 342 },
  { id: "2", name: "Paris", country: "France", image: dest2, hotels: 1205 },
  { id: "3", name: "Dubai", country: "UAE", image: dest3, hotels: 876 },
  { id: "4", name: "Maldives", country: "Maldives", image: hotel3, hotels: 198 },
];

export const hotels: Hotel[] = [
  {
    id: "1",
    name: "The Grand Azure Resort & Spa",
    location: "Santorini, Greece",
    category: "Luxury Resort",
    starRating: 5,
    description: "Perched on the iconic caldera cliffs of Santorini, The Grand Azure Resort offers breathtaking panoramic views of the Aegean Sea. Each suite features private terraces, infinity-edge plunge pools, and authentic Cycladic architecture blended with contemporary luxury.",
    price: 349,
    rating: 4.9,
    reviews: 2847,
    image: dest1,
    images: [dest1, hotel2, hotel1, hotel3],
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Bar", "Room Service", "Gym", "Parking", "Airport Shuttle", "Concierge"],
    rooms: [
      { id: "r1", name: "Deluxe Sea View Suite", price: 349, capacity: 2, beds: "1 King Bed", size: "45 m²", amenities: ["Sea View", "Balcony", "Mini Bar", "Rain Shower"] },
      { id: "r2", name: "Premium Pool Villa", price: 529, capacity: 2, beds: "1 King Bed", size: "65 m²", amenities: ["Private Pool", "Terrace", "Jacuzzi", "Butler Service"] },
      { id: "r3", name: "Royal Penthouse Suite", price: 899, capacity: 4, beds: "2 King Beds", size: "120 m²", amenities: ["Panoramic View", "Private Pool", "Kitchen", "Living Room"] },
    ],
    reviewsList: [
      { id: "rv1", author: "Sarah M.", avatar: "SM", rating: 5, date: "Jan 2026", comment: "Absolutely stunning property! The views from our suite were breathtaking." },
      { id: "rv2", author: "James L.", avatar: "JL", rating: 5, date: "Dec 2025", comment: "Best hotel experience we've ever had. The sunset dinner on the terrace was magical." },
      { id: "rv3", author: "Emma R.", avatar: "ER", rating: 4, date: "Nov 2025", comment: "Beautiful resort with amazing amenities. The pool area was fantastic." },
    ],
  },
  {
    id: "2",
    name: "Château Lumière Palace",
    location: "Paris, France",
    category: "City Hotel",
    starRating: 5,
    description: "A magnificent 19th-century palace hotel in the heart of Paris, Château Lumière combines timeless French elegance with modern luxury. Steps away from the Champs-Élysées.",
    price: 425,
    rating: 4.8,
    reviews: 3421,
    image: dest2,
    images: [dest2, hotel1, hotel2, hotel4],
    amenities: ["Free WiFi", "Spa", "Restaurant", "Bar", "Room Service", "Gym", "Valet Parking", "Concierge", "Business Center"],
    rooms: [
      { id: "r4", name: "Classic Parisian Room", price: 425, capacity: 2, beds: "1 Queen Bed", size: "35 m²", amenities: ["City View", "Marble Bath", "Nespresso Machine"] },
      { id: "r5", name: "Eiffel Tower Suite", price: 750, capacity: 2, beds: "1 King Bed", size: "55 m²", amenities: ["Eiffel View", "Lounge", "Champagne Bar", "Butler"] },
      { id: "r6", name: "Presidential Suite", price: 1200, capacity: 4, beds: "2 King Beds", size: "150 m²", amenities: ["Panoramic View", "Dining Room", "Study", "Private Terrace"] },
    ],
    reviewsList: [
      { id: "rv4", author: "Michael B.", avatar: "MB", rating: 5, date: "Feb 2026", comment: "Pure Parisian luxury! The Eiffel Tower suite was a dream come true." },
      { id: "rv5", author: "Olivia P.", avatar: "OP", rating: 4, date: "Jan 2026", comment: "Wonderful location and impeccable service." },
    ],
  },
  {
    id: "3",
    name: "Palm Oasis Beach Resort",
    location: "Maldives",
    category: "Beach Resort",
    starRating: 5,
    description: "Escape to paradise at Palm Oasis, where crystal-clear turquoise waters meet pristine white sand beaches. Our overwater bungalows offer direct lagoon access and unmatched privacy.",
    price: 599,
    rating: 4.9,
    reviews: 1856,
    image: hotel3,
    images: [hotel3, dest1, hotel2, hotel5],
    amenities: ["Free WiFi", "Private Beach", "Diving Center", "Spa", "Restaurant", "Bar", "Water Sports", "Yoga Pavilion"],
    rooms: [
      { id: "r7", name: "Beach Villa", price: 599, capacity: 2, beds: "1 King Bed", size: "55 m²", amenities: ["Beach Access", "Outdoor Shower", "Deck"] },
      { id: "r8", name: "Overwater Bungalow", price: 849, capacity: 2, beds: "1 King Bed", size: "70 m²", amenities: ["Glass Floor", "Lagoon Access", "Sunset Deck", "Jacuzzi"] },
      { id: "r9", name: "Two-Bedroom Ocean Pavilion", price: 1450, capacity: 6, beds: "2 King + 2 Single", size: "200 m²", amenities: ["Private Pool", "Kitchen", "Butler", "Boat"] },
    ],
    reviewsList: [
      { id: "rv6", author: "David K.", avatar: "DK", rating: 5, date: "Feb 2026", comment: "Paradise found! The overwater bungalow was incredible." },
    ],
  },
  {
    id: "4",
    name: "Skyline Metropolitan Hotel",
    location: "Dubai, UAE",
    category: "City Hotel",
    starRating: 5,
    description: "Rising above the dazzling Dubai skyline, the Skyline Metropolitan is a beacon of modern luxury with rooftop infinity pool and award-winning restaurants.",
    price: 289,
    rating: 4.7,
    reviews: 4102,
    image: hotel4,
    images: [hotel4, dest3, hotel1, hotel2],
    amenities: ["Free WiFi", "Rooftop Pool", "Spa", "Restaurant", "Bar", "Gym", "Business Center", "Shopping Arcade"],
    rooms: [
      { id: "r10", name: "Skyline Deluxe Room", price: 289, capacity: 2, beds: "1 King Bed", size: "40 m²", amenities: ["City View", "Rain Shower", "Smart TV"] },
      { id: "r11", name: "Sky Suite", price: 520, capacity: 2, beds: "1 King Bed", size: "75 m²", amenities: ["Panoramic View", "Lounge", "Jacuzzi", "Mini Bar"] },
    ],
    reviewsList: [
      { id: "rv7", author: "Aisha N.", avatar: "AN", rating: 5, date: "Jan 2026", comment: "The rooftop pool and sky bar are worth the stay alone." },
      { id: "rv8", author: "Tom W.", avatar: "TW", rating: 4, date: "Dec 2025", comment: "Great location, modern rooms, excellent service." },
    ],
  },
  {
    id: "5",
    name: "Alpine Serenity Lodge",
    location: "Zermatt, Switzerland",
    category: "Mountain Lodge",
    starRating: 4,
    description: "Nestled in the shadow of the majestic Matterhorn, Alpine Serenity Lodge is a haven of mountain tranquility with ski-in/ski-out access.",
    price: 375,
    rating: 4.8,
    reviews: 1543,
    image: hotel5,
    images: [hotel5, hotel1, hotel2, dest1],
    amenities: ["Free WiFi", "Ski Storage", "Spa", "Restaurant", "Fireplace Lounge", "Heated Pool", "Sauna", "Ski Rental"],
    rooms: [
      { id: "r12", name: "Mountain View Room", price: 375, capacity: 2, beds: "1 Queen Bed", size: "30 m²", amenities: ["Mountain View", "Balcony", "Fireplace"] },
      { id: "r13", name: "Chalet Suite", price: 620, capacity: 4, beds: "1 King + 2 Single", size: "80 m²", amenities: ["Panoramic View", "Living Room", "Kitchen", "Hot Tub"] },
    ],
    reviewsList: [
      { id: "rv9", author: "Klaus H.", avatar: "KH", rating: 5, date: "Feb 2026", comment: "The most charming mountain hotel I've ever stayed at." },
    ],
  },
  {
    id: "6",
    name: "The Royal Majestic",
    location: "London, UK",
    category: "Boutique Hotel",
    starRating: 5,
    description: "An iconic luxury hotel in the heart of Mayfair since 1890. Exquisite interiors, afternoon tea traditions, and a world-class spa.",
    price: 410,
    rating: 4.7,
    reviews: 5230,
    image: hotel1,
    images: [hotel1, hotel2, hotel4, dest2],
    amenities: ["Free WiFi", "Spa", "Restaurant", "Bar", "Afternoon Tea", "Gym", "Butler Service", "Concierge"],
    rooms: [
      { id: "r14", name: "Heritage Room", price: 410, capacity: 2, beds: "1 King Bed", size: "38 m²", amenities: ["Garden View", "Marble Bath", "Writing Desk"] },
      { id: "r15", name: "Royal Suite", price: 950, capacity: 2, beds: "1 King Bed", size: "90 m²", amenities: ["Park View", "Dining Room", "Dressing Room", "Butler"] },
    ],
    reviewsList: [
      { id: "rv10", author: "Catherine W.", avatar: "CW", rating: 5, date: "Jan 2026", comment: "Old-world charm meets modern luxury. The afternoon tea was sublime!" },
    ],
  },
  {
    id: "7",
    name: "Sakura Garden Ryokan",
    location: "Kyoto, Japan",
    category: "Boutique Hotel",
    starRating: 4,
    description: "A traditional Japanese ryokan surrounded by ancient cherry blossom gardens. Experience authentic tea ceremonies, onsen baths, and kaiseki cuisine in this serene retreat.",
    price: 320,
    rating: 4.9,
    reviews: 1120,
    image: hotel2,
    images: [hotel2, hotel1, hotel5, dest1],
    amenities: ["Free WiFi", "Onsen", "Restaurant", "Tea Room", "Garden", "Spa", "Cultural Activities", "Bicycle Rental"],
    rooms: [
      { id: "r16", name: "Traditional Tatami Room", price: 320, capacity: 2, beds: "Futon Bedding", size: "28 m²", amenities: ["Garden View", "Private Onsen", "Tea Set"] },
      { id: "r17", name: "Premium Suite with Garden", price: 550, capacity: 3, beds: "Futon + Western Bed", size: "55 m²", amenities: ["Private Garden", "Onsen Bath", "Living Area", "Mini Kitchen"] },
    ],
    reviewsList: [
      { id: "rv11", author: "Yuki T.", avatar: "YT", rating: 5, date: "Mar 2026", comment: "An absolutely magical experience. The onsen at sunrise was unforgettable." },
      { id: "rv12", author: "Robert S.", avatar: "RS", rating: 5, date: "Feb 2026", comment: "True Japanese hospitality at its finest." },
    ],
  },
  {
    id: "8",
    name: "Costa Brava Wellness Resort",
    location: "Barcelona, Spain",
    category: "Spa & Wellness",
    starRating: 5,
    description: "A Mediterranean wellness sanctuary overlooking the Costa Brava coastline. Holistic treatments, organic cuisine, and panoramic sea views define this rejuvenating escape.",
    price: 295,
    rating: 4.6,
    reviews: 2340,
    image: dest3,
    images: [dest3, hotel4, hotel2, dest1],
    amenities: ["Free WiFi", "Spa", "Pool", "Restaurant", "Yoga Studio", "Gym", "Beach Access", "Meditation Garden", "Sauna"],
    rooms: [
      { id: "r18", name: "Wellness Standard", price: 295, capacity: 2, beds: "1 Queen Bed", size: "32 m²", amenities: ["Sea View", "Balcony", "Aromatherapy Kit"] },
      { id: "r19", name: "Spa Suite", price: 480, capacity: 2, beds: "1 King Bed", size: "60 m²", amenities: ["In-Room Jacuzzi", "Terrace", "Meditation Space", "Rain Shower"] },
    ],
    reviewsList: [
      { id: "rv13", author: "Maria G.", avatar: "MG", rating: 5, date: "Jan 2026", comment: "Left feeling completely renewed. The spa treatments were exceptional." },
    ],
  },
  {
    id: "9",
    name: "Safari Luxe Tented Camp",
    location: "Serengeti, Tanzania",
    category: "Luxury Resort",
    starRating: 5,
    description: "An ultra-luxury tented camp in the heart of the Serengeti. Wake up to wildlife at your doorstep, enjoy bush dinners under the Milky Way, and experience guided game drives.",
    price: 780,
    rating: 4.9,
    reviews: 680,
    image: hotel5,
    images: [hotel5, hotel3, dest3, hotel1],
    amenities: ["Free WiFi", "Restaurant", "Bar", "Game Drives", "Bush Dinners", "Pool", "Spa", "Stargazing Deck"],
    rooms: [
      { id: "r20", name: "Luxury Safari Tent", price: 780, capacity: 2, beds: "1 King Bed", size: "50 m²", amenities: ["Wildlife View", "Outdoor Shower", "Private Deck", "Mini Bar"] },
      { id: "r21", name: "Family Safari Pavilion", price: 1200, capacity: 5, beds: "1 King + 3 Single", size: "110 m²", amenities: ["Panoramic View", "Lounge", "Private Guide", "Plunge Pool"] },
    ],
    reviewsList: [
      { id: "rv14", author: "Peter O.", avatar: "PO", rating: 5, date: "Feb 2026", comment: "Once in a lifetime experience. Saw the Big Five from our tent!" },
    ],
  },
  {
    id: "10",
    name: "Northern Lights Arctic Lodge",
    location: "Tromsø, Norway",
    category: "Mountain Lodge",
    starRating: 4,
    description: "A stunning Arctic lodge offering front-row seats to the Northern Lights. Glass-roofed cabins, husky sledding, and authentic Scandinavian cuisine.",
    price: 450,
    rating: 4.8,
    reviews: 920,
    image: hotel1,
    images: [hotel1, hotel5, hotel3, dest1],
    amenities: ["Free WiFi", "Restaurant", "Bar", "Sauna", "Husky Sledding", "Snowmobile Tours", "Aurora Alerts", "Heated Pool"],
    rooms: [
      { id: "r22", name: "Aurora Glass Cabin", price: 450, capacity: 2, beds: "1 King Bed", size: "35 m²", amenities: ["Glass Ceiling", "Heated Floor", "Binoculars", "Hot Chocolate Station"] },
      { id: "r23", name: "Arctic Family Lodge", price: 720, capacity: 4, beds: "2 Queen Beds", size: "70 m²", amenities: ["Mountain View", "Fireplace", "Kitchen", "Private Sauna"] },
    ],
    reviewsList: [
      { id: "rv15", author: "Ingrid F.", avatar: "IF", rating: 5, date: "Mar 2026", comment: "Watching the aurora from our glass cabin was a dream come true." },
    ],
  },
  {
    id: "11",
    name: "Riviera Pearl Hotel & Beach Club",
    location: "Nice, France",
    category: "Beach Resort",
    starRating: 4,
    description: "An elegant beachfront hotel on the French Riviera with a private beach club, Mediterranean cuisine, and rooms overlooking the turquoise Côte d'Azur.",
    price: 310,
    rating: 4.5,
    reviews: 1890,
    image: dest2,
    images: [dest2, hotel4, hotel2, dest1],
    amenities: ["Free WiFi", "Private Beach", "Pool", "Restaurant", "Bar", "Spa", "Water Sports", "Parking"],
    rooms: [
      { id: "r24", name: "Sea View Classic", price: 310, capacity: 2, beds: "1 Queen Bed", size: "30 m²", amenities: ["Sea View", "Balcony", "Mini Fridge"] },
      { id: "r25", name: "Penthouse with Terrace", price: 590, capacity: 3, beds: "1 King Bed", size: "75 m²", amenities: ["Panoramic View", "Private Terrace", "Jacuzzi", "Lounge"] },
    ],
    reviewsList: [
      { id: "rv16", author: "Sophie D.", avatar: "SD", rating: 4, date: "Jan 2026", comment: "Beautiful beach and great food. The sunset cocktails were perfect." },
    ],
  },
  {
    id: "12",
    name: "Bali Harmony Villas",
    location: "Bali, Indonesia",
    category: "Spa & Wellness",
    starRating: 5,
    description: "Private luxury villas set among rice terraces and tropical gardens in Ubud. Balinese spa rituals, farm-to-table dining, and yoga retreats await.",
    price: 260,
    rating: 4.8,
    reviews: 2100,
    image: hotel3,
    images: [hotel3, hotel2, dest3, hotel5],
    amenities: ["Free WiFi", "Private Pool", "Spa", "Restaurant", "Yoga Studio", "Cooking Class", "Bicycle Rental", "Garden"],
    rooms: [
      { id: "r26", name: "Garden Pool Villa", price: 260, capacity: 2, beds: "1 King Bed", size: "80 m²", amenities: ["Private Pool", "Garden View", "Outdoor Bath", "Daybed"] },
      { id: "r27", name: "Royal Rice Terrace Villa", price: 420, capacity: 4, beds: "2 King Beds", size: "150 m²", amenities: ["Infinity Pool", "Rice Terrace View", "Kitchen", "Butler Service"] },
    ],
    reviewsList: [
      { id: "rv17", author: "Amanda L.", avatar: "AL", rating: 5, date: "Feb 2026", comment: "A spiritual escape. The spa and yoga sessions were transformative." },
    ],
  },
];

export const myBookings: Booking[] = [
  {
    id: "b1",
    hotelName: "The Grand Azure Resort & Spa",
    location: "Santorini, Greece",
    checkIn: "2026-03-15",
    checkOut: "2026-03-20",
    guests: 2,
    rooms: 1,
    total: 1745,
    status: "upcoming",
    image: dest1,
    paymentMethod: "Visa •••• 4242",
    confirmationCode: "SV-AZ8K3N",
    refundStatus: "none",
  },
  {
    id: "b2",
    hotelName: "Château Lumière Palace",
    location: "Paris, France",
    checkIn: "2026-01-10",
    checkOut: "2026-01-14",
    guests: 2,
    rooms: 1,
    total: 1700,
    status: "completed",
    image: dest2,
    paymentMethod: "Mastercard •••• 5555",
    confirmationCode: "SV-CL2M7P",
    refundStatus: "none",
  },
  {
    id: "b3",
    hotelName: "Alpine Serenity Lodge",
    location: "Zermatt, Switzerland",
    checkIn: "2026-04-05",
    checkOut: "2026-04-10",
    guests: 4,
    rooms: 1,
    total: 3100,
    status: "confirmed",
    image: hotel5,
    paymentMethod: "Visa •••• 4242",
    confirmationCode: "SV-AL9F2X",
    refundStatus: "none",
  },
  {
    id: "b4",
    hotelName: "Sakura Garden Ryokan",
    location: "Kyoto, Japan",
    checkIn: "2026-05-01",
    checkOut: "2026-05-05",
    guests: 2,
    rooms: 1,
    total: 1280,
    status: "confirmed",
    image: hotel2,
    paymentMethod: "Visa •••• 4242",
    confirmationCode: "SV-SG4R1K",
    refundStatus: "none",
  },
];
