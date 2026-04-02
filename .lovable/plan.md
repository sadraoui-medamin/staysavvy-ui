## Plan: Professional Role-Based Hotel Management System

### Step 1: Cleanup
- Delete PartnerChat.tsx
- Remove chat from navigation

### Step 2: Role System & Navigation
- Create role definitions with permissions mapping
- Update PartnerDashboard with role selector and role-specific nav items
- Each role sees only their permitted sections

### Step 3: Create Role-Specific Interfaces (all static/mock data)

1. **Super Admin (General Manager)** - Enhanced overview with full system settings, employee management, API integrations, financial reports
2. **Revenue Manager** - Rate management, promotional packages, cancellation policies, occupancy/competitor reports
3. **Receptionist (Front Office)** - Check-in/Check-out flow, walk-in bookings, ID data entry, invoice/payment processing
4. **Guest Relations (Concierge)** - Guest profiles, preferences/notes, restaurant/car bookings, complaint handling
5. **Housekeeping Lead** - Room status board, task assignment, inventory management
6. **Room Attendant (Cleaner)** - Simple mobile-friendly interface: assigned rooms, start/finish cleaning
7. **Maintenance Technician** - Maintenance tickets, repair status updates, before/after photo uploads
8. **F&B / Kitchen Manager** - Digital menu management, room service orders, bill linking
9. **Accountant** - Daily sales reports, voucher auditing, shift closures, export functionality
10. **Security Officer** - Access logs, incident reporting, occupancy list for emergencies

### Step 4: Polish
- Consistent design language across all interfaces
- Status indicators, cards, and data tables per role
