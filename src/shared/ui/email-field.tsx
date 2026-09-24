import * as React from 'react';
import { Mail } from 'lucide-react';
import { TextField, type TextFieldProps } from './text-field';

export interface EmailFieldProps extends Omit<TextFieldProps, 'type'> {
  showIcon?: boolean;
}

export const EmailField = React.forwardRef<HTMLInputElement, EmailFieldProps>(
  (
    {
      label = 'Email',
      placeholder = 'name@example.com',
      autoComplete = 'email',
      showIcon = false,
      startAdornment,
      ...props
    },
    ref,
  ) => {
    return (
      <TextField
        ref={ref}
        type="email"
        label={label}
        placeholder={placeholder}
        autoComplete={autoComplete}
        startAdornment={showIcon ? (startAdornment ?? <Mail className="size-4" />) : startAdornment}
        {...props}
      />
    );
  },
);

EmailField.displayName = 'EmailField';
