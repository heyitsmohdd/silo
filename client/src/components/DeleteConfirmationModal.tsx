import { TriangleAlert } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-zinc-900 border-red-500/50 max-w-md w-full p-0 overflow-hidden">
                <div className="p-6 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <TriangleAlert className="w-6 h-6 text-red-500" />
                    </div>

                    {/* Typography */}
                    <h2 className="text-xl font-bold text-white mb-2">Delete your account?</h2>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        You are about to permanently delete your account and all messages. This action cannot be undone.
                    </p>

                    {/* Buttons */}
                    <div className="flex w-full gap-3">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 border border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none"
                        >
                            Yes, Delete Everything
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmationModal;
