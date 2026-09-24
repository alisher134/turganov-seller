# Readable code and components

- Write code for the next developer to understand on the first read
- Use domain-specific names; avoid `data`, `item`, `value`, `temp`, `result` when a precise name exists
- Component flow: inputs and hooks → derived state → handlers → guards → JSX
- Move data fetching and sync into hooks; move pure transforms into `lib/`
- Target ≤100 lines per component; 100–200 only when cohesive; never deliver >200 lines
- Split by visible responsibility, not arbitrary line ranges
- Keep props small — pass only what a child needs
- Reuse existing components/hooks; extract shared code only with a real second consumer
- One component per file; avoid nested ternaries, long inline callbacks, duplicated JSX branches
- Before delivery, reread every changed component top to bottom

## Large component

### BAD — one component owns the whole screen

```tsx
function SellerPage({ sellerId }: SellerPageProps) {
  const [search, setSearch] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { data: seller, isLoading } = useSeller(sellerId);
  const { data: products = [] } = useSellerProducts(sellerId);

  if (isLoading) return <SellerSkeleton />;
  if (!seller) return <NotFound />;

  const visibleProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main>
      <section>
        <img src={seller.logo} alt={seller.name} />
        <h1>{seller.name}</h1>
        <p>{seller.description}</p>
        <button onClick={() => setIsContactOpen(true)}>Связаться</button>
      </section>
      <section>
        <input value={search} onChange={(e) => setSearch(e.target.value)} />
        <div>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <ContactModal seller={seller} open={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </main>
  );
}
```

### GOOD — page reads as a screen outline

```tsx
function SellerPage({ sellerId }: SellerPageProps) {
  const { seller, products, isLoading, isNotFound } = useSellerPage(sellerId);

  if (isLoading) return <SellerSkeleton />;
  if (isNotFound) return <NotFound />;

  return (
    <SellerLayout>
      <SellerHero seller={seller} />
      <SellerProductSection products={products} />
      <SellerContactModal seller={seller} />
    </SellerLayout>
  );
}
```

## Logic in hooks

### BAD — filtering, URL sync, and rendering mixed in component

```tsx
function ProductList({ products }: ProductListProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState<ProductSort>(searchParams.get("sort") as ProductSort || "popular");

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(search.trim().toLowerCase()),
    );
    return filtered.sort((a, b) =>
      sort === "price" ? a.price - b.price : b.sales - a.sales,
    );
  }, [products, search, sort]);

  useEffect(() => {
    setSearchParams({ search, sort });
  }, [search, sort, setSearchParams]);

  return (/* ... */);
}
```

### GOOD — behavior extracted to a clean hook

```tsx
function ProductList({ products }: ProductListProps) {
  const { search, sort, visibleProducts, handleSearchChange, handleSortChange } =
    useProductListFilters(products);

  return (
    <section>
      <ProductFilters
        search={search}
        sort={sort}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />
      <ProductGrid products={visibleProducts} />
    </section>
  );
}
```

## Business rules in plain functions

### BAD — nested ternaries in JSX

```tsx
function OrderStatusBadge({ order }: OrderStatusBadgeProps) {
  return (
    <span
      className={
        order.cancelled
          ? 'bg-red-500'
          : order.paid && order.shipped
            ? 'bg-green-500'
            : order.paid
              ? 'bg-blue-500'
              : 'bg-orange-500'
      }
    >
      {order.cancelled
        ? 'Отменен'
        : order.paid && order.shipped
          ? 'Доставлен'
          : order.paid
            ? 'Оплачен'
            : 'В обработке'}
    </span>
  );
}
```

### GOOD — explicit helper

```tsx
function OrderStatusBadge({ order }: OrderStatusBadgeProps) {
  const status = getOrderStatus(order);
  return <Badge variant={status.variant}>{status.label}</Badge>;
}

function getOrderStatus(order: Order): OrderStatusView {
  if (order.cancelled) return { variant: 'destructive', label: 'Отменен' };
  if (order.paid && order.shipped) return { variant: 'success', label: 'Доставлен' };
  if (order.paid) return { variant: 'default', label: 'Оплачен' };
  return { variant: 'secondary', label: 'В обработке' };
}
```

## Props drilling vs composition

### BAD — pass entire entity when child needs one field

```tsx
<ProductCard product={product} />
// ProductCardTitle only uses product.title but receives full product + 20 fields
```

### GOOD — pass only what child needs

```tsx
<ProductCardTitle title={product.title} />
<ProductCardPrice price={product.price} />
```

## Lists

### BAD — index as key for mutable lists

```tsx
{
  items.map((item, index) => <ProductRow key={index} item={item} />);
}
```

### GOOD — stable id

```tsx
{
  products.map((product) => <ProductCard key={product.id} product={product} />);
}
```
