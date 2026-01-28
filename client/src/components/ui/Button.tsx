import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', children, ...props }, ref) => {
        const baseStyles = 'px-4 py-2 border-2 font-medium transition-all duration-75 disabled:opacity-50 disabled:cursor-not-allowed';

        const variantStyles = {
            primary: 'bg-dark-text text-dark-bg border-dark-text hover:bg-dark-bg hover:text-dark-text light:bg-bright-text light:text-bright-bg light:border-bright-text light:hover:bg-bright-bg light:hover:text-bright-text',
            secondary: 'bg-transparent text-dark-text border-dark-border hover:bg-dark-text hover:text-dark-bg light:text-bright-text light:border-bright-border light:hover:bg-bright-text light:hover:text-bright-bg',
            danger: 'bg-danger text-white border-danger hover:bg-transparent hover:text-danger',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variantStyles[variant], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
