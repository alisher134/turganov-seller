# Architecture (FSD)

Layers (top → bottom): `src/app` → `src/pages` → `src/widgets` → `src/features` → `src/entities` → `src/shared`

**Import rule:** a module may import only from layers **below** it, never from above or sideways across slices at the same layer.

| Layer      | Responsibility                                            | Examples                                        |
| ---------- | --------------------------------------------------------- | ----------------------------------------------- |
| `app`      | App shell, providers, router configuration, global styles | `src/app/router/index.tsx`, `src/app/providers` |
| `pages`    | Full page compositions                                    | `src/pages/home`, `src/pages/auth`              |
| `widgets`  | Large independent UI blocks                               | `src/widgets/header`, `src/widgets/root-layout` |
| `features` | User actions / business interactions                      | `src/features/auth`, `src/features/cart`        |
| `entities` | Business entities                                         | `src/entities/product`, `src/entities/user`     |
| `shared`   | UI kit, config, utils, hooks, API client                  | `src/shared/ui`, `src/shared/lib`               |

## Import boundaries

### BAD — feature imports from widget

```tsx
// features/product-filter/ui/product-filter.tsx
import { Header } from '@/widgets/header';
```

### BAD — shared imports from feature

```tsx
// shared/ui/product-badge.tsx
import { useCart } from '@/features/cart';
```

### GOOD — top imports from bottom

```tsx
// widgets/header/ui/header.tsx
import { SignInButton } from '@/features/auth';
import { Container } from '@/shared/ui/container';
```

```tsx
// pages/home/ui/home-page.tsx
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
```

## Page composition and routing

Router configuration in `src/app/router` stays thin — delegate to slices in `src/pages`.

### BAD — business UI directly in router definition

```tsx
// app/router/index.tsx
{
  path: "/products",
  element: (
    <main>
      <h1>Products</h1>
      {/* 200 lines of page markup */}
    </main>
  ),
}
```

### GOOD — router delegates to page slice

```tsx
// app/router/index.tsx
import { HomePage } from '@/pages/home';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
```

## Slice public API

Each slice exposes only what others need via `index.ts`.

### BAD — export internals

```tsx
// features/auth/index.ts
export { SignInForm } from './ui/sign-in-form';
export { AuthSocialButtons } from './ui/auth-social-buttons'; // internal detail
```

### GOOD — hide implementation details

```tsx
// features/auth/index.ts
export { SignInForm } from './ui/sign-in-form';
// AuthSocialButtons stays private — used only inside the auth feature
```

## Where to put new code

| Need                                      | Place                          |
| ----------------------------------------- | ------------------------------ |
| Reusable button, input, gates             | `src/shared/ui/`               |
| App routing configuration                 | `src/app/router/`              |
| App providers (QueryClient, etc.)         | `src/app/providers/`           |
| User action (e.g. login, add to cart)     | `src/features/<feature-name>/` |
| Large composite UI block (header, navbar) | `src/widgets/<widget-name>/`   |
| Complete screen composition               | `src/pages/<page-name>/`       |
| Domain model and card/row for entity      | `src/entities/<entity-name>/`  |

### BAD — dump everything in shared

```tsx
// shared/ui/header-with-auth.tsx — belongs in widgets + features
```

### GOOD — split by responsibility

```tsx
// widgets/header/ui/header.tsx   — layout of header
// features/auth/                 — authentication behavior
```

## Cross-feature communication

### BAD — feature A imports feature B directly

```tsx
// features/checkout/ui/checkout-form.tsx
import { AddToCartButton } from '@/features/add-to-cart';
```

Prefer composition at widget/page level, or shared entity layer for common data.

### GOOD — page/widget composes features

```tsx
// pages/product/ui/product-page.tsx
<ProductDetails product={product} />
<AddToCart productId={product.id} />
<ShareProduct productId={product.id} />
```
