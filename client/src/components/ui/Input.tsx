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
                    <label className="block mb-2 text-sm font-medium font-mono uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={cn(
                        'w-full px-4 py-2 font-mono text-sm',
                        'bg-dark-bg text-dark-text border-2 border-dark-border',
                        'light:bg-bright-bg light:text-bright-text light:border-bright-border',
                        'focus:border-dark-text light:focus:border-bright-text',
                        'placeholder:text-dark-border light:placeholder:text-bright-border',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-danger',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-2 text-xs font-mono text-danger uppercase tracking-wider">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
