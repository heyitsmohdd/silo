import { useState, type FormEvent } from 'react';
import { User, Save, X, AlertTriangle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axiosClient from '@/lib/axios';

interface EditProfileModalProps {
    user: {
        userId: string;
        email: string;
        role: string;
        year: number;
        branch: string;
        firstName?: string | null;
    };
    onClose: () => void;
    onSuccess: () => void;
}

const EditProfileModal = ({ user, onClose, onSuccess }: EditProfileModalProps) => {
    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [username, setUsername] = useState(''); // For future username editing
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await axiosClient.put('/auth/profile', {
                email: email.trim(),
                firstName: firstName.trim(),
                // Note: Backend doesn't support username updates yet
                // username field needs to be added to User model in schema.prisma
                ...(username.trim() && { username: username.trim() }),
            });
            onSuccess();
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || err.message || 'Failed to update profile. Please try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="w-full max-w-md bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-500/10 rounded-lg">
                                <User className="w-5 h-5 text-violet-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">
                                    Edit Profile
                                </h2>
                                <p className="text-sm text-zinc-400">
                                    Update your account information
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-400" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Global Error */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-sm text-red-400">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Username */}
                        <div className="space-y-2">
                            <Input
                                label="Username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Click to edit username"
                                disabled={isLoading}
                            />

                            {/* 6-Month Warning */}
                            {username.length > 0 && (
                                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-amber-200">
                                        Usernames can only be changed once every 6 months. Last changed: Never
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Email */}
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="student@university.edu"
                            required
                            disabled={isLoading}
                        />

                        {/* First Name (Optional) */}
                        <Input
                            label="First Name (Optional)"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            disabled={isLoading}
                        />

                        {/* Read-only Fields */}
                        <div className="space-y-3 p-4 bg-zinc-800/40 rounded-lg border border-zinc-800">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-400">Role</span>
                                <span className="text-sm font-medium capitalize text-zinc-200">
                                    {user.role.toLowerCase()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-400">Year</span>
                                <span className="text-sm font-medium text-zinc-200">
                                    {user.year}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-400">Branch</span>
                                <span className="text-sm font-medium text-zinc-200">
                                    {user.branch}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 border border-zinc-700 hover:border-zinc-600"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-violet-500 hover:bg-violet-600"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditProfileModal;
