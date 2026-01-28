import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block mb-2 text-sm font-medium font-mono uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-2 font-mono text-sm',
                        'bg-dark-bg text-dark-text border-2 border-dark-border',
                        'light:bg-bright-bg light:text-bright-text light:border-bright-border',
                        'focus:border-dark-text light:focus:border-bright-text',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-danger',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-2 text-xs font-mono text-danger uppercase tracking-wider">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;
