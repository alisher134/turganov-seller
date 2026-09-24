# Declarative UI

Describe _what_ is on screen. Do not branch with `if` / `&&` / ternaries in page or widget JSX for loading, error, empty, or optional data. Use the primitives in `shared/ui`. Do not invent new wrappers (`DataGuard`, `QueryBoundary`, …).

| Need                          | Use                               |
| ----------------------------- | --------------------------------- |
| loading + error + data        | `AsyncWrapper`                    |
| only loading                  | `LoaderGate`                      |
| only error (replace children) | `ErrorGate`                       |
| boolean / optional data       | `Show`                            |
| empty list / no content       | `EmptyState` (as `Show` fallback) |
| inline error                  | `ErrorAlert`                      |
| full-page error               | `ErrorPageElement` / `ErrorPage`  |

Import directly from `shared/ui`: `@/shared/ui/async-wrapper`, `loader-gate`, `error-gate`, `show`, `empty-state`, `error-alert`, `spinner`, or through `@/shared/ui`.

## Fetch with data

`AsyncWrapper` owns the three states. `children` is a render prop with data. Do not nest `LoaderGate` / `ErrorGate` / `Show` around the same query.

### BAD — imperative branches

```tsx
if (isLoading) return <Spinner />;
if (isError) return <p>Ошибка</p>;
if (!product) return null;

return <ProductDetails product={product} />;
```

### BAD — ternary / &&

```tsx
{
  isLoading ? (
    <Spinner />
  ) : isError ? (
    <ErrorAlert />
  ) : (
    product && <ProductDetails product={product} />
  );
}
```

### BAD — stack gates on a query that has data

```tsx
<LoaderGate isLoading={isLoading}>
  <ErrorGate isError={isError} errorSlot={<ErrorAlert />}>
    <Show when={!!product} data={product}>
      {(product) => <ProductDetails product={product} />}
    </Show>
  </ErrorGate>
</LoaderGate>
```

### GOOD

```tsx
<AsyncWrapper
  isLoading={isLoading}
  isError={isError}
  data={product}
  errorSlot={<ErrorAlert errorMessage={error?.message} />}
>
  {(product) => <ProductDetails product={product} />}
</AsyncWrapper>
```

Pass `loaderSlot` only when the default spinner is wrong (skeleton, page placeholder). Pass `errorSlot` for real error UI (`ErrorAlert` or page error component), not a raw string.

## Only loading

Use `LoaderGate` when there is no error/data split (toggle, deferred chunk, button wait).

### BAD

```tsx
if (isLoading) return <Spinner />;
return <Filters />;
```

### GOOD

```tsx
<LoaderGate isLoading={isLoading} loaderSlot={<Spinner />}>
  <Filters />
</LoaderGate>
```

## Only error (replace content)

`ErrorGate` **replaces** children. Use it when the block must not render on failure.

### BAD

```tsx
if (isError) return <ErrorAlert errorMessage={message} />;
return <ProductList products={products} />;
```

### GOOD

```tsx
<ErrorGate isError={isError} errorSlot={<ErrorAlert errorMessage={message} />}>
  <ProductList products={products} />
</ErrorGate>
```

## Error beside content

If the form or list must stay visible, do **not** use `ErrorGate` / `AsyncWrapper`. Put `ErrorAlert` in the tree.

### BAD — hides the form on submit error

```tsx
<ErrorGate isError={isError} errorSlot={<ErrorAlert errorMessage={message} />}>
  <SignInForm />
</ErrorGate>
```

### GOOD

```tsx
<>
  <Show when={isError}>
    <ErrorAlert errorMessage={message} />
  </Show>
  <SignInForm />
</>
```

## Page-level vs inline error

### BAD — full-page crash as a small alert

```tsx
<ErrorAlert errorMessage="Не удалось загрузить страницу" />
```

### BAD — field-level failure as a full-page card

```tsx
<ErrorPageElement title="Неверный пароль" />
```

### GOOD — route / screen failure

```tsx
<ErrorPageElement
  title="Произошла ошибка"
  description="Не удалось загрузить данные"
  onRetry={handleRetry}
  onGoHome={handleGoHome}
/>
```

### GOOD — query / mutation message

```tsx
<ErrorAlert errorMessage={error.message} />
```

## Optional UI

Use `Show` instead of `&&`, ternaries, and early returns for visibility. Use the render-prop `children` when you need the value narrowed.

### BAD

```tsx
{
  user && <Avatar name={user.name} />;
}
{
  isModalOpen ? <ProductModal /> : null;
}
```

### GOOD — boolean flag

```tsx
<Show when={isModalOpen}>
  <ProductModal />
</Show>
```

### GOOD — narrow data

```tsx
<Show when={user != null} data={user} fallback={null}>
  {(user) => <Avatar name={user.name} />}
</Show>
```

Do not use `Show` for loading or fetch errors (`when={!isLoading}`). That is `LoaderGate` / `AsyncWrapper`.

### BAD

```tsx
<Show when={!isLoading} fallback={<Spinner />}>
  <ProductDetails product={product} />
</Show>
```

## Empty content

When a list or block has no data (after a successful fetch), use `EmptyState` as the `Show` fallback. Do not use a bare muted `<p>`, custom empty cards, or invent a feature-local empty component.

`EmptyState` props: `title` (required), optional `description`, optional `action` (e.g., `Button`).

### BAD — plain text or ad-hoc empty UI

```tsx
{
  items.length === 0 ? (
    <p className="text-sm text-muted-foreground">Товары не найдены</p>
  ) : (
    <ProductList products={items} />
  );
}
```

### GOOD — Show + EmptyState

```tsx
<Show
  when={items.length > 0}
  fallback={
    <EmptyState
      title="Товары не найдены"
      description="Попробуйте изменить параметры поиска"
      action={
        <Button variant="outline" size="sm" onClick={handleReset}>
          Сбросить фильтры
        </Button>
      }
    />
  }
>
  <ProductList products={items} />
</Show>
```

## Do not

- Mix `AsyncWrapper` with `LoaderGate` / `ErrorGate` for the same request
- Recreate loading/error/empty helpers in a feature
- Default `errorSlot` to a bare string when `ErrorAlert` exists
- Use a muted `<p>` or custom empty card when `EmptyState` fits
- Use `Show`’s `data` without `when` (it will not render)
- Hide interactive UI with `ErrorGate` when the user still needs it
