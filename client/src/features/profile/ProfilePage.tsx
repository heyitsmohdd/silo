import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';

/**
 * ProfilePage Component
 * Displays user information and provides logout functionality
 */
const ProfilePage = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Generate initials from email or userId
    const getInitials = () => {
        if (user.userId) {
            const parts = user.userId.split('@')[0].split('.');
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            }
            return user.userId.substring(0, 2).toUpperCase();
        }
        return 'US';
    };

    // Generate consistent color based on userId
    const getAvatarGradient = () => {
        const hash = user.userId.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        const hue = Math.abs(hash % 360);
        return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 60%))`;
    };

    // Get role badge text
    const getRoleBadge = () => {
        return user.role === 'STUDENT' ? 'Active Student' : 'Professor';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-xl">
                {/* Profile Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-soft-lg overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-start gap-6">
                            {/* Avatar */}
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md flex-shrink-0"
                                style={{ background: getAvatarGradient() }}
                            >
                                {getInitials()}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                                    {user.userId}
                                </h2>

                                {/* Status Badge */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 mt-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                        {getRoleBadge()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-8 space-y-6">
                        <DetailRow label="Email" value={user.userId} />
                        <DetailRow label="Role" value={user.role} />
                        <DetailRow label="Year" value={user.year.toString()} />
                        <DetailRow label="Branch" value={user.branch} />
                    </div>

                    {/* Actions */}
                    <div className="p-8 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
                        <Button
                            variant="destructive"
                            onClick={handleLogout}
                            className="w-full"
                        >
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Additio Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-neutral-500 dark:text-neutral-600">
                        Logged in to Silo
                    </p>
                </div>
            </div>
        </div>
    );
};

// Detail Row Component
interface DetailRowProps {
    label: string;
    value: string;
}

const DetailRow = ({ label, value }: DetailRowProps) => {
    return (
        <div className="flex items-center justify-between py-2">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                {label}
            </span>
            <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 capitalize">
                {value.toLowerCase()}
            </span>
        </div>
    );
};

export default ProfilePage;
