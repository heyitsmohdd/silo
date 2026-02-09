import { LogOut } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }: LogoutConfirmationModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm w-full p-0 overflow-hidden">
                <div className="p-6 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
                        <LogOut className="w-6 h-6 text-zinc-400" />
                    </div>

                    {/* Typography */}
                    <h2 className="text-xl font-bold text-white mb-2">Log out?</h2>
                    <p className="text-zinc-400 text-sm mb-6">
                        Are you sure you want to log out of your account?
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
                            className="flex-1 bg-white hover:bg-zinc-200 text-black border-none"
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default LogoutConfirmationModal;
