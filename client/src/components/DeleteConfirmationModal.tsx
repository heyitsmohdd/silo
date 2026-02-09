import { useState, useEffect } from 'react';
import { TriangleAlert, CheckCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
}

const DeleteConfirmationModal = ({ isOpen, onClose }: DeleteConfirmationModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            // Small delay to prevent flickering while closing
            const timer = setTimeout(() => {
                setIsLoading(false);
                setIsSubmitted(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleDelete = () => {
        setIsLoading(true);
        // Simulate server request
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`bg-zinc-900 max-w-md w-full p-0 overflow-hidden transition-colors duration-500 ${isSubmitted ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
                <div className="p-6 flex flex-col items-center text-center">
                    {/* Icon Area */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${isSubmitted ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                        {isSubmitted ? (
                            <CheckCircle className="w-6 h-6 text-emerald-500 animate-in zoom-in spin-in-90 duration-300" />
                        ) : (
                            <TriangleAlert className="w-6 h-6 text-red-500" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2 mb-6">
                        <h2 className="text-xl font-bold text-white transition-all duration-300">
                            {isSubmitted ? 'Deletion Request Received' : 'Delete your account?'}
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed transition-all duration-300">
                            {isSubmitted
                                ? 'We have received your request. Your account and data will be permanently removed within 2-3 business days.'
                                : 'You are about to permanently delete your account and all messages. This action cannot be undone.'
                            }
                        </p>
                        {isSubmitted && (
                            <p className="text-xs text-zinc-500 animate-in fade-in slide-in-from-bottom-2 delay-150">
                                If you need immediate assistance, contact us at <span className="text-zinc-400 hover:text-white transition-colors cursor-pointer">siloedu00@gmail.com</span>.
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex w-full gap-3">
                        {isSubmitted ? (
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-300 animate-in fade-in slide-in-from-bottom-2 delay-200"
                            >
                                Close
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 border border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none min-w-[140px]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Yes, Delete Everything'
                                    )}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmationModal;
