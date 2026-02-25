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
    description: "Perched on the iconic caldera cliffs of Santorini, The Grand Azure Resort offers breathtaking panoramic views of the Aegean Sea. Each suite features private terraces, infinity-edge plunge pools, and authentic Cycladic architecture blended with contemporary luxury. Experience world-class dining, rejuvenating spa treatments, and unforgettable sunsets that paint the sky in shades of gold and amber.",
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
      { id: "rv1", author: "Sarah M.", avatar: "SM", rating: 5, date: "Jan 2026", comment: "Absolutely stunning property! The views from our suite were breathtaking. Staff was incredibly attentive and the spa was heavenly." },
      { id: "rv2", author: "James L.", avatar: "JL", rating: 5, date: "Dec 2025", comment: "Best hotel experience we've ever had. The sunset dinner on the terrace was magical. Worth every penny." },
      { id: "rv3", author: "Emma R.", avatar: "ER", rating: 4, date: "Nov 2025", comment: "Beautiful resort with amazing amenities. The pool area was fantastic. Only minor issue was the long wait for room service." },
    ],
  },
  {
    id: "2",
    name: "Château Lumière Palace",
    location: "Paris, France",
    description: "A magnificent 19th-century palace hotel in the heart of Paris, Château Lumière combines timeless French elegance with modern luxury. Steps away from the Champs-Élysées, this grand establishment features Michelin-starred dining, an opulent spa, and rooms adorned with antique furnishings and contemporary art.",
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
      { id: "rv5", author: "Olivia P.", avatar: "OP", rating: 4, date: "Jan 2026", comment: "Wonderful location and impeccable service. The restaurant deserves its Michelin star." },
    ],
  },
  {
    id: "3",
    name: "Palm Oasis Beach Resort",
    location: "Maldives",
    description: "Escape to paradise at Palm Oasis, where crystal-clear turquoise waters meet pristine white sand beaches. Our overwater bungalows offer direct lagoon access, glass-floor panels, and unmatched privacy. Dive into vibrant coral reefs, enjoy sunset dolphin cruises, and dine under the stars at our underwater restaurant.",
    price: 599,
    rating: 4.9,
    reviews: 1856,
    image: hotel3,
    images: [hotel3, dest1, hotel2, hotel5],
    amenities: ["Free WiFi", "Private Beach", "Diving Center", "Spa", "3 Restaurants", "Bar", "Water Sports", "Yoga Pavilion"],
    rooms: [
      { id: "r7", name: "Beach Villa", price: 599, capacity: 2, beds: "1 King Bed", size: "55 m²", amenities: ["Beach Access", "Outdoor Shower", "Deck"] },
      { id: "r8", name: "Overwater Bungalow", price: 849, capacity: 2, beds: "1 King Bed", size: "70 m²", amenities: ["Glass Floor", "Lagoon Access", "Sunset Deck", "Jacuzzi"] },
      { id: "r9", name: "Two-Bedroom Ocean Pavilion", price: 1450, capacity: 6, beds: "2 King + 2 Single", size: "200 m²", amenities: ["Private Pool", "Kitchen", "Butler", "Boat"] },
    ],
    reviewsList: [
      { id: "rv6", author: "David K.", avatar: "DK", rating: 5, date: "Feb 2026", comment: "Paradise found! The overwater bungalow was incredible. Snorkeling right off our deck was magical." },
    ],
  },
  {
    id: "4",
    name: "Skyline Metropolitan Hotel",
    location: "Dubai, UAE",
    description: "Rising above the dazzling Dubai skyline, the Skyline Metropolitan is a beacon of modern luxury. Featuring a rooftop infinity pool with panoramic city views, award-winning restaurants, and sleek contemporary design, this hotel offers an unparalleled urban retreat.",
    price: 289,
    rating: 4.7,
    reviews: 4102,
    image: hotel4,
    images: [hotel4, dest3, hotel1, hotel2],
    amenities: ["Free WiFi", "Rooftop Pool", "Spa", "5 Restaurants", "Sky Bar", "Gym", "Business Center", "Shopping Arcade"],
    rooms: [
      { id: "r10", name: "Skyline Deluxe Room", price: 289, capacity: 2, beds: "1 King Bed", size: "40 m²", amenities: ["City View", "Rain Shower", "Smart TV"] },
      { id: "r11", name: "Sky Suite", price: 520, capacity: 2, beds: "1 King Bed", size: "75 m²", amenities: ["Panoramic View", "Lounge", "Jacuzzi", "Mini Bar"] },
    ],
    reviewsList: [
      { id: "rv7", author: "Aisha N.", avatar: "AN", rating: 5, date: "Jan 2026", comment: "The rooftop pool and sky bar are worth the stay alone. Spectacular city views!" },
      { id: "rv8", author: "Tom W.", avatar: "TW", rating: 4, date: "Dec 2025", comment: "Great location, modern rooms, excellent service. Would definitely return." },
    ],
  },
  {
    id: "5",
    name: "Alpine Serenity Lodge",
    location: "Zermatt, Switzerland",
    description: "Nestled in the shadow of the majestic Matterhorn, Alpine Serenity Lodge is a haven of mountain tranquility. Warm timber interiors, crackling fireplaces, and gourmet Alpine cuisine create the perfect mountain escape. Ski-in/ski-out access to world-class slopes.",
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
      { id: "rv9", author: "Klaus H.", avatar: "KH", rating: 5, date: "Feb 2026", comment: "The most charming mountain hotel I've ever stayed at. Perfect for ski holidays!" },
    ],
  },
  {
    id: "6",
    name: "The Royal Majestic",
    location: "London, UK",
    description: "An iconic luxury hotel in the heart of Mayfair, The Royal Majestic has been welcoming discerning travelers since 1890. Exquisite interiors, afternoon tea traditions, and a world-class spa make this a quintessentially British experience.",
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
  },
];
