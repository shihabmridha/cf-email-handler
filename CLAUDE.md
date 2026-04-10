# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cloudflare Email Handler - A full-stack email management and routing platform built on Cloudflare Workers. Features AI-powered email classification (via Google Gemini), intelligent routing, and multi-provider email sending (MailTrap, Resend).

## Commands

### Development
```bash
# Install dependencies (run in both workers/ and pages/)
bun install

# Start local development server (from workers/)
cd workers && bun dev

# Build frontend and copy to workers/dist (from root)
bun build:pages

# Type checking
bun lint:be    # Backend (workers)
bun lint:fe    # Frontend (pages)
```

### Database Migrations (from workers/)
```bash
bun mg:new --name <name>   # Create new migration
bun mg:ls                   # List migrations
bun mg:up                   # Apply migrations locally
bun mg:up --remote          # Apply migrations in production
bun setup                   # Run migrations + create default user locally
bun setup --remote          # Same for production
```

### Deployment (from root)
```bash
bun deploy    # Build pages + deploy worker to Cloudflare
```

### Cloudflare Types
```bash
cd workers && bun cf-typegen   # Generate types from wrangler.toml
```

## Architecture

### Monorepo Structure
- **workers/** - Cloudflare Workers backend (Hono.js + D1 SQLite)
- **pages/** - Next.js 15 frontend with App Router

### Shared Code
DTOs and enums are shared between frontend and backend. The prebuild script copies `workers/src/dtos` and `workers/src/enums` to `pages/shared/`.

### Backend Architecture (workers/src/)
```
handlers/       # HTTP request handlers and email processing
services/       # Business logic (EmailRouteService, PredictionService, MailService)
repositories/   # Data access layer (D1 database)
entities/       # Domain entities
dtos/           # Data Transfer Objects (shared with frontend)
enums/          # Type enumerations (shared with frontend)
interfaces/     # Interface contracts
lib/            # Utilities (mapper, transport factory)
container.ts    # Dependency injection container
api.ts          # Hono router setup
index.ts        # Worker entry point with email handler
```

### Email Processing Flow
1. Email arrives → `index.ts` triggers `processEmail()`
2. `PredictionService` classifies email using Gemini (OTP, INVOICE, PROMOTIONAL, UNKNOWN)
3. `EmailRouteService.getDestination()` finds matching enabled route
4. Email is forwarded to destination or dropped based on route config
5. History logged to `incoming_history` table

### Key Patterns
- **Repository Pattern**: All database access through repository classes
- **Dependency Injection**: Services resolved via `Container` class
- **Transport Factory**: `ProviderFactory` creates SMTP or API transport based on provider config

### Frontend Architecture (pages/)
- Uses Next.js App Router with `(authenticated)` route group for protected pages
- API client with JWT authentication in `lib/api-client.ts`
- UI built with Radix UI primitives + Tailwind CSS

### Database (D1 SQLite)
Tables: `users`, `email_routes`, `provider_configs`, `drafts`, `incoming_history`, `settings`

## Code Conventions

- Use interfaces over types for object definitions
- Use PascalCase for types/interfaces, camelCase for variables/functions
- Repository pattern for data access, service layer for business logic
- Prefer Server Components in Next.js, mark client components with 'use client'
- Use explicit return types for public functions
