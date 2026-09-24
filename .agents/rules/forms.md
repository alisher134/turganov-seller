# Forms

Stack: `useZodForm` + zod schema + `AppForm` render prop + field components. Fields are presentational: they take `label`, `error`, and input props. They do **not** call `useFormContext`, `register`, or `useController`. Wire RHF only in the feature, through `AppForm`’s `children(form)`.

| Need                                       | Use                                               |
| ------------------------------------------ | ------------------------------------------------- |
| `useForm` + `zodResolver`                  | `useZodForm` from `@/shared/hooks/use-zod-form`   |
| `<form>` + `FormProvider` + `handleSubmit` | `AppForm` from `@/shared/ui/app-form`             |
| text input                                 | `TextField` from `@/shared/ui/text-field`         |
| email                                      | `EmailField` from `@/shared/ui/email-field`       |
| password (show/hide)                       | `PasswordField` from `@/shared/ui/password-field` |
| schema                                     | `z.object` in the feature `model/`                |

Do not add `useFormField`, shadcn `Form` / `FormField`, or bind `name` inside shared fields.

## Setup

Schema lives in the feature, not in the UI file. Infer values from the schema. Always pass `defaultValues`. Do not pass `resolver` — `useZodForm` sets it.

### BAD — raw RHF + resolver in the component

```tsx
const schema = z.object({ email: z.string().email() });
const form = useForm({
  resolver: zodResolver(schema),
});
```

### BAD — no defaultValues

```tsx
const form = useZodForm(signInSchema);
```

### GOOD

```ts
// features/auth/model/sign-in-schema.ts
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

export type SignInValues = z.infer<typeof signInSchema>;
```

```tsx
// features/auth/ui/sign-in-form.tsx
const form = useZodForm(signInSchema, {
  defaultValues: { email: '', password: '' },
});
```

## AppForm

`children` is a function `(form) => ReactNode`. Do not change `AppForm` to plain `ReactNode` children, and do not use `useFormContext` in fields to avoid the render prop.

### BAD — native form + Provider

```tsx
<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <input {...form.register('email')} />
  </form>
</FormProvider>
```

### BAD — handleSubmit on the field tree

```tsx
<AppForm form={form} onSubmit={onSubmit}>
  {(form) => (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <EmailField {...form.register('email')} />
    </form>
  )}
</AppForm>
```

### GOOD

```tsx
<AppForm form={form} onSubmit={handleSignIn}>
  {(form) => (
    <>
      <EmailField
        label="Email"
        error={form.formState.errors.email?.message}
        {...form.register('email')}
      />
      <PasswordField
        label="Пароль"
        error={form.formState.errors.password?.message}
        {...form.register('password')}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Войти
      </Button>
    </>
  )}
</AppForm>
```

`onSubmit` is an `AppForm` prop. `AppForm` already calls `form.handleSubmit`. Put the submit `Button` inside the render prop, `type="submit"`.

## Fields

Pass `label`, `error`, and `{...form.register("field")}`. Use `EmailField` / `PasswordField` instead of `type="email"` / `type="password"` on `TextField`. Do not wrap fields in another `Field` / `FieldLabel` / `FieldError`. Do not pass `name` as a separate API — `register` already sets it.

### BAD — raw input

```tsx
<input type="email" {...form.register("email")} />
<Input type="password" {...form.register("password")} />
```

### BAD — wrong field primitive

```tsx
<TextField type="email" label="Email" {...form.register("email")} />
<TextField type="password" label="Пароль" {...form.register("password")} />
```

### BAD — duplicate field chrome

```tsx
<Field>
  <FieldLabel>Email</FieldLabel>
  <EmailField {...form.register('email')} />
</Field>
```

### BAD — bind RHF inside the shared field

```tsx
export function TextField({ name, label }: { name: string; label: string }) {
  const { register, formState } = useFormContext();
  return <Input {...register(name)} />;
}
```

### GOOD

```tsx
<EmailField
  label="Email"
  error={form.formState.errors.email?.message}
  {...form.register("email")}
/>
<PasswordField
  label="Пароль"
  error={form.formState.errors.password?.message}
  {...form.register("password")}
/>
<TextField
  label="Имя"
  error={form.formState.errors.name?.message}
  {...form.register("name")}
/>
```

Nested path: `error={form.formState.errors.user?.email?.message}` and `{...form.register("user.email")}`.

Submit / mutation errors that are not field errors: `ErrorAlert` next to the form (`Show` + `ErrorAlert`), not `ErrorGate` that unmounts the form. See `declarative-ui` rule.

## New field types

If a primitive is missing (textarea, select), add a presentational field next to `TextField`: `label`, `error`, `...props`. Do not subscribe to the form inside it. Do not use `useController` unless the control cannot forward a ref (custom select, date picker). Native `<input>` / `<textarea>` / `<select>` stay on `register`.

## File separation

Keep schema, submit action, and UI component separated:

```
features/auth/
  model/
    sign-in-schema.ts   # schema + types
  api/
    sign-in.ts          # submit request / mutation hook
  ui/
    sign-in-form.tsx    # useZodForm + AppForm + fields
  index.ts              # public API
```
