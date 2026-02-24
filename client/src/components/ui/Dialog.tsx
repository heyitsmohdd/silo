import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

import { createPortal } from 'react-dom';

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onOpenChange]);

    // Prevent body scroll when dialog is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => onOpenChange(false)}
            />

            <div className="relative z-50 w-full max-w-md mx-4">
                {children}
            </div>
        </div>,
        document.body
    );
}

interface DialogContentProps {
    children: ReactNode;
    onClose?: () => void;
    className?: string;
}

export function DialogContent({ children, onClose, className }: DialogContentProps) {
    return (
        <div className={cn("bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 animate-in fade-in-0 zoom-in-95", className)}>
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            )}
            <div className="p-4 sm:p-6">{children}</div>
        </div>
    );
}

interface DialogHeaderProps {
    children: ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
    return <div className="space-y-2">{children}</div>;
}

interface DialogTitleProps {
    children: ReactNode;
    className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
    return <h2 className={cn("text-xl font-semibold text-card-foreground", className)}>{children}</h2>;
}

interface DialogDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
    return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}
