# UI and styling

Stack: Tailwind CSS v4, shadcn/ui (radix-nova), `radix-ui`, `class-variance-authority`, `cn` from `@/shared/lib/utils` (or `"cn"`), Lucide icons.

## Reuse shared UI

Before creating a new primitive, check `src/shared/ui/`. Extend via variants, do not duplicate.

### BAD — custom button from scratch

```tsx
<button className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Отправить</button>
```

### GOOD — use existing Button

```tsx
import { Button } from '@/shared/ui/button';

<Button type="submit">Отправить</Button>;
```

### GOOD — extend via CVA variants (like Link / custom buttons)

```tsx
import { buttonVariants } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

<Link className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), className)} to="/profile" />;
```

## className merging

Always merge classes with `cn()` when accepting `className` prop.

### BAD

```tsx
function Card({ className }: { className?: string }) {
  return <div className={`rounded-lg border p-4 ${className}`} />;
}
```

### GOOD

```tsx
import { cn } from '@/shared/lib/utils';

function Card({ className }: CardProps) {
  return <div className={cn('rounded-lg border p-4', className)} />;
}
```

## Layout

Use `Container` for page-width constraints when available.

### BAD — repeated max-width on every page

```tsx
<main className="mx-auto max-w-7xl px-4">{children}</main>
```

### GOOD

```tsx
import { Container } from '@/shared/ui/container';

<Container>{children}</Container>;
```

## Icons

- UI icons: `lucide-react` (`ChevronDownIcon`, `SearchIcon`, etc.)
- Brand/custom icons: SVGR from `@/shared/assets/icons/`

### BAD — inline SVG copy-pasted in every component

```tsx
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

### GOOD — Lucide for standard icons

```tsx
import { ChevronDownIcon } from 'lucide-react';

<ChevronDownIcon className="size-4 text-muted-foreground" />;
```

### GOOD — SVGR for brand assets

```tsx
import LogoIcon from '@/shared/assets/icons/logo-icon.svg?react';

<LogoIcon className="size-6" aria-hidden />;
```

SVG imports:

- `*.svg?react` → React component (via vite-plugin-svgr)
- `*.svg` → URL string (for `<img>`)

## Tailwind conventions

- Use design tokens from `src/app/styles/index.css`: `text-muted-foreground`, `bg-primary`, `border-border`, etc.
- Prefer semantic tokens over raw colors: `text-primary` not `text-blue-500`
- Icon sizing: `size-4`, `size-5`, `size-6` — shadcn Button already handles `[&_svg]` sizing
- Spacing: consistent gaps (`gap-2`, `gap-4`) and padding aligned with existing components

### BAD — arbitrary values everywhere

```tsx
<div className="mt-[17px] text-[#333333] w-[342px]">
```

### GOOD — design system tokens

```tsx
<div className="mt-4 text-muted-foreground w-full max-w-sm">
```

## Accessibility

### BAD

```tsx
<button onClick={handleClose}>
  <XIcon />
</button>
```

### GOOD

```tsx
<button type="button" onClick={handleClose} aria-label="Закрыть">
  <XIcon aria-hidden />
</button>
```

Decorative icons: `aria-hidden`. Meaningful icons: `aria-label` on the interactive element.

## Forms

Use existing presentational field primitives from `shared/ui/` (`TextField`, `EmailField`, `PasswordField`, `Input`). Match field spacing with neighboring forms.

### BAD — raw input with mismatched styles

```tsx
<input className="border p-2 rounded" />
```

### GOOD

```tsx
import { TextField } from '@/shared/ui/text-field';

<TextField label="Название" placeholder="Введите название" {...form.register('name')} />;
```

## Responsive and states

Handle interactive states via Tailwind variants already in the design system (`hover:`, `focus-visible:`, `disabled:`, `aria-expanded:`).

### BAD — manual state class toggling duplicated across components

```tsx
className={isActive ? "bg-gray-200 font-bold" : "bg-white font-normal"}
```

### GOOD — use Button variant prop

```tsx
<Button variant={isActive ? 'default' : 'ghost'}>{label}</Button>
```

## Do not

- Add SCSS/CSS modules unless explicitly required — project uses Tailwind CSS v4
- Install new UI libraries without request — use shadcn and radix-ui
- Override shadcn component internals — compose or add variants via CVA
