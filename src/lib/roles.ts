export type RoleKey =
  | "super_admin"
  | "revenue_manager"
  | "receptionist"
  | "guest_relations"
  | "housekeeping_lead"
  | "room_attendant"
  | "maintenance"
  | "fb_manager"
  | "accountant"
  | "security";

export interface RoleDefinition {
  key: RoleKey;
  label: string;
  shortLabel: string;
  description: string;
  navItems: string[];
  color: string;
  initials: string;
}

export const ROLES: Record<RoleKey, RoleDefinition> = {
  super_admin: {
    key: "super_admin",
    label: "General Manager (Super Admin)",
    shortLabel: "Super Admin",
    description: "Full oversight of the hotel, strategic decisions, system configuration",
    navItems: ["overview", "bookings", "properties", "reports", "team", "settings"],
    color: "from-violet-500 to-purple-600",
    initials: "GM",
  },
  revenue_manager: {
    key: "revenue_manager",
    label: "Revenue Manager",
    shortLabel: "Revenue",
    description: "Maximize profits via rate control, promotions, and occupancy analysis",
    navItems: ["revenue", "reports"],
    color: "from-emerald-500 to-teal-600",
    initials: "RM",
  },
  receptionist: {
    key: "receptionist",
    label: "Receptionist (Front Office)",
    shortLabel: "Front Office",
    description: "Check-in/out, walk-in bookings, ID data, invoices, payments",
    navItems: ["frontdesk"],
    color: "from-blue-500 to-cyan-600",
    initials: "RX",
  },
  guest_relations: {
    key: "guest_relations",
    label: "Guest Relations (Concierge)",
    shortLabel: "Concierge",
    description: "Guest profiles, preferences, special requests, complaints",
    navItems: ["guests"],
    color: "from-pink-500 to-rose-600",
    initials: "GR",
  },
  housekeeping_lead: {
    key: "housekeeping_lead",
    label: "Housekeeping Supervisor",
    shortLabel: "Housekeeping",
    description: "Room status board, task assignment, inventory management",
    navItems: ["housekeeping"],
    color: "from-amber-500 to-orange-600",
    initials: "HK",
  },
  room_attendant: {
    key: "room_attendant",
    label: "Room Attendant (Cleaner)",
    shortLabel: "Attendant",
    description: "View assigned rooms, start/finish cleaning, update room status",
    navItems: ["cleaning"],
    color: "from-lime-500 to-green-600",
    initials: "RA",
  },
  maintenance: {
    key: "maintenance",
    label: "Maintenance Technician",
    shortLabel: "Maintenance",
    description: "Receive tickets, update repair status, upload before/after photos",
    navItems: ["maintenance"],
    color: "from-slate-500 to-gray-600",
    initials: "MT",
  },
  fb_manager: {
    key: "fb_manager",
    label: "F&B / Kitchen Manager",
    shortLabel: "F&B",
    description: "Digital menu, room service orders, bill linking",
    navItems: ["fnb"],
    color: "from-red-500 to-orange-600",
    initials: "FB",
  },
  accountant: {
    key: "accountant",
    label: "Accountant (Finance)",
    shortLabel: "Finance",
    description: "Daily sales, voucher auditing, shift closures, data exports",
    navItems: ["finance"],
    color: "from-indigo-500 to-blue-600",
    initials: "AC",
  },
  security: {
    key: "security",
    label: "Security Officer",
    shortLabel: "Security",
    description: "Access logs, incident reporting, occupancy list, emergencies",
    navItems: ["security"],
    color: "from-gray-700 to-slate-800",
    initials: "SO",
  },
};

export const ALL_ROLES = Object.values(ROLES);
