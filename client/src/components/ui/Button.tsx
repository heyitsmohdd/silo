import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'destructive';
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', children, disabled, ...props }, ref) => {
        const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2';

        const variantStyles = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent',
            secondary: 'bg-transparent text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:ring-neutral-500',
            destructive: 'bg-transparent text-red-600 dark:text-red-500 border border-red-300 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 focus:ring-red-500',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variantStyles[variant], className)}
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
