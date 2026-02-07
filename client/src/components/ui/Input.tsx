import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            // Base styles - larger, more comfortable
            'flex h-11 w-full rounded-md border border-input bg-background',
            'px-3.5 py-2.5 text-sm text-zinc-100',
            'transition-colors duration-150',
            // Placeholder and disabled states
            'placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
            // Focus state - clear, visible
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            // Error state
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-destructive font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
