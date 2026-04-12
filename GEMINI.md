# VetOS - AI Project Context

## Overview
VetOS is a modern, open-source, multilingual (Swiss-first) veterinary practice management system.

## Architectural Decisions
*   **Backend:** Python 3.12+ (FastAPI) + PostgreSQL (JSONB).
*   **Frontend:** React (TypeScript) + Vite + Shadcn/UI (Tailwind).
*   **Agent:** Python (standalone binary) for local hardware integration (printers, lab gear, DICOM).
*   **Migration:** Dedicated Python ETL for continuous MSSQL -> PostgreSQL import.
*   **Deployment:** Docker-based, multi-instance capable.

## Global Rules
*   Code & Documentation: Strictly in ENGLISH.
*   In-App User Help: Multilingual, updated incrementally.
*   Security: RBAC (Vet, Assistant, Admin, Tech), Audit Logs.
*   Code Quality: Ruff/MyPy for Python, ESLint/Prettier for TS.

## Domain Model
Clean DDD-inspired model, isolated from the legacy MSSQL schema flaws.
