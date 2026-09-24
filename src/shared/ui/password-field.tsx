import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TextField, type TextFieldProps } from './text-field';

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type'> {
  /**
   * Разрешить переключение отображения пароля
   * @default true
   */
  allowToggleVisibility?: boolean;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    {
      label = 'Пароль',
      placeholder = '••••••••',
      autoComplete = 'current-password',
      allowToggleVisibility = true,
      disabled,
      endAdornment,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleButton = allowToggleVisibility ? (
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => setShowPassword((prev) => !prev)}
        className="flex items-center text-muted-foreground transition-colors hover:text-foreground focus:outline-none disabled:pointer-events-none"
        aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
      >
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    ) : null;

    return (
      <TextField
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        label={label}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        endAdornment={endAdornment ?? toggleButton}
        {...props}
      />
    );
  },
);

PasswordField.displayName = 'PasswordField';
