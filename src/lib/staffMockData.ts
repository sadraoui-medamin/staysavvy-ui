// Mock data for StayVista Staff (Super Admin) dashboard

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  type: "client" | "partner";
  status: "active" | "suspended" | "pending";
  joinedAt: string;
  bookings?: number;
  properties?: number;
  country: string;
};

export type StaffProperty = {
  id: string;
  name: string;
  partner: string;
  city: string;
  country: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  submittedAt: string;
  rating?: number;
  rooms: number;
};

export type StaffBooking = {
  id: string;
  guest: string;
  hotel: string;
  checkIn: string;
  checkOut: string;
  total: number;
  status: "confirmed" | "checked_in" | "completed" | "cancelled" | "refund_pending";
  refundAmount?: number;
};

export type StaffLog = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  severity: "info" | "warning" | "critical";
  ip?: string;
};

export const staffKPIs = {
  totalUsers: 12847,
  totalPartners: 312,
  totalProperties: 1284,
  monthlyRevenue: 482300,
  pendingApprovals: 18,
  openRefunds: 7,
  activeBookings: 943,
  growth: 12.4,
};

export const mockUsers: StaffUser[] = [
  { id: "U-1001", name: "Sofia Martinez", email: "sofia.m@mail.com", type: "client", status: "active", joinedAt: "2025-11-04", bookings: 8, country: "Spain" },
  { id: "U-1002", name: "Liam Tanaka", email: "liam.t@mail.com", type: "client", status: "active", joinedAt: "2026-01-18", bookings: 3, country: "Japan" },
  { id: "P-2017", name: "Aurora Hotels Group", email: "ops@aurorahotels.com", type: "partner", status: "active", joinedAt: "2024-08-22", properties: 14, country: "France" },
  { id: "P-2018", name: "Sunset Riads", email: "contact@sunsetriads.ma", type: "partner", status: "pending", joinedAt: "2026-06-12", properties: 2, country: "Morocco" },
  { id: "U-1003", name: "Noah Becker", email: "noah.b@mail.com", type: "client", status: "suspended", joinedAt: "2025-03-09", bookings: 1, country: "Germany" },
  { id: "P-2019", name: "Coastal Stays Ltd.", email: "hello@coastalstays.com", type: "partner", status: "active", joinedAt: "2025-05-30", properties: 6, country: "Portugal" },
  { id: "U-1004", name: "Emma Dubois", email: "emma.d@mail.com", type: "client", status: "active", joinedAt: "2026-04-21", bookings: 12, country: "Belgium" },
  { id: "P-2020", name: "Nordic Lodges", email: "team@nordiclodges.no", type: "partner", status: "pending", joinedAt: "2026-06-19", properties: 1, country: "Norway" },
];

export const mockProperties: StaffProperty[] = [
  { id: "PR-501", name: "Riad Andalous", partner: "Sunset Riads", city: "Marrakech", country: "Morocco", status: "pending", submittedAt: "2026-06-18", rooms: 12 },
  { id: "PR-502", name: "Aurora Skyline Suite", partner: "Aurora Hotels Group", city: "Paris", country: "France", status: "approved", submittedAt: "2026-05-02", rating: 4.8, rooms: 86 },
  { id: "PR-503", name: "Fjord View Lodge", partner: "Nordic Lodges", city: "Bergen", country: "Norway", status: "pending", submittedAt: "2026-06-20", rooms: 8 },
  { id: "PR-504", name: "Lisbon Harbor Hotel", partner: "Coastal Stays Ltd.", city: "Lisbon", country: "Portugal", status: "flagged", submittedAt: "2026-04-14", rating: 3.1, rooms: 48 },
  { id: "PR-505", name: "Kyoto Ryokan Sakura", partner: "Aurora Hotels Group", city: "Kyoto", country: "Japan", status: "approved", submittedAt: "2026-03-30", rating: 4.9, rooms: 16 },
  { id: "PR-506", name: "Algarve Beach Villa", partner: "Coastal Stays Ltd.", city: "Faro", country: "Portugal", status: "rejected", submittedAt: "2026-06-09", rooms: 4 },
];

