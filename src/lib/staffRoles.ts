// StayVista Staff — roles, permissions & demo accounts
import { createContext, useContext } from "react";

export type StaffRole =
  | "super_admin"
  | "admin"
  | "revenue_manager"
  | "accountant"
  | "support";

export type Permission =
  | "overview.view"
  | "users.view"
  | "users.manage"
  | "properties.view"
  | "properties.moderate"
  | "bookings.view"
  | "bookings.cancel"
  | "refunds.process"
  | "finance.view"
  | "finance.payout"
  | "reports.view"
  | "logs.view"
  | "team.view"
  | "team.manage"
  | "support.view"
  | "support.handle"
  | "notifications.view";

export type RoleDef = {
  key: StaffRole;
  label: string;
  description: string;
  color: string;          // tailwind class fragments for badges
  initials: string;
  permissions: Permission[];
};

export const ROLES: Record<StaffRole, RoleDef> = {
  super_admin: {
    key: "super_admin",
    label: "Super Admin",
    description: "Owner — full control across every module.",
    color: "bg-accent/15 text-accent border-accent/40",
    initials: "SA",
    permissions: [
      "overview.view","users.view","users.manage","properties.view","properties.moderate",
      "bookings.view","bookings.cancel","refunds.process","finance.view","finance.payout",
      "reports.view","logs.view","team.view","team.manage",
      "support.view","support.handle","notifications.view",
    ],
  },
  admin: {
    key: "admin",
    label: "Admin",
    description: "Controls day-to-day requests, users & content moderation.",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    initials: "AD",
    permissions: [
      "overview.view","users.view","users.manage","properties.view","properties.moderate",
      "bookings.view","bookings.cancel","reports.view","logs.view","team.view",
      "support.view","support.handle","notifications.view",
    ],
  },
  revenue_manager: {
    key: "revenue_manager",
    label: "Revenue Manager",
    description: "Owns pricing, performance and revenue analytics.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    initials: "RM",
    permissions: [
      "overview.view","properties.view","bookings.view","finance.view","reports.view",
      "notifications.view",
    ],
  },
  accountant: {
    key: "accountant",
    label: "Accountant",
    description: "Finance team — payouts, refunds and ledger.",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    initials: "AC",
    permissions: [
      "overview.view","bookings.view","refunds.process","finance.view","finance.payout","reports.view","logs.view",
      "support.view","notifications.view",
    ],
  },
  support: {
    key: "support",
    label: "Support",
    description: "First-line agent — assists guests & partners.",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    initials: "SP",
    permissions: [
      "overview.view","users.view","properties.view","bookings.view","reports.view",
      "support.view","support.handle","notifications.view",
    ],
  },
};

export const ROLE_LIST: RoleDef[] = Object.values(ROLES);

// Demo staff identities — used by AuthModal and the in-app role switcher.
export type StaffIdentity = { name: string; email: string; role: StaffRole };

export const STAFF_DIRECTORY: StaffIdentity[] = [
  { name: "Alex Reyes",      email: "superadmin@stayvista.com", role: "super_admin"     },
  { name: "Priya Shah",      email: "admin@stayvista.com",      role: "admin"           },
  { name: "Marco Bianchi",   email: "revenue@stayvista.com",    role: "revenue_manager" },
  { name: "Lina Khoury",     email: "finance@stayvista.com",    role: "accountant"      },
  { name: "Tomás Oliveira",  email: "support@stayvista.com",    role: "support"         },
];

const STORAGE_KEY = "stayvista_staff_identity";

export function resolveIdentityFromEmail(email: string): StaffIdentity | null {
  const v = email.trim().toLowerCase();
  if (!v.endsWith("@stayvista.com")) return null;
  const match = STAFF_DIRECTORY.find((s) => s.email === v);
  if (match) return match;
  // any other @stayvista.com address logs in as super admin demo
  return STAFF_DIRECTORY[0];
}

export function loadIdentity(): StaffIdentity {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StaffIdentity;
      if (parsed && ROLES[parsed.role]) return parsed;
    }
  } catch {}
  return STAFF_DIRECTORY[0];
}

export function saveIdentity(id: StaffIdentity) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(id)); } catch {}
}

// React context for the active staff identity + permission helper.
type Ctx = {
  identity: StaffIdentity;
  role: RoleDef;
  setIdentity: (id: StaffIdentity) => void;
  can: (p: Permission) => boolean;
};

export const StaffAuthContext = createContext<Ctx | null>(null);

export function useStaffAuth(): Ctx {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error("useStaffAuth must be used inside StaffAuthContext.Provider");
  return ctx;
}
