import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in-0">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
                onClick={() => onOpenChange(false)}
            />

            {/* Dialog Content */}
            <div className="relative z-50 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200">
                {children}
            </div>
        </div>
    );
}

interface DialogContentProps {
    children: ReactNode;
    onClose?: () => void;
}

export function DialogContent({ children, onClose }: DialogContentProps) {
    return (
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>
            )}
            <div className="p-6">{children}</div>
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
}

export function DialogTitle({ children }: DialogTitleProps) {
    return <h2 className="text-xl font-semibold text-card-foreground">{children}</h2>;
}

interface DialogDescriptionProps {
    children: ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
    return <p className="text-sm text-muted-foreground">{children}</p>;
}
