# TypeScript

`tsconfig.json` has `strict: true` — still guard optional DTO fields at runtime when data comes from the backend. Do not turn `strict` off as a drive-by change.

- Do not add new `any`. Existing `any` on the backend boundary is tolerated; do not globally rewrite it
- Prefer `unknown` + narrowing over `any`
- Avoid `@ts-ignore` / `@ts-expect-error` unless unavoidable and commented why
- Prefer `type` for data shapes; `interface` when you need `extends` or declaration merging
- Domain types live in the module (`api/types.ts`, `model/`), not inside a UI component
- Prettier: single quotes for TS/JS, double quotes in JSX, semicolons

## Nullable backend fields

### BAD — assumes field exists

```tsx
function ProductPrice({ product }: { product: ProductDto }) {
  return <span>{product.price.amount}</span>;
}
```

### GOOD — explicit guard

```tsx
type Price = { amount: number } | null;

function formatPrice(price: Price): string {
  if (price == null) return '';
  return String(price.amount);
}
```

## unknown vs any

### BAD

```tsx
function parseError(error: any) {
  return error.message;
}
```

### GOOD

```tsx
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return 'Произошла неизвестная ошибка';
}
```

## Type location

### BAD — DTO inside component file

```tsx
// product-card.tsx
type ProductDto = { id: string; title: string };
export function ProductCard({ product }: { product: ProductDto }) {}
```

### GOOD — type in module model

```tsx
// entities/product/model/types.ts
export type Product = { id: string; title: string; price: number };

// entities/product/ui/product-card.tsx
import type { Product } from '../model/types';
```

## Const assertions and satisfies

Use `as const satisfies` for config objects that must stay typed and readonly.

### BAD

```tsx
export const sortOptions = [
  { value: 'popular', label: 'Популярные' },
  { value: 'price_asc', label: 'Сначала дешевые' },
];
// value becomes string, not union of specific literals
```

### GOOD

```tsx
export type SortOption = 'popular' | 'price_asc' | 'price_desc';

export const sortOptions = [
  { value: 'popular', label: 'Популярные' },
  { value: 'price_asc', label: 'Сначала дешевые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
] as const satisfies readonly { value: SortOption; label: string }[];
```

## Props typing

### BAD — inline object type on every component

```tsx
export function Container({ children }: { children: React.ReactNode }) {}
```

### GOOD — named props type when exported or reused

```tsx
type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {}
```

## Enums

Prefer string union types over `enum`.

### BAD

```tsx
enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
}
```

### GOOD

```tsx
type OrderStatus = 'pending' | 'paid' | 'cancelled';
```
