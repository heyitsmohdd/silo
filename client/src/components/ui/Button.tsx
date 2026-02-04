import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles - professional defaults
          'inline-flex items-center justify-center gap-2 rounded-md font-medium',
          'transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant styles
          {
            // Default - solid primary button
            'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]':
              variant === 'default',
            // Secondary - subtle background
            'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80':
              variant === 'secondary',
            // Outline - bordered button
            'border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground':
              variant === 'outline',
            // Ghost - minimal button
            'hover:bg-accent hover:text-accent-foreground':
              variant === 'ghost',
            // Destructive - danger button
            'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]':
              variant === 'destructive',
          },
          // Size styles - perfect padding
          {
            'h-11 px-4 py-2.5 text-sm': size === 'default',
            'h-9 px-3 py-2 text-xs': size === 'sm',
            'h-12 px-6 py-3 text-base': size === 'lg',
          },
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
