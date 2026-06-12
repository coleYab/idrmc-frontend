<h1 align="center">IDRMC — Integrated Disaster Risk Management Console</h1>

<div align="center">A multi-console web application for disaster and emergency incident management. Built with Next.js 16, shadcn/ui, Tailwind CSS, and TypeScript.</div>

<br />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6" alt="TypeScript" />
  <a href="https://go.clerk.com/ILdYhn7"><img src="https://img.shields.io/badge/Auth-Clerk-6C47FF" alt="Clerk" /></a>
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4" alt="Tailwind CSS" />
</p>

## Overview

**IDRMC** (Integrated Disaster Risk Management Console) is an operational control center for disaster management personnel. It provides four specialized consoles tailored to different roles in the disaster management lifecycle — from incident validation through emergency response to administrative oversight.

### Consoles

| Console | Role | Purpose |
|---|---|---|
| **INCVAL** (Incident Validator) | Incident Validator | Validate, verify, and manage reported incidents (floods, fires, landslides, droughts, locusts, conflicts) |
| **Disaster Manager** | Disaster Response Team | Coordinate disaster response, track active/resolved disasters, broadcast alerts, manage the disaster lifecycle |
| **ERT** (Emergency Response Team) | Emergency Response Team | Field operations — resource allocation, team assignments, medical response, protocol management, map-based resource tracking |
| **Admin** | Administrator | User management, activity logs, system-wide analytics and metrics |

## Tech Stack

- **Framework** — [Next.js 16](https://nextjs.org/16) (App Router) with React 19
- **Language** — TypeScript (strict mode)
- **Authentication** — [Clerk](https://go.clerk.com/ILdYhn7) with role-based access control
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **State Management** — [Zustand](https://zustand-demo.pmnd.rs) (client), [TanStack Query](https://tanstack.com/query) (server), [nuqs](https://nuqs.47ng.com/) (URL params)
- **Charts** — [Recharts](https://recharts.org)
- **Maps** — [Leaflet](https://leafletjs.com) + [react-leaflet](https://react-leaflet.js.org)
- **Forms** — [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **Tables** — [TanStack Data Tables](https://tanstack.com/table)
- **Error Tracking** — [Sentry](https://sentry.io/for/nextjs/)
- **Linting** — ESLint
- **Formatting** — Prettier

## Pages

| Route | Console | Description |
|---|---|---|
| `/incval/dashboard` | INCVAL | Incident validator dashboard with stats |
| `/incval/incidents/*` | INCVAL | Active, pending, verified, and searchable incident lists |
| `/incval/reports/incident-summary` | INCVAL | Incident summary reports |
| `/disastermanager/dashboard` | Disaster Manager | Disaster manager overview |
| `/disastermanager/disasters/*` | Disaster Manager | Active, resolved, and map-based disaster views |
| `/disastermanager/alerts` | Disaster Manager | Broadcast and manage alerts |
| `/ert/dashboard` | ERT | Emergency response team dashboard |
| `/ert/dashboard/{medical,protocols,map,resources,team,assignments,alerts,donations,map-resources}` | ERT | Field operations sub-pages |
| `/admin/dashboard` | Admin | System-wide analytics |
| `/admin/users` | Admin | User management |
| `/admin/activity` | Admin | Activity log |

## Feature Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (igmr)/                    # Authenticated route group
│   │   ├── incval/                # Incident Validator console
│   │   ├── disastermanager/       # Disaster Manager console
│   │   ├── ert/                   # Emergency Response Team console
│   │   └── admin/                 # Admin console
│   ├── auth/                      # Authentication pages
│   └── api/                       # API routes
├── features/                      # Domain modules
│   ├── incval/                    # Incident validation workflows
│   ├── incidents/                 # Shared incident components
│   ├── disasters/                 # Disaster management
│   ├── ert/                       # Emergency response
│   ├── admin/                     # User & system management
│   ├── overview/                  # Analytics
│   ├── chat/                      # Messaging
│   ├── kanban/                    # Task boards
│   └── notifications/             # Notifications
├── components/                    # Shared UI components
├── lib/                           # Utilities & configurations
├── hooks/                         # Custom React hooks
├── config/                        # Navigation, data table configs
└── types/                         # TypeScript types
```

## Getting Started

```bash
git clone <repo-url>
bun install
cp env.example.txt .env.local   # add your environment variables
bun run dev
```

See [env.example.txt](./env.example.txt) and [docs/clerk_setup.md](./docs/clerk_setup.md) for environment configuration.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run build` | Production build |
| `bun run lint` | ESLint checks |
| `bun run lint:fix` | Fix issues and format |
| `bun run format` | Prettier formatting |
| `bun test` | Run tests |

## Incident Types

The system models incidents across these disaster types:

- Flood
- Drought
- Landslide
- Locust
- Conflict
- Fire

Each incident tracks location (lat/lng), affected population, medical needs, infrastructure damage, attachments, and severity (Low / Medium / High / Critical).

## License

MIT
