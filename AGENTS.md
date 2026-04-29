# AGENTS.md - AI Coding Agent Reference (IDRMC Frontend)

This file provides essential information for AI coding agents working on this project. It contains project-specific details, conventions, and guidelines that complement the README.

---

## 1. Build & Development Commands

The project prefers `bun` but supports `npm`.

- **Install Dependencies**: `bun install`
- **Development Server**: `bun run dev` (starts at http://localhost:3000)
- **Build for Production**: `bun run build`
- **Linting**:
  - `bun run lint`: Run ESLint checks.
  - `bun run lint:fix`: Fix ESLint issues and format with Prettier.
  - `bun run lint:strict`: Zero warnings tolerance check.
- **Formatting**: `bun run format` (Prettier)
- **Testing**:
  - Run all tests: `bun test`
  - Run a single test: `bun test <path_to_file>`
  - Watch mode: `bun test --watch`

---

## 2. Code Style & Architecture

### TypeScript & Naming

- **Strict Mode**: Always enabled. Avoid `any`.
- **Naming Conventions**:
  - Components/Interfaces/Types: `PascalCase` (e.g., `IncidentCard`, `UserResponse`).
  - Variables/Functions/Hooks: `camelCase` (e.g., `useIncidents`, `formatDate`).
  - Files: `kebab-case` (e.g., `incident-list.tsx`).
- **Imports**: Always use `@/` alias for `src/`.

### Feature-Based Structure

Group code by feature in `src/features/`. Each feature directory should follow:

- `components/`: Feature-specific UI components.
- `api/`: TanStack Query hooks and fetch logic.
- `types/`: Zod schemas and TypeScript interfaces.
- `hooks/`: Feature-specific logic hooks.

### Components

- Use function declarations: `function ComponentName({ props }: Props) { ... }`.
- Props interface named `{ComponentName}Props`.
- **Server Components** by default. Use `'use client'` only when React hooks (state, effects) or browser APIs are required.
- Use the `cn()` utility from `@/lib/utils` for all `className` merging.

### Data Fetching & State

- **Fetch API**: Use the native `fetch` API wrapped in a standard client (e.g., `@/lib/fetch-client`) to handle JWT injection and response parsing.
- **TanStack Query (React Query)**:
  - Use `useQuery` for all data fetching (GET).
  - Use `useMutation` for all data modifications (POST, PATCH, PUT, DELETE).
  - Implement cache invalidation on successful mutations.
- **Validation**: Every API response and form must be validated using **Zod**.
- **URL State**: Use `nuqs` for managing table filters, pagination, and sorting in the URL.

---

## 3. API Integration Guidelines

The frontend interacts with the backend at `http://your-api-domain/api/v1`.

### Standard Response Format

Responses typically follow this structure:

```json
{
  "data": { ... },
  "meta": { "total": number, "count": number }
}
```

Ensure your hooks handle the `data` unwrapping and provide types for the `meta` information.

### Authentication (Clerk)

- Auth is handled via Clerk.
- For API calls, inject the JWT Bearer token into the `Authorization` header.
- Use Clerk's `Protect` component for client-side RBAC and `auth()` for server-side checks.

---

## 4. UI & Theming

- **shadcn/ui**: Do not modify components in `src/components/ui/` directly. Extend their functionality in feature-specific components.
- **Tailwind CSS v4**: Use modern Tailwind v4 syntax.
- **Icons**: Prefer `Lucide` or `Tabler` icons from the icon registry.
- **Errors**: Surface errors to users using `sonner` toasts or inline form validation messages.

---

## 5. Environment Variables

Ensure these are set in `.env.local`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_API_URL` (Base URL for the backend API)

---

## Notes for AI Agents

1. **Be Proactive**: If a feature requires a new API endpoint, define the Zod schema and TanStack Query hook first.
2. **Consistency**: Look at existing features (e.g., `src/features/products`) before implementing new ones.
3. **Safety**: Never log or commit sensitive information (secrets, API keys).
