import { useState, useEffect } from 'react';
import { TriangleAlert, CheckCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { getIdentity } from '@/lib/identity';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
}

const DeleteConfirmationModal = ({ isOpen, onClose }: DeleteConfirmationModalProps) => {
    const { user } = useAuthStore();
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
        if (!user) return;

        const identity = getIdentity(user.userId);
        setIsLoading(true);

        // Construct mailto link
        const recipient = "siloedu00@gmail.com";
        const subject = `DELETE ACCOUNT REQUEST: ${user.userId}`;
        const body = `I want to delete my account.\nMy Username is: ${identity.name}\n\nPlease remove my data.`;

        const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success state
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className={`bg-zinc-900 max-w-md w-full p-0 overflow-hidden transition-colors duration-500 ${isSubmitted ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
                <div className="p-6 flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${isSubmitted ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                        {isSubmitted ? (
                            <CheckCircle className="w-6 h-6 text-emerald-500 animate-in zoom-in spin-in-90 duration-300" />
                        ) : (
                            <TriangleAlert className="w-6 h-6 text-red-500" />
                        )}
                    </div>

                    <div className="space-y-2 mb-6">
                        <h2 className="text-xl font-bold text-white transition-all duration-300">
                            {isSubmitted ? 'Opening your email app...' : 'Delete your account?'}
                        </h2>
                        <p className="text-zinc-400 text-sm leading-relaxed transition-all duration-300">
                            {isSubmitted
                                ? 'Please hit send to finalize your request.'
                                : 'You are about to permanently delete your account and all messages. This action cannot be undone.'
                            }
                        </p>
                    </div>

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
                                        'Yes, Request Deletion'
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