export const mockStaffBookings: StaffBooking[] = [
  { id: "BK-9001", guest: "Sofia Martinez", hotel: "Aurora Skyline Suite", checkIn: "2026-06-24", checkOut: "2026-06-28", total: 1240, status: "confirmed" },
  { id: "BK-9002", guest: "Emma Dubois", hotel: "Kyoto Ryokan Sakura", checkIn: "2026-06-19", checkOut: "2026-06-25", total: 2160, status: "checked_in" },
  { id: "BK-9003", guest: "Liam Tanaka", hotel: "Lisbon Harbor Hotel", checkIn: "2026-05-10", checkOut: "2026-05-15", total: 890, status: "refund_pending", refundAmount: 445 },
  { id: "BK-9004", guest: "Noah Becker", hotel: "Aurora Skyline Suite", checkIn: "2026-04-02", checkOut: "2026-04-05", total: 620, status: "completed" },
  { id: "BK-9005", guest: "Sofia Martinez", hotel: "Riad Andalous", checkIn: "2026-07-12", checkOut: "2026-07-18", total: 1430, status: "confirmed" },
  { id: "BK-9006", guest: "Emma Dubois", hotel: "Algarve Beach Villa", checkIn: "2026-05-28", checkOut: "2026-06-02", total: 980, status: "cancelled", refundAmount: 735 },
];

export const mockLogs: StaffLog[] = [
  { id: "L-7781", timestamp: "2026-06-22T09:42:11Z", actor: "admin@stayvista.com", action: "Approved property", target: "PR-502 Aurora Skyline Suite", severity: "info", ip: "82.14.221.10" },
  { id: "L-7780", timestamp: "2026-06-22T09:31:04Z", actor: "system", action: "Refund processed", target: "BK-9003 (€445)", severity: "info" },
  { id: "L-7779", timestamp: "2026-06-22T08:58:47Z", actor: "support@stayvista.com", action: "Suspended user", target: "U-1003 Noah Becker", severity: "warning", ip: "82.14.221.45" },
  { id: "L-7778", timestamp: "2026-06-22T08:12:22Z", actor: "system", action: "Failed login attempt (5x)", target: "ops@aurorahotels.com", severity: "critical", ip: "194.34.12.88" },
  { id: "L-7777", timestamp: "2026-06-22T07:44:09Z", actor: "admin@stayvista.com", action: "Flagged property", target: "PR-504 Lisbon Harbor Hotel", severity: "warning" },
  { id: "L-7776", timestamp: "2026-06-22T07:21:55Z", actor: "system", action: "New partner registered", target: "Nordic Lodges (P-2020)", severity: "info" },
  { id: "L-7775", timestamp: "2026-06-21T22:14:30Z", actor: "finance@stayvista.com", action: "Payout released", target: "Aurora Hotels Group €18,420", severity: "info" },
  { id: "L-7774", timestamp: "2026-06-21T19:02:11Z", actor: "system", action: "Rate-limit triggered", target: "/api/search (IP 41.92.10.7)", severity: "warning", ip: "41.92.10.7" },
  { id: "L-7773", timestamp: "2026-06-21T16:47:00Z", actor: "admin@stayvista.com", action: "Updated cancellation policy", target: "Global settings", severity: "info" },
  { id: "L-7772", timestamp: "2026-06-21T14:08:43Z", actor: "system", action: "Database backup completed", target: "prod-eu-west-1", severity: "info" },
];

export const revenueSeries = [
  { month: "Jan", revenue: 312000, bookings: 612 },
  { month: "Feb", revenue: 358000, bookings: 701 },
  { month: "Mar", revenue: 401000, bookings: 798 },
  { month: "Apr", revenue: 388000, bookings: 770 },
  { month: "May", revenue: 442000, bookings: 880 },
  { month: "Jun", revenue: 482300, bookings: 943 },
];
