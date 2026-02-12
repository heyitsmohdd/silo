import { AlertTriangle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    /** Text for the confirm button. Defaults to "Confirm" */
    confirmText?: string;
    /** Text for the cancel button. Defaults to "Cancel" */
    cancelText?: string;
    /** Visual style variant. Defaults to "danger" */
    variant?: 'danger' | 'warning' | 'info';
    /** specifices if the action is currently loading */
    isLoading?: boolean;
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
}: ConfirmationModalProps) => {

    // Variant styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    iconBg: 'bg-red-500/10',
                    iconColor: 'text-red-500',
                    confirmBtn: 'bg-red-600 hover:bg-red-700 text-white border-none',
                    border: 'border-red-500/50'
                };
            case 'warning':
                return {
                    iconBg: 'bg-yellow-500/10',
                    iconColor: 'text-yellow-500',
                    confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white border-none',
                    border: 'border-yellow-500/50'
                };
            default:
                return {
                    iconBg: 'bg-blue-500/10',
                    iconColor: 'text-blue-500',
                    confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white border-none',
                    border: 'border-blue-500/50'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`bg-zinc-900 max-w-md w-full p-0 overflow-hidden border ${styles.border}`}>
                <div className="p-6 flex flex-col items-center text-center">
                    {/* Icon Area */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.iconBg}`}>
                        <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-6">
                        <h2 className="text-xl font-bold text-white">
                            {title}
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex w-full gap-3">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 border border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 min-w-[100px] ${styles.confirmBtn}`}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                confirmText
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;
