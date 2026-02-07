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
            // Default - violet primary button
            'bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 active:scale-[0.98] shadow-emerald-500/20':
              variant === 'default',
            // Secondary - glass effect
            'bg-zinc-800/40 backdrop-blur-sm text-zinc-100 border border-white/10 shadow-sm hover:bg-zinc-800/60':
              variant === 'secondary',
            // Outline - bordered button
            'border-2 border-zinc-700 bg-transparent text-zinc-100 hover:bg-zinc-800/40 hover:border-zinc-600':
              variant === 'outline',
            // Ghost - violet hover
            'text-zinc-300 hover:bg-emerald-500/10 hover:text-emerald-400':
              variant === 'ghost',
            // Destructive - red with glass
            'bg-red-500/90 backdrop-blur-sm text-white shadow-lg hover:bg-red-600 active:scale-[0.98] shadow-red-500/20':
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
