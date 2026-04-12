# VetOS - Project Progress & TODO

## 📅 Last Update: 2026-04-12

### ✅ Completed
- [x] **Frontend Reset**: Total wipe and rebuild with Vite + React + TS + Tailwind 4.
- [x] **Layout**: Integrated official Shadcn `sidebar-16` block.
- [x] **Migration Engine**: ETL script (`migration/migration_engine.py`) using `pymssql`.
- [x] **Data Import**: Successfully migrated 5,339 clients and 6,156 patients from Diana (MSSQL).
- [x] **Infrastructure**: Configured Nginx Reverse Proxy in Frontend Dockerfile to handle `/api/v1` and CORS.
- [x] **Clients Page**: Full implementation with TanStack Table, server-side pagination, sorting, and global search.
- [x] **UX**: Added Theme (Dark/Light/System) and Language (FR/EN) sub-menus in User Navigation.

### 🚀 Next Steps
- [ ] **Client Detail View**: Create a page to view/edit a single client and see their linked patients.
- [ ] **Patients Page**: Implement a searchable list of all patients.
- [ ] **Medical Records**: Map and migrate consultation data (`DiaKGBehs`) from Diana DB.
- [ ] **Auth Refactoring**: Implement real JWT authentication flow in Backend and Frontend.
- [ ] **Dashboard Charts**: Replace placeholders with real interactive charts (Recharts) using migrated data.

### 🛠 Tech Stack Details
- **Frontend**: Port 3000 (Nginx Proxy)
- **Backend**: Port 8000 (FastAPI)
- **Database**: PostgreSQL (Postgis ready)
- **Migration**: Python ETL connecting to `nvsrv01.nacvet.local\SQLEXPRESS` (Diana DB)
