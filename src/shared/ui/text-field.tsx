import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Field, FieldDescription, FieldError, FieldLabel } from './field';
import { Input } from './input';

export interface TextFieldProps extends React.ComponentPropsWithRef<'input'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string | { message?: string };
  action?: React.ReactNode;
  fieldClassName?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      description,
      error,
      action,
      fieldClassName,
      className,
      startAdornment,
      endAdornment,
      disabled,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const hasError = Boolean(errorMessage);

    return (
      <Field data-invalid={hasError} data-disabled={disabled} className={fieldClassName}>
        {(label || action) && (
          <div className="flex items-center justify-between gap-2">
            {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
            {action}
          </div>
        )}

        <div className="relative flex items-center">
          {startAdornment && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground">
              {startAdornment}
            </div>
          )}
          <Input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            className={cn(startAdornment && 'pl-8', endAdornment && 'pr-9', className)}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
              {endAdornment}
            </div>
          )}
        </div>

        {description && !hasError && <FieldDescription>{description}</FieldDescription>}
        {hasError && <FieldError errors={[{ message: errorMessage }]} />}
      </Field>
    );
  },
);

TextField.displayName = 'TextField';
