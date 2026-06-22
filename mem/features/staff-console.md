---
name: StayVista Staff Console
description: Hidden /staff Super Admin dashboard with Users/Properties/Bookings/Reports modules
type: feature
---
Hidden route `/staff` rendered by `src/pages/StaffDashboard.tsx`. Access entry: AuthModal redirects to `/staff` when email ends with `@stayvista.com`. Modules: Overview (KPIs + revenue area chart + recent logs + View all logs CTA), Users & Partners (search, type/status filter dropdown, suspend/activate), Properties moderation (approve/reject/flag), Bookings & Refunds (force-cancel, refund), Reports & Logs (bookings bar chart + full audit log with severity filter). Mock data lives in `src/lib/staffMockData.ts`. Uses left sidebar on lg+, mobile drawer (Sheet side="left", 280px) below; reuses `useAutoHideHeader`.
