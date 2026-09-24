# Naming

## Files and folders

- Files and folders: `kebab-case` (`product-card.tsx`, `sign-in-form/`)
- Components: `PascalCase`; hooks: `useSomething`
- Booleans: `is` / `has` / `can` / `should` prefix
- Constants: `UPPER_SNAKE_CASE`
- Types: `PascalCase`
- Callback props: `onX`; local handlers: `handleX`
- Module public API: `index.ts` barrel — import the folder, not a file inside it
- Avoid abbreviations unless domain-standard (`DTO`, `ID`, `API`)

### BAD — inconsistent file names

```
src/features/SignIn/SignInForm.tsx
src/widgets/header/Header.tsx
src/shared/ui/SearchInput.tsx
```

### GOOD — kebab-case files, PascalCase exports

```
src/features/auth/ui/sign-in-form.tsx  → export function SignInForm
src/widgets/header/ui/header.tsx       → export function Header
src/shared/ui/search-input.tsx         → export function SearchInput
```

## FSD module structure

```
feature-name/
  index.ts          # public API
  ui/               # components
  model/            # types, schemas, stores (when needed)
  api/              # queries, mutations (when needed)
  lib/              # pure helpers (when needed)
```

### BAD — deep import bypassing barrel

```tsx
import { SignInForm } from '@/features/auth/ui/sign-in-form';
```

### GOOD — import through public API

```tsx
import { SignInForm } from '@/features/auth';
```

```ts
// features/auth/index.ts
export { SignInForm } from './ui/sign-in-form';
```

## Variables and props

### BAD — vague names

```tsx
function OrderRow({ data, item, value, handleClick }: Props) {
  const temp = data.status;
  const result = value * item.count;
}
```

### GOOD — domain-specific names

```tsx
function OrderRow({ order, productPrice, onSelect }: OrderRowProps) {
  const orderStatus = order.status;
  const totalPrice = productPrice * order.productCount;
}
```

## Event handlers and navigation

### BAD — inline anonymous functions for complex logic

```tsx
<Button
  onClick={() => {
    setIsSubmitting(true);
    saveData();
    navigate('/dashboard');
  }}
/>
```

### GOOD — named handler with react-router navigation

```tsx
import { useNavigate } from 'react-router';

function ProductItem({ product }: ProductItemProps) {
  const navigate = useNavigate();

  const handleSelectProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return <Button onClick={() => handleSelectProduct(product.id)}>Подробнее</Button>;
}
```
