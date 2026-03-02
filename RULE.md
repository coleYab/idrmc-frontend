# IDRMC Frontend Project Rules

Welcome to the IDRMC Frontend! This is a guide to help maintain code quality, ensure easier integration across multiple programmers, and simplify AI-assisted coding.

## 1. UI Library & Styling

- **Shadcn UI**: We exclusively use [shadcn/ui](https://ui.shadcn.com/) for our base components. Whenever you need a standard UI element (button, input, dialogue, etc.), use the shadcn CLI to add it (`npx shadcn@latest add [component]`). Do not re-invent basic components.
- **Tailwind CSS**: Use Tailwind utility classes for all styling. Avoid custom CSS files unless absolutely necessary. Keep styles inline using `className` and utilize the `cn` utility from `lib/utils.ts` to merge classes dynamically.

## 2. AI Coding Guidelines

- **Context is Key**: When using AI coding assistants (like Copilot, Cursor, Gemini), refer them to this `RULE.md` to ensure they follow our project conventions.
- **Explain Your Intent**: Always document complex logic with brief comments. AI tools rely heavily on code readability and well-named variables/functions to provide accurate completions and refactoring.
- **Keep Files Small**: Prefer breaking down large files into smaller, focused components. AI tools have context limits, and smaller precise files help them generate better and less error-prone code.

## 3. Collaboration & Integration

- **Husky & Linting**: We use Husky with `lint-staged`. Before every commit, your staged files undergo linting and formatting. Ensure you fix all ESLint and Prettier errors before pushing your code. This guarantees that code pushed to the repository formatting matches what everyone else is doing.
- **Branching Strategy**: Use meaningful branch names (e.g., `feat/add-login`, `fix/header-alignment`).
- **Review Pre-requisites**: Ensure your code passes standard types checks (`npm run typecheck` or similar) before opening pull requests.

## 4. Layouts

All views in the application must fit into one of our standard layouts to ensure consistent navigation and structure.

- **Authorized Layout**: For logged-in users. Includes a standard sidebar/navbar and context-aware elements.
- **Unauthorized Layout**: For public-facing pages (login, register, forgot password, landing page). Usually simpler, often centered content with minimal navigation.
