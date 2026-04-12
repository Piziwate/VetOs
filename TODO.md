# VetOS Project Roadmap & TODO

## Phase 1: Foundation & Infrastructure (COMPLETED)
- [x] Establish directory structure (`backend/`, `frontend/`, `agent/`, `migration/`).
- [x] Configure `docker-compose.yml` (Postgres, Redis, Adminer).
- [x] Setup Backend skeleton (FastAPI, Alembic, Dockerfile).
- [x] Setup Frontend skeleton (Vite, React, TS, Shadcn, i18next).
- [x] Setup Agent skeleton (Python daemon).
- [x] Initialize GitHub Actions CI/CD pipelines.

## Phase 2: Core Domain & Data Migration Engine (ACTIVE)
- [ ] Design PostgreSQL schema (Users, Clients, Patients).
- [ ] Establish RO MSSQL connection for migration.
- [ ] Implement core migration ETL mapping (Clients/Patients).
- [ ] Validate 100% data import (continuous mapping).

## Phase 3: Core API & Multilingual UI Scaffold
- [ ] Build Client/Patient CRUD API endpoints.
- [ ] Implement Auth (OAuth2/JWT) & RBAC.
- [ ] Develop Client/Patient listing/details in React.
- [ ] Integrate i18next (English, French, German).

## Phase 4: Medical Records & Consultations
- [ ] Consultation domain model & API.
- [ ] Rich text clinical notes.
- [ ] Historical medical records migration.
- [ ] Consultation dashboard UI.

## Phase 5: Local Hardware Integration (The Agent)
- [ ] Agent-Backend WebSocket handshake & pairing.
- [ ] Direct printing module (OS Spooler).
- [ ] Background lab result reception.

## Phase 6: Specialized Modules (Billing, Lab, Imaging)
- [ ] Billing & Swiss specifics (TARMED).
- [ ] Lab analyzer serial/TCP parsing.
- [ ] DICOM imaging integration.
- [ ] Audit Log visualization UI.
- [ ] In-App Help documentation system.
