# Project Instructions and Standards

## Tech Stack

- **Framework:** Vite + React 19 (SPA)
- **Routing:** React Router v7/v8 (`createBrowserRouter`, `useNavigate`, `useLocation`)
- **State & Server Cache:** TanStack Query (`@tanstack/react-query`)
- **Styling:** Tailwind CSS v4, shadcn/ui (`radix-nova`), Radix UI (`radix-ui`), `lucide-react`
- **Forms & Validation:** React Hook Form + Zod (`useZodForm`, `AppForm`)
- **Icons:** `lucide-react` (standard), SVGR `*.svg?react` (brand)

## Architecture (Feature-Sliced Design)

Layers from top to bottom:

1. `src/app` — Application initialization, router (`src/app/router`), providers, styles (`src/app/styles/index.css`)
2. `src/pages` — Full page views and screen layouts
3. `src/widgets` — Independent composite UI blocks (header, sidebar, layouts)
4. `src/features` — User interactions and business logic (auth, cart, filters)
5. `src/entities` — Domain entities (user, product, order)
6. `src/shared` — UI kit, utils, custom hooks, API clients (`src/shared/ui`, `src/shared/lib`)

**Rule:** A module may import only from layers strictly below it. Each slice exposes its public API through `index.ts`.

## Core Rules Index (.agents/rules/)

Detailed guidelines are organized in `.agents/rules/`:

- [`architecture.md`](file:///.agents/rules/architecture.md) — FSD layer boundaries, page composition, import rules.
- [`declarative-ui.md`](file:///.agents/rules/declarative-ui.md) — Declarative UI with `AsyncWrapper`, `LoaderGate`, `ErrorGate`, `Show`, `EmptyState`.
- [`forms.md`](file:///.agents/rules/forms.md) — Form handling with `useZodForm`, `AppForm`, and presentational fields (`TextField`, `EmailField`, `PasswordField`).
- [`general.md`](file:///.agents/rules/general.md) — Core coding standards (KISS, DRY, early returns, no TODOs, import order).
- [`naming.md`](file:///.agents/rules/naming.md) — Naming conventions (kebab-case files, PascalCase exports, public API barrels).
- [`readable-components.md`](file:///.agents/rules/readable-components.md) — Component flow, hooks extraction, line limits (≤100-200 lines).
- [`typescript.md`](file:///.agents/rules/typescript.md) — Strict TypeScript, `unknown` over `any`, type locations, string unions over enums.
- [`ui-styling.md`](file:///.agents/rules/ui-styling.md) — Tailwind v4 tokens, reusing `shared/ui`, accessible icons, `cn` merging.
